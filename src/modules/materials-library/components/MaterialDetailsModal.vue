<template>
  <div class="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-inner">
            <i class="mdi mdi-information-variant text-emerald-600 dark:text-emerald-400 text-2xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Material Specifications</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Reference data for {{ material.material_name }}</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 overflow-y-auto custom-scrollbar flex-grow">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <!-- Column 1: Core Information -->
          <div class="space-y-8">
            <section>
              <h4 class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <span class="w-8 h-[1px] bg-emerald-500/30 mr-3"></span>
                Primary Identification
              </h4>
              <div class="grid grid-cols-1 gap-5">
                <DetailItem label="SKU / Material Code" :value="material.material_code" icon="mdi-barcode-scan" />
                <DetailItem label="Material Name" :value="material.material_name" icon="mdi-format-title" />
                <div class="grid grid-cols-2 gap-5">
                  <DetailItem label="Category" :value="material.category" icon="mdi-tag-outline" />
                  <DetailItem label="Subcategory" :value="material.subcategory || 'N/A'" icon="mdi-tag-multiple-outline" />
                </div>
                <div class="grid grid-cols-2 gap-5">
                  <DetailItem label="Unit (UOM)" :value="material.unit_of_measure" icon="mdi-unfold-more-horizontal" />
                  <DetailItem label="Standard Cost" :value="formatCurrency(material.unit_cost)" icon="mdi-currency-usd" class="text-emerald-600 dark:text-emerald-400 font-bold" />
                </div>
              </div>
            </section>

            <section v-if="material.notes">
              <h4 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                <span class="w-8 h-[1px] bg-gray-300 dark:bg-gray-700 mr-3"></span>
                Procurement Notes
              </h4>
              <div class="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {{ material.notes }}
              </div>
            </section>
          </div>

          <!-- Column 2: Technical Specs -->
          <div class="space-y-8">
            <section>
              <h4 class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <span class="w-8 h-[1px] bg-emerald-500/30 mr-3"></span>
                Production Parameters
              </h4>
              
              <div v-if="hasAttributes" class="space-y-4">
                <div class="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden divide-y divide-gray-50 dark:divide-gray-800/50">
                  <DetailItem 
                    v-for="(val, key) in material.attributes" 
                    :key="key" 
                    :label="formatKey(key)" 
                    :value="val" 
                    variant="compact"
                    class="px-5 py-3 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
                  />
                </div>
              </div>
              
              <div v-else class="flex flex-col items-center justify-center p-16 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                <div class="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-4">
                  <i class="mdi mdi-database-off text-3xl text-gray-200 dark:text-gray-700"></i>
                </div>
                <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">No Extended Specifications</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-10 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-sm font-bold border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
        >
          Dismiss View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LibraryMaterial } from '../types/material';
import DetailItem from './MaterialDetails/DetailItem.vue';

const props = defineProps<{
  material: LibraryMaterial;
}>();

defineEmits(['close']);

const hasAttributes = computed(() => {
  return props.material.attributes && Object.keys(props.material.attributes).length > 0;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES',
    minimumFractionDigits: 2 
  }).format(value || 0);
};

const formatKey = (key: string) => {
  // Convert snake_case or dash-case to Start Case
  return key
    .replace(/[_-]/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
