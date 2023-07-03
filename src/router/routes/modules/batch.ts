import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const batch: AppRouteModule = {
  path: '/batch',
  name: 'batch',
  component: LAYOUT,
  redirect: '/batch/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'carbon:batch-job',
    title: '批量操作',
    orderNo: 6,
    permission: 'batch',
  },
  children: [
    {
      path: 'index',
      name: 'batchPage',
      component: () => import('@/views/productManage/batch.vue'),
      meta: {
        title: '批量操作',
        icon: 'carbon:batch-job',
        hideMenu: true,
      },
    },
  ],
}

export default batch
