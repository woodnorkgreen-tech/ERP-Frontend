// composables/usePermissions.ts
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!authStore.user?.roles) return false
    
    const userRoleNames = authStore.user.roles.map((role: any) => role.name)
    return roleNames.some(roleName => userRoleNames.includes(roleName))
  }

  /**
   * Check if user can approve or delete
   * Only Super Admin, Admin, and Accounts roles
   */
  const canApproveOrDelete = computed(() => {
    return hasAnyRole(['Super Admin', 'Admin', 'Accounts'])
  })

  /**
   * Check if user is Super Admin
   */
  const isSuperAdmin = computed(() => {
    return hasAnyRole(['Super Admin'])
  })

  /**
   * Check if user is Admin (includes Super Admin)
   */
  const isAdmin = computed(() => {
    return hasAnyRole(['Super Admin', 'Admin'])
  })

  /**
   * Check if user has specific role
   */
  const hasRole = (roleName: string): boolean => {
    return hasAnyRole([roleName])
  }

  /**
   * Get current user
   */
  const currentUser = computed(() => authStore.user)

  /**
   * Get user's roles
   */
  const userRoles = computed(() => authStore.user?.roles || [])

  return {
    hasAnyRole,
    hasRole,
    canApproveOrDelete,
    isSuperAdmin,
    isAdmin,
    currentUser,
    userRoles
  }
}