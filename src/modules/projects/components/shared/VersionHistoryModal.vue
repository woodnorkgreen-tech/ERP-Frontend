<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }} Version History
        </h3>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="versions.length === 0"
          class="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <svg
            class="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-lg font-medium">No versions created yet</p>
          <p class="text-sm mt-1">Create your first version to track changes over time</p>
        </div>

        <!-- Versions List -->
        <div v-else class="space-y-3">
          <div
            v-for="version in versions"
            :key="version.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    v{{ version.version_number }}
                  </span>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ version.label }}
                  </h4>
                </div>

                <div class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{{ version.created_by_name }}</span>
                  </div>

                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{{ formatDate(version.created_at) }}</span>
                  </div>

                  <!-- Material Version Reference (for budget versions only) -->
                  <div
                    v-if="version.materials_version_number"
                    class="flex items-center space-x-2 text-purple-600 dark:text-purple-400"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span>Linked to Material v{{ version.materials_version_number }}</span>
                  </div>
                </div>
              </div>

              <div class="ml-4 flex space-x-2">
                <button
                  @click="previewVersion(version)"
                  class="px-3 py-1 text-xs bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>View</span>
                </button>
                <button
                  @click="confirmRestore(version)"
                  class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="close"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Restore Confirmation Dialog -->
    <div
      v-if="restoreConfirmation.show"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]"
      @click.self="closeRestoreConfirmation"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Confirm Version Restore
        </h4>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to restore to
          <span class="font-semibold">v{{ restoreConfirmation.version?.version_number }} - {{
            restoreConfirmation.version?.label
          }}</span>?
        </p>

        <div
          class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4"
        >
          <div class="flex items-start space-x-2">
            <svg
              class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div class="text-xs text-yellow-800 dark:text-yellow-200">
              <p class="font-semibold mb-1">This will:</p>
              <ul class="list-disc list-inside space-y-1">
                <li>Replace current {{ type }} data with this version</li>
                <li v-if="type === 'materials'">Reset all approvals to draft</li>
                <li v-if="type === 'budget'">Reset budget status to draft</li>
                <li>This action cannot be undone (but you can create a new version first)</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="closeRestoreConfirmation"
            :disabled="isRestoring"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleRestore"
            :disabled="isRestoring"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg
              v-if="isRestoring"
              class="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ isRestoring ? 'Restoring...' : 'Restore Version' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Version } from '@/composables/useVersioning';

interface Props {
  isOpen: boolean;
  versions: Version[];
  isLoading: boolean;
  error: string | null;
  title: string;
  type: 'materials' | 'budget' | 'quote';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  restore: [versionId: number];
  preview: [version: Version];
  refresh: [];
}>();

const restoreConfirmation = ref<{
  show: boolean;
  version: Version | null;
}>({
  show: false,
  version: null,
});

const isRestoring = ref(false);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const close = () => {
  emit('close');
};

const confirmRestore = (version: Version) => {
  restoreConfirmation.value = {
    show: true,
    version,
  };
};

const closeRestoreConfirmation = () => {
  if (!isRestoring.value) {
    restoreConfirmation.value = {
      show: false,
      version: null,
    };
  }
};

const previewVersion = (version: Version) => {
  emit('preview', version);
  close(); // Close the modal after emitting preview
};

const handleRestore = async () => {
  if (!restoreConfirmation.value.version) return;

  isRestoring.value = true;
  try {
    emit('restore', restoreConfirmation.value.version.id);
    // Wait a bit for the parent to handle the restore
    await new Promise((resolve) => setTimeout(resolve, 500));
    closeRestoreConfirmation();
  } catch (error) {
    console.error('Error in restore handler:', error);
  } finally {
    isRestoring.value = false;
  }
};

// Refresh when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      emit('refresh');
    }
  }
);
</script>
