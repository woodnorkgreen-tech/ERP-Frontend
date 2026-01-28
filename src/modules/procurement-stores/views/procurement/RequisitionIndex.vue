<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Home
          </router-link>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Requisitions</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Requisitions</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and track material requisitions</p>
      </div>
      <router-link
        to="/procurement/requisition/create"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Requisition
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="Search by requisition number, project, or employee..."
              class="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Urgency Filter -->
        <div>
          <select
            v-model="filters.urgency"
            @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Urgency</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <!-- Clear Filters -->
      <div v-if="hasActiveFilters" class="mt-4">
        <button
          @click="clearFilters"
          class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading requisitions...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-700 p-8">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error Loading Requisitions</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <button
          @click="loadRequisitions"
          class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="requisitions.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Requisitions Found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchTerm || hasActiveFilters ? 'Try adjusting your search or filters' : 'Get started by creating a new requisition' }}
        </p>
        <router-link
          v-if="!searchTerm && !hasActiveFilters"
          to="/procurement/requisition/create"
          class="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Requisition
        </router-link>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Requisition #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Requested By
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Urgency
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="requisition in requisitions"
              :key="requisition.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ requisition.requisition_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(requisition.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ getRequestedBy(requisition) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ requisition.department?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ requisition.items?.length || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                KES {{ formatNumber(requisition.total_amount || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    requisition.urgency === 'urgent' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ requisition.urgency === 'urgent' ? 'Urgent' : 'Normal' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(requisition.status)">
                  {{ formatStatus(requisition.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <!-- View Button -->
                  <button
                    @click="viewRequisition(requisition.id)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <!-- Edit Button (draft only) -->
                  <button
                    v-if="requisition.status === 'draft'"
                    @click="editRequisition(requisition.id)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Approve Button (pending only) -->
                  <button
                    v-if="requisition.status === 'pending_approval'"
                    @click="approveRequisition(requisition)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded"
                    title="Approve"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <!-- Reject Button (pending only) -->
                  <button
                    v-if="requisition.status === 'pending_approval'"
                    @click="openRejectModal(requisition)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded"
                    title="Reject"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button
                    @click="confirmDelete(requisition)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeRejectModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Requisition</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please provide a reason for rejecting requisition <strong>{{ requisitionToReject?.requisition_number }}</strong>
        </p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          placeholder="Enter rejection reason..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        ></textarea>
        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="closeRejectModal"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="rejectRequisition"
            :disabled="!rejectionReason.trim()"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Requisition</h3>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete requisition <strong>{{ requisitionToDelete?.requisition_number }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="deleteRequisition"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()

// State
const requisitions = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const filters = ref({
  status: '',
  urgency: ''
})

// Modals
const showRejectModal = ref(false)
const showDeleteModal = ref(false)
const requisitionToReject = ref<any>(null)
const requisitionToDelete = ref<any>(null)
const rejectionReason = ref('')

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || filters.value.urgency !== '' || searchTerm.value !== ''
})

// Methods
const loadRequisitions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params: any = {}
    
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.urgency) params.urgency = filters.value.urgency
    
    const response = await axios.get('/api/procurement-stores/requisitions', { params })
    requisitions.value = response.data.data || response.data || []
  } catch (err: any) {
    console.error('Failed to load requisitions:', err)
    error.value = err.response?.data?.message || 'Failed to load requisitions. Please try again.'
  } finally {
    loading.value = false
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      await searchRequisitions()
    } else {
      await loadRequisitions()
    }
  }, 500)
}

const searchRequisitions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('/api/procurement-stores/search/requisitions', {
      searchTerm: searchTerm.value
    })
    requisitions.value = response.data.data || response.data || []
  } catch (err: any) {
    console.error('Search failed:', err)
    error.value = 'Search failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  await loadRequisitions()
}

const clearFilters = async () => {
  filters.value = { status: '', urgency: '' }
  searchTerm.value = ''
  await loadRequisitions()
}

const viewRequisition = (id: number) => {
  router.push(`/procurement/requisition/${id}`)
}

const editRequisition = (id: number) => {
  router.push(`/procurement/requisition/${id}/edit`)
}

const approveRequisition = async (requisition: any) => {
  if (!confirm(`Are you sure you want to approve requisition ${requisition.requisition_number}?`)) return

  try {
    await axios.post(`/api/procurement-stores/requisitions/${requisition.id}/approve`)
    alert('Requisition approved successfully')
    await loadRequisitions()
  } catch (err: any) {
    if (err.response?.status === 403) {
      alert('Unauthorized: You do not have permission to approve requisitions.')
    } else {
      alert(err.response?.data?.message || 'Failed to approve requisition')
    }
  }
}

const openRejectModal = (requisition: any) => {
  requisitionToReject.value = requisition
  rejectionReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  requisitionToReject.value = null
  rejectionReason.value = ''
}

const rejectRequisition = async () => {
  if (!rejectionReason.value.trim()) return

  try {
    await axios.post(`/api/procurement-stores/requisitions/${requisitionToReject.value.id}/reject`, {
      reason: rejectionReason.value
    })
    alert('Requisition rejected successfully')
    closeRejectModal()
    await loadRequisitions()
  } catch (err: any) {
    if (err.response?.status === 403) {
      alert('Unauthorized: You do not have permission to reject requisitions.')
    } else {
      alert(err.response?.data?.message || 'Failed to reject requisition')
    }
  }
}

const confirmDelete = (requisition: any) => {
  requisitionToDelete.value = requisition
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  requisitionToDelete.value = null
}

const deleteRequisition = async () => {
  try {
    await axios.delete(`/api/procurement-stores/requisitions/${requisitionToDelete.value.id}`)
    alert('Requisition deleted successfully')
    closeDeleteModal()
    await loadRequisitions()
  } catch (err: any) {
    if (err.response?.status === 403) {
      alert('Unauthorized: You do not have permission to delete requisitions.')
    } else {
      alert(err.response?.data?.message || 'Failed to delete requisition')
    }
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'pending_approval': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'draft': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'pending_approval': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'approved': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'rejected': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  }
  return classes[status] || classes['draft']
}

const getRequestedBy = (requisition: any) => {
  if (requisition.requested_by_type === 'project' && requisition.project) {
    return requisition.project.project_name || 'Project'
  } else if (requisition.requested_by_type === 'employee' && requisition.employee) {
    return `${requisition.employee.first_name} ${requisition.employee.last_name}`
  } else if (requisition.requested_by_type === 'office') {
    return 'Office'
  }
  return 'N/A'
}

onMounted(async () => {
  await loadRequisitions()
})
</script>