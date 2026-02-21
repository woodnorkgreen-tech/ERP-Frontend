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
      },
      {
        path: 'work-orders/:id',
        name: 'production-work-order-details',
        component: () => import('../modules/production/views/WorkOrderDetailsView.vue'),
        meta: { title: 'Work Order Details' }
      },
      {
        path: 'job-cards',
        name: 'production-job-cards',
        component: () => import('../modules/production/views/JobCardsView.vue'),
        meta: { title: 'Job Cards' }
      },
      {
        path: 'job-cards/:id',
        name: 'production-job-card-details',
        component: () => import('../modules/production/views/JobCardDetailsView.vue'),
        meta: { title: 'Job Card Details' }
      },
      {
        path: 'reports',
        name: 'production-reports',
        component: () => import('../modules/production/views/HRReportsView.vue'),
        meta: { title: 'Production Reports' }
      },
      {
        path: 'ncrs',
        name: 'production-ncrs',
        component: () => import('../modules/production/views/NcrsView.vue'),
        meta: { title: 'NCR Management' }
      },
      {
        path: 'dashboard',
        name: 'production-dashboard',
        component: () => import('../modules/production/views/ProductionDashboard.vue'),
        meta: { title: 'Production Dashboard' }
      }
    ]
  }
]
