<template>
  <div class="p-8 space-y-8 max-w-5xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Returns <span class="text-amber-500 text-3xl opacity-50">/</span> Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Process unused project materials back to inventory.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div class="p-10 space-y-8">
            
            <!-- Project Link -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Returning from Project</label>
              <div class="relative group">
                <i class="mdi mdi-briefcase-outline absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-amber-500 transition-colors"></i>
                <select 
                  v-model="form.project_id"
                  class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
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
            </div>

            <!-- Material Selection -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">2. Select Material</label>
              <div class="relative group">
                <i class="mdi mdi-package-variant absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-amber-500 transition-colors"></i>
                <select 
                  v-model="form.material_id"
                  class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select Material...</option>
                  <option v-for="item in inventory" :key="item.id" :value="item.id">
                    {{ item.material_code }} - {{ item.material_name }}
                  </option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i class="mdi mdi-chevron-down text-slate-400 text-xl"></i>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">3. Quantity to Return</label>
              <div class="relative">
                <input 
                  type="number" 
                  v-model.number="form.quantity"
                  placeholder="0.00"
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <div class="absolute right-6 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-black uppercase text-slate-500">
                  {{ selectedMaterial?.unit_of_measure || 'Units' }}
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">4. Notes / Reason</label>
              <textarea 
                v-model="form.notes"
                rows="3"
                placeholder="Why is this being returned? e.g. Excess stock, wrong specification..."
                class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 transition-all"
              ></textarea>
            </div>

            <!-- Submit -->
            <button 
              @click="submitReturn"
              :disabled="submitting || !form.material_id || !form.quantity || !form.project_id"
              class="w-full py-6 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-2xl shadow-xl shadow-amber-500/20 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <i v-else class="mdi mdi-keyboard-return text-xl transition-transform group-hover:-translate-x-2"></i>
              {{ submitting ? 'Processing...' : 'Complete Return' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Live Pipeline Summary -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 h-full rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div class="relative z-10 space-y-8">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Operation</p>
              <h3 class="text-xl font-black italic">REVERSE LOGISTICS</h3>
            </div>

            <div v-if="selectedMaterial" class="space-y-6 animate-fade-in">
              <div class="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Stock Recovery</p>
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Current Stock</span>
                    <span class="text-xs font-black">{{ selectedMaterial.available }} {{ selectedMaterial.unit_of_measure }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Returning</span>
                    <span class="text-xs font-black text-emerald-400">+ {{ form.quantity || 0 }} {{ selectedMaterial.unit_of_measure }}</span>
                  </div>
                  <div class="h-px bg-white/10 my-4"></div>
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Post-Return Balance</span>
                    <span class="text-base font-black text-emerald-400">{{ selectedMaterial.available + (form.quantity || 0) }}</span>
                  </div>
                </div>
              </div>

               <div class="p-6 bg-white/5 rounded-3xl border border-white/10">
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Origin Project</p>
                 <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                     <i class="mdi mdi-briefcase-variant text-xl"></i>
                   </div>
                   <div>
                     <p class="text-xs font-black truncate max-w-[150px]">{{ selectedProject?.enquiry?.title || 'Select Project' }}</p>
                     <p class="text-[9px] text-white/40 uppercase font-black">Ref: {{ selectedProject?.project_id || '---' }}</p>
                   </div>
                 </div>
               </div>
            </div>

            <div v-else class="p-12 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center">
              <i class="mdi mdi-keyboard-return text-5xl mb-4"></i>
              <p class="text-[10px] font-black uppercase tracking-widest">Select material to see recovery projection</p>
            </div>
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

const selectedMaterial = computed(() => {
  return inventory.value.find(i => Number(i.id) === Number(form.value.material_id))
})

const selectedProject = computed(() => {
  return projects.value.find(p => Number(p.id) === Number(form.value.project_id))
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

const submitReturn = async () => {
  submitting.value = true
  try {
    await api.post('/api/procurement-stores/returns', {
        ...form.value
    })
    
    alert('Material returned to stock successfully!')
    // Reset form
    form.value = {
      material_id: '',
      project_id: '',
      quantity: null,
      notes: '',
    }
    await fetchInventory()
  } catch (err: any) {
    console.error('Return failed:', err)
    alert(err.response?.data?.message || 'Transaction failed.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
  fetchProjects()
})
</script>
