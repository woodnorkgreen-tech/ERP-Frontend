<template>
  <!-- Readonly budget data display -->
  <div class="budget-data-display bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="space-y-6">
      <!-- Materials Tab - Readonly -->
      <BudgetMaterialsTab
        v-show="activeTab === 'materials'"
        :form-data="state.formData"
        :import-status="null"
        :materials-update-check="null"
        :is-importing="false"
        :is-checking-updates="false"
        :readonly="true"
      />

      <!-- Labour Tab - Readonly -->
      <BudgetLabourTab
        v-show="activeTab === 'labour'"
        :form-data="state.formData"
        :readonly="true"
      />

      <!-- Expenses Tab - Readonly -->
      <BudgetExpensesTab
        v-show="activeTab === 'expenses'"
        :form-data="state.formData"
        :readonly="true"
      />

      <!-- Logistics Tab - Readonly -->
      <BudgetLogisticsTab
        v-show="activeTab === 'logistics'"
        :form-data="state.formData"
        :readonly="true"
      />

      <!-- Summary Tab - Readonly -->
      <BudgetSummaryTab
        v-show="activeTab === 'summary'"
        :materials-total="materialsTotal"
        :labour-total="labourTotal"
        :expenses-total="expensesTotal"
        :logistics-total="logisticsTotal"
        :grand-total="grandTotal"
        :readonly="true"
      />



      <!-- No action buttons in readonly display -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBudgetState } from '../../../composables/useBudgetState'
import { useBudgetOperations } from '../../../composables/useBudgetOperations'
import BudgetMaterialsTab from '../BudgetMaterialsTab.vue'
import BudgetLabourTab from '../BudgetLabourTab.vue'
import BudgetExpensesTab from '../BudgetExpensesTab.vue'
import BudgetLogisticsTab from '../BudgetLogisticsTab.vue'
import BudgetSummaryTab from '../BudgetSummaryTab.vue'
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

// Remove duplicate additions tab since it's already included in useBudgetOperations

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
