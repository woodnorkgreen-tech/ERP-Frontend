<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-10 font-inter text-slate-900 dark:text-slate-100">
    <div class="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
      <div class="flex flex-col gap-4 border-b border-slate-100 pb-6 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <nav class="mb-2 flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              <li><router-link to="/hr" class="hover:text-blue-500 transition-colors">HR</router-link></li>
              <li><i class="mdi mdi-chevron-right text-xs"></i></li>
              <li class="text-slate-500 dark:text-slate-300">Leave Management</li>
            </ol>
          </nav>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Leave <span class="text-emerald-500">Desk</span></h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Balances, requests, approvals, and leave policies inside HR.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button @click="openRequestModal" class="rounded-xl bg-slate-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white dark:bg-emerald-600">
            Apply Leave
          </button>
          <button v-if="canManagePolicies" @click="showPolicyForm = !showPolicyForm" class="rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {{ editingPolicyId ? 'Close Policy' : 'Manage Policies' }}
          </button>
        </div>
      </div>

      <div v-if="banner.message" :class="banner.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300'" class="rounded-2xl border px-5 py-4 text-sm font-semibold">
        {{ banner.message }}
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="balance in balances" :key="balance.leave_type_id" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{{ balance.name }}</p>
              <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ balance.available_days }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {{ balance.used_days }} used of {{ balance.allocated_days }}
                <span v-if="balance.earned_days !== undefined"> · {{ balance.earned_days }} earned</span>
                <span v-if="balance.advance_available_days"> · {{ balance.advance_available_days }} advance</span>
              </p>
            </div>
            <div :class="['flex h-12 w-12 items-center justify-center rounded-2xl text-white', toneMap[balance.color] || toneMap.slate]">
              <i :class="[balance.icon || 'mdi-calendar-outline', 'mdi text-xl']"></i>
            </div>
          </div>
          <div class="mt-5 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div :class="['h-2 rounded-full', toneMap[balance.color] || toneMap.slate]" :style="{ width: `${usagePercent(balance)}%` }"></div>
          </div>
        </article>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Recent Requests</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300">Latest applications and reviews.</p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-200">{{ dashboard?.pending_requests_count || 0 }} pending</span>
          </div>
          <div v-if="dashboard?.recent_requests?.length" class="space-y-3">
            <article v-for="request in dashboard.recent_requests" :key="request.id" class="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950/60">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-black text-slate-900 dark:text-white">{{ request.employee?.name || dashboard?.employee?.name || 'Employee' }}</p>
                  <p class="text-xs text-slate-600 dark:text-slate-300">{{ leaveTypeName(request) }} - {{ request.days_requested }} day(s)</p>
                  <p v-if="request.explanation" class="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-300">
                    {{ request.leaveType?.code === 'SPECIAL' ? 'Explanation:' : 'Compensation details:' }} {{ request.explanation }}
                  </p>
                  <p v-if="request.review_notes && ['rejected', 'cancelled'].includes(request.status)" class="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">
                    {{ request.status === 'rejected' ? 'Rejection reason:' : 'Cancellation reason:' }} {{ request.review_notes }}
                  </p>
                </div>
                <span :class="statusClasses(request.status)">{{ request.status }}</span>
              </div>
              <p class="mt-2 text-xs text-slate-600 dark:text-slate-300">{{ rangeLabel(request.start_date, request.end_date) }}</p>
            </article>
          </div>
          <div v-else class="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">No leave activity yet.</div>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Team On Leave</h2>
          <p class="mb-5 text-sm text-slate-600 dark:text-slate-300">Approved leave currently active.</p>
          <div v-if="dashboard?.team_on_leave?.length" class="space-y-3">
            <article v-for="entry in dashboard.team_on_leave" :key="entry.id" class="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950/60">
              <p class="text-sm font-black text-slate-900 dark:text-white">{{ entry.employee_name }}</p>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ entry.position }} - {{ entry.leave_type }}</p>
              <p class="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">Back on {{ formatDate(entry.end_date) }}</p>
            </article>
          </div>
          <div v-else class="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">Nobody is currently away.</div>
        </section>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Request Registry</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300">Filter, review, and track request status.</p>
            </div>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input v-model="filters.search" type="text" placeholder="Search" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <select v-model="filters.status" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button @click="refreshRequests" class="rounded-xl border border-slate-200 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">Refresh</button>
            </div>
          </div>
          <div v-if="requests.length" class="space-y-3">
            <article v-for="request in requests" :key="request.id" class="rounded-2xl border border-slate-100 px-4 py-4 dark:border-slate-800">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p class="text-sm font-black text-slate-900 dark:text-white">{{ request.employee?.name || dashboard?.employee?.name || 'Employee' }} - {{ leaveTypeName(request) }}</p>
                  <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ rangeLabel(request.start_date, request.end_date) }} - {{ request.days_requested }} day(s)</p>
                  <p v-if="request.explanation" class="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-300">
                    {{ request.leaveType?.code === 'SPECIAL' ? 'Explanation:' : 'Compensation details:' }} {{ request.explanation }}
                  </p>
                  <p v-if="request.review_notes && ['rejected', 'cancelled'].includes(request.status)" class="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">
                    {{ request.status === 'rejected' ? 'Rejection reason:' : 'Cancellation reason:' }} {{ request.review_notes }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span :class="statusClasses(request.status)">{{ request.status }}</span>
                  <select
                    v-if="canManageRequests"
                    v-model="statusDrafts[request.id]"
                    @change="handleStatusSelection(request)"
                    class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">No requests match the current filters.</div>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Leave Policies</h2>
          <p class="mb-5 text-sm text-slate-600 dark:text-slate-300">Configured leave types and entitlement days.</p>
          <div class="space-y-3">
            <article v-for="policy in leaveTypes" :key="policy.id" class="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950/60">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-black text-slate-900 dark:text-white">{{ policy.name }}</p>
                  <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {{ policy.days_per_year }} days - {{ policy.code }}<span v-if="policy.monthly_accrual_rate"> - {{ policy.monthly_accrual_rate }} / month</span>
                  </p>
                </div>
                <button v-if="canManagePolicies" @click="editPolicy(policy)" class="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">Edit</button>
              </div>
            </article>
          </div>

          <div v-if="showPolicyForm && canManagePolicies" class="mt-5 space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <input v-model="policyForm.name" type="text" placeholder="Policy name" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input v-model="policyForm.code" type="text" placeholder="Code" class="rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              <input v-model.number="policyForm.days_per_year" type="number" min="0" max="366" placeholder="Days per year" class="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </div>
            <textarea v-model="policyForm.description" rows="3" placeholder="Description" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"></textarea>
            <div class="flex justify-between">
              <button v-if="editingPolicyId" @click="removePolicy" class="rounded-xl bg-rose-50 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">Delete</button>
              <button @click="submitPolicy" class="ml-auto rounded-xl bg-blue-600 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white">Save Policy</button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <LeaveRequestModal
      :open="showRequestForm"
      :leave-types="requestLeaveTypes"
      :balances="balances"
      :employees="employeeDirectory"
      :can-select-employee="canManageRequests"
      :default-employee-id="(user as any)?.employee_id"
      :current-employee="dashboard?.employee || null"
      :submitting="loading"
      @close="closeRequestModal"
      @submit="submitRequest"
    />

    <div v-if="showStatusReasonModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ statusReasonForm.status === 'rejected' ? 'Reject Leave' : 'Cancel Leave' }}</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ statusReasonForm.request_label || 'Leave request' }}</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {{ statusReasonForm.status === 'rejected' ? 'Add a clear reason for rejecting this leave request.' : 'Add a clear reason for cancelling this leave request.' }}
            </p>
          </div>
          <button @click="closeStatusReasonModal()" class="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300">
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Reason</p>
          <textarea
            v-model="statusReasonForm.review_notes"
            rows="5"
            :placeholder="statusReasonForm.status === 'rejected' ? 'Explain why this request is being rejected...' : 'Explain why this request is being cancelled...'"
            class="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          ></textarea>
          <p class="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">The employee will see this note on their leave request.</p>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3">
          <button @click="closeStatusReasonModal()" class="rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Back
          </button>
          <button
            @click="submitStatusReason"
            :disabled="!statusReasonForm.review_notes.trim()"
            :class="statusReasonForm.status === 'rejected' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-500 hover:bg-amber-600'"
            class="rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ statusReasonForm.status === 'rejected' ? 'Confirm Rejection' : 'Confirm Cancellation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useEmployees } from '../composables/useEmployees'
import LeaveRequestModal from '../components/LeaveRequestModal.vue'
import { useLeave } from '../composables/useLeave'
import type { CreateLeaveRequestPayload, LeaveBalance, LeaveRequest, LeaveType } from '../types/leave'

const { user } = useAuth()
const { employees, fetchEmployees } = useEmployees()
const { dashboard, leaveTypes, requests, loading, fetchDashboard, fetchLeaveTypes, fetchRequests, createRequest, updateRequest, createPolicy, updatePolicy, deletePolicy } = useLeave()

const showRequestForm = ref(false)
const showPolicyForm = ref(false)
const showStatusReasonModal = ref(false)
const editingPolicyId = ref<number | null>(null)
const statusDrafts = ref<Record<number, LeaveRequest['status']>>({})
const statusReasonForm = ref({
  request_id: null as number | null,
  request_label: '',
  status: 'pending' as LeaveRequest['status'],
  original_status: 'pending' as LeaveRequest['status'],
  review_notes: '',
})
const banner = ref<{ type: 'success' | 'error'; message: string }>({ type: 'success', message: '' })
const filters = ref({ search: '', status: '', year: new Date().getFullYear() })
const policyForm = ref({ name: '', code: '', days_per_year: 0, color: 'emerald', icon: 'mdi-calendar-check-outline', description: '', requires_attachment: false })

const toneMap: Record<string, string> = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', green: 'bg-green-500', rose: 'bg-rose-500', slate: 'bg-slate-500', purple: 'bg-purple-500', orange: 'bg-orange-500' }
const userRoles = computed(() => user.value?.roles || [])
const canManageRequests = computed(() => userRoles.value.some(role => ['Super Admin', 'Admin', 'HR', 'Manager', 'Lead'].includes(role)))
const canManagePolicies = computed(() => userRoles.value.some(role => ['Super Admin', 'Admin', 'HR'].includes(role)))
const balances = computed(() => [...(dashboard.value?.balances || [])] as LeaveBalance[])
const requestLeaveTypes = computed(() => leaveTypes.value)
const employeeDirectory = computed(() => {
  if (employees.value.length) {
    return employees.value
  }

  if (dashboard.value?.contact_employees?.length) {
    return dashboard.value.contact_employees
  }

  if (dashboard.value?.employee) {
    const [firstName = '', ...rest] = dashboard.value.employee.name.split(' ')

    return [{
      id: dashboard.value.employee.id,
      employee_id: dashboard.value.employee.employee_id,
      first_name: firstName,
      last_name: rest.join(' '),
      name: dashboard.value.employee.name,
      position: dashboard.value.employee.position,
    }]
  }

  return []
})

const usagePercent = (balance: LeaveBalance) => (balance.allocated_days ? Math.min(100, (balance.used_days / balance.allocated_days) * 100) : 0)
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
const rangeLabel = (start: string, end: string) => `${formatDate(start)} to ${formatDate(end)}`
const leaveTypeName = (request: LeaveRequest) => request.leaveType?.name || request.leave_type?.name || 'Leave'
const statusClasses = (status: LeaveRequest['status']) => ['inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]', status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : status === 'rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : status === 'cancelled' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300']

const setBanner = (type: 'success' | 'error', message: string) => {
  banner.value = { type, message }
  window.setTimeout(() => {
    if (banner.value.message === message) banner.value.message = ''
  }, 5000)
}

const extractErrorMessage = (error: any, fallback: string) => {
  const responseData = error?.response?.data
  const firstValidationError = responseData?.errors
    ? Object.values(responseData.errors).flat().find(Boolean)
    : null

  return firstValidationError || responseData?.message || fallback
}

const refreshRequests = async () => {
  await fetchRequests({ search: filters.value.search || undefined, status: filters.value.status || undefined, year: filters.value.year })
  syncStatusDrafts()
}

const refreshAll = async () => {
  await Promise.all([
    fetchDashboard({ year: filters.value.year }),
    fetchLeaveTypes(),
    refreshRequests(),
    fetchEmployees().catch(() => []),
  ])
}

const syncStatusDrafts = () => {
  statusDrafts.value = Object.fromEntries(
    requests.value.map(request => [request.id, request.status])
  ) as Record<number, LeaveRequest['status']>
}

const openRequestModal = () => {
  showRequestForm.value = true
}

const closeRequestModal = () => {
  showRequestForm.value = false
}

const submitRequest = async (payload: CreateLeaveRequestPayload) => {
  try {
    await createRequest(payload)
    setBanner('success', 'Leave request submitted successfully.')
    closeRequestModal()
    await refreshAll()
  } catch (error: any) {
    setBanner('error', extractErrorMessage(error, 'Failed to submit leave request.'))
  }
}

const closeStatusReasonModal = (revert = true) => {
  if (revert && statusReasonForm.value.request_id !== null) {
    statusDrafts.value[statusReasonForm.value.request_id] = statusReasonForm.value.original_status
  }

  showStatusReasonModal.value = false
  statusReasonForm.value = {
    request_id: null,
    request_label: '',
    status: 'pending',
    original_status: 'pending',
    review_notes: '',
  }
}

const applyRequestStatus = async (request: LeaveRequest, status: LeaveRequest['status'], reviewNotes?: string) => {
  try {
    await updateRequest(request.id, { status, review_notes: reviewNotes })
    setBanner('success', 'Leave request status updated successfully.')
    await refreshAll()
  } catch (error: any) {
    statusDrafts.value[request.id] = request.status
    setBanner('error', extractErrorMessage(error, 'Failed to update leave request status.'))
  }
}

const handleStatusSelection = async (request: LeaveRequest) => {
  const status = statusDrafts.value[request.id] || request.status
  if (status === request.status) return

  if (status === 'rejected' || status === 'cancelled') {
    statusReasonForm.value = {
      request_id: request.id,
      request_label: `${request.employee?.name || dashboard.value?.employee?.name || 'Employee'} - ${leaveTypeName(request)}`,
      status,
      original_status: request.status,
      review_notes: request.review_notes || '',
    }
    showStatusReasonModal.value = true
    return
  }

  await applyRequestStatus(request, status)
}

const submitStatusReason = async () => {
  if (statusReasonForm.value.request_id === null) return

  const request = requests.value.find(entry => entry.id === statusReasonForm.value.request_id)
  const reviewNotes = statusReasonForm.value.review_notes.trim()

  if (!request) {
    closeStatusReasonModal()
    return
  }

  if (!reviewNotes) {
    setBanner('error', 'A reason is required before this status can be saved.')
    return
  }

  showStatusReasonModal.value = false
  await applyRequestStatus(request, statusReasonForm.value.status, reviewNotes)
  closeStatusReasonModal(false)
}

const editPolicy = (policy: LeaveType) => {
  editingPolicyId.value = policy.id
  policyForm.value = { name: policy.name, code: policy.code, days_per_year: policy.days_per_year, color: policy.color, icon: policy.icon || 'mdi-calendar-check-outline', description: policy.description || '', requires_attachment: policy.requires_attachment }
  showPolicyForm.value = true
}

const submitPolicy = async () => {
  try {
    if (editingPolicyId.value) {
      await updatePolicy(editingPolicyId.value, policyForm.value)
      setBanner('success', 'Leave policy updated successfully.')
    } else {
      await createPolicy(policyForm.value)
      setBanner('success', 'Leave policy created successfully.')
    }
    editingPolicyId.value = null
    showPolicyForm.value = false
    policyForm.value = { name: '', code: '', days_per_year: 0, color: 'emerald', icon: 'mdi-calendar-check-outline', description: '', requires_attachment: false }
    await refreshAll()
  } catch (error: any) {
    setBanner('error', extractErrorMessage(error, 'Failed to save leave policy.'))
  }
}

const removePolicy = async () => {
  if (!editingPolicyId.value || !confirm('Delete this leave policy?')) return
  try {
    await deletePolicy(editingPolicyId.value)
    setBanner('success', 'Leave policy deleted successfully.')
    editingPolicyId.value = null
    showPolicyForm.value = false
    await refreshAll()
  } catch (error: any) {
    setBanner('error', extractErrorMessage(error, 'Failed to delete leave policy.'))
  }
}

onMounted(async () => {
  await refreshAll()
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
