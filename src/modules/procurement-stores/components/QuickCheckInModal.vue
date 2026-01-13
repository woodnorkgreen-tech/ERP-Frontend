<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Header -->
      <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
            Quick Check-In <span class="text-emerald-500 text-lg opacity-50">/</span> Stock Add
          </h3>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Increasing levels for: <span class="text-blue-500">{{ material.material_name }}</span></p>
        </div>
        <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Form Body -->
      <div class="p-8 space-y-6">
        <!-- Stats Snapshot -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Stock</p>
            <p class="text-xl font-black text-slate-900 dark:text-white">{{ material.quantity_on_hand }} <span class="text-[10px] text-slate-400">{{ material.unit_of_measure }}</span></p>
          </div>
          <div class="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Stock to Add</p>
            <p class="text-xl font-black text-emerald-600">+ {{ form.quantity || 0 }}</p>
          </div>
        </div>

        <!-- Quantity Input -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
          <div class="relative group">
            <input 
              type="number" 
              v-model.number="form.quantity"
              step="0.01"
              placeholder="0.00"
              class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-2xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <div class="absolute right-6 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-black uppercase text-slate-500">
              {{ material.unit_of_measure }}
            </div>
          </div>
        </div>

        <!-- Location & Reference Card -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
            <input 
              type="text" 
              v-model="form.location"
              placeholder="Shelf / Bin"
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ref / LPO</label>
            <input 
              type="text" 
              v-model="form.reference_no"
              placeholder="LPO #"
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div class="pt-4">
          <button 
            @click="submit"
            :disabled="submitting || !form.quantity"
            class="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
          >
            <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <i v-else class="mdi mdi-check-circle-outline text-xl transition-transform group-hover:scale-125"></i>
            {{ submitting ? 'Saving...' : 'Update Stock' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import api from '@/plugins/axios'
import type { LibraryMaterial } from '@/modules/materials-library/types/material'

const props = defineProps<{
  material: LibraryMaterial
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const submitting = ref(false)

const form = reactive({
  material_id: props.material.id,
  quantity: null as number | null,
  location: props.material.location || '',
  reference_no: '',
  notes: 'Quick check-in from library view',
  type: 'check_in'
})

const submit = async () => {
  if (!form.quantity) return
  
  submitting.value = true
  try {
    await api.post('/api/procurement-stores/check-in', {
      ...form,
      warehouse_code: 'MAIN'
    })
    emit('success')
  } catch (err) {
    console.error('Quick check-in failed:', err)
    alert('Failed to update inventory. Please verify input.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}
</style>
