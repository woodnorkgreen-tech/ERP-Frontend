<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center py-4 text-gray-500">
      Loading history...
    </div>

    <div v-else-if="logs.length === 0" class="text-center py-8 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <p>No activity recorded yet.</p>
    </div>

    <div v-else class="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
      <div v-for="log in logs" :key="log.id" class="mb-10 ml-6">
        <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <svg class="w-3 h-3 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
        </span>
        <div class="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div class="justify-between items-center mb-3 sm:flex">
            <time class="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400 sm:order-last sm:mb-0">{{ formatDate(log.created_at) }}</time>
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              <span class="font-black text-slate-900 dark:text-white">{{ log.user?.name || 'System' }}</span>
              <span class="mx-1 text-gray-500 font-normal">{{ getActionText(log.action) }}</span>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-black uppercase tracking-wider text-slate-500 border border-slate-200 dark:border-slate-600">
                {{ log.loggable_type.split('\\').pop() }}
              </span>
            </div>
          </div>
          
          <div v-if="log.action === 'updated' && log.changed_data" class="space-y-3">
            <div v-for="(value, key) in log.changed_data" :key="key" class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
               <div class="flex items-center justify-between mb-2">
                 <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ formatKey(key) }}</span>
                 <button 
                  v-if="isObject(value)"
                  @click="toggleExpand(log.id + key)"
                  class="text-[10px] font-bold text-blue-500 hover:underline"
                 >
                   {{ expandedLogs[log.id + key] ? 'Hide Raw' : 'View Raw' }}
                 </button>
               </div>

                <!-- Detailed Diff View -->
                <div v-if="getDetailedChanges(key, log.original_data?.[key], value)" class="space-y-1">
                  <!-- Case: Flat Object (like Totals) -->
                  <template v-if="Array.isArray(getDetailedChanges(key, log.original_data?.[key], value))">
                    <div v-for="diff in (getDetailedChanges(key, log.original_data?.[key], value) as any[])" :key="diff.key" class="grid grid-cols-2 gap-4 text-xs">
                       <span class="font-bold text-slate-600 dark:text-slate-400">{{ formatKey(diff.key) }}:</span>
                       <div class="flex flex-wrap items-center gap-1">
                         <span class="text-red-500 line-through opacity-60">{{ formatValue(diff.old) }}</span>
                         <i class="mdi mdi-arrow-right text-gray-400"></i>
                         <span class="text-emerald-500 font-bold">{{ formatValue(diff.new) }}</span>
                       </div>
                    </div>
                  </template>
                  <!-- Case: Summary string (like Materials) -->
                  <template v-else>
                    <p class="text-xs text-slate-600 dark:text-slate-400 italic">
                      {{ getDetailedChanges(key, log.original_data?.[key], value) }}
                    </p>
                  </template>
                </div>

               <!-- Default Simple View -->
               <div v-else class="flex flex-wrap items-center gap-2 text-xs">
                 <span class="text-red-500 line-through opacity-60" v-if="log.original_data && log.original_data[key] !== undefined">
                  {{ formatValue(log.original_data[key]) }}
                 </span>
                 <i v-if="log.original_data && log.original_data[key] !== undefined" class="mdi mdi-arrow-right text-gray-400"></i>
                 <span class="text-emerald-500 font-bold">{{ formatValue(value) }}</span>
               </div>

               <!-- Raw JSON fallback -->
               <div v-if="expandedLogs[log.id + key]" class="mt-2 p-3 bg-slate-900 rounded-lg overflow-x-auto">
                 <pre class="text-[10px] text-emerald-400 font-mono">{{ JSON.stringify(value, null, 2) }}</pre>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from '@/plugins/axios'

interface ActionLog {
  id: number
  user_id: number
  user?: { name: string, email: string }
  action: string
  loggable_type: string
  loggable_id: number
  original_data: Record<string, any>
  changed_data: Record<string, any>
  created_at: string
}

const props = defineProps<{
  loggableType: string
  loggableId: number
}>()

const logs = ref<ActionLog[]>([])
const loading = ref(true)
const expandedLogs = ref<Record<string, boolean>>({})

const toggleExpand = (id: string) => {
  expandedLogs.value[id] = !expandedLogs.value[id]
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/logs/${props.loggableType}/${props.loggableId}`)
    logs.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch logs:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})

watch(() => props.loggableId, () => {
  fetchLogs()
})

/**
 * Simple "time ago" helper using native JS
 */
const timeAgo = (date: string | Date) => {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) return interval + "y ago"
  
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) return interval + "mo ago"
  
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) return interval + "d ago"
  
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) return interval + "h ago"
  
  interval = Math.floor(seconds / 60)
  if (interval >= 1) return interval + "m ago"
  
  return "just now"
}

const formatDate = (date: string) => {
  return timeAgo(date)
}

const getActionText = (action: string) => {
  switch (action) {
    case 'created': return 'created this record'
    case 'updated': return 'made changes to'
    case 'deleted': return 'removed this record'
    default: return action
  }
}

const formatKey = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const isObject = (val: any) => val !== null && typeof val === 'object'

const getDetailedChanges = (key: string, oldValue: any, newValue: any): string | any[] | null => {
  if (!isObject(oldValue) || !isObject(newValue)) return null

  const changes: { key: string; old: any; new: any }[] = []
  
  // If it's the 'totals' object, we can show flat key changes
  if (key === 'totals') {
    const allSubKeys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)])
    allSubKeys.forEach(subKey => {
      if (oldValue[subKey] !== newValue[subKey]) {
        changes.push({
          key: subKey,
          old: oldValue[subKey],
          new: newValue[subKey]
        })
      }
    })
    return changes.length > 0 ? changes : null
  }
  
  // If it's materials, summarize elements
  if (key === 'materials' && Array.isArray(newValue)) {
     return newValue.map((item: any) => item.name || item.description || 'Element').join(', ')
  }

  return null
}

const formatValue = (value: any) => {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return value.toLocaleString()
  if (isObject(value)) {
    if (Array.isArray(value)) return `${value.length} items`
    return 'Object data'
  }
  return value
}


// Expose refresh method
defineExpose({
  fetchLogs
})
</script>
