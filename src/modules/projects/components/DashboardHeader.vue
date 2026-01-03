<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 py-6">
    <!-- Left: Strategic Identity -->
    <div>
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 uppercase tracking-[0.2em] text-[10px] font-black">
          <li>
            <router-link to="/dashboard" class="text-slate-400 hover:text-blue-500 transition-colors">Intelligence Hub</router-link>
          </li>
          <li>
            <div class="flex items-center gap-1 text-slate-300">
               <i class="mdi mdi-chevron-right text-xs"></i>
               <span class="text-blue-500">Project Operations</span>
            </div>
          </li>
        </ol>
      </nav>
      <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
        Command <span class="text-blue-500 text-4xl opacity-50">/</span> Center
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Global monitoring & tactical deployment synchronization.</p>
    </div>

    <!-- Right: Tactical Actions -->
    <div class="flex items-center gap-4">
      <!-- Live Chronos -->
      <div class="hidden lg:flex flex-col items-end px-6 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Chronos</span>
        <span class="text-sm font-black text-slate-900 dark:text-white">{{ currentDateTime }}</span>
      </div>

      <!-- Sync Button -->
      <button
        @click="refreshData"
        :disabled="loading"
        class="group w-14 h-14 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
        title="Synchronize Data"
      >
        <i class="mdi mdi-sync text-2xl text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors" :class="{'animate-spin text-blue-500': loading}"></i>
      </button>

      <!-- Global Link -->
      <router-link
        to="/projects/enquiries"
        class="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/10 transition-all active:scale-95 font-black text-[10px] uppercase tracking-[0.2em]"
      >
        <i class="mdi mdi-text-box-search-outline text-xl"></i>
        <span>Enquiry Repository</span>
      </router-link>
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
  refresh: []
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
