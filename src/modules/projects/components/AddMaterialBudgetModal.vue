<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div class="flex items-center space-x-4">
          <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-calculator-variant text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Budget Allocation</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select procurement pathway</p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 overflow-y-auto custom-scrollbar flex-grow">
        <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Choose strategy:</p>

        <!-- Budget Options -->
        <div class="space-y-4">
          <!-- Main Budget Option -->
          <div
            @click="selectBudgetType('main')"
            class="group relative border rounded-2xl p-5 cursor-pointer transition-all duration-300"
            :class="selectedBudgetType === 'main' 
              ? 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-500 ring-2 ring-blue-500/10' 
              : 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 hover:border-blue-300'"
          >
            <div class="flex items-start space-x-4">
              <div 
                class="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                :class="selectedBudgetType === 'main' ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'"
              >
                <div v-if="selectedBudgetType === 'main'" class="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Add to Main Budget</h4>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed"> Include this material in the primary project scope. Standard for original deliverables and base quote.</p>
                <div class="mt-3 flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                   <i class="mdi mdi-check-decagram mr-1 text-sm"></i>
                   Standard Approval
                </div>
              </div>
            </div>
          </div>

          <!-- Supplementary Budget Option -->
          <div
            @click="selectBudgetType('supplementary')"
            class="group relative border rounded-2xl p-5 cursor-pointer transition-all duration-300"
            :class="selectedBudgetType === 'supplementary' 
              ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-500 ring-2 ring-amber-500/10' 
              : 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 hover:border-amber-300'"
          >
            <div class="flex items-start space-x-4">
              <div 
                class="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                :class="selectedBudgetType === 'supplementary' ? 'border-amber-600' : 'border-gray-200 dark:border-gray-700'"
              >
                <div v-if="selectedBudgetType === 'supplementary'" class="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Create Supplementary Quote</h4>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Separate addition for late requests. These items require independent client verification and quote sign-off.</p>
                <div class="mt-3 flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tighter">
                   <i class="mdi mdi-alert-circle-outline mr-1 text-sm"></i>
                   Client Review Req.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-800">
          <h5 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Integrity Check:</h5>
          <ul class="text-[11px] text-gray-600 dark:text-gray-400 space-y-2 font-medium">
             <li class="flex items-center"><i class="mdi mdi-circle-small text-blue-500 text-lg"></i> Main budget flows to primary PO</li>
             <li class="flex items-center"><i class="mdi mdi-circle-small text-amber-500 text-lg"></i> Supplementary creates new cost center</li>
          </ul>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3 items-center">
        <button
          @click="closeModal"
          class="px-6 py-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-bold transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirmSelection"
          :disabled="!selectedBudgetType"
          class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:scale-100"
        >
          <i class="mdi mdi-plus-circle-outline text-lg"></i>
          <span>Add to Project</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}
</style>

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
