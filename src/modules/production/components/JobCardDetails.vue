<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <!-- Header -->
    <div class="px-6 py-4 border-b bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ jobCard?.job_card_number }}</h1>
            <p class="text-sm text-gray-600">{{ jobCard?.operation_description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="getStatusClass(jobCard?.status)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ formatStatus(jobCard?.status) }}
            </span>
            <span
              :class="getPriorityClass(jobCard?.priority)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ jobCard?.priority?.toUpperCase() || 'N/A' }}
            </span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('edit')"
            class="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            @click="$emit('close')"
            class="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading job card details...</p>
    </div>

    <div v-else-if="error" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <div v-else-if="jobCard" class="p-6 space-y-6">
      <!-- Key Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-600">Work Order</p>
          <p class="text-lg font-semibold text-gray-900">{{ jobCard.workOrder?.work_order_number }}</p>
          <p class="text-sm text-gray-600">{{ jobCard.workOrder?.title }}</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-600">Fabrication Type</p>
          <p class="text-lg font-semibold text-gray-900 capitalize">{{ jobCard?.fabrication_type?.replace('_', ' ') || 'N/A' }}</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-600">Work Center</p>
          <p class="text-lg font-semibold text-gray-900">{{ jobCard.workCenter?.name }}</p>
          <p class="text-sm text-gray-600 capitalize">{{ jobCard?.workCenter?.type || 'N/A' }}</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-600">Assigned Technician</p>
          <p class="text-lg font-semibold text-gray-900">{{ jobCard.assignedTechnician?.full_name || `${jobCard.assignedTechnician?.first_name || ''} ${jobCard.assignedTechnician?.last_name || ''}`.trim() || jobCard.assignedTechnician?.name || 'Unassigned' }}</p>
          <p class="text-sm text-gray-600">{{ jobCard.assignedTechnician?.employee_number }}</p>
        </div>
      </div>

      <!-- Time Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <p class="text-sm font-medium text-blue-600">Planned Hours</p>
          <p class="text-2xl font-bold text-blue-900">{{ jobCard.planned_hours }}h</p>
          <p class="text-sm text-blue-600">Setup: {{ jobCard.setup_time }}h</p>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
          <p class="text-sm font-medium text-green-600">Actual Hours</p>
          <p class="text-2xl font-bold text-green-900">{{ jobCard.actual_hours }}h</p>
          <p class="text-sm text-green-600">Efficiency: {{ calculateEfficiency() }}%</p>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
          <p class="text-sm font-medium text-purple-600">Scheduled Start</p>
          <p class="text-lg font-semibold text-purple-900">{{ formatDate(jobCard.scheduled_start_date) }}</p>
        </div>
        
        <div class="bg-orange-50 rounded-lg p-4">
          <p class="text-sm font-medium text-orange-600">Scheduled End</p>
          <p class="text-lg font-semibold text-orange-900">{{ formatDate(jobCard.scheduled_end_date) }}</p>
        </div>
      </div>

      <!-- Action Buttons for Production Users -->
      <div v-if="canManageJobCard" class="flex flex-wrap gap-2">
        <button
          v-if="jobCard?.status === 'planned'"
          @click="releaseJobCard"
          :disabled="actionLoading"
          class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
        >
          {{ actionLoading ? 'Processing...' : 'Release Job Card' }}
        </button>
        
        <button
          v-if="jobCard?.status === 'released'"
          @click="startJobCard"
          :disabled="actionLoading"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ actionLoading ? 'Processing...' : 'Start Work' }}
        </button>
        
        <button
          v-if="jobCard?.status === 'in_progress'"
          @click="completeJobCard"
          :disabled="actionLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ actionLoading ? 'Processing...' : 'Complete Job Card' }}
        </button>
        
        <button
          v-if="['released', 'in_progress'].includes(jobCard?.status || '')"
          @click="putOnHoldJobCard"
          :disabled="actionLoading"
          class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {{ actionLoading ? 'Processing...' : 'Put on Hold' }}
        </button>
      </div>

      <!-- Time Tracking Section -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
        
        <div v-if="currentTimeEntry" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-800 font-medium">Currently Clocked In</p>
              <p class="text-green-600 text-sm">Started at: {{ formatDateTime(currentTimeEntry.clock_in) }}</p>
            </div>
            <button
              @click="clockOut"
              :disabled="timeLoading"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ timeLoading ? 'Processing...' : 'Clock Out' }}
            </button>
          </div>
        </div>

        <div v-else-if="canClockIn" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-800 font-medium">Ready to Start Work</p>
              <p class="text-blue-600 text-sm">Clock in to begin tracking time on this job card</p>
            </div>
            <button
              @click="clockIn"
              :disabled="timeLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ timeLoading ? 'Processing...' : 'Clock In' }}
            </button>
          </div>
        </div>

        <!-- Time Entries History -->
        <div class="space-y-2">
          <div
            v-for="entry in jobCard.time_entries"
            :key="entry.id"
            class="border rounded-lg p-3"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ entry.work_description }}</p>
                <p class="text-sm text-gray-600">
                  {{ formatDateTime(entry.clock_in) }} - {{ formatDateTime(entry.clock_out) || 'In Progress' }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ entry.hours_worked }}h</p>
                <p v-if="entry.break_minutes" class="text-sm text-gray-600">Break: {{ entry.break_minutes }}m</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Material Requirements -->
      <div v-if="jobCard.material_requirements?.length" class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Material Requirements</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="material in jobCard.material_requirements" :key="material.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ material.material_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ material.quantity_required }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ material.quantity_issued }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ material.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ material.unit_cost }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ ((material.quantity_required || 0) * (material.unit_cost || 0)).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quality Checks -->
      <div v-if="jobCard.quality_checks?.length" class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quality Checkpoints</h3>
        <div class="space-y-3">
          <div
            v-for="check in jobCard.quality_checks"
            :key="check.id"
            class="flex items-center justify-between p-3 border rounded-lg"
            :class="getQualityCheckClass(check.status)"
          >
            <div class="flex items-center space-x-3">
              <div class="shrink-0">
                <div
                  :class="getQualityCheckIconClass(check.status)"
                  class="w-6 h-6 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="check.status === 'passed'" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    <path v-else-if="check.status === 'failed'" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    <circle v-else cx="10" cy="10" r="3" />
                  </svg>
                </div>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ check.checkpoint_name }}</p>
                <p class="text-sm text-gray-600">
                  {{ check.required ? 'Required' : 'Optional' }} 
                  <span v-if="check.completed_at">• Completed {{ formatDate(check.completed_at) }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                :class="getQualityCheckStatusClass(check.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ check.status?.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useJobCards, useTimeTracking } from '../composables/useJobCards'
import type { ProductionJobCard } from '../types'

interface Props {
  jobCardId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: []
  close: []
}>()

const { fetchJobCard, releaseJobCard: release, startJobCard: start, completeJobCard: complete, putOnHold: putOnHoldJobCard } = useJobCards()
const { clockIn: timeClockIn, clockOut: timeClockOut, addBreakTime, currentTimeEntry, fetchTimeEntries } = useTimeTracking()

const jobCard = ref<ProductionJobCard | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const actionLoading = ref(false)
const timeLoading = ref(false)

// Mock user role - in real app, this would come from auth store
const currentUserRole = ref('production') // 'production', 'hr', 'admin'

const canManageJobCard = computed(() => {
  return ['production', 'admin'].includes(currentUserRole.value)
})

const canClockIn = computed(() => {
  return jobCard.value?.status === 'in_progress' && !currentTimeEntry.value
})

const calculateEfficiency = () => {
  if (!jobCard.value || (jobCard.value.planned_hours || 0) === 0 || !jobCard.value.actual_hours) return 0
  return Math.round(((jobCard.value.planned_hours || 0) / jobCard.value.actual_hours) * 100)
}

const getStatusClass = (status?: string) => {
  const classes = {
    planned: 'bg-gray-100 text-gray-800',
    released: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    on_hold: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority?: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getQualityCheckClass = (status?: string) => {
  const classes = {
    pending: 'bg-gray-50 border-gray-200',
    passed: 'bg-green-50 border-green-200',
    failed: 'bg-red-50 border-red-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-50 border-gray-200'
}

const getQualityCheckIconClass = (status?: string) => {
  const classes = {
    pending: 'bg-gray-200 text-gray-600',
    passed: 'bg-green-200 text-green-600',
    failed: 'bg-red-200 text-red-600'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-200 text-gray-600'
}

const getQualityCheckStatusClass = (status?: string) => {
  const classes = {
    pending: 'bg-gray-100 text-gray-800',
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status?: string) => {
  return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || ''
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleString()
}

const releaseJobCard = async () => {
  if (!jobCard.value) return
  
  actionLoading.value = true
  try {
    await release(jobCard.value.id)
    await loadJobCard()
  } catch (error) {
    console.error('Error releasing job card:', error)
  } finally {
    actionLoading.value = false
  }
}

const startJobCard = async () => {
  if (!jobCard.value) return
  
  actionLoading.value = true
  try {
    await start(jobCard.value.id)
    await loadJobCard()
  } catch (error) {
    console.error('Error starting job card:', error)
  } finally {
    actionLoading.value = false
  }
}

const completeJobCard = async () => {
  if (!jobCard.value) return
  
  actionLoading.value = true
  try {
    await complete(jobCard.value.id)
    await loadJobCard()
  } catch (error) {
    console.error('Error completing job card:', error)
  } finally {
    actionLoading.value = false
  }
}

const clockIn = async () => {
  if (!jobCard.value) return
  
  timeLoading.value = true
  try {
    // Mock technician ID - in real app, this would come from auth store
    const technicianId = 1
    await timeClockIn(jobCard.value.id, technicianId, 'Started work on job card')
    await fetchTimeEntries(jobCard.value.id)
  } catch (error) {
    console.error('Error clocking in:', error)
  } finally {
    timeLoading.value = false
  }
}

const clockOut = async () => {
  if (!currentTimeEntry.value) return
  
  timeLoading.value = true
  try {
    await timeClockOut(currentTimeEntry.value.id)
    if (jobCard.value) {
      await fetchTimeEntries(jobCard.value.id)
    }
  } catch (error) {
    console.error('Error clocking out:', error)
  } finally {
    timeLoading.value = false
  }
}

const loadJobCard = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetchJobCard(props.jobCardId)
    jobCard.value = (response as any).data || response as unknown as ProductionJobCard
    
    // Load time entries for this job card
    if (jobCard.value) {
      await fetchTimeEntries(jobCard.value.id)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load job card'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadJobCard()
})
</script>
