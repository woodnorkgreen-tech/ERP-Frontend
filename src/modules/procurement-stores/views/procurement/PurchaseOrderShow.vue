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
            <router-link to="/procurement/purchase-orders" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Purchase Orders
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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Purchase Order Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ purchaseOrder.po_number }}</p>
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
          v-if="purchaseOrder.supplier?.email"
          @click="sendEmail"
          :disabled="sending"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Send Email
        </button>
        <router-link
          v-if="purchaseOrder.status === 'pending'"
          :to="`/procurement/purchase-order/${id}/edit`"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit
        </router-link>
        <button
          v-if="purchaseOrder.status === 'pending'"
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading purchase order details...</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <!-- Purchase Order Details -->
    <div v-else>
      <!-- Basic Info -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">PO Number</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ purchaseOrder.po_number }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(purchaseOrder.date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(purchaseOrder.status)
              ]"
            >
              {{ formatStatus(purchaseOrder.status) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Supplier</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ purchaseOrder.supplier?.supplier_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(purchaseOrder.due_date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Amount</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">${{ formatNumber(purchaseOrder.total_amount) }}</p>
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Address</label>
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-line">{{ purchaseOrder.delivery_address }}</p>
          </div>
          <div v-if="purchaseOrder.description" class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
            <p class="text-base text-gray-900 dark:text-white">{{ purchaseOrder.description }}</p>
          </div>
          <div v-if="purchaseOrder.createdBy">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created By</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ purchaseOrder.createdBy.first_name }} {{ purchaseOrder.createdBy.last_name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">SKU</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in purchaseOrder.items" :key="item.id">
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.material?.material_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.material?.material_code }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">${{ formatNumber(item.unit_price) }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${{ formatNumber(item.total) }}</td>
              </tr>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <td colspan="4" class="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Grand Total:
                </td>
                <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  ${{ formatNumber(purchaseOrder.total_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
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
const sending = ref(false)
const errorMessage = ref('')
const purchaseOrder = ref<any>({})

const fetchPurchaseOrder = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.get(`/api/procurement-stores/purchase-orders/${id}`)
    if (response.data && response.data.data) {
      purchaseOrder.value = response.data.data
    } else {
      purchaseOrder.value = response.data
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load purchase order details'
  } finally {
    loading.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const sendEmail = async () => {
  if (!confirm(`Send this purchase order to ${purchaseOrder.value.supplier?.supplier_name}?`)) return
  
  sending.value = true
  try {
    await axios.post(`/api/procurement-stores/purchase-orders/${id}/send-email`)
    alert('Purchase order sent successfully!')
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to send email')
  } finally {
    sending.value = false
  }
}

const confirmDelete = async () => {
  if (!confirm('Are you sure you want to delete this purchase order?')) return
  
  try {
    await axios.delete(`/api/procurement-stores/purchase-orders/${id}`)
    router.push('/procurement/purchase-orders')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to delete purchase order'
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
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    delivered: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || classes.pending
}

onMounted(async () => {
  await fetchPurchaseOrder()
})
</script>