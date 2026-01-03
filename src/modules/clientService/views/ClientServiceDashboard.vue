<template>
  <div class="space-y-8 pb-12">
    <!-- Premium Welcome Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-[#0f172a] p-8 md:p-12 shadow-2xl">
      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <span class="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-4">
            Intelligence Engine
          </span>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Client Service <span class="text-blue-500">&</span> Marketing
          </h1>
          <p class="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
            Welcome back. Monitor your sales pipeline, track high-priority enquiries, and manage client relations through our centralized deployment hub.
          </p>
        </div>
        
        <div class="flex flex-wrap gap-4">
          <button @click="router.push('/client-service/enquiries')" class="flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-bold text-sm group">
            <i class="mdi mdi-plus-circle-outline text-xl transition-transform group-hover:rotate-90"></i>
            NEW ENQUIRY
          </button>
          <button @click="router.push('/client-service/clients')" class="flex items-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all font-bold text-sm">
            <i class="mdi mdi-account-plus-outline text-xl"></i>
            REGISTER CLIENT
          </button>
        </div>
      </div>
    </div>

    <!-- Metrics Engine -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Total Clients -->
      <div class="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-blue-500/30">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <i class="mdi mdi-account-group-outline text-2xl"></i>
          </div>
          <span class="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">+{{ (totalClients * 0.05).toFixed(0) }} NEW</span>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total Partnership Base</span>
          <p class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ totalClients }}</p>
        </div>
      </div>

      <!-- Active Projects -->
      <div class="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-emerald-500/30">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <i class="mdi mdi-rocket-launch-outline text-2xl"></i>
          </div>
          <span class="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">ACTIVE</span>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Live Deployments</span>
          <p class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ projectsStore.activeProjects.length }}</p>
        </div>
      </div>

      <!-- New Enquiries -->
      <div class="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-amber-500/30">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <i class="mdi mdi-alert-circle-outline text-2xl"></i>
          </div>
          <span class="text-xs font-black text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">PENDING</span>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">New Service Requests</span>
          <p class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ newEnquiries.length }}</p>
        </div>
      </div>

      <!-- Conversion Rate -->
      <div class="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-purple-500/30">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <i class="mdi mdi-trending-up text-2xl"></i>
          </div>
          <span class="text-xs font-black text-purple-500 bg-purple-500/10 px-2.5 py-1.5 rounded-lg border border-purple-500/20">MARKET SHARE</span>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Conversion Growth</span>
          <p class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ totalEnquiries ? ((convertedEnquiries.length / totalEnquiries) * 100).toFixed(1) : 0 }}%</p>
        </div>
      </div>

       <!-- Total Volume -->
       <div class="group relative p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-indigo-500/30">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <i class="mdi mdi-database-outline text-2xl"></i>
          </div>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Global Enquiry Volume</span>
          <p class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{{ totalEnquiries }}</p>
        </div>
      </div>
    </div>

    <!-- Pipeline & Feed Container -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Conversion Pipeline -->
      <div class="lg:col-span-8 space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Conversion Pipeline</h2>
              <p class="text-sm text-slate-500 font-medium">Visualizing lifecycle of current enquiries</p>
            </div>
            <div class="flex gap-2">
                   <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                      <div class="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                      <span class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Stable</span>
                   </div>
            </div>
          </div>

          <div class="space-y-10 py-4">
            <!-- Pipeline Stages -->
            <div class="relative">
              <!-- Progress Track -->
              <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 transition-all duration-1000" :style="{ width: totalEnquiries ? ((convertedEnquiries.length / totalEnquiries) * 100) + '%' : '0%' }"></div>
              </div>
              
              <div class="relative flex justify-between items-center">
                <!-- Stage: Initial Enquiries -->
                <div class="flex flex-col items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-4 border-amber-500 flex items-center justify-center text-amber-500 transition-transform hover:scale-110 z-10 shadow-lg">
                    <i class="mdi mdi-email-open-outline text-xl"></i>
                  </div>
                  <div class="text-center">
                    <p class="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Logged</p>
                    <p class="text-sm text-slate-500 font-black">{{ newEnquiries.length }}</p>
                  </div>
                </div>

                <!-- Stage: Technical Phase -->
                <div class="flex flex-col items-center gap-3">
                  <div :class="['w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-4 flex items-center justify-center transition-transform hover:scale-110 z-10 shadow-lg', 
                    enquiries.filter(e => ['site_survey_completed', 'design_completed', 'design_approved', 'materials_specified'].includes(e.status)).length > 0 ? 'border-blue-500 text-blue-500' : 'border-slate-200 dark:border-slate-800 text-slate-400']">
                    <i class="mdi mdi-draw-pen text-xl"></i>
                  </div>
                  <div class="text-center">
                    <p class="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Technical</p>
                    <p class="text-sm text-slate-500 font-black">{{ enquiries.filter(e => ['site_survey_completed', 'design_completed', 'design_approved', 'materials_specified'].includes(e.status)).length }}</p>
                  </div>
                </div>

                <!-- Stage: Financial Quote -->
                <div class="flex flex-col items-center gap-3">
                  <div :class="['w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-4 flex items-center justify-center transition-transform hover:scale-110 z-10 shadow-lg', 
                    enquiries.filter(e => ['budget_created', 'quote_prepared', 'quote_approved'].includes(e.status)).length > 0 ? 'border-purple-500 text-purple-500' : 'border-slate-200 dark:border-slate-800 text-slate-400']">
                    <i class="mdi mdi-file-document-outline text-xl"></i>
                  </div>
                  <div class="text-center">
                    <p class="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Financial</p>
                    <p class="text-sm text-slate-500 font-black">{{ enquiries.filter(e => ['budget_created', 'quote_prepared', 'quote_approved'].includes(e.status)).length }}</p>
                  </div>
                </div>

                <!-- Stage: Conversion -->
                <div class="flex flex-col items-center gap-3">
                  <div :class="['w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-4 flex items-center justify-center transition-transform hover:scale-110 z-10 shadow-lg', 
                    convertedEnquiries.length > 0 ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 dark:border-slate-800 text-slate-400']">
                    <i class="mdi mdi-check-decagram-outline text-xl"></i>
                  </div>
                  <div class="text-center">
                    <p class="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Converted</p>
                    <p class="text-sm text-slate-500 font-black">{{ convertedEnquiries.length }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Quick Action Hub -->
          <div class="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div class="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <h3 class="text-lg font-black uppercase tracking-widest mb-6 opacity-80">Quick Protocol Hub</h3>
            <div class="grid grid-cols-2 gap-3">
              <button class="flex flex-col items-start gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                <i class="mdi mdi-file-chart-outline text-3xl"></i>
                <span class="text-sm font-black uppercase tracking-tight text-left leading-tight">Generate Sales<br/>Report</span>
              </button>
              <button class="flex flex-col items-start gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                <i class="mdi mdi-account-star-outline text-3xl"></i>
                <span class="text-sm font-black uppercase tracking-tight text-left leading-tight">VIP Client<br/>Focus</span>
              </button>
              <button class="flex flex-col items-start gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                <i class="mdi mdi-clock-alert-outline text-3xl"></i>
                <span class="text-sm font-black uppercase tracking-tight text-left leading-tight">Follow-up<br/>Alerts</span>
              </button>
              <button class="flex flex-col items-start gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
                 <i class="mdi mdi-help-circle-outline text-3xl"></i>
                 <span class="text-sm font-black uppercase tracking-tight text-left leading-tight">Service<br/>Support</span>
              </button>
            </div>
          </div>

          <!-- Marketing Insight -->
          <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
             <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3 font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 text-xs">
                  <i class="mdi mdi-chart-donut text-blue-500 text-xl"></i>
                  Acquisition Analytics
                </div>
             </div>
             
             <!-- Chart Container -->
             <div class="flex-1 relative min-h-[220px] flex items-center justify-center">
                <canvas id="leadSourceChart" ref="chartCanvas"></canvas>
                <div v-if="!totalClients" class="absolute inset-0 flex items-center justify-center opacity-30">
                    <p class="text-xs font-black uppercase tracking-widest text-slate-500">No Data Points</p>
                </div>
             </div>

             <div class="mt-6 space-y-3">
                <div class="flex items-center justify-between text-xs font-black">
                   <span class="text-slate-500 uppercase tracking-widest">Highest Converting:</span>
                   <span class="text-blue-500 uppercase tracking-widest">Digital Channels</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                   <div class="h-full bg-blue-500" style="width: 75%"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Feed Container -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full min-h-[600px]">
          <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Deployment Feed</h3>
            <span class="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-black uppercase tracking-[0.2em]">LIVE</span>
          </div>

          <div class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-4">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600"></div>
              <p class="text-sm font-black uppercase tracking-widest text-slate-500">Syncing Feed...</p>
            </div>
            
            <div v-else-if="recentEnquiries.length === 0" class="flex flex-col items-center justify-center py-12 gap-4 opacity-50">
              <i class="mdi mdi-tray-remove text-5xl text-slate-300"></i>
              <p class="text-xs font-black uppercase tracking-widest text-slate-400">No active enquiries</p>
            </div>

            <div v-else v-for="enquiry in recentEnquiries" :key="enquiry.id" class="group relative pl-8">
              <!-- Timeline Indicator -->
              <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 group-last:bg-transparent"></div>
              <div class="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-sm"
                   :class="enquiry.status === 'enquiry_logged' ? 'bg-amber-500' : 'bg-blue-500'"></div>
              
              <div class="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                <div class="flex justify-between items-start mb-3">
                  <span class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {{ new Date(enquiry.created_at).toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'}) }}
                  </span>
                  <div :class="['px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-widest border', getPriorityColor(enquiry.priority)]">
                    {{ enquiry.priority }}
                  </div>
                </div>
                
                <h4 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors mb-1 truncate">{{ enquiry.title }}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                  <i class="mdi mdi-account-circle-outline"></i>
                  {{ enquiry.client?.full_name || enquiry.client?.FullName || 'Anonymous Client' }}
                </p>

                 <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div :class="['px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border', getStatusColor(enquiry.status)]">
                       {{ getStatusLabel(enquiry.status) }}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
             <button @click="router.push('/client-service/enquiries')" class="w-full py-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center justify-center gap-3 transition-all">
                Access Central Intelligence
                <i class="mdi mdi-arrow-right text-lg"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClients } from '../composables/useClients'
import { useEnquiries } from '../composables/useEnquiries'
import { useProjects } from '../composables/useProjects'
import { useProjectsStore } from '@/stores/projects'
import Chart from 'chart.js/auto'

const router = useRouter()
const { totalClients, activeClients, fetchClients, clients } = useClients()
const { totalEnquiries, newEnquiries, convertedEnquiries, enquiries, loading, fetchEnquiries } = useEnquiries()
const { fetchProjects } = useProjects()
const projectsStore = useProjectsStore()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let leadChart: Chart | null = null

const recentEnquiries = computed(() => {
  return [...enquiries.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-blue-500/10 text-blue-500',
    'enquiry_logged': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    'site_survey_completed': 'bg-indigo-500/10 text-indigo-500',
    'design_completed': 'bg-purple-500/10 text-purple-500',
    'design_approved': 'bg-teal-500/10 text-teal-500',
    'materials_specified': 'bg-pink-500/10 text-pink-500',
    'budget_created': 'bg-orange-500/10 text-orange-500',
    'quote_prepared': 'bg-sky-500/10 text-sky-500',
    'quote_approved': 'bg-cyan-500/10 text-cyan-500',
    'converted_to_project': 'bg-emerald-500/10 text-emerald-500 font-extrabold',
    'cancelled': 'bg-red-500/10 text-red-500'
  }
  return colors[status] || 'bg-slate-500/10 text-slate-500'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Registration',
    'enquiry_logged': 'Logged',
    'site_survey_completed': 'Survey Done',
    'design_completed': 'Design',
    'design_approved': 'Approved',
    'materials_specified': 'Specs',
    'budget_created': 'Budget',
    'quote_prepared': 'Quote',
    'quote_approved': 'Confirmed',
    'converted_to_project': 'Project',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'text-slate-400 bg-slate-500/5',
    'medium': 'text-blue-400 bg-blue-500/5',
    'high': 'text-orange-400 bg-orange-500/5',
    'urgent': 'text-red-500 bg-red-500/5 animate-pulse'
  }
  return colors[priority] || 'text-slate-400 bg-slate-500/5'
}

const initChart = () => {
  if (!chartCanvas.value) return
  if (leadChart) leadChart.destroy()

  // Calculate Lead Source Distribution from clients
  const sources: Record<string, number> = {}
  clients.value.forEach(c => {
    const s = c.LeadSource || 'Unknown'
    sources[s] = (sources[s] || 0) + 1
  })

  const labels = Object.keys(sources).length ? Object.keys(sources) : ['Digital', 'Referral', 'Events', 'Others']
  const data = Object.keys(sources).length ? Object.values(sources) : [45, 25, 20, 10]

  leadChart = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#3b82f6', // blue-500
          '#10b981', // emerald-500
          '#f59e0b', // amber-500
          '#8b5cf6', // violet-500
          '#ec4899'  // pink-500
        ],
        borderWidth: 0,
        weight: 1
      }]
    },
    options: {
      cutout: '75%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 10,
              weight: 'bold',
              family: 'Inter'
            },
            color: '#64748b'
          }
        },
        tooltip: {
          padding: 12,
          backgroundColor: '#0f172a',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 12 },
          cornerRadius: 12,
          displayColors: false
        }
      }
    }
  })
}

watch(clients, () => {
  initChart()
}, { deep: true })

onMounted(async () => {
   await fetchClients()
   await fetchEnquiries()
   await fetchProjects()
   setTimeout(initChart, 500) // Small delay for layout calculation
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.3);
}

/* Animations */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
