<template>
  <div class="task-attachment-panel">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Attachments</h3>
      <label
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload File
        <input
          type="file"
          class="hidden"
          @change="handleFileSelect"
          :disabled="uploading"
        />
      </label>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span class="text-sm text-gray-700 dark:text-gray-300">Uploading file...</span>
      </div>
    </div>

    <!-- Attachments List -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading attachments...</p>
    </div>

    <div v-else-if="attachments.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No attachments yet</h4>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Upload files related to this task.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="attachment in attachments"
        :key="attachment.id"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">{{ attachment.file_name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatFileSize(attachment.file_size) }} • {{ formatDate(attachment.created_at) }}
            </p>
            <p v-if="attachment.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ attachment.description }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="downloadAttachment(attachment)"
            class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
            title="Download"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            @click="deleteAttachment(attachment)"
            class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
            title="Delete"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import taskApi from '../services/api'
import type { TaskAttachment } from '../types'

const props = defineProps<{
  taskId: number
}>()

const emit = defineEmits<{
  attachmentAdded: []
}>()

const attachments = ref<TaskAttachment[]>([])
const loading = ref(false)
const uploading = ref(false)

const loadAttachments = async () => {
  loading.value = true
  try {
    const response = await taskApi.getTaskAttachments(props.taskId)
    if (response.success && response.data) {
      attachments.value = response.data
    }
  } catch (error) {
    console.error('Error loading attachments:', error)
  } finally {
    loading.value = false
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const response = await taskApi.uploadAttachment(props.taskId, file)
    if (response.success) {
      await loadAttachments()
      emit('attachmentAdded')
      target.value = '' // Reset input
    } else {
      alert('Failed to upload file')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Failed to upload file')
  } finally {
    uploading.value = false
  }
}

const downloadAttachment = async (attachment: TaskAttachment) => {
  try {
    const blob = await taskApi.downloadAttachment(attachment.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading attachment:', error)
    alert('Failed to download file')
  }
}

const deleteAttachment = async (attachment: TaskAttachment) => {
  if (!confirm(`Are you sure you want to delete "${attachment.file_name}"?`)) return

  try {
    const response = await taskApi.deleteAttachment(attachment.id)
    if (response.success) {
      await loadAttachments()
    } else {
      alert('Failed to delete attachment')
    }
  } catch (error) {
    console.error('Error deleting attachment:', error)
    alert('Failed to delete attachment')
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

onMounted(() => {
  loadAttachments()
})
</script>

