// Universal Task Store - Pinia Store for Task Management
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  Task,
  TaskFilters,
  PaginationState,
  SortState,
  TaskFormData,
  TaskStoreState,
  ApiResponse
} from '../types';
import { DEFAULTS, PAGINATION_DEFAULTS } from '../constants';
import taskApi from '../services/api';

export const useTaskStore = defineStore('universalTask', () => {
  // ==================== Reactive State ====================

  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const filters = ref<TaskFilters>({});
  const pagination = ref<PaginationState>({
    page: DEFAULTS.PAGINATION_PAGE,
    per_page: DEFAULTS.PAGINATION_PER_PAGE
  });
  const sort = ref<SortState>({
    field: DEFAULTS.SORT_FIELD,
    direction: DEFAULTS.SORT_DIRECTION
  });

  const loading = ref({
    tasks: false,
    task: false,
    create: false,
    update: false,
    delete: false,
    assign: false,
    status: false
  });

  const errors = ref<Record<string, string>>({});

  // ==================== Getters ====================

  const filteredTasks = computed(() => {
    // Client-side filtering if needed (server-side is preferred)
    return tasks.value;
  });

  const taskById = computed(() => {
    return (id: number) => tasks.value.find(task => task.id === id);
  });

  const overdueTasksCount = computed(() => {
    return tasks.value.filter(task => task.status === 'overdue').length;
  });

  const tasksByStatus = computed(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.value.forEach(task => {
      if (!grouped[task.status]) {
        grouped[task.status] = [];
      }
      grouped[task.status].push(task);
    });
    return grouped;
  });

  const myTasks = computed(() => {
    // This would need current user ID from auth store
    return tasks.value.filter(task => task.assigned_user_id === 1); // Placeholder
  });

  // ==================== Actions ====================

  async function fetchTasks(options: {
    filters?: TaskFilters;
    pagination?: Partial<PaginationState>;
    sort?: Partial<SortState>;
    append?: boolean;
  } = {}) {
    loading.value.tasks = true;
    errors.value.tasks = '';

    try {
      // Update filters, pagination, sort
      if (options.filters) {
        filters.value = { ...filters.value, ...options.filters };
      }
      if (options.pagination) {
        pagination.value = { ...pagination.value, ...options.pagination };
      }
      if (options.sort) {
        sort.value = { ...sort.value, ...options.sort };
      }

      const params = {
        ...filters.value,
        ...pagination.value,
        sort_by: sort.value.field,
        sort_direction: sort.value.direction
      };

      const response = await taskApi.getTasks(params);

      if (response.success) {
        if (options.append) {
          tasks.value.push(...response.data);
        } else {
          tasks.value = response.data;
        }

        // Update pagination meta
        if (response.meta?.pagination) {
          pagination.value = {
            ...pagination.value,
            ...response.meta.pagination
          };
        }
      } else {
        errors.value.tasks = response.error?.message || 'Failed to fetch tasks';
      }
    } catch (error: any) {
      errors.value.tasks = error.message || 'An error occurred while fetching tasks';
      console.error('Error fetching tasks:', error);
    } finally {
      loading.value.tasks = false;
    }
  }

  async function fetchTask(id: number) {
    loading.value.task = true;
    errors.value.task = '';

    try {
      const response = await taskApi.getTask(id);

      if (response.success && response.data) {
        currentTask.value = response.data;

        // Update task in tasks array if it exists
        const index = tasks.value.findIndex(task => task.id === id);
        if (index !== -1) {
          tasks.value[index] = response.data;
        }
      } else {
        errors.value.task = response.error?.message || 'Failed to fetch task';
      }
    } catch (error: any) {
      errors.value.task = error.message || 'An error occurred while fetching task';
      console.error('Error fetching task:', error);
    } finally {
      loading.value.task = false;
    }
  }

  async function createTask(data: TaskFormData): Promise<Task | null> {
    loading.value.create = true;
    errors.value.create = '';

    try {
      const response = await taskApi.createTask(data);

      if (response.success && response.data) {
        const newTask = response.data;
        tasks.value.unshift(newTask); // Add to beginning of list
        return newTask;
      } else {
        errors.value.create = response.error?.message || 'Failed to create task';
        return null;
      }
    } catch (error: any) {
      errors.value.create = error.message || 'An error occurred while creating task';
      console.error('Error creating task:', error);
      return null;
    } finally {
      loading.value.create = false;
    }
  }

  async function updateTask(id: number, data: Partial<TaskFormData>): Promise<Task | null> {
    loading.value.update = true;
    errors.value.update = '';

    try {
      const response = await taskApi.updateTask(id, data);

      if (response.success && response.data) {
        const updatedTask = response.data;

        // Update in tasks array
        const index = tasks.value.findIndex(task => task.id === id);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        // Update current task if it's the same
        if (currentTask.value?.id === id) {
          currentTask.value = updatedTask;
        }

        return updatedTask;
      } else {
        errors.value.update = response.error?.message || 'Failed to update task';
        return null;
      }
    } catch (error: any) {
      errors.value.update = error.message || 'An error occurred while updating task';
      console.error('Error updating task:', error);
      return null;
    } finally {
      loading.value.update = false;
    }
  }

  async function deleteTask(id: number): Promise<boolean> {
    loading.value.delete = true;
    errors.value.delete = '';

    try {
      const response = await taskApi.deleteTask(id);

      if (response.success) {
        // Remove from tasks array
        tasks.value = tasks.value.filter(task => task.id !== id);

        // Clear current task if it's the deleted one
        if (currentTask.value?.id === id) {
          currentTask.value = null;
        }

        return true;
      } else {
        errors.value.delete = response.error?.message || 'Failed to delete task';
        return false;
      }
    } catch (error: any) {
      errors.value.delete = error.message || 'An error occurred while deleting task';
      console.error('Error deleting task:', error);
      return false;
    } finally {
      loading.value.delete = false;
    }
  }

  async function assignTask(id: number, userIds: number[], role?: string, replaceExisting: boolean = false): Promise<Task | null> {
    loading.value.assign = true;
    errors.value.assign = '';

    try {
      const response = await taskApi.assignTask(id, userIds, role, replaceExisting);

      if (response.success && response.data) {
        const updatedTask = response.data;

        // Update in tasks array
        const index = tasks.value.findIndex(task => task.id === id);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        // Update current task if it's the same
        if (currentTask.value?.id === id) {
          currentTask.value = updatedTask;
        }

        return updatedTask;
      } else {
        errors.value.assign = response.error?.message || 'Failed to assign task';
        return null;
      }
    } catch (error: any) {
      errors.value.assign = error.message || 'An error occurred while assigning task';
      console.error('Error assigning task:', error);
      return null;
    } finally {
      loading.value.assign = false;
    }
  }

  async function updateTaskStatus(id: number, status: string, notes?: string): Promise<Task | null> {
    loading.value.status = true;
    errors.value.status = '';

    try {
      const response = await taskApi.updateTaskStatus(id, status, notes);

      if (response.success && response.data) {
        const updatedTask = response.data;

        // Update in tasks array
        const index = tasks.value.findIndex(task => task.id === id);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        // Update current task if it's the same
        if (currentTask.value?.id === id) {
          currentTask.value = updatedTask;
        }

        return updatedTask;
      } else {
        errors.value.status = response.error?.message || 'Failed to update task status';
        return null;
      }
    } catch (error: any) {
      errors.value.status = error.message || 'An error occurred while updating task status';
      console.error('Error updating task status:', error);
      return null;
    } finally {
      loading.value.status = false;
    }
  }

  // ==================== Utility Actions ====================

  function clearErrors() {
    errors.value = {};
  }

  function resetFilters() {
    filters.value = {};
    pagination.value.page = DEFAULTS.PAGINATION_PAGE;
    sort.value = {
      field: DEFAULTS.SORT_FIELD,
      direction: DEFAULTS.SORT_DIRECTION
    };
  }

  function setCurrentTask(task: Task | null) {
    currentTask.value = task;
  }

  function updateTaskInList(updatedTask: Task) {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  }

  // ==================== Persistence ====================

  function saveFiltersToStorage() {
    localStorage.setItem('universal_task_filters', JSON.stringify(filters.value));
  }

  function loadFiltersFromStorage() {
    const saved = localStorage.getItem('universal_task_filters');
    if (saved) {
      try {
        filters.value = { ...filters.value, ...JSON.parse(saved) };
      } catch (error) {
        console.warn('Failed to load saved filters:', error);
      }
    }
  }

  // ==================== Return Store Interface ====================

  return {
    // State
    tasks,
    currentTask,
    filters,
    pagination,
    sort,
    loading,
    errors,

    // Getters
    filteredTasks,
    taskById,
    overdueTasksCount,
    tasksByStatus,
    myTasks,

    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateTaskStatus,

    // Utilities
    clearErrors,
    resetFilters,
    setCurrentTask,
    updateTaskInList,
    saveFiltersToStorage,
    loadFiltersFromStorage
  };
});