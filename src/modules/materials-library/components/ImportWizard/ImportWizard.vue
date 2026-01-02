<template>
  <div class="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div class="flex items-center space-x-4">
          <div class="p-2.5 bg-blue-500/10 rounded-xl shadow-inner border border-blue-500/20">
            <i class="mdi mdi-cloud-upload text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Batch Material Import</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Automated synchronization via Excel upload</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 overflow-y-auto custom-scrollbar flex-grow">
        <div class="space-y-8">
          
          <!-- Instructions -->
          <div class="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex items-start space-x-4">
            <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-sm">!</div>
            <p class="text-xs text-blue-700/80 dark:text-blue-300 leading-relaxed font-medium">
              To ensure data integrity, upload a valid <span class="font-bold">.xlsx</span> file. Columns must align with the workstation-specific schema. We recommend downloading the template first.
            </p>
          </div>

          <!-- Workstation Selection -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Target Workstation</label>
              <button
                v-if="selectedWorkstationId"
                @click="handleDownloadTemplate"
                class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                :disabled="isExporting"
              >
                <i v-if="isExporting" class="mdi mdi-loading mdi-spin mr-1"></i>
                <i v-else class="mdi mdi-download mr-1"></i>
                Download Reference Template
              </button>
            </div>
            <div class="relative">
              <select 
                v-model="selectedWorkstationId"
                class="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white text-sm appearance-none shadow-sm"
              >
                <option :value="null" disabled>Select a workstation for schema alignment...</option>
                <option v-for="ws in workstations" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </div>

          <!-- File Upload Dropzone -->
          <div 
            class="relative group"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <div 
              class="border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center space-y-4"
              :class="isDragging 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 ring-4 ring-blue-500/10' 
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/20 hover:border-blue-300 dark:hover:border-blue-800'"
            >
              <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <i class="mdi mdi-file-excel text-emerald-500 text-4xl"></i>
              </div>
              
              <div class="text-center">
                <label for="file-upload" class="relative cursor-pointer">
                  <span class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Select Data Source</span>
                  <input id="file-upload" type="file" class="sr-only" accept=".xlsx, .xls" @change="handleFileSelect">
                </label>
                <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-medium">Drag & drop your Excel file here or browse</p>
              </div>

              <div v-if="selectedFile" class="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <i class="mdi mdi-check-circle text-emerald-600"></i>
                <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">{{ selectedFile.name }}</span>
                <span class="text-[10px] text-emerald-600/60">({{ Math.round(selectedFile.size / 1024) }} KB)</span>
              </div>
            </div>
          </div>

          <!-- Dynamic Feedback States -->
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400 animate-in shake duration-300">
            <i class="mdi mdi-alert-circle text-xl"></i>
            <span class="text-sm font-medium">{{ error }}</span>
          </div>

          <div v-if="importResult" class="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-2 duration-500">
            <div class="flex items-center space-x-2 mb-6 text-emerald-600 dark:text-emerald-400">
              <i class="mdi mdi-check-all text-xl"></i>
              <h4 class="text-sm font-bold uppercase tracking-tight">Import Summary</h4>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Total</div>
                <div class="text-xl font-bold dark:text-white">{{ importResult.total }}</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div class="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter mb-1">New</div>
                <div class="text-xl font-bold text-emerald-600">{{ importResult.created }}</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div class="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mb-1">Updated</div>
                <div class="text-xl font-bold text-blue-600">{{ importResult.updated }}</div>
              </div>
            </div>

            <div v-if="importResult.errors.length > 0" class="mt-6">
              <h5 class="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3">Critical Exceptions ({{ importResult.errors.length }})</h5>
              <div class="max-h-40 overflow-y-auto space-y-1.5 custom-scrollbar pr-2">
                <div v-for="(err, idx) in importResult.errors" :key="idx" class="text-[11px] text-red-600 dark:text-red-400 font-medium bg-red-50 to-transparent dark:bg-red-900/5 p-2 rounded-lg border-l-2 border-red-500">
                  {{ err }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3 items-center">
        <button 
          v-if="!importResult"
          type="button" 
          @click="$emit('close', false)"
          class="px-6 py-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-bold transition-colors"
        >
          Cancel
        </button>
        
        <button 
          v-if="!importResult"
          type="button" 
          @click="startImport"
          :disabled="!isValid || isImporting"
          class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:scale-100"
        >
          <span v-if="isImporting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
          <span>Execute Import</span>
        </button>

        <button 
          v-else
          @click="$emit('close', true)"
          class="px-10 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20 animate-in fade-in duration-300 transition-all active:scale-95"
        >
          Finalize & Exit
        </button>
      </div>
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.shake {
  animation: shake 0.3s ease-in-out;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWorkstations } from '../../composables/useWorkstations';
import { useMaterialImport } from '../../composables/useMaterialImport';
import { useMaterialExport } from '../../composables/useMaterialExport';

const props = defineProps<{
  initialWorkstationId: number | null;
}>();

const emit = defineEmits<{
  (e: 'close', success?: boolean): void;
  (e: 'imported'): void;
}>();

const { workstations, fetchWorkstations } = useWorkstations();
const { importMaterials, isImporting, error, importResult } = useMaterialImport();
const { downloadTemplate, isExporting } = useMaterialExport();

// Fetch workstations if empty
onMounted(() => {
    if (workstations.value.length === 0) {
        fetchWorkstations();
    }
});

const selectedWorkstationId = ref<number | null>(props.initialWorkstationId);
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);

const isValid = computed(() => {
  return selectedWorkstationId.value && selectedFile.value;
});

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          selectedFile.value = file;
      }
  }
};

const startImport = async () => {
    if (!selectedFile.value || !selectedWorkstationId.value) return;
    
    try {
        await importMaterials(selectedFile.value, selectedWorkstationId.value);
        emit('imported');
    } catch (e) {
        // Error handled in composable state
    }
};

const handleDownloadTemplate = async () => {
    if (!selectedWorkstationId.value) return;
    const workstation = workstations.value.find(ws => ws.id === selectedWorkstationId.value);
    if (workstation) {
        await downloadTemplate(workstation.id, workstation.name);
    }
};
</script>
