/**
 * Mock Procurement API
 * Provides mock data and API simulation for procurement functionality
 * In production, this would be replaced with actual API calls
 */

// Types for procurement data
export interface ProjectInfo {
  projectId: string
  job_number?: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate?: string
}

export interface BudgetSummary {
  materialsTotal: number
  totalItems: number
  importedAt: Date
}

export interface MockBudgetData {
  projectInfo: ProjectInfo
  materials: Array<{
    id: string
    name: string
    materials: Array<{
      id: string
      description: string
      quantity: number
      unitPrice: number
      totalPrice: number
      unitOfMeasurement: string
    }>
  }>
  totals: BudgetSummary
}

export interface ProcurementItem {
  // Original budget data (preserved)
  budgetId: string
  elementName: string
  description: string
  quantity: number
  unitOfMeasurement: string
  budgetUnitPrice: number
  budgetTotalPrice: number
  category: string

  // Procurement-specific data
  vendorName: string
  // availabilityStatus is deprecated but kept for backward compatibility if needed, 
  // though we should move to the new fields.
  availabilityStatus?: 'available' | 'ordered' | 'received' | 'hired' | 'cancelled'

  // New Fields
  stockStatus: 'in_stock' | 'partial_stock' | 'out_of_stock' | 'pending_check'
  stockQuantity: number

  procurementStatus: 'not_needed' | 'pending' | 'ordered' | 'received' | 'cancelled'
  purchaseQuantity: number
  purchaseOrderNumber?: string
  expectedDeliveryDate?: string

  procurementNotes: string
  lastUpdated: Date

  // Reference data for traceability
  budgetElementId: string
  budgetItemId: string
  libraryMaterialId?: number
}

export interface ProcurementTaskData {
  projectInfo: ProjectInfo
  budgetImported: boolean
  procurementItems: ProcurementItem[]
  budgetSummary: BudgetSummary
  lastImportDate: Date
}

/**
 * Mock API class for procurement operations
 */
class MockProcurementAPI {
  private mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

  /**
   * Get budget data for a task (mock implementation)
   */
  async getBudgetData(taskId: string, options: { scenario?: string; delay?: number } = {}): Promise<MockBudgetData> {
    const { scenario = 'default', delay = 1000 } = options

    await this.mockDelay(delay)

    // Mock budget data based on scenario
    const mockData: Record<string, MockBudgetData> = {
      default: {
        projectInfo: {
          projectId: `ENQ-${taskId}`,
          enquiryTitle: 'Corporate Event Setup',
          clientName: 'ABC Corporation',
          eventVenue: 'Nairobi Convention Center',
          setupDate: '2025-12-15',
          setDownDate: '2025-12-16'
        },
        materials: [
          {
            id: 'elem_1',
            name: 'STAGE',
            materials: [
              {
                id: 'mat_1',
                description: 'Stage Platform 2x2m',
                quantity: 4,
                unitPrice: 25000,
                totalPrice: 100000,
                unitOfMeasurement: 'Pcs'
              },
              {
                id: 'mat_2',
                description: 'Stage Risers 0.5m',
                quantity: 8,
                unitPrice: 15000,
                totalPrice: 120000,
                unitOfMeasurement: 'Pcs'
              }
            ]
          },
          {
            id: 'elem_2',
            name: 'LIGHTING',
            materials: [
              {
                id: 'mat_3',
                description: 'LED Par Lights',
                quantity: 20,
                unitPrice: 8000,
                totalPrice: 160000,
                unitOfMeasurement: 'Pcs'
              },
              {
                id: 'mat_4',
                description: 'Lighting Controller',
                quantity: 1,
                unitPrice: 50000,
                totalPrice: 50000,
                unitOfMeasurement: 'Pcs'
              }
            ]
          },
          {
            id: 'elem_3',
            name: 'SOUND',
            materials: [
              {
                id: 'mat_5',
                description: 'Speakers 12"',
                quantity: 4,
                unitPrice: 25000,
                totalPrice: 100000,
                unitOfMeasurement: 'Pcs'
              },
              {
                id: 'mat_6',
                description: 'Mixer Console',
                quantity: 1,
                unitPrice: 75000,
                totalPrice: 75000,
                unitOfMeasurement: 'Pcs'
              }
            ]
          }
        ],
        totals: {
          materialsTotal: 605000,
          totalItems: 6,
          importedAt: new Date()
        }
      }
    }

    return mockData[scenario] || mockData.default
  }

  /**
   * Get vendor suggestions for a material description
   */
  getVendorSuggestions(description: string): string[] {
    const suggestions: Record<string, string[]> = {
      'stage': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions'],
      'lighting': ['Light & Sound Pro', 'LED Solutions Ltd', 'Stage Lighting Corp'],
      'sound': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions'],
      'speaker': ['Audio Tech Ltd', 'Sound Systems Pro', 'Pro Audio Solutions'],
      'platform': ['Stage Masters Ltd', 'Event Structures Co.', 'Pro Stage Solutions'],
      'default': ['General Suppliers Ltd', 'Equipment Rental Co.', 'Tech Solutions Ltd']
    }

    const lowerDesc = description.toLowerCase()
    for (const [key, vendors] of Object.entries(suggestions)) {
      if (key !== 'default' && lowerDesc.includes(key)) {
        return vendors
      }
    }

    return suggestions.default
  }

  /**
   * Save procurement data (mock implementation)
   */
  async saveProcurementData(data: ProcurementTaskData): Promise<void> {
    await this.mockDelay(800)

    // In a real implementation, this would save to the backend
    console.log('Mock: Saving procurement data', {
      projectId: data.projectInfo.projectId,
      itemCount: data.procurementItems.length,
      totalValue: data.procurementItems.reduce((sum, item) => sum + item.budgetTotalPrice, 0)
    })

    // Simulate occasional save failures for testing
    if (Math.random() < 0.05) { // 5% chance of failure
      throw new Error('Mock: Network error during save')
    }
  }

  /**
   * Get procurement data for a task (mock implementation)
   */
  async getProcurementData(taskId: string): Promise<ProcurementTaskData | null> {
    await this.mockDelay(600)

    // Return null for new tasks, mock data for existing ones
    if (taskId === 'existing_task_123') {
      const budgetData = await this.getBudgetData(taskId)
      // Transform budget data to procurement format
      const procurementItems: ProcurementItem[] = []

      budgetData.materials.forEach(element => {
        element.materials.forEach(material => {
          procurementItems.push({
            budgetId: material.id,
            elementName: element.name,
            description: material.description,
            quantity: material.quantity,
            unitOfMeasurement: material.unitOfMeasurement,
            budgetUnitPrice: material.unitPrice,
            budgetTotalPrice: material.totalPrice,
            category: 'materials',
            vendorName: Math.random() > 0.5 ? this.getVendorSuggestions(material.description)[0] : '',

            // New fields with mock data
            stockStatus: 'pending_check',
            stockQuantity: 0,
            procurementStatus: 'pending',
            purchaseQuantity: material.quantity,

            procurementNotes: '',
            lastUpdated: new Date(),
            budgetElementId: element.id,
            budgetItemId: material.id,
            libraryMaterialId: undefined // Mock data doesn't have library IDs by default
          })
        })
      })

      return {
        projectInfo: budgetData.projectInfo,
        budgetImported: true,
        procurementItems,
        budgetSummary: budgetData.totals,
        lastImportDate: new Date()
      }
    }

    return null
  }
}

// Export singleton instance
export const mockProcurementAPI = new MockProcurementAPI()
