import { TEAM_STATUS } from '@/constants/teamConstants'

/**
 * Get Tailwind CSS classes for status badge
 */
export const getStatusColorClass = (status: string): string => {
  const statusColors: Record<string, string> = {
    [TEAM_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
    [TEAM_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
    [TEAM_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    [TEAM_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    [TEAM_STATUS.ASSIGNED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
  }

  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
}

/**
 * Get human-readable status label
 */
export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    [TEAM_STATUS.COMPLETED]: 'Completed',
    [TEAM_STATUS.IN_PROGRESS]: 'In Progress',
    [TEAM_STATUS.PENDING]: 'Pending',
    [TEAM_STATUS.CANCELLED]: 'Cancelled',
    [TEAM_STATUS.ASSIGNED]: 'Assigned'
  }

  return statusLabels[status] || 'Unknown'
}

/**
 * Get status icon emoji
 */
export const getStatusIcon = (status: string): string => {
  const statusIcons: Record<string, string> = {
    [TEAM_STATUS.COMPLETED]: '✅',
    [TEAM_STATUS.IN_PROGRESS]: '🔄',
    [TEAM_STATUS.PENDING]: '⏳',
    [TEAM_STATUS.CANCELLED]: '❌',
    [TEAM_STATUS.ASSIGNED]: '👤'
  }

  return statusIcons[status] || '❓'
}
