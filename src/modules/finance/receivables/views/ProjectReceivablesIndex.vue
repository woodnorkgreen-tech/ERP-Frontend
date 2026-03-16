<template>
  <div class="h-full flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
    <!-- Header Area -->
    <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
      <div class="flex items-center justify-between max-w-[1600px] mx-auto w-full">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Project Billing & Deposits</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Track mobilization deposits and authorized releases across all projects.</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mt-6 flex gap-6 border-b border-slate-100 dark:border-slate-800">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="selectedTab = (tab.id as any)"
          class="pb-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all"
          :class="selectedTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-2 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-auto p-6 custom-scrollbar">
      <div class="max-w-[1600px] mx-auto w-full h-full flex flex-col">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <i class="mdi mdi-lock-clock text-xl"></i>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Release</p>
                <div class="flex items-baseline gap-2">
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ stats.awaiting_release }}</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <i class="mdi mdi-factory text-xl"></i>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Production</p>
                <div class="flex items-baseline gap-2">
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ stats.in_production }}</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <i class="mdi mdi-check-decagram text-xl"></i>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settled</p>
                <div class="flex items-baseline gap-2">
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ stats.settled }}</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <i class="mdi mdi-cash-multiple text-xl"></i>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Outstanding</p>
                <div class="flex items-baseline gap-2">
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(stats.total_outstanding) }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Row -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 shrink-0">
          <div class="flex-1 min-w-[300px] max-w-md">
            <div class="relative group">
              <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
              <input 
                v-model="searchQuery"
                type="text" 
                class="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Search by job number, client, or title..."
              />
            </div>
          </div>
        </div>

        <!-- Data Area (Table) -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[400px]">
          
          <div v-if="loading" class="flex-1 flex flex-col items-center justify-center p-12">
            <div class="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p class="text-slate-500 dark:text-slate-400 font-medium">Loading receivables data...</p>
          </div>

          <div v-else-if="filteredEnquiries.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
              <i class="mdi mdi-check-all text-4xl text-emerald-500"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">All Clear!</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              There are no projects currently awaiting a deposit.
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project & Job #</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Release Status</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mobilization Progress</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr v-for="enquiry in filteredEnquiries" :key="enquiry.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <!-- Project & Job # -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                        <i :class="[getReleaseIcon(enquiry.status), getReleaseColor(enquiry.status)]"></i>
                      </div>
                      <div>
                        <div class="font-bold text-slate-900 dark:text-white">{{ enquiry.title }}</div>
                        <div class="text-xs font-black text-orange-600 dark:text-orange-400 tracking-wider">
                           {{ enquiry.job_number || 'STAGING' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Client -->
                  <td class="px-6 py-4">
                    <div class="font-medium text-slate-900 dark:text-white">{{ enquiry.client?.full_name || 'Walk-in' }}</div>
                    <div class="text-[10px] text-slate-400">{{ enquiry.client?.phone || '--' }}</div>
                  </td>

                  <!-- Release Status -->
                  <td class="px-6 py-4">
                     <span 
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                        :class="getStatusBadgeClass(enquiry.status)"
                     >
                        {{ formatStatus(enquiry.status) }}
                     </span>
                  </td>

                  <!-- Mobilization Progress -->
                  <td class="px-6 py-4">
                     <div class="w-48">
                        <div class="flex items-center justify-between mb-1.5">
                           <span class="text-[10px] font-bold text-slate-500">Deposit received</span>
                           <span class="text-[10px] font-bold" :class="enquiry.finance_progress >= 70 ? 'text-emerald-600' : 'text-orange-600'">
                              {{ enquiry.finance_progress || 0 }}%
                           </span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex relative">
                           <div 
                              class="h-full bg-emerald-500 transition-all duration-500"
                              :style="`width: ${enquiry.finance_progress || 0}%`"
                           ></div>
                           <div class="absolute h-full w-0.5 bg-white/50 dark:bg-white/10 z-10" style="left: 70%; transform: translateX(-50%);"></div>
                        </div>
                     </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-right">
                    <button 
                      @click="openFinanceModal(enquiry)"
                      class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm group"
                    >
                      <i class="mdi mdi-cash-register text-lg text-slate-400 group-hover:text-blue-500"></i>
                      <span>Manage Release</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- The Finance Release Modal -->
    <EnquiryFinanceModal 
      v-if="showFinanceModal && selectedEnquiry"
      :show="showFinanceModal"
      :enquiry="selectedEnquiry"
      @close="closeFinanceModal"
      @released="handleProjectReleased"
      @updated="fetchEnquiries"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'
import type { ProjectEnquiry } from '@/modules/projects/types/enquiry'
import EnquiryFinanceModal from '../components/EnquiryFinanceModal.vue'

// State
const loading = ref(true)
const enquiries = ref<any[]>([])
const searchQuery = ref('')
const showFinanceModal = ref(false)
const selectedEnquiry = ref<ProjectEnquiry | null>(null)
const selectedTab = ref<'awaiting' | 'production' | 'settled' | 'all'>('awaiting')

const tabs = computed<{ id: 'awaiting' | 'production' | 'settled' | 'all', label: string, count: number }[]>(() => [
  { id: 'awaiting', label: 'Awaiting Release', count: stats.value.awaiting_release },
  { id: 'production', label: 'In Production', count: stats.value.in_production },
  { id: 'settled', label: 'Settled', count: stats.value.settled },
  { id: 'all', label: 'All Projects', count: enquiries.value.length }
])

const stats = ref({
   awaiting_release: 0,
   in_production: 0,
   settled: 0,
   total_outstanding: 0
})

// Computed
const awaitingDepositCount = computed(() => enquiries.value.filter(e => e.status === 'awaiting_deposit').length)

const filteredEnquiries = computed(() => {
  let result = enquiries.value
  
  // Tab Filter
  if (selectedTab.value === 'awaiting') {
     result = result.filter(e => (e.status === 'awaiting_deposit' || e.status === 'quote_approved') && e.finance_progress < 100)
  } else if (selectedTab.value === 'production') {
     result = result.filter(e => (e.status === 'planning' || e.status === 'in_progress' || e.status === 'completed') && e.finance_progress < 100)
  } else if (selectedTab.value === 'settled') {
     result = result.filter(e => e.finance_progress >= 100)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(e => 
      e.title.toLowerCase().includes(query) ||
      e.job_number?.toLowerCase().includes(query) ||
      e.enquiry_number.toLowerCase().includes(query) ||
      e.client?.full_name?.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Methods
const fetchEnquiries = async () => {
  loading.value = true
  try {
    // Single call using view=receivables, which covers:
    // awaiting_deposit (Finance Gate pending), quote_approved (legacy),
    // planning, in_progress (active), completed (for Settled tab)
    const response = await api.get('/api/projects/enquiries', {
      params: { 
        view: 'receivables',
        per_page: 500
      }
    })
    
    const all = response.data.data?.data || []

    enquiries.value = all.map((e: any) => ({
       ...e,
       finance_progress: typeof e.payment_progress_percentage === 'number' 
          ? e.payment_progress_percentage 
          : (e.status === 'completed' ? 100 : 0)
    }))

    updateStats()
  } catch (error) {
    console.error('Failed to fetch project billing data:', error)
  } finally {
    loading.value = false
  }
}


const updateStats = () => {
   stats.value.awaiting_release = enquiries.value.filter(e => (e.status === 'awaiting_deposit' || e.status === 'quote_approved') && e.finance_progress < 100).length
   stats.value.in_production = enquiries.value.filter(e => (e.status === 'planning' || e.status === 'in_progress' || e.status === 'completed') && e.finance_progress < 100).length
   stats.value.settled = enquiries.value.filter(e => e.finance_progress >= 100).length
   // Total outstanding calculation would need actual balance data from backend
}

const getReleaseIcon = (status: string) => {
   if (status === 'awaiting_deposit') return 'mdi mdi-lock'
   if (status === 'planning' || status === 'in_progress') return 'mdi mdi-factory'
   if (status === 'completed') return 'mdi mdi-check-circle'
   return 'mdi mdi-help'
}

const getReleaseColor = (status: string) => {
   if (status === 'awaiting_deposit') return 'text-emerald-500'
   if (status === 'planning' || status === 'in_progress') return 'text-blue-500'
   if (status === 'completed') return 'text-emerald-500'
   return 'text-slate-400'
}

const getStatusBadgeClass = (status: string) => {
   if (status === 'awaiting_deposit') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
   if (status === 'planning') return 'bg-blue-50 text-blue-600 border-blue-100'
   if (status === 'in_progress') return 'bg-indigo-50 text-indigo-600 border-indigo-100'
   if (status === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
   return 'bg-slate-50 text-slate-600 border-slate-100'
}

const formatStatus = (status: string) => {
   return status.replace('_', ' ')
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
        style: 'currency', 
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0)
}

const openFinanceModal = (enquiry: ProjectEnquiry) => {
  selectedEnquiry.value = enquiry
  showFinanceModal.value = true
}

const closeFinanceModal = () => {
  showFinanceModal.value = false
  setTimeout(() => {
    selectedEnquiry.value = null
  }, 300)
}

const handleProjectReleased = () => {
  // Instead of removing, we refresh to update statuses and categories
  fetchEnquiries()
  closeFinanceModal()
}

onMounted(() => {
  fetchEnquiries()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.4);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.6);
}
</style>
