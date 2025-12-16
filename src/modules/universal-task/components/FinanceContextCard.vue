<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Finance Information</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Financial details and payment status</p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Financial Overview -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Transaction Details
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.transaction_type">
            <span class="text-gray-500 dark:text-gray-400">Transaction Type:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.transaction_type }}</span>
          </div>
          <div v-if="context.payment_method">
            <span class="text-gray-500 dark:text-gray-400">Payment Method:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.payment_method }}</span>
          </div>
          <div v-if="context.currency">
            <span class="text-gray-500 dark:text-gray-400">Currency:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.currency }}</span>
          </div>
          <div v-if="context.reference_number">
            <span class="text-gray-500 dark:text-gray-400">Reference:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.reference_number }}</span>
          </div>
        </div>
      </div>

      <!-- Amount Information -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Amount Details
        </h4>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-500 dark:text-gray-400">Base Amount:</span>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(context.amount) }}</span>
          </div>
          <div v-if="context.tax_amount" class="flex justify-between items-center">
            <span class="text-gray-500 dark:text-gray-400">Tax Amount:</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ formatCurrency(context.tax_amount) }}</span>
          </div>
          <div v-if="context.discount_amount" class="flex justify-between items-center">
            <span class="text-gray-500 dark:text-gray-400">Discount:</span>
            <span class="text-sm text-green-600 dark:text-green-400">-{{ formatCurrency(context.discount_amount) }}</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-900 dark:text-white">Total Amount:</span>
              <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(getTotalAmount()) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Status -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Payment Status
        </h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Payment Status:</span>
            <span
              class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
              :class="getPaymentStatusBadgeClass(context.payment_status)"
            >
              {{ getPaymentStatusLabel(context.payment_status) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Approval Status:</span>
            <span
              class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
              :class="getApprovalStatusBadgeClass(context.approval_status)"
            >
              {{ getApprovalStatusLabel(context.approval_status) }}
            </span>
          </div>
          <div v-if="context.approved_by" class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Approved by:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ context.approver?.name || 'Unknown' }}</span>
          </div>
          <div v-if="context.approved_at" class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Approved at:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ formatDateTime(context.approved_at) }}</span>
          </div>
          <div v-if="context.payment_date" class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Payment Date:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ formatDateTime(context.payment_date) }}</span>
          </div>
          <div v-if="context.approval_notes" class="mt-3">
            <span class="text-sm text-gray-500 dark:text-gray-400 block mb-1">Approval Notes:</span>
            <p class="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border">
              {{ context.approval_notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- Vendor Information -->
      <div v-if="context.vendor_name || context.vendor_account_number" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Vendor Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.vendor_name">
            <span class="text-gray-500 dark:text-gray-400">Vendor Name:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.vendor_name }}</span>
          </div>
          <div v-if="context.vendor_account_number">
            <span class="text-gray-500 dark:text-gray-400">Account Number:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.vendor_account_number }}</span>
          </div>
        </div>
      </div>

      <!-- Invoice Information -->
      <div v-if="context.invoice_number || context.invoice_date || context.due_date" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoice Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div v-if="context.invoice_number">
            <span class="text-gray-500 dark:text-gray-400">Invoice Number:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.invoice_number }}</span>
          </div>
          <div v-if="context.invoice_date">
            <span class="text-gray-500 dark:text-gray-400">Invoice Date:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ formatDate(context.invoice_date) }}</span>
          </div>
          <div v-if="context.due_date">
            <span class="text-gray-500 dark:text-gray-400">Due Date:</span>
            <span 
              class="ml-2 text-gray-900 dark:text-white font-medium"
              :class="{ 'text-red-600 dark:text-red-400': isOverdue() }"
            >
              {{ formatDate(context.due_date) }}
              <span v-if="isOverdue()" class="text-xs">(Overdue)</span>
            </span>
          </div>
        </div>
        <div v-if="context.due_date && !isPaid()" class="mt-3 text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            Days until due: <span :class="getDaysUntilDueClass()">{{ getDaysUntilDue() }}</span>
          </span>
        </div>
      </div>

      <!-- Account Codes -->
      <div v-if="context.budget_code || context.account_code || context.cost_center || context.project_code" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Accounting Codes
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.budget_code">
            <span class="text-gray-500 dark:text-gray-400">Budget Code:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.budget_code }}</span>
          </div>
          <div v-if="context.account_code">
            <span class="text-gray-500 dark:text-gray-400">Account Code:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.account_code }}</span>
          </div>
          <div v-if="context.cost_center">
            <span class="text-gray-500 dark:text-gray-400">Cost Center:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.cost_center }}</span>
          </div>
          <div v-if="context.project_code">
            <span class="text-gray-500 dark:text-gray-400">Project Code:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.project_code }}</span>
          </div>
        </div>
      </div>

      <!-- Line Items -->
      <div v-if="context.line_items?.length" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Line Items
        </h4>
        <div class="space-y-2">
          <div
            v-for="(item, index) in context.line_items"
            :key="index"
            class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
          >
            <div class="flex-1">
              <span class="text-sm text-gray-900 dark:text-white">{{ item.description || 'Item ' + (index + 1) }}</span>
              <span v-if="item.quantity" class="text-xs text-gray-500 dark:text-gray-400 ml-2">Qty: {{ item.quantity }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.amount || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Description -->
      <div v-if="context.payment_description" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Payment Description
        </h4>
        <p class="text-sm text-gray-700 dark:text-gray-300">{{ context.payment_description }}</p>
      </div>

      <!-- Notes -->
      <div v-if="context.notes" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Notes
        </h4>
        <p class="text-sm text-gray-700 dark:text-gray-300">{{ context.notes }}</p>
      </div>

      <!-- Document Requirements -->
      <div v-if="context.requires_receipt || context.supporting_documents?.length" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Supporting Documents
        </h4>
        <div class="space-y-2">
          <div v-if="context.requires_receipt" class="flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-blue-700 dark:text-blue-300">Receipt Required</span>
            <span v-if="context.receipt_path" class="text-xs text-green-600 dark:text-green-400">✓ Provided</span>
          </div>
          <div v-if="context.supporting_documents?.length" class="mt-2">
            <span class="text-sm text-blue-700 dark:text-blue-300 block mb-1">Documents:</span>
            <div class="space-y-1">
              <div
                v-for="(doc, index) in context.supporting_documents"
                :key="index"
                class="text-xs text-blue-600 dark:text-blue-400"
              >
                {{ doc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  context: any
}

const { context } = defineProps<Props>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numAmount || 0)
}

const getTotalAmount = () => {
  const amount = parseFloat(context.amount) || 0
  const tax = parseFloat(context.tax_amount) || 0
  const discount = parseFloat(context.discount_amount) || 0
  return amount + tax - discount
}

const getPaymentStatusLabel = (status?: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    paid: 'Paid',
    failed: 'Failed',
    cancelled: 'Cancelled'
  }
  return statusMap[status || ''] || status || 'Unknown'
}

const getPaymentStatusBadgeClass = (status?: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  return classMap[status || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getApprovalStatusLabel = (status?: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected'
  }
  return statusMap[status || ''] || status || 'Unknown'
}

const getApprovalStatusBadgeClass = (status?: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classMap[status || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const isPaid = () => {
  return context.payment_status === 'paid'
}

const isOverdue = () => {
  if (!context.due_date || isPaid()) return false
  return new Date(context.due_date) < new Date()
}

const getDaysUntilDue = () => {
  if (!context.due_date) return null
  const dueDate = new Date(context.due_date)
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getDaysUntilDueClass = () => {
  const days = getDaysUntilDue()
  if (days === null) return ''
  if (days < 0) return 'text-red-600 dark:text-red-400'
  if (days <= 7) return 'text-orange-600 dark:text-orange-400'
  return 'text-gray-900 dark:text-white'
}
</script>