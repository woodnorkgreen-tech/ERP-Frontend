<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-[110] p-4 sm:p-6 font-poppins">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- High-End Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/30">
        <div class="flex items-center space-x-5">
          <div class="p-2.5 bg-emerald-500/10 rounded-xl shadow-inner border border-emerald-500/20">
            <i class="mdi mdi-microsoft-excel text-emerald-600 text-2xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Data Integrity Import</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Synchronizing external material inventories</p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-grow overflow-y-auto custom-scrollbar p-8 bg-gray-50/30 dark:bg-gray-900/40">
        
        <!-- Upload Area -->
        <div v-if="!uploadedFile && !isUploading" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            class="group relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden shadow-inner"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInput?.click()"
            :class="isDragging 
              ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5 ring-4 ring-emerald-500/10' 
              : 'border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20 hover:border-emerald-400/50 dark:hover:border-emerald-500/30'"
          >
            <!-- Animated Glow Background on dragging -->
            <div v-if="isDragging" class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 animate-pulse"></div>

            <div class="relative z-10">
              <div class="mx-auto h-20 w-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-all duration-300 shadow-sm border border-emerald-500/10">
                <i class="mdi mdi-cloud-upload text-4xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Deploy Manifest File</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Drag-and-drop your inventory matrix or <span class="text-emerald-600 dark:text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/30">browse workstation</span></p>
              
              <div class="flex items-center justify-center space-x-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                <span class="flex items-center"><i class="mdi mdi-file-excel mr-1.5 text-base"></i> XLSX / XLS</span>
                <span class="flex items-center"><i class="mdi mdi-database-outline mr-1.5 text-base"></i> MAX 5MB</span>
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              class="hidden"
              accept=".xlsx,.xls"
              @change="handleFileSelect"
            />
          </div>

          <!-- Technical Pro-Tips -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="bg-white/60 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/60 flex items-start space-x-4">
                <div class="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0"><i class="mdi mdi-lightbulb-on-outline text-xl"></i></div>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Standardized Mapping</h5>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Use standardized dropdown values for Type, Category, and Units to ensure downstream logistical accuracy.</p>
                </div>
             </div>
             <div class="bg-white/60 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/60 flex items-start space-x-4">
                <div class="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shrink-0"><i class="mdi mdi-layers-outline text-xl"></i></div>
                <div>
                  <h5 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Data Continuity</h5>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Ensure element cell headers are correctly matched with their respective materials in the following rows.</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Validation Loading State -->
        <div v-if="isUploading" class="flex flex-col items-center justify-center py-20">
          <div class="relative w-16 h-16 mb-6">
            <div class="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin ring-8 ring-emerald-500/5"></div>
          </div>
          <p class="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Auditing Spreadsheet Data...</p>
        </div>

        <!-- Preview Results Display -->
        <div v-if="previewData && !isUploading" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Stats Dashboard -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div class="bg-white dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70">Structural Units</div>
              <div class="flex items-end justify-between">
                <span class="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none">{{ stats.total_elements }}</span>
                <i class="mdi mdi-cube-outline text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70">Total Materials</div>
              <div class="flex items-end justify-between">
                <span class="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{{ stats.total_materials }}</span>
                <i class="mdi mdi-package-variant text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm" :class="{'ring-2 ring-amber-500/20': stats.total_warnings > 0}">
              <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70">Validation Warnings</div>
              <div class="flex items-end justify-between">
                <span class="text-3xl font-black text-amber-500 leading-none">{{ stats.total_warnings }}</span>
                <i class="mdi mdi-alert-circle-outline text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm" :class="{'ring-2 ring-red-500/20': stats.total_errors > 0}">
              <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70">Critical Errors</div>
              <div class="flex items-end justify-between">
                <span class="text-3xl font-black text-red-500 leading-none">{{ stats.total_errors }}</span>
                <i class="mdi mdi-close-octagon-outline text-2xl text-gray-200 dark:text-gray-700"></i>
              </div>
            </div>
          </div>

          <!-- Detailed Validation Feedback (Errors) -->
          <div v-if="errors.length > 0" class="mb-6 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-3xl overflow-hidden animate-in slide-in-from-top-4">
            <div class="px-6 py-4 bg-red-500/10 border-b border-red-500/10 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                 <i class="mdi mdi-alert-decagram text-red-500 text-xl"></i>
                 <h4 class="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest">Action Required: Blocking Faults detected</h4>
              </div>
              <span class="text-[10px] font-black bg-red-500 text-white px-3 py-0.5 rounded-full">{{ errors.length }} ERRORS</span>
            </div>
            <div class="p-6 max-h-48 overflow-y-auto custom-scrollbar">
               <ul class="space-y-3">
                  <li v-for="(error, index) in errors" :key="index" class="flex items-start text-xs text-red-700/80 dark:text-red-400/80 font-medium">
                     <span class="w-20 shrink-0 font-black text-red-500 uppercase tracking-tighter">[ROW {{ error.row }}]</span>
                     <span class="flex-grow">{{ error.message }}</span>
                  </li>
               </ul>
            </div>
          </div>

          <!-- Preview Table Refined -->
          <div class="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
               <h4 class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center">
                  <i class="mdi mdi-database-search-outline mr-2 text-sm"></i> Manifest Extraction Preview
               </h4>
               <button @click="resetUpload" class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform">
                  RE-UPLOAD MANIFEST
               </button>
            </div>
            <div class="max-h-[40vh] overflow-y-auto custom-scrollbar">
              <div v-for="(element, index) in elements" :key="index" class="group transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-b-0">
                <div class="bg-blue-500/[0.03] dark:bg-blue-500/5 px-6 py-4 flex items-center justify-between">
                  <div class="min-w-0">
                    <div class="flex items-center space-x-3 mb-1.5">
                      <span class="text-[10px] font-black font-mono text-gray-300 dark:text-gray-600">EID-{{ element.id }}</span>
                      <h5 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ element.name }}</h5>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                        {{ element.type }}
                      </span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter" :class="getCategoryClass(element.category)">
                        {{ element.category }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{{ element.particulars.length }} ITEMS</div>
                    <div class="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter italic">Validated</div>
                  </div>
                </div>
                <div class="px-10 py-4 bg-white/50 dark:bg-gray-900/20">
                  <table class="w-full text-xs">
                    <thead>
                       <tr class="text-[8px] font-black text-gray-400 uppercase tracking-widest text-left">
                          <th class="pb-2">Material Specification</th>
                          <th class="pb-2 text-right">Qty / Dim</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 dark:divide-gray-800/50">
                      <tr v-for="(material, mIndex) in element.particulars" :key="mIndex" class="group/row">
                        <td class="py-2.5 font-medium text-gray-700 dark:text-gray-300 pr-4">
                           <i class="mdi mdi-arrow-right-bottom text-gray-200 mr-2 text-xs"></i>
                           {{ material.description || 'Global Part Specification' }}
                        </td>
                        <td class="py-2.5 text-right font-black text-blue-600 dark:text-blue-400 tabular-nums">
                           {{ material.quantity }} <span class="text-[8px] uppercase tracking-widest ml-1 text-gray-400">{{ material.unit }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Message / Fault Indicator -->
        <transition name="fade">
          <div v-if="errorMessage" class="mt-8 bg-red-500 dark:bg-red-900/20 border border-red-500/20 p-6 rounded-3xl flex items-center space-x-4">
             <div class="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                <i class="mdi mdi-api text-2xl"></i>
             </div>
             <p class="text-sm font-bold text-red-900 dark:text-red-400 leading-tight">System Exception: <span class="opacity-70 font-medium">{{ errorMessage }}</span></p>
          </div>
        </transition>
      </div>

      <!-- Footer Buttons -->
      <div class="px-8 py-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row-reverse gap-4 items-center">
        <button
          v-if="previewData && hasNoErrors"
          type="button"
          @click="confirmImport"
          :disabled="isImporting"
          class="w-full sm:w-auto px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:scale-100 border border-emerald-400/30"
        >
          <div v-if="isImporting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <i v-else class="mdi mdi-check-all text-lg"></i>
          <span>{{ isImporting ? 'EXECUTING PERSISTENCE...' : 'COMMIT TO PROJECT' }}</span>
        </button>
        
        <button
          @click="closeModal"
          :disabled="isImporting"
          class="w-full sm:w-auto px-8 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-full transition-all disabled:opacity-50"
        >
          {{ previewData ? 'Abort Operation' : 'Terminate' }}
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
const stats = computed(() => previewData.value?.stats || { total_elements: 0, total_materials: 0, total_warnings: 0, total_errors: 0 })
const elements = computed(() => previewData.value?.elements || [])
const errors = computed(() => previewData.value?.errors || [])
const warnings = computed(() => previewData.value?.warnings || [])
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
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    errorMessage.value = 'Please upload a valid Excel file (.xlsx or .xls)'
    return
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 5MB'
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
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
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
}

const confirmImport = async () => {
  if (!previewData.value || !hasNoErrors.value) {
    return
  }
  
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
    
    console.log('[DEBUG] Transformed projectElements:', projectElements)
    console.log('[DEBUG] Sending to API:', `/api/projects/tasks/${props.taskId}/materials`)
    
    // Build request payload with required projectInfo
    const payload = {
      projectInfo: {
        // Use basic project info - approval status will be initialized by backend
        projectId: props.taskId.toString(),
        enquiryTitle: 'Material Import',
        clientName: '',
        eventVenue: '',
        setupDate: '',
        setDownDate: ''
      },
      projectElements
    }
    
    console.log('[DEBUG] Full payload:', payload)
    
    // Call saveMaterials API
    const response = await api.post(
      `/api/projects/tasks/${props.taskId}/materials`,
      payload
    )
    
    // Success!
    emit('success', response.data)
    closeModal()
  } catch (error: any) {
    console.error('Import failed:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Validation errors:', error.response?.data?.errors)
    
    // Show detailed validation errors if available
    if (error.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat().join(', ')
      errorMessage.value = `Validation failed: ${validationErrors}`
    } else {
      errorMessage.value = error.response?.data?.message || 'Failed to import materials. Please try again.'
    }
  } finally {
    isImporting.value = false
  }
}

const closeModal = () => {
  if (!isUploading.value && !isImporting.value) {
    resetUpload()
    emit('close')
  }
}

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    'production': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
    'hire': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'outsourced': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
  }
  return classes[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
}
</script>

<style scoped>
/* Custom scrollbar for preview */
.max-h-96::-webkit-scrollbar,
.max-h-40::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track,
.max-h-40::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-96::-webkit-scrollbar-thumb,
.max-h-40::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover,
.max-h-40::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
