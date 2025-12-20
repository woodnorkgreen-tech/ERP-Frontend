// Universal Task System TypeScript Types

export interface User {
  id: number;
  name: string;
  email: string;
  department_id?: number;
  department?: Department;
}

export interface Department {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  task_type?: string;
  status: TaskStatus;
  priority: TaskPriority;
  parent_task_id?: number;
  taskable_type?: string;
  taskable_id?: number;
  department_id?: number;
  assigned_user_id?: number;
  created_by: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  blocked_reason?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  completion_percentage: number;
  subtasks_count?: number;
  created_at: string;
  updated_at: string;

  // Relationships
  department?: Department;
  assignedUser?: User;
  creator: User;
  parentTask?: Task;
  subtasks?: Task[];
  dependencies?: TaskDependency[];
  assignments?: TaskAssignment[];
  issues?: TaskIssue[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  timeEntries?: TaskTimeEntry[];

  // Context data
  logisticsContext?: LogisticsTaskContext;
  designContext?: DesignTaskContext;
  financeContext?: FinanceTaskContext;

  // Polymorphic relationship
  taskable?: any;
}

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'blocked'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// API Response Types
export interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  task_type?: string;
  status: TaskStatus;
  priority: TaskPriority;
  parent_task_id?: number;
  taskable_type?: string;
  taskable_id?: number;
  department_id?: number;
  assigned_user_id?: number;
  creator_id: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  blocked_reason?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  completion_percentage: number;
  created_at: string;
  updated_at: string;

  // Relationships
  assigned_user?: User;
  creator?: User;
  department?: Department;
  parent_task?: TaskResponse;
  subtasks?: TaskResponse[];
  dependencies?: TaskDependencyResponse[];
  assignments?: TaskAssignment[];
  issues?: TaskIssue[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  time_entries?: TaskTimeEntry[];

  // Context data
  logistics_context?: LogisticsTaskContext;
  design_context?: DesignTaskContext;
  finance_context?: FinanceTaskContext;
}

export interface TaskDependencyResponse {
  id: number;
  dependency_type: string;
  depends_on_task?: TaskResponse;
}

// Context Types
export interface LogisticsTaskContext {
  id: number;
  transport_type?: string;
  pickup_location?: string;
  delivery_location?: string;
  special_requirements?: string;
  estimated_distance?: number;
  actual_distance?: number;
  created_at: string;
  updated_at: string;
}

export interface DesignTaskContext {
  id: number;
  design_type?: string;
  specifications?: string;
  reference_files?: string[];
  approval_required?: boolean;
  approved_at?: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface FinanceTaskContext {
  id: number;
  budget_allocated?: number;
  budget_used?: number;
  currency?: string;
  cost_center?: string;
  invoice_required?: boolean;
  payment_terms?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskDependency {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type: 'blocks' | 'relates_to';
  created_at: string;
  updated_at: string;

  // Relationships
  task?: Task;
  dependsOnTask?: Task;
}

export interface TaskAssignment {
  id: number;
  task_id: number;
  user_id: number;
  assigned_by: number;
  assigned_at: string;
  role?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;

  // Relationships
  user: User;
  assignedBy: User;
}

export interface TaskIssue {
  id: number;
  task_id: number;
  title: string;
  description?: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reported_by: number;
  assigned_to?: number;
  reported_at: string;
  resolved_at?: string;
  resolved_by?: number;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;

  // Relationships
  reporter: User;
  assignee?: User;
  resolver?: User;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  parent_comment_id?: number;
  content: string;
  created_at: string;
  updated_at: string;

  // Relationships
  user: User;
  replies?: TaskComment[];
  parentComment?: TaskComment;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  uploaded_by: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  version: number;
  description?: string;
  created_at: string;
  updated_at: string;

  // Relationships
  uploader: User;
}

export interface TaskTimeEntry {
  id: number;
  task_id: number;
  user_id: number;
  hours: number;
  date_worked: string;
  description?: string;
  started_at?: string;
  ended_at?: string;
  is_billable: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Relationships
  user: User;
  task?: Task;
}

export interface TaskTemplate {
  id: number;
  name: string;
  description?: string;
  category?: string;
  version: number;
  previous_version_id?: number;
  is_active: boolean;
  template_data: TaskTemplateData;
  variables?: Record<string, TaskTemplateVariable>;
  tags?: string[];
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;

  // Relationships
  creator: User;
  updater: User;
  previousVersion?: TaskTemplate;
  newerVersions?: TaskTemplate[];
}

export interface TaskTemplateData {
  tasks: TaskTemplateTask[];
  dependencies?: TaskTemplateDependency[];
}

export interface TaskTemplateTask {
  id?: string;
  template_id?: string;
  title: string;
  description?: string;
  task_type?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_hours?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  parent_id?: string;
  due_date_offset_days?: number;
  assigned_user_id?: string; // Variable reference
}

export interface TaskTemplateDependency {
  task_id: string;
  depends_on_task_id: string;
  dependency_type: 'blocks' | 'relates_to';
}

export interface TaskTemplateVariable {
  required?: boolean;
  default?: any;
  description?: string;
}

// Analytics Types
export interface TaskAnalytics {
  summary: {
    total_tasks: number;
    completed_tasks: number;
    in_progress_tasks: number;
    overdue_tasks: number;
    blocked_tasks: number;
    completion_rate: number;
  };
  status_distribution: Record<TaskStatus, number>;
  priority_distribution: Record<TaskPriority, number>;
  department_distribution: Record<string, number>;
  recent_activity: Record<string, number>;
  generated_at: string;
}

export interface TaskKeyMetrics {
  completion_rate: number;
  average_completion_time_hours: number;
  overdue_percentage: number;
  average_tasks_per_user: number;
  time_variance_hours: number;
  issue_rate_per_task: number;
  total_tasks: number;
  generated_at: string;
}

export interface TimeSeriesData {
  period: 'day' | 'week' | 'month';
  days: number;
  data: TimeSeriesPoint[];
  generated_at: string;
}

export interface TimeSeriesPoint {
  period: string;
  created: number;
  completed: number;
  overdue: number;
}

export interface DepartmentAnalytics {
  departments: DepartmentAnalyticsItem[];
  generated_at: string;
}

export interface DepartmentAnalyticsItem {
  department_id: number;
  department_name: string;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  blocked_tasks: number;
  completion_rate: number;
  average_completion_time_hours: number;
}

// Filter and Pagination Types
export interface TaskFilters {
  search?: string;
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  task_type?: string | string[];
  department_id?: number | number[];
  assigned_user_id?: number | number[];
  created_by?: number | number[];
  due_date_from?: string;
  due_date_to?: string;
  date_from?: string;
  date_to?: string;
  tags?: string[];
  parent_task_id?: number;
}

export interface PaginationState {
  page: number;
  per_page: number;
  total?: number;
  last_page?: number;
  from?: number;
  to?: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  meta?: {
    pagination: PaginationState;
  };
}

// Form Types
export interface TaskFormData {
  title: string;
  description?: string;
  task_type?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  parent_task_id?: number;
  taskable_type?: string;
  taskable_id?: number;
  department_id?: number;
  assigned_user_id?: number;
  estimated_hours?: number;
  due_date?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TaskIssueFormData {
  title: string;
  description?: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: number;
}

export interface TimeEntryFormData {
  hours: number;
  date_worked: string;
  description?: string;
  started_at?: string;
  ended_at?: string;
  is_billable?: boolean;
}

// Store State Types
export interface TaskStoreState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  pagination: PaginationState;
  sort: SortState;
  loading: {
    tasks: boolean;
    task: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  errors: Record<string, string>;
}

export interface AnalyticsStoreState {
  dashboard: TaskAnalytics | null;
  metrics: TaskKeyMetrics | null;
  timeSeries: TimeSeriesData | null;
  departmentAnalytics: DepartmentAnalytics | null;
  loading: {
    dashboard: boolean;
    metrics: boolean;
    timeSeries: boolean;
    department: boolean;
  };
  errors: Record<string, string>;
}

// Utility Types
export type LoadingState = Record<string, boolean>;
export type ErrorState = Record<string, string>;

// Event Types for Real-time Updates
export interface TaskEvent {
  type: 'created' | 'updated' | 'deleted' | 'assigned' | 'status_changed' | 'comment_added' | 'issue_logged';
  task_id: number;
  data: any;
  timestamp: string;
}

// Export all types
export type {
  User,
  Department,
  Task,
  TaskStatus,
  TaskPriority,
  TaskDependency,
  TaskAssignment,
  TaskIssue,
  TaskComment,
  TaskAttachment,
  TaskTimeEntry,
  TaskTemplate,
  TaskTemplateData,
  TaskTemplateTask,
  TaskTemplateDependency,
  TaskTemplateVariable,
  TaskAnalytics,
  TaskKeyMetrics,
  TimeSeriesData,
  TimeSeriesPoint,
  DepartmentAnalytics,
  DepartmentAnalyticsItem,
  TaskFilters,
  PaginationState,
  SortState,
  ApiResponse,
  PaginatedResponse,
  TaskFormData,
  TaskIssueFormData,
  TimeEntryFormData,
  TaskStoreState,
  AnalyticsStoreState,
  LoadingState,
  ErrorState,
  TaskEvent,
  TaskResponse,
  TaskDependencyResponse,
  LogisticsTaskContext,
  DesignTaskContext,
  FinanceTaskContext,
};