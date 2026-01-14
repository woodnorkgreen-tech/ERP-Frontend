<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Intelligence <span class="text-blue-500 text-3xl opacity-50">/</span> Reports
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Audit logs and real-time inventory analytics.</p>
      </div>
      
      <div class="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
            activeTab === tab.id 
              ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Movement History Tab -->
    <div v-if="activeTab === 'movement'" class="space-y-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type:</span>
          <select v-model="filters.type" class="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all">
            <option value="">All Movements</option>
            <option value="check_in">Stock Intake (Check-in)</option>
            <option value="check_out">Stock Issuance (Check-out)</option>
            <option value="return">Returns</option>
          </select>
        </div>

        <div class="flex items-center gap-2 relative">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project:</span>
          <div class="relative min-w-[300px]">
            <input 
              v-model="projectSearch"
              type="text"
              placeholder="Search Project (ID or Title)..."
              @focus="showProjectList = true"
              class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <div 
              v-if="showProjectList && filteredProjects.length > 0"
              class="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto p-2"
            >
              <div 
                v-for="prj in filteredProjects" 
                :key="prj.id"
                @click="selectProject(prj)"
                class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-blue-500/30 group"
              >
                <div class="flex flex-col">
                  <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 group-hover:scale-105 transition-transform origin-left">{{ prj.project_id }}</span>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ prj.enquiry?.title }}</span>
                </div>
              </div>
            </div>
            <button 
              v-if="filters.project_id"
              @click="clearProject"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <i class="mdi mdi-close-circle text-lg"></i>
            </button>
          </div>
        </div>

        <div class="ml-auto flex items-center gap-3">
          <div v-if="loading" class="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
            <i class="mdi mdi-loading mdi-spin"></i>
            Syncing...
          </div>
          <span v-else class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantity</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Entity / Project</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="log in logs" :key="log.id" class="group hover:bg-slate-50 transition-colors">
                <td class="px-8 py-5">
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ formatDate(log.created_at) }}</span>
                    <span class="text-[9px] font-medium text-slate-400 uppercase">{{ formatTime(log.created_at) }}</span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <div class="flex flex-col">
                    <span class="text-xs font-black text-blue-600">{{ log.material?.material_name }}</span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{{ log.material?.material_code }}</span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <span :class="[
                    'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
                    log.type === 'check_in' ? 'bg-emerald-100 text-emerald-700' : 
                    log.type === 'check_out' ? 'bg-rose-100 text-rose-700' : 
                    log.type === 'defective' ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-700'
                  ]">
                    {{ formatType(log.type) }}
                  </span>
                </td>
                <td class="px-8 py-5">
                  <span class="text-xs font-black" :class="log.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'">
                    {{ log.quantity > 0 ? '+' : '' }}{{ log.quantity }}
                  </span>
                </td>
                <td class="px-8 py-5">
                  <div v-if="log.project_id" class="flex flex-col">
                    <span class="text-xs font-bold text-slate-700">{{ getProjectName(log.project_id) }}</span>
                    <span class="text-[9px] font-black text-slate-400 uppercase">{{ getProjectCode(log.project_id) }}</span>
                  </div>
                  <span v-else class="text-[10px] font-bold text-slate-400 italic">Gen. Inventory</span>
                </td>
                <td class="px-8 py-5">
                  <span class="text-xs font-bold text-slate-600">{{ log.user?.name || 'System' }}</span>
                </td>
              </tr>
              <tr v-if="logs.length === 0 && !loading" class="text-center py-20">
                <td colspan="6" class="p-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic opacity-50">
                  No movement logs found for the selected filters
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Stock Status Tab -->
    <div v-if="activeTab === 'stock'" class="space-y-8">
      <!-- KPI Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total SKU Valuation</p>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white"><span class="text-sm opacity-50 mr-1">Ksh</span>{{ totalValuation.toLocaleString() }}</h3>
        </div>
        <div class="bg-rose-50 dark:bg-rose-900/10 p-8 rounded-[2rem] border border-rose-200 dark:border-rose-900/30">
          <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Low Stock Alerts</p>
          <h3 class="text-3xl font-black text-rose-600">{{ lowStockItems.length }} <span class="text-sm opacity-50 uppercase ml-2">Items</span></h3>
        </div>
        <div class="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-[2rem] border border-emerald-200 dark:border-emerald-900/30">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Healthy Stock</p>
          <h3 class="text-3xl font-black text-emerald-600">{{ inventory.length - lowStockItems.length }} <span class="text-sm opacity-50 uppercase ml-2">Items</span></h3>
        </div>
      </div>

      <!-- Current Stock Table -->
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">Current Stock Inventory</h4>
          <div class="flex gap-2">
            <button @click="stockFilter = 'all'" :class="['px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all', stockFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500']">All Items</button>
            <button @click="stockFilter = 'low'" :class="['px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all', stockFilter === 'low' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-500']">Low Stock</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workstation</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantity</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Min. Level</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valuation</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="item in filteredInventory" :key="item.id" class="group hover:bg-slate-50">
                <td class="px-8 py-5">
                  <div class="flex flex-col">
                    <span class="text-xs font-black text-slate-800">{{ item.material_name }}</span>
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{{ item.material_code }}</span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase">{{ item.workstation_name }}</span>
                </td>
                <td class="px-8 py-5">
                  <span class="text-xs font-black" :class="item.available < item.min_stock_level ? 'text-rose-600' : 'text-slate-800'">
                    {{ item.available }} {{ item.unit_of_measure }}
                  </span>
                </td>
                <td class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ item.min_stock_level }} {{ item.unit_of_measure }}
                </td>
                <td class="px-8 py-5">
                  <span :class="[
                    'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
                    item.available < item.min_stock_level ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  ]">
                    {{ item.available < item.min_stock_level ? 'Low Stock' : 'Healthy' }}
                  </span>
                </td>
                <td class="px-8 py-5 text-xs font-black text-slate-900">
                  <span class="text-[9px] opacity-40 mr-1">Ksh</span>{{ (item.available * (item.unit_cost || 0)).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'
import { debounce } from 'lodash'

const activeTab = ref('movement')
const tabs = [
  { id: 'movement', label: 'Movement History' },
  { id: 'stock', label: 'Stock Status' }
]

const { inventory, fetchInventory } = useInventory()
const projects = ref<any[]>([])
const logs = ref<any[]>([])
const loading = ref(false)

const projectSearch = ref('')
const showProjectList = ref(false)

const filters = ref({
  type: '',
  project_id: '',
  material_id: ''
})

const stockFilter = ref('all')

const fetchProjects = async () => {
    try {
        const response = await api.get('/api/projects')
        projects.value = response.data.data.data || response.data.data || []
    } catch (err) {
        console.error('Failed to fetch projects:', err)
    }
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/procurement-stores/inventory-logs', { params: filters.value })
    logs.value = response.data.data || []
  } catch (err) {
    console.error('Failed to fetch logs:', err)
  } finally {
    loading.value = false
  }
}

// Automatic Debounced Filter Application
const debouncedFetchLogs = debounce(() => {
    fetchLogs()
}, 500)

watch(() => [filters.value.type, filters.value.project_id], () => {
    debouncedFetchLogs()
}, { deep: true })

const filteredProjects = computed(() => {
    if (!projectSearch.value) return projects.value.filter(p => p.project_id?.startsWith('WNG'))
    
    const term = projectSearch.value.toLowerCase()
    return projects.value.filter(p => 
        p.project_id?.startsWith('WNG') && 
        (p.project_id.toLowerCase().includes(term) || 
         p.enquiry?.title?.toLowerCase().includes(term))
    )
})

const selectProject = (prj: any) => {
    filters.value.project_id = prj.id
    projectSearch.value = `${prj.project_id} - ${prj.enquiry?.title}`
    showProjectList.value = false
}

const clearProject = () => {
    filters.value.project_id = ''
    projectSearch.value = ''
    showProjectList.value = false
}

const filteredInventory = computed(() => {
  if (stockFilter.value === 'low') {
    return inventory.value.filter(i => i.available < i.min_stock_level)
  }
  return inventory.value
})

const lowStockItems = computed(() => {
  return inventory.value.filter(i => (i.available <= i.min_stock_level) && (i.min_stock_level > 0))
})

const totalValuation = computed(() => {
  return inventory.value.reduce((acc, item) => acc + (item.available * (item.unit_cost || 0)), 0)
})

const getProjectName = (id: any) => {
  const p = projects.value.find(p => p.id === id)
  return p?.enquiry?.title || 'Unknown Project'
}

const getProjectCode = (id: any) => {
  const p = projects.value.find(p => p.id === id)
  return p?.project_id || '---'
}

const formatType = (type: string) => {
  if (type === 'check_in') return 'Intake'
  if (type === 'check_out') return 'Issuance'
  if (type === 'return') return 'Return'
  if (type === 'defective') return 'Defective'
  return type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchInventory()
  fetchProjects()
  fetchLogs()
})
</script>
