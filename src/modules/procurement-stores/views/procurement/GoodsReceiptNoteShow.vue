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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">View GRN</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Page Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Goods Receipt Note Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">View received goods information</p>
      </div>
      <div class="flex gap-3">
        <router-link
          to="/procurement/goods-receipt-notes"
          class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to List
        </router-link>
        <router-link
          :to="`/procurement/goods-receipt-notes/${route.params.id}/edit`"
          class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit GRN
        </router-link>
      </div>
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

    <!-- GRN Details Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
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

        <!-- Purchase Order -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Order</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            :value="grn?.purchase_order?.po_number || 'Loading...'"
            disabled
          />
        </div>

        <!-- PO Details -->
        <div v-if="grn?.purchase_order" class="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Purchase Order Details</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">PO Number</label>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ grn.purchase_order.po_number }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Supplier</label>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ grn.purchase_order.supplier?.supplier_name }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Due Date</label>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(grn.purchase_order.due_date) }}</p>
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

        <!-- Store Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Location</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            :value="grn?.store_location || ''"
            disabled
          />
        </div>

        <!-- Quality Check -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality Check</label>
          <div class="flex items-center gap-2">
            <span v-if="grn?.quality_check === 'pass'" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Pass
            </span>
            <span v-else-if="grn?.quality_check === 'fail'" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              Fail
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="grn?.notes" class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
          <textarea
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            rows="3"
            :value="grn.notes"
            disabled
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Items Card -->
    <div v-if="grn?.items && grn.items.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Received Items</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Material Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Material Name</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ordered Qty</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Received Qty</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Condition</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in grn.items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ item.material?.material_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.material?.material_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {{ item.ordered_quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {{ item.received_quantity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': item.condition === 'good',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400': item.condition === 'fair',
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': item.condition === 'damaged',
                  'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400': item.condition === 'for_repair'
                }" class="px-2 py-1 rounded text-xs font-medium capitalize">
                  {{ item.condition.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span v-if="item.accepted" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Accepted
                </span>
                <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                  Not Accepted
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGoodsReceiptNotes } from '@/modules/procurement-stores/shared/composables/useGoodsReceiptNotes'
import type { GoodsReceiptNote } from '@/types/goodsReceiptNote'

const route = useRoute()

const { getGoodsReceiptNote } = useGoodsReceiptNotes()

const errorMessage = ref<string | null>(null)
const grn = ref<GoodsReceiptNote | null>(null)

const getReceivedByName = (): string => {
  if (!grn.value) return 'Loading...'
  
  return grn.value.received_by_user?.name ||
         grn.value.receivedBy?.name ||
         grn.value.received_by?.name ||
         grn.value.receivedByUser?.name ||
         'N/A'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    grn.value = await getGoodsReceiptNote(Number(route.params.id))
  } catch (err) {
    errorMessage.value = 'Failed to load GRN details'
  }
})
</script>