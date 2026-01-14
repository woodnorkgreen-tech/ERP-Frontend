export interface PurchaseOrder {
  id: number
  po_number: string
  date: string
  supplier_id: number
  supplier?: {
    id: number
    supplier_name: string
    email: string
  }
  due_date: string
  delivery_address: string
  description?: string
  total_amount: number
  status: 'pending' | 'approved' | 'delivered' | 'cancelled'
  items: PurchaseOrderItem[]
  createdBy?: {
    id: number
    first_name: string
    last_name: string
  }
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id?: number
  material_id: number
  material?: {
    id: number
    material_code: string
    material_name: string
    unit_price: number
  }
  quantity: number
  unit_price: number
  total: number
  
  // UI helper fields
  sku_search?: string
  showDropdown?: boolean
  searchResults?: any[]
  loading?: boolean
}

export interface CreatePurchaseOrderData {
  date: string
  supplier_id: number
  due_date: string
  delivery_address: string
  description?: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderFilters {
  searchTerm?: string
  status?: string
  date_filter?: string
  start_date?: string
  end_date?: string
  page?: number
}

export interface Invoice {
  id: number
  invoice_number: string
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
  invoice_date: string
  due_date: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  payment_date?: string
  payment_method?: string
  notes?: string
  createdBy?: {
    id: number
    first_name: string
    last_name: string
  }
  created_at: string
  updated_at: string
}

export interface CreateInvoiceData {
  purchase_order_id: number
  invoice_date: string
  due_date: string
  amount: number
  notes?: string
}

export interface InvoiceFilters {
  searchTerm?: string
  status?: string
  date_filter?: string
  page?: number
}