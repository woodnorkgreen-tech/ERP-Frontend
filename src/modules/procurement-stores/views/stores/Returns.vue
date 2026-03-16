<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Stock Return
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Return unused items from a project back to inventory.</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
      <!-- Form Pane -->
      <div class="col-span-12 lg:col-span-7">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm dark:shadow-xl space-y-8">
           <div class="space-y-1 border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Return Item</h2>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Project to Store Sync</p>
           </div>

           <div class="space-y-6">
              <!-- Project Origin -->
              <div class="space-y-2">
                 <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Source Project</label>
                 <div class="relative group">
                    <i class="mdi mdi-briefcase-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                    <select 
                      v-model="form.project_id"
                      class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer focus:ring-0 transition-all font-mono"
                    >
                      <option value="" disabled>Select project...</option>
                      <option v-for="project in relevantProjects" :key="project.id" :value="project.id">
                        {{ project.project_id }} - {{ project.enquiry?.title }}
                      </option>
                    </select>
                    <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                 </div>
              </div>

              <!-- Asset Selection -->
              <div class="space-y-2">
                 <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Material Selection</label>
                 <div class="relative group">
                    <i class="mdi mdi-package-variant absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                    <select 
                      v-model="form.material_id"
                      class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer focus:ring-0 transition-all font-mono"
                    >
                      <option value="" disabled>Search item...</option>
                      <option v-for="item in inventory" :key="item.id" :value="item.id">
                        {{ item.material_code }} - {{ item.material_name }}
                      </option>
                    </select>
                    <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                 </div>
              </div>

              <!-- Quantity -->
              <div class="space-y-2">
                 <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Quantity to Return</label>
                 <div class="relative">
                    <input 
                      v-model.number="form.quantity"
                      type="number" 
                      placeholder="0.00"
                      class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-500 rounded-lg text-2xl font-bold text-slate-900 dark:text-white focus:ring-0 transition-all text-center"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                       {{ selectedMaterial?.unit_of_measure || 'Units' }}
                    </span>
                 </div>
              </div>

              <!-- Notes -->
              <div class="space-y-2">
                 <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Reason for Return</label>
                 <textarea 
                   v-model="form.notes"
                   rows="3"
                   placeholder="e.g. Excess stock from site..."
                   class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-500 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-0 transition-all placeholder:font-sans"
                 ></textarea>
              </div>
           </div>

           <button 
              @click="submitReturn"
              :disabled="submitting || !form.material_id || !form.quantity || !form.project_id"
              class="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg shadow-lg shadow-amber-900/20 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <i v-if="submitting" class="mdi mdi-loading mdi-spin text-lg"></i>
              <i v-else class="mdi mdi-keyboard-return text-lg"></i>
              {{ submitting ? 'Processing...' : 'Confirm Return Stock' }}
            </button>
        </div>
      </div>

      <!-- Preview Pane -->
      <div class="col-span-12 lg:col-span-5 space-y-6">
         <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm dark:shadow-xl min-h-[400px]">
            <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8 px-1">Impact Preview</h4>

            <div v-if="selectedMaterial" class="space-y-10 animate-fade-in">
               <div class="relative w-36 h-36 mx-auto">
                  <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                     <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-50 dark:stroke-slate-900" stroke-width="3" />
                     <circle cx="18" cy="18" r="16" fill="none" 
                             class="stroke-emerald-600 dark:stroke-emerald-500"
                             stroke-width="3" 
                             stroke-dasharray="100" 
                             :stroke-dashoffset="100 - ((selectedMaterial.available + (form.quantity || 0)) / (selectedMaterial.min_stock_level * 5 || 100) * 100)"
                             stroke-linecap="round" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <span class="text-[24px] font-bold text-slate-900 dark:text-white">{{ selectedMaterial.available + (form.quantity || 0) }}</span>
                     <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">New Store Bal</span>
                  </div>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700/50 text-center">
                     <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Source</p>
                     <p class="text-xs font-bold text-amber-600 dark:text-amber-500 truncate">{{ selectedProject?.project_id || '----' }}</p>
                  </div>
                  <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700/50 text-center">
                     <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Validation</p>
                     <p class="text-xs font-bold text-emerald-600 dark:text-emerald-500">Ready</p>
                  </div>
               </div>

               <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-lg text-center">
                  <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">Returning {{ form.quantity || 0 }} units back to Main Warehouse.</p>
               </div>
            </div>

            <div v-else class="h-64 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-center p-8 opacity-40">
               <i class="mdi mdi-rotate-left text-5xl mb-4 text-slate-400 dark:text-slate-500"></i>
               <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Select project and material</p>
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
const projects = ref<any[]>([])

const form = ref({
  material_id: '',
  project_id: '',
  quantity: null as number | null,
  notes: '',
})

const submitting = ref(false)

const selectedMaterial = computed(() => inventory.value.find(i => Number(i.id) === Number(form.value.material_id)))
const selectedProject = computed(() => projects.value.find(p => Number(p.id) === Number(form.value.project_id)))

const fetchProjects = async () => {
  try {
    const response = await api.get('/api/projects')
    projects.value = (response.data.data.data || response.data.data || []).filter((p: any) => p.project_id?.startsWith('WNG'))
  } catch (err) { console.error(err) }
}

const relevantProjects = computed(() => projects.value)

const submitReturn = async () => {
  submitting.value = true
  try {
    await api.post('/api/procurement-stores/returns', { ...form.value })
    alert('Return processed successfully.')
    form.value = { material_id: '', project_id: '', quantity: null, notes: '' }
    await fetchInventory()
  } catch (err: any) { alert('Process failed. Check connection.') }
  finally { submitting.value = false }
}

onMounted(() => { fetchInventory(); fetchProjects() })
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
