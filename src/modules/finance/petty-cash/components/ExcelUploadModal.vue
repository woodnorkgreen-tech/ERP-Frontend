<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="excel-upload-modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 relative z-20">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="excel-upload-modal-title">
              Upload Excel File
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload a QuickBooks-compatible Excel file with petty cash disbursement data.
            </p>

            <!-- File Upload Section -->
            <div class="mt-4">
              <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md" :class="{
                'border-blue-500 dark:border-blue-400': isDragOver,
                'bg-gray-50 dark:bg-gray-700': isDragOver
              }" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12m16-28v8m0 0V12a4 4 0 00-4-4H12a4 4 0 00-4 4v8" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                  </svg>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <span class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 cursor-pointer relative z-20" @click="triggerFileInput">
                      Click to upload
                    </span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Excel files (.xlsx, .xls) only, max 10MB
                  </p>
                  <input type="file" ref="fileInput" @change="handleFileChange" accept=".xlsx,.xls" class="hidden">
                </div>
              </div>

              <!-- Selected File Info -->
              <div v-if="selectedFile" class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                    </div>
                  </div>
                  <button @click="clearFile" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>

            <!-- Results Summary -->
            <div v-if="uploadResults" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Import Results</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600 dark:text-gray-300">Total Rows:</p>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ uploadResults.total_rows }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-300">Successful:</p>
                  <p class="font-semibold text-green-600 dark:text-green-400">{{ uploadResults.successful_imports }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-300">Failed:</p>
                  <p class="font-semibold text-red-600 dark:text-red-400">{{ uploadResults.failed_rows.length }}</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-300">Duplicates:</p>
                  <p class="font-semibold text-yellow-600 dark:text-yellow-400">{{ uploadResults.duplicates.length }}</p>
                </div>
              </div>
            </div>

            <!-- Error Details -->
            <div v-if="uploadResults && uploadResults.failed_rows.length > 0" class="mt-4">
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Failed Rows</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div v-for="(error, index) in uploadResults.failed_rows" :key="index" class="p-2 bg-red-100 dark:bg-red-800/30 rounded">
                    <p class="text-xs font-medium text-red-800 dark:text-red-200">Row {{ error.row }}:</p>
                    <ul class="text-xs text-red-700 dark:text-red-300 list-disc list-inside mt-1">
                      <li v-for="(errMsg, msgIndex) in error.errors" :key="msgIndex">{{ errMsg }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duplicate Details -->
            <div v-if="uploadResults && uploadResults.duplicates.length > 0" class="mt-4">
              <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Duplicate Transactions</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <div v-for="(duplicate, index) in uploadResults.duplicates" :key="index" class="p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded">
                    <p class="text-xs text-yellow-800 dark:text-yellow-200">Row {{ duplicate.row }}: {{ duplicate.reason }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            @click="uploadFile"
            :disabled="!selectedFile || isUploading"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed relative z-20"
          >
            <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isUploading ? 'Uploading...' : 'Upload File' }}
          </button>
          <button
            @click="close"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm relative z-20 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePettyCashStore } from '../stores'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

const store = usePettyCashStore()

// State
const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadResults = ref<any>(null)
const errorMessage = ref<string | null>(null)

// Computed
const fileInput = ref<HTMLInputElement | null>(null)

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files?.length) {
    const file = e.dataTransfer.files[0]
    if (isValidFile(file)) {
      selectedFile.value = file
    }
  }
}

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    if (isValidFile(file)) {
      selectedFile.value = file
    }
  }
}

const isValidFile = (file: File): boolean => {
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Please upload a valid Excel file (.xlsx, .xls)'
    return false
  }

  if (file.size > maxSize) {
    errorMessage.value = 'File size must be less than 10MB'
    return false
  }

  errorMessage.value = null
  return true
}

const clearFile = () => {
  selectedFile.value = null
  uploadResults.value = null
  errorMessage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  errorMessage.value = null
  uploadProgress.value = 0
  uploadResults.value = null

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // Simulate progress for demo purposes
    const interval = setInterval(() => {
      uploadProgress.value += 5
      if (uploadProgress.value >= 90) {
        clearInterval(interval)
      }
    }, 200)

    const response = await store.uploadExcel(formData)

    clearInterval(interval)
    uploadProgress.value = 100

    if (response.success) {
      uploadResults.value = response.data
      
      // Reset for next upload after a delay
      setTimeout(() => {
        clearFile()
        emit('success')
        close()
      }, 3000)
    } else {
      errorMessage.value = response.message || 'Failed to upload file'
    }
  } catch (error) {
    console.error('Upload error:', error)
    errorMessage.value = 'An error occurred during upload. Please try again.'
  } finally {
    isUploading.value = false
    setTimeout(() => {
      uploadProgress.value = 0
    }, 2000)
  }
}

const close = () => {
  clearFile()
  emit('close')
}
</script>