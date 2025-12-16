<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Design Information</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Design details and approval status</p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Design Overview -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Design Overview
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.design_type">
            <span class="text-gray-500 dark:text-gray-400">Design Type:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.design_type }}</span>
          </div>
          <div v-if="context.design_software">
            <span class="text-gray-500 dark:text-gray-400">Software:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.design_software }}</span>
          </div>
          <div v-if="context.current_revision">
            <span class="text-gray-500 dark:text-gray-400">Revision:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">v{{ context.current_revision }}</span>
          </div>
          <div v-if="context.feedback_rounds">
            <span class="text-gray-500 dark:text-gray-400">Feedback Rounds:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.feedback_rounds }}</span>
          </div>
        </div>
      </div>

      <!-- Approval Status -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Approval Status
        </h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
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
          <div v-if="context.approval_notes" class="mt-3">
            <span class="text-sm text-gray-500 dark:text-gray-400 block mb-1">Approval Notes:</span>
            <p class="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border">
              {{ context.approval_notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- Design Specifications -->
      <div v-if="context.width_px || context.height_px || context.file_format" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Specifications
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.width_px && context.height_px">
            <span class="text-gray-500 dark:text-gray-400">Dimensions:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.width_px }} × {{ context.height_px }} px</span>
            <span v-if="context.getAspectRatio" class="ml-2 text-xs text-gray-500">({{ context.getAspectRatio }})</span>
          </div>
          <div v-if="context.file_format">
            <span class="text-gray-500 dark:text-gray-400">Format:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.file_format }}</span>
          </div>
          <div v-if="context.target_platform">
            <span class="text-gray-500 dark:text-gray-400">Platform:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.target_platform }}</span>
          </div>
          <div v-if="context.final_delivery_date">
            <span class="text-gray-500 dark:text-gray-400">Delivery Date:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ formatDate(context.final_delivery_date) }}</span>
          </div>
        </div>
      </div>

      <!-- Color Palette & Fonts -->
      <div v-if="context.color_palette?.length || context.fonts?.length" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Design Elements
        </h4>
        <div class="space-y-3">
          <div v-if="context.color_palette?.length">
            <span class="text-sm text-gray-500 dark:text-gray-400 block mb-2">Color Palette:</span>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="color in context.color_palette"
                :key="color"
                class="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded border"
              >
                <div
                  class="w-4 h-4 rounded border"
                  :style="{ backgroundColor: color }"
                ></div>
                <span class="text-xs text-gray-600 dark:text-gray-400">{{ color }}</span>
              </div>
            </div>
          </div>
          <div v-if="context.fonts?.length">
            <span class="text-sm text-gray-500 dark:text-gray-400 block mb-2">Fonts:</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="font in context.fonts"
                :key="font"
                class="px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border"
              >
                {{ font }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Design Brief -->
      <div v-if="context.design_brief" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Design Brief
        </h4>
        <p class="text-sm text-gray-700 dark:text-gray-300">{{ context.design_brief }}</p>
      </div>

      <!-- Client Feedback -->
      <div v-if="context.client_feedback" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Client Feedback
        </h4>
        <p class="text-sm text-blue-700 dark:text-blue-300">{{ context.client_feedback }}</p>
      </div>

      <!-- Approval Requirements -->
      <div v-if="context.requires_client_approval" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Client Approval Required</span>
        </div>
        <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          This design requires client approval before finalization
        </p>
      </div>

      <!-- Reference Links -->
      <div v-if="context.reference_links?.length" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Reference Links
        </h4>
        <div class="space-y-2">
          <a
            v-for="link in context.reference_links"
            :key="link"
            :href="link"
            target="_blank"
            class="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ link }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  context: any
}

defineProps<Props>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}

const getApprovalStatusLabel = (status?: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    needs_revision: 'Needs Revision'
  }
  return statusMap[status || ''] || status || 'Unknown'
}

const getApprovalStatusBadgeClass = (status?: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    needs_revision: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  }
  return classMap[status || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}
</script>