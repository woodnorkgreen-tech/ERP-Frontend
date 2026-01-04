<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4 px-4">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-6 bg-blue-500 rounded-full"></div>
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Tactical Engine</h3>
        <div class="group/tooltip relative">
          <i class="mdi mdi-information-outline text-slate-300 hover:text-blue-500 cursor-help transition-colors"></i>
          <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
            <div class="font-black uppercase tracking-widest mb-2 text-blue-400">Tactical Criteria</div>
            Correlates historical task durations, financial margins, and enquiry staleness to generate proactive operational strategies for the mission.
            <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="suggestions.length === 0 && !loading" class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
      <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
        <i class="mdi mdi-brain text-3xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Systems Analysis Clear</h3>
      <p class="text-slate-500 text-sm max-w-xs mx-auto">No immediate tactical suggestions or anomalies detected in your project lifecycle.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <div 
        v-for="(suggestion, index) in suggestions" 
        :key="index"
        class="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
      >
        <!-- Background Gradient for Severity -->
        <div 
          class="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-10 transition-opacity group-hover:opacity-20"
          :class="{
            'bg-red-500': suggestion.priority === 'urgent',
            'bg-orange-500': suggestion.priority === 'high',
            'bg-blue-500': suggestion.priority === 'medium'
          }"
        ></div>

        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-6">
            <div 
              class="w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110"
              :class="{
                'bg-red-500/10 text-red-500 border-red-500/10': suggestion.priority === 'urgent',
                'bg-orange-500/10 text-orange-500 border-orange-500/10': suggestion.priority === 'high',
                'bg-blue-500/10 text-blue-500 border-blue-500/10': suggestion.priority === 'medium'
              }"
            >
              <i :class="['mdi', suggestion.icon, 'text-2xl']"></i>
            </div>
            <span 
              class="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md"
              :class="{
                'bg-red-500/10 text-red-500': suggestion.priority === 'urgent',
                'bg-orange-500/10 text-orange-500': suggestion.priority === 'high',
                'bg-blue-500/10 text-blue-500': suggestion.priority === 'medium'
              }"
            >
              {{ suggestion.priority }}
            </span>
          </div>

          <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2 leading-tight">
            {{ suggestion.title }}
          </h3>
          
          <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 flex-1 leading-relaxed">
            {{ suggestion.message }}
          </p>

          <button 
            @click="$router.push(suggestion.action_url)"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            :class="{
              'bg-slate-900 dark:bg-slate-800 text-white hover:bg-black dark:hover:bg-slate-700': suggestion.priority !== 'urgent',
              'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20': suggestion.priority === 'urgent'
            }"
          >
            {{ suggestion.action_label }}
            <i class="mdi mdi-arrow-right text-base"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Suggestion {
  type: string;
  priority: 'high' | 'medium' | 'urgent';
  title: string;
  message: string;
  icon: string;
  action_label: string;
  action_url: string;
}

defineProps<{
  suggestions: Suggestion[];
  loading?: boolean;
}>();
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>
