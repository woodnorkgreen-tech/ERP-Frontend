import { ref, readonly } from 'vue'
import api from '@/plugins/axios'
import type { 
  GoodsReceiptNote, 
  CreateGoodsReceiptNoteData, 
  GoodsReceiptNoteFilters,
  AvailablePurchaseOrder 
} from '@/types/goodsReceiptNote'

export function useGoodsReceiptNotes() {
  const goodsReceiptNotes = ref<GoodsReceiptNote[]>([])
  const availablePurchaseOrders = ref<AvailablePurchaseOrder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchGoodsReceiptNotes = async (filters?: GoodsReceiptNoteFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      
      if (filters?.date_filter) params.append('date_filter', filters.date_filter)
      if (filters?.start_date) params.append('start_date', filters.start_date)
      if (filters?.end_date) params.append('end_date', filters.end_date)
      if (filters?.quality_check) params.append('quality_check', filters.quality_check)
      if (filters?.store_location) params.append('store_location', filters.store_location)
      if (filters?.page) params.append('page', filters.page.toString())
      
      const response = await api.get(`/api/procurement-stores/goods-receipt-notes?${params}`)
      
      if (response.data && response.data.data) {
        goodsReceiptNotes.value = response.data.data
        return response.data
      } else if (response.data) {
        goodsReceiptNotes.value = response.data
        return response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch goods receipt notes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchGoodsReceiptNotes = async (searchTerm: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/procurement-stores/goods-receipt-notes/search', {
        params: { searchTerm }
      })
      
      if (response.data && response.data.data) {
        goodsReceiptNotes.value = response.data.data
        return response.data
      } else if (response.data) {
        goodsReceiptNotes.value = response.data
        return response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search goods receipt notes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getGoodsReceiptNote = async (id: number): Promise<GoodsReceiptNote> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/procurement-stores/goods-receipt-notes/${id}`)
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch goods receipt note'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAvailablePurchaseOrders = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/api/procurement-stores/goods-receipt-notes/available-purchase-orders')
      
      if (response.data && response.data.data) {
        availablePurchaseOrders.value = response.data.data
        return response.data.data
      } else if (response.data) {
        availablePurchaseOrders.value = response.data
        return response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch available purchase orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGoodsReceiptNote = async (data: CreateGoodsReceiptNoteData): Promise<GoodsReceiptNote> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/goods-receipt-notes', data)
      
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
        if (err.response.data.errors) {
          error.value = Object.values(err.response.data.errors).flat().join(', ')
        } else if (err.response.data.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Failed to create goods receipt note'
        }
      } else {
        error.value = err.message || 'Failed to create goods receipt note'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGoodsReceiptNote = async (id: number, data: Partial<CreateGoodsReceiptNoteData>): Promise<GoodsReceiptNote> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/api/procurement-stores/goods-receipt-notes/${id}`, data)
      
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
        if (err.response.data.errors) {
          error.value = Object.values(err.response.data.errors).flat().join(', ')
        } else if (err.response.data.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Failed to update goods receipt note'
        }
      } else {
        error.value = err.message || 'Failed to update goods receipt note'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGoodsReceiptNote = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/api/procurement-stores/goods-receipt-notes/${id}`)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete goods receipt note'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    goodsReceiptNotes: readonly(goodsReceiptNotes),
    availablePurchaseOrders: readonly(availablePurchaseOrders),
    loading: readonly(loading),
    error: readonly(error),
    fetchGoodsReceiptNotes,
    searchGoodsReceiptNotes,
    getGoodsReceiptNote,
    fetchAvailablePurchaseOrders,
    createGoodsReceiptNote,
    updateGoodsReceiptNote,
    deleteGoodsReceiptNote
  }
}