import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const productStyle: AppRouteModule = {
  path: '/productStyle',
  name: 'productStyle',
  component: LAYOUT,
  redirect: '/productStyle/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'fluent-mdl2:product-release',
    title: '商品款式管理',
    orderNo: 3,
    permission: 'productStyle',
  },
  children: [
    {
      path: 'index',
      name: 'stylePage',
      component: () => import('@/views/productManage/productStyle.vue'),
      meta: {
        title: '商品款式管理',
        icon: 'fluent-mdl2:product-release',
        hideMenu: true,
      },
    },
  ],
}

export default productStyle
