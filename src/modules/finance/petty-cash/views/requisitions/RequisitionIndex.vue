<template>
  <div class="space-y-6">
    <!-- Header Area -->
    <div v-if="!isEmbedded" class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Finance & Accounts Requisitions
        </h1>
        <p class="text-[12px] font-semibold text-slate-500 uppercase tracking-widest mt-1.5">
          Internal Expense Management Portal
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="fetchRequisitions"
          class="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 transition-all font-bold rounded-lg"
          title="Refresh Data"
        >
          <i class="mdi mdi-refresh text-lg" :class="{ 'animate-spin': loading }"></i>
        </button>
        <button
          @click="copyPublicLink"
          class="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-4 py-3 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-100 dark:border-purple-800"
        >
          <i class="mdi mdi-share-variant text-lg"></i>
          <span>{{ linkCopied ? 'Link Copied' : 'Share Public Link' }}</span>
        </button>
        <button
          @click="openNewRequisition"
          class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm"
        >
          New Requisition
        </button>
      </div>
    </div>

    <!-- Dynamic Filter & Status Hub -->
    <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800">
      <div class="flex flex-col xl:flex-row gap-8 items-start xl:items-center">
        
        <!-- Section: Search & Chronology -->
        <div class="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div class="relative w-full sm:w-80">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search reference, purpose or category..."
              class="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white text-[13px] font-semibold shadow-sm transition-all placeholder:text-slate-400 placeholder:font-medium"
              @input="debounceSearch"
            />
          </div>
          
          <div class="flex items-center gap-2 shrink-0">
             <div class="flex items-center bg-white dark:bg-slate-900 rounded-lg px-4 py-2 border border-slate-200 dark:border-slate-700 shadow-sm gap-3">
                <input
                  v-model="filters.start_date"
                  type="date"
                  class="bg-transparent border-none text-[11px] font-bold text-slate-900 dark:text-slate-200 w-28 focus:ring-0 p-0"
                  @change="fetchRequisitions"
                />
                <span class="text-slate-300 font-bold">/</span>
                <input
                  v-model="filters.end_date"
                  type="date"
                  class="bg-transparent border-none text-[11px] font-bold text-slate-900 dark:text-slate-200 w-28 focus:ring-0 p-0"
                  @change="fetchRequisitions"
                />
             </div>
             <button 
                v-if="filters.start_date || filters.end_date"
                @click="clearDates"
                class="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all"
              >
                Clear
              </button>
          </div>
        </div>

        <!-- Section: Interactive Status Tabs -->
        <div class="flex items-center gap-6 overflow-x-auto no-scrollbar w-full xl:w-auto">
          <button
            @click="setStatus('')"
            :class="[
              'pb-1 border-b-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all shrink-0',
              filters.status === '' ? 'text-slate-900 dark:text-white border-slate-900 dark:border-white' : 'text-slate-400 border-transparent hover:text-slate-600'
            ]"
          >
            All
          </button>

          <button
            v-for="status in ['all', 'pending', 'approved', 'disbursed', 'received', 'rejected']"
            :key="status"
            @click="setStatus(status === 'all' ? '' : status)"
            :class="[
              'px-5 py-2.5 rounded-xl border transition-all duration-300 flex items-center gap-3 whitespace-nowrap group',
              (filters.status === status || (status === 'all' && !filters.status))
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105' 
                : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700 text-slate-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
            ]"
          >
             <span 
               :class="[
                 'text-[11px] font-bold uppercase tracking-widest',
                 (filters.status === status || (status === 'all' && !filters.status)) ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
               ]"
             >
               {{ status === 'disbursed' ? 'Paid' : (status === 'all' ? 'All' : status) }}
             </span>
             <span 
               :class="[
                 'text-[10px] px-2 py-0.5 rounded-lg font-black font-technical',
                 (filters.status === status || (status === 'all' && !filters.status)) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
               ]"
             >
               {{ getStatusCount(status) }}
             </span>
          </button>

          <!-- Divider -->
          <div class="hidden xl:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <!-- Monthly Volume Metric (Minimalist) -->
          <div class="flex items-center gap-2">
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monthly Vol:</span>
             <span class="text-xs font-black text-slate-900 dark:text-white font-mono">{{ formatCurrency(requisitionStats?.monthly?.amount || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Area: Professional Financial Table -->
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[600px] transition-all">
      
      <!-- Table Header / Stats Bar -->
      <div class="px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction Registry</span>
          <div class="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
          <span class="text-[10px] font-black font-mono text-slate-900 dark:text-white">{{ meta.total }} Total Records</span>
        </div>
<<<<<<< Updated upstream
        
        <div class="flex items-center gap-2">
           <div class="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500 anim-pulse"></div>
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">Live Registry</span>
           </div>
=======

        <!-- Scrollable List -->
        <div class="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2 rounded-b-[2.5rem] pr-1">
          <div v-if="loading && !requisitions.length" class="space-y-2 p-2" >
            <div v-for="i in 5" :key="i" class="h-20 bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
          </div>
          
          <div 
            v-else-if="requisitions.length === 0" 
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <i class="mdi mdi-tray-blank text-4xl text-slate-200 mb-2"></i>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No Requests</p>
          </div>

          <button
            v-for="req in requisitions"
            :key="req.id"
            @click="selectRequisition(req)"
            :class="[
              'w-full text-left p-4 transition-all relative group overflow-hidden border-b last:border-b-0 pl-7',
              selectedId === req.id 
                ? 'bg-slate-900 shadow-2xl z-10' 
                : [
                    'bg-white dark:bg-slate-800/40 border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/60',
                    getStatusBgColor(req.status)
                  ]
            ]"
          >
            <!-- Left Status Strip -->
            <div 
              class="absolute inset-y-0 left-0 w-1 transition-all duration-300"
              :class="getStatusDotColor(req.status)"
            ></div>

            <!-- Background Accent (Selected - Right) -->
            <div v-if="selectedId === req.id" class="absolute inset-y-0 right-0 w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>

            <div class="relative z-10 space-y-3">
              <!-- Row 1: Document ID, Status & Date -->
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                   <span 
                    class="text-[9px] font-black uppercase tracking-[0.2em] font-technical"
                    :class="selectedId === req.id ? 'text-blue-400' : 'text-slate-400'"
                  >
                    {{ req.requisition_number }}
                  </span>
                  <span 
                    v-if="req.is_public"
                    class="px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest bg-purple-500 text-white"
                  >
                    Public
                  </span>
                </div>
                <div class="flex items-center gap-2">
                   <span class="text-[9px] font-bold text-slate-400 font-technical">{{ formatDate(req.created_at) }}</span>
                   <div 
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      selectedId === req.id ? 'bg-blue-400 anim-pulse' : getStatusDotColor(req.status)
                    ]"
                  ></div>
                </div>
              </div>

              <!-- Row 2: Purpose (Primary Read) -->
              <h4 
                class="text-[13px] font-black uppercase tracking-tight leading-tight line-clamp-2"
                :class="selectedId === req.id ? 'text-white' : 'text-slate-900 dark:text-slate-100'"
              >
                {{ req.purpose }}
              </h4>

              <!-- Row 3: Metadata (Project & Payee) -->
              <div class="grid grid-cols-2 gap-2">
                 <!-- Associated Entity -->
                 <div class="flex items-center gap-2 overflow-hidden">
                    <i class="mdi mdi-briefcase-variant-outline text-[11px]" :class="selectedId === req.id ? 'text-blue-400' : 'text-slate-400'"></i>
                    <span 
                      class="text-[9px] font-bold uppercase tracking-tight truncate"
                      :class="selectedId === req.id ? 'text-slate-300' : 'text-slate-500'"
                    >
                      {{ req.project?.enquiry?.title || req.project_name || 'General Operations' }}
                    </span>
                 </div>
                 <!-- Recipient -->
                 <div class="flex items-center gap-2 overflow-hidden justify-end">
                    <span 
                      class="text-[9px] font-bold uppercase tracking-tight truncate text-right"
                      :class="selectedId === req.id ? 'text-slate-300' : 'text-slate-500'"
                    >
                      {{ req.is_public ? req.requester_name : (req.requester?.name || 'Staff') }}
                    </span>
                    <i class="mdi mdi-account-circle-outline text-[11px]" :class="selectedId === req.id ? 'text-blue-400' : 'text-slate-400'"></i>
                 </div>
              </div>

              <!-- Row 4: Financial Summary -->
              <div class="flex items-center justify-between pt-2 border-t" :class="selectedId === req.id ? 'border-white/10' : 'border-slate-50 dark:border-slate-700/50'">
                 <div class="flex items-center gap-2">
                    <span 
                      class="text-[10px] font-black uppercase tracking-[0.2em]"
                      :class="selectedId === req.id ? 'text-slate-400' : 'text-slate-300'"
                    >
                      Total Allocation
                    </span>
                 </div>
                 <span 
                  class="text-[15px] font-black font-technical tabular-nums tracking-tighter"
                  :class="selectedId === req.id ? 'text-blue-400' : 'text-slate-900 dark:text-slate-100'"
                >
                  {{ formatCurrency(req.total_amount) }}
                </span>
              </div>
            </div>

            <!-- Enhanced Status Label (Floating Overlay on hover) -->
            <div 
              v-if="selectedId !== req.id"
              class="absolute top-0 right-0 py-1 px-3 text-white text-[7px] font-black uppercase tracking-widest transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"
              :class="getStatusDotColor(req.status)"
            >
               {{ req.status === 'disbursed' ? 'Paid' : req.status }}
            </div>
          </button>
        </div>

        <!-- Pagination (Mini) -->
        <div v-if="meta.last_page > 1" class="p-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
          <button @click="changePage(meta.current_page - 1)" :disabled="meta.current_page === 1" class="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-20"><i class="mdi mdi-chevron-left"></i></button>
          <span class="text-[10px] font-black text-slate-400">{{ meta.current_page }} / {{ meta.last_page }}</span>
          <button @click="changePage(meta.current_page + 1)" :disabled="meta.current_page === meta.last_page" class="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-20"><i class="mdi mdi-chevron-right"></i></button>
>>>>>>> Stashed changes
        </div>
      </div>

      <!-- Scrollable Table Area -->
      <div class="flex-grow overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse table-fixed min-w-[1200px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
              <th class="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-40">Reference</th>
              <th class="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-40">Submission</th>
              <th class="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-64">Beneficiary</th>
              <th class="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Purpose & Detail</th>
              <th class="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-64">Project / Job</th>
              <th class="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-40 text-right">Total Amount</th>
              <th class="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-32 text-center">Status</th>
              <th class="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800/50">
            <template v-if="loading && !requisitions.length">
              <tr v-for="i in 8" :key="i" class="animate-pulse">
                <td colspan="8" class="px-8 py-4"><div class="h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl"></div></td>
              </tr>
            </template>

            <tr 
              v-for="req in requisitions" 
              :key="req.id"
              @click="openPreview(req)"
              class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
            >
              <!-- Ref # -->
               <td class="px-8 py-4">
                <div class="flex items-center gap-3">
                  <span class="text-[13px] font-bold font-technical text-slate-900 dark:text-white tracking-tight">{{ req.requisition_number }}</span>
                  <span v-if="req.is_public" class="px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-widest bg-purple-600 text-white">Public</span>
                </div>
              </td>

              <!-- Date -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-[12px] font-bold text-slate-800 dark:text-slate-200">{{ formatDate(req.created_at) }}</span>
                  <span class="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">{{ formatTime(req.created_at) }}</span>
                </div>
              </td>

              <!-- Beneficiary -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
                    <i class="mdi mdi-account-circle-outline text-xl"></i>
                  </div>
                  <div class="flex flex-col overflow-hidden">
                    <span class="text-[12px] font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">
                      {{ req.is_public ? req.requester_name : (req.requester?.name || 'Staff') }}
                    </span>
                    <span class="text-[10px] font-semibold text-slate-500 truncate tracking-widest uppercase mt-0.5">
                      {{ req.payee_phone || req.payee?.phone || '-' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Purpose -->
               <td class="px-6 py-4">
                <div class="flex flex-col gap-1.5">
                  <div class="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase leading-relaxed line-clamp-1 italic tracking-tight">
                    "{{ req.purpose }}"
                  </div>
                  <div v-if="req.category" class="flex">
                    <span class="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 shadow-sm">
                      {{ req.category }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Project -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3 overflow-hidden">
                  <div class="px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-[9px] font-bold rounded-lg font-technical flex-shrink-0 shadow-sm">
                    {{ req.project?.project_id || 'GEN' }}
                  </div>
                  <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase truncate">
                    {{ req.project?.enquiry?.title || req.project_name || 'General Operations' }}
                  </span>
                </div>
              </td>

              <!-- Amount -->
              <td class="px-6 py-4 text-right">
                <span class="text-[15px] font-black font-technical text-slate-900 dark:text-white tabular-nums tracking-tighter">
                  {{ formatCurrency(req.total_amount) }}
                </span>
              </td>

              <!-- Status -->
               <td class="px-6 py-4 text-center">
                <span 
                  class="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-sm"
                  :class="getStatusClass(req.status)"
                >
                  {{ req.status === 'disbursed' ? 'Paid' : req.status }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-8 py-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="openPreview(req)"
                    class="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                    title="Quick Preview"
                  >
                    <i class="mdi mdi-eye-outline text-lg"></i>
                  </button>
                  <button 
                    v-if="req.status === 'pending'"
                    @click="handleEdit(req)"
                    class="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                    title="Edit Record"
                  >
                    <i class="mdi mdi-pencil-outline text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer / Pagination Area -->
      <div class="px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing {{ requisitions.length }} of {{ meta.total }} Transactions
        </div>
        
        <div v-if="meta.last_page > 1" class="flex items-center gap-2">
          <button 
            @click="changePage(meta.current_page - 1)" 
            :disabled="meta.current_page === 1"
            class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
          >
            Prev
          </button>
          
          <div class="flex items-center gap-1.5 px-4 font-black text-xs font-technical">
            <span class="text-slate-900 dark:text-white">{{ meta.current_page }}</span>
            <span class="text-slate-300">/</span>
            <span class="text-slate-400">{{ meta.last_page }}</span>
          </div>

          <button 
            @click="changePage(meta.current_page + 1)" 
            :disabled="meta.current_page === meta.last_page"
            class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Professional Slide-over Drawer (Preview) -->
    <Teleport to="body">
      <Transition name="slide-right">
        <div v-if="showPreview" class="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          <!-- Backdrop -->
          <Transition name="fade">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closePreview"></div>
          </Transition>

          <!-- Drawer Content -->
          <div class="relative w-full max-w-4xl bg-white dark:bg-slate-950 shadow-2xl flex flex-col h-full transform transition-transform duration-500 ease-out border-l border-slate-200/60 dark:border-slate-800">
            <!-- Close Header -->
            <div class="absolute top-6 left-0 -translate-x-full pr-4 z-10 hidden md:block">
              <button 
                @click="closePreview" 
                class="w-12 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
              >
                <i class="mdi mdi-close text-2xl"></i>
              </button>
            </div>

            <div class="flex-grow overflow-y-auto custom-scrollbar relative">
               <!-- Mobile Close Button -->
               <div class="md:hidden flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Document Registry</span>
                  <button @click="closePreview" class="text-slate-400"><i class="mdi mdi-close text-2xl"></i></button>
               </div>

               <RequisitionPreview 
                 v-if="selectedRequisition" 
                 :requisition="selectedRequisition" 
                 :can-manage="true" 
                 @approve="handleApprove"
                 @reject="handleReject"
                 @disburse="handleDisburse"
                 @edit="handleEdit"
                 @delete="handleDelete"
               />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showRejectModal = false"></div>
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl border border-slate-200/60 dark:border-slate-700/60">
        <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Reject Requisition</h2>
        <p class="text-slate-500 mb-6 text-sm font-bold">Specify why you are rejecting this request.</p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-red-500/50 text-slate-900 dark:text-white transition-all mb-6"
          placeholder="Reason for rejection..."
        ></textarea>
        <div class="flex items-center gap-3">
          <button @click="showRejectModal = false" class="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
          <button @click="submitRejection" class="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all" :disabled="submitting">
            {{ submitting ? 'Processing...' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Disbursement Form Modal -->
    <DisbursementForm 
        :is-open="showDisburseModal"
        :edit-mode="false"
        :requisition="selectedRequisition"
        @close="showDisburseModal = false"
        @success="onDisburseSuccess"
    />

    <!-- Requisition Form Drawer -->
    <RequisitionForm 
      :is-open="showForm"
      :requisition-id="formRequisitionId"
      :pre-fill="preFillData"
      @close="showForm = false"
      @success="fetchRequisitions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'
import RequisitionPreview from './RequisitionPreview.vue'
import RequisitionForm from './RequisitionForm.vue'
import DisbursementForm from '../../components/DisbursementForm.vue'

const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()
const requisitions = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

// Split-Pane State
const selectedId = ref<number | null>(null)
const selectedRequisition = ref<any>(null)
const showRejectModal = ref(false)
const showDisburseModal = ref(false)
const showForm = ref(false)
const showPreview = ref(false)
const formRequisitionId = ref<number | null>(null)
const preFillData = ref<any>(null)
const rejectionReason = ref('')
const requisitionStats = ref<any>(null)
const linkCopied = ref(false)

const getStatusCount = (status: string) => {
  if (status === 'all') return meta.value.total
  return requisitionStats.value?.[status]?.count || 0
}

const statCards = computed(() => [
  { 
    label: 'Pending Requests', 
    value: formatCurrency(requisitionStats.value?.pending?.amount || 0), 
    count: requisitionStats.value?.pending?.count || 0,
    icon: 'mdi mdi-clock-outline',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  { 
    label: 'Ready for Disbursement', 
    value: formatCurrency(requisitionStats.value?.approved?.amount || 0), 
    count: requisitionStats.value?.approved?.count || 0,
    icon: 'mdi mdi-check-decagram-outline',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  { 
    label: 'This Month', 
    value: formatCurrency(requisitionStats.value?.monthly?.amount || 0), 
    count: requisitionStats.value?.monthly?.count || 0,
    icon: 'mdi mdi-calendar-text-outline',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  { 
    label: 'Disbursed Today', 
    value: formatCurrency(requisitionStats.value?.disbursed_today?.amount || 0), 
    count: requisitionStats.value?.disbursed_today?.count || 0,
    icon: 'mdi mdi-cash-multiple',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20'
  }
])

const tabs = [
  { label: 'All Requests', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Disbursed', value: 'disbursed' },
  { label: 'Received', value: 'received' },
]

const filters = reactive({
  search: '',
  status: '',
  start_date: '',
  end_date: ''
})

let searchTimeout: any = null

const fetchRequisitions = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/finance/petty-cash/requisitions', {
      params: {
        page: meta.value.current_page,
        ...filters
      }
    })
    requisitions.value = response.data.data
    meta.value = response.data.meta
    
    // Also fetch stats on refresh
    fetchStats()
    
    // Auto-select first if in split pane and nothing selected, provided form is not open
    if (!selectedId.value && requisitions.value.length > 0 && window.innerWidth > 768 && !showForm.value) {
       selectRequisition(requisitions.value[0])
    }
  } catch (error) {
    console.error('Failed to fetch requisitions:', error)
  } finally {
    loading.value = false
  }
}

const selectRequisition = async (req: any) => {
  selectedId.value = req.id
  // Fetch full details
  try {
    const response = await axios.get(`/api/finance/petty-cash/requisitions/${req.id}`)
    selectedRequisition.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch requisition details:', error)
  }
}

const openPreview = async (req: any) => {
  await selectRequisition(req)
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  // Don't null selectedId immediately to avoid flicker if it animates
}

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/finance/petty-cash/requisitions/stats')
    if (response.data.success) {
      requisitionStats.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch requisition stats:', error)
  }
}

const setStatus = (status: string) => {
  filters.status = status
  meta.value.current_page = 1
  fetchRequisitions()
}

const clearDates = () => {
  filters.start_date = ''
  filters.end_date = ''
  meta.value.current_page = 1
  fetchRequisitions()
}

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    meta.value.current_page = 1
    fetchRequisitions()
  }, 500)
}

const changePage = (page: number) => {
  meta.value.current_page = page
  fetchRequisitions()
}

// Action Handlers
const handleApprove = async (req: any) => {
  if (!confirm('Are you sure you want to approve this requisition?')) return
  submitting.value = true
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${req.id}/approve`)
    await selectRequisition(req) // Refresh details
    fetchRequisitions() // Refresh list
  } catch (error) {
    console.error('Approval failed:', error)
    alert('Failed to approve requisition')
  } finally {
    submitting.value = false
  }
}

const handleReject = (req: any) => {
  showRejectModal.value = true
  rejectionReason.value = ''
}

const submitRejection = async () => {
  if (!rejectionReason.value) return
  submitting.value = true
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${selectedId.value}/approve`, {
      rejection_reason: rejectionReason.value
    })
    showRejectModal.value = false
    await selectRequisition({ id: selectedId.value })
    fetchRequisitions()
  } catch (error) {
    console.error('Rejection failed:', error)
  } finally {
    submitting.value = false
  }
}

const handleDisburse = (req: any) => {
  selectedRequisition.value = req
  showDisburseModal.value = true
}

const onDisburseSuccess = () => {
  showDisburseModal.value = false
  if (selectedId.value) selectRequisition({ id: selectedId.value })
  fetchRequisitions()
}

const openNewRequisition = (preFill: any = null) => {
  formRequisitionId.value = null
  preFillData.value = preFill instanceof Event ? null : preFill
  showForm.value = true
}

const handleEdit = (req: any) => {
  formRequisitionId.value = req.id
  showForm.value = true
}

const handleDelete = async (req: any) => {
  const isDisbursed = req.status === 'disbursed'
  const message = isDisbursed 
    ? 'Warning: This requisition is DISBURSED. Deleting it will release the associated balance back to the petty cash vault (Voiding the disbursement). Proceed?'
    : 'Are you sure you want to delete this requisition? This action cannot be undone.'
    
  if (!confirm(message)) return

  submitting.value = true
  try {
    const response = await axios.delete(`/api/finance/petty-cash/requisitions/${req.id}`)
    if (response.data.success) {
      selectedId.value = null
      selectedRequisition.value = null
      fetchRequisitions()
    }
  } catch (error: any) {
    console.error('Deletion failed:', error)
    alert(error.response?.data?.message || 'Failed to delete requisition')
  } finally {
    submitting.value = false
  }
}

const copyPublicLink = async () => {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL
  const url = `${window.location.origin}${base}/public/requisition/new`
  
  try {
    await navigator.clipboard.writeText(url)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase()
}

const formatTime = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
    case 'approved': return 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'
    case 'rejected': return 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]'
    case 'disbursed': return 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.4)]'
    case 'received': return 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.4)]'
    default: return 'bg-slate-500'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
    case 'approved': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
    case 'rejected': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
    case 'disbursed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
    case 'received': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
    default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  }
}

const getStatusDotColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-500'
    case 'approved': return 'bg-blue-500'
    case 'rejected': return 'bg-red-500'
    case 'disbursed': case 'received': return 'bg-emerald-500'
    default: return 'bg-slate-400'
  }
}

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'pending': return 'dark:bg-amber-950/10 bg-amber-50/30'
    case 'approved': return 'dark:bg-blue-950/10 bg-blue-50/30'
    case 'rejected': return 'dark:bg-red-950/10 bg-red-50/30'
    case 'disbursed': case 'received': return 'dark:bg-emerald-950/10 bg-emerald-50/30'
    default: return ''
  }
}

const handleQueryParams = () => {
  // Handle action parameter (e.g. from Billing module)
  if (route.query.action === 'new') {
    // Capture pre-fill data before clearing query
    const preFill = { ...route.query }
    openNewRequisition(preFill)
    
    // Clear the query parameters so refresh doesn't trigger this again
    const newQuery = { ...route.query }
    const paramsToClear = [
      'action', 'purpose', 'amount', 'bill_id', 'department_id', 
      'project_id', 'project_name', 'venue', 'category', 'project_selection'
    ]
    paramsToClear.forEach(p => delete (newQuery as any)[p])
    
    // Delay the route replace slightly to prevent race conditions 
    // that cause the modal to close immediately upon mounting
    setTimeout(() => {
      router.replace({ query: newQuery as any })
    }, 100)
  }
}

onMounted(() => {
  fetchRequisitions()
  handleQueryParams()
})

// Watch for query changes for when component is reused
watch(() => route.query, () => {
  handleQueryParams()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-technical {
  font-family: 'IBM Plex Sans', sans-serif;
  letter-spacing: -0.01em;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #475569;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.dark .custom-scrollbar {
  scrollbar-color: #475569 transparent;
}

<<<<<<< Updated upstream
/* Drawer Animations */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
=======
.anim-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
>>>>>>> Stashed changes
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.2); }
}
</style>
