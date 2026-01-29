<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <!-- Top Level Financial Intelligence -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Primary Grand Total Card -->
      <div class="p-10 bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-indigo-950 dark:to-black rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
           <div>
              <p class="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Projected Financial Ceiling</p>
              <h2 class="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
                 {{ formatCurrency(grandTotal) }}
              </h2>
           </div>
           <div class="flex items-center gap-6 mt-8">
              <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                 <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span class="text-[10px] font-black text-white uppercase tracking-widest">Financial Integrity Verified</span>
              </div>
              <div class="flex flex-col">
                 <span class="text-[9px] font-black text-indigo-300 uppercase opacity-60">Est. Tax Impact (16%)</span>
                 <span class="text-xs font-bold text-white font-mono">{{ formatCurrency(grandTotal * 0.16) }}</span>
              </div>
           </div>
        </div>
      </div>

       <!-- Cost Driver, Benchmark & Variance Analysis -->
       <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Benchmark -->
          <div class="p-6 bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
             <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Benchmark Intelligence</p>
                <div class="flex items-end gap-2">
                   <h4 class="text-3xl font-black text-slate-800 dark:text-white leading-none">Healthy</h4>
                   <span class="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">Within Par</span>
                </div>
                <p class="text-[10px] text-slate-500 mt-2 font-medium leading-relaxed">Current pricing aligns with historical variance for this venue and scope.</p>
             </div>
             <div class="h-1.5 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                <div class="h-full bg-emerald-500 rounded-full" style="width: 78%"></div>
             </div>
          </div>

          <!-- Variance Card -->
          <div v-if="baselineTotal > 0" class="p-6 rounded-[2.5rem] border flex flex-col justify-between transition-all duration-500 shadow-sm"
               :class="variance > 0 ? 'bg-rose-50 border-rose-100 text-rose-900' : (variance < 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-gray-50 border-gray-100 text-gray-900')">
             <div>
                <p class="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Revision Variance</p>
                <div class="flex items-baseline gap-2">
                   <h4 class="text-3xl font-black font-mono leading-none">
                      {{ variance > 0 ? '+' : (variance < 0 ? '-' : '') }}{{ formatCurrency(Math.abs(variance)) }}
                   </h4>
                   <span class="text-[10px] font-black uppercase tracking-tighter">
                      {{ variance > 0 ? 'Overrun' : (variance < 0 ? 'Saving' : 'In Sync') }}
                   </span>
                </div>
                <p class="text-[10px] font-bold mt-2 opacity-80 leading-tight">
                   {{ variance > 0 ? 'Budget exceeds previous archived state.' : (variance < 0 ? 'Budget is optimized below archived baseline.' : 'Current plan matches the latest snapshot exactly.') }}
                </p>
             </div>
             <div class="flex items-center gap-2 mt-4">
                <div class="w-2 h-2 rounded-full" :class="variance > 0 ? 'bg-rose-400' : (variance < 0 ? 'bg-emerald-400' : 'bg-gray-400')"></div>
                <span class="text-[9px] font-black uppercase tracking-widest">Vs Latest Budget Snapshot</span>
             </div>
          </div>

          <!-- Main Cost Driver -->
          <div class="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-between">
             <div>
                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Main Cost Driver</p>
                <h4 class="text-lg font-black text-slate-800 dark:text-white leading-tight uppercase">{{ dominantCategory }}</h4>
                <p class="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-black uppercase opacity-70">
                   Accounts for {{ getPercentage(getCategoryTotal(dominantCategory)) }}% of spend
                </p>
             </div>
             <div class="flex items-center gap-2 mt-4">
                <i class="mdi mdi-lightbulb-on-outline text-amber-500"></i>
                <span class="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">Optimize for high impact</span>
             </div>
          </div>
       </div>
    </div>

    <!-- Distribution Breakdown -->
    <div class="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 p-8 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
            <h4 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Resource Concentration</h4>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-departmental budget split</p>
         </div>
         <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Ratio:</span>
            <span class="text-xs font-black text-slate-900 dark:text-white">1.24x</span>
         </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
         <!-- Card: Materials -->
         <div class="space-y-4">
            <div class="flex justify-between items-end">
               <div class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">Materials</div>
               <span class="text-xs font-black text-slate-400">{{ getPercentage(materialsTotal) }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-50 dark:bg-gray-700 rounded-full overflow-hidden">
               <div class="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]" :style="{ width: getPercentage(materialsTotal) + '%' }"></div>
            </div>
            <p class="text-sm font-black text-slate-800 dark:text-white font-mono">{{ formatCurrency(materialsTotal) }}</p>
         </div>

         <!-- Card: Labour -->
         <div class="space-y-4">
            <div class="flex justify-between items-end">
               <div class="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">Labour</div>
               <span class="text-xs font-black text-slate-400">{{ getPercentage(labourTotal) }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-50 dark:bg-gray-700 rounded-full overflow-hidden">
               <div class="h-full bg-amber-500 rounded-full transition-all duration-1000" :style="{ width: getPercentage(labourTotal) + '%' }"></div>
            </div>
            <p class="text-sm font-black text-slate-800 dark:text-white font-mono">{{ formatCurrency(labourTotal) }}</p>
         </div>

         <!-- Card: Logistics -->
         <div class="space-y-4">
            <div class="flex justify-between items-end">
               <div class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">Logistics</div>
               <span class="text-xs font-black text-slate-400">{{ getPercentage(logisticsTotal) }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-50 dark:bg-gray-700 rounded-full overflow-hidden">
               <div class="h-full bg-indigo-500 rounded-full transition-all duration-1000" :style="{ width: getPercentage(logisticsTotal) + '%' }"></div>
            </div>
            <p class="text-sm font-black text-slate-800 dark:text-white font-mono">{{ formatCurrency(logisticsTotal) }}</p>
         </div>

         <!-- Card: Expenses -->
         <div class="space-y-4">
            <div class="flex justify-between items-end">
               <div class="px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-black uppercase">Expenses</div>
               <span class="text-xs font-black text-slate-400">{{ getPercentage(expensesTotal) }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-50 dark:bg-gray-700 rounded-full overflow-hidden">
               <div class="h-full bg-violet-500 rounded-full transition-all duration-1000" :style="{ width: getPercentage(expensesTotal) + '%' }"></div>
            </div>
            <p class="text-sm font-black text-slate-800 dark:text-white font-mono">{{ formatCurrency(expensesTotal) }}</p>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  materialsTotal: number
  labourTotal: number
  expensesTotal: number
  logisticsTotal: number
  grandTotal: number
  baselineTotal: number
}

const props = defineProps<Props>()

const variance = computed(() => props.grandTotal - props.baselineTotal)

const dominantCategory = computed(() => {
   const cats = [
      { name: 'Materials', val: props.materialsTotal },
      { name: 'Labour', val: props.labourTotal },
      { name: 'Logistics', val: props.logisticsTotal },
      { name: 'Expenses', val: props.expensesTotal }
   ]
   return cats.sort((a, b) => b.val - a.val)[0].name
})

const getCategoryTotal = (name: string) => {
   if (name === 'Materials') return props.materialsTotal
   if (name === 'Human Capital') return props.labourTotal
   if (name === 'Logistics') return props.logisticsTotal
   return props.expensesTotal
}

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

<style scoped>
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
}
</style>
