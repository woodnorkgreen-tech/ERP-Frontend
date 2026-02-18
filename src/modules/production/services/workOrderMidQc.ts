import Network from '@/network-class'

export interface MidQcCheckPayload {
  workstation: string
  category: string
  title: string
  notes?: string | null
  status: 'pending' | 'passed' | 'failed'
}

export class WorkOrderMidQcService {
  private baseUrl = '/api/production/work-orders'

  async getChecks(workOrderId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/mid-qc`)
  }

  async saveChecks(workOrderId: number, checks: MidQcCheckPayload[]) {
    return Network.store(`${this.baseUrl}/${workOrderId}/mid-qc`, { checks })
  }
}

export const workOrderMidQcService = new WorkOrderMidQcService()
