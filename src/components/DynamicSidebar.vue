<template>
  <aside
    :class="[
      'h-full flex flex-col transition-all duration-500 ease-in-out border-r z-40',
      'bg-white dark:bg-[#0b0f1a] border-slate-200 dark:border-slate-800',
      collapsed ? 'w-20' : 'w-72'
    ]"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <!-- Branding Section -->
    <div class="h-20 flex items-center px-6 mb-4 overflow-hidden shrink-0">
      <div class="flex items-center gap-4 min-w-max">
        <div class="w-10 h-10 rounded-xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center ring-1 ring-slate-800 dark:ring-blue-500">
          <img src="/wng-logo.png" alt="Logo" class="w-7 h-7 object-contain brightness-110" />
        </div>
        <div class="flex flex-col transition-all duration-300" :class="collapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'">
          <span class="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400 leading-none mb-1">Strategic ERP</span>
          <span class="text-sm font-black text-slate-900 dark:text-white truncate max-w-[160px]">{{ getSidebarTitle() }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 custom-scrollbar">
      <div v-for="group in navigationItems" :key="group.department" class="mb-6 last:mb-2">
        <!-- Group Header -->
        <div 
          v-if="!collapsed" 
          class="flex items-center gap-2 px-4 mb-3 transition-opacity duration-300"
          :class="collapsed ? 'opacity-0' : 'opacity-100'"
        >
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-gray-500 whitespace-nowrap">
            {{ group.department }}
          </span>
          <div class="h-[1px] w-full bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <!-- Links -->
        <div class="space-y-1">
          <div v-for="item in group.routes" :key="item.path" class="relative group">
            <RouterLink
              :to="item.path"
              :class="[
                'flex items-center h-11 rounded-xl transition-all duration-200 group ring-inset mx-2',
                route.path === item.path
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              ]"
              :title="collapsed ? item.label : ''"
            >
              <!-- Active Indicator Bar -->
              <div 
                class="absolute left-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full transition-all duration-300"
                :class="route.path === item.path ? 'h-6 top-2.5 opacity-100' : 'h-0 top-1/2 opacity-0'"
              ></div>

              <!-- Icon Wrapper -->
              <div class="w-14 flex items-center justify-center shrink-0">
                <i 
                  :class="[
                    'mdi text-2xl transition-all duration-200',
                    item.icon,
                    route.path === item.path ? 'scale-110 opacity-100' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                  ]"
                ></i>
              </div>

              <!-- Label -->
              <span 
                class="font-bold text-sm whitespace-nowrap transition-all duration-300 overflow-hidden"
                :class="collapsed ? 'w-0 opacity-0 -translate-x-4' : 'w-full opacity-100 translate-x-0'"
              >
                {{ item.label }}
              </span>

              <!-- Mini Indicator for Active (Collapsed mode) -->
              <div
                v-if="collapsed && route.path === item.path"
                class="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500"
              ></div>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Footer / Status -->
    <div class="p-4 mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
       <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
             <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <div class="flex flex-col transition-all duration-300" :class="collapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'">
            <span class="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">System Link</span>
            <span class="text-[11px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Stable & Encrypted</span>
          </div>
       </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

defineEmits(['update:collapsed', 'mouseenter', 'mouseleave'])

const { getAllowedRoutes, getPanelTitle } = useRouteGuard()
const { user } = useAuth()
const route = useRoute()

const navigationItems = computed((): DepartmentGroup[] => {
  const routes = getAllowedRoutes()

  // Check if routes is already grouped by department (Super Admin case)
  if (routes.length > 0 && 'department' in routes[0]) {
    return routes as DepartmentGroup[]
  }

  // For other users, group all routes under a single department
  return [{
    department: 'General Navigation',
    routes: routes.map(item => ({
      path: item.path!,
      label: item.label!,
      icon: item.icon!
    }))
  }]
})

const getSidebarTitle = (): string => {
  return getPanelTitle()
}
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.4);
}

/* Translucency fixes for glassmorphism */
.bg-white\/80 {
  background-color: rgba(255, 255, 255, 0.8);
}
.dark .dark\:bg-\[\#0f172a\]\/90 {
  background-color: rgba(15, 23, 42, 0.9);
}
</style>
