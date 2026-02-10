<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-6">
      <div class="animate-pulse">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
            <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div class="mt-6 flex space-x-3">
          <div class="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load balance</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <div class="mt-6">
          <button
            @click="handleRetry"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Content State -->
    <div v-else-if="showContent" class="p-6 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute -right-6 -top-6 text-slate-50 dark:text-slate-700/10 pointer-events-none">
        <svg class="w-32 h-32 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.61 1.87 1.22 0 2.4-.7 2.4-2.37 0-4.41-5.4-4.43-5.4-8.54 0-1.95 1.4-3.22 3.32-3.55V2h2.67v1.95c1.86.38 2.95 1.56 3.08 3.32h-1.96c-.1-1.04-.79-1.91-2.65-1.91-1.22 0-2.38.72-2.38 2.22 0 4.28 5.4 4.36 5.4 8.7 0 2.14-1.7 3.36-3.66 3.61z" />
        </svg>
      </div>

      <div class="relative">
        <div class="flex items-center mb-6">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" :class="iconBgColor">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 flex-1">
             <h3 class="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Current Balance</h3>
             <div class="flex items-center gap-2 mt-1">
                <div class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {{ balanceDisplay }}
                </div>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold capitalize" :class="statusBadgeColor">
                  {{ statusLabel }}
                </span>
             </div>
          </div>
        </div>
      
        <!-- Thresholds Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Low Limit</dt>
            <dd class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ lowThresholdDisplay }}</dd>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            <dt class="text-[10px] font-black uppercase tracking-wider text-slate-400">Critical Limit</dt>
            <dd class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ criticalThresholdDisplay }}</dd>
          </div>
        </div>

        <!-- Last Transaction Compact -->
        <div v-if="hasLastTransaction && lastTransactionDisplay" class="mb-4">
          <div class="flex items-center justify-between text-xs mb-2">
             <span class="font-bold text-slate-400 uppercase tracking-wider">Last Activity</span>
             <span class="text-slate-400">{{ lastTransactionDisplay.createdAt }}</span>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div class="flex items-center gap-3">
               <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="getTransactionIconBg(lastTransactionDisplay.type)">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="lastTransactionDisplay.type === 'top_up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                  </svg>
               </div>
               <div class="min-w-0">
                  <p class="font-bold text-slate-900 dark:text-white truncate">{{ lastTransactionDisplay.typeLabel }}</p>
                  <p class="text-xs text-slate-500 truncate" v-if="lastTransactionDisplay.receiver">{{ lastTransactionDisplay.receiver }}</p>
               </div>
             </div>
             <div class="font-black text-sm whitespace-nowrap" :class="getTransactionAmountColor(lastTransactionDisplay.type)">
                {{ lastTransactionDisplay.type === 'top_up' ? '+' : '-' }}{{ lastTransactionDisplay.amount }}
             </div>
          </div>
        </div>

        <!-- Health Indicators -->
        <div v-if="needsAttention" class="rounded-xl p-3 border" :class="warningClasses">
          <div class="flex gap-3">
            <svg class="h-5 w-5 shrink-0" :class="warningIconColor" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h3 class="text-xs font-black uppercase tracking-wider mb-1" :class="warningTextColor">{{ warningTitle }}</h3>
              <p class="text-xs leading-relaxed" :class="warningTextColor">{{ warningMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PettyCashBalance } from '../types/pettyCash'
import { defaultBalance, mergeWithDefaults } from '../utils/defaults'
import { useErrorHandler } from '../composables/useErrorHandler'

interface Props {
  balance: PettyCashBalance | null
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'add-topup'): void
  (e: 'new-disbursement'): void
  (e: 'refresh'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<Emits>()

// Error handling
const { handleError, clearError } = useErrorHandler()

// Safe balance data with defaults
const safeBalance = computed(() => {
  if (!props.balance) {
    return defaultBalance
  }
  return mergeWithDefaults(defaultBalance, props.balance as any)
})

// Loading and error states
const isLoading = computed(() => props.loading)
const hasError = computed(() => !!props.error)
const showContent = computed(() => !isLoading.value && !hasError.value)

// Retry functionality
const handleRetry = () => {
  clearError()
  emit('retry')
}

// Safe computed properties for styling
const statusLabel = computed(() => {
  const balance = safeBalance.value
  return (balance.status as any)?.label || 'Unknown'
})

const statusTextColor = computed(() => {
  const balance = safeBalance.value
  const status = (balance.status as any)?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'text-red-600 dark:text-red-400'
    case 'low': return 'text-yellow-600 dark:text-yellow-400'
    default: return 'text-emerald-600 dark:text-emerald-400'
  }
})

const statusBadgeColor = computed(() => {
  const balance = safeBalance.value
  const status = (balance.status as any)?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'low': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    default: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
  }
})

const statusIndicatorColor = computed(() => {
  const balance = safeBalance.value
  const status = (balance.status as any)?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'bg-red-500'
    case 'low': return 'bg-yellow-500'
    default: return 'bg-emerald-500'
  }
})

const iconBgColor = computed(() => {
  const balance = safeBalance.value
  const status = (balance.status as any)?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'bg-red-500 shadow-red-500/30'
    case 'low': return 'bg-yellow-500 shadow-yellow-500/30'
    default: return 'bg-emerald-500 shadow-emerald-500/30'
  }
})

// Safe balance display
const balanceDisplay = computed(() => {
  const balance = safeBalance.value
  return (balance.current_balance as any)?.formatted || 
         `KES ${((balance.current_balance as any)?.raw || 0).toLocaleString('en-KE', { 
           minimumFractionDigits: 2, 
           maximumFractionDigits: 2 
         })}`
})

// Safe threshold displays
const lowThresholdDisplay = computed(() => {
  const balance = safeBalance.value
  return (balance.thresholds as any)?.low_threshold?.formatted || 'KES 1,000.00'
})

const criticalThresholdDisplay = computed(() => {
  const balance = safeBalance.value
  return (balance.thresholds as any)?.critical_threshold?.formatted || 'KES 500.00'
})

// Safe last transaction data
const hasLastTransaction = computed(() => {
  const balance = safeBalance.value
  return !!((balance.last_transaction as any) && (balance.last_transaction as any).id)
})

const lastTransactionDisplay = computed(() => {
  const balance = safeBalance.value
  const transaction = (balance.last_transaction as any)
  
  if (!transaction) return null
  
  return {
    typeLabel: transaction.type_label || 'Transaction',
    receiver: transaction.receiver || '',
    createdAt: transaction.created_at?.human || 'Unknown time',
    amount: transaction.amount?.formatted || 'KES 0.00',
    type: transaction.type || 'top_up'
  }
})

// Safe health indicators
const needsAttention = computed(() => {
  const balance = safeBalance.value
  return (balance.health_indicators as any)?.needs_attention || false
})

// Safe warning styling
const warningTitle = computed(() => {
  const balance = safeBalance.value
  const isCritical = (balance.status as any)?.is_critical || (balance.status as any)?.value === 'critical'
  return isCritical ? 'Critical Balance Alert' : 'Low Balance Warning'
})

const warningMessage = computed(() => {
  const balance = safeBalance.value
  const isCritical = (balance.status as any)?.is_critical || (balance.status as any)?.value === 'critical'
  return isCritical 
    ? 'Your petty cash balance is critically low. Please add a top-up immediately.'
    : 'Your petty cash balance is running low. Consider adding a top-up soon.'
})

const warningClasses = computed(() => {
  const balance = safeBalance.value
  const isCritical = (balance.status as any)?.is_critical || (balance.status as any)?.value === 'critical'
  return isCritical 
    ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' 
    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800'
})

const warningIconColor = computed(() => {
  const balance = safeBalance.value
  const isCritical = (balance.status as any)?.is_critical || (balance.status as any)?.value === 'critical'
  return isCritical ? 'text-red-400' : 'text-yellow-400'
})

const warningTextColor = computed(() => {
  const balance = safeBalance.value
  const isCritical = (balance.status as any)?.is_critical || (balance.status as any)?.value === 'critical'
  return isCritical 
    ? 'text-red-800 dark:text-red-200' 
    : 'text-yellow-800 dark:text-yellow-200'
})

// Safe transaction styling methods
const getTransactionIconBg = (type?: string): string => {
  return (type === 'top_up') ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-rose-100 dark:bg-rose-900/20'
}

const getTransactionAmountColor = (type?: string): string => {
  return (type === 'top_up') 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : 'text-rose-600 dark:text-rose-400'
}
</script>