<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[500px]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
           <h3 class="text-xl font-bold text-gray-900 dark:text-white">Expenses & Overheads</h3>
           <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage operational costs and miscellaneous fees</p>
        </div>
      </div>
      <button
        @click="addExpense"
        type="button"
        class="group flex items-center px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95"
      >
        <i class="mdi mdi-plus mr-1 group-hover:scale-110 transition-transform"></i>
        Add Expense
      </button>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div v-if="!formData.expenses || formData.expenses.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
         <div class="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <i class="mdi mdi-cash-multiple text-2xl text-gray-300"></i>
         </div>
         <p class="text-gray-900 dark:text-white font-medium">No expenses added</p>
         <p class="text-sm text-gray-500 mb-4">Add accommodation, meals, permits etc.</p>
         <button @click="addExpense" class="text-green-600 font-bold text-sm hover:underline">Add First Expense</button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/80 dark:bg-gray-900/50 text-xs uppercase tracking-wider font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th class="text-left py-4 px-6">Description</th>
              <th class="text-left py-4 px-4 w-48">Category</th>
              <th class="text-right py-4 px-6 w-48">Amount</th>
              <th class="w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="(expense, index) in formData.expenses"
              :key="expense.id"
              class="group hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors"
            >
              <td class="py-3 px-6">
                <input
                  v-model="expense.description"
                  type="text"
                  placeholder="e.g., Team Lunch"
                  class="w-full px-0 py-1.5 bg-transparent border-0 border-b border-transparent focus:border-green-500 focus:ring-0 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                />
              </td>
              <td class="py-3 px-4">
                <select
                  v-model="expense.category"
                  class="w-full px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="transport">Transportation</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="meals">Meals & Refreshments</option>
                  <option value="utilities">Utilities</option>
                  <option value="permits">Permits & Licenses</option>
                  <option value="miscellaneous">Miscellaneous</option>
                </select>
              </td>
              <td class="py-3 px-6 text-right">
                <div class="relative max-w-[150px] ml-auto">
                    <input
                    v-model.number="expense.amount"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    class="w-full text-right px-0 py-1.5 bg-transparent border-0 border-b border-transparent group-hover:border-gray-200 focus:border-green-500 focus:ring-0 font-mono text-sm font-black text-gray-900 dark:text-white"
                    />
                    <span class="absolute right-full top-1.5 mr-2 text-xs text-gray-400 font-medium pointer-events-none">KES</span>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="removeExpense(index)"
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
import type { ExpenseItem } from '../../services/budgetService'

interface Props {
  formData: {
    expenses: ExpenseItem[]
  }
}

interface Emits {
  (e: 'add-expense'): void
  (e: 'remove-expense', index: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const addExpense = () => {
  emit('add-expense')
}

const removeExpense = (index: number) => {
  emit('remove-expense', index)
}
</script>
