<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[500px]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
        <div>
           <h3 class="text-xl font-bold text-gray-900 dark:text-white">Logistics & Transportation</h3>
           <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage vehicle and delivery costs</p>
        </div>
      </div>
      <button
        @click="addLogisticsItem"
        type="button"
        class="group flex items-center px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all active:scale-95"
      >
        <i class="mdi mdi-plus mr-1 group-hover:scale-110 transition-transform"></i>
        Add Logistics
      </button>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div v-if="!formData.logistics || formData.logistics.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
         <div class="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <i class="mdi mdi-truck-fast-outline text-2xl text-gray-300"></i>
         </div>
         <p class="text-gray-900 dark:text-white font-medium">No logistics costs added</p>
         <p class="text-sm text-gray-500 mb-4">Add delivery and transport details</p>
         <button @click="addLogisticsItem" class="text-purple-600 font-bold text-sm hover:underline">Add First Item</button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/80 dark:bg-gray-900/50 text-xs uppercase tracking-wider font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th class="text-left py-4 px-6">Description</th>
              <th class="text-left py-4 px-4 w-32">Unit</th>
              <th class="text-center py-4 px-4 w-24">Trips/Qty</th>
              <th class="text-right py-4 px-4 w-32">Cost/Trip</th>
              <th class="text-right py-4 px-6 w-40">Total</th>
              <th class="w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="(item, index) in formData.logistics"
              :key="item.id"
              class="group hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors"
            >
              <td class="py-3 px-6">
                <select
                  v-model="item.description"
                  @change="updateUnitForDescription(item)"
                  class="w-full px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="" disabled>Select logistics item...</option>
                  <option value="Items delivery set up">Items delivery set up</option>
                  <option value="Items collection set down">Items collection set down</option>
                  <option value="Team transport set up">Team transport set up</option>
                  <option value="Team transport set down">Team transport set down</option>
                  <option value="Material collection">Material collection</option>
                </select>
              </td>
              <td class="py-3 px-4">
                <input
                  v-model="item.unit"
                  type="text"
                  readonly
                  class="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </td>
              <td class="py-3 px-4 text-center">
                <input
                  v-model.number="item.quantity"
                  @input="calculateLogisticsTotal(item)"
                  type="number"
                  step="1"
                  min="0"
                  class="w-16 text-center px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg font-mono font-bold text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white"
                />
              </td>
              <td class="py-3 px-4 text-right">
                <input
                  v-model.number="item.unitRate"
                  @input="calculateLogisticsTotal(item)"
                  type="number"
                  step="1"
                  min="0"
                  class="w-full text-right px-0 py-1.5 bg-transparent border-0 border-b border-transparent group-hover:border-gray-200 focus:border-purple-500 focus:ring-0 font-mono text-sm text-gray-600 dark:text-gray-300"
                />
              </td>
              <td class="py-3 px-6 text-right font-black font-mono text-gray-900 dark:text-white">
                {{ formatCurrency(item.amount) }}
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="removeLogisticsItem(index)"
                  type="button"
                  class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-all transform hover:rotate-90"
                  title="Remove Item"
                >
                  <i class="mdi mdi-close"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LogisticsItem } from '../../services/budgetService'

interface Props {
  formData: {
    logistics: LogisticsItem[]
  }
}

interface Emits {
  (e: 'add-logistics-item'): void
  (e: 'remove-logistics-item', index: number): void
  (e: 'calculate-logistics-total', item: LogisticsItem): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const addLogisticsItem = () => {
  emit('add-logistics-item')
}

const removeLogisticsItem = (index: number) => {
  emit('remove-logistics-item', index)
}

const calculateLogisticsTotal = (item: LogisticsItem) => {
  emit('calculate-logistics-total', item)
}

const updateUnitForDescription = (item: LogisticsItem) => {
  // Auto-set unit to "trips" for all logistics items
  if (!item.unit || item.unit === '') {
     item.unit = 'trips'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
