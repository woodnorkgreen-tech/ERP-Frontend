<template>
  <div class="mt-4">
    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Assignment History
    </h3>
    
    <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
    </div>
    
    <div v-else-if="error" class="text-sm text-red-500 bg-red-50 p-3 rounded">
        {{ error }}
    </div>
    
    <div v-else-if="history.length === 0" class="text-sm text-gray-500 italic p-3 bg-gray-50 rounded">
        No assignment history recorded.
    </div>
    
    <div v-else class="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6">
      <div v-for="(item, index) in history" :key="item.id" class="relative group">
        <!-- Timeline Dot -->
        <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
             :class="getDotColor(item)"></div>
             
        <div class="flex flex-col gap-1">
           <!-- Header -->
           <div class="flex items-center text-sm">
                <span class="font-medium text-gray-900 dark:text-white mr-2">
                    {{ getActionLabel(item) }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(item.assigned_at) }}
                </span>
           </div>
           
           <!-- Assignee Info -->
           <div class="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
               <span v-if="item.action === 'assigned' || item.action === 'reassigned'">
                   To <span class="font-semibold text-gray-800 dark:text-gray-200">{{ item.assigned_to?.name || 'Unknown' }}</span>
               </span>
               <span v-if="item.assigned_by" class="text-gray-400 text-[10px]">
                   by {{ item.assigned_by.name }}
               </span>
           </div>
           
           <!-- Reason / Notes -->
           <div v-if="item.notes" class="mt-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-700 italic">
             {{ item.notes }}
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'

const props = defineProps<{ taskId: number }>()

interface HistoryItem {
    id: number
    enquiry_task_id: number
    assigned_to: { id: number, name: string } | null
    assigned_by: { id: number, name: string } | null
    assigned_at: string
    notes: string | null
    // Computed helper
    action?: 'assigned' | 'released' | 'reassigned'
}

const history = ref<HistoryItem[]>([])
const loading = ref(false)
const error = ref('')

const fetchHistory = async () => {
   loading.value = true
   try {
      const response = await api.get(`/api/projects/enquiry-tasks/${props.taskId}/assignment-history`)
      history.value = response.data.data.map((item: any) => {
          // Infer action from data
          let action = 'assigned'
          if (!item.assigned_to) action = 'released'
          if (item.notes && item.notes.includes('Reassigned')) action = 'reassigned'
          // Basic heuristic, backend might explicitly send action or we infer
          return { ...item, action }
      })
   } catch (e: any) {
      console.error(e)
      error.value = 'Failed to load history'
   } finally {
      loading.value = false
   }
}

onMounted(() => {
    fetchHistory()
})

const getDotColor = (item: HistoryItem) => {
    if (item.action === 'released') return 'bg-red-500' // Red for stop/release
    if (item.action === 'reassigned') return 'bg-orange-500' // Orange for change
    return 'bg-blue-500' // Blue for assigned
}

const getActionLabel = (item: HistoryItem) => {
    if (item.action === 'released') return 'Task Released'
    if (item.action === 'reassigned') return 'Task Reassigned'
    return 'Task Assigned'
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
}
</script>
