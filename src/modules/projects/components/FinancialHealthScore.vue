<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
        Financial Health Score
      </h3>
      <span class="px-2 py-1 text-xs font-medium rounded-full"
            :class="healthScoreClass">
        {{ healthScoreLabel }}
      </span>
    </div>

    <div class="flex items-end space-x-2 mb-2">
      <span class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
        {{ formatNumber(overallScore) }}/100
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Score</span>
    </div>

    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
      <div class="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
           :style="{ width: `${overallScore}%` }"></div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit Margin</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ margin }}%</p>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
          <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: `${Math.min(margin, 100)}%` }"></div>
        </div>
      </div>
      <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cost Efficiency</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ costEfficiency }}%</p>
         <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
          <div class="bg-purple-500 h-1.5 rounded-full" :style="{ width: `${Math.min(costEfficiency, 100)}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  revenue: number
  profit: number
  margin: number
  cost: number
}

const props = defineProps<Props>()

const costEfficiency = computed(() => {
  if (props.revenue === 0) return 0
  // Lower cost ratio is better, so efficiency = 100 - (cost/revenue * 100) ideally?
  // Or simply: (Revenue - Cost) / Revenue * 100 (which is margin)
  // Let's use: Revenue / Cost (ROI) type metric scaled to 100?
  // Let's stick to simple: 1 - (Cost/Revenue) * 100 is Margin.
  
  // Let's assume Cost Efficiency is "Budget Utilization vs Actual". 
  // But we only have Revenue and Cost here.
  // Let's use Margin as a proxy for efficiency here, or maybe (Revenue / (Cost + 1)) * 10
  
  // Actually, let's just make it relative to industry standard.
  // If Margin is > 20%, efficiency is high.
  
  // Let's calculate purely based on margin for now:
  return Math.min(Math.round(props.margin * 3), 100) // Scale margin to a score (33% margin = 100 score)
})

const overallScore = computed(() => {
  // Weighted average of metrics
  const marginScore = Math.min(props.margin * 4, 100) // 25% margin = 100
  const revenueScore = Math.min((props.revenue / 100000) * 100, 100) // 100k revenue = 100
  
  return Math.round((marginScore * 0.7) + (revenueScore * 0.3))
})

const healthScoreLabel = computed(() => {
  if (overallScore.value >= 80) return 'Excellent'
  if (overallScore.value >= 60) return 'Good'
  if (overallScore.value >= 40) return 'Fair'
  return 'Critical'
})

const healthScoreClass = computed(() => {
  if (overallScore.value >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (overallScore.value >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  if (overallScore.value >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
})

const formatNumber = (num: number) => {
  return Math.round(num).toString()
}
</script>
