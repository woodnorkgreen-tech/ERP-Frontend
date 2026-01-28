import { ref } from 'vue'
import api from '@/plugins/axios'

export interface TechnicalLabour {
    id: number
    full_name: string
    phone: string
    email: string
    id_number: string
    specialization: string
    day_rate: number
    status: 'active' | 'inactive' | 'blacklisted'
    rating: number
    notes: string
    created_at?: string
    updated_at?: string
}

export function useTechnicalLabour() {
    const labours = ref<TechnicalLabour[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchLabours = async (params = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.get('/api/hr/technical-labour', { params })
            labours.value = response.data
            return labours.value
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch technical labour'
            throw err
        } finally {
            loading.value = false
        }
    }

    const createLabour = async (data: Partial<TechnicalLabour>) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('/api/hr/technical-labour', data)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create technical labour'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateLabour = async (id: number, data: Partial<TechnicalLabour>) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.put(`/api/hr/technical-labour/${id}`, data)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update technical labour'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteLabour = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            await api.delete(`/api/hr/technical-labour/${id}`)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete technical labour'
            throw err
        } finally {
            loading.value = false
        }
    }

    const importLabour = async (file: File) => {
        loading.value = true
        error.value = null
        try {
            const formData = new FormData()
            formData.append('file', file)
            await api.post('/api/hr/technical-labour/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to import technical labour'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        labours,
        loading,
        error,
        fetchLabours,
        createLabour,
        updateLabour,
        deleteLabour,
        importLabour
    }
}
