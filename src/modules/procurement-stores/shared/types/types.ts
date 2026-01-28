// Procurement Dashboard Types

export interface DashboardStats {
    totalPurchaseOrders: number
    approvedPOs: number
    pendingPOs: number
    totalRequisitions: number
    approvedRequisitions: number
    pendingRequisitions: number
    outstandingAmount: number
    pendingBills: number
    activeSuppliers: number
    totalGRNs?: number
    completedGRNs?: number
}

export interface PurchaseOrder {
    id: number
    po_number: string
    date: string
    supplier_id: number
    supplier?: Supplier
    due_date: string
    delivery_address: string
    description: string
    total_amount: number
    status: POStatus
    requisition_id?: number
    requisition?: Requisition
    submitted_at?: string
    approved_at?: string
    approved_by?: number
    items?: PurchaseOrderItem[]
    createdBy?: User
    created_at: string
    updated_at: string
}

export interface PurchaseOrderItem {
    id?: number
    purchase_order_id?: number
    material_id?: number
    material?: Material
    quantity: number
    unit_price: number
    total: number
    sku_search?: string
    showDropdown?: boolean
    searchResults?: Material[]
    loading?: boolean
}

export interface Requisition {
    id: number
    requisition_number: string
    date: string
    required_date: string
    project_id?: number
    project?: Project
    employee_id?: number
    employee?: Employee
    department_id?: number
    department?: Department
    description: string
    status: RequisitionStatus
    submitted_at?: string
    approved_at?: string
    approved_by?: number
    rejection_reason?: string
    items?: RequisitionItem[]
    purchaseOrder?: PurchaseOrder
    createdBy?: User
    approvedBy?: User
    created_at: string
    updated_at: string
}

export interface RequisitionItem {
    id?: number
    requisition_id?: number
    material_id: number
    material?: Material
    quantity: number
    unit_price: number
    total: number
    purpose: string
    reason?: string
}

export interface Bill {
    id: number
    bill_number: string
    purchase_order_id: number
    purchaseOrder?: PurchaseOrder
    supplier_id: number
    supplier?: Supplier
    bill_date: string
    due_date: string
    amount: number
    paid_amount: number
    balance: number
    status: BillStatus
    notes?: string
    payments?: Payment[]
    createdBy?: User
    created_at: string
    updated_at: string
}

export interface Payment {
    id: number
    bill_id: number
    payment_code: string
    amount_paid: number
    payment_date: string
    payment_method_id: number
    paymentMethod?: PaymentMethod
    reference_number?: string
    notes?: string
    createdBy?: User
    created_at: string
}

export interface PaymentMethod {
    id: number
    method_name: string
    description?: string
    is_active: boolean
}

export interface GoodsReceiptNote {
    id: number
    grn_number: string
    date: string
    purchase_order_id: number
    purchaseOrder?: PurchaseOrder
    batch_number?: string
    store_location?: string
    quality_check: boolean
    notes?: string
    received_by?: number
    receivedBy?: User
    items?: GoodsReceiptNoteItem[]
    created_at: string
    updated_at: string
}

export interface GoodsReceiptNoteItem {
    id?: number
    goods_receipt_note_id?: number
    purchase_order_item_id: number
    material_id: number
    material?: Material
    ordered_quantity: number
    received_quantity: number
    condition: ItemCondition
    accepted: boolean
}

export interface Supplier {
    id: number
    supplier_name: string
    contact_person?: string
    phone?: string
    email?: string
    address?: string
    payment_terms?: string
    status: SupplierStatus
    user_id?: number
    createdBy?: User
    created_at?: string
    updated_at?: string
}

export interface Material {
    id: number
    material_code: string
    material_name: string
    description?: string
    unit_price?: number
    unit_of_measure?: string
    category?: string
    min_stock_level?: number
    max_stock_level?: number
    current_stock?: number
}

export interface User {
    id: number
    name: string
    email?: string
    employee?: Employee
}

export interface Employee {
    id: number
    employee_number: string
    first_name: string
    last_name: string
    email?: string
    phone?: string
    department_id?: number
    department?: Department
}

export interface Department {
    id: number
    department_name: string
    department_code?: string
}

export interface Project {
    id: number
    project_name: string
    project_code?: string
    client_name?: string
    status?: string
}

export interface PendingApproval {
    id: number
    type: 'Purchase Order' | 'Requisition'
    number: string
}

export interface ChartData {
    labels: string[]
    datasets: ChartDataset[]
}

export interface ChartDataset {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor: string | string[]
    borderWidth?: number
}

// Status Enums
export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'sent' | 'completed' | 'cancelled'

export type RequisitionStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'converted'

export type BillStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue'

export type SupplierStatus = 'active' | 'inactive'

export type ItemCondition = 'good' | 'damaged' | 'defective'

// API Response Types
export interface PaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

export interface ApiResponse<T> {
    data: T
    message?: string
    success?: boolean
}

export interface BillStats {
    total_bills: number
    total_outstanding: number
    total_paid: number
    pending_count: number
    overdue_count: number
}

export interface SearchParams {
    searchTerm?: string
    status?: string
    supplier_id?: number
    date_from?: string
    date_to?: string
    perPage?: number
    page?: number
}