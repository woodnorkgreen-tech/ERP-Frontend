import { ref, readonly } from 'vue'
import type { Invoice, CreateInvoiceData, InvoiceFilters } from '../types/purchaseOrders'
import api from '@/plugins/axios'

export function useInvoices() {
  const invoices = ref<Invoice[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchInvoices = async (filters?: InvoiceFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const params: Record<string, string | number> = {}
      
      if (filters?.searchTerm) params.searchTerm = filters.searchTerm
      if (filters?.status) params.status = filters.status
      if (filters?.date_filter) params.date_filter = filters.date_filter
      if (filters?.page) params.page = filters.page

      const response = await api.get('/api/procurement-stores/invoices', { params })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        invoices.value = response.data.data
      } else if (Array.isArray(response.data)) {
        invoices.value = response.data
      } else {
        invoices.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch invoices'
      invoices.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchInvoices = async (searchTerm: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/search/invoices', { searchTerm })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        invoices.value = response.data.data
      } else if (Array.isArray(response.data)) {
        invoices.value = response.data
      } else {
        invoices.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search invoices'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getInvoice = async (id: number): Promise<Invoice | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/procurement-stores/invoices/${id}`)
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
      
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch invoice'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createInvoice = async (data: CreateInvoiceData): Promise<Invoice> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/invoices', data)
      
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
          error.value = 'Failed to create invoice'
        }
      } else {
        error.value = err.message || 'Failed to create invoice'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const recordPayment = async (id: number, paymentData: { payment_date: string, payment_method: string }): Promise<Invoice> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/api/procurement-stores/invoices/${id}/record-payment`, paymentData)
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to record payment'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getStats = async () => {
    try {
      const response = await api.get('/api/procurement-stores/invoices-stats')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch stats'
      throw err
    }
  }

  return {
    invoices: readonly(invoices),
    loading: readonly(loading),
    error: readonly(error),
    fetchInvoices,
    searchInvoices,
    getInvoice,
    createInvoice,
    recordPayment,
    getStats
  }
}