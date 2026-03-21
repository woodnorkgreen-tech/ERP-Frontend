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
        <button @click="exportToPDF" class="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-500/20 dark:shadow-rose-900/40">
          <i class="mdi mdi-file-pdf-box text-lg"></i>
          Export .PDF
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
             <i class="">Ksh</i>
          </div>
       </div>
    </div>
    <!-- Tab Switcher -->
    <div class="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-6">
       <button 
         @click="activeTab = 'logs'"
         :class="['pb-4 text-xs font-bold uppercase tracking-widest transition-all relative', activeTab === 'logs' ? 'text-blue-600 dark:text-blue-500' : 'text-slate-400 hover:text-slate-600']"
       >
         Inventory Logs
         <div v-if="activeTab === 'logs'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-in slide-in-from-bottom-1 blur-[1px]"></div>
       </button>
       <button 
         @click="activeTab = 'outstanding'"
         :class="['pb-4 text-xs font-bold uppercase tracking-widest transition-all relative', activeTab === 'outstanding' ? 'text-amber-600 dark:text-amber-500' : 'text-slate-400 hover:text-slate-600']"
       >
         Project Stock (Reusables)
         <div v-if="activeTab === 'outstanding'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-500 rounded-full animate-in slide-in-from-bottom-1 blur-[1px]"></div>
       </button>
    </div>
    <!-- Filters -->
     <div v-if="activeTab === 'logs'" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 shadow-sm dark:shadow-xl flex flex-wrap gap-4 items-center">
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
           <input 
             v-model="startDate"
             type="date" 
             class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest focus:ring-0 transition-all"
             title="Start Date"
           />
        </div>
        <div class="relative min-w-[150px]">
           <input 
             v-model="endDate"
             type="date" 
             class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest focus:ring-0 transition-all"
             title="End Date"
           />
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
        <button @click="resetFilters" class="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Reset Filters">
           <i class="mdi mdi-filter-off text-xl"></i>
        </button>
     </div>

    <!-- Logs Table -->
     <div v-if="activeTab === 'logs'" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                      <p class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{{ log.project?.project_id || 'STORES' }}</p>
                      <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate max-w-[200px] inline-block mb-1">{{ log.project?.enquiry?.title || '' }}</p>
                      <p class="text-[8px] font-bold text-slate-500 dark:text-slate-600 truncate max-w-[150px] block opacity-50">{{ log.user?.name || 'ADMIN_BOT' }}</p>
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
 
     <!-- Project Stock Table -->
     <div v-if="activeTab === 'outstanding'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div v-for="proj in outstandingData" :key="proj.project_id" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl">
           <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                 <h4 class="text-sm font-bold text-slate-900 dark:text-white uppercase">{{ proj.project_code }}</h4>
                 <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{{ proj.project_title }}</p>
              </div>
              <div class="text-right">
                 <p class="text-[8px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Outstanding Balance</p>
                 <p class="text-xs font-bold text-slate-900 dark:text-white">{{ proj.items.length }} Reusable Categories</p>
              </div>
           </div>
           
           <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-sans">
                 <thead>
                    <tr class="bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700/50">
                       <th class="px-6 py-3">Material</th>
                       <th class="px-6 py-3 text-center">Total Issued</th>
                       <th class="px-6 py-3 text-center">Total Returned</th>
                       <th class="px-6 py-3 text-center">Current Balance</th>
                       <th class="px-6 py-3 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-50 dark:divide-slate-700/30 font-sans">
                    <tr v-for="item in proj.items" :key="item.material_id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors font-sans">
                       <td class="px-6 py-4">
                          <p class="font-bold text-slate-900 dark:text-white uppercase">{{ item.material_name }}</p>
                          <p class="text-[9px] text-slate-400 dark:text-slate-500 font-mono">{{ item.material_code }}</p>
                       </td>
                       <td class="px-6 py-4 text-center font-bold text-slate-500">{{ item.issued }} {{ item.unit }}</td>
                       <td class="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-500">{{ item.returned }} {{ item.unit }}</td>
                       <td class="px-6 py-4 text-center font-bold text-amber-600 dark:text-amber-500 text-sm">
                          {{ item.balance }} {{ item.unit }}
                       </td>
                       <td class="px-6 py-4 text-right">
                          <button 
                            @click="openReturnModal(item, proj)" 
                            class="text-amber-600 hover:text-amber-500 font-bold text-[9px] bg-amber-500/10 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest"
                          >
                             Return
                          </button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
 
        <div v-if="outstandingData.length === 0" class="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-20 text-center opacity-40">
           <i class="mdi mdi-clipboard-check-outline text-6xl mb-4 text-slate-300 dark:text-slate-600"></i>
           <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">All reusable items have been returned | No active project stock</p>
        </div>
     </div>
     <!-- Quick Return Modal -->
     <div v-if="showReturnModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-300 transition-all font-sans">
           <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Quick Return Stock</h3>
              <button @click="showReturnModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                 <i class="mdi mdi-close text-xl"></i>
              </button>
           </div>
           
           <div class="p-6 space-y-6">
              <div class="space-y-1">
                 <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Material & Project</p>
                 <p class="text-sm font-bold text-slate-900 dark:text-white uppercase">{{ quickReturnForm.material_name }}</p>
                 <p class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter">{{ quickReturnForm.project_code }}</p>
              </div>
 
              <div class="space-y-2">
                 <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Quantity to Return</label>
                 <div class="relative">
                    <input 
                      v-model.number="quickReturnForm.quantity"
                      type="number" 
                      class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-lg font-bold text-slate-900 dark:text-white focus:ring-0 focus:border-amber-500 transition-all font-mono"
                    />
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">UNITS</div>
                 </div>
              </div>
 
              <div class="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg">
                 <div class="flex gap-3">
                    <i class="mdi mdi-information-outline text-amber-600 dark:text-amber-500 text-lg"></i>
                    <p class="text-[10px] font-medium text-amber-800 dark:text-amber-400 leading-relaxed italic">
                       This action will return the items to the main store and clear the outstanding balance for this project.
                    </p>
                 </div>
              </div>
           </div>
 
           <div class="p-6 pt-0">
              <button 
                @click="submitQuickReturn"
                :disabled="quickReturnSubmitting || !quickReturnForm.quantity"
                class="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-amber-900/20 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                 <i v-if="quickReturnSubmitting" class="mdi mdi-loading mdi-spin text-lg"></i>
                 <i v-else class="mdi mdi-keyboard-return text-lg"></i>
                 {{ quickReturnSubmitting ? 'Processing...' : 'Confirm Quick Return' }}
              </button>
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
const logs = ref<any[]>([])
const outstandingData = ref<any[]>([])
const activeTab = ref('logs')
const searchQuery = ref('')
const typeFilter = ref('')
const startDate = ref('')
const endDate = ref('')

// Quick Return Modal State
const showReturnModal = ref(false)
const quickReturnSubmitting = ref(false)
const quickReturnForm = ref({
  material_id: '',
  project_id: '',
  quantity: null as number | null,
  material_name: '',
  project_code: '',
  usage_type: 'reusable',
  notes: ''
})

const resetFilters = () => {
    searchQuery.value = ''
    typeFilter.value = ''
    startDate.value = ''
    endDate.value = ''
}

const fetchLogs = async () => {
    try {
        const response = await api.get('/api/procurement-stores/inventory-logs')
        logs.value = response.data.data || []
    } catch (err) { console.error(err) }
}

const fetchOutstanding = async () => {
    try {
        const response = await api.get('/api/procurement-stores/outstanding-reusables')
        outstandingData.value = response.data.data || []
    } catch (err) { console.error(err) }
}

const openReturnModal = (item: any, project: any) => {
    quickReturnForm.value = {
        material_id: item.material_id,
        project_id: project.project_id, // Match the API requirement
        quantity: item.balance,
        material_name: item.material_name,
        project_code: project.project_code,
        usage_type: 'reusable',
        notes: `Quick return from Project Stock report: ${project.project_code}`
    }
    showReturnModal.value = true
}

const submitQuickReturn = async () => {
    quickReturnSubmitting.value = true
    try {
        await api.post('/api/procurement-stores/returns', { ...quickReturnForm.value })
        showReturnModal.value = false
        await fetchOutstanding()
        await fetchLogs()
        await fetchInventory()
    } catch (err: any) { alert('Quick return failed. Check quantity.') }
    finally { quickReturnSubmitting.value = false }
}

const lowStockCount = computed(() => inventory.value.filter(i => i.available <= i.min_stock_level).length)
const totalValuation = computed(() => inventory.value.reduce((acc, curr) => acc + (curr.available * curr.unit_cost), 0))

const filteredLogs = computed(() => {
    return logs.value.filter(l => {
        const query = searchQuery.value.toLowerCase()
        const matchSearch = String(l.batch_number).toLowerCase().includes(query) || 
                          String(l.material?.material_name).toLowerCase().includes(query) ||
                          String(l.project?.project_id || '').toLowerCase().includes(query)
        
        const matchType = !typeFilter.value || l.type === typeFilter.value
        
        let matchDate = true
        if (startDate.value) {
            matchDate = matchDate && new Date(l.created_at) >= new Date(startDate.value + 'T00:00:00')
        }
        if (endDate.value) {
            matchDate = matchDate && new Date(l.created_at) <= new Date(endDate.value + 'T23:59:59')
        }

        return matchSearch && matchType && matchDate
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

const exportToPDF = async () => {
    try {
        const params = {
            search: searchQuery.value,
            type: typeFilter.value,
            start_date: startDate.value,
            end_date: endDate.value
        }
        
        const response = await api.get('/api/procurement-stores/inventory-logs/pdf', {
            params,
            responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        const timestamp = new Date().toISOString().split('T')[0]
        link.setAttribute('download', `inventory-logs-${timestamp}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (err) {
        console.error('Failed to export PDF:', err)
    }
}

const exportToCSV = () => {
  const headers = ['Ref', 'Type', 'Material', 'Qty', 'Unit', 'Project Code', 'Project Name', 'Staff', 'Date']
  const rows = filteredLogs.value.map(l => [
      l.batch_number, 
      l.type, 
      l.material?.material_name, 
      l.quantity, 
      l.material?.unit_of_measure, 
      l.project?.project_id || 'STORES', 
      l.project?.enquiry?.title || 'N/A',
      l.user?.name || 'SYSTEM',
      formatDateTime(l.created_at)
  ])

  // Helper to escape CSV fields
  const escapeCSV = (val: any) => {
    const str = String(val ?? '');
    return `"${str.replace(/"/g, '""')}"`;
  }

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  const timestamp = new Date().toISOString().split('T')[0]
  a.href = url; a.download = `inventory-report-${timestamp}.csv`; a.click()
}

onMounted(() => { 
    fetchInventory()
    fetchLogs()
    fetchOutstanding()
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
