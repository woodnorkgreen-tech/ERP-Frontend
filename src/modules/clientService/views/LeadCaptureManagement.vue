<template>
  <div class="space-y-8 pb-12">
    <!-- Premium Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/client-service" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-500 transition-colors">
                Dashboard
              </router-link>
            </li>
            <li>
              <div class="flex items-center gap-2">
                <i class="mdi mdi-chevron-right text-slate-300 text-xs"></i>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Public Leads</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Lead <span class="text-emerald-500 text-3xl opacity-50">/</span> Capture
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Direct inquiries from your social media and website channels.</p>
      </div>

      <div class="flex flex-wrap gap-4">
        <button @click="showShareModal = true" class="flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transition-all font-bold text-sm group">
          <i class="mdi mdi-qrcode-scan text-xl transition-transform group-hover:scale-125"></i>
          SHARE FORM
        </button>
        <button @click="router.push('/client-service/enquiries')" class="flex items-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-bold text-sm group">
          <i class="mdi mdi-plus-circle-outline text-xl transition-transform group-hover:rotate-90"></i>
          NEW ENQUIRY
        </button>
      </div>
    </div>

    <!-- Lead Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="showShareModal = false"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
        <div class="p-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 mb-6 font-bold">
            <i class="mdi mdi-share-variant text-3xl"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Lead Capture Form</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Share this link or QR code on your social media and website to capture new leads directly.</p>

          <!-- QR Code Display -->
          <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl inline-block mb-8 border border-slate-100 dark:border-slate-700">
            <qrcode-vue :value="leadFormUrl" :size="200" level="H" class="rounded-xl" />
          </div>

          <!-- URL Display -->
          <div class="flex items-center gap-2 p-2 pl-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8">
            <span class="text-xs font-mono text-slate-500 truncate text-left flex-1">{{ leadFormUrl }}</span>
            <button @click="copyLink" class="px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all">
              Copy
            </button>
          </div>

          <button @click="showShareModal = false" class="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Close Panel
          </button>
        </div>
      </div>
    </div>

    <!-- Leads Table Container -->
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
      <div v-if="loading" class="p-40 flex flex-col items-center justify-center gap-6">
        <div class="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 animate-spin"></div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Leads...</p>
      </div>

      <div v-else-if="leads.length === 0" class="p-40 flex flex-col items-center justify-center gap-6 opacity-40">
        <i class="mdi mdi-forum-outline text-7xl text-slate-300"></i>
        <div class="text-center">
          <p class="text-sm font-black uppercase tracking-widest text-slate-500">No leads captured yet</p>
          <p class="text-xs text-slate-400 mt-2">Captured leads from your public form will appear here.</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Lead Identity</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Inquiry Essence</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Technical Context</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="lead in leads" :key="lead.id" class="group transition-all hover:bg-emerald-500/[0.02]">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg shadow-sm">
                    {{ (lead.client?.full_name || lead.client?.FullName || 'A').charAt(0) }}
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      {{ lead.client?.full_name || lead.client?.FullName || 'Anonymous Lead' }}
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ lead.client?.phone || 'No Phone' }}</span>
                      <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest lowercase">{{ lead.client?.email || 'no-email' }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="max-w-xs transition-all">
                  <div class="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1 group-hover:line-clamp-none transition-all">
                    {{ lead.title }}
                  </div>
                  <div class="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                    "{{ lead.description || 'No description provided' }}"
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-2">
                    <i class="mdi mdi-office-building text-slate-400 text-xs"></i>
                    <span class="text-[10px] font-black uppercase tracking-tight text-slate-600 dark:text-slate-400">
                      {{ lead.department?.name || 'Unassigned Dept' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="mdi mdi-calendar-clock text-slate-400 text-xs"></i>
                    <span class="text-[10px] font-bold text-slate-500">
                      Recieved {{ new Date(lead.created_at).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div :class="['inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all', getStatusColor(lead.status)]">
                  {{ getStatusLabel(lead.status) }}
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button @click="viewLead(lead)" class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center">
                    <i class="mdi mdi-eye-outline text-lg"></i>
                  </button>
                  <button @click="processLead(lead)" class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                    <i class="mdi mdi-arrow-right-thick text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const leads = ref<any[]>([])
const loading = ref(false)

// Lead Sharing
const showShareModal = ref(false)
const leadFormUrl = ref(`${window.location.origin}/leads/new?source=lead_management`)

const copyLink = () => {
  navigator.clipboard.writeText(leadFormUrl.value)
}

const fetchLeads = async () => {
  loading.value = true
  try {
    // We fetch enquiries and specifically filter for those with lead sources
    // In a real app we might have a dedicated endpoint but filtering enquiries works perfectly
    const response = await api.get('/api/clientservice/enquiries')
    const allEnquiries = response.data.data.data || response.data.data || []
    
    // Filter for enquiries where the client has a lead source like Public Form or Social Media
    // Also include enquiries with 'client_registered' status as these are typically initial leads
    leads.value = allEnquiries.filter((e: any) => {
      const source = (e.client?.lead_source || '').toLowerCase()
      return source.includes('public') || source.includes('social') || source.includes('dashboard') || e.status === 'client_registered'
    })

    // Sort by latest first
    leads.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
  } catch (err) {
    console.error('Failed to fetch leads:', err)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'enquiry_logged': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'cancelled': 'bg-red-500/10 text-red-500 border-red-500/20'
  }
  return colors[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'New Captive',
    'enquiry_logged': 'Logged',
    'cancelled': 'Rejected'
  }
  return labels[status] || status.replace(/_/g, ' ')
}

const viewLead = (lead: any) => {
  // Navigate to enquiries management with this lead
  router.push(`/client-service/enquiries?id=${lead.id}`)
}

const processLead = (lead: any) => {
  // Direct jump to process the lead
  router.push(`/client-service/enquiries?id=${lead.id}&action=process`)
}

onMounted(() => {
  fetchLeads()
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

@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
