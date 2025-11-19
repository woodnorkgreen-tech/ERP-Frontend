<template>
  <div class="budget-additions-tab">
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'main'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'main'
              ? 'border-green-500 text-green-600 dark:text-green-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Manual Additions
        </button>
        <button
          @click="activeTab = 'supplementary'"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'supplementary'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Auto-Detected Additions
        </button>
      </nav>
    </div>

    <!-- Header with Add Button (only for main tab) -->
    <div v-if="activeTab === 'main'" class="flex justify-between items-center mb-6">
      <div>
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Manual Budget Additions</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ readonly ? 'Approved manual additions to the original budget' : 'Create custom budget additions that are automatically approved upon creation. These are changes you manually add to the project scope.' }}
        </p>
      </div>
      <button
        v-if="!readonly"
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Add New Addition
      </button>
    </div>

    <!-- Header for supplementary tab -->
    <div v-if="activeTab === 'supplementary'" class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Auto-Detected Additions</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ readonly ? 'Approved auto-detected additions to the original budget' : 'Review additional materials detected from the Materials Task. Set prices before approving them.' }}
      </p>
    </div>

    <!-- Additions List -->
    <div v-if="filteredAdditions.length > 0" class="space-y-4">
  <div
    v-for="addition in filteredAdditions"
    :key="addition.id"
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
  >
    <!-- Header with Status and Actions -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <h5 class="text-lg font-semibold text-gray-900 dark:text-white">{{ addition.title }}</h5>
          <span
            v-if="addition.budget_type === 'supplementary'"
            :class="getStatusBadgeClass(addition.status)"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ getStatusLabel(addition.status) }}
          </span>
        </div>
        <p v-if="addition.description" class="text-sm text-gray-600 dark:text-gray-400">
          {{ addition.description }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Action buttons for supplementary additions -->
        <template v-if="addition.budget_type === 'supplementary' && addition.status === 'pending_approval' && !readonly">
          <button
            @click="editAddition(addition)"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mr-2"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Set Price
          </button>
          <button
            @click="approveAddition(addition.id)"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Approve
          </button>
          <button
            @click="rejectAddition(addition.id)"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Reject
          </button>
        </template>
        <!-- Edit/Delete buttons for main additions or approved supplementary -->
        <template v-if="(addition.budget_type === 'main' || addition.status === 'approved') && !readonly">
          <button
            @click="editAddition(addition)"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button
            v-if="addition.status === 'draft'"
            @click="deleteAddition(addition.id)"
            class="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </template>
      </div>
    </div>

    <!-- Materials Details -->
    <div v-if="addition.materials && addition.materials.length > 0" class="mb-3">
      <h6 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Materials Detected:</h6>
      <div class="space-y-2">
        <div
          v-for="material in addition.materials"
          :key="material.id || material.description"
          class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
        >
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ material.description }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">Qty: {{ material.quantity }}</span>
          </div>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            KES {{ (material.quantity * material.unit_price).toFixed(2) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Source Information (for supplementary additions) -->
    <div v-if="addition.budget_type === 'supplementary' && addition.source_type === 'materials_additional'" class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <span>Auto-detected from Materials Task</span>
      <span v-if="addition.sourceMaterial">• {{ addition.sourceMaterial.description }}</span>
    </div>

    <!-- Footer with creation/approval info -->
    <div v-if="addition.status !== 'draft'" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Created by {{ addition.creator?.name || 'Unknown' }}</span>
        <span v-if="addition.approved_by">Approved by {{ addition.approver?.name || 'Unknown' }}</span>
      </div>
    </div>
  </div>
  </div>

  <!-- Empty State -->
  <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ activeTab === 'main' ? (readonly ? 'No approved manual additions' : 'No manual additions yet') : (readonly ? 'No approved auto-detected additions' : 'No auto-detected additions pending') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ activeTab === 'main' ? (readonly ? 'This budget has no approved manual additions.' : 'Create custom additions to modify the project scope. These will be automatically approved.') : (readonly ? 'This budget has no approved auto-detected additions.' : 'The system will automatically detect additional materials from the Materials Task and list them here for your review. Set prices before approving them.') }}
      </p>
      <div v-if="!readonly && activeTab === 'main'" class="mt-6">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Create Manual Addition
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingAddition"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ editingAddition ? 'Edit Budget Addition' : 'Create Budget Addition' }}
          </h3>

          <form @submit.prevent="saveAddition" class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                v-model="additionForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Additional Lighting Equipment"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                v-model="additionForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe the reason for this addition..."
              ></textarea>
            </div>

            <!-- Budget Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget Type *
              </label>
              <select
                v-model="additionForm.budget_type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="main">Manual Addition (Auto-approved)</option>
                <option value="supplementary">Auto-Detected Addition (Requires approval)</option>
              </select>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Manual additions are automatically approved upon creation. Auto-detected additions require review and approval before becoming part of the budget.
              </p>
            </div>

            <!-- Materials Section -->
            <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Materials</h4>
              <div v-if="additionForm.materials.length > 0" class="space-y-2 mb-3">
                <div
                  v-for="(material, index) in additionForm.materials"
                  :key="index"
                  class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <input
                    v-model="material.description"
                    type="text"
                    placeholder="Description"
                    class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                  />
                  <input
                    v-model.number="material.quantity"
                    type="number"
                    step="0.01"
                    placeholder="Qty"
                    class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                  />
                  <input
                    v-model.number="material.unit_price"
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                  />
                  <button
                    @click="removeMaterial(index)"
                    type="button"
                    class="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="addMaterial"
                type="button"
                class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                + Add Material
              </button>
            </div>

            <!-- Labour Section -->
            <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Labour</h4>
              <div v-if="additionForm.labour.length > 0" class="space-y-2 mb-3">
                <div
                  v-for="(labour, index) in additionForm.labour"
                  :key="index"
                  class="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <input
                    v-model="labour.type"
                    type="text"
                    placeholder="Type"
                    class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                  />
                  <input
                    v-model.number="labour.total_amount"
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                  />
                  <button
                    @click="removeLabour(index)"
                    type="button"
                    class="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="addLabour"
                type="button"
                class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                + Add Labour
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {{ isSaving ? 'Saving...' : (editingAddition ? 'Update Addition' : 'Create Addition') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'
import type { EnquiryTask } from '../../types/enquiry'
import type { BudgetAddition, CreateBudgetAdditionData } from '../../types/budget'

interface Props {
  task: EnquiryTask
  budgetData: any
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
})

// Computed property to filter additions based on active tab
const filteredAdditions = computed(() => {
  console.log('All additions received:', additions.value.length, 'items')
  console.log('Additions details:', additions.value.map(addition => ({
    id: addition.id,
    title: addition.title,
    budget_type: addition.budget_type,
    source_type: addition.source_type,
    status: addition.status,
    is_materials_additional: addition.is_materials_additional
  })))

  if (activeTab.value === 'main') {
    const filtered = additions.value.filter(addition => addition.budget_type === 'main')
    console.log('Main Additions filtered:', filtered.length, 'items')
    return filtered
  } else {
    // Auto-Detected Additions tab should only show supplementary additions with source_type 'materials_additional'
    const filtered = additions.value.filter(addition =>
      addition.budget_type === 'supplementary' && addition.source_type === 'materials_additional'
    )
    console.log('Auto-Detected Additions filtered:', filtered.length, 'items from', additions.value.length, 'total additions')
    console.log('Filtered items details:', filtered.map(addition => ({
      id: addition.id,
      title: addition.title,
      budget_type: addition.budget_type,
      source_type: addition.source_type
    })))
    return filtered
  }
})

const additions = ref<BudgetAddition[]>([])
const showCreateModal = ref(false)
const editingAddition = ref<BudgetAddition | null>(null)
const isSaving = ref(false)
const activeTab = ref<'main' | 'supplementary'>('main')

const additionForm = ref<CreateBudgetAdditionData>({
  title: '',
  description: '',
  budget_type: 'main',
  materials: [],
  labour: [],
  expenses: [],
  logistics: []
} as CreateBudgetAdditionData)

// Load additions
const loadAdditions = async () => {
  try {
    console.log('Loading budget additions for task:', props.task.id)
    const response = await api.get(`/api/projects/tasks/${props.task.id}/budget/additions`)
    console.log('API Response received:', response.data)
    console.log('Additions data:', response.data.data)
    additions.value = response.data.data
  } catch (error) {
    console.error('Failed to load budget additions:', error)
  }
}

// Save addition
const saveAddition = async () => {
  isSaving.value = true
  try {
    // Calculate total prices for materials before sending
    const processedMaterials = additionForm.value.materials?.map(material => ({
      ...material,
      total_price: (material.quantity || 0) * (material.unit_price || 0)
    })) || []

    // Calculate total prices for labour
    const processedLabour = additionForm.value.labour?.map(labour => ({
      ...labour,
      total_amount: labour.total_amount || 0
    })) || []

    // Calculate total prices for expenses
    const processedExpenses = additionForm.value.expenses?.map(expense => ({
      ...expense,
      total_amount: expense.total_amount || 0
    })) || []

    // Calculate total prices for logistics
    const processedLogistics = additionForm.value.logistics?.map(logistic => ({
      ...logistic,
      total_cost: logistic.total_cost || 0
    })) || []

    const data = {
      title: additionForm.value.title,
      description: additionForm.value.description,
      budget_type: additionForm.value.budget_type,
      materials: processedMaterials,
      labour: processedLabour,
      expenses: processedExpenses,
      logistics: processedLogistics
    }

    if (editingAddition.value) {
      await api.put(`/api/projects/tasks/${props.task.id}/budget/additions/${editingAddition.value.id}`, data)
    } else {
      // For new additions, auto-approve main budget additions
      if (additionForm.value.budget_type === 'main') {
        (data as any).status = 'approved'
      }
      await api.post(`/api/projects/tasks/${props.task.id}/budget/additions`, data)
    }

    await loadAdditions()
    closeModal()
  } catch (error) {
    console.error('Failed to save budget addition:', error)
  } finally {
    isSaving.value = false
  }
}

// Approve materials addition
const approveAddition = async (additionId: number) => {
  console.log('Approving addition:', additionId, 'for task:', props.task.id)
  try {
    const response = await api.post(`/api/projects/tasks/${props.task.id}/budget/additions/${additionId}/approve`, {
      action: 'approve',
      notes: 'Approved from frontend'
    })
    console.log('Approval response:', response)
    await loadAdditions()
  } catch (error) {
    console.error('Failed to approve budget addition:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    // Show user-friendly error message
    alert(`Failed to approve addition: ${error.response?.data?.message || error.message}`)
  }
}

// Reject materials addition
const rejectAddition = async (additionId: number) => {
  console.log('Rejecting addition:', additionId, 'for task:', props.task.id)
  try {
    const response = await api.post(`/api/projects/tasks/${props.task.id}/budget/additions/${additionId}/approve`, {
      action: 'reject',
      notes: 'Rejected from frontend'
    })
    console.log('Rejection response:', response)
    await loadAdditions()
  } catch (error) {
    console.error('Failed to reject budget addition:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    // Show user-friendly error message
    alert(`Failed to reject addition: ${error.response?.data?.message || error.message}`)
  }
}

// Edit addition
const editAddition = (addition: BudgetAddition) => {
  editingAddition.value = addition

  // Normalize materials data to ensure consistent field names
  const normalizedMaterials = (addition.materials || []).map(material => ({
    ...material,
    unit_price: material.unit_price || material.unitPrice || 0,
    total_price: material.total_price || material.totalPrice || 0
  }))

  additionForm.value = {
    title: addition.title,
    description: addition.description || '',
    budget_type: addition.budget_type,
    materials: normalizedMaterials,
    labour: addition.labour || [],
    expenses: addition.expenses || [],
    logistics: addition.logistics || []
  }
}

// Delete addition
const deleteAddition = async (additionId: number) => {
  if (!confirm('Are you sure you want to delete this budget addition?')) return

  try {
    await api.delete(`/api/projects/tasks/${props.task.id}/budget/additions/${additionId}`)
    await loadAdditions()
  } catch (error) {
    console.error('Failed to delete budget addition:', error)
  }
}

// Modal management
const closeModal = () => {
  showCreateModal.value = false
  editingAddition.value = null
  additionForm.value = {
    title: '',
    description: '',
    budget_type: 'main',
    materials: [],
    labour: [],
    expenses: [],
    logistics: []
  } as CreateBudgetAdditionData
}

// Material management
const addMaterial = () => {
  if (!additionForm.value.materials) {
    additionForm.value.materials = []
  }
  additionForm.value.materials.push({
    description: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0
  })
}

const removeMaterial = (index: number) => {
  additionForm.value.materials?.splice(index, 1)
}


// Labour management
const addLabour = () => {
  if (!additionForm.value.labour) {
    additionForm.value.labour = []
  }
  additionForm.value.labour.push({
    type: '',
    hours: 1,
    rate_per_hour: 0,
    total_amount: 0
  })
}

const removeLabour = (index: number) => {
  additionForm.value.labour?.splice(index, 1)
}

// Add expense management
const addExpense = () => {
  if (!additionForm.value.expenses) {
    additionForm.value.expenses = []
  }
  additionForm.value.expenses.push({
    description: '',
    amount: 0,
    category: '',
    vendor: '',
    notes: ''
  })
}

const removeExpense = (index: number) => {
  additionForm.value.expenses?.splice(index, 1)
}

// Add logistics management
const addLogistic = () => {
  if (!additionForm.value.logistics) {
    additionForm.value.logistics = []
  }
  additionForm.value.logistics.push({
    description: '',
    quantity: 1,
    unit_cost: 0,
    total_cost: 0,
    category: '',
    provider: '',
    notes: ''
  })
}

const removeLogistic = (index: number) => {
  additionForm.value.logistics?.splice(index, 1)
}

// Status helpers
const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'pending_approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || classes.draft
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'draft': 'Draft',
    'pending_approval': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected'
  }
  return labels[status] || status
}

// Budget type helpers
const getBudgetTypeBadgeClass = (budgetType: string) => {
  const classes: Record<string, string> = {
    'main': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'supplementary': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  }
  return classes[budgetType] || classes.main
}

const getBudgetTypeLabel = (budgetType: string) => {
  const labels: Record<string, string> = {
    'main': 'Main',
    'supplementary': 'Supplementary'
  }
  return labels[budgetType] || budgetType
}

onMounted(() => {
  loadAdditions()
})
</script>

<style scoped>
.budget-additions-tab {
  /* Custom styles if needed */
}
</style>
