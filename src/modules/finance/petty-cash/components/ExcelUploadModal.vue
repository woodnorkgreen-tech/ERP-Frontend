<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    aria-labelledby="upload-modal-title"
    role="dialog"
    aria-modal="true"
    @click.self="$emit('close')"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="upload-modal-title">
          Upload Petty Cash Disbursements
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto">
        <div v-if="!uploadResults" class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Instructions for Excel Upload
                </h3>
                <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <ul class="list-disc pl-5 space-y-1">
                    <li>Required columns: <strong>Date, Receiver, Account, Amount, Description, Classification, Tax</strong></li>
                    <li>Optional columns: <strong>Project Name, Job No.</strong></li>
                    <li>Accepted classification values: <strong>Admin, Agencies, Operations, Other</strong></li>
                    <li>Tax values: <strong>ETR, NO ETR</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- File Upload Zone -->
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors"
            :class="[
              isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600',
              isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="triggerFileInput"
          >
            <div class="space-y-1 text-center">
              <svg
                v-if="!selectedFile"
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div v-else class="flex flex-col items-center">
                <svg class="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              
              <div class="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    ref="fileInput"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    accept=".xlsx,.xls"
                    @change="onFileChange"
                    :disabled="isUploading"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                XLSX, XLS up to 10MB
              </p>
            </div>
          </div>

          <div v-if="uploadError" class="text-sm text-red-600 dark:text-red-400 text-center">
            {{ uploadError }}
          </div>

          <!-- Progress Bar -->
          <div v-if="isUploading" class="space-y-2">
            <div class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-600 transition-all duration-300"
                :style="{ width: `${uploadProgress}%` }"
              ></div>
            </div>
            <p class="text-xs text-center text-gray-500 dark:text-gray-400">
              Uploading and processing... {{ uploadProgress }}%
            </p>
          </div>
        </div>

        <!-- Success/Results View -->
        <div v-else class="space-y-6">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="uploadResults.failed_rows.length > 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-green-100 dark:bg-green-900/20'">
              <svg v-if="uploadResults.failed_rows.length === 0" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              Import Completed
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ uploadResults.successful_imports }} rows imported successfully out of {{ uploadResults.total_rows }} total rows.
            </p>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center border border-gray-100 dark:border-gray-700">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ uploadResults.total_rows }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</span>
            </div>
            <div class="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg text-center border border-green-100 dark:border-green-800/30">
              <span class="block text-xl font-bold text-green-600 dark:text-green-400">{{ uploadResults.successful_imports }}</span>
              <span class="text-xs text-green-500 dark:text-green-400 uppercase tracking-wider">Success</span>
            </div>
            <div class="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-center border border-red-100 dark:border-red-800/30">
              <span class="block text-xl font-bold text-red-600 dark:text-red-400">{{ uploadResults.failed_rows.length }}</span>
              <span class="text-xs text-red-500 dark:text-red-400 uppercase tracking-wider">Failed</span>
            </div>
          </div>

          <!-- Failed Rows Details -->
          <div v-if="uploadResults.failed_rows.length > 0" class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Error Details</h4>
            <div class="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Row</th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Error</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(error, index) in uploadResults.failed_rows" :key="index">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{{ error.row }}</td>
                    <td class="px-4 py-2 text-sm text-red-600 dark:text-red-400">
                      <ul>
                        <li v-for="(err, eIdx) in error.errors" :key="eIdx">{{ err }}</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Duplicates Details -->
          <div v-if="uploadResults.duplicates.length > 0" class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Duplicates Skipped</h4>
            <div class="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Row</th>
                    <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(dup, index) in uploadResults.duplicates" :key="index">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{{ dup.row }}</td>
                    <td class="px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400">{{ dup.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
        <button
          v-if="!uploadResults"
          type="button"
          @click="$emit('close')"
          :disabled="isUploading"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          v-if="!uploadResults"
          type="button"
          @click="uploadFile"
          :disabled="!selectedFile || isUploading"
          class="px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isUploading ? 'Processing...' : 'Start Import' }}
        </button>
        <button
          v-else
          type="button"
          @click="resetAndClose"
          class="px-4 py-2 bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePettyCashStore } from '../stores/pettyCashStore'
import { pettyCashService } from '../services/pettyCashService'
import { useErrorHandler } from '../composables/useErrorHandler'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const store = usePettyCashStore()
const { handleError } = useErrorHandler()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref<string | null>(null)
const uploadResults = ref<any>(null)

const triggerFileInput = () => {
  if (!isUploading.value) {
    fileInput.value?.click()
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    validateAndSetFile(target.files[0])
  }
}

const onDragOver = () => {
  if (!isUploading.value) {
    isDragging.value = true
  }
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event: DragEvent) => {
  if (isUploading.value) return
  isDragging.value = false
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    validateAndSetFile(event.dataTransfer.files[0])
  }
}

const validateAndSetFile = (file: File) => {
  uploadError.value = null
  
  // Validate file type
  const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (!allowedTypes.includes(file.type) && extension !== 'xlsx' && extension !== 'xls') {
    uploadError.value = 'Only Excel files (.xlsx, .xls) are allowed'
    selectedFile.value = null
    return
  }
  
  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = 'File size must be less than 10MB'
    selectedFile.value = null
    return
  }
  
  selectedFile.value = file
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  uploadError.value = null
  uploadProgress.value = 10 // Start progress
  
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  
  try {
    // We'll use the service directly for progress tracking if need be
    // but the store action is preferred if it supports it
    const response = await pettyCashService.uploadExcel(formData)
    
    if (response.success) {
      uploadResults.value = response.data
      uploadProgress.value = 100
      
      // Refresh the store data if items were imported
      if (response.data.successful_imports > 0) {
        await store.refreshAll()
        emit('success')
      }
    } else {
      uploadError.value = response.message || 'Failed to process Excel file'
    }
  } catch (error: any) {
    handleError(error, { context: 'excel_upload' })
    uploadError.value = error.message || 'An error occurred during upload'
  } finally {
    isUploading.value = false
  }
}

const resetAndClose = () => {
  selectedFile.value = null
  uploadResults.value = null
  uploadProgress.value = 0
  uploadError.value = null
  emit('close')
}
</script>