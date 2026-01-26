export interface Bill {
  id: number
  bill_number: string
  purchase_order_id: number
  purchase_order?: {
    id: number
    po_number: string
  }
  supplier_id: number
  supplier?: {
    id: number
    supplier_name: string
  }
  bill_date: string
  due_date: string
  amount: number
  paid_amount: number
  balance: number
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled'
  notes?: string
  payments?: BillPayment[]
  createdBy?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export interface BillPayment {
  id: number
  payment_code: string
  bill_id: number
  amount_paid: number
  payment_date: string
  payment_method?: {
    id: number
    method_name: string
  }
  notes?: string
  created_by?: {
    id: number
    name: string
  }
  created_at: string
}

export interface PaymentMethod {
  id: number
  method_name: string
  is_active: boolean
}

export interface CreateBillData {
  purchase_order_id: number
  bill_date: string
  due_date: string
  amount: number
  notes?: string
}

export interface RecordPaymentData {
  amount_paid: number
  payment_date: string
  payment_method_id: number
  notes?: string
}

export interface BillFilters {
  searchTerm?: string
  status?: string
  date_filter?: string
  supplier_id?: number
  page?: number
}