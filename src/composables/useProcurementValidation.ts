import type { ProcurementTaskData, ProcurementItem } from '@/modules/projects/services'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function useProcurementValidation() {
  const validateProcurementData = (data: ProcurementTaskData): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    if (!data.budgetImported) {
      errors.push('Budget data must be imported before saving')
      return { errors, warnings, isValid: false }
    }

    if (data.procurementItems.length === 0) {
      errors.push('No procurement items to save')
      return { errors, warnings, isValid: false }
    }

    // Project information validation
    if (!data.projectInfo.projectId) {
      errors.push('Project ID is missing from imported data')
    }

    if (!data.projectInfo.enquiryTitle) {
      warnings.push('Enquiry title is missing - this may affect reporting')
    }

    // Budget summary validation
    if (data.budgetSummary.materialsTotal <= 0) {
      errors.push('Invalid materials total in budget summary')
    }

    if (data.budgetSummary.totalItems !== data.procurementItems.length) {
      warnings.push('Mismatch between budget summary item count and actual items')
    }

    // Individual item validation
    let totalBudgetValue = 0
    const duplicateIds = new Set<string>()
    const seenIds = new Set<string>()

    data.procurementItems.forEach((item, index) => {
      const itemNumber = index + 1

      // Required field validation
      if (!item.elementName || item.elementName.trim() === '') {
        errors.push(`Item ${itemNumber}: Element name is required`)
      }

      if (!item.description || item.description.trim() === '') {
        errors.push(`Item ${itemNumber}: Description is required`)
      }

      if (!item.budgetItemId || item.budgetItemId.trim() === '') {
        errors.push(`Item ${itemNumber}: Budget item ID is required`)
      } else {
        // Check for duplicate IDs
        if (seenIds.has(item.budgetItemId)) {
          duplicateIds.add(item.budgetItemId)
          errors.push(`Item ${itemNumber}: Duplicate budget item ID '${item.budgetItemId}'`)
        }
        seenIds.add(item.budgetItemId)
      }

      // Numeric validation
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Item ${itemNumber}: Quantity must be a positive number`)
      }

      if (typeof item.budgetUnitPrice !== 'number' || item.budgetUnitPrice < 0) {
        errors.push(`Item ${itemNumber}: Unit price cannot be negative`)
      }

      if (typeof item.budgetTotalPrice !== 'number' || item.budgetTotalPrice < 0) {
        errors.push(`Item ${itemNumber}: Total price cannot be negative`)
      }

      // Business logic validation
      const calculatedTotal = item.quantity * item.budgetUnitPrice
      if (Math.abs(calculatedTotal - item.budgetTotalPrice) > 0.01) {
        warnings.push(`Item ${itemNumber}: Total price (${item.budgetTotalPrice}) doesn't match quantity × unit price (${calculatedTotal})`)
      }

      totalBudgetValue += item.budgetTotalPrice

      // Status-specific validation
      if (item.availabilityStatus !== 'available' && (!item.vendorName || item.vendorName.trim() === '')) {
        errors.push(`Item ${itemNumber}: Vendor name is required for status '${item.availabilityStatus}'`)
      }

      // Vendor name format validation
      if (item.vendorName && item.vendorName.length > 100) {
        warnings.push(`Item ${itemNumber}: Vendor name is very long (${item.vendorName.length} characters)`)
      }

      // Unit of measurement validation
      if (!item.unitOfMeasurement || item.unitOfMeasurement.trim() === '') {
        warnings.push(`Item ${itemNumber}: Unit of measurement is missing`)
      }

      // Status transition validation
      if (item.availabilityStatus === 'received' && !item.procurementNotes.includes('Ordered')) {
        warnings.push(`Item ${itemNumber}: Item marked as received but no order record found`)
      }

      if (item.availabilityStatus === 'hired' && !item.procurementNotes.includes('Received')) {
        warnings.push(`Item ${itemNumber}: Item marked as hired but no received record found`)
      }
    })

    // Budget total validation
    const budgetVariance = Math.abs(totalBudgetValue - data.budgetSummary.materialsTotal)
    if (budgetVariance > 0.01) {
      warnings.push(`Total item values (${totalBudgetValue}) don't match budget summary (${data.budgetSummary.materialsTotal})`)
    }

    return {
      errors,
      warnings,
      isValid: errors.length === 0
    }
  }

  const validateItem = (item: ProcurementItem, itemNumber: number) => {
    const errors: string[] = []
    const warnings: string[] = []

    if (!item.description?.trim()) {
      errors.push(`Item ${itemNumber}: Description required`)
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      errors.push(`Item ${itemNumber}: Invalid quantity`)
    }

    if (item.vendorName && item.vendorName.length > 100) {
      warnings.push(`Item ${itemNumber}: Vendor name too long`)
    }

    return { errors, warnings }
  }

  const validateStatusTransition = (
    currentStatus: string,
    newStatus: string,
    hasVendor: boolean
  ): string[] => {
    const errors: string[] = []

    // Status transition rules
    const validTransitions: Record<string, string[]> = {
      'available': ['ordered', 'cancelled'],
      'ordered': ['received', 'cancelled'],
      'received': ['hired', 'cancelled'],
      'hired': ['cancelled'], // Can only cancel hired items
      'cancelled': ['available'] // Can reactivate cancelled items
    }

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      errors.push(`Cannot change status from '${currentStatus}' to '${newStatus}'`)
    }

    // Vendor requirement validation
    if (['ordered', 'received', 'hired'].includes(newStatus) && !hasVendor) {
      errors.push(`Vendor name is required for status '${newStatus}'`)
    }

    return errors
  }

  const validateVendorName = (vendorName: string): string[] => {
    const errors: string[] = []

    if (vendorName.length > 100) {
      errors.push('Vendor name must be less than 100 characters')
    }

    if (vendorName.includes('<') || vendorName.includes('>')) {
      errors.push('Vendor name contains invalid characters')
    }

    return errors
  }

  return {
    validateProcurementData,
    validateItem,
    validateStatusTransition,
    validateVendorName
  }
}
