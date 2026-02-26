<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Expert Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-widest">Store Room</span>
          <div class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <span class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">My Requests</span>
        </div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          My Requisitions
        </h1>
        <p class="text-base font-medium text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
           Check the status of your material requests. See if they are approved or ready to pick up.
        </p>
      </div>
      <router-link
        to="/procurement/requisition/create"
        class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
      >
        <i class="mdi mdi-plus text-xl"></i>
        <span>New Requisition</span>
      </router-link>
    </div>

    <!-- Analytics / Tracking Hub -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 py-2">
       <div class="border-l-2 border-slate-200 dark:border-slate-800 pl-4">
          <div class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{{ requisitions.length }}</div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Recorded Requests</p>
       </div>
       
       <div class="border-l-2 border-amber-500/50 pl-4">
          <div class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{{ requisitions.filter(r => r.status === 'pending_approval').length }}</div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Awaiting Approval</p>
       </div>

       <div class="border-l-2 border-emerald-500/50 pl-4">
          <div class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{{ requisitions.filter(r => r.status === 'approved').length }}</div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ready for Pick up</p>
       </div>

       <div class="border-l-2 border-rose-500/50 pl-4">
          <div class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{{ requisitions.filter(r => r.status === 'rejected').length }}</div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Needs Revision</p>
       </div>
    </div>

    <!-- Filter & Search Command Bar -->
    <div class="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
       <div class="relative w-full xl:flex-1 group">
          <i class="mdi mdi-magnify absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
          <input
            v-model="searchTerm"
            @input="handleSearch"
            type="text"
            placeholder="Search by ID, project, or name..."
            class="w-full pl-14 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 font-medium"
          />
       </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
           <select
             v-model="filters.status"
             @change="applyFilters"
             class="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
           >
             <option value="">All Statuses</option>
             <option value="draft">Draft</option>
             <option value="pending_approval">Pending</option>
             <option value="approved">Approved</option>
             <option value="rejected">Rejected</option>
           </select>

           <select
             v-model="filters.urgency"
             @change="applyFilters"
             class="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
           >
             <option value="">Any Urgency</option>
             <option value="normal">Normal</option>
             <option value="urgent">Urgent</option>
           </select>
        </div>
    </div>

    <!-- Data Table Section -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
      <div v-if="loading" class="flex flex-col items-center justify-center p-24">
         <div class="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 animate-spin mb-4"></div>
         <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Loading requisitions...</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center p-24 text-center">
         <i class="mdi mdi-alert-circle-outline text-4xl text-rose-500 mb-4 inline-block"></i>
         <p class="text-sm font-semibold text-rose-600 dark:text-rose-400">{{ error }}</p>
         <button @click="loadRequisitions" class="mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">Try Again</button>
      </div>

      <div v-else-if="requisitions.length === 0" class="flex flex-col items-center justify-center p-24 text-center">
         <div class="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6">
            <i class="mdi mdi-tray-alert text-4xl text-slate-300 dark:text-slate-600"></i>
         </div>
         <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">No Requisitions Found</h3>
         <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">There are no material requests recorded in the system yet.</p>
         <router-link to="/procurement/requisition/create" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            Create New Requisition
         </router-link>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Number</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Requested For</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">Items</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Cost</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            <tr
              v-for="req in requisitions"
              :key="req.id"
              class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              @click="viewRequisition(req.id)"
            >
              <td class="px-6 py-4">
                 <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ req.requisition_number }}</span>
                    <span v-if="req.urgency === 'urgent'" class="text-[10px] font-bold text-rose-600 uppercase mt-0.5 flex items-center gap-1">
                       <i class="mdi mdi-alert-circle text-xs"></i> Urgent
                    </span>
                 </div>
              </td>
              <td class="px-6 py-4">
                 <div class="flex flex-col">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ new Date(req.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}</span>
                    <span class="text-xs text-slate-500 mt-0.5">{{ new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                 </div>
              </td>
              <td class="px-6 py-4">
                 <div class="flex flex-col max-w-[200px]">
                    <span class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ getRequestedBy(req) }}</span>
                    <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">{{ req.requested_by_type }}</span>
                 </div>
              </td>
              <td class="px-6 py-4 text-center">
                 <span class="px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {{ req.items?.length || 0 }} Items
                 </span>
              </td>
              <td class="px-6 py-4 text-right">
                 <span class="text-sm font-bold text-slate-900 dark:text-white">KES {{ formatNumber(req.total_amount || 0) }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                 <div class="flex flex-col items-center gap-1">
                    <span
                      :class="[
                        'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                        getStatusClass(req.status)
                      ]"
                    >
                      {{ formatStatus(req.status).replace(/_/g, ' ') }}
                    </span>
                    <span v-if="req.status === 'approved' && req.approved_by?.name" class="text-[9px] font-medium text-slate-500 uppercase">
                       By {{ req.approved_by.name }}
                    </span>
                 </div>
              </td>
              <td class="px-6 py-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <router-link
                    :to="`/procurement/requisition/${req.id}`"
                    class="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                    title="View Details"
                  >
                    <i class="mdi mdi-eye text-xl"></i>
                  </router-link>
                  
                  <router-link
                    v-if="req.status === 'draft'"
                    :to="`/procurement/requisition/${req.id}/edit`"
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all"
                    title="Edit Request"
                  >
                    <i class="mdi mdi-pencil text-xl"></i>
                  </router-link>
                  
                  <template v-if="req.status === 'pending_approval' && canApproveOrDelete">
                    <button
                      @click="approveRequisition(req.id)"
                      class="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                      title="Approve"
                    >
                      <i class="mdi mdi-check-bold text-xl"></i>
                    </button>
                    <button
                      @click="openRejectModal(req)"
                      class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all"
                      title="Reject"
                    >
                      <i class="mdi mdi-close-thick text-xl"></i>
                    </button>
                  </template>

                  <button
                    v-if="canApproveOrDelete"
                    @click="deleteRequisition(req.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                    title="Delete"
                  >
                    <i class="mdi mdi-delete-outline text-xl"></i>
                  </button>
                </div>
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
  if (req.requested_by_type === 'project') {
    // Tier 1: formal Project with enquiry title
    if (req.project) {
      return `${req.project.project_id} - ${req.project.enquiry?.title || req.project.name || 'Project'}`
    }
    // Tier 2: projectEnquiry relationship (task-based requisitions)
    if (req.project_enquiry) {
      const jobNum = req.project_enquiry.job_number || ''
      const title  = req.project_enquiry.title || ''
      return jobNum && title ? `${jobNum} - ${title}` : jobNum || title || 'Project'
    }
    // Tier 3: job_number stored directly on the requisition during creation
    if (req.job_number) {
      return req.job_number
    }
    return 'Project'
  } else if (req.requested_by_type === 'employee' && req.employee) {
    return req.employee.name
  } else if (req.requested_by_type === 'office' && req.department) {
    return req.department.name
  }
  return 'N/A'
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatNumber = (num: number) => new Intl.NumberFormat().format(num)
const formatStatus = (status: string) => {
  if (!status) return ''
  return status.charAt(0).toUpperCase() + status.slice(1)
}

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