import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

export const logisticsRoutes: RouteRecordRaw[] = [
    {
        path: '/logistics',
        component: MainLayout,
        meta: {
            requiresAuth: true,
            requiresLogisticsAccess: true
        },
        children: [
            {
                path: 'dashboard',
                name: 'logistics-dashboard',
                component: () => import('./views/LogisticsDashboard.vue'),
                meta: { title: 'Logistics Dashboard' }
            },
            {
                path: 'deliveries',
                name: 'logistics-deliveries',
                component: () => import('./views/Deliveries.vue'),
                meta: { title: 'Delivery Management' }
            },
            {
                path: 'drivers',
                name: 'logistics-drivers',
                component: () => import('./views/Drivers.vue'),
                meta: { title: 'Driver Management' }
            },
            {
                path: 'fleet',
                name: 'logistics-fleet',
                component: () => import('./views/Fleet.vue'),
                meta: { title: 'Fleet Management' }
            },
            {
                path: 'routes',
                name: 'logistics-routes',
                component: () => import('./views/Routes.vue'),
                meta: { title: 'Route Management' }
            },
            {
                path: 'tracking',
                name: 'logistics-tracking',
                component: () => import('./views/Tracking.vue'),
                meta: { title: 'Real-time Tracking' }
            },
        ],
    },
]

export default logisticsRoutes
