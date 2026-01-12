<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Procurement Dashboard</h1>
      <p class="text-slate-500 dark:text-gray-400 font-medium">Strategic overview of spending, order statuses, and vendor performance.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
        <div class="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div class="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-2xl"></div>
      </div>
    </div>
    
    <div class="mt-8 p-12 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center text-center">
      <div class="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
        <i class="mdi mdi-shopping-outline text-4xl text-slate-400 group-hover:scale-110 transition-transform"></i>
      </div>
      <h2 class="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Strategic Sourcing Intelligence</h2>
      <p class="text-slate-500 max-w-md italic">The procurement command center is being configured for real-time supply chain oversight.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Procurement Dashboard Placeholder
</script>
