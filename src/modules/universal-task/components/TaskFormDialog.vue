<template>
  <!-- Custom Modal Dialog -->
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 transition-opacity" @click="$emit('update:visible', false)"></div>

    <!-- Modal Content -->
    <div class="flex justify-center sm:justify-end min-h-screen pt-4 px-4 pb-20 sm:block sm:p-0">
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg text-left overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-out sm:my-8 sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full sm:w-auto sm:ml-auto relative z-10 slide-in-right" role="dialog" aria-modal="true" aria-labelledby="modal-headline" @click.stop>
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-headline">
                {{ isEditing ? 'Edit Task' : 'Create Task' }}
              </h3>
              <div class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter task title"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.title }"
          />
          <small v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</small>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Enter task description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select priority</option>
              <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task Type</label>
            <select
              v-model="form.task_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select task type</option>
              <option v-for="option in taskTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Hours</label>
            <input
              v-model="form.estimated_hours"
              type="number"
              placeholder="Enter estimated hours"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="999"
            />
          </div>
        </div>
      </div>

      <!-- Assignment & Organization -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Assignment & Organization</h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department *</label>
            <select
              v-model="form.department_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.department_id }"
              :disabled="loadingDepartments"
            >
              <option value="">Select department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <small v-if="errors.department_id" class="text-red-500 text-xs mt-1">{{ errors.department_id }}</small>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignee</label>
            <input
              v-model="employeeSearch"
              type="text"
              placeholder="Type to search employees..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="searchEmployees({ query: employeeSearch })"
            />
            <div v-if="employeeSuggestions.length > 0" class="mt-1 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 shadow-lg">
              <div
                v-for="emp in employeeSuggestions"
                :key="emp.id"
                @click="selectEmployee(emp)"
                class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white"
              >
                {{ emp.displayName }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link To</label>
          <div class="flex gap-2 mb-2">
            <button
              type="button"
              @click="linkType = 'project'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                linkType === 'project'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Project
            </button>
            <button
              type="button"
              @click="linkType = 'office'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                linkType === 'office'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Office
            </button>
            <button
              type="button"
              @click="linkType = null; form.taskable_type = undefined; form.taskable_id = undefined"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                !linkType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              None
            </button>
          </div>

          <!-- Project/Enquiry Dropdown -->
          <select
            v-if="linkType === 'project'"
            v-model="selectedProject"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loadingProjects"
            @change="handleProjectSelect"
          >
            <option value="">Select project/enquiry</option>
            <option v-for="proj in projects" :key="proj.id" :value="proj.id">
              {{ proj.title }} ({{ proj.enquiry_number }})
            </option>
          </select>

          <!-- Office Input -->
          <input
            v-if="linkType === 'office'"
            v-model="officeName"
            type="text"
            placeholder="Enter office name or location"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="handleOfficeInput"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
          <input
            v-model="form.due_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :min="new Date().toISOString().split('T')[0]"
          />
        </div>
      </div>

      <!-- Additional Details -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Additional Details</h3>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
          <input
            v-model="tagInput"
            type="text"
            placeholder="Add tags (press Enter)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keydown.enter="addTag"
          />
          <div v-if="form.tags && form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="ml-1 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          </div>
        </div>
               </div>

               <!-- Footer -->
               <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                 <button
                   type="button"
                   :disabled="saving"
                   @click="save"
                   class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                 >
                   <span v-if="saving" class="mr-2">
                     <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                       <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                   </span>
                   {{ isEditing ? 'Update Task' : 'Create Task' }}
                 </button>
                 <button
                   type="button"
                   @click="cancel"
                   class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
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

// Components removed - using custom Tailwind implementations

// Props & Emits
interface Props {
  visible: boolean
  task?: Task | null
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

// API composable
const { get } = useApi()

// Data sources
const departments = ref<Array<{ id: number; name: string }>>([])
const loadingDepartments = ref(false)

const employees = ref<Array<{ id: number; first_name: string; last_name: string; position?: string; displayName: string }>>([])
const employeeSuggestions = ref<Array<{ id: number; first_name: string; last_name: string; position?: string; displayName: string }>>([])
const selectedEmployee = ref<{ id: number; first_name: string; last_name: string; position?: string; displayName: string } | null>(null)
const loadingEmployees = ref(false)

const projects = ref<Array<{ id: number; title: string; enquiry_number: string; client?: { full_name: string }; displayName: string }>>([])
const selectedProject = ref<number | null>(null)
const loadingProjects = ref(false)

const linkType = ref<'project' | 'office' | null>(null)
const officeName = ref('')
const employeeSearch = ref('')
const tagInput = ref('')

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

    // Filter and format employees - only show names
    employeeSuggestions.value = employeesArray
      .filter((emp: any) => emp.first_name || emp.last_name)
      .map((emp: any) => ({
        id: emp.id,
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

const handleEmployeeSelect = (event: { value: { id: number; displayName: string } }) => {
  form.value.assigned_user_id = event.value.id
}

const handleEmployeeClear = () => {
  form.value.assigned_user_id = undefined
  selectedEmployee.value = null
}

const selectEmployee = (emp: { id: number; first_name: string; last_name: string; position?: string; displayName: string }) => {
  selectedEmployee.value = emp
  form.value.assigned_user_id = emp.id
  employeeSearch.value = emp.displayName
  employeeSuggestions.value = []
}

const addTag = () => {
  if (tagInput.value.trim() && (!form.value.tags || form.value.tags.length < 10)) {
    if (!form.value.tags) form.value.tags = []
    form.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
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
}

const populateForm = (task: Task) => {
  form.value = {
    title: task.title,
    description: task.description || '',
    task_type: task.task_type || '',
    status: task.status,
    priority: task.priority,
    parent_task_id: task.parent_task_id || undefined,
    taskable_type: task.taskable_type || undefined,
    taskable_id: task.taskable_id || undefined,
    department_id: task.department_id || undefined,
    assigned_user_id: task.assigned_user_id || undefined,
    estimated_hours: task.estimated_hours || undefined,
    due_date: task.due_date || undefined,
    tags: task.tags || [],
    metadata: task.metadata || {}
  }
  
  // Set selected employee if assigned
  if (task.assignedUser) {
    selectedEmployee.value = {
      id: task.assignedUser.id,
      first_name: task.assignedUser.name.split(' ')[0] || '',
      last_name: task.assignedUser.name.split(' ').slice(1).join(' ') || '',
      displayName: task.assignedUser.name
    }
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

  if (!form.value.title?.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!form.value.department_id) {
    errors.value.department_id = 'Department is required'
  }

  if (form.value.estimated_hours && form.value.estimated_hours < 0) {
    errors.value.estimated_hours = 'Estimated hours must be positive'
  }

  return Object.keys(errors.value).length === 0
}

const save = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

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
    } else {
      task = await taskStore.createTask(formData)
    }

    if (task) {
      emit('saved', task)
      resetForm()
    } else {
      toast.error(`Failed to ${isEditing.value ? 'update' : 'create'} task`)
    }
  } catch (error: any) {
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