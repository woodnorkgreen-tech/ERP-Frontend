<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-10 font-inter text-slate-900 dark:text-slate-100">
    <div class="max-w-auto mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Minimalist Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <nav class="flex mb-2" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <li><router-link to="/hr" class="hover:text-blue-500 transition-colors">HR</router-link></li>
              <li><i class="mdi mdi-chevron-right text-xs"></i></li>
              <li class="text-slate-500 dark:text-slate-300">{{ activeMainTab === 'roster' ? 'Personnel Registry' : 'Resource Management' }}</li>
            </ol>
          </nav>
            <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              {{ activeMainTab === 'roster' ? 'Employee' : 'Technical' }} <span class="text-blue-600">{{ activeMainTab === 'roster' ? 'Hub' : 'Pool' }}</span>
            </h1>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ activeMainTab === 'roster' ? 'Central command for workforce management, payroll nodes, and career lifecycles.' : 'Registry for specialized external teams, freelancers, and technical freelancers.' }}</p>
         </div>
         
         <div class="flex flex-wrap gap-3">
            <button
              v-if="activeMainTab === 'roster'"
              @click="showAddModal = true"
              class="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.18em] shadow-xl shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all"
            >
              <i class="mdi mdi-account-plus-outline text-lg"></i>
              Enroll Employee
            </button>
           <!-- <button
             @click="showDeptsModal = true"
             class="flex items-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
           >
             <i class="mdi mdi-door-open text-lg"></i>
             Departments
           </button> -->
         </div>
      </div>
      
      <!-- Premium View Switcher -->
      <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2rem] w-fit border border-slate-200 dark:border-slate-800">
         <button 
           @click="activeMainTab = 'roster'"
           :class="[
             'px-10 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3',
             activeMainTab === 'roster' 
               ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xl border border-slate-200 dark:border-slate-700' 
               : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
           ]"
         >
           <i class="mdi mdi-account-group-outline text-lg"></i>
           Employee Registry
         </button>
         <button 
           @click="activeMainTab = 'technical'"
           :class="[
             'px-10 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3',
             activeMainTab === 'technical' 
               ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xl border border-slate-200 dark:border-slate-700' 
               : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
           ]"
         >
           <i class="mdi mdi-hammer-wrench text-lg"></i>
           TechnicalResource Pool
         </button>
      </div>

      <div v-if="activeMainTab === 'roster'" class="space-y-6">
        <!-- Simple Employee Search -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative z-20">
        <div class="relative w-full md:w-96 flex-shrink-0">
          <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search employees by name, email or ID..."
            class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-700 dark:text-slate-300"
          />
        </div>
        <div class="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <select
            v-model="filters.department"
            class="w-full md:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="">All Departments</option>
            <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
          <select
            v-model="filters.status"
            class="w-full md:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="">Any Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      <!-- Tab-Based Personnel Registry -->
      <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
        <p class="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Syncing Personnel Nodes...</p>
      </div>

      <div v-else-if="error" class="p-20 text-center text-red-500 font-bold bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <i class="mdi mdi-alert-circle-outline text-4xl mb-2 block"></i>
        {{ error }}
      </div>

      <div v-else class="space-y-8 pb-20">
        <!-- Enterprise Tab Navigation -->
        <div class="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
           <button 
             @click="selectedDeptId = 'all'"
             :class="[
               'px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-tight transition-all flex items-center gap-3 shrink-0',
               selectedDeptId === 'all' 
                 ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                 : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
             ]"
           >
             <i class="mdi mdi-view-dashboard-outline text-lg text-blue-500"></i>
             All Employees
             <span :class="['px-2 py-0.5 rounded-md text-[10px] font-black', selectedDeptId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500']">{{ employees.length }}</span>
           </button>

           <button 
             v-for="group in groupedEmployees" 
             :key="group.department.id || 'unassigned'"
             @click="selectedDeptId = group.department.id || 'unassigned'"
             :class="[
               'px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-tight transition-all flex items-center gap-3 shrink-0',
               selectedDeptId === (group.department.id || 'unassigned')
                 ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' 
                 : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
             ]"
           >
             <i class="mdi mdi-office-building text-lg" :class="selectedDeptId === (group.department.id || 'unassigned') ? 'text-white' : 'text-blue-500'"></i>
             {{ group.department.name }}
             <span :class="['px-2 py-0.5 rounded-md text-[10px] font-black', selectedDeptId === (group.department.id || 'unassigned') ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-500']">{{ group.members.length }}</span>
           </button>
        </div>

        <div v-if="activeGroup" class="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <!-- Active Tab Header -->
           <div class="flex items-center justify-between mb-8 px-6 py-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-5">
                 <div class="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm text-blue-600">
                    <i class="mdi mdi-shield-account text-3xl"></i>
                 </div>
                 <div>
                    <h3 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                       {{ activeGroup.department.name }}
                    </h3>
                    <div class="flex items-center gap-3 mt-2.5">
                       <span class="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">Employees</span>
                       <span class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                       <span class="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">{{ activeGroup.members.length }} Active Employees</span>
                    </div>
                 </div>
              </div>
           </div>

           <!-- High-Density Registry Table -->
           <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div class="overflow-x-auto !overflow-y-visible pb-24">
               <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-slate-50/50 dark:bg-slate-900/50">
                      <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">Operational Identity</th>
                      <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">Structural Node</th>
                      <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">Financial Stream</th>
                      <th class="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800">Protocol Status</th>
                      <th class="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-800 sticky right-0 bg-white dark:bg-slate-950 z-30 shadow-[-15px_0_20px_-5px_rgba(0,0,0,0.05)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
                    <tr v-for="employee in activeGroup.members" :key="employee.id" class="hover:bg-blue-50/30 dark:hover:bg-blue-600/5 transition-all group" :class="{ 'z-50 relative': openDropdownId === employee.id }">
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="flex items-center gap-5">
                          <div class="relative group-hover:scale-110 transition-transform duration-500">
                            <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-black text-base text-slate-400 shadow-inner border border-slate-100 dark:border-slate-800 group-hover:border-blue-500/30">
                              {{ employee.first_name[0] }}{{ employee.last_name[0] }}
                            </div>
                            <div :class="[
                              'absolute -top-1.5 -right-1.5 w-5 h-5 border-4 border-white dark:border-slate-950 rounded-full shadow-lg',
                              employee.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-400 shadow-slate-400/20'
                            ]"></div>
                          </div>
                          <div>
                            <div @click="viewEmployee(employee)" class="font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 flex items-center gap-2 text-base cursor-pointer hover:text-blue-600 transition-colors">
                              {{ employee.first_name }} {{ employee.last_name }}
                              <i v-if="employee.is_on_probation" class="mdi mdi-shield-clock text-amber-500 text-sm" title="On Probation"></i>
                            </div>
                            <div class="text-[10px] text-slate-400 font-bold tracking-widest leading-none flex items-center gap-2">
                              <span class="text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">ID-{{ employee.id.toString().padStart(4, '0') }}</span>
                              <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                              <span class="lowercase">{{ employee.email }}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="flex flex-col gap-1">
                           <span class="text-[13px] font-black text-slate-800 dark:text-slate-200 tracking-tight">{{ employee.position }}</span>
                           <div class="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <i class="mdi mdi-map-marker-radius text-blue-500/50"></i>
                              {{ employee.department?.name || 'Unassigned' }}
                           </div>
                        </div>
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="flex flex-col gap-1">
                           <span class="text-[13px] font-black text-slate-950 dark:text-white leading-none">KES {{ employee.salary?.toLocaleString() }}</span>
                           <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md w-fit">{{ employee.payment_method?.replace('_', ' ') || 'STANDARD' }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap text-center">
                        <span
                          :class=" [
                            'px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm inline-block',
                            employee.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-500/20' : 
                            employee.status === 'inactive' ? 'bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 
                            employee.status === 'on-leave' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-500/20' :
                            'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-500/20'
                          ]"
                        >
                          {{ employee.status }}
                        </span>
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap text-right sticky right-0 bg-white dark:bg-slate-950 group-hover:bg-blue-50/50 dark:group-hover:bg-slate-900/80 shadow-[-15px_0_20px_-5px_rgba(0,0,0,0.05)] transition-all z-20">
                         <div class="relative flex justify-end">
                           <button
                             @click.stop="toggleDropdown($event, employee.id)"
                             :class="['actions-trigger inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.18em] transition-all', openDropdownId === employee.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700']"
                           >
                             <i class="mdi mdi-tune-variant text-lg"></i>
                             <span>Execute</span>
                           </button>

                           <Teleport to="body">
                             <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95 -translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95 -translate-y-4">
                               <div
                                 v-if="openDropdownId === employee.id"
                                 :style="{ position: 'absolute', top: dropdownCoords.top + 'px', left: dropdownCoords.left + 'px' }"
                                 class="w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-[99999] overflow-hidden origin-top-right ring-1 ring-black/5"
                               >
                                 <!-- Profile Preview -->
                                 <div class="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                   <p class="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight uppercase mb-1">{{ employee.first_name }} {{ employee.last_name }}</p>
                                   <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase truncate">{{ employee.position }}</p>
                                 </div>
  
                                 <!-- Command Grid -->
                                 <div class="p-3 grid grid-cols-1 gap-2">
                                   <button @click.stop="openActionModal(employee); openDropdownId = null" class="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 group/item transition-all">
                                     <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all">
                                        <i class="mdi mdi-flash text-xl"></i>
                                     </div>
                                     <div class="text-left">
                                        <p class="text-[11px] font-black text-slate-900 dark:text-white uppercase leading-none mb-1">HR Actions</p>
                                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Promotion / Warning</p>
                                     </div>
                                   </button>

                                   <button @click.stop="viewEmployee(employee); openDropdownId = null" class="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item transition-all">
                                     <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all">
                                        <i class="mdi mdi-account-details text-xl"></i>
                                     </div>
                                     <div class="text-left">
                                        <p class="text-[11px] font-black text-slate-900 dark:text-white uppercase leading-none mb-1">View Bio</p>
                                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Profile & Files</p>
                                     </div>
                                   </button>

                                   <button @click.stop="editEmployee(employee); openDropdownId = null" class="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group/item transition-all">
                                     <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all">
                                        <i class="mdi mdi-account-edit text-xl"></i>
                                     </div>
                                     <div class="text-left">
                                        <p class="text-[11px] font-black text-slate-900 dark:text-white uppercase leading-none mb-1">Modify Node</p>
                                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Update Identity</p>
                                     </div>
                                   </button>

                                   <div class="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                                      <button @click.stop="deleteEmployee(employee); openDropdownId = null" class="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 group/item transition-all">
                                        <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all">
                                           <i class="mdi mdi-trash-can text-xl"></i>
                                        </div>
                                        <div class="text-left">
                                           <p class="text-[11px] font-black text-red-600 uppercase leading-none mb-1">Purge Record</p>
                                           <p class="text-[9px] text-red-400 font-bold uppercase tracking-widest">Permanent Deletion</p>
                                        </div>
                                      </button>
                                   </div>
                                 </div>
                               </div>
                             </Transition>
                           </Teleport>
                         </div>
                      </td>
                    </tr>
                  </tbody>
               </table>
             </div>
           </div>
        </div>

    <!-- HR Action Engine -->
    <div v-if="showActionModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]"></div>
        
        <div class="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h2 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Personnel <span class="text-purple-600">Action</span>
            </h2>
            <p class="text-[11px] font-black text-slate-400 mt-2 tracking-tight">Record an HR action</p>
          </div>
          <button @click="showActionModal = false" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all shadow-inner border border-slate-100 dark:border-slate-800">
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <div class="space-y-8 relative z-10">
          <div class="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-2xl font-black text-purple-600">
              {{ selectedEmployee?.first_name[0] }}{{ selectedEmployee?.last_name[0] }}
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {{ selectedEmployee?.first_name }} {{ selectedEmployee?.last_name }}
              </h3>
              <p class="text-[11px] font-bold text-slate-400 mt-2 tracking-tight flex items-center gap-2">
                <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 uppercase leading-none">{{ selectedEmployee?.employee_id }}</span>
                <span class="w-1 h-1 rounded-full bg-slate-200"></span>
                <span>{{ selectedEmployee?.position }}</span>
              </p>
            </div>
          </div>
        </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Action Type</label>
              <select v-model="selectedActionType" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all">
                <option value="promotion">Promotion</option>
                <option value="transfer">Transfer</option>
                <option value="salary_update">Salary Change</option>
                <option value="warning">Warning</option>
                <option value="termination">Termination</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Effective Date</label>
              <input v-model="actionFormData.effective_date" type="date" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black outline-none focus:ring-2 focus:ring-purple-500/20 shadow-inner transition-all" />
            </div>
          </div>
 
          <!-- Dynamic Fields Based on Action -->
          <div v-if="selectedActionType === 'promotion' || selectedActionType === 'transfer'" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">New Job Title</label>
              <input v-model="actionFormData.new_data.position" type="text" placeholder="Target Role" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black outline-none focus:ring-2 focus:ring-purple-500/20 shadow-inner transition-all" />
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">New Department</label>
              <select v-model="actionFormData.new_data.department_id" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all">
                <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
          </div>
 
          <div v-if="selectedActionType === 'salary_update' || selectedActionType === 'promotion'" class="animate-in fade-in slide-in-from-top-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">New Base Salary</label>
            <input v-model="actionFormData.new_data.salary" type="number" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black outline-none focus:ring-2 focus:ring-purple-500/20 shadow-inner transition-all" />
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block pl-1">Reason for Action</label>
            <textarea v-model="actionFormData.reason" rows="3" placeholder="Enter reason for this action..." class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-medium focus:ring-2 focus:ring-purple-500/20 shadow-inner outline-none transition-all"></textarea>
          </div>

          <div v-if="actionError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 font-black text-xs uppercase tracking-widest italic">
            {{ actionError }}
          </div>
          <div v-if="actionSuccess" class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-600 font-black text-xs uppercase tracking-widest">
            {{ actionSuccess }}
          </div>

          <div class="flex justify-end gap-3 pt-8 border-t border-slate-50 dark:border-slate-800">
            <button @click="showActionModal = false" class="px-8 py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="recording">Cancel</button>
            <button @click="handleRecordAction" :disabled="recording" class="px-12 py-3.5 bg-slate-900 dark:bg-purple-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-purple-500/10 active:scale-95 flex items-center gap-3 transition-all">
              <i v-if="recording" class="mdi mdi-loading mdi-spin text-lg"></i>
              {{ recording ? 'Recording...' : 'Save Action' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Detail Modal (Integrated View/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-[1400px] w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-300">
        <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
        
        <div class="flex items-center justify-between mb-12 relative z-10">
          <div class="flex items-end gap-10">
            <div>
              <h2 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                {{ modalMode === 'view' ? 'Personnel' : 'Edit' }} <span class="text-blue-600">Profile</span>
              </h2>
              <p class="text-[11px] font-black text-slate-400 mt-2 tracking-tight">Employee Information</p>
            </div>
            
            <div v-if="modalMode === 'view'" class="flex gap-10 pb-1">
              <button @click="activeTab = 'bio'" :class="['text-[11px] font-black tracking-tight transition-all relative py-2', activeTab === 'bio' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-400 hover:text-slate-600']">Personal Info</button>
              <button @click="activeTab = 'history'" :class="['text-[11px] font-black tracking-tight transition-all relative py-2', activeTab === 'history' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-400 hover:text-slate-600']">Job History</button>
              <button @click="activeTab = 'leave'" :class="['text-[11px] font-black tracking-tight transition-all relative py-2', activeTab === 'leave' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-400 hover:text-slate-600']">Leave Balances</button>
              <button @click="activeTab = 'vault'" :class="['text-[11px] font-black tracking-tight transition-all relative py-2', activeTab === 'vault' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-400 hover:text-slate-600']">Documents</button>
              <button @click="activeTab = 'payroll'" :class="['text-[11px] font-black tracking-tight transition-all relative py-2', activeTab === 'payroll' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-400 hover:text-slate-600']">Payroll Details</button>
            </div>
          </div>
          <button @click="closeModal" class="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all shadow-inner border border-slate-100 dark:border-slate-800">
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
          <!-- View Profile Logic -->
          <div v-if="modalMode === 'view'">
            <div v-if="activeTab === 'bio'" class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div class="md:col-span-1 space-y-6">
                  <div class="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                     <div class="w-28 h-28 rounded-[2rem] bg-blue-600/10 mx-auto flex items-center justify-center text-5xl font-black text-blue-600 shadow-xl mb-6 shadow-blue-500/10">
                       {{ selectedEmployee?.first_name[0] }}{{ selectedEmployee?.last_name[0] }}
                     </div>
                     <h3 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{{ selectedEmployee?.first_name }} {{ selectedEmployee?.last_name }}</h3>
                     <p class="text-[11px] font-bold text-slate-500 mt-2 tracking-tight">{{ selectedEmployee?.position }}</p>
                  </div>
                  <div class="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                     <p class="text-xs font-black text-blue-500/60 uppercase tracking-widest mb-2">Direct Supervisor</p>
                     <div v-if="selectedEmployee?.manager" class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black shadow-sm">
                          {{ selectedEmployee.manager.first_name[0] }}{{ selectedEmployee.manager.last_name[0] }}
                        </div>
                        <div>
                          <p class="text-xs font-black leading-none mb-1">{{ selectedEmployee.manager.first_name }} {{ selectedEmployee.manager.last_name }}</p>
                          <p class="text-xs font-bold text-slate-400 leading-none">{{ selectedEmployee.manager.position }}</p>
                        </div>
                     </div>
                     <p v-else class="text-xs font-bold text-slate-400 italic">No Supervisor Assigned</p>
                  </div>
               </div>

                <div class="md:col-span-2 space-y-10">
                  <div class="bg-slate-50/50 dark:bg-slate-800/30 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
                     <h4 class="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                        <i class="mdi mdi-account-tie text-xl"></i> Job Details
                     </h4>
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-10">
                        <div v-for="(val, label) in {
                          'Employee ID': selectedEmployee?.employee_id,
                          'Email': selectedEmployee?.email,
                          'Phone': selectedEmployee?.phone || 'N/A',
                          'Department': selectedEmployee?.department?.name || 'Unassigned',
                          'Employment Type': selectedEmployee?.employment_type.toUpperCase(),
                          'Probation Period': selectedEmployee?.is_on_probation ? `Until ${formatDate(selectedEmployee?.probation_end_date || '')}` : 'Completed',
                          'Contract End': selectedEmployee?.contract_end_date ? formatDate(selectedEmployee?.contract_end_date) : 'Infinite',
                          'Hire Date': formatDate(selectedEmployee?.hire_date || ''),
                          'Current Status': selectedEmployee?.status.toUpperCase()
                        }" :key="label" class="space-y-2">
                           <p class="text-[10px] font-black text-slate-400 mt-1 tracking-tight">{{ label }}</p>
                           <p class="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">{{ val }}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div class="bg-white dark:bg-slate-800/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 relative overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
                     <div class="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[80px] -mr-20 -mt-20"></div>
                     <h4 class="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-10 flex items-center gap-3 relative z-10">
                        <i class="mdi mdi-bank text-xl"></i> Payroll Settings
                     </h4>
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-10 relative z-10">
                        <div v-for="(val, label) in {
                          'Base Salary': 'KES ' + (selectedEmployee?.salary?.toLocaleString() || '0'),
                          'Payment Method': (selectedEmployee?.payment_method?.replace('_', ' ') || 'BANK').toUpperCase(),
                          'Bank Name': selectedEmployee?.bank_name || 'N/A',
                          'Bank Code': selectedEmployee?.bank_code || 'N/A',
                          'Branch Name': selectedEmployee?.bank_branch || 'N/A',
                          'Account Number': selectedEmployee?.account_number || 'N/A'
                        }" :key="label" class="space-y-2">
                           <p class="text-[10px] font-black text-slate-400 mt-1 tracking-tight">{{ label }}</p>
                           <p class="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">{{ val }}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div v-if="selectedEmployee?.performance_rating" class="p-10 bg-amber-500/5 rounded-[3rem] border border-amber-500/10 shadow-sm relative overflow-hidden">
                     <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] -mr-16 -mt-16"></div>
                     <h4 class="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10">
                        <i class="mdi mdi-star-circle text-xl"></i> Performance Rating
                     </h4>
                     <div class="flex items-center gap-8 relative z-10">
                        <div class="flex gap-2.5 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-amber-500/5 border border-slate-100 dark:border-slate-800">
                           <div v-for="i in 5" :key="i" :class="['w-6 h-6 rounded-lg flex items-center justify-center transition-all', i <= selectedEmployee.performance_rating ? 'bg-amber-400 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-200']">
                              <i class="mdi mdi-star text-sm"></i>
                           </div>
                        </div>
                        <div>
                           <span class="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{{ selectedEmployee.performance_rating }}.0 Evaluation Score</span>
                           <p class="text-[11px] font-bold text-slate-400 mt-2 tracking-tight">Current Rating</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Career History Timeline -->
             <div v-else-if="activeTab === 'history'" class="animate-in fade-in slide-in-from-left-4 duration-300 space-y-10 max-w-4xl mx-auto py-8">
                <div v-if="loadingActions" class="p-24 text-center">
                   <div class="w-10 h-10 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
                   <p class="text-[11px] font-black uppercase tracking-widest text-slate-400">Loading History...</p>
                </div>
                <div v-else-if="selectedEmployeeActions.length === 0" class="p-24 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                   <div class="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-6 text-slate-300">
                      <i class="mdi mdi-history text-4xl"></i>
                   </div>
                   <h3 class="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">No History Found</h3>
                   <p class="text-xs text-slate-500 max-w-xs mx-auto font-medium">No HR actions have been recorded for this employee yet.</p>
                </div>
               <div v-else class="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                  <div v-for="action in selectedEmployeeActions" :key="action.id" class="relative">
                     <div class="absolute -left-8 top-1 w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border-2 border-purple-500 z-10 flex items-center justify-center shadow-sm">
                        <i :class="['mdi text-xs text-purple-600', 
                          action.action_type === 'promotion' ? 'mdi-trending-up' : 
                          action.action_type === 'transfer' ? 'mdi-swap-horizontal' : 
                          action.action_type === 'warning' ? 'mdi-alert-decagram' : 
                          action.action_type === 'salary_update' ? 'mdi-cash-plus' : 'mdi-account-remove']"></i>
                     </div>
                     <div class="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-500/30 transition-all group">
                        <div class="flex justify-between items-start mb-3">
                           <div>
                              <span class="text-xs font-black uppercase tracking-[0.2em] text-purple-500 mb-1 block">{{ action.action_type.replace('_', ' ') }}</span>
                              <h5 class="text-sm font-black text-slate-900 dark:text-white leading-none">
                                {{ action.action_type === 'promotion' ? 'Promoted' : 
                                   action.action_type === 'transfer' ? 'Transferred' : 
                                   action.action_type === 'warning' ? 'Warning Issued' : 
                                   action.action_type === 'salary_update' ? 'Salary Change' : 'Terminated' }}
                              </h5>
                           </div>
                           <span class="text-xs font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-800">
                             {{ formatDate(action.effective_date) }}
                           </span>
                        </div>
                        
                        <div class="space-y-4">
                           <p class="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">"{{ action.reason || 'No specific justification recorded.' }}"</p>
                           
                           <div v-if="Object.keys(action.new_data || {}).length > 0" class="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                              <div v-for="(newVal, key) in action.new_data" :key="key" class="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                 <span class="text-xs font-black uppercase text-slate-400 mr-1">{{ key }}:</span>
                                 <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ newVal }}</span>
                              </div>
                           </div>
                        </div>

                        <div class="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-3 border-t border-slate-100 dark:border-slate-800">
                           <div class="flex items-center gap-2">
                              <div class="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black uppercase">
                                {{ action.recorder?.name?.[0] || 'A' }}
                              </div>
                              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Authorized by {{ action.recorder?.name || 'System' }}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- Documents -->
            <div v-else-if="activeTab === 'vault'" class="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8 max-w-5xl mx-auto py-4">
               
               <!-- Upload Zone -->
               <div class="bg-slate-50 dark:bg-slate-800/20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 transition-all hover:border-blue-500/30 group shadow-inner">
                  <div class="flex flex-col md:flex-row gap-8 items-center">
                     <div class="flex-1 w-full relative">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2.5 block">Save Under Category</label>
                        <select v-model="uploadType" class="w-full px-6 py-4.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none transition-all">
                          <option value="contract">Contract</option>
                          <option value="id_passport">ID / Passport</option>
                          <option value="academic">Academic Docs</option>
                          <option value="professional">Professional Docs</option>
                          <option value="other">Other Docs</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-5 pt-6 pointer-events-none">
                           <i class="mdi mdi-chevron-down text-slate-400"></i>
                        </div>
                     </div>
                     <div class="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl p-2.5 shadow-sm flex items-center mt-6 border border-slate-100 dark:border-slate-800">
                        <input type="file" id="vault_file_upload" @change="handleDocSelect" class="w-full text-[10px] text-slate-500 file:mr-5 file:py-3.5 file:px-8 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor:pointer focus:outline-none transition-all" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                     </div>
                     <div class="pt-6 shrink-0">
                        <button @click="handleDocUpload" :disabled="!uploadFile || uploadingDoc" class="px-10 py-4.5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 whitespace-nowrap transition-all">
                          <i v-if="uploadingDoc" class="mdi mdi-loading mdi-spin text-lg"></i>
                          <i v-else class="mdi mdi-cloud-upload text-lg"></i>
                          {{ uploadingDoc ? 'Uploading...' : 'Upload Document' }}
                        </button>
                     </div>
                  </div>
               </div>

               <!-- Document Grid -->
               <div>
                  <h4 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 flex items-center justify-between">
                     <span>Uploaded Documents</span>
                     <span class="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-lg text-xs font-black">{{ documents.length }} Files</span>
                  </h4>

                  <div v-if="loadingDocs" class="p-16 text-center">
                     <div class="w-10 h-10 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                     <p class="text-xs font-black uppercase tracking-widest text-slate-400">Loading Documents...</p>
                  </div>
                  
                  <div v-else-if="documents.length === 0" class="p-24 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                     <div class="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-6 text-slate-300">
                        <i class="mdi mdi-folder-lock-outline text-4xl"></i>
                     </div>
                     <h3 class="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">No Documents Found</h3>
                     <p class="text-xs text-slate-500 max-w-xs mx-auto font-medium">No documents have been uploaded for this employee yet Upload contracts or credentials above.</p>
                  </div>

                  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div v-for="doc in documents" :key="doc.id" class="p-5 bg-white dark:bg-slate-800 border-2 border-transparent hover:border-blue-500/20 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div class="flex items-start gap-4 mb-2">
                           <div :class="[
                              'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner',
                              doc.document_type === 'contract' ? 'bg-emerald-500/10 text-emerald-500' :
                              doc.document_type === 'id_passport' ? 'bg-blue-500/10 text-blue-500' :
                              doc.document_type === 'academic' ? 'bg-purple-500/10 text-purple-500' :
                              doc.document_type === 'professional' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-slate-500/10 text-slate-500'
                           ]">
                              <i :class="[
                                 'mdi text-2xl',
                                 doc.document_type === 'contract' ? 'mdi-file-sign' :
                                 doc.document_type === 'id_passport' ? 'mdi-card-account-details-outline' :
                                 doc.document_type === 'academic' ? 'mdi-certificate-outline' :
                                 doc.document_type === 'professional' ? 'mdi-shield-star-outline' :
                                 'mdi-file-document-outline'
                              ]"></i>
                           </div>
                           <div class="flex-1 min-w-0 pt-1">
                              <p class="text-xs font-black text-slate-900 dark:text-white truncate mb-1 pr-2" :title="doc.name">{{ doc.name }}</p>
                              <p class="text-xs font-black uppercase tracking-widest text-slate-400">{{ (doc.document_type || 'Unknown').replace('_', ' ') }}</p>
                           </div>
                        </div>
                        
                        <div class="flex items-center justify-between mt-4 pl-1 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                           <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              <i class="mdi mdi-harddisk mr-1"></i> {{ (doc.size || 0) / 1024 < 1024 ? Math.round((doc.size || 0) / 1024) + ' KB' : (Math.round((doc.size || 0) / 1024 / 102.4) / 10) + ' MB' }}
                           </span>
                           <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              {{ new Date(doc.created_at).toLocaleDateString() }}
                           </span>
                        </div>

                        <!-- Directive Overlay -->
                        <div class="absolute inset-x-0 bottom-0 top-0 bg-slate-900/95 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-md">
                           <button @click="downloadDocument(selectedEmployee!.id, doc.id, doc.name)" class="w-3/4 py-3 rounded-xl bg-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                              <i class="mdi mdi-download text-base"></i> Download
                           </button>
                           <button @click="deleteDocument(selectedEmployee!.id, doc.id)" class="w-3/4 py-3 rounded-xl bg-slate-800 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-red-500">
                              <i class="mdi mdi-delete-outline text-base"></i> Delete
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <!-- Leave Balances Tab -->
             <div v-else-if="activeTab === 'leave'" class="animate-in fade-in slide-in-from-left-4 duration-300 space-y-10 max-w-5xl mx-auto py-8">
                <div v-if="loadingLeave" class="p-24 text-center">
                   <div class="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                   <p class="text-[11px] font-black uppercase tracking-widest text-slate-400">Loading Leave...</p>
                </div>
                <div v-else-if="leaveBalances.length === 0" class="p-24 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                   <div class="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-6 text-slate-300">
                      <i class="mdi mdi-beach text-4xl"></i>
                   </div>
                   <h3 class="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">No Leave Found</h3>
                   <p class="text-xs text-slate-500 max-w-xs mx-auto font-medium">No leave data has been recorded for this employee.</p>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div v-for="balance in leaveBalances" :key="balance.leave_type_id" class="p-8 bg-white dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                      <div class="flex items-center gap-4 mb-10">
                         <div :class="`w-14 h-14 rounded-2xl flex items-center justify-center text-${balance.color}-600 bg-${balance.color}-50 dark:bg-${balance.color}-500/10 shadow-inner`">
                            <i :class="['mdi', balance.icon, 'text-2xl']"></i>
                         </div>
                         <div>
                            <h4 class="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-blue-600 transition-colors">{{ balance.name }}</h4>
                            <p class="text-[11px] font-bold text-slate-400 mt-2 tracking-tight">{{ balance.allocated_days }} Days / Year</p>
                         </div>
                      </div>
                      <div class="space-y-4 flex-1">
                         <div class="flex justify-between items-center text-[11px] font-black">
                            <span class="text-slate-400">Available</span>
                            <span class="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800">{{ balance.available_days }} d</span>
                         </div>
                         <div class="flex justify-between items-center text-[11px] font-black">
                            <span class="text-slate-400">Earned</span>
                            <span class="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800">{{ balance.earned_days }} d</span>
                         </div>
                         <div class="flex justify-between items-center text-[11px] font-black">
                            <span class="text-slate-400">Utilized</span>
                            <span class="text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800">{{ balance.used_days }} d</span>
                         </div>
                         <div v-if="balance.pending_days > 0" class="flex justify-between items-center text-[11px] font-black">
                            <span class="text-amber-500">Pending Approval</span>
                            <span class="text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-900/40">{{ balance.pending_days }} d</span>
                         </div>
                      </div>
                      <div class="pt-6 mt-6 border-t border-slate-50 dark:border-slate-800">
                         <div class="flex justify-between items-center">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Available</span>
                            <span class="text-base font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/40">{{ balance.requestable_days }} d</span>
                         </div>
                         <p v-if="balance.allow_advance" class="text-[10px] font-bold text-slate-400 mt-3 italic tracking-tight">*Includes {{ balance.advance_available_days }} advance days</p>
                      </div>
                   </div>
                </div>
             </div>

            <!-- Payroll Ledger Tab -->
            <div v-else-if="activeTab === 'payroll'" class="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10 pb-10">
               <!-- Tax Reporting & P9 Card Export -->
               <div class="bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-[3rem] p-12 border border-amber-500/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm relative overflow-hidden group">
                  <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full group-hover:bg-amber-500/10 transition-all duration-1000"></div>
                  <div class="flex items-center gap-8 relative z-10">
                     <div class="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-500/10 border border-amber-100/50 dark:border-amber-500/10">
                        <i class="mdi mdi-file-document-check text-4xl"></i>
                     </div>
                     <div>
                        <h4 class="text-base font-black text-amber-600 tracking-tight mb-2">P9 Tax Forms</h4>
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Download P9 Form (PIN: {{ selectedEmployee?.kra_pin || 'NOT SET' }})</p>
                     </div>
                  </div>
                  <div class="flex items-center gap-5 relative z-10">
                     <select v-model="selectedYear" class="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-black shadow-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition-all">
                        <option v-for="year in [2024, 2025, 2026]" :key="year" :value="year">{{ year }} Year</option>
                     </select>
                     <button @click="exportP9(selectedEmployee!.id, selectedYear)" class="px-10 py-4 bg-slate-900 dark:bg-amber-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-xl shadow-amber-500/10">
                        <i class="mdi mdi-cloud-download text-xl"></i> Export P9 Card
                     </button>
                  </div>
               </div>
               <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                  <!-- Entry Form -->
                  <div class="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-8 space-y-6">
                     <div class="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-5">
                        <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm shadow-blue-500/5">
                           <i class="mdi mdi-plus-circle-outline text-xl"></i>
                        </div>
                        <div>
                           <h4 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Add Adjustment</h4>
                           <p class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Add a bonus, deduction, or allowance</p>
                        </div>
                     </div>
                     
                     <div class="space-y-4">
                        <div>
                           <label class="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Description / Name</label>
                           <input v-model="ledgerForm.name" type="text" placeholder="e.g. Performance Bonus" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                           <div>
                              <label class="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Month</label>
                              <input v-model="ledgerForm.ledger_month" type="month" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold" />
                           </div>
                           <div>
                              <label class="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Type</label>
                              <select v-model="ledgerForm.type" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold">
                                 <option value="addition">Addition</option>
                                 <option value="deduction">Deduction</option>
                              </select>
                           </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                           <div>
                               <label class="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Amount Type</label>
                               <select v-model="ledgerForm.amount_type" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold">
                                 <option value="fixed">Fixed KES</option>
                                 <option value="percentage_of_basic">% of Basic</option>
                              </select>
                           </div>
                           <div>
                              <label class="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Value</label>
                              <input v-model="ledgerForm.amount_value" type="number" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold" />
                           </div>
                        </div>

                        <div class="flex items-center gap-3 py-2">
                           <input v-model="ledgerForm.is_recurring" type="checkbox" id="is_recurring" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                           <label for="is_recurring" class="text-xs font-black uppercase text-slate-500 tracking-widest">Mark as Recurring</label>
                        </div>

                        <button 
                           @click="handleSaveLedger"
                           :disabled="savingLedger || !ledgerForm.name || !ledgerForm.amount_value"
                           class="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all"
                        >
                           <i v-if="savingLedger" class="mdi mdi-loading mdi-spin mr-2"></i>
                           Submit Adjustment
                        </button>
                     </div>
                  </div>

                  <!-- Ledger Table -->
                  <div class="lg:col-span-2 space-y-6">
                     <div class="flex items-center justify-between">
                        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Adjustment History</h4>
                        <div v-if="loadingLedgers" class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                     </div>

                     <div class="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800">
                        <table class="w-full text-left border-collapse">
                           <thead>
                              <tr class="bg-slate-50 dark:bg-slate-900/50">
                                 <th class="px-6 py-4 text-xs font-black  tracking-widest text-slate-400">Entry / Month</th>
                                 <th class="px-6 py-4 text-xs font-black  tracking-widest text-slate-400">Type</th>
                                 <th class="px-6 py-4 text-xs font-black  tracking-widest text-slate-400 text-right">Amount</th>
                                 <th class="px-6 py-4 text-xs font-black  tracking-widest text-slate-400"></th>
                              </tr>
                           </thead>
                           <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                              <tr v-if="employeeLedgers.length === 0">
                                 <td colspan="4" class="px-6 py-10 text-center text-slate-400 italic">No custom adjustments recorded for this employee.</td>
                              </tr>
                              <tr v-for="ledger in employeeLedgers" :key="ledger.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                 <td class="px-6 py-4">
                                    <p class="font-black text-slate-900 dark:text-white">{{ ledger.name }}</p>
                                    <p class="text-xs font-bold text-slate-400 uppercase">{{ ledger.ledger_month }} <span v-if="ledger.is_recurring" class="ml-2 text-blue-500 shrink-0 uppercase tracking-widest">Recurring</span></p>
                                 </td>
                                 <td class="px-6 py-4">
                                    <span :class="['px-2 py-1 rounded-md text-xs font-black uppercase tracking-widest', 
                                       ledger.type === 'addition' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400']">
                                       {{ ledger.type }}
                                    </span>
                                 </td>
                                 <td class="px-6 py-4 text-right font-black">
                                    {{ ledger.amount_type === 'percentage_of_basic' ? ledger.amount_value + '%' : 'KES ' + ledger.amount_value.toLocaleString() }}
                                 </td>
                                 <td class="px-6 py-4 text-right">
                                    <button @click="handleRemoveLedger(ledger.id!)" class="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                       <i class="mdi mdi-delete-outline text-lg"></i>
                                    </button>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>

          <!-- Edit Profile Logic -->
          <form v-else @submit.prevent="handleUpdateEmployee" class="space-y-8 pb-4">
             <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Identity Matrix -->
                <div class="space-y-4">
                   <h4 class="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-account-circle"></i> Identity</h4>
                   <div class="space-y-3">
                      <input v-model="editFormData.first_name" type="text" placeholder="First Name *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="editFormData.last_name" type="text" placeholder="Last Name *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="editFormData.id_number" type="text" placeholder="National ID / Passport" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="editFormData.email" type="email" placeholder="Corporate Email *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>

                <!-- Statutory Info -->
                <div class="space-y-4">
                   <h4 class="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-shield-check"></i> Statutory</h4>
                   <div class="space-y-3">
                      <input v-model="editFormData.kra_pin" type="text" placeholder="Tax ID / KRA PIN" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20" />
                      <input v-model="editFormData.nssf_id" type="text" placeholder="Social Security (NSSF)" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20" />
                      <input v-model="editFormData.nhif_id" type="text" placeholder="Health Insurance (NHIF)" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20" />
                      <input v-model="editFormData.phone" type="tel" placeholder="Phone Number" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-500/20" />
                   </div>
                </div>

                <!-- Structural Nodes -->
                <div class="space-y-4">
                   <h4 class="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-briefcase-account"></i> Job Info</h4>
                   <div class="space-y-3">
                      <input v-model="editFormData.position" type="text" placeholder="Current Position *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20" />
                      <select v-model="editFormData.department_id" placeholder="Current Position *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option value="" disabled>-- Select Department --</option>
                        <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                      </select>
                      <select v-model="editFormData.employment_type" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Intern</option>
                      </select>
                      <select v-model="editFormData.status" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                        <option value="terminated">Terminated</option>
                      </select>
                   </div>
                </div>

                <!-- Payroll Details -->
                <div class="space-y-4">
                   <h4 class="text-xs font-black text-purple-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-bank"></i> Financial</h4>
                   <div class="space-y-3">
                      <input v-model="editFormData.salary" type="number" placeholder="Monthly Salary (e.g. 50,000) *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500/20" />
                      <input v-model="editFormData.bank_name" type="text" placeholder="Bank Institution" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500/20" />
                      <div class="grid grid-cols-2 gap-3">
                        <input v-model="editFormData.bank_branch" type="text" placeholder="Bank Branch" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500/20" />
                        <input v-model="editFormData.bank_code" type="text" placeholder="Bank Code (Optional)" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500/20" />
                      </div>
                      <input v-model="editFormData.account_number" type="text" placeholder="Account Number" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500/20" />
                      <select v-model="editFormData.payment_method" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-purple-500/20">
                        <option value="bank">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cheque">Cheque</option>
                        <option value="cash">Cash</option>
                      </select>
                   </div>
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Timeline Protocol -->
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                   <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Dates</h4>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Hire Date</label>
                         <input v-model="editFormData.hire_date" type="date" required class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                      </div>
                      <div>
                         <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Probation End</label>
                         <input v-model="editFormData.probation_end_date" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                      </div>
                      <div>
                         <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Contract End</label>
                         <input v-model="editFormData.contract_end_date" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                      </div>
                      <div class="flex items-center gap-3 pt-6 pl-2">
                         <input v-model="editFormData.is_on_probation" type="checkbox" id="edit_probation_check" class="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500" />
                         <label for="edit_probation_check" class="text-xs font-black uppercase tracking-widest text-slate-500">Active Probation</label>
                      </div>
                   </div>
                </div>

                <!-- Operational Background -->
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4 shadow-inner">
                   <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Contact Information</h4>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <textarea v-model="editFormData.address" rows="3" placeholder="Address" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 shadow-sm"></textarea>
                      <div class="grid grid-cols-1 gap-2">
                         <input v-model="editFormData.emergency_contact.name" type="text" placeholder="Emergency Contact Name" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                         <div class="grid grid-cols-2 gap-2">
                            <input v-model="editFormData.emergency_contact.relationship" type="text" placeholder="Relationship" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                            <input v-model="editFormData.emergency_contact.phone" type="tel" placeholder="Phone" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div v-if="editFormError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 font-black text-xs uppercase tracking-widest italic">
                {{ editFormError }}
             </div>
             <div v-if="editFormSuccess" class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-600 font-black text-xs uppercase tracking-widest">
                {{ editFormSuccess }}
             </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto relative z-10">
          <button @click="closeModal" class="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="updating">Cancel</button>
          <template v-if="modalMode === 'view'">
            <button @click="editEmployee(selectedEmployee!)" class="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 transition-all flex items-center gap-2">
               <i class="mdi mdi-account-edit-outline"></i> Edit Employee
            </button>
          </template>
          <template v-else>
            <button @click="handleUpdateEmployee" :disabled="updating" class="px-10 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center gap-2">
              <i v-if="updating" class="mdi mdi-loading mdi-spin"></i>
              {{ updating ? 'Saving...' : 'Save Changes' }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Enrollment Modal (Create New) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-7xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[90vh] flex flex-col">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-[90px]"></div>
        
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div>
             <h2 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Add New <span class="text-emerald-500">Employee</span>
            </h2>
            <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">Fill in the employee's details below</p>
          </div>
          <button @click="closeCreateModal" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors shadow-inner">
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
           <form @submit.prevent="handleCreateEmployee" class="space-y-8 pb-4">
             <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Identity Matrix -->
                <div class="space-y-6">
                   <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-3 pl-1"><i class="mdi mdi-account-circle text-lg"></i> Personal Info</h4>
                   <div class="space-y-4">
                      <input v-model="newEmployee.first_name" type="text" placeholder="First Name *" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                      <input v-model="newEmployee.last_name" type="text" placeholder="Last Name *" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                      <input v-model="newEmployee.id_number" type="text" placeholder="National ID / Passport" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                      <input v-model="newEmployee.email" type="email" placeholder="Email *" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                   </div>
                </div>

                <!-- Statutory Info -->
                <div class="space-y-6">
                   <h4 class="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-3 pl-1"><i class="mdi mdi-shield-check text-lg"></i> Tax & Compliance</h4>
                   <div class="space-y-4">
                      <input v-model="newEmployee.kra_pin" type="text" placeholder="Tax ID / KRA PIN" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input v-model="newEmployee.nssf_id" type="text" placeholder="Social Security (NSSF)" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input v-model="newEmployee.nhif_id" type="text" placeholder="Health Insurance (NHIF)" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                      <input v-model="newEmployee.phone" type="tel" placeholder="Phone Number" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-amber-500/20 transition-all" />
                   </div>
                </div>

                <!-- Job Details -->
                <div class="space-y-6">
                   <h4 class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3 pl-1"><i class="mdi mdi-briefcase-account text-lg"></i> Job Details</h4>
                   <div class="space-y-4">
                      <input v-model="newEmployee.position" type="text" placeholder="Current Position *" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                       <div class="relative">
                         <i class="mdi mdi-domain absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/60 text-base pointer-events-none z-10"></i>
                         <select v-model="newEmployee.department_id" required
                           :class="['w-full pl-10 pr-10 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer', !newEmployee.department_id ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white']">
                           <option value="" disabled selected>Select a department...</option>
                           <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                         </select>
                         <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base"></i>
                       </div>
                      <select v-model="newEmployee.employment_type" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Intern</option>
                      </select>
                      <select v-model="newEmployee.status" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                        <option value="terminated">Terminated</option>
                      </select>
                       <div class="relative">
                         <i class="mdi mdi-account-tie absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none z-10"></i>
                         <select v-model="newEmployee.manager_id"
                           :class="['w-full pl-10 pr-10 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer font-inter', !newEmployee.manager_id ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white']">
                           <option value="">No manager assigned (optional)</option>
                           <option v-for="emp in availableEmployees" :key="emp.id" :value="emp.id">{{ emp.first_name }} {{ emp.last_name }}</option>
                         </select>
                         <i class="mdi mdi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base"></i>
                       </div>
                   </div>
                </div>

                <!-- Payroll Details -->
                <div class="space-y-6">
                   <h4 class="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-3 pl-1"><i class="mdi mdi-bank text-lg"></i> Payroll Details</h4>
                   <div class="space-y-4">
                      <input v-model="newEmployee.salary" type="number" placeholder="Monthly Salary (e.g. 50,000) *" required class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" />
                      <input v-model="newEmployee.bank_name" type="text" placeholder="Bank Name" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" />
                      <div class="grid grid-cols-2 gap-4">
                        <input v-model="newEmployee.bank_branch" type="text" placeholder="Branch Name" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" />
                        <input v-model="newEmployee.bank_code" type="text" placeholder="Bank Code" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" />
                      </div>
                      <input v-model="newEmployee.account_number" type="text" placeholder="Account Number" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all" />
                      <select v-model="newEmployee.payment_method" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black shadow-inner outline-none focus:ring-2 focus:ring-purple-500/20 transition-all">
                        <option value="bank">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cheque">Cheque</option>
                        <option value="cash">Cash</option>
                      </select>
                   </div>
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Important Dates -->
                <div class="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] space-y-8 border border-slate-100 dark:border-slate-800/50">
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/50 pb-4 pl-1">Important Dates</h4>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Hire Date *</label>
                         <input v-model="newEmployee.hire_date" type="date" required class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
                      </div>
                      <div>
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Probation End Date</label>
                         <input v-model="newEmployee.probation_end_date" type="date" class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
                      </div>
                      <div>
                         <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Contract End Date</label>
                         <input v-model="newEmployee.contract_end_date" type="date" class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
                      </div>
                      <div class="flex items-center gap-4 pt-8 pl-2">
                         <div class="relative inline-flex items-center cursor-pointer">
                            <input v-model="newEmployee.is_on_probation" type="checkbox" id="probation_check" class="sr-only peer" />
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <label for="probation_check" class="ml-3 text-[11px] font-black uppercase tracking-widest text-slate-500">Active Probation</label>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- Contact Info -->
                <div class="p-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] space-y-8 shadow-inner border border-slate-100 dark:border-slate-800/50">
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/50 pb-4 pl-1">Contact Info</h4>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <textarea v-model="newEmployee.address" rows="3" placeholder="Home Address" class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-[1.5rem] text-[11px] font-medium focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"></textarea>
                      <div class="grid grid-cols-1 gap-4">
                         <input v-model="newEmployee.emergency_contact.name" type="text" placeholder="Contact Name" class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
                         <div class="grid grid-cols-2 gap-4">
                            <input v-model="newEmployee.emergency_contact.relationship" type="text" placeholder="Relationship" class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
                            <input v-model="newEmployee.emergency_contact.phone" type="tel" placeholder="Phone Number" class="w-full px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div v-if="formError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 font-black text-xs uppercase tracking-widest italic">
                {{ formError }}
             </div>
             <div v-if="formSuccess" class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-600 font-black text-xs uppercase tracking-widest">
                {{ formSuccess }}
             </div>
          </form>
        </div>

        <div class="flex justify-end gap-5 pt-8 border-t border-slate-50 dark:border-slate-800 mt-auto relative z-10">
          <button @click="closeCreateModal" class="px-8 py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="saving">Cancel</button>
          <button @click="handleCreateEmployee" :disabled="saving" class="px-12 py-3.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:scale-105 active:scale-95 flex items-center gap-3 transition-all">
            <i v-if="saving" class="mdi mdi-loading mdi-spin text-lg"></i>
            {{ saving ? 'Saving...' : 'Save Employee' }}
          </button>
        </div>
      </div>
    </div>
    </div> <!-- End of v-if="activeMainTab === 'roster'" -->

    <!-- Technical Labour Section -->
    <div v-else-if="activeMainTab === 'technical'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div v-if="labourLoading" class="p-20 text-center flex flex-col items-center gap-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div class="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        <p class="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Syncing Specialist Nodes...</p>
      </div>

      <div v-else class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-10">
        <div class="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-700/20">
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Technical Resource Pool</h2>
            <p class="text-sm text-slate-500 font-medium mt-1">Registry for specialized external teams and freelancers</p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <div class="relative min-w-[280px]">
              <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                v-model="labourSearch"
                type="text" 
                placeholder="Search skills (e.g. Rigger)..." 
                class="w-full h-11 pl-11 pr-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 transition-all uppercase tracking-widest"
              />
            </div>
            <div class="flex items-center gap-2">
               <button 
                  @click="downloadTemplate"
                  class="h-11 w-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-500 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95"
                  title="Download CSV Template"
               >
                  <i class="mdi mdi-file-download-outline text-xl"></i>
               </button>

               <input type="file" ref="labourFileInput" class="hidden" @change="handleLabourFileUpload" accept=".csv" />
               <button 
                  @click="triggerLabourUpload"
                  class="h-11 w-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-500 rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-95"
                  title="Import From CSV"
               >
                  <i class="mdi mdi-file-upload-outline text-xl"></i>
               </button>
            </div>

            <button 
              @click="openLabourModal()"
              class="h-11 px-6 bg-slate-900 dark:bg-white hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white dark:text-slate-900 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <i class="mdi mdi-account-plus text-lg"></i>
              Capture New Skill
            </button>
          </div>
        </div>

        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead class="bg-white dark:bg-gray-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Team Member Identity</th>
                <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Specialization</th>
                <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700 text-center">Efficiency Rating</th>
                <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Standard Rate</th>
                <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Status</th>
                <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
              <tr v-if="filteredLabours.length === 0" class="text-center py-20">
                <td colspan="6" class="px-8 py-20">
                  <div class="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                    <i class="mdi mdi-account-search-outline text-6xl mb-4"></i>
                    <p class="text-sm font-black uppercase tracking-widest">No resources match your search criteria</p>
                  </div>
                </td>
              </tr>
              <tr v-for="labour in filteredLabours" :key="labour.id" class="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-all">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-colors">
                      <i class="mdi mdi-account text-xl"></i>
                    </div>
                    <div>
                      <div class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ labour.full_name }}</div>
                      <div class="text-[10px] text-slate-400 font-bold tracking-widest">{{ labour.phone || 'No Phone' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6 text-sm">
                  <span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest">
                    {{ labour.specialization || 'Generalist' }}
                  </span>
                </td>
                <td class="px-8 py-6 text-center">
                   <div class="flex items-center justify-center gap-0.5 text-amber-400">
                     <i v-for="i in 5" :key="i" class="mdi" :class="i <= Math.round(labour.rating) ? 'mdi-star' : 'mdi-star-outline'"></i>
                   </div>
                </td>
                <td class="px-8 py-6">
                  <div class="text-sm font-black text-slate-900 dark:text-white">KES {{ Number(labour.day_rate).toLocaleString() }}</div>
                  <div class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fixed Day Rate</div>
                </td>
                <td class="px-8 py-6">
                  <span 
                    class="px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm"
                    :class="{
                      'bg-emerald-50 text-emerald-600 border border-emerald-100': labour.status === 'active',
                      'bg-slate-50 text-slate-500 border border-slate-200': labour.status === 'inactive',
                      'bg-rose-50 text-rose-600 border border-rose-100': labour.status === 'blacklisted'
                    }"
                  >
                    {{ labour.status }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button @click="openLabourModal(labour)" class="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-emerald-500 transition-all active:scale-95" title="Modify Record">
                      <i class="mdi mdi-pencil text-lg"></i>
                    </button>
                    <button @click="handleDeleteLabour(labour.id)" class="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-500 transition-all active:scale-95" title="Purge Record">
                      <i class="mdi mdi-delete-outline text-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Technical Labour Modal -->
      <div v-if="showLabourModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold dark:text-white">{{ editingLabour ? 'Update Technical Team Member' : 'New Technical Labour Capture' }}</h3>
            <button @click="showLabourModal = false" class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>

          <form @submit.prevent="handleSaveLabour" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
                <input v-model="labourForm.full_name" required type="text" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Specialization</label>
                <input v-model="labourForm.specialization" type="text" placeholder="e.g. Electrician, Rigger" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input v-model="labourForm.phone" type="tel" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input v-model="labourForm.email" type="email" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Day Rate (KES) *</label>
                <input v-model="labourForm.day_rate" required type="number" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Efficiency Rating (1-5)</label>
                <input v-model="labourForm.rating" type="number" min="1" max="5" step="0.5" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Availability Status</label>
                <select v-model="labourForm.status" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white">
                  <option value="active">Active / Available</option>
                  <option value="inactive">Inactive</option>
                  <option value="blacklisted">Blacklisted / Do Not Hire</option>
                </select>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Internal Notes / Performance Record</label>
              <textarea v-model="labourForm.notes" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white lg:resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="showLabourModal = false" class="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
              <button :disabled="labourLoading" type="submit" class="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50">
                {{ labourLoading ? 'Processing...' : (editingLabour ? 'Update Records' : 'Save To Database') }}
              </button>
            </div>
          </form>
          </div>
      </div>
    </div>

    </div> <!-- Close max-w-auto -->
  </div> <!-- Close min-h-screen -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue'
import type { Employee, EmployeeFilters } from '../types/employee'
import { useEmployees } from '../composables/useEmployees'
import { useEmployeeDocuments } from '../composables/useEmployeeDocuments'
import { usePayroll } from '../composables/usePayroll'
import { useApi } from '../../admin/shared/composables/useApi'
import { useTechnicalLabour, type TechnicalLabour } from '../composables/useTechnicalLabour'

const activeMainTab = ref<'roster' | 'technical'>('roster')
const { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee: deleteEmployeeApi } = useEmployees()
const { labours, loading: labourLoading, fetchLabours, createLabour, updateLabour, deleteLabour, importLabour } = useTechnicalLabour()

const groupedEmployees = computed(() => {
  const groups: Record<number | string, { department: any, members: Employee[] }> = {}
  
  employees.value.forEach(emp => {
    const deptId = emp.department_id || 'unassigned'
    const deptName = emp.department?.name || 'Unassigned Personnel'
    
    if (!groups[deptId]) {
      groups[deptId] = {
        department: emp.department || { id: 0, name: 'Unassigned' },
        members: []
      }
    }
    groups[deptId].members.push(emp)
  })
  
  return Object.values(groups)
})
const { get } = useApi()
const filters = ref<EmployeeFilters>({ department: '', status: '', search: '' })
const selectedDeptId = ref<number | string>('all')
const availableDepartments = ref<Array<{id: number, name: string}>>([])

const activeGroup = computed(() => {
  if (selectedDeptId.value === 'all') {
    return {
      department: { id: 'all', name: 'All Departments' },
      members: employees.value
    }
  }
  
  if (selectedDeptId.value === 'unassigned') {
    const unassigned = employees.value.filter(e => !e.department_id)
    return {
      department: { id: 0, name: 'Unassigned' },
      members: unassigned
    }
  }
  return groupedEmployees.value.find(g => (g.department.id || 'unassigned') === selectedDeptId.value)
})
const availableEmployees = ref<Array<{id: number, first_name: string, last_name: string, position: string}>>([])
const showModal = ref(false)
const showCreateModal = ref(false)
const showAddModal = showCreateModal // Alias for the template
const showDeptsModal = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const modalMode = ref<'view' | 'edit'>('view')
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const updating = ref(false)
const editFormError = ref('')
const editFormSuccess = ref('')

const refreshEmployees = async () => {
  await fetchEmployees(filters.value)
}

// Automatic Search Watcher with Debounce
let searchTimeout: ReturnType<typeof setTimeout>
watch(() => filters.value, (newFilters) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchEmployees(newFilters)
  }, 400)
}, { deep: true })

// Dropdown state for directives
const openDropdownId = ref<number | null>(null)
const dropdownCoords = ref({ top: 0, left: 0 })
const closeAllDropdowns = () => { openDropdownId.value = null }

const toggleDropdown = (e: MouseEvent, id: number) => {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  } else {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    dropdownCoords.value = {
      top: rect.bottom + window.scrollY,
      left: rect.right - 208 // w-52 is 208px
    }
    openDropdownId.value = id
  }
}

// HR Action Engine
const showActionModal = ref(false)
const selectedActionType = ref<'promotion' | 'transfer' | 'warning' | 'salary_update' | 'termination'>('promotion')
const actionFormData = ref({
  effective_date: new Date().toISOString().split('T')[0],
  reason: '',
  new_data: {
    position: '',
    department_id: undefined as number | undefined,
    salary: 0,
    status: 'active' as 'active' | 'inactive' | 'terminated' | 'on-leave'
  }
})
const recording = ref(false)
const actionError = ref('')
const actionSuccess = ref('')

watch(selectedActionType, (newType) => {
  if (newType === 'termination') {
    actionFormData.value.new_data.status = 'terminated'
  } else if (selectedEmployee.value) {
    actionFormData.value.new_data.status = selectedEmployee.value.status as any
  }
})

// Action History
const selectedEmployeeActions = ref<any[]>([])
const activeTab = ref<'bio' | 'history' | 'leave' | 'vault' | 'payroll'>('bio')
const loadingActions = ref(false)
const leaveBalances = ref<any[]>([])
const loadingLeave = ref(false)

// Intelligence Vault
const { documents, loading: loadingDocs, error: docError, fetchDocuments, uploadDocument, deleteDocument, downloadDocument } = useEmployeeDocuments()
const { ledgers: employeeLedgers, loading: loadingLedgers, fetchLedgers, addLedger, removeLedger, exportP9 } = usePayroll()

const selectedYear = ref(new Date().getFullYear())

const uploadType = ref<'contract' | 'id_passport' | 'academic' | 'professional' | 'other'>('contract')
const uploadFile = ref<File | null>(null)
const uploadingDoc = ref(false)

const ledgerForm = reactive({
  type: 'addition' as 'addition' | 'deduction',
  amount_type: 'fixed' as 'fixed' | 'percentage_of_basic',
  amount_value: 0,
  ledger_month: new Date().toISOString().substring(0, 7), // YYYY-MM
  name: '',
  description: '',
  is_recurring: false
})
const savingLedger = ref(false)

const handleDocSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadFile.value = target.files[0]
  }
}

const handleDocUpload = async () => {
  if (!selectedEmployee.value || !uploadFile.value) return
  uploadingDoc.value = true
  try {
    await uploadDocument(selectedEmployee.value.id, uploadFile.value, uploadType.value)
    uploadFile.value = null
    const fileInput = document.getElementById('vault_file_upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    await fetchDocuments(selectedEmployee.value.id)
  } catch (err) {
    console.error('Document sync failed:', err)
  } finally {
    uploadingDoc.value = false
  }
}

const handleSaveLedger = async () => {
  if (!selectedEmployee.value) return
  savingLedger.value = true
  try {
    await addLedger({
      ...ledgerForm,
      employee_id: selectedEmployee.value.id
    })
    // Reset form
    ledgerForm.name = ''
    ledgerForm.amount_value = 0
    ledgerForm.description = ''
  } catch (err) {
    console.error('Ledger sync failed:', err)
  } finally {
    savingLedger.value = false
  }
}

const handleRemoveLedger = async (id: number) => {
  if (confirm('Are you sure you want to remove this ledger entry?')) {
    await removeLedger(id)
  }
}

watch(activeTab, async (newTab) => {
  if (!selectedEmployee.value) return
  
  if (newTab === 'vault') {
    await fetchDocuments(selectedEmployee.value.id)
  } else if (newTab === 'payroll') {
    await fetchLedgers({ employee_id: selectedEmployee.value.id })
  }
})

const openActionModal = (employee: Employee) => {
  selectedEmployee.value = employee
  showActionModal.value = true
  actionFormData.value = {
    effective_date: new Date().toISOString().split('T')[0],
    reason: '',
    new_data: {
      position: employee.position,
      department_id: employee.department_id || undefined,
      salary: employee.salary ?? 0,
      status: employee.status as any
    }
  }
}

const handleRecordAction = async () => {
  if (!selectedEmployee.value) return
  recording.value = true
  actionError.value = actionSuccess.value = ''
  
  try {
    const { recordHRAction } = useEmployees()
    await recordHRAction({
      employee_id: selectedEmployee.value.id,
      action_type: selectedActionType.value,
      effective_date: actionFormData.value.effective_date,
      reason: actionFormData.value.reason,
      new_data: actionFormData.value.new_data
    })
    actionSuccess.value = 'Personnel action recorded and synced.'
    await fetchEmployees()
    setTimeout(() => { showActionModal.value = false }, 1500)
  } catch (err: any) {
    actionError.value = err.message || 'Action failed.'
  } finally {
    recording.value = false
  }
}

const newEmployee = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  id_number: '',
  kra_pin: '',
  nssf_id: '',
  nhif_id: '',

  email: '',
  phone: '',
  department_id: '' as number | string | undefined,
  position: '',
  hire_date: new Date().toISOString().split('T')[0],
  probation_end_date: '',
  is_on_probation: true,
  contract_end_date: '',

  salary: 0,
  bank_name: '',
  bank_branch: '',
  bank_code: '',
  account_number: '',
  payment_method: 'bank' as 'bank' | 'cash' | 'mobile_money' | 'cheque',

  employment_type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern',
  status: 'active' as 'active' | 'inactive' | 'terminated' | 'on-leave',
  manager_id: '' as number | string | undefined,
  address: '',
  emergency_contact: {
    name: '',
    relationship: '',
    phone: ''
  }
})

const editFormData = ref({
  first_name: '',
  last_name: '',
  id_number: '',
  kra_pin: '',
  nssf_id: '',
  nhif_id: '',

  email: '',
  phone: '',
  department_id: undefined as number | undefined,
  position: '',
  hire_date: '',
  probation_end_date: '',
  is_on_probation: true,
  contract_end_date: '',

  salary: 0,
  bank_name: '',
  bank_branch: '',
  bank_code: '',
  account_number: '',
  payment_method: 'bank' as 'bank' | 'cash' | 'mobile_money' | 'cheque',

  employment_type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern',
  status: 'active' as 'active' | 'inactive' | 'terminated' | 'on-leave',
  manager_id: undefined as number | undefined,
  address: '',
  emergency_contact: {
    name: '',
    relationship: '',
    phone: ''
  }
})

const viewEmployee = async (employee: Employee) => {
  selectedEmployee.value = employee
  modalMode.value = 'view'
  showModal.value = true
  activeTab.value = 'bio'
  
  // Fetch action history
  loadingActions.value = true
  try {
    const { fetchEmployeeActions } = useEmployees()
    selectedEmployeeActions.value = await fetchEmployeeActions(employee.id)
  } catch {
    selectedEmployeeActions.value = []
  } finally {
    loadingActions.value = false
  }

  // Fetch leave balances
  loadingLeave.value = true
  try {
    const response = await get(`/api/hr/leave/dashboard?employee_id=${employee.id}`)
    leaveBalances.value = (response.data as any)?.balances || []
  } catch (err) {
    console.error('Failed to fetch leave balances', err)
    leaveBalances.value = []
  } finally {
    loadingLeave.value = false
  }

  // Fetch Documents
  await fetchDocuments(employee.id)
}

const openCreateModal = () => {
  showCreateModal.value = true
  if (availableDepartments.value.length === 0) fetchDepartments()
}

const editEmployee = async (employee: Employee) => {
  selectedEmployee.value = employee
  modalMode.value = 'edit'
  showModal.value = true

  if (availableDepartments.value.length === 0) await fetchDepartments()

  editFormData.value = {
    first_name: employee.first_name,
    last_name: employee.last_name,
    id_number: employee.id_number || '',
    kra_pin: employee.kra_pin || '',
    nssf_id: employee.nssf_id || '',
    nhif_id: employee.nhif_id || '',
    email: employee.email,
    phone: employee.phone || '',
    department_id: employee.department_id,
    position: employee.position,
    hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : '',
    probation_end_date: employee.probation_end_date ? employee.probation_end_date.split('T')[0] : '',
    is_on_probation: employee.is_on_probation,
    contract_end_date: employee.contract_end_date ? employee.contract_end_date.split('T')[0] : '',
    salary: employee.salary ?? 0,
    bank_name: employee.bank_name || '',
    bank_branch: employee.bank_branch || '',
    bank_code: employee.bank_code || '',
    account_number: employee.account_number || '',
    payment_method: employee.payment_method || 'bank',
    employment_type: employee.employment_type,
    status: employee.status,
    manager_id: employee.manager_id || undefined,
    address: employee.address || '',
    emergency_contact: {
      name: employee.emergency_contact?.name || '',
      relationship: employee.emergency_contact?.relationship || '',
      phone: employee.emergency_contact?.phone || ''
    }
  }
}

const deleteEmployee = async (employee: Employee) => {
  if (confirm(`PURGE PROTOCOL: Are you sure you want to terminate service for ${employee.first_name} ${employee.last_name}?`)) {
    try {
      await deleteEmployeeApi(employee.id)
      await fetchEmployees()
    } catch (err) { console.error('Purge failed:', err) }
  }
}

const closeModal = () => { showModal.value = false; selectedEmployee.value = null }

const closeCreateModal = () => {
  showCreateModal.value = false
  formError.value = formSuccess.value = ''
  newEmployee.value = {
    employee_id: '',
    first_name: '',
    last_name: '',
    id_number: '',
    kra_pin: '',
    nssf_id: '',
    nhif_id: '',
    email: '',
    phone: '',
    department_id: undefined,
    position: '',
    hire_date: new Date().toISOString().split('T')[0],
    probation_end_date: '',
    is_on_probation: true,
    contract_end_date: '',
    salary: 0,
    bank_name: '',
    bank_branch: '',
    bank_code: '',
    account_number: '',
    payment_method: 'bank' as any,
    employment_type: 'full-time' as any,
    status: 'active',
    manager_id: undefined,
    address: '',
    emergency_contact: {
      name: '',
      relationship: '',
      phone: ''
    }
  }
}

const handleCreateEmployee = async () => {
  if (!newEmployee.value.first_name || !newEmployee.value.last_name || !newEmployee.value.email ||
      !newEmployee.value.position || !newEmployee.value.department_id || !newEmployee.value.hire_date) {
    formError.value = 'Please fill in all required fields.'; return
  }

  saving.value = true
  formError.value = formSuccess.value = ''

  try {
    // Construct emergencyContact based on the nested object
    let emergencyContact = undefined
    if (newEmployee.value.emergency_contact.name || newEmployee.value.emergency_contact.phone) {
      emergencyContact = {
        name: newEmployee.value.emergency_contact.name,
        relationship: newEmployee.value.emergency_contact.relationship,
        phone: newEmployee.value.emergency_contact.phone
      }
    }

    const employeeData = {
      ...newEmployee.value,
      department_id: newEmployee.value.department_id as number,
      manager_id: newEmployee.value.manager_id || undefined,
      emergency_contact: emergencyContact
    }
    await createEmployee(employeeData as any)
    formSuccess.value = 'Identity initialized.'
    await fetchEmployees()
    setTimeout(closeCreateModal, 1500)
  } catch (err: any) {
    formError.value = err.message || 'Transmission failed.'
  } finally { saving.value = false }
}

const handleUpdateEmployee = async () => {
  if (!selectedEmployee.value) return
  if (!editFormData.value.first_name || !editFormData.value.last_name || !editFormData.value.email ||
      !editFormData.value.position || !editFormData.value.department_id || !editFormData.value.hire_date) {
    editFormError.value = 'Required protocol nodes missing.'; return
  }

  updating.value = true
  editFormError.value = editFormSuccess.value = ''

  try {
    const employeeData = { 
      ...editFormData.value, 
      department_id: editFormData.value.department_id as number 
    }
    await updateEmployee(selectedEmployee.value.id, employeeData as any)
    editFormSuccess.value = 'Node synchronized.'
    await fetchEmployees()
    setTimeout(closeModal, 1500)
  } catch (err: any) {
    editFormError.value = err.message || 'Transmission failed.'
  } finally { updating.value = false }
}

const applyFilters = () => fetchEmployees(filters.value)

const fetchDepartments = async () => {
  try {
    const res = await get('/api/hr/departments')
    let depts = Array.isArray(res) ? res : (res as any).data || []
    availableDepartments.value = depts.map((d: any) => ({ id: d.id, name: d.name }))
  } catch { console.warn('Structural sync failed.') }
}

const fetchAvailableEmployees = async () => {
  try {
    const res = await get('/api/hr/employees')
    let emps = Array.isArray(res) ? res : (res as any).data || []
    availableEmployees.value = emps.map((e: any) => ({ id: e.id, first_name: e.first_name, last_name: e.last_name, position: e.position }))
  } catch { availableEmployees.value = [] }
}

const formatDate = (ds: string) => ds ? new Date(ds).toLocaleDateString() : 'N/A'

onMounted(async () => {
  document.addEventListener('click', closeAllDropdowns)
  await fetchEmployees(); await fetchDepartments(); await fetchAvailableEmployees(); await fetchLabours()
})

onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns)
})

// Technical Labour State & Logic
const showLabourModal = ref(false)
const editingLabour = ref<TechnicalLabour | null>(null)
const labourSearch = ref('')
const labourForm = ref({
  full_name: '',
  specialization: '',
  phone: '',
  email: '',
  day_rate: 0,
  status: 'active' as 'active' | 'inactive' | 'blacklisted',
  notes: '',
  rating: 5
})

const labourFileInput = ref<HTMLInputElement | null>(null)

const downloadTemplate = () => {
    window.open('/api/hr/technical-labour/template', '_blank')
}
const triggerLabourUpload = () => {
    labourFileInput.value?.click()
}
const handleLabourFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        try {
            await importLabour(target.files[0])
            await fetchLabours()
            alert('Import Successful! Records have been added.')
        } catch (e) {
            console.error(e)
            alert('Import Failed. Please check the CSV format.')
        }
        target.value = ''
    }
}

const filteredLabours = computed(() => {
  if (!labourSearch.value) return labours.value
  const search = labourSearch.value.toLowerCase()
  return labours.value.filter(l => 
    l.full_name.toLowerCase().includes(search) || 
    l.specialization?.toLowerCase().includes(search) ||
    l.email?.toLowerCase().includes(search)
  )
})

const openLabourModal = (labour: TechnicalLabour | null = null) => {
  if (labour) {
    editingLabour.value = labour
    labourForm.value = {
      full_name: labour.full_name,
      specialization: labour.specialization,
      phone: labour.phone,
      email: labour.email,
      day_rate: Number(labour.day_rate),
      status: labour.status,
      notes: labour.notes,
      rating: Number(labour.rating)
    }
  } else {
    editingLabour.value = null
    labourForm.value = {
      full_name: '',
      specialization: '',
      phone: '',
      email: '',
      day_rate: 0,
      status: 'active',
      notes: '',
      rating: 5
    }
  }
  showLabourModal.value = true
}

const handleSaveLabour = async () => {
  try {
    if (editingLabour.value) {
      await updateLabour(editingLabour.value.id, labourForm.value)
    } else {
      await createLabour(labourForm.value)
    }
    showLabourModal.value = false
    await fetchLabours()
  } catch (err) {
    console.error('Failed to save technical labour:', err)
  }
}

const handleDeleteLabour = async (id: number) => {
  if (confirm('Are you sure you want to remove this technical labour record?')) {
    try {
      await deleteLabour(id)
      await fetchLabours()
    } catch (err) {
      console.error('Failed to delete labour:', err)
    }
  }
}

</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>

