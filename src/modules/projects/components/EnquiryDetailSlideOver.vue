<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 lg:p-8">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-[1600px] h-[95vh] flex flex-col relative z-20 border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in duration-200">
      
      <!-- Professional Header -->
      <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center space-x-4 min-w-0">
            <div class="min-w-0">
               <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {{ enquiry?.title || 'Project Detail' }}
                  </h2>
                  <span v-if="enquiry?.job_number" class="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800">
                    {{ enquiry.job_number }}
                  </span>
               </div>
               
               <div v-if="enquiry" class="flex items-center flex-wrap gap-3 text-sm">
                  <span class="text-gray-500 font-medium">{{ enquiry.enquiry_number }}</span>
                  <span class="text-gray-300 dark:text-gray-700">|</span>
                  <span :class="getStatusColor(enquiry.status)" class="px-2 py-0.5 rounded text-xs font-semibold">
                    {{ getStatusLabel(enquiry.status) }}
                  </span>
                  <span class="text-gray-300 dark:text-gray-700">|</span>
                  <span v-if="enquiry.priority" :class="getPriorityColor(enquiry.priority)" class="px-2 py-0.5 rounded text-xs font-semibold uppercase">
                    {{ enquiry.priority }}
                  </span>
               </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
             <button 
               @click="exportToPDF"
               :disabled="isGeneratingPDF"
               class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
             >
                <i v-if="!isGeneratingPDF" class="mdi mdi-download-outline text-lg"></i>
                <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{{ isGeneratingPDF ? 'Generating...' : 'Export PDF' }}</span>
             </button>
             
             <div class="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Information Core -->
      <div v-if="enquiry" class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-950">
        <div class="px-8 py-8 space-y-6">

          <!-- Key Performance Indicators -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Progress</div>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <div class="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" :style="{ width: `${projectProgress}%` }"></div>
                  </div>
                </div>
                <span class="text-lg font-bold text-gray-900 dark:text-white">{{ projectProgress }}%</span>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Task Milestone Status</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {{ tasksMetrics.completed }} / {{ tasksMetrics.total }} <span class="text-xs text-gray-500 font-medium ml-1">Completed</span>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Budget Estimate</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                <span class="text-xs text-gray-500 font-medium mr-1 font-mono">KES</span>{{ enquiry.estimated_budget?.toLocaleString() || '0' }}
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery Deadline</div>
              <div class="flex items-center justify-between">
                <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(enquiry.expected_delivery_date ?? null) }}</div>
                <span :class="calculateDaysRemaining(enquiry.expected_delivery_date ?? null).includes('overdue') ? 'text-red-500' : 'text-emerald-600'" class="text-[10px] font-bold uppercase">
                  {{ calculateDaysRemaining(enquiry.expected_delivery_date ?? null) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Project Information Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Stakeholder Info -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Stakeholder Information</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Client</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white text-right">{{ (enquiry.client as any)?.full_name || (enquiry.client as any)?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Contact Person</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">{{ enquiry.contact_person || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Phone</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">{{ (enquiry.client as any)?.phone || (enquiry.client as any)?.PhoneNo || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Email</span>
                  <span class="text-sm font-medium text-blue-600 dark:text-blue-400 text-right">{{ (enquiry.client as any)?.email || (enquiry.client as any)?.Email || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Deployment Details -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project Logistics</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Site / Venue</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white text-right">{{ enquiry.venue || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Project Lead</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white text-right">{{ enquiry.project_officer?.name || 'Unassigned' }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Record Created</span>
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">{{ formatDate(enquiry.created_at ?? null) }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-xs text-gray-500 font-medium uppercase">Expected Delivery</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white text-right">{{ formatDate(enquiry.expected_delivery_date ?? null) }}</span>
                </div>
              </div>
            </div>

            <!-- Project Scope / Deliverables -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-full">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project Deliverables</h3>
              </div>
              <div class="p-6">
                <ul class="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                  <li v-for="(item, i) in projectDeliverables" :key="i" class="text-sm flex items-start">
                    <span class="text-blue-500 font-bold mr-2">•</span>
                    <span class="text-gray-700 dark:text-gray-300">{{ item }}</span>
                  </li>
                  <li v-if="projectDeliverables.length === 0" class="text-xs text-gray-400 italic">
                    No individual deliverables specified in the project scope.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Project Description -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project Objectives & Description</h3>
            </div>
            <div class="p-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {{ enquiry.description || 'No detailed description provided for this project.' }}
              </p>
            </div>
          </div>

          <!-- Detailed Task Matrix -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Operational Task Board</h3>
              <router-link :to="`/projects/tasks?enquiry_id=${enquiry.id}`" class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All Tasks <i class="mdi mdi-arrow-right"></i>
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th class="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Task Name</th>
                    <th class="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th class="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th class="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-400">Assigned To</th>
                    <th class="px-6 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Due Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="task in taskList" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {{ task.title || task.type }}
                    </td>
                    <td class="px-6 py-4 text-center text-gray-500">{{ task.type }}</td>
                    <td class="px-6 py-4 text-center">
                      <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-tight" :class="getTaskStatusBadgeColor(task.status)">
                        {{ task.status.replace('_', ' ') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {{ ((task as any).assigned_user || (task as any).assignedUser)?.name || 'Unassigned' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div v-if="task.due_date" class="flex flex-col">
                        <span class="font-medium text-gray-900 dark:text-gray-200">{{ formatDate(task.due_date) }}</span>
                        <span class="text-[10px] font-semibold text-blue-500">{{ calculateDaysRemaining(task.due_date) }}</span>
                      </div>
                      <span v-else class="text-gray-400 text-xs">-</span>
                    </td>
                  </tr>
                  <tr v-if="taskList.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">
                      No active tasks found for this project.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bottom Section: Budget & Notes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
             <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Project Financial Reference</h4>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {{ enquiry.estimated_budget?.toLocaleString() || '0' }}
                  </span>
                  <span class="text-sm font-semibold text-gray-500 uppercase font-mono">KES</span>
                </div>
             </div>
             <div class="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 class="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-3">Internal Observations</h4>
                <p class="text-sm text-gray-700 dark:text-gray-300 italic">
                  {{ enquiry.follow_up_notes || 'No critical internal observations recorded.' }}
                </p>
             </div>
          </div>

        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-8 py-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm">
         <div class="text-gray-400 font-medium">
            System Record ID: {{ enquiry?.id }}
         </div>
         <div class="flex items-center gap-3">
            <button
               @click="$emit('close')"
               class="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
            >
               Close Document
            </button>
         </div>
      </div>
    </div>
  </div>
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