<template>
  <div class="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl mb-8">
    <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
    <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-600/5 rounded-full blur-[60px]"></div>
    
    <div class="relative z-10">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <!-- Left: Branding & Title -->
        <div>
          <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 uppercase tracking-[0.2em] text-[10px] font-black">
              <li>
                <router-link to="/dashboard" class="text-slate-500 hover:text-blue-400 transition-colors">Digital HQ</router-link>
              </li>
              <li>
                <div class="flex items-center gap-1 text-slate-600">
                   <i class="mdi mdi-chevron-right text-xs"></i>
                   <span class="text-blue-500">Operations</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
            Project <span class="text-blue-500 opacity-80">Sync</span>
          </h1>
          <p class="text-slate-400 text-sm font-medium mt-2 max-w-md opacity-80">
            Real-time operational overview and project tracking across all active project nodes.
          </p>
        </div>

        <!-- Right: Tactical Actions -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- System Time Node -->
          <div class="hidden sm:flex flex-col items-end px-4 py-2 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Runtime Status</span>
            <span class="text-xs font-black text-blue-400 tracking-tight">{{ currentDateTime }}</span>
          </div>

          <!-- Operation Nodes -->
          <div class="flex items-center gap-2">
            <button
              @click="refreshData"
              :disabled="loading"
              class="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/5 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              title="Sync Data"
            >
              <i class="mdi mdi-sync text-xl" :class="{'animate-spin text-blue-400': loading}"></i>
            </button>

            <button
              @click="$emit('flash-quote')"
              class="flex items-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest"
            >
              <i class="mdi mdi-lightning-bolt"></i>
              <span>Flash Quote</span>
            </button>

            <router-link
              to="/projects/enquiries"
              class="flex items-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest"
            >
              <i class="mdi mdi-text-box-search-outline"></i>
              <span>Requests</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  loading?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  refresh: [],
  'flash-quote': []
}>()

const currentDateTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

let intervalId: number | undefined

onMounted(() => {
  updateDateTime()
  intervalId = window.setInterval(updateDateTime, 60000) // Update every minute
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const refreshData = () => {
  emit('refresh')
}
</script>
