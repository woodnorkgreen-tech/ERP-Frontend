<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
      <router-link to="/production/work-orders" class="hover:text-slate-600 dark:hover:text-slate-200">
        Work Orders
      </router-link>
      <span class="text-slate-300">/</span>
      <span class="text-slate-600 dark:text-slate-200">
        {{ selectedWorkOrder?.work_order_number || 'Details' }}
      </span>
    </nav>

    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Work Order
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Production workflow overview and execution
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="selectedWorkOrder?.status_category" :class="getStatusClass(selectedWorkOrder?.status_category)">
          {{ formatStatusCategory(selectedWorkOrder?.status_category) }}
        </span>
        <span v-if="selectedWorkOrder?.priority" :class="getPriorityClass(selectedWorkOrder?.priority)">
          {{ formatPriority(selectedWorkOrder?.priority) }}
        </span>
      </div>
    </div>

    <!-- Compact Summary -->
    <div class="flex flex-wrap gap-2 items-center">
      <div class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Project</span>
        <span class="ml-2 text-sm font-semibold text-slate-900 dark:text-white">
          {{ selectedWorkOrder?.projectEnquiry?.title || '-' }}
        </span>
      </div>
      <div class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Client</span>
        <span class="ml-2 text-sm font-semibold text-slate-900 dark:text-white">
          {{ selectedWorkOrder?.projectEnquiry?.client?.company_name || selectedWorkOrder?.projectEnquiry?.client?.full_name || '-' }}
        </span>
      </div>
      <div class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Job</span>
        <span class="ml-2 text-sm font-semibold text-slate-900 dark:text-white">
          {{ selectedWorkOrder?.projectEnquiry?.job_number || '-' }}
        </span>
      </div>
      <div class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Officer</span>
        <span class="ml-2 text-sm font-semibold text-slate-900 dark:text-white">
          {{ selectedWorkOrder?.project_officer_name || '-' }}
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-10 text-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <p class="mt-4 text-slate-500 dark:text-slate-400">Loading work order...</p>
    </div>

    <!-- Feedback Banner -->
    <div v-if="uiMessage" class="rounded-2xl border px-4 py-3 text-sm font-bold tracking-wide uppercase"
         :class="uiMessage.type === 'success'
           ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
           : uiMessage.type === 'error'
             ? 'bg-red-50 border-red-200 text-red-700'
             : 'bg-slate-50 border-slate-200 text-slate-700'">
      {{ uiMessage.text }}
    </div>

    <!-- Feedback Banner -->
    <div v-if="uiMessage" class="rounded-2xl border px-4 py-3 text-sm font-black tracking-widest uppercase"
         :class="uiMessage.type === 'success'
           ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
           : uiMessage.type === 'error'
             ? 'bg-red-50 border-red-200 text-red-700'
             : 'bg-slate-50 border-slate-200 text-slate-700'">
      {{ uiMessage.text }}
    </div>

    <!-- Workflow Progress -->
    <div v-if="!loading" class="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200/60 dark:border-slate-700/60 p-5 sm:p-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i class="mdi mdi-ray-start-arrow text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Production Workflow</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Track progress and move through each stage</p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <template v-for="(step, index) in workflowSteps" :key="step.key">
              <div class="flex items-center gap-2">
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm transition-all"
                  :class="[
                    completedStepsSet.has(step.key) ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                    step.key === activeStep ? 'bg-blue-600 text-white shadow-blue-600/20' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  ]"
                >
                  <i v-if="completedStepsSet.has(step.key)" class="mdi mdi-check"></i>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-xs font-bold" :class="completedStepsSet.has(step.key) || step.key === activeStep ? 'text-slate-900 dark:text-white' : 'text-slate-400'">
                  {{ step.label }}
                </span>
              </div>
              <div v-if="index < workflowSteps.length - 1" class="w-10 h-0.5 rounded-full"
                   :class="index <= lastCompletedIndex ? 'bg-emerald-300 dark:bg-emerald-800' : 'bg-slate-200 dark:bg-slate-800'">
              </div>
            </template>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="proceedToNextStep"
            :disabled="activeStepIndex >= workflowSteps.length - 1 || !canAccessStep(workflowSteps[activeStepIndex + 1]?.key)"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>Proceed to Next Step</span>
            <i class="mdi mdi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div v-if="!loading" class="flex flex-col xl:flex-row gap-6 min-h-[70vh]">
      <!-- Left: Workflow Steps -->
      <div class="w-full xl:w-[250px] shrink-0 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div class="p-5 border-b border-slate-100 dark:border-slate-700/60">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Workflow</p>
        </div>
        <div class="p-3 space-y-2">
          <button
            v-for="step in workflowSteps"
            :key="step.key"
            @click="handleStepSelect(step.key)"
            :disabled="!canAccessStep(step.key)"
            :title="getStepLockReason(step.key)"
            :class="[
              'w-full text-left p-4 rounded-2xl border transition-all group relative',
              activeStep === step.key
                ? 'bg-blue-50/70 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30 ring-1 ring-blue-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              !canAccessStep(step.key) ? 'opacity-60 cursor-not-allowed hover:bg-white dark:hover:bg-slate-800' : ''
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500">
                  <i :class="['mdi text-lg', step.icon]"></i>
                </div>
                <div>
                  <p class="text-xs font-black uppercase tracking-widest text-slate-400">{{ step.label }}</p>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">{{ step.subtitle }}</p>
                  <p v-if="completedStepsSet.has(step.key)" class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">Completed</p>
                  <p v-else-if="getStepLockReason(step.key)" class="text-[10px] font-black uppercase tracking-widest text-amber-600 mt-1">
                    {{ getStepLockReason(step.key) }}
                  </p>
                </div>
              </div>
              <span v-if="step.count !== undefined" class="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {{ step.count }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Right: Step Details -->
      <div class="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 overflow-hidden">
        <!-- Intake -->
        <div v-if="activeStep === 'intake'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <i class="mdi mdi-clipboard-text-outline text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Job Intake & Briefing</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Pulled from project enquiry details</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('intake')"
                :disabled="completedStepsSet.has('intake')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('intake') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('intake') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <!-- Compact KPIs -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Progress</div>
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-2 bg-blue-600" :style="{ width: `${projectProgress}%` }"></div>
                </div>
                <span class="text-lg font-black text-slate-900 dark:text-white">{{ projectProgress }}%</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Budget Estimate</div>
              <div class="text-lg font-black text-slate-900 dark:text-white">
                <span class="text-[10px] font-bold text-slate-400 mr-1">KES</span>{{ selectedWorkOrder?.projectEnquiry?.estimated_budget?.toLocaleString?.() || '0' }}
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Delivery Deadline</div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ formatDate(selectedWorkOrder?.projectEnquiry?.expected_delivery_date ?? null) }}
                </span>
                <span class="text-[10px] font-bold uppercase"
                  :class="calculateDaysRemaining(selectedWorkOrder?.projectEnquiry?.expected_delivery_date ?? null).includes('overdue') ? 'text-red-500' : 'text-emerald-600'">
                  {{ calculateDaysRemaining(selectedWorkOrder?.projectEnquiry?.expected_delivery_date ?? null) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Core Info Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div class="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stakeholder</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Client</span>
                  <span class="text-sm font-semibold text-slate-900 dark:text-white text-right">
                    {{ selectedWorkOrder?.projectEnquiry?.client?.company_name || selectedWorkOrder?.projectEnquiry?.client?.full_name || 'N/A' }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Contact</span>
                  <span class="text-sm text-slate-700 dark:text-slate-300 text-right">
                    {{ selectedWorkOrder?.projectEnquiry?.contact_person || 'N/A' }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Phone</span>
                  <span class="text-sm text-slate-700 dark:text-slate-300 text-right">
                    {{ (selectedWorkOrder?.projectEnquiry?.client as any)?.phone || (selectedWorkOrder?.projectEnquiry?.client as any)?.PhoneNo || 'N/A' }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Email</span>
                  <span class="text-sm text-blue-600 dark:text-blue-400 text-right">
                    {{ (selectedWorkOrder?.projectEnquiry?.client as any)?.email || (selectedWorkOrder?.projectEnquiry?.client as any)?.Email || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div class="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Venue</span>
                  <span class="text-sm font-semibold text-slate-900 dark:text-white text-right">
                    {{ selectedWorkOrder?.projectEnquiry?.venue || 'N/A' }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Project Lead</span>
                  <span class="text-sm font-semibold text-slate-900 dark:text-white text-right">
                    {{ selectedWorkOrder?.projectEnquiry?.project_officer?.name || 'Unassigned' }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Created</span>
                  <span class="text-sm text-slate-700 dark:text-slate-300 text-right">
                    {{ formatDate(selectedWorkOrder?.projectEnquiry?.created_at ?? null) }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-[10px] text-slate-400 font-bold uppercase">Expected Delivery</span>
                  <span class="text-sm font-semibold text-slate-900 dark:text-white text-right">
                    {{ formatDate(selectedWorkOrder?.projectEnquiry?.expected_delivery_date ?? null) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div class="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40">
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Scope</h3>
              </div>
              <div class="p-4">
                <ul class="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                  <li v-for="(item, i) in projectDeliverables" :key="i" class="text-sm flex items-start">
                    <span class="text-blue-500 font-bold mr-2">•</span>
                    <span class="text-slate-700 dark:text-slate-300">{{ item }}</span>
                  </li>
                  <li v-if="projectDeliverables.length === 0" class="text-xs text-slate-400 italic">
                    No individual deliverables specified in the project scope.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div class="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Project Objectives & Description</h3>
            </div>
            <div class="p-4">
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {{ selectedWorkOrder?.projectEnquiry?.description || 'No detailed description provided for this project.' }}
              </p>
            </div>
          </div>

          <!-- Workstation Task Plan -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Workstation Task Plan</h3>
                <p class="text-xs text-slate-500">Structured tasks feeding Fabrication execution.</p>
              </div>
              <button @click="openCreateTask" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold">Add Task</button>
            </div>

            <div v-if="intakeTasks.length > 0" class="space-y-2">
              <button
                v-for="task in intakeTasks"
                :key="task.id"
                @click="openEditTask(task)"
                class="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-slate-800"
              >
                <div class="flex-1">
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {{ workstations.find(w => w.key === task.workstation)?.label || task.workstation }}
                  </p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ task.title }}</p>
                  <p class="text-xs text-slate-500">
                    Qty: {{ task.quantity }} · Priority: {{ task.priority }} · Due: {{ task.dueDate || 'n/a' }}
                  </p>
                  <p class="text-xs text-slate-500">
                    Assigned:
                    <span v-if="task.assignedTo.length > 0">{{ task.assignedTo.map(person => person.name).join(', ') }}</span>
                    <span v-else>Unassigned</span>
                  </p>
                </div>
                <div class="min-w-[220px] text-right">
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Specs</p>
                  <p class="text-xs text-slate-500">
                    {{ task.notes || '—' }}
                  </p>
                </div>
              </button>
            </div>
            <div v-else class="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center space-y-3">
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">No tasks defined yet</p>
              <p class="text-xs text-slate-500">Create the first workstation task to populate fabrication.</p>
              <button @click="openCreateTask" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold">Create Task</button>
            </div>
        </div>

        <!-- Edit Task Slide Over -->
        <div v-if="editingTask" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-slate-900/40" @click="closeEditTask"></div>
          <div class="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/60 dark:border-slate-700/60">
            <div class="p-5 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-slate-400">Edit Task</p>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ editingTask.title }}</h3>
              </div>
              <button class="text-slate-400 hover:text-slate-600" @click="closeEditTask">✕</button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Workstation</label>
                  <select v-model="editTaskForm.workstation" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <option value="" disabled>Select workstation</option>
                    <option v-for="station in workstations" :key="station.key" :value="station.key">
                      {{ station.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</label>
                  <select v-model="editTaskForm.priority" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Task</label>
                  <input v-model="editTaskForm.title" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" />
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</label>
                  <input v-model.number="editTaskForm.quantity" type="number" min="0" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" />
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</label>
                  <input v-model="editTaskForm.dueDate" type="date" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" />
                </div>
                <div class="md:col-span-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Specs</label>
                  <input v-model="editTaskForm.notes" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</label>
                <input
                  v-model="editAssigneeSearch"
                  class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
                  placeholder="Search employees or technicians"
                />
                <div v-if="editAssigneeSearchOpen && editAssigneeResults.length > 0" class="max-h-40 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                  <button
                    v-for="person in editAssigneeResults"
                    :key="`${person.type}-${person.id}`"
                    @click="addEditAssignee(person)"
                    class="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {{ person.label }}
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="person in editTaskForm.assignedTo"
                    :key="`${person.type}-${person.id}`"
                    class="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500"
                  >
                    {{ person.name }}
                    <button class="ml-1 text-slate-400" @click="removeEditAssignee(person)">x</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <button class="px-3 py-2 rounded-lg text-xs font-bold text-red-600 border border-red-200" @click="deleteTask">
                Delete Task
              </button>
              <div class="flex items-center gap-2">
                <button class="px-3 py-2 rounded-lg text-xs font-bold border border-slate-200" @click="closeEditTask">Cancel</button>
                <button class="px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white" @click="saveEditTask">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Task Slide Over -->
        <div v-if="createTaskOpen" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-slate-900/40" @click="closeCreateTask"></div>
          <div class="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/60 dark:border-slate-700/60">
            <div class="p-5 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-slate-400">New Task</p>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Add to Task Plan</h3>
              </div>
              <button class="text-slate-400 hover:text-slate-600" @click="closeCreateTask">✕</button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Workstation</label>
                  <select v-model="intakeTaskForm.workstation" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <option value="" disabled>Select workstation</option>
                    <option v-for="station in workstations" :key="station.key" :value="station.key">
                      {{ station.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</label>
                  <select v-model="intakeTaskForm.priority" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Task</label>
                  <input v-model="intakeTaskForm.title" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Describe the task" />
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</label>
                  <input v-model.number="intakeTaskForm.quantity" type="number" min="0" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="0" />
                </div>
                <div>
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</label>
                  <input v-model="intakeTaskForm.dueDate" type="date" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" />
                </div>
                <div class="md:col-span-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Specs</label>
                  <input v-model="intakeTaskForm.notes" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Specs, tolerances, references" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</label>
                <input
                  v-model="assigneeSearch"
                  class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
                  placeholder="Search employees or technicians"
                />
                <div v-if="assigneeSearchOpen && assigneeResults.length > 0" class="max-h-40 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                  <button
                    v-for="person in assigneeResults"
                    :key="`${person.type}-${person.id}`"
                    @click="addAssignee(person)"
                    class="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {{ person.label }}
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="person in intakeTaskForm.assignedTo"
                    :key="`${person.type}-${person.id}`"
                    class="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500"
                  >
                    {{ person.name }}
                    <button class="ml-1 text-slate-400" @click="removeAssignee(person)">x</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="p-5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end gap-2">
              <button class="px-3 py-2 rounded-lg text-xs font-bold border border-slate-200" @click="closeCreateTask">Cancel</button>
              <button class="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white" @click="addIntakeTask">
                Add Task
              </button>
            </div>
          </div>
        </div>

        </div>

        <!-- Design Assets -->
        <div v-else-if="activeStep === 'design_assets'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-purple-100 dark:bg-purple-900 rounded-xl">
              <i class="mdi mdi-image-multiple-outline text-purple-600 dark:text-purple-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Design Assets</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Approved files for shop floor execution</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('design_assets')"
                :disabled="completedStepsSet.has('design_assets')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('design_assets') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('design_assets') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <div v-if="designAssets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="asset in designAssets" 
              :key="asset.id"
              class="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer"
            >
              <div class="aspect-video bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden" @click="previewAsset(asset)">
                <img 
                  v-if="asset.isImage" 
                  :src="asset.file_url" 
                  :alt="asset.name" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div v-else class="text-center">
                  <i class="mdi mdi-file-outline text-4xl text-slate-400"></i>
                  <p class="text-xs text-slate-500 mt-1">{{ getFileExtension(asset.original_name) }}</p>
                </div>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      @click.stop="previewAsset(asset)"
                      class="p-2 bg-white/90 rounded-lg text-slate-700 hover:bg-white transition-colors"
                      title="Preview"
                    >
                      <i class="mdi mdi-eye-outline text-lg"></i>
                    </button>
                    <button 
                      @click.stop="downloadAsset(asset)"
                      class="p-2 bg-white/90 rounded-lg text-slate-700 hover:bg-white transition-colors"
                      title="Download"
                    >
                      <i class="mdi mdi-download text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between">
                  <h4 class="font-semibold text-slate-900 dark:text-white truncate">{{ asset.name }}</h4>
                  <button 
                    @click="downloadAsset(asset)"
                    class="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Download"
                  >
                    <i class="mdi mdi-download text-sm"></i>
                  </button>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{{ asset.formattedSize }}</span>
                  <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">{{ getFileExtension(asset.original_name) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full mb-4">
              <i class="mdi mdi-image-off-outline text-3xl text-slate-400"></i>
            </div>
            <h4 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No Design Assets</h4>
            <p class="text-slate-500 dark:text-slate-400">Assets will appear here once uploaded in Projects.</p>
          </div>
        </div>

        <!-- Materials -->
        <div v-else-if="activeStep === 'materials'" class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
              <i class="mdi mdi-package-variant-closed text-emerald-600 dark:text-emerald-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Materials</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Pulled from Projects materials list</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('materials')"
                :disabled="completedStepsSet.has('materials')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('materials') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('materials') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>
          <div v-if="materialsData.projectElements.length > 0" class="bg-white dark:bg-slate-950 rounded-xl border-2 border-slate-300 dark:border-slate-600 overflow-hidden shadow-lg">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-slate-100 dark:bg-slate-700 border-b-2 border-slate-400 dark:border-slate-500">
                    <th class="border-r border-slate-300 dark:border-slate-600 px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-10">#</th>
                    <th class="border-r border-slate-300 dark:border-slate-600 px-3 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-16">Include</th>
                    <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider min-w-[250px]">Element / Material</th>
                    <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-32">Category</th>
                    <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-28">Unit</th>
                    <th class="border-r border-slate-300 dark:border-slate-600 px-4 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-24">Quantity</th>
                    <th class="px-3 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-950">
                  <template v-for="(element, elementIndex) in materialsData.projectElements" :key="element.id">
                    <tr class="border-b border-slate-200 dark:border-slate-700">
                      <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {{ elementIndex + 1 }}
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-center">
                        <input type="checkbox" :checked="element.isIncluded" disabled class="h-4 w-4" />
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2">
                        <div class="font-bold text-slate-900 dark:text-white">{{ element.name }}</div>
                        <div class="text-[10px] text-slate-500">{{ element.notes || '' }}</div>
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {{ element.category || 'production' }}
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-500"></td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-xs text-slate-500"></td>
                      <td class="px-3 py-2 text-center text-xs text-slate-400">--</td>
                    </tr>

                    <tr v-for="(material, materialIndex) in element.materials" :key="material.id || materialIndex" class="border-b border-slate-100 dark:border-slate-800">
                      <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-[11px] text-slate-400">
                        {{ elementIndex + 1 }}.{{ materialIndex + 1 }}
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-3 py-2 text-center">
                        <input type="checkbox" :checked="material.isIncluded" disabled class="h-4 w-4" />
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-700 dark:text-slate-200">
                        {{ material.description }}
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-500">
                        {{ element.category || 'production' }}
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-500">
                        {{ material.unitOfMeasurement || '-' }}
                      </td>
                      <td class="border-r border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-xs text-slate-700 dark:text-slate-200">
                        {{ material.quantity }}
                      </td>
                      <td class="px-3 py-2 text-center text-xs text-slate-400">--</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-12 text-slate-500">No materials found.</div>

          <!-- Scrap Sheet / Waste Log -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Scrap Sheet / Waste Log</h3>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {{ scrapLogs.length }} entries
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 text-xs">
              <div class="xl:col-span-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Material</label>
                <select v-model.number="scrapForm.materialId" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <option :value="0" disabled>Select material from project list</option>
                  <option v-for="material in materialOptions" :key="material.id" :value="material.id">
                    {{ material.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</label>
                <input v-model.number="scrapForm.quantity" type="number" min="0" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="0" />
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit</label>
                <input v-model="scrapForm.unit" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="pcs, m, kg" />
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</label>
                <input v-model="scrapForm.reason" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Damage, misprint..." />
              </div>
              <div>
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Stage</label>
                <select v-model="scrapForm.stage" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <option value="" disabled>Select stage</option>
                  <option v-for="stage in scrapStages" :key="stage" :value="stage">{{ stage }}</option>
                </select>
              </div>
              <div class="md:col-span-2 xl:col-span-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes</label>
                <input v-model="scrapForm.notes" class="mt-1 w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Extra details..." />
              </div>
              <div class="md:col-span-2 xl:col-span-3 flex items-end">
                <button
                  @click="addScrapLog"
                  class="w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  Add Scrap Entry
                </button>
              </div>
            </div>

            <div v-if="scrapLogs.length > 0" class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th class="text-left py-2">Material</th>
                    <th class="text-left py-2">Reason</th>
                    <th class="text-left py-2">Stage</th>
                    <th class="text-left py-2">Qty</th>
                    <th class="text-left py-2">Unit</th>
                    <th class="text-left py-2">Notes</th>
                  </tr>
                </thead>
                <tbody class="text-slate-600 dark:text-slate-300">
                  <tr v-for="entry in scrapLogs" :key="entry.id" class="border-t border-slate-100 dark:border-slate-800">
                    <td class="py-2">{{ entry.material }}</td>
                    <td class="py-2">{{ entry.reason }}</td>
                    <td class="py-2">{{ entry.stage }}</td>
                    <td class="py-2">{{ entry.quantity }}</td>
                    <td class="py-2">{{ entry.unit }}</td>
                    <td class="py-2">{{ entry.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-xs text-slate-500">No scrap or waste logged yet.</div>
          </div>
        </div>

        <!-- Fabrication -->
        <div v-else-if="activeStep === 'fabrication'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-amber-100 dark:bg-amber-900 rounded-xl">
              <i class="mdi mdi-hammer-wrench text-amber-600 dark:text-amber-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fabrication & Assembly</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Workstation tasks, safety checks, and execution tracking</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('fabrication')"
                :disabled="completedStepsSet.has('fabrication')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('fabrication') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('fabrication') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <!-- Workstation Tabs -->
          <div class="border-b border-slate-200/60 dark:border-slate-700/60">
            <ul v-if="visibleWorkstations.length > 0" class="flex items-center gap-5 overflow-x-auto no-scrollbar pb-2">
              <li v-for="station in visibleWorkstations" :key="station.key" class="shrink-0">
                <button
                  @click="activeWorkstation = station.key"
                  :class="[
                    'flex items-center gap-2 text-xs font-black uppercase tracking-widest pb-2 transition-all',
                    activeWorkstation === station.key
                      ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-b-2 border-transparent'
                  ]"
                >
                  <span>{{ station.label }}</span>
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {{ getWorkstationCount(station.key) }}
                  </span>
                </button>
              </li>
            </ul>
            <div v-else class="py-4 text-xs text-slate-500">
              No fabrication workstations included for this job. Add tasks in Intake to populate.
            </div>
          </div>

          <!-- Workstation Task Queue + Execution Panel -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <!-- Task Queue -->
            <div class="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Task Queue</h3>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {{ visibleWorkstations.find(w => w.key === activeWorkstation)?.label || 'Workstation' }}
                </span>
                <span class="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {{ filteredFabricationTasks.length }} tasks
                </span>
              </div>

              <div class="space-y-2">
                <button
                  v-for="task in filteredFabricationTasks"
                  :key="task.id"
                  @click="selectFabricationTask(task)"
                  :class="[
                    'w-full text-left p-3 rounded-xl border transition-all',
                    selectedFabricationTask?.id === task.id
                      ? 'bg-blue-50/80 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  ]"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <p class="text-xs font-black uppercase tracking-widest text-slate-400">
                        {{ workstations.find(w => w.key === task.workstation)?.label || task.workstation }}
                      </p>
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ task.title }}</p>
                      <div class="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span>Qty: {{ task.quantity }}</span>
                        <span>Priority: {{ task.priority || 'medium' }}</span>
                        <span>Due: {{ task.eta }}</span>
                      </div>
                      <div class="mt-2 text-xs text-slate-500">
                        Assigned:
                        <span v-if="task.assignees?.length">{{ task.assignees.map(person => person.name).join(', ') }}</span>
                        <span v-else>Unassigned</span>
                      </div>
                      <div v-if="task.status === 'paused' && task.statusReason" class="mt-2 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 inline-block">
                        Pause Reason: {{ task.statusReason }}
                      </div>
                    </div>
                    <div class="min-w-[200px] text-right">
                      <span
                        class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block"
                        :class="{
                          'bg-blue-100 text-blue-700': task.status === 'in_progress',
                          'bg-amber-100 text-amber-700': task.status === 'paused',
                          'bg-emerald-100 text-emerald-700': task.status === 'completed',
                          'bg-red-100 text-red-600': task.status === 'blocked',
                          'bg-slate-100 text-slate-500': task.status === 'pending'
                        }"
                      >
                        {{ task.status.replace('_', ' ') }}
                      </span>
                      <div class="mt-2">
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Specs</p>
                        <p class="text-xs text-slate-500">
                          {{ task.notes || '—' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
                <div v-if="filteredFabricationTasks.length === 0" class="text-xs text-slate-500">
                  No tasks for this workstation yet. Add them in the Intake step.
                </div>
              </div>
            </div>

            <!-- Execution Panel -->
            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Execution</h3>
              <div v-if="selectedFabricationTask" class="space-y-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-widest text-slate-400">Task</p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ selectedFabricationTask.title }}</p>
                  <p class="text-xs text-slate-500">
                    {{ workstations.find(w => w.key === selectedFabricationTask.workstation)?.label || selectedFabricationTask.workstation }}
                  </p>
                  <p v-if="selectedFabricationTask.status === 'paused' && selectedFabricationTask.statusReason" class="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 inline-block">
                    Pause Reason: {{ selectedFabricationTask.statusReason }}
                  </p>
                  <div class="mt-2 text-xs text-slate-500">
                    Assigned:
                    <span v-if="selectedFabricationTask.assignees?.length">{{ selectedFabricationTask.assignees.map(person => person.name).join(', ') }}</span>
                    <span v-else>Unassigned</span>
                  </div>
                  <div class="mt-1 text-xs text-slate-500">
                    Specs: {{ selectedFabricationTask.notes || '—' }}
                  </div>
                </div>

                <div class="space-y-2">
                  <p class="text-xs font-black uppercase tracking-widest text-slate-400">Safety Checklist</p>
                  <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <input type="checkbox" v-model="selectedFabricationTask.checks.ppe" />
                    PPE worn (gloves, mask, goggles)
                  </label>
                  <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <input type="checkbox" v-model="selectedFabricationTask.checks.machine" />
                    Machine safety verified
                  </label>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-black uppercase tracking-widest text-slate-400">Photo Evidence</p>
                    <div class="flex items-center gap-2">
                      <input ref="evidenceInput" type="file" class="hidden" accept="image/*" @change="onEvidenceSelected" />
                      <button
                        @click="triggerEvidenceUpload"
                        class="px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase"
                        :disabled="evidenceUploading"
                      >
                        {{ evidenceUploading ? 'Uploading...' : 'Add Photo' }}
                      </button>
                    </div>
                  </div>
                  <div v-if="currentEvidence.length > 0" class="space-y-2">
                    <div
                      v-for="photo in currentEvidence"
                      :key="photo.id"
                      class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-2 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <div class="flex items-center gap-2">
                        <i class="mdi mdi-camera-outline text-slate-400"></i>
                        <span>{{ photo.original_name }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button class="text-[10px] font-black text-blue-600" @click="openEvidence(photo)">View</button>
                        <button class="text-[10px] font-black text-red-600" @click="deleteEvidence(photo)">Delete</button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-xs text-slate-500">No photos captured yet.</div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="flex-1 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg"
                    @click="updateTaskStatus(selectedFabricationTask, 'in_progress')"
                  >
                    Start
                  </button>
                  <button
                    class="flex-1 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg"
                    @click="updateTaskStatus(selectedFabricationTask, 'paused')"
                  >
                    Pause
                  </button>
                  <button
                    class="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                    @click="updateTaskStatus(selectedFabricationTask, 'completed')"
                  >
                    Complete
                  </button>
                </div>
              </div>
              <div v-else class="text-sm text-slate-500">Select a task to begin execution.</div>
            </div>
          </div>

          <!-- Midway QC Capture (Per Workstation) -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Mid‑Production QC</h3>
                <p class="text-xs text-slate-500">Captured per workstation and summarized in QC step.</p>
              </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {{ visibleWorkstations.find(w => w.key === activeWorkstation)?.label || 'Workstation' }}
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    Autosaving
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">QC Stage</p>
                  <p class="text-xs text-slate-500">Where this mid‑QC was performed</p>
                </div>
                <select
                  v-model="midQcStageByWorkstation[activeWorkstation]"
                  @change="queueMidQcAutosave"
                  class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs px-3 py-2"
                >
                  <option v-for="stage in qcStageOptions" :key="stage.value" :value="stage.value">
                    {{ stage.label }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                <div
                  v-for="check in midQcByWorkstation[activeWorkstation] || []"
                  :key="check.id"
                  class="p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs font-black uppercase tracking-widest text-slate-400">{{ check.category }}</p>
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ check.title }}</p>
                      <p class="text-xs text-slate-500">{{ check.notes }}</p>
                      <p v-if="check.status === 'failed' && check.notes" class="mt-2 text-xs font-semibold text-red-600">
                        Fail Reason: {{ check.notes }}
                      </p>
                    </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="setMidQcStatus(check, 'passed')"
                      class="px-2 py-1 text-[10px] font-black uppercase rounded-lg"
                      :class="check.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                    >
                      Pass
                    </button>
                    <button
                      @click="setMidQcStatus(check, 'failed')"
                      class="px-2 py-1 text-[10px] font-black uppercase rounded-lg"
                      :class="check.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'"
                    >
                      Fail
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="(midQcByWorkstation[activeWorkstation] || []).length === 0" class="text-xs text-slate-500">
                No mid‑QC checklist defined for this workstation yet.
              </div>
            </div>
          </div>
        </div>

        <!-- QC -->
        <div v-else-if="activeStep === 'qc'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
              <i class="mdi mdi-shield-check text-emerald-600 dark:text-emerald-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quality Control</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Checkpoint inspections, defect log, evidence, sign-off</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('qc')"
                :disabled="completedStepsSet.has('qc')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('qc') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('qc') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <!-- QC Summary -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Completion</div>
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-2 bg-emerald-600" :style="{ width: `${qcSummary.completion}%` }"></div>
                </div>
                <span class="text-lg font-black text-slate-900 dark:text-white">{{ qcSummary.completion }}%</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Passed</div>
              <div class="text-lg font-black text-emerald-600">{{ qcSummary.passed }}</div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Failed</div>
              <div class="text-lg font-black text-red-500">{{ qcSummary.failed }}</div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pending</div>
              <div class="text-lg font-black text-slate-500">{{ qcSummary.pending }}</div>
            </div>
          </div>

          <!-- Mid-Production QC Summary -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Mid‑Production QC Summary</h3>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {{ midQcSummary.completed }} / {{ midQcSummary.total }} checks
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="station in visibleWorkstations"
                :key="station.key"
                class="p-3 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-black uppercase tracking-widest text-slate-400">{{ station.label }}</p>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">
                      {{ midQcByWorkstationSummary[station.key]?.status || 'pending' }}
                    </p>
                  </div>
                  <div class="text-[10px] font-black uppercase px-2 py-1 rounded-lg"
                       :class="midQcByWorkstationSummary[station.key]?.status === 'passed'
                         ? 'bg-emerald-100 text-emerald-700'
                         : midQcByWorkstationSummary[station.key]?.status === 'failed'
                           ? 'bg-red-100 text-red-600'
                           : 'bg-slate-100 text-slate-500'">
                    {{ midQcByWorkstationSummary[station.key]?.label || 'pending' }}
                  </div>
                </div>
                <div class="mt-2 text-xs text-slate-500">
                  Passed: {{ midQcByWorkstationSummary[station.key]?.passed || 0 }},
                  Failed: {{ midQcByWorkstationSummary[station.key]?.failed || 0 }},
                  Pending: {{ midQcByWorkstationSummary[station.key]?.pending || 0 }}
                </div>
              </div>
            </div>
            <p class="mt-3 text-xs text-slate-500">
              Mid‑QC is captured per workstation; final QC remains in the checklist below.
            </p>
          </div>

          <!-- Checkpoints + Defect Log -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">QC Checkpoints</h3>
                <div class="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Final QC</div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div
                    v-for="checkpoint in qcCheckpointsFinal"
                    :key="checkpoint.id"
                    class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3 min-h-[140px]"
                  >
                    <div class="space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ checkpoint.category }}</p>
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ checkpoint.title }}</p>
                      <p class="text-xs text-slate-500 leading-relaxed">{{ checkpoint.notes }}</p>
                      <p v-if="checkpoint.failure_reason" class="mt-2 text-xs font-semibold text-red-600">
                        Fail Reason: {{ checkpoint.failure_reason }}
                      </p>
                    </div>
                    <div class="flex items-center gap-2 justify-between mt-auto">
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                        :class="checkpoint.status === 'passed' ? 'bg-emerald-500 text-white' : (checkpoint.status === 'failed' ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-700')"
                      >
                        {{ checkpoint.status }}
                      </span>
                      <div class="flex items-center gap-1.5">
                        <button
                          class="px-2 py-1 text-[10px] font-black uppercase rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                          @click="setFinalQcStatus(checkpoint, 'passed')"
                        >
                          Pass
                        </button>
                        <button
                          class="px-2 py-1 text-[10px] font-black uppercase rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                          @click="setFinalQcStatus(checkpoint, 'failed')"
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Defect Log</h3>
                <div class="space-y-2">
                  <div
                    v-for="defect in qcDefects"
                    :key="defect.id"
                    class="p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ defect.title }}</p>
                      <span class="text-[10px] font-black uppercase text-red-600">{{ defect.status }}</span>
                    </div>
                    <p class="text-xs text-slate-500">{{ defect.notes }}</p>
                    <p v-if="defect.meta" class="text-[10px] text-slate-400 mt-2">{{ defect.meta }}</p>
                  </div>
                  <div v-if="qcDefects.length === 0" class="text-xs text-slate-500">
                    No defects logged from Mid‑QC or Final QC.
                  </div>
                </div>
            </div>
          </div>

          <!-- Evidence + Sign-off -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Photo Evidence</h3>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <button class="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold">Upload Photos</button>
                <span>Attach photos for inspection records</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Final Sign-off</h3>
              <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div class="flex items-center justify-between">
                  <span>Inspector</span>
                  <span class="text-slate-400">Pending</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Supervisor</span>
                  <span class="text-slate-400">Pending</span>
                </div>
                <button class="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                  Approve QC
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Packaging -->
        <div v-else-if="activeStep === 'packaging'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
              <i class="mdi mdi-package-variant-closed text-indigo-600 dark:text-indigo-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Packaging & Handover</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Internal transfer to logistics (not client handover)</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('packaging')"
                :disabled="completedStepsSet.has('packaging')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('packaging') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('packaging') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <!-- Gate: Final QC -->
          <div class="bg-amber-50/70 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="mdi mdi-shield-check text-amber-600 text-xl"></i>
                <div>
                  <p class="text-xs font-black uppercase tracking-widest text-amber-600">Final QC Confirmation</p>
                  <p class="text-xs text-amber-700 dark:text-amber-300">Packaging is allowed only after QC is signed off.</p>
                </div>
              </div>
              <button class="px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold">Verify QC</button>
            </div>
          </div>

          <!-- Cleaning & Finishing Touches -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Cleaning & Finishing</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <label class="flex items-center gap-2">
                <input type="checkbox" />
                Surface wipe (dust, fingerprints, glue residue)
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" />
                Edge trimming (threads, uneven vinyl, glue smudges)
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" />
                Polishing (acrylic, stainless, glossy surfaces)
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" />
                Tag removal (internal tags, corners checked)
              </label>
            </div>
          </div>

          <!-- Protection & Wrapping -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Protection & Wrapping</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead class="text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th class="text-left py-2">Material Type</th>
                    <th class="text-left py-2">Packaging Material</th>
                  </tr>
                </thead>
                <tbody class="text-slate-600 dark:text-slate-300">
                  <tr><td class="py-1">Vinyl Banners</td><td class="py-1">Roll loosely, wrap in plastic, label ends</td></tr>
                  <tr><td class="py-1">Wood/Metal Frames</td><td class="py-1">Bubble wrap corners, cover with foam/card</td></tr>
                  <tr><td class="py-1">Acrylic Panels</td><td class="py-1">Foam sheets + corner guards</td></tr>
                  <tr><td class="py-1">Light Boxes/Props</td><td class="py-1">Thermocol or soft foam padding</td></tr>
                  <tr><td class="py-1">Digital Screens</td><td class="py-1">Dust-free cloth wrap, screen guard</td></tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 text-xs text-slate-500">
              Label all bundles: Job Number, Client, Item Description, Quantity, Handling info (FRAGILE/TOP LOAD).
            </div>
          </div>

          <!-- Handover Form -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Handover Form</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Job Number" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Client Name" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Description of Items" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Quantity" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Condition at Dispatch" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Handed Over By (Production)" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Received By (Logistics/Client Service)" />
                <input class="p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Remarks" />
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Dispatch</h3>
              <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Notify logistics & client service
                </label>
                <input class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Pickup reference / Waybill" />
                <input class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Handling instructions" />
                <button class="w-full mt-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold">Notify Dispatch</button>
              </div>
            </div>
          </div>

          <!-- Staging & Delivery Checklist -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Staging Confirmation</h3>
              <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Items moved to dispatch/staging zone
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Labeled by Job / Client / Route
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Cross‑checked against dispatch list
                </label>
                <input class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Staging location / shelf" />
              </div>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Delivery Checklist</h3>
              <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  All items ticked as loaded
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Fragile / special handling notes attached
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Driver / loader signed checklist
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Client / site rep acknowledged delivery
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  <input class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Signed by (Driver/Loader)" />
                  <input class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Signed by (Client/Site)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Post-Handover -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Post‑Handover Feedback</h3>
            <p class="text-xs text-slate-500">
              If delivery issues occur, reference the handover log, review packaging method, and conduct a post‑mortem with QC and dispatch.
            </p>
          </div>
        </div>

        <!-- Close -->
        <div v-else-if="activeStep === 'close'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <i class="mdi mdi-check-decagram text-slate-600 dark:text-slate-300 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Production Close</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Closes production work only, not the overall project</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('close')"
                :disabled="completedStepsSet.has('close')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('close') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('close') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <!-- Close Summary -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">QC Status</div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Final QC Pending</div>
              <p class="text-xs text-slate-500">Complete QC sign‑off before closing</p>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Packaging</div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Not Confirmed</div>
              <p class="text-xs text-slate-500">Handover form required</p>
            </div>
            <div class="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Dispatch</div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Pending</div>
              <p class="text-xs text-slate-500">Logistics notification outstanding</p>
            </div>
          </div>

          <!-- Close Checklist -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Close Checklist</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <label class="flex items-center gap-2"><input type="checkbox" /> Final QC signed off</label>
              <label class="flex items-center gap-2"><input type="checkbox" /> Packaging complete</label>
              <label class="flex items-center gap-2"><input type="checkbox" /> Handover form filed</label>
              <label class="flex items-center gap-2"><input type="checkbox" /> Dispatch notified</label>
            </div>
          </div>

          <!-- Closure Note -->
          <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Closure Note</h3>
            <textarea class="w-full p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-sm" rows="4" placeholder="Add closure notes or post‑mortem details..."></textarea>
          </div>

          <!-- Close Action -->
          <div class="flex items-center gap-3">
            <button class="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
              Close Production Work
            </button>
            <span class="text-xs text-slate-500">This does not close the overall project.</span>
          </div>
        </div>

        <!-- Rework -->
        <div v-else-if="activeStep === 'rework'" class="space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div class="p-2.5 bg-rose-100 dark:bg-rose-900 rounded-xl">
              <i class="mdi mdi-repeat text-rose-600 dark:text-rose-400 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Rework</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Post‑close adjustments, client changes, and reuse updates</p>
            </div>
            <div class="ml-auto">
              <button
                @click="markStepComplete('rework')"
                :disabled="completedStepsSet.has('rework')"
                class="px-3 py-2 rounded-lg text-xs font-bold"
                :class="completedStepsSet.has('rework') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white'"
              >
                {{ completedStepsSet.has('rework') ? 'Completed' : 'Mark Complete' }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-black uppercase tracking-widest text-slate-400">Rework Requests</h3>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Auto from QC + Manual</span>
              </div>
                <div v-if="reworkItems.length > 0" class="space-y-3">
                  <div
                    v-for="item in reworkItems"
                    :key="item.id"
                    class="p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <p class="text-xs font-black uppercase tracking-widest text-slate-400">
                          {{ item.source }}
                          <span v-if="item.isChangeRequest" class="ml-2 text-[10px] font-black uppercase text-blue-600">Client Change</span>
                        </p>
                        <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.title }}</p>
                        <p class="text-xs text-slate-500">{{ item.notes }}</p>
                        <p v-if="item.createdAt" class="text-[10px] text-slate-400 mt-1">Logged {{ formatDate(item.createdAt) }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <select v-model="item.status" @change="queueReworkUpdate(item)" class="text-[10px] uppercase font-black px-2 py-1 rounded-lg border border-slate-200">
                          <option value="open">open</option>
                          <option value="in_progress">in progress</option>
                          <option value="closed">closed</option>
                        </select>
                        <button class="text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                                @click="toggleReworkExpanded(item)">
                          {{ reworkExpanded.has(item.id) ? 'Hide' : 'Details' }}
                        </button>
                      </div>
                    </div>

                    <div v-if="reworkExpanded.has(item.id)" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                      <select v-model="item.assignedWorkstation" @change="queueReworkUpdate(item)" class="w-full p-2 rounded-lg border border-slate-200/60">
                        <option value="">Select workstation</option>
                        <option v-for="station in workstations" :key="station.key" :value="station.label">
                          {{ station.label }}
                        </option>
                      </select>
                      <div class="relative">
                        <input
                          v-model="item.assignedTo"
                          @input="onReworkAssigneeInput(item.id, item.assignedTo || '')"
                          @blur="queueReworkUpdate(item)"
                          class="w-full p-2 rounded-lg border border-slate-200/60"
                          placeholder="Assigned to (name)"
                        />
                        <div
                          v-if="reworkAssigneeOpen[item.id] && (reworkAssigneeResults[item.id]?.length || 0) > 0"
                          class="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                        >
                          <button
                            v-for="option in reworkAssigneeResults[item.id]"
                            :key="`${option.type}-${option.id}`"
                            type="button"
                            class="w-full text-left px-3 py-2 text-xs hover:bg-slate-50"
                            @click="selectReworkAssignee(item, option)"
                          >
                            {{ option.label }}
                          </button>
                        </div>
                      </div>
                      <input v-model="item.targetDate" @input="queueReworkUpdate(item)" @change="queueReworkUpdate(item)" type="date" class="w-full p-2 rounded-lg border border-slate-200/60" />
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-black uppercase">Rework QC</span>
                        <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                              :class="item.qcStatus === 'passed' ? 'bg-emerald-500 text-white' : item.qcStatus === 'failed' ? 'bg-red-500 text-white' : 'bg-slate-300 text-slate-700'">
                          {{ item.qcStatus || 'pending' }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2 justify-end">
                        <button class="px-2 py-1 text-[10px] font-black uppercase rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50" @click="setReworkQcStatus(item, 'passed')">
                          Pass
                        </button>
                        <button class="px-2 py-1 text-[10px] font-black uppercase rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50" @click="setReworkQcStatus(item, 'failed')">
                          Fail
                        </button>
                      </div>
                      <div v-if="item.qcStatus === 'failed' && item.qcReason" class="md:col-span-2 text-xs font-semibold text-red-600">
                        Fail Reason: {{ item.qcReason }}
                      </div>

                      <div class="md:col-span-2">
                        <div class="flex items-center justify-between">
                          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Rework Images</p>
                          <div class="flex items-center gap-2">
                            <input
                              :ref="el => setReworkEvidenceInput(item.id, el as HTMLInputElement)"
                              type="file"
                              class="hidden"
                              accept="image/*"
                              @change="(event) => onReworkEvidenceSelected(event, item.id)"
                            />
                            <button class="px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase" @click="triggerReworkEvidenceUpload(item.id)">
                              Add Photo
                            </button>
                          </div>
                        </div>
                        <div v-if="(reworkEvidence[item.id] || []).length > 0" class="mt-2 space-y-2">
                          <div v-for="photo in reworkEvidence[item.id]" :key="photo.id" class="flex items-center justify-between rounded-lg border border-slate-100 p-2 text-xs text-slate-600">
                            <span>{{ photo.original_name }}</span>
                            <div class="flex items-center gap-2">
                              <button class="text-[10px] font-black text-blue-600" @click="openEvidence(photo)">View</button>
                              <button class="text-[10px] font-black text-red-600" @click="deleteReworkEvidence(item.id, photo)">Delete</button>
                            </div>
                          </div>
                        </div>
                        <div v-else class="mt-2 text-xs text-slate-500">No images uploaded yet.</div>
                      </div>
                    </div>
                  </div>
                </div>
              <div v-else class="text-xs text-slate-500">No rework items logged yet.</div>
            </div>

            <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4">
              <h3 class="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Log Manual Rework</h3>
              <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <input v-model="reworkForm.title" class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" placeholder="Rework title" />
                <textarea v-model="reworkForm.reason" class="w-full p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60" rows="3" placeholder="Reason / change request details..." />
                <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <input type="checkbox" v-model="reworkForm.isChangeRequest" />
                  Client change request
                </label>
                <button class="w-full mt-2 px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold" @click="createManualRework">
                  Create Rework
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Evidence Preview -->
    <div v-if="evidencePreview" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-slate-900/80" @click="closeEvidencePreview"></div>
      <div class="absolute inset-0 flex items-center justify-center p-6">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full h-full max-w-[100vw] max-h-[100vh] overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
            <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ evidencePreview.original_name }}</div>
            <button class="text-slate-400 hover:text-slate-600" @click="closeEvidencePreview">✕</button>
          </div>
          <div class="h-[calc(100%-52px)] bg-slate-900/5 dark:bg-slate-800 flex items-center justify-center p-6">
            <img v-if="evidencePreview.file_url" :src="evidencePreview.file_url" :alt="evidencePreview.original_name" class="max-h-full max-w-full object-contain rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Asset Preview Modal - Fullscreen -->
    <div v-if="assetPreviewVisible" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="closeAssetPreview"></div>
      <div class="relative w-full h-full max-w-[100vw] max-h-screen flex flex-col z-60 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <i class="mdi mdi-image-outline text-purple-600 dark:text-purple-400 text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ previewingAsset?.name || 'Asset Preview' }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ previewingAsset?.formattedSize }} - {{ getFileExtension(previewingAsset?.original_name || '') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button icon="mdi mdi-download" @click="downloadAsset(previewingAsset!)" text rounded />
            <Button icon="mdi mdi-close" @click="closeAssetPreview" text rounded />
          </div>
        </div>
        <div class="flex-1 bg-white dark:bg-slate-900 overflow-auto p-6">
          <div v-if="previewingAsset" class="w-full h-full flex items-center justify-center">
            <div v-if="previewingAsset.isImage" class="relative max-w-full max-h-full">
              <img :src="previewingAsset.file_url" :alt="previewingAsset.name" class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            </div>
            <div v-else class="text-center max-w-2xl">
              <div class="mb-8">
                <i class="mdi mdi-file-outline text-8xl text-slate-400"></i>
              </div>
              <h4 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">{{ previewingAsset.name }}</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                  <i class="mdi mdi-file-document-outline"></i>
                  <span>{{ getFileExtension(previewingAsset.original_name) }} File</span>
                </div>
                <div class="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                  <i class="mdi mdi-database-outline"></i>
                  <span>{{ previewingAsset.formattedSize }}</span>
                </div>
                <div v-if="previewingAsset.description" class="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <p class="text-slate-700 dark:text-slate-300">{{ previewingAsset.description }}</p>
                </div>
                <div v-else class="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <i class="mdi mdi-information-outline text-blue-600 dark:text-blue-400 text-2xl mb-2"></i>
                  <p class="text-blue-700 dark:text-blue-300">No preview available for this file type</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkOrders } from '../composables'
import { workOrderScrapLogsService, workOrderTasksService, productionAssigneesService, workOrderMidQcService, workOrderTaskEvidenceService, workOrderFinalQcService, workOrderReworksService } from '../services'
import { DesignService } from '@/modules/projects/components/tasks/design/services/designService'
import { MaterialsService } from '@/modules/projects/services/materialsService'
import Network from '@/network-class'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

interface DesignAsset {
  id: number
  name: string
  original_name: string
  file_url: string
  file_size: number
  mime_type: string
  isImage: boolean
  formattedSize: string
  description?: string
}

interface ScopeElement {
  id: number
  name: string
  quantity: number
  status: string
  notes?: string
}

interface Material {
  id: number
  name: string
  quantity: number
  unit: string
  specifications?: string
  source: string
  status: string
}

interface ScrapLog {
  id: number
  element_material_id: number
  material: string
  reason: string
  stage: string
  quantity: number
  unit: string
  notes?: string
}

interface FabricationEvidence {
  id: number
  label: string
}

interface FabricationTask {
  id: number
  source_task_id?: number
  workstation: string
  element: string
  title: string
  quantity: number
  asset: string
  eta: string
  status: 'pending' | 'in_progress' | 'paused' | 'blocked' | 'completed'
  statusReason?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  assignees?: AssigneeOption[]
  notes?: string
  checks: { ppe: boolean; machine: boolean; color: boolean; finish: boolean }
  evidence: FabricationEvidence[]
}

interface ReworkItem {
  id: number
  source: string
  title: string
  notes: string
  status: 'open' | 'in_progress' | 'closed'
  isChangeRequest?: boolean
  createdAt?: string
  assignedWorkstation?: string
  assignedTo?: string
  targetDate?: string
  qcStatus?: 'pending' | 'passed' | 'failed'
  qcReason?: string
}

interface AssigneeOption {
  id: number
  type: 'employee' | 'technical_labour'
  name: string
  label: string
}

interface IntakeTask {
  id: number
  workstation: string
  title: string
  quantity: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: AssigneeOption[]
  dueDate?: string
  notes?: string
  included: boolean
  status?: 'pending' | 'in_progress' | 'paused' | 'completed'
  statusReason?: string
  safetyChecks?: { ppe: boolean; machine: boolean; color: boolean; finish: boolean }
}

const route = useRoute()
const { fetchWorkOrder, selectedWorkOrder, updateWorkOrder, loading } = useWorkOrders()

const activeStep = ref('intake')
const completedSteps = ref<string[]>([])
const designAssets = ref<DesignAsset[]>([])
const scopeElements = ref<ScopeElement[]>([])
const materialsList = ref<Material[]>([])
const materialsData = ref<{ projectElements: any[] }>({ projectElements: [] })
const previewingAsset = ref<DesignAsset | null>(null)
const assetPreviewVisible = ref(false)
const scrapLogs = ref<ScrapLog[]>([])
const scrapStages = ['Materials', 'Fabrication', 'Assembly', 'QC', 'Packaging']
const scrapForm = ref({
  materialId: 0,
  quantity: 0,
  unit: '',
  reason: '',
  stage: '',
  notes: ''
})
const intakeTasks = ref<IntakeTask[]>([])
const intakeTaskForm = ref({
  workstation: '',
  title: '',
  quantity: 0,
  priority: 'medium',
  assignedTo: [] as AssigneeOption[],
  dueDate: '',
  notes: ''
})
const assigneeSearch = ref('')
const assigneeResults = ref<AssigneeOption[]>([])
const assigneeSearchOpen = ref(false)
const assigneeSearchTimer = ref<number | null>(null)
const assigneeSearchRequestId = ref(0)
const createTaskOpen = ref(false)
const editingTask = ref<IntakeTask | null>(null)
const editTaskForm = ref({
  id: 0,
  workstation: '',
  title: '',
  quantity: 0,
  priority: 'medium',
  assignedTo: [] as AssigneeOption[],
  dueDate: '',
  notes: ''
})
const editAssigneeSearch = ref('')
const editAssigneeResults = ref<AssigneeOption[]>([])
const editAssigneeSearchOpen = ref(false)
const editAssigneeSearchTimer = ref<number | null>(null)
const editAssigneeSearchRequestId = ref(0)
const uiMessage = ref<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
const taskEvidence = ref<Record<number, any[]>>({})
const evidenceUploading = ref(false)
const evidencePreview = ref<any | null>(null)
const maxEvidenceSizeBytes = 5 * 1024 * 1024
const reworkItems = ref<ReworkItem[]>([])
const reworkForm = ref({
  title: '',
  reason: '',
  isChangeRequest: false
})

const reworkEvidence = ref<Record<number, any[]>>({})
const reworkEvidenceInputs = ref<Record<number, HTMLInputElement | null>>({})
const reworkExpanded = ref<Set<number>>(new Set())
const reworkAssigneeSearch = ref<Record<number, string>>({})
const reworkAssigneeResults = ref<Record<number, AssigneeOption[]>>({})
const reworkAssigneeOpen = ref<Record<number, boolean>>({})
let reworkAssigneeTimer: number | null = null

const setReworkEvidenceInput = (id: number, el: HTMLInputElement | null) => {
  reworkEvidenceInputs.value[id] = el
}

const toggleReworkExpanded = async (item: ReworkItem) => {
  const set = reworkExpanded.value
  if (set.has(item.id)) {
    set.delete(item.id)
    reworkExpanded.value = new Set(set)
    return
  }
  set.add(item.id)
  reworkExpanded.value = new Set(set)
  if (!reworkEvidence.value[item.id]) {
    await fetchReworkEvidence(item.id)
  }
}

const searchReworkAssignees = async (reworkId: number, query: string) => {
  try {
    const response = await productionAssigneesService.searchAssignees(query)
    const results = response?.data || []
    reworkAssigneeResults.value[reworkId] = results
    reworkAssigneeOpen.value[reworkId] = true
  } catch (error) {
    console.error('Error searching rework assignees:', error)
    reworkAssigneeResults.value[reworkId] = []
    reworkAssigneeOpen.value[reworkId] = false
  }
}

const onReworkAssigneeInput = (reworkId: number, value: string) => {
  reworkAssigneeSearch.value[reworkId] = value
  if (reworkAssigneeTimer) window.clearTimeout(reworkAssigneeTimer)
  reworkAssigneeTimer = window.setTimeout(() => {
    if (!value || value.trim().length < 2) {
      reworkAssigneeResults.value[reworkId] = []
      reworkAssigneeOpen.value[reworkId] = false
      return
    }
    searchReworkAssignees(reworkId, value.trim())
  }, 250)
}

const selectReworkAssignee = (item: ReworkItem, option: AssigneeOption) => {
  item.assignedTo = option.name
  reworkAssigneeSearch.value[item.id] = option.name
  reworkAssigneeOpen.value[item.id] = false
  queueReworkUpdate(item)
}

const fetchReworkEvidence = async (reworkId: number) => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderReworksService.getEvidence(workOrderId, reworkId)
    const items = Array.isArray(response?.data) ? response.data : []
    reworkEvidence.value[reworkId] = items.map(normalizeEvidence)
  } catch (error) {
    console.error('Error fetching rework evidence:', error)
  }
}

const triggerReworkEvidenceUpload = (reworkId: number) => {
  reworkEvidenceInputs.value[reworkId]?.click()
}

const onReworkEvidenceSelected = async (event: Event, reworkId: number) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > maxEvidenceSizeBytes) {
    uiMessage.value = { type: 'error', text: 'MAX UPLOAD IS 5MB' }
    if (input) input.value = ''
    return
  }
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderReworksService.uploadEvidence(workOrderId, reworkId, file)
    if (response?.success === false) {
      uiMessage.value = { type: 'error', text: (response?.message || 'REWORK EVIDENCE UPLOAD FAILED').toString().toUpperCase() }
      return
    }
    const created = response?.data
    if (created) {
      if (!reworkEvidence.value[reworkId]) reworkEvidence.value[reworkId] = []
      reworkEvidence.value[reworkId].unshift(normalizeEvidence(created))
      uiMessage.value = { type: 'success', text: 'REWORK IMAGE UPLOADED' }
    }
  } catch (error) {
    console.error('Error uploading rework evidence:', error)
    uiMessage.value = { type: 'error', text: 'REWORK EVIDENCE UPLOAD FAILED' }
  } finally {
    if (input) input.value = ''
  }
}

const deleteReworkEvidence = async (reworkId: number, photo: any) => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    await workOrderReworksService.deleteEvidence(workOrderId, reworkId, photo.id)
    reworkEvidence.value[reworkId] = (reworkEvidence.value[reworkId] || []).filter(item => item.id !== photo.id)
    uiMessage.value = { type: 'success', text: 'REWORK IMAGE DELETED' }
  } catch (error) {
    console.error('Error deleting rework evidence:', error)
    uiMessage.value = { type: 'error', text: 'REWORK EVIDENCE DELETE FAILED' }
  }
}

let reworkUpdateTimer: number | null = null
const queueReworkUpdate = (item: ReworkItem) => {
  if (reworkUpdateTimer) window.clearTimeout(reworkUpdateTimer)
  reworkUpdateTimer = window.setTimeout(() => {
    updateRework(item)
  }, 400)
}

const updateRework = async (item: ReworkItem) => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const payload = {
      status: item.status,
      assigned_workstation: item.assignedWorkstation || null,
      assigned_to: item.assignedTo || null,
      target_date: item.targetDate || null,
      qc_status: item.qcStatus,
      qc_reason: item.qcReason || null
    }
    const response = await workOrderReworksService.updateRework(workOrderId, item.id, payload)
    if (response?.success === false) {
      uiMessage.value = { type: 'error', text: (response?.message || 'REWORK UPDATE FAILED').toString().toUpperCase() }
      return
    }
    uiMessage.value = { type: 'success', text: 'REWORK UPDATED' }
  } catch (error) {
    console.error('Error updating rework:', error)
    uiMessage.value = { type: 'error', text: 'REWORK UPDATE FAILED' }
  }
}

const setReworkQcStatus = (item: ReworkItem, status: 'passed' | 'failed') => {
  if (status === 'failed') {
    const reason = window.prompt('Reason for Rework QC fail?')?.trim()
    if (!reason) {
      uiMessage.value = { type: 'error', text: 'FAIL REASON REQUIRED' }
      return
    }
    item.qcStatus = 'failed'
    item.qcReason = reason
    queueReworkUpdate(item)
    return
  }
  item.qcStatus = 'passed'
  item.qcReason = ''
  queueReworkUpdate(item)
}

const formatReworkSource = (item: any) => {
  const base = item.source_type === 'mid_qc'
    ? 'Mid‑QC'
    : item.source_type === 'final_qc'
      ? 'Final QC'
      : 'Manual'
  const station = item.source_ref ? ` · ${item.source_ref}` : ''
  const stage = item.qc_stage ? ` · ${formatQcStage(item.qc_stage)}` : ''
  return `${base}${station}${stage}`
}

const mapReworkItem = (item: any): ReworkItem => ({
  id: item.id,
  source: formatReworkSource(item),
  title: item.title,
  notes: item.reason || 'No reason provided.',
  status: item.status || 'open',
  isChangeRequest: item.is_change_request ?? false,
  createdAt: item.created_at || null,
  assignedWorkstation: item.assigned_workstation || '',
  assignedTo: item.assigned_to || '',
  targetDate: item.target_date || '',
  qcStatus: item.qc_status || 'pending',
  qcReason: item.qc_reason || ''
})

const workflowSteps = computed(() => [
  { key: 'intake', label: 'Intake', subtitle: 'Job Intake', icon: 'mdi-clipboard-text-outline' },
  { key: 'design_assets', label: 'Design', subtitle: 'Assets', icon: 'mdi-image-multiple-outline', count: designAssets.value.length },
  { key: 'materials', label: 'Materials', subtitle: 'Verification', icon: 'mdi-package-variant-closed', count: materialsData.value.projectElements.length },
  { key: 'fabrication', label: 'Fabrication', subtitle: 'Assembly', icon: 'mdi-hammer-wrench' },
  { key: 'qc', label: 'Quality', subtitle: 'Control', icon: 'mdi-shield-check' },
  { key: 'packaging', label: 'Packaging', subtitle: 'Handover', icon: 'mdi-truck-fast' },
  { key: 'close', label: 'Close', subtitle: 'Production', icon: 'mdi-check-decagram' },
  { key: 'rework', label: 'Rework', subtitle: 'Post‑Close', icon: 'mdi-repeat' }
])

const activeStepIndex = computed(() => workflowSteps.value.findIndex(step => step.key === activeStep.value))
const completedStepsSet = computed(() => new Set(completedSteps.value))
const lastCompletedIndex = computed(() => {
  if (completedSteps.value.length === 0) return -1
  const indices = completedSteps.value
    .map(step => workflowSteps.value.findIndex(item => item.key === step))
    .filter(index => index >= 0)
  return indices.length ? Math.max(...indices) : -1
})

const workstations = ref([
  { key: 'cnc', label: 'CNC', subtitle: 'Router', icon: 'mdi-cog-outline', status: 'running', queue: 3 },
  { key: 'carpentry', label: 'Carpentry & Woodwork', subtitle: 'Woodwork', icon: 'mdi-saw-blade', status: 'idle', queue: 1 },
  { key: 'welding', label: 'Metal Fabrication & Welding', subtitle: 'Metalwork', icon: 'mdi-welding', status: 'idle', queue: 1 },
  { key: 'electrical', label: 'Electrical & LED Signage', subtitle: 'LED Signage', icon: 'mdi-flash', status: 'idle', queue: 1 },
  { key: 'print', label: 'Print', subtitle: 'Large Format', icon: 'mdi-printer', status: 'running', queue: 2 },
  { key: 'paint', label: 'Paint & Finishing Booth', subtitle: 'Finish', icon: 'mdi-brush-variant', status: 'idle', queue: 1 },
  { key: 'assembly', label: 'Assembly', subtitle: 'Build', icon: 'mdi-hammer-screwdriver', status: 'idle', queue: 0 }
])

const activeWorkstation = ref('cnc')

const fabricationTasks = ref<FabricationTask[]>([])

const selectedFabricationTask = ref<FabricationTask | null>(null)

const visibleWorkstations = computed(() => {
  const keys = new Set(fabricationTasks.value.map(task => task.workstation))
  return workstations.value.filter(station => keys.has(station.key))
})

const filteredFabricationTasks = computed(() => {
  return fabricationTasks.value.filter(task => task.workstation === activeWorkstation.value)
})

const getWorkstationCount = (key: string) => {
  return fabricationTasks.value.filter(task => task.workstation === key).length
}

const selectFabricationTask = (task: FabricationTask) => {
  selectedFabricationTask.value = task
  if (task.source_task_id && !taskEvidence.value[task.source_task_id]) {
    fetchEvidenceForTask(task.source_task_id)
  }
}

const evidenceInput = ref<HTMLInputElement | null>(null)

const currentEvidence = computed(() => {
  const taskId = selectedFabricationTask.value?.source_task_id
  if (!taskId) return []
  return taskEvidence.value[taskId] || []
})

const triggerEvidenceUpload = () => {
  if (!selectedFabricationTask.value?.source_task_id) return
  evidenceInput.value?.click()
}

const onEvidenceSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !selectedFabricationTask.value?.source_task_id) return

  if (file.size > maxEvidenceSizeBytes) {
    uiMessage.value = { type: 'error', text: 'MAX UPLOAD IS 5MB' }
    if (input) input.value = ''
    return
  }

  try {
    evidenceUploading.value = true
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const taskId = selectedFabricationTask.value.source_task_id
    const response = await workOrderTaskEvidenceService.uploadEvidence(workOrderId, taskId, file)
    if (response?.success === false) {
      uiMessage.value = { type: 'error', text: (response?.message || 'EVIDENCE UPLOAD FAILED').toString().toUpperCase() }
      return
    }
    if (response?.error_message || response?.error) {
      uiMessage.value = { type: 'error', text: (response?.error_message || response?.error || 'EVIDENCE UPLOAD FAILED').toString().toUpperCase() }
      return
    }
    const created = response?.data
    if (created) {
      if (!taskEvidence.value[taskId]) taskEvidence.value[taskId] = []
      taskEvidence.value[taskId].unshift(normalizeEvidence(created))
      uiMessage.value = { type: 'success', text: 'EVIDENCE UPLOADED' }
    }
  } catch (error) {
    console.error('Error uploading evidence:', error)
    uiMessage.value = { type: 'error', text: 'EVIDENCE UPLOAD FAILED' }
  } finally {
    evidenceUploading.value = false
    if (input) input.value = ''
  }
}

const fetchEvidenceForTask = async (taskId: number) => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderTaskEvidenceService.getEvidence(workOrderId, taskId)
    const items = Array.isArray(response?.data) ? response.data : []
    taskEvidence.value[taskId] = items.map(normalizeEvidence)
  } catch (error) {
    console.error('Error fetching evidence:', error)
  }
}

  const resolveEvidenceUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const base = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8000'
    const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base
    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`
  }

  const normalizeEvidence = (photo: any) => ({
    ...photo,
    file_url: resolveEvidenceUrl(photo?.file_url || '')
  })

  const openEvidence = (photo: any) => {
    if (!photo?.file_url) return
    evidencePreview.value = normalizeEvidence(photo)
  }

const closeEvidencePreview = () => {
  evidencePreview.value = null
}

const deleteEvidence = async (photo: any) => {
  const taskId = selectedFabricationTask.value?.source_task_id
  if (!taskId) return
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    await workOrderTaskEvidenceService.deleteEvidence(workOrderId, taskId, photo.id)
    taskEvidence.value[taskId] = (taskEvidence.value[taskId] || []).filter(item => item.id !== photo.id)
    uiMessage.value = { type: 'success', text: 'EVIDENCE DELETED' }
  } catch (error) {
    console.error('Error deleting evidence:', error)
    uiMessage.value = { type: 'error', text: 'EVIDENCE DELETE FAILED' }
  }
}

const syncFabricationTasksFromIntake = () => {
  const existing = new Map(fabricationTasks.value.map(task => [task.source_task_id, task]))
  const nextTasks: FabricationTask[] = []
  const defaultElement = selectedWorkOrder.value?.projectEnquiry?.title || 'Work Order'
  const defaultAsset = designAssets.value[0]?.original_name || 'Design Asset'

  intakeTasks.value
    .filter(task => task.included)
    .forEach((task, index) => {
      const existingTask = existing.get(task.id)
      if (existingTask) {
        existingTask.workstation = task.workstation
        existingTask.title = task.title
        existingTask.quantity = task.quantity
        existingTask.status = (task.status as FabricationTask['status']) || 'pending'
        existingTask.statusReason = task.statusReason || ''
        existingTask.priority = task.priority
        existingTask.assignees = task.assignedTo
        existingTask.notes = task.notes
        existingTask.element = defaultElement
        nextTasks.push(existingTask)
      } else {
        nextTasks.push({
          id: Date.now() + index,
          source_task_id: task.id,
          workstation: task.workstation,
          element: defaultElement,
          title: task.title,
          quantity: task.quantity,
          asset: defaultAsset,
          eta: task.dueDate || 'TBD',
          status: (task.status as FabricationTask['status']) || 'pending',
          statusReason: task.statusReason || '',
          priority: task.priority,
            assignees: task.assignedTo,
            notes: task.notes,
            checks: task.safetyChecks || { ppe: false, machine: false, color: false, finish: false },
            evidence: []
          })
        }
      })

  fabricationTasks.value = nextTasks
}

const mapIntakeTask = (task: any): IntakeTask => ({
  id: task.id,
  workstation: task.workstation,
  title: task.title,
  quantity: Number(task.quantity) || 0,
  priority: task.priority || 'medium',
  assignedTo: task.assignees || [],
  dueDate: task.due_date || '',
  notes: task.notes || '',
  included: task.included ?? true,
  status: task.status || 'pending',
  statusReason: task.status_reason || '',
  safetyChecks: {
    ppe: task?.safety_checks?.ppe ?? false,
    machine: task?.safety_checks?.machine ?? false,
    color: task?.safety_checks?.color ?? false,
    finish: task?.safety_checks?.finish ?? false
  }
})

const fetchIntakeTasks = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderTasksService.getTasks(workOrderId)
    intakeTasks.value = (response?.data || []).map(mapIntakeTask)
  } catch (error) {
    console.error('Error fetching intake tasks:', error)
    intakeTasks.value = []
  }
}

const addIntakeTask = async () => {
  if (!intakeTaskForm.value.workstation || !intakeTaskForm.value.title) return
  const workOrderId = Number(route.params.id)
  if (!workOrderId) return

  try {
    const payload = {
      workstation: intakeTaskForm.value.workstation,
      title: intakeTaskForm.value.title,
      quantity: intakeTaskForm.value.quantity || 0,
      priority: intakeTaskForm.value.priority,
      due_date: intakeTaskForm.value.dueDate || null,
      notes: intakeTaskForm.value.notes || null,
      included: true,
      assignees: intakeTaskForm.value.assignedTo.map(person => ({ id: person.id, type: person.type }))
    }
    const response = await workOrderTasksService.createTask(workOrderId, payload)
    const created = response?.data
    if (created) intakeTasks.value.unshift(mapIntakeTask(created))
  } catch (error) {
    console.error('Error creating intake task:', error)
  }
  closeCreateTask()
}

const searchAssignees = async () => {
  const query = assigneeSearch.value.trim()
  if (query.length < 2) {
    assigneeResults.value = []
    assigneeSearchOpen.value = false
    return
  }
  const requestId = ++assigneeSearchRequestId.value
  try {
    const response = await productionAssigneesService.searchAssignees(query)
    if (requestId !== assigneeSearchRequestId.value) return
    assigneeResults.value = response?.data || []
    assigneeSearchOpen.value = true
  } catch (error) {
    console.error('Error fetching assignees:', error)
    assigneeResults.value = []
    assigneeSearchOpen.value = false
  }
}

const addAssignee = (person: AssigneeOption) => {
  if (intakeTaskForm.value.assignedTo.find(p => p.id === person.id && p.type === person.type)) return
  intakeTaskForm.value.assignedTo.push(person)
  assigneeResults.value = []
  assigneeSearch.value = ''
  assigneeSearchOpen.value = false
}

const removeAssignee = (person: AssigneeOption) => {
  intakeTaskForm.value.assignedTo = intakeTaskForm.value.assignedTo.filter(p => !(p.id === person.id && p.type === person.type))
}

const openCreateTask = () => {
  createTaskOpen.value = true
  assigneeSearch.value = ''
  assigneeResults.value = []
  assigneeSearchOpen.value = false
}

const closeCreateTask = () => {
  createTaskOpen.value = false
  intakeTaskForm.value = {
    workstation: '',
    title: '',
    quantity: 0,
    priority: 'medium',
    assignedTo: [],
    dueDate: '',
    notes: ''
  }
  assigneeSearch.value = ''
  assigneeResults.value = []
  assigneeSearchOpen.value = false
}

const openEditTask = (task: IntakeTask) => {
  editingTask.value = task
  editTaskForm.value = {
    id: task.id,
    workstation: task.workstation,
    title: task.title,
    quantity: task.quantity,
    priority: task.priority,
    assignedTo: [...task.assignedTo],
    dueDate: task.dueDate || '',
    notes: task.notes || ''
  }
  editAssigneeSearch.value = ''
  editAssigneeResults.value = []
}

const closeEditTask = () => {
  editingTask.value = null
}

const searchEditAssignees = async () => {
  const query = editAssigneeSearch.value.trim()
  if (query.length < 2) {
    editAssigneeResults.value = []
    editAssigneeSearchOpen.value = false
    return
  }
  const requestId = ++editAssigneeSearchRequestId.value
  try {
    const response = await productionAssigneesService.searchAssignees(query)
    if (requestId !== editAssigneeSearchRequestId.value) return
    editAssigneeResults.value = response?.data || []
    editAssigneeSearchOpen.value = true
  } catch (error) {
    console.error('Error fetching assignees:', error)
    editAssigneeResults.value = []
    editAssigneeSearchOpen.value = false
  }
}

const addEditAssignee = (person: AssigneeOption) => {
  if (editTaskForm.value.assignedTo.find(p => p.id === person.id && p.type === person.type)) return
  editTaskForm.value.assignedTo.push(person)
  editAssigneeResults.value = []
  editAssigneeSearch.value = ''
  editAssigneeSearchOpen.value = false
}

const removeEditAssignee = (person: AssigneeOption) => {
  editTaskForm.value.assignedTo = editTaskForm.value.assignedTo.filter(p => !(p.id === person.id && p.type === person.type))
}

const saveEditTask = async () => {
  if (!editingTask.value) return
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const payload = {
      workstation: editTaskForm.value.workstation,
      title: editTaskForm.value.title,
      quantity: editTaskForm.value.quantity,
      priority: editTaskForm.value.priority,
      due_date: editTaskForm.value.dueDate || null,
      notes: editTaskForm.value.notes || null,
      assignees: editTaskForm.value.assignedTo.map(person => ({ id: person.id, type: person.type }))
    }
    const response = await workOrderTasksService.updateTask(workOrderId, editingTask.value.id, payload)
    const updated = response?.data
    if (updated) {
      const index = intakeTasks.value.findIndex(item => item.id === editingTask.value?.id)
      if (index >= 0) intakeTasks.value[index] = mapIntakeTask(updated)
    }
    closeEditTask()
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const deleteTask = async () => {
  if (!editingTask.value) return
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    await workOrderTasksService.deleteTask(workOrderId, editingTask.value.id)
    intakeTasks.value = intakeTasks.value.filter(item => item.id !== editingTask.value?.id)
    closeEditTask()
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

  const updateTaskStatus = async (
    task: FabricationTask | null,
    status: 'pending' | 'in_progress' | 'paused' | 'completed'
  ) => {
  if (!task || !task.source_task_id) return
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    let statusReason: string | undefined
    if (status === 'paused') {
      statusReason = window.prompt('Reason for pausing this task?')?.trim() || undefined
      if (!statusReason) return
    }
    const response = await workOrderTasksService.updateTask(workOrderId, task.source_task_id, { status, status_reason: statusReason })
    const updated = response?.data
    if (updated) {
      const index = intakeTasks.value.findIndex(item => item.id === task.source_task_id)
      if (index >= 0) {
        intakeTasks.value[index] = mapIntakeTask(updated)
      }
    } else {
      const index = intakeTasks.value.findIndex(item => item.id === task.source_task_id)
      if (index >= 0) {
        intakeTasks.value[index].status = status
      }
    }
    uiMessage.value = { type: 'success', text: `TASK ${status.replace('_', ' ').toUpperCase()}` }
    } catch (error) {
      console.error('Error updating task status:', error)
      uiMessage.value = { type: 'error', text: 'TASK STATUS UPDATE FAILED' }
    }
  }

  const safetyChecksInitialized = new Set<number>()
  let safetyChecksTimer: number | null = null

  const saveTaskSafetyChecks = async (task: FabricationTask) => {
    try {
      const workOrderId = Number(route.params.id)
      if (!workOrderId || !task.source_task_id) return
      const response = await workOrderTasksService.updateTask(workOrderId, task.source_task_id, {
        safety_checks: task.checks
      })
      const updated = response?.data
      if (updated) {
        const index = intakeTasks.value.findIndex(item => item.id === task.source_task_id)
        if (index >= 0) {
          intakeTasks.value[index] = mapIntakeTask(updated)
        }
      }
    } catch (error) {
      console.error('Error saving safety checks:', error)
      uiMessage.value = { type: 'error', text: 'SAFETY CHECK SAVE FAILED' }
    }
  }

  const queueSafetyChecksSave = (task: FabricationTask) => {
    if (safetyChecksTimer) window.clearTimeout(safetyChecksTimer)
    safetyChecksTimer = window.setTimeout(() => {
      saveTaskSafetyChecks(task)
    }, 300)
  }

  watch(
    () => selectedFabricationTask.value?.checks,
    () => {
      const task = selectedFabricationTask.value
      if (!task?.source_task_id) return
      if (!safetyChecksInitialized.has(task.source_task_id)) {
        safetyChecksInitialized.add(task.source_task_id)
        return
      }
      queueSafetyChecksSave(task)
    },
    { deep: true }
  )

const setMidQcStatus = (check: any, status: 'passed' | 'failed') => {
  if (status === 'failed') {
    const reason = window.prompt('Reason for Mid-QC fail?')?.trim()
    if (!reason) {
      uiMessage.value = { type: 'error', text: 'FAIL REASON REQUIRED' }
      return
    }
    check.status = 'failed'
    check.notes = reason
    queueMidQcAutosave()
    return
  }
  check.status = 'passed'
  queueMidQcAutosave()
}

watch(visibleWorkstations, (stations) => {
  if (!stations.find(station => station.key === activeWorkstation.value)) {
    activeWorkstation.value = stations[0]?.key || ''
  }
})

watch(filteredFabricationTasks, (tasks) => {
  if (!tasks.find(task => task.id === selectedFabricationTask.value?.id)) {
    const nextTask = tasks[0] || null
    selectedFabricationTask.value = nextTask
    if (nextTask) {
      selectFabricationTask(nextTask)
    }
  }
})

watch(visibleWorkstations, (stations) => {
  if (!stations.length) return
  const exists = stations.some(station => station.key === activeWorkstation.value)
  if (!exists) {
    activeWorkstation.value = stations[0].key
  }
})

watch(intakeTasks, syncFabricationTasksFromIntake, { deep: true, immediate: true })

watch(assigneeSearch, (value) => {
  if (assigneeSearchTimer.value) {
    clearTimeout(assigneeSearchTimer.value)
  }
  assigneeSearchTimer.value = window.setTimeout(() => {
    if (!value || value.trim().length < 2) {
      assigneeResults.value = []
      assigneeSearchOpen.value = false
      return
    }
    searchAssignees()
  }, 250)
})

watch(editAssigneeSearch, (value) => {
  if (editAssigneeSearchTimer.value) {
    clearTimeout(editAssigneeSearchTimer.value)
  }
  editAssigneeSearchTimer.value = window.setTimeout(() => {
    if (!value || value.trim().length < 2) {
      editAssigneeResults.value = []
      editAssigneeSearchOpen.value = false
      return
    }
    searchEditAssignees()
  }, 250)
})

 


const qcStageOptions = [
  { value: 'mid_production', label: 'Mid‑Fabrication (In‑Process QC)' },
  { value: 'post_fabrication', label: 'Post‑Fabrication' },
  { value: 'post_assembly', label: 'Post‑Assembly' },
  { value: 'post_event', label: 'Post‑Event (Reusable Items)' }
]

const midQcTemplate = [
  { id: 1, category: 'Surface Finish', title: 'Inspect finish quality', notes: 'No glue marks, dents, scratches, or paint runs' },
  { id: 2, category: 'Color Accuracy', title: 'Verify color match', notes: 'Matches brand guidelines, consistent across pieces' },
  { id: 3, category: 'Dimensions', title: 'Check measurements', notes: 'Conforms to design specs (± tolerance allowed)' },
  { id: 4, category: 'Material Quality', title: 'Inspect material integrity', notes: 'No warping, cracks, weak joints, bubbling, or defects' },
  { id: 5, category: 'Text/Print Clarity', title: 'Check print clarity', notes: 'No smudges, bleed, ghosting, misalignment' },
  { id: 6, category: 'Assembly Fit', title: 'Check joints and alignment', notes: 'Straight, flush joints; no gaps or wobbling' },
  { id: 7, category: 'Stability & Durability', title: 'Load test if applicable', notes: 'Weight support, load test if applicable' },
  { id: 8, category: 'Packaging Readiness', title: 'Check packaging prep', notes: 'Properly wrapped, labeled, and protected for transport' },
  { id: 9, category: 'Labeling', title: 'Verify labels', notes: 'Correct job number/client ID, fragile stickers where needed' }
]

const midQcByWorkstation = ref<Record<string, any[]>>({})
const midQcStageByWorkstation = ref<Record<string, string>>({})
const defaultQcStage = 'mid_production'

const qcCheckpoints = ref([
  { id: 1, stage: 'final', category: 'Surface Finish', title: 'Inspect finish quality', notes: 'No glue marks, dents, scratches, or paint runs', status: 'pending', failure_reason: '' },
  { id: 2, stage: 'final', category: 'Color Accuracy', title: 'Verify color match', notes: 'Matches brand guidelines, consistent across pieces', status: 'pending', failure_reason: '' },
  { id: 3, stage: 'final', category: 'Dimensions', title: 'Check measurements', notes: 'Conforms to design specs (± tolerance allowed)', status: 'pending', failure_reason: '' },
  { id: 4, stage: 'final', category: 'Material Quality', title: 'Inspect material integrity', notes: 'No warping, cracks, weak joints, bubbling, or defects', status: 'pending', failure_reason: '' },
  { id: 5, stage: 'final', category: 'Text/Print Clarity', title: 'Check print clarity', notes: 'No smudges, bleed, ghosting, misalignment', status: 'pending', failure_reason: '' },
  { id: 6, stage: 'final', category: 'Assembly Fit', title: 'Check joints and alignment', notes: 'Straight, flush joints; no gaps or wobbling', status: 'pending', failure_reason: '' },
  { id: 7, stage: 'final', category: 'Stability & Durability', title: 'Load test if applicable', notes: 'Weight support, load test if applicable', status: 'pending', failure_reason: '' },
  { id: 8, stage: 'final', category: 'Packaging Readiness', title: 'Check packaging prep', notes: 'Properly wrapped, labeled, and protected for transport', status: 'pending', failure_reason: '' },
  { id: 9, stage: 'final', category: 'Labeling', title: 'Verify labels', notes: 'Correct job number/client ID, fragile stickers where needed', status: 'pending', failure_reason: '' }
])

const qcDefects = computed(() => {
  const defects: { id: string; title: string; notes: string; status: string; meta?: string }[] = []

  Object.entries(midQcByWorkstation.value).forEach(([workstation, checks]) => {
    checks.forEach((check: any, index: number) => {
      if (check.status === 'failed') {
        defects.push({
          id: `mid-${workstation}-${check.category}-${check.title}-${index}`,
          title: `${check.category}: ${check.title}`,
          notes: check.notes || 'No reason provided.',
          status: 'mid-qc failed',
          meta: `Workstation: ${workstations.value.find(w => w.key === workstation)?.label || workstation} · Stage: ${formatQcStage(check.qc_stage || midQcStageByWorkstation.value[workstation])}`
        })
      }
    })
  })

  qcCheckpointsFinal.value.forEach((check: any, index: number) => {
    if (check.status === 'failed') {
      defects.push({
        id: `final-${check.category}-${check.title}-${index}`,
        title: `${check.category}: ${check.title}`,
        notes: check.failure_reason || 'No reason provided.',
        status: 'final-qc failed'
      })
    }
  })

  return defects
})

const qcCheckpointsFinal = computed(() => qcCheckpoints.value.filter(c => c.stage === 'final'))

const qcSummary = computed(() => {
  const total = qcCheckpoints.value.length
  const passed = qcCheckpoints.value.filter(c => c.status === 'passed').length
  const failed = qcCheckpoints.value.filter(c => c.status === 'failed').length
  const pending = total - passed - failed
  const completion = total === 0 ? 0 : Math.round(((passed + failed) / total) * 100)
  return { total, passed, failed, pending, completion }
})

const materialOptions = computed(() => {
  const options: { id: number; label: string; unit: string }[] = []
  materialsData.value.projectElements.forEach(element => {
    element.materials.forEach(material => {
      if (!material.id) return
      options.push({
        id: Number(material.id),
        label: `${material.description} (${element.name})`,
        unit: material.unitOfMeasurement || ''
      })
    })
  })
  return options
})

const mapScrapLog = (log: any): ScrapLog => {
  const elementName = log.element_material?.element?.name || 'Element'
  const materialName = log.element_material?.description || log.material || 'Material'
  return {
    id: log.id,
    element_material_id: log.element_material_id,
    material: `${materialName} (${elementName})`,
    reason: log.reason || 'Unspecified',
    stage: log.stage || 'Materials',
    quantity: Number(log.quantity) || 0,
    unit: log.unit || log.element_material?.unit_of_measurement || '-',
    notes: log.notes || ''
  }
}

const fetchScrapLogs = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderScrapLogsService.getLogs(workOrderId)
    scrapLogs.value = (response?.data || []).map(mapScrapLog)
  } catch (error) {
    console.error('Error fetching scrap logs:', error)
    scrapLogs.value = []
  }
}

const fetchReworks = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderReworksService.getReworks(workOrderId)
    reworkItems.value = (response?.data || []).map(mapReworkItem)
    reworkItems.value.forEach(item => {
      if (item.assignedTo) {
        reworkAssigneeSearch.value[item.id] = item.assignedTo
      }
    })
  } catch (error) {
    console.error('Error fetching reworks:', error)
    reworkItems.value = []
  }
}

const createManualRework = async () => {
  if (!reworkForm.value.title.trim() || !reworkForm.value.reason.trim()) {
    uiMessage.value = { type: 'error', text: 'REWORK TITLE AND REASON REQUIRED' }
    return
  }
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const payload = {
      title: reworkForm.value.title,
      reason: reworkForm.value.reason,
      is_change_request: reworkForm.value.isChangeRequest
    }
    const response = await workOrderReworksService.createRework(workOrderId, payload)
    const created = response?.data
    if (created) {
      reworkItems.value.unshift(mapReworkItem(created))
      reworkForm.value = { title: '', reason: '', isChangeRequest: false }
      uiMessage.value = { type: 'success', text: 'REWORK CREATED' }
    }
  } catch (error) {
    console.error('Error creating rework:', error)
    uiMessage.value = { type: 'error', text: 'REWORK CREATE FAILED' }
  }
}

const addScrapLog = async () => {
  const selected = materialOptions.value.find(option => option.id === scrapForm.value.materialId)
  const workOrderId = Number(route.params.id)
  if (!selected || !workOrderId) return

  try {
    const payload = {
      element_material_id: selected.id,
      stage: scrapForm.value.stage || 'Materials',
      reason: scrapForm.value.reason || undefined,
      quantity: scrapForm.value.quantity || 0,
      unit: scrapForm.value.unit || selected.unit || undefined,
      notes: scrapForm.value.notes || undefined
    }
    const response = await workOrderScrapLogsService.createLog(workOrderId, payload)
    const created = response?.data
    if (created) {
      scrapLogs.value.unshift(mapScrapLog(created))
    }
  } catch (error) {
    console.error('Error creating scrap log:', error)
  }

  scrapForm.value = {
    materialId: 0,
    quantity: 0,
    unit: '',
    reason: '',
    stage: '',
    notes: ''
  }
}

const midQcByWorkstationSummary = computed(() => {
  const summary: Record<string, { passed: number; failed: number; pending: number; status: string; label: string }> = {}
  Object.entries(midQcByWorkstation.value).forEach(([key, checks]) => {
    const passed = checks.filter((c: any) => c.status === 'passed').length
    const failed = checks.filter((c: any) => c.status === 'failed').length
    const pending = checks.filter((c: any) => !c.status || c.status === 'pending').length
    const status = failed > 0 ? 'failed' : pending > 0 ? 'pending' : 'passed'
    const label = status === 'passed' ? 'passed' : status === 'failed' ? 'failed' : 'pending'
    summary[key] = { passed, failed, pending, status, label }
  })
  return summary
})

const formatQcStage = (stage?: string) => {
  const map: Record<string, string> = {
    mid_production: 'Mid‑Fabrication (In‑Process QC)',
    post_fabrication: 'Post‑Fabrication',
    post_assembly: 'Post‑Assembly',
    post_event: 'Post‑Event (Reusable Items)',
    final_qc: 'Final QC'
  }
  if (!stage) return 'Unspecified'
  return map[stage] || stage
}

const setFinalQcStatus = (check: any, status: 'passed' | 'failed') => {
  if (status === 'failed') {
    const reason = window.prompt('Reason for Final QC fail?')?.trim()
    if (!reason) {
      uiMessage.value = { type: 'error', text: 'FAIL REASON REQUIRED' }
      return
    }
    check.status = 'failed'
    check.failure_reason = reason
    queueFinalQcAutosave()
    return
  }
  check.status = 'passed'
  check.failure_reason = ''
  queueFinalQcAutosave()
}

let finalQcSaveTimer: number | null = null
const queueFinalQcAutosave = () => {
  if (finalQcSaveTimer) window.clearTimeout(finalQcSaveTimer)
  finalQcSaveTimer = window.setTimeout(() => {
    saveFinalQcChecks()
  }, 300)
}

const saveFinalQcChecks = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const payload = qcCheckpointsFinal.value.map(check => ({
      category: check.category,
      title: check.title,
      notes: check.notes || null,
      status: check.status,
      failure_reason: check.failure_reason || null
    }))
    const response = await workOrderFinalQcService.saveChecks(workOrderId, payload)
    if (response?.success === false) {
      uiMessage.value = { type: 'error', text: (response?.message || 'FINAL QC SAVE FAILED').toString().toUpperCase() }
      return
    }
    uiMessage.value = { type: 'success', text: 'FINAL QC SAVED' }
    await fetchReworks()
  } catch (error) {
    console.error('Error saving final QC checks:', error)
    uiMessage.value = { type: 'error', text: 'FINAL QC SAVE FAILED' }
  }
}

const midQcSummary = computed(() => {
  const totals = Object.values(midQcByWorkstationSummary.value)
  const passed = totals.reduce((sum, item) => sum + item.passed, 0)
  const failed = totals.reduce((sum, item) => sum + item.failed, 0)
  const pending = totals.reduce((sum, item) => sum + item.pending, 0)
  const total = passed + failed + pending
  const completed = passed + failed
  return { total, completed, passed, failed, pending }
})

watch(
  visibleWorkstations,
  (stations) => {
    stations.forEach(station => {
      if (!midQcByWorkstation.value[station.key]) {
        midQcByWorkstation.value[station.key] = midQcTemplate.map(item => ({
          ...item,
          status: 'pending',
          qc_stage: defaultQcStage
        }))
      }
      if (!midQcStageByWorkstation.value[station.key]) {
        midQcStageByWorkstation.value[station.key] = defaultQcStage
      }
    })
  },
  { immediate: true }
)

onMounted(async () => {
  const workOrderId = Number(route.params.id)
  if (!workOrderId) return

  await fetchWorkOrder(workOrderId)
  if (selectedWorkOrder.value) {
    completedSteps.value = selectedWorkOrder.value.workflow_completed_steps || []
    await Promise.allSettled([
      fetchProjectEnquiry(),
      fetchDesignAssets(),
      fetchScopeElements(),
      fetchMaterials()
    ])
    await fetchScrapLogs()
    await fetchIntakeTasks()
    await fetchMidQcChecks()
    await fetchFinalQcChecks()
    await fetchReworks()
    setActiveStepFromProgress()
  }
})

const fetchProjectEnquiry = async () => {
  try {
    if (selectedWorkOrder.value?.project_enquiry_id && !selectedWorkOrder.value?.projectEnquiry) {
      const enquiryResponse = await Network.get(`/api/projects/enquiries/${selectedWorkOrder.value.project_enquiry_id}`)
      if (enquiryResponse.data) {
        selectedWorkOrder.value.projectEnquiry = enquiryResponse.data
      }
    }
  } catch (error) {
    console.error('Error fetching project enquiry:', error)
  }
}

watch(
  () => selectedWorkOrder.value?.workflow_completed_steps,
  (steps) => {
    if (!steps) return
    completedSteps.value = steps
    setActiveStepFromProgress()
  }
)

const fetchDesignAssets = async () => {
  try {
    let taskId = selectedWorkOrder.value?.enquiry_task_id

    if (!taskId && selectedWorkOrder.value?.project_enquiry_id) {
      const enquiryResponse = await Network.get(`/api/projects/enquiries/${selectedWorkOrder.value.project_enquiry_id}`)
      const data = enquiryResponse.data
      let enquiryTasks = []

      if (data?.data?.enquiry_tasks) enquiryTasks = data.data.enquiry_tasks
      else if (data?.data?.enquiryTasks) enquiryTasks = data.data.enquiryTasks
      else if (data?.enquiry_tasks) enquiryTasks = data.enquiry_tasks
      else if (data?.enquiryTasks) enquiryTasks = data.enquiryTasks

      const designTask = enquiryTasks.find((t: any) => t.task_type === 'Design' || t.task_type === 'Designer' || t.type === 'design')
      if (designTask) taskId = designTask.id.toString()
    }

    if (taskId) {
      const designService = new DesignService()
      const response = await designService.getAssets(taskId.toString())
      if (response.data && Array.isArray(response.data)) {
        designAssets.value = response.data.map(asset => ({
          id: parseInt(asset.id) || 0,
          name: asset.name || asset.original_name || 'Unknown',
          original_name: asset.original_name || asset.name || 'unknown_file',
          file_url: asset.file_url || asset.url || '',
          file_size: asset.file_size || asset.sizeBytes || 0,
          mime_type: asset.mime_type || '',
          isImage: asset.mime_type?.startsWith('image/') || false,
          formattedSize: formatFileSize(asset.file_size || asset.sizeBytes || 0),
          description: asset.description
        }))
      } else {
        designAssets.value = []
      }
    } else {
      designAssets.value = []
    }
  } catch (error) {
    console.error('Error fetching design assets:', error)
    designAssets.value = []
  }
}

const fetchScopeElements = async () => {
  try {
    if (selectedWorkOrder.value?.project_enquiry_id) {
      const materialsData = await MaterialsService.getMaterialsByEnquiry(selectedWorkOrder.value.project_enquiry_id)
      scopeElements.value = materialsData.projectElements.map((element, index) => ({
        id: parseInt(element.id) || index + 1,
        name: element.name,
        quantity: element.materials?.reduce((sum, material) => sum + (material.quantity || 0), 0) || 1,
        status: element.isIncluded ? 'completed' : 'pending',
        notes: element.notes || ''
      }))
    } else {
      scopeElements.value = []
    }
  } catch (error) {
    console.error('Error fetching scope elements:', error)
    scopeElements.value = []
  }
}

const fetchMaterials = async () => {
  try {
    if (selectedWorkOrder.value?.project_enquiry_id) {
      const materialsDataResponse = await MaterialsService.getMaterialsByEnquiry(selectedWorkOrder.value.project_enquiry_id)
      materialsData.value = materialsDataResponse
      const allMaterials: Material[] = []
      materialsDataResponse.projectElements.forEach(element => {
        element.materials.forEach(material => {
          allMaterials.push({
            id: parseInt(material.id) || Math.random(),
            name: material.description,
            quantity: material.quantity,
            unit: material.unitOfMeasurement,
            specifications: material.notes || '',
            source: material.libraryMaterialId ? 'Library' : 'Custom',
            status: material.isIncluded ? 'available' : 'ordered'
          })
        })
      })
      materialsList.value = allMaterials
    } else {
      materialsList.value = []
      materialsData.value = { projectElements: [] }
    }
  } catch (error) {
    console.error('Error fetching materials:', error)
    materialsList.value = []
    materialsData.value = { projectElements: [] }
  }
}

const previewAsset = (asset: DesignAsset) => {
  previewingAsset.value = asset
  assetPreviewVisible.value = true
}

const closeAssetPreview = () => {
  previewingAsset.value = null
  assetPreviewVisible.value = false
}

const downloadAsset = async (asset: DesignAsset) => {
  try {
    let filename = asset.original_name || asset.name || 'download'
    const extension = getFileExtension(asset.original_name || asset.name || '')
    if (extension && !filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`)) {
      filename += `.${extension}`
    }

    const link = document.createElement('a')
    link.href = asset.file_url
    link.download = filename
    link.target = '_blank'

    if (asset.file_url.startsWith('http')) {
      try {
        const response = await fetch(asset.file_url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (fetchError) {
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('Error downloading asset:', error)
  }
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatStatusCategory = (category: string | undefined): string => {
  if (!category) return ''
  const map: Record<string, string> = { in_progress: 'In Progress', approved: 'Approved', completed: 'Completed' }
  return map[category] || category
}

const formatPriority = (priority: string | undefined): string => {
  if (!priority) return ''
  const map: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' }
  return map[priority] || priority
}

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const calculateDaysRemaining = (dateStr: string | null | undefined) => {
  if (!dateStr) return '-'
  const target = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (isNaN(diff)) return '-'
  if (diff < 0) return `${Math.abs(diff)} days overdue`
  return `${diff} days left`
}

const getStatusClass = (status?: string) => {
  const classes = {
    in_progress: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    approved: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  }
  return classes[status as keyof typeof classes] || 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700'
}

const getPriorityClass = (priority?: string) => {
  const classes = {
    low: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300',
    high: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    urgent: 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  }
  return classes[priority as keyof typeof classes] || 'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700'
}

const proceedToNextStep = () => {
  if (activeStepIndex.value < workflowSteps.value.length - 1) {
    const nextKey = workflowSteps.value[activeStepIndex.value + 1].key
    if (canAccessStep(nextKey)) {
      activeStep.value = nextKey
    } else {
      uiMessage.value = { type: 'error', text: 'COMPLETE PREVIOUS STEP FIRST' }
    }
  }
}

const canAccessStep = (stepKey?: string) => {
  if (!stepKey) return false
  if (stepKey === 'rework') return true
  const ordered = workflowSteps.value
    .map(step => step.key)
    .filter(key => key !== 'rework')
  const index = ordered.indexOf(stepKey)
  if (index <= 0) return true
  const previousKey = ordered[index - 1]
  return completedStepsSet.value.has(previousKey)
}

const getStepLockReason = (stepKey?: string) => {
  if (!stepKey) return ''
  if (stepKey === 'rework') return ''
  const ordered = workflowSteps.value
    .map(step => step.key)
    .filter(key => key !== 'rework')
  const index = ordered.indexOf(stepKey)
  if (index <= 0) return ''
  const previousKey = ordered[index - 1]
  if (completedStepsSet.value.has(previousKey)) return ''
  const previousLabel = workflowSteps.value.find(step => step.key === previousKey)?.label || previousKey
  return `Complete ${previousLabel} first`
}

const handleStepSelect = (stepKey: string) => {
  if (!canAccessStep(stepKey)) {
    uiMessage.value = { type: 'error', text: 'COMPLETE PREVIOUS STEP FIRST' }
    return
  }
  activeStep.value = stepKey
}

const setActiveStepFromProgress = () => {
  const orderedSteps = workflowSteps.value.map(step => step.key)
  const completed = completedSteps.value

  if (!completed.length) {
    activeStep.value = orderedSteps[0]
    return
  }

  const completedIndexes = completed
    .map(step => orderedSteps.indexOf(step))
    .filter(index => index >= 0)
  const lastIndex = completedIndexes.length ? Math.max(...completedIndexes) : -1

  if (lastIndex >= orderedSteps.length - 1) {
    activeStep.value = orderedSteps[orderedSteps.length - 1]
    return
  }

  activeStep.value = orderedSteps[lastIndex + 1]
}

const markStepComplete = async (stepKey: string) => {
  if (completedStepsSet.value.has(stepKey)) return
  const workOrderId = Number(route.params.id)
  if (!workOrderId) return

  const next = [...completedSteps.value, stepKey]

  try {
    await updateWorkOrder(workOrderId, { workflow_completed_steps: next })
    completedSteps.value = next
    setActiveStepFromProgress()
  } catch (error) {
    console.error('Error updating workflow steps:', error)
    uiMessage.value = { type: 'error', text: 'STEP GATE NOT MET OR OUT OF SEQUENCE' }
  }
}

const projectDeliverables = computed<string[]>(() => {
  const scope = selectedWorkOrder.value?.projectEnquiry?.project_scope
  if (!scope) return []

  if (Array.isArray(scope)) {
    return scope.filter(item => item && item.trim && item.trim())
  }

  if (typeof scope === 'string') {
    try {
      const parsed = JSON.parse(scope)
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.trim && item.trim())
      }
    } catch {
      return []
    }
  }

  return []
})

const projectProgress = computed(() => {
  const status = selectedWorkOrder.value?.projectEnquiry?.status
  if (!status) return 0
  if (status === 'completed') return 100
  if (status === 'cancelled') return 0

  const weights: Record<string, number> = {
    client_registered: 5,
    enquiry_logged: 10,
    site_survey_completed: 25,
    design_completed: 40,
    quote_prepared: 50,
    quote_approved: 60,
    in_progress: 75
  }

  return weights[status] || 0
})
const fetchMidQcChecks = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderMidQcService.getChecks(workOrderId)
    const checks = response?.data || []
    if (!Array.isArray(checks) || checks.length === 0) return

      checks.forEach((check: any) => {
        if (!midQcByWorkstation.value[check.workstation]) {
          midQcByWorkstation.value[check.workstation] = midQcTemplate.map(item => ({
            ...item,
            status: 'pending',
            qc_stage: check.qc_stage || defaultQcStage
          }))
        }
        if (check.qc_stage) {
          midQcStageByWorkstation.value[check.workstation] = check.qc_stage
        }
        const target = midQcByWorkstation.value[check.workstation].find((item: any) =>
          item.category === check.category && item.title === check.title
        )
        if (target) {
          target.status = check.status
          target.notes = check.notes || target.notes
          target.qc_stage = check.qc_stage || target.qc_stage || defaultQcStage
        }
      })
  } catch (error) {
    console.error('Error fetching mid-QC checks:', error)
  }
}

const fetchFinalQcChecks = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const response = await workOrderFinalQcService.getChecks(workOrderId)
    const checks = response?.data || []
    if (!Array.isArray(checks) || checks.length === 0) return

    checks.forEach((check: any) => {
      const target = qcCheckpoints.value.find(item =>
        item.category === check.category && item.title === check.title
      )
      if (target) {
        target.status = check.status
        target.failure_reason = check.failure_reason || ''
      }
    })
  } catch (error) {
    console.error('Error fetching final QC checks:', error)
  }
}

const saveMidQcChecks = async () => {
  try {
    const workOrderId = Number(route.params.id)
    if (!workOrderId) return
    const payload = Object.entries(midQcByWorkstation.value).flatMap(([workstation, checks]) =>
      checks.map((check: any) => ({
        workstation,
        qc_stage: midQcStageByWorkstation.value[workstation] || check.qc_stage || defaultQcStage,
        category: check.category,
        title: check.title,
        notes: check.notes || null,
        status: check.status
      }))
    )
    await workOrderMidQcService.saveChecks(workOrderId, payload)
    uiMessage.value = { type: 'success', text: 'MID-QC SAVED' }
    await fetchReworks()
  } catch (error) {
    console.error('Error saving mid-QC checks:', error)
    uiMessage.value = { type: 'error', text: 'MID-QC SAVE FAILED' }
  }
}

let midQcSaveTimer: number | null = null
const queueMidQcAutosave = () => {
  if (midQcSaveTimer) window.clearTimeout(midQcSaveTimer)
  midQcSaveTimer = window.setTimeout(() => {
    saveMidQcChecks()
  }, 300)
}
</script>

<style scoped>
.modern-datatable {
  border-radius: 0.75rem;
  overflow: hidden;
}
</style>
