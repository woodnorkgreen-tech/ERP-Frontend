<template>
  <div class="teams-task bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

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
    <div v-if="feedback.messages.length > 0" class="mb-6 space-y-2">
      <div
        v-for="message in feedback.messages"
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
          @click="feedback.removeMessage(message.id)"
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
          v-if="canAssignTeams"
          @click="addTeamModal.open()"
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
          v-if="canAssignTeams"
          @click="addTeamModal.open()"
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
              v-if="canDeleteTeams"
              @click="handleDeleteTeam(team.id)"
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
                  v-if="canManageMembers"
                  @click="handleRemoveMember(team.id, member.id)"
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
            <div v-if="canManageMembers" class="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div class="flex gap-2">
                <input
                  v-model="newMemberInputs[team.id]"
                  type="text"
                  placeholder="Enter member name"
                  class="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
                  @keydown.enter="handleAddMember(team.id)"
                />
                <button
                  @click="handleAddMember(team.id)"
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
    <div v-if="addTeamModal.isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Team</h3>
            <button
              @click="addTeamModal.close()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmitAddTeam" class="space-y-4">
            <!-- Category Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                v-model="newTeamForm.category"
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
                v-model="newTeamForm.team_type_id"
                :disabled="!newTeamForm.category"
                class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                <option value="">Select Team Type</option>
                <option
                  v-for="teamType in getAvailableTeamTypes(newTeamForm.category)"
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
                v-model="newTeamForm.start_date"
                type="date"
                class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="addTeamModal.close()"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!newTeamForm.category || !newTeamForm.team_type_id"
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
        <span :class="getStatusColorClass(task.status)" class="px-3 py-1.5 text-xs rounded-full font-medium">
          {{ getStatusLabel(task.status) }}
        </span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled'"
          @click="markTaskComplete"
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
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { useTeams } from '../../composables/useTeams'
import { usePermissions } from '@/modules/finance/petty-cash/composables/usePermissions'

// Import new composables and utilities
import { useModal } from '../../composables/useModal'
import { useDataRefresh } from '../../composables/useDataRefresh'
import { useFeedback } from '../../composables/useFeedback'
import { useTeamOperations } from '../../composables/useTeamOperations'
import type { Team } from '../../composables/useTeams'

// Import constants
import {
  TEAM_CATEGORIES,
  CATEGORY_ID_MAP,
  TEAM_TABS,
  TEAM_TYPES,
  TEAM_TYPE_NAMES,
  type TeamCategory
} from '../../constants/teamConstants'

// Import utilities
import { getStatusColorClass, getStatusLabel } from '../../utils/statusHelpers'
import { formatDate, formatCurrency } from '../../utils/dateHelpers'

/**
 * Props interface for the TeamsTask component
 */
interface Props {
  task: EnquiryTask
}

/**
 * Events emitted by the TeamsTask component
 */
interface Emits {
  'update-status': [status: EnquiryTask['status']]
}

/**
 * Project information structure
 */
interface ProjectInfo {
  projectId: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate: string
  estimatedBudget?: number
  contactPerson: string
}

/**
 * New team form structure
 */
interface NewTeamForm {
  category: TeamCategory | ''
  team_type_id: number | null
  start_date: string
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const teams = useTeams()
const { hasRole } = usePermissions()
const addTeamModal = useModal<NewTeamForm>()
const dataRefresh = useDataRefresh()
const feedback = useFeedback()
const teamOps = useTeamOperations()

// Local state
const activeTab = ref<TeamCategory>(TEAM_CATEGORIES.WORKSHOP)
const newMemberInputs = reactive<Record<number, string>>({})
const newTeamForm = reactive<NewTeamForm>({
  category: '',
  team_type_id: null,
  start_date: ''
})
const teamTabs = TEAM_TABS

/**
 * Extract project information from task
 */
const projectInfo = computed((): ProjectInfo => {
  const enquiry = props.task?.enquiry

  return {
    projectId: enquiry?.enquiry_number || 'N/A',
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'N/A',
    eventVenue: enquiry?.venue || 'TBC',
    setupDate: enquiry?.expected_delivery_date || 'TBC',
    setDownDate: 'TBC',
    estimatedBudget: enquiry?.estimated_budget,
    contactPerson: enquiry?.contact_person || 'N/A'
  }
})

/**
 * Permission checks
 */
const canAssignTeams = computed(() => hasRole('manager') || hasRole('admin'))
const canManageMembers = computed(() => hasRole('manager') || hasRole('admin'))
const canDeleteTeams = computed(() => hasRole('manager') || hasRole('admin'))

/**
 * Team statistics
 */
const completedTeamsCount = computed(() =>
  teams.completedTeams.value?.length || 0
)

const inProgressTeamsCount = computed(() =>
  teams.inProgressTeams.value?.length || 0
)

const overdueTeamsCount = computed(() =>
  teams.overdueTeams.value?.length || 0
)

/**
 * Get teams for active tab
 */
const getActiveTabTeams = () => {
  const teamsByCategory = teams.teamsByCategory.value
  return teamsByCategory?.[activeTab.value] || []
}

/**
 * Get team count for specific tab
 */
const getTabTeamCount = (tabKey: TeamCategory): number => {
  const teamsByCategory = teams.teamsByCategory.value
  return teamsByCategory?.[tabKey]?.length || 0
}

/**
 * Get active tab label
 */
const getActiveTabLabel = (): string => {
  const tab = TEAM_TABS.find(t => t.key === activeTab.value)
  return tab?.label || 'Teams'
}

/**
 * Get available team types for category
 */
const getAvailableTeamTypes = (category: TeamCategory | '') => {
  if (!category) return []
  return TEAM_TYPES[category] || []
}

/**
 * Get team type display name
 */
const getTeamTypeDisplayName = (team: Team): string => {
  if (team.team_type?.display_name) {
    return team.team_type.display_name
  }
  return TEAM_TYPE_NAMES[team.team_type_id] || 'Unknown Team'
}

/**
 * Handle add member
 */
const handleAddMember = async (teamTaskId: number) => {
  const memberName = newMemberInputs[teamTaskId]?.trim()

  if (!memberName) {
    feedback.error('Please enter a member name')
    return
  }

  await teamOps.addMemberOptimistic(props.task.id, teamTaskId, memberName)

  // Clear input on success
  if (!teamOps.isLoading.value[`add-member-${teamTaskId}`]) {
    newMemberInputs[teamTaskId] = ''
  }
}

/**
 * Handle remove member
 */
const handleRemoveMember = async (teamTaskId: number, memberId: number) => {
  await teamOps.removeMemberOptimistic(props.task.id, teamTaskId, memberId)
}

/**
 * Handle delete team
 */
const handleDeleteTeam = async (teamTaskId: number) => {
  if (!confirm('Are you sure you want to delete this team?')) {
    return
  }

  await teamOps.deleteTeamOptimistic(props.task.id, teamTaskId)
}

/**
 * Handle submit add team
 */
const handleSubmitAddTeam = async () => {
  if (!newTeamForm.category || !newTeamForm.team_type_id) {
    feedback.error('Please select a category and team type')
    return
  }

  const teamData = {
    category_id: CATEGORY_ID_MAP[newTeamForm.category],
    team_type_id: newTeamForm.team_type_id,
    required_members: 1,
    start_date: newTeamForm.start_date || undefined,
    priority: 'medium'
  }

  await teamOps.createTeamOptimistic(props.task.id, teamData)

  // Close modal and reset form on success
  if (!teamOps.isLoading.value['create-team']) {
    addTeamModal.close()
    newTeamForm.category = ''
    newTeamForm.team_type_id = null
    newTeamForm.start_date = ''
  }
}

/**
 * Mark task as complete
 */
const markTaskComplete = () => emit('update-status', 'completed')

/**
 * Initialize data on mount
 */
onMounted(async () => {
  try {
    await dataRefresh.queueRefresh('teams-initial', async () => {
      await teams.fetchTeamCategories()
      await teams.fetchTeamsForTask(props.task.id)
    })
    feedback.success('Teams data loaded successfully')
  } catch (error) {
    console.error('Error loading teams data:', error)
    feedback.error('Failed to load teams data')
  }
})

/**
 * Watch for task changes
 */
watch(
  () => props.task.id,
  (newTaskId) => {
    if (newTaskId) {
      dataRefresh.queueRefresh('teams-task-change', () =>
        teams.fetchTeamsForTask(newTaskId)
      )
    }
  }
)
</script>
