<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Home
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/procurement/requisitions" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Requisitions
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">New Requisition</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Requisition</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Submit a new material requisition</p>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="handleSubmit">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.date }"
            />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date[0] }}</p>
          </div>

          <!-- Requested By Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Requested By <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.requested_by_type"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="office">Office/Department</option>
              <option value="project">Project</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <!-- Urgency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Urgency <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.urgency"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <!-- Conditional Fields -->
        <div class="mb-6">
          <!-- Project Selection -->
          <div v-if="formData.requested_by_type === 'project'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.project_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Project</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <!-- Employee Selection -->
          <div v-if="formData.requested_by_type === 'employee'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.employee_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Employee</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.name }}
              </option>
            </select>
          </div>

          <!-- Department Selection -->
          <div v-if="formData.requested_by_type === 'office'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.department_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Requisition Items</h3>
            <button
              type="button"
              @click="addItem"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Item
            </button>
          </div>

          <RequisitionItemsTable
            :items="formData.items"
            @update="updateItem"
            @remove="removeItem"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading || formData.items.length === 0"
            class="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Submitting...' : 'Submit Requisition' }}
          </button>
          <router-link
            to="/procurement/requisitions"
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import type { RequisitionItem } from '../../shared/types/requisitions'
import RequisitionItemsTable from '../../components/RequisitionItemsTable.vue'
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const projects = ref<Array<{ id: number; name: string }>>([])
const employees = ref<Array<{ id: number; name: string }>>([])
const departments = ref<Array<{ id: number; name: string }>>([])

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  requested_by_type: 'office' as 'office' | 'project' | 'employee',
  project_id: undefined as number | undefined,
  employee_id: undefined as number | undefined,
  department_id: undefined as number | undefined,
  urgency: 'normal' as 'normal' | 'urgent',
  items: [] as RequisitionItem[]
})

const fetchProjects = async () => {
  try {
    const response = await axios.get('/api/projects/projects')
    projects.value = response.data.data || response.data
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  }
}

const fetchEmployees = async () => {
  try {
    const response = await axios.get('/api/hr/employees')
    employees.value = response.data.data || response.data
  } catch (e) {
    console.error('Failed to fetch employees:', e)
  }
}

const fetchDepartments = async () => {
  try {
    const response = await axios.get('/api/hr/departments')
    departments.value = response.data.data || response.data
  } catch (e) {
    console.error('Failed to fetch departments:', e)
  }
}

const addItem = () => {
  formData.value.items.push({
    material_id: 0,
    quantity: 1,
    purpose: '',
    reason: '',
    sku_search: '',
    showDropdown: false,
    searchResults: [],
    loading: false
  })
}

const updateItem = (index: number, updatedItem: Partial<RequisitionItem>) => {
  formData.value.items[index] = { ...formData.value.items[index], ...updatedItem }
}

const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    const payload = {
      ...formData.value,
      items: formData.value.items.map(item => ({
        material_id: item.material_id,
        quantity: item.quantity,
        purpose: item.purpose,
        reason: item.reason
      }))
    }

    const response = await axios.post('/api/procurement-stores/requisitions', payload)
    
    if (response.data && response.data.id) {
      router.push(`/procurement/requisition/${response.data.id}`)
    } else if (response.data.data && response.data.data.id) {
      router.push(`/procurement/requisition/${response.data.data.id}`)
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      errors.value = error.response.data.error
      errorMessage.value = Object.values(error.response.data.error).flat().join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An error occurred while creating the requisition.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchProjects(), fetchEmployees(), fetchDepartments()])
  addItem() // Add first item by default
})
</script>