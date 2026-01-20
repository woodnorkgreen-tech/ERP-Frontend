<template>
  <!-- Use TaskDataViewer for readonly/completed tasks -->
  <TaskDataViewer v-if="isReadonly" :task="task" @edit="isEditMode = true" />

  <!-- Editable Teams Task View -->
  <div v-else class="teams-task bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
      <div class="flex gap-2">
        <button
            v-if="isEditMode"
            @click="isEditMode = false"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors font-medium flex items-center space-x-2"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Exit Edit Mode</span>
        </button>
      </div>
    </div>

    <!-- Team Management Section -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100">Project Teams</h4>
      <button
        v-if="canAssignTeams && !isReadonly"
        @click="showAddTeamModal = true"
        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors font-medium flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Add Team</span>
      </button>
    </div>

    <!-- Clearer Teams List by Category -->
    <div class="space-y-10">
      <div v-for="category in TEAM_CATEGORIES" :key="category.key" class="category-card">
        <!-- Distinct Category Section Header -->
        <div class="flex items-center justify-between mb-4 px-1">
          <div class="flex items-center gap-3">
             <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shadow-sm',
                category.color === 'blue' ? 'bg-blue-600 text-white' :
                category.color === 'amber' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
             ]">
                <i :class="['mdi', category.icon, 'text-xl']"></i>
             </div>
             <div>
                <h4 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{{ category.label }}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                   <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">{{ teamsByCategory[category.key]?.length || 0 }} teams assigned</span>
                </div>
             </div>
          </div>
          
          <button
            v-if="canAssignTeams && !isReadonly"
            @click="openAddTeamModal(category.key)"
            :class="[
              'px-3 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all border flex items-center gap-2',
              category.color === 'blue' ? 'text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-100' :
              category.color === 'amber' ? 'text-amber-600 border-amber-100 bg-amber-50/50 hover:bg-amber-100' : 
              'text-rose-600 border-rose-100 bg-rose-50/50 hover:bg-rose-100'
            ]"
          >
            <i class="mdi mdi-plus-circle"></i>
            Assign {{ category.key }}
          </button>
        </div>

        <!-- Team Items Card -->
        <div class="bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800/50 overflow-hidden">
          <div v-if="teamsByCategory[category.key]?.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800/40">
            <div v-for="team in teamsByCategory[category.key]" :key="team.id" class="p-5 hover:bg-white dark:hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-start gap-6">
              <!-- Team Type Identity -->
              <div class="w-full sm:w-1/4">
                <div class="text-[14px] font-black text-slate-900 dark:text-white flex items-center gap-2">
                   <i class="mdi mdi-account-group-outline text-slate-400"></i>
                   {{ getTeamTypeDisplayName(team) }}
                </div>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span :class="getStatusColorClass(team.status)" class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg leading-none shadow-sm">
                    {{ getStatusLabel(team.status) }}
                  </span>
                  <span v-if="team.start_date" class="text-[10px] text-slate-400 font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                     <i class="mdi mdi-calendar-blank text-xs mr-1"></i>
                     {{ formatDate(team.start_date) }}
                  </span>
                </div>
              </div>

              <!-- Assigned Personnel Grid -->
              <div class="flex-1">
                <div class="flex flex-wrap gap-2 mb-4">
                   <div 
                      v-for="member in team.members || []" 
                      :key="member.id"
                      class="inline-flex items-center pl-3 pr-2 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-sm group/member"
                   >
                      <i class="mdi mdi-account text-slate-400 mr-2 group-hover/member:text-blue-500 transition-colors"></i>
                      {{ member.member_name }}
                      <button
                         v-if="canManageMembers && !isReadonly"
                         @click="removeMember(team.id, member.id)"
                         class="ml-2 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-800 p-0.5 rounded-full"
                      >
                         <i class="mdi mdi-close text-[10px]"></i>
                      </button>
                   </div>
                </div>

                <!-- Personnel Addition Input -->
                <div v-if="canManageMembers && !isReadonly" class="flex items-center gap-3 max-w-sm group">
                   <div class="relative flex-1">
                      <i class="mdi mdi-account-plus absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input
                         v-model="newMemberInputs[team.id]"
                         type="text"
                         placeholder="Type name and press Enter..."
                         class="block w-full pl-10 pr-4 py-2 text-xs font-bold bg-slate-100/50 dark:bg-slate-800/80 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all italic"
                         @keydown.enter="addMemberToTeam(team.id)"
                      />
                   </div>
                   <button
                      @click="addMemberToTeam(team.id)"
                      v-show="newMemberInputs[team.id]?.trim()"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-all"
                   >
                      <i class="mdi mdi-check text-base"></i>
                   </button>
                </div>
              </div>

              <!-- Item Actions -->
              <div class="sm:w-12 flex justify-end">
                 <button
                    v-if="canDeleteTeams && !isReadonly"
                    @click="deleteTeam(team.id)"
                    class="text-slate-200 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all w-10 h-10 flex items-center justify-center rounded-xl"
                    title="Remove Team"
                 >
                    <i class="mdi mdi-trash-can-outline text-xl"></i>
                 </button>
              </div>
            </div>
          </div>

          <!-- Enhanced Empty State -->
          <div v-else class="py-12 flex flex-col items-center justify-center text-center">
             <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4 border-2 border-dashed border-slate-200 dark:border-slate-800">
                <i :class="['mdi', category.icon, 'text-3xl']"></i>
             </div>
             <h5 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Assignment Pending</h5>
             <button 
                v-if="canAssignTeams && !isReadonly"
                @click="openAddTeamModal(category.key)"
                class="text-xs text-blue-500 hover:text-blue-600 font-black flex items-center gap-2 group"
             >
                <i class="mdi mdi-plus transition-transform group-hover:rotate-90"></i>
                Create first {{ category.key }} team
             </button>
             <span v-else class="text-xs text-slate-400 italic">No personnel mapped yet</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Add Team Modal -->
    <div v-if="showAddTeamModal" class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Quick Team Setup</h3>
            <button @click="closeAddTeamModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="submitAddTeam" class="space-y-6">
            <!-- Category Chips -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Stage</label>
              <div class="flex gap-2">
                <button
                  v-for="cat in TEAM_CATEGORIES"
                  :key="cat.key"
                  type="button"
                  @click="newTeamModal.category = cat.key"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border',
                    newTeamModal.category === cat.key
                      ? 'bg-slate-800 text-white border-slate-800 dark:bg-blue-600 dark:border-blue-600'
                      : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  ]"
                >
                  {{ cat.key }}
                </button>
              </div>
            </div>

            <!-- Team Specialty -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Specialty</label>
              <select
                v-model="newTeamModal.team_type_id"
                class="w-full px-0 py-2 text-[13px] font-bold border-0 border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-0 bg-transparent text-slate-900 dark:text-white transition-all"
              >
                <option :value="null">Choose specialty...</option>
                <option v-for="teamType in COMMON_TEAM_TYPES" :key="teamType.id" :value="teamType.team_type_id">
                  {{ teamType.display_name }}
                </option>
              </select>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Start Date</label>
              <input
                v-model="newTeamModal.start_date"
                type="date"
                class="w-full px-0 py-2 text-[13px] font-bold border-0 border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-0 bg-transparent text-slate-900 dark:text-white transition-all"
              />
            </div>

            <!-- Modal Action -->
            <button
              type="submit"
              :disabled="!newTeamModal.category || !newTeamModal.team_type_id"
              class="w-full py-3 text-xs font-black uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-20 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
            >
              Assign Team
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="showSkipModal = true"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm"
        >
          Skip Task
        </button>

        <button
          v-if="['skipped', 'completed'].includes(task.status)"
          @click="$emit('update-status', 'pending')"
          class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm"
        >
          {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
        </button>

        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="$emit('update-status', 'completed')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Mark Complete</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center justify-center sm:justify-start space-x-2 text-green-600 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">Task Completed</span>
        </div>

        <!-- Readonly Indicator -->
        <div v-if="isReadonly && task.status !== 'completed'" class="flex items-center justify-center sm:justify-start space-x-2 text-blue-600 dark:text-blue-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="text-sm font-medium">Readonly Mode</span>
        </div>
      </div>
    </div>

    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Skip Task</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Please provide a reason for skipping this task.</p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            placeholder="Reason for skipping..."
        ></textarea>
        <div class="flex justify-end space-x-3">
            <button @click="showSkipModal = false" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { useTeams } from '../../composables/useTeams'
import { usePermissions } from '@/modules/finance/petty-cash/composables/usePermissions'
import TaskDataViewer from './TaskDataViewer.vue'
import api from '@/plugins/axios'

/**
 * Props interface for the TeamsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Optional readonly mode - if not provided, will be determined by task status */
  readonly?: boolean
}

/**
 * Events emitted by the TeamsTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
}

/**
 * Project information structure for the teams task
 */
interface ProjectInfo {
  /** Unique project identifier */
  projectId: string
  /** Title/name of the enquiry/project */
  enquiryTitle: string
  /** Name of the client for this project */
  clientName: string
  /** Venue where the event will take place */
  eventVenue: string
  /** Date when project setup begins (ISO date string) */
  setupDate: string
  /** Date when project set down occurs (ISO date string or "tbc") */
  setDownDate: string
  /** Estimated budget for the project */
  estimatedBudget?: number
  /** Contact person for the project */
  contactPerson: string
}

/**
 * New team modal form interface
 */
interface NewTeamModalForm {
  category: string
  team_type_id: number | null
  start_date: string
}

/**
 * User feedback message structure
 */
interface FeedbackMessage {
  /** Unique identifier */
  id: string
  /** Message type */
  type: 'success' | 'error' | 'warning' | 'info'
  /** Message text */
  message: string
  /** Timestamp when created */
  timestamp: Date
  /** Auto-dismiss timeout */
  timeout?: number
}

// Component setup
const props = withDefaults(defineProps<Props>(), {
  readonly: false
})
const emit = defineEmits<Emits>()

// Teams API integration
const {
  teamsTasks,
  teamsByCategory,
  fetchTeamsForTask,
  fetchTeamCategories,
  createTeamTask,
  addTeamMember,
  removeTeamMember,
  deleteTeamTask
} = useTeams()

const TEAM_CATEGORIES = [
  { id: 1, key: 'workshop', label: 'Workshop Teams', icon: 'mdi-hammer-wrench', color: 'blue' },
  { id: 2, key: 'setup', label: 'Setup Teams', icon: 'mdi-truck-delivery-outline', color: 'amber' },
  { id: 3, key: 'setdown', label: 'Setdown Teams', icon: 'mdi-archive-arrow-down-outline', color: 'rose' }
]



/**
 * Edit mode state - allows editing even when task is completed
 */
const isEditMode = ref(false)

/**
 * Modal state
 */
const showAddTeamModal = ref(false)

// Skip Task Logic
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await api.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        emit('update-status', 'skipped')
        showSkipModal.value = false
        skipReason.value = ''
        addFeedbackMessage('success', 'Task skipped successfully')
    } catch (err: any) {
        console.error('Skip task error:', err)
        addFeedbackMessage('error', err.response?.data?.message || 'Failed to skip task')
    } finally {
        isSkipping.value = false
    }
}

/**
 * Computed readonly state - readonly if prop is true OR (task is completed AND not in edit mode)
 */
const isReadonly = computed(() => {
  // If readonly prop is explicitly set (from TaskDataViewer or parent), use that
  if (props.readonly !== undefined) {
    return props.readonly
  }
  // Otherwise, check if task is completed and not in local edit mode
  return props.task.status === 'completed' && !isEditMode.value
})

/**
 * New team modal form data
 */
const newTeamModal = reactive<NewTeamModalForm>({
  category: 'workshop', // Default category
  team_type_id: null,
  start_date: ''
})

/**
 * New member inputs for each team
 */
const newMemberInputs = reactive<Record<number, string>>({})

/**
 * User feedback messages
 */
const feedbackMessages = ref<FeedbackMessage[]>([])

/**
 * Initialize data on component mount
 */
onMounted(async () => {
  try {
    // Load team categories
    await fetchTeamCategories()
    // Teams data is loaded by the immediate watcher on props.task
  } catch (error) {
    console.error('Error loading teams categories:', error)
    addFeedbackMessage('error', 'Failed to load team categories. Please refresh the page.')
  }
})

/**
 * Get all teams flat list
 */
const allTeams = computed(() => {
  return teamsTasks.value || []
})

/**
 * Hardcoded team types for each category
 */
/**
 * Common team types definition
 */
const COMMON_TEAM_TYPES = [
  { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
  { id: 2, team_type_id: 2, display_name: 'Technicians' },
  { id: 3, team_type_id: 3, display_name: 'Painters' },
  { id: 4, team_type_id: 4, display_name: 'Welders' },
  { id: 5, team_type_id: 5, display_name: 'Electricians' },
  { id: 6, team_type_id: 6, display_name: 'ICT' },
  { id: 7, team_type_id: 7, display_name: 'Loading' },
  { id: 8, team_type_id: 8, display_name: 'Offloading' },
  { id: 9, team_type_id: 9, display_name: 'Carpenters' }
]

/**
 * Team types for each category
 */
const hardcodedTeamTypes = {
  workshop: COMMON_TEAM_TYPES,
  setup: COMMON_TEAM_TYPES,
  setdown: COMMON_TEAM_TYPES
}

/**
 * Get available team types for a category (using hardcoded data)
 */
const getAvailableTeamTypes = (categoryId: string) => {
  return hardcodedTeamTypes[categoryId as keyof typeof hardcodedTeamTypes] || []
}

/**
 * Close add team modal
 */
const closeAddTeamModal = () => {
  showAddTeamModal.value = false
  // Reset form
  newTeamModal.category = 'workshop'
  newTeamModal.team_type_id = null
  newTeamModal.start_date = ''
}

/**
 * Open add team modal with optional category
 */
const openAddTeamModal = (categoryKey?: string) => {
  if (categoryKey) {
    newTeamModal.category = categoryKey
  }
  showAddTeamModal.value = true
}

/**
 * Submit add team form
 */
const submitAddTeam = async () => {
  if (!newTeamModal.category || !newTeamModal.team_type_id) {
    addFeedbackMessage('error', 'Please select a category and team type')
    return
  }

  try {
    // Map category to proper category_id
    const categoryMap: Record<string, number> = {
      workshop: 1,
      setup: 2,
      setdown: 3
    }

    const newTeam = await createTeamTask(props.task.id, {
      category_id: categoryMap[newTeamModal.category],
      team_type_id: newTeamModal.team_type_id,
      required_members: 1, // Default to 1, members added individually
      start_date: newTeamModal.start_date || undefined,
      priority: 'medium'
    })

    // Refresh teams data
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Team added successfully')
    closeAddTeamModal()
  } catch (error) {
    console.error('Error adding team:', error)
    addFeedbackMessage('error', 'Failed to add team. Please try again.')
  }
}

/**
 * Add member to a specific team
 */
const addMemberToTeam = async (teamTaskId: number) => {
  const memberName = newMemberInputs[teamTaskId]?.trim()

  if (!memberName) {
    addFeedbackMessage('error', 'Please enter a member name')
    return
  }

  try {
    await addTeamMember(props.task.id, teamTaskId, {
      member_name: memberName
    })

    // Clear input immediately
    newMemberInputs[teamTaskId] = ''

    // Refresh teams data
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Member added successfully')
  } catch (error) {
    console.error('Error adding member:', error)
    addFeedbackMessage('error', 'Failed to add member. Please try again.')
  }
}

/**
 * Remove member from a specific team
 */
const removeMember = async (teamTaskId: number, memberId: number) => {
  try {
    await removeTeamMember(props.task.id, teamTaskId, memberId)
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Member removed successfully')
  } catch (error) {
    console.error('Error removing member:', error)
    addFeedbackMessage('error', 'Failed to remove member. Please try again.')
  }
}

/**
 * Delete a team
 */
const deleteTeam = async (teamTaskId: number) => {
  if (!confirm('Are you sure you want to delete this team?')) {
    return
  }

  try {
    await deleteTeamTask(props.task.id, teamTaskId)
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Team deleted successfully')
  } catch (error) {
    console.error('Error deleting team:', error)
    addFeedbackMessage('error', 'Failed to delete team. Please try again.')
  }
}

/**
 * Add feedback message
 */
const addFeedbackMessage = (type: FeedbackMessage['type'], message: string, timeout = 5000) => {
  const feedbackMessage: FeedbackMessage = {
    id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    message,
    timestamp: new Date(),
    timeout
  }

  feedbackMessages.value.push(feedbackMessage)

  // Auto-remove message after timeout
  if (timeout > 0) {
    setTimeout(() => {
      removeFeedbackMessage(feedbackMessage.id)
    }, timeout)
  }
}

/**
 * Remove feedback message
 */
const removeFeedbackMessage = (messageId: string) => {
  const index = feedbackMessages.value.findIndex(msg => msg.id === messageId)
  if (index !== -1) {
    feedbackMessages.value.splice(index, 1)
  }
}

/**
 * Format date for display with enhanced error handling
 */
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'TBC' || dateString === 'N/A') {
    return 'TBC'
  }

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return 'TBC'
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting date:', dateString, error)
    return 'TBC'
  }
}

/**
 * Format currency for display with error handling
 */
const formatCurrency = (amount: number): string => {
  try {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0'
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    console.warn('Error formatting currency:', amount, error)
    return '0'
  }
}

/**
 * Get status color classes
 */
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

/**
 * Get status color classes for teams
 */
const getStatusColorClass = (status: string): string => {
  return getStatusColor(status)
}

/**
 * Get status label
 */
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'in_progress':
      return 'In Progress'
    case 'pending':
      return 'Pending'
    case 'cancelled':
      return 'Cancelled'
    case 'assigned':
      return 'Assigned'
    default:
      return 'Unknown'
  }
}

/**
 * Permission computed properties
 */
const canAssignTeams = computed(() => true)

const canManageMembers = computed(() => true)

const canDeleteTeams = computed(() => true)

/**
 * Get team type display name with fallback to hardcoded names
 */
const getTeamTypeDisplayName = (team: any): string => {
  // First try to get from team.team_type.display_name (API returns team_type, not teamType)
  if (team.team_type?.display_name) {
    return team.team_type.display_name
  }

  // Fallback to common team types
  const type = COMMON_TEAM_TYPES.find(t => t.team_type_id === team.team_type_id)
  return type?.display_name || 'Unknown Team'
}

/**
 * Watch for task prop changes and reinitialize if needed
 */
watch(
  () => props.task,
  async (newTask, oldTask) => {
    // updateProjectInfo() removed as part of simplification
    try {
      // Fetch teams if task ID changed or on initial load (immediate)
      if (newTask && (!oldTask || newTask.id !== oldTask.id)) {
        await fetchTeamsForTask(newTask.id)
      }
    } catch (err: any) { // Added type for error
      console.error('Error updating teams data for new task:', err)
      addFeedbackMessage('error', 'Failed to load teams data')
    }
  },
  { deep: true, immediate: true }
)
</script>