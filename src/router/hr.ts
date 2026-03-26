import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HRDashboard from '../modules/hr/views/HRDashboard.vue'
import EmployeeManagement from '../modules/hr/views/EmployeeManagement.vue'
import LeaveManagement from '../modules/hr/views/LeaveManagement.vue'

export const hrRoutes: RouteRecordRaw[] = [
  {
    path: '/hr',
    component: MainLayout,
    meta: { requiresAuth: true }, // Allow authenticated users, role check handled by backend
    children: [
      {
        path: '',
        name: 'hr-dashboard',
        component: HRDashboard,
        meta: { title: 'HR Dashboard' }
      },
      {
        path: 'employees',
        name: 'hr-employees',
        component: EmployeeManagement,
        meta: { title: 'Employee Management' }
      },
      {
        path: 'leave',
        name: 'hr-leave',
        component: LeaveManagement,
        meta: { title: 'Leave Management' }
      },
      {
        path: 'payroll',
        name: 'hr-payroll',
        component: () => import('../modules/hr/views/PayrollManagement.vue'),
        meta: { title: 'Payroll Engine' }
      },
    ],
  },
]