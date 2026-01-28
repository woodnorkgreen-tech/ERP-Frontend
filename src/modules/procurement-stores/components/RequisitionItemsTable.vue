<template>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Item <span class="text-red-500">*</span>
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Qty <span class="text-red-500">*</span>
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Unit Price <span class="text-red-500">*</span>
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Total
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Purpose <span class="text-red-500">*</span>
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Reason
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">

                    <!-- Item Search -->
                    <td class="px-4 py-3">
                        <div class="relative">
                            <input type="text" v-model="item.sku_search"
                                @input="searchMaterial(index, item.sku_search || '')" @focus="item.showDropdown = true"
                                :placeholder="item.material?.material_name || 'Search material...'"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white min-w-[250px]">

                            <div v-if="item.showDropdown && item.searchResults && item.searchResults.length > 0"
                                class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                <button v-for="material in item.searchResults" :key="material.id" type="button"
                                    @click="selectMaterial(index, material)"
                                    class="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{
                                        material.material_code }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ material.material_name }}
                                    </div>
                                </button>
                            </div>

                            <div v-if="item.loading" class="absolute right-3 top-1/2 -translate-y-1/2">
                                <i class="mdi mdi-loading mdi-spin text-gray-400"></i>
                            </div>
                        </div>
                    </td>

                    <!-- Quantity -->
                    <td class="px-4 py-3">
                        <input type="number" v-model.number="item.quantity" @input="calculateTotal(index)" min="1" required
                            class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white">
                    </td>

                    <!-- Unit Price -->
                    <td class="px-4 py-3">
                        <input type="number" v-model.number="item.unit_price" @input="calculateTotal(index)" step="0.01" min="0" required
                            class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white">
                    </td>

                    <!-- Total -->
                    <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        KES {{ formatNumber(item.total || 0) }}
                    </td>

                    <!-- Purpose -->
                    <td class="px-4 py-3">
                        <input type="text" v-model="item.purpose" @input="updateItem(index)" required
                            placeholder="e.g., Production, Maintenance"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white min-w-[200px]">
                    </td>

                    <!-- Reason -->
                    <td class="px-4 py-3">
                        <textarea v-model="item.reason" @input="updateItem(index)" rows="2"
                            placeholder="Additional details..."
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white min-w-[200px]"></textarea>
                    </td>

                    <!-- Actions -->
                    <td class="px-4 py-3 text-right">
                        <button type="button" @click="$emit('remove', index)" :disabled="items.length === 1"
                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="mdi mdi-delete-outline text-lg"></i>
                        </button>
                    </td>
                </tr>

                <tr v-if="items.length === 0">
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No items added yet.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import api from '@/plugins/axios'
import type { RequisitionItem } from '../../shared/types/requisitions'

interface Props {
    items: RequisitionItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
    update: [index: number, updatedItem: Partial<RequisitionItem>]
    remove: [index: number]
}>()

const searchMaterial = useDebounceFn(async (index: number, searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
        props.items[index].searchResults = []
        return
    }

    props.items[index].loading = true

    try {
        const response = await api.get('/api/materials-library/materials', {
            params: { search: searchTerm }
        })
        props.items[index].searchResults = response.data.data || []
    } catch (e) {
        console.error('Search failed:', e)
        props.items[index].searchResults = []
    } finally {
        props.items[index].loading = false
    }
}, 300)

const selectMaterial = (index: number, material: any) => {
    emit('update', index, {
        material_id: material.id,
        material: {
            id: material.id,
            material_code: material.material_code,
            material_name: material.material_name
        },
        unit_price: material.unit_cost || 0,
        sku_search: material.material_code,
        showDropdown: false,
        searchResults: []
    })
    calculateTotal(index)
}

const calculateTotal = (index: number) => {
    const item = props.items[index]
    const total = (item.quantity || 0) * (item.unit_price || 0)
    emit('update', index, { total })
}

const updateItem = (index: number) => {
    emit('update', index, props.items[index])
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
}
</script>