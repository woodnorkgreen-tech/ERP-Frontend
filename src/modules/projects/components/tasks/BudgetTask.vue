<template>
  <div class="budget-task bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-sm p-4 sm:p-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    
  

    <!-- Main Content Area -->
    <div class="px-6 pb-6">
      <!-- Edit Mode Warning -->
      <div v-if="task.status === 'completed' && !readonly" class="mb-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
         <i class="mdi mdi-information text-blue-500 text-xl"></i>
         <div>
            <p class="text-sm font-bold text-blue-900 dark:text-blue-200">Editing Completed Budget</p>
            <p class="text-xs text-blue-700 dark:text-blue-300/80">Changes made now will update the official budget record.</p>
         </div>
      </div>

      <!-- Preview Mode Banner -->
      <div v-if="isPreviewingVersion" class="mb-6 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 flex items-center justify-between gap-4 animate-fade-in">
         <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <i class="mdi mdi-eye"></i>
            </div>
            <div>
               <p class="text-sm font-bold text-indigo-900 dark:text-indigo-200">Previewing Version: {{ previewingVersionLabel }}</p>
               <p class="text-xs text-indigo-700 dark:text-indigo-300/80">You are viewing a historical snapshot. Restore to make changes.</p>
            </div>
         </div>
         <div class="flex gap-2">
            <button @click="exitPreview" class="px-3 py-1.5 bg-white text-gray-700 text-xs font-bold rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">Exit</button>
            <button @click="restoreFromPreview" class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700">Restore</button>
         </div>
      </div>

       <!-- Material Updates Banner -->
       <div v-if="materialsUpdateStatus.hasUpdate && !isPreviewingVersion && !readonly" class="mb-6 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
         <div class="flex items-center gap-3">
            <div class="p-2 bg-orange-100 rounded-lg text-orange-600 animate-pulse">
               <i class="mdi mdi-alert-decagram"></i>
            </div>
            <div>
               <p class="text-sm font-bold text-orange-900 dark:text-orange-200">Materials List Updated</p>
               <p class="text-xs text-orange-700 dark:text-orange-300/80">The source material list has changed. Sync to keep budget accurate.</p>
            </div>
         </div>
         <div class="flex gap-2">
            <button @click="materialsUpdateStatus.hasUpdate = false" class="px-3 py-1.5 text-orange-600 hover:bg-orange-100 text-xs font-bold rounded-lg transition-colors">Dismiss</button>
            <button 
               @click="refreshFromMaterials" 
               :disabled="isRefreshing"
               class="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-orange-500/30 flex items-center gap-2 transition-all"
            >
               <i v-if="isRefreshing" class="mdi mdi-loading mdi-spin"></i>
               <i v-else class="mdi mdi-sync"></i>
               {{ isRefreshing ? 'Syncing...' : 'Sync Materials' }}
            </button>
         </div>
      </div>

      <!-- Top Bar: Title & Actions -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">

       <div class="flex items-center gap-3">
          <!-- Version History -->
          <button
            @click="showVersionHistory = true"
            class="px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <i class="mdi mdi-history"></i> History
          </button>
          
          <!-- Create Version -->
          <CreateVersionButton
            title="Budget"
            type="budget"
            @create="handleCreateVersion"
            class="!text-xs !font-bold !uppercase !tracking-wider !px-3 !py-2 !rounded-xl"
          />

          <!-- Download PDF -->
          <button
            @click="downloadBudgetPdf"
            :disabled="isDownloading"
            class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
          >
            <i v-if="isDownloading" class="mdi mdi-loading mdi-spin"></i>
            <i v-else class="mdi mdi-file-pdf-box"></i> 
            {{ isDownloading ? 'Generating...' : 'Download PDF' }}
          </button>

          <!-- Toggle Edit Mode (Completed Tasks) -->
          <button
            v-if="task.status === 'completed'"
            @click="toggleEditMode"
            class="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
             <i class="mdi" :class="readonly ? 'mdi-pencil' : 'mdi-eye'"></i>
             {{ readonly ? 'Edit Budget' : 'View Mode' }}
          </button>
       </div>
    </div>

      <!-- Read-Only View -->
      <div v-if="readonly">
         <TaskDataViewer :task="task" @edit="toggleEditMode" />
      </div>

      <!-- Edit Form -->
      <form v-else @submit.prevent="handleSubmit(validateBudget)">
         
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

         <!-- Loader -->
         <div v-if="state.isLoading" class="bg-white dark:bg-gray-900 border border-blue-500 dark:border-blue-800 rounded-2xl rounded-tl-none p-12 flex flex-col items-center justify-center text-gray-400 min-h-[500px]">
            <i class="mdi mdi-loading mdi-spin text-4xl mb-4 text-blue-500"></i>
            <p class="font-bold tracking-widest uppercase text-[10px] animate-pulse">Synchronizing Budget Intelligence...</p>
         </div>

         <!-- Tab Contents: Integrated into the Box -->
         <div v-else class="bg-white dark:bg-gray-900 border border-blue-500 dark:border-blue-800 rounded-2xl rounded-tl-none p-8 shadow-sm min-h-[500px] relative z-0">
            <div v-show="activeTab === 'materials'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <BudgetMaterialsTab
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
                  @switch-tab="activeTab = $event"
               />
            </div>
            <div v-show="activeTab === 'labour'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <BudgetLabourTab
                  :form-data="state.formData"
                  @add-labour-item="addLabourItem"
                  @calculate-labour-total="calculateLabourTotal"
                  @remove-labour-item="removeLabourItem"
               />
            </div>
            <div v-show="activeTab === 'expenses'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <BudgetExpensesTab
                  :form-data="state.formData"
                  @add-expense="addExpense"
                  @remove-expense="removeExpense"
               />
            </div>
            <div v-show="activeTab === 'logistics'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <BudgetLogisticsTab
                  :form-data="state.formData"
                  @add-logistics-item="addLogisticsItem"
                  @remove-logistics-item="removeLogisticsItem"
                  @calculate-logistics-total="calculateLogisticsTotal"
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

         <!-- Error/Success Messages -->
         <div v-if="state.error" class="mt-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm font-medium flex items-center gap-3">
            <i class="mdi mdi-alert-circle text-xl"></i>
            {{ state.error }}
         </div>
         <div v-if="state.successMessage" class="mt-6 p-4 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-medium flex items-center gap-3">
             <i class="mdi mdi-check-circle text-xl"></i>
            {{ state.successMessage }}
         </div>

         <!-- Bottom Actions -->
         <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
               v-if="task.status !== 'skipped' && task.status !== 'completed'"
               type="button"
               @click="showSkipModal = true"
               class="px-6 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors"
            >
               Skip Task
            </button>

            <button
               v-if="['skipped', 'completed'].includes(task.status)"
               type="button"
               @click="$emit('task-updated')"
               class="px-6 py-2.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors"
            >
                {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
            </button>
            <button
               type="button"
               @click="saveDraft"
               :disabled="state.isSaving"
               class="px-6 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2"
            >
               <i v-if="state.isSaving" class="mdi mdi-loading mdi-spin"></i>
               Save Draft
            </button>
            <button
               type="submit"
               :disabled="state.isSaving"
               class="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
               <i v-if="state.isSaving" class="mdi mdi-loading mdi-spin"></i>
               {{ state.isSaving ? 'Submitting...' : 'Save & Submit' }}
            </button>

            <button
               v-if="task.status !== 'completed'"
               type="button"
               @click="completeTask"
               :disabled="state.isSaving"
               class="px-8 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
               <i class="mdi mdi-check-circle"></i>
               Complete Task
            </button>
         </div>

      </form>
    </div>

    <!-- Modals -->
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

    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-[101] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showSkipModal = false"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Skip Task?</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Depending on your workflow, skipping this task might affect later stages. Please realize a reason.
        </p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none mb-6"
            placeholder="Reason for skipping..."
        ></textarea>
        <div class="flex justify-end gap-3">
            <button 
                @click="showSkipModal = false"
                class="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="handleSkipTask"
                :disabled="!skipReason.trim() || isSkipping"
                class="px-6 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
                {{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
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
import BudgetComparisonTab from './BudgetComparisonTab.vue'
import VersionHistoryModal from '../shared/VersionHistoryModal.vue'
import CreateVersionButton from '../shared/CreateVersionButton.vue'
import type { EnquiryTask } from '../../types/enquiry'
import api from '@/plugins/axios'
import lodash from 'lodash'

interface Props {
  task: EnquiryTask
  readonly?: boolean
  initialTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

const { user: authUser } = useAuth()

const hasAuthRole = (role: string) => {
  return authUser.value?.roles?.some((r: string) => r.toLowerCase() === role.toLowerCase()) || false
}

// Check if user is Production (should be readonly by default)
const isProductionUser = computed(() => {
  return hasAuthRole('Production') && !hasAuthRole('Admin') && !hasAuthRole('Super Admin')
})

// For completed tasks or Production users, default to readonly mode
const readonly = ref(props.readonly || props.task.status === 'completed' || isProductionUser.value)

const projectInfo = computed(() => {
  const enquiry = props.task.enquiry
  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || `ENQ-${props.task.id}`,
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'N/A',
    eventVenue: enquiry?.venue || 'TBC',
    setupDate: enquiry?.expected_delivery_date || 'TBC'
  }
})

const formatDate = (dateValue: string | Date | null | undefined) => {
  if (!dateValue || dateValue === 'TBC') return 'TBC'
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    if (isNaN(date.getTime())) return 'TBC'
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'TBC'
  }
}

const emit = defineEmits(['task-completed', 'task-updated'])

// Skip Task Logic
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await api.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        emit('task-updated')
        showSkipModal.value = false
        state.successMessage = 'Task skipped successfully'
        skipReason.value = ''
    } catch (err: any) {
        console.error('Skip task error:', err)
        state.error = err.response?.data?.message || 'Failed to skip task'
    } finally {
        isSkipping.value = false
    }
}

const toggleEditMode = () => {
  readonly.value = !readonly.value
}

const getStatusClasses = (status: string) => {
   switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'skipped': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
   }
}

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

// Use composables for state management
const { state, materialsTotal, labourTotal, expensesTotal, logisticsTotal, grandTotal } = useBudgetState()
const { validateBudget } = useBudgetValidation()
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
  handleSubmit,
  completeTask,
} = useBudgetOperations(state, props.task, emit, props.initialTab)

// --- INTELLIGENT AUTO-SAVE ---
// Debounced save to persist changes while user is typing/editing
// This prevents data loss when navigating away to "Materials Task"
const debouncedSave = lodash.debounce(async () => {
  if (!readonly.value && (state.formData.status as string) !== 'completed' && !state.isLoading) {
    await saveDraft()
  }
}, 2000) // 2 second delay

// Watch for changes in form data with deep observation
watch(() => state.formData, (newVal, oldVal) => {
  if (!state.isLoading && !state.isImporting) {
    debouncedSave()
  }
}, { deep: true })

// Ensure we save immediately if they leave the component
onBeforeUnmount(async () => {
  debouncedSave.flush() // Force any pending save to execute
})
// -----------------------------

// Version Management
const showVersionHistory = ref(false)
const {
  versions: budgetVersions,
  isLoading: versionsLoading,
  error: versionsError,
  fetchVersions,
  fetchVersion,
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
const isDownloading = ref(false)

const downloadBudgetPdf = async () => {
  try {
    isDownloading.value = true
    const response = await api.get(`/api/projects/tasks/${props.task.id}/budget/pdf`, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `Budget_Report_${projectInfo.value.projectId}.pdf`
    link.click()
    window.URL.revokeObjectURL(link.href)
    
    state.successMessage = 'PDF generated and download started'
    setTimeout(() => state.successMessage = '', 3000)
  } catch (error) {
    console.error('Failed to download PDF:', error)
    state.error = 'Failed to generate PDF. Please try again later.'
  } finally {
    isDownloading.value = false
  }
}

const checkMaterialsUpdateStatus = async () => {
  try {
    const response = await api.get(`/api/projects/tasks/${props.task.id}/budget/check-materials-update`)
    if (response.data?.data) {
      materialsUpdateStatus.value = response.data.data
      // Also update state for useBudgetState to see obsolete IDs
      state.materialsUpdateCheck = response.data.data
    }
  } catch (error) {
    console.error('Failed to check materials update status:', error)
  }
}

const baselineTotal = computed(() => {
   // 1. PRIORITIZE SNAPSHOT: If we have historical snapshots, use the latest one as the primary baseline
   if (budgetVersions.value && budgetVersions.value.length > 0) {
      const latest = budgetVersions.value[0]
      const data = (latest.data || latest) as any
      const summary = data.budget_summary || data.budgetSummary
      
      if (summary && (summary.grandTotal > 0 || summary.grand_total > 0)) {
         return summary.grandTotal || summary.grand_total
      }
      
      // Manual sum if summary missing in snapshot
      let total = 0
      const materials = data.materials_data || data.materials || []
      materials.forEach((el: any) => {
         el.materials?.forEach((m: any) => {
            if (m.isIncluded || m.is_included !== false) {
               total += (m.totalPrice || ((m.quantity || 0) * (m.unitPrice || 0)))
            }
         })
      })
      const lab = (data.labour_data || data.labour || []).reduce((s: any, i: any) => s + (i.amount || 0), 0)
      const log = (data.logistics_data || data.logistics || []).reduce((s: any, i: any) => s + (i.amount || 0), 0)
      const exp = (data.expenses_data || data.expenses || []).reduce((s: any, i: any) => s + (i.amount || 0), 0)
      return total + lab + log + exp
   }

   // 2. FALLBACK TO MASTER MQ: If no snapshots exist, compare against HQ design
   const analysis = materialsUpdateStatus.value as any
   if (!analysis || !analysis.analysis?.analysis_raw_materials) return grandTotal.value

   const masterMaterials = analysis.analysis.analysis_raw_materials
   let total = 0

   const pricingMap = new Map()
   state.formData.materials.forEach((el: any) => {
      el.materials?.forEach((m: any) => {
         if (m.isIncluded !== false) {
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

const refreshFromMaterials = async () => {
  if (!confirm('This will sync your budget with the latest approved materials.\n\n✅ Your pricing will be PRESERVED\n✅ Quantities will be updated\n✅ New materials will be added\n\nContinue?')) {
    return
  }
  
  try {
    isRefreshing.value = true
    // Save current state first to ensure latest prices are preserved in the merge
    await saveDraft()
    await importMaterials(true)
    await loadBudgetData()
    materialsUpdateStatus.value.hasUpdate = false
    state.successMessage = 'Materials synced successfully. Prices preserved.'
    setTimeout(() => state.successMessage = '', 3000)
  } catch (error: any) {
    console.error('Sync failed:', error)
    state.error = error.response?.data?.message || error.message || 'Sync failed: Materials might need approval.'
    state.successMessage = ''
  } finally {
    isRefreshing.value = false
  }
}

const handleCreateVersion = async (label: string | undefined) => {
  try {
    const response = await createVersion(label)
    if (response.data?.materials_version_id) {
      alert(`${response.message}\nLinked to Material Version ${response.data.materials_version_number || 'latest'}`)
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
    const warnings = response.warnings || (response.warning ? [response.warning] : [])
    if (warnings.length > 0) {
      alert('⚠️ Warnings:\n' + warnings.join('\n'))
    }
    
    if (response.status_reset_to_draft) {
      alert('✅ Version restored! Note: Budget status has been reset to draft.')
    } else {
      alert('✅ Version restored successfully!')
    }
    
    await loadBudgetData()
    showVersionHistory.value = false
  } catch (error) {
    console.error('Failed to restore version:', error)
    alert('Failed to restore version. Please try again.')
  }
}

const handlePreviewVersion = async (version: any) => {
  try {
    originalBudgetData.value = JSON.parse(JSON.stringify(state.formData))
    
    let versionWithData = version
    if (!version.data) {
      if (typeof fetchVersion === 'function') {
        versionWithData = await fetchVersion(version.id)
      }
    }

    if (versionWithData && versionWithData.data) {
      const data = versionWithData.data
      state.formData.materials = data.materials_data || data.materials || []
      state.formData.labour = data.labour_data || data.labour || []
      state.formData.expenses = data.expenses_data || data.expenses || []
      state.formData.logistics = data.logistics_data || data.logistics || []
      state.formData.projectInfo = data.project_info || data.projectInfo || state.formData.projectInfo
      
      isPreviewingVersion.value = true
      previewingVersionLabel.value = version.label
      previewingVersionId.value = version.id
    }
  } catch (error) {
    console.error('Failed to preview version:', error)
    alert('Failed to load version data for preview.')
  }
}

const exitPreview = async () => {
  if (originalBudgetData.value) {
    Object.assign(state.formData, originalBudgetData.value)
  } else {
    await loadBudgetData()
  }
  isPreviewingVersion.value = false
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
  originalBudgetData.value = null
}

const restoreFromPreview = async () => {
  if (!previewingVersionId.value) return
  isPreviewingVersion.value = false
  await handleRestoreVersion(previewingVersionId.value)
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
  originalBudgetData.value = null
}

watch(readonly, (newReadonly: boolean) => {
  if (!newReadonly) {
    loadBudgetData()
  }
})

onMounted(() => {
  loadBudgetData()
  checkMaterialsUpdateStatus()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
