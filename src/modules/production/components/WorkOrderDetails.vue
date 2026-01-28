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
      <div class="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <i class="mdi mdi-briefcase-outline text-blue-600 dark:text-blue-400"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project</p>
                <p class="font-semibold text-gray-900 dark:text-white truncate">{{ selectedWorkOrder?.projectEnquiry?.title || '' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <i class="mdi mdi-account-outline text-green-600 dark:text-green-400"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client</p>
                <p class="font-semibold text-gray-900 dark:text-white truncate">{{ selectedWorkOrder?.projectEnquiry?.client?.company_name || selectedWorkOrder?.projectEnquiry?.client?.full_name || '' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <i class="mdi mdi-tag-outline text-purple-600 dark:text-purple-400"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Job Number</p>
                <p class="font-semibold text-gray-900 dark:text-white">{{ selectedWorkOrder?.projectEnquiry?.job_number || '-' }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <i class="mdi mdi-account-hard-hat text-orange-600 dark:text-orange-400"></i>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Officer</p>
                <p class="font-semibold text-gray-900 dark:text-white truncate">{{ selectedWorkOrder?.project_officer_name || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Status and Priority Row -->
        <div class="flex gap-4 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
            <Tag :value="formatStatusCategory(selectedWorkOrder?.status_category || '')" :severity="getStatusSeverity(selectedWorkOrder?.status_category || '')" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
            <Tag :value="formatPriority(selectedWorkOrder?.priority || '')" :severity="getPrioritySeverity(selectedWorkOrder?.priority || '')" />
          </div>
        </div>
      </div>

      <div v-if="loading" class="p-12">
        <div class="flex flex-col items-center justify-center">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4"></ProgressSpinner>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading work order details...</p>
        </div>
      </div>

      <div v-else-if="selectedWorkOrder" class="flex-1 flex flex-col overflow-hidden">
        <!-- Modern Tab Navigation -->
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div class="px-6 pt-6">
            <!-- Tab Headers with Icons -->
            <div class="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit">
              <button
                v-for="(tab, index) in tabs"
                :key="tab.value"
                @click="activeTab = index"
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 relative overflow-hidden group',
                  activeTab === index
                    ? 'bg-blue-600 dark:bg-blue-900 text-white dark:text-blue-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                <!-- Icon with animation -->
                <i 
                  :class="[
                    'mdi text-lg transition-transform duration-200 relative z-10',
                    tab.icon,
                    activeTab === index ? 'scale-110' : 'group-hover:scale-105'
                  ]"
                ></i>
                
                <!-- Tab label -->
                <span class="relative z-10">{{ tab.label }}</span>
                
                <!-- Badge for content count (optional) -->
                <span 
                  v-if="tab.count !== undefined"
                  :class="[
                    'ml-1 px-2 py-0.5 text-xs rounded-full relative z-10',
                    activeTab === index
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content with Smooth Transitions -->
        <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <div class="h-full overflow-y-auto">
            <!-- Project Scope Tab -->
            <div v-show="activeTab === 0" class="animate-fadeIn">
              <div class="p-6 bg-white dark:bg-gray-800 m-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Tab Header -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-orange-100 dark:bg-orange-900 rounded-xl">
                      <i class="mdi mdi-cube-outline text-orange-600 dark:text-orange-400 text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white">Project Scope</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Manage project elements and specifications</p>
                    </div>
                  </div>
                  
                  <!-- Search and Filters -->
                  <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative">
                      <i class="mdi mdi-magnify absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <InputText 
                        v-model="scopeSearch" 
                        placeholder="Search elements..." 
                        class="pl-10 w-full sm:w-64 h-10 rounded-lg border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <Dropdown 
                      v-model="scopeFilter" 
                      :options="statusOptions" 
                      placeholder="Filter Status" 
                      class="w-full sm:w-40 rounded-lg"
                      showClear
                    />
                  </div>
                </div>
                
                <!-- Enhanced DataTable -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <DataTable 
                    :value="filteredScopeElements" 
                    :rows="1000"
                    dataKey="id"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="modern-datatable"
                    :paginator="filteredScopeElements.length > 10"
                    :rowsPerPageOptions="[10, 25, 50]"
                  >
                    <Column field="name" header="Element Name" sortable>
                      <template #body="{ data }">
                        <div class="flex items-center gap-3">
                          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <i class="mdi mdi-cube-outline text-orange-600 dark:text-orange-400"></i>
                          </div>
                          <div>
                            <span class="font-semibold text-gray-900 dark:text-white">{{ data.name }}</span>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ data.notes || 'No notes' }}</p>
                          </div>
                        </div>
                      </template>
                    </Column>
                    <Column field="quantity" header="Quantity" sortable class="text-center">
                      <template #body="{ data }">
                        <div class="flex justify-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                            <i class="mdi mdi-counter text-xs"></i>
                            {{ data.quantity }}
                          </span>
                        </div>
                      </template>
                    </Column>
                    <Column field="status" header="Status" sortable class="text-center">
                      <template #body="{ data }">
                        <div class="flex justify-center">
                          <Tag :value="data.status" :severity="getElementStatusSeverity(data.status)" />
                        </div>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </div>
            </div>

            <!-- Design Assets Tab -->
            <div v-show="activeTab === 1" class="animate-fadeIn">
              <div class="p-6 bg-white dark:bg-gray-800 m-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Tab Header -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2.5 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <i class="mdi mdi-image-multiple-outline text-purple-600 dark:text-purple-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Design Assets</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Design files, mockups, and visual resources</p>
                  </div>
                </div>
                
                <!-- Assets Grid -->
                <div v-if="designAssets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div 
                    v-for="asset in designAssets" 
                    :key="asset.id" 
                    class="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                  >
                    <!-- Asset Preview -->
                    <div class="aspect-video bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative overflow-hidden" @click="previewAsset(asset)">
                      <img 
                        v-if="asset.isImage" 
                        :src="asset.file_url" 
                        :alt="asset.name" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div v-else class="text-center">
                        <i class="mdi mdi-file-outline text-4xl text-gray-400 dark:text-gray-500"></i>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ getFileExtension(asset.original_name) }}</p>
                      </div>
                      
                      <!-- Overlay on hover -->
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <!-- Preview button -->
                          <button 
                            @click.stop="previewAsset(asset)"
                            class="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                            title="Preview"
                          >
                            <i class="mdi mdi-eye-outline text-lg"></i>
                          </button>
                          <!-- Download button -->
                          <button 
                            @click.stop="downloadAsset(asset)"
                            class="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                            title="Download"
                          >
                            <i class="mdi mdi-download text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Asset Info -->
                    <div class="p-4">
                      <div class="flex items-start justify-between mb-2">
                        <h4 class="font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">{{ asset.name }}</h4>
                        <!-- Quick download button -->
                        <button 
                          @click="downloadAsset(asset)"
                          class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
                          title="Download"
                        >
                          <i class="mdi mdi-download text-sm"></i>
                        </button>
                      </div>
                      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{{ asset.formattedSize }}</span>
                        <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{{ getFileExtension(asset.original_name) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-else class="text-center py-12">
                  <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <i class="mdi mdi-image-off-outline text-3xl text-gray-400 dark:text-gray-500"></i>
                  </div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Design Assets</h4>
                  <p class="text-gray-500 dark:text-gray-400">Design assets will appear here once they are uploaded to the project.</p>
                </div>
              </div>
            </div>

            <!-- Materials Tab -->
            <div v-show="activeTab === 2" class="animate-fadeIn">
              <div class="p-6 bg-white dark:bg-gray-800 m-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Tab Header -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2.5 bg-green-100 dark:bg-green-900 rounded-xl">
                    <i class="mdi mdi-package-variant-closed text-green-600 dark:text-green-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Materials</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Required materials and inventory management</p>
                  </div>
                </div>
                
                <!-- Materials Table -->
                <div v-if="materialsList.length > 0" class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <DataTable 
                    :value="materialsList" 
                    :rows="1000"
                    dataKey="id"
                    :loading="loading"
                    responsiveLayout="scroll"
                    stripedRows
                    class="modern-datatable"
                    :paginator="materialsList.length > 10"
                    :rowsPerPageOptions="[10, 25, 50]"
                  >
                    <Column field="name" header="Material Name" sortable>
                      <template #body="{ data }">
                        <div class="flex items-center gap-3">
                          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <i class="mdi mdi-package-variant text-green-600 dark:text-green-400"></i>
                          </div>
                          <div>
                            <span class="font-semibold text-gray-900 dark:text-white">{{ data.name }}</span>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ data.specifications || 'No specifications' }}</p>
                          </div>
                        </div>
                      </template>
                    </Column>
                    <Column field="quantity" header="Quantity" sortable class="text-center">
                      <template #body="{ data }">
                        <div class="flex justify-center">
                          <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                            <i class="mdi mdi-counter text-xs"></i>
                            {{ data.quantity }}
                          </span>
                        </div>
                      </template>
                    </Column>
                    <Column field="unit" header="Unit" sortable class="text-center">
                      <template #body="{ data }">
                        <div class="flex justify-center">
                          <span class="px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-sm font-medium">
                            {{ data.unit }}
                          </span>
                        </div>
                      </template>
                    </Column>
                    <Column field="source" header="Source" sortable class="text-center">
                      <template #body="{ data }">
                        <div class="flex justify-center">
                          <Tag :value="data.source" :severity="data.source === 'Library' ? 'info' : 'secondary'" />
                        </div>
                      </template>
                    </Column>
                    <Column field="status" header="Status" sortable class="text-center">
                      <template #body="{ data }">
                        <div class="flex justify-center">
                          <Tag :value="data.status" :severity="getMaterialStatusSeverity(data.status)" />
                        </div>
                      </template>
                    </Column>
                  </DataTable>
                </div>
                
                <!-- Empty State -->
                <div v-else class="text-center py-12">
                  <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <i class="mdi mdi-package-variant-off text-3xl text-gray-400 dark:text-gray-500"></i>
                  </div>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Materials</h4>
                  <p class="text-gray-500 dark:text-gray-400">Materials will appear here once they are added to the project scope.</p>
                </div>
              </div>
            </div>

            <!-- Equipment Tab -->
            <div v-show="activeTab === 3" class="animate-fadeIn">
              <div class="p-6 bg-white dark:bg-gray-800 m-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Tab Header -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2.5 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <i class="mdi mdi-tools text-blue-600 dark:text-blue-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Equipment</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Equipment requirements and scheduling</p>
                  </div>
                </div>
                
                <!-- Coming Soon State -->
                <div class="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-12 text-center">
                  <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                    <i class="mdi mdi-tools text-3xl text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <h4 class="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">Equipment Database Coming Soon</h4>
                  <p class="text-blue-700 dark:text-blue-300 max-w-md mx-auto">
                    Equipment requirements, scheduling, and resource management will be available here once the equipment database module is implemented.
                  </p>
                  <div class="mt-6 flex justify-center gap-3">
                    <div class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      <i class="mdi mdi-clock-outline mr-1"></i>
                      In Development
                    </div>
                    <div class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                      <i class="mdi mdi-alert-circle-outline mr-1"></i>
                      Planned Feature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact Timeline Footer -->
        <div class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- Left side - Key dates -->
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <i class="mdi mdi-calendar-plus text-blue-600 dark:text-blue-400 text-sm"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(selectedWorkOrder?.created_at) }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <i class="mdi mdi-calendar-clock text-red-600 dark:text-red-400 text-sm"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Due</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedWorkOrder?.due_date) }}</p>
                </div>
              </div>
            </div>

            <!-- Right side - Status info -->
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <i class="mdi mdi-domain text-purple-600 dark:text-purple-400 text-sm"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Production</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <i class="mdi mdi-flag text-blue-600 dark:text-blue-400 text-sm"></i>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatStatusCategory(selectedWorkOrder?.status_category) || 'Unknown' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>  
    </div>
  </div>

  <!-- Asset Preview Modal - Fullscreen -->
  <div v-if="assetPreviewVisible" class="fixed inset-0 flex items-center justify-center z-150">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="closeAssetPreview"></div>

    <!-- Fullscreen Modal Container -->
    <div class="relative w-full h-full max-w-[100vw] max-h-screen flex flex-col z-160 overflow-hidden animate-in fade-in zoom-in duration-200">
      <!-- Modal Header -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <i class="mdi mdi-image-outline text-purple-600 dark:text-purple-400 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ previewingAsset?.name || 'Asset Preview' }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ previewingAsset?.formattedSize }} • {{ getFileExtension(previewingAsset?.original_name || '') }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Download button -->
          <Button 
            icon="mdi mdi-download" 
            @click="downloadAsset(previewingAsset!)"
            class="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            text
            rounded
            title="Download Asset"
          ></Button>
          <!-- Close button -->
          <Button 
            icon="mdi mdi-close" 
            @click="closeAssetPreview" 
            text 
            rounded 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          ></Button>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 bg-white dark:bg-gray-900 overflow-auto p-6">
        <div v-if="previewingAsset" class="w-full h-full flex items-center justify-center">
          <!-- Image Preview -->
          <div v-if="previewingAsset.isImage" class="relative max-w-full max-h-full">
            <img 
              :src="previewingAsset.file_url" 
              :alt="previewingAsset.name" 
              class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <!-- Image info overlay -->
            <div class="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <p class="text-sm font-medium">{{ previewingAsset.name }}</p>
              <p class="text-xs opacity-75">{{ previewingAsset.formattedSize }}</p>
            </div>
          </div>
          
          <!-- File Preview -->
          <div v-else class="text-center max-w-2xl">
            <div class="mb-8">
              <i class="mdi mdi-file-outline text-8xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ previewingAsset.name }}</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                <i class="mdi mdi-file-document-outline"></i>
                <span>{{ getFileExtension(previewingAsset.original_name) }} File</span>
              </div>
              <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                <i class="mdi mdi-database-outline"></i>
                <span>{{ previewingAsset.formattedSize }}</span>
              </div>
              <div v-if="previewingAsset.description" class="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300">{{ previewingAsset.description }}</p>
              </div>
              <div v-else class="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <i class="mdi mdi-information-outline text-blue-600 dark:text-blue-400 text-2xl mb-2"></i>
                <p class="text-blue-700 dark:text-blue-300">No preview available for this file type</p>
              </div>
            </div>
          </div>
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
  client_name?: string
  client?: {
    id: number
    full_name?: string
    company_name?: string
    contact_person?: string
  }
  project_officer?: {
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

// Tabs configuration
const tabs = computed(() => [
  {
    label: 'Project Scope',
    value: '0',
    icon: 'mdi mdi-cube-outline',
    count: scopeElements.value.length
  },
  {
    label: 'Design Assets',
    value: '1', 
    icon: 'mdi mdi-image-multiple-outline',
    count: designAssets.value.length
  },
  {
    label: 'Materials',
    value: '2',
    icon: 'mdi mdi-package-variant-closed',
    count: materialsList.value.length
  },
  {
    label: 'Equipment',
    value: '3',
    icon: 'mdi mdi-tools',
    count: undefined
  }
])

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
  
  // Start fetching work order immediately
  const workOrderPromise = fetchWorkOrder(props.workOrderId)
  
  // Start fetching project enquiry in parallel if we have the ID
  const projectEnquiryPromise = workOrderPromise.then(async () => {
    if (selectedWorkOrder.value?.project_enquiry_id && !selectedWorkOrder.value?.projectEnquiry) {
      return fetchProjectEnquiry()
    }
  })
  
  // Wait for work order to be loaded
  await workOrderPromise
  console.log('After fetchWorkOrder, selectedWorkOrder:', selectedWorkOrder.value)
  
  if (selectedWorkOrder.value) {
    // Fetch all related data in parallel for better performance
    await Promise.allSettled([
      projectEnquiryPromise,
      fetchDesignAssets(),
      fetchScopeElements(),
      fetchMaterials()
    ])
  }
})

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
        console.log('Project title:', selectedWorkOrder.value.projectEnquiry?.title)
        console.log('Client name:', selectedWorkOrder.value.projectEnquiry?.client?.company_name || selectedWorkOrder.value.projectEnquiry?.client?.full_name)
        console.log('Job number:', selectedWorkOrder.value.projectEnquiry?.job_number)
        console.log('Project officer:', selectedWorkOrder.value.projectEnquiry?.project_officer?.name)
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
        
        let enquiryTasks = []
        
        // Try different possible response structures - optimized checking
        const data = enquiryResponse.data
        if (data?.data?.enquiry_tasks) {
          enquiryTasks = data.data.enquiry_tasks
        } else if (data?.data?.enquiryTasks) {
          enquiryTasks = data.data.enquiryTasks
        } else if (data?.enquiry_tasks) {
          enquiryTasks = data.enquiry_tasks
        } else if (data?.enquiryTasks) {
          enquiryTasks = data.enquiryTasks
        }
        
        console.log('Enquiry tasks:', enquiryTasks)
        
        // Find the design task - optimized search
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
      
      if (response.data && Array.isArray(response.data)) {
        designAssets.value = response.data.map(asset => ({
          id: parseInt(asset.id) || 0,
          name: asset.name || asset.original_name || 'Unknown',
          original_name: asset.original_name || asset.name || 'unknown_file',
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

const downloadAsset = async (asset: DesignAsset) => {
  try {
    // Determine the best filename to use
    let filename = asset.original_name || asset.name || 'download'
    
    // Ensure filename has proper extension
    const extension = getFileExtension(asset.original_name || asset.name || '')
    if (extension && !filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
      filename += `.${extension}`
    }
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a')
    link.href = asset.file_url
    link.download = filename
    link.target = '_blank'
    
    // Force download for specific file types that tend to open in browser
    const forceDownloadTypes = ['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'XLS', 'XLSX', 'TXT']
    if (forceDownloadTypes.includes(extension.toUpperCase())) {
      // For these types, we'll always fetch and create a blob to force download
      try {
        const response = await fetch(asset.file_url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        link.href = url
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        window.URL.revokeObjectURL(url)
        return
      } catch (fetchError) {
        console.warn('Fetch failed for document, trying direct download:', fetchError)
      }
    }
    
    // For cross-origin downloads, we might need to fetch first
    if (asset.file_url.startsWith('http')) {
      try {
        const response = await fetch(asset.file_url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        link.href = url
        
        // Trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        window.URL.revokeObjectURL(url)
      } catch (fetchError) {
        console.warn('Fetch failed, trying direct download:', fetchError)
        // Fallback to direct link if fetch fails
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      // For relative URLs, trigger direct download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('Error downloading asset:', error)
    // You could show a toast notification here
  }
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

/* Fade-in animation for tab content */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Modern DataTable styling */
.modern-datatable {
  border-radius: 0.75rem;
  overflow: hidden;
}

.modern-datatable .p-datatable-header {
  background: #f8fafc;
  border: none;
  border-radius: 0.75rem 0.75rem 0 0;
}

.modern-datatable .p-datatable-thead > tr > th {
  background: #f1f5f9;
  border: none;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem;
}

.modern-datatable .p-datatable-tbody > tr > td {
  border: none;
  padding: 1rem;
  vertical-align: middle;
}

.modern-datatable .p-datatable-tbody > tr:nth-child(odd) > td {
  background: #f8fafc;
}

.modern-datatable .p-datatable-tbody > tr:hover > td {
  background: #f1f5f9;
}

/* Dark mode for modern datatable */
.dark .modern-datatable .p-datatable-header {
  background: #1f2937;
}

.dark .modern-datatable .p-datatable-thead > tr > th {
  background: #374151;
  color: #d1d5db;
}

.dark .modern-datatable .p-datatable-tbody > tr > td {
  background: #1f2937;
  color: #f3f4f6;
  border-color: #374151;
}

.dark .modern-datatable .p-datatable-tbody > tr:nth-child(odd) > td {
  background: #111827;
}

.dark .modern-datatable .p-datatable-tbody > tr:hover > td {
  background: #374151;
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

/* DataTable dark mode styling */
.dark .p-datatable .p-datatable-thead > tr > th {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}

.dark .p-datatable .p-datatable-tbody > tr > td {
  background-color: #1f2937 !important;
  color: #f3f4f6 !important;
  border-color: #374151 !important;
}

.dark .p-datatable .p-datatable-tbody > tr:nth-child(odd) > td {
  background-color: #111827 !important;
}

/* Input components dark mode */
.dark .p-inputtext {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}

.dark .p-dropdown {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}

/* Tab button hover effects */
button:hover {
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .work-order-details {
    height: 100vh;
  }
  
  .p-6 {
    padding: 1rem !important;
  }
  
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
}
</style>
