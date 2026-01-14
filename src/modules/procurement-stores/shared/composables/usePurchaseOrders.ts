import { ref, readonly } from 'vue'
import type { PurchaseOrder, CreatePurchaseOrderData, PurchaseOrderFilters } from '../types/purchaseOrders'
import api from '@/plugins/axios'

export function usePurchaseOrders() {
  const purchaseOrders = ref<PurchaseOrder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPurchaseOrders = async (filters?: PurchaseOrderFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const params: Record<string, string | number> = {}
      
      if (filters?.searchTerm) params.searchTerm = filters.searchTerm
      if (filters?.status) params.status = filters.status
      if (filters?.date_filter) params.date_filter = filters.date_filter
      if (filters?.start_date) params.start_date = filters.start_date
      if (filters?.end_date) params.end_date = filters.end_date
      if (filters?.page) params.page = filters.page

      const response = await api.get('/api/procurement-stores/purchase-orders', { params })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        purchaseOrders.value = response.data.data
      } else if (Array.isArray(response.data)) {
        purchaseOrders.value = response.data
      } else {
        purchaseOrders.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch purchase orders'
      purchaseOrders.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchPurchaseOrders = async (searchTerm: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/search/purchase-orders', { searchTerm })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        purchaseOrders.value = response.data.data
      } else if (Array.isArray(response.data)) {
        purchaseOrders.value = response.data
      } else {
        purchaseOrders.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search purchase orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPurchaseOrder = async (id: number): Promise<PurchaseOrder | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/procurement-stores/purchase-orders/${id}`)
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
      
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch purchase order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPurchaseOrder = async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/purchase-orders', data)
      
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
          error.value = 'Failed to create purchase order'
        }
      } else {
        error.value = err.message || 'Failed to create purchase order'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePurchaseOrder = async (id: number, data: Partial<CreatePurchaseOrderData>): Promise<PurchaseOrder> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/api/procurement-stores/purchase-orders/${id}`, data)
      
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
          error.value = 'Failed to update purchase order'
        }
      } else {
        error.value = err.message || 'Failed to update purchase order'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePurchaseOrder = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/api/procurement-stores/purchase-orders/${id}`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete purchase order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendEmail = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      await api.post(`/api/procurement-stores/purchase-orders/${id}/send-email`)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to send email'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    purchaseOrders: readonly(purchaseOrders),
    loading: readonly(loading),
    error: readonly(error),
    fetchPurchaseOrders,
    searchPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    sendEmail
  }
}