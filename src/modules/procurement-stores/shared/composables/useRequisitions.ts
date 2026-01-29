import { ref, readonly } from 'vue'
import type { Requisition, CreateRequisitionData, RequisitionFilters } from '../types/requisitions'
import api from '@/plugins/axios'

export function useRequisitions() {
  const requisitions = ref<Requisition[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRequisitions = async (filters?: RequisitionFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const params: Record<string, string | number> = {}
      
      if (filters?.searchTerm) params.searchTerm = filters.searchTerm
      if (filters?.status) params.status = filters.status
      if (filters?.urgency) params.urgency = filters.urgency
      if (filters?.requested_by_type) params.requested_by_type = filters.requested_by_type
      if (filters?.page) params.page = filters.page

      const response = await api.get('/api/procurement-stores/requisitions', { params })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        requisitions.value = response.data.data
      } else if (Array.isArray(response.data)) {
        requisitions.value = response.data
      } else {
        requisitions.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch requisitions'
      requisitions.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchRequisitions = async (searchTerm: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/search/requisitions', { searchTerm })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        requisitions.value = response.data.data
      } else if (Array.isArray(response.data)) {
        requisitions.value = response.data
      } else {
        requisitions.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search requisitions'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getRequisition = async (id: number): Promise<Requisition | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/procurement-stores/requisitions/${id}`)
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
      
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch requisition'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRequisition = async (data: CreateRequisitionData): Promise<Requisition> => {
    loading.value = true
    error.value = null
    
    try {
      // Transform items to handle custom purpose
      const transformedData = {
        ...data,
        items: data.items.map(item => ({
          material_id: item.material_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          purpose: item.purpose === 'custom' ? item.custom_purpose : item.purpose,
          reason: item.reason
        }))
      }
      
      const response = await api.post('/api/procurement-stores/requisitions', transformedData)
      
      if (response.data.error) {
        throw new Error(JSON.stringify(response.data.error))
      }
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          error.value = Object.values(err.response.data.error).flat().join(', ')
        } else if (err.response.data.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Failed to create requisition'
        }
      } else {
        error.value = err.message || 'Failed to create requisition'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRequisition = async (id: number, data: Partial<CreateRequisitionData>): Promise<Requisition> => {
    loading.value = true
    error.value = null
    
    try {
      // Transform items to handle custom purpose
      const transformedData = {
        ...data,
        items: data.items?.map(item => ({
          material_id: item.material_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          purpose: item.purpose === 'custom' ? item.custom_purpose : item.purpose,
          reason: item.reason
        }))
      }
      
      const response = await api.put(`/api/procurement-stores/requisitions/${id}`, transformedData)
      
      if (response.data.error) {
        throw new Error(JSON.stringify(response.data.error))
      }
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          error.value = Object.values(err.response.data.error).flat().join(', ')
        } else if (err.response.data.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Failed to update requisition'
        }
      } else {
        error.value = err.message || 'Failed to update requisition'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRequisition = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/api/procurement-stores/requisitions/${id}`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete requisition'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    requisitions: readonly(requisitions),
    loading: readonly(loading),
    error: readonly(error),
    fetchRequisitions,
    searchRequisitions,
    getRequisition,
    createRequisition,
    updateRequisition,
    deleteRequisition
  }
}