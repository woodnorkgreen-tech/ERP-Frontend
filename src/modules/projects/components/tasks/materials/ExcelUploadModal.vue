<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- Center positioning helper -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <!-- Header -->
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4" id="modal-title">
                Upload Materials from Excel
              </h3>

              <!-- Upload Area (when no file uploaded) -->
              <div v-if="!uploadedFile && !isUploading" class="mt-4">
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="$refs.fileInput.click()"
                  :class="{ 'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragging }"
                >
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span class="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Excel files only (.xlsx, .xls) - Max 5MB
                  </p>
                  <input
                    ref="fileInput"
                    type="file"
                    class="hidden"
                    accept=".xlsx,.xls"
                    @change="handleFileSelect"
                  />
                </div>

                <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="flex">
                    <svg class="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">Tips for successful upload:</h3>
                      <div class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <ul class="list-disc list-inside space-y-1">
                          <li>Download the template first if you haven't already</li>
                          <li>Follow the empty cell continuation format</li>
                          <li>Use dropdown values for Type, Category, and Unit</li>
                          <li>Ensure all quantities are greater than 0</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isUploading" class="mt-4 text-center py-12">
                <svg class="animate-spin h-12 w-12 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-4 text-gray-600 dark:text-gray-400">Validating file...</p>
              </div>

              <!-- Preview Results -->
              <div v-if="previewData && !isUploading" class="mt-4">
                <!-- Stats Summary -->
                <div class="grid grid-cols-4 gap-4 mb-4">
                  <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.total_elements }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Elements</div>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.total_materials }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Materials</div>
                  </div>
                  <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.total_warnings }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Warnings</div>
                  </div>
                  <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.total_errors }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Errors</div>
                  </div>
                </div>

                <!-- Errors -->
                <div v-if="errors.length > 0" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 class="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                    ❌ Errors ({{ errors.length }}) - Must be fixed before importing
                  </h4>
                  <div class="max-h-40 overflow-y-auto">
                    <ul class="text-sm text-red-700 dark:text-red-400 space-y-1">
                      <li v-for="(error, index) in errors" :key="index" class="flex">
                        <span class="font-mono text-xs mr-2">Row {{ error.row }}:</span>
                        <span>{{ error.message }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Warnings -->
                <div v-if="warnings.length > 0" class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 class="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    ⚠️ Warnings ({{ warnings.length }}) - Will import with defaults
                  </h4>
                  <div class="max-h-40 overflow-y-auto">
                    <ul class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                      <li v-for="(warning, index) in warnings" :key="index" class="flex">
                        <span class="font-mono text-xs mr-2">Row {{ warning.row }}:</span>
                        <span>{{ warning.message }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Preview Table -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div class="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Preview Data</h4>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    <div v-for="(element, index) in elements" :key="index" class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-2">
                        <div class="flex justify-between items-center">
                          <div>
                            <span class="font-mono text-xs text-gray-500 mr-2">{{ element.id }}</span>
                            <span class="font-semibold text-gray-900 dark:text-gray-100">{{ element.name }}</span>
                            <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {{ element.type }}
                            </span>
                            <span class="ml-2 px-2 py-0.5 text-xs rounded-full" :class="getCategoryClass(element.category)">
                              {{ element.category }}
                            </span>
                          </div>
                          <span class="text-xs text-gray-500">{{ element.particulars.length }} materials</span>
                        </div>
                      </div>
                      <div class="px-4 py-2">
                        <ul class="text-sm space-y-1">
                          <li v-for="(material, mIndex) in element.particulars" :key="mIndex" class="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>• {{ material.description }}</span>
                            <span class="text-gray-500">{{ material.quantity }} {{ material.unit }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Change file option -->
                <div class="mt-4 flex justify-center">
                  <button
                    @click="resetUpload"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    ← Upload a different file
                  </button>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer buttons -->
        <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            v-if="previewData && hasNoErrors"
            type="button"
            @click="confirmImport"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="isImporting"
          >
            <svg v-if="isImporting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isImporting ? 'Importing...' : 'Confirm Import' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="isImporting"
          >
            {{ previewData ? 'Cancel' : 'Close' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import api from '@/plugins/axios'

interface Props {
  isOpen: boolean
  taskId: number
}

interface Emits {
  close: []
  success: [result: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const uploadedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const isImporting = ref(false)
const previewData = ref<any>(null)
const errorMessage = ref('')

// Computed
const stats = computed(() => previewData.value?.stats || { total_elements: 0, total_materials: 0, total_warnings: 0, total_errors: 0 })
const elements = computed(() => previewData.value?.elements || [])
const errors = computed(() => previewData.value?.errors || [])
const warnings = computed(() => previewData.value?.warnings || [])
const hasNoErrors = computed(() => errors.value.length === 0)

// Methods
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    uploadFile(event.dataTransfer.files[0])
  }
}

const uploadFile = async (file: File) => {
  // Validate file type
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    errorMessage.value = 'Please upload a valid Excel file (.xlsx or .xls)'
    return
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 5MB'
    return
  }

  uploadedFile.value = file
  errorMessage.value = ''
  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(
      `/api/projects/tasks/${props.taskId}/materials/template/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    previewData.value = response.data.preview
  } catch (error: any) {
    console.error('Upload failed:', error)
    errorMessage.value = error.response?.data?.message || 'Failed to upload file. Please try again.'
    uploadedFile.value = null
  } finally {
    isUploading.value = false
  }
}

const resetUpload = () => {
  uploadedFile.value = null
  previewData.value = null
  errorMessage.value = ''
}

const confirmImport = () => {
  // This will be implemented in Phase 3
  emit('success', previewData.value)
  closeModal()
}

const closeModal = () => {
  if (!isUploading.value && !isImporting.value) {
    resetUpload()
    emit('close')
  }
}

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    'production': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
    'hire': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'outsourced': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
  }
  return classes[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
}
</script>

<style scoped>
/* Custom scrollbar for preview */
.max-h-96::-webkit-scrollbar,
.max-h-40::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track,
.max-h-40::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-96::-webkit-scrollbar-thumb,
.max-h-40::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover,
.max-h-40::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
