<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-10 font-inter text-slate-900 dark:text-slate-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Minimalist Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <nav class="flex mb-2" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <li><router-link to="/hr" class="hover:text-blue-500 transition-colors">HR</router-link></li>
              <li><i class="mdi mdi-chevron-right text-xs"></i></li>
              <li class="text-slate-500 dark:text-slate-300">Personnel Registry</li>
            </ol>
          </nav>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Employee <span class="text-blue-500 opacity-50">Directory</span>
          </h1>
        </div>
        
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
        >
          <i class="mdi mdi-account-plus-outline text-lg"></i>
          Enroll Talent
        </button>
      </div>

      <!-- Compact Search/Filter Engine -->
      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div class="md:col-span-2 relative">
            <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by name, ID or email..."
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <select
            v-model="filters.department"
            class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Departments</option>
            <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
          <select
            v-model="filters.status"
            class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Global Status</option>
            <option value="active">Active Service</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">Medical/Annual Leave</option>
            <option value="terminated">Separated</option>
          </select>
          <button
            @click="applyFilters"
            class="px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            Sync Registry
          </button>
        </div>
      </div>

      <!-- High-Density Directory Table -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-[13px]">
        <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Personnel Nodes...</p>
        </div>

        <div v-else-if="error" class="p-20 text-center text-red-500 font-bold">
          <i class="mdi mdi-alert-circle-outline text-4xl mb-2 block"></i>
          {{ error }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Professional Identity</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Clearance/Role</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Structural Unit</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Bio Status</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Directives</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr v-for="employee in employees" :key="employee.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500 shadow-sm uppercase border border-slate-200 dark:border-slate-700">
                        {{ employee.first_name[0] }}{{ employee.last_name[0] }}
                      </div>
                      <div :class="[
                        'absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-slate-900 rounded-full',
                        employee.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                      ]"></div>
                    </div>
                    <div>
                      <div class="font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                        {{ employee.first_name }} {{ employee.last_name }}
                      </div>
                      <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">
                        {{ employee.employee_id }} • {{ employee.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-bold text-slate-700 dark:text-slate-300">{{ employee.position }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg">
                    {{ employee.department?.name || 'Unassigned' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]',
                      employee.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : employee.status === 'inactive'
                        ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                        : employee.status === 'terminated'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    ]"
                  >
                    {{ employee.status.replace('-', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="viewEmployee(employee)" class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded-lg transition-all" title="View Full Bio">
                      <i class="mdi mdi-eye-outline"></i>
                    </button>
                    <button @click="editEmployee(employee)" class="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-500 rounded-lg transition-all" title="Modify Registry">
                      <i class="mdi mdi-account-edit-outline"></i>
                    </button>
                    <button @click="deleteEmployee(employee)" class="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 rounded-lg transition-all" title="Terminate Service">
                      <i class="mdi mdi-account-remove-outline"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Employee Detail Modal (Integrated View/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[90vh] flex flex-col">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-500/5 rounded-full blur-[90px]"></div>
        
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              {{ modalMode === 'view' ? 'Personnel' : 'Edit' }} <span class="text-blue-500">Node</span>
            </h2>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Profile Entry</p>
          </div>
          <button @click="closeModal" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors shadow-inner">
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
          <!-- View Profile Logic -->
          <div v-if="modalMode === 'view'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div class="md:col-span-1 space-y-6">
                <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                   <div class="w-24 h-24 rounded-3xl bg-blue-500/10 mx-auto flex items-center justify-center text-4xl font-black text-blue-500 shadow-xl mb-4 uppercase">
                     {{ selectedEmployee?.first_name[0] }}{{ selectedEmployee?.last_name[0] }}
                   </div>
                   <h3 class="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{{ selectedEmployee?.first_name }} {{ selectedEmployee?.last_name }}</h3>
                   <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{{ selectedEmployee?.position }}</p>
                </div>
                <div class="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                   <p class="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mb-2">Direct Command</p>
                   <div v-if="selectedEmployee?.manager" class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black shadow-sm">
                        {{ selectedEmployee.manager.first_name[0] }}{{ selectedEmployee.manager.last_name[0] }}
                      </div>
                      <div>
                        <p class="text-xs font-black leading-none mb-1">{{ selectedEmployee.manager.first_name }} {{ selectedEmployee.manager.last_name }}</p>
                        <p class="text-[9px] font-bold text-slate-400 leading-none">{{ selectedEmployee.manager.position }}</p>
                      </div>
                   </div>
                   <p v-else class="text-[10px] font-bold text-slate-400 italic">No Supervisor Assigned</p>
                </div>
             </div>

             <div class="md:col-span-2 space-y-8">
                <div>
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Registry Credentials</h4>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                      <div v-for="(val, label) in {
                        'Identification': selectedEmployee?.employee_id,
                        'Email Matrix': selectedEmployee?.email,
                        'Secure Comms': selectedEmployee?.phone || 'N/A',
                        'Clearance Unit': selectedEmployee?.department?.name || 'Unassigned',
                        'Tenure Type': selectedEmployee?.employment_type.toUpperCase(),
                        'Activation Date': formatDate(selectedEmployee?.hire_date || ''),
                        'Personnel Status': selectedEmployee?.status.toUpperCase()
                      }" :key="label">
                         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ label }}</p>
                         <p class="text-xs font-black text-slate-800 dark:text-slate-100">{{ val }}</p>
                      </div>
                   </div>
                </div>
                
                <div v-if="selectedEmployee?.performance_rating">
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Performance Metrics</h4>
                   <div class="flex items-center gap-4">
                      <div class="flex gap-1">
                         <div v-for="i in 5" :key="i" :class="['w-4 h-4 rounded-full', i <= selectedEmployee.performance_rating ? 'bg-amber-400' : 'bg-slate-200 dark:bg-slate-800']"></div>
                      </div>
                      <span class="text-xs font-black">{{ selectedEmployee.performance_rating }}/5 Confidence Score</span>
                   </div>
                </div>
             </div>
          </div>

          <!-- Edit Profile Logic -->
          <form v-else @submit.prevent="handleUpdateEmployee" class="space-y-8 pb-4">
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-account-circle"></i> Identity</h4>
                   <div class="space-y-3">
                      <input v-model="editFormData.employee_id" type="text" placeholder="Employee ID" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="editFormData.first_name" type="text" placeholder="First Name *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="editFormData.last_name" type="text" placeholder="Last Name *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="editFormData.email" type="email" placeholder="Corporate Email *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-briefcase-account"></i> structural</h4>
                   <div class="space-y-3">
                      <input v-model="editFormData.position" type="text" placeholder="Current Position *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <select v-model="editFormData.department_id" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">Select Department *</option>
                        <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                      </select>
                      <select v-model="editFormData.employment_type" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="full-time">Full-Time Direct</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Project Contract</option>
                        <option value="intern">Registry Intern</option>
                      </select>
                      <select v-model="editFormData.status" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="active">Active Service</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">Registry Leave</option>
                        <option value="terminated">Separated</option>
                      </select>
                   </div>
                </div>
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-clock-check"></i> Timeline</h4>
                   <div class="space-y-3">
                      <div>
                         <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Hire Matrix Date</label>
                         <input v-model="editFormData.hire_date" type="date" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <select v-model="editFormData.manager_id" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">Operational Manager (Optional)</option>
                        <option v-for="emp in availableEmployees" :key="emp.id" :value="emp.id">{{ emp.first_name }} {{ emp.last_name }}</option>
                      </select>
                      <input v-model="editFormData.phone" type="tel" placeholder="Registry Contact Phone" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>
             </div>

             <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Operational Background</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <textarea v-model="editFormData.address" rows="3" placeholder="Residential Matrix Address" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 shadow-sm"></textarea>
                   <div class="space-y-2">
                      <input v-model="editFormData.emergency_contact_name" type="text" placeholder="Emergency Proxy Name" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                      <input v-model="editFormData.emergency_contact_phone" type="tel" placeholder="Emergency Proxy Contact" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                   </div>
                </div>
             </div>

             <div v-if="editFormError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 font-black text-[10px] uppercase tracking-widest italic">
                {{ editFormError }}
             </div>
             <div v-if="editFormSuccess" class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                {{ editFormSuccess }}
             </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto relative z-10">
          <button @click="closeModal" class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="updating">Abort</button>
          <template v-if="modalMode === 'view'">
            <button @click="editEmployee(selectedEmployee!)" class="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 transition-all flex items-center gap-2">
               <i class="mdi mdi-account-edit-outline"></i> Modify Profile
            </button>
          </template>
          <template v-else>
            <button @click="handleUpdateEmployee" :disabled="updating" class="px-10 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center gap-2">
              <i v-if="updating" class="mdi mdi-loading mdi-spin"></i>
              {{ updating ? 'Syncing Base...' : 'Commit Changes' }}
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Enrollment Modal (Create New) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[90vh] flex flex-col">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-[90px]"></div>
        
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Enroll <span class="text-emerald-500">Talent</span>
            </h2>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel Initialization Protocol</p>
          </div>
          <button @click="closeCreateModal" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors shadow-inner">
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
           <form @submit.prevent="handleCreateEmployee" class="space-y-8 pb-4">
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-account-circle"></i> Identity</h4>
                   <div class="space-y-3">
                      <input v-model="newEmployee.employee_id" type="text" placeholder="Employee ID (Auto-gen if empty)" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="newEmployee.first_name" type="text" placeholder="First Name *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="newEmployee.last_name" type="text" placeholder="Last Name *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <input v-model="newEmployee.email" type="email" placeholder="Corporate Email *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-briefcase-account"></i> structural</h4>
                   <div class="space-y-3">
                      <input v-model="newEmployee.position" type="text" placeholder="Current Position *" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                      <select v-model="newEmployee.department_id" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">Select Department *</option>
                        <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                      </select>
                      <select v-model="newEmployee.employment_type" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="full-time">Full-Time Direct</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Project Contract</option>
                        <option value="intern">Registry Intern</option>
                      </select>
                      <select v-model="newEmployee.status" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="active">Active Service</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">Registry Leave</option>
                        <option value="terminated">Separated</option>
                      </select>
                   </div>
                </div>
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2"><i class="mdi mdi-clock-check"></i> Timeline</h4>
                   <div class="space-y-3">
                      <div>
                         <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Hire Matrix Date</label>
                         <input v-model="newEmployee.hire_date" type="date" required class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <select v-model="newEmployee.manager_id" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">Operational Manager (Optional)</option>
                        <option v-for="emp in availableEmployees" :key="emp.id" :value="emp.id">{{ emp.first_name }} {{ emp.last_name }}</option>
                      </select>
                      <input v-model="newEmployee.phone" type="tel" placeholder="Registry Contact Phone" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                </div>
             </div>

             <div class="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4">
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Operational Background</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <textarea v-model="newEmployee.address" rows="3" placeholder="Residential Matrix Address" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 shadow-sm"></textarea>
                   <div class="space-y-2">
                      <input v-model="newEmployee.emergency_contact_name" type="text" placeholder="Emergency Proxy Name" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                      <input v-model="newEmployee.emergency_contact_phone" type="tel" placeholder="Emergency Proxy Contact" class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                   </div>
                </div>
             </div>

             <div v-if="formError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 font-black text-[10px] uppercase tracking-widest italic">
                {{ formError }}
             </div>
             <div v-if="formSuccess" class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                {{ formSuccess }}
             </div>
          </form>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto relative z-10">
          <button @click="closeCreateModal" class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="saving">Abort Enrollment</button>
          <button @click="handleCreateEmployee" :disabled="saving" class="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
            <i v-if="saving" class="mdi mdi-loading mdi-spin"></i>
            {{ saving ? 'Initializing Presence...' : 'Initialize Talent' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Employee, EmployeeFilters } from '../../shared/types/employee'
import { useEmployees } from '../../shared/composables/useEmployees'
import { useApi } from '../../admin/shared/composables/useApi'

const { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee: deleteEmployeeApi } = useEmployees()
const { get } = useApi()
const filters = ref<EmployeeFilters>({})
const availableDepartments = ref<Array<{id: number, name: string}>>([])
const availableEmployees = ref<Array<{id: number, first_name: string, last_name: string, position: string}>>([])
const showModal = ref(false)
const showCreateModal = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const modalMode = ref<'view' | 'edit'>('view')
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const updating = ref(false)
const editFormError = ref('')
const editFormSuccess = ref('')

const newEmployee = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  department_id: undefined as number | undefined,
  salary: 0,
  employment_type: 'full-time' as const,
  status: 'active' as const,
  hire_date: new Date().toISOString().split('T')[0],
  manager_id: undefined as number | undefined,
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: ''
})

const editFormData = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  department_id: undefined as number | undefined,
  salary: 0,
  employment_type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern',
  status: 'active' as 'active' | 'inactive' | 'terminated' | 'on-leave',
  hire_date: '',
  manager_id: undefined as number | undefined,
  address: '',
  date_of_birth: '',
  emergency_contact_name: '',
  emergency_contact_phone: ''
})

const viewEmployee = (employee: Employee) => {
  selectedEmployee.value = employee
  modalMode.value = 'view'
  showModal.value = true
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
    employee_id: employee.employee_id || '',
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone || '',
    position: employee.position,
    department_id: employee.department_id || undefined,
    salary: employee.salary ?? 0,
    employment_type: employee.employment_type,
    status: employee.status,
    hire_date: employee.hire_date.split('T')[0],
    manager_id: employee.manager_id || undefined,
    address: employee.address || '',
    date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
    emergency_contact_name: employee.emergency_contact?.name || '',
    emergency_contact_phone: employee.emergency_contact?.phone || ''
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
    employee_id: '', first_name: '', last_name: '', email: '', phone: '', position: '', department_id: undefined,
    salary: 0, employment_type: 'full-time', status: 'active', hire_date: new Date().toISOString().split('T')[0],
    manager_id: undefined, address: '', emergency_contact_name: '', emergency_contact_phone: ''
  }
}

const handleCreateEmployee = async () => {
  if (!newEmployee.value.first_name || !newEmployee.value.last_name || !newEmployee.value.email ||
      !newEmployee.value.position || !newEmployee.value.department_id || !newEmployee.value.hire_date) {
    formError.value = 'Required protocol nodes missing.'; return
  }

  saving.value = true
  formError.value = formSuccess.value = ''

  try {
    let emergencyContact = undefined
    if (newEmployee.value.emergency_contact_name || newEmployee.value.emergency_contact_phone) {
      emergencyContact = { name: newEmployee.value.emergency_contact_name, relationship: 'Emergency contact', phone: newEmployee.value.emergency_contact_phone }
    }

    const employeeData = { ...newEmployee.value, department_id: newEmployee.value.department_id as number, emergency_contact: emergencyContact }
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
    let emergencyContact = undefined
    if (editFormData.value.emergency_contact_name || editFormData.value.emergency_contact_phone) {
      emergencyContact = { name: editFormData.value.emergency_contact_name, relationship: 'Emergency contact', phone: editFormData.value.emergency_contact_phone }
    }
    const employeeData = { ...editFormData.value, department_id: editFormData.value.department_id as number, emergency_contact: emergencyContact }
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
  await fetchEmployees(); await fetchDepartments(); await fetchAvailableEmployees()
})
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
