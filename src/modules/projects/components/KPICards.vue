<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <!-- Total Enquiries -->
    <div class="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
      <div class="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
      </div>
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between mb-8">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
            <i class="mdi mdi-account-group-outline text-2xl"></i>
          </div>
          <div class="text-right flex flex-col items-end gap-2">
            <div class="group/tooltip relative">
              <i class="mdi mdi-information-outline text-slate-300 hover:text-blue-500 cursor-help transition-colors"></i>
              <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                <div class="font-black uppercase tracking-widest mb-2 text-blue-400">Data Criteria</div>
                Total inquiries received since system inception. The trend indicates the net change in new enquiries compared to the previous month.
                <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-1" :class="getTrendClass(enquiryMetrics?.monthly_trend)">
              <i class="mdi" :class="[getTrendDirection(enquiryMetrics?.monthly_trend) === 'up' ? 'mdi-trending-up' : 'mdi-trending-down', 'text-lg']"></i>
              <span class="text-xs font-black uppercase tracking-widest">{{ getTrendValue(enquiryMetrics?.monthly_trend) }}</span>
            </div>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Enquiries</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ enquiryMetrics?.total_enquiries || 0 }}</h3>
            <span class="text-xs font-medium text-slate-400">Total Flux</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Projects -->
    <div class="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
      <div class="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
      </div>
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between mb-8">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
            <i class="mdi mdi-rocket-launch-outline text-2xl"></i>
          </div>
          <div class="text-right flex flex-col items-end gap-2">
            <div class="group/tooltip relative">
              <i class="mdi mdi-information-outline text-slate-300 hover:text-indigo-500 cursor-help transition-colors"></i>
              <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                <div class="font-black uppercase tracking-widest mb-2 text-indigo-400">Data Criteria</div>
                Number of projects currently in 'Planning' or 'In Progress' stages. The percentage represents the conversion of total enquiries into active missions.
                <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-1" :class="getProjectTrendClass(projectMetrics)">
              <i class="mdi mdi-chart-donut text-lg"></i>
              <span class="text-xs font-black uppercase tracking-widest">{{ getProjectTrendValue(projectMetrics) }}</span>
            </div>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Active Deployments</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ projectMetrics?.active_projects || 0 }}</h3>
            <span class="text-xs font-medium text-slate-400">Total Ops</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Completion -->
    <div class="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
      <div class="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
      </div>
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between mb-8">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
            <i class="mdi mdi-progress-check text-2xl"></i>
          </div>
          <div class="text-right flex flex-col items-end gap-2">
            <div class="group/tooltip relative">
              <i class="mdi mdi-information-outline text-slate-300 hover:text-emerald-500 cursor-help transition-colors"></i>
              <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                <div class="font-black uppercase tracking-widest mb-2 text-emerald-400">Data Criteria</div>
                Cumulative completion rate of all operational tasks across active projects. High efficiency reflects timely task sign-offs and goal attainment.
                <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-1" :class="getTaskTrendClass(taskMetrics)">
              <i class="mdi mdi-shield-check-outline text-lg"></i>
              <span class="text-xs font-black uppercase tracking-widest">{{ getTaskTrendValue(taskMetrics) }}</span>
            </div>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Execution Ratio</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ taskMetrics?.completion_rate || 0 }}<span class="text-2xl opacity-50">%</span></h3>
            <span class="text-xs font-medium text-slate-400">Efficiency</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Budget -->
    <div class="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
      <div class="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
      </div>
      <div class="relative z-10 flex flex-col h-full justify-between">
        <div class="flex items-center justify-between mb-8">
          <div class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
            <i class="mdi mdi-currency-usd text-2xl"></i>
          </div>
          <div class="text-right flex flex-col items-end gap-2">
            <div class="group/tooltip relative">
              <i class="mdi mdi-information-outline text-slate-300 hover:text-purple-500 cursor-help transition-colors"></i>
              <div class="absolute right-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
                <div class="font-black uppercase tracking-widest mb-2 text-purple-400">Data Criteria</div>
                Aggregated financial value of the project pipeline. Calculated as the sum of Approved Quotes and Estimated Budgets for early-stage enquiries.
                <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-1" :class="getBudgetTrendClass(projectMetrics)">
              <i class="mdi mdi-finance text-lg"></i>
              <span class="text-xs font-black uppercase tracking-widest">{{ getBudgetTrendValue(projectMetrics) }}</span>
            </div>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Capital Portfolio</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter"><span class="text-2xl opacity-50">{{ metadata?.currency?.symbol || 'Ksh' }}</span>{{ formatCurrency(projectMetrics?.total_budget || 0) }}</h3>
            <span class="text-xs font-medium text-slate-400">Project Value</span>
          </div>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  taskMetrics?: any
  metadata?: any
}

defineProps<Props>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendDirection = (trend: any[]) => {
  if (!trend || trend.length < 2) return 'neutral'
  const current = trend[trend.length - 1]?.count || 0
  const previous = trend[trend.length - 2]?.count || 0
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendClass = (trend: any[]) => {
  const direction = getTrendDirection(trend)
  const classes = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendIcon = (trend: any[]) => {
  const direction = getTrendDirection(trend)
  const icons = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendValue = (trend: any[]) => {
  if (!trend || trend.length === 0) return '0'
  const current = trend[trend.length - 1]?.count || 0
  const previous = trend.length > 1 ? trend[trend.length - 2]?.count || 0 : 0
  const diff = current - previous
  const sign = diff > 0 ? '+' : diff < 0 ? '-' : ''
  return `${sign}${Math.abs(diff)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTrendLabel = (trend: any[]) => {
  const direction = getTrendDirection(trend)
  const labels = {
    up: 'vs last month',
    down: 'vs last month',
    neutral: 'no change'
  }
  return labels[direction] || labels.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendDirection = (metrics: any) => {
  if (!metrics) return 'neutral'
  const active = metrics.active_projects || 0
  const total = metrics.total_projects || 1
  const percentage = (active / total) * 100
  if (percentage > 70) return 'up'
  if (percentage < 30) return 'down'
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendClass = (metrics: any) => {
  const direction = getProjectTrendDirection(metrics)
  const classes = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendIcon = (metrics: any) => {
  const direction = getProjectTrendDirection(metrics)
  const icons = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendValue = (metrics: any) => {
  if (!metrics) return '0%'
  const active = metrics.active_projects || 0
  const total = metrics.total_projects || 1
  return `${Math.round((active / total) * 100)}%`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProjectTrendLabel = (metrics: any) => {
  const direction = getProjectTrendDirection(metrics)
  const labels = {
    up: 'high activity',
    down: 'low activity',
    neutral: 'of total'
  }
  return labels[direction] || labels.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendDirection = (metrics: any) => {
  if (!metrics) return 'neutral'
  const overdue = metrics.overdue_tasks || 0
  const completion = metrics.completion_rate || 0
  if (overdue > 5) return 'up' // high overdue = bad
  if (completion > 80) return 'down' // high completion = good
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendClass = (metrics: any) => {
  const direction = getTaskTrendDirection(metrics)
  const classes = {
    up: 'text-red-600 dark:text-red-400',
    down: 'text-green-600 dark:text-green-400',
    neutral: 'text-yellow-600 dark:text-yellow-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendIcon = (metrics: any) => {
  const direction = getTaskTrendDirection(metrics)
  const icons = {
    up: 'text-red-600 dark:text-red-400',
    down: 'text-green-600 dark:text-green-400',
    neutral: 'text-yellow-600 dark:text-yellow-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendValue = (metrics: any) => {
  if (!metrics) return '0%'
  return `${metrics.completion_rate || 0}%`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTaskTrendLabel = (metrics: any) => {
  const direction = getTaskTrendDirection(metrics)
  const labels = {
    up: 'needs attention',
    down: 'on track',
    neutral: 'completion rate'
  }
  return labels[direction] || labels.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendDirection = (metrics: any) => {
  if (!metrics) return 'neutral'
  const avgBudget = (metrics.total_budget || 0) / (metrics.total_projects || 1)
  if (avgBudget > 50000) return 'up' // high budget
  if (avgBudget < 10000) return 'down' // low budget
  return 'neutral'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendClass = (metrics: any) => {
  const direction = getBudgetTrendDirection(metrics)
  const classes = {
    up: 'text-purple-600 dark:text-purple-400',
    down: 'text-blue-600 dark:text-blue-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return classes[direction] || classes.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendIcon = (metrics: any) => {
  const direction = getBudgetTrendDirection(metrics)
  const icons = {
    up: 'text-purple-600 dark:text-purple-400',
    down: 'text-blue-600 dark:text-blue-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }
  return icons[direction] || icons.neutral
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendValue = (metrics: any) => {
  if (!metrics) return 'Ksh0'
  const avgBudget = (metrics.total_budget || 0) / (metrics.total_projects || 1)
  return formatCurrency(avgBudget)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBudgetTrendLabel = (metrics: any) => {
  const direction = getBudgetTrendDirection(metrics)
  const labels = {
    up: 'high value',
    down: 'budget friendly',
    neutral: 'avg per project'
  }
  return labels[direction] || labels.neutral
}
</script>
