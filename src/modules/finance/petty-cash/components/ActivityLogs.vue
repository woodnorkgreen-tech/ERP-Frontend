<template>
  <div class="activity-logs">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Activity Logs</h2>
      <button 
        @click="fetchLogs" 
        class="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
        :disabled="store?.loading?.activityLogs"
      >
        <span v-if="store?.loading?.activityLogs" class="animate-spin">🔄</span>
        <span>Refresh Logs</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Action Type</label>
        <select v-model="filters.action" class="w-full rounded-lg border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <option value="">All Actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="voided">Voided</option>
          <option value="deleted">Deleted</option>
          <option value="archived">Archived</option>
          <option value="recalculated">Recalculated</option>
          <option value="import">Import</option>
        </select>
      </div>
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-400 mb-1">Transaction Type</label>
        <select v-model="filters.transaction_type" class="w-full rounded-lg border-gray-300 dark:bg-slate-900 dark:border-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <option value="">All Types</option>
          <option value="top_up">Top-Up</option>
          <option value="disbursement">Disbursement</option>
          <option value="group">Group</option>
        </select>
      </div>
    </div>

    <!-- Logs Table -->
    <div v-if="store?.loading?.activityLogs" class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-12 h-12 bg-blue-200 dark:bg-blue-900/40 rounded-full mb-4"></div>
        <div class="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div class="h-3 w-32 bg-gray-100 dark:bg-slate-800 rounded"></div>
      </div>
    </div>

    <div v-else-if="!store?.activityLogs || store?.activityLogs?.length === 0" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-20 text-center">
      <div class="text-5xl mb-4">📜</div>
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white">No logs found</h3>
      <p class="text-gray-500 dark:text-slate-400 mt-2">No activity has been recorded for the selected criteria.</p>
    </div>

    <div v-else class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-900/50 uppercase text-[11px] font-bold text-gray-500 dark:text-slate-400 tracking-wider">
            <tr>
              <th class="px-6 py-3 text-left">User</th>
              <th class="px-6 py-3 text-left">Action</th>
              <th class="px-6 py-3 text-left">Type</th>
              <th class="px-6 py-3 text-left">Description</th>
              <th class="px-6 py-3 text-left">Timestamp</th>
              <th class="px-6 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-slate-700/50 text-sm">
            <tr v-for="log in (store?.activityLogs || [])" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center font-medium text-gray-900 dark:text-white">
                  {{ log.user?.name || 'System' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap uppercase">
                <span :class="getActionBadge(log.action)" class="px-2.5 py-1 rounded-full text-[10px] font-bold">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-slate-400">
                {{ formatType(log.transaction_type) }}
              </td>
              <td class="px-6 py-4 text-gray-700 dark:text-slate-300 max-w-xs truncate">
                {{ log.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-slate-400">
                {{ formatDate(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  v-if="log.changes"
                  @click="viewDetails(log)" 
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-xs"
                >
                  View Changes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="store?.pagination?.activityLogs" class="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex justify-between items-center border-t border-gray-100 dark:border-slate-700">
        <span class="text-sm text-gray-600 dark:text-slate-400">
          Showing <span class="font-medium text-gray-900 dark:text-white">{{ store?.pagination?.activityLogs?.from || 0 }}</span> to <span class="font-medium text-gray-900 dark:text-white">{{ store?.pagination?.activityLogs?.to || 0 }}</span> of <span class="font-medium text-gray-900 dark:text-white">{{ store?.pagination?.activityLogs?.total || 0 }}</span> entries
        </span>
        <div class="flex space-x-2">
          <button 
            @click="changePage(store?.pagination?.activityLogs?.current_page - 1)"
            :disabled="!store?.pagination?.activityLogs || store.pagination.activityLogs.current_page === 1"
            class="px-4 py-1.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button 
            @click="changePage(store?.pagination?.activityLogs?.current_page + 1)"
            :disabled="!store?.pagination?.activityLogs || store.pagination.activityLogs.current_page === store.pagination.activityLogs.last_page"
            class="px-4 py-1.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedLog" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-100 dark:border-slate-700">
        <div class="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Activity Details</h3>
          <button @click="selectedLog = null" class="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-400 text-xl">✕</button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              <span class="block text-gray-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">User</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ selectedLog.user?.name || 'System' }}</span>
            </div>
            <div class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
              <span class="block text-gray-500 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Action</span>
              <span class="font-medium text-gray-900 dark:text-white uppercase">{{ selectedLog.action }}</span>
            </div>
          </div>
          <p class="text-gray-700 dark:text-slate-300 italic border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg mb-6">
            {{ selectedLog.description }}
          </p>
          <h4 class="text-xs uppercase font-bold text-gray-500 dark:text-slate-500 tracking-wider mb-3">Payload / Changes</h4>
          <pre class="bg-gray-900 text-green-400 p-6 rounded-xl text-xs overflow-x-auto leading-relaxed shadow-inner"><code>{{ JSON.stringify(selectedLog.changes, null, 2) }}</code></pre>
        </div>
        <div class="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
          <button @click="selectedLog = null" class="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 font-medium transition-colors">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePettyCashStore } from '../stores/pettyCashStore'

const store = usePettyCashStore()
const filters = ref({
  action: '',
  transaction_type: '',
  page: 1
})

const selectedLog = ref<any>(null)

const fetchLogs = async () => {
  await store.fetchActivityLogs(filters.value)
}

const changePage = (page: number) => {
  filters.value.page = page
  fetchLogs()
}

const viewDetails = (log: any) => {
  selectedLog.value = log
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatType = (type: string) => {
  if (!type) return '-'
  return type.replace('_', ' ').toUpperCase()
}

const getActionBadge = (action: string) => {
  const map: Record<string, string> = {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-blue-100 text-blue-700',
    voided: 'bg-orange-100 text-orange-700',
    deleted: 'bg-red-100 text-red-700',
    archived: 'bg-gray-100 text-gray-700',
    recalculated: 'bg-indigo-100 text-indigo-700',
    import: 'bg-purple-100 text-purple-700'
  }
  return map[action] || 'bg-gray-100 text-gray-600'
}

watch(filters, () => {
  fetchLogs()
}, { deep: true })

onMounted(() => {
  fetchLogs()
})
</script>

<script lang="ts">
export default {
  name: 'ActivityLogs'
}
</script>

<style scoped>
pre {
  font-family: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace;
}
</style>
