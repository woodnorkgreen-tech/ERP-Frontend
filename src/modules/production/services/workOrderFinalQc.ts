import Network from '@/network-class'

export class WorkOrderFinalQcService {
  private baseUrl = '/api/production/work-orders'

  async getChecks(workOrderId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/final-qc`)
  }

  async saveChecks(workOrderId: number, checks: any[]) {
    return Network.store(`${this.baseUrl}/${workOrderId}/final-qc`, { checks })
  }
}

export const workOrderFinalQcService = new WorkOrderFinalQcService()
