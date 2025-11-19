<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Add Material to Budget
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Choose how you want to add this material to the project budget:
        </p>

        <!-- Budget Options -->
        <div class="space-y-4">
          <!-- Main Budget Option -->
          <div
            @click="selectBudgetType('main')"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400': selectedBudgetType === 'main' }"
          >
            <div class="flex items-start space-x-3">
              <input
                type="radio"
                v-model="selectedBudgetType"
                value="main"
                class="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  Add to Main Budget
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Include this material in the primary project budget. This is the standard option for materials that are part of the original project scope.
                </p>
                <div class="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Included in main quote and budget
                </div>
              </div>
            </div>
          </div>

          <!-- Supplementary Budget Option -->
          <div
            @click="selectBudgetType('supplementary')"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-amber-500 dark:hover:border-amber-400 transition-colors"
            :class="{ 'border-amber-500 bg-amber-50 dark:bg-amber-900 dark:border-amber-400': selectedBudgetType === 'supplementary' }"
          >
            <div class="flex items-start space-x-3">
              <input
                type="radio"
                v-model="selectedBudgetType"
                value="supplementary"
                class="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  Create Supplementary Budget
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Create a separate budget addition for this material. Use this for additional items requested after the initial quote, requiring separate approval.
                </p>
                <div class="mt-2 flex items-center text-xs text-amber-600 dark:text-amber-400">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Requires separate approval and quote
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Notes -->
        <div class="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h5 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Important Notes:</h5>
          <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Main budget materials are included in the initial quote</li>
            <li>• Supplementary budgets require client approval before proceeding</li>
            <li>• You can change this later if needed</li>
          </ul>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmSelection"
          :disabled="!selectedBudgetType"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Add Material
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BudgetType } from '../types/budget'

/**
 * Props interface for the AddMaterialBudgetModal component
 */
interface Props {
  /** Whether the modal is open */
  isOpen: boolean
}

/**
 * Events emitted by the AddMaterialBudgetModal component
 */
interface Emits {
  /** Emitted when modal should be closed */
  'close': []
  /** Emitted when budget type is selected */
  'select-budget-type': [budgetType: BudgetType]
}

// Component setup
defineProps<Props>()
const emit = defineEmits<Emits>()

// Selected budget type
const selectedBudgetType = ref<BudgetType | null>(null)

/**
 * Select budget type
 */
const selectBudgetType = (budgetType: BudgetType) => {
  selectedBudgetType.value = budgetType
}

/**
 * Confirm selection and emit event
 */
const confirmSelection = () => {
  if (selectedBudgetType.value) {
    emit('select-budget-type', selectedBudgetType.value)
    closeModal()
  }
}

/**
 * Close modal and reset state
 */
const closeModal = () => {
  emit('close')
  selectedBudgetType.value = null
}
</script>
