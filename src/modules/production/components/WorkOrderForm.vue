<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Work Order' : (props.isEditOnly ? 'View Work Order' : 'Create Work Order') }}</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="form">
        <template v-if="showFullFields">
          <div class="form-group">
            <label for="wo-number">Work Order Number *</label>
            <input
              id="wo-number"
              v-model="form.work_order_number"
              type="text"
              required
              :disabled="isEditing"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="quantity">Quantity *</label>
            <input
              id="quantity"
              v-model.number="form.quantity"
              type="number"
              required
              min="1"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="specifications">Specifications</label>
            <textarea
              id="specifications"
              v-model="form.specifications"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </template>

        <div class="form-row">
          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" v-model="form.status" required class="form-input">
              <option value="in_progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="form-group">
            <label for="priority">Priority *</label>
            <select id="priority" v-model="form.priority" required class="form-input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="due-date">Due Date</label>
          <input
            id="due-date"
            v-model="form.due_date"
            type="date"
            class="form-input"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="form-actions">
          <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
          <button type="submit" :disabled="submitting" class="btn-submit">
            {{ submitting ? 'Saving...' : 'Save Work Order' }}
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-submit {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #d0d0d0;
}

.btn-submit {
  background-color: #4caf50;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
