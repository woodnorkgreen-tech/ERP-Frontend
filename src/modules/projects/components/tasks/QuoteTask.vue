<template>
  <div class="quote-task-content">
    <!-- Project Header Section -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quote Task - {{ task.title }}
      </h4>

      <!-- Project Information Display -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Information</h5>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold">{{ quoteData.projectInfo.enquiryTitle }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Enquiry Number</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium">{{ quoteData.projectInfo.projectId }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ quoteData.projectInfo.clientName }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Event Venue</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ quoteData.projectInfo.eventVenue }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Expected Delivery Date</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(quoteData.projectInfo.setupDate) }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 dark:text-gray-400">Quote Status</label>
            <span :class="getQuoteStatusColor(quoteData.status)" class="px-2 py-1 text-xs rounded-full font-medium">
              {{ getQuoteStatusLabel(quoteData.status) }}
            </span>
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
        <div class="flex items-center space-x-2">
          <button 
            @click="exitPreview"
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


    <!-- Versioning Controls (Always Visible) -->
    <div class="mb-6 flex justify-end space-x-2" v-if="hasExistingQuoteData || quoteVersions.length > 0">
      <CreateVersionButton
        title="Quote"
        type="quote"
        @create="handleCreateVersion"
      />
      <button
        @click="showVersionHistory = true"
        class="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center space-x-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Version History</span>
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
      <div class="flex items-center space-x-2 ml-4">
        <button
          @click="smartMergeBudget"
          :disabled="isMerging"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center"
        >
          <svg v-if="isMerging" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isMerging ? 'Refreshing...' : 'Refresh from Budget' }}
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
      <!-- Tab Navigation -->
      <div class="mb-6">
        <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
          >
            {{ tab.label }}
            <span v-if="getTabTotal(tab.id) > 0" class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              {{ formatCurrency(getTabTotal(tab.id)) }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <!-- Materials Tab -->
        <div v-if="activeTab === 'materials'" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Materials & Components</h5>
            <div class="flex items-center space-x-3">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Base: {{ formatCurrency(quoteData.totals.materialsBase) }} |
                Final: {{ formatCurrency(quoteData.totals.materialsTotal) }}
              </div>
            </div>
          </div>

          <div v-if="quoteData.materials.length > 0" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Days</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rate (KES)</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Total (KES)</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Margin %</th>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Final (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="element in quoteData.materials" :key="element.id">
                    <!-- Element Header Row -->
                    <tr class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <td colspan="8" class="py-2 px-4">
                        <div class="flex items-center justify-between">
                          <span class="font-medium text-gray-900 dark:text-white">{{ element.name }}</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ element.materials.length }} items | 
                            Base: {{ formatCurrency(element.baseTotal) }} → 
                            Final: {{ formatCurrency(element.finalTotal) }}
                          </span>
                        </div>
                      </td>
                    </tr>

                    <!-- Material Rows -->
                    <tr v-for="material in element.materials" :key="material.id" class="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td class="py-3 px-4 pl-8">
                        <div class="flex items-center space-x-2">
                          <span class="text-sm text-gray-600 dark:text-gray-300">{{ material.description }}</span>
                          <span v-if="material.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
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
        <div v-if="activeTab === 'labour'" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Direct Labour and Welfare Costs</h5>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total: {{ formatCurrency(quoteData.totals.labourBase) }}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Type</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rate (KES)</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Total (KES)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="labour in quoteData.labour" :key="labour.id" class="border-t border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ labour.category }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ labour.type }}</span>
                      <span v-if="labour.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ labour.unit }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ labour.quantity }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(labour.unitRate) }}</td>
                  <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(labour.amount) }}</td>
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
        <div v-if="activeTab === 'expenses'" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Expenses & Overheads</h5>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Base: {{ formatCurrency(quoteData.totals.expensesBase) }} |
              Final: {{ formatCurrency(quoteData.totals.expensesTotal) }}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in quoteData.expenses" :key="expense.id" class="border-t border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.description }}</span>
                      <span v-if="expense.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 capitalize">{{ expense.category }}</td>
                  <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(expense.amount) }}</td>
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
        <div v-if="activeTab === 'logistics'" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Logistics & Transportation</h5>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Base: {{ formatCurrency(quoteData.totals.logisticsBase) }} |
              Final: {{ formatCurrency(quoteData.totals.logisticsTotal) }}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Vehicle</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Description</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rate (KES)</th>
                  <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Total (KES)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="logistics in quoteData.logistics" :key="logistics.id" class="border-t border-gray-200 dark:border-gray-700">
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">{{ logistics.vehicleReg }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logistics.description }}</span>
                      <span v-if="logistics.isAddition" class="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Addition</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ logistics.unit }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ logistics.quantity }}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ formatCurrency(logistics.unitRate) }}</td>
                  <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ formatCurrency(logistics.amount) }}</td>
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
        <div v-if="activeTab === 'summary'" class="p-6">
          <h5 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-6">Quote Summary</h5>



          <!-- Discount & VAT Section -->
          <div class="mb-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Discount Section -->
              <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <div class="flex items-center justify-between mb-3">
                  <h6 class="text-sm font-medium text-red-800 dark:text-red-200">Quote Discount</h6>
                  <div class="text-xs text-red-600 dark:text-red-400">
                    Subtotal: {{ formatCurrency(quoteData.totals.subtotal) }}
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="flex-1">
                    <label class="block text-xs text-red-700 dark:text-red-300 mb-1">Discount Amount (KES)</label>
                    <input
                      v-model.number="quoteData.discountAmount"
                      type="number"
                      min="0"
                      :max="quoteData.totals.subtotal"
                      step="100"
                      placeholder="0"
                      class="w-full px-3 py-2 text-sm border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      @input="updateDiscount"
                    />
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-red-600 dark:text-red-400 mb-1">Discount %</div>
                    <div class="text-sm font-medium text-red-800 dark:text-red-200">
                      {{ quoteData.totals.subtotal > 0 ? ((quoteData.discountAmount / quoteData.totals.subtotal) * 100).toFixed(1) : 0 }}%
                    </div>
                  </div>
                </div>

                <div class="mt-3 text-xs text-red-600 dark:text-red-400">
                  <span v-if="quoteData.discountAmount > 0">
                    After discount: {{ formatCurrency(quoteData.totals.totalAfterDiscount) }}
                  </span>
                  <span v-else>
                    No discount applied
                  </span>
                </div>
              </div>

              <!-- VAT Section -->
              <div class="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <div class="flex items-center justify-between mb-3">
                  <h6 class="text-sm font-medium text-purple-800 dark:text-purple-200">Value Added Tax (16%)</h6>
                  <div class="flex items-center space-x-2">
                    <label class="text-xs text-purple-700 dark:text-purple-300">Enable VAT</label>
                    <input
                      v-model="quoteData.vatEnabled"
                      type="checkbox"
                      class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      @change="handleVATChange"
                    />
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xs text-purple-700 dark:text-purple-300 mb-1">VAT Rate (Fixed)</div>
                    <div class="text-lg font-bold text-purple-800 dark:text-purple-200">16%</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-purple-600 dark:text-purple-400 mb-1">VAT Amount</div>
                    <div class="text-lg font-bold text-purple-800 dark:text-purple-200">
                      {{ formatCurrency(quoteData.totals.vatAmount) }}
                    </div>
                  </div>
                </div>

                <div class="mt-3 text-xs text-purple-600 dark:text-purple-400">
                  <span v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0">
                    VAT on {{ formatCurrency(quoteData.totals.totalAfterDiscount) }} = {{ formatCurrency(quoteData.totals.vatAmount) }}
                  </span>
                  <span v-else-if="!quoteData.vatEnabled">
                    VAT is disabled for this quote
                  </span>
                  <span v-else>
                    No VAT applicable
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quote Summary Table -->
          <div class="mb-6">
            <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Cost Breakdown</h6>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Category</th>
                    <th class="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Base Cost</th>
                    <th class="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Margin %</th>
                    <th class="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Margin Amount</th>
                    <th class="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Final Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Materials & Components</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.materialsBase) }}</td>
                    <td class="py-3 px-4 text-center text-blue-600 dark:text-blue-400 font-medium">{{ quoteData.margins.materials }}%</td>
                    <td class="py-3 px-4 text-right text-blue-600 dark:text-blue-400">{{ formatCurrency(quoteData.totals.materialsMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.materialsTotal) }}</td>
                  </tr>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Labour & Welfare</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.labourBase) }}</td>
                    <td class="py-3 px-4 text-center text-yellow-600 dark:text-yellow-400 font-medium">{{ quoteData.margins.labour }}%</td>
                    <td class="py-3 px-4 text-right text-yellow-600 dark:text-yellow-400">{{ formatCurrency(quoteData.totals.labourMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.labourTotal) }}</td>
                  </tr>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Expenses & Overheads</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.expensesBase) }}</td>
                    <td class="py-3 px-4 text-center text-green-600 dark:text-green-400 font-medium">{{ quoteData.margins.expenses }}%</td>
                    <td class="py-3 px-4 text-right text-green-600 dark:text-green-400">{{ formatCurrency(quoteData.totals.expensesMargin) }}</td>
                    <td class="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(quoteData.totals.expensesTotal) }}</td>
                  </tr>
                  <tr class="border-t border-gray-200 dark:border-gray-700">
                    <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">Logistics & Transportation</td>
                    <td class="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{{ formatCurrency(quoteData.totals.logisticsBase) }}</td>
                    <td class="py-3 px-4 text-center text-orange-600 dark:text-orange-400 font-medium">{{ quoteData.margins.logistics }}%</td>
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

          <!-- Quote Actions -->
          <div class="mt-8 flex justify-center">
            <button
              @click="openQuoteViewer"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>View Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Viewer Modal -->
    <QuoteViewer
      :is-visible="showQuoteViewer"
      :quote-data="quoteData"
      :readonly="task.status === 'cancelled'"
      @close="closeQuoteViewer"
    />

    <!-- Version History Modal -->
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

    <!-- No Budget Data Message -->
    <div v-if="!quoteData.budgetImported && !isImporting" class="mb-6">
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
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex space-x-3">
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

        <div v-if="task.status === 'completed'" class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium">Task Completed</span>
          </div>

          <!-- View Quote Button for completed tasks -->
          <button
            @click="openQuoteViewer"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>View Quote</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useVersioning } from '@/composables/useVersioning'
import type { EnquiryTask } from '../../types/enquiry'
import axios from '@/plugins/axios'
import QuoteViewer from './QuoteViewer.vue'
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
}

// Props and emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Type alias for timeout handle
type TimeoutHandle = ReturnType<typeof setTimeout>

// Reactive state
const isImporting = ref(false)
const isMerging = ref(false)
const activeTab = ref('materials')
const marginUpdateTimeout = ref<TimeoutHandle | null>(null)
const showQuoteViewer = ref(false)

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
 * Initialize project information from task data
 */
const initializeProjectInfo = (): ProjectInfo => {
  // Use default values - real data will be loaded from API
  return {
    projectId: props.task.enquiry?.enquiry_number || String(props.task.id || 'N/A'),
    enquiryTitle: 'Project Title',
    clientName: 'Client Name',
    eventVenue: 'Venue TBC',
    setupDate: new Date().toISOString(),
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
  updatedAt: new Date()
})

// Auto-save functionality
const autoSaveTimeout = ref<TimeoutHandle | null>(null)
const isSavingQuote = ref(false)

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
    if (!quoteData.budgetImported || isSavingQuote.value || isPreviewingVersion.value || quoteData.status === 'approved') {
      return // Don't auto-save if no budget imported, already saving, in preview mode, or approved
    }
    
    try {
      isSavingQuote.value = true
      await saveQuote()
      console.log('Quote auto-saved successfully')
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      isSavingQuote.value = false
    }
  }, 2000) // 2 second debounce
}

// Watch for changes to trigger autosave
watch(
  () => ({
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
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
  cancelled: 'Cancelled'
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

// ... (keep other interfaces)

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
    // Ensure days is at least 1
    if (!item.days || item.days < 1) item.days = CONSTANTS.DEFAULT_DAYS
    
    // Calculate total price: Qty * Days * Unit Price
    item.totalPrice = item.quantity * item.days * item.unitPrice
    baseAmount = item.totalPrice
  } else {
    // Other items (Labour, Expenses, Logistics)
    baseAmount = item.amount
  }

  item.marginAmount = baseAmount * (item.marginPercentage / 100)
  item.finalPrice = baseAmount + item.marginAmount

  // Recalculate totals
  calculateAllTotals()

  // Update element totals if it's a material
  if ('totalPrice' in item) {
    updateMaterialElementTotals()
  }

  // Update timestamp
  quoteData.updatedAt = new Date()
}

/**
 * Update material element totals based on individual material margins
 */
const updateMaterialElementTotals = () => {
  quoteData.materials.forEach(element => {
    element.baseTotal = element.materials.reduce((sum, material) => sum + material.totalPrice, 0)
    element.marginAmount = element.materials.reduce((sum, material) => sum + material.marginAmount, 0)
    element.finalTotal = element.baseTotal + element.marginAmount
    element.marginPercentage = element.baseTotal > 0 ? (element.marginAmount / element.baseTotal) * 100 : 0
  })
}

/**
 * Apply bulk margin to all items in a category
 */
const applyBulkMargin = (category: 'materials' | 'expenses' | 'logistics', marginPercentage: number) => {
  switch (category) {
    case 'materials':
      quoteData.materials.forEach(element => {
        element.materials.forEach(material => {
          material.marginPercentage = marginPercentage
          updateIndividualMargin(material)
        })
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

  // Materials totals (sum from individual materials)
  quoteData.totals.materialsBase = roundCurrency(
    quoteData.materials.reduce((sum, element) =>
      sum + element.materials.reduce((matSum, material) => matSum + material.totalPrice, 0), 0)
  )
  quoteData.totals.materialsMargin = roundCurrency(
    quoteData.materials.reduce((sum, element) =>
      sum + element.materials.reduce((matSum, material) => matSum + material.marginAmount, 0), 0)
  )
  quoteData.totals.materialsTotal = roundCurrency(
    quoteData.materials.reduce((sum, element) =>
      sum + element.materials.reduce((matSum, material) => matSum + material.finalPrice, 0), 0)
  )

  // Labour totals (no individual margins, use category margin)
  quoteData.totals.labourBase = roundCurrency(
    quoteData.labour.reduce((sum, labour) => sum + labour.amount, 0)
  )
  quoteData.totals.labourMargin = roundCurrency(
    quoteData.totals.labourBase * (quoteData.margins.labour / 100)
  )
  quoteData.totals.labourTotal = roundCurrency(
    quoteData.totals.labourBase + quoteData.totals.labourMargin
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

// Load existing quote data
const loadExistingQuote = async () => {
  try {
    const response = await axios.get(`/api/projects/tasks/${props.task.id}/quote`)

    if (response.data.data) {
      Object.assign(quoteData, response.data.data)
      
      // AUTO-UPGRADE: If we detect the old default margin (20%), upgrade to new default (60%)
      if (quoteData.margins.materials === 20) {
        console.log('Upgrading old default margin 20% -> 60%')
        quoteData.margins.materials = 60
        
        // Use helper to update all materials that still have the old default
        quoteData.materials.forEach(element => {
          element.materials.forEach(material => {
            if (material.marginPercentage === 20) {
              material.marginPercentage = 60
              updateIndividualMargin(material)
            }
          })
        })
      }

      calculateAllTotals()
      console.log('Existing quote data loaded successfully')
    }
  } catch (error) {
    // Quote doesn't exist yet, use defaults
    console.log('No existing quote found, starting fresh')
  }
}

// Save quote data (exposed for external use)
const saveQuote = async () => {
  // Prevent modification if approved
  if (quoteData.status === 'approved') {
    console.log('Quote is approved and cannot be modified.')
    return
  }

  try {
    await axios.post(`/api/projects/tasks/${props.task.id}/quote`, {
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
      status: quoteData.status
    })

    quoteData.updatedAt = new Date()
    console.log('Quote saved successfully!')

  } catch (error) {
    console.error('Failed to save quote:', error)
    throw error
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
