export interface GoodsReceiptNote {
  id: number
  grn_number: string
  date: string
  batch_number: string
  store_location: 'Karen Village Store' | 'Matasia Store' | 'Mombasa Store' | 'Gichagi Store'
  quality_check: 'pass' | 'fail'
  notes?: string
  purchase_order?: {
    id: number
    po_number: string
    due_date: string
    supplier?: {
      id: number
      supplier_name: string
    }
  }
  items: GoodsReceiptNoteItem[]
  receivedBy?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export interface GoodsReceiptNoteItem {
  id?: number
  goods_receipt_note_id?: number
  purchase_order_item_id: number
  material_id: number
  material?: {
    id: number
    material_code: string
    material_name: string
  }
  ordered_quantity: number
  received_quantity: number
  condition: 'good' | 'fair' | 'damaged' | 'for_repair'
  accepted: boolean
}

export interface CreateGoodsReceiptNoteData {
  purchase_order_id: number
  store_location: string
  quality_check: string
  notes?: string
  items: {
    purchase_order_item_id: number
    material_id: number
    ordered_quantity: number
    received_quantity: number
    condition: string
    accepted: boolean
  }[]
}

export interface GoodsReceiptNoteFilters {
  searchTerm?: string
  date_filter?: string
  start_date?: string
  end_date?: string
  quality_check?: string
  store_location?: string
  page?: number
}

export interface AvailablePurchaseOrder {
  id: number
  po_number: string
  date: string
  due_date: string
  supplier?: {
    id: number
    supplier_name: string
    email: string
  }
  items: {
    id: number
    material_id: number
    material?: {
      id: number
      material_code: string
      material_name: string
    }
    quantity: number
    unit_price: number
    total: number
  }[]
  total_amount: number
}