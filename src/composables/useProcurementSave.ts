import { reactive, toRefs } from 'vue'
import type { ProcurementTaskData } from '@/modules/projects/services'
import { ProcurementService } from '@/modules/projects/services'

interface SaveState {
  isSaving: boolean
  saveError: string | null
  saveSuccess: boolean
  lastSaveTime: Date | null
  hasUnsavedChanges: boolean
}

export function useProcurementSave(taskId?: number) {
  const state = reactive<SaveState>({
    isSaving: false,
    saveError: null,
    saveSuccess: false,
    lastSaveTime: null,
    hasUnsavedChanges: false
  })

  let saveQueue: Promise<void> | null = null

  const save = async (data: ProcurementTaskData, maxRetries = 3): Promise<void> => {
    // Wait for any pending save
    if (saveQueue) {
      await saveQueue
    }

    state.isSaving = true
    state.saveError = null
    state.saveSuccess = false

    saveQueue = (async () => {
      let lastError: Error | null = null

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (!taskId) {
            throw new Error('Task ID is required for saving')
          }

          await ProcurementService.saveProcurementData(taskId, data)

          state.saveSuccess = true
          state.lastSaveTime = new Date()
          state.hasUnsavedChanges = false

          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            state.saveSuccess = false
          }, 3000)

          return // Success, exit retry loop

        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error')

          console.warn(`Save attempt ${attempt} failed:`, lastError.message)

          if (attempt < maxRetries) {
            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s...
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }

      // All retries failed
      state.saveError = lastError?.message || 'All save attempts failed'

    })()

    await saveQueue
    state.isSaving = false
    saveQueue = null
  }

  const markAsChanged = () => {
    state.hasUnsavedChanges = true
  }

  const clearError = () => {
    state.saveError = null
  }

  return {
    ...toRefs(state),
    save,
    markAsChanged,
    clearError
  }
}
