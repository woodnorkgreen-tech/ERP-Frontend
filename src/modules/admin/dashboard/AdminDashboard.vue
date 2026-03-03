<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-10 font-inter text-slate-900 dark:text-slate-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <!-- Compact Premium Header -->
      <div class="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                Administration
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
              Admin <span class="text-blue-500 opacity-80">Console</span>
            </h1>
          </div>
          <p class="text-slate-400 max-w-md text-sm font-medium leading-relaxed opacity-80 text-right">
            Operational oversight and system resource management.
          </p>
        </div>
      </div>

      <!-- High-Density KPI Engine -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="stat in statsConfig" :key="stat.label" 
             class="group relative p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-md">
          <div class="flex items-center gap-3">
            <div :class="`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform duration-300 shadow-sm font-black`">
              <i :class="`mdi ${stat.icon} text-xl shadow-sm font-black`"></i>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-wider text-slate-500">{{ stat.label }}</p>
              <p class="text-2xl font-black tracking-tighter">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Quick Access Matrix -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
             <div class="flex items-center justify-between mb-6">
               <div>
                 <h2 class="text-xl font-black tracking-tighter">Control <span class="text-blue-500 opacity-50">Matrix</span></h2>
                 <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Management Directives</p>
               </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <router-link v-for="action in quickActions" :key="action.name" :to="action.path"
                            class="group p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-transparent hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                  <div class="flex items-center gap-3 mb-2">
                    <div :class="`p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm ${action.color} font-black`">
                      <i :class="`mdi ${action.icon} text-lg shadow-sm font-black`"></i>
                    </div>
                    <h3 class="text-sm font-black tracking-tight">{{ action.name }}</h3>
                  </div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed mb-3">{{ action.desc }}</p>
                  <div class="text-[9px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Initialize Tool <i class="mdi mdi-chevron-right"></i>
                  </div>
               </router-link>

               <!-- System Refresh Node -->
               <button @click="handleSystemRefresh" :disabled="refreshing"
                        class="group p-4 bg-red-500/5 dark:bg-red-500/10 rounded-2xl border border-transparent hover:border-red-500/40 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 text-left">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 rounded-lg bg-red-500 text-white shadow-sm">
                      <i class="mdi mdi-refresh text-lg" :class="{ 'animate-spin': refreshing }"></i>
                    </div>
                    <h3 class="text-sm font-black tracking-tight">System Sync</h3>
                  </div>
                  <p class="text-[11px] text-red-500/60 dark:text-red-400/60 line-clamp-1 leading-relaxed mb-3">Force global engine cache invalidation.</p>
                  <div class="text-[9px] font-black uppercase tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Execute Refresh <i class="mdi mdi-chevron-right"></i>
                  </div>
               </button>
             </div>
          </div>
        </div>

        <!-- Sidebar: Event Log -->
        <div class="lg:col-span-4 h-full">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[600px]">
            <div class="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black tracking-tight">System Logs</h3>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Runtime Events</p>
              </div>
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            </div>

            <div class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              <div v-for="(log, index) in recentActivity" :key="index" class="flex gap-3 items-start group">
                <div :class="`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${log.bg} text-white shadow-sm font-black`">
                  <span class="text-[10px] font-black uppercase font-mono">{{ log.type }}</span>
                </div>
                <div class="min-w-0 flex-1 pt-0.5">
                  <div class="flex items-center justify-between gap-2 mb-0.5">
                    <p class="text-[11px] font-black truncate leading-none">{{ log.message }}</p>
                    <span class="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">{{ log.time }}</span>
                  </div>
                  <p class="text-[10px] text-slate-500 font-medium opacity-60">System Registry Entry</p>
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-50 dark:border-slate-800">
              <button class="w-full py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-500 transition-all border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500/20">
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'

// Localized stats config
const stats = ref({
  totalUsers: 3,
  totalDepartments: 2,
  totalRoles: 3
})

const statsConfig = computed(() => [
  { label: 'Total Users', value: stats.value.totalUsers, icon: 'mdi-account-multiple-outline', bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Departments', value: stats.value.totalDepartments, icon: 'mdi-office-building-outline', bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Access Roles', value: stats.value.totalRoles, icon: 'mdi-shield-lock-outline', bg: 'bg-purple-50 dark:bg-purple-500/10', color: 'text-purple-600 dark:text-purple-400' },
  { label: 'System Bio', value: 'Stable', icon: 'mdi-heart-pulse-outline', bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-600 dark:text-amber-400' }
])

const quickActions = [
  { name: 'Users', path: '/admin/users', icon: 'mdi-account-cog-outline', color: 'text-blue-500', desc: 'Identity and access management.' },
  { name: 'Roles', path: '/admin/roles', icon: 'mdi-lock-outline', color: 'text-emerald-500', desc: 'Permission profiles and hierarchy.' },
  { name: 'Depts', path: '/admin/departments', icon: 'mdi-layers-outline', color: 'text-purple-500', desc: 'Organizational structural control.' }
]

const recentActivity = [
  { type: 'USR', message: 'New user registered', time: '2h ago', bg: 'bg-blue-500' },
  { type: 'ROL', message: 'Role permissions updated', time: '4h ago', bg: 'bg-emerald-500' },
  { type: 'DEP', message: 'Department manager assigned', time: '6h ago', bg: 'bg-purple-500' }
]

const refreshing = ref(false)

const handleSystemRefresh = async () => {
    if (!confirm('Are you sure you want to trigger a system refresh? This will force all active users to reload their pages.')) {
        return
    }

    refreshing.value = true
    try {
        await api.post('/api/system/refresh')
        alert('System refresh triggered successfully!')
    } catch (err) {
        console.error('Failed to trigger refresh', err)
        alert('Failed to trigger system refresh')
    } finally {
        refreshing.value = false
    }
}

onMounted(() => {
  // Fetch real data here in final build
})
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>