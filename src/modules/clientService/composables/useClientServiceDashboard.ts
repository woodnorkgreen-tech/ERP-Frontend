import { ref } from 'vue'
import api from '@/plugins/axios'

interface DashboardStats {
    total_clients: number
    active_projects_count: number
    new_enquiries_count: number
    conversion_rate: number
    total_enquiries: number
    converted_enquiries_count: number
    lead_sources: Record<string, number>
}

interface ActivityItem {
    id: number
    type: 'enquiry' | 'lead'
    title: string
    status: string
    priority: string
    created_at: string
    client_name: string
}

interface DashboardData {
    stats: DashboardStats
    activity: ActivityItem[]
}

const dashboardData = ref<DashboardData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useClientServiceDashboard() {
    const fetchDashboardData = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get('/api/clientservice/dashboard')
            if (response.data.success) {
                dashboardData.value = response.data.data
            } else {
                error.value = response.data.message || 'Failed to fetch dashboard data'
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'An error occurred while fetching dashboard data'
            console.error('Dashboard Data Fetch Error:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        dashboardData,
        loading,
        error,
        fetchDashboardData
    }
}
