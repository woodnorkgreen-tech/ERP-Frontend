import { ref, computed } from 'vue'
import type { DashboardMetrics } from '../types/enquiry'
import api from '@/plugins/axios'

const dashboardMetrics = ref<DashboardMetrics | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useProjectsDashboard() {
  const fetchDashboardMetrics = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/dashboard')
      dashboardMetrics.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch dashboard metrics'
      console.error('Error fetching dashboard metrics:', err)
      // Detailed error logging
      console.error('Dashboard fetch error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        response: (err as any)?.response?.data,
        status: (err as any)?.response?.status,
        statusText: (err as any)?.response?.statusText,
        config: (err as any)?.config,
        timestamp: new Date().toISOString()
      })
    } finally {
      loading.value = false
    }
  }

  const fetchEnquiryMetrics = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/dashboard/enquiry-metrics')
      if (dashboardMetrics.value) {
        dashboardMetrics.value.enquiry_metrics = response.data.data
      } else {
        dashboardMetrics.value = {
          enquiry_metrics: response.data.data,
          task_metrics: {
            enquiry_tasks: {},
            departmental_tasks: {},
            total_tasks: 0,
            overdue_tasks: 0,
            tasks_by_department: {},
            performance_matrix: {},
            completion_rate: 0
          },
          project_metrics: {
            total_projects: 0,
            active_projects: 0,
            completed_projects: 0,
            converted_enquiries: 0,
            total_budget: 0,
            projects_by_status: {},
            average_duration_days: null,
            phases_by_status: {},
            phase_progress: []
          }
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch enquiry metrics'
      console.error('Error fetching enquiry metrics:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchTaskMetrics = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/dashboard/task-metrics')
      if (dashboardMetrics.value) {
        dashboardMetrics.value.task_metrics = response.data.data
      } else {
        dashboardMetrics.value = {
          enquiry_metrics: {
            total_enquiries: 0,
            status_breakdown: {},
            monthly_trend: [],
            priority_distribution: {},
            department_distribution: {}
          },
          task_metrics: response.data.data,
          project_metrics: {
            total_projects: 0,
            active_projects: 0,
            completed_projects: 0,
            converted_enquiries: 0,
            total_budget: 0,
            projects_by_status: {},
            average_duration_days: null,
            phases_by_status: {},
            phase_progress: []
          }
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch task metrics'
      console.error('Error fetching task metrics:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProjectMetrics = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/dashboard/project-metrics')
      if (dashboardMetrics.value) {
        dashboardMetrics.value.project_metrics = response.data.data
      } else {
        dashboardMetrics.value = {
          enquiry_metrics: {
            total_enquiries: 0,
            status_breakdown: {},
            monthly_trend: [],
            priority_distribution: {},
            department_distribution: {}
          },
          task_metrics: {
            enquiry_tasks: {},
            departmental_tasks: {},
            total_tasks: 0,
            overdue_tasks: 0,
            tasks_by_department: {},
            performance_matrix: {},
            completion_rate: 0
          },
          project_metrics: response.data.data
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch project metrics'
      console.error('Error fetching project metrics:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed properties for easy access
  const enquiryMetrics = computed(() => dashboardMetrics.value?.enquiry_metrics || null)
  const taskMetrics = computed(() => dashboardMetrics.value?.task_metrics || null)
  const projectMetrics = computed(() => dashboardMetrics.value?.project_metrics || null)
  const financialMetrics = computed(() => dashboardMetrics.value?.financial_metrics || null)
  const suggestions = computed(() => dashboardMetrics.value?.suggestions || [])
  const commandCenterData = computed(() => dashboardMetrics.value?.command_center_data || null)
  const metadata = computed(() => dashboardMetrics.value?.metadata || null)

  return {
    dashboardMetrics,
    loading,
    error,
    enquiryMetrics,
    taskMetrics,
    projectMetrics,
    financialMetrics,
    suggestions,
    commandCenterData,
    metadata,
    fetchDashboardMetrics,
    fetchEnquiryMetrics,
    fetchTaskMetrics,
    fetchProjectMetrics
  }
}
