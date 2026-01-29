<template>
   <!-- Readonly budget data display -->
   <div class="budget-data-display animate-in fade-in duration-500">
      <!-- Tabs Navigation: Premium Boxed Style -->
      <div class="flex items-end gap-1 mb-0 relative z-10 px-1 leading-none">
         <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            @click="activeTab = tab.key"
            class="flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-t-2xl border-t border-l border-r relative"
            :class="activeTab === tab.key 
               ? 'bg-white dark:bg-gray-900 border-blue-500 dark:border-blue-800 text-blue-600 -mb-[1px] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]' 
               : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 pb-3.5'"
         >
            <i class="mdi" :class="getTabIcon(tab.key)"></i>
            <span>{{ tab.label }}</span>
            
            <!-- Top Accent Bar for Active Tab -->
            <div v-if="activeTab === tab.key" class="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-t-2xl"></div>
         </button>
      </div>

      <!-- Tab Contents: Integrated into the Box -->
      <div class="bg-white dark:bg-gray-900 border border-blue-500 dark:border-blue-800 rounded-2xl rounded-tl-none p-8 shadow-sm min-h-[500px] relative z-0">
         <div v-show="activeTab === 'materials'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BudgetMaterialsTab
               :form-data="state.formData"
               :import-status="null"
               :materials-update-check="null"
               :is-importing="false"
               :is-checking-updates="false"
               :readonly="true"
            />
         </div>
         <div v-show="activeTab === 'labour'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BudgetLabourTab
               :form-data="state.formData"
               :readonly="true"
            />
         </div>
         <div v-show="activeTab === 'expenses'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BudgetExpensesTab
               :form-data="state.formData"
               :readonly="true"
            />
         </div>
         <div v-show="activeTab === 'logistics'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BudgetLogisticsTab
               :form-data="state.formData"
               :readonly="true"
            />
         </div>
         <div v-show="activeTab === 'summary'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BudgetSummaryTab
               :materials-total="materialsTotal"
               :labour-total="labourTotal"
               :expenses-total="expensesTotal"
               :logistics-total="logisticsTotal"
               :grand-total="grandTotal"
               :baseline-total="baselineTotal"
               :readonly="true"
            />
         </div>
         <div v-show="activeTab === 'comparison'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BudgetComparisonTab
               :current-data="state.formData"
               :task-id="task.id"
               :grand-total="grandTotal"
            />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetState } from '../../../composables/useBudgetState'
import { useBudgetOperations } from '../../../composables/useBudgetOperations'
import BudgetMaterialsTab from '../BudgetMaterialsTab.vue'
import BudgetLabourTab from '../BudgetLabourTab.vue'
import BudgetExpensesTab from '../BudgetExpensesTab.vue'
import BudgetLogisticsTab from '../BudgetLogisticsTab.vue'
import BudgetSummaryTab from '../BudgetSummaryTab.vue'
import BudgetComparisonTab from '../BudgetComparisonTab.vue'
import type { EnquiryTask } from '../../../types/enquiry'
import type { BudgetData } from '../../../services/budgetService'

interface Props {
  task: EnquiryTask
  taskData?: BudgetData
  enquiryId?: number
}

const props = withDefaults(defineProps<Props>(), {
  enquiryId: 0,
})

// Use composables for state management
const { state, materialsTotal, labourTotal, expensesTotal, logisticsTotal, grandTotal } = useBudgetState()

// Use operations composable for data loading only
const { activeTab, tabs, loadBudgetData } = useBudgetOperations(state, props.task, { 'task-completed': () => {}, 'task-updated': () => {} })

const getTabIcon = (key: string) => {
   const map: Record<string, string> = {
      'materials': 'mdi-cube-outline',
      'labour': 'mdi-account-hard-hat',
      'expenses': 'mdi-cash-multiple',
      'logistics': 'mdi-truck-fast-outline',
      'summary': 'mdi-chart-pie',
      'comparison': 'mdi-compare-horizontal'
   }
   return map[key] || 'mdi-circle'
}

// Remove duplicate additions tab since it's already included in useBudgetOperations

const baselineTotal = computed(() => {
   const analysis = state.materialsUpdateCheck as any
   if (!analysis || !analysis.analysis?.analysis_raw_materials) return grandTotal.value

   const masterMaterials = analysis.analysis.analysis_raw_materials
   let total = 0

   const pricingMap = new Map()
   state.formData.materials.forEach((el: any) => {
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

   masterMaterials.forEach((el: any) => {
      el.materials?.forEach((m: any) => {
         let key = m.persistent_id
         if (!key) {
            const eName = el.name.toLowerCase().replace(/\s+/g, '')
            const mDesc = m.description.toLowerCase().replace(/\s+/g, '')
            key = `legacy_${eName}_${mDesc}`
         }
         const priceAtBudget = pricingMap.get(key)
         if (priceAtBudget !== undefined) {
             total += (m.quantity || 0) * priceAtBudget
         }
      })
   })

   return total + labourTotal.value + expensesTotal.value + logisticsTotal.value
})

// Initialize with task data if provided, otherwise load from API
if (props.taskData) {
  // Populate state with provided task data
  // TaskDataViewer passes the full API response, so we need to extract the data
  const apiResponse = props.taskData as unknown as Record<string, unknown>
  const budgetData = (apiResponse.data as BudgetData) || (apiResponse as unknown as BudgetData) // Handle both {data: budgetData} and direct budgetData

  state.formData = {
    projectInfo: budgetData.projectInfo || {},
    materials: budgetData.materials || [],
    labour: budgetData.labour || [],
    expenses: budgetData.expenses || [],
    logistics: budgetData.logistics || [],
    status: budgetData.status || 'draft',
    materialsImportInfo: budgetData.materialsImportInfo
  }
} else {
  // Load budget data from API
  loadBudgetData()
}
</script>

<style scoped>
.budget-data-display {
  max-width: none;
}
</style>
