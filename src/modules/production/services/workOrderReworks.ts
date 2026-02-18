import Network from '@/network-class'

export class WorkOrderReworksService {
  private baseUrl = '/api/production/work-orders'

  async getReworks(workOrderId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/reworks`)
  }

  async createRework(workOrderId: number, payload: any) {
    return Network.store(`${this.baseUrl}/${workOrderId}/reworks`, payload)
  }

  async updateRework(workOrderId: number, reworkId: number, payload: any) {
    return Network.update(`${this.baseUrl}/${workOrderId}/reworks/${reworkId}`, payload)
  }

  async getEvidence(workOrderId: number, reworkId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/reworks/${reworkId}/evidence`)
  }

  async uploadEvidence(workOrderId: number, reworkId: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return Network.store(`${this.baseUrl}/${workOrderId}/reworks/${reworkId}/evidence`, formData)
  }

  async deleteEvidence(workOrderId: number, reworkId: number, evidenceId: number) {
    return Network.delete(`${this.baseUrl}/${workOrderId}/reworks/${reworkId}/evidence/${evidenceId}`)
  }
}

export const workOrderReworksService = new WorkOrderReworksService()
