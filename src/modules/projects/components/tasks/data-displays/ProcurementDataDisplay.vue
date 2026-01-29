<template>
   <!-- Readonly procurement data display -->
   <div class="procurement-data-display animate-in fade-in duration-500">
      <!-- Header Section -->
      <div class="flex items-center justify-between mb-8 px-1">
         <div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
               <span class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <i class="mdi mdi-clipboard-text-outline text-xl"></i>
               </span>
               Procurement Summary
            </h3>
            <p class="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest pl-1">View-only inventory & purchasing status</p>
         </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-1">
         <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Project Budget</p>
               <p class="text-2xl font-black text-slate-900 dark:text-white">{{ formatCurrency(taskData.budgetSummary?.materialsTotal) }}</p>
            </div>
            <i class="mdi mdi-cash-multiple absolute right-4 bottom-4 text-5xl text-slate-100 dark:text-slate-700/50 -rotate-12 group-hover:rotate-0 transition-transform duration-500"></i>
         </div>

         <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Items Tracked</p>
               <p class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ taskData.budgetSummary?.totalItems }} Items</p>
            </div>
            <i class="mdi mdi-package-variant absolute right-4 bottom-4 text-5xl text-slate-100 dark:text-slate-700/50 group-hover:scale-110 transition-transform duration-500"></i>
         </div>

         <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Completion Level</p>
               <div class="flex items-center gap-3">
                  <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ calculateCompletionPercentage() }}%</p>
                  <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                     <div class="h-full bg-emerald-500 transition-all duration-1000" :style="{ width: `${calculateCompletionPercentage()}%` }"></div>
                  </div>
               </div>
            </div>
            <i class="mdi mdi-check-decagram absolute right-4 bottom-4 text-5xl text-slate-100 dark:text-slate-700/50 group-hover:text-emerald-50 dark:group-hover:text-emerald-900/20 transition-colors duration-500"></i>
         </div>
      </div>

      <!-- Integrated Content Box -->
      <div class="bg-white dark:bg-gray-900 border border-blue-500 dark:border-blue-800 rounded-2xl p-8 shadow-sm min-h-[400px]">

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
      </div> <!-- End of content box -->
   </div> <!-- End of display container -->
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
    item.availabilityStatus && completedStatuses.includes(item.availabilityStatus)
  ).length

  return Math.round((completedItems / props.taskData.procurementItems.length) * 100)
}

const getStatusCount = (status: ProcurementItem['availabilityStatus']) => {
  if (!props.taskData.procurementItems) return 0
  return props.taskData.procurementItems.filter(item => item.availabilityStatus === status).length
}

const getStatusClass = (status: ProcurementItem['availabilityStatus']) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
