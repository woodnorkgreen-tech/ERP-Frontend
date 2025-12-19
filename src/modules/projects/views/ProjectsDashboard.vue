<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <!-- Dashboard Header -->
        <DashboardHeader :loading="loading" @refresh="handleRefresh" />

        <!-- KPI Cards (Essential Numbers) -->
        <KPICards
          :enquiry-metrics="enquiryMetrics"
          :project-metrics="projectMetrics"
          :task-metrics="taskMetrics"
        />
        
        <!-- Detailed Stats (Simple Breakdown) -->
        <MetricsGrid
          :enquiry-metrics="enquiryMetrics"
          :project-metrics="projectMetrics"
        />

        <!-- Visuals & Accountability -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <!-- Pipeline Funnel -->
           <ProjectPipelineFunnel
             :enquiry-metrics="enquiryMetrics"
             :project-metrics="projectMetrics"
           />
           <!-- Activity Feed (Moved up for Accountability) -->
           <ActivityFeed
              :activities="dashboardMetrics?.recent_activities"
              :loading="loading"
              class="h-full"
           />
        </div>

        <!-- Charts Section (Trends) -->
        <ChartsSection
          :enquiry-metrics="enquiryMetrics"
          :task-metrics="taskMetrics"
        />

        <!-- Operational Tools: Filters & Alerts -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Filters Sidebar -->
          <div class="xl:col-span-1">
            <DashboardFilters @filter="handleFilter" @export="handleExport" />
          </div>

          <!-- Alerts -->
          <div class="xl:col-span-2">
            <AlertsPanel :alerts="dashboardMetrics?.alerts" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectsDashboard } from '../composables/useProjectsDashboard'
import DashboardHeader from '../components/DashboardHeader.vue'
import KPICards from '../components/KPICards.vue'

import ProjectPipelineFunnel from '../components/ProjectPipelineFunnel.vue'
import ChartsSection from '../components/ChartsSection.vue'
import MetricsGrid from '../components/MetricsGrid.vue'
import AlertsPanel from '../components/AlertsPanel.vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import DashboardFilters from '../components/DashboardFilters.vue'

const { dashboardMetrics, enquiryMetrics, taskMetrics, projectMetrics, financialMetrics, loading, fetchDashboardMetrics } = useProjectsDashboard()

const handleRefresh = () => {
  fetchDashboardMetrics()
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
