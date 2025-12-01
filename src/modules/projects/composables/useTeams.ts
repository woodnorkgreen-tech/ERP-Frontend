import { ref, computed } from 'vue'
import api from '@/plugins/axios'

// Types for teams data
export interface TeamMember {
  id: number
  member_name: string
  assigned_at: string
  is_active: boolean
}

export interface TeamType {
  id: number
  type_key: string
  display_name: string
}

export interface TeamCategory {
  id: number
  category_key: string
  display_name: string
}

export interface Team {
  id: number
  task_id: number
  category: TeamCategory
  team_type: TeamType
  team_type_id: number
  category_id: number
  required_members: number
  status: string
  start_date?: string
  end_date?: string
  priority: string
  notes?: string
  members: TeamMember[]
  created_at: string
  updated_at: string
}

export interface TeamCreationData {
  category_id: number
  team_type_id: number
  required_members: number
  start_date?: string
  priority: string
  notes?: string
}

export interface TeamMemberData {
  member_name: string
}

const teamsTasks = ref<Team[]>([])
const teamTypes = ref<TeamType[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useTeams() {
  const getErrorMessage = (err: unknown): string => {
    const error = err as { response?: { status?: number } }
    if (!error?.response) {
      return "Network error. Please check your connection.";
    }
    switch (error.response.status) {
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "Access denied.";
      case 404:
        return "Teams data not found.";
      case 422:
        return "Validation error.";
      case 500:
        return "Server error.";
      default:
        return `API error: ${error.response.status}`;
    }
  }

  const fetchTeamsForTask = async (taskId: number): Promise<Team[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/tasks/${taskId}/teams`)
      teamsTasks.value = response.data.data || []
      return teamsTasks.value
    } catch (err: unknown) {
      const errorResponse = err as { response?: { status?: number } }
      if (errorResponse.response?.status === 404) {
        // No teams data exists yet, return empty array
        teamsTasks.value = []
        return []
      }
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTeamCategories = async (): Promise<void> => {
    // This could be implemented if needed for fetching available categories
    // For now, categories are hardcoded in the components
  }

  const fetchTeamTypes = async (): Promise<TeamType[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/teams/types')
      teamTypes.value = response.data.data || []
      return teamTypes.value
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTeamTask = async (taskId: number, data: TeamCreationData): Promise<Team> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/teams`, data)
      return response.data.data
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (taskId: number, teamTaskId: number, data: TeamMemberData): Promise<TeamMember> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post(`/api/projects/tasks/${taskId}/teams/${teamTaskId}/members`, data)
      return response.data.data
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeTeamMember = async (taskId: number, teamTaskId: number, memberId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/projects/tasks/${taskId}/teams/${teamTaskId}/members/${memberId}`)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTeamTask = async (taskId: number, teamTaskId: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/projects/tasks/${taskId}/teams/${teamTaskId}`)
    } catch (err: unknown) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed property to group teams by category
  const teamsByCategory = computed(() => {
    const grouped: Record<string, Team[]> = {
      workshop: [],
      setup: [],
      setdown: []
    }

    teamsTasks.value.forEach(team => {
      const categoryKey = team.category?.category_key || 'workshop'
      if (grouped[categoryKey]) {
        grouped[categoryKey].push(team)
      }
    })

    return grouped
  })

  // Computed properties for team status filtering
  const completedTeams = computed(() =>
    teamsTasks.value.filter(team => team.status === 'completed')
  )

  const inProgressTeams = computed(() =>
    teamsTasks.value.filter(team => team.status === 'in_progress')
  )

  const overdueTeams = computed(() =>
    teamsTasks.value.filter(team => {
      if (!team.end_date) return false
      return new Date(team.end_date) < new Date() && team.status !== 'completed'
    })
  )

  return {
    // Reactive state
    teamsTasks,
    teamTypes,
    loading,
    error,

    // Computed properties
    teamsByCategory,
    completedTeams,
    inProgressTeams,
    overdueTeams,

    // Functions
    fetchTeamsForTask,
    fetchTeamCategories,
    fetchTeamTypes,
    createTeamTask,
    addTeamMember,
    removeTeamMember,
    deleteTeamTask
  }
}
