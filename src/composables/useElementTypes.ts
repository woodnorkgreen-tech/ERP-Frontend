import { ref } from 'vue'
import api from '@/plugins/axios'

export interface ElementType {
    id: number
    name: string
    display_name: string
    category: string
    is_predefined: boolean
    order: number
    materials?: any[]
    created_at?: string
    updated_at?: string
}

const elementTypes = ref<ElementType[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
let isInitialized = false

export function useElementTypes() {
    /**
     * Fetch all element types from the API
     */
    const fetchElementTypes = async (force: boolean = false): Promise<ElementType[]> => {
        if (isInitialized && !force && elementTypes.value.length > 0) {
            return elementTypes.value
        }
        try {
            isLoading.value = true
            error.value = null

            const response = await api.get('/api/projects/element-templates')

            // More robust check - if it has data and no success:false, it's likely a success
            if (response.data && response.data.success !== false) {
                const data = response.data.data || response.data
                elementTypes.value = Array.isArray(data) ? data : []
                isInitialized = true
                return elementTypes.value
            } else {
                throw new Error(response.data.message || 'Failed to fetch element types')
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Failed to fetch element types'
            console.error('Error fetching element types:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Create a new element type
     */
    const createElementType = async (name: string, category: string, displayName?: string): Promise<ElementType> => {
        try {
            isLoading.value = true
            error.value = null

            const response = await api.post('/api/projects/element-types', {
                name,
                category,
                display_name: displayName
            })

            if (response.data.success) {
                const newType = response.data.data
                // Add to local array
                elementTypes.value.push(newType)
                // Sort by order then display name
                elementTypes.value.sort((a, b) => {
                    if (a.order !== b.order) return a.order - b.order
                    return a.display_name.localeCompare(b.display_name)
                })
                return newType
            } else {
                throw new Error(response.data.message || 'Failed to create element type')
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Failed to create element type'
            console.error('Error creating element type:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Delete an element type
     */
    const deleteElementType = async (id: number): Promise<void> => {
        try {
            isLoading.value = true
            error.value = null

            const response = await api.delete(`/api/projects/element-types/${id}`)

            if (response.data.success) {
                // Remove from local array
                const index = elementTypes.value.findIndex(t => t.id === id)
                if (index !== -1) {
                    elementTypes.value.splice(index, 1)
                }
            } else {
                throw new Error(response.data.message || 'Failed to delete element type')
            }
        } catch (err: any) {
            // Extract error message, giving priority to backend validation messages
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete element type'
            error.value = errorMessage
            console.error('Error deleting element type:', err)
            throw new Error(errorMessage)
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Update an element type
     */
    const updateElementType = async (id: number, data: Partial<ElementType>): Promise<ElementType> => {
        try {
            isLoading.value = true
            error.value = null

            const response = await api.put(`/api/projects/element-types/${id}`, data)

            if (response.data.success) {
                const updatedType = response.data.data
                // Update in local array
                const index = elementTypes.value.findIndex(t => t.id === id)
                if (index !== -1) {
                    elementTypes.value[index] = updatedType
                }
                return updatedType
            } else {
                throw new Error(response.data.message || 'Failed to update element type')
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Failed to update element type'
            console.error('Error updating element type:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        elementTypes,
        isLoading,
        error,
        fetchElementTypes,
        createElementType,
        deleteElementType,
        updateElementType
    }
}
