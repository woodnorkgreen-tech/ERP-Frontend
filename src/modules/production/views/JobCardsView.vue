<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Job Cards</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage production job cards and track technician time</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="showCreateForm = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Job Card
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Job Cards</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.completed }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.inProgress }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-red-100 dark:bg-red-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.onHold }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <div class="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-1">
          <button
            @click="viewAll"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              !filters.date_from && !filters.date_to
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            View All
          </button>
          <button
            @click="resetDates"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              filters.date_from && filters.date_to && filters.date_from === filters.date_to && filters.date_from === new Date().toISOString().split('T')[0]
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            Show Today
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by worker name, notes, or tasks..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technician</label>
          <select
            v-model="filters.worker_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Technicians</option>
            <option
              v-for="technician in technicians"
              :key="technician.id"
              :value="technician.id"
            >
              {{ technician.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
          <input
            v-model="filters.date_from"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Job Cards Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Worker
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Hours
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tasks
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="jobCard in jobCards" :key="jobCard.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ jobCard.worker?.full_name || `${jobCard.worker?.first_name || ''} ${jobCard.worker?.last_name || ''}`.trim() || 'Unknown Worker' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(jobCard.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(jobCard.status)">
                  {{ formatStatus(jobCard.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ jobCard.total_hours }}h
                <span v-if="jobCard.overtime_hours > 0" class="text-orange-600 dark:text-orange-400">
                  (+{{ jobCard.overtime_hours }}h OT)
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ jobCard.tasks?.length || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewJobCard(jobCard)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                  >
                    View
                  </button>
                  <button
                    @click="editJobCard(jobCard)"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteJobCard(jobCard)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                  <div class="relative" @click.stop>
                    <button
                      @click="toggleStatusDropdown(jobCard.id)"
                      :data-dropdown-id="jobCard.id"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    >
                      Status
                      <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      v-if="statusDropdownOpen === jobCard.id"
                      class="fixed z-50 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600"
                      :style="getDropdownPosition(jobCard.id)"
                    >
                      <div class="py-1">
                        <button
                          v-for="status in getAvailableStatuses(jobCard.status)"
                          :key="status.value"
                          @click="updateJobCardStatus(jobCard.id, status.value)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {{ status.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.current_page >= pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ ((pagination.current_page - 1) * pagination.per_page) + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
              of
              <span class="font-medium">{{ pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="prevPage"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.current_page >= pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <JobCardForm
      v-if="showCreateForm || editingJobCard"
      :job-card="editingJobCard"
      @cancel="closeForm"
      @saved="handleSaved"
    />

    <JobCardForm
      v-if="viewingJobCard"
      :job-card="viewingJobCard"
      read-only
      @cancel="viewingJobCard = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useJobCards, useProductionReports } from '../composables/useJobCards'
import JobCardDetails from '../components/JobCardDetails.vue'
import JobCardForm from '../components/JobCardForm.vue'
import { jobCardsService } from '../services/jobCards'
import type { JobCard, JobCardFilters } from '../types'

const { 
  jobCards, 
  pagination,
  loading, 
  error, 
  filters, 
  fetchJobCards, 
  createJobCard,
  updateJobCard
} = useJobCards()

const { technicians, fetchTechnicians } = useProductionReports()

const showCreateForm = ref(false)
const editingJobCard = ref<JobCard | null>(null)
const viewingJobCard = ref<JobCard | null>(null)

const stats = computed(() => {
  return {
    total: jobCards.value.length,
    completed: jobCards.value.filter((job: any) => job.status === 'approved').length,
    inProgress: jobCards.value.filter((job: any) => job.status === 'pending_approval').length,
    onHold: jobCards.value.filter((job: any) => job.status === 'rejected').length
  }
})

const getStatusClass = (status?: string) => {
  const classes = {
    pending_approval: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    approved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const formatStatus = (status?: string) => {
  return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const resetDates = () => {
  const today = new Date().toISOString().split('T')[0]
  filters.date_from = today
  filters.date_to = today
}

const viewAll = () => {
  filters.date_from = ''
  filters.date_to = ''
  filters.status = undefined
  filters.worker_id = undefined
  filters.search = ''
}

const viewJobCard = async (jobCard: JobCard) => {
  try {
    // Fetch the complete job card data with all relationships
    const response = await jobCardsService.getJobCard(jobCard.id)
    if (response.success) {
      viewingJobCard.value = response.data
    } else {
      console.error('Failed to fetch job card details:', response.message)
      viewingJobCard.value = jobCard // Fallback to table data
    }
  } catch (error) {
    console.error('Error fetching job card details:', error)
    viewingJobCard.value = jobCard // Fallback to table data
  }
}

const editJobCard = (jobCard: JobCard) => {
  editingJobCard.value = jobCard
  viewingJobCard.value = null
}

const deleteJobCard = async (jobCard: JobCard) => {
  if (!confirm(`Are you sure you want to delete job card ${jobCard.job_card_number || jobCard.id}? This action cannot be undone.`)) {
    return
  }

  try {
    const response = await jobCardsService.deleteJobCard(jobCard.id)
    
    if (response.success) {
      // Refresh the job cards list
      await fetchJobCards()
      // Show success message (you could add a toast notification here)
      console.log('Job card deleted successfully:', response.message)
    } else {
      console.error('Failed to delete job card:', response.message)
      alert('Failed to delete job card: ' + response.message)
    }
  } catch (error: any) {
    console.error('Error deleting job card:', error)
    console.error('Error response:', error.response?.data)
    alert('Error deleting job card: ' + (error.response?.data?.message || error.message))
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingJobCard.value = null
}

const handleSaved = () => {
  closeForm()
  fetchJobCards()
}

const prevPage = () => {
  if (pagination.value.current_page > 1) {
    filters.page = pagination.value.current_page - 1
    fetchJobCards()
  }
}

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    filters.page = pagination.value.current_page + 1
    fetchJobCards()
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    statusDropdownOpen.value = null
  }
}

// Status management
const statusDropdownOpen = ref<number | null>(null)

const toggleStatusDropdown = (jobCardId: number) => {
  statusDropdownOpen.value = statusDropdownOpen.value === jobCardId ? null : jobCardId
}

const getDropdownPosition = (jobCardId: number) => {
  // Find the button element for this job card
  const button = document.querySelector(`[data-dropdown-id="${jobCardId}"]`) as HTMLElement
  if (!button) {
    return { top: '0px', left: '0px' }
  }
  
  const rect = button.getBoundingClientRect()
  const dropdownHeight = 200 // Approximate height of dropdown
  const dropdownWidth = 192 // w-48 = 12rem = 192px
  
  // Position dropdown above the button if there's not enough space below
  const spaceBelow = window.innerHeight - rect.bottom
  const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight
  
  return {
    top: showAbove ? `${rect.top - dropdownHeight - 8}px` : `${rect.bottom + 8}px`,
    left: `${rect.right - dropdownWidth}px`
  }
}

const getAvailableStatuses = (currentStatus: string) => {
  const statuses = [
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  // Define allowed transitions (same as backend)
  const allowedTransitions: { [key: string]: string[] } = {
    'pending_approval': ['pending_approval', 'approved', 'rejected'],
    'approved': ['approved', 'pending_approval', 'rejected'], // Can go back to pending or rejected
    'rejected': ['pending_approval', 'approved', 'rejected'], // Can go to pending, approved, or stay rejected
  }

  return statuses.filter(status => 
    allowedTransitions[currentStatus]?.includes(status.value)
  )
}

const updateJobCardStatus = async (jobCardId: number, newStatus: string) => {
  try {
    console.log('Updating job card status:', { jobCardId, newStatus })
    
    const response = await jobCardsService.updateJobCardStatus(jobCardId, newStatus)
    
    console.log('Status update response:', response)
    
    if (response.success) {
      // Close dropdown
      statusDropdownOpen.value = null
      
      // Update the local data immediately for better UX
      const jobCardIndex = jobCards.value.findIndex((job: any) => job.id === jobCardId)
      console.log('Job card index:', jobCardIndex)
      if (jobCardIndex !== -1) {
        console.log('Before update:', jobCards.value[jobCardIndex].status)
        jobCards.value[jobCardIndex].status = newStatus as any
        console.log('After update:', jobCards.value[jobCardIndex].status)
      }
      
      // Don't refresh immediately - let the local update show the change
      // The data will be refreshed on next page load or filter change
      
      // Show success message (you could add a toast notification here)
      console.log('Status updated successfully:', response.message)
    } else {
      console.error('Failed to update status:', response.message)
      // Show error message
      alert('Failed to update status: ' + response.message)
    }
  } catch (error: any) {
    console.error('Error updating job card status:', error)
    console.error('Error response:', error.response?.data)
    // Show error message
    alert('Error updating status: ' + (error.response?.data?.message || error.message))
  }
}

// Watch for filter changes
watch(() => filters, () => {
  fetchJobCards()
}, { deep: true })

onMounted(async () => {
  // Set default filters
  const today = new Date().toISOString().split('T')[0]
  filters.date_from = today
  filters.date_to = today
  
  await Promise.all([
    fetchJobCards(),
    fetchTechnicians()
  ])
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
