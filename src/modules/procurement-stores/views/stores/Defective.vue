<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-8 font-sans selection:bg-rose-500/30 transition-colors duration-300">
    <!-- Premium Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div>
        <div class="flex items-center gap-2 text-rose-600 dark:text-rose-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
          <span class="w-8 h-[2px] bg-rose-600 dark:bg-rose-500"></span>
          Report Damage
        </div>
        <h1 class="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Damaged <span class="text-slate-300 dark:text-white/20">/</span> Stock
        </h1>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
      <!-- FORM PANE (Col 7) -->
      <div class="col-span-12 lg:col-span-7">
        <div class="bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-100 dark:border-white/10 rounded-[3rem] p-12 shadow-sm dark:shadow-2xl space-y-10 relative overflow-hidden group">
           <div class="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl opacity-50 dark:opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
           <div class="space-y-2 relative z-10">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Report Damaged Stock</h2>
              <p class="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">Record and remove damaged items from stock</p>
           </div>

           <div class="space-y-8">
              <!-- Asset Selection -->
              <div class="space-y-2">
                 <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 px-1">Select Material</label>
                 <div class="relative group">
                    <i class="mdi mdi-alert-octagon absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/10 group-focus-within:text-rose-500 transition-colors text-xl"></i>
                    <select 
                      v-model="form.material_id"
                      class="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 focus:border-rose-500/50 rounded-2xl text-base font-black text-slate-900 dark:text-white appearance-none cursor-pointer focus:ring-0 transition-all font-mono"
                    >
                      <option value="" disabled>Search damaged inventory...</option>
                      <option v-for="item in inventory" :key="item.id" :value="item.id">
                        {{ item.material_code }} - {{ item.material_name }} ({{ item.available }} units)
                      </option>
                    </select>
                    <i class="mdi mdi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20"></i>
                 </div>
              </div>

              <!-- Quantity -->
              <div class="space-y-2">
                 <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 px-1">Quantity Damaged</label>
                 <div class="relative">
                    <input 
                      v-model.number="form.quantity"
                      type="number" 
                      placeholder="0.00"
                      class="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 focus:border-rose-500/50 rounded-2xl text-2xl font-black text-slate-900 dark:text-white focus:ring-0 transition-all placeholder:text-slate-300 dark:placeholder:text-white/5 font-mono"
                    />
                    <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest px-3 py-1 bg-white/50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                      {{ selectedMaterial?.unit_of_measure || 'Units' }}
                    </span>
                 </div>
              </div>

              <!-- Notes -->
              <div class="space-y-2">
                 <label class="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 px-1">Notes</label>
                 <textarea 
                   v-model="form.notes"
                   rows="3"
                   placeholder="Describe why the items are being removed..."
                   class="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 focus:border-rose-500/50 rounded-2xl text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/5 focus:ring-0 transition-all"
                 ></textarea>
              </div>
           </div>

           <button 
              @click="submitDefective"
              :disabled="submitting || !form.material_id || !form.quantity || !form.notes"
              class="w-full py-6 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-[2rem] shadow-xl dark:shadow-2xl shadow-rose-500/20 dark:shadow-rose-900/40 transition-all font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 group"
            >
              <i v-if="submitting" class="mdi mdi-loading mdi-spin text-xl"></i>
              <i v-else class="mdi mdi-shield-alert-outline text-xl group-hover:scale-110 transition-transform"></i>
              {{ submitting ? 'Updating...' : 'Confirm' }}
            </button>
        </div>
      </div>

      <!-- IMPACT PANE (Col 5) -->
      <div class="col-span-12 lg:col-span-5 space-y-8">
         <div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-[3rem] p-10 shadow-sm dark:shadow-2xl relative overflow-hidden group min-h-[500px]">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl opacity-50 dark:opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
            
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white underline decoration-rose-500/50 decoration-2 underline-offset-8 mb-12 relative z-10">Stock Preview</h4>

            <div v-if="selectedMaterial" class="space-y-12 animate-fade-in">
               <div class="relative w-48 h-48 mx-auto">
                 <!-- Circular Progress -->
                 <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-50 dark:stroke-white/5" stroke-width="2" />
                    <circle cx="18" cy="18" r="16" fill="none" 
                            :class="[ (selectedMaterial.available - (form.quantity || 0)) < selectedMaterial.min_stock_level ? 'stroke-rose-600 dark:stroke-rose-500' : 'stroke-amber-600 dark:stroke-orange-500', 'transition-all duration-1000']"
                            stroke-width="2" 
                            stroke-dasharray="100" 
                            :stroke-dashoffset="100 - ( (selectedMaterial.available - (form.quantity || 0)) / (selectedMaterial.min_stock_level * 3) * 100 )"
                            stroke-linecap="round" />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <p class="text-[8px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em] mb-1">New Balance</p>
                    <p class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ selectedMaterial.available - (form.quantity || 0) }}</p>
                    <p class="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase">{{ selectedMaterial.unit_of_measure }}</p>
                 </div>
               </div>

               <div class="space-y-4">
                  <div class="flex justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-white/5">
                     <span class="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">Stock Level</span>
                     <span :class="['text-[10px] font-black uppercase tracking-widest', (selectedMaterial.available - (form.quantity || 0)) < selectedMaterial.min_stock_level ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-400']">
                       {{ (selectedMaterial.available - (form.quantity || 0)) < selectedMaterial.min_stock_level ? 'Critical' : 'Stable' }}
                     </span>
                  </div>
                  
                  <div v-if="(selectedMaterial.available - (form.quantity || 0)) < selectedMaterial.min_stock_level" 
                       class="p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex gap-4 items-start animate-pulse">
                     <i class="mdi mdi-alert-decagram text-rose-600 dark:text-rose-500 text-2xl"></i>
                     <div>
                        <p class="text-[10px] font-black text-rose-600 dark:text-rose-500 uppercase tracking-widest">System Alert</p>
                        <p class="text-[10px] text-slate-500 dark:text-white/40 mt-1 uppercase leading-tight font-black">Marking this as damaged will trigger replenishment alerts.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div v-else class="h-[400px] border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30">
               <i class="mdi mdi-dna text-6xl mb-6 text-slate-300 dark:text-white/50"></i>
               <p class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-white/20">Select a material to see the preview</p>
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
    
    // Reset form
    form.value = {
      material_id: '',
      quantity: null,
      notes: '',
    }
    await fetchInventory()
    alert('Asset quarantine successful. Inventory health updated.')
  } catch (err: any) {
    console.error('Action failed:', err)
    alert('Verification error during quarantine commitment.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
