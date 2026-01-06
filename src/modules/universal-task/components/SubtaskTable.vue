<template>
  <div class="subtask-table-container">
    <!-- Header -->
    <div class="table-header">
      <h3 class="table-title">Subtasks</h3>
      <button
        v-if="editable"
        @click="handleAddSubtaskClick"
        class="btn-primary"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Subtask
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading subtasks...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="subtasks.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h4 class="empty-title">No subtasks yet</h4>
      <p class="empty-text">Break down this task into smaller, manageable subtasks.</p>
      <button
        v-if="editable"
        @click="handleAddSubtaskClick"
        class="btn-primary"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add First Subtask
      </button>
    </div>

    <!-- Subtask Table -->
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead class="table-head">
          <tr>
            <th class="th-cell">Title</th>
            <th class="th-cell">Status</th>
            <th class="th-cell">Priority</th>
            <th class="th-cell">Assigned To</th>
            <th class="th-cell">Due Date</th>
            <th class="th-cell">Est. Hours</th>
            <th class="th-cell">Progress</th>
            <th v-if="editable" class="th-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr 
            v-for="subtask in subtasks" 
            :key="subtask.id"
            class="tr-row"
          >
            <!-- Title -->
            <td class="td-cell">
              <div class="cell-content">
                <div class="task-info">
                  <div class="task-title">{{ subtask.title }}</div>
                  <div v-if="subtask.description" class="task-desc line-clamp-2">
                    {{ subtask.description }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Status -->
            <td class="td-cell whitespace-nowrap">
              <span class="badge" :class="getStatusClasses(subtask.status)">
                {{ TASK_STATUSES[subtask.status]?.label || subtask.status }}
              </span>
            </td>

            <!-- Priority -->
            <td class="td-cell whitespace-nowrap">
              <span class="badge" :class="getPriorityClasses(subtask.priority)">
                {{ TASK_PRIORITIES[subtask.priority]?.label || subtask.priority }}
              </span>
            </td>

            <!-- Assigned To -->
            <td class="td-cell whitespace-nowrap">
              <div v-if="subtask.assignedUser" class="user-cell">
                <div class="user-avatar">
                  {{ getInitials(subtask.assignedUser.name) }}
                </div>
                <span class="user-name">{{ subtask.assignedUser.name }}</span>
              </div>
              <span v-else class="text-unassigned">Unassigned</span>
            </td>

            <!-- Due Date -->
            <td class="td-cell whitespace-nowrap">
              <div v-if="subtask.due_date" class="date-cell">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span :class="isOverdue(subtask.due_date) ? 'text-danger' : 'text-default'">
                  {{ formatDate(subtask.due_date) }}
                </span>
              </div>
              <span v-else class="text-unassigned">No date</span>
            </td>

            <!-- Estimated Hours -->
            <td class="td-cell whitespace-nowrap">
              <div v-if="subtask.estimated_hours" class="hours-cell">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ subtask.estimated_hours }}h
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>

            <!-- Progress -->
            <td class="td-cell whitespace-nowrap">
              <div class="progress-cell">
                <div class="progress-track">
                  <div 
                    class="progress-bar"
                    :class="getProgressBarColor(subtask.completion_percentage)"
                    :style="{ width: `${subtask.completion_percentage}%` }"
                  ></div>
                </div>
                <span class="progress-text">
                  {{ Math.round(subtask.completion_percentage) }}%
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td v-if="editable" class="td-cell whitespace-nowrap text-right">
              <div class="action-buttons">
                <button
                  @click="toggleSubtaskCompletion(subtask)"
                  class="btn-icon"
                  :class="subtask.status === 'completed' ? 'btn-icon-orange' : 'btn-icon-green'"
                  :title="subtask.status === 'completed' ? 'Reopen subtask' : 'Mark as complete'"
                >
                  <svg v-if="subtask.status === 'completed'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>

                <button
                  @click="editSubtask(subtask)"
                  class="btn-icon btn-icon-blue"
                  title="Edit subtask"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(subtask)"
                  class="btn-icon btn-icon-red"
                  title="Delete subtask"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Progress Summary -->
    <div v-if="showProgress && subtasks.length > 0" class="progress-summary">
      <div class="summary-stats">
        <div class="summary-item">
          <span class="summary-label">Total:</span>
          <span class="summary-value">{{ totalCount }} subtasks</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Completed:</span>
          <span class="summary-value text-success">{{ completedCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Remaining:</span>
          <span class="summary-value text-warning">{{ remainingCount }}</span>
        </div>
      </div>
      <div class="summary-progress">
        <span class="summary-label">Overall Progress:</span>
        <div class="progress-track track-large">
          <div
            class="progress-bar"
            style="background-color: #3b82f6;"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <span class="progress-percentage">{{ progressPercentage }}%</span>
      </div>
    </div>

    <!-- Add Subtask Dialog -->
    <TaskFormDialog
      :visible="showAddDialog"
      :task="editingSubtask"
      :parent-task-id="editingSubtask ? undefined : props.taskId"
      @update:visible="showAddDialog = $event"
      @saved="handleSubtaskSaved"
      @cancelled="handleDialogCancelled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '../composables/useToast'
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants'
import type { Task } from '../types'

// Components
import TaskFormDialog from './TaskFormDialog.vue'

// Props
interface Props {
  taskId: number
  editable?: boolean
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  showProgress: true
})

// Composables
const toast = useToast()

// Reactive state
const showAddDialog = ref(false)
const editingSubtask = ref<Task | null>(null)
const subtasks = ref<Task[]>([])
const loading = ref(false)

// Computed
const totalCount = computed(() => subtasks.value.length)

const completedCount = computed(() =>
  subtasks.value.filter(subtask => subtask.status === 'completed').length
)

const remainingCount = computed(() => totalCount.value - completedCount.value)

const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// Methods
function handleAddSubtaskClick() {
  editingSubtask.value = null
  showAddDialog.value = true
}

function editSubtask(subtask: Task) {
  editingSubtask.value = subtask
  showAddDialog.value = true
}

async function confirmDelete(subtask: Task) {
  if (!confirm(`Are you sure you want to delete "${subtask.title}"?`)) {
    return
  }

  try {
    const { taskApi } = await import('../services/api')
    await taskApi.deleteTask(subtask.id)
    
    // Remove from local array
    subtasks.value = subtasks.value.filter(s => s.id !== subtask.id)
    
    toast.success('Subtask deleted successfully')
    emit('delete', subtask.id)
  } catch (error: any) {
    console.error('Error deleting subtask:', error)
    toast.error(error.message || 'Failed to delete subtask')
  }
}

async function toggleSubtaskCompletion(subtask: Task) {
  try {
    const { taskApi } = await import('../services/api')
    const newStatus = subtask.status === 'completed' ? 'pending' : 'completed'
    const response = await taskApi.updateTaskStatus(subtask.id, newStatus)
    
    if (response.success && response.data) {
      // Update local state
      const index = subtasks.value.findIndex(s => s.id === subtask.id)
      if (index !== -1) {
        subtasks.value[index] = response.data
      }
      toast.success(`Subtask marked as ${newStatus}`)
      emit('update', response.data)
    } else {
      toast.error(response.error?.message || 'Failed to update subtask status')
    }
  } catch (error: any) {
    console.error('Error updating subtask status:', error)
    toast.error(error.message || 'Failed to update subtask status')
  }
}


async function loadSubtasks() {
  loading.value = true
  try {
    const { taskApi } = await import('../services/api')
    const response = await taskApi.getTasks({
      parent_task_id: props.taskId
    })
    if (response.success && response.data) {
      subtasks.value = response.data
    } else {
      subtasks.value = []
      toast.error(response.error?.message || 'Failed to load subtasks')
    }
  } catch (error: any) {
    console.error('Error loading subtasks:', error)
    toast.error(error.message || 'Failed to load subtasks')
    subtasks.value = []
  } finally {
    loading.value = false
  }
}

function handleSubtaskSaved(savedSubtask: Task) {
  if (editingSubtask.value) {
    // Update existing
    const index = subtasks.value.findIndex(s => s.id === savedSubtask.id)
    if (index !== -1) {
      subtasks.value[index] = savedSubtask
    }
    toast.success('Subtask updated successfully')
  } else {
    // Add new
    const index = subtasks.value.findIndex(s => s.id === savedSubtask.id)
    if (index === -1) {
      subtasks.value.unshift(savedSubtask)
    }
    toast.success('Subtask added successfully')
    emit('add', savedSubtask)
  }
  
  handleDialogCancelled()
}

function handleDialogCancelled() {
  showAddDialog.value = false
  editingSubtask.value = null
}

function getStatusClasses(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'badge-pending',
    in_progress: 'badge-in-progress',
    blocked: 'badge-blocked',
    review: 'badge-review',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    overdue: 'badge-overdue'
  }
  return statusMap[status] || 'badge-default'
}

function getPriorityClasses(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
    urgent: 'badge-urgent'
  }
  return priorityMap[priority] || 'badge-default'
}

function getProgressBarColor(percentage: number): string {
  if (percentage === 100) return 'progress-success'
  if (percentage >= 75) return 'progress-primary'
  if (percentage >= 50) return 'progress-warning'
  if (percentage >= 25) return 'progress-orange'
  return 'progress-danger'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

// Emits
const emit = defineEmits<{
  update: [subtask: Task]
  delete: [subtaskId: number]
  add: [subtask: Task]
}>()

// Lifecycle
onMounted(() => {
  loadSubtasks()
})
</script>

<style scoped>
.subtask-table-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

.dark .table-title {
  color: #f1f5f9;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Loading & Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.dark .loading-state, .dark .empty-state {
  background: #1e293b;
  border-color: #334155;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.dark .loading-spinner {
  border-color: #334155;
  border-top-color: #60a5fa;
}

.loading-text, .empty-text {
  color: #64748b;
  font-size: 0.875rem;
}

.dark .loading-text, .dark .empty-text {
  color: #94a3b8;
}

.empty-icon {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.dark .empty-title {
  color: #f1f5f9;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .table-wrapper {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.table-head {
  background: #f8fafc;
}

.dark .table-head {
  background: #0f172a;
}

.th-cell {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.dark .th-cell {
  color: #94a3b8;
  border-bottom-color: #334155;
}

.tr-row {
  transition: background-color 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.dark .tr-row {
  border-bottom-color: #334155;
}

.tr-row:last-child {
  border-bottom: none;
}

.tr-row:hover {
  background: #f8fafc;
}

.dark .tr-row:hover {
  background: #253346;
}

.td-cell {
  padding: 1rem;
  font-size: 0.875rem;
  color: #0f172a;
}

.dark .td-cell {
  color: #f1f5f9;
}

/* Cell Content */
.task-title {
  font-weight: 500;
  color: #0f172a;
}

.dark .task-title {
  color: #f1f5f9;
}

.task-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.dark .task-desc {
  color: #94a3b8;
}

.badge {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Badges - Light & Dark */
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

.badge-low { background: #dcfce7; color: #166534; }
.dark .badge-low { background: #064e3b; color: #dcfce7; }

.badge-medium { background: #dbeafe; color: #1e40af; }
.dark .badge-medium { background: #1e3a8a; color: #dbeafe; }

.badge-high { background: #fed7aa; color: #9a3412; }
.dark .badge-high { background: #7c2d12; color: #fed7aa; }

.badge-urgent { background: #fee2e2; color: #991b1b; }
.dark .badge-urgent { background: #7f1d1d; color: #fee2e2; }

.badge-default { background: #f1f5f9; color: #475569; }
.dark .badge-default { background: #334155; color: #94a3b8; }

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.user-name {
  font-size: 0.875rem;
  color: #0f172a;
}

.dark .user-name {
  color: #f1f5f9;
}

.text-unassigned, .text-gray-400 {
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Date & Hours */
.date-cell, .hours-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #475569;
}

.dark .date-cell, .dark .hours-cell {
  color: #cbd5e1;
}

.text-danger { color: #dc2626; }
.dark .text-danger { color: #f87171; }

.text-default { color: #475569; }
.dark .text-default { color: #cbd5e1; }

/* Progress */
.progress-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 120px;
}

.progress-track {
  flex: 1;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.dark .progress-track {
  background: #334155;
}

.progress-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.progress-success { background: #22c55e; }
.progress-primary { background: #3b82f6; }
.progress-warning { background: #f59e0b; }
.progress-orange { background: #f97316; }
.progress-danger { background: #ef4444; }

.progress-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  width: 2.5rem;
  text-align: right;
}

.dark .progress-text {
  color: #94a3b8;
}

/* Actions */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.375rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-blue { color: #3b82f6; }
.btn-icon-blue:hover { background: #eff6ff; }
.dark .btn-icon-blue:hover { background: #1e3a8a; }

.btn-icon-red { color: #ef4444; }
.btn-icon-red:hover { background: #fef2f2; }
.dark .btn-icon-red:hover { background: #7f1d1d; }

.btn-icon-green { color: #16a34a; }
.btn-icon-green:hover { background: #dcfce7; }
.dark .btn-icon-green:hover { background: #064e3b; }

.btn-icon-orange { color: #f59e0b; }
.btn-icon-orange:hover { background: #fef3c7; }
.dark .btn-icon-orange:hover { background: #78350f; }


/* Summary */
.progress-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.dark .progress-summary {
  background: #1e293b;
  border-color: #334155;
}

.summary-stats {
  display: flex;
  gap: 1.5rem;
}

.summary-item {
  font-size: 0.875rem;
}

.summary-label {
  color: #64748b;
  font-weight: 500;
  margin-right: 0.5rem;
}

.dark .summary-label {
  color: #94a3b8;
}

.summary-value {
  color: #0f172a;
  font-weight: 600;
}

.dark .summary-value {
  color: #f1f5f9;
}

.text-success { color: #16a34a; }
.dark .text-success { color: #4ade80; }

.text-warning { color: #f97316; }
.dark .text-warning { color: #fb923c; }

.summary-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.track-large {
  width: 8rem;
  height: 0.625rem;
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

.dark .progress-percentage {
  color: #f1f5f9;
}

/* Utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.whitespace-nowrap {
  white-space: nowrap;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .progress-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .summary-progress {
    width: 100%;
  }

  .track-large {
    flex: 1;
  }
}
</style>
