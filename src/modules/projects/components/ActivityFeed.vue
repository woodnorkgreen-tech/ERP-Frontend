<template>
  <div class="flex flex-col h-full">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
      <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intercepting Feed...</p>
    </div>

    <div v-else-if="!activities?.length" class="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
      <div class="w-20 h-20 bg-slate-500/10 rounded-full flex items-center justify-center text-slate-500 mb-6 group-hover:scale-110 transition-transform duration-500">
        <i class="mdi mdi-pulse text-4xl"></i>
      </div>
      <p class="text-sm font-black text-slate-400 uppercase tracking-widest">Feed Flatline</p>
      <p class="text-xs text-slate-500 font-medium mt-1 text-center">No mission activity signatures <br/> detected in this sector.</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
      <div v-for="(activity, idx) in activities" :key="activity.timestamp"
           class="group relative flex items-start gap-4 p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300">
        
        <!-- Timeline Line -->
        <div v-if="idx !== activities.length - 1" class="absolute left-[2.4rem] top-14 bottom-[-1.5rem] w-px bg-slate-200 dark:bg-slate-800"></div>

        <div class="flex-shrink-0 relative z-10 mt-1">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 border"
               :class="getActivityIconStyles(activity.type)">
            <i class="mdi text-xl" :class="getActivityIcon(activity.type)"></i>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-4 mb-1">
            <p class="text-sm font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-500 transition-colors">{{ activity.title }}</p>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {{ formatTime(activity.timestamp) }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{{ activity.description }}</p>
          
          <div v-if="activity.metadata" class="mt-3 flex items-center gap-4">
            <div v-if="activity.metadata.user" class="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-black overflow-hidden">
                    {{ activity.metadata.user.charAt(0) }}
                </div>
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ activity.metadata.user }}</span>
            </div>

            <div v-if="activity.metadata.project" class="flex items-center gap-1">
                <i class="mdi mdi-link text-blue-500 text-xs text-blue-500"></i>
                <span class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-blue-500/20">
                    {{ activity.metadata.project }}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activities?.length" class="mt-8">
      <button class="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2">
        <i class="mdi mdi-history text-lg"></i>
        Historical Archive
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
 
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities?: any[]
  loading?: boolean
}

defineProps<Props>()

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    'enquiry_created': 'mdi-account-plus-outline',
    'task_updated': 'mdi-calendar-check-outline',
    'project_completed': 'mdi-check-decagram-outline',
    'phase_updated': 'mdi-layers-outline',
    'user_action': 'mdi-gesture-tap'
  }
  return icons[type] || icons.user_action
}

const getActivityIconStyles = (type: string) => {
  const styles: Record<string, string> = {
    'enquiry_created': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'task_updated': 'bg-green-500/10 text-green-600 border-green-500/20',
    'project_completed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'phase_updated': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'user_action': 'bg-slate-500/10 text-slate-600 border-slate-500/20'
  }
  return styles[type] || styles.user_action
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
