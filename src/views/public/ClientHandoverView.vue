<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ surveyConfig.title }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ surveyConfig.description }}</p>
      </div>

      <!-- Rating Scale Info -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-8">
        <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Rating Scale:</h3>
        <ul class="text-xs text-blue-800 dark:text-blue-300 space-y-1">
          <li v-for="(desc, rating) in surveyConfig.rating_scale_info" :key="rating">
            <strong>{{ rating }}</strong> - {{ desc }}
          </li>
        </ul>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Unable to Load Survey</h3>
        <p class="text-red-600 dark:text-red-300">{{ error }}</p>
      </div>

      <!-- Success State (Already Submitted) -->
      <div v-else-if="surveyData?.submitted" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-8 text-center shadow-sm">
        <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Thank You!</h2>
        <p class="text-green-600 dark:text-green-300 mb-6">Your feedback has been successfully submitted.</p>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Submitted on {{ formatDate(surveyData.submitted_at) }}
        </div>
      </div>

      <!-- Survey Form -->
      <div v-else class="space-y-8">
        <!-- Progress Bar -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ answeredCount }}/{{ totalRequired }} answered</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>

        <!-- Survey Questions -->
        <div v-for="section in surveyConfig.sections" :key="section.id" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ section.title }}</h2>
          <p v-if="section.description" class="text-gray-600 dark:text-gray-400 mb-6">{{ section.description }}</p>
          
          <div class="space-y-6">
            <QuestionRenderer
              v-for="question in section.questions"
              :key="question.id"
              :question="question"
              v-model="responses[question.id]"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <button
            @click="handleSubmit"
            :disabled="!isValid || saving"
            :class="[
              'w-full py-4 px-6 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              isValid && !saving
                ? 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="saving" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
            <span v-else>Submit Feedback</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHandover } from '@/modules/projects/composables/useHandover'
import { SURVEY_CONFIG, validateResponses, getRequiredQuestions } from '@/modules/projects/config/surveyQuestions'
import QuestionRenderer from '@/modules/projects/components/survey/QuestionRenderer.vue'

const route = useRoute()
const { fetchPublicSurvey, submitPublicSurvey, surveyData, loading, error, saving } = useHandover()

const surveyConfig = SURVEY_CONFIG
const responses = ref<Record<string, any>>({})

// Progress tracking
const totalRequired = computed(() => getRequiredQuestions().length)
const answeredCount = computed(() => {
  const required = getRequiredQuestions()
  return required.filter(q => {
    const response = responses.value[q.id]
    if (!response) return false
    if (q.has_remarks && typeof response === 'object') {
      return response.rating !== null && response.rating !== undefined
    }
    return response !== null && response !== undefined && response !== ''
  }).length
})
const progressPercentage = computed(() => {
  return totalRequired.value > 0 ? Math.round((answeredCount.value / totalRequired.value) * 100) : 0
})

// Validation
const isValid = computed(() => {
  const validation = validateResponses(responses.value)
  return validation.valid
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleSubmit = async () => {
  if (!isValid.value || !route.params.token) return

  try {
    await submitPublicSurvey(route.params.token as string, {
      respondent_info: responses.value.respondent_info || null,
      responses: responses.value
    })
  } catch (e) {
    // Error handled by composable
  }
}

onMounted(async () => {
  const token = route.params.token as string
  if (token) {
    await fetchPublicSurvey(token)
    
    // Load existing responses if any
    if (surveyData.value?.responses) {
      responses.value = { ...surveyData.value.responses }
    }
  }
})
</script>
