<template>
  <!-- Use TaskDataViewer for readonly/completed tasks -->
  <TaskDataViewer v-if="isReadonly && !isEditMode" :task="task" @edit="isEditMode = true" />

  <!-- Editable Teams Task View -->
  <div v-else class="teams-task bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    
    <!-- Premium Task Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 group/header">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 group-hover/header:scale-110 transition-transform">
            <i class="mdi mdi-account-group text-3xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
              Personnel & Teams
            </h1>
            <div class="flex items-center gap-2">
               <span class="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                 Project Orchestration
               </span>
               <span v-if="task.status === 'completed'" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                 <i class="mdi mdi-check-decagram text-xs"></i> Completed
               </span>
               <span v-if="isReadonly && task.status !== 'completed'" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                 <i class="mdi mdi-lock text-xs"></i> Read Only
               </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="isEditMode"
            @click="isEditMode = false"
            class="h-11 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
          >
            <i class="mdi mdi-close-circle-outline text-lg"></i>
            <span>Exit Edit Mode</span>
          </button>
        </div>
      </div>

      <!-- Project Details Premium Card -->
      <div class="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 group/card">
        <!-- Abstract Glassmorphism decorative elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover/card:bg-purple-500/10 transition-colors"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full -ml-24 -mb-24 blur-3xl group-hover/card:bg-indigo-500/10 transition-colors transition-delay-700"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <i class="mdi mdi-folder-outline text-2xl"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Project Enquiry</p>
                <h2 class="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                  {{ projectInfo.enquiryTitle }}
                  <span class="text-slate-300 dark:text-slate-600 font-medium">/</span>
                  <span class="text-purple-600 dark:text-purple-400">{{ projectInfo.projectId }}</span>
                </h2>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-8 pl-1">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-500">
                  <i class="mdi mdi-account-tie-outline text-xl"></i>
                </div>
                <div>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Name</p>
                   <p class="text-sm font-black text-slate-700 dark:text-slate-200">{{ projectInfo.clientName }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-500">
                  <i class="mdi mdi-map-marker-radius-outline text-xl"></i>
                </div>
                <div>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Venue Location</p>
                   <p class="text-sm font-black text-slate-700 dark:text-slate-200">{{ projectInfo.eventVenue }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Highlight Stats / Date -->
          <div class="flex flex-col justify-between items-end gap-6 min-w-[240px]">
             <div class="text-right">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Project Commencement</p>
                <div class="px-6 py-3 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white font-black text-xl shadow-2xl flex items-center gap-3 ring-4 ring-slate-50 dark:ring-slate-800/50">
                  <i class="mdi mdi-calendar-check text-purple-400"></i>
                  {{ formatDate(projectInfo.setupDate) }}
                </div>
             </div>
             
             <div class="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/50">
               <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500"></span>
               <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Resource Pool Live</span>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rapid Team Assign Interface -->
    <div v-if="canAssignTeams && !isReadonly" class="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 p-8 mb-12 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all group hover:border-purple-500/50">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
           <div class="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
             <i class="mdi mdi-account-plus text-xl"></i>
           </div>
           <div>
             <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Rapid Team Dispatch</h4>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Assign specialized teams to project stages instantly</p>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Specialty Selection -->
          <div class="lg:col-span-4">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Team Specialty*</label>
            <div class="relative">
              <select 
                v-model="newTeamModal.team_type_id"
                class="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all appearance-none"
              >
                <option :value="null">Choose specialty...</option>
                <option v-for="teamType in COMMON_TEAM_TYPES" :key="teamType.id" :value="teamType.team_type_id" class="dark:bg-slate-900 text-slate-900 dark:text-white">
                  {{ teamType.display_name }}
                </option>
              </select>
              <i class="mdi mdi-account-star-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
          </div>

          <!-- Stage Selection -->
          <div class="lg:col-span-4">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Project Stage / Category*</label>
            <div class="flex gap-2">
              <button 
                v-for="cat in TEAM_CATEGORIES" 
                :key="cat.key"
                @click="newTeamModal.category = cat.key"
                type="button"
                class="flex-1 px-2 py-3.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-[0.1em] transition-all flex flex-col items-center justify-center gap-1.5"
                :class="newTeamModal.category === cat.key 
                  ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 hover:border-purple-500 hover:text-purple-500'"
              >
                <i :class="['mdi', cat.icon, 'text-lg']"></i>
                {{ cat.key }}
              </button>
            </div>
          </div>

          <!-- Date Selection -->
          <div class="lg:col-span-2">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Commencement*</label>
            <div class="relative">
              <input 
                v-model="newTeamModal.start_date"
                type="date"
                class="w-full h-14 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-700 dark:text-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500"
              />
            </div>
          </div>

          <!-- Action Button -->
          <div class="lg:col-span-2 flex items-end">
            <button 
              @click="submitAddTeam"
              :disabled="!newTeamModal.category || !newTeamModal.team_type_id"
              class="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <i class="mdi mdi-check-decagram"></i>
              <span>Assign</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Teams List by Category -->
    <div class="space-y-12">
      <div v-for="category in TEAM_CATEGORIES" :key="category.key" class="category-card relative">
        <!-- Category Section Header -->
        <div class="flex items-center justify-between mb-6 px-2">
          <div class="flex items-center gap-4">
             <div :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-900',
                category.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-500/20' :
                category.color === 'amber' ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'
             ]">
                <i :class="['mdi', category.icon, 'text-2xl']"></i>
             </div>
             <div>
                <h4 class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-1">Resource Pool</h4>
                <div class="flex items-center gap-3">
                   <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{{ category.label }}</h3>
                   <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-400 tracking-widest">
                     {{ teamsByCategory[category.key]?.length || 0 }} UNITS
                   </span>
                </div>
             </div>
          </div>
        </div>

        <!-- Team Items Container -->
        <div class="bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800/50 overflow-hidden backdrop-blur-sm">
          <div v-if="teamsByCategory[category.key]?.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800/40">
            <div v-for="team in teamsByCategory[category.key]" :key="team.id" class="p-8 hover:bg-white dark:hover:bg-slate-800/40 transition-all flex flex-col lg:flex-row lg:items-center gap-8 group/team">
              <!-- Team Identity -->
              <div class="w-full lg:w-1/4">
                <div class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-3 mb-2">
                   <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 transition-colors group-hover/team:text-purple-500">
                     <i class="mdi mdi-account-group-outline text-lg"></i>
                   </div>
                   {{ getTeamTypeDisplayName(team) }}
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span :class="getStatusColorClass(team.status)" class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg leading-none shadow-sm">
                    {{ getStatusLabel(team.status) }}
                  </span>
                  <span v-if="team.start_date" class="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-white dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                     <i class="mdi mdi-calendar-blank text-xs opacity-50"></i>
                     {{ formatDate(team.start_date) }}
                  </span>
                </div>
              </div>

              <!-- Assigned Personnel Grid -->
              <div class="flex-1">
                <div class="flex flex-wrap gap-2 mb-6">
                   <div 
                      v-for="member in team.members || []" 
                      :key="member.id"
                      class="inline-flex items-center pl-4 pr-2.5 py-2.5 rounded-xl text-[11px] font-black text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-purple-500/30 group/member"
                   >
                      <i class="mdi mdi-account-circle text-slate-300 mr-2.5 group-hover/member:text-purple-500 transition-colors text-lg"></i>
                      <span class="uppercase tracking-wider">{{ member.member_name }}</span>
                      <button
                         v-if="canManageMembers && !isReadonly"
                         @click="removeMember(team.id, member.id)"
                         class="ml-3 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-800 w-6 h-6 flex items-center justify-center rounded-lg"
                      >
                         <i class="mdi mdi-close text-xs"></i>
                      </button>
                   </div>
                </div>

                <!-- Personnel Addition Input -->
                <div v-if="canManageMembers && !isReadonly" class="flex flex-col sm:flex-row items-stretch gap-4 max-w-2xl group/add">
                   <!-- Registry Selection -->
                   <div class="relative flex-1">
                      <i class="mdi mdi-book-open-variant absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/add:text-purple-500 transition-colors z-10"></i>
                      <select
                         v-model="selectedLabourId[team.id]"
                         class="block w-full h-11 pl-11 pr-4 text-xs font-black bg-white dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-purple-500 rounded-xl focus:ring-0 text-slate-900 dark:text-white appearance-none uppercase tracking-widest transition-all"
                      >
                         <option :value="null">Pick from Registry...</option>
                         <option v-for="labour in labours" :key="labour.id" :value="labour.id">
                           {{ labour.full_name }} ({{ labour.specialization }})
                         </option>
                      </select>
                      <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                   </div>

                   <div class="flex items-center gap-2">
                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">OR</span>
                     
                     <div class="relative flex-1 min-w-[200px]">
                        <i class="mdi mdi-account-plus-outline absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/add:text-purple-500 transition-colors"></i>
                        <input
                           v-model="newMemberInputs[team.id]"
                           type="text"
                           placeholder="Manual Entry..."
                           class="block w-full h-11 pl-11 pr-4 text-xs font-black bg-white dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-purple-500 rounded-xl focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all uppercase tracking-widest"
                           @keydown.enter="addMemberToTeam(team.id)"
                        />
                     </div>
                   </div>

                   <button
                      @click="addMemberToTeam(team.id)"
                      :disabled="!selectedLabourId[team.id] && !newMemberInputs[team.id]?.trim()"
                      class="px-6 h-11 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl active:scale-95 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-30"
                   >
                      <i class="mdi mdi-plus-circle text-lg mr-2"></i>
                      Assign
                   </button>
                </div>
              </div>

              <!-- Item Actions -->
              <div class="lg:w-16 flex justify-end">
                 <button
                    v-if="canDeleteTeams && !isReadonly"
                    @click="deleteTeam(team.id)"
                    class="text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all w-12 h-12 flex items-center justify-center rounded-2xl"
                    title="Remove Team"
                 >
                    <i class="mdi mdi-trash-can-outline text-2xl"></i>
                 </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="py-20 flex flex-col items-center justify-center text-center">
             <div class="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800/30 flex items-center justify-center text-slate-200 dark:text-slate-700 mb-6 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rotate-3">
                <i :class="['mdi', category.icon, 'text-5xl']"></i>
             </div>
             <h5 class="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-4">Unit Assignment Pending</h5>
             <span v-if="!canAssignTeams || isReadonly" class="text-xs text-slate-400 font-bold italic tracking-wider">No personnel mapped yet</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Action Bar -->
    <div class="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div class="flex flex-wrap items-center gap-4">
        <button
          v-if="task.status !== 'skipped' && task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="showSkipModal = true"
          class="h-12 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="mdi mdi-skip-next-circle-outline text-lg"></i>
          Skip Project Task
        </button>

        <button
          v-if="['skipped', 'completed'].includes(task.status)"
          @click="$emit('update-status', 'pending')"
          class="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="mdi mdi-refresh text-lg"></i>
          {{ task.status === 'skipped' ? 'Reactivate Task' : 'Reopen Resources' }}
        </button>

        <button
          v-if="task.status !== 'completed' && task.status !== 'cancelled' && !isReadonly"
          @click="$emit('update-status', 'completed')"
          class="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center gap-3"
        >
          <i class="mdi mdi-check-decagram text-lg"></i>
          <span>Finalize Assignment</span>
        </button>

        <div v-if="task.status === 'completed'" class="flex items-center gap-3 px-5 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
          <i class="mdi mdi-check-circle text-emerald-500 text-xl"></i>
          <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Workflow synchronized</span>
        </div>
      </div>
    </div>

    <!-- Skip Task Modal -->
    <Teleport to="body">
      <div v-if="showSkipModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showSkipModal = false"></div>
        <div class="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Omit Phase</h3>
          <p class="text-xs font-bold text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest">Provide justification for bypassing this task</p>
          
          <div class="relative mb-8">
            <textarea
                v-model="skipReason"
                rows="4"
                class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 dark:text-white transition-all resize-none placeholder:text-slate-400 text-sm font-medium"
                placeholder="Reasoning for deviation..."
            ></textarea>
          </div>
          
          <div class="flex gap-4">
              <button @click="showSkipModal = false" class="flex-1 h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Abort</button>
              <button @click="handleSkipTask" :disabled="!skipReason.trim() || isSkipping" class="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all disabled:opacity-30">
                {{ isSkipping ? 'Processing...' : 'Confirm Omission' }}
              </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Feedback Toasts -->
    <div class="fixed bottom-8 right-8 z-[110] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div 
          v-for="msg in feedbackMessages" 
          :key="msg.id"
          class="pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/20"
          :class="[
            msg.type === 'success' ? 'bg-emerald-500 text-white' : 
            msg.type === 'error' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-white'
          ]"
        >
          <i :class="['mdi', msg.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle', 'text-xl']"></i>
          <span class="text-xs font-black uppercase tracking-wider">{{ msg.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { EnquiryTask } from '../../types'
import { useTeams } from '../../composables/useTeams'
import { useTechnicalLabour } from '@/modules/hr/composables/useTechnicalLabour'
import TaskDataViewer from './TaskDataViewer.vue'
import api from '@/plugins/axios'

/**
 * Props & Emits
 */
interface Props {
  task: EnquiryTask
  readonly?: boolean
  initialEditMode?: boolean
}

interface Emits {
  'update-status': [status: EnquiryTask['status']]
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  initialEditMode: false
})
const emit = defineEmits<Emits>()

/**
 * Types
 */
interface ProjectInfo {
  projectId: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate: string
}

interface NewTeamForm {
  category: string
  team_type_id: number | null
  start_date: string
}

interface FeedbackMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

/**
 * Composables & State
 */
const {
  teamsTasks,
  teamsByCategory,
  fetchTeamsForTask,
  fetchTeamCategories,
  createTeamTask,
  addTeamMember,
  removeTeamMember,
  deleteTeamTask
} = useTeams()

const { labours, fetchLabours } = useTechnicalLabour()

const TEAM_CATEGORIES = [
  { id: 1, key: 'workshop', label: 'Workshop Fabrication', icon: 'mdi-hammer-wrench', color: 'blue' },
  { id: 2, key: 'setup', label: 'On-Site Installation', icon: 'mdi-truck-delivery-outline', color: 'amber' },
  { id: 3, key: 'setdown', label: 'Dismantling & Recovery', icon: 'mdi-archive-arrow-down-outline', color: 'rose' }
]

const COMMON_TEAM_TYPES = [
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

const isEditMode = ref(props.initialEditMode)
const showSkipModal = ref(false)
const skipReason = ref('')
const isSkipping = ref(false)
const feedbackMessages = ref<FeedbackMessage[]>([])
const newMemberInputs = reactive<Record<number, string>>({})
const selectedLabourId = reactive<Record<number, number | null>>({})

/**
 * Computed Properties
 */
const projectInfo = computed((): ProjectInfo => {
  const enquiry = props.task?.enquiry
  return {
    projectId: enquiry?.job_number || enquiry?.enquiry_number || 'N/A',
    enquiryTitle: enquiry?.title || 'Untitled Project',
    clientName: enquiry?.client?.full_name || enquiry?.contact_person || 'N/A',
    eventVenue: enquiry?.venue || 'TBC',
    setupDate: enquiry?.expected_delivery_date || 'TBC',
    setDownDate: 'TBC'
  }
})

const isReadonly = computed(() => {
  if (props.readonly === true) return true
  return props.task.status === 'completed' && !isEditMode.value
})

const newTeamModal = reactive<NewTeamForm>({
  category: 'workshop',
  team_type_id: null,
  start_date: projectInfo.value.setupDate !== 'TBC' ? projectInfo.value.setupDate : ''
})

const canAssignTeams = computed(() => true)
const canManageMembers = computed(() => true)
const canDeleteTeams = computed(() => true)

/**
 * Lifecycle
 */
onMounted(async () => {
  try {
    await fetchTeamCategories()
    await fetchLabours()
    if (props.task?.id) {
        await fetchTeamsForTask(props.task.id)
    }
  } catch (error) {
    console.error('Resource loading failure:', error)
  }
})

/**
 * Methods
 */
const submitAddTeam = async () => {
  if (!newTeamModal.category || !newTeamModal.team_type_id) {
    addFeedbackMessage('error', 'Select both category and specialty')
    return
  }

  try {
    const categoryMap: Record<string, number> = { workshop: 1, setup: 2, setdown: 3 }
    await createTeamTask(props.task.id, {
      category_id: categoryMap[newTeamModal.category],
      team_type_id: newTeamModal.team_type_id,
      required_members: 1,
      start_date: newTeamModal.start_date || undefined,
      priority: 'medium'
    })
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Resource unit assigned')
  } catch (error) {
    addFeedbackMessage('error', 'Failed to dispatch team')
  }
}

const addMemberToTeam = async (teamTaskId: number) => {
  const labourId = selectedLabourId[teamTaskId]
  const manualName = newMemberInputs[teamTaskId]?.trim()
  
  if (!labourId && !manualName) return

  try {
    let payload: any = {}
    
    if (labourId) {
      const labour = labours.value.find(l => l.id === labourId)
      if (labour) {
        payload = {
          technical_labour_id: labour.id,
          member_name: labour.full_name,
          member_email: labour.email,
          member_phone: labour.phone,
          member_role: labour.specialization,
          hourly_rate: Number(labour.day_rate) / 8 // Assuming 8hr day
        }
      }
    } else {
      payload = { member_name: manualName }
    }

    await addTeamMember(props.task.id, teamTaskId, payload)
    
    newMemberInputs[teamTaskId] = ''
    selectedLabourId[teamTaskId] = null
    
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Personnel added')
  } catch (error) {
    addFeedbackMessage('error', 'Failed to add personnel')
  }
}

const removeMember = async (teamTaskId: number, memberId: number) => {
  try {
    await removeTeamMember(props.task.id, teamTaskId, memberId)
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Personnel removed')
  } catch (error) {
    addFeedbackMessage('error', 'Removal failed')
  }
}

const deleteTeam = async (teamTaskId: number) => {
  if (!confirm('Permanently remove this team unit?')) return
  try {
    await deleteTeamTask(props.task.id, teamTaskId)
    await fetchTeamsForTask(props.task.id)
    addFeedbackMessage('success', 'Team unit decommissioned')
  } catch (error) {
    addFeedbackMessage('error', 'Decommissioning failed')
  }
}

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
        addFeedbackMessage('success', 'Task phase omitted')
    } catch (err: any) {
        addFeedbackMessage('error', 'Omission failed')
    } finally {
        isSkipping.value = false
    }
}

const addFeedbackMessage = (type: FeedbackMessage['type'], message: string) => {
  const id = Math.random().toString(36).substr(2, 9)
  feedbackMessages.value.push({ id, type, message })
  setTimeout(() => {
    feedbackMessages.value = feedbackMessages.value.filter(m => m.id !== id)
  }, 3000)
}

const formatDate = (dateString: string): string => {
  if (!dateString || dateString === 'TBC') return 'TBC'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? 'TBC' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400'
    case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
    case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400'
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
  }
}

const getStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

const getTeamTypeDisplayName = (team: any): string => {
  if (team.team_type?.display_name) return team.team_type.display_name
  const type = COMMON_TEAM_TYPES.find(t => t.team_type_id === team.team_type_id)
  return type?.display_name || 'Specialized Unit'
}

/**
 * Watchers
 */
watch(() => props.task, async (newTask, oldTask) => {
  if (newTask && (!oldTask || newTask.id !== oldTask.id)) {
    await fetchTeamsForTask(newTask.id)
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

/* Animation for the blue pulse */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.2); }
  50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
}
.shadow-glow { animation: glow 2s infinite; }
</style>