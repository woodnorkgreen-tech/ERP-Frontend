export interface Requisition {
  id: number
  requisition_number: string
  date: string
  requested_by_type: 'project' | 'office' | 'employee'
  project_id?: number
  project?: {
    id: number
    name: string
  }
  employee_id?: number
  employee?: {
    id: number
    name: string
  }
  department_id?: number
  department?: {
    id: number
    name: string
  }
  urgency: 'normal' | 'urgent'
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed'
  total_amount: number
  items: RequisitionItem[]
  createdBy?: {
    id: number
    first_name: string
    last_name: string
  }
  created_at: string
  updated_at: string
}

export interface RequisitionItem {
  id?: number
  material_id: number
  material?: {
    id: number
    material_code: string
    material_name: string
  }
  quantity: number
  unit_price: number
  total: number
  purpose: string
  reason?: string
  
  // UI helper fields
  sku_search?: string
  showDropdown?: boolean
  searchResults?: any[]
  loading?: boolean
}

export interface CreateRequisitionData {
  date: string
  requested_by_type: 'project' | 'office' | 'employee'
  project_id?: number
  employee_id?: number
  department_id?: number
  urgency: 'normal' | 'urgent'
  items: RequisitionItem[]
}

export interface RequisitionFilters {
  searchTerm?: string
  status?: string
  urgency?: string
  requested_by_type?: string
  page?: number
}