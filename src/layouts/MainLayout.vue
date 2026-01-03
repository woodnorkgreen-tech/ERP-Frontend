<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <!-- Sidebar -->
    <DynamicSidebar
      v-model:collapsed="sidebarCollapsed"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      class="flex-shrink-0 z-30 shadow-2xl"
    />

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Top Header -->
      <header class="bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-20 transition-all duration-300 shadow-sm">
        <div class="px-4 sm:px-8 py-3 flex items-center justify-between h-20">
          <!-- Left Section: Toggle & Context -->
          <div class="flex items-center gap-6">
            <button
              @click="sidebarCollapsed = !sidebarCollapsed"
              class="group p-2.5 rounded-xl text-gray-500 hover:bg-blue-500/10 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-all focus:outline-none ring-1 ring-transparent hover:ring-blue-500/20"
              aria-label="Toggle Sidebar"
            >
              <div class="relative w-6 h-6">
                <span :class="['absolute h-0.5 bg-current transition-all duration-300 left-0', sidebarCollapsed ? 'w-6 top-1' : 'w-3 top-1']"></span>
                <span class="absolute h-0.5 w-6 bg-current top-2.5 left-0"></span>
                <span :class="['absolute h-0.5 bg-current transition-all duration-300 left-0', sidebarCollapsed ? 'w-3 top-4' : 'w-6 top-4']"></span>
              </div>
            </button>

            <!-- Navigation Context / Breadcrumbs -->
             <div class="flex items-center gap-3">
                <div class="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                   <span>System</span>
                   <i class="mdi mdi-chevron-right text-gray-300"></i>
                </div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate">
                  {{ pageTitle }}
                </h1>
             </div>
          </div>

          <!-- Right Section: Actions & Profile -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Search Placeholder -->
            <div class="hidden md:block relative group">
               <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-primary transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </span>
               <input 
                 type="text" 
                 placeholder="Search..." 
                 class="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-none rounded-full focus:ring-2 focus:ring-primary/50 w-48 focus:w-64 transition-all duration-300 placeholder-gray-400 dark:text-white" 
               />
            </div>

            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors relative overflow-hidden"
              :title="theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
            >
              <transition name="rotate" mode="out-in">
                <svg v-if="theme === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </transition>
            </button>

            <!-- Tasks Navigation -->
            <router-link
              to="/universal-tasks"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Universal Task System"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span class="hidden lg:inline">Tasks</span>
            </router-link>

            <!-- Notification Center -->
            <NotificationCenter ref="notificationCenter" />

            <!-- User Profile Dropdown -->
            <div ref="profileMenuRef" class="relative" v-if="user">
              <button 
                @click="toggleProfileMenu"
                class="flex items-center gap-3 focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="text-right hidden md:block">
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{{ user.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ user.roles?.[0] || 'User' }}</p>
                </div>
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-800 transform transition-transform"
                     :class="{ 'scale-105': profileMenuOpen }"
                >
                  <span class="font-bold text-sm">{{ user.name?.charAt(0)?.toUpperCase() }}</span>
                </div>
                <!-- Dropdown chevron -->
                <svg 
                  class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': profileMenuOpen }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95 translate-y-1"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-1"
              >
                <div 
                  v-if="profileMenuOpen"
                  class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 border border-gray-100 dark:border-gray-700 z-50"
                >
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 md:hidden">
                     <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                     <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                  </div>
                  <div class="px-2 py-1">
                    <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      Profile
                    </a>
                    <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Settings
                    </a>
                  </div>
                  <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <div class="px-2 py-1">
                    <button @click="handleLogout" class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                       Sign out
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Notification Popup -->
      <NotificationPopup ref="notificationPopup" />

      <!-- Toast Notifications -->
      <ToastContainer />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth custom-scrollbar">
        <div class="max-w-8xl mx-auto w-full">
           <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" @taskAssigned="handleGlobalTaskAssigned" />
              </transition>
           </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DynamicSidebar from '../components/DynamicSidebar.vue'
import NotificationCenter from '../modules/shared/components/NotificationCenter.vue'
import NotificationPopup from '../modules/shared/components/NotificationPopup.vue'
import ToastContainer from '../modules/universal-task/components/ToastContainer.vue'
import { useAuth } from '../composables/useAuth'
import { useRouteGuard } from '../composables/useRouteGuard'
import { useTheme } from '../composables/useTheme'

const { user, logout } = useAuth()
const { getAllowedRoutes } = useRouteGuard()
const { theme, toggleTheme } = useTheme()
const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(true)
const notificationCenter = ref()
const notificationPopup = ref()
const profileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

// Check if device supports hover (desktop) vs touch
const canHover = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover)').matches
}

const handleMouseEnter = () => {
  if (canHover()) {
    sidebarCollapsed.value = false
  }
}

const handleMouseLeave = () => {
  if (canHover()) {
    sidebarCollapsed.value = true
  }
}



const toggleProfileMenu = (event: Event) => {
  event.stopPropagation()
  profileMenuOpen.value = !profileMenuOpen.value
}

// Close profile menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (!profileMenuOpen.value) return
  
  const target = event.target as HTMLElement
  const profileContainer = profileMenuRef.value
  
  // If click is outside the profile container, close the menu
  if (profileContainer && !profileContainer.contains(target)) {
    profileMenuOpen.value = false
  }
}

onMounted(() => {
  // Listen for both click and touchstart for mobile devices
  document.addEventListener('click', handleClickOutside, true)
  document.addEventListener('touchstart', handleClickOutside, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('touchstart', handleClickOutside, true)
})

const navigationItems = computed(() => {
  return getAllowedRoutes()
})

const sidebarTitle = computed(() => {
  if (!user.value) return 'ERP System'

  const userRoles = user.value.roles || []

  if (userRoles.includes('Super Admin')) {
    return 'Super Admin Panel'
  }

  if (userRoles.includes('Admin')) {
    return 'Admin Panel'
  }

  if (userRoles.includes('HR')) {
    return 'HR Panel'
  }

  if (userRoles.includes('Designer')) {
    return 'Creatives Panel'
  }

  return 'ERP System'
})

const sidebarSubtitle = computed(() => {
  if (!user.value) return 'Management Dashboard'

  const userRoles = user.value.roles || []

  if (userRoles.includes('Super Admin')) {
    return 'Full System Access'
  }

  if (userRoles.includes('Admin')) {
    return 'System Administration'
  }

  if (userRoles.includes('HR')) {
    return 'Human Resources'
  }

  if (userRoles.includes('Designer')) {
    return 'Design & Production'
  }

  return 'Management Dashboard'
})

const pageTitle = computed(() => {
  return route.meta?.title as string || 'Dashboard'
})

const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const handleTaskAssigned = (data: {
  userId: number
  userName: string
  userEmail: string
  taskCount: number
  taskNames: string
  message: string
  tasks: any[]
}) => {
  // Add notification to the notification center
  if (notificationCenter.value) {
    // Extract enquiry_id and task_id from the first task (assuming all tasks are from the same enquiry)
    const enquiryId = data.tasks[0]?.enquiry_id
    const taskId = data.tasks[0]?.id

    notificationCenter.value.addNotification({
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: data.message,
      metadata: {
        taskCount: data.taskCount,
        taskNames: data.taskNames,
        assignedBy: user.value?.name || 'System',
        enquiry_id: enquiryId,
        task_id: taskId
      }
    })
  }

  // Show popup notification
  if (notificationPopup.value) {
    const enquiryId = data.tasks[0]?.enquiry_id
    const taskId = data.tasks[0]?.id

    notificationPopup.value.showPopup({
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: data.message,
      data: {
        task_id: taskId,
        enquiry_id: enquiryId,
        priority: data.tasks[0]?.priority || 'medium'
      }
    })
  }
}

onMounted(() => {
  // Initialize sidebar state
})

// Listen for task assignment events from child components
const handleGlobalTaskAssigned = (data: {
  userId: number
  userName: string
  userEmail: string
  taskCount: number
  taskNames: string
  message: string
  tasks: any[]
}) => {
  handleTaskAssigned(data)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}

.rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg);
}

.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}

/* Custom Scrollbar for Webkit */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
}
</style>
