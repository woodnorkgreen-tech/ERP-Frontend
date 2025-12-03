// Universal Task System Constants

import type { TaskStatus, TaskPriority } from '../types';

// Task Status Constants
export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  pending: {
    label: 'Pending',
    color: 'orange',
    icon: 'pi pi-clock'
  },
  in_progress: {
    label: 'In Progress',
    color: 'blue',
    icon: 'pi pi-play-circle'
  },
  blocked: {
    label: 'Blocked',
    color: 'red',
    icon: 'pi pi-exclamation-triangle'
  },
  review: {
    label: 'Review',
    color: 'purple',
    icon: 'pi pi-eye'
  },
  completed: {
    label: 'Completed',
    color: 'green',
    icon: 'pi pi-check-circle'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'grey',
    icon: 'pi pi-times-circle'
  },
  overdue: {
    label: 'Overdue',
    color: 'red',
    icon: 'pi pi-exclamation-circle'
  }
};

// Task Priority Constants
export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string; icon: string; weight: number }> = {
  low: {
    label: 'Low',
    color: 'green',
    icon: 'pi pi-arrow-down',
    weight: 1
  },
  medium: {
    label: 'Medium',
    color: 'orange',
    icon: 'pi pi-minus',
    weight: 2
  },
  high: {
    label: 'High',
    color: 'red',
    icon: 'pi pi-arrow-up',
    weight: 3
  },
  urgent: {
    label: 'Urgent',
    color: 'red',
    icon: 'pi pi-exclamation-triangle',
    weight: 4
  }
};

// Issue Severity Constants
export const ISSUE_SEVERITIES = {
  low: { label: 'Low', color: 'green', icon: 'pi pi-info-circle' },
  medium: { label: 'Medium', color: 'orange', icon: 'pi pi-exclamation-circle' },
  high: { label: 'High', color: 'orange', icon: 'pi pi-exclamation-triangle' },
  critical: { label: 'Critical', color: 'red', icon: 'pi pi-times-circle' }
} as const;

// Issue Status Constants
export const ISSUE_STATUSES = {
  open: { label: 'Open', color: 'orange', icon: 'pi pi-circle' },
  in_progress: { label: 'In Progress', color: 'blue', icon: 'pi pi-play-circle' },
  resolved: { label: 'Resolved', color: 'green', icon: 'pi pi-check-circle' },
  closed: { label: 'Closed', color: 'grey', icon: 'pi pi-times-circle' }
} as const;

// Dependency Types
export const DEPENDENCY_TYPES = {
  blocks: { label: 'Blocks', description: 'This task must be completed before the dependent task can start' },
  relates_to: { label: 'Relates To', description: 'This task is related to but not blocking the dependent task' }
} as const;

// Time Tracking Constants
export const TIME_ENTRY_DEFAULTS = {
  HOURS_PER_DAY: 8,
  BREAK_DURATION_MINUTES: 60,
  MIN_TIME_ENTRY_MINUTES: 15,
  MAX_TIME_ENTRY_HOURS: 24
} as const;

// Pagination Constants
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
} as const;

// API Constants
export const API_ENDPOINTS = {
  TASKS: 'tasks',
  SUBTASKS: 'tasks/{task}/subtasks',
  COMMENTS: 'tasks/{task}/comments',
  ATTACHMENTS: 'tasks/{task}/attachments',
  ISSUES: 'issues',
  EXPERIENCE_LOGS: 'experience-logs',
  TEMPLATES: 'templates',
  TIME_ENTRIES: 'tasks/{task}/time-entries',
  ANALYTICS: {
    DASHBOARD: 'analytics/dashboard',
    METRICS: 'analytics/metrics',
    TIME_SERIES: 'analytics/time-series',
    DEPARTMENTS: 'analytics/departments'
  },
  SAVED_VIEWS: 'saved-views'
} as const;

// Task Types (can be extended based on business needs)
export const TASK_TYPES = {
  feature: { label: 'Feature Development', icon: 'pi pi-code' },
  bug: { label: 'Bug Fix', icon: 'pi pi-bug' },
  maintenance: { label: 'Maintenance', icon: 'pi pi-wrench' },
  documentation: { label: 'Documentation', icon: 'pi pi-book' },
  research: { label: 'Research', icon: 'pi pi-search' },
  meeting: { label: 'Meeting', icon: 'pi pi-users' },
  review: { label: 'Code Review', icon: 'pi pi-eye' },
  testing: { label: 'Testing', icon: 'pi pi-check-square' },
  deployment: { label: 'Deployment', icon: 'pi pi-cloud-upload' },
  support: { label: 'Support', icon: 'pi pi-question-circle' }
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed'
  ],
  MAX_FILES_PER_TASK: 20
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_STATUS_CHANGED: 'task_status_changed',
  TASK_DUE_SOON: 'task_due_soon',
  TASK_OVERDUE: 'task_overdue',
  ISSUE_LOGGED: 'issue_logged',
  COMMENT_MENTION: 'comment_mention',
  TASK_COMPLETED: 'task_completed'
} as const;

// Chart Colors for Analytics
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#22C55E',
  grey: '#6B7280'
} as const;

// Date Format Constants
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ssZ'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TASK_FILTERS: 'universal_task_filters',
  TASK_VIEW_PREFERENCES: 'universal_task_view_prefs',
  ANALYTICS_DATE_RANGE: 'universal_task_analytics_range',
  USER_PREFERENCES: 'universal_task_user_prefs'
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 5000,
  COMMENT_MAX_LENGTH: 2000,
  HOURS_MIN: 0.01,
  HOURS_MAX: 24,
  TAGS_MAX_COUNT: 10,
  TAGS_MAX_LENGTH: 50
} as const;

// Default Values
export const DEFAULTS = {
  TASK_STATUS: 'pending' as TaskStatus,
  TASK_PRIORITY: 'medium' as TaskPriority,
  PAGINATION_PAGE: 1,
  PAGINATION_PER_PAGE: 25,
  TIME_ENTRY_BILLABLE: false,
  ISSUE_SEVERITY: 'medium',
  SORT_FIELD: 'created_at',
  SORT_DIRECTION: 'desc'
} as const;

// All constants are already exported above