<template>
  <Transition name="achievement">
    <div v-if="isVisible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <!-- Backdrop with heavy blur -->
      <div 
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl animate-fade-in"
        @click="close"
      ></div>

      <!-- Main Stack Container -->
      <div class="relative w-full max-w-xl h-[600px] flex items-center justify-center">
        <TransitionGroup name="stack">
            <div 
                v-for="(item, index) in visibleQueue" 
                :key="item.id"
                class="absolute w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-500 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 p-px transition-all duration-500 ease-spring"
                :style="{
                    zIndex: 50 - index,
                    transform: `translateY(${index * 15}px) scale(${1 - (index * 0.05)})`,
                    opacity: 1 - (index * 0.2),
                    pointerEvents: index === 0 ? 'auto' : 'none'
                }"
            >
                <!-- Animated Background Elements (Only on top card for perf) -->
                <div v-if="index === 0" class="absolute inset-0 overflow-hidden">
                    <div class="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                    <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <!-- Glass Content Cover -->
                <div class="relative h-full w-full bg-slate-900/90 backdrop-blur-md rounded-[calc(3rem-1px)] p-8 flex flex-col items-center justify-center text-center">
                    
                    <!-- Achievement Icon -->
                    <div class="relative mb-6">
                        <!-- Particle Background for Icon -->
                        <div class="absolute inset-0 scale-150 opacity-50 bg-indigo-500 blur-2xl rounded-full animate-glow"></div>
                        <div class="w-24 h-24 bg-gradient-to-b from-white to-indigo-100 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl relative z-10">
                            <i class="mdi mdi-rocket-launch text-5xl text-indigo-600 -rotate-12"></i>
                        </div>
                        <!-- Mini Badge -->
                        <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center z-20">
                            <i class="mdi mdi-check text-white text-xl"></i>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="space-y-4 mb-8">
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">New Project Activated</p>
                        <div class="flex flex-col gap-1">
                            <h2 class="text-5xl font-black text-emerald-400 tracking-tight leading-none group">
                                {{ item.data.job_number }}
                            </h2>
                            <span class="text-white font-black text-4xl leading-tight block mt-2 text-shadow-lg">
                                {{ item.data.title }}
                            </span>
                        </div>
                        <p class="text-slate-400 font-medium max-w-lg mx-auto text-base">
                            is now officially active for <span class="text-white font-bold">{{ item.data.client_name }}</span>
                        </p>
                    </div>

                    <!-- Context Strip -->
                    <div class="flex flex-col gap-4 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 mb-8 w-full max-w-lg overflow-hidden">
                        <div class="flex items-center gap-4 text-left">
                            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                <i class="mdi mdi-map-marker-radius text-xl"></i>
                            </div>
                            <div>
                                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Project Venue</p>
                                <p class="text-sm font-bold text-white leading-tight line-clamp-1">{{ item.data.venue }}</p>
                            </div>
                        </div>

                        <div class="h-px w-full bg-white/5"></div>

                        <div class="grid grid-cols-3 gap-4">
                            <div class="text-left">
                                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Deadline</p>
                                <p class="text-xs font-black text-emerald-400 uppercase">{{ item.data.deadline }}</p>
                            </div>
                            <div class="text-left border-l border-white/5 pl-4">
                                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Project Officer</p>
                                <p class="text-xs font-black text-white uppercase tracking-tighter truncate">{{ item.data.project_officer }}</p>
                            </div>
                            <div class="text-right border-l border-white/5 pl-4">
                                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Initiated By</p>
                                <p class="text-xs font-black text-indigo-400 uppercase tracking-tighter truncate">{{ item.data.activated_by }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation & Actions -->
                    <div class="w-full max-w-md flex flex-col items-center gap-4">
                        <!-- Primary Action -->
                        <button 
                            @click="viewProject(item)"
                            class="group relative h-16 w-full bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
                        >
                            <span class="relative z-10 flex items-center justify-center gap-3">
                                <span v-if="itemsPending > 1" class="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[10px]">{{ itemsPending }} Projects Pending</span>
                                Go To Project Control
                                <i class="mdi mdi-arrow-right text-lg transition-transform group-hover:translate-x-1"></i>
                            </span>
                        </button>
                    </div>

                    <!-- Close Shortcut -->
                    <button 
                        @click="close"
                        class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2"
                        title="Dismiss and view next"
                    >
                        <i class="mdi mdi-close text-2xl"></i>
                    </button>
                </div>
            </div>
        </TransitionGroup>
      </div>
      
      <!-- CONFETTI EFFECT (Simplified Canvas logic) -->
      <div v-if="showConfetti" class="fixed inset-0 pointer-events-none z-[190] overflow-hidden">
        <div v-for="n in 50" :key="n" class="confetti-piece" :style="generateConfettiStyle(n)"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/modules/projects/composables/useNotifications'

const { markAsRead } = useNotifications()
const router = useRouter()

const isVisible = ref(false)
const showConfetti = ref(false)
const queue = ref<any[]>([])

// Always show the head of the stack
const currentProject = computed(() => {
    if (!queue.value.length) return null
    return queue.value[0]?.data
})

const itemsPending = computed(() => queue.value.length)

const visibleQueue = computed(() => queue.value.slice(0, 3))

const show = (activations: any[]) => {
    // Update queue with new data. Replace existing queue to prevent stale state.
    queue.value = activations
    
    if (queue.value.length > 0) {
        isVisible.value = true
        showConfetti.value = true
    }
}

const close = () => {
    // Dismiss the top card
    const item = queue.value[0]
    if (item) {
        markAsRead(item.id).catch(() => {})
        // Remove from local queue immediately for UI responsiveness
        queue.value.shift()
    }
    
    if (queue.value.length === 0) {
        isVisible.value = false
        showConfetti.value = false
    }
}

const viewProject = (targetItem: any) => {
    // If no specific item passed (clicked button without param), use top of stack
    const item = targetItem && targetItem.id ? targetItem : queue.value[0]
    
    // Mark as read
    if (item) {
        markAsRead(item.id).catch(() => {})
    }
    
    isVisible.value = false
    showConfetti.value = false
    
    if (item?.data?.id) {
        router.push({
            path: '/projects/tasks',
            query: { enquiry_id: item.data.id }
        })
    }
}

const generateConfettiStyle = (n: number) => {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b']
    return {
        left: `${Math.random() * 100}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`
    }
}

defineExpose({ show })
</script>

<style scoped>
.stack-enter-active,
.stack-leave-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stack-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
}
.stack-leave-to {
    opacity: 0;
    transform: translateY(-50px) scale(1.05);
}

.achievement-enter-active {
    animation: achievementIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.achievement-leave-active {
    animation: achievementIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}

@keyframes achievementIn {
    0% { transform: scale(0.8) translateY(40px); opacity: 0; filter: blur(10px); }
    100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
}

@keyframes glow {
    0%, 100% { transform: scale(1.5); opacity: 0.3; }
    50% { transform: scale(1.8); opacity: 0.5; }
}

.animate-glow {
    animation: glow 4s ease-in-out infinite;
}

.confetti-piece {
    position: absolute;
    top: -20px;
    width: 8px;
    height: 8px;
    opacity: 0.7;
    border-radius: 2px;
    transform: rotate(45deg);
    animation: fall linear forwards;
}

@keyframes fall {
    0% { transform: translateY(0) rotate(0); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.animate-pulse {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.1); }
}
</style>
