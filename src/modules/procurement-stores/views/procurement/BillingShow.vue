<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
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
        <button @click="handlePrint" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Print
        </button>
        <button
          v-if="bill.balance > 0"
          @click="showPaymentModal = true"
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
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">PO Number</label>
            <router-link 
              v-if="bill.purchase_order?.id" 
              :to="`/procurement/purchase-order/${bill.purchase_order.id}`" 
              class="text-base font-medium text-blue-600 hover:text-blue-800"
            >
              {{ bill.purchase_order?.po_number }}
            </router-link>
            <p v-else class="text-base font-medium text-gray-900 dark:text-white">N/A</p>
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
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <label class="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Original Amount</label>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">KES {{ formatNumber(bill.amount || 0) }}</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <label class="block text-sm font-medium text-green-600 dark:text-green-400 mb-1">Already Paid</label>
              <p class="text-2xl font-bold text-green-900 dark:text-green-300">KES {{ formatNumber(bill.paid_amount || 0) }}</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <label class="block text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">Balance Due</label>
              <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-300">KES {{ formatNumber(bill.balance || 0) }}</p>
            </div>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Notes</th>
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
                  {{ payment.notes || '-' }}
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
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closePaymentModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Record Payment</h3>
            
            <div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-sm text-blue-600 dark:text-blue-400 mb-1">Balance Due</div>
              <div class="text-2xl font-bold text-blue-900 dark:text-blue-300">KES {{ formatNumber(bill.balance || 0) }}</div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount to Pay <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="paymentForm.amount_paid"
                  type="number"
                  step="0.01"
                  :max="bill.balance"
                  min="0.01"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Date <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="paymentForm.payment_date"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option :value="0">Select Method</option>
                    <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                      {{ method.method_name }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="showAddMethodModal = true"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    title="Add new payment method"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  v-model="paymentForm.notes"
                  rows="3"
                  placeholder="Optional payment notes..."
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>
            </div>

            <div v-if="paymentError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ paymentError }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="submitPayment"
              :disabled="submitting || !paymentForm.amount_paid || !paymentForm.payment_method_id"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ submitting ? 'Processing...' : 'Record Payment' }}
            </button>
            <button
              type="button"
              @click="closePaymentModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Payment Method Modal -->
    <div v-if="showAddMethodModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showAddMethodModal = false"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Payment Method</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Method Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newMethodName"
                type="text"
                placeholder="e.g., Mobile Money, PayPal"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="addNewPaymentMethod"
              :disabled="!newMethodName.trim()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Add Method
            </button>
            <button
              type="button"
              @click="showAddMethodModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBills } from '../../shared/composables/useBills'

const route = useRoute()
const id = Number(route.params.id)

const { getBill, recordPayment, getPaymentMethods, addPaymentMethod } = useBills()

const loading = ref(true)
const submitting = ref(false)
const paymentError = ref('')
const error = ref('')
const bill = ref<any>({})
const paymentMethods = ref<any[]>([])
const showPaymentModal = ref(false)
const showAddMethodModal = ref(false)
const newMethodName = ref('')

const paymentForm = ref({
  amount_paid: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method_id: 0,
  notes: ''
})

const fetchBill = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getBill(id)
    if (data) {
      bill.value = data
      console.log('Bill loaded:', bill.value)
    } else {
      error.value = 'Bill not found'
    }
  } catch (err: any) {
    console.error('Failed to load bill:', err)
    error.value = err.message || 'Failed to load bill'
  } finally {
    loading.value = false
  }
}

const loadPaymentMethods = async () => {
  try {
    paymentMethods.value = await getPaymentMethods()
  } catch (err) {
    console.error('Failed to load payment methods:', err)
  }
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  paymentForm.value = {
    amount_paid: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method_id: 0,
    notes: ''
  }
  paymentError.value = ''
}

const submitPayment = async () => {
  submitting.value = true
  paymentError.value = ''
  
  try {
    await recordPayment(id, paymentForm.value)
    closePaymentModal()
    await fetchBill()
  } catch (err: any) {
    paymentError.value = err.response?.data?.error || err.message || 'Failed to record payment'
  } finally {
    submitting.value = false
  }
}

const addNewPaymentMethod = async () => {
  try {
    const newMethod = await addPaymentMethod(newMethodName.value)
    paymentMethods.value.push(newMethod)
    paymentForm.value.payment_method_id = newMethod.id
    newMethodName.value = ''
    showAddMethodModal.value = false
  } catch (err) {
    alert('Failed to add payment method')
  }
}

const handlePrint = () => window.print()
const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}
const formatNumber = (num: number) => new Intl.NumberFormat().format(num || 0)
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