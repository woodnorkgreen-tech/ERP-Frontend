<template>
  <div class="logistics-task bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-sm p-4 sm:p-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    
    <!-- Premium Header Section -->
    <div class="mb-10">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <i class="mdi mdi-truck-delivery text-3xl"></i>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-1.5">
              <span class="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-lg tracking-wider">PROJECT {{ projectInfo.projectId }}</span>
              <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{{ task.title }}</span>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none group flex items-center gap-3">
              {{ projectInfo.enquiryTitle }}
              <i class="mdi mdi-check-decagram text-blue-500 text-xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-3">
             <button
                v-if="task.status === 'completed'"
                @click="revertTaskStatus"
                :disabled="isReverting"
                class="h-11 px-6 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 border border-slate-200 dark:border-slate-800"
              >
                <i class="mdi mdi-history text-lg"></i>
                <span>{{ isReverting ? 'Reverting...' : 'Revert to In Progress' }}</span>
              </button>
              
              <button
                @click="downloadPdfReport"
                :disabled="isDownloading"
                class="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
              >
                <i v-if="isDownloading" class="mdi mdi-loading mdi-spin text-lg"></i>
                <i v-else class="mdi mdi-file-pdf-box text-lg"></i> 
                {{ isDownloading ? 'Generating...' : 'Download PDF' }}
              </button>
        </div>
      </div>

      <!-- Modern Information Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:flex lg:items-center gap-y-6 gap-x-12 py-6 px-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
            <i class="mdi mdi-account-tie text-xl"></i>
          </div>
          <div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.clientName }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
            <i class="mdi mdi-map-marker text-xl"></i>
          </div>
          <div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Venue</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.eventVenue }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
            <i class="mdi mdi-account-star text-xl"></i>
          </div>
          <div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Project Officer</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ projectInfo.projectOfficer }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
            <i class="mdi mdi-calendar-check text-xl"></i>
          </div>
          <div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Setup Date</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ formatDate(projectInfo.setupDate) }}</p>
          </div>
        </div>

        <div class="lg:ml-auto flex items-center gap-3 px-4 py-2 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/20">
           <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Operational Live</span>
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
    <div class="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-slate-800/50">
      <nav class="flex space-x-10" role="tablist">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          class="relative py-5 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300"
          :class="activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
        >
          {{ tab.label }}
          <!-- Active Indicator -->
          <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>
          
          <!-- Tab Badge -->
          <span
            v-if="getTabBadgeCount(tab.id) > 0"
            class="ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          >
            {{ getTabBadgeCount(tab.id) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container">


      <!-- Dispatch & Route Planning Tab -->
      <div
        v-show="activeTab === 'dispatch-planning'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <div class="flex items-center justify-between mb-8">
            <div>
               <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Dispatch & Transportation</h3>
               <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Map out the project logistics manifest</p>
            </div>
            
            <div class="flex items-center gap-4">
               <button
                  @click="importLatestLog"
                  :disabled="isSavingPlanning"
                  class="h-10 px-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-2xl transition-all border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                >
                  <i class="mdi mdi-cloud-download text-lg"></i>
                  <span>Sync via Log</span>
                </button>
                <button
                  v-if="!isReadOnly"
                  @click="saveDispatchPlanning"
                  :disabled="isSavingPlanning"
                  class="h-10 px-6 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <i v-if="isSavingPlanning" class="mdi mdi-loading mdi-spin text-lg"></i>
                  <i v-else class="mdi mdi-content-save-check text-lg"></i>
                  <span>{{ isSavingPlanning ? 'Saving...' : 'Secure Manifest' }}</span>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Card 1: Transport Detail -->
           <div class="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group transition-all duration-500 hover:border-indigo-500/30">
               <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-500 border border-slate-100 dark:border-slate-700">
                     <i class="mdi mdi-truck text-2xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-0.5">Transportation Unit</h4>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Vehicle & Driver Setup</p>
                  </div>
               </div>

               <div class="space-y-6">
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Vehicle Classification</label>
                    <input v-model="logisticsData.logistics_planning.vehicle_type" type="text" placeholder="e.g. 10 Ton Flatbed" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Vehicle ID / Plate #</label>
                    <input v-model="logisticsData.logistics_planning.vehicle_identification" type="text" placeholder="e.g. KCA 123X" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Assigned Driver</label>
                    <div class="relative">
                      <select v-model="logisticsData.logistics_planning.driver_name" @change="onSelectDriver(logisticsData.logistics_planning.driver_name || '')" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none outline-none">
                        <option value="">Select a driver...</option>
                        <option v-for="driver in drivers" :key="driver.id" :value="driver.name">{{ driver.name }}</option>
                        <option value="Third-party">Third-party Driver</option>
                      </select>
                      <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Driver Contact</label>
                    <input v-model="logisticsData.logistics_planning.driver_contact" type="text" placeholder="e.g. +254 7..." class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                  </div>
               </div>
           </div>

           <!-- Card 2: Route Planning -->
           <div class="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group transition-all duration-500 hover:border-emerald-500/30">
               <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-slate-700">
                     <i class="mdi mdi-map-marker-path text-2xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-0.5">Navigation Path</h4>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Origin & Destination</p>
                  </div>
               </div>

               <div class="space-y-6">
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Point of Origin</label>
                    <input v-model="logisticsData.logistics_planning.route.origin" type="text" placeholder="e.g. Main Workshop" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Project Destination</label>
                    <input v-model="logisticsData.logistics_planning.route.destination" type="text" placeholder="Venue Location" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Distance Matrix (KM)</label>
                    <input v-model.number="logisticsData.logistics_planning.route.distance" type="number" step="0.1" placeholder="Approx distance" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Est. Transit Duration</label>
                    <input v-model="logisticsData.logistics_planning.route.travel_time" type="text" placeholder="e.g. 2 hrs 15 mins" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none" />
                  </div>
               </div>
           </div>

           <!-- Card 3: Timeline -->
           <div class="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group transition-all duration-500 hover:border-amber-500/30">
               <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-amber-500 border border-slate-100 dark:border-slate-700">
                     <i class="mdi mdi-clock-fast text-2xl"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-0.5">Deployment Timeline</h4>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transit & Setup Sync</p>
                  </div>
               </div>

               <div class="space-y-6">
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Scheduled Departure</label>
                    <input v-model="logisticsData.logistics_planning.timeline.departure_time" type="datetime-local" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-amber-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Estimated Arrival</label>
                    <input v-model="logisticsData.logistics_planning.timeline.arrival_time" type="datetime-local" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-amber-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Target Setup Kickoff</label>
                    <input v-model="logisticsData.logistics_planning.timeline.setup_start_time" type="datetime-local" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-amber-500 transition-all outline-none" />
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
        <div class="flex items-center justify-between mb-8">
            <div>
               <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Team Readiness</h3>
               <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Confirm on-site workforce presence</p>
            </div>
            
            <div class="flex items-center gap-4">
               <button
                  @click="refreshTeamData"
                  :disabled="teamDataState.isLoading"
                  class="h-10 px-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-2xl transition-all border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                >
                  <i :class="['mdi mdi-refresh text-lg', { 'mdi-spin': teamDataState.isLoading }]"></i>
                  <span>Sync Personnel</span>
                </button>
            </div>
        </div>

        <!-- States: Error -->
        <div v-if="teamDataState.hasError" class="p-10 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 text-center">
            <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-rose-500 mx-auto mb-6">
               <i class="mdi mdi-alert-circle text-3xl"></i>
            </div>
            <h4 class="text-lg font-black text-rose-900 dark:text-rose-200 mb-2 uppercase tracking-tight">Synchronization Error</h4>
            <p class="max-w-md mx-auto text-sm font-bold text-rose-700/70 dark:text-rose-300/50 mb-8">{{ teamDataState.errorMessage || 'Failed to connect to team management services.' }}</p>
            <div class="flex items-center justify-center gap-4">
                <button @click="refreshTeamData" class="h-11 px-8 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95">Retry Sync</button>
                <button @click="proceedWithoutTeamData" class="h-11 px-8 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95">Bypass Service</button>
            </div>
        </div>

        <!-- States: No Data -->
        <div v-else-if="!teamDataState.isLoading && !teamDataState.data" class="p-10 bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-amber-500 mx-auto mb-6">
               <i class="mdi mdi-account-question text-3xl"></i>
            </div>
            <h4 class="text-lg font-black text-amber-900 dark:text-amber-200 mb-2 uppercase tracking-tight">No Assignments Found</h4>
            <p class="max-w-md mx-auto text-sm font-bold text-amber-700/70 dark:text-amber-300/50 mb-8">No workforce clusters have been assigned to this project yet. Please verify the Teams Task assignments.</p>
            <button @click="proceedWithoutTeamData" class="h-11 px-8 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95">Initialize Empty State</button>
        </div>

        <!-- Team Content -->
        <div v-else class="space-y-10">
            <!-- Setup Teams Section -->
            <div class="p-10 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border border-slate-100 dark:border-slate-800 relative group">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                   <div class="flex items-center gap-5">
                      <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-indigo-500">
                         <i class="mdi mdi-account-group text-3xl"></i>
                      </div>
                      <div>
                         <h4 class="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1.5">Deployment Squads</h4>
                         <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Team clusters assigned for event execution</p>
                      </div>
                   </div>

                   <button
                      @click="logisticsData.team_confirmation.setup_teams_confirmed = !logisticsData.team_confirmation.setup_teams_confirmed; updateTeamConfirmation('setup')"
                      class="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 border-2"
                      :class="logisticsData.team_confirmation.setup_teams_confirmed 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-500'"
                   >
                      <i :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'mdi mdi-check-decagram text-lg' : 'mdi mdi-circle-outline text-lg'"></i>
                      {{ logisticsData.team_confirmation.setup_teams_confirmed ? 'Squads Verified' : 'Verify Squad Presence' }}
                   </button>
                </div>

                <div v-if="getSelectedTeamTypes('setup').length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div 
                      v-for="team in getSelectedTeamTypes('setup')" 
                      :key="team.id"
                      class="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group/card"
                   >
                      <div class="flex items-center gap-4 mb-4 relative z-10">
                         <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/card:text-indigo-500 transition-colors">
                            <i class="mdi mdi-account-star text-xl"></i>
                         </div>
                         <div class="min-w-0">
                            <h5 class="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{{ team.name }}</h5>
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ team.members.length }} Operatives</p>
                         </div>
                      </div>

                      <div class="flex flex-wrap gap-2 mb-6 relative z-10">
                         <span v-for="member in team.members" :key="member.id" class="px-2.5 py-1 bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-800">
                            {{ member.name }}
                         </span>
                      </div>
                      
                      <div class="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between relative z-10">
                         <span class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Squad Status</span>
                         <span class="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Standby
                         </span>
                      </div>
                   </div>
                </div>

                <div v-else class="py-12 text-center text-slate-400">
                    <i class="mdi mdi-account-off-outline text-4xl mb-3 block opacity-20"></i>
                    <p class="text-[10px] font-black uppercase tracking-widest">No matching squad assignments</p>
                </div>

                <!-- Notes Section -->
                <div class="mt-10">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-3 block">Deployment Intelligence (Logistics Notes)</label>
                    <textarea
                      v-model="logisticsData.team_confirmation.notes"
                      @input="updateTeamConfirmation('setup')"
                      rows="3"
                      class="w-full p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Add specific requirements, coordination details, or on-site changes..."
                    ></textarea>
                </div>
            </div>

            <!-- Readiness KPI Bar -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div>
                      <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 text-slate-400">Squad Count</p>
                      <p class="text-3xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">{{ getSelectedTeamTypes('setup').length }}</p>
                   </div>
                   <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
                      <i class="mdi mdi-apps text-2xl"></i>
                   </div>
                </div>

                <div class="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div>
                      <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 text-slate-400">Personnel Kraft</p>
                      <p class="text-3xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400">{{ getSelectedTeamTypes('setup').reduce((sum, team) => sum + team.members.length, 0) }}</p>
                   </div>
                   <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                      <i class="mdi mdi-account-multiple-check text-2xl"></i>
                   </div>
                </div>

                <div class="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div>
                      <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 text-slate-400">Approval State</p>
                      <p class="text-xl font-black tracking-tight" :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'text-emerald-500' : 'text-amber-500'">
                         {{ logisticsData.team_confirmation.setup_teams_confirmed ? 'VERIFIED' : 'PENDING' }}
                      </p>
                   </div>
                   <div class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center" :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'text-emerald-500' : 'text-amber-500'">
                      <i :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'mdi mdi-shield-check' : 'mdi mdi-shield-clock'" class="text-2xl"></i>
                   </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Items Management Tab -->
      <div
        v-show="activeTab === 'loading-sheet'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <!-- Header actions -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Delivery Manifest</h3>
            <p class="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-widest leading-none">Manage project elements and custom loading items</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="relative hidden lg:block">
              <input
                v-model="itemsState.searchQuery"
                type="text"
                placeholder="Search manifest..."
                class="h-10 px-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64"
              />
              <i class="mdi mdi-magnify absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
            <button
              @click="importProductionElements"
              :disabled="itemsState.isImporting"
              class="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
            >
              <i v-if="itemsState.isImporting" class="mdi mdi-loading mdi-spin text-lg"></i>
              <i v-else class="mdi mdi-cloud-download text-lg"></i>
              <span>{{ itemsState.isImporting ? 'Syncing...' : 'Sync Elements' }}</span>
            </button>
          </div>
        </div>

        <!-- Inline Add Custom Item Interface -->
        <div class="relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 mb-10 group transition-all duration-500 hover:border-indigo-500/30">
          <div class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                 <i class="mdi mdi-plus-circle text-2xl"></i>
               </div>
               <div>
                 <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-0.5">Rapid Manifest Entry</h4>
                 <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Add custom items to your manifest instantly</p>
               </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <!-- Item Name -->
              <div class="lg:col-span-12">
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Item Designation*</label>
                <input v-model="customItemForm.name" @keydown.enter="addCustomTransportItem" type="text" placeholder="Enter item name (e.g. Stage Deck, Truss)..." class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
              </div>

              <!-- Logistics Metadata -->
              <div class="lg:col-span-3">
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Quantity*</label>
                <input v-model.number="customItemForm.quantity" type="number" min="1" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-black text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-center" />
              </div>
              <div class="lg:col-span-2">
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Unit*</label>
                <div class="relative">
                  <select v-model="customItemForm.unit" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none outline-none uppercase tracking-widest">
                    <option value="pcs">pcs</option>
                    <option value="sets">sets</option>
                    <option value="boxes">boxes</option>
                    <option value="rolls">rolls</option>
                    <option value="meters">meters</option>
                  </select>
                  <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
              <div class="lg:col-span-3">
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Category Cluster*</label>
                <div class="relative">
                  <select v-model="customItemForm.main_category" class="w-full h-12 px-5 bg-white dark:bg-slate-800 border-0 rounded-2xl text-[10px] font-black text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none outline-none uppercase tracking-widest">
                    <option v-for="cat in DEPLOYMENT_CATEGORIES" :key="cat" :value="cat">{{ cat.replace('_', ' ') }}</option>
                  </select>
                  <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>

               <div class="lg:col-span-4 flex items-end">
                <button 
                  @click="addCustomTransportItem"
                  class="w-full h-12 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <i class="mdi mdi-check-decagram text-lg"></i>
                  <span>Secure to Manifest</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- manifest items list -->
        <div class="space-y-6">
          <div v-if="filteredTransportItems.length === 0" class="py-24 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
             <div class="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-300 mx-auto mb-6">
                <i class="mdi mdi-clipboard-text-outline text-4xl"></i>
             </div>
             <h4 class="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Manifest is Empty</h4>
             <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Import assignments or add items to begin</p>
          </div>

          <div v-else class="overflow-x-auto rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead class="bg-slate-50/50 dark:bg-slate-900/50">
                <tr>
                  <th scope="col" class="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-[45%]">Resource & Specifications</th>
                  <th scope="col" class="px-8 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">Quantitas</th>
                  <th scope="col" class="px-8 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">Weight</th>
                  <th scope="col" class="px-8 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">Protocol</th>
                  <th scope="col" class="px-8 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-[10%]">Control</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-950 divide-y divide-slate-100 dark:divide-slate-800">
                <template v-for="group in groupedTransportItems" :key="group.mainCategory">
                  <!-- Group Header -->
                  <tr class="bg-slate-50/30 dark:bg-slate-900/20 backdrop-blur-sm sticky top-0 z-10">
                    <td colspan="5" class="px-8 py-3">
                       <div class="flex items-center gap-3">
                          <div class="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-500 border border-slate-100 dark:border-slate-700">
                             <i :class="['mdi', getCategoryIcon(group.mainCategory), 'text-xs']"></i>
                          </div>
                          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {{ group.category }} 
                            <span class="mx-2 text-slate-200 dark:text-slate-700 opacity-50">/</span>
                            <span class="text-indigo-600 dark:text-indigo-400">{{ group.items.length }} Resources</span>
                          </span>
                       </div>
                    </td>
                  </tr>

                  <tr v-for="item in group.items" :key="item.id" class="group/row hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <template v-if="!isEditing(item.id)">
                      <td class="px-8 py-5">
                        <div class="flex items-start gap-4">
                          <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" :class="getCategoryColor(item.main_category || '')"></div>
                          <div>
                             <p class="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ item.name }}</p>
                             <p v-if="item.description" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60 line-clamp-1">{{ item.description }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-5 text-center">
                        <span class="text-xs font-black text-slate-700 dark:text-slate-200">{{ item.quantity }}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1.5">{{ item.unit }}</span>
                      </td>
                      <td class="px-8 py-5 text-center">
                        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ item.weight || '-' }}</span>
                      </td>
                      <td class="px-8 py-5 text-center">
                         <span v-if="item.special_handling" class="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-100 dark:border-amber-800">
                           {{ item.special_handling }}
                         </span>
                         <span v-else class="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">Standard</span>
                      </td>
                      <td class="px-8 py-5">
                        <div class="flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <button @click="startEditingItem(item)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all">
                             <i class="mdi mdi-pencil-outline"></i>
                          </button>
                          <button @click="removeTransportItem(item.id.toString())" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all">
                             <i class="mdi mdi-trash-can-outline"></i>
                          </button>
                        </div>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-8 py-5 bg-indigo-50/50 dark:bg-indigo-900/10">
                         <input v-model="itemsState.editData[item.id].name" type="text" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border-0 rounded-xl text-xs font-black text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none uppercase tracking-tight" />
                      </td>
                      <td class="px-8 py-5 bg-indigo-50/50 dark:bg-indigo-900/10">
                        <div class="flex items-center gap-2">
                          <input v-model.number="itemsState.editData[item.id].quantity" type="number" class="w-16 h-10 bg-white dark:bg-slate-800 border-0 rounded-xl text-xs font-black text-center shadow-sm ring-1 ring-indigo-200 outline-none" />
                          <input v-model="itemsState.editData[item.id].unit" type="text" class="w-16 h-10 bg-white dark:bg-slate-800 border-0 rounded-xl text-[10px] font-black text-center shadow-sm ring-1 ring-indigo-200 outline-none uppercase" />
                        </div>
                      </td>
                      <td class="px-8 py-5 bg-indigo-50/50 dark:bg-indigo-900/10">
                         <input v-model="itemsState.editData[item.id].weight" type="text" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border-0 rounded-xl text-xs font-bold text-center shadow-sm ring-1 ring-indigo-200 outline-none" />
                      </td>
                      <td class="px-8 py-5 bg-indigo-50/50 dark:bg-indigo-900/10">
                         <input v-model="itemsState.editData[item.id].special_handling" type="text" class="w-full h-10 px-4 bg-white dark:bg-slate-800 border-0 rounded-xl text-[10px] font-bold text-center shadow-sm ring-1 ring-indigo-200 outline-none uppercase" />
                      </td>
                      <td class="px-8 py-5 bg-indigo-50/50 dark:bg-indigo-900/10">
                        <div class="flex flex-col gap-2 scale-90">
                          <button @click="saveEditedItem(item.id)" class="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Save</button>
                          <button @click="cancelEditingItem(item.id)" class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancel</button>
                        </div>
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Logistics Log Tab -->
      <div
        v-show="activeTab === 'logistics-log'"
        class="tab-panel animate-fade-in"
        role="tabpanel"
      >
        <div class="mb-8">
           <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Transport Intelligence</h3>
           <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Historical vehicle movements and mission logs</p>
        </div>

        <div class="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
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
        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Final Verification</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Pre-departure mission critical checklist</p>
          </div>
          
          <div class="flex items-center gap-6 bg-slate-50 dark:bg-slate-900/40 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deployment Readiness</span>
              <div class="flex items-center gap-3">
                 <div class="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.4)]" :style="{ width: checklistProgress + '%' }"></div>
                 </div>
                 <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">{{ checklistProgress }}%</span>
              </div>
            </div>
            
            <div class="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>

            <button
               @click="generateChecklistFromItems"
               class="h-10 px-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-2xl transition-all border border-indigo-100 dark:border-indigo-800 flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
             >
               <i class="mdi mdi-auto-fix text-lg"></i>
               <span>Sync Manifest</span>
             </button>
          </div>
        </div>

        <!-- Sections grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items Checklist -->
          <div class="lg:col-span-2 space-y-4">
             <div class="flex items-center justify-between mb-2 ml-4">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cargo Verification</span>
                <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">{{ checklist.items.length }} UNITS</span>
             </div>

             <div v-if="checklist.items.length === 0" class="py-20 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                <i class="mdi mdi-playlist-remove text-4xl text-slate-300 mb-2 block"></i>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No verification items pending</p>
             </div>

             <div v-else class="space-y-3">
                <div v-for="ci in checklist.items" :key="ci.id" class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/30 transition-all shadow-sm">
                   <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div class="flex items-center gap-4 min-w-0">
                         <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <i :class="ci.status === 'present' ? 'mdi mdi-check-circle text-emerald-500' : 'mdi mdi-cube-outline'"></i>
                         </div>
                         <div class="min-w-0">
                            <p class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{{ ci.item_name }}</p>
                            <p v-if="ci.checkedBy" class="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5">Verified by {{ ci.checkedBy }}</p>
                         </div>
                      </div>

                      <div class="flex items-center gap-3">
                         <select v-model="ci.status" @change="touchChecklistItem(ci)" class="h-9 px-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-200 outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 uppercase tracking-widest">
                            <option value="present">Present</option>
                            <option value="missing">Missing</option>
                            <option value="coming_later">Coming Later</option>
                         </select>
                         <input v-model="ci.notes" @change="touchChecklistItem(ci)" type="text" placeholder="Protocol notes..." class="h-9 px-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 w-48" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Teams & Safety -->
          <div class="space-y-8">
            <!-- Squad Presence -->
            <div class="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
               <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <i class="mdi mdi-account-multiple-check text-lg text-indigo-500"></i>
                  Squad Verification
               </h4>
               <div class="space-y-4">
                  <label class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-indigo-500 transition-colors">
                     <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Workshop Squad Presence</span>
                     <input type="checkbox" v-model="checklist.teams.workshop" @change="touchChecklistMeta()" class="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all" />
                  </label>
                  <label class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-indigo-500 transition-colors">
                     <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Setup Squad Presence</span>
                     <input type="checkbox" v-model="checklist.teams.setup" @change="touchChecklistMeta()" class="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all" />
                  </label>
                  <label class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-indigo-500 transition-colors">
                     <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Setdown Squad Presence</span>
                     <input type="checkbox" v-model="checklist.teams.setdown" @change="touchChecklistMeta()" class="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all" />
                  </label>
               </div>
            </div>

            <!-- Operational Safety -->
            <div class="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
               <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <i class="mdi mdi-shield-check text-lg text-rose-500"></i>
                  Operational Safety
               </h4>
               <div class="space-y-4">
                  <label class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-rose-500 transition-colors">
                     <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">PPE Certification</span>
                     <input type="checkbox" v-model="checklist.safety.ppe" @change="touchChecklistMeta()" class="w-5 h-5 rounded-lg border-2 border-slate-200 text-rose-600 focus:ring-rose-500 transition-all" />
                  </label>
                  <label class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-rose-500 transition-colors">
                     <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">First Aid Certification</span>
                     <input type="checkbox" v-model="checklist.safety.first_aid" @change="touchChecklistMeta()" class="w-5 h-5 rounded-lg border-2 border-slate-200 text-rose-600 focus:ring-rose-500 transition-all" />
                  </label>
                  <label class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group cursor-pointer hover:border-rose-500 transition-colors">
                     <span class="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Fire Safety Certification</span>
                     <input type="checkbox" v-model="checklist.safety.fire_extinguisher" @change="touchChecklistMeta()" class="w-5 h-5 rounded-lg border-2 border-slate-200 text-rose-600 focus:ring-rose-500 transition-all" />
                  </label>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div class="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 overflow-hidden">
           <div class="w-full h-full flex items-center justify-center" :class="getStatusColor(task.status)">
              <i :class="['mdi text-2xl text-white', 
                task.status === 'completed' ? 'mdi-check-all' : 
                task.status === 'pending' ? 'mdi-clock-outline' : 'mdi-alert-circle-outline'
              ]"></i>
           </div>
        </div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Mission Authority Status</p>
          <div class="flex items-center gap-2">
             <h4 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ getStatusLabel(task.status) }}</h4>
             <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol V4.2</p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
          <button
            v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled' && !isReadOnly"
            @click="showSkipModal = true"
            class="h-12 px-8 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95"
          >
            Bypass Mission
          </button>

          <button
            v-if="['skipped', 'completed'].includes(task.status) && !isReadOnly"
            @click="$emit('update-status', 'pending')"
            class="h-12 px-8 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
          >
            {{ task.status === 'skipped' ? 'Revoke Bypass' : 'Recall Mission' }}
          </button>
          
          <button
            v-if="task.status !== 'completed' && task.status !== 'cancelled' && !isReadOnly"
            @click="$emit('update-status', 'completed')"
            class="h-12 px-10 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-500/40 active:scale-95 hover:bg-indigo-700 transition-all flex items-center gap-3"
          >
            <i class="mdi mdi-shield-check text-lg"></i>
            Authorize Mission Completion
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
      projectId: enquiry?.job_number || enquiry?.enquiry_number || 'N/A',
      enquiryTitle: enquiry?.title || 'Untitled Project',
      clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'N/A',
      eventVenue: enquiry?.venue || 'TBC',
      setupDate: enquiry?.expected_delivery_date || 'TBC',
      setDownDate: 'TBC', // This would come from project data when available
      contactPerson: enquiry?.contact_person || 'N/A',
      projectOfficer: enquiry?.project_officer?.name || 'Unassigned'
    }

    // Check for critical missing information
    const missingFields = []
    if (projectInfo.projectId === 'N/A') missingFields.push('Project ID')
    if (projectInfo.enquiryTitle === 'Untitled Project') missingFields.push('Project Title')
    if (projectInfo.clientName === 'N/A') missingFields.push('Client Name')

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

    // Return safe defaults
    return {
      projectId: 'ERROR',
      enquiryTitle: 'Error Loading Project',
      clientName: 'N/A',
      eventVenue: 'TBC',
      setupDate: 'TBC',
      setDownDate: 'TBC',
      contactPerson: 'N/A'
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
const initializeTeamConfirmation = (): TeamConfirmation => {
  return {
    setup_teams_confirmed: false,
    notes: ''
  }
}

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
        projectId: 'ERROR',
        enquiryTitle: 'Error Loading Project',
        clientName: 'N/A',
        eventVenue: 'TBC',
        setupDate: 'TBC',
        setDownDate: 'TBC',
        contactPerson: 'N/A'
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
    // Update all categories
    updateTeamConfirmation('workshop')
    updateTeamConfirmation('setup')
    updateTeamConfirmation('setdown')

    // Save to backend
    await logistics.updateTeamConfirmation(props.task.id, {
      setup_teams_confirmed: logisticsData.team_confirmation.setup_teams_confirmed,
      notes: logisticsData.team_confirmation.notes
    })

    addFeedbackMessage('success', 'Team confirmation saved successfully')
  } catch (error) {
    console.error('Failed to save team confirmation:', error)
    addFeedbackMessage('error', 'Failed to save team confirmation. Please try again.')
  }
}

/**
 * Check if there are team confirmation changes
 */
const hasTeamConfirmationChanges = computed((): boolean => {
  // Simple check - in real implementation, compare with saved state
  return logisticsData.team_confirmation?.setup_teams_confirmed || false
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

// Modal Control Methods
const openAddCustomItemModal = () => {
  // Modal is removed, this method is no longer used for opening modals
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
  if (!dateVal || dateVal === 'TBC' || dateVal === 'N/A') {
    return 'TBC'
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
