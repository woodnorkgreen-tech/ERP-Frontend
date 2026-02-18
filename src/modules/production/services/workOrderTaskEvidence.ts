import Network from '@/network-class'

export class WorkOrderTaskEvidenceService {
  private baseUrl = '/api/production/work-orders'

  async getEvidence(workOrderId: number, taskId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/tasks/${taskId}/evidence`)
  }

  async uploadEvidence(workOrderId: number, taskId: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return Network.store(`${this.baseUrl}/${workOrderId}/tasks/${taskId}/evidence`, formData)
  }

  async deleteEvidence(workOrderId: number, taskId: number, evidenceId: number) {
    return Network.delete(`${this.baseUrl}/${workOrderId}/tasks/${taskId}/evidence/${evidenceId}`)
  }
}

export const workOrderTaskEvidenceService = new WorkOrderTaskEvidenceService()
