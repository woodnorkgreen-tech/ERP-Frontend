<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Production Dashboard</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Real-time overview of production activities</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeJobsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ completedTodayCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Hours Today</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalHoursToday }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Technicians Active</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeTechniciansCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/production/job-cards"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-2 mr-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">View Job Cards</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Manage all job cards</p>
          </div>
        </router-link>

        <router-link
          to="/production/work-orders"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-2 mr-3">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Work Orders</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">View work orders</p>
          </div>
        </router-link>

        <router-link
          to="/production/reports"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-3">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Reports</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">View analytics</p>
          </div>
        </router-link>

        <button
          @click="createNewJobCard"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
        >
          <div class="shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-lg p-2 mr-3">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Create Job Card</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Start new job</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Job Cards -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Job Cards</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Loading recent activity...</p>
          </div>
          <div v-else-if="recentJobCards.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent job cards
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="jobCard in recentJobCards"
              :key="jobCard.id"
              class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ `Daily Card - ${jobCard.date}` }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ `Worker: ${jobCard.worker?.name || 'Unknown'}` }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(jobCard.updated_at) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  :class="getStatusClass(jobCard.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ formatStatus(jobCard.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technician Status -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Technician Status</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Loading technician status...</p>
          </div>
          <div v-else-if="technicianStatus.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            No technician data available
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="technician in technicianStatus"
              :key="technician.id"
              class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  :class="technician.is_active ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'"
                  class="w-3 h-3 rounded-full"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ technician.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ technician.employee_number }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ technician.is_active ? 'Active' : 'Inactive' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ (technician as any).current_job ? `On ${(technician as any).current_job}` : 'Available' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobCards, useProductionReports } from '../composables/useJobCards'
import type { JobCard, Technician } from '../types'

const router = useRouter()
const { jobCards, loading, fetchJobCards } = useJobCards()
const { technicians, fetchTechnicians } = useProductionReports()

const recentJobCards = ref<JobCard[]>([])
const technicianStatus = ref<Technician[]>([])

const activeJobsCount = computed(() => {
  const jobCardData = Array.isArray(jobCards.value) ? jobCards.value : jobCards.value.data || []
  return jobCardData.filter(job => job.status === 'pending_approval').length
})

const completedTodayCount = computed(() => {
  const today = new Date().toDateString()
  const jobCardData = Array.isArray(jobCards.value) ? jobCards.value : jobCards.value.data || []
  return jobCardData.filter(job => 
    job.status === 'approved' && 
    new Date(job.approved_at || '').toDateString() === today
  ).length
})

const totalHoursToday = computed(() => {
  const jobCardData = Array.isArray(jobCards.value) ? jobCards.value : jobCards.value.data || []
  return jobCardData
    .filter(job => job.status === 'approved')
    .reduce((total, job) => total + job.total_hours, 0)
    .toFixed(1)
})

const activeTechniciansCount = computed(() => {
  return technicianStatus.value.filter(tech => tech.is_active).length
})

const getStatusClass = (status?: string) => {
  const classes = {
    draft: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    pending_approval: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    approved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const formatStatus = (status?: string) => {
  return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const refreshData = async () => {
  await Promise.all([
    fetchJobCards({ per_page: 10 }),
    fetchTechnicians()
  ])
  
  // Update recent job cards (last 5 updated)
  const jobCardData = Array.isArray(jobCards.value) ? jobCards.value : jobCards.value.data || []
  recentJobCards.value = jobCardData
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
  
  // Update technician status with mock data for current job
  technicianStatus.value = technicians.value.map(tech => ({
    ...tech,
    current_job: Math.random() > 0.5 ? `Job-${Math.floor(Math.random() * 1000)}` : undefined
  }))
}

const createNewJobCard = () => {
  router.push({ name: 'production-job-cards', query: { create: 'true' } })
}

onMounted(() => {
  refreshData()
})
</script>
