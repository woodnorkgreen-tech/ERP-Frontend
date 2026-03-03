<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-10 font-inter text-slate-900 dark:text-slate-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 transition-all duration-300">
      <div class="space-y-6">
        <!-- Compact Premium Header -->
        <div class="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
          <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                  Super Admin
                </span>
              </div>
              <h1 class="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
                System <span class="text-blue-500 opacity-80">Command</span>
              </h1>
            </div>
            <p class="text-slate-400 max-w-md text-sm font-medium leading-relaxed opacity-80">
              Complete oversight and management of the WNG-ERP ecosystem.
            </p>
          </div>
        </div>

        <!-- Compact KPI Metrics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="stat in statsConfig" :key="stat.label" 
               class="group relative p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-md">
            <div class="flex items-center gap-3">
              <div :class="`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform duration-300`">
                <i :class="`mdi ${stat.icon} text-xl`"></i>
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-wider text-slate-500">{{ stat.label }}</p>
                <p class="text-2xl font-black tracking-tighter">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Main Content: Modular Gateway -->
          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
               <div class="flex items-center justify-between mb-6">
                 <div>
                   <h2 class="text-xl font-black tracking-tighter">Department <span class="text-blue-500 opacity-50">Hub</span></h2>
                   <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Access Control Points</p>
                 </div>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <router-link v-for="module in modulesConfig" :key="module.name" :to="module.path || '#'"
                              :class="`group p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-transparent transition-all duration-300 ${module.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-800'}`">
                    <div class="flex items-center gap-3 mb-2">
                      <div :class="`p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm ${module.color} text-white`">
                        <i :class="`mdi ${module.icon} text-lg`"></i>
                      </div>
                      <h3 class="text-sm font-black tracking-tight">{{ module.name }}</h3>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">{{ module.desc }}</p>
                    <div v-if="!module.disabled" class="text-[9px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Module <i class="mdi mdi-chevron-right"></i>
                    </div>
                 </router-link>
               </div>
            </div>

            <!-- Compact Admin Tools -->
            <div class="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-lg relative overflow-hidden group">
               <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600/5 rounded-full blur-[60px]"></div>
               <div class="relative z-10">
                 <div class="flex items-center justify-between mb-4 px-2">
                    <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic">Admin Engine</h2>
                    <div class="flex gap-1">
                      <div class="w-1 h-1 rounded-full bg-blue-500"></div>
                      <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                      <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                    </div>
                 </div>
                 <div class="grid grid-cols-3 gap-3">
                    <router-link v-for="tool in adminTools" :key="tool.name" :to="tool.path" 
                                 class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group/tool">
                      <div :class="`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${tool.bg} ${tool.color} group-hover/tool:scale-110 text-white`">
                        <i :class="`mdi ${tool.icon} text-sm text-white`"></i>
                      </div>
                      <span class="text-[10px] font-black uppercase tracking-wider">{{ tool.name }}</span>
                    </router-link>
                 </div>
               </div>
            </div>
          </div>

          <!-- Sidebar: Dense System Monitor -->
          <div class="lg:col-span-4 h-full">
            <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[700px]">
              <div class="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-black tracking-tight">System Feed</h3>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Audit</span>
                  </div>
                </div>
                <button class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                  <i class="mdi mdi-refresh text-lg"></i>
                </button>
              </div>

              <div class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                <div v-if="isLoading" class="flex flex-col items-center justify-center py-10 opacity-30">
                  <div class="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em]">Syncing...</span>
                </div>
                
                <div v-else-if="recentActivity.length === 0" class="flex flex-col items-center justify-center py-10 opacity-20 text-center">
                  <i class="mdi mdi-text-box-remove-outline text-4xl mb-2"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest leading-tight whitespace-nowrap">Null State<br/>(No Logs)</span>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="activity in recentActivity" :key="activity.id" class="flex gap-3 items-start group">
                    <div :class="`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 uppercase text-xs font-black shadow-sm transition-transform group-hover:scale-105 ${activity.action === 'login' ? 'bg-emerald-500' : 'bg-blue-500'} text-white`">
                      {{ activity.user_name?.charAt(0) || 'S' }}
                    </div>
                    <div class="min-w-0 flex-1 pt-0.5">
                      <div class="flex items-center justify-between gap-2 mb-0.5">
                        <p class="text-[11px] font-black truncate leading-none">{{ activity.user_name }}</p>
                        <span class="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">{{ activity.time }}</span>
                      </div>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-normal line-clamp-2">
                        {{ activity.message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-5 border-t border-slate-50 dark:border-slate-800">
                <button class="w-full py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-500 transition-all border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500/20 bg-slate-50/50 dark:bg-slate-800/30">
                  Detailed Audit Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi, handleApiError } from '../shared/composables/useApi'

const { get } = useApi()

const systemStats = ref({
  totalUsers: 0,
  totalDepartments: 0,
  activeProjects: 0
})

const recentActivity = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Config for visual metrics
const statsConfig = computed(() => [
  { label: 'Total Users', value: systemStats.value.totalUsers, icon: 'mdi-account-multiple-outline', bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Departments', value: systemStats.value.totalDepartments, icon: 'mdi-office-building-outline', bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Active Projects', value: systemStats.value.activeProjects, icon: 'mdi-briefcase-outline', bg: 'bg-purple-50 dark:bg-purple-500/10', color: 'text-purple-600 dark:text-purple-400' },
  { label: 'Platform Health', value: 'Prime', icon: 'mdi-heart-pulse', bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-600 dark:text-amber-400' }
])

// Config for modules
const modulesConfig = [
  { name: 'Admin', path: '/admin', icon: 'mdi-shield-account-outline', color: 'text-blue-500', desc: 'System control & user management core.' },
  { name: 'Projects', path: '/projects/dashboard', icon: 'mdi-application-cog-outline', color: 'text-emerald-500', desc: 'Operation workflows and pipeline tracking.' },
  { name: 'Client Service', path: '/client-service', icon: 'mdi-account-card-outline', color: 'text-purple-500', desc: 'Acquisition and relationship management.' },
  { name: 'Human Resources', path: '/hr', icon: 'mdi-account-group-outline', color: 'text-amber-500', desc: 'Workforce records and internal operations.' },
  { name: 'Finance', path: '/finance', icon: 'mdi-cash-multiple', color: 'text-yellow-500', desc: 'Budget control and accounts management.' },
  { name: 'Logistics', disabled: true, icon: 'mdi-truck-outline', color: 'text-slate-400', desc: 'Coming soon: Supply chain and delivery management.' }
]

// Config for admin tools
const adminTools = [
  { name: 'Users', path: '/admin/users', icon: 'mdi-account-cog-outline', bg: 'bg-blue-500/20', color: 'text-blue-400' },
  { name: 'Access', path: '/admin/roles', icon: 'mdi-lock-outline', bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
  { name: 'Depts', path: '/admin/departments', icon: 'mdi-layers-outline', bg: 'bg-purple-500/20', color: 'text-purple-400' }
]

const fetchDashboardData = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await get<any>('/api/admin/dashboard/stats')
    if (response && response.data) {
      systemStats.value = response.data.stats || systemStats.value
      recentActivity.value = (response.data.recentActivity || []).slice(0, 8)
    }
  } catch (err) {
    error.value = handleApiError(err, 'Failed to sync dashboard')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDashboardData())
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
