import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const productCode: AppRouteModule = {
  path: '/productCode',
  name: 'productCode',
  component: LAYOUT,
  redirect: '/productCode/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'fluent-mdl2:product-variant',
    title: '商品编号管理',
    orderNo: 2,
  },
  children: [
    {
      path: 'index',
      name: 'codePage',
      component: () => import('@/views/productManage/productCode.vue'),
      meta: {
        title: '商品编号管理',
        icon: 'fluent-mdl2:product-variant',
        hideMenu: true,
      },
    },
  ],
}

export default productCode
