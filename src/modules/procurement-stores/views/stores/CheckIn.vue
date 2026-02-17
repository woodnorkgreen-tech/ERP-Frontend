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
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div class="p-10 space-y-8">
            <!-- Material Selection -->

            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">1. Select Material</label>
              <div class="relative group" ref="materialSearchContainer">
                <!-- Search Input with Icon -->
                <div class="relative">
                  <i v-if="searching" class="mdi mdi-loading mdi-spin absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 text-xl transition-colors"></i>
                  <i v-else class="mdi mdi-magnify absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-emerald-500 transition-colors"></i>
                  <input 
                    v-model="materialSearch"
                    type="text"
                    placeholder="Search library or type code..."
                    @input="onSearchInput"
                    @focus="showResults = true"
                    class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <!-- Selection Indicator -->
                  <div v-if="selectedMaterial" class="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20 animate-in fade-in zoom-in duration-200">
                    <i class="mdi mdi-check-circle text-sm"></i>
                    <span class="text-[10px] font-black uppercase tracking-tighter">Selected</span>
                  </div>
                </div>

                <!-- Floating Results Dropdown -->
                <div v-if="showResults" 
                     class="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] z-[500] max-h-[400px] overflow-y-auto ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                  
                  <!-- Searching State -->
                  <div v-if="searching" class="p-8 flex flex-col items-center justify-center text-slate-400">
                    <div class="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span class="text-[10px] font-black uppercase tracking-widest">Querying Inventory...</span>
                  </div>

                  <!-- Results List -->
                  <ul v-else class="p-2">
                    <li v-for="item in displayInventory" :key="item.id"
                        @click="selectMaterial(item)"
                        class="p-4 hover:bg-emerald-50 dark:hover:bg-emerald-400/10 cursor-pointer rounded-xl transition-all border border-transparent hover:border-emerald-500/20 group flex items-center justify-between"
                    >
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/10 transition-colors">
                          <i class="mdi mdi-package-variant-closed text-xl"></i>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{{ item.material_name }}</span>
                          <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{{ item.material_code }}</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded uppercase group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-600 transition-colors">
                          {{ item.quantity_on_hand }} {{ item.unit_of_measure }}
                        </span>
                      </div>
                    </li>
                  </ul>

                  <!-- No Results -->
                  <div v-if="inventory.length === 0 && !searching" class="p-12 text-center text-slate-400">
                    <i class="mdi mdi-package-variant text-4xl mb-3 block opacity-20"></i>
                    <p class="text-xs font-bold uppercase tracking-widest">No materials found matching "{{ materialSearch }}"</p>
                  </div>
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

    <!-- Transaction History Section -->
    <div class="mt-12">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Receipts</h2>
            <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Track all stock check-in transactions with batch numbers</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="fetchRecentLogs"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <i class="mdi mdi-refresh" :class="{'animate-spin': loadingLogs}"></i>
              Refresh
            </button>
            <button
              @click="exportToCSV"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <i class="mdi mdi-download"></i>
              Export CSV
            </button>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="relative">
              <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search batch number, material..."
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <input
              v-model="filterReference"
              type="text"
              placeholder="Filter by Reference/LPO"
              class="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              v-model="filterDateFrom"
              type="date"
              class="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              v-model="filterDateTo"
              type="date"
              class="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <!-- Transaction Table -->
        <div class="overflow-x-auto">
          <div v-if="loadingLogs" class="p-12 text-center">
            <i class="mdi mdi-loading mdi-spin text-4xl text-slate-400"></i>
            <p class="text-sm text-slate-500 mt-4">Loading transaction history...</p>
          </div>
          <table v-else-if="filteredLogs.length > 0" class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Batch #</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Material</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Quantity</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Location</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Reference</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Received By</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Notes</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-xs font-bold text-slate-900 dark:text-white font-mono">{{ log.batch_number }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs font-bold text-slate-900 dark:text-white">{{ log.material?.material_name || 'N/A' }}</p>
                  <p class="text-[10px] text-slate-500 dark:text-gray-400">{{ log.material?.material_code }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">
                    <i class="mdi mdi-plus-circle-outline"></i>
                    {{ Math.abs(log.quantity) }} {{ log.material?.unit_of_measure || 'units' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-slate-600 dark:text-slate-300">{{ log.location || 'N/A' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-slate-600 dark:text-slate-300 font-mono">{{ log.reference_no || '-' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-slate-600 dark:text-slate-300">{{ log.user?.name || 'System' }}</span>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs text-slate-600 dark:text-slate-300">{{ formatDateTime(log.created_at) }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-slate-500 dark:text-gray-400 italic">{{ log.notes || '-' }}</span>
                </td>
                <td class="px-6 py-4">
                  <button 
                    @click="deleteLog(log.id)"
                    class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Log"
                  >
                    <i class="mdi mdi-delete-outline text-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="p-12 text-center">
            <i class="mdi mdi-package-variant-closed-plus text-5xl text-slate-300 dark:text-slate-600"></i>
            <p class="text-sm text-slate-500 dark:text-gray-400 mt-4">No check-in transactions found</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredLogs.length > logsPerPage" class="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p class="text-xs text-slate-500 dark:text-gray-400">
            Showing {{ ((currentPage - 1) * logsPerPage) + 1 }} to {{ Math.min(currentPage * logsPerPage, filteredLogs.length) }} of {{ filteredLogs.length }} transactions
          </p>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
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
const materialSearch = ref('')
const searching = ref(false)
let searchTimeout: any = null

const onSearchInput = (event: any) => {
  const query = event.target.value
  showResults.value = true
  if (searchTimeout) clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      await fetchInventory({ search: query })
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
}

watch([() => form.value.material_id, inventory], () => {
  if (!form.value.material_id) {
    selectedMaterial.value = null
    return
  }
  const found = (inventory.value || []).find(i => i.id === form.value.material_id)
  if (found) {
    selectedMaterial.value = found
    // Update search box if empty or just an ID
    if (!materialSearch.value || materialSearch.value === found.id.toString()) {
      materialSearch.value = found.material_name
    }
  }
}, { immediate: true })

const displayInventory = computed(() => {
  const list = Array.isArray(inventory.value) ? [...inventory.value] : []
  // Only include selected material at the top if we are NOT actively searching
  if (!searching.value && !materialSearch.value && selectedMaterial.value && !list.find(i => i.id === selectedMaterial.value.id)) {
    list.unshift(selectedMaterial.value)
  }
  return list
})

// Transaction History State
const recentLogs = ref<any[]>([])
const loadingLogs = ref(false)
const searchQuery = ref('')
const filterReference = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const currentPage = ref(1)
const logsPerPage = 10

// Fetch recent check-in logs
const fetchRecentLogs = async () => {
  loadingLogs.value = true
  try {
    const response = await api.get('/api/procurement-stores/inventory-logs', {
      params: { type: 'check_in' }
    })
    recentLogs.value = response.data.data || []
  } catch (err) {
    console.error('Failed to fetch logs:', err)
  } finally {
    loadingLogs.value = false
  }
}

// Computed: Filtered logs
const filteredLogs = computed(() => {
  let logs = recentLogs.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    logs = logs.filter(log => 
      log.batch_number?.toLowerCase().includes(query) ||
      log.material?.material_name?.toLowerCase().includes(query) ||
      log.material?.material_code?.toLowerCase().includes(query)
    )
  }

  // Reference filter
  if (filterReference.value) {
    logs = logs.filter(log => log.reference_no?.toLowerCase().includes(filterReference.value.toLowerCase()))
  }

  // Date range filter
  if (filterDateFrom.value) {
    logs = logs.filter(log => new Date(log.created_at) >= new Date(filterDateFrom.value))
  }
  if (filterDateTo.value) {
    logs = logs.filter(log => new Date(log.created_at) <= new Date(filterDateTo.value + 'T23:59:59'))
  }

  return logs
})

// Computed: Paginated logs
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * logsPerPage
  const end = start + logsPerPage
  return filteredLogs.value.slice(start, end)
})

// Computed: Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / logsPerPage)
})

// Format date time helper
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Export to CSV
const exportToCSV = () => {
  const headers = ['Batch Number', 'Material', 'Code', 'Quantity', 'Unit', 'Location', 'Reference', 'Received By', 'Date', 'Notes']
  const rows = filteredLogs.value.map(log => [
    log.batch_number || '',
    log.material?.material_name || '',
    log.material?.material_code || '',
    Math.abs(log.quantity),
    log.material?.unit_of_measure || '',
    log.location || '',
    log.reference_no || '',
    log.user?.name || 'System',
    formatDateTime(log.created_at),
    log.notes || ''
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `check-in-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const deleteLog = async (id: number) => {
  if (!confirm('Are you sure you want to delete this log entry? This will revert the stock adjustment.')) return
  
  loadingLogs.value = true
  try {
    await api.delete(`/api/procurement-stores/inventory-logs/${id}`)
    await fetchRecentLogs()
    await fetchInventory()
  } catch (err) {
    console.error('Failed to delete log:', err)
    alert('Failed to delete log. Please try again.')
  } finally {
    loadingLogs.value = false
  }
}

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
    await fetchRecentLogs() // Refresh transaction history
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
  fetchRecentLogs()
})
</script>
