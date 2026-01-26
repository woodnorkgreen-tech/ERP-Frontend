<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 lg:p-8 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-300">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/40 relative">
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-center min-w-0">
            <div class="min-w-0">
               <h2 class="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight uppercase">
                 Assignment History
               </h2>
               <p class="mt-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest opacity-80 truncate">
                 {{ task?.title || 'Project Task' }}
               </p>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- History Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-gray-900/40 p-8">
        
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
          <div class="relative w-12 h-12">
            <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Loading history...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start space-x-4">
          <div>
            <h4 class="text-sm font-black text-red-900 dark:text-red-300 uppercase tracking-widest mb-1">Error Loading History</h4>
            <p class="text-xs text-red-800/70 dark:text-red-400/60 font-medium leading-relaxed">{{ error }}</p>
          </div>
        </div>

        <!-- History List -->
        <div v-else>
          <div v-if="assignmentHistory.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800/50 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No history found</p>
          </div>

          <div v-else class="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-blue-500/50 before:via-gray-100 before:to-transparent dark:before:via-gray-800">
            <div
              v-for="history in assignmentHistory"
              :key="history.id"
              class="relative pl-12 group"
            >
              <!-- Timeline Node -->
              <div class="absolute left-[18px] top-1.5 w-[13px] h-[13px] rounded-full border-2 border-white dark:border-gray-900 bg-blue-600 shadow-lg shadow-blue-500/30 z-10 group-hover:scale-125 transition-transform"></div>

              <div class="bg-white dark:bg-gray-800/60 p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div class="space-y-1">
                    <div class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] mb-1">User Assignment</div>
                    <div class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      To: <span class="text-blue-600 dark:text-blue-400">{{ history.assignedTo?.name || 'Unknown' }}</span>
                    </div>
                    <div class="text-[11px] text-gray-400 dark:text-gray-500 font-bold">
                      By {{ history.assignedBy?.name || 'System' }}
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <div class="text-xs font-black text-gray-900 dark:text-white font-mono tracking-tighter">
                      {{ formatDate(history.assigned_at) }}
                    </div>
                    <div class="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1">
                      {{ formatTime(history.assigned_at) }}
                    </div>
                  </div>
                </div>

                <div v-if="history.notes" class="mt-4 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 relative group-hover:bg-blue-500/5 transition-colors">
                  <div class="absolute -top-2 left-4 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-700">Note</div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {{ history.notes }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tactical Footer -->
      <div class="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center">
        <button
          @click="$emit('close')"
          class="px-8 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'

interface Props {
  show: boolean
  task?: EnquiryTask | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { assignmentHistory, loading, error, fetchAssignmentHistory } = useTaskAssignment()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(() => props.show, async (newShow) => {
  if (newShow && props.task?.id) {
    await fetchAssignmentHistory(props.task.id)
  }
})

watch(() => props.task, async (newTask) => {
  if (props.show && newTask?.id) {
    await fetchAssignmentHistory(newTask.id)
  }
})
</script>
