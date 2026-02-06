import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type {
  JobCardResponse,
  CreateJobCardPayload,
  UpdateJobCardPayload,
  Technician
} from '../types'

class PublicJobCardsApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: '/api/public',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  async lookupOrCreateJobCard(workerId: number, date?: string): Promise<JobCardResponse> {
    const response = await this.client.post('/job-cards/lookup', {
      worker_id: workerId,
      date
    })
    return response.data
  }

  async getJobCardByToken(token: string): Promise<JobCardResponse> {
    const response = await this.client.get(`/job-cards/${token}`)
    return response.data
  }

  async createJobCard(payload: CreateJobCardPayload): Promise<JobCardResponse> {
    const response = await this.client.post('/job-cards', payload)
    return response.data
  }

  async updateJobCardByToken(token: string, payload: UpdateJobCardPayload): Promise<JobCardResponse> {
    const response = await this.client.post(`/job-cards/${token}`, payload)
    return response.data
  }

  async getTechnicians(): Promise<{ success: boolean; data: Technician[] }> {
    const response = await this.client.get('/technicians')
    return response.data
  }
}

export const publicJobCardsService = new PublicJobCardsApiService()
export default publicJobCardsService
