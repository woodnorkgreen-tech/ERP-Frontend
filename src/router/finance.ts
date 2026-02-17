import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const financeRoutes: RouteRecordRaw[] = [
  {
    path: '/finance',
    component: MainLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        redirect: '/finance/petty-cash'
      },
      {
        path: 'petty-cash',
        name: 'finance-petty-cash',
        component: () => import('../modules/finance/petty-cash/views/PettyCashIndex.vue'),
        meta: {
          title: 'Finance & Accounts',
          requiresFinanceAccess: true
        }
      },
      {
        path: 'petty-cash/requisitions',
        name: 'finance-petty-cash-requisitions',
        component: () => import('../modules/finance/petty-cash/views/requisitions/RequisitionIndex.vue'),
        meta: {
          title: 'Petty Cash Requisition'
        }
      },
      {
        path: 'petty-cash/requisitions/new',
        name: 'finance-petty-cash-requisitions-new',
        component: () => import('../modules/finance/petty-cash/views/requisitions/RequisitionForm.vue'),
        meta: {
          title: 'New Requisition'
        }
      },
      {
        path: 'petty-cash/requisitions/:id',
        name: 'finance-petty-cash-requisitions-show',
        component: () => import('../modules/finance/petty-cash/views/requisitions/RequisitionShow.vue'),
        meta: {
          title: 'Requisition Details'
        }
      },
      {
        path: 'petty-cash/requisitions/:id/edit',
        name: 'finance-petty-cash-requisitions-edit',
        component: () => import('../modules/finance/petty-cash/views/requisitions/RequisitionForm.vue'),
        meta: {
          title: 'Edit Requisition'
        }
      }
    ],
  },
]
