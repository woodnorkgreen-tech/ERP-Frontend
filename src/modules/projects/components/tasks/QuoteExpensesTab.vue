<template>
  <div class="quote-expenses-tab">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Expenses & Overheads</h5>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Base: {{ formatCurrency(expensesBase) }} |
        Final: {{ formatCurrency(expensesTotal) }}
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
            <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in expenses" :key="expense.id" class="border-t border-gray-200 dark:border-gray-700">
            <td class="py-3 px-4">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.description }}</span>
                <span v-if="expense.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
              </div>
            </td>
            <td class="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">{{ expense.category }}</td>
            <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(expense.amount) }}</td>
          </tr>
          <tr v-if="!expenses || expenses.length === 0">
            <td colspan="3" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
              No expenses imported
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ExpenseItem {
  id: string
  description: string
  category: string
  amount: number
  isAddition?: boolean
}

interface Props {
  expenses?: ExpenseItem[]
  expensesBase?: number
  expensesTotal?: number
}

const props = withDefaults(defineProps<Props>(), {
  expenses: () => [],
  expensesBase: 0,
  expensesTotal: 0
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
.quote-expenses-tab {
  max-width: none;
}
</style>
