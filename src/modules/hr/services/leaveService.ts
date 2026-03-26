import api from '@/plugins/axios'
import type {
  CreateLeaveRequestPayload,
  CreateLeaveTypePayload,
  LeaveDashboardData,
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
    const response = await api.post<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests`, payload)
    return response.data
  }

  async updateLeaveRequest(id: number, payload: UpdateLeaveRequestPayload) {
    const response = await api.put<{ success: boolean; data: LeaveRequest; message: string }>(`${this.baseUrl}/requests/${id}`, payload)
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
}

export const leaveService = new LeaveService()
