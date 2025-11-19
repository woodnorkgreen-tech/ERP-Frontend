<template>
  <!-- Modal Overlay -->
  <div v-if="isVisible" class="quote-viewer-modal fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Client Quote Preview</h3>
        <div class="flex items-center space-x-4">
          <!-- Detail Level Toggle -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Show Details:</label>
            <button
              @click="toggleDetailLevel"
              :class="[
                'px-3 py-1 text-xs rounded-full transition-colors',
                showDetailedItems
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ showDetailedItems ? 'Detailed' : 'Summary' }}
            </button>
          </div>

          <!-- Edit Mode Toggle -->
          <div v-if="!props.readonly" class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Edit Descriptions:</label>
            <button
              @click="toggleEditMode"
              :class="[
                'px-3 py-1 text-xs rounded-full transition-colors flex items-center space-x-1',
                isEditMode
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>{{ isEditMode ? 'Done' : 'Edit' }}</span>
            </button>
          </div>

          <!-- Print Button -->
          <div v-if="!props.readonly" class="flex items-center space-x-2">
            <button
              @click="printQuote"
              class="px-3 py-1 text-xs rounded-full transition-colors flex items-center space-x-1 bg-green-100 text-green-800 hover:bg-green-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              <span>Print</span>
            </button>
          </div>

          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quote Content -->
      <div class="quote-content p-8">
        <!-- Header Section -->
        <div class="flex items-start justify-between mb-8">
          <!-- Company Logo and Name -->
          <div class="flex items-center space-x-4">
            <img
              src="/src/assets/WNG-Logo.png"
              alt="WoodnorkGreen Logo"
              class="h-16 w-auto"
              @error="handleImageError"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">WoodnorkGreen</h1>
              <p class="text-sm text-gray-600">Experience</p>
            </div>
          </div>

          <!-- Quote Info -->
          <div class="text-right">
            <h2 class="text-3xl font-bold text-green-600 mb-2">QUOTE</h2>
            <div class="space-y-1">
              <div class="flex items-center justify-end space-x-2">
                <span class="text-sm font-medium text-gray-700">Date:</span>
                <span class="text-sm border border-gray-300 px-2 py-1 bg-gray-50">{{ formatDate(new Date()) }}</span>
              </div>
              <div class="flex items-center justify-end space-x-2">
                <span class="text-sm font-medium text-gray-700">Quote #:</span>
                <span class="text-sm border border-gray-300 px-2 py-1 bg-gray-50">{{ quoteNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Section -->
        <div class="mb-8">
          <div class="bg-green-500 text-white px-4 py-2 font-semibold text-sm">
            CUSTOMER
          </div>
          <div class="bg-gray-100 p-4 border border-gray-300">
            <div class="space-y-1">
              <div class="font-semibold text-gray-900">{{ quoteData.projectInfo.clientName }}</div>
              <div class="text-sm text-gray-700">{{ quoteData.projectInfo.enquiryTitle }}</div>
              <div class="text-sm text-gray-700">{{ quoteData.projectInfo.eventVenue }}</div>
              <div class="text-sm text-gray-700">Nairobi, Kenya</div>
              <div class="text-sm text-gray-700 mt-2">ATTN: Project Manager</div>
            </div>
          </div>
        </div>

        <!-- Quote Table -->
        <div class="mb-8">
          <div class="bg-green-500 text-white px-4 py-2 font-semibold text-sm">
            DESCRIPTION
          </div>
          <div class="border border-gray-300">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left py-2 px-4 font-semibold text-gray-700 border-r border-gray-300">DESCRIPTION</th>
                  <th class="text-center py-2 px-4 font-semibold text-gray-700 border-r border-gray-300 w-24">QTY</th>
                  <th class="text-right py-2 px-4 font-semibold text-gray-700 w-32">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <!-- Materials -->
                <template v-for="element in quoteData.materials" :key="element.id">
                  <!-- Summary View (Default) -->
                  <tr v-if="!showDetailedItems" class="border-t border-gray-300">
                    <td class="py-3 px-4 border-r border-gray-300">
                      <div class="font-medium text-gray-900">{{ element.name }}</div>
                      <div v-if="!isEditMode" class="text-xs text-gray-600 mt-1">{{ getDescription(element.id, element) }}</div>
                      <textarea
                        v-else
                        v-model="editableDescriptions[element.id]"
                        class="w-full mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 resize-none"
                        rows="2"
                        placeholder="Enter description..."
                      ></textarea>
                    </td>
                    <td class="py-3 px-4 text-center border-r border-gray-300">1</td>
                    <td class="py-3 px-4 text-right font-medium">{{ formatCurrency(element.finalTotal) }}</td>
                  </tr>

                  <!-- Detailed View -->
                  <template v-else>
                    <!-- Element Header -->
                    <tr class="border-t border-gray-300 bg-gray-50">
                      <td colspan="3" class="py-2 px-4 font-semibold text-gray-800 text-sm">
                        <div v-if="!isEditMode">{{ element.name }} - {{ getDescription(element.id, element) }}</div>
                        <div v-else class="flex items-center space-x-2">
                          <span>{{ element.name }} - </span>
                          <input
                            v-model="editableDescriptions[element.id]"
                            class="flex-1 text-sm bg-yellow-50 border border-yellow-300 rounded px-2 py-1"
                            placeholder="Enter description..."
                          />
                        </div>
                      </td>
                    </tr>

                    <!-- Individual Materials -->
                    <tr v-for="material in element.materials" :key="material.id" class="border-t border-gray-200">
                      <td class="py-2 px-4 pl-8 border-r border-gray-300">
                        <div class="text-sm text-gray-900">{{ material.description }}</div>
                        <div class="text-xs text-gray-500">{{ material.unitOfMeasurement }}</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300 text-sm">{{ material.quantity }}</td>
                      <td class="py-2 px-4 text-right text-sm">{{ formatCurrency(material.finalPrice) }}</td>
                    </tr>

                    <!-- Element Subtotal -->
                    <tr class="border-t border-gray-300 bg-blue-50">
                      <td class="py-2 px-4 border-r border-gray-300">
                        <div class="font-medium text-blue-800 text-sm">{{ element.name }} Subtotal</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300"></td>
                      <td class="py-2 px-4 text-right font-medium text-blue-800">{{ formatCurrency(element.finalTotal) }}</td>
                    </tr>
                  </template>
                </template>

                <!-- Labour -->
                <template v-if="quoteData.totals.labourTotal > 0">
                  <!-- Summary View -->
                  <tr v-if="!showDetailedItems" class="border-t border-gray-300">
                    <td class="py-3 px-4 border-r border-gray-300">
                      <div class="font-medium text-gray-900">Labour & Installation</div>
                      <div v-if="!isEditMode" class="text-xs text-gray-600 mt-1">{{ getDescription('labour') }}</div>
                      <textarea
                        v-else
                        v-model="editableDescriptions['labour']"
                        class="w-full mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 resize-none"
                        rows="2"
                        placeholder="Enter description..."
                      ></textarea>
                    </td>
                    <td class="py-3 px-4 text-center border-r border-gray-300">1</td>
                    <td class="py-3 px-4 text-right font-medium">{{ formatCurrency(quoteData.totals.labourTotal) }}</td>
                  </tr>

                  <!-- Detailed View -->
                  <template v-else>
                    <!-- Labour Header -->
                    <tr class="border-t border-gray-300 bg-gray-50">
                      <td colspan="3" class="py-2 px-4 font-semibold text-gray-800 text-sm">
                        <div v-if="!isEditMode">Labour & Installation - {{ getDescription('labour') }}</div>
                        <div v-else class="flex items-center space-x-2">
                          <span>Labour & Installation - </span>
                          <input
                            v-model="editableDescriptions['labour']"
                            class="flex-1 text-sm bg-yellow-50 border border-yellow-300 rounded px-2 py-1"
                            placeholder="Enter description..."
                          />
                        </div>
                      </td>
                    </tr>

                    <!-- Individual Labour Items -->
                    <tr v-for="labour in quoteData.labour" :key="labour.id" class="border-t border-gray-200">
                      <td class="py-2 px-4 pl-8 border-r border-gray-300">
                        <div class="text-sm text-gray-900">{{ labour.type }}</div>
                        <div class="text-xs text-gray-500">{{ labour.category }} - {{ labour.unit }}</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300 text-sm">{{ labour.quantity }}</td>
                      <td class="py-2 px-4 text-right text-sm">{{ formatCurrency(labour.amount) }}</td>
                    </tr>

                    <!-- Labour Subtotal -->
                    <tr class="border-t border-gray-300 bg-yellow-50">
                      <td class="py-2 px-4 border-r border-gray-300">
                        <div class="font-medium text-yellow-800 text-sm">Labour & Installation Subtotal</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300"></td>
                      <td class="py-2 px-4 text-right font-medium text-yellow-800">{{ formatCurrency(quoteData.totals.labourTotal) }}</td>
                    </tr>
                  </template>
                </template>

                <!-- Expenses -->
                <template v-if="quoteData.totals.expensesTotal > 0">
                  <!-- Summary View -->
                  <tr v-if="!showDetailedItems" class="border-t border-gray-300">
                    <td class="py-3 px-4 border-r border-gray-300">
                      <div class="font-medium text-gray-900">Project Expenses</div>
                      <div v-if="!isEditMode" class="text-xs text-gray-600 mt-1">{{ getDescription('expenses') }}</div>
                      <textarea
                        v-else
                        v-model="editableDescriptions['expenses']"
                        class="w-full mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 resize-none"
                        rows="2"
                        placeholder="Enter description..."
                      ></textarea>
                    </td>
                    <td class="py-3 px-4 text-center border-r border-gray-300">1</td>
                    <td class="py-3 px-4 text-right font-medium">{{ formatCurrency(quoteData.totals.expensesTotal) }}</td>
                  </tr>

                  <!-- Detailed View -->
                  <template v-else>
                    <!-- Expenses Header -->
                    <tr class="border-t border-gray-300 bg-gray-50">
                      <td colspan="3" class="py-2 px-4 font-semibold text-gray-800 text-sm">
                        Project Expenses - Transportation, accommodation and other project costs
                      </td>
                    </tr>

                    <!-- Individual Expense Items -->
                    <tr v-for="expense in quoteData.expenses" :key="expense.id" class="border-t border-gray-200">
                      <td class="py-2 px-4 pl-8 border-r border-gray-300">
                        <div class="text-sm text-gray-900">{{ expense.description }}</div>
                        <div class="text-xs text-gray-500 capitalize">{{ expense.category }}</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300 text-sm">1</td>
                      <td class="py-2 px-4 text-right text-sm">{{ formatCurrency(expense.finalPrice) }}</td>
                    </tr>

                    <!-- Expenses Subtotal -->
                    <tr class="border-t border-gray-300 bg-green-50">
                      <td class="py-2 px-4 border-r border-gray-300">
                        <div class="font-medium text-green-800 text-sm">Project Expenses Subtotal</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300"></td>
                      <td class="py-2 px-4 text-right font-medium text-green-800">{{ formatCurrency(quoteData.totals.expensesTotal) }}</td>
                    </tr>
                  </template>
                </template>

                <!-- Logistics -->
                <template v-if="quoteData.totals.logisticsTotal > 0">
                  <!-- Summary View -->
                  <tr v-if="!showDetailedItems" class="border-t border-gray-300">
                    <td class="py-3 px-4 border-r border-gray-300">
                      <div class="font-medium text-gray-900">Logistics & Transportation</div>
                      <div v-if="!isEditMode" class="text-xs text-gray-600 mt-1">{{ getDescription('logistics') }}</div>
                      <textarea
                        v-else
                        v-model="editableDescriptions['logistics']"
                        class="w-full mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 resize-none"
                        rows="2"
                        placeholder="Enter description..."
                      ></textarea>
                    </td>
                    <td class="py-3 px-4 text-center border-r border-gray-300">1</td>
                    <td class="py-3 px-4 text-right font-medium">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                  </tr>

                  <!-- Detailed View -->
                  <template v-else>
                    <!-- Logistics Header -->
                    <tr class="border-t border-gray-300 bg-gray-50">
                      <td colspan="3" class="py-2 px-4 font-semibold text-gray-800 text-sm">
                        Logistics & Transportation - Equipment delivery and logistics coordination
                      </td>
                    </tr>

                    <!-- Individual Logistics Items -->
                    <tr v-for="logistics in quoteData.logistics" :key="logistics.id" class="border-t border-gray-200">
                      <td class="py-2 px-4 pl-8 border-r border-gray-300">
                        <div class="text-sm text-gray-900">{{ logistics.description }}</div>
                        <div class="text-xs text-gray-500">{{ logistics.vehicleReg }} - {{ logistics.unit }}</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300 text-sm">{{ logistics.quantity }}</td>
                      <td class="py-2 px-4 text-right text-sm">{{ formatCurrency(logistics.finalPrice) }}</td>
                    </tr>

                    <!-- Logistics Subtotal -->
                    <tr class="border-t border-gray-300 bg-orange-50">
                      <td class="py-2 px-4 border-r border-gray-300">
                        <div class="font-medium text-orange-800 text-sm">Logistics & Transportation Subtotal</div>
                      </td>
                      <td class="py-2 px-4 text-center border-r border-gray-300"></td>
                      <td class="py-2 px-4 text-right font-medium text-orange-800">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>

            <!-- Totals Section -->
            <div class="border-t-2 border-gray-400">
              <div class="flex justify-end">
                <div class="w-64">
                  <!-- Subtotal -->
                  <div class="flex justify-between py-2 px-4 border-b border-gray-300">
                    <span class="font-medium">Sub Total</span>
                    <span class="font-medium">{{ formatCurrency(quoteData.totals.subtotal) }}</span>
                  </div>

                  <!-- Discount -->
                  <div v-if="quoteData.discountAmount > 0" class="flex justify-between py-2 px-4 border-b border-gray-300 text-red-600">
                    <span class="font-medium">Discount</span>
                    <span class="font-medium">-{{ formatCurrency(quoteData.discountAmount) }}</span>
                  </div>

                  <!-- VAT -->
                  <div v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0" class="flex justify-between py-2 px-4 border-b border-gray-300">
                    <span class="font-medium">VAT 16%</span>
                    <span class="font-medium">{{ formatCurrency(quoteData.totals.vatAmount) }}</span>
                  </div>

                  <!-- Final Total -->
                  <div class="flex justify-between py-3 px-4 bg-gray-50 font-bold text-lg">
                    <span>Total</span>
                    <span>{{ formatCurrency(quoteData.totals.grandTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="mb-8">
          <div class="bg-green-500 text-white px-4 py-2 font-semibold text-sm">
            TERMS AND CONDITIONS
          </div>
          <div class="border border-gray-300 p-4 bg-gray-50">
            <div class="text-sm space-y-2">
              <div><strong>1.</strong> Quotation is valid for 30 days</div>
              <div><strong>2.</strong> Production begins immediately after receipt of LPO</div>
              <div><strong>3.</strong> The above prices are exclusive of 16% Government Tax</div>
              <div><strong>4.</strong> Prices quoted are as per the quantities indicated. Any change of quantity will affect the price</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-gray-600 border-t pt-4">
          <p class="mb-1">If you have any questions about this quote, please contact us below</p>
          <p>Unit 1, Trust Merchant Building, 1st Floor, Koinange Road, Unit 2, Gathondu Office Suites, Suite 406, Woodvale Lane, Nairobi</p>
          <p>Tel: +254 700 397 246 • +254 20 4449999 | Email: admin@woodnorkgreen.co.ke | Website: www.woodnorkgreen.co.ke</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Props interface
 */
interface Props {
  /** Whether the modal is visible */
  isVisible: boolean
  /** Quote data to display */
  quoteData: any // We'll type this properly later
  /** Display options for customization */
  displayOptions?: {
    showUnitPrices: boolean
    showDetailedItems: boolean
    showDescriptions: boolean
  }
  /** Whether the viewer is in readonly mode */
  readonly?: boolean
}

/**
 * Events emitted by the component
 */
interface Emits {
  /** Emitted when modal should be closed */
  'close': []
}

// Props and emits
const props = withDefaults(defineProps<Props>(), {
  displayOptions: () => ({
    showUnitPrices: false,
    showDetailedItems: false,
    showDescriptions: true
  }),
  readonly: false
})

const emit = defineEmits<Emits>()

// Reactive state
const showDetailedItems = ref(props.displayOptions?.showDetailedItems || false)
const isEditMode = ref(false)
const editableDescriptions = ref<Record<string, string>>({})

/**
 * Toggle detail level
 */
const toggleDetailLevel = () => {
  showDetailedItems.value = !showDetailedItems.value
}

/**
 * Toggle edit mode
 */
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value

  // Initialize editable descriptions when entering edit mode
  if (isEditMode.value && Object.keys(editableDescriptions.value).length === 0) {
    initializeEditableDescriptions()
  }
}

/**
 * Initialize editable descriptions
 */
const initializeEditableDescriptions = () => {
  // Initialize descriptions for all elements
  props.quoteData.materials.forEach((element: any) => {
    editableDescriptions.value[element.id] = getElementDescription(element)
  })

  // Initialize descriptions for other categories
  if (props.quoteData.totals.labourTotal > 0) {
    editableDescriptions.value['labour'] = 'Professional setup and installation services'
  }
  if (props.quoteData.totals.expensesTotal > 0) {
    editableDescriptions.value['expenses'] = 'Transportation, accommodation and other project costs'
  }
  if (props.quoteData.totals.logisticsTotal > 0) {
    editableDescriptions.value['logistics'] = 'Equipment delivery and logistics coordination'
  }
}

/**
 * Get description (editable or default)
 */
const getDescription = (elementId: string, element?: any): string => {
  if (isEditMode.value && editableDescriptions.value[elementId]) {
    return editableDescriptions.value[elementId]
  }
  return element ? getElementDescription(element) : editableDescriptions.value[elementId] || ''
}

/**
 * Print the quote
 */
const printQuote = () => {
  // Exit edit mode before printing to show final content
  if (isEditMode.value) {
    isEditMode.value = false
  }

  // Small delay to ensure edit mode is fully exited
  setTimeout(() => {
    // Get the quote content element
    const quoteContent = document.querySelector('.quote-content')
    if (quoteContent) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Quote - ${props.quoteData.projectInfo.clientName}</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 20px;
                color: #000;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Logo and header styling */
              img {
                max-height: 64px;
                width: auto;
              }

              /* Green headers - matching your design */
              .bg-green-500 {
                background-color: #10b981 !important;
                color: white !important;
                padding: 8px 16px !important;
                font-weight: 600 !important;
                font-size: 14px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Gray backgrounds */
              .bg-gray-100 {
                background-color: #f3f4f6 !important;
                padding: 16px !important;
                border: 1px solid #d1d5db !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .bg-gray-50 {
                background-color: #f9fafb !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Colored backgrounds for detailed view */
              .bg-blue-50 {
                background-color: #eff6ff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .bg-yellow-50 {
                background-color: #fefce8 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .bg-green-50 {
                background-color: #f0fdf4 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .bg-orange-50 {
                background-color: #fff7ed !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Table styling */
              table {
                border-collapse: collapse !important;
                width: 100% !important;
                margin: 0 !important;
              }
              th, td {
                border: 1px solid #d1d5db !important;
                padding: 8px !important;
                text-align: left !important;
              }
              th {
                background-color: #f9fafb !important;
                font-weight: 600 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* Text colors */
              .text-green-600 { color: #059669 !important; }
              .text-red-600 { color: #dc2626 !important; }
              .text-blue-800 { color: #1e40af !important; }
              .text-yellow-800 { color: #92400e !important; }
              .text-green-800 { color: #166534 !important; }
              .text-orange-800 { color: #9a3412 !important; }
              .text-gray-900 { color: #111827 !important; }
              .text-gray-600 { color: #4b5563 !important; }
              .text-gray-500 { color: #6b7280 !important; }

              /* Alignment */
              .text-right { text-align: right !important; }
              .text-center { text-align: center !important; }

              /* Font weights */
              .font-bold { font-weight: 700 !important; }
              .font-semibold { font-weight: 600 !important; }
              .font-medium { font-weight: 500 !important; }

              /* Font sizes */
              .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
              .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
              .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
              .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
              .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }

              /* Spacing */
              .mb-8 { margin-bottom: 2rem !important; }
              .mb-6 { margin-bottom: 1.5rem !important; }
              .mb-4 { margin-bottom: 1rem !important; }
              .mb-2 { margin-bottom: 0.5rem !important; }
              .mb-1 { margin-bottom: 0.25rem !important; }
              .mt-1 { margin-top: 0.25rem !important; }
              .mt-2 { margin-top: 0.5rem !important; }
              .space-y-1 > * + * { margin-top: 0.25rem !important; }
              .space-y-2 > * + * { margin-top: 0.5rem !important; }

              /* Layout */
              .flex { display: flex !important; }
              .justify-between { justify-content: space-between !important; }
              .items-center { align-items: center !important; }
              .items-start { align-items: flex-start !important; }
              .space-x-4 > * + * { margin-left: 1rem !important; }
              .space-x-2 > * + * { margin-left: 0.5rem !important; }

              /* Borders */
              .border { border: 1px solid #d1d5db !important; }
              .border-gray-300 { border-color: #d1d5db !important; }
              .border-t { border-top: 1px solid #d1d5db !important; }
              .border-t-2 { border-top: 2px solid #6b7280 !important; }
              .border-r { border-right: 1px solid #d1d5db !important; }
              .border-b { border-bottom: 1px solid #d1d5db !important; }

              /* Page setup */
              @page {
                margin: 0.5in;
                size: A4;
              }

              /* Prevent page breaks within sections */
              .mb-8 {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
            </style>
          </head>
          <body>
            ${quoteContent.innerHTML}
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    } else {
      // Fallback to regular print
      window.print()
    }
  }, 100)
}

/**
 * Generate quote number
 */
const quoteNumber = computed(() => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `WNG${year}${month}${day}${random}`
})

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Format currency for display
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Get element description for client view
 */
const getElementDescription = (element: any): string => {
  const materialCount = element.materials.length
  const descriptions = [
    'Professional grade materials and components',
    'Complete setup and configuration included',
    `Includes ${materialCount} specialized components`
  ]

  // Return a relevant description based on element type
  switch (element.templateId) {
    case 'stage':
      return 'Modular stage platform system with professional-grade components'
    case 'backdrop':
      return 'Custom backdrop system with premium fabric and mounting hardware'
    case 'lighting':
      return 'Professional lighting system with LED fixtures and control equipment'
    case 'sound':
      return 'Audio system with speakers, amplifiers and mixing equipment'
    case 'furniture':
      return 'Event furniture and seating arrangements'
    case 'decoration':
      return 'Decorative elements and styling components'
    case 'catering':
      return 'Catering equipment and service items'
    case 'security':
      return 'Security and safety equipment'
    default:
      return descriptions[Math.floor(Math.random() * descriptions.length)]
  }
}

/**
 * Handle image loading error
 */
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  console.warn('Logo image not found at /src/assets/WNG-Logo.png')
}


</script>


<style scoped>
/* Print styles - make it print exactly as it appears */
@media print {
  /* Hide everything on the page */
  body > *:not(.quote-viewer-modal) {
    display: none !important;
  }

  /* Ensure only the quote viewer modal is visible */
  .quote-viewer-modal {
    display: block !important;
    visibility: visible !important;
  }

  .quote-viewer-modal * {
    visibility: visible !important;
  }

  /* Remove modal overlay styling for print */
  .quote-viewer-modal {
    position: static !important;
    background: white !important;
    z-index: auto !important;
    display: block !important;
    width: 100% !important;
    height: auto !important;
    max-width: none !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
    inset: auto !important;
  }

  .quote-viewer-modal .bg-black,
  .quote-viewer-modal .bg-opacity-50 {
    background: transparent !important;
  }

  /* Quote content container */
  .bg-white {
    background: white !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    max-width: none !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* Hide modal header for print */
  .flex.items-center.justify-between.p-4.border-b {
    display: none !important;
  }

  /* Quote content */
  .p-8 {
    padding: 20px !important;
  }

  /* Preserve all colors and backgrounds */
  .bg-green-500 {
    background-color: #10b981 !important;
    color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-gray-100 {
    background-color: #f3f4f6 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-gray-50 {
    background-color: #f9fafb !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-blue-50 {
    background-color: #eff6ff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-yellow-50 {
    background-color: #fefce8 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-green-50 {
    background-color: #f0fdf4 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-orange-50 {
    background-color: #fff7ed !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Preserve text colors */
  .text-green-600 {
    color: #059669 !important;
  }

  .text-red-600 {
    color: #dc2626 !important;
  }

  .text-blue-800 {
    color: #1e40af !important;
  }

  .text-yellow-800 {
    color: #92400e !important;
  }

  .text-green-800 {
    color: #166534 !important;
  }

  .text-orange-800 {
    color: #9a3412 !important;
  }

  /* Preserve borders */
  .border,
  .border-gray-300 {
    border: 1px solid #d1d5db !important;
  }

  .border-t {
    border-top: 1px solid #d1d5db !important;
  }

  .border-t-2 {
    border-top: 2px solid #6b7280 !important;
  }

  .border-r {
    border-right: 1px solid #d1d5db !important;
  }

  .border-b {
    border-bottom: 1px solid #d1d5db !important;
  }

  /* Table styling */
  table {
    border-collapse: collapse !important;
    width: 100% !important;
  }

  th, td {
    border: 1px solid #d1d5db !important;
    padding: 8px !important;
  }

  /* Page setup */
  @page {
    margin: 0.5in;
    size: A4;
  }

  /* Prevent page breaks within sections */
  .mb-8 {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Font sizes */
  .text-3xl {
    font-size: 1.875rem !important;
    line-height: 2.25rem !important;
  }

  .text-2xl {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }

  .text-lg {
    font-size: 1.125rem !important;
    line-height: 1.75rem !important;
  }

  .text-sm {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  .text-xs {
    font-size: 0.75rem !important;
    line-height: 1rem !important;
  }

  /* Font weights */
  .font-bold {
    font-weight: 700 !important;
  }

  .font-semibold {
    font-weight: 600 !important;
  }

  .font-medium {
    font-weight: 500 !important;
  }

  /* Hide edit mode elements when printing */
  textarea,
  input[type="text"] {
    display: none !important;
  }

  /* Show only the text content when printing */
  .text-xs.text-gray-600 {
    display: block !important;
  }

  /* Ensure single page */
  html, body {
    height: auto !important;
    overflow: visible !important;
  }

  /* Force single page layout */
  * {
    max-height: none !important;
  }
}
</style>
