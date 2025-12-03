<template>
  <!-- Use TaskDataViewer for readonly/completed tasks -->
  <TaskDataViewer v-if="isReadonly" :task="task" @edit="isEditMode = true" />

  <!-- Editable Teams Task View -->
  <div v-else class="teams-task bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
      <button
        v-if="isEditMode"
        @click="isEditMode = false"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors font-medium flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span>Exit Edit Mode</span>
      </button>
    </div>

    <!-- Project Information Section -->
    <div class="mb-6">
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Teams Task - {{ task.title }}
      </h4>

      <!-- Project Information Display -->
      <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Project Information</h5>
          <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full w-fit">
            Teams Task
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

    <!-- Teams Summary -->
    <div v-if="teams.teamsTasks && teams.teamsTasks.value && teams.teamsTasks.value.length > 0" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h5 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Teams Summary</h5>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="text-blue-600 dark:text-blue-400 font-medium">{{ teams.teamsTasks.value.length }}</span>
          <span class="text-blue-700 dark:text-blue-300 ml-1">Total Teams</span>
        </div>
        <div>
          <span class="text-green-600 dark:text-green-400 font-medium">{{ teams.completedTeams && teams.completedTeams.value ? teams.completedTeams.value.length : 0 }}</span>
          <span class="text-blue-700 dark:text-blue-300 ml-1">Completed</span>
        </div>
        <div>
          <span class="text-yellow-600 dark:text-yellow-400 font-medium">{{ teams.inProgressTeams && teams.inProgressTeams.value ? teams.inProgressTeams.value.length : 0 }}</span>
          <span class="text-blue-700 dark:text-blue-300 ml-1">In Progress</span>
        </div>
        <div>
          <span class="text-red-600 dark:text-red-400 font-medium">{{ teams.overdueTeams && teams.overdueTeams.value ? teams.overdueTeams.value.length : 0 }}</span>
          <span class="text-blue-700 dark:text-blue-300 ml-1">Overdue</span>
        </div>
      </div>
    </div>

    <!-- Tab Navigation and Add Team Button -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="tab in teamTabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            {{ tab.label }}
            <span v-if="getTabTeamCount(tab.key) > 0" class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
              {{ getTabTeamCount(tab.key) }}
            </span>
          </button>
        </div>

        <!-- Add Team Button -->
        <button
          v-if="canAssignTeams && !isReadonly"
          @click="showAddTeamModal = true"
          class="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors font-medium flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Add Team</span>
        </button>
      </div>
    </div>

    <!-- Teams Display for Active Tab -->
    <div class="space-y-4">
      <div v-if="getActiveTabTeams().length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No {{ getActiveTabLabel().toLowerCase() }} yet</h3>
        <p class="text-sm mb-6 max-w-md mx-auto">Get started by creating your first team. Teams help organize your project workflow and assign responsibilities.</p>

        <!-- Add Team Button in Empty State -->
        <button
          v-if="canAssignTeams && !isReadonly"
          @click="showAddTeamModal = true"
          class="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Your First Team
        </button>
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="team in getActiveTabTeams()"
          :key="team.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800"
        >
          <!-- Team Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ getTeamTypeDisplayName(team) }}</h4>
              <span :class="getStatusColorClass(team.status)" class="px-3 py-1 text-xs rounded-full font-medium">
                {{ getStatusLabel(team.status) }}
              </span>
            </div>
            <button
              v-if="canDeleteTeams && !isReadonly"
              @click="deleteTeam(team.id)"
              class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
              :aria-label="'Delete team'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <!-- Team Members Section -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Team Members
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">({{ (team.members || []).length }})</span>
              </h5>
            </div>

            <!-- Members List -->
            <div v-if="(team.members || []).length > 0" class="space-y-2">
              <div
                v-for="(member, index) in team.members || []"
                :key="member.id"
                class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">{{ index + 1 }}.</span>
                  <span class="text-sm text-gray-900 dark:text-white font-medium">{{ member.member_name }}</span>
                </div>
                <button
                  v-if="canManageMembers && !isReadonly"
                  @click="removeMember(team.id, member.id)"
                  class="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  :aria-label="`Remove ${member.member_name}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Empty Members State -->
            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              No members assigned yet
            </div>

            <!-- Add Member Form -->
            <div v-if="canManageMembers && !isReadonly" class="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div class="flex gap-2">
                <input
                  v-model="newMemberInputs[team.id]"
                  type="text"
                  placeholder="Enter member name"
                  class="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
                  @keydown.enter="addMemberToTeam(team.id)"
                />
                <button
                  @click="addMemberToTeam(team.id)"
                  :disabled="!newMemberInputs[team.id]?.trim()"
                  class="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors font-medium flex items-center space-x-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Team Modal -->
    <div v-if="showAddTeamModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Team</h3>
            <button
              @click="closeAddTeamModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitAddTeam" class="space-y-4">
            <!-- Category Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                v-model="newTeamModal.category"
                class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              >
                <option value="">Select Category</option>
                <option value="workshop">Workshop Teams</option>
                <option value="setup">Setup Teams</option>
                <option value="setdown">Setdown Teams</option>
              </select>
            </div>

            <!-- Team Type Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Type</label>
              <select
                v-model="newTeamModal.team_type_id"
                :disabled="!newTeamModal.category"
                class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                <option value="">Select Team Type</option>
                <option
                  v-for="teamType in getAvailableTeamTypes(newTeamModal.category)"
                  :key="teamType.id"
                  :value="teamType.team_type_id"
                >
                  {{ teamType.display_name }}
                </option>
              </select>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date (Optional)</label>
              <input
                v-model="newTeamModal.start_date"
                type="date"
                class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeAddTeamModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!newTeamModal.category || !newTeamModal.team_type_id"
                class="px-4 py-2 text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Create Team
              </button>
            </div>
          </form>
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
        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="$emit('update-status', 'completed')"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Mark Complete</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center justify-center sm:justify-start space-x-2 text-green-600 dark:text-green-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">Task Completed</span>
        </div>

        <!-- Readonly Indicator -->\n        <div v-if="isReadonly && task.status !== 'completed'" class="flex items-center justify-center sm:justify-start space-x-2 text-blue-600 dark:text-blue-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="text-sm font-medium">Readonly Mode</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { useTeams } from '../../composables/useTeams'
import { usePermissions } from '@/modules/finance/petty-cash/composables/usePermissions'
import TaskDataViewer from './TaskDataViewer.vue'

/**
 * Props interface for the TeamsTask component
 */
interface Props {
  /** The enquiry task object containing task details and metadata */
  task: EnquiryTask
  /** Optional readonly mode - if not provided, will be determined by task status */
  readonly?: boolean
}

/**
 * Events emitted by the TeamsTask component
 */
interface Emits {
  /** Emitted when task status needs to be updated */
  'update-status': [status: EnquiryTask['status']]
}

/**
 * Project information structure for the teams task
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
 * New team modal form interface
 */
interface NewTeamModalForm {
  category: string
  team_type_id: number | null
  start_date: string
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

// Component setup
const props = withDefaults(defineProps<Props>(), {
  readonly: false
})
const emit = defineEmits<Emits>()

// Teams API integration
const teams = useTeams()

// Permission service
const { hasPermission, hasRole } = usePermissions()

/**
 * Active tab state
 */
const activeTab = ref<'workshop' | 'setup' | 'setdown'>('workshop')

/**
 * Edit mode state - allows editing even when task is completed
 */
const isEditMode = ref(false)

/**
 * Modal state
 */
const showAddTeamModal = ref(false)

/**
 * Computed readonly state - readonly if prop is true OR (task is completed AND not in edit mode)
 */
const isReadonly = computed(() => {
  return props.readonly || (props.task.status === 'completed' && !isEditMode.value)
})

/**
 * New team modal form data
 */
const newTeamModal = reactive<NewTeamModalForm>({
  category: '',
  team_type_id: null,
  start_date: ''
})

/**
 * New member inputs for each team
 */
const newMemberInputs = reactive<Record<number, string>>({})

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
 * Team tabs configuration
 */
const teamTabs = [
  { key: 'workshop', label: 'Workshop Teams' },
  { key: 'setup', label: 'Setup Teams' },
  { key: 'setdown', label: 'Setdown Teams' }
] as const

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
 * Main teams data structure
 */
const projectInfo = computed(() => extractProjectInfo())

/**
 * Initialize data on component mount
 */
onMounted(async () => {
  try {
    // Load team categories and existing teams data
    await teams.fetchTeamCategories()
    await teams.fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Teams data loaded successfully')
  } catch (error) {
    console.error('Error loading teams data:', error)
    addFeedbackMessage('error', 'Failed to load teams data. Please refresh the page.')
  }
})

/**
 * Get teams for the active tab
 */
const getActiveTabTeams = () => {
  const teamsByCategory = teams.teamsByCategory.value
  return teamsByCategory?.[activeTab.value] || []
}

/**
 * Get team count for a specific tab
 */
const getTabTeamCount = (tabKey: string): number => {
  const teamsByCategory = teams.teamsByCategory.value
  return teamsByCategory?.[tabKey]?.length || 0
}

/**
 * Get active tab label
 */
const getActiveTabLabel = (): string => {
  const tab = teamTabs.find(t => t.key === activeTab.value)
  return tab?.label || 'Teams'
}

/**
 * Hardcoded team types for each category
 */
const hardcodedTeamTypes = {
  workshop: [
    { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
    { id: 2, team_type_id: 2, display_name: 'Technicians' },
    { id: 3, team_type_id: 3, display_name: 'Painters' },
    { id: 4, team_type_id: 4, display_name: 'Welders' },
    { id: 5, team_type_id: 5, display_name: 'Electricians' },
    { id: 6, team_type_id: 6, display_name: 'ICT' },
    { id: 7, team_type_id: 7, display_name: 'Loading' },
    { id: 8, team_type_id: 8, display_name: 'Offloading' },
    { id: 9, team_type_id: 9, display_name: 'Carpenters' }
  ],
  setup: [
    { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
    { id: 2, team_type_id: 2, display_name: 'Technicians' },
    { id: 3, team_type_id: 3, display_name: 'Painters' },
    { id: 4, team_type_id: 4, display_name: 'Welders' },
    { id: 5, team_type_id: 5, display_name: 'Electricians' },
    { id: 6, team_type_id: 6, display_name: 'ICT' },
    { id: 7, team_type_id: 7, display_name: 'Loading' },
    { id: 8, team_type_id: 8, display_name: 'Offloading' },
    { id: 9, team_type_id: 9, display_name: 'Carpenters' }
  ],
  setdown: [
    { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
    { id: 2, team_type_id: 2, display_name: 'Technicians' },
    { id: 3, team_type_id: 3, display_name: 'Painters' },
    { id: 4, team_type_id: 4, display_name: 'Welders' },
    { id: 5, team_type_id: 5, display_name: 'Electricians' },
    { id: 6, team_type_id: 6, display_name: 'ICT' },
    { id: 7, team_type_id: 7, display_name: 'Loading' },
    { id: 8, team_type_id: 8, display_name: 'Offloading' },
    { id: 9, team_type_id: 9, display_name: 'Carpenters' }
  ]
}

/**
 * Get available team types for a category (using hardcoded data)
 */
const getAvailableTeamTypes = (categoryId: string) => {
  return hardcodedTeamTypes[categoryId as keyof typeof hardcodedTeamTypes] || []
}

/**
 * Close add team modal
 */
const closeAddTeamModal = () => {
  showAddTeamModal.value = false
  // Reset form
  newTeamModal.category = ''
  newTeamModal.team_type_id = null
  newTeamModal.start_date = ''
}

/**
 * Submit add team form
 */
const submitAddTeam = async () => {
  if (!newTeamModal.category || !newTeamModal.team_type_id) {
    addFeedbackMessage('error', 'Please select a category and team type')
    return
  }

  try {
    // Map category to proper category_id
    const categoryMap = {
      workshop: 1,
      setup: 2,
      setdown: 3
    }

    const newTeam = await teams.createTeamTask(props.task.id, {
      category_id: categoryMap[newTeamModal.category as keyof typeof categoryMap],
      team_type_id: newTeamModal.team_type_id,
      required_members: 1, // Default to 1, members added individually
      start_date: newTeamModal.start_date || undefined,
      priority: 'medium'
    })

    // Try to refresh teams data to show the newly created team
    try {
      await teams.fetchTeamsForTask(props.task.id)
      addFeedbackMessage('success', `Team added to ${newTeamModal.category} category`)
      closeAddTeamModal()
    } catch (refreshError) {
      console.warn('Failed to refresh teams data after team creation:', refreshError)
      addFeedbackMessage('success', `Team added to ${newTeamModal.category} category (UI may not update immediately)`)
      closeAddTeamModal()
      // Optionally trigger a manual refresh after a short delay
      setTimeout(async () => {
        try {
          await teams.fetchTeamsForTask(props.task.id)
        } catch (retryError) {
          console.error('Retry refresh also failed:', retryError)
        }
      }, 2000)
    }
  } catch (error) {
    console.error('Error adding team:', error)
    addFeedbackMessage('error', 'Failed to add team. Please try again.')
  }
}

/**
 * Add member to a specific team
 */
const addMemberToTeam = async (teamTaskId: number) => {
  const memberName = newMemberInputs[teamTaskId]?.trim()

  if (!memberName) {
    addFeedbackMessage('error', 'Please enter a member name')
    return
  }

  try {
    await teams.addTeamMember(props.task.id, teamTaskId, {
      member_name: memberName
    })

    // Clear input immediately
    newMemberInputs[teamTaskId] = ''

    // Try to refresh teams data to show the newly added member
    try {
      await teams.fetchTeamsForTask(props.task.id)
      addFeedbackMessage('success', 'Member added successfully')
    } catch (refreshError) {
      console.warn('Failed to refresh teams data after member addition:', refreshError)
      addFeedbackMessage('success', 'Member added successfully (UI may not update immediately)')
      // Optionally trigger a manual refresh after a short delay
      setTimeout(async () => {
        try {
          await teams.fetchTeamsForTask(props.task.id)
        } catch (retryError) {
          console.error('Retry refresh also failed:', retryError)
        }
      }, 2000)
    }
  } catch (error) {
    console.error('Error adding member:', error)
    addFeedbackMessage('error', 'Failed to add member. Please try again.')
  }
}

/**
 * Remove member from a specific team
 */
const removeMember = async (teamTaskId: number, memberId: number) => {
  try {
    await teams.removeTeamMember(props.task.id, teamTaskId, memberId)

    // Try to refresh teams data to show the updated member list
    try {
      await teams.fetchTeamsForTask(props.task.id)
      addFeedbackMessage('success', 'Member removed successfully')
    } catch (refreshError) {
      console.warn('Failed to refresh teams data after member removal:', refreshError)
      addFeedbackMessage('success', 'Member removed successfully (UI may not update immediately)')
      // Optionally trigger a manual refresh after a short delay
      setTimeout(async () => {
        try {
          await teams.fetchTeamsForTask(props.task.id)
        } catch (retryError) {
          console.error('Retry refresh also failed:', retryError)
        }
      }, 2000)
    }
  } catch (error) {
    console.error('Error removing member:', error)
    addFeedbackMessage('error', 'Failed to remove member. Please try again.')
  }
}

/**
 * Delete a team
 */
const deleteTeam = async (teamTaskId: number) => {
  if (!confirm('Are you sure you want to delete this team?')) {
    return
  }

  try {
    await teams.deleteTeamTask(props.task.id, teamTaskId)

    // Try to refresh teams data to remove the deleted team
    try {
      await teams.fetchTeamsForTask(props.task.id)
      addFeedbackMessage('success', 'Team deleted successfully')
    } catch (refreshError) {
      console.warn('Failed to refresh teams data after team deletion:', refreshError)
      addFeedbackMessage('success', 'Team deleted successfully (UI may not update immediately)')
      // Optionally trigger a manual refresh after a short delay
      setTimeout(async () => {
        try {
          await teams.fetchTeamsForTask(props.task.id)
        } catch (retryError) {
          console.error('Retry refresh also failed:', retryError)
        }
      }, 2000)
    }
  } catch (error) {
    console.error('Error deleting team:', error)
    addFeedbackMessage('error', 'Failed to delete team. Please try again.')
  }
}

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
 * Get status color classes for teams
 */
const getStatusColorClass = (status: string): string => {
  return getStatusColor(status)
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
    case 'assigned':
      return 'Assigned'
    default:
      return 'Unknown'
  }
}

/**
 * Permission computed properties
 */
const canAssignTeams = computed(() =>
  hasRole('manager') || hasRole('admin') // Simplified for now - using existing roles
)

const canManageMembers = computed(() =>
  hasRole('manager') || hasRole('admin')
)

const canDeleteTeams = computed(() =>
  hasRole('manager') || hasRole('admin')
)

/**
 * Get team type display name with fallback to hardcoded names
 */
const getTeamTypeDisplayName = (team: any): string => {
  // First try to get from team.team_type.display_name (API returns team_type, not teamType)
  if (team.team_type?.display_name) {
    return team.team_type.display_name
  }

  // Fallback to hardcoded names based on team_type_id
  const hardcodedNames: Record<number, string> = {
    1: 'Pasting Team',
    2: 'Technicians',
    3: 'Painters',
    4: 'Welders',
    5: 'Electricians',
    6: 'ICT',
    7: 'Loading',
    8: 'Offloading',
    9: 'Carpenters'
  }

  return hardcodedNames[team.team_type_id] || 'Unknown Team'
}

/**
 * Watch for task prop changes and reinitialize if needed
 */
watch(
  () => props.task,
  (newTask) => {
    try {
      if (newTask && newTask.id !== (props.task?.id)) {
        // Fetch teams for the new task
        teams.fetchTeamsForTask(newTask.id).catch(error => {
          console.error('Error updating teams data for new task:', error)
        })
      }
    } catch (error) {
      console.error('Error updating task data:', error)
      addFeedbackMessage('error', 'Failed to update teams data')
    }
  },
  { deep: true }
)
</script>