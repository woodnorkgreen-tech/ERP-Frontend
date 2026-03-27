<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
    <div class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div class="shrink-0 px-6 pt-6 md:px-8 md:pt-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">{{ currentStep === 1 ? 'Leave Request Form' : 'Leave Handover Details' }}</h2>
            <p class="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {{ currentStep === 1 ? 'Fill in the details below. Your manager will be notified.' : 'Provide handover information for your responsibilities during leave.' }}
            </p>
          </div>
          <button @click="emit('close')" class="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300">
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="mt-4 flex items-center justify-center gap-2">
          <div :class="step1Class">1</div>
          <div :class="stepConnectorClass"></div>
          <div :class="step2Class">2</div>
        </div>
      </div>

      <div v-if="currentStep === 1" class="flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
        <div v-if="canSelectEmployee" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Employee</label>
          <div class="relative">
            <input
              v-model="employeeSearch"
              type="text"
              placeholder="Type employee name or number"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              @focus="showEmployeeSuggestions = true"
              @blur="hideEmployeeSuggestions"
              @input="handleEmployeeSearchInput"
            />
            <div v-if="showEmployeeSuggestions" class="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
              <button
                v-for="employee in filteredEmployeeOptions"
                :key="employee.id"
                type="button"
                class="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                @mousedown.prevent="selectEmployee(employee)"
              >
                <span>
                  <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">{{ employeeLabel(employee) }}</span>
                  <span class="mt-1 block text-xs text-slate-500 dark:text-slate-400">{{ employeeMeta(employee) }}</span>
                </span>
              </button>
              <div v-if="!filteredEmployeeOptions.length" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No employees found.</div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Leave Type</label>
          <select v-model.number="requestForm.leave_type_id" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option :value="0">Select leave type</option>
            <option v-for="type in leaveTypes" :key="type.id" :value="type.id">
              {{ type.name }} - {{ type.days_per_year }} days{{ type.monthly_accrual_rate ? ` (${type.monthly_accrual_rate}/month)` : '' }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">From Date</label>
            <input v-model="requestForm.start_date" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">To Date</label>
            <input v-model="requestForm.end_date" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 md:grid-cols-2">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current Balance</p>
            <p class="mt-2 text-lg font-black text-slate-900 dark:text-white">{{ selectedLeaveBalanceLabel }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Requested Days</p>
            <p class="mt-2 text-lg font-black text-slate-900 dark:text-white">{{ requestedDaysLabel }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Balance After Request</p>
            <p class="mt-2 text-lg font-black text-slate-900 dark:text-white">{{ projectedBalanceLabel }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Return Date</p>
            <p class="mt-2 text-lg font-black text-slate-900 dark:text-white">{{ returnDateLabel }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Session</label>
          <select v-model="requestForm.session" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option value="full_day">Full day</option>
            <option value="first_half">First half</option>
            <option value="second_half">Second half</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Reason</label>
          <textarea
            v-model="requestForm.reason"
            rows="4"
            placeholder="Brief reason for your leave request..."
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          ></textarea>
        </div>

        <div v-if="showExplanationField" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">{{ explanationLabel }}</label>
          <textarea
            v-model="requestForm.explanation"
            rows="3"
            :placeholder="explanationPlaceholder"
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          ></textarea>
        </div>

        <div v-if="showAttachmentField" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
            Attachment <span class="text-rose-500">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            @change="handleFileUpload"
          />
          <p class="text-xs text-slate-500 dark:text-slate-400">PDF, DOC, DOCX, JPG, PNG (max 2MB)</p>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Contact During Leave (optional)</label>
          <div class="relative">
            <input
              v-model="contactEmployeeSearch"
              type="text"
              placeholder="Type employee name or number"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              @focus="showContactSuggestions = true"
              @blur="hideContactSuggestions"
              @input="handleContactSearchInput"
            />
            <div v-if="showContactSuggestions" class="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
              <button
                v-for="employee in filteredContactEmployeeOptions"
                :key="employee.id"
                type="button"
                class="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                @mousedown.prevent="selectContactEmployee(employee)"
              >
                <span>
                  <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">{{ employeeLabel(employee) }}</span>
                  <span class="mt-1 block text-xs text-slate-500 dark:text-slate-400">{{ employeeMeta(employee) }}</span>
                </span>
              </button>
              <div v-if="!filteredContactEmployeeOptions.length" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No employees found.</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 1" class="mt-1 flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:px-8">
        <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{ requestDuration }}</p>
        <button
          @click="goToStep2"
          :disabled="!canProceedToStep2"
          class="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next: Handover
          <i class="mdi mdi-arrow-right text-base"></i>
        </button>
      </div>

      <div v-if="currentStep === 2" class="flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Leave Summary</p>
          <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{{ selectedLeaveType?.name || 'Leave' }} - {{ requestDuration }}</p>
          <p class="text-xs text-slate-600 dark:text-slate-300">{{ requestForm.start_date }} to {{ requestForm.end_date }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Project Name</label>
          <input
            v-model="handoverForm.project_name"
            type="text"
            placeholder="Enter project name"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Task Description</label>
          <textarea
            v-model="handoverForm.task_description"
            rows="3"
            placeholder="Describe the tasks that need to be handled during your leave..."
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Current Status</label>
          <input
            v-model="handoverForm.current_status"
            type="text"
            placeholder="e.g., In Progress, Pending Review, On Hold"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Pending Actions</label>
          <textarea
            v-model="handoverForm.pending_actions"
            rows="3"
            placeholder="List any pending actions that need attention..."
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Handover To (Name)</label>
            <div class="relative">
              <input
                v-model="handoverToSearch"
                type="text"
                placeholder="Search employee to handover to"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                @focus="showHandoverToSuggestions = true"
                @blur="hideHandoverToSuggestions"
              />
              <div v-if="showHandoverToSuggestions" class="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
                <button
                  v-for="employee in filteredHandoverToOptions"
                  :key="employee.id"
                  type="button"
                  class="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                  @mousedown.prevent="selectHandoverTo(employee)"
                >
                  <span class="block text-sm font-semibold text-slate-800 dark:text-slate-100">{{ employeeLabel(employee) }}</span>
                </button>
                <div v-if="!filteredHandoverToOptions.length" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No employees found.</div>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Department</label>
            <input
              v-model="handoverForm.department"
              type="text"
              placeholder="Enter department"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Follow-Up Deadline</label>
          <input
            v-model="handoverForm.follow_up_deadline"
            type="date"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Update During Leave</label>
          <textarea
            v-model="handoverForm.update_during_leave"
            rows="2"
            placeholder="How should updates be handled during your leave?"
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          ></textarea>
        </div>
      </div>

      <div v-if="currentStep === 2" class="mt-1 flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:px-8">
        <button
          @click="goToStep1"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:text-slate-300"
        >
          <i class="mdi mdi-arrow-left text-base"></i>
          Back
        </button>
        <button
          @click="submitWithHandover"
          :disabled="submitting"
          class="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="mdi mdi-send-outline text-base"></i>
          Submit Request
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Employee } from '../types/employee'
import type {
  CreateLeaveHandoverPayload,
  CreateLeaveRequestPayload,
  LeaveBalance,
  LeaveContactEmployee,
  LeaveDashboardEmployee,
  LeaveRequestEmployee,
  LeaveType,
} from '../types/leave'

type EmployeeOption = Employee | LeaveRequestEmployee | LeaveContactEmployee | LeaveDashboardEmployee

const props = defineProps<{
  open: boolean
  leaveTypes: readonly LeaveType[]
  balances: readonly LeaveBalance[]
  employees: readonly EmployeeOption[]
  canSelectEmployee?: boolean
  defaultEmployeeId?: number
  currentEmployee?: LeaveDashboardEmployee | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: CreateLeaveRequestPayload]
  submitWithHandover: [payload: CreateLeaveRequestPayload, handover: CreateLeaveHandoverPayload]
}>()

const requestForm = ref<CreateLeaveRequestPayload>({
  employee_id: undefined,
  contact_employee_id: undefined,
  leave_type_id: 0,
  start_date: '',
  end_date: '',
  session: 'full_day',
  reason: '',
  explanation: '',
  handover_notes: '',
  attachment: undefined,
})

const attachmentFile = ref<File | null>(null)
const employeeSearch = ref('')
const contactEmployeeSearch = ref('')
const showEmployeeSuggestions = ref(false)
const showContactSuggestions = ref(false)
const currentStep = ref(1)

const handoverForm = ref({
  project_name: '',
  task_description: '',
  current_status: '',
  pending_actions: '',
  handed_over_to_employee_id: undefined as number | undefined,
  department: '',
  follow_up_deadline: '',
  update_during_leave: '',
})

const handoverToSearch = ref('')
const showHandoverToSuggestions = ref(false)

const employeeOptions = computed(() => {
  if (props.employees.length) return props.employees
  if (props.currentEmployee) return [props.currentEmployee]
  return []
})

const contactEmployeeOptions = computed(() => employeeOptions.value.filter(employee => employee.id !== requestForm.value.employee_id))
const filteredEmployeeOptions = computed(() => filterEmployees(employeeOptions.value, employeeSearch.value))
const filteredContactEmployeeOptions = computed(() => filterEmployees(contactEmployeeOptions.value, contactEmployeeSearch.value))
const filteredHandoverToOptions = computed(() => filterEmployees(employeeOptions.value, handoverToSearch.value))
const selectedLeaveType = computed(() => props.leaveTypes.find(type => type.id === requestForm.value.leave_type_id) || null)
const selectedLeaveBalance = computed(() => props.balances.find(balance => balance.leave_type_id === requestForm.value.leave_type_id) || null)

const requestedDaysValue = computed(() => {
  if (!requestForm.value.start_date || !requestForm.value.end_date) return null

  const start = new Date(requestForm.value.start_date)
  const end = new Date(requestForm.value.end_date)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return null
  if (requestForm.value.session !== 'full_day' && requestForm.value.start_date !== requestForm.value.end_date) return null
  if (requestForm.value.session !== 'full_day') return 0.5

  let days = 0
  const cursor = new Date(start)
  while (cursor <= end) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) days += 1
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
})

const requestedDaysLabel = computed(() => (requestedDaysValue.value === null ? 'Select valid dates' : `${requestedDaysValue.value} day(s)`))

const selectedLeaveBalanceLabel = computed(() => {
  if (!selectedLeaveType.value) return 'Select a leave type'
  if (selectedLeaveType.value.code === 'UNPAID') return 'Not balance-limited'
  if (!selectedLeaveBalance.value) return `${selectedLeaveType.value.days_per_year} day(s) yearly entitlement`

  const earnedDays = selectedLeaveBalance.value.available_days
  const advanceDays = selectedLeaveBalance.value.advance_available_days || 0
  if (advanceDays > 0) return `${earnedDays} day(s) earned now + ${advanceDays} day(s) advance`
  return `${earnedDays} day(s) currently available`
})

const projectedBalanceLabel = computed(() => {
  if (!selectedLeaveType.value) return 'Select a leave type'
  if (selectedLeaveType.value.code === 'UNPAID') return 'No balance deduction'
  if (requestedDaysValue.value === null) return 'Select valid dates'

  const earnedDays = selectedLeaveBalance.value?.available_days ?? selectedLeaveType.value.days_per_year
  const requestableDays = selectedLeaveBalance.value?.requestable_days ?? earnedDays
  const advanceUsed = Math.max(requestedDaysValue.value - earnedDays, 0)
  const remainingRequestable = Math.max(requestableDays - requestedDaysValue.value, 0)

  if (advanceUsed > 0) return `${remainingRequestable} day(s) left after using ${advanceUsed} day(s) on advance`
  return `${remainingRequestable} day(s) remaining`
})

const returnDateLabel = computed(() => {
  if (!requestForm.value.end_date) return 'Select an end date'
  const returnDateValue = new Date(requestForm.value.end_date)
  if (Number.isNaN(returnDateValue.getTime())) return 'Select a valid end date'

  do {
    returnDateValue.setDate(returnDateValue.getDate() + 1)
  } while (returnDateValue.getDay() === 0 || returnDateValue.getDay() === 6)

  return returnDateValue.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
})

const requestDuration = computed(() => {
  if (!requestForm.value.start_date || !requestForm.value.end_date) return 'Select a start and end date'
  if (requestedDaysValue.value === null) {
    return requestForm.value.session !== 'full_day' && requestForm.value.start_date !== requestForm.value.end_date
      ? 'Half-day leave only works for a single date'
      : 'Invalid date range'
  }
  return `${requestedDaysValue.value} working day(s)`
})

const showExplanationField = computed(() => Boolean(selectedLeaveType.value && ['SPECIAL', 'COMPENSATORY'].includes(selectedLeaveType.value.code)))
const showAttachmentField = computed(() => Boolean(selectedLeaveType.value?.requires_attachment))

const explanationLabel = computed(() => {
  if (!selectedLeaveType.value) return ''
  if (selectedLeaveType.value.code === 'SPECIAL') return 'Explanation (Required)'
  if (selectedLeaveType.value.code === 'COMPENSATORY') return 'Compensation Details (Required)'
  return ''
})

const explanationPlaceholder = computed(() => {
  if (!selectedLeaveType.value) return ''
  if (selectedLeaveType.value.code === 'SPECIAL') return 'E.g., Compassionate leave for the death of a family member...'
  if (selectedLeaveType.value.code === 'COMPENSATORY') return 'E.g., Worked overnight for 3 days on Project X...'
  return ''
})

const step1Class = computed(() => [
  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-black',
  currentStep.value >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
])

const step2Class = computed(() => [
  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-black',
  currentStep.value >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
])

const stepConnectorClass = computed(() => [
  'h-1 w-12 rounded-full',
  currentStep.value >= 2 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700',
])

const canProceedToStep2 = computed(() => (
  requestForm.value.leave_type_id > 0
  && Boolean(requestForm.value.start_date)
  && Boolean(requestForm.value.end_date)
  && Boolean(requestForm.value.reason.trim())
  && requestedDaysValue.value !== null
))

const employeeLabel = (employee: EmployeeOption) => {
  if ('name' in employee && employee.name) return employee.name
  const employeeWithNames = employee as LeaveRequestEmployee & { first_name?: string; last_name?: string }
  return [employeeWithNames.first_name, employeeWithNames.last_name].filter(Boolean).join(' ').trim() || 'Employee'
}

const employeeMeta = (employee: EmployeeOption) => [employee.employee_id, employee.position].filter(Boolean).join(' - ')

const matchesEmployeeSearch = (employee: EmployeeOption, query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  return [employeeLabel(employee), employee.employee_id, employee.position]
    .filter(Boolean)
    .some(value => String(value).toLowerCase().includes(needle))
}

const filterEmployees = (employeesList: readonly EmployeeOption[], query: string) =>
  employeesList.filter(employee => matchesEmployeeSearch(employee, query)).slice(0, 8)

const handleEmployeeSearchInput = () => {
  requestForm.value.employee_id = undefined
  showEmployeeSuggestions.value = true
}

const handleContactSearchInput = () => {
  requestForm.value.contact_employee_id = undefined
  showContactSuggestions.value = true
}

const selectEmployee = (employee: EmployeeOption) => {
  requestForm.value.employee_id = employee.id
  employeeSearch.value = employeeLabel(employee)
  showEmployeeSuggestions.value = false

  if (requestForm.value.contact_employee_id === employee.id) {
    requestForm.value.contact_employee_id = undefined
    contactEmployeeSearch.value = ''
  }
}

const selectContactEmployee = (employee: EmployeeOption) => {
  requestForm.value.contact_employee_id = employee.id
  contactEmployeeSearch.value = employeeLabel(employee)
  showContactSuggestions.value = false
}

const selectHandoverTo = (employee: EmployeeOption) => {
  handoverForm.value.handed_over_to_employee_id = employee.id
  handoverToSearch.value = employeeLabel(employee)
  showHandoverToSuggestions.value = false
}

const hideEmployeeSuggestions = () => {
  window.setTimeout(() => {
    showEmployeeSuggestions.value = false
  }, 120)
}

const hideContactSuggestions = () => {
  window.setTimeout(() => {
    showContactSuggestions.value = false
  }, 120)
}

const hideHandoverToSuggestions = () => {
  window.setTimeout(() => {
    showHandoverToSuggestions.value = false
  }, 120)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  attachmentFile.value = target.files?.[0] || null
}

const goToStep2 = () => {
  if (canProceedToStep2.value) currentStep.value = 2
}

const goToStep1 = () => {
  currentStep.value = 1
}

const resetForm = () => {
  const resolvedEmployeeId = props.canSelectEmployee ? undefined : (props.defaultEmployeeId ?? props.currentEmployee?.id)

  requestForm.value = {
    employee_id: resolvedEmployeeId,
    contact_employee_id: undefined,
    leave_type_id: 0,
    start_date: '',
    end_date: '',
    session: 'full_day',
    reason: '',
    explanation: '',
    handover_notes: '',
    attachment: undefined,
  }

  handoverForm.value = {
    project_name: '',
    task_description: '',
    current_status: '',
    pending_actions: '',
    handed_over_to_employee_id: undefined,
    department: '',
    follow_up_deadline: '',
    update_during_leave: '',
  }

  employeeSearch.value = ''
  contactEmployeeSearch.value = ''
  handoverToSearch.value = ''
  attachmentFile.value = null
  showEmployeeSuggestions.value = false
  showContactSuggestions.value = false
  showHandoverToSuggestions.value = false
  currentStep.value = 1

  if (!props.canSelectEmployee && props.currentEmployee) {
    employeeSearch.value = employeeLabel(props.currentEmployee)
  }
}

const buildRequestPayload = (): CreateLeaveRequestPayload => {
  const payload: CreateLeaveRequestPayload = { ...requestForm.value }
  if (attachmentFile.value) payload.attachment = attachmentFile.value
  return payload
}

const ensureAttachmentIfRequired = () => {
  if (showAttachmentField.value && !attachmentFile.value) {
    alert(`Attachment is required for ${selectedLeaveType.value?.name}. Please upload a supporting document.`)
    return false
  }
  return true
}

const submitRequest = () => {
  if (!ensureAttachmentIfRequired()) return
  emit('submit', buildRequestPayload())
}

const submitWithHandover = () => {
  if (props.submitting) return
  if (!ensureAttachmentIfRequired()) return

  const handoverPayload: CreateLeaveHandoverPayload = {
    leave_request_id: 0,
    project_name: handoverForm.value.project_name,
    task_description: handoverForm.value.task_description,
    current_status: handoverForm.value.current_status,
    pending_actions: handoverForm.value.pending_actions,
    handed_over_to_employee_id: handoverForm.value.handed_over_to_employee_id,
    department: handoverForm.value.department,
    follow_up_deadline: handoverForm.value.follow_up_deadline,
    update_during_leave: handoverForm.value.update_during_leave,
  }

  emit('submitWithHandover', buildRequestPayload(), handoverPayload)
}

watch(() => props.open, isOpen => {
  if (isOpen) resetForm()
}, { immediate: true })

watch(() => requestForm.value.employee_id, employeeId => {
  if (employeeId && requestForm.value.contact_employee_id === employeeId) {
    requestForm.value.contact_employee_id = undefined
    contactEmployeeSearch.value = ''
  }
})
</script>
