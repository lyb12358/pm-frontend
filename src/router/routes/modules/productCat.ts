import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const productCat: AppRouteModule = {
  path: '/productCat',
  name: 'productCat',
  component: LAYOUT,
  redirect: '/productCat/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ri:node-tree',
    title: '类别管理',
    orderNo: 5,
    permission: 'productCat',
  },
  children: [
    {
      path: 'index',
      name: 'catPage',
      component: () => import('@/views/productManage/productCat.vue'),
      meta: {
        title: '类别管理',
        icon: 'ri:node-tree',
        hideMenu: true,
      },
    },
  ],
}

export default productCat
