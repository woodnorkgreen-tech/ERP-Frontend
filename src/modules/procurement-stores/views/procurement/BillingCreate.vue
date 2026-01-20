<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a new invoice for an approved purchase order</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              :class="{ 'border-red-500': errors.purchase_order_id }"
            >
              <option value="">Select Approved Purchase Order</option>
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
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
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
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
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
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              v-model="formData.notes"
              rows="3"
              placeholder="Optional notes or payment instructions"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Form Actions -->
        <div class="mt-6 flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Invoice' }}
          </button>
          <router-link
            to="/procurement/billing"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
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
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
const route = useRoute()

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

// Check if coming from PO approval
onMounted(async () => {
  if (route.query.purchaseOrderId) {
    formData.value.purchase_order_id = route.query.purchaseOrderId as string
  }
  await fetchApprovedPurchaseOrders()
  
  if (formData.value.purchase_order_id) {
    loadPODetails()
  }
})

const fetchApprovedPurchaseOrders = async () => {
  try {
    const response = await axios.get('/api/procurement-stores/approved-purchase-orders')
    purchaseOrders.value = response.data.data || []
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

const formatNumber = (num: number) => new Intl.NumberFormat().format(num)

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    const response = await axios.post('/api/procurement-stores/invoices', formData.value)
    const invoice = response.data.data || response.data
    router.push(`/procurement/billing/${invoice.id}`)
  } catch (error: any) {
    if (error.response?.data?.error) {
      errors.value = error.response.data.error
      errorMessage.value = Object.values(error.response.data.error).flat().join(', ')
    } else {
      errorMessage.value = error.response?.data?.message || 'Failed to create invoice'
    }
  } finally {
    loading.value = false
  }
}
</script>