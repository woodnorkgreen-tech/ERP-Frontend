/**
 * Team categories configuration
 */
export const TEAM_CATEGORIES = {
  WORKSHOP: 'workshop',
  SETUP: 'setup',
  SETDOWN: 'setdown'
} as const

export type TeamCategory = typeof TEAM_CATEGORIES[keyof typeof TEAM_CATEGORIES]

/**
 * Category ID mapping for API calls
 */
export const CATEGORY_ID_MAP: Record<TeamCategory, number> = {
  [TEAM_CATEGORIES.WORKSHOP]: 1,
  [TEAM_CATEGORIES.SETUP]: 2,
  [TEAM_CATEGORIES.SETDOWN]: 3
}

/**
 * Category configuration with display information
 */
export const CATEGORY_CONFIG: Record<TeamCategory, {
  id: number
  label: string
  icon: string
}> = {
  [TEAM_CATEGORIES.WORKSHOP]: {
    id: 1,
    label: 'Workshop Teams',
    icon: '🔧'
  },
  [TEAM_CATEGORIES.SETUP]: {
    id: 2,
    label: 'Setup Teams',
    icon: '🏗️'
  },
  [TEAM_CATEGORIES.SETDOWN]: {
    id: 3,
    label: 'Setdown Teams',
    icon: '📦'
  }
}

/**
 * Team status constants
 */
export const TEAM_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type TeamStatus = typeof TEAM_STATUS[keyof typeof TEAM_STATUS]

/**
 * Team tabs configuration
 */
export const TEAM_TABS = [
  { key: TEAM_CATEGORIES.WORKSHOP, label: CATEGORY_CONFIG.workshop.label },
  { key: TEAM_CATEGORIES.SETUP, label: CATEGORY_CONFIG.setup.label },
  { key: TEAM_CATEGORIES.SETDOWN, label: CATEGORY_CONFIG.setdown.label }
] as const

/**
 * Hardcoded team types for each category
 * TODO: Replace with API call in the future
 */
export const TEAM_TYPES = {
  [TEAM_CATEGORIES.WORKSHOP]: [
    { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
    { id: 2, team_type_id: 2, display_name: 'Technicians' },
    { id: 3, team_type_id: 3, display_name: 'Painters' },
    { id: 4, team_type_id: 4, display_name: 'Welders' },
    { id: 5, team_type_id: 5, display_name: 'Electricians' },
    { id: 6, team_type_id: 6, display_name: 'ICT' },
    { id: 7, team_type_id: 7, display_name: 'Loading' },
    { id: 8, team_type_id: 8, display_name: 'Offloading' },
    { id: 9, team_type_id: 9, display_name: 'Carpenters' }
  ],
  [TEAM_CATEGORIES.SETUP]: [
    { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
    { id: 2, team_type_id: 2, display_name: 'Technicians' },
    { id: 3, team_type_id: 3, display_name: 'Painters' },
    { id: 4, team_type_id: 4, display_name: 'Welders' },
    { id: 5, team_type_id: 5, display_name: 'Electricians' },
    { id: 6, team_type_id: 6, display_name: 'ICT' },
    { id: 7, team_type_id: 7, display_name: 'Loading' },
    { id: 8, team_type_id: 8, display_name: 'Offloading' },
    { id: 9, team_type_id: 9, display_name: 'Carpenters' }
  ],
  [TEAM_CATEGORIES.SETDOWN]: [
    { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
    { id: 2, team_type_id: 2, display_name: 'Technicians' },
    { id: 3, team_type_id: 3, display_name: 'Painters' },
    { id: 4, team_type_id: 4, display_name: 'Welders' },
    { id: 5, team_type_id: 5, display_name: 'Electricians' },
    { id: 6, team_type_id: 6, display_name: 'ICT' },
    { id: 7, team_type_id: 7, display_name: 'Loading' },
    { id: 8, team_type_id: 8, display_name: 'Offloading' },
    { id: 9, team_type_id: 9, display_name: 'Carpenters' }
  ]
}

/**
 * Team type display names mapping
 */
export const TEAM_TYPE_NAMES: Record<number, string> = {
  1: 'Pasting Team',
  2: 'Technicians',
  3: 'Painters',
  4: 'Welders',
  5: 'Electricians',
  6: 'ICT',
  7: 'Loading',
  8: 'Offloading',
  9: 'Carpenters'
}
