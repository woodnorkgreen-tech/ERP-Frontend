import { ref } from 'vue'
import api from '@/plugins/axios'

// Types for logistics data
export interface Driver {
  id: number
  name: string
  phone: string
  position?: string
  label: string
  department_id: number
}

export interface LogisticsPlanning {
  vehicle_type?: string
  vehicle_identification?: string
  driver_name?: string
  driver_contact?: string
  route?: {
    origin?: string
    destination?: string
    distance?: number
    travel_time?: string
  }
  timeline?: {
    departure_time?: string
    arrival_time?: string
    setup_start_time?: string
  }
}

export interface TeamConfirmation {
  setup_teams_confirmed: boolean
  notes?: string
}

export interface TransportItem {
  id: number
  name: string
  description?: string
  quantity: number
  unit: string
  category: 'production' | 'custom'
  weight?: string
  special_handling?: string
  source?: string
}

export interface ChecklistItem {
  id: string
  item_name: string
  status: 'present' | 'missing' | 'coming_later'
  notes?: string
  checkedBy?: string
  checkedAt?: Date
}

export interface ChecklistData {
  items: ChecklistItem[]
  teams: { workshop: boolean; setup: boolean; setdown: boolean }
  safety: { ppe: boolean; first_aid: boolean; fire_extinguisher: boolean }
}

export interface LogisticsTaskData {
  id?: number
  task_id: number
  logistics_planning: LogisticsPlanning
  team_confirmation: TeamConfirmation
  transport_items: TransportItem[]
  checklist: ChecklistData
  status: string
}

const loading = ref(false)
const error = ref<string | null>(null)

export function useLogistics() {
  const getErrorMessage = (err: unknown): string => {
    const error = err as any
    if (!error?.response) {
      return "Network error. Please check your connection.";
    }
    switch (error.response.status) {
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "Access denied.";
      case 404:
        return "Logistics data not found.";
      case 422:
        return "Validation error.";
      case 500:
        return "Server error.";
      default:
        return `API error: ${error.response.status}`;
    }
  }

  const fetchLogisticsData = async (taskId: number): Promise<LogisticsTaskData | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/tasks/${taskId}/logistics`)
      return response.data.data
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No logistics data exists yet, return null
        return null
      }
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const saveLogisticsPlanning = async (taskId: number, data: LogisticsPlanning): Promise<LogisticsTaskData> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/logistics/planning`, data)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getDrivers = async (): Promise<Driver[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/projects/drivers')
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTeamConfirmation = async (taskId: number, data: TeamConfirmation): Promise<LogisticsTaskData> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/tasks/${taskId}/logistics/team-confirmation`, data)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransportItems = async (taskId: number): Promise<TransportItem[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/tasks/${taskId}/logistics/transport-items`)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTransportItem = async (taskId: number, data: Omit<TransportItem, 'id'>): Promise<TransportItem> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/logistics/transport-items`, data)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransportItem = async (taskId: number, itemId: number, data: Partial<TransportItem>): Promise<TransportItem> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/tasks/${taskId}/logistics/transport-items/${itemId}`, data)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransportItem = async (taskId: number, itemId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/projects/tasks/${taskId}/logistics/transport-items/${itemId}`)
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const importProductionElements = async (taskId: number): Promise<TransportItem[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/logistics/import-production-elements`)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getChecklist = async (taskId: number): Promise<ChecklistData> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/tasks/${taskId}/logistics/checklist`)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateChecklist = async (taskId: number, data: ChecklistData): Promise<ChecklistData> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/logistics/checklist`, data)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateChecklist = async (taskId: number): Promise<ChecklistData> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/logistics/checklist/generate`)
      return response.data.data
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchLogisticsData,
    saveLogisticsPlanning,
    getDrivers,
    updateTeamConfirmation,
    getTransportItems,
    addTransportItem,
    updateTransportItem,
    deleteTransportItem,
    importProductionElements,
    getChecklist,
    updateChecklist,
    generateChecklist
  }
}
