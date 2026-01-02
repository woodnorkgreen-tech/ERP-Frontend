<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click.self="close"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div class="flex items-center space-x-5">
           <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-history text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {{ title }} Snapshots
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Temporal record of engineering iterations</p>
          </div>
        </div>
        <button
          @click="close"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/30 dark:bg-gray-900/40">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="relative w-12 h-12">
            <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-4 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reconstructing History...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-4">
          <div class="p-2 bg-red-500 rounded-lg text-white shadow-lg shadow-red-500/20">
            <i class="mdi mdi-alert-circle-outline text-xl"></i>
          </div>
          <div>
             <h4 class="text-sm font-bold text-red-700 dark:text-red-400">Chronology Failure</h4>
             <p class="text-xs text-red-600/80 dark:text-red-400/70 font-medium">{{ error }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="versions.length === 0" class="flex flex-col items-center justify-center py-24 opacity-40">
          <i class="mdi mdi-file-restore-outline text-6xl text-gray-300"></i>
          <p class="mt-4 text-sm font-bold uppercase tracking-widest">No archival snapshots found</p>
          <p class="text-[10px] mt-1 font-bold">COMMIT YOUR FIRST REVISION TO START TRACKING</p>
        </div>

        <!-- Versions List -->
        <div v-else class="space-y-4">
          <div
            v-for="version in versions"
            :key="version.id"
            class="group relative bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4 mb-4">
                  <span
                    class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  >
                    REL v{{ version.version_number }}
                  </span>
                  <h4 class="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ version.label }}
                  </h4>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <i class="mdi mdi-account-star-outline mr-2 text-lg text-gray-400"></i>
                    <span>{{ version.created_by_name }}</span>
                  </div>

                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <i class="mdi mdi-clock-outline mr-2 text-lg text-gray-400"></i>
                    <span>{{ formatDate(version.created_at) }}</span>
                  </div>

                  <div
                    v-if="version.materials_version_number"
                    class="flex items-center text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest"
                  >
                    <i class="mdi mdi-link-variant mr-1 text-base"></i>
                    <span>Linked Material v{{ version.materials_version_number }}</span>
                  </div>
                </div>
              </div>

              <div class="ml-6 flex items-center space-x-2">
                <button
                  @click="previewVersion(version)"
                  class="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-xl transition-all duration-200 text-gray-500 dark:text-gray-400 shadow-sm"
                  title="Preview Version"
                >
                   <i class="mdi mdi-eye-outline text-xl"></i>
                </button>
                <button
                  @click="confirmRestore(version)"
                  class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center space-x-2"
                >
                   <i class="mdi mdi-backup-restore text-lg"></i>
                   <span>Restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <button
          @click="close"
          class="px-8 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-full transition-all"
        >
          Dismiss Browser
        </button>
      </div>

      <!-- Restore Confirmation Overlay -->
      <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="restoreConfirmation.show" class="absolute inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-md">
           <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/20 dark:border-gray-800 overflow-hidden animate-in zoom-in duration-200">
              <div class="p-8">
                 <div class="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                    <i class="mdi mdi-alert text-3xl text-amber-500"></i>
                 </div>
                 <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">System Rollback</h3>
                 <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">
                    You are about to restore <span class="text-blue-600 font-black">v{{ restoreConfirmation.version?.version_number }}</span>. 
                    Current unsaved iterations will be overwritten by this archived state.
                 </p>

                 <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3 mb-8">
                    <div class="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"><i class="mdi mdi-check-circle-outline mr-2 text-emerald-500"></i> Status: Non-Destructive to history</div>
                    <div class="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"><i class="mdi mdi-alert-circle-outline mr-2 text-amber-500"></i> Status: Overwrites active data</div>
                 </div>

                 <div class="flex gap-3">
                    <button
                      @click="closeRestoreConfirmation"
                      :disabled="isRestoring"
                      class="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Abort
                    </button>
                    <button
                      @click="handleRestore"
                      :disabled="isRestoring"
                      class="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
                    >
                       <div v-if="isRestoring" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>{{ isRestoring ? 'RESTORE IN PROGRESS' : 'CONFIRM ROLLBACK' }}</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}

.zoom-in {
  animation: zoom-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes zoom-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>

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
