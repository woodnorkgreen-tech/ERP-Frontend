<template>
  <div class="space-y-8 pb-12">
    <!-- Premium Header & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/dashboard" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-500 transition-colors">
                Intelligence Hub
              </router-link>
            </li>
            <li>
              <div class="flex items-center gap-2">
                <i class="mdi mdi-chevron-right text-slate-300 text-xs"></i>
                <router-link to="/client-service" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-500 transition-colors">
                  Deployment
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center gap-2">
                <i class="mdi mdi-chevron-right text-slate-300 text-xs"></i>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Clients</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
          Clients <span class="text-blue-500 text-3xl opacity-50">/</span> Management
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Unified repository for global client relations and Lead tracking.</p>
      </div>

      <button
        @click="showCreateModal = true"
        class="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-[1.5rem] shadow-xl shadow-blue-500/10 transition-all font-bold text-sm tracking-tight group"
      >
        <i class="mdi mdi-account-plus-outline text-xl transition-transform group-hover:scale-110"></i>
        ONBOARD CLIENT
      </button>
    </div>

    <!-- Smart Filter Hub -->
    <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
       <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div class="flex items-center gap-3 w-full xl:w-auto">
             <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <i class="mdi mdi-filter-variant text-xl"></i>
             </div>
             <div>
                <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Intelligence Filters</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refine Client Database</p>
             </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 xl:flex items-center gap-4 w-full xl:w-auto">
             <!-- Search -->
             <div class="relative group w-full md:w-auto xl:w-80">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <i class="mdi mdi-magnify text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg"></i>
                </div>
                <input
                   v-model="filters.search"
                   type="text"
                   placeholder="Search Identity..."
                   class="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm group-hover:shadow-md"
                />
             </div>

             <!-- Status Filter -->
             <div class="relative w-full md:w-auto xl:w-48">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <i class="mdi mdi-list-status text-slate-400 text-lg"></i>
                </div>
                <select
                   v-model="filters.status"
                   class="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                   <option value="">All Statuses</option>
                   <option value="active">Active Operations</option>
                   <option value="inactive">Suspended</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                   <i class="mdi mdi-chevron-down text-slate-400"></i>
                </div>
             </div>

             <!-- Company Filter -->
             <div class="relative w-full md:w-auto xl:w-64">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <i class="mdi mdi-domain text-slate-400 text-lg"></i>
                </div>
                <input
                   v-model="filters.company"
                   type="text"
                   placeholder="Filter by Hub..."
                   class="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
             </div>
          </div>
       </div>
    </div>

    <!-- Data Grid -->
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-20 flex flex-col items-center gap-6">
        <div class="relative">
           <div class="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-blue-500 animate-spin"></div>
           <i class="mdi mdi-account-sync absolute inset-0 flex items-center justify-center text-blue-500 text-xl"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Clients Cluster</p>
      </div>

      <div v-else-if="error" class="p-12 text-center space-y-4">
        <i class="mdi mdi-alert-circle text-5xl text-red-500 opacity-20"></i>
        <p class="text-sm font-bold text-red-500">CRITICAL SYNC FAILURE: {{ error }}</p>
        <button @click="fetchClients({ paginate: true, per_page: 15 })" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Emergency Re-sync</button>
      </div>

      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th @click="sortClients('FullName')" class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer group">
                <span class="flex items-center gap-2">
                   Client Identity
                   <i class="mdi mdi-sort opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </span>
              </th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Contact Vector</th>
              <th @click="sortClients('companyName')" class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 cursor-pointer group">
                <span class="flex items-center gap-2">
                   Client Hub
                   <i class="mdi mdi-sort opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </span>
              </th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Operation Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Deployment</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="client in clients" :key="client.id" 
                class="group transition-all hover:bg-slate-50 dark:hover:bg-blue-600/5 cursor-pointer"
                :class="{ 'opacity-50 grayscale': !client.isActive }">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <span class="text-lg font-black text-white leading-none">{{ client.FullName.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white tracking-tight">{{ client.FullName }}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">EST. {{ client.registration_date }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <i class="mdi mdi-account-star text-blue-500"></i>
                    {{ client.ContactPerson }}
                  </div>
                  <div class="flex items-center gap-2 text-[11px] font-medium text-slate-400 truncate max-w-[180px]">
                    <i class="mdi mdi-email-outline"></i>
                    {{ client.Email }}
                  </div>
                  <div class="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <i class="mdi mdi-phone-outline"></i>
                    {{ client.Phone }}
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="flex flex-col">
                  <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{{ client.companyName || 'GLOBAL INDIVIDUAL' }}</span>
                  <span class="text-[9px] font-black text-blue-500/60 uppercase tracking-widest">{{ client.Industry || 'UNDISCLOSED' }}</span>
                </div>
              </td>
              <td class="px-8 py-5">
                <div :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm',
                  client.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                ]">
                  <span class="w-1.5 h-1.5 rounded-full mr-2" :class="client.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ client.status }}
                </div>
              </td>
              <td class="px-8 py-5">
                 <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button @click.stop="viewClientDetails(client)" 
                            class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                            title="Intelligence Overview">
                       <i class="mdi mdi-eye-outline text-lg"></i>
                    </button>
                    <button v-if="client.isActive" @click.stop="editClient(client)" 
                            class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center"
                            title="Modify Profile">
                       <i class="mdi mdi-pencil-outline text-lg"></i>
                    </button>
                    <button @click.stop="handleToggleClick(client)" 
                            :class="client.isActive ? 'hover:bg-amber-600' : 'hover:bg-emerald-600'"
                            class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white transition-all flex items-center justify-center"
                            :title="client.isActive ? 'Suspend Access' : 'Restore Operations'">
                       <i :class="['mdi text-lg', client.isActive ? 'mdi-account-off-outline' : 'mdi-account-check-outline']"></i>
                    </button>
                    <button v-if="canDeleteClients" @click.stop="handleDeleteClick(client)" 
                            class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                            title="Terminate Profile">
                       <i class="mdi mdi-delete-outline text-lg"></i>
                    </button>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="pagination && pagination.total > 0" class="flex items-center justify-between px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <div class="text-sm font-medium text-slate-500 dark:text-slate-400">
          Showing {{ ((pagination.current_page - 1) * pagination.per_page + 1) }} to
          {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
          of {{ pagination.total }} clients
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <i class="mdi mdi-chevron-left"></i>
            Previous
          </button>

          <div class="flex items-center gap-1">
            <template v-for="page in getVisiblePages()" :key="page">
              <button
                v-if="page > 0"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all',
                  page === pagination.current_page
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 py-2 text-slate-400">...</span>
            </template>
          </div>

          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Onboarding / Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div @click="closeModal" class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>
      
      <div class="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <!-- Header -->
        <div class="relative p-10 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
          <div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2 block">Identity Registration</span>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
               {{ editingClient ? 'Profile Reconstruction' : 'New Client Onboarding' }}
            </h2>
          </div>
          <button @click="closeModal" class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center">
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <div class="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
           <form @submit.prevent="handleFormSubmit" class="space-y-10">
              <!-- Tier 1: Core Identity -->
              <section class="space-y-6">
                 <div class="flex items-center gap-3">
                    <div class="h-8 w-1 bg-blue-500 rounded-full"></div>
                    <h3 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Core Identity</h3>
                 </div>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Name *</label>
                       <input v-model="clientFormData.FullName" type="text" required class="premium-input" placeholder="e.g. Johnathan Arc"/>
                    </div>
                    <div class="space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Protocol *</label>
                       <input v-model="clientFormData.ContactPerson" type="text" required class="premium-input" placeholder="Liaison Name"/>
                    </div>
                    <div class="space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Communication Hub *</label>
                       <input v-model="clientFormData.Email" type="email" required class="premium-input" placeholder="alias@provider.com"/>
                    </div>
                 </div>
              </section>

              <!-- Tier 2: Vectors & Acquisition -->
              <section class="space-y-6">
                 <div class="flex items-center gap-3">
                    <div class="h-8 w-1 bg-emerald-500 rounded-full"></div>
                    <h3 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Intelligence Vectors</h3>
                 </div>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Matrix *</label>
                       <input v-model="clientFormData.Phone" type="tel" required class="premium-input" placeholder="+12 345..."/>
                    </div>
                    <div class="space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institution Identity *</label>
                       <input v-model="clientFormData.companyName" type="text" required class="premium-input" placeholder="Collective Corp"/>
                    </div>
                    <div class="space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lead Source *</label>
                       <select v-model="clientFormData.LeadSource" required class="premium-input appearance-none">
                          <option value="">Select Origin</option>
                          <option value="Website">Digital Web</option>
                          <option value="Referral">Network Referral</option>
                          <option value="Walk-in">Direct Engagement</option>
                          <option value="Sales Team">Internal Sales</option>
                          <option value="Events">Operational Events</option>
                       </select>
                    </div>
                 </div>
              </section>

              <!-- Tier 3: Locational Hub -->
              <section class="space-y-6">
                 <div class="flex items-center gap-3">
                    <div class="h-8 w-1 bg-amber-500 rounded-full"></div>
                    <h3 class="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Deployment Coordinates</h3>
                 </div>
                 <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div class="lg:col-span-8 space-y-1.5">
                       <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Physical coordinate Cluster *</label>
                       <textarea v-model="clientFormData.Address" required rows="2" class="premium-input pt-4" placeholder="Unified Address Strings..."></textarea>
                    </div>
                    <div class="lg:col-span-4 grid grid-cols-1 gap-4">
                       <input v-model="clientFormData.City" type="text" required class="premium-input" placeholder="Primary Node (City)"/>
                       <input v-model="clientFormData.County" type="text" required class="premium-input" placeholder="(County)"/>
                    </div>
                 </div>
              </section>
           </form>
        </div>

        <!-- Footer -->
        <div class="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
           <div class="flex items-center gap-4">
              <div v-if="formError" class="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                 <i class="mdi mdi-alert-circle"></i>
                 {{ formError }}
              </div>
              <div v-if="formSuccess" class="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                 <i class="mdi mdi-check-circle"></i>
                 {{ formSuccess }}
              </div>
           </div>

           <div class="flex items-center gap-4">
              <button @click="closeModal" :disabled="saving" class="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Abort</button>
              <button @click="handleFormSubmit" :disabled="saving" class="premium-button min-w-[200px]">
                 <span v-if="saving" class="mdi mdi-loading animate-spin text-lg mr-2"></span>
                 {{ saving ? 'COMMITTING...' : (editingClient ? 'OVERWRITE PROFILE' : 'COMMIT REGISTRATION') }}
              </button>
           </div>
        </div>
      </div>
    </div>

    <!-- View Client Intelligence Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div @click="showViewModal = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"></div>
      
      <div class="relative w-full max-w-5xl bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-500">
         <div v-if="viewLoading" class="p-40 flex flex-col items-center justify-center gap-6">
            <div class="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Client Intel...</p>
         </div>

         <div v-else-if="viewingClient" class="flex flex-col h-full max-h-[90vh]">
            <!-- Side Hero -->
            <div class="relative bg-slate-900 p-12 text-white border-b border-white/5">
               <div class="absolute top-0 right-0 p-8">
                  <button @click="showViewModal = false" class="text-white/20 hover:text-white transition-colors">
                     <i class="mdi mdi-close text-3xl"></i>
                  </button>
               </div>
               
               <div class="flex flex-col md:flex-row items-center gap-10">
                  <div class="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shrink-0">
                     <span class="text-5xl font-black">{{ viewingClient.FullName.charAt(0) }}</span>
                  </div>
                  <div class="text-center md:text-left">
                     <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-blue-500/20">Active Client</span>
                     <h2 class="text-5xl font-black tracking-tighter mt-4">{{ viewingClient.FullName }}</h2>
                     <p class="text-slate-400 font-medium text-lg mt-1">{{ viewingClient.companyName || 'Global Direct Client' }}</p>
                  </div>
               </div>

               <div class="flex flex-wrap gap-8 mt-12 bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400"><i class="mdi mdi-email-check-outline text-2xl"></i></div>
                     <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Protocol</p>
                        <p class="text-sm font-bold">{{ viewingClient.Email }}</p>
                     </div>
                  </div>
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400"><i class="mdi mdi-phone-voip text-2xl"></i></div>
                     <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Matrix</p>
                        <p class="text-sm font-bold">{{ viewingClient.Phone }}</p>
                     </div>
                  </div>
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400"><i class="mdi mdi-map-marker-radius text-2xl"></i></div>
                     <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Hub</p>
                        <p class="text-sm font-bold">{{ viewingClient.City }}, {{ viewingClient.County }}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div class="flex-1 p-12 overflow-y-auto custom-scrollbar">
               <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div class="lg:col-span-7 space-y-12">
                     <section>
                        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                           <i class="mdi mdi-text-box-search-outline text-blue-500"></i>
                           Client Metadata
                        </h4>
                        <div class="grid grid-cols-2 gap-x-12 gap-y-8">
                           <div class="space-y-1">
                              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Customer Type</p>
                              <p class="text-sm font-bold text-slate-900 dark:text-white capitalize">{{ viewingClient.CustomerType }} Entity</p>
                           </div>
                           <div class="space-y-1">
                              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Institutional Sector</p>
                              <p class="text-sm font-bold text-slate-900 dark:text-white">{{ viewingClient.Industry || 'N/A' }}</p>
                           </div>
                           <div class="space-y-1">
                              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Engagement Protocol</p>
                              <p class="text-sm font-bold text-slate-900 dark:text-white capitalize">{{ viewingClient.PreferredContact }}</p>
                           </div>
                           <div class="space-y-1">
                              <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Registration Epoch</p>
                              <p class="text-sm font-bold text-slate-900 dark:text-white">{{ viewingClient.registration_date }}</p>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                           <i class="mdi mdi-earth text-emerald-500"></i>
                           Geo-Spatial Identity
                        </h4>
                        <div class="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                           <p class="text-sm font-medium leading-relaxed italic text-slate-600 dark:text-slate-300">"{{ viewingClient.Address }}"</p>
                           <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4">
                              <div><p class="text-[9px] font-black text-slate-400 uppercase">Zip/Postal</p><p class="text-xs font-bold">{{ viewingClient.PostalAddress || '---' }}</p></div>
                              <div><p class="text-[9px] font-black text-slate-400 uppercase">Sector</p><p class="text-xs font-bold">{{ viewingClient.County }}</p></div>
                              <div><p class="text-[9px] font-black text-slate-400 uppercase">Region</p><p class="text-xs font-bold">EMEA</p></div>
                           </div>
                        </div>
                     </section>
                  </div>

                  <div class="lg:col-span-5 space-y-8">
                      <div class="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
                         <h4 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-8">Performance History</h4>
                         <div class="space-y-6">
                            <div class="flex items-center justify-between">
                               <span class="text-sm font-bold uppercase tracking-tighter">Engagement Pulse</span>
                               <span class="px-2 py-1 bg-white/10 rounded-lg text-xs font-black tracking-widest uppercase">98.2%</span>
                            </div>
                            <div class="bg-white/10 h-1.5 rounded-full overflow-hidden">
                               <div class="h-full bg-white transition-all duration-1000" style="width: 98.2%"></div>
                            </div>
                         </div>
                         <p class="text-[11px] font-medium text-white/60 mt-8 leading-relaxed">System has flagged this client as 'High Priority' based on lead velocity.</p>
                      </div>

                      <div class="p-8 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                         <div class="flex items-center gap-3 mb-6">
                            <i class="mdi mdi-clock-outline text-slate-400"></i>
                            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Logs</h4>
                         </div>
                         <div class="space-y-4">
                            <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                               <span>Identity Logged:</span>
                               <span class="text-slate-900 dark:text-white">{{ new Date(viewingClient.created_at).toLocaleDateString() }}</span>
                            </div>
                            <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex justify-between">
                               <span>Last Sync:</span>
                               <span class="text-slate-900 dark:text-white">{{ new Date(viewingClient.updated_at).toLocaleDateString() }}</span>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Suspension Protocol Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div @click="showConfirmDialog = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95">
        <div class="w-20 h-20 rounded-[2rem] bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
           <i class="mdi mdi-account-cog text-4xl"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Status Update Protocol</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10 leading-relaxed">
          Are you sure you want to {{ clientToToggle?.isActive ? 'SUSPEND' : 'RESTORE' }} operational access for <span class="text-slate-900 dark:text-white font-black">{{ clientToToggle?.FullName }}</span>? 
        </p>
        <div class="flex gap-4">
          <button @click="showConfirmDialog = false; clientToToggle = null" class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
          <button @click="confirmToggle" class="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Authorize</button>
        </div>
      </div>
    </div>

    <!-- Termination / Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div @click="showDeleteDialog = false" class="absolute inset-0 bg-red-900/10 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-red-500/20 text-center animate-in zoom-in-95">
        <div class="w-20 h-20 rounded-[2rem] bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
           <i class="mdi mdi-delete-variant text-4xl"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 text-red-600">Permanently Terminate</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10 leading-relaxed italic">
          CRITICAL: Unauthorized termination of <span class="text-red-600 font-bold underline">{{ clientToDelete?.FullName }}</span> will delete all associated institutional data. This action is irreversible.
        </p>
        <div class="flex gap-4">
          <button @click="showDeleteDialog = false; clientToDelete = null" class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
          <button @click="confirmDelete" class="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transform transition-all hover:scale-105 active:scale-95">DESTRUCT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { Client, CreateClientData, UpdateClientData } from '../types/client'
import { useClients } from '../composables/useClients'
import { useAuth } from '@/composables/useAuth'

const { clients, pagination, loading, error, fetchClients, createClient, updateClient, toggleClientStatus, fetchClient, deleteClient } = useClients()
const { user } = useAuth()
const filters = ref({ search: '', status: '', company: '' })
const showCreateModal = ref(false)
const editingClient = ref<Client | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const sortKey = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const showConfirmDialog = ref(false)
const clientToToggle = ref<Client | null>(null)
const showViewModal = ref(false)
const viewingClient = ref<Client | null>(null)
const viewLoading = ref(false)
const showDeleteDialog = ref(false)
const clientToDelete = ref<Client | null>(null)
const deleting = ref(false)

// Check if user has permission to delete clients
const canDeleteClients = computed(() => {
  const userRoles = user.value?.roles || []
  return userRoles.includes('Super Admin') || 
         userRoles.includes('Admin') || 
         userRoles.includes('Client Service')
})

const sortClients = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
  clients.value.sort((a: Client, b: Client) => {
    const aVal = a.companyName || ''
    const bVal = b.companyName || ''
    const aStr = aVal.toLowerCase()
    const bStr = bVal.toLowerCase()
    if (aStr < bStr) return sortDirection.value === 'asc' ? -1 : 1
    if (aStr > bStr) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
}

const clientFormData = ref<CreateClientData>({
  FullName: '',
  ContactPerson: '',
  Email: '',
  Phone: '',
  AltContact: '',
  Address: '',
  City: '',
  County: '',
  PostalAddress: '',
  CustomerType: 'individual',
  LeadSource: '',
  PreferredContact: 'email',
  Industry: '',
  companyName: ''
})

const applyFilters = () => {
  fetchClients({
    ...filters.value,
    paginate: true,
    page: 1, // Reset to first page when applying filters
    per_page: pagination.value?.per_page || 15
  })
}

// Watch filters for automatic filtering with debounce
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(filters, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  debounceTimer = setTimeout(() => {
    applyFilters()
  }, 500)
}, { deep: true })

const changePage = (page: number) => {
  fetchClients({
    ...filters.value,
    paginate: true,
    page,
    per_page: pagination.value?.per_page || 15
  })
}

const getVisiblePages = () => {
  const paginationData = pagination.value
  if (!paginationData) return []

  const current = paginationData.current_page
  const last = paginationData.last_page
  const pages: number[] = []

  // Always show first page
  if (1 < current - 2) {
    pages.push(1)
    if (2 < current - 2) pages.push(-1) // Ellipsis
  }

  // Show pages around current page
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }

  // Always show last page
  if (last > current + 2) {
    if (last - 1 > current + 2) pages.push(-1) // Ellipsis
    pages.push(last)
  }

  return pages
}

const editClient = (client: Client) => {
  editingClient.value = client
  clientFormData.value = {
    FullName: client.FullName,
    ContactPerson: client.ContactPerson,
    Email: client.Email,
    Phone: client.Phone,
    AltContact: client.AltContact || '',
    Address: client.Address,
    City: client.City,
    County: client.County,
    PostalAddress: client.PostalAddress || '',
    CustomerType: client.CustomerType,
    LeadSource: client.LeadSource,
    PreferredContact: client.PreferredContact,
    Industry: client.Industry || '',
    companyName: client.companyName || ''
  }
  showCreateModal.value = true
}

const viewClientDetails = async (client: Client) => {
  viewLoading.value = true
  showViewModal.value = true
  try {
    viewingClient.value = await fetchClient(client.id)
  } catch (err) {
    console.error('Error fetching client details:', err)
    viewingClient.value = client // fallback to the list data
  } finally {
    viewLoading.value = false
  }
}

const handleToggleClick = (client: Client) => {
  clientToToggle.value = client
  showConfirmDialog.value = true
}

const confirmToggle = async () => {
  if (!clientToToggle.value) return
  try {
    await toggleClientStatus(clientToToggle.value.id)
    await fetchClients({
      ...filters.value,
      paginate: true,
      page: pagination.value?.current_page || 1,
      per_page: pagination.value?.per_page || 15
    })
  } catch (err) {
    console.error('Error toggling client status:', err)
  } finally {
    showConfirmDialog.value = false
    clientToToggle.value = null
  }
}

const handleDeleteClick = (client: Client) => {
  clientToDelete.value = client
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!clientToDelete.value) return
  deleting.value = true
  try {
    await deleteClient(clientToDelete.value.id)
    await fetchClients({
      ...filters.value,
      paginate: true,
      page: pagination.value?.current_page || 1,
      per_page: pagination.value?.per_page || 15
    })
  } catch (err) {
    console.error('Error deleting client:', err)
    formError.value = 'Failed to delete client. Please try again.'
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
    clientToDelete.value = null
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingClient.value = null
  formError.value = ''
  formSuccess.value = ''
  clientFormData.value = {
    FullName: '',
    ContactPerson: '',
    Email: '',
    Phone: '',
    AltContact: '',
    Address: '',
    City: '',
    County: '',
    PostalAddress: '',
    CustomerType: 'individual',
    LeadSource: '',
    PreferredContact: 'email',
    Industry: '',
    companyName: ''
  }
}

const handleFormSubmit = async () => {
  // Basic validation
  if (!clientFormData.value.FullName || !clientFormData.value.ContactPerson ||
      !clientFormData.value.Email || !clientFormData.value.Phone ||
      !clientFormData.value.Address || !clientFormData.value.City ||
      !clientFormData.value.County || !clientFormData.value.LeadSource ||
      !clientFormData.value.companyName) {
    formError.value = 'Please fill in all required fields'
    return
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    if (editingClient.value) {
      // Update existing client
      await updateClient(editingClient.value.id, clientFormData.value as UpdateClientData)
      formSuccess.value = 'Client updated successfully!'
    } else {
      // Create new client
      await createClient(clientFormData.value)
      formSuccess.value = 'Client created successfully!'
    }

    // Refresh client list with current pagination
    await fetchClients({
      ...filters.value,
      paginate: true,
      page: pagination.value?.current_page || 1,
      per_page: pagination.value?.per_page || 15
    })

    // Close modal after a short delay
    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { status: number, data?: { message?: string, errors?: Record<string, string[]> } } }
      
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
         // Validation errors
         const errors = axiosError.response.data.errors
         const errorMessages = Object.values(errors).flat()
         formError.value = errorMessages[0] || 'Validation failed. Please check your entries.'
      } else {
         formError.value = axiosError.response?.data?.message || 'An error occurred during submission.'
      }
    } else if (err instanceof Error) {
      formError.value = err.message
    } else {
      formError.value = 'An unexpected error occurred.'
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchClients({ paginate: true, per_page: 15 })
})
</script>

<style scoped>
@reference "tailwindcss";

.premium-input {
  @apply w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400;
}

.premium-button {
  @apply px-8 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors;
}

@keyframes animate-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes zoom-in-95 {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: animate-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.zoom-in-95 {
  animation: zoom-in-95 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
