import { ref, computed } from 'vue'
import api from '@/plugins/axios'

export interface SetdownTaskData {
    id: number
    task_id: number
    documentation: {
        setdown_notes?: string
        completion_notes?: string
        photos: Array<{
            id: number
            filename: string
            original_filename: string
            url: string
            description?: string
            uploaded_by?: string
            uploaded_at: string
        }>
    }
    issues: Array<{
        id: number
        title: string
        description: string
        category: 'equipment' | 'venue' | 'team' | 'safety' | 'other'
        priority: 'low' | 'medium' | 'high' | 'critical'
        status: 'open' | 'in_progress' | 'resolved'
        reported_by?: string
        reported_at: string
        assigned_to?: string
        resolved_at?: string
        resolution?: string
    }>
}

export function useSetdown() {
    const setdownData = ref<SetdownTaskData | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const getErrorMessage = (err: any): string => {
        if (err.response?.data?.message) {
            return err.response.data.message
        }
        if (err.message) {
            return err.message
        }
        return 'An unknown error occurred'
    }

    /**
     * Fetch setdown data for a task
     */
    const fetchSetdownData = async (taskId: number): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/setdown`)
            setdownData.value = response.data.data
        } catch (err: any) {
            error.value = getErrorMessage(err)
            console.error('Failed to fetch setdown data:', err)
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch issues (alias for fetching data or specific endpoint if needed)
     * Currently just re-fetches the main data to ensure issues are up to date
     */
    const fetchIssues = async (taskId: number): Promise<void> => {
        await fetchSetdownData(taskId)
    }

    /**
     * Save documentation notes
     */
    const saveDocumentation = async (
        taskId: number,
        data: { setdown_notes?: string; completion_notes?: string }
    ): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/setdown/documentation`, data)

            // Update local setdown data
            if (setdownData.value) {
                setdownData.value.documentation.setdown_notes = data.setdown_notes
                setdownData.value.documentation.completion_notes = data.completion_notes
            }
        } catch (err: any) {
            error.value = getErrorMessage(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Upload a photo
     */
    const uploadPhoto = async (taskId: number, file: File, description?: string): Promise<any> => {
        loading.value = true
        error.value = null

        try {
            const formData = new FormData()
            formData.append('photo', file)
            if (description) {
                formData.append('description', description)
            }

            const response = await api.post(`/api/projects/tasks/${taskId}/setdown/photos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            return response.data.data
        } catch (err: any) {
            error.value = getErrorMessage(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Delete a photo
     */
    const deletePhoto = async (taskId: number, photoId: number): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            await api.delete(`/api/projects/tasks/${taskId}/setdown/photos/${photoId}`)
        } catch (err: any) {
            error.value = getErrorMessage(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Add an issue
     */
    const addIssue = async (
        taskId: number,
        data: {
            title: string
            description: string
            category: 'equipment' | 'venue' | 'team' | 'safety' | 'other'
            priority: 'low' | 'medium' | 'high' | 'critical'
            assigned_to?: number
        }
    ): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/setdown/issues`, data)

            // Reload setdown data to get updated issues list
            await fetchSetdownData(taskId)
        } catch (err: any) {
            error.value = getErrorMessage(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Update an issue
     */
    const updateIssue = async (
        taskId: number,
        issueId: number,
        data: {
            status?: 'open' | 'in_progress' | 'resolved'
            resolution?: string
            assigned_to?: number
        }
    ): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            await api.put(`/api/projects/tasks/${taskId}/setdown/issues/${issueId}`, data)
        } catch (err: any) {
            error.value = getErrorMessage(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Delete an issue
     */
    const deleteIssue = async (taskId: number, issueId: number): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            await api.delete(`/api/projects/tasks/${taskId}/setdown/issues/${issueId}`)
        } catch (err: any) {
            error.value = getErrorMessage(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Computed properties for convenience
    const photosCount = computed(() => setdownData.value?.documentation.photos.length || 0)
    const issuesCount = computed(() => setdownData.value?.issues.length || 0)
    const openIssuesCount = computed(() => setdownData.value?.issues.filter(i => i.status !== 'resolved').length || 0)

    return {
        setdownData,
        loading,
        error,
        fetchSetdownData,
        fetchIssues,
        saveDocumentation,
        uploadPhoto,
        deletePhoto,
        addIssue,
        updateIssue,
        deleteIssue,
        photosCount,
        issuesCount,
        openIssuesCount,
    }
}
