import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const productionRoutes: RouteRecordRaw[] = [
  {
    path: '/production',
    component: MainLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'work-orders',
        name: 'production-work-orders',
        component: () => import('../modules/production/views/WorkOrdersView.vue'),
        meta: { title: 'Work Orders' }
      }
    ]
  }
]
