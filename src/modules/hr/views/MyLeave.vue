<template>
  <div class="min-h-screen bg-white pb-10 font-inter text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div class="mx-auto max-w-[1480px] space-y-6 px-4 py-6 sm:px-6">
      <div class="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_38%),linear-gradient(135deg,_#ffffff,_#f8fafc)] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              <li class="text-slate-500 dark:text-slate-300">Self Service</li>
              <li><i class="mdi mdi-chevron-right text-xs"></i></li>
              <li class="text-slate-500 dark:text-slate-300">My Leave</li>
            </ol>
          </nav>
          <div>
            <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">My <span class="text-teal-500">Leave</span></h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Apply for leave, track your requests, and see your current leave position in one place.</p>
          </div>
          <div v-if="dashboard?.employee" class="flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
            <span class="rounded-full bg-white/80 px-3 py-2 shadow-sm dark:bg-slate-950/70">{{ dashboard.employee.name }}</span>
            <span class="rounded-full bg-white/80 px-3 py-2 shadow-sm dark:bg-slate-950/70">{{ dashboard.employee.employee_id }}</span>
            <span v-if="dashboard.employee.department" class="rounded-full bg-white/80 px-3 py-2 shadow-sm dark:bg-slate-950/70">{{ dashboard.employee.department }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button @click="showRequestForm = true" class="rounded-xl bg-slate-900 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white dark:bg-teal-500">
            Apply Leave
          </button>
        </div>
      </div>

      <div v-if="banner.message" :class="banner.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300'" class="rounded-2xl border px-5 py-4 text-sm font-semibold">
        {{ banner.message }}
      </div>

      <section v-if="dashboard?.employee" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Available Today</p>
          <p class="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ totalAvailableDays }}</p>
          <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Requestable balance across your active leave types.</p>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Used This Year</p>
          <p class="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ totalUsedDays }}</p>
          <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Approved leave already consumed this year.</p>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Pending Days</p>
          <p class="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ pendingDays }}</p>
          <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{{ pendingCount }} request(s) currently waiting for review.</p>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Advance In Use</p>
          <p class="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ advanceInUse }}</p>
          <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Days borrowed ahead of accrual on eligible leave types.</p>
        </article>
      </section>

      <section v-else class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">No employee profile found</h2>
        <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">This leave area needs your user account linked to an employee record before requests and balances can be shown.</p>
      </section>

      <div v-if="dashboard?.employee" class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">My Leave Balances</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300">Each leave type shows what you have earned, used, and can still request.</p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-200">{{ balances.length }} active types</span>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article v-for="balance in balances" :key="balance.leave_type_id" class="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ balance.name }}</p>
                  <p class="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{{ balance.available_days }}</p>
                  <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{{ balance.used_days }} used of {{ balance.allocated_days }}</p>
                </div>
                <div :class="['flex h-12 w-12 items-center justify-center rounded-2xl text-white', toneMap[balance.color] || toneMap.slate]">
                  <i :class="[balance.icon || 'mdi-calendar-outline', 'mdi text-xl']"></i>
                </div>
              </div>

              <div class="mt-5 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div :class="['h-2 rounded-full', toneMap[balance.color] || toneMap.slate]" :style="{ width: `${usagePercent(balance)}%` }"></div>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div class="rounded-2xl bg-white px-3 py-3 dark:bg-slate-900">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Earned</p>
                  <p class="mt-1 text-base font-black text-slate-900 dark:text-white">{{ balance.earned_days ?? balance.allocated_days }}</p>
                </div>
                <div class="rounded-2xl bg-white px-3 py-3 dark:bg-slate-900">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Can Request</p>
                  <p class="mt-1 text-base font-black text-slate-900 dark:text-white">{{ balance.requestable_days ?? balance.available_days }}</p>
                </div>
                <div class="rounded-2xl bg-white px-3 py-3 dark:bg-slate-900">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Pending</p>
                  <p class="mt-1 text-base font-black text-slate-900 dark:text-white">{{ balance.pending_days }}</p>
                </div>
                <div class="rounded-2xl bg-white px-3 py-3 dark:bg-slate-900">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Advance</p>
                  <p class="mt-1 text-base font-black text-slate-900 dark:text-white">{{ advanceForBalance(balance) }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="space-y-6">
          <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Request Status</h2>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">A quick read of how your applications are moving.</p>

            <div class="mt-5 space-y-3">
              <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
                <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Approved</span>
                <span class="text-base font-black text-emerald-600 dark:text-emerald-300">{{ approvedCount }}</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
                <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Rejected</span>
                <span class="text-base font-black text-rose-600 dark:text-rose-300">{{ rejectedCount }}</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
                <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">Cancelled</span>
                <span class="text-base font-black text-slate-700 dark:text-slate-200">{{ cancelledCount }}</span>
              </div>
            </div>
          </article>

          <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Important Notes</h2>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Rejected and cancelled requests show the manager note directly on the request card below.</p>
            <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950/60 dark:text-slate-300">
              <p v-if="annualBalance" class="mb-2">
                Annual leave accrues at <span class="font-black text-slate-900 dark:text-white">{{ annualBalance.code === 'ANNUAL' ? '1.75 days per month' : 'policy rate' }}</span>, and advance use is reflected in your balance cards.
              </p>
              <p class="mb-2">
                <span class="font-black text-purple-700 dark:text-purple-300">Special Leave</span> (7 days/year) requires an explanation for special circumstances such as compassionate leave or family emergencies.
              </p>
              <p>
                <span class="font-black text-orange-700 dark:text-orange-300">Compensatory Leave</span> is time off in lieu of overtime worked. Requires explanation of the work being compensated (e.g., project name, dates worked).
              </p>
              <p v-if="!annualBalance" class="mt-2">No annual leave balance is available yet.</p>
            </div>
          </article>
        </section>
      </div>

      <section v-if="dashboard?.employee" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">My Leave Requests</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300">Your latest applications, statuses, dates, and review reasons.</p>
          </div>
          <button @click="refreshData" class="rounded-xl border border-slate-200 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Refresh
          </button>
        </div>

        <div v-if="requests.length" class="space-y-3">
          <article v-for="request in requests" :key="request.id" class="rounded-2xl border border-slate-100 px-4 py-4 dark:border-slate-800">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p class="text-sm font-black text-slate-900 dark:text-white">{{ leaveTypeName(request) }}</p>
                <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ rangeLabel(request.start_date, request.end_date) }} - {{ request.days_requested }} day(s)</p>
                <p class="mt-2 text-sm text-slate-700 dark:text-slate-200">{{ request.reason }}</p>
                <p v-if="request.explanation" class="mt-2 rounded-2xl bg-purple-50 px-3 py-3 text-xs font-semibold text-purple-700 dark:bg-purple-950/30 dark:text-purple-200">
                  {{ request.leaveType?.code === 'SPECIAL' ? 'Explanation:' : 'Compensation details:' }} {{ request.explanation }}
                </p>
                <p v-if="request.review_notes && ['rejected', 'cancelled'].includes(request.status)" class="mt-3 rounded-2xl bg-rose-50 px-3 py-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                  {{ request.status === 'rejected' ? 'Rejected because:' : 'Cancelled because:' }} {{ request.review_notes }}
                </p>
              </div>
              <div class="flex flex-col items-start gap-2 lg:items-end">
                <span :class="statusClasses(request.status)">{{ request.status }}</span>
                <span class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{{ request.session.replace('_', ' ') }}</span>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          You have not submitted any leave requests yet.
        </div>
      </section>
    </div>

    <LeaveRequestModal
      :open="showRequestForm"
      :leave-types="leaveTypes"
      :balances="balances"
      :employees="employeeDirectory"
      :default-employee-id="(user as any)?.employee_id"
      :current-employee="dashboard?.employee || null"
      :submitting="loading"
      @close="showRequestForm = false"
      @submit="submitRequest"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import LeaveRequestModal from '../components/LeaveRequestModal.vue'
import { useLeave } from '../composables/useLeave'
import type { CreateLeaveRequestPayload, LeaveBalance, LeaveRequest } from '../types/leave'

const { user } = useAuth()
const { dashboard, leaveTypes, requests, loading, fetchDashboard, fetchLeaveTypes, fetchRequests, createRequest } = useLeave()

const showRequestForm = ref(false)
const banner = ref<{ type: 'success' | 'error'; message: string }>({ type: 'success', message: '' })
const year = new Date().getFullYear()
const toneMap: Record<string, string> = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', green: 'bg-green-500', rose: 'bg-rose-500', slate: 'bg-slate-500', purple: 'bg-purple-500', orange: 'bg-orange-500' }
const toNumber = (value: unknown) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(numericValue) ? numericValue : 0
}

const balances = computed(() => [...(dashboard.value?.balances || [])] as LeaveBalance[])
const employeeDirectory = computed(() => {
  if (dashboard.value?.contact_employees?.length) {
    return dashboard.value.contact_employees
  }

  if (dashboard.value?.employee) {
    return [dashboard.value.employee]
  }

  return []
})

const totalAvailableDays = computed(() => roundTotal(balances.value.reduce((sum, balance) => sum + toNumber(balance.requestable_days ?? balance.available_days), 0)))
const totalUsedDays = computed(() => roundTotal(balances.value.reduce((sum, balance) => sum + toNumber(balance.used_days), 0)))
const pendingDays = computed(() => roundTotal(requests.value.filter(request => request.status === 'pending').reduce((sum, request) => sum + toNumber(request.days_requested), 0)))
const pendingCount = computed(() => requests.value.filter(request => request.status === 'pending').length)
const approvedCount = computed(() => requests.value.filter(request => request.status === 'approved').length)
const rejectedCount = computed(() => requests.value.filter(request => request.status === 'rejected').length)
const cancelledCount = computed(() => requests.value.filter(request => request.status === 'cancelled').length)
const advanceInUse = computed(() => roundTotal(balances.value.reduce((sum, balance) => sum + Math.max(toNumber(balance.used_days) - toNumber(balance.earned_days ?? balance.used_days), 0), 0)))
const annualBalance = computed(() => balances.value.find(balance => balance.code === 'ANNUAL') || null)

const usagePercent = (balance: LeaveBalance) => {
  const allocated = toNumber(balance.allocated_days)
  return allocated ? Math.min(100, (toNumber(balance.used_days) / allocated) * 100) : 0
}
const advanceForBalance = (balance: LeaveBalance) => roundTotal(Math.max(toNumber(balance.used_days) - toNumber(balance.earned_days ?? balance.used_days), 0))
const roundTotal = (value: unknown) => Number(toNumber(value).toFixed(2))
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

const refreshData = async () => {
  await Promise.all([
    fetchDashboard({ year }),
    fetchLeaveTypes(),
    fetchRequests({ year, per_page: 50 }),
  ])
}

const submitRequest = async (payload: CreateLeaveRequestPayload) => {
  try {
    await createRequest(payload)
    setBanner('success', 'Leave request submitted successfully.')
    showRequestForm.value = false
    await refreshData()
  } catch (error: any) {
    setBanner('error', extractErrorMessage(error, 'Failed to submit leave request.'))
  }
}

onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
