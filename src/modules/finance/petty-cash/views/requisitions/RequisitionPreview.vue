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

      <!-- Quote Body (High Density Document) -->
      <div class="flex-grow bg-white dark:bg-slate-950 p-2 print:p-0 print:bg-white h-auto overflow-y-auto no-scrollbar">
        <div class="requisition-content w-[99%] max-w-[99%] mx-auto bg-white border border-slate-100 rounded-sm p-6 sm:p-10 print:p-0 print:shadow-none print:max-w-none print:mx-0 print:min-h-[268mm] print:flex print:flex-col transition-all duration-700 animate-in fade-in slide-in-from-bottom-6">
          <!-- Unified Header + Requisition Info -->
          <div class="mb-4 border-2 border-slate-100 rounded-sm overflow-hidden">
            <!-- Top Brand/Title Bar -->
            <div class="flex items-center justify-between bg-blue-600 px-5 py-2">
              <div>
                <span class="text-[11px] font-black text-white/70 uppercase tracking-[0.4em]">Woodwork Green</span>
                <span class="ml-4 text-[10px] font-black text-white/50 uppercase tracking-widest">Official Payment Request</span>
              </div>
              <div class="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                REQUISITION — {{ requisition.requisition_number }}
              </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-12 divide-x divide-slate-100">

              <!-- Left: Doc Labels & Registry -->
              <div class="col-span-3 bg-slate-50 p-4 flex flex-col gap-3 justify-between">
                <div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Date</div>
                  <div class="text-[15px] font-black text-slate-950 font-technical tracking-tight">{{ formatDate(requisition.created_at) }}</div>
                </div>
                <div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Requisition #</div>
                  <div class="text-[15px] font-black text-blue-600 font-technical tracking-tight">{{ requisition.requisition_number }}</div>
                </div>
                <div v-if="requisition.department">
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Department</div>
                  <div class="text-[14px] font-black text-slate-950 italic uppercase tracking-wide">{{ requisition.department?.name || '—' }}</div>
                </div>
              </div>

              <!-- Center: Key Fields (Payee / Purpose / Project / Venue) -->
              <div class="col-span-6 p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                <!-- Payee -->
                <div class="col-span-2">
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Payee</div>
                  <div class="text-[16px] font-black uppercase text-slate-950 border-l-2 border-blue-600 pl-3">
                    <span v-if="requisition.payee">{{ requisition.payee.first_name }} {{ requisition.payee.last_name }}</span>
                    <span v-else-if="requisition.payee_name">{{ requisition.payee_name }}</span>
                    <span v-else>{{ requisition.requester?.name }}</span>
                  </div>
                </div>
                <!-- Purpose -->
                <div class="col-span-2">
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Purpose</div>
                  <div class="text-[14px] font-black italic uppercase text-slate-950 leading-snug">{{ requisition.purpose }}</div>
                </div>
                <!-- Project / Job -->
                <div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Project / Job</div>
                  <div class="text-[13px] font-black text-slate-950 uppercase">
                    <span v-if="requisition.project">
                      <span class="text-blue-600 font-technical">{{ requisition.project.enquiry?.job_number || requisition.project.project_id }}:</span>
                      {{ requisition.project.enquiry?.title || requisition.project.title }}
                    </span>
                    <span v-else-if="requisition.enquiry">
                      <span class="text-blue-600 font-technical">{{ requisition.enquiry.job_number || requisition.enquiry.enquiry_number }}:</span>
                      {{ requisition.enquiry.title }}
                    </span>
                    <span v-else class="italic text-slate-400">General Administrative</span>
                  </div>
                </div>
                <!-- Venue -->
                <div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Venue</div>
                  <div class="text-[14px] font-black uppercase text-slate-950">{{ requisition.venue || 'Karen Village HQ' }}</div>
                </div>
              </div>

              <!-- Right: Phone (if any) -->
              <div class="col-span-3 bg-slate-50 p-4 flex flex-col justify-center gap-3">
                <div v-if="requisition.payee_phone || requisition.payee?.phone || requisition.requester?.employee?.phone">
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-0.5">Phone</div>
                  <div class="text-[14px] font-black text-slate-950 font-technical tracking-widest">
                    {{ requisition.payee_phone || requisition.payee?.phone || requisition.requester?.employee?.phone }}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Distribution Table -->
          <div class="mb-6">
            <div class="border-b-2 border-blue-600 mb-3 pb-1">
              <h3 class="text-slate-950 font-black text-[16px] uppercase tracking-[0.3em]">Request Items</h3>
            </div>
            <table class="w-full text-[15px] border-collapse mt-[-2px]">
              <thead>
                <tr class="bg-white border-b-4 border-blue-600">
                  <th class="text-center py-2 px-3 font-black text-white bg-blue-600 border border-white/20 w-16 uppercase tracking-[0.1em] text-[11px]">ITEM</th>
                  <th class="text-left py-2 px-6 font-black text-white bg-blue-600 border border-white/20 uppercase tracking-[0.1em] text-[11px]">DESCRIPTION</th>
                  <th class="text-left py-2 px-6 font-black text-white bg-blue-600 border border-white/20 w-72 uppercase tracking-[0.1em] text-[11px]">RECEIVER</th>
                  <th class="text-right py-2 px-6 font-black text-white bg-blue-600 border border-white/20 w-48 uppercase tracking-[0.1em] text-[11px]">AMOUNT (KES)</th>
                </tr>
              </thead>
              <tbody class="divide-y-2 divide-slate-100 border-x-2 border-b-2 border-slate-200">
                <tr v-for="(item, idx) in requisition.items" :key="item.id || idx" class="bg-white transition-colors group">
                  <td class="py-2 px-3 text-center border-r border-slate-200 font-technical font-black text-slate-400">
                    {{ pad(Number(idx) + 1) }}
                  </td>
                  <td class="py-2 px-6 border-r border-slate-200">
                    <div class="font-black text-slate-950 uppercase leading-tight group-hover:translate-x-1 transition-transform">
                      {{ item.description }}
                    </div>
                    <div v-if="item.remarks" class="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest flex items-center gap-1.5">
                      Task: {{ item.remarks }}
                    </div>
                  </td>
                  <td class="py-2 px-6 border-r border-slate-200">
                    <div class="font-black text-slate-950 uppercase tracking-tight text-[15px]">
                      {{ item.payee_name || (item.payee?.first_name ? `${item.payee.first_name} ${item.payee.last_name}` : (requisition.payee_name || requisition.requester?.name)) }}
                    </div>
                    <div class="text-[10px] text-slate-400 font-black flex items-center gap-1 mt-1">
                      {{ item.payee_phone || (item.payee?.phone) || (requisition.payee_phone || requisition.payee?.phone || requisition.requester?.employee?.phone || '-') }}
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right font-black text-slate-950 tabular-nums text-[16px] tracking-tighter bg-white font-technical">
                    {{ formatCurrency(item.amount) }}
                    <div v-if="item.received_at" class="flex items-center justify-end gap-1 text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-1">
                       <i class="mdi mdi-check-all"></i>
                       Confirmed
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <!-- Subtotal / Total Style -->
                <tr class="border-t-4 border-blue-600">
                  <td colspan="2" class="border-r border-slate-200 bg-white"></td>
                  <td class="py-4 px-6 font-black text-slate-950 border-r border-slate-200 bg-white uppercase tracking-[0.3em] text-[11px] text-right">Total Amount</td>
                  <td class="py-4 px-6 text-right font-black text-white bg-blue-600 text-3xl tabular-nums tracking-tighter shadow-xl font-technical">
                    {{ formatReceiptAmount(requisition.total_amount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Sticky Bottom Section (Verification & Registry) -->
          <div class="mt-auto pt-4 border-t-2 border-slate-100">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Audit Registry (Left & Center) -->
              <div class="md:col-span-2">
                <div class="bg-blue-600 text-white px-3 py-1.5 font-black text-[11px] uppercase tracking-[0.3em] mb-4 inline-block rounded-sm shadow-md shadow-blue-600/20">
                  APPROVAL PATH
                </div>
                
                <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-[12px] leading-tight">
                  <div>
                    <h4 class="font-black text-slate-950 border-b border-slate-200 mb-2 pb-1 uppercase tracking-tighter text-[13px]">01. Authorization</h4>
                    <ul class="space-y-3">
                      <li class="flex justify-between items-center text-slate-500 font-black uppercase">
                        <span>Originator:</span>
                        <span class="text-slate-950 underline decoration-slate-200 font-black">{{ requisition.requester?.name }}</span>
                      </li>
                      <li v-if="requisition.approved_at" class="flex justify-between items-center text-slate-500 font-black uppercase">
                        <span>Authorized:</span>
                        <span class="text-slate-950 underline decoration-slate-200 font-black">{{ requisition.approver?.name || 'Board review' }}</span>
                      </li>
                      <li v-if="requisition.disbursement" class="flex justify-between items-center text-slate-500 font-black uppercase">
                        <span>Disbursed:</span>
                        <span class="text-slate-950 font-mono font-black italic">{{ formatDate(requisition.disbursement.created_at) }}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 class="font-black text-slate-950 border-b-2 border-slate-200 mb-3 pb-2 uppercase tracking-tighter text-[15px]">02. Registry Audit</h4>
                    <ul class="space-y-3">
                      <li class="flex justify-between items-center text-slate-500 font-black uppercase">
                        <span>Registry ID:</span>
                        <span class="text-slate-950 font-technical font-black">#{{ requisition.id }}</span>
                      </li>
                      <li v-if="requisition.disbursement" class="flex justify-between items-center text-slate-500 font-black uppercase">
                        <span>TXN Path:</span>
                        <span class="text-blue-600 font-technical font-black text-[14px]">{{ requisition.disbursement.transaction_code }}</span>
                      </li>
                      <li v-if="requisition.received_at" class="flex justify-between items-center text-slate-500 font-black uppercase">
                        <span>Status:</span>
                        <span class="text-emerald-600 font-black italic">FINALIZED & SIGNED</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Digital Affidavit (Right Column) -->
              <div class="border-l border-slate-100 pl-10 flex flex-col justify-end">
                <div v-if="requisition.digital_signature" class="bg-slate-950 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                  <div class="absolute -right-10 -bottom-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <h5 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 relative z-10 border-b border-white/10 pb-2">Verification Seal</h5>
                  <img :src="requisition.digital_signature" alt="SIG" class="max-h-20 grayscale invert brightness-200 relative z-10 mb-4 drop-shadow-[0_10px_15px_rgba(255,255,255,0.1)]" />
                  <p class="text-[13px] font-black text-white uppercase tracking-widest relative z-10">{{ requisition.received_by || requisition.authenticated_user?.name }}</p>
                  <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-70 relative z-10 font-mono">{{ formatReceiptDateTime(requisition.received_at) }}</p>
                </div>
                
                <div v-else-if="requisition.status === 'disbursed'" class="p-6 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Entry Portal</span>
                  <div class="p-3 bg-white rounded-xl border border-slate-100">
                    <QrcodeVue :value="publicSignOffUrl" :size="70" />
                  </div>
                  <button @click="copyToClipboard" class="text-[8px] font-black text-blue-600 uppercase tracking-widest hover:underline mt-4">
                    {{ copied ? 'Link Copied' : 'Copy Verification Link' }}
                  </button>
                </div>

                <div v-else class="flex items-end justify-center py-6">
                   <div class="text-[10px] text-slate-300 italic uppercase font-black tracking-[0.3em] font-mono">WOODWORK GREEN OFFICIAL</div>
                </div>
              </div>
            </div>

            <!-- Final Footer Strip -->
            <div class="flex items-center justify-between text-[8px] text-slate-400 pt-4 border-t border-slate-100 mt-4">
              <div class="flex gap-4">
                <span class="font-black text-slate-600 uppercase tracking-[0.2em]">Woodwork Green Ltd</span>
                <span class="flex items-center gap-1 font-bold"><i class="mdi mdi-phone text-slate-300"></i> +254 780 397 798</span>
                <span class="flex items-center gap-1 font-bold"><i class="mdi mdi-email text-slate-300"></i> admin@woodworkgreen.co.ke</span>
              </div>
              <div class="text-right font-bold uppercase tracking-widest text-slate-300">
                Karen Village, Ngong Road, Nairobi | www.woodworkgreen.co.ke
              </div>
            </div>
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
  }) + ' ' + d.toLocaleTimeString('en-GB', {
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
    case 'pending': return 'bg-amber-500/10 border-amber-500/20 text-amber-500'
    case 'approved': return 'bg-blue-500/10 border-blue-500/20 text-blue-500'
    case 'rejected': return 'bg-red-500/10 border-red-500/20 text-red-500'
    case 'disbursed': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
    case 'received': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
    default: return 'bg-slate-500/10 border-slate-500/20 text-slate-500'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Lato:wght@400;700;900&family=Open+Sans:wght@400;600;700;800&family=Roboto:wght@400;500;700;900&display=swap');

* {
  font-family: 'Roboto', 'Open Sans', 'Lato', sans-serif;
}

.font-technical {
  font-family: 'IBM Plex Sans', sans-serif;
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
