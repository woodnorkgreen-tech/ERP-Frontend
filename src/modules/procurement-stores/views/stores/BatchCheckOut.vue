<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Batch <span class="text-rose-500 text-3xl opacity-50">/</span> Issue Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Bulk material requisition and issuance.</p>
      </div>
      <div class="flex gap-4">
        <button @click="$router.push('/stores/check-out')" class="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest">
          <i class="mdi mdi-checkbox-blank-circle-outline text-lg"></i>
          SINGLE ITEM MODE
        </button>
        <button @click="addRow" class="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl shadow-lg transition-all font-bold text-sm">
          <i class="mdi mdi-plus-circle text-xl"></i>
          ADD LINE ITEM
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Project Selection -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Assign to Project</label>
          <div class="relative group">
            <i class="mdi mdi-briefcase-outline absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-rose-500 transition-colors"></i>
            <select 
              v-model="batchProject"
              class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Project...</option>
              <option v-for="project in relevantProjects" :key="project.id" :value="project.id">
                {{ project.project_id }} - {{ project.enquiry?.title }}
              </option>
            </select>
            <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <i class="mdi mdi-chevron-down text-slate-400 text-xl"></i>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 font-medium leading-relaxed italic">
            This project will be linked to all materials issued in this batch.
          </p>
        </div>
      </div>

      <!-- Table Section -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div class="overflow-visible">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50">
                  <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material</th>
                  <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Quantity</th>
                  <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Requestor</th>
                  <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Ref / LPO</th>
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
                        <i v-if="searchingRow === index" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 text-sm"></i>
                        <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input 
                          v-model="row.search"
                          type="text"
                          placeholder="Search material..."
                          @input="onSearchInput(index)"
                          @focus="openResults(index)"
                          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                        />
                        <!-- Selection Indicator -->
                        <div v-if="row.material_id" class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/10 text-rose-600 rounded-md border border-rose-500/20">
                          <i class="mdi mdi-check-circle text-[10px]"></i>
                        </div>
                      </div>

                      <!-- Floating Results -->
                      <div v-if="row.showResults" 
                           class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] z-[500] max-h-[350px] overflow-y-auto ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                        
                        <div v-if="searchingRow === index" class="p-4 flex flex-col items-center justify-center text-slate-400">
                          <div class="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span class="text-[8px] font-black uppercase">Scanning...</span>
                        </div>

                        <ul v-else-if="inventory.length > 0" class="p-1.5">
                          <li v-for="item in inventory" :key="item.id"
                              @click="selectMaterial(index, item)"
                              class="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer rounded-xl transition-all border border-transparent hover:border-rose-500/20 group flex items-center justify-between"
                          >
                            <div class="flex items-center gap-2">
                              <div class="flex flex-col">
                                <span class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600">{{ item.material_name }}</span>
                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ item.material_code }}</span>
                              </div>
                            </div>
                            <span class="text-[8px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {{ item.available }} {{ item.unit_of_measure }}
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
                        class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all"
                      />
                      <div v-if="row.available_stock !== undefined" class="flex justify-between items-center px-1">
                        <span class="text-[9px] font-black uppercase tracking-tighter" :class="(row.quantity ?? 0) > (row.available_stock ?? 0) ? 'text-rose-500 animate-pulse' : 'text-slate-400'">
                          In Stock: {{ row.available_stock }} {{ row.unit }}
                        </span>
                        <i v-if="(row.quantity ?? 0) > (row.available_stock ?? 0)" class="mdi mdi-alert-circle text-rose-500 text-[10px]"></i>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <input 
                      type="text" 
                      v-model="row.requestor"
                      placeholder="Technician"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <input 
                      type="text" 
                      v-model="row.reference_no"
                      placeholder="LPO #"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all"
                    />
                  </td>
                  <td class="px-4 py-4 text-center">
                    <button 
                      @click="removeRow(index)" 
                      class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
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
              :disabled="submitting || rows.length === 0 || !isValid || !batchProject"
              class="px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-2xl shadow-xl shadow-rose-500/20 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-3 group"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <i v-else class="mdi mdi-truck-fast-outline text-xl"></i>
              {{ submitting ? 'Processing...' : 'Post Batch Issuance' }}
            </button>
          </div>
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
const projects = ref<any[]>([])
const batchProject = ref('')

const rows = ref([
  { material_id: '', quantity: null as number | null, requestor: '', reference_no: '', notes: 'Batch check-out', type: 'check_out', search: '', showResults: false, available_stock: undefined as number | undefined, unit: '' }
])

const submitting = ref(false)
const searchingRow = ref<number | null>(null)
let searchTimeout: any = null
const rowRefs = ref<any[]>([])

const addRow = () => {
  rows.value.push({ material_id: '', quantity: null, requestor: '', reference_no: '', notes: 'Batch check-out', type: 'check_out', search: '', showResults: false, available_stock: undefined, unit: '' })
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
  row.search = item.material_name
  row.showResults = false
  row.available_stock = item.available
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

const fetchProjects = async () => {
    try {
        const response = await api.get('/api/projects')
        projects.value = response.data.data.data || response.data.data || []
    } catch (err) {
        console.error('Failed to fetch projects:', err)
    }
}

const relevantProjects = computed(() => {
    return projects.value.filter(p => 
        p.project_id?.startsWith('WNG')
    )
})

const isValid = computed(() => {
  return rows.value.every(row => row.material_id && row.quantity && row.quantity > 0)
})

const submitBatch = async () => {
  submitting.value = true
  try {
    // Use the new batch-check-out endpoint with unified batch number
    const response = await api.post('/api/procurement-stores/batch-check-out', {
      items: rows.value.map(row => ({
        material_id: row.material_id,
        quantity: row.quantity,
        requestor: row.requestor,
        reference_no: row.reference_no,
        notes: row.notes || 'Batch check-out'
      })),
      project_id: batchProject.value,
      warehouse_code: 'MAIN'
    })
    
    const batchNumber = response.data.batch_number
    alert(`✅ Batch issuance processed successfully!\n\nBatch Number: ${batchNumber}\nItems Processed: ${rows.value.length}`)
    router.push('/stores/materials-library')
  } catch (err: any) {
    console.error('Batch processing failed:', err)
    const errorMsg = err.response?.data?.message || 'Failed to process batch. Check available stock.'
    alert(`❌ ${errorMsg}`)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
  fetchProjects()
})
</script>
