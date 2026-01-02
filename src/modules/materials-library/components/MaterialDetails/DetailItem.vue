<template>
  <div 
    class="group p-4 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300"
    :class="{ 'p-3': variant === 'compact' }"
  >
    <div class="flex items-start space-x-3">
      <div 
        v-if="icon" 
        class="mt-0.5 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors duration-300"
      >
        <i :class="['mdi', icon, 'text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400']"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5 transition-colors group-hover:text-emerald-500/80">
          {{ label }}
        </p>
        <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate flex items-center">
          <span v-if="!value" class="text-gray-300 dark:text-gray-600 font-normal italic">Unavailable</span>
          <span v-else class="block truncate">{{ value }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number | null;
  icon?: string;
  variant?: 'normal' | 'compact';
}>();
</script>
