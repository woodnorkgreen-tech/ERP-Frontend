<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/procurement/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            v-model="searchTerm"
            @input="handleSearch"
            type="text"
            placeholder="Search requisitions..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

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
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading requisitions...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Requisition #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Requested By</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="req in requisitions"
              :key="req.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              @click="viewRequisition(req.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ req.requisition_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(req.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ getRequestedBy(req) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ req.items?.length || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                KES {{ formatNumber(req.total_amount || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusClass(req.status)]"
                >
                  {{ formatStatus(req.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                <router-link
                  :to="`/procurement/requisition/${req.id}`"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  View
                </router-link>
                <router-link
                  v-if="req.status === 'draft'"
                  :to="`/procurement/requisition/${req.id}/edit`"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </router-link>
                <button
                  v-if="req.status === 'pending_approval' && canApproveOrDelete"
                  @click="approveRequisition(req.id)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  Approve
                </button>
                <button
                  v-if="req.status === 'pending_approval' && canApproveOrDelete"
                  @click="openRejectModal(req)"
                  class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-3"
                >
                  Reject
                </button>
                <button
                  v-if="canApproveOrDelete"
                  @click="deleteRequisition(req.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reject Modal -->
    <Teleport to="body">
      <div
        v-if="showRejectModal"
        class="fixed inset-0 z-[9999] overflow-y-auto"
        @click.self="closeRejectModal"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full" @click.stop>
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Reject Requisition</h3>
            </div>
            <div class="px-6 py-4">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Provide reason for rejecting <strong>{{ requisitionToReject?.requisition_number }}</strong>
              </p>
              <textarea
                v-model="rejectionReason"
                rows="4"
                placeholder="Enter rejection reason..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3">
              <button
                @click="closeRejectModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                @click="rejectRequisition"
                :disabled="!rejectionReason.trim()"
                class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()

const requisitions = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const filters = ref({
  status: '',
  urgency: ''
})

const showRejectModal = ref(false)
const requisitionToReject = ref<any>(null)
const rejectionReason = ref('')
const currentUser = ref<any>(null)

// Check if user can approve/delete based on their roles
const canApproveOrDelete = computed(() => {
  if (!currentUser.value?.roles) return false
  
  const allowedRoles = ['Super Admin', 'Admin', 'Accounts']
  return currentUser.value.roles.some((role: any) => allowedRoles.includes(role.name))
})

// Fetch current user
const fetchCurrentUser = async () => {
  try {
    const response = await axios.get('/api/user')
    currentUser.value = response.data
  } catch (err) {
    console.error('Failed to fetch user:', err)
  }
}

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
    error.value = err.response?.data?.message || 'Failed to load requisitions'
  } finally {
    loading.value = false
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      loading.value = true
      try {
        const response = await axios.post('/api/procurement-stores/search/requisitions', {
          searchTerm: searchTerm.value
        })
        requisitions.value = response.data.data || response.data || []
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        loading.value = false
      }
    } else {
      await loadRequisitions()
    }
  }, 300)
}

const applyFilters = async () => {
  await loadRequisitions()
}

const viewRequisition = (id: number) => {
  router.push(`/procurement/requisition/${id}`)
}

const approveRequisition = async (id: number) => {
  if (!confirm('Are you sure you want to approve this requisition?')) return
  
  try {
    await axios.post(`/api/procurement-stores/requisitions/${id}/approve`)
    await loadRequisitions()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to approve requisition')
  }
}

const openRejectModal = (req: any) => {
  requisitionToReject.value = req
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
    closeRejectModal()
    await loadRequisitions()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to reject requisition')
  }
}

const deleteRequisition = async (id: number) => {
  if (!confirm('Are you sure you want to delete this requisition?')) return
  
  try {
    await axios.delete(`/api/procurement-stores/requisitions/${id}`)
    await loadRequisitions()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete requisition')
  }
}

const getRequestedBy = (req: any) => {
  if (req.requested_by_type === 'project' && req.project) {
    return `${req.project.project_id} - ${req.project.enquiry?.title || 'Project'}`
  } else if (req.requested_by_type === 'employee' && req.employee) {
    return req.employee.name
  } else if (req.requested_by_type === 'office' && req.department) {
    return req.department.name
  }
  return 'N/A'
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatNumber = (num: number) => new Intl.NumberFormat().format(num)
const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1)

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || classes.draft
}

onMounted(async () => {
  await fetchCurrentUser()
  await loadRequisitions()
})
</script>