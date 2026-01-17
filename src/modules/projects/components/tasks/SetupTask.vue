<template>
  <div
    class="setup-task bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Premium Project Information Section -->
    <div class="mb-8">
      <div class="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl p-8 border border-slate-100 dark:border-slate-800 group">
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
    </div>

    <!-- Feedback Messages -->
    <div v-if="feedbackMessages.length > 0" class="mb-6 space-y-2">
      <div v-for="message in feedbackMessages" :key="message.id" :class="[
        'flex items-center justify-between p-3 rounded-lg border text-sm',
        {
          'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200': message.type === 'success',
          'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200': message.type === 'error',
          'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200': message.type === 'warning',
          'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200': message.type === 'info'
        }
      ]">
        <div class="flex items-center space-x-2">
          <!-- Success Icon -->
          <svg v-if="message.type === 'success'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <!-- Error Icon -->
          <svg v-else-if="message.type === 'error'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <!-- Warning Icon -->
          <svg v-else-if="message.type === 'warning'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
            </path>
          </svg>
          <!-- Info Icon -->
          <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ message.message }}</span>
        </div>
        <button @click="removeFeedbackMessage(message.id)"
          class="text-current hover:opacity-70 transition-opacity p-1 rounded-md" :aria-label="'Dismiss message'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto" role="tablist"
        aria-label="Setup task navigation">
        <button v-for="(tab, index) in tabs" :key="tab.id" @click="setActiveTab(tab.id)"
          @keydown="handleTabKeydown($event, index)" :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap min-w-0',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-700',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm transform scale-105'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:scale-102'
          ]" :aria-selected="activeTab === tab.id" :aria-controls="`tab-panel-${tab.id}`" :id="`tab-${tab.id}`"
          role="tab" :tabindex="activeTab === tab.id ? 0 : -1">
          <span class="mr-2 text-base transition-transform duration-200" :class="{ 'scale-110': activeTab === tab.id }">
            {{ tab.icon }}
          </span>
          <span class="truncate">{{ tab.label }}</span>
          <!-- Tab indicator badges -->
          <span v-if="getTabBadgeCount(tab.id) > 0"
            class="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
            :class="getTabBadgeClass(tab.id)">
            {{ getTabBadgeCount(tab.id) }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content Container -->
    <div class="tab-content-container">
      <!-- Documentation Tab -->
      <div v-show="activeTab === 'documentation'" class="documentation-section tab-panel"
        :id="`tab-panel-documentation`" role="tabpanel" :aria-labelledby="`tab-documentation`"
        :class="{ 'animate-fade-in': activeTab === 'documentation' }">
        <!-- Quick Notes Section [Always visible, auto-save] -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📝</span>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notes</h3>
            </div>
            <span v-if="backendLoading" class="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              <svg class="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Saving...
            </span>
            <span v-else-if="lastSaved" class="text-xs text-gray-500 dark:text-gray-400">
              Saved {{ lastSaved }}
            </span>
          </div>

          <textarea v-model="localNotes.setupNotes" @blur="autoSaveNotes" rows="6" :readonly="readonly"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            :placeholder="readonly ? 'No notes recorded.' : 'Record setup progress, observations, and any issues encountered...\n\nAuto-saves when you click outside this box.'"></textarea>
        </div>

        <!-- Photo Upload Section -->
        <div v-if="!readonly">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📸</span>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Photos</h3>
              <span
                class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {{ displayData?.documentation.photos?.length || 0 }}
              </span>
            </div>
          </div>

          <!-- Drag & Drop Upload Area -->
          <div @drop.prevent="handlePhotoDrop" @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" :class="[
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            ]" @click="triggerPhotoUpload">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
              </path>
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 10MB</p>
          </div>

          <!-- Hidden file input -->
          <input ref="photoInputRef" type="file" multiple accept="image/*" @change="handlePhotoSelect" class="hidden" />

          <!-- Uploading Progress -->
          <div v-if="uploadingCount > 0"
            class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-center space-x-3">
              <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span class="text-sm text-blue-800 dark:text-blue-200">Uploading {{ uploadingCount }} photo{{
                uploadingCount > 1 ? 's' : '' }}...</span>
            </div>
          </div>

          <!-- Photo Grid -->
          <div v-if="displayData?.documentation.photos?.length"
            class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="photo in displayData.documentation.photos" :key="photo.id" class="relative group">
              <img :src="photo.url" :alt="photo.description || 'Setup photo'"
                class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-transform hover:scale-105"
                @click="openImageModal(photo)" @error="handleImageError" />

              <!-- Delete button overlay -->
              <button v-if="!readonly" @click.stop="confirmDeletePhoto(photo.id)"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-all shadow-lg"
                title="Delete photo">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <!-- Download button overlay -->
              <button @click.stop="downloadPhoto(photo)"
                class="absolute top-2 right-12 opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full transition-all shadow-lg"
                title="Download photo">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>

              <!-- Photo info -->
              <div class="mt-1.5">
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ photo.uploaded_at ? new Date(photo.uploaded_at).toLocaleDateString() : 'Unknown date' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty state with helpful message -->
          <div v-else-if="!uploadingCount" class="mt-6 text-center py-8">
            <p class="text-sm text-gray-500 dark:text-gray-400">No photos yet. Upload some to document your setup!</p>
          </div>
        </div>

        <!-- Readonly Photo Grid (when readonly is true) -->
        <div v-else>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xl">📸</span>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Photos</h3>
              <span
                class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {{ displayData?.documentation?.photos?.length || 0 }}
              </span>
            </div>
          </div>

          <div v-if="displayData?.documentation?.photos?.length"
            class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="photo in displayData.documentation.photos" :key="photo.id" class="relative group">
              <img :src="photo.url" :alt="photo.description || 'Setup photo'"
                class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer transition-transform hover:scale-105"
                @click="openImageModal(photo)" @error="handleImageError" />
              
              <!-- Download button overlay (readonly view) -->
              <button @click.stop="downloadPhoto(photo)"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full transition-all shadow-lg"
                title="Download photo">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
              
              <div class="mt-1.5">
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ photo.uploaded_at ? new Date(photo.uploaded_at).toLocaleDateString() : 'Unknown date' }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="mt-6 text-center py-8">
            <p class="text-sm text-gray-500 dark:text-gray-400">No photos uploaded.</p>
          </div>
        </div>
      </div>

      <!-- Issues Tab -->
      <div v-show="activeTab === 'issues'" class="issues-section tab-panel" :id="`tab-panel-issues`" role="tabpanel"
        :aria-labelledby="`tab-issues`" :class="{ 'animate-fade-in': activeTab === 'issues' }">
        <!-- Issues Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Issues Tracking</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track and manage setup-related issues
            </p>
          </div>
          <div class="flex space-x-3">
            <button v-if="!editModes.issues && !readonly" @click="editModes.issues = true"
              class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Edit
            </button>
            <button v-if="editModes.issues" @click="handleSaveIssues"
              class="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              Save
            </button>
            <button v-if="editModes.issues" @click="editModes.issues = false"
              class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>

        <!-- Issues Content -->
        <div class="space-y-6">
          <!-- Add Issue Form -->
          <div v-if="editModes.issues"
            class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-xl">➕</span>
              <h4 class="text-md font-medium text-gray-900 dark:text-white">Report New Issue</h4>
            </div>

            <form @submit.prevent="handleAddIssue" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issue Title <span class="text-red-500">*</span>
                  </label>
                  <input v-model="newIssue.title" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Brief issue description" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select v-model="newIssue.category"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                    <option value="equipment">Equipment</option>
                    <option value="venue">Venue</option>
                    <option value="team">Team</option>
                    <option value="safety">Safety</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input v-model="newIssue.priority" type="radio" value="low"
                      class="text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Low</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="newIssue.priority" type="radio" value="medium"
                      class="text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Medium</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="newIssue.priority" type="radio" value="high"
                      class="text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">High</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="newIssue.priority" type="radio" value="critical"
                      class="text-blue-600 focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Critical</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea v-model="newIssue.description" rows="3" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Detailed description of the issue..."></textarea>
              </div>

              <div class="flex justify-end">
                <button type="submit"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Add Issue
                </button>
              </div>
            </form>
          </div>

          <!-- Issues List -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="text-xl">📋</span>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Issues List</h4>
                <span
                  class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">{{
                    displayData?.issues?.length || 0 }}</span>
              </div>

              <div class="flex space-x-2">
                <select v-model="issuesFilter.status"
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select v-model="issuesFilter.priority"
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div v-if="filteredIssues.length === 0" class="text-center py-8">
              <div v-if="!displayData?.issues?.length" class="text-gray-500 dark:text-gray-400">
                <div class="mb-4">
                  <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0L12 20.343l-2.828-2.828a4 4 0 015.656-5.657zm5.656 0L12 20.343l2.828 2.828a4 4 0 01-5.656-5.657zM21 12h-6a4 4 0 00-4 4v8a4 4 0 004 4h6m-6-8h6m6 0v8a4 4 0 01-4 4h-6">
                    </path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No issues reported yet</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                  Issues encountered during setup will be tracked here.
                </p>
                <button v-if="editModes.issues" @click="() => { /* Scroll to add issue form */ }"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Report First Issue
                </button>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400">
                No issues found matching the current filters.
              </div>
            </div>

            <div v-else class="space-y-4">
              <div v-for="issue in filteredIssues" :key="issue.id"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ issue.title }}</h5>
                      <span :class="getPriorityClass(issue.priority)" class="px-2 py-0.5 text-xs rounded-full">
                        {{ issue.priority }}
                      </span>
                      <span :class="getStatusClass(issue.status)" class="px-2 py-0.5 text-xs rounded-full">
                        {{ issue.status.replace('_', ' ') }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ issue.description }}</p>
                    <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ issue.category }}</span>
                      <span>Reported: {{ formatDate(issue.reported_at) }}</span>
                      <span v-if="issue.resolved_at">Resolved: {{ formatDate(issue.resolved_at) }}</span>
                    </div>
                  </div>

                  <div class="flex space-x-2 ml-4">
                    <select v-model="issue.status" @change="handleUpdateIssueStatus(issue as SetupIssue)"
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <button v-if="!readonly" @click="handleRemoveIssue(issue.id.toString())"
                      class="text-gray-400 hover:text-red-500 p-1 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-if="issue.status === 'resolved'" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resolution Notes
                  </label>
                  <textarea v-model="issue.resolution" rows="2"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe how the issue was resolved..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Status and Actions -->
    <div v-if="!readonly" class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span :class="getStatusColor(task.status)" class="px-3 py-1.5 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex flex-wrap gap-2">
          <button v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
            @click="showSkipModal = true"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm">
            Skip Task
          </button>

          <button v-if="['skipped', 'completed'].includes(task.status)"
            @click="$emit('update-status', 'pending')"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm">
            {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
          </button>

          <button v-if="task.status !== 'completed' && task.status !== 'cancelled' && task.status !== 'skipped'"
            @click="$emit('update-status', 'completed')"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Mark Complete</span>
          </button>

          <button v-if="task.status !== 'in_progress' && task.status !== 'completed' && task.status !== 'cancelled' && task.status !== 'skipped'"
            @click="$emit('update-status', 'in_progress')"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm">Set
            In Progress</button>

          <button v-if="task.status !== 'pending' && task.status !== 'completed' && task.status !== 'cancelled' && task.status !== 'skipped'"
            @click="$emit('update-status', 'pending')"
            class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm">Set
            Pending</button>

          <button v-if="task.status !== 'cancelled' && task.status !== 'completed' && task.status !== 'skipped'" @click="handleCancelTask"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors font-medium shadow-sm">Cancel
            Task</button>
        </div>

        <div v-if="task.status === 'completed'"
          class="flex items-center justify-center sm:justify-start space-x-2 text-green-600 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">Task Completed</span>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="imageModal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full p-4">
        <!-- Close button -->
        <button @click="closeImageModal"
          class="absolute top-2 right-2 z-10 text-white hover:text-gray-300 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Image -->
        <img v-if="imageModal.currentImage" :src="imageModal.currentImage.url"
          :alt="imageModal.currentImage.description || 'Setup photo'"
          class="max-w-full max-h-full object-contain rounded-lg" @click.stop />

        <!-- Image info -->
        <div v-if="imageModal.currentImage" class="mt-4 text-white text-center">
          <p class="text-lg font-medium">{{ imageModal.currentImage.description || 'Setup Photo' }}</p>
          <p class="text-sm text-gray-300">{{ imageModal.currentImage.filename }}</p>
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
            <button @click="handleSkipTask" :disabled="!skipReason.trim() ||isSkipping" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{{ isSkipping ? 'Skipping...' : 'Confirm Skip' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { useSetup } from '../../composables/useSetup'
import imageCompression from 'browser-image-compression'

/**
 * Props interface for the SetupTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Whether the component is in read-only mode */
  readonly?: boolean
  /** Initial data to populate the component (avoids fetching) */
  initialData?: any
  /** Initial tab to display */
  initialTab?: string | null
}

/**
 * Events emitted by the SetupTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  initialData: null,
  initialTab: null
})
const emit = defineEmits<Emits>()

// Skip Task Logic
import api from '@/plugins/axios'

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

/**
 * Project information structure for the setup task
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
 * Photo record structure
 */
interface PhotoRecord {
  id: string
  file: File
  url: string
  filename: string
  description: string
  timestamp: Date
  uploadedBy: string
}

/**
 * Documentation data structure
 */
interface DocumentationData {
  photos: PhotoRecord[]
  setupNotes: string
  completionNotes: string
}

/**
 * Issue structure
 */
interface SetupIssue {
  id: string
  title: string
  description: string
  category: 'equipment' | 'venue' | 'team' | 'safety' | 'other'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved'
  reportedBy: string
  reportedAt: Date
  assignedTo?: string
  resolvedAt?: Date
  resolution?: string
  photos?: PhotoRecord[]
}

/**
 * Issues data structure
 */
interface IssuesData {
  issues: SetupIssue[]
}

/**
 * Main setup task data structure
 */
interface SetupTaskData {
  /** Project information */
  projectInfo: ProjectInfo
  /** Documentation data */
  documentation: DocumentationData
  /** Issues data */
  issues: IssuesData
}

// Initialize the setup composable
const {
  setupData: backendSetupData,
  loading: backendLoading,
  error: backendError,
  fetchSetupData,
  saveDocumentation: saveDocumentationBackend,
  uploadPhoto: uploadPhotoBackend,
  deletePhoto: deletePhotoBackend,
  addIssue: addIssueBackend,
  updateIssue: updateIssueBackend,
  deleteIssue: deleteIssueBackend,
  photosCount,
  issuesCount,
  openIssuesCount
} = useSetup()

// Component setup
const activeTab = ref(props.initialTab || 'documentation')

// Watch initialTab to update activeTab when it changes while open
watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})

const tabs = [
  { id: 'documentation', label: 'Documentation', icon: '📸', description: 'Upload photos and record setup notes' },
  { id: 'issues', label: 'Issues', icon: '🚨', description: 'Track and manage setup-related issues' }
]

/**
 * User feedback messages
 */
const feedbackMessages = ref<FeedbackMessage[]>([])

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
 * Auto-save tracking
 */
const lastSaved = ref<string>('')
const saveTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

/**
 * Photo upload state
 */
const isDragging = ref(false)
const uploadingCount = ref(0)

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
      projectId: enquiry?.job_number || enquiry?.enquiry_number || 'N/A',
      enquiryTitle: enquiry?.title || 'Untitled Project',
      clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'N/A',
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
 * Initialize setup data with project info
 */
const initializeSetupData = (): SetupTaskData => {
  try {
    return {
      projectInfo: extractProjectInfo(),
      documentation: {
        photos: [],
        setupNotes: '',
        completionNotes: ''
      },
      issues: {
        issues: []
      }
    }
  } catch (error) {
    console.error('Failed to initialize setup data:', error)
    addFeedbackMessage('error', 'Failed to initialize setup management. Please refresh the page.')

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
      documentation: {
        photos: [],
        setupNotes: '',
        completionNotes: ''
      },
      issues: {
        issues: []
      }
    }
  }
}

/**
 * Main setup data structure
 */
const setupData = reactive<SetupTaskData>(initializeSetupData())

/**
 * New issue form data
 */
const newIssue = reactive({
  title: '',
  description: '',
  category: 'equipment' as SetupIssue['category'],
  priority: 'medium' as SetupIssue['priority']
})

/**
 * Issues filter state
 */
const issuesFilter = reactive({
  status: 'all',
  priority: 'all'
})

/**
 * Local notes state for editing
 */
const localNotes = reactive({
  setupNotes: '',
  completionNotes: ''
})

/**
 * Image modal state
 */
const imageModal = reactive({
  isOpen: false,
  currentImage: null as any
})

/**
 * Edit mode states
 */
const editModes = reactive({
  documentation: false,
  issues: false
})

/**
 * Photo input ref
 */
const photoInputRef = ref<HTMLInputElement | null>(null)

/**
 * Display data - computed property that returns initialData if provided, otherwise backendSetupData
 * This allows the component to work in both readonly mode (with initialData) and normal mode (fetching data)
 */
const displayData = computed(() => {
  if (props.initialData) {
    return props.initialData
  }
  return backendSetupData.value
})

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
    case 'documentation':
      return backendSetupData.value?.documentation.photos?.length || 0
    case 'issues':
      return backendSetupData.value?.issues?.filter((issue: any) => issue.status !== 'resolved').length || 0
    default:
      return 0
  }
}

const getTabBadgeClass = (tabId: string): string => {
  const count = getTabBadgeCount(tabId)
  if (count === 0) return ''

  // Different colors for different tab types
  switch (tabId) {
    case 'documentation':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'issues':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

/**
 * Computed property for project info
 */
const projectInfo = computed(() => setupData.projectInfo)

/**
 * Filtered issues based on current filters
 */
const filteredIssues = computed(() => {
  const issues = displayData.value?.issues || []
  return issues.filter((issue: any) => {
    const statusMatch = issuesFilter.status === 'all' || issue.status === issuesFilter.status
    const priorityMatch = issuesFilter.priority === 'all' || issue.priority === issuesFilter.priority
    return statusMatch && priorityMatch
  })
})

/**
 * Auto-save notes when user leaves textarea
 */
const autoSaveNotes = async () => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value)
  }

  saveTimeout.value = setTimeout(async () => {
    try {
      await saveDocumentationBackend(props.task.id, {
        setup_notes: localNotes.setupNotes,
        completion_notes: localNotes.completionNotes
      })

      // Update saved timestamp
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      lastSaved.value = timeStr

      // Refresh data to sync
      await fetchSetupData(props.task.id)
    } catch (error) {
      console.error('Auto-save failed:', error)
      addFeedbackMessage('error', 'Failed to save notes')
    }
  }, 1000) // Debounce for 1 second
}

/**
 * Trigger photo upload from file input
 */
const triggerPhotoUpload = () => {
  photoInputRef.value?.click()
}

/**
 * Handle drag and drop photo upload
 */
const handlePhotoDrop = async (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files

  if (files) {
    uploadingCount.value = files.length

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          await handlePhotoUpload(file)
        } catch (error) {
          console.error('Failed to upload photo:', error)
        }
      } else {
        addFeedbackMessage('warning', `${file.name} is not an image file`)
      }
    }

    uploadingCount.value = 0
  }
}

/**
 * Confirm and delete a photo
 */
const confirmDeletePhoto = async (photoId: number) => {
  if (confirm('Are you sure you want to delete this photo?')) {
    try {
      await deletePhotoBackend(props.task.id, photoId)
      await fetchSetupData(props.task.id)
      addFeedbackMessage('success', 'Photo deleted successfully')
    } catch (error) {
      console.error('Failed to delete photo:', error)
      addFeedbackMessage('error', 'Failed to delete photo')
    }
  }
}

/**
 * Handle photo file selection
 */
const handlePhotoSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    uploadingCount.value = files.length

    for (const file of Array.from(files)) {
      try {
        await handlePhotoUpload(file)
      } catch (error) {
        console.error('Failed to upload photo:', error)
      }
    }

    uploadingCount.value = 0
  }
  // Reset input
  target.value = ''
}

/**
 * Handle photo upload using backend
 */
const handlePhotoUpload = async (file: File) => {
  try {
    // Show compression feedback
    addFeedbackMessage('info', `Compressing "${file.name}"...`)

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    let uploadFile = file
    try {
      const compressedBlob = await imageCompression(file, options)
      uploadFile = new File([compressedBlob], file.name, { type: file.type })
    } catch (compressionError) {
      console.warn('Compression failed, uploading original:', compressionError)
    }

    const photo = await uploadPhotoBackend(props.task.id, uploadFile)
    // Update local state by refetching data
    await fetchSetupData(props.task.id)
    addFeedbackMessage('success', `Photo "${file.name}" uploaded successfully`)
  } catch (error) {
    console.error('Failed to upload photo:', error)
    addFeedbackMessage('error', 'Failed to upload photo. Please try again.')
  }
}

/**
 * Remove a photo from documentation
 */
const handleRemovePhoto = async (photoId: number) => {
  try {
    await deletePhotoBackend(props.task.id, photoId)
    // Update local state by refetching data
    await fetchSetupData(props.task.id)
    addFeedbackMessage('info', 'Photo removed')
  } catch (error) {
    console.error('Failed to delete photo:', error)
    addFeedbackMessage('error', 'Failed to delete photo. Please try again.')
  }
}

/**
 * Update photo description
 */
const updatePhotoDescription = async (photo: any) => {
  // For now, just log. We can implement photo description updates later if needed
  console.log('Photo description updated:', photo.id, photo.description)
}

/**
 * Open image in full screen modal
 */
const openImageModal = (photo: any) => {
  imageModal.currentImage = photo
  imageModal.isOpen = true
}

/**
 * Close image modal
 */
const closeImageModal = () => {
  imageModal.isOpen = false
  imageModal.currentImage = null
}

/**
 * Download a photo
 */
const downloadPhoto = async (photo: any) => {
  try {
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = photo.url
    link.download = photo.filename || `setup-photo-${photo.id}.jpg`
    link.target = '_blank'
    
    // For cross-origin images, we need to fetch as blob first
    if (photo.url.startsWith('http') && !photo.url.includes(window.location.hostname)) {
      const response = await fetch(photo.url, { mode: 'cors' })
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      link.href = blobUrl
    }
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link)
      if (link.href.startsWith('blob:')) {
        window.URL.revokeObjectURL(link.href)
      }
    }, 100)
    
    addFeedbackMessage('success', 'Photo downloaded successfully')
  } catch (error) {
    console.error('Failed to download photo:', error)
    addFeedbackMessage('error', 'Failed to download photo. Please try again.')
  }
}

/**
 * Handle image loading error
 */
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error('Failed to load image:', img.src)
  // Could set a fallback image here if needed
  // img.src = '/path/to/fallback-image.png'
}

/**
 * Save documentation data
 */
const handleSaveDocumentation = async () => {
  try {
    await saveDocumentationBackend(props.task.id, {
      setup_notes: localNotes.setupNotes,
      completion_notes: localNotes.completionNotes
    })

    // Update backend data after successful save
    if (backendSetupData.value) {
      backendSetupData.value.documentation.setup_notes = localNotes.setupNotes
      backendSetupData.value.documentation.completion_notes = localNotes.completionNotes
    }

    addFeedbackMessage('success', 'Documentation saved successfully')
  } catch (error) {
    console.error('Failed to save documentation:', error)
    addFeedbackMessage('error', 'Failed to save documentation. Please try again.')
  }
}

/**
 * Add a new issue
 */
const handleAddIssue = async () => {
  if (!newIssue.title.trim() || !newIssue.description.trim()) {
    addFeedbackMessage('warning', 'Please provide both title and description for the issue')
    return
  }

  try {
    await addIssueBackend(props.task.id, {
      title: newIssue.title.trim(),
      description: newIssue.description.trim(),
      category: newIssue.category,
      priority: newIssue.priority
    })

    // Reset form
    newIssue.title = ''
    newIssue.description = ''
    newIssue.category = 'equipment'
    newIssue.priority = 'medium'

    addFeedbackMessage('success', 'Issue reported successfully')
  } catch (error) {
    console.error('Failed to add issue:', error)
    addFeedbackMessage('error', 'Failed to add issue. Please try again.')
  }
}

/**
 * Update issue status
 */
const handleUpdateIssueStatus = async (issue: SetupIssue) => {
  try {
    await updateIssueBackend(props.task.id, parseInt(issue.id), {
      status: issue.status,
      resolution: issue.resolution
    })

    // Update local state
    if (issue.status === 'resolved' && !issue.resolvedAt) {
      issue.resolvedAt = new Date()
    } else if (issue.status !== 'resolved') {
      issue.resolvedAt = undefined
      issue.resolution = undefined
    }

    addFeedbackMessage('success', 'Issue status updated successfully')
  } catch (error) {
    console.error('Failed to update issue status:', error)
    addFeedbackMessage('error', 'Failed to update issue status. Please try again.')
  }
}

/**
 * Remove an issue
 */
const handleRemoveIssue = async (issueId: string) => {
  try {
    await deleteIssueBackend(props.task.id, parseInt(issueId))
    // Update local state
    const index = setupData.issues.issues.findIndex(i => i.id === issueId)
    if (index >= 0) {
      setupData.issues.issues.splice(index, 1)
      addFeedbackMessage('info', 'Issue removed')
    }
  } catch (error) {
    console.error('Failed to delete issue:', error)
    addFeedbackMessage('error', 'Failed to delete issue. Please try again.')
  }
}

/**
 * Save issues data (for resolved issues with resolution notes)
 */
const handleSaveIssues = async () => {
  try {
    // Save any issues that have been updated
    for (const issue of setupData.issues.issues) {
      if (issue.status === 'resolved' && issue.resolution) {
        await updateIssueBackend(props.task.id, parseInt(issue.id), {
          status: issue.status,
          resolution: issue.resolution
        })
      }
    }
    addFeedbackMessage('success', 'Issues saved successfully')
  } catch (error) {
    console.error('Failed to save issues:', error)
    addFeedbackMessage('error', 'Failed to save issues. Please try again.')
  }
}

/**
 * Get priority class for styling
 */
const getPriorityClass = (priority: string): string => {
  const classes: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[priority] || classes.medium
}

/**
 * Get status class for styling
 */
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[status] || classes.open
}

/**
 * Format date for display
 */
const formatDate = (dateString: string | Date): string => {
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
 * Format currency for display
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
        Object.assign(setupData.projectInfo, newProjectInfo)
      }
    } catch (error) {
      console.error('Error updating task data:', error)
      addFeedbackMessage('error', 'Failed to update project information')
    }
  },
  { deep: true }
)

/**
 * Sync local notes with backend data when it loads
 */
watch(
  () => backendSetupData.value?.documentation,
  (documentation) => {
    if (documentation) {
      localNotes.setupNotes = documentation.setup_notes || ''
      localNotes.completionNotes = documentation.completion_notes || ''
    }
  },
  { immediate: true }
)

/**
 * Handle cancel task
 */
const handleCancelTask = () => {
  if (confirm('Cancel this task? This action can be changed later.')) {
    emit('update-status', 'cancelled')
  }
}

/**
 * Initialize data
 */
onMounted(async () => {
  // If initial data is provided, use it instead of fetching
  if (props.initialData) {
    // Populate backendSetupData directly if possible, or manually set local state
    // Since useSetup composable manages backendSetupData, we might need to update it
    // However, backendSetupData is readonly from useSetup. 
    // We need to check if useSetup allows setting data or if we need to bypass it.

    // Actually, useSetup returns refs that we can't easily override if they are readonly.
    // But wait, backendSetupData is likely a ref from the composable.
    // Let's check useSetup implementation. If it exposes a way to set data, good.
    // If not, we might need to rely on the fact that we are in readonly mode and
    // just use props.initialData for display where appropriate.

    // For now, let's assume we can't easily inject into useSetup's state without modifying it.
    // Instead, we should update our local state to reflect initialData.

    // Update project info
    projectInfoState.value.isLoading = false

    // Update local notes
    if (props.initialData.documentation) {
      localNotes.setupNotes = props.initialData.documentation.setup_notes || ''
      localNotes.completionNotes = props.initialData.documentation.completion_notes || ''
    }

    // For photos and issues, the template uses backendSetupData.
    // We need to make sure backendSetupData reflects props.initialData.
    // Since we can't write to backendSetupData (it's likely a readonly ref from useSetup),
    // we might need to modify useSetup or shadow the data.

    // A better approach: The template should use a computed property that merges/selects
    // between backendSetupData and props.initialData.
  } else {
    // Fetch data if not provided
    await fetchSetupData(props.task.id)

    // Initialize local notes from fetched data
    if (backendSetupData.value?.documentation) {
      localNotes.setupNotes = backendSetupData.value.documentation.setup_notes || ''
      localNotes.completionNotes = backendSetupData.value.documentation.completion_notes || ''
    }
  }
})

// Watch for backend data changes to update local notes (only if not readonly/initialData)
watch(() => backendSetupData.value, (newData) => {
  if (newData?.documentation && !props.initialData) {
    // Only update if we don't have local changes? 
    // Or just initial load.
    if (!localNotes.setupNotes) {
      localNotes.setupNotes = newData.documentation.setup_notes || ''
    }
    if (!localNotes.completionNotes) {
      localNotes.completionNotes = newData.documentation.completion_notes || ''
    }
  }
}, { deep: true })
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
  opacity: 1;
  transform: translateY(0);
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
