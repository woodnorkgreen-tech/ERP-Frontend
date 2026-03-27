import { readonly, ref } from 'vue'
import { leaveService } from '../services/leaveService'
import type {
  CreateLeaveRequestPayload,
  CreateLeaveHandoverPayload,
  CreateLeaveTypePayload,
  LeaveDashboardData,
  LeaveRequest,
  LeaveRequestFilters,
  LeaveType,
  UpdateLeaveRequestPayload,
  UpdateLeaveTypePayload,
} from '../types/leave'

export function useLeave() {
  const dashboard = ref<LeaveDashboardData | null>(null)
  const leaveTypes = ref<LeaveType[]>([])
  const requests = ref<LeaveRequest[]>([])
  const statistics = ref<any>(null)
  const loading = ref(false)
  const requestMeta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  })
  const error = ref<string | null>(null)

  const withState = async <T>(action: () => Promise<T>) => {
    loading.value = true
    error.value = null

    try {
      return await action()
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || 'Leave operation failed.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDashboard = async (params?: { employee_id?: number; year?: number }) =>
    withState(async () => {
      const response = await leaveService.getDashboard(params)
      dashboard.value = response.data
      return response.data
    })

  const fetchLeaveTypes = async (params?: { include_inactive?: boolean }) =>
    withState(async () => {
      const response = await leaveService.getLeaveTypes(params)
      leaveTypes.value = response.data
      return response.data
    })

  const fetchRequests = async (filters?: LeaveRequestFilters) =>
    withState(async () => {
      const response = await leaveService.getLeaveRequests(filters)
      requests.value = response.data
      requestMeta.value = response.meta
      return response
    })

  const createRequest = async (payload: CreateLeaveRequestPayload) =>
    withState(async () => leaveService.createLeaveRequest(payload))

  const updateRequest = async (id: number, payload: UpdateLeaveRequestPayload) =>
    withState(async () => leaveService.updateLeaveRequest(id, payload))

  const approveRequest = async (id: number, reviewNotes?: string) =>
    withState(async () => leaveService.approveLeaveRequest(id, reviewNotes))

  const rejectRequest = async (id: number, reviewNotes?: string) =>
    withState(async () => leaveService.rejectLeaveRequest(id, reviewNotes))

  const cancelRequest = async (id: number, reviewNotes?: string) =>
    withState(async () => leaveService.cancelLeaveRequest(id, reviewNotes))

  const recallRequest = async (id: number, recallReason: string, daysToRecall?: number) =>
    withState(async () => leaveService.recallLeaveRequest(id, recallReason, daysToRecall))

  const fetchStatistics = async (params?: { year?: number }) =>
    withState(async () => {
      const response = await leaveService.getStatistics(params)
      statistics.value = response.data
      return response.data
    })

  const adjustBalance = async (payload: { employee_id: number; leave_type_id: number; adjustment_days: number; reason: string }) =>
    withState(async () => leaveService.adjustBalance(payload))

  const createPolicy = async (payload: CreateLeaveTypePayload) =>
    withState(async () => leaveService.createLeaveType(payload))

  const updatePolicy = async (id: number, payload: UpdateLeaveTypePayload) =>
    withState(async () => leaveService.updateLeaveType(id, payload))

  const deletePolicy = async (id: number) =>
    withState(async () => leaveService.deleteLeaveType(id))

  const fetchHandovers = async (params?: { status?: string; employee_id?: number; page?: number; per_page?: number }) =>
    withState(async () => leaveService.getHandovers(params))

  const createHandover = async (payload: CreateLeaveHandoverPayload) =>
    withState(async () => leaveService.createHandover(payload))

  const updateHandover = async (id: number, payload: Partial<CreateLeaveHandoverPayload>) =>
    withState(async () => leaveService.updateHandover(id, payload))

  const deleteHandover = async (id: number) =>
    withState(async () => leaveService.deleteHandover(id))

  return {
    dashboard: readonly(dashboard),
    leaveTypes: readonly(leaveTypes),
    requests: readonly(requests),
    statistics: readonly(statistics),
    requestMeta: readonly(requestMeta),
    loading: readonly(loading),
    error: readonly(error),
    fetchDashboard,
    fetchLeaveTypes,
    fetchRequests,
    fetchStatistics,
    adjustBalance,
    createRequest,
    updateRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    recallRequest,
    createPolicy,
    updatePolicy,
    deletePolicy,
    fetchHandovers,
    createHandover,
    updateHandover,
    deleteHandover,
  }
}
