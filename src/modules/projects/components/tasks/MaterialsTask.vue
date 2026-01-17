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
      <!-- Preview Mode Banner -->
      <div class="flex items-center space-x-4 mb-6" v-if="isPreviewingVersion">
        <div class="flex-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div>
              <h5 class="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Previewing: {{ previewingVersionLabel }}
              </h5>
              <p class="text-xs text-blue-600 dark:text-blue-300">
                You are viewing a snapshot. Changes made here will not be saved unless you restore this version.
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button  @click="exitPreview"
              class="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Exit Preview
            </button>
            <button 
              @click="restoreFromPreview"
              class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Restore This Version
            </button>
          </div>
        </div>
      </div>

      <!-- Premium Project Information Section -->
      <div class="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl p-8 border border-slate-100 dark:border-slate-800 mb-8 group">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <i class="mdi mdi-office-building text-2xl"></i>
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">Project Concept</h4>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{{ projectInfo.enquiryTitle }}</h2>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-6 pt-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-500">
                  <i class="mdi mdi-identifier"></i>
                </div>
                <div>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identifier</p>
                   <p class="text-sm font-black text-slate-700 dark:text-slate-200 tracking-tight">{{ projectInfo.projectId }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500">
                  <i class="mdi mdi-account-tie"></i>
                </div>
                <div>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stakeholder</p>
                   <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.clientName }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-500">
                  <i class="mdi mdi-map-marker"></i>
                </div>
                <div>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destinations</p>
                   <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.eventVenue }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Status/Highlights -->
          <div class="flex flex-col justify-between items-end gap-4 min-w-[200px]">
             <div class="text-right">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Timeline Alignment</p>
                <div class="px-4 py-2 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white font-black text-lg shadow-xl shadow-black/10 flex items-center gap-2">
                  <i class="mdi mdi-calendar-check text-blue-400"></i>
                  {{ formatDate(projectInfo.setupDate) }}
                </div>
             </div>
             
             <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Project Intelligence</span>
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
            <p class="text-xs text-slate-500 mt-0.5">Build your materials list by adding project elements</p>
         </div>
         <div class="flex items-center gap-3">
           <div class="flex items-center gap-2">
             <!-- Add Element Primary Action -->
             <button
               @click="openAddElementModal"
               class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
               :disabled="task.status === 'completed' && !isEditMode"
               :class="{ 'opacity-50 cursor-not-allowed': task.status === 'completed' && !isEditMode }"
               :title="task.status === 'completed' && !isEditMode ? 'Enable edit mode to add elements' : 'Add new element'"
             >
               <i class="mdi mdi-plus-circle text-lg"></i>
               <span>Add Element</span>
             </button>

             <!-- Toggle All (Icon Button) -->
             <button
               @click="toggleAllElements"
               class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
               :title="allElementsCollapsed ? 'Expand All' : 'Collapse All'"
             >
               <i class="mdi mdi-unfold-more-horizontal text-xl"></i>
             </button>

             <!-- Tools Dropdown -->
             <div class="relative" ref="toolsDropdownTarget">
               <button
                 @click="isToolsDropdownOpen = !isToolsDropdownOpen"
                 class="px-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
               >
                 <i class="mdi mdi-tools text-lg"></i>
                 <span>Tools</span>
                 <i class="mdi mdi-chevron-down text-sm" :class="{'rotate-180': isToolsDropdownOpen}"></i>
               </button>

               <!-- Dropdown Menu -->
               <div
                 v-if="isToolsDropdownOpen"
                 class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-slate-200 dark:border-gray-700 z-50 py-2 overflow-hidden"
               >
                 <div class="px-3 py-2 border-b border-slate-100 dark:border-gray-700">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Tools</span>
                 </div>
                 
                 <button
                   @click="downloadExcelTemplate(); isToolsDropdownOpen = false"
                   class="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                 >
                   <div class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                      <i class="mdi mdi-file-excel"></i>
                   </div>
                   <span>Download Template</span>
                 </button>

                 <button
                   @click="showExcelUploadModal = true; isToolsDropdownOpen = false"
                   class="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                   :disabled="task.status === 'completed' && !isEditMode"
                   :class="{ 'opacity-50 cursor-not-allowed': task.status === 'completed' && !isEditMode }"
                 >
                   <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <i class="mdi mdi-upload"></i>
                   </div>
                   <span>Upload Excel</span>
                 </button>
                 
                 <div class="border-t border-slate-100 dark:border-gray-700 my-2"></div>
                 
                 <div class="px-3 py-2 border-b border-slate-100 dark:border-gray-700">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Version Control</span>
                 </div>

                 <div class="px-3 py-2">
                    <CreateVersionButton
                     title="Material"
                     type="materials"
                     @create="handleCreateVersion"
                     class="w-full justify-start" 
                   />
                 </div>

                 <button
                   @click="showVersionHistory = true; isToolsDropdownOpen = false"
                   class="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                 >
                   <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <i class="mdi mdi-history"></i>
                   </div>
                   <span>Version History</span>
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>

      <!-- Elements Display - Excel Style -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-300 dark:border-slate-600 overflow-hidden shadow-lg">
        <!-- Excel-style continuous table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-100 dark:bg-slate-700 border-b-2 border-slate-400 dark:border-slate-500">
                <th class="border-r border-slate-300 dark:border-slate-600 px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-10">#</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-3 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-16">Include</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider min-w-[250px]">Element / Material</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-32">Category</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-28">Unit</th>
                <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-24">Quantity</th>
                <th class="px-3 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-24">Actions</th>
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
                    />
                  </td>
                  <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-3" colspan="4">
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
                    </div>
                  </td>
                  <td class="px-3 py-3 text-center" @click.stop>
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="openEditElementModal(element)"
                        class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        :title="'Edit Element'"
                        :disabled="task.status === 'completed' && !isEditMode"
                      >
                        <i class="mdi mdi-pencil text-sm"></i>
                      </button>
                      <button
                        @click="confirmDeleteElement(element)"
                        class="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        :title="'Delete Element'"
                        :disabled="task.status === 'completed' && !isEditMode"
                      >
                        <i class="mdi mdi-delete text-sm"></i>
                      </button>
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
                    <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2.5 text-center bg-blue-50/30 dark:bg-blue-950/20">
                      <input
                        v-if="material.isIncluded"
                        type="number"
                        v-model.number="material.quantity"
                        step="0.1"
                        min="0"
                        class="w-20 px-2 py-1.5 text-sm text-center border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      />
                      <span v-else class="text-sm text-slate-400 dark:text-slate-500 font-mono">{{ material.quantity }}</span>
                    </td>
                    <td class="px-3 py-2.5 text-center bg-white dark:bg-slate-800">
                      <!-- Future: Add material-level actions if needed -->
                    </td>
                  </tr>
                  
                  <!-- Empty state for element with no materials -->
                  <tr v-if="element.materials.length === 0" class="border-b border-slate-200 dark:border-slate-700">
                    <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50/50 dark:bg-slate-900/50">
                      <i class="mdi mdi-information-outline text-lg mr-2"></i>
                      No materials defined for this element. Click "Edit Element" to add materials.
                    </td>
                  </tr>
                </template>
                
                <!-- Collapsed state -->
                <tr v-else-if="element.isIncluded && isElementCollapsed(element.id)" class="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" @click="toggleElementCollapse(element.id)">
                  <td colspan="7" class="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <i class="mdi mdi-chevron-right mr-1"></i>
                    Click to expand {{ element.materials.length }} material{{ element.materials.length !== 1 ? 's' : '' }}
                  </td>
                </tr>
              </template>
              
              <!-- Empty state for no elements -->
              <tr v-if="materialsData.projectElements.length === 0" class="border-b border-slate-200 dark:border-slate-700">
                <td colspan="7" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <i class="mdi mdi-package-variant-closed text-3xl text-slate-400"></i>
                    </div>
                    <div>
                      <p class="text-base font-bold text-slate-700 dark:text-slate-300">No Elements Added</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Click "Add Element" above to start building your materials list</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Department Approvals Section -->
    <div class="mb-8 department-approvals-section">
      <div class="border-t border-gray-100 dark:border-gray-700 pt-4">
        <div 
          @click="showApprovals = !showApprovals" 
          class="flex items-center justify-between cursor-pointer mb-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded transition-colors"
        >
          <div class="flex items-center">
             <svg class="w-4 h-4 mr-2 text-gray-400 transform transition-transform duration-200" :class="{ 'rotate-180': !showApprovals }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
             <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Department Approvals</h3>
                <p v-if="showApprovals" class="text-sm text-gray-600 dark:text-gray-400">
                  All three departments must approve the materials list before budget can be created
                </p>
             </div>
          </div>
          <!-- Status Summary Badge when collapsed -->
          <div v-if="!showApprovals">
             <span v-if="approvalStatus.all_approved" class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">All Approved</span>
             <span v-else class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs border border-yellow-200">Pending Approvals</span>
          </div>
        </div>

        <div v-show="showApprovals">
          <!-- Overall Status Banner -->
          <div v-if="approvalStatus.all_approved" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                ✓ All departments approved. Budget import enabled.
              </span>
            </div>
          </div>
          <div v-else class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠ Pending approvals: {{ pendingDepartments.join(', ') }}
              </span>
            </div>
          </div>

          <!-- Approval Status Bar -->
          <div class="flex flex-col md:flex-row bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            <ApprovalCard
              class="flex-1 border-0 rounded-none shadow-none"
              department="design"
              title="Design"
              :approval-data="approvalStatus.design"
              :can-approve="canApproveForDepartment('design')"
              @approve="approveForDepartment('design', $event)"
            />
            <ApprovalCard
              class="flex-1 border-0 rounded-none shadow-none"
              department="production"
              title="Production"
              :approval-data="approvalStatus.production"
              :can-approve="canApproveForDepartment('production')"
              @approve="approveForDepartment('production', $event)"
            />
            <ApprovalCard
              class="flex-1 border-0 rounded-none shadow-none"
              department="project_officer"
              title="Project Officer"
              :approval-data="approvalStatus.project_officer"
              :can-approve="canApproveForDepartment('project_officer')"
              @approve="approveForDepartment('project_officer', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Materials Actions -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="saveMaterialsList"
          :disabled="isSaving"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          <span>{{ isSaving ? 'Saving...' : 'Save Materials List' }}</span>
        </button>

        <button
          @click="viewMaterialsList"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg transition-colors flex items-center space-x-2 border border-gray-300 dark:border-gray-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>View & Print List</span>
        </button>
      </div>

      <div v-if="lastSaved" class="text-xs text-gray-500 dark:text-gray-400">
        Last saved: {{ formatDateTime(lastSaved) }}
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div v-if="task.status === 'completed' && isEditMode" class="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span class="text-xs font-medium">Edit Mode</span>
        </div>
      </div>

      <div class="flex space-x-3">
        <!-- Edit Mode Toggle (only for completed tasks) -->
        <button
          v-if="task.status === 'completed' && !isEditMode"
          @click.prevent="toggleEditMode"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>Enable Edit Mode</span>
        </button>

        <button
          v-if="task.status === 'completed' && isEditMode"
          @click="toggleEditMode"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <span>Exit Edit Mode</span>
        </button>

        <!-- Mark Complete / Save Changes (for non-completed tasks or edit mode) -->
        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled'"
          @click="$emit('update-status', 'completed')"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Mark Complete</span>
        </button>

        <!-- Save Changes (for edit mode) -->
        <button
          v-if="task.status === 'completed' && isEditMode"
          @click="saveChanges"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Save Changes</span>
        </button>
        
        <!-- Skip Task (only for non-completed tasks) -->
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
          @click="showSkipModal = true"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Skip Task</span>
        </button>

        <button
          v-if="['skipped', 'completed'].includes(task.status)"
          @click="$emit('update-status', 'pending')"
          class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>{{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}</span>
        </button>

        <!-- Completed Indicator (only when task is completed and not in edit mode) -->
        <div v-if="task.status === 'completed' && !isEditMode" class="flex items-center space-x-2 text-green-600 dark:text-green-400">
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
              @click="downloadPDF"
              :disabled="isGeneratingPDF"
              class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg v-if="isGeneratingPDF" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>{{ isGeneratingPDF ? 'Generating PDF...' : 'Download PDF' }}</span>
            </button>
            <button
              @click="printMaterialsList"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
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

        <!-- Printable Content (Forced Light Mode for PDF) -->
        <div id="printable-materials-list" class="p-6 overflow-y-auto max-h-[calc(95vh-140px)] print:overflow-visible print:max-h-none bg-white text-black">
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

          <!-- Department Approvals Section -->
          <div class="mt-8 print:hidden">
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Department Approvals</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                All three departments must approve the materials list before budget can be created
              </p>

              <!-- Overall Status Banner -->
              <div v-if="approvalStatus.all_approved" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                    ✓ All departments approved. Budget import enabled.
                  </span>
                </div>
              </div>
              <div v-else class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    ⚠ Pending approvals: {{ pendingDepartments.join(', ') }}
                  </span>
                </div>
              </div>

              <!-- Approval Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ApprovalCard
                  department="design"
                  title="Design Team"
                  :approval-data="approvalStatus.design"
                  :can-approve="canApproveForDepartment('design')"
                  @approve="approveForDepartment('design', $event)"
                />
                <ApprovalCard
                  department="production"
                  title="Production"
                  :approval-data="approvalStatus.production"
                  :can-approve="canApproveForDepartment('production')"
                  @approve="approveForDepartment('production', $event)"
                />
                <ApprovalCard
                  department="project_officer"
                  title="Project Officer"
                  :approval-data="approvalStatus.project_officer"
                  :can-approve="canApproveForDepartment('project_officer')"
                  @approve="approveForDepartment('project_officer', $event)"
                />
              </div>
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

    <!-- Materials Modal -->
    <MaterialsModal
      :is-open="isModalOpen"
      :edit-element="editingElement"
      @close="closeModal"
      @add-element="addElement"
      @update-element="updateElement"
    />



    <!-- Version History Modal -->
    <VersionHistoryModal
      :is-open="showVersionHistory"
      :versions="materialVersions"
      :is-loading="versionsLoading"
      :error="versionsError"
      title="Material"
      type="materials"
      @close="showVersionHistory = false"
      @preview="handlePreviewVersion"
      @restore="handleRestoreVersion"
      @refresh="fetchVersions"
    />

    <!-- Excel Upload Modal -->
    <ExcelUploadModal
      :is-open="showExcelUploadModal"
      :task-id="props.task.id"
      @close="showExcelUploadModal = false"
      @success="handleExcelUploadSuccess"
    />
    </div>
    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Skip Task</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
            Please provide a reason for skipping this task. This will mark the task as complete.
        </p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            placeholder="Reason for skipping..."
        ></textarea>
        <div class="flex justify-end space-x-3">
            <button 
                @click="showSkipModal = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="handleSkipTask"
                :disabled="!skipReason.trim() || isSkipping"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
                {{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { jsPDF } from 'jspdf'
import { useAuth } from '@/composables/useAuth'
import { useVersioning } from '@/composables/useVersioning'
import type { EnquiryTask } from '../../types/enquiry'
import MaterialsModal from '../MaterialsModal.vue'
import VersionHistoryModal from '../shared/VersionHistoryModal.vue'
import CreateVersionButton from '../shared/CreateVersionButton.vue'
import ApprovalCard from './materials/ApprovalCard.vue'
import ExcelUploadModal from './materials/ExcelUploadModal.vue'
import { MaterialsService } from '../../services/materialsService'
import api from '@/plugins/axios'

// Skip Task Logic
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)
const successMessage = ref('')

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await api.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        emit('update-status', 'skipped') 
        showSkipModal.value = false
        successMessage.value = 'Task skipped successfully'
        
        // Clear modal state
        skipReason.value = ''
    } catch (err: any) {
        console.error('Skip task error:', err)
        error.value = err.response?.data?.message || 'Failed to skip task'
    } finally {
        isSkipping.value = false
    }
}

/**
 * Props interface for the MaterialsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Initial tab or section to focus */
  initialTab?: string | null
}

/**
 * Events emitted by the MaterialsTask component
 */
interface Emits {
   /** Emitted when task status needs to be updated */
   'update-status': [status: EnquiryTask['status']]
   /** Emitted when task is completed or skipped */
   'complete': []
}

/**
 * Core data structure for materials task management
 * Contains project information, elements list, and available element templates
 */
interface MaterialsTaskDataLocal {
  /** Project header information */
  projectInfo: ProjectInfo
  /** List of project elements (Stage, Backdrop, etc.) */
  projectElements: ProjectElement[]
  /** Available element templates that can be added to projects */
  availableElements: ElementTemplate[]
}

/**
 * Project information structure for the materials task
 * Contains essential project details displayed in the header section
 */
interface ProjectInfo {
  /** Unique project identifier */
  projectId: string
  /** Title/name of the enquiry/project */
  enquiryTitle: string
  /** Name of the client for this project */
  clientName: string
  /** Venue where the event will take place */
  eventVenue: string
  /** Date when project setup begins (ISO date string) */
  setupDate: string
  /** Date when project set down occurs (ISO date string or "tbc") */
  setDownDate: string
}

/**
 * Project element structure - represents a main element in the project
 * Each element contains multiple materials/components
 */
interface ProjectElement {
  /** Unique identifier for this project element instance */
  id: string
  /** Reference to the element template this is based on */
  templateId: string
  /** Element type identifier (e.g., 'stage', 'backdrop') */
  elementType: string
  /** Display name for this element in the project */
  name: string
  /** Element category for sourcing classification */
  category: 'production' | 'hire' | 'outsourced'
  /** Element dimensions */
  dimensions: {
    length: string
    width: string
    height: string
  }
  /** Whether this element is included in the current project */
  isIncluded: boolean
  /** List of materials/components for this element */
  materials: MaterialItem[]
  /** Custom notes for this element in this project */
  notes?: string
  /** Timestamp when added to project */
  addedAt: Date
}

/**
 * Element template structure - defines available elements that can be added to projects
 * Templates serve as blueprints for project elements
 */
interface ElementTemplate {
  /** Unique identifier for the template */
  id: string
  /** Template name (e.g., "Stage", "Backdrop") */
  name: string
  /** Display name shown in UI */
  displayName: string
  /** Description of what this element includes */
  description: string
  /** Default materials/components for this element */
  defaultMaterials: MaterialTemplate[]
  /** Category for grouping templates */
  category: string
  /** Color theme for styling */
  color: string
  /** Sort order for display */
  order: number
}

/**
 * Individual material item structure
 * Represents a specific material/component within an element
 */
interface MaterialItem {
  /** Unique identifier for the material item */
  id: string
  /** Linked material library ID */
  libraryMaterialId?: number | null
  /** Descriptive name or description of the material */
  description: string
  /** Unit of measurement (e.g., "Pcs", "Ltrs", "Mtrs", "sqm") */
  unitOfMeasurement: string
  /** Quantity required (supports decimal values) */
  quantity: number
  /** Unit cost of the material */
  unitCost?: number | null
  /** Whether this material is included in the current project */
  isIncluded: boolean
  /** Optional additional notes about the material */
  notes?: string
  /** Whether this material is additional */
  isAdditional?: boolean
  /** Timestamp when the material was created */
  createdAt: Date
  /** Timestamp when the material was last updated */
  updatedAt: Date
}

/**
 * Material template structure - defines default materials for element templates
 */
interface MaterialTemplate {
  /** Unique identifier for the material template */
  id: string
  /** Default description for this material */
  description: string
  /** Default unit of measurement */
  unitOfMeasurement: string
  /** Default quantity (can be customized per project) */
  defaultQuantity: number
  /** Whether this material is typically included by default */
  isDefaultIncluded: boolean
  /** Sort order within the element */
  order: number
}


/**
 * Common units of measurement available for materials
 * Provides standardized options with descriptive labels
 */
const COMMON_UNITS = [
  { value: 'Pcs', label: 'Pieces (Pcs)' },
  { value: 'Ltrs', label: 'Liters (Ltrs)' },
  { value: 'Mtrs', label: 'Meters (Mtrs)' },
  { value: 'sqm', label: 'Square Meters (sqm)' },
  { value: 'custom', label: 'Custom Unit' },
  { value: 'Pks', label: 'Packets (Pks)' },
  { value: 'Kgs', label: 'Kilograms (Kgs)' },
  
]

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Edit mode state for completed tasks
const isEditMode = ref(false)

/**
 * Computed project information prioritizing live enquiry data
 */
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || materialsData.projectInfo?.projectId || `ENQ-01-2026-${String(props.task.id).padStart(3, '0')}`,
    enquiryTitle: enquiry?.title || materialsData.projectInfo?.enquiryTitle || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || materialsData.projectInfo?.clientName || 'Unknown Client',
    eventVenue: enquiry?.venue || materialsData.projectInfo?.eventVenue || 'Venue TBC',
    setupDate: enquiry?.expected_delivery_date || materialsData.projectInfo?.setupDate || 'Date TBC',
    setDownDate: materialsData.projectInfo?.setDownDate || 'TBC'
  }
})

/**
 * Initialize project information from the task/enquiry data
 * Auto-populates project details from the existing enquiry information
 */
const initializeProjectInfo = (): ProjectInfo => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || `ENQ-01-2026-${String(props.task.id).padStart(3, '0')}`,
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
    const data = await MaterialsService.getMaterialsData(props.task.id)
    Object.assign(materialsData, data)
    initializeCollapsedState()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load materials data'
    console.error('Failed to load materials data:', err)
    // Keep existing project info but clear elements - no dummy data fallback
    materialsData.projectElements = []
    materialsData.availableElements = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Confirm and delete an element
 */
const confirmDeleteElement = async (element: ProjectElement) => {
  if (!confirm(`Are you sure you want to delete the element "${element.name}" and all its materials? This action cannot be undone.`)) {
    return
  }

  try {
    isLoading.value = true
    error.value = null
    
    const response = await api.delete(`/api/projects/tasks/${props.task.id}/materials/elements/${element.id}`)
    
    // Reload data to reflect changes
    await loadMaterialsData()

    // If approvals were reset, reload approval status
    if (response.data.approvals_reset) {
      await loadApprovalStatus()
      // Optional: Show a message that approvals were reset
      console.log('Approvals have been reset due to element deletion')
    }
    
    // Show success message (using console for now as per existing patterns, or could set a success state if available)
    console.log('Element deleted successfully')
  } catch (err: any) {
    console.error('Failed to delete element:', err)
    error.value = err.response?.data?.message || 'Failed to delete element'
  } finally {
    isLoading.value = false
  }
}

const isToolsDropdownOpen = ref(false)
const toolsDropdownTarget = ref(null)
const showProjectInfo = ref(false)  // Collapsed by default
const showApprovals = ref(false)    // Collapsed by default
onClickOutside(toolsDropdownTarget, () => isToolsDropdownOpen.value = false)

/**
 * Reactive materials data structure
 * Will be loaded from backend or initialized with project info only
 */
const materialsData = reactive<MaterialsTaskDataLocal>({
  projectInfo: initializeProjectInfo(),
  projectElements: [],
  availableElements: []
})

// Loading and error states
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)
const lastSaved = ref<Date | null>(null)

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

// Modal state management
const isModalOpen = ref(false)
const editingElement = ref<ProjectElement | null>(null)

// View modal state
const isViewModalOpen = ref(false)

// Version Management
const showVersionHistory = ref(false)
const {
  versions: materialVersions,
  isLoading: versionsLoading,
  error: versionsError,
  fetchVersions,
  createVersion,
  restoreVersion,
} = useVersioning(computed(() => props.task.id), 'materials')

// Preview Mode State
const isPreviewingVersion = ref(false)
const previewingVersionLabel = ref('')
const previewingVersionId = ref<number | null>(null)
const originalMaterialsData = ref<any>(null)

// Excel Upload Modal State
const showExcelUploadModal = ref(false)

// Collapsed state for elements (initialize with all elements collapsed)
const collapsedElements = ref<Set<string>>(new Set())

/**
 * Initialize collapsed state with all elements collapsed by default
 */
const initializeCollapsedState = () => {
  const elementIds = materialsData.projectElements.map(element => element.id)
  // By default, we want all panels EXPANDED, so we start with an empty set of collapsed IDs
  collapsedElements.value = new Set()
}

// Initialize - elements will be expanded by default
initializeCollapsedState()

// Approval state management
interface ApprovalDepartmentData {
  approved: boolean
  approved_by?: number | null
  approved_by_name?: string | null
  approved_at?: string | null
  comments?: string
}

interface ApprovalStatus {
  design: ApprovalDepartmentData
  production: ApprovalDepartmentData
  project_officer: ApprovalDepartmentData
  all_approved: boolean
  last_approval_at?: string | null
}

const approvalStatus = ref<ApprovalStatus>({
  design: { approved: false, approved_by: null, approved_by_name: null, approved_at: null, comments: '' },
  production: {approved: false, approved_by: null, approved_by_name: null, approved_at: null, comments: '' },
  project_officer: { approved: false, approved_by: null, approved_by_name: null, approved_at: null, comments: '' },
  all_approved: false,
  last_approval_at: null
})

// Computed: Pending departments
const pendingDepartments = computed(() => {
  const pending: string[] = []
  if (!approvalStatus.value?.design?.approved) pending.push('Design')
  if (!approvalStatus.value?.production?.approved) pending.push('Production')
  if (!approvalStatus.value?.project_officer?.approved) pending.push('Project Officer')
  return pending
})

// Load approval status from backend
const loadApprovalStatus = async () => {
  try {
    const response = await api.get(`/api/projects/tasks/${props.task.id}/materials/approval-status`)
    approvalStatus.value = response.data.approval_status
  } catch (err) {
    console.error('Failed to load approval status:', err)
  }
}

// Check if current user can approve for a department
const canApproveForDepartment = (department: 'design' | 'production' | 'project_officer'): boolean => {
  // Get user roles from useAuth composable
  const { user } = useAuth()
  
  // Ensure user.value is available
  if (!user.value) {
    console.warn('User not found in auth store')
    return false
  }
 
  // Extract roles - handle both array of strings (from fetchUser) and array of objects (if structure differs)
  const userRoles = (user.value.roles || []).map((r: any) => {
    if (typeof r === 'string') return r.toLowerCase()
    return r.name?.toLowerCase()
  })
  
  const roleMap: Record<string, string[]> = {
    design: ['designer', 'design_lead', 'creative_director', 'design manager', 'admin', 'superadmin', 'super-admin', 'super admin', 'design'],
    production: ['production', 'production_manager', 'production manager', 'operations_manager', 'operations manager', 'admin', 'superadmin', 'super-admin', 'super admin'],
    project_officer: ['project officer', 'project_officer', 'project manager', 'project_manager', 'admin', 'superadmin', 'super-admin', 'super admin']
  }

  console.log('Debug Roles:', { 
    userEmail: user.value.email,
    userRoles, 
    department, 
    checkingFor: roleMap[department],
    hasPermission: (roleMap[department] || []).some(role => userRoles.includes(role.toLowerCase()))
  })
  
  const allowedRoles = roleMap[department] || []
  return allowedRoles.some(role => userRoles.includes(role.toLowerCase()))
}

// Approve materials for a department
const approveForDepartment = async (department: 'design' | 'production' | 'project_officer', comments: string) => {
  try {
    const response = await api.post(`/api/projects/tasks/${props.task.id}/materials/approve/${department}`, { comments })
    approvalStatus.value = response.data.approval_status
    console.log(`${department} approval recorded successfully`)
  } catch (err: any) {
    console.error(`Failed to approve for ${department}:`, err)
    error.value = err.response?.data?.message || `Failed to approve for ${department}`
  }
}

// Load data on component mount
onMounted(() => {
  loadMaterialsData()
  loadApprovalStatus()

  // Handle initial tab navigation
  if (props.initialTab === 'approvals') {
    showApprovals.value = true
    // Scroll to approvals section
    setTimeout(() => {
      const approvalsSection = document.querySelector('.department-approvals-section')
      if (approvalsSection) {
        approvalsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 500)
  }
})

// Version Management Handlers
const handleCreateVersion = async (label: string | undefined) => {
  try {
    const response = await createVersion(label)
    alert(response.message || 'Version created successfully')
  } catch (error) {
    console.error('Failed to create version:', error)
    alert('Failed to create version. Please try again.')
  }
}

const handleRestoreVersion = async (versionId: number) => {
  try {
    const response = await restoreVersion(versionId)
    
    // Show warnings if any
    if (response.warning) {
      alert(`⚠️ ${response.warning}`)
    }
    
    if (response.approvals_reset) {
      alert('✅ Version restored! Note: All approvals have been reset to draft.')
    } else {
      alert('✅ Version restored successfully!')
    }
    
    // Reload materials data
    await loadMaterialsData()
    await loadApprovalStatus()
    showVersionHistory.value = false
  } catch (error) {
    console.error('Failed to restore version:', error)
    alert('Failed to restore version. Please try again.')
  }
}

// Preview Mode Handlers
const handlePreviewVersion = async (version: any) => {
  // Save original data
  originalMaterialsData.value = JSON.parse(JSON.stringify(materialsData))
  
  // Load version data into the view
  if (version.data) {
    Object.assign(materialsData, version.data)
    initializeCollapsedState()
  }
  
  // Set preview mode
  isPreviewingVersion.value = true
  previewingVersionLabel.value = version.label
  previewingVersionId.value = version.id
}

const exitPreview = async () => {
  // Restore original data
  if (originalMaterialsData.value) {
    Object.assign(materialsData, originalMaterialsData.value)
    initializeCollapsedState()
  } else {
    // Fallback: reload from server
    await loadMaterialsData()
  }
  
  // Exit preview mode
  isPreviewingVersion.value = false
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
  originalMaterialsData.value = null
}

const restoreFromPreview = async () => {
  if (!previewingVersionId.value) return
  
  // Exit preview first
  isPreviewingVersion.value = false
  
  // Then restore the version
  await handleRestoreVersion(previewingVersionId.value)
  
  // Clean up
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
  originalMaterialsData.value = null
}

/**
 * Open the modal for adding a new element
 */
const openAddElementModal = () => {
  editingElement.value = null
  isModalOpen.value = true
}

/**
 * Open the modal for editing an existing element
 */
const openEditElementModal = (element: ProjectElement) => {
  editingElement.value = element
  isModalOpen.value = true
}

/**
 * Close the modal
 */
const closeModal = () => {
  isModalOpen.value = false
  editingElement.value = null
}

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

/**
 * Add a new element to the project
 */
const addElement = (element: ProjectElement) => {
  materialsData.projectElements.push(element)
  // Collapse new element by default
  collapsedElements.value.add(element.id)
  // Auto-save to backend when element is added
  saveMaterialsList()
}

/**
 * Update an existing element in the project
 */
const updateElement = (updatedElement: ProjectElement) => {
  const index = materialsData.projectElements.findIndex(el => el.id === updatedElement.id)
  if (index !== -1) {
    materialsData.projectElements[index] = updatedElement
    // Auto-save to backend when element is updated
    saveMaterialsList()
  }
}

/**
 * Add additional materials to existing elements or create new elements
 * This allows users to continue editing materials even after saving
 */
const addAdditionalMaterials = () => {
  // Open modal for adding new elements or editing existing ones
  // This allows users to add more materials even after saving
  openAddElementModal()
}

/**
 * Toggle edit mode for completed tasks
 * Allows editing of materials even when task is marked complete
 */
const toggleEditMode = () => {
  console.log('toggleEditMode called, current isEditMode:', isEditMode.value)
  isEditMode.value = !isEditMode.value
  console.log('toggleEditMode complete, new isEditMode:', isEditMode.value)
}

/**
 * Save changes and exit edit mode
 */
const saveChanges = async () => {
  await saveMaterialsList()
  // Only exit edit mode if save was successful (no error)
  if (!error.value) {
    isEditMode.value = false
  }
}

/**
 * Save the materials list
 */
const saveMaterialsList = async () => {
  isSaving.value = true
  try {
    error.value = null

    // Validate data before submission
    if (!validateMaterialsData()) {
      return
    }

    const savedData = await MaterialsService.saveMaterialsData(props.task.id, materialsData)
    Object.assign(materialsData, savedData)
    lastSaved.value = new Date()
    console.log('Materials list saved successfully')
  } catch (err: any) {
    // Handle different types of errors
    if (err.response?.status === 422) {
      // Validation errors from backend
      error.value = 'Validation failed: ' + (err.response.data.errors ?
        Object.values(err.response.data.errors).flat().join(', ') :
        err.response.data.message)
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      // Authentication/authorization errors
      error.value = 'Authentication failed. Please log in again.'
    } else if (err.message && err.message.includes('Validation failed')) {
      // Frontend validation errors
      error.value = err.message
    } else {
      // Network or other errors
      error.value = err.response?.data?.message || err.message || 'Failed to save materials list'
    }
    console.error('Failed to save materials list:', err)
  } finally {
    isSaving.value = false
  }
}

/**
 * Validate materials data before submission
 */
const validateMaterialsData = (): boolean => {
  const errors: string[] = []

  // Check if there are any elements
  if (!materialsData.projectElements || materialsData.projectElements.length === 0) {
    errors.push('At least one project element is required')
  }

  // Validate each element
  materialsData.projectElements.forEach((element, index) => {
    if (!element.elementType) {
      errors.push(`Element ${index + 1}: Element type is required`)
    }
    if (!element.name?.trim()) {
      errors.push(`Element ${index + 1}: Element name is required`)
    }
    if (!['production', 'hire', 'outsourced'].includes(element.category)) {
      errors.push(`Element ${index + 1}: Invalid category`)
    }

    // Validate materials
    if (!element.materials || element.materials.length === 0) {
      errors.push(`Element ${index + 1}: At least one material is required`)
    } else {
      element.materials.forEach((material, materialIndex) => {
        if (!material.description?.trim()) {
          errors.push(`Element ${index + 1}, Material ${materialIndex + 1}: Description is required`)
        }
        if (!material.unitOfMeasurement) {
          errors.push(`Element ${index + 1}, Material ${materialIndex + 1}: Unit of measurement is required`)
        }
        if (typeof material.quantity !== 'number' || material.quantity < 0) {
          errors.push(`Element ${index + 1}, Material ${materialIndex + 1}: Valid quantity is required`)
        }
      })
    }
  })

  if (errors.length > 0) {
    error.value = 'Validation failed: ' + errors.join('; ')
    return false
  }

  return true
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
 * Uses vibrant gradient colors matching Procurement Task design
 * @param templateId - The template ID to get styling for
 * @returns CSS class string for element header styling
 */
const getElementHeaderClass = (templateId: string): string => {
  const template = materialsData.availableElements.find(t => t.id === templateId)
  const elementName = template?.name?.toUpperCase() || ''
  
  // Dynamic color mapping based on element name (matching Procurement Task)
  const elementColors: Record<string, string> = {
    'STAGE': 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
    'BACKDROP': 'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
    'LIGHTING': 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white',
    'SOUND': 'bg-gradient-to-r from-orange-600 to-orange-700 text-white',
    'FURNITURE': 'bg-gradient-to-r from-red-600 to-red-700 text-white',
    'DECOR': 'bg-gradient-to-r from-pink-600 to-pink-700 text-white',
    'SIGNAGE': 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white',
    'BOOTH': 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white'
  }
  
  // Check if element name contains any of the keywords
  for (const [key, color] of Object.entries(elementColors)) {
    if (elementName.includes(key)) {
      return color
    }
  }
  
  // Default gradient if no match found
  return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
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
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

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
    'production': 'bg-teal-100 text-teal-800',
    'hire': 'bg-blue-100 text-blue-800',
    'outsourced': 'bg-orange-100 text-orange-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

/**
 * Download Excel template for materials upload
 * Triggers download of a pre-formatted Excel file with instructions and sample data
 */
const downloadExcelTemplate = async () => {
  try {
    const response = await api.get(
      `/api/projects/tasks/${props.task.id}/materials/template/download`,
      {
        responseType: 'blob' // Important for file downloads
      }
    )
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Extract filename from response headers or use default
    const contentDisposition = response.headers['content-disposition']
    let filename = `Materials_Template_${props.task.enquiry?.enquiry_number || 'TASK' + props.task.id}_${new Date().toISOString().split('T')[0]}.xlsx`
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    console.log('Excel template downloaded successfully')
  } catch (err: any) {
    console.error('Failed to download Excel template:', err)
    error.value = err.response?.data?.message || 'Failed to download template. Please try again.'
  }
}

/**
 * Handle successful Excel upload
 * Reloads materials data from backend after import
 */
const handleExcelUploadSuccess = async (result: any) => {
  console.log('Excel import successful:', result)
  
  // Show success message
  showExcelUploadModal.value = false
  
  // Reload materials data to reflect the imported items
  await loadMaterialsData()
  await loadApprovalStatus()
  
  // Show success notification
  alert('✅ Materials imported successfully!')
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
 * Download the materials list as a PDF
 * Uses jsPDF to generate a PDF from the printable content
 */
const isGeneratingPDF = ref(false)
const downloadPDF = async () => {
  const element = document.getElementById('printable-materials-list')
  if (!element) return

  isGeneratingPDF.value = true
  
  // Temporarily disable dark mode for capture
  const isDark = document.documentElement.classList.contains('dark')
  if (isDark) {
    document.documentElement.classList.remove('dark')
  }

  try {
    // Create new PDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Generate PDF from HTML
    await doc.html(element, {
      callback: function (doc) {
        doc.save(`Materials-List-${materialsData.projectInfo.projectId}.pdf`)
        // Restore dark mode immediately after save if needed, although finally block covers it
      },
      x: 10,
      y: 10,
      width: 190, // A4 width (210) - 20mm margin
      windowWidth: 1200 // Force desktop width for rendering
    })
    
    console.log('PDF generated successfully')
  } catch (err) {
    console.error('Failed to generate PDF:', err)
    alert('Failed to generate PDF. Please try using the Print button and "Save as PDF".')
  } finally {
    // Restore dark mode
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
    isGeneratingPDF.value = false
  }
}

</script>

<style>
@media print {
  @page {
    margin: 1in;
    size: A4;
  }

  body {
    font-size: 12pt;
    line-height: 1.4;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:block {
    display: block !important;
  }

  .print\:break-inside-avoid {
    break-inside: avoid;
  }

  .print\:break-after-page {
    break-after: page;
  }

  table {
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f5f5f5 !important;
    font-weight: bold;
  }
}
</style>
