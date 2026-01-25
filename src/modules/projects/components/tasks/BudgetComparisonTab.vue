<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col min-h-[700px]">
    
    <!-- Executive Header -->
    <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <i class="mdi mdi-finance text-2xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">Variance Analysis</h2>
            <div class="flex items-center gap-2 mt-0.5">
               <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Audit Logic Active</span>
               <span class="w-1 h-1 rounded-full bg-gray-300"></span>
               <span class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Baseline: {{ selectedBaselineVersionNumber }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex flex-col bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 min-w-[200px]">
             <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Select Audit Baseline</span>
              <select 
                v-model="selectedBaselineId" 
                @change="handleBaselineChange"
                class="bg-transparent border-none p-0 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer"
              >
                 <option v-for="v in versions" :key="v.id" :value="v.id">
                   Budget Snapshot #{{ v.version_number }} ({{ v.label || 'Point-in-Time' }})
                 </option>
                 <option :value="null">Original Budget Entry</option>
                 <option value="materials">Ref: Project Master MQ (Source Spec)</option>
              </select>
          </div>
          <button 
            @click="downloadAnalysisReport" 
            :disabled="isDownloading"
            class="flex items-center gap-2 h-full px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
          >
            <i class="mdi text-sm" :class="isDownloading ? 'mdi-loading mdi-spin' : 'mdi-file-pdf-box'"></i>
            <span>{{ isDownloading ? 'Processing Audit...' : 'Audit Report' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Analytics Summary Strip -->
    <div class="px-8 mt-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
       <!-- Net Variance Card -->
       <div class="p-5 rounded-2xl border flex flex-col justify-between h-32" :class="variance >= 0 ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'">
          <div class="flex items-center justify-between">
             <span class="text-[9px] font-black uppercase tracking-widest opacity-80">Net Financial Delta</span>
             <i class="mdi text-xl" :class="variance >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"></i>
          </div>
          <div>
             <div class="text-2xl font-black font-mono leading-none">
                {{ variance > 0 ? '+' : '' }}{{ formatCurrency(variance) }}
             </div>
             <div class="text-[10px] font-bold mt-1 opacity-80 uppercase tracking-tighter">
                {{ Math.abs(variancePercent).toFixed(2) }}% variance from baseline
             </div>
          </div>
       </div>

       <!-- Current Request Card -->
       <div class="p-5 bg-indigo-600 rounded-2xl border border-indigo-500 flex flex-col justify-between h-32 text-white shadow-md">
          <div class="flex items-center justify-between opacity-80">
             <span class="text-[9px] font-black uppercase tracking-widest">Current Request</span>
             <i class="mdi mdi-calculator-variant text-xl"></i>
          </div>
          <div>
             <span class="text-2xl font-black font-mono leading-none">{{ formatCurrency(grandTotal) }}</span>
             <p class="text-[10px] font-bold mt-1 opacity-80 uppercase tracking-tighter">Active project plan</p>
          </div>
       </div>

       <div v-if="selectedBaselineId === 'materials' && materialsSyncAnalysis" class="md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-4">
          <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between shadow-sm">
             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">New Scope</span>
             <div>
                <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">+{{ materialsSyncAnalysis.summary.added }}</span>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">Manual Additions</p>
             </div>
          </div>
          <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between shadow-sm">
             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qty Shifts</span>
             <div>
                <span class="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">Δ{{ materialsSyncAnalysis.summary.updated }}</span>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">Volume Changes</p>
             </div>
          </div>
          <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between shadow-sm">
             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Obsolete Items</span>
             <div>
                <span class="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">-{{ materialsSyncAnalysis.summary.removed }}</span>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">Removed from spec</p>
             </div>
          </div>
       </div>

       <!-- Generic Baseline metrics if not materials -->
       <template v-else>
          <div class="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center h-32">
             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Total</span>
             <span class="text-xl font-black text-gray-900 dark:text-white font-mono leading-none">{{ formatCurrency(baselineSummary.grandTotal) }}</span>
             <span class="text-[8px] font-black text-indigo-500 uppercase tracking-tighter mt-2">Anchored to: {{ selectedBaselineVersionNumber }}</span>
          </div>
          <div class="md:col-span-1 lg:col-span-2 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 h-32">
             <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 inline-block">Category Impact Breakdown</span>
             <div class="flex gap-4">
                <div v-for="attr in attributionBreakdown" :key="attr.label" class="flex-grow">
                   <div class="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-600 transition-all duration-1000" :style="{ width: `${attr.percent}%` }"></div>
                   </div>
                   <span class="text-[8px] font-black text-gray-500 uppercase mt-1 block">{{ attr.label }}</span>
                </div>
             </div>
          </div>
       </template>
    </div>

    <!-- Data Grid -->
    <div class="flex-grow bg-white dark:bg-gray-800 mx-8 mt-8 mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col shadow-sm">
       <div class="overflow-x-auto relative flex-grow">
          <div v-if="isLoading" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 fixed-blur flex items-center justify-center z-50">
             <div class="flex flex-col items-center gap-3">
                <div class="w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <span class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] animate-pulse">Processing Analysis...</span>
             </div>
          </div>

          <table class="w-full border-collapse min-w-[1100px]">
             <thead class="bg-gray-50/80 dark:bg-gray-700/50 sticky top-0 z-20">
                <tr class="border-b border-gray-200 dark:border-gray-600 font-mono uppercase text-[9px] text-gray-500 font-bold tracking-widest">
                   <th class="px-6 py-4 text-left w-16">Audit</th>
                   <th class="px-6 py-4 text-left">Component Item / Project Scope</th>
                   <th class="px-6 py-4 text-center w-40">Qty Change</th>
                   <th class="px-6 py-4 text-center w-40">Rate Change</th>
                   <th class="px-6 py-4 text-right w-48 font-sans">Financial Impact</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <template v-for="group in comparisonData" :key="group.category">
                   <!-- Group Row -->
                   <tr class="bg-indigo-50/30 dark:bg-indigo-900/10">
                      <td colspan="4" class="px-6 py-3">
                         <div class="flex items-center gap-2">
                            <i class="mdi text-lg text-indigo-500" :class="getCategoryIcon(group.category)"></i>
                            <span class="text-[10px] font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-widest">{{ group.category }} Analysis</span>
                         </div>
                      </td>
                      <td class="px-6 py-3 text-right">
                         <span class="text-xs font-black font-mono tracking-tighter" :class="group.variance > 0 ? 'text-rose-600' : 'text-emerald-600'">
                            {{ group.variance > 0 ? '+' : '' }}{{ formatCurrency(group.variance) }}
                         </span>
                      </td>
                   </tr>

                   <!-- Detail Rows -->
                   <tr v-for="item in group.items" :key="item.comparisonKey" class="group/item hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td class="px-6 py-4">
                         <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover/item:bg-indigo-100 dark:group-hover/item:bg-indigo-900/40 group-hover/item:text-indigo-600 transition-colors">
                            {{ item.type }}
                         </div>
                      </td>
                      <td class="px-6 py-4">
                         <div class="flex flex-col gap-1.5">
                            <span class="text-[13px] font-bold text-gray-800 dark:text-gray-100 leading-tight tracking-tight">{{ item.description }}</span>
                            <div class="flex flex-wrap gap-2">
                               <span v-if="item.isNew && selectedBaselineId === 'materials'" class="text-[8px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest shadow-sm">OBSOLETE / NOT IN MASTER SPEC</span>
                               <span v-else-if="item.isNew" class="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">ADDED in v{{ selectedBaselineVersionNumber }}</span>
                               
                               <span v-if="item.isRemoved && selectedBaselineId === 'materials'" class="text-[8px] bg-rose-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest shadow-sm animate-pulse">NEW PROJECT SPEC</span>
                               <span v-else-if="item.isRemoved" class="text-[8px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-black uppercase tracking-widest">REMOVED in v{{ selectedBaselineVersionNumber }}</span>
                               
                               <span v-if="item.qtyChanged && !item.isNew && !item.isRemoved" class="text-[8px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full uppercase font-black">VOLUME SHIFT</span>
                               <span v-if="item.priceChanged && !item.isNew && !item.isRemoved" class="text-[8px] bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full uppercase font-black">RATE ADJUSTED</span>
                            </div>
                         </div>
                      </td>
                      <td class="px-6 py-4 text-center font-mono">
                         <div class="flex items-center justify-center gap-2 text-[11px]">
                            <span class="text-gray-400">{{ item.baselineQty || 0 }}</span>
                            <i class="mdi mdi-ray-start-end text-gray-300"></i>
                            <span :class="item.qtyChanged ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'">{{ item.currentQty || 0 }}</span>
                         </div>
                      </td>
                      <td class="px-6 py-4 text-center font-mono">
                         <div class="flex items-center justify-center gap-2 text-[11px]">
                            <span class="text-gray-400">{{ formatCurrency(item.baselinePrice || 0) }}</span>
                            <i class="mdi mdi-ray-start-end text-gray-300"></i>
                            <span :class="item.priceChanged ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'">{{ formatCurrency(item.currentPrice || 0) }}</span>
                         </div>
                      </td>
                      <td class="px-6 py-4 text-right">
                         <div class="flex flex-col items-end gap-1">
                            <span class="text-sm font-black font-mono tracking-tighter" :class="item.variance > 0 ? 'text-rose-600' : (item.variance < 0 ? 'text-emerald-600' : 'text-gray-300')">
                               {{ item.variance > 0 ? '+' : (item.variance < 0 ? '-' : '') }}{{ formatCurrency(Math.abs(item.variance)) }}
                            </span>
                            <div v-if="Math.abs(item.variance) > 0.01" class="flex flex-col items-end gap-0.5 mt-1.5 pt-1.5 border-t border-gray-50 dark:border-gray-800">
                               <div v-if="Math.abs(item.volumeVariance) > 0.01" class="flex items-center gap-1.5 leading-none">
                                  <span class="text-[7px] font-black text-gray-400 uppercase tracking-widest">Qty Shift:</span>
                                  <span class="text-[9px] font-black text-amber-600 font-mono">{{ formatCurrency(item.volumeVariance) }}</span>
                               </div>
                               <div v-if="Math.abs(item.priceVariance) > 0.01" class="flex items-center gap-1.5 leading-none mt-0.5">
                                  <span class="text-[7px] font-black text-gray-400 uppercase tracking-widest">Rate Shift:</span>
                                  <span class="text-[9px] font-black text-violet-600 font-mono">{{ formatCurrency(item.priceVariance) }}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                   </tr>
                </template>
                
                <!-- Empty State within Table -->
                <tr v-if="comparisonData.length === 0 && !isLoading">
                   <td colspan="5" class="py-20 text-center">
                      <div class="flex flex-col items-center gap-3">
                         <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                            <i class="mdi mdi-shield-check-outline text-4xl"></i>
                         </div>
                         <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Financial Alignment Verified</h3>
                         <p class="text-xs text-gray-500 font-bold uppercase tracking-tighter">No variances detected between current budget and baseline</p>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useVersioning } from '@/composables/useVersioning'
import api from '@/plugins/axios'
import type { BudgetData, BudgetElement, LabourType, ExpenseItem, LogisticsItem } from '../../services/budgetService'
import type { BudgetFormData } from '../../composables/useBudgetState'

interface Props {
  currentData: BudgetFormData
  taskId: number
  grandTotal: number
}

const props = defineProps<Props>()

const { versions, fetchVersions, fetchVersion } = useVersioning(computed(() => props.taskId), 'budget')
const baselineData = ref<BudgetData | null>(null)
const selectedBaselineId = ref<number | string | null>(null)
const isLoading = ref(false)

onMounted(async () => {
    isLoading.value = true
    await fetchVersions()
    
    // DEFAULT TO SNAPSHOT: Select the latest budget snapshot if available
    if (versions.value && versions.value.length > 0) {
        // useVersioning usually returns versions sorted by version_number DESC
        selectedBaselineId.value = versions.value[0].id
    } else {
        // Fallback to Project Master MQ if no snapshots have been created yet
        selectedBaselineId.value = 'materials'
    }
    
    await loadBaseline()
    isLoading.value = false
})

const handleBaselineChange = () => {
    loadBaseline()
}

const materialsSyncAnalysis = ref<any>(null)

const loadBaseline = async () => {
  isLoading.value = true
  materialsSyncAnalysis.value = null
  
  try {
    if (selectedBaselineId.value === 'materials') {
        const response = await api.get(`/api/projects/tasks/${props.taskId}/budget/check-materials-update`)
        const analysis = response.data.data?.analysis
        
        if (analysis) {
            materialsSyncAnalysis.value = analysis
            // Mock baseline using incoming materials
            baselineData.value = {
                materials: analysis.analysis_raw_materials || [],
                budgetSummary: { grandTotal: 0 } 
            } as any
        } else {
            // No changes detected or no analysis available, fetch raw preview
            const materialsResponse = await api.get(`/api/projects/tasks/${props.taskId}/budget/materials-preview`)
            baselineData.value = {
                materials: materialsResponse.data.data || [],
                budgetSummary: { grandTotal: 0 }
            } as any
        }
    } else if (selectedBaselineId.value) {
        const version = await fetchVersion(selectedBaselineId.value as number)
        baselineData.value = (version.data || version) as unknown as BudgetData
    } else {
        // ... Original baseline logic
        const firstApproved = versions.value.find(v => v.version_number === 1)
        if (firstApproved) {
            const version = await fetchVersion(firstApproved.id as number)
            baselineData.value = (version.data || version) as unknown as BudgetData
        } else {
            baselineData.value = null
        }
    }
  } catch (error) {
    console.error('Failed to load audit baseline:', error)
  } finally {
    isLoading.value = false
  }
}

const selectedBaselineVersionNumber = computed(() => {
    if (selectedBaselineId.value === 'materials') return 'PROJECT MASTER MQ'
    if (!selectedBaselineId.value) return 'ORIGINAL'
    
    // Explicitly handle string vs number comparison for find safely
    const baseId = selectedBaselineId.value
    const v = versions.value.find(v => String(v.id) === String(baseId))
    return v ? `v${v.version_number}` : '?'
})

const baselineSummary = computed(() => {
  const data = baselineData.value as any
  if (!data) return { materialsTotal: 0, labourTotal: 0, expensesTotal: 0, logisticsTotal: 0, grandTotal: 0 }
  
  const isMaterialsBaseline = selectedBaselineId.value === 'materials'
  
  // 1. FOR BUDGET SNAPSHOTS: Use internal data
  if (!isMaterialsBaseline) {
    const summary = data.budget_summary || data.budgetSummary
    // Use stored summary if valid
    if (summary && (summary.grandTotal > 0 || summary.grand_total > 0)) {
      return {
        materialsTotal: summary.materialsTotal || summary.materials_total || 0,
        labourTotal: summary.labourTotal || summary.labour_total || 0,
        expensesTotal: summary.expensesTotal || summary.expenses_total || 0,
        logisticsTotal: summary.logisticsTotal || summary.logistics_total || 0,
        grandTotal: summary.grandTotal || summary.grand_total || 0
      }
    }
    
    // Fallback: Manually sum snapshot data using snapshot's OWN internal prices
    let matTotal = 0
    const materials = data.materials_data || data.materials || []
    materials.forEach((el: any) => {
       el.materials?.forEach((m: any) => {
          if (m.isIncluded || m.is_included) {
             matTotal += (m.totalPrice || (m.quantity * (m.unitPrice || 0))) || 0
          }
       })
    })
    
    const labTotal = (data.labour_data || data.labour || []).reduce((s: any, i: any) => s + (i.amount || 0), 0)
    const logTotal = (data.logistics_data || data.logistics || []).reduce((s: any, i: any) => s + (i.amount || 0), 0)
    const expTotal = (data.expenses_data || data.expenses || []).reduce((s: any, i: any) => s + (i.amount || 0), 0)
    
    return {
      materialsTotal: matTotal,
      labourTotal: labTotal,
      expensesTotal: expTotal,
      logisticsTotal: logTotal,
      grandTotal: matTotal + labTotal + logTotal + expTotal
    }
  }

  // 2. FOR MASTER MQ: Dynamic Pro-Forma (Master Qty * Current Prices)
  const pricingMap = new Map()
  props.currentData.materials?.forEach((el: any) => {
     el.materials?.forEach((m: any) => {
        if (m.isIncluded) {
           let key = m.persistent_id
           if (!key) {
              const eName = el.name.toLowerCase().replace(/\s+/g, '')
              const mDesc = m.description.toLowerCase().replace(/\s+/g, '')
              key = `legacy_${eName}_${mDesc}`
           }
           pricingMap.set(key, m.unitPrice || 0)
        }
     })
  })

  let matTotal = 0
  const materials = data.materials_data || data.materials || []
  materials.forEach((el: any) => {
     el.materials?.forEach((m: any) => {
        let key = m.persistent_id
        if (!key) {
           const eName = el.name.toLowerCase().replace(/\s+/g, '')
           const mDesc = m.description.toLowerCase().replace(/\s+/g, '')
           key = `legacy_${eName}_${mDesc}`
        }
        const priceAtBudget = pricingMap.get(key)
        if (priceAtBudget !== undefined) {
            matTotal += (m.quantity || 0) * priceAtBudget
        }
     })
  })

  return {
    materialsTotal: matTotal,
    labourTotal: props.currentData.labour?.reduce((s, i) => s + (i.amount || 0), 0) || 0,
    expensesTotal: props.currentData.expenses?.reduce((s, i) => s + (i.amount || 0), 0) || 0,
    logisticsTotal: props.currentData.logistics?.reduce((s, i) => s + (i.amount || 0), 0) || 0,
    grandTotal: matTotal + (props.currentData.labour?.reduce((s, i) => s + (i.amount || 0), 0) || 0) + (props.currentData.logistics?.reduce((s, i) => s + (i.amount || 0), 0) || 0) + (props.currentData.expenses?.reduce((s, i) => s + (i.amount || 0), 0) || 0)
  }
})

const variance = computed(() => props.grandTotal - baselineSummary.value.grandTotal)
const variancePercent = computed(() => {
  if (baselineSummary.value.grandTotal === 0) return 0
  return (variance.value / baselineSummary.value.grandTotal) * 100
})

const attributionBreakdown = computed(() => {
  if (!baselineData.value) return []
  
  const cats = comparisonData.value
  const totalAbs = cats.reduce((sum, c) => sum + Math.abs(c.variance), 0)
  
  return cats.map(c => ({
    label: c.category,
    variance: c.variance,
    percent: totalAbs === 0 ? 0 : (Math.abs(c.variance) / totalAbs) * 100
  }))
})

// EXPERT COMPARISON ENGINE
const comparisonData = computed(() => {
  if (!baselineData.value) return []
  
  const base = baselineData.value as any
  const results = []

  // 1. Materials
  const materialItems = compareMaterials(
    base.materials_data || base.materials || [], 
    props.currentData.materials || []
  )
  if (materialItems.length > 0) {
    results.push({
      category: 'Materials',
      variance: materialItems.reduce((sum, i) => sum + i.variance, 0),
      items: materialItems
    })
  }

  // 2. Labour
  const labourItems = compareStandardItems(
    base.labour_data || base.labour || [], 
    props.currentData.labour || [], 
    'LAB'
  )
  if (labourItems.length > 0) {
    results.push({
      category: 'Labour',
      variance: labourItems.reduce((sum, i) => sum + i.variance, 0),
      items: labourItems
    })
  }

  // 3. Expenses
  const expenseItems = compareStandardItems(
    base.expenses_data || base.expenses || [], 
    props.currentData.expenses || [], 
    'EXP'
  )
  if (expenseItems.length > 0) {
    results.push({
      category: 'Expenses',
      variance: expenseItems.reduce((sum, i) => sum + i.variance, 0),
      items: expenseItems
    })
  }

  // 4. Logistics
  const logisticsItems = compareStandardItems(
    base.logistics_data || base.logistics || [], 
    props.currentData.logistics || [], 
    'LOG'
  )
  if (logisticsItems.length > 0) {
    results.push({
      category: 'Logistics',
      variance: logisticsItems.reduce((sum, i) => sum + i.variance, 0),
      items: logisticsItems
    })
  }

  return results
})

// Helper: Material-specific comparison (nested structure)
const compareMaterials = (baseList: BudgetElement[], currList: BudgetElement[]) => {
  const resultItems: any[] = []
  const baseMap = new Map()

  // Hash baseline
  baseList?.forEach(el => {
    el.materials?.forEach(m => {
      // Priority 1: Persistent ID | Priority 2: Synchronized Legacy Key
      let key = m.persistent_id
      if (!key) {
         const eName = el.name.toLowerCase().replace(/\s+/g, '')
         const mDesc = m.description.toLowerCase().replace(/\s+/g, '')
         key = `legacy_${eName}_${mDesc}`
      }
      baseMap.set(key, { ...m, elementName: el.name, elementPersistentId: el.persistent_id })
    })
  })

  const handledKeys = new Set()

  // Compare Current
  currList?.forEach(el => {
    el.materials?.forEach(m => {
      let key = m.persistent_id
      if (!key) {
         const eName = el.name.toLowerCase().replace(/\s+/g, '')
         const mDesc = m.description.toLowerCase().replace(/\s+/g, '')
         key = `legacy_${eName}_${mDesc}`
      }
      const base = baseMap.get(key)
      handledKeys.add(key)

      const variance = (m.totalPrice || 0) - (base?.totalPrice || 0)
      if (Math.abs(variance) < 0.01) return

      // Expert Split: Volume vs Price
      const Qb = base?.quantity || 0
      const Qc = m.quantity || 0
      const Pb = base?.unitPrice || 0
      const Pc = m.unitPrice || 0

      resultItems.push({
        type: 'MAT',
        description: `[${el.name}] ${m.description}`,
        comparisonKey: key,
        persistent_id: m.persistent_id,
        baselineQty: Qb,
        currentQty: Qc,
        baselinePrice: Pb,
        currentPrice: Pc,
        variance,
        volumeVariance: (Qc - Qb) * Pb,
        priceVariance: (Pc - Pb) * Qc,
        qtyChanged: Math.abs(Qc - Qb) > 0.001,
        priceChanged: Math.abs(Pc - Pb) > 0.01,
        isNew: !base
      })
    })
  })

  // Check for Removed
  baseMap.forEach((m, key) => {
    if (!handledKeys.has(key)) {
      resultItems.push({
        type: 'MAT',
        description: `[${m.elementName}] ${m.description}`,
        comparisonKey: key,
        baselineQty: m.quantity,
        currentQty: 0,
        baselinePrice: m.unitPrice,
        currentPrice: 0,
        variance: -m.totalPrice,
        volumeVariance: -m.totalPrice,
        priceVariance: 0,
        isRemoved: true
      })
    }
  })

  return resultItems
}

// Helper: Standard List comparison (flat structure for Labour, Logistics, etc)
const compareStandardItems = (baseList: any[], currList: any[], type: 'LAB' | 'EXP' | 'LOG') => {
  const resultItems: any[] = []
  const baseMap = new Map()

  baseList?.forEach(item => {
    const key = (item.description || item.type || 'item').toLowerCase().replace(/\s+/g, '')
    baseMap.set(key, item)
  })

  const handledKeys = new Set()

  currList?.forEach(item => {
    const key = (item.description || item.type || 'item').toLowerCase().replace(/\s+/g, '')
    const base = baseMap.get(key)
    handledKeys.add(key)

    const baseAmount = base ? (base.amount || base.unitRate || 0) : 0
    const currAmount = item.amount || item.unitRate || 0
    const variance = currAmount - baseAmount

    if (Math.abs(variance) < 0.01) return

    const Qb = base ? (base.quantity || 1) : 0
    const Qc = item.quantity || 1
    const Pb = base ? (base.unitRate || base.amount || 0) : 0
    const Pc = item.unitPrice || item.unitRate || item.amount || 0

    resultItems.push({
      type,
      description: item.description || item.type,
      comparisonKey: key,
      baselineQty: Qb,
      currentQty: Qc,
      baselinePrice: Pb,
      currentPrice: Pc,
      variance,
      volumeVariance: (Qc - Qb) * Pb,
      priceVariance: (Pc - Pb) * Qc,
      qtyChanged: Math.abs(Qc - Qb) > 0.001,
      priceChanged: Math.abs(Pc - Pb) > 0.01,
      isNew: !base
    })
  })

  baseMap.forEach((item, key) => {
    if (!handledKeys.has(key)) {
      const amount = item.amount || item.unitRate || 0
      resultItems.push({
        type,
        description: item.description || item.type,
        comparisonKey: key,
        baselineQty: item.quantity || 1,
        currentQty: 0,
        baselinePrice: item.unitRate || item.amount || 0,
        currentPrice: 0,
        variance: -amount,
        volumeVariance: -amount,
        priceVariance: 0,
        isRemoved: true
      })
    }
  })

  return resultItems
}

const getCategoryIcon = (category: string) => {
   const map: any = {
      'Materials': 'mdi-cube-outline',
      'Labour': 'mdi-account-hard-hat',
      'Expenses': 'mdi-cash-multiple',
      'Logistics': 'mdi-truck-cargo-container'
   }
   return map[category] || 'mdi-circle-medium'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const varianceSign = (val: number) => val > 0 ? '↑' : '↓'

const isDownloading = ref(false)

const downloadAnalysisReport = async () => {
   try {
      isDownloading.value = true
      const baselineId = selectedBaselineId.value === 'materials' ? 'materials' : (selectedBaselineId.value || '')
      
      const response = await api.get(`/api/projects/tasks/${props.taskId}/budget/pdf`, {
         params: {
            type: 'audit',
            baseline_id: baselineId
         },
         responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `Budget_Audit_Report_${props.taskId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)

   } catch (error) {
      console.error('Failed to download audit report:', error)
      alert('Failed to generate audit report. Please try again.')
   } finally {
      isDownloading.value = true
      setTimeout(() => isDownloading.value = false, 1500)
   }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, inherit;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

select {
   appearance: none;
   background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
   background-repeat: no-repeat;
   background-position: right 0.75rem center;
   background-size: 1rem;
   padding-right: 2.5rem;
}

.fixed-blur {
   backdrop-filter: blur(8px);
}
</style>
