<template>
  <transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl modal-panel relative z-50 sm:my-2 sm:align-middle sm:max-w-[98vw] sm:w-full" @click.stop>
          <div class="flex flex-col h-[95vh]">
              <!-- Header -->
              <div class="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-1">
                      <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        {{ enquiry?.title || 'Loading...' }}
                      </h2>
                      <span v-if="enquiry?.job_number" class="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                        {{ enquiry.job_number }}
                      </span>
                    </div>
                    
                    <div v-if="enquiry" class="flex items-center flex-wrap gap-3 text-sm">
                      <span class="text-gray-500 dark:text-gray-400 font-mono text-xs">{{ enquiry.enquiry_number }}</span>
                      
                      <span :class="getStatusColor(enquiry.status)" class="px-2 py-0.5 rounded-full text-xs font-medium border border-opacity-10 bg-opacity-10">
                        {{ getStatusLabel(enquiry.status) }}
                      </span>

                      <span v-if="enquiry.priority" :class="getPriorityColor(enquiry.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium border border-opacity-10 bg-opacity-10">
                        {{ enquiry.priority?.toUpperCase() }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions & Close -->
                  <div class="flex items-center gap-2 ml-4">
                     <!-- Action Toolbar -->
                     <!-- Action Toolbar -->
                     <div v-if="enquiry" class="flex items-center gap-2 mr-2">
                        <button 
                          @click="exportToPDF"
                          :disabled="isGeneratingPDF"
                          class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                          title="Download Project Data Sheet PDF"
                        >
                           <svg v-if="!isGeneratingPDF" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                           <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                           <span>{{ isGeneratingPDF ? 'Generating...' : 'Download PDF' }}</span>
                        </button>
                     </div>
                     
                     <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                    <button
                      @click="$emit('close')"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div v-if="enquiry" class="flex-1 overflow-y-auto">
                <div class="px-6 py-6 space-y-6">

                  <!-- Executive Metrics -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Project Status</p>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <span class="w-2h-2 rounded-full mr-2" :class="getStatusColor(enquiry.status).split(' ')[0]"></span>
                        {{ getStatusLabel(enquiry.status || '') }}
                      </h3>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div class="flex justify-between items-end mb-1">
                        <p class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Overall Progress</p>
                        <span class="text-xs font-bold text-blue-700 dark:text-blue-300">{{ projectProgress }}%</span>
                      </div>
                      <div class="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" :style="{ width: `${projectProgress}%` }"></div>
                      </div>
                      <p class="text-xs text-blue-500 mt-2">{{ tasksMetrics.completed }} of {{ tasksMetrics.total }} tasks completed</p>
                    </div>
                    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                      <p class="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mb-1">Priority</p>
                      <div class="flex items-center">
                         <h3 class="text-lg font-bold text-gray-900 dark:text-white uppercase">{{ enquiry.priority || 'Normal' }}</h3>
                      </div>
                    </div>
                  </div>

                  <!-- Timeline Dashboard -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                     <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Project Schedule</h3>
                     <div class="flex flex-col md:flex-row justify-between text-sm">
                        <div class="mb-4 md:mb-0">
                          <p class="text-xs text-gray-500">Received</p>
                          <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(enquiry.date_received || enquiry.created_at || null) }}</p>
                        </div>
                        <div class="mb-4 md:mb-0">
                          <p class="text-xs text-gray-500">Expected Delivery</p>
                          <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(enquiry.expected_delivery_date || null) }}</p>
                        </div>
                        <div v-if="(enquiry as any).event_date" class="mb-4 md:mb-0">
                          <p class="text-xs text-gray-500">Event Date</p>
                          <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate((enquiry as any).event_date) }}</p>
                        </div>
                         <!-- Days Remaining -->
                        <div class="pl-4 border-l-4 border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 p-2 pr-4 rounded-r">
                           <p class="text-xs text-green-700 dark:text-green-300 font-bold uppercase">Time Remaining</p>
                           <p class="font-bold text-green-800 dark:text-green-200" v-html="calculateDaysRemaining(enquiry.expected_delivery_date || null)"></p>
                        </div>
                     </div>
                  </div>

                  <!-- Client & Project Details Grid -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Client Info -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                       <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Client Details</h3>
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                       </div>
                       <div class="p-4 space-y-3">
                          <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                             <span class="text-xs text-gray-500 uppercase">Client Name</span>
                             <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ (enquiry.client as any)?.full_name || (enquiry.client as any)?.name || 'Unknown' }}</span>
                          </div>
                          <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                             <span class="text-xs text-gray-500 uppercase">Contact Person</span>
                             <span class="text-sm text-gray-900 dark:text-white">{{ enquiry.contact_person || 'N/A' }}</span>
                          </div>
                           <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                             <span class="text-xs text-gray-500 uppercase">Phone</span>
                             <span class="text-sm text-gray-900 dark:text-white">{{ (enquiry.client as any)?.phone || (enquiry.client as any)?.PhoneNo || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between">
                             <span class="text-xs text-gray-500 uppercase">Email</span>
                             <span class="text-sm text-gray-900 dark:text-white">{{ (enquiry.client as any)?.email || (enquiry.client as any)?.Email || 'N/A' }}</span>
                          </div>
                       </div>
                    </div>

                    <!-- Project Info -->
                     <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                       <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Project Particulars</h3>
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                       </div>
                       <div class="p-4 space-y-3">
                          <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                             <span class="text-xs text-gray-500 uppercase">Title</span>
                             <span class="text-sm font-semibold text-gray-900 dark:text-white text-right">{{ enquiry.title }}</span>
                          </div>
                          <div v-if="enquiry.job_number" class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                             <span class="text-xs text-gray-500 uppercase">Job Number</span>
                             <span class="text-sm font-mono font-bold text-blue-600">{{ enquiry.job_number }}</span>
                          </div>
                           <div class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                             <span class="text-xs text-gray-500 uppercase">Venue</span>
                             <span class="text-sm text-gray-900 dark:text-white">{{ enquiry.venue || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between">
                             <span class="text-xs text-gray-500 uppercase">Project Officer</span>
                             <span class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.project_officer?.name || 'Unassigned' }}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <!-- Description & Scope -->
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                       <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">Description of works</h3>
                       <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/30 p-3 rounded border border-gray-100 dark:border-gray-700">
                         {{ enquiry.description || 'No description provided.' }}
                       </p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                       <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">Deliverables</h3>
                        <ul class="space-y-2 max-h-40 overflow-y-auto">
                          <li v-for="(item, i) in projectDeliverables" :key="i" class="text-sm flex items-start">
                             <svg class="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                             <span class="text-gray-700 dark:text-gray-300">{{ item }}</span>
                          </li>
                          <li v-if="projectDeliverables.length === 0" class="text-sm text-gray-400 italic">As per description</li>
                       </ul>
                    </div>
                  </div>

                  <!-- Tasks Table -->
                   <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                       <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                          <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Operational Tasks ({{ taskList.length }})</h3>
                          <router-link :to="`/projects/tasks?enquiry_id=${enquiry.id}`" class="text-xs font-semibold text-blue-600 hover:text-blue-800">View Board &rarr;</router-link>
                       </div>
                       <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                            </tr>
                          </thead>
                          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="task in taskList" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {{ task.title || task.type }}
                                <div class="text-xs text-gray-500 font-normal">{{ task.type }}</div>
                              </td>
                              <td class="px-4 py-3 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize" :class="getTaskStatusBadgeColor(task.status)">
                                  {{ task.status.replace('_', ' ') }}
                                </span>
                              </td>
                              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ (task as any).assigned_user?.name || (task as any).assignedUser?.name || 'Unassigned' }}
                              </td>
                              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(task.due_date || null) }}
                              </td>
                            </tr>
                             <tr v-if="taskList.length === 0">
                                <td colspan="4" class="px-4 py-4 text-center text-sm text-gray-500 italic">No tasks created yet.</td>
                             </tr>
                          </tbody>
                       </table>
                   </div>

                   <!-- Financials & Notes -->
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                         <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2">Financial Summary</h3>
                         <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded border bottom-gray-100 dark:border-gray-600">
                            <span class="text-sm text-gray-500 font-medium uppercase">Estimated Budget</span>
                            <span class="text-lg font-bold text-gray-900 dark:text-white">KES {{ enquiry.estimated_budget?.toLocaleString() || '0' }}</span>
                         </div>
                      </div>
                       <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden">
                          <div class="absolute top-0 right-0 w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                         <h3 class="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2 z-10 relative">Important Notes</h3>
                         <p class="text-sm text-gray-600 dark:text-gray-300 z-10 relative">{{ enquiry.follow_up_notes || 'No notes available.' }}</p>
                      </div>
                   </div>

                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectEnquiry, EnquiryTask } from '../types/enquiry'
import { useAuth } from '@/composables/useAuth'
import { useProjectPDF } from '../composables/useProjectPDF'

const props = defineProps<{
  show: boolean
  enquiry: ProjectEnquiry | null
}>()

const { user } = useAuth()
const { isGenerating: isGeneratingPDF, generateProjectPDF } = useProjectPDF()

const hasPrivilegedAccess = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Project Manager', 'Project Officer'].includes(role))
})

const emit = defineEmits<{
  close: []
  edit: [enquiry: ProjectEnquiry]

}>()

// Export to PDF function
const exportToPDF = async () => {
  if (!props.enquiry) return
  
  const result = await generateProjectPDF(props.enquiry)
  
  if (!result.success) {
    console.error('Failed to generate PDF')
    // You could add a toast notification here
  }
}

// Computed properties
const hasSurveyTask = computed(() => {
  return props.enquiry?.enquiryTasks?.some(t => t.type === 'Site Survey') || false
})

const hasQuote = computed(() => {
  return props.enquiry?.status && ['quote_prepared', 'quote_approved'].includes(props.enquiry.status)
})

// Parse project_scope into deliverables array
const projectDeliverables = computed<string[]>(() => {
  const scope = props.enquiry?.project_scope
  if (!scope) return []
  
  // If it's already an array, return it
  if (Array.isArray(scope)) {
    return scope.filter(item => item && item.trim())
  }
  
  // If it's a string, try to parse as JSON array
  if (typeof scope === 'string') {
    try {
      const parsed = JSON.parse(scope)
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.trim())
      }
    } catch {
      // Not valid JSON array - return empty so it falls back to string display
    }
  }
  
  return []
})


const taskList = computed<EnquiryTask[]>(() => {
  const enq = props.enquiry as any
  return enq?.enquiryTasks || enq?.tasks || []
})

const tasksMetrics = computed(() => {
  const tasks = taskList.value
  const total = tasks.length
  if (total === 0) return { total: 0, completed: 0, completionRate: 0, overdue: 0, inProgress: 0, pending: 0, highPriority: 0, unassigned: 0 }

  const completed = tasks.filter(t => t.status === 'completed').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const pending = tasks.filter(t => t.status === 'pending').length
  const highPriority = tasks.filter(t => ['high', 'urgent'].includes(t.priority || '')).length
  // Check both assigned_user_id and assigned_to object structure
  const unassigned = tasks.filter(t => !t.assigned_user_id && !t.assigned_to).length
  
  const overdue = tasks.filter(t => {
     if (!t.due_date) return false
     if (t.status === 'completed' || t.status === 'cancelled') return false
     return new Date(t.due_date) < new Date()
  }).length
  
  return {
    total,
    completed,
    completionRate: Math.round((completed / total) * 100),
    overdue,
    inProgress,
    pending,
    highPriority,
    unassigned
  }
})

const projectProgress = computed(() => {
  const status = props.enquiry?.status
  if (!status) return 0
  if (status === 'completed') return 100
  if (status === 'cancelled') return 0
  
  const weights: Record<string, number> = {
    'client_registered': 5,
    'enquiry_logged': 10,
    'site_survey_completed': 25,
    'design_completed': 40,
    'quote_prepared': 50,
    'quote_approved': 60, // Key Milestone: Deposit Paid / Approved
    'in_progress': 75     // Production / Execution Phase
  }
  
  return weights[status] || 0
})



// Helper functions
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'enquiry_logged': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'site_survey_completed': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    'design_completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'quote_prepared': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'quote_approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',

    'in_progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'completed': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Client Registered',
    'enquiry_logged': 'Enquiry Logged',
    'site_survey_completed': 'Site Survey Complete',
    'design_completed': 'Design Complete',
    'quote_prepared': 'Quote Prepared',
    'quote_approved': 'Quote Approved',

    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'high': 'bg-orange-100 text-orange-700',
    'urgent': 'bg-red-100 text-red-700'
  }
  return colors[priority] || 'bg-gray-100 text-gray-700'
}

const getTaskStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-400',
    'in_progress': 'bg-blue-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getTaskStatusBadgeColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatDateTime = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculateDaysRemaining = (dateStr: string | null | undefined) => {
  if (!dateStr) return '-'
  const target = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (isNaN(diff)) return '-'
  if (diff < 0) return `${Math.abs(diff)} days overdue`
  return `${diff} days left`
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: translateY(4px) scale(0.95);
}
</style>