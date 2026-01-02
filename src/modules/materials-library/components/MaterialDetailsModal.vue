<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
    <div 
      class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all scale-100"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <i class="mdi mdi-information-outline text-emerald-600 dark:text-emerald-400 text-xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Material Details</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Viewing reference information for {{ material.material_name }}</p>
          </div>
        </div>
        <button 
          @click="$emit('close')" 
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
        >
          <i class="mdi mdi-close text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Primary Information -->
          <section>
            <h4 class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
              <i class="mdi mdi-card-text-outline mr-2 text-base"></i>
              Core Information
            </h4>
            <div class="space-y-4">
              <DetailItem label="SKU / Material Code" :value="material.material_code" icon="mdi-barcode" />
              <DetailItem label="Material Name" :value="material.material_name" icon="mdi-format-title" />
              <DetailItem label="Category" :value="material.category" icon="mdi-tag-outline" />
              <DetailItem label="Subcategory" :value="material.subcategory || 'N/A'" icon="mdi-tag-multiple-outline" />
              <DetailItem label="Unit of Measure (UOM)" :value="material.unit_of_measure" icon="mdi-unfold-more-horizontal" />
              <DetailItem label="Unit Cost" :value="formatCurrency(material.unit_cost)" icon="mdi-currency-usd" />
            </div>

            <div v-if="material.notes" class="mt-8">
               <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <i class="mdi mdi-note-outline mr-2 text-base"></i>
                Notes
              </h4>
              <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap leading-relaxed">
                {{ material.notes }}
              </p>
            </div>
          </section>

          <!-- Specifications & Technical Data -->
          <section>
            <h4 class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
              <i class="mdi mdi-cogs mr-2 text-base"></i>
              Technical Specifications
            </h4>
            <div v-if="hasAttributes" class="grid grid-cols-1 gap-4">
              <DetailItem 
                v-for="(val, key) in material.attributes" 
                :key="key" 
                :label="formatKey(key)" 
                :value="val" 
                variant="compact"
              />
            </div>
            <div v-else class="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
               <i class="mdi mdi-database-off text-3xl text-gray-300 dark:text-gray-600 mb-2"></i>
               <p class="text-sm text-gray-500 dark:text-gray-400 italic text-center">No additional specifications available for this workstation type.</p>
            </div>
          </section>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <button 
          @click="$emit('close')" 
          class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm transition-all focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800"
        >
          Close View
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
