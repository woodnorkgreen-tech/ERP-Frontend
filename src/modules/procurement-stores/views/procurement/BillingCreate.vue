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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Create Invoice</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a new invoice for a purchase order</p>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit" class="max-w-2xl">
        <div class="space-y-4">
          <!-- Purchase Order -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purchase Order <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.purchase_order_id"
              @change="loadPODetails"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.purchase_order_id }"
            >
              <option value="">Select Purchase Order</option>
              <option v-for="po in purchaseOrders" :key="po.id" :value="po.id">
                {{ po.po_number }} - {{ po.supplier?.supplier_name }} - ${{ formatNumber(po.total_amount) }}
              </option>
            </select>
            <p v-if="errors.purchase_order_id" class="mt-1 text-sm text-red-600">{{ errors.purchase_order_id[0] }}</p>
          </div>

          <!-- Invoice Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Invoice Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.invoice_date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.invoice_date }"
            />
            <p v-if="errors.invoice_date" class="mt-1 text-sm text-red-600">{{ errors.invoice_date[0] }}</p>
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.due_date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.due_date }"
            />
            <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">{{ errors.due_date[0] }}</p>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.amount }"
            />
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              v-model="formData.notes"
              rows="3"
              placeholder="Optional notes or payment instructions"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Form Actions -->
        <div class="mt-6 flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Creating...' : 'Create Invoice' }}
          </button>
          <router-link
            to="/procurement/billing"
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const purchaseOrders = ref<any[]>([])


const formData = ref({
  purchase_order_id: '',
  invoice_date: new Date().toISOString().split('T')[0],
  due_date: '',
  amount: 0,
  notes: ''
})

const fetchPurchaseOrders = async () => {
  try {
    const response = await axios.get('/api/procurement-stores/purchase-orders', {
      params: { status: 'approved' }
    })
    purchaseOrders.value = response.data.data || response.data
  } catch (e) {
    console.error('Failed to fetch purchase orders:', e)
  }
}

const loadPODetails = () => {
  const selectedPO = purchaseOrders.value.find((po: any) => po.id == formData.value.purchase_order_id)
  if (selectedPO) {
    formData.value.amount = selectedPO.total_amount
    
    // Set due date to 30 days from PO due date
    const dueDate = new Date(selectedPO.due_date)
    dueDate.setDate(dueDate.getDate() + 30)
    formData.value.due_date = dueDate.toISOString().split('T')[0]
  }
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    const response = await axios.post('/api/procurement-stores/invoices', formData.value)
    
    if (response.data && response.data.id) {
      router.push(`/procurement/billing/${response.data.id}`)
    } else if (response.data.data && response.data.data.id) {
      router.push(`/procurement/billing/${response.data.data.id}`)
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      errors.value = error.response.data.error
      errorMessage.value = Object.values(error.response.data.error).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred while creating the invoice.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchPurchaseOrders()
})
</script>