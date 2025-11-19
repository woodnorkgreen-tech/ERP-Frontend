import { ref, reactive, computed, onMounted } from 'vue'
import { ProcurementService } from '@/modules/projects/services'
import type { ProcurementTaskData, ProjectInfo } from '@/modules/projects/services'

export function useProcurementData(taskId?: number) {
  const procurementData = reactive<ProcurementTaskData>({
    projectInfo: {} as ProjectInfo,
    budgetImported: false,
    procurementItems: [],
    budgetSummary: {
      materialsTotal: 0,
      totalItems: 0,
      importedAt: new Date()
    },
    lastImportDate: new Date()
  })

  const isImporting = ref(false)
  const importError = ref<string | null>(null)

  // Load procurement data on mount if taskId is provided
  const loadProcurementData = async () => {
    if (!taskId) {
      console.log('useProcurementData: No taskId provided, skipping load')
      return
    }

    console.log('useProcurementData: Starting to load procurement data for task', taskId)

    try {
      isImporting.value = true
      importError.value = null

      console.log('useProcurementData: Fetching existing procurement data...')
      // First try to load existing procurement data
      const existingData = await ProcurementService.getProcurementData(taskId)

      console.log('useProcurementData: Received response:', existingData)

      if (existingData) {
        // Load existing data
        Object.assign(procurementData, existingData)
        console.log('useProcurementData: Loaded existing procurement data with', existingData.procurementItems?.length || 0, 'items')
        return
      }

      // If no existing data, import budget data
      console.log('useProcurementData: No existing data found, importing from budget...')
      const importedData = await ProcurementService.importBudgetData(taskId)
      Object.assign(procurementData, importedData)
      console.log('useProcurementData: Successfully imported budget data with', importedData.procurementItems?.length || 0, 'items')

    } catch (error) {
      console.error('useProcurementData: Failed to load/import procurement data:', error)
      importError.value = error instanceof Error ? error.message : 'Failed to load procurement data'
    } finally {
      console.log('useProcurementData: Finished loading, setting isImporting to false')
      isImporting.value = false
    }
  }

  // Manual import function for retry
  const importBudgetData = async () => {
    if (!taskId) return

    try {
      isImporting.value = true
      importError.value = null

      const importedData = await ProcurementService.importBudgetData(taskId)
      Object.assign(procurementData, importedData)
      console.log('Successfully imported budget data:', importedData)

    } catch (error) {
      console.error('Failed to import budget data:', error)
      importError.value = error instanceof Error ? error.message : 'Failed to import budget data'
    } finally {
      isImporting.value = false
    }
  }

  // Initialize data loading
  if (taskId) {
    console.log('useProcurementData: Setting up onMounted hook for task', taskId)
    onMounted(() => {
      console.log('useProcurementData: onMounted triggered, calling loadProcurementData')
      loadProcurementData()
    })
  } else {
    console.log('useProcurementData: No taskId provided, skipping onMounted setup')
  }

  const totalBudget = computed(() =>
    procurementData.budgetSummary.materialsTotal
  )

  const totalSpent = computed(() =>
    procurementData.procurementItems.reduce(
      (total, item) => total + item.budgetTotalPrice,
      0
    )
  )

  const budgetVariance = computed(() =>
    totalBudget.value - totalSpent.value
  )

  const overallCompletionPercentage = computed(() => {
    if (procurementData.procurementItems.length === 0) return 0

    const completedStatuses = ['received', 'hired']
    const completedItems = procurementData.procurementItems.filter(item =>
      completedStatuses.includes(item.availabilityStatus)
    ).length

    return Math.round((completedItems / procurementData.procurementItems.length) * 100)
  })

  const completedItemsCount = computed(() => {
    const completedStatuses = ['received', 'hired']
    return procurementData.procurementItems.filter(item =>
      completedStatuses.includes(item.availabilityStatus)
    ).length
  })

  return {
    procurementData,
    isImporting,
    importError,
    totalBudget,
    totalSpent,
    budgetVariance,
    overallCompletionPercentage,
    completedItemsCount,
    importBudgetData,
    loadProcurementData
  }
}
