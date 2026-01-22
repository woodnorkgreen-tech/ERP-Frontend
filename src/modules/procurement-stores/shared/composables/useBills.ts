import { ref, readonly } from 'vue'
import type { Bill, CreateBillData, RecordPaymentData, BillFilters, PaymentMethod } from '../types/bills'
import api from '@/plugins/axios'

export function useBills() {
  const bills = ref<Bill[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBills = async (filters?: BillFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const params: Record<string, string | number> = {}
      
      if (filters?.searchTerm) params.searchTerm = filters.searchTerm
      if (filters?.status) params.status = filters.status
      if (filters?.date_filter) params.date_filter = filters.date_filter
      if (filters?.supplier_id) params.supplier_id = filters.supplier_id
      if (filters?.page) params.page = filters.page

      const response = await api.get('/api/procurement-stores/bills', { params })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        bills.value = response.data.data
      } else if (Array.isArray(response.data)) {
        bills.value = response.data
      } else {
        bills.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch bills'
      bills.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchBills = async (searchTerm: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/search/bills', { searchTerm })
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        bills.value = response.data.data
      } else if (Array.isArray(response.data)) {
        bills.value = response.data
      } else {
        bills.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search bills'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getBill = async (id: number): Promise<Bill | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/procurement-stores/bills/${id}`)
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
      
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch bill'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPendingBills = async (supplierId?: number) => {
    try {
      const params = supplierId ? { supplier_id: supplierId } : {}
      const response = await api.get('/api/procurement-stores/pending-bills', { params })
      return response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch pending bills'
      throw err
    }
  }

  const createBill = async (data: CreateBillData): Promise<Bill> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/bills', data)
      
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
          error.value = 'Failed to create bill'
        }
      } else {
        error.value = err.message || 'Failed to create bill'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const recordPayment = async (billId: number, paymentData: RecordPaymentData): Promise<Bill> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/api/procurement-stores/bills/${billId}/record-payment`, paymentData)
      
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

  const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    try {
      const response = await api.get('/api/procurement-stores/payment-methods')
      return response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch payment methods'
      throw err
    }
  }

  const addPaymentMethod = async (methodName: string): Promise<PaymentMethod> => {
    try {
      const response = await api.post('/api/procurement-stores/payment-methods', {
        method_name: methodName
      })
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to add payment method'
      throw err
    }
  }

  const getStats = async () => {
    try {
      const response = await api.get('/api/procurement-stores/bills-stats')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch stats'
      throw err
    }
  }

  return {
    bills: readonly(bills),
    loading: readonly(loading),
    error: readonly(error),
    fetchBills,
    searchBills,
    getBill,
    getPendingBills,
    createBill,
    recordPayment,
    getPaymentMethods,
    addPaymentMethod,
    getStats
  }
}