<template>
  <ErrorBoundary 
    type="component" 
    :can-retry="true" 
    :can-reset="true"
    @retry="handleRetry"
    @reset="handleReset"
  >
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-12">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <!-- Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Petty Cash Management
            </h1>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {{ activeDashboardTab === 'overview' ? 'Overview of financial status and transactions' : 'Manage and track petty cash requests' }}
            </p>
          </div>
          
          <!-- System Status / Last Updated -->
          <div class="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 shadow-sm">
             <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
               System Active
             </span>
             <span class="text-slate-300 dark:text-slate-600">|</span>
             <button @click="handleRefreshAll" class="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1">
               <span v-if="isRefreshing" class="animate-spin">⟳</span>
               <span v-else>Refresh Data</span>
             </button>
          </div>
        </div>

        <!-- Main Navigation Tabs -->
        <div class="flex items-center gap-2 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 w-fit">
          <button 
            v-for="tab in dashboardTabs" 
            :key="tab.id"
            @click="activeDashboardTab = tab.id"
            class="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all transition-all duration-300"
            :class="activeDashboardTab === tab.id 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg shadow-slate-900/20 scale-105' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50'"
          >
             <i class="mdi mr-2" :class="activeDashboardTab === tab.id ? tab.activeIcon : tab.icon"></i>
             {{ tab.name }}
          </button>
        </div>

        <!-- Tab Content -->
        <div v-show="activeDashboardTab === 'overview'" class="space-y-8 animate-in fade-in duration-500">
          <!-- Metric & Action Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          <!-- Left Col: Balance & Primary Actions (4 cols) -->
          <div class="xl:col-span-4 flex flex-col gap-4">
            <!-- Balance Card -->
            <ErrorBoundary 
              type="component" 
              :can-retry="true"
              title="Balance Error"
              @retry="handleBalanceRetry"
            >
              <BalanceCard 
                :balance="currentBalance"
                :loading="loading.balance"
                :error="store.errors?.balance"
                @add-topup="openTopUpModal"
                @new-disbursement="openDisbursementModal"
                @refresh="store.fetchCurrentBalance"
                @retry="handleBalanceRetry"
              />
            </ErrorBoundary>

            <!-- Primary Actions -->
            <div class="grid grid-cols-2 gap-3">
              <button
                v-if="permissions.canCreateDisbursement"
                @click="openDisbursementModal"
                :disabled="isRefreshing"
                class="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
              >
                <i class="mdi mdi-cash-fast text-2xl mb-1"></i>
                <span class="text-xs font-black uppercase tracking-wider">New Payout</span>
              </button>
              
              <button
                v-if="permissions.canCreateTopUp"
                @click="openTopUpModal"
                :disabled="isRefreshing"
                class="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
              >
                <i class="mdi mdi-wallet-plus text-2xl mb-1"></i>
                <span class="text-xs font-black uppercase tracking-wider">Add Top-up</span>
              </button>
            </div>
          </div>

          <!-- Right Col: Conslidated Stats & Tools (8 cols) -->
          <div class="xl:col-span-8 flex flex-col gap-6">
            
            <!-- Stats Grid -->
            <ErrorBoundary type="component" :can-retry="true" @retry="handleSummaryRetry">
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Stat: Total Top-ups -->
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
                   <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i class="mdi mdi-arrow-up-bold-circle text-4xl text-emerald-500"></i>
                   </div>
                   <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total In</p>
                   <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                     {{ safeSummary?.total_top_ups ? formatAmount(safeSummary.total_top_ups) : formatAmount(store.totalTopUpAmount) }}
                   </p>
                </div>

                <!-- Stat: Total Disbursements -->
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
                   <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i class="mdi mdi-arrow-down-bold-circle text-4xl text-rose-500"></i>
                   </div>
                   <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Out</p>
                   <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                     {{ safeSummary?.total_disbursements ? formatAmount(safeSummary.total_disbursements) : formatAmount(store.totalDisbursementAmount) }}
                   </p>
                </div>

                <!-- Stat: Transactions -->
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
                   <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i class="mdi mdi-swap-horizontal-bold text-4xl text-blue-500"></i>
                   </div>
                   <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Transactions</p>
                   <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                     {{ totalTransactions }}
                   </p>
                </div>

                <!-- Stat: Avg Disbursement -->
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm relative overflow-hidden group">
                   <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i class="mdi mdi-chart-line text-4xl text-purple-500"></i>
                   </div>
                   <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg Payout</p>
                   <p class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                     {{ safeSummary?.average_disbursement ? formatAmount(safeSummary.average_disbursement) : 'KES 0.00' }}
                   </p>
                </div>
              </div>
            </ErrorBoundary>

            <!-- Tools Bar -->
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-wrap items-center justify-between gap-4">
               <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 shrink-0">Tools</span>
                  <div class="h-6 w-px bg-slate-100 dark:bg-slate-700 shrink-0"></div>
                  
                  <button
                    v-if="permissions.canUploadExcel"
                    @click="openUploadModal"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    <i class="mdi mdi-microsoft-excel text-green-600"></i>
                    Details Upload
                  </button>

                  <button
                    v-if="permissions.canView"
                    @click="handlePrintVoucher"
                    :disabled="store.loading.voucher"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    <i class="mdi mdi-file-pdf-box text-red-500"></i>
                    {{ store.loading.voucher ? 'Generating...' : 'Report Voucher' }}
                  </button>
               </div>
               
               <!-- Admin Tools -->
               <div class="flex items-center gap-2 shrink-0">
                  <button
                    v-if="permissions.canAdmin"
                    @click="handleRecalculate"
                    class="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Audit & Recalculate Balance"
                  >
                    <i class="mdi mdi-calculator-variant text-lg"></i>
                  </button>
                  <button
                    v-if="permissions.canManageSettings"
                    @click="handleClearAll"
                    class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Reset System Data"
                  >
                    <i class="mdi mdi-database-remove text-lg"></i>
                  </button>
               </div>
            </div>

          </div>
        </div>

        <!-- Transaction History List -->
        <ErrorBoundary 
          type="component" 
          :can-retry="true"
          title="Transaction List Error"
          @retry="handleTransactionListRetry"
        >
          <div class="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
            <TransactionList 
              @view-transaction="viewTransaction"
              @edit-disbursement="editDisbursement"
              @void-disbursement="voidDisbursement"
              @delete-disbursement="deleteDisbursement"
            />
          </div>
          </ErrorBoundary>
        </div>

        <!-- Requisitions Tab Content -->
        <div v-show="activeDashboardTab === 'requisitions'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <RequisitionIndex :is-embedded="true" />
        </div>

      </div>
    </div>

    <!-- Modals with Error Boundaries -->
    <ErrorBoundary 
      v-if="showTopUpModal"
      type="component" 
      :can-retry="true"
      title="Top-up Form Error"
      message="Unable to load top-up form"
      @retry="handleTopUpModalRetry"
      @reset="closeTopUpModal"
    >
      <TopUpForm 
        :is-open="showTopUpModal" 
        @close="closeTopUpModal"
        @success="onTopUpSuccess"
      />
    </ErrorBoundary>
    
    <ErrorBoundary 
      v-if="showDisbursementModal"
      type="component" 
      :can-retry="true"
      title="Disbursement Form Error"
      message="Unable to load disbursement form"
      @retry="handleDisbursementModalRetry"
      @reset="closeDisbursementModal"
    >
      <DisbursementForm 
        :is-open="showDisbursementModal" 
        @close="closeDisbursementModal"
        @success="onDisbursementSuccess"
      />
    </ErrorBoundary>

    <ErrorBoundary 
      v-if="showUploadModal"
      type="component" 
      :can-retry="true"
      title="Upload Excel Error"
      message="Unable to load upload form"
      @retry="handleUploadModalRetry"
      @reset="closeUploadModal"
    >
      <ExcelUploadModal 
        :is-open="showUploadModal" 
        @close="closeUploadModal"
        @success="onUploadSuccess"
      />
    </ErrorBoundary>
    
    <ErrorBoundary 
      v-if="selectedDisbursement && showEditDisbursementModal"
      type="component" 
      :can-retry="true"
      title="Edit Disbursement Form Error"
      message="Unable to load edit disbursement form"
      @retry="handleEditModalRetry"
      @reset="closeEditModal"
    >
      <DisbursementForm 
        :is-open="showEditDisbursementModal" 
        :edit-mode="true"
        :disbursement="selectedDisbursement"
        @close="closeEditModal"
        @success="onDisbursementSuccess"
      />
    </ErrorBoundary>
    
    <!-- Void Confirmation Modal -->
    <div
      v-if="showVoidModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-labelledby="void-modal-title"
      role="dialog"
      aria-modal="true"
      @click.self="closeVoidModal"
      style="background-color: rgba(0, 0, 0, 0.5);"
    >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="void-modal-title">
                Void Disbursement
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to void this disbursement? This action cannot be undone and will restore the amount to the available balance.
                </p>
                <div class="mt-4">
                  <label for="void_reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for voiding <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="void_reason"
                    v-model="voidReason"
                    rows="3"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Please provide a reason for voiding this disbursement..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmVoid"
              :disabled="!voidReason || isVoiding"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isVoiding" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isVoiding ? 'Voiding...' : 'Void Disbursement' }}
            </button>
            <button
              @click="closeVoidModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
    </div>
    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-labelledby="delete-modal-title"
      role="dialog"
      aria-modal="true"
      @click.self="closeDeleteModal"
      style="background-color: rgba(0, 0, 0, 0.5);"
    >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="delete-modal-title">
                Delete Disbursement
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to <strong>delete</strong> this disbursement? This will permanently remove it from the system and restore the amount to the available balance. 
                </p>
                <p class="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmDelete"
              :disabled="isDeleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeleting ? 'Deleting...' : 'Delete Permanently' }}
            </button>
            <button
              @click="closeDeleteModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
    </div>
    <TransactionDetailModal 
      v-if="showDetailModal && selectedTransaction"
      :is-open="showDetailModal"
      :transaction="selectedTransaction"
      @close="closeDetailModal"
    />
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePettyCashStore } from '../stores/pettyCashStore'
import { usePermissions } from '../composables/usePermissions'
import { useErrorHandler } from '../composables/useErrorHandler'
import { pettyCashService } from '../services/pettyCashService'
import type { PettyCashDisbursement } from '../types/pettyCash'
import BalanceCard from '../components/BalanceCard.vue'
import TransactionList from '../components/TransactionList.vue'
import TopUpForm from '../components/TopUpForm.vue'
import DisbursementForm from '../components/DisbursementForm.vue'
import ExcelUploadModal from '../components/ExcelUploadModal.vue'
import TransactionDetailModal from '../components/TransactionDetailModal.vue'
import RequisitionIndex from './requisitions/RequisitionIndex.vue'
import ErrorBoundary from '../components/ErrorBoundary.vue'

const activeDashboardTab = ref('overview')
const dashboardTabs = [
  { id: 'overview', name: 'Financial Overview', icon: 'mdi-view-dashboard-outline', activeIcon: 'mdi-view-dashboard' },
  { id: 'requisitions', name: 'Requisitions', icon: 'mdi-clipboard-list-outline', activeIcon: 'mdi-clipboard-list' }
]


const store = usePettyCashStore()
const route = useRoute()
const router = useRouter()
const permissions = usePermissions()
const { handleError, clearError, withErrorHandling } = useErrorHandler()

// Loading states
const isInitialLoading = ref(false)
const isRefreshing = ref(false)

// Modal states - Initialize with explicit values to prevent Vue reactivity issues
const showTopUpModal = ref(false)
const showDisbursementModal = ref(false)
const showEditDisbursementModal = ref(false)
const showUploadModal = ref(false)
const showDetailModal = ref(false)
const showVoidModal = ref(false)
const showDeleteModal = ref(false)
const selectedDisbursement = ref<PettyCashDisbursement | null>(null)
const selectedTransaction = ref<any>(null)
const voidReason = ref('')
const isVoiding = ref(false)
const isDeleting = ref(false)

// Modal conflict prevention
const activeModal = ref<string | null>(null)

// Computed properties with safe access
const currentBalance = computed(() => {
  // Create a balance object that uses the actual available balance
  const actualBalance = store.actualAvailableBalance || 0
  
  const result = {
    ...store.currentBalance,
    current_balance: {
      raw: actualBalance,
      formatted: `KES ${actualBalance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }
  
  console.log('🔍 PettyCashIndex currentBalance:', {
    actualAvailableBalance: store.actualAvailableBalance,
    actualBalance,
    storeCurrentBalance: store.currentBalance,
    totalTopUps: store.totalTopUpAmount,
    totalDisbursements: store.totalDisbursementAmount,
    result
  })
  
  return result
})
const summary = computed(() => store.summary)
const loading = computed(() => store.loading)
const isLoading = computed(() => store.isLoading)

// Safe computed properties with null checking
const safeSummary = computed(() => {
  try {
    return summary.value || {
      total_top_ups: 0,
      total_disbursements: 0,
      transaction_count: 0,
      average_disbursement: 0,
      top_up_count: 0,
      disbursement_count: 0,
      net_balance: 0,
      average_top_up: 0,
      current_balance: 0,
      balance_status: 'normal'
    }
  } catch (error) {
    // console.warn('Error accessing summary data:', error)
    return {
      total_top_ups: 0,
      total_disbursements: 0,
      transaction_count: 0,
      average_disbursement: 0,
      top_up_count: 0,
      disbursement_count: 0,
      net_balance: 0,
      average_top_up: 0,
      current_balance: 0,
      balance_status: 'normal'
    }
  }
})

const totalTransactions = computed(() => {
  try {
    if (!safeSummary.value) return 0
    const total = (safeSummary.value.top_up_count || 0) + (safeSummary.value.disbursement_count || 0)
    console.log('🔍 PettyCashIndex totalTransactions:', {
      topUpCount: safeSummary.value.top_up_count,
      disbursementCount: safeSummary.value.disbursement_count,
      total,
      storeTransactions: store.transactions.length,
      storeDisbursements: store.disbursements.length,
      storeTopUps: store.topUps.length
    })
    return total
  } catch (error) {
    // console.warn('Error calculating total transactions:', error)
    return 0
  }
})

// Debug computed to track modal states
const modalStates = computed(() => {
  return {
    topUp: showTopUpModal.value,
    disbursement: showDisbursementModal.value,
    edit: showEditDisbursementModal.value,
    upload: showUploadModal.value,
    void: showVoidModal.value
  }
})

// Watch for query parameters to initiate disbursement from requisition
watch(() => route.query, async (newQuery) => {
  if (newQuery.action === 'new_disbursement' && newQuery.requisition_id) {
    console.log('🚀 Initiating disbursement from requisition:', newQuery.requisition_id)
    
    // Clear the query params after reading them so they don't stick around
    const cleanQuery = { ...route.query }
    delete cleanQuery.action
    delete cleanQuery.requisition_id
    delete cleanQuery.amount
    delete cleanQuery.receiver
    delete cleanQuery.description
    
    router.replace({ query: cleanQuery })
    
    // Open modal
    await openDisbursementModal()
    
    // We'll use a globally accessible ref or event to pass this to the form
    // Since we're in the same component, we can wait for form to mount or use a store
    nextTick(() => {
      // Logic handled in DisbursementForm.vue via shared state or props
    })
  }
}, { immediate: true })

// Watch modal states for debugging (disabled in production)
// watch(modalStates, (newStates) => {
//   console.log('🔥 Modal states changed:', newStates)
// }, { deep: true })

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Enhanced refresh functionality with proper error handling
const handleRefreshAll = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  clearError()
  
  try {
    // Check permissions before refreshing
    permissions.requirePermission('finance.petty_cash.view')
    
    await withErrorHandling(async () => {
      await store.refreshAll()
    }, { context: 'refresh_all' })
  } catch (error: any) {
    handleError(error, { context: 'refresh_all' })
  } finally {
    isRefreshing.value = false
  }
}

const handlePrintVoucher = async () => {
    try {
        store.loading.voucher = true
        // Use current filters from the store
        const filters = {
            ...store.activeFilters.disbursements
        }
        
        await pettyCashService.downloadVoucherPdf(filters)
    } catch (error) {
        handleError(error, { context: 'handlePrintVoucher' })
    } finally {
        store.loading.voucher = false
    }
}



const handleRecalculate = async () => {
  if (confirm('This will audit all transactions and update the global balance based on the actual sum of top-ups and active disbursements. Proceed?')) {
    try {
      isRefreshing.value = true
      await store.recalculateBalance()
      alert('Balance has been successfully recalculated and synchronized.')
    } catch (error: any) {
      console.error('Failed to recalculate balance:', error)
      handleError(error, { context: 'recalculate_balance' })
    } finally {
      isRefreshing.value = false
    }
  }
}



const handleClearAll = async () => {
  if (confirm('CRITICAL WARNING: This will permanently delete ALL top-ups and disbursements. The current balance will be reset to zero. This action CANNOT be undone. Are you absolutely sure?')) {
    if (confirm('Please confirm ONE LAST TIME that you want to reset the entire Petty Cash system.')) {
      try {
        isInitialLoading.value = true
        await store.clearAllPettyCashData()
        alert('Petty Cash system has been successfully reset.')
      } catch (error: any) {
        console.error('Failed to clear all data:', error)
        handleError(error, { context: 'clear_all_data' })
      } finally {
        isInitialLoading.value = false
      }
    }
  }
}

// Enhanced retry handlers with proper error handling
const handleBalanceRetry = async () => {
  try {
    await withErrorHandling(async () => {
      await store.fetchCurrentBalance()
    }, { context: 'balance_retry' })
  } catch (error: any) {
    handleError(error, { context: 'balance_retry' })
  }
}

const handleSummaryRetry = async () => {
  try {
    await withErrorHandling(async () => {
      await store.fetchSummary()
    }, { context: 'summary_retry' })
  } catch (error: any) {
    handleError(error, { context: 'summary_retry' })
  }
}

const handleTransactionListRetry = async () => {
  try {
    await withErrorHandling(async () => {
      await store.fetchTransactions()
    }, { context: 'transaction_list_retry' })
  } catch (error: any) {
    handleError(error, { context: 'transaction_list_retry' })
  }
}

// Enhanced modal handlers with conflict prevention and permission checking
const openTopUpModal = async () => {
  console.log('🔥 openTopUpModal called')
  try {
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'topup') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    console.log('🔥 Opening top-up modal...')
    activeModal.value = 'topup'
    showTopUpModal.value = true
    await nextTick() // Ensure DOM is updated
    console.log('🔥 Top-up modal opened, showTopUpModal:', showTopUpModal.value, 'activeModal:', activeModal.value)
  } catch (error: any) {
    console.error('🔥 Error opening top-up modal:', error)
    handleError(error, { context: 'open_topup_modal' })
  }
}

const openDisbursementModal = async () => {
  console.log('🔥 openDisbursementModal called')
  try {
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'disbursement') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    console.log('🔥 Opening disbursement modal...')
    activeModal.value = 'disbursement'
    showDisbursementModal.value = true
    await nextTick() // Ensure DOM is updated
    console.log('🔥 Disbursement modal opened, showDisbursementModal:', showDisbursementModal.value, 'activeModal:', activeModal.value)
  } catch (error: any) {
    console.error('🔥 Error opening disbursement modal:', error)
    handleError(error, { context: 'open_disbursement_modal' })
  }
}

const openUploadModal = async () => {
  try {
    if (activeModal.value && activeModal.value !== 'upload') {
      return
    }
    activeModal.value = 'upload'
    showUploadModal.value = true
    await nextTick()
  } catch (error: any) {
    handleError(error, { context: 'open_upload_modal' })
  }
}

const handleUploadModalRetry = () => {
  openUploadModal()
}

const closeTopUpModal = async () => {
  try {
    showTopUpModal.value = false
    if (activeModal.value === 'topup') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing top-up modal:', error)
    handleError(error, { context: 'close_topup_modal' })
  }
}

const closeDisbursementModal = async () => {
  try {
    showDisbursementModal.value = false
    if (activeModal.value === 'disbursement') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing disbursement modal:', error)
    handleError(error, { context: 'close_disbursement_modal' })
  }
}

const closeUploadModal = async () => {
  try {
    showUploadModal.value = false
    if (activeModal.value === 'upload') {
      activeModal.value = null
    }
    await nextTick()
  } catch (error: any) {
    handleError(error, { context: 'close_upload_modal' })
  }
}

const onTopUpSuccess = async () => {
  try {
    await closeTopUpModal()
    // Store will automatically refresh data
  } catch (error) {
    console.error('Error handling top-up success:', error)
  }
}

const onDisbursementSuccess = async () => {
  try {
    await closeDisbursementModal()
    await closeEditModal()
    // Store will automatically refresh data
  } catch (error) {
    console.error('Error handling disbursement success:', error)
  }
}

const onUploadSuccess = async () => {
  try {
    // Modal stays open to show results, but we can refresh background data
    await store.refreshAll()
  } catch (error) {
    console.error('Error handling upload success:', error)
  }
}

const viewTransaction = (transaction: any) => {
  selectedTransaction.value = transaction
  showDetailModal.value = true
  activeModal.value = 'detail'
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedTransaction.value = null
  if (activeModal.value === 'detail') {
    activeModal.value = null
  }
}

const editDisbursement = async (disbursement: PettyCashDisbursement) => {
  try {
    // Check permissions before opening edit modal
    permissions.requirePermission('finance.petty_cash.edit_disbursement')
    
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'edit') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    activeModal.value = 'edit'
    selectedDisbursement.value = disbursement
    showEditDisbursementModal.value = true
    await nextTick()
  } catch (error: any) {
    console.error('Error opening edit modal:', error)
    handleError(error, { context: 'open_edit_modal' })
  }
}

const voidDisbursement = async (disbursement: PettyCashDisbursement) => {
  try {
    // Check permissions before opening void modal
    permissions.requirePermission('finance.petty_cash.void_disbursement')
    
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'void') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    activeModal.value = 'void'
    selectedDisbursement.value = disbursement
    showVoidModal.value = true
    await nextTick()
  } catch (error: any) {
    console.error('Error opening void modal:', error)
    handleError(error, { context: 'open_void_modal' })
  }
}

const deleteDisbursement = async (disbursement: PettyCashDisbursement) => {
  try {
    // Check permissions before opening delete modal
    permissions.requirePermission('finance.petty_cash.delete_disbursement')
    
    // Prevent modal conflicts
    if (activeModal.value && activeModal.value !== 'delete') {
      console.warn('Another modal is already open:', activeModal.value)
      return
    }
    
    activeModal.value = 'delete'
    selectedDisbursement.value = disbursement
    showDeleteModal.value = true
    await nextTick()
  } catch (error: any) {
    console.error('Error opening delete modal:', error)
    handleError(error, { context: 'open_delete_modal' })
  }
}

const closeEditModal = async () => {
  try {
    showEditDisbursementModal.value = false
    selectedDisbursement.value = null
    if (activeModal.value === 'edit') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing edit modal:', error)
    handleError(error, { context: 'close_edit_modal' })
  }
}

const closeVoidModal = async () => {
  try {
    showVoidModal.value = false
    selectedDisbursement.value = null
    voidReason.value = ''
    if (activeModal.value === 'void') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing void modal:', error)
    handleError(error, { context: 'close_void_modal' })
  }
}

const closeDeleteModal = async () => {
  try {
    showDeleteModal.value = false
    selectedDisbursement.value = null
    if (activeModal.value === 'delete') {
      activeModal.value = null
    }
    await nextTick() // Ensure DOM is updated
  } catch (error: any) {
    console.error('Error closing delete modal:', error)
    handleError(error, { context: 'close_delete_modal' })
  }
}

const confirmVoid = async () => {
  if (!selectedDisbursement.value || !voidReason.value) return
  
  isVoiding.value = true
  try {
    await withErrorHandling(async () => {
      await store.voidDisbursement(selectedDisbursement.value!.id, { void_reason: voidReason.value })
    }, { context: 'void_disbursement' })
    
    await closeVoidModal()
  } catch (error: any) {
    handleError(error, { context: 'void_disbursement' })
  } finally {
    isVoiding.value = false
  }
}

const confirmDelete = async () => {
  if (!selectedDisbursement.value) return
  
  isDeleting.value = true
  try {
    await withErrorHandling(async () => {
      await store.deleteDisbursement(selectedDisbursement.value!.id)
    }, { context: 'delete_disbursement' })
    
    await closeDeleteModal()
    // Data refresh is handled by the store
  } catch (error: any) {
    handleError(error, { context: 'delete_disbursement' })
  } finally {
    isDeleting.value = false
  }
}

// Error boundary retry handlers
const handleTopUpModalRetry = async () => {
  try {
    await nextTick()
    // Modal should automatically re-render after error boundary retry
  } catch (error: any) {
    handleError(error, { context: 'topup_modal_retry' })
  }
}

const handleDisbursementModalRetry = async () => {
  try {
    await nextTick()
    // Modal should automatically re-render after error boundary retry
  } catch (error: any) {
    handleError(error, { context: 'disbursement_modal_retry' })
  }
}

const handleEditModalRetry = async () => {
  try {
    await nextTick()
    // Modal should automatically re-render after error boundary retry
  } catch (error: any) {
    handleError(error, { context: 'edit_modal_retry' })
  }
}

// Main component error boundary handlers
const handleRetry = async () => {
  try {
    isInitialLoading.value = true
    clearError()
    await initializeComponent()
  } catch (error: any) {
    handleError(error, { context: 'main_component_retry' })
  } finally {
    isInitialLoading.value = false
  }
}

const handleReset = async () => {
  try {
    // Reset all modal states
    showTopUpModal.value = false
    showDisbursementModal.value = false
    showEditDisbursementModal.value = false
    showVoidModal.value = false
    selectedDisbursement.value = null
    voidReason.value = ''
    activeModal.value = null
    
    // Clear errors and reinitialize
    clearError()
    await nextTick()
    await initializeComponent()
  } catch (error: any) {
    handleError(error, { context: 'main_component_reset' })
  }
}

// Safe component initialization with permission checking
const initializeComponent = async () => {
  try {
    // Check basic view permissions
    permissions.requirePermission('finance.petty_cash.view')
    
    // Use nextTick to ensure component is fully mounted
    await nextTick()
    
    console.log('🔍 PettyCashIndex initializing component...')
    
    // Initialize data safely with error handling
    await withErrorHandling(async () => {
      await store.refreshAll()
      console.log('🔍 PettyCashIndex after refreshAll:', {
        transactions: store.transactions.length,
        disbursements: store.disbursements.length,
        topUps: store.topUps.length,
        actualBalance: store.actualAvailableBalance
      })
      // Debug store state
      store.debugStoreState()
    }, { context: 'component_initialization' })
  } catch (error: any) {
    // Log the error but don't re-throw to prevent loading state from hanging
    console.error('Component initialization failed:', error)
    handleError(error, { context: 'component_initialization' })
    // Don't re-throw - let the component render with error state
  }
}

onMounted(async () => {
  try {
    isInitialLoading.value = true
    await initializeComponent()
  } catch (error) {
    console.error('Error initializing petty cash component:', error)
    // Error is already handled by initializeComponent
  } finally {
    isInitialLoading.value = false
  }
})


</script>