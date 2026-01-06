<template>
  <div class="space-y-6">
    <div>
      <div class="flex items-center gap-3 mb-5">
        <h3 class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Assign Team Members</h3>
        <span class="h-px bg-slate-100 dark:bg-slate-800 flex-grow"></span>
      </div>
      
      <!-- Assignment Form at Top -->
      <div class="pb-6 border-b border-gray-100 dark:border-gray-800">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <!-- Assignee Selection -->
            <div class="md:col-span-12 lg:col-span-5 space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Search User *</label>
              <div class="relative group">
                <input
                  v-model="newAssignment.employeeSearch"
                  type="text"
                  placeholder="Search by name..."
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  @input="searchEmployeesForNewAssignment"
                />
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
                  <i class="mdi mdi-account-search-outline text-xl"></i>
                </div>
                
                <!-- Suggestions Dropdown -->
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                >
                  <div
                    v-if="newAssignment.employeeSuggestions.length > 0"
                    class="absolute z-[120] mt-2 max-h-60 overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-2xl w-full custom-scrollbar"
                  >
                    <div
                      v-for="emp in newAssignment.employeeSuggestions"
                      :key="emp.id"
                      @click="selectEmployeeForNewAssignment(emp)"
                      class="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600">
                          {{ emp.displayName.charAt(0) }}
                        </div>
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ emp.displayName }}</span>
                      </div>
                      <i class="mdi mdi-plus-circle-outline text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <!-- Role Selection -->
            <div class="md:col-span-6 lg:col-span-4 space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Title / Role</label>
              <div class="relative group">
                <select
                  v-model="newAssignment.role"
                  class="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Member</option>
                  <option value="captain">Lead</option>
                  <option value="technician">Technical</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="reviewer">Reviewer</option>
                </select>
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
                  <i class="mdi mdi-shield-account-outline text-xl"></i>
                </div>
              </div>
            </div>

            <!-- Primary Assignment Toggle -->
            <div class="md:col-span-6 lg:col-span-2 space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Primary?</label>
              <button
                type="button"
                @click="!primaryAssignmentExists || newAssignment.is_primary ? newAssignment.is_primary = !newAssignment.is_primary : null"
                :disabled="primaryAssignmentExists && !newAssignment.is_primary"
                :class="[
                  newAssignment.is_primary 
                    ? 'bg-blue-600 text-white border-blue-400/30' 
                    : 'bg-white dark:bg-gray-900 text-slate-500 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600',
                  'w-full py-2.5 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed'
                ]"
              >
                <i :class="newAssignment.is_primary ? 'mdi-check-decagram' : 'mdi-star-outline'" class="mdi text-base"></i>
                <span>Primary</span>
              </button>
            </div>

            <!-- Add Button -->
            <div class="md:col-span-12 lg:col-span-1">
              <button
                @click="addNewAssignment"
                :disabled="!newAssignment.selectedEmployee"
                class="w-full h-[45px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg flex items-center justify-center active:scale-95"
              >
                <i class="mdi mdi-account-plus text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Existing Assignments List -->
      <div class="mt-8">
        <h4 class="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-0.5">Assigned Team</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Local Assignments (unsaved) -->
          <div
            v-for="(assignment, index) in localAssignments"
            :key="`local-${index}`"
            class="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-500/50 transition-all animate-in zoom-in duration-300"
          >
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
                  <span class="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {{ assignment.selectedEmployee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() }}
                  </span>
                </div>
                <div v-if="assignment.is_primary" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <i class="mdi mdi-star text-[10px] text-white"></i>
                </div>
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-slate-900 dark:text-white truncate text-sm">{{ assignment.selectedEmployee.name }}</div>
                <div class="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase mt-0.5 tracking-wider">{{ assignment.role || 'Member' }}</div>
              </div>
            </div>
            <button
              @click="removeLocalAssignment(index)"
              class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white flex items-center justify-center"
            >
              <i class="mdi mdi-close text-lg"></i>
            </button>
          </div>

          <!-- Existing Assignments (saved) -->
          <div
            v-for="assignment in existingAssignments"
            :key="assignment.id"
            class="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all"
          >
            <div class="flex items-center gap-3">
              <div class="relative">
                <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {{ assignment.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() }}
                  </span>
                </div>
                <div v-if="assignment.is_primary" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <i class="mdi mdi-star text-[10px] text-white"></i>
                </div>
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-slate-900 dark:text-white truncate text-sm">{{ assignment.user.name }}</div>
                <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5 tracking-wider">{{ assignment.role || 'Member' }}</div>
              </div>
            </div>
            <button
              @click="removeExistingAssignment(assignment.id)"
              class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white flex items-center justify-center"
            >
              <i class="mdi mdi-close text-lg"></i>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="localAssignments.length === 0 && existingAssignments.length === 0" 
               class="col-span-full py-10 bg-slate-50 dark:bg-gray-800 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <i class="mdi mdi-account-group-outline text-4xl text-slate-300 dark:text-gray-600 mb-2"></i>
            <p class="text-xs font-semibold text-slate-400 dark:text-slate-500">No team members assigned</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template><script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { TaskAssignment } from '../types'
import { useApi } from '@/modules/admin/shared/composables/useApi'
import { formatDate } from '../utils/dateUtils'

// Props
interface Props {
  taskId?: number
  initialAssignments?: TaskAssignment[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'assignments-updated', assignments: any[]): void
}>()

// API composable
const { get } = useApi()

// Reactive state
const localAssignments = ref<any[]>([])

const existingAssignments = ref<TaskAssignment[]>(props.initialAssignments || [])

const newAssignment = ref<{
  employeeSearch: string
  employeeSuggestions: any[]
  selectedEmployee: any | null
  role: string
  is_primary: boolean
}>({
  employeeSearch: '',
  employeeSuggestions: [],
  selectedEmployee: null,
  role: '',
  is_primary: false
})

// Computed
const primaryAssignmentExists = computed(() => {
  return localAssignments.value.some(a => a.is_primary) || 
         existingAssignments.value.some(a => a.is_primary) ||
         newAssignment.value.is_primary
})

// Watch for changes and emit updates
watch(localAssignments, () => {
  const assignments = localAssignments.value
    .map(a => ({
      user_id: a.selectedEmployee.id,
      role: a.role || undefined,
      is_primary: a.is_primary
    }))
  
  emit('assignments-updated', assignments)
}, { deep: true })

// Methods
const searchEmployeesForNewAssignment = async () => {
  const query = newAssignment.value.employeeSearch
  if (!query || query.length < 2) {
    newAssignment.value.employeeSuggestions = []
    return
  }

  try {
    const response = await get('/api/hr/employees', {
      search: query.trim(),
      per_page: 20
    })

    // Handle different response formats
    let employeesArray: any[] = []
    if (Array.isArray(response)) {
      employeesArray = response
    } else if (response && typeof response === 'object' && 'data' in response) {
      if (Array.isArray((response as any).data)) {
        employeesArray = (response as any).data
      } else if ((response as any).data?.data && Array.isArray((response as any).data.data)) {
        employeesArray = (response as any).data.data
      }
    }

    // Filter and format employees - include user_id for task assignment
    newAssignment.value.employeeSuggestions = employeesArray
      .filter((emp: any) => emp.first_name || emp.last_name)
      .map((emp: any) => ({
        id: emp.user_id || emp.id, // Use user_id if available, fallback to employee id
        employee_id: emp.id,
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        position: emp.position,
        displayName: `${emp.first_name || ''} ${emp.last_name || ''}`.trim(),
        name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim()
      }))
      .slice(0, 10) // Limit to 10 results
  } catch (error) {
    console.error('Error searching employees:', error)
    newAssignment.value.employeeSuggestions = []
  }
}

const selectEmployeeForNewAssignment = (emp: any) => {
  newAssignment.value.selectedEmployee = emp
  newAssignment.value.employeeSearch = emp.displayName
  newAssignment.value.employeeSuggestions = []
}

const clearNewAssignmentEmployee = () => {
  newAssignment.value.selectedEmployee = null
  newAssignment.value.employeeSearch = ''
}

const addNewAssignment = () => {
  if (!newAssignment.value.selectedEmployee) return
  
  localAssignments.value.push({
    selectedEmployee: newAssignment.value.selectedEmployee,
    role: newAssignment.value.role,
    is_primary: newAssignment.value.is_primary
  })
  
  // Reset new assignment form
  newAssignment.value.employeeSearch = ''
  newAssignment.value.employeeSuggestions = []
  newAssignment.value.selectedEmployee = null
  newAssignment.value.role = ''
  newAssignment.value.is_primary = false
}

const removeLocalAssignment = (index: number) => {
  localAssignments.value.splice(index, 1)
}

const removeExistingAssignment = (assignmentId: number) => {
  // In a real implementation, this would call an API to remove the assignment
  existingAssignments.value = existingAssignments.value.filter(a => a.id !== assignmentId)
}

const getAssignmentsPayload = () => {
  return localAssignments.value
    .map(a => ({
      user_id: a.selectedEmployee.id,
      role: a.role || undefined,
      is_primary: a.is_primary
    }))
}

// Expose methods to parent
defineExpose({
  getAssignmentsPayload
})

// Lifecycle
onMounted(() => {
  // No initialization needed since we're using a form-based approach
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>