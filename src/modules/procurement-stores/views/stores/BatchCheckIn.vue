<template>
  <div class="p-8 space-y-8 max-w-7xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Batch <span class="text-emerald-500 text-3xl opacity-50">/</span> Receive Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Efficiently record multiple incoming material batches.</p>
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

    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50">
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Quantity</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Location</th>
              <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-48">Ref / LPO</th>
              <th class="px-1 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="(row, index) in rows" :key="index" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4">
                <select 
                  v-model="row.material_id"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select Material...</option>
                  <option v-for="item in inventory" :key="item.id" :value="item.id">
                    {{ item.material_code }} - {{ item.material_name }}
                  </option>
                </select>
              </td>
              <td class="px-6 py-4">
                <input 
                  type="number" 
                  v-model.number="row.quantity"
                  placeholder="0.00"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </td>
              <td class="px-6 py-4">
                <input 
                  type="text" 
                  v-model="row.location"
                  placeholder="e.g. A-12"
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
          :disabled="submitting || rows.length === 0 || !isValid"
          class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-3 group"
        >
          <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <i v-else class="mdi mdi-check-all text-xl"></i>
          {{ submitting ? 'Processing...' : 'Post Batch to Ledger' }}
        </button>
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

const rows = ref([
  { material_id: '', quantity: null as number | null, location: '', reference_no: '', notes: 'Batch check-in', type: 'check_in' }
])

const submitting = ref(false)

const addRow = () => {
  rows.value.push({ material_id: '', quantity: null, location: '', reference_no: '', notes: 'Batch check-in', type: 'check_in' })
}

const removeRow = (index: number) => {
  if (rows.value.length > 1) {
    rows.value.splice(index, 1)
  }
}

const isValid = computed(() => {
  return rows.value.every(row => row.material_id && row.quantity && row.quantity > 0)
})

const submitBatch = async () => {
  submitting.value = true
  try {
    // We'll need to update the backend to handle batch if not already there, 
    // or just loop for now. Loop is safer if backend only has single.
    // However, usually we should have a batch endpoint.
    // For now, let's assume we can hit the single endpoint multiple times or look for a batch one.
    
    const promises = rows.value.map(row => 
      api.post('/api/procurement-stores/check-in', {
        ...row,
        warehouse_code: 'MAIN'
      })
    )
    
    await Promise.all(promises)
    
    alert('Batch check-in processed successfully!')
    router.push('/stores/materials-library')
  } catch (err) {
    console.error('Batch processing failed:', err)
    alert('Failed to process some items in the batch.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>
