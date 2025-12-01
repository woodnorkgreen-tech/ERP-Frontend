import { ref, type Ref } from 'vue'
import { useTeams } from './useTeams'
import { useDataRefresh } from './useDataRefresh'
import { useFeedback } from './useFeedback'

export interface TeamMember {
  id: number
  member_name: string
  _isOptimistic?: boolean
}

export interface Team {
  id: number
  team_type_id: number
  status: string
  members?: TeamMember[]
  team_type?: {
    display_name: string
  }
}

export interface UseTeamOperationsReturn {
  isLoading: Ref<Record<string, boolean>>
  addMemberOptimistic: (taskId: number, teamTaskId: number, memberName: string) => Promise<void>
  removeMemberOptimistic: (taskId: number, teamTaskId: number, memberId: number) => Promise<void>
  deleteTeamOptimistic: (taskId: number, teamTaskId: number) => Promise<void>
  createTeamOptimistic: (taskId: number, teamData: any) => Promise<void>
}

/**
 * Composable for team operations with optimistic updates
 */
export function useTeamOperations(): UseTeamOperationsReturn {
  const teams = useTeams()
  const { queueRefresh } = useDataRefresh()
  const feedback = useFeedback()

  const isLoading = ref<Record<string, boolean>>({})

  /**
   * Add member with optimistic update
   */
  const addMemberOptimistic = async (
    taskId: number,
    teamTaskId: number,
    memberName: string
  ): Promise<void> => {
    const loadingKey = `add-member-${teamTaskId}`
    isLoading.value[loadingKey] = true

    // Find the team
    const allTeams = teams.teamsTasks.value || []
    const team = allTeams.find(t => t.id === teamTaskId)

    if (!team) {
      feedback.error('Team not found')
      isLoading.value[loadingKey] = false
      return
    }

    // Create optimistic member
    const optimisticMember: TeamMember = {
      id: Date.now(),
      member_name: memberName,
      _isOptimistic: true
    }

    // Update UI optimistically
    const originalMembers = team.members || []
    team.members = [...originalMembers, optimisticMember]

    try {
      // Make API call
      const realMember = await teams.addTeamMember(taskId, teamTaskId, {
        member_name: memberName
      })

      // Replace optimistic with real data
      team.members = team.members?.filter(m => !m._isOptimistic) || []
      team.members.push(realMember)

      feedback.success('Member added successfully')

      // Queue refresh to ensure consistency
      await queueRefresh(`team-${taskId}`, () => teams.fetchTeamsForTask(taskId))

    } catch (error) {
      // Rollback on error
      team.members = originalMembers
      console.error('Error adding member:', error)
      feedback.error('Failed to add member. Please try again.')
    } finally {
      isLoading.value[loadingKey] = false
    }
  }

  /**
   * Remove member with optimistic update
   */
  const removeMemberOptimistic = async (
    taskId: number,
    teamTaskId: number,
    memberId: number
  ): Promise<void> => {
    const loadingKey = `remove-member-${teamTaskId}-${memberId}`
    isLoading.value[loadingKey] = true

    // Find the team
    const allTeams = teams.teamsTasks.value || []
    const team = allTeams.find(t => t.id === teamTaskId)

    if (!team) {
      feedback.error('Team not found')
      isLoading.value[loadingKey] = false
      return
    }

    // Store original members for rollback
    const originalMembers = team.members || []

    // Update UI optimistically
    team.members = originalMembers.filter(m => m.id !== memberId)

    try {
      // Make API call
      await teams.removeTeamMember(taskId, teamTaskId, memberId)

      feedback.success('Member removed successfully')

      // Queue refresh to ensure consistency
      await queueRefresh(`team-${taskId}`, () => teams.fetchTeamsForTask(taskId))

    } catch (error) {
      // Rollback on error
      team.members = originalMembers
      console.error('Error removing member:', error)
      feedback.error('Failed to remove member. Please try again.')
    } finally {
      isLoading.value[loadingKey] = false
    }
  }

  /**
   * Delete team with optimistic update
   */
  const deleteTeamOptimistic = async (
    taskId: number,
    teamTaskId: number
  ): Promise<void> => {
    const loadingKey = `delete-team-${teamTaskId}`
    isLoading.value[loadingKey] = true

    // Store original teams for rollback
    const originalTeams = teams.teamsTasks.value || []

    // Update UI optimistically
    teams.teamsTasks.value = originalTeams.filter(t => t.id !== teamTaskId)

    try {
      // Make API call
      await teams.deleteTeamTask(taskId, teamTaskId)

      feedback.success('Team deleted successfully')

      // Queue refresh to ensure consistency
      await queueRefresh(`team-${taskId}`, () => teams.fetchTeamsForTask(taskId))

    } catch (error) {
      // Rollback on error
      teams.teamsTasks.value = originalTeams
      console.error('Error deleting team:', error)
      feedback.error('Failed to delete team. Please try again.')
    } finally {
      isLoading.value[loadingKey] = false
    }
  }

  /**
   * Create team with optimistic update
   */
  const createTeamOptimistic = async (
    taskId: number,
    teamData: any
  ): Promise<void> => {
    const loadingKey = 'create-team'
    isLoading.value[loadingKey] = true

    try {
      // Make API call (no optimistic update for creation as we need the real ID)
      await teams.createTeamTask(taskId, teamData)

      feedback.success('Team created successfully')

      // Refresh to get new team
      await queueRefresh(`team-${taskId}`, () => teams.fetchTeamsForTask(taskId))

    } catch (error) {
      console.error('Error creating team:', error)
      feedback.error('Failed to create team. Please try again.')
    } finally {
      isLoading.value[loadingKey] = false
    }
  }

  return {
    isLoading,
    addMemberOptimistic,
    removeMemberOptimistic,
    deleteTeamOptimistic,
    createTeamOptimistic
  }
}
