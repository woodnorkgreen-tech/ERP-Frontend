<template>
  <aside
    :class="[
      'h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] border-r z-40 relative group/sidebar shadow-2xl',
      'bg-white/80 dark:bg-[#0b0f1a]/90 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60',
      collapsed ? 'w-20' : 'w-72'
    ]"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <!-- Expert Background Detail -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-700"></div>

    <!-- Branding Section -->
    <div class="h-20 flex items-center px-6 mb-4 overflow-hidden shrink-0 relative z-10">
      <div class="flex items-center gap-4 min-w-max">
        <div class="relative">
          <div class="absolute -inset-1 blur-sm bg-blue-500/20 rounded-xl opacity-0 group-hover/sidebar:opacity-100 transition-opacity"></div>
          <div class="w-11 h-11 rounded-xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center ring-2 ring-slate-800 dark:ring-blue-400 shadow-xl relative overflow-hidden group/logo">
            <img src="/wng-logo.png" alt="Logo" class="w-8 h-8 object-contain brightness-110 active:scale-90 transition-transform cursor-pointer z-10" />
            <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity"></div>
          </div>
        </div>
        <div class="flex flex-col transition-all duration-300" :class="collapsed ? 'opacity-0 scale-95 translate-x-[-10px]' : 'opacity-100 scale-100 translate-x-0'">
          <span class="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 leading-none mb-1.5 drop-shadow-sm">Strategic ERP</span>
          <span class="text-base font-black text-slate-900 dark:text-white truncate max-w-[170px] tracking-tight">{{ getSidebarTitle() }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 custom-scrollbar relative z-10">
      <div v-for="group in navigationItems" :key="group.department" class="mb-8 last:mb-2">
        <!-- Group Header -->
        <div 
          v-if="!collapsed" 
          class="flex items-center gap-3 px-5 mb-4 transition-opacity duration-300"
          :class="collapsed ? 'opacity-0' : 'opacity-100'"
        >
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 whitespace-nowrap drop-shadow-sm">
            {{ group.department }}
          </span>
          <div class="h-[1px] w-full bg-slate-100 dark:bg-slate-800/80"></div>
        </div>

        <!-- Links -->
        <div class="space-y-1.5 px-1">
          <div v-for="item in group.routes" :key="item.path" class="relative">
            <RouterLink
              :to="item.path"
              :class="[
                'flex items-center h-12 rounded-xl transition-all duration-300 group ring-inset relative overflow-hidden',
                route.path === item.path
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] dark:shadow-[10px_10px_30px_-5px_rgba(37,99,235,0.6)]'
                  : 'text-slate-900 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
              ]"
              :title="collapsed ? item.label : ''"
            >
              <!-- Hover Background Shine -->
              <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>

              <!-- Active Indicator Bar -->
              <div 
                class="absolute left-0 w-1.5 bg-blue-600 dark:bg-blue-300 rounded-r-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                :class="route.path === item.path ? 'h-7 top-2.5 opacity-100' : 'h-0 top-1/2 opacity-0'"
              ></div>

              <!-- Icon Wrapper -->
              <div class="w-14 flex items-center justify-center shrink-0">
                <i 
                  :class="[
                    'mdi text-2xl transition-all duration-300 drop-shadow-md',
                    item.icon,
                    route.path === item.path ? 'scale-110 rotate-3 opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-3'
                  ]"
                ></i>
              </div>

              <!-- Label -->
              <span 
                class="font-black text-sm uppercase tracking-[0.1em] whitespace-nowrap transition-all duration-500 overflow-hidden"
                :class="collapsed ? 'w-0 opacity-0 -translate-x-4' : 'w-full opacity-100 translate-x-0'"
              >
                {{ item.label }}
              </span>

              <!-- Mini Indicator for Active (Collapsed mode) -->
              <div
                v-if="collapsed && route.path === item.path"
                class="absolute right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-white/20"
              ></div>
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Dynamic Bottom Section: Material Library (Always at bottom) -->
    <div v-if="canAccessMaterialsLibrary()" class="px-3 mb-2 shrink-0 border-t border-slate-100 dark:border-slate-800/80 pt-6 relative z-10">
      <div class="relative">
        <RouterLink
          to="/materials-library"
          :class="[
            'flex items-center h-12 rounded-xl transition-all duration-300 group ring-inset relative overflow-hidden',
            route.path === '/materials-library'
              ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)]'
              : 'text-slate-900 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
          ]"
          :title="collapsed ? 'Materials Library' : ''"
        >
          <!-- Active Indicator Bar -->
          <div 
            class="absolute left-0 w-1.5 bg-blue-600 dark:bg-blue-300 rounded-r-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            :class="route.path === '/materials-library' ? 'h-7 top-2.5 opacity-100' : 'h-0 top-1/2 opacity-0'"
          ></div>

          <!-- Icon Wrapper -->
          <div class="w-14 flex items-center justify-center shrink-0">
            <i 
              :class="[
                'mdi mdi-library-shelves text-2xl transition-all duration-300 drop-shadow-md',
                route.path === '/materials-library' ? 'scale-110 rotate-3 opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-3'
              ]"
            ></i>
          </div>

          <!-- Label -->
          <span 
            class="font-black text-sm uppercase tracking-[0.1em] whitespace-nowrap transition-all duration-500 overflow-hidden"
            :class="collapsed ? 'w-0 opacity-0 -translate-x-4' : 'w-full opacity-100 translate-x-0'"
          >
            Materials Library
          </span>

          <!-- Mini Indicator for Active (Collapsed mode) -->
          <div
            v-if="collapsed && route.path === '/materials-library'"
            class="absolute right-3 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-white/20"
          ></div>
        </RouterLink>
      </div>
    </div>

    <!-- Sidebar Footer / Status HUD -->
    <div class="p-5 mt-auto border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/40 relative z-10 backdrop-blur-md">
       <div class="flex items-center gap-4 overflow-hidden group/footer cursor-pointer">
          <div class="relative shrink-0">
            <div class="absolute -inset-1 blur-sm bg-emerald-500/30 rounded-full animate-pulse opacity-0 group-hover/footer:opacity-100 transition-opacity"></div>
            <div class="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative shadow-inner overflow-hidden">
               <div class="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
               <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse relative z-10"></div>
            </div>
          </div>
          <div class="flex flex-col transition-all duration-500" :class="collapsed ? 'opacity-0 scale-95 translate-x-[-10px]' : 'opacity-100 scale-100 translate-x-0'">
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 drop-shadow-sm">Central Intel</span>
            <span class="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] whitespace-nowrap">Secure Multi-Pass</span>
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

const { getAllowedRoutes, getPanelTitle, canAccessMaterialsLibrary } = useRouteGuard()
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
  width: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.4);
}

/* Translucency & Glassmorphism Details */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Premium Animations */
@keyframes breathing {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; filter: brightness(1.2); }
}

.animate-breathing {
  animation: breathing 3s ease-in-out infinite;
}

/* Glow Effects */
.shadow-emerald-glow {
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.dark .dark\:shadow-blue-glow {
  box-shadow: 0 10px 30px -5px rgba(37,99,235,0.6);
}

/* Active Link Glow */
.router-link-active {
  position: relative;
}

/* Smooth transition for logo */
.group\/logo:hover img {
  transform: scale(1.1) rotate(5deg);
}
</style>
