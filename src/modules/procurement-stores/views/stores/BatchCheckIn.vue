<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Batch Check-In
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Receive multiple items into inventory at once.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="$router.push('/stores/check-in')" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
          <i class="mdi mdi-arrow-left text-lg"></i>
          Single Check-In
        </button>
        <button @click="addRow" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/20 dark:shadow-emerald-900/20">
          <i class="mdi mdi-plus text-lg"></i>
          Add Row
        </button>
      </div>
    </div>

    <!-- Main Container -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl flex flex-col min-h-[500px]">
      <div class="flex-1 overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/3">Item Search</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-32">Quantity</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-40">Location</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-40">LPO / Ref No.</th>
              <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notes</th>
              <th class="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-sans">
            <tr v-for="(row, index) in rows" :key="index" class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              
              <!-- Search Cell -->
              <td class="px-6 py-4">
                <div class="relative" :ref="el => { if (el) rowRefs[index] = el }">
                  <div class="relative">
                    <i v-if="searchingRow === index" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 text-lg"></i>
                    <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                    <input 
                      v-model="row.search"
                      type="text"
                      placeholder="Search items..."
                      @input="onSearchInput(index)"
                      @focus="openResults(index)"
                      class="w-full pl-11 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500/50 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                    />
                    <div v-if="row.material_id" class="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                      <i class="mdi mdi-check-circle text-lg"></i>
                    </div>
                  </div>

                  <!-- Dropdown Search Results -->
                  <div v-if="row.showResults" 
                       class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-2xl z-[50] max-h-[300px] overflow-y-auto p-1 space-y-1 transition-all duration-200">
                    
                    <div v-if="searchingRow === index" class="p-8 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                      <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </div>

                    <div v-else-if="inventory.length > 0">
                      <div v-for="item in inventory" :key="item.id"
                          @click="selectMaterial(index, item)"
                          class="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer rounded-lg transition-all flex items-center justify-between group/item"
                      >
                        <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-900 dark:text-white capitalize group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400">{{ item.material_name }}</span>
                          <span class="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{{ item.material_code }}</span>
                        </div>
                        <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                          {{ item.quantity_on_hand }} {{ item.unit_of_measure }}
                        </span>
                      </div>
                    </div>

                    <div v-else class="p-10 text-center text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                      No Results Found
                    </div>
                  </div>
                </div>
              </td>

              <!-- Quantity Cell -->
              <td class="px-6 py-4">
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model.number="row.quantity"
                      placeholder="0.00"
                      class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500/50 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all text-center"
                    />
                    <div v-if="row.unit" class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {{ row.unit }}
                    </div>
                  </div>
              </td>

              <!-- Location Cell -->
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.location"
                  placeholder="Shelf/Bin"
                  class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500/50 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                />
              </td>

              <!-- Reference Cell -->
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.reference_no"
                  placeholder="Ref No."
                  class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500/50 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                />
              </td>

              <!-- Narrative Cell -->
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.notes"
                  placeholder="Notes..."
                  class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500/50 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 focus:ring-0 transition-all font-sans"
                />
              </td>

              <!-- Action Cell -->
              <td class="px-4 py-4 text-center">
                <button 
                  @click="removeRow(index)" 
                  class="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 flex items-center justify-center hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm dark:shadow-none"
                  title="Remove Row"
                >
                  <i class="mdi mdi-delete-outline text-xl"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Actions -->
      <div class="px-8 py-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-8 font-sans">
           <div class="flex flex-col">
              <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Rows</span>
              <span class="text-xl font-bold text-slate-900 dark:text-white">{{ rows.length }}</span>
           </div>
           
           <div class="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
           
           <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', isValid ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40' : 'bg-slate-200 dark:bg-slate-700']"></div>
              <span class="text-[10px] font-bold uppercase tracking-wider" :class="isValid ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                {{ isValid ? 'Ready to Save' : 'Fill required fields' }}
              </span>
           </div>
        </div>

        <button 
          @click="submitBatch"
          :disabled="submitting || rows.length === 0 || !isValid"
          class="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 min-w-[200px]"
        >
          <i v-if="submitting" class="mdi mdi-loading mdi-spin text-xl"></i>
          <i v-else class="mdi mdi-check-all text-xl"></i>
          {{ submitting ? 'Saving...' : 'Confirm Batch Check-In' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const router = useRouter()
const { inventory, fetchInventory } = useInventory()

const rows = ref([
  { material_id: '', quantity: null as number | null, location: '', reference_no: '', notes: 'Batch received', type: 'check_in', search: '', showResults: false, current_stock: undefined as number | undefined, unit: '' }
])

const submitting = ref(false)
const searchingRow = ref<number | null>(null)
let searchTimeout: any = null
const rowRefs = ref<any[]>([])

const addRow = () => {
  rows.value.push({ material_id: '', quantity: null, location: '', reference_no: '', notes: 'Batch received', type: 'check_in', search: '', showResults: false, current_stock: undefined, unit: '' })
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

const openResults = (index: number) => {
  rows.value.forEach((r, i) => r.showResults = i === index)
  if (rows.value[index].search) onSearchInput(index)
}

const selectMaterial = (index: number, item: any) => {
  const row = rows.value[index]
  row.material_id = item.id
  row.search = item.material_name
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

const closeResults = (e: MouseEvent) => {
  rows.value.forEach((row, index) => {
    const el = rowRefs.value[index]
    if (el && !el.contains(e.target as Node)) {
      row.showResults = false
    }
  })
}

onMounted(() => {
  document.addEventListener('click', closeResults)
})

onUnmounted(() => {
  document.removeEventListener('click', closeResults)
})

const isValid = computed(() => {
  return rows.value.length > 0 && rows.value.every(row => row.material_id && row.quantity && row.quantity > 0)
})

const submitBatch = async () => {
  submitting.value = true
  try {
    const response = await api.post('/api/procurement-stores/batch-check-in', {
      items: rows.value.map(row => ({
        material_id: row.material_id,
        quantity: row.quantity,
        location: row.location,
        reference_no: row.reference_no,
        notes: row.notes || 'Batch receipt',
        warehouse_code: 'MAIN'
      }))
    })
    
    alert(`Batch successfully received. Batch ID: ${response.data.batch_number}`)
    router.push('/stores/dashboard')
  } catch (err: any) {
    console.error('Batch processing failed:', err)
    alert('An error occurred while processing the batch. Please check your inputs.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
