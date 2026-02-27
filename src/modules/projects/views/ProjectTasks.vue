<template>
  <div class="h-full flex flex-col font-inter bg-slate-50 dark:bg-gray-900/50">
    <!-- Modern Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
      <div class="max-w-[1920px] mx-auto px-6 py-4">
        <!-- Top Row: Title & Breadcrumbs -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <nav class="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <router-link to="/projects" class="hover:text-blue-600 transition-colors">Projects</router-link>
              <i class="mdi mdi-chevron-right text-slate-400"></i>
              <router-link v-if="enquiryId" to="/projects/enquiries" class="hover:text-blue-600 transition-colors">Enquiries</router-link>
              <i v-if="enquiryId" class="mdi mdi-chevron-right text-slate-400"></i>
              <span class="text-slate-800 dark:text-gray-200">Tasks</span>
            </nav>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                <span v-if="enquiryId" class="text-blue-600 mr-2 font-mono text-xl bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{{ projectIdentifier }}</span>
                {{ enquiryId ? enquiryTitle : (showAllTasks ? 'Team Tasks' : 'My Tasks') }}
              </h1>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
             <router-link 
              v-if="enquiryId" 
              :to="getBackLink()" 
              class="h-9 px-4 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <i class="mdi mdi-arrow-left"></i>
              <span>Back to Project</span>
            </router-link>
            
            <button
              @click="toggleTaskView"
              class="h-9 px-4 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 border"
              :class="showAllTasks 
                ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'"
            >
              <i class="mdi" :class="showAllTasks ? 'mdi-account-group' : 'mdi-account-circle'"></i>
              {{ showAllTasks ? 'Team View' : 'My Tasks' }}
            </button>
          </div>
        </div>

        <!-- Bottom Row: Unified Toolbar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Left: Search & key filters -->
          <div class="flex items-center gap-3 w-full md:w-auto flex-1">
            <div class="relative w-full md:w-80">
              <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search tasks..."
                class="w-full pl-10 pr-4 h-10 bg-slate-100 dark:bg-gray-800 border-none rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div class="hidden md:flex items-center gap-2">
                <select
                  v-model="filters.status"
                  class="h-10 pl-3 pr-8 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="skipped">Skipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  v-model="filters.priority"
                  class="h-10 pl-3 pr-8 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
            </div>
          </div>

          <!-- Right: View Modes -->
          <div class="flex items-center bg-slate-100 dark:bg-gray-800 p-1 rounded-lg border border-slate-200 dark:border-gray-700">
            <button
              v-for="mode in (['board', 'grid', 'table'] as const)"
              :key="mode"
              @click="viewMode = mode"
              class="px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              :class="viewMode === mode 
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:text-gray-400'"
            >
              <i class="mdi" 
                 :class="{
                   'board': 'mdi-view-column',
                   'grid': 'mdi-view-grid',
                   'table': 'mdi-table'
                 }[mode]"></i>
              <span class="hidden sm:inline">{{ mode }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Minimalistic Project Workflow -->
    <div v-if="enquiryId && !loading && filteredTasks.length > 0" class="border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="max-w-[1920px] mx-auto px-8 py-4">
        <div class="flex items-center gap-8">
          <!-- Progress Indicator -->
          <div class="flex items-center gap-3">
            <div class="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">Progress</div>
            <div class="flex items-center gap-2">
              <div class="w-32 h-1.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000 rounded-full"
                     :style="{ width: `${(missionMilestones.filter(m => m.completed).length / missionMilestones.length) * 100}%` }"></div>
              </div>
              <span class="text-sm font-black text-slate-800 dark:text-white tabular-nums">{{ Math.round((missionMilestones.filter(m => m.completed).length / missionMilestones.length) * 100) }}%</span>
            </div>
          </div>

          <!-- Milestone Timeline -->
          <div class="flex-1 relative flex items-center h-12">
            <!-- Track -->
            <div class="absolute inset-x-0 h-px bg-slate-200 dark:bg-gray-700 top-1/2 -translate-y-1/2"></div>
            <div class="absolute left-0 h-px bg-gradient-to-r from-emerald-500 to-blue-500 top-1/2 -translate-y-1/2 transition-all duration-1000"
                 :style="{ width: `${(missionMilestones.filter(m => m.completed).length / Math.max(missionMilestones.length - 1, 1)) * 100}%` }"></div>

            <!-- Milestones -->
            <div class="relative w-full flex justify-between">
              <div 
                v-for="(milestone, index) in missionMilestones" 
                :key="index"
                class="group relative flex flex-col items-center"
              >
                <!-- Node -->
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-gray-900 cursor-pointer hover:scale-110 relative z-10"
                  :class="[
                    milestone.completed 
                      ? 'border-emerald-500 text-emerald-500' 
                      : milestone.isNext 
                        ? 'border-blue-500 text-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/20' 
                        : 'border-slate-200 dark:border-gray-700 text-slate-300'
                  ]"
                >
                  <i class="mdi text-sm" :class="milestone.completed ? 'mdi-check' : getMilestoneIcon(milestone)"></i>
                </div>

                <!-- Tooltip on Hover -->
                <div class="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div class="bg-slate-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                    <div class="font-bold mb-1">{{ milestone.label }}</div>
                    <div class="text-[9px] opacity-80">
                      <span v-if="milestone.completed" class="text-emerald-400">✓ Complete</span>
                      <span v-else-if="milestone.isNext" class="text-blue-400">{{ getPendingTasksForMilestone(milestone) }} pending</span>
                      <span v-else class="text-slate-400">Locked</span>
                      <span v-if="getAssigneeForMilestone(milestone)" class="ml-2">• {{ getAssigneeForMilestone(milestone) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-6 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-medium">Active</span>
              <span class="font-black text-blue-600 tabular-nums">{{ inProgressTasks.length }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-medium">Pending</span>
              <span class="font-black text-slate-600 dark:text-gray-400 tabular-nums">{{ pendingTasks.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-grow p-6 overflow-y-auto overflow-x-hidden w-full max-w-[1920px] mx-auto">
      
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-sm text-slate-500 font-medium">Loading tasks...</p>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 border-dashed">
        <div class="p-4 bg-slate-50 dark:bg-gray-700 rounded-full mb-3">
          <i class="mdi mdi-checkbox-blank-off-outline text-2xl text-slate-400"></i>
        </div>
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">No tasks found</h3>
        <p class="text-xs text-slate-500 mt-1">Try adjusting your filters.</p>
      </div>

      <template v-else>
        <!-- Board View -->
        <div v-if="viewMode === 'board'" class="flex overflow-x-auto gap-6 pb-6 h-full items-start">
          <div v-for="status in ['pending', 'in_progress', 'completed', 'skipped', 'cancelled']" :key="status" class="flex-shrink-0 w-80 flex flex-col max-h-full">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-3 px-1">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :class="getBoardStatusColors(status).dot"></span>
                {{ getStatusLabel(status) }}
              </span>
              <span class="px-2 py-0.5 bg-slate-200 dark:bg-gray-700 rounded-full text-[10px] font-bold text-slate-600 dark:text-gray-300">
                {{ filteredTasks.filter(t => t.status === status).length }}
              </span>
            </div>

            <!-- Draggable Area (Visual Only) -->
            <div class="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-10">
              <div 
                v-for="task in filteredTasks.filter(t => t.status === status)" 
                :key="task.id"
                @click="openTaskModal(task)"
                class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden"
              >
                <!-- Priority Stripe -->
                <div v-if="task.priority === 'urgent'" class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div v-else-if="task.priority === 'high'" class="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                
                <div class="pl-2">
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ getProjectIdentifier(task) }}</span>
                    <div class="flex gap-1">
                        <!-- Specialized Materials Gating Badge -->
                        <div v-if="task.type === 'materials' && task.material_approval?.is_gated" 
                             class="flex items-center gap-1 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded animate-pulse"
                        >
                            <i class="mdi mdi-alert text-[10px] text-red-600 dark:text-red-400"></i>
                            <span class="text-[9px] font-black text-red-700 dark:text-red-300 uppercase">Gated</span>
                        </div>

                        <div v-if="isTaskLocked(task)" class="text-slate-400 text-[10px] font-bold flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded" title="Waiting for previous task">
                           <i class="mdi mdi-lock text-[10px]"></i> Wait
                        </div>
                        <div v-if="isOverdue(task)" class="text-red-500 text-[10px] font-bold flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                           <i class="mdi mdi-clock-alert"></i> {{ getDaysOverdue(task.due_date!) }}d
                        </div>
                    </div>
                  </div>
                  
                  <h4 class="text-sm font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-blue-600 transition-colors">{{ task.title }}</h4>
                  
                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-gray-700">
                    <div class="flex items-center gap-2">
                       <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-600">
                         {{ getInitials(getAssignedUserName(task)) }}
                       </div>
                       <span class="text-xs text-slate-500 truncate max-w-[80px]">{{ getAssignedUserName(task)?.split(' ')[0] || 'Unassigned' }}</span>
                    </div>
                    <span class="text-[10px] font-mono font-medium text-slate-400">{{ task.due_date ? formatDate(task.due_date) : '' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            @click="openTaskModal(task)"
            class="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group flex h-36 overflow-hidden items-stretch"
          >
             <!-- Vertical Status Strip (Left) -->
             <div 
               class="w-10 flex items-center justify-center shrink-0 border-r border-slate-100 dark:border-gray-700/50 transition-colors"
               :class="getStatusColor(task.status)"
             >
                <span class="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap" style="writing-mode: vertical-rl; transform: rotate(180deg);">
                  {{ getStatusLabel(task.status) }}
                </span>
             </div>

             <!-- Content Area -->
             <div class="flex-grow p-4 flex flex-col justify-between min-w-0">
                <!-- Header: Top Metadata -->
                <div class="flex justify-between items-start gap-2">
                   <div class="flex flex-col min-w-0">
                      <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate pr-2 group-hover:text-blue-600 transition-colors">
                        {{ task.title }}
                      </h4>
                      <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                        {{ getProjectIdentifier(task) }} • {{ formatTaskType(task.type) }}
                      </span>
                   </div>
                   
                   <!-- Status Icons & Gating Badges -->
                   <div class="flex items-center gap-1.5 shrink-0">
                        <!-- Specialized Materials Gating Badge -->
                        <div v-if="task.type === 'materials' && task.material_approval?.is_gated" 
                             class="flex flex-col items-end"
                        >
                           <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 border-2 border-red-500 rounded text-[9px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-tighter shadow-md flex items-center gap-1 animate-pulse">
                               <i class="mdi mdi-alert text-[11px] text-red-600 dark:text-red-400"></i>
                               Pending: Gated by Design
                           </span>
                           <span class="text-[8px] font-black text-red-600 dark:text-red-500 mt-0.5 tracking-tightest">APPROVALS LOCKED</span>
                        </div>

                        <div v-if="isTaskLocked(task)" class="text-slate-400 dark:text-slate-500" title="Dependencies not met">
                            <i class="mdi mdi-lock-outline"></i>
                        </div>
                        <div v-if="task.priority === 'urgent'" class="text-red-500 animate-pulse" title="Urgent">
                            <i class="mdi mdi-fire"></i>
                        </div>
                        <div v-else-if="task.priority === 'high'" class="text-orange-500" title="High Priority">
                            <i class="mdi mdi-alert-circle"></i>
                        </div>
                   </div>
                </div>

                <!-- Mid: Description Snippet or Materials Summary -->
                <div class="flex-grow flex items-center">
                    <!-- Simplified Materials Summary -->
                    <div v-if="task.type === 'materials'" class="w-full flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <div class="flex gap-1.5">
                                <span 
                                    v-for="(approved, dept) in task.material_approval?.departments" 
                                    :key="dept"
                                    class="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black uppercase border"
                                    :class="[
                                        approved 
                                            ? 'bg-emerald-500 border-emerald-600 text-white' 
                                            : 'bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-400'
                                    ]"
                                    :title="dept.charAt(0).toUpperCase() + dept.slice(1) + (approved ? ' Approved' : ' Pending')"
                                >
                                    {{ dept.charAt(0) }}
                                </span>
                            </div>
                            <div class="text-[10px] font-bold text-slate-500">
                                {{ task.material_approval?.element_count || 0 }} e | {{ task.material_approval?.material_count || 0 }} m
                            </div>
                        </div>
                        
                        <!-- Secondary Status Badge (if not gated) -->
                        <div v-if="!task.material_approval?.is_gated && task.material_approval?.all_approved" class="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-md">
                            <i class="mdi mdi-check-circle-outline text-emerald-500 text-[10px]"></i>
                            <span class="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">Fully Approved</span>
                        </div>
                    </div>

                    <!-- Generic Description for other tasks -->
                    <template v-else>
                        <p v-if="task.task_description" class="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                           {{ task.task_description }}
                        </p>
                        <span v-else class="text-xs text-slate-300 italic">No additional details provided.</span>
                    </template>
                </div>

                <!-- Footer: Assignee & Date -->
                <div class="flex justify-between items-end mt-2 pt-2 border-t border-slate-50 dark:border-gray-700/50">
                   <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-600 shrink-0">
                        {{ getInitials(getAssignedUserName(task)) }}
                      </div>
                      <div class="flex flex-col">
                          <span class="text-[9px] font-bold text-slate-300 uppercase leading-none">Assignee</span>
                          <span class="text-[10px] font-semibold text-slate-600 dark:text-gray-400 truncate max-w-[100px]">
                            {{ getAssignedUserName(task)?.split(' ')[0] || 'Unassigned' }}
                          </span>
                      </div>
                   </div>

                   <div class="flex flex-col items-end">
                      <span class="text-[9px] font-bold text-slate-300 uppercase leading-none mb-0.5">Due</span>
                      <span v-if="isOverdue(task)" class="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <i class="mdi mdi-clock-alert"></i> {{ getDaysOverdue(task.due_date!) }}d
                      </span>
                      <span v-else class="text-[10px] font-mono font-medium text-slate-400">
                        {{ task.due_date ? formatDate(task.due_date) : '--' }}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 dark:bg-gray-700/50 border-b border-slate-200 dark:border-gray-700 text-left">
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Due Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-gray-700">
              <tr 
                v-for="task in filteredTasks" 
                :key="task.id"
                @click="openTaskModal(task)"
                class="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                      <div class="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {{ task.title }}
                        <!-- Table View Gating Alert -->
                        <span v-if="task.type === 'materials' && task.material_approval?.is_gated" 
                              class="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded animate-pulse"
                              title="Gated by Design - Approvals Locked"
                        >
                          <i class="mdi mdi-alert text-[10px] text-red-600 dark:text-red-400"></i>
                          <span class="text-[8px] font-black text-red-700 dark:text-red-300 uppercase">Gated</span>
                        </span>
                      </div>
                      <div v-if="task.priority === 'urgent'" class="text-[10px] font-bold text-red-500 mt-0.5">URGENT</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-slate-700 dark:text-gray-300">{{ task.enquiry?.title || 'General' }}</div>
                  <div class="text-xs text-slate-400 font-mono">{{ getProjectIdentifier(task) }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-xs font-bold text-slate-600 dark:text-gray-300 capitalize">
                    {{ formatTaskType(task.type) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClasses(task.status)" class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border">
                    {{ getStatusLabel(task.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-gray-600 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-white">
                      {{ getInitials(getAssignedUserName(task)) }}
                    </div>
                    <span class="text-sm text-slate-600 dark:text-gray-300">{{ getAssignedUserName(task) || 'Unassigned' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-mono font-medium" :class="isOverdue(task) ? 'text-red-500 font-bold' : 'text-slate-600 dark:text-gray-400'">
                    {{ task.due_date ? formatDate(task.due_date) : '--' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </main>

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
        :prev-task="prevTask"
        :next-task="nextTask"
        :readonly="isReadonly"
        :initial-tab="targetTab"
        @close="closeTaskModal"
        @update-status="handleTaskModalStatusUpdate"
        @complete="handleTaskModalComplete"
        @assign="handleTaskAssigned"
        @switch-task="handleTaskSwitch"
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
const projectIdentifier = ref<string>('')

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
const viewMode = ref<'grid' | 'table' | 'board'>('grid')
const showAllTasks = ref(true)
const availableUsers = ref<Array<{ id: number; name: string; department?: string }>>([])

// Mission Milestones Logic
// Mission Milestones Logic - Dynamic based on project tasks
const missionMilestones = computed(() => {
  const existingTaskTypes = new Set(enquiryTasks.value.map(t => t.type?.toLowerCase()))
  const completedTaskTypes = completedTasks.value.map(t => t.type?.toLowerCase())
  
  // Define full pool of possible milestones
  const milestonePool = [
    { 
      label: 'Site Survey', 
      status: 'site_survey_completed', 
      primaryType: 'site-survey',
      requires: ['site-survey', 'site survey', 'survey']
    },
    { 
      label: 'Design Ready', 
      status: 'design_completed', 
      primaryType: 'design',
      requires: ['site-survey', 'site survey', 'survey', 'design']
    },
    { 
      label: 'Resource Spec', 
      status: 'materials_specified', 
      primaryType: 'materials',
      requires: ['site-survey', 'site survey', 'survey', 'design', 'materials']
    },
    { 
      label: 'Budget Set', 
      status: 'budget_created', 
      primaryType: 'budget',
      requires: ['site-survey', 'site survey', 'survey', 'design', 'materials', 'budget']
    },
    { 
      label: 'Quote Live', 
      status: 'quote_prepared', 
      primaryType: 'quote',
      requires: ['site-survey', 'site survey', 'survey', 'design', 'materials', 'budget', 'quote']
    },
    { 
      label: 'Procurement', 
      status: 'procurement_ready', 
      primaryType: 'procurement',
      requires: ['quote', 'procurement']
    },
    { 
      label: 'In Production', 
      status: 'production_started', 
      primaryType: 'production',
      requires: ['quote', 'production']
    },
    { 
      label: 'Logistics', 
      status: 'logistics_ready', 
      primaryType: 'logistics',
      requires: ['production', 'logistics']
    },
    { 
      label: 'Venue Setup', 
      status: 'setup_completed', 
      primaryType: 'setup',
      requires: ['logistics', 'setup']
    },
    { 
      label: 'Handover', 
      status: 'handover_completed', 
      primaryType: 'handover',
      requires: ['setup', 'handover']
    },
    { 
      label: 'Set Down', 
      status: 'setdown_completed', 
      primaryType: 'setdown',
      requires: ['handover', 'setdown']
    }
  ]

  // Filter milestones to only show those that have at least one task in the project
  const activeMilestones = milestonePool.filter(m => {
    // A milestone is active if its primary type or ANY of its required types exist in the project
    return existingTaskTypes.has(m.primaryType) || 
           m.requires.some(r => existingTaskTypes.has(r))
  }).map(m => {
    // Current milestone requirements, filtered by what actually exists in project
    const projectRequires = m.requires.filter(r => existingTaskTypes.has(r))
    
    return {
      label: m.label,
      status: m.status,
      requires: projectRequires,
      // Completed if all relevant required tasks that exist in project are done
      completed: projectRequires.length > 0 && projectRequires.every(r => completedTaskTypes.includes(r))
    }
  })

  // Determine "IsNext" for the timeline
  let nextFound = false
  return activeMilestones.map(m => {
    const isNext = !m.completed && !nextFound
    if (isNext) nextFound = true

    return {
      ...m,
      isNext,
      missingTasks: m.requires.filter(r => !completedTaskTypes.includes(r))
    }
  })
})

const getMilestoneIcon = (m: any) => {
  switch (m.status) {
    case 'site_survey_completed': return 'mdi-map-marker-path'
    case 'design_completed': return 'mdi-palette-swatch-outline'
    case 'materials_specified': return 'mdi-tools'
    case 'budget_created': return 'mdi-calculator-variant-outline'
    case 'quote_prepared': return 'mdi-file-certificate-outline'
    case 'procurement_ready': return 'mdi-cart-arrow-down'
    case 'production_started': return 'mdi-hammer-wrench'
    case 'logistics_ready': return 'mdi-truck-fast'
    case 'setup_completed': return 'mdi-tent'
    case 'handover_completed': return 'mdi-account-switch'
    case 'setdown_completed': return 'mdi-package-down'
    default: return 'mdi-circle-outline'
  }
}

const formatTaskType = (type: string) => {
  if (!type) return 'TASK'
  return type.replace('-', ' ').replace('_', ' ').toUpperCase()
}

// Helper functions for enhanced workflow overview
const getTaskCountForMilestone = (milestone: any) => {
  const tasksForMilestone = enquiryTasks.value.filter(task => 
    milestone.requires.includes(task.type?.toLowerCase())
  )
  return tasksForMilestone.length
}

const getPendingTasksForMilestone = (milestone: any) => {
  const tasksForMilestone = enquiryTasks.value.filter(task => 
    milestone.requires.includes(task.type?.toLowerCase()) && 
    task.status !== 'completed' && 
    task.status !== 'skipped'
  )
  return tasksForMilestone.length
}

const getAssigneeForMilestone = (milestone: any) => {
  // Find the first active task for this milestone
  const activeTask = enquiryTasks.value.find(task => 
    milestone.requires.includes(task.type?.toLowerCase()) && 
    task.status !== 'completed' && 
    task.status !== 'skipped'
  )
  
  if (!activeTask) return null
  
  // Try to get assignee name from various possible fields
  if (activeTask.assigned_to?.name) return activeTask.assigned_to.name
  if (activeTask.assignedUser?.name) return activeTask.assignedUser.name
  if (activeTask.assigned_users && activeTask.assigned_users.length > 0) {
    return activeTask.assigned_users[0].name
  }
  if (activeTask.assignedUsers && activeTask.assignedUsers.length > 0) {
    return activeTask.assignedUsers[0].name
  }
  
  return 'Unassigned'
}

const isTaskLocked = (task: EnquiryTask) => {
  if (task.status === 'completed' || task.status === 'in_progress' || task.status === 'skipped') return false
  
  const completedTypes = new Set(completedTasks.value.map(t => t.type?.toLowerCase()))
  const requirements: Record<string, string[]> = {
    'design': ['site-survey', 'site survey', 'survey'],
    'materials': ['design'],
    'budget': ['materials'],
    'quote': ['budget'],
    'quote_approval': ['quote'],
    'production': ['quote_approval', 'quote'],
    'logistics': ['production'],
    'handover': ['production', 'logistics', 'setup'],
    'setdown': ['handover']
  }
  
  const typeKey = task.type?.toLowerCase()
  const reqs = requirements[typeKey]
  if (!reqs) return false
  
  // Only check requirements that actually exist in the project
  const projectTaskTypes = new Set(enquiryTasks.value.map(t => t.type?.toLowerCase()))
  const existingReqs = reqs.filter(r => projectTaskTypes.has(r))
  
  return existingReqs.some(r => !completedTypes.has(r))
}

const isManager = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return ['Super Admin', 'Project Manager', 'Project Officer', 'Client Service', 'HR'].includes(roleName)
  })
})

const isDesigner = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return roleName === 'Designer'
  })
})

const isCostings = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return roleName === 'Costing'
  })
})

const isAccounts = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return roleName === 'Accounts'
  })
})

const isStores = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return roleName === 'Stores'
  })
})

const isProcurement = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return roleName === 'Procurement'
  })
})

const isProduction = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.some((role: string | any) => {
    const roleName = typeof role === 'string' ? role : role.name
    return roleName === 'Production'
  })
})

// Fetch available users for quick assign
const fetchAvailableUsers = async () => {
  try {
    const response = await api.get('/api/users', {
      params: { per_page: 1000, status: 'active' }
    })
    
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
    
    // Update local state or remove if in "My Tasks" view
    const taskIndex = enquiryTasks.value.findIndex(t => t.id === task.id)
    if (taskIndex > -1) {
      if (!showAllTasks.value) {
        // If we are in "My Tasks" view, the task should disappear because it's no longer yours
        enquiryTasks.value.splice(taskIndex, 1)
      } else {
        // Otherwise just update the data (it will show as unassigned)
        enquiryTasks.value[taskIndex] = { ...enquiryTasks.value[taskIndex], ...response.data.data }
      }
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

const prevTask = computed(() => {
  if (!selectedTask.value || filteredTasks.value.length === 0) return null
  const index = filteredTasks.value.findIndex(t => t.id === selectedTask.value!.id)
  if (index > 0) return filteredTasks.value[index - 1]
  return null
})

const nextTask = computed(() => {
  if (!selectedTask.value || filteredTasks.value.length === 0) return null
  const index = filteredTasks.value.findIndex(t => t.id === selectedTask.value!.id)
  if (index !== -1 && index < filteredTasks.value.length - 1) return filteredTasks.value[index + 1]
  return null
})

const handleTaskSwitch = async (taskOrType: EnquiryTask | string) => {
  console.log('[DEBUG] ProjectTasks: handleTaskSwitch triggered with:', taskOrType)
  
  if (typeof taskOrType === 'string') {
    const targetType = taskOrType.toLowerCase().trim()
    console.log('[DEBUG] ProjectTasks: Requested transition to task type:', targetType)

    // 1. Try to find in current filtered tasks first
    let targetTask = enquiryTasks.value.find(t => 
      t.type?.toLowerCase().trim() === targetType || 
      t.type?.toLowerCase().replace('-', '_').trim() === targetType.replace('-', '_')
    )

    if (targetTask) {
      console.log('[DEBUG] ProjectTasks: Found target task in local list:', targetTask.id, targetTask.title)
    }

    // 2. If not found, it might be filtered out (e.g. in "My Tasks" view), so check all tasks in this enquiry
    if (!targetTask) {
      const eId = enquiryId.value || selectedTask.value?.project_enquiry_id || selectedTask.value?.enquiry?.id
      console.log('[DEBUG] ProjectTasks: Task not in filtered list. Attempting lookup for Enquiry ID:', eId)
      
      if (eId) {
        try {
          const response = await api.get(`/api/projects/enquiries/${eId}/tasks`)
          const allTasks = response.data.data || response.data || []
          console.log(`[DEBUG] ProjectTasks: Fetched ${allTasks.length} tasks for enquiry ${eId}`)
          
          targetTask = allTasks.find((t: any) => 
            t.type?.toLowerCase().trim() === targetType || 
            t.type?.toLowerCase().replace('-', '_').trim() === targetType.replace('-', '_')
          )
        } catch (err) {
          console.error('[DEBUG] ProjectTasks: Failed to fetch all tasks for switching:', err)
        }
      } else {
        console.warn('[DEBUG] ProjectTasks: Switch failed - No Enquiry ID available for lookup.')
      }
    }

    if (targetTask) {
      console.log('[DEBUG] ProjectTasks: Final target task resolution:', targetTask.id, targetTask.title)
      openTaskModal(targetTask)
    } else {
      console.error(`[DEBUG] ProjectTasks: Task type "${taskOrType}" not found after exhaustive search.`)
      alert(`The "${taskOrType.replace('_', ' ')}" task could not be found in this project. Please ensure it is part of the project workflow.`)
    }
  } else if (taskOrType) {
    // If it's a full task object
    console.log('[DEBUG] ProjectTasks: Switching directly to task object:', taskOrType.id)
    openTaskModal(taskOrType)
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
   // Server Check (Authoritative & Refresh)
   try {
     const response = await api.get(`/api/tasks/${task.id}`)
     const freshTask = response.data.data
     
     // Update local state with fresh data
     const index = enquiryTasks.value.findIndex(t => t.id === task.id)
     if (index !== -1) {
         enquiryTasks.value[index] = { ...enquiryTasks.value[index], ...freshTask }
     }
 
     // Task is now always open in edit mode (server handles specific permissions if needed)
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
    'pending': 'bg-blue-600',
    'in_progress': 'bg-indigo-600',
    'completed': 'bg-green-500', 
    'cancelled': 'bg-red-700',
    'skipped': 'bg-gray-500',
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
  // Completed, skipped, or cancelled tasks are NEVER overdue
  if (task.status === 'completed' || task.status === 'cancelled' || task.status === 'skipped') return false
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

/**
 * Get assigned user name from all possible sources
 * Handles backward compatibility with different API response formats
 */
const getAssignedUserName = (task: EnquiryTask): string | undefined => {
  // Try assigned_to first (new format)
  if (task.assigned_to?.name) return task.assigned_to.name
  
  // Try assignedUser (alternative format)
  if (task.assignedUser?.name) return task.assignedUser.name
  
  // Try first assigned user from array
  if (task.assigned_users && task.assigned_users.length > 0) {
    return task.assigned_users[0].name
  }
  if (task.assignedUsers && task.assignedUsers.length > 0) {
    return task.assignedUsers[0].name
  }
  
  return undefined
}

const getProjectIdentifier = (task: EnquiryTask): string => {
  if (!task.enquiry) return 'General Task'
  return task.enquiry.job_number || task.enquiry.enquiry_number || 'TBC'
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
    'pending': { dot: 'bg-blue-600' },
    'in_progress': { dot: 'bg-indigo-600' },
    'completed': { dot: 'bg-green-500' },
    'skipped': { dot: 'bg-gray-600' },
    'cancelled': { dot: 'bg-red-600' },
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


const getBackLink = () => {
  if (!enquiryId.value) return { path: '/projects/enquiries' }
  
  // Find current enquiry status to determine tab
  let status = ''
  // Try to find status from the first task's enquiry relation which we populate
  if (enquiryTasks.value.length > 0 && enquiryTasks.value[0].enquiry) {
      status = enquiryTasks.value[0].enquiry.status
  }
  
  // Define project statuses
  const projectStatuses = ['quote_approved', 'planning', 'in_progress', 'completed']
  const tab = projectStatuses.includes(status) ? 'projects' : 'enquiries'
  
  return {
    path: '/projects/enquiries',
    query: {
      tab: tab,
      highlight: enquiryId.value
    }
  }
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
    const enquiry = enquiryTasks.value[0].enquiry
    enquiryTitle.value = enquiry?.title || 'Unknown Enquiry'
    projectIdentifier.value = enquiry?.job_number || enquiry?.enquiry_number || ''
  } else if (enquiryId.value) {
    // If no tasks found but enquiryId exists, try to fetch enquiry details
    // First try to fetch all tasks for this enquiry (without user filter)
    try {
      await fetchAllTasks({
        enquiry_id:enquiryId.value,
        assigned_user_id: undefined // Get all tasks for this enquiry
      })
      if (enquiryTasks.value.length > 0) {
        const enquiry = enquiryTasks.value[0].enquiry
        enquiryTitle.value = enquiry?.title || 'Unknown Enquiry'
        projectIdentifier.value = enquiry?.job_number || enquiry?.enquiry_number || ''
      } else {
        // If still no tasks, try to fetch enquiry directly
        const response = await api.get(`/api/projects/enquiries/${enquiryId.value}`)
        const data = response.data.data
        enquiryTitle.value = data?.title || 'Unknown Enquiry'
        projectIdentifier.value = data?.job_number || data?.enquiry_number || ''
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

