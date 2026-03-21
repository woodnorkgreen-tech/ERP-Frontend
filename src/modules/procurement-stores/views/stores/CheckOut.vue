<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Stock Check-Out
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Issue an individual item to a project.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="router.push('/stores/batch-check-out')" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
          <i class="mdi mdi-layers-minus text-lg"></i>
          Batch Mode
        </button>
      </div>
    </div>

    <!-- Stepper -->
    <div class="max-w-3xl mx-auto mb-10">
      <div class="flex items-center justify-center gap-4 px-4">
        <div v-for="step in 3" :key="step" class="flex items-center gap-4">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg', 
                       currentStep >= step ? 'bg-rose-600 text-white shadow-rose-500/40 dark:shadow-rose-900/40' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700']">
            {{ step }}
          </div>
          <span v-if="step < 3" class="w-12 h-px bg-slate-200 dark:bg-slate-700"></span>
        </div>
      </div>
      <div class="flex justify-center mt-2">
        <span class="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-500">{{ stepLabels[currentStep-1] }}</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
      <!-- Main Form -->
      <div class="col-span-12 lg:col-span-8">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm dark:shadow-xl min-h-[450px]">
          
          <!-- Step 1: Selection -->
          <div v-if="currentStep === 1" class="space-y-8 animate-fade-in">
             <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Project & Item Selection</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Select the target project and the item to be issued</p>
             </div>

             <div class="space-y-6">
                <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Target Project</label>
                   <div class="relative">
                      <i class="mdi mdi-briefcase-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                      <select 
                        v-model="form.project_id"
                        class="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer focus:ring-0 transition-all font-mono"
                      >
                        <option value="" disabled>Select project...</option>
                        <option v-for="project in relevantProjects" :key="project.id" :value="project.id">
                          {{ project.project_id }} - {{ project.enquiry?.title }}
                        </option>
                      </select>
                      <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                   </div>
                </div>

                <div class="space-y-2" ref="materialSearchContainer">
                   <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Find Item</label>
                   <div class="relative group">
                     <i v-if="searching" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 dark:text-rose-500 text-xl z-20"></i>
                     <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl z-20"></i>
                     <input 
                       v-model="materialSearch"
                       type="text"
                       placeholder="Search by Code or Name..."
                       @input="onSearchInput"
                       @focus="showResults = true"
                       class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 transition-all font-bold placeholder:font-sans"
                     />

                     <div v-if="showResults && (displayInventory.length > 0 || searching)" 
                          class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-[50] max-h-[250px] overflow-y-auto">
                        <div v-if="searching" class="p-8 text-center text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Searching...</div>
                        <div v-else v-for="item in displayInventory" :key="item.id"
                             @click="selectMaterial(item)"
                             class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 flex justify-between items-center group transition-colors">
                           <div class="flex items-center gap-4">
                             <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-500">
                                <i class="mdi mdi-package-variant"></i>
                             </div>
                             <div>
                                <p class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">{{ item.material_name }}</p>
                                <p class="text-[9px] font-mono text-slate-400 dark:text-slate-500">{{ item.material_code }}</p>
                             </div>
                           </div>
                           <div class="text-right font-sans">
                              <p class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">{{ item.available }}</p>
                              <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">{{ item.unit_of_measure }}</p>
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
             </div>

             <div v-if="selectedMaterial && form.project_id" class="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-between animate-fade-in font-sans">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-500">
                      <i class="mdi mdi-link-variant text-2xl"></i>
                   </div>
                   <div>
                      <p class="text-[9px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest">Ready</p>
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ selectedMaterial.material_name }}</h4>
                      <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">FOR: {{ selectedProject?.project_id }}</p>
                   </div>
                </div>
                <button @click="currentStep = 2" class="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-500/20 dark:shadow-rose-900/20">
                   Next Phase
                </button>
             </div>
          </div>

          <!-- Step 2: Details -->
          <div v-if="currentStep === 2" class="space-y-8 animate-fade-in font-sans">
             <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Issuance Details</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Specify quantity and administrative notes</p>
             </div>

             <div class="space-y-6">
                <div class="space-y-2">
                   <div class="flex justify-between items-center px-1">
                      <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Quantity to Issue</label>
                      <span class="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase">System Limit: {{ selectedMaterial?.available }} {{ selectedMaterial?.unit_of_measure }}</span>
                   </div>
                   <div class="relative">
                      <input 
                        v-model.number="form.quantity"
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 rounded-lg text-2xl font-bold text-slate-900 dark:text-white focus:ring-0 transition-all text-center"
                      />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        {{ selectedMaterial?.unit_of_measure }}
                      </span>
                   </div>
                   <p v-if="form.quantity && form.quantity > (selectedMaterial?.available || 0)" class="text-[9px] font-bold text-rose-600 dark:text-rose-500 px-1 uppercase tracking-wider">Warning: Insufficient inventory</p>
                </div>

                <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Usage Classification</label>
                   <div class="grid grid-cols-2 gap-3">
                      <button 
                        @click="form.usage_type = 'consumable'"
                        type="button"
                        :class="['px-4 py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all', 
                          form.usage_type === 'consumable' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600']"
                      >
                        Consumable
                      </button>
                      <button 
                        @click="form.usage_type = 'reusable'"
                        type="button"
                        :class="['px-4 py-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all', 
                          form.usage_type === 'reusable' 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600']"
                      >
                        Reusable
                      </button>
                   </div>
                   <p class="text-[8px] italic text-slate-400 px-1">Note: Reusables will track project balances for later return.</p>
                </div>

                <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Internal Notes</label>
                   <textarea 
                     v-model="form.notes"
                     rows="3"
                     placeholder="Add dispersal notes..."
                     class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-rose-500 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-0 transition-all placeholder:font-sans"
                   ></textarea>
                </div>
             </div>

             <div class="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                <button @click="currentStep = 1" class="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Back</button>
                <button @click="currentStep = 3" :disabled="!form.quantity || form.quantity > selectedMaterial?.available" class="px-8 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-rose-500/20 dark:shadow-rose-900/20">
                   Review Dispatch
                </button>
             </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="currentStep === 3" class="space-y-8 animate-fade-in font-sans">
             <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-6">
                <div class="space-y-1">
                   <h2 class="text-xl font-bold text-rose-600 dark:text-rose-500">Confirm Dispatch</h2>
                   <p class="text-xs text-slate-500 dark:text-slate-400">Final review of issuance request</p>
                </div>
                <div class="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-right">
                   <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">System Ref</p>
                   <p class="text-sm font-mono font-bold text-slate-900 dark:text-white tracking-widest">ISU-00x</p>
                </div>
             </div>

             <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
                <div class="flex justify-between items-start">
                   <div>
                      <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Material</p>
                      <h4 class="text-base font-bold text-slate-900 dark:text-white">{{ selectedMaterial?.material_name }}</h4>
                      <p class="text-[9px] font-bold text-slate-500 dark:text-slate-600">{{ selectedMaterial?.material_code }}</p>
                   </div>
                   <div class="text-right">
                      <p class="text-[9px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest">Qty Issue</p>
                      <h4 class="text-2xl font-bold text-slate-900 dark:text-white">-{{ form.quantity }}</h4>
                   </div>
                </div>

                <div class="h-px bg-slate-200 dark:bg-slate-700/50"></div>

                <div class="grid grid-cols-2 gap-6">
                   <div>
                      <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Destination Project</p>
                      <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">{{ selectedProject?.project_id }}</p>
                   </div>
                   <div>
                      <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</p>
                      <p class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{{ selectedProject?.enquiry?.title || 'GENERAL_WORKS' }}</p>
                   </div>
                </div>
             </div>

             <div class="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                <button @click="currentStep = 2" class="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Modify Details</button>
                <button 
                  @click="submitCheckOut"
                  :disabled="submitting"
                  class="px-10 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-rose-500/20 dark:shadow-rose-900/40"
                >
                  <i v-if="submitting" class="mdi mdi-loading mdi-spin text-lg"></i>
                  <i v-else class="mdi mdi-truck-delivery text-lg"></i>
                  {{ submitting ? 'Validating...' : 'Confirm Issuance' }}
                </button>
             </div>
          </div>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="col-span-12 lg:col-span-4 font-sans">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl sticky top-8 transition-all">
           <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8 px-1">Stock Health Overlay</h4>
           
           <div v-if="selectedMaterial" class="space-y-10 animate-fade-in text-center">
              <div class="relative w-32 h-32 mx-auto">
                 <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-50 dark:stroke-slate-900" stroke-width="3" />
                    <circle cx="18" cy="18" r="16" fill="none" 
                            class="stroke-rose-600 dark:stroke-rose-500"
                            stroke-width="3" 
                            stroke-dasharray="100" 
                            :stroke-dashoffset="100 - ( (selectedMaterial.available - (form.quantity || 0)) / (selectedMaterial.min_stock_level * 4 || 100) * 100)"
                            stroke-linecap="round" />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-[20px] font-bold text-slate-900 dark:text-white">{{ selectedMaterial.available - (form.quantity || 0) }}</span>
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">In Store</span>
                 </div>
              </div>

              <div class="space-y-3">
                 <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Valuation</span>
                    <span class="text-xs font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency((form.quantity || 0) * selectedMaterial.unit_cost) }}</span>
                 </div>
                 <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Status</span>
                    <span :class="['text-[9px] font-bold uppercase', (selectedMaterial.available - (form.quantity || 0)) <= selectedMaterial.min_stock_level ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500']">
                       {{ (selectedMaterial.available - (form.quantity || 0)) <= selectedMaterial.min_stock_level ? 'Low Stock' : 'Stable' }}
                    </span>
                 </div>
              </div>
           </div>

           <div v-else class="h-64 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-center p-6 opacity-40">
              <i class="mdi mdi-cube-send text-4xl mb-3 text-slate-400 dark:text-slate-500"></i>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-relaxed">Define requirements to see health impacts</p>
           </div>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="max-w-7xl mx-auto mt-16 space-y-6 font-sans">
       <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Dispatches</h2>
          <button @click="exportToCSV" class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-500 transition-all font-sans">Export Archive</button>
       </div>

       <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl">
          <table class="w-full text-left">
             <thead>
                <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Batch</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Material</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quantity</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"></th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                   <td class="px-6 py-4 text-xs font-bold text-rose-600 dark:text-rose-500">{{ log.batch_number }}</td>
                   <td class="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white uppercase">{{ log.material?.material_name }}</td>
                   <td class="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{{ log.project?.project_id || 'INTERNAL' }}</td>
                   <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">-{{ Math.abs(log.quantity) }}</td>
                   <td class="px-6 py-4 text-right">
                      <button @click="deleteLog(log.id)" class="text-slate-400 hover:text-rose-600 dark:text-slate-600 dark:hover:text-rose-500 transition-colors">
                         <i class="mdi mdi-delete-outline text-lg"></i>
                      </button>
                   </td>
                </tr>
             </tbody>
          </table>
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Page {{ currentPage }} / {{ totalPages }}</span>
             <div class="flex gap-2">
                <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">Prev</button>
                <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">Next</button>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const router = useRouter()
const { inventory, fetchInventory } = useInventory()
const projects = ref<any[]>([])

const currentStep = ref(1)
const stepLabels = ['Project & Item Selection', 'Issuance Details', 'Final Verification']

const form = ref({
  material_id: '',
  project_id: '',
  quantity: null as number | null,
  notes: '',
  usage_type: 'consumable',
  type: 'check_out'
})

const submitting = ref(false)
const materialSearch = ref('')
const searching = ref(false)
let searchTimeout: any = null

const onSearchInput = () => {
  showResults.value = true
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      await fetchInventory({ search: materialSearch.value })
    } finally { searching.value = false }
  }, 300)
}

const selectedMaterial = ref<any>(null)
const showResults = ref(false)
const materialSearchContainer = ref<HTMLElement | null>(null)
onClickOutside(materialSearchContainer, () => showResults.value = false)

const selectMaterial = (item: any) => {
  form.value.material_id = item.id
  form.value.usage_type = item.material_type || 'consumable'
  selectedMaterial.value = item
  materialSearch.value = item.material_name
  showResults.value = false
}

const selectedProject = computed(() => projects.value.find(p => p.id === form.value.project_id))

const fetchProjects = async () => {
  try {
    const response = await api.get('/api/projects')
    projects.value = (response.data.data.data || response.data.data || []).filter((p: any) => p.project_id?.startsWith('WNG'))
  } catch (err) { console.error(err) }
}

const relevantProjects = computed(() => projects.value)
const recentLogs = ref<any[]>([])
const loadingLogs = ref(false)
const currentPage = ref(1)
const logsPerPage = 5

const fetchRecentLogs = async () => {
  try {
    const response = await api.get('/api/procurement-stores/inventory-logs', { params: { type: 'check_out' } })
    recentLogs.value = response.data.data || []
  } catch (err) { console.error(err) }
}

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * logsPerPage
  return recentLogs.value.slice(start, start + logsPerPage)
})

const totalPages = computed(() => Math.ceil(recentLogs.value.length / logsPerPage) || 1)

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val)
}

const exportToCSV = () => {
  const headers = ['Ref', 'Item', 'Project', 'Qty', 'Date']
  const rows = recentLogs.value.map(l => [l.batch_number, l.material?.material_name, l.project?.project_id, Math.abs(l.quantity), formatDateTime(l.created_at)])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'check-out-logs.csv'; a.click()
}

const deleteLog = async (id: number) => {
  if (!confirm('Cancel this issuance?')) return
  try {
    await api.delete(`/api/procurement-stores/inventory-logs/${id}`)
    await fetchRecentLogs(); await fetchInventory()
  } catch (err) { console.error(err) }
}

const submitCheckOut = async () => {
  submitting.value = true
  try {
    await api.post('/api/procurement-stores/check-out', { ...form.value })
    alert('Stock issued successfully.')
    router.push('/stores/dashboard')
  } catch (err: any) { alert('Issuance failed. Check stock availability.') }
  finally { submitting.value = false }
}

const displayInventory = computed(() => Array.isArray(inventory.value) ? inventory.value : [])

onMounted(() => {
  fetchInventory(); fetchProjects(); fetchRecentLogs()
})
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
