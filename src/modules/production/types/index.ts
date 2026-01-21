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
  projectOfficer?: User
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
  due_date: string | null
  started_at: string | null
  completed_at: string | null
  assigned_to: number | null
  created_by: number | null
  created_at: string
  updated_at: string
  projectEnquiry?: ProjectEnquiry
  project?: Project
  enquiryTask?: EnquiryTask
  assignedTo?: User
  createdBy?: User
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
