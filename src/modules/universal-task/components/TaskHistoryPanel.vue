<template>
  <div class="task-history-panel">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">History</h3>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Complete audit trail of all changes
      </div>
    </div>

    <!-- History List -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading history...</p>
    </div>

    <div v-else-if="history.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No history yet</h4>
      <p class="text-gray-600 dark:text-gray-400">Task history will appear here as changes are made.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in history"
        :key="item.id"
        class="relative pl-8 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0"
      >
        <div class="absolute left-0 top-0 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2"></div>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex items-start justify-between mb-2">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ getChangeDescription(item) }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                by {{ item.user?.name || 'Unknown' }} • {{ formatDateTime(item.created_at) }}
              </p>
            </div>
          </div>
          <div v-if="item.field_name && (item.old_value || item.new_value)" class="mt-2 text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ item.field_name }}:</span>
            <span v-if="item.old_value" class="text-red-600 dark:text-red-400 line-through ml-2">
              {{ item.old_value }}
            </span>
            <span v-if="item.new_value" class="text-green-600 dark:text-green-400 ml-2">
              → {{ item.new_value }}
            </span>
          </div>
          <p v-if="item.notes" class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
            {{ item.notes }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="hasMore" class="mt-6 text-center">
      <button
        @click="loadMore"
        :disabled="loading"
        class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import taskApi from '../services/api'

const props = defineProps<{
  taskId: number
}>()

const history = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(false)

const loadHistory = async (page: number = 1) => {
  loading.value = true
  try {
    const response = await taskApi.getTaskHistory(props.taskId)
    if (response.success && response.data) {
      const paginator = response.data
      if (Array.isArray(paginator.data)) {
        if (page === 1) {
          history.value = paginator.data
        } else {
          history.value.push(...paginator.data)
        }
        hasMore.value = paginator.current_page < paginator.last_page
        currentPage.value = paginator.current_page
      }
    }
  } catch (error) {
    console.error('Error loading history:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    loadHistory(currentPage.value + 1)
  }
}

const getChangeDescription = (item: any) => {
  if (item.field_name) {
    return `Changed ${item.field_name}`
  }
  if (item.action) {
    return item.action
  }
  return 'Task updated'
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  loadHistory(1)
})
</script>

<style scoped>
.task-history-panel .relative:last-child .border-l-2 {
  border-left: none;
}
</style>

