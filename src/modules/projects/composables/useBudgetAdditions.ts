import { ref } from 'vue'
import api from '@/plugins/axios'

export interface BudgetAddition {
    id: string | number
    title: string
    description?: string
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
    total_amount: number
    budget_type: 'main' | 'supplementary'
    source_type?: string
    materials: any[]
    labour: any[]
    expenses: any[]
    logistics: any[]
    created_at: string
    creator?: { name: string }
    approver?: { name: string }
    approved_at?: string
}

export function useBudgetAdditions(taskId: number) {
    const additions = ref<BudgetAddition[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchAdditions = async () => {
        isLoading.value = true
        error.value = null
        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/budget/additions`)
            additions.value = response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch budget additions'
            console.error('Fetch additions error:', err)
        } finally {
            isLoading.value = false
        }
    }

    const createAddition = async (data: any) => {
        isLoading.value = true
        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/budget/additions`, data)
            await fetchAdditions()
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create budget addition'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateAddition = async (additionId: string | number, data: any) => {
        isLoading.value = true
        try {
            const response = await api.put(`/api/projects/tasks/${taskId}/budget/additions/${additionId}`, data)
            await fetchAdditions()
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update budget addition'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteAddition = async (additionId: string | number) => {
        isLoading.value = true
        try {
            await api.delete(`/api/projects/tasks/${taskId}/budget/additions/${additionId}`)
            await fetchAdditions()
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete budget addition'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const processApproval = async (additionId: string | number, action: 'approve' | 'reject', notes?: string) => {
        isLoading.value = true
        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/budget/additions/${additionId}/approve`, {
                action,
                notes
            })
            await fetchAdditions()
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to process approval'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        additions,
        isLoading,
        error,
        fetchAdditions,
        createAddition,
        updateAddition,
        deleteAddition,
        processApproval
    }
}
