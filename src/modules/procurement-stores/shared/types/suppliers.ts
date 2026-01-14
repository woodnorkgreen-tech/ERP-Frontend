export interface Supplier {
  id: number
  supplier_name: string
  contact_person: string
  phone: string
  email: string
  address: string | null
  payment_terms: string | null
  status: 'Active' | 'Inactive'
  user_id: number | null
  createdBy?: {
    id: number
    first_name: string
    last_name: string
    name: string
  }
  created_at: string
  updated_at?: string
}

export interface CreateSupplierData {
  supplier_name: string
  contact_person: string
  phone: string
  email: string
  address?: string
  payment_terms?: string
  status?: 'Active' | 'Inactive'
}

export interface UpdateSupplierData {
  supplier_name?: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  payment_terms?: string
  status?: 'Active' | 'Inactive'
}

export interface SupplierFilters {
  searchTerm?: string
  status?: string
  payment_terms?: string
  page?: number
  per_page?: number
}