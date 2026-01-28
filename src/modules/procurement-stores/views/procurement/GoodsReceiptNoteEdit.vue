<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/procurement/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
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
            <router-link to="/procurement/goods-receipt-notes" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Goods Receipt Notes
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Edit GRN</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Goods Receipt Note</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Update received goods information</p>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit">
      <!-- GRN Details Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">GRN Details</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- GRN Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GRN Number</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              :value="grn?.grn_number || 'Loading...'"
              disabled
            />
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              :value="grn?.date || ''"
              disabled
            />
          </div>

          <!-- Purchase Order (Read-only) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Order</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              :value="selectedPurchaseOrder?.po_number || 'Loading...'"
              disabled
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Purchase order cannot be changed</p>
          </div>

          <!-- PO Details -->
          <div v-if="selectedPurchaseOrder" class="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Purchase Order Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">PO Number</label>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedPurchaseOrder.po_number }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Supplier</label>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedPurchaseOrder.supplier?.supplier_name }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Due Date</label>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedPurchaseOrder.due_date) }}</p>
              </div>
            </div>
          </div>

          <!-- Batch Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch Number</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              :value="grn?.batch_number || ''"
              disabled
            />
          </div>

          <!-- Received By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Received By</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              :value="getReceivedByName()"
              disabled
            />
          </div>
        </div>
      </div>

      <!-- Items Card -->
      <div v-if="formData.items.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Received Items</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Material Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Material Name</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ordered Qty</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Received Qty</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Condition</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Accept</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(item, index) in formData.items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ item.material?.material_code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ item.material?.material_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {{ item.ordered_quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    v-model.number="item.received_quantity"
                    min="0"
                    :max="item.ordered_quantity"
                    class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                    required
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    v-model="item.condition"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="damaged">Damaged</option>
                    <option value="for_repair">For Repair</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    v-model="item.accepted"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Storage & Quality Check Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Storage & Quality Check</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Store Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Location <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.store_location"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select store location</option>
              <option value="Karen Village Store">Karen Village Store</option>
              <option value="Matasia Store">Matasia Store</option>
              <option value="Mombasa Store">Mombasa Store</option>
              <option value="Gichagi Store">Gichagi Store</option>
            </select>
          </div>

          <!-- Quality Check -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quality Check <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4 mt-2">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="formData.quality_check"
                  value="pass"
                  class="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  required
                />
                <span class="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Pass</span>
              </label>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="formData.quality_check"
                  value="fail"
                  class="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  required
                />
                <span class="ml-2 text-sm font-medium text-red-600 dark:text-red-400">Fail</span>
              </label>
            </div>
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              v-model="formData.notes"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="4"
              placeholder="Add any additional notes about the received goods..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-3 justify-end">
        <router-link
          to="/procurement/goods-receipt-notes"
          class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 inline-flex items-center"
          :disabled="loading || formData.items.length === 0"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ loading ? 'Updating...' : 'Update GRN' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGoodsReceiptNotes } from '@/modules/procurement-stores/shared/composables/useGoodsReceiptNotes'
import type { CreateGoodsReceiptNoteData, AvailablePurchaseOrder, GoodsReceiptNote } from '@/types/goodsReceiptNote'

const router = useRouter()
const route = useRoute()

const { 
  loading, 
  error: composableError, 
  updateGoodsReceiptNote,
  getGoodsReceiptNote
} = useGoodsReceiptNotes()

const errorMessage = ref<string | null>(null)
const grn = ref<GoodsReceiptNote | null>(null)

const formData = ref<CreateGoodsReceiptNoteData>({
  purchase_order_id: 0,
  store_location: '',
  quality_check: '',
  notes: '',
  items: []
})

const selectedPurchaseOrder = ref<AvailablePurchaseOrder | null>(null)

const getReceivedByName = (): string => {
  if (!grn.value) return 'Loading...'
  
  return grn.value.received_by_user?.name ||
         grn.value.receivedBy?.name ||
         grn.value.received_by?.name ||
         grn.value.receivedByUser?.name ||
         'N/A'
}

const handleSubmit = async () => {
  errorMessage.value = null

  try {
    await updateGoodsReceiptNote(Number(route.params.id), formData.value)
    router.push('/procurement/goods-receipt-notes')
  } catch (err: any) {
    errorMessage.value = composableError.value || 'Failed to update GRN'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

onMounted(async () => {
  try {
    grn.value = await getGoodsReceiptNote(Number(route.params.id))
    
    formData.value = {
      purchase_order_id: grn.value.purchase_order?.id || 0,
      store_location: grn.value.store_location,
      quality_check: grn.value.quality_check,
      notes: grn.value.notes || '',
      items: grn.value.items.map(item => ({
        purchase_order_item_id: item.purchase_order_item_id,
        material_id: item.material_id,
        material: item.material,
        ordered_quantity: item.ordered_quantity,
        received_quantity: item.received_quantity,
        condition: item.condition,
        accepted: item.accepted
      }))
    }
    
    selectedPurchaseOrder.value = grn.value.purchase_order as any
  } catch (err) {
    errorMessage.value = 'Failed to load GRN for editing'
  }
})
</script>