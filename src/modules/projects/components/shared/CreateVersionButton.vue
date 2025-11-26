<template>
  <div>
    <!-- Create Version Button -->
    <button
      @click="openDialog"
      :disabled="disabled"
      class="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center space-x-1"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span>Create Version</span>
    </button>

    <!-- Create Version Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeDialog"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Create New {{ title }} Version
        </h4>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version Label (Optional)
          </label>
          <input
            v-model="versionLabel"
            type="text"
            placeholder="e.g., Client Approved, Final Design, Budget Update..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @keyup.enter="handleCreate"
            ref="labelInput"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave blank for auto-generated timestamp label
          </p>
        </div>

        <div
          class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4"
        >
          <div class="flex items-start space-x-2">
            <svg
              class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="text-xs text-blue-800 dark:text-blue-200">
              <p class="font-semibold mb-1">Version Snapshot</p>
              <p>This will capture the current state of all {{ type }} data for future restoration.</p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="closeDialog"
            :disabled="isCreating"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleCreate"
            :disabled="isCreating"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg
              v-if="isCreating"
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
            <span>{{ isCreating ? 'Creating...' : 'Create Version' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface Props {
  title: string;
  type: 'materials' | 'budget' | 'quote';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  create: [label: string | undefined];
}>();

const showDialog = ref(false);
const versionLabel = ref('');
const isCreating = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const labelInput = ref<HTMLInputElement | null>(null);

const openDialog = () => {
  showDialog.value = true;
  versionLabel.value = '';
  successMessage.value = '';
  errorMessage.value = '';

  // Focus the input after a short delay
  nextTick(() => {
    labelInput.value?.focus();
  });
};

const closeDialog = () => {
  if (!isCreating.value) {
    showDialog.value = false;
    versionLabel.value = '';
    successMessage.value = '';
    errorMessage.value = '';
  }
};

const handleCreate = async () => {
  isCreating.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    emit('create', versionLabel.value.trim() || undefined);

    // Show success message
    successMessage.value = 'Version created successfully!';

    // Close dialog after a short delay
    setTimeout(() => {
      closeDialog();
    }, 1500);
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to create version';
  } finally {
    isCreating.value = false;
  }
};
</script>
