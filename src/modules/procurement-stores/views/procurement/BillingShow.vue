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
              Billing
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Details</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Invoice Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ invoice.invoice_number }}</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="handlePrint"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Print
        </button>
        <button
          v-if="invoice.status === 'pending'"
          @click="showPaymentModal"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Record Payment
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading invoice details...</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <!-- Invoice Details -->
    <div v-else>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Invoice Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Invoice Number</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ invoice.invoice_number }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">PO Number</label>
            <router-link :to="`/procurement/purchase-order/${invoice.purchase_order?.id}`" class="text-base font-medium text-blue-600 hover:text-blue-800">
              {{ invoice.purchase_order?.po_number }}
            </router-link>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(invoice.status)
              ]"
            >
              {{ formatStatus(invoice.status) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Supplier</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ invoice.supplier?.supplier_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Invoice Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(invoice.invoice_date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(invoice.due_date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">KES{{ formatNumber(invoice.amount) }}</p>
          </div>
          <div v-if="invoice.payment_date">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(invoice.payment_date) }}</p>
          </div>
          <div v-if="invoice.payment_method">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ invoice.payment_method }}</p>
          </div>
          <div v-if="invoice.notes" class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
            <p class="text-base text-gray-900 dark:text-white">{{ invoice.notes }}</p>
          </div>
          <div v-if="invoice.createdBy">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created By</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ invoice.createdBy.name }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="paymentModal.show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="paymentModal.show = false"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Record Payment</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Date</label>
                <input
                  v-model="paymentModal.payment_date"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                <select
                  v-model="paymentModal.payment_method"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="recordPayment"
              :disabled="!paymentModal.payment_date || !paymentModal.payment_method"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Record Payment
            </button>
            <button
              @click="paymentModal.show = false"
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
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const loading = ref(true)
const errorMessage = ref('')
const invoice = ref<any>({})

const paymentModal = ref({
  show: false,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: ''
})

const fetchInvoice = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.get(`/api/procurement-stores/invoices/${id}`)
    if (response.data && response.data.data) {
      invoice.value = response.data.data
    } else {
      invoice.value = response.data
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load invoice details'
  } finally {
    loading.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const showPaymentModal = () => {
  paymentModal.value = {
    show: true,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: ''
  }
}

const recordPayment = async () => {
  try {
    await axios.post(`/api/procurement-stores/invoices/${id}/record-payment`, {
      payment_date: paymentModal.value.payment_date,
      payment_method: paymentModal.value.payment_method
    })
    
    paymentModal.value.show = false
    await fetchInvoice()
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to record payment')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return classes[status] || classes.pending
}

onMounted(async () => {
  await fetchInvoice()
})
</script>