<template>
  <div class="p-8 space-y-8 max-w-5xl mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Receive <span class="text-emerald-500 text-3xl opacity-50">/</span> Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Add new materials into the warehouse stock.</p>
      </div>
      <button @click="$router.push('/stores/batch-check-in')" class="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-emerald-600/30 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-50 transition-all font-black text-[10px] uppercase tracking-widest">
        <i class="mdi mdi-layers-plus text-lg"></i>
        SWITCH TO BATCH MODE
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Section -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div class="p-10 space-y-8">
            <!-- Material Selection -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Select Material</label>
              <div class="relative group">
                <i class="mdi mdi-magnify absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-emerald-500 transition-colors"></i>
                <select 
                  v-model="form.material_id"
                  class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                >
                  <option value="" disabled>Search Materials...</option>
                  <option v-for="item in inventory" :key="item.id" :value="item.id">
                    {{ item.material_code }} - {{ item.material_name }} (Current: {{ item.quantity_on_hand }})
                  </option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i class="mdi mdi-chevron-down text-slate-400 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Quantity -->
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">2. Quantity to Add</label>
                <div class="relative">
                  <input 
                    type="number" 
                    v-model.number="form.quantity"
                    placeholder="0.00"
                    class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <div class="absolute right-6 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-black uppercase text-slate-500">
                    {{ selectedMaterial?.unit_of_measure || 'Units' }}
                  </div>
                </div>
              </div>

              <!-- Location -->
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">3. Storage Location</label>
                <input 
                  type="text" 
                  v-model="form.location"
                  placeholder="Shelf / Bin Number (e.g. A-12)"
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <!-- Meta Data (LPO / GRN) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">4. Reference / LPO</label>
                <input 
                  type="text" 
                  v-model="form.reference_no"
                  placeholder="LPO # or GRN #"
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">5. Supplier</label>
                <select 
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                >
                  <option>Self / Existing Stock</option>
                  <option>Supplier A</option>
                  <option>Supplier B</option>
                </select>
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">6. Notes</label>
              <textarea 
                v-model="form.notes"
                rows="3"
                placeholder="Details of the arrival..."
                class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
              ></textarea>
            </div>

            <!-- Submit -->
            <button 
              @click="submitCheckIn"
              :disabled="submitting || !form.material_id || !form.quantity"
              class="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <i v-else class="mdi mdi-check-circle-outline text-xl transition-transform group-hover:scale-125"></i>
              {{ submitting ? 'Saving...' : 'Save and Update Stock' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Live Sidebar Summary -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 h-full rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div class="relative z-10 space-y-8">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Operation</p>
              <h3 class="text-xl font-black">ADD STOCK</h3>
            </div>

            <div v-if="selectedMaterial" class="space-y-6 animate-fade-in">
              <div class="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Stock Summary</p>
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Current Stock</span>
                    <span class="text-xs font-black">{{ selectedMaterial.quantity_on_hand }} {{ selectedMaterial.unit_of_measure }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">New Stock</span>
                    <span class="text-xs font-black text-emerald-400">+ {{ form.quantity || 0 }} {{ selectedMaterial.unit_of_measure }}</span>
                  </div>
                  <div class="h-px bg-white/10 my-4"></div>
                  <div class="flex justify-between">
                    <span class="text-xs text-white/50">Final Balance</span>
                    <span class="text-base font-black">{{ (selectedMaterial.quantity_on_hand || 0) + (form.quantity || 0) }}</span>
                  </div>
                </div>
              </div>

               <div class="p-6 bg-white/5 rounded-3xl border border-white/10">
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Location</p>
                 <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                     <i class="mdi mdi-warehouse text-xl"></i>
                   </div>
                   <div>
                     <p class="text-xs font-black">{{ form.location || 'Not Assigned' }}</p>
                     <p class="text-[9px] text-white/40 uppercase font-black">Main Stores</p>
                   </div>
                 </div>
               </div>
            </div>

            <div v-else class="p-12 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center">
              <i class="mdi mdi-package-variant-closed text-5xl mb-4"></i>
              <p class="text-[10px] font-black uppercase tracking-widest">Select material to see summary</p>
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

interface CheckInForm {
  material_id: string | number
  quantity: number | null
  location: string
  reference_no: string
  notes: string
  type: string
}

const form = ref<CheckInForm>({
  material_id: '',
  quantity: null,
  location: '',
  reference_no: '',
  notes: '',
  type: 'check_in'
})

const submitting = ref(false)

const selectedMaterial = computed(() => {
  return inventory.value.find(i => i.id === form.value.material_id)
})

const submitCheckIn = async () => {
  submitting.value = true
  try {
    const response = await api.post('/api/procurement-stores/check-in', {
        ...form.value,
        warehouse_code: 'MAIN'
    })
    
    const batchNumber = response.data.batch_number
    
    // Clear form and refresh data
    form.value = {
      material_id: '',
      quantity: null,
      location: '',
      reference_no: '',
      notes: '',
      type: 'check_in'
    }
    await fetchInventory()
    alert(`✅ Stock checked in successfully!\n\nBatch Number: ${batchNumber}`)
  } catch (err: any) {
    console.error('Check-in failed:', err)
    const errorMsg = err.response?.data?.message || 'Verification error. Please check batch details.'
    alert(`❌ ${errorMsg}`)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>
