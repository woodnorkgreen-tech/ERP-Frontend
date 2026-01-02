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
      class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins"
    >
      <!-- Glass Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click.self="closeDialog"></div>

      <!-- Modal Container -->
      <div class="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-lg relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <!-- Premium Header -->
        <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/40 relative">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-emerald-500/10 rounded-2xl shadow-inner border border-emerald-500/20">
              <i class="mdi mdi-history text-emerald-600 text-2xl"></i>
            </div>
            <div>
              <h4 class="text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                Archive Snapshot
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold uppercase tracking-widest opacity-70">
                Preserving {{ title }} context
              </p>
            </div>
          </div>
        </div>

        <div class="px-8 py-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">
                Security Label (Identification)
              </label>
              <div class="relative group">
                <input
                  v-model="versionLabel"
                  type="text"
                  placeholder="e.g., Client Approved Final"
                  class="w-full pl-5 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-[1.25rem] text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  @keyup.enter="handleCreate"
                  ref="labelInput"
                />
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                  <i class="mdi mdi-tag-outline text-xl"></i>
                </div>
              </div>
              <p class="mt-3 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider ml-1 italic opacity-80">
                Auto-timestamp active if left null
              </p>
            </div>

            <!-- Strategic Context Panel -->
            <div class="p-5 bg-blue-500/5 rounded-[1.5rem] border border-blue-500/10">
              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <i class="mdi mdi-shield-check text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h5 class="text-xs font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest mb-1.5">System Integrity</h5>
                  <p class="text-[11px] text-blue-800/70 dark:text-blue-200/60 leading-relaxed font-medium">
                    This cryptographic snapshot will encapsulate the current state of all <span class="text-blue-600 font-bold">{{ type }}</span> parameters for forensic restoration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alert Subsystem -->
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
            <div v-if="successMessage || errorMessage" class="space-y-3">
              <div v-if="successMessage" class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3">
                <i class="mdi mdi-check-circle text-emerald-500 text-lg"></i>
                <p class="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">{{ successMessage }}</p>
              </div>
              <div v-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3">
                <i class="mdi mdi-alert-circle text-red-500 text-lg"></i>
                <p class="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-tight">{{ errorMessage }}</p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Strategic Footer -->
        <div class="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center gap-4">
          <button
            @click="closeDialog"
            :disabled="isCreating"
            class="px-6 py-3 text-[10px] font-black text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 uppercase tracking-[0.2em] transition-all disabled:opacity-50"
          >
            Abort Operation
          </button>
          <button
            @click="handleCreate"
            :disabled="isCreating"
            class="group relative flex items-center space-x-3 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <i v-if="!isCreating" class="mdi mdi-database-export-outline text-lg"></i>
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ isCreating ? 'Initializing...' : 'Commit Version' }}</span>
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
