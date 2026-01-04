<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-red-500 rounded-full"></div>
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Critical Intel</h3>
        <div class="group/tooltip relative">
          <i class="mdi mdi-information-outline text-slate-300 hover:text-red-500 cursor-help transition-colors"></i>
          <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
            <div class="font-black uppercase tracking-widest mb-2 text-red-400">Data Criteria</div>
            Scans the entire ecosystem for anomalies including overdue milestones, high-risk delays, and unassigned critical roles. Signals are prioritized by impact severity.
            <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ alerts?.length || 0 }} Active Signatures</span>
      </div>
    </div>

    <div v-if="!alerts?.length" class="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
      <div class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500">
        <i class="mdi mdi-shield-check text-4xl"></i>
      </div>
      <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Global Sector Clear</p>
      <p class="text-xs text-slate-500 font-medium mt-1">No anomalies detected in the ecosystem.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="alert in alerts" :key="alert.id || alert.type"
           class="group relative overflow-hidden p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-500"
           :class="getAlertBorderStyles(alert.severity)">
        
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-start justify-between mb-6">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 group-hover:scale-110"
                 :class="getAlertIconColor(alert.severity)">
              <i class="mdi text-2xl" :class="getAlertIcon(alert.severity)"></i>
            </div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {{ formatDate(alert.timestamp || new Date().toISOString()) }}
            </span>
          </div>

          <div class="flex-1">
             <h4 class="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-blue-500 transition-colors">{{ alert.title }}</h4>
             <p class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{{ alert.message }}</p>
          </div>

          <div v-if="alert.action" class="mt-8">
            <button class="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 border"
                    :class="getActionButtonStyles(alert.severity)">
              {{ alert.action }}
            </button>
          </div>
        </div>
        
        <div class="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-10" :class="getAlertIconBg(alert.severity)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
 
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alerts?: any[]
}

defineProps<Props>()

const getAlertIcon = (severity: string) => {
  const icons: Record<string, string> = {
    'high': 'mdi-alert-octagon',
    'medium': 'mdi-alert',
    'low': 'mdi-information',
    'info': 'mdi-text-box-outline'
  }
  return icons[severity] || icons.info
}

const getAlertBorderStyles = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'border-red-500/20 bg-red-50/50 dark:bg-red-900/10',
    'medium': 'border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-900/10',
    'low': 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10',
    'info': 'border-slate-500/20 bg-slate-50/50 dark:bg-slate-900/10'
  }
  return styles[severity] || styles.info
}

const getAlertIconBg = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'bg-red-500',
    'medium': 'bg-yellow-500',
    'low': 'bg-blue-500',
    'info': 'bg-slate-500'
  }
  return styles[severity] || styles.info
}

const getAlertIconColor = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'text-red-600 dark:text-red-400',
    'medium': 'text-yellow-600 dark:text-yellow-400',
    'low': 'text-blue-600 dark:text-blue-400',
    'info': 'text-slate-600 dark:text-slate-400'
  }
  return styles[severity] || styles.info
}

const getActionButtonStyles = (severity: string) => {
  const styles: Record<string, string> = {
    'high': 'text-red-700 bg-red-100 hover:bg-red-200 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:border-red-900/50',
    'medium': 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:border-yellow-900/50',
    'low': 'text-blue-700 bg-blue-100 hover:bg-blue-200 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:border-blue-900/50',
    'info': 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200 dark:text-slate-300 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 dark:border-slate-900/50'
  }
  return styles[severity] || styles.info
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
