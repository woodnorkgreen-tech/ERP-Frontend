<template>
  <div class="handover-task bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-sm p-4 sm:p-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Project Information -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Information</h4>
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project Title</label>
            <p class="text-sm text-gray-900 dark:text-white font-semibold mt-1">{{ projectInfo.enquiryTitle || 'Untitled Project' }}</p>
          </div>
          <div class="project-info-card">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client Name</label>
            <p class="text-sm text-gray-900 dark:text-white mt-1">{{ projectInfo.clientName }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Share with Client Section -->
    <div v-if="canEditSurvey" class="mb-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Share with Client</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate a secure link for the client to complete the survey.
          </p>
          
          <div v-if="!clientLink" class="mt-2">
            <button
              @click="generateLink"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generate Client Link
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex items-center space-x-2">
              <input
                type="text"
                readonly
                :value="clientLink"
                class="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300"
              />
              <button
                @click="copyLink"
                class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                <span v-if="copied" class="text-green-600 dark:text-green-400 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Copied
                </span>
                <span v-else>Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        <!-- QR Code -->
        <div v-if="clientLink" class="bg-white p-4 rounded-lg shadow-sm ml-4">
          <qrcode-vue :value="clientLink" :size="120" level="H" />
          <p class="text-xs text-center text-gray-500 mt-2">Scan to Open</p>
        </div>
      </div>
    </div>

    <!-- Fill Survey Internally (for staff) -->
    <div v-if="canManageHandover && !surveyData?.submitted" class="mb-6">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Fill Survey Internally</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete the survey on behalf of the client</p>
            </div>
            <button
              @click="showFillForm = !showFillForm"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {{ showFillForm ? 'Hide Form' : 'Open Survey Form' }}
            </button>
          </div>
        </div>

        <div v-if="showFillForm" class="p-6 space-y-6">
          <!-- Feedback Source Section -->
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Feedback Source</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  How was this feedback received? <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="feedbackSource"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="survey_link">Survey Link (Formal)</option>
                  <option value="email">Email Communication</option>
                  <option value="whatsapp">WhatsApp/SMS</option>
                  <option value="phone_call">Phone Call</option>
                  <option value="in_person">In-Person Meeting</option>
                  <option value="social_media">Social Media</option>
                  <option value="other">Other Channel</option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                  Date Feedback Received
                </label>
                <input
                  type="date"
                  v-model="feedbackReceivedAt"
                  class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <!-- Evidence Notes -->
            <div class="mt-3" v-if="feedbackSource !== 'survey_link'">
              <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                Evidence & Context Notes
              </label>
              <textarea
                v-model="evidenceNotes"
                rows="2"
                placeholder="E.g., 'Client sent WhatsApp message expressing satisfaction with installation quality. Screenshot attached.'"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              ></textarea>
            </div>

            <!-- File Upload (placeholder - will implement upload in next step) -->
            <div class="mt-3" v-if="feedbackSource !== 'survey_link'">
              <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                Upload Evidence (Screenshots, Emails, etc.)
              </label>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                📎 Attach screenshots of WhatsApp, email, or other communication
              </div>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.pdf,.doc,.docx"
                @change="handleFileUpload"
                class="w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
              />
              <div v-if="evidenceFiles.length > 0" class="mt-2 space-y-1">
                <div v-for="(file, idx) in evidenceFiles" :key="idx" class="flex items-center justify-between text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  <span class="truncate">{{ file.name }}</span>
                  <button @click="removeFile(idx)" class="text-red-600 hover:text-red-800 ml-2">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Alternative Feedback Notice -->
          <div v-if="feedbackSource !== 'survey_link'" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <div class="flex items-start gap-2">
              <span class="text-lg">ℹ️</span>
              <div class="text-xs text-yellow-800 dark:text-yellow-300">
                <strong>Alternative Feedback Mode:</strong> You don't need to answer all questions. 
                Fill in only what the client provided in their feedback. Submit when you've captured what's available.
              </div>
            </div>
          </div>

          <!-- Survey Form -->
          <div v-for="(section, sectionIndex) in surveyConfig.sections" :key="section.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-5">
            <div class="mb-4">
              <h5 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ sectionIndex + 1 }}. {{ section.title }}
              </h5>
              <p v-if="section.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ section.description }}
              </p>
            </div>

            <!-- Grid layout for questions - 2 columns on medium+ screens -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <QuestionRenderer
                v-for="question in section.questions"
                :key="question.id"
                :question="question"
                v-model="internalResponses[question.id]"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span v-if="feedbackSource === 'survey_link'">
                  {{ answeredInternalCount }} / {{ requiredQuestions }} required questions answered
                </span>
                <span v-else>
                  {{ Object.keys(internalResponses).length }} questions answered (partial submission allowed)
                </span>
              </div>
              <!-- Debug info -->
              <div v-if="!canSubmitInternal && feedbackSource === 'survey_link'" class="text-xs text-red-600 dark:text-red-400 mt-1">
                Missing: {{ missingQuestions.join(', ') }}
              </div>
            </div>
            <button
              @click="submitInternalSurvey"
              :disabled="!canSubmitInternal || saving"
              :class="[
                'px-6 py-2 rounded-lg font-semibold transition-colors',
                canSubmitInternal && !saving
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <span v-if="saving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
              <span v-else>Submit Survey</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Survey Preview (for staff to see questions) -->
    <div v-if="canManageHandover && !surveyData?.submitted" class="mb-6">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Survey Preview (Read-Only)</h4>
          <button
            @click="showPreview = !showPreview"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ showPreview ? 'Hide' : 'Show' }} Question List
          </button>
        </div>
        
        <div v-if="showPreview" class="space-y-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <p class="text-xs text-blue-800 dark:text-blue-300">
              <strong>{{ surveyConfig.sections.length }} Sections</strong> • 
              <strong>{{ totalQuestions }} Questions</strong> 
              ({{ requiredQuestions }} required)
            </p>
          </div>

          <div v-for="(section, idx) in surveyConfig.sections" :key="section.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <h5 class="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              {{ idx + 1 }}. {{ section.title }}
            </h5>
            <div class="space-y-2 pl-3">
              <div v-for="question in section.questions" :key="question.id" class="text-xs">
                <p class="text-gray-700 dark:text-gray-300">
                  • {{ question.label }}
                  <span v-if="question.required" class="text-red-500">*</span>
                  <span class="text-gray-500 ml-1">({{ question.type }})</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Survey Results (if submitted) -->
    <div v-if="surveyData?.submitted" class="mb-6">
      <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Client Survey Completed</h4>
            <!-- Feedback Source Badge -->
            <div class="flex items-center gap-2 mb-2">
              <span v-if="surveyData.feedback_source === 'survey_link'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                📋 Formal Survey Link
              </span>
              <span v-else-if="surveyData.feedback_source === 'email'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                📧 Email Communication
              </span>
              <span v-else-if="surveyData.feedback_source === 'whatsapp'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                💬 WhatsApp/SMS
              </span>
              <span v-else-if="surveyData.feedback_source === 'phone_call'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                📞 Phone Call
              </span>
              <span v-else-if="surveyData.feedback_source === 'in_person'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                🤝 In-Person Meeting
              </span>
              <span v-else-if="surveyData.feedback_source === 'social_media'" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
                📱 Social Media
              </span>
              <span v-else-if="surveyData.feedback_source" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                📝 {{ surveyData.feedback_source }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ averageRating }}/5</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div>Submitted: {{ formatDate(surveyData?.submitted_at || null) }}</div>
          <div v-if="surveyData.feedback_received_at">
            Feedback Received: {{ formatDate(surveyData.feedback_received_at) }}
          </div>
        </div>

        <!-- Evidence Notes -->
        <div v-if="surveyData.evidence_notes" class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
          <h6 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Evidence & Context:</h6>
          <p class="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ surveyData.evidence_notes }}</p>
        </div>

        <!-- Evidence Files Gallery -->
        <div v-if="surveyData.evidence_files && surveyData.evidence_files.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
          <h6 class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Attached Evidence:</h6>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div v-for="(file, index) in surveyData.evidence_files" :key="index" class="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
              <!-- Image Preview -->
              <div v-if="file.type && file.type.startsWith('image/')" class="aspect-square relative">
                <img :src="file.url" :alt="file.name" class="w-full h-full object-cover cursor-pointer" @click="openFile(file.url)" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
                <!-- Fallback if image fails to load -->
                <div class="hidden absolute inset-0 flex-col items-center justify-center p-2 text-center">
                   <svg class="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-[10px] text-gray-500 truncate w-full">{{ file.name }}</span>
                </div>
              </div>
              <!-- File Icon for non-images -->
              <div v-else class="aspect-square flex flex-col items-center justify-center p-2 text-center">
                <svg class="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="text-[10px] text-gray-500 truncate w-full">{{ file.name }}</span>
              </div>
              
              <!-- Hover Actions -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <a :href="file.url" target="_blank" class="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-sm" title="Download/View">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Survey Responses by Section -->
        <div class="mt-6 space-y-6">
          <div v-for="section in surveyConfig.sections" :key="section.id">
            <h5 class="font-semibold text-gray-900 dark:text-white mb-3">{{ section.title }}</h5>
            <div class="space-y-3">
              <div v-for="question in section.questions" :key="question.id" class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{{ question.label }}</p>
                
                <!-- Display response based on type -->
                <div v-if="question.type === 'rating'">
                  <div v-if="question.has_remarks">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-blue-600 dark:text-blue-400">
                        {{ getResponse(question.id)?.rating || 'N/A' }}/5
                      </span>
                      <span v-if="getResponse(question.id)?.rating" class="text-sm text-gray-600 dark:text-gray-400">
                        - {{ getRatingText(getResponse(question.id).rating) }}
                      </span>
                    </div>
                    <p v-if="getResponse(question.id)?.remarks" class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Remarks: {{ getResponse(question.id).remarks }}
                    </p>
                  </div>
                  <div v-else>
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-blue-600 dark:text-blue-400">
                        {{ getResponse(question.id) || 'N/A' }}/5
                      </span>
                      <span v-if="getResponse(question.id)" class="text-sm text-gray-600 dark:text-gray-400">
                        - {{ getRatingText(getResponse(question.id)) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="question.type === 'yes_no'">
                  <span :class="getResponse(question.id) ? 'text-green-600' : 'text-red-600'">
                    {{ getResponse(question.id) ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div v-else-if="question.type === 'text' || question.type === 'textarea'">
                  <p class="text-sm text-gray-600 dark:text-gray-400 italic">{{ getResponse(question.id) || 'No response' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Survey Pending Message -->
    <div v-else-if="!canManageHandover" class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Survey Pending</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          The client satisfaction survey will be available once completed by authorized staff.
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
      <div class="flex space-x-2">
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled'"
          @click="showSkipModal = true"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Skip Task
        </button>

        <button
          v-if="['skipped', 'completed'].includes(task.status)"
          @click="$emit('update-status', 'pending')"
          class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          {{ task.status === 'skipped' ? 'Unskip Task' : 'Reopen Task' }}
        </button>

        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Handover
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          :disabled="!isHandoverComplete"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors',
            isHandoverComplete
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          ]"
        >
          Complete Handover
        </button>
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
import { ref, computed, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { useHandover } from '../../composables/useHandover'
import { useAuth } from '@/composables/useAuth'
import { SURVEY_CONFIG, validateResponses } from '../../config/surveyQuestions'
import QrcodeVue from 'qrcode.vue'
import QuestionRenderer from '../survey/QuestionRenderer.vue'

interface Props {
  task: EnquiryTask
}

interface Emits {
  'update-status': [status: EnquiryTask['status']]
}

const props = defineProps<Props>()
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
        alert('Task skipped successfully')
    } catch (err: any) {
        console.error('Skip task error:', err)
        alert(err.response?.data?.message || 'Failed to skip task')
    } finally {
        isSkipping.value = false
    }
}

// Use the auth composable
const { user } = useAuth()

// Use the handover composable
const {
  surveyData,
  loading,
  error,
  fetchSurvey,
  saveSurvey,
  isSurveySubmitted,
  averageRating,
  generateToken,
  saving
} = useHandover()

const surveyConfig = SURVEY_CONFIG
const clientLink = ref('')
const copied = ref(false)
const showPreview = ref(false)
const showFillForm = ref(false)
const internalResponses = ref<Record<string, any>>({})

// State for alternative feedback
const feedbackSource = ref('')
const feedbackReceivedAt = ref('')
const evidenceNotes = ref('')
const evidenceFiles = ref<File[]>([])
const evidencePreviews = ref<{ name: string, url: string, type: string }[]>([])

// Handle file selection
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    evidenceFiles.value = [...evidenceFiles.value, ...newFiles]
    
    // Generate previews for new files
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        evidencePreviews.value.push({
          name: file.name,
          url,
          type: 'image'
        })
      } else {
        evidencePreviews.value.push({
          name: file.name,
          url: '',
          type: 'file'
        })
      }
    })
  }
}

const removeFile = (index: number) => {
  evidenceFiles.value.splice(index, 1)
  // Revoke URL if it's an image to avoid memory leaks
  if (evidencePreviews.value[index].type === 'image') {
    URL.revokeObjectURL(evidencePreviews.value[index].url)
  }
  evidencePreviews.value.splice(index, 1)
}

// Computed properties for survey stats
const totalQuestions = computed(() => {
  return surveyConfig.sections.reduce((total, section) => total + section.questions.length, 0)
})

const requiredQuestions = computed(() => {
  let count = 0
  surveyConfig.sections.forEach(section => {
    section.questions.forEach(q => {
      if (q.required) count++
    })
  })
  return count
})

// Count answered questions for internal form
const answeredInternalCount = computed(() => {
  let count = 0
  surveyConfig.sections.forEach(section => {
    section.questions.forEach(q => {
      if (!q.required) return
      const response = internalResponses.value[q.id]
      if (!response) return
      
      if (q.has_remarks && typeof response === 'object') {
        if (response.rating !== null && response.rating !== undefined) count++
      } else if (response !== null && response !== undefined && response !== '') {
        count++
      }
    })
  })
  return count
})

// Validate internal survey
const canSubmitInternal = computed(() => {
  // For alternative feedback sources, allow partial submissions
  if (feedbackSource.value !== 'survey_link') {
    // Just check if at least some responses exist
    return Object.keys(internalResponses.value).length > 0
  }
  
  // For formal survey via link, require all questions
  const validation = validateResponses(internalResponses.value)
  console.log('Validation result:', validation)
  console.log('Current responses:', internalResponses.value)
  return validation.valid
})

// Debug: show which questions are missing
const missingQuestions = computed(() => {
  const validation = validateResponses(internalResponses.value)
  return validation.missing
})

// Project information
const projectInfo = computed(() => {
  const enquiry = props.task.enquiry
  return {
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'Unknown Client',
  }
})

// Computed properties
const isHandoverComplete = computed(() => {
  return isSurveySubmitted.value
})

const canManageHandover = computed(() => {
  // Restriction of "assigned to" or specific roles removed for transparency
  return true 
})

const canEditSurvey = computed(() => {
  return !isSurveySubmitted.value && canManageHandover.value
})

// Helper to get response value
const getResponse = (questionId: string) => {
  return surveyData.value?.responses?.[questionId]
}

// Helper to convert rating number to text
const getRatingText = (rating: number): string => {
  const labels: Record<number, string> = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  }
  return labels[rating] || ''
}

// Methods
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB')
  } catch {
    return 'N/A'
  }
}

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const submitInternalSurvey = async () => {
  if (!canSubmitInternal.value) return

  try {
    // Prepare submission data
    // Prepare submission data
    const formData = new FormData()
    
    // Append basic fields
    formData.append('submitted', 'true')
    formData.append('feedback_source', feedbackSource.value)
    if (feedbackReceivedAt.value) formData.append('feedback_received_at', feedbackReceivedAt.value)
    if (evidenceNotes.value) formData.append('evidence_notes', evidenceNotes.value)
    if (user.value?.id) formData.append('captured_by', user.value.id.toString())
    
    // Append responses as JSON string
    formData.append('responses', JSON.stringify(internalResponses.value))
    
    // Append respondent info as JSON string
    formData.append('respondent_info', JSON.stringify({
      name: props.task.enquiry?.client?.full_name || 'Internal Staff',
      role: 'Staff Member',
      email: user.value?.email
    }))

    // Append files
    evidenceFiles.value.forEach((file) => {
      formData.append('evidence_files[]', file)
    })

    await saveSurvey(props.task.id, formData)
    
    // Refresh survey data
    await fetchSurvey(props.task.id)
    
    // Reset form
    showFillForm.value = false
    internalResponses.value = {}
    feedbackSource.value = 'survey_link'
    feedbackReceivedAt.value = ''
    evidenceNotes.value = ''
    evidenceFiles.value = []
    
    emit('update-status', 'completed')
    alert('Feedback submitted successfully!')
  } catch (e: any) {
    console.error('Failed to submit survey:', e)
    const errorMsg = e.response?.data?.message || 'Failed to submit survey. Please check your inputs and try again.'
    const validationErrors = e.response?.data?.errors
    
    let alertMsg = errorMsg
    if (validationErrors) {
      alertMsg += '\n' + Object.values(validationErrors).flat().join('\n')
    }
    
    alert(alertMsg)
  }
}

const openFile = (url: string) => {
  if (!url) return
  window.open(url, '_blank')
}

// Lifecycle
onMounted(() => {
  fetchSurvey(props.task.id).then(survey => {
    if (survey?.access_token) {
      // Use the correct base URL with /erp path
      const baseUrl = window.location.origin
      const basePath = import.meta.env.BASE_URL || '/erp/'
      clientLink.value = `${baseUrl}${basePath}handover/${survey.access_token}`
    }
  })
})

const generateLink = async () => {
  try {
    const token = await generateToken(props.task.id)
    // Use the correct base URL with /erp path
    const baseUrl = window.location.origin
    const basePath = import.meta.env.BASE_URL || '/erp/'
    clientLink.value = `${baseUrl}${basePath}handover/${token}`
  } catch (err) {
    console.error('Failed to generate link:', err)
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(clientLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}
</script>
