<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Expert Header & Route Context -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <router-link to="/procurement/requisitions" class="px-2 py-1 rounded text-xs font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-500/20 transition-all">Back to List</router-link>
          <div class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Details</span>
        </div>
        <div class="flex items-center gap-4">
           <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
             {{ requisition.requisition_number }}
           </h1>
           <span
              :class="[
                'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                getStatusClass(requisition.status)
              ]"
            >
              {{ formatStatus(requisition.status) }}
            </span>
        </div>
        <p class="text-base font-medium text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
           View all details for this request, including costs and approval history.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          v-if="requisition.status === 'draft'"
          @click="submitForApproval"
          :disabled="submitting"
          class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
        >
          <i class="mdi mdi-send-check text-lg"></i>
          Submit for Approval
        </button>

        <template v-if="requisition.status === 'pending_approval' && canApprove">
           <button
            @click="approveRequisition"
            :disabled="submitting"
            class="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            @click="showRejectModal = true"
            :disabled="submitting"
            class="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            Reject
          </button>
        </template>

        <router-link
          v-if="requisition.status === 'approved'"
          :to="`/procurement/purchase-order/link-from-requisition/${id}`"
          class="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm active:scale-95"
        >
          <i class="mdi mdi-cart-plus text-lg"></i>
          Generate PO
        </router-link>

        <div class="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>

        <button
           @click="router.back()"
           class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
        >
           <i class="mdi mdi-arrow-left text-xl"></i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center p-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div class="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 animate-spin mb-4"></div>
      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Loading request details...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <!-- Primary Information Section -->
       <div class="lg:col-span-2 space-y-8">
          <!-- Information Card -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <div class="flex items-center justify-between mb-8">
                <h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">General Information</h3>
                <div class="flex items-center gap-2">
                   <div :class="['w-2 h-2 rounded-full', requisition.urgency === 'urgent' ? 'bg-rose-500' : 'bg-blue-500']"></div>
                   <span class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{{ requisition.urgency }} Priority</span>
                </div>
             </div>

             <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div class="space-y-1">
                   <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</p>
                   <p class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(requisition.date) }}</p>
                </div>
                <div class="space-y-1">
                   <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Requested For</p>
                   <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
                     {{ getRequestedBy(requisition) }}
                     <span class="ml-1 text-[10px] font-medium text-slate-400 uppercase">({{ requisition.requested_by_type }})</span>
                   </p>
                </div>
                <div class="space-y-1">
                   <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Added By</p>
                   <p class="text-sm font-bold text-slate-900 dark:text-white">{{ requisition.createdBy?.name || 'SYSTEM' }}</p>
                </div>
                <div class="space-y-1">
                   <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Cost</p>
                   <p class="text-sm font-bold text-slate-900 dark:text-white">KES {{ formatNumber(requisition.total_amount || 0) }}</p>
                </div>
             </div>

             <div v-if="requisition.rejection_reason" class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                   <p class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">Reason for Rejection</p>
                   <p class="text-sm font-medium text-rose-700 dark:text-rose-300 italic">"{{ requisition.rejection_reason }}"</p>
                </div>
             </div>
          </div>

          <!-- Items Table Section -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Items Requested</h3>
                <span class="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">{{ requisition.items?.length || 0 }} Items</span>
             </div>
             
             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                   <thead>
                      <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                         <th class="px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Item Name</th>
                         <th class="px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Qty</th>
                         <th class="px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Price</th>
                         <th class="px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Total</th>
                      </tr>
                   </thead>
                   <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr v-for="item in requisition.items" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                         <td class="px-6 py-4">
                            <div class="flex flex-col">
                               <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.material_name }}</span>
                               <span v-if="item.material?.material_code" class="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">
                                 {{ item.material.material_code }}
                               </span>
                               <span v-else-if="item.custom_description && item.custom_description !== item.material_name" class="text-[10px] text-slate-500 mt-0.5 italic">
                                 {{ item.custom_description }}
                               </span>
                            </div>
                         </td>
                         <td class="px-6 py-4 text-right">
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ item.quantity }}</span>
                         </td>
                         <td class="px-6 py-4 text-right">
                            <span class="text-sm text-slate-600 dark:text-slate-400">{{ formatNumber(item.unit_price || 0) }}</span>
                         </td>
                         <td class="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                            KES {{ formatNumber(item.total || 0) }}
                         </td>
                      </tr>
                   </tbody>
                   <tfoot>
                      <tr class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">
                         <td colspan="3" class="px-6 py-4 text-right text-xs uppercase tracking-wider">Grand Total</td>
                         <td class="px-6 py-4 text-right text-base text-blue-400 dark:text-blue-600">KES {{ formatNumber(calculateTotal()) }}</td>
                      </tr>
                   </tfoot>
                </table>
             </div>
          </div>
       </div>

       <!-- Sidebar Section -->
       <div class="space-y-6">
          <!-- Tracking History Card -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-8">Tracking History</h3>
             
             <div class="space-y-8">
                <!-- Initiated -->
                <div class="flex gap-4 relative">
                   <div class="absolute left-4 top-8 bottom-[-32px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                   <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <i class="mdi mdi-check text-white text-lg"></i>
                   </div>
                   <div class="space-y-1">
                      <p class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Request Initiated</p>
                      <p class="text-[10px] text-slate-400 font-semibold uppercase" v-if="requisition.created_at">{{ new Date(requisition.created_at).toLocaleString() }}</p>
                      <p class="text-xs text-slate-500 leading-relaxed">System user <strong>{{ requisition.createdBy?.name || 'System' }}</strong> verified the requirements.</p>
                   </div>
                </div>

                <!-- Approval Context -->
                <div class="flex gap-4 relative">
                   <div v-if="['approved', 'rejected', 'completed'].includes(requisition.status)" class="absolute left-4 top-8 bottom-[-32px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                   <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm transition-all"
                      :class="[
                         requisition.status === 'pending_approval' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 
                         ['approved', 'completed'].includes(requisition.status) ? 'bg-emerald-500 text-white' : 
                         requisition.status === 'rejected' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-300'
                      ]"
                   >
                      <i :class="['mdi text-lg', 
                         requisition.status === 'pending_approval' ? 'mdi-clock-fast' : 
                         ['approved', 'completed'].includes(requisition.status) ? 'mdi-check' : 
                         requisition.status === 'rejected' ? 'mdi-close' : 'mdi-shield-search'
                      ]"></i>
                   </div>
                   <div class="space-y-1">
                      <p class="text-xs font-bold uppercase tracking-wider" :class="requisition.status === 'pending_approval' ? 'text-amber-500' : 'text-slate-900 dark:text-white'">Approval Status</p>
                      <p class="text-[10px] text-slate-400 font-semibold uppercase" v-if="requisition.approved_at">{{ new Date(requisition.approved_at).toLocaleString() }}</p>
                      <p class="text-xs text-slate-500 leading-relaxed">
                         <span v-if="requisition.status === 'pending_approval'">Awaiting authorization...</span>
                         <span v-else-if="requisition.status === 'approved'">Approved by <strong>{{ requisition.approvedBy?.name }}</strong>.</span>
                         <span v-else-if="requisition.status === 'rejected'">Rejected by <strong>{{ requisition.approvedBy?.name }}</strong>.</span>
                      </p>
                   </div>
                </div>

                <!-- Fulfillment -->
                <div class="flex gap-4">
                   <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm"
                      :class="requisition.purchase_order_id ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'"
                   >
                      <i class="mdi mdi-truck-delivery-outline text-lg"></i>
                   </div>
                   <div class="space-y-1">
                      <p class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Fulfillment</p>
                      <p class="text-xs text-slate-500 leading-relaxed">
                         <span v-if="requisition.purchase_order_id">Linked to Purchase Order.</span>
                         <span v-else-if="requisition.status === 'approved'">Ready for Purchase Order.</span>
                         <span v-else>Pending approval...</span>
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <!-- Actions Card -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-6">Operations</h3>
             <button 
               disabled
               title="Coming soon"
               class="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 dark:text-slate-500 font-semibold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2">
                <i class="mdi mdi-file-pdf-box text-lg text-rose-500"></i>
                Download Voucher
             </button>
          </div>
       </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-slate-500/75 transition-opacity" @click="showRejectModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-slate-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-200 dark:border-slate-800">
          <div class="bg-white dark:bg-slate-900 px-6 pt-6 pb-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Reject Requisition</h3>
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="Provide a reason for rejection..."
              class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            ></textarea>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-row-reverse gap-3">
            <button
              @click="rejectRequisition"
              :disabled="!rejectReason || submitting"
              class="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold text-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              Confirm Rejection
            </button>
            <button
              @click="showRejectModal = false"
              class="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
  if (!status) return 'Loading...'
  return status.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())
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
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[status] || classes.draft
}

const getRequestedBy = (req: any) => {
  if (req.requested_by_type === 'project') {
    if (req.project) {
      return `${req.project.project_id} - ${req.project.name || req.project.enquiry?.title || 'Project'}`
    } else if (req.project_enquiry) {
      return `${req.project_enquiry.job_number} - ${req.project_enquiry.title || 'Project'}`
    }
  } else if (req.requested_by_type === 'employee' && req.employee) {
    return req.employee.name
  } else if (req.requested_by_type === 'office' && req.department) {
    return req.department.name
  }
  return 'N/A'
}

onMounted(async () => {
  await fetchCurrentUser()
  await fetchRequisition()
})
</script>