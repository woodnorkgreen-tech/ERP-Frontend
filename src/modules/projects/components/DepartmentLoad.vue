<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Department Workload</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active project distribution across departments</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Light</span>
            <div class="w-2 h-2 bg-yellow-500 rounded-full ml-2"></div>
            <span>Moderate</span>
            <div class="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
            <span>Heavy</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading department data...</p>
    </div>

    <!-- Department List -->
    <div v-else-if="departmentLoads.length > 0" class="p-6">
      <div class="space-y-4">
        <div
          v-for="dept in departmentLoads"
          :key="dept.name"
          class="group relative"
        >
          <!-- Department Header -->
          <div 
            class="flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer"
            :class="[
              getDepartmentBorderClass(dept),
              'hover:shadow-md'
            ]"
            @click="toggleDepartment(dept.name)"
          >
            <div class="flex items-center space-x-4 flex-1">
              <!-- Load Indicator -->
              <div class="flex-shrink-0">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                  :class="getLoadIndicatorClass(dept.loadPercentage)"
                >
                  {{ dept.activeEnquiries }}
                </div>
              </div>

              <!-- Department Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ dept.name }}
                  </h4>
                  <span 
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="getLoadBadgeClass(dept.loadPercentage)"
                  >
                    {{ getLoadLabel(dept.loadPercentage) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ dept.activeEnquiries }} active {{ dept.activeEnquiries === 1 ? 'project' : 'projects' }}  • 
                  {{ dept.pendingTasks }} pending {{ dept.pendingTasks === 1 ? 'task' : 'tasks' }}
                </p>
              </div>

              <!-- Load Percentage & Progress -->
              <div class="flex-shrink-0 w-48 hidden lg:block">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Capacity</span>
                  <span class="text-xs font-bold text-gray-900 dark:text-white">{{ dept.loadPercentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="getProgressBarClass(dept.loadPercentage)"
                    :style="{ width: Math.min(dept.loadPercentage, 100) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Expand Icon -->
              <div class="flex-shrink-0">
                <svg 
                  class="w-5 h-5 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': expandedDepartments.includes(dept.name) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Expanded Project List -->
          <transition name="expand">
            <div 
              v-if="expandedDepartments.includes(dept.name)" 
              class="mt-3 ml-16 mr-4 space-y-2"
            >
              <div 
                v-for="enquiry in dept.enquiries"
                :key="enquiry.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ enquiry.title }}
                    </h5>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      #{{ enquiry.enquiry_number }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-3 mt-1">
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getStatusClass(enquiry.status)"
                    >
                      {{ getStatusLabel(enquiry.status) }}
                    </span>
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getPriorityClass(enquiry.priority)"
                    >
                      {{ enquiry.priority }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ enquiry.assigned_tasks || 0 }} tasks
                    </span>
                  </div>
                </div>
                <router-link
                  :to="`/projects/enquiries/${enquiry.id}`"
                  class="ml-3 flex-shrink-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </router-link>
              </div>

              <!-- No Projects Message -->
              <div v-if="dept.enquiries.length === 0" class="p-4 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">No active projects in this department</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <p class="text-gray-500 dark:text-gray-400 font-medium">No department data available</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Start by creating some enquiries</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'

interface Props {
  loading?: boolean
}

interface Enquiry {
  id: number
  title: string
  enquiry_number: string
  status: string
  priority: string
  assigned_tasks?: number
}

interface DepartmentLoad {
  name: string
  activeEnquiries: number
  pendingTasks: number
  loadPercentage: number
  enquiries: Enquiry[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const departmentLoads = ref<DepartmentLoad[]>([])
const expandedDepartments = ref<string[]>([])
const isLoading = ref(true)

const departments = [
  'Client Service',
  'Design/Creatives',
  'Procurement',
  'Accounts/Finance',
  'Costing',
  'Production',
  'Logistics',
  'Stores',
  'Projects',
  'Teams'
]

const fetchDepartmentLoads = async () => {
  isLoading.value = true
  try {
    // Fetch active enquiries
    const response = await api.get('/api/projects/enquiries', {
      params: {
        status: 'active', // or filter for relevant statuses
        per_page: 1000
      }
    })

    const enquiries = response.data.data || []

    // Group enquiries by department
    const departmentMap = new Map<string, DepartmentLoad>()

    // Initialize all departments
    departments.forEach(dept => {
      departmentMap.set(dept, {
        name: dept,
        activeEnquiries: 0,
        pendingTasks: 0,
        loadPercentage: 0,
        enquiries: []
      })
    })

    // Process enquiries
    enquiries.forEach((enquiry: any) => {
      // Get department from assigned_department or derive from status
      const deptName = enquiry.assigned_department || getDepartmentFromStatus(enquiry.status)
      
      if (deptName && departmentMap.has(deptName)) {
        const dept = departmentMap.get(deptName)!
        dept.activeEnquiries++
        dept.enquiries.push({
          id: enquiry.id,
          title: enquiry.title,
          enquiry_number: enquiry.enquiry_number,
          status: enquiry.status,
          priority: enquiry.priority,
          assigned_tasks: enquiry.enquiry_tasks?.length || 0
        })

        // Count pending tasks
        if (enquiry.enquiry_tasks) {
          dept.pendingTasks += enquiry.enquiry_tasks.filter((t: any) => t.status === 'pending' || t.status === 'in_progress').length
        }
      }
    })

    // Calculate load percentages (assuming max 20 projects per department is 100%)
    const maxProjects = 20
    departmentMap.forEach(dept => {
      dept.loadPercentage = Math.min(Math.round((dept.activeEnquiries / maxProjects) * 100), 100)
    })

    // Convert to array and sort by load
    departmentLoads.value = Array.from(departmentMap.values())
      .sort((a, b) => b.activeEnquiries - a.activeEnquiries)

  } catch (error) {
    console.error('Error fetching department loads:', error)
  } finally {
    isLoading.value = false
  }
}

const getDepartmentFromStatus = (status: string): string => {
  const mapping: Record<string, string> = {
    'client_registered': 'Client Service',
    'enquiry_logged': 'Client Service',
    'site_survey_completed': 'Client Service',
    'design_completed': 'Design/Creatives',
    'design_approved': 'Design/Creatives',
    'materials_specified': 'Procurement',
    'budget_created': 'Accounts/Finance',
    'quote_prepared': 'Costing',
    'quote_approved': 'Costing',
    'planning': 'Projects',
    'in_progress': 'Production'
  }
  return mapping[status] || 'Projects'
}

const toggleDepartment = (deptName: string) => {
  const index = expandedDepartments.value.indexOf(deptName)
  if (index > -1) {
    expandedDepartments.value.splice(index, 1)
  } else {
    expandedDepartments.value.push(deptName)
  }
}

const getLoadIndicatorClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (percentage >= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
}

const getDepartmentBorderClass = (dept: DepartmentLoad) => {
  if (dept.loadPercentage >= 80) return 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
  if (dept.loadPercentage >= 50) return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10'
  return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
}

const getLoadBadgeClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (percentage >= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
}

const getLoadLabel = (percentage: number) => {
  if (percentage >= 80) return 'Heavy Load'
  if (percentage >= 50) return 'Moderate Load'
  return 'Light Load'
}

const getProgressBarClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-red-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'client_registered': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    'enquiry_logged': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'site_survey_completed': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'design_completed': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'design_approved': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'materials_specified': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'budget_created': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'quote_prepared': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    'quote_approved': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'planning': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'in_progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Registered',
    'enquiry_logged': 'Logged',
    'site_survey_completed': 'Survey Done',
    'design_completed': 'Design Done',
    'design_approved': 'Design OK',
    'materials_specified': 'Materials',
    'budget_created': 'Budgeted',
    'quote_prepared': 'Quoted',
    'quote_approved': 'Quote OK',
    'planning': 'Planning',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    'low': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'high': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'urgent': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[priority] || 'bg-gray-100 text-gray-700'
}

onMounted(() => {
  fetchDepartmentLoads()
})

defineExpose({
  refresh: fetchDepartmentLoads
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
