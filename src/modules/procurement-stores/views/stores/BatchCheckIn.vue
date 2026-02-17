<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Batch <span class="text-emerald-500 text-3xl opacity-50">/</span> Receive Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Bulk material receipt and stock addition.</p>
      </div>
      <div class="flex gap-4">
        <button @click="$router.push('/stores/check-in')" class="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest">
          <i class="mdi mdi-checkbox-blank-circle-outline text-lg"></i>
          SINGLE ITEM MODE
        </button>
        <button @click="addRow" class="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg transition-all font-bold text-sm">
          <i class="mdi mdi-plus-circle text-xl"></i>
          ADD LINE ITEM
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
      <div class="overflow-visible">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50">
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Quantity</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Location</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Ref / LPO</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notes</th>
              <th class="px-1 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(row, index) in rows" :key="index" 
                class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors relative"
                :style="{ zIndex: row.showResults ? 50 : 1 }">
              <td class="px-6 py-4">
                <div class="relative" :ref="el => { if (el) rowRefs[index] = el }">
                  <!-- Search Input -->
                  <div class="relative">
                    <i v-if="searchingRow === index" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 text-sm"></i>
                    <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input 
                      v-model="row.search"
                      type="text"
                      placeholder="Search material..."
                      @input="onSearchInput(index)"
                      @focus="openResults(index)"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                    />
                    <!-- Selection Indicator -->
                    <div v-if="row.material_id" class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md border border-emerald-500/20">
                      <i class="mdi mdi-check-circle text-[10px]"></i>
                    </div>
                  </div>

                  <!-- Floating Results -->
                  <div v-if="row.showResults" 
                       class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] z-[500] max-h-[300px] overflow-y-auto ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                    
                    <div v-if="searchingRow === index" class="p-4 flex flex-col items-center justify-center text-slate-400">
                      <div class="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span class="text-[8px] font-black uppercase">Searching...</span>
                    </div>

                    <ul v-else-if="inventory.length > 0" class="p-1.5">
                      <li v-for="item in inventory" :key="item.id"
                          @click="selectMaterial(index, item)"
                          class="p-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer rounded-xl transition-all border border-transparent hover:border-emerald-500/20 group flex items-center justify-between"
                      >
                        <div class="flex items-center gap-2">
                          <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">{{ item.material_name }}</span>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ item.material_code }}</span>
                          </div>
                        </div>
                        <span class="text-[8px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {{ item.quantity_on_hand }} {{ item.unit_of_measure }}
                        </span>
                      </li>
                    </ul>

                    <!-- No Results -->
                    <div v-else class="p-6 text-center text-slate-400">
                      <i class="mdi mdi-package-variant text-2xl mb-2 block opacity-20"></i>
                      <p class="text-[8px] font-black uppercase tracking-widest">No materials found</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                  <div class="space-y-1">
                    <input 
                      type="number" 
                      v-model.number="row.quantity"
                      placeholder="0.00"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                    />
                    <div v-if="row.current_stock !== undefined" class="flex justify-between items-center px-1">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        Current Stock: {{ row.current_stock }} {{ row.unit }}
                      </span>
                    </div>
                  </div>
              </td>
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.location"
                  placeholder="Bin / Shelf"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </td>
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.reference_no"
                  placeholder="LPO #"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </td>
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.notes"
                  placeholder="Optional notes..."
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </td>
              <td class="px-4 py-4 text-center">
                <button 
                  @click="removeRow(index)" 
                  class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <i class="mdi mdi-delete-outline text-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-8 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Lines: {{ rows.length }}</p>
        <button 
          @click="submitBatch"
          :disabled="submitting || rows.length === 0 || !isValid"
          class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-3 group"
        >
          <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <i v-else class="mdi mdi-check-all text-xl"></i>
          {{ submitting ? 'Processing...' : 'Post Batch Receipt' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const router = useRouter()
const { inventory, fetchInventory } = useInventory()

const rows = ref([
  { material_id: '', quantity: null as number | null, location: '', reference_no: '', notes: 'Batch check-in', type: 'check_in', search: '', showResults: false, current_stock: undefined as number | undefined, unit: '' }
])

const submitting = ref(false)
const searchingRow = ref<number | null>(null)
let searchTimeout: any = null
const rowRefs = ref<any[]>([])

const addRow = () => {
  rows.value.push({ material_id: '', quantity: null, location: '', reference_no: '', notes: 'Batch check-in', type: 'check_in', search: '', showResults: false, current_stock: undefined, unit: '' })
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

const openResults = (index: number) => {
  rows.value.forEach((r, i) => r.showResults = i === index)
  // Refresh inventory for this row's specific search term on focus
  onSearchInput(index)
}

const selectMaterial = (index: number, item: any) => {
  const row = rows.value[index]
  row.material_id = item.id
  row.search = item.material_name // Update search box with name
  row.showResults = false
  row.current_stock = item.quantity_on_hand
  row.unit = item.unit_of_measure
}

const onSearchInput = (index: number) => {
  const query = rows.value[index].search
  if (searchTimeout) clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(async () => {
    searchingRow.value = index
    try {
      await fetchInventory({ search: query })
    } finally {
      searchingRow.value = null
    }
  }, 300)
}

// Handle clicking outside for all rows
onMounted(() => {
  document.addEventListener('click', (e) => {
    rows.value.forEach((row, index) => {
      const el = rowRefs.value[index]
      if (el && !el.contains(e.target)) {
        row.showResults = false
      }
    })
  })
})

const isValid = computed(() => {
  return rows.value.every(row => row.material_id && row.quantity && row.quantity > 0)
})

const submitBatch = async () => {
  submitting.value = true
  try {
    // Attempt batch check-in
    const response = await api.post('/api/procurement-stores/batch-check-in', {
      items: rows.value.map(row => ({
        material_id: row.material_id,
        quantity: row.quantity,
        location: row.location,
        reference_no: row.reference_no,
        notes: row.notes || 'Batch check-in',
        warehouse_code: 'MAIN'
      }))
    })
    
    const batchNumber = response.data.batch_number
    alert(`✅ Batch receipt processed successfully!\n\nBatch Number: ${batchNumber}\nItems Processed: ${rows.value.length}`)
    router.push('/stores/materials-library')
  } catch (err: any) {
    console.error('Batch processing failed:', err)
    const errorMsg = err.response?.data?.message || 'Failed to process batch. Please check inputs.'
    alert(`❌ ${errorMsg}`)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>
