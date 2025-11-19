/**
 * Budget Types and Interfaces
 *
 * This module defines types related to project budgets, including budget types
 * (main/supplementary) and budget additions for project management.
 */

/**
 * Budget Type Classification
 * Defines the type of budget for classification and reporting purposes
 */
export type BudgetType = 'main' | 'supplementary'

/**
 * Source Type Classification
 * Defines how the budget addition was created
 */
export type SourceType = 'manual' | 'materials_additional'

/**
 * Budget Addition Status
 * Tracks the approval workflow for budget additions
 */
export type BudgetAdditionStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected'

/**
 * Budget Addition Interface
 * Represents a budget addition that can be created manually or auto-detected from materials
 */
export interface BudgetAddition {
  id: number
  project_enquiry_id: number
  task_id: number
  title: string
  description?: string
  budget_type: BudgetType
  source_type: SourceType
  source_material_id?: number
  source_element_id?: number
  status: BudgetAdditionStatus
  is_materials_additional: boolean
  materials?: BudgetAdditionMaterial[]
  labour?: BudgetAdditionLabour[]
  expenses?: BudgetAdditionExpense[]
  logistics?: BudgetAdditionLogistic[]
  total_amount: number
  approved_by?: number
  approved_at?: string
  rejected_by?: number
  rejected_at?: string
  rejection_reason?: string
  created_by: number
  created_at: string
  updated_at: string
  // Relations
  creator?: {
    id: number
    name: string
  }
  approver?: {
    id: number
    name: string
  }
  rejector?: {
    id: number
    name: string
  }
  sourceMaterial?: {
    id: number
    description: string
  }
  sourceElement?: {
    id: number
    name: string
  }
}

/**
 * Budget Addition Material Item
 * Represents a material item within a budget addition
 */
export interface BudgetAdditionMaterial {
  id?: number
  budget_addition_id?: number
  description: string
  quantity: number
  unit_price: number
  total_price: number
  category?: string
  supplier?: string
  notes?: string
}

/**
 * Budget Addition Labour Item
 * Represents a labour item within a budget addition
 */
export interface BudgetAdditionLabour {
  id?: number
  budget_addition_id?: number
  type: string
  description?: string
  hours: number
  rate_per_hour: number
  total_amount: number
  category?: string
  notes?: string
}

/**
 * Budget Addition Expense Item
 * Represents an expense item within a budget addition
 */
export interface BudgetAdditionExpense {
  id?: number
  budget_addition_id?: number
  description: string
  amount: number
  category?: string
  vendor?: string
  notes?: string
}

/**
 * Budget Addition Logistic Item
 * Represents a logistic item within a budget addition
 */
export interface BudgetAdditionLogistic {
  id?: number
  budget_addition_id?: number
  description: string
  quantity: number
  unit_cost: number
  total_cost: number
  category?: string
  provider?: string
  notes?: string
}

/**
 * Create Budget Addition Data
 * Data structure for creating a new budget addition
 */
export interface CreateBudgetAdditionData {
  title: string
  description?: string
  budget_type?: BudgetType
  source_type?: SourceType
  source_material_id?: number
  source_element_id?: number
  materials?: Omit<BudgetAdditionMaterial, 'id' | 'budget_addition_id'>[]
  labour?: Omit<BudgetAdditionLabour, 'id' | 'budget_addition_id'>[]
  expenses?: Omit<BudgetAdditionExpense, 'id' | 'budget_addition_id'>[]
  logistics?: Omit<BudgetAdditionLogistic, 'id' | 'budget_addition_id'>[]
}

/**
 * Update Budget Addition Data
 * Data structure for updating an existing budget addition
 */
export interface UpdateBudgetAdditionData extends Partial<CreateBudgetAdditionData> {
  status?: BudgetAdditionStatus
  rejection_reason?: string
}

/**
 * Budget Addition Approval Action
 * Actions that can be performed on budget additions
 */
export type BudgetAdditionApprovalAction = {
  action: 'approve' | 'reject'
  notes?: string
  rejection_reason?: string
}

/**
 * Budget Summary with Additions
 * Extended budget summary that includes approved additions
 */
export interface BudgetSummaryWithAdditions {
  main_budget: {
    materials_total: number
    labour_total: number
    expenses_total: number
    logistics_total: number
    grand_total: number
  }
  supplementary_additions: {
    count: number
    total_amount: number
    additions: BudgetAddition[]
  }
  overall_total: number
}
