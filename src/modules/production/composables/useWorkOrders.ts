import { ref, computed } from 'vue'
import { workOrderService } from '../services'
import type { WorkOrder, WorkOrderFilters, CreateWorkOrderPayload, UpdateWorkOrderPayload } from '../types'

export function useWorkOrders() {
  const workOrders = ref<WorkOrder[]>([])
  const selectedWorkOrder = ref<WorkOrder | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<WorkOrderFilters>({})
  const currentPage = ref(1)
  const perPage = ref(25)
  const total = ref(0)

  /**
   * Fetch work orders
   */
  const fetchWorkOrders = async (newFilters?: WorkOrderFilters) => {
    loading.value = true
    error.value = null

    try {
      if (newFilters) {
        filters.value = newFilters
        currentPage.value = 1
      }

      // Add pagination parameters to filters
      const paginationFilters = {
        ...filters.value,
        page: currentPage.value,
        per_page: perPage.value
      }

      const response = await workOrderService.getWorkOrders(paginationFilters)
      // Handle different response structures
      if (response.data && Array.isArray(response.data.data)) {
        // Laravel paginated response
        workOrders.value = response.data.data
        currentPage.value = response.data.current_page || 1
        perPage.value = response.data.per_page || 25
        total.value = response.data.total || 0
      } else if (Array.isArray(response.data)) {
        // Direct array response
        workOrders.value = response.data
        currentPage.value = 1
        perPage.value = response.data.length
        total.value = response.data.length
      } else if (Array.isArray(response)) {
        // Direct array response (no data wrapper)
        workOrders.value = response
        currentPage.value = 1
        perPage.value = response.length
        total.value = response.length
      } else {
        // Fallback
        workOrders.value = []
        currentPage.value = 1
        perPage.value = 25
        total.value = 0
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch work orders'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single work order
   */
  const fetchWorkOrder = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await workOrderService.getWorkOrder(id)
      selectedWorkOrder.value = response.data || response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch work order'
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new work order
   */

  /**
   * Update a work order
   */
  const updateWorkOrder = async (id: number, payload: UpdateWorkOrderPayload) => {
    loading.value = true
    error.value = null

    try {
      const response = await workOrderService.updateWorkOrder(id, payload)
      const index = workOrders.value.findIndex(wo => wo.id === id)
      if (index !== -1) {
        workOrders.value[index] = response.data || response
      }
      if (selectedWorkOrder.value?.id === id) {
        selectedWorkOrder.value = response.data || response
      }
      return response.data || response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update work order'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a work order
   */

  /**
   * Fetch work orders for a specific enquiry
   */
  const fetchWorkOrdersByEnquiry = async (enquiryId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await workOrderService.getWorkOrdersByEnquiry(enquiryId)
      workOrders.value = response.data || response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch work orders'
    } finally {
      loading.value = false
    }
  }

  /**
   * Set filter and refetch
   */
  const setFilter = async (newFilters: WorkOrderFilters) => {
    await fetchWorkOrders(newFilters)
  }

  /**
   * Clear filters
   */
  const clearFilters = async () => {
    filters.value = {}
    await fetchWorkOrders()
  }

  /**
   * Go to specific page
   */
  const goToPage = async (page: number) => {
    currentPage.value = page
    await fetchWorkOrders()
  }

  /**
   * Go to next page
   */
  const nextPage = async () => {
    if (currentPage.value < totalPages.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  /**
   * Go to previous page
   */
  const prevPage = async () => {
    if (currentPage.value > 1) {
      await goToPage(currentPage.value - 1)
    }
  }

  /**
   * Change items per page
   */
  const changePerPage = async (newPerPage: number) => {
    perPage.value = newPerPage
    currentPage.value = 1
    await fetchWorkOrders()
  }

  // Computed properties
  const totalPages = computed(() => Math.ceil(total.value / perPage.value))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  const activeWorkOrders = computed(() =>
    workOrders.value.filter(wo => ['pending', 'in_progress'].includes(wo.status))
  )

  const completedWorkOrders = computed(() =>
    workOrders.value.filter(wo => wo.status === 'completed')
  )

  const hasWorkOrders = computed(() => workOrders.value.length > 0)

  return {
    // State
    workOrders,
    selectedWorkOrder,
    loading,
    error,
    filters,
    currentPage,
    perPage,
    total,

    // Methods
    fetchWorkOrders,
    fetchWorkOrder,
    updateWorkOrder,
    fetchWorkOrdersByEnquiry,
    setFilter,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    changePerPage,

    // Computed
    totalPages,
    hasNextPage,
    hasPrevPage,
    activeWorkOrders,
    completedWorkOrders,
    hasWorkOrders
  }
}
