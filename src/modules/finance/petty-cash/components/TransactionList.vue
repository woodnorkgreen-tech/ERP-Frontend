<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 class="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i class="mdi mdi-history text-slate-400"></i>
          Transaction History
        </h3>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search -->
          <div class="relative group">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search transactions..."
              class="block w-64 pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700/60 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Filters Toggle -->
          <button
            @click="showFilters = !showFilters"
            :class="[
              'inline-flex items-center px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm',
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            ]"
          >
            <i class="mdi mdi-filter-variant mr-2 text-lg"></i>
            Filters
          </button>

          <!-- Bulk Actions Button -->
          <div v-if="selectedIds.length > 0 && isSuperAdmin" class="flex items-center space-x-2 animate-fade-in bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              @click="confirmBulkDelete"
              class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Selected ({{ selectedIds.length }})
            </button>
            <button
              @click="confirmBulkArchive"
              class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
              Archive Selected ({{ selectedIds.length }})
            </button>
            <button
              @click="clearSelection"
              class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Archive Status Toggle (New) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">View Mode</label>
            <select
              v-model="filters.is_archived"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option :value="false">Current History</option>
              <option :value="true">Archived Only</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="voided">Voided</option>
            </select>
          </div>

          <!-- Classification Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classification</label>
            <select
              v-model="filters.classification"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="agencies">Agencies</option>
              <option value="admin">Administration</option>
              <option value="operations">Operations</option>
              <option value="event_planners">Event Planners</option>
              <option value="corporates">Corporates</option>
              <option value="csr">CSR</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Payment Method Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
            <select
              v-model="filters.payment_method"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              v-model="filters.start_date"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              v-model="filters.end_date"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="clearFilters"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear
          </button>
          <button
            @click="applyFilters"
            class="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
    
    <!-- Transaction Table -->
    <div class="overflow-x-auto">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="allTransactions.length === 0" class="text-center py-12">
        <div class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">No transactions found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          {{ hasActiveFilters ? 'Try adjusting your filters or search terms to find what you looking for.' : 'There are no transactions recorded yet. Start by adding a top-up.' }}
        </p>
      </div>

      <table v-else class="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
        <thead class="bg-slate-50 dark:bg-slate-800/80">
          <tr>
            <th scope="col" class="px-4 py-4 text-left">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all cursor-pointer"
                />
              </div>
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Date
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Type
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Beneficiary
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Purpose / Description
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Project Context
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Classification
            </th>
            <th scope="col" class="px-4 py-4 text-left text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Ref / Method
            </th>
            <th scope="col" class="px-4 py-4 text-right text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Amount (KES)
            </th>
            <th scope="col" class="px-4 py-4 text-right text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          <tr 
            v-for="transaction in allTransactions" 
            :key="transaction.id + '-' + transaction.type"
            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all group"
            :class="{ 
              'bg-blue-50/30 dark:bg-blue-900/10': isSelected(transaction),
              'bg-slate-50/50 dark:bg-slate-800/30': transaction.type === 'top_up',
            }"
          >
            <!-- Checkbox -->
            <td class="px-4 py-4 whitespace-nowrap">
              <input
                v-if="transaction.type === 'disbursement'"
                type="checkbox"
                :checked="isSelected(transaction)"
                @change="toggleSelection(transaction)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition-all"
              />
              <div v-else class="flex justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Top-up (Credit)"></div>
              </div>
            </td>

            <!-- Date -->
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <span class="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                  {{ formatDateOnly(transaction.created_at.raw) }}
                </span>
                <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  {{ formatTimeOnly(transaction.created_at.raw) }}
                </span>
              </div>
            </td>

            <!-- Type -->
            <td class="px-4 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border shadow-sm"
                :class="transaction.type === 'top_up' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                  : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'"
              >
                {{ transaction.type === 'top_up' ? 'Credit' : 'Debit' }}
              </span>
            </td>

            <!-- Beneficiary -->
            <td class="px-4 py-4">
              <div class="flex items-center min-w-[140px]">
                <div class="flex flex-col">
                  <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                    {{ transaction.type === 'top_up' ? 'Main Account' : (transaction.receiver || 'General Payee') }}
                  </span>
                  
                  <!-- Receipt Status -->
                  <div class="mt-1.5">
                    <span 
                      v-if="transaction.received_at" 
                      class="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded"
                    >
                      <i class="mdi mdi-check-circle text-[10px]"></i> Confirmed
                    </span>
                    <span 
                      v-else-if="transaction.type === 'disbursement' && transaction.requisition_id" 
                      class="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded"
                    >
                      <i class="mdi mdi-clock-outline text-[10px]"></i> Awaiting
                    </span>
                    
                    <!-- Previous Balance for Top-ups -->
                    <span 
                      v-if="transaction.type === 'top_up' && transaction.previous_balance != null" 
                      class="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700/60"
                    >
                      <i class="mdi mdi-scale-balance text-[10px]"></i> Prev: KES {{ formatCurrency(transaction.previous_balance) }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Purpose -->
            <td class="px-4 py-4">
              <div class="max-w-[200px]">
                <p class="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic line-clamp-2">
                  "{{ transaction.description || 'No description provided' }}"
                </p>
              </div>
            </td>

            <!-- Project Context -->
            <td class="px-4 py-4">
              <div class="flex flex-col gap-1.5 min-w-[150px]">
                <div v-if="transaction.project_name" class="flex items-center gap-1.5">
                  <i class="mdi mdi-folder-outline text-slate-400 text-xs"></i>
                  <span class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    {{ transaction.project_name }}
                  </span>
                </div>
                <div v-if="transaction.job_number" class="flex items-center gap-1.5">
                  <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                    #{{ transaction.job_number }}
                  </span>
                </div>
                <div v-if="!transaction.project_name && !transaction.job_number" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                  General Expense
                </div>
              </div>
            </td>

            <!-- Classification -->
            <td class="px-4 py-4 whitespace-nowrap">
              <div v-if="transaction.classification" class="flex items-center">
                <span 
                  class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                  :class="getClassificationBadgeClass(transaction.classification.value)"
                >
                  {{ transaction.classification.label }}
                </span>
              </div>
              <div v-else class="text-xs text-slate-400">-</div>
            </td>

            <!-- Ref / Method -->
            <td class="px-4 py-4">
              <div class="flex flex-col gap-1.5 min-w-[140px]">
                <!-- Payment Method -->
                <div v-if="transaction.payment_method" class="flex items-center gap-1.5">
                  <i class="mdi mdi-credit-card-outline text-slate-400 text-xs"></i>
                  <span class="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    {{ transaction.payment_method.label }}
                  </span>
                </div>
                
                <!-- Account / Venue -->
                <div class="flex flex-wrap gap-1">
                  <span v-if="transaction.account" class="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700/60">
                    {{ transaction.account }}
                  </span>
                  <span v-if="transaction.transaction_code" class="text-[8px] font-black text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded font-mono">
                    {{ transaction.transaction_code }}
                  </span>
                </div>
              </div>
            </td>

            <!-- Amount -->
            <td class="px-4 py-4 whitespace-nowrap text-right">
              <div class="flex flex-col items-end">
                <span 
                  class="text-sm font-black tracking-tighter"
                  :class="transaction.type === 'top_up' ? 'text-emerald-600 dark:text-emerald-400' : getDisbursementAmountColor(transaction.status?.value)"
                >
                  {{ transaction.type === 'top_up' ? '+' : '-' }}{{ transaction.amount.formatted.replace('KES ', '') }}
                </span>
                
                <!-- Extra Costs -->
                <span 
                  v-if="transaction.type === 'disbursement' && transaction.transaction_cost && transaction.transaction_cost.raw > 0"
                  class="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1"
                >
                  Fee: KES {{ transaction.transaction_cost.formatted.replace('KES ', '') }}
                </span>
                
                <span v-if="transaction.status?.is_voided" class="text-[8px] font-black text-red-500 uppercase tracking-[0.2em] leading-none mt-1.5">
                  VOIDED
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  @click="viewTransaction(transaction)"
                  class="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  title="Full View"
                >
                  <i class="mdi mdi-eye-outline text-lg"></i>
                </button>

                <button
                  v-if="(transaction.type === 'disbursement' && transaction.can_edit && isSuperAdmin) || (transaction.type === 'top_up' && isSuperAdmin)"
                  @click="transaction.type === 'top_up' ? editTopUp(transaction) : editDisbursement(transaction)"
                  class="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all"
                  :title="transaction.type === 'top_up' ? 'Modify' : 'Modify'"
                >
                  <i class="mdi mdi-pencil-outline text-lg"></i>
                </button>

                <button
                  v-if="!transaction.is_archived && isSuperAdmin"
                  @click="archiveTransaction(transaction.original_id, transaction.type)"
                  class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  title="Archive"
                >
                  <i class="mdi mdi-archive-outline text-lg"></i>
                </button>
                
                <button
                  v-if="(transaction.type === 'disbursement' && transaction.can_delete && isSuperAdmin) || (transaction.type === 'top_up' && isSuperAdmin)"
                  @click="transaction.type === 'top_up' ? deleteTopUp(transaction.original_data) : deleteDisbursement(transaction.original_data)"
                  class="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  :title="transaction.type === 'top_up' ? 'Remove Top-up' : 'Remove'"
                >
                  <i class="mdi mdi-trash-can-outline text-lg"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="hasPagination" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="goToPreviousPage"
            :disabled="currentPage <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="goToNextPage"
            :disabled="currentPage >= totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="goToPreviousPage"
                :disabled="currentPage <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 dark:bg-blue-900/50 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>

              <button
                @click="goToNextPage"
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { usePettyCashStore } from '../stores/pettyCashStore'
import { useAuth } from '@/composables/useAuth'
import type { PettyCashDisbursement, TransactionFilters } from '../types/pettyCash'

interface Emits {
  (e: 'view-transaction', transaction: any): void
  (e: 'edit-disbursement', disbursement: PettyCashDisbursement): void
  (e: 'edit-top-up', topUp: any): void
  (e: 'void-disbursement', disbursement: PettyCashDisbursement): void
  (e: 'delete-disbursement', disbursement: PettyCashDisbursement): void
  (e: 'delete-top-up', topUp: any): void
}

const emit = defineEmits<Emits>()

const store = usePettyCashStore()
const { user } = useAuth()

const isSuperAdmin = computed(() => {
  return user.value?.roles?.includes('Super Admin') || false
})

const showFilters = ref(false)
const searchQuery = ref('')
const editingTransaction = ref<string | null>(null)
const editForm = reactive({
  receiver: '',
  account: '',
  description: '',
  project_name: ''
})

// Selection state
const selectedIds = ref<number[]>([])
const isBulkDeleting = ref(false)

const isSelected = (transaction: any) => {
  if (transaction.type !== 'disbursement') return false
  return selectedIds.value.includes(transaction.original_data.id)
}

const toggleSelection = (transaction: any) => {
  if (transaction.type !== 'disbursement') return
  
  const id = transaction.original_data.id
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const isAllSelected = computed(() => {
  const disbursementIds = allTransactions.value
    .filter(t => t.type === 'disbursement')
    .map(t => t.original_data.id)
  
  return disbursementIds.length > 0 && 
         disbursementIds.every(id => selectedIds.value.includes(id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Clear selection for current page
    const currentDisbursementIds = allTransactions.value
      .filter(t => t.type === 'disbursement')
      .map(t => t.original_data.id)
    
    selectedIds.value = selectedIds.value.filter(id => !currentDisbursementIds.includes(id))
  } else {
    // Select all disbursements on current page
    const currentDisbursementIds = allTransactions.value
      .filter(t => t.type === 'disbursement')
      .map(t => t.original_data.id)
    
    currentDisbursementIds.forEach(id => {
      if (!selectedIds.value.includes(id)) {
        selectedIds.value.push(id)
      }
    })
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

const confirmBulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  
  if (confirm(`Are you sure you want to permanently delete ${selectedIds.value.length} selected disbursements? This action cannot be undone.`)) {
    try {
      isBulkDeleting.value = true
      await store.bulkDeleteDisbursements(selectedIds.value)
      selectedIds.value = []
      // Success will trigger data refresh via store
    } catch (error) {
      console.error('Failed to bulk delete:', error)
      alert('Failed to delete some disbursements. Please try again.')
    } finally {
      isBulkDeleting.value = false
    }
  }
}

// Filters
const filters = reactive({
  status: '',
  classification: '',
  payment_method: '',
  start_date: '',
  end_date: '',
  is_archived: false
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const allTransactions = computed(() => store.transactions)
const pagination = computed(() => store.pagination.transactions)
const loading = computed(() => store.loading.transactions)

// Pagination info
const totalItems = computed(() => pagination.value.total)
const totalPages = computed(() => pagination.value.last_page)
const hasPagination = computed(() => totalPages.value > 1)

const hasActiveFilters = computed(() => {
  return filters.status !== '' ||
    filters.classification !== '' ||
    filters.payment_method !== '' ||
    filters.start_date !== '' ||
    filters.end_date !== '' ||
    filters.is_archived === true ||
    searchQuery.value !== ''
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value

  // Always show first page
  if (total > 0) pages.push(1)

  // Show pages around current page
  for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(total - 1, currentPage.value + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  // Always show last page
  if (total > 1 && !pages.includes(total)) pages.push(total)

  return pages.sort((a, b) => a - b)
})

// Methods
const formatDateOnly = (date: string): string => {
  return new Date(date).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number | string | null): string => {
  if (amount === null || amount === undefined) return '0.00'
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  if (Number.isNaN(val)) return '0.00'
  return val.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatTimeOnly = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDisbursementIconBg = (status: string): string => {
  return status === 'voided' ? 'bg-red-500' : 'bg-blue-500'
}

const getDisbursementAmountColor = (status: string): string => {
  return status === 'voided' 
    ? 'text-red-400 dark:text-red-500 line-through' 
    : 'text-red-600 dark:text-red-400'
}

const getTransactionIconBg = (transaction: any): string => {
  if (transaction.type === 'top_up') {
    return 'bg-green-500'
  }
  return transaction.status?.is_voided ? 'bg-red-500' : 'bg-blue-500'
}

const getTransactionAmountColor = (transaction: any): string => {
  if (transaction.type === 'top_up') {
    return 'text-green-600 dark:text-green-400'
  }
  return transaction.status?.is_voided 
    ? 'text-red-400 dark:text-red-500 line-through' 
    : 'text-red-600 dark:text-red-400'
}

const getClassificationBadgeClass = (classification: string): string => {
  const classes = {
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    event_planners: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    corporates: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    csr: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    agencies: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'
  }
  return classes[classification as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
}


const viewTransaction = (transaction: any) => {
  emit('view-transaction', transaction)
}
const editDisbursement = (transaction: any) => {
  // Pass the transaction with original_id properly set
  const disbursementToEdit = {
    ...transaction,
    id: transaction.original_id || transaction.id,
    ...transaction.original_data
  }
  emit('edit-disbursement', disbursementToEdit)
}

const editTopUp = (transaction: any) => {
  const topUpToEdit = {
    ...transaction,
    id: transaction.original_id || transaction.id,
    ...transaction.original_data
  }
  emit('edit-top-up', topUpToEdit)
}

const voidDisbursement = (disbursement: PettyCashDisbursement) => {
  emit('void-disbursement', disbursement)
}

const deleteDisbursement = (disbursement: PettyCashDisbursement) => {
  emit('delete-disbursement', disbursement)
}

const deleteTopUp = (topUp: any) => {
  emit('delete-top-up', topUp)
}

const archiveTransaction = async (id: number, type: 'disbursement' | 'top_up') => {
  if (confirm('Are you sure you want to archive this transaction? It will be removed from your active history but remain accessible in the archives.')) {
    try {
      await store.archiveTransaction(id, type)
    } catch (error) {
      console.error('Failed to archive transaction:', error)
      alert('Failed to archive transaction. Please try again.')
    }
  }
}

const archiveGroup = async (topUpId: number) => {
    if (confirm('Are you sure you want to archive this Top-up and ALL its disbursements? This is the best way to clean up completed budget cycles.')) {
        try {
            await store.archiveTransactionGroup(topUpId)
        } catch (error) {
            console.error('Failed to archive group:', error)
            alert('Failed to archive transaction group. Please try again.')
        }
    }
}

const confirmBulkArchive = async () => {
    if (confirm(`Are you sure you want to archive ${selectedIds.value.length} selected transactions?`)) {
        try {
            await store.bulkArchiveTransactions(selectedIds.value)
            selectedIds.value = []
        } catch (error) {
            console.error('Failed to bulk archive:', error)
            alert('Failed to archive some transactions. Please try again.')
        }
    }
}

// Inline editing methods
const startInlineEdit = (transaction: any) => {
  editingTransaction.value = transaction.id
  editForm.receiver = transaction.receiver || ''
  editForm.account = transaction.account || ''
  editForm.description = transaction.description || ''
  editForm.project_name = transaction.project_name || ''
}

const saveInlineEdit = async (transaction: any) => {
  try {
    const updateData = {
      receiver: editForm.receiver,
      account: editForm.account,
      description: editForm.description,
      project_name: editForm.project_name
    }

    await store.updateDisbursement(transaction.original_data.id, updateData)
    editingTransaction.value = null

    // Clear form
    Object.assign(editForm, {
      receiver: '',
      account: '',
      description: '',
      project_name: ''
    })
  } catch (error) {
    console.error('Failed to save inline edit:', error)
    // Could show error message here
  }
}

const cancelInlineEdit = () => {
  editingTransaction.value = null
  Object.assign(editForm, {
    receiver: '',
    account: '',
    description: '',
    project_name: ''
  })
}

const applyFilters = async () => {
  // Reset to first page when applying filters
  currentPage.value = 1
  await fetchTransactions()
}

const clearFilters = async () => {
  Object.keys(filters).forEach(key => {
    (filters as any)[key] = key === 'is_archived' ? false : ''
  })
  searchQuery.value = ''
  // Reset to first page when clearing filters
  currentPage.value = 1
  await fetchTransactions()
}

// Server-side pagination methods
const fetchTransactions = async () => {
  await store.fetchTransactions({
    ...filters,
    show_archived: filters.is_archived,
    search: searchQuery.value,
    page: currentPage.value,
    per_page: itemsPerPage
  })
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await fetchTransactions()
  }
}

const goToPreviousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchTransactions()
  }
}

const goToNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchTransactions()
  }
}

// Watchers
let searchTimeout: number
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500) // Debounce search
})

// Watch for filters to reset pagination
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Watch for store data changes to ensure reactivity
watch(() => store.transactions.length, () => {
  console.log('🔄 Transactions updated')
})

// Also watch for balance and summary updates
watch(() => store.currentBalance, () => {
  console.log('🔄 Balance updated')
}, { deep: true })

watch(() => store.summary, () => {
  console.log('🔄 Summary updated')
}, { deep: true })

// Safe component initialization
onMounted(async () => {
  try {
    // Use nextTick to ensure component is fully mounted
    await nextTick()
    
    // Unified transaction fetch
    await fetchTransactions()
    
    console.log('🔍 TransactionList mounted:', {
      allTransactionsCount: allTransactions.value.length
    })
  } catch (error) {
    console.error('Error initializing transaction list:', error)
  }
})
</script>