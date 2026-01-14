<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Header -->
      <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
            Stock Policy <span class="text-blue-500 text-lg opacity-50">/</span> Thresholds
          </h3>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Configuring: <span class="text-blue-500">{{ material.material_name }}</span></p>
        </div>
        <button @click="$emit('close')" class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Form Body -->
      <div class="p-8 space-y-6">
        <!-- Minimum Stock Level -->
        <div class="space-y-3">
          <div class="flex justify-between items-end">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Stock Threshold</label>
            <span class="text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md italic">Trigger for alerts</span>
          </div>
          <div class="relative group">
            <i class="mdi mdi-alert-octagon-outline absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
            <input 
              type="number" 
              v-model.number="form.min_stock_level"
              step="1"
              placeholder="0"
              class="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-2xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <div class="absolute right-6 top-1/2 -translate-y-1/2 h-8 px-3 flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-black uppercase text-slate-500">
              {{ material.unit_of_measure }}
            </div>
          </div>
          <p class="text-[9px] text-slate-400 ml-1">When available stock drops to or below this, a critical alert will be raised.</p>
        </div>

        <!-- Location Info -->
        <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Bin</label>
                <div class="relative group">
                    <i class="mdi mdi-map-marker-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input 
                    type="text" 
                    v-model="form.location_bin"
                    placeholder="e.g. A-12-B"
                    class="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>
            <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Warehouse Code</label>
                <div class="relative group">
                    <i class="mdi mdi-warehouse absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input 
                    type="text" 
                    v-model="form.warehouse_code"
                    placeholder="MAIN"
                    class="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>
        </div>

        <div class="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            @click="saveSettings"
            :disabled="submitting"
            class="w-full py-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl shadow-xl transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
          >
            <div v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <i v-else class="mdi mdi-content-save-check-outline text-xl transition-transform group-hover:scale-110"></i>
            {{ submitting ? 'Updating Policy...' : 'Save Stock Policy' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import api from '@/plugins/axios'

const props = defineProps<{
  material: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const submitting = ref(false)

const form = reactive({
  material_id: props.material.id,
  min_stock_level: props.material.min_stock_level || 0,
  location_bin: props.material.location_bin || props.material.location || '',
  warehouse_code: props.material.warehouse_code || 'MAIN'
})

const saveSettings = async () => {
  submitting.value = true
  try {
    await api.post('/api/procurement-stores/update-settings', form)
    emit('success')
  } catch (err) {
    console.error('Failed to update stock settings:', err)
    alert('Failed to save settings. Please try again.')
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
