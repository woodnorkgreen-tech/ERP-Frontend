import { ref, type Ref } from 'vue'

export interface FeedbackMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
  timeout?: number
}

export interface UseFeedbackReturn {
  messages: Ref<FeedbackMessage[]>
  addMessage: (type: FeedbackMessage['type'], message: string, timeout?: number) => void
  removeMessage: (messageId: string) => void
  clearAll: () => void
  success: (message: string, timeout?: number) => void
  error: (message: string, timeout?: number) => void
  warning: (message: string, timeout?: number) => void
  info: (message: string, timeout?: number) => void
}

/**
 * Composable for managing user feedback messages
 */
export function useFeedback(): UseFeedbackReturn {
  console.log('useFeedback composable initialized')
  const messages = ref<FeedbackMessage[]>([])
  const timeoutIds = new Map<string, number>()

  const addMessage = (
    type: FeedbackMessage['type'],
    message: string,
    timeout: number = 5000
  ) => {
    const feedbackMessage: FeedbackMessage = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date(),
      timeout
    }

    messages.value.push(feedbackMessage)

    // Auto-remove message after timeout
    if (timeout > 0) {
      const timeoutId = setTimeout(() => {
        removeMessage(feedbackMessage.id)
      }, timeout)
      timeoutIds.set(feedbackMessage.id, timeoutId)
    }
  }

  const removeMessage = (messageId: string) => {
    const index = messages.value.findIndex(msg => msg.id === messageId)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }

    // Clear timeout if exists
    const timeoutId = timeoutIds.get(messageId)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutIds.delete(messageId)
    }
  }

  const clearAll = () => {
    messages.value = []
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId))
    timeoutIds.clear()
  }

  // Convenience methods
  const success = (message: string, timeout?: number) => addMessage('success', message, timeout)
  const error = (message: string, timeout?: number) => addMessage('error', message, timeout)
  const warning = (message: string, timeout?: number) => addMessage('warning', message, timeout)
  const info = (message: string, timeout?: number) => addMessage('info', message, timeout)

  return {
    messages,
    addMessage,
    removeMessage,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
