<template>
  <div class="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
    <nav class="flex space-x-4" aria-label="Tabs">
      <button
        v-for="workstation in workstations"
        :key="workstation.id"
        @click="$emit('update:modelValue', workstation.id)"
        :class="[
          modelValue === workstation.id
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700',
          'px-3 py-2 font-medium text-sm rounded-md whitespace-nowrap transition-colors'
        ]"
      >
        {{ workstation.name }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Workstation } from '../types/workstation';

defineProps<{
  workstations: Workstation[];
  modelValue: number | null;
}>();

defineEmits<{
  (e: 'update:modelValue', id: number): void;
}>();
</script>
