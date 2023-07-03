import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const productAnalysis: AppRouteModule = {
  path: '/productAnalysis',
  name: 'productAnalysis',
  component: LAYOUT,
  redirect: '/productAnalysis/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'icon-park-solid:analysis',
    title: '分析管理',
    orderNo: 7,
    permission: 'productAnalysis',
  },
  children: [
    {
      path: 'index',
      name: 'analysisPage',
      component: () => import('@/views/productManage/productAnalysis.vue'),
      meta: {
        title: '分析管理',
        icon: 'icon-park-solid:analysis',
        hideMenu: true,
      },
    },
  ],
}

export default productAnalysis
