<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Enquiry Status Breakdown -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Enquiry Status</h3>
          <div class="group/tooltip relative">
            <i class="mdi mdi-information-outline text-slate-300 hover:text-blue-500 cursor-help transition-colors"></i>
            <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
              <div class="font-black uppercase tracking-widest mb-2 text-blue-400">Data Criteria</div>
              Analyzes the current distribution of all open enquiries across the operational lifecycle (from initial logging to final quote approval).
              <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>
      <div class="space-y-3">
        <div v-for="(count, status) in enquiryMetrics?.status_breakdown" :key="status"
             class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :class="getStatusColor(String(status))"></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getStatusLabel(String(status)) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ count }}</span>
            <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
              <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                   :style="{ width: getStatusPercentage(String(status), Number(count)) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Phase Progress -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Phases</h3>
          <div class="group/tooltip relative">
            <i class="mdi mdi-information-outline text-slate-300 hover:text-green-500 cursor-help transition-colors"></i>
            <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
              <div class="font-black uppercase tracking-widest mb-2 text-green-400">Data Criteria</div>
              Tracks the aggregate progress of active project phases based on task completion ratios and milestone sign-offs.
              <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-xs text-gray-500 dark:text-gray-400">Progress</span>
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="phase in projectMetrics?.phase_progress" :key="phase.name"
             class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ phase.name }}</span>
            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ phase.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                 :style="{ width: phase.progress + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{{ phase.completed }}/{{ phase.total }} completed</span>
            <span>{{ phase.total - phase.completed }} remaining</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversion Analytics -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Conversion Analytics</h3>
            <div class="group/tooltip relative">
              <i class="mdi mdi-information-outline text-slate-300 hover:text-indigo-500 cursor-help transition-colors"></i>
              <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                <div class="font-black uppercase tracking-widest mb-2 text-indigo-400">Conversion Logic</div>
                Measures the ratio of initial enquiries successfully converted into formal projects (assigned WNG job numbers). 
                <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
              </div>
            </div>
          </div>
          <span class="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wider">Funnel Activity</span>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conversion Rate</p>
              <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ enquiryMetrics?.conversion_rate || 0 }}%</h4>
            </div>
            <div class="w-16 h-16 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center">
              <span class="text-sm font-black text-indigo-500">{{ enquiryMetrics?.conversion_rate || 0 }}%</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <p class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Converted</p>
              <p class="text-xl font-black text-blue-900 dark:text-blue-100">{{ enquiryMetrics?.converted_to_project || 0 }}</p>
              <p class="text-[9px] text-blue-500/70">WNG Signed</p>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">In Enquiry</p>
              <p class="text-xl font-black text-slate-900 dark:text-slate-100">{{ enquiryMetrics?.remaining_enquiries || 0 }}</p>
              <p class="text-[9px] text-slate-400/70">Pipeline</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-semibold text-gray-500">Funnel Saturation</span>
          <span class="text-xs font-bold text-indigo-500">{{ enquiryMetrics?.conversion_rate || 0 }}%</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" :style="{ width: (enquiryMetrics?.conversion_rate || 0) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
 
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enquiryMetrics?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectMetrics?: any
  metadata?: any
}

const props = defineProps<Props>()

const getStatusLabel = (status: string) => {
  if (props.metadata?.status_labels?.[status]) {
    return props.metadata.status_labels[status]
  }
  const labels: Record<string, string> = {
    'client_registered': 'Client Registered',
    'enquiry_logged': 'Enquiry Logged',
    'site_survey_completed': 'Site Survey Done',
    'design_completed': 'Design Completed',
    'design_approved': 'Design Approved',
    'materials_specified': 'Materials Specified',
    'budget_created': 'Budget Created',
    'quote_prepared': 'Quote Prepared',
    'quote_approved': 'Quote Approved',

    'planning': 'Planning',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-gray-400',
    'enquiry_logged': 'bg-blue-400',
    'site_survey_completed': 'bg-yellow-400',
    'design_completed': 'bg-purple-400',
    'design_approved': 'bg-indigo-400',
    'materials_specified': 'bg-pink-400',
    'budget_created': 'bg-green-400',
    'quote_prepared': 'bg-teal-400',
    'quote_approved': 'bg-cyan-400',

    'planning': 'bg-orange-400',
    'in_progress': 'bg-blue-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-400'
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusPercentage = (status: string, count: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = Object.values(props.enquiryMetrics?.status_breakdown || {}).reduce((sum: number, c: any) => sum + Number(c), 0)
  return total > 0 ? Math.round((count / total) * 100) : 0
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-green-400',
    'medium': 'bg-yellow-400',
    'high': 'bg-orange-400',
    'urgent': 'bg-red-400'
  }
  return colors[priority] || 'bg-gray-400'
}

const getPriorityBarColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'high': 'bg-orange-500',
    'urgent': 'bg-red-500'
  }
  return colors[priority] || 'bg-gray-500'
}

const getPriorityPercentage = (priority: string, count: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = Object.values(props.enquiryMetrics?.priority_distribution || {}).reduce((sum: number, c: any) => sum + Number(c), 0)
  return total > 0 ? Math.round((count / total) * 100) : 0
}
</script>
