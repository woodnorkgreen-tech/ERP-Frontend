<template>
  <div class="procurement-data-display">
    <!-- Project Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <span>Procurement & Inventory Management</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DataField label="Project Title" :value="taskData.projectInfo?.enquiryTitle" />
        <DataField label="Project ID" :value="taskData.projectInfo?.projectId" />
        <DataField label="Client Name" :value="taskData.projectInfo?.clientName" />
        <DataField label="Event Venue" :value="taskData.projectInfo?.eventVenue" />
        <DataField label="Expected Delivery" :value="formatDate(taskData.projectInfo?.setupDate)" />
        <DataField label="Import Date" :value="formatDate(taskData.lastImportDate)" />
      </div>

      <!-- Budget Summary -->
      <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Budget Summary</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div class="text-sm text-blue-600 dark:text-blue-400">Materials Budget</div>
            <div class="text-lg font-semibold text-blue-900 dark:text-blue-100">
              KES {{ formatCurrency(taskData.budgetSummary?.materialsTotal) }}
            </div>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div class="text-sm text-green-600 dark:text-green-400">Total Items</div>
            <div class="text-lg font-semibold text-green-900 dark:text-green-100">
              {{ taskData.budgetSummary?.totalItems }}
            </div>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div class="text-sm text-purple-600 dark:text-purple-400">Completion</div>
            <div class="text-lg font-semibold text-purple-900 dark:text-purple-100">
              {{ calculateCompletionPercentage() }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Procurement Items -->
    <div v-if="taskData.procurementItems && taskData.procurementItems.length > 0" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Procurement Items</h4>

      <!-- Status Summary -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Procurement Status Summary</h5>
        <div class="grid grid-cols-5 gap-2">
          <div v-for="status in ['available', 'ordered', 'received', 'hired', 'cancelled']" :key="status" class="text-center">
            <div :class="getStatusClass(status as ProcurementItem['availabilityStatus'])" class="px-2 py-1 rounded-full mb-1 text-xs">
              {{ getStatusCount(status as ProcurementItem['availabilityStatus']) }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 capitalize">{{ status }}</div>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="space-y-4">
        <div v-for="item in taskData.procurementItems" :key="item.budgetItemId" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h6 class="font-medium text-gray-900 dark:text-white">{{ item.description }}</h6>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.elementName }} • ID: {{ item.budgetItemId }}</p>
            </div>
            <span :class="getStatusBadgeClass(item.availabilityStatus)" class="px-2 py-1 text-xs rounded-full capitalize">
              {{ item.availabilityStatus }}
            </span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Quantity:</span>
              <span class="ml-1 text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unitOfMeasurement }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Unit Price:</span>
              <span class="ml-1 text-gray-900 dark:text-white">KES {{ formatCurrency(item.budgetUnitPrice) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Total Price:</span>
              <span class="ml-1 text-gray-900 dark:text-white">KES {{ formatCurrency(item.budgetTotalPrice) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Vendor:</span>
              <span class="ml-1 text-gray-900 dark:text-white">{{ item.vendorName || 'Not assigned' }}</span>
            </div>
          </div>

          <div v-if="item.procurementNotes" class="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
            <strong>Notes:</strong> {{ item.procurementNotes }}
          </div>
        </div>
      </div>
    </div>

    <!-- No Data Message -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Procurement Data</h3>
      <p class="text-gray-600 dark:text-gray-400">No procurement items have been processed for this task yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../../types/enquiry'
import type { ProcurementTaskData, ProcurementItem } from '../../../services'

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
  taskData: ProcurementTaskData
}

const props = defineProps<Props>()

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
    currency: 'KES'
  }).format(numAmount)
}

const calculateCompletionPercentage = () => {
  if (!props.taskData.procurementItems || props.taskData.procurementItems.length === 0) return 0

  const completedStatuses = ['received', 'hired']
  const completedItems = props.taskData.procurementItems.filter(item =>
    completedStatuses.includes(item.availabilityStatus)
  ).length

  return Math.round((completedItems / props.taskData.procurementItems.length) * 100)
}

const getStatusCount = (status: ProcurementItem['availabilityStatus']) => {
  if (!props.taskData.procurementItems) return 0
  return props.taskData.procurementItems.filter(item => item.availabilityStatus === status).length
}

const getStatusClass = (status: ProcurementItem['availabilityStatus']) => {
  const classes: Record<string, string> = {
    'available': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'ordered': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'received': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    'hired': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusBadgeClass = (status: ProcurementItem['availabilityStatus']) => {
  const classes: Record<string, string> = {
    'available': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'ordered': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'received': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'hired': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>

<style scoped>
.procurement-data-display {
  max-width: none;
}
</style>
