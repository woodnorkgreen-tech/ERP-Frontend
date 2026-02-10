<template>
  <div v-if="!requisition?.id" class="h-full flex flex-col items-center justify-center p-12 text-center">
    <div class="w-20 h-20 bg-slate-100 rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-6">
      <i class="mdi mdi-receipt-text-outline text-5xl opacity-20"></i>
    </div>
    <h3 class="text-lg font-black text-slate-700 uppercase tracking-tight">Select a Requisition</h3>
    <p class="text-slate-500 mt-2 text-sm font-medium max-w-xs">Click on any request to view the receipt</p>
  </div>

  <transition name="receipt-fade" appear>
    <div v-if="requisition?.id" class="h-full overflow-y-auto no-scrollbar pb-12 px-4">
      <!-- Action Buttons (Outside Receipt) -->
      <div v-if="canManage" class="flex flex-wrap items-center justify-center gap-3 mb-6 sticky top-0 z-10 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
        <!-- Edit & Delete Actions (Available for pending/approved/disbursed) -->
        <div class="flex gap-2 mr-auto" v-if="['pending', 'approved', 'disbursed'].includes(requisition.status)">
           <button
            @click="$emit('edit', requisition)"
            class="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
            title="Edit Requisition"
          >
            <i class="mdi mdi-pencil text-lg"></i>
          </button>
           <button
            @click="$emit('delete', requisition)"
            class="p-2.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
            title="Delete Requisition"
          >
            <i class="mdi mdi-trash-can-outline text-lg"></i>
          </button>
        </div>

        <template v-if="requisition.status === 'pending'">
          <button
            @click="$emit('reject', requisition)"
            class="px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            <i class="mdi mdi-close-circle-outline mr-1"></i> Reject
          </button>
          <button
            @click="$emit('approve', requisition)"
            class="px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <i class="mdi mdi-check-circle-outline mr-1"></i> Approve
          </button>
        </template>
        
        <button
          v-if="requisition.status === 'approved'"
          @click="$emit('disburse', requisition)"
          class="px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <i class="mdi mdi-cash-register mr-1"></i> Disburse Now
        </button>
      </div>

      <!-- Receipt Container -->
      <div class="max-w-xl mx-auto bg-white shadow-2xl relative" style="font-family: 'Courier New', monospace;">
        <!-- Receipt Paper Effect -->
        <div class="relative bg-white" style="background: linear-gradient(to bottom, #ffffff 0%, #f8f8f8 100%);">
          <!-- Perforated Top Edge -->
          <div class="h-3 bg-repeat-x" style="background-image: repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 8px, transparent 8px, transparent 16px);"></div>
          
          <div class="px-8 pt-8 pb-6 text-center border-b-2 border-dashed border-slate-300">
            <div class="flex items-center justify-center gap-4 mb-4">
              <img src="/logo-outline.png" alt="WNG" class="h-10 object-contain" />
              <div class="h-8 w-px bg-slate-200"></div>
              <div class="text-left">
                <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 leading-none">Woodnork Green</h2>
                <p class="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">KRA PIN: P051451468C</p>
              </div>
            </div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight mb-1 uppercase">Petty Cash Voucher</h1>
            <p class="text-xs text-slate-600 font-bold tracking-widest">{{ requisition.requisition_number }}</p>
            <div class="mt-4">
              <span :class="getStatusClass(requisition.status)" class="inline-block px-4 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
                {{ requisition.status }}
              </span>
            </div>
          </div>

          <!-- Receipt Body -->
          <div class="px-8 py-6 space-y-4">
            <!-- Date & Time -->
            <div class="flex justify-between text-xs border-b border-dashed border-slate-200 pb-3">
              <span class="font-bold text-slate-500 uppercase tracking-widest">Date:</span>
              <span class="font-black text-slate-900 tabular-nums">{{ formatReceiptDate(requisition.created_at) }}</span>
            </div>

            <!-- Payee Info -->
            <div class="space-y-2 border-b border-dashed border-slate-200 pb-3">
              <div class="flex justify-between text-xs">
                <span class="font-bold text-slate-500 uppercase tracking-widest">Payee:</span>
                <span class="font-black text-slate-900 text-right max-w-[60%] truncate">
                  <span v-if="requisition.payee">{{ requisition.payee.first_name }} {{ requisition.payee.last_name }}</span>
                  <span v-else-if="requisition.payee_name">{{ requisition.payee_name }}</span>
                  <span v-else>{{ requisition.requester?.name || 'Self' }}</span>
                </span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="font-bold text-slate-500 uppercase tracking-widest">Dept:</span>
                <span class="font-black text-slate-900 uppercase tracking-tighter">{{ requisition.department?.name || 'N/A' }}</span>
              </div>
            </div>

            <!-- Purpose -->
            <div class="border-b border-dashed border-slate-200 pb-3">
              <p class="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Purpose:</p>
              <p class="text-xs font-bold text-slate-900 leading-tight">{{ requisition.purpose }}</p>
            </div>

            <!-- Project Link (if exists) -->
            <div v-if="requisition.project || requisition.enquiry" class="bg-slate-50/50 p-3 rounded border border-slate-200 border-dashed">
              <p class="text-[9px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Linked Project:</p>
              <div class="flex items-center gap-2">
                <i class="mdi mdi-link-variant text-slate-400"></i>
                <p class="text-xs font-black text-slate-900 tracking-tighter">
                  <span v-if="requisition.project">
                    <span class="font-bold">{{ requisition.project.enquiry?.job_number || requisition.project.project_id }}</span>
                    - {{ requisition.project.enquiry?.title || 'Untitled Project' }}
                  </span>
                  <span v-else-if="requisition.enquiry">
                    <span class="font-bold">{{ requisition.enquiry.job_number || requisition.enquiry.enquiry_number }}</span>
                    - {{ requisition.enquiry.title }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Items List -->
            <div class="border-t-2 border-slate-900 pt-4">
              <div class="flex justify-between text-[10px] font-black text-slate-500 mb-3 pb-1 border-b border-slate-300 tracking-widest uppercase">
                <span>Recipient / Item</span>
                <span>Amount</span>
              </div>
              
              <div v-for="(item, idx) in requisition.items" :key="item.id" class="mb-4">
                <div class="flex justify-between items-start text-xs">
                  <div class="flex-grow flex items-start gap-2 pr-4">
                    <span class="text-[10px] font-black text-slate-400 mt-0.5">{{ Number(idx) + 1 }}.</span>
                    <div>
                      <p class="font-black text-slate-900 leading-tight uppercase tracking-tighter">
                        <template v-if="item.payee || item.payee_name">
                          {{ item.payee ? `${item.payee.first_name} ${item.payee.last_name}` : item.payee_name }}
                        </template>
                        <template v-else>
                          <span v-if="requisition.payee">{{ requisition.payee.first_name }} {{ requisition.payee.last_name }}</span>
                          <span v-else-if="requisition.payee_name">{{ requisition.payee_name }}</span>
                          <span v-else>{{ requisition.requester?.name || 'Self' }}</span>
                        </template>
                      </p>
                      <p class="text-[10px] text-slate-500 mt-1 font-bold italic">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <span class="font-black text-slate-900 tabular-nums tracking-tighter block">{{ formatReceiptAmount(item.amount) }}</span>
                      <div v-if="item.received_at" class="text-[9px] text-emerald-600 font-black mt-0.5 tracking-tighter uppercase">✓ Confirmed</div>
                    </div>
                    
                    <!-- Itemized Signature on Receipt -->
                    <div v-if="item.digital_signature" class="shrink-0 h-10 w-24 border border-slate-200 p-0.5 bg-white flex items-center justify-center overflow-hidden">
                       <img :src="item.digital_signature" alt="Signature" class="max-h-full max-w-full opacity-100 brightness-0" />
                    </div>
                  </div>
                </div>
                <div v-if="Number(idx) < requisition.items.length - 1" class="border-b border-dotted border-slate-200 mt-4"></div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t-2 border-double border-slate-900 pt-3 mt-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-black text-slate-900 tracking-widest uppercase">Total:</span>
                <span class="text-xl font-black text-slate-900 tabular-nums tracking-tighter">{{ formatReceiptAmount(requisition.total_amount) }}</span>
              </div>
            </div>

            <!-- Rejection Reason -->
            <div v-if="requisition.status === 'rejected'" class="bg-red-50 border-2 border-red-300 p-3 rounded mt-4">
              <div class="flex items-center gap-2 mb-1">
                <i class="mdi mdi-alert-circle text-red-600"></i>
                <p class="text-[9px] font-black text-red-600 uppercase tracking-widest">Rejected:</p>
              </div>
              <p class="text-xs font-bold text-red-900 italic leading-snug">{{ requisition.rejection_reason || 'No reason provided' }}</p>
            </div>
          </div>

          <!-- Receipt Footer / Timeline -->
          <div class="px-8 py-6 bg-slate-50/50 border-t-2 border-dashed border-slate-200">
            <p class="text-[10px] font-black text-slate-400 mb-4 tracking-widest uppercase">Transaction Log</p>
            
            <div class="space-y-4 text-xs">
              <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-600 uppercase text-[9px]">Requested</span>
                    <span class="font-black text-slate-900 tabular-nums">{{ formatReceiptDateTime(requisition.created_at) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="requisition.approved_at" class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 rounded-full mt-1 shadow-sm" :class="requisition.status === 'rejected' ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'"></div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-600 uppercase text-[9px]">{{ requisition.status === 'rejected' ? 'Rejected' : 'Approved' }}</span>
                    <span class="font-black text-slate-900 tabular-nums">{{ formatReceiptDateTime(requisition.approved_at) }}</span>
                  </div>
                  <p class="text-[9px] text-slate-400 font-bold mt-0.5 italic">By: {{ requisition.approver?.name }}</p>
                </div>
              </div>

              <div v-if="requisition.disbursement" class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 shadow-purple-500/50"></div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-600 uppercase text-[9px]">Disbursed</span>
                    <span class="font-black text-slate-900 tabular-nums">{{ formatReceiptDateTime(requisition.disbursement.created_at) }}</span>
                  </div>
                  <p class="text-[9px] text-slate-400 font-bold mt-0.5 truncate italic">Ref: {{ requisition.disbursement.transaction_code }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- QR Code for Sign-off -->
          <div v-if="requisition.status === 'disbursed' && !requisition.received_at" class="px-8 py-8 border-t border-dashed border-slate-200 text-center bg-white">
            <p class="text-[10px] font-black text-slate-400 mb-4 tracking-widest uppercase">Scan to Confirm Receipt</p>
            <div class="bg-white p-4 border border-slate-100 shadow-xl inline-block rounded-2xl mb-4 group ring-8 ring-slate-50">
              <QrcodeVue :value="publicSignOffUrl" :size="140" level="H" />
            </div>
            <div class="flex items-center justify-center gap-2 max-w-xs mx-auto">
              <code class="text-[9px] text-slate-400 font-mono truncate grow bg-slate-50 px-2 py-1 rounded border border-slate-100">{{ publicSignOffUrl }}</code>
              <button 
                @click="copyToClipboard" 
                class="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition-all active:scale-95"
                :title="copied ? 'Copied!' : 'Copy link'"
              >
                <i class="mdi" :class="copied ? 'mdi-check text-emerald-500' : 'mdi-content-copy'"></i>
              </button>
            </div>
            <p v-if="copied" class="text-[9px] text-emerald-600 font-black uppercase mt-2 tracking-widest animate-bounce">Copied!</p>
          </div>

          <!-- Digital Signature -->
          <div v-if="requisition.digital_signature" class="px-8 py-6 border-t border-dashed border-slate-200 bg-slate-50/30">
            <p class="text-[10px] font-black text-slate-400 mb-4 tracking-widest text-center uppercase font-mono">Acknowledged by:</p>
            <div class="border-b-2 border-slate-900/10 pb-2 mb-4">
              <img :src="requisition.digital_signature" alt="Signature" class="max-h-16 mx-auto opacity-90 drop-shadow-sm transition-opacity hover:opacity-100" />
            </div>
            <div class="text-center space-y-1">
              <p class="text-xs font-black text-slate-900 uppercase tracking-widest font-mono">{{ requisition.received_by || requisition.authenticated_user?.name || 'N/A' }}</p>
              <p class="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Verified Digital Signature</p>
              <p class="text-[9px] text-slate-400 tabular-nums font-bold" v-if="requisition.received_at">{{ formatReceiptDateTime(requisition.received_at) }}</p>
            </div>
          </div>

          <!-- Perforated Bottom Edge -->
          <div class="h-3 bg-repeat-x" style="background-image: repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 8px, transparent 8px, transparent 16px);"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

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

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'disbursed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'received': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Receipt Entry Animation */
.receipt-fade-enter-active,
.receipt-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.receipt-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.receipt-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
