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
                    },
                    {
                        path: 'reports',
                        name: 'stores-reports',
                        component: () => import('./views/stores/Reports.vue'),
                        meta: { requiresAuth: true, title: 'Inventory Reports' }
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
    path: 'goods-receipt-notes',
    name: 'procurement-goods-receipt-notes',
    component: () => import('./views/procurement/GoodsReceiptNoteIndex.vue'),
    meta: { requiresAuth: true, title: 'Goods Receipt Notes' }
},
{
    path: 'goods-receipt-notes/create',  
    name: 'procurement-grn-create',
    component: () => import('./views/procurement/GoodsReceiptNoteCreate.vue'),
    meta: { requiresAuth: true, title: 'Create Goods Receipt Note' }
},
{
    path: 'goods-receipt-notes/:id',  
    name: 'procurement-grn-show',
    component: () => import('./views/procurement/GoodsReceiptNoteShow.vue'),
    meta: { requiresAuth: true, title: 'GRN Details' }
},
{
    path: 'goods-receipt-notes/:id/edit',  
    name: 'procurement-grn-edit',
    component: () => import('./views/procurement/GoodsReceiptNoteEdit.vue'),
    meta: { requiresAuth: true, title: 'Edit Goods Receipt Note' }
},     {
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
                    // {
                    //     path: 'purchase-order/create',
                    //     name: 'procurement-purchase-order-create',
                    //     component: () => import('./views/procurement/PurchaseOrderCreate.vue'),
                    //     meta: { requiresAuth: true, title: 'Create Purchase Order' }
                    // },
                    {
                        path: 'purchase-order/:id',
                        name: 'procurement-purchase-order-show',
                        component: () => import('./views/procurement/PurchaseOrderShow.vue'),
                        meta: { requiresAuth: true, title: 'Purchase Order Details' }
                    },
                    {
  path: "/verify-po/:serial",
  name: "VerifyPO",
  component: () => import("./views/procurement//VerifyPO.vue"),  // ✅ CORRECT (relative path)
  meta: {
    title: "Verify Purchase Order",
    requiresAuth: false  // Allow public access
  }
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
                    },
                    {
                        path: '/procurement/purchase-order/link-from-requisition/:requisitionId',
                        name: 'LinkPurchaseOrder',
                        component: () => import('@/modules/procurement-stores/views/procurement/PurchaseOrderCreate.vue'),
                        meta: { requiresAuth: true }
                    }
                    
                ]
            }
        ]
    }
]

export default procurementStoresRoutes