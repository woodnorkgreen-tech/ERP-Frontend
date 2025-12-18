<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
        Sales Funnel
      </h3>
      <div class="flex items-center space-x-2">
        <span class="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
          +{{ conversionRate }}% Conversion
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Funnel Step 1: Enquiries -->
      <div class="relative group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Enquiries</span>
          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ totalEnquiries }}</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
          <div class="bg-blue-400 h-2 rounded-full w-full"></div>
        </div>
      </div>

      <!-- Funnel Step 2: Quotes -->
      <div class="relative group pl-4">
          <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 border-dashed border-l"></div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Quotes Generated</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ quotesGenerated }}</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-indigo-400 h-2 rounded-full" :style="{ width: `${getPercentage(quotesGenerated, totalEnquiries)}%` }"></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">{{ getPercentage(quotesGenerated, totalEnquiries) }}% of enquiries</p>
      </div>

       <!-- Funnel Step 3: Approved -->
       <div class="relative group pl-8">
          <div class="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 border-dashed border-l"></div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Quotes Approved</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ quotesApproved }}</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" :style="{ width: `${getPercentage(quotesApproved, quotesGenerated)}%` }"></div>
          </div>
           <p class="text-xs text-gray-400 mt-1">{{ getPercentage(quotesApproved, quotesGenerated) }}% approval rate</p>
      </div>
      
       <!-- Funnel Step 4: Projects -->
       <div class="relative group pl-12">
          <div class="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 border-dashed border-l"></div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Projects</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ activeProjects }}</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${getPercentage(activeProjects, quotesApproved)}%` }"></div>
          </div>
           <p class="text-xs text-gray-400 mt-1">{{ getPercentage(activeProjects, quotesApproved) }}% execution rate</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  enquiryMetrics: {
    total_enquiries: number
    status_breakdown: Record<string, number>
  }
  projectMetrics: {
    active_projects: number
    completed_projects: number
  }
}

const props = defineProps<Props>()

const totalEnquiries = computed(() => props.enquiryMetrics?.total_enquiries || 0)

const quotesGenerated = computed(() => {
  const breakdown = props.enquiryMetrics?.status_breakdown || {}
  // Sum of all statuses after quote preparation
  const relevantStatuses = ['quote_prepared', 'quote_approved', 'planning', 'in_progress', 'completed']
  return relevantStatuses.reduce((acc, status) => acc + (breakdown[status] || 0), 0)
})

const quotesApproved = computed(() => {
   const breakdown = props.enquiryMetrics?.status_breakdown || {}
   const relevantStatuses = ['quote_approved', 'planning', 'in_progress', 'completed']
   return relevantStatuses.reduce((acc, status) => acc + (breakdown[status] || 0), 0)
})

const activeProjects = computed(() => props.projectMetrics?.active_projects || 0)

const conversionRate = computed(() => {
  if (totalEnquiries.value === 0) return 0
  return Math.round((quotesApproved.value / totalEnquiries.value) * 100)
})

const getPercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
</script>
