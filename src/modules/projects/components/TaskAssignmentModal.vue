<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div class="flex items-center space-x-5">
           <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-account-multiple-plus-outline text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              Task Assignment Hub
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium flex items-center shrink-0">
               <span class="opacity-70">Project Context:</span>
               <span class="ml-1.5 text-blue-600 dark:text-blue-400 font-bold italic">{{ enquiry?.title || 'Global Context' }}</span>
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Tab Navigation Section -->
      <div v-if="enquiryTasks.length > 0" class="px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <nav class="flex space-x-1 overflow-x-auto custom-scrollbar no-scrollbar" aria-label="Tasks">
          <button
            v-for="task in enquiryTasks"
            :key="task.id"
            @click="activeTab = task.id"
            :class="[
              activeTab === task.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50',
              'whitespace-nowrap pt-4 pb-3 px-6 border-b-2 font-bold text-xs uppercase tracking-widest transition-all'
            ]"
          >
            <i class="mdi mdi-circle-small mr-1 align-middle text-lg" :class="activeTab === task.id ? 'opacity-100' : 'opacity-30'"></i>
            {{ task.title }}
          </button>
        </nav>
      </div>

      <!-- Modal Body -->
      <div class="flex-grow overflow-y-auto custom-scrollbar p-8 bg-gray-50/30 dark:bg-gray-900/40">
        
        <!-- States -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative w-12 h-12">
            <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-4 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Scanning Tasks...</p>
        </div>

        <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-4">
          <div class="p-2 bg-red-500 rounded-lg text-white shadow-lg shadow-red-500/20">
            <i class="mdi mdi-alert-circle-outline text-xl"></i>
          </div>
          <div>
             <h4 class="text-sm font-bold text-red-700 dark:text-red-400">Assignment Error</h4>
             <p class="text-xs text-red-600/80 dark:text-red-400/70 font-medium">{{ error }}</p>
          </div>
        </div>

        <!-- Task Content -->
        <div v-else>
          <div v-if="enquiryTasks.length === 0" class="flex flex-col items-center justify-center py-24 opacity-40">
            <i class="mdi mdi-clipboard-text-off-outline text-6xl text-gray-300"></i>
            <p class="mt-4 text-sm font-bold uppercase tracking-widest">No executable tasks found</p>
          </div>

          <div v-else-if="!activeTask" class="flex flex-col items-center justify-center py-24 opacity-40">
            <i class="mdi mdi-gesture-tap text-6xl text-gray-300"></i>
            <p class="mt-4 text-sm font-bold uppercase tracking-widest">Select target task to deploy</p>
          </div>

          <div v-else class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- Left: Form -->
              <div class="flex-grow space-y-8">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1 block">Active Selection</span>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ activeTask.title }}</h3>
                    <p class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 opacity-70">{{ activeTask.type.replace('_', ' ') }}</p>
                  </div>
                   <span
                    :class="[
                      'text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm border',
                      getStatusColor(activeTask.status),
                      'bg-opacity-50 backdrop-blur-sm'
                    ]"
                  >
                    {{ getStatusLabel(activeTask.status) }}
                  </span>
                </div>

                <!-- Assignment Form -->
                <form @submit.prevent="assignTask(activeTask)" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <!-- User Selection -->
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Responsible Agent *</label>
                    <div class="relative group">
                      <select
                        v-model="assignmentData[activeTask.id].assigned_user_id"
                        required
                        :disabled="loadingUsers"
                        class="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        <option value="0">{{ loadingUsers ? 'Populating agents...' : 'Select execution agent' }}</option>
                        <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                          {{ user.name }} {{ user.department ? ` — ${user.department}` : '' }}
                        </option>
                      </select>
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
                        <i class="mdi mdi-account-cog-outline text-xl"></i>
                      </div>
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                        <i class="mdi mdi-chevron-down text-xl"></i>
                      </div>
                    </div>
                    <p class="text-[10px] font-medium text-gray-400 flex items-center ml-1">
                      <i class="mdi mdi-information-outline mr-1"></i>
                      {{ loadingUsers ? 'Connecting to workforce directory...' : `Identity verified for ${availableUsers.length} available agents` }}
                    </p>
                  </div>

                  <!-- Priority Setup -->
                   <div class="space-y-2">
                    <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Execution Priority</label>
                    <div class="relative group">
                      <select
                        v-model="assignmentData[activeTask.id].priority"
                        class="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="low">Standard / Low</option>
                        <option value="medium">Optimized / Medium</option>
                        <option value="high">Priority / High</option>
                        <option value="urgent">Critical / Urgent</option>
                      </select>
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500">
                        <i class="mdi mdi-lightning-bolt-outline text-xl"></i>
                      </div>
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                        <i class="mdi mdi-chevron-down text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Deadline Selection -->
                   <div class="space-y-2">
                    <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Completion Deadline</label>
                    <div class="relative group">
                      <input
                        v-model="assignmentData[activeTask.id].due_date"
                        type="date"
                        :min="new Date().toISOString().split('T')[0]"
                        class="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                      />
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
                        <i class="mdi mdi-calendar-clock-outline text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Deployment Notes -->
                   <div class="space-y-2">
                    <label class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Assignment Directive</label>
                    <textarea
                      v-model="assignmentData[activeTask.id].notes"
                      rows="1"
                      class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-300"
                      placeholder="Optional technical notes or strategic guidance..."
                    ></textarea>
                  </div>

                  <div class="md:col-span-2 flex justify-end pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                    <button
                      type="submit"
                      :disabled="assignmentData[activeTask.id].assigned_user_id === 0 || assigningTask === activeTask.id"
                      class="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:scale-100 ring-2 ring-white dark:ring-gray-900 border border-blue-400/30"
                    >
                       <div v-if="assigningTask === activeTask.id" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                       <i v-else class="mdi mdi-rocket-launch-outline text-lg"></i>
                       <span>{{ assigningTask === activeTask.id ? 'Deploying...' : 'Execute Assignment' }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Right: History Side Panel -->
              <div v-if="activeTask.assignmentHistory && activeTask.assignmentHistory.length > 0" class="lg:w-80 shrink-0">
                 <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-full flex flex-col">
                    <h4 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                      <i class="mdi mdi-history mr-2 text-sm"></i>
                      Log Trail
                    </h4>
                    <div class="space-y-6 flex-grow">
                      <div
                        v-for="(history, idx) in activeTask.assignmentHistory.slice(0, 3)"
                        :key="history.id"
                        class="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800 pb-2"
                      >
                         <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                         <p class="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">Assigned to {{ history.assignedTo?.name }}</p>
                         <p class="text-[10px] text-gray-400 mt-1 font-medium">{{ formatDate(history.assigned_at) }}</p>
                         <p v-if="history.notes" class="mt-2 text-[10px] text-gray-500 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg italic">"{{ history.notes }}"</p>
                      </div>
                      
                      <div
                        v-if="activeTask.assignmentHistory.length > 3"
                        class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center justify-center pt-2"
                      >
                        +{{ activeTask.assignmentHistory.length - 3 }} ARCHIVED LOGS
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <transition 
          enter-active-class="transform transition duration-300 ease-out"
          enter-from-class="translate-y-4 opacity-0 scale-95"
          enter-to-class="translate-y-0 opacity-100 scale-100"
          leave-active-class="transform transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="successMessage" class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[120] w-full max-w-sm">
            <div class="bg-emerald-500 dark:bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center border border-white/20">
              <div class="p-2 bg-white/20 rounded-xl mr-4 shrink-0">
                <i class="mdi mdi-check-decagram text-white text-2xl"></i>
              </div>
              <div>
                <h5 class="text-sm font-bold">Assignment Successful</h5>
                <p class="text-xs text-white/80 font-medium">{{ successMessage }}</p>
              </div>
            </div>
          </div>
        </transition>

      </div>

      <!-- Modal Footer -->
      <div class="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3 items-center">
        <button
          @click="$emit('close')"
          class="px-8 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-full transition-all"
        >
          Dismiss Hub
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 4px;
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}
</style>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'
import api from '@/plugins/axios'

interface Props {
  show: boolean
  enquiryId: number
  enquiry?: {
    id: number
    title: string
  }
}

interface AssignmentFormData {
  assigned_user_id: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string
  notes: string
}

interface User {
  id: number
  name: string
  department?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  taskAssigned: [task: EnquiryTask]
}>()

const { enquiryTasks, loading, error, fetchEnquiryTasks, assignTask: assignTaskApi } = useTaskAssignment()

const availableUsers = ref<User[]>([])
const assignmentData = reactive<Record<number, AssignmentFormData>>({})
const assigningTask = ref<number | null>(null)
const loadingUsers = ref(false)
const activeTab = ref<number | null>(null)
const successMessage = ref<string>('')

const activeTask = computed(() => enquiryTasks.value.find(task => task.id === activeTab.value))

const initializeAssignmentData = () => {
  enquiryTasks.value.forEach(task => {
    if (!assignmentData[task.id]) {
      assignmentData[task.id] = {
        assigned_user_id: 0,
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
        notes: task.notes || '',
      }
    }
  })
}

const fetchAvailableUsers = async () => {
  loadingUsers.value = true
  try {
    console.log('🔍 [TaskAssignmentModal] Starting fetchAvailableUsers')
    console.log('🔍 [TaskAssignmentModal] Current auth token:', api.defaults.headers.common['Authorization'])
    console.log('🔍 [TaskAssignmentModal] API base URL:', api.defaults.baseURL)
    console.log('🔍 [TaskAssignmentModal] Fetching all users from /api/users')

    const response = await api.get('/api/users', {
      params: {
        per_page: 1000, // Fetch up to 1000 users (all users)
        status: 'active' // Optional: only fetch active users
      }
    })
    console.log('✅ [TaskAssignmentModal] Users response status:', response.status)
    console.log('✅ [TaskAssignmentModal] Users response headers:', response.headers)
    console.log('✅ [TaskAssignmentModal] Users response data:', JSON.stringify(response.data, null, 2))

    const users = response.data.data || []
    console.log('✅ [TaskAssignmentModal] Extracted users array:', users)
    console.log('✅ [TaskAssignmentModal] Users count:', users.length)

    // Validate user data structure
    if (users.length > 0) {
      console.log('✅ [TaskAssignmentModal] First user structure:', JSON.stringify(users[0], null, 2))
      const hasRequiredFields = users.every((user: User) => user.id && user.name)
      console.log('✅ [TaskAssignmentModal] All users have required fields (id, name):', hasRequiredFields)
    }

    availableUsers.value = users
    console.log('✅ [TaskAssignmentModal] Available users loaded:', availableUsers.value.length, 'users')
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; response?: { status?: number; data?: unknown }; config?: unknown }
    console.error('❌ [TaskAssignmentModal] Error fetching available users:', error)
    console.error('❌ [TaskAssignmentModal] Error name:', error.name)
    console.error('❌ [TaskAssignmentModal] Error message:', error.message)
    console.error('❌ [TaskAssignmentModal] Error response status:', error.response?.status)
    console.error('❌ [TaskAssignmentModal] Error response data:', JSON.stringify(error.response?.data, null, 2))
    console.error('❌ [TaskAssignmentModal] Error config:', JSON.stringify(error.config, null, 2))

    // Check for specific error types
    const status = error.response?.status
    if (status === 401) {
      console.error('❌ [TaskAssignmentModal] Authentication failed - user not logged in or token expired')
    } else if (status === 403) {
      console.error('❌ [TaskAssignmentModal] Permission denied - user lacks USER_READ or TASK_ASSIGN permissions')
    } else if (status && status >= 500) {
      console.error('❌ [TaskAssignmentModal] Server error - check backend logs')
    }

    availableUsers.value = []
  } finally {
    loadingUsers.value = false
    console.log('🔍 [TaskAssignmentModal] fetchAvailableUsers completed, loadingUsers:', loadingUsers.value)
  }
}

const assignTask = async (task: EnquiryTask) => {
  try {
    console.log('[DEBUG] TaskAssignmentModal assignTask called for task:', task.id, task.title)
    assigningTask.value = task.id
    const data = assignmentData[task.id]
    console.log('[DEBUG] TaskAssignmentModal assignment data:', data)

    const updatedTask = await assignTaskApi(task.id, {
      assigned_user_id: data.assigned_user_id,
      priority: data.priority,
      due_date: data.due_date,
      notes: data.notes,
    })

    console.log('[DEBUG] TaskAssignmentModal assignTaskApi returned:', updatedTask)
    console.log('[DEBUG] TaskAssignmentModal updatedTask assignmentHistory:', updatedTask.assignmentHistory)

    // Show success message
    const assignedUser = availableUsers.value.find(u => u.id === data.assigned_user_id)
    successMessage.value = `Task "${task.title}" successfully assigned to ${assignedUser?.name || 'user'}!`
    
    emit('taskAssigned', updatedTask)

    // Reset form
    assignmentData[task.id] = {
      assigned_user_id: 0,
      priority: 'medium',
      due_date: '',
      notes: '',
    }
    console.log('[DEBUG] TaskAssignmentModal form reset for task:', task.id)
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      successMessage.value = ''
      emit('close')
    }, 2000)
  } catch (err) {
    console.error('[DEBUG] TaskAssignmentModal assignTask error:', err)
    successMessage.value = ''
  } finally {
    assigningTask.value = null
    console.log('[DEBUG] TaskAssignmentModal assignTask completed for task:', task.id)
  }
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
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

watch(() => props.show, async (newShow) => {
  console.log('🔍 [TaskAssignmentModal] Modal visibility changed:', newShow)
  console.log('🔍 [TaskAssignmentModal] enquiryId:', props.enquiryId)
  
  if (newShow && props.enquiryId && props.enquiryId > 0) {
    console.log('🔍 [TaskAssignmentModal] Fetching enquiry tasks for ID:', props.enquiryId)
    await fetchEnquiryTasks(props.enquiryId)
    initializeAssignmentData()
    activeTab.value = enquiryTasks.value[0]?.id || null
  } else if (newShow && !props.enquiryId) {
    // If no enquiry ID, we might be opening from a single task
    // The parent should handle passing the task's enquiry properly
    console.warn('🔍 [TaskAssignmentModal] Opened without enquiryId - tasks may not load')
  }
})

onMounted(async () => {
  console.log('🔍 [TaskAssignmentModal] Component mounted, fetching available users')
  await fetchAvailableUsers()
})
</script>
