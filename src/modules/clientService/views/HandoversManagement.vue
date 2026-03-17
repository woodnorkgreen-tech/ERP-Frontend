<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
            <i class="mdi mdi-handshake-outline text-blue-600 dark:text-blue-400"></i>
          </div>
          Client Handover Insights
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Review customer feedback and performance ratings across completed projects.</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="fetchHandovers(1)" 
          class="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          title="Refresh Data"
        >
          <i class="mdi mdi-refresh" :class="{ 'animate-spin': loading }"></i>
        </button>
        <router-link 
          to="/client-service"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
        >
          <i class="mdi mdi-arrow-left"></i>
          Back to Dashboard
        </router-link>
      </div>
    </div>

    <!-- Filters & Stats Summary (Optional) -->
    
    <!-- Content Section -->
    <div v-if="loading && !handovers.length" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div class="relative w-20 h-20 mb-4">
        <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-gray-500 dark:text-gray-400 font-medium">Loading handover data...</p>
    </div>

    <div v-else-if="!handovers.length" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <i class="mdi mdi-clipboard-text-off-outline text-3xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">No Handover Feedback Yet</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-xs text-center mt-2">Feedback surveys will appear here once projects reach the handover stage and clients submit their responses.</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- List Column -->
      <div class="lg:col-span-1 space-y-4">
        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div 
            v-for="h in handovers" 
            :key="h.id"
            @click="selectHandover(h)"
            :class="[
              'p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden',
              selectedId === h.id 
                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/40 shadow-md ring-1 ring-blue-500/20' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/40 shadow-sm'
            ]"
          >
            <div class="flex items-start justify-between relative z-10">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">
                    {{ h.job_number }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDate(h.submitted_at) }}</span>
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ h.project_title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ h.client_name }}</p>
              </div>
              
              <div class="flex flex-col items-end">
                <div class="flex items-center px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg text-yellow-700 dark:text-yellow-400">
                  <i class="mdi mdi-star text-sm mr-1"></i>
                  <span class="font-bold text-sm">{{ h.average_rating }}</span>
                </div>
              </div>
            </div>

            <!-- Indicator for selected -->
            <div v-if="selectedId === h.id" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
          </div>
        </TransitionGroup>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex items-center justify-between pt-4">
          <button 
            @click="fetchHandovers(pagination.currentPage - 1)" 
            :disabled="pagination.currentPage === 1"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-50 transition-all"
          >
            <i class="mdi mdi-chevron-left"></i>
          </button>
          <span class="text-sm font-medium text-gray-500">Page {{ pagination.currentPage }} of {{ pagination.lastPage }}</span>
          <button 
            @click="fetchHandovers(pagination.currentPage + 1)" 
            :disabled="pagination.currentPage === pagination.lastPage"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-50 transition-all"
          >
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Detail Column -->
      <div class="lg:col-span-2">
        <div v-if="detailLoading" class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 h-[600px] flex items-center justify-center p-8">
          <div class="animate-pulse flex flex-col items-center">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>
            <div class="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
          </div>
        </div>

        <div v-else-if="currentHandover" class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
          <!-- Detail Header -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ currentHandover.project_title }}</h3>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i class="mdi mdi-account-circle-outline"></i>
                    {{ currentHandover.client_name }}
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i class="mdi mdi-account-tag-outline"></i>
                    Respondent: {{ currentHandover.respondent }}
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <i class="mdi mdi-calendar"></i>
                    {{ formatDate(currentHandover.submitted_at, true) }}
                  </div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-black text-yellow-500 dark:text-yellow-400 leading-none">
                  {{ currentHandover.average_rating }}
                </div>
                <div class="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">Score</div>
              </div>
            </div>
          </div>

          <!-- Detail Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <!-- Source & Evidence Section -->
            <div v-if="currentHandover.feedback_source !== 'survey_link' || currentHandover.evidence_notes" class="bg-blue-50 dark:bg-blue-500/5 rounded-2xl p-4 border border-blue-100 dark:border-blue-500/10">
              <h4 class="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                <i class="mdi mdi-information-outline"></i> Capture Info
              </h4>
              <p v-if="currentHandover.evidence_notes" class="text-sm text-gray-600 dark:text-gray-300 italic">"{{ currentHandover.evidence_notes }}"</p>
              <div class="mt-2 text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                Source: {{ currentHandover.feedback_source?.replace('_', ' ') }}
              </div>
            </div>

            <!-- Survey Sections -->
            <div v-if="currentHandover.question_config" class="space-y-8">
              <div v-for="section in currentHandover.question_config.sections" :key="section.title" class="space-y-4">
                <div class="flex items-center gap-3">
                  <h4 class="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{{ section.title }}</h4>
                  <div class="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="q in section.questions" 
                    :key="q.id"
                    class="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800"
                  >
                    <p class="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2">{{ q.label }}</p>
                    
                    <!-- Rating Response -->
                    <div v-if="q.type === 'rating'" class="flex items-center gap-3">
                      <div class="flex gap-1">
                        <i 
                          v-for="i in 5" 
                          :key="i"
                          :class="[
                            'mdi text-lg',
                            i <= getRatingValue(q.id) ? 'mdi-star text-yellow-500' : 'mdi-star-outline text-gray-300 dark:text-gray-700'
                          ]"
                        ></i>
                      </div>
                      <span class="font-bold text-gray-700 dark:text-gray-300">{{ getRatingValue(q.id) }}/5</span>
                    </div>

                    <!-- Text/Textarea Response -->
                    <div v-else class="text-sm text-gray-700 dark:text-gray-200 font-medium">
                      {{ currentHandover.responses?.[q.id] || 'N/A' }}
                    </div>

                    <!-- Remarks for rating questions -->
                    <p v-if="q.type === 'rating' && getRatingRemarks(q.id)" class="mt-2 text-xs italic text-gray-500 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                      {{ getRatingRemarks(q.id) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-gray-50 dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
          <i class="mdi mdi-cursor-default-click-outline text-5xl mb-4 opacity-20"></i>
          <h4 class="font-bold text-gray-500 dark:text-gray-400">Selection Required</h4>
          <p class="text-sm max-w-xs mt-1">Select a project from the list on the left to view detailed feedback and insights.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHandovers, type HandoverSummary } from '../composables/useHandovers'

const { handovers, currentHandover, loading, pagination, fetchHandovers, fetchHandoverDetails } = useHandovers()

const selectedId = ref<number | null>(null)
const detailLoading = ref(false)

const selectHandover = async (h: HandoverSummary) => {
  selectedId.value = h.id
  detailLoading.value = true
  await fetchHandoverDetails(h.id)
  detailLoading.value = false
}

const formatDate = (dateStr: string, detailed = false) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  if (detailed) {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getRatingValue = (qId: string) => {
  const response = currentHandover.value?.responses?.[qId]
  if (typeof response === 'object' && response !== null) {
    return response.rating || 0
  }
  return response || 0
}

const getRatingRemarks = (qId: string) => {
  const response = currentHandover.value?.responses?.[qId]
  if (typeof response === 'object' && response !== null) {
    return response.remarks || ''
  }
  return ''
}

onMounted(() => {
  fetchHandovers()
})
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
