<template>
  <div v-if="show && task" class="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[1600px] max-h-[95vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div class="flex items-center space-x-5">
           <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-clipboard-text-outline text-blue-600 text-2xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-3xl font-black text-gray-900 dark:text-white truncate max-w-[600px] tracking-tighter">
                {{ task.title }}
              </h2>
              <span
                :class="[
                  'text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm',
                  getStatusColor(task.status)
                ]"
              >
                {{ getStatusLabel(task.status) }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium flex items-center">
              <span class="capitalize">{{ task.type.replace('_', ' ') }} Task</span>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-blue-600 dark:text-blue-400 opacity-80 italic">{{ task.enquiry?.title || 'Standalone Project' }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-6 mr-8 border-r border-gray-200 dark:border-gray-700 pr-8 hidden md:flex">
          <div class="text-right">
            <p class="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-0.5">Assigned To</p>
            <p class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ task.assigned_to?.name || 'Unassigned' }}</p>
          </div>
          <div v-if="task.due_date" class="text-right">
            <p class="text-sm uppercase tracking-[0.2em] text-gray-400 font-bold mb-0.5">Deadline</p>
            <p 
              class="text-sm font-black"
              :class="isOverdue(task.due_date) ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ formatDate(task.due_date) }}
            </p>
          </div>
        </div>

        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <nav class="flex space-x-1" aria-label="Tabs">
          <button 
            v-for="tab in [{id: 'details', label: 'Task Execution', icon: 'mdi-play-box-outline'}, {id: 'history', label: 'Assignment Logs', icon: 'mdi-history'}]"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50',
              'whitespace-nowrap pt-4 pb-3 px-6 border-b-2 font-bold text-sm uppercase tracking-[0.2em] transition-all'
            ]"
          >
            <i class="mdi mr-2 text-base align-middle" :class="tab.icon"></i>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Modal Body -->
      <div class="flex-grow overflow-y-auto custom-scrollbar p-0 bg-gray-50/30 dark:bg-gray-900/40">
        
        <!-- Locked/Read-Only Banner -->
        <div v-if="readonly" class="bg-amber-500/10 border-b border-amber-500/20 px-8 py-3 animate-in slide-in-from-top duration-300">
          <div class="flex items-center text-amber-700 dark:text-amber-400">
            <i class="mdi mdi-lock-outline mr-2 text-lg"></i>
            <span class="text-xs font-bold uppercase tracking-wide">Read-Only Session:</span>
            <span class="text-xs ml-2 font-medium opacity-80">This task is currently locked. View-only mode is active.</span>
          </div>
        </div>

        <div class="p-8">
           <!-- Task Content via TaskRenderer -->
          <div class="task-content">
            <div v-show="activeTab === 'details'" class="animate-in fade-in duration-500">
              <TaskRenderer
                :task="task"
                :readonly="readonly"
                @update-status="handleStatusUpdate"
                @complete="handleComplete"
                @save-design-data="handleSaveDesignData"
              />
            </div>
            <div v-if="activeTab === 'history'" class="animate-in fade-in slide-in-from-bottom-2 duration-400">
              <TaskHistory :taskId="task.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import TaskRenderer from './tasks/TaskRenderer.vue'
import TaskHistory from './TaskHistory.vue'
import type { DesignAsset } from './tasks/design/types/design'

const activeTab = ref('details')

interface Props {
  show: boolean
  task: EnquiryTask | null
  readonly?: boolean
}

const props = defineProps<Props>()

// Debug: Log task data when it changes
watch(() => props.task, (newTask) => {
  console.log('[DEBUG] TaskModal received task:', {
    id: newTask?.id,
    title: newTask?.title,
    assigned_to: newTask?.assigned_to,
    assigned_by: newTask?.assigned_by
  })
}, { immediate: true })

const emit = defineEmits<{
  'close': []
  'update-status': [status: EnquiryTask['status']]
  'complete': []
  'save-design-data': [taskId: number, data: DesignAsset[]]
}>()

const closeModal = () => {
  emit('close')
}

// Handle Escape key press to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    closeModal()
  }
}

// Add/remove keyboard event listener
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleStatusUpdate = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const handleComplete = () => {
  emit('complete')
}

const handleSaveDesignData = (data: DesignAsset[]) => {
  if (props.task) {
    emit('save-design-data', props.task.id, data)
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

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
