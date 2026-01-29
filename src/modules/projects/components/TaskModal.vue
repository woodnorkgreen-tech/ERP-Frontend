<template>
  <Teleport to="body">
    <Transition name="modal-container">
      <div v-if="show && task" class="fixed inset-0 z-[100] font-poppins flex justify-end overflow-hidden">
        <!-- Glass Backdrop -->
        <Transition name="backdrop-fade" appear>
          <div 
            v-if="show"
            class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
            @click="closeModal"
          ></div>
        </Transition>

        <!-- Sliding Panel Container -->
        <Transition name="panel-slide" appear>
          <div v-if="show" class="bg-white dark:bg-gray-900 shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[1600px] h-full flex flex-col relative z-20 border-l border-white/20 dark:border-gray-800">
            
            <!-- Premium Header -->
            <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-30">
              <div class="flex items-center space-x-5">
                <!-- Navigation Arrows -->
                <div class="flex items-center space-x-2 mr-4">
                    <button 
                        @click="switchTask(prevTask)" 
                        :disabled="!prevTask"
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-blue-200"
                        title="Previous Task"
                    >
                        <i class="mdi mdi-chevron-left text-2xl"></i>
                    </button>
                    <button 
                        @click="switchTask(nextTask)" 
                        :disabled="!nextTask"
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-blue-200"
                        title="Next Task"
                    >
                        <i class="mdi mdi-chevron-right text-2xl"></i>
                    </button>
                </div>

                <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
                  <i class="mdi mdi-clipboard-text-outline text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-2xl font-black text-gray-900 dark:text-white truncate max-w-[600px] tracking-tighter">
                      {{ task.title }}
                    </h2>
                    <span
                      :class="[
                        'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm',
                        getStatusColor(task.status)
                      ]"
                    >
                      {{ getStatusLabel(task.status) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium flex items-center">
                    <span class="capitalize">{{ task.type.replace('_', ' ') }} Task</span>
                    <span class="mx-2 text-gray-300">•</span>
                    <span class="text-blue-600 dark:text-blue-400 opacity-80 italic">
                      <span v-if="task.enquiry" :class="task.enquiry.job_number ? 'font-black' : ''">
                        {{ task.enquiry.job_number || task.enquiry.enquiry_number }}
                      </span>
                      <span v-if="task.enquiry"> — </span>
                      {{ task.enquiry?.title || 'Standalone Project' }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-6">
                <div class="hidden md:flex flex-col items-end mr-6 pr-6 border-r border-gray-100 dark:border-gray-800">
                   <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Assigned To</p>
                   <button 
                    v-if="canRelease(task)" 
                    @click="releaseTask"
                    :disabled="isReleasing"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    <i v-if="isReleasing" class="mdi mdi-loading mdi-spin"></i>
                    <i v-else class="mdi mdi-lock-open-outline"></i>
                    <span>Release</span>
                  </button>
                  <div v-else class="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[8px] font-bold text-blue-600 dark:text-blue-400">
                        {{ getInitials(getAssignedUserName(task)) }}
                    </div>
                    {{ getAssignedUserName(task) }}
                  </div>
                </div>

                <button
                  @click="closeModal"
                  class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                >
                  <svg class="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Navigation Tabs (Sticky) -->
            <div class="px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-[89px] z-30">
              <nav class="flex space-x-1" aria-label="Tabs">
                <button 
                  v-for="tab in [{id: 'details', label: 'Execution', icon: 'mdi-play-box-outline'}, {id: 'history', label: 'Logs', icon: 'mdi-history'}]"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/10'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50',
                    'whitespace-nowrap pt-4 pb-3 px-6 border-b-2 font-bold text-xs uppercase tracking-[0.2em] transition-all'
                  ]"
                >
                  <i class="mdi mr-2 text-base align-middle" :class="tab.icon"></i>
                  {{ tab.label }}
                </button>
              </nav>
            </div>

            <!-- Panel Body -->
            <div class="flex-grow overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900">
              
              <!-- Locked/Read-Only Banner -->
              <div v-if="readonly" class="bg-amber-500/10 border-b border-amber-500/20 px-8 py-3">
                <div class="flex items-center text-amber-700 dark:text-amber-400">
                  <i class="mdi mdi-lock-outline mr-2 text-lg"></i>
                  <span class="text-[10px] font-bold uppercase tracking-wide">Read-Only Session</span>
                </div>
              </div>

              <div class="p-8">
                <div class="task-content">
                  <Transition name="fade-slide" mode="out-in">
                    <div :key="activeTab">
                      <div v-if="activeTab === 'details'">
                        <TaskRenderer
                          :key="task.id"
                          :task="task"
                          :readonly="readonly"
                          :initial-tab="initialTab"
                          @update-status="handleStatusUpdate"
                          @complete="handleComplete"
                          @save-design-data="handleSaveDesignData"
                          @switch-task="handleSwitchTask"
                        />
                      </div>
                      <div v-else-if="activeTab === 'history'">
                        <TaskHistory :taskId="task.id" />
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import TaskRenderer from './tasks/TaskRenderer.vue'
import TaskHistory from './TaskHistory.vue'
import type { DesignAsset } from './tasks/design/types/design'
import { useAuth } from '@/composables/useAuth'
import api from '@/plugins/axios'

const activeTab = ref('details')

interface Props {
  show: boolean
  task: EnquiryTask | null
  prevTask?: EnquiryTask | null
  nextTask?: EnquiryTask | null
  readonly?: boolean
  initialTab?: string | null
}

const props = defineProps<Props>()
const { user } = useAuth()

// State
const isClaiming = ref(false)
const isReleasing = ref(false)

// Debug: Log task data when it changes
watch(() => props.task, (newTask) => {
  if (newTask) {
    console.log('[DEBUG TaskModal] Task received:', {
      id: newTask?.id,
      title: newTask?.title,
      assigned_to: newTask?.assigned_to
    })
  }
}, { immediate: true })

const emit = defineEmits<{
  'close': []
  'update-status': [status: EnquiryTask['status']]
  'complete': []
  'save-design-data': [taskId: number, data: DesignAsset[]]
  'assign': [task: EnquiryTask]
  'switch-task': [task: EnquiryTask | string]
}>()

const closeModal = () => {
  emit('close')
}

// Handle Escape key press to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    closeModal()
  }
}

// Add/remove keyboard event listener
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleStatusUpdate = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const handleComplete = () => {
  emit('complete')
}

const handleSaveDesignData = (data: DesignAsset[]) => {
  if (props.task) {
    emit('save-design-data', props.task.id, data)
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}

const isOverdue = (dueDate: string) => {
  if (!dueDate) return false
  if (props.task?.status === 'completed' || props.task?.status === 'cancelled' || props.task?.status === 'skipped') return false
  return new Date(dueDate) < new Date()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const isAssigned = (task: EnquiryTask | null): boolean => {
  if (!task) return false
  return !!(
    task.assigned_to || 
    task.assignedUser || 
    (task.assigned_users && task.assigned_users.length > 0) ||
    (task.assignedUsers && task.assignedUsers.length > 0)
  )
}

const getAssignedUserName = (task: EnquiryTask | null): string => {
  if (!task) return 'Unassigned'
  if (task.assigned_to?.name) return task.assigned_to.name
  if (task.assignedUser?.name) return task.assignedUser.name
  if (task.assigned_users && task.assigned_users.length > 0) {
    return task.assigned_users[0].name
  }
  if (task.assignedUsers && task.assignedUsers.length > 0) {
    return task.assignedUsers[0].name
  }
  return 'Unassigned'
}

const getInitials = (name?: string | null) => {
  if (!name || name === 'Unassigned') return '?'
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const canRelease = (task: EnquiryTask | null): boolean => {
  if (!task || !user.value) return false
  if (task.status === 'completed' || task.status === 'cancelled') return false
  
  const currentUserId = user.value.id
  const isPrimaryAssignee = task.assigned_to?.id === currentUserId || task.assigned_user_id === currentUserId
  const isOneOfAssignees = task.assignedUsers?.some(u => u.id === currentUserId) || 
                          task.assigned_users?.some(u => u.id === currentUserId)
  
  const isAdmin = user.value.roles?.some(r => 
    ['Super Admin', 'Project Manager', 'Project Officer'].includes(typeof r === 'string' ? r : (r as any).name)
  )
  
  return isPrimaryAssignee || isOneOfAssignees || !!isAdmin
}

const releaseTask = async () => {
  if (!props.task || !user.value?.id) return
  const reason = prompt(`Please provide a reason for releasing task "${props.task.title}" back to the pool:`)
  if (reason === null) return
  if (!reason.trim()) {
      alert("A reason is required to release the task.")
      return
  }
  isReleasing.value = true
  try {
    const response = await api.put(`/api/projects/enquiry-tasks/${props.task.id}/release`, { reason })
    emit('assign', response.data.data)
  } catch (error) {
    console.error('Error releasing task:', error)
    alert('Failed to release task. Please try again.')
  } finally {
    isReleasing.value = false
  }
}

const switchTask = (targetTask: EnquiryTask | null | undefined) => {
    if (targetTask) {
        emit('switch-task', targetTask)
    }
}

const handleSwitchTask = (taskOrType: EnquiryTask | string) => {
  console.log('[DEBUG] TaskModal: handleSwitchTask called with:', taskOrType)
  emit('switch-task', taskOrType)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

/* Modal Container (Persistence for children) */
.modal-container-enter-active,
.modal-container-leave-active {
  transition: all 0.8s;
}

/* Backdrop Fade Transition */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-slide-enter-from {
  transform: translateX(100%);
}

.panel-slide-leave-to {
  transform: translateX(100%);
}

/* Tab Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
