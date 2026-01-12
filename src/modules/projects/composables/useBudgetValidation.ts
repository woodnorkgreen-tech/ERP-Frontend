import { ref } from 'vue'
import type { BudgetFormData } from './useBudgetState'

export interface ValidationError {
  field: string
  message: string
  tab: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  hasErrors: boolean
  hasWarnings: boolean
}

export function useBudgetValidation() {
  const errors = ref<ValidationError[]>([])
  const warnings = ref<ValidationError[]>([])

  const validateMaterials = (formData: BudgetFormData): ValidationError[] => {
    const materialErrors: ValidationError[] = []

    // Safety check: ensure materials array exists
    if (!formData.materials || !Array.isArray(formData.materials)) {
      return materialErrors
    }

    formData.materials.forEach((element, elementIndex) => {
      element.materials.forEach((material, materialIndex) => {
        if (!material.description?.trim()) {
          materialErrors.push({
            field: `materials[${elementIndex}].materials[${materialIndex}].description`,
            message: 'Material description is required',
            tab: 'materials',
            severity: 'error'
          })
        }

        if (!material.unitOfMeasurement?.trim()) {
          materialErrors.push({
            field: `materials[${elementIndex}].materials[${materialIndex}].unitOfMeasurement`,
            message: 'Unit of measurement is required',
            tab: 'materials',
            severity: 'error'
          })
        }

        if (material.quantity <= 0) {
          materialErrors.push({
            field: `materials[${elementIndex}].materials[${materialIndex}].quantity`,
            message: 'Quantity must be greater than 0',
            tab: 'materials',
            severity: 'error'
          })
        }

        if (material.unitPrice < 0) {
          materialErrors.push({
            field: `materials[${elementIndex}].materials[${materialIndex}].unitPrice`,
            message: 'Unit price cannot be negative',
            tab: 'materials',
            severity: 'error'
          })
        }

        // Cross-field validation: check if totalPrice matches quantity * unitPrice
        const expectedTotal = Math.round((material.quantity * material.unitPrice) * 100) / 100
        if (Math.abs(material.totalPrice - expectedTotal) > 0.01) {
          materialErrors.push({
            field: `materials[${elementIndex}].materials[${materialIndex}].totalPrice`,
            message: `Total price (${material.totalPrice}) doesn't match quantity × unit price (${expectedTotal})`,
            tab: 'materials',
            severity: 'error'
          })
        }

        // Warning for unusually high unit prices
        if (material.unitPrice > 100000) {
          materialErrors.push({
            field: `materials[${elementIndex}].materials[${materialIndex}].unitPrice`,
            message: 'Unit price seems unusually high. Please verify.',
            tab: 'materials',
            severity: 'warning'
          })
        }
      })
    })

    return materialErrors
  }

  const validateLabour = (formData: BudgetFormData): ValidationError[] => {
    const labourErrors: ValidationError[] = []

    // Safety check: ensure labour array exists
    if (!formData.labour || !Array.isArray(formData.labour)) {
      return labourErrors
    }

    formData.labour.forEach((labour, index) => {
      if (!labour.type?.trim()) {
        labourErrors.push({
          field: `labour[${index}].type`,
          message: 'Labour type is required',
          tab: 'labour',
          severity: 'error'
        })
      }

      if (!labour.category?.trim()) {
        labourErrors.push({
          field: `labour[${index}].category`,
          message: 'Labour category is required',
          tab: 'labour',
          severity: 'error'
        })
      }

      if (!labour.unit?.trim()) {
        labourErrors.push({
          field: `labour[${index}].unit`,
          message: 'Unit is required',
          tab: 'labour',
          severity: 'error'
        })
      }

      if (labour.quantity <= 0) {
        labourErrors.push({
          field: `labour[${index}].quantity`,
          message: 'Quantity must be greater than 0',
          tab: 'labour',
          severity: 'error'
        })
      }

      if (labour.unitRate < 0) {
        labourErrors.push({
          field: `labour[${index}].unitRate`,
          message: 'Unit rate cannot be negative',
          tab: 'labour',
          severity: 'error'
        })
      }

      // Cross-field validation: check if amount matches quantity * days * unitRate
      const days = labour.days || 1
      const expectedAmount = Math.round((labour.quantity * days * labour.unitRate) * 100) / 100
      if (Math.abs(labour.amount - expectedAmount) > 0.01) {
        labourErrors.push({
          field: `labour[${index}].amount`,
          message: `Amount (${labour.amount}) doesn't match quantity × days × unit rate (${expectedAmount})`,
          tab: 'labour',
          severity: 'error'
        })
      }

      // Warning for unusually high rates
      if (labour.unitRate > 50000) {
        labourErrors.push({
          field: `labour[${index}].unitRate`,
          message: 'Unit rate seems unusually high. Please verify.',
          tab: 'labour',
          severity: 'warning'
        })
      }
    })

    return labourErrors
  }

  const validateExpenses = (formData: BudgetFormData): ValidationError[] => {
    const expenseErrors: ValidationError[] = []

    // Safety check: ensure expenses array exists
    if (!formData.expenses || !Array.isArray(formData.expenses)) {
      return expenseErrors
    }

    formData.expenses.forEach((expense, index) => {
      if (!expense.description?.trim()) {
        expenseErrors.push({
          field: `expenses[${index}].description`,
          message: 'Expense description is required',
          tab: 'expenses',
          severity: 'error'
        })
      }

      if (!expense.category?.trim()) {
        expenseErrors.push({
          field: `expenses[${index}].category`,
          message: 'Expense category is required',
          tab: 'expenses',
          severity: 'error'
        })
      }

      if (expense.amount <= 0) {
        expenseErrors.push({
          field: `expenses[${index}].amount`,
          message: 'Expense amount must be greater than 0',
          tab: 'expenses',
          severity: 'error'
        })
      }

      // Warning for unusually high expenses
      if (expense.amount > 500000) {
        expenseErrors.push({
          field: `expenses[${index}].amount`,
          message: 'Expense amount seems unusually high. Please verify.',
          tab: 'expenses',
          severity: 'warning'
        })
      }
    })

    return expenseErrors
  }

  const validateLogistics = (formData: BudgetFormData): ValidationError[] => {
    const logisticsErrors: ValidationError[] = []

    // Safety check: ensure logistics array exists
    if (!formData.logistics || !Array.isArray(formData.logistics)) {
      return logisticsErrors
    }

    formData.logistics.forEach((item, index) => {
      if (!item.description?.trim()) {
        logisticsErrors.push({
          field: `logistics[${index}].description`,
          message: 'Logistics description is required',
          tab: 'logistics',
          severity: 'error'
        })
      }

      if (!item.category?.trim()) {
        logisticsErrors.push({
          field: `logistics[${index}].category`,
          message: 'Logistics category is required',
          tab: 'logistics',
          severity: 'error'
        })
      }

      if (item.quantity <= 0) {
        logisticsErrors.push({
          field: `logistics[${index}].quantity`,
          message: 'Quantity must be greater than 0',
          tab: 'logistics',
          severity: 'error'
        })
      }

      if (item.unitRate < 0) {
        logisticsErrors.push({
          field: `logistics[${index}].unitRate`,
          message: 'Unit rate cannot be negative',
          tab: 'logistics',
          severity: 'error'
        })
      }

      // Cross-field validation: check if amount matches quantity * unitRate
      const expectedAmount = Math.round((item.quantity * item.unitRate) * 100) / 100
      if (Math.abs(item.amount - expectedAmount) > 0.01) {
        logisticsErrors.push({
          field: `logistics[${index}].amount`,
          message: `Amount (${item.amount}) doesn't match quantity × unit rate (${expectedAmount})`,
          tab: 'logistics',
          severity: 'error'
        })
      }

      // Warning for unusually high logistics costs
      if (item.amount > 200000) {
        logisticsErrors.push({
          field: `logistics[${index}].amount`,
          message: 'Logistics amount seems unusually high. Please verify.',
          tab: 'logistics',
          severity: 'warning'
        })
      }
    })

    return logisticsErrors
  }

  const validateBudget = (formData: BudgetFormData): ValidationResult => {
    const allValidationIssues: ValidationError[] = [
      ...validateMaterials(formData),
      ...validateLabour(formData),
      ...validateExpenses(formData),
      ...validateLogistics(formData)
    ]

    const validationErrors = allValidationIssues.filter(issue => issue.severity === 'error')
    const validationWarnings = allValidationIssues.filter(issue => issue.severity === 'warning')

    errors.value = validationErrors
    warnings.value = validationWarnings

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      warnings: validationWarnings,
      hasErrors: validationErrors.length > 0,
      hasWarnings: validationWarnings.length > 0
    }
  }

  const validateBudgetTotals = async (formData: BudgetFormData, materialsTotal: number, labourTotal: number, expensesTotal: number, logisticsTotal: number, grandTotal: number, taskId?: number): Promise<ValidationError[]> => {
    const totalErrors: ValidationError[] = []

    // Calculate expected totals from form data with safety checks
    const expectedMaterialsTotal = (formData.materials && Array.isArray(formData.materials))
      ? formData.materials.reduce((total, element) => {
        return total + (element.materials && Array.isArray(element.materials)
          ? element.materials.reduce((sum, material) => sum + (material.totalPrice || 0), 0)
          : 0)
      }, 0)
      : 0

    const expectedLabourTotal = (formData.labour && Array.isArray(formData.labour))
      ? formData.labour.reduce((total, item) => total + (item.amount || 0), 0)
      : 0

    const expectedExpensesTotal = (formData.expenses && Array.isArray(formData.expenses))
      ? formData.expenses.reduce((total, item) => total + (item.amount || 0), 0)
      : 0

    const expectedLogisticsTotal = (formData.logistics && Array.isArray(formData.logistics))
      ? formData.logistics.reduce((total, item) => total + (item.amount || 0), 0)
      : 0

    // Get approved additions total if taskId is provided
    const approvedAdditionsTotal = { materials: 0, labour: 0, expenses: 0, logistics: 0 }
    if (taskId) {
      try {
        const response = await fetch(`/api/projects/tasks/${taskId}/budget/additions`)
        if (response.ok) {
          const additionsData = await response.json()
          const approvedAdditions = additionsData.data.filter((addition: any) => addition.status === 'approved')

          approvedAdditions.forEach((addition: any) => {
            // Sum materials from approved additions
            if (addition.materials) {
              addition.materials.forEach((material: any) => {
                approvedAdditionsTotal.materials += material.totalPrice || 0
              })
            }
            // Sum labour from approved additions
            if (addition.labour) {
              addition.labour.forEach((labour: any) => {
                approvedAdditionsTotal.labour += labour.amount || 0
              })
            }
            // Sum expenses from approved additions
            if (addition.expenses) {
              addition.expenses.forEach((expense: any) => {
                approvedAdditionsTotal.expenses += expense.amount || 0
              })
            }
            // Sum logistics from approved additions
            if (addition.logistics) {
              addition.logistics.forEach((item: unknown) => {
                approvedAdditionsTotal.logistics += item.amount || 0
              })
            }
          })
        }
      } catch (error) {
        console.warn('Failed to fetch approved additions for validation:', error)
      }
    }

    // Check if computed totals match calculated totals (including approved additions)
    const expectedMaterialsWithAdditions = expectedMaterialsTotal + approvedAdditionsTotal.materials
    if (Math.abs(materialsTotal - expectedMaterialsWithAdditions) > 0.01) {
      totalErrors.push({
        field: 'materials',
        message: `Materials total (${materialsTotal}) doesn't match calculated total (${expectedMaterialsWithAdditions}) including approved additions`,
        tab: 'summary',
        severity: 'error'
      })
    }

    const expectedLabourWithAdditions = expectedLabourTotal + approvedAdditionsTotal.labour
    if (Math.abs(labourTotal - expectedLabourWithAdditions) > 0.01) {
      totalErrors.push({
        field: 'labour',
        message: `Labour total (${labourTotal}) doesn't match calculated total (${expectedLabourWithAdditions}) including approved additions`,
        tab: 'summary',
        severity: 'error'
      })
    }

    const expectedExpensesWithAdditions = expectedExpensesTotal + approvedAdditionsTotal.expenses
    if (Math.abs(expensesTotal - expectedExpensesWithAdditions) > 0.01) {
      totalErrors.push({
        field: 'expenses',
        message: `Expenses total (${expensesTotal}) doesn't match calculated total (${expectedExpensesWithAdditions}) including approved additions`,
        tab: 'summary',
        severity: 'error'
      })
    }

    const expectedLogisticsWithAdditions = expectedLogisticsTotal + approvedAdditionsTotal.logistics
    if (Math.abs(logisticsTotal - expectedLogisticsWithAdditions) > 0.01) {
      totalErrors.push({
        field: 'logistics',
        message: `Logistics total (${logisticsTotal}) doesn't match calculated total (${expectedLogisticsWithAdditions}) including approved additions`,
        tab: 'summary',
        severity: 'error'
      })
    }

    const expectedGrandTotal = materialsTotal + labourTotal + expensesTotal + logisticsTotal

    if (Math.abs(grandTotal - expectedGrandTotal) > 0.01) {
      totalErrors.push({
        field: 'grandTotal',
        message: `Grand total (${grandTotal}) doesn't match sum of all totals (${expectedGrandTotal})`,
        tab: 'summary',
        severity: 'error'
      })
    }

    return totalErrors
  }

  const hasErrors = (tab?: string): boolean => {
    if (tab) {
      return errors.value.some(error => error.tab === tab)
    }
    return errors.value.length > 0
  }

  const hasWarnings = (tab?: string): boolean => {
    if (tab) {
      return warnings.value.some(warning => warning.tab === tab)
    }
    return warnings.value.length > 0
  }

  const getErrorsForTab = (tab: string): ValidationError[] => {
    return errors.value.filter(error => error.tab === tab)
  }

  const getWarningsForTab = (tab: string): ValidationError[] => {
    return warnings.value.filter(warning => warning.tab === tab)
  }

  const clearErrors = () => {
    errors.value = []
    warnings.value = []
  }

  return {
    errors,
    warnings,
    validateBudget,
    validateBudgetTotals,
    hasErrors,
    hasWarnings,
    getErrorsForTab,
    getWarningsForTab,
    clearErrors,
  }
}
