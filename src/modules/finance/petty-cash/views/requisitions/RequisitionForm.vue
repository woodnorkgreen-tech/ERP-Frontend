<template>
  <transition
    enter-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-400 ease-in-out"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex justify-end">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="emit('close')"></div>
      
      <!-- Drawer Content -->
      <div class="w-full max-w-4xl bg-slate-50 dark:bg-slate-900 h-full shadow-2xl relative z-10 overflow-y-auto border-l border-slate-200 dark:border-slate-800">
        <div class="p-6 md:p-8">
          <!-- Close Button -->
          <button 
            @click="emit('close')"
            class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all shadow-sm"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
          <!-- Header Area -->
          <div class="flex items-center gap-4 mb-8">
            <button
              @click="emit('close')"
              class="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all shadow-sm"
            >
              <i class="mdi mdi-arrow-right text-2xl"></i>
            </button>
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {{ editMode ? 'Edit Requisition' : 'New Requisition' }}
              </h1>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {{ editMode ? 'Update the details of your request' : 'Complete the form below to request petty cash' }}
              </p>
              <div v-if="editMode && requisitionStatus === 'disbursed'" class="mt-2 text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-md inline-block">
                 <i class="mdi mdi-lock mr-1"></i> Financials Locked (Disbursed)
              </div>
            </div>
          </div>

      <!-- Main Form -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
      <form @submit.prevent="submitForm" class="p-8 space-y-8">
        <!-- Basic Info Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Department <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.department_id"
              required
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white font-bold transition-all"
            >
              <option value="" disabled>Select Department</option>
              <option v-for="dept in formData.departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Category <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white font-bold transition-all"
            >
              <option value="" disabled>Select Category</option>
              <option v-for="cat in formData.categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2 space-y-2">
            <label class="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Project / Enquiry (Search or Select)
            </label>
            <select
              v-model="projectSelection"
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white font-bold transition-all"
            >
              <option :value="null">None (General Office / Manual Entry)</option>
              <optgroup label="Approved Projects">
                <option v-for="p in formData.projects" :key="'p'+p.id" :value="'p'+p.id">
                  {{ p.label }}
                </option>
              </optgroup>
              <optgroup label="Enquiries">
                <option v-for="e in formData.enquiries" :key="'e'+e.id" :value="'e'+e.id">
                  {{ e.label }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- Manual Project Name (Shown if no project selected) -->
          <div v-if="!projectSelection" class="md:col-span-1 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
            <label class="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Project Name (Manual Entry)
            </label>
            <input
              v-model="form.project_name"
              placeholder="Enter project name if not listed..."
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white font-bold transition-all"
            />
          </div>

          <!-- Venue / Location -->
          <div :class="!projectSelection ? 'md:col-span-1' : 'md:col-span-2'" class="space-y-2">
            <label class="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Venue / Site Location
            </label>
            <input
              v-model="form.venue"
              placeholder="E.g., Westlands Site, Factory Floor, Client Office..."
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white font-bold transition-all"
            />
          </div>

          <div class="md:col-span-2 space-y-2">
            <label class="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              General Purpose / Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.purpose"
              required
              rows="3"
              placeholder="E.g., Travel allowance for site visit to Mombasa..."
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white transition-all"
            ></textarea>
          </div>
        </div>

        <hr class="border-slate-100 dark:border-slate-700" />

        <!-- Items Section (Bulk with Payees) -->
        <div class="space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
              {{ isPayeeCategory ? 'Recipients & Amounts' : 'Requested Items' }}
            </h3>
            <div class="flex flex-wrap items-center gap-2">
              <div v-if="loadingTeams" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <i class="mdi mdi-loading mdi-spin"></i> Finding Teams...
              </div>
              <template v-else-if="hasProjectTeams && !isFinancialLocked">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">Quick Add Team:</span>
                <button
                  v-for="(members, category) in projectTeams"
                  :key="category"
                  type="button"
                  @click="addTeamToItems(category)"
                  class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all border border-slate-200 dark:border-slate-600"
                >
                  {{ category }} ({{ members.length }})
                </button>
              </template>
              <span v-else-if="projectSelection && !loadingTeams && !hasProjectTeams" class="text-[10px] font-bold text-slate-400 italic">
                (No assigned teams found)
              </span>

              <button
                v-if="!isFinancialLocked"
                type="button"
                @click="addItem"
                class="ml-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <i class="mdi mdi-plus-circle-outline text-lg"></i>
                Add Another {{ isPayeeCategory ? 'Payee' : 'Item' }}
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="(item, index) in form.items" :key="index" class="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4 relative group">
              <button
                v-if="form.items.length > 1 && !isFinancialLocked"
                type="button"
                @click="removeItem(index)"
                class="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <i class="mdi mdi-close"></i>
              </button>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <!-- Description / Payee Name -->
                <div :class="isPayeeCategory ? 'md:col-span-4' : 'md:col-span-8'" class="space-y-1">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {{ isPayeeCategory ? 'Recipient Name / Employee' : 'Description' }}
                  </label>
                  
                  <template v-if="isPayeeCategory">
                    <div class="flex gap-2">
                      <div class="relative w-full">
                        <!-- Payee Search Input -->
                        <div class="relative">
                          <input
                            type="text"
                            v-model="item.payee_search"
                            @input="onPayeeSearch($event, index)"
                            @focus="item.show_results = true"
                            @blur="hidePayeeResults(index)"
                            :placeholder="item.payee_name || 'Search Employee or Tech Labour...'"
                            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm font-bold disabled:opacity-50"
                            :disabled="isFinancialLocked"
                          />
                          <i class="mdi mdi-magnify absolute left-3 top-2.5 text-slate-400"></i>
                          <button
                            v-if="item.payee_id || (item.payee_name && !item.is_external)"
                            @click="clearPayee(index)"
                            type="button"
                            class="absolute right-3 top-2.5 text-slate-400 hover:text-red-500"
                          >
                            <i class="mdi mdi-close"></i>
                          </button>
                        </div>
                        
                        <!-- Search Results Dropdown -->
                        <div
                          v-if="item.show_results && item.search_results && item.search_results.length > 0"
                          class="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto"
                        >
                          <button
                            v-for="result in item.search_results"
                            :key="result.type + result.id"
                            type="button"
                            @mousedown.prevent="selectPayee(index, result)"
                            class="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between group border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                          >
                            <div>
                              <div class="font-bold text-slate-900 dark:text-white text-sm">{{ result.name }}</div>
                              <div class="text-[10px] uppercase font-black tracking-wider" 
                                :class="result.type === 'employee' ? 'text-blue-500' : 'text-amber-500'">
                                {{ result.detail }}
                              </div>
                              <div v-if="result.payee_phone || result.phone" class="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-0.5">
                                <i class="mdi mdi-phone text-[9px]"></i> {{ result.payee_phone || result.phone }}
                              </div>
                            </div>
                            <i v-if="result.type === 'employee'" class="mdi mdi-account-tie text-slate-300 group-hover:text-blue-500"></i>
                            <i v-else class="mdi mdi-hammer-wrench text-slate-300 group-hover:text-amber-500"></i>
                          </button>
                        </div>
                        
                        <!-- Loading State -->
                        <div v-if="item.searching" class="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                           <i class="mdi mdi-loading mdi-spin text-blue-500 mr-2"></i> <span class="text-xs font-bold text-slate-500">Searching...</span>
                        </div>
                      </div>

                      <button 
                         v-if="!isFinancialLocked"
                         type="button"
                         @click="toggleExternal(index)"
                         class="p-2 text-slate-400 hover:text-blue-500 shrink-0"
                         :title="item.is_external ? 'Switch to Search' : 'Switch to Manual Entry'"
                      >
                         <i :class="item.is_external ? 'mdi mdi-account-search' : 'mdi mdi-account-edit'"></i>
                      </button>
                    </div>
                  </template>
                  <input
                    v-else
                    v-model="item.description"
                    :disabled="isFinancialLocked"
                    required
                    placeholder="Item description..."
                    class="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm disabled:opacity-50"
                  />
                </div>

                <!-- Purpose / Remarks per item -->
                <div v-if="isPayeeCategory" class="md:col-span-4 space-y-1">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Remarks / Detail</label>
                  <input
                    v-model="item.description"
                    :disabled="isFinancialLocked"
                    required
                    placeholder="E.g., Dinner, Transport..."
                    class="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm disabled:opacity-50"
                  />
                </div>

                <!-- Amount -->
                <div :class="isPayeeCategory ? 'md:col-span-2' : 'md:col-span-4'" class="space-y-1">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</label>
                  <input
                    v-model.number="item.amount"
                    :disabled="isFinancialLocked"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm font-bold text-right disabled:opacity-50"
                  />
                </div>

                <!-- Phone Number (Always show if Payee Category) -->
                <div v-if="isPayeeCategory" class="md:col-span-2 space-y-1">
                  <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</label>
                  <input
                    v-model="item.payee_phone"
                    :disabled="isFinancialLocked"
                    placeholder="254..."
                    class="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Summary -->
        <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-100 dark:border-slate-700/50 mt-8">
          <div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Amount Requested</span>
            <span class="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
              {{ formatCurrency(totalAmount) }}
            </span>
          </div>
          <button
            type="submit"
            :disabled="submitting"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 min-w-[200px]"
          >
            <i v-if="submitting" class="mdi mdi-loading mdi-spin text-xl"></i>
            <span v-else>{{ editMode ? 'Update Requisition' : 'Submit Requisition' }}</span>
          </button>
        </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import { useToast } from '@/modules/universal-task/composables/useToast'

const props = defineProps<{
  isOpen: boolean
  requisitionId?: number | null
  preFill: any | null
}>()

const emit = defineEmits(['close', 'success'])

const router = useRouter()
const route = useRoute()
const toast = useToast()

const editMode = computed(() => !!props.requisitionId)
const requisitionStatus = ref('')
const isFinancialLocked = computed(() => requisitionStatus.value === 'disbursed')

const submitting = ref(false)
const formData = reactive({
  departments: [] as any[],
  categories: [] as string[],
  employees: [] as any[],
  projects: [] as any[],
  enquiries: [] as any[]
})

const projectTeams = ref<Record<string, any[]>>({})
const loadingTeams = ref(false)

const projectSelection = ref<string | null>(null)

const form = reactive({
  department_id: '',
  category: '',
  purpose: '',
  project_id: null as number | null,
  project_name: '',
  venue: '',
  enquiry_id: null as number | null,
  bill_id: null as number | null,
  payee_id: null as number | null,
  payee_name: '',
  payee_phone: '',
  items: [
    { 
      description: '', 
      amount: 0, 
      payee_id: null as number | null, 
      payee_name: '', 
      payee_phone: '',
      is_external: false,
      payee_search: '',
      show_results: false,
      search_results: [] as any[],
      searching: false
    }
  ]
})

const isPayeeCategory = computed(() => {
  // Enable payee search/selection for all categories to ensure phone numbers are always available
  return true
})

const totalAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const hasProjectTeams = computed(() => {
  return Object.keys(projectTeams.value).length > 0
})

const fetchFormData = async () => {
  try {
    const response = await axios.get('/api/finance/petty-cash/requisitions/form-data')
    formData.departments = response.data.departments
    formData.categories = response.data.categories
    formData.employees = response.data.employees
    formData.projects = response.data.projects
    formData.enquiries = response.data.enquiries

    if (editMode.value) {
      fetchRequisition()
    }
  } catch (error) {
    console.error('Failed to fetch form data:', error)
  }
}

const fetchRequisition = async () => {
  if (!props.requisitionId) return
  try {
    const response = await axios.get(`/api/finance/petty-cash/requisitions/${props.requisitionId}`)
    const data = response.data.data
    
    requisitionStatus.value = data.status
    form.department_id = data.department_id
    form.category = data.category
    form.purpose = data.purpose
    
    if (data.project_id) {
      projectSelection.value = 'p' + data.project_id
    } else if (data.enquiry_id) {
      projectSelection.value = 'e' + data.enquiry_id
    }

    form.project_name = data.project_name || ''
    form.venue = data.venue || ''

    form.items = data.items.map((item: any) => ({
      description: item.description,
      amount: parseFloat(item.amount),
      payee_id: item.payee_id,
      payee_name: item.payee_name,
      payee_phone: item.payee_phone || (item.payee?.phone || ''),
      is_external: !!item.payee_name && !item.payee_id,
      payee_search: item.payee_name || (item.payee ? `${item.payee.first_name} ${item.payee.last_name}` : ''),
      show_results: false,
      search_results: [],
      searching: false
    }))

    // Map top-level payee info if available
    form.payee_id = data.payee_id || null
    form.payee_name = data.payee_name || ''
    form.payee_phone = data.payee_phone || ''
  } catch (error) {
    console.error('Failed to fetch requisition:', error)
    toast.error('Failed to load requisition data')
  }
}

// Auto-fill team members logic
watch(projectSelection, async (newVal) => {
  if (!newVal) {
    projectTeams.value = {}
    // Clear venue when no project is selected (only if not manually entered)
    if (!editMode.value && !form.venue) {
      form.venue = ''
    }
    return
  }

  loadingTeams.value = true
  try {
    let params = {}
    if (newVal.startsWith('p')) {
      params = { project_id: newVal.substring(1) }
    } else if (newVal.startsWith('e')) {
      params = { enquiry_id: newVal.substring(1) }
    }

    const response = await axios.get('/api/finance/petty-cash/requisitions/project-team-members', { params })
    const members = response.data.members || []

    // Auto-fill venue from project/enquiry data
    // Venue is stored in the enquiry, not directly on the project
    let venueValue = null
    const project = response.data.project
    const enquiry = response.data.enquiry

    if (project?.enquiry?.venue) {
      venueValue = project.enquiry.venue
    } else if (enquiry?.venue) {
      venueValue = enquiry.venue
    } else if (project?.venue) {
      // Fallback if venue was moved directly to project in future
      venueValue = project.venue
    }
    
    if (venueValue && !editMode.value) {
      form.venue = venueValue
      console.log('Auto-filled venue:', venueValue)
    }

    // Group by category
    const grouped: Record<string, any[]> = {}
    members.forEach((m: any) => {
      const cat = m.category || 'Other'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(m)
    })
    projectTeams.value = grouped
    
    if (Object.keys(grouped).length === 0) {
      console.log('No team members found for selection:', newVal)
    }
    
    // Only auto-fill initially if the items are empty or just one blank item
    if (!editMode.value) {
      const isBlank = form.items.length === 0 || 
        (form.items.length === 1 && !form.items[0].description && !form.items[0].payee_id && !form.items[0].payee_name)

      if (isBlank && members.length > 0) {
        form.items = members.map((m: any) => ({
          description: isPayeeCategory.value ? form.category : '',
          amount: 0,
          payee_id: m.payee_id,
          payee_name: m.is_internal ? '' : m.name,
          payee_phone: m.payee_phone || '',
          is_external: !m.is_internal,
          payee_search: m.name,
          show_results: false,
          search_results: [],
          searching: false
        }))
        toast.success(`Auto-filled ${members.length} total team members`)
      }
    }
  } catch (error) {
    console.error('Failed to fetch team members:', error)
    projectTeams.value = {}
  } finally {
    loadingTeams.value = false
  }
})

const addTeamToItems = (category: string) => {
  const members = projectTeams.value[category]
  if (!members || members.length === 0) return

  // Check if we should replace a single blank item
  const isOnlyBlank = form.items.length === 1 && !form.items[0].description && !form.items[0].payee_id && !form.items[0].payee_name
  
  const newItems = members.map((m: any) => ({
    description: isPayeeCategory.value ? form.category : '',
    amount: 0,
    payee_id: m.payee_id,
    payee_name: m.is_internal ? '' : m.name,
    payee_phone: m.payee_phone || '',
    is_external: !m.is_internal,
    payee_search: m.name,
    show_results: false,
    search_results: [],
    searching: false
  }))

  if (isOnlyBlank) {
    form.items = newItems
  } else {
    // Check for duplicates before adding
    const currentPayeeIds = form.items.map(i => i.payee_id).filter(id => id !== null)
    const currentPayeeNames = form.items.map(i => i.payee_name).filter(n => !!n)
    
    const filtered = newItems.filter(ni => {
      if (ni.payee_id) return !currentPayeeIds.includes(ni.payee_id)
      return !currentPayeeNames.includes(ni.payee_name)
    })

    if (filtered.length === 0) {
      toast.info(`All members from ${category} are already in the list`)
      return
    }

    form.items.push(...filtered)
  }
  
  toast.success(`Added ${newItems.length} members from ${category}`)
}

const handlePayeeToggle = () => {
  // Global toggle removed, logic now per item
}

const addItem = () => {
  form.items.push({ 
    description: '', 
    amount: 0, 
    payee_id: null, 
    payee_name: '', 
    payee_phone: '',
    is_external: false,
    payee_search: '',
    show_results: false,
    search_results: [],
    searching: false
  })
}

// Debounce timer
let debounceTimer: any = null

const onPayeeSearch = (event: Event, index: number) => {
  const query = (event.target as HTMLInputElement).value
  const item = form.items[index]
  
  // Clear any existing timer immediately
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  
  if (item.is_external) {
    item.payee_name = query
    return
  }

  if (query.length < 2) {
    item.search_results = []
    item.show_results = false
    item.searching = false // Reset searching state
    return
  }

  // Indicate searching immediately
  item.searching = true
  item.show_results = true 

  debounceTimer = setTimeout(async () => {
    try {
      const response = await axios.get('/api/finance/petty-cash/requisitions/search-payees', {
        params: { query }
      })
      item.search_results = response.data.data
    } catch (error) {
      console.error('Search failed', error)
      item.search_results = []
    } finally {
      item.searching = false
    }
  }, 400) // 400ms debounce
}

const hidePayeeResults = (index: number) => {
  setTimeout(() => {
    form.items[index].show_results = false
  }, 200)
}

const selectPayee = (index: number, result: any) => {
  const item = form.items[index]
  if (result.type === 'employee') {
    item.payee_id = result.id
    item.payee_name = '' // Backend uses ID
    item.payee_search = result.name
    item.payee_phone = result.payee_phone || result.phone || ''
  } else {
    // Technical Labour or other
    // Treat as external/manual for now, but pre-fill name
    item.payee_id = null
    item.payee_name = result.name + ' (Tech Labour)'
    item.payee_search = result.name
    item.payee_phone = result.payee_phone || result.phone || ''
    // Optionally: store technical_labour_id if backend supports it
  }
  item.show_results = false
}

const clearPayee = (index: number) => {
  const item = form.items[index]
  item.payee_id = null
  item.payee_name = ''
  item.payee_search = ''
}

const toggleExternal = (index: number) => {
  const item = form.items[index]
  item.is_external = !item.is_external
  // Clear search/selection when toggling
  if (item.is_external) {
    item.payee_id = null
    // Preserve current search string as manual name
    item.payee_name = item.payee_search
  } else {
    item.payee_name = ''
  }
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const submitForm = async () => {
  if (totalAmount.value <= 0) {
    toast.error('Total amount must be greater than zero')
    return
  }

  submitting.value = true
  try {
    // Set project/enquiry IDs based on selection
    if (projectSelection.value) {
      if (projectSelection.value.startsWith('p')) {
        form.project_id = parseInt(projectSelection.value.substring(1))
        form.enquiry_id = null
      } else if (projectSelection.value.startsWith('e')) {
        form.enquiry_id = parseInt(projectSelection.value.substring(1))
        form.project_id = null
      }
    } else {
      form.project_id = null
      form.enquiry_id = null
    }

    // If it's a single item and top-level payee is not set, sync from first item
    // This helps with backend's expectation for the main table
    if (form.items.length === 1) {
      const firstItem = form.items[0]
      if (!form.payee_id && !form.payee_name) {
        form.payee_id = firstItem.payee_id
        form.payee_name = firstItem.payee_name
        form.payee_phone = firstItem.payee_phone
      }
    }

    const response = editMode.value 
      ? await axios.put(`/api/finance/petty-cash/requisitions/${props.requisitionId}`, form)
      : await axios.post('/api/finance/petty-cash/requisitions', form)
      
    toast.success(response.data.message)
    emit('success')
    emit('close')
  } catch (error: any) {
    console.error('Submission failed:', error)
    const message = error.response?.data?.message || 'Failed to submit requisition'
    toast.error(message)
  } finally {
    submitting.value = false
  }
}

const handleQueryPreFill = () => {
  // Use prop if available, otherwise fallback to route query (though props are safer)
  const data = props.preFill || (route.query.action === 'new' ? route.query : null)
  
  // Only pre-fill if it's a new requisition (no ID) and we have data
  if (!props.requisitionId && data) {
    if (data.purpose) {
      form.purpose = data.purpose as string
      // If we have a purpose, also set it as the description for the first item
      if (form.items.length > 0) {
        form.items[0].description = data.purpose as string
      }
    }
    
    if (data.amount) {
      const amount = parseFloat(data.amount as string)
      if (!isNaN(amount) && form.items.length > 0) {
        form.items[0].amount = amount
      }
    }
 
    if (data.bill_id) {
      form.bill_id = parseInt(data.bill_id as string)
    }
 
    if (data.department_id) {
      form.department_id = String(data.department_id)
    }
 
    if (data.project_id) {
      form.project_id = parseInt(data.project_id as string)
    }
 
    if (data.project_name) {
      form.project_name = data.project_name as string
    }
 
    if (data.venue) {
      form.venue = data.venue as string
    }
 
    if (data.category) {
      form.category = data.category as string
    }
 
    if (data.project_selection) {
      projectSelection.value = data.project_selection as string
    }
  }
}

const resetForm = () => {
  form.department_id = ''
  form.category = ''
  form.purpose = ''
  form.project_id = null
  form.project_name = ''
  form.venue = ''
  form.enquiry_id = null
  form.payee_id = null
  form.payee_name = ''
  form.payee_phone = ''
  form.items = [{ 
    description: '', 
    amount: 0, 
    payee_id: null, 
    payee_name: '', 
    payee_phone: '',
    is_external: false,
    payee_search: '',
    show_results: false,
    search_results: [],
    searching: false
  }]
  projectSelection.value = null
  projectTeams.value = {}
  
  // After reset, try to pre-fill from query if applicable
  handleQueryPreFill()
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchFormData()
    if (!props.requisitionId) {
      resetForm()
    }
  }
})

// Watch for pre-fill changes in case the form is already open
watch(() => props.preFill, (newVal) => {
  if (newVal && props.isOpen && !props.requisitionId) {
    // Reset form first, then pre-fill
    resetForm()
  }
}, { deep: true })

onMounted(() => {
  if (props.isOpen) {
    fetchFormData()
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}
</script>
