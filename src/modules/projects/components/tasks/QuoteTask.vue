<template>
  <div class="quote-task-content relative -m-8 p-8 min-h-full">
    <div v-if="!showQuoteViewer" class="animate-in fade-in duration-300">
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
        <div class="flex items-center gap-3">
          <button 
            @click="exitPreview"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl backdrop-blur-md border border-white/30 transition-all ring-1 ring-black/5"
          >
            Exit Preview
          </button>
          <button 
            @click="restoreFromPreview"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Restore Session
          </button>
        </div>
      </div>
    </div>


    <!-- Versioning & Version History HUD -->
    <div class="mb-6 flex flex-wrap justify-end items-center gap-3">
      <div v-if="lastSavedAt" class="mr-auto text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
        Last Saved: {{ lastSavedAt.toLocaleTimeString() }}
      </div>

      <button
        @click="saveQuote({ isManual: true })"
        :disabled="isSavingQuote || quoteData.status === 'approved'"
        class="relative overflow-hidden px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-black/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 group"
      >
        <div v-if="isSavingQuote" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <svg v-else class="w-3 h-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
        <span>{{ isSavingQuote ? 'Saving...' : 'Save Quote' }}</span>
      </button>

      <CreateVersionButton
        title="Quote"
        type="quote"
        @create="handleCreateVersion"
      />
      <button
        @click="showActionLogs = true; actionLogKey++"
        class="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center gap-2 group mr-2"
      >
        <svg class="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <span>Audit Logs</span>
      </button>

      <button
        @click="showVersionHistory = true"
        class="group px-4 py-2 text-xs bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 text-purple-600 dark:text-purple-400 font-bold rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-sm transition-all flex items-center gap-2"
      >
        <svg class="w-4 h-4 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Timeline History</span>
      </button>
    </div>

    <!-- Budget Sync Warning Banner -->
    <div class="flex items-center space-x-4 mb-6" v-if="showBudgetWarning && !isPreviewingVersion">
      <div class="flex-1 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start space-x-3">
        <svg class="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h5 class="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
            Budget Updated
          </h5>
          <p class="text-sm text-orange-700 dark:text-orange-300">
            The budget has been modified since this quote was created. Your quote may contain outdated pricing or missing items.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4 ml-auto">
        <button
          @click="smartMergeBudget"
          :disabled="isMerging"
          class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 group"
        >
          <svg v-if="isMerging" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>{{ isMerging ? 'Syncing...' : 'Sync Budget' }}</span>
        </button>
        <button
          @click="showBudgetWarning = false"
          class="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors"
          title="Dismiss"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Budget Import Status -->
    <div v-if="isImporting" class="mb-6">
      <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <div>
            <h5 class="text-sm font-medium text-blue-800 dark:text-blue-200">Loading Budget Data</h5>
            <p class="text-xs text-blue-600 dark:text-blue-300">Importing budget data from the project's budget task...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Import Success -->
    <div v-else-if="quoteData.budgetImported" class="mb-6">
      <div class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h5 class="text-sm font-medium text-green-800 dark:text-green-200">Budget Data Imported</h5>
            <p class="text-xs text-green-600 dark:text-green-300">
              Successfully imported {{ getTotalImportedItems() }} items from budget task.
              Base total: {{ formatCurrency(getBaseTotalAll()) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Tabs -->
    <div v-if="quoteData.budgetImported || isImporting || hasExistingQuoteData" class="mb-6">
      <!-- Premium Segmented Tab Navigation -->
      <div class="mb-8">
        <nav class="flex p-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner w-full">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white scale-100'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 scale-95 opacity-70'
            ]"
            class="flex-1 flex flex-col items-center justify-center py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden"
          >
            <!-- Background pulse for active tab -->
            <div v-if="activeTab === tab.id" class="absolute inset-0 bg-white/10 animate-pulse"></div>
            
            <div class="flex items-center gap-2 relative z-10">
              <!-- Icons for Tabs -->
              <svg v-if="tab.id === 'materials'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <svg v-else-if="tab.id === 'labour'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else-if="tab.id === 'expenses'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <svg v-else-if="tab.id === 'logistics'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1h-1m-4-13H3" />
              </svg>
              <svg v-else-if="tab.id === 'summary'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              
              <span class="text-[11px] font-black uppercase tracking-[0.15em]">{{ tab.label }}</span>
            </div>

            <!-- Enhanced Tab Totals -->
            <span v-if="getTabTotal(tab.id) > 0" 
              :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'"
              class="mt-1.5 text-[9px] font-bold px-2.5 py-0.5 rounded-full transition-colors relative z-10"
            >
              {{ formatCurrency(getTabTotal(tab.id)) }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <!-- Materials Tab -->
        <div v-if="activeTab === 'materials'" class="p-8">
          <div class="flex items-center justify-between mb-6 pb-2 border-b border-gray-50 dark:border-gray-700/50">
            <h5 class="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              Materials & Strategic Assets
            </h5>
            <div class="flex items-center gap-4">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Valuation: <span class="text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.materialsTotal) }}</span>
              </div>
            </div>
          </div>

          <div v-if="quoteData.materials.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Item</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Qty</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline (Days)</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit Valuation</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Base Total</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profit Margin %</th>
                    <th class="text-right py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Strategic Total</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="element in quoteData.materials" :key="element.id">
                    <!-- Element Header Row -->
                    <tr class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <td colspan="8" class="py-2 px-4">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{{ element.name }}</span>
                          <div class="flex items-center gap-4">
                            <div class="flex items-center bg-white/50 dark:bg-gray-800/50 rounded-lg px-2 py-1 border border-gray-100 dark:border-gray-700">
                               <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-2">Qty:</span>
                               <input 
                                 type="number" 
                                 v-model.number="element.quantity" 
                                 min="1"
                                 @input="updateMaterialElementTotals(); calculateAllTotals(); markDirty()"
                                 class="w-12 px-1 py-0.5 text-xs text-center border-none bg-transparent focus:ring-0 font-bold text-blue-600"
                               >
                            </div>
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                              {{ element.materials.length }} items | 
                              Base: {{ formatCurrency(element.baseTotal) }} → 
                              Final: {{ formatCurrency(element.finalTotal) }}
                            </span>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          v-model="element.description" 
                          @input="markDirty()"
                          placeholder="Add description for this element (e.g. 'Main stage structure and support')..."
                          class="mt-1 w-full text-xs text-gray-600 dark:text-gray-300 bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-0 px-0 placeholder-gray-400 transition-colors"
                        >
                      </td>
                    </tr>

                    <!-- Material Rows -->
                    <tr v-for="material in element.materials" :key="material.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="py-3 px-4 pl-8">
                        <div class="flex items-center space-x-2">
                          <span v-if="material.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
                          <span class="text-gray-900 dark:text-white font-medium">{{ material.description }}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ material.unitOfMeasurement }}</td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ material.quantity }}</td>
                      <td class="py-3 px-4">
                        <input
                          type="number"
                          v-model.number="material.days"
                          @input="updateIndividualMargin(material)"
                          min="1"
                          class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                      </td>
                      <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(material.unitPrice) }}</td>
                      <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(material.totalPrice) }}</td>
                      <td class="py-3 px-4">
                        <div class="flex items-center space-x-1">
                          <input
                            type="number"
                            v-model.number="material.marginPercentage"
                            @input="updateIndividualMargin(material)"
                            class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                          <span class="text-gray-500 dark:text-gray-400">%</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 font-medium text-green-600 dark:text-green-400 text-right">
                        {{ formatCurrency(material.finalPrice) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 italic border border-gray-200 dark:border-gray-700 rounded-lg">
            No materials imported from budget
          </div>

        </div>

        <!-- Labour Tab -->
        <div v-if="activeTab === 'labour'" class="p-8">
          <div class="flex items-center justify-between mb-6 pb-2 border-b border-gray-50 dark:border-gray-700/50">
            <h5 class="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              Labour & Operational Welfare
            </h5>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Valuation: <span class="text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.labourTotal) }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Labour Item</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Qty</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Base Rate</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Base Amount</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profit Margin %</th>
                    <th class="text-right py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Strategic Amount</th>
                  </tr>
                </thead>
              <tbody>
                <tr v-for="labour in quoteData.labour" :key="labour.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex flex-col gap-1">
                      <input 
                        v-model="labour.type" 
                        @input="markDirty()"
                        class="text-gray-900 dark:text-white font-medium bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded px-1 -ml-1 text-sm w-full"
                      >
                      <span v-if="labour.isAddition" class="w-fit bg-orange-100/50 text-orange-800 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Addition</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">{{ labour.unit }}</td>
                  <td class="py-3 px-4">
                    <input 
                      type="number" 
                      v-model.number="labour.quantity" 
                      @input="updateIndividualMargin(labour)"
                      class="w-16 px-1 py-0.5 text-sm border-none bg-gray-50 dark:bg-gray-800 rounded focus:ring-1 focus:ring-blue-500 font-medium text-gray-900 dark:text-white"
                    >
                  </td>
                  <td class="py-3 px-4">
                    <input 
                      type="number" 
                      v-model.number="labour.unitRate" 
                      @input="updateIndividualMargin(labour)"
                      class="w-24 px-1 py-0.5 text-sm border-none bg-gray-50 dark:bg-gray-800 rounded focus:ring-1 focus:ring-blue-500 font-medium text-gray-900 dark:text-white"
                    >
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">{{ formatCurrency(labour.amount) }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-1">
                      <input
                        type="number"
                        v-model.number="labour.marginPercentage"
                        @input="updateIndividualMargin(labour)"
                        class="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                      >
                      <span class="text-gray-400 text-[10px] font-bold">%</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                    {{ formatCurrency(labour.finalPrice) }}
                  </td>
                </tr>
                <tr v-if="quoteData.labour.length === 0">
                  <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                    No labour items imported
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Expenses Tab -->
        <div v-if="activeTab === 'expenses'" class="p-8">
          <div class="flex items-center justify-between mb-6 pb-2 border-b border-gray-50 dark:border-gray-700/50">
            <h5 class="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Strategic Expenses & Overheads
            </h5>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Valuation: <span class="text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.expensesTotal) }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Expense Allocation</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Base Amount</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profit Margin %</th>
                    <th class="text-right py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Strategic Amount</th>
                  </tr>
                </thead>
              <tbody>
                <tr v-for="expense in quoteData.expenses" :key="expense.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex flex-col gap-1">
                      <input 
                        v-model="expense.description" 
                        @input="markDirty()"
                        class="text-gray-900 dark:text-white font-medium bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded px-1 -ml-1 text-sm w-full"
                      >
                      <span v-if="expense.isAddition" class="w-fit bg-orange-100/50 text-orange-800 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Addition</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize font-medium">{{ expense.category }}</td>
                  <td class="py-3 px-4">
                    <input 
                      type="number" 
                      v-model.number="expense.amount" 
                      @input="updateIndividualMargin(expense)"
                      class="w-32 px-1 py-0.5 text-sm border-none bg-gray-50 dark:bg-gray-800 rounded focus:ring-1 focus:ring-blue-500 font-medium text-gray-900 dark:text-white"
                    >
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-1">
                      <input
                        type="number"
                        v-model.number="expense.marginPercentage"
                        @input="updateIndividualMargin(expense)"
                        class="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                      >
                      <span class="text-gray-400 text-[10px] font-bold">%</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                    {{ formatCurrency(expense.finalPrice) }}
                  </td>
                </tr>
                <tr v-if="quoteData.expenses.length === 0">
                  <td colspan="3" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                    No expenses imported
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Logistics Tab -->
        <div v-if="activeTab === 'logistics'" class="p-8">
          <div class="flex items-center justify-between mb-6 pb-2 border-b border-gray-50 dark:border-gray-700/50">
            <h5 class="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span>
              Logistics & Deployment Protocol
            </h5>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               Valuation: <span class="text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Logistics Protocol</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vehicle Reg</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Qty</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rate</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Base Amount</th>
                    <th class="text-left py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profit Margin %</th>
                    <th class="text-right py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Strategic Amount</th>
                  </tr>
                </thead>
              <tbody>
                <tr v-for="logistics in quoteData.logistics" :key="logistics.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex flex-col gap-1">
                      <input 
                        v-model="logistics.description" 
                        @input="markDirty()"
                        class="text-gray-900 dark:text-white font-medium bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded px-1 -ml-1 text-sm w-full"
                      >
                      <span v-if="logistics.isAddition" class="w-fit bg-orange-100/50 text-orange-800 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Addition</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-bold tracking-tight">{{ logistics.vehicleReg }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">{{ logistics.unit }}</td>
                  <td class="py-3 px-4">
                    <input 
                      type="number" 
                      v-model.number="logistics.quantity" 
                      @input="updateIndividualMargin(logistics)"
                      class="w-16 px-1 py-0.5 text-sm border-none bg-gray-50 dark:bg-gray-800 rounded focus:ring-1 focus:ring-blue-500 font-medium text-gray-900 dark:text-white"
                    >
                  </td>
                  <td class="py-3 px-4">
                    <input 
                      type="number" 
                      v-model.number="logistics.unitRate" 
                      @input="updateIndividualMargin(logistics)"
                      class="w-24 px-1 py-0.5 text-sm border-none bg-gray-50 dark:bg-gray-800 rounded focus:ring-1 focus:ring-blue-500 font-medium text-gray-900 dark:text-white"
                    >
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">{{ formatCurrency(logistics.amount) }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-1">
                      <input
                        type="number"
                        v-model.number="logistics.marginPercentage"
                        @input="updateIndividualMargin(logistics)"
                        class="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                      >
                      <span class="text-gray-400 text-[10px] font-bold">%</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                    {{ formatCurrency(logistics.finalPrice) }}
                  </td>
                </tr>
                <tr v-if="quoteData.logistics.length === 0">
                  <td colspan="6" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                    No logistics items imported
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Tab -->
        <div v-if="activeTab === 'summary'" class="p-8">
          <div class="flex items-center justify-between mb-8 pb-2 border-b border-gray-50 dark:border-gray-700/50">
            <h5 class="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              Consolidated Quote Summary
            </h5>
            <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest animate-pulse">
               Financial Audit Ready
            </div>
          </div>



          <!-- Discount & VAT Section -->
          <div class="mb-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Discount Section -->
              <div class="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 p-6 rounded-2xl border border-red-100 dark:border-red-800/50 shadow-sm">
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h6 class="text-xs font-black text-red-800 dark:text-red-300 uppercase tracking-widest">Asset Valuation Adjustment</h6>
                  </div>
                  <div class="text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                    Subtotal: {{ formatCurrency(quoteData.totals.subtotal) }}
                  </div>
                </div>

                <div class="flex items-end gap-6">
                  <div class="flex-1">
                    <label class="block text-[10px] font-black text-red-700/60 dark:text-red-400/60 uppercase tracking-widest mb-2">Discount Allocation (KES)</label>
                    <input
                      v-model.number="quoteData.discountAmount"
                      type="number"
                      min="0"
                      :max="quoteData.totals.subtotal"
                      step="100"
                      placeholder="0"
                      class="w-full px-4 py-2.5 text-sm font-bold bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-inner"
                      @input="updateDiscount"
                    />
                  </div>
                  <div class="pb-2 text-right">
                    <div class="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Impact</div>
                    <div class="text-xl font-black text-red-600 dark:text-red-400">
                      -{{ quoteData.totals.subtotal > 0 ? ((quoteData.discountAmount / quoteData.totals.subtotal) * 100).toFixed(1) : 0 }}%
                    </div>
                  </div>
                </div>
              </div>

              <!-- VAT Section -->
              <div class="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                    </div>
                    <h6 class="text-xs font-black text-purple-800 dark:text-purple-300 uppercase tracking-widest">Regulatory VAT compliance</h6>
                  </div>
                  <div class="flex items-center gap-3 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800/50 shadow-inner">
                    <label class="text-[9px] font-black text-purple-600 uppercase tracking-widest cursor-pointer" for="vatToggle">Enable VAT</label>
                    <input
                      id="vatToggle"
                      v-model="quoteData.vatEnabled"
                      type="checkbox"
                      class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded-full focus:ring-purple-500 cursor-pointer"
                      @change="handleVATChange"
                    />
                  </div>
                </div>

                <div class="flex items-end justify-between">
                  <div>
                    <div class="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Standard Rate</div>
                    <div class="text-2xl font-black text-purple-800 dark:text-purple-200">16%</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Tax liability</div>
                    <div class="text-2xl font-black text-purple-800 dark:text-purple-200 transition-all" :class="{'opacity-20': !quoteData.vatEnabled}">
                      {{ formatCurrency(quoteData.totals.vatAmount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quote Summary Table -->
          <div class="mb-10">
            <h6 class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Strategic Cost breakdown</h6>
            <div class="overflow-hidden border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
              <table class="w-full text-sm">
                <thead class="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th class="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Category</th>
                    <th class="text-right py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Allocation</th>
                    <th class="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Margin</th>
                    <th class="text-right py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profit Intel</th>
                    <th class="text-right py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Valuation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Materials & Components</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.materialsBase) }}</td>
                    <td class="py-3 px-4 text-center font-medium">
                      <div class="flex items-center justify-center gap-1 group/input">
                        <input 
                          type="number" 
                          v-model.number="quoteData.margins.materials" 
                          @input="applyBulkMargin('materials', quoteData.margins.materials)"
                          class="w-12 px-1 py-0.5 text-xs text-center border-none bg-blue-50 dark:bg-blue-900/30 rounded focus:ring-1 focus:ring-blue-500 font-bold text-blue-600 dark:text-blue-400 group-hover/input:bg-blue-100 transition-colors"
                        >
                        <span class="text-[10px] text-blue-400">%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right text-blue-600 dark:text-blue-400">{{ formatCurrency(quoteData.totals.materialsMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.materialsTotal) }}</td>
                  </tr>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Labour & Welfare</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.labourBase) }}</td>
                    <td class="py-3 px-4 text-center font-medium">
                      <div class="flex items-center justify-center gap-1 group/input">
                        <input 
                          type="number" 
                          v-model.number="quoteData.margins.labour" 
                          @input="applyBulkMargin('labour', quoteData.margins.labour)"
                          class="w-12 px-1 py-0.5 text-xs text-center border-none bg-yellow-50 dark:bg-yellow-900/30 rounded focus:ring-1 focus:ring-yellow-500 font-bold text-yellow-600 dark:text-yellow-400 group-hover/input:bg-yellow-100 transition-colors"
                        >
                        <span class="text-[10px] text-yellow-400">%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right text-yellow-600 dark:text-yellow-400">{{ formatCurrency(quoteData.totals.labourMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.labourTotal) }}</td>
                  </tr>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Expenses & Overheads</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.expensesBase) }}</td>
                    <td class="py-3 px-4 text-center font-medium">
                      <div class="flex items-center justify-center gap-1 group/input">
                        <input 
                          type="number" 
                          v-model.number="quoteData.margins.expenses" 
                          @input="applyBulkMargin('expenses', quoteData.margins.expenses)"
                          class="w-12 px-1 py-0.5 text-xs text-center border-none bg-green-50 dark:bg-green-900/30 rounded focus:ring-1 focus:ring-green-500 font-bold text-green-600 dark:text-green-400 group-hover/input:bg-green-100 transition-colors"
                        >
                        <span class="text-[10px] text-green-400">%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right text-green-600 dark:text-green-400">{{ formatCurrency(quoteData.totals.expensesMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.expensesTotal) }}</td>
                  </tr>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Logistics & Transportation</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.logisticsBase) }}</td>
                    <td class="py-3 px-4 text-center font-medium">
                      <div class="flex items-center justify-center gap-1 group/input">
                        <input 
                          type="number" 
                          v-model.number="quoteData.margins.logistics" 
                          @input="applyBulkMargin('logistics', quoteData.margins.logistics)"
                          class="w-12 px-1 py-0.5 text-xs text-center border-none bg-orange-50 dark:bg-orange-900/30 rounded focus:ring-1 focus:ring-orange-500 font-bold text-orange-600 dark:text-orange-400 group-hover/input:bg-orange-100 transition-colors"
                        >
                        <span class="text-[10px] text-orange-400">%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right text-orange-600 dark:text-orange-400">{{ formatCurrency(quoteData.totals.logisticsMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">SUBTOTAL</td>
                    <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(getBaseTotalAll()) }}</td>
                    <td class="py-3 px-4 text-center font-bold text-gray-900 dark:text-white">{{ quoteData.totals.overallMarginPercentage.toFixed(1) }}%</td>
                    <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.totalMargin) }}</td>
                    <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.subtotal) }}</td>
                  </tr>
                  <tr v-if="quoteData.discountAmount > 0" class="border-t border-gray-300 dark:border-gray-500">
                    <td class="py-3 px-4 font-bold text-red-700 dark:text-red-400">DISCOUNT</td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4 text-center font-bold text-red-700 dark:text-red-400">
                      {{ quoteData.totals.subtotal > 0 ? ((quoteData.discountAmount / quoteData.totals.subtotal) * 100).toFixed(1) : 0 }}%
                    </td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4 text-right font-bold text-red-700 dark:text-red-400">-{{ formatCurrency(quoteData.discountAmount) }}</td>
                  </tr>
                  <tr class="border-t border-gray-300 dark:border-gray-500">
                    <td class="py-3 px-4 font-bold text-gray-900 dark:text-white">TOTAL (Before VAT)</td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.totalAfterDiscount) }}</td>
                  </tr>
                  <tr v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0" class="border-t border-gray-300 dark:border-gray-500">
                    <td class="py-3 px-4 font-bold text-purple-700 dark:text-purple-400">VAT ({{ quoteData.vatPercentage }}%)</td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4 text-right font-bold text-purple-700 dark:text-purple-400">{{ formatCurrency(quoteData.totals.vatAmount) }}</td>
                  </tr>
                  <tr class="border-t-2 border-gray-400 dark:border-gray-300">
                    <td class="py-4 px-4 font-bold text-lg text-gray-900 dark:text-white">FINAL TOTAL (Inc. VAT)</td>
                    <td class="py-4 px-4"></td>
                    <td class="py-4 px-4"></td>
                    <td class="py-4 px-4"></td>
                    <td class="py-4 px-4 text-right font-bold text-2xl text-blue-600 dark:text-blue-400">{{ formatCurrency(quoteData.totals.grandTotal) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Profit Analysis -->
          <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg border border-green-200 dark:border-green-700">
            <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Profit Analysis</h6>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(getBaseTotalAll()) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Base Cost</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(quoteData.totals.totalMargin) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total Margin</div>
              </div>
              <div class="text-center" v-if="quoteData.discountAmount > 0">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">-{{ formatCurrency(quoteData.discountAmount) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Discount</div>
              </div>
              <div class="text-center" v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatCurrency(quoteData.totals.vatAmount) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">VAT ({{ quoteData.vatPercentage }}%)</div>
              </div>
              <div class="text-center" :class="getAnalysisColumnSpan()">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(quoteData.totals.grandTotal) }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Final Total</div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <div class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Overall Profit Margin:
                <span class="text-green-600 dark:text-green-400">{{ quoteData.totals.overallMarginPercentage.toFixed(1) }}%</span>
                <span v-if="quoteData.discountAmount > 0" class="ml-4 text-red-600 dark:text-red-400">
                  ({{ ((quoteData.discountAmount / quoteData.totals.subtotal) * 100).toFixed(1) }}% discount)
                </span>
                <span v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0" class="ml-4 text-purple-600 dark:text-purple-400">
                  ({{ quoteData.vatPercentage }}% VAT included)
                </span>
              </div>
            </div>
          </div>

          <!-- Quote Actions Hub -->
          <div class="mt-10 flex flex-col items-center gap-4">
            <button
              @click="openQuoteViewer"
              class="group relative px-10 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_35px_-12px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:translate-y-0.5 text-xs flex items-center space-x-3 overflow-hidden"
            >
              <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-45deg]"></div>
              <svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span class="relative z-10">Generate Final Prospectus</span>
            </button>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Ready for strategic review</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Budget Data Message -->
    <div v-if="!quoteData.budgetImported && !isImporting" class="mb-6 mt-6">
      <div class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h5 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Budget Required</h5>
            <p class="text-xs text-yellow-600 dark:text-yellow-300">Please complete the budget task before creating a quote.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex space-x-3">
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
          @click="showSkipModal = true"
          class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gray-500/20 flex items-center gap-2"
        >
          Skip Task
        </button>
        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled'"
          @click="handleSubmit"
          :disabled="isSavingQuote || quoteData.status === 'approved'"
          class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group disabled:opacity-50"
        >
          <div v-if="isSavingQuote" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <svg v-else class="w-4 h-4 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <span>Submit Strategic Quote</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <div class="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
            </div>
            <span class="text-xs font-black uppercase tracking-widest">Mission Completed</span>
          </div>

          <!-- Master Preview Trigger -->
          <button
            @click="openQuoteViewer"
            class="px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-black/10 hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>Review Prospectus</span>
          </button>
        </div>
      </div>
    </div>
    </div> <!-- End of Task UI v-if -->

    <!-- Inline Quote Viewer -->
    <QuoteViewer
      v-else
      :is-visible="showQuoteViewer"
      :quote-data="quoteData"
      :readonly="readonly"
      @close="closeQuoteViewer"
      @save="handleQuoteViewerSave"
      @request-print="handlePrintRequest"
    />

    <!-- Shared Modals (Always available) -->
    <VersionHistoryModal
      :is-open="showVersionHistory"
      :versions="quoteVersions"
      :is-loading="versionsLoading"
      :error="versionsError"
      title="Quote"
      type="quote"
      @close="showVersionHistory = false"
      @preview="handlePreviewVersion"
      @restore="handleRestoreVersion"
      @refresh="fetchVersions"
    />
    
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
    <!-- Section for Action Logs / Audit History (Standard Modal) -->
    <div v-if="showActionLogs" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        @click="showActionLogs = false" 
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      ></div>

      <!-- Modal Panel -->
      <div class="relative w-full max-w-2xl transform bg-white dark:bg-slate-900 p-8 shadow-2xl rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-200">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <i class="mdi mdi-history text-2xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Audit Trail</h3>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">History & Accountability</p>
            </div>
          </div>
          <button 
            @click="showActionLogs = false"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
           <ActionLogViewer 
            :key="actionLogKey"
            loggableType="quote" 
            :loggableId="quoteData.id || 0" 
           />
        </div>

        <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
           <button
            @click="showActionLogs = false"
            class="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-black/10 hover:scale-105"
          >
            Close Log
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useVersioning } from '@/composables/useVersioning'
import type { EnquiryTask } from '../../types/enquiry'
import axios from '@/plugins/axios'
import QuoteViewer from './QuoteViewer.vue'
import ActionLogViewer from '../ActionLogViewer.vue'
import VersionHistoryModal from '../shared/VersionHistoryModal.vue'
import CreateVersionButton from '../shared/CreateVersionButton.vue'

// Global Constants
const CONSTANTS = {
  VAT_RATE: 16,
  DEFAULT_DAYS: 1,
  DEFAULT_MARGINS: {
    MATERIALS: 60,
    LABOUR: 0,
    EXPENSES: 0,
    LOGISTICS: 0
  },
  CURRENCY: {
    CODE: 'KES',
    LOCALE: 'en-KE',
    DECIMALS: 0
  }
} as const

/**
 * Props interface for the QuoteTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Whether the task is in readonly mode */
  readonly?: boolean
  /** The tab to show by default */
  initialTab?: string
}

/**
 * Events emitted by the QuoteTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
  /** Emitted when quote data is saved */
  'save-quote': [data: QuoteData]
}

/**
 * Project information structure for the quote task
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
 * Quote material element structure
 */
interface QuoteMaterialElement {
  /** Unique identifier for this element */
  id: string
  /** Reference to the element template */
  templateId: string
  /** Display name for this element */
  name: string
  /** List of materials for this element */
  materials: QuoteMaterial[]
  /** Base total cost before margin */
  baseTotal: number
  /** Margin percentage applied */
  marginPercentage: number
  /** Calculated margin amount */
  marginAmount: number
  /** Final total including margin */
  finalTotal: number
  /** Description of the element */
  description?: string
  /** Quantity of the element */
  quantity?: number
}

/**
 * Individual quote material structure
 */
interface QuoteMaterial {
  /** Unique identifier for the material */
  id: string
  /** Description of the material */
  description: string
  /** Unit of measurement */
  unitOfMeasurement: string
  /** Quantity required */
  quantity: number
  /** Number of days (multiplier) */
  days: number
  /** Unit price */
  unitPrice: number
  /** Total price for this material */
  totalPrice: number
  /** Whether this is an addition */
  isAddition: boolean
  /** Individual margin percentage for this material */
  marginPercentage: number
  /** Calculated margin amount */
  marginAmount: number
  /** Final price including margin */
  finalPrice: number
}

/**
 * Quote labour item structure
 */
interface QuoteLabourItem {
  /** Unique identifier */
  id: string
  /** Labour type/description */
  type: string
  /** Unit of measurement */
  unit: string
  /** Quantity */
  quantity: number
  /** Unit rate */
  unitRate: number
  /** Total amount */
  amount: number
  /** Whether this is an addition */
  isAddition: boolean
  /** Labour category */
  category: string
  /** Individual margin percentage for this labour item */
  marginPercentage: number
  /** Calculated margin amount */
  marginAmount: number
  /** Final price including margin */
  finalPrice: number
}

/**
 * Quote expense item structure
 */
interface QuoteExpenseItem {
  /** Unique identifier */
  id: string
  /** Expense description */
  description: string
  /** Expense category */
  category: string
  /** Expense amount */
  amount: number
  /** Whether this is an addition */
  isAddition: boolean
  /** Individual margin percentage for this expense */
  marginPercentage: number
  /** Calculated margin amount */
  marginAmount: number
  /** Final price including margin */
  finalPrice: number
}

/**
 * Quote logistics item structure
 */
interface QuoteLogisticsItem {
  /** Unique identifier */
  id: string
  /** Vehicle registration */
  vehicleReg: string
  /** Description */
  description: string
  /** Unit of measurement */
  unit: string
  /** Quantity */
  quantity: number
  /** Unit rate */
  unitRate: number
  /** Total amount */
  amount: number
  /** Whether this is an addition */
  isAddition: boolean
  /** Individual margin percentage for this logistics item */
  marginPercentage: number
  /** Calculated margin amount */
  marginAmount: number
  /** Final price including margin */
  finalPrice: number
}

/**
 * Margin settings for each category
 */
interface MarginSettings {
  /** Materials margin percentage */
  materials: number
  /** Labour margin percentage */
  labour: number
  /** Expenses margin percentage */
  expenses: number
  /** Logistics margin percentage */
  logistics: number
}

/**
 * Quote totals structure
 */
interface QuoteTotals {
  /** Materials base total */
  materialsBase: number
  /** Materials margin amount */
  materialsMargin: number
  /** Materials final total */
  materialsTotal: number
  /** Labour base total */
  labourBase: number
  /** Labour margin amount */
  labourMargin: number
  /** Labour final total */
  labourTotal: number
  /** Expenses base total */
  expensesBase: number
  /** Expenses margin amount */
  expensesMargin: number
  /** Expenses final total */
  expensesTotal: number
  /** Logistics base total */
  logisticsBase: number
  /** Logistics margin amount */
  logisticsMargin: number
  /** Logistics final total */
  logisticsTotal: number
  /** Subtotal before discount */
  subtotal: number
  /** Discount amount in KES */
  discountAmount: number
  /** Total after discount, before VAT */
  totalAfterDiscount: number
  /** VAT percentage */
  vatPercentage: number
  /** VAT amount in KES */
  vatAmount: number
  /** Grand total including VAT */
  grandTotal: number
  /** Total margin amount */
  totalMargin: number
  /** Overall margin percentage */
  overallMarginPercentage: number
}

/**
 * Core quote data structure
 */
interface QuoteData {
  /** Unique database identifier */
  id?: number
  /** Project information */
  projectInfo: ProjectInfo
  /** Whether budget data has been imported */
  budgetImported: boolean
  /** When budget was imported to quote */
  budgetImportedAt: Date | null
  /** Budget's last update timestamp at import time */
  budgetUpdatedAt: Date | null
  /** Budget version identifier */
  budgetVersion: string | null
  /** Quote materials */
  materials: QuoteMaterialElement[]
  /** Quote labour items */
  labour: QuoteLabourItem[]
  /** Quote expenses */
  expenses: QuoteExpenseItem[]
  /** Quote logistics */
  logistics: QuoteLogisticsItem[]
  /** Margin settings */
  margins: MarginSettings
  /** User's custom margin adjustments */
  customMargins: Record<string, number>
  /** Discount amount in KES */
  discountAmount: number
  /** VAT percentage */
  vatPercentage: number
  /** Whether VAT is enabled */
  vatEnabled: boolean
  /** Calculated totals */
  totals: QuoteTotals
  /** Quote status */
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  /** Creation timestamp */
  createdAt: Date
  /** Last update timestamp */
  updatedAt: Date
  /** Viewer settings (overrides, descriptions) */
  viewerSettings?: {
    descriptions: Record<string, string>
    overrides: Record<string, any>
  }
}

// Props and emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Type alias for timeout handle
type TimeoutHandle = ReturnType<typeof setTimeout>

// Reactive state
const isImporting = ref(false)
const isMerging = ref(false)
const showActionLogs = ref(false)
const actionLogKey = ref(0) // key to force refresh

const activeTab = ref(props.initialTab || 'materials')
const marginUpdateTimeout = ref<TimeoutHandle | null>(null)
const showQuoteViewer = ref(false)

// Persistence & Submission state
const toast = useToast()
const isSavingQuote = ref(false)
const hasUnsavedChanges = ref(false)
const lastSavedAt = ref<Date | null>(null)
const autoSaveTimeout = ref<TimeoutHandle | null>(null)
const pendingSaveRequest = ref(false)

// Budget sync state
const budgetStatus = ref<'checking' | 'up_to_date' | 'outdated' | 'no_budget'>('checking')
const showBudgetWarning = ref(false)

// Versioning state
const showVersionHistory = ref(false)
const isPreviewingVersion = ref(false)
const previewingVersionLabel = ref('')
const previewingVersionId = ref<number | null>(null)
let originalQuoteData: any = null

// Version Management using shared composable
const {
  versions: quoteVersions,
  isLoading: versionsLoading,
  error: versionsError,
  fetchVersions,
  createVersion,
  restoreVersion: restoreVersionAPI,
} = useVersioning(computed(() => props.task.id), 'quote')

// Version handlers
const handleCreateVersion = async (label: string | undefined) => {
  try {
    // First, save the current quote to ensure it exists in the database
    console.log('Saving quote before creating version...')
    await saveQuote()
    console.log('Quote saved successfully, waiting for DB commit...')
    
    // Wait a moment for database transaction to complete
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const response = await createVersion(label)
    alert(response.message || 'Version created successfully')
  } catch (error) {
    console.error('Failed to create version:', error)
    alert('Failed to create version. Please try again.')
  }
}

/**
 * Handle print request from viewer - creates a version then prints
 */
const handlePrintRequest = async (printCallback: () => void) => {
  try {
    // 1. Force save current state
    await saveQuote()
    
    // 2. Wait for DB sync
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 3. Create snapshot version
    const label = `Printout - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    await createVersion(label)
    
    // 4. Proceed with print
    printCallback()
  } catch (error) {
    console.error('Failed to version before print:', error)
    // We still allow printing even if versioning fails, but warn user?
    // Or maybe we should block it? Let's ask user confirmation.
    if (confirm('Automatic versioning failed. Do you want to print anyway?')) {
      printCallback()
    }
  }
}

const handlePreviewVersion = async (version: any) => {
  try {
    // Backup current data  if not already previewing
    if (!isPreviewingVersion.value) {
      originalQuoteData = JSON.parse(JSON.stringify(quoteData))
    }
    
    // Load version data
    if (version.data) {
      Object.assign(quoteData, version.data)
      calculateAllTotals()
    }
    
    isPreviewingVersion.value = true
    previewingVersionLabel.value = version.label
    previewingVersionId.value = version.id
  } catch (error) {
    console.error('Failed to preview version:', error)
  }
}

const exitPreview = () => {
  if (originalQuoteData) {
    Object.assign(quoteData, originalQuoteData)
    calculateAllTotals()
    originalQuoteData = null
  }
  isPreviewingVersion.value = false
  previewingVersionLabel.value = ''
  previewingVersionId.value = null
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
  originalQuoteData = null
}

const handleRestoreVersion = async (versionId: number) => {
  if (!confirm('Are you sure you want to restore this version? Current changes will be lost unless you saved a version.')) return
  
  try {
    const response = await restoreVersionAPI(versionId)
    
    // The response contains the restored data - reload from API to get it
    if (response.data) {
      Object.assign(quoteData, response.data)
      calculateAllTotals()
    }
    
    showVersionHistory.value = false
    alert('✅ Version restored successfully!')
  } catch (error) {
    console.error('Failed to restore version:', error)
    alert('Failed to restore version. Please try again.')
  }
}

// Computed property to check if we have existing quote data
const hasExistingQuoteData = computed(() => {
  return quoteData.materials.length > 0 ||
         quoteData.labour.length > 0 ||
         quoteData.expenses.length > 0 ||
         quoteData.logistics.length > 0
})

// Computed property to check if quote is outdated
const isQuoteOutdated = computed(() => {
  return budgetStatus.value === 'outdated'
})

// Tab configuration
const tabs = [
  { id: 'materials', label: 'Materials' },
  { id: 'labour', label: 'Labour' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'summary', label: 'Summary' }
]

/**
 * Computed project information prioritizing live enquiry data
 */
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry
  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || quoteData.projectInfo?.projectId || String(props.task.id || 'N/A'),
    enquiryTitle: enquiry?.title || quoteData.projectInfo?.enquiryTitle || 'Project Title',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || quoteData.projectInfo?.clientName || 'Client Name',
    eventVenue: enquiry?.venue || quoteData.projectInfo?.eventVenue || 'Venue TBC',
    setupDate: enquiry?.expected_delivery_date || quoteData.projectInfo?.setupDate || new Date().toISOString(),
    setDownDate: quoteData.projectInfo?.setDownDate || 'TBC'
  }
})

const initializeProjectInfo = (): ProjectInfo => {
  const enquiry = props.task.enquiry
  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || String(props.task.id || 'N/A'),
    enquiryTitle: enquiry?.title || 'Project Title',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'Client Name',
    eventVenue: enquiry?.venue || 'Venue TBC',
    setupDate: enquiry?.expected_delivery_date || new Date().toISOString(),
    setDownDate: 'TBC'
  }
}

/**
 * Initialize default margin settings using global constants
 */
const initializeMargins = (): MarginSettings => {
  return {
    materials: CONSTANTS.DEFAULT_MARGINS.MATERIALS,
    labour: CONSTANTS.DEFAULT_MARGINS.LABOUR,
    expenses: CONSTANTS.DEFAULT_MARGINS.EXPENSES,
    logistics: CONSTANTS.DEFAULT_MARGINS.LOGISTICS
  }
}

/**
 * Initialize empty totals structure
 */
const initializeTotals = (): QuoteTotals => {
  return {
    materialsBase: 0,
    materialsMargin: 0,
    materialsTotal: 0,
    labourBase: 0,
    labourMargin: 0,
    labourTotal: 0,
    expensesBase: 0,
    expensesMargin: 0,
    expensesTotal: 0,
    logisticsBase: 0,
    logisticsMargin: 0,
    logisticsTotal: 0,
    subtotal: 0,
    discountAmount: 0,
    totalAfterDiscount: 0,
    vatPercentage: 16,
    vatAmount: 0,
    grandTotal: 0,
    totalMargin: 0,
    overallMarginPercentage: 0
  }
}

/**
 * Reactive quote data structure
 */
const quoteData = reactive<QuoteData>({
  id: undefined,
  projectInfo: initializeProjectInfo(),
  budgetImported: false,
  budgetImportedAt: null,
  budgetUpdatedAt: null,
  budgetVersion: null,
  materials: [],
  labour: [],
  expenses: [],
  logistics: [],
  margins: initializeMargins(),
  customMargins: {},
  discountAmount: 0,
  vatPercentage: 16,
  vatEnabled: true,
  totals: initializeTotals(),
  status: 'draft',
  createdAt: new Date(),
  updatedAt: new Date(),
  viewerSettings: {
    descriptions: {},
    overrides: {}
  }
})

// Helpers for state tracking
const markDirty = () => {
  hasUnsavedChanges.value = true
  autoSaveQuote()
}

/**
 * Auto-save quote data when changes are made
 */
const autoSaveQuote = async () => {
  // Clear any existing timeout
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value)
    autoSaveTimeout.value = null
  }
  
  // Set new timeout to save after 2 seconds of inactivity
  autoSaveTimeout.value = setTimeout(async () => {
    // If already saving, queue a pending request and exit
    if (isSavingQuote.value) {
      console.log('Save already in progress, queuing pending request')
      pendingSaveRequest.value = true
      return
    }

    if (!quoteData.budgetImported || isPreviewingVersion.value || quoteData.status === 'approved') {
      return 
    }
    
    await saveQuote({ isManual: false })
  }, 2000) // 2 second debounce
}

/**
 * Force a final save on unmount if there are unsaved changes
 */
onUnmounted(async () => {
  if (hasUnsavedChanges.value) {
    console.log('Unmounting with unsaved changes - triggered final flush')
    await saveQuote({ isManual: false })
  }
})

/**
 * Strategic Submission: Marks the quote as pending and saves
 */
const handleSubmit = async () => {
  // 1. Update status to pending
  quoteData.status = 'pending'
  
  // 2. Clear any pending auto-saves to avoid double triggers
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value)
    autoSaveTimeout.value = null
  }

  try {
    // 3. Perform manual save (blocking)
    await saveQuote({ isManual: true, isSubmit: true })
    
    // 4. Notify parent of status change (to close modal if needed)
    emit('update-status', 'completed')
  } catch (error) {
    // Status update failed, keep it as draft so user can try again
    quoteData.status = 'draft'
  }
}

// Watch for changes to trigger autosave - expanded to include materials for description preservation
watch(
  () => ({
    materials: quoteData.materials,
    labour: quoteData.labour,
    expenses: quoteData.expenses,
    logistics: quoteData.logistics,
    margins: quoteData.margins,
    discountAmount: quoteData.discountAmount,
    vatEnabled: quoteData.vatEnabled,
    totals: quoteData.totals
  }),
  () => {
    autoSaveQuote()
  },
  { deep: true }
)

// Utility functions
/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'tbc') return 'TBC'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Status Color Mappings
const QUOTE_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
} as const

const TASK_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
} as const

// Status Label Mappings
const QUOTE_STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected'
} as const

const TASK_STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  skipped: 'Skipped'
} as const

// Generic status helper factory
function createStatusHelper<T extends string>(
  map: Record<T, string>,
  defaultKey: T
) {
  return (status: T): string => map[status] || map[defaultKey]
}

// Typed status helpers
const getQuoteStatusColor = createStatusHelper<QuoteData['status']>(QUOTE_STATUS_COLORS, 'draft')
const getQuoteStatusLabel = createStatusHelper<QuoteData['status']>(QUOTE_STATUS_LABELS, 'draft')
const getStatusColor = createStatusHelper<EnquiryTask['status']>(TASK_STATUS_COLORS, 'in_progress')
const getStatusLabel = createStatusHelper<EnquiryTask['status']>(TASK_STATUS_LABELS, 'in_progress')

/**
 * Format currency for display
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CONSTANTS.CURRENCY.LOCALE, {
    style: 'currency',
    currency: CONSTANTS.CURRENCY.CODE,
    minimumFractionDigits: CONSTANTS.CURRENCY.DECIMALS,
    maximumFractionDigits: CONSTANTS.CURRENCY.DECIMALS
  }).format(amount)
}

/**
 * Get total number of imported items
 */
const getTotalImportedItems = (): number => {
  const materialItems = quoteData.materials.reduce((sum, element) => sum + element.materials.length, 0)
  return materialItems + quoteData.labour.length + quoteData.expenses.length + quoteData.logistics.length
}

/**
 * Get base total of all categories
 */
const getBaseTotalAll = (): number => {
  return quoteData.totals.materialsBase + quoteData.totals.labourBase +
         quoteData.totals.expensesBase + quoteData.totals.logisticsBase
}

/**
 * Get total for a specific tab
 */
const getTabTotal = (tabId: string): number => {
  switch (tabId) {
    case 'materials':
      return quoteData.totals.materialsTotal
    case 'labour':
      return quoteData.totals.labourTotal
    case 'expenses':
      return quoteData.totals.expensesTotal
    case 'logistics':
      return quoteData.totals.logisticsTotal
    case 'summary':
      return quoteData.totals.grandTotal
    default:
      return 0
  }
}

/**
 * Get element header class based on template ID
 */
const getElementHeaderClass = (templateId: string): string => {
  const classes = {
    stage: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
    backdrop: 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100',
    lighting: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100',
    sound: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
    furniture: 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100',
    decoration: 'bg-pink-100 dark:bg-pink-900 text-pink-900 dark:text-pink-100',
    catering: 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100',
    security: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
  }
  return classes[templateId as keyof typeof classes] || classes.stage
}

/**
 * Update individual item margin
 */
const updateIndividualMargin = (item: QuoteMaterial | QuoteLabourItem | QuoteExpenseItem | QuoteLogisticsItem) => {
  // Validate margin input
  item.marginPercentage = Math.max(0, Math.min(100, item.marginPercentage || 0))

  // Calculate margin amount and final price
  let baseAmount = 0
  
  if ('totalPrice' in item) {
    // Material item
    if (!item.days || item.days < 1) item.days = CONSTANTS.DEFAULT_DAYS
    
    // Recalculate totalPrice if qty or unitPrice changed
    item.totalPrice = item.quantity * item.days * item.unitPrice
    baseAmount = item.totalPrice
  } else if ('quantity' in item && 'unitRate' in item) {
    // Labour and Logistics items
    item.amount = (item.quantity || 0) * (item.unitRate || 0)
    baseAmount = item.amount
  } else {
    // Expense items
    baseAmount = item.amount || 0
  }

  item.marginAmount = baseAmount * (item.marginPercentage / 100)
  item.finalPrice = baseAmount + item.marginAmount

  // CRITICAL: Update element totals first if it's a material
  // This ensures element.quantity scaling is applied BEFORE grand totals
  if ('totalPrice' in item) {
    updateMaterialElementTotals()
  }

  // Recalculate grand totals
  calculateAllTotals()

  // Mark dirty to trigger persistence
  markDirty()
}

/**
 * Update material element totals based on individual material margins
 */
const updateMaterialElementTotals = () => {
  quoteData.materials.forEach(element => {
    // Ensure quantity is at least 1
    if (!element.quantity || element.quantity < 1) element.quantity = 1
    
    // Sum of individual items
    const sumBase = element.materials.reduce((sum, material) => sum + material.totalPrice, 0)
    const sumMargin = element.materials.reduce((sum, material) => sum + material.marginAmount, 0)
    
    // Apply element quantity multiplier
    element.baseTotal = sumBase * element.quantity
    element.marginAmount = sumMargin * element.quantity
    element.finalTotal = element.baseTotal + element.marginAmount
    
    // Margin percentage remains the same regardless of quantity
    element.marginPercentage = element.baseTotal > 0 ? (element.marginAmount / element.baseTotal) * 100 : 0
  })
}

/**
 * Apply bulk margin to all items in a category
 */
const applyBulkMargin = (category: 'materials' | 'labour' | 'expenses' | 'logistics', marginPercentage: number) => {
  quoteData.margins[category] = marginPercentage
  
  switch (category) {
    case 'materials':
      quoteData.materials.forEach(element => {
        element.materials.forEach(material => {
          material.marginPercentage = marginPercentage
          updateIndividualMargin(material)
        })
      })
      break
    case 'labour':
      quoteData.labour.forEach(item => {
        item.marginPercentage = marginPercentage
        updateIndividualMargin(item)
      })
      break
    case 'expenses':
      quoteData.expenses.forEach(expense => {
        expense.marginPercentage = marginPercentage
        updateIndividualMargin(expense)
      })
      break
    case 'logistics':
      quoteData.logistics.forEach(logistics => {
        logistics.marginPercentage = marginPercentage
        updateIndividualMargin(logistics)
      })
      break
  }
  
  calculateAllTotals()
  markDirty()
}

/**
 * Update discount amount and recalculate totals
 */
const updateDiscount = () => {
  // Validate discount amount (cannot be negative or exceed subtotal)
  const maxDiscount = quoteData.totals.subtotal
  quoteData.discountAmount = Math.max(0, Math.min(maxDiscount, quoteData.discountAmount || 0))

  // Recalculate totals
  calculateAllTotals()

  // Update timestamp
  quoteData.updatedAt = new Date()
}

/**
 * Handle VAT checkbox change (v-model already updated the value)
 */
const handleVATChange = () => {
  // Ensure VAT percentage is always 16%
  quoteData.vatPercentage = CONSTANTS.VAT_RATE
  // Recalculate totals with the new VAT setting
  calculateAllTotals()
  quoteData.updatedAt = new Date()
}

/**
 * Get column span for final total in profit analysis
 */
const getAnalysisColumnSpan = (): string => {
  let usedColumns = 2 // Base Cost + Total Margin always present
  if (quoteData.discountAmount > 0) usedColumns++
  if (quoteData.vatEnabled && quoteData.totals.vatAmount > 0) usedColumns++

  const remainingColumns = 5 - usedColumns
  return remainingColumns > 1 ? `md:col-span-${remainingColumns}` : ''
}

/**
 * Open quote viewer modal
 */
const openQuoteViewer = () => {
  showQuoteViewer.value = true
}

/**
 * Close quote viewer modal
 */
const closeQuoteViewer = () => {
  showQuoteViewer.value = false
}


/**
 * Fetch budget data from the backend API
 */
const fetchBudgetData = async (options = { showLoading: false, skipIfExists: false }) => {
  // Prevent modification if approved
  if (quoteData.status === 'approved') {
    return
  }

  // Skip if budget is already imported and we want to skip
  if (options.skipIfExists && quoteData.budgetImported) {
    return
  }

  if (options.showLoading) {
    isImporting.value = true
  }

  try {
    const response = await axios.post(`/api/projects/tasks/${props.task.id}/quote/import-budget`)

    if (response.data.data) {
      // Update reactive data with imported budget data
      Object.assign(quoteData, response.data.data)
      calculateAllTotals()

      console.log(`Budget data imported successfully! ${quoteData.materials.length} material elements, ${quoteData.labour.length} labour items, ${quoteData.expenses.length} expenses, ${quoteData.logistics.length} logistics items.`)
    } else {
      throw new Error('No data received from budget import')
    }
  } catch (error: any) {
    // Check if it's a 404 (no budget data available yet) - this is expected
    if (error.response?.status === 404) {
      console.log('No budget data available yet - budget task needs to be completed first')
      return
    }
    
    // Check if it's a 409 (budget task not completed) - also expected
    if (error.response?.status === 409) {
      console.log('Budget task not completed yet')
      return
    }

    console.error('Failed to import budget data:', error)
    throw error
  } finally {
    if (options.showLoading) {
      isImporting.value = false
    }
  }
}

/**
 * Calculate all quote totals based on individual item margins
 */
const calculateAllTotals = () => {
  // Helper function to round to 2 decimal places
  const roundCurrency = (amount: number): number => Math.round(amount * 100) / 100

  // Materials totals (sum from individual materials via elements)
  // Note: element.finalTotal already includes the element.quantity multiplier
  quoteData.totals.materialsBase = roundCurrency(
    quoteData.materials.reduce((sum, element) => sum + (element.baseTotal || 0), 0)
  )
  quoteData.totals.materialsMargin = roundCurrency(
    quoteData.materials.reduce((sum, element) => sum + (element.marginAmount || 0), 0)
  )
  quoteData.totals.materialsTotal = roundCurrency(
    quoteData.materials.reduce((sum, element) => sum + (element.finalTotal || 0), 0)
  )

  // Labour totals (sum from individual labour items)
  quoteData.totals.labourBase = roundCurrency(
    quoteData.labour.reduce((sum, labour) => sum + labour.amount, 0)
  )
  quoteData.totals.labourMargin = roundCurrency(
    quoteData.labour.reduce((sum, labour) => sum + (labour.marginAmount || 0), 0)
  )
  quoteData.totals.labourTotal = roundCurrency(
    quoteData.labour.reduce((sum, labour) => sum + (labour.finalPrice || 0), 0)
  )

  // Expenses totals (sum from individual expense items)
  quoteData.totals.expensesBase = roundCurrency(
    quoteData.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  )
  quoteData.totals.expensesMargin = roundCurrency(
    quoteData.expenses.reduce((sum, expense) => sum + expense.marginAmount, 0)
  )
  quoteData.totals.expensesTotal = roundCurrency(
    quoteData.expenses.reduce((sum, expense) => sum + expense.finalPrice, 0)
  )

  // Logistics totals (sum from individual logistics items)
  quoteData.totals.logisticsBase = roundCurrency(
    quoteData.logistics.reduce((sum, logistics) => sum + logistics.amount, 0)
  )
  quoteData.totals.logisticsMargin = roundCurrency(
    quoteData.logistics.reduce((sum, logistics) => sum + logistics.marginAmount, 0)
  )
  quoteData.totals.logisticsTotal = roundCurrency(
    quoteData.logistics.reduce((sum, logistics) => sum + logistics.finalPrice, 0)
  )

  // Grand totals
  const baseGrandTotal = quoteData.totals.materialsBase + quoteData.totals.labourBase +
                        quoteData.totals.expensesBase + quoteData.totals.logisticsBase

  quoteData.totals.totalMargin = roundCurrency(
    quoteData.totals.materialsMargin + quoteData.totals.labourMargin +
    quoteData.totals.expensesMargin + quoteData.totals.logisticsMargin
  )

  // Subtotal before discount
  quoteData.totals.subtotal = roundCurrency(
    quoteData.totals.materialsTotal + quoteData.totals.labourTotal +
    quoteData.totals.expensesTotal + quoteData.totals.logisticsTotal
  )

  // Apply discount
  quoteData.totals.discountAmount = roundCurrency(quoteData.discountAmount || 0)
  quoteData.totals.totalAfterDiscount = roundCurrency(
    quoteData.totals.subtotal - quoteData.totals.discountAmount
  )

  // Calculate VAT (always 16% when enabled)
  quoteData.vatPercentage = CONSTANTS.VAT_RATE // Ensure VAT is always 16%
  quoteData.totals.vatPercentage = CONSTANTS.VAT_RATE
  quoteData.totals.vatAmount = quoteData.vatEnabled ?
    roundCurrency(quoteData.totals.totalAfterDiscount * (CONSTANTS.VAT_RATE / 100)) : 0

  // Final total including VAT
  quoteData.totals.grandTotal = roundCurrency(
    quoteData.totals.totalAfterDiscount + quoteData.totals.vatAmount
  )

  quoteData.totals.overallMarginPercentage = baseGrandTotal > 0 ?
    roundCurrency((quoteData.totals.totalMargin / baseGrandTotal) * 100) : 0
}


// Component lifecycle
onMounted(async () => {
  await loadExistingQuote()
  if (!quoteData.budgetImported) {
    await fetchBudgetData({ showLoading: true, skipIfExists: true })
  }
  // Check if budget has been updated after quote was created
  await checkBudgetStatus()
  await fetchVersions()
})

// Skip Task Logic
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)

const handleSkipTask = async () => {
    if (!skipReason.value.trim()) return
    isSkipping.value = true
    try {
        await axios.put(`/api/projects/tasks/${props.task.id}/status`, {
            status: 'skipped',
            notes: skipReason.value
        })
        emit('update-status', 'skipped')
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

// Load existing quote data
const loadExistingQuote = async () => {
  try {
    const response = await axios.get(`/api/projects/tasks/${props.task.id}/quote`)

    if (response.data.data) {
      Object.assign(quoteData, response.data.data)
      
      // Calculation update after load
      calculateAllTotals()
      console.log('Existing quote data loaded successfully')
    }
  } catch (error) {
    // Quote doesn't exist yet, use defaults
    console.log('No existing quote found, starting fresh')
  }
}

// Handle save from QuoteViewer
const handleQuoteViewerSave = async (data: { descriptions: Record<string, string>, overrides: Record<string, any> }) => {
  if (!quoteData.viewerSettings) {
    quoteData.viewerSettings = { descriptions: {}, overrides: {} }
  }
  Object.assign(quoteData.viewerSettings, data)
  await saveQuote({ isManual: true })
}

// Save quote data (exposed for external use)
const saveQuote = async (options: { isManual?: boolean, isSubmit?: boolean } = { isManual: false }) => {
  // Prevent modification if approved
  if (quoteData.status === 'approved' && !options.isSubmit) {
    console.log('Quote is approved and cannot be modified.')
    return
  }

  isSavingQuote.value = true
  try {
    console.log(`Starting ${options.isManual ? 'MANUAL' : 'AUTO'} save for taskId: ${props.task.id}`)
    const response = await axios.post(`/api/projects/tasks/${props.task.id}/quote`, {
      projectInfo: quoteData.projectInfo,
      budgetImported: quoteData.budgetImported,
      materials: quoteData.materials,
      labour: quoteData.labour,
      expenses: quoteData.expenses,
      logistics: quoteData.logistics,
      margins: quoteData.margins,
      discountAmount: quoteData.discountAmount,
      vatPercentage: quoteData.vatPercentage,
      vatEnabled: quoteData.vatEnabled,
      totals: quoteData.totals,
      status: quoteData.status,
      viewerSettings: quoteData.viewerSettings
    })

    if (response.data?.data?.id) {
      quoteData.id = response.data.data.id
    }

    quoteData.updatedAt = new Date()
    lastSavedAt.value = new Date()
    hasUnsavedChanges.value = false
    console.log('Quote saved successfully!')

    if (options.isManual) {
      toast.add({
        severity: 'success',
        summary: options.isSubmit ? 'Quote Submitted' : 'Save Successful',
        detail: options.isSubmit 
          ? 'Strategic quote has been moved to pending approval.' 
          : 'All changes have been securely persisted.',
        life: 3000
      })
    }

  } catch (error: any) {
    console.error('Failed to save quote:', error)
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: error.response?.data?.message || error.message,
      life: 5000
    })
    throw error
  } finally {
    isSavingQuote.value = false
    // Check if we have a queued save request
    if (pendingSaveRequest.value) {
      console.log('Processing queued save request')
      pendingSaveRequest.value = false
      autoSaveQuote() // Trigge immediate next save
    }
  }
}

// Check budget status on load
const checkBudgetStatus = async () => {
  if (!props.task?.id || !quoteData.budgetImported) {
    budgetStatus.value = 'no_budget'
    return
  }

  try {
    const response = await axios.get(`/api/projects/tasks/${props.task.id}/quote/budget-status`)
    
    budgetStatus.value = response.data.status
    showBudgetWarning.value = response.data.status === 'outdated'
    
    console.log('Budget status checked:', response.data.status)
  } catch (error) {
    console.error('Failed to check budget status:', error)
    budgetStatus.value = 'no_budget'
  }
}

// Smart merge from budget
const smartMergeBudget = async () => {
  isMerging.value = true
  try {
    const response = await axios.post(`/api/projects/tasks/${props.task.id}/quote/smart-merge`)
    
    if (response.data.data) {
      Object.assign(quoteData, response.data.data)
      calculateAllTotals()
      
      // Verify status with server to ensure UI is in sync
      await checkBudgetStatus()
      
      console.log('Budget merged successfully!')
    }
  } catch (error) {
    console.error('Failed to merge budget:', error)
    throw error
  } finally {
    isMerging.value = false
  }
}

// Expose saveQuote function for external use
defineExpose({
  saveQuote
})
</script>

<style scoped>
/* Component-specific styles will be added as needed */
</style>

