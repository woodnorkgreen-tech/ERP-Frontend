<template>
  <div class="task-issue-panel">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Issues</h3>
      <button
        @click="showIssueDialog = true"
        class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md flex items-center gap-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Report Issue
      </button>
    </div>

    <!-- Issue Stats -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <div class="text-2xl font-bold text-red-600">{{ criticalCount }}</div>
        <div class="text-sm text-gray-600">Critical</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <div class="text-2xl font-bold text-orange-600">{{ highCount }}</div>
        <div class="text-sm text-gray-600">High</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <div class="text-2xl font-bold text-blue-600">{{ openCount }}</div>
        <div class="text-sm text-gray-600">Open</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <div class="text-2xl font-bold text-green-600">{{ resolvedCount }}</div>
        <div class="text-sm text-gray-600">Resolved</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-4">
      <select
        v-model="statusFilter"
        class="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Statuses</option>
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <select
        v-model="severityFilter"
        class="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Severities</option>
        <option v-for="option in severityOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Issues List -->
    <div class="space-y-3">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading issues...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredIssues.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h4 class="text-lg font-medium text-gray-900 mb-2">No issues found</h4>
        <p class="text-gray-600 mb-4">Issues will appear here when reported.</p>
        <button
          @click="showIssueDialog = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center gap-2 mx-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Report First Issue
        </button>
      </div>

      <!-- Issues -->
      <div
        v-else
        v-for="issue in filteredIssues"
        :key="issue.id"
        class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
        @click="viewIssue(issue)"
      >
        <div class="space-y-3">
          <!-- Header -->
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 mb-1">{{ issue.title }}</h4>
              <p class="text-sm text-gray-600 line-clamp-2">{{ issue.description }}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <span
                :class="getSeverityTagClasses(issue.severity)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ ISSUE_SEVERITIES[issue.severity].label }}
              </span>
              <span
                :class="getStatusTagClasses(issue.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ ISSUE_STATUSES[issue.status].label }}
              </span>
            </div>
          </div>

          <!-- Metadata -->
          <div class="flex justify-between items-center text-sm text-gray-500">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ issue.reporter.name }}
              </span>
              <span v-if="issue.assignee" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Assigned to {{ issue.assignee.name }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(issue.reported_at) }}
              </span>
            </div>
            <div v-if="issue.resolved_at" class="text-green-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resolved {{ formatDate(issue.resolved_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue Dialog -->
    <div v-if="showIssueDialog" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showIssueDialog = false">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="issue-modal-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="issue-modal-headline">
                  {{ editingIssue ? 'Edit Issue' : 'Report Issue' }}
                </h3>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      v-model="issueForm.title"
                      type="text"
                      placeholder="Brief description of the issue"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      :class="{ 'border-red-500': errors.title }"
                    />
                    <small v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</small>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      v-model="issueForm.description"
                      placeholder="Detailed description of the issue"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows="4"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        v-model="issueForm.issue_type"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Select issue type</option>
                        <option v-for="option in issueTypeOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
                      <select
                        v-model="issueForm.severity"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        :class="{ 'border-red-500': errors.severity }"
                      >
                        <option value="">Select severity</option>
                        <option v-for="option in severityOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <small v-if="errors.severity" class="text-red-500 text-xs mt-1">{{ errors.severity }}</small>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                    <input
                      v-model="employeeSearch"
                      type="text"
                      placeholder="Type to search employees..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      @input="searchEmployees({ query: employeeSearch })"
                    />
                    <div v-if="employeeSuggestions.length > 0" class="mt-1 max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg">
                      <div
                        v-for="emp in employeeSuggestions"
                        :key="emp.id"
                        @click="selectEmployee(emp)"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                      >
                        {{ emp.displayName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="saveIssue"
              :disabled="savingIssue"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': savingIssue }"
            >
              <svg v-if="savingIssue" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ editingIssue ? 'Update Issue' : 'Report Issue' }}
            </button>
            <button
              @click="cancelIssueDialog"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue Detail Dialog -->
    <div v-if="showIssueDetailDialog" class="fixed inset-0 z-50 overflow-y-auto" @click.self="showIssueDetailDialog = false">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full" role="dialog" aria-modal="true" aria-labelledby="issue-detail-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full" v-if="selectedIssue">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="issue-detail-headline">
                  Issue Details
                </h3>

                <div class="space-y-6">
                  <!-- Issue Header -->
                  <div class="border-b pb-4">
                    <div class="flex justify-between items-start mb-3">
                      <h3 class="text-xl font-semibold text-gray-900">{{ selectedIssue.title }}</h3>
                      <div class="flex gap-2">
                        <span
                          :class="getSeverityTagClasses(selectedIssue.severity)"
                          class="px-2 py-1 text-xs font-medium rounded-full"
                        >
                          {{ ISSUE_SEVERITIES[selectedIssue.severity].label }}
                        </span>
                        <span
                          :class="getStatusTagClasses(selectedIssue.status)"
                          class="px-2 py-1 text-xs font-medium rounded-full"
                        >
                          {{ ISSUE_STATUSES[selectedIssue.status].label }}
                        </span>
                      </div>
                    </div>
                    <p class="text-gray-600">{{ selectedIssue.description }}</p>
                  </div>

                  <!-- Issue Metadata -->
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium text-gray-700">Reported by:</span>
                      {{ selectedIssue.reporter.name }}
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">Reported on:</span>
                      {{ formatDate(selectedIssue.reported_at) }}
                    </div>
                    <div v-if="selectedIssue.assignee">
                      <span class="font-medium text-gray-700">Assigned to:</span>
                      {{ selectedIssue.assignee.name }}
                    </div>
                    <div v-if="selectedIssue.resolved_at">
                      <span class="font-medium text-gray-700">Resolved on:</span>
                      {{ formatDate(selectedIssue.resolved_at) }}
                    </div>
                  </div>

                  <!-- Resolution Notes -->
                  <div v-if="selectedIssue.resolution_notes" class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-medium text-green-800 mb-2">Resolution Notes</h4>
                    <p class="text-green-700">{{ selectedIssue.resolution_notes }}</p>
                  </div>

                  <!-- Actions -->
                  <div v-if="selectedIssue.status !== 'resolved' && selectedIssue.status !== 'closed'" class="flex gap-2">
                    <button
                      @click="resolveIssue(selectedIssue)"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Mark as Resolved
                    </button>
                    <button
                      @click="editIssue(selectedIssue)"
                      class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="showIssueDetailDialog = false"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '../composables/useToast'
import { ISSUE_SEVERITIES, ISSUE_STATUSES } from '../constants'
import type { TaskIssue, TaskIssueFormData } from '../types'
import { useApi } from '@/modules/admin/shared/composables/useApi'
import { taskApi } from '../services/api'
import { useRoute } from 'vue-router'

// Components removed - using custom Tailwind implementations

// Props
interface Props {
   taskId?: number | string
}

const props = defineProps<Props>()

// Computed
const numericTaskId = computed(() => {
  // First try props
  let taskId = props.taskId

  // If not provided in props, try to get from route
  if (taskId === null || taskId === undefined) {
    const routeId = route.params.id as string
    if (routeId) {
      taskId = routeId
    }
  }

  if (taskId === null || taskId === undefined) {
    return undefined
  }
  if (typeof taskId === 'string') {
    const parsed = parseInt(taskId, 10)
    return isNaN(parsed) ? undefined : parsed
  }
  if (typeof taskId === 'number') {
    return taskId
  }
  return undefined
})

// Composables
const toast = useToast()
const { get } = useApi()
const route = useRoute()

// Reactive state
const issues = ref<TaskIssue[]>([])
const loading = ref(false)
const showIssueDialog = ref(false)
const showIssueDetailDialog = ref(false)
const editingIssue = ref<TaskIssue | null>(null)
const selectedIssue = ref<TaskIssue | null>(null)
const savingIssue = ref(false)
const statusFilter = ref('')
const severityFilter = ref('')

const issueForm = ref<TaskIssueFormData>({
  title: '',
  description: '',
  issue_type: 'bug',
  severity: 'medium',
  assigned_to: undefined
})

const errors = ref<Record<string, string>>({})

// Employee search
const employeeSearch = ref('')
const employeeSuggestions = ref<Array<{ id: number; first_name: string; last_name: string; displayName: string }>>([])
const selectedEmployee = ref<{ id: number; first_name: string; last_name: string; displayName: string } | null>(null)
const loadingEmployees = ref(false)

// Computed
const statusOptions = computed(() =>
  Object.entries(ISSUE_STATUSES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

const severityOptions = computed(() =>
  Object.entries(ISSUE_SEVERITIES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

const issueTypeOptions = ref([
  { label: 'Bug', value: 'bug' },
  { label: 'Feature Request', value: 'feature_request' },
  { label: 'Improvement', value: 'improvement' },
  { label: 'Question', value: 'question' },
  { label: 'Security Issue', value: 'security' },
  { label: 'Performance Issue', value: 'performance' },
  { label: 'Documentation', value: 'documentation' },
  { label: 'Enhancement', value: 'enhancement' },
  { label: 'Support Request', value: 'support' },
  { label: 'Incident', value: 'incident' },
  { label: 'Change Request', value: 'change_request' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Training', value: 'training' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Other', value: 'other' }
])

const filteredIssues = computed(() => {
  let filtered = issues.value

  if (statusFilter.value) {
    filtered = filtered.filter(issue => issue.status === statusFilter.value)
  }

  if (severityFilter.value) {
    filtered = filtered.filter(issue => issue.severity === severityFilter.value)
  }

  return filtered
})

const criticalCount = computed(() =>
  issues.value.filter(issue => issue.severity === 'critical').length
)

const highCount = computed(() =>
  issues.value.filter(issue => issue.severity === 'high').length
)

const openCount = computed(() =>
  issues.value.filter(issue => issue.status === 'open' || issue.status === 'in_progress').length
)

const resolvedCount = computed(() =>
  issues.value.filter(issue => issue.status === 'resolved' || issue.status === 'closed').length
)

// Methods
async function loadIssues() {
  loading.value = true
  try {
    if (numericTaskId.value === undefined || numericTaskId.value === null || numericTaskId.value <= 0) {
      console.warn('TaskIssuePanel: Invalid task ID', props.taskId, numericTaskId.value)
      issues.value = []
      loading.value = false
      return
    }

    const response = await taskApi.getTaskIssues(numericTaskId.value)
    if (response.success && response.data) {
      issues.value = response.data
    } else {
      issues.value = []
      toast.error('Failed to load issues')
    }
  } catch (error: any) {
    console.error('Error loading issues:', error)
    issues.value = []
    toast.error('Failed to load issues')
  } finally {
    loading.value = false
  }
}

function getSeverityTagSeverity(severity: string): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return severityMap[severity] || 'info'
}

function getStatusTagSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
  const statusMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    open: 'warning',
    in_progress: 'info',
    resolved: 'success',
    closed: 'success'
  }
  return statusMap[status] || 'info'
}

function getSeverityTagClasses(severity: string): string {
  const classMap: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }
  return classMap[severity] || 'bg-gray-100 text-gray-800'
}

function getStatusTagClasses(status: string): string {
  const classMap: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function viewIssue(issue: TaskIssue) {
  selectedIssue.value = issue
  showIssueDetailDialog.value = true
}

function editIssue(issue: TaskIssue) {
  editingIssue.value = issue
  issueForm.value = {
    title: issue.title,
    description: issue.description || '',
    issue_type: issue.issue_type,
    severity: issue.severity,
    assigned_to: issue.assigned_to
  }

  // Set selected employee if assigned
  if (issue.assignee) {
    const nameParts = issue.assignee.name.split(' ')
    selectedEmployee.value = {
      id: issue.assignee.id,
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      displayName: issue.assignee.name
    }
    employeeSearch.value = selectedEmployee.value.displayName
  }

  showIssueDialog.value = true
  showIssueDetailDialog.value = false
}

async function saveIssue() {
  if (!validateIssueForm()) {
    return
  }

  savingIssue.value = true

  try {
    if (numericTaskId.value === undefined || numericTaskId.value === null || numericTaskId.value <= 0) {
      console.warn('TaskIssuePanel: Invalid task ID for save', props.taskId, numericTaskId.value)
      toast.error('Task ID is required')
      return
    }

    const formData = {
      ...issueForm.value,
      task_id: numericTaskId.value
    }

    if (editingIssue.value) {
      // Update existing issue
      const response = await taskApi.updateIssue(editingIssue.value.id, issueForm.value)
      if (response.success) {
        toast.success('Issue updated successfully')
      } else {
        toast.error('Failed to update issue')
        return
      }
    } else {
      // Create new issue
      const response = await taskApi.createIssue(formData)
      if (response.success) {
        toast.success('Issue reported successfully')
      } else {
        toast.error('Failed to report issue')
        return
      }
    }

    showIssueDialog.value = false
    resetIssueForm()

    await loadIssues() // Refresh list
  } catch (error: any) {
    console.error('Error saving issue:', error)
    toast.error(`Failed to ${editingIssue.value ? 'update' : 'report'} issue`)
  } finally {
    savingIssue.value = false
  }
}

function validateIssueForm(): boolean {
  errors.value = {}

  if (!issueForm.value.title?.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!issueForm.value.severity) {
    errors.value.severity = 'Severity is required'
  }

  return Object.keys(errors.value).length === 0
}

function resetIssueForm() {
  issueForm.value = {
    title: '',
    description: '',
    issue_type: 'bug',
    severity: 'medium',
    assigned_to: undefined
  }
  errors.value = {}
  editingIssue.value = null
  selectedEmployee.value = null
  employeeSearch.value = ''
  employeeSuggestions.value = []
}

function cancelIssueDialog() {
  showIssueDialog.value = false
  resetIssueForm()
}

const searchEmployees = async (event: { query: string }) => {
  if (!event.query || event.query.length < 2) {
    employeeSuggestions.value = []
    return
  }

  loadingEmployees.value = true
  try {
    const response = await get('/api/hr/employees', {
      search: event.query.trim(),
      per_page: 20
    })

    // Handle different response formats
    let employeesArray: any[] = []
    if (Array.isArray(response)) {
      employeesArray = response
    } else if (response && typeof response === 'object' && 'data' in response) {
      if (Array.isArray((response as any).data)) {
        employeesArray = (response as any).data
      } else if ((response as any).data?.data && Array.isArray((response as any).data.data)) {
        employeesArray = (response as any).data.data
      }
    }

    // Filter and format employees - only show names
    employeeSuggestions.value = employeesArray
      .filter((emp: any) => emp.first_name || emp.last_name)
      .map((emp: any) => ({
        id: emp.id,
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        displayName: `${emp.first_name || ''} ${emp.last_name || ''}`.trim()
      }))
      .slice(0, 10) // Limit to 10 results
  } catch (error) {
    console.error('Error searching employees:', error)
    employeeSuggestions.value = []
  } finally {
    loadingEmployees.value = false
  }
}

const selectEmployee = (emp: { id: number; first_name: string; last_name: string; displayName: string }) => {
  selectedEmployee.value = emp
  issueForm.value.assigned_to = emp.id
  employeeSearch.value = emp.displayName
  employeeSuggestions.value = []
}

async function resolveIssue(issue: TaskIssue) {
  try {
    const response = await taskApi.resolveIssue(issue.id)
    if (response.success) {
      toast.success('Issue marked as resolved')
      showIssueDetailDialog.value = false
      await loadIssues() // Refresh list
    } else {
      toast.error('Failed to resolve issue')
    }
  } catch (error: any) {
    console.error('Error resolving issue:', error)
    toast.error('Failed to resolve issue')
  }
}

// Lifecycle
onMounted(() => {
  loadIssues()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>