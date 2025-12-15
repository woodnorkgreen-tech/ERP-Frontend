<template>
  <div class="survey-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <!-- Header and tabs - only visible when NOT readonly -->
    <div v-if="!readonly">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Error Display -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
        </div>
        <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
      </div>

      <!-- Success Display -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
        </div>
        <p class="text-sm text-green-700 dark:text-green-300 mt-1">{{ successMessage }}</p>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Use TaskDataViewer for completed tasks (readonly mode) -->
    <TaskDataViewer
      v-if="readonly"
      :task="task"
    />

    <!-- Form content (when not readonly) -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Loading State -->
      <div v-if="isLoadingExistingData" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Loading existing survey data...</span>
        </div>
      </div>

      <!-- Basic Information -->
      <div v-show="activeTab === 'basic'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Site Visit Date -->
          <div>
            <label for="site_visit_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Visit Date <span class="text-red-500">*</span>
            </label>
            <input
              id="site_visit_date"
              v-model="formData.site_visit_date"
              type="date"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.site_visit_date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              required
            />
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location <span class="text-red-500">*</span>
            </label>
            <input
              id="location"
              v-model="formData.location"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.location?.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Site location address"
              required
            />
          </div>

          <!-- Client Name -->
          <div>
            <label for="client_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Name <span class="text-red-500">*</span>
            </label>
            <input
              id="client_name"
              v-model="formData.client_name"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.client_name?.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Client company or individual name"
              required
            />
          </div>

          <!-- Client Contact Person -->
          <div>
            <label for="client_contact_person" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Person
            </label>
            <input
              id="client_contact_person"
              v-model="formData.client_contact_person"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Primary contact person"
            />
          </div>

          <!-- Client Phone -->
          <div>
            <label for="client_phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              id="client_phone"
              v-model="formData.client_phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+254 XXX XXX XXX"
            />
          </div>

          <!-- Client Email -->
          <div>
            <label for="client_email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="client_email"
              v-model="formData.client_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="client@example.com"
            />
          </div>
        </div>

        <!-- Attendees -->
        <div class="mt-4">
          <label for="attendees" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attendees
          </label>
          <textarea
            id="attendees"
            v-model="attendeesText"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="List all attendees (one per line)"
            @input="parseAttendees"
          ></textarea>
        </div>
      </div>

      <!-- Site Assessment -->
      <div v-show="activeTab === 'assessment'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Site Assessment</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Project Description -->
          <div class="md:col-span-2">
            <label for="project_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Description <span class="text-red-500">*</span>
            </label>
            <textarea
              id="project_description"
              v-model="formData.project_description"
              rows="3"
              :class="[
                'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors',
                !formData.project_description?.trim() ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="Describe the project requirements and scope"
              required
            ></textarea>
          </div>

          <!-- Objectives -->
          <div>
            <label for="objectives" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objectives
            </label>
            <textarea
              id="objectives"
              v-model="formData.objectives"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="What are the main objectives of this project?"
            ></textarea>
          </div>

          <!-- Current Condition -->
          <div>
            <label for="current_condition" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Site Condition
            </label>
            <textarea
              id="current_condition"
              v-model="formData.current_condition"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe the current state of the site"
            ></textarea>
          </div>

          <!-- Existing Branding -->
          <div>
            <label for="existing_branding" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Existing Branding
            </label>
            <textarea
              id="existing_branding"
              v-model="formData.existing_branding"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any existing branding or signage at the site"
            ></textarea>
          </div>

          <!-- Site Measurements -->
          <div>
            <label for="site_measurements" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Measurements
            </label>
            <textarea
              id="site_measurements"
              v-model="formData.site_measurements"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Key measurements and dimensions"
            ></textarea>
          </div>

          <!-- Room Size -->
          <div>
            <label for="room_size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room/Area Size
            </label>
            <input
              id="room_size"
              v-model="formData.room_size"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 10m x 15m, 150 sqm"
            />
          </div>

          <!-- Constraints -->
          <div>
            <label for="constraints" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Constraints
            </label>
            <textarea
              id="constraints"
              v-model="formData.constraints"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any constraints or limitations at the site"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Access & Logistics -->
      <div v-show="activeTab === 'access'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Access & Logistics</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Access Logistics -->
          <div>
            <label for="access_logistics" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Access Logistics
            </label>
            <textarea
              id="access_logistics"
              v-model="formData.access_logistics"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="How to access the site, entry points, etc."
            ></textarea>
          </div>

          <!-- Parking Availability -->
          <div>
            <label for="parking_availability" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parking Availability
            </label>
            <textarea
              id="parking_availability"
              v-model="formData.parking_availability"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Parking options and capacity"
            ></textarea>
          </div>

          <!-- Size Accessibility -->
          <div>
            <label for="size_accessibility" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Size & Accessibility
            </label>
            <textarea
              id="size_accessibility"
              v-model="formData.size_accessibility"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Size limitations and accessibility considerations"
            ></textarea>
          </div>

          <!-- Lifts -->
          <div>
            <label for="lifts" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lifts/Elevators
            </label>
            <input
              id="lifts"
              v-model="formData.lifts"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Lift availability and capacity"
            />
          </div>

          <!-- Door Sizes -->
          <div>
            <label for="door_sizes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Door Sizes
            </label>
            <input
              id="door_sizes"
              v-model="formData.door_sizes"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Door dimensions and types"
            />
          </div>

          <!-- Loading Areas -->
          <div>
            <label for="loading_areas" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Loading Areas
            </label>
            <textarea
              id="loading_areas"
              v-model="formData.loading_areas"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
              placeholder="Loading dock availability and specifications"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Requirements & Preferences -->
      <div v-show="activeTab === 'requirements'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Requirements & Preferences</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Branding Preferences -->
          <div>
            <label for="branding_preferences" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branding Preferences
            </label>
            <textarea
              id="branding_preferences"
              v-model="formData.branding_preferences"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Client's branding requirements and preferences"
            ></textarea>
          </div>

          <!-- Material Preferences -->
          <div>
            <label for="material_preferences" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Preferences
            </label>
            <textarea
              id="material_preferences"
              v-model="formData.material_preferences"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Preferred materials and specifications"
            ></textarea>
          </div>

          <!-- Color Scheme -->
          <div>
            <label for="color_scheme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Scheme
            </label>
            <input
              id="color_scheme"
              v-model="formData.color_scheme"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Preferred colors and color scheme"
            />
          </div>

          <!-- Brand Guidelines -->
          <div>
            <label for="brand_guidelines" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand Guidelines
            </label>
            <textarea
              id="brand_guidelines"
              v-model="formData.brand_guidelines"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brand guidelines and requirements"
            ></textarea>
          </div>

          <!-- Special Instructions -->
          <div>
            <label for="special_instructions" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Instructions
            </label>
            <textarea
              id="special_instructions"
              v-model="formData.special_instructions"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any special instructions or requirements"
            ></textarea>
          </div>

          <!-- Electrical Outlets -->
          <div>
            <label for="electrical_outlets" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Electrical Requirements
            </label>
            <textarea
              id="electrical_outlets"
              v-model="formData.electrical_outlets"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Power requirements and electrical specifications"
            ></textarea>
          </div>

          <!-- Food & Refreshment -->
          <div>
            <label for="food_refreshment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food & Refreshment
            </label>
            <textarea
              id="food_refreshment"
              v-model="formData.food_refreshment"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Catering and refreshment requirements"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Safety & Timeline -->
      <div v-show="activeTab === 'safety'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Safety & Timeline</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Safety Conditions -->
          <div>
            <label for="safety_conditions" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Conditions
            </label>
            <textarea
              id="safety_conditions"
              v-model="formData.safety_conditions"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Site safety conditions and requirements"
            ></textarea>
          </div>

          <!-- Potential Hazards -->
          <div>
            <label for="potential_hazards" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Potential Hazards
            </label>
            <textarea
              id="potential_hazards"
              v-model="formData.potential_hazards"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Identify any potential hazards or risks"
            ></textarea>
          </div>

          <!-- Safety Requirements -->
          <div>
            <label for="safety_requirements" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Safety Requirements
            </label>
            <textarea
              id="safety_requirements"
              v-model="formData.safety_requirements"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Required safety measures and equipment"
            ></textarea>
          </div>

          <!-- Set up date -->
          <div>
            <label for="set_up_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Set Up Date
            </label>
            <input
              id="set_up_date"
              v-model="formData.set_up_date"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Set down -->
          <div>
            <label for="set_down_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Set Down Date
            </label>
            <input
              id="set_down_date"
              v-model="formData.set_down_date"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Milestones -->
          <div>
            <label for="milestones" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Milestones
            </label>
            <textarea
              id="milestones"
              v-model="formData.milestones"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Key project milestones and deadlines"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div v-show="activeTab === 'additional'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Additional Notes -->
          <div class="md:col-span-2">
            <label for="additional_notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              id="additional_notes"
              v-model="formData.additional_notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional notes or observations"
            ></textarea>
          </div>

          <!-- Special Requests -->
          <div>
            <label for="special_requests" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Special Requests
            </label>
            <textarea
              id="special_requests"
              v-model="formData.special_requests"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any special requests or requirements"
            ></textarea>
          </div>

          <!-- Prepared By -->
          <div>
            <label for="prepared_by" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prepared By
            </label>
            <input
              id="prepared_by"
              v-model="formData.prepared_by"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Survey conductor's name"
            />
          </div>
        </div>

        <!-- Action Items -->
        <div class="mt-4">
          <label for="action_items" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action Items
          </label>
          <textarea
            id="action_items"
            v-model="actionItemsText"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="List action items (one per line)"
            @input="parseActionItems"
          ></textarea>
        </div>
      </div>

      <!-- Photos Tab -->
      <div v-show="activeTab === 'photos'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
              <svg class="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Site Photos</h3>
            <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {{ surveyPhotos.length }}
            </span>
          </div>
          
          <!-- Edit Toggle Buttons (only shown when readonly) -->
          <div v-if="readonly" class="flex space-x-2">
            <button
              v-if="!isEditingPhotos"
              @click="isEditingPhotos = true"
              class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              v-if="isEditingPhotos"
              @click="isEditingPhotos = false"
              class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Done Editing
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ (readonly && !isEditingPhotos) ? 'Site survey photos' : 'Upload photos from the site survey (max 20 photos, 10MB each)' }}
        </p>

        <!-- Upload Area (shown when not readonly OR when editing) -->
        <div v-if="!readonly || isEditingPhotos" class="mb-6">
          <label
            class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 transition-colors"
            @dragover.prevent
            @drop.prevent="handlePhotoDrop"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">JPG, JPEG, PNG (MAX. 10MB)</p>
            </div>
            <input
              ref="photoInput"
              type="file"
              class="hidden"
              accept="image/jpeg,image/jpg,image/png"
              multiple
              @change="handlePhotoSelect"
            />
          </label>
        </div>

        <!-- Photo Previews (before upload) - hidden in readonly mode -->
        <div v-if="(!readonly || isEditingPhotos) && photoPreviews.length > 0" class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Selected Photos ({{ photoPreviews.length }})
            </h4>
            <button
              type="button"
              @click="uploadAllPreviews"
              class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload All
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(preview, index) in photoPreviews"
              :key="index"
              class="relative rounded-lg overflow-hidden border-2 border-blue-300 dark:border-blue-600"
            >
              <img
                :src="preview.dataUrl"
                :alt="preview.file.name"
                class="w-full h-48 object-cover"
              />
              <button
                type="button"
                @click="removePreview(index)"
                class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove photo"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
                <p class="text-xs text-white truncate" :title="preview.file.name">
                  {{ preview.file.name }}
                </p>
                <p class="text-xs text-gray-300">
                  {{ formatFileSize(preview.file.size) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Progress - hidden in readonly mode -->
        <div v-if="(!readonly || isEditingPhotos) && uploadingPhotos.length > 0" class="mb-4 space-y-2">
          <div v-for="upload in uploadingPhotos" :key="upload.name" class="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <svg class="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-700 dark:text-gray-300">Uploading {{ upload.name }}...</span>
          </div>
        </div>

        <!-- Photos Grid -->
        <div v-if="surveyPhotos.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="photo in surveyPhotos"
            :key="photo.id"
            class="bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            @click="viewPhoto(photo)"
          >
            <!-- Photo Preview -->
            <div class="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
              <!-- Loading Placeholder -->
              <div class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                <svg class="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <!-- Actual Image -->
              <img
                :src="getPhotoUrl(photo)"
                :alt="photo.filename"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10"
                @load="(e) => { const parent = (e.target as HTMLElement)?.parentElement?.querySelector('.absolute'); if (parent) parent.remove(); }"
                @error="(e) => { 
                  const img = e.target as HTMLImageElement;
                  const parent = img.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class='flex flex-col items-center text-gray-400'>
                        <svg class='w-12 h-12 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
                        </svg>
                        <span class='text-xs'>Image failed to load</span>
                      </div>
                    `;
                  }
                }"
              />
              
              <!-- Hover Overlay with Actions -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center space-x-3">
                <!-- Preview Button -->
                <button 
                  type="button"
                  class="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300"
                  title="Preview"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>

                <!-- Delete Button (shown when not readonly OR when editing) -->
                <button
                  v-if="!readonly || isEditingPhotos"
                  type="button"
                  @click.stop="deletePhotoConfirm(photo.id)"
                  class="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                  title="Delete photo"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Photo Info -->
            <div class="p-4">
              <h4 class="font-medium text-gray-900 dark:text-white truncate text-sm" :title="photo.filename">
                {{ photo.filename }}
              </h4>
              <input
                v-model="photo.caption"
                type="text"
                placeholder="Add caption..."
                :readonly="readonly && !isEditingPhotos"
                class="mt-2 w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                @click.stop
                @blur="updatePhotoCaption(photo)"
              />
              
              <!-- Photo Meta -->
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div>{{ new Date(photo.uploaded_at).toLocaleDateString() }}</div>
                <div>{{ formatFileSize(photo.size) }}</div>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
          No photos uploaded yet
        </p>

        <!-- Photo Preview Modal (Design Assets Pattern) -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="photoPreviewModal.show"
            class="fixed inset-0 z-50 overflow-y-auto"
            @click.self="closePhotoModal"
          >
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closePhotoModal"></div>

            <!-- Modal Content -->
            <div class="flex min-h-screen items-center justify-center p-4">
              <div
                class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                @click.stop
              >
                <!-- Header -->
                <div v-if="photoPreviewModal.photo" class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex-1 min-w-0 mr-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {{ photoPreviewModal.photo.filename }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Site Photo • {{ formatFileSize(photoPreviewModal.photo.size) }}
                      <span v-if="photoPreviewModal.photo.caption"> • {{ photoPreviewModal.photo.caption }}</span>
                    </p>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-2">
                    <!-- Navigation -->
                    <button
                      type="button"
                      v-if="surveyPhotos.length > 1"
                      @click.stop="previousPhoto"
                      class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Previous"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      v-if="surveyPhotos.length > 1"
                      @click.stop="nextPhoto"
                      class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Next"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    
                    <!-- Close -->
                    <button
                      type="button"
                      @click="closePhotoModal"
                      class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Close"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>


                <!-- Preview Content -->
                <div class="p-4 overflow-auto max-h-[calc(90vh-180px)]">
                  <!-- Image Preview -->
                  <div v-if="photoPreviewModal.photo" class="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <img
                      :src="getPhotoUrl(photoPreviewModal.photo)"
                      :alt="photoPreviewModal.photo.filename"
                      class="max-w-full max-h-[70vh] object-contain"
                      @error="handleImageError"
                    />
                  </div>
                  <div v-else class="flex items-center justify-center py-12">
                    <p class="text-gray-500 dark:text-gray-400">Loading photo...</p>
                  </div>
                </div>

                <!-- Footer with Photo Details -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium text-gray-700 dark:text-gray-300">Photo:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">
                        {{ surveyPhotos.indexOf(photoPreviewModal.photo) + 1 }} of {{ surveyPhotos.length }}
                      </span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700 dark:text-gray-300">Uploaded:</span>
                      <span class="ml-2 text-gray-600 dark:text-gray-400">
                        {{ new Date(photoPreviewModal.photo.uploaded_at).toLocaleString() }}
                      </span>
                    </div>
                    <div v-if="photoPreviewModal.photo.caption" class="col-span-2">
                      <span class="font-medium text-gray-700 dark:text-gray-300">Caption:</span>
                      <p class="mt-1 text-gray-600 dark:text-gray-400">{{ photoPreviewModal.photo.caption }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Survey
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Survey
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            @click="handleSaveDraft"
            :disabled="isSavingDraft"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSavingDraft" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save to Draft</span>
          </button>
          <button
            type="submit"
            :disabled="hasValidationErrors || isLoading"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Survey Data</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import api from '@/plugins/axios'
import type { EnquiryTask } from '../../types/enquiry'
import TaskDataViewer from './TaskDataViewer.vue'
import imageCompression from 'browser-image-compression'

interface Props {
  task: EnquiryTask
  readonly?: boolean
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const formData = ref({
  site_visit_date: '',
  location: '',
  client_name: '',
  attendees: [] as string[],
  client_contact_person: '',
  client_phone: '',
  client_email: '',
  project_description: '',
  objectives: '',
  current_condition: '',
  existing_branding: '',
  access_logistics: '',
  parking_availability: '',
  size_accessibility: '',
  lifts: '',
  door_sizes: '',
  loading_areas: '',
  site_measurements: '',
  room_size: '',
  constraints: '',
  electrical_outlets: '',
  food_refreshment: '',
  branding_preferences: '',
  material_preferences: '',
  color_scheme: '',
  brand_guidelines: '',
  special_instructions: '',
  safety_conditions: '',
  potential_hazards: '',
  safety_requirements: '',
  set_up_date: '',
  set_down_date: '',
  additional_notes: '',
  special_requests: '',
  action_items: [] as string[],
  milestones: '',
  prepared_by: ''
})

const attendeesText = ref('')
const actionItemsText = ref('')
const error = ref('')
const successMessage = ref('')
const activeTab = ref('basic')
const isLoading = ref(false)
const isSavingDraft = ref(false)
const isLoadingExistingData = ref(false)

// Photo management
const surveyPhotos = ref<any[]>([])
const uploadingPhotos = ref<any[]>([])
const photoInput = ref<HTMLInputElement | null>(null)
const photoPreviews = ref<{ file: File; dataUrl: string }[]>([])
const photoPreviewModal = ref<{ show: boolean; photo: any }>({
  show: false,
  photo: null
})

// Edit mode for photos when readonly
const isEditingPhotos = ref(false)


const tabs = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'assessment', label: 'Site Assessment' },
  { key: 'access', label: 'Access & Logistics' },
  { key: 'requirements', label: 'Requirements & Preferences' },
  { key: 'safety', label: 'Safety & Timeline' },
  { key: 'additional', label: 'Additional Information' },
  { key: 'photos', label: 'Site Photos' }
]



// Computed properties
const hasValidationErrors = computed(() => {
  return !formData.value.site_visit_date ||
         !formData.value.location?.trim() ||
         !formData.value.client_name?.trim() ||
         !formData.value.project_description?.trim()
})

// API Methods
const fetchExistingSurveyData = async () => {
  try {
    const enquiryId = props.task.project_enquiry_id

    if (!enquiryId) {
      console.warn('No project_enquiry_id found in task')
      return null
    }

    const apiUrl = `/api/projects/site-surveys?project_enquiry_id=${enquiryId}`

    const response = await api.get(apiUrl)

    const result = response.data.length > 0 ? response.data[0] : null
    return result
  } catch (apiError: unknown) {
    console.error('[DEBUG] Error fetching existing survey data:', apiError)
    const err = apiError as { response?: { status?: number; data?: unknown } }
    console.error('[DEBUG] Error details:', {
      status: err.response?.status,
      data: err.response?.data
    })

    // Handle authentication errors
    if (err.response?.status === 401) {
      error.value = 'Authentication failed. Please log in again.'
      return null
    }

    // Handle other API errors
    if (err.response?.status === 403) {
      error.value = 'You do not have permission to access this survey data.'
      return null
    }

    error.value = 'Failed to load existing survey data. Please try again.'
    return null
  }
}

const saveSurveyData = async (data: Record<string, unknown>, isDraft = false) => {
  try {
    const payload = {
      ...data,
      project_enquiry_id: props.task.project_enquiry_id,
      enquiry_task_id: props.task.id,
      status: isDraft ? 'pending' : 'completed'
    }

    const response = await api.post('/api/projects/site-surveys', payload)
    return response.data
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    console.error('API Error:', err.response?.data)
    const message = err.response?.data?.message || err.response?.data?.errors
      ? Object.values(err.response.data.errors || {}).flat().join(', ')
      : 'Failed to save survey data'
    throw new Error(message)
  }
}

// Methods
const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const parseAttendees = () => {
  const lines = attendeesText.value.trim().split('\n').filter(line => line.trim() !== '')
  formData.value.attendees = lines
}

const parseActionItems = () => {
  const lines = actionItemsText.value.trim().split('\n').filter(line => line.trim() !== '')
  formData.value.action_items = lines
}


const handleSubmit = async () => {
  error.value = ''
  successMessage.value = ''
  isLoading.value = true

  if (hasValidationErrors.value) {
    error.value = 'Please fill in all required fields.'
    isLoading.value = false
    return
  }

  try {
    await saveSurveyData(formData.value, false)

    successMessage.value = 'Survey data saved successfully!'

    // Update task status to completed
    if (props.task.status !== 'completed') {
      updateStatus('completed')
    }

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const errorObj = err as { message?: string }
    error.value = errorObj.message || 'Failed to save survey data'
  } finally {
    isLoading.value = false
  }
}

const handleSaveDraft = async () => {
  error.value = ''
  successMessage.value = ''
  isSavingDraft.value = true

  try {
    await saveSurveyData(formData.value, true)
    successMessage.value = 'Survey draft saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const errorObj = err as { message?: string }
    error.value = errorObj.message || 'Failed to save survey draft'
  } finally {
    isSavingDraft.value = false
  }
}

// Function to load survey data
const loadSurveyData = async () => {
  error.value = ''
  successMessage.value = ''
  isLoadingExistingData.value = true

  try {
    const existingData = await fetchExistingSurveyData()

    if (existingData) {
      // Populate form with existing data
      formData.value = {
        site_visit_date: existingData.site_visit_date || '',
        location: existingData.location || '',
        client_name: existingData.client_name || '',
        attendees: Array.isArray(existingData.attendees) ? existingData.attendees : [],
        client_contact_person: existingData.client_contact_person || '',
        client_phone: existingData.client_phone || '',
        client_email: existingData.client_email || '',
        project_description: existingData.project_description || '',
        objectives: existingData.objectives || '',
        current_condition: existingData.current_condition || '',
        existing_branding: existingData.existing_branding || '',
        access_logistics: existingData.access_logistics || '',
        parking_availability: existingData.parking_availability || '',
        size_accessibility: existingData.size_accessibility || '',
        lifts: existingData.lifts || '',
        door_sizes: existingData.door_sizes || '',
        loading_areas: existingData.loading_areas || '',
        site_measurements: existingData.site_measurements || '',
        room_size: existingData.room_size || '',
        constraints: existingData.constraints || '',
        electrical_outlets: existingData.electrical_outlets || '',
        food_refreshment: existingData.food_refreshment || '',
        branding_preferences: existingData.branding_preferences || '',
        material_preferences: existingData.material_preferences || '',
        color_scheme: existingData.color_scheme || '',
        brand_guidelines: existingData.brand_guidelines || '',
        special_instructions: existingData.special_instructions || '',
        safety_conditions: existingData.safety_conditions || '',
        potential_hazards: existingData.potential_hazards || '',
        safety_requirements: existingData.safety_requirements || '',
        set_up_date: existingData.set_up_date || '',
        set_down_date: existingData.set_down_date || '',
        additional_notes: existingData.additional_notes || '',
        special_requests: existingData.special_requests || '',
        action_items: Array.isArray(existingData.action_items) ? existingData.action_items : [],
        milestones: existingData.milestones || '',
        prepared_by: existingData.prepared_by || ''
      }

      // Populate text areas for attendees and action items
      const attendeesArray = Array.isArray(existingData.attendees) ? existingData.attendees : []
      const actionItemsArray = Array.isArray(existingData.action_items) ? existingData.action_items : []
      attendeesText.value = attendeesArray.join('\n')
      actionItemsText.value = actionItemsArray.join('\n')
      
      // Load photos
      surveyPhotos.value = existingData.survey_photos || []
    } else {
      // Reset form for new task
      formData.value = {
        site_visit_date: '',
        location: '',
        client_name: '',
        attendees: [],
        client_contact_person: '',
        client_phone: '',
        client_email: '',
        project_description: '',
        objectives: '',
        current_condition: '',
        existing_branding: '',
        access_logistics: '',
        parking_availability: '',
        size_accessibility: '',
        lifts: '',
        door_sizes: '',
        loading_areas: '',
        site_measurements: '',
        room_size: '',
        constraints: '',
        electrical_outlets: '',
        food_refreshment: '',
        branding_preferences: '',
        material_preferences: '',
        color_scheme: '',
        brand_guidelines: '',
        special_instructions: '',
        safety_conditions: '',
        potential_hazards: '',
        safety_requirements: '',
        set_up_date: '',
        set_down_date: '',
        additional_notes: '',
        special_requests: '',
        action_items: [],
        milestones: '',
        prepared_by: ''
      }
      attendeesText.value = ''
      actionItemsText.value = ''
    }
  } catch (loadError) {
    console.error('Error loading existing survey data:', loadError)
    // Reset form on error
    formData.value = {
      site_visit_date: '',
      location: '',
      client_name: '',
      attendees: [],
      client_contact_person: '',
      client_phone: '',
      client_email: '',
      project_description: '',
      objectives: '',
      current_condition: '',
      existing_branding: '',
      access_logistics: '',
      parking_availability: '',
      size_accessibility: '',
      lifts: '',
      door_sizes: '',
      loading_areas: '',
      site_measurements: '',
      room_size: '',
      constraints: '',
      electrical_outlets: '',
      food_refreshment: '',
      branding_preferences: '',
      material_preferences: '',
      color_scheme: '',
      brand_guidelines: '',
      special_instructions: '',
      safety_conditions: '',
      potential_hazards: '',
      safety_requirements: '',
      set_up_date: '',
      set_down_date: '',
      additional_notes: '',
      special_requests: '',
      action_items: [],
      milestones: '',
      prepared_by: ''
    }
    attendeesText.value = ''
    actionItemsText.value = ''
  } finally {
    isLoadingExistingData.value = false
  }
}

// Photo management functions
const handlePhotoSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return
  
  await createPreviews(Array.from(files))
  // Reset input
  if(photoInput.value) photoInput.value.value = ''
}

const handlePhotoDrop = async (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (!files) return
  
  await createPreviews(Array.from(files))
}

const createPreviews = async (files: File[]) => {
  for (const file of files) {
    // Validate file
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      error.value = `Invalid file type: ${file.name}. Only JPG, JPEG, PNG allowed.`
      continue
    }
    
    // Initial size check (warn if huge, but try to compress)
    if (file.size > 20 * 1024 * 1024) {
      error.value = `File too large: ${file.name}. Maximum size is 20MB.`
      continue
    }
    
    if (surveyPhotos.value.length + photoPreviews.value.length >= 20) {
      error.value = 'Maximum 20 photos allowed per survey.'
      return
    }

    // Compress file
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    
    let processedFile = file
    try {
      const compressedBlob = await imageCompression(file, options)
      processedFile = new File([compressedBlob], file.name, { type: file.type })
    } catch (e) {
      console.warn('Compression failed, using original', e)
    }
    
    // Create preview using FileReader
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreviews.value.push({
        file: processedFile,
        dataUrl: e.target?.result as string
      })
    }
    reader.readAsDataURL(processedFile)
  }
}

const removePreview = (index: number) => {
  photoPreviews.value.splice(index, 1)
}

const uploadAllPreviews = async () => {
  const filesToUpload = photoPreviews.value.map(p => p.file)
  photoPreviews.value = [] // Clear previews
  await uploadPhotos(filesToUpload)
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}


const uploadPhotos = async (files: File[]) => {
  for (const file of files) {
    // Validate file
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      error.value = `Invalid file type: ${file.name}. Only JPG, JPEG, PNG allowed.`
      continue
    }
    
    if (file.size > 10 * 1024 * 1024) {
      error.value = `File too large: ${file.name}. Maximum size is 10MB.`
      continue
    }
    
    if (surveyPhotos.value.length >= 20) {
      error.value = 'Maximum 20 photos allowed per survey.'
      return
    }
    
    // Add to uploading list
    uploadingPhotos.value.push({ name: file.name })
    
    try {
      const formData = new FormData()
      formData.append('photo', file)
      
      const response = await api.post(`/api/projects/tasks/${props.task.id}/survey/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.photo) {
        surveyPhotos.value.push(response.data.photo)
        successMessage.value = 'Photo uploaded successfully!'
        setTimeout(() => { successMessage.value = '' }, 3000)
      }
    } catch (err: any) {
      console.error('Photo upload error:', err)
      error.value = err.response?.data?.message || 'Failed to upload photo'
    } finally {
      // Remove from uploading list
      uploadingPhotos.value = uploadingPhotos.value.filter(u => u.name !== file.name)
    }
  }
}

const deletePhotoConfirm = async (photoId: string) => {
  if (!confirm('Are you sure you want to delete this photo?')) return
  
  try {
    await api.delete(`/api/projects/tasks/${props.task.id}/survey/photos/${photoId}`)
    
    surveyPhotos.value = surveyPhotos.value.filter(p => p.id !== photoId)
    successMessage.value = 'Photo deleted successfully!'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (err: any) {
    console.error('Photo delete error:', err)
    error.value = err.response?.data?.message || 'Failed to delete photo'
  }
}

const updatePhotoCaption = async (photo: any) => {
  // Just update locally - will be saved with the survey
  console.log('Photo caption updated:', photo.caption)
}

const viewPhoto = (photo: any) => {
  console.log('Opening photo preview:', photo)
  // Open photo in modal lightbox
  photoPreviewModal.value = {
    show: true,
    photo: photo
  }
}

const closePhotoModal = () => {
  photoPreviewModal.value.show = false
}

const nextPhoto = () => {
  const currentIndex = surveyPhotos.value.indexOf(photoPreviewModal.value.photo)
  const nextIndex = (currentIndex + 1) % surveyPhotos.value.length
  photoPreviewModal.value.photo = surveyPhotos.value[nextIndex]
}

const previousPhoto = () => {
  const currentIndex = surveyPhotos.value.indexOf(photoPreviewModal.value.photo)
  const prevIndex = currentIndex === 0 ? surveyPhotos.value.length - 1 : currentIndex - 1
  photoPreviewModal.value.photo = surveyPhotos.value[prevIndex]
}

const getPhotoUrl = (photo: any) => {
  if (!photo) return ''
  
  // If URL already exists, use it
  if (photo.url) {
    return photo.url
  }
  
  // Otherwise construct from path with /api/storage/
  if (photo.path) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    return `${baseUrl}/api/storage/${photo.path}`
  }
  
  return ''
}
const handleImageError = (e: Event) => {
  console.error('Failed to load image:', (e.target as HTMLImageElement).src)
  // Could set a fallback image here if needed
}

// Function to auto-fill basic information from project enquiry
const autoFillBasicInfo = async () => {
  if (!props.task?.project_enquiry_id) {
    console.warn('[DEBUG] No project enquiry ID available for auto-fill')
    return
  }

  try {
    console.log('[DEBUG] Auto-filling basic information from enquiry ID:', props.task.project_enquiry_id)

    // Fetch project enquiry data
    const enquiryResponse = await api.get(`/api/projects/enquiries/${props.task.project_enquiry_id}`)
    const enquiry = enquiryResponse.data.data

    if (enquiry) {
      console.log('[DEBUG] Auto-filling with enquiry data:', enquiry)

      // Auto-fill basic information fields
      formData.value.client_name = enquiry.client?.full_name || enquiry.client_name || ''
      formData.value.location = enquiry.venue || ''
      formData.value.client_contact_person = enquiry.client?.contact_person || ''
      formData.value.client_phone = enquiry.client?.phone || ''
      formData.value.client_email = enquiry.client?.email || ''
      formData.value.project_description = enquiry.description || enquiry.event_name || ''

      console.log('[DEBUG] Auto-filled form data:', formData.value)
    }
  } catch (autoFillError) {
    console.error('[DEBUG] Error auto-filling basic information:', autoFillError)
    // Don't show error to user, just log it - auto-fill is optional
  }
}

// Watch for task changes to load existing data or reset form
watch(() => props.task?.id, async (newTaskId, oldTaskId) => {
  try {
    console.log('[DEBUG] WATCH FUNCTION TRIGGERED - Task ID changed:', {
      oldTaskId: oldTaskId,
      newTaskId: newTaskId,
      taskStatus: props.task?.status,
      readonly: props.readonly,
      project_enquiry_id: props.task?.project_enquiry_id,
      fullTask: props.task
    })

    // Ensure task object is available before proceeding
    if (!props.task) {
      console.warn('[DEBUG] Task object is not available in watcher')
      return
    }

    // First try to load existing survey data
    await loadSurveyData()

    // If no existing data was loaded (new survey), auto-fill from enquiry
    if (!isLoadingExistingData.value) {
      await autoFillBasicInfo()
    }
  } catch (watcherError) {
    console.error('[DEBUG] Error in task watcher callback:', watcherError)
    // Set error state to prevent further issues
    error.value = 'Failed to load survey data. Please refresh the page.'
    isLoadingExistingData.value = false
  }
}, { immediate: true })
</script>
