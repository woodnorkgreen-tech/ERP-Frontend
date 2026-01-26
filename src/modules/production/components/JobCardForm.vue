<template>
  <div class="fixed inset-0 backdrop-blur-none bg-black/15 dark:bg-white/15 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Daily Job Card' : 'Create Daily Job Card' }}
        </h2>
        <button
          @click="$emit('cancel')"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="props.readOnly ? null : handleSubmit" class="space-y-6">
          <!-- Worker Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Worker *
            </label>
            <div class="relative">
              <input
                v-model="employeeSearch"
                type="text"
                :required="!props.readOnly"
                :readonly="props.readOnly"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type to search employees..."
                @input="(e: Event) => { const target = e.target as HTMLInputElement; console.log('Input event fired, value:', target.value); searchEmployees(target.value); }"
              />
              <div
                v-if="employeeResults?.length && employeeSearch"
                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
              >
                <div
                  v-for="employee in employeeResults"
                  :key="employee.id"
                  @click="selectEmployee(employee)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ employee.first_name }} {{ employee.last_name }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ employee.employee_number }} - {{ employee.department }}
                  </div>
                </div>
              </div>
              <div v-if="selectedEmployee" class="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Selected: {{ selectedEmployee.first_name }} {{ selectedEmployee.last_name }} ({{ selectedEmployee.employee_number }})
              </div>
            </div>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              v-model="form.date"
              type="date"
              :required="!props.readOnly"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Clock In/Out Times -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clock In Time
              </label>
              <input
                v-model="form.clock_in_time"
                type="time"
                :readonly="props.readOnly"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="HH:MM"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clock Out Time
              </label>
              <input
                v-model="form.clock_out_time"
                type="time"
                :readonly="props.readOnly"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="HH:MM"
              />
            </div>
          </div>

          <!-- Tasks Section -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Tasks</h3>
              <button
                v-if="!props.readOnly"
                type="button"
                @click="addTask"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
            
            <!-- Tasks Table -->
            <div v-if="form.tasks.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Range</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Work Order</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr v-for="(task, index) in form.tasks" :key="`task-${index}`">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {{ task.start_time || '--:--' }} - {{ task.end_time || '--:--' }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {{ task.description }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {{ task.selected_work_order?.title || 'None' }}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <button
                        type="button"
                        @click="editTask(index)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                      >
                        {{ props.readOnly ? 'View' : 'Edit' }}
                      </button>
                      <button
                        v-if="!props.readOnly"
                        type="button"
                        @click="removeTask(index)"
                        class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first task.</p>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes for the day..."
            ></textarea>
          </div>

          <!-- Issues Section -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Issues Experienced</h3>
              <button
                v-if="!props.readOnly"
                type="button"
                @click="showIssueForm = true"
                class="px-3 py-1 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Add Issue
              </button>
            </div>
            
            <!-- Issues Table -->
            <div v-if="form.issues.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resolution</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr v-for="(issue, index) in form.issues" :key="`issue-${index}`">
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {{ issue.description }}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span 
                        :class="issue.status === 'open' 
                          ? 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : issue.status === 'escalated' 
                          ? 'px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : issue.status === 'under_review' 
                          ? 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'"
                      >
                        {{ issue.status === 'open' ? 'Open' : issue.status === 'escalated' ? 'Escalated' : issue.status === 'under_review' ? 'Under Review' : 'Resolved' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {{ issue.resolution || 'No resolution yet' }}
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <button
                        type="button"
                        @click="editIssue(index)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-2"
                      >
                        {{ props.readOnly ? 'View' : 'Edit' }}
                      </button>
                      <button
                        v-if="!props.readOnly"
                        type="button"
                        @click="removeIssue(index)"
                        class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0-4v2m0 4v2M9 19h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issues</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No issues reported for this job card.</p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$emit('cancel')"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Close
            </button>
            <button
              v-if="!props.readOnly"
              type="button"
              :disabled="loading"
              @click="handleSubmit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }} Job Card
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Task Form Modal -->
  <div v-if="showTaskForm" class="fixed inset-0 backdrop-blur-none bg-gray-800/15 dark:bg-gray-200/15 flex items-center justify-center z-[60] p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ editingTaskIndex !== null ? 'Edit Task' : 'Add Task' }}
        </h2>
        <button
          @click="closeTaskForm"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="saveTask" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                v-model="taskForm.start_time"
                type="time"
                :readonly="props.readOnly"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="HH:MM"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                v-model="taskForm.end_time"
                type="time"
                :readonly="props.readOnly"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="HH:MM"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Description *
            </label>
            <input
              v-model="taskForm.description"
              type="text"
              :required="!props.readOnly"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What did you work on?"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Work Order/Project (Optional)
            </label>
            <input
              v-model="taskForm.work_order_search"
              type="text"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search work orders..."
              @input="searchWorkOrders(($event.target as HTMLInputElement).value, -1)"
            />
            <div v-if="taskForm.work_order_results?.length" class="mt-2 border border-gray-200 dark:border-gray-600 rounded-md">
              <div class="max-h-32 overflow-y-auto">
                <div
                  v-for="wo in taskForm.work_order_results"
                  :key="wo.id"
                  @click="selectWorkOrderForTask(wo)"
                  class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <div class="font-medium text-gray-900 dark:text-white">{{ wo.title }}</div>
                  <div class="text-gray-600 dark:text-gray-300 text-xs">{{ wo.work_order_number }} - {{ wo.status }}</div>
                </div>
              </div>
            </div>
            <div v-else-if="taskForm.work_order_search && taskForm.work_order_search.length >= 2 && !taskForm.work_order_results?.length" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              No work orders found
            </div>
            <div v-if="taskForm.selected_work_order" class="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Selected: {{ taskForm.selected_work_order.title }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Notes
            </label>
            <textarea
              v-model="taskForm.notes"
              rows="3"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this task..."
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeTaskForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ editingTaskIndex !== null ? 'Update' : 'Add' }} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Issue Form Modal -->
  <div v-if="showIssueForm" class="fixed inset-0 backdrop-blur-none bg-gray-800/15 dark:bg-gray-200/15 flex items-center justify-center z-[70] p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ editingIssueIndex !== null ? 'Edit Issue' : 'Add Issue' }}
        </h2>
        <button
          @click="closeIssueForm"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="saveIssue" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issue Description *
            </label>
            <textarea
              v-model="issueForm.description"
              rows="3"
              :required="!props.readOnly"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the issue experienced..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resolution
            </label>
            <textarea
              v-model="issueForm.resolution"
              rows="3"
              :readonly="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="How was this issue resolved?"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              v-model="issueForm.status"
              :disabled="props.readOnly"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="escalated">Escalated</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeIssueForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
            >
              {{ editingIssueIndex !== null ? 'Update' : 'Add' }} Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { jobCardsService } from '../services/jobCards'
import { workOrderService } from '../services/workOrderService'

interface Props {
  jobCard?: any
  readOnly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  cancel: []
  saved: []
}>()

const loading = ref(false)
const employeeSearch = ref('')
const employeeResults = ref<{ id: number; first_name: string; last_name: string; employee_number: string; department: string }[]>([])
const selectedEmployee = ref<{ id: number; first_name: string; last_name: string; employee_number: string; department: string } | null>(null)
const showTaskForm = ref(false)
const showIssueForm = ref(false)
const editingTaskIndex = ref<number | null>(null)
const editingIssueIndex = ref<number | null>(null)
const taskForm = ref({
  description: '',
  work_order_search: '',
  work_order_results: [] as { id: number; title: string; work_order_number: string; status: string }[],
  selected_work_order: null as { id: number; title: string; work_order_number: string; status: string } | null,
  start_time: '',
  end_time: '',
  notes: ''
})
const issueForm = ref({
  description: '',
  resolution: '',
  status: 'open'
})

const form = ref({
  worker_id: '',
  date: new Date().toISOString().split('T')[0],
  clock_in_time: '',
  clock_out_time: '',
  notes: '',
  tasks: [] as {
    id?: number;
    description: string;
    work_order_id: number | null;
    selected_work_order: { id: number; title: string; work_order_number: string; status: string } | null;
    start_time: string;
    end_time: string;
    notes: string;
    work_order_search: string;
    work_order_results: { id: number; title: string; work_order_number: string; status: string }[];
  }[],
  issues: [] as {
    description: string;
    resolution: string;
    status: string;
  }[]
})

const isEditing = computed(() => !!props.jobCard)

const addTask = () => {
  editingTaskIndex.value = null
  resetTaskForm()
  showTaskForm.value = true
}

const editTask = (index: number) => {
  editingTaskIndex.value = index
  const task = form.value.tasks[index]
  taskForm.value = {
    description: task.description || '',
    work_order_search: task.selected_work_order?.title || '',
    work_order_results: [],
    selected_work_order: task.selected_work_order || null,
    start_time: task.start_time || '',
    end_time: task.end_time || '',
    notes: task.notes || ''
  }
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
  editingTaskIndex.value = null
  resetTaskForm()
}

const resetTaskForm = () => {
  taskForm.value = {
    description: '',
    work_order_search: '',
    work_order_results: [],
    selected_work_order: null,
    start_time: '',
    end_time: '',
    notes: ''
  }
}

const saveTask = () => {
  if (!taskForm.value.description.trim()) {
    return
  }

  const taskData = {
    id: editingTaskIndex.value !== null ? form.value.tasks[editingTaskIndex.value].id : undefined,
    description: taskForm.value.description,
    work_order_id: taskForm.value.selected_work_order?.id || null,
    selected_work_order: taskForm.value.selected_work_order,
    start_time: taskForm.value.start_time,
    end_time: taskForm.value.end_time,
    notes: taskForm.value.notes,
    work_order_search: taskForm.value.selected_work_order?.title || '',
    work_order_results: []
  }

  if (editingTaskIndex.value !== null) {
    // Update existing task - preserve the ID
    form.value.tasks[editingTaskIndex.value] = taskData
  } else {
    // Add new task - no ID yet
    form.value.tasks.push(taskData)
  }

  closeTaskForm()
}

const removeTask = (index: number) => {
  form.value.tasks.splice(index, 1)
}

const addIssue = () => {
  editingIssueIndex.value = null
  resetIssueForm()
  showIssueForm.value = true
}

const editIssue = (index: number) => {
  editingIssueIndex.value = index
  const issue = form.value.issues[index]
  issueForm.value = {
    description: issue.description || '',
    resolution: issue.resolution || '',
    status: issue.status || 'open'
  }
  showIssueForm.value = true
}

const closeIssueForm = () => {
  showIssueForm.value = false
  editingIssueIndex.value = null
  resetIssueForm()
}

const resetIssueForm = () => {
  issueForm.value = {
    description: '',
    resolution: '',
    status: 'open'
  }
}

const saveIssue = () => {
  if (!issueForm.value.description.trim()) {
    return
  }

  const issueData = {
    description: issueForm.value.description,
    resolution: issueForm.value.resolution,
    status: issueForm.value.status
  }

  if (editingIssueIndex.value !== null) {
    // Update existing issue
    form.value.issues[editingIssueIndex.value] = issueData
  } else {
    // Add new issue
    form.value.issues.push(issueData)
  }

  closeIssueForm()
}

const removeIssue = (index: number) => {
  form.value.issues.splice(index, 1)
}

const selectWorkOrderForTask = (workOrder: { id: number; title: string; work_order_number: string; status: string }) => {
  taskForm.value.selected_work_order = workOrder
  taskForm.value.work_order_search = workOrder.title
  taskForm.value.work_order_results = []
}

const searchWorkOrders = async (query: string, taskIndex: number) => {
  if (!query || query.length < 2) {
    if (taskIndex === -1) {
      // Task form search
      taskForm.value.work_order_results = []
    } else {
      // Regular task search
      form.value.tasks[taskIndex].work_order_results = []
    }
    return
  }

  try {
    // Use same search logic as WorkOrder view
    const response = await workOrderService.getWorkOrders({ search: query })
    
    // Handle different response structures like WorkOrder view does
    let results: { id: number; title: string; work_order_number: string; status: string }[] = []
    if (response.data && Array.isArray(response.data.data)) {
      // Laravel paginated response
      results = response.data.data
    } else if (Array.isArray(response.data)) {
      // Direct array response
      results = response.data
    } else if (Array.isArray(response)) {
      // Direct array response (no data wrapper)
      results = response
    }

    if (taskIndex === -1) {
      // Task form search
      taskForm.value.work_order_results = results
    } else {
      // Regular task search
      form.value.tasks[taskIndex].work_order_results = results
    }
  } catch (error) {
    console.error('Error searching work orders:', error)
    if (taskIndex === -1) {
      taskForm.value.work_order_results = []
    } else {
      form.value.tasks[taskIndex].work_order_results = []
    }
  }
}

const selectWorkOrder = (workOrder: any, taskIndex: number) => {
  form.value.tasks[taskIndex].selected_work_order = workOrder
  form.value.tasks[taskIndex].work_order_id = workOrder.id
  form.value.tasks[taskIndex].work_order_search = workOrder.title
  form.value.tasks[taskIndex].work_order_results = []
}

const handleSubmit = async () => {
  console.log('handleSubmit called')
  console.log('isEditing:', isEditing.value)
  console.log('props.jobCard:', props.jobCard)
  
  // Validate that worker is selected (only for new job cards)
  if (!isEditing.value && (!form.value.worker_id || !selectedEmployee.value)) {
    alert('Please select a worker before saving.')
    return
  }

  // Validate clock in/out times - support overnight shifts
  if (form.value.clock_in_time && form.value.clock_out_time) {
    const clockIn = new Date(`1970-01-01T${form.value.clock_in_time}:00`)
    const clockOut = new Date(`1970-01-01T${form.value.clock_out_time}:00`)
    
    // Calculate total hours worked (accounting for overnight)
    let hoursWorked = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
    if (hoursWorked < 0) {
      // Overnight shift - add 24 hours
      hoursWorked += 24
    }
    
    if (hoursWorked > 24) {
      alert('Invalid clock times: Total hours worked cannot exceed 24 hours.')
      return
    }
  }

  // Validate task times - support overnight shifts
  for (const task of form.value.tasks) {
    if (task.start_time && task.end_time) {
      const start = new Date(`1970-01-01T${task.start_time}:00`)
      const end = new Date(`1970-01-01T${task.end_time}:00`)
      
      let hoursWorked = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      if (hoursWorked < 0) {
        // Overnight shift - add 24 hours
        hoursWorked += 24
      }
      
      if (hoursWorked > 24) {
        alert(`Task "${task.description}" exceeds 24 hours. Please check the times.`)
        return
      }
    }
  }

  console.log('Form data before submit:', form.value)
  loading.value = true
  
  try {
    let response
    if (isEditing.value) {
      console.log('Updating job card...')
      console.log('Form tasks:', JSON.stringify(form.value.tasks, null, 2))
      console.log('Form issues:', JSON.stringify(form.value.issues, null, 2))
      
      // Helper function to format time with date context for overnight shifts
      const formatTimeWithDate = (timeStr: string, isNextDay: boolean = false): string | undefined => {
        if (!timeStr) return undefined
        const date = new Date(form.value.date)
        if (isNextDay) {
          date.setDate(date.getDate() + 1)
        }
        const [hours, minutes] = timeStr.split(':')
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        return date.toISOString()
      }
      
      // Determine if clock out is on the next day
      let isClockOutNextDay = false
      if (form.value.clock_in_time && form.value.clock_out_time) {
        const clockIn = new Date(`1970-01-01T${form.value.clock_in_time}:00`)
        const clockOut = new Date(`1970-01-01T${form.value.clock_out_time}:00`)
        isClockOutNextDay = clockOut < clockIn
      }
      
      const updateData = {
        worker_id: form.value.worker_id ? Number(form.value.worker_id) : undefined,
        clock_in_time: formatTimeWithDate(form.value.clock_in_time, false),
        clock_out_time: formatTimeWithDate(form.value.clock_out_time, isClockOutNextDay),
        notes: form.value.notes,
        tasks: form.value.tasks.map(task => {
          // Determine if task end time is on the next day
          let isTaskEndNextDay = false
          if (task.start_time && task.end_time) {
            const start = new Date(`1970-01-01T${task.start_time}:00`)
            const end = new Date(`1970-01-01T${task.end_time}:00`)
            isTaskEndNextDay = end < start
          }
          
          return {
            id: task.id,
            description: task.description,
            work_order_id: task.selected_work_order?.id || undefined,
            start_time: formatTimeWithDate(task.start_time, false),
            end_time: formatTimeWithDate(task.end_time, isTaskEndNextDay),
            notes: task.notes,
            hours_worked: calculateHoursWorked(task.start_time, task.end_time)
          }
        }),
        issues: form.value.issues.map(issue => ({
          description: issue.description,
          resolution: issue.resolution,
          status: issue.status as 'open' | 'resolved'
        }))
      }
      console.log('Update data:', JSON.stringify(updateData, null, 2))
      response = await jobCardsService.updateJobCard(props.jobCard.id, updateData)
    } else {
      // Helper function to format time with date context for overnight shifts
      const formatTimeWithDate = (timeStr: string, isNextDay: boolean = false): string | undefined => {
        if (!timeStr) return undefined
        const date = new Date(form.value.date)
        if (isNextDay) {
          date.setDate(date.getDate() + 1)
        }
        const [hours, minutes] = timeStr.split(':')
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        return date.toISOString()
      }
      
      // Determine if clock out is on the next day
      let isClockOutNextDay = false
      if (form.value.clock_in_time && form.value.clock_out_time) {
        const clockIn = new Date(`1970-01-01T${form.value.clock_in_time}:00`)
        const clockOut = new Date(`1970-01-01T${form.value.clock_out_time}:00`)
        isClockOutNextDay = clockOut < clockIn
      }
      
      response = await jobCardsService.createJobCard({
        worker_id: Number(form.value.worker_id),
        date: form.value.date,
        clock_in_time: formatTimeWithDate(form.value.clock_in_time, false),
        clock_out_time: formatTimeWithDate(form.value.clock_out_time, isClockOutNextDay),
        notes: form.value.notes,
        tasks: form.value.tasks.map(task => {
          // Determine if task end time is on the next day
          let isTaskEndNextDay = false
          if (task.start_time && task.end_time) {
            const start = new Date(`1970-01-01T${task.start_time}:00`)
            const end = new Date(`1970-01-01T${task.end_time}:00`)
            isTaskEndNextDay = end < start
          }
          
          return {
            description: task.description,
            work_order_id: task.selected_work_order?.id || undefined,
            start_time: formatTimeWithDate(task.start_time, false),
            end_time: formatTimeWithDate(task.end_time, isTaskEndNextDay),
            notes: task.notes,
            hours_worked: calculateHoursWorked(task.start_time, task.end_time)
          }
        }),
        issues: form.value.issues.map(issue => ({
          description: issue.description,
          resolution: issue.resolution,
          status: issue.status as 'open' | 'resolved'
        }))
      })
    }

    console.log('API Response:', response)
    
    if (response.success) {
      console.log('Save successful, updating form data')
      
      // Update the form data with the response from backend
      if (response.data && isEditing.value) {
        console.log('Backend response data:', response.data)
        console.log('Backend tasks:', response.data.tasks)
        
        // Update the job card data
        const updatedJobCard = response.data
        form.value.worker_id = updatedJobCard.worker_id
        form.value.date = updatedJobCard.date ? new Date(updatedJobCard.date).toISOString().split('T')[0] : ''
        form.value.clock_in_time = updatedJobCard.clock_in_time ? new Date(updatedJobCard.clock_in_time).toTimeString().slice(0, 5) : ''
        form.value.clock_out_time = updatedJobCard.clock_out_time ? new Date(updatedJobCard.clock_out_time).toTimeString().slice(0, 5) : ''
        form.value.notes = updatedJobCard.notes
        
        // Update tasks with work order data
        form.value.tasks = updatedJobCard.tasks?.map((task: any) => {
          console.log('Processing backend task:', task)
          console.log('task.work_order:', task.work_order)
          
          return {
            id: task.id,
            description: task.description,
            work_order_id: task.work_order_id,
            selected_work_order: task.work_order ? {
              id: task.work_order.id,
              title: task.work_order.title,
              work_order_number: task.work_order.work_order_number,
              status: task.work_order.status
            } : null,
            start_time: task.start_time ? new Date(task.start_time).toTimeString().slice(0, 5) : '',
            end_time: task.end_time ? new Date(task.end_time).toTimeString().slice(0, 5) : '',
            notes: task.notes,
            work_order_search: task.work_order?.title || '',
            work_order_results: []
          }
        }) || []
        
        // Update issues
        form.value.issues = updatedJobCard.issues?.map((issue: any) => ({
          description: issue.description,
          resolution: issue.resolution,
          status: issue.status
        })) || []
        
        // Update selected employee
        if (updatedJobCard.worker) {
          selectedEmployee.value = {
            id: updatedJobCard.worker.id,
            first_name: updatedJobCard.worker.first_name,
            last_name: updatedJobCard.worker.last_name,
            employee_number: updatedJobCard.worker.employee_number,
            department: updatedJobCard.worker.department?.name || 'Production'
          }
          employeeSearch.value = `${updatedJobCard.worker.first_name} ${updatedJobCard.worker.last_name}`
        }
      }
      
      console.log('Form data updated, emitting saved event')
      emit('saved')
    } else {
      console.error('Error saving job card:', (response as any).message)
      alert('Error saving job card: ' + (response as any).message)
    }
  } catch (error: any) {
    console.error('Error saving job card:', error)
    console.error('Error response data:', error.response?.data)
    console.error('Error response status:', error.response?.status)
    
    if (error.response?.data?.errors) {
      // Laravel validation errors
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('\n')
      alert('Validation errors:\n' + errorMessages)
    } else if (error.response?.data?.message) {
      alert('Error saving job card: ' + error.response.data.message)
    } else if (error instanceof Error) {
      alert('Error saving job card: ' + error.message)
    } else {
      alert('Error saving job card: An unknown error occurred')
    }
  } finally {
    console.log('Finally block, setting loading to false')
    loading.value = false
  }
}

const searchEmployees = async (query: string) => {
  console.log('Searching employees with query:', query)
  if (!query || query.length < 2) {
    employeeResults.value = []
    return
  }

  try {
    const response = await jobCardsService.getTechnicians()
    console.log('Response data:', response)
    if (response.success) {
      // Filter technicians based on search query
      const filteredData = response.data.filter((emp: any) =>
        emp.first_name.toLowerCase().includes(query.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(query.toLowerCase()) ||
        emp.employee_number?.toLowerCase().includes(query.toLowerCase())
      )
      // Transform to match expected employee structure
      employeeResults.value = filteredData.map((emp: any) => ({
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        employee_number: emp.employee_number,
        department: emp.department?.name || 'Production'
      }))
      console.log('Employee results:', employeeResults.value)
    } else {
      console.error('API returned error:', (response as any).message)
    }
  } catch (error) {
    console.error('Error searching employees:', error)
  }
}

const selectEmployee = (employee: any) => {
  selectedEmployee.value = employee
  form.value.worker_id = employee.id
  employeeSearch.value = `${employee.first_name} ${employee.last_name}`
  employeeResults.value = []
}

const calculateHoursWorked = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0
  
  const start = new Date(`1970-01-01T${startTime}:00`)
  const end = new Date(`1970-01-01T${endTime}:00`)
  
  let diffMs = end.getTime() - start.getTime()
  
  // Handle overnight shifts - if end time is before start time, add 24 hours
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000 // Add 24 hours in milliseconds
  }
  
  const diffHours = diffMs / (1000 * 60 * 60)
  
  return Math.round(diffHours * 100) / 100
}

onMounted(() => {
  if (isEditing.value && props.jobCard) {
    // Load existing job card data
    form.value = {
      worker_id: props.jobCard.worker_id,
      date: props.jobCard.date ? new Date(props.jobCard.date).toISOString().split('T')[0] : '',
      clock_in_time: props.jobCard.clock_in_time ? new Date(props.jobCard.clock_in_time).toTimeString().slice(0, 5) : '',
      clock_out_time: props.jobCard.clock_out_time ? new Date(props.jobCard.clock_out_time).toTimeString().slice(0, 5) : '',
      notes: props.jobCard.notes,
      tasks: props.jobCard.tasks?.map((task: any) => ({
        id: task.id,
        description: task.description,
        work_order_id: task.work_order_id,
        selected_work_order: task.selected_work_order || task.work_order || null,
        start_time: task.start_time ? new Date(task.start_time).toTimeString().slice(0, 5) : '',
        end_time: task.end_time ? new Date(task.end_time).toTimeString().slice(0, 5) : '',
        notes: task.notes,
        work_order_search: task.selected_work_order?.title || task.work_order?.title || '',
        work_order_results: []
      })) || [],
      issues: props.jobCard.issues?.map((issue: any) => ({
        description: issue.description,
        resolution: issue.resolution,
        status: issue.status
      })) || []
    }
    
    console.log('Form data after loading:', form.value)
    
    selectedEmployee.value = {
      id: props.jobCard.worker?.id,
      first_name: props.jobCard.worker?.first_name,
      last_name: props.jobCard.worker?.last_name,
      employee_number: props.jobCard.worker?.employee_number,
      department: props.jobCard.worker?.department?.name || 'Production'
    }
    employeeSearch.value = `${props.jobCard.worker?.first_name} ${props.jobCard.worker?.last_name}`
  }
  // Remove automatic addTask() call - let user add tasks manually
})
</script>
