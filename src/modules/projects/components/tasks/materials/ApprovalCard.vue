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
        <span v-else-if="isGated" class="text-xs text-amber-600 dark:text-amber-400 truncate flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Gated by Design
        </span>
        <span v-else class="text-xs text-gray-400 truncate">
          Pending
        </span>
      </div>
    </div>

    <!-- Right: Action -->
    <div class="flex-shrink-0 ml-2">
      <div v-if="!approved && canApprove" class="flex items-center gap-2">
         <div class="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <input 
              v-model="localComments"
              class="w-32 md:w-48 px-1 py-0.5 text-xs text-gray-700 dark:text-gray-200 bg-transparent border-0 focus:ring-0 placeholder-gray-400"
              placeholder="Rationale/Comments..."
              @keyup.enter="handleApprove"
            />
         </div>
         <button 
           @click="handleApprove"
           :disabled="isGated"
           class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
           :title="isGated ? 'Approval is locked until design is approved' : 'Approve materials'"
         >
           <svg v-if="!isGated" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
           <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
           {{ isGated ? 'Locked' : 'Approve' }}
         </button>
      </div>
      
      <div v-else-if="approved" class="flex flex-col items-end">
         <div class="flex items-center gap-1 text-emerald-500">
            <span class="text-[10px] font-bold uppercase tracking-wider">Approved</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
         </div>
         <p v-if="approvalData.comments" class="text-[10px] text-gray-500 italic max-w-[150px] truncate" :title="approvalData.comments">
           "{{ approvalData.comments }}"
         </p>
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
  department: 'design' | 'production' | 'project_officer'
  title: string
  approvalData: ApprovalData
  canApprove: boolean
  isGated?: boolean
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
