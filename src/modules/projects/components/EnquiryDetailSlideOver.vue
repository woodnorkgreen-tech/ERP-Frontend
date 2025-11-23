<template>
  <transition name="slide-over">
    <div v-if="show" class="fixed inset-0 overflow-hidden z-50">
      <!-- Background overlay -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          @click="$emit('close')"
          class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        ></div>

        <!-- Slide-over panel -->
        <div class="fixed inset-y-0 right-0 max-w-full flex">
          <div class="w-screen max-w-6xl">
            <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
              <!-- Header -->
              <div class="px-6 py-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h2 class="text-2xl font-bold text-white">
                          {{ enquiry?.title || 'Loading...' }}
                        </h2>
                        <p class="text-sm text-blue-100 mt-1">
                          {{ enquiry?.enquiry_number || 'No number assigned' }}
                        </p>
                      </div>
                    </div>

                    <!-- Status and Priority badges -->
                    <div v-if="enquiry" class="flex items-center space-x-2 mt-4">
                      <span :class="getStatusColor(enquiry.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                        {{ getStatusLabel(enquiry.status) }}
                      </span>
                      <span v-if="enquiry.priority" :class="getPriorityColor(enquiry.priority)" class="px-3 py-1 rounded-full text-xs font-semibold">
                        {{ enquiry.priority?.toUpperCase() }}
                      </span>
                      <span v-if="enquiry.job_number" class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {{ enquiry.job_number }}
                      </span>
                    </div>
                  </div>

                  <!-- Close button -->
                  <button
                    @click="$emit('close')"
                    class="ml-3 text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Quick action buttons -->
                <div v-if="enquiry" class="flex flex-wrap gap-2 mt-4">
                  <button class="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email Client</span>
                  </button>
                  <button class="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Client</span>
                  </button>
                  <button v-if="hasPrivilegedAccess" @click="$emit('edit', enquiry)" class="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div v-if="enquiry" class="flex-1 overflow-y-auto">
                <div class="px-6 py-6 space-y-6">

                  <!-- Client Information Card -->
                  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0 zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Client Information
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client Name</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {{ enquiry.client?.full_name || enquiry.client?.FullName || 'Unknown Client' }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Person</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">{{ enquiry.contact_person || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {{ enquiry.client?.PhoneNo || enquiry.client?.phone || 'N/A' }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {{ enquiry.client?.Email || enquiry.client?.email || 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Project Request Details Card -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Project Request Details
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Description</p>
                        <p class="text-sm text-gray-900 dark:text-white mt-1">{{ enquiry.description || 'No description provided' }}</p>
                      </div>
                      <div v-if="enquiry.project_scope">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Scope</p>
                        <p class="text-sm text-gray-900 dark:text-white mt-1">{{ enquiry.project_scope }}</p>
                      </div>
                      <div class="grid grid-cols-3 gap-4">
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date Received</p>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            {{ formatDate(enquiry.date_received || enquiry.created_at) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Expected Delivery</p>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            {{ enquiry.expected_delivery_date ? formatDate(enquiry.expected_delivery_date) : 'Not set' }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Officer</p>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            {{ enquiry.project_officer?.name || 'Not assigned' }}
                          </p>
                        </div>
                      </div>
                      <div v-if="enquiry.venue">
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Venue</p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">{{ enquiry.venue }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Conversion Status Card -->
                  <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-5 border border-blue-200 dark:border-gray-500">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Project Conversion Status
                    </h3>

                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            <div :class="enquiry.status ? 'bg-green-500' : 'bg-gray-300'" class="h-8 w-8 rounded-full flex items-center justify-center">
                              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Enquiry Received</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(enquiry.created_at) }}</p>
                          </div>
                        </div>
                        <span class="text-xs font-semibold text-green-600 dark:text-green-400">✓ Complete</span>
                      </div>

                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            <div :class="hasSurveyTask ? 'bg-green-500' : 'bg-gray-300'" class="h-8 w-8 rounded-full flex items-center justify-center">
                              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Survey Task</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Site survey conducted</p>
                          </div>
                        </div>
                        <span :class="hasSurveyTask ? 'text-green-600 dark:text-green-400' : 'text-gray-400'" class="text-xs font-semibold">
                          {{ hasSurveyTask ? '✓ Created' : '○ Pending' }}
                        </span>
                      </div>

                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            <div :class="hasQuote ? 'bg-green-500' : 'bg-gray-300'" class="h-8 w-8 rounded-full flex items-center justify-center">
                              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Quote Generated</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Pricing approved by client</p>
                          </div>
                        </div>
                        <span :class="hasQuote ? 'text-green-600 dark:text-green-400' : 'text-gray-400'" class="text-xs font-semibold">
                          {{ hasQuote ? '✓ Yes' : '○ No' }}
                        </span>
                      </div>

                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="flex-shrink-0">
                            <div :class="isConverted ? 'bg-green-500' : 'bg-gray-300'" class="h-8 w-8 rounded-full flex items-center justify-center">
                              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">Project Created</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">{{ enquiry.job_number || 'Not converted yet' }}</p>
                          </div>
                        </div>
                        <span :class="isConverted ? 'text-green-600 dark:text-green-400' : 'text-gray-400'" class="text-xs font-semibold">
                          {{ isConverted ? '✓ Converted' : '○ Pending' }}
                        </span>
                      </div>

                      <button
                        v-if="!isConverted && canConvert"
                        @click="$emit('convert', enquiry.id)"
                        class="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Convert to Project Now
                      </button>
                    </div>
                  </div>

                  <!-- Related Tasks Timeline -->
                  <div v-if="enquiry.tasks && enquiry.tasks.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Associated Tasks ({{ enquiry.tasks.length }})
                    </h3>
                    <div class="space-y-3">
                      <div v-for="task in enquiry.tasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-5 dark:bg-gray-700 rounded-lg">
                        <div class="flex items-center space-x-3">
                          <div :class="getTaskStatusColor(task.status)" class="w-3 h-3 rounded-full"></div>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ task.task_type }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Assigned to: {{ task.assigned_user?.name || 'Unassigned' }}</p>
                          </div>
                        </div>
                        <span :class="getTaskStatusBadgeColor(task.status)" class="px-2 py-1 rounded text-xs font-semibold">
                          {{ task.status }}
                        </span>
                      </div>
                    </div>
                    <router-link
                      :to="`/projects/tasks?enquiry_id=${enquiry.id}`"
                      class="block mt-4 text-center px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-blue-400 rounded-lg font-medium transition-colors"
                    >
                      View All Tasks →
                    </router-link>
                  </div>

                  <!-- Activity History -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Activity History
                    </h3>
                    <div class="space-y-3">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                        <div>
                          <p class="text-sm text-gray-900 dark:text-white">Enquiry created</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(enquiry.created_at) }}</p>
                        </div>
                      </div>
                      <div v-if="enquiry.updated_at !== enquiry.created_at" class="flex items-start space-x-3">
                        <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                        <div>
                          <p class="text-sm text-gray-900 dark:text-white">Last updated</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(enquiry.updated_at) }}</p>
                        </div>
                      </div>
                      <div v-if="enquiry.follow_up_notes" class="flex items-start space-x-3">
                        <div class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                        <div>
                          <p class="text-sm text-gray-900 dark:text-white">Follow-up notes</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ enquiry.follow_up_notes }}</p>
                        </div>
                      </div>
                    </div>
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
import type { ProjectEnquiry } from '../types/enquiry'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{
  show: boolean
  enquiry: ProjectEnquiry | null
}>()

const { user } = useAuth()

const hasPrivilegedAccess = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Project Manager', 'Project Officer'].includes(role))
})

const emit = defineEmits<{
  close: []
  edit: [enquiry: ProjectEnquiry]
  convert: [id: number]
}>()

// Computed properties
const hasSurveyTask = computed(() => {
  return props.enquiry?.tasks?.some(t => t.task_type === 'Site Survey') || false
})

const hasQuote = computed(() => {
  return props.enquiry?.status && ['quote_prepared', 'quote_approved', 'converted_to_project'].includes(props.enquiry.status)
})

const isConverted = computed(() => {
  return props.enquiry?.status === 'converted_to_project' || !!props.enquiry?.job_number
})

const canConvert = computed(() => {
  return props.enquiry?.status === 'quote_approved'
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
    'converted_to_project': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
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
    'converted_to_project': 'Converted to Project',
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
</script>

<style scoped>
.slide-over-enter-active,
.slide-over-leave-active {
  transition: all 0.3s ease;
}

.slide-over-enter-from,
.slide-over-leave-to {
  opacity: 0;
}

.slide-over-enter-from .fixed.inset-y-0,
.slide-over-leave-to .fixed.inset-y-0 {
  transform: translateX(100%);
}

.fixed.inset-y-0 {
  transition: transform 0.3s ease;
}
</style>
