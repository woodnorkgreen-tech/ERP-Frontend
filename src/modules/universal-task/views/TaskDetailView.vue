<template>
  <div class="task-detail-view">
    <!-- Loading State -->
    <div v-if="loading.task" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading task details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Task</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="$router.push('/universal-tasks')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Tasks
        </button>
      </div>
    </div>

    <!-- Task Detail Content -->
    <div v-if="!loading.task && task" class="space-y-6">
     
      <!-- Enhanced Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 text-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <button
                  @click="$router.push('/universal-tasks')"
                  class="text-blue-100 hover:text-white transition-colors"
                  title="Back to tasks"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div class="flex items-center gap-2">
                  <span v-if="task.parent_task_id" class="px-2 py-1 bg-blue-500 bg-opacity-50 rounded text-xs font-medium">
                    Subtask
                  </span>
                  <h1 class="text-2xl md:text-3xl font-bold">{{ task.title }}</h1>
                </div>
              </div>
              <p v-if="task.description" class="text-blue-100 text-sm md:text-base">
                {{ task.description }}
              </p>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                @click="showEditDialog = true"
                class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black rounded-lg transition-colors backdrop-blur-sm"
                title="Edit task"
              >
                <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                v-if="canDelete"
                @click="confirmDelete"
                class="px-4 py-2 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg transition-colors backdrop-blur-sm"
                title="Delete task"
              >
                <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Stats Row -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ task.completion_percentage || 0 }}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Progress</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ task.subtasks?.length || 0 }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Subtasks</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ task.issues?.length || 0 }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Issues</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ task.attachments?.length || 0 }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Files</div>
            </div>
          </div>
        </div>

        <!-- Status and Priority Row -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div class="flex flex-wrap items-center gap-4">
            <!-- Status Badge -->
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
              <span
                class="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full"
                :class="getStatusBadgeClass(task.status)"
              >
                <span class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(task.status)"></span>
                {{ getStatusLabel(task.status) }}
              </span>
            </div>

            <!-- Priority Badge -->
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority:</span>
              <span
                class="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full"
                :class="getPriorityBadgeClass(task.priority)"
              >
                <svg class="w-3 h-3 mr-1" :class="getPriorityIconClass(task.priority)" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                {{ getPriorityLabel(task.priority) }}
              </span>
            </div>

            <!-- Task Type -->
            <div v-if="task.task_type" class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
              <span class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                {{ getTaskTypeLabel(task.task_type) }}
              </span>
            </div>

            <!-- Department -->
            <div v-if="task.department?.name" class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Department:</span>
              <span class="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                {{ task.department.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Bar (if has subtasks) -->
        <div v-if="task.subtasks && task.subtasks.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Subtask Progress</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ task.completion_percentage || 0 }}% Complete</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div
              class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${task.completion_percentage || 0}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{{ getCompletedSubtasksCount() }} completed</span>
            <span>{{ task.subtasks.length }} total</span>
          </div>
        </div>

        <!-- Additional Info Row -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Assignment -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  <template v-if="getAssigneeInfo(task).name">
                    {{ getAssigneeInfo(task).name }}
                  </template>
                  <template v-else>
                    Unassigned
                  </template>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Assignee</div>
              </div>
            </div>

            <!-- Due Date -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Due Date</div>
              </div>
            </div>

            <!-- Creator -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ task.creator?.name || 'Unknown' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Created by</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Blocked Reason Alert -->
        <div v-if="task.status === 'blocked' && task.blocked_reason" class="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800 dark:text-red-200">Task Blocked</h4>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ task.blocked_reason }}</p>
            </div>
          </div>
        </div>

        <!-- Time Tracking Summary -->
        <div v-if="task.estimated_hours || task.actual_hours" class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.estimated_hours || 0 }}h</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Estimated</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.actual_hours || 0 }}h</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Actual</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold" :class="getVarianceClass(task.estimated_hours, task.actual_hours)">
                  {{ calculateVariance(task.estimated_hours, task.actual_hours) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Variance</div>
              </div>
            </div>
            <div v-if="task.started_at || task.completed_at" class="text-right">
              <div v-if="task.started_at" class="text-sm text-gray-600 dark:text-gray-400">
                Started: {{ formatDateTime(task.started_at) }}
              </div>
              <div v-if="task.completed_at" class="text-sm text-gray-600 dark:text-gray-400">
                Completed: {{ formatDateTime(task.completed_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Context Information Cards -->
      <div v-if="hasContextData()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Logistics Context -->
        <LogisticsContextCard v-if="task.logisticsContext" :context="task.logisticsContext" />
        
        <!-- Design Context -->
        <DesignContextCard v-if="task.designContext" :context="task.designContext" />
        
        <!-- Finance Context -->
        <FinanceContextCard v-if="task.financeContext" :context="task.financeContext" />
      </div>

      <!-- Parent Task Information -->
      <div v-if="task.parentTask" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Parent Task
        </h3>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 dark:text-white mb-1">{{ task.parentTask.title }}</h4>
              <p v-if="task.parentTask.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {{ task.parentTask.description }}
              </p>
              <div class="flex items-center gap-4 text-sm">
                <span class="flex items-center gap-1">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeClass(task.parentTask.status)"
                  >
                    {{ getStatusLabel(task.parentTask.status) }}
                  </span>
                </span>
                <span class="flex items-center gap-1">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getPriorityBadgeClass(task.parentTask.priority)"
                  >
                    {{ getPriorityLabel(task.parentTask.priority) }}
                  </span>
                </span>
              </div>
            </div>
            <router-link
              :to="`/universal-tasks/${task.parentTask.id}`"
              class="ml-4 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              View Parent
            </router-link>
          </div>
        </div>
      </div>

      <!-- Dependencies Information -->
      <div v-if="task.dependencies && task.dependencies.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Dependencies
        </h3>
        <div class="space-y-3">
          <div
            v-for="dependency in task.dependencies"
            :key="dependency.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="getDependencyStatusColor(dependency)"></div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ dependency.dependsOnTask?.title || 'Unknown Task' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ getDependencyTypeLabel(dependency.dependency_type) }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusBadgeClass(dependency.dependsOnTask?.status)"
              >
                {{ getStatusLabel(dependency.dependsOnTask?.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignments -->
      <div v-if="task.assignments && task.assignments.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Task Assignments
        </h3>
        <div class="space-y-3">
          <div
            v-for="assignment in task.assignments"
            :key="assignment.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >

            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-xs font-medium text-blue-800 dark:text-blue-200">
                  {{ getUserInitials(assignment.user || assignment.assigned_user || assignment) }}
                </span>
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ getUserName(assignment.user || assignment.assigned_user || assignment) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <span v-if="(assignment.user || assignment.assigned_user) && getUserName(assignment.user || assignment.assigned_user) !== 'Unknown User'">
                    {{ getUserName(assignment.user || assignment.assigned_user) }}
                  </span>
                  <span v-else-if="assignment.role">
                    {{ assignment.role }}
                  </span>
                  <span v-if="assignment.is_primary" class="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    Primary
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500 dark:text-gray-400">Assigned by {{ getUserName(assignment.assignedBy || assignment.assigned_by || assignment.assigner || assignment) }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(assignment.assigned_at) }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Tags -->
      <div v-if="task.tags && task.tags.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Tags
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in task.tags"
            :key="tag"
            class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              ]"
            >
              <span>{{ tab.label }}</span>
              <span
                v-if="tab.count !== undefined && tab.count > 0"
                class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Task Details -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Task Details
                </h3>
                <dl class="space-y-4">
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Task Type</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ task.task_type || 'N/A' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Department</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ task.department?.name || 'N/A' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ task.creator?.name || 'Unknown' }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(task.created_at) }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(task.updated_at) }}</dd>
                  </div>
                  <div v-if="task.parent_task_id" class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Parent Task</dt>
                    <dd class="text-sm">
                      <router-link 
                        :to="`/universal-tasks/${task.parent_task_id}`"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {{ task.parentTask?.title || 'View Parent' }}
                      </router-link>
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Time Tracking -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time Tracking
                </h3>
                <dl class="space-y-4">
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Hours</dt>
                    <dd class="text-sm text-gray-900 dark:text-white font-medium">{{ task.estimated_hours || 0 }}h</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Hours</dt>
                    <dd class="text-sm text-gray-900 dark:text-white font-medium">{{ task.actual_hours || 0 }}h</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Variance</dt>
                    <dd
                      class="text-sm font-semibold"
                      :class="getVarianceClass(task.estimated_hours, task.actual_hours)"
                    >
                      {{ calculateVariance(task.estimated_hours, task.actual_hours) }}
                    </dd>
                  </div>
                  <div v-if="task.started_at" class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Started At</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(task.started_at) }}</dd>
                  </div>
                  <div v-if="task.completed_at" class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed At</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(task.completed_at) }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Client Information (only show for client-related tasks) -->
            <div v-if="task.taskable_type === 'App\\Modules\\ClientService\\Models\\Client'" class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Client Information
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Client Name</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.taskable?.full_name || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.taskable?.company_name || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Person</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.taskable?.contact_person || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.taskable?.email || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.taskable?.phone || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Client Status</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ task.taskable?.status || 'N/A' }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Metadata -->
            <div v-if="task.metadata && Object.keys(task.metadata).length > 0" class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Additional Information
              </h3>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(value, key) in task.metadata" :key="key">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{{ key.replace(/_/g, ' ') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ value || 'N/A' }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- Subtasks Tab -->
          <div v-if="activeTab === 'subtasks'">
            <SubtaskTree
              v-if="task.id"
              :task-id="task.id"
              :editable="true"
              :show-progress="true"
              @subtask-updated="handleSubtaskUpdated"
            />
            <div v-else class="text-center py-8 text-gray-500">
              Task ID not available
            </div>
          </div>

          <!-- Issues Tab -->
          <div v-if="activeTab === 'issues'">
            <TaskIssuePanel :task-id="task.id" @issue-updated="handleIssueUpdated" />
          </div>

          <!-- Experience Logs Tab -->
          <div v-if="activeTab === 'logs'">
            <ExperienceLogPanel :task-id="task.id" @log-updated="handleLogUpdated" />
          </div>

          <!-- Comments Tab -->
          <div v-if="activeTab === 'comments'">
            <TaskCommentPanel :task-id="task.id" @comment-added="handleCommentAdded" />
          </div>

          <!-- Attachments Tab -->
          <div v-if="activeTab === 'attachments'">
            <TaskAttachmentPanel :task-id="task.id" @attachment-added="handleAttachmentAdded" />
          </div>

          <!-- Time Tracking Tab -->
          <div v-if="activeTab === 'time'">
            <TaskTimeTrackingPanel :task-id="task.id" @time-entry-added="handleTimeEntryAdded" />
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'">
            <TaskHistoryPanel :task-id="task.id" />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <TaskFormDialog
      :visible="showEditDialog"
      :task="task"
      @update:visible="showEditDialog = $event"
      @saved="handleTaskUpdated"
    />

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Task</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteDialog = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/taskStore'
import { useAuth } from '../../../composables/useAuth'
import { TASK_STATUSES, TASK_PRIORITIES, TASK_TYPES } from '../constants'
import type { Task } from '../types'
import { formatDate, formatDateTime } from '../utils/dateUtils'

// Components
import SubtaskTree from '../components/SubtaskTree.vue'
import TaskIssuePanel from '../components/TaskIssuePanel.vue'
import TaskFormDialog from '../components/TaskFormDialog.vue'
import TaskCommentPanel from '../components/TaskCommentPanel.vue'
import TaskAttachmentPanel from '../components/TaskAttachmentPanel.vue'
import TaskTimeTrackingPanel from '../components/TaskTimeTrackingPanel.vue'
import TaskHistoryPanel from '../components/TaskHistoryPanel.vue'
import ExperienceLogPanel from '../components/ExperienceLogPanel.vue'
import LogisticsContextCard from '../components/LogisticsContextCard.vue'
import DesignContextCard from '../components/DesignContextCard.vue'
import FinanceContextCard from '../components/FinanceContextCard.vue'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

// Store
const taskStore = useTaskStore()
const { currentTask, loading, errors } = storeToRefs(taskStore)

const task = computed(() => currentTask.value)
const error = computed(() => errors.value.task || null)
const canDelete = computed(() => {
  return user.value && user.value.roles && (user.value.roles.includes('Admin') || user.value.roles.includes('Super Admin'))
})

const getAssigneeInfo = (task: any) => {
  // Check for assignments first (newer structure)
  if (task.assignments && task.assignments.length > 0) {
    const primary = task.assignments.find((a: any) => a.is_primary);
    const assignment = primary || task.assignments[0];
    const user = assignment.user;
    if (user && user.name) {
      return {
        name: user.name,
        initials: user.name.charAt(0).toUpperCase()
      };
    }
  }
  
  // Fallback to assignedUser (older structure)
  if (task.assignedUser && task.assignedUser.name) {
    return {
      name: task.assignedUser.name,
      initials: task.assignedUser.name.charAt(0).toUpperCase()
    };
  }
  
  // Fallback to assigned_user relationship
  if (task.assigned_user && task.assigned_user.name) {
    return {
      name: task.assigned_user.name,
      initials: task.assigned_user.name.charAt(0).toUpperCase()
    };
  }
  
  return { name: '', initials: '' };
}

const getUserName = (user: any) => {
  // Handle null/undefined case
  if (!user) return 'Unknown User';
  
  // Handle direct string values
  if (typeof user === 'string' && user.trim() !== '') return user;
  
  // Handle numeric IDs
  if (typeof user === 'number') return `User #${user}`;
  
  // Handle direct properties
  if (user.name) return user.name;
  if (user.email) return user.email;
  if (user.full_name) return user.full_name;
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }
  
  // Special handling for assignment objects
  // If this is an assignment object, try to get the user from the expected properties
  if (user.user && typeof user.user === 'object') {
    return getUserName(user.user);
  }
  
  if (user.assignedBy && typeof user.assignedBy === 'object') {
    return getUserName(user.assignedBy);
  }
  
  // Handle ID references
  if (user.user_id || user.userId) {
    const id = user.user_id || user.userId;
    return `User #${id}`;
  }
  
  // Handle different property names for user objects
  const userObj = user.assigned_user || user.assignee || user.created_by || user.assigner;
  if (userObj && typeof userObj === 'object') {
    return getUserName(userObj);
  }
  
  // If we have an object but can't extract name, show its keys for debugging
  if (typeof user === 'object' && user !== null) {
    const keys = Object.keys(user);
    if (keys.length > 0) {
      // Special handling for assignment objects that might have user data in unexpected places
      if (user.assignee_name) return user.assignee_name;
      if (user.assigner_name) return user.assigner_name;
      
      // For debugging purposes, return the user ID if available
      if (user.id && user.id !== undefined) {
        return `User #${user.id}`;
      }
      
      // Return a more informative debug message
      return `Unknown User (${keys.join(', ')})`;
    }
  }
  
  return 'Unknown User';
};

const getUserInitials = (user: any) => {
  const name = getUserName(user);
  if (name === 'Unknown User' || name.startsWith('User #')) return 'U';
  
  // Extract initials from name (handle multiple words)
  const words = name.split(' ').filter(word => word.length > 0);
  if (words.length === 0) return 'U';
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  // For two or more words, take first letter of first and last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const activeTab = ref('overview')
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const tabs = computed(() => [
  { id: 'overview', label: 'Overview', count: undefined },
  { id: 'subtasks', label: 'Subtasks', count: task.value?.subtasks?.length },
  { id: 'issues', label: 'Issues', count: task.value?.issues?.length },
  { id: 'comments', label: 'Comments', count: task.value?.comments?.length },
  { id: 'attachments', label: 'Attachments', count: task.value?.attachments?.length },
])

// Load task on mount
onMounted(async () => {
  await fetchTask()
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await fetchTask()
  }
})

// Watch for task changes to update page title
watch(() => task.value, (newTask) => {
  if (newTask?.title) {
    document.title = `${newTask.title} - Task Details`
  } else {
    document.title = 'Task Details'
  }
}, { immediate: true })

/**
 * Fetches task data from the store
 */
const fetchTask = async () => {
  const taskId = parseInt(route.params.id as string)
  if (isNaN(taskId)) {
    error.value = 'Invalid task ID'
    return
  }

  await taskStore.fetchTask(taskId)

  if (!task.value && !loading.value.task) {
    // Task not found, redirect to list
    router.push('/universal-tasks')
  }
}


// Utility functions
const getStatusLabel = (status?: string | null) => {
  if (!status) return 'Not Set'
  const def = TASK_STATUSES[status as keyof typeof TASK_STATUSES]
  return def?.label || status
}

const getPriorityLabel = (priority?: string | null) => {
  if (!priority) return 'Not Set'
  const def = TASK_PRIORITIES[priority as keyof typeof TASK_PRIORITIES]
  return def?.label || priority
}

const getTaskTypeLabel = (type?: string | null) => {
  if (!type) return 'N/A'
  const def = TASK_TYPES[type as keyof typeof TASK_TYPES]
  return def?.label || type
}

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    review: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusDotClass = (status: string): string => {
  const classMap: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-blue-500',
    pending: 'bg-yellow-500',
    blocked: 'bg-red-500',
    overdue: 'bg-red-500',
    cancelled: 'bg-gray-500',
    review: 'bg-purple-500'
  }
  return classMap[status] || 'bg-gray-500'
}

const getPriorityBadgeClass = (priority: string): string => {
  const classMap: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classMap[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getPriorityIconClass = (priority: string): string => {
  const classMap: Record<string, string> = {
    low: 'text-green-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500'
  }
  return classMap[priority] || 'text-gray-500'
}

const getDependencyTypeLabel = (type?: string) => {
  const typeMap: Record<string, string> = {
    blocks: 'Blocks',
    relates_to: 'Relates To',
    blocked_by: 'Blocked By'
  }
  return typeMap[type || ''] || type || 'Unknown'
}

const getDependencyStatusColor = (dependency: any) => {
  const status = dependency.dependsOnTask?.status || 'unknown'
  const classMap: Record<string, string> = {
    completed: 'bg-green-500',
    in_progress: 'bg-blue-500',
    pending: 'bg-yellow-500',
    blocked: 'bg-red-500',
    overdue: 'bg-red-500',
    cancelled: 'bg-gray-500',
    unknown: 'bg-gray-500'
  }
  return classMap[status] || 'bg-gray-500'
}

const calculateVariance = (estimated?: number, actual?: number) => {
  if (!estimated || !actual) return 'N/A'
  const variance = actual - estimated
  return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}h`
}

const getVarianceClass = (estimated?: number, actual?: number) => {
  if (!estimated || !actual) return 'text-gray-600 dark:text-gray-400'
  const variance = actual - estimated
  if (variance > 0) return 'text-red-600 dark:text-red-400'
  if (variance < 0) return 'text-green-600 dark:text-green-400'
  return 'text-gray-600 dark:text-gray-400'
}

const getCompletedSubtasksCount = () => {
  if (!task.value?.subtasks) return 0
  return task.value.subtasks.filter(subtask => subtask.status === 'completed').length
}

const hasContextData = () => {
  return task.value && (
    task.value.logisticsContext ||
    task.value.designContext ||
    task.value.financeContext
  )
}

// Event handlers
const handleTaskUpdated = async () => {
  showEditDialog.value = false
  await fetchTask()
}

const handleSubtaskUpdated = async () => {
  await fetchTask()
}

const handleIssueUpdated = async () => {
  await fetchTask()
}

const handleAttachmentAdded = async () => {
  await fetchTask()
}

const handleCommentAdded = async () => {
  await fetchTask()
}

const handleLogUpdated = async () => {
  await fetchTask()
}

const handleTimeEntryAdded = async () => {
  await fetchTask()
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!task.value) return

  const success = await taskStore.deleteTask(task.value.id)
  showDeleteDialog.value = false

  if (success) {
    router.push('/universal-tasks')
  } else {
    alert(`Delete failed: ${taskStore.errors.delete || 'Unknown error'}`)
  }
}
</script>

<style scoped>
.task-detail-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

.dark .task-detail-view {
  background-color: #111827;
}

/* Custom scrollbar for tabs */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Gradient animation */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
</style>
