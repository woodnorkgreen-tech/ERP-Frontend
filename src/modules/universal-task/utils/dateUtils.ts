/**
 * Formats a date string or Date object to a readable date format (MM/DD/YYYY)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Formats a date string or Date object to a readable date and time format
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formats a date string or Date object to HTML date input format (yyyy-MM-dd)
 */
export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  return d.toISOString().split('T')[0]
}