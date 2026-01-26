<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Work Orders</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage production work orders and assignments</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button 
          @click="syncWorkOrdersForProjects" 
          :disabled="syncing"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ syncing ? 'Syncing...' : 'Sync Projects' }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search work order number or title..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        <div>
          <select v-model="selectedStatus" @change="handleStatusFilter" class="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button 
          v-for="tab in statusTabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.key 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Loading work orders...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow p-4">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Work Orders Table -->
    <div v-if="!loading && filteredWorkOrders.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">WO Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assigned To</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="wo in filteredWorkOrders" :key="wo.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{{ wo.work_order_number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ wo.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ wo.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(wo.status_category)">
                  {{ formatStatusCategory(wo.status_category) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPriorityClass(wo.priority)">
                  {{ formatPriority(wo.priority) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(wo.due_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <span v-if="wo.project_officer_name" class="font-medium">
                  {{ wo.project_officer_name }}
                  <span class="text-xs text-gray-500 dark:text-gray-400 block">(Project Officer)</span>
                </span>
                <span v-else-if="wo.assignedTo?.name" class="font-medium">
                  {{ wo.assignedTo.name }}
                  <span class="text-xs text-gray-500 dark:text-gray-400 block">(Direct Assignment)</span>
                </span>
                <span v-else class="text-gray-500 dark:text-gray-400 italic">
                  Unassigned
                  <span class="text-xs block text-gray-400 dark:text-gray-500">
                    No project officer or direct assignment
                  </span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button @click="viewWorkOrder(wo.id)" class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="!loading && workOrders.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ ((currentPage - 1) * perPage) + 1 }} to {{ Math.min(currentPage * perPage, total) }} of {{ total }} work orders
        </div>
        
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <button 
              @click="prevPage" 
              :disabled="!hasPrevPage"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div class="flex items-center gap-1">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="typeof page === 'number' ? goToPage(page) : null"
                :class="[
                  'px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm rounded-md transition-colors',
                  page === currentPage 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600',
                  page === '...' ? 'cursor-default text-gray-500' : 'cursor-pointer',
                  page === '...' ? 'border-transparent' : ''
                ]"
                :disabled="page === '...'"

              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="!hasNextPage"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <label for="per-page">Items per page:</label>
            <select 
              id="per-page" 
              v-model="perPage" 
              @change="changePerPage(parseInt(($event.target as HTMLSelectElement).value))"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- No Work Orders Message -->
    <div v-if="!loading && filteredWorkOrders.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">No work orders found for the selected status.</p>
    </div>

    <!-- Edit Form Modal (no manual create) -->
    <WorkOrderForm
      v-if="editingId"
      :workOrderId="editingId"
      isEditOnly
      @close="handleFormClose"
      @saved="handleFormSaved"
    />

    <!-- View Details Modal -->
    <WorkOrderDetails
      v-if="viewingId"
      :workOrderId="viewingId"
      @close="viewingId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWorkOrders } from '../composables'
import { useAuth } from '../../../composables/useAuth'
import api from '../../../plugins/axios'
import WorkOrderForm from '../components/WorkOrderForm.vue'
import WorkOrderDetails from '../components/WorkOrderDetails.vue'

const {
  workOrders,
  loading,
  error,
  fetchWorkOrders,
  currentPage,
  perPage,
  total,
  totalPages,
  hasNextPage,
  hasPrevPage,
  goToPage,
  nextPage,
  prevPage,
  changePerPage
} = useWorkOrders()

const { user } = useAuth()

const searchQuery = ref('')
const selectedStatus = ref('')
const showCreateForm = ref(false)
const editingId = ref<number | null>(null)
const viewingId = ref<number | null>(null)
const syncing = ref(false)
const activeTab = ref('approved')
const searchTimeout = ref<number | null>(null)

// Status tabs configuration
const statusTabs = computed(() => {
  const allWorkOrders = workOrders.value || []
  return [
    {
      key: 'approved',
      label: 'Approved',
      count: allWorkOrders.filter(wo => wo.status_category === 'approved').length
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      count: allWorkOrders.filter(wo => wo.status_category === 'in_progress').length
    },
    {
      key: 'completed',
      label: 'Completed',
      count: allWorkOrders.filter(wo => wo.status_category === 'completed').length
    }
  ]
})

// Computed properties
const hasWorkOrders = computed(() => {
  return workOrders.value && workOrders.value.length > 0
})

// Generate page numbers for pagination
const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Show max 5 pages: current page and 2 before and after
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  // Always show first page if not in range
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  // Add pages in range
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // Always show last page if not in range
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

// Filter work orders based on active tab
const filteredWorkOrders = computed(() => {
  const allWorkOrders = workOrders.value || []
  
  if (activeTab.value === 'approved') {
    return allWorkOrders.filter(wo => wo.status_category === 'approved')
  } else if (activeTab.value === 'in_progress') {
    return allWorkOrders.filter(wo => wo.status_category === 'in_progress')
  } else if (activeTab.value === 'completed') {
    return allWorkOrders.filter(wo => wo.status_category === 'completed')
  }
  
  return allWorkOrders
})

onMounted(async () => {
  await fetchWorkOrders()
  await fetchProjectEnquiriesForWorkOrders()
})

const fetchProjectEnquiriesForWorkOrders = async () => {
  try {
    const workOrdersWithEnquiryId = workOrders.value.filter(wo => wo.project_enquiry_id)
    
    for (const wo of workOrdersWithEnquiryId) {
      if (!wo.projectEnquiry) {
        const enquiryResponse = await api.get(`/api/projects/enquiries/${wo.project_enquiry_id}`)
        if (enquiryResponse.data) {
          wo.projectEnquiry = enquiryResponse.data
        }
      }
    }
  } catch (error) {
    console.error('Error fetching project enquiries for work orders:', error)
  }
}

const handleSearch = () => {
  // Clear existing timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Set new timeout for debounced search
  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim()) {
      // Pass search filter to fetchWorkOrders
      await fetchWorkOrders({ search: searchQuery.value.trim() })
    } else {
      // Clear search and fetch all
      await fetchWorkOrders()
    }
    await fetchProjectEnquiriesForWorkOrders()
  }, 300) // 300ms debounce
}

const handleStatusFilter = async () => {
  const filters = selectedStatus.value ? { status: selectedStatus.value as any } : {}
  await fetchWorkOrders(filters)
  await fetchProjectEnquiriesForWorkOrders()
}

const viewWorkOrder = (id: number) => {
  viewingId.value = id
}

const editWorkOrder = (id: number) => {
  editingId.value = id
}

// Deletion disabled: work orders are removed when their parent enquiry is deleted.

const handleFormClose = () => {
  editingId.value = null
}

const syncWorkOrdersForProjects = async () => {
  syncing.value = true
  try {
    const response = await api.post('/api/production/work-orders/create-for-existing-projects')
    
    if (response.status !== 200) {
      console.error('API Error:', response.data)
      throw new Error(`Failed to sync work orders: ${response.status} ${response.statusText}`)
    }
    
    const result = response.data
    
    if (result.success) {
      alert(`Successfully created ${result.data.created} work orders!`)
      await fetchWorkOrders() // Refresh the list
    } else {
      alert('Error: ' + (result.error || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error syncing work orders:', error)
    alert('Failed to sync work orders. Please check console for details.')
  } finally {
    syncing.value = false
  }
}

const handleFormSaved = async () => {
  handleFormClose()
  await fetchWorkOrders()
}

// Helper functions
const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    on_hold: 'On Hold',
    cancelled: 'Cancelled'
  }
  return map[status] || status
}

const formatStatusCategory = (category: string) => {
  const map: Record<string, string> = {
    in_progress: 'In Progress',
    approved: 'Approved',
    completed: 'Completed'
  }
  return map[category] || category
}

const formatPriority = (priority: string) => {
  const map: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  }
  return map[priority] || priority
}

const formatDate = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status?: string) => {
  const classes = {
    in_progress: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    approved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    completed: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getPriorityClass = (priority?: string) => {
  const classes = {
    low: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    medium: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    high: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    urgent: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[priority as keyof typeof classes] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}
</script>

<style scoped>
.work-orders-container {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.sync-btn {
  padding: 0.6rem 1.2rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.sync-btn:hover:not(:disabled) {
  background-color: #1976d2;
}

.sync-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Status Tabs */
.status-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6b7280;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #2196f3;
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
  font-weight: 600;
}

.tab-count {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.tab-button.active .tab-count {
  color: #2196f3;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-input,
.filter-select {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-input {
  flex: 1;
}

.loading,
.error-message {
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
}

.work-orders-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.work-orders-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.work-orders-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.work-orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.wo-row:hover {
  background-color: #f9f9f9;
}

.wo-number {
  font-weight: 600;
  color: #2196f3;
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-approved {
  background-color: #e8f5e8;
  color: #0f766e;
}

.status-completed {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-on_hold {
  background-color: #f8d7da;
  color: #842029;
}

.status-cancelled {
  background-color: #e2e3e5;
  color: #383d41;
}

.priority-low {
  background-color: #d1ecf1;
  color: #0c5460;
}

.priority-medium {
  background-color: #d4edda;
  color: #155724;
}

.priority-high {
  background-color: #fff3cd;
  color: #856404;
}

.priority-urgent {
  background-color: #f8d7da;
  color: #842029;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-view {
  background-color: #2196f3;
  color: white;
}

.btn-view:hover {
  background-color: #0b7dda;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-edit:hover {
  background-color: #e68900;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #da190b;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
}

/* Pagination Styles */
.pagination-container {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.pagination-info {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  min-width: 2.5rem;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.ellipsis) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.page-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.page-btn.ellipsis {
  background: transparent;
  border: none;
  cursor: default;
  color: #6c757d;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.per-page-select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .pagination-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .pagination-buttons {
    justify-content: center;
  }
  
  .per-page-selector {
    justify-content: center;
  }
}
</style>
