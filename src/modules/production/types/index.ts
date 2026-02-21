export interface User {
  id: number
  name: string
  email: string
}

// Time tracking entry for production job cards
export interface TimeEntry {
  id: number
  job_card_id?: number
  technician_id?: number
  work_description?: string
  clock_in: string
  clock_out?: string | null
  hours_worked?: number
  break_minutes?: number
}

export interface Project {
  id: number
  project_id: string
  enquiry_id: number | null
  start_date: string | null
  end_date: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface ProjectEnquiry {
  id: number
  job_number: string
  title: string
  client_name: string
  project_officer?: User
  client?: {
    id: number
    full_name?: string
    company_name?: string
    contact_person?: string
  }
}

export interface EnquiryTask {
  id: number
  title: string
  description: string
  status: string
}

export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent'
export type WorkOrderCategory = 'in_progress' | 'approved' | 'completed'

export interface WorkOrder {
  id: number
  work_order_number: string
  enquiry_task_id: number | null
  project_enquiry_id: number | null
  project_id: number | null
  title: string
  specifications: string | null
  quantity: number
  status: WorkOrderStatus
  status_category: WorkOrderCategory
  priority: WorkOrderPriority
  due_date?: string | null
  started_at?: string | null
  completed_at?: string | null
  assigned_to?: number | null
  created_by?: number | null
  workflow_completed_steps?: string[] | null
  created_at?: string
  updated_at?: string
  client_name?: string
  projectEnquiry?: ProjectEnquiry
  project?: Project
  enquiryTask?: EnquiryTask
  assignedTo?: User
  createdBy?: User
  project_officer_name?: string
}

export interface CreateWorkOrderPayload {
  work_order_number: string
  enquiry_task_id?: number | null
  project_enquiry_id?: number | null
  project_id?: number | null
  title: string
  specifications?: string | null
  quantity: number
  status: WorkOrderStatus
  priority: WorkOrderPriority
  due_date?: string | null
  assigned_to?: number | null
}

export interface UpdateWorkOrderPayload {
  title?: string
  specifications?: string | null
  quantity?: number
  status?: WorkOrderStatus
  priority?: WorkOrderPriority
  due_date?: string | null
  started_at?: string | null
  completed_at?: string | null
  assigned_to?: number | null
  workflow_completed_steps?: string[]
}

export interface WorkOrderFilters {
  status?: WorkOrderStatus
  priority?: WorkOrderPriority
  project_enquiry_id?: number
  project_id?: number
  assigned_to?: number
  search?: string
  page?: number
  per_page?: number
}

export interface WorkOrderListResponse {
  success: boolean
  data: {
    current_page: number
    data: WorkOrder[]
    per_page: number
    total: number
  }
}

export interface WorkOrderResponse {
  success: boolean
  message?: string
  data: WorkOrder
}

// Daily Job Card Types
export type JobCardStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected'

export interface Technician {
  id: number | string
  name: string
  email: string
  employee_number: string
  hourly_rate: number
  skills: string[]
  is_active: boolean
  first_name: string
  last_name: string
  department: string
  full_name?: string
  source?: 'employee' | 'technical_labour'
  specialization?: string
  day_rate?: number
}

export interface WorkCenter {
  id: number
  name: string
  type: 'fabrication' | 'assembly' | 'finishing' | 'painting' | 'electrical' | 'other'
  location: string
  capacity: number
}

export interface DailyTask {
  id: number
  job_card_id: number
  description: string
  work_order_id?: number | null
  start_time: string
  end_time: string
  hours_worked: number
  notes?: string
  created_at: string
  updated_at: string
  workOrder?: WorkOrder
}

export interface DailyIssue {
  id: number
  job_card_id: number
  description: string
  resolution?: string
  resolved_at?: string
  status: string
  created_at: string
  updated_at: string
}

export interface MaterialRequirement {
  id: number
  job_card_id: number
  material_name: string
  quantity_used?: number
  quantity_required?: number
  quantity_issued?: number
  unit: string
  unit_cost?: number
  notes?: string
  created_at: string
  updated_at: string
}

// Daily Job Card (for time tracking)
export interface JobCard {
  id: number
  public_token?: string
  job_card_number?: string
  worker_id: number
  date: string
  clock_in_time?: string
  clock_out_time?: string
  total_hours: number
  overtime_hours: number
  status: JobCardStatus
  approved_by?: number
  approved_at?: string
  notes?: string
  created_at: string
  updated_at: string
  worker?: Technician
  approver?: User
  tasks?: DailyTask[]
  issues?: DailyIssue[]
  material_requirements?: MaterialRequirement[]
}

// Production Job Card (for manufacturing operations)
export interface ProductionJobCard {
  id: number
  job_card_number: string
  operation_description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'planned' | 'released' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
  workOrder?: WorkOrder
  fabrication_type?: string
  workCenter?: WorkCenter
  assignedTechnician?: Technician
  planned_hours?: number
  setup_time?: number
  actual_hours?: number
  scheduled_start_date?: string
  scheduled_end_date?: string
  time_entries?: TimeEntry[]
  quality_checks?: any[]
  material_requirements?: MaterialRequirement[]
}

export interface CreateJobCardPayload {
  worker_id: number
  date: string
  clock_in_time?: string
  clock_out_time?: string
  notes?: string
  tasks?: Omit<DailyTask, 'id' | 'job_card_id' | 'created_at' | 'updated_at' | 'workOrder'>[]
  issues?: Omit<DailyIssue, 'id' | 'job_card_id' | 'created_at' | 'updated_at'>[]
}

export interface UpdateJobCardPayload {
  worker_id?: number
  date?: string
  clock_in_time?: string
  clock_out_time?: string
  notes?: string
  tasks?: Omit<DailyTask, 'id' | 'job_card_id' | 'created_at' | 'updated_at' | 'workOrder'>[]
  issues?: Omit<DailyIssue, 'id' | 'job_card_id' | 'created_at' | 'updated_at'>[]
}

export interface JobCardFilters {
  worker_id?: number
  date_from?: string
  date_to?: string
  status?: JobCardStatus
  search?: string
  page?: number
  per_page?: number
}

export interface JobCardListResponse {
  success: boolean
  data: {
    current_page: number
    data: JobCard[]
    per_page: number
    total: number
  }
}

export interface JobCardResponse {
  success: boolean
  message?: string
  data: JobCard
}

// Reports Types
export interface TechnicianTimeReport {
  technician_id: number
  technician_name: string
  employee_id: string
  total_hours: number
  regular_hours: number
  overtime_hours: number
  job_cards_completed: number
  efficiency_rating: number
  total_cost: number
  day_rate: number
}

export interface ProductionAnalytics {
  total_job_cards: number
  completed_job_cards: number
  total_labor_hours: number
  total_overtime_hours: number
  total_labor_cost: number
  average_completion_time: number
  technician_utilization: number
  top_performers: Array<{
    technician_id: number
    technician_name: string
    job_cards_completed: number
    total_hours: number
    efficiency_rating: number
  }>
  period: {
    start_date: string
    end_date: string
  }
}

export type NcrSeverity = 'minor' | 'major' | 'critical'
export type NcrStatus = 'open' | 'assigned' | 'in_progress' | 'pending_reinspection' | 'closed' | 'cancelled'

export interface ProductionNcrCode {
  id: number
  code: string
  name: string
  defect_group?: string
  default_severity?: NcrSeverity
  default_stage?: string
  cause_group?: string
}

export interface ProductionNcrReferenceData {
  defect_codes: ProductionNcrCode[]
  root_cause_codes: ProductionNcrCode[]
}

export interface ProductionNcrEvent {
  id: number
  event_type: string
  from_status?: string | null
  to_status?: string | null
  note?: string | null
  performed_at?: string | null
  performer?: {
    id: number
    name: string
  }
}

export interface ProductionNcr {
  id: number
  ncr_number: string
  work_order_id: number
  work_order_rework_id?: number | null
  defect_code_id?: number | null
  root_cause_code_id?: number | null
  source_type: string
  source_ref?: string | null
  raised_by_name?: string | null
  shift?: string | null
  job_order_no?: string | null
  qc_stage?: string | null
  workstation?: string | null
  severity: NcrSeverity
  status: NcrStatus
  description: string
  quantity_affected?: number | null
  failure_description?: string | null
  primary_sop_breached?: string | null
  conformance_type?: string | null
  items_rejected?: number | null
  items_rejected_status?: 'yes' | 'no' | 'delayed' | 'na' | null
  rejects_location?: string | null
  production_impact?: string | null
  client_impacted?: boolean
  immediate_action_taken?: string | null
  root_cause_category?: string | null
  root_cause_description?: string | null
  preventive_action?: string | null
  reinspection_performed?: boolean
  reinspection_performed_status?: 'yes' | 'no' | 'na' | 'other' | null
  reinspection_performed_other?: string | null
  reinspection_results?: string | null
  image_path?: string | null
  image_original_name?: string | null
  image_url?: string | null
  resolution?: string | null
  supervisor_approval?: boolean
  supervisor_approved_by?: number | null
  supervisor_approved_at?: string | null
  containment_action?: string | null
  corrective_action?: string | null
  due_date?: string | null
  detected_at?: string | null
  owner_user_id?: number | null
  is_concession_approved?: boolean
  concession_reason?: string | null
  closed_at?: string | null
  workOrder?: {
    id: number
    work_order_number: string
    title: string
  }
  defectCode?: {
    id: number
    code: string
    name: string
  }
  rootCauseCode?: {
    id: number
    code: string
    name: string
  }
  owner?: {
    id: number
    name: string
  }
  detector?: {
    id: number
    name: string
  }
  events?: ProductionNcrEvent[]
}
