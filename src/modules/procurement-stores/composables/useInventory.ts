import { ref } from 'vue'
import api from '@/plugins/axios'

export interface InventoryItem {
    id: number
    material_name: string
    material_code: string
    category: string | null
    subcategory: string | null
    specification: string
    unit_of_measure: string
    unit_cost: number
    workstation?: any
    workstation_name?: string
    workstation_id: number
    attributes: Record<string, any>
    is_active: boolean
    notes: string | null
    quantity_on_hand: number
    quantity_reserved: number
    available: number
    min_stock_level: number
    location: string
}

export function useInventory() {
    const inventory = ref<InventoryItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchInventory = async (filters: {
        search?: string,
        workstation_id?: number | null,
        category?: string
    } = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.get('/api/procurement-stores/inventory', { params: filters })
            inventory.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch inventory'
        } finally {
            loading.value = false
        }
    }

    return {
        inventory,
        loading,
        error,
        fetchInventory
    }
}
