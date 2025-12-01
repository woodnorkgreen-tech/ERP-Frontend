<template>
  <div class="question-container bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-full flex flex-col">
    <!-- Rating Question -->
    <div v-if="question.type === 'rating'" class="space-y-3 flex-1">
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        {{ question.label }}
        <span v-if="question.required" class="text-red-500">*</span>
      </label>
      
      <!-- Rating Buttons -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="rating in 5"
          :key="rating"
          type="button"
          @click="updateRating(rating)"
          :class="[
            'w-12 h-12 rounded-lg text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            currentRating === rating
              ? 'bg-blue-600 text-white shadow-md transform scale-105'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          :title="getRatingLabel(rating)"
        >
          {{ rating }}
        </button>
      </div>
      
      <!-- Rating Scale Labels -->
      <div class="grid grid-cols-5 gap-1 text-xs text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <div class="font-medium">1</div>
          <div class="text-[10px]">Very Poor</div>
        </div>
        <div class="text-center">
          <div class="font-medium">2</div>
          <div class="text-[10px]">Poor</div>
        </div>
        <div class="text-center">
          <div class="font-medium">3</div>
          <div class="text-[10px]">Average</div>
        </div>
        <div class="text-center">
          <div class="font-medium">4</div>
          <div class="text-[10px]">Good</div>
        </div>
        <div class="text-center">
          <div class="font-medium">5</div>
          <div class="text-[10px]">Excellent</div>
        </div>
      </div>
      
      <!-- Remarks Field (if enabled) -->
      <div v-if="question.has_remarks" class="mt-auto pt-3">
        <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
          Remarks (Optional)
        </label>
        <textarea
          :value="currentRemarks"
          @input="updateRemarks($event)"
          rows="2"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          placeholder="Add any additional comments..."
        ></textarea>
      </div>
    </div>

    <!-- Yes/No Question -->
    <div v-else-if="question.type === 'yes_no'" class="space-y-3 flex-1">
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        {{ question.label }}
        <span v-if="question.required" class="text-red-500">*</span>
      </label>
      <div class="flex gap-3">
        <button
          type="button"
          @click="updateValue(true)"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
            modelValue === true
              ? 'bg-green-600 text-white shadow-md transform scale-105'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          Yes
        </button>
        <button
          type="button"
          @click="updateValue(false)"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
            modelValue === false
              ? 'bg-red-600 text-white shadow-md transform scale-105'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          No
        </button>
      </div>
    </div>

    <!-- Text Input Question -->
    <div v-else-if="question.type === 'text'" class="space-y-3 flex-1">
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        {{ question.label }}
        <span v-if="question.required" class="text-red-500">*</span>
      </label>
      <input
        type="text"
        :value="modelValue"
        @input="updateValue(($event.target as HTMLInputElement).value)"
        :placeholder="question.placeholder || ''"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
      />
    </div>

    <!-- Textarea Question -->
    <div v-else-if="question.type === 'textarea'" class="space-y-3 flex-1">
      <label class="block text-sm font-medium text-gray-900 dark:text-white">
        {{ question.label }}
        <span v-if="question.required" class="text-red-500">*</span>
      </label>
      <textarea
        :value="modelValue"
        @input="updateValue(($event.target as HTMLTextAreaElement).value)"
        :placeholder="question.placeholder || ''"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SurveyQuestion } from '@/modules/projects/config/surveyQuestions'

interface Props {
  question: SurveyQuestion
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// For rating questions with remarks
const currentRating = computed(() => {
  if (props.question.has_remarks && typeof props.modelValue === 'object') {
    return props.modelValue?.rating
  }
  return props.modelValue
})

const currentRemarks = computed(() => {
  if (props.question.has_remarks && typeof props.modelValue === 'object') {
    return props.modelValue?.remarks || ''
  }
  return ''
})

const updateRating = (rating: number) => {
  if (props.question.has_remarks) {
    emit('update:modelValue', {
      rating,
      remarks: currentRemarks.value
    })
  } else {
    emit('update:modelValue', rating)
  }
}

const updateRemarks = (event: Event) => {
  const remarks = (event.target as HTMLTextAreaElement).value
  emit('update:modelValue', {
    rating: currentRating.value,
    remarks
  })
}

const updateValue = (value: any) => {
  emit('update:modelValue', value)
}

const getRatingLabel = (rating: number): string => {
  const labels: Record<number, string> = {
    1: 'Very Poor (Needs significant improvement)',
    2: 'Poor (Below expectations)',
    3: 'Average (Meets expectations)',
    4: 'Good (Above expectations)',
    5: 'Excellent (Exceeded expectations)'
  }
  return labels[rating] || ''
}
</script>
