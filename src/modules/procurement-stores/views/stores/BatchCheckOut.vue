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
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div class="overflow-x-auto">
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
                <tr v-for="(row, index) in rows" :key="index" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4">
                    <select 
                      v-model="row.material_id"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all appearance-none"
                    >
                      <option value="" disabled>Select Material...</option>
                      <option v-for="item in inventory" :key="item.id" :value="item.id">
                        {{ item.material_code }} - {{ item.material_name }} (Avail: {{ item.available }})
                      </option>
                    </select>
                  </td>
                  <td class="px-6 py-4">
                    <input 
                      type="number" 
                      v-model.number="row.quantity"
                      placeholder="0.00"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all"
                    />
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
  { material_id: '', quantity: null as number | null, requestor: '', reference_no: '', notes: 'Batch check-out', type: 'check_out' }
])

const submitting = ref(false)

const addRow = () => {
  rows.value.push({ material_id: '', quantity: null, requestor: '', reference_no: '', notes: 'Batch check-out', type: 'check_out' })
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

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
    const promises = rows.value.map(row => 
      api.post('/api/procurement-stores/check-out', {
        ...row,
        project_id: batchProject.value,
        warehouse_code: 'MAIN'
      })
    )
    
    await Promise.all(promises)
    
    alert('Batch issuance processed successfully!')
    router.push('/stores/materials-library')
  } catch (err) {
    console.error('Batch processing failed:', err)
    alert('Failed to process some items in the batch. Check available stock.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
  fetchProjects()
})
</script>
