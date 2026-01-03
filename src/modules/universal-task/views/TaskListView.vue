<template>
  <div class="task-list-view">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-6">
        <button
          @click="router.push('/projects/enquiries')"
          class="h-12 w-12 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center group"
          title="Back to Enquiries"
        >
          <svg class="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Strategic Tasks</h1>
          <p class="text-slate-500 font-medium mt-1">Manage and track your operational deployment missions.</p>
        </div>
      </div>
      <button
        @click="openCreateDialog"
        class="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-all active:scale-95 font-bold shadow-lg shadow-blue-500/20"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Deployment Task
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Search -->
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search tasks..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @input="debouncedSearch"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="applyFilters"
          >
            <option value="">All Statuses</option>
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
          <select
            v-model="filters.priority"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="applyFilters"
          >
            <option value="">All Priorities</option>
            <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Advanced Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
          <select
            v-model="filters.department_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="applyFilters"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <!-- Assignee Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignee</label>
          <select
            v-model="filters.assigned_user_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="applyFilters"
          >
            <option value="">All Users</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date From</label>
          <input
            v-model="filters.due_date_from"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            @change="applyFilters"
          />
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex justify-between items-center mt-4">
        <div class="flex gap-2">
          <button
            @click="clearFilters"
            class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm flex items-center gap-1 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Clear Filters
          </button>
          <button
            @click="showSaveViewDialog = true"
            class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm flex items-center gap-1 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save View
          </button>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ pagination.total }} tasks found
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Loading State -->
      <div v-if="loading.tasks" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="tasks.length === 0" class="p-8 text-center">
        <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first task.</p>
        <button
          @click="showCreateDialog = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </button>
      </div>

      <!-- Task Grid/List -->
      <div v-else>
        <!-- View Toggle -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div class="flex gap-2">
            <button
              :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300': viewMode === 'list' }"
              class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="viewMode = 'list'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300': viewMode === 'grid' }"
              class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="viewMode = 'grid'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300': viewMode === 'hierarchical' }"
              class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="viewMode = 'hierarchical'"
              title="Hierarchical View"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
              </svg>
            </button>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing {{ (pagination.page - 1) * pagination.per_page + 1 }} -
            {{ Math.min(pagination.page * pagination.per_page, pagination.total) }}
            of {{ pagination.total }}
          </div>
        </div>

        <!-- List View -->
        <div v-if="viewMode === 'list'" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Task</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtasks</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assignee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="getStatusColor(task.status)"
                    ></div>
                    <div>
                      <div class="flex items-center gap-2">
                        <div class="font-medium text-gray-900 dark:text-white">{{ task.title }}</div>
                        <span
                          v-if="task.parent_task_id"
                          class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
                          title="This is a subtask"
                        >
                          Subtask
                        </span>
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {{ task.description || 'No description' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeClass(task.status)"
                  >
                    {{ getStatusLabel(task.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getPriorityBadgeClass(task.priority)"
                  >
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900 dark:text-white">{{ task.subtasks_count ?? 0 }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="getAssigneeInfo(task).name" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                      {{ getAssigneeInfo(task).initials }}
                    </div>
                    <span class="text-sm text-gray-900 dark:text-white">{{ getAssigneeInfo(task).name }}</span>
                  </div>
                  <span v-else class="text-gray-400 dark:text-gray-500 text-sm">Unassigned</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="task.due_date" class="text-sm">
                    <div class="text-gray-900 dark:text-white">{{ formatDate(task.due_date) }}</div>
                    <div
                      v-if="isOverdue(task.due_date, task.status)"
                      class="text-red-600 dark:text-red-400 font-medium"
                    >
                      Overdue
                    </div>
                  </div>
                  <span v-else class="text-gray-400 dark:text-gray-500">No due date</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-1">
                    <button
                      @click="viewTask(task)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1"
                      title="View"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="editTask(task)"
                      class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="canDelete"
                      @click="confirmDelete(task)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-shadow"
              @click="viewTask(task)"
            >
              <div class="flex justify-between items-start mb-3">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusBadgeClass(task.status)"
                >
                  {{ getStatusLabel(task.status) }}
                </span>
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getPriorityBadgeClass(task.priority)"
                >
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                    {{ task.title }}
                  </h3>
                  <span
                    v-if="task.parent_task_id"
                    class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
                    title="This is a subtask"
                  >
                    Subtask
                  </span>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                  {{ task.description || 'No description' }}
                </p>

                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm">
                    <div v-if="getAssigneeInfo(task).name" class="flex items-center gap-2">
                      <div class="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                        {{ getAssigneeInfo(task).initials }}
                      </div>
                      <span class="text-gray-900 dark:text-white">{{ getAssigneeInfo(task).name }}</span>
                    </div>
                    <span v-else class="text-gray-400 dark:text-gray-500">Unassigned</span>

                    <div v-if="task.due_date" class="text-right">
                      <div class="text-gray-900 dark:text-white">{{ formatDate(task.due_date) }}</div>
                      <div
                        v-if="isOverdue(task.due_date, task.status)"
                        class="text-red-600 dark:text-red-400 font-medium text-xs"
                      >
                        Overdue
                      </div>
                    </div>
                  </div>

                  <div v-if="(task.subtasks_count || 0) > 0" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ task.subtasks_count || 0 }} subtask{{ (task.subtasks_count || 0) === 1 ? '' : 's' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hierarchical View -->
        <div v-else-if="viewMode === 'hierarchical'" class="p-4">
          <div class="space-y-3">
            <div
              v-for="task in rootTasks"
              :key="task.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <!-- Parent Task -->
              <div 
                class="bg-white dark:bg-gray-800 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="toggleTaskExpansion(task.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <button 
                      v-if="subtasksByParentId[task.id] && subtasksByParentId[task.id].length > 0"
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      @click.stop
                    >
                      <svg 
                        class="w-5 h-5 transform transition-transform duration-200"
                        :class="{ 'rotate-90': expandedTasks.has(task.id) }"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="getStatusColor(task.status)"
                    ></div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ task.title }}</div>
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusBadgeClass(task.status)"
                    >
                      {{ getStatusLabel(task.status) }}
                    </span>
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getPriorityBadgeClass(task.priority)"
                    >
                      {{ getPriorityLabel(task.priority) }}
                    </span>
                    <span
                      v-if="subtasksByParentId[task.id] && subtasksByParentId[task.id].length > 0"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {{ subtasksByParentId[task.id].length }} subtask{{ subtasksByParentId[task.id].length === 1 ? '' : 's' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div v-if="getAssigneeInfo(task).name" class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                        {{ getAssigneeInfo(task).initials }}
                      </div>
                      <span class="text-sm text-gray-900 dark:text-white">{{ getAssigneeInfo(task).name }}</span>
                    </div>
                    <span v-else class="text-gray-400 dark:text-gray-500 text-sm">Unassigned</span>
                    <div v-if="task.due_date" class="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {{ formatDate(task.due_date) }}
                    </div>
                    <div class="flex gap-1 ml-2">
                      <button
                        @click.stop="viewTask(task)"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1"
                        title="View"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        @click.stop="editTask(task)"
                        class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1"
                        title="Edit"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="canDelete"
                        @click.stop="confirmDelete(task)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"
                        title="Delete"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-8">
                  {{ task.description }}
                </div>
              </div>

              <!-- Subtasks -->
              <div 
                v-if="expandedTasks.has(task.id) && subtasksByParentId[task.id] && subtasksByParentId[task.id].length > 0"
                class="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600"
              >
                <div 
                  v-for="subtask in subtasksByParentId[task.id]" 
                  :key="subtask.id"
                  class="p-3 pl-12 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center">
                        <!-- Indentation lines -->
                        <div class="w-4 h-px bg-gray-300 dark:bg-gray-500 mr-2"></div>
                        <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <div
                        class="w-2 h-2 rounded-full"
                        :class="getStatusColor(subtask.status)"
                      ></div>
                      <div class="font-medium text-gray-800 dark:text-gray-200">{{ subtask.title }}</div>
                      <span
                        class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
                      >
                        Subtask
                      </span>
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusBadgeClass(subtask.status)"
                      >
                        {{ getStatusLabel(subtask.status) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div v-if="getAssigneeInfo(subtask).name" class="flex items-center gap-2">
                        <div class="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                          {{ getAssigneeInfo(subtask).initials }}
                        </div>
                        <span class="text-sm text-gray-800 dark:text-gray-200">{{ getAssigneeInfo(subtask).name }}</span>
                      </div>
                      <span v-else class="text-gray-400 dark:text-gray-500 text-sm">Unassigned</span>
                      <div v-if="subtask.due_date" class="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {{ formatDate(subtask.due_date) }}
                      </div>
                      <div class="flex gap-1 ml-2">
                        <button
                          @click.stop="viewTask(subtask)"
                          class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1"
                          title="View"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          @click.stop="editTask(subtask)"
                          class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1"
                          title="Edit"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          v-if="canDelete"
                          @click.stop="confirmDelete(subtask)"
                          class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1"
                          title="Delete"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-if="subtask.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-10">
                    {{ subtask.description }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State for Hierarchical View -->
            <div v-if="rootTasks.length === 0" class="p-8 text-center">
              <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first task.</p>
              <button
                @click="showCreateDialog = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </button>
            </div>
          </div>
        </div>        <!-- Pagination -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
              <select
                v-model="pagination.per_page"
                @change="onPageChange({ page: 0, rows: parseInt(pagination.per_page) })"
                class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="onPageChange({ page: pagination.page - 2, rows: pagination.per_page })"
                :disabled="pagination.page <= 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Previous
              </button>

              <span class="text-sm text-gray-700 dark:text-gray-300">
                Page {{ pagination.page }} of {{ Math.ceil(pagination.total / pagination.per_page) }}
              </span>

              <button
                @click="onPageChange({ page: pagination.page, rows: pagination.per_page })"
                :disabled="pagination.page >= Math.ceil(pagination.total / pagination.per_page)"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TaskFormDialog
      v-if="showCreateDialog"
      :visible="showCreateDialog"
      :task="editingTask"
      @update:visible="showCreateDialog = $event"
      @saved="handleTaskSaved"
      @cancelled="handleTaskCancelled"
    />

    <!-- Save View Dialog -->
    <div v-if="showSaveViewDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Save View</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View Name</label>
              <input
                v-model="viewName"
                type="text"
                placeholder="Enter view name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Optional)</label>
              <textarea
                v-model="viewDescription"
                placeholder="Describe this view"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showSaveViewDialog = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveView"
              :disabled="savingView"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="savingView" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Save View
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Task</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to delete this task? This action cannot be undone.</p>
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
              @click="confirmDeleteAction"
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
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/taskStore'
import { useAuth } from '../../../composables/useAuth'
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants'
import type { Task } from '../types'
import TaskFormDialog from '../components/TaskFormDialog.vue'

const router = useRouter()
const { user } = useAuth()

// Store
const taskStore = useTaskStore()
const {
  tasks,
  filters,
  pagination,
  loading
} = storeToRefs(taskStore)

// Computed
const canDelete = computed(() => {
  if (!user.value) return false
  const userRoles = user.value.roles || []
  // TEMPORARY: Allow deletion for testing - remove Admin/Super Admin restriction
  // TODO: Restore this check: return userRoles.includes('Admin') || userRoles.includes('Super Admin')
  return true // Allow all authenticated users to delete for testing
})

// Local state
const viewMode = ref<'list' | 'grid' | 'hierarchical'>('list')
const showCreateDialog = ref(false)
const showSaveViewDialog = ref(false)
const showDeleteDialog = ref(false)
const editingTask = ref<Task | null>(null)
const taskToDelete = ref<Task | null>(null)
const viewName = ref('')
const viewDescription = ref('')
const savingView = ref(false)
const dateRange = ref<Date[]>([])
const expandedTasks = ref<Set<number>>(new Set())

// Mock data (would come from other stores in real app)
const departments = ref([
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Marketing' }
])

const users = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
])

// Computed properties for hierarchical view
const rootTasks = computed(() => {
  // Filter out subtasks (tasks with parent_task_id) to get only root tasks
  return tasks.value.filter(task => !task.parent_task_id)
})

const subtasksByParentId = computed(() => {
  // Group subtasks by their parent task ID
  const subtasks: Record<number, Task[]> = {}
  
  tasks.value.forEach(task => {
    if (task.parent_task_id) {
      if (!subtasks[task.parent_task_id]) {
        subtasks[task.parent_task_id] = []
      }
      subtasks[task.parent_task_id].push(task)
    }
  })
  
  return subtasks
})

// Computed
const statusOptions = computed(() =>
  Object.entries(TASK_STATUSES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

const priorityOptions = computed(() =>
  Object.entries(TASK_PRIORITIES).map(([value, config]) => ({
    value,
    label: config.label
  }))
)

// Methods
const toggleTaskExpansion = (taskId: number) => {
  const newExpanded = new Set(expandedTasks.value)
  if (newExpanded.has(taskId)) {
    newExpanded.delete(taskId)
  } else {
    newExpanded.add(taskId)
  }
  expandedTasks.value = newExpanded
}

const debouncedSearch = (() => {
  let timeout: number
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      applyFilters()
    }, 300)
  }
})()

const applyFilters = () => {
  taskStore.fetchTasks({ filters: filters.value })
}

const applyDateFilters = () => {
  if (dateRange.value.length === 2) {
    filters.value.due_date_from = dateRange.value[0].toISOString().split('T')[0]
    filters.value.due_date_to = dateRange.value[1].toISOString().split('T')[0]
  } else {
    filters.value.due_date_from = undefined
    filters.value.due_date_to = undefined
  }
  applyFilters()
}

const clearFilters = () => {
  filters.value = {}
  dateRange.value = []
  taskStore.resetFilters()
  taskStore.fetchTasks()
}

const openCreateDialog = () => {
  editingTask.value = null
  showCreateDialog.value = true
}

const onPageChange = (event: any) => {
  taskStore.fetchTasks({
    pagination: {
      page: event.page + 1,
      per_page: event.rows
    }
  })
}

const viewTask = (task: Task) => {
  router.push(`/universal-tasks/${task.id}`)
}

const editTask = (task: Task) => {
  editingTask.value = task
  showCreateDialog.value = true
}

const confirmDelete = (task: Task) => {
  taskToDelete.value = task
  showDeleteDialog.value = true
}

const confirmDeleteAction = async () => {
  if (!taskToDelete.value) return

  const success = await taskStore.deleteTask(taskToDelete.value.id)
  showDeleteDialog.value = false

  if (success) {
    // Simple alert instead of toast
    alert('Task deleted successfully')
  } else {
    // Show the actual error message from the store
    const errorMessage = taskStore.errors.delete || 'Failed to delete task'
    alert(`Delete failed: ${errorMessage}`)
    console.log('User roles:', user.value?.roles)
    console.log('Can delete:', canDelete.value)
  }

  taskToDelete.value = null
}


const handleTaskSaved = async (_task?: Task) => {
  showCreateDialog.value = false
  editingTask.value = null
  await taskStore.fetchTasks()
}

const handleTaskCancelled = () => {
  showCreateDialog.value = false
  editingTask.value = null
}

const saveView = async () => {
  if (!viewName.value.trim()) {
    alert('View name is required')
    return
  }

  savingView.value = true
  try {
    // Save view logic would go here
    console.log('Saving view:', {
      name: viewName.value,
      description: viewDescription.value,
      filters: filters.value
    })

    showSaveViewDialog.value = false
    viewName.value = ''
    viewDescription.value = ''

    alert('View saved successfully')
  } catch (error) {
    alert('Failed to save view')
  } finally {
    savingView.value = false
  }
}

// Utility methods
const getStatusColor = (status: string) => {
  return TASK_STATUSES[status as keyof typeof TASK_STATUSES]?.color || 'gray'
}

const getUserName = (user: any) => {
  // Handle null/undefined case
  if (!user) return '';
  
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
  
  // Handle nested user data
  if (user.user && typeof user.user === 'object') {
    return getUserName(user.user);
  }
  
  // Handle ID references
  if (user.user_id || user.userId) {
    const id = user.user_id || user.userId;
    return `User #${id}`;
  }
  
  // Handle different property names for user objects
  const userObj = user.assigned_user || user.assignee || user.created_by;
  if (userObj && typeof userObj === 'object') {
    return getUserName(userObj);
  }
  
  return '';
};

const getUserInitials = (user: any) => {
  const name = getUserName(user);
  if (!name || name.startsWith('User #')) return '';
  
  // Extract initials from name (handle multiple words)
  const words = name.split(' ').filter(word => word.length > 0);
  if (words.length === 0) return '';
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  // For two or more words, take first letter of first and last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const getAssigneeInfo = (task: any) => {
  // Check for assignments first (newer structure)
  if (task.assignments && task.assignments.length > 0) {
    const primary = task.assignments.find((a: any) => a.is_primary);
    const assignment = primary || task.assignments[0];
    const user = assignment.user;
    const userName = getUserName(user);
    if (userName) {
      return {
        name: userName,
        initials: getUserInitials(user)
      };
    }
  }
  
  // Fallback to assignedUser (older structure)
  const assignedUserName = getUserName(task.assignedUser);
  if (assignedUserName) {
    return {
      name: assignedUserName,
      initials: getUserInitials(task.assignedUser)
    };
  }
  
  // Fallback to assigned_user relationship
  const assigned_userName = getUserName(task.assigned_user);
  if (assigned_userName) {
    return {
      name: assigned_userName,
      initials: getUserInitials(task.assigned_user)
    };
  }
  
  // Check for assigned_user_id and users data
  if (task.assigned_user_id && users.value) {
    const user = users.value.find(u => u.id === task.assigned_user_id);
    if (user) {
      return {
        name: user.name,
        initials: user.name.charAt(0).toUpperCase()
      };
    }
  }
  
  return { name: '', initials: '' };
}

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
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

const getStatusLabel = (status?: string | null) => {
  if (!status) return 'Unknown'
  const def = TASK_STATUSES[status as keyof typeof TASK_STATUSES]
  return def?.label || status || 'Unknown'
}

const getPriorityLabel = (priority?: string | null) => {
  if (!priority) return 'Unknown'
  const def = TASK_PRIORITIES[priority as keyof typeof TASK_PRIORITIES]
  return def?.label || priority || 'Unknown'
}

const getStatusSeverity = (status: string): 'success' | 'info' | 'warning' | 'danger' => {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    completed: 'success',
    in_progress: 'info',
    pending: 'warning',
    blocked: 'danger',
    overdue: 'danger'
  }
  return severityMap[status] || 'info'
}

const getPrioritySeverity = (priority: string): 'success' | 'info' | 'warning' | 'danger' => {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    urgent: 'danger'
  }
  return severityMap[priority] || 'info'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const isOverdue = (dueDate: string, status: string) => {
  return status !== 'completed' && new Date(dueDate) < new Date()
}

// Lifecycle
onMounted(() => {
  taskStore.fetchTasks()
  taskStore.loadFiltersFromStorage()
})

// Watchers
watch(() => filters.value, () => {
  taskStore.saveFiltersToStorage()
}, { deep: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>