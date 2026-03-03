<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
    <!-- Header Area -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-blue-500/20">
            <img :src="logoOutline" alt="WNG" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">Petty Cash</h1>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Woodwork Green ERP</p>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow p-4 md:p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Success State -->
        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="scale-95 opacity-0 translate-y-4"
          enter-to-class="scale-100 opacity-100 translate-y-0"
        >
          <div v-if="submitted" class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-12 text-center">
            <div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <i class="mdi mdi-check-decagram text-5xl"></i>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">Submitted Successfully!</h2>
            <p class="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto mb-10">
              Your requisition has been received and is now awaiting approval by the finance department.
            </p>
            <div class="pt-8 border-t border-slate-100 dark:border-slate-800">
               <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Requisition Number</p>
               <p class="text-xl font-black text-blue-600 dark:text-blue-400">{{ result?.requisition_number }}</p>
            </div>
            <button 
              @click="resetPage"
              class="mt-12 w-full py-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
            >
              Make Another Request
            </button>
          </div>
        </transition>

        <!-- Reusing Internal Form -->
        <div v-if="!submitted" class="animate-in fade-in duration-700">
          <RequisitionForm 
            :is-open="true"
            :is-public="true"
            :standalone="true"
            :pre-fill="null"
            @success="onSuccess"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RequisitionForm from '../requisitions/RequisitionForm.vue'
import logoOutline from '@/../public/logo-outline.png'

const submitted = ref(false)
const result = ref<any>(null)

const onSuccess = (data: any) => {
  result.value = data
  submitted.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetPage = () => {
  submitted.value = false
  result.value = null
  // Re-render occurs via v-if
}
</script>

<style scoped>
/* Mobile optimized tweaks */
@media (max-width: 640px) {
  :deep(.rounded-3xl) {
    border-radius: 1.5rem;
  }
}
</style>
