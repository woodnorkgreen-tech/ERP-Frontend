import api from '@/plugins/axios'
import type {
  CreateLeaveRequestPayload,
  CreateLeaveHandoverPayload,
  CreateLeaveTypePayload,
  LeaveDashboardData,
  LeaveHandover,
  LeaveRequest,
  LeaveRequestFilters,
  LeaveRequestsResponse,
  LeaveType,
  UpdateLeaveRequestPayload,
  UpdateLeaveTypePayload,
} from '../types/leave'

class LeaveService {
  private readonly baseUrl = '/api/hr/leave'

  async getDashboard(params?: { employee_id?: number; year?: number }) {
    const response = await api.get<{ success: boolean; data: LeaveDashboardData }>(`${this.baseUrl}/dashboard`, { params })
    return response.data
  }

  async getLeaveTypes(params?: { include_inactive?: boolean }) {
    const response = await api.get<{ success: boolean; data: LeaveType[] }>(`${this.baseUrl}/types`, { params })
    return response.data
  }

  async createLeaveType(payload: CreateLeaveTypePayload) {
    const response = await api.post<{ success: boolean; data: LeaveType; message: string }>(`${this.baseUrl}/types`, payload)
    return response.data
  }

  async updateLeaveType(id: number, payload: UpdateLeaveTypePayload) {
    const response = await api.put<{ success: boolean; data: LeaveType; message: string }>(`${this.baseUrl}/types/${id}`, payload)
    return response.data
  }

  async deleteLeaveType(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(`${this.baseUrl}/types/${id}`)
    return response.data
  }

  async getLeaveRequests(filters?: LeaveRequestFilters) {
    const response = await api.get<LeaveRequestsResponse>(`${this.baseUrl}/requests`, { params: filters })
    return response.data
  }

  async createLeaveRequest(payload: CreateLeaveRequestPayload) {
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachment' && value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'number') {
          formData.append(key, value.toString())
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await api.post<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async updateLeaveRequest(id: number, payload: UpdateLeaveRequestPayload) {
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachment' && value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'number') {
          formData.append(key, value.toString())
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await api.put<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async approveLeaveRequest(id: number, review_notes?: string) {
    const response = await api.post<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests/${id}/approve`, { review_notes })
    return response.data
  }

  async rejectLeaveRequest(id: number, review_notes?: string) {
    const response = await api.post<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests/${id}/reject`, { review_notes })
    return response.data
  }

  async cancelLeaveRequest(id: number, review_notes?: string) {
    const response = await api.post<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests/${id}/cancel`, { review_notes })
    return response.data
  }

  async getStatistics(params?: { year?: number }) {
    const response = await api.get<{ success: boolean; data: any }>(`${this.baseUrl}/statistics`, { params })
    return response.data
  }

  async adjustBalance(payload: { employee_id: number; leave_type_id: number; adjustment_days: number; reason: string }) {
    const response = await api.post<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/adjust-balance`, payload)
    return response.data
  }

  async recallLeaveRequest(id: number, recallReason: string, daysToRecall?: number) {
    const payload: Record<string, string | number> = { recall_reason: recallReason }
    if (daysToRecall !== undefined) {
      payload.days_to_recall = daysToRecall
    }
    const response = await api.post<{ success: boolean; data: { leave_request: LeaveRequest; recall_summary: { original_days: number; days_recalled: number; remaining_days: number } }; message: string }>(`${this.baseUrl}/requests/${id}/recall`, payload)
    return response.data
  }

  async getHandovers(params?: { status?: string; employee_id?: number; page?: number; per_page?: number }) {
    const response = await api.get<{ success: boolean; data: LeaveHandover[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }>(`${this.baseUrl}/handovers`, { params })
    return response.data
  }

  async getHandoversByLeaveRequest(leaveRequestId: number) {
    const response = await api.get<{ success: boolean; data: LeaveHandover[] }>(`${this.baseUrl}/handovers/leave-request/${leaveRequestId}`)
    return response.data
  }

  async createHandover(payload: CreateLeaveHandoverPayload) {
    const response = await api.post<{ success: boolean; data: LeaveHandover; message: string }>(`${this.baseUrl}/handovers`, payload)
    return response.data
  }

  async updateHandover(id: number, payload: Partial<CreateLeaveHandoverPayload>) {
    const response = await api.put<{ success: boolean; data: LeaveHandover; message: string }>(`${this.baseUrl}/handovers/${id}`, payload)
    return response.data
  }

  async deleteHandover(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(`${this.baseUrl}/handovers/${id}`)
    return response.data
  }
}

export const leaveService = new LeaveService()
