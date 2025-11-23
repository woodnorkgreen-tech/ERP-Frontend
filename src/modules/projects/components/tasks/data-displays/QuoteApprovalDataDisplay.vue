<template>
  <div class="quote-approval-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Quote Approval Details</span>
      </h3>

      <div class="space-y-4">
        <!-- Approval Status with color coding -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Approval Status
          </label>
          <div class="text-sm font-medium px-3 py-2 rounded-md inline-block"
               :class="getStatusClass(taskData.approvalStatus)">
            {{ getStatusLabel(taskData.approvalStatus) }}
          </div>
        </div>

        <DataField label="Approved By" :value="taskData.approvedBy" />
        <DataField label="Approval Date" :value="formatDate(taskData.approvalDate)" />
        <DataField label="Quote Amount" :value="formatCurrency(taskData.quoteAmount)" />
        
        <DataField 
          v-if="taskData.comments" 
          label="Comments" 
          :value="taskData.comments" 
          type="textarea" 
        />
        
        <DataField 
          v-if="taskData.rejectionReason" 
          label="Rejection Reason" 
          :value="taskData.rejectionReason" 
          type="textarea" 
        />

        <!-- Quote Summary if available -->
        <div v-if="taskData.quoteData" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">Quote Summary</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <DataField label="Project" :value="taskData.quoteData.projectInfo?.enquiryTitle" />
            <DataField label="Client" :value="taskData.quoteData.projectInfo?.clientName" />
            <DataField label="Venue" :value="taskData.quoteData.projectInfo?.eventVenue" />
            <DataField label="Setup Date" :value="formatDate(taskData.quoteData.projectInfo?.setupDate)" />
            <DataField label="Subtotal" :value="formatCurrency(taskData.quoteData.totals?.subtotal)" />
            <DataField label="Grand Total" :value="formatCurrency(taskData.quoteData.totals?.grandTotal)" />
          </div>
          
          <!-- View Full Quote Button -->
          <div class="mt-4">
            <button
              @click="openQuoteViewer"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>View Full Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quote Viewer Modal -->
    <QuoteViewer
      :is-visible="showQuoteViewer"
      :quote-data="taskData.quoteData"
      :readonly="true"
      @close="closeQuoteViewer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'
import QuoteViewer from '../QuoteViewer.vue'

// Reusable Data Field Component
const DataField = {
  props: {
    label: String,
    value: [String, Number],
    type: { type: String, default: 'text' }
  },
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ label }}
      </label>
      <div v-if="type === 'textarea'" class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        {{ value || 'Not specified' }}
      </div>
      <div v-else class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
        {{ value || 'Not specified' }}
      </div>
    </div>
  `
}

interface Props {
  task: EnquiryTask
  taskData: Record<string, unknown>
}

defineProps<Props>()

// Quote Viewer Modal State
const showQuoteViewer = ref(false)

const openQuoteViewer = () => {
  showQuoteViewer.value = true
}

const closeQuoteViewer = () => {
  showQuoteViewer.value = false
}

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}


const formatCurrency = (amount: unknown) => {
  if (!amount) return null
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (typeof numAmount !== 'number' || isNaN(numAmount)) return amount
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount)
}

const getStatusClass = (status: unknown) => {
  const statusStr = String(status || '').toLowerCase()
  const classes: Record<string, string> = {
    'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[statusStr] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getStatusLabel = (status: unknown) => {
  const statusStr = String(status || '').toLowerCase()
  const labels: Record<string, string> = {
    'approved': 'Approved ✓',
    'rejected': 'Rejected ✗',
    'pending': 'Pending Review'
  }
  return labels[statusStr] || String(status || 'Unknown')
}
</script>

<style scoped>
.quote-approval-data-display {
  max-width: none;
}
</style>
