import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import modular routes
import { mainRoutes } from './main'
import { adminRoutes } from './admin'
import { hrRoutes } from './hr'
import { projectsRoutes } from './projects'
import { clientServiceRoutes } from './clientService'
import { productionRoutes } from './production'

import { financeRoutes } from './finance'
import materialsLibraryRoutes from '@/modules/materials-library/routes'
import procurementStoresRoutes from '@/modules/procurement-stores/routes'

// Combine all routes
const routes: RouteRecordRaw[] = [
  {
    path: '/leads/new',
    name: 'public-lead-capture',
    component: () => import('../views/public/PublicLeadForm.vue'),
    meta: {
      requiresAuth: false,
      title: "Let's Build Together | Woodnork Green"
    }
  },
  {
    path: '/handover/:token',
    name: 'client-handover',
    component: () => import('../views/public/ClientHandoverView.vue'),
    meta: { requiresAuth: false }
  },

  ...mainRoutes,
  ...adminRoutes,
  ...hrRoutes,
  ...projectsRoutes,
  ...clientServiceRoutes,
  ...productionRoutes,

  ...financeRoutes,
  ...materialsLibraryRoutes,
  ...procurementStoresRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Simple token-based authentication check
    const token = localStorage.getItem('auth_token')
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

    if (!token || !isLoggedIn) {
      next('/login')
      return
    }
  }

  // Check role-based access - simplified for now
  if (to.meta.requiresRole) {
    // For now, allow access if authenticated
    // Role checking will be handled by components
    const token = localStorage.getItem('auth_token')
    if (!token) {
      next('/login')
      return
    }
  }

  // Check department access
  if (to.meta.requiresDepartment) {
    const { canAccessDepartment } = await import('@/utils/routerGuards')

    const departmentId = parseInt(to.params.departmentId as string)
    if (!(await canAccessDepartment(departmentId))) {
      next('/access-denied')
      return
    }
  }

  // Check projects access
  if (to.meta.requiresProjectsAccess) {
    const { canAccessProjects } = await import('@/utils/routerGuards')

    if (!(await canAccessProjects())) {
      console.log('Access denied to projects - redirecting to appropriate dashboard')
      // Avoid infinite redirect by not redirecting to a projects route
      // Instead, redirect to a safe route based on user permissions
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Redirect to access-denied as a safe fallback
        next('/access-denied')
      } else {
        next('/login')
      }
      return
    }
  }

  // Check client service access
  if (to.meta.requiresClientServiceAccess) {
    const { canAccessClientService } = await import('@/utils/routerGuards')

    if (!(await canAccessClientService())) {
      console.log('Access denied to client service - redirecting to client service dashboard')
      next('/client-service')
      return
    }
  }



  // Check finance access
  if (to.meta.requiresFinanceAccess) {
    const { canAccessFinance } = await import('@/utils/routerGuards')

    if (!(await canAccessFinance())) {
      console.log('Access denied to finance - redirecting to appropriate dashboard')
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Redirect to access-denied as safe fallback
        next('/access-denied')
      } else {
        next('/login')
      }
      return
    }
  }

  // Check specific finance permissions
  if (to.meta.requiresPermission) {
    const { fetchUserData } = await import('@/utils/routerGuards')
    const { userPermissions } = await fetchUserData()

    if (!userPermissions?.includes(to.meta.requiresPermission as string)) {
      console.log(`Access denied - missing permission: ${to.meta.requiresPermission}`)
      next('/access-denied')
      return
    }
  }

  // Check budget access for project budget tasks
  if (to.path.includes('/budget') && to.path.includes('/tasks/')) {
    const { fetchUserData } = await import('@/utils/routerGuards')
    const { userPermissions } = await fetchUserData()

    // Check if user has budget read permission
    const hasBudgetAccess = userPermissions?.includes('finance.budget.read') ||
      userPermissions?.includes('finance.budget.update')

    if (!hasBudgetAccess) {
      console.log('Access denied to budget functionality - user lacks budget permissions')
      next('/access-denied')
      return
    }
  }

  next()
})

export default router
