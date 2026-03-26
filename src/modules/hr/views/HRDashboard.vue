<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">HR Dashboard</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Employee management and HR operations overview</p>
      </div>
    </div>

    <!-- Workforce Summary -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-blue-500">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 pl-1">Total Workforce</p>
              <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ employees.length }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-1">All Enrolled Employees</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
              <i class="mdi mdi-account-group text-xl"></i>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-emerald-500">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 pl-1">Departments</p>
              <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ departmentCount }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-1">Functional Departments</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <i class="mdi mdi-domain text-xl"></i>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-amber-500">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 pl-1">On Leave</p>
              <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ employees.filter(e => e.status === 'on-leave').length }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-1">Away from Work</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <i class="mdi mdi-calendar-clock text-xl"></i>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-rose-500">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 pl-1">Terminated</p>
              <p class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ employees.filter(e => e.status === 'terminated').length }}</p>
              <p class="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-1">Separated from Work</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
              <i class="mdi mdi-account-off text-xl"></i>
            </div>
          </div>
        </article>
      </div>

    <!-- Department Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Employees by Department</h2>
        <div class="space-y-3">
          <div v-for="dept in stats.employeesByDepartment" :key="dept.name" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ dept.name }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{ width: `${(dept.count / stats.totalEmployees) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{{ dept.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Hires</h2>
        <div class="space-y-3">
          <div v-for="employee in stats.recentHires" :key="employee.id" class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-white">{{ employee.first_name.charAt(0) }}{{ employee.last_name.charAt(0) }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ employee.first_name }} {{ employee.last_name }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ employee.position }}</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(employee.hire_date) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/hr/employees"
          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div class="p-2 bg-blue-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Manage Employees</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">View and update employee records</p>
          </div>
        </router-link>

        <router-link
          to="/hr/leave"
          class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <div class="p-2 bg-green-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Leave Management</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage requests, balances, and policies</p>
          </div>
        </router-link>

        <div class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="p-2 bg-purple-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Performance</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Review and manage performance</p>
          </div>
        </div>

        <router-link
          to="/hr/payroll"
          class="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
        >
          <div class="p-2 bg-amber-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.651 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.651-1M12 16c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2m0-8c1.11 0 2.08.407 2.651 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.651-1M12 16c1.11 0 2.08.407 2.651 1" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Payroll Engine</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage salaries and disbursements</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useEmployees } from '../composables/useEmployees'

const { employees, fetchEmployees } = useEmployees()

// Unique department count derived from employees
const departmentCount = computed(() => {
  const names = new Set(employees.value.map(e => e.department?.name).filter(Boolean))
  return names.size
})

// Computed stats
const stats = computed(() => {
  const totalEmployees = employees.value.length
  const activeEmployees = employees.value.filter(e => e.status === 'active').length

  const newHiresThisMonth = employees.value.filter(e => {
    const hireDate = new Date(e.hire_date)
    const now = new Date()
    return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear()
  }).length

  // Group employees by department name
  const departmentCounts: Record<string, number> = {}
  employees.value.forEach(employee => {
    const deptName = employee.department?.name || 'No Department'
    departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1
  })

  const employeesByDepartment = Object.entries(departmentCounts)
    .map(([name, count]) => ({ name, count }))
    .filter(dept => dept.count > 0) // Only show departments with employees
    .sort((a, b) => b.count - a.count) // Sort by count descending

  const recentHires = [...employees.value]
    .sort((a: any, b: any) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())
    .slice(0, 3)

  return {
    totalEmployees,
    activeEmployees,
    newHiresThisMonth,
    employeesByDepartment,
    recentHires
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchEmployees()
})
</script>
