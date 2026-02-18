import Network from '@/network-class'

export interface ScrapLogPayload {
  element_material_id: number
  stage: string
  reason?: string
  quantity: number
  unit?: string
  notes?: string
}

export class WorkOrderScrapLogsService {
  private baseUrl = '/api/production/work-orders'

  async getLogs(workOrderId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/scrap-logs`)
  }

  async createLog(workOrderId: number, payload: ScrapLogPayload) {
    return Network.store(`${this.baseUrl}/${workOrderId}/scrap-logs`, payload)
  }

  async deleteLog(workOrderId: number, logId: number) {
    return Network.delete(`${this.baseUrl}/${workOrderId}/scrap-logs/${logId}`)
  }
}

export const workOrderScrapLogsService = new WorkOrderScrapLogsService()
