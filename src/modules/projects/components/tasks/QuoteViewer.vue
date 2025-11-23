<template>
  <!-- Modal Overlay -->
  <div v-if="isVisible" class="quote-viewer-modal fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
      <!-- Modal Header (Controls) -->
      <div class="flex items-center justify-between p-4 border-b print:hidden">
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
      <div class="quote-content p-8 bg-white">
        <!-- Header Section -->
        <div class="flex items-start justify-between mb-6">
          <!-- Company Logo and Name -->
          <div class="flex flex-col items-center">
            <img
              src="/src/assets/WNG-Logo.png"
              alt="WoodnorkGreen Logo"
              class="h-20 w-auto mb-2"
              @error="handleImageError"
            />
            <h1 class="text-sm font-bold text-gray-900 tracking-widest uppercase">Woodnork Green</h1>
          </div>

          <!-- Quote Info Table -->
          <div class="text-right">
            <h2 class="text-2xl font-bold text-green-500 mb-2 uppercase tracking-wide">QUOTE</h2>
            <div class="border border-gray-300 inline-block">
              <div class="flex border-b border-gray-300">
                <div class="bg-white px-4 py-1 text-xs font-bold text-gray-700 border-r border-gray-300 w-24 text-center">DATE</div>
                <div class="bg-white px-4 py-1 text-xs font-bold text-red-500 w-32 text-center">{{ formatDate(new Date()) }}</div>
              </div>
              <div class="flex">
                <div class="bg-white px-4 py-1 text-xs font-bold text-gray-700 border-r border-gray-300 w-24 text-center">QUOTE #</div>
                <div class="bg-white px-4 py-1 text-xs font-bold text-red-500 w-32 text-center">{{ quoteNumber }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Details Section -->
        <div class="mb-6">
          <div class="bg-green-500 text-white px-2 py-1 font-bold text-xs uppercase tracking-wide w-1/2">
            CUSTOMER DETAILS
          </div>
          <div class="bg-gray-200 p-3 text-xs text-gray-900">
            <div class="font-bold mb-1">{{ quoteData.projectInfo.clientName }}</div>
            <div class="mb-1">Nairobi, Kenya</div>
            <div class="mb-1"><span class="font-bold">Attn:</span> Project Manager</div>
            <div class="mb-1">
              <span class="font-bold">Project/Event/Setup/Delivery Date:</span> 
              {{ quoteData.projectInfo.setupDate ? formatDate(new Date(quoteData.projectInfo.setupDate)) : 'TBC' }}
            </div>
            <div>
              <span class="font-bold text-red-600">Ref:</span> 
              <span class="text-red-600">{{ quoteData.projectInfo.enquiryTitle }}</span>
            </div>
          </div>
        </div>

        <!-- Quote Table -->
        <div class="mb-6">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-green-100 border-b-2 border-green-500">
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-12">LINE #</th>
                <th class="text-left py-1 px-2 font-bold text-white bg-green-500 border border-white">DESCRIPTION</th>
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-12">QTY</th>
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-24">Unit Price</th>
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-24">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <!-- Materials -->
              <template v-for="(element, elementIndex) in quoteData.materials" :key="element.id">
                <!-- Summary View (Default) -->
                <tr v-if="!showDetailedItems" class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ elementIndex + 1 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">{{ element.name }}</div>
                    <div v-if="!isEditMode" class="text-gray-600">{{ getDescription(element.id, element) }}</div>
                    <textarea
                      v-else
                      v-model="editableDescriptions[element.id]"
                      class="w-full mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 resize-none"
                      rows="2"
                      placeholder="Enter description..."
                    ></textarea>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">1</td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">{{ formatCurrency(element.finalTotal / ((element.materials?.[0]?.quantity || 1) * (element.materials?.[0]?.days || 1))) }}</td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(element.finalTotal) }}</td>
                </tr>

                <!-- Detailed View -->
                <template v-else>
                  <!-- Element Header -->
                  <tr class="bg-gray-100 border-b border-gray-300">
                    <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ elementIndex + 1 }}</td>
                    <td colspan="4" class="py-1 px-2 font-bold text-gray-800">
                      <div v-if="!isEditMode">{{ element.name }} - {{ getDescription(element.id, element) }}</div>
                      <div v-else class="flex items-center space-x-2">
                        <span>{{ element.name }} - </span>
                        <input
                          v-model="editableDescriptions[element.id]"
                          class="flex-1 text-xs bg-yellow-50 border border-yellow-300 rounded px-2 py-1"
                          placeholder="Enter description..."
                        />
                      </div>
                    </td>
                  </tr>

                  <!-- Individual Materials -->
                  <tr v-for="(material, matIndex) in element.materials" :key="material.id" class="border-b border-gray-200">
                    <td class="py-1 px-2 text-center border-r border-gray-300 text-gray-500"></td>
                    <td class="py-1 px-2 pl-6 border-r border-gray-300">
                      <div class="text-gray-900">{{ material.description }}</div>
                    </td>
                    <td class="py-1 px-2 text-center border-r border-gray-300">{{ material.quantity }}</td>
                    <td class="py-1 px-2 text-right border-r border-gray-300">{{ formatCurrency(material.finalPrice / (material.quantity * (material.days || 1))) }}</td>
                    <td class="py-1 px-2 text-right">{{ formatCurrency(material.finalPrice) }}</td>
                  </tr>
                </template>
              </template>

              <!-- Labour -->
              <template v-if="quoteData.totals.labourTotal > 0">
                <tr class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ quoteData.materials.length + 1 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">Provision of labour for setup (within Nairobi)</div>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">1</td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">{{ formatCurrency(quoteData.totals.labourTotal) }}</td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(quoteData.totals.labourTotal) }}</td>
                </tr>
              </template>

              <!-- Logistics -->
              <template v-if="quoteData.totals.logisticsTotal > 0">
                <tr class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ quoteData.materials.length + 2 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">Transport cost</div>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">1</td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                </tr>
              </template>

              <!-- Expenses -->
              <template v-if="quoteData.totals.expensesTotal > 0">
                <tr class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ quoteData.materials.length + 3 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">Provision of Generator and fuel during setup</div>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">1</td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">{{ formatCurrency(quoteData.totals.expensesTotal) }}</td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(quoteData.totals.expensesTotal) }}</td>
                </tr>
              </template>

              <!-- Subtotal Row -->
              <tr class="border-t-2 border-gray-400">
                <td colspan="3" class="border-r border-gray-300"></td>
                <td class="py-1 px-2 font-bold text-gray-900 border-r border-gray-300 border-b border-gray-300">Sub Total</td>
                <td class="py-1 px-2 text-right font-bold text-gray-900 border-b border-gray-300">{{ formatCurrency(quoteData.totals.subtotal) }}</td>
              </tr>
              
              <!-- Total Row -->
              <tr>
                <td colspan="3" class="border-r border-gray-300"></td>
                <td class="py-1 px-2 font-bold text-gray-900 border-r border-gray-300 border-b border-gray-300">Total</td>
                <td class="py-1 px-2 text-right font-bold text-gray-900 border-b border-gray-300">{{ formatCurrency(quoteData.totals.grandTotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms and Conditions & Footer -->
        <div class="flex flex-col md:flex-row gap-8 break-inside-avoid">
          <!-- Terms Section (Left) -->
          <div class="w-full md:w-2/3">
            <div class="bg-green-500 text-white px-2 py-1 font-bold text-xs uppercase tracking-wide mb-1">
              TERMS AND CONDITIONS
            </div>
            <div class="border border-gray-300 p-3 bg-gray-50 text-[10px] leading-tight">
              
              <!-- Payment Terms -->
              <div class="mb-2">
                <h4 class="font-bold text-red-600 mb-1">PAYMENT TERMS</h4>
                <ul class="list-none space-y-0.5 text-gray-800">
                  <li><span class="font-semibold">Deposit Payment:</span> Within Agreed Timelines (Per Email)</li>
                  <li><span class="font-semibold">Balance Payment:</span> Upon complete delivery</li>
                  <li><span class="font-semibold">Late Payment Penalty:</span> 2% Monthly for Late Payments</li>
                  <li>Production begins after receipt of LPO and payment of 70% Deposit</li>
                  <li>The Total Quote amount is <span class="text-red-600 font-semibold">exclusive of 16% VAT</span></li>
                </ul>
              </div>

              <!-- Client Obligations -->
              <div class="mb-2">
                <h4 class="font-bold text-red-600 mb-1">CLIENT OBLIGATIONS</h4>
                <ul class="list-none space-y-0.5 text-gray-800">
                  <li><span class="font-semibold">Setup & Branding Time:</span> Client must provide ample time for setup</li>
                  <li><span class="font-semibold">Pre-Production Approvals:</span> Client must approve pre-production on time</li>
                </ul>
              </div>

              <!-- Approval & Execution -->
              <div class="mb-2">
                <h4 class="font-bold text-red-600 mb-1">APPROVAL & EXECUTION</h4>
                <ul class="list-none space-y-0.5 text-gray-800">
                  <li><span class="font-semibold">Approval Required Before Work:</span> Client must approve before work starts</li>
                  <li><span class="font-semibold">Change Requests Process:</span> Changes to initial quote will be billed separately</li>
                </ul>
              </div>

              <!-- Bank Details -->
              <div class="mt-3 border-t border-gray-200 pt-2">
                <div class="font-bold text-gray-900 mb-1">Cheques payable to Woodnork Green Limited</div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-800">
                  <div><span class="font-semibold">Account Name:</span> Woodnork Green Ltd</div>
                  <div><span class="font-semibold">Bank Name:</span> NCBA Bank. <span class="font-semibold">Code:</span> 07000</div>
                  <div><span class="font-semibold">Branch:</span> Kenyatta Avenue. <span class="font-semibold">Code:</span> 125</div>
                  <div><span class="font-semibold">Account Number:</span> <span class="text-red-600 font-bold">1002970089</span></div>
                  <div><span class="font-semibold">SWIFT Code:</span> CBAFKENX</div>
                  <div class="col-span-2 flex space-x-2">
                    <div><span class="font-semibold">PAYBILL:</span> <span class="text-red-600 font-bold">880100</span></div>
                    <div><span class="font-semibold">A/C:</span> <span class="text-red-600 font-bold">1002970089</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side (Image Placeholder or Empty) -->
          <div class="w-full md:w-1/3 flex items-end justify-center">
             <!-- Placeholder for 3D render if available, or just empty space as per design -->
             <div class="h-48 w-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs italic">
               Project Render / Image
             </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-[10px] text-gray-600 mt-4 pt-2 border-t border-gray-200">
          <p class="font-bold text-gray-800">Woodnork Green Ltd</p>
          <p>Tel: +254 780 397 798 | Email: admin@woodnorkgreen.co.ke</p>
          <p>Physical Address: Karen Village, Ngong Road, Nairobi, Kenya | Website: www.woodnorkgreen.co.ke</p>
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
