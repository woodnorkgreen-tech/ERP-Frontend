<template>
  <div
    v-if="isOpen && transaction"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    aria-labelledby="detail-modal-title"
    role="dialog"
    aria-modal="true"
    @click.self="$emit('close')"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center space-x-3">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center text-white"
            :class="transaction.type === 'top_up' ? 'bg-green-500' : (transaction.status?.is_voided ? 'bg-red-500' : 'bg-blue-500')"
          >
            <svg v-if="transaction.type === 'top_up'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white" id="detail-modal-title">
              Transaction Details
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              ID: #{{ transaction.id }} | {{ transaction.type === 'top_up' ? 'Top-up' : 'Disbursement' }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto space-y-6">
        <!-- Status Banner -->
        <div 
          v-if="transaction.status?.is_voided"
          class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                This transaction was VOIDED
              </p>
              <p v-if="transaction.void_reason" class="mt-1 text-sm text-red-700 dark:text-red-300 italic">
                Reason: {{ transaction.void_reason }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Main Info -->
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Amount
              </label>
              <p 
                class="text-2xl font-bold"
                :class="transaction.type === 'top_up' ? 'text-green-600 dark:text-green-400' : (transaction.status?.is_voided ? 'text-red-400 dark:text-red-500 line-through' : 'text-red-600 dark:text-red-400')"
              >
                {{ transaction.amount?.formatted || 'KES 0.00' }}
              </p>
            </div>

            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                {{ transaction.type === 'top_up' ? 'Source / Method' : 'Receiver / Payee' }}
              </label>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ transaction.type === 'top_up' ? 'Wallet Top-up' : (transaction.receiver || 'General Disbursement') }}
              </p>
            </div>

            <div v-if="transaction.type === 'disbursement'">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Classification
              </label>
              <span 
                v-if="transaction.classification"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getClassificationBadgeClass(transaction.classification.value)"
              >
                {{ transaction.classification.label }}
              </span>
              <p v-else class="text-sm text-gray-400 italic">N/A</p>
            </div>
          </div>

          <!-- Secondary Info -->
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Date & Time
              </label>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ formatDate(transaction.created_at?.raw) }}
              </p>
            </div>

            <div>
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Payment Method
              </label>
              <p class="text-sm text-gray-900 dark:text-white flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                {{ transaction.payment_method?.label || 'Unknown' }}
              </p>
            </div>

            <div v-if="transaction.transaction_code">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Reference Code
              </label>
              <p class="text-sm font-mono text-gray-900 dark:text-white">
                {{ transaction.transaction_code }}
              </p>
            </div>
          </div>
        </div>

        <hr class="border-gray-200 dark:border-gray-700" />

        <!-- Description -->
        <div>
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
            Description / Purpose
          </label>
          <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 italic">
            "{{ transaction.description || 'No description provided' }}"
          </div>
        </div>

        <!-- Project Integration Info -->
        <div v-if="transaction.project_name || transaction.job_number" class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div v-if="transaction.project_name">
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              Project
            </label>
            <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {{ transaction.project_name }}
            </p>
          </div>
          <div v-if="transaction.job_number">
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              Job Number
            </label>
            <p class="text-sm font-mono text-gray-900 dark:text-white">
              {{ transaction.job_number }}
            </p>
          </div>
        </div>

        <!-- Receipt Confirmation -->
        <div v-if="transaction.type === 'disbursement'" class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
            Receipt Confirmation
          </label>
          
          <div v-if="transaction.received_at" class="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
            <div class="flex items-center text-green-700 dark:text-green-400 font-medium mb-3">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Confirmed on {{ formatDate(transaction.received_at) }}
            </div>
            
            <div v-if="transaction.signature" class="bg-white dark:bg-white/5 p-3 rounded border border-gray-200 dark:border-gray-600/50 inline-block">
              <label class="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Signature</label>
              <img :src="transaction.signature" alt="Digital Signature" class="max-h-16 opacity-90" />
            </div>
          </div>
          
          <div v-else-if="transaction.requisition_id" class="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30">
            <div class="flex items-center text-amber-700 dark:text-amber-400 font-medium">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
              Pending Confirmation
            </div>
            <p class="text-xs text-amber-600 dark:text-amber-500 mt-1 ml-7">
              The recipient has not yet signed for this disbursement.
            </p>
          </div>
          
          <!-- Requisition Link -->
          <div v-if="transaction.requisition_id" class="mt-2">
            <router-link 
              :to="`/finance/petty-cash/requisitions/${transaction.requisition_id}`"
              class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View Linked Requisition
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </router-link>
          </div>
        </div>
        
        <!-- Audit Trail -->
        <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">
            <div v-if="transaction.creator?.name" class="flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Created by: {{ transaction.creator.name }}
            </div>
            <div v-if="transaction.updated_at?.formatted">
              Last updated: {{ transaction.updated_at.formatted }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  transaction: any;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getClassificationBadgeClass = (classification: string): string => {
  const classes = {
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    event_planners: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    corporates: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    crs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    agencies: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'
  }
  return classes[classification as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
}
</script>
