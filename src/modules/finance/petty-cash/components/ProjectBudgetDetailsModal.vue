<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
      <!-- Modal Header -->
      <div class="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
            <i class="mdi mdi-calculator text-2xl text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Project Budget Breakdown</h3>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{{ project.job_number }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-300"></span>
              <p class="text-xs font-medium text-slate-500 truncate max-w-[300px]">{{ project.title }}</p>
            </div>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <i class="mdi mdi-close text-2xl text-slate-400"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div class="space-y-8">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-8 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div class="relative z-10">
                <p class="text-[10px] font-black text-indigo-400/80 uppercase tracking-[0.2em] mb-2">Total Project Budget</p>
                <h2 class="text-4xl font-black text-white font-mono leading-none">{{ formatCurrency(project.totals.grand_total) }}</h2>
                <div class="mt-6 flex items-center gap-3">
                   <div class="px-2 py-1 bg-white/10 rounded flex items-center gap-1.5 border border-white/5">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span class="text-[9px] font-black text-white uppercase tracking-widest">Financial Blueprint Active</span>
                   </div>
                </div>
              </div>
            </div>

            <div class="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-between">
              <div>
                <p class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Total Actual Spend (PC)</p>
                <h2 class="text-4xl font-black text-slate-900 dark:text-white font-mono leading-none">{{ formatCurrency(project.actual_spent) }}</h2>
                <div class="mt-4 flex items-center gap-2">
                  <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {{ getUtilization() }}%
                  </span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Consumed via Petty Cash</span>
                </div>
              </div>
              <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
                 <div 
                   class="h-full rounded-full transition-all duration-1000" 
                   :class="getUtilizationBg()"
                   :style="{ width: getUtilization() + '%' }"
                 ></div>
              </div>
            </div>
          </div>

          <!-- Component Breakdown (Reusing Logic from BudgetSummaryTab) -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Component Allocation</h4>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource concentration analysis</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               <!-- Materials -->
                <div class="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div class="flex justify-between items-center">
                     <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase">Materials Allocation</span>
                     <span class="text-xs font-black text-slate-400 font-mono">{{ getPercentage(project.totals.materials) }}%</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <h3 class="text-xl font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(project.totals.materials) }}</h3>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Spent</p>
                      <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{{ formatCurrency(project.actual_spent_breakdown.materials) }}</p>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center px-1">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilization</span>
                      <span class="text-[9px] font-black text-slate-900 dark:text-white">{{ getCategoryUtilization('materials') }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                       <div 
                         class="h-full rounded-full transition-all duration-1000" 
                         :class="getUtilizationBg(getCategoryUtilization('materials'))"
                         :style="{ width: getCategoryUtilization('materials') + '%' }"
                       ></div>
                    </div>
                  </div>
               </div>

               <!-- Labour -->
                <div class="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div class="flex justify-between items-center">
                     <span class="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black uppercase">Labour Allocation</span>
                     <span class="text-xs font-black text-slate-400 font-mono">{{ getPercentage(project.totals.labour) }}%</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <h3 class="text-xl font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(project.totals.labour) }}</h3>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Spent</p>
                      <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{{ formatCurrency(project.actual_spent_breakdown.labour) }}</p>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center px-1">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilization</span>
                      <span class="text-[9px] font-black text-slate-900 dark:text-white">{{ getCategoryUtilization('labour') }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                       <div 
                         class="h-full rounded-full transition-all duration-1000" 
                         :class="getUtilizationBg(getCategoryUtilization('labour'))"
                         :style="{ width: getCategoryUtilization('labour') + '%' }"
                       ></div>
                    </div>
                  </div>
               </div>

               <!-- Logistics -->
                <div class="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div class="flex justify-between items-center">
                     <span class="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase">Logistics Allocation</span>
                     <span class="text-xs font-black text-slate-400 font-mono">{{ getPercentage(project.totals.logistics) }}%</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <h3 class="text-xl font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(project.totals.logistics) }}</h3>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Spent</p>
                      <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{{ formatCurrency(project.actual_spent_breakdown.logistics) }}</p>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center px-1">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilization</span>
                      <span class="text-[9px] font-black text-slate-900 dark:text-white">{{ getCategoryUtilization('logistics') }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                       <div 
                         class="h-full rounded-full transition-all duration-1000" 
                         :class="getUtilizationBg(getCategoryUtilization('logistics'))"
                         :style="{ width: getCategoryUtilization('logistics') + '%' }"
                       ></div>
                    </div>
                  </div>
               </div>

               <!-- Expenses -->
                <div class="bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div class="flex justify-between items-center">
                     <span class="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-lg text-[10px] font-black uppercase">Expenses Allocation</span>
                     <span class="text-xs font-black text-slate-400 font-mono">{{ getPercentage(project.totals.expenses) }}%</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <h3 class="text-xl font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(project.totals.expenses) }}</h3>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Spent</p>
                      <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{{ formatCurrency(project.actual_spent_breakdown.expenses) }}</p>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-center px-1">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilization</span>
                      <span class="text-[9px] font-black text-slate-900 dark:text-white">{{ getCategoryUtilization('expenses') }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                       <div 
                         class="h-full rounded-full transition-all duration-1000" 
                         :class="getUtilizationBg(getCategoryUtilization('expenses'))"
                         :style="{ width: getCategoryUtilization('expenses') + '%' }"
                       ></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 text-right">
        <button 
          @click="$emit('close')"
          class="px-8 py-3 bg-slate-900 dark:bg-slate-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
        >
          Acknowledge Intelligence
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pettyCashService } from '../services/pettyCashService'

const props = defineProps<{
  isOpen: boolean
  project: any
}>()

const emit = defineEmits(['close'])

const formatCurrency = (amount: number) => {
  return pettyCashService.formatAmount(amount || 0)
}

const getUtilization = () => {
  const total = props.project.totals?.grand_total || 0
  if (total === 0) return 0
  return Math.round((props.project.actual_spent / total) * 100)
}

const getUtilizationBg = (percent?: number) => {
  const p = percent !== undefined ? percent : getUtilization()
  if (p > 90) return 'bg-rose-500'
  if (p > 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}

const getCategoryUtilization = (category: string) => {
  const budgeted = props.project.totals[category] || 0
  const actual = props.project.actual_spent_breakdown?.[category] || 0
  if (budgeted === 0) return 0
  return Math.round((actual / budgeted) * 100)
}

const getPercentage = (amount: number) => {
  const total = props.project.totals?.grand_total || 0
  if (total === 0) return 0
  return Math.round((amount / total) * 100)
}
</script>

<style scoped>
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
