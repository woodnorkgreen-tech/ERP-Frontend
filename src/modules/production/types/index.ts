export interface User {
  id: number
  name: string
  email: string
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
  work_order_id?: number
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
  status: 'open' | 'resolved'
  created_at: string
  updated_at: string
}

export interface MaterialRequirement {
  id: number
  job_card_id: number
  material_name: string
  quantity_used: number
  unit: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface JobCard {
  id: number
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
