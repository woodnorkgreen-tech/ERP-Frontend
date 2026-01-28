<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Work Order' : (props.isEditOnly ? 'View Work Order' : 'Create Work Order') }}
        </h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <template v-if="showFullFields">
          <div>
            <label for="wo-number" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Order Number *</label>
            <input
              id="wo-number"
              v-model="form.work_order_number"
              type="text"
              required
              :disabled="isEditing"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity *</label>
            <input
              id="quantity"
              v-model.number="form.quantity"
              type="number"
              required
              min="1"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="specifications" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specifications</label>
            <textarea
              id="specifications"
              v-model="form.specifications"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
            <select
              id="priority"
              v-model="form.priority"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label for="due_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
            <input
              id="due_date"
              v-model="form.due_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </template>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            id="status"
            v-model="form.status"
            :disabled="props.isEditOnly"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="in_progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label for="assigned_to" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned To</label>
          <select
            id="assigned_to"
            v-model="form.assigned_to"
            :disabled="props.isEditOnly"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select Assignee</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700" v-if="!props.isEditOnly">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>

        <div class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700" v-else>
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWorkOrders } from '../composables'
import type { CreateWorkOrderPayload, UpdateWorkOrderPayload } from '../types'

export type WorkOrderStatus = 'in_progress' | 'approved' | 'completed' | 'on_hold' | 'cancelled'

interface Props {
  workOrderId?: number | null
  isEditOnly?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { fetchWorkOrder, selectedWorkOrder, updateWorkOrder, loading } = useWorkOrders()

const form = ref<CreateWorkOrderPayload>({
  work_order_number: '',
  title: '',
  quantity: 1,
  status: 'in_progress',
  priority: 'medium',
  specifications: null
})

const submitting = ref(false)
const error = ref('')
const users = ref<{id: number, name: string}[]>([
  { id: 1, name: 'User One' },
  { id: 2, name: 'User Two' },
  { id: 3, name: 'User Three' }
]) // Mock users for now

const isEditing = computed(() => !!props.workOrderId)
const showFullFields = computed(() => !(props.isEditOnly ?? false))

onMounted(async () => {
  if (isEditing.value && props.workOrderId) {
    await fetchWorkOrder(props.workOrderId)
    if (selectedWorkOrder.value) {
      form.value = {
        work_order_number: selectedWorkOrder.value.work_order_number,
        title: selectedWorkOrder.value.title,
        quantity: selectedWorkOrder.value.quantity,
        status: selectedWorkOrder.value.status,
        priority: selectedWorkOrder.value.priority,
        specifications: selectedWorkOrder.value.specifications,
        due_date: selectedWorkOrder.value.due_date || undefined
      }
    }
  }
})

const submitForm = async () => {
  error.value = ''
  submitting.value = true

  try {
    if (isEditing.value && props.workOrderId) {
      const updatePayload: UpdateWorkOrderPayload = {
        title: form.value.title,
        quantity: form.value.quantity,
        status: form.value.status,
        priority: form.value.priority,
        specifications: form.value.specifications,
        due_date: form.value.due_date
      }
      await updateWorkOrder(props.workOrderId, updatePayload)
    } else {
      // Manual creation is disabled; inform the user.
      error.value = 'Manual creation is disabled. Work orders are auto-created from enquiries.'
      submitting.value = false
      return
    }
    emit('saved')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>
