import Network from '@/network-class'

export interface WorkOrderTaskPayload {
  workstation: string
  title: string
  quantity: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string | null
  notes?: string | null
  included?: boolean
  assignees?: Array<{ id: number; type: 'employee' | 'technical_labour' }>
}

export class WorkOrderTasksService {
  private baseUrl = '/api/production/work-orders'

  async getTasks(workOrderId: number) {
    return Network.get(`${this.baseUrl}/${workOrderId}/tasks`)
  }

  async createTask(workOrderId: number, payload: WorkOrderTaskPayload) {
    return Network.store(`${this.baseUrl}/${workOrderId}/tasks`, payload)
  }

  async updateTask(workOrderId: number, taskId: number, payload: Partial<WorkOrderTaskPayload>) {
    return Network.update(`${this.baseUrl}/${workOrderId}/tasks/${taskId}`, payload)
  }

  async deleteTask(workOrderId: number, taskId: number) {
    return Network.delete(`${this.baseUrl}/${workOrderId}/tasks/${taskId}`)
  }
}

export const workOrderTasksService = new WorkOrderTasksService()
