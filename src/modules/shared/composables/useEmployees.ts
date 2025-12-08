import { ref, readonly } from 'vue'
import type { Employee, EmployeeFilters, CreateEmployeeData, UpdateEmployeeData } from '../types/employee'
import { useApi } from '../../admin/shared/composables/useApi'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export function useEmployees() {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  const { get, post, put, delete: deleteApi } = useApi()

  const fetchEmployees = async (filters?: EmployeeFilters) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const params: Record<string, string | number | undefined> = {}
      if (filters?.search) params.search = filters.search
      if (filters?.department) params.department_id = filters.department
      if (filters?.department_id) params.department_id = filters.department_id
      if (filters?.position) params.position = filters.position
      if (filters?.status) params.status = filters.status
      if (filters?.is_active !== undefined) params.status = filters.is_active ? 'active' : 'inactive'
      if (filters?.employment_type) params.employment_type = filters.employment_type
      if (filters?.page) params.page = filters.page
      if (filters?.per_page) params.per_page = filters.per_page

      const responseData = await get('/api/hr/employees', params) // useApi.get() already returns response.data


      // Handle both paginated response {data: [...], meta: ...} and direct array response [...]
      if (Array.isArray(responseData)) {
        // Direct array response (no pagination)
        employees.value = responseData as Employee[]
        pagination.value = {
          current_page: 1,
          last_page: 1,
          per_page: responseData.length,
          total: responseData.length,
          from: 1,
          to: responseData.length
        }
      } else if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray((responseData as { data: unknown[] }).data)) {
        // Paginated response
        const paginatedData = responseData as { data: Employee[], meta?: PaginationMeta, current_page?: number, last_page?: number, per_page?: number, total?: number, from?: number, to?: number }
        employees.value = paginatedData.data || []

        // Extract pagination metadata (support both Laravel pagination formats)
        if (paginatedData.meta) {
          pagination.value = paginatedData.meta
        } else {
          pagination.value = {
            current_page: paginatedData.current_page || 1,
            last_page: paginatedData.last_page || 1,
            per_page: paginatedData.per_page || 15,
            total: paginatedData.total || 0,
            from: paginatedData.from || 0,
            to: paginatedData.to || 0
          }
        }
      } else {
        employees.value = []
        pagination.value = {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
          from: 0,
          to: 0
        }
      }
    } catch (err) {
      error.value = 'Failed to fetch employees'
      console.error('Error fetching employees:', err)
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (employeeData: CreateEmployeeData) => {
    loading.value = true
    error.value = null
    try {
      const response = await post('/api/hr/employees', employeeData as unknown as Record<string, unknown>)
      const responseData = response.data

      // Handle both direct object response and wrapped response
      const newEmployee = (responseData && typeof responseData === 'object' && 'data' in responseData)
        ? (responseData as { data: Employee }).data
        : responseData as Employee
      employees.value = [newEmployee, ...employees.value]
      return newEmployee
    } catch (err) {
      error.value = 'Failed to create employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEmployee = async (id: number, employeeData: UpdateEmployeeData) => {
    loading.value = true
    error.value = null
    try {
      const response = await put(`/api/hr/employees/${id}`, employeeData as unknown as Record<string, unknown>)
      const responseData = response.data

      // Handle both direct object response and wrapped response
      const updatedEmployee = (responseData && typeof responseData === 'object' && 'data' in responseData)
        ? (responseData as { data: Employee }).data
        : responseData as Employee
      const index = employees.value.findIndex(e => e.id === id)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
      return updatedEmployee
    } catch (err) {
      error.value = 'Failed to update employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteEmployee = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await deleteApi(`/api/hr/employees/${id}`)
      employees.value = employees.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = 'Failed to delete employee'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    employees: readonly(employees),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}
