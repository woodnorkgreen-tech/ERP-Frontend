<template>
  <div class="quote-approval-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <h5 class="text-sm font-medium text-green-800 dark:text-green-200">Success</h5>
          <p class="text-xs text-green-600 dark:text-green-300">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Job Number Banner -->
    <div v-if="quoteData.projectInfo?.jobNumber" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg animate-pulse-subtle">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h5 class="text-sm font-bold text-blue-900 dark:text-blue-100">Project Activated</h5>
            <p class="text-xs text-blue-700 dark:text-blue-300">Job Number Assignment Finalized</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Reference ID</span>
          <div class="text-xl font-black text-blue-900 dark:text-blue-100 tracking-widest font-mono">{{ quoteData.projectInfo.jobNumber }}</div>
        </div>
      </div>
    </div>

    <!-- Quote Tab -->
    <div v-if="activeTab === 'quote'">
      <!-- Loading State -->
      <div v-if="isLoading" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <div>
            <h5 class="text-sm font-medium text-blue-800 dark:text-blue-200">Loading Quote Data</h5>
            <p class="text-xs text-blue-600 dark:text-blue-300">Fetching quote details from the related quote task...</p>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h5 class="text-sm font-medium text-red-800 dark:text-red-200">Failed to Load Quote</h5>
            <p class="text-xs text-red-600 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>



      <!-- Quote Summary -->
      <div v-else class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-white">Quote Summary</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Project:</strong> {{ quoteData.projectInfo?.enquiryTitle || quoteData.projectInfo?.projectId || 'N/A' }}</div>
          <div><strong>Client:</strong> {{ quoteData.projectInfo?.clientName || 'N/A' }}</div>
          <div><strong>Venue:</strong> {{ quoteData.projectInfo?.eventVenue || 'N/A' }}</div>
          <div><strong>Setup Date:</strong> {{ formatDate(quoteData.projectInfo?.setupDate) }}</div>
          <div><strong>Total Amount:</strong> {{ formatCurrency(quoteData.totals?.grandTotal || 0) }}</div>
          <div><strong>Status:</strong> <span :class="getQuoteStatusColor(quoteData.status || 'draft')" class="px-2 py-1 text-xs rounded-full font-medium">{{ getQuoteStatusLabel(quoteData.status || 'draft') }}</span></div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-3 bg-white dark:bg-gray-600 rounded">
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.subtotal) }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Subtotal</div>
          </div>
          <div class="text-center p-3 bg-white dark:bg-gray-600 rounded">
            <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatCurrency(quoteData.totals.totalMargin) }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Total Margin</div>
          </div>
          <div class="text-center p-3 bg-white dark:bg-gray-600 rounded">
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(quoteData.totals.grandTotal) }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Final Total</div>
          </div>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h5 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">Cost Breakdown</h5>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Materials & Components:</span>
            <span>{{ formatCurrency(quoteData.totals.materialsTotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Labour & Welfare:</span>
            <span>{{ formatCurrency(quoteData.totals.labourTotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Expenses & Overheads:</span>
            <span>{{ formatCurrency(quoteData.totals.expensesTotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Logistics & Transportation:</span>
            <span>{{ formatCurrency(quoteData.totals.logisticsTotal) }}</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-medium">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(quoteData.totals.subtotal) }}</span>
          </div>
          <div v-if="quoteData.discountAmount > 0" class="flex justify-between text-red-600 dark:text-red-400">
            <span>Discount:</span>
            <span>-{{ formatCurrency(quoteData.discountAmount) }}</span>
          </div>
          <div v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0" class="flex justify-between text-purple-600 dark:text-purple-400">
            <span>VAT ({{ quoteData.vatPercentage }}%):</span>
            <span>{{ formatCurrency(quoteData.totals.vatAmount) }}</span>
          </div>
          <div class="border-t-2 border-gray-300 dark:border-gray-500 pt-2 flex justify-between font-bold text-lg">
            <span>Grand Total:</span>
            <span>{{ formatCurrency(quoteData.totals.grandTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Review Tab -->
      <div v-if="activeTab === 'review'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Status *</label>
          <select
            v-model="formData.approval_status"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select approval status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>

        <div v-if="formData.approval_status === 'rejected'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rejection Reason *</label>
          <textarea
            v-model="formData.rejection_reason"
            required
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Please provide detailed reason for rejection..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Comments</label>
          <textarea
            v-model="formData.comments"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Additional comments or conditions..."
          ></textarea>
        </div>
      </div>

      <!-- Approval Tab -->
      <div v-if="activeTab === 'approval'">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approval Date</label>
          <input
            v-model="formData.approval_date"
            type="date"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Approved By *</label>
          <input
            v-model="formData.approved_by"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Your full name"
          />
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending' || task.status === 'in_progress'"
            @click="showSkipModal = true"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors mr-2"
          >
            Skip Task
          </button>
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Review
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Approval
          </button>
        </div>
        <div class="flex space-x-3">
          <div v-if="quoteData.projectInfo?.jobNumber" class="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Project Converted (Job #: {{ quoteData.projectInfo.jobNumber }})
            </span>
          </div>
          
          <button
            v-if="formData.approval_status === 'approved' && !quoteData.projectInfo?.jobNumber"
            type="button"
            @click="handleConvertToProject"
            :disabled="isConverting || isLoading"
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
             <svg v-if="isConverting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span>{{ isConverting ? 'Converting...' : 'Convert to Project' }}</span>
          </button>
          
          <button
            type="submit"
            :disabled="isLoading || isConverting"
            class="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors flex items-center space-x-2"
          >
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            <span>Save Approval Data</span>
          </button>
        </div>
      </div>
    </form>
    
    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Skip Task</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Please provide a reason for skipping this task.</p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            placeholder="Reason for skipping..."
        ></textarea>
        <div class="flex justify-end space-x-3">
            <button @click="showSkipModal = false" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}</button>
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

const activeTab = ref(props.initialTab || 'quote')
const isConverting = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

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
const successMessage = ref<string | null>(null)

const tabs = [
  { id: 'quote', label: 'Quote Details', icon: '📄' },
  { id: 'review', label: 'Review', icon: '🔍' },
  { id: 'approval', label: 'Approval', icon: '✅' }
]

const formData = ref({
  approval_status: '',
  rejection_reason: '',
  comments: '',
  approval_date: new Date().toISOString().split('T')[0],
  approved_by: user.value?.name || ''
})

// Real quote data structure matching QuoteTask output
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

/**
 * Load project enquiry data and quote data
 */
const loadQuoteData = async () => {
  if (!props.task.project_enquiry_id) {
    error.value = 'No enquiry ID found for this task'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // First, load the project enquiry data to get real project information
    const enquiryResponse = await axios.get(`/api/projects/enquiries/${props.task.project_enquiry_id}`)
    if (enquiryResponse.data.data) {
      const enquiry = enquiryResponse.data.data
      // Update project info with real enquiry data
      quoteData.value.projectInfo = {
        projectId: enquiry.enquiry_number || enquiry.id,
        enquiryTitle: enquiry.title || enquiry.event_name || 'Project Title',
        clientName: enquiry.client?.full_name || enquiry.client_name || 'Client Name',
        eventVenue: enquiry.venue || enquiry.event_venue || 'Venue TBC',
        setupDate: enquiry.setup_date || enquiry.event_date || new Date().toISOString(),
        setDownDate: enquiry.setdown_date || 'TBC',
        jobNumber: enquiry.job_number || ''
      }
      console.log('Project enquiry data loaded:', quoteData.value.projectInfo)
    }

    // Then find and load the related quote task data
    const tasksResponse = await axios.get(`/api/projects/enquiries/${props.task.project_enquiry_id}/tasks`)
    const tasks = tasksResponse.data.data || []
    const quoteTask = tasks.find((t: EnquiryTask) => t.type === 'quote')

    if (!quoteTask) {
      error.value = 'No quote task found for this enquiry. Please ensure a quote has been created first.'
      return
    }

    // Load the quote data from the quote task
    const quoteResponse = await axios.get(`/api/projects/tasks/${quoteTask.id}/quote`)
    if (quoteResponse.data.data) {
      // Merge quote data but preserve the real project info we just loaded
      const quoteDataFromAPI = quoteResponse.data.data
      const preservedProjectInfo = quoteData.value.projectInfo

      Object.assign(quoteData.value, quoteDataFromAPI)
      // Restore the real project info
      quoteData.value.projectInfo = preservedProjectInfo

      console.log('Quote data loaded successfully:', quoteData.value)

      // Initialize form with existing data if available
      if (quoteData.value.status && quoteData.value.status !== 'draft') {
        formData.value.approval_status = quoteData.value.status
      }
      if (quoteData.value.approvalComments) {
        formData.value.comments = quoteData.value.approvalComments
      }
      if (quoteData.value.approvedBy) {
        formData.value.approved_by = quoteData.value.approvedBy
      }
      if (quoteData.value.approvalDate) {
        formData.value.approval_date = quoteData.value.approvalDate
      }
      if (quoteData.value.rejectionReason) {
        formData.value.rejection_reason = quoteData.value.rejectionReason
      }
    } else {
      error.value = 'Quote data not found or incomplete'
    }
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    console.error('Failed to load quote data:', axiosError)
    error.value = axiosError.response?.data?.message || 'Failed to load quote data'
  } finally {
    isLoading.value = false
  }
}

/**
 * Validate the approval form
 */
const validateApproval = (): string | null => {
  if (!formData.value.approval_status) {
    return 'Please select an approval status'
  }

  if (formData.value.approval_status === 'rejected' && !formData.value.rejection_reason.trim()) {
    return 'Rejection reason is required when rejecting a quote'
  }

  if (!formData.value.approved_by.trim()) {
    return 'Approved by field is required'
  }

  return null // Valid
}

/**
 * Submit the approval decision
 */
const handleSubmit = async () => {
  const validationError = validateApproval()
  if (validationError) {
    error.value = validationError
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Save approval data
    const approvalData = {
      approval_status: formData.value.approval_status,
      rejection_reason: formData.value.approval_status === 'rejected' ? String(formData.value.rejection_reason || '') : null,
      comments: formData.value.comments || null,
      approval_date: formData.value.approval_date,
      approved_by: formData.value.approved_by,
      quote_amount: quoteData.value.totals?.grandTotal || 0,
      quote_data: quoteData.value
    }

    console.log('Submitting approval data:', approvalData)
    console.log('Form data:', formData.value)
    console.log('Quote data structure:', quoteData.value)
    console.log('Quote data projectInfo:', quoteData.value.projectInfo)
    console.log('Quote totals:', quoteData.value.totals)

    // Validate required fields before sending
    if (!approvalData.approval_status) {
      throw new Error('Approval status is required')
    }
    if (!approvalData.approved_by) {
      throw new Error('Approved by is required')
    }
    if (!approvalData.approval_date) {
      throw new Error('Approval date is required')
    }
    // if (approvalData.quote_amount <= 0) {
    //   throw new Error('Quote amount must be greater than 0')
    // }

    await axios.post(`/api/projects/tasks/${props.task.id}/approval`, approvalData)

    // Reload quote data to reflect new status
    await loadQuoteData()
    
    successMessage.value = 'Quote approval submitted successfully!'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)

    // Create audit entry (Endpoint pending)
    // await createAuditEntry()

    console.log('Approval submitted successfully:', approvalData)

    // Update task status based on approval
    if (formData.value.approval_status === 'approved') {
      updateStatus('completed')
    } else if (formData.value.approval_status === 'rejected') {
      updateStatus('completed') // Still complete the task, but with rejection
    } else {
      // For pending, keep task in progress
      updateStatus('in_progress')
    }

  } catch (err: unknown) {
    const axiosError = err as any
    console.error('Failed to submit approval:', axiosError)
    console.error('Full error response:', axiosError.response)
    console.error('Error status:', axiosError.response?.status)
    console.error('Error data:', axiosError.response?.data)

    // Handle validation errors
    if (axiosError.response?.data?.errors) {
      const validationErrors = Object.values(axiosError.response.data.errors).flat()
      console.error('Validation errors:', validationErrors)
      error.value = validationErrors.join(', ')
    } else {
      error.value = axiosError.response?.data?.message || 'Failed to submit approval'
    }

    console.error('Final error message set:', error.value)
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle Convert to Project action
 * This triggers the backend to generate the WNG job number and create a formal Project record
 */
const handleConvertToProject = async () => {
  if (!props.task.project_enquiry_id) {
    error.value = 'No enquiry ID found for this task'
    return
  }

  // Confirmation dialog
  if (!confirm('This will formalize the project, generate a Job Number, and create the main Project record. Proceed?')) {
    return
  }

  isConverting.value = true
  error.value = null

  try {
    // 1. First ensure approval data is saved if they haven't saved it yet
    if (formData.value.approval_status === 'approved') {
       const approvalData = {
          approval_status: formData.value.approval_status,
          rejection_reason: null,
          comments: formData.value.comments || null,
          approval_date: formData.value.approval_date,
          approved_by: formData.value.approved_by,
          quote_amount: quoteData.value.totals?.grandTotal || 0,
          quote_data: quoteData.value
        }
        await axios.post(`/api/projects/tasks/${props.task.id}/approval`, approvalData)
    }

    // 2. Call the enquiry's approve-quote endpoint which handles conversion
    const response = await axios.post(`/api/projects/enquiries/${props.task.project_enquiry_id}/approve-quote`)
    
    if (response.data.data) {
      const enquiry = response.data.data
      // Update local state with the newly minted job number
      quoteData.value.projectInfo.jobNumber = enquiry.job_number
      
      successMessage.value = `Conversion successful! Project activated with Job Number: ${enquiry.job_number}`
      
      // Update task status and complete
      updateStatus('completed')
      
      setTimeout(() => {
        successMessage.value = null
      }, 5000)
    }
  } catch (err: any) {
    console.error('Conversion failed:', err)
    error.value = err.response?.data?.message || 'Failed to convert to project'
  } finally {
    isConverting.value = false
  }
}

/**
 * Create audit trail entry for the approval
 */
const createAuditEntry = async () => {
  try {
    await axios.post('/api/audit/quote-approvals', {
      task_id: props.task.id,
      enquiry_id: props.task.project_enquiry_id,
      approval_status: formData.value.approval_status,
      approved_by: formData.value.approved_by,
      approval_date: formData.value.approval_date,
      rejection_reason: formData.value.rejection_reason,
      comments: formData.value.comments,
      quote_amount: quoteData.value.totals.grandTotal,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.warn('Failed to create audit entry:', err)
    // Don't fail the approval for audit issues
  }
}

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

// Utility functions
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'tbc') return 'TBC'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getQuoteStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || colors.draft
}

const getQuoteStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected'
  }
  return labels[status] || 'Draft'
}

// Watch for task changes to reset form and reload data
watch(() => props.task.id, () => {
  // Reset form for new task
  formData.value = {
    approval_status: '',
    rejection_reason: '',
    comments: '',
    approval_date: new Date().toISOString().split('T')[0],
    approved_by: user.value?.name || ''
  }

  // Reload quote data for new task
  loadQuoteData()
})

// Initialize on mount
onMounted(() => {
  loadQuoteData()
})
</script>
