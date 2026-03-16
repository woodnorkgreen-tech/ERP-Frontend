<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Stores Dashboard
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time inventory overview and quick actions.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="router.push('/stores/reports')" class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
          <i class="mdi mdi-chart-box-outline text-lg"></i>
          Reports
        </button>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-12 gap-6">
      
      <!-- Left: Quick Actions & Navigation -->
      <div class="col-span-12 lg:col-span-3 space-y-6">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Operations</h3>
          
          <div class="space-y-3">
            <button @click="router.push('/stores/check-in')" class="w-full group flex items-center justify-between p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/20">
              <div class="flex items-center gap-3">
                <i class="mdi mdi-plus-box text-xl"></i>
                <span class="text-xs font-bold uppercase tracking-wider">Receive Stock</span>
              </div>
              <i class="mdi mdi-chevron-right opacity-50"></i>
            </button>

            <button @click="router.push('/stores/check-out')" class="w-full group flex items-center justify-between p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all shadow-lg shadow-rose-600/20 dark:shadow-rose-900/20">
              <div class="flex items-center gap-3">
                <i class="mdi mdi-minus-box text-xl"></i>
                <span class="text-xs font-bold uppercase tracking-wider">Issue Stock</span>
              </div>
              <i class="mdi mdi-chevron-right opacity-50"></i>
            </button>

            <div class="h-px bg-slate-100 dark:bg-slate-700 my-4"></div>

            <button @click="router.push('/stores/materials-library')" class="w-full flex items-center justify-between p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-all">
              <div class="flex items-center gap-3">
                <i class="mdi mdi-format-list-bulleted text-xl"></i>
                <span class="text-xs font-bold uppercase tracking-wider">Materials List</span>
              </div>
            </button>

            <button @click="router.push('/stores/reports')" class="w-full flex items-center justify-between p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-all">
              <div class="flex items-center gap-3">
                <i class="mdi mdi-history text-xl"></i>
                <span class="text-xs font-bold uppercase tracking-wider">Movement Logs</span>
              </div>
            </button>
          </div>
        </div>

        <!-- System Alerts -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl">
           <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Stock Alerts</h3>
           <div class="space-y-4">
              <div v-if="lowStockItems.length === 0" class="text-center py-4 opacity-30">
                 <i class="mdi mdi-check-circle-outline text-3xl mb-2 text-slate-400 dark:text-slate-200"></i>
                 <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-200">Levels Healthy</p>
              </div>
              <div v-for="item in lowStockItems.slice(0, 3)" :key="item.id" 
                   class="p-3 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-lg flex items-center justify-between group cursor-pointer hover:border-rose-300 dark:hover:border-rose-500/50 transition-all">
                 <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-bold text-slate-900 dark:text-white truncate uppercase">{{ item.material_name }}</p>
                    <p class="text-[8px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-tighter">{{ item.material_code }}</p>
                 </div>
                 <div class="text-right ml-2">
                    <p class="text-xs font-bold text-slate-900 dark:text-white">{{ item.available }}</p>
                    <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{ item.unit_of_measure }}</p>
                 </div>
              </div>
              <button v-if="lowStockItems.length > 3" @click="router.push('/stores/reports')" class="w-full text-center text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest p-2 hover:text-rose-500 dark:hover:text-rose-300 transition-colors">
                 View all {{ lowStockItems.length }} alerts
              </button>
           </div>
        </div>
      </div>

      <!-- Middle/Right: Main Content -->
      <div class="col-span-12 lg:col-span-9 space-y-6">
        
        <!-- Metrics Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div v-for="(stat, idx) in stats" :key="stat.label" 
                class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl flex flex-col items-center justify-center text-center relative group">
              
              <div class="relative w-24 h-24 mb-4">
                 <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-100 dark:stroke-slate-900" stroke-width="3" />
                    <circle cx="18" cy="18" r="16" fill="none" 
                            :class="['transition-all duration-1000 ease-out', getGaugeColor(idx)]"
                            stroke-width="3" 
                            stroke-dasharray="100" 
                            :stroke-dashoffset="100 - (stat.progress || 80)"
                            stroke-linecap="round" />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-sm font-bold text-slate-900 dark:text-white tracking-tighter truncate max-w-[60px]">{{ stat.valueDisplay || stat.value }}</span>
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{ stat.shortUnit }}</span>
                 </div>
              </div>
              
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
              <div :class="['text-[8px] font-bold mt-2 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700', stat.trendColor]">{{ stat.trend }}</div>
           </div>
        </div>

        <!-- Activity Feed -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col min-h-[500px]">
           <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                 <i class="mdi mdi-pulse text-blue-500"></i>
                 Live Movement Feed
              </h2>
              <div class="flex gap-1">
                 <div class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                 <div class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                 <div class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              </div>
           </div>

           <div class="flex-1 p-8">
              <div v-if="loadingLogs" class="h-full flex flex-col items-center justify-center opacity-30">
                 <i class="mdi mdi-loading mdi-spin text-4xl mb-4 text-blue-500"></i>
                 <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-200">Updating system registers...</p>
              </div>

              <div v-else class="space-y-4">
                 <div v-for="log in logs.slice(0, 7)" :key="log.id" 
                      class="flex items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50 transition-all group shadow-sm dark:shadow-none">
                    
                    <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-inner relative overflow-hidden', getLogIconClass(log.type)]">
                       <i :class="['mdi relative z-10', getLogIcon(log.type)]"></i>
                    </div>

                    <div class="flex-1 min-w-0">
                       <div class="flex justify-between items-start mb-1">
                          <p class="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                             {{ log.type.replace('_', ' ') }}
                             <span v-if="log.project" class="bg-white dark:bg-slate-900 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-bold tracking-tighter text-[9px] border border-slate-100 dark:border-slate-700">#{{ log.project.project_id }}</span>
                          </p>
                          <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{ getTimeAgo(log.created_at) }}</p>
                       </div>
                       <p class="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                          <span class="text-slate-900 dark:text-white font-bold">{{ log.quantity }}</span> units of <span class="text-slate-700 dark:text-slate-300 font-bold uppercase">{{ log.material?.material_name }}</span>
                       </p>
                    </div>

                    <div class="text-right">
                       <p class="text-[8px] font-bold uppercase text-slate-400 dark:text-slate-500 mb-0.5">Balance</p>
                       <p class="text-base font-bold text-slate-900 dark:text-white font-mono tracking-tighter">{{ log.balance_after }}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div class="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 font-sans">
              <button @click="router.push('/stores/reports')" class="w-full py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm">
                 Access Full Audit Trail
              </button>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import { useInventory } from '../../composables/useInventory'

const router = useRouter()
const { inventory, fetchInventory } = useInventory()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES',
    maximumFractionDigits: 0
  }).format(value)
}

const stats = computed(() => {
  const totalValuation = inventory.value.reduce((acc, i) => acc + (i.quantity_on_hand * i.unit_cost), 0)
  const lowStockCount = inventory.value.filter(i => i.available <= i.min_stock_level && i.min_stock_level > 0).length
  
  return [
    { label: 'Total Items', value: inventory.value.length, progress: 90, shortUnit: 'SKU', trend: 'Active Inventory', trendColor: 'text-emerald-500' },
    { label: 'Asset Value', valueDisplay: formatCurrency(totalValuation), value: totalValuation, progress: 85, shortUnit: 'KES', trend: 'Audit Estim.', trendColor: 'text-blue-500' },
    { label: 'Low Stock', value: lowStockCount, progress: lowStockCount > 0 ? 30 : 100, shortUnit: 'ALR', trend: 'Critical Warnings', trendColor: lowStockCount > 0 ? 'text-rose-500' : 'text-emerald-500' },
    { label: 'Store Health', value: '88%', progress: 88, shortUnit: 'IDX', trend: 'Optimization', trendColor: 'text-emerald-500' }
  ]
})

const lowStockItems = computed(() => inventory.value.filter(i => i.available <= i.min_stock_level && i.min_stock_level > 0))

const logs = ref<any[]>([])
const loadingLogs = ref(false)

const fetchLogs = async () => {
    loadingLogs.value = true
    try {
        const response = await api.get('/api/procurement-stores/inventory-logs')
        logs.value = response.data.data || []
    } catch (err) { console.error(err) }
    finally { loadingLogs.value = false }
}

const getLogIcon = (type: string) => {
    const icons: Record<string, string> = {
        'check_in': 'mdi-transfer-down',
        'check_out': 'mdi-transfer-up',
        'return': 'mdi-keyboard-return',
        'defective': 'mdi-alert-box'
    }
    return icons[type] || 'mdi-swap-horizontal'
}

const getLogIconClass = (type: string) => {
    const classes: Record<string, string> = {
        'check_in': 'bg-emerald-500/10 text-emerald-500',
        'check_out': 'bg-rose-500/10 text-rose-500',
        'return': 'bg-blue-500/10 text-blue-500',
        'defective': 'bg-amber-500/10 text-amber-500'
    }
    return classes[type] || 'bg-slate-800 text-slate-500'
}

const getGaugeColor = (idx: number) => {
  const colors = ['stroke-emerald-500', 'stroke-blue-500', 'stroke-rose-500', 'stroke-emerald-400']
  return colors[idx] || 'stroke-slate-700'
}

const getTimeAgo = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
    fetchLogs()
    fetchInventory()
})
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
