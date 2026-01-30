<template>
  <div class="report-task bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-sm p-4 sm:p-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Task Status and Skip -->
      <div class="flex items-center space-x-3">
        <!-- Skip Button -->
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
          @click="showSkipModal = true"
          class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors mr-2"
        >
          Skip Task
        </button>

        <button
            v-if="['skipped', 'completed'].includes(task.status)"
            @click="$emit('update-status', 'pending')"
            class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition-colors mr-2"
        >
            {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
        </button>

        <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
        <div class="flex items-center space-x-2">
          <span :class="task.status === 'completed' ? 'text-green-600' : task.status === 'skipped' ? 'text-gray-600' : 'text-gray-500'" class="text-sm font-medium">
            {{ task.status === 'completed' ? 'Completed' : task.status === 'skipped' ? 'Skipped' : 'In Progress' }}
          </span>
          <p v-if="task.status !== 'completed'" class="text-sm text-gray-600 dark:text-gray-400">Mark as completed</p>
          <label v-if="task.status !== 'skipped'" class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="isCompleted"
              type="checkbox"
              class="sr-only peer"
              :disabled="readonly"
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Materials Used in Production
            <button
               v-if="!readonly"
               type="button"
               @click="autoFillMaterialsData"
               class="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            >
               Auto-fill from Materials
            </button>
          </label>
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Setup Team Assigned
                <button
                  type="button"
                  @click="autoFillSetupTeam"
                  class="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  Auto-fill from Teams
                </button>
              </label>
              <input v-model="formData.setup_team_assigned" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Setup team members" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branding Team Assigned
                <button
                  type="button"
                  @click="autoFillBrandingTeam"
                  class="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  Auto-fill from Teams
                </button>
              </label>
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
            <h5 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                5.2 Setup Item Allocation
                <button
                    v-if="!readonly"
                    type="button"
                    @click="autoFillMaterialsData"
                    class="ml-2 text-[10px] text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                    Auto-fill from Materials
                </button>
            </h5>
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
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Placement Accuracy</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">Notes</th>
                  <th class="px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!formData.setup_items || formData.setup_items.length === 0">
                  <td colspan="7" class="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No setup items added yet. Click "Add Item" to get started.
                  </td>
                </tr>
                <tr v-for="(item, index) in formData.setup_items" :key="index" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-3 py-2">
                    <input v-model="item.deliverable_item" type="text" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Enter item name" />
                  </td>
                  <td class="px-3 py-2">
                    <div class="relative min-w-[200px]">
                        <!-- Selected Technicians Display -->
                        <div class="flex flex-wrap gap-1 mb-1">
                            <span 
                                v-for="name in (item.assigned_technician ? item.assigned_technician.split(', ').filter(Boolean) : [])" 
                                :key="name" 
                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                                {{ name }}
                                <button 
                                    @click="() => {
                                        const current = item.assigned_technician ? item.assigned_technician.split(', ') : []
                                        const updated = current.filter(n => n !== name)
                                        item.assigned_technician = updated.join(', ')
                                    }"
                                    class="ml-1 text-blue-400 hover:text-blue-600 focus:outline-none"
                                >
                                    ×
                                </button>
                            </span>
                        </div>
                        
                        <!-- Technician Selector -->
                        <select 
                            @change="(e: Event) => {
                                const target = e.target as HTMLSelectElement
                                if (!target.value) return
                                
                                const current = item.assigned_technician ? item.assigned_technician.split(', ').filter(Boolean) : []
                                if (!current.includes(target.value)) {
                                    current.push(target.value)
                                    item.assigned_technician = current.join(', ')
                                }
                                target.value = '' // Reset select
                            }"
                            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">+ Add Technician</option>
                            <option 
                                v-for="labour in technicalLabour" 
                                :key="labour.id" 
                                :value="labour.full_name"
                                :disabled="item.assigned_technician?.includes(labour.full_name)"
                            >
                                {{ labour.full_name }} ({{ labour.specialization || 'N/A' }})
                            </option>
                        </select>
                    </div>
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
                    <select v-model="item.placement_accuracy" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                      <option value="">Select Accuracy</option>
                      <option value="correct">Correct</option>
                      <option value="needs_adjusted">Needs Adjusted</option>
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
          <button
            type="button"
            @click="autoFillHandoverData"
            class="ml-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center"
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Auto-fill from Handover Task
          </button>
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

        <!-- System Generated Documents Section -->
        <div class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i class="mdi mdi-file-cabinet text-purple-600 text-2xl"></i>
              System Generated Documents
            </h5>
            <span v-if="formData.system_documents?.length" class="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
              {{ formData.system_documents.length }} Files
            </span>
          </div>
          
          <div v-if="formData.system_documents?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="doc in formData.system_documents" :key="doc.name" 
              class="flex flex-col p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-lg transition-all">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                  <i :class="doc.type === 'PDF' ? 'mdi mdi-file-pdf-box' : 'mdi mdi-file-document-outline'" class="text-2xl"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ doc.name }}</p>
                  <p class="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">{{ doc.category }}</p>
                  <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-[10px] font-bold text-gray-600 dark:text-gray-300 rounded">
                    {{ doc.type }}
                  </span>
                </div>
              </div>
              <button @click="handleDownloadSystemDoc(doc)" 
                class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                <i class="mdi mdi-download"></i>
                Download
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-8 border-2 border-dashed border-purple-200 dark:border-purple-700 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <i class="mdi mdi-file-search text-4xl text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-500 dark:text-gray-400">No system documents found for this project yet.</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Documents will appear as tasks are completed.</p>
          </div>
        </div>

        <!-- Documentation Checklist -->
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h5 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Documentation Checklist</h5>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_ppt" type="checkbox" id="check-ppt" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-ppt" class="text-sm text-gray-700 dark:text-gray-300 uppercase">PPT</label>
            </div>
            
            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_cutlist" type="checkbox" id="check-cutlist" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-cutlist" class="text-sm text-gray-700 dark:text-gray-300 uppercase">Cutlist (If Any)</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_site_survey_form" type="checkbox" id="check-survey" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-survey" class="text-sm text-gray-700 dark:text-gray-300 uppercase">Site Survey Form</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_project_budget_file" type="checkbox" id="check-budget" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-budget" class="text-sm text-gray-700 dark:text-gray-300 uppercase">Project Budget File</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_material_list" type="checkbox" id="check-materials" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-materials" class="text-sm text-gray-700 dark:text-gray-300 uppercase">Material Requisition Form (MRF) / Material List</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_qc_checklist" type="checkbox" id="check-qc" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-qc" class="text-sm text-gray-700 dark:text-gray-300 uppercase">QC Checklist</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_setup_setdown" type="checkbox" id="check-setup" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-setup" class="text-sm text-gray-700 dark:text-gray-300 uppercase">Setup & Set-Down Checklist</label>
            </div>

            <div class="flex items-center space-x-3">
              <input v-model="formData.checklist_client_feedback" type="checkbox" id="check-feedback" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="check-feedback" class="text-sm text-gray-700 dark:text-gray-300 uppercase">Client Feedback / QR Code</label>
            </div>
          </div>
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
      <!-- Tab 8: Analysis & Insights -->
      <div v-if="activeTab === 'analysis'" class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>📊</span>
            <span>Project Analysis & Insights</span>
          </h4>
          <button
            @click="handleGenerateAnalysis"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            :disabled="loading || !formData.id || readonly"
          >
            <span v-if="loading" class="mr-2">...</span>
            <span v-else class="mr-2">🔄</span>
            Refresh Analysis
          </button>
        </div>

        <div v-if="!formData.id" class="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p>Please save the report first to generate analysis.</p>
        </div>

        <div v-else-if="!analysisResults && !loading" class="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p>Click "Refresh Analysis" to generate insights based on the report data.</p>
        </div>

        <div v-else-if="analysisResults" class="space-y-6 animate-fade-in">
          <!-- Summary Score Card -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex justify-between items-center">
              <div>
                <h5 class="text-lg font-semibold opacity-90">Project Health Score</h5>
                <p class="text-sm opacity-75 mt-1">Automated assessment based on performance metrics</p>
              </div>
              <div class="text-4xl font-bold bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                {{ analysisResults.summary_score }}/100
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Action Plan -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-100 dark:border-red-800/30 flex items-center">
                <span class="text-red-600 dark:text-red-400 mr-2">⚡</span>
                <h5 class="font-semibold text-gray-900 dark:text-white">Recommended Action Plan</h5>
              </div>
              <div class="p-4">
                <ul v-if="analysisResults.action_plan.length > 0" class="space-y-2">
                  <li v-for="(item, i) in analysisResults.action_plan" :key="i" class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                    <span class="mr-2 text-red-500">•</span>
                    {{ item }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 italic">No immediate actions required.</p>
              </div>
            </div>

            <!-- Root Causes -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-orange-50 dark:bg-orange-900/20 px-4 py-3 border-b border-orange-100 dark:border-orange-800/30 flex items-center">
                <span class="text-orange-600 dark:text-orange-400 mr-2">🔍</span>
                <h5 class="font-semibold text-gray-900 dark:text-white">Identified Root Causes</h5>
              </div>
              <div class="p-4">
                <ul v-if="analysisResults.root_causes.length > 0" class="space-y-2">
                  <li v-for="(item, i) in analysisResults.root_causes" :key="i" class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                    <span class="mr-2 text-orange-500">•</span>
                    {{ item }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 italic">No significant issues identified.</p>
              </div>
            </div>

            <!-- Best Practices -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-green-50 dark:bg-green-900/20 px-4 py-3 border-b border-green-100 dark:border-green-800/30 flex items-center">
                <span class="text-green-600 dark:text-green-400 mr-2">🌟</span>
                <h5 class="font-semibold text-gray-900 dark:text-white">Best Practices & Wins</h5>
              </div>
              <div class="p-4">
                <ul v-if="analysisResults.best_practices.length > 0" class="space-y-2">
                  <li v-for="(item, i) in analysisResults.best_practices" :key="i" class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                    <span class="mr-2 text-green-500">✓</span>
                    {{ item }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 italic">No specific highlights recorded.</p>
              </div>
            </div>

            <!-- Lessons Learnt -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-blue-100 dark:border-blue-800/30 flex items-center">
                <span class="text-blue-600 dark:text-blue-400 mr-2">💡</span>
                <h5 class="font-semibold text-gray-900 dark:text-white">Lessons Learnt</h5>
              </div>
              <div class="p-4">
                <ul v-if="analysisResults.lessons_learnt.length > 0" class="space-y-2">
                  <li v-for="(item, i) in analysisResults.lessons_learnt" :key="i" class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                    <span class="mr-2 text-blue-500">•</span>
                    {{ item }}
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 italic">No specific lessons recorded.</p>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 border-b border-purple-100 dark:border-purple-800/30 flex items-center">
              <span class="text-purple-600 dark:text-purple-400 mr-2">🚀</span>
              <h5 class="font-semibold text-gray-900 dark:text-white">Strategic Recommendations</h5>
            </div>
            <div class="p-4">
              <ul v-if="analysisResults.recommendations.length > 0" class="space-y-2">
                <li v-for="(item, i) in analysisResults.recommendations" :key="i" class="flex items-start text-sm text-gray-700 dark:text-gray-300">
                  <span class="mr-2 text-purple-500">➔</span>
                  <span class="whitespace-pre-line">{{ item }}</span>
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500 italic">No additional recommendations.</p>
            </div>
          </div>
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
          :disabled="readonly"
        >
          Complete Report
        </button>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Auto-save status indicator -->
        <div v-if="formData.id" class="flex items-center space-x-2">
          <transition name="fade" mode="out-in">
            <span v-if="autoSaveStatus === 'saving'" class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <svg class="animate-spin h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else-if="autoSaveStatus === 'saved'" class="text-sm text-green-600 dark:text-green-400 flex items-center">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Saved ✓
            </span>
            <span v-else-if="autoSaveStatus === 'error'" class="text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Save failed
            </span>
          </transition>
        </div>
        
        <div class="flex space-x-2">
            <button
                v-if="!readonly"
                @click="handleAutoPopulate"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                :disabled="loading"
            >
                <span class="mr-2">⚡</span> Auto-populate from Previous Tasks
            </button>
            
            <button
              v-if="formData.id"
              @click="handleDownloadPdf"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              :disabled="loading"
            >
              <span class="mr-2">📄</span> Download PDF
            </button>
            
            <button
              @click="handleSubmit"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              :disabled="loading || readonly"
            >
              {{ loading ? 'Saving...' : 'Save Report Data' }}
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
import { ref, computed, watch, onMounted, reactive } from 'vue'
import api from '@/plugins/axios'
import { useArchivalReport, type ArchivalReportData } from '../../composables/useArchivalReport'
import { useHandover } from '../../composables/useHandover'
import { useAutoSave } from '@/composables/useAutoSave'
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
  readonly?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const { loading, error, getReport, createReport, updateReport, autoPopulate, downloadPdf, analyzeReport } = useArchivalReport()

const activeTab = ref('project-info')
const successMessage = ref('')
const errorMessage = ref('')
const autoSaveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const technicalLabour = ref<any[]>([])

const fetchTechnicalLabour = async () => {
    try {
        const response = await api.get('/api/hr/technical-labour?status=active')
        technicalLabour.value = response.data || []
    } catch (e) {
        console.error('Failed to fetch technical labour', e)
    }
}

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
  { id: 'signatures', label: 'Signatures', icon: '✍️' },
  { id: 'analysis', label: 'Analysis & Insights', icon: '📊' }
]

onMounted(async () => {
    await Promise.all([
        fetchTechnicalLabour(),
        loadArchivalReport()
    ])
})

const isCompleted = computed({
  get: () => props.task.status === 'completed',
  set: (value) => {
    if (value && props.task.status !== 'completed') {
      toggleTaskCompletion()
    }
  }
})

const fetchProjectTeams = async () => {
  try {
    // 1. Get all tasks for this enquiry to find the Teams task
    const enquiryId = props.task.project_enquiry_id || props.task.enquiry?.id
    if (!enquiryId) {
      alert('Could not identify project enquiry ID')
      return null
    }

    const tasksResponse = await api.get(`/api/projects/enquiries/${enquiryId}/tasks`)
    const tasks = tasksResponse.data.data || []
    
    // Find the Teams task (assuming type 'teams' or similar)
    const teamsTask = tasks.find((t: any) => t.type === 'teams')
    
    if (!teamsTask) {
      alert('No Teams task found for this project')
      return null
    }

    // 2. Fetch teams for the found Teams task
    const teamsResponse = await api.get(`/api/projects/tasks/${teamsTask.id}/teams`)
    return teamsResponse.data.data || []
  } catch (error) {
    console.error('Error fetching teams:', error)
    alert('Failed to fetch teams data')
    return null
  }
}

const autoFillSetupTeam = async () => {
  const teams = await fetchProjectTeams()
  if (!teams) return

  // Filter for Setup category (category_id 2 or based on key)
  // We check for 'setup' in category key or display name
  const setupTeams = teams.filter((t: any) => 
    t.category?.category_key === 'setup' || 
    t.category?.display_name?.toLowerCase().includes('setup') ||
    t.category_id === 2
  )

  if (setupTeams.length === 0) {
    alert('No setup teams found')
    return
  }

  // Get all members from these teams
  const allMembers = setupTeams.flatMap((t: any) => t.members || [])
    .map((m: any) => m.member_name)
    .filter(Boolean)

  // Remove duplicates
  const uniqueMembers = [...new Set(allMembers)]
  
  if (uniqueMembers.length > 0) {
    formData.setup_team_assigned = uniqueMembers.join(', ')
    // Remove alert to be less intrusive, or keep it for status
    // alert(`Autofilled ${uniqueMembers.length} setup team members`)
  } else {
    alert('Setup teams have no members assigned')
  }
}

const autoFillBrandingTeam = async () => {
  const teams = await fetchProjectTeams()
  if (!teams) return

  // Find specifically the "Pasting Team" within Setup category
  // team_type_id 1 is Pasting Team
  const pastingTeam = teams.find((t: any) => 
    (t.team_type_id === 1 || t.team_type?.display_name?.toLowerCase().includes('pasting')) &&
    (t.category?.category_key === 'setup' || t.category_id === 2)
  )

  if (!pastingTeam) {
    alert('No Pasting/Branding team found in Setup category')
    return
  }

  const members = (pastingTeam.members || [])
    .map((m: any) => m.member_name)
    .filter(Boolean)
  
  if (members.length > 0) {
    formData.branding_team_assigned = members.join(', ')
  } else {
    alert('Branding/Pasting team has no members assigned')
  }
}

const autoFillMaterialsData = async () => {
    try {
        const response = await autoPopulate(props.task.id)
        let filled = false
        
        if (response) {
            if (response.materials_used_in_production) {
                formData.materials_used_in_production = response.materials_used_in_production
                filled = true
            }
            
            if (response.setup_items && response.setup_items.length > 0) {
                formData.setup_items = response.setup_items
                filled = true
            }

            if (response.item_placements && response.item_placements.length > 0) {
                formData.item_placements = response.item_placements
                filled = true
            }
        }

        if (filled) {
            alert('Materials and Setup items auto-filled successfully!')
        } else {
            alert('No materials or setup data found to auto-fill.')
        }
    } catch (error) {
        console.error('Failed to auto-fill materials:', error)
        alert('Failed to auto-fill materials data.')
    }
}

const { fetchSurvey, surveyData } = useHandover()

const autoFillHandoverData = async () => {
  try {
    // 1. Find the Handover task
    const enquiryId = props.task.project_enquiry_id || props.task.enquiry?.id
    if (!enquiryId) return

    const tasksResponse = await api.get(`/api/projects/enquiries/${enquiryId}/tasks`)
    const tasks = tasksResponse.data.data || []
    const handoverTask = tasks.find((t: any) => t.type === 'handover')

    if (!handoverTask) {
      alert('No Handover task found for this project')
      return
    }

    // 2. Fetch survey data
    const survey = await fetchSurvey(handoverTask.id)
    if (!survey || !survey.responses) {
      alert('No survey data available yet')
      return
    }
    
    // 3. Map responses to form fields
    const r = survey.responses // Shortcut
    
    // Handover Date
    if (survey.feedback_received_at) {
        formData.handover_date = survey.feedback_received_at.split('T')[0]
    } else if (survey.submitted_at) {
        formData.handover_date = survey.submitted_at.split('T')[0]
    }

    // Ratings & General
    if (r.overall_rating) formData.client_rating = r.overall_rating.toString()
    if (r.respondent_info) formData.client_remarks = r.respondent_info
    else if (survey.evidence_notes) formData.client_remarks = survey.evidence_notes
    
    // Quality of Work
    if (r.finishing?.rating) formData.print_clarity_rating = mapRating(r.finishing.rating)
    if (r.attention_to_detail?.rating) formData.printworks_accuracy_rating = mapRating(r.attention_to_detail.rating)
    if (r.installation_precision?.remarks) formData.installation_precision_comments = r.installation_precision.remarks
    
    // Efficiency
    if (r.work_efficiency?.rating) {
        formData.setup_speed_flow = mapRating(r.work_efficiency.rating)
        if (r.work_efficiency.rating >= 4) formData.delivered_on_schedule = true
    }
    if (r.team_professionalism?.rating) formData.team_coordination = mapRating(r.team_professionalism.rating)
    if (r.work_efficiency?.remarks) formData.efficiency_remarks = r.work_efficiency.remarks

    // Communication
    if (r.communication_effectiveness?.rating) {
        formData.client_kept_informed = r.communication_effectiveness.rating >= 4
        formData.communication_comments = r.communication_effectiveness.remarks
    }
    if (r.overall_rating) {
        formData.client_satisfaction = r.overall_rating >= 4 ? 'satisfied' : (r.overall_rating <= 2 ? 'unsatisfied' : 'n/a')
    }

    // Deliverables & Logistics
    if (r.delivered_on_time !== undefined) formData.delivered_on_schedule = r.delivered_on_time
    if (r.delivery_condition?.rating) formData.delivery_condition = mapRating(r.delivery_condition.rating)
    if (r.delivery_condition?.remarks) formData.delivery_notes = r.delivery_condition.remarks
    // Fix: issue_resolution is object with rating/remarks
    if (r.issue_resolution?.rating && r.issue_resolution.rating <= 3) formData.delivery_issues = true

    // Professionalism
    if (r.team_professionalism?.rating) formData.team_professionalism = mapRating(r.team_professionalism.rating)
    if (r.execution_confidence?.rating) formData.client_confidence = r.execution_confidence.rating >= 4
    if (r.team_professionalism?.remarks) formData.professionalism_feedback = r.team_professionalism.remarks
    
    // Recommendations
    const recs = []
    if (r.improvement_suggestions) recs.push(r.improvement_suggestions)
    if (r.additional_comments) recs.push(r.additional_comments)
    formData.recommendations_action_points = recs.join('\n\n')

    alert('Client Handover data autofilled successfully!')
    
  } catch (error) {
    console.error('Autofill error:', error)
    alert('Failed to autofill handover data')
  }
}

// Helper to map 1-5 rating to string values used in select options
const mapRating = (val: number): 'good' | 'fair' | 'poor' | undefined => {
    if (val >= 4) return 'good' // 4-5
    if (val === 3) return 'fair' // 3
    if (val <= 2) return 'poor' // 1-2
    return undefined
}

const toggleTaskCompletion = async () => {
  try {
    const response = await api.put(`/api/projects/enquiry-tasks/${props.task.id}`, {
      status: 'completed'
    })

    if (response.status >= 200 && response.status < 300) {
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

// Load existing report on mount (handled in combined onMounted above)
// onMounted(async () => {
//   await loadArchivalReport()
// })

// Auto-save function
const performAutoSave = async () => {
  // Only auto-save if we have a report ID (not for new reports)
  if (!formData.id) return
  
  autoSaveStatus.value = 'saving'
  
  try {
    const dataToSave: ArchivalReportData = {
      ...formData,
      recommendations_action_points: reportData.value.recommendations,
      archive_reference: reportData.value.archive_reference,
      archive_location: reportData.value.archive_location,
      retention_period: reportData.value.retention_period,
      status: 'draft'
    }
    
    await updateReport(props.task.id, formData.id, dataToSave)
    autoSaveStatus.value = 'saved'
    
    // Reset to idle after 2 seconds
    setTimeout(() => {
      if (autoSaveStatus.value === 'saved') {
        autoSaveStatus.value = 'idle'
      }
    }, 2000)
  } catch (err) {
    console.error('Auto-save failed:', err)
    autoSaveStatus.value = 'error'
    
    // Reset to idle after 3 seconds
    setTimeout(() => {
      if (autoSaveStatus.value === 'error') {
        autoSaveStatus.value = 'idle'
      }
    }, 3000)
  }
}

// Initialize auto-save with 3 second debounce and 30 second periodic save
useAutoSave(
  () => formData,
  performAutoSave,
  {
    debounce: 3000,      // Save 3 seconds after user stops typing
    interval: 30000,     // Backup save every 30 seconds
    enabled: true
  }
)

const loadArchivalReport = async () => {
  try {
    const report = await getReport(props.task.id)
    if (report && report.id) {
      // Format dates for input type="date"
      const dateFields = [
        'start_date', 'end_date', 'production_start_date', 
        'handover_date', 'setdown_date', 
        'project_officer_sign_date', 'reviewer_sign_date'
      ]
      
      dateFields.forEach(field => {
        if ((report as any)[field]) {
          (report as any)[field] = (report as any)[field].split('T')[0]
        }
      })

      // Format project_scope to string for textarea
      if (report.project_scope) {
        if (Array.isArray(report.project_scope)) {
            report.project_scope = report.project_scope.join('\n')
        } else if (typeof report.project_scope === 'string') {
            // Check if it's a JSON string of an array
            try {
                const parsed = JSON.parse(report.project_scope)
                if (Array.isArray(parsed)) {
                    report.project_scope = parsed.join('\n')
                }
            } catch (e) {
                // It's just a regular string, keep as is
            }
        }
      }

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
        successMessage.value = 'Task skipped successfully'
    } catch (err: any) {
        console.error('Skip task error:', err)
        errorMessage.value = err.response?.data?.message || 'Failed to skip task'
    } finally {
        isSkipping.value = false
    }
}

// Download system document handler
const handleDownloadSystemDoc = async (doc: any) => {
    loading.value = true
    try {
        const response = await api.get(doc.url, {
            responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${doc.name}.${doc.type.toLowerCase() === 'pdf' ? 'pdf' : 'zip'}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Document download failed:', error)
        errorMessage.value = 'Failed to download document.'
    } finally {
        loading.value = false
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
    const dataToSave: ArchivalReportData = {
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
      
      // Format dates for input type="date"
      const dateFields = [
        'start_date', 'end_date', 'production_start_date', 
        'handover_date', 'setdown_date', 
        'project_officer_sign_date', 'reviewer_sign_date'
      ]
      
      dateFields.forEach(field => {
        if ((newReport as any)[field]) {
          (newReport as any)[field] = (newReport as any)[field].split('T')[0]
        }
      })
      
      // Format project_scope to string for textarea
      if ((newReport as any).project_scope) {
        if (Array.isArray((newReport as any).project_scope)) {
            (newReport as any).project_scope = (newReport as any).project_scope.join('\n')
        } else if (typeof (newReport as any).project_scope === 'string') {
            try {
                const parsed = JSON.parse((newReport as any).project_scope)
                if (Array.isArray(parsed)) {
                    (newReport as any).project_scope = parsed.join('\n')
                }
            } catch (e) {
                // It's just a regular string, keep as is
            }
        }
      }
      
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

const handleDownloadPdf = async () => {
  if (!formData.id) return
  
  try {
    await downloadPdf(props.task.id, formData.id)
    successMessage.value = 'PDF downloaded successfully!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err) {
    errorMessage.value = 'Failed to download PDF'
  }
}

const handleAutoPopulate = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  console.log('Attempting to auto-populate archival report...')
  
  try {
    const data = await autoPopulate(props.task.id)
    console.log('Auto-populate data received:', data)
    
    // Ensure project_scope is a string
    if (data.project_scope && Array.isArray(data.project_scope)) {
        data.project_scope = data.project_scope.join('\n')
    }
    
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
    placement_accuracy: 'correct',
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

const analysisResults = ref<any>(null)

const handleGenerateAnalysis = async () => {
  if (!formData.id) return
  
  try {
    analysisResults.value = await analyzeReport(props.task.id, formData.id)
    successMessage.value = 'Analysis generated successfully!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err: any) {
    errorMessage.value = error.value || 'Failed to generate analysis'
  }
}

// Watch for active tab to autofill signature
watch(activeTab, async (newTab) => {
  if (newTab === 'signatures') {
    if (!formData.project_officer_signature) {
      // 1. Try to get from props directly
      let poName = props.task.enquiry?.project_officer?.name

      // 2. If name is missing but we have an ID, fetch it
      if (!poName) {
        const poId = props.task.enquiry?.project_officer_id || props.task.enquiry?.assigned_po
        
        if (poId) {
            try {
                // Try fetching from project officers endpoint
                const response = await api.get('/api/project-officers')
                const officers = response.data.data || []
                const officer = officers.find((u: any) => u.id === Number(poId))
                if (officer) {
                    poName = officer.name
                } else {
                    // Fallback to generic users endpoint if not found
                    const usersResponse = await api.get('/api/users')
                    const users = usersResponse.data.data || []
                    const user = users.find((u: any) => u.id === Number(poId))
                    if (user) poName = user.name
                }
            } catch (e) {
                console.error('Failed to fetch project officer name', e)
            }
        }
      }
      
      if (poName) {
        formData.project_officer_signature = poName
        // Also set today's date if empty
        if (!formData.project_officer_sign_date) {
            formData.project_officer_sign_date = new Date().toISOString().split('T')[0]
        }
      }
    }
  }
})

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
