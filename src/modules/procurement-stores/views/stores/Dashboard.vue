<template>
  <div class="p-8 space-y-8">
    <!-- Premium Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Stores <span class="text-blue-500 text-3xl opacity-50">/</span> Dashboard
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Quick summary of stock levels and recent movements.</p>
      </div>
      
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col gap-2">
           <button @click="router.push('/stores/check-in')" class="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transition-all font-black text-xs uppercase tracking-widest group min-w-[200px]">
             <i class="mdi mdi-plus-circle-outline text-xl transition-transform group-hover:rotate-90"></i>
             RECEIVE STOCK
           </button>
           <button @click="router.push('/stores/batch-check-in')" class="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-emerald-600/30 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-50 transition-all font-black text-[10px] uppercase tracking-widest">
             <i class="mdi mdi-layers-plus text-lg"></i>
             BATCH INTAKE
           </button>
        </div>
        
        <div class="flex flex-col gap-2">
           <button @click="router.push('/stores/check-out')" class="flex items-center gap-3 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20 transition-all font-black text-xs uppercase tracking-widest group min-w-[200px]">
             <i class="mdi mdi-minus-circle-outline text-xl transition-transform group-hover:-rotate-90"></i>
             ISSUE STOCK
           </button>
           <button @click="router.push('/stores/batch-check-out')" class="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-rose-600/30 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest">
             <i class="mdi mdi-layers-minus text-lg"></i>
             BATCH ISSUANCE
           </button>
        </div>

        <button @click="router.push('/stores/reports')" class="flex flex-col items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest min-w-[140px]">
          <i class="mdi mdi-chart-box-outline text-2xl text-blue-400"></i>
          INTELLIGENCE
        </button>
      </div>
    </div>

    <!-- Live Kpis -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -bottom-4 p-8 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110">
          <i :class="['mdi', stat.icon, 'text-7xl']"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{{ stat.label }}</p>
        <h3 class="text-3xl font-black text-slate-900 dark:text-white mb-2">{{ stat.value }}</h3>
        <span :class="['text-[10px] font-bold px-2 py-1 rounded-lg border', stat.trendColor]">{{ stat.trend }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Activity Feed -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[400px]">
          <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-2">
              <i class="mdi mdi-history text-lg text-blue-500"></i>
              Recent Stock Movements
            </h3>
            <button class="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View History</button>
          </div>
          
          <div class="p-4">
             <div v-if="loadingLogs" class="py-20 flex flex-col items-center justify-center gap-4 opacity-40">
                <i class="mdi mdi-loading mdi-spin text-4xl"></i>
                <p class="text-[10px] font-black uppercase tracking-widest">Syncing Logs...</p>
             </div>
             <div v-else-if="logs.length === 0" class="py-20 flex flex-col items-center justify-center gap-4 opacity-40">
                <i class="mdi mdi-ghost-outline text-6xl"></i>
                <p class="text-[10px] font-black uppercase tracking-widest">No Recent Activity Detected</p>
             </div>
             <div v-else class="space-y-4">
                <div v-for="log in logs" :key="log.id" class="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                   <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm', getLogIconClass(log.type)]">
                      <i :class="['mdi', getLogIcon(log.type)]"></i>
                   </div>
                   <div class="flex-1">
                      <div class="flex items-center justify-between">
                         <p class="text-sm font-black text-slate-900 dark:text-white capitalize">{{ log.type.replace('_', ' ') }}</p>
                         <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ getTimeAgo(log.created_at) }}</p>
                      </div>
                      <p class="text-xs text-slate-500 font-medium">
                        {{ log.quantity }} {{ log.material?.unit_of_measure }} of <span class="font-bold text-slate-700 dark:text-slate-300">{{ log.material?.material_name }}</span>
                      </p>
                   </div>
                   <div class="text-right sr-only md:not-sr-only">
                      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Balance</p>
                      <p class="text-sm font-black text-slate-900 dark:text-white">{{ log.balance_after }}</p>
                   </div>
                   <button 
                     @click.stop="deleteLog(log.id)"
                     class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all opacity-0 group-hover:opacity-100"
                     title="Delete Log & Revert Stock"
                   >
                     <i class="mdi mdi-delete-outline text-xl"></i>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Alerts -->
      <div class="space-y-6">
        <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">Master Access</p>
          <div class="space-y-4">
             <button @click="router.push('/stores/materials-library')" class="w-full p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-4 transition-all">
                <i class="mdi mdi-library-shelves text-2xl text-blue-400"></i>
                <div class="text-left">
                   <p class="text-xs font-black uppercase tracking-widest">Materials Library</p>
                   <p class="text-[9px] text-white/40">Manage master catalog & specs</p>
                </div>
             </button>
             <button @click="router.push('/stores/alerts')" class="w-full p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-4 transition-all group/btn">
                <i class="mdi mdi-alert-octagon text-2xl text-rose-400"></i>
                <div class="text-left flex-1">
                   <p class="text-xs font-black uppercase tracking-widest">Low Stock Scanner</p>
                   <p class="text-[9px] text-white/40">{{ stats[3].value }} Items require replenishment</p>
                </div>
                <i class="mdi mdi-chevron-right text-white/20 group-hover/btn:translate-x-1 transition-transform"></i>
             </button>
             <button @click="router.push('/stores/defective')" class="w-full p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center gap-4 transition-all group/btn">
                <i class="mdi mdi-alert-box text-2xl text-amber-400"></i>
                <div class="text-left flex-1">
                   <p class="text-xs font-black uppercase tracking-widest">Quarantine Stock</p>
                   <p class="text-[9px] text-white/40">Report damage or defects</p>
                </div>
                <i class="mdi mdi-chevron-right text-white/20 group-hover/btn:translate-x-1 transition-transform"></i>
             </button>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
           <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Warehouse Health</p>
           <div class="space-y-6">
              <div v-for="metric in healthMetrics" :key="metric.label" class="space-y-2">
                 <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span class="text-slate-500">{{ metric.label }}</span>
                    <span :class="metric.color">{{ metric.value }}%</span>
                 </div>
                 <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div :class="['h-full rounded-full transition-all duration-1000', metric.bg]" :style="{ width: metric.value + '%' }"></div>
                 </div>
              </div>
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
  const totalSKUs = inventory.value.length
  const liveAssets = inventory.value.filter(i => i.quantity_on_hand > 0).length
  const valuation = inventory.value.reduce((acc, i) => acc + (i.quantity_on_hand * i.unit_cost), 0)
  const activeReservations = inventory.value.reduce((acc, i) => acc + i.quantity_reserved, 0)
  const lowStockCount = inventory.value.filter(i => i.available <= i.min_stock_level && i.min_stock_level > 0).length

  return [
    { label: 'Available Materials', value: totalSKUs, trend: `${liveAssets} Items in Stock`, trendColor: 'text-emerald-500 border-emerald-500/20', icon: 'mdi-package-variant-closed' },
    { label: 'Stock Value', value: formatCurrency(valuation), trend: 'Asset Worth', trendColor: 'text-blue-500 border-blue-500/20', icon: 'mdi-currency-usd' },
    { label: 'Reserved Stock', value: activeReservations, trend: 'For Projects', trendColor: 'text-amber-500 border-amber-500/20', icon: 'mdi-calendar-check' },
    { label: 'Low Stock', value: lowStockCount, trend: 'Restock Needed', trendColor: lowStockCount > 0 ? 'text-rose-500 border-rose-500/20' : 'text-emerald-500 border-emerald-500/20', icon: 'mdi-alert-octagon' }
  ]
})

const healthMetrics = computed(() => {
    const lowStockItems = inventory.value.filter(i => i.quantity_on_hand <= i.min_stock_level && i.min_stock_level > 0).length
    const totalWithMin = inventory.value.filter(i => i.min_stock_level > 0).length
    const health = totalWithMin > 0 ? Math.round(((totalWithMin - lowStockItems) / totalWithMin) * 100) : 100

    return [
        { label: 'Stock Health', value: health, color: 'text-blue-500', bg: 'bg-blue-500' },
        { label: 'Inventory Coverage', value: 85, color: 'text-emerald-500', bg: 'bg-emerald-500' },
        { label: 'Replenishment Status', value: 42, color: 'text-rose-500', bg: 'bg-rose-500' }
    ]
})

const logs = ref<any[]>([])
const loadingLogs = ref(false)

const fetchLogs = async () => {
    loadingLogs.value = true
    try {
        const response = await api.get('/api/procurement-stores/inventory-logs')
        logs.value = response.data.data || []
    } catch (err) {
        console.error('Failed to fetch logs:', err)
    } finally {
        loadingLogs.value = false
    }
}

const getLogIcon = (type: string) => {
    const icons: Record<string, string> = {
        'check_in': 'mdi-arrow-down-bold-box',
        'check_out': 'mdi-truck-delivery',
        'return': 'mdi-refresh',
        'defective': 'mdi-alert-box'
    }
    return icons[type] || 'mdi-swap-horizontal'
}

const getLogIconClass = (type: string) => {
    const classes: Record<string, string> = {
        'check_in': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        'check_out': 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
        'return': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        'defective': 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
    }
    return classes[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-500'
}

const getTimeAgo = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const deleteLog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this log entry? This will revert the stock adjustment.')) return
    
    try {
        await api.delete(`/api/procurement-stores/inventory-logs/${id}`)
        await fetchLogs()
        await fetchInventory()
    } catch (err) {
        console.error('Failed to delete log:', err)
        alert('Failed to delete log. Please try again.')
    }
}

onMounted(() => {
    fetchLogs()
    fetchInventory()
})
</script>
