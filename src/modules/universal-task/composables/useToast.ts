import { ref, readonly } from 'vue'

interface ToastMessage {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<ToastMessage[]>([])
let toastId = 0

export const useToast = () => {
  const addToast = (message: string, type: ToastMessage['type'] = 'info', duration = 5000) => {
    const id = ++toastId
    const toast: ToastMessage = { id, message, type, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => addToast(message, 'success', duration)
  const error = (message: string, duration?: number) => addToast(message, 'error', duration)
  const info = (message: string, duration?: number) => addToast(message, 'info', duration)
  const warning = (message: string, duration?: number) => addToast(message, 'warning', duration)

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}