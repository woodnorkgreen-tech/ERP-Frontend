<template>
  <!-- Use TaskDataViewer for readonly/completed tasks -->
  <TaskDataViewer v-if="isReadonly && !isEditMode" :task="task" @edit="isEditMode = true" />

  <!-- Editable Teams Task View -->
  <div v-else class="teams-task bg-white dark:bg-slate-950 rounded-xl shadow-sm p-4 sm:p-8 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    
    <!-- Simple Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <i class="mdi mdi-account-group text-2xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project {{ projectInfo.projectId }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ task.title }}</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {{ projectInfo.enquiryTitle }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="isEditMode"
            @click="isEditMode = false"
            class="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <i class="mdi mdi-close-circle-outline text-lg"></i>
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <!-- Information Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-account-tie text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Client</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.clientName }}</p>
          </div>
        </div>
        
        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-map-marker text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venue</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.eventVenue }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-calendar-check text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Setup Date</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ formatDate(projectInfo.setupDate) }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-account-check text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <span :class="[
              'text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md leading-none mt-1 inline-block',
              task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            ]">
              {{ task.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Team Form -->
    <div v-if="canAssignTeams && !isReadonly" class="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-8 transition-all">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <i class="mdi mdi-account-plus text-xl"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Rapid Team Assignment</h4>
            <p class="text-[10px] text-slate-400 font-medium">Quickly assign a new team to this project</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Team Type -->
          <div class="lg:col-span-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Team Type *</label>
            <div class="relative">
              <select 
                v-model="newTeamModal.team_type_id"
                class="w-full h-11 pl-10 pr-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none"
              >
                <option :value="null">Choose type...</option>
                <option v-for="teamType in COMMON_TEAM_TYPES" :key="teamType.id" :value="teamType.team_type_id" class="dark:bg-slate-900 text-slate-900 dark:text-white">
                  {{ teamType.display_name }}
                </option>
              </select>
              <i class="mdi mdi-account-star-outline absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <i class="mdi mdi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
          </div>

          <!-- Stage -->
          <div class="lg:col-span-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Stage *</label>
            <div class="flex gap-2">
              <button 
                v-for="cat in TEAM_CATEGORIES" 
                :key="cat.key"
                @click="newTeamModal.category = cat.key"
                type="button"
                class="flex-1 px-2 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-[0.1em] transition-all flex flex-col items-center justify-center gap-1"
                :class="newTeamModal.category === cat.key 
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:text-purple-500'"
              >
                <i :class="['mdi', cat.icon, 'text-base']"></i>
                {{ cat.shortLabel }}
              </button>
            </div>
          </div>

          <!-- Start Date -->
          <div class="lg:col-span-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Start Date</label>
            <input 
              v-model="newTeamModal.start_date"
              type="date"
              class="w-full h-11 px-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <!-- Add Button -->
          <div class="lg:col-span-2 flex items-end">
            <button 
              @click="submitAddTeam"
              :disabled="!newTeamModal.category || !newTeamModal.team_type_id"
              class="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <i class="mdi mdi-plus-circle mr-2"></i>
              Add Team
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Teams List by Category -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      <div v-for="category in TEAM_CATEGORIES" :key="category.key" class="category-card">
        <!-- Category Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
             <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center',
                category.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                category.color === 'amber' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
             ]">
                <i :class="['mdi', category.icon, 'text-xl']"></i>
             </div>
             <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">{{ category.label }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {{ teamsByCategory[category.key]?.length || 0 }} {{ teamsByCategory[category.key]?.length === 1 ? 'Team' : 'Teams' }}
                </p>
             </div>
          </div>
        </div>

        <!-- Team Items -->
        <div class="bg-white dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div v-if="teamsByCategory[category.key]?.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800/40">
            <div v-for="team in teamsByCategory[category.key]" :key="team.id" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex flex-col gap-4 group/team">
              <!-- Team Identity -->
              <div class="w-full">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <i class="mdi mdi-account-group-outline text-slate-400"></i>
                    {{ getTeamTypeDisplayName(team) }}
                  </div>
                  <button
                    v-if="canDeleteTeams && !isReadonly"
                    @click="deleteTeam(team.id)"
                    class="text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all w-7 h-7 flex items-center justify-center rounded-lg"
                    title="Remove Team"
                  >
                    <i class="mdi mdi-trash-can-outline"></i>
                  </button>
                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <span :class="getStatusColorClass(team.status)" class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md leading-none">
                    {{ getStatusLabel(team.status) }}
                  </span>
                  <span v-if="team.start_date" class="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                     <i class="mdi mdi-calendar-blank text-xs opacity-50"></i>
                     {{ formatDate(team.start_date) }}
                  </span>
                </div>
              </div>

              <!-- Members -->
              <div class="flex-1">
                <div class="flex flex-wrap gap-1.5 mb-3">
                   <div 
                      v-for="member in team.members || []" 
                      :key="member.id"
                      class="inline-flex items-center pl-3 pr-2 py-1.5 rounded-lg text-[11px] font-black text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all hover:border-purple-500/30 group/member"
                   >
                      <i class="mdi mdi-account-circle text-slate-400 mr-2 group-hover/member:text-indigo-500 transition-colors"></i>
                      <span class="uppercase tracking-wider font-bold">{{ member.member_name }}</span>
                      <button
                         v-if="canManageMembers && !isReadonly"
                         @click="removeMember(team.id, member.id)"
                         class="ml-2 text-slate-300 hover:text-rose-500 transition-colors w-5 h-5 flex items-center justify-center rounded"
                      >
                         <i class="mdi mdi-close text-xs"></i>
                      </button>
                   </div>
                </div>

                <!-- Add Member -->
                <div v-if="canManageMembers && !isReadonly" class="space-y-2 group/add">
                   <div class="relative">
                      <i class="mdi mdi-book-open-variant absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/add:text-purple-500 transition-colors z-10"></i>
                      <select
                         v-model="selectedLabourId[team.id]"
                         class="block w-full h-10 pl-9 pr-4 text-xs font-black bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-xl focus:ring-0 text-slate-900 dark:text-white appearance-none uppercase tracking-widest transition-all"
                      >
                         <option :value="null">Staff Directory...</option>
                         <option v-for="labour in labours" :key="labour.id" :value="labour.id">
                           {{ labour.full_name }} ({{ labour.specialization }})
                         </option>
                      </select>
                      <i class="mdi mdi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                   </div>

                   <div class="flex items-center gap-2">
                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">OR</span>
                     <div class="relative flex-1 min-w-[160px]">
                        <i class="mdi mdi-account-plus-outline absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/add:text-purple-500 transition-colors"></i>
                        <input
                           v-model="newMemberInputs[team.id]"
                           type="text"
                           placeholder="Type name manually..."
                           class="block w-full h-10 pl-9 pr-4 text-xs font-black bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-xl focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all uppercase tracking-widest"
                           @keydown.enter="addMemberToTeam(team.id)"
                        />
                     </div>
                   </div>

                    <button
                       @click="addMemberToTeam(team.id)"
                       :disabled="!selectedLabourId[team.id] && !newMemberInputs[team.id]?.trim()"
                       class="w-full h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                       <i class="mdi mdi-plus-circle text-base mr-2"></i>
                       Assign Personnel
                    </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
           <div v-else class="py-12 flex flex-col items-center justify-center text-center opacity-60">
              <i :class="['mdi', category.icon, 'text-4xl text-slate-300 dark:text-slate-700 mb-3']"></i>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No teams assigned</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="showSkipModal = true"
          class="h-10 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="mdi mdi-skip-next-circle-outline text-lg"></i>
          Skip Task
        </button>

        <button
          v-if="['skipped', 'completed'].includes(task.status)"
          @click="$emit('update-status', 'pending')"
          class="h-10 px-5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="mdi mdi-refresh text-lg"></i>
          {{ task.status === 'skipped' ? 'Reactivate Task' : 'Reopen Task' }}
        </button>

        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="$emit('update-status', 'completed')"
          class="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-emerald-500/30 transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="mdi mdi-check-decagram text-lg"></i>
          <span>Mark Done</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center gap-2 px-4 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
          <i class="mdi mdi-check-circle text-emerald-500"></i>
          <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Task Completed</span>
        </div>
      </div>
    </div>

    <!-- Skip Task Modal -->
    <Teleport to="body">
      <div v-if="showSkipModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showSkipModal = false"></div>
        <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 dark:border-slate-800">
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">Skip Task</h3>
          <p class="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest">Please give a reason for skipping</p>
          <div class="relative mb-6">
            <textarea
                v-model="skipReason"
                rows="4"
                class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 dark:text-white transition-all resize-none placeholder:text-slate-400 text-sm font-medium"
                placeholder="Why is this task being skipped?"
            ></textarea>
          </div>
          <div class="flex gap-3">
              <button @click="showSkipModal = false" class="flex-1 h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
              <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-rose-500/20 transition-all disabled:opacity-30">
                {{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}
              </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Feedback Toasts -->
    <div class="fixed bottom-8 right-8 z-[110] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div 
          v-for="msg in feedbackMessages" 
          :key="msg.id"
          class="pointer-events-auto px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
          :class="[
            msg.type === 'success' ? 'bg-emerald-500 text-white' : 
            msg.type === 'error' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-white'
          ]"
        >
          <i :class="['mdi', msg.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle', 'text-lg']"></i>
          <span class="text-xs font-black uppercase tracking-wider">{{ msg.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types'
import { useTeams } from '../../composables/useTeams'
import { useTechnicalLabour } from '@/modules/hr/composables/useTechnicalLabour'
import TaskDataViewer from './TaskDataViewer.vue'
import api from '@/plugins/axios'

interface Props {
  task: EnquiryTask
  readonly?: boolean
  initialEditMode?: boolean
}

interface Emits {
  'update-status': [status: EnquiryTask['status']]
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  initialEditMode: false
})
const emit = defineEmits<Emits>()

interface ProjectInfo {
  projectId: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate: string
}

interface NewTeamForm {
  category: string
  team_type_id: number | null
  start_date: string
}

interface FeedbackMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

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

const { labours, fetchLabours } = useTechnicalLabour()

const TEAM_CATEGORIES = [
  { id: 1, key: 'workshop', label: 'Workshop', shortLabel: 'Workshop', icon: 'mdi-hammer-wrench', color: 'blue' },
  { id: 2, key: 'setup', label: 'On-Site / Setup', shortLabel: 'Setup', icon: 'mdi-truck-delivery-outline', color: 'amber' },
  { id: 3, key: 'setdown', label: 'Setdown', shortLabel: 'Setdown', icon: 'mdi-archive-arrow-down-outline', color: 'rose' }
]

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

const isEditMode = ref(props.initialEditMode)
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)
const feedbackMessages = ref<FeedbackMessage[]>([])
const newMemberInputs = reactive<Record<number, string>>({})
const selectedLabourId = reactive<Record<number, number | null>>({})

const projectInfo = computed((): ProjectInfo => {
  const enquiry = props.task?.enquiry
  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || '',
    enquiryTitle: enquiry?.title || '',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || '',
    eventVenue: enquiry?.venue || '',
    setupDate: enquiry?.expected_delivery_date || '',
    setDownDate: ''
  }
})

const isReadonly = computed(() => {
  if (props.readonly === true) return true
  return props.task.status === 'completed' && !isEditMode.value
})

const newTeamModal = reactive<NewTeamForm>({
  category: 'workshop',
  team_type_id: null,
  start_date: projectInfo.value.setupDate !== 'TBC' ? projectInfo.value.setupDate : ''
})

const canAssignTeams = computed(() => true)
const canManageMembers = computed(() => true)
const canDeleteTeams = computed(() => true)

onMounted(async () => {
  try {
    await fetchTeamCategories()
    await fetchLabours()
    if (props.task?.id) {
        await fetchTeamsForTask(props.task.id)
    }
  } catch (error) {
    console.error('Failed to load team data:', error)
  }
})

const submitAddTeam = async () => {
  if (!newTeamModal.category || !newTeamModal.team_type_id) {
    addFeedbackMessage('error', 'Select both team type and stage')
    return
  }
  try {
    const categoryMap: Record<string, number> = { workshop: 1, setup: 2, setdown: 3 }
    await createTeamTask(props.task.id, {
      category_id: categoryMap[newTeamModal.category],
      team_type_id: newTeamModal.team_type_id,
      required_members: 1,
      start_date: newTeamModal.start_date || undefined,
      priority: 'medium'
    })
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Team added')
  } catch (error) {
    addFeedbackMessage('error', 'Failed to add team')
  }
}

const addMemberToTeam = async (teamTaskId: number) => {
  const labourId = selectedLabourId[teamTaskId]
  const manualName = newMemberInputs[teamTaskId]?.trim()
  if (!labourId && !manualName) return
  try {
    let payload: any = {}
    if (labourId) {
      const labour = labours.value.find(l => l.id === labourId)
      if (labour) {
        payload = {
          technical_labour_id: labour.id,
          member_name: labour.full_name,
          member_email: labour.email,
          member_phone: labour.phone,
          member_role: labour.specialization,
          hourly_rate: Number(labour.day_rate) / 8
        }
      }
    } else {
      payload = { member_name: manualName }
    }
    await addTeamMember(props.task.id, teamTaskId, payload)
    newMemberInputs[teamTaskId] = ''
    selectedLabourId[teamTaskId] = null
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Member added')
  } catch (error) {
    addFeedbackMessage('error', 'Failed to add member')
  }
}

const removeMember = async (teamTaskId: number, memberId: number) => {
  try {
    await removeTeamMember(props.task.id, teamTaskId, memberId)
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Member removed')
  } catch (error) {
    addFeedbackMessage('error', 'Failed to remove member')
  }
}

const deleteTeam = async (teamTaskId: number) => {
  if (!confirm('Remove this team?')) return
  try {
    await deleteTeamTask(props.task.id, teamTaskId)
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Team removed')
  } catch (error) {
    addFeedbackMessage('error', 'Failed to remove team')
  }
}

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
        addFeedbackMessage('success', 'Task skipped')
    } catch (err: any) {
        addFeedbackMessage('error', 'Failed to skip task')
    } finally {
        isSkipping.value = false
    }
}

const addFeedbackMessage = (type: FeedbackMessage['type'], message: string) => {
  const id = Math.random().toString(36).substr(2, 9)
  feedbackMessages.value.push({ id, type, message })
  setTimeout(() => {
    feedbackMessages.value = feedbackMessages.value.filter(m => m.id !== id)
  }, 3000)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400'
    case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
    case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400'
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
  }
}

const getStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

const getTeamTypeDisplayName = (team: any): string => {
  if (team.team_type?.display_name) return team.team_type.display_name
  const type = COMMON_TEAM_TYPES.find(t => t.team_type_id === team.team_type_id)
  return type?.display_name || 'Team'
}

watch(() => props.task, async (newTask, oldTask) => {
  if (newTask && (!oldTask || newTask.id !== oldTask.id)) {
    await fetchTeamsForTask(newTask.id)
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>