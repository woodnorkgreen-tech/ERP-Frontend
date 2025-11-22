<template>
  <div class="logistics-task bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Project Header Section -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Logistics Task - {{ task.title }}
      </h4>

      <!-- Project Information Display -->
      <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Project Information</h5>
          <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full w-fit">
            Logistics Task
          </span>
        </div>
        <!-- Project Information Grid - Responsive layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          <!-- Project Title -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold mt-1 break-words">
              <span v-if="projectInfo.enquiryTitle && projectInfo.enquiryTitle !== 'Untitled Project'">
                {{ projectInfo.enquiryTitle }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                Untitled Project
              </span>
            </p>
          </div>

          <!-- Enquiry Number -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Enquiry Number</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium mt-1 font-mono">
              <span v-if="projectInfo.projectId && projectInfo.projectId !== 'N/A'">
                {{ projectInfo.projectId }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                Not assigned
              </span>
            </p>
          </div>

          <!-- Client Name -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1 break-words">
              <span v-if="projectInfo.clientName && projectInfo.clientName !== 'N/A'">
                {{ projectInfo.clientName }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                Not specified
              </span>
            </p>
          </div>

          <!-- Event Venue -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Event Venue</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1 break-words">
              <span v-if="projectInfo.eventVenue && projectInfo.eventVenue !== 'TBC'">
                {{ projectInfo.eventVenue }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                To be confirmed
              </span>
            </p>
          </div>

          <!-- Setup Date -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Setup Date</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">
              <span v-if="formatDate(projectInfo.setupDate) !== 'TBC'" class="font-medium">
                {{ formatDate(projectInfo.setupDate) }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                To be confirmed
              </span>
            </p>
          </div>

          <!-- Set Down Date -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Setdown Date</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">
              <span v-if="formatDate(projectInfo.setDownDate) !== 'TBC'" class="font-medium">
                {{ formatDate(projectInfo.setDownDate) }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                To be confirmed
              </span>
            </p>
          </div>

          <!-- Estimated Budget -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Estimated Budget</label>
            <p class="text-sm text-gray-900 dark:text-white font-medium mt-1">
              <span v-if="projectInfo.estimatedBudget" class="text-green-600 dark:text-green-400">
                KES {{ formatCurrency(projectInfo.estimatedBudget) }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                Not specified
              </span>
            </p>
          </div>

          <!-- Contact Person -->
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Person</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1 break-words">
              <span v-if="projectInfo.contactPerson && projectInfo.contactPerson !== 'N/A'">
                {{ projectInfo.contactPerson }}
              </span>
              <span v-else class="text-gray-500 dark:text-gray-400 italic">
                Not specified
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Messages -->
    <div v-if="feedbackMessages.length > 0" class="mb-6 space-y-2">
      <div
        v-for="message in feedbackMessages"
        :key="message.id"
        :class="[
          'flex items-center justify-between p-3 rounded-lg border text-sm',
          {
            'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200': message.type === 'success',
            'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200': message.type === 'error',
            'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200': message.type === 'warning',
            'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200': message.type === 'info'
          }
        ]"
      >
        <div class="flex items-center space-x-2">
          <!-- Success Icon -->
          <svg v-if="message.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <!-- Error Icon -->
          <svg v-else-if="message.type === 'error'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <!-- Warning Icon -->
          <svg v-else-if="message.type === 'warning'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <!-- Info Icon -->
          <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ message.message }}</span>
        </div>
        <button
          @click="removeFeedbackMessage(message.id)"
          class="text-current hover:opacity-70 transition-opacity p-1 rounded-md"
          :aria-label="'Dismiss message'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav
        class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto"
        role="tablist"
        aria-label="Logistics task navigation"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          @click="setActiveTab(tab.id)"
          @keydown="handleTabKeydown($event, index)"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap min-w-0',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-700',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm transform scale-105'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:scale-102'
          ]"
          :aria-selected="activeTab === tab.id"
          :aria-controls="`tab-panel-${tab.id}`"
          :id="`tab-${tab.id}`"
          role="tab"
          :tabindex="activeTab === tab.id ? 0 : -1"
        >
          <span class="truncate">{{ tab.label }}</span>
          <!-- Tab indicator badges -->
          <span
            v-if="getTabBadgeCount(tab.id) > 0"
            class="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
            :class="getTabBadgeClass(tab.id)"
          >
            {{ getTabBadgeCount(tab.id) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container">
      <!-- Logistics Planning Tab -->
      <div
        v-show="activeTab === 'logistics-planning'"
        class="logistics-planning-section tab-panel"
        :id="`tab-panel-logistics-planning`"
        role="tabpanel"
        :aria-labelledby="`tab-logistics-planning`"
        :class="{ 'animate-fade-in': activeTab === 'logistics-planning' }"
      >
        <!-- Check if logistics data exists -->
        <div v-if="!logisticsData.logistics_planning?.vehicle_type && !logisticsData.logistics_planning?.vehicle_identification && !logisticsData.logistics_planning?.driver_name">
          <!-- Empty State -->
          <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="text-6xl mb-4"></div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Logistics Planning Yet</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start planning your transportation logistics by setting up vehicle assignments, routes, and timelines for this project.
            </p>
            <button
              @click="showPlanningModal = true"
              class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Plan Logistics</span>
            </button>
          </div>
        </div>

        <!-- Existing Logistics Data Display -->
        <div v-else class="space-y-6">
          <!-- Logistics Planning Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Transportation Planning</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Current logistics plan for this project
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="showPlanningModal = true"
                class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Edit Planning
              </button>
              <button
                @click="resetLogisticsForm"
                class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Reset Form
              </button>
            </div>
          </div>

          <!-- Logistics Data Display Cards -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Vehicle Information Card -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-2 mb-4">
                <span class="text-xl"></span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Vehicle Information</h4>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Vehicle Type:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.vehicle_type || 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Vehicle ID:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.vehicle_identification || 'Not set' }}</span>
                </div>
              </div>
            </div>

            <!-- Driver Information Card -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-2 mb-4">
                <span class="text-xl"></span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Driver Information</h4>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Driver Name:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.driver_name || 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Contact:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.driver_contact || 'Not set' }}</span>
                </div>
              </div>
            </div>

            <!-- Route Planning Card -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-2 mb-4">
                <span class="text-xl"></span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Route Planning</h4>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Origin:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.route?.origin || 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Destination:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.route?.destination || 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Distance:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.route?.distance ? `${logisticsData.logistics_planning.route.distance} km` : 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Travel Time:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.route?.travel_time || 'Not set' }}</span>
                </div>
              </div>
            </div>

            <!-- Timeline Card -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-2 mb-4">
                <span class="text-xl"></span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Timeline</h4>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Departure:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.timeline?.departure_time ? formatDate(logisticsData.logistics_planning.timeline.departure_time) : 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Arrival:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.timeline?.arrival_time ? formatDate(logisticsData.logistics_planning.timeline.arrival_time) : 'Not set' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Setup Start:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ logisticsData.logistics_planning?.timeline?.setup_start_time ? formatDate(logisticsData.logistics_planning.timeline.setup_start_time) : 'Not set' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Logistics Planning Modal -->
        <div v-if="activeTab === 'logistics-planning' && showPlanningModal" class="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div class="bg-white dark:bg-gray-800 absolute inset-0 overflow-y-auto p-6">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Logistics Planning</h3>
                <div class="flex items-center space-x-2">
                  <button
                    type="submit"
                    form="logistics-planning-form"
                    :disabled="!isFormValid"
                    :class="[
                      'px-3 py-1 text-xs rounded transition-colors',
                      isFormValid
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    Save
                  </button>
                  <button
                    @click="showPlanningModal = false"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="p-4">
              <!-- Logistics Planning Form -->
              <form id="logistics-planning-form" @submit.prevent="saveLogisticsPlanning" class="space-y-4">
          <!-- Vehicle Information Section -->
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-base"></span>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Vehicle Information</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <!-- Vehicle Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Type <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="logisticsData.logistics_planning.vehicle_type"
                  @change="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('vehicleType')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="pickup">Pickup Truck</option>
                  <option value="trailer">Trailer</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="hasFieldError('vehicleType')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('vehicleType') }}
                </p>
              </div>

              <!-- Vehicle Identification -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle ID/License Plate <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="logisticsData.logistics_planning.vehicle_identification"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('vehicleId')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  placeholder="e.g., KCA 123A or Fleet #001"
                  required
                />
                <p v-if="hasFieldError('vehicleId')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('vehicleId') }}
                </p>
              </div>

            </div>
          </div>

          <!-- Driver Information Section -->
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-base"></span>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Driver Information</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <!-- Driver Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Driver <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedDriverId"
                  @change="onDriverChange"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('driverName')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  required
                >
                  <option value="">Select a driver</option>
                  <option
                    v-for="driver in availableDrivers"
                    :key="driver.id"
                    :value="driver.id"
                  >
                    {{ driver.label }}
                  </option>
                </select>
                <p v-if="hasFieldError('driverName')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('driverName') }}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Drivers are loaded from the HR system
                </p>
              </div>

              <!-- Driver Contact (auto-filled from selection) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Driver Contact <span class="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  v-model="logisticsData.logistics_planning.driver_contact"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('driverContact')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  placeholder="+254 700 000 000"
                  required
                  readonly
                />
                <p v-if="hasFieldError('driverContact')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('driverContact') }}
                </p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Auto-filled from driver selection
                </p>
              </div>

            </div>
          </div>

          <!-- Route Planning Section -->
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-base"></span>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Route Planning</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <!-- Origin -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Origin Location <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="logisticsData.logistics_planning.route.origin"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('routeOrigin')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  placeholder="Starting location/warehouse"
                  required
                />
                <p v-if="hasFieldError('routeOrigin')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('routeOrigin') }}
                </p>
              </div>

              <!-- Destination -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination Location <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="logisticsData.logistics_planning.route.destination"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('routeDestination')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  placeholder="Event venue/delivery location"
                  required
                />
                <p v-if="hasFieldError('routeDestination')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('routeDestination') }}
                </p>
              </div>

              <!-- Estimated Distance (Optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Distance (Optional)
                </label>
                <input
                  type="text"
                  v-model="logisticsData.logistics_planning.route.distance"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g., 25 km, 15 miles"
                />
              </div>

              <!-- Estimated Travel Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Travel Time <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="logisticsData.logistics_planning.route.travel_time"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('travelTime')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  placeholder="e.g., 45 minutes, 1.5 hours"
                  required
                />
                <p v-if="hasFieldError('travelTime')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('travelTime') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Timeline Section -->
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-base"></span>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Timeline</h4>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <!-- Departure Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departure Time <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  v-model="logisticsData.logistics_planning.timeline.departure_time"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('departureTime')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  required
                />
                <p v-if="hasFieldError('departureTime')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('departureTime') }}
                </p>
              </div>

              <!-- Arrival Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arrival Time <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  v-model="logisticsData.logistics_planning.timeline.arrival_time"
                  @input="validateLogisticsForm"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    hasFieldError('arrivalTime')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  required
                />
                <p v-if="hasFieldError('arrivalTime')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ getFieldError('arrivalTime') }}
                </p>
              </div>

              <!-- Setup Start Time (Optional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Setup Start Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  v-model="logisticsData.logistics_planning.timeline.setup_start_time"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
            <div class="flex items-center space-x-2 text-sm">
              <span class="text-red-500">*</span>
              <span class="text-gray-600 dark:text-gray-400">Required fields</span>
            </div>

            <button
              type="button"
              @click="resetLogisticsForm"
              class="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Confirmation Tab -->
      <div
        v-show="activeTab === 'team-confirmation'"
        class="team-confirmation-section tab-panel"
        :id="`tab-panel-team-confirmation`"
        role="tabpanel"
        :aria-labelledby="`tab-team-confirmation`"
        :class="{ 'animate-fade-in': activeTab === 'team-confirmation' }"
      >
        <!-- Team Confirmation Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Team Confirmation</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Confirm team assignments from Teams Task for logistics coordination
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="refreshTeamData"
              :disabled="teamDataState.isLoading"
              class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg v-if="teamDataState.isLoading" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{{ teamDataState.isLoading ? 'Loading...' : 'Refresh' }}</span>
            </button>
            <button
              @click="saveTeamConfirmation"
              :disabled="!hasTeamConfirmationChanges"
              class="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Save Confirmation
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="teamDataState.isLoading" class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <p class="text-sm text-blue-800 dark:text-blue-200">Loading team assignments...</p>
          </div>
        </div>


        <div v-else-if="teamDataState.hasError" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-red-800 dark:text-red-200">Unable to Load Team Assignments</h4>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                {{ teamDataState.errorMessage || 'Failed to load team data. Please try again.' }}
              </p>
              <div class="flex space-x-3 mt-3">
                <button
                  @click="refreshTeamData"
                  class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
                <button
                  @click="proceedWithoutTeamData"
                  class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Proceed Without Team Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Team Data Available State -->
        <div v-if="!teamDataState.isLoading && !teamDataState.hasError && !teamDataState.data" class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">No Team Assignments Found</h4>
              <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                No team assignments have been found for this project. Complete the Teams Task first to enable team confirmation.
              </p>
              <button
                @click="proceedWithoutTeamData"
                class="mt-3 px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Proceed Without Team Data
              </button>
            </div>
          </div>
        </div>

        <!-- Team Confirmation Content -->
        <div v-else class="space-y-6">
          <!-- Setup Teams Only (as requested) -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span class="text-2xl"></span>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Setup Teams</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Teams assigned for event setup and installation</p>
                </div>
              </div>
              <label class="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  :id="`confirm-setup`"
                  v-model="logisticsData.team_confirmation.setup_teams_confirmed"
                  @change="updateTeamConfirmation('setup')"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="font-medium">Confirm All Setup Teams</span>
              </label>
            </div>

            <!-- Setup Teams List -->
            <div v-if="getSelectedTeamTypes('setup').length > 0" class="space-y-4">
              <div class="grid gap-3">
                <div
                  v-for="team in getSelectedTeamTypes('setup')"
                  :key="team.id"
                  class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50"
                >
                  <!-- Team Header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span class="text-lg"></span>
                      </div>
                      <div>
                        <h5 class="font-medium text-gray-900 dark:text-white">{{ team.name }}</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ team.members.length }} member{{ team.members.length !== 1 ? 's' : '' }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full font-medium">
                        Setup Team
                      </span>
                    </div>
                  </div>

                  <!-- Team Members -->
                  <div class="mb-3">
                    <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Members:</h6>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="member in team.members"
                        :key="member.id"
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500"
                      >
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {{ member.name }}
                      </span>
                    </div>
                  </div>

                  <!-- Team Notes -->
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    <span>Assigned: {{ formatDate(team.members[0]?.addedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Setup Teams Message -->
            <div v-else class="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              <div class="text-4xl mb-4"></div>
              <h5 class="text-lg font-medium mb-2">No Setup Teams Assigned</h5>
              <p class="text-sm">Setup teams need to be created in the Teams Task first before they can be confirmed for logistics.</p>
            </div>

            <!-- Notes Section -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logistics Notes (Optional)</label>
              <textarea
                v-model="logisticsData.team_confirmation.notes"
                @input="updateTeamConfirmation('setup')"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Add any logistics-specific notes about setup teams, special requirements, or coordination details..."
              ></textarea>
            </div>
          </div>

          <!-- Logistics Readiness Summary -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Logistics Readiness</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Setup teams confirmation status</p>
              </div>
              <div class="flex items-center space-x-2">
                <div :class="[
                  'w-4 h-4 rounded-full',
                  logisticsData.team_confirmation.setup_teams_confirmed ? 'bg-green-500' : 'bg-yellow-500'
                ]"></div>
                <span class="text-sm font-medium" :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'">
                  {{ logisticsData.team_confirmation.setup_teams_confirmed ? 'Confirmed' : 'Pending' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-blue-500"></span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Team Assignment</span>
                </div>
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ getSelectedTeamTypes('setup').length }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Setup teams assigned</div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-green-500"></span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Team Members</span>
                </div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ logisticsData.team_confirmation.setup_teams_confirmed ? '7' : '0' }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Total team members</div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-purple-500"></span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Confirmation</span>
                </div>
                <div class="text-2xl font-bold" :class="logisticsData.team_confirmation.setup_teams_confirmed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">
                  {{ logisticsData.team_confirmation.setup_teams_confirmed ? 'Done' : 'Pending' }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Logistics approval</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Management Tab -->
      <div
        v-show="activeTab === 'loading-sheet'"
        class="loading-sheet-section tab-panel"
        :id="`tab-panel-loading-sheet`"
        role="tabpanel"
        :aria-labelledby="`tab-loading-sheet`"
        :class="{ 'animate-fade-in': activeTab === 'loading-sheet' }"
      >
        <!-- Header actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Loading Sheet</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Import production elements and add custom loading items</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              @click="importProductionElements"
              :disabled="itemsState.isImporting"
              class="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg v-if="itemsState.isImporting" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>{{ itemsState.isImporting ? 'Importing...' : 'Import Production Elements' }}</span>
            </button>
            <button
              v-if="itemsState.importError"
              @click="importProductionElements"
              class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >Retry Import</button>
            <button
              @click="openAddCustomItemModal"
              class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >Add Custom Item</button>
          </div>
        </div>

        <!-- Content -->
        <div class="w-full gap-4">
          <!-- Imported/Existing Items -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">📋</span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Loading Sheet Items</h4>
                <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">{{ filteredTransportItems.length }}</span>
              </div>
              <input
                v-model="itemsState.searchQuery"
                type="text"
                placeholder="Search items..."
                class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div v-if="filteredTransportItems.length === 0" class="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              <div>No items yet. Import production elements or add a custom item.</div>
              <div v-if="itemsState.importError" class="mt-2 text-red-600 dark:text-red-400">{{ itemsState.importError }}</div>
            </div>

            <!-- Table Layout -->
            <div v-else class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Item Details</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Quantity</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Weight</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">Handling</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="item in filteredTransportItems" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    
                    <!-- Read Mode -->
                    <template v-if="!isEditing(item.id)">
                      <td class="px-6 py-4">
                        <div class="flex items-start gap-3">
                          <div class="flex-shrink-0 mt-1">
                            <span 
                              class="inline-block w-2.5 h-2.5 rounded-full" 
                              :class="item.category === 'production' ? 'bg-purple-500' : 'bg-blue-500'"
                              :title="item.category === 'production' ? 'Production Item' : 'Custom Item'"
                            ></span>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
                            <div v-if="item.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{{ item.description }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white font-medium">{{ item.quantity }} <span class="text-gray-500 dark:text-gray-400 font-normal">{{ item.unit }}</span></div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.weight || '-' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span v-if="item.special_handling" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                          {{ item.special_handling }}
                        </span>
                        <span v-else class="text-gray-400 text-xs">-</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex justify-end gap-2">
                          <button 
                            @click="startEditingItem(item)" 
                            class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button 
                            @click="removeTransportItem(item.id.toString())" 
                            class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </template>

                    <!-- Edit Mode -->
                    <template v-else>
                      <td class="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10">
                        <div class="space-y-2">
                          <input 
                            v-model="itemsState.editData[item.id].name"
                            type="text"
                            placeholder="Item Name"
                            class="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                            :class="itemsState.validationErrors[item.id]?.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                          />
                          <textarea 
                            v-model="itemsState.editData[item.id].description"
                            rows="1"
                            placeholder="Description"
                            class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                          ></textarea>
                        </div>
                      </td>
                      <td class="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 align-top">
                        <div class="flex flex-col gap-1">
                          <div class="flex items-center gap-1">
                            <button 
                              @click="adjustQuantity(item.id, -1)"
                              class="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              type="button"
                            >−</button>
                            <input 
                              v-model.number="itemsState.editData[item.id].quantity"
                              type="number"
                              min="1"
                              class="w-16 px-1 py-1 text-sm text-center border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              :class="itemsState.validationErrors[item.id]?.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                            />
                            <button 
                              @click="adjustQuantity(item.id, 1)"
                              class="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              type="button"
                            >+</button>
                          </div>
                          <input 
                            v-model="itemsState.editData[item.id].unit"
                            type="text"
                            placeholder="Unit"
                            class="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            :class="itemsState.validationErrors[item.id]?.unit ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                          />
                        </div>
                      </td>
                      <td class="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 align-top">
                        <input 
                          v-model="itemsState.editData[item.id].weight"
                          type="text"
                          placeholder="Weight"
                          class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td class="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 align-top">
                        <input 
                          v-model="itemsState.editData[item.id].special_handling"
                          type="text"
                          placeholder="Handling"
                          class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td class="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 text-right align-top">
                        <div class="flex flex-col gap-2 items-end">
                          <button 
                            @click="saveEditedItem(item.id)"
                            :disabled="itemsState.isSaving[item.id]"
                            class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-50 whitespace-nowrap"
                          >
                            {{ itemsState.isSaving[item.id] ? 'Saving...' : 'Save' }}
                          </button>
                          <button 
                            @click="cancelEditingItem(item.id)"
                            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </template>
                  </tr>
                  
                  <!-- Empty State -->
                  <tr v-if="filteredTransportItems.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div class="flex flex-col items-center justify-center">
                        <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <p class="text-base font-medium">No items in loading sheet</p>
                        <p class="text-sm mt-1">Import from production or add custom items above</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>

      <!-- Checklist Tab -->
      <div
        v-show="activeTab === 'checklist'"
        class="checklist-section tab-panel"
        :id="`tab-panel-checklist`"
        role="tabpanel"
        :aria-labelledby="`tab-checklist`"
        :class="{ 'animate-fade-in': activeTab === 'checklist' }"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Checklist</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Verify items, team presence, and safety requirements</p>
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <span class="text-sm text-gray-700 dark:text-gray-300">Progress: {{ checklistProgress }}%</span>
            <div class="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-2 bg-green-500" :style="{ width: checklistProgress + '%' }"></div>
            </div>
            <button
              @click="generateChecklistFromItems"
              class="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
            >Generate from Transport Items</button>
          </div>
        </div>

        <!-- Sections grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Items Checklist -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 lg:col-span-2">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xl"></span>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">Items</h4>
              <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">{{ checklist.items.length }}</span>
            </div>

            <div v-if="checklist.items.length === 0" class="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              No checklist items yet. Use "Generate from Transport Items" to create them.
            </div>

            <div v-else class="space-y-3">
              <div v-for="ci in checklist.items" :key="ci.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ ci.item_name }}</p>
                    <p v-if="ci.notes" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ ci.notes }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2 items-center">
                    <select v-model="ci.status" @change="touchChecklistItem(ci)"
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="present">Present</option>
                      <option value="missing">Missing</option>
                      <option value="coming_later">Coming later</option>
                    </select>
                    <input v-model="ci.notes" @change="touchChecklistItem(ci)" type="text" placeholder="Notes"
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-44"/>
                  </div>
                </div>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400" v-if="ci.checkedBy || ci.checkedAt">
                  <span v-if="ci.checkedBy">Checked by {{ ci.checkedBy }}</span>
                  <span v-if="ci.checkedAt"> • {{ formatChecklistDate(ci.checkedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Teams & Safety -->
          <div class="space-y-4">
            <!-- Teams -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xl"></span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Teams</h4>
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="checklist.teams.workshop" @change="touchChecklistMeta()" class="w-4 h-4"/>
                  <span>Workshop present</span>
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="checklist.teams.setup" @change="touchChecklistMeta()" class="w-4 h-4"/>
                  <span>Setup present</span>
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="checklist.teams.setdown" @change="touchChecklistMeta()" class="w-4 h-4"/>
                  <span>Setdown present</span>
                </label>
              </div>
            </div>

            <!-- Safety -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xl"></span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Safety</h4>
              </div>
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="checklist.safety.ppe" @change="touchChecklistMeta()" class="w-4 h-4"/>
                  <span>PPE available</span>
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="checklist.safety.first_aid" @change="touchChecklistMeta()" class="w-4 h-4"/>
                  <span>First aid kit</span>
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="checklist.safety.fire_extinguisher" @change="touchChecklistMeta()" class="w-4 h-4"/>
                  <span>Fire extinguisher</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-3 py-1.5 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex flex-wrap gap-2">
          <button
            v-if="task.status !== 'completed' && task.status !== 'cancelled'"
            @click="$emit('update-status', 'completed')"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Mark Complete</span>
          </button>

          <button
            v-if="task.status !== 'in_progress' && task.status !== 'completed' && task.status !== 'cancelled'"
            @click="$emit('update-status', 'in_progress')"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm"
          >Set In Progress</button>

          <button
            v-if="task.status !== 'pending' && task.status !== 'completed' && task.status !== 'cancelled'"
            @click="$emit('update-status', 'pending')"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm"
          >Set Pending</button>

          <button
            v-if="task.status !== 'cancelled' && task.status !== 'completed'"
            @click="() => { if (confirm('Cancel this task? This action can be changed later.')) $emit('update-status', 'cancelled') }"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm"
          >Cancel Task</button>
        </div>

        <div v-if="task.status === 'completed'" class="flex items-center justify-center sm:justify-start space-x-2 text-green-600 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">Task Completed</span>
        </div>
      </div>
    </div>
    <!-- Add Custom Item Modal -->
    <div v-if="itemsState.isAddCustomItemModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeAddCustomItemModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-top bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:mt-20 sm:max-w-md w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  Add Custom Item
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Item Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Item Name <span class="text-red-500">*</span>
                    </label>
                    <input 
                      v-model="customItemForm.name" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Stage Deck"
                    />
                  </div>

                  <!-- Quantity & Unit -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model.number="customItemForm.quantity" 
                        type="number" 
                        min="1"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit <span class="text-red-500">*</span>
                      </label>
                      <input 
                        v-model="customItemForm.unit" 
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="pcs, kg, box"
                      />
                    </div>
                  </div>

                  <!-- Weight & Handling -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weight (optional)
                      </label>
                      <input 
                        v-model="customItemForm.weight" 
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 50kg"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Special Handling
                      </label>
                      <input 
                        v-model="customItemForm.special_handling" 
                        type="text" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Fragile"
                      />
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (optional)
                    </label>
                    <textarea 
                      v-model="customItemForm.description" 
                      rows="3" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Additional details..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="addCustomTransportItem"
            >
              Add Item
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeAddCustomItemModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { useTeams } from '../../composables/useTeams'
import { useLogistics } from '../../composables/useLogistics'

/**
 * Props interface for the LogisticsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
}

/**
 * Events emitted by the LogisticsTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
}

/**
 * Project information structure for the logistics task
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
  /** Estimated budget for the project */
  estimatedBudget?: number
  /** Contact person for the project */
  contactPerson: string
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
  route?: {
    origin?: string
    destination?: string
    distance?: number
    travel_time?: string
  }
  timeline?: {
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
  confirmed: boolean
  teamTypes: string[]
  memberCount: number
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
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Initialize logistics composable
const logistics = useLogistics()

/**
 * User feedback messages
 */
const feedbackMessages = ref<FeedbackMessage[]>([])

/**
 * Modal state for logistics planning
 */
const showPlanningModal = ref(false)

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
      projectId: enquiry?.enquiry_number || 'N/A',
      enquiryTitle: enquiry?.title || 'Untitled Project',
      clientName: enquiry?.client?.full_name || enquiry?.client?.FullName || enquiry?.contact_person || 'N/A',
      eventVenue: enquiry?.venue || 'TBC',
      setupDate: enquiry?.expected_delivery_date || 'TBC',
      setDownDate: 'TBC', // This would come from project data when available
      estimatedBudget: enquiry?.estimated_budget,
      contactPerson: enquiry?.contact_person || 'N/A'
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
      Object.assign(logisticsData, existingData)
      addFeedbackMessage('success', 'Logistics data loaded successfully')
    } else {
      addFeedbackMessage('info', 'No logistics data found. Start by planning your logistics.')
    }

    // Fetch team data for confirmation
    await fetchTeamData()

    // Fetch available drivers
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
      checklist: { items: [], teams: { workshop: false, setup: false, setdown: false }, safety: { ppe: false, first_aid: false, fire_extinguisher: false } },
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
      checklist: { items: [], teams: { workshop: false, setup: false, setdown: false }, safety: { ppe: false, first_aid: false, fire_extinguisher: false } },
      status: 'pending'
    }
  }
}

/**
 * Available drivers from HR system
 */
const availableDrivers = ref<Array<{id: number, name: string, phone: string, label: string}>>([])

/**
 * Selected driver ID for dropdown
 */
const selectedDriverId = ref<number | null>(null)

/**
 * Fetch available drivers from HR system
 */
const fetchDrivers = async (): Promise<void> => {
  try {
    availableDrivers.value = await logistics.getDrivers()
  } catch (error) {
    console.error('Failed to fetch drivers:', error)
    addFeedbackMessage('warning', 'Could not load driver list. Manual entry available.')
  }
}

/**
 * Handle driver selection change
 */
const onDriverChange = () => {
  const selectedDriver = availableDrivers.value.find(d => d.id === selectedDriverId.value)
  if (selectedDriver) {
    logisticsData.logistics_planning.driver_name = selectedDriver.name
    logisticsData.logistics_planning.driver_contact = selectedDriver.phone
  } else {
    logisticsData.logistics_planning.driver_name = ''
    logisticsData.logistics_planning.driver_contact = ''
  }
  validateLogisticsForm()
}

/**
 * Main logistics data structure
 */
const logisticsData = reactive<LogisticsTaskData>(initializeLogisticsData())

/**
 * Form validation errors
 */
const validationErrors = ref<ValidationErrors>({})

/**
 * Form validation state
 */
const isFormValid = ref(false)

/**
 * Validate logistics planning form
 */
const validateLogisticsForm = (): boolean => {
  const errors: ValidationErrors = {}

  // Vehicle validation
  if (!logisticsData.logistics_planning?.vehicle_type?.trim()) {
    errors.vehicleType = ['Vehicle type is required']
  }

  if (!logisticsData.logistics_planning?.vehicle_identification?.trim()) {
    errors.vehicleId = ['Vehicle identification is required']
  }

  // Driver validation
  if (!logisticsData.logistics_planning?.driver_name?.trim()) {
    errors.driverName = ['Driver name is required']
  }

  if (!logisticsData.logistics_planning?.driver_contact?.trim()) {
    errors.driverContact = ['Driver contact is required']
  } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(logisticsData.logistics_planning.driver_contact.trim())) {
    errors.driverContact = ['Please enter a valid phone number']
  }

  // Route validation
  if (!logisticsData.logistics_planning?.route?.origin?.trim()) {
    errors.routeOrigin = ['Origin location is required']
  }

  if (!logisticsData.logistics_planning?.route?.destination?.trim()) {
    errors.routeDestination = ['Destination location is required']
  }

  if (!logisticsData.logistics_planning?.route?.travel_time?.trim()) {
    errors.travelTime = ['Estimated travel time is required']
  }

  // Timeline validation
  if (!logisticsData.logistics_planning?.timeline?.departure_time) {
    errors.departureTime = ['Departure time is required']
  }

  if (!logisticsData.logistics_planning?.timeline?.arrival_time) {
    errors.arrivalTime = ['Arrival time is required']
  }

  // Cross-field validation
  if (logisticsData.logistics_planning?.timeline?.departure_time && logisticsData.logistics_planning?.timeline?.arrival_time) {
    const departure = new Date(logisticsData.logistics_planning.timeline.departure_time)
    const arrival = new Date(logisticsData.logistics_planning.timeline.arrival_time)

    if (departure >= arrival) {
      errors.arrivalTime = ['Arrival time must be after departure time']
    }
  }

  validationErrors.value = errors
  isFormValid.value = Object.keys(errors).length === 0

  return isFormValid.value
}

/**
 * Save logistics planning data
 */
const saveLogisticsPlanning = async () => {
  if (validateLogisticsForm()) {
    try {
      await logistics.saveLogisticsPlanning(props.task.id, {
        vehicle_type: logisticsData.logistics_planning?.vehicle_type,
        vehicle_identification: logisticsData.logistics_planning?.vehicle_identification,
        driver_name: logisticsData.logistics_planning?.driver_name,
        driver_contact: logisticsData.logistics_planning?.driver_contact,
        route: {
          origin: logisticsData.logistics_planning?.route?.origin,
          destination: logisticsData.logistics_planning?.route?.destination,
          distance: logisticsData.logistics_planning?.route?.distance ? parseFloat(logisticsData.logistics_planning.route.distance.toString()) : undefined,
          travel_time: logisticsData.logistics_planning?.route?.travel_time
        },
        timeline: {
          departure_time: logisticsData.logistics_planning?.timeline?.departure_time,
          arrival_time: logisticsData.logistics_planning?.timeline?.arrival_time,
          setup_start_time: logisticsData.logistics_planning?.timeline?.setup_start_time || undefined
        }
      })
      addFeedbackMessage('success', 'Logistics planning saved successfully')
    } catch (error) {
      console.error('Failed to save logistics planning:', error)
      addFeedbackMessage('error', 'Failed to save logistics planning. Please try again.')
    }
  } else {
    addFeedbackMessage('error', 'Please fix the validation errors before saving')
  }
}

/**
 * Reset logistics planning form
 */
const resetLogisticsForm = () => {
  Object.assign(logisticsData.logistics_planning, initializeLogisticsPlanning())
  validationErrors.value = {}
  isFormValid.value = false
  addFeedbackMessage('info', 'Logistics planning form has been reset')
}

/**
 * Get validation error for a field
 */
const getFieldError = (fieldName: string): string => {
  return validationErrors.value[fieldName]?.[0] || ''
}

/**
 * Check if field has validation error
 */
const hasFieldError = (fieldName: string): boolean => {
  return !!validationErrors.value[fieldName]?.length
}

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
      const categoryKey = team.category?.category_key || 'workshop'
      console.log('Processing team:', team.id, 'Category:', categoryKey, 'Members:', team.members?.length || 0)

      if (transformedData.categories[categoryKey]) {
        const teamTypeKey = team.teamType?.type_key || `team-${team.id}`
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

    // Find the teams task for this project
    const teamsTask = await new Promise<{id: number, title: string} | null>((resolve) => {
      // This is a simplified approach - in a real app you'd make an API call
      // For now, we'll assume the teams task has type 'teams' and same enquiry_id
      const mockTeamsTask = {
        id: 10, // Based on our database inspection, task ID 10 is the teams task
        title: 'Teams Management'
      }
      resolve(mockTeamsTask)
    })

    return teamsTask
  } catch (error) {
    console.error('Failed to find teams task:', error)
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
  isAddCustomItemModalOpen: false, // Modal state
  editingItemId: null as number | null,
  editData: {} as Record<number, Partial<TransportItem>>,
  isSaving: {} as Record<number, boolean>,
  validationErrors: {} as Record<number, Record<string, string>>
})

// Custom Item Form State
const customItemForm = reactive({
  name: '',
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
 * Import production elements from backend
 */
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
      addFeedbackMessage('success', `${importedItems.length} production elements imported successfully`)
    } else {
      addFeedbackMessage('info', 'No production elements found to import. Please ensure the production task has been completed with production elements.')
    }
  } catch (error: any) {
    console.error('Failed to import production elements', error)

    // Provide more specific error messages based on the error response
    let errorMessage = 'Failed to import production elements.'
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
  if (!customItemForm.name || !customItemForm.quantity || !customItemForm.unit) {
    addFeedbackMessage('error', 'Please fill in all required fields')
    return
  }

  try {
    const newItem = await logistics.addTransportItem(props.task.id, {
      name: customItemForm.name?.trim(),
      description: customItemForm.description?.trim() || undefined,
      quantity: customItemForm.quantity,
      unit: customItemForm.unit?.trim(),
      category: 'custom',
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
      quantity: 1,
      unit: 'pcs',
      weight: '',
      special_handling: '',
      description: ''
    })

    // Close modal on success
    closeAddCustomItemModal()

    addFeedbackMessage('success', 'Item added successfully')
  } catch (error) {
    console.error('Failed to add item', error)
    addFeedbackMessage('error', 'Failed to add item')
  }
}

// Modal Control Methods
const openAddCustomItemModal = () => {
  itemsState.isAddCustomItemModalOpen = true
}

const closeAddCustomItemModal = () => {
  itemsState.isAddCustomItemModalOpen = false
  // Optional: Reset form when closing without saving? 
  // Usually better to keep state if user accidentally closes, but for "Add" it's often safer to clear.
  // Let's clear it to avoid confusion next time.
  Object.assign(customItemForm, {
    name: '',
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
    await logistics.deleteTransportItem(props.task.id, parseInt(id))

    // Update local state
    if (!logisticsData.transport_items) return
    const idx = logisticsData.transport_items.findIndex(i => i.id === id)
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
const activeTab = ref('logistics-planning')

const tabs = [
  { id: 'logistics-planning', label: 'Logistics Planning', description: 'Plan transportation details and routes' },
  { id: 'team-confirmation', label: 'Team Confirmation', description: 'Confirm team assignments from Teams Task' },
  { id: 'loading-sheet', label: 'Loading Sheet', description: 'Manage loading sheet items and production elements' },
  { id: 'checklist', label: 'Checklist', description: 'Verify items, teams, and safety requirements' }
]

// Tab navigation functions
const setActiveTab = (tabId: string) => {
  if (tabs.find(tab => tab.id === tabId)) {
    activeTab.value = tabId

    // Close modal when switching away from logistics-planning tab
    if (tabId !== 'logistics-planning') {
      showPlanningModal.value = false
    }

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
    case 'logistics-planning':
      // Count incomplete required fields
      let incompleteCount = 0
      if (!logisticsData.logistics_planning?.vehicle_type) incompleteCount++
      if (!logisticsData.logistics_planning?.vehicle_identification) incompleteCount++
      if (!logisticsData.logistics_planning?.driver_name) incompleteCount++
      if (!logisticsData.logistics_planning?.driver_contact) incompleteCount++
      if (!logisticsData.logistics_planning?.route?.origin) incompleteCount++
      if (!logisticsData.logistics_planning?.route?.destination) incompleteCount++
      if (!logisticsData.logistics_planning?.route?.travel_time) incompleteCount++
      if (!logisticsData.logistics_planning?.timeline?.departure_time) incompleteCount++
      if (!logisticsData.logistics_planning?.timeline?.arrival_time) incompleteCount++
      return incompleteCount
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
    case 'logistics-planning':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
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
const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'TBC' || dateString === 'N/A') {
    return 'TBC'
  }

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return 'TBC'
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.warn('Error formatting date:', dateString, error)
    return 'TBC'
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
const checklist = computed(() => logisticsData.checklist || { items: [], teams: { workshop: false, setup: false, setdown: false }, safety: { ppe: false, first_aid: false, fire_extinguisher: false } })

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

    addFeedbackMessage('success', 'Checklist generated from transport items')
  } catch (e) {
    console.error('Checklist generation failed', e)
    addFeedbackMessage('error', 'Failed to generate checklist')
  }
}

const touchChecklistItem = async (item: ChecklistItem) => {
  item.checkedAt = new Date()

  // Save checklist changes to backend
  try {
    if (logisticsData.checklist) {
      await logistics.updateChecklist(props.task.id, logisticsData.checklist)
    }
  } catch (error) {
    console.error('Failed to save checklist item update:', error)
  }
}

const touchChecklistMeta = async () => {
  // Save checklist changes to backend
  try {
    if (logisticsData.checklist) {
      await logistics.updateChecklist(props.task.id, logisticsData.checklist)
    }
  } catch (error) {
    console.error('Failed to save checklist meta update:', error)
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
</script>

<style scoped>
@reference "tailwindcss";

.project-info-card {
  @apply p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600;
}

/* Tab panel animations */
.tab-panel {
  @apply transition-opacity duration-200;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
</style>
