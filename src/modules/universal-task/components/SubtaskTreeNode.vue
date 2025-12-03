<template>
  <div class="subtask-tree-node">
    <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <!-- Expand/Collapse Toggle -->
      <button
        v-if="hasChildren"
        @click="toggleExpanded"
        class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"
      >
        <svg
          :class="expanded ? 'rotate-90' : ''"
          class="w-4 h-4 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div v-else class="w-6 h-6"></div>

      <!-- Status Indicator -->
      <div
        class="w-3 h-3 rounded-full flex-shrink-0"
        :class="getStatusColor(subtask.status)"
      ></div>

      <!-- Task Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h4 class="font-medium text-gray-900 truncate">{{ subtask.title }}</h4>
          <span
            v-if="subtask.priority !== 'medium'"
            :class="getPriorityTagClasses(subtask.priority)"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ TASK_PRIORITIES[subtask.priority].label }}
          </span>
        </div>
        <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
          <span v-if="subtask.assignedUser" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ subtask.assignedUser.name }}
          </span>
          <span v-if="subtask.due_date" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(subtask.due_date) }}
          </span>
          <span v-if="subtask.estimated_hours" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ subtask.estimated_hours }}h
          </span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress && hasChildren" class="w-24">
        <div class="text-xs text-gray-500 mb-1">
          {{ completedChildren }}/{{ totalChildren }}
        </div>
        <div class="w-full bg-gray-200 rounded-full h-1">
          <div
            class="bg-blue-600 h-1 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="editable" class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="editSubtask"
          class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          title="Edit subtask"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="addChildSubtask"
          class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
          title="Add child subtask"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          @click="confirmDelete"
          class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="Delete subtask"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Children -->
    <div v-if="expanded && hasChildren" class="ml-8 space-y-1">
      <SubtaskTreeNode
        v-for="child in childSubtasks"
        :key="child.id"
        :subtask="child"
        :all-subtasks="allSubtasks"
        :editable="editable"
        :show-progress="showProgress"
        @update="$emit('update', $event)"
        @delete="$emit('delete', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants'
import type { Task } from '../types'

// Components removed - using custom Tailwind implementations

// Props
interface Props {
  subtask: Task
  allSubtasks: Task[]
  editable: boolean
  showProgress: boolean
}

const props = defineProps<Props>()

// Composables
const toast = useToast()

// Reactive state
const expanded = ref(true)

// Computed
const hasChildren = computed(() =>
  props.allSubtasks.some(task => task.parent_task_id === props.subtask.id)
)

const childSubtasks = computed(() =>
  props.allSubtasks.filter(task => task.parent_task_id === props.subtask.id)
)

const totalChildren = computed(() => childSubtasks.value.length)

const completedChildren = computed(() =>
  childSubtasks.value.filter(child => child.status === 'completed').length
)

const progressPercentage = computed(() => {
  if (totalChildren.value === 0) return 0
  return Math.round((completedChildren.value / totalChildren.value) * 100)
})

// Methods
function toggleExpanded() {
  expanded.value = !expanded.value
  emit('toggle', props.subtask.id)
}

function getStatusColor(status: string) {
  return TASK_STATUSES[status as keyof typeof TASK_STATUSES]?.color || 'gray'
}

function getPrioritySeverity(priority: string) {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    urgent: 'danger'
  }
  return severityMap[priority] || 'info'
}

function getPriorityTagClasses(priority: string): string {
  const classMap: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classMap[priority] || 'bg-gray-100 text-gray-800'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function editSubtask() {
  // Emit edit event to parent
  emit('edit', props.subtask)
}

function addChildSubtask() {
  // Emit add child event to parent
  emit('add-child', props.subtask)
}

function confirmDelete() {
  if (confirm(`Are you sure you want to delete "${props.subtask.title}"?`)) {
    emit('delete', props.subtask.id)
    toast.success('Subtask deleted successfully')
  }
}

// Emits
const emit = defineEmits<{
  update: [subtask: Task]
  delete: [subtaskId: number]
  toggle: [subtaskId: number]
  edit: [subtask: Task]
  'add-child': [parentSubtask: Task]
}>()
</script>

<style scoped>
.subtask-tree-node:hover .opacity-0 {
  opacity: 1;
}
</style>