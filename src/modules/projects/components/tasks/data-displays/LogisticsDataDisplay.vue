<template>
  <div class="logistics-data-display">
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <!-- Header -->
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>Logistics Details</span>
      </h3>

      <!-- Logistics Planning Section -->
      <div v-if="taskData.logistics_planning" class="section">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <span>🚚</span>
          <span>Transportation Planning</span>
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Vehicle Information -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Information</h5>
            <DataField label="Vehicle Type" :value="taskData.logistics_planning.vehicle_type" />
            <DataField label="Vehicle ID" :value="taskData.logistics_planning.vehicle_identification" />
          </div>

          <!-- Driver Information -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Information</h5>
            <DataField label="Driver Name" :value="taskData.logistics_planning.driver_name" />
            <DataField label="Contact" :value="taskData.logistics_planning.driver_contact" />
          </div>

          <!-- Route Planning -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Route Details</h5>
            <DataField label="Origin" :value="taskData.logistics_planning.route?.origin" />
            <DataField label="Destination" :value="taskData.logistics_planning.route?.destination" />
            <DataField label="Distance" :value="taskData.logistics_planning.route?.distance" />
            <DataField label="Travel Time" :value="taskData.logistics_planning.route?.travel_time" />
          </div>

          <!-- Timeline -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeline</h5>
            <DataField label="Departure" :value="formatDate(taskData.logistics_planning.timeline?.departure_time)" />
            <DataField label="Arrival" :value="formatDate(taskData.logistics_planning.timeline?.arrival_time)" />
            <DataField label="Setup Start" :value="formatDate(taskData.logistics_planning.timeline?.setup_start_time)" />
          </div>
        </div>
      </div>

      <!-- Loading Sheet Section -->
      <div v-if="taskData.transport_items && taskData.transport_items.length > 0" class="section border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <span>📋</span>
          <span>Loading Sheet Items ({{ taskData.transport_items.length }})</span>
        </h4>
        
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="space-y-2">
            <div 
              v-for="item in taskData.transport_items" 
              :key="item.id"
              class="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span :class="item.category === 'production' ? 'text-purple-600' : 'text-blue-600'">•</span>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                </div>
                <p v-if="item.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-5">{{ item.description }}</p>
                <div class="mt-2 ml-5 flex flex-wrap gap-2 text-xs">
                  <span class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {{ item.quantity }} {{ item.unit }}
                  </span>
                  <span v-if="item.weight" class="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {{ item.weight }}
                  </span>
                  <span v-if="item.special_handling" class="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                    {{ item.special_handling }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                    {{ item.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Confirmation Section -->
      <div v-if="taskData.team_confirmation" class="section border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <span>👥</span>
          <span>Team Confirmation</span>
        </h4>
        
        <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <DataField label="Setup Teams Confirmed" :value="taskData.team_confirmation.setup_teams_confirmed ? 'Yes ✓' : 'No'" />
          <DataField v-if="taskData.team_confirmation.notes" label="Notes" :value="taskData.team_confirmation.notes" type="textarea" />
        </div>
      </div>

      <!-- Checklist Section -->
      <div v-if="taskData.checklist && taskData.checklist.items && taskData.checklist.items.length > 0" class="section border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <span>✓</span>
          <span>Checklist</span>
        </h4>
        
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div class="space-y-2">
            <div 
              v-for="item in taskData.checklist.items" 
              :key="item.id"
              class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
            >
              <div class="flex items-center gap-2">
                <span :class="getStatusIcon(item.status)">{{ getStatusEmoji(item.status) }}</span>
                <span class="text-sm text-gray-900 dark:text-white">{{ item.item_name }}</span>
              </div>
              <span :class="getStatusClass(item.status)" class="text-xs px-2 py-0.5 rounded-full">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnquiryTask } from '../../../types/enquiry'

// Reusable Data Field Component
const DataField = {
  props: {
    label: String,
    value: [String, Number, Boolean],
    type: { type: String, default: 'text' }
  },
  template: `
    <div class="mb-2">
      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {{ label }}
      </label>
      <div v-if="type === 'textarea'" class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-600">
        {{ value || 'Not specified' }}
      </div>
      <div v-else class="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-600">
        {{ value || 'Not specified' }}
      </div>
    </div>
  `
}

interface Props {
  task: EnquiryTask
  taskData: Record<string, any>
}

defineProps<Props>()

// Utility functions
const formatDate = (dateString: unknown) => {
  if (!dateString || typeof dateString !== 'string') return null
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'present': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'missing': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'coming_later': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'present': 'Present',
    'missing': 'Missing',
    'coming_later': 'Coming Later'
  }
  return labels[status] || status
}

const getStatusEmoji = (status: string) => {
  const emojis: Record<string, string> = {
    'present': '✓',
    'missing': '✗',
    'coming_later': '⏱'
  }
  return emojis[status] || '○'
}

const getStatusIcon = (status: string) => {
  const classes: Record<string, string> = {
    'present': 'text-green-600 dark:text-green-400',
    'missing': 'text-red-600 dark:text-red-400',
    'coming_later': 'text-yellow-600 dark:text-yellow-400'
  }
  return classes[status] || 'text-gray-600 dark:text-gray-400'
}
</script>

<style scoped>
.logistics-data-display {
  max-width: none;
}

.section + .section {
  margin-top: 1.5rem;
}
</style>
