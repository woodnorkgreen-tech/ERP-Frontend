<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Leave Calendar</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">View approved leave requests on a calendar.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="previousMonth" class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <i class="mdi mdi-chevron-left"></i>
        </button>
        <span class="text-sm font-black text-slate-900 dark:text-white">{{ currentMonthYear }}</span>
        <button @click="nextMonth" class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="day in weekDays" :key="day" class="p-2 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {{ day }}
      </div>

      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'min-h-[80px] rounded-xl border p-2',
          day.isCurrentMonth ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60',
          day.isToday ? 'ring-2 ring-teal-500' : '',
        ]"
      >
        <p
          :class="[
            'text-xs font-bold',
            day.isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600',
            day.isToday ? 'text-teal-600 dark:text-teal-400' : '',
          ]"
        >
          {{ day.date }}
        </p>

        <div v-if="day.leaves.length" class="mt-1 space-y-1">
          <div
            v-for="leave in day.leaves.slice(0, 2)"
            :key="leave.id"
            :class="['truncate rounded-lg px-2 py-1 text-[10px] font-bold', statusColor(leave.status)]"
            :title="`${leave.employee_name} - ${leave.leave_type}`"
          >
            {{ leave.employee_name }}
          </div>
          <div v-if="day.leaves.length > 2" class="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            +{{ day.leaves.length - 2 }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface LeaveEntry {
  id: number
  employee_name: string
  leave_type: string
  status: string
  start_date: string
  end_date: string
}

const props = defineProps<{
  leaves: readonly LeaveEntry[]
}>()

const currentDate = ref(new Date())
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => currentDate.value.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }))

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.getTime() === today.getTime()

    const leaves = props.leaves.filter(leave => {
      const start = new Date(leave.start_date)
      const end = new Date(leave.end_date)
      return date >= start && date <= end
    })

    days.push({
      date: date.getDate(),
      isCurrentMonth,
      isToday,
      leaves,
    })
  }

  return days
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const statusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    case 'pending':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    case 'rejected':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
    case 'cancelled':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
    case 'recalled':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  }
}
</script>
