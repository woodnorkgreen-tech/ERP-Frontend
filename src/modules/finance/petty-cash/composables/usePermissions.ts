import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

// Permission types for petty cash module
export type PettyCashPermission =
  | 'finance.petty_cash.view'
  | 'finance.petty_cash.create_top_up'
  | 'finance.petty_cash.create_disbursement'
  | 'finance.petty_cash.edit_disbursement'
  | 'finance.petty_cash.void_disbursement'
  | 'finance.petty_cash.delete_disbursement'
  | 'finance.petty_cash.view_balance'
  | 'finance.petty_cash.recalculate_balance'
  | 'finance.petty_cash.view_reports'
  | 'finance.petty_cash.export_data'
  | 'finance.petty_cash.upload_excel'
  | 'finance.petty_cash.manage_settings'

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  VIEW: ['finance.petty_cash.view', 'finance.petty_cash.view_balance'],
  CREATE: ['finance.petty_cash.create_top_up', 'finance.petty_cash.create_disbursement'],
  // EDIT explicitly restricted to Super Admin role in the component logic
  REPORTS: ['finance.petty_cash.view_reports', 'finance.petty_cash.export_data']
} as const

// Permission error types
export interface PermissionError {
  code: 'PERMISSION_DENIED' | 'ROLE_INSUFFICIENT' | 'FEATURE_DISABLED'
  message: string
  requiredPermission?: string
  userRole?: string
  suggestedAction?: string
}

export function usePermissions() {
  const { user, permissions: authPermissions, isLoggedIn, fetchPermissions } = useAuth()

  // Computed properties
  const isAuthenticated = computed(() => isLoggedIn.value)

  const userRoles = computed(() => {
    const rolesFromUser = user.value?.roles || []
    const rolesFromPerms = authPermissions.value?.roles || []
    return Array.from(new Set([...rolesFromUser, ...rolesFromPerms]))
  })

  const userRole = computed(() => userRoles.value[0] || 'viewer')

  const userPermissions = computed(() => {
    return authPermissions.value?.user_permissions || []
  })

  // Permission checking methods
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated.value) return false

    // Destructive/History-modifying actions are strictly for Super Admin
    const sensitivePermissions = [
      'finance.petty_cash.edit_disbursement',
      'finance.petty_cash.void_disbursement',
      'finance.petty_cash.delete_disbursement',
      'finance.petty_cash.recalculate_balance',
      'finance.petty_cash.manage_settings'
    ]

    if (sensitivePermissions.includes(permission)) {
      return userRoles.value.includes('Super Admin')
    }

    if (userRoles.value.includes('Super Admin')) return true
    return userPermissions.value.includes(permission)
  }

  const hasAnyPermission = (permissions: ReadonlyArray<string>): boolean => {
    if (!isAuthenticated.value) return false
    if (userRoles.value.includes('Super Admin')) return true
    return permissions.some(permission => userPermissions.value.includes(permission))
  }

  const hasRole = (role: string | string[]): boolean => {
    if (!isAuthenticated.value) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.some(r => userRoles.value.includes(r))
  }

  // Permission group checks
  const canView = computed(() => hasAnyPermission(PERMISSION_GROUPS.VIEW))
  const canCreate = computed(() => hasAnyPermission(PERMISSION_GROUPS.CREATE))
  const canEdit = computed(() => userRoles.value.includes('Super Admin'))
  const canAdmin = computed(() => userRoles.value.includes('Super Admin'))
  const canViewReports = computed(() => hasAnyPermission(PERMISSION_GROUPS.REPORTS))

  // Specific permission checks - Strictly Super Admin for destructive/history-modifying actions
  const canCreateTopUp = computed(() => hasPermission('finance.petty_cash.create_top_up'))
  const canCreateDisbursement = computed(() => hasPermission('finance.petty_cash.create_disbursement'))
  const canEditDisbursement = computed(() => userRoles.value.includes('Super Admin'))
  const canVoidDisbursement = computed(() => userRoles.value.includes('Super Admin'))
  const canDeleteDisbursement = computed(() => userRoles.value.includes('Super Admin'))
  const canViewBalance = computed(() => hasPermission('finance.petty_cash.view_balance'))
  const canRecalculateBalance = computed(() => userRoles.value.includes('Super Admin'))
  const canExportData = computed(() => hasPermission('finance.petty_cash.export_data'))
  const canUploadExcel = computed(() => hasPermission('finance.petty_cash.upload_excel'))
  const canManageSettings = computed(() => userRoles.value.includes('Super Admin'))

  // Permission validation with error handling
  const requirePermission = (permission: string): void => {
    if (!isAuthenticated.value) {
      throw {
        code: 'PERMISSION_DENIED',
        message: 'Authentication required',
        suggestedAction: 'Please log in to continue'
      } as PermissionError
    }

    if (!hasPermission(permission)) {
      throw {
        code: 'PERMISSION_DENIED',
        message: `Permission '${permission}' is required`,
        requiredPermission: permission,
        userRole: userRoles.value.join(', '),
        suggestedAction: 'Contact your administrator for access permissions'
      } as PermissionError
    }
  }

  const requireAnyPermission = (permissions: ReadonlyArray<string>): void => {
    if (!isAuthenticated.value) {
      throw {
        code: 'PERMISSION_DENIED',
        message: 'Authentication required',
        suggestedAction: 'Please log in to continue'
      } as PermissionError
    }

    if (!hasAnyPermission(permissions)) {
      throw {
        code: 'PERMISSION_DENIED',
        message: `One of the following permissions is required: ${permissions.join(', ')}`,
        userRole: userRoles.value.join(', '),
        suggestedAction: 'Contact your administrator for access permissions'
      } as PermissionError
    }
  }

  const getUserFriendlyPermissionName = (permission: string): string => {
    const permissionNames: Record<string, string> = {
      'finance.petty_cash.view': 'View Petty Cash',
      'finance.petty_cash.create_top_up': 'Create Top-ups',
      'finance.petty_cash.create_disbursement': 'Create Disbursements',
      'finance.petty_cash.edit_disbursement': 'Edit Disbursements',
      'finance.petty_cash.void_disbursement': 'Void Disbursements',
      'finance.petty_cash.delete_disbursement': 'Delete Disbursements',
      'finance.petty_cash.view_balance': 'View Balance',
      'finance.petty_cash.recalculate_balance': 'Recalculate Balance',
      'finance.petty_cash.view_reports': 'View Reports',
      'finance.petty_cash.export_data': 'Export Data',
      'finance.petty_cash.upload_excel': 'Upload Excel',
      'finance.petty_cash.manage_settings': 'Manage Settings'
    }

    return permissionNames[permission] || permission
  }

  return {
    // Computed
    isAuthenticated,
    userRole,
    userRoles,
    userPermissions,
    canView,
    canCreate,
    canEdit,
    canAdmin,
    canViewReports,
    canCreateTopUp,
    canCreateDisbursement,
    canEditDisbursement,
    canVoidDisbursement,
    canDeleteDisbursement,
    canViewBalance,
    canRecalculateBalance,
    canExportData,
    canUploadExcel,
    canManageSettings,

    // Methods
    hasPermission,
    hasAnyPermission,
    hasRole,
    requirePermission,
    requireAnyPermission,
    getUserFriendlyPermissionName,
    refreshPermissions: fetchPermissions
  }
}