import { ref, readonly } from 'vue'
import type { Supplier, CreateSupplierData, UpdateSupplierData, SupplierFilters } from '../types/suppliers'
import api from '@/plugins/axios' // ← ADD THIS IMPORT

export function useSuppliers() {
  const suppliers = ref<Supplier[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // Remove: const { get, post, put, del } = useApi()

  const fetchSuppliers = async (filters?: SupplierFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const params: Record<string, string | number> = {}
      
      if (filters?.searchTerm) {
        params.searchTerm = filters.searchTerm
      }
      if (filters?.status) {
        params.status = filters.status
      }
      if (filters?.payment_terms) {
        params.payment_terms = filters.payment_terms
      }
      if (filters?.page) {
        params.page = filters.page
      }

      const response = await api.get('/api/procurement-stores/suppliers', { params }) // ← Use api.get
      
      // Handle paginated response
      if (response.data && Array.isArray(response.data)) {
        suppliers.value = response.data
      } else if (Array.isArray(response.data)) {
        suppliers.value = response.data
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Laravel paginated format: { data: [...], meta: {...} }
        suppliers.value = response.data.data
      } else {
        suppliers.value = []
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch suppliers'
      console.error('Error fetching suppliers:', err)
      suppliers.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchSuppliers = async (searchTerm: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/search/suppliers', { searchTerm }) // ← Use api.post
      
      if (response.data && Array.isArray(response.data)) {
        suppliers.value = response.data
      } else if (Array.isArray(response.data)) {
        suppliers.value = response.data
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        suppliers.value = response.data.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search suppliers'
      console.error('Error searching suppliers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getSupplier = async (id: number): Promise<Supplier | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/api/procurement-stores/suppliers/${id}`) // ← Use api.get
      
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
      
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch supplier'
      console.error('Error fetching supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createSupplier = async (data: CreateSupplierData): Promise<Supplier> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/api/procurement-stores/suppliers', data) // ← Use api.post
      
      // Handle Laravel validation errors
      if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors))
      }
      
      // Handle success response
      if (response.data && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err: any) {
      // Handle axios error with response data
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          error.value = Object.values(err.response.data.errors).flat().join(', ')
        } else if (err.response.data.message) {
          error.value = err.response.data.message
        } else {
          error.value = 'Failed to create supplier'
        }
      } else {
        error.value = err.message || 'Failed to create supplier'
      }
      
      console.error('Error creating supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSupplier = async (id: number, data: UpdateSupplierData): Promise<Supplier> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/api/procurement-stores/suppliers/${id}`, data) // ← Use api.put
      
      if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors))
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
          error.value = 'Failed to update supplier'
        }
      } else {
        error.value = err.message || 'Failed to update supplier'
      }
      
      console.error('Error updating supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSupplier = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/api/procurement-stores/suppliers/${id}`) // ← Use api.delete
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete supplier'
      console.error('Error deleting supplier:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    suppliers: readonly(suppliers),
    loading: readonly(loading),
    error: readonly(error),
    fetchSuppliers,
    searchSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
}