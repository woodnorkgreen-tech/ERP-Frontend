<template>
  <div class="p-8 space-y-6 max-w-[1800px] mx-auto">
    <!-- Premium Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Issue <span class="text-rose-500 text-3xl opacity-50">/</span> Stock
        </h1>
        <p class="text-slate-500 dark:text-gray-400 font-medium mt-1">Deduct materials from stock for project use.</p>
      </div>
      <button @click="$router.push('/stores/batch-check-out')" class="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-rose-600/30 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest">
        <i class="mdi mdi-layers-minus text-lg"></i>
        SWITCH TO BATCH MODE
      </button>
    </div>

    <!-- Main Content: Form + Transaction History Side by Side -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Check-Out Form (1/3 width) -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl sticky top-6">
          <div class="p-8 space-y-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <i class="mdi mdi-truck-delivery-outline text-rose-500 text-xl"></i>
              </div>
              <h2 class="text-lg font-black text-slate-900 dark:text-white">Issue Material</h2>
            </div>
            
            <!-- Project Link -->
            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project</label>
              <div class="relative group">
                <i class="mdi mdi-briefcase-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-rose-500 transition-colors"></i>
                <select 
                  v-model="form.project_id"
                  class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all appearance-none"
                >
                  <option value="" disabled>Select Project...</option>
                  <option v-for="project in relevantProjects" :key="project.id" :value="project.id">
                    {{ project.project_id }} - {{ project.enquiry?.title }}
                  </option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i class="mdi mdi-chevron-down text-slate-400"></i>
                </div>
              </div>
            </div>

            <!-- Material Selection -->
            <div class="space-y-4">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Material Selection</label>
              
              <div class="relative group" ref="materialSearchContainer">
                <div class="relative">
                  <i v-if="searching" class="mdi mdi-loading mdi-spin absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 text-lg transition-colors"></i>
                  <i v-else class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-rose-500 transition-colors"></i>
                  <input 
                    v-model="materialSearch"
                    type="text"
                    placeholder="Search inventory..."
                    @input="onSearchInput"
                    @focus="showResults = true"
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all font-mono"
                  />
                  <!-- Selection Indicator -->
                  <div v-if="selectedMaterial" class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-rose-500/10 text-rose-600 rounded-lg border border-rose-500/20 animate-in fade-in zoom-in duration-200">
                    <i class="mdi mdi-check-circle text-[10px]"></i>
                    <span class="text-[9px] font-black uppercase tracking-tighter">Selected</span>
                  </div>
                </div>

                <!-- Floating Results Dropdown -->
                <div v-if="showResults" 
                     class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] z-[500] max-h-[350px] overflow-y-auto ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                  
                  <!-- Searching State -->
                  <div v-if="searching" class="p-6 flex flex-col items-center justify-center text-slate-400">
                    <div class="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <span class="text-[9px] font-black uppercase tracking-widest">Scanning Stock...</span>
                  </div>

                  <!-- Results List -->
                  <ul v-else class="p-1.5">
                    <li v-for="item in displayInventory" :key="item.id"
                        @click="selectMaterial(item)"
                        class="p-3 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer rounded-xl transition-all border border-transparent hover:border-rose-500/20 group flex items-center justify-between"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/10 transition-colors">
                          <i class="mdi mdi-package-variant text-lg"></i>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">{{ item.material_name }}</span>
                          <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{{ item.material_code }}</span>
                        </div>
                      </div>
                      <div class="text-right flex flex-col items-end">
                        <span class="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 group-hover:text-rose-600 transition-colors">
                          {{ item.available }} {{ item.unit_of_measure }}
                        </span>
                        <span class="text-[8px] font-bold text-slate-300 mt-1">{{ item.location || 'No Location' }}</span>
                      </div>
                    </li>
                  </ul>

                  <!-- No Results -->
                  <div v-if="inventory.length === 0 && !searching" class="p-8 text-center text-slate-400">
                    <i class="mdi mdi-package-variant text-3xl mb-2 block opacity-20"></i>
                    <p class="text-[9px] font-bold uppercase tracking-widest">Material not in inventory</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Quantity</label>
              <div class="relative">
                <input 
                  type="number" 
                  v-model.number="form.quantity"
                  placeholder="0.00"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-lg font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all"
                />
                <div class="absolute right-4 top-1/2 -translate-y-1/2 h-6 px-2 flex items-center bg-slate-200 dark:bg-slate-700 rounded text-[9px] font-black uppercase text-slate-500">
                  {{ selectedMaterial?.unit_of_measure || 'Units' }}
                </div>
              </div>
              <p v-if="selectedMaterial && (form.quantity || 0) > selectedMaterial.available" class="text-[9px] font-bold text-rose-500 uppercase tracking-wider">
                ⚠️ Insufficient stock
              </p>
            </div>

            <!-- Notes -->
            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Notes</label>
              <textarea 
                v-model="form.notes"
                rows="2"
                placeholder="Add notes..."
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-rose-500 transition-all"
              ></textarea>
            </div>

            <!-- Stock Info Card -->
            <div v-if="selectedMaterial" class="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white">
              <p class="text-[8px] font-black uppercase tracking-wider text-white/40 mb-2">Stock Impact</p>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-white/60">Current</span>
                  <span class="font-bold">{{ selectedMaterial.available }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/60">Issuing</span>
                  <span class="font-bold text-rose-400">-{{ form.quantity || 0 }}</span>
                </div>
                <div class="h-px bg-white/10"></div>
                <div class="flex justify-between">
                  <span class="text-white/60">Remaining</span>
                  <span class="font-black text-emerald-400">{{ selectedMaterial.available - (form.quantity || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Submit -->
            <button 
              @click="submitCheckOut"
              :disabled="submitting || !form.material_id || !form.quantity || (selectedMaterial && (form.quantity || 0) > selectedMaterial.available)"
              class="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-xl shadow-lg transition-all font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <i v-else class="mdi mdi-truck-delivery-outline text-lg"></i>
              {{ submitting ? 'Processing...' : 'Issue Stock' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Transaction History (2/3 width) -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Issuances</h2>
              <p class="text-[10px] text-slate-500 dark:text-gray-400 mt-1">Track all stock check-out transactions</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="fetchRecentLogs"
                class="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
              >
                <i class="mdi mdi-refresh text-sm" :class="{'animate-spin': loadingLogs}"></i>
                Refresh
              </button>
              <button
                @click="exportToCSV"
                class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
              >
                <i class="mdi mdi-download text-sm"></i>
                CSV
              </button>
            </div>
          </div>

          <!-- Search & Filters -->
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div class="relative">
                <i class="mdi mdi-magnify absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search batch, material..."
                  class="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>
              <select
                v-model="filterProject"
                class="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium focus:ring-2 focus:ring-rose-500 transition-all"
              >
                <option value="">All Projects</option>
                <option v-for="project in relevantProjects" :key="project.id" :value="project.id">
                  {{ project.project_id }}
                </option>
              </select>
              <input
                v-model="filterDateFrom"
                type="date"
                class="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium focus:ring-2 focus:ring-rose-500 transition-all"
              />
              <input
                v-model="filterDateTo"
                type="date"
                class="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>
          </div>

          <!-- Transaction Table -->
          <div class="overflow-x-auto max-h-[calc(100vh-400px)]">
            <div v-if="loadingLogs" class="p-12 text-center">
              <i class="mdi mdi-loading mdi-spin text-3xl text-slate-400"></i>
              <p class="text-xs text-slate-500 mt-3">Loading...</p>
            </div>
            <table v-else-if="filteredLogs.length > 0" class="w-full">
              <thead class="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-wide">Batch #</th>
                  <th class="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-wide">Material</th>
                  <th class="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-wide">Qty</th>
                  <th class="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-wide">Project</th>
                  <th class="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-wide">Date</th>
                  <th class="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                      <span class="text-[10px] font-bold text-slate-900 dark:text-white font-mono">{{ log.batch_number }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <p class="text-[10px] font-bold text-slate-900 dark:text-white">{{ log.material?.material_name || 'N/A' }}</p>
                    <p class="text-[9px] text-slate-500 dark:text-gray-400">{{ log.material?.material_code }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-0.5 px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded text-[10px] font-bold">
                      <i class="mdi mdi-minus-circle-outline text-xs"></i>
                      {{ Math.abs(log.quantity) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-[10px] text-slate-600 dark:text-slate-300">{{ getProjectName(log.project_id) }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <p class="text-[10px] text-slate-600 dark:text-slate-300">{{ formatDateTime(log.created_at) }}</p>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      @click="deleteLog(log.id)"
                      class="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Log"
                    >
                      <i class="mdi mdi-delete-outline text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="p-12 text-center">
              <i class="mdi mdi-package-variant-closed-remove text-4xl text-slate-300 dark:text-slate-600"></i>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-3">No check-out transactions found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredLogs.length > logsPerPage" class="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p class="text-[10px] text-slate-500 dark:text-gray-400">
              {{ ((currentPage - 1) * logsPerPage) + 1 }}-{{ Math.min(currentPage * logsPerPage, filteredLogs.length) }} of {{ filteredLogs.length }}
            </p>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Prev
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Next
              </button>
            </div>
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
const projects = ref<any[]>([])

interface CheckOutForm {
  material_id: string | number
  project_id: string | number
  quantity: number | null
  notes: string
  type: string
}

const form = ref<CheckOutForm>({
  material_id: '',
  project_id: '',
  quantity: null,
  notes: '',
  type: 'check_out'
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

const selectedProject = computed(() => {
  return projects.value.find(p => p.id === form.value.project_id)
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

// Transaction History State
const recentLogs = ref<any[]>([])
const loadingLogs = ref(false)
const searchQuery = ref('')
const filterProject = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const currentPage = ref(1)
const logsPerPage = 10

// Fetch recent check-out logs
const fetchRecentLogs = async () => {
  loadingLogs.value = true
  try {
    const response = await api.get('/api/procurement-stores/inventory-logs', {
      params: { type: 'check_out' }
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

  // Project filter
  if (filterProject.value) {
    logs = logs.filter(log => log.project_id == filterProject.value)
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

// Get project name helper
const getProjectName = (projectId: number | null) => {
  if (!projectId) return 'N/A'
  const project = projects.value.find(p => p.id === projectId)
  return project ? `${project.project_id}` : `Project #${projectId}`
}

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
  const headers = ['Batch Number', 'Material', 'Code', 'Quantity', 'Unit', 'Project', 'Issued By', 'Date', 'Notes']
  const rows = filteredLogs.value.map(log => [
    log.batch_number || '',
    log.material?.material_name || '',
    log.material?.material_code || '',
    Math.abs(log.quantity),
    log.material?.unit_of_measure || '',
    getProjectName(log.project_id),
    log.user?.name || 'System',
    formatDateTime(log.created_at),
    log.notes || ''
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `check-out-report-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const submitCheckOut = async () => {
  submitting.value = true
  try {
    const response = await api.post('/api/procurement-stores/check-out', {
        ...form.value
    })
    
    const batchNumber = response.data.batch_number
    alert(`✅ Stock issued successfully!\n\nBatch Number: ${batchNumber}`)
    
    // Reset form
    form.value = {
      material_id: '',
      project_id: '',
      quantity: null,
      notes: '',
      type: 'check_out'
    }
    await fetchInventory()
    await fetchRecentLogs() // Refresh transaction history
  } catch (err: any) {
    console.error('Check-out failed:', err)
    alert(err.response?.data?.message || 'Transaction failed. Check stock levels.')
  } finally {
    submitting.value = false
  }
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

onMounted(() => {
  fetchInventory()
  fetchProjects()
  fetchRecentLogs()
})
</script>
