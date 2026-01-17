<template>
  <div class="archival-task bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
    <!-- Header with Actions -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="mdi mdi-archive-outline text-purple-600"></i>
          Archival Report
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Generate comprehensive project documentation including design assets and budget.
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="handleAutoPopulate" 
          :disabled="loading"
          class="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i :class="loading ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-refresh'"></i>
          {{ isReportEmpty ? 'Populate Data' : 'Refresh Data' }}
        </button>
        
        <button 
          v-if="!isReportEmpty"
          @click="handleDownloadPdf"
          :disabled="loading" 
          class="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="mdi mdi-file-pdf-box"></i>
          Download Report
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="loading && !reportData" class="flex-1 flex items-center justify-center p-12">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500 font-medium">Loading archival data...</p>
      </div>
    </div>

    <div v-else-if="isReportEmpty" class="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-900/50">
      <div class="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-4">
        <i class="mdi mdi-file-document-edit-outline text-3xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Archive</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        This will gather data from all project tasks (Budget, Design, Production, etc.) to create a final report.
      </p>
      <button 
        @click="handleAutoPopulate"
        class="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all hover:scale-105 flex items-center gap-2"
      >
        <i class="mdi mdi-magic-staff"></i>
        Start Archival Process
      </button>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-6 space-y-6">
      
      <!-- Report Status Banner -->
      <div class="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white dark:bg-gray-800 rounded-md text-purple-600">
            <i class="mdi mdi-information-outline text-xl"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Review Data Before Generation</h4>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Last updated: {{ formatDate(reportData.updated_at) }}
            </p>
          </div>
        </div>
        <span class="px-3 py-1 bg-white dark:bg-gray-800 text-xs font-bold text-purple-700 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-700 uppercase tracking-wider">
            {{ reportData.status || 'Draft' }}
        </span>
      </div>

      <!-- Data Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Project Info -->
        <section class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <i class="mdi mdi-domain"></i> Project Details
          </h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">Client</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ reportData.client_name || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Project Code</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ reportData.project_code || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-500">Dates</dt>
              <dd class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(reportData.start_date) }} - {{ formatDate(reportData.end_date) }}
              </dd>
            </div>
          </dl>
        </section>

        <!-- Scope & Deliverables -->
        <section class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <i class="mdi mdi-format-list-checks"></i> Scope Summary
          </h3>
           <p class="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line" v-if="reportData.project_scope">
             {{ reportData.project_scope }}
           </p>
           <p v-else class="text-sm text-gray-400 italic">No scope details captured.</p>
        </section>
        
        <!-- Budget & Finance -->
         <section class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <i class="mdi mdi-currency-usd"></i> Financials
          </h3>
          <div v-if="reportData.checklist_project_budget_file" class="flex items-center gap-2 text-green-600 text-sm font-medium">
             <i class="mdi mdi-check-circle"></i> Budget File Included
          </div>
          <p v-else class="text-sm text-gray-500">Budget data will be included in the final report.</p>
        </section>

        <!-- Design Assets -->
        <section class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
           <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <i class="mdi mdi-image-multiple-outline"></i> Design Assets
          </h3>
           <div class="text-sm text-gray-600 dark:text-gray-300">
             <p class="mb-2">Assets from Design Task will be attached to the final PDF.</p>
             <!-- We could list asset counts here if available in reportData -->
           </div>
        </section>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useArchivalReport, type ArchivalReportData } from '../../composables/useArchivalReport'
import type { EnquiryTask } from '../../types/enquiry'

interface Props {
  task: EnquiryTask
  readonly?: boolean
}

const props = defineProps<Props>()
const reportData = ref<ArchivalReportData | null>(null)
const loading = ref(false)

const { getReport, autoPopulate, downloadPdf } = useArchivalReport()

// Check if report is essentially empty/new
const isReportEmpty = computed(() => {
  return !reportData.value || !reportData.value.id
})

// Format helper
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'TBC'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const loadReport = async () => {
  if (!props.task?.id) return
  loading.value = true
  try {
    const data = await getReport(props.task.id)
    if (data) {
      reportData.value = data
    }
  } catch (error) {
    console.error('Failed to load archival report:', error)
  } finally {
    loading.value = false
  }
}

const handleAutoPopulate = async () => {
    if (!props.task?.id) return
    loading.value = true
    try {
        const result = await autoPopulate(props.task.id)
        // Refresh full report after population
        await loadReport()
        // Alert/Notify success (could use a toast if available)
        console.log('Data populated successfully')
    } catch (error) {
        console.error('Auto-populate failed:', error)
        alert('Failed to populate data from other tasks.')
    } finally {
        loading.value = false
    }
}

const handleDownloadPdf = async () => {
    if (!props.task?.id || !reportData.value?.id) return
    
    // Optimistic loading state handled by button
    loading.value = true
    try {
        await downloadPdf(props.task.id, reportData.value.id)
    } catch (error) {
        console.error('PDF download failed:', error)
        alert('Failed to download PDF report.')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  loadReport()
})

</script>

<style scoped>
/* Clean scrollbar for the content area */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
