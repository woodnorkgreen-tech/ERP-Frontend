<template>
  <aside :class="[
    'h-full bg-white dark:bg-gray-800 overflow-hidden flex flex-col border-r border-gray-200 dark:border-gray-700',
    collapsed ? 'w-16' : 'w-64'
  ]" style="transition: width 0.3s ease-in-out;">
    <div class="w-64 flex flex-col h-full">
      <div class="p-6 mb-8 transition-opacity duration-300" :class="collapsed ? 'opacity-0' : 'opacity-100'">
        <h2 class="font-bold mb-2 text-gray-900 dark:text-white text-2xl truncate">
          {{ getSidebarTitle() }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
          {{ getSidebarSubtitle() }}
        </p>
      </div>

      <nav class="space-y-2 px-3 flex-1 overflow-y-auto custom-scrollbar">
        <div v-for="department in navigationItems" :key="department.department" class="space-y-1">
          <!-- Department Header (Non-accordion for non-superadmin) -->
          <h3
             v-if="!isSuperAdmin"
             class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 transition-opacity duration-300"
             :class="collapsed ? 'opacity-0' : 'opacity-100'"
          >
            {{ department.department }}
          </h3>
          <!-- Department Header (Accordion) -->
          <button
            v-if="isSuperAdmin"
            @click="toggleAccordion(department.department)"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left',
              'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary',
              openAccordions[department.department] ? 'bg-gray-50 dark:bg-gray-800' : ''
            ]"
          >
            <h3
              class="text-xs font-semibold uppercase tracking-wider transition-opacity duration-300"
              :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >
              {{ department.department }}
            </h3>
            <svg
              :class="[
                'w-4 h-4 transition-transform duration-200',
                openAccordions[department.department] ? 'transform rotate-90' : '',
                 collapsed ? 'opacity-0' : 'opacity-100'
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Department Routes (Collapsible) -->
          <div
            :class="[
              'space-y-1 overflow-hidden transition-all duration-300 ease-in-out',
              isSuperAdmin ? (openAccordions[department.department] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0') : 'max-h-96 opacity-100'
            ]"
          >
            <div v-for="item in department.routes" :key="item.path">
              <RouterLink
                :to="item.path"
                :class="[
                  'flex items-center px-4 py-2 space-x-3 ml-4 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-primary',
                  route.path === item.path ? 'bg-primary text-white' : ''
                ]"
              >
                <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
                <span
                  class="font-medium whitespace-nowrap transition-opacity duration-300"
                  :class="collapsed ? 'opacity-0' : 'opacity-100'"
                >
                  {{ item.label }}
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteGuard } from '../composables/useRouteGuard'
import { useAuth } from '../composables/useAuth'

interface NavigationItem {
  path: string
  label: string
  icon: string
}

interface DepartmentGroup {
  department: string
  routes: NavigationItem[]
}

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed'])

const { getAllowedRoutes, getPanelTitle, getPanelSubtitle } = useRouteGuard()
const { user } = useAuth()
const route = useRoute()

// Accordion state - all collapsed by default
const openAccordions = reactive<Record<string, boolean>>({})

// Toggle accordion function
const toggleAccordion = (department: string) => {
  openAccordions[department] = !openAccordions[department]
}

const navigationItems = computed((): DepartmentGroup[] => {
  const routes = getAllowedRoutes()

  // Check if routes is already grouped by department (Super Admin case)
  if (routes.length > 0 && 'department' in routes[0]) {
    return routes as DepartmentGroup[]
  }

  // For other users, group all routes under a single department
  return [{
    department: 'Navigation',
    routes: routes.map(route => ({
      path: route.path!,
      label: route.label!,
      icon: route.icon!
    }))
  }]
})

const isSuperAdmin = computed(() => user.value?.roles?.includes('Super Admin'))

const getSidebarTitle = (): string => {
  return getPanelTitle()
}

const getSidebarSubtitle = (): string => {
  return getPanelSubtitle()
}
</script>
