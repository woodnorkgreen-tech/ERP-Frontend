<template>
  <div class="task-detail-view">
    <!-- Loading State -->
    <div v-if="loading.task" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading task details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Task</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="$router.push('/universal-tasks')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Tasks
        </button>
      </div>
    </div>

    <!-- Task Detail Content -->
    <div v-else-if="task" class="space-y-6">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <button
                @click="$router.push('/universal-tasks')"
                class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Back to tasks"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ task.title }}</h1>
            </div>
            <p v-if="task.description" class="text-gray-600 dark:text-gray-400 mt-2">
              {{ task.description }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="showEditDialog = true"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Edit
            </button>
            <button
              v-if="canDelete"
              @click="confirmDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Task Meta Info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <div class="mt-1">
              <span
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="getStatusBadgeClass(task.status)"
              >
                {{ getStatusLabel(task.status) }}
              </span>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</label>
            <div class="mt-1">
              <span
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="getPriorityBadgeClass(task.priority)"
              >
                {{ getPriorityLabel(task.priority) }}
              </span>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Assignee</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ task.assignedUser?.name || 'Unassigned' }}
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</label>
            <div class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
            </div>
          </div>
        </div>

        <!-- Progress Bar (if has subtasks) -->
        <div v-if="task.subtasks && task.subtasks.length > 0" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ task.completion_percentage || 0 }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${task.completion_percentage || 0}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.count !== undefined && tab.count > 0"
                class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Task Details -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Details</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Task Type</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.task_type || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.department?.name || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.creator?.name || 'Unknown' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(task.created_at) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDateTime(task.updated_at) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Time Tracking -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time Tracking</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Hours</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.estimated_hours || 0 }}h</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Hours</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.actual_hours || 0 }}h</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Variance</dt>
                    <dd
                      class="mt-1 text-sm font-semibold"
                      :class="getVarianceClass(task.estimated_hours, task.actual_hours)"
                    >
                      {{ calculateVariance(task.estimated_hours, task.actual_hours) }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="task.tags && task.tags.length > 0">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in task.tags"
                  :key="tag"
                  class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Subtasks Tab -->
          <div v-if="activeTab === 'subtasks'">
            <SubtaskTree
              :task-id="task.id"
              :editable="true"
              :show-progress="true"
              @subtask-updated="handleSubtaskUpdated"
            />
          </div>

          <!-- Issues Tab -->
          <div v-if="activeTab === 'issues'">
            <TaskIssuePanel :task-id="task.id" @issue-updated="handleIssueUpdated" />
          </div>

          <!-- Experience Logs Tab -->
          <div v-if="activeTab === 'logs'">
            <ExperienceLogPanel :task-id="task.id" @log-updated="handleLogUpdated" />
          </div>

          <!-- Comments Tab -->
          <div v-if="activeTab === 'comments'">
            <TaskCommentPanel :task-id="task.id" @comment-added="handleCommentAdded" />
          </div>

          <!-- Attachments Tab -->
          <div v-if="activeTab === 'attachments'">
            <TaskAttachmentPanel :task-id="task.id" @attachment-added="handleAttachmentAdded" />
          </div>

          <!-- Time Tracking Tab -->
          <div v-if="activeTab === 'time'">
            <TaskTimeTrackingPanel :task-id="task.id" @time-entry-added="handleTimeEntryAdded" />
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'">
            <TaskHistoryPanel :task-id="task.id" />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <TaskFormDialog
      v-if="showEditDialog"
      :task="task"
      @close="showEditDialog = false"
      @saved="handleTaskUpdated"
    />

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Task</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteDialog = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/taskStore'
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants'
import type { Task } from '../types'

// Components
import SubtaskTree from '../components/SubtaskTree.vue'
import TaskIssuePanel from '../components/TaskIssuePanel.vue'
import ExperienceLogPanel from '../components/ExperienceLogPanel.vue'
import TaskFormDialog from '../components/TaskFormDialog.vue'

// Placeholder components (will create these next)
import TaskCommentPanel from '../components/TaskCommentPanel.vue'
import TaskAttachmentPanel from '../components/TaskAttachmentPanel.vue'
import TaskTimeTrackingPanel from '../components/TaskTimeTrackingPanel.vue'
import TaskHistoryPanel from '../components/TaskHistoryPanel.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const { currentTask, loading, errors } = storeToRefs(taskStore)

const task = computed(() => currentTask.value)
const error = computed(() => errors.value.task)
const canDelete = computed(() => true) // TODO: Add permission check

const activeTab = ref('overview')
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const tabs = computed(() => [
  { id: 'overview', label: 'Overview', count: undefined },
  { id: 'subtasks', label: 'Subtasks', count: task.value?.subtasks?.length },
  { id: 'issues', label: 'Issues', count: task.value?.issues?.length },
  { id: 'logs', label: 'Experience Logs', count: task.value?.experienceLogs?.length },
  { id: 'comments', label: 'Comments', count: task.value?.comments?.length },
  { id: 'attachments', label: 'Attachments', count: task.value?.attachments?.length },
  { id: 'time', label: 'Time Tracking', count: undefined },
  { id: 'history', label: 'History', count: undefined }
])

// Load task on mount
onMounted(async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId && !isNaN(taskId)) {
    await taskStore.fetchTask(taskId)
  } else {
    router.push('/universal-tasks')
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    const taskId = parseInt(newId as string)
    if (taskId && !isNaN(taskId)) {
      await taskStore.fetchTask(taskId)
    }
  }
)

// Utility functions
const getStatusLabel = (status?: string | null) => {
  if (!status) return 'Unknown'
  const def = TASK_STATUSES[status as keyof typeof TASK_STATUSES]
  return def?.label || status || 'Unknown'
}

const getPriorityLabel = (priority?: string | null) => {
  if (!priority) return 'Unknown'
  const def = TASK_PRIORITIES[priority as keyof typeof TASK_PRIORITIES]
  return def?.label || priority || 'Unknown'
}

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getPriorityBadgeClass = (priority: string): string => {
  const classMap: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classMap[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

const calculateVariance = (estimated?: number, actual?: number) => {
  if (!estimated || !actual) return 'N/A'
  const variance = actual - estimated
  return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}h`
}

const getVarianceClass = (estimated?: number, actual?: number) => {
  if (!estimated || !actual) return 'text-gray-600 dark:text-gray-400'
  const variance = actual - estimated
  if (variance > 0) return 'text-red-600 dark:text-red-400'
  if (variance < 0) return 'text-green-600 dark:text-green-400'
  return 'text-gray-600 dark:text-gray-400'
}

// Event handlers
const handleTaskUpdated = async () => {
  showEditDialog.value = false
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const handleSubtaskUpdated = async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const handleIssueUpdated = async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const handleLogUpdated = async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const handleCommentAdded = async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const handleAttachmentAdded = async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const handleTimeEntryAdded = async () => {
  const taskId = parseInt(route.params.id as string)
  if (taskId) {
    await taskStore.fetchTask(taskId)
  }
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!task.value) return

  const success = await taskStore.deleteTask(task.value.id)
  showDeleteDialog.value = false

  if (success) {
    router.push('/universal-tasks')
  } else {
    alert('Failed to delete task')
  }
}
</script>

<style scoped>
.task-detail-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

.dark .task-detail-view {
  background-color: #111827;
}
</style>

