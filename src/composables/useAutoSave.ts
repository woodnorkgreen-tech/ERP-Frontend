import { watch, onBeforeUnmount } from 'vue'

interface AutoSaveOptions {
  interval?: number
  debounce?: number
  enabled?: boolean
}

export function useAutoSave<T>(
  data: () => T,
  saveFunction: () => Promise<void>,
  options: AutoSaveOptions = {}
) {
  const {
    interval = 30000, // 30 seconds
    debounce = 2000,   // 2 seconds
    enabled = true
  } = options

  let autoSaveInterval: number | null = null
  let debounceTimeout: number | null = null
  let isActive = enabled

  const debouncedSave = async () => {
    if (!isActive) return

    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // Set new timeout
    debounceTimeout = window.setTimeout(async () => {
      try {
        await saveFunction()
        console.log('Auto-save completed successfully')
      } catch (error) {
        console.warn('Auto-save failed:', error)
      }
    }, debounce)
  }

  const immediateSave = async () => {
    if (!isActive) return

    // Clear pending debounced save
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }

    try {
      await saveFunction()
      console.log('Immediate save completed successfully')
    } catch (error) {
      console.warn('Immediate save failed:', error)
    }
  }

  // Watch for changes and trigger debounced save
  watch(data, () => {
    debouncedSave()
  }, { deep: true })

  // Periodic save as backup
  if (interval > 0) {
    autoSaveInterval = window.setInterval(() => {
      if (isActive) {
        console.log('Periodic auto-save triggered')
        immediateSave()
      }
    }, interval)
  }

  // Cleanup function
  const stopAutoSave = () => {
    isActive = false

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }

    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null
    }
  }

  // Cleanup on component unmount
  onBeforeUnmount(() => {
    stopAutoSave()
  })

  return {
    stopAutoSave,
    immediateSave,
    debouncedSave
  }
}
