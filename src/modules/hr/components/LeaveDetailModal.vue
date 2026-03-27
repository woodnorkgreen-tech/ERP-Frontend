<template>
  <div v-if="open" class="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
    <div class="shrink-0 border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 md:px-8 md:py-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <span :class="statusBadgeClass">{{ request?.status }}</span>
            <span v-if="request?.session" class="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {{ request.session.replace('_', ' ') }}
            </span>
          </div>
          <h2 class="mt-3 text-xl font-black tracking-tight text-slate-900 dark:text-white">{{ leaveTypeName }} Leave Request</h2>
          <p class="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">Request #{{ request?.id }}</p>
        </div>
        <button @click="emit('close')" class="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300">
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="grid h-full grid-cols-1 gap-6 p-6 md:grid-cols-2 md:px-8 md:py-6">
        <div class="space-y-6 overflow-y-auto pr-2">
          <section>
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Employee Information</h3>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Name</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ employeeName }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Employee ID</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ employeeId }}</p>
                </div>
                <div v-if="employeeDepartment">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Department</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ employeeDepartment }}</p>
                </div>
                <div v-if="employeePosition">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Position</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ employeePosition }}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Leave Details</h3>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Leave Type</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ leaveTypeName }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Days Requested</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ request?.days_requested }} day(s)</p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Start Date</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDate(request?.start_date) }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">End Date</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDate(request?.end_date) }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Return Date</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ returnDate }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Session</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ sessionLabel }}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Reason & Explanation</h3>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div v-if="request?.reason" class="mb-4">
                <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Reason</p>
                <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ request.reason }}</p>
              </div>
              <div v-if="request?.explanation" class="rounded-xl bg-purple-50 p-3 dark:bg-purple-950/30">
                <p class="text-[10px] font-black uppercase tracking-[0.18em] text-purple-600 dark:text-purple-400">
                  {{ request.leaveType?.code === 'SPECIAL' ? 'Explanation' : 'Compensation Details' }}
                </p>
                <p class="mt-1 text-sm font-semibold text-purple-700 dark:text-purple-200">{{ request.explanation }}</p>
              </div>
              <div v-if="!request?.reason && !request?.explanation" class="text-sm text-slate-500 dark:text-slate-400">
                No reason or explanation provided.
              </div>
            </div>
          </section>

          <section v-if="contactEmployeeName">
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Contact During Leave</h3>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <i class="mdi mdi-account text-lg"></i>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ contactEmployeeName }}</p>
                  <p v-if="contactEmployeePosition" class="text-xs text-slate-500 dark:text-slate-400">{{ contactEmployeePosition }}</p>
                </div>
              </div>
            </div>
          </section>

          <section v-if="request?.review_notes">
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {{ request.status === 'rejected' ? 'Rejection' : request.status === 'cancelled' ? 'Cancellation' : request.status === 'recalled' ? 'Recall' : 'Review' }} Notes
            </h3>
            <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
              <p class="text-sm text-rose-700 dark:text-rose-200">{{ request.review_notes }}</p>
            </div>
          </section>
        </div>

        <div class="space-y-6 overflow-y-auto pr-2">
          <section v-if="handover">
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Handover Details</h3>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div v-if="handover.project_name">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Project Name</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ handover.project_name }}</p>
                </div>
                <div v-if="handover.department">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Department</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ handover.department }}</p>
                </div>
                <div v-if="handover.current_status" class="md:col-span-2">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current Status</p>
                  <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ handover.current_status }}</p>
                </div>
                <div v-if="handover.task_description" class="md:col-span-2">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Task Description</p>
                  <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ handover.task_description }}</p>
                </div>
                <div v-if="handover.pending_actions" class="md:col-span-2">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pending Actions</p>
                  <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ handover.pending_actions }}</p>
                </div>
                <div v-if="handover.handedOverTo">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Handover To</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ handover.handedOverTo.name }}</p>
                </div>
                <div v-if="handover.follow_up_deadline">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Follow-Up Deadline</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDate(handover.follow_up_deadline) }}</p>
                </div>
                <div v-if="handover.update_during_leave" class="md:col-span-2">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Update During Leave</p>
                  <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">{{ handover.update_during_leave }}</p>
                </div>
              </div>
            </div>
          </section>

          <section v-else>
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Handover Details</h3>
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <i class="mdi mdi-clipboard-outline text-lg"></i>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">No Handover Information</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500">No handover was submitted for this leave request.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Approval History</h3>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div v-if="request?.approved_by && request?.approver">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Approved By</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ request.approver.name }}</p>
                </div>
                <div v-if="request?.approved_at">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Approved At</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDateTime(request.approved_at) }}</p>
                </div>
                <div v-if="request?.cancelled_at">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Cancelled At</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDateTime(request.cancelled_at) }}</p>
                </div>
                <div v-if="request?.recalled_at">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recalled At</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ formatDateTime(request.recalled_at) }}</p>
                </div>
                <div v-if="request?.recall_reason">
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Recall Reason</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{{ request.recall_reason }}</p>
                </div>
                <div v-if="!request?.approved_by && !request?.approved_at && !request?.cancelled_at && !request?.recalled_at">
                  <p class="text-sm text-slate-500 dark:text-slate-400">No approval history available yet. Request is pending review.</p>
                </div>
              </div>
            </div>
          </section>

          <section v-if="request?.attachment_path">
            <h3 class="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Attachment</h3>
            <button
              @click="viewAttachment"
              class="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-900"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <i class="mdi mdi-file-document text-xl"></i>
              </div>
              <div class="text-left">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">View Attachment</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Click to view the uploaded document</p>
              </div>
              <i class="mdi mdi-chevron-right ml-auto text-xl text-slate-400"></i>
            </button>
          </section>
        </div>
      </div>
    </div>

    <div class="shrink-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:px-8">
      <button
        @click="emit('close')"
        class="rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300"
      >
        Close
      </button>
      <slot name="actions"></slot>
    </div>
  </div>

  <DocumentViewerModal :open="showDocumentViewer" :documents="viewerDocuments" @close="closeDocumentViewer" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LeaveHandover, LeaveRequest } from '../types/leave'
import DocumentViewerModal from './DocumentViewerModal.vue'

const props = defineProps<{
  open: boolean
  request: LeaveRequest | null
  handover?: LeaveHandover | null
}>()

const emit = defineEmits<{
  close: []
}>()

const showDocumentViewer = ref(false)
const viewerDocuments = ref<{ path: string; name: string }[]>([])

const employeeName = computed(() => props.request?.employee?.name || 'N/A')
const employeeId = computed(() => props.request?.employee?.employee_id || 'N/A')
const employeeDepartment = computed(() => {
  const department = props.request?.employee?.department
  if (!department) return ''
  return typeof department === 'string' ? department : department.name
})
const employeePosition = computed(() => props.request?.employee?.position || '')
const leaveTypeName = computed(() => props.request?.leaveType?.name || props.request?.leave_type?.name || 'Leave')
const contactEmployeeName = computed(() => props.request?.contactEmployee?.name || '')
const contactEmployeePosition = computed(() => props.request?.contactEmployee?.position || '')
const handover = computed(() => props.handover || null)

const sessionLabel = computed(() => {
  const session = props.request?.session
  if (session === 'full_day') return 'Full Day'
  if (session === 'first_half') return 'First Half'
  if (session === 'second_half') return 'Second Half'
  return session || 'N/A'
})

const statusBadgeClass = computed(() => {
  const status = props.request?.status
  const base = 'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]'
  if (status === 'approved') return `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`
  if (status === 'rejected') return `${base} bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`
  if (status === 'cancelled') return `${base} bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`
  if (status === 'recalled') return `${base} bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`
  return `${base} bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`
})

const returnDate = computed(() => {
  if (!props.request?.end_date) return 'N/A'
  const returnDateValue = new Date(props.request.end_date)
  do {
    returnDateValue.setDate(returnDateValue.getDate() + 1)
  } while (returnDateValue.getDay() === 0 || returnDateValue.getDay() === 6)
  return returnDateValue.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-KE', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const viewAttachment = () => {
  if (!props.request?.attachment_path) return

  const fileName = props.request.attachment_path.split('/').pop() || 'document'
  viewerDocuments.value = [{ path: props.request.attachment_path, name: fileName }]
  showDocumentViewer.value = true
}

const closeDocumentViewer = () => {
  showDocumentViewer.value = false
  viewerDocuments.value = []
}
</script>
