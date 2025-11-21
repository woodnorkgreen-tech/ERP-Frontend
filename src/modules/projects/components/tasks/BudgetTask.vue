<template>
  <div
    class="budget-task bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
  >
    <!-- Readonly mode with edit toggle for completed tasks -->
    <div v-if="readonly" class="space-y-4">
      <!-- Edit button for completed tasks -->
      <div v-if="task.status === 'completed'" class="flex justify-end">
        <button
          @click="toggleEditMode"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit Budget
        </button>
      </div>

      <!-- TaskDataViewer for readonly display -->
      <TaskDataViewer :task="task" />
    </div>

    <!-- Edit mode for all tasks -->
    <form v-else @submit.prevent="handleSubmit(validateBudget)" class="space-y-4">
      <!-- Edit mode notice for completed tasks -->
      <div v-if="task.status === 'completed'" class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Edit Mode</span>
        </div>
        <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
          You are editing a completed budget. Changes will be saved as updates to the existing budget.
        </p>
      </div>

      <!-- Header with title -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
      </div>

      <!-- Error Display -->
      <div
        v-if="state.error"
        class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
        </div>
        <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ state.error }}</p>
      </div>

      <!-- Success Display -->
      <div
        v-if="state.successMessage"
        class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
        </div>
        <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ state.successMessage }}</p>
      </div>

      <!-- Loading State -->
      <div
        v-if="state.isLoading"
        class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200"
            >Loading budget data...</span
          >
        </div>
      </div>

      <!-- Progress Indicator -->
      <div
        v-if="progressState.isActive"
        class="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-indigo-800 dark:text-indigo-200">{{ progressState.step }}</span>
          <span class="text-sm text-indigo-600 dark:text-indigo-400">{{ progressState.progress }}%</span>
        </div>
        <div class="w-full bg-indigo-200 dark:bg-indigo-700 rounded-full h-2">
          <div
            class="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-300"
            :style="{ width: progressState.progress + '%' }"
          ></div>
        </div>
        <p class="text-xs text-indigo-700 dark:text-indigo-300 mt-1">{{ progressState.message }}</p>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex flex-wrap gap-2 sm:gap-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

        <!-- Tab Content -->
        <BudgetMaterialsTab
          v-show="activeTab === 'materials'"
          :form-data="state.formData"
          :import-status="state.importStatus"
          :materials-update-check="state.materialsUpdateCheck"
          :approval-status="state.materialsApprovalStatus"
          :is-importing="state.isImporting"
          :is-checking-updates="state.isCheckingUpdates"
          @import-materials="importMaterials"
          @check-updates="checkMaterialsUpdates"
          @re-import-materials="reImportMaterials"
          @calculate-material-total="calculateMaterialTotal"
        />

        <BudgetLabourTab
          v-show="activeTab === 'labour'"
          :form-data="state.formData"
          @add-labour-item="addLabourItem"
          @calculate-labour-total="calculateLabourTotal"
          @remove-labour-item="removeLabourItem"
        />

        <BudgetExpensesTab
          v-show="activeTab === 'expenses'"
          :form-data="state.formData"
          @add-expense="addExpense"
          @remove-expense="removeExpense"
        />

        <BudgetLogisticsTab
          v-show="activeTab === 'logistics'"
          :form-data="state.formData"
          @add-logistics-item="addLogisticsItem"
          @remove-logistics-item="removeLogisticsItem"
          @calculate-logistics-total="calculateLogisticsTotal"
        />

        <BudgetSummaryTab
          v-show="activeTab === 'summary'"
          :materials-total="materialsTotal"
          :labour-total="labourTotal"
          :expenses-total="expensesTotal"
          :logistics-total="logisticsTotal"
          :grand-total="grandTotal"
        />

        <!-- Budget Additions Tab -->
        <BudgetAdditionsTab
          v-show="activeTab === 'additions'"
          :task="task"
          :budget-data="state.formData"
        />

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          @click="saveDraft"
          :disabled="state.isSaving"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors order-2 sm:order-1"
        >
          {{ state.isSaving ? 'Saving...' : 'Save Draft' }}
        </button>
        <button
          type="submit"
          :disabled="state.isSaving"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors order-1 sm:order-2"
        >
          {{ state.isSaving ? 'Submitting...' : 'Submit Budget' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBudgetState } from '../../composables/useBudgetState'
import { useBudgetOperations } from '../../composables/useBudgetOperations'
import { useBudgetValidation } from '../../composables/useBudgetValidation'
import { useBudgetProgress } from '../../composables/useBudgetProgress'
import TaskDataViewer from './TaskDataViewer.vue'
import BudgetMaterialsTab from './BudgetMaterialsTab.vue'
import BudgetLabourTab from './BudgetLabourTab.vue'
import BudgetExpensesTab from './BudgetExpensesTab.vue'
import BudgetLogisticsTab from './BudgetLogisticsTab.vue'
import BudgetSummaryTab from './BudgetSummaryTab.vue'
import BudgetAdditionsTab from './BudgetAdditionsTab.vue'
import type { EnquiryTask } from '../../types/enquiry'


interface Props {
  task: EnquiryTask
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

// For completed tasks, default to readonly mode to show the "Edit Budget" button
const readonly = ref(props.readonly || props.task.status === 'completed')

const emit = defineEmits(['task-completed', 'task-updated'])

const toggleEditMode = () => {
  readonly.value = !readonly.value
}

// Use composables for state management
const { state, materialsTotal, labourTotal, expensesTotal, logisticsTotal, grandTotal } = useBudgetState()

// Use validation composable (for future use)
const { validateBudget } = useBudgetValidation()

// Use progress composable
const { progressState } = useBudgetProgress()

// Use operations composable
const {
  activeTab,
  tabs,
  loadBudgetData,
  importMaterials,
  checkMaterialsUpdates,
  reImportMaterials,
  calculateMaterialTotal,
  addLabourItem,
  calculateLabourTotal,
  removeLabourItem,
  addExpense,
  removeExpense,
  addLogisticsItem,
  removeLogisticsItem,
  calculateLogisticsTotal,
  saveDraft,
  handleSubmit, // Used in template form submission
} = useBudgetOperations(state, props.task, emit)

// Remove the duplicate additions tab addition since it's already in useBudgetOperations

// Watch for readonly changes to reload data when switching modes
watch(readonly, (newReadonly: boolean) => {
  if (!newReadonly) {
    // When switching to edit mode, reload the data
    loadBudgetData()
  }
})


// Initialize
onMounted(() => {
  loadBudgetData()
})
</script>

