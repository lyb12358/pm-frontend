import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const material: AppRouteModule = {
  path: '/material',
  name: 'material',
  component: LAYOUT,
  redirect: '/material/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'material-symbols:matter',
    title: '物料辅料管理',
    orderNo: 4,
    permission: 'material',
  },
  children: [
    {
      path: 'index',
      name: 'matPage',
      component: () => import('@/views/productManage/material.vue'),
      meta: {
        title: '物料辅料管理',
        icon: 'material-symbols:matter',
        hideMenu: true,
      },
    },
  ],
}

export default material
