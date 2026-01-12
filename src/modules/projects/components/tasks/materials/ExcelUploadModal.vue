<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-20 overflow-hidden transform transition-all">
      
      <!-- Clean Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
        <div class="flex items-center space-x-4">
          <div class="p-2 bg-emerald-100 rounded-lg text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <i class="mdi mdi-microsoft-excel text-2xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Import Materials</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Upload your completed Excel template</p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <i class="mdi mdi-close text-xl"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-grow overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900/50">
        
        <!-- STEP 1: Upload Area -->
        <div v-if="!uploadedFile && !isUploading" class="animate-fade-in-up">
          <div
            class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer bg-white dark:bg-gray-800"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInput?.click()"
            :class="{ 'border-emerald-500 bg-emerald-50': isDragging }"
          >
            <div class="mb-4">
              <i class="mdi mdi-cloud-upload text-5xl text-emerald-500 opacity-80"></i>
            </div>
            <h4 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">Click to Upload or Drag File Here</h4>
            <p class="text-sm text-gray-500 mb-6">Supports .xlsx and .xls files</p>
            <button class="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm">
              Browse Files
            </button>
          </div>
          <input ref="fileInput" type="file" class="hidden" accept=".xlsx,.xls" @change="handleFileSelect" />
          
          <div class="mt-6 flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
            <i class="mdi mdi-information-outline text-xl shrink-0 mt-0.5"></i>
            <div>
              <p class="font-bold mb-1">Tip for Success</p>
              <p>Make sure you are using the latest template downloaded from this task. Do not change column headers.</p>
            </div>
          </div>
        </div>

        <!-- STEP 2: Loading Validation -->
        <div v-if="isUploading" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
            <h4 class="text-lg font-bold text-gray-800 dark:text-white">Validating File...</h4>
            <p class="text-gray-500">Checking data structure and integrity</p>
        </div>

        <!-- STEP 3: Preview & Confirmation -->
        <div v-if="previewData && !isUploading" class="space-y-6 animate-fade-in-up">
          
          <!-- Summary Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div class="text-xs font-bold text-gray-400 uppercase">Elements</div>
                <div class="text-2xl font-black text-gray-800 dark:text-white">{{ stats.total_elements }}</div>
             </div>
             <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div class="text-xs font-bold text-gray-400 uppercase">Materials</div>
                <div class="text-2xl font-black text-gray-800 dark:text-white">{{ stats.total_materials }}</div>
             </div>
             <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm" :class="{'border-red-200 bg-red-50': stats.total_errors > 0}">
                <div class="text-xs font-bold text-gray-400 uppercase" :class="{'text-red-500': stats.total_errors > 0}">Errors</div>
                <div class="text-2xl font-black" :class="stats.total_errors > 0 ? 'text-red-600' : 'text-gray-800 dark:text-white'">{{ stats.total_errors }}</div>
             </div>
             <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div class="text-xs font-bold text-gray-400 uppercase">Status</div>
                <div class="text-lg font-black uppercase mt-1" :class="hasNoErrors ? 'text-emerald-600' : 'text-red-600'">
                   {{ hasNoErrors ? 'Ready' : 'Issues Found' }}
                </div>
             </div>
          </div>

          <!-- Error List -->
          <div v-if="errors.length > 0" class="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
            <div class="bg-red-100 px-4 py-3 border-b border-red-200 flex justify-between items-center">
               <h4 class="text-red-800 font-bold text-sm flex items-center">
                  <i class="mdi mdi-alert-circle mr-2"></i> Fix the following errors to proceed:
               </h4>
               <span class="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded-md">{{ errors.length }}</span>
            </div>
            <ul class="max-h-40 overflow-y-auto p-4 space-y-2">
               <li v-for="(error, i) in errors" :key="i" class="text-sm text-red-700 flex items-start">
                  <span class="font-mono bg-red-100 px-1.5 rounded mr-2 text-xs font-bold">ROW {{ error.row }}</span>
                  {{ error.message }}
               </li>
            </ul>
          </div>

          <!-- Simple Data Preview -->
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
             <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h4 class="font-bold text-sm text-gray-700 dark:text-gray-300">Data Preview</h4>
                <button @click="resetUpload" class="text-xs text-blue-600 font-bold hover:underline">Reset Upload</button>
             </div>
             <div class="max-h-60 overflow-y-auto">
                <table class="w-full text-sm text-left">
                   <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                         <th class="px-4 py-2">ID</th>
                         <th class="px-4 py-2">Element</th>
                         <th class="px-4 py-2 text-right">Items</th>
                         <th class="px-4 py-2">Type</th>
                      </tr>
                   </thead>
                   <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                      <tr v-for="element in elements" :key="element.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                         <td class="px-4 py-2 font-mono text-xs text-gray-500">{{ element.id }}</td>
                         <td class="px-4 py-2 font-medium">{{ element.name }}</td>
                         <td class="px-4 py-2 text-right font-bold text-gray-600">{{ element.particulars.length }}</td>
                         <td class="px-4 py-2">
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                               {{ element.type }}
                            </span>
                         </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

        </div>

        <!-- System Error -->
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 flex items-center">
           <i class="mdi mdi-alert-octagon text-2xl mr-3"></i>
           <div>
              <p class="font-bold text-sm">System Error</p>
              <p class="text-sm">{{ errorMessage }}</p>
           </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="bg-gray-50 dark:bg-gray-800/50 p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
         <button 
            @click="closeModal" 
            class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            :disabled="isImporting"
         >
            Cancel
         </button>
         
         <button 
            v-if="previewData && hasNoErrors"
            @click="confirmImport"
            class="px-8 py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center"
            :disabled="isImporting"
         >
            <i v-if="isImporting" class="mdi mdi-loading mdi-spin mr-2"></i>
            {{ isImporting ? 'Importing...' : 'Import Data' }}
         </button>
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
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const isImporting = ref(false)
const previewData = ref<any>(null)
const errorMessage = ref('')

// Computed
const stats = computed(() => previewData.value?.stats || { total_elements: 0, total_materials: 0, total_errors: 0 })
const elements = computed(() => previewData.value?.elements || [])
const errors = computed(() => previewData.value?.errors || [])
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
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    errorMessage.value = 'Please upload a valid Excel file (.xlsx or .xls)'
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
      { headers: { 'Content-Type': 'multipart/form-data' } }
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
  if (fileInput.value) fileInput.value.value = ''
}

const confirmImport = async () => {
  if (!previewData.value || !hasNoErrors.value) return
  
  isImporting.value = true
  errorMessage.value = ''
  
  try {
    // Transform preview data to match saveMaterials API format
    const projectElements = elements.value.map((element: any) => ({
      id: element.id,
      elementType: element.type,
      name: element.name,
      category: element.category,
      dimensions: element.dimensions || { width: 0, length: 0, height: 0 },
      isIncluded: true,
      materials: element.particulars.map((particular: any) => ({
        description: particular.description,
        unitOfMeasurement: particular.unit,
        quantity: particular.quantity,
        isIncluded: particular.included,
        notes: particular.notes || ''
      })),
      notes: element.notes || ''
    }))
    
    // Call saveMaterials API
    const response = await api.post(
      `/api/projects/tasks/${props.taskId}/materials`,
      {
         projectInfo: {
            projectId: props.taskId.toString(),
            enquiryTitle: 'Material Import',
            // Default placeholder values as they come from separate project info store
            clientName: '', eventVenue: '', setupDate: '', setDownDate: ''
         },
         projectElements
      }
    )
    
    emit('success', response.data)
    closeModal()
  } catch (error: any) {
    console.error('Import failed:', error)
    
    // Detailed validation error handling
    if (error.response?.data?.errors) {
       const msgs = Object.values(error.response.data.errors).flat().join(', ')
       errorMessage.value = `Import Validation Failed: ${msgs}`
    } else {
       errorMessage.value = error.response?.data?.message || 'Failed to import materials.'
    }
  } finally {
    isImporting.value = false
  }
}

const closeModal = () => {
  if (!isImporting.value) {
    resetUpload()
    emit('close')
  }
}
</script>

<style scoped>
.animate-fade-in-up {
   animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
   from { opacity: 0; transform: translateY(10px); }
   to { opacity: 1; transform: translateY(0); }
}
</style>
