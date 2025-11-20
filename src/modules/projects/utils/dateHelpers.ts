/**
 * Format date for display with enhanced error handling
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === 'TBC' || dateString === 'N/A') {
    return 'TBC'
  }

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return 'TBC'
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting date:', dateString, error)
    return 'TBC'
  }
}

/**
 * Format currency for display with error handling
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  try {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0'
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    console.warn('Error formatting currency:', amount, error)
    return '0'
  }
}

/**
 * Check if date is in the past
 */
export const isPastDate = (dateString: string | null | undefined): boolean => {
  if (!dateString || dateString === 'TBC') return false

  try {
    const date = new Date(dateString)
    return date < new Date()
  } catch {
    return false
  }
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === 'TBC') return 'TBC'

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays === -1) return 'Tomorrow'
    if (diffDays < 0) return `In ${Math.abs(diffDays)} days`
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

    return formatDate(dateString)
  } catch {
    return 'TBC'
  }
}


// ============================================================================
// FILE 4: src/modules/projects/composables/useModal.ts
// Create this new file
// =
