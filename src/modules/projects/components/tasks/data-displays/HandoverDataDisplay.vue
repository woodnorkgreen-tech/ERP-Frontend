<template>
  <div class="handover-data-display">
    <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Client Survey Completed</h4>
          
          <!-- Feedback Source Badge -->
          <div class="flex items-center gap-2 mb-2">
            <span v-if="surveyData.feedback_source === 'survey_link'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              📋 Formal Survey Link
            </span>
            <span v-else-if="surveyData.feedback_source === 'email'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              📧 Email Communication
            </span>
            <span v-else-if="surveyData.feedback_source === 'whatsapp'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              💬 WhatsApp/SMS
            </span>
            <span v-else-if="surveyData.feedback_source === 'phone_call'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              📞 Phone Call
            </span>
            <span v-else-if="surveyData.feedback_source === 'in_person'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              🤝 In-Person Meeting
            </span>
            <span v-else-if="surveyData.feedback_source === 'social_media'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
              📱 Social Media
            </span>
            <span v-else-if="surveyData.feedback_source" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              📝 {{ surveyData.feedback_source }}
            </span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ averageRating }}/5</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div>Submitted: {{ formatDate(surveyData.submitted_at) }}</div>
        <div v-if="surveyData.feedback_received_at">
          Feedback Received: {{ formatDate(surveyData.feedback_received_at) }}
        </div>
      </div>

      <!-- Evidence Notes -->
      <div v-if="surveyData.evidence_notes" class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
        <h6 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Evidence & Context:</h6>
        <p class="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ surveyData.evidence_notes }}</p>
      </div>

      <!-- Evidence Files Gallery -->
      <div v-if="surveyData.evidence_files && surveyData.evidence_files.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
        <h6 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Attached Evidence:</h6>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="(file, index) in surveyData.evidence_files" :key="index" class="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
            <!-- Image Preview -->
            <div v-if="file.type && file.type.startsWith('image/')" class="aspect-square relative">
              <img :src="file.url" :alt="file.name" class="w-full h-full object-cover cursor-pointer" @click="openFile(file.url)" />
            </div>
            <!-- File Icon for non-images -->
            <div v-else class="aspect-square flex flex-col items-center justify-center p-2 text-center">
              <svg class="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span class="text-[10px] text-gray-500 truncate w-full">{{ file.name }}</span>
            </div>
            
            <!-- Hover Actions -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <a :href="file.url" target="_blank" class="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm" title="Download/View">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Survey Responses by Section -->
      <div class="mt-6 space-y-6">
        <div v-for="section in surveyConfig.sections" :key="section.id">
          <h5 class="font-semibold text-gray-900 dark:text-white mb-3">{{ section.title }}</h5>
          <div class="space-y-3">
            <div v-for="question in section.questions" :key="question.id" class="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{{ question.label }}</p>
              
              <!-- Display response based on type -->
              <div v-if="question.type === 'rating'">
                <div v-if="question.has_remarks">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-blue-600 dark:text-blue-400">
                      {{ getResponse(question.id)?.rating || 'N/A' }}/5
                    </span>
                    <span v-if="getResponse(question.id)?.rating" class="text-sm text-gray-600 dark:text-gray-400">
                      - {{ getRatingText(getResponse(question.id).rating) }}
                    </span>
                  </div>
                  <p v-if="getResponse(question.id)?.remarks" class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Remarks: {{ getResponse(question.id).remarks }}
                  </p>
                </div>
                <div v-else>
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-blue-600 dark:text-blue-400">
                      {{ getResponse(question.id) || 'N/A' }}/5
                    </span>
                    <span v-if="getResponse(question.id)" class="text-sm text-gray-600 dark:text-gray-400">
                      - {{ getRatingText(getResponse(question.id)) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else-if="question.type === 'yes_no'">
                <span :class="getResponse(question.id) ? 'text-green-600' : 'text-red-600'">
                  {{ getResponse(question.id) ? 'Yes' : 'No' }}
                </span>
              </div>
              <div v-else-if="question.type === 'text' || question.type === 'textarea'">
                <p class="text-sm text-gray-600 dark:text-gray-400 italic">{{ getResponse(question.id) || 'No response' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'

interface Props {
  task: EnquiryTask
  taskData: Record<string, any>
}

const props = defineProps<Props>()

// Extract survey data
const surveyData = computed(() => props.taskData?.data || props.taskData || {})

// Get survey config (questions)
const surveyConfig = computed(() => {
  return surveyData.value.question_config_snapshot || { sections: [] }
})

// Calculate average rating
const averageRating = computed(() => {
  if (!surveyData.value.responses) return 0

  const ratings: number[] = []

  // Extract all rating values from responses
  Object.values(surveyData.value.responses).forEach(response => {
    // If response has a 'rating' key (for questions with remarks)
    if (typeof response === 'object' && response !== null && 'rating' in response) {
      const rating = (response as any).rating
      if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
        ratings.push(rating)
      }
    }
    // If response is directly a numeric rating
    else if (typeof response === 'number' && response >= 1 && response <= 5) {
      ratings.push(response)
    }
  })

  if (ratings.length === 0) return 0

  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return +(sum / ratings.length).toFixed(1)
})

// Helper to get response value
const getResponse = (questionId: string) => {
  return surveyData.value.responses?.[questionId]
}

// Helper to convert rating number to text
const getRatingText = (rating: number): string => {
  const labels: Record<number, string> = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  }
  return labels[rating] || ''
}

// Format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB')
  } catch {
    return 'N/A'
  }
}

// Open file in new tab
const openFile = (url: string) => {
  if (!url) return
  window.open(url, '_blank')
}
</script>

<style scoped>
.handover-data-display {
  max-width: none;
}
</style>
