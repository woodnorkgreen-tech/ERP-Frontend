<template>
  <div class="space-y-8 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Sector Load</h3>
        <div class="group/tooltip relative">
          <i class="mdi mdi-information-outline text-slate-300 hover:text-indigo-500 cursor-help transition-colors"></i>
          <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
            <div class="font-black uppercase tracking-widest mb-2 text-indigo-400">Data Criteria</div>
            Calculates operational pressure per department by analyzing the ratio of 'Active Units' to the 'Nominal Capacity' (default 15). Includes all pending and in-progress tasks.
            <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nominal</span>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Critical</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
      <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Sectors...</p>
    </div>

    <!-- Department List -->
    <div v-else-if="departmentLoads.length > 0" class="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        <div
          v-for="dept in departmentLoads"
          :key="dept.name"
          class="group relative"
        >
          <!-- Department Header -->
          <div 
            class="p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden relative"
            :class="[
              getDepartmentStyles(dept),
              'hover:shadow-xl'
            ]"
            @click="toggleDepartment(dept.name)"
          >
            <!-- Background Glow -->
            <div class="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-10 transition-colors duration-500" :class="getLoadGlowClass(dept.loadPercentage)"></div>

            <div class="relative z-10 flex items-center justify-between">
              <div class="flex items-center gap-6 flex-1">
                <!-- Load Indicator -->
                <div class="flex-shrink-0">
                    <div class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 bg-white dark:bg-slate-800 border group-hover:scale-110"
                         :class="getLoadIndicatorClass(dept.loadPercentage)">
                        <span class="text-xl font-black">{{ dept.activeEnquiries }}</span>
                        <span class="text-[8px] font-black uppercase tracking-tighter opacity-70">Units</span>
                    </div>
                </div>

                <!-- Department Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {{ dept.name }}
                    </h4>
                    <span 
                      class="px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border transition-colors"
                      :class="getLoadBadgeClass(dept.loadPercentage)"
                    >
                      {{ getLoadLabel(dept.loadPercentage) }}
                    </span>
                  </div>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                    {{ dept.pendingTasks }} Operational Tasks Pending
                  </p>
                </div>

                <!-- Load Percentage & Progress -->
                <div class="flex-shrink-0 w-48 hidden xl:block">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Capacity Flow</span>
                    <span class="text-[10px] font-black text-slate-900 dark:text-white">{{ dept.loadPercentage }}%</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-1000 group-hover:scale-x-105 origin-left"
                      :class="getProgressBarClass(dept.loadPercentage)"
                      :style="{ width: Math.min(dept.loadPercentage, 100) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Expand Icon -->
                <div class="flex-shrink-0 ml-4">
                  <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-500"
                       :class="{ 'rotate-180 bg-blue-500 text-white': expandedDepartments.includes(dept.name) }">
                    <i class="mdi mdi-chevron-down text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Expanded Project List -->
          <transition name="expand">
            <div 
              v-if="expandedDepartments.includes(dept.name)" 
              class="mt-4 ml-8 space-y-3"
            >
              <div 
                v-for="enquiry in dept.enquiries"
                :key="enquiry.id"
                class="group/item relative flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all duration-300"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <h5 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider truncate">
                      {{ enquiry.title }}
                    </h5>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      SIG-{{ enquiry.enquiry_number }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4 mt-2">
                    <span 
                      class="text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border"
                      :class="getStatusClass(enquiry.status)"
                    >
                      {{ getStatusLabel(enquiry.status) }}
                    </span>
                    <span 
                      class="text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border"
                      :class="getPriorityClass(enquiry.priority)"
                    >
                      {{ enquiry.priority }}
                    </span>
                    <div class="flex items-center gap-1">
                        <i class="mdi mdi-format-list-checks text-blue-500 text-xs"></i>
                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          {{ enquiry.assigned_tasks || 0 }} Operations
                        </span>
                    </div>
                  </div>
                </div>
                <router-link
                  :to="`/projects/enquiries/${enquiry.id}`"
                  class="ml-4 w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all active:scale-90 shadow-sm"
                >
                  <i class="mdi mdi-arrow-right text-xl"></i>
                </router-link>
              </div>

              <!-- No Projects Message -->
              <div v-if="dept.enquiries.length === 0" class="py-10 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Missions in Sector</p>
              </div>
            </div>
          </transition>
        </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
      <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6">
        <i class="mdi mdi-database-off-outline text-4xl"></i>
      </div>
      <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Intelligence Void</p>
      <p class="text-xs text-slate-500 font-medium mt-1">Initialize sensor arrays by logging new enquiries.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'

interface Props {
  loading?: boolean
  commandCenterData?: any
  metadata?: any
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
  loading: false,
  commandCenterData: null,
  metadata: null
})

const departmentLoads = ref<DepartmentLoad[]>([])
const expandedDepartments = ref<string[]>([])
const isLoading = ref(true)

const departments = computed(() => {
  if (props.commandCenterData?.department_pulse) {
    return props.commandCenterData.department_pulse.map((d: any) => d.name)
  }
  return [
    'Client Service',
    'Design/Creatives',
    'Procurement',
    'Accounts/Finance',
    'Costing',
    'Production',
    'Logistics',
    'Stores',
    'Projects'
  ]
})

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

    const resData = response.data.data
    const enquiries = Array.isArray(resData) ? resData : (resData?.data || [])

    // Group enquiries by department
    const departmentMap = new Map<string, DepartmentLoad>()

    // Initialize all departments
    departments.value.forEach((dept: string) => {
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

    // Calculate load percentages
    const workloadThreshold = props.metadata?.thresholds?.workload || 20
    departmentMap.forEach(dept => {
      dept.loadPercentage = Math.min(Math.round((dept.activeEnquiries / workloadThreshold) * 100), 100)
    })

    // Convert to array and sort by load
    departmentLoads.value = Array.from(departmentMap.values())
      .sort((a, b) => b.loadPercentage - a.loadPercentage)

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

const getDepartmentStyles = (dept: DepartmentLoad) => {
  if (dept.loadPercentage >= 80) return 'border-red-500/20 bg-red-50/30 dark:bg-red-900/10'
  if (dept.loadPercentage >= 50) return 'border-yellow-500/20 bg-yellow-50/30 dark:bg-yellow-900/10'
  return 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
}

const getLoadGlowClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-red-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-blue-500'
}

const getLoadIndicatorClass = (percentage: number) => {
  if (percentage >= 80) return 'border-red-500/50 text-red-500'
  if (percentage >= 50) return 'border-yellow-500/50 text-yellow-500'
  return 'border-blue-500/50 text-blue-500'
}

const getLoadBadgeClass = (percentage: number) => {
  if (percentage >= 80) return 'border-red-500/20 text-red-600 bg-red-500/5'
  if (percentage >= 50) return 'border-yellow-500/20 text-yellow-600 bg-yellow-500/5'
  return 'border-emerald-500/20 text-emerald-600 bg-emerald-500/5'
}

const getLoadLabel = (percentage: number) => {
  if (percentage >= 80) return 'Critical Load'
  if (percentage >= 50) return 'Moderate Load'
  return 'Nominal Flow'
}

const getProgressBarClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-gradient-to-r from-red-400 to-red-600'
  if (percentage >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  return 'bg-gradient-to-r from-blue-400 to-blue-600'
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
  if (props.metadata?.status_labels?.[status]) {
    return props.metadata.status_labels[status]
  }
  // Fallback for safety
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
