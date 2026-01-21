import type {
  WorkOrder,
  WorkOrderResponse,
  WorkOrderListResponse,
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  WorkOrderFilters
} from '../types'
import Network from '@/network-class'

export class WorkOrderService {
  private baseUrl = '/api/production/work-orders'

  /**
   * Get all work orders with optional filters
   */
  async getWorkOrders(filters?: WorkOrderFilters): Promise<WorkOrderListResponse> {
    const params = new URLSearchParams()

    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.project_enquiry_id) params.append('project_enquiry_id', filters.project_enquiry_id.toString())
    if (filters?.project_id) params.append('project_id', filters.project_id.toString())
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())

    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl
    return Network.get(url)
  }

  /**
   * Get a specific work order by ID
   */
  async getWorkOrder(id: number): Promise<WorkOrderResponse> {
    return Network.get(`${this.baseUrl}/${id}`)
  }

  /**
   * Create a new work order
   */

  /**
   * Update a work order
   */
  async updateWorkOrder(id: number, payload: UpdateWorkOrderPayload): Promise<WorkOrderResponse> {
    return Network.update(`${this.baseUrl}/${id}`, payload)
  }

  /**
   * Delete a work order
   */


  /**
   * Get work orders for a specific enquiry
   */
  async getWorkOrdersByEnquiry(enquiryId: number): Promise<{ success: boolean; data: WorkOrder[] }> {
    return Network.get(`${this.baseUrl}/enquiry/${enquiryId}`)
  }
}

export const workOrderService = new WorkOrderService()
