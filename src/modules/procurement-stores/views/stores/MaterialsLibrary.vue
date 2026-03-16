<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Inventory Catalog
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and monitor all company materials and stock levels.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="handleFilterChange" class="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-400 dark:text-slate-500">
          <i class="mdi mdi-refresh text-xl" :class="{ 'animate-spin': loading }"></i>
        </button>
        <button @click="showForm = true" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 dark:shadow-blue-900/40">
          <i class="mdi mdi-plus text-lg"></i>
          Register Item
        </button>
      </div>
    </div>

    <!-- Discovery Layout -->
    <div class="grid grid-cols-12 gap-6">
      
      <!-- Left: Filters -->
      <div class="col-span-12 lg:col-span-3 space-y-6">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">Search & Filter</h3>
          
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Global Search</label>
              <div class="relative">
                <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                <input 
                  v-model="filters.search" 
                  @input="handleFilterChange"
                  type="text" 
                  placeholder="ID or Name..."
                  class="w-full pl-11 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all placeholder:font-sans"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Location</label>
              <div class="relative">
                <select 
                  v-model="filters.workstation_id"
                  @change="handleFilterChange"
                  class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer focus:ring-0 transition-all font-mono"
                >
                  <option :value="null">All Warehouses</option>
                  <option v-for="ws in workstations" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
                </select>
                <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Mini Stats -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl space-y-6">
            <div v-for="stat in stats.slice(0, 3)" :key="stat.label">
              <div class="flex justify-between items-end mb-2">
                <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ stat.label }}</p>
                <span class="text-xs font-bold text-slate-900 dark:text-white">{{ stat.value }}</span>
              </div>
              <div class="h-1.5 bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                 <div class="h-full bg-blue-500 transition-all duration-1000" :style="{ width: '70%' }"></div>
              </div>
            </div>
        </div>
      </div>

      <!-- Center: Discovery Grid/Table -->
      <div class="col-span-12 lg:col-span-6 space-y-6">
        <div class="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm dark:shadow-xl px-6">
          <div class="flex gap-2">
            <button @click="viewMode = 'grid'" :class="['px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all', viewMode==='grid' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white']">Grid</button>
            <button @click="viewMode = 'table'" :class="['px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all', viewMode==='table' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white']">Table</button>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ inventory.length }} Records Found</span>
        </div>

        <div class="min-h-[500px]">
          <div v-if="loading" class="py-20 flex flex-col items-center justify-center opacity-40">
            <i class="mdi mdi-loading mdi-spin text-4xl text-blue-500 mb-4"></i>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Accessing records...</p>
          </div>
          
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="item in inventory" :key="item.id" 
                 @click="handleView(item)"
                 :class="['group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 p-5 rounded-xl transition-all cursor-pointer shadow-sm dark:shadow-xl', selectedMaterial?.id === item.id ? 'ring-2 ring-blue-500' : '']">
              
              <div class="flex justify-between items-start mb-4">
                 <span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-100 dark:border-slate-700 uppercase tracking-widest font-mono">{{ item.material_code }}</span>
                 <i :class="['mdi text-xl', item.available <= item.min_stock_level ? 'text-rose-500 mdi-alert-circle' : 'text-emerald-500 mdi-check-circle']"></i>
              </div>

              <h4 class="text-sm font-bold text-slate-900 dark:text-white uppercase truncate mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ item.material_name }}</h4>
              <p class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-4">{{ item.category || 'Standard' }}</p>

              <div class="flex justify-between items-end border-t border-slate-50 dark:border-slate-700/50 pt-4">
                <div>
                   <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Available</p>
                   <p class="text-xl font-bold text-slate-900 dark:text-white tracking-tighter">{{ item.available }} <span class="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{{ item.unit_of_measure }}</span></p>
                </div>
                <div class="flex gap-2">
                   <button @click.stop="handleEdit(item)" class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">
                     <i class="mdi mdi-pencil-outline"></i>
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl">
             <table class="w-full text-left">
                <thead>
                   <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                      <th class="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">Material</th>
                      <th class="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-right">Stock</th>
                      <th class="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                   <tr v-for="item in inventory" :key="item.id" @click="handleView(item)" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                      <td class="px-6 py-4">
                         <p class="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5 font-mono">{{ item.material_code }}</p>
                         <p class="text-xs font-bold text-slate-900 dark:text-white uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ item.material_name }}</p>
                      </td>
                      <td class="px-6 py-4 text-right">
                         <p class="text-xs font-bold text-slate-900 dark:text-white">{{ item.available }}</p>
                         <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{ item.unit_of_measure }}</p>
                      </td>
                      <td class="px-6 py-4 text-right">
                         <button @click.stop="handleUpdateStockSettings(item)" class="text-[9px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors">Config</button>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>

      <!-- Right: Intelligence -->
      <div class="col-span-12 lg:col-span-3">
        <div v-if="selectedMaterial" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 sticky top-8 shadow-sm dark:shadow-xl space-y-8 animate-fade-in transition-all">
           <div class="flex items-center justify-between">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Material Intel</h4>
              <button @click="selectedMaterial = null" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                 <i class="mdi mdi-close"></i>
              </button>
           </div>

           <div class="text-center pb-6 border-b border-slate-100 dark:border-slate-700">
              <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-4xl text-blue-600 dark:text-blue-500 mx-auto mb-4 font-sans">
                 <i class="mdi mdi-package-variant-closed"></i>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white uppercase truncate">{{ selectedMaterial.material_name }}</h3>
              <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 font-mono">{{ selectedMaterial.material_code }}</p>
           </div>

           <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                 <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">On Hand</p>
                 <p class="text-lg font-bold text-slate-900 dark:text-white">{{ selectedMaterial.quantity_on_hand }}</p>
              </div>
              <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                 <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Reserved</p>
                 <p class="text-lg font-bold text-amber-600 dark:text-amber-500">{{ selectedMaterial.quantity_reserved }}</p>
              </div>
           </div>

           <div class="space-y-3">
              <button @click="handleCheckIn(selectedMaterial)" class="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-white shadow-sm hover:shadow-md">
                 <span>Restock Item</span>
                 <i class="mdi mdi-plus-circle text-blue-600 dark:text-blue-500"></i>
              </button>
              <button @click="handleMarkDefective(selectedMaterial)" class="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-white shadow-sm hover:shadow-md">
                 <span>Defective Log</span>
                 <i class="mdi mdi-alert-circle text-rose-600 dark:text-rose-500"></i>
              </button>
           </div>
           
           <div class="pt-6 border-t border-slate-100 dark:border-slate-700">
              <div class="flex justify-between items-center px-1">
                 <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Unit Valuation</span>
                 <span class="text-sm font-bold text-emerald-600 dark:text-emerald-500">{{ formatCurrency(selectedMaterial.unit_cost) }}</span>
              </div>
           </div>
        </div>

        <div v-else class="h-64 border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center text-center p-8 opacity-30">
           <i class="mdi mdi-cube-scan text-4xl mb-4 text-slate-400 dark:text-slate-500"></i>
           <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Select an item to view insights</p>
        </div>
      </div>

    </div>

    <!-- Modals -->
    <Teleport to="body">
      <MaterialFormModal
        v-if="showForm"
        :material="editingMaterial"
        @close="showForm = false"
        @saved="handleSaved"
      />
      <QuickCheckInModal
        v-if="showCheckIn && checkInMaterial"
        :material="checkInMaterial"
        @close="showCheckIn = false"
        @success="handleCheckInSuccess"
      />
      <StockSettingsModal
        v-if="showSettings && settingsMaterial"
        :material="settingsMaterial"
        @close="showSettings = false"
        @success="handleSettingsSuccess"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useInventory } from '../../composables/useInventory'
import { useWorkstations } from '@/modules/materials-library/composables/useWorkstations'
import MaterialFormModal from '@/modules/materials-library/components/MaterialForm/MaterialFormModal.vue'
import QuickCheckInModal from '../../components/QuickCheckInModal.vue'
import StockSettingsModal from '../../components/StockSettingsModal.vue'

const router = useRouter()
const { user } = useAuth()
const { inventory, loading, fetchInventory } = useInventory()
const { workstations, fetchWorkstations } = useWorkstations()

const filters = reactive({ search: '', workstation_id: null as number | null, category: '' })
const viewMode = ref('grid')
const showForm = ref(false)
const showCheckIn = ref(false)
const showSettings = ref(false)
const selectedMaterial = ref<any>(null)
const editingMaterial = ref<any>(null)
const checkInMaterial = ref<any>(null)
const settingsMaterial = ref<any>(null)

const handleFilterChange = () => fetchInventory(filters)
const handleView = (item: any) => selectedMaterial.value = item
const handleEdit = (item: any) => { editingMaterial.value = item; showForm.value = true }
const handleCheckIn = (item: any) => { checkInMaterial.value = item; showCheckIn.value = true }
const handleMarkDefective = (item: any) => { router.push({ path: '/stores/defective', query: { material_id: item.id } }) }
const handleUpdateStockSettings = (item: any) => { settingsMaterial.value = item; showSettings.value = true }
const handleSettingsSuccess = () => { showSettings.value = false; settingsMaterial.value = null; fetchInventory(filters) }
const handleCheckInSuccess = () => { showCheckIn.value = false; checkInMaterial.value = null; fetchInventory(filters) }
const handleSaved = () => { showForm.value = false; editingMaterial.value = null; fetchInventory(filters) }

const stats = computed(() => {
  const totalSKUs = inventory.value.length
  const itemsInStock = inventory.value.filter(i => i.quantity_on_hand > 0).length
  const totalValue = inventory.value.reduce((acc, i) => acc + (i.quantity_on_hand * (i.unit_cost || 0)), 0)
  const lowStock = inventory.value.filter(i => i.quantity_on_hand <= i.min_stock_level && i.min_stock_level > 0).length

  return [
    { label: 'Total Items', value: totalSKUs },
    { label: 'Store Value', value: formatCurrency(totalValue) },
    { label: 'Low Stock', value: lowStock }
  ]
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val)
}

onMounted(() => { fetchInventory(); fetchWorkstations() })
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
