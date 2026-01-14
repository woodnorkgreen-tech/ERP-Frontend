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
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link :to="`/procurement/purchase-order/${id}`" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Details
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Edit</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Purchase Order</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Update purchase order information</p>
    </div>

    <!-- Loading State -->
    <div v-if="loadingData" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading purchase order data...</p>
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
            <input
              v-model="formData.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.date }"
            />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date[0] }}</p>
          </div>

          <!-- Supplier -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.supplier_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.supplier_id }"
            >
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
            <input
              v-model="formData.due_date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.due_date }"
            />
            <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">{{ errors.due_date[0] }}</p>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Delivery Address <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.delivery_address"
            rows="3"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            :class="{ 'border-red-500': errors.delivery_address }"
          ></textarea>
          <p v-if="errors.delivery_address" class="mt-1 text-sm text-red-600">{{ errors.delivery_address[0] }}</p>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="2"
            placeholder="Optional notes or special instructions"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>

        <!-- Items Table -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h3>
            <button
              type="button"
              @click="addItem"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Item
            </button>
          </div>

          <PurchaseOrderItemsTable
            :items="formData.items"
            @update="updateItem"
            @remove="removeItem"
          />

          <!-- Total -->
          <div class="mt-4 flex justify-end">
            <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                ${{ formatNumber(totalAmount) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
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
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Updating...' : 'Update Purchase Order' }}
          </button>
          <router-link
            :to="`/procurement/purchase-order/${id}`"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import type { PurchaseOrderItem } from '../../shared/types/purchaseOrders'
import PurchaseOrderItemsTable from '../../components/PurchaseOrderItemsTable.vue'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const loading = ref(false)
const loadingData = ref(true)
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const suppliers = ref<any[]>([])



const formData = ref({
  date: '',
  supplier_id: '',
  due_date: '',
  delivery_address: '',
  description: '',
  items: [] as PurchaseOrderItem[]
})

const totalAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

const fetchPurchaseOrder = async () => {
  loadingData.value = true
  try {
    const response = await axios.get(`/api/procurement-stores/purchase-orders/${id}`)
    const data = response.data.data || response.data
    
    formData.value = {
      date: data.date,
      supplier_id: data.supplier_id,
      due_date: data.due_date,
      delivery_address: data.delivery_address,
      description: data.description || '',
      items: data.items.map((item: any) => ({
        id: item.id,
        material_id: item.material_id,
        material: item.material,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total,
        sku_search: item.material?.material_code || '',
        showDropdown: false,
        searchResults: [],
        loading: false
      }))
    }
  } catch (e) {
    console.error('Failed to fetch purchase order:', e)
    errorMessage.value = 'Failed to load purchase order data'
  } finally {
    loadingData.value = false
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

const addItem = () => {
  formData.value.items.push({
    material_id: 0,
    quantity: 1,
    unit_price: 0,
    total: 0,
    sku_search: '',
    showDropdown: false,
    searchResults: [],
    loading: false
  })
}

const updateItem = (index: number, updatedItem: Partial<PurchaseOrderItem>) => {
  formData.value.items[index] = { ...formData.value.items[index], ...updatedItem }
}

const removeItem = (index: number) => {
  if (formData.value.items.length === 1) {
    alert('You must have at least one item.')
    return
  }
  formData.value.items.splice(index, 1)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    const payload = {
      ...formData.value,
      items: formData.value.items.map(item => ({
        material_id: item.material_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    }

    const response = await axios.put(`/api/procurement-stores/purchase-orders/${id}`, payload)
    
    if (response.data && response.data.id) {
      router.push(`/procurement/purchase-order/${response.data.id}`)
    } else if (response.data.data && response.data.data.id) {
      router.push(`/procurement/purchase-order/${response.data.data.id}`)
    } else {
      router.push(`/procurement/purchase-order/${id}`)
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      errors.value = error.response.data.error
      errorMessage.value = Object.values(error.response.data.error).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred while updating the purchase order.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    fetchPurchaseOrder(),
    fetchSuppliers()
  ])
})
</script>