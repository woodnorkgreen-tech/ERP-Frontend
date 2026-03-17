import { ref } from 'vue'
import api from '@/plugins/axios'

export interface HandoverSummary {
    id: number
    submitted_at: string
    average_rating: number
    client_name: string
    project_title: string
    job_number: string
    respondent: string
    feedback_source: string
}

export interface HandoverDetail extends HandoverSummary {
    responses: Record<string, any>
    question_config: any
    respondent_info: any
    evidence_notes: string
}

export function useHandovers() {
    const handovers = ref<HandoverSummary[]>([])
    const currentHandover = ref<HandoverDetail | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const pagination = ref({
        currentPage: 1,
        lastPage: 1,
        total: 0
    })

    const fetchHandovers = async (page = 1, filters = {}) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.get('/api/clientservice/handovers', {
                params: { page, ...filters }
            })
            handovers.value = response.data.data
            pagination.value = {
                currentPage: response.data.meta.current_page,
                lastPage: response.data.meta.last_page,
                total: response.data.meta.total
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch handovers'
            console.error('Error fetching handovers:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchHandoverDetails = async (id: number) => {
        loading.value = true
        error.value = null
        try {
            const response = await api.get(`/api/clientservice/handovers/${id}`)
            currentHandover.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch handover details'
            console.error('Error fetching handover details:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        handovers,
        currentHandover,
        loading,
        error,
        pagination,
        fetchHandovers,
        fetchHandoverDetails
    }
}
