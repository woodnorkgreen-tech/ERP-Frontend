<template>
  <div class="subtask-tree">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Subtasks</h3>
      <button
        v-if="editable"
        @click="showAddDialog = true"
        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Subtask
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading subtasks...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="subtasks.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 mb-2">No subtasks yet</h4>
      <p class="text-gray-600 mb-4">Break down this task into smaller, manageable subtasks.</p>
      <button
        v-if="editable"
        @click="showAddDialog = true"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center gap-2 mx-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add First Subtask
      </button>
    </div>

    <!-- Subtask Tree -->
    <div v-else class="space-y-2">
      <SubtaskTreeNode
        v-for="subtask in rootSubtasks"
        :key="subtask.id"
        :subtask="subtask"
        :all-subtasks="subtasks"
        :editable="editable"
        :show-progress="showProgress"
        @update="handleSubtaskUpdate"
        @delete="handleSubtaskDelete"
        @toggle="handleSubtaskToggle"
      />
    </div>

    <!-- Progress Summary -->
    <div v-if="showProgress && subtasks.length > 0" class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">Overall Progress</span>
        <span class="text-sm text-gray-600">{{ completedCount }}/{{ totalCount }} completed</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>{{ progressPercentage }}% complete</span>
        <span>{{ remainingCount }} remaining</span>
      </div>
    </div>

    <!-- Add Subtask Dialog -->
    <TaskFormDialog
      v-model:visible="showAddDialog"
      :task="null"
      @saved="handleSubtaskAdded"
      @cancelled="showAddDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '../composables/useToast'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/taskStore'
import type { Task } from '../types'

// Components
import TaskFormDialog from './TaskFormDialog.vue'
import SubtaskTreeNode from './SubtaskTreeNode.vue'

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
const taskStore = useTaskStore()

// Reactive state
const showAddDialog = ref(false)
const subtasks = ref<Task[]>([])
const loading = ref(false)

// Computed
const rootSubtasks = computed(() =>
  subtasks.value.filter(subtask => !subtask.parent_task_id)
)

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
async function loadSubtasks() {
  loading.value = true
  try {
    // Fetch subtasks for this parent task
    await taskStore.fetchTasks({
      filters: { parent_task_id: props.taskId }
    })
    // Get subtasks from store (assuming they are filtered)
    subtasks.value = taskStore.tasks.filter(task => task.parent_task_id === props.taskId)
  } catch (error: any) {
    toast.error('Failed to load subtasks')
  } finally {
    loading.value = false
  }
}

function handleSubtaskUpdate(updatedSubtask: Task) {
  const index = subtasks.value.findIndex(s => s.id === updatedSubtask.id)
  if (index !== -1) {
    subtasks.value[index] = updatedSubtask
  }
  emit('update', updatedSubtask)
}

function handleSubtaskDelete(subtaskId: number) {
  subtasks.value = subtasks.value.filter(s => s.id !== subtaskId)
  emit('delete', subtaskId)
}

function handleSubtaskToggle(subtaskId: number) {
  // Handle expand/collapse logic if needed
  emit('toggle', subtaskId)
}

async function handleSubtaskAdded(newSubtask: Task) {
  showAddDialog.value = false
  subtasks.value.push(newSubtask)
  emit('add', newSubtask)

  toast.success('Subtask added successfully')
}

// Emits
const emit = defineEmits<{
  update: [subtask: Task]
  delete: [subtaskId: number]
  add: [subtask: Task]
  toggle: [subtaskId: number]
}>()

// Lifecycle
onMounted(() => {
  loadSubtasks()
})
</script>