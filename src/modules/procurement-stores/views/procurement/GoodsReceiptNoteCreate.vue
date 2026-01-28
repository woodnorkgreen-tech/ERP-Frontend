<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/procurement/dashboard"
            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z" />
            </svg>
            Home
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
            </svg>
            <router-link to="/procurement/goods-receipt-notes"
              class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Goods Receipt Notes
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Create GRN</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Goods Receipt Note</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Record received goods from purchase orders</p>
    </div>

    <!-- Loading State -->
    <div v-if="loadingPurchaseOrders"
      class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit">
        <!-- Row 1: GRN Number, Date, Batch Number -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- GRN Number (Auto-filled, Read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GRN Number
            </label>
            <input
              v-model="formData.grn_number"
              type="text"
              readonly
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.date }"
            />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date[0] }}</p>
          </div>

          <!-- Batch Number (Auto-filled, Read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Batch Number
            </label>
            <input
              v-model="formData.batch_number"
              type="text"
              readonly
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Row 2: Purchase Order, Store Location, Received By -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Purchase Order -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purchase Order <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.purchase_order_id"
              @change="loadPurchaseOrderItems"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.purchase_order_id }"
            >
              <option value="">Select Purchase Order</option>
              <option v-for="po in purchaseOrders" :key="po.id" :value="po.id">
                {{ po.po_number }} - {{ po.supplier?.supplier_name }}
              </option>
            </select>
            <p v-if="errors.purchase_order_id" class="mt-1 text-sm text-red-600">{{ errors.purchase_order_id[0] }}</p>
          </div>

          <!-- Store Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Location <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.store_location"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.store_location }"
            >
              <option value="">Select Store</option>
              <option value="Karen Village Store">Karen Village Store</option>
              <option value="Matasia Store">Matasia Store</option>
              <option value="Mombasa Store">Mombasa Store</option>
              <option value="Gichagi Store">Gichagi Store</option>
            </select>
            <p v-if="errors.store_location" class="mt-1 text-sm text-red-600">{{ errors.store_location[0] }}</p>
          </div>

          <!-- Received By (Auto-filled, Read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Received By
            </label>
            <input
              v-model="formData.received_by_name"
              type="text"
              readonly
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Row 3: Quality Check -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quality Check <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.quality_check"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            placeholder="Optional notes about the receipt"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <!-- Items Section -->
        <div v-if="formData.items.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Receipt Items
          </h3>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">SKU</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ordered Qty</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Received Qty</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Condition</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Accepted</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in formData.items" :key="index">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ item.material?.material_name || 'N/A' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ item.material?.material_code || 'N/A' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {{ item.ordered_quantity }}
                  </td>
                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.received_quantity"
                      type="number"
                      min="0"
                      :max="item.ordered_quantity"
                      required
                      class="w-24 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <select
                      v-model="item.condition"
                      required
                      class="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="damaged">Damaged</option>
                      <option value="for_repair">For Repair</option>
                    </select>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <input
                      v-model="item.accepted"
                      type="checkbox"
                      class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- No Items Message -->
        <div v-else class="mb-6 p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please select a purchase order to load items
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage"
          class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading || formData.items.length === 0"
            class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ loading ? 'Creating...' : 'Create GRN' }}
          </button>
          <router-link
            to="/procurement/goods-receipt-notes"
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
const loadingPurchaseOrders = ref(true)
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const purchaseOrders = ref<any[]>([])
const currentUser = ref<any>(null)

const formData = ref({
  grn_number: 'Auto-generated', // CHANGED: Display placeholder
  date: new Date().toISOString().split('T')[0],
  purchase_order_id: '',
  batch_number: 'Auto-generated', // CHANGED: Display placeholder
  store_location: '',
  quality_check: 'pass',
  received_by: '',
  received_by_name: '',
  notes: '',
  items: [] as any[]
})

// REMOVED: generateGrnNumber() function
// REMOVED: generateBatchNumber() function

// Fetch current user
const fetchCurrentUser = async () => {
  try {
    const response = await axios.get('/api/user')
    currentUser.value = response.data
    formData.value.received_by = currentUser.value.id
    formData.value.received_by_name = currentUser.value.name || currentUser.value.email || 'Current User'
  } catch (error) {
    console.error('Failed to fetch user:', error)
    formData.value.received_by_name = 'Current User'
  }
}

// Fetch available purchase orders (without GRN)
const fetchAvailablePurchaseOrders = async () => {
  loadingPurchaseOrders.value = true
  try {
    const response = await axios.get('/api/procurement-stores/goods-receipt-notes/available-purchase-orders')
    purchaseOrders.value = response.data.data || response.data
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load purchase orders'
  } finally {
    loadingPurchaseOrders.value = false
  }
}

// Load items from selected purchase order
const loadPurchaseOrderItems = () => {
  const selectedPo = purchaseOrders.value.find(po => po.id === Number(formData.value.purchase_order_id))
  
  if (selectedPo && selectedPo.items) {
    formData.value.items = selectedPo.items.map((item: any) => ({
      purchase_order_item_id: item.id,
      material_id: item.material_id,
      material: item.material,
      ordered_quantity: item.quantity,
      received_quantity: item.quantity,
      condition: 'good',
      accepted: true
    }))
  } else {
    formData.value.items = []
  }
}

// Submit form
const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    const payload = {
      purchase_order_id: formData.value.purchase_order_id,
      store_location: formData.value.store_location,
      quality_check: formData.value.quality_check,
      notes: formData.value.notes,
      items: formData.value.items.map(item => ({
        purchase_order_item_id: item.purchase_order_item_id,
        material_id: item.material_id,
        ordered_quantity: item.ordered_quantity,
        received_quantity: item.received_quantity,
        condition: item.condition,
        accepted: item.accepted
      }))
      // DON'T send grn_number or batch_number - backend will generate them
    }

    const response = await axios.post('/api/procurement-stores/goods-receipt-notes', payload)

    if (response.data && response.data.data && response.data.data.id) {
      router.push(`/procurement/goods-receipt-notes/${response.data.data.id}`)
    } else if (response.data && response.data.id) {
      router.push(`/procurement/goods-receipt-notes/${response.data.id}`)
    }
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
      errorMessage.value = Object.values(error.response.data.errors).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred while creating the GRN.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // REMOVED: generateGrnNumber()
  // REMOVED: generateBatchNumber()
  await fetchCurrentUser()
  await fetchAvailablePurchaseOrders()
})
</script>