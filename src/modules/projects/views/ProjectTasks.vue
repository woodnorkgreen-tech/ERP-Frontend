<template>
  <div class="space-y-6 font-poppins">
    <!-- Premium Header -->
    <div class="relative overflow-hidden bg-slate-900 rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-800 mb-12">
      <!-- Background Decoration -->
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <nav class="flex mb-4" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 uppercase tracking-[0.2em] text-sm font-bold">
              <li>
                <router-link to="/projects" class="text-blue-500 hover:text-blue-400 transition-colors">Projects</router-link>
              </li>
              <li v-if="enquiryId">
                <div class="flex items-center gap-1 text-slate-600">
                  <i class="mdi mdi-chevron-right text-xs"></i>
                  <router-link to="/projects/enquiries" class="text-slate-400 hover:text-slate-300 transition-colors">Enquiries</router-link>
                </div>
              </li>
              <li>
                <div class="flex items-center gap-1 text-slate-600">
                  <i class="mdi mdi-chevron-right text-xs"></i>
                  <span class="text-slate-400">Tasks</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="text-6xl font-black text-white tracking-tighter mb-3">
            {{ enquiryId ? enquiryTitle : (showAllTasks ? 'Team Command' : 'My Objectives') }}
          </h1>
          <p class="text-slate-400 text-sm font-medium">
            {{ enquiryId ? 'Task overview for the current enquiry' : 'Manage and monitor all project tasks' }}
          </p>
        </div>
        
        
      </div>
    </div>

    <!-- Metrics Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-1">Completion</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ Math.round((completedTasks.length / (enquiryTasks.length || 1)) * 100) }}%
            </h3>
          </div>
          <div class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700">
            <i class="mdi mdi-chart-line text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-1">Urgent</p>
            <h3 class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ tasksByPriority.urgent.length }}
            </h3>
          </div>
          <div class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-red-600 dark:text-red-400 border border-slate-100 dark:border-slate-700">
            <i class="mdi mdi-fire text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-1">Overdue</p>
            <h3 class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ enquiryTasks.filter(t => isOverdue(t)).length }}
            </h3>
          </div>
          <div class="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-orange-600 dark:text-orange-400 border border-slate-100 dark:border-slate-700">
            <i class="mdi mdi-clock-alert-outline text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">In Progress</p>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ inProgressTasks.length }}
            </h3>
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400">
            <i class="mdi mdi-progress-check text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- Mission Intelligence (Minimal) -->
    <div v-if="enquiryId" class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
            <i class="mdi mdi-map-marker-path text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Project Roadmap</h3>
            <p class="text-xs text-slate-500 font-medium">{{ enquiryTasks.length }} Tasks Total</p>
          </div>
        </div>
        
        <!-- Simple Progress Bar -->
        <div class="hidden md:flex items-center gap-3">
          <div class="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div class="h-full bg-slate-900 dark:bg-white transition-all duration-500" 
                  :style="{ width: `${(missionMilestones.filter((m: any) => m.completed).length / missionMilestones.length) * 100}%` }">
             </div>
          </div>
          <span class="text-xs font-bold text-slate-900 dark:text-white">
            {{ Math.round((missionMilestones.filter((m: any) => m.completed).length / missionMilestones.length) * 100) }}%
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div v-for="(milestone, index) in missionMilestones" :key="milestone.status" 
             class="p-4 rounded-xl border transition-all"
             :class="milestone.completed 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' 
                : milestone.isNext 
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ring-2 ring-slate-900/5 dark:ring-white/10' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60'">
          
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-black uppercase tracking-wider opacity-60">Step 0{{ index + 1 }}</span>
            <i class="mdi text-base" 
               :class="milestone.completed ? 'mdi-check-circle' : milestone.isNext ? 'mdi-loading mdi-spin' : 'mdi-circle-outline'"></i>
          </div>
          
          <h4 class="text-xs font-bold leading-tight">{{ milestone.label }}</h4>
          
          <div v-if="milestone.isNext && milestone.missingTasks.length" class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
             <p class="text-[9px] font-medium text-slate-500 truncate">
               Pending: {{ formatTaskType(milestone.missingTasks[0]) }}
             </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Search -->
        <div class="md:col-span-6 lg:col-span-6">
          <label class="block text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2">Detailed Task Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <i class="mdi mdi-magnify text-slate-400 text-lg"></i>
            </div>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by title, client or personnel..."
              class="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-gray-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        
        <!-- Status Filter -->
        <div class="md:col-span-3 lg:col-span-3">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="md:col-span-3 lg:col-span-3">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Priority</label>
          <select
            v-model="filters.priority"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">All Priorities</option>
            <option value="low">Low Impact</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
          <router-link 
            v-if="enquiryId" 
            to="/projects/enquiries" 
            class="h-14 px-6 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 group"
          >
            <i class="mdi mdi-arrow-left transition-transform group-hover:-translate-x-1"></i>
            <span>Back</span>
          </router-link>

          <button
            @click="toggleTaskView"
            class="h-14 px-6 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] transition-all border flex items-center gap-3"
            :class="showAllTasks 
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/20 shadow-lg shadow-blue-500/10' 
              : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'"
          >
            <i class="mdi shadow-sm" :class="showAllTasks ? 'mdi-account-group' : 'mdi-account-circle'"></i>
            {{ showAllTasks ? 'Team View' : 'My Tasks' }}
          </button>

          <div class="flex bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10">
            <button
              v-for="mode in (['board', 'grid', 'table'] as const)"
              :key="mode"
              @click="viewMode = mode"
              :class="viewMode === mode ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'"
              class="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              {{ mode }}
            </button>
          </div>
        </div>
    <!-- Dynamic View Containers -->
    <div class="min-h-[400px]">
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading tasks...</p>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-full mb-4">
          <i class="mdi mdi-text-search-variant text-4xl text-gray-300 dark:text-gray-600"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">No tasks found</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filter parameters.</p>
      </div>

      <div v-else>
        <!-- Board View -->
        <div v-if="viewMode === 'board'" class="flex overflow-x-auto pb-8 gap-6 scroll-smooth custom-scrollbar">
          <div v-for="status in ['pending', 'in_progress', 'completed', 'skipped', 'cancelled']" :key="status" class="flex-shrink-0 w-80">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div :class="getBoardStatusColors(status).dot" class="w-1.5 h-1.5 rounded-full ring-2 ring-white dark:ring-slate-900"></div>
                <h3 class="text-[11px] font-black text-slate-900 dark:text-gray-200 uppercase tracking-[0.2em]">{{ getStatusLabel(status) }}</h3>
                <span class="text-[10px] font-bold whitespace-nowrap opacity-60">({{ filteredTasks.filter(t => t.status === status).length }})</span>
              </div>
            </div>

            <div class="space-y-4">
              <div 
                v-for="task in filteredTasks.filter(t => t.status === status)" 
                :key="task.id"
                @click="openTaskModal(task)"
                class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary dark:hover:border-primary transition-all cursor-pointer group"
              >
                <div class="flex items-center space-x-2 mb-3">
                  <div :class="getTaskTypeIcon(task.type)" class="w-7 h-7 rounded flex items-center justify-center text-white opacity-90">
                    <i :class="getMdiTaskIcon(task.type)" class="text-base"></i>
                  </div>
                  <div v-if="isOverdue(task)" class="flex items-center gap-1.5 px-2 py-0.5 rounded border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                    <i class="mdi mdi-clock-alert animate-bounce"></i>
                    <span>{{ getDaysOverdue(task.due_date!) }} Days Overdue</span>
                  </div>
                  
                  <!-- Quote Approval Details -->
                  <div v-if="task.type === 'quote' && task.status !== 'completed'" class="flex items-center gap-1.5 px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                    <i class="mdi mdi-file-certificate-outline"></i>
                    <span>Awaiting Client Sign-off</span>
                  </div>

                  <!-- Tech/Finance Approval Dashboard -->
                  <div v-if="task.type === 'materials' && task.material_approval?.needs_approval" class="flex flex-col gap-2 mt-3 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <div class="flex items-center justify-between">
                       <span class="text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Sign-off Status</span>
                       <span class="text-[9px] font-bold text-blue-600">{{ task.material_approval.approved_count }}/{{ task.material_approval.total_count }} Complete</span>
                    </div>
                    <div class="flex gap-1">
                      <div v-for="(approved, dept) in task.material_approval.departments" :key="dept" 
                           :class="approved ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
                           class="flex-1 h-1 rounded-full transition-all" :title="dept"></div>
                    </div>
                    <div class="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                       <span v-for="(_, dept) in task.material_approval.departments" :key="dept"
                             :class="task.material_approval.departments[dept] ? 'text-emerald-600 font-bold' : ''">
                         {{ dept.substring(0, 3) }}
                       </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 mb-3">
                  <span :class="getStatusBadgeClasses(task.status)" class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm transition-all duration-300">
                    {{ task.status === 'skipped' && task.notes ? 'Skipped: ' + task.notes : getStatusLabel(task.status) }}
                  </span>
                  <div v-if="task.priority === 'urgent'" class="text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 shadow-sm">Urgent Priority</div>
                </div>

                <h4 class="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors leading-tight tracking-tight">{{ task.title }}</h4>
                <p class="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.15em] truncate mb-4">{{ task.enquiry?.title || 'System Objective' }}</p>
                
                <p v-if="task.task_description" class="text-xs font-bold dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed border-l-2 border-slate-100 pl-3 dark:border-slate-800 italic">
                  {{ task.task_description }}
                </p>

                <div class="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700">
                  <div class="flex items-center space-x-2">
                     <template v-if="!task.assigned_to">
                       <button @click.stop="claimTask(task)" class="text-xs font-bold text-primary hover:underline">Claim Task</button>
                     </template>
                     <div v-else class="flex items-center space-x-1.5">
                       <div class="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300">
                         {{ getInitials(task.assigned_to?.name) }}
                       </div>
                       <span class="text-xs font-bold dark:text-gray-400">{{ task.assigned_to?.name?.split(' ')[0] || 'Member' }}</span>
                       <button 
                         v-if="task.assigned_to?.id === user?.id || isManager" 
                         @click.stop="handoverTask(task)" 
                         class="px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1.5"
                         title="Release task back to pool"
                       >
                         Release
                       </button>
                     </div>
                  </div>
                  <div class="flex items-center space-x-1 text-xs font-bold">
                    <i class="mdi mdi-calendar-text"></i>
                    <span>{{ task.due_date ? formatDate(task.due_date) : 'No due date' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            @click="openTaskModal(task)"
            class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary dark:hover:border-primary transition-all cursor-pointer group h-full flex flex-col"
          >
            <div class="flex items-center space-x-2 mb-3">
              <div :class="getTaskTypeIcon(task.type)" class="w-7 h-7 rounded flex items-center justify-center text-white opacity-90">
                <i :class="getMdiTaskIcon(task.type)" class="text-base"></i>
              </div>
              <div v-if="isOverdue(task)" class="flex items-center gap-1.5 px-2 py-0.5 rounded border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-wider">
                <i class="mdi mdi-clock-alert animate-bounce"></i>
                <span>{{ getDaysOverdue(task.due_date!) }} Days Overdue</span>
              </div>
              
              <!-- Quote Approval Details -->
              <div v-if="task.type === 'quote' && task.status !== 'completed'" class="flex items-center gap-1.5 px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest mt-1">
                <i class="mdi mdi-file-certificate-outline"></i>
                <span>Awaiting Client Sign-off</span>
              </div>
            </div>

            <!-- Tech/Finance Approval Dashboard -->
            <div v-if="task.type === 'materials' && task.material_approval?.needs_approval" class="flex flex-col gap-2 mb-3 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mx-4">
              <div class="flex items-center justify-between">
                 <span class="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Sign-off Status</span>
                 <span class="text-sm font-bold text-blue-600">{{ task.material_approval.approved_count }}/{{ task.material_approval.total_count }} Complete</span>
              </div>
              <div class="flex gap-1">
                <div v-for="(approved, dept) in task.material_approval.departments" :key="dept" 
                     :class="approved ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'"
                     class="flex-1 h-1 rounded-full transition-all" :title="dept"></div>
              </div>
              <div class="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-tighter">
                 <span v-for="(_, dept) in task.material_approval.departments" :key="dept"
                       :class="task.material_approval.departments[dept] ? 'text-emerald-600 font-bold' : ''">
                   {{ dept.substring(0, 3) }}
                 </span>
              </div>
            </div>
                <div class="flex items-center gap-2 mb-3">
                  <span :class="getStatusBadgeClasses(task.status)" class="text-xs font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md border shadow-sm">
                    {{ task.status === 'skipped' && task.notes ? 'Skipped: ' + task.notes : getStatusLabel(task.status) }}
                  </span>
                  <div v-if="task.priority === 'urgent'" class="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 shadow-sm">Urgent Priority</div>
                </div>

                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors leading-tight">{{ task.title }}</h4>
                <p class="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest truncate mb-3">{{ task.enquiry?.title || 'System Objective' }}</p>

                <p v-if="task.task_description" class="text-sm text-slate-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed border-l-2 border-slate-100 pl-3 dark:border-slate-800 italic">
                  {{ task.task_description }}
                </p>

            <div class="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700">
              <div class="flex items-center space-x-2">
                 <template v-if="!task.assigned_to">
                   <button @click.stop="claimTask(task)" class="text-xs font-bold text-primary hover:underline">Claim Task</button>
                 </template>
                 <div v-else class="flex items-center space-x-1.5">
                   <div class="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300">
                     {{ getInitials(task.assigned_to?.name) }}
                   </div>
                   <span class="text-sm text-gray-600 dark:text-gray-400">{{ task.assigned_to?.name?.split(' ')[0] || 'Member' }}</span>
                   <button 
                     v-if="task.assigned_to?.id === user?.id || isManager" 
                     @click.stop="handoverTask(task)" 
                     class="px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50 text-[10px] text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1.5"
                     title="Release task back to pool"
                   >
                     Release
                   </button>
                 </div>
              </div>
              <div class="flex items-center space-x-1 text-xs text-gray-400">
                <i class="mdi mdi-calendar-text"></i>
                <span>{{ task.due_date ? formatDate(task.due_date) : 'No due date' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Objective Name</th>
                  <th class="px-6 py-4 text-left text-sm font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Operational Category</th>
                  <th class="px-6 py-4 text-left text-sm font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Progress</th>
                  <th class="px-6 py-4 text-left text-sm font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Liaison Personnel</th>
                  <th class="px-6 py-4 text-left text-sm font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Weighted Priority</th>
                  <th class="px-6 py-4 text-left text-sm font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em]">Deadline</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                <tr
                  v-for="task in filteredTasks"
                  :key="task.id"
                  @click="openTaskModal(task)"
                  class="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                >
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ task.title }}</span>
                      <span class="text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{{ task.enquiry?.title || 'Core Project' }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-2">
                       <div :class="getTaskTypeIcon(task.type)" class="w-6 h-6 rounded flex items-center justify-center text-white text-[10px]">
                         <i :class="getMdiTaskIcon(task.type)"></i>
                       </div>
                       <div class="flex flex-col">
                         <span class="text-xs font-bold text-slate-700 dark:text-gray-300 capitalize">{{ task.type }}</span>
                         <div v-if="task.type === 'materials' && task.material_approval?.needs_approval" class="mt-2 flex items-center gap-3">
                           <div class="flex items-center p-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div v-for="(approved, dept) in task.material_approval.departments" :key="dept" 
                                   class="flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all"
                                   :class="approved ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 bg-transparent'">
                                <i :class="approved ? 'mdi mdi-check-circle' : 'mdi mdi-alert-circle-outline-outline'" class="text-[10px]"></i>
                                <span class="text-xs font-bold uppercase tracking-widest">{{ dept }}</span>
                                <span class="text-xs ml-1 opacity-50">{{ approved ? 'OK' : '...' }}</span>
                              </div>
                           </div>
                           <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                             {{ task.material_approval.approved_count }}/{{ task.material_approval.total_count }} Sign-offs
                           </span>
                         </div>
                       </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                       <span :class="getStatusBadgeClasses(task.status)" class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border shadow-sm min-w-[100px] text-center">
                         {{ task.status === 'skipped' && task.notes ? 'Skipped: ' + task.notes : getStatusLabel(task.status) }}
                       </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm">
                     <template v-if="!task.assigned_to">
                       <button @click.stop="claimTask(task)" class="text-xs font-bold text-primary hover:underline">Claim</button>
                     </template>
                     <div v-else class="flex items-center space-x-2">
                       <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                         {{ getInitials(task.assigned_to?.name) }}
                       </div>
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ task.assigned_to?.name }}</span>
                        <button 
                          v-if="task.assigned_to?.id === user?.id || isManager" 
                          @click.stop="handoverTask(task)" 
                          class="ml-3 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50 text-xs font-bold dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Release
                        </button>
                      </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-1">
                      <div v-for="i in 4" :key="i" class="h-1 w-4 rounded-full" :class="getPriorityHeatmap(task.priority, i)"></div>
                    </div>
                  </td>
                   <td class="px-6 py-4">
                    <div class="flex items-center space-x-2" :class="isOverdue(task) ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'">
                      <i class="mdi mdi-calendar-clock text-base" :class="isOverdue(task) ? 'animate-pulse' : ''"></i>
                      <div class="flex flex-col">
                        <span class="text-sm font-bold uppercase tracking-widest">{{ task.due_date ? formatDate(task.due_date) : 'No due date' }}</span>
                        <span v-if="isOverdue(task)" class="text-xs font-bold text-red-500 bg-red-50 px-1 py-0.5 rounded w-fit mt-0.5 uppercase tracking-tighter shadow-sm border border-red-100">
                          {{ getDaysOverdue(task.due_date!) }} Days Delay
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Task Assignment Modal -->
    <TaskAssignmentModal
      :show="showTaskAssignmentModal"
      :enquiry-id="selectedTask?.enquiry?.id || selectedTask?.project_enquiry_id || 0"
      :enquiry="selectedTask?.enquiry"
      @close="closeTaskAssignmentModal"
      @task-assigned="handleTaskAssigned"
    />

    <!-- Task Modal -->
      <TaskModal
        :show="showTaskModal"
        :task="selectedTask"
        :readonly="isReadonly"
        :initial-tab="targetTab"
        @close="closeTaskModal"
        @update-status="handleTaskModalStatusUpdate"
        @complete="handleTaskModalComplete"
        @assign="handleTaskAssigned"
      />
    <!-- Task Locked Modal -->
    <TaskLockedModal
      :is-open="showTaskLockedModal"
      :task="lockedTask"
      @close="closeTaskLockedModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { EnquiryTask } from '../types/enquiry'
import { useTaskAssignment } from '../composables/useTaskAssignment'
import { useAuth } from '@/composables/useAuth'
import api from '@/plugins/axios'
import TaskAssignmentModal from '../components/TaskAssignmentModal.vue'
import TaskModal from '../components/TaskModal.vue'
import TaskLockedModal from '../components/TaskLockedModal.vue'

const route = useRoute()
const { user } = useAuth()
const { 
  enquiryTasks, 
  fetchAllTasks, 
  updateTask, 
  loading,
  pendingTasks,
  inProgressTasks,
  completedTasks,
  tasksByPriority
} = useTaskAssignment()

const enquiryId = ref<number | null>(null)
const enquiryTitle = ref<string>('')

const filters = ref({
  search: '',
  status: '',
  priority: ''
})

// Automatic filtering
watch(filters, () => {
  applyFilters()
}, { deep: true })

const selectedTask = ref<EnquiryTask | null>(null)
const showTaskModal = ref(false)
const isReadonly = ref(false)
const targetTab = ref<string | null>(null)
const showTaskAssignmentModal = ref(false)
const showTaskLockedModal = ref(false)
const lockedTask = ref<EnquiryTask | null>(null)

// Performance Optimizations
const viewMode = ref<'grid' | 'table' | 'board'>('board')
const showAllTasks = ref(false)
const availableUsers = ref<Array<{ id: number; name: string; department?: string }>>([])

// Mission Milestones Logic
const missionMilestones = computed(() => {
  const completedTaskTypes = completedTasks.value.map(t => t.type)
  const milestones = [
    { 
      label: 'Site Survey', 
      status: 'site_survey_completed', 
      requires: ['site-survey'],
      completed: completedTaskTypes.includes('site-survey')
    },
    { 
      label: 'Design Ready', 
      status: 'design_completed', 
      requires: ['site-survey', 'design'],
      completed: completedTaskTypes.includes('site-survey') && completedTaskTypes.includes('design')
    },
    { 
      label: 'Resource Spec', 
      status: 'materials_specified', 
      requires: ['site-survey', 'design', 'materials'],
      completed: completedTaskTypes.includes('site-survey') && completedTaskTypes.includes('design') && completedTaskTypes.includes('materials')
    },
    { 
      label: 'Budget Set', 
      status: 'budget_created', 
      requires: ['site-survey', 'design', 'materials', 'budget'],
      completed: completedTaskTypes.includes('site-survey') && completedTaskTypes.includes('design') && completedTaskTypes.includes('materials') && completedTaskTypes.includes('budget')
    },
    { 
      label: 'Quote Live', 
      status: 'quote_prepared', 
      requires: ['site-survey', 'design', 'materials', 'budget', 'quote'],
      completed: completedTaskTypes.includes('site-survey') && completedTaskTypes.includes('design') && completedTaskTypes.includes('materials') && completedTaskTypes.includes('budget') && completedTaskTypes.includes('quote')
    }
  ]

  let nextFound = false
  return milestones.map(m => {
    const isNext = !m.completed && !nextFound
    if (isNext) nextFound = true

    return {
      ...m,
      isNext,
      missingTasks: m.requires.filter(r => !completedTaskTypes.includes(r))
    }
  })
})

const getMilestoneClasses = (m: any) => {
  if (m.completed) return 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
  if (m.isNext) return 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20 scale-[1.02]'
  return 'bg-slate-800/20 border-white/5 opacity-50'
}

const formatTaskType = (type: string) => {
  return type.replace('-', ' ').replace('_', ' ').toUpperCase()
}

const isManager = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return ['Super Admin', 'Project Manager', 'Project Officer', 'Client Service', 'HR'].includes(roleName)
  })
})

// Fetch available users for quick assign
const fetchAvailableUsers = async () => {
  try {
    const response = await api.get('/api/users', {
      params: { per_page: 1000, status: 'active' }
    })
    
    console.log('[DEBUG] Users API Response:', response.data)
    
    // Extract users array from response
    const users = response.data.data || response.data || []
    
    // Map to ensure correct structure (id, name, department)
    availableUsers.value = users.map((user: any) => ({
      id: user.id,
      name: user.name || user.username || `User ${user.id}`,
      department: user.department?.name || user.department_name || undefined
    }))
    
    console.log('[DEBUG] Mapped available users:', availableUsers.value.length, 'users')
    console.log('[DEBUG] First user:', availableUsers.value[0])
  } catch (error) {
    console.error('Error fetching users:', error)
    availableUsers.value = []
  }
}

// Quick assign function
const quickAssignTask = async (task: EnquiryTask, event: Event) => {
  const select = event.target as HTMLSelectElement
  const userId = parseInt(select.value)
  
  if (!userId) return
  
  try {
    const response = await api.post(`/api/projects/enquiry-tasks/${task.id}/assign`, {
      assigned_user_id: userId,
      priority: task.priority || 'medium'
    })
    
    // Update task in local state
    const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
    if (taskIndex > -1) {
      enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], ...response.data.data }
    }
    
    // Reset select
    select.value = ''
    
    // Show success message
    console.log(`Task "${task.title}" assigned to user ${userId}`)
  } catch (error) {
    console.error('Error assigning task:', error)
    select.value = '' // Reset on error
  }
}

// Claim task function
const claimTask = async (task: EnquiryTask) => {
  if (!user.value?.id) return
  
  try {
    const response = await api.post(`/api/projects/enquiry-tasks/${task.id}/assign`, {
      assigned_user_id: user.value.id,
      priority: task.priority || 'medium'
    })
    
    // Update task in local state
    const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
    if (taskIndex > -1) {
      enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], ...response.data.data }
    }
    
    console.log(`Task "${task.title}" claimed by user ${user.value.id}`)
  } catch (error) {
    console.error('Error claiming task:', error)
  }
}

// Release task (release to pool)
const handoverTask = async (task: EnquiryTask) => {
  if (!user.value?.id) return
  
  // Prompt for reason (Mandatory as per requirements)
  const reason = prompt(`Please provide a reason for releasing task "${task.title}" back to the pool:`)
  if (reason === null) return // Cancelled
  if (!reason.trim()) {
      alert("A reason is required to release the task.")
      return
  }

  try {
    const response = await api.put(`/api/projects/enquiry-tasks/${task.id}/release`, { reason: reason })
    
    // Update task in local state
    const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
    if (taskIndex > -1) {
      enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], ...response.data.data }
    }
    
    console.log(`Task "${task.title}" released to pool. Reason: ${reason}`)
  } catch (error) {
    console.error('Error releasing task:', error)
    alert('Failed to release task')
  }
}

// Open advanced assignment modal
const openAdvancedAssign = (task: EnquiryTask) => {
  selectedTask.value = task
  showTaskAssignmentModal.value = true
}

const closeTaskAssignmentModal = () => {
  showTaskAssignmentModal.value = false
  selectedTask.value = null
}

// Event listener for global task-completed events (used by BudgetTask)
const handleGlobalTaskCompleted = (event: CustomEvent) => {
  const { task } = event.detail
  console.log('[DEBUG] ProjectTasks received global task-completed event:', {
    taskId: task.id,
    taskTitle: task.title,
    taskStatus: task.status
  })

  // Update the task in the local state
  const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
  if (taskIndex > -1) {
    enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], status: 'completed' }

    // Also update selectedTask if this task is currently open in modal
    if (selectedTask.value && selectedTask.value.id === task.id) {
      selectedTask.value = { ...enquiryTasks.value[taskIndex] }
      console.log('[DEBUG] ProjectTasks updated selectedTask status to completed')
    }
  }
}

const filteredTasks = computed(() => {
  let tasks = enquiryTasks.value

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.enquiry?.title?.toLowerCase().includes(searchTerm) ||
      task.assigned_by?.name?.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.status) {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }

  if (filters.value.priority) {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }

  return tasks
})

const applyFilters = () => {
  // Fetch tasks with current filters
  fetchAllTasks({
    search: filters.value.search,
    status: filters.value.status,
    priority: filters.value.priority,
    enquiry_id: enquiryId.value || undefined,
    assigned_user_id: showAllTasks.value ? undefined : user.value?.id
  })
}

const toggleTaskView = () => {
  showAllTasks.value = !showAllTasks.value
  applyFilters()
}

const updateTaskStatus = async (task: EnquiryTask, status: EnquiryTask['status']) => {
  try {
    await updateTask(task.id, { status })
    // Update local state
    const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
    if (taskIndex > -1) {
      enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], status }
    }
    return true
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'Failed to update task status'
    
    // Detect "Hard Gate" Context for Quick Fix navigation
    let suggestion = null
    let suggestedTab = null
    
    if (errorMsg.includes('survey photo') || errorMsg.includes('survey record') || errorMsg.includes('at least one survey photo')) {
      suggestion = 'Would you like to go to the Photos tab to upload evidence?'
      suggestedTab = 'photos'
    } else if (errorMsg.includes('design asset') || errorMsg.includes('conceptual layout')) {
      suggestion = 'Would you like to go to the Upload tab to attach design files?'
      suggestedTab = 'upload'
    } else if (errorMsg.includes('unresolved issues') || errorMsg.includes('documentation photos')) {
      suggestion = 'Would you like to go to the Documentation tab to check photos or the Issues tab?'
      suggestedTab = errorMsg.includes('issues') ? 'issues' : 'documentation'
    } else if (errorMsg.includes('material approvals')) {
      suggestion = 'Would you like to go to the Approvals section?'
      suggestedTab = 'approvals'
    } else if (errorMsg.includes('procurement') || errorMsg.includes('pending receipt')) {
      suggestion = 'Would you like to check the procurement progress?'
      suggestedTab = 'items'
    } else if (errorMsg.includes('Mandatory criteria unmet')) {
      suggestion = 'Would you like to go to the Quality Control tab to check requirements?'
      suggestedTab = 'quality-control'
    } else if (errorMsg.includes('Budget data is missing') || errorMsg.includes('greater than zero')) {
      suggestion = 'Would you like to go to the Budget section?'
      suggestedTab = 'materials'
    } else if (errorMsg.includes('Quote data is missing') || errorMsg.includes('Budget data has not been imported')) {
      suggestion = 'Would you like to go to the Quote section?'
      suggestedTab = 'materials'
    } else if (errorMsg.includes('final decision (Approved/Rejected) is required')) {
      suggestion = 'Would you like to go to the Review tab?'
      suggestedTab = 'review'
    }

    if (suggestion && confirm(`Operational Error: ${errorMsg}\n\nQuick Fix: ${suggestion}`)) {
      targetTab.value = suggestedTab
      openTaskModal(task)
    } else if (!suggestion) {
      alert(`Operational Error: ${errorMsg}`)
    }

    console.error('Error updating task status:', error)
    return false
  }
}

const handleTaskAssigned = (updatedTask: EnquiryTask) => {
  console.log('[DEBUG] ProjectTasks handleTaskAssigned called with:', {
    updatedTaskId: updatedTask.id,
    assigned_to: updatedTask.assigned_to,
    assigned_by: updatedTask.assigned_by,
    selectedTaskId: selectedTask.value?.id
  })

  // Update the specific task in the local array
  const taskIndex = enquiryTasks.value.findIndex(t => t.id === updatedTask.id)
  if (taskIndex > -1) {
    enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], ...updatedTask }

    // Also update selectedTask if this task is currently open in modal
    if (selectedTask.value && selectedTask.value.id === updatedTask.id) {
      selectedTask.value = { ...enquiryTasks.value[taskIndex] }
      console.log('[DEBUG] ProjectTasks updated selectedTask:', {
        id: selectedTask.value.id,
        assigned_to: selectedTask.value.assigned_to,
        assigned_by: selectedTask.value.assigned_by
      })
    }
  } else {
    // If task not found, refresh all tasks
    fetchAllTasks({
      enquiry_id: enquiryId.value || undefined
    })
  }
}

const openTaskModal = async (task: EnquiryTask) => {
  // 1. Optimistic Check (Instant)
  const currentUser = user.value
  const assignee = task.assigned_to
  if (assignee && assignee.id !== currentUser?.id) {
     const userRoles = currentUser?.roles || []
     const isManager = userRoles.some((role: string) => 
       ['Super Admin', 'Project Manager', 'Project Officer', 'Client Service', 'HR'].includes(role)
     )
     if (!isManager) {
        // Open TaskModal in Read-Only Mode
        selectedTask.value = task
        isReadonly.value = true
        showTaskModal.value = true
        return
     }
   }

   // 2. Server Check (Authoritative & Refresh)
   try {
     const response = await api.get(`/api/tasks/${task.id}`)
     const freshTask = response.data.data
     
     // Update local state with fresh data
     const index = enquiryTasks.value.findIndex(t => t.id === task.id)
     if (index !== -1) {
         enquiryTasks.value[index] = { ...enquiryTasks.value[index], ...freshTask }
     }
 
     // Check if task is locked for current user
     if (freshTask.is_locked_for_user) {
         selectedTask.value = freshTask
         isReadonly.value = true
         showTaskModal.value = true
         return
     }
     
     selectedTask.value = freshTask
     isReadonly.value = false
     showTaskModal.value = true
 
   } catch (error: any) {
    if (error.response?.status === 403) {
      // Fallback for unexpected 403s (should rely on is_locked_for_user now)
       alert("Access Denied: " + (error.response?.data?.message || "Task is locked by another user."))
    } else {
      console.error("Failed to fetch task details:", error)
      // Fallback: If network error but passed local check, maybe allow? 
      // Safest to block or show stale if local check passed. 
      // But strictly, we want to enforce lock.
      alert("Unable to verify task lock status. Please try again.")
    }
  }
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
  isReadonly.value = false
  // Refresh tasks to ensure list is up to date (e.g. locks, status changes)
  applyFilters()
}

const closeTaskLockedModal = () => {
  showTaskLockedModal.value = false
  lockedTask.value = null
}

const handleTaskModalStatusUpdate = async (status: EnquiryTask['status']) => {
  if (selectedTask.value) {
    const success = await updateTaskStatus(selectedTask.value, status)
    if (success) {
      // Update the selectedTask to reflect the new status
      selectedTask.value = { ...selectedTask.value, status }

      // Also update the task in the main tasks list
      const taskIndex = enquiryTasks.value.findIndex(t => t.id === selectedTask.value!.id)
      if (taskIndex > -1) {
        enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], status }
      }
    }
  }
}

const handleTaskModalComplete = async () => {
  if (selectedTask.value) {
    const success = await updateTaskStatus(selectedTask.value, 'completed')
    if (success) {
      // Update the selectedTask to reflect the new status
      selectedTask.value = { ...selectedTask.value, status: 'completed' }
      closeTaskModal()
    }
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'bg-yellow-500',
    'in_progress': 'bg-blue-500',
    'completed': 'bg-emerald-500',
    'cancelled': 'bg-red-500',
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'skipped': 'Skipped',
    'cancelled': 'Cancelled',
  }
  return labels[status] || status
}

const getPriorityColor = (priority?: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[priority || 'medium'] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusBadgeClasses = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
    case 'in_progress':
      return 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
    case 'completed':
      return 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
    case 'skipped':
      return 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400'
    case 'cancelled':
      return 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-400'
    default:
      return 'bg-slate-50 border-slate-200 text-slate-600'
  }
}

const isOverdue = (task: EnquiryTask) => {
  if (!task.due_date) return false
  if (task.status === 'completed' || task.status === 'cancelled') return false
  return new Date(task.due_date) < new Date()
}

const getDaysOverdue = (dateString: string) => {
  const diffTime = new Date().getTime() - new Date(dateString).getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getTaskTypeIcon = (type?: string) => {
  const icons: Record<string, string> = {
    'site-survey': 'bg-blue-500',
    'design': 'bg-purple-500',
    'materials': 'bg-orange-600',
    'budget': 'bg-yellow-500',
    'quote': 'bg-indigo-500',
    'event': 'bg-pink-500',
  }
  return icons[type || ''] || 'bg-gray-500'
}

const getTaskTypeInitial = (type?: string) => {
  const initials: Record<string, string> = {
    'site-survey': 'S',
    'design': 'D',
    'materials': 'M',
    'budget': 'B',
    'quote': 'Q',
    'event': 'E',
  }
  return initials[type || ''] || 'T'
}

const getInitials = (name?: string | null) => {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getMdiTaskIcon = (type?: string) => {
  const icons: Record<string, string> = {
    'site-survey': 'mdi-map-marker-path',
    'design': 'mdi-palette-swatch',
    'materials': 'mdi-cube-scan',
    'budget': 'mdi-finance',
    'quote': 'mdi-file-sign',
    'event': 'mdi-calendar-star',
  }
  return icons[type || ''] || 'mdi-checkbox-marked-circle-outline'
}

const getBoardStatusColors = (status: string) => {
  const colors: Record<string, any> = {
    'pending': { dot: 'bg-yellow-400' },
    'in_progress': { dot: 'bg-blue-500' },
    'completed': { dot: 'bg-emerald-500' },
    'skipped': { dot: 'bg-gray-500' },
    'cancelled': { dot: 'bg-red-500' },
  }
  return colors[status] || colors.pending
}

const getPriorityHeatmap = (priority: string | undefined, index: number) => {
  const levels: Record<string, number> = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 }
  const current = levels[priority || 'low'] || 1
  
  if (index > current) return 'bg-gray-100 dark:bg-gray-800'
  
  if (current === 4) return 'bg-red-500'
  if (current === 3) return 'bg-orange-500'
  return 'bg-blue-500'
}



onMounted(async () => {
  // Add global event listener for task-completed events
  window.addEventListener('task-completed', handleGlobalTaskCompleted as EventListener)

  // Fetch available users for quick assign dropdowns
  await fetchAvailableUsers()

  // Check if enquiry_id is provided in query params
  const enquiryIdParam = route.query.enquiry_id as string
  if (enquiryIdParam) {
    enquiryId.value = parseInt(enquiryIdParam)
  }

  await fetchAllTasks({
    enquiry_id: enquiryId.value || undefined,
    assigned_user_id: showAllTasks.value ? undefined : user.value?.id
  })

  // Set enquiry title from the first task if available
  if (enquiryId.value && enquiryTasks.value.length > 0) {
    enquiryTitle.value = enquiryTasks.value[0].enquiry?.title || 'Unknown Enquiry'
  } else if (enquiryId.value) {
    // If no tasks found but enquiryId exists, try to fetch enquiry details
    // First try to fetch all tasks for this enquiry (without user filter)
    try {
      await fetchAllTasks({
        enquiry_id:enquiryId.value,
        assigned_user_id: undefined // Get all tasks for this enquiry
      })
      if (enquiryTasks.value.length > 0) {
        enquiryTitle.value = enquiryTasks.value[0].enquiry?.title || 'Unknown Enquiry'
      } else {
        // If still no tasks, try to fetch enquiry directly
        const response = await api.get(`/api/projects/enquiries/${enquiryId.value}`)
        enquiryTitle.value = response.data.data?.title || 'Unknown Enquiry'
      }
    } catch (error) {
      console.error('Failed to fetch enquiry details:', error)
      enquiryTitle.value = 'Unknown Enquiry'
    }
  }
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('task-completed', handleGlobalTaskCompleted as EventListener)
})
</script>

