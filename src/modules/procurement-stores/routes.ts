import type { RouteRecordRaw } from 'vue-router'

export const procurementStoresRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '/procurement',
                children: [
                    {
                        path: 'suppliers',
                        name: 'procurement-suppliers',
                        component: () => import('./views/procurement/SupplierIndex.vue'),
                        meta: { requiresAuth: true, title: 'Suppliers' }
                    },
                    {
                        path: 'supplier/create',
                        name: 'procurement-supplier-create',
                        component: () => import('./views/procurement/SupplierCreate.vue'),
                        meta: { requiresAuth: true, title: 'Add Supplier' }
                    },
                    {
                        path: 'supplier/:id',
                        name: 'procurement-supplier-show',
                        component: () => import('./views/procurement/SupplierShow.vue'),
                        meta: { requiresAuth: true, title: 'Supplier Details' }
                    },
                    {
                        path: 'supplier/:id/edit',
                        name: 'procurement-supplier-edit',
                        component: () => import('./views/procurement/SupplierEdit.vue'),
                        meta: { requiresAuth: true, title: 'Edit Supplier' }
                    },
                    {
                        path: 'requisitions',
                        name: 'procurement-requisitions',
                        component: () => import('./views/procurement/RequisitionIndex.vue'),
                        meta: { requiresAuth: true, title: 'Requisitions' }
                    },
                    {
                        path: 'requisition/create',
                        name: 'procurement-requisition-create',
                        component: () => import('./views/procurement/RequisitionCreate.vue'),
                        meta: { requiresAuth: true, title: 'Create Requisition' }
                    },
                    {
                        path: 'requisition/:id',
                        name: 'procurement-requisition-show',
                        component: () => import('./views/procurement/RequisitionShow.vue'),
                        meta: { requiresAuth: true, title: 'Requisition Details' }
                    },
                    {
                        path: 'requisition/:id/edit',
                        name: 'procurement-requisition-edit',
                        component: () => import('./views/procurement/RequisitionEdit.vue'),
                        meta: { requiresAuth: true, title: 'Edit Requisition' }
                    },
                    {
                        path: 'purchase-orders',
                        name: 'procurement-purchase-orders',
                        component: () => import('./views/procurement/PurchaseOrdersIndex.vue'),
                        meta: { requiresAuth: true, title: 'Purchase Orders' }
                    },
                    {
                        path: 'purchase-order/create',
                        name: 'procurement-purchase-order-create',
                        component: () => import('./views/procurement/PurchaseOrderCreate.vue'),
                        meta: { requiresAuth: true, title: 'Create Purchase Order' }
                    },
                    {
                        path: 'purchase-order/:id',
                        name: 'procurement-purchase-order-show',
                        component: () => import('./views/procurement/PurchaseOrderShow.vue'),
                        meta: { requiresAuth: true, title: 'Purchase Order Details' }
                    },
                    {
                        path: 'purchase-order/:id/edit',
                        name: 'procurement-purchase-order-edit',
                        component: () => import('./views/procurement/PurchaseOrderEdit.vue'),
                        meta: { requiresAuth: true, title: 'Edit Purchase Order' }
                    },
                    {
                        path: 'billing',
                        name: 'procurement-billing',
                        component: () => import('./views/procurement/BillingIndex.vue'),
                        meta: { requiresAuth: true, title: 'Billing' }
                    },
                    {
                        path: 'billing/create',
                        name: 'procurement-billing-create',
                        component: () => import('./views/procurement/BillingCreate.vue'),
                        meta: { requiresAuth: true, title: 'Create Invoice' }
                    },
                    {
                        path: 'billing/:id',
                        name: 'procurement-billing-show',
                        component: () => import('./views/procurement/BillingShow.vue'),
                        meta: { requiresAuth: true, title: 'Invoice Details' }
                    }
                ]
            }
        ]
    }
]

export default procurementStoresRoutes