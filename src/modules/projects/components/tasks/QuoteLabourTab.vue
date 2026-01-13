<template>
  <div class="quote-labour-tab">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Direct Labour and Welfare Costs</h5>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Total: {{ formatCurrency(labourTotal) }}
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Type</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rate</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="labour in labour" :key="labour.id" class="border-t border-gray-200 dark:border-gray-700">
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ labour.category }}</td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ labour.type }}</span>
                <span v-if="labour.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
              </div>
            </td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ labour.unit }}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ labour.quantity }}</td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(labour.unitRate) }}</td>
            <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(labour.amount) }}</td>
          </tr>
          <tr v-if="!labour || labour.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
              No labour items imported
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LabourItem {
  id: string
  category: string
  type: string
  unit: string
  quantity: number
  unitRate: number
  amount: number
  isAddition?: boolean
}

interface Props {
  labour?: LabourItem[]
  labourTotal?: number
}

const props = withDefaults(defineProps<Props>(), {
  labour: () => [],
  labourTotal: 0
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
.quote-labour-tab {
  max-width: none;
}
</style>
