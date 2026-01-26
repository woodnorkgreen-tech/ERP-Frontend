import { computed, reactive } from 'vue'
import type {
  BudgetElement,
  LabourType,
  ExpenseItem,
  LogisticsItem,
  MaterialsImportInfo,
  MaterialsUpdateCheckResponse
} from '../services/budgetService'

export interface BudgetFormData {
  projectInfo: {
    projectId: string
    enquiryTitle: string
    clientName: string
    eventVenue: string
    setupDate: string
    setDownDate: string
  }
  materials: BudgetElement[]
  labour: LabourType[]
  expenses: ExpenseItem[]
  logistics: LogisticsItem[]
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  materialsImportInfo?: MaterialsImportInfo
}

export interface BudgetState {
  // Loading states
  isLoading: boolean
  isSaving: boolean
  isImporting: boolean
  isCheckingUpdates: boolean

  // Messages
  error: string | null
  successMessage: string | null

  // Import related
  importStatus: MaterialsImportInfo | null
  materialsUpdateCheck: MaterialsUpdateCheckResponse | null
  materialsApprovalStatus: any | null

  // Form data
  formData: BudgetFormData
}

export function useBudgetState() {
  const state = reactive<BudgetState>({
    isLoading: false,
    isSaving: false,
    isImporting: false,
    isCheckingUpdates: false,
    error: null,
    successMessage: null,
    importStatus: null,
    materialsUpdateCheck: null,
    materialsApprovalStatus: null,
    formData: {
      projectInfo: {
        projectId: '',
        enquiryTitle: '',
        clientName: '',
        eventVenue: '',
        setupDate: '',
        setDownDate: '',
      },
      materials: [],
      labour: [],
      expenses: [],
      logistics: [],
      status: 'draft',
    },
  })

  // Computed properties for totals
  const materialsTotal = computed(() => {
    if (!state.formData.materials || !Array.isArray(state.formData.materials)) {
      return 0
    }

    const obsoleteIds = state.materialsUpdateCheck?.analysis?.obsolete_persistent_ids || []

    return state.formData.materials.reduce((total, element) => {
      if (!element.materials || !Array.isArray(element.materials)) {
        return total
      }

      const elementTotal = element.materials.reduce((sum, material) => {
        // Identification Logic (Must match Tab and Backend)
        let idKey = material.persistent_id
        if (!idKey) {
          const eName = element.name.toLowerCase().replace(/\s+/g, '')
          const mDesc = material.description.toLowerCase().replace(/\s+/g, '')
          idKey = `legacy_${eName}_${mDesc}`
        }

        // 1. Exclude obsolete materials from the budget total
        if (obsoleteIds.includes(idKey)) return sum

        // 2. Exclude items that are not marked as 'Included'
        if (material.isIncluded === false) return sum

        return sum + (material.totalPrice || 0)
      }, 0)

      return total + elementTotal
    }, 0)
  })

  const labourTotal = computed(() => {
    if (!state.formData.labour || !Array.isArray(state.formData.labour)) {
      return 0
    }
    return state.formData.labour.reduce((total, item) => {
      const isIncluded = (item as any).isIncluded !== false
      return total + (isIncluded ? (item.amount || 0) : 0)
    }, 0)
  })

  const expensesTotal = computed(() => {
    if (!state.formData.expenses || !Array.isArray(state.formData.expenses)) {
      return 0
    }
    return state.formData.expenses.reduce((total, item) => {
      // Note: Expenses uses 'isOfScope' in some parts of the system
      const isIncluded = (item as any).isIncluded !== false && (item as any).isOfScope !== false
      return total + (isIncluded ? (item.amount || 0) : 0)
    }, 0)
  })

  const logisticsTotal = computed(() => {
    if (!state.formData.logistics || !Array.isArray(state.formData.logistics)) {
      return 0
    }
    return state.formData.logistics.reduce((total, item) => {
      const isIncluded = (item as any).isIncluded !== false
      return total + (isIncluded ? (item.amount || 0) : 0)
    }, 0)
  })

  const grandTotal = computed(() => {
    return materialsTotal.value + labourTotal.value + expensesTotal.value + logisticsTotal.value
  })

  // Helper functions
  const clearMessages = () => {
    state.error = null
    state.successMessage = null
  }

  const setError = (message: string) => {
    state.error = message
    state.successMessage = null
  }

  const setSuccess = (message: string) => {
    state.successMessage = message
    state.error = null
  }

  const resetState = () => {
    state.isLoading = false
    state.isSaving = false
    state.isImporting = false
    state.isCheckingUpdates = false
    clearMessages()
  }

  return {
    state,
    materialsTotal,
    labourTotal,
    expensesTotal,
    logisticsTotal,
    grandTotal,
    clearMessages,
    setError,
    setSuccess,
    resetState,
  }
}
