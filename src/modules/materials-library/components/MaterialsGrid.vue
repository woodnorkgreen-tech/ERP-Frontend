<template>
  <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div v-for="n in 8" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
      <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
      <div class="space-y-2">
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  </div>

  <div v-else-if="materials.length === 0" class="flex flex-col items-center justify-center p-20 text-center opacity-60">
    <i class="mdi mdi-package-variant-closed text-6xl text-slate-300 mb-4"></i>
    <p class="text-xl font-bold text-slate-500">No materials found</p>
    <p class="text-sm text-slate-400">Try adjusting your filters or search terms</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div 
      v-for="material in materials" 
      :key="material.id"
      class="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-200 dark:border-slate-700 group flex flex-col relative overflow-hidden"
    >
      <!-- Stock Status Strip -->
      <div v-if="hasStockData(material)" class="absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300" 
        :class="getStockStatusColor(material)"></div>

      <!-- Header actions (absolute) -->
      <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="$emit('edit', material)" class="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm hover:text-blue-600 transition-colors" title="Edit">
           <i class="mdi mdi-pencil"></i>
        </button>
      </div>

      <!-- Icon & Code -->
      <div class="mb-4">
        <div class="flex justify-between items-start pl-3">
           <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-2xl text-slate-500 dark:text-slate-400">
             <i class="mdi mdi-screw-machine-flat"></i>
           </div>
           
           <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg">
             {{ material.material_code }}
           </span>
        </div>
      </div>

      <!-- Details -->
      <div class="pl-3 flex-1">
        <div class="flex items-center gap-2 text-xs font-bold text-blue-500 mb-1">
           <span>{{ material.category }}</span>
           <span v-if="material.subcategory" class="text-slate-300">•</span>
           <span v-if="material.subcategory" class="text-slate-400">{{ material.subcategory }}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-4 line-clamp-2" :title="material.material_name">
          {{ material.material_name }}
        </h3>

        <!-- Stock Info Grid -->
        <div v-if="hasStockData(material)" class="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-100 dark:border-slate-700/50">
           <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">On Hand</p>
              <p class="text-xl font-black text-slate-700 dark:text-slate-200">
                {{ material.quantity_on_hand }} <span class="text-xs font-bold text-slate-400">{{ material.unit_of_measure }}</span>
              </p>
           </div>
           <div class="text-right">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Value</p>
              <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {{ formatCurrency((material.quantity_on_hand || 0) * (material.unit_cost || 0)) }}
              </p>
           </div>
        </div>
        
        <div v-else class="mb-4 py-4 border-y border-slate-100 dark:border-slate-700/50">
             <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-500">Unit Cost</span>
                <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatCurrency(material.unit_cost) }}</span>
             </div>
        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-between mt-auto pt-2">
           <button @click="$emit('view', material)" class="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
             View Details <i class="mdi mdi-arrow-right"></i>
           </button>
           
           <div v-if="hasStockData(material) && !showTrashed" class="flex gap-2">
              <button @click="$emit('checkIn', material)" class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors" title="Quick Receive">
                 <i class="mdi mdi-plus"></i>
              </button> 
              <button @click="$emit('markDefective', material)" class="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Report Issue">
                 <i class="mdi mdi-alert-octagon-outline text-xs"></i>
              </button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LibraryMaterial } from '../types/material'; // Adjust path if needed

const props = withDefaults(defineProps<{
  materials: any[]; // Using any to avoid strict type issues if interface differs slightly, but typically implies LibraryMaterial
  loading: boolean;
  showTrashed?: boolean;
  canDelete?: boolean;
}>(), {
  showTrashed: false,
  canDelete: true
});

defineEmits<{
  (e: 'view', material: any): void;
  (e: 'edit', material: any): void;
  (e: 'checkIn', material: any): void;
  (e: 'markDefective', material: any): void;
  (e: 'updateStockSettings', material: any): void;
  (e: 'delete', id: number): void;
  (e: 'restore', id: number): void;
  (e: 'forceDelete', id: number): void;
}>();

const hasStockData = (material: any) => {
  return material.quantity_on_hand !== undefined;
};

const getStockStatusColor = (material: any) => {
    if (!material.min_stock_level) return 'bg-slate-300';
    if (material.quantity_on_hand <= 0) return 'bg-red-500';
    if (material.quantity_on_hand <= material.min_stock_level) return 'bg-amber-500';
    return 'bg-emerald-500';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(value);
};
</script>
