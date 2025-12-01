import { ref, computed } from 'vue'
import api from '@/plugins/axios'
import { validateResponses } from '@/modules/projects/config/surveyQuestions'

export interface HandoverSurvey {
    id?: number
    task_id: number
    respondent_info?: string
    responses?: Record<string, any>
    question_config_snapshot?: any
    submitted?: boolean
    submitted_at?: string
    access_token?: string
    project_title?: string
    client_name?: string
    created_at?: string
    updated_at?: string
    // Alternative feedback fields
    feedback_source?: string
    feedback_received_at?: string
    evidence_notes?: string
    evidence_files?: any[]
    captured_by?: number
}

export function useHandover() {
    const surveyData = ref<HandoverSurvey | null>(null)
    const loading = ref(false)
    const saving = ref(false)
    const error = ref<string | null>(null)

    /**
     * Check if all required questions are answered
     */
    const isSurveyComplete = computed(() => {
        if (!surveyData.value?.responses) return false
        const validation = validateResponses(surveyData.value.responses)
        return validation.valid
    })

    /**
     * Check if survey has been submitted
     */
    const isSurveySubmitted = computed(() => {
        return surveyData.value?.submitted === true
    })

    /**
     * Calculate average rating from all rating questions
     */
    const averageRating = computed(() => {
        if (!surveyData.value?.responses) return 0

        const ratings: number[] = []

        // Extract all rating values from responses
        Object.values(surveyData.value.responses).forEach(response => {
            // If response has a 'rating' key (for questions with remarks)
            if (typeof response === 'object' && response !== null && 'rating' in response) {
                const rating = response.rating
                if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
                    ratings.push(rating)
                }
            }
            // If response is directly a numeric rating
            else if (typeof response === 'number' && response >= 1 && response <= 5) {
                ratings.push(response)
            }
        })

        if (ratings.length === 0) return 0

        const sum = ratings.reduce((acc, rating) => acc + rating, 0)
        return +(sum / ratings.length).toFixed(1)
    })

    /**
     * Fetch handover survey for a task (internal use)
     */
    const fetchSurvey = async (taskId: number): Promise<HandoverSurvey | null> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/handover/survey`)
            surveyData.value = response.data.data
            return surveyData.value
        } catch (err: any) {
            // 404 means no survey exists yet - that's okay
            if (err.response?.status === 404) {
                surveyData.value = {
                    task_id: taskId,
                    responses: {}
                }
                return null
            }

            console.error('Error fetching handover survey:', err)
            error.value = err.response?.data?.message || 'Failed to load survey'
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Save handover survey (internal use)
     */
    const saveSurvey = async (taskId: number, data: any): Promise<HandoverSurvey> => {
        saving.value = true
        error.value = null

        try {
            // Let Axios handle Content-Type for FormData automatically
            const response = await api.post(`/api/projects/tasks/${taskId}/handover/survey`, data)

            surveyData.value = response.data.data
            return surveyData.value!
        } catch (err: any) {
            console.error('Error saving handover survey:', err)
            error.value = err.response?.data?.message || 'Failed to save survey'
            throw err
        } finally {
            saving.value = false
        }
    }

    /**
     * Submit handover survey (mark as final)
     */
    const submitSurvey = async (taskId: number): Promise<HandoverSurvey> => {
        if (!surveyData.value) {
            throw new Error('No survey data to submit')
        }

        return saveSurvey(taskId, {
            ...surveyData.value,
            submitted: true
        })
    }

    /**
     * Generate access token for public sharing
     */
    const generateToken = async (taskId: number): Promise<string> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/handover/survey/generate-token`)
            const token = response.data.data.access_token

            // Update local survey data with new token
            if (surveyData.value) {
                surveyData.value.access_token = token
            }

            return token
        } catch (err: any) {
            console.error('Error generating token:', err)
            error.value = err.response?.data?.message || 'Failed to generate token'
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch public survey by token (for clients)
     */
    const fetchPublicSurvey = async (token: string): Promise<HandoverSurvey | null> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/public/handover/${token}`)
            surveyData.value = response.data.data
            return surveyData.value
        } catch (err: any) {
            console.error('Error fetching public survey:', err)
            error.value = err.response?.data?.message || 'Failed to load survey'
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Submit public survey (for clients)
     */
    const submitPublicSurvey = async (token: string, data: Partial<HandoverSurvey>): Promise<HandoverSurvey> => {
        saving.value = true
        error.value = null

        try {
            const response = await api.post(`/api/public/handover/${token}`, data)
            surveyData.value = response.data.data
            return surveyData.value!
        } catch (err: any) {
            console.error('Error submitting public survey:', err)
            error.value = err.response?.data?.message || 'Failed to submit survey'
            throw err
        } finally {
            saving.value = false
        }
    }

    return {
        surveyData,
        loading,
        saving,
        error,
        isSurveyComplete,
        isSurveySubmitted,
        averageRating,
        fetchSurvey,
        saveSurvey,
        submitSurvey,
        generateToken,
        fetchPublicSurvey,
        submitPublicSurvey
    }
}
