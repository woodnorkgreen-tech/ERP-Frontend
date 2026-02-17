<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Project Budgets</p>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(stats.totalBudget) }}</h3>
      </div>
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Petty Cash Spent</p>
        <h3 class="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{{ formatCurrency(stats.totalSpent) }}</h3>
      </div>
      <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Budget Utilization</p>
        <div class="flex items-center gap-3">
          <h3 class="text-2xl font-black text-slate-900 dark:text-white font-mono">{{ stats.avgUtilization }}%</h3>
          <div class="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-indigo-500 transition-all duration-1000" 
              :style="{ width: stats.avgUtilization + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Projects List -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Project Budgets</h2>
          <p class="text-xs text-slate-500">Live spend tracking for approved project budgets</p>
        </div>
        <button 
          @click="fetchData" 
          class="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
          :class="{ 'animate-spin': loading }"
        >
          <i class="mdi mdi-refresh text-xl text-slate-400"></i>
        </button>
      </div>

      <div v-if="loading" class="p-12 flex flex-col items-center justify-center space-y-4">
        <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Financial Data...</p>
      </div>

      <div v-else-if="projects.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="mdi mdi-calculator-variant text-4xl text-slate-300"></i>
        </div>
        <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Active Budgets Found</h3>
        <p class="text-sm text-slate-500 max-w-xs mx-auto mt-2">Approved project budgets with petty cash allocations will appear here once processed.</p>
      </div>

      <div v-else class="divide-y divide-slate-50 dark:divide-slate-700">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
          @click="openDetails(project)"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <span class="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-black uppercase tracking-widest">
                  {{ project.job_number }}
                </span>
                <span class="text-xs font-bold text-slate-400">#{{ project.project_id }}</span>
              </div>
              <h4 class="text-base font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                {{ project.title }}
              </h4>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-8 lg:text-right">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Budget</p>
                <p class="text-sm font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(project.totals.grand_total) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spent (PC)</p>
                <p class="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">{{ formatCurrency(project.actual_spent) }}</p>
              </div>
              <div class="col-span-2 md:col-span-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
                <div class="flex items-center gap-2 lg:justify-end">
                  <span class="text-xs font-black" :class="getUtilizationColor(getUtilization(project))">
                    {{ getUtilization(project) }}%
                  </span>
                  <div class="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-1000"
                      :class="getUtilizationBg(getUtilization(project))"
                      :style="{ width: getUtilization(project) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div v-if="!loading && projects.length > 0" class="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing {{ ((currentPage - 1) * perPage) + 1 }} - {{ Math.min(currentPage * perPage, totalItems) }} of {{ totalItems }} Projects
        </p>
        <div class="flex items-center gap-2">
          <button 
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="mdi mdi-chevron-left text-xl text-slate-400"></i>
          </button>
          <div class="flex items-center gap-1">
            <template v-for="p in lastPage" :key="p">
              <button 
                v-if="p === 1 || p === lastPage || (p >= currentPage - 1 && p <= currentPage + 1)"
                @click="handlePageChange(p)"
                class="w-10 h-10 rounded-xl text-xs font-black transition-all"
                :class="currentPage === p ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400'"
              >
                {{ p }}
              </button>
              <span v-else-if="p === currentPage - 2 || p === currentPage + 2" class="text-slate-300">...</span>
            </template>
          </div>
          <button 
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="p-2 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="mdi mdi-chevron-right text-xl text-slate-400"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <ProjectBudgetDetailsModal
      v-if="selectedProject"
      :is-open="isModalOpen"
      :project="selectedProject"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { pettyCashService } from '../services/pettyCashService'
import ProjectBudgetDetailsModal from './ProjectBudgetDetailsModal.vue'

interface ProjectBudget {
  id: number
  job_number: string
  project_id: number | string
  title: string
  actual_spent: number
  actual_spent_breakdown: {
    materials: number
    labour: number
    logistics: number
    expenses: number
  }
  totals: {
    materials: number
    labour: number
    logistics: number
    expenses: number
    grand_total: number
  }
}

const loading = ref(true)
const projects = ref<ProjectBudget[]>([])
const selectedProject = ref<ProjectBudget | null>(null)
const isModalOpen = ref(false)

// Pagination State
const currentPage = ref(1)
const perPage = ref(15)
const totalItems = ref(0)
const lastPage = ref(1)

// Overall stats from backend
const backendStats = ref({
  totalBudget: 0,
  totalSpent: 0,
  avgUtilization: 0
})

const stats = computed(() => backendStats.value)

const fetchData = async () => {
  loading.value = true
  try {
    const response = await pettyCashService.getProjectBudgetsSummary({
      page: currentPage.value,
      per_page: perPage.value
    })
    
    if (response.success && response.data) {
      projects.value = [...(response.data as any)]
      
      // Update overall dashboard stats
      const resp = response as any
      if (resp.stats) {
        backendStats.value = {
          totalBudget: resp.stats.total_budget,
          totalSpent: resp.stats.total_spent,
          avgUtilization: resp.stats.avg_utilization
        }
      }
      
      // Update pagination metadata
      if (response.meta) {
        totalItems.value = response.meta.total
        lastPage.value = response.meta.last_page
        currentPage.value = response.meta.current_page
      }
    }
  } catch (error) {
    console.error('Failed to fetch project budgets:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > lastPage.value) return
  currentPage.value = page
  fetchData()
}

const getUtilization = (project: ProjectBudget) => {
  const total = project.totals?.grand_total || 0
  if (total === 0) return 0
  return Math.round((project.actual_spent / total) * 100)
}

const getUtilizationColor = (percent: number) => {
  if (percent > 90) return 'text-rose-600 dark:text-rose-400'
  if (percent > 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

const getUtilizationBg = (percent: number) => {
  if (percent > 90) return 'bg-rose-500'
  if (percent > 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}

const formatCurrency = (amount: number) => {
  return pettyCashService.formatAmount(amount || 0)
}

const openDetails = (project: ProjectBudget) => {
  selectedProject.value = project
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedProject.value = null
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
}
</style>
