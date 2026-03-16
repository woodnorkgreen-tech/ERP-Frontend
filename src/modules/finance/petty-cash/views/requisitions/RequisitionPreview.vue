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
          <div class="mb-5 border-2 border-slate-100 rounded-sm overflow-hidden shadow-sm">
            <!-- Top Brand/Title Bar -->
            <div class="flex items-center justify-between bg-slate-900 px-6 py-3">
              <div class="flex items-center gap-3">
                <div class="h-6 w-1 bg-blue-500"></div>
                <div>
                  <span class="text-[12px] font-black text-white uppercase tracking-[0.3em]">Woodwork Green</span>
                  <span class="ml-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] border-l border-slate-700 pl-4">Registry ID: #{{ requisition.id }}</span>
                </div>
              </div>
              <div class="text-[12px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <i class="mdi mdi-certificate text-blue-400"></i>
                REQUISITION — {{ requisition.requisition_number }}
              </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-12 divide-x divide-slate-100">

              <!-- Left: Doc Labels & Registry -->
              <div class="col-span-3 bg-slate-50/50 p-5 flex flex-col gap-4">
                <div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Issue Date</div>
                  <div class="text-[14px] font-black text-slate-900 font-technical">{{ formatDate(requisition.created_at) }}</div>
                </div>
                <div>
                  <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Accounting Dept</div>
                  <div class="text-[12px] font-black text-slate-700 uppercase tracking-wide">{{ requisition.department?.name || 'Unassigned' }}</div>
                </div>
                <div class="pt-2 border-t border-slate-200/60">
                   <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Originator</div>
                   <div class="text-[12px] font-black text-blue-600 uppercase">{{ requisition.requester?.name || requisition.requester_name || 'System' }}</div>
                </div>
              </div>

              <!-- Center/Right Area: Primary Context -->
              <div class="col-span-9 p-0 divide-y divide-slate-100">
                <!-- Row 1: Payee & Purpose -->
                <div class="grid grid-cols-12 divide-x divide-slate-100 h-full">
                  <div class="col-span-5 p-5">
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Primary Payee / Recipient</div>
                    <div class="text-[16px] font-black uppercase text-slate-900 flex items-center gap-2">
                      <i class="mdi mdi-account-circle text-slate-300"></i>
                      <span v-if="requisition.payee">{{ requisition.payee.first_name }} {{ requisition.payee.last_name }}</span>
                      <span v-else-if="requisition.payee_name">{{ requisition.payee_name }}</span>
                      <span v-else>{{ requisition.requester_name || 'Individual' }}</span>
                    </div>
                    <div v-if="requisition.payee_phone || requisition.payee?.phone || requisition.requester_phone" class="text-[11px] font-black text-blue-500 font-technical mt-1 ml-6">
                      {{ requisition.payee_phone || requisition.payee?.phone || requisition.requester_phone }}
                    </div>
                  </div>
                  <div class="col-span-7 p-5 bg-blue-50/20">
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">General Purpose</div>
                    <div class="text-[13px] font-black uppercase text-slate-800 leading-snug italic line-clamp-2">"{{ requisition.purpose }}"</div>
                  </div>
                </div>

                <!-- Row 2: Project & Venue -->
                <div class="grid grid-cols-12 divide-x divide-slate-100">
                  <div class="col-span-7 p-5">
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Associated Project / Job</div>
                    <div class="flex items-start gap-2">
                      <div class="p-1 px-2 bg-slate-900 text-white text-[10px] font-black rounded font-technical mt-0.5 whitespace-nowrap">
                        {{ requisition.project?.enquiry?.job_number || requisition.enquiry?.job_number || 'GEN' }}
                      </div>
                      <div class="text-[13px] font-black text-slate-900 uppercase leading-snug">
                        <span v-if="requisition.project">
                          {{ requisition.project.enquiry?.title || requisition.project.title }}
                        </span>
                        <span v-else-if="requisition.enquiry">
                          {{ requisition.enquiry.title }}
                        </span>
                        <span v-else class="text-slate-400 italic">None (General Office Expenses)</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-span-5 p-5">
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Dispatch / Venue</div>
                    <div class="text-[13px] font-black uppercase text-slate-900 flex items-center gap-2">
                       <i class="mdi mdi-map-marker text-red-400"></i>
                       {{ requisition.venue || 'Woodwork Green HQ' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Distribution Table -->
          <div class="mb-6">
            <div class="border-b-2 border-slate-900 mb-4 pb-2 flex items-center justify-between">
              <h3 class="text-slate-950 font-black text-[14px] uppercase tracking-[0.4em]">Resource Distribution Registry</h3>
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Values in KES</div>
            </div>
            <table class="w-full text-[14px] border-collapse">
              <thead>
                <tr class="bg-slate-50 border-y border-slate-200">
                  <th class="text-center py-3 px-4 font-black text-slate-400 w-12 uppercase tracking-widest text-[9px]">#</th>
                  <th class="text-left py-3 px-6 font-black text-slate-900 uppercase tracking-widest text-[10px]">Description of Item / Service</th>
                  <th class="text-left py-3 px-6 font-black text-slate-900 uppercase tracking-widest text-[10px]">Beneficiary / Receiver</th>
                  <th class="text-right py-3 px-6 font-black text-slate-900 uppercase tracking-widest text-[10px] w-48">Allocated Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 border-b border-slate-200">
                <tr v-for="(item, idx) in requisition.items" :key="item.id || idx" class="bg-white hover:bg-slate-50/30 transition-colors group">
                  <td class="py-4 px-4 text-center font-technical font-black text-slate-300 text-[12px]">
                    {{ pad(Number(idx) + 1) }}
                  </td>
                  <td class="py-4 px-6">
                    <div class="font-black text-slate-900 uppercase leading-tight tracking-tight">
                      {{ item.description }}
                    </div>
                  </td>
                  <td class="py-4 px-6 border-x border-slate-100/50">
                    <div class="flex items-center gap-2">
                       <i class="mdi" :class="String(item.payee_name || '').includes('Tech Labour') ? 'mdi-hammer-wrench text-amber-500' : 'mdi-account-tie text-blue-500'"></i>
                       <div class="font-black text-slate-950 uppercase tracking-tight text-[13px]">
                         {{ item.payee_name || (item.payee?.first_name ? `${item.payee.first_name} ${item.payee.last_name}` : (requisition.payee_name || requisition.requester?.name)) }}
                       </div>
                    </div>
                    <div class="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1.5 ml-6">
                      <i class="mdi mdi-phone-outline text-[9px]"></i>
                      {{ item.payee_phone || (item.payee?.phone) || (requisition.payee_phone || requisition.payee?.phone || requisition.requester?.employee?.phone || '-') }}
                    </div>
                  </td>
                  <td class="py-4 px-6 text-right font-black text-slate-950 tabular-nums text-[15px] bg-slate-50/30 font-technical">
                    {{ formatCurrency(item.amount) }}
                    <div v-if="item.received_at" class="flex items-center justify-end gap-1 text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-1">
                       <i class="mdi mdi-check-decagram text-[10px]"></i>
                       Verified
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <!-- Total Style -->
                <tr class="bg-slate-900 text-white">
                  <td colspan="2" class="py-6 px-6">
                    <div class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Authorization Registry Summary</div>
                  </td>
                  <td class="py-6 px-6 font-black border-l border-white/10 uppercase tracking-[0.2em] text-[10px] text-right">Aggregate Total</td>
                  <td class="py-6 px-6 text-right font-black text-blue-400 text-2xl tabular-nums tracking-tighter font-technical">
                    {{ formatReceiptAmount(requisition.total_amount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Validation Hub (Verification & Registry) -->
          <div class="mt-8 pt-6 border-t border-slate-200">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
              <!-- Approval Path (Nodes) -->
              <div class="md:col-span-7">
                <div class="flex items-center gap-2 mb-4">
                   <div class="h-4 w-1 bg-emerald-500"></div>
                   <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Mandatory Approval Sequence</h4>
                </div>
                
                <div class="space-y-4">
                  <!-- Node: Origin -->
                  <div class="flex items-start gap-4">
                    <div class="mt-1 flex flex-col items-center">
                      <div class="w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-white"></div>
                      <div class="w-0.5 h-10 bg-slate-100"></div>
                    </div>
                    <div>
                      <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">01. Origin/Request</div>
                      <div class="text-[13px] font-black text-slate-900 flex items-center gap-2 uppercase">
                        {{ requisition.is_public ? (requisition.requester_name || 'Public Guest') : requisition.requester?.name }}
                        <span v-if="requisition.is_public" class="text-[8px] px-1.5 py-0.5 bg-purple-600 text-white rounded font-black tracking-tighter">PUBLIC</span>
                      </div>
                      <div class="text-[10px] text-slate-500 font-technical italic">{{ formatDate(requisition.created_at) }}</div>
                    </div>
                  </div>

                  <!-- Node: Authorization -->
                  <div class="flex items-start gap-4">
                    <div class="mt-1 flex flex-col items-center">
                      <div class="w-2.5 h-2.5 rounded-full border-2" :class="requisition.approved_at ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'"></div>
                      <div class="w-0.5 h-10 bg-slate-100"></div>
                    </div>
                    <div>
                      <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">02. Authorization</div>
                      <div v-if="requisition.approved_at" class="text-[13px] font-black text-slate-900 uppercase">
                        {{ requisition.approver?.name || 'Authorized Official' }}
                      </div>
                      <div v-else class="text-[13px] font-black text-slate-300 uppercase italic">Pending Finance Review</div>
                      <div v-if="requisition.approved_at" class="text-[10px] text-slate-500 font-technical italic">{{ formatDate(requisition.approved_at) }}</div>
                    </div>
                  </div>

                  <!-- Node: Disbursement -->
                  <div class="flex items-start gap-4">
                    <div class="mt-1">
                      <div class="w-2.5 h-2.5 rounded-full border-2" :class="requisition.disbursement ? 'border-slate-900 bg-slate-900' : 'border-slate-200 bg-white'"></div>
                    </div>
                    <div>
                      <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">03. Fund Distribution</div>
                      <div v-if="requisition.disbursement" class="text-[13px] font-black text-blue-600 uppercase flex items-center gap-2">
                        <i class="mdi mdi-check-circle"></i> Funds Released
                      </div>
                      <div v-else class="text-[13px] font-black text-slate-200 uppercase italic">Awaiting Authorization</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Registry Audit (Card) -->
              <div class="md:col-span-5 flex flex-col">
                <div class="bg-slate-50 p-6 rounded-sm border border-slate-100 flex-grow relative overflow-hidden">
                   <div class="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                      <i class="mdi mdi-database-check text-9xl"></i>
                   </div>
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-200 pb-2">Registry Metadata</h4>
                   
                   <div class="space-y-4 relative z-10">
                      <div class="flex justify-between items-end border-b border-dashed border-slate-200 pb-2">
                         <span class="text-[9px] font-black text-slate-400 uppercase">Registry Reference</span>
                         <span class="text-[13px] font-black text-slate-900 font-technical uppercase">REF#{{ requisition.id }}</span>
                      </div>
                      <div v-if="requisition.disbursement" class="flex justify-between items-end border-b border-dashed border-slate-200 pb-2">
                         <span class="text-[9px] font-black text-slate-400 uppercase">Transaction Path</span>
                         <span class="text-[13px] font-black text-slate-900 font-technical uppercase italic">{{ requisition.disbursement.transaction_code }}</span>
                      </div>
                      <div class="flex justify-between items-end border-b border-dashed border-slate-200 pb-2">
                         <span class="text-[9px] font-black text-slate-400 uppercase">Flow Integrity</span>
                         <span class="text-[10px] font-black px-2 py-0.5 rounded" :class="getStatusContextClass(requisition.status)">
                            {{ requisition.status.toUpperCase() }}
                         </span>
                      </div>
                      <div v-if="requisition.received_at" class="flex justify-between items-end">
                         <span class="text-[9px] font-black text-slate-400 uppercase">Final Receipt</span>
                         <span class="text-[12px] font-black text-emerald-600 uppercase italic tracking-tighter">AUTHENTICATED HUB ENTRY</span>
                      </div>
                   </div>

                   <!-- Signature Seal (If exists) -->
                   <div v-if="requisition.digital_signature" class="mt-6 pt-4 border-t-2 border-slate-900">
                      <div class="flex items-center gap-4">
                         <img :src="requisition.digital_signature" alt="SIG" class="h-10 grayscale brightness-0 opacity-80" />
                         <div>
                            <div class="text-[11px] font-black text-slate-900 uppercase tracking-tight">{{ requisition.received_by || 'Confirmed Recipient' }}</div>
                            <div class="text-[9px] font-bold text-slate-400 font-mono">{{ formatReceiptDateTime(requisition.received_at) }}</div>
                         </div>
                      </div>
                   </div>

                   <div v-else-if="requisition.status === 'disbursed'" class="mt-6 p-3 bg-white border border-dashed border-slate-300 rounded flex items-center justify-between">
                      <QrcodeVue :value="publicSignOffUrl" :size="40" />
                      <div class="text-right">
                         <div class="text-[8px] font-black text-slate-400 uppercase mb-1">Verify Acceptance</div>
                         <button @click="copyToClipboard" class="text-[9px] font-black text-blue-600 uppercase hover:underline">
                            {{ copied ? 'Link Copied' : 'Copy Seal Link' }}
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

            <!-- Final Footer Strip -->
            <div class="flex items-center justify-between text-[9px] text-slate-400 pt-5 border-t border-slate-100/60 mt-8">
              <div class="flex items-center gap-6">
                <span class="font-black text-slate-900 uppercase tracking-[0.2em]">Woodwork Green Ltd</span>
                <div class="flex items-center gap-4 border-l border-slate-200 pl-6 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                   <span class="flex items-center gap-1"><i class="mdi mdi-phone text-slate-300"></i> +254 780 397 798</span>
                   <span class="flex items-center gap-1"><i class="mdi mdi-web text-slate-300"></i> woodworkgreen.co.ke</span>
                </div>
              </div>
              <div class="text-right font-black uppercase tracking-[0.2em] text-slate-400">
                Official Validation Registry Hub — v2.0
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
