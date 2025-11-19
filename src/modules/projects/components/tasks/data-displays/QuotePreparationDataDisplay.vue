<template>
  <div class="quote-preparation-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        <span>Quote Preparation Data</span>
      </h3>

      <!-- Project Information -->
      <div class="mb-6">
        <h4 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Project Information</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Project ID" :value="taskData.projectInfo?.projectId" />
          <DataField label="Enquiry Title" :value="taskData.projectInfo?.enquiryTitle" />
          <DataField label="Client Name" :value="taskData.projectInfo?.clientName" />
          <DataField label="Event Venue" :value="taskData.projectInfo?.eventVenue" />
          <DataField label="Setup Date" :value="formatDate(taskData.projectInfo?.setupDate)" />
          <DataField label="Set Down Date" :value="taskData.projectInfo?.setDownDate" />
        </div>
      </div>

      <!-- Budget Import Status -->
      <div class="mb-6">
        <DataField label="Budget Imported" :value="taskData.budgetImported ? 'Yes' : 'No'" />
        <DataField label="Quote Status" :value="getQuoteStatusLabel(taskData.status)" />
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- Materials Tab -->
        <QuoteMaterialsTab
          v-show="activeTab === 'materials'"
          :materials="taskData.materials as any"
          :materials-base="(taskData.totals as any)?.materialsBase"
          :materials-total="(taskData.totals as any)?.materialsTotal"
        />

        <!-- Labour Tab -->
        <QuoteLabourTab
          v-show="activeTab === 'labour'"
          :labour="taskData.labour as any"
          :labour-total="(taskData.totals as any)?.labourTotal"
        />

        <!-- Expenses Tab -->
        <QuoteExpensesTab
          v-show="activeTab === 'expenses'"
          :expenses="taskData.expenses as any"
          :expenses-base="(taskData.totals as any)?.expensesBase"
          :expenses-total="(taskData.totals as any)?.expensesTotal"
        />

        <!-- Logistics Tab -->
        <QuoteLogisticsTab
          v-show="activeTab === 'logistics'"
          :logistics="taskData.logistics as any"
          :logistics-base="(taskData.totals as any)?.logisticsBase"
          :logistics-total="(taskData.totals as any)?.logisticsTotal"
        />

        <!-- Summary Tab -->
        <QuoteSummaryTab
          v-show="activeTab === 'summary'"
          :materials-base="(taskData.totals as any)?.materialsBase"
          :materials-margin="(taskData.totals as any)?.materialsMargin"
          :materials-total="(taskData.totals as any)?.materialsTotal"
          :labour-base="(taskData.totals as any)?.labourBase"
          :labour-margin="(taskData.totals as any)?.labourMargin"
          :labour-total="(taskData.totals as any)?.labourTotal"
          :expenses-base="(taskData.totals as any)?.expensesBase"
          :expenses-margin="(taskData.totals as any)?.expensesMargin"
          :expenses-total="(taskData.totals as any)?.expensesTotal"
          :logistics-base="(taskData.totals as any)?.logisticsBase"
          :logistics-margin="(taskData.totals as any)?.logisticsMargin"
          :logistics-total="(taskData.totals as any)?.logisticsTotal"
          :subtotal="(taskData.totals as any)?.subtotal"
          :discount-amount="taskData.discountAmount as any"
          :total-after-discount="(taskData.totals as any)?.totalAfterDiscount"
          :vat-percentage="taskData.vatPercentage as any"
          :vat-amount="(taskData.totals as any)?.vatAmount"
          :vat-enabled="taskData.vatEnabled as any"
          :grand-total="(taskData.totals as any)?.grandTotal"
          :total-margin="(taskData.totals as any)?.totalMargin"
          :overall-margin-percentage="(taskData.totals as any)?.overallMarginPercentage"
          :margins="taskData.margins as any"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'
import QuoteMaterialsTab from '../QuoteMaterialsTab.vue'
import QuoteLabourTab from '../QuoteLabourTab.vue'
import QuoteExpensesTab from '../QuoteExpensesTab.vue'
import QuoteLogisticsTab from '../QuoteLogisticsTab.vue'
import QuoteSummaryTab from '../QuoteSummaryTab.vue'

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

// Tab state
const activeTab = ref('materials')

// Tab configuration
const tabs = [
  { key: 'materials', label: 'Materials' },
  { key: 'labour', label: 'Labour' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'logistics', label: 'Logistics' },
  { key: 'summary', label: 'Summary' }
]

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return 'Not specified'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return dateString
  }
}

const getQuoteStatusLabel = (status: unknown) => {
  const statusMap = {
    draft: 'Draft',
    pending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected'
  }
  return statusMap[status as keyof typeof statusMap] || status || 'Unknown'
}
</script>

<style scoped>
.quote-preparation-data-display {
  max-width: none;
}
</style>
