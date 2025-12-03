<template>
  <div class="task-analytics-view">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Task Analytics</h1>
        <p class="text-gray-600 mt-1">Insights and metrics for task management</p>
      </div>
      <div class="flex gap-2">
        <Button
          label="Export Data"
          icon="pi pi-download"
          @click="showExportDialog = true"
          class="bg-green-600 hover:bg-green-700"
        />
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          @click="refreshData"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <Dropdown
            v-model="filters.department_id"
            :options="departments"
            option-label="name"
            option-value="id"
            placeholder="All Departments"
            class="w-full"
            show-clear
            @change="applyFilters"
          />
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <Calendar
            v-model="dateRange"
            selection-mode="range"
            placeholder="Select date range"
            class="w-full"
            show-clear
            @date-select="applyDateFilters"
          />
        </div>

        <!-- Task Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
          <Dropdown
            v-model="filters.task_type"
            :options="taskTypeOptions"
            placeholder="All Types"
            class="w-full"
            show-clear
            @change="applyFilters"
          />
        </div>

        <!-- Assignee Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
          <Dropdown
            v-model="filters.assigned_user_id"
            :options="users"
            option-label="name"
            option-value="id"
            placeholder="All Users"
            class="w-full"
            show-clear
            @change="applyFilters"
          />
        </div>
      </div>

      <!-- Quick Date Ranges -->
      <div class="flex gap-2 mt-4">
        <Button
          v-for="range in dateRanges"
          :key="range.key"
          :label="range.label"
          size="small"
          text
          :class="{ 'bg-blue-100': activeDateRange === range.key }"
          @click="setDateRange(range.key)"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600">Loading analytics data...</p>
    </div>

    <!-- Dashboard Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ dashboardData.summary.total_tasks }}</div>
          <div class="text-sm text-gray-600">Total Tasks</div>
          <div class="text-xs text-green-600 mt-1">
            {{ dashboardData.summary.completed_tasks }} completed
          </div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-green-600 mb-2">{{ dashboardData.summary.completion_rate }}%</div>
          <div class="text-sm text-gray-600">Completion Rate</div>
          <div class="text-xs text-blue-600 mt-1">
            {{ dashboardData.summary.in_progress_tasks }} in progress
          </div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-red-600 mb-2">{{ dashboardData.summary.overdue_tasks }}</div>
          <div class="text-sm text-gray-600">Overdue Tasks</div>
          <div class="text-xs text-orange-600 mt-1">
            {{ dashboardData.summary.blocked_tasks }} blocked
          </div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ keyMetrics.average_completion_time_hours }}</div>
          <div class="text-sm text-gray-600">Avg. Completion Time</div>
          <div class="text-xs text-gray-500 mt-1">hours</div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Status Distribution -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Task Status Distribution</h3>
        </template>
        <template #content>
          <Chart
            type="doughnut"
            :data="statusChartData"
            :options="chartOptions"
            class="w-full"
          />
        </template>
      </Card>

      <!-- Priority Distribution -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Task Priority Distribution</h3>
        </template>
        <template #content>
          <Chart
            type="bar"
            :data="priorityChartData"
            :options="chartOptions"
            class="w-full"
          />
        </template>
      </Card>
    </div>

    <!-- Time Series Chart -->
    <Card class="mb-8">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Task Trends</h3>
          <Dropdown
            v-model="timeSeriesPeriod"
            :options="periodOptions"
            @change="loadTimeSeriesData"
          />
        </div>
      </template>
      <template #content>
        <Chart
          type="line"
          :data="timeSeriesChartData"
          :options="timeSeriesOptions"
          class="w-full"
        />
      </template>
    </Card>

    <!-- Department Analytics Table -->
    <Card>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Department Performance</h3>
      </template>
      <template #content>
        <DataTable
          :value="departmentAnalytics.departments"
          :loading="loadingDepartments"
          class="p-datatable-sm"
          striped-rows
        >
          <Column field="department_name" header="Department" style="min-width: 150px">
            <template #body="slotProps">
              <span class="font-medium">{{ slotProps.data.department_name }}</span>
            </template>
          </Column>

          <Column field="total_tasks" header="Total Tasks" style="min-width: 100px">
            <template #body="slotProps">
              <span class="font-medium">{{ slotProps.data.total_tasks }}</span>
            </template>
          </Column>

          <Column field="completion_rate" header="Completion Rate" style="min-width: 120px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <ProgressBar
                  :value="parseFloat(slotProps.data.completion_rate)"
                  :show-value="false"
                  class="w-16 h-2"
                />
                <span class="text-sm">{{ slotProps.data.completion_rate }}%</span>
              </div>
            </template>
          </Column>

          <Column field="average_completion_time_hours" header="Avg. Time (hrs)" style="min-width: 120px">
            <template #body="slotProps">
              <span>{{ slotProps.data.average_completion_time_hours }}</span>
            </template>
          </Column>

          <Column field="overdue_tasks" header="Overdue" style="min-width: 80px">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.overdue_tasks.toString()"
                :severity="slotProps.data.overdue_tasks > 0 ? 'danger' : 'success'"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Export Dialog -->
    <Dialog
      v-model:visible="showExportDialog"
      header="Export Analytics Data"
      modal
      style="width: 400px"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Export Type</label>
          <Dropdown
            v-model="exportType"
            :options="exportTypeOptions"
            placeholder="Select export type"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <SelectButton
            v-model="exportFormat"
            :options="exportFormatOptions"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          text
          @click="showExportDialog = false"
        />
        <Button
          label="Export"
          icon="pi pi-download"
          @click="exportData"
          :loading="exporting"
          class="bg-green-600 hover:bg-green-700"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Chart as ChartJS, registerables } from 'chart.js'

// Register Chart.js components
ChartJS.register(...registerables)

// Components
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import ProgressBar from 'primevue/progressbar'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import SelectButton from 'primevue/selectbutton'
import ProgressSpinner from 'primevue/progressspinner'

// Types
interface DashboardData {
  summary: {
    total_tasks: number
    completed_tasks: number
    in_progress_tasks: number
    overdue_tasks: number
    blocked_tasks: number
    completion_rate: number
  }
  status_distribution: Record<string, number>
  priority_distribution: Record<string, number>
  department_distribution: Record<string, number>
  recent_activity: Record<string, number>
  generated_at: string
}

interface KeyMetrics {
  completion_rate: number
  average_completion_time_hours: number
  overdue_percentage: number
  average_tasks_per_user: number
  time_variance_hours: number
  issue_rate_per_task: number
  total_tasks: number
  generated_at: string
}

interface TimeSeriesData {
  period: string
  days: number
  data: Array<{
    period: string
    created: number
    completed: number
    overdue: number
  }>
  generated_at: string
}

interface DepartmentAnalytics {
  departments: Array<{
    department_id: number
    department_name: string
    total_tasks: number
    completed_tasks: number
    in_progress_tasks: number
    overdue_tasks: number
    blocked_tasks: number
    completion_rate: string
    average_completion_time_hours: number
  }>
  generated_at: string
}

// Composables
const toast = useToast()

// Reactive state
const loading = ref(false)
const loadingDepartments = ref(false)
const showExportDialog = ref(false)
const exporting = ref(false)
const exportType = ref('dashboard')
const exportFormat = ref('json')
const timeSeriesPeriod = ref('day')
const activeDateRange = ref('last_30_days')

const filters = reactive({
  department_id: null as number | null,
  task_type: '',
  assigned_user_id: null as number | null,
  date_from: '',
  date_to: ''
})

const dateRange = ref<Date[]>([])

// Mock data
const departments = ref([
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Marketing' }
])

const users = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
])

const taskTypeOptions = ref([
  { label: 'Feature', value: 'feature' },
  { label: 'Bug', value: 'bug' },
  { label: 'Task', value: 'task' },
  { label: 'Maintenance', value: 'maintenance' }
])

const dateRanges = ref([
  { key: 'last_7_days', label: 'Last 7 Days' },
  { key: 'last_30_days', label: 'Last 30 Days' },
  { key: 'last_90_days', label: 'Last 90 Days' },
  { key: 'last_year', label: 'Last Year' }
])

const periodOptions = ref([
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' }
])

const exportTypeOptions = ref([
  { label: 'Dashboard Data', value: 'dashboard' },
  { label: 'Key Metrics', value: 'metrics' },
  { label: 'Time Series', value: 'time_series' },
  { label: 'Department Analytics', value: 'departments' }
])

const exportFormatOptions = ref([
  { label: 'JSON', value: 'json' },
  { label: 'CSV', value: 'csv' }
])

// Analytics data
const dashboardData = ref<DashboardData>({
  summary: {
    total_tasks: 0,
    completed_tasks: 0,
    in_progress_tasks: 0,
    overdue_tasks: 0,
    blocked_tasks: 0,
    completion_rate: 0
  },
  status_distribution: {},
  priority_distribution: {},
  department_distribution: {},
  recent_activity: {},
  generated_at: ''
})

const keyMetrics = ref<KeyMetrics>({
  completion_rate: 0,
  average_completion_time_hours: 0,
  overdue_percentage: 0,
  average_tasks_per_user: 0,
  time_variance_hours: 0,
  issue_rate_per_task: 0,
  total_tasks: 0,
  generated_at: ''
})

const timeSeriesData = ref<TimeSeriesData>({
  period: 'day',
  days: 30,
  data: [],
  generated_at: ''
})

const departmentAnalytics = ref<DepartmentAnalytics>({
  departments: [],
  generated_at: ''
})

// Computed
const statusChartData = computed(() => ({
  labels: Object.keys(dashboardData.value.status_distribution).map(key =>
    key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  ),
  datasets: [{
    data: Object.values(dashboardData.value.status_distribution),
    backgroundColor: [
      '#3B82F6', // pending
      '#10B981', // completed
      '#F59E0B', // in_progress
      '#EF4444', // blocked
      '#8B5CF6', // review
      '#6B7280'  // cancelled
    ]
  }]
}))

const priorityChartData = computed(() => ({
  labels: Object.keys(dashboardData.value.priority_distribution).map(key =>
    key.replace(/\b\w/g, l => l.toUpperCase())
  ),
  datasets: [{
    label: 'Tasks by Priority',
    data: Object.values(dashboardData.value.priority_distribution),
    backgroundColor: '#3B82F6'
  }]
}))

const timeSeriesChartData = computed(() => ({
  labels: timeSeriesData.value.data.map(item => item.period),
  datasets: [
    {
      label: 'Created',
      data: timeSeriesData.value.data.map(item => item.created),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: 'Completed',
      data: timeSeriesData.value.data.map(item => item.completed),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    },
    {
      label: 'Overdue',
      data: timeSeriesData.value.data.map(item => item.overdue),
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}))

const timeSeriesOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}))

// Methods
async function loadDashboardData() {
  loading.value = true
  try {
    // Mock data - in real app this would call the API
    dashboardData.value = {
      summary: {
        total_tasks: 156,
        completed_tasks: 89,
        in_progress_tasks: 34,
        overdue_tasks: 12,
        blocked_tasks: 8,
        completion_rate: 57
      },
      status_distribution: {
        completed: 89,
        in_progress: 34,
        pending: 21,
        blocked: 8,
        overdue: 4
      },
      priority_distribution: {
        high: 45,
        medium: 67,
        low: 23,
        urgent: 21
      },
      department_distribution: {
        'Engineering': 89,
        'Design': 34,
        'Marketing': 33
      },
      recent_activity: {
        '2024-01-15': 12,
        '2024-01-14': 8,
        '2024-01-13': 15
      },
      generated_at: new Date().toISOString()
    }

    keyMetrics.value = {
      completion_rate: 57.1,
      average_completion_time_hours: 24.5,
      overdue_percentage: 7.7,
      average_tasks_per_user: 4.2,
      time_variance_hours: 2.1,
      issue_rate_per_task: 0.3,
      total_tasks: 156,
      generated_at: new Date().toISOString()
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load dashboard data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

async function loadTimeSeriesData() {
  try {
    // Mock data - in real app this would call the API
    timeSeriesData.value = {
      period: timeSeriesPeriod.value,
      days: 30,
      data: [
        { period: '2024-01-01', created: 5, completed: 3, overdue: 1 },
        { period: '2024-01-02', created: 8, completed: 6, overdue: 0 },
        { period: '2024-01-03', created: 3, completed: 4, overdue: 2 },
        // ... more data points
      ],
      generated_at: new Date().toISOString()
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load time series data',
      life: 3000
    })
  }
}

async function loadDepartmentAnalytics() {
  loadingDepartments.value = true
  try {
    // Mock data - in real app this would call the API
    departmentAnalytics.value = {
      departments: [
        {
          department_id: 1,
          department_name: 'Engineering',
          total_tasks: 89,
          completed_tasks: 56,
          in_progress_tasks: 23,
          overdue_tasks: 5,
          blocked_tasks: 5,
          completion_rate: '62.9',
          average_completion_time_hours: 22.3
        },
        {
          department_id: 2,
          department_name: 'Design',
          total_tasks: 34,
          completed_tasks: 18,
          in_progress_tasks: 12,
          overdue_tasks: 2,
          blocked_tasks: 2,
          completion_rate: '52.9',
          average_completion_time_hours: 28.7
        },
        {
          department_id: 3,
          department_name: 'Marketing',
          total_tasks: 33,
          completed_tasks: 15,
          in_progress_tasks: 11,
          overdue_tasks: 5,
          blocked_tasks: 2,
          completion_rate: '45.5',
          average_completion_time_hours: 31.2
        }
      ],
      generated_at: new Date().toISOString()
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load department analytics',
      life: 3000
    })
  } finally {
    loadingDepartments.value = false
  }
}

function applyFilters() {
  loadDashboardData()
  loadTimeSeriesData()
  loadDepartmentAnalytics()
}

function applyDateFilters() {
  if (dateRange.value.length === 2) {
    filters.date_from = dateRange.value[0].toISOString().split('T')[0]
    filters.date_to = dateRange.value[1].toISOString().split('T')[0]
  } else {
    filters.date_from = ''
    filters.date_to = ''
  }
  applyFilters()
}

function setDateRange(rangeKey: string) {
  activeDateRange.value = rangeKey
  const now = new Date()
  let startDate: Date

  switch (rangeKey) {
    case 'last_7_days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'last_30_days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'last_90_days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case 'last_year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  dateRange.value = [startDate, now]
  applyDateFilters()
}

async function refreshData() {
  await Promise.all([
    loadDashboardData(),
    loadTimeSeriesData(),
    loadDepartmentAnalytics()
  ])

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Analytics data refreshed',
    life: 3000
  })
}

async function exportData() {
  exporting.value = true
  try {
    // Mock export - in real app this would call the API
    console.log('Exporting:', exportType.value, 'as', exportFormat.value)

    showExportDialog.value = false

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data exported successfully',
      life: 3000
    })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to export data',
      life: 3000
    })
  } finally {
    exporting.value = false
  }
}

// Lifecycle
onMounted(() => {
  setDateRange('last_30_days')
  loadDashboardData()
  loadTimeSeriesData()
  loadDepartmentAnalytics()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>