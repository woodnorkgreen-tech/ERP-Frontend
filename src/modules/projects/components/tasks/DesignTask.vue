<template>
  <div class="design-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <!-- Header Section - Always visible -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
        
        <!-- Completion Badge -->
        <span
          v-if="readonly || task.status === 'completed'"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Completed
        </span>
      </div>

      <!-- Completion Notice -->
      <div
        v-if="readonly || task.status === 'completed'"
        class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">This task has been completed. You can view all assets below.</span>
        </div>
      </div>

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

      <!-- Tab Navigation - Always visible -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <!-- Upload Tab -->
          <button
            @click="activeTab = 'upload'"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'upload'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <span>Upload</span>
            </span>
          </button>
          
          <button
            @click="activeTab = 'gallery'"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'gallery'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>Gallery ({{ stats.total }})</span>
            </span>
          </button>
          
          <button
            @click="activeTab = 'approvals'"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'approvals'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Approvals</span>
              <span v-if="pendingAssets.length > 0" class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-purple-600 rounded-full">
                {{ pendingAssets.length }}
              </span>
            </span>
          </button>
        </nav>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="isLoadingExistingData || isLoadingAssets" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Loading design assets...</span>
        </div>
      </div>

      <!-- Upload Tab -->
      <div v-show="activeTab === 'upload'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <div class="flex items-center space-x-2 mb-6">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload Design Assets</h3>
        </div>

        <div class="space-y-6">
          <!-- Category Selection -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asset Category
            </label>
            <select
              id="category"
              v-model="uploadData.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="concept">Concept</option>
              <option value="mockup">Mockup</option>
              <option value="artwork">Artwork</option>
              <option value="logo">Logo</option>
              <option value="ui-ux">UI/UX</option>
              <option value="illustration">Illustration</option>
              <option value="prototype">Prototype</option>
              <option value="presentation">Presentation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              v-model="uploadData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe these design assets"
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (Optional)
            </label>
            <input
              id="tags"
              v-model="tagsText"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter tags separated by commas"
              @input="parseTags"
            />
          </div>

          <!-- File Upload Section -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div class="text-center">
              <div v-if="isCompressing" class="py-4">
                <svg class="animate-spin h-8 w-8 mx-auto text-purple-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-sm font-medium text-purple-600">Compressing images...</p>
              </div>
              <div v-else>
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <div class="mt-4">
                  <label for="file-upload" class="cursor-pointer">
                    <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">Click to upload design assets</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple accept=".jpeg,.png,.gif,.webp,.pdf,.ai,.psd,.sketch,.fig,.xd" @change="handleFileUpload" />
                  </label>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, WebP, PDF, AI, PSD, Sketch, Figma, XD up to 50MB each</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Files List -->
          <div v-if="selectedFiles.length > 0" class="space-y-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">Selected Files ({{ selectedFiles.length }})</h4>
            <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-md">
              <div class="flex items-center space-x-3">
                <!-- File type icon -->
                <div v-if="isImageFile(file.type)" class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div v-else-if="file.type.includes('pdf')" class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div v-else class="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ file.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }} • {{ file.type || 'Unknown' }}</p>
                </div>
              </div>
              <button @click="removeFile(index)" class="text-red-500 hover:text-red-700 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="isUploading" class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Uploading...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
            </div>
          </div>

          <!-- Upload Button -->
          <button
            @click="handleUpload"
            :disabled="selectedFiles.length === 0 || isUploading"
            class="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isUploading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
            <span v-else>Upload Selected Files</span>
          </button>
        </div>
      </div>

      <!-- Gallery Tab -->
      <div v-show="activeTab === 'gallery'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-2">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Design Assets Gallery</h3>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ stats.total }} asset{{ stats.total !== 1 ? 's' : '' }}
          </div>
        </div>

        <div v-if="assets.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assets</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading design files.</p>
          <div class="mt-6">
            <button
              @click="activeTab = 'upload'"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Upload Assets
            </button>
          </div>
        </div>

        <!-- Assets Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="asset in assets"
            :key="asset.id"
            class="bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            @click="openPreview(asset)"
          >
            <!-- Asset Preview/Icon -->
            <div class="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
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
                  :alt="asset.name || asset.original_name"
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
              </template>
              
              <!-- PDF Icon -->
              <div v-else-if="isPdfAsset(asset)" class="flex flex-col items-center">
                <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">PDF</span>
              </div>
              
              <!-- Generic File Icon -->
              <div v-else class="flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                </svg>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ asset.category }}</span>
              </div>

              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center space-x-2">
                <button 
                  @click.stop="openPreview(asset)"
                  class="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300"
                  title="Preview"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button
                  @click.stop="deleteAsset(asset)"
                  class="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Asset Info -->
            <div class="p-4">
              <h4 class="font-medium text-gray-900 dark:text-white truncate" :title="asset.name || asset.original_name">
                {{ asset.name || asset.original_name }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ asset.category }}</p>
              
              <!-- Status Badge -->
              <div class="mt-2">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': asset.status === 'pending',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': asset.status === 'approved',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': asset.status === 'rejected',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': asset.status === 'revision',
                  }"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                >
                  {{ asset.status }}
                </span>
              </div>

              <!-- Asset Meta -->
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div>{{ new Date(asset.created_at).toLocaleDateString() }}</div>
                <div v-if="asset.file_size">{{ formatFileSize(asset.file_size) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Approvals Tab  -->
      <div v-show="activeTab === 'approvals'" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <div class="flex items-center space-x-2 mb-6">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Asset Approvals</h3>
        </div>

        <div v-if="pendingAssets.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending approvals</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">All assets have been reviewed.</p>
        </div>

        <!-- Pending Assets List -->
        <div v-else class="space-y-4">
          <div
            v-for="asset in pendingAssets"
            :key="asset.id"
            class="bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 overflow-hidden"
          >
            <div class="flex gap-4 p-4">
              <!-- Asset Thumbnail -->
              <div class="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer relative" @click="openPreview(asset)">
                <template v-if="isImageAsset(asset)">
                  <!-- Loading Placeholder -->
                  <div class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <svg class="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <!-- Actual Image -->
                  <img
                    :src="getAssetUrl(asset)"
                    :alt="asset.name || asset.original_name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform relative z-10"
                    @load="(e) => { const parent = (e.target as HTMLElement)?.parentElement?.querySelector('.absolute'); if (parent) parent.remove(); }"
                    @error="(e) => { 
                      const img = e.target as HTMLImageElement;
                      const parent = img.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class='w-full h-full flex flex-col items-center justify-center text-gray-400'>
                            <svg class='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
                            </svg>
                          </div>
                        `;
                      }
                    }"
                  />
                </template>
                <div v-else-if="isPdfAsset(asset)" class="w-full h-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                  </svg>
                </div>
              </div>

              <!-- Asset Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white truncate">
                      {{ asset.name || asset.original_name }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ asset.category }} • 
                      Uploaded {{ new Date(asset.created_at).toLocaleDateString() }}
                      <span v-if="(asset as any).file_size"> • {{ formatFileSize((asset as any).file_size) }}</span>
                    </p>
                  </div>
                  <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending Review
                  </span>
                </div>
                
                <p v-if="asset.description" class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {{ asset.description }}
                </p>

                <!-- Tags -->
                <div v-if="(asset as any).tags && (asset as any).tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                  <span
                    v-for="tag in (asset as any).tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                  <button
                    @click="approveAsset(asset)"
                    class="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Approve
                  </button>
                  
                  <button
                    @click="rejectAsset(asset)"
                    class="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Reject
                  </button>

                  <button
                    @click="openPreview(asset)"
                    class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Preview
                  </button>

                  <button
                    @click="downloadAsset(asset)"
                    class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Status Actions -->
      <div class="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
        <div class="flex space-x-2">
          <button
            v-if="task.status === 'pending'"
            @click="updateStatus('in_progress')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Start Design Task
          </button>
          <button
            v-if="task.status === 'in_progress'"
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Complete Design Task
          </button>
        </div>
        
        <!-- Stats Summary -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">{{ stats.total }}</span> assets •
          <span class="text-green-600 dark:text-green-400 font-medium">{{ stats.approved }}</span> approved •
          <span class="text-yellow-600 dark:text-yellow-400 font-medium">{{ stats.pending }}</span> pending
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Transition name="modal">
      <div
        v-if="showPreviewModal && previewAsset"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closePreview"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="closePreview"></div>

        <!-- Modal Content -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex-1 min-w-0 mr-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ previewAsset.name || previewAsset.original_name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ previewAsset.category }} • 
                  <span v-if="(previewAsset as any).file_size">{{ formatFileSize((previewAsset as any).file_size) }}</span>
                </p>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center space-x-2">
                <!-- Approve/Reject buttons (only for pending assets) -->
                <template v-if="previewAsset.status === 'pending'">
                  <button
                    @click="approveAsset(previewAsset); closePreview()"
                    class="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors inline-flex items-center"
                    title="Approve"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Approve
                  </button>
                  <button
                    @click="rejectAsset(previewAsset); closePreview()"
                    class="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors inline-flex items-center"
                    title="Reject"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Reject
                  </button>
                </template>

                <button
                  @click="downloadAsset(previewAsset)"
                  class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                </button>
                <button
                  @click="deleteAsset(previewAsset)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
                <button
                  @click="closePreview"
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
              <div v-if="isImageAsset(previewAsset)" class="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
                <img
                  :src="getAssetUrl(previewAsset)"
                  :alt="previewAsset.name || previewAsset.original_name"
                  class="max-w-full max-h-[70vh] object-contain"
                />
              </div>

              <!-- PDF Preview -->
              <div v-else-if="isPdfAsset(previewAsset)" class="bg-gray-100 dark:bg-gray-900 rounded-lg">
                <iframe
                  :src="getAssetUrl(previewAsset)"
                  class="w-full h-[70vh] rounded-lg"
                  frameborder="0"
                ></iframe>
              </div>

              <!-- Other File Types -->
              <div v-else class="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Preview not available for this file type</p>
                <button
                  @click="downloadAsset(previewAsset)"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download File
                </button>
              </div>
            </div>

            <!-- Footer with Asset Details -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <span
                    :class="{
                      'text-yellow-600': previewAsset.status === 'pending',
                      'text-green-600': previewAsset.status === 'approved',
                      'text-red-600': previewAsset.status === 'rejected',
                      'text-blue-600': previewAsset.status === 'revision',
                    }"
                    class="ml-2 font-medium capitalize"
                  >
                    {{ previewAsset.status }}
                  </span>
                </div>
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">Uploaded:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">
                    {{ new Date(previewAsset.created_at).toLocaleString() }}
                  </span>
                </div>
                <div v-if="previewAsset.description" class="col-span-2">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                  <p class="mt-1 text-gray-600 dark:text-gray-400">{{ previewAsset.description }}</p>
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
import api from '@/plugins/axios'
import type { EnquiryTask } from '../../types/enquiry'
import type { DesignAsset, AssetCategory } from './design/types/design'
import imageCompression from 'browser-image-compression'

interface Props {
  task: EnquiryTask
  readonly?: boolean
  initialTab?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

// Active tab for navigation
const activeTab = ref<string>(props.initialTab || 'upload')

// Watch initialTab to update activeTab when it changes while open
watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})

// Assets state
const assets = ref<DesignAsset[]>([])
const isLoadingAssets = ref(false)

// Preview modal state
const previewAsset = ref<DesignAsset | null>(null)
const showPreviewModal = ref(false)

// Upload data
const uploadData = ref({
  category: 'concept' as AssetCategory,
  description: '',
  tags: [] as string[]
})

const selectedFiles = ref<File[]>([])
const tagsText = ref('')
const error = ref('')
const successMessage = ref('')
const isLoadingExistingData = ref(false)
const isUploading = ref(false)
const isCompressing = ref(false)
const uploadProgress = ref(0)

// Computed properties
const pendingAssets = computed(() => 
  assets.value.filter(asset => asset.status === 'pending')
)

const approvedAssets = computed(() => 
  assets.value.filter(asset => asset.status === 'approved')
)

const stats = computed(() => ({
  total: assets.value.length,
  approved: approvedAssets.value.length,
  pending: pendingAssets.value.length,
  rejected: assets.value.filter(a => a.status === 'rejected').length,
  revision: assets.value.filter(a => a.status === 'revision').length,
}))

// Utility functions
const isImageFile = (mimeType: string): boolean => {
  return mimeType?.startsWith('image/')
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getAssetUrl = (asset: DesignAsset): string => {
  const filePath = (asset as any).file_path || ''
  // Use relative path - Vite proxy handles /storage in dev, works directly in production
  return (asset as any).file_url || ''
}

const isImageAsset = (asset: DesignAsset): boolean => {
  const mimeType = (asset as any).mime_type || asset.type || ''
  return mimeType.startsWith('image/')
}

const isPdfAsset = (asset: DesignAsset): boolean => {
  const mimeType = (asset as any).mime_type || asset.type || ''
  return mimeType.includes('pdf')
}

const openPreview = (asset: DesignAsset) => {
  previewAsset.value = asset
  showPreviewModal.value = true
}

const closePreview = () => {
  showPreviewModal.value = false
  setTimeout(() => {
    previewAsset.value = null
  }, 300)
}

const downloadAsset = (asset: DesignAsset) => {
  const url = `/api/projects/enquiry-tasks/${props.task.id}/design-assets/${asset.id}/download`
  window.open(url, '_blank')
}

const approveAsset = async (asset: DesignAsset) => {
  try {
    const response = await api.post(`/api/projects/enquiry-tasks/${props.task.id}/design-assets/${asset.id}/approve`)
    
    // Update the asset in local state
    const index = assets.value.findIndex(a => a.id === asset.id)
    if (index !== -1) {
      assets.value[index] = { ...assets.value[index], ...response.data.asset }
    }
    
    successMessage.value = `Asset "${asset.name || asset.original_name}" approved successfully!`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } } }
    console.error('Approve error:', errorObj)
    error.value = errorObj.response?.data?.message || 'Failed to approve asset'
  }
}

const rejectAsset = async (asset: DesignAsset, reason?: string) => {
  try {
    const response = await api.post(`/api/projects/enquiry-tasks/${props.task.id}/design-assets/${asset.id}/reject`, {
      reason: reason || ''
    })
    
    // Update the asset in local state
    const index = assets.value.findIndex(a => a.id === asset.id)
    if (index !== -1) {
      assets.value[index] = { ...assets.value[index], ...response.data.asset }
    }
    
    successMessage.value = `Asset "${asset.name || asset.original_name}" rejected.`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } } }
    console.error('Reject error:', errorObj)
    error.value = errorObj.response?.data?.message || 'Failed to reject asset'
  }
}

const deleteAsset = async (asset: DesignAsset) => {
  if (!confirm(`Are you sure you want to delete "${asset.name || asset.original_name}"? This action cannot be undone.`)) {
    return
  }

  try {
    await api.delete(`/api/projects/enquiry-tasks/${props.task.id}/design-assets/${asset.id}`)
    
    // Remove the asset from local state
    assets.value = assets.value.filter(a => a.id !== asset.id)
    
    // If deleting the previewed asset, close the modal
    if (previewAsset.value && previewAsset.value.id === asset.id) {
      closePreview()
    }
    
    successMessage.value = `Asset "${asset.name || asset.original_name}" deleted successfully.`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } } }
    console.error('Delete error:', errorObj)
    error.value = errorObj.response?.data?.message || 'Failed to delete asset'
  }
}


// Methods
const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    isCompressing.value = true
    // Validate file types and sizes
    const validFiles: File[] = []
    const maxSize = 50 * 1024 * 1024 // 50MB

    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      // Check file size
      if (file.size > maxSize) {
        error.value = `File "${file.name}" is too large. Maximum size is 50MB.`
        isCompressing.value = false
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/postscript', 'image/vnd.adobe.photoshop', 'application/octet-stream']
      const allowedExtensions = ['.ai', '.psd', '.sketch', '.fig', '.xd']

      const isValidType = allowedTypes.includes(file.type) ||
        allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

      if (!isValidType) {
        error.value = `File "${file.name}" has an unsupported format.`
        isCompressing.value = false
        return
      }

      // Compress if image
      if (file.type.startsWith('image/')) {
         const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
         }
         try {
            const compressedBlob = await imageCompression(file, options)
            file = new File([compressedBlob], file.name, { type: file.type })
         } catch (e) {
            console.warn('Compression failed', e)
         }
      }

      validFiles.push(file)
    }

    // Add valid files to selected files
    selectedFiles.value.push(...validFiles)

    // Clear any previous errors
    error.value = ''
    isCompressing.value = false
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const parseTags = () => {
  const tags = tagsText.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  uploadData.value.tags = tags
}

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) {
    error.value = 'Please select at least one file to upload.'
    return
  }

  error.value = ''
  successMessage.value = ''
  isUploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()

    // Add files
    selectedFiles.value.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    // Add metadata
    formData.append('category', uploadData.value.category)
    if (uploadData.value.description) {
      formData.append('description', uploadData.value.description)
    }
    if (uploadData.value.tags.length > 0) {
      uploadData.value.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag)
      })
    }

    // Upload to correct endpoint
    const response = await api.post(`/api/projects/enquiry-tasks/${props.task.id}/design-assets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })

    // Add uploaded assets to the assets list
    if (response.data && Array.isArray(response.data)) {
      assets.value.unshift(...response.data)
    }

    successMessage.value = `Successfully uploaded ${selectedFiles.value.length} design asset(s)!`

    // Clear form
    selectedFiles.value = []
    uploadData.value = {
      category: 'concept',
      description: '',
      tags: []
    }
    tagsText.value = ''

    // Reload assets to ensure sync
    await loadDesignAssets()

    // Switch to gallery tab to show uploaded assets
    activeTab.value = 'gallery'

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)

  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    console.error('Upload error:', errorObj)

    if (errorObj.response?.data?.errors) {
      const errors = Object.values(errorObj.response.data.errors).flat().join(', ')
      error.value = `Upload failed: ${errors}`
    } else if (errorObj.response?.data?.message) {
      error.value = `Upload failed: ${errorObj.response.data.message}`
    } else {
      error.value = 'Upload failed. Please try again.'
    }
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// Function to load existing design assets
const loadDesignAssets = async () => {
  error.value = ''
  isLoadingAssets.value = true

  try {
    const response = await api.get(`/api/projects/enquiry-tasks/${props.task.id}/design-assets`)
    if (response.data && response.data.data) {
      assets.value = response.data.data
    } else if (Array.isArray(response.data)) {
      assets.value = response.data
    }
  } catch (loadError) {
    console.error('Error loading design assets:', loadError)
    error.value = 'Failed to load design assets.'
  } finally {
    isLoadingAssets.value = false
  }
}

// Function to load existing design data (legacy)
const loadDesignData = async () => {
  error.value = ''
  successMessage.value = ''
  isLoadingExistingData.value = true

  try {
    await loadDesignAssets()
  } catch (loadError) {
    console.error('Error loading existing design data:', loadError)
  } finally {
    isLoadingExistingData.value = false
  }
}

// Watch for task changes to load existing data
watch(() => props.task?.id, async (newTaskId, oldTaskId) => {
  try {
    console.log('[DEBUG] Design Task - Task ID changed:', {
      oldTaskId: oldTaskId,
      newTaskId: newTaskId,
      taskStatus: props.task?.status,
      readonly: props.readonly,
      project_enquiry_id: props.task?.project_enquiry_id
    })

    if (!props.task) {
      console.warn('[DEBUG] Task object is not available in watcher')
      return
    }

    await loadDesignData()
  } catch (watcherError) {
    console.error('[DEBUG] Error in design task watcher callback:', watcherError)
    error.value = 'Failed to load design data. Please refresh the page.'
    isLoadingExistingData.value = false
  }
}, { immediate: true })

// Load assets on mount
onMounted(() => {
  if (props.task?.id) {
    loadDesignAssets()
  }
})
</script>
<style scoped>
.design-task {
  max-width: none;
}

/* Modal transitions */
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
