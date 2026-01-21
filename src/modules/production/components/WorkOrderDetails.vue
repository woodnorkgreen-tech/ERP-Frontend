<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-100 p-4 sm:p-6">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[1400px] max-h-[95vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      <div class="work-order-details flex-1 overflow-hidden">
      <!-- Modern Header -->
      <div class="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white/20 rounded-lg backdrop-blur">
                <i class="mdi mdi-file-document-outline text-2xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold">Work Order</h1>
                <p class="text-blue-100 text-sm">{{ selectedWorkOrder?.work_order_number || 'Loading...' }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-blue-100 text-xs">Generated</p>
              <p class="text-sm font-medium">{{ formatDate(new Date()) }}</p>
            </div>
            <Button 
              icon="mdi mdi-close" 
              @click="closeModal" 
              text 
              rounded 
              class="text-white hover:bg-white/20"
            ></Button>
          </div>
        </div>
      </div>

      <!-- Project Info Cards -->
      <div class="p-6 bg-gray-50 border-b">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-lg border shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="mdi mdi-briefcase-outline text-blue-600"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Project</p>
                <p class="font-semibold text-gray-900 truncate">{{ selectedWorkOrder?.projectEnquiry?.title || '' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="mdi mdi-account-outline text-green-600"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                <p class="font-semibold text-gray-900 truncate">{{ selectedWorkOrder?.projectEnquiry?.client?.name || '' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <i class="mdi mdi-tag-outline text-purple-600"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Job Number</p>
                <p class="font-semibold text-gray-900">{{ selectedWorkOrder?.projectEnquiry?.job_number || '-' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 rounded-lg">
                <i class="mdi mdi-account-hard-hat text-orange-600"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Project Officer</p>
                <p class="font-semibold text-gray-900 truncate">{{ selectedWorkOrder?.projectEnquiry?.project_officer?.name || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Status and Priority Row -->
        <div class="flex gap-4 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Status:</span>
            <Tag :value="formatStatusCategory(selectedWorkOrder?.status_category || '')" :severity="getStatusSeverity(selectedWorkOrder?.status_category || '')" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Priority:</span>
            <Tag :value="formatPriority(selectedWorkOrder?.priority || '')" :severity="getPrioritySeverity(selectedWorkOrder?.priority || '')" />
          </div>
        </div>
      </div>

      <div v-if="loading" class="p-12">
        <div class="flex flex-col items-center justify-center">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4"></ProgressSpinner>
          <p class="mt-4 text-gray-600">Loading work order details...</p>
        </div>
      </div>

      <div v-else-if="selectedWorkOrder" class="flex-1 flex flex-col overflow-hidden">
        <!-- Tab Navigation -->
        <TabView v-model:activeIndex="activeTab" class="flex-1 flex flex-col custom-tabview">
          <!-- Scope Tab -->
          <TabPanel header="Project Scope" value="0">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Scope Elements</h3>
                <div class="flex gap-3">
                  <span class="p-input-icon-left">
                    <i class="mdi mdi-magnify"></i>
                    <InputText 
                      v-model="scopeSearch" 
                      placeholder="Search elements..." 
                      class="w-64"
                    ></InputText>
                  </span>
                  <Dropdown 
                    v-model="scopeFilter" 
                    :options="statusOptions" 
                    placeholder="Filter by Status" 
                    class="w-48"
                    showClear
                  ></Dropdown>
                </div>
              </div>
              
              <DataTable 
                :value="filteredScopeElements" 
                :rows="1000"
                dataKey="id"
                :loading="loading"
                responsiveLayout="scroll"
                stripedRows
                class="p-datatable-sm"
              >
                <Column field="name" header="Element Name" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <div class="p-1.5 bg-orange-100 rounded-full">
                        <i class="mdi mdi-cube-outline text-orange-600 text-xs"></i>
                      </div>
                      <span class="font-medium">{{ data.name }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="quantity" header="Quantity" sortable class="text-center">
                  <template #body="{ data }">
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {{ data.quantity }}
                    </span>
                  </template>
                </Column>
                <Column field="status" header="Status" sortable class="text-center">
                  <template #body="{ data }">
                    <Tag :value="data.status" :severity="getElementStatusSeverity(data.status)" />
                  </template>
                </Column>
                <Column field="notes" header="Notes">
                  <template #body="{ data }">
                    <span class="text-gray-600 text-sm">{{ data.notes || '-' }}</span>
                  </template>
                </Column>
              </DataTable>
            </div>
          </TabPanel>

          <!-- Design Assets Tab -->
          <TabPanel header="Design Assets" value="1">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Design Files & Assets</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div 
                  v-for="asset in designAssets" 
                  :key="asset.id" 
                  class="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  @click="previewAsset(asset)"
                >
                  <div class="aspect-video bg-gray-100 flex items-center justify-center">
                    <img 
                      v-if="asset.isImage" 
                      :src="asset.file_url" 
                      :alt="asset.name" 
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="text-center">
                      <i class="mdi mdi-file-outline text-4xl text-gray-400"></i>
                      <p class="text-xs text-gray-500 mt-1">{{ getFileExtension(asset.original_name) }}</p>
                    </div>
                  </div>
                  <div class="p-4">
                    <h4 class="font-medium text-gray-900 truncate">{{ asset.name }}</h4>
                    <p class="text-sm text-gray-500">{{ asset.formattedSize }}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Materials Tab -->
          <TabPanel header="Materials" value="2">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Materials List</h3>
              <DataTable 
                :value="materialsList" 
                :rows="1000"
                dataKey="id"
                :loading="loading"
                responsiveLayout="scroll"
                stripedRows
                class="p-datatable-sm"
              >
                <Column field="name" header="Material Name" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <div class="p-1.5 bg-blue-100 rounded-full">
                        <i class="mdi mdi-package-variant text-blue-600 text-xs"></i>
                      </div>
                      <span class="font-medium">{{ data.name }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="quantity" header="Quantity" sortable class="text-center">
                  <template #body="{ data }">
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {{ data.quantity }}
                    </span>
                  </template>
                </Column>
                <Column field="unit" header="Unit" sortable class="text-center">
                  <template #body="{ data }">
                    <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                      {{ data.unit }}
                    </span>
                  </template>
                </Column>
                <Column field="specifications" header="Specifications">
                  <template #body="{ data }">
                    <span class="text-gray-600 text-sm">{{ data.specifications || '-' }}</span>
                  </template>
                </Column>
                <Column field="source" header="Source" sortable class="text-center">
                  <template #body="{ data }">
                    <Tag :value="data.source" :severity="data.source === 'Library' ? 'info' : 'secondary'" />
                  </template>
                </Column>
                <Column field="status" header="Status" sortable class="text-center">
                  <template #body="{ data }">
                    <Tag :value="data.status" :severity="getMaterialStatusSeverity(data.status)" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </TabPanel>

          <!-- Equipment Tab -->
          <TabPanel header="Equipment" value="3">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Equipment Requirements</h3>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <i class="mdi mdi-tools text-4xl text-blue-500 mb-3"></i>
                <h4 class="text-lg font-medium text-blue-900 mb-2">Equipment Database Coming Soon</h4>
                <p class="text-blue-700">Equipment requirements will be tracked here once the equipment database is implemented.</p>
              </div>
            </div>
          </TabPanel>
        </TabView>

        <!-- Timeline Footer -->
        <div class="bg-gray-50 border-t p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Timeline & Assignment</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="mdi mdi-calendar-plus text-blue-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(selectedWorkOrder?.created_at) }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="mdi mdi-account-check text-green-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Assigned To</p>
                <p class="font-medium text-gray-900">{{ selectedWorkOrder?.assignedTo?.name || '-' }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <i class="mdi mdi-domain text-purple-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                <p class="font-medium text-gray-900">Production</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 rounded-lg">
                <i class="mdi mdi-play-circle text-orange-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Started</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(selectedWorkOrder?.started_at) }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 rounded-lg">
                <i class="mdi mdi-calendar-clock text-red-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
                <p class="font-medium text-gray-900">{{ formatDate(selectedWorkOrder?.due_date) }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="mdi mdi-check-circle text-green-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(selectedWorkOrder?.completed_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>  
    </div>
  </div>

  <!-- Asset Preview Modal -->
  <div v-if="assetPreviewVisible" class="fixed inset-0 flex items-center justify-center z-100 p-4 sm:p-6">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeAssetPreview"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[800px] max-h-[95vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      <div v-if="previewingAsset" class="text-center p-6">
        <img 
          v-if="previewingAsset.isImage" 
          :src="previewingAsset.file_url" 
          :alt="previewingAsset.name" 
          class="max-w-full max-h-96 object-contain mx-auto rounded-lg"
        />
        <div v-else class="py-8">
          <i class="mdi mdi-file-outline text-6xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">{{ previewingAsset.description || 'No preview available for this file type' }}</p>
          <p class="text-sm text-gray-500 mt-2">Size: {{ previewingAsset.formattedSize }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkOrders } from '../composables'
import { DesignService } from '@/modules/projects/components/tasks/design/services/designService'
import { MaterialsService } from '@/modules/projects/services/materialsService'
import Network from '@/network-class'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

interface Props {
  workOrderId: number
}

interface Emits {
  (e: 'close'): void
}

interface DesignAsset {
  id: number
  name: string
  original_name: string
  file_url: string
  file_size: number
  mime_type: string
  isImage: boolean
  formattedSize: string
  description?: string
}

interface ScopeElement {
  id: number
  name: string
  quantity: number
  status: string
  notes?: string
}

interface Material {
  id: number
  name: string
  quantity: number
  unit: string
  specifications: string
  source: string
  status: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

interface ProjectEnquiry {
  id: number
  job_number: string
  title: string
  client_name: string
  projectOfficer?: {
    id: number
    name: string
    email: string
  }
  project_scope?: any
}

interface WorkOrder {
  id: number
  work_order_number: string
  title: string
  status_category?: string
  priority?: string
  projectEnquiry?: ProjectEnquiry
  assignedTo?: {
    id: number
    name: string
  }
  created_at?: string | Date
  started_at?: string | Date
  completed_at?: string | Date
  due_date?: string | Date
}

const { fetchWorkOrder, selectedWorkOrder, loading } = useWorkOrders()

// Reactive data
const visible = ref(true)
const activeTab = ref(0)
const scopeSearch = ref('')
const scopeFilter = ref('')
const designAssets = ref<DesignAsset[]>([])
const scopeElements = ref<ScopeElement[]>([])
const materialsList = ref<Material[]>([])
const previewingAsset = ref<DesignAsset | null>(null)
const assetPreviewVisible = ref(false)

// Options for dropdowns
const statusOptions = ref([
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' }
])

// Computed properties
const filteredScopeElements = computed(() => {
  let filtered = scopeElements.value
  
  if (scopeSearch.value) {
    filtered = filtered.filter(element => 
      element.name.toLowerCase().includes(scopeSearch.value.toLowerCase())
    )
  }
  
  if (scopeFilter.value) {
    filtered = filtered.filter(element => element.status === scopeFilter.value)
  }
  
  return filtered
})

onMounted(async () => {
  console.log('WorkOrderDetails mounted with workOrderId:', props.workOrderId)
  await fetchWorkOrder(props.workOrderId)
  console.log('After fetchWorkOrder, selectedWorkOrder:', selectedWorkOrder.value)
  console.log('selectedWorkOrder keys:', Object.keys(selectedWorkOrder.value || {}))
  
  if (selectedWorkOrder.value) {
    await fetchRelatedData()
  }
})

const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data for work order ID:', props.workOrderId)
    console.log('Current selectedWorkOrder:', selectedWorkOrder.value)
    
    // Fetch project enquiry data if not already loaded
    await fetchProjectEnquiry()
    
    await fetchDesignAssets()
    await fetchScopeElements()
    await fetchMaterials()
  } catch (error) {
    console.error('Error fetching related data:', error)
  }
}

const fetchProjectEnquiry = async () => {
  try {
    console.log('fetchProjectEnquiry called')
    console.log('project_enquiry_id:', selectedWorkOrder.value?.project_enquiry_id)
    console.log('projectEnquiry exists:', !!selectedWorkOrder.value?.projectEnquiry)
    
    if (selectedWorkOrder.value?.project_enquiry_id && !selectedWorkOrder.value?.projectEnquiry) {
      console.log('Fetching project enquiry data for ID:', selectedWorkOrder.value.project_enquiry_id)
      
      const enquiryResponse = await Network.get(`/api/projects/enquiries/${selectedWorkOrder.value.project_enquiry_id}`)
      console.log('Project enquiry response:', enquiryResponse)
      console.log('Project enquiry response data:', enquiryResponse.data)
      
      if (enquiryResponse.data) {
        // Add project enquiry data to the work order
        selectedWorkOrder.value.projectEnquiry = enquiryResponse.data
        console.log('Project enquiry data added:', selectedWorkOrder.value.projectEnquiry)
        console.log('Project title:', selectedWorkOrder.value.projectEnquiry.title)
        console.log('Client name:', selectedWorkOrder.value.projectEnquiry.client)
        console.log('Job number:', selectedWorkOrder.value.projectEnquiry.job_number)
        console.log('Project officer:', selectedWorkOrder.value.projectEnquiry.project_officer?.name)
      } else {
        console.log('No data in enquiry response, available keys:', Object.keys(enquiryResponse || {}))
      }
    } else {
      console.log('Skipping project enquiry fetch - either no ID or already has data')
    }
  } catch (error) {
    console.error('Error fetching project enquiry:', error)
  }
}

const fetchDesignAssets = async () => {
  try {
    console.log('Fetching design assets for work order:', selectedWorkOrder.value)
    console.log('Enquiry task ID:', selectedWorkOrder.value?.enquiry_task_id)
    console.log('Project enquiry ID:', selectedWorkOrder.value?.project_enquiry_id)
    
    let taskId = selectedWorkOrder.value?.enquiry_task_id
    
    // If no enquiry_task_id, find the design task for this project enquiry
    if (!taskId && selectedWorkOrder.value?.project_enquiry_id) {
      console.log('No enquiry_task_id, fetching enquiry tasks to find design task')
      
      try {
        // Get enquiry details to find design task (same logic as ProductionTask.vue)
        const enquiryResponse = await Network.get(`/api/projects/enquiries/${selectedWorkOrder.value.project_enquiry_id}`)
        console.log('Enquiry response:', enquiryResponse)
        console.log('Enquiry response data:', enquiryResponse.data)
        
        let enquiryTasks = []
        
        // Try different possible response structures
        if (enquiryResponse.data?.data?.enquiry_tasks) {
          enquiryTasks = enquiryResponse.data.data.enquiry_tasks
          console.log('Found enquiry_tasks in data.data.enquiry_tasks')
        } else if (enquiryResponse.data?.data?.enquiryTasks) {
          enquiryTasks = enquiryResponse.data.data.enquiryTasks
          console.log('Found enquiryTasks in data.data.enquiryTasks')
        } else if (enquiryResponse.data?.enquiry_tasks) {
          enquiryTasks = enquiryResponse.data.enquiry_tasks
          console.log('Found enquiry_tasks in data.enquiry_tasks')
        } else if (enquiryResponse.data?.enquiryTasks) {
          enquiryTasks = enquiryResponse.data.enquiryTasks
          console.log('Found enquiryTasks in data.enquiryTasks')
        } else {
          console.log('No enquiry tasks found in response. Available keys:', Object.keys(enquiryResponse.data || {}))
        }
        
        console.log('Enquiry tasks:', enquiryTasks)
        console.log('Enquiry tasks count:', enquiryTasks.length)
        
        // Log all task types to help debug
        if (enquiryTasks.length > 0) {
          console.log('Available task types:', enquiryTasks.map((t: any) => ({ id: t.id, type: t.task_type || t.type, name: t.name || t.title })))
        }
        
        // Find the design task
        const designTask = enquiryTasks.find((t: any) => 
          t.task_type === 'Design' || 
          t.task_type === 'Designer' || 
          t.type === 'design'
        )
        
        console.log('Found design task:', designTask)
        
        if (designTask) {
          taskId = designTask.id.toString()
          console.log('Using design task ID:', taskId)
        } else {
          console.log('No design task found for this project enquiry')
          console.log('Available tasks:', enquiryTasks.map((t: any) => ({ id: t.id, task_type: t.task_type, type: t.type, name: t.name })))
          designAssets.value = []
          return
        }
      } catch (error) {
        console.error('Error fetching enquiry tasks:', error)
        designAssets.value = []
        return
      }
    }
    
    if (taskId) {
      const designService = new DesignService()
      const response = await designService.getAssets(taskId.toString())
      
      console.log('Design assets response:', response)
      console.log('Response data:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        designAssets.value = response.data.map(asset => ({
          id: parseInt(asset.id) || 0,
          name: asset.name || asset.original_name || 'Unknown',
          original_name: asset.original_name || 'file',
          file_url: asset.file_url || asset.url || '',
          file_size: asset.file_size || asset.sizeBytes || 0,
          mime_type: asset.mime_type || '',
          isImage: asset.mime_type?.startsWith('image/') || false,
          formattedSize: formatFileSize(asset.file_size || asset.sizeBytes || 0),
          description: asset.description
        }))
        
        console.log('Mapped design assets:', designAssets.value)
      } else {
        console.log('No design assets data found in response')
        designAssets.value = []
      }
    } else {
      console.log('No task ID found for fetching design assets')
      designAssets.value = []
    }
  } catch (error) {
    console.error('Error fetching design assets:', error)
    designAssets.value = []
  }
}

const fetchScopeElements = async () => {
  try {
    if (selectedWorkOrder.value?.project_enquiry_id) {
      const materialsData = await MaterialsService.getMaterialsByEnquiry(selectedWorkOrder.value.project_enquiry_id)
      
      scopeElements.value = materialsData.projectElements.map((element, index) => ({
        id: parseInt(element.id) || index + 1,
        name: element.name,
        quantity: element.materials?.reduce((sum, material) => sum + (material.quantity || 0), 0) || 1,
        status: element.isIncluded ? 'completed' : 'pending',
        notes: element.notes || ''
      }))
    } else if (selectedWorkOrder.value?.projectEnquiry && 'project_scope' in selectedWorkOrder.value.projectEnquiry) {
      const scopeData = (selectedWorkOrder.value.projectEnquiry as any).project_scope
      if (Array.isArray(scopeData)) {
        scopeElements.value = scopeData.map((item, index) => ({
          id: index + 1,
          name: item.name || `Element ${index + 1}`,
          quantity: item.quantity || 1,
          status: item.status || 'pending',
          notes: item.notes || ''
        }))
      }
    } else {
      scopeElements.value = []
    }
  } catch (error) {
    console.error('Error fetching scope elements:', error)
    scopeElements.value = []
  }
}

const fetchMaterials = async () => {
  try {
    if (selectedWorkOrder.value?.project_enquiry_id) {
      const materialsData = await MaterialsService.getMaterialsByEnquiry(selectedWorkOrder.value.project_enquiry_id)
      
      // Flatten all materials from all elements
      const allMaterials: Material[] = []
      materialsData.projectElements.forEach(element => {
        element.materials.forEach(material => {
          allMaterials.push({
            id: parseInt(material.id) || Math.random(),
            name: material.description,
            quantity: material.quantity,
            unit: material.unitOfMeasurement,
            specifications: material.notes || '',
            source: material.libraryMaterialId ? 'Library' : 'Custom',
            status: material.isIncluded ? 'available' : 'ordered'
          })
        })
      })
      
      materialsList.value = allMaterials
    } else {
      materialsList.value = []
    }
  } catch (error) {
    console.error('Error fetching materials:', error)
    materialsList.value = []
  }
}

const closeModal = () => {
  visible.value = false
  emit('close')
}

const previewAsset = (asset: DesignAsset) => {
  previewingAsset.value = asset
  assetPreviewVisible.value = true
}

const closeAssetPreview = () => {
  previewingAsset.value = null
  assetPreviewVisible.value = false
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Severity helpers for PrimeVue components
const getStatusSeverity = (status: string | undefined): string => {
  if (!status) return 'secondary'
  const severityMap: Record<string, string> = {
    in_progress: 'warning',
    approved: 'success',
    completed: 'info'
  }
  return severityMap[status] || 'secondary'
}

const getPrioritySeverity = (priority: string | undefined): string => {
  if (!priority) return 'secondary'
  const severityMap: Record<string, string> = {
    low: 'secondary',
    medium: 'info',
    high: 'warning',
    urgent: 'danger'
  }
  return severityMap[priority] || 'secondary'
}

const getElementStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success'
  }
  return severityMap[status] || 'secondary'
}

const getMaterialStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    available: 'success',
    ordered: 'warning',
    received: 'info'
  }
  return severityMap[status] || 'secondary'
}

// Formatting functions
const formatStatusCategory = (category: string | undefined): string => {
  if (!category) return ''
  const map: Record<string, string> = {
    in_progress: 'In Progress',
    approved: 'Approved',
    completed: 'Completed'
  }
  return map[category] || category
}

const formatPriority = (priority: string | undefined): string => {
  if (!priority) return ''
  const map: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  }
  return map[priority] || priority
}

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateTime: string | Date | null | undefined): string => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.work-order-details {
  display: flex;
  flex-direction: column;
  height: 85vh;
  background-color: white;
  overflow: hidden;
}

/* Make tab content scrollable */
.p-tabview {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.p-tabview-nav {
  flex-shrink: 0;
}

.p-tabview-panels {
  flex: 1;
  overflow-y: auto;
  background-color: white;
}

/* Custom TabView Styling - Enhanced Modern Design - Updated: 2025-01-20 */
.custom-tabview .p-tabview-nav {
  border-bottom: 3px solid #e5e7eb !important;
  background: linear-gradient(to bottom, #ffffff, #f8fafc) !important;
  padding: 1rem 1rem 0 1rem !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.custom-tabview .p-tabview-nav li {
  margin-right: 0.5rem !important;
}

.custom-tabview .p-tabview-nav li .p-tabview-nav-link {
  padding: 1rem 1.5rem !important;
  margin: 0 !important;
  border-radius: 0.75rem 0.75rem 0 0 !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  color: #64748b !important;
  background: #f1f5f9 !important;
  border: 2px solid transparent !important;
  border-bottom: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  top: 2px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.custom-tabview .p-tabview-nav li .p-tabview-nav-link:hover {
  background: #e2e8f0 !important;
  color: #475569 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.custom-tabview .p-tabview-nav li.p-tabview-selected .p-tabview-nav-link {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  color: white !important;
  border: 2px solid #3b82f6 !important;
  border-bottom: 2px solid #2563eb !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
  transform: translateY(0) !important;
  top: 0 !important;
  z-index: 10 !important;
}

.custom-tabview .p-tabview-nav li.p-tabview-selected .p-tabview-nav-link::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 3px !important;
  background: linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb) !important;
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.custom-tabview .p-tabview-panels {
  background: white !important;
  border: none !important;
  margin-top: -1px !important;
}

.p-tabview-panel {
  height: 100%;
}

/* Fix gradient class */
.bg-linear-to-r {
  background: linear-gradient(to right, rgb(37 99 235), rgb(29 78 216));
}

/* Ensure proper backgrounds for all sections */
.p-datatable .p-datatable-tbody > tr > td {
  background-color: white;
}

.p-datatable .p-datatable-tbody > tr:nth-child(odd) > td {
  background-color: #f9fafb;
}

/* Custom modal styles - matching other ERP modals */
.animate-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
