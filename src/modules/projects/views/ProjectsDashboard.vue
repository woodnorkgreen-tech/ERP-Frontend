<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
      <div class="space-y-12">
        <!-- Dashboard Header -->
        <DashboardHeader :loading="loading" @refresh="handleRefresh" />

        <!-- Executive Summary Section (Redesigned as Premium Engine) -->
        <div class="relative overflow-hidden bg-slate-900 rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-800">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
          
          <div class="relative z-10">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <nav class="flex mb-4" aria-label="Breadcrumb">
                  <ol class="inline-flex items-center space-x-1 uppercase tracking-[0.2em] text-sm font-bold">
                    <li class="text-blue-500">Projects</li>
                    <li class="flex items-center gap-1 text-slate-600">
                      <i class="mdi mdi-chevron-right text-xs"></i>
                      Project Summary
                    </li>
                  </ol>
                </nav>
                <h2 class="text-5xl font-black text-white tracking-tighter mb-3">Project <span class="text-blue-500 opacity-50">Dashboard</span></h2>
                <p class="text-slate-400 text-sm font-medium">Real-time overview of your projects and enquiries.</p>
              </div>
              <div class="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <span class="text-sm font-bold text-white uppercase tracking-[0.2em]">Live Tracking Active</span>
              </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Enquiries Metric -->
              <div class="group bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 transition-all duration-500">
                <div class="flex items-center justify-between mb-6">
                   <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                     <i class="mdi mdi-file-document-multiple-outline text-2xl"></i>
                   </div>
                   <span class="text-sm font-black text-slate-500 uppercase tracking-widest">Global</span>
                </div>
                <p class="text-4xl font-black text-white tracking-tighter mb-1">{{ enquiryMetrics?.total_enquiries || 0 }}</p>
                <p class="text-sm font-black text-blue-500 uppercase tracking-widest">Total Enquiries</p>
              </div>

              <!-- Projects Metric -->
              <div class="group bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 transition-all duration-500">
                <div class="flex items-center justify-between mb-6">
                   <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                     <i class="mdi mdi-rocket-launch-outline text-2xl"></i>
                   </div>
                   <span class="text-sm font-black text-slate-500 uppercase tracking-widest">Active</span>
                </div>
                <p class="text-4xl font-black text-white tracking-tighter mb-1">{{ projectMetrics?.active_projects || 0 }}</p>
                <p class="text-sm font-black text-indigo-500 uppercase tracking-widest">Active Projects</p>
              </div>

              <!-- Completion Metric -->
              <div class="group bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 transition-all duration-500">
                <div class="flex items-center justify-between mb-6">
                   <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                     <i class="mdi mdi-progress-check text-2xl"></i>
                   </div>
                   <span class="text-sm font-black text-slate-500 uppercase tracking-widest">Ratio</span>
                </div>
                <p class="text-4xl font-black text-white tracking-tighter mb-1">{{ taskMetrics?.completion_rate || 0 }}<span class="text-2xl opacity-50">%</span></p>
                <p class="text-sm font-black text-emerald-500 uppercase tracking-widest">Tasks Done</p>
              </div>

              <!-- Overdue Alert -->
              <div class="group bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 transition-all duration-500" :class="{'border-red-500/20': overdueCount > 0}">
                <div class="flex items-center justify-between mb-6">
                   <div class="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all" :class="overdueCount > 0 ? 'bg-red-500/20 text-red-500 border-red-500/20' : 'bg-slate-500/20 text-slate-500 border-white/5'">
                     <i class="mdi mdi-clock-alert-outline text-2xl" :class="{'animate-pulse': overdueCount > 0}"></i>
                   </div>
                   <span class="text-sm font-black text-slate-500 uppercase tracking-widest">Critical</span>
                </div>
                <p class="text-4xl font-black tracking-tighter mb-1" :class="overdueCount > 0 ? 'text-red-500' : 'text-white'">{{ overdueCount }}</p>
                <p class="text-sm font-black uppercase tracking-widest" :class="overdueCount > 0 ? 'text-red-500' : 'text-slate-500'">Overdue Tasks</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Lifecycle Intelligence -->
        <div v-if="projectMetrics" class="space-y-6">
          <PhaseProgressSection :project-metrics="projectMetrics" />
        </div>

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
                      <h3 class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Total Revenue</h3>
                      <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                        <span class="text-slate-400 text-lg mr-1">$</span>{{ financialMetrics?.revenue?.toLocaleString() || 0 }}
                      </p>
                    </div>
                    <div class="group relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div class="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 bg-red-500 opacity-5"></div>
                      <h3 class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Operational Cost</h3>
                      <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                        <span class="text-slate-400 text-lg mr-1">$</span>{{ financialMetrics?.cost?.toLocaleString() || 0 }}
                      </p>
                    </div>
                    <div class="group relative p-8 bg-black dark:bg-emerald-500 rounded-[2.5rem] shadow-xl overflow-hidden">
                      <div class="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-12 -mt-12 bg-white opacity-20"></div>
                      <h3 class="text-sm font-bold text-slate-300 dark:text-emerald-950 uppercase tracking-[0.3em] mb-4">Net Profitability</h3>
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
                    <DepartmentLoad ref="departmentLoadRef" :loading="loading" />
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

const { dashboardMetrics, enquiryMetrics, taskMetrics, projectMetrics, financialMetrics, loading, fetchDashboardMetrics } = useProjectsDashboard()

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
