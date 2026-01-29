<template>
  <div class="task-content bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-sm p-4 sm:p-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ task.title }}
      </h4>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ getTaskDescription(task.type) }}
      </p>
    </div>

    <!-- Task Status -->
    <div class="mb-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>
    </div>

    <!-- Task Notes -->
    <div v-if="task.notes" class="mb-4">
      <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes:</h5>
      <p class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        {{ task.notes }}
      </p>
    </div>

    <!-- Task Actions -->
    <div class="flex space-x-3">
      <button
        v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
        @click="showSkipModal = true"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
      >
        Skip Task
      </button>

      <button
        v-if="['skipped', 'completed'].includes(task.status)"
        @click="$emit('update-status', 'pending')"
        class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
      </button>

      <button
        v-if="task.status === 'pending'"
        @click="$emit('update-status', 'in_progress')"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
      >
        Start Task
      </button>

      <button
        v-if="task.status === 'in_progress'"
        @click="$emit('update-status', 'completed')"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
      >
        Mark Complete
      </button>

      <button
        v-if="task.status !== 'completed' && task.status !== 'cancelled' && task.status !== 'skipped'"
        @click="$emit('update-status', 'cancelled')"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
      >
        Cancel Task
      </button>
    </div>

    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Skip Task</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Please provide a reason for skipping this task.</p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            placeholder="Reason for.skipping..."
        ></textarea>
        <div class="flex justify-end space-x-3">
            <button @click="showSkipModal = false" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

// Skip Task Logic
import { ref } from 'vue'
import api from '@/plugins/axios'

const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await api.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        emit('update-status', 'skipped')
        showSkipModal.value = false
        skipReason.value = ''
    } catch (err: any) {
        console.error('Skip task error:', err)
        alert(err.response?.data?.message || 'Failed to skip task')
    } finally {
        isSkipping.value = false
    }
}

const getTaskDescription = (type: string) => {
  const descriptions: Record<string, string> = {
    'site-survey': 'Conduct site survey for the enquiry',
    'design': 'Create design concepts and mockups',
    'materials': 'Specify and source materials for the project',
    'budget': 'Create budget for the project',
    'quote': 'Prepare final quote for the project',
    'quote_approval': 'Approve the prepared quote',
    'procurement': 'Manage procurement and inventory',
    'conversion': 'Convert enquiry to project',
    'production': 'Handle production activities',
    'logistics': 'Manage logistics and transportation',
    'setup': 'Set up event and execute',
    'handover': 'Hand over to client',
    'setdown': 'Set down and return equipment',
    'report': 'Archive and generate reports',
  }

  return descriptions[type] || 'Complete this task'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'skipped': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'skipped': 'Skipped',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}
</script>
