<template>
  <div class="quote-summary-tab">
    <h5 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-6">Quote Summary</h5>

    <!-- Discount & VAT Section -->
    <div class="mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Discount Section -->
        <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
          <div class="flex items-center justify-between mb-3">
            <h6 class="text-sm font-medium text-red-800 dark:text-red-200">Quote Discount</h6>
            <div class="text-xs text-red-600 dark:text-red-400">
              Subtotal: {{ formatCurrency(subtotal) }}
            </div>
          </div>

          <div class="text-sm text-red-600 dark:text-red-400">
            <span v-if="discountAmount > 0">
              After discount: {{ formatCurrency(totalAfterDiscount) }}
            </span>
            <span v-else>
              No discount applied
            </span>
          </div>
        </div>

        <!-- VAT Section -->
        <div class="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <div class="flex items-center justify-between mb-3">
            <h6 class="text-sm font-medium text-purple-800 dark:text-purple-200">Value Added Tax (16%)</h6>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-purple-700 dark:text-purple-300 mb-1">VAT Rate (Fixed)</div>
              <div class="text-lg font-bold text-purple-800 dark:text-purple-200">16%</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-purple-600 dark:text-purple-400 mb-1">VAT Amount</div>
              <div class="text-lg font-bold text-purple-800 dark:text-purple-200">
                {{ formatCurrency(vatAmount) }}
              </div>
            </div>
          </div>

          <div class="mt-3 text-xs text-purple-600 dark:text-purple-400">
            <span v-if="vatEnabled && vatAmount > 0">
              VAT on {{ formatCurrency(totalAfterDiscount) }} = {{ formatCurrency(vatAmount) }}
            </span>
            <span v-else-if="!vatEnabled">
              VAT is disabled for this quote
            </span>
            <span v-else>
              No VAT applicable
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Summary Table -->
    <div class="mb-6">
      <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Cost Breakdown</h6>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
              <th class="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Base Cost</th>
              <th class="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Margin %</th>
              <th class="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Margin Amount</th>
              <th class="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Final Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-200 dark:border-gray-700">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Materials & Components</td>
              <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(materialsBase) }}</td>
              <td class="py-3 px-4 text-center text-blue-600 dark:text-blue-400 font-medium">{{ margins?.materials }}%</td>
              <td class="py-3 px-4 text-right text-blue-600 dark:text-blue-400">{{ formatCurrency(materialsMargin) }}</td>
              <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(materialsTotal) }}</td>
            </tr>
            <tr class="border-t border-gray-200 dark:border-gray-700">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Labour & Welfare</td>
              <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(labourBase) }}</td>
              <td class="py-3 px-4 text-center text-yellow-600 dark:text-yellow-400 font-medium">{{ margins?.labour }}%</td>
              <td class="py-3 px-4 text-right text-yellow-600 dark:text-yellow-400">{{ formatCurrency(labourMargin) }}</td>
              <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(labourTotal) }}</td>
            </tr>
            <tr class="border-t border-gray-200 dark:border-gray-700">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Expenses & Overheads</td>
              <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(expensesBase) }}</td>
              <td class="py-3 px-4 text-center text-green-600 dark:text-green-400 font-medium">{{ margins?.expenses }}%</td>
              <td class="py-3 px-4 text-right text-green-600 dark:text-green-400">{{ formatCurrency(expensesMargin) }}</td>
              <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(expensesTotal) }}</td>
            </tr>
            <tr class="border-t border-gray-200 dark:border-gray-700">
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Logistics & Transportation</td>
              <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(logisticsBase) }}</td>
              <td class="py-3 px-4 text-center text-orange-600 dark:text-orange-400 font-medium">{{ margins?.logistics }}%</td>
              <td class="py-3 px-4 text-right text-orange-600 dark:text-orange-400">{{ formatCurrency(logisticsMargin) }}</td>
              <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(logisticsTotal) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-100 dark:bg-gray-600">
            <tr>
              <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">SUBTOTAL</td>
              <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(getBaseTotalAll()) }}</td>
              <td class="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">{{ overallMarginPercentage?.toFixed(1) }}%</td>
              <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalMargin) }}</td>
              <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</td>
            </tr>
            <tr v-if="discountAmount > 0" class="border-t border-gray-300 dark:border-gray-500">
              <td class="py-3 px-4 font-bold text-red-700 dark:text-red-400">DISCOUNT</td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4 text-center font-bold text-red-700 dark:text-red-400">
                {{ subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(1) : 0 }}%
              </td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4 text-right font-bold text-red-700 dark:text-red-400">-{{ formatCurrency(discountAmount) }}</td>
            </tr>
            <tr class="border-t border-gray-300 dark:border-gray-500">
              <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">TOTAL (Before VAT)</td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalAfterDiscount) }}</td>
            </tr>
            <tr v-if="vatEnabled && vatAmount > 0" class="border-t border-gray-300 dark:border-gray-500">
              <td class="py-3 px-4 font-bold text-purple-700 dark:text-purple-400">VAT ({{ vatPercentage }}%)</td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4"></td>
              <td class="py-3 px-4 text-right font-bold text-purple-700 dark:text-purple-400">{{ formatCurrency(vatAmount) }}</td>
            </tr>
            <tr class="border-t-2 border-gray-400 dark:border-gray-300">
              <td class="py-4 px-4 font-bold text-lg text-gray-900 dark:text-white">FINAL TOTAL (Inc. VAT)</td>
              <td class="py-4 px-4"></td>
              <td class="py-4 px-4"></td>
              <td class="py-4 px-4"></td>
              <td class="py-4 px-4 text-right font-bold text-2xl text-blue-600 dark:text-blue-400">{{ formatCurrency(grandTotal) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Profit Analysis -->
    <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg border border-green-200 dark:border-green-700">
      <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Profit Analysis</h6>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(getBaseTotalAll()) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Base Cost</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(totalMargin) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Margin</div>
        </div>
        <div class="text-center" v-if="discountAmount > 0">
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">-{{ formatCurrency(discountAmount) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Discount</div>
        </div>
        <div class="text-center" v-if="vatEnabled && vatAmount > 0">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatCurrency(vatAmount) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">VAT ({{ vatPercentage }}%)</div>
        </div>
        <div class="text-center" :class="getAnalysisColumnSpan()">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(grandTotal) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Final Total</div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <div class="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Overall Profit Margin:
          <span class="text-green-600 dark:text-green-400">{{ overallMarginPercentage?.toFixed(1) }}%</span>
          <span v-if="discountAmount > 0" class="ml-4 text-red-600 dark:text-red-400">
            ({{ subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(1) : 0 }}% discount)
          </span>
          <span v-if="vatEnabled && vatAmount > 0" class="ml-4 text-purple-600 dark:text-purple-400">
            ({{ vatPercentage }}% VAT included)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MarginSettings {
  materials: number
  labour: number
  expenses: number
  logistics: number
}

interface Props {
  materialsBase?: number
  materialsMargin?: number
  materialsTotal?: number
  labourBase?: number
  labourMargin?: number
  labourTotal?: number
  expensesBase?: number
  expensesMargin?: number
  expensesTotal?: number
  logisticsBase?: number
  logisticsMargin?: number
  logisticsTotal?: number
  subtotal?: number
  discountAmount?: number
  totalAfterDiscount?: number
  vatPercentage?: number
  vatAmount?: number
  vatEnabled?: boolean
  grandTotal?: number
  totalMargin?: number
  overallMarginPercentage?: number
  margins?: MarginSettings
}

const props = withDefaults(defineProps<Props>(), {
  materialsBase: 0,
  materialsMargin: 0,
  materialsTotal: 0,
  labourBase: 0,
  labourMargin: 0,
  labourTotal: 0,
  expensesBase: 0,
  expensesMargin: 0,
  expensesTotal: 0,
  logisticsBase: 0,
  logisticsMargin: 0,
  logisticsTotal: 0,
  subtotal: 0,
  discountAmount: 0,
  totalAfterDiscount: 0,
  vatPercentage: 16,
  vatAmount: 0,
  vatEnabled: true,
  grandTotal: 0,
  totalMargin: 0,
  overallMarginPercentage: 0,
  margins: () => ({ materials: 20, labour: 15, expenses: 10, logistics: 15 })
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

const getBaseTotalAll = (): number => {
  return (props.materialsBase || 0) + (props.labourBase || 0) + (props.expensesBase || 0) + (props.logisticsBase || 0)
}

const getAnalysisColumnSpan = (): string => {
  let usedColumns = 2 // Base Cost + Total Margin always present
  if ((props.discountAmount || 0) > 0) usedColumns++
  if ((props.vatEnabled || false) && (props.vatAmount || 0) > 0) usedColumns++

  const remainingColumns = 5 - usedColumns
  return remainingColumns > 1 ? `md:col-span-${remainingColumns}` : ''
}
</script>

<style scoped>
.quote-summary-tab {
  max-width: none;
}
</style>
