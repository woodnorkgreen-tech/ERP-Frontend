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
            <router-link to="/procurement/purchase-orders"
              class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Purchase Orders
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">New Purchase Order</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Purchase Order</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create purchase order from requisition {{
        requisition.requisition_number }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loadingRequisition"
      class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading requisition details...</p>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.date" type="date" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.date }" />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date[0] }}</p>
          </div>

          <!-- Supplier -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier <span class="text-red-500">*</span>
            </label>
            <select v-model="formData.supplier_id" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.supplier_id }">
              <option value="">Select Supplier</option>
              <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.supplier_name }}
              </option>
            </select>
            <p v-if="errors.supplier_id" class="mt-1 text-sm text-red-600">{{ errors.supplier_id[0] }}</p>
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.due_date" type="date" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.due_date }" />
            <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">{{ errors.due_date[0] }}</p>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Delivery Address <span class="text-red-500">*</span>
          </label>
          <textarea v-model="formData.delivery_address" rows="3" required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            :class="{ 'border-red-500': errors.delivery_address }"></textarea>
          <p v-if="errors.delivery_address" class="mt-1 text-sm text-red-600">{{ errors.delivery_address[0] }}</p>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea v-model="formData.description" rows="2" placeholder="Optional notes or special instructions"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
        </div>

        <!-- Items from Requisition (READ-ONLY) -->
<div class="mb-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Order Items (From Requisition - Cannot be modified)
  </h3>

  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">SKU</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(item, index) in formData.items" :key="index">
          <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
            {{ item.material_name }}
          </td>
          <td class="px-4 py-3 text-sm">
            <span v-if="item.material_id" class="font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded text-xs">
              {{ item.material_code }}
            </span>
            <span v-else class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
              Custom
            </span>
          </td>
          <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
          <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">KES {{ formatNumber(item.unit_price) }}</td>
          <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">KES {{ formatNumber(item.total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Total -->
  <div class="mt-4 flex justify-end">
    <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-lg">
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        KES {{ formatNumber(totalAmount) }}
      </div>
    </div>
  </div>
</div>

        <!-- Error Message -->
        <div v-if="errorMessage"
          class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3">
          <button type="submit" :disabled="loading"
            class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center">
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
                </circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            {{ loading ? 'Creating...' : 'Create Purchase Order' }}
          </button>
          <router-link :to="`/procurement/requisition/${requisitionId}`"
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-medium transition-colors">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
const route = useRoute()
const requisitionId = route.params.requisitionId as string

const loading = ref(false)
const loadingRequisition = ref(true)
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const suppliers = ref<any[]>([])
const requisition = ref<any>({})

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  supplier_id: '',
  due_date: '',
  delivery_address: '',
  description: '',
  requisition_id: requisitionId,
  items: [] as any[]
})

const totalAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

const fetchRequisition = async () => {
  loadingRequisition.value = true
  try {
    const response = await axios.get(`/api/procurement-stores/requisitions/${requisitionId}`)
    const data = response.data.data || response.data
    requisition.value = data

    formData.value.items = data.items.map((item: any) => ({
      material_id: item.material_id,
      // API resource already resolves material_name → custom_description for non-library items
      material_name: item.material_name || item.material?.material_name || item.custom_description || '—',
      // SKU: library items have a code, custom items show their description
      material_code: item.material?.material_code || item.custom_description || '—',
      quantity: item.quantity,
      unit_price: item.unit_price || item.material?.unit_cost || 0,
      total: item.quantity * (item.unit_price || item.material?.unit_cost || 0)
    }))
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load requisition details'
  } finally {
    loadingRequisition.value = false
  }
}

const fetchSuppliers = async () => {
  try {
    const response = await axios.get('/api/procurement-stores/suppliers')
    suppliers.value = response.data.data || response.data
  } catch (e) {
    console.error('Failed to fetch suppliers:', e)
  }
}

const calculateTotal = (index: number) => {
  const item = formData.value.items[index]
  item.total = (item.quantity || 0) * (item.unit_price || 0)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    // Use the store-linked endpoint which copies items from the requisition server-side
    // This avoids the material_id required validation on the generic store endpoint
    const payload = {
      requisition_id: formData.value.requisition_id,
      supplier_id: formData.value.supplier_id,
      due_date: formData.value.due_date,
      delivery_address: formData.value.delivery_address,
      description: formData.value.description,
    }

    const response = await axios.post('/api/procurement-stores/purchase-orders/store-linked', payload)

    const id = response.data?.data?.id || response.data?.id
    if (id) {
      router.push(`/procurement/purchase-order/${id}`)
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      errors.value = error.response.data.error
      errorMessage.value = typeof error.response.data.error === 'string'
        ? error.response.data.error
        : Object.values(error.response.data.error).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred while creating the purchase order.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchRequisition()
  await fetchSuppliers()
})
</script>