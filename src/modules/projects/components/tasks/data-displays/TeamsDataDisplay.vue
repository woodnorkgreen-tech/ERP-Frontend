<template>
  <div class="teams-data-display bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
      <button
        @click="$emit('edit')"
        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors font-medium flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        <span>Edit</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Data Display -->
    <div v-else-if="teamsData" class="space-y-6">
      <!-- Teams Summary (matching TeamsTask) -->
      <div v-if="teamsSummary && teamsSummary.total > 0" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h5 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Teams Summary</h5>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-blue-600 dark:text-blue-400 font-medium">{{ teamsSummary.total }}</span>
            <span class="text-blue-700 dark:text-blue-300 ml-1">Total Teams</span>
          </div>
          <div>
            <span class="text-green-600 dark:text-green-400 font-medium">{{ teamsSummary.completed }}</span>
            <span class="text-blue-700 dark:text-blue-300 ml-1">Completed</span>
          </div>
          <div>
            <span class="text-yellow-600 dark:text-yellow-400 font-medium">{{ teamsSummary.inProgress }}</span>
            <span class="text-blue-700 dark:text-blue-300 ml-1">In Progress</span>
          </div>
          <div>
            <span class="text-red-600 dark:text-red-400 font-medium">{{ teamsSummary.overdue }}</span>
            <span class="text-blue-700 dark:text-blue-300 ml-1">Overdue</span>
          </div>
        </div>
      </div>

      <!-- Tab Navigation (matching TeamsTask) -->
      <div class="mb-6">
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="tab in teamTabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            {{ tab.label }}
            <span v-if="getTabTeamCount(tab.key) > 0" class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
              {{ getTabTeamCount(tab.key) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Teams Display for Active Tab (matching TeamsTask) -->
      <div class="space-y-4">
        <div v-if="getActiveTabTeams().length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No {{ getActiveTabLabel().toLowerCase() }} yet</h3>
          <p class="text-sm mb-6 max-w-md mx-auto">No teams have been assigned to this category.</p>
        </div>

        <div v-else class="grid gap-4">
          <div
            v-for="team in getActiveTabTeams()"
            :key="team.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800"
          >
            <!-- Team Header (matching TeamsTask) -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ team.team_type_name }}</h4>
                <span :class="getStatusColorClass(team.status)" class="px-3 py-1 text-xs rounded-full font-medium">
                  {{ getStatusLabel(team.status) }}
                </span>
              </div>
            </div>

            <!-- Team Members Section (matching TeamsTask) -->
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Members
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">({{ (team.members || []).length }})</span>
                </h5>
              </div>

              <!-- Members List (matching TeamsTask) -->
              <div v-if="(team.members || []).length > 0" class="space-y-2">
                <div
                  v-for="(member, index) in team.members || []"
                  :key="member.id"
                  class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">{{ index + 1 }}.</span>
                    <span class="text-sm text-gray-900 dark:text-white font-medium">{{ member.member_name }}</span>
                  </div>
                </div>
              </div>

              <!-- Empty Members State (matching TeamsTask) -->
              <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                No members assigned yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
      <p>No teams data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'
import api from '@/plugins/axios'

interface Props {
  task: EnquiryTask
  taskData?: any
}

const props = defineProps<Props>()

const isLoading = ref(false)
const error = ref<string | null>(null)
const teamsData = ref<any>(null)
const activeTab = ref<'workshop' | 'setup' | 'setdown'>('workshop')

const categories = [
  { key: 'workshop', label: 'Workshop Teams', color: 'bg-blue-500' },
  { key: 'setup', label: 'Setup Teams', color: 'bg-green-500' },
  { key: 'setdown', label: 'Setdown Teams', color: 'bg-orange-500' }
]

const teamTabs = [
  { key: 'workshop', label: 'Workshop Teams' },
  { key: 'setup', label: 'Setup Teams' },
  { key: 'setdown', label: 'Setdown Teams' }
] as const

const teamsSummary = computed(() => {
  if (!teamsData.value || !teamsData.value.teams) return null
  
  const teams = teamsData.value.teams
  return {
    total: teams.length,
    completed: teams.filter((t: any) => t.status === 'completed').length,
    inProgress: teams.filter((t: any) => t.status === 'in_progress').length,
    overdue: teams.filter((t: any) => t.status === 'overdue').length
  }
})

const hasAnyTeams = computed(() => {
  return teamsData.value?.teams && teamsData.value.teams.length > 0
})

const getTeamsByCategory = (categoryKey: string) => {
  if (!teamsData.value?.teams) return []
  
  // Map category keys to category IDs
  const categoryMap: Record<string, number> = {
    'workshop': 1,
    'setup': 2,
    'setdown': 3
  }
  
  const categoryId = categoryMap[categoryKey]
  
  return teamsData.value.teams.filter((team: any) => {
    // Team category might be an object with id, or just an id
    const teamCategoryId = typeof team.category === 'object' ? team.category?.id : team.category
    return teamCategoryId === categoryId
  }).map((team: any) => ({
    ...team,
    // Ensure team_type_name is available
    team_type_name: team.team_type?.name || team.team_type_name || 'Unknown Team',
    // Ensure category is a string for display
    category: categoryKey
  }))
}

const getActiveTabTeams = () => {
  return getTeamsByCategory(activeTab.value)
}

const getTabTeamCount = (tabKey: string): number => {
  return getTeamsByCategory(tabKey).length
}

const getActiveTabLabel = (): string => {
  const tab = teamTabs.find(t => t.key === activeTab.value)
  return tab?.label || 'Teams'
}

const getStatusColorClass = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return colors[status] || colors.pending
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue'
  }
  return labels[status] || status
}

const formatDate = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const loadTeamsData = async () => {
  if (props.taskData) {
    // If taskData is already an array, use it directly
    teamsData.value = Array.isArray(props.taskData) ? { teams: props.taskData } : props.taskData
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await api.get(`/api/projects/tasks/${props.task.id}/teams`)
    console.log('Teams API Response:', response.data)
    
    // Response format: { message: '...', data: [...teams array...] }
    const rawData = response.data.data || response.data
    
    // If data is already an array of teams, wrap it
    if (Array.isArray(rawData)) {
      teamsData.value = { teams: rawData }
    } else if (rawData && Array.isArray(rawData.teams)) {
      teamsData.value = rawData
    } else if (rawData) {
      teamsData.value = { teams: [] }
    }
    
    console.log('Processed teams data:', teamsData.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load teams data'
    console.error('Error loading teams data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTeamsData()
})
</script>
