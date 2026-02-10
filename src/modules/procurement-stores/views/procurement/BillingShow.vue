<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/procurement/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Home
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/procurement/billing" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Bills
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">{{ bill.bill_number || 'Bill Details' }}</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bill Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ bill.bill_number }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="downloadPdf" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Download PDF
        </button>
        <button
          v-if="totalSelectedBalance > 0"
          @click="openPaymentModal"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Record Payment
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading bill details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-700 p-8">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error Loading Bill</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <div class="mt-6">
          <router-link to="/procurement/billing" class="text-blue-600 hover:text-blue-500">
            ← Back to Bills
          </router-link>
        </div>
      </div>
    </div>

    <!-- Bill Details -->
    <div v-else-if="bill.id">
      <!-- Bill Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bill Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bill Number</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ bill.bill_number }}</p>
          </div>
          
          <!-- Multi-select PO Dropdown -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Select Pending Bills for Payment (Same Supplier)
            </label>
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="w-full px-4 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex justify-between items-center"
              >
                <span v-if="selectedBills.length === 0">Select bills to pay...</span>
                <span v-else>{{ selectedBills.length }} bill(s) selected - Total: KES {{ formatNumber(totalSelectedBalance) }}</span>
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown with checkboxes -->
              <div v-if="showDropdown" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <!-- Select All Option -->
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                      class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select All ({{ totalBillsCount }} bills) - KES {{ formatNumber(totalAllBillsBalance) }}
                    </span>
                  </label>
                </div>
                
                <!-- Current Bill -->
                <div class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :value="bill.id"
                      v-model="selectedBills"
                      :disabled="bill.balance <= 0"
                      class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div class="ml-2 flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ bill.bill_number }} (PO: {{ bill.purchase_order?.po_number || 'N/A' }}) - Current
                      </div>
                      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Balance: KES {{ formatNumber(bill.balance) }}</span>
                        <router-link 
                          v-if="bill.purchase_order?.id"
                          :to="`/procurement/purchase-order/${bill.purchase_order.id}`"
                          @click.stop
                          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          title="View PO Details"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                          View PO
                        </router-link>
                      </div>
                    </div>
                  </label>
                </div>
                
                <!-- Other Pending Bills -->
                <div v-for="pendingBill in allPendingBills" :key="pendingBill.id" class="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :value="pendingBill.id"
                      v-model="selectedBills"
                      class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div class="ml-2 flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ pendingBill.bill_number }} (PO: {{ pendingBill.po_number || 'N/A' }})
                      </div>
                      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Balance: KES {{ formatNumber(pendingBill.balance) }}</span>
                        <router-link 
                          v-if="pendingBill.purchase_order_id"
                          :to="`/procurement/purchase-order/${pendingBill.purchase_order_id}`"
                          @click.stop
                          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          title="View PO Details"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                          View PO
                        </router-link>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Selected Bills Summary -->
            <div v-if="selectedBills.length > 0" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                {{ selectedBills.length }} bill(s) selected for payment - Total: KES {{ formatNumber(totalSelectedBalance) }}
              </p>
              <div class="space-y-1 max-h-32 overflow-y-auto">
                <div v-for="billId in selectedBills" :key="billId" class="flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-blue-700 dark:text-blue-300">
                      {{ getBillById(billId)?.bill_number }}
                      (PO: {{ getBillById(billId)?.po_number || getBillById(billId)?.purchase_order?.po_number || 'N/A' }})
                    </span>
                    <router-link 
                      v-if="getBillById(billId)?.purchase_order_id || getBillById(billId)?.purchase_order?.id"
                      :to="`/procurement/purchase-order/${getBillById(billId)?.purchase_order_id || getBillById(billId)?.purchase_order?.id}`"
                      @click.stop
                      class="text-blue-600 hover:text-blue-800"
                      title="View PO Details"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </router-link>
                  </div>
                  <span class="font-medium">KES {{ formatNumber(getBillById(billId)?.balance || 0) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusClass(bill.status)]">
              {{ formatStatus(bill.status) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Supplier</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ bill.supplier?.supplier_name || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bill Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(bill.bill_date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(bill.due_date) }}</p>
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Summary {{ selectedBills.length > 1 ? `(Multiple Bills)` : '' }}
          </h3>
          
          <!-- Single Bill View -->
          <div v-if="selectedBills.length === 1" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <label class="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Original Amount</label>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">KES {{ formatNumber(getBillById(selectedBills[0])?.amount || 0) }}</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <label class="block text-sm font-medium text-green-600 dark:text-green-400 mb-1">Already Paid</label>
              <p class="text-2xl font-bold text-green-900 dark:text-green-300">KES {{ formatNumber(getBillById(selectedBills[0])?.paid_amount || 0) }}</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <label class="block text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">Balance Due</label>
              <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-300">KES {{ formatNumber(getBillById(selectedBills[0])?.balance || 0) }}</p>
            </div>
          </div>
          
          <!-- Multiple Bills View -->
          <div v-else-if="selectedBills.length > 1" class="space-y-4">
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Total for {{ selectedBills.length }} Selected Bills</div>
                  <div class="text-3xl font-bold text-purple-900 dark:text-purple-300">
                    KES {{ formatNumber(totalSelectedBalance) }}
                  </div>
                </div>
                <button
                  @click="openPaymentModal"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Pay All Selected
                </button>
              </div>
            </div>
            
            <!-- Individual Bill Breakdown -->
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Breakdown:</p>
              <div v-for="billId in selectedBills" :key="billId" 
                   class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ getBillById(billId)?.bill_number }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    PO: {{ getBillById(billId)?.po_number || getBillById(billId)?.purchase_order?.po_number || 'N/A' }}
                    <router-link 
                      v-if="getBillById(billId)?.purchase_order_id || getBillById(billId)?.purchase_order?.id"
                      :to="`/procurement/purchase-order/${getBillById(billId)?.purchase_order_id || getBillById(billId)?.purchase_order?.id}`"
                      @click.stop
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View PO Details"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </router-link>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900 dark:text-white">
                    KES {{ formatNumber(getBillById(billId)?.balance || 0) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getBillStatus(getBillById(billId)?.status) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Bills Selected Message -->
          <div v-else class="text-center py-4">
            <p class="text-gray-500 dark:text-gray-400">Select bills from the dropdown above to view payment summary</p>
          </div>
        </div>

        <div v-if="bill.notes" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
          <p class="text-base text-gray-900 dark:text-white">{{ bill.notes }}</p>
        </div>
      </div>

      <!-- Payment History -->
      <div v-if="bill.payments && bill.payments.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment History</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Payment Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Method</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Processed By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Reference</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="payment in bill.payments" :key="payment.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.payment_code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(payment.payment_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                  KES {{ formatNumber(payment.amount_paid) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ payment.payment_method?.method_name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ payment.created_by?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ payment.reference_number || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Payments Message -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments recorded</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by recording a payment for this bill.</p>
        </div>
      </div>
    </div>

    <!-- Record Payment Modal -->
    <Teleport to="body">
      <div v-if="showPaymentModal" class="fixed inset-0 z-[9999] overflow-y-auto" @click.self="closePaymentModal">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full" @click.stop>
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Record Payment for {{ selectedBills.length }} Bill(s)
              </h3>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4">
              <!-- Selected Bills Info -->
              <div v-if="selectedBills.length > 1" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Selected Bills:</p>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div v-for="billId in selectedBills" :key="billId" 
                       class="flex justify-between items-center text-sm">
                    <span class="text-blue-700 dark:text-blue-300">
                      {{ getBillById(billId)?.bill_number }}
                    </span>
                    <span class="font-medium">KES {{ formatNumber(getBillById(billId)?.balance || 0) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Total Balance -->
              <div class="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Total Balance Due</div>
                <div class="text-2xl font-bold text-purple-900 dark:text-purple-300">
                  KES {{ formatNumber(totalSelectedBalance) }}
                </div>
              </div>

              <!-- Payment Form -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount to Pay <span class="text-red-500">*</span>
                    <span class="text-xs text-gray-500">(Max: KES {{ formatNumber(totalSelectedBalance) }})</span>
                  </label>
                  <input
                    v-model.number="paymentForm.amount_paid"
                    type="number"
                    step="0.01"
                    :max="totalSelectedBalance"
                    min="0.01"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    @input="validatePaymentAmount"
                  />
                  <div class="mt-1 flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">
                      {{ paymentForm.amount_paid >= totalSelectedBalance ? 'Full payment' : 'Partial payment' }}
                    </span>
                    <button
                      type="button"
                      @click="paymentForm.amount_paid = totalSelectedBalance"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Pay full amount
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="paymentForm.payment_date"
                    type="date"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-2">
                    <select
                      v-model.number="paymentForm.payment_method_id"
                      required
                      class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option :value="0">Select Method</option>
                      <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                        {{ method.method_name }}
                      </option>
                    </select>
                    <button
                      type="button"
                      @click="showAddMethodModal = true"
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Add new payment method"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Distribution Method (for partial payments to multiple bills) -->
                <div v-if="selectedBills.length > 1 && paymentForm.amount_paid < totalSelectedBalance">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How to distribute this payment?
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="distributionMethod"
                        value="proportional"
                        class="h-4 w-4 text-blue-600"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Proportional to each bill's balance</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="distributionMethod"
                        value="oldest_first"
                        class="h-4 w-4 text-blue-600"
                      />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Pay oldest bills first</span>
                    </label>
                  </div>
                </div>

                <!-- CHANGED: Reference Number field instead of Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference Number / Transaction ID <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="paymentForm.reference_number"
                    type="text"
                    maxlength="255"
                    required
                    placeholder="e.g., TXN-123456, CHQ-7890, MPesa-ABC123"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter payment reference number or transaction ID (required)
                  </p>
                </div>
              </div>

              <div v-if="paymentError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ paymentError }}</p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3">
              <button
                type="button"
                @click="closePaymentModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="submitPayment"
                :disabled="submitting || !isPaymentFormValid"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {{ submitting ? 'Processing...' : 'Record Payment' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add Payment Method Modal -->
    <Teleport to="body">
      <div 
        v-if="showAddMethodModal" 
        class="fixed inset-0 z-[10000] overflow-y-auto"
        @click.self="showAddMethodModal = false"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div 
            class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Payment Method</h3>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Method Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newMethodName"
                  type="text"
                  placeholder="e.g., Mobile Money, PayPal"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="addNewPaymentMethod"
                />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3">
              <button
                type="button"
                @click="showAddMethodModal = false"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="addNewPaymentMethod"
                :disabled="!newMethodName.trim()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBills } from '../../shared/composables/useBills'
import axios from '@/plugins/axios'

const route = useRoute()
const id = Number(route.params.id)

const { getBill, recordPayment, getPaymentMethods, addPaymentMethod } = useBills()

const loading = ref(true)
const submitting = ref(false)
const paymentError = ref('')
const error = ref('')
const bill = ref<any>({})
const allPendingBills = ref<any[]>([])
const paymentMethods = ref<any[]>([])
const showPaymentModal = ref(false)
const showAddMethodModal = ref(false)
const newMethodName = ref('')
const showDropdown = ref(false)
const selectedBills = ref<number[]>([])
const selectAll = ref(false)
const distributionMethod = ref('proportional')

// Payment form - CHANGED: notes → reference_number
const paymentForm = ref({
  amount_paid: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method_id: 0,
  reference_number: ''  // CHANGED from 'notes'
})

// Computed properties - FIXED: Added parseFloat to prevent NaN
const totalSelectedBalance = computed(() => {
  return selectedBills.value.reduce((sum, billId) => {
    const bill = getBillById(billId)
    const balance = parseFloat(bill?.balance) || 0  // FIXED: Added parseFloat
    return sum + balance
  }, 0)
})

const totalAllBillsBalance = computed(() => {
  let total = parseFloat(bill.value.balance) || 0  // FIXED: Added parseFloat
  allPendingBills.value.forEach(b => {
    total += parseFloat(b.balance) || 0  // FIXED: Added parseFloat
  })
  return total
})

const totalBillsCount = computed(() => {
  let count = bill.value.balance > 0 ? 1 : 0
  count += allPendingBills.value.filter(b => b.balance > 0).length
  return count
})

const isPaymentFormValid = computed(() => {
  return paymentForm.value.amount_paid > 0 && 
         paymentForm.value.payment_method_id > 0 &&
         paymentForm.value.payment_date !== '' &&
         paymentForm.value.reference_number.trim() !== ''  // CHANGED: Added reference_number validation
})

// Methods
const fetchBill = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getBill(id)
    if (data) {
      bill.value = {
        ...data,
        balance: typeof data.balance === 'string' ? parseFloat(data.balance) : (data.balance || 0),
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : (data.amount || 0),
        paid_amount: typeof data.paid_amount === 'string' ? parseFloat(data.paid_amount) : (data.paid_amount || 0)
      }
      
      // Auto-select the current bill if it has balance
      if (bill.value.balance > 0) {
        selectedBills.value = [bill.value.id]
      }
      
      await fetchPendingBillsForSupplier()
    } else {
      error.value = 'Bill not found'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load bill'
  } finally {
    loading.value = false
  }
}

const fetchPendingBillsForSupplier = async () => {
  if (!bill.value.supplier_id) return
  
  try {
    const response = await axios.get('/api/procurement-stores/pending-bills', {
      params: { supplier_id: bill.value.supplier_id }
    })
    
    console.log('Pending bills API response:', response.data.data)
    
    const allPending = response.data.data || []
    
    // Transform the data to ensure consistent structure
    allPendingBills.value = allPending.map((b: any) => ({
      id: b.id,
      bill_number: b.bill_number,
      purchase_order_id: b.purchase_order_id || b.purchase_order?.id || null,
      purchase_order: b.purchase_order || null,
      po_number: b.po_number || b.purchase_order?.po_number || 'N/A',
      amount: parseFloat(b.amount) || 0,
      paid_amount: parseFloat(b.paid_amount) || 0,
      balance: parseFloat(b.balance) || 0,
      status: b.status || 'pending',
      due_date: b.due_date
    })).filter((b: any) => 
      b.id !== bill.value.id && b.balance > 0
    )
    
    console.log('Transformed pending bills:', allPendingBills.value)
    
    // Sort by due date (oldest first)
    allPendingBills.value.sort((a, b) => 
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    )
  } catch (err) {
    console.error('Failed to fetch pending bills:', err)
  }
}

const getBillById = (billId: number) => {
  if (billId === bill.value.id) {
    return {
      ...bill.value,
      purchase_order_id: bill.value.purchase_order?.id || null,
      po_number: bill.value.purchase_order?.po_number || 'N/A'
    }
  }
  
  const pendingBill = allPendingBills.value.find(b => b.id === billId)
  if (!pendingBill) return null
  
  return {
    ...pendingBill,
    purchase_order_id: pendingBill.purchase_order_id || pendingBill.purchase_order?.id || null,
    po_number: pendingBill.po_number || pendingBill.purchase_order?.po_number || 'N/A'
  }
}

const getBillStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    partial: 'Partially Paid',
    overdue: 'Overdue',
    paid: 'Paid'
  }
  return statusMap[status] || status
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    // Select all bills with balance
    const billsWithBalance = [
      ...(bill.value.balance > 0 ? [bill.value.id] : []),
      ...allPendingBills.value.filter(b => b.balance > 0).map(b => b.id)
    ]
    selectedBills.value = billsWithBalance
  } else {
    // Clear all selections
    selectedBills.value = []
  }
}

// Watch for changes in selectedBills to update selectAll
watch(selectedBills, (newSelection) => {
  const billsWithBalance = [
    ...(bill.value.balance > 0 ? [bill.value.id] : []),
    ...allPendingBills.value.filter(b => b.balance > 0).map(b => b.id)
  ]
  selectAll.value = newSelection.length === billsWithBalance.length && billsWithBalance.length > 0
}, { deep: true })

const validatePaymentAmount = () => {
  if (paymentForm.value.amount_paid > totalSelectedBalance.value) {
    paymentForm.value.amount_paid = totalSelectedBalance.value
  }
}

const openPaymentModal = () => {
  paymentForm.value.amount_paid = totalSelectedBalance.value
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  paymentForm.value = {
    amount_paid: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method_id: 0,
    reference_number: ''  // CHANGED from 'notes'
  }
  paymentError.value = ''
  distributionMethod.value = 'proportional'
}

const calculatePaymentDistribution = (amount: number): Array<{billId: number, amount: number}> => {
  const distribution: Array<{billId: number, amount: number}> = []
  let remainingAmount = amount
  
  if (distributionMethod.value === 'oldest_first') {
    // Sort selected bills by due date
    const sortedBills = [...selectedBills.value]
      .map(id => getBillById(id))
      .filter(b => b)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    
    for (const bill of sortedBills) {
      if (remainingAmount <= 0) break
      
      const billBalance = parseFloat(bill.balance) || 0
      const amountForBill = Math.min(remainingAmount, billBalance)
      
      distribution.push({
        billId: bill.id,
        amount: parseFloat(amountForBill.toFixed(2))
      })
      
      remainingAmount -= amountForBill
    }
  } else {
    // Proportional distribution
    const totalBalance = totalSelectedBalance.value
    for (const billId of selectedBills.value) {
      const bill = getBillById(billId)
      if (!bill) continue
      
      const billBalance = parseFloat(bill.balance) || 0
      if (billBalance <= 0) continue
      
      const proportion = billBalance / totalBalance
      const amountForBill = parseFloat((amount * proportion).toFixed(2))
      
      distribution.push({
        billId: billId,
        amount: amountForBill
      })
      
      remainingAmount -= amountForBill
    }
  }
  
  // Adjust for rounding errors
  if (remainingAmount > 0 && distribution.length > 0) {
    distribution[0].amount = parseFloat((distribution[0].amount + remainingAmount).toFixed(2))
  }
  
  return distribution
}

const submitPayment = async () => {
  if (!isPaymentFormValid.value) {
    paymentError.value = 'Please fill in all required fields'
    return
  }

  submitting.value = true
  paymentError.value = ''
  
  try {
    const paymentDistribution = calculatePaymentDistribution(paymentForm.value.amount_paid)
    
    console.log('Payment distribution:', paymentDistribution)
    
    // Verify total distribution equals payment amount
    const totalDistributed = paymentDistribution.reduce((sum, item) => sum + item.amount, 0)
    const paymentAmount = parseFloat(paymentForm.value.amount_paid.toFixed(2))
    
    if (Math.abs(totalDistributed - paymentAmount) > 0.01) {
      throw new Error('Payment distribution calculation error')
    }
    
    // Create payment for each bill
    for (const { billId, amount } of paymentDistribution) {
      if (amount <= 0) continue
      
      console.log(`Recording payment for bill ${billId}: KES ${amount}`)
      
      // CHANGED: Using reference_number instead of notes
      await recordPayment(billId, {
        amount_paid: amount,
        payment_date: paymentForm.value.payment_date,
        payment_method_id: paymentForm.value.payment_method_id,
        reference_number: selectedBills.value.length > 1 
          ? `${paymentForm.value.reference_number} (Multi-bill: ${selectedBills.value.length} bills)`
          : paymentForm.value.reference_number
      })
    }
    
    closePaymentModal()
    await fetchBill()
    await fetchPendingBillsForSupplier()
  } catch (err: any) {
    console.error('Payment error:', err)
    paymentError.value = err.response?.data?.error || err.message || 'Failed to record payment'
  } finally {
    submitting.value = false
  }
}

const addNewPaymentMethod = async () => {
  if (!newMethodName.value.trim()) return
  
  try {
    const newMethod = await addPaymentMethod(newMethodName.value)
    paymentMethods.value.push(newMethod)
    paymentForm.value.payment_method_id = newMethod.id
    newMethodName.value = ''
    showAddMethodModal.value = false
  } catch (err) {
    console.error('Failed to add payment method:', err)
    alert('Failed to add payment method')
  }
}

const loadPaymentMethods = async () => {
  try {
    paymentMethods.value = await getPaymentMethods()
  } catch (err) {
    console.error('Failed to load payment methods:', err)
  }
}

const downloadPdf = async () => {
  try {
    const response = await axios.get(`/api/procurement-stores/bills/${id}/download`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Bill-${bill.value.bill_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to download PDF:', error)
    alert('Failed to download PDF')
  }
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const formatNumber = (num: number) => {
  if (isNaN(num)) return '0.00'  // FIXED: Handle NaN
  return new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num || 0)
}

const formatStatus = (status: string) => {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    partial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || classes.pending
}

onMounted(async () => {
  await fetchBill()
  await loadPaymentMethods()
})
</script>