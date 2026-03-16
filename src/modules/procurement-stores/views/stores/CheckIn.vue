<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 p-6 font-sans transition-colors duration-300">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Stock Check-In
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Receive an individual item into stock.</p>
      </div>
      
      <div class="flex gap-3">
        <button @click="router.push('/stores/batch-check-in')" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm">
          <i class="mdi mdi-layers-plus text-lg"></i>
          Batch Mode
        </button>
      </div>
    </div>

    <!-- Stepper -->
    <div class="max-w-3xl mx-auto mb-10">
      <div class="flex items-center justify-center gap-4 px-4">
        <div v-for="step in 3" :key="step" class="flex items-center gap-4">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg', 
                       currentStep >= step ? 'bg-emerald-600 text-white shadow-emerald-500/40 dark:shadow-emerald-900/40' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700']">
            {{ step }}
          </div>
          <span v-if="step < 3" class="w-12 h-px bg-slate-200 dark:bg-slate-700"></span>
        </div>
      </div>
      <div class="flex justify-center mt-2">
        <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">{{ stepLabels[currentStep-1] }}</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
      <!-- Main Form -->
      <div class="col-span-12 lg:col-span-8">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm dark:shadow-xl min-h-[450px]">
          
          <!-- Step 1: Find Material -->
          <div v-if="currentStep === 1" class="space-y-8 animate-fade-in">
             <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white font-sans">Find Material</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-sans">Search for the item you are adding to stock</p>
             </div>

             <div class="relative" ref="materialSearchContainer">
                <i v-if="searching" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-500 text-xl z-10"></i>
                <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl z-10"></i>
                <input 
                  v-model="materialSearch"
                  type="text"
                  placeholder="Search by Code or Name..."
                  @focus="showResults = true"
                  @input="onSearchInput"
                  class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 transition-all font-bold placeholder:font-sans"
                />

                <div v-if="showResults && (displayInventory.length > 0 || searching)" 
                     class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-[50] max-h-[300px] overflow-y-auto">
                   <div v-if="searching" class="p-8 text-center text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Searching...</div>
                   <div v-else v-for="item in displayInventory" :key="item.id"
                        @click="selectMaterial(item)"
                        class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 flex justify-between items-center group transition-colors font-sans">
                      <div class="flex items-center gap-4">
                        <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-500">
                           <i class="mdi mdi-package-variant"></i>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{{ item.material_name }}</p>
                           <p class="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">{{ item.material_code }}</p>
                        </div>
                      </div>
                      <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{{ item.available }} {{ item.unit_of_measure }}</span>
                   </div>
                </div>
             </div>

             <div v-if="selectedMaterial" class="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between font-sans">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                      <i class="mdi mdi-check-circle-outline text-2xl"></i>
                   </div>
                   <div>
                      <p class="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Selected Item</p>
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ selectedMaterial.material_name }}</h4>
                   </div>
                </div>
                <button @click="currentStep = 2" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/20">
                   Continue
                </button>
             </div>
          </div>

          <!-- Step 2: Details -->
          <div v-if="currentStep === 2" class="space-y-8 animate-fade-in font-sans">
             <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Stock Details</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Enter the quantity, reference and warehouse location</p>
             </div>

             <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Quantity</label>
                   <div class="relative">
                      <input 
                        v-model.number="form.quantity"
                        type="number" 
                        placeholder="0.00"
                        class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg text-lg font-bold text-slate-900 dark:text-white focus:ring-0 transition-all text-center"
                      />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {{ selectedMaterial?.unit_of_measure }}
                      </span>
                   </div>
                </div>

                <div class="space-y-2">
                   <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Location</label>
                   <input 
                     v-model="form.location"
                     type="text" 
                     placeholder="Shelf/Bin"
                     class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                   />
                </div>
             </div>

             <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Reference (LPO/GRN)</label>
                <div class="relative">
                  <i class="mdi mdi-file-document-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg"></i>
                  <input 
                    v-model="form.reference_no"
                    type="text" 
                    placeholder="Ref No."
                    class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-0 transition-all font-sans"
                  />
                </div>
             </div>

             <div class="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                <button @click="currentStep = 1" class="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Back</button>
                <button @click="currentStep = 3" :disabled="!form.quantity" class="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/20">
                   Review Submission
                </button>
             </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="currentStep === 3" class="space-y-8 animate-fade-in font-sans">
             <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Review & Confirm</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Review the stock entry before saving</p>
             </div>

             <div class="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-6">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center text-2xl border border-emerald-500/20">
                      <i class="mdi mdi-check-all"></i>
                   </div>
                   <div class="flex-1">
                      <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Material</p>
                      <h4 class="text-base font-bold text-slate-900 dark:text-white">{{ selectedMaterial?.material_name }}</h4>
                   </div>
                   <div class="text-right">
                      <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Adding</p>
                      <h4 class="text-2xl font-bold text-emerald-600 dark:text-emerald-500">+ {{ form.quantity }}</h4>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                   <div>
                      <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target Location</p>
                      <p class="text-xs font-bold text-slate-900 dark:text-white">{{ form.location || 'Warehouse Main' }}</p>
                   </div>
                   <div>
                      <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Reference No.</p>
                      <p class="text-xs font-bold text-slate-900 dark:text-white">{{ form.reference_no || '-' }}</p>
                   </div>
                </div>
             </div>

             <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Notes</label>
                <textarea 
                  v-model="form.notes"
                  rows="2"
                  placeholder="Additional notes..."
                  class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-0 transition-all font-medium placeholder:font-sans"
                ></textarea>
             </div>

             <div class="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                <button @click="currentStep = 2" class="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Edit Details</button>
                <button 
                  @click="submitCheckIn"
                  :disabled="submitting"
                  class="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20"
                >
                  <i v-if="submitting" class="mdi mdi-loading mdi-spin text-lg"></i>
                  <i v-else class="mdi mdi-content-save-check text-lg"></i>
                  {{ submitting ? 'Saving...' : 'Confirm Stock In' }}
                </button>
             </div>
          </div>

        </div>
      </div>

      <!-- Inventory Preview Side -->
      <div class="col-span-12 lg:col-span-4 font-sans">
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-xl sticky top-8 transition-all">
           <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8 px-1">Current Status</h4>
           
           <div v-if="selectedMaterial" class="space-y-10 animate-fade-in text-center">
              <div class="relative w-32 h-32 mx-auto">
                 <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-100 dark:stroke-slate-900" stroke-width="3" />
                    <circle cx="18" cy="18" r="16" fill="none" 
                            class="stroke-emerald-600 dark:stroke-emerald-500"
                            stroke-width="3" 
                            stroke-dasharray="100" 
                            :stroke-dashoffset="100 - ((selectedMaterial.quantity_on_hand + (form.quantity || 0)) / (selectedMaterial.min_stock_level * 4 || 100) * 100)"
                            stroke-linecap="round" />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Total</span>
                    <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ selectedMaterial.available + (form.quantity || 0) }}</span>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-3 text-center">
                 <div class="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded-lg">
                    <p class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Before</p>
                    <p class="text-sm font-bold text-slate-500 dark:text-slate-400">{{ selectedMaterial.available }}</p>
                 </div>
                 <div class="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded-lg border-emerald-500/10">
                    <p class="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase mb-1">Increase</p>
                    <p class="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{{ form.quantity || 0 }}</p>
                 </div>
              </div>
           </div>

           <div v-else class="h-64 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-center p-6 opacity-40">
              <i class="mdi mdi-package-variant-closed text-4xl mb-3 text-slate-400 dark:text-slate-600"></i>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 leading-relaxed">Search for an item to see stock preview</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Recent Logs -->
    <div class="max-w-7xl mx-auto mt-16 space-y-6 font-sans">
       <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
          <button @click="exportToCSV" class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-500 transition-all">Download Log (.CSV)</button>
       </div>

       <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-xl">
          <table class="w-full text-left">
             <thead>
                <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Transaction ID</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Qty</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Timestamp</th>
                   <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"></th>
                </tr>
             </thead>
             <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                   <td class="px-6 py-4">
                      <p class="text-xs font-bold text-emerald-600 dark:text-emerald-500">{{ log.batch_number }}</p>
                   </td>
                   <td class="px-6 py-4">
                      <p class="text-xs font-bold text-slate-900 dark:text-white uppercase">{{ log.material?.material_name }}</p>
                      <p class="text-[9px] font-mono text-slate-400 dark:text-slate-500">{{ log.material?.material_code }}</p>
                   </td>
                   <td class="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">
                      +{{ Math.abs(log.quantity) }} {{ log.material?.unit_of_measure }}
                   </td>
                   <td class="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {{ formatDateTime(log.created_at) }}
                   </td>
                   <td class="px-6 py-4 text-right">
                      <button @click="deleteLog(log.id)" class="text-slate-400 hover:text-rose-600 dark:text-slate-600 dark:hover:text-rose-500 transition-colors">
                         <i class="mdi mdi-delete-outline text-lg"></i>
                      </button>
                   </td>
                </tr>
             </tbody>
          </table>
          
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Page {{ currentPage }} of {{ totalPages }}</span>
             <div class="flex gap-2">
                <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Prev</button>
                <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Next</button>
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

const currentStep = ref(1)
const stepLabels = ['Selection', 'Entry Details', 'Verification']

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
    } finally {
      searching.value = false
    }
  }, 300)
}

const selectedMaterial = ref<any>(null)
const showResults = ref(false)
const materialSearchContainer = ref<HTMLElement | null>(null)

onClickOutside(materialSearchContainer, () => {
  showResults.value = false
})

const selectMaterial = (item: any) => {
  form.value.material_id = item.id
  selectedMaterial.value = item
  materialSearch.value = item.material_name
  showResults.value = false
  currentStep.value = 2
}

watch([() => form.value.material_id, inventory], () => {
  if (!form.value.material_id) return
  const found = (inventory.value || []).find(i => i.id === form.value.material_id)
  if (found) selectedMaterial.value = found
}, { immediate: true })

const displayInventory = computed(() => Array.isArray(inventory.value) ? inventory.value : [])

// Logs table management
const recentLogs = ref<any[]>([])
const loadingLogs = ref(false)
const currentPage = ref(1)
const logsPerPage = 5

const fetchRecentLogs = async () => {
  loadingLogs.value = true
  try {
    const response = await api.get('/api/procurement-stores/inventory-logs', { params: { type: 'check_in' } })
    recentLogs.value = response.data.data || []
  } catch (err) {
    console.error('Failed to fetch logs:', err)
  } finally {
    loadingLogs.value = false
  }
}

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * logsPerPage
  return recentLogs.value.slice(start, start + logsPerPage)
})

const totalPages = computed(() => Math.ceil(recentLogs.value.length / logsPerPage) || 1)

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const exportToCSV = () => {
  const headers = ['Ref', 'Material', 'Qty', 'Unit', 'Date']
  const rows = recentLogs.value.map(log => [
    log.batch_number, log.material?.material_name, Math.abs(log.quantity), log.material?.unit_of_measure, formatDateTime(log.created_at)
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `check-in-logs.csv`
  a.click()
}

const deleteLog = async (id: number) => {
  if (!confirm('Revert this stock entry?')) return
  try {
    await api.delete(`/api/procurement-stores/inventory-logs/${id}`)
    await fetchRecentLogs()
    await fetchInventory()
  } catch (err) { console.error(err) }
}

const submitCheckIn = async () => {
  submitting.value = true
  try {
    await api.post('/api/procurement-stores/check-in', { ...form.value, warehouse_code: 'MAIN' })
    alert('Stock successfully updated.')
    router.push('/stores/dashboard')
  } catch (err: any) {
    alert('Update failed. Please check inputs.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
  fetchRecentLogs()
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
