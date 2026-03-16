<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" @click="close"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-orange-50 to-white dark:from-orange-500/10 dark:to-slate-900">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-inner">
                <i class="mdi mdi-lock-clock text-2xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">Project Financial Lock</h3>
                <p class="text-sm font-medium text-orange-600 dark:text-orange-400">Awaiting 70% Deposit Clearance</p>
              </div>
            </div>
            <button @click="close" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>

          <!-- Tab Navigation -->
          <div class="px-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
             <div class="flex gap-6">
                <button 
                   @click="activeSubTab = 'finance'"
                   class="py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all"
                   :class="activeSubTab === 'finance' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
                >
                   Deposit Tracking
                </button>
                <button 
                   @click="activeSubTab = 'governance'"
                   class="py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all"
                   :class="activeSubTab === 'governance' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
                >
                   Governance Trace
                </button>
             </div>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
            
            <div v-if="activeSubTab === 'finance'">
               <!-- Finance Summary -->
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                     <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">System Generated Quote</p>
                     <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">{{ formatCurrency(financeProgress.total_quote) }}</p>
                     <p class="text-[9px] text-slate-400 mt-1 italic">Internal cost tracking reference</p>
                  </div>
                  <div class="bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl p-4 border border-emerald-100 dark:border-emerald-500/20">
                     <div class="flex items-center justify-between mb-2">
                        <p class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Client Approved Quote</p>
                        <button 
                           @click="toggleEditQuote" 
                           class="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                        >
                           {{ isEditingQuote ? 'Save' : 'Update' }}
                        </button>
                     </div>
                     
                     <div v-if="isEditingQuote" class="flex items-center gap-2">
                        <div class="relative flex-1">
                           <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">KES</span>
                           <input 
                              v-model.number="clientQuoteEdit" 
                              type="number"
                              class="w-full pl-8 pr-2 py-1 bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/30 rounded text-sm font-bold focus:ring-1 focus:ring-emerald-500"
                              @keyup.enter="saveApprovedQuote"
                           />
                        </div>
                        <button @click="isEditingQuote = false" class="p-1 text-slate-400 hover:text-slate-600">
                           <i class="mdi mdi-close text-sm"></i>
                        </button>
                     </div>
                     <p v-else class="text-lg font-black text-emerald-900 dark:text-emerald-300">
                        {{ formatCurrency(financeProgress.total_quote) }}
                        <span v-if="!financeProgress.is_client_approved_basis" class="text-[10px] font-medium text-amber-600 ml-1">(System Based)</span>
                     </p>
                  </div>
               </div>

               <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6 flex items-center justify-between">
                  <div>
                     <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Received So Far</p>
                     <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(financeProgress.total_paid) }}</p>
                  </div>
                  <div class="text-right">
                     <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Balance Remaining</p>
                     <p class="text-lg font-bold text-slate-900 dark:text-white">{{ formatCurrency(financeProgress.remaining) }}</p>
                  </div>
               </div>

               <div class="mb-6">
                  <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Mobilization Progress</span>
                        <span class="text-sm font-bold text-slate-900 dark:text-white">
                           {{ (financeProgress?.percentage || 0).toFixed(1) }}% 
                           <span class="text-slate-400 font-normal">/ 70% Cleared</span>
                        </span>
                  </div>
                  <div class="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
                        <!-- Paid Bar -->
                        <div 
                           class="h-full bg-emerald-500 transition-all duration-500"
                           :style="`width: ${Math.min(financeProgress.percentage, 100)}%`"
                        ></div>
                        <!-- 70% Marker -->
                        <div class="absolute h-full w-1.5 bg-white/40 dark:bg-white/10 z-10" style="left: 70%; transform: translateX(-50%);"></div>
                  </div>
                  <p v-if="financeProgress.percentage < 70" class="text-[10px] text-orange-600 dark:text-orange-400 mt-2 font-medium">
                     Mobilization deposit must reach 70% of the approved quote to unlock production tasks.
                  </p>
               </div>

               <!-- Add Payment Form -->
               <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-6">
                  <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                     <i class="mdi mdi-cash-plus text-emerald-500 text-lg"></i>
                     Log Mobilization Payment
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                        <div class="relative">
                           <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">KES</span>
                           <input 
                              v-model.number="paymentForm.amount" 
                              type="number" 
                              class="w-full pl-12 pr-4 py-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                           />
                        </div>
                     </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                        <select 
                           v-model="paymentForm.payment_method"
                           class="w-full px-4 py-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="bank_transfer">Bank Transfer</option>
                           <option value="mpesa">M-Pesa</option>
                           <option value="cash">Cash</option>
                           <option value="cheque">Cheque</option>
                        </select>
                     </div>
                  </div>
                  <div class="mb-4">
                     <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Transaction Reference (Optional)</label>
                     <input 
                        v-model="paymentForm.transaction_reference" 
                        type="text" 
                        class="w-full px-4 py-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g M-Pesa Code or Bank Ref"
                     />
                  </div>
                  <div class="flex justify-end">
                     <button 
                        @click="logPayment" 
                        :disabled="paying || !paymentForm.amount"
                        class="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        <i v-if="paying" class="mdi mdi-loading mdi-spin"></i>
                        <i v-else class="mdi mdi-check"></i>
                        Log Payment
                     </button>
                  </div>
               </div>

               <!-- Warning/Info Block -->
               <div class="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-300 mb-6">
                  <i class="mdi mdi-information shrink-0 text-lg mt-0.5"></i>
                  <p>Releasing this project will transition it to 'Planning' and bypass any remaining financial gates. Use this for special approvals or non-standard project flows.</p>
               </div>

               <!-- Manual Release Justification (Only if < 70%) -->
               <div v-if="financeProgress.percentage < 70" class="mb-6 animate-in fade-in slide-in-from-top duration-300">
                  <label class="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <i class="mdi mdi-alert-circle"></i>
                     Release Justification (Mandatory)
                  </label>
                  <textarea 
                     v-model="releaseNotes"
                     class="w-full px-4 py-3 bg-white dark:bg-slate-900 border-orange-200 dark:border-orange-500/30 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400 min-h-[100px]"
                     placeholder="Please provide a professional reason for releasing this project before the 70% mobilization threshold is met..."
                  ></textarea>
                  <p class="text-[10px] text-slate-400 mt-2 italic">This explanation will be logged in the permanent project governance audit trail.</p>
               </div>
            </div>

            <!-- Governance Trace Tab -->
            <div v-else-if="activeSubTab === 'governance'" class="space-y-6 animate-in fade-in duration-300">
               <div v-if="loadingGovernance" class="flex flex-col items-center justify-center py-20 gap-4">
                  <i class="mdi mdi-loading mdi-spin text-4xl text-orange-500"></i>
                  <p class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Retrieving Audit Trail...</p>
               </div>
               
               <template v-else>
                  <div v-if="governanceLogs.length === 0" class="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                     <i class="mdi mdi-shield-off-outline text-5xl text-slate-300 mb-4"></i>
                     <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">No governance records found</p>
                  </div>

                  <div v-else class="space-y-4">
                     <div v-for="log in governanceLogs" :key="log.id" class="relative pl-8 pb-4 group">
                        <!-- Timeline Line -->
                        <div class="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 group-last:hidden"></div>
                        
                        <!-- Timeline Dot -->
                        <div 
                           class="absolute left-0 top-1.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white dark:border-slate-900 z-10"
                           :class="log.action_status === 'authorized' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'"
                        >
                           <i :class="log.action_status === 'authorized' ? 'mdi mdi-check text-[10px]' : 'mdi mdi-close text-[10px]'"></i>
                        </div>

                        <div class="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-orange-200 dark:hover:border-orange-500/30 transition-all">
                           <div class="flex items-center justify-between mb-2">
                              <span class="text-[10px] font-black uppercase tracking-widest" :class="log.action_status === 'authorized' ? 'text-emerald-600' : 'text-red-600'">
                                 {{ log.gate_type }} decision
                              </span>
                              <span class="text-[10px] font-bold text-slate-400">{{ formatDate(log.created_at) }}</span>
                           </div>
                           
                           <p class="text-xs font-black text-slate-900 dark:text-white mb-2">{{ log.message }}</p>
                           
                           <div v-if="log.context?.reason" class="mb-3 p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20">
                              <p class="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Reason for override</p>
                              <p class="text-xs text-slate-600 dark:text-slate-300 italic">"{{ log.context.reason }}"</p>
                           </div>

                           <div class="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-800">
                              <div class="flex items-center gap-2">
                                 <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-black text-slate-500">
                                    {{ log.user?.name?.charAt(0) || '?' }}
                                 </div>
                                 <span class="text-[10px] font-bold text-slate-500">{{ log.user?.name || 'System' }}</span>
                              </div>
                              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Auth Trace ID: #{{ log.id }}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </template>
            </div>
            
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0 flex items-center justify-between">
            <button @click="close" class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
              Cancel
            </button>
            <button 
              @click="releaseProjectFromFinance" 
              :disabled="loadingFinance"
              class="px-6 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
               <i v-if="loadingFinance" class="mdi mdi-loading mdi-spin text-lg"></i>
               <i v-else class="mdi mdi-lock-open-variant text-lg"></i>
               Release Project to Production
            </button>
          </div>
          
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import type { ProjectEnquiry } from '@/modules/projects/types/enquiry'
import { useToast } from '@/modules/universal-task/composables/useToast'

const props = defineProps<{
  show: boolean
  enquiry: ProjectEnquiry
}>()

const emit = defineEmits(['close', 'released', 'updated'])

const { addToast } = useToast()

const loadingFinance = ref(false)
const paying = ref(false)
const isEditingQuote = ref(false)
const clientQuoteEdit = ref<number | null>(null)
const releaseNotes = ref('')
const activeSubTab = ref<'finance' | 'governance'>('finance')
const governanceLogs = ref<any[]>([])
const loadingGovernance = ref(false)

const financeProgress = ref({
   total_quote: 0,
   total_paid: 0,
   remaining: 0,
   percentage: 0,
   is_70_percent_met: false,
   is_client_approved_basis: false,
   client_approved_amount: 0
})

const paymentForm = ref({
   amount: null as number | null,
   payment_method: 'bank_transfer',
   transaction_reference: '',
   notes: ''
})

const close = () => {
   emit('close')
}

const toggleEditQuote = () => {
   if (isEditingQuote.value) {
      saveApprovedQuote()
   } else {
      clientQuoteEdit.value = financeProgress.value.total_quote
      isEditingQuote.value = true
   }
}

const saveApprovedQuote = async () => {
   try {
      await api.put(`/api/projects/enquiries/${props.enquiry.id}`, {
         client_approved_quote: clientQuoteEdit.value
      })
      addToast("Approved quote updated", "success")
      isEditingQuote.value = false
      await fetchFinanceProgress()
      emit('updated')
   } catch (error) {
      console.error("Failed to update approved quote", error)
      addToast("Error updating quote", "error")
   }
}

const fetchFinanceProgress = async () => {
    try {
        const response = await api.get(`/api/projects/enquiries/${props.enquiry.id}/finance-progress`)
        financeProgress.value = response.data.data.progress
    } catch (error) {
        console.error("Failed to fetch finance progress", error)
        addToast("Error fetching payment history", "error")
    }
}

const fetchGovernanceTrace = async () => {
    loadingGovernance.value = true
    try {
        const response = await api.get(`/api/projects/enquiries/${props.enquiry.id}/governance-trace`)
        governanceLogs.value = response.data.data
    } catch (error) {
        console.error("Failed to fetch governance trace", error)
        addToast("Error fetching governance trace", "error")
    } finally {
        loadingGovernance.value = false
    }
}

const logPayment = async () => {
    if (!paymentForm.value.amount) return
    
    paying.value = true
    try {
        await api.post(`/api/projects/enquiries/${props.enquiry.id}/payments`, paymentForm.value)
        addToast("Payment logged successfully", "success")
        paymentForm.value.amount = null
        paymentForm.value.transaction_reference = ''
        paymentForm.value.notes = ''
        await fetchFinanceProgress()
        emit('updated')
    } catch (error) {
        console.error("Failed to log payment", error)
        addToast("Error logging payment", "error")
    } finally {
        paying.value = false
    }
}

const releaseProjectFromFinance = async () => {
    if ((financeProgress.value?.percentage || 0) < 70) {
        if (!releaseNotes.value.trim()) {
            addToast("Justification is mandatory for manual release", "error")
            return
        }
        
        if (!confirm(`Warning: The deposit is currently at ${(financeProgress.value?.percentage || 0).toFixed(1)}%, which is below the 70% threshold. Are you sure you want to release this project manually?`)) {
            return
        }
    }

    loadingFinance.value = true
    try {
        await api.post(`/api/projects/enquiries/${props.enquiry.id}/release`, {
            notes: releaseNotes.value
        })
        addToast("Project released for production", "success")
        releaseNotes.value = ''
        await fetchGovernanceTrace()
        emit('released')
    } catch (error) {
        console.error("Failed to release project", error)
        addToast("Error releasing project", "error")
    } finally {
        loadingFinance.value = false
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { 
        style: 'currency', 
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0)
}

const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

import { watch } from 'vue'
watch(activeSubTab, (newTab) => {
   if (newTab === 'governance') {
      fetchGovernanceTrace()
   } else {
      fetchFinanceProgress()
   }
})

onMounted(() => {
    fetchFinanceProgress()
    fetchGovernanceTrace()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .relative,
.fade-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}

.fade-enter-from .relative,
.fade-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
