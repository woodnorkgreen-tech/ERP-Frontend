<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Stock Reports
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor inventory movement and stock health.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="fetchLogs" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
          <i class="mdi mdi-refresh text-lg"></i>
          Refresh Logs
        </button>
        <button @click="exportToCSV" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 dark:shadow-blue-900/40">
          <i class="mdi mdi-download text-lg"></i>
          Export .CSV
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl flex items-center justify-between">
          <div>
             <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Items</p>
             <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ inventory.length }}</h3>
          </div>
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center rounded-lg text-emerald-600 dark:text-emerald-500 text-2xl">
             <i class="mdi mdi-package-variant"></i>
          </div>
       </div>

       <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl flex items-center justify-between">
          <div>
             <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Low Stock Alerts</p>
             <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ lowStockCount }}</h3>
          </div>
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center rounded-lg text-rose-600 dark:text-rose-500 text-2xl">
             <i class="mdi mdi-alert-circle-outline"></i>
          </div>
       </div>

       <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl flex items-center justify-between">
          <div>
             <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Valuation (Est)</p>
             <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(totalValuation) }}</h3>
          </div>
          <div class="w-12 h-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-500 text-2xl">
             <i class="mdi mdi-currency-usd"></i>
          </div>
       </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 shadow-sm dark:shadow-xl flex flex-wrap gap-4 items-center">
       <div class="flex-1 min-w-[200px]">
          <div class="relative">
             <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
             <input 
               v-model="searchQuery"
               type="text" 
               placeholder="Search logs by ref, item or project..."
               class="w-full pl-11 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 transition-all placeholder:font-sans"
             />
          </div>
       </div>
       <div class="relative min-w-[150px]">
         <select v-model="typeFilter" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest focus:ring-0 appearance-none transition-all">
            <option value="">All Transactions</option>
            <option value="check_in">Stock In</option>
            <option value="check_out">Stock Out</option>
            <option value="return">Returns</option>
         </select>
         <i class="mdi mdi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
       </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl">
       <div class="overflow-x-auto">
         <table class="w-full text-left">
            <thead>
               <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ref / Batch</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Activity</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Material</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quantity</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Timestamp</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Entity / Origin</th>
               </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
               <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td class="px-6 py-4">
                     <p class="text-xs font-bold text-slate-900 dark:text-white tracking-widest font-mono">{{ log.batch_number }}</p>
                  </td>
                  <td class="px-6 py-4">
                     <span :class="['px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest', getTypeColor(log.type)]">
                        {{ log.type.replace('_', ' ') }}
                     </span>
                  </td>
                  <td class="px-6 py-4">
                     <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">{{ log.material?.material_name }}</p>
                     <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono">{{ log.material?.material_code }}</p>
                  </td>
                  <td class="px-6 py-4">
                     <p :class="['text-sm font-bold', log.quantity > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500']">
                        {{ log.quantity > 0 ? '+' : '' }}{{ log.quantity }}
                        <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold ml-1 uppercase">{{ log.material?.unit_of_measure }}</span>
                     </p>
                  </td>
                  <td class="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                     {{ formatDateTime(log.created_at) }}
                  </td>
                  <td class="px-6 py-4 text-right">
                     <p class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{{ log.project?.project_id || 'CENTRAL_STORES' }}</p>
                     <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate max-w-[150px] inline-block">{{ log.user?.name || 'ADMIN_BOT' }}</p>
                  </td>
               </tr>
            </tbody>
         </table>
       </div>
       
       <div v-if="filteredLogs.length === 0" class="p-20 text-center opacity-40">
          <i class="mdi mdi-clipboard-text-search-outline text-6xl mb-4 text-slate-300 dark:text-slate-600"></i>
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">No matching logs found in system</p>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const { inventory, fetchInventory } = useInventory()
const logs = ref<any[]>([])
const searchQuery = ref('')
const typeFilter = ref('')

const fetchLogs = async () => {
    try {
        const response = await api.get('/api/procurement-stores/inventory-logs')
        logs.value = response.data.data || []
    } catch (err) { console.error(err) }
}

const lowStockCount = computed(() => inventory.value.filter(i => i.available <= i.min_stock_level).length)
const totalValuation = computed(() => inventory.value.reduce((acc, curr) => acc + (curr.available * curr.unit_cost), 0))

const filteredLogs = computed(() => {
    return logs.value.filter(l => {
        const matchSearch = String(l.batch_number).toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          String(l.material?.material_name).toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchType = !typeFilter.value || l.type === typeFilter.value
        return matchSearch && matchType
    })
})

const getTypeColor = (type: string) => {
    switch(type) {
        case 'check_in': return 'bg-emerald-500/20 text-emerald-500'
        case 'check_out': return 'bg-rose-500/20 text-rose-500'
        case 'return': return 'bg-amber-500/20 text-amber-500'
        default: return 'bg-slate-700 text-slate-400'
    }
}

const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val)
}

const exportToCSV = () => {
  const headers = ['Ref', 'Type', 'Material', 'Qty', 'Unit', 'Project', 'Date']
  const rows = filteredLogs.value.map(l => [
      l.batch_number, l.type, l.material?.material_name, l.quantity, l.material?.unit_of_measure, l.project?.project_id || 'STOCK', formatDateTime(l.created_at)
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'inventory-report.csv'; a.click()
}

onMounted(() => { fetchInventory(); fetchLogs() })
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
