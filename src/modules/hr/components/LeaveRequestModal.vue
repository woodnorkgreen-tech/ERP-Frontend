<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
    <div class="w-full max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Leave Request Form</h2>
          <p class="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">Fill in the details below. Your manager will be notified.</p>
        </div>
        <button @click="emit('close')" class="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:text-rose-500 dark:bg-slate-800 dark:text-slate-300">
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <div class="mt-6 space-y-5">
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
              <div v-if="!filteredEmployeeOptions.length" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                No employees found.
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">Leave Type</label>
          <select v-model.number="requestForm.leave_type_id" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option :value="0">Select leave type</option>
            <option v-for="type in leaveTypes" :key="type.id" :value="type.id">{{ type.name }} - {{ type.days_per_year }} days{{ type.monthly_accrual_rate ? ` (${type.monthly_accrual_rate}/month)` : '' }}</option>
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
          <textarea v-model="requestForm.reason" rows="4" placeholder="Brief reason for your leave request..." class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"></textarea>
        </div>

        <div v-if="showExplanationField" class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">{{ explanationLabel }}</label>
          <textarea v-model="requestForm.explanation" rows="3" :placeholder="explanationPlaceholder" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"></textarea>
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
              <div v-if="!filteredContactEmployeeOptions.length" class="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                No employees found.
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 pt-1">
          <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">{{ requestDuration }}</p>
          <button
            @click="submitRequest"
            :disabled="submitting"
            class="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i class="mdi mdi-send-outline text-base"></i>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Employee } from '../../shared/types/employee'
import type {
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
})

const employeeSearch = ref('')
const contactEmployeeSearch = ref('')
const showEmployeeSuggestions = ref(false)
const showContactSuggestions = ref(false)

const employeeOptions = computed(() => {
  if (props.employees.length) {
    return props.employees
  }

  if (props.currentEmployee) {
    return [props.currentEmployee]
  }

  return []
})

const contactEmployeeOptions = computed(() =>
  employeeOptions.value.filter(employee => employee.id !== requestForm.value.employee_id)
)

const filteredEmployeeOptions = computed(() => filterEmployees(employeeOptions.value, employeeSearch.value))
const filteredContactEmployeeOptions = computed(() => filterEmployees(contactEmployeeOptions.value, contactEmployeeSearch.value))
const selectedLeaveType = computed(() => props.leaveTypes.find(type => type.id === requestForm.value.leave_type_id) || null)
const selectedLeaveBalance = computed(() =>
  props.balances.find(balance => balance.leave_type_id === requestForm.value.leave_type_id) || null
)

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

const requestedDaysLabel = computed(() => requestedDaysValue.value === null ? 'Select valid dates' : `${requestedDaysValue.value} day(s)`)
const selectedLeaveBalanceLabel = computed(() => {
  if (!selectedLeaveType.value) return 'Select a leave type'
  if (selectedLeaveType.value.code === 'UNPAID') return 'Not balance-limited'
  if (!selectedLeaveBalance.value) return `${selectedLeaveType.value.days_per_year} day(s) yearly entitlement`

  const earnedDays = selectedLeaveBalance.value.available_days
  const advanceDays = selectedLeaveBalance.value.advance_available_days || 0
  if (advanceDays > 0) {
    return `${earnedDays} day(s) earned now + ${advanceDays} day(s) advance`
  }

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

  if (advanceUsed > 0) {
    return `${remainingRequestable} day(s) left after using ${advanceUsed} day(s) on advance`
  }

  return `${remainingRequestable} day(s) remaining`
})

const returnDateLabel = computed(() => {
  if (!requestForm.value.end_date) return 'Select an end date'

  const returnDate = new Date(requestForm.value.end_date)
  if (Number.isNaN(returnDate.getTime())) return 'Select a valid end date'

  do {
    returnDate.setDate(returnDate.getDate() + 1)
  } while (returnDate.getDay() === 0 || returnDate.getDay() === 6)

  return returnDate.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
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

const showExplanationField = computed(() => {
  if (!selectedLeaveType.value) return false
  return ['SPECIAL', 'COMPENSATORY'].includes(selectedLeaveType.value.code)
})

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

const filterEmployees = (employeesList: readonly EmployeeOption[], query: string) => employeesList
  .filter(employee => matchesEmployeeSearch(employee, query))
  .slice(0, 8)

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
  }
  employeeSearch.value = ''
  contactEmployeeSearch.value = ''
  showEmployeeSuggestions.value = false
  showContactSuggestions.value = false

  if (!props.canSelectEmployee && props.currentEmployee) {
    employeeSearch.value = employeeLabel(props.currentEmployee)
  }
}

const submitRequest = () => {
  emit('submit', { ...requestForm.value })
}

watch(() => props.open, isOpen => {
  if (isOpen) {
    resetForm()
  }
}, { immediate: true })

watch(() => requestForm.value.employee_id, employeeId => {
  if (employeeId && requestForm.value.contact_employee_id === employeeId) {
    requestForm.value.contact_employee_id = undefined
    contactEmployeeSearch.value = ''
  }
})
</script>
