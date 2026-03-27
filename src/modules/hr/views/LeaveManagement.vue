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
          <button @click="showCalendarModal = true" class="rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Calendar
          </button>
          <button v-if="canManagePolicies" @click="togglePolicyForm" class="rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {{ showPolicyForm ? 'Close Policy' : 'Manage Policies' }}
          </button>
        </div>
      </div>

      <div v-if="banner.message" :class="banner.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300'" class="fixed top-4 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border px-5 py-4 text-sm font-semibold shadow-lg">
        <div class="flex items-center justify-between gap-4">
          <span>{{ banner.message }}</span>
          <button @click="banner.message = ''" class="rounded-lg p-1 hover:bg-black/10 dark:hover:bg-white/10">
            <i class="mdi mdi-close text-lg"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="balance in balances" :key="balance.leave_type_id" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{{ balance.name }}</p>
              <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ balance.available_days }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {{ balance.used_days }} used of {{ balance.allocated_days }}
                <span v-if="balance.earned_days !== undefined"> | {{ balance.earned_days }} earned</span>
                <span v-if="balance.advance_available_days"> | {{ balance.advance_available_days }} advance</span>
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
                  <p v-if="request.review_notes && ['rejected', 'cancelled', 'recalled'].includes(request.status)" class="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">
                    {{ request.status === 'rejected' ? 'Rejection reason:' : request.status === 'cancelled' ? 'Cancellation reason:' : 'Recall reason:' }} {{ request.review_notes }}
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
                <option value="recalled">Recalled</option>
              </select>
              <button @click="refreshRequests" class="rounded-xl border border-slate-200 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">Refresh</button>
            </div>
          </div>
          <div v-if="requests.length" class="space-y-3">
            <article v-for="request in requests" :key="request.id" class="rounded-2xl border border-slate-100 px-4 py-4 dark:border-slate-800 cursor-pointer hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors" @click="openLeaveDetail(request)">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p class="text-sm font-black text-slate-900 dark:text-white">{{ request.employee?.name || dashboard?.employee?.name || 'Employee' }} - {{ leaveTypeName(request) }}</p>
                  <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ rangeLabel(request.start_date, request.end_date) }} - {{ request.days_requested }} day(s)</p>
                  <p v-if="request.explanation" class="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-300">
                    {{ request.leaveType?.code === 'SPECIAL' ? 'Explanation:' : 'Compensation details:' }} {{ request.explanation }}
                  </p>
                  <p v-if="request.review_notes && ['rejected', 'cancelled', 'recalled'].includes(request.status)" class="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">
                    {{ request.status === 'rejected' ? 'Rejection reason:' : request.status === 'cancelled' ? 'Cancellation reason:' : 'Recall reason:' }} {{ request.review_notes }}
                  </p>
                  <button 
                    v-if="request.attachment_path"
                    @click.stop="viewAttachment(request.attachment_path)"
                    class="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View attachment"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    View Attachment
                  </button>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span :class="statusClasses(request.status)">{{ request.status }}</span>
                  <select
                    v-if="canManageRequests && request.status !== 'recalled'"
                    v-model="statusDrafts[request.id]"
                    @click.stop
                    @change="handleStatusSelection(request)"
                    class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    v-if="canManageRequests && request.status === 'approved'"
                    @click.stop="openRecallModal(request)"
                    class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  >
                    Recall
                  </button>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">No requests match the current filters.</div>
          
          <!-- Pagination -->
          <div v-if="paginator.lastPage > 1" class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Showing {{ (paginator.currentPage - 1) * paginator.perPage + 1 }} to {{ Math.min(paginator.currentPage * paginator.perPage, paginator.total) }} of {{ paginator.total }} results
            </p>
            <div class="flex items-center gap-1">
              <button
                @click="goToPage(paginator.currentPage - 1)"
                :disabled="paginator.currentPage === 1"
                class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Previous
              </button>
              <template v-for="page in paginator.lastPage" :key="page">
                <button
                  v-if="page === 1 || page === paginator.lastPage || (page >= paginator.currentPage - 1 && page <= paginator.currentPage + 1)"
                  @click="goToPage(page)"
                  :class="[
                    'rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                    page === paginator.currentPage
                      ? 'bg-slate-900 text-white dark:bg-emerald-600'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else-if="page === paginator.currentPage - 2 || page === paginator.currentPage + 2" class="px-2 text-xs text-slate-400">...</span>
              </template>
              <button
                @click="goToPage(paginator.currentPage + 1)"
                :disabled="paginator.currentPage === paginator.lastPage"
                class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          </div>
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
      @submit-with-handover="submitRequestWithHandover"
    />

    <!-- Calendar Modal -->
    <div v-if="showCalendarModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
      <div class="w-full h-[95vh] max-w-screen-2xl mx-4 bg-white dark:bg-slate-900 shadow-2xl md:mx-auto md:rounded-3xl md:my-auto">
        <div class="flex h-full flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
            <div>
              <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Leave Calendar</h2>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">View all leave requests in a calendar format</p>
            </div>
            <button @click="showCalendarModal = false" class="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300">
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>
          
          <!-- Calendar Content -->
          <div class="flex-1 overflow-auto p-6">
            <LeaveCalendar :leaves="calendarLeaves" />
          </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showStatusReasonModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-2xl mx-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
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

    <!-- Recall Modal -->
    <div v-if="showRecallModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div class="w-full max-w-2xl mx-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recall Employee</p>
            <h2 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{{ recallForm.request_label || 'Leave request' }}</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Add a clear reason for recalling this employee from leave.
            </p>
          </div>
          <button @click="closeRecallModal()" class="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300">
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recall Type</p>
          <div class="mt-3 space-y-3">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="recallForm.recall_type"
                type="radio"
                value="full"
                class="h-4 w-4 text-amber-500 border-slate-300 focus:ring-amber-500"
              />
              <div>
                <p class="text-sm font-medium text-slate-900 dark:text-white">Full Recall</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">Recall employee for entire leave period ({{ recallForm.original_days }} days)</p>
              </div>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="recallForm.recall_type"
                type="radio"
                value="partial"
                class="h-4 w-4 text-amber-500 border-slate-300 focus:ring-amber-500"
              />
              <div>
                <p class="text-sm font-medium text-slate-900 dark:text-white">Partial Recall</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">Recall employee for specific days only</p>
              </div>
            </label>
          </div>
        </div>

        <div v-if="recallForm.recall_type === 'partial'" class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Days to Recall</p>
          <div class="mt-3">
            <input
              v-model.number="recallForm.days_to_recall"
              type="number"
              :min="1"
              :max="recallForm.original_days"
              placeholder="Number of days to recall"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <p class="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Employee will be recalled for {{ recallForm.days_to_recall || 0 }} day(s) out of {{ recallForm.original_days }} total days.
              {{ recallForm.days_to_recall ? `Remaining leave: ${recallForm.original_days - recallForm.days_to_recall} day(s)` : '' }}
            </p>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Reason</p>
          <textarea
            v-model="recallForm.recall_reason"
            rows="5"
            placeholder="Explain why this employee is being recalled from leave..."
            class="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          ></textarea>
          <p class="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
            {{ recallForm.recall_type === 'full' ? 'All leave days will be restored and this action will be recorded for audit purposes.' : `${recallForm.days_to_recall || 0} day(s) will be restored and this action will be recorded for audit purposes.` }}
          </p>
        </div>
        <div class="mt-6 flex items-center justify-end gap-3">
          <button @click="closeRecallModal()" class="rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Back
          </button>
          <button
            @click="submitRecallRequest"
            :disabled="!recallForm.recall_reason.trim() || (recallForm.recall_type === 'partial' && (!recallForm.days_to_recall || recallForm.days_to_recall < 1))"
            class="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Recall
          </button>
        </div>
      </div>
    </div>

    <!-- Document Viewer Modal -->
    <DocumentViewerModal
      :open="showDocumentViewer"
      :documents="viewerDocuments"
      @close="closeDocumentViewer"
    />

    <!-- Leave Detail Modal -->
    <LeaveDetailModal
      :open="showDetailModal"
      :request="selectedLeaveRequest"
      :handover="selectedLeaveHandover"
      @close="closeLeaveDetail"
    />
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useEmployees } from '../composables/useEmployees'
import LeaveCalendar from '../components/LeaveCalendar.vue'
import LeaveRequestModal from '../components/LeaveRequestModal.vue'
import LeaveDetailModal from '../components/LeaveDetailModal.vue'
import DocumentViewerModal from '../components/DocumentViewerModal.vue'
import { useLeave } from '../composables/useLeave'
import { leaveService } from '../services/leaveService'
import type { CreateLeaveHandoverPayload, CreateLeaveRequestPayload, LeaveBalance, LeaveRequest, LeaveType, LeaveHandover } from '../types/leave'

const { user } = useAuth()
const { employees, fetchEmployees } = useEmployees()
const { dashboard, leaveTypes, requests, loading, fetchDashboard, fetchLeaveTypes, fetchRequests, createRequest, createHandover, updateRequest, createPolicy, updatePolicy, deletePolicy, approveRequest, rejectRequest, recallRequest, requestMeta } = useLeave()

const showRequestForm = ref(false)
const showPolicyForm = ref(false)
const showCalendarModal = ref(false)
const showStatusReasonModal = ref(false)
const showRecallModal = ref(false)
const showDocumentViewer = ref(false)
const showDetailModal = ref(false)
const selectedLeaveRequest = ref<LeaveRequest | null>(null)
const selectedLeaveHandover = ref<LeaveHandover | null>(null)
const editingPolicyId = ref<number | null>(null)
const statusDrafts = ref<Record<number, LeaveRequest['status']>>({})
const viewerDocuments = ref<{ path: string; name: string }[]>([])
const statusReasonForm = ref({
  request_id: null as number | null,
  request_label: '',
  status: 'pending' as LeaveRequest['status'],
  original_status: 'pending' as LeaveRequest['status'],
  review_notes: '',
})
const recallForm = ref({
  request_id: null as number | null,
  request_label: '',
  recall_reason: '',
  recall_type: 'full' as 'full' | 'partial',
  original_days: 0,
  days_to_recall: 0,
})
const banner = ref<{ type: 'success' | 'error'; message: string }>({ type: 'success', message: '' })
const filters = ref({ search: '', status: '', year: new Date().getFullYear(), page: 1, per_page: 6 })
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
const statusClasses = (status: LeaveRequest['status']) => ['inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]', status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : status === 'rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : status === 'cancelled' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : status === 'recalled' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300']

const calendarLeaves = computed(() => {
  return requests.value
    .filter(request => ['approved', 'recalled'].includes(request.status))
    .map(request => ({
      id: request.id,
      employee_name: request.employee?.name || dashboard.value?.employee?.name || 'Employee',
      leave_type: leaveTypeName(request),
      status: request.status,
      start_date: request.start_date,
      end_date: request.end_date,
    }))
})

const paginator = computed(() => ({
  currentPage: requestMeta.value.current_page,
  lastPage: requestMeta.value.last_page,
  perPage: requestMeta.value.per_page,
  total: requestMeta.value.total,
}))

const goToPage = async (page: number) => {
  if (page < 1 || page > requestMeta.value.last_page) return
  filters.value.page = page
  await refreshRequests()
}

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
  await fetchRequests({ 
    search: filters.value.search || undefined, 
    status: filters.value.status || undefined, 
    year: filters.value.year,
    page: filters.value.page,
    per_page: filters.value.per_page
  })
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

const togglePolicyForm = () => {
  if (showPolicyForm.value) {
    showPolicyForm.value = false
    editingPolicyId.value = null
    policyForm.value = { name: '', code: '', days_per_year: 0, color: 'emerald', icon: 'mdi-calendar-check-outline', description: '', requires_attachment: false }
    return
  }

  editingPolicyId.value = null
  policyForm.value = { name: '', code: '', days_per_year: 0, color: 'emerald', icon: 'mdi-calendar-check-outline', description: '', requires_attachment: false }
  showPolicyForm.value = true
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

const submitRequestWithHandover = async (payload: CreateLeaveRequestPayload, handover: CreateLeaveHandoverPayload) => {
  try {
    // First create the leave request
    const response = await createRequest(payload)
    
    // Get the created leave request ID from response
    if (response?.data?.id) {
      // Now create the handover with the leave request ID
      await createHandover({
        ...handover,
        leave_request_id: response.data.id
      })
    }
    
    setBanner('success', 'Leave request with handover submitted successfully.')
    closeRequestModal()
    await refreshAll()
  } catch (error: any) {
    setBanner('error', extractErrorMessage(error, 'Failed to submit leave request with handover.'))
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
  } else if (status === 'approved') {
    await applyRequestStatus(request, status)
  }
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

const applyRequestStatus = async (request: LeaveRequest, status: LeaveRequest['status'], reviewNotes?: string) => {
  try {
    // Use the dedicated approve/reject endpoints for better error handling
    if (status === 'approved') {
      await approveRequest(request.id, reviewNotes)
    } else if (status === 'rejected') {
      await rejectRequest(request.id, reviewNotes)
    } else {
      await updateRequest(request.id, { status, review_notes: reviewNotes })
    }
    setBanner('success', 'Leave request status updated successfully.')
    await refreshAll()
  } catch (error: any) {
    statusDrafts.value[request.id] = request.status
    setBanner('error', extractErrorMessage(error, 'Failed to update leave request status.'))
  }
}

const openRecallModal = (request: LeaveRequest) => {
  recallForm.value = {
    request_id: request.id,
    request_label: `${request.employee?.name || dashboard.value?.employee?.name || 'Employee'} - ${leaveTypeName(request)}`,
    recall_reason: '',
    recall_type: 'full',
    original_days: request.days_requested,
    days_to_recall: 1,
  }
  showRecallModal.value = true
}

const closeRecallModal = () => {
  showRecallModal.value = false
  recallForm.value = {
    request_id: null as number | null,
    request_label: '',
    recall_reason: '',
    recall_type: 'full',
    original_days: 0,
    days_to_recall: 0,
  }
}

const submitRecallRequest = async () => {
  if (!recallForm.value.recall_reason.trim()) {
    return
  }

  if (recallForm.value.recall_type === 'partial' && (!recallForm.value.days_to_recall || recallForm.value.days_to_recall < 1 || recallForm.value.days_to_recall > recallForm.value.original_days)) {
    setBanner('error', 'Please specify a valid number of days to recall.')
    return
  }

  try {
    const daysToRecall = recallForm.value.recall_type === 'full' ? recallForm.value.original_days : recallForm.value.days_to_recall
    const remainingDays = recallForm.value.original_days - daysToRecall
    await recallRequest(recallForm.value.request_id!, recallForm.value.recall_reason.trim(), daysToRecall)
    
    // Show detailed message about the recall
    if (daysToRecall === recallForm.value.original_days) {
      setBanner('success', `Full leave recalled. All ${daysToRecall} day(s) have been restored to the leave balance.`)
    } else {
      setBanner('success', `${daysToRecall} day(s) recalled from leave. ${remainingDays} day(s) remaining on this request.`)
    }
    
    closeRecallModal()
    await refreshAll()
  } catch (error: any) {
    setBanner('error', extractErrorMessage(error, 'Failed to recall employee from leave.'))
  }
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

const viewAttachment = (attachmentPath: string) => {
  // Extract filename from path
  const fileName = attachmentPath.split('/').pop() || 'document'
  
  // Set up documents for the viewer
  viewerDocuments.value = [{
    path: attachmentPath,
    name: fileName
  }]
  
  // Open the document viewer
  showDocumentViewer.value = true
}

const closeDocumentViewer = () => {
  showDocumentViewer.value = false
  viewerDocuments.value = []
}

const openLeaveDetail = async (request: LeaveRequest) => {
  selectedLeaveRequest.value = request
  selectedLeaveHandover.value = null
  
  try {
    const response = await leaveService.getHandoversByLeaveRequest(request.id)
    
    if (response && response.data && response.data.length > 0) {
      selectedLeaveHandover.value = response.data[0]
    }
  } catch (error) {
    console.error('Failed to fetch handover:', error)
  }
  
  showDetailModal.value = true
}

const closeLeaveDetail = () => {
  showDetailModal.value = false
  selectedLeaveRequest.value = null
  selectedLeaveHandover.value = null
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

