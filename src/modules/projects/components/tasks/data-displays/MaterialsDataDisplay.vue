<template>
  <div class="materials-task-content">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading materials data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-red-800 dark:text-red-200">{{ error }}</span>
      </div>
      <button
        @click="loadMaterialsData"
        class="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded text-sm transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Project Header Section -->
    <div class="mb-6">
      <!-- Project Information Display -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Information</h5>
        <!-- Project Information Grid - 3 per row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold">{{ materialsData.projectInfo.enquiryTitle }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Enquiry Number</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium">{{ materialsData.projectInfo.projectId }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ materialsData.projectInfo.clientName }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Event Venue</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ materialsData.projectInfo.eventVenue }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Expected Delivery Date</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(materialsData.projectInfo.setupDate) }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Set Down Date</label>
            <p class="text-sm text-gray-900 dark:text-white text-gray-500 italic">{{ materialsData.projectInfo.setDownDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Elements Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-5">
         <div>
            <h5 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <i class="mdi mdi-package-variant text-blue-500"></i>
               Project Elements
            </h5>
            <p class="text-xs text-slate-500 mt-0.5">View-only materials list</p>
         </div>
         <button
           @click="toggleAllElements"
           class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
           :title="allElementsCollapsed ? 'Expand All' : 'Collapse All'"
         >
           <i class="mdi mdi-unfold-more-horizontal text-xl"></i>
         </button>
      </div>

      <!-- Excel-Style Elements Display -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-300 dark:border-slate-600 overflow-hidden shadow-lg">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-100 dark:bg-slate-700 border-b-2 border-slate-400 dark:border-slate-500">
                <th class="border-r border-slate-300 dark:border-slate-600 px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-10">#</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-3 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-16">Include</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider min-w-[250px]">Element / Material</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-32">Category</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-28">Unit</th>
                <th class="px-4 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-24">Quantity</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800">
              <template v-for="(element, elementIndex) in materialsData.projectElements" :key="element.id">
                <!-- Element Header Row -->
                <tr 
                  :class="[
                    'border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-colors',
                    element.isIncluded ? 'bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/40' : 'bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800'
                  ]"
                  @click="toggleElementCollapse(element.id)"
                >
                  <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900">
                    {{ elementIndex + 1 }}
                  </td>
                  <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-3 text-center" @click.stop>
                    <input
                      type="checkbox"
                      v-model="element.isIncluded"
                      class="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                      disabled
                    />
                  </td>
                  <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-3" colspan="3">
                    <div class="flex items-center gap-3">
                      <i class="mdi mdi-package-variant text-blue-500 text-lg"></i>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-bold text-slate-900 dark:text-white">{{ element.name }}</span>
                          <span :class="getElementCategoryClass(element.category)" class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {{ getElementCategoryLabel(element.category) }}
                          </span>
                        </div>
                        <div v-if="element.dimensions && (element.dimensions.length || element.dimensions.width || element.dimensions.height)" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span class="font-medium">Dimensions:</span>
                          <span v-if="element.dimensions.length">{{ element.dimensions.length }}mm</span>
                          <span v-if="element.dimensions.length && (element.dimensions.width || element.dimensions.height)"> × </span>
                          <span v-if="element.dimensions.width">{{ element.dimensions.width }}mm</span>
                          <span v-if="element.dimensions.width && element.dimensions.height"> × </span>
                          <span v-if="element.dimensions.height">{{ element.dimensions.height }}mm</span>
                        </div>
                      </div>
                      <span class="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {{ getIncludedMaterialsCount(element) }}/{{ element.materials.length }} materials
                      </span>
                      <i class="mdi mdi-chevron-down text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isElementCollapsed(element.id) }"></i>
                    </div>
                  </td>
                </tr>
                
                <!-- Material Rows (Excel-style) -->
                <template v-if="element.isIncluded && !isElementCollapsed(element.id)">
                  <tr 
                    v-for="(material, materialIndex) in element.materials" 
                    :key="material.id" 
                    class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    :class="!material.isIncluded ? 'opacity-50' : ''"
                  >
                    <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-2.5 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 font-mono">
                      {{ elementIndex + 1 }}.{{ materialIndex + 1 }}
                    </td>
                    <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-2.5 text-center bg-white dark:bg-slate-800">
                      <input
                        type="checkbox"
                        v-model="material.isIncluded"
                        class="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        disabled
                      />
                    </td>
                    <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800" :class="material.isIncluded ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400 dark:text-slate-500 line-through'">
                      <div class="flex items-center gap-2">
                        <i class="mdi mdi-circle-small text-slate-400"></i>
                        {{ material.description }}
                      </div>
                    </td>
                    <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                      <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-medium">Material</span>
                    </td>
                    <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800" :class="material.isIncluded ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'">
                      {{ material.unitOfMeasurement }}
                    </td>
                    <td class="px-4 py-2.5 text-center bg-blue-50/30 dark:bg-blue-950/20">
                      <span class="text-sm text-slate-700 dark:text-slate-300 font-mono font-medium">{{ material.quantity }}</span>
                    </td>
                  </tr>
                  
                  <!-- Empty state for element with no materials -->
                  <tr v-if="element.materials.length === 0" class="border-b border-slate-200 dark:border-slate-700">
                    <td colspan="6" class="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50/50 dark:bg-slate-900/50">
                      <i class="mdi mdi-information-outline text-lg mr-2"></i>
                      No materials defined for this element
                    </td>
                  </tr>
                </template>
                
                <!-- Collapsed state -->
                <tr v-else-if="element.isIncluded && isElementCollapsed(element.id)" class="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" @click="toggleElementCollapse(element.id)">
                  <td colspan="6" class="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <i class="mdi mdi-chevron-right mr-1"></i>
                    Click to expand {{ element.materials.length }} material{{ element.materials.length !== 1 ? 's' : '' }}
                  </td>
                </tr>
              </template>
              
              <!-- Empty state for no elements -->
              <tr v-if="materialsData.projectElements.length === 0" class="border-b border-slate-200 dark:border-slate-700">
                <td colspan="6" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <i class="mdi mdi-package-variant-closed text-3xl text-slate-400"></i>
                    </div>
                    <div>
                      <p class="text-base font-bold text-slate-700 dark:text-slate-300">No Elements</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">No materials have been defined for this project</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Materials Actions -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <!-- <button
          @click="$emit('edit-materials')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>Edit Materials</span>
        </button> -->

        <button
          @click="viewMaterialsList"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>View & Print List</span>
        </button>
      </div>

    </div>

    <!-- Task Status and Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex space-x-3">
        <button
          v-if="task.status === 'completed'"
          @click="$emit('edit-mode')"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>Enable Edit Mode</span>
        </button>

        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled'"
          @click="$emit('update-status', 'completed')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Mark Complete</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">Task Completed</span>
        </div>
      </div>
    </div>

    <!-- Materials List View Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Materials List - {{ materialsData.projectInfo.enquiryTitle }}
          </h3>
          <div class="flex items-center space-x-3">
            <button
              @click="printMaterialsList"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              <span>Print</span>
            </button>
            <button
              @click="closeViewModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Printable Content -->
        <div id="printable-materials-list" class="p-6 overflow-y-auto max-h-[calc(95vh-140px)] print:overflow-visible print:max-h-none">
          <!-- Project Header for Print -->
          <div class="mb-8 print:mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 print:text-black">
              Materials List
            </h1>

            <!-- Project Information -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg print:bg-white print:border print:border-gray-300">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Project Title</label>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.enquiryTitle }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Enquiry Number</label>
                  <p class="text-sm font-medium text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.projectId }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Client Name</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.clientName }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Event Venue</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ materialsData.projectInfo.eventVenue }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Expected Delivery Date</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ formatDate(materialsData.projectInfo.setupDate) }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Generated On</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">{{ formatDateTime(new Date()) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials by Element -->
          <div class="space-y-6 print:space-y-4">
            <div v-for="element in getIncludedElements()" :key="element.id" class="print:break-inside-avoid">
              <!-- Element Header -->
              <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-t-lg print:bg-gray-100 print:border print:border-gray-300">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white print:text-black">
                    {{ element.name }}
                  </h3>
                  <span :class="getElementCategoryClass(element.category)" class="text-xs px-2 py-1 rounded-full font-medium print:text-black print:border print:border-gray-400">
                    {{ getElementCategoryLabel(element.category) }}
                  </span>
                </div>
              </div>

              <!-- Materials Table -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-b-lg overflow-hidden print:border-gray-300">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 dark:bg-gray-600 print:bg-gray-50">
                    <tr>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Particulars</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Unit</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Quantity</th>
                      <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 print:text-black border-b print:border-gray-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="material in getIncludedMaterials(element)" :key="material.id" class="border-b border-gray-100 dark:border-gray-700 print:border-gray-200">
                      <td class="py-3 px-4 text-gray-900 dark:text-white print:text-black">{{ material.description }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black">{{ material.unitOfMeasurement }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black font-medium">{{ material.quantity }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black">{{ material.notes || '-' }}</td>
                    </tr>
                    <tr v-if="getIncludedMaterials(element).length === 0">
                      <td colspan="4" class="py-4 text-center text-gray-500 dark:text-gray-400 print:text-gray-600 italic">
                        No materials included for this element
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="getIncludedElements().length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400 print:text-gray-600 italic">
                No elements are currently included in this project
              </p>
            </div>
          </div>

          <!-- Summary Section -->
          <div v-if="getIncludedElements().length > 0" class="mt-8 print:mt-6 print:break-inside-avoid">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg print:bg-white print:border print:border-gray-300">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white print:text-black mb-3">Summary</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Total Elements</label>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black">{{ getIncludedElements().length }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Total Materials</label>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white print:text-black">{{ getTotalMaterialsCount() }}</p>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 print:text-gray-700">Prepared By</label>
                  <p class="text-sm text-gray-900 dark:text-white print:text-black">_________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'
import { MaterialsService } from '../../../services/materialsService'

/**
 * Props interface for the MaterialsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
}


/**
 * Core data structure for materials display
 */
interface MaterialsData {
  projectInfo: ProjectInfo
  projectElements: ProjectElement[]
  availableElements: ElementTemplate[]
}

interface ProjectInfo {
  projectId: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate: string
}

interface ProjectElement {
  id: string
  templateId: string
  elementType: string
  name: string
  category: 'production' | 'hire' | 'outsourced'
  dimensions: { length: string; width: string; height: string }
  isIncluded: boolean
  materials: MaterialItem[]
  notes?: string
  addedAt: Date
}

interface ElementTemplate {
  id: string
  name: string
  displayName: string
  description: string
  defaultMaterials: MaterialTemplate[]
  category: string
  color: string
  order: number
}

interface MaterialItem {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
  isIncluded: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface MaterialTemplate {
  id: string
  description: string
  unitOfMeasurement: string
  defaultQuantity: number
  isDefaultIncluded: boolean
  order: number
}


// Component setup
const props = defineProps<Props>()

/**
 * Initialize project information from the task/enquiry data
 * Auto-populates project details from the existing enquiry information
 */
const initializeProjectInfo = (): ProjectInfo => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.enquiry_number || `ENQ-01-2026-${String(props.task.id).padStart(3, '0')}`,
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'Unknown Client',
    eventVenue: enquiry?.venue || 'Venue TBC',
    setupDate: enquiry?.expected_delivery_date || 'Date TBC',
    setDownDate: 'TBC'
  }
}

/**
 * Load materials data from backend
 */
const loadMaterialsData = async () => {
  try {
    error.value = null
    isLoading.value = true

    // Fetch real data from backend API
    const data = await MaterialsService.getMaterialsData(props.task.id)
    Object.assign(materialsData, data)
    initializeCollapsedState()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load materials data'
    console.error('Failed to load materials data:', err)
    // Keep existing project info but clear elements
    materialsData.projectElements = []
    materialsData.availableElements = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Reactive materials data structure
 * Will be loaded from backend or initialized with project info only
 */
const materialsData = reactive<MaterialsData>({
  projectInfo: initializeProjectInfo(),
  projectElements: [],
  availableElements: []
})

// Loading and error states
const isLoading = ref(true)
const error = ref<string | null>(null)

/**
 * Watch for changes in the task prop and update project info accordingly
 * This ensures the component stays in sync if the task data is updated externally
 */
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      Object.assign(materialsData.projectInfo, initializeProjectInfo())
    }
  },
  { deep: true }
)

// View modal state
const isViewModalOpen = ref(false)

// Collapsed state for elements (initialize with all elements collapsed)
const collapsedElements = ref<Set<string>>(new Set())

/**
 * Initialize collapsed state with all elements collapsed by default
 */
const initializeCollapsedState = () => {
  const elementIds = materialsData.projectElements.map(element => element.id)
  collapsedElements.value = new Set(elementIds)
}

// Initialize all elements as collapsed by default
initializeCollapsedState()

// Load data on component mount
onMounted(() => {
  loadMaterialsData()
})


/**
 * Toggle collapsed state for an element
 */
const toggleElementCollapse = (elementId: string) => {
  if (collapsedElements.value.has(elementId)) {
    collapsedElements.value.delete(elementId)
  } else {
    collapsedElements.value.add(elementId)
  }
}

/**
 * Check if an element is collapsed
 */
const isElementCollapsed = (elementId: string): boolean => {
  return collapsedElements.value.has(elementId)
}

/**
 * Check if all elements are collapsed
 */
const allElementsCollapsed = computed(() => {
  return materialsData.projectElements.length > 0 &&
         materialsData.projectElements.every(element => collapsedElements.value.has(element.id))
})

/**
 * Toggle all elements collapsed/expanded
 */
const toggleAllElements = () => {
  if (allElementsCollapsed.value) {
    // Expand all
    collapsedElements.value.clear()
  } else {
    // Collapse all
    materialsData.projectElements.forEach(element => {
      collapsedElements.value.add(element.id)
    })
  }
}


// Note: Save functionality removed for read-only display component

// Note: Validation removed for read-only display component

/**
 * Get human-readable label for task status
 * @param status - The current task status
 * @returns Human-readable status label
 */
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}

/**
 * Get human-readable label for element category
 * @param category - The element category
 * @returns Human-readable category label
 */
const getElementCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    'production': 'Production',
    'hire': 'Items for Hire',
    'outsourced': 'Outsourced'
  }
  return labels[category] || category
}

/**
 * Get CSS classes for element category display
 * @param category - The element category
 * @returns CSS class string for category styling
 */
const getElementCategoryClass = (category: string): string => {
  const classes: Record<string, string> = {
    'production': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'hire': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'outsourced': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
  }
  return classes[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

/**
 * Format date string for display
 * @param dateString - ISO date string or 'Date TBC'
 * @returns Formatted date or original string if not a valid date
 */
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'Date TBC') {
    return 'Date TBC'
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

/**
 * Open the materials list view modal
 */
const viewMaterialsList = () => {
  isViewModalOpen.value = true
}

/**
 * Close the view modal
 */
const closeViewModal = () => {
  isViewModalOpen.value = false
}

/**
 * Print the materials list
 */
const printMaterialsList = () => {
  const printContent = document.getElementById('printable-materials-list')
  if (printContent) {
    const originalContent = document.body.innerHTML
    const printableContent = printContent.innerHTML

    document.body.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        ${printableContent}
      </div>
    `

    window.print()
    document.body.innerHTML = originalContent

    // Reload the page to restore Vue reactivity
    window.location.reload()
  }
}

/**
 * Get only included elements
 */
const getIncludedElements = (): ProjectElement[] => {
  return materialsData.projectElements.filter(element => element.isIncluded)
}

/**
 * Get only included materials for an element
 */
const getIncludedMaterials = (element: ProjectElement): MaterialItem[] => {
  return element.materials.filter(material => material.isIncluded)
}

/**
 * Get total count of included materials across all elements
 */
const getTotalMaterialsCount = (): number => {
  return getIncludedElements().reduce((total, element) => {
    return total + getIncludedMaterials(element).length
  }, 0)
}

/**
 * Format date and time for display
 */
const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Get the count of included materials for an element
 * @param element - The project element to count materials for
 * @returns Number of included materials
 */
const getIncludedMaterialsCount = (element: ProjectElement): number => {
  return element.materials.filter(material => material.isIncluded).length
}

/**
 * Get CSS classes for element header based on template
 * @param templateId - The template ID to get styling for
 * @returns CSS class string for element header styling
 */
const getElementHeaderClass = (templateId: string): string => {
  const template = materialsData.availableElements.find(t => t.id === templateId)
  const colorClasses: Record<string, string> = {
    'purple': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    'indigo': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    'blue': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'teal': 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200',
    'orange': 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    'gray': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  }
  return colorClasses[template?.color || 'gray'] || colorClasses.gray
}

/**
 * Get CSS classes for task status display
 * @param status - The current task status
 * @returns CSS class string for status styling
 */
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

/**
 * Get human-readable label for task status
 * @param status - The current task status
 * @returns Human-readable status label
 */
</script>
