import type { RouteRecordRaw } from 'vue-router'

export const procurementStoresRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '/stores',
                children: [
                    {
                        path: 'dashboard',
                        name: 'stores-dashboard',
                        component: () => import('./views/stores/Dashboard.vue'),
                        meta: { requiresAuth: true, title: 'Stores Dashboard' }
                    },
                    {
                        path: 'materials-library',
                        name: 'stores-materials-library',
                        component: () => import('./views/stores/MaterialsLibrary.vue'),
                        meta: { requiresAuth: true, title: 'Materials Library' }
                    },
                    {
                        path: 'check-in',
                        name: 'stores-check-in',
                        component: () => import('./views/stores/CheckIn.vue'),
                        meta: { requiresAuth: true, title: 'Check In' }
                    },
                    {
                        path: 'batch-check-in',
                        name: 'stores-batch-check-in',
                        component: () => import('./views/stores/BatchCheckIn.vue'),
                        meta: { requiresAuth: true, title: 'Batch Check In' }
                    },
                    {
                        path: 'check-out',
                        name: 'stores-check-out',
                        component: () => import('./views/stores/CheckOut.vue'),
                        meta: { requiresAuth: true, title: 'Check Out' }
                    },
                    {
                        path: 'batch-check-out',
                        name: 'stores-batch-check-out',
                        component: () => import('./views/stores/BatchCheckOut.vue'),
                        meta: { requiresAuth: true, title: 'Batch Check Out' }
                    },
                    {
                        path: 'returns',
                        name: 'stores-returns',
                        component: () => import('./views/stores/Returns.vue'),
                        meta: { requiresAuth: true, title: 'Returns' }
                    },
                    {
                        path: 'defective',
                        name: 'stores-defective',
                        component: () => import('./views/stores/Defective.vue'),
                        meta: { requiresAuth: true, title: 'Defective Items' }
                    },
                    {
                        path: 'alerts',
                        name: 'stores-alerts',
                        component: () => import('./views/stores/Alerts.vue'),
                        meta: { requiresAuth: true, title: 'Alerts' }
                    }
                ]
            },
            {
                path: '/procurement',
                children: [
                    {
                        path: 'dashboard',
                        name: 'procurement-dashboard',
                        component: () => import('./views/procurement/Dashboard.vue'),
                        meta: { requiresAuth: true, title: 'Procurement Dashboard' }
                    },
                    {
                        path: 'suppliers',
                        name: 'procurement-suppliers',
                        component: () => import('./views/procurement/Suppliers.vue'),
                        meta: { requiresAuth: true, title: 'Suppliers' }
                    },
                    {
                        path: 'requisitions',
                        name: 'procurement-requisitions',
                        component: () => import('./views/procurement/Requisitions.vue'),
                        meta: { requiresAuth: true, title: 'Requisitions' }
                    },
                    {
                        path: 'purchase-orders',
                        name: 'procurement-purchase-orders',
                        component: () => import('./views/procurement/PurchaseOrders.vue'),
                        meta: { requiresAuth: true, title: 'Purchase Orders' }
                    },
                    {
                        path: 'goods-receipt',
                        name: 'procurement-goods-receipt',
                        component: () => import('./views/procurement/GoodsReceipt.vue'),
                        meta: { requiresAuth: true, title: 'Goods Receipt' }
                    }
                ]
            }
        ]
    }
]

export default procurementStoresRoutes
