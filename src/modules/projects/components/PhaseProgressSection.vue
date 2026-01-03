<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Lifecycle <span class="text-blue-500 opacity-50">Intelligence</span></h2>
        <p class="text-sm text-slate-500 font-medium">Real-time status analysis of project phases across the ecosystem.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="phase in phases" :key="phase.name" 
           class="group relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        <!-- Glow -->
        <div class="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 bg-blue-500 opacity-5 transition-opacity group-hover:opacity-10"></div>
        
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Operational Phase</h3>
              <p class="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{{ phase.name }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10">
              <span class="text-xs font-black">{{ Math.round(phase.progress) }}%</span>
            </div>
          </div>

          <div class="flex-grow space-y-4">
            <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Status Matrix</span>
              <span class="text-slate-900 dark:text-white">{{ phase.completed }} / {{ phase.total }} Units</span>
            </div>
            
            <div class="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out rounded-full"
                  :style="{ width: `${phase.progress}%` }"
                ></div>
            </div>
          </div>

          <div class="mt-8 flex items-center gap-4">
              <div class="flex -space-x-3">
                  <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                      <i class="mdi mdi-account text-xs"></i>
                  </div>
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Personnel</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Phase {
  name: string
  total: number
  completed: number
  progress: number
}

interface Props {
  projectMetrics?: {
    phase_progress?: Phase[]
    [key: string]: any
  } | null
}

const props = defineProps<Props>()

const phases = computed(() => props.projectMetrics?.phase_progress || [])
</script>
