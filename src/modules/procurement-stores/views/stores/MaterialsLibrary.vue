<template>
  <div class="p-8 space-y-8">
    <!-- Premium Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Inventory List
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">View and manage stock levels for all materials.</p>
      </div>
      
      <div class="flex flex-wrap gap-4">
        <button @click="handleFilterChange" class="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all group">
          <i class="mdi mdi-refresh text-xl text-slate-500 group-hover:rotate-180 transition-transform duration-500" :class="{ 'animate-spin': loading }"></i>
        </button>
        <button @click="router.push('/stores/batch-check-in')" class="flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transition-all font-bold text-sm group">
          <i class="mdi mdi-layers-plus text-xl transition-transform group-hover:scale-110"></i>
          BATCH INTAKE
        </button>
        <button @click="router.push('/stores/batch-check-out')" class="flex items-center gap-2 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20 transition-all font-bold text-sm group">
          <i class="mdi mdi-layers-minus text-xl transition-transform group-hover:scale-110"></i>
          BATCH ISSUANCE
        </button>
        <button @click="showForm = true" class="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-bold text-sm group">
          <i class="mdi mdi-plus-circle-outline text-xl transition-transform group-hover:rotate-90"></i>
          ADD NEW MATERIAL
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <i :class="['mdi', stat.icon, 'text-6xl']"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{{ stat.label }}</p>
        <h3 class="text-3xl font-black text-slate-900 dark:text-white">{{ stat.value }}</h3>
        <div class="mt-4 flex items-center gap-2">
          <span :class="['text-[10px] font-bold px-2 py-1 rounded-lg', stat.trendClass]">{{ stat.trend }}</span>
        </div>
      </div>
    </div>

    <!-- Dynamic Filters -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div class="lg:col-span-1">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Workstation</label>
        <div class="relative">
          <select 
            v-model="filters.workstation_id"
            @change="handleFilterChange"
            class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option :value="null">All Workstations</option>
            <option v-for="ws in workstations" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
          </select>
          <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            <i class="mdi mdi-chevron-down text-lg"></i>
          </div>
        </div>
      </div>
      
      <div class="lg:col-span-3">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search Materials & Categories</label>
        <SearchFilters 
          v-model:search="filters.search"
          v-model:category="filters.category"
          @filter="handleFilterChange" 
        />
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[500px]">
        <!-- Reuse the Master Table -->
        <div class="p-4">
            <MaterialsTable 
                :materials="inventory" 
                :loading="loading"
                :canDelete="isSuperAdmin"
                @view="handleView"
                @edit="handleEdit"
                @checkIn="handleCheckIn"
                @delete="handleDelete"
            />
        </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <MaterialDetailsModal
        v-if="showDetails && selectedMaterial"
        :material="selectedMaterial"
        @close="showDetails = false"
      />
    </Teleport>

    <Teleport to="body">
      <MaterialFormModal
        v-if="showForm"
        :material="editingMaterial"
        @close="showForm = false"
        @saved="handleSaved"
      />
    </Teleport>

    <Teleport to="body">
      <QuickCheckInModal
        v-if="showCheckIn && checkInMaterial"
        :material="checkInMaterial"
        @close="showCheckIn = false"
        @success="handleCheckInSuccess"
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
import { useMaterials } from '@/modules/materials-library/composables/useMaterials'
import MaterialsTable from '@/modules/materials-library/components/MaterialsTable.vue'
import SearchFilters from '@/modules/materials-library/components/SearchFilters.vue'
import MaterialDetailsModal from '@/modules/materials-library/components/MaterialDetailsModal.vue'
import MaterialFormModal from '@/modules/materials-library/components/MaterialForm/MaterialFormModal.vue'
import QuickCheckInModal from '../../components/QuickCheckInModal.vue'

const router = useRouter()
const { user } = useAuth()
const { inventory, loading, fetchInventory } = useInventory()
const { workstations, fetchWorkstations } = useWorkstations()
const { deleteMaterial } = useMaterials()

const isSuperAdmin = computed(() => user.value?.roles?.includes('Super Admin') || false)

const filters = reactive({
    search: '',
    workstation_id: null as number | null,
    category: ''
})

const showDetails = ref(false)
const showForm = ref(false)
const showCheckIn = ref(false)
const selectedMaterial = ref<any>(null)
const editingMaterial = ref<any>(null)
const checkInMaterial = ref<any>(null)

const handleFilterChange = () => {
    fetchInventory(filters)
}

const handleView = (item: any) => {
    selectedMaterial.value = item
    showDetails.value = true
}

const handleEdit = (item: any) => {
    editingMaterial.value = item
    showForm.value = true
}

const handleCheckIn = (item: any) => {
    checkInMaterial.value = item
    showCheckIn.value = true
}

const handleCheckInSuccess = () => {
    showCheckIn.value = false
    checkInMaterial.value = null
    fetchInventory(filters)
}

const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this material? It will be moved to trash.')) {
        try {
            await deleteMaterial(id)
            await fetchInventory(filters)
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }
}

const handleSaved = () => {
    showForm.value = false
    editingMaterial.value = null
    fetchInventory(filters)
}

const stats = computed(() => {
  const totalSKUs = inventory.value.length
  const itemsInStock = inventory.value.filter(i => i.quantity_on_hand > 0).length
  const totalValue = inventory.value.reduce((acc, i) => acc + (i.quantity_on_hand * i.unit_cost), 0)
  const lowStock = inventory.value.filter(i => i.quantity_on_hand <= i.min_stock_level && i.min_stock_level > 0).length
  const totalReserved = inventory.value.reduce((acc, i) => acc + i.quantity_reserved, 0)

  return [
    { 
      label: 'Inventory SKUs', 
      value: totalSKUs, 
      trend: `${itemsInStock} Items Physically in Stock`, 
      trendClass: 'bg-emerald-100 text-emerald-600', 
      icon: 'mdi-package-variant-closed' 
    },
    { 
      label: 'Inventory Value', 
      value: formatCurrency(totalValue), 
      trend: 'Current Assets', 
      trendClass: 'bg-blue-100 text-blue-600', 
      icon: 'mdi-currency-usd' 
    },
    { 
      label: 'Low Stock Alerts', 
      value: lowStock, 
      trend: lowStock > 0 ? 'Restock Needed' : 'Stock Optimal', 
      trendClass: lowStock > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600', 
      icon: 'mdi-alert-octagon' 
    },
    { 
      label: 'Reservations', 
      value: totalReserved, 
      trend: 'Project Allocated', 
      trendClass: 'bg-amber-100 text-amber-600', 
      icon: 'mdi-calendar-check' 
    }
  ]
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(value)
}

onMounted(() => {
  fetchInventory()
  fetchWorkstations()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 10px;
}
</style>
