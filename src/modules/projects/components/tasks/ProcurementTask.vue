<template>
  <div class="procurement-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Loading State -->
    <div v-if="isImporting" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span class="text-sm font-medium">Loading procurement data...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="importError" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 text-red-600 dark:text-red-400">

          <div>
            <p class="text-sm font-medium">Failed to load procurement data</p>
            <p class="text-xs text-red-500 dark:text-red-300">{{ importError }}</p>
          </div>
        </div>
        <button
          @click="importBudgetData"
          :disabled="isImporting"
          class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {{ isImporting ? 'Importing...' : 'Retry Import' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Project Information -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Project Information</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold">{{ projectInfo.enquiryTitle }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Enquiry Number</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium">{{ projectInfo.projectId }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ projectInfo.clientName }}</p>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-6">
        <nav class="flex space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 relative py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md scale-105 border border-blue-200 dark:border-blue-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <span class="text-lg">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </span>
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-full"></div>
          </button>
        </nav>
      </div>

      <!-- Items Tab -->
      <div v-if="activeTab === 'items'">
        <div v-if="procurementData.procurementItems.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No procurement items available</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="element in groupedProcurementItems" :key="element.elementId" class="border border-gray-200 dark:border-gray-700 rounded-lg">
            <!-- Element Header -->
            <div
              :class="[
                getElementHeaderClass(element.elementName),
                'cursor-pointer hover:opacity-90 transition-opacity px-4 py-3 flex items-center justify-between'
              ]"
              @click="toggleElementCollapse(element.elementId)"
            >
              <div class="flex items-center space-x-3">
                <div class="flex flex-col space-y-1">
                  <div class="flex items-center space-x-2">
                    <h6 class="text-sm font-semibold text-white">{{ element.elementName }}</h6>
                    <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium text-white">
                      {{ element.materials.length }} materials
                    </span>
                  </div>
                  <div class="text-xs text-white/80">
                    Total Budget: KES {{ (element.totalBudget || 0).toLocaleString() }}
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <svg
                  :class="['w-4 h-4 text-white transition-transform', { 'rotate-180': !isElementCollapsed(element.elementId) }]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <!-- Element Materials -->
            <div v-if="!isElementCollapsed(element.elementId)" class="bg-white dark:bg-gray-800">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Material Description</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Qty</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock Status</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock Qty</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Qty</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Procurement Status</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="material in element.materials" :key="material.budgetItemId" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="px-4 py-3 text-sm">
                        <div class="text-gray-900 dark:text-white">
                          <div class="font-medium">{{ material.description }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">ID: {{ material.budgetItemId }}</div>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {{ material.quantity }} {{ material.unitOfMeasurement }}
                      </td>
                      
                      <!-- Stock Status (Store User) -->
                      <td class="px-4 py-3 text-sm">
                        <select
                          v-model="material.stockStatus"
                          @change="updateStockStatus(material.budgetItemId, ($event.target as HTMLSelectElement).value)"
                          :class="[
                            'w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                            getStockStatusClass(material.stockStatus)
                          ]"
                        >
                          <option value="pending_check">Pending Check</option>
                          <option value="in_stock">In Stock</option>
                          <option value="partial_stock">Partial Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>
                      </td>

                      <!-- Stock Quantity -->
                      <td class="px-4 py-3 text-sm">
                        <input
                          type="number"
                          v-model.number="material.stockQuantity"
                          @input="updateStockQuantity(material.budgetItemId, ($event.target as HTMLInputElement).value)"
                          min="0"
                          :max="material.quantity"
                          :disabled="material.stockStatus === 'out_of_stock' || material.stockStatus === 'pending_check'"
                          class="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        />
                      </td>

                      <!-- Purchase Quantity (Auto-calculated) -->
                      <td class="px-4 py-3 text-sm">
                        <span :class="[
                          'font-medium',
                          material.purchaseQuantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                        ]">
                          {{ material.purchaseQuantity }}
                        </span>
                      </td>

                      <!-- Procurement Status (Procurement Officer) -->
                      <td class="px-4 py-3 text-sm">
                        <select
                          v-model="material.procurementStatus"
                          @change="updateProcurementStatus(material.budgetItemId, ($event.target as HTMLSelectElement).value)"
                          :disabled="material.purchaseQuantity === 0 && material.procurementStatus === 'not_needed'"
                          :class="[
                            'w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                            getProcurementStatusClass(material.procurementStatus)
                          ]"
                        >
                          <option value="not_needed">Not Needed</option>
                          <option value="pending">Pending Purchase</option>
                          <option value="ordered">Ordered</option>
                          <option value="received">Received</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td class="px-4 py-3 text-sm">
                        <input
                          v-model="material.vendorName"
                          @input="updateVendorName(material.budgetItemId, ($event.target as HTMLInputElement).value)"
                          type="text"
                          placeholder="Vendor name"
                          class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Tab -->
      <div v-if="activeTab === 'budget'">
        <div class="space-y-6">
          <!-- Budget Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Materials Budget Card -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-blue-700 dark:text-blue-300">Materials Budget</h3>
                <span class="text-2xl">💰</span>
              </div>
              <div class="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                KES {{ (totalBudget || 0).toLocaleString() }}
              </div>
              <div class="text-sm text-blue-600 dark:text-blue-400">
                {{ procurementData.procurementItems.length }} items
              </div>
            </div>

            <!-- Budget Allocated Card -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-green-700 dark:text-green-300">Budget Allocated</h3>
                <span class="text-2xl">📉</span>
              </div>
              <div class="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                KES {{ (totalSpent || 0).toLocaleString() }}
              </div>
              <div class="text-sm text-green-600 dark:text-green-400">
                {{ totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0 }}% of budget
              </div>
            </div>

            <!-- Budget Variance Card -->
            <div :class="[
              'p-6 rounded-xl border',
              budgetVariance >= 0
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700'
                : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'
            ]">
              <div class="flex items-center justify-between mb-4">
                <h3 :class="[
                  'text-sm font-medium',
                  budgetVariance >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                ]">Budget Variance</h3>
                <span class="text-2xl">{{ budgetVariance >= 0 ? '✅' : '⚠️' }}</span>
              </div>
              <div :class="[
                'text-3xl font-bold mb-2',
                budgetVariance >= 0 ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'
              ]">
                KES {{ Math.abs(budgetVariance || 0).toLocaleString() }}
              </div>
              <div :class="[
                'text-sm',
                budgetVariance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              ]">
                {{ budgetVariance >= 0 ? 'Under budget' : 'Over budget' }}
              </div>
            </div>
          </div>

          <!-- Procurement Progress Dashboard -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <span class="mr-2">📊</span>
              Procurement Progress Dashboard
            </h4>

            <!-- Overall Progress Bar -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ overallCompletionPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: overallCompletionPercentage + '%' }"
                ></div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ completedItemsCount }} of {{ procurementData.procurementItems.length }} items completed
              </div>
            </div>

            <!-- Status Breakdown -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div v-for="status in ['pending', 'ordered', 'received', 'cancelled']" :key="status"
                   class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ getStatusCount(status) }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 capitalize mb-2">{{ status }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-500">
                  {{ procurementData.procurementItems.length ? Math.round((getStatusCount(status) / procurementData.procurementItems.length) * 100) : 0 }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Tab -->
      <div v-if="activeTab === 'report'" class="space-y-6">
        <!-- Export Options -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <span class="mr-2">📤</span>
              Export Procurement Data
            </h4>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="exportToExcel"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Export Excel</span>
            </button>
            <button
              @click="printReport"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>🖨️</span>
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Save Status Messages -->
      <div v-if="saveSuccess || saveError || isSaving" class="mb-4">
        <!-- Success Message -->
        <div v-if="saveSuccess" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center space-x-3 text-green-600 dark:text-green-400">
            <span class="text-lg">✅</span>
            <div>
              <p class="text-sm font-medium">Procurement data saved successfully</p>
              <p class="text-xs text-green-500 dark:text-green-300" v-if="lastSaveTime">
                Last saved: {{ lastSaveTime.toLocaleTimeString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="saveError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <span class="text-lg">⚠️</span>
            <div>
              <p class="text-sm font-medium">Failed to save procurement data</p>
              <p class="text-xs text-red-500 dark:text-red-300">{{ saveError }}</p>
            </div>
          </div>
        </div>

        <!-- Loading Message -->
        <div v-if="isSaving" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p class="text-sm font-medium">Saving procurement data...</p>
              <p class="text-xs text-blue-500 dark:text-blue-300">Please wait while we save your changes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status !== 'completed' && task.status !== 'cancelled'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Task
          </button>
        </div>

        <!-- Save Button -->
        <div class="flex items-center space-x-3">
          <!-- Unsaved Changes Indicator -->
          <div v-if="hasUnsavedChanges && !isSaving" class="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
            <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium">Unsaved changes</span>
          </div>

          <!-- Last Save Time -->
          <div v-if="lastSaveTime && !hasUnsavedChanges" class="text-xs text-gray-500 dark:text-gray-400">
            Saved {{ lastSaveTime.toLocaleTimeString() }}
          </div>

          <!-- Save Button -->
          <button
            @click="saveNow"
            :disabled="isSaving"
            :class="[
              'px-4 py-2 rounded-lg transition-colors flex items-center space-x-2',
              isSaving
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : hasUnsavedChanges
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
            ]"
          >
            <span v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>{{ isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Save Procurement Data' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import type { ProcurementTaskData, ProcurementItem } from '../../services'
import { useProcurementData } from '@/composables/useProcurementData'
import { useProcurementSave } from '@/composables/useProcurementSave'
import { useAutoSave } from '@/composables/useAutoSave'
import { CSVExporter } from '@/utils/csvExport'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'save-procurement': [data: ProcurementTaskData]
  'complete': []
}>()

// Tab management
const activeTab = ref('budget')
const tabs = [
  { id: 'budget', label: 'Budget Summary', icon: '📊' },
  { id: 'items', label: 'Procurement Progress', icon: '📦' },
  { id: 'report', label: 'Export Data', icon: '📄' }
]

// Use composables
const {
  procurementData,
  isImporting,
  importError,
  totalBudget,
  totalSpent,
  budgetVariance,
  overallCompletionPercentage,
  completedItemsCount,
  importBudgetData
} = useProcurementData(props.task.id)

const {
  isSaving,
  saveError,
  saveSuccess,
  lastSaveTime,
  hasUnsavedChanges,
  save
} = useProcurementSave(props.task.id)


// Local state and functions for UI management
const collapsedElements = ref<Set<string>>(new Set())

interface GroupedElement {
  elementId: string
  elementName: string
  materials: ProcurementItem[]
  totalBudget: number
}

const groupedProcurementItems = computed(() => {
  const groups = new Map<string, GroupedElement>()

  procurementData.procurementItems.forEach(item => {
    const elementId = item.budgetElementId || 'unknown'
    const elementName = item.elementName || 'Unnamed Element'

    if (!groups.has(elementId)) {
      groups.set(elementId, {
        elementId,
        elementName,
        materials: [],
        totalBudget: 0
      })
    }

    const group = groups.get(elementId)!
    group.materials.push(item)
    group.totalBudget += item.budgetTotalPrice || 0
  })

  return Array.from(groups.values()).sort((a, b) =>
    (a.elementName || '').localeCompare(b.elementName || '')
  )
})

const isElementCollapsed = (elementId: string) => {
  return collapsedElements.value.has(elementId)
}

const toggleElementCollapse = (elementId: string) => {
  if (collapsedElements.value.has(elementId)) {
    collapsedElements.value.delete(elementId)
  } else {
    collapsedElements.value.add(elementId)
  }
}

const getElementHeaderClass = (elementName: string) => {
  const elementColors: Record<string, string> = {
    'STAGE': 'bg-gradient-to-r from-blue-600 to-blue-700',
    'BACKDROP': 'bg-gradient-to-r from-purple-600 to-purple-700',
    'LIGHTING': 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    'SOUND': 'bg-gradient-to-r from-green-600 to-green-700',
    'FURNITURE': 'bg-gradient-to-r from-red-600 to-red-700',
    'DECOR': 'bg-gradient-to-r from-pink-600 to-pink-700',
    'SIGNAGE': 'bg-gradient-to-r from-indigo-600 to-indigo-700',
    'BOOTH': 'bg-gradient-to-r from-teal-600 to-teal-700'
  }

  // Safety check for undefined elementName
  if (!elementName) {
    return 'bg-gradient-to-r from-gray-600 to-gray-700'
  }

  const upperElementName = elementName.toUpperCase()
  for (const [key, color] of Object.entries(elementColors)) {
    if (upperElementName.includes(key)) {
      return color
    }
  }

  return 'bg-gradient-to-r from-gray-600 to-gray-700'
}

const updateVendorName = (itemId: string, vendorName: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    item.vendorName = vendorName
    item.lastUpdated = new Date()
  }
}

// New Logic for Dual-Status Workflow

const updateStockStatus = (itemId: string, status: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    item.stockStatus = status as ProcurementItem['stockStatus']
    
    // Auto-calculate quantities based on status
    if (status === 'in_stock') {
      item.stockQuantity = item.quantity
      item.purchaseQuantity = 0
      item.procurementStatus = 'not_needed'
    } else if (status === 'out_of_stock') {
      item.stockQuantity = 0
      item.purchaseQuantity = item.quantity
      if (item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    } else if (status === 'partial_stock') {
      // Keep existing stock quantity if valid, otherwise reset
      if (item.stockQuantity >= item.quantity) {
        item.stockQuantity = 0
      }
      item.purchaseQuantity = Math.max(0, item.quantity - item.stockQuantity)
      if (item.purchaseQuantity > 0 && item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    } else if (status === 'pending_check') {
      item.stockQuantity = 0
      item.purchaseQuantity = item.quantity // Assume purchase needed until checked
    }
    
    item.lastUpdated = new Date()
  }
}

const updateStockQuantity = (itemId: string, qtyValue: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    const qty = parseInt(qtyValue) || 0
    item.stockQuantity = Math.min(Math.max(0, qty), item.quantity) // Clamp between 0 and total qty
    
    // Update purchase quantity
    item.purchaseQuantity = Math.max(0, item.quantity - item.stockQuantity)
    
    // Update statuses based on quantity
    if (item.stockQuantity === item.quantity) {
      item.stockStatus = 'in_stock'
      item.procurementStatus = 'not_needed'
    } else if (item.stockQuantity === 0) {
      item.stockStatus = 'out_of_stock'
      if (item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    } else {
      item.stockStatus = 'partial_stock'
      if (item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    }
    
    item.lastUpdated = new Date()
  }
}

const updateProcurementStatus = (itemId: string, status: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    item.procurementStatus = status as ProcurementItem['procurementStatus']
    item.lastUpdated = new Date()
  }
}

// UI helpers
const getStatusCount = (status: string) => {
  return procurementData.procurementItems.filter(item => item.procurementStatus === status).length
}

const getStockStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'in_stock': 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600 text-green-700 dark:text-green-300',
    'partial_stock': 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600 text-amber-700 dark:text-amber-300',
    'out_of_stock': 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 text-red-700 dark:text-red-300',
    'pending_check': 'border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300'
  }
  return classes[status] || classes['pending_check']
}

const getProcurementStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'not_needed': 'border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-400 dark:text-gray-500',
    'pending': 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600 text-blue-700 dark:text-blue-300',
    'ordered': 'border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600 text-purple-700 dark:text-purple-300',
    'received': 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600 text-green-700 dark:text-green-300',
    'cancelled': 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 text-red-700 dark:text-red-300'
  }
  return classes[status] || classes['pending']
}

// Export functions
const printReport = () => {
  const printContent = document.getElementById('printable-procurement-report')
  if (printContent) {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const title = 'Procurement Report - ' + projectInfo.value.enquiryTitle
      printWindow.document.write(
        '<!DOCTYPE html><html><head><title>' + title + '</title><style>' +
        'body { font-family: Arial, sans-serif; margin: 20px; }' +
        'table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }' +
        'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }' +
        'th { background-color: #f5f5f5; font-weight: bold; }' +
        '.header { text-align: center; margin-bottom: 30px; }' +
        '.section { margin-bottom: 25px; }' +
        '.element-header { background-color: #f8f9fa; padding: 10px; margin: 15px 0 5px 0; font-weight: bold; }' +
        '@media print { body { margin: 0; } .no-print { display: none; } }' +
        '</style></head><body>' + printContent.innerHTML + '</body></html>'
      )
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }
}

const exportToExcel = () => {
  try {
    CSVExporter.exportProcurementData(procurementData, projectInfo.value)
  } catch (error) {
    console.error('Failed to export Excel:', error)
    alert('Failed to export Excel file. Please try again.')
  }
}

// Project information
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.enquiry_number || `ENQ-${props.task.id}`,
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'Unknown Client',
    eventVenue: enquiry?.venue || 'TBC',
    setupDate: enquiry?.expected_delivery_date || 'TBC',
    setDownDate: 'TBC'
  }
})


// Task status management
const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

// Save function
const saveNow = async () => {
  await save(procurementData)
}

// Auto-save setup
useAutoSave(
  () => procurementData,
  async () => {
    if (hasUnsavedChanges.value) {
      await save(procurementData)
    }
  }
)
</script>
