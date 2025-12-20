<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Team Assignments</h3>
      
      <!-- Assignment Form at Top -->
      <div class="pb-6 border-b border-gray-200 dark:border-gray-700">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Add New Assignment</h4>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <!-- Assignee Selection -->
            <div class="md:col-span-5">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee *</label>
              <div class="relative">
                <input
                  v-model="newAssignment.employeeSearch"
                  type="text"
                  placeholder="Type to search employees..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @input="searchEmployeesForNewAssignment"
                />
                <div
                  v-if="newAssignment.employeeSuggestions.length > 0"
                  class="absolute z-10 mt-1 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 shadow-lg w-full"
                >
                  <div
                    v-for="emp in newAssignment.employeeSuggestions"
                    :key="emp.id"
                    @click="selectEmployeeForNewAssignment(emp)"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white"
                  >
                    {{ emp.displayName }}
                  </div>
                </div>
              </div>
              <div v-if="newAssignment.selectedEmployee" class="mt-2 flex items-center gap-2">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ newAssignment.selectedEmployee.displayName }}
                </span>
                <button
                  @click="clearNewAssignmentEmployee"
                  class="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>

            <!-- Role Selection -->
            <div class="md:col-span-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select
                v-model="newAssignment.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select role</option>
                <option value="captain">Captain</option>
                <option value="technician">Technician</option>
                <option value="supervisor">Supervisor</option>
                <option value="consultant">Consultant</option>
                <option value="reviewer">Reviewer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Primary Assignment Toggle -->
            <div class="md:col-span-2 flex items-center">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="newAssignment.is_primary"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  :disabled="primaryAssignmentExists && !newAssignment.is_primary"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Primary</span>
              </label>
            </div>

            <!-- Add Button -->
            <div class="md:col-span-1 flex justify-start md:justify-end">
              <button
                @click="addNewAssignment"
                :disabled="!newAssignment.selectedEmployee"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Existing Assignments List -->
      <div class="mt-6">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Assigned Team Members</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <!-- Local Assignments (unsaved) -->
          <div
            v-for="(assignment, index) in localAssignments"
            :key="`local-${index}`"
            class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-xs font-medium text-blue-800 dark:text-blue-200">
                  {{ assignment.selectedEmployee.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ assignment.selectedEmployee.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ assignment.role || 'No role' }}
                  <span v-if="assignment.is_primary" class="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    Primary
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="removeLocalAssignment(index)"
              class="text-red-500 hover:text-red-700 p-1"
              title="Remove assignment"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Existing Assignments (saved) -->
          <div
            v-for="assignment in existingAssignments"
            :key="assignment.id"
            class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-xs font-medium text-blue-800 dark:text-blue-200">
                  {{ assignment.user.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ assignment.user.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ assignment.role || 'No role' }}
                  <span v-if="assignment.is_primary" class="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    Primary
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="removeExistingAssignment(assignment.id)"
              class="text-red-500 hover:text-red-700 p-1"
              title="Remove assignment"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="localAssignments.length === 0 && existingAssignments.length === 0" class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No team members assigned yet</p>
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

const newAssignment = ref({
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