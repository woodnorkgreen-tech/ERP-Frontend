<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-poppins">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
      <div class="space-y-12">
        <!-- Dashboard Header -->
      <DashboardHeader 
        :loading="loading" 
        @refresh="handleRefresh" 
        @flash-quote="showFlashQuoter = true"
      />

      <!-- Standalone Flash Quoter Modal -->
      <div v-if="showFlashQuoter" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0">
        <div class="w-full h-full bg-white dark:bg-gray-900 overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
          <FlashQuoter @close="showFlashQuoter = false" />
        </div>
      </div>

      <!-- Executive Summary Section (Cards) -->
        <KPICards 
          :enquiry-metrics="enquiryMetrics" 
          :project-metrics="projectMetrics" 
          :task-metrics="taskMetrics"
          :metadata="metadata"
        />

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <!-- Left Column: Main Analysis -->
            <div class="xl:col-span-2 space-y-12">
                
                <!-- Section: Pipeline Funnel -->
                <div class="space-y-6">
                   <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Project <span class="text-blue-500 opacity-50">Pipeline</span></h2>
                        <p class="text-sm text-slate-500 font-medium">Overview of project progression stages.</p>
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

            </div>

            <!-- Right Column: Sidebar -->
            <div class="space-y-12">
                <!-- Section: Activity Feed -->
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Recent <span class="text-blue-500 opacity-50">Activity</span></h2>
                      <p class="text-sm text-slate-500 font-medium">Latest project updates.</p>
                    </div>
                  </div>
                  <ActivityFeed
                    :activities="dashboardMetrics?.recent_activities"
                    :loading="loading"
                    class="h-[600px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
                  />
                </div>

                <!-- Section: Alerts -->
                <div class="space-y-6">
                   <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">System <span class="text-red-500 opacity-50">Alerts</span></h2>
                      <p class="text-sm text-slate-500 font-medium">Notices and warnings.</p>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <AlertsPanel :alerts="dashboardMetrics?.alerts" />
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useProjectsDashboard } from '../composables/useProjectsDashboard'
import DashboardHeader from '../components/DashboardHeader.vue'
import ProjectPipelineFunnel from '../components/ProjectPipelineFunnel.vue'
import AlertsPanel from '../components/AlertsPanel.vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import KPICards from '../components/KPICards.vue'
import FlashQuoter from '../components/tasks/FlashQuoter.vue'

const showFlashQuoter = ref(false)

const { 
  dashboardMetrics, 
  enquiryMetrics, 
  taskMetrics, 
  projectMetrics, 
  commandCenterData,
  metadata,
  loading, 
  fetchDashboardMetrics 
} = useProjectsDashboard()

const handleRefresh = () => {
  fetchDashboardMetrics()
}

const handleProjectActivatedSignal = async () => {
  console.log('Project Activated signal received. Refreshing dashboard...')
  await fetchDashboardMetrics()
}

onMounted(() => {
  fetchDashboardMetrics()
  
  // Listen for global project activation signal (Auto-Refresh)
  window.addEventListener('project-activated', handleProjectActivatedSignal)
})

onUnmounted(() => {
  window.removeEventListener('project-activated', handleProjectActivatedSignal)
})
</script>
