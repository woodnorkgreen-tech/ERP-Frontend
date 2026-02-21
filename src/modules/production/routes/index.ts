import type { RouteRecordRaw } from 'vue-router'

export const productionRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/production',
        children: [
          {
            path: 'work-orders',
            name: 'production-work-orders',
            component: () => import('../views/WorkOrdersView.vue'),
            meta: { requiresAuth: true, title: 'Work Orders' }
          },
          {
            path: 'job-cards',
            name: 'production-job-cards',
            component: () => import('../views/JobCardsView.vue'),
            meta: { requiresAuth: true, title: 'Job Cards' }
          },
          {
            path: 'job-cards/:id',
            name: 'production-job-card-details',
            component: () => import('../views/JobCardDetailsView.vue'),
            meta: { requiresAuth: true, title: 'Job Card Details' }
          },
          {
            path: 'reports',
            name: 'production-reports',
            component: () => import('../views/HRReportsView.vue'),
            meta: { requiresAuth: true, title: 'Production Reports' }
          },
          {
            path: 'ncrs',
            name: 'production-ncrs',
            component: () => import('../views/NcrsView.vue'),
            meta: { requiresAuth: true, title: 'NCR Management' }
          },
          {
            path: 'dashboard',
            name: 'production-dashboard',
            component: () => import('../views/ProductionDashboard.vue'),
            meta: { requiresAuth: true, title: 'Production Dashboard' }
          }
        ]
      }
    ]
  }
]
