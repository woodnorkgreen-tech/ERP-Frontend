<template>
  <div class="procurement-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Loading State -->
    <div v-if="isImporting" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span class="text-sm font-medium">Loading procurement data...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="importError" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 text-red-600 dark:text-red-400">

          <div>
            <p class="text-sm font-medium">Failed to load procurement data</p>
            <p class="text-xs text-red-500 dark:text-red-300">{{ importError }}</p>
          </div>
        </div>
        <button
          @click="importBudgetData"
          :disabled="isImporting"
          class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {{ isImporting ? 'Importing...' : 'Retry Import' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
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

      <!-- Tab Navigation -->
      <div class="mb-6">
        <nav class="flex space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 relative py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-md scale-105 border border-blue-200 dark:border-blue-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
            ]"
          >
            <span class="flex items-center justify-center space-x-2">
              <span class="text-lg">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </span>
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-full"></div>
          </button>
        </nav>
      </div>

      <!-- Items Tab -->
      <div v-if="activeTab === 'items'" class="space-y-6">
        
        <!-- Procurement Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Metric 1: Total Budget -->
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Budget</p>
              <p class="text-2xl font-black text-slate-800 dark:text-white">{{ formatCurrency(totalBudget) }}</p>
            </div>
            <div class="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-y-2 translate-x-2">
              <i class="mdi mdi-cash-multiple text-6xl text-blue-600"></i>
            </div>
          </div>

          <!-- Metric 2: Stock Availability -->
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Inventory Available</p>
              <div class="flex items-baseline space-x-2">
                <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {{ Math.round((procurementData.procurementItems.filter(i => i.stockStatus === 'in_stock').length / (procurementData.procurementItems.length || 1)) * 100) }}%
                </p>
                <span class="text-xs font-medium text-slate-500">Fully Stocked Items</span>
              </div>
            </div>
            <div class="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-y-2 translate-x-2">
              <i class="mdi mdi-warehouse text-6xl text-emerald-600"></i>
            </div>
          </div>

          <!-- Metric 3: To Procure -->
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pending Purchases</p>
              <div class="flex items-baseline space-x-2">
                <p class="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {{ procurementData.procurementItems.filter(i => i.purchaseQuantity > 0 && i.procurementStatus !== 'received').length }}
                </p>
                <span class="text-xs font-medium text-slate-500">Items to Buy</span>
              </div>
            </div>
            <div class="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-y-2 translate-x-2">
              <i class="mdi mdi-cart-outline text-6xl text-amber-600"></i>
            </div>
          </div>

          <!-- Metric 4: Completion -->
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="relative z-10">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Delivery Status</p>
              <div class="flex items-center space-x-2 mb-2">
                 <p class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ overallCompletionPercentage }}%</p>
              </div>
               <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${overallCompletionPercentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="procurementData.procurementItems.length === 0" class="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
          <div class="flex flex-col items-center text-gray-400 dark:text-gray-500">
            <i class="mdi mdi-clipboard-list-outline text-5xl mb-3"></i>
            <p class="text-lg font-medium text-gray-900 dark:text-white">No procurement items yet</p>
            <p class="text-sm">Import budget data to get started</p>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="element in groupedProcurementItems" :key="element.elementId" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <!-- Element Header -->
            <div
              :class="[
                getElementHeaderClass(element.elementName),
                'cursor-pointer hover:opacity-95 transition-all px-5 py-4 flex items-center justify-between text-white'
              ]"
              @click="toggleElementCollapse(element.elementId)"
            >
              <div class="flex items-center space-x-4">
                <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                   <i class="mdi mdi-cube-outline text-xl"></i>
                </div>
                <div>
                  <div class="flex items-center space-x-3">
                    <h6 class="text-base font-bold tracking-tight">{{ element.elementName }}</h6>
                    <span class="text-[10px] bg-black/20 px-2 py-0.5 rounded text-white/90 font-bold uppercase tracking-wider">
                      {{ element.materials.length }} items
                    </span>
                  </div>
                   <div class="text-xs text-white/80 font-medium mt-0.5">
                    Budget Allocation: {{ formatCurrency(element.totalBudget) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 uppercase tracking-wider">
                    {{ element.materials.filter(m => m.stockStatus === 'in_stock').length }} / {{ element.materials.length }} Stocked
                </div>
                <svg
                  :class="['w-5 h-5 text-white/70 transition-transform duration-300', { 'rotate-180': !isElementCollapsed(element.elementId) }]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <!-- Element Materials -->
            <div v-if="!isElementCollapsed(element.elementId)" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead>
                  <tr class="bg-slate-50/50 dark:bg-slate-800/50">
                    <!-- Item Details -->
                    <th class="px-5 py-3 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider w-1/4">Item Details</th>
                    <th class="px-5 py-3 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider w-24">Required Qty</th>
                    
                    <!-- Inventory Section -->
                    <th class="px-5 py-3 text-center text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-100/50 dark:bg-blue-900/30 border-l-2 border-r-2 border-blue-200 dark:border-blue-800 w-48 shadow-sm">
                        <div class="flex items-center justify-center gap-2">
                           <span class="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                             <i class="mdi mdi-warehouse text-base"></i>
                           </span>
                           <span>Store Availability</span>
                        </div>
                    </th>
                    
                    <!-- Procurement Section -->
                    <th class="px-5 py-3 text-center text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider bg-amber-100/50 dark:bg-amber-900/30 border-r-2 border-amber-200 dark:border-amber-800 shadow-sm" colspan="3">
                        <div class="flex items-center justify-center gap-2">
                           <span class="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                             <i class="mdi mdi-cart text-base"></i>
                           </span>
                           <span>Purchasing Action</span>
                        </div>
                    </th>
                  </tr>
                  <tr class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                      <th colspan="2" class="bg-white dark:bg-slate-800"></th>
                      <!-- Inventory Sub-headers -->
                       <th class="px-2 py-2 text-center text-[10px] font-bold text-blue-600 border-l-2 border-r-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">Stock Status</th>
                       
                       <!-- Procurement Sub-headers -->
                       <th class="px-2 py-2 text-center text-[10px] font-bold text-amber-600 border-r border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 w-24">Buy Qty</th>
                       <th class="px-2 py-2 text-left text-[10px] font-bold text-amber-600 border-r border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">PO Status</th>
                       <th class="px-2 py-2 text-left text-[10px] font-bold text-amber-600 border-r-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 w-1/4">Supplier</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700/50">
                  <tr v-for="material in element.materials" :key="material.budgetItemId" class="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                    
                    <!-- Description -->
                    <td class="px-5 py-4 align-top">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight leading-snug">{{ material.description }}</span>
                        <span class="text-[10px] font-mono text-slate-400 mt-1 select-all hover:text-slate-600 transition-colors">ID: {{ material.budgetItemId }}</span>
                      </div>
                    </td>

                    <!-- Quantity -->
                    <td class="text-right px-5 py-4 align-top">
                       <div class="inline-flex flex-col items-end">
                          <span class="text-sm font-bold text-slate-800 dark:text-white">{{ material.quantity }}</span>
                          <span class="text-[10px] font-medium text-slate-400 lowercase">{{ material.unitOfMeasurement }}</span>
                       </div>
                    </td>
                    
                    <!-- Inventory Column -->
                    <td class="px-4 py-3 align-top border-l border-r border-slate-100 dark:border-slate-700/50 bg-blue-50/5 dark:bg-blue-900/5">
                       <div class="flex flex-col space-y-2">
                          <select
                            v-model="material.stockStatus"
                            :disabled="!isStoresUser"
                            @change="updateStockStatus(material.budgetItemId, ($event.target as HTMLSelectElement).value)"
                            :class="[
                              'w-full pl-2.5 pr-8 py-1.5 text-xs font-bold border-0 rounded-lg ring-1 ring-inset focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer',
                              'bg-white dark:bg-slate-700 shadow-sm',
                              getStockStatusClass(material.stockStatus)
                            ]"
                          >
                            <option value="pending_check">⚠️ Unverified</option>
                            <option value="in_stock">✅ Fully Stocked</option>
                            <option value="partial_stock">🚧 Partial Stock</option>
                            <option value="out_of_stock">❌ Not in Stock</option>
                          </select>

                          <div class="flex items-center space-x-2">
                             <div class="relative w-full">
                                <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">SOH:</span>
                                <input
                                  type="number"
                                  v-model.number="material.stockQuantity"
                                  @input="updateStockQuantity(material.budgetItemId, ($event.target as HTMLInputElement).value)"
                                  min="0"
                                  :max="material.quantity"
                                  :disabled="!isStoresUser || material.stockStatus === 'out_of_stock' || material.stockStatus === 'pending_check'"
                                  class="w-full pl-9 pr-2 py-1 text-xs font-bold text-right border-0 ring-1 ring-slate-200 dark:ring-slate-600 rounded-md bg-transparent focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 transition-all placeholder-slate-300"
                                  placeholder="0"
                                />
                             </div>
                          </div>
                       </div>
                    </td>

                    <!-- Purchase Qty -->
                    <td class="px-4 py-3 align-top text-center border-r border-slate-100 dark:border-slate-700/50 bg-amber-50/5 dark:bg-amber-900/5">
                       <div class="py-1.5 px-3 rounded-lg font-black bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm inline-block min-w-[3rem]">
                           <span :class="material.purchaseQuantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'">
                               {{ material.purchaseQuantity }}
                           </span>
                       </div>
                    </td>

                    <!-- Procurement Status -->
                    <td class="px-4 py-3 align-top border-r border-slate-100 dark:border-slate-700/50 bg-amber-50/5 dark:bg-amber-900/5">
                         <select
                            v-model="material.procurementStatus"
                            @change="updateProcurementStatus(material.budgetItemId, ($event.target as HTMLSelectElement).value)"
                            :disabled="!isProcurementUser || (material.purchaseQuantity === 0 && material.procurementStatus === 'not_needed')"
                            :class="[
                              'w-full pl-2.5 pr-8 py-1.5 text-xs font-bold border-0 rounded-lg ring-1 ring-inset focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer',
                              'bg-white dark:bg-slate-700 shadow-sm',
                              getProcurementStatusClass(material.procurementStatus)
                            ]"
                          >
                            <option value="not_needed">No Purchase</option>
                            <option value="pending">⏳ Needs PO</option>
                            <option value="ordered">🚚 PO Sent</option>
                            <option value="received">📦 Goods Received</option>
                            <option value="cancelled">🚫 Cancelled</option>
                          </select>
                    </td>

                    <!-- Vendor -->
                    <td class="px-4 py-3 align-top bg-amber-50/5 dark:bg-amber-900/5">
                        <div class="relative group/input">
                           <i class="mdi mdi-store absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-amber-500 transition-colors"></i>
                           <input
                              v-model="material.vendorName"
                              :disabled="!isProcurementUser"
                              @input="updateVendorName(material.budgetItemId, ($event.target as HTMLInputElement).value)"
                              type="text"
                              placeholder="Enter Supplier Name..."
                              class="w-full pl-9 pr-3 py-1.5 text-xs font-medium border-0 ring-1 ring-slate-200 dark:ring-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 hover:ring-slate-300 dark:hover:ring-slate-500"
                            />
                        </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Tab -->
      <div v-if="activeTab === 'report'" class="space-y-8">
        
        <!-- Reporting Dashboard Header -->
        <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl">
           <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 class="text-2xl font-black text-white tracking-tight mb-2">Procurement Reporting Center</h3>
                <p class="text-slate-400 max-w-xl">Generate official documentation, analyze spending, and export datasets for external processing.</p>
              </div>
              <div class="flex gap-4">
                 <div class="text-right">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Generated On</p>
                    <p class="text-white font-mono text-sm bg-white/10 px-3 py-1.5 rounded-lg">{{ new Date().toLocaleDateString() }}</p>
                 </div>
              </div>
           </div>
        </div>

        <!-- Action Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <!-- Excel Export Card -->
           <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
              <div class="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <i class="mdi mdi-file-excel-box text-3xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Comprehensive Spreadsheet</h4>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                 Download the full procurement dataset including vendor assignments, stock levels, and purchasing quantities. Ideal for accounting and inventory reconciliation.
              </p>
              
              <button
                @click="exportToExcel"
                class="w-full py-3 px-4 bg-white border-2 border-slate-200 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>Download .CSV Report</span>
                <i class="mdi mdi-download group-hover/btn:translate-y-1 transition-transform"></i>
              </button>
           </div>

           <!-- Printable Report Card -->
           <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
              <div class="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <i class="mdi mdi-printer text-3xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Official Print View</h4>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                 Generate a clean, branded PDF-ready document suitable for physical approval signatures and hard-copy filing. Removes interactive elements for clarity.
              </p>
              
              <button
                @click="printReport"
                class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
              >
                <span>Open Print View</span>
                <i class="mdi mdi-open-in-new"></i>
              </button>
           </div>

        </div>

        <!-- Quick Stats Summary (Read-Only) -->
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
           <h5 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Report Data Preview</h5>
           <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                 <p class="text-xs text-slate-400 mb-1">Total Items</p>
                 <p class="text-xl font-black text-slate-800 dark:text-white">{{ procurementData.procurementItems.length }}</p>
              </div>
              <div class="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                 <p class="text-xs text-slate-400 mb-1">Suppliers Assigned</p>
                 <p class="text-xl font-black text-slate-800 dark:text-white">{{ new Set(procurementData.procurementItems.map(i => i.vendorName).filter(Boolean)).size }}</p>
              </div>
              <div class="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                 <p class="text-xs text-slate-400 mb-1">Purchase Orders</p>
                 <p class="text-xl font-black text-slate-800 dark:text-white">{{ procurementData.procurementItems.filter(i => i.purchaseQuantity > 0).length }} Pending</p>
              </div>
              <div class="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                 <p class="text-xs text-slate-400 mb-1">Budget Total</p>
                 <p class="text-xl font-black text-slate-800 dark:text-white">{{ formatCurrency(totalBudget) }}</p>
              </div>
           </div>
        </div>
      </div>

      <!-- Save Status Messages -->
      <div v-if="saveSuccess || saveError || isSaving" class="mb-4">
        <!-- Success Message -->
        <div v-if="saveSuccess" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
            <span class="text-lg">✅</span>
            <div>
              <p class="text-sm font-medium">Procurement data saved successfully</p>
              <p class="text-xs text-blue-500 dark:text-blue-300" v-if="lastSaveTime">
                Last saved: {{ lastSaveTime.toLocaleTimeString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="saveError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <span class="text-lg">⚠️</span>
            <div>
              <p class="text-sm font-medium">Failed to save procurement data</p>
              <p class="text-xs text-red-500 dark:text-red-300">{{ saveError }}</p>
            </div>
          </div>
        </div>

        <!-- Loading Message -->
        <div v-if="isSaving" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p class="text-sm font-medium">Saving procurement data...</p>
              <p class="text-xs text-blue-500 dark:text-blue-300">Please wait while we save your changes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
            @click="showSkipModal = true"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Skip Task
          </button>

          <button
            v-if="['skipped', 'completed'].includes(task.status)"
            @click="$emit('update-status', 'pending')"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
          </button>

          <button
            v-if="task.status !== 'completed' && task.status !== 'cancelled'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Task
          </button>

          <button
            v-if="isStoresUser && task.status !== 'completed'"
            @click="openHandoverModal('procurement')"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Handover to Procurement
          </button>

          <button
            v-if="isProcurementUser && task.status !== 'completed'"
            @click="openHandoverModal('stores')"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Handover to Stores
          </button>
        </div>

        <!-- Save Button -->
        <div class="flex items-center space-x-3">
          <!-- Unsaved Changes Indicator -->
          <div v-if="hasUnsavedChanges && !isSaving" class="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
            <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium">Unsaved changes</span>
          </div>

          <!-- Last Save Time -->
          <div v-if="lastSaveTime && !hasUnsavedChanges" class="text-xs text-gray-500 dark:text-gray-400">
            Saved {{ lastSaveTime.toLocaleTimeString() }}
          </div>

          <!-- Save Button -->
          <button
            @click="saveNow"
            :disabled="isSaving"
            :class="[
              'px-4 py-2 rounded-lg transition-colors flex items-center space-x-2',
              isSaving
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : hasUnsavedChanges
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            <span v-if="isSaving" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>{{ isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Save Procurement Data' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Handover Modal -->
    <div v-if="showHandoverModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Handover to {{ handoverTarget === 'procurement' ? 'Procurement' : 'Stores' }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select a {{ handoverTarget === 'procurement' ? 'procurement officer' : 'stores user' }} to assign this task to.
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To</label>
          <select
            v-model="selectedHandoverUser"
            class="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null">Select user...</option>
            <option v-for="user in handoverList" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="showHandoverModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="confirmHandover"
            :disabled="!selectedHandoverUser || isHandoverSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg flex items-center space-x-2"
          >
            <span v-if="isHandoverSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>Confirm Handover</span>
          </button>
        </div>
      </div>
    </div>
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
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import type { ProcurementTaskData, ProcurementItem } from '../../services'
import { useProcurementData } from '@/composables/useProcurementData'
import { useProcurementSave } from '@/composables/useProcurementSave'
import { useAutoSave } from '@/composables/useAutoSave'
import { CSVExporter } from '@/utils/csvExport'
import { useAuth } from '@/composables/useAuth'
import { useUsers } from '@/modules/admin/userManagement/composables/useUsers'
import api from '@/plugins/axios'

interface Props {
  task: EnquiryTask
  initialTab?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'save-procurement': [data: ProcurementTaskData]
  'complete': []
}>()

// Permissions and Role Management
const { user: authUser } = useAuth()
const { users: allUsers, fetchUsers } = useUsers()

const hasAuthRole = (role: string) => {
  return authUser.value?.roles?.some(r => r.toLowerCase() === role.toLowerCase()) || false
}

const isStoresUser = computed(() => true)
const isProcurementUser = computed(() => true)

// Handover Logic
const showHandoverModal = ref(false)
const selectedHandoverUser = ref<number | null>(null)
const isHandoverSubmitting = ref(false)
const handoverTarget = ref<'procurement' | 'stores'>('procurement')

const procurementUsers = computed(() => {
  return allUsers.value.filter(u => 
    u.roles.some(r => r.name.toLowerCase().includes('procurement')) ||
    u.department?.name.toLowerCase().includes('procurement')
  )
})

const storesUsers = computed(() => {
  return allUsers.value.filter(u => 
    u.roles.some(r => ['stores', 'store_keeper'].includes(r.name.toLowerCase())) ||
    u.department?.name.toLowerCase().includes('stores')
  )
})

const handoverList = computed(() => handoverTarget.value === 'procurement' ? procurementUsers.value : storesUsers.value)

const openHandoverModal = async (target: 'procurement' | 'stores') => {
  handoverTarget.value = target
  showHandoverModal.value = true
  if (allUsers.value.length === 0) {
    await fetchUsers()
  }
}

const confirmHandover = async () => {
  if (!selectedHandoverUser.value) return
  isHandoverSubmitting.value = true
  try {
    // Check if task is already assigned to determine endpoint
    // Note: TypeScript might not know about assigned_to, but it exists in backend model
    const isReassign = !!(props.task as any).assigned_to

    if (isReassign) {
      // Use reassign endpoint (PUT) which records history
      await api.put(`/api/projects/enquiry-tasks/${props.task.id}/reassign`, {
        new_assigned_user_id: selectedHandoverUser.value,
        reason: handoverTarget.value === 'procurement' ? 'Handover from Stores to Procurement' : 'Handover from Procurement to Stores'
      })
    } else {
      // Use assign endpoint (POST) which also records history
      await api.post(`/api/projects/enquiry-tasks/${props.task.id}/assign`, {
        assigned_user_id: selectedHandoverUser.value,
        notes: handoverTarget.value === 'procurement' ? 'Handover from Stores to Procurement' : 'Handover from Procurement to Stores'
      })
    }

    // Ensure status is updated to in_progress if not already
    if (props.task.status !== 'in_progress') {
      emit('update-status', 'in_progress')
    }

    showHandoverModal.value = false
    alert('Task successfully handed over to procurement.')
  } catch (e) {
    console.error('Handover failed:', e)
    alert('Failed to handover task. Please try again.')
  } finally {
    isHandoverSubmitting.value = false
  }
}

// Tab management
const activeTab = ref(props.initialTab || 'items')

// Watch initialTab to update activeTab when it changes while open
watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})
const tabs = [
  { id: 'items', label: 'Procurement Progress', icon: '📦' },
  { id: 'report', label: 'Export Data', icon: '📄' }
]

// Use composables
const {
  procurementData,
  isImporting,
  importError,
  totalBudget,
  totalSpent,
  budgetVariance,
  overallCompletionPercentage,
  completedItemsCount,
  importBudgetData,
  save: saveData
} = useProcurementData(props.task.id)

const {
  isSaving,
  saveError,
  saveSuccess,
  lastSaveTime,
  hasUnsavedChanges,
  save
} = useProcurementSave(props.task.id)


const formatDate = (dateValue: string | Date | null | undefined) => {
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

// Currency formatting function for budget display
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'KES 0'
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// Local state and functions for UI management
const collapsedElements = ref<Set<string>>(new Set())

interface GroupedElement {
  elementId: string
  elementName: string
  materials: ProcurementItem[]
  totalBudget: number
}

const groupedProcurementItems = computed(() => {
  const groups = new Map<string, GroupedElement>()

  procurementData.procurementItems.forEach(item => {
    const elementId = item.budgetElementId || 'unknown'
    const elementName = item.elementName || 'Unnamed Element'

    if (!groups.has(elementId)) {
      groups.set(elementId, {
        elementId,
        elementName,
        materials: [],
        totalBudget: 0
      })
    }

    const group = groups.get(elementId)!
    group.materials.push(item)
    group.totalBudget += item.budgetTotalPrice || 0
  })

  return Array.from(groups.values()).sort((a, b) =>
    (a.elementName || '').localeCompare(b.elementName || '')
  )
})

const isElementCollapsed = (elementId: string) => {
  return collapsedElements.value.has(elementId)
}

const toggleElementCollapse = (elementId: string) => {
  if (collapsedElements.value.has(elementId)) {
    collapsedElements.value.delete(elementId)
  } else {
    collapsedElements.value.add(elementId)
  }
}

const getElementHeaderClass = (elementName: string) => {
  const elementColors: Record<string, string> = {
    'STAGE': 'bg-gradient-to-r from-blue-600 to-blue-700',
    'BACKDROP': 'bg-gradient-to-r from-purple-600 to-purple-700',
    'LIGHTING': 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    'SOUND': 'bg-gradient-to-r from-teal-600 to-teal-700',
    'FURNITURE': 'bg-gradient-to-r from-red-600 to-red-700',
    'DECOR': 'bg-gradient-to-r from-pink-600 to-pink-700',
    'SIGNAGE': 'bg-gradient-to-r from-indigo-600 to-indigo-700',
    'BOOTH': 'bg-gradient-to-r from-cyan-600 to-cyan-700'
  }

  // Safety check for undefined elementName
  if (!elementName) {
    return 'bg-gradient-to-r from-gray-600 to-gray-700'
  }

  const upperElementName = elementName.toUpperCase()
  for (const [key, color] of Object.entries(elementColors)) {
    if (upperElementName.includes(key)) {
      return color
    }
  }

  return 'bg-gradient-to-r from-gray-600 to-gray-700'
}

const updateVendorName = (itemId: string, vendorName: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    item.vendorName = vendorName
    item.lastUpdated = new Date()
  }
}

// New Logic for Dual-Status Workflow

const updateStockStatus = (itemId: string, status: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    item.stockStatus = status as ProcurementItem['stockStatus']
    
    // Auto-calculate quantities based on status
    if (status === 'in_stock') {
      item.stockQuantity = item.quantity
      item.purchaseQuantity = 0
      item.procurementStatus = 'not_needed'
    } else if (status === 'out_of_stock') {
      item.stockQuantity = 0
      item.purchaseQuantity = item.quantity
      if (item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    } else if (status === 'partial_stock') {
      // Keep existing stock quantity if valid, otherwise reset
      if (item.stockQuantity >= item.quantity) {
        item.stockQuantity = 0
      }
      item.purchaseQuantity = Math.max(0, item.quantity - item.stockQuantity)
      if (item.purchaseQuantity > 0 && item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    } else if (status === 'pending_check') {
      item.stockQuantity = 0
      item.purchaseQuantity = item.quantity // Assume purchase needed until checked
    }
    
    item.lastUpdated = new Date()
  }
}

const updateStockQuantity = (itemId: string, qtyValue: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    const qty = parseInt(qtyValue) || 0
    item.stockQuantity = Math.min(Math.max(0, qty), item.quantity) // Clamp between 0 and total qty
    
    // Update purchase quantity
    item.purchaseQuantity = Math.max(0, item.quantity - item.stockQuantity)
    
    // Update statuses based on quantity
    if (item.stockQuantity === item.quantity) {
      item.stockStatus = 'in_stock'
      item.procurementStatus = 'not_needed'
    } else if (item.stockQuantity === 0) {
      item.stockStatus = 'out_of_stock'
      if (item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    } else {
      item.stockStatus = 'partial_stock'
      if (item.procurementStatus === 'not_needed') {
        item.procurementStatus = 'pending'
      }
    }
    
    item.lastUpdated = new Date()
  }
}

const updateProcurementStatus = (itemId: string, status: string) => {
  const item = procurementData.procurementItems.find(i => i.budgetItemId === itemId)
  if (item) {
    item.procurementStatus = status as ProcurementItem['procurementStatus']
    item.lastUpdated = new Date()
  }
}

// UI helpers
const getStatusCount = (status: string) => {
  return procurementData.procurementItems.filter(item => item.procurementStatus === status).length
}

const getStockStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'in_stock': 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300 ring-emerald-600/20',
    'partial_stock': 'text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 ring-amber-600/20',
    'out_of_stock': 'text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300 ring-rose-600/20',
    'pending_check': 'text-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-300 ring-slate-400/20'
  }
  return classes[status] || classes['pending_check']
}

const getProcurementStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'not_needed': 'text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 ring-slate-200',
    'pending': 'text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 ring-amber-600/20',
    'ordered': 'text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 ring-indigo-600/20',
    'received': 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300 ring-emerald-600/20',
    'cancelled': 'text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300 ring-rose-600/20'
  }
  return classes[status] || classes['pending']
}

// Export functions
const printReport = () => {
  const printContent = document.getElementById('printable-procurement-report')
  if (printContent) {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const title = 'Procurement Report - ' + projectInfo.value.enquiryTitle
      printWindow.document.write(
        '<!DOCTYPE html><html><head><title>' + title + '</title><style>' +
        'body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 40px; color: #1e293b; }' +
        'h1 { margin-bottom: 20px; font-size: 24px; font-weight: 800; }' +
        'table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }' +
        'th, td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; }' +
        'th { background-color: #f8fafc; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }' +
        '.header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }' +
        '.element-header { background-color: #f1f5f9; font-weight: 700; padding: 16px; margin-top: 24px; border-radius: 8px; font-size: 14px; }' +
        '.status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 10px; text-transform: uppercase; }' +
        '@media print { body { margin: 0; padding: 20px; } .no-print { display: none; } button { display: none; } }' +
        '</style></head><body>' + 
        '<div class="header"><h1>Procurement Report</h1><p>' + projectInfo.value.enquiryTitle + '</p></div>' +
        printContent.innerHTML + '</body></html>'
      )
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }
}

const exportToExcel = () => {
  try {
    CSVExporter.exportProcurementData(procurementData, projectInfo.value)
  } catch (error) {
    console.error('Failed to export Excel:', error)
    alert('Failed to export Excel file. Please try again.')
  }
}

// Project information
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || `ENQ-${props.task.id}`,
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'Unknown Client',
    eventVenue: enquiry?.venue || 'TBC',
    setupDate: enquiry?.expected_delivery_date || 'TBC',
    setDownDate: 'TBC'
  }
})


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

// Save function
const saveNow = async () => {
  await saveData()
}

// Auto-save setup
useAutoSave(
  () => procurementData,
  async () => {
    if (hasUnsavedChanges.value) {
      await saveData()
    }
  }
)
</script>
