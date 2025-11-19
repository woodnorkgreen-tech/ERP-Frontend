/**
 * Budget Import Service
 * Handles transformation of budget data to procurement format
 * Preserves original budget data while adding procurement-specific fields
 */

import axios from '@/plugins/axios'

// Define types locally since we're not using MockProcurementAPI anymore
interface ProjectInfo {
  projectId: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate?: string
}

interface BudgetSummary {
  materialsTotal: number
  totalItems: number
  importedAt: Date
}

interface ProcurementItem {
  budgetId: string
  elementName: string
  description: string
  quantity: number
  unitOfMeasurement: string
  budgetUnitPrice: number
  budgetTotalPrice: number
  category: string
  vendorName: string
  availabilityStatus: 'available' | 'ordered' | 'received' | 'hired' | 'cancelled'
  procurementNotes: string
  lastUpdated: Date
  budgetElementId: string
  budgetItemId: string
}

interface ProcurementTaskData {
  projectInfo: ProjectInfo
  budgetImported: boolean
  procurementItems: ProcurementItem[]
  budgetSummary: BudgetSummary
  lastImportDate: Date
}

// Transform real data to match our expected format
interface BudgetMaterial {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unitOfMeasurement: string
}

interface BudgetElement {
  id: string
  name: string
  materials: BudgetMaterial[]
}

interface BudgetData {
  projectInfo: ProjectInfo
  materials: BudgetElement[]
  totals: BudgetSummary
}

/**
 * Service class for importing and transforming budget data
 */
export class BudgetImportService {
  /**
   * Import budget data for a specific task
   */
  async importBudgetData(taskId: string, options: {
    scenario?: string
    forceRefresh?: boolean
  } = {}): Promise<BudgetData> {
    const { forceRefresh = false } = options

    try {
      // Fetch real budget data from the backend API
      const response = await axios.get(`/api/projects/tasks/${taskId}/budget`)
      const apiData = response.data

      // Debug: Log the response structure
      console.log('Budget API response:', apiData)

      // Check if this is an error response
      if (apiData.message && !apiData.data && typeof apiData.data !== 'object') {
        throw new Error(`API Error: ${apiData.message}`)
      }

      // The BudgetController returns data wrapped in 'data' when budget exists,
      // or returns default structure directly when no budget exists
      const realData = apiData.data || apiData

      // Debug: Log the extracted data
      console.log('Extracted realData:', realData)

      // Ensure we have the expected structure
      if (!realData || typeof realData !== 'object') {
        throw new Error('Invalid response structure from budget API')
      }

      // Transform real data to our expected format
      const budgetData: BudgetData = {
        projectInfo: {
          projectId: String(realData.projectInfo?.projectId || realData.project_info?.project_id || ''),
          enquiryTitle: String(realData.projectInfo?.enquiryTitle || realData.project_info?.enquiry_title || ''),
          clientName: String(realData.projectInfo?.clientName || realData.project_info?.client_name || ''),
          eventVenue: String(realData.projectInfo?.eventVenue || realData.project_info?.event_venue || ''),
          setupDate: String(realData.projectInfo?.setupDate || realData.project_info?.setup_date || ''),
          setDownDate: String(realData.projectInfo?.setDownDate || realData.project_info?.set_down_date || '')
        },
        materials: (realData.materials || realData.materials_data || []).map((element: Record<string, unknown>) => ({
          id: String(element.id || ''),
          name: String(element.name || ''),
          materials: (element.materials as Record<string, unknown>[] || []).map((material: Record<string, unknown>) => ({
            id: String(material.id || ''),
            description: String(material.description || ''),
            quantity: Number(material.quantity || 0),
            unitPrice: Number(material.unitPrice || material.unit_price || 0),
            totalPrice: Number(material.totalPrice || material.total_price || 0),
            unitOfMeasurement: String(material.unitOfMeasurement || material.unit_of_measurement || 'Pcs')
          }))
        })),
        totals: {
          materialsTotal: Number(realData.budgetSummary?.materialsTotal || realData.budget_summary?.materials_total || 0),
          totalItems: Number(realData.budgetSummary?.totalItems || realData.budget_summary?.total_items || 0),
          importedAt: new Date(realData.budgetSummary?.importedAt || realData.budget_summary?.imported_at || new Date())
        }
      }

      // Debug: Log the transformed data
      console.log('Transformed budgetData:', budgetData)

      // Validate budget data
      this.validateBudgetData(budgetData)

      return budgetData
    } catch (error) {
      console.error('Failed to import budget data:', error)
      throw new Error(`Budget import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Transform budget data to procurement items
   * This preserves original budget data while adding procurement fields
   */
  transformBudgetToProcurement(budgetData: BudgetData): ProcurementItem[] {
    if (!budgetData || !budgetData.materials) {
      throw new Error('Invalid budget data: materials array is required')
    }

    const items: ProcurementItem[] = []

    budgetData.materials.forEach(element => {
      if (!element.materials || !Array.isArray(element.materials)) {
        console.warn(`Skipping element ${element.name}: no materials array found`)
        return
      }

      element.materials.forEach(material => {
        // Validate required material fields
        if (!material.id || !material.description) {
          console.warn(`Skipping material: missing required fields`, material)
          return
        }

        items.push({
          // Original budget data (preserved)
          budgetId: material.id,
          elementName: element.name,
          description: material.description,
          quantity: material.quantity || 0,
          unitOfMeasurement: material.unitOfMeasurement || 'Pcs',
          budgetUnitPrice: material.unitPrice || 0,
          budgetTotalPrice: material.totalPrice || 0,
          category: 'materials',

          // Procurement-specific data (initialized with defaults)
          vendorName: '',
          availabilityStatus: 'available',
          procurementNotes: '',
          lastUpdated: new Date(),

          // Reference data for traceability
          budgetElementId: element.id,
          budgetItemId: material.id
        })
      })
    })

    // Sort items by element name and then by description for consistent ordering
    items.sort((a, b) => {
      if (a.elementName !== b.elementName) {
        return a.elementName.localeCompare(b.elementName)
      }
      return a.description.localeCompare(b.description)
    })

    return items
  }

  /**
   * Create complete procurement task data from budget data
   */
  async createProcurementTaskData(taskId: string, options: {
    scenario?: string
    forceRefresh?: boolean
  } = {}): Promise<ProcurementTaskData> {
    // Import budget data
    const budgetData = await this.importBudgetData(taskId, options)

    // Transform to procurement items
    const procurementItems = this.transformBudgetToProcurement(budgetData)

    // Create procurement task data structure
    const procurementTaskData: ProcurementTaskData = {
      projectInfo: budgetData.projectInfo,
      budgetImported: true,
      procurementItems,
      budgetSummary: budgetData.totals,
      lastImportDate: new Date()
    }

    return procurementTaskData
  }

  /**
   * Validate budget data structure
   */
  private validateBudgetData(budgetData: BudgetData): void {
    if (!budgetData) {
      throw new Error('Budget data is null or undefined')
    }

    if (!budgetData.projectInfo) {
      throw new Error('Budget data missing project information')
    }

    if (!budgetData.materials || !Array.isArray(budgetData.materials)) {
      throw new Error('Budget data missing materials array')
    }

    if (!budgetData.totals) {
      throw new Error('Budget data missing totals information')
    }

    // Validate project info required fields
    const requiredProjectFields = ['projectId', 'enquiryTitle', 'clientName']
    for (const field of requiredProjectFields) {
      if (!budgetData.projectInfo[field as keyof ProjectInfo]) {
        throw new Error(`Project info missing required field: ${field}`)
      }
    }

    // Validate materials structure
    budgetData.materials.forEach((element, index) => {
      if (!element.id || !element.name) {
        throw new Error(`Material element at index ${index} missing required fields (id, name)`)
      }

      if (!element.materials || !Array.isArray(element.materials)) {
        throw new Error(`Material element '${element.name}' missing materials array`)
      }
    })
  }

  /**
   * Get import statistics
   */
  getImportStatistics(procurementItems: ProcurementItem[]): {
    totalItems: number
    elementCount: number
    elementsBreakdown: Record<string, number>
    totalBudgetValue: number
    averageItemValue: number
  } {
    const elementCount = new Set(procurementItems.map(item => item.budgetElementId)).size
    const elementsBreakdown: Record<string, number> = {}
    let totalBudgetValue = 0

    procurementItems.forEach(item => {
      // Count items per element
      elementsBreakdown[item.elementName] = (elementsBreakdown[item.elementName] || 0) + 1

      // Sum total budget value
      totalBudgetValue += item.budgetTotalPrice
    })

    return {
      totalItems: procurementItems.length,
      elementCount,
      elementsBreakdown,
      totalBudgetValue,
      averageItemValue: procurementItems.length > 0 ? totalBudgetValue / procurementItems.length : 0
    }
  }

  /**
   * Filter procurement items by criteria
   */
  filterProcurementItems(
    items: ProcurementItem[],
    filters: {
      elementName?: string
      availabilityStatus?: ProcurementItem['availabilityStatus']
      hasVendor?: boolean
      minValue?: number
      maxValue?: number
    }
  ): ProcurementItem[] {
    return items.filter(item => {
      // Filter by element name
      if (filters.elementName && item.elementName !== filters.elementName) {
        return false
      }

      // Filter by availability status
      if (filters.availabilityStatus && item.availabilityStatus !== filters.availabilityStatus) {
        return false
      }

      // Filter by vendor assignment
      if (filters.hasVendor !== undefined) {
        const hasVendor = item.vendorName.trim().length > 0
        if (filters.hasVendor !== hasVendor) {
          return false
        }
      }

      // Filter by value range
      if (filters.minValue !== undefined && item.budgetTotalPrice < filters.minValue) {
        return false
      }

      if (filters.maxValue !== undefined && item.budgetTotalPrice > filters.maxValue) {
        return false
      }

      return true
    })
  }

  /**
   * Get vendor suggestions for a procurement item
   */
  getVendorSuggestions(item: ProcurementItem): string[] {
    // Simple vendor suggestion logic based on item description
    const description = item.description.toLowerCase()

    const vendorMap: Record<string, string[]> = {
      'stage': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions'],
      'lighting': ['Light & Sound Pro', 'LED Solutions Ltd', 'Stage Lighting Corp'],
      'sound': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions'],
      'speaker': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions'],
      'platform': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions'],
      'screen': ['AV Solutions Ltd', 'Display Tech Corp', 'Visual Solutions Pro'],
      'banner': ['Print & Display Ltd', 'Signage Solutions', 'Graphic Design Pro'],
      'furniture': ['Event Furniture Ltd', 'Rental Solutions', 'Furniture Masters'],
      'table': ['Event Furniture Ltd', 'Table & Chair Rentals', 'Furniture Masters'],
      'chair': ['Event Furniture Ltd', 'Seating Solutions', 'Comfort Rentals'],
      'carpet': ['Flooring Solutions Ltd', 'Carpet Masters', 'Event Flooring Pro'],
      'decoration': ['Event Decor Ltd', 'Design Solutions', 'Decor Masters'],
      'flower': ['Floral Arrangements Ltd', 'Bloom Events', 'Flower Power'],
      'catering': ['Catering Solutions Ltd', 'Food Masters', 'Event Catering Pro'],
      'tent': ['Tent & Canopy Ltd', 'Outdoor Solutions', 'Shelter Masters'],
      'generator': ['Power Solutions Ltd', 'Generator Masters', 'Backup Power Pro'],
      'cable': ['Cable Solutions Ltd', 'Electrical Masters', 'Wire & Cable Pro']
    }

    // Find matching vendors based on keywords in description
    for (const [keyword, vendors] of Object.entries(vendorMap)) {
      if (description.includes(keyword)) {
        return vendors
      }
    }

    // Default vendors for unmatched items
    return ['General Suppliers Ltd', 'Equipment Rental Co.', 'Tech Solutions Ltd']
  }

  /**
   * Validate procurement item data
   */
  validateProcurementItem(item: ProcurementItem): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Required field validation
    if (!item.budgetId) errors.push('Budget ID is required')
    if (!item.description) errors.push('Description is required')
    if (item.quantity <= 0) errors.push('Quantity must be greater than 0')
    if (item.budgetUnitPrice < 0) errors.push('Unit price cannot be negative')

    // Business logic warnings
    if (!item.vendorName.trim()) {
      warnings.push('No vendor assigned')
    }

    if (item.availabilityStatus === 'cancelled' && item.vendorName.trim()) {
      warnings.push('Item is cancelled but has vendor assigned')
    }

    if (item.budgetTotalPrice === 0) {
      warnings.push('Item has zero budget value')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Export procurement data for external use
   */
  exportProcurementData(data: ProcurementTaskData, format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'Element Name',
        'Description',
        'Quantity',
        'Unit',
        'Budget Unit Price',
        'Budget Total Price',
        'Vendor Name',
        'Availability Status',
        'Notes'
      ]

      const rows = data.procurementItems.map((item: ProcurementItem) => [
        item.elementName,
        item.description,
        item.quantity.toString(),
        item.unitOfMeasurement,
        item.budgetUnitPrice.toString(),
        item.budgetTotalPrice.toString(),
        item.vendorName,
        item.availabilityStatus,
        item.procurementNotes
      ])

      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }

    // Default to JSON format
    return JSON.stringify(data, null, 2)
  }
}

// Export singleton instance
export const budgetImportService = new BudgetImportService()
