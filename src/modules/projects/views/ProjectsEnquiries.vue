<template>
  <div class="space-y-6 pb-12 font-poppins">
    <!-- Requests Dashboard -->
    <div class="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      <div class="p-6 md:p-8">
        <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
          <div>
            <nav class="flex mb-4" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-2 text-sm font-black text-slate-500 uppercase tracking-widest">
                <li>
                  <router-link to="/projects" class="text-blue-600 hover:underline">Projects</router-link>
                </li>
                <li>
                  <div class="flex items-center gap-1">
                    <span>Requests</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 class="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Requests</h1>
            <p class="text-slate-500 font-medium text-base">View and manage all project requests.</p>
          </div>
          
          <div class="flex flex-wrap items-center gap-4">
            <button
              v-if="isProjectOfficer"
              @click="filters.assigned_to_me = !filters.assigned_to_me"
              class="h-10 px-6 rounded-lg font-bold text-sm transition-all border flex items-center gap-2"
              :class="filters.assigned_to_me 
                ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:bg-slate-50'"
            >
              {{ filters.assigned_to_me ? 'My Requests' : 'All Requests' }}
            </button>

            <button
              @click="openLogisticsLogModal()"
              class="h-10 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm border border-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              Logistics
            </button>

            <button
              v-if="canLogEnquiry"
              @click="showCreateModal = true"
              class="h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              New Request
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Top Level Navigation & Controls Row -->
    <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-4 px-6 -mb-[2px] relative z-30">
      <!-- Left: Tabs -->
      <div class="flex items-end gap-2 overflow-x-auto pb-1 xl:pb-0">
        <button
          v-for="tab in dashboardTabs"
          :key="tab.id"
          @click="currentView = tab.id as any; activeTab = 'all'"
          class="flex flex-col items-start gap-1 px-6 py-3 md:px-8 md:py-4 rounded-t-2xl transition-all min-w-[160px] md:min-w-[200px] relative group shrink-0"
          :class="[
            currentView === tab.id 
              ? 'bg-white dark:bg-slate-900 border-x-2 border-t-2 border-blue-600 border-b-0 text-blue-600 z-40 pb-[14px] md:pb-[18px]' 
              : 'bg-slate-50 dark:bg-slate-800/50 border-b-2 border-blue-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 z-10'
          ]"
        >
          <div class="flex items-center gap-2">
            <span class="text-xs md:text-sm font-black uppercase tracking-widest">{{ tab.label }}</span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-widest" :class="currentView === tab.id ? 'text-blue-400' : 'text-slate-400'">{{ tab.desc }}</span>
          
          <!-- Mask for bottom border if active -->
          <div v-if="currentView === tab.id" class="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-white dark:bg-slate-900"></div>
        </button>
      </div>

      <!-- Right: Filters & Search (Now Inline) -->
      <div class="flex items-center gap-2 pb-2 overflow-x-auto">
         <!-- Search -->
         <div class="relative w-full md:w-64 shrink-0">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search..."
              class="w-full h-10 px-4 bg-white dark:bg-slate-800 border-0 rounded-lg text-xs font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 uppercase tracking-wide"
            />
         </div>

         <!-- Status -->
         <div class="relative w-32 shrink-0">
             <select
              v-model="filters.status"
              class="w-full h-10 pl-3 pr-8 bg-white dark:bg-slate-800 border-0 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 appearance-none uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <option value="">Status: All</option>
              <optgroup v-if="currentView === 'enquiries'" label="New">
                <option value="client_registered">New Client</option>
                <option value="enquiry_logged">Logged</option>
                <option value="site_survey_completed">Survey Done</option>
              </optgroup>
              <optgroup v-if="currentView === 'enquiries'" label="Planning">
                <option value="design_completed">Design</option>
                <option value="budget_created">Budget</option>
                <option value="quote_prepared">Quote</option>
              </optgroup>
              <optgroup v-if="currentView === 'projects'" label="Execution">
                <option value="quote_approved">Approved</option>
                <option value="planning">Planning</option>
                <option value="in_progress">Active</option>
                <option value="completed">Done</option>
              </optgroup>
            </select>
          </div>

          <!-- Sort -->
          <div class="relative w-28 shrink-0">
             <select
              v-model="filters.sort_by"
              class="w-full h-10 pl-3 pr-8 bg-white dark:bg-slate-800 border-0 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 appearance-none uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <option value="created_at">Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
      </div>
    </div>

    <!-- Enquiries Data Engine -->
    <div class="bg-white dark:bg-slate-900 rounded-b-2xl rounded-tr-2xl border-2 border-blue-600 shadow-xl shadow-blue-900/10 overflow-hidden relative z-20">
      <!-- Toolbar with View Toggle -->
      <div v-if="!loading && !error" class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-end">
        <div class="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
          <button 
            @click="viewMode = 'table'"
            class="h-9 px-4 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            List
          </button>
          <button 
            @click="viewMode = 'cards'"
            class="h-9 px-4 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            :class="viewMode === 'cards' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          >
            Cards
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <p class="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Loading Requests...</p>
      </div>

      <div v-else-if="error" class="p-12 text-center text-red-500">
        <p class="text-sm font-bold uppercase tracking-widest">Connection Error</p>
        <p class="text-xs opacity-50 mt-1 uppercase">{{ error }}</p>
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table'" class="overflow-x-auto custom-scrollbar">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Reference</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Project Details</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">PO & Contact person</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Created</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Target Delivery</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Priority</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Category</th>
              <th class="px-6 py-5 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th class="px-6 py-5 text-right text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <template v-for="enquiry in filteredEnquiries" :key="enquiry.id">
              <tr class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span 
                      class="text-base font-black tracking-tight mb-0.5 transition-colors duration-300"
                      :class="enquiry.job_number ? 'text-blue-600' : 'text-red-500 italic font-black'"
                    >
                      {{ enquiry.job_number || 'No Job #' }}
                    </span>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ref: {{ enquiry.enquiry_number }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 border-l border-slate-50 dark:border-slate-800/50">
                  <div class="flex flex-col max-w-sm transition-transform group-hover:translate-x-1 duration-300">
                    <span class="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors cursor-pointer leading-tight mb-1" @click="selectedEnquiry = enquiry; showDetailSlideOver = true">
                      {{ enquiry.title }}
                    </span>
                    <span class="text-sm font-semibold text-slate-500 tracking-wide">{{ enquiry.client?.full_name || 'No Client' }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-base font-bold text-slate-800 dark:text-slate-200">{{ enquiry.project_officer?.name || 'Unassigned' }}</span>
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-[0.05em] mt-0.5">{{ enquiry.contact_person || 'No Contact' }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <span class="text-sm font-black text-slate-600 dark:text-slate-400 tabular-nums">{{ formatDate(enquiry.created_at) }}</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex items-center gap-1.5" :class="enquiry.expected_delivery_date ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300'">
                    <span class="text-sm font-black tabular-nums">{{ enquiry.expected_delivery_date ? formatDate(enquiry.expected_delivery_date) : 'TBD' }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div 
                    class="px-3 py-2 text-xs font-black rounded-lg uppercase tracking-widest border shadow-sm flex items-center gap-1.5 transition-all duration-300"
                    :class="getPriorityDisplayClasses(enquiry.priority)"
                  >
                    {{ enquiry.priority || 'Normal' }}
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                   <span class="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600">
                      {{ getPresetLabel(enquiry.workflow_preset_type) }}
                   </span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="flex flex-col gap-2">
                    <span 
                      class="px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest border shadow-sm inline-flex w-fit"
                      :class="getStatusColor(enquiry.status)"
                    >
                      {{ getStatusLabel(enquiry.status) }}
                    </span>
                    <div v-if="getUserTaskCount(enquiry) > 0" class="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-md border border-amber-100 dark:border-amber-800/50 w-fit">
                      <span class="text-xs font-black uppercase tracking-tight">{{ getUserTaskCount(enquiry) }} Tasks</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="selectedEnquiry = enquiry; showDetailSlideOver = true"
                      class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center group/btn"
                      title="View Details"
                    >
                      <span class="text-xs font-black uppercase tracking-widest">View</span>
                    </button>

                    <router-link 
                      :to="{ path: '/projects/tasks', query: { enquiry_id: enquiry.id } }"
                      class="h-10 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all flex items-center gap-2 group/tasks"
                      title="Access Request Tasks"
                    >
                      <span class="text-xs font-black uppercase tracking-widest">Tasks</span>
                    </router-link>

                    <!-- <button 
                      @click="openTaskAssignment(enquiry)"
                      class="h-10 px-5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all flex items-center gap-2 group/assign"
                      title="Assign Task"
                    >
                      <span class="text-xs font-black uppercase tracking-widest">Assign</span>
                    </button> -->

                    <button 
                      @click="(event) => toggleMenu(event, enquiry)"
                      class="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center transform active:scale-95 font-black text-xs uppercase"
                      :class="{ 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white': activeMenuEnquiry?.id === enquiry.id }"
                    >
                      More
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Card Grip (Grid View) -->
      <div v-else class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <template v-for="enquiry in filteredEnquiries" :key="enquiry.id">
            <div 
              class="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <!-- Colored Left Border (Status Indicator) -->


              <!-- Priority Badge (Absolute Top Right) -->
              <div v-if="enquiry.priority === 'urgent' || enquiry.priority === 'high'" class="absolute top-0 right-6">
                 <div class="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-b-xl shadow-lg shadow-red-500/30">
                   {{ enquiry.priority }}
                 </div>
              </div>

              <!-- Header: Ref & Status -->
              <div class="flex items-start justify-between mb-5 pl-2">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {{ enquiry.enquiry_number }}
                  </span>
                  <span 
                    class="text-sm font-black tracking-tight"
                    :class="enquiry.job_number ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300'"
                  >
                    {{ enquiry.job_number || 'NO JOB #' }}
                  </span>
                </div>
              </div>

              <!-- Content: Title & Client -->
              <div class="mb-6 flex-grow pl-2">
                <h3 
                  class="text-xl font-black text-slate-900 dark:text-white leading-snug mb-4 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                  @click="selectedEnquiry = enquiry; showDetailSlideOver = true"
                >
                  {{ enquiry.title }}
                </h3>
                
                <div class="flex items-center gap-3 mb-5">
                  <div 
                    class="w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center text-sm font-black text-white uppercase shrink-0"
                    :class="[
                       'bg-gradient-to-br',
                       ['from-blue-400 to-blue-600', 'from-emerald-400 to-emerald-600', 'from-violet-400 to-violet-600', 'from-rose-400 to-rose-600', 'from-amber-400 to-amber-600'][enquiry.id % 5]
                    ]"
                  >
                    {{ enquiry.client?.full_name?.charAt(0) || 'C' }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</span>
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{{ enquiry.client?.full_name || 'No Client' }}</span>
                  </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-4">
                   <div class="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-colors">
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                       Target
                     </p>
                     <p 
                       class="text-sm font-black"
                       :class="enquiry.expected_delivery_date ? 'text-slate-800 dark:text-white' : 'text-slate-300'"
                     >
                       {{ enquiry.expected_delivery_date ? formatDate(enquiry.expected_delivery_date) : 'TBD' }}
                     </p>
                   </div>
                   <div class="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-colors">
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        Officer
                     </p>
                     <p class="text-sm font-black text-slate-800 dark:text-white truncate">
                       {{ enquiry.project_officer?.name?.split(' ')[0] || 'Unassigned' }}
                     </p>
                   </div>
                </div>
              </div>

              <!-- Active Tasks Indicator -->
              <div v-if="getUserTaskCount(enquiry) > 0" class="mb-5 pl-2">
                 <div class="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl">
                    <div class="relative flex h-2.5 w-2.5 shrink-0">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </div>
                    <span class="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                      {{ getUserTaskCount(enquiry) }} Actions Required
                    </span>
                 </div>
              </div>

              <!-- Footer: Actions -->
              <div class="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 mt-auto pl-2">
                <router-link 
                  :to="{ path: '/projects/tasks', query: { enquiry_id: enquiry.id } }"
                  class="flex-1 h-11 rounded-xl bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-400 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  <span>Open Tasks</span>
                </router-link>
                
                <button 
                  @click="(event) => toggleMenu(event, enquiry)"
                  class="w-11 h-11 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-100 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center font-black text-xs uppercase"
                  :class="{ 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white': activeMenuEnquiry?.id === enquiry.id }"
                >
                  More
                </button>
              </div>
            </div>
          </template>
        </div>
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

    <!-- Create/Edit Enquiry Context Engine -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
      <div class="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95">
        <!-- Modal Header -->
        <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                {{ editingEnquiry ? 'Edit Strategic Request' : 'Log New Project Request' }}
              </h2>
              <p class="text-slate-500 text-base font-semibold mt-1">Configure project parameters and objectives below.</p>
            </div>
            <button @click="showCreateModal = false" class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500">
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Tab Switcher -->
        <div class="px-10 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <nav class="flex gap-8">
            <button
              v-for="tab in modalTabs"
              :key="tab.key"
              @click="activeModalTab = tab.key"
              :class="[
                activeModalTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
                'py-4 border-b-2 text-sm font-bold transition-all'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Scrollable Mission Parameters -->
        <form @submit.prevent="handleFormSubmit" class="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <!-- Strategic Parameters Tab -->
          <div v-if="activeModalTab === 'basic'" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Date Received*</label>
                <div class="relative">
                  <input
                    v-model="enquiryFormData.date_received"
                    type="date"
                    required
                    class="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Expected Delivery</label>
                <div class="relative">
                  <input
                    v-model="enquiryFormData.expected_delivery_date"
                    type="date"
                    class="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Strategic Client*</label>
                <div class="relative">
                  <select
                    v-model="enquiryFormData.client_id"
                    required
                    class="w-full h-14 pl-14 pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-base font-bold text-slate-700 dark:text-white uppercase tracking-widest appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Client...</option>
                    <option v-for="client in activeClients" :key="client.id" :value="client.id">{{ client.FullName }}</option>
                  </select>
                  <i class="mdi mdi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Project Request Title*</label>
              <input
                v-model="enquiryFormData.title"
                type="text"
                required
                placeholder="Enter request title..."
                class="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-50"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">Project Description</label>
              <textarea
                v-model="enquiryFormData.description"
                rows="4"
                placeholder="Enter project scope and requirements..."
                class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 lg:resize-none"
              ></textarea>
            </div>

            <div class="space-y-5 bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div class="flex items-center justify-between">
                <label class="text-sm font-bold text-slate-500 uppercase tracking-wider">Project Deliverables</label>
                <span class="text-xs font-bold text-blue-600">{{ projectDeliverables.length }} Items Added</span>
              </div>
              
              <div v-if="projectDeliverables.length > 0" class="flex flex-wrap gap-2">
                <div 
                  v-for="(deliverable, index) in projectDeliverables" 
                  :key="index"
                  class="flex items-center gap-3 pl-4 pr-2 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ deliverable }}</span>
                  <button
                    @click="removeDeliverable(index)"
                    type="button"
                    class="w-6 h-6 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              </div>

              <div class="relative">
                <input
                  v-model="newDeliverable"
                  @keydown.enter.prevent.stop="addDeliverable"
                  type="text"
                  placeholder="Add a deliverable (e.g. Logo Design, Stand Build)..."
                  class="w-full h-12 pl-5 pr-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
                <button
                  @click="addDeliverable"
                  type="button"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <!-- Contact & Priority Tab -->
          <div v-if="activeModalTab === 'contact'" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Person*</label>
                <div class="relative">
                  <input
                    v-model="enquiryFormData.contact_person"
                    type="text"
                    required
                    placeholder="Primary contact name..."
                    class="w-full h-14 pl-16 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Strategic Priority</label>
                <div class="relative">
                  <select
                    v-model="enquiryFormData.priority"
                    class="w-full h-14 pl-16 pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white uppercase tracking-widest appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  >
                    <option value="low">Low Priority</option>

                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Ops</option>
                  </select>
                  <i class="mdi mdi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Digital Email Address</label>
                <div class="relative">
                  <input
                    v-model="enquiryFormData.contact_email"
                    type="email"
                    placeholder="signal@enterprise.com"
                    class="w-full h-14 pl-16 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phonetic Number</label>
                <div class="relative">
                  <input
                    v-model="enquiryFormData.contact_phone"
                    type="tel"
                    placeholder="+X XXX XXX XXX"
                    class="w-full h-14 pl-16 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Lifecycle Status*</label>
              <div class="relative">
                <select
                  v-model="enquiryFormData.status"
                  required
                  class="w-full h-14 pl-6 pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white uppercase tracking-widest appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                >
                  <!-- We only return 'Enquiry Logged' as the default choice to simplify logging -->
                  <option value="enquiry_logged">Request Logged</option>
                  
                  <!-- Show other statuses only if we're editing an existing record that might have moved further -->
                  <template v-if="editingEnquiry">
                    <option 
                      v-for="(label, key) in ENQUIRY_STATUS_LABELS" 
                      :key="key" 
                      :value="key"
                      v-show="key !== 'enquiry_logged'"
                    >
                      {{ label }}
                    </option>
                  </template>
                </select>
                <i class="mdi mdi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
          </div>

          <!-- Assignment & Venue Tab -->
          <div v-if="activeModalTab === 'assignment'" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div class="space-y-3">
                 <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Assigned Project Officer</label>
                 <div class="relative">
                   <select
                     v-model="enquiryFormData.project_officer_id"
                     class="w-full h-14 pl-16 pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white uppercase tracking-widest appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                   >
                     <option value="">Awaiting Assignment</option>
                     <option
                       v-for="officer in availableProjectOfficers"
                       :key="officer.id"
                       :value="officer.id"
                     >
                       {{ officer.name }}
                     </option>
                   </select>
                   <i class="mdi mdi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                 </div>
               </div>

               <div class="space-y-3">
                 <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Deployment Venue</label>
                 <div class="relative">
                   <input
                     v-model="enquiryFormData.venue"
                     type="text"
                     placeholder="Street address, City, Landmark..."
                     class="w-full h-14 pl-16 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-50"
                   />
                 </div>
               </div>
             </div>

             <div class="space-y-3">
               <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Operational Request Notes</label>
               <div class="relative">
                  <textarea
                    v-model="enquiryFormData.follow_up_notes"
                    rows="4"
                    placeholder="Internal logistics and coordination records..."
                    class="w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-50 lg:resize-none"
                  ></textarea>
               </div>
             </div>
          </div>

          <!-- Site Survey Engagement Tab -->
          <div v-if="activeModalTab === 'survey'" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="p-8 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10">
              <label class="flex items-center gap-4 cursor-pointer group">
                <div class="relative flex items-center">
                  <input
                    v-model="enquiryFormData.site_survey_skipped"
                    type="checkbox"
                    class="peer h-6 w-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-transparent text-blue-500 focus:ring-blue-500/20 transition-all"
                  />
                  <i class="mdi mdi-check absolute left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity ml-1 pointer-events-none"></i>
                </div>
                <span class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Skip Site Survey</span>
              </label>
              
              <div v-if="enquiryFormData.site_survey_skipped" class="mt-8 space-y-6">
                 <div class="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-blue-800">
                    <p class="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Site Survey Skip Warning</p>
                     <ul class="space-y-3">
                       <li class="flex items-center gap-3 text-sm font-medium text-slate-500">
                         Confirm dimensions are verified via secondary measures/blueprints.
                       </li>
                       <li class="flex items-center gap-3 text-sm font-medium text-slate-500">
                          Bypassing will advance the project directly to Design.
                       </li>
                     </ul>
                 </div>

                 <div class="space-y-3">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Rationale for Survey Bypass</label>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <button 
                      v-for="reason in ['Legacy Data Available', 'Client Blueprints Verified', 'Consultation Only', 'Asset Deployment Only']" 
                      :key="reason"
                      type="button"
                      @click="enquiryFormData.site_survey_skip_reason = reason"
                      class="px-4 py-2 text-sm font-bold rounded-lg border uppercase tracking-widest transition-all"
                      :class="enquiryFormData.site_survey_skip_reason === reason 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-500'"
                    >
                      {{ reason }}
                    </button>
                  </div>
                  <input
                    v-model="enquiryFormData.site_survey_skip_reason"
                    type="text"
                    placeholder="Document specific rationale for process changes..."
                    class="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Workflow Tasks Tab -->
          <div v-if="activeModalTab === 'workflow'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-800">
              <div class="flex items-start gap-4 mb-6">
                <div class="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
                  <i class="mdi mdi-workflow text-2xl text-white"></i>
                </div>
                <div>
                  <h3 class="text-lg font-black text-slate-800 dark:text-white mb-2">Select Workflow Tasks</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Choose which tasks should be created for this project. You can use a preset or customize manually.</p>
                </div>
              </div>

              <!-- Preset Selector -->
              <div class="mb-6">
                <label class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] ml-1 mb-3 block">Quick Presets</label>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    v-for="(preset, key) in taskPresets"
                    :key="key"
                    type="button"
                    @click="applyPreset(key as string)"
                    class="p-4 rounded-2xl border-2 transition-all text-left group hover:scale-[1.02]"
                    :class="enquiryFormData.workflow_preset_type === key 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <span class="text-sm font-black uppercase tracking-wider" 
                        :class="enquiryFormData.workflow_preset_type === key ? 'text-white' : 'text-slate-800 dark:text-white'">
                        {{ preset.label }}
                      </span>
                      <i v-if="enquiryFormData.workflow_preset_type === key" class="mdi mdi-check-circle text-xl"></i>
                    </div>
                    <p class="text-xs font-medium opacity-80 leading-relaxed">{{ preset.description }}</p>
                    <div class="mt-3 pt-3 border-t" 
                      :class="enquiryFormData.workflow_preset_type === key ? 'border-blue-400' : 'border-slate-200 dark:border-slate-700'">
                      <span class="text-xs font-bold opacity-70">{{ preset.tasks.length }} tasks</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Manual Task Selection -->
              <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between mb-4">
                  <label class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">Fine-tune Tasks</label>
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {{ selectedTasksCount }} / {{ availableTasks.length }} selected
                    </span>
                    <button
                      type="button"
                      @click="toggleAllTasks"
                      class="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
                    >
                      {{ selectedTasksCount === availableTasks.length ? 'Deselect All' : 'Select All' }}
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label 
                    v-for="task in availableTasks" 
                    :key="task.type"
                    class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    :class="enquiryFormData.selected_workflow_tasks?.includes(task.type)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                      : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'"
                  >
                    <input 
                      v-model="enquiryFormData.selected_workflow_tasks" 
                      :value="task.type" 
                      type="checkbox" 
                      class="mt-0.5 w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 focus:ring-2 border-slate-300"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="font-black text-sm text-slate-800 dark:text-white mb-1">{{ task.title }}</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ task.description }}</div>
                    </div>
                  </label>
                </div>

                <!-- Validation Warning -->
                <div v-if="selectedTasksCount === 0" class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
                  <i class="mdi mdi-alert text-amber-600 text-xl"></i>
                  <span class="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Please select at least one task to create the workflow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>

        <!-- Action Buttons -->
        <div class="px-10 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <button
              @click="previousTab"
              :disabled="activeModalTab === 'basic'"
              class="h-12 px-6 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous Step
            </button>

            <div class="flex gap-4">
              <button
                @click="showCreateModal = false"
                class="h-12 px-6 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
              >
                Cancel
              </button>
              
              <button
                v-if="activeModalTab !== 'workflow'"
                @click="nextTab"
                class="h-12 px-8 bg-white dark:bg-slate-800 text-blue-600 border border-blue-100 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-sm"
              >
                Next Step
              </button>
              
              <button
                v-if="activeModalTab === 'workflow'"
                @click="handleFormSubmit"
                :disabled="saving || selectedTasksCount === 0"
                class="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <i v-if="saving" class="mdi mdi-loading mdi-spin"></i>
                <i v-else class="mdi mdi-check-circle"></i>
                {{ saving ? 'Saving...' : (editingEnquiry ? 'Save Changes' : 'Create Request') }}
              </button>
            </div>
          </div>
          
          <div v-if="formError" class="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-4">
            <i class="mdi mdi-alert text-lg"></i>
            <span class="text-sm font-bold uppercase tracking-wider">{{ formError }}</span>
          </div>
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

    <!-- Logistics Command Module -->
    <div v-if="showLogisticsLogModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95">
        <!-- Module Header: Dashboard Style -->
        <div class="px-10 py-8 border-b-4 border-blue-600 bg-slate-900 text-white shrink-0">
          <div class="relative z-10 flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <i class="mdi mdi-truck-delivery text-4xl"></i>
              </div>
              <div>
                <h2 class="text-3xl font-black tracking-tighter uppercase italic">
                  Logistics <span class="text-blue-400">Command Center</span>
                </h2>
                <div class="flex items-center gap-3 mt-1">
                  <span class="px-2 py-0.5 bg-blue-600 text-[10px] font-black rounded uppercase tracking-tighter">Live Monitor</span>
                  <p class="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] opacity-80">Fleet Deployment & Logistics Log</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
               <div class="text-right mr-4">
                  <div class="text-xs font-black text-slate-500 uppercase tracking-widest">Current System Time</div>
                  <div class="text-xl font-mono font-bold text-blue-400">{{ new Date().toLocaleTimeString() }}</div>
               </div>
               <button @click="closeLogisticsLogModal" class="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white border border-white/10">
                Close
               </button>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-slate-950">
          <!-- Big Stats Dashboard Bar -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                <i class="mdi mdi-pylon text-3xl"></i>
              </div>
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Deployments</div>
                <div class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ logisticsEntries.length }}</div>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                <i class="mdi mdi-motion-play text-3xl"></i>
              </div>
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Deployments</div>
                <div class="text-3xl font-black text-amber-600 tracking-tighter">{{ logisticsEntries.filter(e => e.status === 'open').length }}</div>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <i class="mdi mdi-shield-check text-3xl"></i>
              </div>
              <div>
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successful Logs</div>
                <div class="text-3xl font-black text-emerald-600 tracking-tighter">{{ logisticsEntries.filter(e => e.status === 'completed').length }}</div>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div class="flex-1">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Quick Filter</label>
                <div class="relative">
                  <select
                    v-model="logisticsStatusFilter"
                    @change="applyLogisticsFilter"
                    class="w-full h-12 pl-4 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white appearance-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  >
                    <option value="">All Status</option>
                    <option value="open">Active</option>
                    <option value="completed">Success</option>
                    <option value="closed">Archived</option>
                  </select>
                  <i class="mdi mdi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6 flex items-center justify-between">
            <button
                @click="showAddEntryForm = !showAddEntryForm"
                class="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3"
              >
                <i class="mdi" :class="showAddEntryForm ? 'mdi-close' : 'mdi-plus-circle-outline text-xl'"></i>
                {{ showAddEntryForm ? 'Dismiss Form' : 'Initialize New Deployment' }}
            </button>
          </div>

          <div v-if="showAddEntryForm" class="mb-10 animate-in slide-in-from-top-4 duration-500">
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border-2 border-blue-100 dark:border-blue-900/30 relative overflow-hidden shadow-xl">
              <div class="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              
              <h3 class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                <i class="mdi mdi-form-select text-blue-600 text-2xl"></i>
                Deployment Parameters
              </h3>

              <form @submit.prevent="saveLogisticsEntry" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="space-y-2">
                  <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Target Project Assets*</label>
                  <div class="relative">
                    <select
                      v-model="logisticsEntryForm.project_id"
                      @change="handleProjectSelection"
                      required
                      class="w-full h-14 pl-5 pr-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-white appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                      <option :value="null">Inquiry Selection...</option>
                      <!-- Combine allApprovedProjects and current enquiries to ensure selection works -->
                      <option v-for="enquiry in [...allApprovedProjects, ...enquiries.filter(e => !allApprovedProjects.some(ae => ae.id === e.id))]" :key="enquiry.id" :value="enquiry.id">
                        {{ enquiry.job_number || '---' }} | {{ enquiry.title }}
                      </option>
                    </select>
                    <i class="mdi mdi-bullseye-arrow absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl"></i>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Destination*</label>
                  <input
                    v-model="logisticsEntryForm.site"
                    type="text"
                    required
                    placeholder="Enter site location..."
                    class="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle</label>
                  <select
                    v-model="logisticsEntryForm.vehicle_allocated"
                    class="w-full h-14 pl-5 pr-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-white appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  >
                    <option value="">Awaiting Allocation...</option>
                    <option v-for="vehicle in vehicleOptions" :key="vehicle" :value="vehicle">{{ vehicle }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Driver</label>
                  <select
                    v-model="logisticsEntryForm.driver"
                    class="w-full h-14 pl-5 pr-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-white appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Personnel...</option>
                    <option v-for="driver in logisticsDrivers" :key="driver.id" :value="driver.name">{{ driver.name }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Supervisor</label>
                  <input
                    v-model="logisticsEntryForm.project_officer_incharge"
                    type="text"
                    placeholder="Lead Officer..."
                    class="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-black text-slate-500 uppercase tracking-widest">Load Time</label>
                    <input v-model="logisticsEntryForm.loading_time" type="datetime-local" class="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-mono font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-black text-amber-600 uppercase tracking-widest">Departure Time</label>
                    <input v-model="logisticsEntryForm.departure" type="datetime-local" class="w-full h-14 px-4 bg-white dark:bg-slate-900 border-2 border-amber-100 dark:border-amber-900/30 rounded-2xl text-[11px] font-mono font-black text-amber-600 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all" />
                  </div>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-1">Notes / Remarks</label>
                  <textarea
                    v-model="logisticsEntryForm.remarks"
                    rows="1"
                    placeholder="Add some notes..."
                    class="w-full h-14 px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div class="flex items-end lg:col-start-4">
                  <button
                    type="submit"
                    :disabled="savingLogisticsEntry"
                    class="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                  >
                    <i v-if="savingLogisticsEntry" class="mdi mdi-loading mdi-spin text-xl"></i>
                    <i v-else class="mdi mdi-shield-check text-xl"></i>
                    {{ savingLogisticsEntry ? 'Saving...' : (logisticsEntryForm.id ? 'Save Update' : 'Save Record') }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Transport History -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Recent Entries</h3>
              <span class="text-xs font-bold text-slate-400">{{ logisticsEntries.length }} Records</span>
            </div>
 
            <div v-if="logisticsEntries.length === 0" class="p-20 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">No records found</p>
            </div>

            <div v-else class="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mb-12">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-slate-900 text-white">
                    <th @click="sortLogisticsEntries('created_at')" class="px-8 py-7 text-left text-xs font-black uppercase tracking-[0.4em] cursor-pointer hover:bg-slate-800">
                      ID <i class="mdi mdi-sort-variant ml-2 opacity-50"></i>
                    </th>
                    <th class="px-8 py-7 text-left text-xs font-black uppercase tracking-[0.4em]">SITE & DESTINATION</th>
                    <th class="px-8 py-7 text-left text-xs font-black uppercase tracking-[0.4em]">PERSONNEL / VEHICLE</th>
                    <th class="px-8 py-7 text-left text-xs font-black uppercase tracking-[0.4em]">TIME SCHEDULE</th>
                    <th class="px-8 py-7 text-left text-xs font-black uppercase tracking-[0.4em]">STATUS</th>
                    <th class="px-8 py-7 text-right text-xs font-black uppercase tracking-[0.4em]">ACTION</th>
                  </tr>
                </thead>
                <tbody class="divide-y-4 divide-slate-50 dark:divide-slate-950">
                  <tr v-for="entry in sortedLogisticsEntries" :key="entry.id" class="group transition-all hover:bg-blue-600/5 dark:hover:bg-blue-400/5">
                    <td class="px-8 py-10 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-sm font-black text-slate-400 tracking-widest mb-1">{{ entry.id.toString().padStart(6, '0') }}</span>
                        <span class="text-xs font-bold text-blue-500 uppercase tracking-tighter">{{ new Date(entry.created_at).toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'}) }}</span>
                      </div>
                    </td>
                    <td class="px-8 py-10">
                      <div class="flex flex-col">
                        <span class="text-2xl font-black text-slate-900 dark:text-white uppercase leading-none mb-3 tracking-tighter group-hover:text-blue-600 transition-colors">{{ entry.site }}</span>
                        <div class="flex items-center gap-3">
                          <span class="px-3 py-1 bg-amber-500 text-[10px] font-black text-black rounded-lg border border-amber-600 shadow-md shadow-amber-500/20 uppercase tracking-widest">Job: {{ getProjectJobNumber(entry.project_id) }}</span>
                          <span class="text-base font-bold text-slate-500 uppercase tracking-tighter truncate max-w-[350px] opacity-80">{{ getProjectName(entry.project_id) }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-8 py-10">
                      <div class="flex items-center gap-10">
                        <div class="flex items-center gap-4">
                           <div class="flex flex-col">
                              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Supervisor</span>
                              <span class="text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{{ entry.project_officer_incharge || 'N/A' }}</span>
                           </div>
                        </div>
                        <div class="flex items-center gap-4 border-l-2 border-slate-200 dark:border-slate-800 pl-10">
                           <div class="flex flex-col">
                               <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Driver</span>
                               <span class="text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{{ entry.driver || '---' }}</span>
                           </div>
                        </div>
                        <div class="flex items-center gap-4 border-l-2 border-slate-200 dark:border-slate-800 pl-10">
                           <div class="flex flex-col">
                              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vehicle</span>
                              <span class="text-xl font-black text-blue-600 italic tracking-tighter leading-none">{{ entry.vehicle_allocated || 'TBD' }}</span>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-8 py-10">
                      <div class="flex items-center gap-10">
                        <div class="flex flex-col">
                           <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Pre-Loading</span>
                           <span class="text-2xl font-mono font-black text-slate-600 dark:text-slate-400 leading-none">{{ entry.loading_time ? new Date(entry.loading_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--' }}</span>
                        </div>
                        <div class="flex flex-col border-l-2 border-amber-500/20 pl-10">
                           <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 text-amber-600/70">Departure</span>
                           <span class="text-3xl font-mono font-black text-amber-600 leading-none tracking-tighter">{{ entry.departure ? new Date(entry.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'READY' }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-8 py-10">
                       <span 
                          class="px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.3em] border-4 shadow-[0_15px_30px_-10px] inline-flex items-center gap-3"
                          :class="entry.status === 'open' 
                            ? 'bg-blue-600 text-white border-blue-400 shadow-blue-600/40' 
                            : entry.status === 'completed'
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/40'
                              : 'bg-slate-700 text-white border-slate-500 shadow-slate-900/40'"
                        >
                          <i class="mdi" :class="entry.status === 'open' ? 'mdi-radar animate-pulse text-lg' : 'mdi-shield-check text-lg'"></i>
                          {{ getLogisticsStatusLabel(entry.status) }}
                        </span>
                    </td>
                    <td class="px-8 py-10 text-right">
                      <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          v-if="entry.status === 'open'"
                          @click="closeLogisticsEntry(entry.id)"
                          title="Verify Completion"
                          class="w-14 h-14 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        >
                          <i class="mdi mdi-check-bold text-2xl"></i>
                        </button>
                        <button
                          @click="editLogisticsEntry(entry)"
                          title="Modify Deck"
                          class="w-14 h-14 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        >
                          <i class="mdi mdi-lead-pencil text-2xl"></i>
                        </button>
                        <button
                          @click="deleteLogisticsEntry(entry.id)"
                          title="Abort Entry"
                          class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-100 dark:border-red-900 shadow-lg flex items-center justify-center transition-all hover:scale-110"
                        >
                          <i class="mdi mdi-trash-can-outline text-2xl"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-10 py-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div class="flex justify-end">
            <button
              @click="closeLogisticsLogModal"
              class="h-12 px-8 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
            >
              Close History
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enquiry Detail Slide-Over -->
    <EnquiryDetailSlideOver
      :show="showDetailSlideOver"
      :enquiry="selectedEnquiry"
      @close="closeDetailSlideOver"
      @edit="handleEditFromSlideOver"
    />

    <!-- Teleported Floating Action Menu -->
    <Teleport to="body">
      <div v-if="activeMenuEnquiry" class="fixed inset-0 z-[9999] bg-transparent" @click="activeMenuEnquiry = null"></div>
      
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div 
          v-if="activeMenuEnquiry" 
          :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }" 
          class="fixed z-[10000] w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 backdrop-blur-xl origin-top-right"
        >
          <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Options</p>
          </div>
          
          <button 
            @click="editEnquiry(activeMenuEnquiry); activeMenuEnquiry = null" 
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-all group/item"
          >
            <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 group-hover/item:scale-110 transition-transform">
              <i class="mdi mdi-pencil-outline text-lg"></i>
            </div>
            <span>Edit Information</span>
          </button>

          <button 
            v-if="canMarkComplete && !['completed', 'cancelled'].includes(activeMenuEnquiry.status)"
            @click="markAsComplete(activeMenuEnquiry); activeMenuEnquiry = null" 
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest hover:bg-green-50 dark:hover:bg-green-500/10 transition-all group/item"
          >
            <div class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 group-hover/item:scale-110 transition-transform">
              <i class="mdi mdi-check-circle-outline text-lg"></i>
            </div>
            <span>Mark as Complete</span>
          </button>

          <button 
            @click="confirmDelete(activeMenuEnquiry); activeMenuEnquiry = null" 
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group/item"
          >
            <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500 group-hover/item:scale-110 transition-transform">
              <i class="mdi mdi-trash-can-outline text-lg"></i>
            </div>
            <span>Delete Record</span>
          </button>
        </div>
      </Transition>
    </Teleport>
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

const { enquiries, pagination, loading, error, fetchEnquiries, goToPage, createEnquiry, updateEnquiry, deleteEnquiry, newEnquiries, inProgressEnquiries } = useProjectsEnquiries()
const { activeClients, fetchClients } = useClients()
const { user } = useAuth()
const filters = ref({ search: '', status: '', client_name: '', sort_by: 'created_at', sort_order: 'desc', assigned_to_me: false, view: 'enquiries' })

const hasPrivilegedAccess = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Project Manager', 'Project Officer', 'Client Service'].includes(role))
})

const canLogEnquiry = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Client Service', 'Project Officer'].includes(role))
})

const isProjectOfficer = computed(() => {
  return user.value?.roles?.includes('Project Officer')
})

const canMarkComplete = computed(() => {
  return user.value?.roles?.some(role => ['Super Admin', 'Project Manager'].includes(role))
})

// Automatically default to "My Projects" for Project Officers when user data loads
watch(isProjectOfficer, (newValue) => {
  if (newValue) {
    filters.value.assigned_to_me = true
  }
}, { immediate: true })

// Status Tabs
const activeTab = ref('all')
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

// Floating Menu State
const activeMenuEnquiry = ref<ProjectEnquiry | null>(null)
const menuPosition = ref({ top: 0, left: 0 })

const toggleMenu = (event: MouseEvent, enquiry: ProjectEnquiry) => {
  if (activeMenuEnquiry.value?.id === enquiry.id) {
    activeMenuEnquiry.value = null
    return
  }
  
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  
  // Calculate best position (defaulting to bottom-left aligned with button's right edge, to keep inside viewport usually)
  // Check if close to bottom of screen
  const spaceBelow = window.innerHeight - rect.bottom
  const menuHeight = 160 // Approx height
  
  if (spaceBelow < menuHeight) {
     // Pop Up
     menuPosition.value = {
      top: rect.top - menuHeight + 10,
      left: rect.right - 256 // w-64 is 256px
    }
  } else {
    // Pop Down
     menuPosition.value = {
      top: rect.bottom + 8,
      left: rect.right - 256
    }
  }
  
  activeMenuEnquiry.value = enquiry
}

// Logistics Entry Type
interface LogisticsEntry {
  id: number
  project_id: number
  site: string
  loading_time: string
  departure: string
  setdown_time: string
  vehicle_allocated: string
  driver: string
  project_officer_incharge: string
  remarks: string
  status: 'open' | 'completed' | 'closed'
  created_at: string
}

// Logistics Log Modal
const viewMode = ref<'table' | 'cards'>('table')
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
  id: null as number | null,
  site: '',
  loading_time: '',
  departure: '',
  setdown_time: '',
  vehicle_allocated: '',
  driver: '',
  project_officer_incharge: '',
  remarks: ''
})

// All Approved Projects for Logistics Selection
const allApprovedProjects = ref<ProjectEnquiry[]>([])
const loadingApprovedProjects = ref(false)

// Vehicle options
const vehicleOptions = ['KDR 843B', 'KCT 082T', 'KBU 006M', 'KDS 198E']

// Logistics Drivers
const logisticsDrivers = ref<Array<{id: number, name: string, email: string}>>([]);
const loadingDrivers = ref(false)


// Modal Tabs
const activeModalTab = ref<'basic' | 'contact' | 'assignment' | 'survey' | 'workflow'>('basic')
const modalTabs: Array<{ key: 'basic' | 'contact' | 'assignment' | 'survey' | 'workflow', label: string }> = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'contact', label: 'Contact & Priority' },
  { key: 'assignment', label: 'Assignment & Venue' },
  { key: 'survey', label: 'Site Survey' },
  { key: 'workflow', label: 'Workflow Tasks' }
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
  project_scope: [],
  priority: 'low',
  status: 'enquiry_logged',
  contact_person: '',
  contact_email: '',
  contact_phone: '',
  project_officer_id: null as number | null,
  follow_up_notes: '',
  venue: '',
  site_survey_skipped: false,
  site_survey_skip_reason: '',
  selected_workflow_tasks: [] as string[],
  workflow_preset_type: '' as string
})

// Deliverables management
const newDeliverable = ref('')
const projectDeliverables = ref<string[]>([])

const addDeliverable = () => {
  const trimmed = newDeliverable.value.trim()
  if (trimmed && !projectDeliverables.value.includes(trimmed)) {
    projectDeliverables.value.push(trimmed)
    enquiryFormData.value.project_scope = [...projectDeliverables.value]
    newDeliverable.value = ''
  }
}

const removeDeliverable = (index: number) => {
  projectDeliverables.value.splice(index, 1)
  enquiryFormData.value.project_scope = [...projectDeliverables.value]
}

// Workflow Task Selection
const taskPresets = {
  full_event: {
    label: 'Full Event (All Tasks)',
    description: 'Complete event lifecycle from survey to reporting',
    tasks: ['site-survey', 'design', 'materials', 'budget', 'quote', 'quote_approval', 'procurement', 'teams', 'production', 'logistics', 'setup', 'handover', 'setdown', 'report']
  },
  delivery_only: {
    label: 'Delivery Only',
    description: 'Simple delivery projects without design/production',
    tasks: ['materials', 'procurement', 'logistics', 'handover']
  },
  branding: {
    label: 'Branding/Merchandising',
    description: 'Branding projects with design and production',
    tasks: ['design', 'materials', 'budget', 'quote', 'quote_approval', 'production', 'handover']
  },
  design_only: {
    label: 'Design Only',
    description: 'Concept and design delivery without execution',
    tasks: ['site-survey', 'design', 'handover', 'report']
  },
  consultation: {
    label: 'Consultation/Advisory',
    description: 'Advisory services without physical delivery',
    tasks: ['site-survey', 'design', 'budget', 'quote', 'quote_approval', 'report']
  },
  internal_job: {
    label: 'Internal Job',
    description: 'Jobs executed within the company facility (Production only)',
    tasks: ['design', 'materials', 'procurement', 'teams', 'production', 'report']
  }
}

const availableTasks = [
  { type: 'site-survey', title: 'Site Survey', description: 'Conduct site survey and assessment' },
  { type: 'design', title: 'Design & Concept', description: 'Create design concepts and mockups' },
  { type: 'materials', title: 'Materials Specification', description: 'Specify and source materials' },
  { type: 'budget', title: 'Budget Creation', description: 'Create project budget' },
  { type: 'quote', title: 'Quote Preparation', description: 'Prepare final quote' },
  { type: 'quote_approval', title: 'Quote Approval', description: 'Approve the prepared quote' },
  { type: 'procurement', title: 'Procurement', description: 'Manage procurement and inventory' },
  { type: 'teams', title: 'Teams Management', description: 'Manage project teams' },
  { type: 'production', title: 'Production', description: 'Handle production activities' },
  { type: 'logistics', title: 'Logistics', description: 'Manage logistics and transportation' },
  { type: 'setup', title: 'Event Setup', description: 'Set up event and execute' },
  { type: 'handover', title: 'Client Handover', description: 'Hand over to client' },
  { type: 'setdown', title: 'Set Down & Return', description: 'Set down and return equipment' },
  { type: 'report', title: 'Archival & Reporting', description: 'Archive and generate reports' }
]

const selectedTasksCount = computed(() => {
  return enquiryFormData.value.selected_workflow_tasks?.length || 0
})

const applyPreset = (presetKey: string) => {
  const preset = taskPresets[presetKey as keyof typeof taskPresets]
  if (preset) {
    enquiryFormData.value.selected_workflow_tasks = [...preset.tasks]
    enquiryFormData.value.workflow_preset_type = presetKey
  }
}

const toggleAllTasks = () => {
  if (selectedTasksCount.value === availableTasks.length) {
    enquiryFormData.value.selected_workflow_tasks = []
    enquiryFormData.value.workflow_preset_type = ''
  } else {
    enquiryFormData.value.selected_workflow_tasks = availableTasks.map(t => t.type)
    enquiryFormData.value.workflow_preset_type = 'full_event'
  }
}

// Initialize with default preset (full event) for new enquiries
if (!enquiryFormData.value.selected_workflow_tasks || enquiryFormData.value.selected_workflow_tasks.length === 0) {
  applyPreset('full_event')
}



const currentView = ref<'enquiries' | 'projects' | 'completed'>('enquiries')

const dashboardTabs = [
  { id: 'enquiries', label: 'New Requests', desc: 'New pipeline' },
  { id: 'projects', label: 'In Progress', desc: 'Active projects' },
  { id: 'completed', label: 'Completed', desc: 'Finished projects' }
]

const statusTabs = computed(() => {
  if (currentView.value === 'projects') {
    return [
      { key: 'all', label: 'All', count: filteredEnquiries.value.length },
      { key: 'pre_prod', label: 'Preparation', count: enquiries.value.filter(e => ['quote_approved', 'planning'].includes(e.status)).length },
      { key: 'in_progress', label: 'Active', count: enquiries.value.filter(e => e.status === 'in_progress').length },
      { key: 'completed', label: 'Done', count: enquiries.value.filter(e => e.status === 'completed').length },
       { key: 'cancelled', label: 'Cancelled', count: enquiries.value.filter(e => e.status === 'cancelled').length }
    ]
  }
  return [
    { key: 'all', label: 'All', count: filteredEnquiries.value.length },
    { key: 'new', label: 'New', count: newEnquiries.value.length },
    { key: 'in_progress', label: 'Active', count: enquiries.value.filter(e => ['site_survey_completed', 'design_completed', 'design_approved', 'materials_specified', 'budget_created', 'quote_prepared'].includes(e.status)).length }
  ]
})

const filteredEnquiries = computed(() => {
  let filtered = enquiries.value.filter(e => e !== undefined && e !== null)

  // 1. Separate Enquiries, Projects, and Completed based on status
  const completedStatuses = ['completed', 'cancelled']
  const activeProjectStatuses = ['quote_approved', 'planning', 'in_progress']
  
  if (currentView.value === 'completed') {
      // Completed View: Only completed or cancelled projects
      filtered = filtered.filter(e => completedStatuses.includes(e.status))
  } else if (currentView.value === 'projects') {
      // Projects View: Active projects only (quote_approved to in_progress, excluding completed/cancelled)
      filtered = filtered.filter(e => activeProjectStatuses.includes(e.status))
  } else {
      // Enquiries View: Status must be BEFORE quote_approved
      filtered = filtered.filter(e => !activeProjectStatuses.includes(e.status) && !completedStatuses.includes(e.status))
  }

  // 2. Filter by status tab (activeTab)
  if (activeTab.value !== 'all') {
    if (activeTab.value === 'new') {
       filtered = filtered.filter(e => e.status === 'enquiry_logged' || e.status === 'client_registered')
    } else if (activeTab.value === 'in_progress' && currentView.value === 'enquiries') {
       // "In Pipeline" for enquiries (excluding quote_approved/planning now)
       filtered = filtered.filter(enquiry => ['site_survey_completed', 'design_completed', 'design_approved', 'materials_specified', 'budget_created', 'quote_prepared'].includes(enquiry.status))
    } else if (activeTab.value === 'pre_prod' && currentView.value === 'projects') {
       filtered = filtered.filter(e => ['quote_approved', 'planning'].includes(e.status))
    } else {
       // Direct status match
       filtered = filtered.filter(e => e.status === activeTab.value)
    }
  }

  return filtered
})

const applyFilters = () => {
  fetchEnquiries({ ...filters.value, page: 1 }) // Reset to page 1 when applying filters
}

watch(currentView, (newValue) => {
  filters.value.view = newValue
  applyFilters()
})

// Automatic filtering with debounce
let debounceTimer: any = null
watch(filters, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  debounceTimer = setTimeout(() => {
    applyFilters()
  }, 500)
}, { deep: true })

const handlePageChange = async (page: number) => {
  await fetchEnquiries({ ...filters.value, page })
}

const editEnquiry = (enquiry: ProjectEnquiry) => {
  editingEnquiry.value = enquiry

  enquiryFormData.value = {
    date_received: enquiry.date_received || new Date().toISOString().split('T')[0],
    expected_delivery_date: enquiry.expected_delivery_date || '',
    client_id: enquiry.client_id,
    title: enquiry.title || '',
    description: enquiry.description || '',
    project_scope: enquiry.project_scope || [],
    priority: enquiry.priority || 'low',
    status: enquiry.status || 'enquiry_logged',
    contact_person: enquiry.contact_person || '',
    project_officer_id: enquiry.project_officer_id || null,
    follow_up_notes: enquiry.follow_up_notes || '',
    venue: enquiry.venue || '',
    site_survey_skipped: enquiry.site_survey_skipped ?? false,
    site_survey_skip_reason: enquiry.site_survey_skip_reason || '',
    selected_workflow_tasks: enquiry.selected_workflow_tasks || [],
    workflow_preset_type: enquiry.workflow_preset_type || ''
  }
  // Sync deliverables
  projectDeliverables.value = Array.isArray(enquiry.project_scope) ? [...enquiry.project_scope] : []
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

const markAsComplete = async (enquiry: ProjectEnquiry) => {
  if (!confirm(`Mark project "${enquiry.title}" as completed?\n\nThis will move the project to the Completed tab.`)) {
    return
  }

  try {
    await updateEnquiry(enquiry.id, { status: 'completed' } as any)
    // Refresh the list after updating
    await fetchEnquiries({ ...filters.value, page: pagination.value.current_page })
  } catch (err) {
    console.error('Failed to mark project as complete:', err)
    alert('Failed to complete project. Please try again.')
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
  
  // Fetch all approved projects for selection and lookup
  await fetchApprovedProjects()
}

const fetchApprovedProjects = async () => {
  loadingApprovedProjects.value = true
  try {
    const response = await api.get('/api/projects/approved-wng')
    allApprovedProjects.value = response.data.data || []
  } catch (err) {
    console.error('Failed to fetch approved projects:', err)
  } finally {
    loadingApprovedProjects.value = false
  }
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

const handleProjectSelection = () => {
  if (!logisticsEntryForm.value.project_id) return

  const project = allApprovedProjects.value.find(e => e.id === logisticsEntryForm.value.project_id) || 
                  enquiries.value.find(e => e.id === logisticsEntryForm.value.project_id)
  if (project) {
    logisticsEntryForm.value.site = project.venue || ''
    logisticsEntryForm.value.project_officer_incharge = project.project_officer?.name || ''
  }
}

const resetLogisticsForm = () => {
  logisticsEntryForm.value = {
    id: null,
    project_id: null,
    site: '',
    loading_time: '',
    departure: '',
    setdown_time: '',
    vehicle_allocated: '',
    driver: '',
    project_officer_incharge: '',
    remarks: ''
  }
}

const saveLogisticsEntry = async () => {
  if (!logisticsEntryForm.value.project_id) return

  try {
    savingLogisticsEntry.value = true

    const payload = {
      ...logisticsEntryForm.value,
      setdown_time: logisticsEntryForm.value.setdown_time || null
    }

    let response;
    if (logisticsEntryForm.value.id) {
      response = await api.put(`/api/projects/logistics-log/${logisticsEntryForm.value.id}`, payload)
      // Update local entry
      const index = logisticsEntries.value.findIndex(e => e.id === logisticsEntryForm.value.id)
      if (index !== -1) {
        logisticsEntries.value[index] = response.data.data
      }
    } else {
      response = await api.post('/api/projects/logistics-log', payload)
      logisticsEntries.value.unshift(response.data.data)
    }

    // Reset form
    resetLogisticsForm()

    showAddEntryForm.value = false
  } catch (error: any) {
    console.error('Failed to add logistics entry:', error)
    alert('Failed to save logistics entry: ' + (error.response?.data?.message || error.message || 'Unknown error'))
  } finally {
    savingLogisticsEntry.value = false
  }
}

const editLogisticsEntry = (entry: LogisticsEntry) => {
  // Format dates for datetime-local input
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16)
  }

  logisticsEntryForm.value = {
    id: entry.id,
    project_id: entry.project_id,
    site: entry.site,
    loading_time: formatDateTimeForInput(entry.loading_time),
    departure: formatDateTimeForInput(entry.departure),
    setdown_time: formatDateTimeForInput(entry.setdown_time),
    vehicle_allocated: entry.vehicle_allocated,
    driver: entry.driver || '',
    project_officer_incharge: entry.project_officer_incharge,
    remarks: entry.remarks
  }
  showAddEntryForm.value = true
}

const deleteLogisticsEntry = async (id: number) => {
  if (!confirm('Are you sure you want to delete this logistics entry?')) return

  try {
    await api.delete(`/api/projects/logistics-log/${id}`)
    logisticsEntries.value = logisticsEntries.value.filter(e => e.id !== id)
    alert('Logistics entry deleted successfully')
  } catch (error: any) {
    console.error('Failed to delete logistics entry:', error)
    alert('Failed to delete logistics entry: ' + (error.response?.data?.message || error.message || 'Unknown error'))
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
const getPresetLabel = (key: string | undefined) => {
  if (!key) return 'Custom / Legacy'
  return taskPresets[key as keyof typeof taskPresets]?.label || 'Custom'
}

const formatDate = (dateString: string | undefined) => {
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
  const project = allApprovedProjects.value.find(e => e.id === projectId) || 
                  enquiries.value.find(e => e.id === projectId)
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
    project_scope: [],
    priority: 'low',
    status: 'enquiry_logged',
    contact_person: '',
    project_officer_id: null,
    follow_up_notes: '',
    venue: '',
    site_survey_skipped: false,
    site_survey_skip_reason: '',
    selected_workflow_tasks: [],
    workflow_preset_type: ''
  }
  
  // Re-apply default preset for next new enquiry
  applyPreset('full_event')

  // Reset deliverables
  projectDeliverables.value = []
  newDeliverable.value = ''
}

const handleFormSubmit = async () => {
  formError.value = ''
  try {
    saving.value = true
    if (editingEnquiry.value) {
      // Update mode
      await updateEnquiry(editingEnquiry.value.id, enquiryFormData.value as UpdateProjectEnquiryData)
    } else {
      // Create mode
      await createEnquiry(enquiryFormData.value as CreateProjectEnquiryData)
    }

    closeModal()

    // Refresh enquiries after save
    await fetchEnquiries()
  } catch (e: any) {
    console.error('Form submission failed:', e)
    if (e.response?.data?.message) {
      formError.value = e.response.data.message
      // If validation errors exist, append them
      if (e.response.data.errors) {
        const errors = Object.values(e.response.data.errors).flat().join(', ')
        formError.value += `: ${errors}`
      }
    } else {
      formError.value = error.value || 'An error occurred while saving. Please check your connection.'
    }
  } finally {
    saving.value = false
  }
}

const updateStatus = async (enquiry: ProjectEnquiry, newStatus: string) => {
  const oldStatus = enquiry.status
  if (confirm(`Are you sure you want to change status to "${ENQUIRY_STATUS_LABELS[newStatus] || newStatus}"?`)) {
    try {
      // Update backend
      await updateEnquiry(enquiry.id, { status: newStatus } as any)
      // Update local state is handled by reactivity if we mutate enquiry, 
      // but fetchEnquiries might be safer to ensure consistency
      enquiry.status = newStatus as any // Optimistic update
    } catch (error) {
       console.error("Failed to update status", error)
       alert("Failed to update status")
       enquiry.status = oldStatus // Revert
       await fetchEnquiries() // Hard refresh
    }
  } else {
     // Revert visual selection if confirmed 'no' (Vue binding might stick)
     // Force re-assignment to trigger reactivity
     enquiry.status = oldStatus
     // We might need to force refresh key on the select if it doesn't revert
     await nextTick()
     enquiry.status = oldStatus
  }
}

const getStatusColor = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  return ENQUIRY_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getPriorityColor = (priority: string | undefined) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'bg-red-50 text-red-600 border-red-100'
    case 'high':
      return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'normal':
    case 'medium':
      return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'low':
      return 'bg-slate-50 text-slate-600 border-slate-100'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-100'
  }
}

const getPriorityDisplayClasses = (priority: string | undefined) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:border-red-800'
    case 'high':
      return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:border-orange-800'
    case 'normal':
    case 'medium':
      return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:border-blue-800'
    case 'low':
      return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:border-slate-800'
    default:
      return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:border-slate-800'
  }
}

const getPriorityIcon = (priority: string | undefined) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'mdi-fire text-red-500 animate-pulse'
    case 'high':
      return 'mdi-alert-decagram text-orange-500'
    case 'normal':
    case 'medium':
      return 'mdi-checkbox-marked-circle-outline text-blue-500'
    case 'low':
      return 'mdi-arrow-down-circle-outline text-slate-400'
    default:
      return 'mdi-minus-circle-outline text-slate-400'
  }
}

const getStatusLabel = (status: string | undefined) => {
  if (!status) return 'Unknown'
  return ENQUIRY_STATUS_LABELS[status] || status
}

const getUserTaskCount = (enquiry: any) => {
  const tasks = enquiry.enquiryTasks || enquiry.enquiry_tasks
  if (!user.value || !tasks) return 0
  return tasks.filter((task: any) => {
    // Check legacy assignment
    if (task.assigned_to?.id === user.value!.id) return true
    // Check multi-user assignment (handle both camelCase and snake_case)
    const assignedUsers = task.assignedUsers || task.assigned_users
    if (assignedUsers?.some((u: any) => u.id === user.value!.id)) return true
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

const getProjectJobNumber = (projectId: number | null) => {
  if (!projectId) return 'N/A'
  const enquiry = allApprovedProjects.value.find(e => e.id === projectId) || 
                  enquiries.value.find(e => e.id === projectId)
  return enquiry?.job_number || 'PENDING'
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

const fetchLogisticsDrivers = async () => {
  loadingDrivers.value = true
  try {
    const response = await api.get('/api/users', {
      params: {
        role_name: 'Logistics',
        per_page: 1000,
        status: 'active'
      }
    })
    logisticsDrivers.value = response.data.data || []
  } catch (error) {
    console.error('Failed to fetch logistics drivers:', error)
    logisticsDrivers.value = []
  } finally {
    loadingDrivers.value = false
  }
}

onMounted(async () => {
  if (isProjectOfficer.value) {
      filters.value.assigned_to_me = true
  }
  await fetchEnquiries(filters.value)
  await fetchClients()
  await fetchAvailableProjectOfficers()
  await fetchLogisticsDrivers()

  // Handle direct ID navigation from external links (like from Lead Capture panel)
  const queryId = router.currentRoute.value.query.id
  if (queryId) {
    const enquiryId = parseInt(queryId as string)
    const target = enquiries.value.find(e => e.id === enquiryId)
    if (target) {
      viewEnquiryDetails(target)
    }
  }
})
</script>
