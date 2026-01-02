<template>
  <div class="w-full space-y-3">
    <!-- Main Search Bar -->
    <div class="relative flex items-center w-full">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="mdi mdi-magnify text-gray-400 text-lg"></i>
      </div>
      <input
        type="text"
        class="block w-full pl-10 pr-20 py-2.5 border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
        placeholder="Search materials by code, name, or description..."
        :value="search"
        @input="handleSearchInput"
      />
      
      <!-- Right Actions inside Search Bar -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2">
         <!-- Clear Button -->
         <button 
           v-if="search"
           @click="clearSearch"
           class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none mr-1"
           title="Clear search"
         >
           <i class="mdi mdi-close-circle"></i>
         </button>

         <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

         <!-- Advanced Toggle -->
         <button 
           @click="showAdvanced = !showAdvanced"
           class="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 focus:outline-none transition-colors"
           :class="{'text-blue-600 bg-blue-50 dark:bg-blue-900/20': showAdvanced}"
           title="Advanced Filters"
         >
           <i class="mdi mdi-filter-variant"></i>
         </button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div v-show="showAdvanced" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 animate-fade-in-down">
      <!-- Category -->
      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1 uppercase tracking-wide">Category</label>
        <div class="relative rounded-md shadow-sm">
           <input
             type="text"
             class="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200 p-2"
             placeholder="e.g. Raw Materials"
             :value="category"
             @input="handleCategoryInput"
           />
        </div>
      </div>

      <!-- Subcategory -->
      <div>
        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1 uppercase tracking-wide">Subcategory</label>
        <div class="relative rounded-md shadow-sm">
           <input
             type="text"
             class="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200 p-2"
             placeholder="e.g. Steel"
             :value="subcategory"
             @input="handleSubcategoryInput"
           />
        </div>
      </div>
      
      <!-- Clear All Filters (Only visible if advanced filters are active) -->
      <div class="flex items-end pb-0.5" v-if="hasActiveFilters">
         <button 
           @click="clearAll"
           class="text-xs text-red-600 hover:text-red-800 dark:text-red-400 hover:underline flex items-center"
         >
           <i class="mdi mdi-delete-outline mr-1"></i> Clear filters
         </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps<{
  search: string;
  category: string;
  subcategory?: string;
}>();

const emit = defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'update:category', value: string): void;
  (e: 'update:subcategory', value: string): void;
  (e: 'filter'): void;
}>();

const showAdvanced = ref(false);

const hasActiveFilters = computed(() => {
    return !!props.category || !!props.subcategory;
});

// Debounced filter emitter
const debouncedFilter = useDebounceFn(() => {
  emit('filter');
}, 500); // 500ms delay

const handleSearchInput = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  emit('update:search', val);
  debouncedFilter();
};

const handleCategoryInput = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  emit('update:category', val);
  debouncedFilter();
};

const handleSubcategoryInput = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  emit('update:subcategory', val);
  debouncedFilter();
};

const clearSearch = () => {
    emit('update:search', '');
    debouncedFilter();
};

const clearAll = () => {
    emit('update:search', '');
    emit('update:category', '');
    emit('update:subcategory', '');
    debouncedFilter();
};
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
