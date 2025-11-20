import { ref, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

export interface UseDataRefreshReturn {
  isRefreshing: Ref<boolean>
  queueRefresh: (key: string, refreshFn: () => Promise<unknown>) => Promise<void>
  cancelRefresh: (key: string) => void
  cancelAll: () => void
}

/**
 * Composable to handle data refresh with race condition prevention
 */
export function useDataRefresh(): UseDataRefreshReturn {
  const refreshQueue = ref<Map<string, Promise<unknown>>>(new Map())
  const isRefreshing = ref(false)
  const timeouts = ref<Map<string, number>>(new Map())

  /**
   * Queue a refresh operation, preventing duplicates
   */
  const queueRefresh = async (key: string, refreshFn: () => Promise<unknown>): Promise<void> => {
    // If already refreshing this key, wait for it to complete
    const existing = refreshQueue.value.get(key)
    if (existing) {
      try {
        await existing
      } catch {
        // Ignore errors from previous refresh
      }
      return
    }

    // Start new refresh
    isRefreshing.value = true
    const promise = refreshFn()
    refreshQueue.value.set(key, promise)

    try {
      await promise
    } finally {
      refreshQueue.value.delete(key)
      if (refreshQueue.value.size === 0) {
        isRefreshing.value = false
      }
    }
  }

  /**
   * Cancel a specific refresh operation
   */
  const cancelRefresh = (key: string) => {
    refreshQueue.value.delete(key)
    const timeout = timeouts.value.get(key)
    if (timeout) {
      clearTimeout(timeout)
      timeouts.value.delete(key)
    }

    if (refreshQueue.value.size === 0) {
      isRefreshing.value = false
    }
  }

  /**
   * Cancel all pending refreshes
   */
  const cancelAll = () => {
    refreshQueue.value.clear()
    timeouts.value.forEach(timeout => clearTimeout(timeout))
    timeouts.value.clear()
    isRefreshing.value = false
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    cancelAll()
  })

  return {
    isRefreshing,
    queueRefresh,
    cancelRefresh,
    cancelAll
  }
}
