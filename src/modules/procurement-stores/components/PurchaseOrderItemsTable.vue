<template>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Quantity</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit
                        Price</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Action</th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in items" :key="index">
                    <td class="px-4 py-3">
                        <div class="relative">
                            <input v-model="item.sku_search" @input="searchMaterials(index)" type="text"
                                placeholder="Search SKU or name..."
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                            <div v-if="item.showDropdown && item.searchResults && item.searchResults.length > 0"
                                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                <div v-for="material in item.searchResults" :key="material.id"
                                    @click="selectMaterial(index, material)"
                                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm">
                                    <div class="font-medium text-gray-900 dark:text-white">{{ material.material_code }}
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400">{{ material.material_name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3">
                        <input v-model.number="item.quantity" @input="calculateTotal(index)" type="number" min="1"
                            class="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                    </td>
                    <td class="px-4 py-3">
                        <input v-model.number="item.unit_price" @input="calculateTotal(index)" type="number" step="0.01"
                            min="0"
                            class="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                    </td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        ${{ formatNumber(item.total || 0) }}
                    </td>
                    <td class="px-4 py-3">
                        <button @click="$emit('remove', index)"
                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import type { PurchaseOrderItem } from '../shared/types/purchaseOrders'
import axios from '@/plugins/axios'



const emit = defineEmits<{
    update: [index: number, item: Partial<PurchaseOrderItem>]
    remove: [index: number]
}>()

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const searchMaterials = (index: number) => {
    const item = props.items[index]

    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    if (!item.sku_search || item.sku_search.length < 2) {
        emit('update', index, { showDropdown: false, searchResults: [] })
        return
    }

    emit('update', index, { loading: true })

    searchTimeout = setTimeout(async () => {
        try {
            const response = await axios.post('/api/materials-library/search/materials', {
                searchTerm: item.sku_search
            })

            const results = response.data.data || response.data || []
            emit('update', index, {
                showDropdown: true,
                searchResults: results,
                loading: false
            })
        } catch (error) {
            console.error('Failed to search materials:', error)
            emit('update', index, { showDropdown: false, loading: false })
        }
    }, 300)
}

const selectMaterial = (index: number, material: any) => {
    emit('update', index, {
        material_id: material.id,
        material: material,
        sku_search: material.material_code,
        unit_price: material.unit_price || 0,
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

const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
}

const props = defineProps<{
    items: PurchaseOrderItem[]
}>()
</script>