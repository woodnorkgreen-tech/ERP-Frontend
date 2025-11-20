import { ref, type Ref } from 'vue'

export interface UseModalReturn<T = any> {
  isOpen: Ref<boolean>
  data: Ref<T | null>
  open: (modalData?: T) => void
  close: () => void
  toggle: () => void
}

/**
 * Composable for managing modal state
 */
export function useModal<T = any>(): UseModalReturn<T> {
  const isOpen = ref(false)
  const data = ref<T | null>(null)

  const open = (modalData?: T) => {
    data.value = modalData || null
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    // Delay clearing data to allow animations
    setTimeout(() => {
      data.value = null
    }, 300)
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  }
}
