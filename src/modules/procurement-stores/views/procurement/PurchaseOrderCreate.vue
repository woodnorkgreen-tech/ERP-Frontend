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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">New Purchase Order</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Purchase Order</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a new purchase order</p>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
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

          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Item <span class="text-red-500">*</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Quantity <span class="text-red-500">*</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Unit Price <span class="text-red-500">*</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Total
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in formData.items" :key="index">
                  <!-- Material Search -->
                  <td class="px-4 py-3">
                    <div class="relative">
                      <input 
                        v-model="item.sku_search" 
                        @input="searchMaterials(index)" 
                        @focus="item.showDropdown = true"
                        type="text"
                        placeholder="Search SKU or name..."
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-[250px]"
                      />
                      
                      <div v-if="item.showDropdown && item.searchResults && item.searchResults.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div v-for="material in item.searchResults" :key="material.id"
                          @click="selectMaterial(index, material)"
                          class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm">
                          <div class="font-medium text-gray-900 dark:text-white">{{ material.material_code }}</div>
                          <div class="text-xs text-gray-600 dark:text-gray-400">{{ material.material_name }}</div>
                        </div>
                      </div>

                      <div v-if="item.loading" class="absolute right-3 top-1/2 -translate-y-1/2">
                        <i class="mdi mdi-loading mdi-spin text-gray-400"></i>
                      </div>
                    </div>
                  </td>

                  <!-- Quantity -->
                  <td class="px-4 py-3">
                    <input 
                      v-model.number="item.quantity" 
                      @input="calculateTotal(index)" 
                      type="number" 
                      min="1"
                      class="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </td>

                  <!-- Unit Price -->
                  <td class="px-4 py-3">
                    <input 
                      v-model.number="item.unit_price" 
                      @input="calculateTotal(index)" 
                      type="number" 
                      step="0.01"
                      min="0"
                      class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </td>

                  <!-- Total -->
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    ${{ formatNumber(item.total || 0) }}
                  </td>

                  <!-- Actions -->
                  <td class="px-4 py-3">
                    <button 
                      type="button"
                      @click="removeItem(index)"
                      :disabled="formData.items.length === 1"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr v-if="formData.items.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No items added yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
            {{ loading ? 'Creating...' : 'Create Purchase Order' }}
          </button>
          <router-link
            to="/procurement/purchase-orders"
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
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import type { PurchaseOrderItem } from '../../shared/types/purchaseOrders'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const suppliers = ref<any[]>([])

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  supplier_id: '',
  due_date: '',
  delivery_address: '',
  description: '',
  items: [] as PurchaseOrderItem[]
})

const totalAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
})

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

const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

// Material Search with Debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const searchMaterials = (index: number) => {
  const item = formData.value.items[index]

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!item.sku_search || item.sku_search.length < 2) {
    item.showDropdown = false
    item.searchResults = []
    return
  }

  item.loading = true

  searchTimeout = setTimeout(async () => {
    try {
      const response = await axios.get('/api/materials-library/materials', {
        params: { search: item.sku_search }
      })

      formData.value.items[index].searchResults = response.data.data || []
      formData.value.items[index].showDropdown = true
    } catch (error) {
      console.error('Failed to search materials:', error)
      formData.value.items[index].searchResults = []
      formData.value.items[index].showDropdown = false
    } finally {
      formData.value.items[index].loading = false
    }
  }, 300)
}

const selectMaterial = (index: number, material: any) => {
  formData.value.items[index].material_id = material.id
  formData.value.items[index].sku_search = `${material.material_code} - ${material.material_name}`
  formData.value.items[index].unit_price = material.unit_cost || 0
  formData.value.items[index].showDropdown = false
  formData.value.items[index].searchResults = []
  
  calculateTotal(index)
}

const calculateTotal = (index: number) => {
  const item = formData.value.items[index]
  item.total = (item.quantity || 0) * (item.unit_price || 0)
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

    const response = await axios.post('/api/procurement-stores/purchase-orders', payload)
    
    if (response.data && response.data.id) {
      router.push(`/procurement/purchase-order/${response.data.id}`)
    } else if (response.data.data && response.data.data.id) {
      router.push(`/procurement/purchase-order/${response.data.data.id}`)
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      errors.value = error.response.data.error
      errorMessage.value = Object.values(error.response.data.error).flat().join(', ')
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
  await fetchSuppliers()
  addItem() // Add first item by default
})
</script>