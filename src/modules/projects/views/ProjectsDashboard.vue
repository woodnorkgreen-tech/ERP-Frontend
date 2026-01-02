<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-8">
        <!-- Dashboard Header -->
        <DashboardHeader :loading="loading" @refresh="handleRefresh" />

        <!-- Executive Summary Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-2">Executive Summary</h2>
              <p class="text-blue-100 text-sm">Quick overview of current status and key metrics</p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm text-blue-100">Live Data</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Enquiries Summary -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="flex items-center justify-between mb-2">
                <p class="text-blue-100 text-sm font-medium">Enquiries</p>
                <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <p class="text-3xl font-bold text-white mb-1">{{ enquiryMetrics?.total_enquiries || 0 }}</p>
              <p class="text-blue-200 text-xs">Total in system</p>
            </div>

            <!-- Active Projects Summary -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="flex items-center justify-between mb-2">
                <p class="text-blue-100 text-sm font-medium">Active Projects</p>
                <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p class="text-3xl font-bold text-white mb-1">{{ projectMetrics?.active_projects || 0 }}</p>
              <p class="text-blue-200 text-xs">Currently running</p>
            </div>

            <!-- Task Completion Summary -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="flex items-center justify-between mb-2">
                <p class="text-blue-100 text-sm font-medium">Completion Rate</p>
                <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-3xl font-bold text-white mb-1">{{ taskMetrics?.completion_rate || 0 }}%</p>
              <p class="text-blue-200 text-xs">Tasks progress</p>
            </div>

            <!-- Overdue Tasks Alert -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div class="flex items-center justify-between mb-2">
                <p class="text-blue-100 text-sm font-medium">Overdue Tasks</p>
                <svg class="w-5 h-5" :class="overdueCount > 0 ? 'text-red-300' : 'text-green-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-3xl font-bold" :class="overdueCount > 0 ? 'text-red-200' : 'text-white'">{{ overdueCount }}</p>
              <p :class="overdueCount > 0 ? 'text-red-200' : 'text-blue-200'" class="text-xs">{{ overdueCount > 0 ? 'Needs attention' : 'All on track' }}</p>
            </div>
          </div>
        </div>

        <!-- Section: Department Workload -->
        <div>
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Department Workload Distribution</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">See which departments are busy and their active projects</p>
          </div>
          <DepartmentLoad ref="departmentLoadRef" :loading="loading" />
        </div>

        <!-- Section: Key Performance Indicators -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Key Performance Indicators</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Real-time metrics across all projects</p>
            </div>
            <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              <span>Updated just now</span>
            </div>
          </div>
          <KPICards
            :enquiry-metrics="enquiryMetrics"
            :project-metrics="projectMetrics"
            :task-metrics="taskMetrics"
          />
        </div>

        <!-- Section: Status Breakdown & Distribution -->
        <div>
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Status Overview</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Detailed breakdown of enquiries, phases, and priorities</p>
          </div>
          <MetricsGrid
            :enquiry-metrics="enquiryMetrics"
            :project-metrics="projectMetrics"
          />
        </div>

        <!-- Section: Visual Analytics & Activity -->
        <div>
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Pipeline & Activity</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Workflow funnel and recent team activities</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectPipelineFunnel
              :enquiry-metrics="enquiryMetrics"
              :project-metrics="projectMetrics"
            />
            <ActivityFeed
              :activities="dashboardMetrics?.recent_activities"
              :loading="loading"
              class="h-full"
            />
          </div>
        </div>

        <!-- Section: Trend Analysis -->
        <div>
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Trend Analysis</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Historical data and performance trends over time</p>
          </div>
          <ChartsSection
            :enquiry-metrics="enquiryMetrics"
            :task-metrics="taskMetrics"
          />
        </div>

        <!-- Section: Alerts & Management Tools -->
        <div>
          <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Alerts & Management</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">System notifications and dashboard controls</p>
          </div>
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="xl:col-span-1">
              <DashboardFilters @filter="handleFilter" @export="handleExport" />
            </div>
            <div class="xl:col-span-2">
              <AlertsPanel :alerts="dashboardMetrics?.alerts" />
            </div>
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
import KPICards from '../components/KPICards.vue'
import ProjectPipelineFunnel from '../components/ProjectPipelineFunnel.vue'
import ChartsSection from '../components/ChartsSection.vue'
import MetricsGrid from '../components/MetricsGrid.vue'
import AlertsPanel from '../components/AlertsPanel.vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import DashboardFilters from '../components/DashboardFilters.vue'
import DepartmentLoad from '../components/DepartmentLoad.vue'

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
