<template>
  <div class="min-h-[calc(100vh-5rem)] p-6 space-y-6 bg-gradient-to-b from-slate-50 via-white to-slate-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">NCR Management</h1>
        <p class="text-sm text-slate-700 dark:text-slate-300">Track, assign, reinspect, and close non-conformance records.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-4 py-2 rounded-xl bg-white/95 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold hover:border-slate-500 dark:hover:border-slate-500 shadow-sm"
          @click="refreshData"
        >
          Refresh
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 shadow-lg shadow-slate-900/25"
          @click="openCreateModal"
        >
          New NCR
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input v-model="filters.search" placeholder="Search NCR number or description" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600" />
      <select v-model="filters.status" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="assigned">Assigned</option>
        <option value="in_progress">In Progress</option>
        <option value="pending_reinspection">Pending Reinspection</option>
        <option value="closed">Closed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select v-model="filters.severity" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
        <option value="">All Severities</option>
        <option value="minor">Minor</option>
        <option value="major">Major</option>
        <option value="critical">Critical</option>
      </select>
      <button class="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-semibold text-sm hover:bg-slate-700 dark:hover:bg-slate-600 shadow-sm" @click="loadNcrs">Apply Filters</button>
    </div>

    <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 shadow-sm">
      <p class="text-sm text-slate-700 dark:text-slate-300">Use <span class="font-bold text-slate-900 dark:text-slate-100">New NCR</span> to open the right-side form drawer and submit full NCR details.</p>
    </div>

    <div v-if="errorMessage" class="p-3 rounded-lg bg-red-100 text-red-700 text-sm">{{ errorMessage }}</div>

    <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/70 shadow-sm">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-100 dark:bg-slate-900/80">
            <tr>
              <th class="text-left p-3 text-xs uppercase tracking-wide font-extrabold text-slate-700 dark:text-slate-300">NCR</th>
              <th class="text-left p-3 text-xs uppercase tracking-wide font-extrabold text-slate-700 dark:text-slate-300">Job / Order</th>
              <th class="text-left p-3 text-xs uppercase tracking-wide font-extrabold text-slate-700 dark:text-slate-300">Severity</th>
              <th class="text-left p-3 text-xs uppercase tracking-wide font-extrabold text-slate-700 dark:text-slate-300">Status</th>
              <th class="text-left p-3 text-xs uppercase tracking-wide font-extrabold text-slate-700 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ncrs" :key="item.id" class="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
              <td class="p-3">
                <p class="font-semibold text-slate-900 dark:text-slate-100">{{ item.ncr_number }}</p>
                <p class="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[240px]">{{ item.description }}</p>
              </td>
              <td class="p-3 text-slate-700 dark:text-slate-200">{{ item.job_order_no || item.workOrder?.work_order_number || '-' }}</td>
              <td class="p-3 uppercase font-bold text-xs text-slate-800 dark:text-slate-200">{{ item.severity }}</td>
              <td class="p-3 uppercase text-xs text-slate-700 dark:text-slate-300">{{ item.status }}</td>
              <td class="p-3">
                <div class="flex items-center gap-2">
                  <button class="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700" @click="openDetailsModal(item.id)">Open</button>
                  <button class="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" @click="openEditModal(item.id)">Edit</button>
                </div>
              </td>
            </tr>
            <tr v-if="ncrs.length === 0">
              <td colspan="5" class="p-4 text-center text-slate-600 dark:text-slate-300">No NCR records found.</td>
            </tr>
          </tbody>
        </table>
    </div>

    <Transition name="ncr-details-modal">
      <div v-if="isDetailsModalOpen && selectedNcr" class="fixed inset-0 z-[130]">
        <div class="ncr-details-backdrop absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="closeDetailsModal"></div>
        <div class="ncr-details-panel absolute inset-0 flex items-center justify-center p-3 md:p-6">
          <div class="w-full max-w-5xl max-h-[92vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">NCR Details</h2>
                <p class="text-xs text-slate-600 dark:text-slate-300">{{ selectedNcr.ncr_number }} | {{ selectedNcr.job_order_no || '-' }}</p>
              </div>
              <button class="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" @click="closeDetailsModal">
                <i class="mdi mdi-close"></i>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-5">
              <div class="ncr-doc mx-auto max-w-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 md:p-8">
                <div class="ncr-doc-header">
                  <h3>NON-CONFORMANCE REPORT (NCR)</h3>
                  <p>{{ selectedNcr.ncr_number || '-' }} | {{ selectedNcr.job_order_no || '-' }}</p>
                </div>

                <section class="ncr-doc-section">
                  <h4>1. Incident Information</h4>
                  <table class="ncr-doc-table">
                    <tbody>
                      <tr><th>Raised By</th><td>{{ selectedNcr.raised_by_name || '-' }}</td></tr>
                      <tr><th>Timestamp</th><td>{{ selectedNcr.detected_at || '-' }}</td></tr>
                      <tr><th>Shift</th><td>{{ selectedNcr.shift || '-' }}</td></tr>
                      <tr><th>Project / Order No</th><td>{{ selectedNcr.job_order_no || '-' }}</td></tr>
                      <tr><th>Status</th><td>{{ selectedNcr.status || '-' }}</td></tr>
                      <tr><th>Severity</th><td>{{ selectedNcr.severity || '-' }}</td></tr>
                    </tbody>
                  </table>
                </section>

                <section class="ncr-doc-section">
                  <h4>2. Non-Conformance Details</h4>
                  <table class="ncr-doc-table">
                    <tbody>
                      <tr><th>NCR Description</th><td>{{ selectedNcr.description || '-' }}</td></tr>
                      <tr><th>What Failed / Where / Detection</th><td>{{ selectedNcr.failure_description || '-' }}</td></tr>
                      <tr><th>Primary SOP Potentially Breached</th><td>{{ selectedNcr.primary_sop_breached || '-' }}</td></tr>
                      <tr><th>Type of Conformance</th><td>{{ selectedNcr.conformance_type || '-' }}</td></tr>
                      <tr><th>Quantity Affected</th><td>{{ selectedNcr.quantity_affected ?? '-' }}</td></tr>
                      <tr><th>Items Rejected / Set Aside</th><td>{{ selectedNcr.items_rejected_status || '-' }}</td></tr>
                      <tr><th>Rejects Location</th><td>{{ selectedNcr.rejects_location || selectedNcr.workstation || '-' }}</td></tr>
                    </tbody>
                  </table>
                </section>

                <section class="ncr-doc-section">
                  <h4>3. Impact and Immediate Actions</h4>
                  <table class="ncr-doc-table">
                    <tbody>
                      <tr><th>Production Impact</th><td>{{ selectedNcr.production_impact || '-' }}</td></tr>
                      <tr><th>Client Impacted</th><td>{{ selectedNcr.client_impacted ? 'Yes' : 'No' }}</td></tr>
                      <tr><th>Immediate Action Taken</th><td>{{ selectedNcr.immediate_action_taken || '-' }}</td></tr>
                    </tbody>
                  </table>
                </section>

                <section class="ncr-doc-section">
                  <h4>4. Root Cause and Preventive Actions</h4>
                  <table class="ncr-doc-table">
                    <tbody>
                      <tr><th>Root Cause Category</th><td>{{ selectedNcr.root_cause_category || '-' }}</td></tr>
                      <tr><th>Root Cause Description</th><td>{{ selectedNcr.root_cause_description || '-' }}</td></tr>
                      <tr><th>Preventive Action</th><td>{{ selectedNcr.preventive_action || '-' }}</td></tr>
                    </tbody>
                  </table>
                </section>

                <section class="ncr-doc-section">
                  <h4>5. Re-Inspection and Closure</h4>
                  <table class="ncr-doc-table">
                    <tbody>
                      <tr><th>Re-Inspection Performed</th><td>{{ selectedNcr.reinspection_performed_status || (selectedNcr.reinspection_performed ? 'yes' : 'no') }}</td></tr>
                      <tr><th>Re-Inspection Other</th><td>{{ selectedNcr.reinspection_performed_other || '-' }}</td></tr>
                      <tr><th>Results</th><td>{{ selectedNcr.reinspection_results || '-' }}</td></tr>
                      <tr><th>Resolution</th><td>{{ selectedNcr.resolution || '-' }}</td></tr>
                    </tbody>
                  </table>
                </section>
              </div>

              <a
                v-if="selectedNcr.image_url"
                :href="selectedNcr.image_url"
                target="_blank"
                class="inline-flex mt-4 text-sm text-blue-700 dark:text-blue-300 hover:underline font-medium"
              >
                View Uploaded Image
              </a>
            </div>

            <div class="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-end gap-2">
              <button class="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" @click="openEditModal(selectedNcr.id)">Edit</button>
              <button class="px-3.5 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-600 shadow-sm" @click="printSelectedNcr">Print</button>
              <button class="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-600 shadow-sm" @click="downloadSelectedNcrPdf">Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="ncr-drawer">
      <div v-if="isCreateModalOpen" class="fixed inset-0 z-[120]">
        <div class="ncr-drawer-backdrop absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="closeCreateModal"></div>
        <div class="ncr-drawer-panel absolute inset-y-0 right-0 w-full md:max-w-5xl xl:max-w-6xl bg-white/95 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">{{ modalMode === 'edit' ? 'Edit NCR' : 'New NCR' }}</h2>
              <p class="text-xs text-slate-600 dark:text-slate-300">{{ modalMode === 'edit' ? 'Update existing NCR details.' : 'Slide-over form aligned to operations NCR capture.' }}</p>
            </div>
            <button class="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" @click="closeCreateModal">
              <i class="mdi mdi-close"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div ref="createFormContainer" class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model="createForm.raised_by_name" placeholder="Raised By" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600" />
              <input v-model="createForm.timestamp" type="datetime-local" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600" />
              <select v-model="createForm.shift" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Shift</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
              <div class="relative">
                <input
                  v-model="createEnquiryQuery"
                  placeholder="Search Project / Order No"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
                  @focus="showCreateEnquiryDropdown = true"
                  @input="onCreateEnquiryInput"
                  @blur="onCreateEnquiryBlur"
                />
                <div
                  v-if="showCreateEnquiryDropdown && createEnquirySuggestions.length > 0"
                  class="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg"
                >
                  <button
                    v-for="enquiry in createEnquirySuggestions"
                    :key="`create-enquiry-${enquiry.id}`"
                    type="button"
                    class="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                    @mousedown.prevent="selectCreateEnquiry(enquiry)"
                  >
                    <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{{ enquiry.title || 'Untitled Enquiry' }}</p>
                    <p class="text-xs text-slate-600 dark:text-slate-300 truncate">
                      {{ enquiry.job_number || enquiry.enquiry_number || `Enquiry #${enquiry.id}` }}
                    </p>
                  </button>
                </div>
              </div>
              <select v-model="createForm.severity" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Select Severity</option>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
              <select v-model="createForm.primary_sop_breached" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Primary SOP Potentially Breached</option>
                <option v-for="sop in primarySopOptions" :key="`create-${sop}`" :value="sop">{{ sop }}</option>
              </select>
              <input v-model="createForm.workstation" placeholder="Rejects Location / Workstation" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600" />
              <textarea v-model="createForm.description" rows="2" placeholder="NCR Description" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <textarea v-model="createForm.failure_description" rows="2" placeholder="Description (What failed, where, how detected)" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <input v-model.number="createForm.quantity_affected" type="number" min="0" placeholder="Quantity Affected" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600" />
              <select v-model="createForm.items_rejected_status" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Items Rejected / Set Aside</option>
                <option v-for="item in itemsRejectedStatusOptions" :key="`create-rejected-${item.value}`" :value="item.value">{{ item.label }}</option>
              </select>
              <select v-model="createForm.conformance_type" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Type of Conformance</option>
                <option v-for="item in conformanceTypeOptions" :key="`create-conformance-${item}`" :value="item">{{ item }}</option>
              </select>
              <select v-model="createForm.production_impact" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Production Impact</option>
                <option v-for="item in productionImpactOptions" :key="`create-impact-${item.value}`" :value="item.value">{{ item.label }}</option>
              </select>
              <textarea v-model="createForm.immediate_action_taken" rows="2" placeholder="Immediate Action Taken" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <select v-model="createForm.root_cause_category" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Root Cause Category</option>
                <option v-for="item in rootCauseCategoryOptions" :key="`create-root-cause-${item}`" :value="item">{{ item }}</option>
              </select>
              <select v-model="createForm.client_impacted" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option :value="true">Client Impacted: Yes</option>
                <option :value="false">Client Impacted: No</option>
              </select>
              <textarea v-model="createForm.root_cause_description" rows="2" placeholder="Root Cause Description" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <textarea v-model="createForm.preventive_action" rows="2" placeholder="Preventive Action" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <select v-model="createForm.reinspection_performed_status" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600">
                <option value="">Re-Inspection Performed</option>
                <option v-for="item in reinspectionPerformedOptions" :key="`create-reinspect-${item.value}`" :value="item.value">{{ item.label }}</option>
              </select>
              <input
                v-if="createForm.reinspection_performed_status === 'other'"
                v-model="createForm.reinspection_performed_other"
                placeholder="Other re-inspection detail"
                class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
              />
              <textarea v-model="createForm.reinspection_results" rows="2" placeholder="Results" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <textarea v-model="createForm.resolution" rows="2" placeholder="Resolution" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"></textarea>
              <input type="file" accept="image/*" class="md:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white" @change="onCreateImageSelected" />
            </div>
          </div>

          <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" @click="closeCreateModal">Cancel</button>
            <button class="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-700" @click="submitNcrModal">
              {{ modalMode === 'edit' ? 'Save Changes' : 'Create NCR' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import api from '@/plugins/axios'
import { productionNcrsService } from '../services/productionNcrs'
import type { ProductionNcr } from '../types'

type EnquirySuggestion = {
  id: number
  title?: string | null
  enquiry_number?: string | null
  job_number?: string | null
}

const ncrs = ref<ProductionNcr[]>([])
const selectedNcr = ref<ProductionNcr | null>(null)
const errorMessage = ref('')

const filters = ref({
  search: '',
  status: '',
  severity: '',
})

const createForm = ref({
  timestamp: '',
  raised_by_name: '',
  shift: '',
  job_order_no: '',
  severity: '' as '' | 'minor' | 'major' | 'critical',
  description: '',
  quantity_affected: null as number | null,
  failure_description: '',
  conformance_type: '',
  primary_sop_breached: '',
  items_rejected: null as number | null,
  items_rejected_status: '' as '' | 'yes' | 'no' | 'delayed' | 'na',
  production_impact: '',
  client_impacted: false,
  immediate_action_taken: '',
  root_cause_category: '',
  root_cause_description: '',
  preventive_action: '',
  reinspection_performed: false,
  reinspection_performed_status: '' as '' | 'yes' | 'no' | 'na' | 'other',
  reinspection_performed_other: '',
  reinspection_results: '',
  resolution: '',
  supervisor_approval: false,
  qc_stage: '',
  workstation: '',
})

const primarySopOptions = [
  'Incident Report SOP',
  'Non-Conformance Report SOP',
  'Product Quality Standards Manual SOP',
  'WNG Workflow 2026(ERP Aligned)',
  'Customer Service  SOP',
  'Account Management SOP',
  'Client Communication & Response SOP',
  'Customer Feedback & Survey SOP',
  'Client Onboarding SOP',
  'Complaint & Issue Resolution SOP',
  'Cross-Selling & Upselling SOP',
  'Lead Management SOP',
  'Order Confirmation & Project Handover SOP',
  'Sales Operations SOP',
  'Client Exit & Offboarding SOP',
  'Collaboration with Other Departments SOP',
  'Costing & Pricing SOP',
  'VIP Client Handling SOP',
  'Internal Audit & Compliance SOP',
  'Creative Design SOP',
  'Print SOP(All Inclusive)',
  'Printing Training Guide SOP',
  'Sticker Print Accuracy SOP',
  'Site Measurement SOP',
  'Photography SOP',
  'Finance SOP',
  'Financial Reporting SOP',
  'Accounts Payable SOP',
  'Accounts Receivable SOP',
  'Budgeting & Financial Reporting SOP',
  'Internal Financial Controls SOP',
  'Payroll Coordination SOP',
  'Expense  Reimbursement SOP',
  'PettyCash Management SOP',
  'Project & Product Costing SOP',
  'Procurement & Inventory Finance Linkage SOP',
  'Audit & Compliance SOP',
  'Capital Expenditure(CAPEX) & Asset Finance SOP',
  'Recruitment & Onboarding SOP',
  'Leave Management SOP',
  'Compensation & Payroll SOP',
  'Performance Management',
  'Disciplinary & Grievance Handling',
  'Learning & Development SOP',
  'Employee Welfare SOP',
  'Occuptional Safety & Health (OSH)',
  'Employee Separation',
  'ICT SOP',
  'ICT & Digital Systems SOP',
  'Data Policy SOP',
  'WNG Asset Policy SOP',
  'WNG ERP Development',
  'Marketing & Strategy Development SOP',
  'Content Development & Approval SOP',
  'Digital & Social Media SOP',
  'Brand Asset Management SOP',
  'Event Marketing SOP',
  'Internal Communication SOP',
  'Media & PR Engagement SOP',
  'Client Promotion SOP',
  'Project Management SOP',
  'Project Management Client Delivery SOP',
  'Project Close Out  SOP',
  'Event Execution SOP',
  'Procurement & Inventory SOP',
  'Asset Management SOP',
  'Production SOP',
  'Equipment & Machine Maintenance SOP',
  'Safety & Compliance SOP',
  'Workshop,Storage & Events Asset Handling Management SOP',
  'Transport, Logistics & Dispatch SOP',
  'Tailoring SOP',
  'Night Operations SOP',
  'Security Operations SOP',
  'Facility Operations SOP',
  'Safety  Operations SOP',
] as const

const conformanceTypeOptions = [
  'Measurement Accuracy/Dimensional Specifications',
  'Structural/Safety',
  'Material Specification',
  'Surface Finish',
  'Printing/Branding',
  'Functional Specification',
  'Incomplete/Missing',
  'Process Deviation',
  'Procurement Delays',
  'Delivery Delays/Poor Logistics',
  'Quality Assurance',
  'Design Specification',
  'Teamwork & Communication Protocols',
  'Installation & Measurement Accuracy',
] as const

const itemsRejectedStatusOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'na', label: 'N/A' },
] as const

const productionImpactOptions = [
  { value: 'stopped', label: 'Stopped' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'na', label: 'N/A' },
] as const

const rootCauseCategoryOptions = [
  'Tooling',
  'Operator Error',
  'Training Gap',
  'Material Defect',
  'Supplier Issues',
  'Environment',
  'SOP Not Followed',
  'Planning & Schedule Pressure',
  'Other',
  'Quantity Issues',
  'Procurement & Supply Chain Gap',
  'Transportation & Dispatch Inefficiencies',
  'Communication & Brief Instruction Deficiency',
  'Operational Decision-Making & Approval Delays',
  'Maintenance Oversight',
  'Quality Assurance Issues',
  'Measurement Accuracy & Verification',
  'Fabrication Adjustment & Design Compliance',
  'Team Collaboration & Communication',
] as const

const reinspectionPerformedOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'na', label: 'N/A' },
  { value: 'other', label: 'Other' },
] as const

const createImageFile = ref<File | null>(null)
const isCreateModalOpen = ref(false)
const isDetailsModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingNcrId = ref<number | null>(null)
const createFormContainer = ref<HTMLElement | null>(null)
const createEnquiryQuery = ref('')
const createEnquirySuggestions = ref<EnquirySuggestion[]>([])
const showCreateEnquiryDropdown = ref(false)
let createEnquiryTimer: ReturnType<typeof setTimeout> | null = null

const clearInvalidHighlights = (container: HTMLElement | null) => {
  if (!container) return
  container.querySelectorAll('.ncr-invalid').forEach((el) => el.classList.remove('ncr-invalid'))
}

const validateCompulsoryFields = (container: HTMLElement | null): boolean => {
  if (!container) return true

  clearInvalidHighlights(container)

  let firstInvalid: HTMLElement | null = null
  const fields = container.querySelectorAll('input, select, textarea')

  fields.forEach((element) => {
    const el = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    if ((el as HTMLInputElement).type === 'file' || (el as HTMLInputElement).type === 'checkbox' || el.disabled) {
      return
    }
    if (el.offsetParent === null) {
      return
    }

    const value = String(el.value ?? '').trim().toLowerCase()
    const isMissing = value === '' || value === 'null' || value === 'undefined'

    if (isMissing) {
      el.classList.add('ncr-invalid')
      if (!firstInvalid) {
        firstInvalid = el
      }
    }
  })

  if (firstInvalid) {
    firstInvalid.focus()
    return false
  }

  return true
}

const resetCreateForm = () => {
  createForm.value = {
    timestamp: '',
    raised_by_name: '',
    shift: '',
    job_order_no: '',
    severity: '',
    description: '',
    quantity_affected: null,
    failure_description: '',
    conformance_type: '',
    primary_sop_breached: '',
    items_rejected: null,
    items_rejected_status: '',
    production_impact: '',
    client_impacted: false,
    immediate_action_taken: '',
    root_cause_category: '',
    root_cause_description: '',
    preventive_action: '',
    reinspection_performed: false,
    reinspection_performed_status: '',
    reinspection_performed_other: '',
    reinspection_results: '',
    resolution: '',
    qc_stage: '',
    workstation: '',
  }
  createEnquiryQuery.value = ''
  createEnquirySuggestions.value = []
}

const openCreateModal = () => {
  modalMode.value = 'create'
  editingNcrId.value = null
  resetCreateForm()
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
  createImageFile.value = null
  showCreateEnquiryDropdown.value = false
  createEnquirySuggestions.value = []
}

const buildJobOrderCode = (enquiry: EnquirySuggestion): string => {
  return enquiry.job_number || enquiry.enquiry_number || ''
}

const buildJobOrderDisplay = (enquiry: EnquirySuggestion): string => {
  const code = buildJobOrderCode(enquiry)
  const title = enquiry.title || ''
  if (title && code) return `${title} (${code})`
  return code || title
}

const searchEnquiries = async (term: string): Promise<EnquirySuggestion[]> => {
  const query = term.trim()
  if (query.length < 2) return []

  try {
    const views = ['enquiries', 'projects', 'completed'] as const
    const responses = await Promise.all(
      views.map((view) =>
        api.get('/api/projects/enquiries', {
          params: {
            search: query,
            per_page: 8,
            sort_by: 'created_at',
            sort_order: 'desc',
            view,
          },
        }),
      ),
    )

    const unique = new Map<number, EnquirySuggestion>()
    for (const response of responses) {
      const rows: EnquirySuggestion[] = response?.data?.data?.data || []
      for (const row of rows) {
        if (!unique.has(row.id)) {
          unique.set(row.id, row)
        }
      }
    }
    return Array.from(unique.values()).slice(0, 8)
  } catch {
    return []
  }
}

const onCreateEnquiryInput = () => {
  createForm.value.job_order_no = createEnquiryQuery.value
  if (createEnquiryTimer) clearTimeout(createEnquiryTimer)
  createEnquiryTimer = setTimeout(async () => {
    createEnquirySuggestions.value = await searchEnquiries(createEnquiryQuery.value)
    showCreateEnquiryDropdown.value = true
  }, 250)
}

const selectCreateEnquiry = (enquiry: EnquirySuggestion) => {
  const code = buildJobOrderCode(enquiry)
  createForm.value.job_order_no = code
  createEnquiryQuery.value = buildJobOrderDisplay(enquiry)
  showCreateEnquiryDropdown.value = false
}

const onCreateEnquiryBlur = () => {
  setTimeout(() => {
    showCreateEnquiryDropdown.value = false
  }, 150)
}

const loadNcrs = async () => {
  errorMessage.value = ''
  const response = await productionNcrsService.getNcrs({
    search: filters.value.search,
    status: filters.value.status,
    severity: filters.value.severity,
  })

  if (!response?.success) {
    errorMessage.value = response?.error_message || 'Failed to load NCRs'
    return
  }

  ncrs.value = response?.data?.data || []
}

const selectNcr = async (id: number) => {
  const response = await productionNcrsService.getNcr(id)
  if (!response?.success) {
    errorMessage.value = response?.error_message || 'Failed to load NCR details'
    return
  }

  const ncr = response.data as ProductionNcr
  selectedNcr.value = ncr
}

const openDetailsModal = async (id: number) => {
  await selectNcr(id)
  if (!selectedNcr.value) return
  isDetailsModalOpen.value = true
}

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false
}

const getNcrDetailRows = (ncr: ProductionNcr): Array<[string, string]> => [
  ['NCR Number', ncr.ncr_number || '-'],
  ['Project / Order No', ncr.job_order_no || '-'],
  ['Raised By', ncr.raised_by_name || '-'],
  ['Shift', ncr.shift || '-'],
  ['Severity', ncr.severity || '-'],
  ['Status', ncr.status || '-'],
  ['NCR Description', ncr.description || '-'],
  ['Failure Description', ncr.failure_description || '-'],
  ['Quantity Affected', String(ncr.quantity_affected ?? '-')],
  ['Primary SOP Breached', ncr.primary_sop_breached || '-'],
  ['Type of Conformance', ncr.conformance_type || '-'],
  ['Items Rejected / Set Aside', ncr.items_rejected_status || '-'],
  ['Rejects Location', ncr.rejects_location || ncr.workstation || '-'],
  ['Production Impact', ncr.production_impact || '-'],
  ['Client Impacted', ncr.client_impacted ? 'Yes' : 'No'],
  ['Immediate Action Taken', ncr.immediate_action_taken || '-'],
  ['Root Cause Category', ncr.root_cause_category || '-'],
  ['Root Cause Description', ncr.root_cause_description || '-'],
  ['Preventive Action', ncr.preventive_action || '-'],
  ['Re-Inspection Performed', ncr.reinspection_performed_status || (ncr.reinspection_performed ? 'yes' : 'no')],
  ['Re-Inspection Other', ncr.reinspection_performed_other || '-'],
  ['Results', ncr.reinspection_results || '-'],
  ['Resolution', ncr.resolution || '-'],
]

const openEditModal = async (id: number) => {
  await selectNcr(id)
  if (!selectedNcr.value) return

  const ncr = selectedNcr.value
  isDetailsModalOpen.value = false
  modalMode.value = 'edit'
  editingNcrId.value = ncr.id

  createForm.value = {
    timestamp: ncr.detected_at ? String(ncr.detected_at).slice(0, 16) : '',
    raised_by_name: ncr.raised_by_name || '',
    shift: ncr.shift || '',
    job_order_no: ncr.job_order_no || '',
    severity: (ncr.severity || '') as '' | 'minor' | 'major' | 'critical',
    description: ncr.description || '',
    quantity_affected: ncr.quantity_affected ?? null,
    failure_description: ncr.failure_description || '',
    conformance_type: ncr.conformance_type || '',
    primary_sop_breached: ncr.primary_sop_breached || '',
    items_rejected: ncr.items_rejected ?? null,
    items_rejected_status: (ncr.items_rejected_status as '' | 'yes' | 'no' | 'delayed' | 'na' | null) ?? '',
    production_impact: ncr.production_impact || '',
    client_impacted: !!ncr.client_impacted,
    immediate_action_taken: ncr.immediate_action_taken || '',
    root_cause_category: ncr.root_cause_category || '',
    root_cause_description: ncr.root_cause_description || '',
    preventive_action: ncr.preventive_action || '',
    reinspection_performed: !!ncr.reinspection_performed,
    reinspection_performed_status:
      (ncr.reinspection_performed_status as '' | 'yes' | 'no' | 'na' | 'other' | null) ??
      (ncr.reinspection_performed ? 'yes' : 'no'),
    reinspection_performed_other: ncr.reinspection_performed_other || '',
    reinspection_results: ncr.reinspection_results || '',
    resolution: ncr.resolution || '',
    qc_stage: ncr.qc_stage || ncr.primary_sop_breached || '',
    workstation: ncr.workstation || ncr.rejects_location || '',
  }

  createEnquiryQuery.value = ncr.job_order_no || ''
  isCreateModalOpen.value = true
}

const escapeHtml = (value: unknown): string => {
  return String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const printSelectedNcr = () => {
  if (!selectedNcr.value) return

  const ncr = selectedNcr.value
  const rows = getNcrDetailRows(ncr)

  const body = rows
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join('')

  const printWindow = window.open('', '_blank', 'width=1000,height=900')
  if (!printWindow) {
    errorMessage.value = 'Unable to open print window. Please allow pop-ups and try again.'
    return
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>NCR ${escapeHtml(ncr.ncr_number)}</title>
        <style>
          body{font-family:Arial,sans-serif;padding:24px;color:#111827}
          h1{margin:0 0 6px 0;font-size:22px}
          p{margin:0 0 18px 0;color:#4b5563}
          table{width:100%;border-collapse:collapse}
          th,td{border:1px solid #e5e7eb;padding:10px;vertical-align:top;text-align:left;font-size:13px}
          th{width:30%;background:#f8fafc}
        </style>
      </head>
      <body>
        <h1>Non-Conformance Report</h1>
        <p>${escapeHtml(ncr.ncr_number)} | ${escapeHtml(ncr.job_order_no)}</p>
        <table><tbody>${body}</tbody></table>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => printWindow.print(), 300)
}

const downloadSelectedNcrPdf = () => {
  if (!selectedNcr.value) return

  const ncr = selectedNcr.value
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const rows = getNcrDetailRows(ncr)

  doc.setFontSize(16)
  doc.text('Non-Conformance Report', 40, 44)
  doc.setFontSize(10)
  doc.text(`${ncr.ncr_number || '-'} | ${ncr.job_order_no || '-'}`, 40, 64)

  autoTable(doc, {
    startY: 80,
    head: [['Field', 'Value']],
    body: rows.map(([label, value]) => [label, value]),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 6, overflow: 'linebreak', valign: 'top' },
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: {
      0: { cellWidth: 175, fontStyle: 'bold' },
      1: { cellWidth: 345 },
    },
  })

  const fileName = `NCR-${String(ncr.ncr_number || ncr.id).replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`
  doc.save(fileName)
}

const buildCreatePayload = () => ({
  timestamp: createForm.value.timestamp || null,
  raised_by_name: createForm.value.raised_by_name || null,
  shift: createForm.value.shift || null,
  job_order_no: createForm.value.job_order_no || null,
  severity: createForm.value.severity,
  description: createForm.value.description,
  quantity_affected: createForm.value.quantity_affected ?? null,
  failure_description: createForm.value.failure_description || null,
  conformance_type: createForm.value.conformance_type || null,
  items_rejected: createForm.value.items_rejected ?? null,
  items_rejected_status: createForm.value.items_rejected_status || null,
  production_impact: createForm.value.production_impact || null,
  client_impacted: createForm.value.client_impacted,
  immediate_action_taken: createForm.value.immediate_action_taken || null,
  root_cause_category: createForm.value.root_cause_category || null,
  root_cause_description: createForm.value.root_cause_description || null,
  preventive_action: createForm.value.preventive_action || null,
  reinspection_performed: createForm.value.reinspection_performed_status === 'yes',
  reinspection_performed_status: createForm.value.reinspection_performed_status || null,
  reinspection_performed_other:
    createForm.value.reinspection_performed_status === 'other'
      ? (createForm.value.reinspection_performed_other || null)
      : null,
  reinspection_results: createForm.value.reinspection_results || null,
  resolution: createForm.value.resolution || null,
  supervisor_approval: false,
  primary_sop_breached: createForm.value.primary_sop_breached || null,
  rejects_location: createForm.value.workstation || null,
  qc_stage: createForm.value.primary_sop_breached || null,
  workstation: createForm.value.workstation || null,
  source_type: 'manual' as const,
})

const submitNcrModal = async () => {
  if (!validateCompulsoryFields(createFormContainer.value)) {
    errorMessage.value = 'Please fill all required fields highlighted in red before saving.'
    return
  }

  errorMessage.value = ''

  if (modalMode.value === 'edit') {
    if (!editingNcrId.value) {
      errorMessage.value = 'No NCR selected for edit.'
      return
    }

    const response = await productionNcrsService.updateNcr(editingNcrId.value, buildCreatePayload())
    if (!response?.success) {
      errorMessage.value = response?.error_message || 'Failed to update NCR'
      return
    }

    if (createImageFile.value) {
      const imageResponse = await productionNcrsService.uploadImage(editingNcrId.value, createImageFile.value)
      if (!imageResponse?.success) {
        errorMessage.value = imageResponse?.error_message || 'NCR updated but image upload failed'
      }
      createImageFile.value = null
    }

    await Promise.all([loadNcrs(), selectNcr(editingNcrId.value)])
    closeCreateModal()
    return
  }

  await createNcr()
}

const createNcr = async () => {
  if (!validateCompulsoryFields(createFormContainer.value)) {
    errorMessage.value = 'Please fill all required fields highlighted in red before creating NCR.'
    return
  }

  const response = await productionNcrsService.createNcr(buildCreatePayload())

  if (!response?.success) {
    errorMessage.value = response?.error_message || 'Failed to create NCR'
    return
  }

  if (createImageFile.value && response?.data?.id) {
    const imageResponse = await productionNcrsService.uploadImage(response.data.id, createImageFile.value)
    if (!imageResponse?.success) {
      errorMessage.value = imageResponse?.error_message || 'NCR created but image upload failed'
    }
    createImageFile.value = null
  }

  createForm.value = {
    timestamp: '',
    raised_by_name: '',
    shift: '',
    job_order_no: '',
    severity: '',
    description: '',
    quantity_affected: null,
    failure_description: '',
    conformance_type: '',
    primary_sop_breached: '',
    items_rejected: null,
    items_rejected_status: '',
    production_impact: '',
    client_impacted: false,
    immediate_action_taken: '',
    root_cause_category: '',
    root_cause_description: '',
    preventive_action: '',
    reinspection_performed: false,
    reinspection_performed_status: '',
    reinspection_performed_other: '',
    reinspection_results: '',
    resolution: '',
    qc_stage: '',
    workstation: '',
  }
  createEnquiryQuery.value = ''
  createEnquirySuggestions.value = []

  await loadNcrs()
  closeCreateModal()
}

const refreshData = async () => {
  await loadNcrs()
}

const onCreateImageSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  createImageFile.value = input.files?.[0] || null
}

onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.ncr-doc {
  font-family: Cambria, Georgia, 'Times New Roman', serif;
  line-height: 1.45;
}

.ncr-doc-header h3 {
  margin: 0;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  font-weight: 700;
  color: rgb(15 23 42);
}

.dark .ncr-doc-header h3 {
  color: rgb(241 245 249);
}

.ncr-doc-header p {
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  font-size: 0.82rem;
  color: rgb(71 85 105);
}

.dark .ncr-doc-header p {
  color: rgb(148 163 184);
}

.ncr-doc-section {
  margin-top: 0.9rem;
}

.ncr-doc-section h4 {
  margin: 0 0 0.4rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(30 41 59);
}

.dark .ncr-doc-section h4 {
  color: rgb(226 232 240);
}

.ncr-doc-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgb(226 232 240);
}

.dark .ncr-doc-table {
  border-color: rgb(51 65 85);
}

.ncr-doc-table th,
.ncr-doc-table td {
  border: 1px solid rgb(226 232 240);
  padding: 0.46rem 0.55rem;
  vertical-align: top;
  font-size: 0.82rem;
  text-align: left;
}

.dark .ncr-doc-table th,
.dark .ncr-doc-table td {
  border-color: rgb(51 65 85);
}

.ncr-doc-table th {
  width: 31%;
  font-weight: 700;
  color: rgb(30 41 59);
  background: rgb(248 250 252);
}

.dark .ncr-doc-table th {
  color: rgb(226 232 240);
  background: rgb(15 23 42);
}

.ncr-doc-table td {
  color: rgb(30 41 59);
  white-space: pre-wrap;
  word-break: break-word;
}

.dark .ncr-doc-table td {
  color: rgb(226 232 240);
}

.ncr-details-modal-enter-active,
.ncr-details-modal-leave-active {
  transition: opacity 0.26s ease;
}

.ncr-details-modal-enter-from,
.ncr-details-modal-leave-to {
  opacity: 0;
}

.ncr-details-backdrop {
  transition: opacity 0.24s ease;
}

.ncr-details-panel {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}

.ncr-details-modal-enter-from .ncr-details-panel,
.ncr-details-modal-leave-to .ncr-details-panel {
  transform: translateY(14px) scale(0.992);
  opacity: 0;
}

.ncr-drawer-enter-active,
.ncr-drawer-leave-active {
  transition: opacity 0.32s ease;
}
.ncr-drawer-enter-from,
.ncr-drawer-leave-to {
  opacity: 0;
}

.ncr-drawer-backdrop {
  transition: opacity 0.3s ease;
}

.ncr-drawer-panel {
  will-change: transform, opacity;
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease;
}

.ncr-drawer-enter-from .ncr-drawer-panel,
.ncr-drawer-leave-to .ncr-drawer-panel {
  transform: translateX(104%);
  opacity: 0.98;
}

.ncr-drawer-enter-from .ncr-drawer-backdrop,
.ncr-drawer-leave-to .ncr-drawer-backdrop {
  opacity: 0;
}

.ncr-invalid {
  border-color: rgb(239 68 68) !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}
</style>
