<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-8 font-sans selection:bg-rose-500/30 transition-colors duration-300">
    <!-- Premium Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div>
        <div class="flex items-center gap-2 text-rose-600 dark:text-rose-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
          <span class="w-8 h-[2px] bg-rose-600 dark:bg-rose-500"></span>
          Urgent Alerts
        </div>
        <h1 class="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Store <span class="text-slate-300 dark:text-white/20">/</span> Alerts
        </h1>
      </div>
      
      <div class="flex bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl gap-1 backdrop-blur-xl shadow-sm dark:shadow-xl">
        <button 
          @click="filterType = 'all'" 
          :class="['px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterType === 'all' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-none' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white']"
        >
          All Alerts
        </button>
        <button 
          @click="filterType = 'low_stock'" 
          :class="['px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', filterType === 'low_stock' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white']"
        >
          Low Stock ({{ lowStockCount }})
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden group">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl opacity-50 dark:opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
        <div class="absolute -right-4 -bottom-4 p-8 opacity-5 group-hover:opacity-10 transition-all font-black text-8xl italic z-0 text-slate-900 dark:text-white">LOW</div>
        <div class="relative z-10">
          <p class="text-[10px] font-black text-rose-600 dark:text-rose-500 uppercase tracking-[0.4em] mb-4">REPLENISH STOCK</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ lowStockCount }} <span class="text-xs text-slate-400 dark:text-white/20 uppercase tracking-widest ml-2 italic">Items Found</span></h3>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden group">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl opacity-50 dark:opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
        <div class="absolute -right-4 -bottom-4 p-8 opacity-5 group-hover:opacity-10 transition-all font-black text-8xl italic z-0 text-slate-900 dark:text-white">DEF</div>
        <div class="relative z-10">
          <p class="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.4em] mb-4">DAMAGED ITEMS (30D)</p>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ recentlyDefectiveCount }} <span class="text-xs text-slate-400 dark:text-white/20 uppercase tracking-widest ml-2 italic">Incidents</span></h3>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-100 dark:border-white/10 p-10 rounded-[3rem] shadow-sm dark:shadow-2xl flex flex-col justify-center text-center space-y-4 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-50 dark:opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
          <p class="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.4em] relative z-10">STOCK HEALTH</p>
          <div class="flex items-center justify-center gap-10 relative z-10">
              <div class="space-y-1">
                  <p class="text-3xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">{{ healthScore }}%</p>
                  <p class="text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-white/30">Reliability</p>
              </div>
              <div class="w-px h-12 bg-slate-100 dark:bg-white/5"></div>
              <div class="space-y-1">
                  <p class="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">{{ totalSKUs }}</p>
                  <p class="text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-white/30">Total Items</p>
              </div>
          </div>
      </div>
    </div>

    <!-- Alerts Discovery -->
    <div class="space-y-6">
      <div v-if="loading" class="py-40 flex flex-col items-center justify-center gap-6">
        <i class="mdi mdi-loading mdi-spin text-5xl text-rose-500"></i>
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-white/20">Checking status...</p>
      </div>
      
      <div v-else-if="filteredAlerts.length === 0" class="py-32 bg-slate-50 dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center gap-6 opacity-60">
        <div class="w-24 h-24 rounded-[2rem] bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center text-5xl">
          <i class="mdi mdi-check-underline"></i>
        </div>
        <div class="text-center">
          <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">All Good</h3>
          <p class="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mt-2">No low stock items found</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="item in filteredAlerts" :key="item.id" 
             class="group bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-rose-500/30 shadow-sm dark:shadow-2xl transition-all duration-500 flex items-center gap-8 relative overflow-hidden">
          
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <!-- Stock Level Gauge -->
          <div class="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
             <div class="absolute bottom-0 left-0 right-0 bg-rose-600/20 dark:bg-rose-500/20 transition-all duration-1000" :style="{ height: (100 - (item.available/item.min_stock_level*100)) + '%' }"></div>
             <span class="relative z-10 text-[10px] font-black text-slate-700 dark:text-white font-mono">{{ Math.round((item.available/item.min_stock_level)*100) }}%</span>
             <i class="relative z-10 mdi mdi-alert-decagram text-rose-600 dark:text-rose-500 text-2xl drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"></i>
          </div>

          <div class="flex-1 min-w-0 relative z-10">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-[9px] font-black text-rose-600 dark:text-rose-500 uppercase tracking-widest px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg border border-rose-100 dark:border-rose-500/20">Low Stock</span>
                <span class="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest font-mono">{{ item.material_code }}</span>
            </div>
            <h4 class="text-xl font-black text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors uppercase tracking-tight">{{ item.material_name }}</h4>
            
            <div class="flex items-center gap-8 mt-6 font-mono">
                <div>
                    <p class="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-1 font-sans">Current</p>
                    <p class="text-lg font-black text-rose-600 dark:text-rose-500 tracking-tighter">{{ item.available }} <span class="text-xs text-slate-400 dark:text-white/20 leading-none">{{ item.unit_of_measure }}</span></p>
                </div>
                <div class="w-px h-8 bg-slate-100 dark:bg-white/5"></div>
                <div>
                    <p class="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-1 font-sans">Minimum</p>
                    <p class="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{{ item.min_stock_level }} <span class="text-xs text-slate-400 dark:text-white/20 leading-none">{{ item.unit_of_measure }}</span></p>
                </div>
            </div>
          </div>

          <button @click="router.push({ path: '/stores/check-in', query: { material_id: item.id } })" class="w-14 h-14 bg-slate-50 dark:bg-white/5 hover:bg-rose-600 rounded-2xl text-slate-400 dark:text-white group-hover:text-white transition-all flex items-center justify-center shadow-lg group/btn relative overflow-hidden z-10">
              <i class="mdi mdi-cart-arrow-down text-2xl group-hover:scale-110 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const router = useRouter()
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
    return lowStockItems.value
})

onMounted(async () => {
    loading.value = true
    await Promise.all([fetchInventory(), fetchLogs()])
    loading.value = false
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.shadow-3xl {
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
}
</style>
