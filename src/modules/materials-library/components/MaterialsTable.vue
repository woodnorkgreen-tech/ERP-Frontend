<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  UOM
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <!-- Conditional Stock Columns -->
                <th v-if="hasStockData" scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  On Hand
                </th>
                <th v-if="hasStockData" scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Available
                </th>
                <th v-if="hasStockData" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock Value
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <i class="mdi mdi-loading mdi-spin mr-2"></i> Loading materials...
                </td>
              </tr>
              <tr v-else-if="materials.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No materials found.
                </td>
              </tr>
              <tr v-for="material in materials" :key="material.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ material.material_code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ material.material_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ material.category }}
                  <span v-if="material.subcategory" class="text-xs text-gray-400 ml-1">({{ material.subcategory }})</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                  {{ material.unit_of_measure || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatCurrency(material.unit_cost) }}
                </td>
                <!-- Conditional Stock Data -->
                <td v-if="hasStockData" class="px-6 py-4 whitespace-nowrap text-center text-sm font-black text-slate-700 dark:text-slate-300">
                  {{ material.quantity_on_hand ?? 0 }}
                </td>
                <td v-if="hasStockData" class="px-6 py-4 whitespace-nowrap text-center text-sm font-black text-blue-500">
                  {{ material.available ?? 0 }}
                </td>
                <td v-if="hasStockData" class="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency((material.quantity_on_hand ?? 0) * (material.unit_cost ?? 0)) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <template v-if="showTrashed">
                    <button @click="$emit('restore', material.id)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                      Restore
                    </button>
                    <button @click="$emit('forceDelete', material.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Permanent Delete
                    </button>
                  </template>
                  <template v-else>
                    <button v-if="hasStockData" @click="$emit('checkIn', material)" class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 mr-4" title="Quick Stock Add">
                      <i class="mdi mdi-plus-box-outline text-lg"></i>
                    </button>
                    <button @click="$emit('view', material)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                      View
                    </button>
                    <button @click="$emit('edit', material)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                      Edit
                    </button>
                    <button v-if="canDelete" @click="$emit('delete', material.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Delete
                    </button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LibraryMaterial } from '../types/material';

const props = withDefaults(defineProps<{
  materials: LibraryMaterial[];
  loading: boolean;
  showTrashed?: boolean;
  canDelete?: boolean;
}>(), {
  showTrashed: false,
  canDelete: true
});

const hasStockData = computed(() => {
  return props.materials.some(m => m.quantity_on_hand !== undefined);
});

defineEmits<{
  (e: 'view', material: LibraryMaterial): void;
  (e: 'edit', material: LibraryMaterial): void;
  (e: 'checkIn', material: LibraryMaterial): void;
  (e: 'delete', id: number): void;
  (e: 'restore', id: number): void;
  (e: 'forceDelete', id: number): void;
}>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(value);
};
</script>
