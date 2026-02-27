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
                            <!-- Material Name Label (Shows when material is selected) -->
                            <div v-if="item.material_id" class="mb-1.5 flex items-center gap-2">
                                <span class="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-black uppercase tracking-wider border border-blue-200/50 dark:border-blue-800/50">
                                    {{ item.material?.material_code || 'Library Material' }}
                                </span>
                                <span class="text-xs font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
                                    {{ item.material?.material_name }}
                                </span>
                            </div>

                            <input type="text" v-model="item.sku_search"
                                @input="handleSearchInput(index)"
                                :placeholder="item.material_id ? 'Change material...' : 'Search material or enter name...'"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white min-w-[250px]">

                            <div v-if="item.searchResults && item.searchResults.length > 0"
                                class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-md shadow-xl max-h-64 overflow-y-auto">
                                <button v-for="material in item.searchResults" :key="material.id" type="button"
                                    @click="selectMaterial(index, material)"
                                    class="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 transition-colors">
                                    <div class="text-sm font-semibold text-gray-900 dark:text-white">{{
                                        material.material_code }}</div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ material.material_name }}
                                    </div>
                                </button>
                            </div>

                            <div v-if="item.loading" class="absolute right-3 top-1/2 -translate-y-1/2">
                                <i class="mdi mdi-loading mdi-spin text-blue-500 text-lg"></i>
                            </div>

                            <div v-if="!item.material_id" class="mt-2 text-xs animate-in fade-in slide-in-from-top-1 duration-300">
                                <label class="block font-black text-amber-600 dark:text-amber-400 mb-1 leading-none uppercase tracking-widest scale-75 origin-left">Name / Description</label>
                                <textarea 
                                    v-model="item.custom_description" 
                                    @input="handleCustomDescriptionInput(index)"
                                    rows="1"
                                    placeholder="Brief name or description..."
                                    class="w-full px-2 py-1.5 bg-amber-50/30 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-md text-[11px] font-medium text-amber-900 dark:text-amber-200 focus:ring-1 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder-amber-400"
                                ></textarea>
                            </div>

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

                    <!-- Purpose Dropdown -->
                    <td class="px-4 py-3">
                        <select v-model="item.purpose" @change="handlePurposeChange(index)" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-800 dark:text-white min-w-[200px]"
                            :class="{ 'border-blue-400 ring-1 ring-blue-300 dark:ring-blue-700': item.purpose === 'project_use' }"
                        >
                            <option value="">Select Purpose</option>
                            <option v-if="projectContext" value="project_use" class="font-bold text-blue-700">🏗️ Project Use</option>
                            <option v-for="purpose in purposeOptions" :key="purpose.code" :value="purpose.code">
                                {{ purpose.code }} - {{ purpose.description }}
                            </option>
                            <option value="custom">Other (Custom)</option>
                        </select>
                        
const handlePurposeChange = (index: number) => {
    const item = props.items[index]
    if (item.purpose !== 'custom' && item.purpose !== 'project_use') {
        item.custom_purpose = ''
    }
    updateItem(index)
}
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
import { watch } from 'vue'
import api from '@/plugins/axios'
import type { RequisitionItem } from '../shared/types/requisitions'

interface Props {
    items: RequisitionItem[]
    /** Pass project reference string (e.g. 'ENQ-001 - My Project') to enable project auto-fill */
    projectContext?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    update: [index: number, updatedItem: Partial<RequisitionItem>]
    remove: [index: number]
}>()

// Purpose options from the image
const purposeOptions = [
    { code: 'ADM001/1.26/1', description: 'Vehicle Service and repairs' },
    { code: 'ADM002/1.26/1', description: 'Motorbike and Car Wash' },
    { code: 'ADM003/1.26/1', description: 'Repair and Maintenance' },
    { code: 'ADM004/1.26/1', description: 'Utilities (Electricity and water bills)' },
    { code: 'ADM005/1.26/1', description: 'Motorbike and motor vehicle fuel' },
    { code: 'ADM006/1.26/1', description: 'Garbage Collection' },
    { code: 'ADM007/1.26/1', description: 'WNG Store Improvements' },
    { code: 'ADM008/1.26/1', description: 'Licence and Permit' },
    { code: 'ADM009/1.26/1', description: 'Printing' },
    { code: 'ADM010/1.26/1', description: 'PPE\'S' },
    { code: 'ADM011/1.26/1', description: 'Office Movements/Admin movements' },
    { code: 'ADM012/1.26/1', description: 'Other General Operations' },
    { code: 'ADM013/1.26/1', description: 'Store Replenishment' },
    { code: 'ADM014/1.26/1', description: 'Office Consumables' },
    { code: 'ADM015/1.26/1', description: 'Telephone and Internet' },
    { code: 'ADM016/1.26/1', description: 'Tools and Equipments' },
    { code: 'ADM017/1.26/1', description: 'Printers and Computers' },
    { code: 'ADM018/1.26/1', description: 'Office Improvements' },
    { code: 'ADM019/1.26/1', description: 'Office Equipment' },
    { code: 'ADM020/1.26/1', description: 'Tailoring materials' },
    { code: 'ADM021/1.26/1', description: 'WNG Samples' }
]

// Auto-fill purpose when project context changes
const applyProjectPurpose = (context: string) => {
    props.items.forEach((item, index) => {
        // Only auto-fill if purpose is empty or was previously auto-filled
        if (!item.purpose || item.purpose === 'project_use') {
            emit('update', index, {
                purpose: 'project_use',
                custom_purpose: context
            })
        }
    })
}

watch(() => props.projectContext, (newCtx) => {
    if (newCtx) {
        applyProjectPurpose(newCtx)
    }
}, { immediate: true })

const handleSearchInput = (index: number) => {
    const searchTerm = props.items[index].sku_search || ''
    
    // Sync with custom_description if not a library item
    if (!props.items[index].material_id) {
        props.items[index].custom_description = searchTerm
        updateItem(index)
    }

    searchMaterial(index, searchTerm)
}

const handleCustomDescriptionInput = (index: number) => {
    // Sync back to sku_search for visual consistency in the search box if needed
    // props.items[index].sku_search = props.items[index].custom_description
    updateItem(index)
}

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
        searchResults: []
    })
    calculateTotal(index)
}

const calculateTotal = (index: number) => {
    const item = props.items[index]
    const total = (item.quantity || 0) * (item.unit_price || 0)
    emit('update', index, { total })
}

const handlePurposeChange = (index: number) => {
    const item = props.items[index]
    if (item.purpose !== 'custom') {
        item.custom_purpose = ''
    }
    updateItem(index)
}

const updateItem = (index: number) => {
    emit('update', index, props.items[index])
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
}
</script>