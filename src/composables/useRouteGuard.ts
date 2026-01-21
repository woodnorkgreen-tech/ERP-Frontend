import { useAuth } from './useAuth'
import { useRouter } from 'vue-router'

// Permission constants (mirroring backend - only implemented permissions)
const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_ASSIGN_ROLE: 'user.assign_role',

  // Role Management
  ROLE_READ: 'role.read',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',

  // Department Management
  DEPARTMENT_READ: 'department.read',
  DEPARTMENT_CREATE: 'department.create',
  DEPARTMENT_UPDATE: 'department.update',
  DEPARTMENT_DELETE: 'department.delete',
  DEPARTMENT_ACCESS: 'department.access',
  DEPARTMENT_MANAGE: 'department.manage',

  // Employee Management
  EMPLOYEE_READ: 'employee.read',
  EMPLOYEE_CREATE: 'employee.create',
  EMPLOYEE_UPDATE: 'employee.update',
  EMPLOYEE_DELETE: 'employee.delete',

  // Project Management
  PROJECT_READ: 'project.read',
  PROJECT_CREATE: 'project.create',
  PROJECT_UPDATE: 'project.update',
  PROJECT_DELETE: 'project.delete',
  PROJECT_ASSIGN_USERS: 'project.assign_users',
  PROJECT_VIEW_REPORTS: 'project.view_reports',
  PROJECT_CLOSE: 'project.close',

  // Enquiry Management
  ENQUIRY_READ: 'enquiry.read',
  ENQUIRY_CREATE: 'enquiry.create',
  ENQUIRY_UPDATE: 'enquiry.update',

  // Finance Permissions (currently implemented)
  FINANCE_VIEW: 'finance.view',
  FINANCE_BUDGET_READ: 'finance.budget.read',
  FINANCE_BUDGET_UPDATE: 'finance.budget.update',

  // Materials Library
  MATERIALS_VIEW: 'materials-library.view',

  // HR
  HR_VIEW_EMPLOYEES: 'hr.view_employees',

  // Client Service
  CLIENT_READ: 'client.read',
  CLIENT_CREATE: 'client.create',

  // Admin
  ADMIN_ACCESS: 'admin.access',

  // Task Management
  TASK_READ: 'task.read',
  TASK_UPDATE: 'task.update',
  TASK_ASSIGN: 'task.assign',
  TASK_CREATE: 'task.create',
  TASK_DELETE: 'task.delete',
  TASK_COMPLETE: 'task.complete',
  TASK_SKIP: 'task.skip',

  // Dashboard Permissions
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_ADMIN: 'dashboard.admin',
  DASHBOARD_HR: 'dashboard.hr',
  DASHBOARD_FINANCE: 'dashboard.finance',
  DASHBOARD_PROJECTS: 'dashboard.projects',
}

export function useRouteGuard() {
  const { permissions, isLoggedIn, user } = useAuth()
  const router = useRouter()

  // Helper function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!isLoggedIn.value || !user.value) return false

    // Super Admin bypasses all permission checks
    if (user.value.roles?.includes('Super Admin')) return true

    // Check if user has the specific permission in their permissions array
    return permissions.value?.user_permissions?.includes(permission) || false
  }

  const canAccessRoute = (routeName: string): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    switch (routeName) {
      // Admin routes - require admin access permission
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-employees':
      case 'admin-roles':
      case 'admin-departments':
        return hasPermission(PERMISSIONS.ADMIN_ACCESS)

      // HR routes - require HR permissions
      case 'hr-dashboard':
      case 'hr-employees':
        return hasPermission(PERMISSIONS.HR_VIEW_EMPLOYEES)

      // Department-specific routes - Managers, Employees, and Super Admin
      default:
        if (routeName.startsWith('department-')) {
          return hasPermission(PERMISSIONS.DEPARTMENT_READ)
        }
        return true
    }
  }

  const canAccessDepartment = (departmentId: number): boolean => {
    if (!permissions.value?.permissions) return false
    return permissions.value.permissions.accessible_departments.includes(departmentId)
  }

  const canAccessProjects = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check project read permission
    return hasPermission(PERMISSIONS.PROJECT_READ)
  }

  const canAccessClientService = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check client read permission
    return hasPermission(PERMISSIONS.CLIENT_READ)
  }

  const canAccessFinance = (): boolean => {
    if (!isLoggedIn.value || !user.value) {
      return false
    }

    // Super Admin can access everything
    if (user.value.roles?.includes('Super Admin')) {
      return true
    }

    // Check for actual petty cash permissions (the only implemented finance feature)
    return hasPermission(PERMISSIONS.FINANCE_VIEW) ||
      hasPermission(PERMISSIONS.FINANCE_BUDGET_READ) ||
      hasPermission(PERMISSIONS.FINANCE_BUDGET_UPDATE)
  }

  const redirectToAppropriateRoute = () => {
    if (!isLoggedIn.value || !user.value) {
      router.push('/login')
      return
    }

    const userRoles = user.value.roles || []

    // Super Admin goes to super admin dashboard
    if (userRoles.includes('Super Admin')) {
      router.push('/super-admin')
      return
    }

    // Admin goes to admin dashboard
    if (userRoles.includes('Admin')) {
      router.push('/admin')
      return
    }

    // HR goes to HR dashboard
    if (userRoles.includes('HR')) {
      router.push('/hr')
      return
    }

    // Project Managers and Project Officers go to projects dashboard
    if (userRoles.includes('Project Manager') || userRoles.includes('Project Officer')) {
      router.push('/projects/dashboard')
      return
    }

    // Client Service users go to client service dashboard
    if (userRoles.includes('Client Service')) {
      router.push('/client-service')
      return
    }

    // Production users go to Production module
    if (userRoles.includes('Production')) {
      router.push('/production/work-orders')
      return
    }

    // Logistics, Stores, and Procurement users go to projects dashboard
    // (temporary until their dedicated modules are developed)
    if (userRoles.includes('Logistics') ||
      userRoles.includes('Stores') ||
      userRoles.includes('Designer') ||
      userRoles.includes('Procurement')) {
      router.push('/projects/dashboard')
      return
    }

    // Finance goes to finance dashboard
    if (userRoles.includes('Accounts') || userRoles.includes('Costing')) {
      router.push('/finance')
      return
    }

    // Department users go to their department
    if ((userRoles.includes('Manager') || userRoles.includes('Employee')) && permissions.value?.permissions?.user_department) {
      router.push(`/department/${permissions.value.permissions.user_department.id}`)
      return
    }

    // Fallback to HR dashboard
    router.push('/hr')
  }

  const getAllowedRoutes = () => {
    if (!user.value) return []

    const userRoles = user.value.roles || []
    const routes = []

    // Super Admin gets everything categorized by departments
    if (userRoles.includes('Super Admin')) {
      routes.push(
        {
          department: 'Super Admin',
          routes: [
            { name: 'super-admin-dashboard', path: '/super-admin', label: 'Super Admin Dashboard', icon: 'mdi-crown' }
          ]
        },
        {
          department: 'Administration',
          routes: [
            { name: 'admin-dashboard', path: '/admin', label: 'Admin Dashboard', icon: 'mdi-view-dashboard' },
            { name: 'admin-users', path: '/admin/users', label: 'User Management', icon: 'mdi-account-group' },
            { name: 'admin-employees', path: '/admin/employees', label: 'Employee Management', icon: 'mdi-account-hard-hat' },
            { name: 'admin-roles', path: '/admin/roles', label: 'Role Management', icon: 'mdi-shield-check' },
            { name: 'admin-departments', path: '/admin/departments', label: 'Department Management', icon: 'mdi-office-building' }
          ]
        },
        {
          department: 'Human Resources',
          routes: [
            { name: 'hr-dashboard', path: '/hr', label: 'HR Dashboard', icon: 'mdi-account-group' },
            { name: 'hr-employees', path: '/hr/employees', label: 'Employee Management', icon: 'mdi-account-hard-hat' }
          ]
        },
        {
          department: 'Projects',
          routes: [
            { name: 'projects-dashboard', path: '/projects/dashboard', label: 'Project Dashboard', icon: 'mdi-chart-line' },
            { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Project Enquiries', icon: 'mdi-file-document-edit' }
          ]
        },
        {
          department: 'Client Service',
          routes: [
            { name: 'client-service-dashboard', path: '/client-service', label: 'Client Service Dashboard', icon: 'mdi-monitor-dashboard' },
            { name: 'client-service-clients', path: '/client-service/clients', label: 'Client Management', icon: 'mdi-account-multiple' },
            { name: 'client-service-leads', path: '/client-service/leads', label: 'Public Leads', icon: 'mdi-magnet' },
            { name: 'client-service-enquiries', path: '/client-service/enquiries', label: 'Enquiry Management', icon: 'mdi-fountain-pen-tip' }
          ]
        },
        {
          department: 'Production',
          routes: [
            { name: 'production-work-orders', path: '/production/work-orders', label: 'Work Orders', icon: 'mdi-factory' }
          ]
        },
        {
          department: 'Finance',
          routes: [
            { name: 'finance-dashboard', path: '/finance', label: 'Petty Cash Dashboard', icon: 'mdi-wallet' },
            { name: 'finance-petty-cash', path: '/finance/petty-cash', label: 'Petty Cash Management', icon: 'mdi-cash-multiple' },
            { name: 'finance-petty-cash-reports', path: '/finance/petty-cash/reports', label: 'Petty Cash Reports', icon: 'mdi-file-chart' }
          ]
        },
        {
          department: 'Stores & Inventory',
          routes: [
            { name: 'stores-dashboard', path: '/stores/dashboard', label: 'Stores Dashboard', icon: 'mdi-view-dashboard-variant' },
            { name: 'stores-materials-library', path: '/stores/materials-library', label: 'Materials Library', icon: 'mdi-library-shelves' },
            { name: 'stores-check-in', path: '/stores/check-in', label: 'Check Inns (GRN)', icon: 'mdi-package-variant-closed' },
            { name: 'stores-check-out', path: '/stores/check-out', label: 'Check Outs (Issues)', icon: 'mdi-truck-delivery' },
            { name: 'stores-returns', path: '/stores/returns', label: 'Stock Returns', icon: 'mdi-keyboard-return' },
            { name: 'stores-defective', path: '/stores/defective', label: 'Defective & Repairs', icon: 'mdi-alert-circle-outline' },
            { name: 'stores-alerts', path: '/stores/alerts', label: 'Inventory Alerts', icon: 'mdi-bell-ring-outline' }
          ]
        },
        {
          department: 'Procurement',
          routes: [
            { name: 'procurement-dashboard', path: '/procurement/dashboard', label: 'Procurement Dashboard', icon: 'mdi-shopping' },
            { name: 'procurement-suppliers', path: '/procurement/suppliers', label: 'Suppliers & Vendors', icon: 'mdi-account-star-outline' },
            { name: 'procurement-requisitions', path: '/procurement/requisitions', label: 'Stock Requisitions', icon: 'mdi-file-plus-outline' },
            { name: 'procurement-purchase-orders', path: '/procurement/purchase-orders', label: 'Purchase Orders (LPOs)', icon: 'mdi-file-sign' },
            { name: 'procurement-goods-receipt', path: '/procurement/goods-receipt', label: 'Goods Receipt Notes', icon: 'mdi-clipboard-check-outline' },
            { name: 'procurement-billing', path: '/procurement/billing', label: 'Billing', icon: 'mdi-clipboard-check-outline' }
          ]
        }
      )
    }
    // Admin gets admin routes
    else if (userRoles.includes('Admin')) {
      routes.push(
        { name: 'admin-dashboard', path: '/admin', label: 'Admin Dashboard', icon: 'mdi-view-dashboard' },
        { name: 'admin-users', path: '/admin/users', label: 'User Management', icon: 'mdi-account-group' },
        { name: 'admin-employees', path: '/admin/employees', label: 'Employee Management', icon: 'mdi-account-hard-hat' },
        { name: 'admin-roles', path: '/admin/roles', label: 'Role Management', icon: 'mdi-shield-check' },
        { name: 'admin-departments', path: '/admin/departments', label: 'Department Management', icon: 'mdi-office-building' }
      )
    }
    // HR gets HR routes + Projects access
    else if (userRoles.includes('HR')) {
      routes.push(
        { name: 'hr-dashboard', path: '/hr', label: 'HR Dashboard', icon: 'mdi-account-group' },
        { name: 'hr-employees', path: '/hr/employees', label: 'Employee Management', icon: 'mdi-account-hard-hat' },
        { name: 'projects-dashboard', path: '/projects/dashboard', label: 'Project Dashboard', icon: 'mdi-chart-line' },
        // { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Project Enquiries', icon: 'mdi-file-document-edit' }
      )
    }

    // Add projects routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessProjects() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'projects-dashboard', path: '/projects/dashboard', label: 'Project Dashboard', icon: 'mdi-chart-line' },
        { name: 'projects-enquiries', path: '/projects/enquiries', label: 'Project Enquiries', icon: 'mdi-file-document-edit' },
      )
    }

    // Add client service routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessClientService() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'client-service-dashboard', path: '/client-service', label: 'Client Service Dashboard', icon: 'mdi-monitor-dashboard' },
        { name: 'client-service-clients', path: '/client-service/clients', label: 'Client Management', icon: 'mdi-account-multiple' },
        { name: 'client-service-leads', path: '/client-service/leads', label: 'Public Leads', icon: 'mdi-magnet' },
        { name: 'client-service-enquiries', path: '/client-service/enquiries', label: 'Enquiry Management', icon: 'mdi-fountain-pen-tip' }
      )
    }

    // Add production routes for authorized users (skip for Super Admin as they're already included in departments)
    if (userRoles.includes('Production') && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'production-work-orders', path: '/production/work-orders', label: 'Work Orders', icon: 'mdi-factory' }
      )
    }

    // Add finance routes for authorized users (skip for Super Admin as they're already included in departments)
    if (canAccessFinance() && !userRoles.includes('Super Admin')) {
      routes.push(
        { name: 'finance-dashboard', path: '/finance', label: 'Finance Dashboard', icon: 'mdi-wallet' },
        { name: 'finance-petty-cash', path: '/finance/petty-cash', label: 'Petty Cash', icon: 'mdi-cash-multiple' },
        { name: 'finance-petty-cash-reports', path: '/finance/petty-cash/reports', label: 'Petty Cash Reports', icon: 'mdi-file-chart' }
      )
    }

    return routes
  }

  const getPanelTitle = (): string => {
    if (!user.value) return 'ERP System'

    const userRoles = user.value.roles || []

    // Super Admin
    if (userRoles.includes('Super Admin')) {
      return 'Super Admin Panel'
    }

    // Admin
    if (userRoles.includes('Admin')) {
      return 'Admin Panel'
    }

    // HR
    if (userRoles.includes('HR')) {
      return 'HR Panel'
    }

    // Check feature access in priority order
    if (canAccessProjects()) {
      return 'Projects Dashboard'
    }

    if (canAccessClientService()) {
      return 'Client Service Panel'
    }

    if (canAccessFinance()) {
      return 'Finance Panel'
    }


    // Department fallback
    if (permissions.value?.permissions?.user_department) {
      return permissions.value.permissions.user_department.name
    }

    return 'ERP System'
  }

  const getPanelSubtitle = (): string => {
    if (!user.value) return 'Management Dashboard'

    const userRoles = user.value.roles || []

    // Super Admin
    if (userRoles.includes('Super Admin')) {
      return 'Full System Access'
    }

    // Admin
    if (userRoles.includes('Admin')) {
      return 'System Administration'
    }

    // HR
    if (userRoles.includes('HR')) {
      return 'Human Resources'
    }

    // Check feature access in priority order
    if (canAccessProjects()) {
      return 'Project Coordination'
    }

    if (canAccessClientService()) {
      return 'Client Acquisition & Marketing'
    }

    if (canAccessFinance()) {
      return 'Financial Management'
    }


    // Department fallback
    if (permissions.value?.permissions?.user_department) {
      return 'Department Dashboard'
    }

    return 'Management Dashboard'
  }

  return {
    canAccessRoute,
    canAccessDepartment,
    canAccessProjects,
    canAccessClientService,
    canAccessFinance,
    canAccessMaterialsLibrary: () => isLoggedIn.value,
    redirectToAppropriateRoute,
    getAllowedRoutes,
    getPanelTitle,
    getPanelSubtitle
  }
}
