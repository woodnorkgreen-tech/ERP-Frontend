<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Batch Check-Out
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Issue multiple items to a project at once.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="$router.push('/stores/check-out')" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
          <i class="mdi mdi-arrow-left text-lg"></i>
          Single Check-Out
        </button>
        <button @click="addRow" class="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/20 dark:shadow-rose-900/20">
          <i class="mdi mdi-plus text-lg"></i>
          Add Row
        </button>
      </div>
    </div>

    <!-- Main Container -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Left: Project Selection -->
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 font-sans">Dispatch Destination</h3>
          
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Target Project</label>
              <div class="relative group" ref="projectSearchContainer">
                <i class="mdi mdi-briefcase-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg z-10"></i>
                <input 
                  v-model="projectSearchQuery"
                  type="text"
                  placeholder="Search Project Code or Name..."
                  @focus="showProjectResults = true"
                  class="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                />
                <div v-if="showProjectResults && filteredProjects.length > 0" 
                     class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-[60] max-h-[250px] overflow-y-auto animate-in zoom-in-95 duration-200">
                   <div v-for="p in filteredProjects" :key="p.id" 
                        @click="selectProject(p)"
                        class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 group transition-colors">
                      <div class="flex justify-between items-center text-left">
                         <div>
                            <p class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 uppercase font-mono">{{ p.project_id }}</p>
                            <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase truncate max-w-[200px]">{{ p.enquiry?.title }}</p>
                         </div>
                         <i class="mdi mdi-link-variant text-slate-300 group-hover:text-rose-500 transition-colors"></i>
                      </div>
                   </div>
                </div>
                <i class="mdi mdi-magnify absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Requestor Name</label>
              <div class="relative">
                <i class="mdi mdi-account-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                <input 
                  v-model="batchRequestor"
                  type="text" 
                  placeholder="Person receiving items"
                  class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Reference No.</label>
              <div class="relative">
                <i class="mdi mdi-file-document-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                <input 
                  v-model="batchReference"
                  type="text" 
                  placeholder="e.g. Req-001"
                  class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-600 rounded-xl p-6 text-white shadow-xl shadow-blue-600/20 dark:shadow-blue-900/20">
          <div class="flex items-start gap-4">
             <i class="mdi mdi-information-outline text-2xl"></i>
             <div>
                <h4 class="text-sm font-bold uppercase tracking-wider mb-1 text-white font-sans">Stock Availability</h4>
                <p class="text-xs text-blue-100 leading-relaxed font-sans">System will automatically check if requested quantities are available in terminal stock before commitment.</p>
             </div>
          </div>
        </div>
      </div>

      <!-- Right: Items Table -->
      <div class="col-span-12 lg:col-span-8">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl flex flex-col min-h-[500px]">
          <div class="flex-1 overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item Search</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-40">Usage Type</th>
                  <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-32">Quantity</th>
                  <th class="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-16"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr v-for="(row, index) in rows" :key="index" class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td class="px-6 py-4">
                    <div class="relative" :ref="el => { if (el) rowRefs[index] = el }">
                      <div class="relative">
                        <i v-if="searchingRow === index" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 text-lg"></i>
                        <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                        <input 
                          v-model="row.search"
                          type="text"
                          placeholder="Search items..."
                          @input="onSearchInput(index)"
                          @focus="openResults(index)"
                          class="w-full pl-11 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-0 transition-all font-bold placeholder:font-sans"
                        />
                        <div v-if="row.material_id" class="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                          <i class="mdi mdi-check-circle text-lg"></i>
                        </div>
                      </div>
 
                      <!-- Search Dropdown -->
                      <div v-if="row.showResults" 
                           class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl dark:shadow-2xl z-[50] max-h-[250px] overflow-y-auto p-1 space-y-1">
                        <div v-if="inventory.length > 0">
                           <div v-for="item in inventory" :key="item.id"
                               @click="selectMaterial(index, item)"
                               class="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer rounded transition-all flex items-center justify-between group/item"
                           >
                             <div class="flex flex-col">
                               <span class="text-xs font-bold text-slate-900 dark:text-white uppercase group-hover/item:text-rose-600 dark:group-hover/item:text-rose-400">{{ item.material_name }}</span>
                               <span class="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{{ item.material_code }}</span>
                             </div>
                             <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                               {{ item.quantity_on_hand }} {{ item.unit_of_measure }}
                             </span>
                           </div>
                        </div>
                        <div v-else class="p-6 text-center text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest">No Results found</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                      <select 
                        v-model="row.usage_type"
                        class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 appearance-none focus:ring-0 transition-all"
                      >
                        <option value="consumable">Consumable</option>
                        <option value="reusable">Reusable</option>
                      </select>
                  </td>
                  <td class="px-6 py-4">
                      <div class="relative">
                        <input 
                          type="number" 
                          v-model.number="row.quantity"
                          placeholder="0.00"
                          class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500/50 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all text-center"
                        />
                        <div v-if="row.unit" class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {{ row.unit }}
                        </div>
                      </div>
                  </td>
                  <td class="px-4 py-4 text-center">
                    <button 
                      @click="removeRow(index)" 
                      class="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 flex items-center justify-center hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm dark:shadow-none"
                    >
                      <i class="mdi mdi-close text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-8 py-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <div class="flex items-center gap-6 font-sans">
                <div class="flex flex-col">
                   <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Selected Items</span>
                   <span class="text-xl font-bold text-slate-900 dark:text-white">{{ rows.length }}</span>
                </div>
                <div class="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                <div class="flex items-center gap-2">
                   <div :class="['w-2 h-2 rounded-full', isValid ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40' : 'bg-slate-200 dark:bg-slate-700']"></div>
                   <span class="text-[10px] font-bold uppercase tracking-wider" :class="isValid ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                     {{ isValid ? 'Verified' : 'Check Fields' }}
                   </span>
                </div>
             </div>

             <button 
               @click="submitBatch"
               :disabled="submitting || rows.length === 0 || !isValid"
               class="px-8 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-rose-600/20 dark:shadow-rose-900/20"
             >
               <i v-if="submitting" class="mdi mdi-loading mdi-spin text-xl"></i>
               <i v-else class="mdi mdi-truck-check text-xl"></i>
               {{ submitting ? 'Processing...' : 'Confirm Batch Issue' }}
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const router = useRouter()
const { inventory, fetchInventory } = useInventory()

const projects = ref<any[]>([])
const batchProject = ref('')
const batchRequestor = ref('')
const batchReference = ref('')

// Project Search State
const projectSearchQuery = ref('')
const showProjectResults = ref(false)
const projectSearchContainer = ref<HTMLElement | null>(null)
onClickOutside(projectSearchContainer, () => showProjectResults.value = false)

const selectProject = (prj: any) => {
  batchProject.value = prj.id
  projectSearchQuery.value = prj.project_id
  showProjectResults.value = false
}

const rows = ref([
  { material_id: '', quantity: null as number | null, search: '', showResults: false, unit: '', usage_type: 'consumable' }
])

const submitting = ref(false)
const searchingRow = ref<number | null>(null)
let searchTimeout: any = null
const rowRefs = ref<any[]>([])

const addRow = () => {
  rows.value.push({ material_id: '', quantity: null, search: '', showResults: false, unit: '', usage_type: 'consumable' })
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

const openResults = (index: number) => {
  rows.value.forEach((r, i) => r.showResults = i === index)
}

const selectMaterial = (index: number, item: any) => {
  const row = rows.value[index]
  row.material_id = item.id
  row.search = `${item.material_name} (${item.material_code})`
  row.showResults = false
  row.unit = item.unit_of_measure
  row.usage_type = item.material_type || 'consumable'
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

const fetchProjects = async () => {
    try {
        const response = await api.get('/api/projects')
        projects.value = (response.data.data.data || response.data.data || []).filter((p: any) => p.project_id?.startsWith('WNG'))
    } catch (err) {
        console.error('Failed to fetch projects:', err)
    }
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
  fetchInventory()
  fetchProjects()
  document.addEventListener('click', closeResults)
})

onUnmounted(() => {
  document.removeEventListener('click', closeResults)
})

const isValid = computed(() => {
  return batchProject.value && 
         batchRequestor.value && 
         rows.value.length > 0 && 
         rows.value.every(row => row.material_id && row.quantity && row.quantity > 0)
})

const filteredProjects = computed(() => {
  const query = projectSearchQuery.value.toLowerCase()
  return projects.value
    .filter(p => 
      p.project_id?.toLowerCase().includes(query) || 
      (p.enquiry?.title || '').toLowerCase().includes(query)
    )
    .sort((a, b) => b.id - a.id)
})

const submitBatch = async () => {
  submitting.value = true
  try {
    const response = await api.post('/api/procurement-stores/batch-check-out', {
      project_id: batchProject.value,
      requestor_name: batchRequestor.value,
      reference_no: batchReference.value,
      items: rows.value.map(row => ({
        material_id: row.material_id,
        quantity: row.quantity,
        usage_type: row.usage_type
      }))
    })
    
    alert(`Batch successfully issued. Batch ID: ${response.data.batch_number}`)
    router.push('/stores/dashboard')
  } catch (err: any) {
    console.error('Batch issue failed:', err)
    alert(err.response?.data?.message || 'Failed to process batch issue.')
  } finally {
    submitting.value = false
  }
}
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
