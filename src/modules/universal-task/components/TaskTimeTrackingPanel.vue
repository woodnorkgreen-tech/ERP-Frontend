<template>
  <div class="task-time-tracking-panel">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Time Tracking</h3>
      <button
        @click="showAddEntry = true"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Log Time
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ estimatedHours || 0 }}h</div>
      </div>
      <div class="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Actual</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalActualHours }}h</div>
      </div>
      <div class="p-4 rounded-lg" :class="varianceClass">
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Variance</div>
        <div class="text-2xl font-bold">{{ varianceText }}</div>
      </div>
    </div>

    <!-- Add Time Entry Form -->
    <div v-if="showAddEntry" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hours</label>
          <input
            v-model.number="newEntry.hours"
            type="number"
            step="0.25"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
          <input
            v-model="newEntry.date_worked"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
        <textarea
          v-model="newEntry.description"
          rows="2"
          placeholder="What did you work on?"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        ></textarea>
      </div>
      <div class="flex justify-end gap-2">
        <button
          @click="showAddEntry = false; resetNewEntry()"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="addTimeEntry"
          :disabled="!newEntry.hours || loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log Time
        </button>
      </div>
    </div>

    <!-- Time Entries List -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading time entries...</p>
    </div>

    <div v-else-if="timeEntries.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No time entries yet</h4>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Start tracking your time on this task.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="entry in timeEntries"
        :key="entry.id"
        class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                {{ entry.user?.name?.charAt(0) || 'U' }}
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ entry.user?.name || 'Unknown' }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(entry.date_worked) }}</p>
              </div>
            </div>
            <p v-if="entry.description" class="text-gray-700 dark:text-gray-300 mt-2">
              {{ entry.description }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ entry.hours }}h</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(entry.created_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import taskApi from '../services/api'
import type { TaskTimeEntry } from '../types'

const props = defineProps<{
  taskId: number
  estimatedHours?: number
}>()

const emit = defineEmits<{
  timeEntryAdded: []
}>()

const timeEntries = ref<TaskTimeEntry[]>([])
const loading = ref(false)
const showAddEntry = ref(false)

const newEntry = ref({
  hours: 0,
  date_worked: new Date().toISOString().split('T')[0],
  description: ''
})

const totalActualHours = computed(() => {
  return timeEntries.value.reduce((sum, entry) => sum + entry.hours, 0)
})

const varianceText = computed(() => {
  if (!props.estimatedHours) return 'N/A'
  const variance = totalActualHours.value - props.estimatedHours
  return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}h`
})

const varianceClass = computed(() => {
  if (!props.estimatedHours) return 'bg-gray-50 dark:bg-gray-700'
  const variance = totalActualHours.value - props.estimatedHours
  if (variance > 0) return 'bg-red-50 dark:bg-red-900'
  if (variance < 0) return 'bg-green-50 dark:bg-green-900'
  return 'bg-gray-50 dark:bg-gray-700'
})

const loadTimeEntries = async () => {
  loading.value = true
  try {
    const response = await taskApi.getTimeEntries(props.taskId)
    if (response.success && response.data) {
      timeEntries.value = response.data
    }
  } catch (error) {
    console.error('Error loading time entries:', error)
  } finally {
    loading.value = false
  }
}

const addTimeEntry = async () => {
  if (!newEntry.value.hours || newEntry.value.hours <= 0) return

  loading.value = true
  try {
    const response = await taskApi.createTimeEntry(props.taskId, {
      hours: newEntry.value.hours,
      date_worked: newEntry.value.date_worked,
      description: newEntry.value.description || undefined
    })
    if (response.success) {
      resetNewEntry()
      showAddEntry.value = false
      await loadTimeEntries()
      emit('timeEntryAdded')
    } else {
      alert('Failed to log time')
    }
  } catch (error) {
    console.error('Error adding time entry:', error)
    alert('Failed to log time')
  } finally {
    loading.value = false
  }
}

const resetNewEntry = () => {
  newEntry.value = {
    hours: 0,
    date_worked: new Date().toISOString().split('T')[0],
    description: ''
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadTimeEntries()
})
</script>

