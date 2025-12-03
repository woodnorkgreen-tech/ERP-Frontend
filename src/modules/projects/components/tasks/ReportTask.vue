<template>
  <div class="report-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Task Completion Toggle -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
        <div class="flex items-center space-x-2">
          <span :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-500'" class="text-sm font-medium">
            {{ task.status === 'completed' ? 'Completed' : 'In Progress' }}
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="isCompleted"
              type="checkbox"
              class="sr-only peer"
              @change="toggleTaskCompletion"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

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
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Tab 1: Project Information & Scope -->
      <div v-if="activeTab === 'project-info'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>📋</span>
          <span>Section 1: Project Information</span>
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Name</label>
            <input v-model="formData.client_name" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter client name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Code/ID</label>
            <input v-model="formData.project_code" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter project code" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Officer</label>
            <input v-model="formData.project_officer" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter project officer name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input v-model="formData.start_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input v-model="formData.end_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Location</label>
          <textarea v-model="formData.site_location" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter site location details"></textarea>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700" />

        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>📝</span>
          <span>Section 2: Project Deliverables Summary</span>
        </h4>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brief Description of Deliverables, Scale, and Key Components</label>
          <textarea v-model="formData.project_scope" rows="4" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Describe the project deliverables and key components..."></textarea>
        </div>
      </div>

      <!-- Tab 2: Procurement & Fabrication -->
      <div v-if="activeTab === 'procurement'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>📦</span>
          <span>Section 3: Procurement & Inventory</span>
        </h4>

        <div class="flex items-center space-x-3">
          <input v-model="formData.materials_mrf_attached" type="checkbox" id="mrf-attached" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label for="mrf-attached" class="text-sm font-medium text-gray-700 dark:text-gray-300">Materials Requested (attach MRF/Material List)</label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items Sourced Externally</label>
          <textarea v-model="formData.items_sourced_externally" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="List items sourced from external suppliers..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Challenges Faced in Acquiring Materials</label>
          <textarea v-model="formData.procurement_challenges" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Describe any procurement challenges encountered..."></textarea>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700" />

        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>🔧</span>
          <span>Section 4: Fabrication & Quality Control</span>
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Production Started</label>
            <input v-model="formData.production_start_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Packaging and Labeling Status</label>
            <select v-model="formData.packaging_labeling_status" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select status</option>
              <option value="good">Good</option>
              <option value="needs_improvement">Needs Improvement</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Materials Used in Production</label>
          <textarea v-model="formData.materials_used_in_production" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="List materials and quantities used in production..."></textarea>
        </div>
      </div>

      <!-- Tab 3: On-Site Setup -->
      <div v-if="activeTab === 'setup'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>🔧</span>
          <span>Section 5: On-Site Setup</span>
        </h4>

        <!-- Section 5.1: Team & Deliverables -->
        <div class="space-y-4">
          <h5 class="text-sm font-semibold text-gray-900 dark:text-white">5.1 Team & Deliverables</h5>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Captain</label>
              <input v-model="formData.team_captain" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Team captain name" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setup Team Assigned</label>
              <input v-model="formData.setup_team_assigned" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Setup team members" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Branding Team Assigned</label>
              <input v-model="formData.branding_team_assigned" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Branding team members" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center space-x-3">
              <input v-model="formData.all_deliverables_available" type="checkbox" id="deliverables-available" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="deliverables-available" class="text-sm font-medium text-gray-700 dark:text-gray-300">All Deliverables Available</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.setup_aligned_to_schedule" type="checkbox" id="aligned-schedule" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="aligned-schedule" class="text-sm font-medium text-gray-700 dark:text-gray-300">Setup Aligned to Schedule</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.delays_occurred" type="checkbox" id="delays-occurred" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="delays-occurred" class="text-sm font-medium text-gray-700 dark:text-gray-300">Delays Occurred</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.deliverables_checked" type="checkbox" id="deliverables-checked" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="deliverables-checked" class="text-sm font-medium text-gray-700 dark:text-gray-300">Deliverables Checked</label>
            </div>
          </div>

          <div v-if="formData.delays_occurred">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delay Reasons</label>
            <textarea v-model="formData.delay_reasons" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Explain reasons for delays..."></textarea>
          </div>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700" />

        <!-- Section 5.2: Setup Item Allocation -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-semibold text-gray-900 dark:text-white">5.2 Setup Item Allocation</h5>
            <button @click="addSetupItem" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Item</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Deliverable Item</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Assigned Technician</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Site Section</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Status</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Notes</th>
                  <th class="px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!formData.setup_items || formData.setup_items.length === 0">
                  <td colspan="6" class="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No setup items added yet. Click "Add Item" to get started.
                  </td>
                </tr>
                <tr v-for="(item, index) in formData.setup_items" :key="index" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-3 py-2">
                    <input v-model="item.deliverable_item" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter item name" />
                  </td>
                  <td class="px-3 py-2">
                    <input v-model="item.assigned_technician" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Technician name" />
                  </td>
                  <td class="px-3 py-2">
                    <input v-model="item.site_section" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Section" />
                  </td>
                  <td class="px-3 py-2">
                    <select v-model="item.status" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                      <option value="pending">Pending</option>
                      <option value="set">Set</option>
                    </select>
                  </td>
                  <td class="px-3 py-2">
                    <input v-model="item.notes" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Notes" />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button @click="removeSetupItem(index)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700" />

        <!-- Section 5.4: Item Placement Details -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-semibold text-gray-900 dark:text-white">5.4 Item Placement Details</h5>
            <button @click="addItemPlacement" class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Placement</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border border-gray-300 dark:border-gray-600 rounded-lg">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Section/Area</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Items Installed</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Placement Accuracy</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Observation</th>
                  <th class="px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!formData.item_placements || formData.item_placements.length === 0">
                  <td colspan="5" class="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No item placements added yet. Click "Add Placement" to get started.
                  </td>
                </tr>
                <tr v-for="(placement, index) in formData.item_placements" :key="index" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-3 py-2">
                    <input v-model="placement.section_area" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Section or area" />
                  </td>
                  <td class="px-3 py-2">
                    <input v-model="placement.items_installed" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="List items" />
                  </td>
                  <td class="px-3 py-2">
                    <select v-model="placement.placement_accuracy" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                      <option value="correct">Correct</option>
                      <option value="needs_adjusted">Needs Adjusted</option>
                    </select>
                  </td>
                  <td class="px-3 py-2">
                    <input v-model="placement.observation" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Observations" />
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button @click="removeItemPlacement(index)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700" />

        <!-- Section 5.3: Site Ratings & Findings -->
        <div class="space-y-4">
          <h5 class="text-sm font-semibold text-gray-900 dark:text-white">5.3 Site Organization & Readiness</h5>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Organization</label>
              <select v-model="formData.site_organization" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Select rating</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cleanliness Rating</label>
              <select v-model="formData.cleanliness_rating" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="">Select rating</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">General Findings</label>
            <textarea v-model="formData.general_findings" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="General observations and findings..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Readiness Notes</label>
            <textarea v-model="formData.site_readiness_notes" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Notes about site readiness..."></textarea>
          </div>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700" />
      </div>

      <!-- Tab 4: Client Handover -->
      <div v-if="activeTab === 'handover'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>✅</span>
          <span>Section 6: Client Handover</span>
        </h4>

        <!-- Basic Handover Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Handover Date</label>
            <input v-model="formData.handover_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Rating</label>
            <input v-model="formData.client_rating" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Client rating or score" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Remarks</label>
          <textarea v-model="formData.client_remarks" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Client feedback and remarks..."></textarea>
        </div>

        <hr class="my-4 border-gray-200 dark:border-gray-700" />

        <!-- Quality of Work -->
        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">6.1 Quality of Work</h5>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Print Clarity & Color Accuracy</label>
            <select v-model="formData.print_clarity_rating" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select rating</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="n/a">N/A</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Printworks Accuracy</label>
            <select v-model="formData.printworks_accuracy_rating" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select rating</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="n/a">N/A</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Installation Precision Comments</label>
          <textarea v-model="formData.installation_precision_comments" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Comments on installation precision..."></textarea>
        </div>

        <hr class="my-4 border-gray-200 dark:border-gray-700" />

        <!-- Efficiency & Team Performance -->
        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">6.2 Efficiency & Team Performance</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setup Speed & Flow</label>
            <select v-model="formData.setup_speed_flow" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select rating</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Coordination</label>
            <select v-model="formData.team_coordination" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select rating</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Efficiency Remarks</label>
          <textarea v-model="formData.efficiency_remarks" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Comments on team efficiency..."></textarea>
        </div>

        <hr class="my-4 border-gray-200 dark:border-gray-700" />

        <!-- Client Communication -->
        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">6.3 Client Communication & Satisfaction</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center space-x-3">
            <input v-model="formData.client_kept_informed" type="checkbox" id="client-informed" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="client-informed" class="text-sm font-medium text-gray-700 dark:text-gray-300">Client Kept Informed</label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Satisfaction</label>
            <select v-model="formData.client_satisfaction" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select satisfaction level</option>
              <option value="satisfied">Satisfied</option>
              <option value="unsatisfied">Unsatisfied</option>
              <option value="n/a">N/A</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Communication Comments</label>
          <textarea v-model="formData.communication_comments" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Comments on communication with client..."></textarea>
        </div>

        <hr class="my-4 border-gray-200 dark:border-gray-700" />

        <!-- Delivery & Logistics -->
        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">6.4 Delivery & Logistics</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center space-x-3">
            <input v-model="formData.delivered_on_schedule" type="checkbox" id="on-schedule" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="on-schedule" class="text-sm font-medium text-gray-700 dark:text-gray-300">Delivered on Schedule</label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Condition</label>
            <select v-model="formData.delivery_condition" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select condition</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div class="flex items-center space-x-3">
            <input v-model="formData.delivery_issues" type="checkbox" id="delivery-issues" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="delivery-issues" class="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Issues Occurred</label>
          </div>
        </div>

        <div v-if="formData.delivery_issues">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Notes/Issues</label>
          <textarea v-model="formData.delivery_notes" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Describe delivery issues..."></textarea>
        </div>

        <hr class="my-4 border-gray-200 dark:border-gray-700" />

        <!-- Professionalism -->
        <h5 class="text-sm font-semibold text-gray-900 dark:text-white">6.5 Team Professionalism</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Professionalism</label>
            <select v-model="formData.team_professionalism" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Select rating</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div class="flex items-center space-x-3">
            <input v-model="formData.client_confidence" type="checkbox" id="client-confidence" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="client-confidence" class="text-sm font-medium text-gray-700 dark:text-gray-300">Client Confidence in Team</label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Professionalism Feedback</label>
          <textarea v-model="formData.professionalism_feedback" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Feedback on team professionalism..."></textarea>
        </div>

        <hr class="my-4 border-gray-200 dark:border-gray-700" />

        <!-- Recommendations -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations / Action Points</label>
          <textarea v-model="formData.recommendations_action_points" rows="4" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Future recommendations and best practices..."></textarea>
        </div>
      </div>

      <!-- Tab 5: Set-Down & Debrief -->
      <div v-if="activeTab === 'setdown'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>📥</span>
          <span>Section 7: Set-Down & Debrief</span>
        </h4>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Set-Down Date</label>
          <input v-model="formData.setdown_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition of Items Returned</label>
          <textarea v-model="formData.items_condition_returned" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Describe the condition of returned items..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Clearance Status</label>
          <select v-model="formData.site_clearance_status" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            <option value="">Select status</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Outstanding Items</label>
          <textarea v-model="formData.outstanding_items" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="List any outstanding items or issues..."></textarea>
        </div>
      </div>

      <!-- Tab 6: Attachments -->
      <div v-if="activeTab === 'attachments'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>📎</span>
          <span>Section 8: Attachments</span>
        </h4>

        <div class="text-center py-12 text-gray-500 dark:text-gray-400">
          <p class="text-sm">File upload functionality will be added in next update...</p>
        </div>
      </div>

      <!-- Tab 7: Signatures -->
      <div v-if="activeTab === 'signatures'" class="space-y-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>✍️</span>
          <span>Section 9: Confirmation & Signatures</span>
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Officer Name</label>
            <input v-model="formData.project_officer_signature" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter project officer name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sign Date</label>
            <input v-model="formData.project_officer_sign_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reviewed By</label>
            <input v-model="formData.reviewed_by" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter reviewer name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Date</label>
            <input v-model="formData.reviewer_sign_date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
          </div>
        </div>

        <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200">
            ✓ By submitting this report, you confirm that all information is accurate and complete.
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Report Generation
        </button>
        <button
          v-if="task.status === 'in_progress' && reportData.report_signoff"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Report
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Report Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useArchivalReport, type ArchivalReportData } from '../../composables/useArchivalReport'
import type { EnquiryTask } from '../../types/enquiry'

interface ReportSection {
  id: string
  title: string
  include: boolean
  status: string
}

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface ChecklistCategory {
  id: string
  category: string
  items: ChecklistItem[]
}

interface DistributionRecipient {
  id: string
  name: string
  role: string
  selected: boolean
}

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const { loading, error, getReport, createReport, updateReport, autoPopulate } = useArchivalReport()

const activeTab = ref('project-info')
const successMessage = ref('')
const errorMessage = ref('')

// Form data connected to archival backend
const formData = reactive<ArchivalReportData>({
  status: 'draft',
  setup_items: [],
  item_placements: []
})

const tabs = [
  { id: 'project-info', label: 'Project Info & Scope', icon: '📋' },
  { id: 'procurement', label: 'Procurement & Fabrication', icon: '📦' },
  { id: 'setup', label: 'On-Site Setup', icon: '🔧' },
  { id: 'handover', label: 'Client Handover', icon: '✅' },
  { id: 'setdown', label: 'Set-Down & Debrief', icon: '📥' },
  { id: 'attachments', label: 'Attachments', icon: '📎' },
  { id: 'signatures', label: 'Signatures', icon: '✍️' }
]

const isCompleted = computed({
  get: () => props.task.status === 'completed',
  set: (value) => {
    if (value && props.task.status !== 'completed') {
      toggleTaskCompletion()
    }
  }
})

const toggleTaskCompletion = async () => {
  try {
    const response = await fetch(`/api/projects/enquiry-tasks/${props.task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        status: 'completed'
      })
    })

    if (response.ok) {
      const result = await response.json()
      emit('update-status', 'completed')

      alert(`Task "${props.task.title}" has been marked as completed! All users have been notified.`)

      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('task-completed', {
          detail: { task: props.task }
        }))
      }
    } else {
      throw new Error('Failed to update task status')
    }
  } catch (error) {
    console.error('Error updating task status:', error)
    alert('Failed to mark task as completed. Please try again.')
  }
}

const projectSummary = ref({
  name: 'Annual Conference 2025',
  completion_date: '2025-10-25',
  budget: 50000,
  actual_cost: 48500,
  status: 'completed'
})

const budgetVariance = computed(() => {
  return projectSummary.value.actual_cost - projectSummary.value.budget
})

const budgetVarianceClass = computed(() => {
  return budgetVariance.value <= 0 ? 'text-green-600' : 'text-red-600'
})

const reportSections = ref<ReportSection[]>([
  { id: 'executive_summary', title: 'Executive Summary', include: true, status: 'completed' },
  { id: 'project_overview', title: 'Project Overview', include: true, status: 'completed' },
  { id: 'financial_summary', title: 'Financial Summary', include: true, status: 'pending' },
  { id: 'timeline_analysis', title: 'Timeline Analysis', include: true, status: 'pending' },
  { id: 'lessons_learned', title: 'Lessons Learned', include: true, status: 'in_progress' },
  { id: 'recommendations', title: 'Recommendations', include: true, status: 'pending' },
  { id: 'appendices', title: 'Appendices & Photos', include: true, status: 'pending' }
])

const archivalChecklist = ref<ChecklistCategory[]>([
  {
    id: 'documentation',
    category: 'Documentation',
    items: [
      { id: 'final_report', label: 'Final report archived', completed: false },
      { id: 'supporting_docs', label: 'Supporting documents filed', completed: false },
      { id: 'contracts', label: 'Contracts and agreements stored', completed: false },
      { id: 'correspondence', label: 'Project correspondence archived', completed: false }
    ]
  },
  {
    id: 'digital_assets',
    category: 'Digital Assets',
    items: [
      { id: 'photos', label: 'Event photos organized and stored', completed: false },
      { id: 'videos', label: 'Videos and recordings archived', completed: false },
      { id: 'designs', label: 'Design files and mockups saved', completed: false },
      { id: 'data_backup', label: 'Project data backed up', completed: false }
    ]
  },
  {
    id: 'records',
    category: 'Records Management',
    items: [
      { id: 'retention_labels', label: 'Retention period labels applied', completed: false },
      { id: 'access_permissions', label: 'Access permissions set', completed: false },
      { id: 'indexing', label: 'Documents properly indexed', completed: false },
      { id: 'verification', label: 'Archival completeness verified', completed: false }
    ]
  }
])

const distributionList = ref<DistributionRecipient[]>([
  { id: '1', name: 'John Doe', role: 'Project Manager', selected: true },
  { id: '2', name: 'Jane Smith', role: 'Finance Director', selected: true },
  { id: '3', name: 'Mike Johnson', role: 'Operations Manager', selected: false },
  { id: '4', name: 'Sarah Wilson', role: 'Client Representative', selected: true }
])

const reportData = ref({
  title: 'Annual Conference 2025 - Final Project Report',
  author: '',
  report_date: new Date().toISOString().split('T')[0],
  format: 'pdf',
  lessons_positive: '',
  lessons_improvements: '',
  recommendations: '',
  timeline_variance: '',
  budget_variance_percent: '',
  client_satisfaction: 0,
  kpi_1: '',
  kpi_2: '',
  kpi_3: '',
  testimonial_author: '',
  testimonial_date: '',
  testimonial_content: '',
  archive_location: '',
  retention_period: '',
  archive_reference: '',
  completed_by: '',
  completion_date: '',
  report_signoff: false
})

// Load existing report on mount
onMounted(async () => {
  await loadArchivalReport()
})

const loadArchivalReport = async () => {
  try {
    const report = await getReport(props.task.id)
    if (report && report.id) {
      Object.assign(formData, report)
      // Map backend data to existing UI fields
      if (report.recommendations_action_points) {
        reportData.value.recommendations = report.recommendations_action_points
      }
      if (report.archive_reference) {
        reportData.value.archive_reference = report.archive_reference
      }
    } else {
      // No existing report, auto-populate from project enquiry
      await handleAutoPopulate()
    }
  } catch (err) {
    console.error('Failed to load archival report:', err)
    // Even if loading fails, try to autopopulate
    await handleAutoPopulate()
  }
}

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const addDistributionRecipient = () => {
  const newId = (distributionList.value.length + 1).toString()
  distributionList.value.push({
    id: newId,
    name: 'New Recipient',
    role: 'Staff',
    selected: false
  })
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Map UI data to backend fields
    const dataToSave = {
      ...formData,
      recommendations_action_points: reportData.value.recommendations,
      archive_reference: reportData.value.archive_reference,
      archive_location: reportData.value.archive_location,
      retention_period: reportData.value.retention_period,
      status: 'draft'
    }
    
    if (formData.id) {
      await updateReport(props.task.id, formData.id, dataToSave)
      successMessage.value = 'Report saved successfully!'
    } else {
      const newReport = await createReport(props.task.id, dataToSave)
      Object.assign(formData, newReport)
      successMessage.value = 'Report created successfully!'
    }
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: any) {
    errorMessage.value = error.value || 'Failed to save report'
  }
}

const handleAutoPopulate = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  console.log('Attempting to auto-populate archival report...')
  
  try {
    const data = await autoPopulate(props.task.id)
    console.log('Auto-populate data received:', data)
    Object.assign(formData, data)
    successMessage.value = 'Data auto-filled from previous tasks!'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: any) {
    console.error('Auto-populate failed:', err)
    errorMessage.value = error.value || 'Failed to auto-populate data'
  }
}

// Dynamic table management functions
const addSetupItem = () => {
  if (!formData.setup_items) {
    formData.setup_items = []
  }
  formData.setup_items.push({
    deliverable_item: '',
    assigned_technician: '',
    site_section: '',
    status: 'pending',
    notes: ''
  })
}

const removeSetupItem = (index: number) => {
  if (formData.setup_items) {
    formData.setup_items.splice(index, 1)
  }
}

const addItemPlacement = () => {
  if (!formData.item_placements) {
    formData.item_placements = []
  }
  formData.item_placements.push({
    section_area: '',
    items_installed: '',
    placement_accuracy: 'correct',
    observation: ''
  })
}

const removeItemPlacement = (index: number) => {
  if (formData.item_placements) {
    formData.item_placements.splice(index, 1)
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, async () => {
  await loadArchivalReport()
  
  reportSections.value.forEach(section => {
    section.include = true
    section.status = 'pending'
  })
  archivalChecklist.value.forEach(category => {
    category.items.forEach(item => item.completed = false)
  })
  distributionList.value.forEach(recipient => recipient.selected = false)
  reportData.value = {
    title: 'Project Final Report',
    author: '',
    report_date: new Date().toISOString().split('T')[0],
    format: 'pdf',
    lessons_positive: '',
    lessons_improvements: '',
    recommendations: '',
    timeline_variance: '',
    budget_variance_percent: '',
    client_satisfaction: 0,
    kpi_1: '',
    kpi_2: '',
    kpi_3: '',
    testimonial_author: '',
    testimonial_date: '',
    testimonial_content: '',
    archive_location: '',
    retention_period: '',
    archive_reference: '',
    completed_by: '',
    completion_date: '',
    report_signoff: false
  }
})
</script>
