import type { UserInfo } from '/#/store'
import type { ErrorMessageMode } from '/#/axios'
import { defineStore } from 'pinia'
import { store } from '/@/store'
import { RoleEnum } from '/@/enums/roleEnum'
import { PageEnum } from '/@/enums/pageEnum'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, PERMISSION_LIST_KEY } from '/@/enums/cacheEnum'
import { getAuthCache, setAuthCache } from '/@/utils/auth'
import { getCookieToken, setCookieToken } from '/@/utils/auth/cookieToken'
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel'
//import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user'
import { getAuth, getUserInfo, getMenuList, getUsercenterLogout } from '@/api/usercenter'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { router } from '/@/router'
import { usePermissionStore } from '/@/store/modules/permission'
import { RouteRecordRaw } from 'vue-router'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'
import { isArray } from '/@/utils/is'
import { h } from 'vue'
import { useGlobSetting } from '/@/hooks/setting'

const { apiUrl } = useGlobSetting()
interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  roleList: RoleEnum[]
  sessionTimeout?: boolean
  lastUpdateTime: number
  //pm
  system: string
  permissionList: []
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    //pm
    system: 'pm',
    permissionList: [],
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY) || getCookieToken()
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY)
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime
    },
    getPermissionList(state): [] {
      return state.permissionList.length > 0
        ? state.permissionList
        : getAuthCache<[]>(PERMISSION_LIST_KEY)
    },
    getSystem(state): string {
      return state.system
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : '' // for null or undefined value
      setAuthCache(TOKEN_KEY, info)
      setCookieToken(info)
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
      setAuthCache(ROLES_KEY, roleList)
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      setAuthCache(USER_INFO_KEY, info)
    },
    setPermissionList(info: []) {
      this.permissionList = info
      setAuthCache(PERMISSION_LIST_KEY, info)
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.permissionList = []
      this.sessionTimeout = false
    },
    /**
     * @description: login
     */
    async login(): Promise<GetUserInfoModel | null> {
      try {
        const token = await getAuth()
        console.log('auth的token=' + token)
        // save token
        this.setToken(token)
        return this.afterLoginAction(true)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null
      // get user info
      const userInfo = await this.getUserInfoAction()

      const sessionTimeout = this.sessionTimeout
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
          permissionStore.setDynamicAddedRoute(true)
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
      }
      return userInfo
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null
      const userInfo = await getUserInfo({ systemCode: this.getSystem })
      //FIXME 免登陆
      // const userInfo = {
      //   userId: '1',
      //   username: 'admin',
      //   realName: '管理员',
      //   avatar: '',
      //   desc: 'manager',
      //   password: '123456',
      //   token: 'fakeToken1',
      //   //homePath: '/dashboard/analysis',
      //   roles: [
      //     {
      //       roleName: 'Super Admin',
      //       value: 'super',
      //     },
      //   ],
      // }
      // const { roles = [] } = userInfo
      // if (isArray(roles)) {
      //   const roleList = roles.map((item) => item.value) as RoleEnum[]
      //   this.setRoleList(roleList)
      // } else {
      //   userInfo.roles = []
      //   this.setRoleList([])
      // }
      this.setUserInfo(userInfo)
      return userInfo
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await getUsercenterLogout()
        } catch {
          console.log('注销Token失败')
        }
      }
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      goLogin && window.open(apiUrl.split('/usercenter')[0] + '/uums/login', '_self')
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage()
      const { t } = useI18n()
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
