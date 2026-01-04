<template>
  <div class="production-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Project Header Section -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Production Task - {{ task.title }}
      </h4>

      <!-- Project Information Display -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Project Information</h5>
          <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            Production Task
          </span>
        </div>
        <!-- Project Information Grid - Responsive layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <!-- Project Title -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold mt-1 break-words">
              {{ projectInfo.enquiryTitle || 'Untitled Project' }}
            </p>
          </div>

          <!-- Enquiry Number -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Enquiry Number</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium mt-1 font-mono">
              {{ projectInfo.projectId }}
            </p>
          </div>

          <!-- Client Name -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1 break-words">
              {{ projectInfo.clientName }}
            </p>
          </div>

          <!-- Event Venue -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Event Venue</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1 break-words">
              {{ projectInfo.eventVenue }}
            </p>
          </div>

          <!-- Expected Delivery Date -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Expected Delivery</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">
              <span v-if="formatDate(projectInfo.setupDate) !== 'TBC'" class="font-medium">
                {{ formatDate(projectInfo.setupDate) }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                TBC
              </span>
            </p>
          </div>

          <!-- Set Down Date -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Set Down Date</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">
              <span v-if="formatDate(projectInfo.setDownDate) !== 'TBC'" class="font-medium">
                {{ formatDate(projectInfo.setDownDate) }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                TBC
              </span>
            </p>
          </div>

          <!-- Estimated Budget (conditional) -->
          <div v-if="projectInfo.estimatedBudget" class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estimated Budget</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium mt-1">
              <span class="text-green-600 dark:text-green-400">KES {{ formatCurrency(projectInfo.estimatedBudget) }}</span>
            </p>
          </div>

          <!-- Contact Person -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Person</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1 break-words">
              {{ projectInfo.contactPerson }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav
        class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto"
        role="tablist"
        aria-label="Production task navigation"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          @keydown="handleTabKeydown($event, tabs.indexOf(tab))"
          :id="`tab-${tab.id}`"
          role="tab"
          :aria-selected="activeTab === tab.id"
          :aria-controls="`tab-panel-${tab.id}`"
          :tabindex="activeTab === tab.id ? 0 : -1"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="getTabBadgeCount(tab.id) > 0"
            :class="[
              'ml-2 px-2 py-0.5 text-xs rounded-full',
              getTabBadgeClass(tab.id)
            ]"
          >
            {{ getTabBadgeCount(tab.id) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container">
      <!-- Production Elements Tab -->
      <div
        v-show="activeTab === 'production-elements'"
        class="production-elements-section tab-panel"
        :id="`tab-panel-production-elements`"
        role="tabpanel"
        :aria-labelledby="`tab-production-elements`"
        :class="{ 'animate-fade-in': activeTab === 'production-elements' }"
      >
        <!-- Materials Import Status -->
        <div v-if="isImportingMaterials || materialsImportError || lastMaterialsImport" class="mb-6 p-4 rounded-lg border">
          <!-- Loading State -->
          <div v-if="isImportingMaterials" class="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span class="text-sm font-medium">Importing materials from Materials Task...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="materialsImportError" class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3">

                <div class="flex-1">
                  <p class="text-sm font-medium text-red-800 dark:text-red-200">Failed to Import Materials</p>
                  <p class="text-xs text-red-600 dark:text-red-300 mt-1">{{ materialsImportError }}</p>
                </div>
              </div>
              <button
                @click="retryMaterialsImport"
                class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>

          <!-- Success State -->
          <div v-else-if="lastMaterialsImport" class="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div class="flex items-center space-x-3 text-green-600 dark:text-green-400">

              <div>
                <p class="text-sm font-medium">Materials imported successfully</p>
                <p class="text-xs text-green-500 dark:text-green-300">
                  {{ productionData.productionElements.length }} production elements imported at {{ lastMaterialsImport.toLocaleTimeString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Production Elements Content -->
        <div v-if="productionData.productionElements.length > 0">
          <!-- Summary Header -->
          <div class="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Production Elements</h4>
              <div class="flex items-center space-x-2">
                <button
                  @click="toggleAllCategories"
                  class="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded transition-colors"
                >
                  {{ allCategoriesCollapsed ? 'Expand All' : 'Collapse All' }}
                </button>
                <button
                  @click="retryMaterialsImport"
                  class="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <span class="font-medium">{{ productionData.productionElements.length }}</span> Elements
              </div>
              <div>
                <span class="font-medium">{{ categoriesWithElements.length }}</span> Categories
              </div>
              <div>
                <span class="font-medium">{{ getTotalQuantity() }}</span> Items
              </div>
              <div>
                <span class="font-medium">{{ getUniqueUnits().length }}</span> Units
              </div>
            </div>
          </div>

          <!-- Elements by Category -->
          <div class="space-y-4">
            <div v-for="category in categoriesWithElements" :key="category.id" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <!-- Category Header -->
              <div
                class="p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors border-b border-gray-200 dark:border-gray-700"
                @click="toggleCategoryCollapse(category.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ category.displayName }}</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getElementsByCategory(category.id).length }} items
                    </span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getCategoryTotalQuantity(category.id) }} total
                    </span>
                    <svg
                      :class="['w-4 h-4 text-gray-500 transition-transform', { 'rotate-180': !isCategoryCollapsed(category.id) }]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Category Elements (Expandable) -->
              <div v-if="!isCategoryCollapsed(category.id)" class="bg-white dark:bg-gray-800">
                <table class="w-full text-sm">
                  <thead class="border-b border-gray-200 dark:border-gray-700">
                    <tr class="text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                      <th class="px-4 py-2 font-medium">Name</th>
                      <th class="px-4 py-2 font-medium">Description</th>
                      <th class="px-4 py-2 font-medium text-right">Quantity</th>
                      <th class="px-4 py-2 font-medium">Unit</th>
                      <th class="px-4 py-2 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="element in getElementsByCategory(category.id)"
                      :key="element.id"
                      class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {{ element.name || element.description }}
                      </td>
                      <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {{ element.description }}
                      </td>
                      <td class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                        {{ element.quantity }}
                      </td>
                      <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {{ element.unitOfMeasurement || element.unit }}
                      </td>
                      <td class="px-4 py-3 text-right text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(element.createdAt?.toString() || element.created_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Collapsed Category Summary -->
              <div
                v-else
                class="bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-500 dark:text-gray-400 text-center"
              >
                Click to expand {{ getElementsByCategory(category.id).length }} elements
              </div>
            </div>
          </div>
        </div>

        <!-- No Materials State -->
        <div v-else-if="!isImportingMaterials" class="text-center py-12">
          <div class="mb-4">

          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Production Elements Available</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Production elements will be automatically imported from the Materials Task.
          </p>
          <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>• Complete the Materials Task first</p>
            <p>• Ensure materials are properly configured</p>
            <p>• Elements will sync automatically</p>
          </div>
          <button
            @click="retryMaterialsImport"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Import Again
          </button>
        </div>
      </div>

        <!-- Procurement Status Tab -->
        <div v-if="activeTab === 'procurement-status'" class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
               <h3 class="text-lg font-medium text-gray-900 dark:text-white">Procurement & Stock Status</h3>
               <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">View the status of materials from the Procurement task.</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                   <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item / Description</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Status</th>
                      <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Procurement Status</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Qty</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Req. Qty</th>
                   </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                   <tr v-for="(item, index) in productionData.relatedProcurementItems" :key="index">
                      <td class="px-6 py-4">
                         <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.elementName }}</div>
                         <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</div>
                      </td>
                       <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {{ item.category }}
                       </td>
                       <td class="px-6 py-4 text-center">
                          <span :class="['px-2 py-1 text-xs rounded-full border', getStockStatusClass(item.stockStatus)]">
                             {{ (item.stockStatus || 'pending_check').replace(/_/g, ' ').toUpperCase() }}
                          </span>
                       </td>
                       <td class="px-6 py-4 text-center">
                          <span :class="['px-2 py-1 text-xs rounded-full border', getProcurementStatusClass(item.procurementStatus)]">
                             {{ (item.procurementStatus || 'not_needed').replace(/_/g, ' ').toUpperCase() }}
                          </span>
                       </td>
                       <td class="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                          {{ item.stockQuantity }}
                       </td>
                       <td class="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                          {{ item.quantity }}
                       </td>
                   </tr>
                   <tr v-if="!productionData.relatedProcurementItems || productionData.relatedProcurementItems.length === 0">
                      <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                         No procurement data available.
                      </td>
                   </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      <!-- Quality Control Tab -->
      <div
        v-show="activeTab === 'quality'"
        class="quality-control-section tab-panel"
        :id="`tab-panel-quality`"
        role="tabpanel"
        :aria-labelledby="`tab-quality`"
        :class="{ 'animate-fade-in': activeTab === 'quality' }"
      >
        <!-- Quality Control Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">Quality Control Management</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monitor and validate production quality across all categories
            </p>
          </div>
          <div class="flex items-center space-x-3" v-if="!isReadOnly">
            <button
              @click="generateQualityCheckpoints"
              class="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Regenerate Checkpoints
            </button>
            <button
              @click="exportQualityReport"
              class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Export Report
            </button>
          </div>
          <div class="flex items-center space-x-3" v-else>
             <button
              @click="exportQualityReport"
              class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>

        <!-- Quality Control Summary -->
        <div v-if="productionData.qualityControl.length > 0" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Quality Control Summary</h5>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ productionData.qualityControl.length }}</div>
              <div class="text-gray-600 dark:text-gray-400">Total Checkpoints</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ getQualityStatusCount('passed') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Passed</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ getQualityStatusCount('failed') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Failed</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ getQualityStatusCount('pending') + getQualityStatusCount('in_progress') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </div>

          <!-- Overall Quality Progress -->
          <div class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Quality Progress</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ qualityProgressPercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: qualityProgressPercentage + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Quality Control Checkpoints -->
        <div v-if="productionData.qualityControl.length > 0" class="space-y-4">
          <div
            v-for="checkpoint in productionData.qualityControl"
            :key="checkpoint.id"
            class="quality-checkpoint border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            :class="getCheckpointBorderClass(checkpoint.status)"
          >
            <!-- Checkpoint Header -->
            <div class="checkpoint-header p-4 bg-white dark:bg-gray-800">
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ checkpoint.categoryName }}</h4>
                    <span :class="getQualityStatusBadgeClass(checkpoint.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                      {{ getQualityStatusIcon(checkpoint.status) }} {{ checkpoint.status.replace('_', ' ').toUpperCase() }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{{ checkpoint.elementCount }} production elements</span>
                    <span v-if="checkpoint.checkedBy">Checked by: {{ checkpoint.checkedBy }}</span>
                    <span v-if="checkpoint.checkedAt">{{ formatDate(checkpoint.checkedAt) }}</span>
                  </div>
                </div>

                <!-- Status Controls -->
                <div class="flex items-center space-x-3">
                  <select
                    v-model="checkpoint.status"
                    @change="updateQualityStatus(checkpoint.id, checkpoint.status)"
                    :class="[
                      'status-select px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                      getQualityStatusSelectClass(checkpoint.status)
                    ]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                  </select>

                  <button
                    @click="toggleCheckpointDetails(checkpoint.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    :aria-label="isCheckpointDetailsExpanded(checkpoint.id) ? 'Hide details' : 'Show details'"
                  >
                    <svg
                      :class="['w-5 h-5 transition-transform', { 'rotate-180': isCheckpointDetailsExpanded(checkpoint.id) }]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Checkpoint Details (Expandable) -->
            <div v-if="isCheckpointDetailsExpanded(checkpoint.id)" class="checkpoint-details bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
              <!-- Checklist Items -->
              <div v-if="checkpoint.checklist" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Checklist Items
                </label>
                <div class="space-y-2">
                  <div
                    v-for="item in checkpoint.checklist"
                    :key="item.id"
                    class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      :id="`${checkpoint.id}-${item.id}`"
                      v-model="item.checked"
                      @change="updateChecklistItem(checkpoint.id, item.id, item.checked)"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      :for="`${checkpoint.id}-${item.id}`"
                      class="flex-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      :class="{ 'line-through text-gray-500 dark:text-gray-500': item.checked }"
                    >
                      {{ item.label }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Notes Section -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality Control Notes
                </label>
                <textarea
                  v-model="checkpoint.notes"
                  @input="updateCheckpointNotes(checkpoint.id, checkpoint.notes)"
                  rows="3"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add quality control notes, observations, or issues found..."
                ></textarea>
              </div>

              <!-- Quality Metrics -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="quality-metric">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Quality Score</label>
                  <div class="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      v-model="checkpoint.qualityScore"
                      @input="updateQualityScore(checkpoint.id, checkpoint.qualityScore)"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-white w-12">{{ checkpoint.qualityScore || 0 }}%</span>
                  </div>
                </div>

                <div class="quality-metric">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Inspector</label>
                  <input
                    type="text"
                    v-model="checkpoint.checkedBy"
                    @input="updateInspector(checkpoint.id, checkpoint.checkedBy)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Inspector name"
                  />
                </div>

                <div class="quality-metric">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Priority</label>
                  <select
                    v-model="checkpoint.priority"
                    @change="updateCheckpointPriority(checkpoint.id, checkpoint.priority)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between items-center">
                <div class="flex space-x-2">
                  <button
                    v-if="checkpoint.status === 'failed'"
                    @click="retryQualityCheck(checkpoint.id)"
                    class="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                  >
                    Retry Check
                  </button>
                  <button
                    @click="duplicateCheckpoint(checkpoint.id)"
                    class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Duplicate
                  </button>
                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {{ checkpoint.checkedAt ? formatDate(checkpoint.checkedAt) : 'Never' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Quality Control State -->
        <div v-else class="text-center py-12">
          <div class="mb-4">

          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Quality Control Checkpoints</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Quality control checkpoints will be automatically generated based on production elements.
          </p>
          <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>• Import production elements first</p>
            <p>• Checkpoints are created for each category</p>
            <p>• Track quality status and add notes</p>
          </div>
          <button
            @click="generateQualityCheckpoints"
            class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Generate Quality Checkpoints
          </button>
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
        <div class="issues-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Production Issues Tracking</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track and resolve production issues across all categories
            </p>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              v-model="selectedIssueCategory"
              class="category-filter px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="materials">Materials</option>
              <option value="equipment">Equipment</option>
              <option value="quality">Quality</option>
              <option value="timeline">Timeline</option>
              <option value="safety">Safety</option>
              <option value="other">Other</option>
            </select>
            <button
              v-if="!isReadOnly"
              @click="showAddIssueModal = true"
              class="add-issue-btn px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Add Issue</span>
            </button>
          </div>
        </div>

        <!-- Debug Info -->
        <div class="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 text-xs">
          Debug: Issues count: {{ productionData.issues.length }}, Filtered: {{ filteredIssues.length }}, Category: "{{ selectedIssueCategory }}"
        </div>

        <!-- Issues Summary -->
        <div v-if="productionData.issues.length > 0" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Issues Summary</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ productionData.issues.length }}</div>
              <div class="text-gray-600 dark:text-gray-400">Total Issues</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ getIssueStatusCount('open') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Open</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ getIssueStatusCount('in_progress') }}</div>
              <div class="text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ getIssueStatusCount('resolved') }}</div>
              <div class="text-gray-600 dark:text-gray-400">Resolved</div>
            </div>
          </div>
        </div>

        <!-- Issues List -->
        <div v-if="filteredIssues.length > 0" class="space-y-4">
          <div
            v-for="issue in filteredIssues"
            :key="issue.id"
            class="issue-item border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            :class="getIssueBorderClass(issue.status, issue.priority)"
          >
            <!-- Issue Header -->
            <div class="issue-header p-4 bg-white dark:bg-gray-800">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <div class="flex-1">
                  <div class="flex items-start space-x-3 mb-2">
                    <h4 class="font-medium text-gray-900 dark:text-white text-lg">{{ issue.title }}</h4>
                    <div class="flex space-x-2">
                      <span :class="getCategoryClass(issue.category)" class="category-badge px-2 py-1 text-xs rounded-full font-medium">
                        {{ getCategoryIcon(issue.category) }} {{ issue.category.toUpperCase() }}
                      </span>
                      <span :class="getPriorityClass(issue.priority)" class="priority-badge px-2 py-1 text-xs rounded-full font-medium">
                        {{ getPriorityIcon(issue.priority) }} {{ issue.priority.toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ issue.description }}</p>
                  <div class="flex flex-wrap items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Reported: {{ formatDate(issue.reportedDate) }}</span>
                    <span>By: {{ issue.reportedBy }}</span>
                    <span v-if="issue.resolvedDate">Resolved: {{ formatDate(issue.resolvedDate) }}</span>
                  </div>
                </div>

                <!-- Issue Actions -->
                <div class="flex items-center space-x-3">
                  <select
                    v-model="issue.status"
                    @change="updateIssueStatus(issue.id, issue.status)"
                    :class="[
                      'px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                      getIssueStatusSelectClass(issue.status)
                    ]"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    @click="toggleIssueDetails(issue.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    :aria-label="isIssueDetailsExpanded(issue.id) ? 'Hide details' : 'Show details'"
                  >
                    <svg
                      :class="['w-5 h-5 transition-transform', { 'rotate-180': isIssueDetailsExpanded(issue.id) }]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <button
                    @click="deleteIssue(issue.id)"
                    class="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                    :aria-label="'Delete issue'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Issue Details (Expandable) -->
            <div v-if="isIssueDetailsExpanded(issue.id)" class="issue-details bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
              <!-- Resolution Section -->
              <div v-if="issue.status === 'resolved' && issue.resolution" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <h5 class="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Resolution</h5>
                <p class="text-sm text-green-700 dark:text-green-300">{{ issue.resolution }}</p>
              </div>

              <!-- Issue Actions -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="issue.status !== 'resolved'"
                  @click="markIssueResolved(issue.id)"
                  class="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                >
                  Mark Resolved
                </button>
                <button
                  v-if="issue.status === 'resolved'"
                  @click="reopenIssue(issue.id)"
                  class="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                >
                  Reopen Issue
                </button>
                <button
                  @click="duplicateIssue(issue.id)"
                  class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Duplicate
                </button>
                <button
                  @click="escalateIssue(issue.id)"
                  class="px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                >
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Issues State -->
        <div v-else class="text-center py-12">
          <div class="mb-4">
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ selectedIssueCategory ? 'No issues in this category' : 'No Production Issues' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ selectedIssueCategory
              ? `No ${selectedIssueCategory} issues have been reported yet.`
              : 'Great! No production issues have been reported yet.'
            }}
          </p>
          <button
            @click="showAddIssueModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Report First Issue
          </button>
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
      <div
        v-show="activeTab === 'design'"
        class="design-section tab-panel"
        :id="`tab-panel-design`"
        role="tabpanel"
        :aria-labelledby="`tab-design`"
        :class="{ 'animate-fade-in': activeTab === 'design' }"
      >
         <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Design Assets</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View artworks, renders, and designs associated with this project.
            </p>
         </div>

         <!-- Loading State -->
         <div v-if="isLoadingDesignAssets" class="flex justify-center py-12">
            <div class="flex flex-col items-center space-y-3 text-blue-600 dark:text-blue-400">
               <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               <span class="text-sm font-medium">Loading design assets...</span>
            </div>
         </div>

         <!-- Error State -->
         <div v-else-if="designAssetsError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
            <p class="text-red-600 dark:text-red-300">{{ designAssetsError }}</p>
            <button @click="fetchDesignAssets" class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">Try Again</button>
         </div>

         <!-- Empty State -->
         <div v-else-if="designAssets.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">No design assets found for this project.</p>
         </div>

         <!-- Assets Grid -->
         <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="asset in designAssets"
              :key="asset.id"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              @click="openPreview(asset)"
            >
              <!-- Asset Preview/Icon -->
              <div class="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
                <!-- Image Preview with Loading State -->
                <template v-if="isImageAsset(asset)">
                  <!-- Loading Placeholder -->
                  <div class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <svg class="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <!-- Actual Image -->
                  <img
                    :src="getAssetUrl(asset)"
                    :alt="asset.file_name || asset.name || asset.original_name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                    @load="(e) => { const parent = (e.target as HTMLElement)?.parentElement?.querySelector('.absolute'); if (parent) parent.remove(); }"
                  />
                </template>
                
                <!-- PDF Icon -->
                <div v-else-if="isPdfAsset(asset)" class="flex flex-col items-center">
                  <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">PDF DOCUMENT</span>
                </div>
                
                <!-- Generic File Icon -->
                <div v-else class="flex flex-col items-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                  </svg>
                  <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ asset.category?.toUpperCase() || 'FILE' }}</span>
                </div>

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="px-4 py-2 bg-white/90 text-gray-900 text-xs font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    CLICK TO PREVIEW
                  </div>
                </div>
              </div>

              <!-- Asset Info -->
              <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-gray-900 dark:text-white truncate text-sm" :title="asset.file_name || asset.name">
                      {{ asset.file_name || asset.name || asset.original_name }}
                    </h4>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                      {{ asset.category }}
                    </p>
                  </div>
                </div>
                
                <!-- Status & Date -->
                <div class="mt-3 flex items-center justify-between">
                  <span
                    :class="{
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400': asset.status === 'approved',
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400': asset.status === 'pending',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': asset.status === 'rejected',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': asset.status === 'revision' || asset.status === 'concept',
                    }"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  >
                    {{ asset.status }}
                  </span>
                  <span class="text-[10px] text-gray-400 font-medium">
                    {{ asset.created_at ? new Date(asset.created_at).toLocaleDateString() : 'N/A' }}
                  </span>
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
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Production
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          :disabled="completionPercentage < 100"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors',
            completionPercentage >= 100
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          ]"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import api from '@/plugins/axios'

// Status styling helpers
const getStockStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'in_stock': 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600 text-blue-700 dark:text-blue-300',
    'partial_stock': 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600 text-amber-700 dark:text-amber-300',
    'out_of_stock': 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 text-red-700 dark:text-red-300',
    'pending_check': 'border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300'
  }
  return classes[status] || classes['pending_check']
}

const getProcurementStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'not_needed': 'border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-400 dark:text-gray-500',
    'pending': 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600 text-blue-700 dark:text-blue-300',
    'ordered': 'border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600 text-purple-700 dark:text-purple-300',
    'received': 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600 text-green-700 dark:text-green-300',
    'cancelled': 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 text-red-700 dark:text-red-300'
  }
  return classes[status] || classes['pending']
}


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

// Initialize activeTab with initialTab if provided, otherwise default to 'production-elements'
const activeTab = ref(props.initialTab || 'production-elements')

// Watch initialTab to update activeTab when it changes while open
watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})

// Tab navigation with enhanced functionality
const tabs = [
  { id: 'production-elements', label: 'Production Elements', description: 'View and manage production elements' },
  { id: 'procurement-status', label: 'Procurement Status', description: 'View procurement and stock status' },
  { id: 'quality', label: 'Quality Control', description: 'Manage quality control checkpoints' },
  { id: 'issues', label: 'Issues', description: 'Track and resolve production issues' },
  { id: 'design', label: 'Design Files', description: 'View Design Artworks and Renders' }
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

// UI state
const selectedIssueCategory = ref('')

// Project information computed from task.enquiry (following MaterialsTask pattern)
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry

  return {
    projectId: enquiry?.enquiry_number || `ENQ-${props.task.id}`,
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
// Date formatting function (following MaterialsTask pattern)
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
const getQualityStatusCount = (status: QualityControlCheckpoint['status']): number => {
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

const getIssueStatusCount = (status: ProductionIssue['status']): number => {
  return productionData.value.issues.filter(issue => issue.status === status).length
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

const deleteIssue = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue && confirm(`Are you sure you want to delete the issue "${issue.title}"?`)) {
    const index = productionData.value.issues.findIndex(i => i.id === issueId)
    if (index !== -1) {
      productionData.value.issues.splice(index, 1)
      expandedIssues.value.delete(issueId)
      console.log(`Issue deleted: ${issue.title}`)
      // Auto-save would be triggered here
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
      console.log(`Issue resolved: ${issue.title}`)
      // Auto-save would be triggered here
    }
  }
}

const reopenIssue = (issueId: string) => {
  const issue = productionData.value.issues.find(i => i.id === issueId)
  if (issue && confirm(`Are you sure you want to reopen the issue "${issue.title}"?`)) {
    issue.status = 'open'
    issue.resolvedDate = undefined
    issue.resolution = undefined
    console.log(`Issue reopened: ${issue.title}`)
    // Auto-save would be triggered here
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

// Issue icon functions
const getCategoryIcon = (category: ProductionIssue['category']): string => {
  const icons: Record<string, string> = {
    'materials': '📦',
    'equipment': '🔧',
    'quality': '✓',
    'timeline': '⏰',
    'safety': '⚠️',
    'other': '📋'
  }
  return icons[category] || '📋'
}

const getPriorityIcon = (priority: ProductionIssue['priority']): string => {
  const icons: Record<string, string> = {
    'low': '🔵',
    'medium': '🟡',
    'high': '🔴'
  }
  return icons[priority] || '⚪'
}

const getCategoryClass = (category: ProductionIssue['category']) => {
  const categoryInfo = issueCategories.value.find(c => c.id === category)
  const colorClasses: Record<string, string> = {
    'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'orange': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    'green': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'red': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'gray': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
  return colorClasses[categoryInfo?.color || 'gray']
}



const getPriorityClass = (priority: ProductionIssue['priority']) => {
  const classes: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'high': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}



const getIssueBorderClass = (status: ProductionIssue['status'], priority: ProductionIssue['priority']) => {
  // Priority-based left border with status-based styling
  const priorityBorder = {
    'low': 'border-l-4 border-l-gray-400',
    'medium': 'border-l-4 border-l-yellow-500',
    'high': 'border-l-4 border-l-red-500'
  }

  const statusBorder = {
    'open': 'border-red-200 dark:border-red-800',
    'in_progress': 'border-yellow-200 dark:border-yellow-800',
    'resolved': 'border-green-200 dark:border-green-800'
  }

  return `${priorityBorder[priority] || priorityBorder.medium} ${statusBorder[status] || statusBorder.open}`
}

const getIssueStatusSelectClass = (status: ProductionIssue['status']) => {
  const classes: Record<string, string> = {
    'open': 'border-red-300 dark:border-red-600 ring-red-200 dark:ring-red-800',
    'in_progress': 'border-yellow-300 dark:border-yellow-600 ring-yellow-200 dark:ring-yellow-800',
    'resolved': 'border-green-300 dark:border-green-600 ring-green-200 dark:ring-green-800'
  }
  return classes[status] || 'border-gray-300 dark:border-gray-600'
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
const convertToCamelCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(convertToCamelCase)

  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = convertToCamelCase(value)
  }
  return result
}

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

// Data persistence and API integration
const isSaving = ref(false)
const saveError = ref<string | null>(null)
const lastSaveTime = ref<Date | null>(null)
const hasUnsavedChanges = ref(false)
const saveRetryCount = ref(0)
const maxSaveRetries = 3

// Auto-save debouncing
let autoSaveTimeout: number | null = null
const autoSaveDelay = 500 // 500ms delay

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

const getCategoryTotalQuantity = (categoryId: string): number => {
  return getElementsByCategory(categoryId).reduce((total, element) => total + element.quantity, 0)
}

// Category collapse/expand functionality
const collapsedCategories = ref<Set<string>>(new Set())

const toggleCategoryCollapse = (categoryId: string) => {
  if (collapsedCategories.value.has(categoryId)) {
    collapsedCategories.value.delete(categoryId)
  } else {
    collapsedCategories.value.add(categoryId)
  }
}

const isCategoryCollapsed = (categoryId: string): boolean => {
  return collapsedCategories.value.has(categoryId)
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
  return categoryIds.size > 0 && Array.from(categoryIds).every(id => collapsedCategories.value.has(id))
})

const toggleAllCategories = () => {
  const categoryIds = new Set(productionData.value.productionElements.map(element => element.category))

  if (allCategoriesCollapsed.value) {
    // Expand all categories
    collapsedCategories.value.clear()
  } else {
    // Collapse all categories
    collapsedCategories.value = new Set(categoryIds)
  }
}

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
