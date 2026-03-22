<template>
  <div v-if="!requisition?.id" class="h-full flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900/30">
    <div class="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center text-slate-200 dark:text-slate-600 mb-6 border border-slate-100 dark:border-slate-700 animate-pulse">
      <i class="mdi mdi-text-box-search-outline text-4xl opacity-20"></i>
    </div>
    <h3 class="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">Select Record</h3>
    <p class="text-slate-500 dark:text-slate-400 mt-2 text-[11px] font-bold uppercase tracking-widest max-w-xs leading-relaxed opacity-60">Pending selection from requisition registry</p>
  </div>

  <transition name="document-fade" appear>
    <div v-if="requisition?.id" class="h-full flex flex-col bg-white dark:bg-slate-950 font-technical leading-normal tracking-tight antialiased">
      
      <!-- Premium Header (Sticky Action Hub) -->
      <div v-if="canManage" class="sticky top-0 z-30 px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md print:hidden transition-all shadow-sm">
        <div class="flex items-center space-x-5">
           <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-file-document-outline text-blue-600 dark:text-blue-400 text-2xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight uppercase">Requisition Registry</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold uppercase tracking-widest">Validating internal disbursement flows</p>
          </div>
        </div>

        <!-- Master Action Hub -->
        <div class="flex items-center gap-4">
          <!-- View Toggle / Grouping -->
          <div class="hidden sm:flex items-center bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400">
               <i class="mdi mdi-file-eye-outline text-lg"></i>
               <span>Official View</span>
            </div>
          </div>

          <!-- Action Buttons Group -->
          <div class="flex items-center gap-3">
            <!-- Download / Print -->
            <button
              @click="downloadVoucher"
              :disabled="downloading"
              class="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl shadow-xl shadow-slate-950/10 hover:shadow-slate-950/20 hover:scale-105 active:scale-95 transition-all duration-300 font-black text-[10px] uppercase tracking-widest border border-slate-800 dark:border-white"
            >
              <i class="mdi text-lg" :class="downloading ? 'mdi-loading mdi-spin' : 'mdi-printer'"></i>
              <span class="whitespace-nowrap">{{ downloading ? 'Generating...' : 'Print Voucher' }}</span>
            </button>

            <!-- Edit Interaction -->
            <button
              @click="$emit('edit', requisition)"
              class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 font-black text-[10px] uppercase tracking-widest group"
            >
              <i class="mdi mdi-file-edit-outline text-lg group-hover:rotate-12 transition-transform"></i>
              <span>Amend</span>
            </button>

            <!-- Status Actions -->
            <div class="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <template v-if="requisition.status === 'pending'">
              <button
                @click="$emit('approve', requisition)"
                class="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <i class="mdi mdi-check-decagram text-lg"></i>
                <span>Approve</span>
              </button>
              <button
                @click="$emit('reject', requisition)"
                class="flex items-center justify-center w-11 h-11 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-all"
              >
                <i class="mdi mdi-close-octagon-outline text-xl"></i>
              </button>
            </template>

            <button
              v-if="requisition.status === 'approved'"
              @click="$emit('disburse', requisition)"
              class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <i class="mdi mdi-cash-multiple text-lg"></i>
              <span>Authorize Funds</span>
            </button>

            <!-- Void -->
            <button
              @click="$emit('delete', requisition)"
              class="group flex items-center justify-center w-11 h-11 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-300"
              title="Void Registry Entry"
            >
              <i class="mdi mdi-trash-can-outline text-xl transform group-hover:scale-110 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Document Body (Simplified) -->
      <div class="flex-grow bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 print:p-0 print:bg-white h-auto overflow-y-auto no-scrollbar relative">

        <div class="requisition-content w-full max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 print:p-0 shadow-sm relative z-10 transition-all">
          
          <!-- Cleaner Header -->
          <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <i class="mdi mdi-file-document-check text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Requisition Voucher</h1>
                <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Reference: {{ requisition.requisition_number }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <span 
                class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                :class="getStatusContextClass(requisition.status)"
              >
                {{ requisition.status === 'disbursed' ? 'Settle/Paid' : requisition.status }}
              </span>
              <div class="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
              <div class="text-right hidden md:block">
                <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">ID Registry</div>
                <div class="text-[15px] font-black text-slate-900 dark:text-white font-technical mt-1.5">#{{ requisition.id }}</div>
              </div>
            </div>
          </div>

          <!-- Simplified Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <!-- Source Details -->
            <div class="space-y-6">
              <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <h4 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">Transaction Context</h4>
                <div class="space-y-4">
                  <div class="flex justify-between items-center text-[13px]">
                    <span class="font-semibold text-slate-500 uppercase">Beneficiary</span>
                    <span class="font-bold text-slate-900 dark:text-white uppercase truncate ml-4">
                      {{ requisition.payee?.first_name ? `${requisition.payee.first_name} ${requisition.payee.last_name}` : (requisition.payee_name || requisition.requester?.name || '-') }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center text-[13px]">
                    <span class="font-semibold text-slate-500 uppercase">Contact</span>
                    <span class="font-bold text-blue-600 font-technical tracking-widest">
                      {{ requisition.payee_phone || requisition.payee?.phone || requisition.requester_phone || requisition.requester?.employee?.phone || 'N/A' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center text-[13px]">
                    <span class="font-semibold text-slate-500 uppercase">Issue Date</span>
                    <span class="font-bold text-slate-900 dark:text-white font-technical">{{ formatDate(requisition.created_at) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-[13px]">
                    <span class="font-semibold text-slate-500 uppercase">Project / Job</span>
                    <span class="font-bold text-slate-900 dark:text-white uppercase truncate ml-4">
                      <template v-if="requisition.project">
                        {{ requisition.project.project_id }} — {{ requisition.project.enquiry?.title || requisition.project.title }}
                      </template>
                      <template v-else-if="requisition.enquiry">
                        #{{ requisition.enquiry.enquiry_number }} — {{ requisition.enquiry.title }}
                      </template>
                      <template v-else>
                        {{ requisition.project_name || 'General Context' }}
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantitative Details -->
            <div class="space-y-6">
                <div class="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/30">
                  <h4 class="text-[11px] font-bold text-blue-100 uppercase tracking-widest mb-4">Total Allocation</h4>
                  <div class="text-5xl font-black font-technical tracking-tighter tabular-nums mb-3">
                    {{ formatCurrency(requisition.total_amount) }}
                  </div>
                  <div class="flex items-center gap-2 text-[11px] font-semibold text-blue-200 uppercase tracking-widest">
                     <i class="mdi mdi-shield-check"></i>
                     <span>Secured Financial Record</span>
                  </div>
               </div>
               
               <div class="px-7 py-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50 shadow-sm">
                  <span class="text-[12px] font-semibold text-slate-600 dark:text-slate-300 italic">"{{ requisition.purpose }}"</span>
                  <i class="mdi mdi-format-quote-close text-slate-200 text-3xl"></i>
               </div>
            </div>
          </div>

          <!-- Cleaner Validation Ledger -->
          <div class="mb-10">
            <h3 class="text-slate-900 dark:text-white font-black text-[13px] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
               <i class="mdi mdi-shield-check-outline text-blue-600 text-lg"></i>
               Verification Registry
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Step 1 -->
              <div class="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">1</div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiated</span>
                </div>
                <div class="text-[13px] font-black text-slate-900 dark:text-white uppercase">{{ requisition.requester?.name || requisition.requester_name }}</div>
                <div class="text-[9px] font-bold text-slate-400 uppercase mt-1">{{ formatDate(requisition.created_at) }}</div>
              </div>

              <!-- Step 2 -->
              <div class="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">2</div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved</span>
                </div>
                <div v-if="requisition.approved_at">
                  <div class="text-[13px] font-black text-slate-900 dark:text-white uppercase">{{ requisition.approver?.name || 'Authorized' }}</div>
                  <div class="text-[9px] font-bold text-slate-400 uppercase mt-1">{{ formatDate(requisition.approved_at) }}</div>
                </div>
                <div v-else class="text-[11px] font-black text-slate-300 uppercase italic">Pending Review</div>
              </div>

              <!-- Step 3 -->
              <div class="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">3</div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Released</span>
                </div>
                <div v-if="requisition.disbursement">
                  <div class="text-[13px] font-black text-emerald-600 uppercase">Funds Disbursed</div>
                  <div class="text-[9px] font-black text-slate-400 font-technical mt-1 tracking-widest">{{ requisition.disbursement.transaction_code }}</div>
                </div>
                <div v-else class="text-[11px] font-black text-slate-300 uppercase italic">Awaiting Release</div>
              </div>
            </div>
          </div>

          <!-- Legacy Audit trail removed in favor of Ledger above -->


            <!-- Registry Metadata & Validation Seal -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 border-t border-slate-100 pt-8">
              <div class="md:col-span-5 p-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">Official Tracking Seal</div>
                  <div class="flex items-center gap-7">
                      <QrcodeVue :value="publicSignOffUrl" :size="90" background="#f8fafc" foreground="#0f172a" level="H" class="rounded-xl shadow-md" />
                      <div>
                        <div class="text-[12px] font-black text-slate-900 dark:text-white uppercase leading-tight mb-3">VALIDATED BY WOODWORK GREEN AUDIT ENGINE</div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">REF# {{ requisition.requisition_number }}</div>
                        <button @click="copyToClipboard" class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                           {{ copied ? 'Reference Copied' : 'Copy Seal Link' }}
                        </button>
                      </div>
                  </div>
              </div>

              <div class="md:col-span-7 flex flex-col justify-center">
                  <div class="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 italic">Integrity Statement</div>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold uppercase tracking-tight">
                    This document is a system-generated financial record. All disbursements are tracked against internal task codes and project Job Numbers. Digitally authorized via secure financial gate.
                  </p>
                  <div class="mt-4 flex items-center gap-4 grayscale opacity-40">
                      <div class="h-8 w-8 bg-slate-900 dark:bg-white rounded-full"></div>
                      <div class="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
              </div>
          </div>
        </div>

            <!-- Final Footer Strip -->
            <div class="flex items-center justify-between text-[10px] text-slate-500 pt-5 border-t border-slate-100/60 mt-8">
              <div class="flex items-center gap-6">
                <span class="font-bold text-slate-900 uppercase tracking-widest leading-none">Woodwork Green Ltd</span>
                <div class="flex items-center gap-4 border-l border-slate-200 pl-6 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                   <span class="flex items-center gap-1"><i class="mdi mdi-phone text-slate-300"></i> +254 780 397 798</span>
                   <span class="flex items-center gap-1"><i class="mdi mdi-web text-slate-300"></i> woodworkgreen.co.ke</span>
                </div>
              </div>
              <div class="text-right font-bold uppercase tracking-widest text-slate-400">
                Official Validation Registry Hub — v2.0
              </div>
          </div>
        </div>
      </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import logoImage from '@/assets/wng-logo.png'
import axios from '@/plugins/axios'
import { useToast } from '@/modules/universal-task/composables/useToast'

const toast = useToast()
const downloading = ref(false)

const downloadVoucher = async () => {
  if (!props.requisition?.id) return
  
  downloading.value = true
  try {
    const response = await axios.get(`/api/finance/petty-cash/requisitions/${props.requisition.id}/voucher`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Voucher-${props.requisition.requisition_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Voucher download started')
  } catch (error) {
    console.error('Download failed', error)
    toast.error('Failed to download voucher')
  } finally {
    downloading.value = false
  }
}

const props = defineProps<{
  requisition: any
  canManage: boolean
}>()

defineEmits(['approve', 'reject', 'disburse', 'edit', 'delete'])

const publicSignOffUrl = computed(() => {
  if (!props.requisition?.signing_token) return ''
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL
  return `${window.location.origin}${base}/pcr/confirm/${props.requisition.signing_token}`
})

const copied = ref(false)

const copyToClipboard = async () => {
  if (!publicSignOffUrl.value) return
  
  try {
    await navigator.clipboard.writeText(publicSignOffUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}

const formatReceiptAmount = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(amount)
}

const formatReceiptDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase()
}

const formatReceiptDateTime = (date: string) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }) + ' ' + formatTime(date)
}

const formatTime = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const pad = (n: number) => n < 10 ? `0${n}` : n

const getStatusTextStyle = (status: string) => {
  switch (status) {
    case 'pending': return 'text-amber-600'
    case 'approved': return 'text-blue-600'
    case 'rejected': return 'text-red-600'
    case 'disbursed': return 'text-slate-900'
    case 'received': return 'text-emerald-600'
    default: return 'text-slate-500'
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusContextClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-500/10 border-amber-500/20 text-amber-600'
    case 'approved': return 'bg-blue-500/10 border-blue-500/20 text-blue-600'
    case 'rejected': return 'bg-red-500/10 border-red-500/20 text-red-600'
    case 'disbursed': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
    case 'received': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
    default: return 'bg-slate-500/10 border-slate-500/20 text-slate-500'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-technical {
  font-family: 'IBM Plex Sans', sans-serif;
  letter-spacing: -0.02em;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Document Entry Animation */
.document-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.document-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
</style>
