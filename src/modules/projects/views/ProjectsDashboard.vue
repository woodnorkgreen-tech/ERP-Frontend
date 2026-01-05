<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
      <div class="space-y-12">
        <!-- Dashboard Header -->
        <DashboardHeader :loading="loading" @refresh="handleRefresh" />

        <!-- Executive Summary Section (Modular KPI Engine) -->
        <KPICards 
          :enquiry-metrics="enquiryMetrics" 
          :project-metrics="projectMetrics" 
          :task-metrics="taskMetrics"
          :metadata="metadata"
        />

        <!-- Section: Operational Intelligence (New) -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Operational <span class="text-blue-500 opacity-50">Intelligence</span></h2>
              <p class="text-sm text-slate-500 font-medium">Proactive tactical recommendations based on system telemetry.</p>
            </div>
            <div class="flex items-center gap-2">
               <span class="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-lg">AI Assisted</span>
            </div>
          </div>
          <SuggestionsPanel :suggestions="suggestions" :loading="loading" />
        </div>

        <!-- Section: Lifecycle Intelligence -->
        <div v-if="projectMetrics" class="space-y-6">
          <PhaseProgressSection :project-metrics="projectMetrics" />
        </div>

        <!-- Section: Tactical Metrics Grid -->
        <MetricsGrid 
          :enquiry-metrics="enquiryMetrics" 
          :project-metrics="projectMetrics" 
          :metadata="metadata"
        />

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <!-- Left Column: Main Analysis -->
            <div class="xl:col-span-2 space-y-12">
                <!-- Section: Financial Intelligence -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Financial <span class="text-emerald-500 opacity-50">Summary</span></h2>
                      <p class="text-sm text-slate-500 font-medium">Project revenue, costs, and profit overview.</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="group relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div class="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 bg-emerald-500 opacity-5"></div>
                      <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Total Revenue</h3>
                        <div class="group/tooltip relative">
                          <i class="mdi mdi-information-outline text-slate-300 hover:text-emerald-500 cursor-help transition-colors"></i>
                          <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                            <div class="font-black uppercase tracking-widest mb-2 text-emerald-400">Data Criteria</div>
                            Combined projected revenue from estimated budgets and approved quotes for all active projects. Prioritizes approved quotes when available, falls back to project estimates.
                            <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
                          </div>
                        </div>
                      </div>
                      <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                        <span class="text-slate-400 text-lg mr-1">$</span>{{ financialMetrics?.revenue?.toLocaleString() || 0 }}
                      </p>
                    </div>
                    <div class="group relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div class="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 bg-red-500 opacity-5"></div>
                      <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Cost</h3>
                        <div class="group/tooltip relative">
                          <i class="mdi mdi-information-outline text-slate-300 hover:text-red-500 cursor-help transition-colors"></i>
                          <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                            <div class="font-black uppercase tracking-widest mb-2 text-red-400">Data Criteria</div>
                            Total budgeted costs from detailed project budgets and task-level cost breakdowns. Uses task-specific budgets when available, otherwise falls back to project-level budget estimates.
                            <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
                          </div>
                        </div>
                      </div>
                      <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                        <span class="text-slate-400 text-lg mr-1">$</span>{{ financialMetrics?.cost?.toLocaleString() || 0 }}
                      </p>
                    </div>
                    <div class="group relative p-8 bg-black dark:bg-emerald-500 rounded-[2.5rem] shadow-xl overflow-hidden">
                      <div class="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 bg-white opacity-20"></div>
                      <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-bold text-slate-300 dark:text-emerald-950 uppercase tracking-[0.3em]">Net Profitability</h3>
                        <div class="group/tooltip relative">
                          <i class="mdi mdi-information-outline text-white/70 hover:text-white cursor-help transition-colors"></i>
                          <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                            <div class="font-black uppercase tracking-widest mb-2 text-emerald-400">Data Criteria</div>
                            Net profit calculated as total revenue minus operational costs. Margin percentage shows profitability ratio. Green indicates healthy margins, red suggests cost optimization needed.
                            <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
                          </div>
                        </div>
                      </div>
                      <p class="text-3xl font-black text-white dark:text-emerald-950 tracking-tighter">
                        <span class="opacity-50 text-lg mr-1">$</span>{{ financialMetrics?.profit?.toLocaleString() || 0 }}
                      </p>
                      <div class="mt-4 flex items-center gap-2">
                        <span class="px-3 py-1 bg-white/10 dark:bg-emerald-950/20 text-white dark:text-emerald-950 text-sm font-bold rounded-lg">
                          {{ financialMetrics?.margin || 0 }}% MARGIN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section: Department Workload -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Division <span class="text-blue-500 opacity-50">Workload</span></h2>
                      <p class="text-sm text-slate-500 font-medium">Distribution of operational capacity across departments.</p>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <DepartmentLoad 
                      ref="departmentLoadRef" 
                      :loading="loading" 
                      :command-center-data="commandCenterData"
                      :metadata="metadata"
                    />
                  </div>
                </div>

                <!-- Section: Trend Analysis -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Performance <span class="text-blue-500 opacity-50">Trends</span></h2>
                      <p class="text-sm text-slate-500 font-medium">Historical data trajectory and predictive performance.</p>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <ChartsSection
                        :enquiry-metrics="enquiryMetrics"
                        :task-metrics="taskMetrics"
                    />
                  </div>
                </div>
            </div>

            <!-- Right Column: Sidebar Intelligence -->
            <div class="space-y-12">
                <!-- Section: Activity Feed -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Mission <span class="text-blue-500 opacity-50">Pulse</span></h2>
                      <p class="text-sm text-slate-500 font-medium">Real-time chronicle of team deployments.</p>
                    </div>
                  </div>
                  <ActivityFeed
                    :activities="dashboardMetrics?.recent_activities"
                    :loading="loading"
                    class="h-[600px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
                  />
                </div>

                <!-- Section: Filters & Tools -->
                <div class="space-y-6">
                   <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
                        <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Filters & Export</h3>
                        <DashboardFilters @filter="handleFilter" @export="handleExport" />
                   </div>
                </div>
            </div>
        </div>

        <!-- Section: Pipeline Funnel -->
        <div class="space-y-6">
           <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Operational <span class="text-blue-500 opacity-50">Pipeline</span></h2>
                <p class="text-sm text-slate-500 font-medium">Conversion flow from enquiry reception to active project status.</p>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
              <ProjectPipelineFunnel
                :enquiry-metrics="enquiryMetrics"
                :project-metrics="projectMetrics"
                :command-center-data="commandCenterData"
                :metadata="metadata"
              />
          </div>
        </div>

        <!-- Section: Alerts & Management -->
        <div class="space-y-6">
           <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Intelligence <span class="text-red-500 opacity-50">Alerts</span></h2>
              <p class="text-sm text-slate-500 font-medium">Critical system notifications and operational anomalies.</p>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <AlertsPanel :alerts="dashboardMetrics?.alerts" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useProjectsDashboard } from '../composables/useProjectsDashboard'
import DashboardHeader from '../components/DashboardHeader.vue'
import ProjectPipelineFunnel from '../components/ProjectPipelineFunnel.vue'
import ChartsSection from '../components/ChartsSection.vue'
import AlertsPanel from '../components/AlertsPanel.vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import DashboardFilters from '../components/DashboardFilters.vue'
import DepartmentLoad from '../components/DepartmentLoad.vue'
import PhaseProgressSection from '../components/PhaseProgressSection.vue'
import SuggestionsPanel from '../components/SuggestionsPanel.vue'
import KPICards from '../components/KPICards.vue'
import MetricsGrid from '../components/MetricsGrid.vue'

const { 
  dashboardMetrics, 
  enquiryMetrics, 
  taskMetrics, 
  projectMetrics, 
  financialMetrics, 
  suggestions,
  commandCenterData,
  metadata,
  loading, 
  fetchDashboardMetrics 
} = useProjectsDashboard()

const overdueCount = computed(() => taskMetrics.value?.overdue_tasks || 0)
const departmentLoadRef = ref<InstanceType<typeof DepartmentLoad> | null>(null)

const handleRefresh = () => {
  fetchDashboardMetrics()
  // Also refresh department load data
  if (departmentLoadRef.value) {
    departmentLoadRef.value.refresh()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFilter = (filters: any) => {
  // Apply filters to dashboard data
  console.log('Filters applied:', filters)
  // Here you would typically filter the dashboard metrics based on the filters
  // For now, we'll just log them and could extend the composable to handle filtering
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleExport = (data: any) => {
  console.log('Export requested:', data)
  // TODO: Implement export functionality
  // This would call an API endpoint to generate and download the export
}

onMounted(() => {
  fetchDashboardMetrics()
})
</script>
