<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/projects" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Projects
          </router-link>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Enquiries</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Enquiries Table View -->
    <div>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Project Enquiries</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage project enquiries and track progress</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="openLogisticsLogModal()"
            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ml-3"
          >
            View Logistics Log
          </button>
                    <button
            v-if="canLogEnquiry"
            @click="showCreateModal = true"
            class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Log Enquiry
          </button>
        </div>
      </div>

    <!-- Status Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex space-x-1">
        <button
          v-for="status in statusTabs"
          :key="status.key"
          @click="activeTab = status.key"
          :class="activeTab === status.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {{ status.label }} ({{ status.count }})
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search enquiries..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="client_registered">Client Registered</option>
          <option value="enquiry_logged">Enquiry Logged</option>
          <option value="site_survey_completed">Site Survey Completed</option>
          <option value="design_completed">Design Completed</option>
          <option value="design_approved">Design Approved</option>
          <option value="materials_specified">Materials Specified</option>
          <option value="budget_created">Budget Created</option>
          <option value="quote_prepared">Quote Prepared</option>
          <option value="quote_approved">Quote Approved</option>
          <option value="converted_to_project">Converted to Project</option>
          <option value="planning">Planning</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Enquiries Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading enquiries...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enquiry
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact Person
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project Officer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Enquiry/Job Number
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                My Tasks
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
           <template v-for="enquiry in filteredEnquiries" :key="enquiry.id">
             <tr>
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.title }}</div>
                 <div class="text-sm text-gray-500 dark:text-gray-400">{{ (enquiry.description || '').substring(0, 50) }}{{ (enquiry.description || '').length > 50 ? '...' : '' }}</div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 {{ enquiry.client?.full_name || enquiry.client?.FullName || 'Unknown Client' }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                   {{ enquiry.contact_person }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 {{ enquiry.project_officer?.name || 'Not assigned' }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span :class="getStatusColor(enquiry.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                   {{ getStatusLabel(enquiry.status) }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 <div v-if="enquiry.job_number" class="font-semibold text-blue-600 dark:text-blue-400">
                   {{ enquiry.job_number }}
                 </div>
                 <div v-else class="text-gray-500">
                   {{ enquiry.enquiry_number }}
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                   {{ getUserTaskCount(enquiry) }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="hasPrivilegedAccess"
                    @click="editEnquiry(enquiry)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="viewEnquiryDetails(enquiry)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                  >
                    View
                  </button>
                  <button
                    v-if="hasPrivilegedAccess"
                    @click="openTaskAssignment(enquiry)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                     <span>&rarrpl;</span>Assign Tasks
                  </button>
                 <router-link
                   :to="`/projects/tasks?enquiry_id=${enquiry.id}`"
                   class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                 >
                   Tasks&rarr;
                 </router-link>
                  <button
                    v-if="canConvertToProject(enquiry)"
                    @click="convertToProject(enquiry.id)"
                    class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                  >
                    Convert to Project
                  </button>
                  <button
                    v-if="user?.roles?.includes('Super Admin')"
                    @click="confirmDelete(enquiry)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Enquiry"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
             </tr>

           </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="pagination.total > PAGINATION_PER_PAGE"
        :current-page="pagination.current_page"
        :total-items="pagination.total"
        :items-per-page="PAGINATION_PER_PAGE"
        @page-change="handlePageChange"
      />
    </div>
    </div>

    <!-- Create/Edit Enquiry Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ editingEnquiry ? 'Edit Enquiry' : 'Log New Enquiry' }}
        </h2>

        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in modalTabs"
              :key="tab.key"
              @click="activeModalTab = tab.key"
              :class="activeModalTab === tab.key
                ? 'border-primary text-primary dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <form @submit.prevent="handleFormSubmit" @keydown.enter.prevent="handleFormSubmit" class="space-y-4">
          <!-- Basic Information Tab -->
          <div v-if="activeModalTab === 'basic'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Received *</label>
                <input
                  v-model="enquiryFormData.date_received"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery Date</label>
                <input
                  v-model="enquiryFormData.expected_delivery_date"
                  type="date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client *</label>
              <select
                v-model="enquiryFormData.client_id"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a client</option>
                <option v-for="client in activeClients" :key="client.id" :value="client.id">
                  {{ client.FullName }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title *</label>
              <input
                ref="titleInputRef"
                v-model="enquiryFormData.title"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Description *</label>
              <textarea
                v-model="enquiryFormData.description"
                required
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Scope</label>
              <textarea
                v-model="enquiryFormData.project_scope"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- Contact & Priority Tab -->
          <div v-if="activeModalTab === 'contact'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person *</label>
                <input
                  v-model="enquiryFormData.contact_person"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  v-model="enquiryFormData.priority"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Officer</label>
              <select
                v-model="enquiryFormData.project_officer_id"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a project officer</option>
                <option
                  v-for="officer in availableProjectOfficers"
                  :key="officer.id"
                  :value="officer.id"
                >
                  {{ officer.name }} ({{ officer.email }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
              <select
                v-model="enquiryFormData.status"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="client_registered">Client Registered</option>
                <option value="enquiry_logged">Enquiry Logged</option>
                <option value="site_survey_completed">Site Survey Completed</option>
                <option value="design_completed">Design Completed</option>
                <option value="design_approved">Design Approved</option>
                <option value="materials_specified">Materials Specified</option>
                <option value="budget_created">Budget Created</option>
                <option value="quote_prepared">Quote Prepared</option>
                <option value="quote_approved">Quote Approved</option>
                <option value="converted_to_project">Converted to Project</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <!-- Assignment & Venue Tab -->
          <div v-if="activeModalTab === 'assignment'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
              <input
                v-model="enquiryFormData.venue"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Notes</label>
              <textarea
                v-model="enquiryFormData.follow_up_notes"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <!-- Site Survey Tab -->
          <div v-if="activeModalTab === 'survey'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    v-model="enquiryFormData.site_survey_skipped"
                    type="checkbox"
                    class="mr-2"
                  />
                  Skip Site Survey
                </label>
              </div>
              <div v-if="enquiryFormData.site_survey_skipped">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Skip Reason</label>
                <input
                  v-model="enquiryFormData.site_survey_skip_reason"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </form>

        <!-- Tab Navigation Buttons -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="previousTab"
            :disabled="activeModalTab === 'basic'"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div class="flex space-x-3">
            <button
              v-if="activeModalTab !== 'survey'"
              @click="nextTab"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
            <button
              v-if="activeModalTab === 'survey'"
              @click="handleFormSubmit"
              :disabled="saving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ saving ? 'Saving...' : (editingEnquiry ? 'Update Enquiry' : 'Log Enquiry') }}
            </button>
          </div>
        </div>

        <div v-if="formError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ formError }}
        </div>

        <div v-if="formSuccess" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          {{ formSuccess }}
        </div>

        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            :disabled="saving"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Task Assignment Modal -->
    <TaskAssignmentModal
      :show="showTaskAssignmentModal"
      :enquiry-id="selectedEnquiry?.id || 0"
      :enquiry="selectedEnquiry || undefined"
      @close="closeTaskAssignmentModal"
      @task-assigned="handleTaskAssigned"
    />

    <!-- Logistics Log Modal -->
    <div v-if="showLogisticsLogModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-8xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Logistics Log - All Projects
          </h2>
          <button
            @click="closeLogisticsLogModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Add New Entry Button and Filters -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            @click="showAddEntryForm = !showAddEntryForm"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>{{ showAddEntryForm ? 'Cancel' : 'Add New Entry' }}</span>
          </button>

          <!-- Status Filter -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
            <select
              v-model="logisticsStatusFilter"
              @change="applyLogisticsFilter"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <!-- Add Entry Form -->
        <div v-if="showAddEntryForm" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Logistics Entry</h3>
          <form @submit.prevent="addLogisticsEntry" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name *</label>
                <select
                  v-model="logisticsEntryForm.project_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a project</option>
                  <option
                    v-for="enquiry in enquiries"
                    :key="enquiry.id"
                    :value="enquiry.id"
                  >
                    {{ enquiry.title }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site</label>
                <input
                  v-model="logisticsEntryForm.site"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter site location"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loading Time</label>
                <input
                  v-model="logisticsEntryForm.loading_time"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure</label>
                <input
                  v-model="logisticsEntryForm.departure"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Allocated</label>
                <input
                  v-model="logisticsEntryForm.vehicle_allocated"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Truck ABC-123"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Officer Incharge</label>
                <input
                  v-model="logisticsEntryForm.project_officer_incharge"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter officer name"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
              <textarea
                v-model="logisticsEntryForm.remarks"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Additional remarks or notes"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddEntryForm = false"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingLogisticsEntry"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <span v-if="savingLogisticsEntry" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ savingLogisticsEntry ? 'Saving...' : 'Save Entry' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Logistics Entries Table -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Logistics Entries</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">History of logistics activities for this project</p>
          </div>

          <div v-if="logisticsEntries.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No logistics entries found for this project.</p>
            <p class="text-sm mt-1">Add your first entry using the button above.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th @click="sortLogisticsEntries('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                    Date <span v-if="sortField === 'created_at'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Site</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loading Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Departure</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Officer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Remarks</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="entry in sortedLogisticsEntries" :key="entry.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(entry.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ getProjectName(entry.project_id) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ entry.site }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDateTime(entry.loading_time) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDateTime(entry.departure) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ entry.vehicle_allocated }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ entry.project_officer_incharge }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getLogisticsStatusColor(entry.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getLogisticsStatusLabel(entry.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {{ entry.remarks || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      v-if="entry.status === 'open'"
                      @click="closeLogisticsEntry(entry.id)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                    >
                      Close
                    </button>
                    <span v-else class="text-gray-500 dark:text-gray-400">Closed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeLogisticsLogModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Enquiry Detail Slide-Over -->
    <EnquiryDetailSlideOver
      :show="showDetailSlideOver"
      :enquiry="selectedEnquiry"
      @close="closeDetailSlideOver"
      @edit="handleEditFromSlideOver"
      @convert="handleConvertFromSlideOver"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { ProjectEnquiry, CreateProjectEnquiryData, UpdateProjectEnquiryData, EnquiryTask } from '../types/enquiry'
import { useClients } from '../../clientService/composables/useClients'
import { useProjectsEnquiries } from '../composables/useProjectsEnquiries'
import { useAuth } from '@/composables/useAuth'
import TaskAssignmentModal from '../components/TaskAssignmentModal.vue'
import EnquiryDetailSlideOver from '../components/EnquiryDetailSlideOver.vue'
import Pagination from '@/components/Pagination.vue'
import { ENQUIRY_STATUS_LABELS, ENQUIRY_STATUS_COLORS, PAGINATION_PER_PAGE } from '../constants/enquiryConstants'
import api from '@/plugins/axios'

const router = useRouter()
const emit = defineEmits<{
  taskAssigned: [data: {
    userId: number
    userName: string
    userEmail: string
    taskCount: number
    taskNames: string
    message: string
    tasks: EnquiryTask[]
  }]
}>()

const { enquiries, pagination, loading, error, fetchEnquiries, goToPage, createEnquiry, updateEnquiry, deleteEnquiry, convertToProject, canConvertToProject, newEnquiries, inProgressEnquiries, convertedEnquiries } = useProjectsEnquiries()
const { activeClients, fetchClients } = useClients()
const { user } = useAuth()

const hasPrivilegedAccess = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Project Manager', 'Project Officer'].includes(role))
})

const canLogEnquiry = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Client Service', 'Project Officer'].includes(role))
})

// Status Tabs
const activeTab = ref('all')
const filters = ref({ search: '', status: '', client_name: '' })
const showCreateModal = ref(false)
const titleInputRef = ref<HTMLInputElement | null>(null)
const editingEnquiry = ref<ProjectEnquiry | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')

// Task Assignment Modal
const showTaskAssignmentModal = ref(false)
const selectedEnquiry = ref<ProjectEnquiry | null>(null)

// Detail Slide-Over
const showDetailSlideOver = ref(false)

// Available Project Officers
const availableProjectOfficers = ref<Array<{id: number, name: string, email: string}>>([])

// Logistics Entry Type
interface LogisticsEntry {
  id: number
  project_id: number
  site: string
  loading_time: string
  departure: string
  vehicle_allocated: string
  project_officer_incharge: string
  remarks: string
  status: 'open' | 'completed' | 'closed'
  created_at: string
}

// Logistics Log Modal
const showLogisticsLogModal = ref(false)
const selectedEnquiryForLog = ref<ProjectEnquiry | null>(null)
const showAddEntryForm = ref(false)
const savingLogisticsEntry = ref(false)
const logisticsEntries = ref<LogisticsEntry[]>([])
const sortField = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')
const logisticsStatusFilter = ref('')

// Logistics Entry Form
const logisticsEntryForm = ref({
  project_id: null as number | null,
  site: '',
  loading_time: '',
  departure: '',
  vehicle_allocated: '',
  project_officer_incharge: '',
  remarks: ''
})


// Modal Tabs
const activeModalTab = ref('basic')
const modalTabs = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'contact', label: 'Contact & Priority' },
  { key: 'assignment', label: 'Assignment & Venue' },
  { key: 'survey', label: 'Site Survey' }
]

const previousTab = () => {
  const currentIndex = modalTabs.findIndex(tab => tab.key === activeModalTab.value)
  if (currentIndex > 0) {
    activeModalTab.value = modalTabs[currentIndex - 1].key
  }
}

const nextTab = () => {
  const currentIndex = modalTabs.findIndex(tab => tab.key === activeModalTab.value)
  if (currentIndex < modalTabs.length - 1) {
    activeModalTab.value = modalTabs[currentIndex + 1].key
  }
}



const enquiryFormData = ref<CreateProjectEnquiryData>({
  date_received: new Date().toISOString().split('T')[0],
  expected_delivery_date: '',
  client_id: null as number | null,
  title: '',
  description: '',
  project_scope: '',
  priority: 'medium',
  status: 'enquiry_logged',
  contact_person: '',
  project_officer_id: null as number | null,
  follow_up_notes: '',
  venue: '',
  site_survey_skipped: false,
  site_survey_skip_reason: ''
})

const statusTabs = computed(() => [
  { key: 'all', label: 'All', count: pagination.value.total },
  { key: 'new', label: 'New', count: newEnquiries.value.length },
  { key: 'in_progress', label: 'In Progress', count: inProgressEnquiries.value.length },
  { key: 'converted', label: 'Converted', count: convertedEnquiries.value.length }
])

const filteredEnquiries = computed(() => {
  let filtered = enquiries.value.filter(e => e !== undefined && e !== null)

  if (activeTab.value !== 'all') {
    if (activeTab.value === 'new') {
      filtered = newEnquiries.value.filter(e => e !== undefined && e !== null)
    } else if (activeTab.value === 'in_progress') {
      filtered = inProgressEnquiries.value.filter(e => e !== undefined && e !== null)
    } else if (activeTab.value === 'converted') {
      filtered = convertedEnquiries.value.filter(e => e !== undefined && e !== null)
    }
  }

  return filtered
})

const applyFilters = () => {
  fetchEnquiries({ ...filters.value, page: 1 }) // Reset to page 1 when applying filters
}

const handlePageChange = async (page: number) => {
  await goToPage(page)
}

const editEnquiry = (enquiry: ProjectEnquiry) => {
  editingEnquiry.value = enquiry

  enquiryFormData.value = {
    date_received: enquiry.date_received || new Date().toISOString().split('T')[0],
    expected_delivery_date: enquiry.expected_delivery_date || '',
    client_id: enquiry.client_id,
    title: enquiry.title || '',
    description: enquiry.description || '',
    project_scope: enquiry.project_scope || '',
    priority: enquiry.priority || 'medium',
    status: enquiry.status || 'enquiry_logged',
    contact_person: enquiry.contact_person || '',
    project_officer_id: enquiry.project_officer_id || null,
    follow_up_notes: enquiry.follow_up_notes || '',
    venue: enquiry.venue || '',
    site_survey_skipped: enquiry.site_survey_skipped ?? false,
    site_survey_skip_reason: enquiry.site_survey_skip_reason || ''
  }
  showCreateModal.value = true
}

const viewEnquiryDetails = (enquiry: ProjectEnquiry) => {
  selectedEnquiry.value = enquiry
  showDetailSlideOver.value = true
}

const closeDetailSlideOver = () => {
  showDetailSlideOver.value = false
  // Don't clear selectedEnquiry immediately for smooth transition
  setTimeout(() => {
    selectedEnquiry.value = null
  }, 300)
}

const handleEditFromSlideOver = (enquiry: ProjectEnquiry) => {
  editEnquiry(enquiry)
}

const confirmDelete = async (enquiry: ProjectEnquiry) => {
  if (!confirm(`Are you sure you want to delete the enquiry "${enquiry.title}"? This action cannot be undone.`)) {
    return
  }

  try {
    await deleteEnquiry(enquiry.id)
    // Refresh the list after deletion
    fetchEnquiries({ ...filters.value, page: pagination.value.current_page })
  } catch (err) {
    console.error('Failed to delete enquiry:', err)
    alert('Failed to delete enquiry. Please try again.')
  }
}

const handleConvertFromSlideOver = async (id: number) => {
  try {
    await convertToProject(id)
    await fetchEnquiries()
    closeDetailSlideOver()
  } catch (error) {
    console.error('Failed to convert enquiry:', error)
  }
}

const openTaskAssignment = (enquiry: ProjectEnquiry) => {
  selectedEnquiry.value = enquiry
  showTaskAssignmentModal.value = true
}

const closeTaskAssignmentModal = () => {
  showTaskAssignmentModal.value = false
  selectedEnquiry.value = null
}

// Logistics Log Modal Functions
const openLogisticsLogModal = async () => {
  selectedEnquiryForLog.value = null
  showLogisticsLogModal.value = true
  showAddEntryForm.value = false

  // Fetch all logistics entries
  await fetchLogisticsEntries()
}

const closeLogisticsLogModal = () => {
  showLogisticsLogModal.value = false
  selectedEnquiryForLog.value = null
  showAddEntryForm.value = false
  logisticsEntries.value = []
  sortField.value = 'created_at'
  sortDirection.value = 'desc'
  logisticsStatusFilter.value = ''
}

const fetchLogisticsEntries = async () => {
  try {
    const response = await api.get('/api/projects/logistics-log')
    logisticsEntries.value = response.data.data.data || []
  } catch (error) {
    console.error('Failed to fetch logistics entries:', error)
    logisticsEntries.value = []
  }
}

const addLogisticsEntry = async () => {
  if (!logisticsEntryForm.value.project_id) return

  try {
    savingLogisticsEntry.value = true

    const response = await api.post('/api/projects/logistics-log', logisticsEntryForm.value)
    logisticsEntries.value.unshift(response.data.data)

    // Reset form
    logisticsEntryForm.value = {
      project_id: null,
      site: '',
      loading_time: '',
      departure: '',
      vehicle_allocated: '',
      project_officer_incharge: '',
      remarks: ''
    }

    showAddEntryForm.value = false
  } catch (error: any) {
    console.error('Failed to add logistics entry:', error)
    alert('Failed to add logistics entry: ' + (error.response?.data?.message || error.message || 'Unknown error'))
  } finally {
    savingLogisticsEntry.value = false
  }
}

const sortLogisticsEntries = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const sortedLogisticsEntries = computed(() => {
  let filtered = [...logisticsEntries.value]

  // Apply status filter
  if (logisticsStatusFilter.value) {
    filtered = filtered.filter(entry => entry.status === logisticsStatusFilter.value)
  }

  // Sort the filtered results
  return filtered.sort((a, b) => {
    let aValue: string | number = ''
    let bValue: string | number = ''

    // Handle sorting by different fields
    switch (sortField.value) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
        break
      case 'project_name':
        aValue = getProjectName(a.project_id).toLowerCase()
        bValue = getProjectName(b.project_id).toLowerCase()
        break
      case 'site':
        aValue = a.site.toLowerCase()
        bValue = b.site.toLowerCase()
        break
      default:
        aValue = a.created_at
        bValue = b.created_at
    }

    if (sortDirection.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
})

// Date formatting functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getProjectName = (projectId: number) => {
  const project = enquiries.value.find(e => e.id === projectId)
  return project?.title || 'Unknown Project'
}



const handleTaskAssigned = (updatedTask: EnquiryTask) => {
  // Refresh enquiries to show updated task information
  fetchEnquiries()

  // Emit event to parent for notifications
  // The parent expects a specific data structure
  const data = {
    userId: updatedTask.assigned_by?.id || 0,
    userName: updatedTask.assigned_by?.name || 'User',
    userEmail: '',
    taskCount: 1,
    taskNames: updatedTask.title,
    message: `Task "${updatedTask.title}" has been assigned`,
    tasks: [updatedTask]
  }

  emit('taskAssigned', data)
}


const closeModal = () => {
  showCreateModal.value = false
  editingEnquiry.value = null
  activeModalTab.value = 'basic'
  formError.value = ''
  formSuccess.value = ''

  enquiryFormData.value = {
    date_received: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    client_id: null,
    title: '',
    description: '',
    project_scope: '',
    priority: 'medium',
    status: 'enquiry_logged',
    contact_person: '',
    project_officer_id: null,
    follow_up_notes: '',
    venue: '',
    site_survey_skipped: false,
    site_survey_skip_reason: ''
  }
}

const handleFormSubmit = async () => {
  try {
    saving.value = true
    if (editingEnquiry.value) {
      // Update mode
      await updateEnquiry(editingEnquiry.value.id, enquiryFormData.value as UpdateProjectEnquiryData)
    } else {
      // Create mode
      await createEnquiry(enquiryFormData.value as CreateProjectEnquiryData)
    }

    showCreateModal.value = false
    editingEnquiry.value = null

    // Refresh enquiries after save
    await fetchEnquiries()
  } catch {
    // Error is handled by the composable
  } finally {
    saving.value = false
  }
}

const getStatusColor = (status: string) => {
  return ENQUIRY_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  return ENQUIRY_STATUS_LABELS[status] || status
}

const getUserTaskCount = (enquiry: ProjectEnquiry) => {
  if (!user.value || !enquiry.enquiryTasks) return 0
  return enquiry.enquiryTasks.filter(task => {
    // Check legacy assignment
    if (task.assigned_to?.id === user.value!.id) return true
    // Check multi-user assignment (handle both camelCase and snake_case)
    const assignedUsers = task.assignedUsers || task.assigned_users
    if (assignedUsers?.some(u => u.id === user.value!.id)) return true
    return false
  }).length
}

const getLogisticsStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'closed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getLogisticsStatusLabel = (status: string) => {
  switch (status) {
    case 'open':
      return 'Open'
    case 'completed':
      return 'Completed'
    case 'closed':
      return 'Closed'
    default:
      return status
  }
}

const closeLogisticsEntry = async (entryId: number) => {
  if (!confirm('Are you sure you want to close this logistics entry?')) return

  console.log('Closing logistics entry:', entryId)

  try {
    console.log('Making API call to:', `/api/projects/logistics-log/${entryId}`)
    const response = await api.put(`/api/projects/logistics-log/${entryId}`, { status: 'closed' })
    console.log('API response:', response)

    // Update the local entry status
    const entry = logisticsEntries.value.find(e => e.id === entryId)
    if (entry) {
      entry.status = 'closed'
      console.log('Updated local entry status to closed')
    }

    alert('Logistics entry closed successfully')
  } catch (error: any) {
    console.error('Failed to close logistics entry:', error)
    console.error('Error response:', error.response)
    console.error('Error message:', error.message)
    alert('Failed to close logistics entry: ' + (error.response?.data?.message || error.message || 'Unknown error'))
  }
}

const applyLogisticsFilter = () => {
  // For now, this is just a placeholder - in a real implementation,
  // you might want to refetch data with filters or filter locally
  // Since we're fetching all data, we'll filter locally for now
}



watch(showCreateModal, (newVal) => {
  if (newVal && titleInputRef.value) {
    nextTick(() => {
      titleInputRef.value?.focus()
    })
  }
})

const fetchAvailableProjectOfficers = async () => {
  try {
    const response = await api.get('/api/projects/available-project-officers')
    availableProjectOfficers.value = response.data.data || []
  } catch (error) {
    console.error('Failed to fetch available project officers:', error)
    availableProjectOfficers.value = []
  }
}

onMounted(async () => {
  await fetchEnquiries()
  await fetchClients()
  await fetchAvailableProjectOfficers()
})
</script>
