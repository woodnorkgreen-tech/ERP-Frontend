<template>
  <div class="logistics-task bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
    
    <!-- Simple Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <i class="mdi mdi-truck-delivery text-2xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project {{ projectInfo.projectId }}</span>
              <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ task.title }}</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {{ projectInfo.enquiryTitle }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="task.status === 'completed'"
            @click="revertTaskStatus"
            :disabled="isReverting"
            class="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <i class="mdi mdi-history text-lg"></i>
            <span>{{ isReverting ? 'Reverting...' : 'Reset to In Progress' }}</span>
          </button>
          
          <button
            @click="downloadPdfReport"
            :disabled="isDownloading"
            class="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="isDownloading" class="mdi mdi-loading mdi-spin text-lg"></i>
            <i v-else class="mdi mdi-file-pdf-box text-lg"></i> 
            {{ isDownloading ? 'Generating...' : 'Download PDF' }}
          </button>
        </div>
      </div>

      <!-- Information Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-account-tie text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Client</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.clientName }}</p>
          </div>
        </div>
        
        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-map-marker text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venue</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.eventVenue }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-account-star text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Officer</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.projectOfficer }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="text-slate-400 mt-0.5">
            <i class="mdi mdi-calendar-check text-lg"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Setup Date</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ formatDate(projectInfo.setupDate) }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Feedback Messages -->
    <TransitionGroup 
      name="list" 
      tag="div" 
      class="mb-8 space-y-3"
    >
      <div
        v-for="message in feedbackMessages"
        :key="message.id"
        class="flex items-center justify-between px-6 py-4 rounded-2xl border backdrop-blur-sm transition-all duration-300"
        :class="[
          {
            'bg-emerald-50/80 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200': message.type === 'success',
            'bg-rose-50/80 border-rose-100 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-200': message.type === 'error',
            'bg-amber-50/80 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200': message.type === 'warning',
            'bg-sky-50/80 border-sky-100 text-sky-800 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-200': message.type === 'info'
          }
        ]"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm">
             <i v-if="message.type === 'success'" class="mdi mdi-check-circle text-emerald-500"></i>
             <i v-else-if="message.type === 'error'" class="mdi mdi-alert-circle text-rose-500"></i>
             <i v-else-if="message.type === 'warning'" class="mdi mdi-alert text-amber-500"></i>
             <i v-else class="mdi mdi-information text-sky-500"></i>
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ message.type }}</p>
            <p class="text-xs font-bold">{{ message.message }}</p>
          </div>
        </div>
        <button
          @click="removeFeedbackMessage(message.id)"
          class="w-8 h-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
        >
          <i class="mdi mdi-close"></i>
        </button>
      </div>
    </TransitionGroup>


    <!-- Refined Tab Navigation -->
    <!-- Navigation Tabs -->
    <div class="mb-8 border-b border-slate-100 dark:border-slate-800">
      <nav class="flex space-x-8" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          class="relative py-4 text-xs font-bold transition-all"
          :class="activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
        >
          {{ tab.label }}
          <!-- Active Indicator -->
          <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></div>
          
          <!-- Badge -->
          <span
            v-if="getTabBadgeCount(tab.id) > 0"
            class="ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {{ getTabBadgeCount(tab.id) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container">


      <!-- Transport Details Tab -->
      <div
        v-show="activeTab === 'dispatch-planning'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <div class="flex items-center justify-between mb-6">
            <div>
               <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Transport Details</h3>
               <p class="text-xs text-slate-400 font-medium">Provide details for transport and delivery</p>
            </div>
            
            <div class="flex items-center gap-2">
               <button
                  @click="importLatestLog"
                  :disabled="isSavingPlanning"
                  class="h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <i class="mdi mdi-cloud-download text-lg"></i>
                  <span>Sync from Log</span>
                </button>
                <button
                  v-if="!isReadOnly"
                  @click="saveDispatchPlanning"
                  :disabled="isSavingPlanning"
                  class="h-9 px-4 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <i v-if="isSavingPlanning" class="mdi mdi-loading mdi-spin text-lg"></i>
                  <i v-else class="mdi mdi-content-save-check text-lg"></i>
                  <span>{{ isSavingPlanning ? 'Saving...' : 'Save Details' }}</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <!-- Card 1: Vehicle -->
           <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                     <i class="mdi mdi-truck text-xl"></i>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Vehicle Details</h4>
               </div>

               <div class="space-y-4">
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Vehicle Type</label>
                    <input v-model="logisticsData.logistics_planning.vehicle_type" type="text" placeholder="e.g. 10 Ton Truck" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Plate Number</label>
                    <input v-model="logisticsData.logistics_planning.vehicle_identification" type="text" placeholder="e.g. KCA 123X" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Driver</label>
                    <div class="relative">
                      <select v-model="logisticsData.logistics_planning.driver_name" @change="onSelectDriver(logisticsData.logistics_planning.driver_name || '')" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none outline-none">
                        <option value="">Select a driver...</option>
                        <option v-for="driver in drivers" :key="driver.id" :value="driver.name">{{ driver.name }}</option>
                        <option value="Third-party">Third-party Driver</option>
                      </select>
                      <i class="mdi mdi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Driver Contact</label>
                    <input v-model="logisticsData.logistics_planning.driver_contact" type="text" placeholder="Phone number" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
               </div>
           </div>

           <!-- Card 2: Route -->
           <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                     <i class="mdi mdi-map-marker-path text-xl"></i>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Route Details</h4>
               </div>

               <div class="space-y-4">
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Origin</label>
                    <input v-model="logisticsData.logistics_planning.route.origin" type="text" placeholder="Where from?" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Destination</label>
                    <input v-model="logisticsData.logistics_planning.route.destination" type="text" placeholder="Where to?" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Distance (KM)</label>
                    <input v-model.number="logisticsData.logistics_planning.route.distance" type="number" step="0.1" placeholder="Distance in KM" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Est. Duration</label>
                    <input v-model="logisticsData.logistics_planning.route.travel_time" type="text" placeholder="e.g. 2 hours" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
               </div>
           </div>

           <!-- Card 3: Schedule -->
           <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400">
                     <i class="mdi mdi-clock-fast text-xl"></i>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Schedule</h4>
               </div>

               <div class="space-y-4">
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Departure Time</label>
                    <input v-model="logisticsData.logistics_planning.timeline.departure_time" type="datetime-local" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Arrival Time</label>
                    <input v-model="logisticsData.logistics_planning.timeline.arrival_time" type="datetime-local" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Setup Start Time</label>
                    <input v-model="logisticsData.logistics_planning.timeline.setup_start_time" type="datetime-local" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
               </div>
           </div>
        </div>
      </div>

      <!-- Team Confirmation Tab -->
      <div
        v-show="activeTab === 'team-confirmation'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <div class="flex items-center justify-between mb-6">
            <div>
               <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Team Arrival</h3>
               <p class="text-xs text-slate-400 font-medium">Verify team members present at the site</p>
            </div>
            
            <button
               @click="refreshTeamData"
               class="h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
               <i class="mdi mdi-sync text-lg"></i>
               <span>Sync Team</span>
            </button>
        </div>

        <div v-if="teamDataState.isLoading" class="py-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
           <i class="mdi mdi-loading mdi-spin text-3xl text-indigo-500 mb-4"></i>
           <p class="text-sm font-bold text-slate-500">Loading team data...</p>
        </div>

        <div v-else-if="teamDataState.hasError" class="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/50 text-center">
           <i class="mdi mdi-alert-circle text-3xl text-amber-500 mb-4 block"></i>
           <h4 class="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">Could not load team data</h4>
           <p class="text-xs text-amber-700 dark:text-amber-400 mb-6">{{ teamDataState.errorMessage }}</p>
           <button @click="proceedWithoutTeamData" class="px-6 py-2 bg-amber-600 text-white text-[10px] font-bold uppercase rounded-xl">Proceed Anyway</button>
        </div>

        <div v-else class="space-y-6">
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(teamType, typeKey) in getTeamTypesByCategory('setup')" :key="typeKey" class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                 <div class="flex items-center justify-between mb-4">
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ teamType.name }}</h4>
                    <span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">{{ teamType.members.length }} Members</span>
                 </div>
                 <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <div v-for="member in teamType.members" :key="member.id" class="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                       <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">{{ member.name.charAt(0) }}</div>
                       <span class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ member.name }}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div class="p-6 bg-slate-900 dark:bg-slate-800 rounded-2xl border border-slate-800">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h4 class="text-sm font-bold text-white mb-1">Confirm Arrival</h4>
                    <p class="text-xs text-slate-400">Verifying that all assigned teams have arrived at the site</p>
                 </div>
                 <div class="flex items-center gap-6">
                    <label class="relative flex items-center cursor-pointer">
                      <input type="checkbox" v-model="logisticsData.team_confirmation.setup_teams_confirmed" class="sr-only peer" />
                      <div class="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                      <span class="ml-3 text-xs font-bold text-white uppercase tracking-wider">Confirmed</span>
                    </label>
                    <button @click="saveTeamConfirmation" class="h-10 px-6 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-all active:scale-95">Save Confirmation</button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Manifest Tab -->
      <div
        v-show="activeTab === 'loading-sheet'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <div class="flex items-center justify-between mb-8">
            <div>
               <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Manifest</h3>
               <p class="text-xs text-slate-400 font-medium">Manage items to be delivered</p>
            </div>
            
            <div class="flex items-center gap-2">
               <button
                  @click="importProductionElements"
                  :disabled="itemsState.isImporting"
                  class="h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <i v-if="itemsState.isImporting" class="mdi mdi-loading mdi-spin text-lg"></i>
                  <i v-else class="mdi mdi-import text-lg"></i>
                  <span>Sync Items</span>
                </button>
                <button
                  @click="openAddCustomItemModal"
                  class="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  <i class="mdi mdi-plus text-lg"></i>
                  <span>Add Item</span>
                </button>
            </div>
        </div>

        <!-- Rapid Manifest Entry (Inline Form) -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-4 opacity-0"
        >
          <div v-if="itemsState.isAddFormOpen" class="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <i class="mdi mdi-plus-box text-xl"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Rapid Manifest Entry</h4>
                <p class="text-[10px] text-slate-400 font-medium">Quickly add a custom item to the delivery list</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="md:col-span-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Item Name</label>
                <input v-model="customItemForm.name" type="text" placeholder="e.g. Stage Extension Brackets" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                <select v-model="customItemForm.main_category" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none">
                  <option value="">Select Category...</option>
                  <option v-for="cat in DEPLOYMENT_CATEGORIES" :key="cat" :value="cat">{{ cat.replace('_', ' ') }}</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Qty</label>
                  <input v-model.number="customItemForm.quantity" type="number" min="1" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Unit</label>
                  <input v-model="customItemForm.unit" type="text" placeholder="pcs" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3">
              <button @click="itemsState.isAddFormOpen = false" class="h-10 px-6 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
              <button 
                @click="addCustomTransportItem" 
                :disabled="!customItemForm.name || !customItemForm.main_category"
                class="h-10 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                Add to Manifest
              </button>
            </div>
          </div>
        </Transition>

        <div class="space-y-8">
           <!-- Category Groups -->
           <div v-for="group in groupedTransportItems" :key="group.mainCategory" class="space-y-4">
              <div class="flex items-center gap-3">
                 <div :class="['w-1.5 h-6 rounded-full', getCategoryColor(group.mainCategory)]"></div>
                 <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{{ group.category }}</h4>
                 <span class="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">{{ group.items.length }} Items</span>
              </div>

              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                 <table class="w-full text-left border-collapse">
                    <thead>
                       <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item</th>
                          <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Qty</th>
                          <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight</th>
                          <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Handling</th>
                          <th v-if="!isReadOnly" class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-20 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                       <tr v-for="item in group.items" :key="item.id" class="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td class="px-6 py-4">
                             <div v-if="isEditing(item.id)" class="space-y-2 py-2">
                                <input v-model="itemsState.editData[item.id].name" type="text" class="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                <input v-model="itemsState.editData[item.id].description" type="text" placeholder="Description" class="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs" />
                             </div>
                             <div v-else>
                                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ item.name }}</p>
                                <p v-if="item.description" class="text-xs text-slate-400 mt-0.5">{{ item.description }}</p>
                             </div>
                          </td>
                          <td class="px-6 py-4 text-center">
                             <div v-if="isEditing(item.id)" class="flex items-center justify-center gap-2">
                                <button @click="adjustQuantity(item.id, -1)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200">-</button>
                                <input v-model.number="itemsState.editData[item.id].quantity" type="number" class="w-12 h-8 text-center bg-transparent font-bold text-sm outline-none" />
                                <button @click="adjustQuantity(item.id, 1)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200">+</button>
                             </div>
                             <div v-else class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                                {{ item.quantity }} <span class="text-[10px] opacity-60 uppercase">{{ item.unit }}</span>
                             </div>
                          </td>
                          <td class="px-6 py-4 text-xs font-medium text-slate-500">
                             <input v-if="isEditing(item.id)" v-model="itemsState.editData[item.id].weight" type="text" class="w-20 h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                             <span v-else>{{ item.weight || '-' }}</span>
                          </td>
                          <td class="px-6 py-4 text-xs font-medium text-slate-500">
                             <input v-if="isEditing(item.id)" v-model="itemsState.editData[item.id].special_handling" type="text" class="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
                             <span v-else>{{ item.special_handling || '-' }}</span>
                          </td>
                          <td v-if="!isReadOnly" class="px-6 py-4 text-right">
                             <div v-if="isEditing(item.id)" class="flex items-center justify-end gap-2">
                                <button @click="saveEditedItem(item.id)" :disabled="itemsState.isSaving[item.id]" class="w-8 h-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                                   <i class="mdi mdi-check"></i>
                                </button>
                                <button @click="cancelEditingItem(item.id)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200">
                                   <i class="mdi mdi-close"></i>
                                </button>
                             </div>
                             <div v-else class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="startEditingItem(item)" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200">
                                   <i class="mdi mdi-pencil text-sm"></i>
                                </button>
                                <button @click="removeTransportItem(item.id.toString())" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100">
                                   <i class="mdi mdi-trash-can-outline text-sm"></i>
                                </button>
                             </div>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      <!-- Transport Log Tab -->
      <div
        v-show="activeTab === 'logistics-log'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <div class="mb-8">
           <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Transport Log</h3>
           <p class="text-xs text-slate-400 font-medium">Historical vehicle movements and logs</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden p-4">
          <LogisticsDataDisplay
            :task="task"
            :task-data="logisticsData"
            :enquiry-id="task.project_enquiry_id"
          />
        </div>
      </div>

      <!-- Checklist Tab -->
      <div
        v-show="activeTab === 'checklist'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
               <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Pre-Departure Checklist</h3>
               <p class="text-xs text-slate-400 font-medium">Verify items and safety protocols</p>
            </div>
            
            <div class="flex items-center gap-4">
               <div class="flex flex-col items-end">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Progress</span>
                  <div class="flex items-center gap-3">
                     <div class="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: checklistProgress + '%' }"></div>
                     </div>
                     <span class="text-xs font-bold text-emerald-600">{{ checklistProgress }}%</span>
                  </div>
               </div>
               <button
                  @click="generateChecklistFromItems"
                  class="h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <i class="mdi mdi-refresh text-lg"></i>
                  <span>Sync Items</span>
                </button>
            </div>
        </div>

        <!-- Sections grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items Checklist -->
          <div class="lg:col-span-2 space-y-4">
             <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Item Status</span>
                <span class="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">{{ checklist.items.length }} TOTAL</span>
             </div>

             <div v-if="checklist.items.length === 0" class="py-16 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <i class="mdi mdi-clipboard-check-outline text-3xl text-slate-300 mb-2 block"></i>
                <p class="text-xs text-slate-400 font-medium">Manifest is empty or not synced</p>
             </div>

             <div v-else class="space-y-2">
                <div v-for="ci in checklist.items" :key="ci.id" class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-4 transition-all hover:shadow-sm">
                   <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div class="flex items-center gap-3">
                         <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', ci.status === 'present' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400']">
                            <i :class="ci.status === 'present' ? 'mdi mdi-check-circle' : 'mdi mdi-cube-outline'"></i>
                         </div>
                         <div>
                            <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ ci.item_name }}</p>
                            <p v-if="ci.checkedBy" class="text-[10px] text-slate-400">Verified by {{ ci.checkedBy }}</p>
                         </div>
                      </div>

                      <div class="flex items-center gap-3">
                         <select v-model="ci.status" @change="touchChecklistItem(ci)" class="h-9 px-3 bg-slate-50 dark:bg-slate-900 border-0 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 outline-none ring-1 ring-slate-100 dark:ring-slate-700">
                            <option value="present">Present</option>
                            <option value="missing">Missing</option>
                            <option value="coming_later">Later</option>
                         </select>
                         <input v-model="ci.notes" @change="touchChecklistItem(ci)" type="text" placeholder="Add notes..." class="h-9 px-3 bg-slate-50 dark:bg-slate-900 border-0 rounded-lg text-xs text-slate-600 dark:text-slate-300 outline-none ring-1 ring-slate-100 dark:ring-slate-700 w-40" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Teams & Safety -->
          <div class="space-y-6">
            <!-- Team Presence -->
            <div class="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
               <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i class="mdi mdi-account-group text-lg text-indigo-500"></i>
                  Team Presence
               </h4>
               <div class="space-y-2">
                  <label v-for="(val, key) in checklist.teams" :key="key" class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-300 transition-colors">
                     <span class="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">{{ key }} Team Ready</span>
                     <input type="checkbox" v-model="checklist.teams[key]" @change="touchChecklistMeta()" class="w-5 h-5 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                  </label>
               </div>
            </div>

            <!-- Safety Protocols -->
            <div class="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
               <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i class="mdi mdi-shield-check text-lg text-rose-500"></i>
                  Safety Protocols
               </h4>
               <div class="space-y-2">
                  <label class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-rose-300 transition-colors">
                     <span class="text-xs font-bold text-slate-600 dark:text-slate-300">PPE Checked</span>
                     <input type="checkbox" v-model="checklist.safety.ppe" @change="touchChecklistMeta()" class="w-5 h-5 rounded border-slate-200 text-rose-600 focus:ring-rose-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-rose-300 transition-colors">
                     <span class="text-xs font-bold text-slate-600 dark:text-slate-300">First Aid Kit</span>
                     <input type="checkbox" v-model="checklist.safety.first_aid" @change="touchChecklistMeta()" class="w-5 h-5 rounded border-slate-200 text-rose-600 focus:ring-rose-500" />
                  </label>
                  <label class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-rose-300 transition-colors">
                     <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Fire Safety</span>
                     <input type="checkbox" v-model="checklist.safety.fire_extinguisher" @change="touchChecklistMeta()" class="w-5 h-5 rounded border-slate-200 text-rose-600 focus:ring-rose-500" />
                  </label>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Footer: Status & Actions -->
    <div class="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm', getStatusColor(task.status)]">
           <i :class="['mdi text-xl text-white', 
             task.status === 'completed' ? 'mdi-check-all' : 
             task.status === 'pending' ? 'mdi-clock-outline' : 'mdi-alert-circle-outline'
           ]"></i>
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Task Status</p>
          <div class="flex items-center gap-2">
             <h4 class="text-base font-bold text-slate-900 dark:text-white capitalize">{{ getStatusLabel(task.status) }}</h4>
             <span class="w-1 h-1 rounded-full bg-slate-300"></span>
             <p class="text-[10px] font-medium text-slate-400 uppercase">System Ready</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
          <button
            v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled' && !isReadOnly"
            @click="showSkipModal = true"
            class="h-10 px-6 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
          >
            Skip Task
          </button>

          <button
            v-if="['skipped', 'completed'].includes(task.status) && !isReadOnly"
            @click="$emit('update-status', 'pending')"
            class="h-10 px-6 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-amber-600 transition-all active:scale-95"
          >
            {{ task.status === 'skipped' ? 'Undo Skip' : 'Reopen Task' }}
          </button>
          
          <button
            v-if="task.status !== 'completed' && task.status !== 'cancelled' && !isReadOnly"
            @click="$emit('update-status', 'completed')"
            class="h-10 px-8 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <i class="mdi mdi-check-circle"></i>
            <span>Mark as Complete</span>
          </button>
      </div>
    </div>
    <!-- Removed Custom Item Modal -->

    <!-- Print Report Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPrintModal" class="fixed inset-0 z-[99999] overflow-y-auto print:relative print:z-auto" aria-labelledby="print-modal-title" role="dialog" aria-modal="true">
          <!-- Background overlay -->
          <Transition name="modal-bg">
            <div v-if="showPrintModal" class="fixed inset-0 bg-black bg-opacity-50 transition-opacity print:hidden" @click="closePrintModal"></div>
          </Transition>

          <!-- Modal container -->
          <div class="flex min-h-screen items-center justify-center p-4 print:p-0 print:min-h-0">
            <!-- Modal panel -->
            <div v-if="showPrintModal" class="relative bg-white w-full max-w-6xl rounded-lg shadow-2xl print:shadow-none print:max-w-none print:rounded-none">
              <!-- Action Buttons (Hidden when printing) -->
              <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden z-10">
                <h3 class="text-xl font-semibold text-gray-900" id="print-modal-title">
                  Logistics Manifest Report
                </h3>
                <div class="flex space-x-3">
                  <button
                    @click="printReport"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center font-medium shadow-sm"
                  >
                    <span>Print</span>
                  </button>
                  <button
                    @click="closePrintModal"
                    class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              <!-- Print Content -->
              <div class="px-6 py-8 print:px-8 print:py-6">
                <!-- Report Header -->
                <div class="text-center mb-8 pb-6 border-b-2 border-gray-300">
                  <div class="text-3xl font-bold text-gray-900 mb-2">LOGISTICS MANIFEST</div>
                  <div class="text-lg text-gray-600">{{ projectInfo.enquiryTitle || 'Untitled Project' }}</div>
                  <div class="text-sm text-gray-500 mt-2">Project #{{ projectInfo.enquiryNumber || 'N/A' }}</div>
                </div>

                <!-- Project Information Section -->
                <div class="mb-8">
                  <h4 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">PROJECT DETAILS</h4>
                  <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client Name</div>
                      <div class="text-sm text-gray-900 mt-1">{{ projectInfo.clientName || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Venue</div>
                      <div class="text-sm text-gray-900 mt-1">{{ projectInfo.eventVenue || 'TBC' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project Officer</div>
                      <div class="text-sm text-gray-900 mt-1">{{ projectInfo.projectOfficer || 'Unassigned' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Setup Date</div>
                      <div class="text-sm text-gray-900 mt-1">{{ formatDate(projectInfo.setupDate) }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Date</div>
                      <div class="text-sm text-gray-900 mt-1">{{ formatDate(projectInfo.eventDate) }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Person</div>
                      <div class="text-sm text-gray-900 mt-1">{{ projectInfo.contactPerson || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Phone</div>
                      <div class="text-sm text-gray-900 mt-1">{{ projectInfo.contactPhone || 'Not specified' }}</div>
                    </div>
                  </div>
                </div>

                <!-- Transportation Details Section -->
                <div class="mb-8 page-break-avoid">
                  <h4 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">TRANSPORTATION DETAILS</h4>
                  <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Type</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.vehicle_type || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle ID/Plate</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.vehicle_identification || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Driver Name</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.driver_name || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Driver Contact</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.driver_contact || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Origin</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.route?.origin || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Destination</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.route?.destination || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Departure Time</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.timeline?.departure_time || 'Not specified' }}</div>
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Arrival Time</div>
                      <div class="text-sm text-gray-900 mt-1">{{ logisticsData.logistics_planning?.timeline?.arrival_time || 'Not specified' }}</div>
                    </div>
                  </div>
                </div>

                <!-- Team Confirmation Section -->
                <div class="mb-8 page-break-avoid">
                  <h4 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">TEAM CONFIRMATION</h4>
                  <div class="flex items-center space-x-4 mb-2">
                    <div class="text-sm font-semibold text-gray-700">Setup Teams Status:</div>
                    <div class="px-3 py-1 rounded-full text-xs font-medium" :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ logisticsData.team_confirmation.setup_teams_confirmed ? 'CONFIRMED' : 'PENDING' }}
                    </div>
                  </div>
                  <div v-if="logisticsData.team_confirmation.notes" class="mt-3">
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</div>
                    <div class="text-sm text-gray-900 mt-1">{{ logisticsData.team_confirmation.notes }}</div>
                  </div>
                </div>

                <!-- Loading Sheet Section -->
                <div class="mb-8 page-break-before">
                  <h4 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">LOADING SHEET</h4>
                  <div v-if="logisticsData.transport_items && logisticsData.transport_items.length > 0">
                    <template v-for="group in groupedTransportItems" :key="group.category">
                      <div class="mb-6">
                        <h5 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <span class="w-3 h-3 rounded-full mr-2"
                            :class="group.mainCategory === 'PRODUCTION' ? 'bg-purple-500' : 
                                    group.mainCategory === 'TOOLS_EQUIPMENTS' ? 'bg-blue-500' :
                                    group.mainCategory === 'STORES' ? 'bg-green-500' :
                                    group.mainCategory === 'ELECTRICALS' ? 'bg-yellow-500' :
                                    group.mainCategory === 'CLIENT_ASSETS' ? 'bg-gray-500' : ''">
                          </span>
                          {{ group.category }}
                          <span class="ml-2 text-sm text-gray-500">({{ group.items.length }} items)</span>
                        </h5>
                        <table class="w-full text-sm border-collapse">
                          <thead>
                            <tr class="bg-gray-100 border-y border-gray-300">
                              <th class="text-left py-2 px-3 font-semibold text-gray-700">Item Name</th>
                              <th class="text-center py-2 px-3 font-semibold text-gray-700">Quantity</th>
                              <th class="text-left py-2 px-3 font-semibold text-gray-700">Weight</th>
                              <th class="text-left py-2 px-3 font-semibold text-gray-700">Special Handling</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in group.items" :key="item.id" class="border-b border-gray-200">
                              <td class="py-2 px-3">
                                <div class="font-medium text-gray-900">{{ item.name }}</div>
                                <div v-if="item.description" class="text-xs text-gray-600 mt-1">{{ item.description }}</div>
                              </td>
                              <td class="text-center py-2 px-3 text-gray-900">{{ item.quantity }} {{ item.unit }}</td>
                              <td class="py-2 px-3 text-gray-700">{{ item.weight || '-' }}</td>
                              <td class="py-2 px-3 text-gray-700">{{ item.special_handling || '-' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </template>
                  </div>
                  <div v-else class="text-gray-500 text-center py-8">
                    No items in loading sheet
                  </div>
                </div>

                <!-- Checklist Section -->
                <div class="mb-8 page-break-before">
                  <h4 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">CHECKLIST</h4>
                  
                  <!-- Checklist Items -->
                  <div v-if="checklist.items.length > 0" class="mb-6">
                    <h5 class="text-lg font-semibold text-gray-800 mb-3">Items Verification</h5>
                    <table class="w-full text-sm border-collapse">
                      <thead>
                        <tr class="bg-gray-100 border-y border-gray-300">
                          <th class="text-left py-2 px-3 font-semibold text-gray-700">Item</th>
                          <th class="text-center py-2 px-3 font-semibold text-gray-700">Status</th>
                          <th class="text-left py-2 px-3 font-semibold text-gray-700">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in checklist.items" :key="item.id" class="border-b border-gray-200">
                          <td class="py-2 px-3 text-gray-900">{{ item.item_name }}</td>
                          <td class="text-center py-2 px-3">
                            <span class="px-2 py-1 rounded text-xs font-medium"
                              :class="{
                                'bg-green-100 text-green-800': item.status === 'present',
                                'bg-red-100 text-red-800': item.status === 'missing',
                                'bg-yellow-100 text-yellow-800': item.status === 'coming_later'
                              }">
                              {{ item.status === 'present' ? 'Present' : item.status === 'missing' ? 'Missing' : 'Coming Later' }}
                            </span>
                          </td>
                          <td class="py-2 px-3 text-gray-700">{{ item.notes || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Team Presence -->
                  <div class="mb-6">
                    <h5 class="text-lg font-semibold text-gray-800 mb-3">Team Presence</h5>
                    <div class="grid grid-cols-3 gap-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl">{{ checklist.teams?.workshop ? '✓' : '✗' }}</span>
                        <span class="text-sm" :class="checklist.teams?.workshop ? 'text-green-700 font-medium' : 'text-gray-600'">Workshop Team</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl">{{ checklist.teams?.setup ? '✓' : '✗' }}</span>
                        <span class="text-sm" :class="checklist.teams?.setup ? 'text-green-700 font-medium' : 'text-gray-600'">Setup Team</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl">{{ checklist.teams?.setdown ? '✓' : '✗' }}</span>
                        <span class="text-sm" :class="checklist.teams?.setdown ? 'text-green-700 font-medium' : 'text-gray-600'">Setdown Team</span>
                      </div>
                    </div>
                  </div>

                  <!-- Safety Equipment -->
                  <div>
                    <h5 class="text-lg font-semibold text-gray-800 mb-3">Safety Equipment</h5>
                    <div class="grid grid-cols-3 gap-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl">{{ checklist.safety?.ppe ? '✓' : '✗' }}</span>
                        <span class="text-sm" :class="checklist.safety?.ppe ? 'text-green-700 font-medium' : 'text-gray-600'">PPE</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl">{{ checklist.safety?.first_aid ? '✓' : '✗' }}</span>
                        <span class="text-sm" :class="checklist.safety?.first_aid ? 'text-green-700 font-medium' : 'text-gray-600'">First Aid Kit</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-2xl">{{ checklist.safety?.fire_extinguisher ? '✓' : '✗' }}</span>
                        <span class="text-sm" :class="checklist.safety?.fire_extinguisher ? 'text-green-700 font-medium' : 'text-gray-600'">Fire Extinguisher</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Report Footer -->
                <div class="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                  <div class="mb-2">Generated on: {{ getReportTimestamp() }}</div>
                  <div>Prepared by: Logistics Department</div>
                  <div class="mt-4 text-xs text-gray-500">This is a computer-generated document. No signature is required.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Skip Task Modal -->
    <Teleport to="body">
      <div v-if="showSkipModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black bg-opacity-50">
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import LogisticsDataDisplay from './data-displays/LogisticsDataDisplay.vue'
import api from '@/plugins/axios'

import { useTeams } from '../../composables/useTeams'
import { useLogistics, type Driver } from '../../composables/useLogistics'
import type { EnquiryTask } from '../../types'

/**
 * Props interface for the LogisticsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Whether the task is in read-only mode */
  readonly?: boolean
}

/**
 * Events emitted by the LogisticsTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}

/**
 * Project information structure for the logistics task
 */
interface ProjectInfo {
  /** Unique project identifier */
  projectId: string
  /** Enquiry number for referencing */
  enquiryNumber?: string
  /** Title/name of the enquiry/project */
  enquiryTitle: string
  /** Name of the client for this project */
  clientName: string
  /** Venue where the event will take place */
  eventVenue: string
  /** Date when project setup begins (ISO date string) */
  setupDate: string
  /** Date when the event occurs (ISO date string or "tbc") */
  eventDate?: string
  /** Date when project set down occurs (ISO date string or "tbc") */
  setDownDate: string
  /** Estimated budget for the project */
  estimatedBudget?: number
  /** Contact person for the project */
  contactPerson: string
  /** Contact phone number */
  contactPhone?: string
  /** Project officer assigned */
  projectOfficer?: string
}

/**
 * User feedback message structure
 */
interface FeedbackMessage {
  /** Unique identifier */
  id: string
  /** Message type */
  type: 'success' | 'error' | 'warning' | 'info'
  /** Message text */
  message: string
  /** Timestamp when created */
  timestamp: Date
  /** Auto-dismiss timeout */
  timeout?: number
}

/**
 * Logistics planning data structure (matches database structure)
 */
interface LogisticsPlanning {
  vehicle_type?: string
  vehicle_identification?: string
  driver_name?: string
  driver_contact?: string
  route: {
    origin?: string
    destination?: string
    distance?: number
    travel_time?: string
  }
  timeline: {
    departure_time?: string
    arrival_time?: string
    setup_start_time?: string
  }
}

/**
 * Form validation errors structure
 */
interface ValidationErrors {
  [key: string]: string[]
}

/**
 * Team member structure (from TeamsTask)
 */
interface TeamMember {
  /** Unique identifier for the team member */
  id: string
  /** Name of the team member */
  name: string
  /** Timestamp when added */
  addedAt: Date
}

/**
 * Team type structure (from TeamsTask)
 */
interface TeamType {
  /** Unique identifier for the team type */
  id: string
  /** Display name of the team type */
  name: string
  /** Whether this team type is selected for the category */
  selected: boolean
  /** List of team members for this team type */
  members: TeamMember[]
}

/**
 * Team confirmation data structure
 */

/**
 * Individual team category confirmation
 */
interface TeamConfirmation {
  setup_teams_confirmed: boolean
  notes?: string
}

/**
 * Team data from TeamsTask integration
 */
interface TeamsTaskData {
  categories: {
    workshop: { teamTypes: Record<string, TeamType> }
    setup: { teamTypes: Record<string, TeamType> }
    setdown: { teamTypes: Record<string, TeamType> }
  }
}

/**
 * Main logistics task data structure
 */
interface LogisticsTaskData {
  /** Project information */
  projectInfo: ProjectInfo
  /** Logistics planning data (from database) */
  logistics_planning: LogisticsPlanning
  /** Team confirmation data */
  team_confirmation: TeamConfirmation
  /** Loading sheet items (transport items) */
  transport_items: TransportItem[]
  /** Checklist data */
  checklist: ChecklistData
  /** Task status */
  status: string
}

const DEPLOYMENT_CATEGORIES = ['PRODUCTION', 'TOOLS_EQUIPMENTS', 'STORES', 'ELECTRICALS', 'CLIENT_ASSETS'] as const
type DeploymentCategory = typeof DEPLOYMENT_CATEGORIES[number]

/**
 * Transport item structure
 */
interface TransportItem {
  id: number
  name: string
  description?: string
  quantity: number
  unit: string
  category: 'production' | 'custom'
  main_category?: DeploymentCategory  // Main loading sheet category
  element_category?: string  // Sub-category for production items (e.g., "Banners", "Signage", "Furniture")
  weight?: string
  special_handling?: string
  source?: string
}

/**
 * Checklist models
 */
interface ChecklistItem {
  id: string
  item_name: string
  status: 'present' | 'missing' | 'coming_later'
  notes?: string
  checkedBy?: string
  checkedAt?: Date
}

interface ChecklistData {
  items: ChecklistItem[]
  teams: { workshop: boolean; setup: boolean; setdown: boolean }
  safety: { ppe: boolean; first_aid: boolean; fire_extinguisher: boolean }
  equipment: { tools: boolean; vehicles: boolean; communication: boolean }
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isReadOnly = computed(() => props.readonly || props.task.status === 'completed')

// Initialize logistics composable
const logistics = useLogistics()

/**
 * User feedback messages
 */
const feedbackMessages = ref<FeedbackMessage[]>([])



/**
 * Modal state for print report
 */
const showPrintModal = ref(false)
const isDownloading = ref(false)

/**
 * Project information loading/error state
 */
const projectInfoState = ref<{
  hasErrors: boolean
  errorMessage?: string
  isLoading: boolean
}>({
  hasErrors: false,
  isLoading: false
})

/**
 * Team data state for integration with TeamsTask
 */
const teamDataState = ref<{
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  data?: TeamsTaskData
}>({
  isLoading: false,
  hasError: false
})

/**
 * Add feedback message
 */
const addFeedbackMessage = (type: FeedbackMessage['type'], message: string, timeout = 5000) => {
  const feedbackMessage: FeedbackMessage = {
    id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    message,
    timestamp: new Date(),
    timeout
  }

  feedbackMessages.value.push(feedbackMessage)

  // Auto-remove message after timeout
  if (timeout > 0) {
    setTimeout(() => {
      removeFeedbackMessage(feedbackMessage.id)
    }, timeout)
  }
}

/**
 * Dispatch planning state
 */
const isSavingPlanning = ref(false)
const isSavingTeamConfirmation = ref(false)
const initializeTeamConfirmation = (): TeamConfirmation => {
  return {
    setup_teams_confirmed: false,
    notes: ''
  }
}
const initialTeamConfirmation = ref<TeamConfirmation>(initializeTeamConfirmation())
const drivers = ref<Driver[]>([])

const fetchDrivers = async () => {
  try {
    drivers.value = await logistics.getDrivers()
  } catch (err) {
    console.error('Failed to fetch drivers:', err)
  }
}

const saveDispatchPlanning = async () => {
  try {
    isSavingPlanning.value = true
    await logistics.saveLogisticsPlanning(props.task.id, logisticsData.logistics_planning)
    addFeedbackMessage('success', 'Dispatch planning saved successfully')
  } catch (error) {
    console.error('Failed to save planning:', error)
    addFeedbackMessage('error', 'Failed to save dispatch planning')
  } finally {
    isSavingPlanning.value = false
  }
}

const onSelectDriver = (driverName: string) => {
  const driver = drivers.value.find(d => d.name === driverName)
  if (driver) {
    logisticsData.logistics_planning.driver_contact = driver.phone
  }
}

/**
 * Import latest data from logistics log
 */
const importLatestLog = async () => {
  try {
    isSavingPlanning.value = true
    const response = await api.get('/api/projects/logistics-log', {
      params: {
        project_id: props.task.project_enquiry_id,
        per_page: 1
      }
    })

    const logs = response.data?.data?.data || []
    if (logs.length === 0) {
      addFeedbackMessage('info', 'No transport logs found for this project')
      return
    }

    const latestLog = logs[0]
    
    // Map log fields to planning structure
    logisticsData.logistics_planning.vehicle_identification = latestLog.vehicle_allocated || logisticsData.logistics_planning.vehicle_identification
    logisticsData.logistics_planning.driver_name = latestLog.driver || logisticsData.logistics_planning.driver_name
    logisticsData.logistics_planning.route.destination = latestLog.site || logisticsData.logistics_planning.route.destination
    
    // Format dates for datetime-local
    const pivotDateForInput = (dateString: string) => {
      if (!dateString) return undefined
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return undefined
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
    }

    logisticsData.logistics_planning.timeline.departure_time = pivotDateForInput(latestLog.departure) || logisticsData.logistics_planning.timeline.departure_time
    logisticsData.logistics_planning.timeline.arrival_time = pivotDateForInput(latestLog.setdown_time) || logisticsData.logistics_planning.timeline.arrival_time

    // Try to auto-populate driver contact if we have drivers list
    if (latestLog.driver) {
      onSelectDriver(latestLog.driver)
    }

    addFeedbackMessage('success', 'Imported data from transport log. Please review and save.')
  } catch (error) {
    console.error('Failed to import log:', error)
    addFeedbackMessage('error', 'Failed to import transport log data')
  } finally {
    isSavingPlanning.value = false
  }
}

/**
 * Remove feedback message
 */
const removeFeedbackMessage = (messageId: string) => {
  const index = feedbackMessages.value.findIndex(msg => msg.id === messageId)
  if (index !== -1) {
    feedbackMessages.value.splice(index, 1)
  }
}

/**
 * Project info extraction logic from task.enquiry data
 * Handles graceful fallback for missing project information with error tracking
 */
const extractProjectInfo = (): ProjectInfo => {
  try {
    projectInfoState.value.isLoading = true
    projectInfoState.value.hasErrors = false

    const enquiry = props.task?.enquiry

    if (!enquiry) {
      projectInfoState.value.hasErrors = true
      projectInfoState.value.errorMessage = 'No project data available'
      addFeedbackMessage('warning', 'Project information is not available. Some features may be limited.')
    }

    const projectInfo: ProjectInfo = {
      projectId: enquiry?.job_number || enquiry?.enquiry_number || '',
      enquiryTitle: enquiry?.title || '',
      clientName: enquiry?.client?.full_name || enquiry?.contact_person || '',
      eventVenue: enquiry?.venue || '',
      setupDate: enquiry?.expected_delivery_date || '',
      setDownDate: '',
      contactPerson: enquiry?.contact_person || '',
      projectOfficer: enquiry?.project_officer?.name || ''
    }

    // Check for critical missing information
    const missingFields = []
    if (!projectInfo.projectId) missingFields.push('Project ID')
    if (!projectInfo.enquiryTitle) missingFields.push('Project Title')
    if (!projectInfo.clientName) missingFields.push('Client Name')

    if (missingFields.length > 0) {
      projectInfoState.value.hasErrors = true
      projectInfoState.value.errorMessage = `Missing project information: ${missingFields.join(', ')}`
      addFeedbackMessage('warning', `Some project information is missing: ${missingFields.join(', ')}`)
    }

    return projectInfo
  } catch (error) {
    projectInfoState.value.hasErrors = true
    projectInfoState.value.errorMessage = 'Failed to load project information'
    addFeedbackMessage('error', 'Failed to load project information. Please refresh the page.')

    // Return empty safe structure
    return {
      projectId: '',
      enquiryTitle: '',
      clientName: '',
      eventVenue: '',
      setupDate: '',
      setDownDate: '',
      contactPerson: ''
    }
  } finally {
    projectInfoState.value.isLoading = false
  }
}

/**
 * Initialize default logistics planning data
 */
const initializeLogisticsPlanning = (): LogisticsPlanning => {
  return {
    vehicle_type: '',
    vehicle_identification: '',
    driver_name: '',
    driver_contact: '',
    route: {
      origin: '',
      destination: '',
      distance: undefined,
      travel_time: ''
    },
    timeline: {
      departure_time: '',
      arrival_time: '',
      setup_start_time: ''
    }
  }
}

// Initialize logistics data on component mount
onMounted(async () => {
  try {
    // Fetch logistics data from backend
    const existingData = await logistics.fetchLogisticsData(props.task.id)

    // If data exists, update the local logisticsData
    if (existingData !== null) {
      // Ensure checklist has detailed defaults to handle legacy data
      if (existingData.checklist) {
        existingData.checklist = {
          items: existingData.checklist.items || [],
          teams: Object.assign({ 
            workshop: false, setup: false, setdown: false 
          }, existingData.checklist.teams || {}),
          safety: Object.assign({ 
            ppe: false, first_aid: false, fire_extinguisher: false 
          }, existingData.checklist.safety || {}),
          equipment: Object.assign({ 
            tools: false, vehicles: false, communication: false 
          }, existingData.checklist.equipment || {})
        }
      }

      // Ensure logistics_planning sub-objects exist
      if (existingData.logistics_planning) {
        if (!existingData.logistics_planning.route) {
          existingData.logistics_planning.route = {
            origin: '',
            destination: '',
            distance: undefined,
            travel_time: ''
          }
        }
        if (!existingData.logistics_planning.timeline) {
          existingData.logistics_planning.timeline = {
            departure_time: '',
            arrival_time: '',
            setup_start_time: ''
          }
        }
      }

      Object.assign(logisticsData, existingData)
      // Track initial state for change detection
      initialTeamConfirmation.value = JSON.parse(JSON.stringify(logisticsData.team_confirmation))
      addFeedbackMessage('success', 'Logistics data loaded successfully')
    } else {
      addFeedbackMessage('info', 'No logistics data found. Start by planning your logistics.')
    }

    // Fetch team data for confirmation
    await fetchTeamData()
    await fetchDrivers()



  } catch (error) {
    console.error('❌ [LogisticsTask] Failed to load logistics data:', error)
    addFeedbackMessage('warning', 'Using local data. Some features may be limited.')
  }
})

/**
 * Initialize team confirmation data
 */

/**
 * Safely initialize logistics data with error handling
 */
const initializeLogisticsData = (): LogisticsTaskData => {
  try {
    return {
      projectInfo: extractProjectInfo(),
      logistics_planning: initializeLogisticsPlanning(),
      team_confirmation: {
        setup_teams_confirmed: false,
        notes: ''
      },
      transport_items: [],
      checklist: { 
        items: [], 
        teams: { workshop: false, setup: false, setdown: false }, 
        safety: { ppe: false, first_aid: false, fire_extinguisher: false },
        equipment: { tools: false, vehicles: false, communication: false }
      },
      status: 'pending'
    }
  } catch (error) {
    console.error('Failed to initialize logistics data:', error)
    addFeedbackMessage('error', 'Failed to initialize logistics management. Please refresh the page.')

    // Return minimal safe structure
    return {
      projectInfo: {
        projectId: '',
        enquiryTitle: '',
        clientName: '',
        eventVenue: '',
        setupDate: '',
        setDownDate: '',
        contactPerson: ''
      },
      logistics_planning: initializeLogisticsPlanning(),
      team_confirmation: initializeTeamConfirmation(),
      transport_items: [],
      checklist: { 
        items: [], 
        teams: { workshop: false, setup: false, setdown: false }, 
        safety: { ppe: false, first_aid: false, fire_extinguisher: false },
        equipment: { tools: false, vehicles: false, communication: false }
      },
      status: 'pending'
    }
  }
}


/**
 * Main logistics data structure
 */
const logisticsData = reactive<LogisticsTaskData>(initializeLogisticsData())



/**
 * Fetch team data from TeamsTask integration
 */
const fetchTeamData = async (): Promise<void> => {
  try {
    teamDataState.value.isLoading = true
    teamDataState.value.hasError = false
    teamDataState.value.errorMessage = undefined

    // Use the useTeams composable to fetch real team data
    const teams = useTeams()

    // Find the teams task for this project (task type 'teams')
    const teamsTask = await findTeamsTaskForProject()

    if (!teamsTask) {
      teamDataState.value.hasError = true
      teamDataState.value.errorMessage = 'No teams task found for this project'
      addFeedbackMessage('warning', 'No teams task found. Please create teams first in the Teams Task.')
      return
    }

    // Fetch teams for the teams task (not the logistics task)
    await teams.fetchTeamsForTask(teamsTask.id)

    // Transform the data to match our expected structure
    const transformedData: TeamsTaskData = {
      categories: {
        workshop: { teamTypes: {} },
        setup: { teamTypes: {} },
        setdown: { teamTypes: {} }
      }
    }

    // Group teams by category and transform to our expected format
    teams.teamsTasks.value.forEach(team => {
      const categoryKey = (team.category?.category_key || 'workshop') as keyof TeamsTaskData['categories']
      console.log('Processing team:', team.id, 'Category:', categoryKey, 'Members:', team.members?.length || 0)

      if (transformedData.categories[categoryKey]) {
        const teamTypeKey = team.team_type?.type_key || `team-${team.id}`
        transformedData.categories[categoryKey].teamTypes[teamTypeKey] = {
          id: teamTypeKey,
          name: team.team_type?.display_name || team.category?.display_name || `${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} Team`,
          selected: true, // All teams from TeamsTask are considered selected
          members: (team.members || []).filter(member => member.is_active).map(member => ({
            id: member.id.toString(),
            name: member.member_name,
            addedAt: new Date(member.assigned_at)
          }))
        }
        console.log('Added team to category', categoryKey, ':', teamTypeKey, 'with', transformedData.categories[categoryKey].teamTypes[teamTypeKey].members.length, 'members')
      }
    })

    console.log('Final transformed data:', transformedData)

    teamDataState.value.data = transformedData
    addFeedbackMessage('success', 'Team data loaded successfully')

  } catch (error) {
    console.error('Failed to fetch team data:', error)
    teamDataState.value.hasError = true
    teamDataState.value.errorMessage = 'Failed to load team assignments'
    addFeedbackMessage('error', 'Failed to load team data. Please try again.')
  } finally {
    teamDataState.value.isLoading = false
  }
}

/**
 * Find the teams task for the current project
 */
const findTeamsTaskForProject = async (): Promise<{id: number, title: string} | null> => {
  try {
    // Get the project enquiry ID from the current task
    const enquiryId = props.task.project_enquiry_id

    if (!enquiryId) {
      console.warn('No enquiry ID found for current task')
      return null
    }

    // Make API call to fetch all tasks for this enquiry
    const response = await api.get(`/api/projects/enquiries/${enquiryId}/tasks`)
    
    // Find the teams task (task with type 'teams')
    const tasks = response.data.data || response.data
    const teamsTask = tasks.find((task: any) => task.type === 'teams')

    if (!teamsTask) {
      console.warn(`No teams task found for enquiry ${enquiryId}`)
      return null
    }

    return {
      id: teamsTask.id,
      title: teamsTask.title || 'Teams Management'
    }
  } catch (error) {
    console.error('Failed to find teams task:', error)
    addFeedbackMessage('warning', 'Could not find teams task. Make sure a Teams task exists for this project.')
    return null
  }
}

/**
 * Refresh team data
 */
const refreshTeamData = async (): Promise<void> => {
  await fetchTeamData()
}

/**
 * Get team types by category from TeamsTask data
 */
const getTeamTypesByCategory = (categoryId: 'workshop' | 'setup' | 'setdown'): Record<string, TeamType> => {
  if (!teamDataState.value.data) return {}
  return teamDataState.value.data.categories[categoryId]?.teamTypes || {}
}

/**
 * Get selected team types for a category
 */
const getSelectedTeamTypes = (categoryId: 'workshop' | 'setup' | 'setdown'): TeamType[] => {
  const teamTypes = getTeamTypesByCategory(categoryId)
  return Object.values(teamTypes).filter(teamType => teamType.selected)
}

/**
 * Get team types count for a category
 */
const getTeamTypesCount = (categoryId: 'workshop' | 'setup' | 'setdown'): number => {
  const teamTypes = getTeamTypesByCategory(categoryId)
  return Object.keys(teamTypes).length
}

/**
 * Get selected team types count for a category
 */
const getSelectedTeamTypesCount = (categoryId: 'workshop' | 'setup' | 'setdown'): number => {
  return getSelectedTeamTypes(categoryId).length
}

/**
 * Update team confirmation for a category
 */
const updateTeamConfirmation = (categoryId: 'workshop' | 'setup' | 'setdown'): void => {
  const selectedTeamTypes = getSelectedTeamTypes(categoryId)
  const teamTypes = selectedTeamTypes.map(tt => tt.id)
  const memberCount = selectedTeamTypes.reduce((sum, tt) => sum + tt.members.length, 0)

  // For now, we only handle setup teams
  if (categoryId === 'setup') {
    // No need to update team types since backend doesn't store them
  }
}

/**
 * Save team confirmation data
 */
const saveTeamConfirmation = async (): Promise<void> => {
  try {
    isSavingTeamConfirmation.value = true
    // Update all categories
    updateTeamConfirmation('workshop')
    updateTeamConfirmation('setup')
    updateTeamConfirmation('setdown')

    // Save to backend
    await logistics.updateTeamConfirmation(props.task.id, {
      setup_teams_confirmed: logisticsData.team_confirmation.setup_teams_confirmed,
      notes: logisticsData.team_confirmation.notes
    })

    // Update initial state after successful save
    initialTeamConfirmation.value = JSON.parse(JSON.stringify(logisticsData.team_confirmation))
    
    addFeedbackMessage('success', 'Team confirmation saved successfully')
  } catch (error) {
    console.error('Failed to save team confirmation:', error)
    addFeedbackMessage('error', 'Failed to save team confirmation. Please try again.')
  } finally {
    isSavingTeamConfirmation.value = false
  }
}

/**
 * Check if there are team confirmation changes
 */
const hasTeamConfirmationChanges = computed((): boolean => {
  const current = logisticsData.team_confirmation
  const initial = initialTeamConfirmation.value
  
  return current.setup_teams_confirmed !== initial.setup_teams_confirmed ||
         current.notes !== initial.notes
})

/**
 * Items management state
 */
// Items State
const itemsState = reactive({
  loading: false,
  error: null as string | null,
  importError: null as string | null,
  isImporting: false,
  isAddFormOpen: false,
  searchQuery: '',
  editingItemId: null as number | null,
  editData: {} as Record<number, Partial<TransportItem>>,
  isSaving: {} as Record<number, boolean>,
  validationErrors: {} as Record<number, Record<string, string>>
})

// Standalone ref for modal visibility (better reactivity)
// Removed: isAddCustomItemModalOpen


// Custom Item Form State
const customItemForm = reactive({
  name: '',
  main_category: '' as DeploymentCategory | '',
  quantity: 1,
  unit: 'pcs',
  weight: '',
  special_handling: '',
  description: ''
})


/**
 * Reset form function for itemsState
 */
const resetItemsForm = () => {
  Object.assign(customItemForm, {
    name: '',
    main_category: '',
    description: '',
    quantity: 1,
    unit: 'pcs',
    weight: '',
    special_handling: ''
  })
}

/**
 * Check if item is in edit mode
 */
const isEditing = (itemId: number): boolean => {
  return itemsState.editingItemId === itemId
}

/**
 * Start editing an item
 */
const startEditingItem = (item: TransportItem) => {
  itemsState.editingItemId = item.id
  // Clone item data for editing
  itemsState.editData[item.id] = {
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    weight: item.weight,
    special_handling: item.special_handling
  }
  // Clear any previous validation errors
  delete itemsState.validationErrors[item.id]
}

/**
 * Cancel editing an item
 */
const cancelEditingItem = (itemId: number) => {
  itemsState.editingItemId = null
  delete itemsState.editData[itemId]
  delete itemsState.validationErrors[itemId]
}

/**
 * Validate item data
 */
const validateItemData = (itemId: number): boolean => {
  const data = itemsState.editData[itemId]
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required'
  } else if (data.name.length > 255) {
    errors.name = 'Name must be less than 255 characters'
  }

  if (!data.quantity || data.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1'
  }

  if (!data.unit || data.unit.trim().length === 0) {
    errors.unit = 'Unit is required'
  } else if (data.unit.length > 50) {
    errors.unit = 'Unit must be less than 50 characters'
  }

  itemsState.validationErrors[itemId] = errors
  return Object.keys(errors).length === 0
}

/**
 * Save edited item
 */
const saveEditedItem = async (itemId: number) => {
  if (!validateItemData(itemId)) {
    addFeedbackMessage('warning', 'Please fix validation errors before saving')
    return
  }

  try {
    itemsState.isSaving[itemId] = true
    const editData = itemsState.editData[itemId]

    const updatedItem = await logistics.updateTransportItem(props.task.id, itemId, editData)

    // Update local state
    const index = logisticsData.transport_items?.findIndex(i => i.id === itemId)
    if (index !== undefined && index >= 0 && logisticsData.transport_items) {
      logisticsData.transport_items[index] = updatedItem
    }

    // Clear edit state
    itemsState.editingItemId = null
    delete itemsState.editData[itemId]
    delete itemsState.validationErrors[itemId]

    addFeedbackMessage('success', 'Item updated successfully')
  } catch (error) {
    console.error('Failed to update item:', error)
    addFeedbackMessage('error', 'Failed to update item. Please try again.')
  } finally {
    delete itemsState.isSaving[itemId]
  }
}

/**
 * Quick adjust quantity
 */
const adjustQuantity = (itemId: number, delta: number) => {
  if (!itemsState.editData[itemId]) return
  const currentQty = itemsState.editData[itemId].quantity || 0
  const newQty = Math.max(1, currentQty + delta)
  itemsState.editData[itemId].quantity = newQty
}

/**
 * Filtered transport items by search
 */
const filteredTransportItems = computed<TransportItem[]>(() => {
  const query = itemsState.searchQuery.trim().toLowerCase()
  const items = logisticsData.transport_items || []
  if (!query) return items
  return items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.description || '').toLowerCase().includes(query)
  )
})

/**
 * Grouped transport items for loading sheet
 */
const groupedTransportItems = computed(() => {
  const items = filteredTransportItems.value || []
  const groups: Record<string, { category: string, mainCategory: string, items: TransportItem[] }> = {}
  
  // Standard categories to ensure order
  const standardCats = ['PRODUCTION', 'TOOLS_EQUIPMENTS', 'STORES', 'ELECTRICALS', 'CLIENT_ASSETS']
  
  items.forEach(item => {
    const mainCat = item.main_category || 'OTHER'
    if (!groups[mainCat]) {
      groups[mainCat] = {
        category: mainCat === 'OTHER' ? 'Other Items' : mainCat.replace('_', ' '),
        mainCategory: mainCat,
        items: []
      }
    }
    groups[mainCat].items.push(item)
  })

  // Return sorted groups: standard first, then others
  return Object.values(groups).sort((a, b) => {
    const idxA = standardCats.indexOf(a.mainCategory)
    const idxB = standardCats.indexOf(b.mainCategory)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.category.localeCompare(b.category)
  })
})



/**
 * Get category color for UI elements
 */
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'PRODUCTION': return 'bg-purple-500'
    case 'TOOLS_EQUIPMENTS': return 'bg-blue-500'
    case 'STORES': return 'bg-green-500'
    case 'ELECTRICALS': return 'bg-amber-500'
    case 'CLIENT_ASSETS': return 'bg-rose-500'
    default: return 'bg-slate-500'
  }
}

/**
 * Get category icon for UI elements
 */
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'PRODUCTION': return 'mdi-factory'
    case 'TOOLS_EQUIPMENTS': return 'mdi-tools'
    case 'STORES': return 'mdi-warehouse'
    case 'ELECTRICALS': return 'mdi-lightning-bolt'
    case 'CLIENT_ASSETS': return 'mdi-domain'
    default: return 'mdi-cube-outline'
  }
}

const importProductionElements = async () => {
  try {
    itemsState.isImporting = true
    itemsState.importError = ''

    const importedItems = await logistics.importProductionElements(props.task.id)

    // Update local state
    if (!logisticsData.transport_items) logisticsData.transport_items = []
    const existingIds = new Set(logisticsData.transport_items.map(i => i.id))
    importedItems.forEach(item => {
      if (!existingIds.has(item.id)) {
        logisticsData.transport_items!.push(item)
      }
    })

    if (importedItems.length > 0) {
      addFeedbackMessage('success', `${importedItems.length} elements imported successfully`)
    } else {
      addFeedbackMessage('info', 'No elements found to import. Please ensure the materials task has been populated.')
    }
  } catch (error: any) {
    console.error('Failed to import elements', error)
    console.debug('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    })

    // Provide more specific error messages based on the error response
    let errorMessage = 'Failed to import elements.'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    itemsState.importError = errorMessage
    addFeedbackMessage('error', errorMessage)
  } finally {
    itemsState.isImporting = false
  }
}

/**
 * Add a custom transport item
 */
const addCustomTransportItem = async () => {
  if (!customItemForm.name || !customItemForm.quantity || !customItemForm.unit || !customItemForm.main_category) {
    addFeedbackMessage('error', 'Please fill in all required fields including category')
    return
  }

  try {
    const newItem = await logistics.addTransportItem(props.task.id, {
      name: customItemForm.name?.trim(),
      description: customItemForm.description?.trim() || undefined,
      quantity: customItemForm.quantity,
      unit: customItemForm.unit?.trim(),
      category: 'custom',
      main_category: customItemForm.main_category,
      weight: customItemForm.weight?.trim() || undefined,
      special_handling: customItemForm.special_handling?.trim() || undefined,
      source: 'manual'
    })

    // Update local state
    if (!logisticsData.transport_items) logisticsData.transport_items = []
    logisticsData.transport_items.push(newItem)
    
    // Reset form
    Object.assign(customItemForm, {
      name: '',
      main_category: '',
      quantity: 1,
      unit: 'pcs',
      weight: '',
      special_handling: '',
      description: ''
    })

    // Clear form on success
    Object.assign(customItemForm, {
      name: '',
      // We keep the main_category selected for convenience
      quantity: 1,
      unit: 'pcs',
      weight: '',
      special_handling: '',
      description: ''
    })

    addFeedbackMessage('success', 'Item added successfully')
  } catch (error: any) {
    console.error('❌ Failed to add item', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    })
    addFeedbackMessage('error', `Failed to add item: ${error.response?.data?.message || error.message}`)
  }
}

// Inline Form Control
const openAddCustomItemModal = () => {
  itemsState.isAddFormOpen = !itemsState.isAddFormOpen
}

const closeAddCustomItemModal = () => {
  // Modal is removed, reset form manually if needed
  Object.assign(customItemForm, {
    name: '',
    main_category: '' as any,
    quantity: 1,
    unit: 'pcs',
    weight: '',
    special_handling: '',
    description: ''
  })
}

/**
 * Remove a transport item
 */
const removeTransportItem = async (id: string) => {
  try {
    const numericId = parseInt(id)
    await logistics.deleteTransportItem(props.task.id, numericId)

    // Update local state
    if (!logisticsData.transport_items) return
    const idx = logisticsData.transport_items.findIndex(i => parseInt(i.id as any) === numericId)
    if (idx >= 0) {
      logisticsData.transport_items.splice(idx, 1)
      addFeedbackMessage('info', 'Item removed')
    }
  } catch (error) {
    console.error('Failed to remove transport item:', error)
    addFeedbackMessage('error', 'Failed to remove item. Please try again.')
  }
}

/**
 * Proceed without team data
 */
const proceedWithoutTeamData = (): void => {
  teamDataState.value.hasError = false
  teamDataState.value.errorMessage = undefined
  teamDataState.value.data = undefined
  addFeedbackMessage('info', 'Proceeding without team data. Team confirmation features will be limited.')
}

/**
 * Check if setup teams are confirmed (only checking setup since we only show setup teams)
 */
const isAllTeamsConfirmed = computed((): boolean => {
  return logisticsData.team_confirmation.setup_teams_confirmed
})

// Tab navigation with enhanced functionality
// Tab navigation with enhanced functionality
const activeTab = ref('dispatch-planning')

const tabs = [
  { id: 'dispatch-planning', label: 'Dispatch Planning', description: 'Plan vehicle, driver, and transport route' },
  { id: 'team-confirmation', label: 'Team Assignment', description: 'Check team members assigned to this project' },
  { id: 'loading-sheet', label: 'Delivery List', description: 'List of items to be transported and delivered' },
  { id: 'logistics-log', label: 'Transport Log', description: 'Track vehicle movements and transport times' },
  { id: 'checklist', label: 'Final Check', description: 'Final check of items, teams, and safety' }
]

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

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Enhanced keyboard navigation for tabs
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
  const tabButton = document.getElementById(`tab-${newTab.id}`)
  if (tabButton) {
    tabButton.focus()
  }
}

// Tab badge functionality
const getTabBadgeCount = (tabId: string): number => {
  switch (tabId) {

    case 'team-confirmation':
      // Count unconfirmed setup teams only (since we only show setup teams)
      return logisticsData.team_confirmation?.setup_teams_confirmed ? 0 : 1
    case 'loading-sheet':
      return (logisticsData.transport_items?.length || 0)
    case 'checklist':
      // Incomplete checklist items
      const items = logisticsData.checklist?.items || []
      return items.filter(i => i.status !== 'present').length
    default:
      return 0
  }
}

const getTabBadgeClass = (tabId: string): string => {
  const count = getTabBadgeCount(tabId)
  if (count === 0) return ''

  // Different colors for different tab types
  switch (tabId) {

    case 'team-confirmation':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'loading-sheet':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'checklist':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

/**
 * Computed property for project info
 */
const projectInfo = computed(() => logisticsData.projectInfo)

/**
 * Format date for display with enhanced error handling
 */
const formatDate = (dateVal: string | Date | undefined | null): string => {
  if (!dateVal) {
    return '-'
  }

  try {
    const date = typeof dateVal === 'string' ? new Date(dateVal) : dateVal

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateVal)
      return 'TBC'
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting date:', dateVal, error)
    return 'TBC'
  }
}

/**
 * Format checklist date for display (short format)
 */
const formatChecklistDate = (dateVal: Date | string): string => {
  if (!dateVal) return ''
  try {
    const date = new Date(dateVal)
    // Check if date is valid
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  } catch (error) {
    return ''
  }
}

/**
 * Format currency for display with error handling
 */
const formatCurrency = (amount: number): string => {
  try {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0'
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  } catch (error) {
    console.warn('Error formatting currency:', amount, error)
    return '0'
  }
}

/**
 * Checklist reactive helpers
 */
const checklist = computed(() => logisticsData.checklist || { 
  items: [], 
  teams: { workshop: false, setup: false, setdown: false }, 
  safety: { ppe: false, first_aid: false, fire_extinguisher: false },
  equipment: { tools: false, vehicles: false, communication: false }
})

const checklistProgress = computed(() => {
  const items = checklist.value.items
  const total = items.length
  const completed = items.filter(i => i.status === 'present').length
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
})

const generateChecklistFromItems = async () => {
  try {
    const checklist = await logistics.generateChecklist(props.task.id)

    // Update local state
    logisticsData.checklist = checklist

    // Save the generated checklist to persist it
    await logistics.updateChecklist(props.task.id, checklist)

    addFeedbackMessage('success', 'Checklist generated and saved successfully')
  } catch (e) {
    console.error('Checklist generation failed', e)
    addFeedbackMessage('error', 'Failed to generate checklist')
  }
}

/**
 * Print the logistics report
 */
const printReport = () => {
  window.print()
}

/**
 * Download PDF report
 */
const downloadPdfReport = async () => {
  try {
    isDownloading.value = true
    addFeedbackMessage('info', 'Generating PDF report...')
    await logistics.downloadPdf(props.task.id)
    addFeedbackMessage('success', 'PDF Report downloaded successfully')
  } catch (error: any) {
    console.error('Failed to download PDF:', error)
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to download PDF report'
    addFeedbackMessage('error', errorMessage)
  } finally {
    isDownloading.value = false
  }
}

/**
 * Close print modal
 */
const closePrintModal = () => {
  showPrintModal.value = false
}

/**
 * Get current timestamp for report
 */
const getReportTimestamp = () => {
  return new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  })
}

const touchChecklistItem = async (item: ChecklistItem) => {
  item.checkedAt = new Date()

  // Save checklist changes to backend
  try {
    console.log('💾 Saving checklist item update:', item)
    if (logisticsData.checklist) {
      const result = await logistics.updateChecklist(props.task.id, logisticsData.checklist)
      console.log('✅ Checklist item saved successfully:', result)
    }
  } catch (error) {
    console.error('❌ Failed to save checklist item update:', error)
    addFeedbackMessage('error', 'Failed to save checklist changes')
  }
}

const touchChecklistMeta = async () => {
  // Save checklist changes to backend
  try {
    console.log('💾 Saving checklist metadata update')
    if (logisticsData.checklist) {
      const result = await logistics.updateChecklist(props.task.id, logisticsData.checklist)
      console.log('✅ Checklist metadata saved successfully:', result)
    }
  } catch (error: any) {
    console.error('❌ Failed to save checklist meta update:', error)
    let errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save checklist changes'
    
    // Extract specific validation error if available
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        errorMessage = firstError[0]
      }
    }

    addFeedbackMessage('error', errorMessage)
  }
}

/**
 * Get status color classes
 */
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'skipped':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

/**
 * Get status label
 */
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'in_progress':
      return 'In Progress'
    case 'pending':
      return 'Pending'
    case 'cancelled':
      return 'Cancelled'
    case 'skipped':
      return 'Skipped'
    default:
      return 'Unknown'
  }
}

/**
 * Watch for task prop changes and reinitialize if needed
 */
watch(
  () => props.task,
  (newTask) => {
    try {
      if (newTask && newTask.enquiry) {
        // Reinitialize project info if task changes
        const newProjectInfo = extractProjectInfo()
        Object.assign(logisticsData.projectInfo, newProjectInfo)

        // Fetch team data when task changes
        fetchTeamData()
      }
    } catch (error) {
      console.error('Error updating task data:', error)
      addFeedbackMessage('error', 'Failed to update project information')
    }
  },
  { deep: true }
)

/**
 * Initialize team data on component mount
 */
onMounted(() => {
  fetchTeamData()
})
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
        emit('update-status', 'skipped')
        showSkipModal.value = false
        skipReason.value = ''
        addFeedbackMessage('success', 'Task skipped successfully')
    } catch (err: any) {
        console.error('Skip task error:', err)
        addFeedbackMessage('error', err.response?.data?.message || 'Failed to skip task')
    } finally {
        isSkipping.value = false
    }
}

const isReverting = ref(false)

const revertTaskStatus = async () => {
  if (!confirm('Are you sure you want to revert this task to "In Progress"?\n\nThis will re-enable editing for all fields.')) {
    return
  }

  isReverting.value = true
  try {
    await api.put(`/api/projects/tasks/${props.task.id}/status`, {
      status: 'in_progress',
      notes: 'Reverted by user'
    })
    
    // Emit update to parent
    emit('update-status', 'in_progress')
    
    // Update local status if needed (though prop update should handle it)
    logisticsData.status = 'in_progress'
    
    addFeedbackMessage('success', 'Task reverted to In Progress')
  } catch (err: any) {
    console.error('Revert task error:', err)
    addFeedbackMessage('error', err.response?.data?.message || 'Failed to revert task status')
  } finally {
    isReverting.value = false
  }
}

</script>

<style scoped>
/* Tab panel animations */


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

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Feedback List Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-bg-enter-active,
.modal-bg-leave-active {
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-bg-enter-from,
.modal-bg-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Screen reader only class for accessibility announcements */
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

/* Print Styles - Optimize for professional logistics manifest printing */
@media print {
  /* Hide all interactive and navigation elements */
  .print\\:hidden,
  nav,
  header,
  .sidebar,
  button:not(.print-safe) {
    display: none !important;
  }

  /* Reset modal for printing */
  .print\\:relative {
    position: relative !important;
  }

  .print\\:z-auto {
    z-index: auto !important;
  }

  .print\\:p-0 {
    padding: 0 !important;
  }

  .print\\:min-h-0 {
    min-height: 0 !important;
  }

  .print\\:shadow-none {
    box-shadow: none !important;
  }

  .print\\:max-w-none {
    max-width: none !important;
  }

  .print\\:rounded-none {
    border-radius: 0 !important;
  }

   .print\\:px-8 {
    padding-left: 2rem !important;
    padding-right: 2rem !important;
  }

  .print\\:py-6 {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }

  /* Page setup */
  @page {
    size: A4;
    margin: 1.5cm;
  }

  /* Ensure colors and backgrounds are printed */
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Force white background for printed pages */
  body {
    background: white !important;
  }

  /* Page break control */
  .page-break-before {
    page-break-before: always;
  }

  .page-break-after {
    page-break-after: always;
  }

  .page-break-avoid {
    page-break-inside: avoid;
  }

  /* Ensure tables don't break across pages */
  table {
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
  }

  /* Optimize font sizes for printing */
  body {
    font-size: 10pt;
    line-height: 1.4;
  }

  h1 {
    font-size: 24pt;
  }

  h2, h3 {
    font-size: 16pt;
  }

  h4 {
    font-size: 14pt;
  }

  h5 {
    font-size: 12pt;
  }

  /* Remove shadows and effects */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* Ensure dark text on white background */
  .text-gray-900 {
    color: #111827 !important;
  }

  .text-gray-700 {
    color: #374151 !important;
  }

  .text-gray-600 {
    color: #4B5563 !important;
  }

  .text-gray-500 {
    color: #6B7280 !important;
  }

  /* Preserve status colors */
  .bg-green-100 {
    background-color: #D1FAE5 !important;
  }

  .text-green-800 {
    color: #065F46 !important;
  }

  .bg-yellow-100 {
    background-color: #FEF3C7 !important;
  }

  .text-yellow-800 {
    color: #92400E !important;
  }

  .bg-red-100 {
    background-color: #FEE2E2 !important;
  }

  .text-red-800 {
    color: #991B1B !important;
  }

  /* Preserve category colors */
  .bg-purple-500 {
    background-color: #A855F7 !important;
  }

  .bg-blue-500 {
    background-color: #3B82F6 !important;
  }

  .bg-green-500 {
    background-color: #10B981 !important;
  }

  .bg-yellow-500 {
    background-color: #F59E0B !important;
  }

  /* Border colors */
  .border-gray-300 {
    border-color: #D1D5DB !important;
  }

  .border-gray-200 {
    border-color: #E5E7EB !important;
  }

  /* Background colors */
  .bg-gray-100 {
    background-color: #F3F4F6 !important;
  }

  /* Optimize table printing */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #D1D5DB;
    padding: 8px;
  }

  th {
    background-color: #F3F4F6 !important;
    font-weight: 600;
  }
}
</style>
