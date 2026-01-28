import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type {
  JobCard,
  JobCardListResponse,
  JobCardResponse,
  CreateJobCardPayload,
  UpdateJobCardPayload,
  JobCardFilters,
  TechnicianTimeReport,
  ProductionAnalytics,
  Technician,
  WorkCenter
} from '../types'

class JobCardsApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token')
          // Redirect to login using correct base path
          const basePath = (import.meta as any).env.BASE_URL || '/'
          const loginUri = 'login'
          const loginPath = basePath.endsWith('/')
            ? `${basePath}${loginUri}`
            : `${basePath}/${loginUri}`

          if (window.location.pathname !== loginPath) {
            window.location.href = loginPath
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Job Card CRUD
  async getJobCards(filters?: JobCardFilters): Promise<JobCardListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await this.client.get(`/production/job-cards?${params.toString()}`)
    return response.data
  }

  async getJobCard(id: number): Promise<JobCardResponse> {
    const response = await this.client.get(`/production/job-cards/${id}`)
    return response.data
  }

  async createJobCard(payload: CreateJobCardPayload): Promise<JobCardResponse> {
    const response = await this.client.post('/production/job-cards', payload)
    return response.data
  }

  async updateJobCard(id: number, payload: UpdateJobCardPayload): Promise<JobCardResponse> {
    const response = await this.client.put(`/production/job-cards/${id}`, payload)
    return response.data
  }

  async deleteJobCard(id: number): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete(`/production/job-cards/${id}`)
    return response.data
  }

  // Reports and Analytics
  async getTechnicianTimeReport(technicianId: number, period: string): Promise<{ success: boolean; data: TechnicianTimeReport }> {
    const response = await this.client.get(`/production/reports/technician/${technicianId}?period=${period}`)
    return response.data
  }

  async getProductionAnalytics(period: string): Promise<{ success: boolean; data: ProductionAnalytics }> {
    const response = await this.client.get(`/production/analytics?period=${period}`)
    return response.data
  }

  // Reference Data
  async getTechnicians(): Promise<{ success: boolean; data: Technician[] }> {
    const response = await this.client.get('/production/technicians')
    return response.data
  }

  async getWorkCenters(): Promise<{ success: boolean; data: WorkCenter[] }> {
    const response = await this.client.get('/production/work-centers')
    return response.data
  }

  async getNextJobCardNumber(): Promise<{ success: boolean; data: { job_card_number: string } }> {
    const response = await this.client.get('/production/job-cards/next-number')
    return response.data
  }

  // Job Card Status Updates
  async releaseJobCard(id: number): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/release`)
    return response.data
  }

  async startJobCard(id: number): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/start`)
    return response.data
  }

  async completeJobCard(id: number): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/complete`)
    return response.data
  }

  async putJobCardOnHold(id: number, reason: string): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/hold`, { reason })
    return response.data
  }

  // Job Card Status Management
  async updateJobCardStatus(id: number, status: string, notes?: string): Promise<JobCardResponse> {
    const response = await this.client.patch(`/production/job-cards/${id}/status`, { status, notes })
    return response.data
  }

  async submitJobCardForApproval(id: number): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/submit-for-approval`)
    return response.data
  }

  async approveJobCard(id: number, notes?: string): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/approve`, { notes })
    return response.data
  }

  async rejectJobCard(id: number, rejectionReason: string): Promise<JobCardResponse> {
    const response = await this.client.post(`/production/job-cards/${id}/reject`, { rejection_reason: rejectionReason })
    return response.data
  }

  }

// Export singleton instance
export const jobCardsService = new JobCardsApiService()
export default jobCardsService
