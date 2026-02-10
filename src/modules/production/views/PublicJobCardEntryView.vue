<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-900">
    <div class="relative max-w-4xl mx-auto px-4 pb-10 pt-8 sm:pt-12">
      <div
        class="pointer-events-none absolute -top-10 right-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl sm:h-44 sm:w-44"
      ></div>
      <div
        class="pointer-events-none absolute -left-6 top-16 h-28 w-28 rounded-full bg-sky-200/40 blur-2xl sm:h-36 sm:w-36"
      ></div>

      <div v-if="!jobCard" class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/40">
        <div class="px-5 py-6 sm:px-8 sm:py-8">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700/80">
                Daily Job Card
              </p>
              <h1 class="mt-2 text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                Start your day in under a minute
              </h1>
              <p class="mt-2 text-sm text-slate-600 sm:text-base">
                Type your name, open today’s card, and begin logging tasks. If it doesn’t exist yet, we’ll create it.
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm">
              <div class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Today</div>
              <div class="mt-1 text-sm font-semibold text-slate-800">{{ today }}</div>
            </div>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div class="flex items-start gap-3">
                <div class="mt-1 h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">Find your name</p>
                  <p class="text-xs text-slate-500">Search by name or employee number.</p>
                </div>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div class="flex items-start gap-3">
                <div class="mt-1 h-8 w-8 rounded-lg bg-sky-500/10 text-sky-700 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">Open today’s card</p>
                  <p class="text-xs text-slate-500">We create one if it doesn’t exist.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-slate-700 mb-2">Worker</label>
            <div class="relative">
              <input
                v-model="employeeSearch"
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Type your name or employee number..."
                @input="(e: Event) => { const target = e.target as HTMLInputElement; searchEmployees(target.value); }"
              />
              <div
                v-if="employeeResults.length && employeeSearch"
                class="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <div class="max-h-56 overflow-y-auto">
                  <div
                    v-for="employee in employeeResults"
                    :key="employee.id"
                    @click="selectEmployee(employee)"
                    class="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p class="font-medium text-slate-900">
                          {{ employee.full_name || `${employee.first_name} ${employee.last_name}` }}
                        </p>
                        <p class="text-sm text-slate-600">{{ employee.employee_number }}</p>
                        <p class="text-xs text-slate-500">{{ employee.department }}</p>
                        <p v-if="employee.specialization" class="text-xs text-emerald-700 mt-1">
                          {{ employee.specialization }}
                        </p>
                      </div>
                      <div class="flex flex-col items-end ml-2">
                        <span
                          class="text-xs px-2 py-1 rounded-full mb-1"
                          :class="getSourceClass(employee.source)"
                        >
                          {{ getSourceLabel(employee.source) }}
                        </span>
                        <span v-if="employee.day_rate" class="text-xs text-emerald-700">
                          ${{ employee.day_rate }}/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedEmployee" class="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              Selected: {{ selectedEmployee.full_name || `${selectedEmployee.first_name} ${selectedEmployee.last_name}` }}
            </div>

            <div v-if="errorMessage" class="mt-3 text-sm text-red-600">
              {{ errorMessage }}
            </div>

            <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                class="w-full sm:w-auto rounded-xl px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!selectedEmployee || loading"
                @click="openOrCreateJobCard"
              >
                {{ loading ? 'Opening...' : 'Open Today’s Job Card' }}
              </button>
              <p class="text-xs text-slate-500">
                Tip: If you don’t see your name, contact your supervisor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <JobCardForm
        v-else
        :jobCard="jobCard"
        :publicMode="true"
        :lockWorker="true"
        :lockDate="true"
        @saved="handleSaved"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import JobCardForm from '../components/JobCardForm.vue'
import { publicJobCardsService } from '../services/publicJobCards'

const route = useRoute()

const today = new Date().toISOString().split('T')[0]
const loading = ref(false)
const errorMessage = ref('')

const jobCard = ref<any | null>(null)

const employeeSearch = ref('')
const employeeResults = ref<any[]>([])
const selectedEmployee = ref<any | null>(null)

const searchEmployees = async (query: string) => {
  if (!query || query.length < 2) {
    employeeResults.value = []
    return
  }

  try {
    const response = await publicJobCardsService.getTechnicians()
    if (response.success) {
      const filteredData = response.data.filter((emp: any) =>
        (emp.first_name && emp.first_name.toLowerCase().includes(query.toLowerCase())) ||
        (emp.last_name && emp.last_name.toLowerCase().includes(query.toLowerCase())) ||
        (emp.full_name && emp.full_name.toLowerCase().includes(query.toLowerCase())) ||
        emp.employee_number?.toLowerCase().includes(query.toLowerCase())
      )
      employeeResults.value = filteredData.map((emp: any) => ({
        id: emp.id,
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        full_name: emp.full_name || `${emp.first_name} ${emp.last_name}`.trim(),
        employee_number: emp.employee_number,
        department: emp.department,
        source: emp.source,
        specialization: emp.specialization,
        day_rate: emp.day_rate
      }))
    }
  } catch (error) {
    console.error('Error searching employees:', error)
  }
}

const selectEmployee = (employee: any) => {
  selectedEmployee.value = employee
  employeeSearch.value = employee.full_name || `${employee.first_name} ${employee.last_name}`.trim()
  employeeResults.value = []
}

const openOrCreateJobCard = async () => {
  if (!selectedEmployee.value) return
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await publicJobCardsService.lookupOrCreateJobCard(
      Number(selectedEmployee.value.id),
      today
    )

    if (response.success) {
      jobCard.value = response.data
    } else {
      errorMessage.value = response.message || 'Unable to load job card.'
    }
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Unable to load job card.'
  } finally {
    loading.value = false
  }
}

const handleSaved = () => {
  // Keep the form open after save
}

const handleCancel = () => {
  jobCard.value = null
}

const getSourceClass = (source?: string) => {
  switch (source) {
    case 'employee':
      return 'bg-blue-100 text-blue-800'
    case 'technical_labour':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSourceLabel = (source?: string) => {
  switch (source) {
    case 'employee':
      return 'Employee'
    case 'technical_labour':
      return 'Technical Labour'
    default:
      return 'Unknown'
  }
}

onMounted(async () => {
  const token = route.params.token as string | undefined
  if (token) {
    loading.value = true
    try {
      const response = await publicJobCardsService.getJobCardByToken(token)
      if (response.success) {
        jobCard.value = response.data
      } else {
        errorMessage.value = response.message || 'Invalid job card link.'
      }
    } catch (error: any) {
      errorMessage.value = error?.response?.data?.message || 'Invalid job card link.'
    } finally {
      loading.value = false
    }
  }
})
</script>
