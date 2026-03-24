import { ref } from 'vue'
import api from '@/plugins/axios'
import type { EmployeeDocument } from '../types/employee'

export function useEmployeeDocuments() {
    const documents = ref<EmployeeDocument[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchDocuments = async (employeeId: number) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.get(`/api/hr/employees/${employeeId}/documents`)
            documents.value = Array.isArray(response.data) ? response.data : (response.data as any).data || []
            return documents.value
        } catch (err: any) {
            error.value = err.message || 'Failed to sync intelligence vault.'
            return []
        } finally {
            loading.value = false
        }
    }

    const uploadDocument = async (employeeId: number, file: File, type: string) => {
        loading.value = true
        error.value = null
        try {
            const formData = new FormData()
            formData.append('document', file)
            formData.append('document_type', type)

            const response = await api.post(`/api/hr/employees/${employeeId}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            const newDoc = (response.data as any).data || response.data
            documents.value = [newDoc, ...documents.value]
            return newDoc
        } catch (err: any) {
            error.value = err.message || 'Transmission failed.'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteDocument = async (employeeId: number, documentId: number) => {
        loading.value = true
        error.value = null
        try {
            await api.delete(`/api/hr/employees/${employeeId}/documents/${documentId}`)
            documents.value = documents.value.filter(d => d.id !== documentId)
        } catch (err: any) {
            error.value = err.message || 'Purge failed.'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getDownloadUrl = (employeeId: number, documentId: number) => {
        // We can just construct the URL and let the browser download it
        // Usually, we need to pass Auth headers, so a direct URL might fail if sanctum is used inside API.
        // If it requires auth, we should provide a way to download via blob.
        return `/api/hr/employees/${employeeId}/documents/${documentId}/download`
    }

    const downloadDocument = async (employeeId: number, documentId: number, filename: string) => {
        try {
            // Since useApi get expects JSON, we might need to use standard fetch for blobs
            const token = localStorage.getItem('auth_token')
            const response = await fetch(`/api/hr/employees/${employeeId}/documents/${documentId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error('Download failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err: any) {
            error.value = err.message || 'Download failed.'
        }
    }

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        downloadDocument,
        getDownloadUrl
    }
}
