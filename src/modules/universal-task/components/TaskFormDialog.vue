<template>
  <div v-if="visible" class="fixed inset-0 z-[110] overflow-hidden font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" @click="$emit('update:visible', false)"></div>

    <!-- Slide-over Panel -->
    <div class="absolute inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16">
      <div 
        class="w-screen max-w-4xl flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-white/20 dark:border-gray-800 relative z-20 slide-in-right overflow-hidden"
      >
        
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 shrink-0">
          <div class="flex items-center space-x-4">
             <div class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <i class="mdi mdi-checkbox-marked-circle-plus-outline text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ isEditing ? 'Edit Task' : 'New Universal Task' }}
              </h2>
              <p class="text-xs text-gray-400 font-medium mt-0.5">Define task details and requirements</p>
            </div>
          </div>

          <button
            @click="$emit('update:visible', false)"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          <!-- Section: Basic Information -->
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <h3 class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Basic Information</h3>
              <span class="h-px bg-slate-100 dark:bg-slate-800 flex-grow"></span>
            </div>

            <div class="space-y-5">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Task Title *</label>
                <div class="relative group">
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="What needs to be done?"
                    class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    :class="{ '!border-red-500 focus:ring-red-500/10': errors.title }"
                  />
                  <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
                    <i class="mdi mdi-format-title text-xl"></i>
                  </div>
                </div>
                <p v-if="errors.title" class="text-xs font-medium text-red-500 mt-1 ml-0.5 flex items-center">
                  <i class="mdi mdi-alert-circle-outline mr-1"></i> {{ errors.title }}
                </p>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Description</label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400"
                  placeholder="Provide more details about the task..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Section: Task Details -->
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <h3 class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Task Attributes</h3>
              <span class="h-px bg-slate-100 dark:bg-slate-800 flex-grow"></span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Category</label>
                <select
                  v-model="form.task_type"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Standard</option>
                  <option v-for="option in taskTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Status</label>
                <select
                  v-model="form.status"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Priority</label>
                <select
                  v-model="form.priority"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Est. Hours</label>
                <input
                  v-model="form.estimated_hours"
                  type="number"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          <!-- Section: Assignment & Context -->
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <h3 class="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Context & Team</h3>
              <span class="h-px bg-slate-100 dark:bg-slate-800 flex-grow"></span>
            </div>

            <div class="space-y-5">
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Link To</label>
                <div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    v-for="type in (['project', 'office', 'none'] as const)"
                    :key="type"
                    @click="linkType = type === 'none' ? null : type"
                    :class="[
                      (linkType === type || (type === 'none' && !linkType))
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    ]"
                    class="flex-1 py-1.5 text-xs font-bold capitalize rounded-lg transition-all"
                  >
                    {{ type }}
                  </button>
                </div>

                <div v-if="linkType" class="animate-in slide-in-from-top-2 duration-300">
                  <select
                    v-if="linkType === 'project'"
                    v-model="selectedProject"
                    @change="handleProjectSelect"
                    class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Project...</option>
                    <option v-for="proj in projects" :key="proj.id" :value="proj.id">
                      {{ proj.title }} ({{ proj.enquiry_number }})
                    </option>
                  </select>

                  <input
                    v-if="linkType === 'office'"
                    v-model="officeName"
                    @input="handleOfficeInput"
                    type="text"
                    placeholder="Enter office or location name..."
                    class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Responsible Department *</label>
                  <select
                    v-model="form.department_id"
                    class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    :class="{ '!border-red-500 focus:ring-red-500/10': errors.department_id }"
                  >
                    <option value="">Select Department...</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                  </select>
                  <p v-if="errors.department_id" class="text-xs font-medium text-red-500 mt-1 ml-0.5">{{ errors.department_id }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Due Date *</label>
                  <div class="relative group">
                    <input
                      v-model="form.due_date"
                      type="date"
                      class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    />
                    <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500">
                      <i class="mdi mdi-calendar-clock text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5 block mb-2">Assign Team Members</label>
                <TaskAssignmentManager 
                  ref="assignmentManagerRef"
                  :task-id="props.task?.id"
                  :initial-assignments="props.task?.assignments || []"
                  @assignments-updated="handleAssignmentsUpdated"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Tags</label>
                <div class="relative">
                  <select
                    v-model="selectedTag"
                    @change="addTagFromDropdown"
                    class="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Add a tag...</option>
                    <option v-for="tag in industryTags" :key="tag" :value="tag">{{ tag }}</option>
                  </select>
                </div>
                <div class="flex flex-wrap gap-2 mt-2.5">
                  <span
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    class="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-gray-700 transition-all group"
                  >
                    {{ tag }}
                    <button @click="removeTag(index)" class="ml-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <i class="mdi mdi-close-circle text-sm leading-none"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center space-x-3 shrink-0">
          <button
            type="button"
            @click="$emit('update:visible', false)"
            class="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="saving"
            @click="save"
            class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50"
          >
            <div v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            <i v-else class="mdi mdi-check-circle-outline text-lg"></i>
            <span>{{ isEditing ? 'Save Changes' : 'Create Task' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from '../composables/useToast'
import { useTaskStore } from '../stores/taskStore'
import { TASK_STATUSES, TASK_PRIORITIES, TASK_TYPES } from '../constants'
import type { Task, TaskFormData } from '../types'
import { useApi } from '@/modules/admin/shared/composables/useApi'
import api from '@/plugins/axios'
import { formatDateForInput } from '../utils/dateUtils'
import TaskAssignmentManager from './TaskAssignmentManager.vue'

// Components removed - using custom Tailwind implementations

// Props & Emits
interface Props {
  visible: boolean
  task?: Task | null
  parentTaskId?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  saved: [task: Task]
  cancelled: []
}>()

// Composables
const toast = useToast()
const taskStore = useTaskStore()

// Reactive state
const form = ref<TaskFormData>({
  title: '',
  description: '',
  task_type: '',
  status: 'pending',
  priority: 'medium',
  parent_task_id: undefined,
  taskable_type: undefined,
  taskable_id: undefined,
  department_id: undefined,
  assigned_user_id: undefined,
  estimated_hours: undefined,
  due_date: undefined,
  tags: [],
  metadata: {}
})

const errors = ref<Record<string, string>>({})
const saving = ref(false)
const assignmentManagerRef = ref<InstanceType<typeof TaskAssignmentManager> | null>(null)

// API composable
const { get } = useApi()

// Data sources
const departments = ref<Array<{ id: number; name: string }>>([])
const loadingDepartments = ref(false)

const employees = ref<Array<{ id: number; employee_id?: number; first_name: string; last_name: string; position?: string; displayName: string }>>([])
const employeeSuggestions = ref<Array<{ id: number; employee_id?: number; first_name: string; last_name: string; position?: string; displayName: string }>>([])
const selectedEmployee = ref<{ id: number; employee_id?: number; first_name: string; last_name: string; position?: string; displayName: string } | null>(null)
const loadingEmployees = ref(false)

const projects = ref<Array<{ id: number; title: string; enquiry_number: string; client?: { full_name: string }; displayName: string }>>([])
const selectedProject = ref<number | null>(null)
const loadingProjects = ref(false)

const linkType = ref<'project' | 'office' | null>(null)
const officeName = ref('')
const employeeSearch = ref('')
const tagInput = ref('')
const selectedTag = ref('')
const industryTags = ref([
  'important', 'office', 'departmental', 'urgent',
  'priority', 'follow-up', 'documentation',
  'meeting', 'training', 'review', 'client',
  'internal', 'external', 'administrative'
])

// Computed
const isEditing = computed(() => !!props.task)

const statusOptions = computed(() =>
  Object.entries(TASK_STATUSES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

const priorityOptions = computed(() =>
  Object.entries(TASK_PRIORITIES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

const taskTypeOptions = computed(() =>
  Object.entries(TASK_TYPES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

// Data fetching methods
const fetchDepartments = async () => {
  loadingDepartments.value = true
  try {
    const response = await get<Array<{ id: number; name: string }> | { data: Array<{ id: number; name: string }> }>('/api/hr/departments', { per_page: 1000 })
    
    let departmentsArray: Array<{ id: number; name: string }> = []
    if (Array.isArray(response)) {
      departmentsArray = response
    } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
      departmentsArray = (response as any).data
    }
    
    departments.value = departmentsArray
  } catch (error) {
    console.error('Error fetching departments:', error)
    departments.value = []
  } finally {
    loadingDepartments.value = false
  }
}

const searchEmployees = async (event: { query: string }) => {
  if (!event.query || event.query.length < 2) {
    employeeSuggestions.value = []
    return
  }

  loadingEmployees.value = true
  try {
    const response = await get('/api/hr/employees', {
      search: event.query.trim(),
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
    employeeSuggestions.value = employeesArray
      .filter((emp: any) => emp.first_name || emp.last_name)
      .map((emp: any) => ({
        id: emp.user_id || emp.id, // Use user_id if available, fallback to employee id
        employee_id: emp.id,
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        position: emp.position,
        displayName: `${emp.first_name || ''} ${emp.last_name || ''}`.trim()
      }))
      .slice(0, 10) // Limit to 10 results
  } catch (error) {
    console.error('Error searching employees:', error)
    employeeSuggestions.value = []
  } finally {
    loadingEmployees.value = false
  }
}

const fetchProjects = async () => {
  loadingProjects.value = true
  try {
    const response = await api.get('/api/projects/enquiries', { params: { per_page: 1000 } })
    const responseData = response.data
    
    let projectsArray: any[] = []
    if (responseData?.data?.data) {
      projectsArray = responseData.data.data
    } else if (Array.isArray(responseData?.data)) {
      projectsArray = responseData.data
    } else if (Array.isArray(responseData)) {
      projectsArray = responseData
    }
    
    projects.value = projectsArray.map((proj: any) => ({
      id: proj.id,
      title: proj.title,
      enquiry_number: proj.enquiry_number || `ENQ-${proj.id}`,
      client: proj.client,
      displayName: `${proj.title} (${proj.enquiry_number || `ENQ-${proj.id}`})`
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    projects.value = []
  } finally {
    loadingProjects.value = false
  }
}

const handleAssignmentsUpdated = (assignments: any[]) => {
  // We'll handle assignments when saving the form
  console.log('Assignments updated:', assignments)
}

const addTag = () => {
  if (tagInput.value.trim() && (!form.value.tags || form.value.tags.length < 10)) {
    if (!form.value.tags) form.value.tags = []
    form.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const addTagFromDropdown = () => {
  if (selectedTag.value && (!form.value.tags || form.value.tags.length < 10)) {
    if (!form.value.tags) form.value.tags = []
    if (!form.value.tags.includes(selectedTag.value)) {
      form.value.tags.push(selectedTag.value)
    }
    selectedTag.value = ''
  }
}

const removeTag = (index: number) => {
  if (form.value.tags) {
    form.value.tags.splice(index, 1)
  }
}

const handleProjectSelect = () => {
  if (selectedProject.value) {
    form.value.taskable_type = 'App\\Models\\ProjectEnquiry'
    form.value.taskable_id = selectedProject.value
  } else {
    form.value.taskable_type = undefined
    form.value.taskable_id = undefined
  }
}

const handleOfficeInput = () => {
  if (!form.value.metadata) {
    form.value.metadata = {}
  }
  form.value.metadata.office = officeName.value
}

// Methods
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    task_type: '',
    status: 'pending',
    priority: 'medium',
    parent_task_id: undefined,
    taskable_type: undefined,
    taskable_id: undefined,
    department_id: undefined,
    assigned_user_id: undefined,
    estimated_hours: undefined,
    due_date: undefined,
    tags: [],
    metadata: {}
  }
  errors.value = {}
  selectedEmployee.value = null
  selectedProject.value = null
  linkType.value = null
  officeName.value = ''
  employeeSearch.value = ''
  tagInput.value = ''
  // Reset assignment manager if it exists
  if (assignmentManagerRef.value) {
    // This would require a reset method on the assignment manager
  }
}

const populateForm = (task: Task) => {
  form.value = {
    title: task.title,
    description: task.description || '',
    task_type: task.task_type || '',
    status: task.status,
    priority: task.priority,
    parent_task_id: task.parent_task_id || props.parentTaskId || undefined,
    taskable_type: task.taskable_type || undefined,
    taskable_id: task.taskable_id || undefined,
    department_id: task.department_id || undefined,
    assigned_user_id: task.assigned_user_id || undefined,
    estimated_hours: task.estimated_hours || undefined,
    due_date: task.due_date ? formatDateForInput(task.due_date) : undefined,
    tags: task.tags || [],
    metadata: task.metadata || {}
  }  
  // Set selected employee if assigned
  if (task.assignedUser) {
    selectedEmployee.value = {
      id: task.assignedUser.id, // This should be the user ID
      employee_id: undefined,
      first_name: task.assignedUser.name.split(' ')[0] || '',
      last_name: task.assignedUser.name.split(' ').slice(1).join(' ') || '',
      displayName: task.assignedUser.name
    }
    employeeSearch.value = task.assignedUser.name
  }
  
  // Set selected project if linked
  if (task.taskable_type === 'App\\Models\\ProjectEnquiry' && task.taskable_id) {
    selectedProject.value = task.taskable_id
    linkType.value = 'project'
  } else if (task.metadata?.office) {
    linkType.value = 'office'
    officeName.value = task.metadata.office
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  // Required fields validation
  if (!form.value.title?.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!form.value.department_id) {
    errors.value.department_id = 'Department is required'
  }

  if (!form.value.status) {
    errors.value.status = 'Status is required'
  }

  if (!form.value.priority) {
    errors.value.priority = 'Priority is required'
  }

  if (!form.value.due_date) {
    errors.value.due_date = 'Due date is required'
  }

  // Assignee validation is now handled by TaskAssignmentManager
  // if (!form.value.assigned_user_id) {
  //   errors.value.assigned_user_id = 'Assignee is required'
  // }

  if (!form.value.task_type) {
    errors.value.task_type = 'Task type is required'
  }

  if (form.value.estimated_hours && form.value.estimated_hours < 0) {
    errors.value.estimated_hours = 'Estimated hours must be positive'
  }

  return Object.keys(errors.value).length === 0
}

const save = async () => {
  console.log('Save button clicked')
  if (!validateForm()) {
    console.log('Form validation failed', errors.value)
    return
  }
  saving.value = true
  console.log('Creating task with form data:', form.value)
  console.log('Parent task ID:', props.parentTaskId)

  try {
    // Prepare form data
    const formData: any = {
      ...form.value,
      due_date: form.value.due_date // Already in YYYY-MM-DD format
    }
    
    // Handle office linking (store in metadata)
    if (linkType.value === 'office' && officeName.value) {
      formData.metadata = {
        ...(formData.metadata || {}),
        office: officeName.value
      }
      // Clear taskable fields if office is selected
      formData.taskable_type = undefined
      formData.taskable_id = undefined
    } else if (linkType.value === 'project') {
      // Project linking is already handled by handleProjectSelect
      // Clear office from metadata
      if (formData.metadata) {
        const { office, ...rest } = formData.metadata
        formData.metadata = Object.keys(rest).length > 0 ? rest : undefined
      }
    } else {
      // No linking - clear both
      formData.taskable_type = undefined
      formData.taskable_id = undefined
      if (formData.metadata) {
        const { office, ...rest } = formData.metadata
        formData.metadata = Object.keys(rest).length > 0 ? rest : undefined
      }
    }

    let task: Task | null = null

    if (isEditing.value && props.task) {
      task = await taskStore.updateTask(props.task.id, formData)
      
      // Handle assignments for existing tasks
      if (assignmentManagerRef.value) {
        const assignments = assignmentManagerRef.value.getAssignmentsPayload()
        if (assignments.length > 0) {
          await taskStore.assignMultiple(props.task.id, assignments)
        }
      }
    } else {
      // Create task or subtask
      if (props.parentTaskId) {
        // Create subtask
        task = await taskStore.createSubtask(props.parentTaskId, formData)
      } else {
        // Create regular task
        task = await taskStore.createTask(formData)
      }
      
      // Then assign users if it's a new task
      if (task && assignmentManagerRef.value) {
        const assignments = assignmentManagerRef.value.getAssignmentsPayload()
        if (assignments.length > 0) {
          await taskStore.assignMultiple(task.id, assignments)
        }
      }
    }

    if (task) {
      emit('saved', task)
      resetForm()
    } else {
      toast.error(`Failed to ${isEditing.value ? 'update' : 'create'} task`)
    }
  } catch (error: any) {
    console.error('Error creating task:', error)
    toast.error(error.message || `Failed to ${isEditing.value ? 'update' : 'create'} task`)
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  resetForm()
  emit('cancelled')
}

// Lifecycle
onMounted(async () => {
  await fetchDepartments()
  await fetchProjects()
})

// Watchers
watch(() => props.task, (newTask) => {
  if (newTask) {
    populateForm(newTask)
  } else {
    resetForm()
    // When creating a new task (not editing), set parent_task_id if provided
    if (props.parentTaskId) {
      form.value.parent_task_id = props.parentTaskId
    }
  }
}, { immediate: true })

watch(() => props.visible, async (visible) => {
  if (visible) {
    // Refresh data when dialog opens
    await fetchDepartments()
    await fetchProjects()
  } else {
    resetForm()
  }
})

watch(() => linkType.value, (newType) => {
  if (newType === 'project') {
    // Clear office when switching to project
    officeName.value = ''
    if (form.value.metadata) {
      delete form.value.metadata.office
    }
  } else if (newType === 'office') {
    // Clear project when switching to office
    selectedProject.value = null
    form.value.taskable_type = undefined
    form.value.taskable_id = undefined
  } else {
    // Clear both when switching to none
    officeName.value = ''
    selectedProject.value = null
    form.value.taskable_type = undefined
    form.value.taskable_id = undefined
    if (form.value.metadata) {
      delete form.value.metadata.office
    }
  }
})
</script>

<style scoped>
/* Desktop: slide from right */
@media (min-width: 641px) {
  .slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Mobile: no animation, centered */
@media (max-width: 640px) {
  .slide-in-right {
    animation: none;
    transform: none;
  }
}
</style>