<template>
  <div class="space-y-6">
    <!-- Header Area -->
    <div v-if="!isEmbedded" class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Petty Cash Requisitions
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage and track your petty cash requests
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="fetchRequisitions"
          class="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          title="Refresh Data"
        >
          <i class="mdi mdi-refresh text-xl" :class="{ 'animate-spin': loading }"></i>
        </button>
        <button
          @click="openNewRequisition"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
        >
          <i class="mdi mdi-plus text-xl"></i>
          New Requisition
        </button>
      </div>
    </div>

    <!-- Dynamic Filter & Status Hub -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/10 dark:shadow-none">
      <div class="flex flex-col xl:flex-row gap-6">
        
        <!-- Section: Search & Chronology -->
        <div class="flex flex-col sm:flex-row gap-3 shrink-0 xl:w-[450px]">
          <div class="relative flex-grow pointer-events-auto">
            <span class="absolute inset-y-0 left-4 flex items-center text-slate-400 pointer-events-none">
              <i class="mdi mdi-magnify text-xl"></i>
            </span>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by purpose or payee..."
              class="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl focus:ring-4 focus:ring-blue-500/5 text-slate-900 dark:text-white font-bold text-sm transition-all placeholder:text-slate-400"
              @input="debounceSearch"
            />
          </div>
          
          <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-800 shrink-0">
             <div class="flex items-center px-2 text-slate-400">
               <i class="mdi mdi-calendar-range text-lg"></i>
             </div>
             <input
              v-model="filters.start_date"
              type="date"
              class="bg-transparent border-none text-[10px] uppercase font-black text-slate-700 dark:text-slate-300 w-28 focus:ring-0 p-1"
              @change="fetchRequisitions"
            />
            <div class="w-1.5 h-px bg-slate-300 dark:bg-slate-600"></div>
            <input
              v-model="filters.end_date"
              type="date"
              class="bg-transparent border-none text-[10px] uppercase font-black text-slate-700 dark:text-slate-300 w-28 focus:ring-0 p-1"
              @change="fetchRequisitions"
            />
            <button 
              v-if="filters.start_date || filters.end_date"
              @click="clearDates"
              class="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:shadow-sm transition-all"
            >
              <i class="mdi mdi-close-circle text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Vertical Divider (Desktop) -->
        <div class="hidden xl:block w-px bg-slate-100 dark:bg-slate-800 h-10 my-auto"></div>

        <!-- Section: Interactive Status Badges -->
        <div class="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 xl:pb-0 flex-grow">
          <!-- All -->
          <button
            @click="setStatus('')"
            :class="[
              'flex items-center justify-center px-6 py-3 rounded-2xl border-2 transition-all shrink-0 font-black uppercase tracking-widest text-[10px]',
              filters.status === ''
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-lg shadow-slate-900/20'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300 hover:text-slate-600'
            ]"
          >
             All
          </button>

          <!-- Pending -->
          <button
            @click="setStatus('pending')"
            :class="[
              'flex items-center gap-4 px-5 py-2.5 rounded-2xl border-2 transition-all shrink-0 group',
              filters.status === 'pending'
                ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-amber-200'
            ]"
          >
             <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-current">
                <i class="mdi mdi-clock-fast text-xl"></i>
             </div>
             <div class="flex flex-col items-start pt-0.5">
                <span class="text-[9px] font-black uppercase tracking-widest opacity-80">Pending</span>
                <div class="flex items-baseline gap-2">
                   <span class="text-sm font-black">{{ requisitionStats?.pending?.count || 0 }}</span>
                   <span class="text-[10px] font-bold opacity-60 font-mono">{{ formatCurrency(requisitionStats?.pending?.amount || 0) }}</span>
                </div>
             </div>
          </button>

          <!-- Approved -->
          <button
            @click="setStatus('approved')"
            :class="[
              'flex items-center gap-4 px-5 py-2.5 rounded-2xl border-2 transition-all shrink-0 group',
              filters.status === 'approved'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-blue-200'
            ]"
          >
             <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-current">
                <i class="mdi mdi-check-decagram text-xl"></i>
             </div>
             <div class="flex flex-col items-start pt-0.5">
                <span class="text-[9px] font-black uppercase tracking-widest opacity-80">Approved</span>
                <div class="flex items-baseline gap-2">
                   <span class="text-sm font-black">{{ requisitionStats?.approved?.count || 0 }}</span>
                   <span class="text-[10px] font-bold opacity-60 font-mono">{{ formatCurrency(requisitionStats?.approved?.amount || 0) }}</span>
                </div>
             </div>
          </button>

          <!-- Disbursed -->
          <button
            @click="setStatus('disbursed')"
            :class="[
              'flex items-center gap-4 px-5 py-2.5 rounded-2xl border-2 transition-all shrink-0 group',
              filters.status === 'disbursed'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-emerald-200'
            ]"
          >
             <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-current">
                <i class="mdi mdi-cash-check text-xl"></i>
             </div>
             <div class="flex flex-col items-start pt-0.5">
                <span class="text-[9px] font-black uppercase tracking-widest opacity-80">Paid</span>
                <div class="flex items-baseline gap-2">
                   <span class="text-sm font-black">{{ requisitionStats?.disbursed?.count || 0 }}</span>
                   <span class="text-[10px] font-bold opacity-60 font-mono">{{ formatCurrency(requisitionStats?.disbursed?.amount || 0) }}</span>
                </div>
             </div>
          </button>

          <!-- Divider -->
          <div class="h-8 w-px bg-slate-100 dark:bg-slate-700 shrink-0"></div>

          <!-- Summary Metric -->
          <div class="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/50 shrink-0">
             <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400">
                <i class="mdi mdi-finance text-xl"></i>
             </div>
             <div class="flex flex-col items-start pt-0.5">
                <span class="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Monthly Volume</span>
                <span class="text-sm font-black text-indigo-900 dark:text-indigo-200">{{ formatCurrency(requisitionStats?.monthly?.amount || 0) }}</span>
             </div>
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
        <div class="p-4 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between rounded-t-[2.5rem] overflow-hidden">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Claims Inbox</span>
          <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-wider">{{ meta.total }}</span>
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
              'w-full text-left p-3 rounded-2xl transition-all border group relative flex flex-col gap-1.5',
              selectedId === req.id 
                ? 'bg-blue-50/80 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30 ring-1 ring-blue-500/20 z-20 translate-x-1 shadow-md' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600'
            ]"
          >
            <!-- Header: ID + Status + Date -->
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">{{ req.requisition_number }}</span>
                <span v-if="req.items_count > 1" class="text-[8px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-px rounded-md">
                  {{ req.items_count }} ITEMS
                </span>
              </div>
              <span :class="getStatusClass(req.status)" class="px-1.5 py-px rounded-full text-[8px] font-black uppercase tracking-wider shadow-sm border border-transparent">
                {{ req.status }}
              </span>
            </div>

            <!-- Main Content: Purpose + Project -->
            <div>
              <h4 
                class="text-xs font-bold leading-tight mb-0.5 line-clamp-1"
                :class="selectedId === req.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-100'"
              >
                {{ req.purpose }}
              </h4>
              <div v-if="req.project || req.enquiry" class="flex items-center gap-1.5">
                <i class="mdi mdi-folder-network text-[10px] text-slate-400"></i>
                <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                  <template v-if="req.project">
                    <span class="font-mono font-bold text-slate-400 mr-1">{{ req.project.project_id }}</span>
                    {{ req.project.enquiry?.title || 'Untitled Project' }}
                  </template>
                  <template v-else-if="req.enquiry">
                    <span class="font-mono font-bold text-slate-400 mr-1">ENQ</span>
                    {{ req.enquiry.title }}
                  </template>
                  <template v-else>General Expense</template>
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
            <div class="flex justify-between items-end mt-0.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 w-full">
               <div class="flex items-center gap-1.5">
                 <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {{ req.requester?.name?.charAt(0) || 'U' }}
                 </div>
                 <div class="flex flex-col">
                   <span class="text-[9px] font-bold text-slate-700 dark:text-slate-300">
                     {{ req.requester?.name || 'Unknown User' }}
                   </span>
                   <span class="text-[8px] text-slate-400 font-medium leading-none mt-0.5">
                     {{ formatDate(req.created_at) }}
                   </span>
                 </div>
               </div>

               <div class="flex flex-col items-end mr-2">
                 <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-px">Total</span>
                 <span class="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">
                   {{ formatCurrency(req.total_amount) }}
                 </span>
               </div>
            </div>
            
            <!-- Right Status/Selection Line -->
            <div 
              :class="getStatusColor(req.status)" 
              class="absolute right-0 top-0 bottom-0 w-1.5 transition-all duration-300 rounded-r-2xl"
              :style="{ opacity: selectedId === req.id ? '1' : '0.6' }"
            ></div>

            <!-- Connection Link Arrow (Selected State) -->
            <div 
              v-if="selectedId === req.id"
              class="hidden md:flex absolute -right-9 top-1/2 -translate-y-1/2 z-50 items-center justify-start pointer-events-none"
            >
               <div :class="getStatusColor(req.status)" class="h-[3px] w-9 shadow-sm rounded-l-full"></div>
               <div :class="getStatusColor(req.status)" class="w-2.5 h-2.5 rotate-45 -ml-1.5 shadow-sm transform origin-center rounded-sm"></div>
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
      @close="showForm = false"
      @success="fetchRequisitions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
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
  showDisburseModal.value = true
}

const onDisburseSuccess = () => {
  showDisburseModal.value = false
  if (selectedId.value) selectRequisition({ id: selectedId.value })
  fetchRequisitions()
}

const openNewRequisition = () => {
  formRequisitionId.value = null
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
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'disbursed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'received': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
  }
}

onMounted(() => {
  fetchRequisitions()
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
