import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const home: AppRouteModule = {
  path: '/home',
  name: 'Index',
  component: LAYOUT,
  redirect: '/home/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'material-symbols:home',
    title: '主页',
    orderNo: 1,
  },
  children: [
    {
      path: 'index',
      name: 'IndexPage',
      component: () => import('@/views/home/index.vue'),
      meta: {
        affix: true,
        title: '主页',
        icon: 'material-symbols:home',
        hideMenu: true,
      },
    },
  ],
}

export default home
