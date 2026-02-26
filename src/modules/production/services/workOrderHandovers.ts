import Network from '@/network-class'
import api from '@/plugins/axios'

export class WorkOrderHandoversService {
  private baseUrl = '/api/production/work-orders'

  async getHandovers(workOrderId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/handovers`)
  }

  async createHandover(workOrderId: number, payload: any) {
    return Network.store(`${this.baseUrl}/${workOrderId}/handovers`, payload)
  }

  async updateHandover(workOrderId: number, handoverId: number, payload: any) {
    return Network.update(`${this.baseUrl}/${workOrderId}/handovers/${handoverId}`, payload)
  }

  async deleteHandover(workOrderId: number, handoverId: number) {
    return Network.delete(`${this.baseUrl}/${workOrderId}/handovers/${handoverId}`)
  }

  async getHandoverPdf(workOrderId: number, handoverId: number) {
    // Make request with responseType 'blob' to handle binary data
    const url = `${this.baseUrl}/${workOrderId}/handovers/${handoverId}/pdf`
    console.log('Making PDF request to:', url)
    
    const response = await api.get(url, {
      responseType: 'blob'
    })
    
    console.log('PDF response:', response)
    console.log('Response data type:', typeof response.data)
    console.log('Response data:', response.data)
    
    return response.data
  }
}

export const workOrderHandoversService = new WorkOrderHandoversService()
