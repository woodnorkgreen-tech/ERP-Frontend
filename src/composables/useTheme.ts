import { ref, watch, computed, inject, type InjectionKey } from 'vue'

export type Theme = 'light' | 'dark'

export interface ThemeContext {
  theme: import('vue').Ref<Theme>
  isDark: import('vue').ComputedRef<boolean>
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('Theme')

// Global theme state
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'

  const saved = localStorage.getItem('theme') as Theme
  if (saved && (saved === 'light' || saved === 'dark')) return saved

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

const theme = ref<Theme>(getInitialTheme())

// Listen for system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
  const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemDarkQuery.addEventListener('change', (e) => {
    const saved = localStorage.getItem('theme')
    if (!saved) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })
}

// Apply theme to document
const applyTheme = (newTheme: Theme) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (newTheme === 'dark') {
    root.classList.add('dark')
    root.style.setProperty('color-scheme', 'dark')
  } else {
    root.classList.remove('dark')
    root.style.setProperty('color-scheme', 'light')
  }
}

// Watch for theme changes and persist to localStorage
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
}, { immediate: true })

export const useTheme = () => {
  // Try to inject global theme
  const injected = inject(ThemeKey, null)

  if (injected) {
    return injected
  }

  // Fallback to local logic if not provided
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const isDark = computed(() => theme.value === 'dark')

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  }
}

// Provider function for global theme (called in main.ts)
export const provideTheme = (): ThemeContext => {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const isDark = computed(() => theme.value === 'dark')

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  }
}
