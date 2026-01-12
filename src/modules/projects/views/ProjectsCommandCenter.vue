<template>
  <div class="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div class="max-w-8xl mx-auto space-y-8">
          <!-- Header -->
          <div class="flex justify-between items-center border-b border-slate-700 pb-4">
              <div>
                  <h1 class="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Operations</h1>
                  <p class="text-slate-400 text-sm mt-1">Live System Status</p>
              </div>
              <div class="text-right">
                  <div class="text-2xl font-mono animate-pulse">{{ currentTime }}</div>
                  <div class="text-xs text-slate-500 uppercase tracking-widest">System Time</div>
              </div>
          </div>

          <!-- Component: Pipeline Visualizer -->
          <div class="space-y-4">
              <h2 class="text-xl font-semibold text-slate-200 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  Pipeline Status
              </h2>
              <!-- Flow Chart -->
              <div class="relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 overflow-x-auto">
                  <div v-if="loading" class="flex justify-center p-10">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                  </div>
                  <div v-else-if="pipelineData && pipelineData.stages" class="flex items-center justify-between min-w-[800px] px-8 py-4">
                      <div v-for="(stage, key, index) in pipelineData.stages" :key="key" class="relative group flex-1 flex flex-col items-center">
                          <!-- Connector Line -->
                          <div v-if="index !== 0" class="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -z-10 -translate-x-1/2"></div>
                          
                          <!-- Node -->
                          <div class="relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-cyan-500/20" :class="stage.color">
                               <span class="text-xl font-bold text-white">{{ pipelineData?.counts[key] || 0 }}</span>
                          </div>
                          
                          <!-- Label -->
                          <div class="mt-4 text-center">
                              <div class="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{{ stage.label }}</div>
                              <div class="text-xs text-slate-500">Stage {{ index + 1 }}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Department Pulse -->
              <div class="lg:col-span-2 space-y-4">
                  <h2 class="text-xl font-semibold text-slate-200 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      Department Workload
                  </h2>
                  <div v-if="loading" class="flex justify-center p-10 bg-slate-800 rounded-xl">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-for="dept in departmentData" :key="dept.id" class="bg-slate-800 p-5 rounded-xl border-l-4 border-purple-500 shadow-lg hover:bg-slate-750 transition-colors">
                          <div class="flex justify-between items-start mb-2">
                              <h3 class="font-bold text-lg text-white">{{ dept.name }}</h3>
                              <span class="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">Total: {{ dept.total_load }}</span>
                          </div>
                          <div class="space-y-3">
                              <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-400">Active</span>
                                    <span class="text-cyan-400 font-mono">{{ dept.in_progress }}</span>
                                </div>
                                <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-cyan-500 h-full" :style="{ width: (dept.in_progress / (dept.total_load || 1) * 100) + '%' }"></div>
                                </div>
                              </div>
                              <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-400">Pending</span>
                                    <span class="text-purple-400 font-mono">{{ dept.pending }}</span>
                                </div>
                                <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-purple-500 h-full" :style="{ width: (dept.pending / (dept.total_load || 1) * 100) + '%' }"></div>
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Bottlenecks -->
              <div class="space-y-4">
                  <div class="flex items-center justify-between">
                      <h2 class="text-xl font-semibold text-slate-200 flex items-center">
                          <svg class="w-5 h-5 mr-2 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                          Urgent Issues
                      </h2>
                  </div>
                  
                  <div class="bg-slate-800 rounded-xl border border-red-900/30 overflow-hidden min-h-[300px]">
                      <div v-if="loading" class="flex justify-center p-10">
                          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                      </div>
                      <div v-else-if="bottlenecks.length === 0" class="p-8 text-center text-slate-500 italic flex flex-col items-center justify-center h-full">
                          <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          No critical bottlenecks. Good job!
                      </div>
                      <div v-else class="divide-y divide-slate-700">
                          <div v-for="task in bottlenecks" :key="task.id" class="p-4 hover:bg-slate-750 transition-colors group cursor-pointer">
                              <div class="flex justify-between items-start mb-1">
                                  <span class="text-xs font-bold text-red-400 uppercase tracking-wide flex items-center">
                                      <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                                      Due {{ new Date(task.due_date).toLocaleDateString() }}
                                  </span>
                                  <span class="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 border border-slate-600">{{ task.department?.name }}</span>
                              </div>
                              <h4 class="text-sm font-medium text-white mb-1 group-hover:text-cyan-400 transition-colors">{{ task.title }}</h4>
                              <div class="text-xs text-slate-400 flex flex-col gap-1">
                                  <span class="flex items-center text-slate-500">
                                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                      {{ task.enquiry?.title || 'Unknown Project' }}
                                  </span>
                                  <span v-if="task.assigned_to" class="flex items-center text-slate-500">
                                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                      {{ task.assigned_to.name }}
                                  </span>
                                  <span v-else class="text-yellow-500/80 italic flex items-center">
                                       <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                      Unassigned
                                  </span>
                              </div>
                          </div>
                      </div>
                      <div class="p-3 bg-slate-900/50 text-center border-t border-slate-700">
                           <button class="text-xs text-slate-400 hover:text-white transition-colors">View All Criticals</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useNow, useDateFormat } from '@vueuse/core'

const currentTime = useDateFormat(useNow(), 'HH:mm:ss')

// Types
// Define minimal types for data handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pipelineData = ref<{ stages: Record<string, any>, counts: Record<string, any> } | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const departmentData = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bottlenecks = ref<any[]>([])
const loading = ref(true)

// API Fetch
const fetchData = async () => {
    loading.value = true
    try {
        const response = await api.get('/api/projects/dashboard/command-center')
        const data = response.data.data
        pipelineData.value = data.pipeline
        departmentData.value = data.department_pulse
        bottlenecks.value = data.bottlenecks
    } catch (e) {
        console.error("Command Center Load Error", e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
/* Custom scrollbar for pipeline */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.8);
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #06b6d4; /* cyan-500 */
}
</style>
