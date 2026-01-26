<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Production Reports</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Technician performance and production analytics</p>
          </div>
          <div class="flex space-x-3">
            <select
              v-model="selectedPeriod"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="loadReports"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              @click="exportReports"
              class="px-4 py-2 bg-green-600 dark:bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
            >
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Production Analytics Overview -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Job Cards</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics?.total_job_cards || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ completionRate }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Labor Hours</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics?.total_labor_hours || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Labor Cost</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalLaborCost }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Technician Performance Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technician Performance</h3>
          <div class="space-y-3">
            <div
              v-for="technician in topPerformers"
              :key="technician.technician_id"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ technician.technician_name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ technician.job_cards_completed }} jobs • {{ technician.total_hours }}h</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ technician.efficiency_rating }}%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">efficiency</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Utilization Rate -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technician Utilization</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Utilization</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ utilizationRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${utilizationRate}%` }"
              ></div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ activeTechnicians }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-400 dark:text-gray-500">{{ totalTechnicians - activeTechnicians }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Technician Reports -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Technician Time Reports</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Technician
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Hours
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Regular Hours
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Overtime Hours
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jobs Completed
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Efficiency
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="reportsLoading">
                <td colspan="8" class="px-6 py-12 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p class="mt-2 text-gray-600 dark:text-gray-400">Loading technician reports...</p>
                </td>
              </tr>
              
              <tr v-else-if="technicianReports.length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No technician data available for selected period
                </td>
              </tr>
              
              <tr
                v-for="report in technicianReports"
                :key="report.technician_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ report.technician_name }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm text-gray-900 dark:text-white">{{ report.employee_id }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm text-gray-900 dark:text-white">{{ report.total_hours.toFixed(1) }}h</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm text-gray-900 dark:text-white">{{ report.regular_hours.toFixed(1) }}h</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm text-orange-600 dark:text-orange-400">{{ report.overtime_hours.toFixed(1) }}h</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm text-gray-900 dark:text-white">{{ report.job_cards_completed }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getEfficiencyClass(report.efficiency_rating)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ report.efficiency_rating }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">${{ report.total_cost.toFixed(2) }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Cost Analysis -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost Breakdown</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Regular Labor Cost</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">${{ regularLaborCost }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Overtime Labor Cost</span>
              <span class="text-sm font-medium text-orange-600 dark:text-orange-400">${{ overtimeLaborCost }}</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between items-center">
              <span class="text-base font-medium text-gray-900 dark:text-white">Total Labor Cost</span>
              <span class="text-base font-bold text-gray-900 dark:text-white">${{ totalLaborCost }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Average Completion Time</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ averageCompletionTime }}h</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Technician Utilization</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ utilizationRate }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">Average Efficiency</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ averageEfficiency }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductionReports } from '../composables/useJobCards'
import type { TechnicianTimeReport, ProductionAnalytics } from '../types'

const {
  analytics,
  technicians,
  loading: reportsLoading,
  fetchAnalytics,
  fetchTechnicians,
  fetchTechnicianReport
} = useProductionReports()

const selectedPeriod = ref('month')
const technicianReports = ref<TechnicianTimeReport[]>([])

const completionRate = computed(() => {
  if (!analytics.value || analytics.value.total_job_cards === 0) return 0
  return Math.round((analytics.value.completed_job_cards / analytics.value.total_job_cards) * 100)
})

const utilizationRate = computed(() => {
  return analytics.value?.technician_utilization || 0
})

const totalTechnicians = computed(() => technicians.value.length)
const activeTechnicians = computed(() => {
  return Math.round((utilizationRate.value / 100) * totalTechnicians.value)
})

const topPerformers = computed(() => {
  return analytics.value?.top_performers?.slice(0, 5) || []
})

const totalLaborCost = computed(() => {
  return analytics.value?.total_labor_cost?.toFixed(2) || '0.00'
})

const regularLaborCost = computed(() => {
  const regular = technicianReports.value.reduce((sum, report) => sum + (report.regular_hours * 25), 0) // $25/hr average
  return regular.toFixed(2)
})

const overtimeLaborCost = computed(() => {
  const overtime = technicianReports.value.reduce((sum, report) => sum + (report.overtime_hours * 37.5), 0) // 1.5x rate
  return overtime.toFixed(2)
})

const averageCompletionTime = computed(() => {
  return analytics.value?.average_completion_time?.toFixed(1) || '0.0'
})

const averageEfficiency = computed(() => {
  if (technicianReports.value.length === 0) return 0
  const total = technicianReports.value.reduce((sum, report) => sum + report.efficiency_rating, 0)
  return Math.round(total / technicianReports.value.length)
})

const getEfficiencyClass = (efficiency: number) => {
  if (efficiency >= 90) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  if (efficiency >= 75) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
}

const loadReports = async () => {
  try {
    // Load production analytics
    await fetchAnalytics(selectedPeriod.value)
    
    // Load technician reports
    if (technicians.value.length > 0) {
      const reports = await Promise.all(
        technicians.value.map(technician =>
          fetchTechnicianReport(technician.id, selectedPeriod.value)
        )
      )
      
      technicianReports.value = reports
        .filter(report => report !== undefined)
        .sort((a, b) => b.total_hours - a.total_hours) as TechnicianTimeReport[]
    }
  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

const exportReports = () => {
  // Create CSV content
  const headers = [
    'Technician Name',
    'Employee ID',
    'Total Hours',
    'Regular Hours',
    'Overtime Hours',
    'Jobs Completed',
    'Efficiency %',
    'Total Cost'
  ]
  
  const rows = technicianReports.value.map(report => [
    report.technician_name,
    report.employee_id,
    report.total_hours.toFixed(1),
    report.regular_hours.toFixed(1),
    report.overtime_hours.toFixed(1),
    report.job_cards_completed.toString(),
    report.efficiency_rating.toString(),
    report.total_cost.toFixed(2)
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `production-reports-${selectedPeriod.value}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

onMounted(async () => {
  await fetchTechnicians()
  await loadReports()
})
</script>
