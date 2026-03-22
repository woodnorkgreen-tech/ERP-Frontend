export interface LeaveType {
  id: number
  name: string
  code: string
  days_per_year: number
  monthly_accrual_rate?: number | null
  allow_advance?: boolean
  color: string
  icon: string | null
  description: string | null
  is_active: boolean
  requires_attachment: boolean
  created_at?: string
  updated_at?: string
}

export interface LeaveBalance {
  leave_type_id: number
  name: string
  code: string
  color: string
  icon: string | null
  allocated_days: number
  earned_days?: number
  used_days: number
  pending_days: number
  available_days: number
  requestable_days?: number
  advance_available_days?: number
  allow_advance?: boolean
}

export interface LeaveRequestEmployee {
  id: number
  employee_id: string
  name: string
  position: string
  department?: {
    id: number
    name: string
  }
}

export interface LeaveContactEmployee extends LeaveRequestEmployee {}

export interface LeaveRequest {
  id: number
  employee_id: number
  contact_employee_id?: number | null
  leave_type_id: number
  created_by?: number | null
  approved_by?: number | null
  start_date: string
  end_date: string
  days_requested: number
  session: 'full_day' | 'first_half' | 'second_half'
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  reason: string
  explanation?: string | null
  handover_notes?: string | null
  attachment_path?: string | null
  review_notes?: string | null
  approved_at?: string | null
  cancelled_at?: string | null
  date_range_label?: string
  employee?: LeaveRequestEmployee
  contactEmployee?: LeaveContactEmployee | null
  leave_type?: LeaveType
  leaveType?: LeaveType
  approver?: {
    id: number
    name: string
  } | null
}

export interface TeamLeaveEntry {
  id: number
  employee_id: number
  employee_name: string
  position: string
  department: string
  leave_type: string
  end_date: string
}

export interface LeaveDashboardEmployee {
  id: number
  employee_id: string
  name: string
  department: string
  position: string
}

export interface LeaveDashboardData {
  employee: LeaveDashboardEmployee | null
  year: number
  balances: LeaveBalance[]
  recent_requests: LeaveRequest[]
  team_on_leave: TeamLeaveEntry[]
  pending_requests_count: number
  leave_types: LeaveType[]
  contact_employees: LeaveContactEmployee[]
}

export interface LeaveRequestFilters {
  status?: string
  search?: string
  year?: number
  employee_id?: number
  leave_type_id?: number
  page?: number
  per_page?: number
}

export interface LeaveRequestsResponse {
  success: boolean
  data: LeaveRequest[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface CreateLeaveRequestPayload {
  employee_id?: number
  contact_employee_id?: number
  leave_type_id: number
  start_date: string
  end_date: string
  session: 'full_day' | 'first_half' | 'second_half'
  reason: string
  explanation?: string
  handover_notes?: string
  attachment_path?: string
}

export interface UpdateLeaveRequestPayload extends Partial<CreateLeaveRequestPayload> {
  status?: LeaveRequest['status']
  review_notes?: string
}

export interface CreateLeaveTypePayload {
  name: string
  code: string
  days_per_year: number
  monthly_accrual_rate?: number | null
  allow_advance?: boolean
  color?: string
  icon?: string
  description?: string
  is_active?: boolean
  requires_attachment?: boolean
}

export interface UpdateLeaveTypePayload extends Partial<CreateLeaveTypePayload> {}
