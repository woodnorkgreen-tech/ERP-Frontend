<template>
  <div class="space-y-10">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-blue-500 rounded-full"></div>
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Neural Filters</h3>
      </div>
      <button
        @click="resetFilters"
        class="text-[10px] font-black text-slate-500 hover:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-2"
      >
        <i class="mdi mdi-refresh text-base"></i>
        Purge Filters
      </button>
    </div>

    <div class="space-y-6">
      <!-- Search Bar -->
      <div class="space-y-2">
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Global Quantum Search</label>
        <div class="relative group">
          <input
            v-model="filters.searchQuery"
            type="text"
            placeholder="Mission ID, Client, or Scope..."
            class="w-full h-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-11 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
        </div>
      </div>

      <!-- Date Range -->
      <div class="space-y-2">
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Temporal Window</label>
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white"
          />
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-full h-11 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Status Filter -->
      <div class="space-y-2">
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Execution Status</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="toggleStatus(status.value)"
            :class="[
              'px-3.5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 border',
              filters.status.includes(status.value)
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-500/50'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Priority Filter -->
      <div class="space-y-2">
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Criticality level</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="priority in priorityOptions"
            :key="priority.value"
            @click="togglePriority(priority.value)"
            :class="[
              'px-3.5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 border',
              filters.priority.includes(priority.value)
                ? getPriorityActiveClass(priority.value)
                : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-500/50'
            ]"
          >
            {{ priority.label }}
          </button>
        </div>
      </div>

      <!-- Export Interface -->
      <div class="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mission Logistics</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="exportToPDF"
            class="group flex items-center justify-center gap-2 h-11 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-red-500/50 transition-all active:scale-95"
          >
            <i class="mdi mdi-file-pdf-box text-lg text-red-500"></i>
            <span class="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">PDF Export</span>
          </button>
          <button
            @click="exportToExcel"
            class="group flex items-center justify-center gap-2 h-11 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500/50 transition-all active:scale-95"
          >
            <i class="mdi mdi-file-excel text-lg text-emerald-500"></i>
            <span class="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Excel Cell</span>
          </button>
        </div>
      </div>

      <!-- Tactical Action -->
      <button
        @click="applyFilters"
        class="w-full h-12 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <i class="mdi mdi-filter-variant text-base"></i>
        Sync Filter State
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Filters {
  searchQuery: string
  dateFrom: string
  dateTo: string
  status: string[]
  priority: string[]
  department: string
  budgetRange: {
    min: number
    max: number
  }
  showCharts: boolean
  showMetrics: boolean
  showActivities: boolean
}

const filters = reactive<Filters>({
  searchQuery: '',
  dateFrom: '',
  dateTo: '',
  status: [],
  priority: [],
  department: '',
  budgetRange: {
    min: 0,
    max: 1000000
  },
  showCharts: true,
  showMetrics: true,
  showActivities: true
})

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

const departmentOptions = [
  { value: 'design', label: 'Design' },
  { value: 'projects', label: 'Projects' },
  { value: 'client_service', label: 'Client Service' },
  { value: 'hr', label: 'HR' }
]

const emit = defineEmits<{
  filter: [filters: Filters]
  export: [data: { type: string; filters: Filters }]
}>()

const toggleStatus = (status: string) => {
  const index = filters.status.indexOf(status)
  if (index > -1) {
    filters.status.splice(index, 1)
  } else {
    filters.status.push(status)
  }
}

const togglePriority = (priority: string) => {
  const index = filters.priority.indexOf(priority)
  if (index > -1) {
    filters.priority.splice(index, 1)
  } else {
    filters.priority.push(priority)
  }
}

const getPriorityActiveClass = (priority: string) => {
  const classes: Record<string, string> = {
    'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[priority] || 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
}

const resetFilters = () => {
  filters.searchQuery = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  filters.status = []
  filters.priority = []
  filters.department = ''
  filters.budgetRange.min = 0
  filters.budgetRange.max = 1000000
  filters.showCharts = true
  filters.showMetrics = true
  filters.showActivities = true
  applyFilters()
}

const applyFilters = () => {
  emit('filter', { ...filters })
}

const exportToPDF = () => {
  emit('export', { type: 'pdf', filters: { ...filters } })
}

const exportToExcel = () => {
  emit('export', { type: 'excel', filters: { ...filters } })
}
</script>
