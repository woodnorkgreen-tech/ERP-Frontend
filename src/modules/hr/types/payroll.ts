export interface PayrollVariable {
    id: number
    name: string
    type: 'percentage' | 'fixed_amount' | 'upper_limit'
    value: number
    is_active: boolean
    description: string | null
    created_at: string
    updated_at: string
}

export interface PayrollLedger {
    id: number
    employee_id: number
    ledger_month: string
    type: 'addition' | 'deduction'
    amount_type: 'fixed' | 'percentage_of_basic'
    amount_value: number
    name: string
    description: string | null
    is_recurring: boolean
    created_at: string
    updated_at: string
    employee?: {
        first_name: string
        last_name: string
        position: string
    }
}

export interface PayrollTaxBand {
    id: number
    name: string
    min_amount: number
    max_amount: number | null
    rate: number
    sort_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface BatchProcessResult {
    total: number
    processed: number
    errors: {
        employee: string
        message: string
    }[]
}

export interface Payslip {
    id: number
    employee_id: number
    payroll_month: string
    basic_salary: number
    gross_pay: number
    net_pay: number
    tax_breakdown: {
        paye: number
        nssf: number
        shif: number
        housing_levy: number
        personal_relief: number
    }
    ledger_breakdown: {
        name: string
        type: 'addition' | 'deduction'
        amount: number
    }[]
    status: 'draft' | 'published' | 'paid'
    payment_date: string | null
    created_at: string
    updated_at: string
    employee?: {
        id: number
        first_name: string
        last_name: string
        full_name?: string
    }
}
