<template>
  <div class="p-8 space-y-8 max-w-5xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          Defective <span class="text-rose-500 text-3xl opacity-50">/</span> Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Identify, record, and quarantine unusable inventory.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div class="p-10 space-y-8">
            
            <!-- Material Selection -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Select Defective Material</label>
              <div class="relative group">
                <i class="mdi mdi-alert-octagon absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-rose-500 transition-colors"></i>
                <select 
                  v-model="form.material_id"
                  class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all appearance-none"
                >
                  <option value="" disabled>Search Inventory...</option>
                  <option v-for="item in inventory" :key="item.id" :value="item.id">
                    {{ item.material_code }} - {{ item.material_name }} ({{ item.available }} available)
                  </option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i class="mdi mdi-chevron-down text-slate-400 text-xl"></i>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">2. Quantity Found Defective</label>
              <div class="relative">
                <input 
                  type="number" 
                  v-model.number="form.quantity"
                  placeholder="0.00"
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all"
                />
                <div class="absolute right-6 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-black uppercase text-slate-500">
                  {{ selectedMaterial?.unit_of_measure || 'Units' }}
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">3. Defect Description / Reason</label>
              <textarea 
                v-model="form.notes"
                rows="3"
                placeholder="Describe the damage or defect. This will be logged for quality audit..."
                class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all"
              ></textarea>
            </div>

            <!-- Submit -->
            <button 
              @click="submitDefective"
              :disabled="submitting || !form.material_id || !form.quantity || !form.notes"
              class="w-full py-6 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-2xl shadow-xl shadow-rose-500/20 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <i v-else class="mdi mdi-alert-circle text-xl transition-transform group-hover:scale-125"></i>
              {{ submitting ? 'Processing...' : 'Record Defect' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Live Pipeline Summary -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 h-full rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl"></div>
          <div class="relative z-10 space-y-8">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Operation</p>
              <h3 class="text-xl font-black italic">QUALITY QUARANTINE</h3>
            </div>

            <div v-if="selectedMaterial" class="space-y-6 animate-fade-in">
              <div class="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Stock Adjustment</p>
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Current Stock</span>
                    <span class="text-xs font-black">{{ selectedMaterial.available }} {{ selectedMaterial.unit_of_measure }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Marking Defective</span>
                    <span class="text-xs font-black text-rose-400">- {{ form.quantity || 0 }} {{ selectedMaterial.unit_of_measure }}</span>
                  </div>
                  <div class="h-px bg-white/10 my-4"></div>
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Remaining Available</span>
                    <span class="text-base font-black" :class="(selectedMaterial.available - (form.quantity || 0)) < 0 ? 'text-rose-500' : 'text-emerald-400'">
                      {{ selectedMaterial.available - (form.quantity || 0) }}
                    </span>
                  </div>
                </div>
              </div>

               <div v-if="(selectedMaterial.available - (form.quantity || 0)) < selectedMaterial.min_stock_level" class="p-6 bg-rose-500/10 rounded-3xl border border-rose-500/20 flex gap-4 items-start">
                 <i class="mdi mdi-alert-octagon text-rose-400 text-xl"></i>
                 <div>
                    <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-tight">Low Stock Trigger</p>
                    <p class="text-[9px] text-white/60 mt-1">This action will push this item below its minimum stock level ({{ selectedMaterial.min_stock_level }}).</p>
                 </div>
               </div>
            </div>

            <div v-else class="p-12 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center">
              <i class="mdi mdi-alert-box text-5xl mb-4"></i>
              <p class="text-[10px] font-black uppercase tracking-widest">Select material to review impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useInventory } from '../../composables/useInventory'
import api from '@/plugins/axios'

const route = useRoute()
const { inventory, fetchInventory } = useInventory()

const form = ref({
  material_id: (route.query.material_id as string) || '',
  quantity: null as number | null,
  notes: '',
})

const submitting = ref(false)

const selectedMaterial = computed(() => {
  return inventory.value.find(i => Number(i.id) === Number(form.value.material_id))
})

const submitDefective = async () => {
    if (!form.value.material_id || !form.value.quantity) return

    if (selectedMaterial.value && form.value.quantity > selectedMaterial.value.available) {
        if (!confirm('Warning: Quantity marked defective exceeds current stock on hand. Proceed with adjustment?')) {
            return
        }
    }

  submitting.value = true
  try {
    await api.post('/api/procurement-stores/defective', {
        ...form.value
    })
    
    alert('Stock marked as defective and removed from inventory.')
    // Reset form
    form.value = {
      material_id: '',
      quantity: null,
      notes: '',
    }
    await fetchInventory()
  } catch (err: any) {
    console.error('Action failed:', err)
    alert(err.response?.data?.message || 'Transaction failed.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>
