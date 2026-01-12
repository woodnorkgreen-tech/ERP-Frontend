<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
      <!-- Key Metric -->
      <div class="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/20 text-white relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
        <div class="relative z-10">
          <p class="text-blue-100 font-medium text-lg mb-2">Estimated Grand Total</p>
          <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {{ formatCurrency(grandTotal) }}
          </h2>
          <div class="flex items-center space-x-2 text-sm text-blue-100 opacity-90">
             <i class="mdi mdi-check-circle"></i>
             <span>Includes all Taxes & Overhead</span>
          </div>
        </div>
      </div>

      <!-- Distribution Visual -->
      <div class="space-y-6">
         <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Cost Distribution</h4>
         
         <div class="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
            <div 
              class="h-full bg-blue-500 hover:bg-blue-400 transition-all relative group" 
              :style="{ width: getPercentage(materialsTotal) + '%' }"
            >
              <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                 Materials: {{ getPercentage(materialsTotal) }}%
              </div>
            </div>
            <div 
              class="h-full bg-yellow-500 hover:bg-yellow-400 transition-all relative group" 
              :style="{ width: getPercentage(labourTotal) + '%' }"
            >
                <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                 Labour: {{ getPercentage(labourTotal) }}%
              </div>
            </div>
            <div 
              class="h-full bg-purple-500 hover:bg-purple-400 transition-all relative group" 
              :style="{ width: getPercentage(logisticsTotal) + '%' }"
            >
                <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                 Logistics: {{ getPercentage(logisticsTotal) }}%
              </div>
            </div>
            <div 
              class="h-full bg-pink-500 hover:bg-pink-400 transition-all relative group" 
              :style="{ width: getPercentage(expensesTotal) + '%' }"
            >
                <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                 Expenses: {{ getPercentage(expensesTotal) }}%
              </div>
            </div>
         </div>

         <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Materials</span>
               </div>
               <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(materialsTotal) }}</span>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Labour</span>
               </div>
               <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(labourTotal) }}</span>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Logistics</span>
               </div>
               <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(logisticsTotal) }}</span>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Expenses</span>
               </div>
               <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(expensesTotal) }}</span>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  materialsTotal: number
  labourTotal: number
  expensesTotal: number
  logisticsTotal: number
  grandTotal: number
}

const props = defineProps<Props>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getPercentage = (amount: number) => {
  if (props.grandTotal === 0) return 0
  return Math.round((amount / props.grandTotal) * 100)
}
</script>
