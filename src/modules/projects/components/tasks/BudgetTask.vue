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

      <!-- Preview Mode Banner -->
      <div class="flex items-center space-x-4 mb-4" v-if="isPreviewingVersion">
        <div class="flex-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div>
              <h5 class="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Previewing: {{ previewingVersionLabel }}
              </h5>
              <p class="text-xs text-blue-600 dark:text-blue-300">
                You are viewing a snapshot. Changes made here will not be saved unless you restore this version.
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="exitPreview"
              class="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Exit Preview
            </button>
            <button 
              @click="restoreFromPreview"
              class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Restore This Version
            </button>
          </div>
        </div>
      </div>

      <!-- Material Update Warning Banner -->
      <div class="flex items-center space-x-4 mb-6" v-if="materialsUpdateStatus.hasUpdate && !isPreviewingVersion">
        <div class="flex-1 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start space-x-3">
          <svg class="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex-1">
            <h5 class="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
              Budget Updated
            </h5>
            <p class="text-sm text-orange-700 dark:text-orange-300">
              The MATERIAL LIST has been modified since this BUDGET was created. Click "Refresh" to sync with latest materials (your pricing will be preserved).
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <button
            @click="refreshFromMaterials"
            :disabled="isRefreshing"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center"
          >
            <svg v-if="isRefreshing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isRefreshing ? 'Refreshing...' : 'Refresh from MATERIAL' }}
          </button>
          <button
            @click="materialsUpdateStatus.hasUpdate = false"
            class="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors"
            title="Dismiss"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
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

      <!-- Version Management Buttons -->
      <div class="flex items-center justify-end space-x-2 mb-4">
        <CreateVersionButton
          title="Budget"
          type="budget"
          @create="handleCreateVersion"
        />
        <button
          @click="showVersionHistory = true"
          class="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Version History</span>
        </button>
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

    <!-- Version History Modal -->
    <VersionHistoryModal
      :is-open="showVersionHistory"
      :versions="budgetVersions"
      :is-loading="versionsLoading"
      :error="versionsError"
      title="Budget"
      type="budget"
      @close="showVersionHistory = false"
      @preview="handlePreviewVersion"
      @restore="handleRestoreVersion"
      @refresh="fetchVersions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useVersioning } from '@/composables/useVersioning'
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
import VersionHistoryModal from '../shared/VersionHistoryModal.vue'
import CreateVersionButton from '../shared/CreateVersionButton.vue'
import type { EnquiryTask } from '../../types/enquiry'
import api from '@/plugins/axios'


interface Props {
  task: EnquiryTask
  readonly?: boolean
  initialTab?: string
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
} = useBudgetOperations(state, props.task, emit, props.initialTab)

// Version Management
const showVersionHistory = ref(false)
const {
  versions: budgetVersions,
  isLoading: versionsLoading,
  error: versionsError,
  fetchVersions,
  createVersion,
  restoreVersion,
} = useVersioning(computed(() => props.task.id), 'budget')

// Preview Mode State
const isPreviewingVersion = ref(false)
const previewingVersionLabel = ref('')
const previewingVersionId = ref<number | null>(null)
const originalBudgetData = ref<any>(null)

// Materials Update Status
const materialsUpdateStatus = ref({
  hasUpdate: false,
  message: '',
  materialsLastUpdated: null as string | null,
  budgetLastImported: null as string | null
})
const isRefreshing = ref(false)

// Check materials update status
const checkMaterialsUpdateStatus = async () => {
  try {
    const response = await api.get(`/api/projects/tasks/${props.task.id}/budget/check-materials-update`)
    if (response.data?.data) {
      materialsUpdateStatus.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to check materials update status:', error)
  }
}

// Refresh from materials (import)
const refreshFromMaterials = async () => {
  if (!confirm('This will sync your budget with the latest approved materials.\n\n✅ Your pricing will be PRESERVED\n✅ Quantities will be updated\n✅ New materials will be added\n\nContinue?')) {
    return
  }
  
  try {
    isRefreshing.value = true
    // Force re-import even if materials already exist
    await importMaterials(true)
    
    // Reload budget data to show the imported materials in the UI
    await loadBudgetData()
    
    // After successful import, materials are now in sync - hide the warning banner
    materialsUpdateStatus.value.hasUpdate = false
    
    // No need to re-check - we just imported, so we know they're in sync
  } catch (error: any) {
    alert(error.message || 'Failed to refresh from materials')
  } finally {
    isRefreshing.value = false
  }
}

const handleCreateVersion = async (label: string | undefined) => {
  try {
    const response = await createVersion(label)
    
    // Show material version link info
    if (response.data?.materials_version_id) {
      alert(
        `${response.message}\nLinked to Material Version ${response.data.materials_version_number || 'latest'}`
      )
    } else {
      alert(response.message || 'Version created successfully')
    }
  } catch (error) {
    console.error('Failed to create version:', error)
    alert('Failed to create version. Please try again.')
  }
}

const handleRestoreVersion = async (versionId: number) => {
  try {
    const response = await restoreVersion(versionId)
    
    // Show warnings
    const warnings = response.warnings || (response.warning ? [response.warning] : [])
    if (warnings.length > 0) {
      alert('⚠️ Warnings:\n' + warnings.join('\n'))
    }
    
    if (response.status_reset_to_draft) {
      alert('✅ Version restored! Note: Budget status has been reset to draft.')
    } else {
      alert('✅ Version restored successfully!')
    }
    
    // Reload budget data
    await loadBudgetData()
    showVersionHistory.value = false
  } catch (error) {
    console.error('Failed to restore version:', error)
    alert('Failed to restore version. Please try again.')
  }
}

// Preview Mode Handlers
const handlePreviewVersion = async (version: any) => {
  // Save original budget data
  originalBudgetData.value = JSON.parse(JSON.stringify(state.formData))
  
  // Load version data into the form
  if (version.data) {
    Object.assign(state.formData, version.data)
  }
  
  // Set preview mode
  isPreviewingVersion.value = true
  previewingVersionLabel.value = version.label
  previewingVersionId.value = version.id
}

const exitPreview = async () => {
  // Restore original data
  if (originalBudgetData.value) {
    Object.assign(state.formData, originalBudgetData.value)
  } else {
    // Fallback: reload from server
    await loadBudgetData()
  }
  
  // Exit preview mode
  isPreviewingVersion.value = false
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
  originalBudgetData.value = null
}

const restoreFromPreview = async () => {
  if (!previewingVersionId.value) return
  
  // Exit preview first
  isPreviewingVersion.value = false
  
  // Then restore the version
  await handleRestoreVersion(previewingVersionId.value)
  
  // Clean up
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
  originalBudgetData.value = null
}

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
  checkMaterialsUpdateStatus()
})
</script>

