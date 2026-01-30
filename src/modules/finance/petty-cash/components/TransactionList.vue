<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Transaction History
        </h3>
        <div class="mt-3 sm:mt-0 flex space-x-3">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search transactions..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Filters Toggle -->
          <button
            @click="showFilters = !showFilters"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
            </svg>
            Filters
          </button>

          <!-- Bulk Actions Button (New) -->
          <div v-if="selectedIds.length > 0" class="flex items-center space-x-2 animate-fade-in">
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
              <option value="crs">CRS</option>
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

      <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date & Type
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Details
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Classification
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount (KES)
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr 
            v-for="transaction in allTransactions" 
            :key="transaction.id + '-' + transaction.type"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
            :class="{ 
              'bg-blue-50/30 dark:bg-blue-900/10': isSelected(transaction),
              'bg-gray-50/50 dark:bg-gray-800/50': transaction.type === 'top_up',
              'border-l-4 border-primary-500': transaction.type === 'top_up'
            }"
          >
            <!-- Checkbox -->
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                v-if="transaction.type === 'disbursement'"
                type="checkbox"
                :checked="isSelected(transaction)"
                @change="toggleSelection(transaction)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div v-else class="w-4"></div>
            </td>

            <!-- Date & Type -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-start" :class="{ 'pl-4': transaction.type === 'disbursement' }">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatDateOnly(transaction.created_at.raw) }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTimeOnly(transaction.created_at.raw) }}
                  </span>
                  <div class="mt-1 flex items-center">
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight"
                      :class="transaction.type === 'top_up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'"
                    >
                      <svg v-if="transaction.type === 'disbursement'" class="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 8 8"><path d="M0 0l4 4 4-4v2l-4 4-4-4z"/></svg>
                      {{ transaction.type === 'top_up' ? 'Top-up' : 'Disbursement' }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Details -->
              <div class="flex flex-col max-w-md">
                <div class="flex items-center space-x-2 overflow-hidden">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {{ transaction.type === 'top_up' ? 'Wallet Top-up' : (transaction.receiver || 'General Disbursement') }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 italic mb-1">
                  "{{ transaction.description }}"
                </p>
                <div class="flex flex-wrap gap-2 items-center mt-1">
                  <span v-if="transaction.account" class="inline-flex items-center text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    {{ transaction.account }}
                  </span>
                  <span v-if="transaction.project_name" class="inline-flex items-center text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    {{ transaction.project_name }}
                  </span>
                  <span v-if="transaction.job_number" class="text-[10px] text-gray-400 font-mono">
                    #{{ transaction.job_number }}
                  </span>
                </div>
              </div>

            <!-- Classification -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="transaction.classification" class="flex flex-col space-y-1">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium self-start"
                  :class="getClassificationBadgeClass(transaction.classification.value)"
                >
                  {{ transaction.classification.label }}
                </span>
                <span v-if="transaction.payment_method" class="text-[10px] text-gray-500 uppercase tracking-wider ml-1">
                  via {{ transaction.payment_method.label }}
                </span>
              </div>
              <div v-else>
                 <span v-if="transaction.payment_method" class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {{ transaction.payment_method.label }}
                 </span>
              </div>
            </td>

            <!-- Amount -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex flex-col items-end">
                <span 
                  class="text-sm font-bold"
                  :class="transaction.type === 'top_up' ? 'text-green-600 dark:text-green-400' : getDisbursementAmountColor(transaction.status?.value)"
                >
                  {{ transaction.type === 'top_up' ? '+' : '-' }}{{ transaction.amount.formatted.replace('KES ', '') }}
                </span>
                
                <!-- Previous Balance for Top-ups -->
                <span 
                  v-if="transaction.type === 'top_up' && transaction.previous_balance !== undefined"
                  class="text-[10px] text-gray-500 dark:text-gray-400 mt-1"
                >
                  Balance before: KES {{ Number(transaction.previous_balance || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </span>
                
                <span v-if="transaction.status?.is_voided" class="text-[9px] font-bold text-red-500 uppercase tracking-widest leading-none mt-1">
                  VOIDED
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-1">
                <button
                  @click="viewTransaction(transaction)"
                  class="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
                  title="View full details"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>

                <!-- Group Actions (on Top-up) -->
                <button
                  v-if="transaction.type === 'top_up' && !transaction.is_archived"
                  @click="archiveGroup(transaction.original_id)"
                  class="flex items-center px-2 py-1 text-[10px] font-bold text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 rounded bg-white dark:bg-gray-800 transition-colors mr-2"
                  title="Archive top-up and all its related disbursements"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  ARCHIVE GROUP
                </button>

                <button
                  v-if="transaction.type === 'disbursement' && transaction.can_edit"
                  @click="editDisbursement(transaction)"
                  class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                  title="Edit transaction"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  v-if="transaction.type === 'disbursement' && transaction.can_void"
                  @click="voidDisbursement(transaction.original_data)"
                  class="p-1.5 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                  title="Void disbursement"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"></path>
                  </svg>
                </button>
                <button
                  v-if="!transaction.is_archived"
                  @click="archiveTransaction(transaction.original_id, transaction.type)"
                  class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/30 rounded-full transition-colors"
                  :title="transaction.type === 'top_up' ? 'Archive only this top-up' : 'Archive this disbursement'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </button>
                <button
                  v-if="transaction.type === 'disbursement' && transaction.can_delete"
                  @click="deleteDisbursement(transaction.original_data)"
                  class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  title="Delete disbursement"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
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
import type { PettyCashDisbursement, TransactionFilters } from '../types/pettyCash'

interface Emits {
  (e: 'view-transaction', transaction: any): void
  (e: 'edit-disbursement', disbursement: PettyCashDisbursement): void
  (e: 'void-disbursement', disbursement: PettyCashDisbursement): void
  (e: 'delete-disbursement', disbursement: PettyCashDisbursement): void
}

const emit = defineEmits<Emits>()

const store = usePettyCashStore()
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
    crs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
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

const voidDisbursement = (disbursement: PettyCashDisbursement) => {
  emit('void-disbursement', disbursement)
}

const deleteDisbursement = (disbursement: PettyCashDisbursement) => {
  emit('delete-disbursement', disbursement)
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