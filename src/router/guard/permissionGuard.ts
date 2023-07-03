import type { Router, RouteRecordRaw } from 'vue-router'

import { usePermissionStoreWithOut } from '/@/store/modules/permission'

import { PageEnum } from '/@/enums/pageEnum'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { getCookieToken } from '/@/utils/auth/cookieToken'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'

import { RootRoute } from '/@/router/routes'
import { useGlobSetting } from '/@/hooks/setting'
import { getAuthCache, setAuthCache } from '/@/utils/auth'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, PERMISSION_LIST_KEY } from '/@/enums/cacheEnum'

const { apiUrl } = useGlobSetting()
const LOGIN_PATH = PageEnum.BASE_LOGIN

const ROOT_PATH = RootRoute.path

const whitePathList: PageEnum[] = [LOGIN_PATH]

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()
  router.beforeEach(async (to, from, next) => {
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath)
      return
    }

    const token = userStore.getToken

    // console.log(token)
    // console.log(!token)
    // console.log(Boolean(getAuthCache<string>(TOKEN_KEY)))
    // console.log(Boolean(getCookieToken))

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout
        try {
          await userStore.afterLoginAction()
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/')
            return
          }
        } catch {
          //
        }
      }
      next()
      return
    }

    // token or user does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next()
        return
      }

      console.log('token does not exist')
      await userStore.login()
      next()
      return
    }

    // Jump to the 404 page after processing the login
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
      return
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime === 0) {
      try {
        console.log('get userinfo while last fetch time is empty')
        await userStore.getUserInfoAction()
      } catch (err) {
        next()
        return
      }
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }

    const routes = await permissionStore.buildRoutesAction()

    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)

    permissionStore.setDynamicAddedRoute(true)

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      next(nextData)
    }
  })
}
