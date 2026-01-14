<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Critical <span class="text-rose-500 text-3xl opacity-50">/</span> Alerts
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Real-time monitoring of stock thresholds and supply risks.</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
          <button 
            @click="filterType = 'all'" 
            :class="['px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' : 'text-slate-500']"
          >
            All Alerts
          </button>
          <button 
            @click="filterType = 'low_stock'" 
            :class="['px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterType === 'low_stock' ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'text-slate-500']"
          >
            Low Stock ({{ lowStockCount }})
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-rose-50 dark:bg-rose-900/10 p-8 rounded-[2.5rem] border border-rose-200 dark:border-rose-900/30 group relative overflow-hidden">
        <div class="absolute -right-4 -bottom-4 p-8 opacity-5 group-hover:opacity-10 transition-all font-black text-7xl italic">LOW</div>
        <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Replenishment Critical</p>
        <h3 class="text-4xl font-black text-rose-600 tracking-tighter">{{ lowStockCount }} <span class="text-sm opacity-50 uppercase ml-2">SKUs</span></h3>
      </div>
      
      <div class="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2.5rem] border border-amber-200 dark:border-amber-900/30">
        <p class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Potential Defects (30d)</p>
        <h3 class="text-4xl font-black text-amber-600 tracking-tighter">{{ recentlyDefectiveCount }} <span class="text-sm opacity-50 uppercase ml-2">Incidents</span></h3>
      </div>

      <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white">
        <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 text-center">Warehouse Health</p>
        <div class="flex items-center justify-center gap-6 mt-2">
            <div class="text-center">
                <p class="text-3xl font-black text-blue-400">{{ healthScore }}%</p>
                <p class="text-[8px] uppercase tracking-widest opacity-50">Reliability</p>
            </div>
            <div class="w-px h-10 bg-white/10"></div>
            <div class="text-center">
                <p class="text-3xl font-black text-emerald-400">{{ totalSKUs }}</p>
                <p class="text-[8px] uppercase tracking-widest opacity-50">Active SKUs</p>
            </div>
        </div>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="space-y-4">
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center gap-4 opacity-40">
        <i class="mdi mdi-loading mdi-spin text-4xl"></i>
        <p class="text-[10px] font-black uppercase tracking-widest">Scanning Inventory Health...</p>
      </div>
      
      <div v-else-if="filteredAlerts.length === 0" class="py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4">
        <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-3xl">
          <i class="mdi mdi-check-decagram"></i>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">System All Systems Nominal</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No critical stock alerts detected in current cycle</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in filteredAlerts" :key="item.id" 
             class="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all flex items-center gap-6 relative overflow-hidden">
          
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>
          
          <!-- Indicator -->
          <div class="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex flex-col items-center justify-center shadow-inner">
             <span class="text-[10px] font-black leading-none mb-1">{{ Math.round((item.available/item.min_stock_level)*100) }}%</span>
             <i class="mdi mdi-alert-octagon text-xl"></i>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-black text-rose-500 uppercase tracking-widest px-2 py-0.5 bg-rose-50 dark:bg-rose-900/10 rounded-md">Low Stock</span>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU: {{ item.material_code }}</span>
            </div>
            <h4 class="text-sm font-black text-slate-900 dark:text-white truncate pr-4">{{ item.material_name }}</h4>
            <div class="flex items-center gap-4 mt-2">
                <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">On Hand</p>
                    <p class="text-xs font-black text-rose-600">{{ item.available }} {{ item.unit_of_measure }}</p>
                </div>
                <div class="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
                <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Threshold</p>
                    <p class="text-xs font-black text-slate-700 dark:text-slate-300">{{ item.min_stock_level }} {{ item.unit_of_measure }}</p>
                </div>
            </div>
          </div>

          <div class="relative z-10 flex flex-col gap-2">
            <button class="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-black/10 transition-all group/btn flex items-center gap-2">
                <i class="mdi mdi-cart-plus text-lg"></i>
                <span class="sr-only group-hover:not-sr-only text-[9px] font-black uppercase tracking-widest">Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const { inventory, fetchInventory } = useInventory()
const loading = ref(false)
const filterType = ref('all')
const logs = ref<any[]>([])

const fetchLogs = async () => {
    try {
        const response = await api.get('/api/procurement-stores/inventory-logs', { params: { type: 'defective' } })
        logs.value = response.data.data || []
    } catch (err) {
        console.error('Failed to fetch logs:', err)
    }
}

const lowStockItems = computed(() => {
    return inventory.value.filter(i => i.available <= i.min_stock_level && i.min_stock_level > 0)
})

const lowStockCount = computed(() => lowStockItems.value.length)

const recentlyDefectiveCount = computed(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return logs.value.filter(l => new Date(l.created_at) > thirtyDaysAgo).length
})

const totalSKUs = computed(() => inventory.value.length)

const healthScore = computed(() => {
    const totalWithMin = inventory.value.filter(i => i.min_stock_level > 0).length
    if (totalWithMin === 0) return 100
    return Math.round(((totalWithMin - lowStockCount.value) / totalWithMin) * 100)
})

const filteredAlerts = computed(() => {
    if (filterType.value === 'low_stock') return lowStockItems.value
    return lowStockItems.value // Currently only covering low stock as active alerts
})

onMounted(async () => {
    loading.value = true
    await Promise.all([fetchInventory(), fetchLogs()])
    loading.value = false
})
</script>
