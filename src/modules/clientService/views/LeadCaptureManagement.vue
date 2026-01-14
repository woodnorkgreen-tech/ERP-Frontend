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
    <div class="bg-white dark:bg-[#0b0f1a]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[500px]">
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
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-md">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">Lead Registry</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">Communication Node</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">Core Interest</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">Status</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 text-right">Engagement</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
            <tr v-for="lead in leads" :key="lead.id" class="group transition-all hover:bg-emerald-500/[0.03] animate-fade-in">
              <td class="px-8 py-7">
                <div class="flex items-center gap-5">
                  <div class="relative">
                    <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl shadow-inner border border-emerald-500/10 transition-transform group-hover:scale-110">
                      {{ (lead.full_name || 'A').charAt(0) }}
                    </div>
                    <div class="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-500 shadow-sm">
                      <i v-if="lead.how_did_you_hear === 'Instagram'" class="mdi mdi-instagram text-pink-500"></i>
                      <i v-else-if="lead.how_did_you_hear === 'WhatsApp'" class="mdi mdi-whatsapp text-emerald-500"></i>
                      <i v-else-if="lead.how_did_you_hear === 'Website'" class="mdi mdi-web text-blue-500"></i>
                      <i v-else-if="lead.how_did_you_hear === 'QR'" class="mdi mdi-qrcode text-slate-900 dark:text-white"></i>
                      <i v-else class="mdi mdi-account-circle-outline"></i>
                    </div>
                  </div>
                  <div>
                    <div class="text-[15px] font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      {{ lead.full_name }}
                      <span v-if="lead.company_name" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-500 font-bold uppercase tracking-widest border border-slate-200/50 dark:border-slate-700">
                        {{ lead.company_name }}
                      </span>
                    </div>
                    <div class="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                      Received {{ new Date(lead.created_at).toLocaleDateString() }}
                      <span class="mx-2 opacity-30">|</span>
                      Captured via {{ lead.source || 'Direct' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-7">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-2 group/phone cursor-pointer">
                    <i class="mdi mdi-phone-outline text-slate-300 dark:text-slate-600 transition-colors group-hover/phone:text-blue-500"></i>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover/phone:text-blue-500 transition-colors">{{ lead.phone || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2 group/email cursor-pointer">
                    <i class="mdi mdi-email-outline text-slate-300 dark:text-slate-600 transition-colors group-hover/email:text-blue-500"></i>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover/email:text-blue-500 transition-colors lowercase">{{ lead.email || 'N/A' }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-7">
                <div class="flex flex-col gap-1">
                  <div class="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {{ lead.service_interest || 'General' }}
                  </div>
                  <div class="text-[10px] text-slate-400 dark:text-slate-500 italic max-w-[180px] truncate group-hover:text-clip group-hover:whitespace-normal transition-all" :title="lead.description">
                    "{{ lead.description || 'No description provided' }}"
                  </div>
                </div>
              </td>
              <td class="px-8 py-7">
                <div :class="['inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all', getStatusColor(lead.status)]">
                  <div class="w-1 h-1 rounded-full bg-current mr-2 animate-pulse"></div>
                  {{ getStatusLabel(lead.status) }}
                </div>
              </td>
              <td class="px-8 py-7">
                <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-300">
                  <button 
                    @click="showLeadDetails(lead)" 
                    class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center shadow-sm"
                    title="View Full Identity"
                  >
                    <i class="mdi mdi-eye-outline text-lg"></i>
                  </button>
                  <button 
                    @click="processLead(lead)" 
                    class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center shadow-sm"
                    title="Process Node"
                  >
                    <i class="mdi mdi-arrow-right text-lg rotate-[-45deg] group-hover:rotate-0 transition-transform"></i>
                  </button>
                  <button 
                    @click="confirmDelete(lead)" 
                    class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all flex items-center justify-center shadow-sm"
                    title="Decommission Lead"
                  >
                    <i class="mdi mdi-trash-can-outline text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lead Detail Modal -->
    <div v-if="selectedLead" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-fade-in" @click="selectedLead = null"></div>
      <div class="relative bg-white dark:bg-[#0b0f1a] rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 shadow-2xl w-full max-w-2xl overflow-hidden animate-bounce-in">
        <div class="p-10">
          <div class="flex items-start justify-between mb-10">
            <div class="flex items-center gap-6">
              <div class="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-3xl shadow-lg border border-emerald-500/10">
                {{ selectedLead.full_name?.charAt(0) }}
              </div>
              <div>
                <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ selectedLead.full_name }}</h2>
                <div class="flex items-center gap-3 mt-2">
                   <div :class="['inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all', getStatusColor(selectedLead.status)]">
                    {{ getStatusLabel(selectedLead.status) }}
                  </div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{{ selectedLead.company_name || 'Individual Entity' }}</span>
                </div>
              </div>
            </div>
            <button @click="selectedLead = null" class="w-12 h-12 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
              <i class="mdi mdi-close text-2xl text-slate-400"></i>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-8 mb-10">
            <div class="space-y-6">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication Node</label>
                <div class="flex flex-col gap-3">
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <i class="mdi mdi-email-outline text-xl text-blue-500"></i>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ selectedLead.email }}</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <i class="mdi mdi-phone-outline text-xl text-emerald-500"></i>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ selectedLead.phone }}</span>
                  </div>
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Discovery Source</label>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ selectedLead.source }}</span>
                  <span v-if="selectedLead.how_did_you_hear" class="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">via {{ selectedLead.how_did_you_hear }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Proposed Interface</label>
                <div class="p-4 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] rounded-2xl border border-emerald-500/10">
                  <div class="flex items-center gap-2 mb-2 font-black text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    <i class="mdi mdi-hexagon-multiple"></i>
                    {{ selectedLead.service_interest || 'General' }}
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                     {{ selectedLead.description || 'No specific mission parameters provided.' }}
                  </p>
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Temporal Marker</label>
                <div class="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <i class="mdi mdi-clock-outline"></i>
                  Captured on {{ new Date(selectedLead.created_at).toLocaleString() }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
             <button 
                v-if="selectedLead.status === 'new'"
                @click="processLead(selectedLead)" 
                class="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                Assemble Enquiry
                <i class="mdi mdi-arrow-right text-xl"></i>
              </button>
              <button 
                v-else-if="selectedLead.converted_enquiry_id"
                @click="viewLead(selectedLead)" 
                class="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                View Converted Core
                <i class="mdi mdi-eye text-xl"></i>
              </button>
              <button 
                @click="confirmDelete(selectedLead)" 
                class="px-8 py-5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all font-black text-sm uppercase tracking-[0.2em]"
              >
                Delete
              </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="leadToDelete" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-fade-in" @click="leadToDelete = null"></div>
      <div class="relative bg-white dark:bg-[#0b0f1a] rounded-[2rem] border border-slate-200 dark:border-slate-800/80 shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in">
        <div class="p-8 text-center">
          <div class="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i class="mdi mdi-alert-circle-outline text-4xl"></i>
          </div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Decommission Lead?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium">This node will be permanently removed from the registry. This action cannot be reversed.</p>
          <div class="flex gap-4">
            <button @click="leadToDelete = null" class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
              Abort
            </button>
            <button @click="deleteLead" class="flex-1 py-4 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:scale-[1.05] active:scale-95 transition-all">
              Confirmed
            </button>
          </div>
        </div>
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
const leadFormUrl = ref(`${window.location.origin}/erp/leads/new?source=lead_management`)

const copyLink = () => {
  navigator.clipboard.writeText(leadFormUrl.value)
}

// Lead Interactivity
const selectedLead = ref<any>(null)
const leadToDelete = ref<any>(null)

const showLeadDetails = (lead: any) => {
  selectedLead.value = lead
}

const confirmDelete = (lead: any) => {
  leadToDelete.value = lead
}

const deleteLead = async () => {
  if (!leadToDelete.value) return
  
  try {
    await api.delete(`/api/clientservice/leads/${leadToDelete.value.id}`)
    leads.value = leads.value.filter(l => l.id !== leadToDelete.value.id)
    if (selectedLead.value?.id === leadToDelete.value.id) {
      selectedLead.value = null
    }
  } catch (err) {
    console.error('Failed to delete lead:', err)
  } finally {
    leadToDelete.value = null
  }
}

const fetchLeads = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/clientservice/leads')
    leads.value = response.data.data || []
  } catch (err) {
    console.error('Failed to fetch leads:', err)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'new': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'processed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'ignored': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    'archived': 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  }
  return colors[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'new': 'Unprocessed',
    'processed': 'Converted',
    'ignored': 'Rejected',
    'archived': 'Archived'
  }
  return labels[status] || status.toUpperCase()
}

const viewLead = (lead: any) => {
  if (lead.status === 'processed' && lead.converted_enquiry_id) {
    router.push(`/client-service/enquiries?id=${lead.converted_enquiry_id}`)
  } else {
    showLeadDetails(lead)
  }
}

const processLead = async (lead: any) => {
  if (lead.status === 'processed' && lead.converted_enquiry_id) {
    router.push(`/client-service/enquiries?id=${lead.converted_enquiry_id}&action=process`)
    return
  }

  // If new, convert it first
  try {
    const res = await api.post(`/api/clientservice/leads/${lead.id}/convert`)
    // After conversion, go to the enquiry
    router.push(`/client-service/enquiries?id=${res.data.enquiry.id}&action=process`)
  } catch (err) {
    console.error('Failed to convert lead:', err)
  }
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
