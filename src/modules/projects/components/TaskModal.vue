<template>
    <div v-if="show && task" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-2 mx-auto p-5 border w-[95%] max-w-[1600px] shadow-lg rounded-md bg-white dark:bg-gray-800 max-h-[95vh] overflow-y-auto" @click.stop>
        <div class="mt-2">
  <!-- Compact Task Header -->
  <div class="flex items-center justify-between py-2">
    <!-- Left: Task title + meta -->
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[250px]">
          {{ task.title }}
        </h2>
        <span
          :class="[
            'text-xs font-medium px-2 py-0.5 rounded-full',
            getStatusColor(task.status)
          ]"
        >
          {{ getStatusLabel(task.status) }}
        </span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
        {{ task.type }} • {{ task.enquiry?.title || 'No Enquiry' }}
      </p>
    </div>

    <!-- Right: Meta Info -->
    <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
      <div>
        <span class="text-gray-400">Assigned to:</span>
        <span class="ml-1">{{ task.assigned_to?.name || 'Unassigned' }}</span>
      </div>
      <div v-if="task.assigned_by">
        <span class="text-gray-400">By:</span>
        <span class="ml-1">{{ task.assigned_by.name }}</span>
      </div>
      <div v-if="task.due_date">
        <span class="text-gray-400">Due:</span>
        <span
          :class="isOverdue(task.due_date)
            ? 'text-red-600 dark:text-red-400 font-medium'
            : 'text-gray-700 dark:text-gray-200'"
          class="ml-1"
        >
          {{ formatDate(task.due_date) }}
        </span>
      </div>
      <button
        @click="closeModal"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Tabs -->
  <div class="border-b border-gray-200 dark:border-gray-700 -mx-5 px-5 bg-gray-50/50 dark:bg-gray-800/50 mb-4">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
      <button 
        @click="activeTab = 'details'"
        :class="[
          activeTab === 'details'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
          'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm'
        ]"
      >
        Task Details
      </button>
      <button 
        @click="activeTab = 'history'"
        :class="[
          activeTab === 'history'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
          'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm'
        ]"
      >
        Assignment History
      </button>
    </nav>
  </div>

        <!-- Read-Only Banner -->
        <div v-if="readonly" class="mb-4 bg-amber-50 border-l-4 border-amber-500 p-4 dark:bg-amber-900/20 dark:border-amber-500">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-amber-700 dark:text-amber-200">
                <span class="font-bold">Read Only:</span> This task is currently locked. You can view details but cannot make changes.
              </p>
            </div>
          </div>
        </div>

        <!-- Task Content via TaskRenderer -->
        <div class="task-content">
          <div v-show="activeTab === 'details'">
            <TaskRenderer
              :task="task"
              :readonly="readonly"
              @update-status="handleStatusUpdate"
              @complete="handleComplete"
              @save-design-data="handleSaveDesignData"
            />
          </div>
          <div v-if="activeTab === 'history'">
            <TaskHistory :taskId="task.id" />
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
  'save-design-data': [taskId: number, data: any]
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
