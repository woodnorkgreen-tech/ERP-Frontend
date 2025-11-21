<template>
  <div class="approval-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <!-- Card Header -->
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</h4>
      <span
        v-if="approved"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      >
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        Approved
      </span>
      <span
        v-else
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      >
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
        </svg>
        Pending
      </span>
    </div>

    <!-- Approved Info -->
    <div v-if="approved" class="space-y-2">
      <div class="flex justify-between text-xs">
        <span class="text-gray-500 dark:text-gray-400">Approved by:</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ approvalData.approved_by_name || 'Unknown' }}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-gray-500 dark:text-gray-400">Date:</span>
        <span class="text-gray-700 dark:text-gray-300">{{ formatDate(approvalData.approved_at) }}</span>
      </div>
      <div v-if="approvalData.comments" class="pt-2 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Comments:</p>
        <p class="text-sm text-gray-700 dark:text-gray-300">{{ approvalData.comments }}</p>
      </div>
    </div>

    <!-- Approval Action (for pending) -->
    <div v-else-if="canApprove" class="space-y-3">
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Comments (optional)
        </label>
        <textarea
          v-model="localComments"
          rows="2"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add any comments about this approval..."
        />
      </div>
      <button
        @click="handleApprove"
        class="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Approve as {{ title }}
      </button>
    </div>

    <!-- Waiting State (no permission) -->
    <div v-else class="text-center py-3">
      <svg class="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-xs text-gray-500 dark:text-gray-400">Waiting for {{ title }} approval</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ApprovalData {
  approved: boolean
  approved_by?: number | null
  approved_by_name?: string | null
  approved_at?: string | null
  comments?: string
}

interface Props {
  department: 'design' | 'production' | 'finance'
  title: string
  approvalData: ApprovalData
  canApprove: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  approve: [comments: string]
}>()

const localComments = ref('')

const approved = computed(() => props.approvalData?.approved || false)

const handleApprove = () => {
  emit('approve', localComments.value)
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
