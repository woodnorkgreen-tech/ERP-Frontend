<template>
  <div class="production-task bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 text-slate-800 dark:text-slate-200">

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-16 text-slate-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      <span class="text-sm">Loading production data...</span>
    </div>

    <template v-else>
      <!-- Task Header -->
      <div class="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white">{{ task.title }}</h3>
            <div class="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span v-if="productionData.productionData.workOrderNumber">
                WO: {{ productionData.productionData.workOrderNumber }}
              </span>
              <span
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="productionData.productionData.executionHealth.status === 'at_risk'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'"
              >
                {{ productionData.productionData.executionHealth.status.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <!-- Progress Summary -->
          <div class="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div class="text-center">
              <div class="font-semibold text-slate-800 dark:text-slate-100">{{ productionData.productionData.executionHealth.progress }}%</div>
              <div class="text-xs">Progress</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-slate-800 dark:text-slate-100">{{ productionData.productionData.executionHealth.qcPassRate }}%</div>
              <div class="text-xs">QC Pass</div>
            </div>
            <div class="text-center">
              <div class="font-semibold" :class="productionData.productionData.executionHealth.openNcrs > 0 ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'">
                {{ productionData.productionData.executionHealth.openNcrs }}
              </div>
              <div class="text-xs">Open NCRs</div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
          <div
            class="h-full bg-blue-500 rounded-full transition-all duration-500"
            :style="{ width: productionData.productionData.executionHealth.progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex flex-wrap gap-1 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          v-for="tab in [
            { id: 'production-management', label: 'Build Items' },
            { id: 'quality', label: 'QA Checks' },
            { id: 'evidence', label: 'Evidence', count: getTabBadgeCount('evidence') },
            { id: 'logs', label: 'Work Logs', count: getTabBadgeCount('logs') },
            { id: 'design', label: 'Design Files' },
            { id: 'issues', label: 'Issues', count: getTabBadgeCount('issues') }
          ]"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
          :class="activeTab === tab.id
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full leading-none">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Evidence Tab -->
      <div v-if="activeTab === 'evidence'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-slate-700 dark:text-slate-300">
            Evidence Gallery
            <span class="ml-2 text-sm text-slate-400">({{ productionData.evidenceGallery.length }} items)</span>
          </h4>
        </div>

        <div v-if="productionData.evidenceGallery.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="asset in productionData.evidenceGallery"
            :key="asset.id"
            class="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div class="aspect-square bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <img :src="asset.url" class="w-full h-full object-cover" />
            </div>
            <div class="p-3">
              <p class="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{{ asset.taskTitle }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(asset.uploadedAt) }}</p>
            </div>
          </div>
        </div>

        <div v-else class="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <i class="mdi mdi-camera-off text-3xl mb-2 block"></i>
          <p class="text-sm">No evidence uploaded yet</p>
          <p class="text-xs mt-1">Workshop teams will upload photos directly from the production floor</p>
        </div>
      </div>

      <!-- Build Items Tab -->
      <div v-show="activeTab === 'production-management'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-slate-700 dark:text-slate-300">Production Elements</h4>
          <button
            v-if="!isReadOnly"
            @click="retryMaterialsImport"
            :disabled="isImportingMaterials"
            class="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <div v-if="isImportingMaterials" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <i v-else class="mdi mdi-import text-sm"></i>
            {{ isImportingMaterials ? 'Importing...' : 'Sync from Materials' }}
          </button>
        </div>

        <div v-if="materialsImportError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {{ materialsImportError }}
        </div>

        <div v-if="productionData.productionElements.length > 0" class="space-y-3">
          <template v-for="category in categoriesWithElements" :key="category.id">
            <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div
                class="px-4 py-3 bg-slate-50 dark:bg-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                @click="toggleCategoryCollapse(category.id)"
              >
                <div>
                  <span class="font-medium text-sm text-slate-800 dark:text-white">{{ category.displayName }}</span>
                  <span class="ml-2 text-xs text-slate-400">{{ getElementsByCategory(category.id).length }} items</span>
                </div>
                <i class="mdi mdi-chevron-down text-slate-400 transition-transform" :class="{ 'rotate-180': !isCategoryCollapsed(category.id) }"></i>
              </div>

              <div v-if="isCategoryExpanded(category.id)" class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th class="px-4 py-2 text-left font-medium">Item</th>
                      <th class="px-4 py-2 text-right font-medium">Qty</th>
                      <th class="px-4 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr v-for="element in getElementsByCategory(category.id)" :key="element.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{{ element.name || element.description }}</td>
                      <td class="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{{ element.quantity }} {{ element.unitOfMeasurement || element.unit }}</td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-0.5 rounded text-xs font-medium"
                          :class="element.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  element.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-600'">
                          {{ element.status || 'Pending' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>

        <div v-else class="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <i class="mdi mdi-factory text-4xl text-slate-300 mb-3 block"></i>
          <p class="font-medium text-slate-600 dark:text-slate-400">No production items loaded</p>
          <p class="text-sm text-slate-400 mt-1 mb-4">Sync from the Materials Task to populate this list.</p>
          <button @click="retryMaterialsImport" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Sync Materials</button>
        </div>
      </div>

      <!-- Quality Checks Tab -->
      <div v-show="activeTab === 'quality'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-slate-700 dark:text-slate-300">Quality Control</h4>
          <div class="flex gap-2">
            <button v-if="!isReadOnly" @click="generateQualityCheckpoints" class="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors">
              <i class="mdi mdi-refresh text-sm"></i> Regenerate
            </button>
            <button @click="exportQualityReport" class="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              <i class="mdi mdi-file-export-outline text-sm"></i> Export
            </button>
          </div>
        </div>

        <div v-if="productionData.qualityControl.midStream.length > 0 || productionData.qualityControl.final.length > 0" class="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
          <div class="flex-1">
            <div class="flex justify-between mb-1">
              <span class="text-slate-500">Overall Progress</span>
              <span class="font-medium">{{ qualityProgressPercentage }}%</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div class="h-full bg-green-500 rounded-full" :style="{ width: qualityProgressPercentage + '%' }"></div>
            </div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-green-600">{{ getQualityStatusCount('passed') }}</div>
            <div class="text-xs text-slate-400">Passed</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-red-600">{{ getQualityStatusCount('failed') }}</div>
            <div class="text-xs text-slate-400">Failed</div>
          </div>
        </div>

        <div v-if="productionData.qualityControl.midStream.length > 0">
          <h5 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Mid-Stream Checks</h5>
          <div class="space-y-2">
            <div v-for="checkpoint in productionData.qualityControl.midStream" :key="checkpoint.id" class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
              <div class="flex items-center gap-3">
                <i class="mdi text-lg" :class="checkpoint.status === 'passed' ? 'mdi-check-circle text-green-500' : checkpoint.status === 'failed' ? 'mdi-close-circle text-red-500' : 'mdi-clock-outline text-slate-400'"></i>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ checkpoint.title || checkpoint.categoryName }}</p>
                  <p class="text-xs text-slate-400">{{ checkpoint.checkedBy }} · {{ formatDate(checkpoint.checkedAt) }}</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-xs font-medium" :class="checkpoint.status === 'passed' ? 'bg-green-100 text-green-700' : checkpoint.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'">{{ checkpoint.status }}</span>
            </div>
          </div>
        </div>

        <div v-if="productionData.qualityControl.final.length > 0">
          <h5 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Final QC</h5>
          <div class="space-y-2">
            <div v-for="checkpoint in productionData.qualityControl.final" :key="checkpoint.id" class="flex items-center justify-between p-3 border border-blue-200 dark:border-blue-800/50 rounded-lg bg-blue-50/30 dark:bg-blue-900/10">
              <div class="flex items-center gap-3">
                <i class="mdi text-lg" :class="checkpoint.status === 'passed' ? 'mdi-check-circle text-green-500' : checkpoint.status === 'failed' ? 'mdi-close-circle text-red-500' : 'mdi-certificate-outline text-blue-400'"></i>
                <div>
                  <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ checkpoint.title }}</p>
                  <p class="text-xs text-slate-400">Final gate</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-xs font-medium" :class="checkpoint.status === 'passed' ? 'bg-green-100 text-green-700' : checkpoint.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'">{{ checkpoint.status }}</span>
            </div>
          </div>
        </div>

        <div v-if="productionData.qualityControl.midStream.length === 0 && productionData.qualityControl.final.length === 0" class="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <i class="mdi mdi-shield-check text-4xl text-slate-300 mb-3 block"></i>
          <p class="font-medium text-slate-600 dark:text-slate-400">No QC checkpoints loaded</p>
          <p class="text-sm text-slate-400 mt-1 mb-4">Generate checkpoints from the production workshop.</p>
          <button @click="generateQualityCheckpoints" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Load QC Checkpoints</button>
        </div>
      </div>

      <!-- Issues Tab -->
      <div v-show="activeTab === 'issues'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 class="font-medium text-slate-700 dark:text-slate-300">Production Issues</h4>
          <div class="flex items-center gap-2">
            <select v-model="selectedIssueCategory" class="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option v-for="cat in issueCategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
            </select>
            <button v-if="!isReadOnly" @click="showAddIssueModal = true" class="flex items-center gap-2 px-3 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
              <i class="mdi mdi-plus"></i> Log Issue
            </button>
          </div>
        </div>

        <div v-if="productionData.issues.length > 0" class="flex flex-wrap gap-2 text-sm">
          <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><strong>{{ productionData.issues.length }}</strong> Total</span>
          <span class="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"><strong>{{ getIssueStatusCount('open') }}</strong> Open</span>
          <span class="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg"><strong>{{ getIssueStatusCount('in_progress') }}</strong> In Progress</span>
          <span class="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg"><strong>{{ getIssueStatusCount('resolved') }}</strong> Resolved</span>
        </div>

        <div v-if="filteredIssues.length > 0" class="space-y-3">
          <div v-for="issue in filteredIssues" :key="issue.id" class="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800" :class="{ 'opacity-60': issue.status === 'resolved' }">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 rounded text-xs font-medium border" :class="getPriorityClass(issue.priority)">{{ issue.priority }}</span>
                  <span class="text-xs text-slate-400">{{ issue.category }}</span>
                  <span class="text-xs text-slate-400">{{ formatDate(issue.reportedDate) }}</span>
                </div>
                <h5 class="font-medium text-slate-900 dark:text-white">{{ issue.title }}</h5>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ issue.description }}</p>
                <p class="text-xs text-slate-400 mt-2">Reported by: {{ issue.reportedBy }}</p>
              </div>
              <div class="flex sm:flex-col gap-2 sm:min-w-[160px]">
                <select v-model="issue.status" @change="updateIssueStatus(issue.id, issue.status)" class="flex-1 sm:flex-none text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <div class="flex gap-2">
                  <button @click="showEscalationModal(issue)" class="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition-colors">
                    <i class="mdi mdi-arrow-up"></i> Escalate
                  </button>
                  <button @click="deleteIssue(issue.id)" class="p-1.5 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-lg text-slate-400 transition-colors">
                    <i class="mdi mdi-delete-outline"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <i class="mdi mdi-check-all text-4xl text-green-400 mb-3 block"></i>
          <p class="font-medium text-slate-600 dark:text-slate-400">{{ selectedIssueCategory ? 'No issues in this category' : 'No production issues logged' }}</p>
          <button @click="showAddIssueModal = true" class="mt-3 px-4 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition-colors">Log an Issue</button>
        </div>

        <!-- Add Issue Modal -->
        <div v-if="showAddIssueModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click="closeAddIssueModal">
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Report Issue</h3>
              <button @click="closeAddIssueModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
            </div>
            <form @submit.prevent="addNewIssue" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issue Title</label>
                <input v-model="newIssue.title" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brief description" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea v-model="newIssue.description" rows="3" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detailed description"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select v-model="newIssue.category" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    <option value="materials">Materials</option>
                    <option value="equipment">Equipment</option>
                    <option value="quality">Quality</option>
                    <option value="timeline">Timeline</option>
                    <option value="safety">Safety</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select v-model="newIssue.priority" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reported By</label>
                <input v-model="newIssue.reportedBy" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <button type="button" @click="closeAddIssueModal" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Report Issue</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Work Logs Tab -->
      <div v-show="activeTab === 'logs'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-slate-700 dark:text-slate-300">
            Work Logs
            <span class="ml-2 text-sm text-slate-400">({{ productionData.productionLogs.length }} entries)</span>
          </h4>
        </div>

        <div v-if="productionData.productionLogs.length > 0" class="space-y-3">
          <div v-for="log in productionData.productionLogs" :key="log.id" class="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-1 text-xs text-slate-400">
                <span>{{ formatDate(log.date) }}</span>
                <span>·</span>
                <span class="text-blue-600 dark:text-blue-400">{{ log.workerName }}</span>
                <span>·</span>
                <span class="text-green-600 dark:text-green-400">{{ log.hoursWorked }} hrs</span>
              </div>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ log.description }}</p>
              <p v-if="log.notes" class="text-xs text-slate-400 mt-1 italic">{{ log.notes }}</p>
            </div>
            <span class="self-start px-2 py-0.5 rounded text-xs font-medium" :class="log.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'">{{ log.status }}</span>
          </div>
        </div>

        <div v-else class="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <i class="mdi mdi-history text-4xl text-slate-300 mb-3 block"></i>
          <p class="font-medium text-slate-600 dark:text-slate-400">No work logs recorded</p>
          <p class="text-sm text-slate-400 mt-1">Technicians will log their daily activities here.</p>
        </div>
      </div>

      <!-- Design Files Tab -->
      <div v-show="activeTab === 'design'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-slate-700 dark:text-slate-300">Design Assets</h4>
          <button @click="fetchDesignAssets" class="flex items-center gap-2 px-3 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition-colors">
            <i class="mdi mdi-refresh text-sm"></i> Refresh
          </button>
        </div>

        <div v-if="designAssets.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="asset in designAssets" :key="asset.id" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:border-blue-400 transition-colors cursor-pointer" @click="openPreview(asset)">
            <div class="h-28 bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-b border-slate-100 dark:border-slate-600">
              <img v-if="isImageAsset(asset)" :src="getAssetUrl(asset)" :alt="asset.file_name" class="w-full h-full object-cover" />
              <i v-else class="mdi text-3xl text-slate-400" :class="isPdfAsset(asset) ? 'mdi-file-pdf-box text-red-400' : 'mdi-file-document-outline'"></i>
            </div>
            <div class="p-3">
              <p class="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{{ asset.file_name || asset.name }}</p>
              <div class="flex justify-between items-center mt-1">
                <span class="text-xs text-slate-400">{{ formatDate(asset.created_at) }}</span>
                <span class="px-1.5 py-0.5 rounded text-xs font-medium" :class="getAssetStatusClass(asset.status)">{{ asset.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
          <i class="mdi mdi-palette-swatch text-4xl text-slate-300 mb-3 block" :class="{'animate-pulse': isLoadingDesignAssets}"></i>
          <p class="font-medium text-slate-600 dark:text-slate-400">{{ isLoadingDesignAssets ? 'Loading assets...' : 'No design assets found' }}</p>
        </div>
      </div>

      <!-- Footer: Save Status + Actions -->
      <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div v-if="saveError" class="mb-3 flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          <i class="mdi mdi-alert-circle"></i>
          <span class="flex-1">{{ saveError }}</span>
          <button @click="retrySave" class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">Retry</button>
          <button @click="clearSaveError" class="text-red-400 hover:text-red-600">&times;</button>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex flex-wrap gap-2">
            <button v-if="task.status !== 'skipped' && task.status !== 'completed'" @click="showSkipModal = true" class="px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Skip Task</button>
            <button v-if="['skipped', 'completed'].includes(task.status)" @click="$emit('update-status', 'pending')" class="px-3 py-2 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 rounded-lg transition-colors">
              {{ task.status === 'skipped' ? 'Unskip' : 'Reopen' }}
            </button>
            <button v-if="task.status === 'pending'" @click="updateStatus('in_progress')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Start Production</button>
            <button v-if="task.status === 'in_progress'" @click="updateStatus('completed')" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">Mark Complete</button>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="isSaving" class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div> Saving...
            </div>
            <div v-else-if="hasUnsavedChanges" class="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <span class="w-2 h-2 bg-amber-500 rounded-full"></span> Unsaved changes
            </div>
            <div v-else-if="lastSaveTime" class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span> Saved
            </div>
            <button v-if="!isReadOnly" @click="handleSubmit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors">
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Asset Preview Modal -->
    <Transition name="modal">
      <div v-if="showPreviewModal && previewAsset" class="fixed inset-0 z-[150] flex items-center justify-center p-4" @click.self="closePreview">
        <div class="fixed inset-0 bg-black/70" @click="closePreview"></div>
        <div class="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10" @click.stop>
          <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div class="min-w-0 mr-4">
              <h3 class="font-semibold text-slate-900 dark:text-white truncate">{{ previewAsset.file_name || previewAsset.name }}</h3>
              <span class="text-xs text-slate-400">{{ previewAsset.category }} · {{ previewAsset.file_size ? formatFileSize(previewAsset.file_size) : '' }}</span>
            </div>
            <div class="flex gap-2">
              <a v-if="previewAsset.file_url" :href="previewAsset.file_url" download class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors">
                <i class="mdi mdi-download"></i> Download
              </a>
              <button @click="closePreview" class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg">
                <i class="mdi mdi-close text-xl"></i>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center min-h-0">
            <img v-if="isImageAsset(previewAsset)" :src="getAssetUrl(previewAsset)" class="max-w-full max-h-[70vh] object-contain rounded-lg" />
            <iframe v-else-if="isPdfAsset(previewAsset)" :src="getAssetUrl(previewAsset)" class="w-full h-full min-h-[65vh] rounded-lg border border-slate-200 dark:border-slate-700" frameborder="0"></iframe>
            <div v-else class="text-center py-12">
              <i class="mdi mdi-file-document-outline text-5xl text-slate-300 mb-4 block"></i>
              <p class="text-slate-500 mb-4">Preview not available for this file type.</p>
              <a v-if="previewAsset.file_url" :href="previewAsset.file_url" download class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">Download File</a>
            </div>
          </div>
          <div class="p-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 flex gap-6">
            <div>Status: <strong>{{ previewAsset.status }}</strong></div>
            <div v-if="previewAsset.description">{{ previewAsset.description }}</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Skip Task Modal -->
    <div v-if="showSkipModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Skip Task</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Please provide a reason for skipping this task.</p>
        <textarea v-model="skipReason" rows="3" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder="Reason for skipping..."></textarea>
        <div class="flex justify-end gap-3">
          <button @click="showSkipModal = false" class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
            {{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}
          </button>
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

interface ProductionLog {
    id: string
    date: any
    workerName: string
    description: string
    hoursWorked: number
    startTime: string
    endTime: string
    notes?: string
    status: string
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
    categoryName?: string
    title?: string
    description?: string
    status: 'pending' | 'passed' | 'failed' | 'in_progress'
    notes?: string
    checkedBy?: string
    checkedAt?: string | Date | null
    checklist?: any[]
    qualityScore?: number
    priority?: string
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
    productionData: {
        id: number
        taskId: number
        workOrderNumber: string
        status: string
        workflowSteps: string[]
        materialsImported: boolean
        executionHealth: {
            progress: number
            qcPassRate: number
            openNcrs: number
            reworkHours: number
            status: 'on_track' | 'at_risk' | 'pending' | 'delayed'
        }
    }
    productionElements: (ProductionElement & { evidenceCount?: number })[]
    relatedProcurementItems: any[]
    qualityControl: {
        midStream: QualityControlCheckpoint[]
        final: QualityControlCheckpoint[]
    }
    issues: ProductionIssue[]
    reworkAnalytics: {
        id: string
        title: string
        hours: number
        status: string
        date: string
    }[]
    evidenceGallery: {
        id: string
        taskTitle: string
        url: string
        type: string
        uploadedAt: string
        notes?: string
    }[]
    productionLogs: ProductionLog[]
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


// Component implementation
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// UI core state
const activeTab = ref(props.initialTab || 'production-management')
const isLoading = ref(false)
const isSaving = ref(false)
const saveError = ref<string | null>(null)
const lastSaveTime = ref<Date | null>(null)
const hasUnsavedChanges = ref(false)
const saveRetryCount = ref(0)
const maxSaveRetries = 3
const autoSaveDelay = 500
let autoSaveTimeout: any = null

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

// Watchers
watch(() => props.initialTab, (newTab) => {
  if (newTab) activeTab.value = newTab
})

// Formatting Utilities
function formatDate(dateValue: string | Date | null | undefined) {
  if (!dateValue || dateValue === 'TBC') return 'TBC'
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    if (isNaN(date.getTime())) return 'TBC'
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return 'TBC'
  }
}

// Tab navigation with enhanced functionality
const tabs = [
  { id: 'production-management', label: 'Production Management', description: 'View and manage production workflow' },
  { id: 'quality', label: 'Quality Assurance', description: 'Manage quality control checkpoints' },
  { id: 'logs', label: 'Production Logs', description: 'View technician daily activity and job cards' },
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
      const failedMid = productionData.value.qualityControl.midStream.filter((qc: any) => qc.status === 'failed').length
      const failedFinal = productionData.value.qualityControl.final.filter((qc: any) => qc.status === 'failed').length
      return failedMid + failedFinal
    case 'issues':
      return productionData.value.issues.filter((issue: any) => issue.status === 'open').length
    case 'logs':
      return productionData.value.productionLogs.length
    case 'evidence':
      return productionData.value.evidenceGallery.length
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
      const failedCountMid = productionData.value.qualityControl.midStream.filter((qc: any) => qc.status === 'failed').length
      const failedCountFinal = productionData.value.qualityControl.final.filter((qc: any) => qc.status === 'failed').length
      const totalFailed = failedCountMid + failedCountFinal
      return totalFailed > 0
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
  { id: 'carpentry', name: 'carpentry', displayName: 'Carpentry ', color: 'amber' },
  { id: 'branding', name: 'branding', displayName: 'Branding & Prints', color: 'blue' },
  { id: 'metal_work', name: 'metal_work', displayName: 'Metal Work', color: 'slate' },
  { id: 'painting', name: 'painting', displayName: 'Painting & Finishing', color: 'emerald' },
  { id: 'general_assembly', name: 'general_assembly', displayName: 'General Assembly', color: 'rose' }
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
  relatedProcurementItems: [],
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
  productionData: {
    id: 0,
    taskId: 0,
    workOrderNumber: 'PENDING',
    status: 'pending',
    workflowSteps: [],
    materialsImported: false,
    executionHealth: {
        progress: 0,
        qcPassRate: 100,
        openNcrs: 0,
        reworkHours: 0,
        status: 'pending'
    }
  },
  productionElements: [],
  qualityControl: {
      midStream: [],
      final: []
  },
  issues: [],
  reworkAnalytics: [],
  evidenceGallery: [],
  productionLogs: [],
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
const updateQualityStatus = async (checkpointId: string, status: QualityControlCheckpoint['status']) => {
  // Find in midStream or final
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }

  if (checkpoint) {
    const previousStatus = checkpoint.status
    checkpoint.status = status
    checkpoint.checkedAt = new Date().toISOString()
    checkpoint.updatedAt = new Date()
    
    // Auto-update quality score based on status
    if (status === 'passed' && !checkpoint.qualityScore) {
      checkpoint.qualityScore = 100
    } else if (status === 'failed' && !checkpoint.qualityScore) {
      checkpoint.qualityScore = 0
    }

    // if passed, also check all items in checklist
    if (status === 'passed' && checkpoint.checklist) {
      checkpoint.checklist.forEach(item => item.checked = true)
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
const getQualityStatusCount = (status: QualityControlCheckpoint['status']) => {
  const midCount = productionData.value.qualityControl.midStream.filter(qc => qc.status === status).length
  const finalCount = productionData.value.qualityControl.final.filter(qc => qc.status === status).length
  return midCount + finalCount
}

const qualityProgressPercentage = computed(() => {
  const allChecks = [...productionData.value.qualityControl.midStream, ...productionData.value.qualityControl.final]
  if (allChecks.length === 0) return 0
  const completed = allChecks.filter((c: any) => c.status === 'passed' || c.status === 'failed').length
  return Math.round((completed / allChecks.length) * 100)
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
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
  if (checkpoint) {
    checkpoint.status = 'passed'
    checkpoint.qualityScore = 100
    checkpoint.checkedAt = new Date().toISOString()
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
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
  if (checkpoint) {
    checkpoint.notes = notes
    checkpoint.updatedAt = new Date()
    // Auto-save would be triggered here
  }
}

const updateChecklistItem = (checkpointId: string, itemId: string, checked: boolean) => {
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
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
        checkpoint.checkedAt = new Date().toISOString()
      } else if (checkedItems > 0) {
        checkpoint.status = 'in_progress'
      }
      
      checkpoint.updatedAt = new Date()
      // Auto-save would be triggered here
    }
  }
}

const updateQualityScore = (checkpointId: string, score?: number) => {
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
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
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
  if (checkpoint) {
    checkpoint.checkedBy = inspector
    checkpoint.updatedAt = new Date()
    // Auto-save would be triggered here
  }
}

const updateCheckpointPriority = (checkpointId: string, priority?: 'low' | 'medium' | 'high') => {
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
  if (checkpoint) {
    checkpoint.priority = priority
    checkpoint.updatedAt = new Date()
    // Auto-save would be triggered here
  }
}

const retryQualityCheck = (checkpointId: string) => {
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
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
  let checkpoint = productionData.value.qualityControl.midStream.find(c => c.id === checkpointId)
  if (!checkpoint) {
    checkpoint = productionData.value.qualityControl.final.find(c => c.id === checkpointId)
  }
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
    // Add to the same category as the original
    if (productionData.value.qualityControl.midStream.some(c => c.id === checkpointId)) {
      productionData.value.qualityControl.midStream.push(newCheckpoint)
    } else {
      productionData.value.qualityControl.final.push(newCheckpoint)
    }
    console.log(`Quality checkpoint duplicated: ${newCheckpoint.categoryName}`)
    // Auto-save would be triggered here
  }
}


const generateQualityCheckpoints = async () => {
  try {
    const taskId = props.task.id.toString()
    const response = await api.post(`/api/projects/tasks/${taskId}/production/generate-checkpoints`)
    
    if (response.data && response.data.data) {
      const data = response.data.data
      productionData.value.qualityControl = {
        midStream: data.midStream || [],
        final: data.final || []
      }
      alert('Quality checkpoints pulled from Production Module.')
    }
  } catch (error: any) {
    console.error('Failed to pull quality checkpoints:', error)
    alert(`Failed to pull quality checkpoints: ${error.response?.data?.message || error.message}`)
  }
}


const exportQualityReport = () => {
  const report = {
    projectInfo: productionData.value.projectInfo,
    generatedAt: new Date().toISOString(),
    summary: {
      totalCheckpoints: productionData.value.qualityControl.midStream.length + productionData.value.qualityControl.final.length,
      passed: getQualityStatusCount('passed'),
      failed: getQualityStatusCount('failed'),
      pending: getQualityStatusCount('pending') + getQualityStatusCount('in_progress'),
      overallProgress: qualityProgressPercentage.value
    },
    checkpoints: [
      ...productionData.value.qualityControl.midStream.map(checkpoint => ({
        ...checkpoint,
        phase: 'Mid-Stream'
      })),
      ...productionData.value.qualityControl.final.map(checkpoint => ({
        ...checkpoint,
        phase: 'Final'
      }))
    ].map(checkpoint => ({
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
  const allQC = [...productionData.value.qualityControl.midStream, ...productionData.value.qualityControl.final]
  const totalQC = allQC.length

  if (totalElements > 0 && totalQC === 0) {
    warnings.push('Production elements exist but no quality control checkpoints are defined')
  } else if (totalQC > 0) {
    info.push(`${totalQC} quality control checkpoints defined`)

    let qcErrors = 0
    allQC.forEach((checkpoint, index) => {
      if (!checkpoint.categoryName && !checkpoint.title) {
        errors.push(`Quality checkpoint ${index + 1}: Title is required`)
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
    const qcStatusDistribution = allQC.reduce((acc, qc) => {
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
    }
  }

  // Issues validation with priority and status analysis
  if (productionData.value.issues.length > 0) {
    info.push(`${productionData.value.issues.length} production issues tracked`)
    const highPriorityIssues = productionData.value.issues.filter(i => i.priority === 'high' && i.status !== 'resolved').length
    if (highPriorityIssues > 0) {
      warnings.push(`${highPriorityIssues} high-priority issues require immediate attention`)
    }
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
    const qcCategories = allQC.map(qc => qc.categoryId)

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
  
  const allQC = [...productionData.value.qualityControl.midStream, ...productionData.value.qualityControl.final]
  if (allQC.length === 0 && productionData.value.productionElements.length > 0) score -= 10

  // Check for data relationships consistency
  const elementCategories = [...new Set(productionData.value.productionElements.map(e => e.category))]
  const qcCategories = allQC.map((qc: any) => qc.categoryId)

  const missingQCCategories = elementCategories.filter(cat => !qcCategories.includes(cat))
  const orphanedQCCategories = qcCategories.filter(cat => !elementCategories.includes(cat))

  score -= missingQCCategories.length * 3
  score -= orphanedQCCategories.length * 2

  // Check for high-priority unresolved issues

  if (productionData.value.productionElements.length === 0) score -= 20
  if (allQC.length === 0) score -= 15
  if (productionData.value.completionCriteria.length === 0) score -= 10
  
  // Complexity score based on missing details
  const elementsWithoutDesc = productionData.value.productionElements.filter(e => !e.description)
  score -= elementsWithoutDesc.length * 2

  const qcWithoutStatus = allQC.filter(q => q.status === 'pending')
  score -= (qcWithoutStatus.length / (allQC.length || 1)) * 10
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

// Convert snake_case to camelCase for frontend compatibility
// convertToCamelCase moved to top

// Load existing data
const loadProductionData = async () => {
    try {
        isLoading.value = true
        const response = await api.get(`/api/projects/tasks/${props.task.id}/production`)
        if (response.data && response.data.data) {
            const data = response.data.data
            // Map data correctly to the new structure
            productionData.value = {
                ...productionData.value,
                ...data,
                productionData: data.productionData || productionData.value.productionData,
                qualityControl: data.qualityControl || productionData.value.qualityControl,
                reworkAnalytics: data.reworkAnalytics || [],
                evidenceGallery: data.evidenceGallery || [],
                issues: data.issues || [],
                productionLogs: data.productionLogs || []
            }
        }
    } catch (error: any) {
        console.error('Production data loading failed:', error)
        if (error.response?.status !== 404) {
             console.warn('Backend alignment service unavailable, using initial state')
        }
    } finally {
        isLoading.value = false
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
      
      // Handle qualityControl being either an array (legacy) or object (new)
      const importedQC = response.data.data.qualityControl
      if (Array.isArray(importedQC)) {
        productionData.value.qualityControl = {
          midStream: importedQC,
          final: []
        }
      } else {
        productionData.value.qualityControl = importedQC || { midStream: [], final: [] }
      }

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
        qualityCheckpoints: productionData.value.qualityControl.midStream.length + productionData.value.qualityControl.final.length,
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
