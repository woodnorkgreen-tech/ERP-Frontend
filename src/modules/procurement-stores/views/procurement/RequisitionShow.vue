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
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/procurement/requisitions" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Requisitions
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Details</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Requisition Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ requisition.requisition_number }}</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="requisition.status === 'draft'"
          @click="submitForApproval"
          :disabled="submitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Submit for Approval
        </button>
        <button
          v-if="requisition.status === 'pending_approval' && canApprove"
          @click="approveRequisition"
          :disabled="submitting"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
        >
          Approve
        </button>
        <button
          v-if="requisition.status === 'pending_approval' && canApprove"
          @click="showRejectModal = true"
          :disabled="submitting"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
        >
          Reject
        </button>
        <router-link
          v-if="requisition.status === 'approved'"
          :to="`/procurement/purchase-order/link-from-requisition/${id}`"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create Purchase Order
        </router-link>
        <router-link
          v-if="requisition.status === 'draft'"
          :to="`/procurement/requisition/${id}/edit`"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit
        </router-link>
        <button
          v-if="requisition.status === 'draft'"
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading requisition details...</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <!-- Requisition Details -->
    <div v-else>
      <!-- Basic Info -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Requisition Number</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ requisition.requisition_number }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(requisition.date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(requisition.status)
              ]"
            >
              {{ formatStatus(requisition.status) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Requested By Type</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatRequestedByType(requisition.requested_by_type) }}</p>
          </div>
          <div v-if="requisition.project">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ requisition.project.project_id }} - {{ requisition.project.name }}
            </p>
          </div>
          <div v-if="requisition.employee">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Employee</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ requisition.employee.name }}</p>
          </div>
          <div v-if="requisition.department">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Department</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ requisition.department.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Urgency</label>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                requisition.urgency === 'urgent'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              ]"
            >
              {{ requisition.urgency }}
            </span>
          </div>
          <div v-if="requisition.createdBy">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created By</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
             {{ requisition.createdBy.name }}
            </p>
          </div>
          <div v-if="requisition.approvedBy">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Approved By</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
             {{ requisition.approvedBy.name }}
            </p>
          </div>
        </div>

        <div v-if="requisition.rejection_reason" class="mt-4">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rejection Reason</label>
          <p class="text-base text-red-600 dark:text-red-400">{{ requisition.rejection_reason }}</p>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requisition Items</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">SKU</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Purpose</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reason</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in requisition.items" :key="item.id">
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.material?.material_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.material?.material_code }}</td>
                <td class="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">{{ item.quantity }}</td>
                <td class="px-6 py-4 text-sm text-right text-gray-900 dark:text-white">KES {{ formatNumber(item.unit_price || 0) }}</td>
                <td class="px-6 py-4 text-sm text-right font-semibold text-gray-900 dark:text-white">KES {{ formatNumber(item.total || 0) }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.purpose }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.reason || 'N/A' }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <td colspan="4" class="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Total Amount:</td>
                <td class="px-6 py-4 text-right text-base font-bold text-gray-900 dark:text-white">KES {{ formatNumber(calculateTotal()) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showRejectModal = false"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Reject Requisition</h3>
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="Enter reason for rejection..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="rejectRequisition"
              :disabled="!rejectReason || submitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Reject
            </button>
            <button
              @click="showRejectModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const requisition = ref<any>({})
const showRejectModal = ref(false)
const rejectReason = ref('')
const currentUser = ref<any>(null)

// Check if user can approve based on their roles
const canApprove = computed(() => {
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

const fetchRequisition = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.get(`/api/procurement-stores/requisitions/${id}`)
    if (response.data && response.data.data) {
      requisition.value = response.data.data
    } else {
      requisition.value = response.data
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load requisition details'
  } finally {
    loading.value = false
  }
}

const submitForApproval = async () => {
  if (!confirm('Submit this requisition for approval?')) return
  
  submitting.value = true
  try {
    await axios.post(`/api/procurement-stores/requisitions/${id}/submit`)
    await fetchRequisition()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Failed to submit requisition'
  } finally {
    submitting.value = false
  }
}

const approveRequisition = async () => {
  if (!confirm('Approve this requisition?')) return
  
  submitting.value = true
  try {
    await axios.post(`/api/procurement-stores/requisitions/${id}/approve`)
    await fetchRequisition()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Failed to approve requisition'
  } finally {
    submitting.value = false
  }
}

const rejectRequisition = async () => {
  submitting.value = true
  try {
    await axios.post(`/api/procurement-stores/requisitions/${id}/reject`, {
      reason: rejectReason.value
    })
    showRejectModal.value = false
    rejectReason.value = ''
    await fetchRequisition()
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Failed to reject requisition'
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async () => {
  if (!confirm('Are you sure you want to delete this requisition?')) return
  
  try {
    await axios.delete(`/api/procurement-stores/requisitions/${id}`)
    router.push('/procurement/requisitions')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete requisition'
  }
}

const calculateTotal = () => {
  if (!requisition.value.items || !Array.isArray(requisition.value.items)) return 0
  return requisition.value.items.reduce((sum: number, item: any) => sum + (item.total || 0), 0)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatRequestedByType = (type: string) => {
  const types: Record<string, string> = {
    project: 'Project',
    employee: 'Employee',
    office: 'Office/Department'
  }
  return types[type] || type
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[status] || classes.draft
}

onMounted(async () => {
  await fetchCurrentUser()
  await fetchRequisition()
})
</script>