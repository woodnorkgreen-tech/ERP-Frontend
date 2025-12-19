<template>
  <div class="px-4 py-3 flex items-center justify-between group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
    
    <!-- Left: Identity & Status -->
    <div class="flex items-center gap-3 min-w-0">
      <!-- Icon Status -->
      <div 
        class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        :class="[
          approved ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
          canApprove ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
          'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
        ]"
      >
        <svg v-if="approved" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <svg v-else-if="canApprove" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>

      <!-- Text -->
      <div class="flex flex-col min-w-0">
        <span class="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">{{ title }}</span>
        <span v-if="approved" class="text-xs text-green-600 dark:text-green-400 truncate">
          Approved ({{ formatDate(approvalData.approved_at) }})
        </span>
        <span v-else-if="canApprove" class="text-xs text-blue-600 dark:text-blue-400 truncate">
          Action Required
        </span>
        <span v-else class="text-xs text-gray-400 truncate">
          Pending
        </span>
      </div>
    </div>

    <!-- Right: Action -->
    <div class="flex-shrink-0 ml-2">
      <div v-if="!approved && canApprove">
         <!-- Two-state Action: Button -> Input -->
         <button 
           v-if="!showInput"
           @click="showInput = true"
           class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-sm transition-colors"
         >
           Approve
         </button>
         <div v-else class="flex items-center bg-white dark:bg-gray-700 rounded border border-blue-300 dark:border-blue-500 shadow-sm p-0.5 animate-fade-in-right">
            <input 
              v-model="localComments"
              ref="commentInput"
              class="w-24 md:w-32 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-200 bg-transparent border-0 focus:ring-0 placeholder-gray-400"
              placeholder="Comment..."
              @keyup.enter="handleApprove"
              @keydown.esc="showInput = false"
            />
            <button 
              @click="handleApprove"
              class="ml-1 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              title="Confirm Approval"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </button>
            <button 
              @click="showInput = false"
              class="ml-0.5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
         </div>
      </div>
      
      <div v-else-if="approved" class="text-green-500">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
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
const showInput = ref(false)

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
    })
  } catch {
    return dateString
  }
}
</script>
