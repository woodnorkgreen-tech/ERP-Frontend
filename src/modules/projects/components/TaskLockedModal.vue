<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col relative z-20 border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
      
      <!-- Premium Header (Red Theme for Warning) -->
      <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-white to-red-50/10 dark:from-slate-950 dark:to-red-950/10">
        <div class="flex items-center gap-6">
          <div class="p-4 bg-red-500/10 rounded-2xl shadow-inner border border-red-500/20">
            <i class="mdi mdi-lock-alert text-red-600 dark:text-red-400 text-3xl animate-pulse"></i>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">Sector Locked</h3>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Concurrency Restriction</p>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-10 overflow-y-auto custom-scrollbar flex-grow bg-slate-50/30 dark:bg-slate-900/10">
        <div class="bg-red-500/5 p-6 rounded-[2rem] border border-red-500/20 flex items-start gap-4 mb-10">
          <div class="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-red-500/30 ring-2 ring-white dark:ring-slate-900">!</div>
          <p class="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed font-bold uppercase tracking-wide">
            This sector is currently under modification. Concurrent access is restricted to ensure data integrity and prevent collision signatures.
          </p>
        </div>

        <div class="space-y-8">
          <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <!-- Glow -->
            <div class="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 bg-blue-500 opacity-5"></div>

            <div class="mb-8">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block">Active Target</span>
              <p class="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{{ task.title }}</p>
            </div>
            
            <div class="flex justify-between items-center py-6 border-y border-slate-100 dark:border-slate-800">
               <div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block">Status</span>
                <span :class="statusClass(task.status)" class="px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.15em] border">
                  {{ task.status ? task.status.replace('_', ' ') : 'Pending' }}
                </span>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block">Sector</span>
                <p class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ task.department?.name || 'CENTRAL OPS' }}</p>
              </div>
            </div>

            <div class="pt-8">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 block">Authorized Occupant</span>
              <div class="flex items-center gap-5">
                <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 flex items-center justify-center text-white dark:text-slate-950 font-black text-sm shadow-xl dark:shadow-white/10 ring-2 ring-slate-100 dark:ring-slate-800">
                  {{ getInitials(task.locked_by_user?.name || 'Unknown') }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ task.locked_by_user?.name || 'SYSTEM AGENT' }}</p>
                  <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">{{ task.locked_by_user?.email || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="px-10 py-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center">
        <button
          type="button"
          class="h-12 px-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl dark:shadow-white/5 transition-all active:scale-95 flex items-center gap-2"
          @click="closeModal"
        >
          <i class="mdi mdi-shield-check text-lg"></i>
          Acknowledge & Exit
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
