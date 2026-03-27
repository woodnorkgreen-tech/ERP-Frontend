<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">View Attachment</h3>
        <button
          @click="$emit('close')"
          class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <div class="mb-6 flex items-center gap-4">
          <div
            :class="[
              'flex h-12 w-12 items-center justify-center rounded-xl',
              isPDF ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            ]"
          >
            <svg v-if="isPDF" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-slate-900 dark:text-white">{{ documentName }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ fileSize || 'Attachment' }}</p>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button
            @click="openInNewTab"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in New Tab
          </button>

          <button
            @click="downloadFile"
            class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Document {
  path: string
  name: string
  type?: string
}

const props = defineProps<{
  open: boolean
  documents: Document[]
}>()

defineEmits<{
  close: []
}>()

const currentDocument = computed(() => props.documents[0] || null)
const documentName = computed(() => currentDocument.value?.name || 'Document')

const documentUrl = computed(() => {
  if (!currentDocument.value) return ''

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  return `${baseUrl}/storage/${currentDocument.value.path}`
})

const isPDF = computed(() => {
  const fileName = currentDocument.value?.name || ''
  return fileName.toLowerCase().endsWith('.pdf')
})

const fileSize = computed(() => null)

const openInNewTab = () => {
  if (!currentDocument.value) return
  window.open(documentUrl.value, '_blank')
}

const downloadFile = () => {
  if (!currentDocument.value) return

  const link = document.createElement('a')
  link.href = documentUrl.value
  link.download = currentDocument.value.name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
