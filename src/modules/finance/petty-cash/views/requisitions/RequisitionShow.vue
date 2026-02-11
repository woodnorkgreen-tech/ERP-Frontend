<template>
  <div class="max-w-full mx-auto px-4 md:px-8 space-y-6">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <router-link
          to="/finance/petty-cash/requisitions"
          class="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all shadow-sm"
        >
          <i class="mdi mdi-arrow-left text-2xl"></i>
        </router-link>
        <div class="flex flex-col">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
              <img src="/logo-outline.png" alt="WNG" class="h-6 object-contain" />
              <div class="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
              <div class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <span class="text-slate-500 dark:text-slate-400">Woodnork Green</span>
                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span class="text-slate-400 dark:text-slate-500">PIN: P051451468C</span>
              </div>
            </div>
            <div class="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {{ requisition.requisition_number || 'Loading...' }}
              </h1>
              <span :class="getStatusClass(requisition.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {{ requisition.status }}
              </span>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
            Submitted on {{ formatDate(requisition.created_at) }} by {{ requisition.requester?.name }}
          </p>
        </div>
      </div>

      <!-- Actions for Admins/Accounts -->
      <div v-if="canManage" class="flex items-center gap-2">
        <template v-if="requisition.status === 'pending'">
          <button
            @click="showRejectModal = true"
            class="px-5 py-2.5 rounded-xl font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-200 dark:border-red-900/30"
          >
            Reject
          </button>
          <button
            @click="approveRequisition"
            class="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/20"
          >
            Approve Request
          </button>
        </template>
        
        <button
          v-if="requisition.status === 'approved'"
          @click="initiateDisbursement"
          class="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <i class="mdi mdi-cash-register"></i>
          Disburse Cash
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Column: Details -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Main Details Card -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-8 shadow-sm">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                <i class="mdi mdi-account-tie text-slate-500 text-lg"></i>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Target Beneficiary</span>
                <span class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  <span v-if="requisition.payee">
                    {{ requisition.payee.first_name }} {{ requisition.payee.last_name }}
                  </span>
                  <span v-else-if="requisition.payee_name">
                    {{ requisition.payee_name }}
                  </span>
                  <span v-else>{{ requisition.requester?.name || 'Self' }}</span>
                </span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                <i class="mdi mdi-office-building text-slate-500 text-lg"></i>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Allocated Department</span>
                <span class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ requisition.department?.name }}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                <i class="mdi mdi-tag-outline text-slate-500 text-lg"></i>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Expense Category</span>
                <span class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ requisition.category }}</span>
              </div>
            </div>
            <div class="md:col-span-2 flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                <i class="mdi mdi-text-long text-blue-600 dark:text-blue-400 text-lg"></i>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Requisition Narrative</span>
                <p class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">{{ requisition.purpose }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800">
                <i class="mdi mdi-briefcase-variant-outline text-amber-600 dark:text-amber-400 text-lg"></i>
              </div>
              <div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Project Assignment</span>
                <div v-if="requisition.project" class="mt-1">
                  <p class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Project Code</p>
                  <p class="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">
                    {{ requisition.project.job_number || requisition.project.project_id }}
                  </p>
                </div>
                <div v-else-if="requisition.enquiry" class="mt-1">
                  <p class="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-0.5">Enquiry Ref</p>
                  <p class="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">
                    {{ requisition.enquiry.job_number || requisition.enquiry.enquiry_number }}
                  </p>
                </div>
                <span v-else class="text-slate-400 italic text-xs block mt-1">General (No Project)</span>
              </div>
            </div>
          </div>
          </div>

          <hr class="border-slate-100 dark:border-slate-700 my-8" />

          <!-- Items Table -->
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">
              {{ isBulkPayee ? 'Payees & Distributions' : 'Breakdown of Items' }}
            </h3>
            <div class="space-y-4">
              <div v-for="(item, index) in requisition.items" :key="item.id" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="flex-grow flex items-start gap-3">
                    <span class="text-xs font-black text-slate-300 dark:text-slate-600 mt-0.5">{{ Number(index) + 1 }}.</span>
                    <div>
                      <span class="block text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        <template v-if="item.payee || item.payee_name">
                          {{ item.payee ? `${item.payee.first_name} ${item.payee.last_name}` : item.payee_name }}
                        </template>
                        <template v-else>
                          <span v-if="requisition.payee">{{ requisition.payee.first_name }} {{ requisition.payee.last_name }}</span>
                          <span v-else-if="requisition.payee_name">{{ requisition.payee_name }}</span>
                          <span v-else>{{ requisition.requester?.name || 'Self' }}</span>
                        </template>
                      </span>
                      <span class="text-xs text-slate-500 dark:text-slate-400 font-bold block italic">{{ item.description }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <span class="text-lg font-black text-slate-900 dark:text-white block">{{ formatCurrency(item.amount) }}</span>
                      
                      <!-- Confirmation Status -->
                      <div v-if="item.received_at" class="flex items-center gap-1 justify-end text-emerald-500 mt-1">
                        <i class="mdi mdi-check-decagram text-sm"></i>
                        <span class="text-[10px] font-black uppercase tracking-widest">Handover Confirmed</span>
                      </div>
                    </div>

                    <!-- Signature Display Next to Amount -->
                    <div v-if="item.digital_signature" class="shrink-0 h-14 w-32 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center p-1 shadow-sm overflow-hidden">
                       <img :src="item.digital_signature" alt="Signature" class="max-h-full max-w-full opacity-100 dark:brightness-110 dark:invert" />
                    </div>
                  </div>
                </div>

                <!-- Sign Action / Canvas -->
                <div v-if="requisition.status === 'disbursed' && !item.received_at && canSignItem(item)" class="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900/30 space-y-4">
                  <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <i class="mdi mdi-signature-freehand"></i>
                    <span class="text-xs font-bold uppercase">Sign to confirm receipt of {{ formatCurrency(item.amount) }}</span>
                  </div>
                  
                  <div class="bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 p-2">
                    <canvas 
                      :ref="el => signaturePads[item.id] = (el as HTMLCanvasElement)"
                      class="w-full h-32 cursor-crosshair"
                      @mousedown="e => startItemDrawing(e, item.id)"
                      @mousemove="e => drawItem(e, item.id)"
                      @mouseup="stopDrawing"
                      @mouseleave="stopDrawing"
                      @touchstart="e => handleItemTouchStart(e, item.id)"
                      @touchmove="e => handleItemTouchMove(e, item.id)"
                      @touchend="stopDrawing"
                    ></canvas>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <button @click="clearItemSignature(item.id)" class="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Clear</button>
                    <button
                      @click="submitItemReceipt(item.id)"
                      :disabled="confirming"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 disabled:bg-slate-400"
                    >
                      {{ confirming ? '...' : 'Confirm' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Grand Total -->
              <div class="flex items-center justify-between px-6 py-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
                <div class="relative z-10">
                  <span class="font-black uppercase tracking-widest text-slate-500 text-[10px] block mb-0.5">Grand Total Payable</span>
                  <span class="text-2xl font-black text-white tracking-tighter tabular-nums">
                    {{ formatCurrency(requisition.total_amount) }}
                  </span>
                </div>
                <div class="relative z-10 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                   <i class="mdi mdi-cash-multiple text-blue-500 text-xl"></i>
                </div>
                <!-- Glass Flare -->
                <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rejection Reason -->
        <div v-if="requisition.status === 'rejected'" class="bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-900/30 p-8">
           <span class="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-2">Rejection Reason</span>
           <p class="text-red-700 dark:text-red-400 font-bold">{{ requisition.rejection_reason }}</p>
        </div>
      </div>

      <!-- Right Column: Status Timeline & Sidebar Info -->
      <div class="space-y-6">
        <!-- Requisition Stats -->
        <div class="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl">
          <div class="relative z-10 flex items-center justify-between mb-2">
            <span class="text-xs font-black uppercase tracking-widest text-slate-400">Total Amount</span>
            <i class="mdi mdi-bank text-blue-500"></i>
          </div>
          <div class="relative z-10">
            <h4 class="text-3xl font-black tracking-tighter">{{ formatCurrency(requisition.total_amount) }}</h4>
          </div>
          <!-- Accents -->
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl"></div>
        </div>

        <!-- Timeline / Flow -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Process Timeline</h3>
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5"></div>
                <div class="w-0.5 h-full bg-slate-100 dark:bg-slate-700 my-1"></div>
              </div>
              <div>
                <span class="block text-xs font-black uppercase tracking-widest text-slate-400">Submitted</span>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(requisition.created_at) }}</span>
              </div>
            </div>

            <div v-if="requisition.approved_at" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div :class="requisition.status === 'rejected' ? 'bg-red-600' : 'bg-blue-600'" class="w-2.5 h-2.5 rounded-full mt-1.5"></div>
                <div v-if="requisition.received_at || requisition.status === 'disbursed'" class="w-0.5 h-full bg-slate-100 dark:bg-slate-700 my-1"></div>
              </div>
              <div>
                <span class="block text-xs font-black uppercase tracking-widest text-slate-400">
                  {{ requisition.status === 'rejected' ? 'Rejected' : 'Approved' }}
                </span>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(requisition.approved_at) }}</span>
                <span class="block text-[10px] text-slate-500">By {{ requisition.approver?.name }}</span>
              </div>
            </div>

            <div v-if="requisition.disbursement" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-2.5 h-2.5 rounded-full bg-purple-600 mt-1.5"></div>
                <div v-if="requisition.received_at" class="w-0.5 h-full bg-slate-100 dark:bg-slate-700 my-1"></div>
              </div>
              <div>
                <span class="block text-xs font-black uppercase tracking-widest text-slate-400">Disbursed</span>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(requisition.disbursement.created_at) }}</span>
                <span class="block text-[10px] text-slate-500">Ref: {{ requisition.disbursement.transaction_code }}</span>
              </div>
            </div>

            <div v-if="requisition.received_at" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5"></div>
              </div>
              <div>
                <span class="block text-xs font-black uppercase tracking-widest text-slate-400">Confirmed Receipt</span>
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ formatDate(requisition.received_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Digital Signature Display -->
        <div v-if="requisition.digital_signature" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">Recipient Signature</h3>
          <div class="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
            <img :src="requisition.digital_signature" alt="Signature" class="max-h-24 mx-auto opacity-100 dark:brightness-110 dark:invert" />
          </div>
        </div>

        <!-- Public Sign-off QR Code -->
        <div v-if="requisition.status === 'disbursed' && !requisition.received_at" class="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
          <h3 class="text-xs font-black uppercase tracking-widest text-blue-100 mb-4">Payee Confirmation</h3>
          <div class="bg-white p-4 rounded-2xl flex flex-col items-center">
            <QrcodeVue
              :value="publicSignOffUrl"
              :size="180"
              level="H"
              class="rounded-lg"
            />
            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4">Scan to Sign</p>
          </div>
          <div class="mt-4 pt-4 border-t border-white/10">
            <p class="text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-1">Direct Link</p>
            <div class="flex items-center gap-2">
              <input 
                readonly 
                :value="publicSignOffUrl" 
                class="bg-white/10 border-none text-xs rounded-lg px-3 py-2 flex-grow font-medium"
              />
              <button @click="copyLink" class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <i class="mdi mdi-content-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showRejectModal = false"></div>
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl border border-slate-200/60 dark:border-slate-700/60">
        <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Reject Requisition</h2>
        <p class="text-slate-500 mb-6 text-sm font-bold">Please specify why you are rejecting this request.</p>
        
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-red-500/50 text-slate-900 dark:text-white transition-all mb-6"
          placeholder="Reason for rejection..."
        ></textarea>
        
        <div class="flex items-center gap-3">
          <button @click="showRejectModal = false" class="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
          <button @click="rejectRequisition" class="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all">Reject Now</button>
        </div>
      </div>
    </div>

    <!-- Combined Approval & Disbursement Modal -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      @click.self="showApproveModal = false"
      style="background-color: rgba(0, 0, 0, 0.5);"
    >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div>
            <!-- Modal header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Disburse Petty Cash
              </h3>
              <button
                @click="showApproveModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="submitApprovalWithDisbursement" class="space-y-6">
              <!-- Current Balance and Amount Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Current Balance Display -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available Balance
                  </label>
                  <div class="mt-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                    <div class="flex items-center justify-between">
                      <span class="text-lg font-semibold text-gray-900 dark:text-white">
                        KES {{ currentBalance.toLocaleString() }}
                      </span>
                      <div class="flex items-center">
                        <div 
                          :class="[
                            'w-2 h-2 rounded-full mr-2',
                            balanceStatus === 'normal' ? 'bg-green-500' : 
                            balanceStatus === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                          ]"
                        ></div>
                        <span 
                          :class="[
                            'text-xs font-medium',
                            balanceStatus === 'normal' ? 'text-green-600 dark:text-green-400' : 
                            balanceStatus === 'low' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          ]"
                        >
                          {{ balanceStatusLabel }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Amount -->
                <div>
                  <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
                    </div>
                    <input
                      id="amount"
                      v-model="approvalForm.amount"
                      type="number"
                      step="0.01"
                      class="block w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <!-- Transaction Cost and Code Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Transaction Cost -->
                <div>
                  <label for="transaction_cost" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction Cost
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400 sm:text-sm">KES</span>
                    </div>
                    <input
                      id="transaction_cost"
                      v-model="approvalForm.transaction_cost"
                      type="number"
                      step="0.01"
                      class="block w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <!-- Transaction Code -->
                <div>
                  <label for="transaction_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction Code
                  </label>
                  <input
                    id="transaction_code"
                    v-model="approvalForm.transaction_code"
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="M-Pesa Ref / Bank Ref"
                  />
                </div>
              </div>

              <!-- Payment Method and Receiver Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Payment Method -->
                <div>
                  <label for="payment_method" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="payment_method"
                    v-model="approvalForm.payment_method"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="equity">Equity</option>
                    <option value="stanbic">Stanbic</option>
                    <option value="ncba">NCBA</option>
                    <option value="kcb">KCB</option>
                    <option value="family">Family Bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Receiver -->
                <div>
                  <label for="receiver" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Receiver <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="receiver"
                    v-model="approvalForm.receiver"
                    type="text"
                    :class="[
                      'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.receiver ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    placeholder="Name of person/entity receiving funds"
                    required
                  />
                </div>
              </div>

              <!-- Account Row -->
              <div class="grid grid-cols-1 gap-6">
                <!-- Account with Autocomplete -->
                <div>
                  <label for="account" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      id="account"
                      v-model="accountSearch"
                      @input="onAccountInput"
                      @focus="showAccountDropdown = true"
                      @blur="hideAccountDropdown"
                      type="text"
                      :class="[
                        'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                        errors.account ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      ]"
                      placeholder="Type to search accounts..."
                      required
                    />

                    <!-- Dropdown -->
                    <div
                      v-if="showAccountDropdown && filteredAccounts.length"
                      class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-slate-200 dark:border-slate-700"
                    >
                      <div
                        v-for="account in filteredAccounts"
                        :key="account.id"
                        @mousedown="selectAccount(account)"
                        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div class="flex items-center">
                          <span class="font-medium text-gray-900 dark:text-white">{{ account.name }}</span>
                          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ account.code }})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  v-model="approvalForm.description"
                  rows="3"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.description ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Detailed description of the disbursement purpose..."
                  required
                ></textarea>
              </div>        

              <!-- Classification and Project Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Classification -->
                <div>
                  <label for="classification" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Classification <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="classification"
                    v-model="approvalForm.classification"
                    :class="[
                      'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.classification ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    required
                  >
                    <option value="">Select classification</option>
                    <option value="admin">Admin</option>
                    <option value="agencies">Agencies</option>
                    <option value="operations">Operations</option>
                    <option value="event_planners">Event Planners</option>
                    <option value="corporates">Corporates</option>
                    <option value="crs">CRS</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Project Name -->
                <div>
                  <label for="project_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Name
                    <span v-if="requiresProject" class="text-red-500">*</span>
                  </label>
                  <input
                    id="project_name"
                    v-model="approvalForm.project_name"
                    type="text"
                    :class="[
                      'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.project_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    placeholder="Project or job name"
                    :required="requiresProject"
                  />
                </div>
              </div>

              <!-- Tax Field and Date Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tax Field -->
                <div>
                  <label for="tax" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tax <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="tax"
                    v-model="approvalForm.tax"
                    :class="[
                      'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.tax ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    required
                  >
                    <option value="">Select tax option</option>
                    <option value="etr">ETR</option>
                    <option value="no_etr">No ETR</option>
                  </select>
                </div>

                <!-- Date Disbursed -->
                <div>
                  <label for="date_disbursed" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Disbursed <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="date_disbursed"
                    v-model="approvalForm.date_disbursed"
                    type="date"
                    :class="[
                      'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.date_disbursed ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    required
                  />
                </div>
              </div>

              <!-- Job Number with Autocomplete Row -->
              <div class="grid grid-cols-1 gap-6">
                <!-- Job Number with Autocomplete -->
                <div>
                  <label for="job_number_approval" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Job Number (WNG-prefix projects only)
                  </label>
                  <div class="relative">
                      <input
                        id="job_number_approval"
                        list="job_number_approval_list"
                        v-model="approvalForm.job_number"
                        @input="onProjectSelect"
                        type="text"
                        class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="Type or select job number (e.g. WNG-01-2026-009)"
                        autocomplete="off"
                      />
                    
                    <datalist id="job_number_approval_list">
                      <option 
                        v-for="project in projects" 
                        :key="project.id" 
                        :value="project.job_number || project.project_id"
                      >
                        {{ project.title || project.enquiry?.title }}
                      </option>
                    </datalist>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  @click="showApproveModal = false"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || !isFormValid"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Processing...' : 'Confirm Disbursement' }}
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { useToast } from '@/modules/universal-task/composables/useToast'
import { useAuth } from '@/composables/useAuth'
import { usePettyCashStore } from '../../stores/pettyCashStore'
import { pettyCashService } from '../../services/pettyCashService'
import QrcodeVue from 'qrcode.vue'
import accountsData from '../../../../../data/accounts.json'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { user } = useAuth()

const requisition = ref<any>({})
const loading = ref(true)
const confirming = ref(false)
const showRejectModal = ref(false)
const showApproveModal = ref(false)
const isSubmitting = ref(false)
const rejectionReason = ref('')

// Disbursement/Approval Form State
const store = usePettyCashStore()
const approvalForm = reactive({
  amount: '',
  receiver: '',
  account: '',
  account_id: null as number | null,
  description: '',
  classification: '',
  project_name: '',
  tax: 'etr',
  date_disbursed: new Date().toISOString().split('T')[0],
  job_number: '',
  payment_method: 'cash',
  transaction_cost: 0,
  transaction_code: ''
} as any)

const accountSearch = ref('')
const showAccountDropdown = ref(false)
const projects = ref<any[]>([])
const accounts = ref<any[]>(accountsData.accounts || [])
const errors = ref<Record<string, string[]>>({})

// Signature Pads State (Dynamic)
const signaturePads = reactive<Record<number, HTMLCanvasElement | null>>({})
const signatureContexts: Record<number, CanvasRenderingContext2D | null> = {}
const isDrawing = ref(false)

const isBulkPayee = computed(() => {
  return ['Travel & Subsistence', 'Entertainment & Meals'].includes(requisition.value?.category)
})

const canManage = computed(() => {
  return user.value?.roles?.some((role: string) => ['Super Admin', 'Admin', 'Accounts', 'Finance Manager'].includes(role))
})

const isRequester = computed(() => {
  return requisition.value?.user_id === user.value?.id
})

const canSignItem = (item: any) => {
  // If it's a specific employee, check if it's the current user
  // This logic depends on the user object having the employee_id
  const currentUser = user.value as any
  const userEmployeeId = currentUser?.employee_id || currentUser?.id // Fallback
  
  if (item.payee_id && userEmployeeId === item.payee_id) return true
  if (!item.payee_id && isRequester.value) return true
  return false
}

const requiresProject = computed(() => {
  return ['agencies', 'operations', 'event_planners', 'corporates'].includes(approvalForm.classification)
})

const isFormValid = computed(() => {
  return approvalForm.receiver &&
         approvalForm.account &&
         approvalForm.account_id &&
         approvalForm.amount &&
         approvalForm.description &&
         approvalForm.classification &&
         approvalForm.payment_method &&
         approvalForm.tax &&
         approvalForm.date_disbursed &&
         (!requiresProject.value || approvalForm.project_name)
})

const currentBalance = computed(() => (store.safeCurrentBalance as any)?.current_balance?.raw || 0)

const balanceStatus = computed(() => {
  const balance = currentBalance.value
  if (balance <= 0) return 'critical'
  if (balance < 1000) return 'low'
  return 'normal'
})

const balanceStatusLabel = computed(() => {
  const status = balanceStatus.value
  if (status === 'critical') return 'Critical'
  if (status === 'low') return 'Low'
  return 'Normal'
})

const publicSignOffUrl = computed(() => {
  if (!requisition.value?.signing_token) return ''
  const appUrl = (import.meta as any).env.VITE_APP_URL || window.location.origin
  return `${appUrl}/pcr/confirm/${requisition.value.signing_token}`
})

const filteredAccounts = computed(() => {
  if (!accountSearch.value || accountSearch.value.length < 2) return []
  return accounts.value.filter(account =>
    account.name.toLowerCase().includes(accountSearch.value.toLowerCase()) ||
    account.code.toLowerCase().includes(accountSearch.value.toLowerCase())
  ).slice(0, 10)
})

const onAccountInput = () => {
  showAccountDropdown.value = true
}

const selectAccount = (account: any) => {
  accountSearch.value = account.name
  approvalForm.account = account.name
  approvalForm.account_id = account.id
  showAccountDropdown.value = false
}

const hideAccountDropdown = () => {
  setTimeout(() => { showAccountDropdown.value = false }, 150)
}

const onProjectSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  const project = projects.value.find(p => (p.job_number === value) || (p.project_id === value))
  if (project) {
    approvalForm.job_number = project.job_number || project.project_id
    approvalForm.project_name = project.title || project.enquiry?.title || ''
    if (!approvalForm.classification || approvalForm.classification === 'admin') {
      approvalForm.classification = 'operations'
    }
  } else {
    approvalForm.job_number = value
  }
}

const fetchFormData = async () => {
  try {
    const response = await pettyCashService.getProjects()
    if (response.success) {
      projects.value = response.data
    }
    await store.fetchCurrentBalance()
  } catch (error) {
    console.error('Failed to fetch form data:', error)
  }
}

const fetchRequisition = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/finance/petty-cash/requisitions/${route.params.id}`)
    requisition.value = response.data.data
    
    // Auto-setup canvases if in confirmation state
    if (requisition.value.status === 'disbursed') {
      setTimeout(initAllCanvases, 200)
    }
  } catch (error) {
    console.error('Failed to fetch requisition:', error)
    toast.error('Could not load requisition details')
  } finally {
    loading.value = false
  }
}

const approveRequisition = async () => {
  if (!confirm('Are you sure you want to approve this requisition?')) return
  
  isSubmitting.value = true
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${requisition.value.id}/approve`)
    toast.success('Requisition marked as Approved')
    fetchRequisition()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to approve requisition')
  } finally {
    isSubmitting.value = false
  }
}

const initiateDisbursement = async () => {
  // Populate form with requisition data for disbursement
  const receiver = requisition.value.payee 
    ? `${requisition.value.payee.first_name} ${requisition.value.payee.last_name}`
    : (requisition.value.payee_name || requisition.value.requester?.name)

  Object.assign(approvalForm, {
    amount: requisition.value.total_amount,
    receiver: receiver,
    account: '',
    account_id: null,
    description: `Disbursement for ${requisition.value.requisition_number}: ${requisition.value.purpose}`,
    classification: '',
    project_name: '',
    tax: 'etr',
    date_disbursed: new Date().toISOString().split('T')[0],
    job_number: requisition.value.project?.job_number || '',
    payment_method: 'cash',
    transaction_cost: 0,
    transaction_code: ''
  })

  // If there's a project/enquiry, pre-populate
  if (requisition.value.project) {
    const project = requisition.value.project
    approvalForm.project_name = project.enquiry?.title || project.project_id || ''
    approvalForm.job_number = project.enquiry?.job_number || project.project_id || ''
    approvalForm.classification = 'operations'
  } else if (requisition.value.enquiry) {
    const enquiry = requisition.value.enquiry
    approvalForm.project_name = enquiry.title || ''
    approvalForm.job_number = enquiry.job_number || ''
    approvalForm.classification = 'operations'
  }
  
  accountSearch.value = ''
  errors.value = {}
  
  await fetchFormData()
  showApproveModal.value = true
}

const submitApprovalWithDisbursement = async () => {
  isSubmitting.value = true
  errors.value = {}
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${requisition.value.id}/disburse`, approvalForm)
    toast.success('Cash disbursed and QR code generated')
    showApproveModal.value = false
    fetchRequisition()
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    toast.error(error.response?.data?.message || 'Failed to disburse cash')
  } finally {
    isSubmitting.value = false
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(publicSignOffUrl.value)
  toast.success('Public link copied to clipboard')
}

const rejectRequisition = async () => {
  if (!rejectionReason.value) {
    toast.warning('Please provide a reason')
    return
  }
  try {
    await axios.post(`/api/finance/petty-cash/requisitions/${requisition.value.id}/reject`, {
      reason: rejectionReason.value
    })
    toast.success('Requisition rejected')
    showRejectModal.value = false
    fetchRequisition()
  } catch (error) {
    toast.error('Failed to reject requisition')
  }
}

// Canvas / Signature Pad Logic (Individual)
const initAllCanvases = () => {
  requisition.value.items.forEach((item: any) => {
    if (canSignItem(item) && !item.received_at) {
      setTimeout(() => initItemCanvas(item.id), 100)
    }
  })
}

const initItemCanvas = (itemId: number) => {
  const canvas = signaturePads[itemId]
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    signatureContexts[itemId] = ctx
  }
}

const startItemDrawing = (e: MouseEvent | TouchEvent, itemId: number) => {
  isDrawing.value = true
  const coords = getCoords(e, itemId)
  const ctx = signatureContexts[itemId]
  ctx?.beginPath()
  ctx?.moveTo(coords.x, coords.y)
}

const drawItem = (e: MouseEvent | TouchEvent, itemId: number) => {
  if (!isDrawing.value) return
  const coords = getCoords(e, itemId)
  const ctx = signatureContexts[itemId]
  ctx?.lineTo(coords.x, coords.y)
  ctx?.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const getCoords = (e: MouseEvent | TouchEvent, itemId: number) => {
  const canvas = signaturePads[itemId]!
  const rect = canvas.getBoundingClientRect()
  let clientX, clientY
  
  if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const handleItemTouchStart = (e: TouchEvent, itemId: number) => {
  e.preventDefault()
  startItemDrawing(e, itemId)
}

const handleItemTouchMove = (e: TouchEvent, itemId: number) => {
  e.preventDefault()
  drawItem(e, itemId)
}

const clearItemSignature = (itemId: number) => {
  const canvas = signaturePads[itemId]
  const ctx = signatureContexts[itemId]
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const submitItemReceipt = async (itemId: number) => {
  const canvas = signaturePads[itemId]
  if (!canvas) return
  
  // Basic check if signature is empty
  const blank = document.createElement('canvas')
  blank.width = canvas.width
  blank.height = canvas.height
  if (canvas.toDataURL() === blank.toDataURL()) {
    toast.warning('Please sign before confirming')
    return
  }

  confirming.value = true
  try {
    const signature = canvas.toDataURL()
    await axios.post(`/api/finance/petty-cash/requisitions/${requisition.value.id}/items/${itemId}/confirm-receipt`, {
      signature
    })
    toast.success('Confirmed successfully!')
    fetchRequisition()
  } catch (error) {
    toast.error('Failed to confirm')
  } finally {
    confirming.value = false
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
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'disbursed': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'received': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
  }
}

onMounted(fetchRequisition)
</script>
