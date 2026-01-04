<template>
  <div class="relative overflow-hidden">
    <div class="flex items-center justify-between mb-10">
      <div>
        <div class="flex items-center gap-3">
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
            Operational Conversion
          </h3>
          <div class="group/tooltip relative">
            <i class="mdi mdi-information-outline text-slate-300 hover:text-blue-500 cursor-help transition-colors"></i>
            <div class="absolute left-0 bottom-full mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-normal leading-relaxed rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 z-[100] backdrop-blur-xl border border-white/10 dark:border-slate-200/50">
              <div class="font-black uppercase tracking-widest mb-2 text-blue-400">Data Criteria</div>
              Measures the 'Catch Rate' of the sales funnel. Focuses on the transition from initial Enquiries to Approved Quotes and finally to Active Projects.
              <div class="absolute bottom-[-6px] left-4 w-3 h-3 bg-slate-900/95 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-slate-200/50"></div>
            </div>
          </div>
        </div>
        <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Workflow <span class="text-blue-500 opacity-50">Funnel</span></p>
      </div>
      <div class="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <i class="mdi mdi-trending-up text-base"></i>
          {{ conversionRate }}% Net Conversion
        </span>
      </div>
    </div>

    <div class="space-y-8">
      <!-- Funnel Step 1: Enquiries -->
      <div class="group relative p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-blue-500/20 transition-all duration-500">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <i class="mdi mdi-inbox-arrow-down text-xl"></i>
            </div>
            <span class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Initial Enquiries</span>
          </div>
          <span class="text-xl font-black text-slate-900 dark:text-white">{{ totalEnquiries }}</span>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full w-full group-hover:scale-x-105 transition-transform origin-left duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
        </div>
      </div>

      <!-- Funnel Step 2: Quotes -->
      <div class="group relative p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-indigo-500/20 transition-all duration-500 ml-8">
          <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300 dark:bg-slate-700"></div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <i class="mdi mdi-file-document-edit-outline text-xl"></i>
                </div>
                <span class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Quotes Generated</span>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-xl font-black text-slate-900 dark:text-white">{{ quotesGenerated }}</span>
                <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{{ getPercentage(quotesGenerated, totalEnquiries) }}% Catch</span>
            </div>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded-full group-hover:scale-x-105 transition-transform origin-left duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.3)]" :style="{ width: `${getPercentage(quotesGenerated, totalEnquiries)}%` }"></div>
          </div>
      </div>

       <!-- Funnel Step 3: Approved -->
       <div class="group relative p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-emerald-500/20 transition-all duration-500 ml-16">
          <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300 dark:bg-slate-700"></div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <i class="mdi mdi-check-decagram-outline text-xl"></i>
                </div>
                <span class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Mission Approval</span>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-xl font-black text-slate-900 dark:text-white">{{ quotesApproved }}</span>
                <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{{ getPercentage(quotesApproved, quotesGenerated) }}% Rate</span>
            </div>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full group-hover:scale-x-105 transition-transform origin-left duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :style="{ width: `${getPercentage(quotesApproved, quotesGenerated)}%` }"></div>
          </div>
      </div>
      
       <!-- Funnel Step 4: Projects -->
       <div class="group relative p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-transparent hover:border-purple-500/20 transition-all duration-500 ml-24">
          <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300 dark:bg-slate-700"></div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <i class="mdi mdi-rocket-launch-outline text-xl"></i>
                </div>
                <span class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Active Projects</span>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-xl font-black text-slate-900 dark:text-white">{{ activeProjects }}</span>
                <span class="text-[10px] font-black text-purple-500 uppercase tracking-widest">{{ getPercentage(activeProjects, quotesApproved) }}% Execution</span>
            </div>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full group-hover:scale-x-105 transition-transform origin-left duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.3)]" :style="{ width: `${getPercentage(activeProjects, quotesApproved)}%` }"></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  enquiryMetrics: {
    total_enquiries: number
    status_breakdown: Record<string, number>
    [key: string]: any
  } | null
  projectMetrics: {
    active_projects: number
    completed_projects: number
    [key: string]: any
  } | null
  commandCenterData?: any
}

const props = defineProps<Props>()

const totalEnquiries = computed(() => props.enquiryMetrics?.total_enquiries || 0)

const pipelineCounts = computed(() => props.commandCenterData?.pipeline?.counts || {})

const quotesGenerated = computed(() => {
  // Sum of Quoting and further
  const counts = pipelineCounts.value
  return (counts['quote_prepared'] || 0) + 
         (counts['quote_approved'] || 0) + 
         (counts['materials_specified'] || 0) + 
         (counts['in_progress'] || 0) + 
         (counts['completed'] || 0)
})

const quotesApproved = computed(() => {
   const counts = pipelineCounts.value
   return (counts['quote_approved'] || 0) + 
          (counts['materials_specified'] || 0) + 
          (counts['in_progress'] || 0) + 
          (counts['completed'] || 0)
})

const activeProjects = computed(() => props.projectMetrics?.active_projects || 0)

const conversionRate = computed(() => {
  if (totalEnquiries.value === 0) return 0
  return Math.round((quotesApproved.value / totalEnquiries.value) * 100)
})

const getPercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
</script>
