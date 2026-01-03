<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col relative z-20 border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
      
      <!-- Premium Header -->
      <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/30">
        <div class="flex items-center gap-6">
           <div class="p-4 bg-blue-500/10 rounded-2xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-account-multiple-plus-outline text-blue-600 text-3xl"></i>
          </div>
          <div>
              Task <span class="text-blue-500">Assignment</span>
            <div class="flex items-center gap-3 mt-1">
                <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">Enquiry Ref:</span>
                <span class="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest rounded-lg border border-blue-500/20 italic">
                    {{ enquiry?.title || 'Details' }}
                </span>
            </div>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all duration-300"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
      </div>

      <!-- Tab Navigation Section -->
      <div v-if="enquiryTasks.length > 0" class="px-10 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <nav class="flex gap-4 overflow-x-auto custom-scrollbar no-scrollbar py-4" aria-label="Tasks">
          <button
            v-for="task in enquiryTasks"
            :key="task.id"
            @click="activeTab = task.id"
            :class="[
              activeTab === task.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xl'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700',
              'whitespace-nowrap py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2'
            ]"
          >
            <i class="mdi mdi-circle text-[8px]" :class="activeTab === task.id ? 'text-blue-400' : 'text-slate-400'"></i>
            {{ task.title }}
          </button>
        </nav>
      </div>

      <!-- Modal Body -->
      <div class="flex-grow overflow-y-auto custom-scrollbar p-10 bg-slate-50/30 dark:bg-slate-900/20">
        
        <!-- States -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-32">
          <div class="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <p class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Loading Data...</p>
        </div>

        <div v-else-if="error" class="bg-red-500/5 border border-red-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 animate-in slide-in-from-top-4">
          <div class="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
            <i class="mdi mdi-alert-octagon text-3xl"></i>
          </div>
          <div>
             <h4 class="text-sm font-bold text-red-500 uppercase tracking-widest mb-1">An Error Occurred</h4>
             <p class="text-sm text-slate-500 font-medium">{{ error }}</p>
          </div>
        </div>

        <!-- Task Content -->
        <div v-else>
          <div v-if="enquiryTasks.length === 0" class="flex flex-col items-center justify-center py-32 opacity-20">
            <i class="mdi mdi-inbox-off-outline text-8xl text-slate-400"></i>
            <p class="mt-6 text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">No Task Data Available</p>
          </div>

          <div v-else-if="!activeTask" class="flex flex-col items-center justify-center py-32 opacity-20">
            <i class="mdi mdi-cursor-default-click-outline text-8xl text-slate-400"></i>
            <p class="mt-6 text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Selection Required</p>
          </div>

          <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex flex-col lg:flex-row gap-12">
              <!-- Left: Form -->
              <div class="flex-grow space-y-10">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Task Details</h3>
                    <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ activeTask.title }}</h3>
                    <div class="flex items-center gap-3 mt-3">
                        <span class="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-md border border-blue-500/20 italic">
                            {{ activeTask.type.replace('_', ' ') }}
                        </span>
                        <span :class="['text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border', getStatusColor(activeTask.status)]">
                            {{ getStatusLabel(activeTask.status) }}
                        </span>
                    </div>
                  </div>
                </div>

                <!-- Assignment Form -->
                <form @submit.prevent="assignTask(activeTask)" class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <!-- User Selection -->
                  <div class="space-y-3">
                    <label class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Assign to Project Officer*</label>
                    <div class="relative group">
                      <select
                        v-model="assignmentData[activeTask.id].assigned_user_id"
                        required
                        :disabled="loadingUsers"
                        class="w-full h-14 pl-12 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="0">{{ loadingUsers ? 'Loading...' : 'Select Officer' }}</option>
                        <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                          {{ user.name.toUpperCase() }} {{ user.department ? ` // ${user.department.toUpperCase()}` : '' }}
                        </option>
                      </select>
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <i class="mdi mdi-account-cog text-xl"></i>
                      </div>
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <i class="mdi mdi-chevron-down text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Priority Setup -->
                   <div class="space-y-3">
                    <label class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Priority</label>
                    <div class="relative group">
                      <select
                        v-model="assignmentData[activeTask.id].priority"
                        class="w-full h-14 pl-12 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="low">LOW</option>
                        <option value="medium">MEDIUM</option>
                        <option value="high">HIGH</option>
                        <option value="urgent">URGENT</option>
                      </select>
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                        <i class="mdi mdi-fire text-xl"></i>
                      </div>
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <i class="mdi mdi-chevron-down text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Deadline Selection -->
                   <div class="space-y-3">
                    <label class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Due Date</label>
                    <div class="relative group">
                      <input
                        v-model="assignmentData[activeTask.id].due_date"
                        type="date"
                        :min="new Date().toISOString().split('T')[0]"
                        class="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <i class="mdi mdi-calendar-clock text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Deployment Notes -->
                   <div class="space-y-3">
                    <label class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Notes / Instructions</label>
                    <textarea
                      v-model="assignmentData[activeTask.id].notes"
                      rows="1"
                      class="w-full px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                      placeholder="Enter specific instructions..."
                    ></textarea>
                  </div>

                  <div class="md:col-span-2 flex justify-end pt-10 border-t border-slate-200/50 dark:border-slate-800/50">
                    <button
                      type="submit"
                      :disabled="assignmentData[activeTask.id].assigned_user_id === 0 || assigningTask === activeTask.id"
                      class="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                       <div v-if="assigningTask === activeTask.id" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <i v-else class="mdi mdi-rocket-launch text-xl"></i>
                       <span>{{ assigningTask === activeTask.id ? 'Assigning...' : 'Assign Task' }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Right: History Side Panel -->
              <div v-if="activeTask.assignmentHistory && activeTask.assignmentHistory.length > 0" class="lg:w-96 shrink-0">
                 <div class="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                        <h4 class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Assignment History</h4>
                    </div>
                    <div class="space-y-8 flex-grow">
                      <div
                        v-for="(history, idx) in activeTask.assignmentHistory.slice(0, 3)"
                        :key="history.id"
                        class="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 pb-2"
                      >
                         <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                         <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{{ formatDate(history.assigned_at) }}</p>
                         <p class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Active Duty: <span class="text-blue-500">{{ history.assignedTo?.name }}</span></p>
                         <p v-if="history.notes" class="mt-3 text-[10px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-800 pl-3">"{{ history.notes }}"</p>
                      </div>
                      
                      <div
                        v-if="activeTask.assignmentHistory.length > 3"
                        class="pt-4 flex items-center justify-center"
                      >
                        <button class="text-xs font-bold text-slate-400 hover:text-blue-500 uppercase tracking-[0.2em] transition-colors">
                            +{{ activeTask.assignmentHistory.length - 3 }} Historical Records
                        </button>
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
          enter-from-class="translate-y-10 opacity-0 scale-90"
          enter-to-class="translate-y-0 opacity-100 scale-100"
          leave-active-class="transform transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-90"
        >
          <div v-if="successMessage" class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[120] w-full max-w-lg">
            <div class="bg-slate-900 dark:bg-white text-white dark:text-slate-950 p-6 rounded-3xl shadow-2xl border border-white/10 dark:border-slate-200 flex items-center gap-6">
              <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/40">
                <i class="mdi mdi-check-decagram text-3xl"></i>
              </div>
              <div>
                <h5 class="text-sm font-bold uppercase tracking-[0.2em] mb-1">Task Assigned</h5>
                <p class="text-sm font-medium opacity-80 leading-relaxed">{{ successMessage }}</p>
              </div>
            </div>
          </div>
        </transition>

      </div>

      <!-- Modal Footer -->
      <div class="px-10 py-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center">
        <button
          @click="$emit('close')"
          class="h-12 px-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-[0.2em] rounded-xl transition-all"
        >
          Abort Protocol
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
    console.log('✅ [TaskAssignmentModal] Extracted raw users array:', users)
    console.log('✅ [TaskAssignmentModal] Users count:', users.length)

    // Normalize user data to match interface and template expectations
    const normalizedUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name || u.username || `User ${u.id}`,
      department: typeof u.department === 'string' 
        ? u.department 
        : (u.department?.name || u.department_name || '')
    }))

    availableUsers.value = normalizedUsers
    console.log('✅ [TaskAssignmentModal] Available users normalized and loaded:', availableUsers.value.length, 'users')
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

watch([() => props.show, () => props.enquiryId], async ([newShow, newId]) => {
  console.log('🔍 [TaskAssignmentModal] Watch triggered:', { show: newShow, enquiryId: newId })
  
  if (newShow && newId && typeof newId === 'number' && newId > 0) {
    try {
      console.log('🔍 [TaskAssignmentModal] Conditions met, fetching tasks for:', newId)
      await fetchEnquiryTasks(newId)
      initializeAssignmentData()
      
      if (enquiryTasks.value.length > 0) {
        activeTab.value = enquiryTasks.value[0].id
        console.log('🔍 [TaskAssignmentModal] Tasks loaded, activeTab set to:', activeTab.value)
      } else {
        activeTab.value = null
        console.warn('🔍 [TaskAssignmentModal] No tasks returned for enquiry:', newId)
      }
    } catch (err) {
      console.error('🔍 [TaskAssignmentModal] Failed to fetch tasks:', err)
    }
  } else if (newShow && !newId) {
    console.warn('🔍 [TaskAssignmentModal] Modal opened but enquiryId is missing or 0')
  }
}, { immediate: true })

onMounted(async () => {
  console.log('🔍 [TaskAssignmentModal] Component mounted, fetching available users')
  await fetchAvailableUsers()
})
</script>
