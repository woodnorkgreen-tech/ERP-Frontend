<template>
  <div class="quote-approval-task font-poppins bg-slate-50/50 dark:bg-gray-900/50 min-h-full rounded-2xl overflow-hidden">
    <!-- Premium Header / Hero Section -->
    <div class="relative p-8 mb-8 overflow-hidden bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-sm">
      <div class="absolute top-0 right-0 p-4 -mr-16 -mt-16 opacity-5 dark:opacity-10 rotate-12">
        <i class="mdi mdi-file-certificate text-[200px] text-blue-600"></i>
      </div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
            <i class="mdi mdi-file-sign text-3xl"></i>
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Quote Approval
            </h2>
            <div class="flex items-center gap-3 mt-2 text-slate-500 dark:text-gray-400 font-medium">
              <span class="flex items-center gap-1">
                <i class="mdi mdi-identifier text-blue-500"></i>
                {{ quoteData.projectInfo?.projectId || 'ID TBC' }}
              </span>
              <span class="w-1 h-1 rounded-full bg-slate-300"></span>
              <span class="flex items-center gap-1">
                <i class="mdi mdi-domain text-indigo-500"></i>
                {{ quoteData.projectInfo?.clientName || 'Client TBC' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-1">Total Valuation</p>
          <div class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-baseline gap-1">
             <span class="text-xl font-bold text-blue-500">KES</span>
             {{ formatCurrencyValue(quoteData.totals?.grandTotal || 0) }}
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-gray-700">
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-gray-700/50 border border-slate-100 dark:border-gray-700">
           <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Materials</p>
           <p class="text-lg font-black text-slate-900 dark:text-white">{{ formatCurrency(quoteData.totals.materialsTotal) }}</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-gray-700/50 border border-slate-100 dark:border-gray-700">
           <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Labour</p>
           <p class="text-lg font-black text-slate-900 dark:text-white">{{ formatCurrency(quoteData.totals.labourTotal) }}</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-gray-700/50 border border-slate-100 dark:border-gray-700">
           <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Logistics</p>
           <p class="text-lg font-black text-slate-900 dark:text-white">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
           <p class="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">Profit Margin</p>
           <p class="text-lg font-black text-blue-700 dark:text-blue-400">{{ formatCurrency(quoteData.totals.totalMargin) }} ({{ quoteData.totals.overallMarginPercentage }}%)</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 pt-0">
      <!-- Left Column: Action & Decision -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Main Decision Card -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <i class="mdi mdi-gavel"></i>
              </span>
              Final Decision
            </h3>
            <button 
              @click="showQuoteViewer = true"
              class="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-gray-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
            >
              <i class="mdi mdi-eye-outline text-lg"></i>
              View Full Quote
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 ml-1">Approval Status</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    @click="formData.approval_status = 'approved'"
                    :class="formData.approval_status === 'approved' ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30' : 'bg-slate-50 dark:bg-gray-700 dark:border-gray-600 text-slate-500 border-slate-200'"
                    class="h-14 rounded-2xl border font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <i class="mdi mdi-check-circle-outline text-xl"></i>
                    Approve
                  </button>
                  <button 
                    type="button"
                    @click="formData.approval_status = 'rejected'"
                    :class="formData.approval_status === 'rejected' ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30' : 'bg-slate-50 dark:bg-gray-700 dark:border-gray-600 text-slate-500 border-slate-200'"
                    class="h-14 rounded-2xl border font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <i class="mdi mdi-close-circle-outline text-xl"></i>
                    Reject
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 ml-1">Approval Date</label>
                <input
                  v-model="formData.approval_date"
                  type="date"
                  class="w-full h-14 px-6 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div v-if="formData.approval_status === 'rejected'" class="space-y-2 animate-slide-up">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 ml-1">Rejection Reason Required</label>
              <textarea
                v-model="formData.rejection_reason"
                required
                rows="3"
                class="w-full px-6 py-4 bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-red-300"
                placeholder="Explain why this quote was declined..."
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 ml-1">Comments & Conditions</label>
              <textarea
                v-model="formData.comments"
                rows="3"
                class="w-full px-6 py-4 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                placeholder="Add any internal notes or client stipulations..."
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 ml-1">Approved By</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                  <i class="mdi mdi-account-check"></i>
                </div>
                <input
                  v-model="formData.approved_by"
                  type="text"
                  required
                  class="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div class="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-gray-700">
              <button
                v-if="task.status !== 'completed' && task.status !== 'skipped'"
                type="button"
                @click="showSkipModal = true"
                class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip Task
              </button>

              <button
                v-if="['skipped', 'completed'].includes(task.status)"
                type="button"
                @click="$emit('update-status', 'pending')"
                class="text-xs font-black uppercase tracking-widest text-yellow-600 hover:text-yellow-700 transition-colors"
               >
                {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
               </button>
              <div v-else></div>

              <div class="flex gap-4">
                <button
                  type="submit"
                  :disabled="isLoading || !formData.approval_status"
                  class="h-14 px-10 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                >
                  <i v-if="isLoading" class="mdi mdi-loading mdi-spin text-lg"></i>
                  <i v-else class="mdi mdi-content-save-check text-lg"></i>
                  <span>{{ isLoading ? 'Processing...' : 'Save Decision' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Project Activation Area (If approved) -->
        <div 
          v-if="formData.approval_status === 'approved'"
          class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-1 shadow-xl shadow-emerald-500/20 animate-fade-in"
        >
          <div class="bg-white dark:bg-gray-800 rounded-[calc(1.5rem-2px)] p-8">
            <div class="flex flex-col md:flex-row items-center gap-8">
              <div class="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <i class="mdi mdi-lightning-bolt text-4xl"></i>
              </div>
              <div class="flex-grow text-center md:text-left">
                <h4 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Activate This Project</h4>
                <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">
                  Ready to move production? Activating creates the formal Job Number and alerts relevant departments.
                </p>
              </div>
              <div class="shrink-0 w-full md:w-auto">
                <div v-if="quoteData.projectInfo?.jobNumber" class="bg-emerald-50 dark:bg-emerald-900/30 px-6 py-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center">
                   <p class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Active Job Number</p>
                   <p class="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-[0.2em]">{{ quoteData.projectInfo.jobNumber }}</p>
                </div>
                <button
                  v-else
                  @click="handleConvertToProject"
                  :disabled="isConverting || isLoading"
                  class="w-full md:w-auto h-16 px-8 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                   <i v-if="isConverting" class="mdi mdi-loading mdi-spin"></i>
                   <i v-else class="mdi mdi-rocket-launch"></i>
                   <span>{{ isConverting ? 'Activating...' : 'Activate & Assign WNG Job #' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Status & Preview -->
      <div class="space-y-8">
        <!-- Status Box -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Live Status Tracking</p>
          <div class="flex flex-col gap-4">
             <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-gray-700/50">
               <span class="text-xs font-bold text-slate-500">Processing</span>
               <span :class="getQuoteStatusColor(quoteData.status || 'draft')" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm">
                 {{ getQuoteStatusLabel(quoteData.status || 'draft') }}
               </span>
             </div>
             <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-gray-700/50">
               <span class="text-xs font-bold text-slate-500">Task State</span>
               <span :class="getStatusBadgeClasses(task.status)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm">
                 {{ getStatusLabel(task.status) }}
               </span>
             </div>
          </div>
        </div>

        <!-- Venue Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 -mr-8 -mt-8 opacity-5 group-hover:scale-110 transition-transform">
             <i class="mdi mdi-map-marker-radius text-8xl text-indigo-500"></i>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Logistics Context</p>
          <div class="space-y-4 relative z-10">
             <div>
               <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Event Venue</p>
               <p class="text-sm font-bold text-slate-900 dark:text-white">{{ quoteData.projectInfo?.eventVenue || 'TBC' }}</p>
             </div>
             <div>
               <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Setup Commencement</p>
               <p class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(quoteData.projectInfo?.setupDate) }}</p>
             </div>
          </div>
        </div>

        <!-- System Alerts -->
        <div v-if="successMessage || error" class="animate-bounce-subtle">
           <div v-if="successMessage" class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
              <i class="mdi mdi-check-circle text-emerald-500 text-xl"></i>
              <p class="text-xs font-bold text-emerald-700 dark:text-emerald-300">{{ successMessage }}</p>
           </div>
           <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 mt-4">
              <i class="mdi mdi-alert-circle text-red-500 text-xl"></i>
              <p class="text-xs font-bold text-red-700 dark:text-red-300">{{ error }}</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showQuoteViewer" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-12">
      <div class="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-7xl h-full flex flex-col overflow-hidden relative border border-white/10">
        <button 
          @click="showQuoteViewer = false"
          class="absolute top-8 right-8 z-[60] w-12 h-12 bg-white/10 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
        <div class="flex-grow overflow-y-auto">
          <QuoteViewer 
            v-if="quoteTaskId"
            :is-visible="true"
            :readonly="true"
            :quote-data="quoteData"
            @close="showQuoteViewer = false"
          />
        </div>
      </div>
    </div>

    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/5">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Bypass Approval</h3>
        <p class="text-slate-500 dark:text-gray-400 font-medium mb-6">Why is this financial validation being skipped? This will be logged in project history.</p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-6 py-4 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 mb-6"
            placeholder="Reason for bypass..."
        ></textarea>
        <div class="flex gap-4">
            <button @click="showSkipModal = false" class="flex-1 h-14 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
            <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="flex-1 h-14 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50">
              {{ isSkipping ? 'Bypassing...' : 'Confirm' }}
            </button>
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
