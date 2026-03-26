import type { BaseEntity } from '../../admin/shared/types/common'
import type { Department } from '../../admin/departmentManagement/types/department'

export interface EmployeeDocument {
  id: number
  employee_id: number
  document_type: 'contract' | 'id_passport' | 'academic' | 'professional' | 'other'
  name: string
  file_path: string
  mime_type: string | null
  size: number | null
  uploaded_by: number | null
  uploader?: { id: number, name: string, email: string }
  created_at: string
  updated_at: string
}

export interface Employee extends BaseEntity {
  user_id: number
  employee_id: string
  first_name: string
  last_name: string
  id_number: string | null
  kra_pin: string | null
  nssf_id: string | null
  nhif_id: string | null

  email: string
  phone: string | null
  position: string
  department_id: number
  department?: Department
  hire_date: string
  probation_end_date: string | null
  is_on_probation: boolean
  contract_end_date: string | null

  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern'
  manager_id: number | null
  manager?: Employee
  status: 'active' | 'inactive' | 'terminated' | 'on-leave'
  address: string | null
  date_of_birth: string | null
  salary: number | null
  bank_name: string | null
  bank_branch: string | null
  bank_code: string | null
  account_number: string | null
  payment_method: 'bank' | 'cash' | 'mobile_money' | 'cheque'

  emergency_contact: EmergencyContact | null
  performance_rating?: number
  last_review_date?: string
  documents?: EmployeeDocument[] | readonly EmployeeDocument[]
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface CreateEmployeeData {
  user_id?: number
  first_name: string
  last_name: string
  id_number?: string
  kra_pin?: string
  nssf_id?: string
  nhif_id?: string

  email: string
  phone?: string
  position: string
  department_id: number
  hire_date: string
  probation_end_date?: string
  is_on_probation?: boolean
  contract_end_date?: string

  salary?: number
  bank_name?: string
  bank_branch?: string
  bank_code?: string
  account_number?: string
  payment_method?: 'bank' | 'cash' | 'mobile_money' | 'cheque'

  date_of_birth?: string
  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern'
  manager_id?: number
  address?: string
  emergency_contact?: EmergencyContact
}

export interface UpdateEmployeeData {
  employee_id?: string
  first_name?: string
  last_name?: string
  id_number?: string
  kra_pin?: string
  nssf_id?: string
  nhif_id?: string

  email?: string
  phone?: string
  position?: string
  department_id?: number
  hire_date?: string
  probation_end_date?: string
  is_on_probation?: boolean
  contract_end_date?: string

  salary?: number
  bank_name?: string
  bank_branch?: string
  bank_code?: string
  account_number?: string
  payment_method?: 'bank' | 'cash' | 'mobile_money' | 'cheque'

  date_of_birth?: string
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'intern'
  manager_id?: number
  status?: 'active' | 'inactive' | 'terminated' | 'on-leave'
  address?: string
  emergency_contact?: EmergencyContact
  performance_rating?: number
  last_review_date?: string
}

export interface EmployeeFilters {
  search?: string
  department?: string
  department_id?: number
  position?: string
  employment_type?: string
  status?: string
  is_active?: boolean
  manager_id?: number
  page?: number
  per_page?: number
}