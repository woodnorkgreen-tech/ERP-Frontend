<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header (Red Theme for Warning) -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-red-50/30 dark:from-gray-900 dark:to-red-900/10">
        <div class="flex items-center space-x-4">
          <div class="p-2.5 bg-red-500/10 rounded-xl shadow-inner border border-red-500/20">
            <i class="mdi mdi-lock-alert text-red-600 dark:text-red-400 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Access Locked</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Task occupancy restricted</p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 overflow-y-auto custom-scrollbar flex-grow">
        <div class="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100/50 dark:border-red-900/30 flex items-start space-x-4 mb-8">
          <div class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">!</div>
          <p class="text-xs text-red-700/80 dark:text-red-300 leading-relaxed font-medium">
            This task is currently being modified by another team member. Concurrent edits are disabled to prevent data collisions.
          </p>
        </div>

        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50">
            <div class="mb-4">
              <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 block">Active Task</span>
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ task.title }}</p>
            </div>
            
            <div class="flex justify-between items-center py-4 border-t border-gray-100 dark:border-gray-800">
               <div>
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 block">Status</span>
                <span :class="statusClass(task.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {{ task.status ? task.status.replace('_', ' ') : 'Pending' }}
                </span>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 block">Department</span>
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ task.department?.name || 'Central Operations' }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
              <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 block">Currently Assigned To</span>
              <div class="flex items-center gap-4">
                <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">
                  {{ getInitials(task.locked_by_user?.name || 'Unknown') }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ task.locked_by_user?.name || 'Unknown Agent' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate opacity-70">{{ task.locked_by_user?.email || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center">
        <button
          type="button"
          class="px-10 py-2.5 bg-gray-900 dark:bg-gray-800 hover:bg-black dark:hover:bg-gray-700 text-white rounded-full text-sm font-bold shadow-lg transition-all active:scale-95"
          @click="closeModal"
        >
          Acknowledged
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  task: any
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    review: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  }
  return map[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>
