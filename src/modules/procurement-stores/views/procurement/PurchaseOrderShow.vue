<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Purchase Order Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ purchaseOrder.po_number }}</p>
      </div>
      <div class="flex gap-2">
        <!-- Submit for Approval Button -->
        <button
          v-if="purchaseOrder.status === 'pending'"
          @click="submitForApproval"
          :disabled="submitting"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Submit for Approval
        </button>

        <!-- Approve Button -->
        <button
          v-if="purchaseOrder.status === 'pending_approval'"
          @click="approvePO"
          :disabled="submitting"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center disabled:opacity-50"
        >
          Approve
        </button>

        <!-- Link to Bill Button -->
        <router-link
          v-if="purchaseOrder.status === 'approved'"
          to="/procurement/billing/create"
          :state="{ purchaseOrderId: purchaseOrder.id }"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Create Invoice
        </router-link>

        <button @click="handlePrint" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Print
        </button>

        <router-link
          v-if="purchaseOrder.status === 'pending'"
          :to="`/procurement/purchase-order/${id}/edit`"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg"
        >
          Edit
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>

    <!-- Purchase Order Details -->
    <div v-else>
      <!-- Basic Info -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
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
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusClass(purchaseOrder.status)]">
              {{ formatStatus(purchaseOrder.status) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Supplier</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ purchaseOrder.supplier?.supplier_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Amount</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">${{ formatNumber(purchaseOrder.total_amount) }}</p>
          </div>
          <div v-if="purchaseOrder.createdBy">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created By</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ purchaseOrder.createdBy.name }}</p>
          </div>
          <div v-if="purchaseOrder.approvedBy">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Approved By</label>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ purchaseOrder.approvedBy.name }}</p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in purchaseOrder.items" :key="item.id">
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.material?.material_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">${{ formatNumber(item.unit_price) }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${{ formatNumber(item.total) }}</td>
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
const submitting = ref(false)
const purchaseOrder = ref<any>({})

const fetchPurchaseOrder = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/procurement-stores/purchase-orders/${id}`)
    purchaseOrder.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to load purchase order:', error)
  } finally {
    loading.value = false
  }
}

const submitForApproval = async () => {
  if (!confirm('Submit this purchase order for approval?')) return
  
  submitting.value = true
  try {
    await axios.post(`/api/procurement-stores/purchase-orders/${id}/submit`)
    await fetchPurchaseOrder()
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to submit')
  } finally {
    submitting.value = false
  }
}

const approvePO = async () => {
  if (!confirm('Approve this purchase order?')) return
  
  submitting.value = true
  try {
    await axios.post(`/api/procurement-stores/purchase-orders/${id}/approve`)
    await fetchPurchaseOrder()
    alert('Purchase order approved! You can now create an invoice.')
  } catch (error: any) {
    alert(error.response?.data?.error || 'Failed to approve')
  } finally {
    submitting.value = false
  }
}

const handlePrint = () => window.print()

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatNumber = (num: number) => new Intl.NumberFormat().format(num)
const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_approval: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || classes.pending
}

onMounted(() => fetchPurchaseOrder())
</script>