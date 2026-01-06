<template>
  <div class="task-detail-container">
    <!-- Loading State -->
    <div v-if="loading.task" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading task...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">Unable to Load Task</h2>
      <p class="error-message">{{ error }}</p>
      <button @click="$router.push('/universal-tasks')" class="btn-back">
        Return to Tasks
      </button>
    </div>

    <!-- Main Content -->
    <div v-else-if="task" class="task-content">
      <!-- Header -->
      <div class="task-header">
        <div class="header-top">
          <button @click="$router.push('/universal-tasks')" class="btn-back-simple">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round"stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Tasks</span>
          </button>
          <div class="header-actions">
            <button @click="showEditDialog = true" class="btn-edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button v-if="canDelete" @click="confirmDelete" class="btn-delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div class="header-content">
          <div class="title-section">
            <span v-if="task.parent_task_id" class="subtask-badge">Subtask</span>
            <h1 class="task-title">{{ task.title }}</h1>
            <p v-if="task.description" class="task-description">{{ task.description }}</p>
          </div>

          <div class="status-badges">
            <span class="badge-status" :class="getStatusBadgeClass(task.status)">
              <span class="status-dot" :class="getStatusDotClass(task.status)"></span>
              {{ getStatusLabel(task.status) }}
            </span>
            <span class="badge-priority" :class="getPriorityBadgeClass(task.priority)">
              {{ getPriorityLabel(task.priority) }}
            </span>
            <span v-if="task.task_type" class="badge-type">
              {{ getTaskTypeLabel(task.task_type) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ task.completion_percentage || 0 }}%</div>
            <div class="stat-label">Progress</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-green">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ task.subtasks?.length || 0 }}</div>
            <div class="stat-label">Subtasks</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-orange">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ task.issues?.length || 0 }}</div>
            <div class="stat-label">Issues</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ task.attachments?.length || 0 }}</div>
            <div class="stat-label">Files</div>
          </div>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div class="info-label">Assigned To</div>
            <div class="info-value">{{ getAssigneeInfo(task).name || 'Unassigned' }}</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div class="info-label">Due Date</div>
            <div class="info-value">{{ task.due_date ? formatDate(task.due_date) : 'No date set' }}</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div class="info-label">Department</div>
            <div class="info-value">{{ task.department?.name || 'Not assigned' }}</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="info-label">Estimated</div>
            <div class="info-value">{{ task.estimated_hours || 0 }}h</div>
          </div>
        </div>
      </div>

      <!-- Blocked Alert -->
      <div v-if="task.status === 'blocked' && task.blocked_reason" class="alert-blocked">
        <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h4 class="alert-title">Task Blocked</h4>
          <p class="alert-message">{{ task.blocked_reason }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { 'tab-active': activeTab === tab.id }]"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined && tab.count > 0" class="tab-count">
              {{ tab.count }}
            </span>
          </button>
        </div>

        <div class="tab-content">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="overview-tab">
            <div class="overview-grid">
              <!-- Details Card -->
              <div class="detail-card">
                <h3 class="card-title">Task Details</h3>
                <dl class="detail-list">
                  <div class="detail-item">
                    <dt>Task Type</dt>
                    <dd>{{ task.task_type || 'N/A' }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Department</dt>
                    <dd>{{ task.department?.name || 'N/A' }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Created By</dt>
                    <dd>{{ task.creator?.name || 'Unknown' }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Created At</dt>
                    <dd>{{ formatDateTime(task.created_at) }}</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Last Updated</dt>
                    <dd>{{ formatDateTime(task.updated_at) }}</dd>
                  </div>
                  <div v-if="task.parent_task_id" class="detail-item">
                    <dt>Parent Task</dt>
                    <dd>
                      <router-link :to="`/universal-tasks/${task.parent_task_id}`" class="link">
                        {{ task.parentTask?.title || 'View Parent' }}
                      </router-link>
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Time Tracking Card -->
              <div class="detail-card">
                <h3 class="card-title">Time Tracking</h3>
                <dl class="detail-list">
                  <div class="detail-item">
                    <dt>Estimated Hours</dt>
                    <dd class="font-semibold">{{ task.estimated_hours || 0 }}h</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Actual Hours</dt>
                    <dd class="font-semibold">{{ task.actual_hours || 0 }}h</dd>
                  </div>
                  <div class="detail-item">
                    <dt>Variance</dt>
                    <dd :class="['font-semibold', getVarianceClass(task.estimated_hours, task.actual_hours)]">
                      {{ calculateVariance(task.estimated_hours, task.actual_hours) }}
                    </dd>
                  </div>
                  <div v-if="task.started_at" class="detail-item">
                    <dt>Started At</dt>
                    <dd>{{ formatDateTime(task.started_at) }}</dd>
                  </div>
                  <div v-if="task.completed_at" class="detail-item">
                    <dt>Completed At</dt>
                    <dd>{{ formatDateTime(task.completed_at) }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="task.tags && task.tags.length > 0" class="tags-section">
              <h3 class="card-title">Tags</h3>
              <div class="tags-list">
                <span v-for="tag in task.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Assignments -->
            <div v-if="task.assignments && task.assignments.length > 0" class="assignments-section">
              <h3 class="card-title">Team Members</h3>
              <div class="assignments-list">
                <div v-for="assignment in task.assignments" :key="assignment.id" class="assignment-item">
                  <div class="assignment-avatar">
                    {{ getUserInitials(assignment.user || assignment.assigned_user || assignment) }}
                  </div>
                  <div class="assignment-info">
                    <div class="assignment-name">
                      {{ getUserName(assignment.user || assignment.assigned_user || assignment) }}
                    </div>
                    <div class="assignment-meta">
                      Assigned by {{ getUserName(assignment.assignedBy || assignment.assigned_by || assignment.assigner || assignment) }}
                      <span v-if="assignment.is_primary" class="primary-badge">Primary</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Subtasks Tab -->
          <div v-if="activeTab === 'subtasks'">
            <SubtaskTable
              v-if="task.id"
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

          <!-- Comments Tab -->
          <div v-if="activeTab === 'comments'">
            <TaskCommentPanel :task-id="task.id" @comment-added="handleCommentAdded" />
          </div>

          <!-- Attachments Tab -->
          <div v-if="activeTab === 'attachments'">
            <TaskAttachmentPanel :task-id="task.id" @attachment-added="handleAttachmentAdded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <TaskFormDialog
      :visible="showEditDialog"
      :task="task"
      @update:visible="showEditDialog = $event"
      @saved="handleTaskUpdated"
    />

    <!-- Delete Confirmation -->
    <div v-if="showDeleteDialog" class="modal-overlay" @click.self="showDeleteDialog = false">
      <div class="modal-content">
        <div class="modal-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="modal-title">Delete Task</h3>
        <p class="modal-message">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteDialog = false" class="btn-cancel">
            Cancel
          </button>
          <button @click="handleDelete" class="btn-confirm-delete">
            Delete
          </button>
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
import { useAuth } from '../../../composables/useAuth'
import { TASK_STATUSES, TASK_PRIORITIES, TASK_TYPES } from '../constants'
import type { Task } from '../types'
import { formatDate, formatDateTime } from '../utils/dateUtils'

// Components
import SubtaskTable from '../components/SubtaskTable.vue'
import TaskIssuePanel from '../components/TaskIssuePanel.vue'
import TaskFormDialog from '../components/TaskFormDialog.vue'
import TaskCommentPanel from '../components/TaskCommentPanel.vue'
import TaskAttachmentPanel from '../components/TaskAttachmentPanel.vue'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

// Store
const taskStore = useTaskStore()
const { currentTask, loading, errors } = storeToRefs(taskStore)

const task = computed(() => currentTask.value)
const error = computed(() => errors.value.task || null)
const canDelete = computed(() => {
  return user.value && user.value.roles && (user.value.roles.includes('Admin') || user.value.roles.includes('Super Admin'))
})

const getAssigneeInfo = (task: any) => {
  if (task.assignments && task.assignments.length > 0) {
    const primary = task.assignments.find((a: any) => a.is_primary)
    const assignment = primary || task.assignments[0]
    const user = assignment.user
    if (user && user.name) {
      return {
        name: user.name,
        initials: user.name.charAt(0).toUpperCase()
      }
    }
  }
  
  if (task.assignedUser && task.assignedUser.name) {
    return {
      name: task.assignedUser.name,
      initials: task.assignedUser.name.charAt(0).toUpperCase()
    }
  }
  
  if (task.assigned_user && task.assigned_user.name) {
    return {
      name: task.assigned_user.name,
      initials: task.assigned_user.name.charAt(0).toUpperCase()
    }
  }
  
  return { name: '', initials: '' }
}

const getUserName = (user: any) => {
  if (!user) return 'Unknown User'
  if (typeof user === 'string' && user.trim() !== '') return user
  if (typeof user === 'number') return `User #${user}`
  if (user.name) return user.name
  if (user.email) return user.email
  if (user.full_name) return user.full_name
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim()
  }
  
  if (user.user && typeof user.user === 'object') {
    return getUserName(user.user)
  }
  
  if (user.assignedBy && typeof user.assignedBy === 'object') {
    return getUserName(user.assignedBy)
  }
  
  if (user.user_id || user.userId) {
    const id = user.user_id || user.userId
    return `User #${id}`
  }
  
  const userObj = (user as any).assigned_user || (user as any).assignee || (user as any).created_by || (user as any).assigner
  if (userObj && typeof userObj === 'object') {
    return getUserName(userObj)
  }
  
  return 'Unknown User'
}

const getUserInitials = (user: any) => {
  const name = getUserName(user)
  if (name === 'Unknown User' || name.startsWith('User #')) return 'U'
  
  const words = name.split(' ').filter((word: string) => word.length > 0)
  if (words.length === 0) return 'U'
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

const activeTab = ref('overview')
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const tabs = computed(() => [
  { id: 'overview', label: 'Overview', count: undefined },
  { id: 'subtasks', label: 'Subtasks', count: task.value?.subtasks?.length },
  { id: 'issues', label: 'Issues', count: task.value?.issues?.length },
  { id: 'comments', label: 'Comments', count: task.value?.comments?.length },
  { id: 'attachments', label: 'Attachments', count: task.value?.attachments?.length },
])

// Load task on mount
onMounted(async () => {
  await fetchTask()
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await fetchTask()
  }
})

// Watch for task changes to update page title
watch(() => task.value, (newTask) => {
  if (newTask?.title) {
    document.title = `${newTask.title} - Task Details`
  } else {
    document.title = 'Task Details'
  }
}, { immediate: true })

const fetchTask = async () => {
  const taskId = parseInt(route.params.id as string)
  if (isNaN(taskId)) {
    return
  }

  await taskStore.fetchTask(taskId)

  if (!task.value && !loading.value.task) {
    router.push('/universal-tasks')
  }
}

// Utility functions
const getStatusLabel = (status?: string | null) => {
  if (!status) return 'Not Set'
  const def = TASK_STATUSES[status as keyof typeof TASK_STATUSES]
  return def?.label || status
}

const getPriorityLabel = (priority?: string | null) => {
  if (!priority) return 'Not Set'
  const def = TASK_PRIORITIES[priority as keyof typeof TASK_PRIORITIES]
  return def?.label || priority
}

const getTaskTypeLabel = (type?: string | null) => {
  if (!type) return 'N/A'
  const def = TASK_TYPES[type as keyof typeof TASK_TYPES]
  return def?.label || type
}

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    completed: 'badge-completed',
    in_progress: 'badge-in-progress',
    pending: 'badge-pending',
    blocked: 'badge-blocked',
    overdue: 'badge-overdue',
    cancelled: 'badge-cancelled',
    review: 'badge-review'
  }
  return classMap[status] || 'badge-default'
}

const getStatusDotClass = (status: string): string => {
  const classMap: Record<string, string> = {
    completed: 'dot-completed',
    in_progress: 'dot-in-progress',
    pending: 'dot-pending',
    blocked: 'dot-blocked',
    overdue: 'dot-overdue',
    cancelled: 'dot-cancelled',
    review: 'dot-review'
  }
  return classMap[status] || 'dot-default'
}

const getPriorityBadgeClass = (priority: string): string => {
  const classMap: Record<string, string> = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
    urgent: 'badge-urgent'
  }
  return classMap[priority] || 'badge-default'
}

const calculateVariance = (estimated?: number, actual?: number) => {
  if (!estimated || !actual) return 'N/A'
  const variance = actual - estimated
  return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}h`
}

const getVarianceClass = (estimated?: number, actual?: number) => {
  if (!estimated || !actual) return 'text-gray-600'
  const variance = actual - estimated
  if (variance > 0) return 'text-red-600'
  if (variance < 0) return 'text-green-600'
  return 'text-gray-600'
}

// Event handlers
const handleTaskUpdated = async () => {
  showEditDialog.value = false
  await fetchTask()
}

const handleSubtaskUpdated = async () => {
  await fetchTask()
}

const handleIssueUpdated = async () => {
  await fetchTask()
}

const handleAttachmentAdded = async () => {
  await fetchTask()
}

const handleCommentAdded = async () => {
  await fetchTask()
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
    alert(`Delete failed: ${taskStore.errors.delete || 'Unknown error'}`)
  }
}
</script>

<style scoped>
/* Container */
.task-detail-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  color: #0f172a;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Mode Container */
.dark .task-detail-container {
  background: linear-gradient(to bottom, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
}

@media (max-width: 768px) {
  .task-detail-container {
    padding: 1rem;
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark .loading-spinner {
  border-color: #334155;
  border-top-color: #60a5fa;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.dark .loading-text {
  color: #94a3b8;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  max-width: 32rem;
  margin: 0 auto;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.dark .error-title {
  color: #f1f5f9;
}

.error-message {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.dark .error-message {
  color: #94a3b8;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Task Content */
.task-content {
  max-width: 90rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.task-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease;
}

.dark .task-header {
  background: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-back-simple {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .btn-back-simple {
  color: #94a3b8;
}

.btn-back-simple:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.dark .btn-back-simple:hover {
  background: #334155;
  color: #f1f5f9;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit, .btn-delete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.title-section {
  flex: 1;
}

.subtask-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.dark .subtask-badge {
  background: #1e3a8a;
  color: #dbeafe;
}

.task-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.dark .task-title {
  color: #f1f5f9;
}

.task-description {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
}

.dark .task-description {
  color: #94a3b8;
}

.status-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.badge-status, .badge-priority, .badge-type {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

/* Status Badge Colors - Dark Mode Support */
.badge-completed { background: #dcfce7; color: #166534; }
.dark .badge-completed { background: #064e3b; color: #dcfce7; }

.badge-in-progress { background: #dbeafe; color: #1e40af; }
.dark .badge-in-progress { background: #1e3a8a; color: #dbeafe; }

.badge-pending { background: #fef3c7; color: #92400e; }
.dark .badge-pending { background: #78350f; color: #fef3c7; }

.badge-blocked { background: #fee2e2; color: #991b1b; }
.dark .badge-blocked { background: #7f1d1d; color: #fee2e2; }

.badge-overdue { background: #fee2e2; color: #991b1b; }
.dark .badge-overdue { background: #7f1d1d; color: #fee2e2; }

.badge-cancelled { background: #f1f5f9; color: #475569; }
.dark .badge-cancelled { background: #334155; color: #e2e8f0; }

.badge-review { background: #f3e8ff; color: #6b21a8; }
.dark .badge-review { background: #581c87; color: #f3e8ff; }

.badge-default { background: #f1f5f9; color: #475569; }
.dark .badge-default { background: #334155; color: #94a3b8; }

/* Priority Badge Colors - Dark Mode Support */
.badge-low { background: #dcfce7; color: #166534; }
.dark .badge-low { background: #064e3b; color: #dcfce7; }

.badge-medium { background: #dbeafe; color: #1e40af; }
.dark .badge-medium { background: #1e3a8a; color: #dbeafe; }

.badge-high { background: #fed7aa; color: #9a3412; }
.dark .badge-high { background: #7c2d12; color: #fed7aa; }

.badge-urgent { background: #fee2e2; color: #991b1b; }
.dark .badge-urgent { background: #7f1d1d; color: #fee2e2; }

/* Type Badge */
.badge-type {
  background: #f1f5f9;
  color: #475569;
}
.dark .badge-type {
  background: #334155;
  color: #e2e8f0;
}

/* Status Dots */
.dot-completed { background: #22c55e; }
.dot-in-progress { background: #3b82f6; }
.dot-pending { background: #f59e0b; }
.dot-blocked { background: #ef4444; }
.dot-overdue { background: #ef4444; }
.dot-cancelled { background: #94a3b8; }
.dot-review { background: #a855f7; }
.dot-default { background: #94a3b8; }

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.dark .stat-card {
  background: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.stat-icon-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.stat-icon-orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.stat-icon-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.dark .stat-value {
  color: #f1f5f9;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.dark .stat-label {
  color: #94a3b8;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease;
}

.dark .info-card {
  background: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.info-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .info-icon {
  background: #334155;
  color: #cbd5e1;
}

.info-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.dark .info-label {
  color: #94a3b8;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.dark .info-value {
  color: #f1f5f9;
}

/* Alert */
.alert-blocked {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-left: 4px solid #ef4444;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
}

.dark .alert-blocked {
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  border-left-color: #ef4444;
}

.alert-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #dc2626;
  flex-shrink: 0;
}

.dark .alert-icon {
  color: #fca5a5;
}

.alert-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.25rem;
}

.dark .alert-title {
  color: #fecaca;
}

.alert-message {
  font-size: 0.875rem;
  color: #7f1d1d;
}

.dark .alert-message {
  color: #fee2e2;
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.dark .tabs-container {
  background: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.dark .tabs-header {
  border-bottom-color: #334155;
}

.tab-button {
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .tab-button {
  color: #94a3b8;
}

.tab-button:hover {
  color: #3b82f6;
  background: #f8fafc;
}

.dark .tab-button:hover {
  color: #60a5fa;
  background: #253346; /* Slightly lighter than card bg */
}

.tab-active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #f8fafc;
}

.dark .tab-active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
  background: #253346;
}

.tab-count {
  padding: 0.125rem 0.5rem;
  background: #e2e8f0;
  color: #475569;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.dark .tab-count {
  background: #334155;
  color: #cbd5e1;
}

.tab-active .tab-count {
  background: #dbeafe;
  color: #1e40af;
}

.dark .tab-active .tab-count {
  background: #1e3a8a;
  color: #dbeafe;
}

.tab-content {
  padding: 2rem;
}

/* Overview Tab */
.overview-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: background-color 0.3s ease;
}

.dark .detail-card {
  background: #253346; /* Lighter than main bg */
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .card-title {
  color: #f1f5f9;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark .detail-item {
  border-bottom-color: #334155;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-item dt {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.dark .detail-item dt {
  color: #94a3b8;
}

.detail-item dd {
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
  text-align: right;
}

.dark .detail-item dd {
  color: #f1f5f9;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.dark .link {
  color: #60a5fa;
}

.link:hover {
  text-decoration: underline;
}

/* Tags Section */
.tags-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.dark .tags-section {
  background: #253346;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: white;
  color: #3b82f6;
  border: 1px solid #dbeafe;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.dark .tag {
  background: #1e293b;
  color: #60a5fa;
  border-color: #1e3a8a;
}

/* Assignments Section */
.assignments-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.dark .assignments-section {
  background: #253346;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assignment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
}

.dark .assignment-item {
  background: #1e293b;
}

.assignment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.assignment-info {
  flex: 1;
}

.assignment-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.dark .assignment-name {
  color: #f1f5f9;
}

.assignment-meta {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.125rem;
}

.dark .assignment-meta {
  color: #94a3b8;
}

.primary-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.dark .primary-badge {
  background: #1e3a8a;
  color: #dbeafe;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .modal-content {
  background: #1e293b;
}

.modal-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.dark .modal-icon {
  background: #7f1d1d;
  color: #fca5a5;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin-bottom: 0.5rem;
}

.dark .modal-title {
  color: #f1f5f9;
}

.modal-message {
  color: #64748b;
  text-align: center;
  margin-bottom: 1.5rem;
}

.dark .modal-message {
  color: #94a3b8;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel, .btn-confirm-delete {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.dark .btn-cancel {
  background: #334155;
  color: #cbd5e1;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.dark .btn-cancel:hover {
  background: #475569;
}

.btn-confirm-delete {
  background: #ef4444;
  color: white;
}

.btn-confirm-delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Utilities */
.font-semibold {
  font-weight: 600;
}

.text-red-600 {
  color: #dc2626;
}
.dark .text-red-600 {
  color: #f87171;
}

.text-green-600 {
  color: #16a34a;
}
.dark .text-green-600 {
  color: #4ade80;
}

.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-600 {
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .task-header {
    padding: 1.5rem;
  }

  .task-title {
    font-size: 1.5rem;
  }

  .header-top {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .btn-edit, .btn-delete {
    flex: 1;
    justify-content: center;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .tab-content {
    padding: 1rem;
  }
}
</style>
