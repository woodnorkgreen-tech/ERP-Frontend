import axios from '@/plugins/axios'
import { AxiosError } from 'axios'
import type { ProcurementTaskData } from './MockProcurementAPI'

// Types for budget data from API
interface BudgetMaterial {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
  unitPrice: number
  totalPrice: number
  isIncluded: boolean
}

interface BudgetElement {
  id: string
  elementType: string
  name: string
  category: string
  materials: BudgetMaterial[]
  isIncluded: boolean
}

interface BudgetData {
  projectInfo: {
    projectId: string
    enquiryTitle: string
    clientName: string
    eventVenue: string
    setupDate: string
    setDownDate?: string
  }
  materials: BudgetElement[]
  budgetSummary: {
    materialsTotal: number
    labourTotal: number
    expensesTotal: number
    logisticsTotal: number
    grandTotal: number
  }
}

/**
 * Procurement Service
 * Fetches real budget data from the backend and transforms it for procurement
 */
export class ProcurementService {
  /**
   * Get procurement data for a task
   */
  static async getProcurementData(taskId: number): Promise<ProcurementTaskData | null> {
    try {
      const response = await axios.get(`/api/projects/tasks/${taskId}/procurement`)
      return response.data.data
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Save procurement data for a task
   */
  static async saveProcurementData(taskId: number, data: ProcurementTaskData): Promise<ProcurementTaskData> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/procurement`, data)
    return response.data.data
  }

  /**
   * Import budget data for procurement - fetches real budget data from backend
   */
  static async importBudgetData(taskId: number): Promise<ProcurementTaskData> {
    try {
      // Use the procurement import endpoint which handles finding the budget task
      console.log(`Importing budget data for procurement task ${taskId}`)
      const response = await axios.post(`/api/projects/tasks/${taskId}/procurement/import-budget`)

      // Debug: Log the response structure
      console.log('Procurement import API response:', response.data)

      const procurementData: ProcurementTaskData = response.data.data

      // Debug: Log the imported data
      console.log('Imported procurement data:', procurementData)

      // Validate response structure
      if (!procurementData) {
        throw new Error('No procurement data received from server. Please ensure the budget task exists and has materials.')
      }

      // Validate that procurement data has items
      if (!procurementData.procurementItems || procurementData.procurementItems.length === 0) {
        throw new Error('No materials found to import. Please ensure the budget task has materials imported from the materials task.')
      }

      console.log(`Successfully imported ${procurementData.procurementItems.length} procurement items`)
      return procurementData
    } catch (error) {
      console.error('Failed to fetch real budget data:', error)

      // Fallback to mock data for development/testing
      console.log('Falling back to mock procurement data...')
      try {
        const { mockProcurementAPI } = await import('./MockProcurementAPI')
        // Use the mock API's built-in procurement data creation
        const mockData = await mockProcurementAPI.getProcurementData(taskId.toString())
        if (mockData) {
          return mockData
        }
        // If no existing data, create new mock procurement data
        const mockBudgetData = await mockProcurementAPI.getBudgetData(taskId.toString())
        const procurementItems = []

        // Transform mock budget data manually
        for (const element of mockBudgetData.materials) {
          for (const material of element.materials) {
            procurementItems.push({
              budgetId: material.id,
              elementName: element.name,
              description: material.description,
              quantity: material.quantity,
              unitOfMeasurement: material.unitOfMeasurement,
              budgetUnitPrice: material.unitPrice,
              budgetTotalPrice: material.totalPrice,
              category: 'materials',
              vendorName: '',
              availabilityStatus: 'available' as const,
              procurementNotes: '',
              lastUpdated: new Date(),
              budgetElementId: element.id,
              budgetItemId: material.id
            })
          }
        }

        return {
          projectInfo: mockBudgetData.projectInfo,
          budgetImported: true,
          procurementItems,
          budgetSummary: {
            materialsTotal: mockBudgetData.totals.materialsTotal,
            totalItems: procurementItems.length,
            importedAt: new Date()
          },
          lastImportDate: new Date()
        }
      } catch (mockError) {
        console.error('Mock data fallback also failed:', mockError)
        throw new Error('Unable to load budget data. Please ensure the budget task is completed and has materials.')
      }
    }
  }

  /**
   * Transform budget data to procurement items
   */
  private static transformBudgetToProcurement(budgetData: BudgetData) {
    const procurementItems = []

    for (const element of budgetData.materials) {
      // Skip elements that are not included
      if (!element.isIncluded) continue

      for (const material of element.materials) {
        // Skip materials that are not included or have zero quantity
        if (!material.isIncluded || material.quantity <= 0) continue

        procurementItems.push({
          // Original budget data (preserved)
          budgetId: material.id,
          elementName: element.name,
          description: material.description,
          quantity: material.quantity,
          unitOfMeasurement: material.unitOfMeasurement,
          budgetUnitPrice: material.unitPrice,
          budgetTotalPrice: material.totalPrice,
          category: 'materials',

          // Procurement-specific data (initialized with defaults)
          vendorName: '',
          availabilityStatus: 'available' as const,
          procurementNotes: '',
          lastUpdated: new Date(),

          // Reference data for traceability
          budgetElementId: element.id,
          budgetItemId: material.id
        })
      }
    }

    // Sort items by element name and then by description for consistent ordering
    procurementItems.sort((a, b) => {
      if (a.elementName !== b.elementName) {
        return a.elementName.localeCompare(b.elementName)
      }
      return a.description.localeCompare(b.description)
    })

    return procurementItems
  }

  /**
   * Get vendor suggestions for a material description
   */
  static async getVendorSuggestions(description: string): Promise<string[]> {
    try {
      console.log('Fetching vendor suggestions from API:', description)
      const response = await axios.get('/api/projects/procurement/vendor-suggestions', {
        params: { description }
      })
      console.log('Vendor suggestions API response:', response.data)
      return response.data.suggestions
    } catch (error) {
      console.error('Vendor suggestions API failed:', error)
      // Fallback to basic suggestions if API fails
      return this.getFallbackVendorSuggestions(description)
    }
  }

  /**
   * Fallback vendor suggestions when API is unavailable
   */
  private static getFallbackVendorSuggestions(description: string): string[] {
    const suggestions: Record<string, string[]> = {
      // Stage & Structures
      'stage': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions', 'Nairobi Stage Works'],
      'platform': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions', 'Steel & Wood Creations'],
      'rostra': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions'],
      'podium': ['Stage Masters Ltd', 'Executive Furniture Ltd', 'Event Structures Co.'],

      // Lighting
      'lighting': ['Light & Sound Pro', 'LED Solutions Ltd', 'Stage Lighting Corp', 'Illumina Events'],
      'led': ['LED Solutions Ltd', 'Light & Sound Pro', 'Illumina Events', 'Bright Lights Kenya'],
      'spotlight': ['Light & Sound Pro', 'Stage Lighting Corp', 'Illumina Events'],
      'par': ['Light & Sound Pro', 'LED Solutions Ltd', 'Stage Lighting Corp'],
      'follow': ['Light & Sound Pro', 'Stage Lighting Corp', 'Illumina Events'],

      // Sound & Audio
      'sound': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions', 'Echo Sound Systems'],
      'speaker': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions', 'Echo Sound Systems'],
      'microphone': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions'],
      'mixer': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions', 'Echo Sound Systems'],
      'amplifier': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions'],

      // Furniture
      'chair': ['Executive Furniture Ltd', 'Comfort Seating Co.', 'Event Chairs Kenya', 'Royal Furniture'],
      'table': ['Executive Furniture Ltd', 'Event Tables Ltd', 'Royal Furniture', 'Modern Furniture Co.'],
      'furniture': ['Executive Furniture Ltd', 'Royal Furniture', 'Comfort Seating Co.'],

      // Decor & Backdrops
      'backdrop': ['Creative Backdrops Ltd', 'Event Decor Kenya', 'Silk & Satin Designs', 'Elegant Events'],
      'banner': ['Print & Display Ltd', 'Creative Backdrops Ltd', 'Event Decor Kenya'],
      'curtain': ['Silk & Satin Designs', 'Event Decor Kenya', 'Elegant Events'],
      'decor': ['Event Decor Kenya', 'Elegant Events', 'Creative Backdrops Ltd'],

      // Signage
      'signage': ['Print & Display Ltd', 'Sign Masters Kenya', 'Creative Signs Ltd'],
      'sign': ['Print & Display Ltd', 'Sign Masters Kenya', 'Creative Signs Ltd'],

      // Carpets & Flooring
      'carpet': ['Flooring Solutions Ltd', 'Carpet Masters Kenya', 'Elegant Floors'],
      'rug': ['Flooring Solutions Ltd', 'Carpet Masters Kenya', 'Elegant Floors'],

      // General Equipment
      'generator': ['Power Solutions Ltd', 'Generator Experts Kenya', 'Reliable Power Co.'],
      'cable': ['Electrical Supplies Ltd', 'Cable Masters Kenya', 'Tech Cables Co.'],
      'extension': ['Electrical Supplies Ltd', 'Cable Masters Kenya', 'Tech Cables Co.'],
    }

    const lowerDesc = description.toLowerCase()
    for (const [key, vendors] of Object.entries(suggestions)) {
      if (lowerDesc.includes(key)) {
        return vendors
      }
    }

    // Default suggestions for unmatched items
    return ['General Suppliers Ltd', 'Equipment Rental Co.', 'Tech Solutions Ltd', 'Event Services Kenya']
  }
}
