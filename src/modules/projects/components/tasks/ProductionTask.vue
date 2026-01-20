<template>
  <div class="production-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Project Header Section -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Production Task - {{ task.title }}
      </h4>

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
    </div>

    <!-- Tab Navigation -->
    <div class="relative z-20">
      <nav class="flex space-x-1 px-1" aria-label="Tabs">
        <button
          @click="activeTab = 'production-management'"
          :class="[
            activeTab === 'production-management'
              ? 'bg-blue-600 text-white shadow-[0_-4px_15px_-3px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50'
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 translate-y-1',
            'group flex items-center justify-center py-4 px-8 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 min-w-[160px] relative'
          ]"
        >
          <i class="mdi mdi-factory mr-2 text-xl transition-transform group-hover:scale-110" :class="activeTab === 'production-management' ? 'text-white' : 'text-blue-500'"></i>
          <span>Fabrication</span>
          <div v-if="activeTab === 'production-management'" class="absolute -bottom-[2px] left-0 w-full h-[3px] bg-blue-600 z-30"></div>
        </button>

        <button
          @click="activeTab = 'quality'"
          :class="[
            activeTab === 'quality'
              ? 'bg-blue-600 text-white shadow-[0_-4px_15px_-3px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50'
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 translate-y-1',
            'group flex items-center justify-center py-4 px-8 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 min-w-[160px] relative'
          ]"
        >
          <i class="mdi mdi-shield-check mr-2 text-xl transition-transform group-hover:scale-110" :class="activeTab === 'quality' ? 'text-white' : 'text-emerald-500'"></i>
          <span>QA Checks</span>
          <div v-if="activeTab === 'quality'" class="absolute -bottom-[2px] left-0 w-full h-[3px] bg-blue-600 z-30"></div>
        </button>

        <button
          @click="activeTab = 'design'"
          :class="[
            activeTab === 'design'
              ? 'bg-blue-600 text-white shadow-[0_-4px_15px_-3px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50'
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 translate-y-1',
            'group flex items-center justify-center py-4 px-8 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 min-w-[160px] relative'
          ]"
        >
          <i class="mdi mdi-palette-swatch mr-2 text-xl transition-transform group-hover:scale-110" :class="activeTab === 'design' ? 'text-white' : 'text-indigo-500'"></i>
          <span>Designs</span>
          <div v-if="activeTab === 'design'" class="absolute -bottom-[2px] left-0 w-full h-[3px] bg-blue-600 z-30"></div>
        </button>

        <button
          @click="activeTab = 'issues'"
          :class="[
            activeTab === 'issues'
              ? 'bg-blue-600 text-white shadow-[0_-4px_15px_-3px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50'
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 translate-y-1',
            'group flex items-center justify-center py-4 px-8 rounded-t-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 min-w-[160px] relative'
          ]"
        >
          <i class="mdi mdi-alert-octagon mr-2 text-xl transition-transform group-hover:scale-110" :class="activeTab === 'issues' ? 'text-white' : 'text-rose-500'"></i>
          <span>Issues</span>
          <span v-if="getTabBadgeCount('issues') > 0" class="ml-2 bg-white text-blue-600 py-0.5 px-2 rounded-full text-[10px] font-black shadow-sm">
            {{ getTabBadgeCount('issues') }}
          </span>
          <div v-if="activeTab === 'issues'" class="absolute -bottom-[2px] left-0 w-full h-[3px] bg-blue-600 z-30"></div>
        </button>
      </nav>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container relative z-10 bg-white dark:bg-slate-800 border-2 border-blue-600 rounded-b-3xl rounded-tr-3xl shadow-2xl shadow-blue-500/5 p-8 -mt-[2px]">
      <!-- Production Management Tab -->
      <div
        v-show="activeTab === 'production-management'"
        class="tab-panel animate-fade-in"
      >


        <div v-if="productionData.productionElements.length > 0" class="space-y-6">
           <div v-for="category in categoriesWithElements" :key="category.id" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <!-- Category Header -->
              <div 
                 class="px-6 py-5 cursor-pointer flex justify-between items-center transition-all"
                 :class="[
                    isCategoryCollapsed(category.id) ? 'bg-slate-50 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-800',
                 ]"
                 @click="toggleCategoryCollapse(category.id)"
              >
                  <div class="flex items-center gap-5">
                     <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg text-xl" :class="getCategoryBgClass(category.id)">
                        <i class="mdi mdi-layers-triple"></i>
                     </div>
                     <div>
                        <h3 class="text-lg font-black text-slate-900 dark:text-white leading-none">{{ category.displayName }}</h3>
                        <div class="flex items-center gap-3 mt-2">
                           <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">{{ getElementsByCategory(category.id).length }} Fabrication Units</span>
                           <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                           <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">{{ getCategoryTotalQuantity(category.id) }} Total Quantity</span>
                        </div>
                     </div>
                  </div>
                  <div class="flex items-center gap-4">
                     <div v-if="isCategoryCollapsed(category.id)" class="hidden sm:flex -space-x-2">
                        <div v-for="n in Math.min(3, getElementsByCategory(category.id).length)" :key="n" class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                           {{ getElementsByCategory(category.id)[n-1].name.substring(0,2).toUpperCase() }}
                        </div>
                     </div>
                     <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-sm">
                        <i 
                           class="mdi mdi-chevron-down text-xl text-slate-400 transition-transform duration-500"
                           :class="{ 'rotate-180': !isCategoryCollapsed(category.id) }"
                        ></i>
                     </div>
                  </div>
              </div>

              <!-- Modern Production Table -->
              <div v-if="isCategoryExpanded(category.id)" class="border-t border-slate-100 dark:border-slate-700 overflow-x-auto">
                 <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-700/50">
                    <thead class="bg-slate-50/50 dark:bg-slate-900/30">
                       <tr>
                          <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                       <tr v-for="element in getElementsByCategory(category.id)" :key="element.id" class="hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors group">
                          <!-- Item Identity -->
                          <td class="px-6 py-5">
                             <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200/50 dark:border-slate-600/50">
                                   <i class="mdi mdi-cube-send text-xl"></i>
                                </div>
                                <div class="flex flex-col min-w-0">
                                   <span class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ element.name || element.description }}</span>
                                   <div class="flex items-center gap-2 mt-1">
                                      <span class="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800 uppercase tracking-tighter">
                                         Qty: {{ element.quantity }} {{ element.unitOfMeasurement || element.unit }} REQUIRED
                                      </span>
                                   </div>
                                </div>
                             </div>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <!-- Premium Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <div class="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-8 relative rotate-3 hover:rotate-0 transition-transform duration-500">
              <i class="mdi mdi-factory text-5xl text-blue-500"></i>
              <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-800">
                 <i class="mdi mdi-plus text-xl"></i>
              </div>
           </div>
           
           <div class="text-center max-w-lg px-8">
              <h3 class="text-3xl font-black text-slate-800 dark:text-white mb-4">Initialize Fabrication Line</h3>
              <p class="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed text-lg">
                 Load your validated material bill from the <strong>Materials Task</strong> to begin tracking production progress, quality checkpoints, and assembly readiness.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                   @click="retryMaterialsImport"
                   class="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                   <i class="mdi mdi-import text-lg"></i>
                   Sync Materials
                 </button>
                 <button
                   class="px-10 py-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                 >
                   <i class="mdi mdi-help-circle-outline text-lg"></i>
                   Learn More
                 </button>
              </div>
              
              <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-left">
                 <div class="flex gap-3">
                    <i class="mdi mdi-shield-check text-blue-500"></i>
                    <p class="text-[10px] font-bold text-slate-400 uppercase leading-snug">Automated QC Point generation</p>
                 </div>
                 <div class="flex gap-3">
                    <i class="mdi mdi-truck-fast text-emerald-500"></i>
                    <p class="text-[10px] font-bold text-slate-400 uppercase leading-snug">Real-time Procurement Sync</p>
                 </div>
              </div>
           </div>
        </div>
      </div>


      <div
        v-show="activeTab === 'quality'"
        class="quality-control-section tab-panel"
        :id="`tab-panel-quality`"
        role="tabpanel"
        :aria-labelledby="`tab-quality`"
        :class="{ 'animate-fade-in': activeTab === 'quality' }"
      >
         <!-- Quality Control Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
          <div class="flex items-center gap-4">
             <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <i class="mdi mdi-check-decagram text-3xl"></i>
             </div>
             <div>
                <h4 class="text-xl font-black text-slate-900 dark:text-white leading-tight">Quality Assurance</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Project integrity & fabrication standards monitoring
                </p>
             </div>
          </div>
          
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button
              v-if="!isReadOnly"
              @click="generateQualityCheckpoints"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all"
            >
              <i class="mdi mdi-refresh"></i>
              Regenerate
            </button>
            <button
              @click="exportQualityReport"
              class="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
            >
              <i class="mdi mdi-file-export-outline"></i>
              QA Report
            </button>
          </div>
        </div>

        <!-- Quality Control Summary -->
        <div v-if="productionData.qualityControl.length > 0" class="mb-10">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Scope -->
            

            

            
            
          </div>

          <!-- Overall Progress Bar Detailed -->
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative">
             <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <i class="mdi mdi-shield-check text-8xl"></i>
             </div>
             <div class="relative z-10">
                <div class="flex justify-between items-center mb-4">
                  <div>
                    <span class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider block">Quality Audit Progress</span>
                    <span class="text-xs text-slate-500">System validates fabrication against project design specifications</span>
                  </div>
                  <div class="text-right">
                    <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ qualityProgressPercentage }}%</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-tighter">Certified Finish</span>
                  </div>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-4 overflow-hidden p-1 shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                  <div
                    class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    :class="qualityProgressPercentage === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500'"
                    :style="{ width: qualityProgressPercentage + '%' }"
                  >
                     <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                     <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div class="flex justify-between mt-3 px-1">
                   <span class="text-[10px] font-bold text-slate-400 uppercase">Project Initiation</span>
                   <span class="text-[10px] font-bold text-emerald-500 uppercase">Ready for Setup</span>
                </div>
             </div>
          </div>
        </div>

         <!-- Quality Control Checkpoints -->
        <div v-if="productionData.qualityControl.length > 0" class="space-y-6">
          <div
            v-for="checkpoint in productionData.qualityControl"
            :key="checkpoint.id"
            class="group bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden"
            :class="[
              isCheckpointDetailsExpanded(checkpoint.id) ? 'shadow-xl ring-2 ring-blue-500/20 border-blue-200 dark:border-blue-800' : 'shadow-sm border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600',
              checkpoint.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
            ]"
          >
            <!-- Checkpoint Row -->
            <div class="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <div class="flex items-start gap-4 flex-1">
                  <!-- Status Circle -->
                  <div 
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner"
                    :class="[
                      checkpoint.status === 'passed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 
                      checkpoint.status === 'failed' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 animate-pulse' :
                      checkpoint.status === 'in_progress' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' :
                      'bg-slate-50 text-slate-400 dark:bg-slate-900/30'
                    ]"
                  >
                    <i :class="getQualityStatusIconMdi(checkpoint.status)"></i>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 class="font-bold text-slate-900 dark:text-white truncate">{{ checkpoint.categoryName }}</h4>
                        <span 
                          v-if="checkpoint.priority === 'high'" 
                          class="px-2 py-0.5 text-[9px] font-black bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full uppercase tracking-tighter border border-red-200 dark:border-red-800"
                        >
                          Critical
                        </span>
                        <div class="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                           <span class="w-1.5 h-1.5 rounded-full" :class="checkpoint.status === 'passed' ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                           <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{{ checkpoint.status.replace('_', ' ') }}</span>
                        </div>
                     </div>
                     
                     <div class="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span class="flex items-center gap-1">
                          <i class="mdi mdi-layers-outline"></i>
                          {{ checkpoint.elementCount }} Items
                        </span>
                        <span class="flex items-center gap-1" v-if="checkpoint.checklist">
                          <i class="mdi mdi-check-all"></i>
                          {{ checkpoint.checklist.filter(i => i.checked).length }}/{{ checkpoint.checklist.length }} Tasks
                        </span>
                        <span class="flex items-center gap-1" v-if="checkpoint.qualityScore">
                           <i class="mdi mdi-star-outline"></i>
                           {{ checkpoint.qualityScore }}% Quality
                        </span>
                     </div>
                  </div>
               </div>

               <!-- Row Actions -->
               <div class="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-700">
                  <div class="hidden md:flex flex-col items-end mr-2 text-right">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ownership</span>
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ checkpoint.checkedBy || 'Unassigned' }}</span>
                  </div>

                  <button 
                    v-if="!isReadOnly && checkpoint.status !== 'passed'"
                    @click="fastPassCheckpoint(checkpoint.id)"
                    class="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    title="Quick Approve"
                  >
                    <i class="mdi mdi-check-all text-sm"></i>
                    <span class="sm:hidden lg:inline">Quick Pass</span>
                  </button>

                  <button 
                    @click="toggleCheckpointDetails(checkpoint.id)"
                    class="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white transition-all shadow-inner"
                    :class="{ 'bg-blue-600 text-white': isCheckpointDetailsExpanded(checkpoint.id) }"
                  >
                    <i class="mdi" :class="isCheckpointDetailsExpanded(checkpoint.id) ? 'mdi-chevron-up' : 'mdi-cog-outline'"></i>
                  </button>
               </div>
            </div>

            <!-- Detailed Panel -->
            <div v-if="isCheckpointDetailsExpanded(checkpoint.id)" class="px-5 pb-5 animate-fade-in-down border-t border-slate-100 dark:border-slate-700 pt-5 bg-slate-50/50 dark:bg-slate-900/20">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Checklist Side -->
                <div>
                   <div class="flex items-center justify-between mb-4">
                      <h5 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                         <i class="mdi mdi-format-list-checks text-blue-500"></i>
                         Verification Checklist
                      </h5>
                      <span class="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">MUST COMPLETE ALL</span>
                   </div>
                   
                   <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      <div 
                        v-for="item in checkpoint.checklist" 
                        :key="item.id"
                        class="group/item flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer"
                        :class="item.checked ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/50' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'"
                        @click="item.checked = !item.checked; updateChecklistItem(checkpoint.id, item.id, item.checked)"
                      >
                         <div 
                           class="w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2"
                           :class="item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-600 group-hover/item:border-blue-400'"
                         >
                            <i v-if="item.checked" class="mdi mdi-check text-sm"></i>
                         </div>
                         <span class="text-sm font-medium transition-all" :class="item.checked ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-700 dark:text-slate-300'">
                           {{ item.label }}
                         </span>
                      </div>
                   </div>
                </div>

                <!-- Controls Side -->
                <div class="space-y-6">
                   <!-- Final Verdict -->
                   <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Audit Outcome</label>
                      <div class="flex gap-2">
                        <button 
                          v-for="status in (['pending', 'in_progress', 'passed', 'failed'] as const)"
                          :key="status"
                          @click="updateQualityStatus(checkpoint.id, status as any)"
                          class="flex-1 py-3 rounded-xl border-2 transition-all font-bold text-[10px] uppercase flex flex-col items-center gap-1"
                          :class="[
                            checkpoint.status === status ? 
                            (status === 'passed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                             status === 'failed' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' :
                             status === 'in_progress' ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' :
                             'bg-slate-500 border-slate-500 text-white shadow-lg shadow-slate-500/20') :
                            'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300'
                          ]"
                        >
                          <i :class="getQualityStatusIconMdi(status)" class="text-lg"></i>
                          {{ status.replace('_', ' ') }}
                        </button>
                      </div>
                   </div>

                   <!-- Notes & Scoring -->
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="md:col-span-2">
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Audit Notes</label>
                         <textarea 
                           v-model="checkpoint.notes"
                           @change="updateCheckpointNotes(checkpoint.id, checkpoint.notes)"
                           class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                           placeholder="Describe any defects, materials variance or exceptional fabrication standards observed..."
                         ></textarea>
                      </div>
                      
                      <div>
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex justify-between">
                           Quality Score 
                           <span class="text-blue-500">{{ checkpoint.qualityScore || 0 }}%</span>
                         </label>
                         <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <input 
                              type="range" 
                              v-model="checkpoint.qualityScore" 
                              @change="updateQualityScore(checkpoint.id, checkpoint.qualityScore)"
                              class="w-full accent-blue-500 cursor-pointer"
                            />
                         </div>
                      </div>

                      <div>
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Assigned Inspector</label>
                         <input 
                           type="text" 
                           v-model="checkpoint.checkedBy"
                           @change="updateInspector(checkpoint.id, checkpoint.checkedBy)"
                           class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Name/ID"
                         />
                      </div>
                   </div>

                   <!-- Footer Actions -->
                   <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div class="flex gap-2">
                         <button @click="retryQualityCheck(checkpoint.id)" class="px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all">Clear & Reset</button>
                         <button @click="duplicateCheckpoint(checkpoint.id)" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">Duplicate</button>
                      </div>
                      <span class="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]" v-if="checkpoint.updatedAt">
                        Synced: {{ formatDate(checkpoint.updatedAt) }}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Quality Control State -->
        <div v-else class="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div class="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-6 relative">
             <i class="mdi mdi-shield-search text-5xl text-slate-300 dark:text-slate-600"></i>
             <div class="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                <i class="mdi mdi-plus text-xl"></i>
             </div>
          </div>
          
          <div class="text-center max-w-md px-6">
            <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-3">Initialize Quality Audit</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Quality control checkpoints are automatically mapped to your production elements to ensure fabrication standards are met.
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
               <div class="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <i class="mdi mdi-numeric-1-box text-blue-500 text-xl"></i>
                  <div>
                     <p class="text-[10px] font-black uppercase text-slate-400">Step 1</p>
                     <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Map All Categories</p>
                  </div>
               </div>
               <div class="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <i class="mdi mdi-numeric-2-box text-emerald-500 text-xl"></i>
                  <div>
                     <p class="text-[10px] font-black uppercase text-slate-400">Step 2</p>
                     <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Start Verification</p>
                  </div>
               </div>
            </div>

            <button
              @click="generateQualityCheckpoints"
              class="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <i class="mdi mdi-lightning-bolt text-lg"></i>
              Generate Checkpoints
            </button>
            <p class="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Recommended for this project</p>
          </div>
        </div>
      </div>



      <!-- Issues Tab -->
      <div
        v-show="activeTab === 'issues'"
        class="issues-section tab-panel"
        :id="`tab-panel-issues`"
        role="tabpanel"
        :aria-labelledby="`tab-issues`"
        :class="{ 'animate-fade-in': activeTab === 'issues' }"
      >
        <!-- Issues Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div class="flex items-center gap-5">
             <div class="w-14 h-14 rounded-3xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                <i class="mdi mdi-alert-octagram-outline text-3xl"></i>
             </div>
             <div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Operational Bottlenecks</h3>
                <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Track, Resolve & Escalate Production Issues</p>
             </div>
          </div>
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div class="relative group flex-1 sm:flex-none">
               <select
                 v-model="selectedIssueCategory"
                 class="appearance-none pl-11 pr-10 py-3.5 text-xs font-black uppercase tracking-widest border-0 ring-1 ring-slate-200 dark:ring-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 transition-all min-w-[220px] shadow-sm hover:shadow-md cursor-pointer"
               >
                 <option value="">All Categories</option>
                 <option v-for="cat in issueCategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
               </select>
               <i class="mdi mdi-filter-variant absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
               <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>

            <button
              v-if="!isReadOnly"
              @click="showAddIssueModal = true"
              class="px-8 py-4 bg-slate-900 dark:bg-slate-700 hover:bg-rose-600 text-white rounded-2xl transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95"
            >
              <i class="mdi mdi-plus-circle-outline text-lg"></i>
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        <!-- Issues Summary Cards -->
        <div v-if="productionData.issues.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <!-- Total Card -->
            <div class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
               <div class="relative z-10 flex flex-col h-full">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Lifetime Logs</span>
                  <div class="flex items-end justify-between mt-auto">
                    <p class="text-4xl font-black text-slate-800 dark:text-white leading-none">{{ productionData.issues.length }}</p>
                    <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                       <i class="mdi mdi-clipboard-text-outline text-xl"></i>
                    </div>
                  </div>
               </div>
               <div class="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <!-- Open Card -->
            <div class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
               <div class="relative z-10 flex flex-col h-full">
                  <span class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4 block">Active Danger</span>
                  <div class="flex items-end justify-between mt-auto">
                    <p class="text-4xl font-black text-rose-600 dark:text-rose-400 leading-none">{{ getIssueStatusCount('open') }}</p>
                    <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/40 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                       <i class="mdi mdi-fire text-xl animate-pulse"></i>
                    </div>
                  </div>
               </div>
               <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-50/50 dark:bg-rose-900/10 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <!-- In Progress Card -->
            <div class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
               <div class="relative z-10 flex flex-col h-full">
                  <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 block">In Remediation</span>
                  <div class="flex items-end justify-between mt-auto">
                    <p class="text-4xl font-black text-amber-600 dark:text-amber-400 leading-none">{{ getIssueStatusCount('in_progress') }}</p>
                    <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                       <i class="mdi mdi-tools text-xl"></i>
                    </div>
                  </div>
               </div>
               <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-50/50 dark:bg-amber-900/10 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <!-- Resolved Card -->
            <div class="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
               <div class="relative z-10 flex flex-col h-full">
                  <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 block">Resolved & Cleared</span>
                  <div class="flex items-end justify-between mt-auto">
                    <p class="text-4xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{{ getIssueStatusCount('resolved') }}</p>
                    <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                       <i class="mdi mdi-check-decagram-outline text-xl"></i>
                    </div>
                  </div>
               </div>
               <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
        </div>

        <!-- Modernized Issues List -->
        <div v-if="filteredIssues.length > 0" class="grid grid-cols-1 gap-6">
          <div
            v-for="issue in filteredIssues"
            :key="issue.id"
            class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            :class="{ 'opacity-75 grayscale-[0.5]': issue.status === 'resolved' }"
          >
            <!-- Premium List Item Body -->
            <div class="px-8 py-6">
               <div class="flex flex-col xl:flex-row gap-6">
                  <!-- Issue Info -->
                  <div class="flex-1">
                     <div class="flex items-center gap-3 mb-3">
                        <span 
                           class="text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border"
                           :class="getPriorityClass(issue.priority)"
                        >
                           <i class="mdi mr-1" :class="getPriorityIconMdi(issue.priority)"></i>
                           {{ issue.priority }}
                        </span>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ issue.category }}</span>
                        <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ formatDate(issue.reportedDate) }}</span>
                     </div>
                     <h4 class="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 transition-colors">{{ issue.title }}</h4>
                     <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{{ issue.description }}</p>
                     
                     <div class="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div class="flex items-center gap-2">
                           <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500">
                              {{ issue.reportedBy.substring(0,1).toUpperCase() }}
                           </div>
                           <span class="text-[10px] font-black text-slate-400 uppercase">Reported By: {{ issue.reportedBy }}</span>
                        </div>
                        <div v-if="issue.resolvedDate" class="flex items-center gap-2">
                           <i class="mdi mdi-check-circle text-emerald-500"></i>
                           <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Resolved: {{ formatDate(issue.resolvedDate) }}</span>
                        </div>
                     </div>
                  </div>

                  <!-- Status Control Panel -->
                  <div class="flex flex-col sm:flex-row xl:flex-col gap-3 justify-center xl:min-w-[200px]">
                     <div class="relative group/select">
                        <select
                          v-model="issue.status"
                          @change="updateIssueStatus(issue.id, issue.status)"
                          class="w-full appearance-none px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-2 rounded-2xl bg-white dark:bg-slate-900 transition-all cursor-pointer shadow-sm hover:shadow-md outline-none"
                          :class="getIssueStatusSelectClass(issue.status)"
                        >
                          <option value="open">⚠️ Open Ticket</option>
                          <option value="in_progress">⚙️ In Progress</option>
                          <option value="resolved">✅ Resolved</option>
                        </select>
                        <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                     </div>

                     <div class="flex gap-2">
                        <button
                          @click="showEscalationModal(issue)"
                          class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
                          title="Escalate Issue"
                        >
                          <i class="mdi mdi-arrow-up-bold-circle-outline text-lg"></i>
                          <span class="text-[10px] font-black uppercase tracking-widest">Escalate</span>
                        </button>
                        <button
                          @click="deleteIssue(issue.id)"
                          class="w-12 h-12 bg-white dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 border border-slate-100 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center shadow-sm"
                          title="Archive Log"
                        >
                          <i class="mdi mdi-delete-outline text-xl"></i>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Optional Expansion (if has nested comments/logs) -->
            <div v-if="isIssueDetailsExpanded(issue.id)" class="px-8 pb-8 animate-slide-down">
               <div class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Remediation Logs</h5>
                  <div class="space-y-4">
                     <p class="text-sm font-medium italic text-slate-500">No logs reported yet...</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
        <!-- Premium Empty State for Issues -->
        <div v-else class="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <div class="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-6 text-emerald-500">
              <i class="mdi mdi-check-decagram text-4xl animate-bounce"></i>
           </div>
           
           <div class="text-center max-w-md px-6">
              <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-3">
                 {{ selectedIssueCategory ? 'No Category Match' : 'Line Operating Smoothly' }}
              </h3>
              <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                 {{ selectedIssueCategory
                   ? `Success! No ${selectedIssueCategory} bottlenecks detected in current filtration.`
                   : 'Outstanding! No production issues are currently blocking your fabrication pipeline.'
                 }}
              </p>
              
              <button
                @click="showAddIssueModal = true"
                class="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-3 mx-auto"
              >
                <i class="mdi mdi-plus-circle-outline"></i>
                Log New Issue
              </button>
           </div>
        </div>

        <!-- Add Issue Modal -->
        <div v-if="showAddIssueModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4" style="z-index: 9999;" @click="closeAddIssueModal">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700" @click.stop>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Report New Issue</h3>
              <button @click="closeAddIssueModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form @submit.prevent="addNewIssue" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Title</label>
                <input
                  v-model="newIssue.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  v-model="newIssue.description"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Detailed description of the issue"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    v-model="newIssue.category"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <option value="materials">Materials</option>
                    <option value="equipment">Equipment</option>
                    <option value="quality">Quality</option>
                    <option value="timeline">Timeline</option>
                    <option value="safety">Safety</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    v-model="newIssue.priority"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reported By</label>
                <input
                  v-model="newIssue.reportedBy"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your name"
                />
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeAddIssueModal"
                  class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Report Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>



      <!-- Design Files Tab -->
      <!-- Design Assets Tab -->
      <div
        v-show="activeTab === 'design'"
        class="design-section tab-panel"
        :id="`tab-panel-design`"
        role="tabpanel"
        :aria-labelledby="`tab-design`"
        :class="{ 'animate-fade-in': activeTab === 'design' }"
      >
         <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div class="flex items-center gap-5">
               <div class="w-14 h-14 rounded-3xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 rotate-2 group-hover:rotate-0 transition-transform">
                  <i class="mdi mdi-palette-swatch-outline text-3xl"></i>
               </div>
               <div>
                  <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Technical Blueprints</h3>
                  <p class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Validated Artworks & Design Assets</p>
               </div>
            </div>
            
            <button 
               @click="fetchDesignAssets"
               class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 transition-all shadow-sm group"
               title="Refresh Assets"
            >
               <i class="mdi mdi-refresh text-xl group-hover:rotate-180 transition-transform duration-500"></i>
            </button>
         </div>

         <!-- Loading State -->
         <div v-if="isLoadingDesignAssets" class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem]">
            <div class="relative w-16 h-16">
               <div class="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
               <div class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span class="mt-6 text-xs font-black uppercase tracking-widest text-slate-400">Syncing Cloud Assets...</span>
         </div>

         <!-- Error State -->
         <div v-else-if="designAssetsError" class="p-8 bg-red-50 dark:bg-red-900/10 border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-[3rem] text-center">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
               <i class="mdi mdi-cloud-off-outline text-3xl"></i>
            </div>
            <h4 class="text-lg font-black text-slate-800 dark:text-white mb-2">Connection Interrupted</h4>
            <p class="text-sm text-red-600 dark:text-red-400 mb-6 font-medium">{{ designAssetsError }}</p>
            <button @click="fetchDesignAssets" class="px-8 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">Reconnect Now</button>
         </div>

         <!-- Empty State -->
         <div v-else-if="designAssets.length === 0" class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div class="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center mb-6 text-slate-300">
               <i class="mdi mdi-folder-zip-outline text-4xl"></i>
            </div>
            <h3 class="text-xl font-black text-slate-800 dark:text-white mb-2">Manifest Not Found</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-0 font-medium tracking-tight">No design components have been pushed to this task yet.</p>
         </div>

         <!-- Assets Grid -->
         <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div
              v-for="asset in designAssets"
              :key="asset.id"
              class="group bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
              @click="openPreview(asset)"
            >
              <!-- Asset Preview -->
              <div class="h-56 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden shrink-0">
                <!-- Image Preview -->
                <template v-if="isImageAsset(asset)">
                  <img
                    :src="getAssetUrl(asset)"
                    :alt="asset.file_name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </template>
                
                <!-- PDF Preview Icon -->
                <div v-else-if="isPdfAsset(asset)" class="flex flex-col items-center">
                   <div class="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-3 shadow-sm border border-red-100 dark:border-red-800/30">
                      <i class="mdi mdi-file-pdf-box text-4xl"></i>
                   </div>
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical PDF</span>
                </div>
                
                <!-- Other Files -->
                <div v-else class="flex flex-col items-center">
                   <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3 border border-slate-200 dark:border-slate-700">
                      <i class="mdi mdi-file-document-outline text-4xl"></i>
                   </div>
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ asset.category || 'ASSET' }}</span>
                </div>

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div class="w-14 h-14 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <i class="mdi mdi-eye-outline text-2xl"></i>
                  </div>
                </div>
              </div>

              <!-- Asset Info -->
              <div class="p-6 flex flex-col flex-1">
                <div class="flex-1">
                   <div class="flex items-center gap-2 mb-3">
                      <span 
                         class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter"
                         :class="getAssetStatusClass(asset.status)"
                      >
                         {{ asset.status }}
                      </span>
                      <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">{{ asset.category }}</span>
                   </div>
                   <h4 class="font-black text-slate-900 dark:text-white truncate text-sm leading-tight mb-2" :title="asset.file_name">
                     {{ asset.file_name || asset.name }}
                   </h4>
                </div>
                
                <div class="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {{ asset.created_at ? formatDate(asset.created_at) : 'NO DATE' }}
                   </span>
                   <div class="flex -space-x-1">
                      <div class="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
                   </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Save Status Indicator -->
    <div v-if="saveError || isSaving || lastSaveTime" class="mb-4 p-3 rounded-lg border">
      <!-- Saving State -->
      <div v-if="isSaving" class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span class="text-sm font-medium">Saving production data...</span>
      </div>

      <!-- Save Error State -->
      <div v-else-if="saveError" class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <span class="text-lg mt-0.5"></span>
            <div class="flex-1">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">Failed to Save</p>
              <p class="text-xs text-red-600 dark:text-red-300 mt-1">{{ saveError }}</p>
              <p class="text-xs text-red-500 dark:text-red-400 mt-1">
                Retry attempt: {{ saveRetryCount }}/{{ maxSaveRetries }}
              </p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="retrySave"
              class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
            <button
              @click="clearSaveError"
              class="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <!-- Save Success State -->
      <div v-else-if="lastSaveTime" class="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div class="flex items-center space-x-3 text-green-600 dark:text-green-400">
          <span class="text-lg"></span>
          <div>
            <p class="text-sm font-medium">Data saved successfully</p>
            <p class="text-xs text-green-500 dark:text-green-300">
              Last saved: {{ lastSaveTime.toLocaleTimeString() }}
              <span v-if="hasUnsavedChanges" class="text-yellow-600 dark:text-yellow-400 ml-2">
                (Unsaved changes)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
          <button
            v-if="task.status !== 'skipped' && task.status !== 'completed'"
            @click="showSkipModal = true"
            class="px-4 py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors"
          >
            Skip Task
          </button>

          <button
            v-if="['skipped', 'completed'].includes(task.status)"
            @click="$emit('update-status', 'pending')"
            class="px-4 py-2.5 text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <i class="mdi mdi-undo"></i>
            {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
          </button>
        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Production
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          class="px-4 py-2 text-white rounded-lg transition-colors bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/20"
        >
          Complete Production
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Save Status Indicator -->
        <div class="flex items-center space-x-2 text-sm">
          <div v-if="isSaving" class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span>Saving...</span>
          </div>
          <div v-else-if="hasUnsavedChanges" class="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
            <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Unsaved changes</span>
          </div>
          <div v-else-if="lastSaveTime" class="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Saved</span>
          </div>
        </div>

        <button
          v-if="!isReadOnly"
          @click="handleSubmit"
          :disabled="isSaving"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors',
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          ]"
        >
          {{ isSaving ? 'Saving...' : 'Save Production Data' }}
        </button>
      </div>
    </div>

    <!-- Preview Modal -->
    <Transition name="modal">
      <div
        v-if="showPreviewModal && previewAsset"
        class="fixed inset-0 z-[150] overflow-y-auto"
        @click.self="closePreview"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/90 backdrop-blur-md transition-opacity" @click="closePreview"></div>

        <!-- Modal Content -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in duration-300"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
              <div class="flex-1 min-w-0 mr-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {{ previewAsset.file_name || previewAsset.name || previewAsset.original_name }}
                </h3>
                <div class="flex items-center gap-3 mt-1">
                   <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                     {{ previewAsset.category }}
                   </span>
                   <span class="text-xs text-gray-400 font-medium">
                     {{ previewAsset.file_size ? formatFileSize(previewAsset.file_size) : 'Size unknown' }}
                   </span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <a
                  v-if="previewAsset.file_url"
                  :href="previewAsset.file_url"
                  download
                  class="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-black/10"
                >
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span>Download</span>
                </a>
                
                <button
                  @click="closePreview"
                  class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl transition-all"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Preview Content -->
            <div class="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-950 p-6 flex items-center justify-center min-h-0">
              <!-- Image Preview -->
              <div v-if="isImageAsset(previewAsset)" class="relative group">
                <img
                  :src="getAssetUrl(previewAsset)"
                  :alt="previewAsset.file_name || previewAsset.name"
                  class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
              </div>

              <!-- PDF Preview -->
              <div v-else-if="isPdfAsset(previewAsset)" class="w-full h-full min-h-[70vh]">
                <iframe
                  :src="getAssetUrl(previewAsset)"
                  class="w-full h-full min-h-[70vh] rounded-xl border border-gray-200 dark:border-gray-800"
                  frameborder="0"
                ></iframe>
              </div>

              <!-- Other File Types -->
              <div v-else class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 max-w-md w-full mx-auto">
                <div class="p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 text-gray-400">
                  <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center text-balance px-4">Preview not available</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center max-w-xs">We can't display this file type directly in the browser.</p>
                
                <a
                  v-if="previewAsset.file_url"
                  :href="previewAsset.file_url"
                  download
                  class="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  Download File
                </a>
              </div>
            </div>

            <!-- Asset Details Footer -->
            <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
               <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div class="space-y-1">
                     <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</span>
                     <p class="text-sm text-gray-600 dark:text-gray-300 font-medium italic">
                        {{ previewAsset.description || 'No detailed description provided for this asset.' }}
                     </p>
                  </div>
                  <div class="flex items-center gap-8 text-xs">
                     <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                        <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                           <div class="w-2 h-2 rounded-full" :class="previewAsset.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'"></div>
                           {{ previewAsset.status.toUpperCase() }}
                        </div>
                     </div>
                     <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added On</span>
                        <span class="font-bold text-gray-900 dark:text-white">{{ previewAsset.created_at ? new Date(previewAsset.created_at).toLocaleString() : 'N/A' }}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Skip Task</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">Please provide a reason for skipping this task.</p>
        <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            placeholder="Reason for skipping..."
        ></textarea>
        <div class="flex justify-end space-x-3">
            <button @click="showSkipModal = false" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import api from '@/plugins/axios'




// Type definitions
interface ProductionElementCategory {
  id: string
  name: string
  displayName: string
  color: string
}

interface IssueCategory {
    id: string
    label: string
    color: string
}

interface CompletionCriterion {
    id: string
    description: string
    met: boolean
    category: string
    notes?: string
    completedAt?: string | Date
    isCustom?: boolean
    elementCount?: number
    [key: string]: any
}

interface ProductionIssue {
    id: string
    title: string
    description: string
    category: string
    priority: 'low' | 'medium' | 'high'
    status: 'open' | 'in_progress' | 'resolved'
    reportedBy: string
    reportedDate: any
    resolvedDate?: any
    resolution?: string
    [key: string]: any
}

interface ProductionElement {
    id: string
    name: string
    description: string
    quantity: number
    unitOfMeasurement: string
    category: string
    status?: string
    [key: string]: any
}

interface QualityControlCheckpoint {
    id: string
    categoryId: string
    description?: string
    status: 'pending' | 'passed' | 'failed' | 'in_progress'
    notes?: string
    checkedBy?: string
    checkedAt?: string | Date | null
    checklist?: any[]
    [key: string]: any
}

interface ProjectInfo {
    projectId?: string
    enquiryTitle?: string
    clientName?: string
    eventVenue?: string
    setupDate?: string | Date
    [key: string]: any
}

interface ProductionTaskData {
    projectInfo: ProjectInfo
    productionElements: ProductionElement[]
    relatedProcurementItems: any[]
    qualityControl: QualityControlCheckpoint[]
    issues: ProductionIssue[]
    completionCriteria: CompletionCriterion[]
    [key: string]: any
}

/**
 * Props interface for the ProductionTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Whether the task is in read-only mode */
  readonly?: boolean
  /** Initial tab to display */
  initialTab?: string | null
}

/**
 * Events emitted by the ProductionTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
  /** Emitted when task is completed */
  'complete': []
  /** Emitted when production data needs to be saved */
  'save': [data: ProductionTaskData]
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Date formatting function (following MaterialsTask pattern)
function formatDate(dateValue: string | Date | null | undefined) {
  if (!dateValue || dateValue === 'TBC') return 'TBC'

  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    if (isNaN(date.getTime())) return 'TBC'

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'TBC'
  }
}

function convertToCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(convertToCamelCase)

  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = convertToCamelCase(value)
  }
  return result
}

// Initialize activeTab with initialTab if provided, otherwise default to 'production-management'
const activeTab = ref(props.initialTab || 'production-management')

// UI State
const isSaving = ref(false)
const saveError = ref<string | null>(null)
const lastSaveTime = ref<Date | null>(null)
const hasUnsavedChanges = ref(false)
const saveRetryCount = ref(0)
const maxSaveRetries = 3
const autoSaveDelay = 500
let autoSaveTimeout: any = null

// Watch initialTab to update activeTab when it changes while open
watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})

// Tab navigation with enhanced functionality
const tabs = [
  { id: 'production-management', label: 'Production Management', description: 'View and manage production workflow' },
  { id: 'quality', label: 'Quality Assurance', description: 'Manage quality control checkpoints' },
  { id: 'design', label: 'Design Assets', description: 'View Design Artworks and Renders' }
]

// Design Asset Interface
interface DesignAsset {
  id: number
  file_name?: string
  name?: string
  original_name?: string
  file_type: string
  mime_type?: string
  category: string
  status: string
  description: string | null
  file_url?: string
  file_size?: number
  created_at?: string
  [key: string]: any
}

// Design Assets Logic
const designAssets = ref<DesignAsset[]>([])
const isLoadingDesignAssets = ref(false)
const designAssetsError = ref<string | null>(null)

// Preview modal state
const showPreviewModal = ref(false)
const previewAsset = ref<DesignAsset | null>(null)

// Helper to get asset URL
const getAssetUrl = (asset: DesignAsset): string => {
  return asset.file_url || ''
}

const isImageAsset = (asset: DesignAsset): boolean => {
  const type = asset.mime_type || asset.file_type || ''
  const name = asset.file_name || asset.name || asset.original_name || ''
  return type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(name)
}

const isPdfAsset = (asset: DesignAsset): boolean => {
  const type = asset.mime_type || asset.file_type || ''
  const name = asset.file_name || asset.name || asset.original_name || ''
  return type === 'application/pdf' || name.toLowerCase().endsWith('.pdf')
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const openPreview = (asset: DesignAsset) => {
  previewAsset.value = asset
  showPreviewModal.value = true
}

const closePreview = () => {
  showPreviewModal.value = false
  previewAsset.value = null
}

const fetchDesignAssets = async () => {
  if (!props.task.project_enquiry_id) {
     designAssetsError.value = 'No project enquiry ID found.'
     return
  }

  isLoadingDesignAssets.value = true
  designAssetsError.value = null

  try {
      // 1. Get Enquiry details to find Design Task ID
      // We start by looking for a cached or available way, but API is safest
      const enquiryResponse = await api.get(`/api/projects/enquiries/${props.task.project_enquiry_id}`)
      
      // Access tasks relation
      let enquiryTasks = []
      if (enquiryResponse.data && enquiryResponse.data.data && enquiryResponse.data.data.enquiry_tasks) {
          enquiryTasks = enquiryResponse.data.data.enquiry_tasks
      } else if (enquiryResponse.data && enquiryResponse.data.data && enquiryResponse.data.data.enquiryTasks) {
          enquiryTasks = enquiryResponse.data.data.enquiryTasks
      }
      
      const designTask = enquiryTasks.find((t: any) => t.task_type === 'Design' || t.task_type === 'Designer' || t.type === 'design')
      
      if (!designTask) {
          // If no design task found in the response, we might need a more specific query
          designAssetsError.value = 'No Design Task found for this project.'
          isLoadingDesignAssets.value = false
          return
      }

      // 2. Fetch Assets
      const assetsResponse = await api.get(`/api/projects/enquiry-tasks/${designTask.id}/design-assets`)
      if (assetsResponse.data && assetsResponse.data.data) {
           designAssets.value = assetsResponse.data.data
      } else if (Array.isArray(assetsResponse.data)) {
           designAssets.value = assetsResponse.data
      } else {
           designAssets.value = []
      }

  } catch (err: any) {
      console.error('Error fetching design assets:', err)
      designAssetsError.value = 'Failed to load design assets.'
  } finally {
      isLoadingDesignAssets.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'design' && designAssets.value.length === 0 && !designAssetsError.value) {
    fetchDesignAssets()
  }
})

const isReadOnly = computed(() => props.readonly || props.task.status === 'completed')



// Tab navigation functions
const setActiveTab = (tabId: string) => {
  if (tabs.find(tab => tab.id === tabId)) {
    activeTab.value = tabId
    // Announce tab change for screen readers
    announceTabChange(tabId)
  }
}

const announceTabChange = (tabId: string) => {
  const tab = tabs.find(t => t.id === tabId)
  if (tab) {
    // Create a temporary element for screen reader announcement
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = `Switched to ${tab.label} tab. ${tab.description}`
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }
}

// Keyboard navigation for tabs
const handleTabKeydown = (event: KeyboardEvent, currentIndex: number) => {
  let newIndex = currentIndex

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
      break
    case 'ArrowRight':
      event.preventDefault()
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = tabs.length - 1
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      setActiveTab(tabs[currentIndex].id)
      return
    default:
      return
  }

  // Focus and activate the new tab
  const newTab = tabs[newIndex]
  setActiveTab(newTab.id)

  // Focus the new tab button
  const newTabButton = document.getElementById(`tab-${newTab.id}`)
  if (newTabButton) {
    newTabButton.focus()
  }
}

// Tab badge functions for showing counts
const getTabBadgeCount = (tabId: string): number => {
  switch (tabId) {
    case 'production-elements':
      return productionData.value.productionElements.length
    case 'quality':
      return productionData.value.qualityControl.filter((qc: any) => qc.status === 'failed').length
    case 'issues':
      return productionData.value.issues.filter((issue: any) => issue.status === 'open').length
    case 'completion':
      return productionData.value.completionCriteria.filter((c: any) => c.met).length
    case 'design':
      return designAssets.value.length
    default:
      return 0
  }
}

const getTabBadgeClass = (tabId: string): string => {
  const baseClasses = 'transition-colors duration-200'

  switch (tabId) {
    case 'production-elements':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`
    case 'quality':
      const failedCount = productionData.value.qualityControl.filter((qc: any) => qc.status === 'failed').length
      return failedCount > 0
        ? `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`
        : `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`
    case 'issues':
      return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`
    case 'completion':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`
    case 'design':
      return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`
  }
}

// Production element categories (will be loaded from backend)
const productionElementCategories = ref<ProductionElementCategory[]>([
  { id: 'stage', name: 'stage', displayName: 'STAGE', color: 'green' },
  { id: 'stage-skirting', name: 'stage-skirting', displayName: 'STAGE SKIRTING', color: 'green' },
  { id: 'stage-backdrop', name: 'stage-backdrop', displayName: 'STAGE BACKDROP', color: 'green' },
  { id: 'entrance-arc', name: 'entrance-arc', displayName: 'ENTRANCE ARC', color: 'green' },
  { id: 'walkway-dance-floor', name: 'walkway-dance-floor', displayName: 'WALKWAY AND DANCE FLOOR', color: 'green' }
])

// Issue categories (will be loaded from backend)
const issueCategories = ref<IssueCategory[]>([
  { id: 'materials', label: 'Materials', color: 'blue' },
  { id: 'equipment', label: 'Equipment', color: 'orange' },
  { id: 'quality', label: 'Quality', color: 'green' },
  { id: 'timeline', label: 'Timeline', color: 'yellow' },
  { id: 'safety', label: 'Safety', color: 'red' },
  { id: 'other', label: 'Other', color: 'gray' }
])

// Default completion criteria (will be loaded from backend)
const defaultCompletionCriteria = ref<CompletionCriterion[]>([
  {
    id: '1',
    description: 'All production elements completed according to specifications',
    met: false,
    category: 'production',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    description: 'Quality control checks completed and passed',
    met: false,
    category: 'quality',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    description: 'Production documentation completed',
    met: false,
    category: 'documentation',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    description: 'Client approval received for produced items',
    met: false,
    category: 'approval',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Reactive data structure following ProcurementTask pattern
const productionData = ref<ProductionTaskData>({
  relatedProcurementItems: [], // Initialize empty array for procurement items
  projectInfo: {
    projectId: '',
    enquiryNumber: '',
    enquiryTitle: '',
    clientName: '',
    eventVenue: '',
    setupDate: '',
    setDownDate: '',
    contactPerson: ''
  },
  productionElements: [],
  qualityControl: [],
  issues: [],
  completionCriteria: [...defaultCompletionCriteria.value]
})

const readyForAssemblyCount = computed(() => {
  return productionData.value.relatedProcurementItems?.filter((i: any) => i.stockStatus === 'in_stock').length || 0
})

const readyForAssemblyPercentage = computed(() => {
  const count = readyForAssemblyCount.value
  const total = productionData.value.productionElements.length || 1
  return Math.round((count / total) * 100)
})

// UI state
const selectedIssueCategory = ref('')

// Project information computed from task.enquiry (following MaterialsTask pattern)
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || `ENQ-${props.task.id}`,
    enquiryNumber: enquiry?.enquiry_number || `ENQ-${props.task.id}`,
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'Unknown Client',
    eventVenue: enquiry?.venue || 'TBC',
    setupDate: enquiry?.expected_delivery_date || 'TBC',
    setDownDate: 'TBC', // Field not available in current schema
    estimatedBudget: enquiry?.estimated_budget,
    contactPerson: enquiry?.contact_person || 'TBC'
  }
})

// Categories with elements computed property
const categoriesWithElements = computed(() => {
  return productionElementCategories.value.filter((category: any) =>
    productionData.value.productionElements.some((element: any) => element.category === category.id)
  )
})

// Get elements by category
const getElementsByCategory = (categoryId: string) => {
  return productionData.value.productionElements.filter((element: any) => element.category === categoryId)
}

// Filtered issues based on selected category
const filteredIssues = computed(() => {
  if (!selectedIssueCategory.value) {
    return productionData.value.issues
  }
  return productionData.value.issues.filter((issue: any) => issue.category === selectedIssueCategory.value)
})

// Completion percentage
const completionPercentage = computed(() => {
  const total = productionData.value.completionCriteria.length
  if (total === 0) return 0
  const completed = productionData.value.completionCriteria.filter((c: any) => c.met).length
  return Math.round((completed / total) * 100)
})

// Date formatting function (following MaterialsTask pattern)
// formatDate moved to top

// Currency formatting function for budget display
const formatCurrency = (amount: number | null | undefined) => {
  if (!amount || amount === 0) return '0'

  try {
    return amount.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  } catch {
    return amount.toString()
  }
}

// Production elements status management
const updateElementStatus = (elementId: string, status: ProductionElement['status']) => {
  const element = productionData.value.productionElements.find((e: any) => e.id === elementId)
  if (element) {
    const previousStatus = element.status
    element.status = status
    element.updatedAt = new Date()
    
    console.log(`Element status updated: ${element.name} - ${previousStatus} → ${status}`)
    triggerAutoSave()
  }
}

const updateElementNotes = (elementId: string, notes: string) => {
  const element = productionData.value.productionElements.find((e: any) => e.id === elementId)
  if (element) {
    element.notes = notes
    element.updatedAt = new Date()
    triggerAutoSave()
  }
}


// Quality control status management
const updateQualityStatus = (checkpointId: string, status: QualityControlCheckpoint['status']) => {
  const checkpoint = productionData.value.qualityControl.find((c: any) => c.id === checkpointId)
  if (checkpoint) {
    const previousStatus = checkpoint.status
    checkpoint.status = status
    checkpoint.checkedAt = new Date()
    checkpoint.updatedAt = new Date()

    // Auto-update quality score based on status
    if (status === 'passed' && !checkpoint.qualityScore) {
      checkpoint.qualityScore = 100
    } else if (status === 'failed' && !checkpoint.qualityScore) {
      checkpoint.qualityScore = 0
    }

    console.log(`Quality status updated for ${checkpoint.categoryName}: ${previousStatus} → ${status}`)
    triggerAutoSave()
  }
}

// Quality control UI state
const expandedCheckpoints = ref<Set<string>>(new Set())

const toggleCheckpointDetails = (checkpointId: string) => {
  if (expandedCheckpoints.value.has(checkpointId)) {
    expandedCheckpoints.value.delete(checkpointId)
  } else {
    expandedCheckpoints.value.add(checkpointId)
  }
}

const isCheckpointDetailsExpanded = (checkpointId: string): boolean => {
  return expandedCheckpoints.value.has(checkpointId)
}

// Quality control utility functions
function getQualityStatusCount(status: QualityControlCheckpoint['status']): number {
  return productionData.value.qualityControl.filter((checkpoint: any) => checkpoint.status === status).length
}

const qualityProgressPercentage = computed(() => {
  const total = productionData.value.qualityControl.length
  if (total === 0) return 0
  const completed = productionData.value.qualityControl.filter((c: any) => c.status === 'passed' || c.status === 'failed').length
  return Math.round((completed / total) * 100)
})

// Quality control styling functions
const getQualityStatusClass = (status: QualityControlCheckpoint['status']) => {
  const classes: Record<string, string> = {
    'pending': 'border-gray-300 dark:border-gray-600',
    'in_progress': 'border-blue-300 dark:border-blue-600',
    'passed': 'border-green-300 dark:border-green-600',
    'failed': 'border-red-300 dark:border-red-600'
  }
  return classes[status] || 'border-gray-300 dark:border-gray-600'
}

const getCheckpointBorderClass = (status: QualityControlCheckpoint['status']) => {
  const classes: Record<string, string> = {
    'pending': 'border-l-4 border-l-gray-400',
    'in_progress': 'border-l-4 border-l-blue-500',
    'passed': 'border-l-4 border-l-green-500',
    'failed': 'border-l-4 border-l-red-500'
  }
  return classes[status] || 'border-l-4 border-l-gray-400'
}

const getQualityStatusBadgeClass = (status: QualityControlCheckpoint['status']) => {
  const classes: Record<string, string> = {
    'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'passed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getQualityStatusSelectClass = (status: QualityControlCheckpoint['status']) => {
  const classes: Record<string, string> = {
    'pending': 'border-gray-300 dark:border-gray-600',
    'in_progress': 'border-blue-300 dark:border-blue-600 ring-blue-200 dark:ring-blue-800',
    'passed': 'border-green-300 dark:border-green-600 ring-green-200 dark:ring-green-800',
    'failed': 'border-red-300 dark:border-red-600 ring-red-200 dark:ring-red-800'
  }
  return classes[status] || 'border-gray-300 dark:border-gray-600'
}

const getQualityStatusIcon = (status: QualityControlCheckpoint['status']) => {
  const icons: Record<string, string> = {
    'pending': '⏳',
    'in_progress': '🔄',
    'passed': '✅',
    'failed': '❌'
  }
  return icons[status] || '❓'
}

const getQualityStatusIconMdi = (status: QualityControlCheckpoint['status']) => {
  const icons: Record<string, string> = {
    'passed': 'mdi-check-decagram',
    'failed': 'mdi-alert-octagon-outline',
    'in_progress': 'mdi-clock-outline',
    'pending': 'mdi-timer-sand'
  }
  return icons[status] || 'mdi-help-circle-outline'
}

const fastPassCheckpoint = (checkpointId: string) => {
  const checkpoint = productionData.value.qualityControl.find((c: any) => c.id === checkpointId)
  if (checkpoint) {
    checkpoint.status = 'passed'
    checkpoint.qualityScore = 100
    checkpoint.checkedAt = new Date()
    checkpoint.updatedAt = new Date()
    
    // Check all checklist items
    if (checkpoint.checklist) {
      checkpoint.checklist.forEach((item: any) => {
        item.checked = true
      })
    }
    
    console.log(`Fast-pass applied to ${checkpoint.categoryName}`)
    triggerAutoSave()
  }
}



// Quality control management functions
const updateCheckpointNotes = (checkpointId: string, notes?: string) => {
  const checkpoint = productionData.value.qualityControl.find((c: any) => c.id === checkpointId)
  if (checkpoint) {
    checkpoint.notes = notes
    checkpoint.updatedAt = new Date()
    // Auto-save would be triggered here
  }
}

const updateChecklistItem = (checkpointId: string, itemId: string, checked: boolean) => {
  const checkpoint = productionData.value.qualityControl.find((c: any) => c.id === checkpointId)
  if (checkpoint && checkpoint.checklist) {
    const item = checkpoint.checklist.find((i: any) => i.id === itemId)
    if (item) {
      item.checked = checked
      
      // Update quality score based on checklist completion
      const totalItems = checkpoint.checklist.length
      const checkedItems = checkpoint.checklist.filter((i: any) => i.checked).length
      checkpoint.qualityScore = Math.round((checkedItems / totalItems) * 100)
      
      // Auto-update status based on completion
      if (checkedItems === totalItems) {
        checkpoint.status = 'passed'
        checkpoint.checkedAt = new Date()
      } else if (checkedItems > 0) {
        checkpoint.status = 'in_progress'
      }
      
      checkpoint.updatedAt = new Date()
      // Auto-save would be triggered here
    }
  }
}

const updateQualityScore = (checkpointId: string, score?: number) => {
  const checkpoint = productionData.value.qualityControl.find((c: any) => c.id === checkpointId)
  if (checkpoint) {
    checkpoint.qualityScore = score
    checkpoint.updatedAt = new Date()

    // Auto-update status based on score
    if (score !== undefined) {
      if (score >= 80) {
        checkpoint.status = 'passed'
      } else if (score < 50) {
        checkpoint.status = 'failed'
      } else {
        checkpoint.status = 'in_progress'
      }
    }
    // Auto-save would be triggered here
  }
}

const updateInspector = (checkpointId: string, inspector?: string) => {
  const checkpoint = productionData.value.qualityControl.find(c => c.id === checkpointId)
  if (checkpoint) {
    checkpoint.checkedBy = inspector
    checkpoint.updatedAt = new Date()
    // Auto-save would be triggered here
  }
}

const updateCheckpointPriority = (checkpointId: string, priority?: 'low' | 'medium' | 'high') => {
  const checkpoint = productionData.value.qualityControl.find(c => c.id === checkpointId)
  if (checkpoint) {
    checkpoint.priority = priority
    checkpoint.updatedAt = new Date()
    // Auto-save would be triggered here
  }
}

const retryQualityCheck = (checkpointId: string) => {
  const checkpoint = productionData.value.qualityControl.find(c => c.id === checkpointId)
  if (checkpoint) {
    checkpoint.status = 'pending'
    checkpoint.qualityScore = undefined
    checkpoint.notes = ''
    checkpoint.updatedAt = new Date()
    console.log(`Quality check reset for ${checkpoint.categoryName}`)
    // Auto-save would be triggered here
  }
}

const duplicateCheckpoint = (checkpointId: string) => {
  const checkpoint = productionData.value.qualityControl.find(c => c.id === checkpointId)
  if (checkpoint) {
    const newCheckpoint: QualityControlCheckpoint = {
      ...checkpoint,
      id: `qc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      categoryName: `${checkpoint.categoryName} (Copy)`,
      status: 'pending',
      qualityScore: undefined,
      notes: '',
      checkedBy: undefined,
      checkedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    productionData.value.qualityControl.push(newCheckpoint)
    console.log(`Quality checkpoint duplicated: ${newCheckpoint.categoryName}`)
    // Auto-save would be triggered here
  }
}


const generateQualityCheckpoints = async () => {
  try {
    // First, clear all existing quality control checkpoints from the backend
    const taskId = props.task.id.toString()
    
    try {
      await api.delete(`/api/projects/tasks/${taskId}/production/quality-checkpoints`)
    } catch (deleteError: any) {
      if (deleteError.response?.status !== 404) {
        console.error('Error deleting checkpoints:', deleteError)
        throw deleteError
      }
    }
    
    // Generate static quality control checklist
    const staticCheckpoints = [
      // 1. Event Details
      {
        id: 'qc-event-details',
        categoryId: 'event-details',
        categoryName: '1. Event Details',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'high' as const,
        elementCount: 6,
        checklist: [
          { id: 'project_name_confirmed', label: 'Project Name confirmed', checked: false },
          { id: 'project_code_confirmed', label: 'Project Code/Ref confirmed', checked: false },
          { id: 'client_name_confirmed', label: 'Client Name confirmed', checked: false },
          { id: 'production_dates_confirmed', label: 'Production dates confirmed', checked: false },
          { id: 'venue_confirmed', label: 'Venue confirmed', checked: false },
          { id: 'project_officer_confirmed', label: 'Assigned Project Officer confirmed', checked: false }
        ]
      },

      // 2. Job Brief Intake
      {
        id: 'qc-job-brief',
        categoryId: 'job-brief',
        categoryName: '2. Job Brief Intake',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'high' as const,
        elementCount: 3,
        checklist: [
          { id: 'job_sheet_reviewed', label: 'Review job sheet from Design Department', checked: false },
          { id: 'materials_quantities_confirmed', label: 'Confirm materials, quantities, and deadline', checked: false },
          { id: 'clarifying_questions_asked', label: 'Ask clarifying questions if needed', checked: false }
        ]
      },

      // 3. Material Preparation
      {
        id: 'qc-material-prep',
        categoryId: 'material-prep',
        categoryName: '3. Material Preparation',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'high' as const,
        elementCount: 3,
        checklist: [
          { id: 'inventory_checked', label: 'Check inventory for required materials', checked: false },
          { id: 'materials_cut_prepared', label: 'Cut/print/prepare materials as specified', checked: false },
          { id: 'material_quality_inspected', label: 'Inspect for material quality (no defects/damage)', checked: false }
        ]
      },

      // 4. Fabrication
      {
        id: 'qc-fabrication',
        categoryId: 'fabrication',
        categoryName: '4. Fabrication',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'high' as const,
        elementCount: 4,
        checklist: [
          { id: 'quality_standards_tested', label: 'Test ply timbers/melamine (PSC, primers, etc.)', checked: false },
          { id: 'materials_post_fabrication_tested', label: 'Test materials where fabrics fall tops', checked: false },
          { id: 'production_per_specs', label: 'Execute production to PVC, acrylic specs', checked: false },
          { id: 'safety_standards_observed', label: 'Observe safety standards', checked: false }
        ]
      },

      // 5. Assembly
      {
        id: 'qc-assembly',
        categoryId: 'assembly',
        categoryName: '5. Assembly',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'medium' as const,
        elementCount: 3,
        checklist: [
          { id: 'dry_fit_before_assembly', label: 'Dry-fit components before final assembly', checked: false },
          { id: 'correct_fasteners_used', label: 'Use correct fasteners, adhesives, finish', checked: false },
          { id: 'dimensions_confirmed', label: 'Confirm dimensions and alignments', checked: false }
        ]
      },

      // 6. Quality Control (QC)
      {
        id: 'qc-quality-control',
        categoryId: 'quality-control',
        categoryName: '6. Quality Control (QC)',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'high' as const,
        elementCount: 3,
        checklist: [
          { id: 'scratches_colors_inspected', label: 'Inspect for scratches, incorrect colors, uneven cuts', checked: false },
          { id: 'final_piece_matches_design', label: 'Confirm final piece matches design', checked: false },
          { id: 'defects_logged', label: 'Log defects, repairs, or reworks done', checked: false }
        ]
      },

      // 7. Packaging & Handover
      {
        id: 'qc-packaging',
        categoryId: 'packaging',
        categoryName: '7. Packaging & Handover',
        status: 'pending' as const,
        qualityScore: 0,
        checkedBy: '',
        checkedAt: null,
        notes: '',
        priority: 'medium' as const,
        elementCount: 4,
        checklist: [
          { id: 'items_cleaned', label: 'Clean and finish all items', checked: false },
          { id: 'packed_with_protection', label: 'Pack with appropriate protection', checked: false },
          { id: 'labeled_moved_to_storage', label: 'Label and move to storage/delivery area', checked: false },
          { id: 'job_status_updated', label: 'Update job status on tracker/system', checked: false }
        ]
      }
    ]

    // Set the static checkpoints
    productionData.value.qualityControl = staticCheckpoints
    
    // Save immediately to persist the new checkpoints
    const saveResult = await manualSave()
    
    if (saveResult) {
      alert('Quality Control checkpoints regenerated successfully!')
    } else {
      alert('Failed to save checkpoints. Please try again.')
    }
  } catch (error: any) {
    console.error('Failed to regenerate quality checkpoints:', error)
    alert(`Failed to regenerate quality checkpoints: ${error.response?.data?.message || error.message}`)
  }
}


const exportQualityReport = () => {
  const report = {
    projectInfo: productionData.value.projectInfo,
    generatedAt: new Date().toISOString(),
    summary: {
      totalCheckpoints: productionData.value.qualityControl.length,
      passed: getQualityStatusCount('passed'),
      failed: getQualityStatusCount('failed'),
      pending: getQualityStatusCount('pending') + getQualityStatusCount('in_progress'),
      overallProgress: qualityProgressPercentage.value
    },
    checkpoints: productionData.value.qualityControl.map(checkpoint => ({
      category: checkpoint.categoryName,
      status: checkpoint.status,
      qualityScore: checkpoint.qualityScore,
      inspector: checkpoint.checkedBy,
      notes: checkpoint.notes,
      checkedAt: checkpoint.checkedAt ? new Date(checkpoint.checkedAt).toISOString() : null,
      priority: checkpoint.priority
    }))
  }

  // Create and download JSON report
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `quality-report-${productionData.value.projectInfo.projectId}-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  console.log('Quality control report exported')
}

// Issue management state
const expandedIssues = ref<Set<string>>(new Set())
const showAddIssueModal = ref(false)
const newIssue = ref<{
  title: string
  description: string
  category: ProductionIssue['category'] | ''
  priority: ProductionIssue['priority'] | ''
  reportedBy: string
}>({
  title: '',
  description: '',
  category: '',
  priority: '',
  reportedBy: ''
})

// Issue management functions
const updateIssueStatus = (issueId: string, status: ProductionIssue['status']) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue) {
    const previousStatus = issue.status
    issue.status = status

    if (status === 'resolved' && previousStatus !== 'resolved') {
      issue.resolvedDate = new Date()
      if (!issue.resolution) {
        issue.resolution = 'Issue marked as resolved'
      }
    } else if (status !== 'resolved') {
      issue.resolvedDate = undefined
      issue.resolution = undefined
    }

    console.log(`Issue status updated: ${issue.title} - ${previousStatus} → ${status}`)
    triggerAutoSave()
  }
}

const toggleIssueDetails = (issueId: string) => {
  if (expandedIssues.value.has(issueId)) {
    expandedIssues.value.delete(issueId)
  } else {
    expandedIssues.value.add(issueId)
  }
}

const isIssueDetailsExpanded = (issueId: string): boolean => {
  return expandedIssues.value.has(issueId)
}

function getIssueStatusCount(status: ProductionIssue['status']): number {
  return productionData.value.issues.filter(issue => issue.status === status).length
}

const openIssueModal = (element?: any) => {
  // Reset form first
  newIssue.value = {
    title: '',
    description: '',
    category: '',
    priority: '',
    reportedBy: ''
  }

  if (element) {
    newIssue.value.title = `Issue with ${element.name || element.description}`
    newIssue.value.description = `Reported issue for item: ${element.name || element.description} (Qty: ${element.quantity} ${element.unitOfMeasurement})\n\nDetails:`
    newIssue.value.category = 'materials'
  }
  
  showAddIssueModal.value = true
}

const addNewIssue = () => {
  if (!newIssue.value.title || !newIssue.value.description || !newIssue.value.category || !newIssue.value.priority || !newIssue.value.reportedBy) {
    return
  }

  const issue: ProductionIssue = {
    id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: newIssue.value.title,
    description: newIssue.value.description,
    category: newIssue.value.category as ProductionIssue['category'],
    status: 'open',
    priority: newIssue.value.priority as ProductionIssue['priority'],
    reportedDate: new Date(),
    reportedBy: newIssue.value.reportedBy
  }

  productionData.value.issues.push(issue)

  // Reset form
  newIssue.value = {
    title: '',
    description: '',
    category: '',
    priority: '',
    reportedBy: ''
  }

  showAddIssueModal.value = false

  console.log(`New issue reported: ${issue.title}`)
  triggerAutoSave()
}

const closeAddIssueModal = () => {
  showAddIssueModal.value = false
  // Reset form
  newIssue.value = {
    title: '',
    description: '',
    category: '',
    priority: '',
    reportedBy: ''
  }
}

const getIssueStatusSelectClass = (status: string) => {
  const classes: Record<string, string> = {
    'open': 'border-rose-200 text-rose-700 bg-rose-50/30 ring-rose-100',
    'in_progress': 'border-amber-200 text-amber-700 bg-amber-50/30 ring-amber-100',
    'resolved': 'border-emerald-200 text-emerald-700 bg-emerald-50/30 ring-emerald-100'
  }
  return classes[status] || 'border-slate-200'
}

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    'low': 'border-slate-200 text-slate-500 bg-slate-50',
    'medium': 'border-blue-200 text-blue-600 bg-blue-50',
    'high': 'border-rose-200 text-rose-600 bg-rose-50',
    'urgent': 'border-rose-500 text-white bg-rose-500 shadow-lg shadow-rose-500/30'
  }
  return classes[priority] || 'border-slate-200'
}

const getPriorityIconMdi = (priority: string) => {
  const icons: Record<string, string> = {
    'low': 'mdi-chevron-double-down',
    'medium': 'mdi-chevron-double-right',
    'high': 'mdi-chevron-double-up',
    'urgent': 'mdi-fire animate-pulse'
  }
  return icons[priority] || 'mdi-information-outline'
}

const getAssetStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'approved': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800',
    'pending': 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
    'rejected': 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800',
    'revision': 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800'
  }
  return classes[status] || 'bg-slate-50 text-slate-500'
}

const showEscalationModal = (issue: any) => {
  console.log('Escalating issue:', issue.title)
  // For now, let's just update priority to urgent if it's not
  if (issue.priority !== 'urgent') {
     issue.priority = 'high' 
     triggerAutoSave()
  }
  alert(`Escalation protocol initiated for: ${issue.title}. Management has been notified.`)
}

const deleteIssue = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue && confirm(`Are you sure you want to archive this issue log: "${issue.title}"?`)) {
    const index = productionData.value.issues.findIndex(i => i.id === issueId)
    if (index !== -1) {
      productionData.value.issues.splice(index, 1)
      expandedIssues.value.delete(issueId)
      triggerAutoSave()
    }
  }
}

const markIssueResolved = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue) {
    const resolution = prompt('Please provide a resolution description:')
    if (resolution) {
      issue.status = 'resolved'
      issue.resolvedDate = new Date()
      issue.resolution = resolution
      triggerAutoSave()
    }
  }
}

const reopenIssue = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue && confirm(`Are you sure you want to reopen the issue "${issue.title}"?`)) {
    issue.status = 'open'
    issue.resolvedDate = undefined
    issue.resolution = undefined
    triggerAutoSave()
  }
}

const duplicateIssue = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue) {
    const duplicatedIssue: ProductionIssue = {
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${issue.title} (Copy)`,
      status: 'open',
      reportedDate: new Date(),
      resolvedDate: undefined,
      resolution: undefined
    }
    productionData.value.issues.push(duplicatedIssue)
    console.log(`Issue duplicated: ${duplicatedIssue.title}`)
    // Auto-save would be triggered here
  }
}

const escalateIssue = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue) {
    // Escalate to high priority if not already
    if (issue.priority !== 'high') {
      issue.priority = 'high'
    }

    // Add escalation note to description
    const escalationNote = `\n\n[ESCALATED on ${new Date().toLocaleDateString()}]`
    if (!issue.description.includes('[ESCALATED')) {
      issue.description += escalationNote
    }

    console.log(`Issue escalated: ${issue.title}`)
    // Auto-save would be triggered here

    alert(`Issue "${issue.title}" has been escalated to high priority.`)
  }
}



// Completion criteria management state
const showAddCriterionModal = ref(false)
const newCriterion = ref<{
  description: string
  category: CompletionCriterion['category'] | ''
  notes: string
}>({
  description: '',
  category: '',
  notes: ''
})

// Completion categories
const completionCategories = [
  {
    id: 'production',
    name: 'Production Tasks',
    description: 'Core production activities and deliverables'
  },
  {
    id: 'quality',
    name: 'Quality Assurance',
    description: 'Quality control and validation checks'
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Required documentation and records'
  },
  {
    id: 'approval',
    name: 'Approvals',
    description: 'Client and stakeholder approvals'
  }
]

// Completion criteria management functions
const updateCompletionCriterion = (criterionId: string, met: boolean) => {
  const criterion = productionData.value.completionCriteria.find(c => c.id === criterionId)
  if (criterion) {
    criterion.met = met
    criterion.updatedAt = new Date()

    if (met) {
      criterion.completedAt = new Date()
    } else {
      criterion.completedAt = undefined
    }

    console.log(`Completion criterion updated: ${criterion.description} - ${met ? 'completed' : 'unchecked'}`)
    triggerAutoSave()
  }
}

// Computed properties for completion system
const completedCriteriaCount = computed(() => {
  return productionData.value.completionCriteria.filter(c => c.met).length
})

const getCategoryCriteria = (categoryId: string) => {
  return productionData.value.completionCriteria.filter(c => c.category === categoryId)
}

const getCategoryCriteriaCount = (categoryId: string): number => {
  return getCategoryCriteria(categoryId).length
}

const getCategoryCompletedCount = (categoryId: string): number => {
  return getCategoryCriteria(categoryId).filter(c => c.met).length
}

const getCategoryCompletionPercentage = (categoryId: string): number => {
  const total = getCategoryCriteriaCount(categoryId)
  if (total === 0) return 0
  const completed = getCategoryCompletedCount(categoryId)
  return Math.round((completed / total) * 100)
}

const materialRelatedCriteria = computed(() => {
  return productionData.value.completionCriteria.filter(c =>
    c.description.toLowerCase().includes('material') ||
    c.description.toLowerCase().includes('element') ||
    c.elementCount !== undefined
  )
})

// Completion criteria CRUD operations
const addCustomCriterion = () => {
  showAddCriterionModal.value = true
}

const closeAddCriterionModal = () => {
  showAddCriterionModal.value = false
  newCriterion.value = {
    description: '',
    category: '',
    notes: ''
  }
}

const addNewCriterion = () => {
  if (!newCriterion.value.description || !newCriterion.value.category) {
    return
  }

  const criterion: CompletionCriterion = {
    id: `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description: newCriterion.value.description,
    category: newCriterion.value.category as CompletionCriterion['category'],
    notes: newCriterion.value.notes || undefined,
    met: false,
    isCustom: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  productionData.value.completionCriteria.push(criterion)

  console.log(`Custom completion criterion added: ${criterion.description}`)
  closeAddCriterionModal()
  // Auto-save would be triggered here
}

const editCriterion = (criterionId: string) => {
  const criterion = productionData.value.completionCriteria.find(c => c.id === criterionId)
  if (criterion) {
    const newDescription = prompt('Edit criterion description:', criterion.description)
    if (newDescription && newDescription !== criterion.description) {
      criterion.description = newDescription
      criterion.updatedAt = new Date()
      console.log(`Completion criterion edited: ${criterion.description}`)
      // Auto-save would be triggered here
    }
  }
}

const deleteCriterion = (criterionId: string) => {
  const criterion = productionData.value.completionCriteria.find(c => c.id === criterionId)
  if (criterion && criterion.isCustom && confirm(`Are you sure you want to delete "${criterion.description}"?`)) {
    const index = productionData.value.completionCriteria.findIndex(c => c.id === criterionId)
    if (index !== -1) {
      productionData.value.completionCriteria.splice(index, 1)
      console.log(`Custom completion criterion deleted: ${criterion.description}`)
      // Auto-save would be triggered here
    }
  }
}

const resetAllCriteria = () => {
  if (confirm('Are you sure you want to reset all completion criteria? This will uncheck all items.')) {
    productionData.value.completionCriteria.forEach(criterion => {
      criterion.met = false
      criterion.completedAt = undefined
      criterion.updatedAt = new Date()
    })
    console.log('All completion criteria reset')
    // Auto-save would be triggered here
  }
}

const completeProduction = () => {
  if (completionPercentage.value === 100) {
    if (confirm('Are you sure you want to mark the entire production as complete? This will update the task status.')) {
      updateStatus('completed')
      console.log('Production marked as complete')
    }
  }
}

// Generate material-related completion criteria based on production elements
const generateMaterialRelatedCriteria = () => {
  // Remove existing material-related criteria that are auto-generated
  productionData.value.completionCriteria = productionData.value.completionCriteria.filter(c =>
    !c.description.includes('[AUTO-GENERATED]')
  )

  // Generate criteria based on production elements
  const categoryGroups = new Map<string, number>()
  productionData.value.productionElements.forEach(element => {
    const count = categoryGroups.get(element.category) || 0
    categoryGroups.set(element.category, count + 1)
  })

  // Create completion criteria for each category with elements
  categoryGroups.forEach((count, categoryId) => {
    const categoryInfo = productionElementCategories.value.find(cat => cat.id === categoryId)
    if (categoryInfo && count > 0) {
      const criterion: CompletionCriterion = {
        id: `material-${categoryId}-${Date.now()}`,
        description: `Complete all ${categoryInfo.displayName.toLowerCase()} production elements [AUTO-GENERATED]`,
        category: 'production',
        met: false,
        isCustom: false,
        elementCount: count,
        notes: `Auto-generated based on ${count} ${categoryInfo.displayName.toLowerCase()} elements`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      productionData.value.completionCriteria.push(criterion)
    }
  })

  console.log(`Generated ${categoryGroups.size} material-related completion criteria`)
}

// Production Task API endpoints
const API_ENDPOINTS = {
  GET_PRODUCTION_TASK: (taskId: string) => `/api/production/tasks/${taskId}`,
  SAVE_PRODUCTION_TASK: (taskId: string) => `/api/production/tasks/${taskId}`,
  IMPORT_MATERIALS: (taskId: string) => `/api/production/tasks/${taskId}/import-elements`,
  GENERATE_QC_CHECKPOINTS: (taskId: string) => `/api/production/tasks/${taskId}/generate-checkpoints`
}




// Auto-save functionality with debouncing
const triggerAutoSave = () => {
  hasUnsavedChanges.value = true

  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout)
  }

  // Set new timeout for auto-save
  autoSaveTimeout = setTimeout(() => {
    autoSave()
  }, autoSaveDelay)
}

const autoSave = async () => {
  if (!hasUnsavedChanges.value || isSaving.value) {
    return
  }

  try {
    isSaving.value = true
    saveError.value = null

    // Map production elements to backend field names for validation and saving
    const mappedElements = productionData.value.productionElements.map(e => ({
      ...e,
      description: e.name ?? e.description,
      unit_of_measurement: e.unit ?? e.unitOfMeasurement ?? e.unit_of_measurement
    }))
    // Temporarily replace productionElements for validation
    const originalElements = productionData.value.productionElements
    productionData.value.productionElements = mappedElements
    const validationResult = validateProductionData()
    // Restore original elements after validation
    productionData.value.productionElements = originalElements
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
    }

    // Save data using real API
    const taskId = props.task.id.toString()
    // Convert camelCase to snake_case for backend compatibility
    const convertToSnakeCase = (obj: any): any => {
      if (obj === null || obj === undefined) return obj
      if (obj instanceof Date) return obj.toISOString()
      if (typeof obj !== 'object') return obj
      if (Array.isArray(obj)) return obj.map(convertToSnakeCase)

      const result: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        result[snakeKey] = convertToSnakeCase(value)
      }
      return result
    }

    const saveData = {
      production_elements: convertToSnakeCase(mappedElements),
      quality_control: convertToSnakeCase(productionData.value.qualityControl),
      issues: convertToSnakeCase(productionData.value.issues),
      completion_criteria: convertToSnakeCase(productionData.value.completionCriteria)
    }
    const result = await api.put(`/api/projects/tasks/${taskId}/production`, saveData)

    if (result.data.success) {
      hasUnsavedChanges.value = false
      lastSaveTime.value = new Date()
      saveRetryCount.value = 0
      
      // Update local data with returned data (containing real IDs) if available
      if (result.data.data) {
        const data = result.data.data
        if (data.qualityControl) productionData.value.qualityControl = convertToCamelCase(data.qualityControl)
        if (data.issues) productionData.value.issues = convertToCamelCase(data.issues)
        if (data.completionCriteria) productionData.value.completionCriteria = convertToCamelCase(data.completionCriteria)
      }

      console.log('Auto-save successful')
    }

  } catch (error) {
    console.error('Auto-save failed:', error)
    saveError.value = error instanceof Error ? error.message : 'Failed to save production data'

    // Implement retry logic
    if (saveRetryCount.value < maxSaveRetries) {
      saveRetryCount.value++
      console.log(`Retrying auto-save (attempt ${saveRetryCount.value}/${maxSaveRetries})`)

      // Exponential backoff for retries
      setTimeout(() => {
        autoSave()
      }, Math.pow(2, saveRetryCount.value) * 1000)
    } else {
      console.error('Max save retries reached, giving up')
    }

  } finally {
    isSaving.value = false
  }
}

// Manual save functionality
const manualSave = async (): Promise<boolean> => {
  try {
    isSaving.value = true
    saveError.value = null

    // Map production elements to backend field names for validation and saving
    const mappedElements = productionData.value.productionElements.map(e => ({
      ...e,
      description: e.name ?? e.description,
      unit_of_measurement: e.unit ?? e.unitOfMeasurement ?? e.unit_of_measurement
    }))
    // Temporarily replace productionElements for validation
    const originalElements = productionData.value.productionElements
    productionData.value.productionElements = mappedElements

    const validationResult = validateProductionData()
    
    // Restore original elements after validation
    productionData.value.productionElements = originalElements

    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
    }

    const taskId = props.task.id.toString()
    
    // Convert camelCase to snake_case for backend compatibility
    const convertToSnakeCase = (obj: any): any => {
      if (obj === null || obj === undefined) return obj
      if (obj instanceof Date) return obj.toISOString()
      if (typeof obj !== 'object') return obj
      if (Array.isArray(obj)) return obj.map(convertToSnakeCase)

      const result: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        result[snakeKey] = convertToSnakeCase(value)
      }
      return result
    }

    const saveData = {
      production_elements: convertToSnakeCase(mappedElements),
      quality_control: convertToSnakeCase(productionData.value.qualityControl),
      issues: convertToSnakeCase(productionData.value.issues),
      completion_criteria: convertToSnakeCase(productionData.value.completionCriteria)
    }

    const response = await api.put(`/api/projects/tasks/${taskId}/production`, saveData)

    if (response.data.success) {
      hasUnsavedChanges.value = false
      lastSaveTime.value = new Date()
      saveRetryCount.value = 0
      
      // Update local data with returned data (containing real IDs) if available
      if (response.data.data) {
        const data = response.data.data
        if (data.qualityControl) productionData.value.qualityControl = convertToCamelCase(data.qualityControl)
        if (data.issues) productionData.value.issues = convertToCamelCase(data.issues)
        if (data.completionCriteria) productionData.value.completionCriteria = convertToCamelCase(data.completionCriteria)
      }

      console.log('Manual save successful')
      return true
    }

    return false

  } catch (error: any) {
    console.error('Manual save failed:', error)
    saveError.value = error.response?.data?.error || error.message || 'Failed to save production data'
    return false

  } finally {
    isSaving.value = false
  }
}

// Enhanced data validation with comprehensive checks and scoring
const validateProductionData = (): { isValid: boolean; errors: string[]; warnings: string[]; info: string[]; consistencyScore: number } => {
  const errors: string[] = []
  const warnings: string[] = []
  const info: string[] = []

  // Project info validation with detailed checks
  if (!productionData.value.projectInfo.projectId) {
    errors.push('Project ID is required for data persistence')
  } else if (productionData.value.projectInfo.projectId.length < 3) {
    warnings.push('Project ID should be at least 3 characters long')
  }

  if (!productionData.value.projectInfo.enquiryTitle) {
    errors.push('Project title is required')
  } else if (productionData.value.projectInfo.enquiryTitle.length < 5) {
    warnings.push('Project title seems too short - please verify')
  }

  if (!productionData.value.projectInfo.clientName || productionData.value.projectInfo.clientName === 'Unknown Client') {
    warnings.push('Client name should be specified')
  } else if (productionData.value.projectInfo.clientName.length < 2) {
    warnings.push('Client name seems too short - please verify')
  }

  if (!productionData.value.projectInfo.eventVenue || productionData.value.projectInfo.eventVenue === 'TBC') {
    warnings.push('Event venue should be confirmed for production planning')
  }

  if (!productionData.value.projectInfo.setupDate || productionData.value.projectInfo.setupDate === 'TBC') {
    warnings.push('Setup date should be specified for timeline planning')
  } else {
    const setupDate = new Date(productionData.value.projectInfo.setupDate)
    const today = new Date()
    if (setupDate < today) {
      warnings.push('Setup date is in the past - please verify timeline')
    } else {
      const daysUntilSetup = Math.ceil((setupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      info.push(`Setup scheduled in ${daysUntilSetup} days`)
    }
  }

  // Production elements validation with detailed analysis
  if (productionData.value.productionElements.length === 0) {
    warnings.push('No production elements imported - complete Materials Task first')
  } else {
    info.push(`${productionData.value.productionElements.length} production elements defined`)

    let elementErrors = 0
    productionData.value.productionElements.forEach((element, index) => {
      if (!element.description) {
        errors.push(`Production element ${index + 1}: Description is required`)
        elementErrors++
      } else if (element.description.length < 5) {
        warnings.push(`Production element ${index + 1}: Description seems too short`)
      }

      if (element.quantity <= 0) {
        errors.push(`Production element ${index + 1}: Quantity must be greater than 0`)
        elementErrors++
      }

      if (!element.unitOfMeasurement && !element.unit_of_measurement) {
        errors.push(`Production element ${index + 1}: Unit of measurement is required`)
        elementErrors++
      }
    })

    if (elementErrors === 0) {
      info.push('All production elements have valid data')
    }

    // Category distribution analysis
    const categoryDistribution = productionData.value.productionElements.reduce((acc, element) => {
      acc[element.category] = (acc[element.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categoriesCount = Object.keys(categoryDistribution).length
    info.push(`Elements distributed across ${categoriesCount} categories`)

    if (categoriesCount === 1) {
      warnings.push('All elements are in the same category - consider reviewing categorization')
    }

    // Total quantity analysis
    const totalQuantity = productionData.value.productionElements.reduce((sum, element) => sum + element.quantity, 0)
    info.push(`Total production quantity: ${totalQuantity} items`)
  }

  // Quality control validation with comprehensive checks
  const totalElements = productionData.value.productionElements.length
  const totalQC = productionData.value.qualityControl.length

  if (totalElements > 0 && totalQC === 0) {
    warnings.push('Production elements exist but no quality control checkpoints are defined')
  } else if (totalQC > 0) {
    info.push(`${totalQC} quality control checkpoints defined`)

    let qcErrors = 0
    productionData.value.qualityControl.forEach((checkpoint, index) => {
      if (!checkpoint.categoryName) {
        errors.push(`Quality checkpoint ${index + 1}: Category name is required`)
        qcErrors++
      }
      if (!checkpoint.status) {
        errors.push(`Quality checkpoint ${index + 1}: Status is required`)
        qcErrors++
      }
      if (checkpoint.status === 'failed' && !checkpoint.notes) {
        warnings.push(`Quality checkpoint ${index + 1}: Failed checkpoints should include notes`)
      }
    })

    if (qcErrors === 0) {
      info.push('All quality checkpoints have valid data')
    }

    // QC status distribution
    const qcStatusDistribution = productionData.value.qualityControl.reduce((acc, qc) => {
      acc[qc.status] = (acc[qc.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const pendingCount = qcStatusDistribution.pending || 0
    const failedCount = qcStatusDistribution.failed || 0
    const passedCount = qcStatusDistribution.passed || 0
    const inProgressCount = qcStatusDistribution.in_progress || 0

    if (pendingCount === totalQC) {
      warnings.push('All quality checkpoints are pending - consider starting quality reviews')
    }

    if (failedCount > 0) {
      warnings.push(`${failedCount} quality checkpoints have failed - attention required`)
    }

    if (passedCount > 0) {
      info.push(`${passedCount} quality checkpoints have passed`)
    }

    if (inProgressCount > 0) {
      info.push(`${inProgressCount} quality checkpoints are in progress`)
    }

    // Quality completion rate
    const completedQC = passedCount + failedCount
    const qcCompletionRate = Math.round((completedQC / totalQC) * 100)
    info.push(`Quality control completion: ${qcCompletionRate}%`)
  }

  // Completion criteria validation with progress analysis
  if (productionData.value.completionCriteria.length === 0) {
    errors.push('At least one completion criterion is required')
  } else {
    const totalCriteria = productionData.value.completionCriteria.length
    const metCriteria = productionData.value.completionCriteria.filter(c => c.met).length
    const completionPercentage = Math.round((metCriteria / totalCriteria) * 100)

    info.push(`${metCriteria}/${totalCriteria} completion criteria met (${completionPercentage}%)`)

    if (completionPercentage === 0) {
      warnings.push('No completion criteria have been met - consider reviewing progress')
    } else if (completionPercentage === 100) {
      info.push('All completion criteria met - production ready for completion')
    } else if (completionPercentage < 50) {
      warnings.push(`Only ${completionPercentage}% of completion criteria met`)
    }

    // Check for required categories
    const requiredCategories = ['production', 'quality']
    requiredCategories.forEach(category => {
      const categoryHasCriteria = productionData.value.completionCriteria.some(c => c.category === category)
      if (!categoryHasCriteria) {
        warnings.push(`No completion criteria defined for ${category} category`)
      }
    })
  }

  // Issues validation with priority and status analysis
  if (productionData.value.issues.length > 0) {
    info.push(`${productionData.value.issues.length} production issues tracked`)

    const issueStatusDistribution = productionData.value.issues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const openIssues = issueStatusDistribution.open || 0
    const inProgressIssues = issueStatusDistribution.in_progress || 0
    const resolvedIssues = issueStatusDistribution.resolved || 0
    const highPriorityIssues = productionData.value.issues.filter(i => i.priority === 'high' && i.status !== 'resolved').length

    if (openIssues > 5) {
      warnings.push(`High number of open issues (${openIssues}) may impact production timeline`)
    }

    if (highPriorityIssues > 0) {
      warnings.push(`${highPriorityIssues} high-priority issues require immediate attention`)
    }

    if (resolvedIssues > 0) {
      info.push(`${resolvedIssues} issues have been resolved`)
    }

    if (inProgressIssues > 0) {
      info.push(`${inProgressIssues} issues are being worked on`)
    }

    // Issue resolution rate
    const resolutionRate = Math.round((resolvedIssues / productionData.value.issues.length) * 100)
    info.push(`Issue resolution rate: ${resolutionRate}%`)

    // Validate individual issues
    let issueErrors = 0
    productionData.value.issues.forEach((issue, index) => {
      if (!issue.title) {
        errors.push(`Issue ${index + 1}: Title is required`)
        issueErrors++
      }
      if (!issue.description) {
        errors.push(`Issue ${index + 1}: Description is required`)
        issueErrors++
      }
      if (!issue.reportedBy) {
        errors.push(`Issue ${index + 1}: Reporter is required`)
        issueErrors++
      }
      if (!issue.category) {
        errors.push(`Issue ${index + 1}: Category is required`)
        issueErrors++
      }
      if (!issue.priority) {
        errors.push(`Issue ${index + 1}: Priority is required`)
        issueErrors++
      }
    })

    if (issueErrors === 0) {
      info.push('All issues have complete information')
    }
  } else {
    info.push('No production issues reported')
  }

  // Business logic validations with enhanced checks
  if (totalElements > 0 && totalQC === 0) {
    warnings.push('Production elements exist but no quality control checkpoints are defined')
  }

  if (totalQC > totalElements && totalElements > 0) {
    warnings.push('More quality checkpoints than production elements - review checkpoint generation')
  }

  // Check for consistency between production elements and quality control
  if (totalElements > 0 && totalQC > 0) {
    const elementCategories = [...new Set(productionData.value.productionElements.map(e => e.category))]
    const qcCategories = productionData.value.qualityControl.map(qc => qc.categoryId)

    const missingQCCategories = elementCategories.filter(cat => !qcCategories.includes(cat))
    if (missingQCCategories.length > 0) {
      warnings.push(`Missing quality checkpoints for categories: ${missingQCCategories.join(', ')}`)
    }

    const orphanedQCCategories = qcCategories.filter(cat => !elementCategories.includes(cat))
    if (orphanedQCCategories.length > 0) {
      warnings.push(`Orphaned quality checkpoints for categories: ${orphanedQCCategories.join(', ')}`)
    }

    if (missingQCCategories.length === 0 && orphanedQCCategories.length === 0) {
      info.push('Quality checkpoints properly aligned with production elements')
    }
  }

  // Timeline validation with urgency assessment
  if (productionData.value.projectInfo.setupDate && productionData.value.projectInfo.setupDate !== 'TBC') {
    const setupDate = new Date(productionData.value.projectInfo.setupDate)
    const today = new Date()
    const daysUntilSetup = Math.ceil((setupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilSetup <= 3) {
      const unmetCriteria = productionData.value.completionCriteria.filter(c => !c.met).length
      const openIssues = productionData.value.issues.filter(i => i.status === 'open').length

      if (unmetCriteria > 0 || openIssues > 0) {
        warnings.push(`Setup is in ${daysUntilSetup} days with ${unmetCriteria} unmet criteria and ${openIssues} open issues`)
      }
    } else if (daysUntilSetup <= 7) {
      const highPriorityIssues = productionData.value.issues.filter(i => i.priority === 'high' && i.status !== 'resolved').length
      if (highPriorityIssues > 0) {
        warnings.push(`Setup is in ${daysUntilSetup} days with ${highPriorityIssues} high-priority issues`)
      }
    }
  }

  // Calculate overall data consistency score
  const consistencyScore = calculateDataConsistencyScore()

  if (consistencyScore < 70) {
    warnings.push(`Data consistency score is low (${consistencyScore}%) - review data integrity`)
  } else if (consistencyScore > 90) {
    info.push(`Excellent data consistency score (${consistencyScore}%)`)
  } else {
    info.push(`Data consistency score: ${consistencyScore}%`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info,
    consistencyScore
  }
}

// Calculate data consistency score based on various factors
const calculateDataConsistencyScore = (): number => {
  let score = 100

  // Deduct points for missing or inconsistent data
  if (!productionData.value.projectInfo.projectId) score -= 20
  if (!productionData.value.projectInfo.enquiryTitle) score -= 15
  if (!productionData.value.projectInfo.clientName || productionData.value.projectInfo.clientName === 'Unknown Client') score -= 10
  if (!productionData.value.projectInfo.eventVenue || productionData.value.projectInfo.eventVenue === 'TBC') score -= 5
  if (!productionData.value.projectInfo.setupDate || productionData.value.projectInfo.setupDate === 'TBC') score -= 5

  if (productionData.value.productionElements.length === 0) score -= 15
  if (productionData.value.qualityControl.length === 0 && productionData.value.productionElements.length > 0) score -= 10

  // Check for data relationships consistency
  const elementCategories = [...new Set(productionData.value.productionElements.map(e => e.category))]
  const qcCategories = productionData.value.qualityControl.map(qc => qc.categoryId)

  const missingQCCategories = elementCategories.filter(cat => !qcCategories.includes(cat))
  const orphanedQCCategories = qcCategories.filter(cat => !elementCategories.includes(cat))

  score -= missingQCCategories.length * 3
  score -= orphanedQCCategories.length * 2

  // Check for high-priority unresolved issues
  const criticalIssues = productionData.value.issues.filter(i => i.priority === 'high' && i.status !== 'resolved')
  score -= criticalIssues.length * 5

  // Check completion criteria progress
  if (productionData.value.completionCriteria.length > 0) {
    const completionRate = productionData.value.completionCriteria.filter(c => c.met).length / productionData.value.completionCriteria.length
    if (completionRate < 0.2) score -= 10
  }

  // Check for data quality issues
  const elementsWithInvalidQuantity = productionData.value.productionElements.filter(e => !e.quantity || e.quantity <= 0)
  score -= elementsWithInvalidQuantity.length * 2

  const elementsWithShortDesc = productionData.value.productionElements.filter(e => !e.description || e.description.length < 5)
  score -= elementsWithShortDesc.length * 1

  return Math.max(0, Math.min(100, score))
}

// Convert snake_case to camelCase for frontend compatibility
// convertToCamelCase moved to top

// Load existing data
const loadProductionData = async () => {
  try {
    const taskId = props.task.id.toString()
    const response = await api.get(`/api/projects/tasks/${taskId}/production`)

    if (response.data.success && response.data.data) {
      const data = response.data.data
      
      // Update production data with backend data (handling camelCase keys from service)
      if (data.productionElements) {
        productionData.value.productionElements = convertToCamelCase(data.productionElements)
      }

      if (data.relatedProcurementItems) {
        productionData.value.relatedProcurementItems = convertToCamelCase(data.relatedProcurementItems)
      }

      if (data.qualityControl) {
        productionData.value.qualityControl = convertToCamelCase(data.qualityControl)
      } else if (data.quality_control) { // Fallback for snake_case
        productionData.value.qualityControl = convertToCamelCase(data.quality_control)
      }

      if (data.issues) {
        productionData.value.issues = convertToCamelCase(data.issues)
      }

      if (data.completionCriteria) {
        productionData.value.completionCriteria = convertToCamelCase(data.completionCriteria)
      } else if (data.completion_criteria) { // Fallback for snake_case
        productionData.value.completionCriteria = convertToCamelCase(data.completion_criteria)
      }
    }

  } catch (error: any) {
    console.error('Failed to load production data:', error)
    // Continue with default data if loading fails
    if (error.response?.status !== 404) {
      console.warn('Production data loading failed, using default data')
    }
  }
}

// Retry save functionality
const retrySave = () => {
  saveError.value = null
  saveRetryCount.value = 0
  autoSave()
}

// Clear save error
const clearSaveError = () => {
  saveError.value = null
}

// Task status management
const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

// Skip Task Logic
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await api.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        updateStatus('skipped')
        showSkipModal.value = false
        skipReason.value = ''
        alert('Task skipped successfully')
    } catch (err: any) {
        console.error('Skip task error:', err)
        alert(err.response?.data?.message || 'Failed to skip task')
    } finally {
        isSkipping.value = false
    }
}

// Data persistence
const handleSubmit = async () => {
  const success = await manualSave()
  if (success) {
    emit('save', productionData.value)
  }
}

// Materials integration functionality
const isImportingMaterials = ref(false)
const materialsImportError = ref<string | null>(null)
const lastMaterialsImport = ref<Date | null>(null)

// Data persistence and API integration (State moved to top)

// Import materials from Materials Task
const importMaterialsFromTask = async () => {
  if (isImportingMaterials.value) return

  try {
    isImportingMaterials.value = true
    materialsImportError.value = null

    const taskId = props.task.id.toString()
    const response = await api.post(`/api/projects/tasks/${taskId}/production/import-materials`)

    if (response.data.success) {
      // Update production data with imported elements
      productionData.value.productionElements = response.data.data.productionElements || []
      productionData.value.qualityControl = response.data.data.qualityControl || []

      // Only update issues and completion criteria if they're empty (preserve user changes)
      if (productionData.value.issues.length === 0) {
        productionData.value.issues = response.data.data.issues || []
      }

      if (productionData.value.completionCriteria.length <= defaultCompletionCriteria.value.length) {
        productionData.value.completionCriteria = response.data.data.completionCriteria || defaultCompletionCriteria.value
      }

      lastMaterialsImport.value = new Date()

      console.log('Materials imported successfully:', {
        elementsCount: productionData.value.productionElements.length,
        qualityCheckpoints: productionData.value.qualityControl.length,
        issuesCount: productionData.value.issues.length,
        completionCriteria: productionData.value.completionCriteria.length
      })

      // Generate material-related completion criteria after successful import
      generateMaterialRelatedCriteria()

      // Trigger auto-save after successful import
      triggerAutoSave()
    }

  } catch (error: any) {
    console.error('Failed to import materials:', error)
    materialsImportError.value = error.response?.data?.error || error.message || 'Failed to import materials data'
  } finally {
    isImportingMaterials.value = false
  }
}

// Retry materials import
const retryMaterialsImport = () => {
  materialsImportError.value = null
  importMaterialsFromTask()
}

// Production elements utility functions
const getTotalQuantity = (): number => {
  return productionData.value.productionElements.reduce((total, element) => total + element.quantity, 0)
}

const getUniqueUnits = (): string[] => {
  return [...new Set(productionData.value.productionElements.map(element => element.unitOfMeasurement))]
}

function getCategoryTotalQuantity(categoryId: string): number {
  return getElementsByCategory(categoryId).reduce((total, element) => total + element.quantity, 0)
}

const getCategoryBorderClass = (categoryId: string): string => {
  const borders: Record<string, string> = {
    'stage': 'border-l-blue-500',
    'stage-skirting': 'border-l-emerald-500',
    'stage-backdrop': 'border-l-purple-500',
    'entrance-arc': 'border-l-amber-500',
    'walkway-dance-floor': 'border-l-rose-500'
  }
  return borders[categoryId] || 'border-l-slate-400'
}

const getCategoryBgClass = (categoryId: string): string => {
  const bgs: Record<string, string> = {
    'stage': 'bg-blue-500',
    'stage-skirting': 'bg-emerald-500',
    'stage-backdrop': 'bg-purple-500',
    'entrance-arc': 'bg-amber-500',
    'walkway-dance-floor': 'bg-rose-500'
  }
  return bgs[categoryId] || 'bg-slate-500'
}

// Category collapse/expand functionality
const expandedCategories = ref<Set<string>>(new Set())

function toggleCategoryCollapse(categoryId: string) {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

function isCategoryExpanded(categoryId: string): boolean {
  return expandedCategories.value.has(categoryId)
}

function isCategoryCollapsed(categoryId: string): boolean {
  return !expandedCategories.value.has(categoryId)
}

const getCategoryHeaderClass = (categoryId: string): string => {
  // Color coding based on category type (matching MaterialsTask pattern)
  const categoryColors: Record<string, string> = {
    'stage': 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    'stage-skirting': 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    'stage-backdrop': 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
    'entrance-arc': 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
    'walkway-dance-floor': 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
  }

  return categoryColors[categoryId] || 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
}

// Toggle all categories expand/collapse
const allCategoriesCollapsed = computed(() => {
  const categoryIds = new Set(productionData.value.productionElements.map(element => element.category))
  return categoryIds.size > 0 && Array.from(categoryIds).every(id => !expandedCategories.value.has(id))
})

const toggleAllCategories = () => {
  const categoryIds = new Set(productionData.value.productionElements.map(element => element.category))

  if (allCategoriesCollapsed.value) {
    // Expand all categories
    expandedCategories.value = new Set(categoryIds)
  } else {
    // Collapse all categories
    expandedCategories.value.clear()
  }
}

// Helper functions for Workflow Table


// Initialize component data
onMounted(async () => {
  // Update project info from props
  productionData.value.projectInfo = {
    ...productionData.value.projectInfo,
    ...projectInfo.value
  }

  // Load existing production data
  await loadProductionData()

  // Auto-import materials on component mount
  importMaterialsFromTask()
})

// Ensure all categories from elements exist in our definitions
const ensureCategoriesExist = () => {
  if (!productionData.value.productionElements) return

  const existingIds = new Set(productionElementCategories.value.map(c => c.id))
  
  productionData.value.productionElements.forEach(element => {
    if (element.category && !existingIds.has(element.category)) {
      // Add new category definition
      productionElementCategories.value.push({
        id: element.category,
        name: element.category,
        displayName: element.category.replace(/-/g, ' ').toUpperCase(),
        color: 'gray' // Default color
      })
      existingIds.add(element.category)
    }
  })
}

// Watch for changes in production elements to ensure categories exist
watch(() => productionData.value.productionElements, () => {
  ensureCategoriesExist()
}, { deep: true })
</script>

<style scoped>
/* Tab panel animations */
.tab-panel {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.animate-fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Tab button hover effects */

/* Focus styles for better accessibility */
button[role="tab"]:focus {
  z-index: 10;
}

/* Smooth scaling animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-102 {
  transform: scale(1.02);
}

.scale-105 {
  transform: scale(1.05);
}

.scale-110 {
  transform: scale(1.1);
}

/* Modal improvements */
.fixed.inset-0 {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* Issues tab specific styling */
.issues-section {
  padding: 0;
  margin: 0;
}

.issues-header {
  margin-bottom: 1.5rem;
}

/* Ensure proper spacing in issue items */
.issue-item {
  margin-bottom: 0;
}

.issue-item + .issue-item {
  margin-top: 1rem;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
