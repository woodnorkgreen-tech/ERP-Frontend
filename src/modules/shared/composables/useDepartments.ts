import { ref, type Ref } from 'vue'
import api from '@/plugins/axios'

export interface Department {
    id: number
    name: string
    description?: string
    manager_id?: number
    created_at?: string
    updated_at?: string
}

export function useDepartments() {
    const departments: Ref<Department[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    const fetchDepartments = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get('/api/admin/departments')
            departments.value = response.data.data || response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch departments'
            console.error('Error fetching departments:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        departments,
        loading,
        error,
        fetchDepartments
    }
}
