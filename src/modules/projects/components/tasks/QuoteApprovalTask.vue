<template>
  <div class="quote-approval-task bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-sm p-4 sm:p-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased flex flex-col md:flex-row gap-6">
    
    <!-- Left Sidebar: Summary & Actions -->
    <div class="w-full md:w-1/3 flex flex-col gap-6">
      
      <!-- Summary Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-lg font-black text-slate-900 dark:text-white leading-tight">Quote Approval</h2>
            <div class="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span class="font-bold text-blue-600">{{ quoteData.projectInfo?.projectId || 'TBC' }}</span>
              <span>•</span>
              <span class="truncate max-w-[150px]">{{ quoteData.projectInfo?.clientName }}</span>
            </div>
          </div>
          <span :class="getQuoteStatusColor(quoteData.status || 'draft')" class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border">
             {{ getQuoteStatusLabel(quoteData.status || 'draft') }}
          </span>
        </div>

        <div class="mb-6">
           <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Value</p>
           <div class="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
             <span class="text-sm font-bold text-slate-400">KES</span>
             {{ formatCurrencyValue(quoteData.totals?.grandTotal || 0) }}
           </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6">
           <div class="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg border border-slate-100 dark:border-gray-700">
             <p class="text-[9px] font-bold uppercase text-slate-400 mb-0.5">Margin</p>
             <p class="text-sm font-black text-blue-600 dark:text-blue-400">{{ quoteData.totals?.overallMarginPercentage ?? 0 }}%</p>
           </div>
           <div class="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg border border-slate-100 dark:border-gray-700">
             <p class="text-[9px] font-bold uppercase text-slate-400 mb-0.5">Profit</p>
             <p class="text-sm font-black text-slate-700 dark:text-gray-300">{{ formatCurrencyValue(quoteData.totals?.totalMargin ?? 0) }}</p>
           </div>
        </div>

        <!-- Primary Actions -->
        <div class="space-y-3">
           <button 
              v-if="formData.approval_status !== 'approved'"
              @click="formData.approval_status = 'approved'"
              class="w-full h-10 rounded-lg border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              :class="formData.approval_status === 'approved' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'"
           >
             <i class="mdi mdi-check"></i> Approve Quote
           </button>
           
           <button 
              v-if="formData.approval_status !== 'rejected'"
              @click="formData.approval_status = 'rejected'"
              class="w-full h-10 rounded-lg border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              :class="formData.approval_status === 'rejected' ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'"
           >
             <i class="mdi mdi-close"></i> Reject Quote
           </button>
        </div>
      </div>

      <!-- Activation Card (Only visible when approved or nearly approved) -->
      <div v-if="formData.approval_status === 'approved' || quoteData.status === 'approved'" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5">
         <h3 class="text-sm font-black text-emerald-800 dark:text-emerald-400 mb-2">Project Activation</h3>
         <div v-if="quoteData.projectInfo?.jobNumber">
            <p class="text-xs text-emerald-600 mb-1">Active Job Number:</p>
            <p class="text-xl font-black text-emerald-700 dark:text-emerald-300 tracking-wider">{{ quoteData.projectInfo.jobNumber }}</p>
         </div>
         <button
            v-else
            @click="handleConvertToProject"
            :disabled="isConverting || isLoading"
            class="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all"
         >
            <i v-if="isConverting" class="mdi mdi-loading mdi-spin"></i>
            {{ isConverting ? 'Starting...' : 'Activate Project' }}
         </button>
      </div>

    </div>

    <!-- Right Content: Details Form -->
    <div class="w-full md:w-2/3 flex flex-col gap-4">
       <!-- Toolbar -->
       <div class="flex justify-end">
          <button 
            @click="showQuoteViewer = true"
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <i class="mdi mdi-file-document-outline"></i> View Full Document
          </button>
       </div>

       <!-- Form Card -->
       <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 flex-grow shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approval Date</label>
                <input
                  v-model="formData.approval_date"
                  type="date"
                  class="w-full h-10 px-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
             </div>
             <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved By</label>
                <input
                  v-model="formData.approved_by"
                  type="text"
                  required
                  class="w-full h-10 px-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="Name"
                />
             </div>
          </div>

          <div v-if="formData.approval_status === 'rejected'" class="space-y-1.5 mb-6 animate-slide-up">
             <label class="text-[10px] font-bold uppercase tracking-wider text-red-500">Reason for Rejection</label>
             <textarea
                v-model="formData.rejection_reason"
                required
                rows="2"
                class="w-full p-3 bg-white dark:bg-gray-800 border-l-4 border-red-500 text-sm text-slate-700 dark:text-gray-300 focus:outline-none focus:bg-slate-50"
                placeholder="Required..."
             ></textarea>
          </div>

          <div class="space-y-1.5 mb-8">
             <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comments / Notes</label>
             <textarea
                v-model="formData.comments"
                rows="3"
                class="w-full p-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm text-slate-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Optional notes..."
             ></textarea>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
             <div class="flex gap-4">
                <button
                  v-if="task.status !== 'completed' && task.status !== 'skipped'"
                  type="button"
                  @click="showSkipModal = true"
                  class="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                >
                  Skip
                </button>
             </div>
             
             <button
               type="submit"
               :disabled="isLoading || !formData.approval_status"
               class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
             >
               <i v-if="isLoading" class="mdi mdi-loading mdi-spin"></i>
               <span>Save Decision</span>
             </button>
          </div>
       </form>
    </div>

    <!-- Modals (Unchanged logic, just keeping structure) -->
    <div v-if="showQuoteViewer" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col relative border border-white/10">
        <button @click="showQuoteViewer = false" class="absolute top-4 right-4 z-[60] w-8 h-8 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 rounded-full flex items-center justify-center transition-all">
          <i class="mdi mdi-close"></i>
        </button>
        <div class="flex-grow overflow-hidden rounded-2xl">
          <QuoteViewer v-if="quoteTaskId" :is-visible="true" :readonly="true" :quote-data="quoteData" @close="showQuoteViewer = false" />
        </div>
      </div>
    </div>

    <div v-if="showSkipModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Bypass Approval</h3>
        <textarea v-model="skipReason" rows="3" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-4 focus:outline-none focus:border-blue-500" placeholder="Reason..."></textarea>
        <div class="flex gap-2">
            <button @click="showSkipModal = false" class="flex-1 h-10 rounded-lg font-bold text-xs bg-slate-100 text-slate-500 hover:bg-slate-200">Cancel</button>
            <button @click="handleSkipTask" :disabled="!skipReason.trim()" class="flex-1 h-10 rounded-lg font-bold text-xs bg-slate-900 text-white hover:bg-slate-800">Confirm</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import axios from '@/plugins/axios'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '../../composables/useNotifications'
import QuoteViewer from './QuoteViewer.vue'

interface Props {
  task: EnquiryTask
  initialTab?: string
}

const props = defineProps<Props>()
const { user } = useAuth()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const showQuoteViewer = ref(false)
const quoteTaskId = ref<number | null>(null)
const isConverting = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Skip Task Logic
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await axios.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        emit('update-status', 'skipped')
        showSkipModal.value = false
        skipReason.value = ''
        successMessage.value = 'Task skipped successfully'
    } catch (err: any) {
        console.error('Skip task error:', err)
        error.value = err.response?.data?.message || 'Failed to skip task'
    } finally {
        isSkipping.value = false
    }
}

const formData = ref({
  approval_status: '',
  rejection_reason: '',
  comments: '',
  approval_date: new Date().toISOString().split('T')[0],
  approved_by: user.value?.name || ''
})

// Real quote data structure
const quoteData = ref({
  projectInfo: {
    projectId: '',
    enquiryTitle: '',
    clientName: '',
    eventVenue: '',
    setupDate: '',
    setDownDate: '',
    jobNumber: ''
  },
  budgetImported: false,
  materials: [],
  labour: [],
  expenses: [],
  logistics: [],
  margins: {
    materials: 20,
    labour: 15,
    expenses: 10,
    logistics: 15
  },
  discountAmount: 0,
  vatPercentage: 16,
  vatEnabled: true,
  totals: {
    materialsBase: 0,
    materialsMargin: 0,
    materialsTotal: 0,
    labourBase: 0,
    labourMargin: 0,
    labourTotal: 0,
    expensesBase: 0,
    expensesMargin: 0,
    expensesTotal: 0,
    logisticsBase: 0,
    logisticsMargin: 0,
    logisticsTotal: 0,
    subtotal: 0,
    discountAmount: 0,
    totalAfterDiscount: 0,
    vatAmount: 0,
    grandTotal: 0,
    totalMargin: 0,
    overallMarginPercentage: 0
  },
  status: 'draft',
  approvedBy: null,
  approvalDate: null,
  rejectionReason: null,
  approvalComments: null,
  quoteAmount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})

const loadQuoteData = async () => {
  if (!props.task.project_enquiry_id) {
    error.value = 'No enquiry ID found'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const enquiryResponse = await axios.get(`/api/projects/enquiries/${props.task.project_enquiry_id}`)
    if (enquiryResponse.data.data) {
      const enquiry = enquiryResponse.data.data
      quoteData.value.projectInfo = {
        projectId: enquiry.job_number || enquiry.enquiry_number || enquiry.id,
        enquiryTitle: enquiry.title || enquiry.event_name || 'Project Title',
        clientName: enquiry.client?.full_name || enquiry.client_name || 'Client Name',
        eventVenue: enquiry.venue || enquiry.event_venue || 'Venue TBC',
        setupDate: enquiry.setup_date || enquiry.event_date || new Date().toISOString(),
        setDownDate: enquiry.setdown_date || 'TBC',
        jobNumber: enquiry.job_number || ''
      }
    }

    const tasksResponse = await axios.get(`/api/projects/enquiries/${props.task.project_enquiry_id}/tasks`)
    const tasks = tasksResponse.data.data || []
    const quoteTask = tasks.find((t: EnquiryTask) => t.type === 'quote')

    if (quoteTask) {
      quoteTaskId.value = quoteTask.id
      const quoteResponse = await axios.get(`/api/projects/tasks/${quoteTask.id}/quote`)
      if (quoteResponse.data.data) {
        const quoteDataFromAPI = quoteResponse.data.data
        const preservedProjectInfo = quoteData.value.projectInfo
        Object.assign(quoteData.value, quoteDataFromAPI)
        quoteData.value.projectInfo = preservedProjectInfo

        if (quoteData.value.status && quoteData.value.status !== 'draft') {
          formData.value.approval_status = quoteData.value.status
        }
        if (quoteData.value.approvalComments) formData.value.comments = quoteData.value.approvalComments
        if (quoteData.value.approvedBy) formData.value.approved_by = quoteData.value.approvedBy
        if (quoteData.value.approvalDate) formData.value.approval_date = quoteData.value.approvalDate
        if (quoteData.value.rejectionReason) formData.value.rejection_reason = quoteData.value.rejectionReason
      }
    } else {
        error.value = 'Quote Task not found'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load data'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!formData.value.approval_status) {
    error.value = 'Please select a status'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const approvalData = {
      approval_status: formData.value.approval_status,
      rejection_reason: formData.value.approval_status === 'rejected' ? String(formData.value.rejection_reason || '') : null,
      comments: formData.value.comments || null,
      approval_date: formData.value.approval_date,
      approved_by: formData.value.approved_by,
      quote_amount: quoteData.value.totals?.grandTotal || 0,
      quote_data: quoteData.value
    }

    await axios.post(`/api/projects/tasks/${props.task.id}/approval`, approvalData)
    await loadQuoteData()
    
    successMessage.value = 'Decision saved successfully!'
    setTimeout(() => { successMessage.value = null }, 3000)

    if (formData.value.approval_status === 'approved' || formData.value.approval_status === 'rejected') {
        updateStatus('completed')
    } else {
        updateStatus('in_progress')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save decision'
  } finally {
    isLoading.value = false
  }
}

const handleConvertToProject = async () => {
  if (!confirm('This will formalize the project and generate a Job Number. Proceed?')) return

  isConverting.value = true
  error.value = null

  try {
    await axios.post(`/api/projects/enquiries/${props.task.project_enquiry_id}/approve-quote`)
    
    // Force instant notification sync to trigger the kinetic achievement popup
    try {
      const { fetchNotifications } = useNotifications()
      await fetchNotifications()
    } catch (nErr) {
      console.warn('Silent notification sync failure', nErr)
    }

    await loadQuoteData()
    successMessage.value = 'Project activated successfully!'
    updateStatus('completed')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Conversion failed'
  } finally {
    isConverting.value = false
  }
}

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') emit('complete')
}

// Helpers
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'tbc') return 'TBC'
  try { return new Date(dateString).toLocaleDateString('en-GB') } catch { return dateString }
}

const formatCurrencyValue = (val: number) => {
    return new Intl.NumberFormat('en-KE').format(val)
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', minimumFractionDigits: 0
  }).format(amount)
}

const getQuoteStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-800 border-slate-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  }
  return colors[status] || colors.draft
}

const getQuoteStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusBadgeClasses = (status: string) => {
    if (status === 'completed') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-slate-100 text-slate-800 border-slate-200'
}

const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase()
}

onMounted(() => { loadQuoteData() })
</script>

<style scoped>
.animate-slide-up { animation: slideUp 0.4s ease-out; }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-bounce-subtle { animation: bounceSubtle 2s infinite; }
@keyframes bounceSubtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
</style>
