<template>
  <div class="space-y-6">
    <!-- Header Area -->
    <div v-if="!isEmbedded" class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          FINANCE & ACCOUNTS REQUISITIONS
        </h1>
        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
          Internal Expense Management Portal
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="fetchRequisitions"
          class="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 transition-all font-bold rounded-lg"
          title="Refresh Data"
        >
          <i class="mdi mdi-refresh text-lg" :class="{ 'animate-spin': loading }"></i>
        </button>
        <button
          @click="openNewRequisition"
          class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm"
        >
          New Requisition
        </button>
      </div>
    </div>

    <!-- Dynamic Filter & Status Hub -->
    <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
      <div class="flex flex-col xl:flex-row gap-8 items-start xl:items-center">
        
        <!-- Section: Search & Chronology -->
        <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div class="relative w-full sm:w-80">
            <input
              v-model="filters.search"
              type="text"
              placeholder="SEARCH PURPOSE OR PAYEE..."
              class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest outline-none focus:border-slate-900 dark:focus:border-white transition-all shadow-sm"
              @input="debounceSearch"
            />
          </div>
          
          <div class="flex items-center gap-2 shrink-0">
             <div class="flex items-center bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span class="text-[9px] font-black text-slate-400 mr-2 uppercase">FROM</span>
                <input
                  v-model="filters.start_date"
                  type="date"
                  class="bg-transparent border-none text-[10px] font-black text-slate-900 dark:text-slate-200 w-24 focus:ring-0 p-0"
                  @change="fetchRequisitions"
                />
             </div>
             <div class="flex items-center bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span class="text-[9px] font-black text-slate-400 mr-2 uppercase">TO</span>
                <input
                  v-model="filters.end_date"
                  type="date"
                  class="bg-transparent border-none text-[10px] font-black text-slate-900 dark:text-slate-200 w-24 focus:ring-0 p-0"
                  @change="fetchRequisitions"
                />
             </div>
             <button 
                v-if="filters.start_date || filters.end_date"
                @click="clearDates"
                class="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest"
              >
                Clear
              </button>
          </div>
        </div>

        <!-- Section: Interactive Status Tabs -->
        <div class="flex items-center gap-6 overflow-x-auto no-scrollbar w-full xl:w-auto">
          <button
            @click="setStatus('')"
            :class="[
              'pb-1 border-b-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0',
              filters.status === '' ? 'text-slate-900 dark:text-white border-slate-900 dark:border-white' : 'text-slate-400 border-transparent hover:text-slate-600'
            ]"
          >
            All
          </button>

          <button
            v-for="status in ['pending', 'approved', 'disbursed']"
            :key="status"
            @click="setStatus(status)"
            :class="[
              'flex items-center gap-3 transition-all px-4 py-2 rounded-xl shrink-0 group border-2',
              filters.status === status 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
            ]"
          >
             <span 
               :class="[
                 'text-[10px] font-black uppercase tracking-[0.2em]',
                 filters.status === status 
                    ? 'text-white' 
                    : (status === 'pending' ? 'text-amber-600' : status === 'approved' ? 'text-blue-600' : 'text-emerald-600')
               ]"
             >
               {{ status === 'disbursed' ? 'Paid' : status }}
             </span>
             <span 
               :class="[
                 'text-[10px] font-black font-mono px-2 py-0.5 rounded-lg border',
                 filters.status === status 
                    ? 'bg-white/20 border-white/20 text-white' 
                    : 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-800 text-slate-500'
               ]"
             >
                {{ requisitionStats?.[status]?.count || 0 }}
             </span>
          </button>

          <!-- Divider -->
          <div class="hidden xl:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <!-- Monthly Volume Metric (Minimalist) -->
          <div class="flex items-center gap-2">
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monthly Vol:</span>
             <span class="text-xs font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(requisitionStats?.monthly?.amount || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Split-Pane Container -->
    <div class="flex flex-col md:flex-row h-[calc(100vh-280px)] min-h-[600px] gap-6 overflow-hidden">
      <div 
        :class="[
          'flex flex-col w-full md:w-96 lg:w-[28rem] grow-0 shrink-0 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-all relative z-10',
          selectedId && 'hidden md:flex'
        ]"
      >
        <!-- List Header (Search/Filters integrated or summarized) -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900 border-t border-x rounded-t-2xl">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">CLAIMS INBOX</span>
          <span class="text-[10px] font-black font-mono text-slate-400">{{ meta.total }}</span>
        </div>

        <!-- Scrollable List -->
        <div class="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2 rounded-b-[2.5rem] pr-1">
          <div v-if="loading && !requisitions.length" class="space-y-2 p-2" >
            <div v-for="i in 5" :key="i" class="h-20 bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
          </div>
          
          <div 
            v-else-if="requisitions.length === 0" 
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <i class="mdi mdi-tray-blank text-4xl text-slate-200 mb-2"></i>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No Requests</p>
          </div>

          <button
            v-for="req in requisitions"
            :key="req.id"
            @click="selectRequisition(req)"
            :class="[
              'w-full text-left p-5 transition-all border-b last:border-b-0 relative group flex flex-col gap-3',
              selectedId === req.id 
                ? 'bg-slate-900 border-slate-900 dark:bg-blue-600/20 dark:border-blue-500/50 z-10' 
                : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-blue-900/40'
            ]"
          >
            <!-- Header: ID + Status + Date -->
            <div class="flex justify-between items-center w-full">
              <span 
                class="text-[9px] font-black uppercase tracking-widest font-mono"
                :class="selectedId === req.id ? 'text-slate-400' : 'text-slate-400'"
              >
                {{ req.requisition_number }}
              </span>
              <span 
                :class="[
                  'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border',
                  selectedId === req.id ? 'bg-white/10 border-white/20 text-white' : getStatusClass(req.status)
                ]"
              >
                {{ req.status }}
              </span>
            </div>

            <!-- Main Content: Purpose + Project -->
            <div>
              <h4 
                class="text-xs font-black uppercase tracking-wider leading-tight mb-2 line-clamp-1 h-3"
                :class="selectedId === req.id ? 'text-white dark:text-white' : 'text-slate-900 dark:text-slate-100'"
              >
                {{ req.purpose }}
              </h4>
              <div class="flex flex-wrap items-center gap-3">
                 <span 
                   class="text-[9px] font-black uppercase tracking-tighter"
                   :class="selectedId === req.id ? 'text-slate-400' : 'text-slate-500'"
                 >
                   {{ req.project?.enquiry?.title || req.project_name || 'GENERAL EXP' }}
                 </span>
                 <span v-if="req.venue" class="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span 
                   v-if="req.venue"
                   class="text-[9px] font-black uppercase tracking-tighter"
                   :class="selectedId === req.id ? 'text-slate-300' : 'text-slate-400'"
                 >
                   {{ req.venue }}
                 </span>
              </div>
            </div>

            <!-- Meta: Category + Requester -->
            <div class="flex flex-wrap gap-1.5">
                 <span class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-wide">
                   {{ req.category }}
                 </span>
                 <span v-if="req.department" class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-wide">
                   {{ req.department.name }}
                 </span>
            </div>

            <!-- Footer: Requester + Amount -->
            <div class="flex justify-between items-center mt-auto pt-3 border-t w-full" :class="selectedId === req.id ? 'border-white/10' : 'border-slate-50 dark:border-slate-700'">
               <span 
                 class="text-[9px] font-black uppercase tracking-tighter"
                 :class="selectedId === req.id ? 'text-slate-400' : 'text-slate-500'"
               >
                 {{ req.requester?.name || 'USER' }}
                 <span v-if="req.payee_phone || req.payee?.phone || req.requester?.employee?.phone" class="ml-2 text-blue-500 font-bold lowercase tracking-normal">
                   ({{ req.payee_phone || req.payee?.phone || req.requester?.employee?.phone }})
                 </span>
               </span>
               <span 
                 class="text-xs font-black font-mono tracking-tighter"
                 :class="selectedId === req.id ? 'text-white dark:text-white' : 'text-slate-900 dark:text-slate-100'"
               >
                 {{ formatCurrency(req.total_amount) }}
               </span>
            </div>
            
            <!-- Dark Mode Indicator (Selected State) -->
            <div 
              v-if="selectedId === req.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400"
            ></div>

            <!-- Connection Link Arrow (Selected State) -->
            <div 
              v-if="selectedId === req.id"
              class="hidden md:flex absolute -right-9 top-1/2 -translate-y-1/2 z-50 items-center justify-start pointer-events-none"
            >
               <div :class="getStatusColor(req.status)" class="h-[3px] w-9 rounded-l-full"></div>
               <div :class="getStatusColor(req.status)" class="w-2.5 h-2.5 rotate-45 -ml-1.5 transform origin-center rounded-sm"></div>
            </div>
          </button>
        </div>

        <!-- Pagination (Mini) -->
        <div v-if="meta.last_page > 1" class="p-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
          <button @click="changePage(meta.current_page - 1)" :disabled="meta.current_page === 1" class="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-20"><i class="mdi mdi-chevron-left"></i></button>
          <span class="text-[10px] font-black text-slate-400">{{ meta.current_page }} / {{ meta.last_page }}</span>
          <button @click="changePage(meta.current_page + 1)" :disabled="meta.current_page === meta.last_page" class="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-20"><i class="mdi mdi-chevron-right"></i></button>
        </div>
      </div>

      <!-- Right Pane: Detailed Preview -->
      <div 
        :class="[
          'flex-grow flex flex-col bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden p-6',
          !selectedId && 'hidden md:flex'
        ]"
      >
        <!-- Mobile Back Button -->
        <button 
          v-if="selectedId" 
          @click="selectedId = null" 
          class="md:hidden flex items-center gap-2 text-blue-600 mb-4 font-black uppercase text-xs"
        >
          <i class="mdi mdi-arrow-left text-lg"></i> Back to Inbox
        </button>

        <RequisitionPreview 
           v-if="selectedRequisition" 
           :requisition="selectedRequisition" 
           :can-manage="true" 
           @approve="handleApprove"
           @reject="handleReject"
           @disburse="handleDisburse"
           @edit="handleEdit"
           @delete="handleDelete"
        />

        <div v-else class="h-full flex flex-col items-center justify-center text-center p-12">
            <div class="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 mb-6">
              <i class="mdi mdi-eye-outline text-6xl opacity-20"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Select a Claim</h3>
            <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm">
              Click on a requisition from the list to view its full details and actions.
            </p>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showRejectModal = false"></div>
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl border border-slate-200/60 dark:border-slate-700/60">
        <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Reject Requisition</h2>
        <p class="text-slate-500 mb-6 text-sm font-bold">Specify why you are rejecting this request.</p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-red-500/50 text-slate-900 dark:text-white transition-all mb-6"
          placeholder="Reason for rejection..."
        ></textarea>
        <div class="flex items-center gap-3">
          <button @click="showRejectModal = false" class="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
          <button @click="submitRejection" class="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all" :disabled="submitting">
            {{ submitting ? 'Processing...' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Disbursement Form Modal -->
    <DisbursementForm 
        :is-open="showDisburseModal"
        :edit-mode="false"
        :requisition="selectedRequisition"
        @close="showDisburseModal = false"
        @success="onDisburseSuccess"
    />

    <!-- Requisition Form Drawer -->
    <RequisitionForm 
      :is-open="showForm"
      :requisition-id="formRequisitionId"
      :pre-fill="preFillData"
      @close="showForm = false"
      @success="fetchRequisitions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import RequisitionPreview from './RequisitionPreview.vue'
import RequisitionForm from './RequisitionForm.vue'
import DisbursementForm from '../../components/DisbursementForm.vue'

const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()
const requisitions = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

// Split-Pane State
const selectedId = ref<number | null>(null)
const selectedRequisition = ref<any>(null)
const showRejectModal = ref(false)
const showDisburseModal = ref(false)
const showForm = ref(false)
const formRequisitionId = ref<number | null>(null)
const preFillData = ref<any>(null)
const rejectionReason = ref('')
const requisitionStats = ref<any>(null)

const statCards = computed(() => [
  { 
    label: 'Pending Requests', 
    value: formatCurrency(requisitionStats.value?.pending?.amount || 0), 
    count: requisitionStats.value?.pending?.count || 0,
    icon: 'mdi mdi-clock-outline',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  { 
    label: 'Ready for Disbursement', 
    value: formatCurrency(requisitionStats.value?.approved?.amount || 0), 
    count: requisitionStats.value?.approved?.count || 0,
    icon: 'mdi mdi-check-decagram-outline',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  { 
    label: 'This Month', 
    value: formatCurrency(requisitionStats.value?.monthly?.amount || 0), 
    count: requisitionStats.value?.monthly?.count || 0,
    icon: 'mdi mdi-calendar-text-outline',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  { 
    label: 'Disbursed Today', 
    value: formatCurrency(requisitionStats.value?.disbursed_today?.amount || 0), 
    count: requisitionStats.value?.disbursed_today?.count || 0,
    icon: 'mdi mdi-cash-multiple',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20'
  }
])

const tabs = [
  { label: 'All Requests', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Disbursed', value: 'disbursed' },
  { label: 'Received', value: 'received' },
]

const filters = reactive({
  search: '',
  status: '',
  start_date: '',
  end_date: ''
})

let searchTimeout: any = null

const fetchRequisitions = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/finance/petty-cash/requisitions', {
      params: {
        page: meta.value.current_page,
        ...filters
      }
    })
    requisitions.value = response.data.data
    meta.value = response.data.meta
    
    // Also fetch stats on refresh
    fetchStats()
    
    // Auto-select first if in split pane and nothing selected
    if (!selectedId.value && requisitions.value.length > 0 && window.innerWidth > 768) {
       selectRequisition(requisitions.value[0])
    }
  } catch (error) {
    console.error('Failed to fetch requisitions:', error)
  } finally {
    loading.value = false
  }
}

const selectRequisition = async (req: any) => {
  selectedId.value = req.id
  // Fetch full details
  try {
    const response = await axios.get(`/api/finance/petty-cash/requisitions/${req.id}`)
    selectedRequisition.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch requisition details:', error)
  }
}

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/finance/petty-cash/requisitions/stats')
    if (response.data.success) {
      requisitionStats.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch requisition stats:', error)
  }
}

const setStatus = (status: string) => {
  filters.status = status
  meta.value.current_page = 1
  fetchRequisitions()
}

const clearDates = () => {
  filters.start_date = ''
  filters.end_date = ''
  meta.value.current_page = 1
  fetchRequisitions()
}

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    meta.value.current_page = 1
    fetchRequisitions()
  }, 500)
}

const changePage = (page: number) => {
  meta.value.current_page = page
  fetchRequisitions()
}

// Action Handlers
const handleApprove = async (req: any) => {
  if (!confirm('Are you sure you want to approve this requisition?')) return
  submitting.value = true
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${req.id}/approve`)
    await selectRequisition(req) // Refresh details
    fetchRequisitions() // Refresh list
  } catch (error) {
    console.error('Approval failed:', error)
    alert('Failed to approve requisition')
  } finally {
    submitting.value = false
  }
}

const handleReject = (req: any) => {
  showRejectModal.value = true
  rejectionReason.value = ''
}

const submitRejection = async () => {
  if (!rejectionReason.value) return
  submitting.value = true
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${selectedId.value}/approve`, {
      rejection_reason: rejectionReason.value
    })
    showRejectModal.value = false
    await selectRequisition({ id: selectedId.value })
    fetchRequisitions()
  } catch (error) {
    console.error('Rejection failed:', error)
  } finally {
    submitting.value = false
  }
}

const handleDisburse = (req: any) => {
  selectedRequisition.value = req
  showDisburseModal.value = true
}

const onDisburseSuccess = () => {
  showDisburseModal.value = false
  if (selectedId.value) selectRequisition({ id: selectedId.value })
  fetchRequisitions()
}

const openNewRequisition = (preFill: any = null) => {
  formRequisitionId.value = null
  preFillData.value = preFill instanceof Event ? null : preFill
  showForm.value = true
}

const handleEdit = (req: any) => {
  formRequisitionId.value = req.id
  showForm.value = true
}

const handleDelete = async (req: any) => {
  const isDisbursed = req.status === 'disbursed'
  const message = isDisbursed 
    ? 'Warning: This requisition is DISBURSED. Deleting it will release the associated balance back to the petty cash vault (Voiding the disbursement). Proceed?'
    : 'Are you sure you want to delete this requisition? This action cannot be undone.'
    
  if (!confirm(message)) return

  submitting.value = true
  try {
    const response = await axios.delete(`/api/finance/petty-cash/requisitions/${req.id}`)
    if (response.data.success) {
      selectedId.value = null
      selectedRequisition.value = null
      fetchRequisitions()
    }
  } catch (error: any) {
    console.error('Deletion failed:', error)
    alert(error.response?.data?.message || 'Failed to delete requisition')
  } finally {
    submitting.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-400'
    case 'approved': return 'bg-blue-500'
    case 'rejected': return 'bg-red-500'
    case 'disbursed': return 'bg-purple-500'
    case 'received': return 'bg-emerald-500'
    default: return 'bg-slate-400'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-blue-50/80 text-amber-700 border-blue-200 dark:bg-blue-900/20 dark:text-amber-400 dark:border-blue-800'
    case 'approved': return 'bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
    case 'rejected': return 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
    case 'disbursed': return 'bg-blue-50/80 text-emerald-700 border-blue-200 dark:bg-blue-900/20 dark:text-emerald-400 dark:border-blue-800'
    case 'received': return 'bg-blue-50/80 text-emerald-700 border-blue-200 dark:bg-blue-900/20 dark:text-emerald-400 dark:border-blue-800'
    default: return 'bg-slate-50 text-slate-900 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800'
  }
}

const handleQueryParams = () => {
  // Handle action parameter (e.g. from Billing module)
  if (route.query.action === 'new') {
    // Capture pre-fill data before clearing query
    const preFill = { ...route.query }
    openNewRequisition(preFill)
    
    // Clear the query parameters so refresh doesn't trigger this again
    const newQuery = { ...route.query }
    const paramsToClear = [
      'action', 'purpose', 'amount', 'bill_id', 'department_id', 
      'project_id', 'project_name', 'venue', 'category', 'project_selection'
    ]
    paramsToClear.forEach(p => delete (newQuery as any)[p])
    router.replace({ query: newQuery as any })
  }
}

onMounted(() => {
  fetchRequisitions()
  handleQueryParams()
})

// Watch for query changes for when component is reused
watch(() => route.query, () => {
  handleQueryParams()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.dark .custom-scrollbar {
  scrollbar-color: #475569 transparent;
}
</style>
