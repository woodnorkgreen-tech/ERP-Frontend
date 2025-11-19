<template>
  <div class="quote-logistics-tab">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Logistics & Transportation</h5>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Base: {{ formatCurrency(logisticsBase) }} |
        Final: {{ formatCurrency(logisticsTotal) }}
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Vehicle</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rate (KES)</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Total (KES)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="logistics in logistics" :key="logistics.id" class="border-t border-gray-200 dark:border-gray-700">
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">{{ logistics.vehicleReg }}</td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logistics.description }}</span>
                <span v-if="logistics.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
              </div>
            </td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ logistics.unit }}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ logistics.quantity }}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(logistics.unitRate) }}</td>
            <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(logistics.amount) }}</td>
          </tr>
          <tr v-if="!logistics || logistics.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
              No logistics items imported
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LogisticsItem {
  id: string
  vehicleReg: string
  description: string
  unit: string
  quantity: number
  unitRate: number
  amount: number
  isAddition?: boolean
}

interface Props {
  logistics?: LogisticsItem[]
  logisticsBase?: number
  logisticsTotal?: number
}

const props = withDefaults(defineProps<Props>(), {
  logistics: () => [],
  logisticsBase: 0,
  logisticsTotal: 0
})

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
.quote-logistics-tab {
  max-width: none;
}
</style>
