<template>
  <div
    v-if="true"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    @click.self="$emit('close')"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full overflow-hidden relative">
      <!-- Header -->
       <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <i class="mdi mdi-cloud-upload text-blue-600 text-lg"></i>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Import Materials
              </h3>
              
              <div class="mt-4">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload an Excel file (.xlsx) to import materials. Ensure your file columns match the workstation pattern.
                </p>

                <!-- Workstation Selection -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Workstation</label>
                  <div class="flex gap-2">
                    <select 
                      v-model="selectedWorkstationId"
                      class="flex-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option :value="null" disabled>Select a workstation</option>
                      <option v-for="ws in workstations" :key="ws.id" :value="ws.id">
                        {{ ws.name }}
                      </option>
                    </select>
                    <button
                       v-if="selectedWorkstationId"
                       @click="handleDownloadTemplate"
                       type="button"
                       class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                       :disabled="isExporting"
                       title="Download CSV Template"
                    >
                      <i v-if="isExporting" class="mdi mdi-loading mdi-spin"></i>
                      <i v-else class="mdi mdi-download"></i>
                      <span class="ml-2 hidden sm:inline">Template</span>
                    </button>
                  </div>
                </div>

                <!-- File Upload -->
                <div 
                   class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                   :class="{'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging}"
                   @dragover.prevent="isDragging = true"
                   @dragleave.prevent="isDragging = false"
                   @drop.prevent="handleDrop"
                >
                  <div class="space-y-1 text-center">
                    <i class="mdi mdi-file-excel text-gray-400 text-4xl"></i>
                    <div class="flex text-sm text-gray-600 dark:text-gray-400">
                      <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only" accept=".xlsx, .xls" @change="handleFileSelect">
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      XLSX up to 5MB
                    </p>
                    <p v-if="selectedFile" class="text-sm font-bold text-green-600 mt-2">
                       Selected: {{ selectedFile.name }}
                    </p>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                   {{ error }}
                </div>

                <!-- Results -->
                <div v-if="importResult" class="mt-4 bg-green-50 p-4 rounded-md">
                   <h4 class="text-sm font-bold text-green-800">Import Complete!</h4>
                   <ul class="text-xs text-green-700 list-disc list-inside mt-2">
                      <li>Total Rows: {{ importResult.total }}</li>
                      <li>Created: {{ importResult.created }}</li>
                      <li>Updated: {{ importResult.updated }}</li>
                      <li v-if="importResult.errors.length > 0" class="text-red-600 font-bold">
                         Errors: {{ importResult.errors.length }}
                      </li>
                   </ul>
                   <div v-if="importResult.errors.length > 0" class="mt-2 max-h-32 overflow-y-auto">
                      <p v-for="(err, idx) in importResult.errors" :key="idx" class="text-xs text-red-600">
                         {{ err }}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
       </div>
       <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
             v-if="!importResult"
             type="button" 
             class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
             :disabled="!isValid || isImporting"
             @click="startImport"
          >
            <span v-if="isImporting">Importing...</span>
            <span v-else>Import</span>
          </button>
          
          <button 
             type="button" 
             class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
             @click="$emit('close', importResult ? true : false)"
          >
            {{ importResult ? 'Close' : 'Cancel' }}
          </button>
       </div>
    </div>
  </div>
</template>

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
