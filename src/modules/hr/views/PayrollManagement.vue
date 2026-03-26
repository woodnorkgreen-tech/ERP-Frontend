<template>
  <div class="p-8">
    <div class="mb-8 flex items-end justify-between">
      <div>
        <h1 class="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
          Payroll <span class="text-emerald-500">Engine</span>
        </h1>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Global Tax Settings & Ledgers</p>
      </div>
      <div class="flex gap-4">
        <button @click="activeTab = 'compliance'" :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all', activeTab === 'compliance' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 dark:border-slate-700']">
          Compliance
        </button>
        <button @click="activeTab = 'variables'" :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all', activeTab === 'variables' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 dark:border-slate-700']">
          Tax Variables
        </button>
        <button @click="activeTab = 'bands'" :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all', activeTab === 'bands' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 dark:border-slate-700']">
          Tax Bands
        </button>
        <button @click="activeTab = 'ledgers'" :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all', activeTab === 'ledgers' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 dark:border-slate-700']">
          Global Ledgers
        </button>
        <button @click="activeTab = 'history'" :class="['px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all', activeTab === 'history' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 dark:border-slate-700']">
           Payslips
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 font-black text-xs uppercase tracking-widest italic animate-in fade-in">
      <i class="mdi mdi-alert mr-2"></i> {{ error }}
    </div>

    <!-- Loading State for full view -->
    <div v-if="loading && (!variables.length && !ledgers.length && !taxBands.length)" class="flex justify-center p-20">
      <div class="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>

    <!-- Main Content Tabs -->
    <div v-if="!loading" class="animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <!-- Tab 0: Compliance Dashboard -->
      <div v-if="activeTab === 'compliance'" class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
         <div class="flex items-center justify-between">
            <div>
               <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Statutory Compliance Dashboard</h2>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly Aggregate Deductions & Remittance Status</p>
            </div>
            <div class="flex items-center gap-4">
               <input v-model="historyFilter.month" type="month" class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
               <button @click="fetchComplianceSummary(historyFilter.month)" class="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                  <i class="mdi mdi-refresh"></i>
               </button>
            </div>
         </div>

         <div v-if="complianceSummary" class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div v-for="(val, key) in {
               'PAYE (KRA)': complianceSummary.total_paye,
               'NSSF': complianceSummary.total_nssf,
               'SHIF': complianceSummary.total_shif,
               'HOUSING LEVY': complianceSummary.total_housing_levy
            }" :key="key" class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
               <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors"></div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{{ key }}</p>
               <h3 class="text-2xl font-black text-slate-900 dark:text-white">KES {{ Math.round(val).toLocaleString() }}</h3>
               <div class="mt-4 flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Aggregate Total</span>
               </div>
            </div>
         </div>

         <div v-if="complianceSummary && (complianceSummary.employee_count > 0)" class="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div class="p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50">
               <div>
                  <h4 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Remittance Progress</h4>
                  <p class="text-xs font-medium text-slate-400 mt-1 italic">{{ complianceSummary.paid_count }} of {{ complianceSummary.employee_count }} payslips marked as PAID</p>
               </div>
               <button 
                  v-if="complianceSummary.paid_count < complianceSummary.employee_count"
                  @click="handleMarkPaid" 
                  class="px-8 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
               >
                  <i class="mdi mdi-check-decagram text-emerald-500 text-lg"></i> Mark All as Remitted
               </button>
               <div v-else class="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20">
                  <i class="mdi mdi-check-decagram text-lg"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest">Fully Remitted & Paid</span>
               </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="h-2 bg-slate-50 dark:bg-slate-900 w-full overflow-hidden">
               <div :style="{ width: (complianceSummary.employee_count > 0 ? (complianceSummary.paid_count / complianceSummary.employee_count * 100) : 0) + '%' }" class="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
            </div>
         </div>

         <div v-if="!complianceSummary || complianceSummary.employee_count === 0" class="p-20 text-center bg-slate-50 dark:bg-slate-800/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <i class="mdi mdi-chart-box-outline text-6xl text-slate-200 mb-4 block"></i>
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">No data available for {{ historyFilter.month }}</p>
            <button @click="fetchComplianceSummary(historyFilter.month)" class="mt-6 px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">Fetch Summary</button>
         </div>
      </div>

      <!-- Tab 1: Variables -->
      <div v-if="activeTab === 'variables'" class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-black text-slate-800 dark:text-slate-200">Active Configurations</h2>
          <button @click="resetVarForm(); showVariableModal = true" class="px-5 py-2.5 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
            <i class="mdi mdi-plus text-sm"></i> Add Variable
          </button>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Variable Name</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Description</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Type</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Value</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Status</th>
                   </tr>
                </thead>
                <tbody class="text-sm">
                   <tr v-if="variables.length === 0">
                      <td colspan="5" class="py-8 text-center text-xs font-black text-slate-400 uppercase tracking-widest">No configurations found.</td>
                   </tr>
                   <tr v-for="variable in variables" :key="variable.id" class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td class="py-4 px-6 font-black text-slate-900 dark:text-white uppercase text-sm italic">{{ variable.name.replace(/_/g, ' ') }}</td>
                      <td class="py-4 px-6 font-bold text-slate-500 text-xs">{{ variable.description || 'No description' }}</td>
                      <td class="py-4 px-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">{{ variable.type }}</td>
                      <td class="py-4 px-6 text-right font-black text-slate-700 dark:text-slate-300 text-sm">
                         {{ variable.type === 'percentage' ? variable.value + '%' : 'KES ' + variable.value.toLocaleString() }}
                      </td>
                      <td class="py-4 px-6 text-right">
                         <div class="flex items-center justify-end gap-2">
                            <button @click="editVariable(variable)" class="p-2 bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-blue-500 rounded-lg transition-colors shadow-sm">
                               <i class="mdi mdi-pencil-outline"></i>
                            </button>
                            <button @click="toggleVariable(variable.id)" :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', variable.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-400']">
                               {{ variable.is_active ? 'Active' : 'Disabled' }}
                            </button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>

      <!-- Tab 2: Tax Bands -->
      <div v-else-if="activeTab === 'bands'" class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <h2 class="text-lg font-black text-slate-800 dark:text-slate-200">PAYE Matrix (Tax Bands)</h2>
            <button @click="resetBandForm(); showBandModal = true" class="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
              <i class="mdi mdi-plus text-sm"></i> Add Band
            </button>
          </div>
          <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Band Name</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Range (Monthly KES)</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Tax Rate</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Order</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Status</th>
                   </tr>
                </thead>
                <tbody class="text-sm">
                   <tr v-if="taxBands.length === 0">
                      <td colspan="5" class="py-8 text-center text-xs font-black text-slate-400 uppercase tracking-widest">No tax bands configured.</td>
                   </tr>
                   <tr v-for="band in taxBands" :key="band.id" class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td class="py-4 px-6 font-black text-slate-900 dark:text-white uppercase text-sm italic">{{ band.name }}</td>
                      <td class="py-4 px-6 font-bold text-slate-600 dark:text-slate-400 text-xs">
                         KES {{ band.min_amount.toLocaleString() }} <span class="mx-2 text-slate-300">→</span> 
                         {{ band.max_amount ? 'KES ' + band.max_amount.toLocaleString() : 'Above' }}
                      </td>
                      <td class="py-4 px-6 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                         {{ (band.rate * 100).toFixed(1) }}%
                      </td>
                      <td class="py-4 px-6 font-black text-slate-400 text-xs">{{ band.sort_order }}</td>
                      <td class="py-4 px-6 text-right">
                         <div class="flex items-center justify-end gap-2">
                            <button @click="editBand(band)" class="p-2 bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-blue-500 rounded-lg transition-colors shadow-sm">
                               <i class="mdi mdi-pencil-outline"></i>
                            </button>
                            <button @click="toggleTaxBand(band.id)" :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', band.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-400']">
                               {{ band.is_active ? 'Active' : 'Disabled' }}
                            </button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>

      <!-- Tab 3: Ledgers -->
      <div v-else-if="activeTab === 'ledgers'" class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <h2 class="text-lg font-black text-slate-800 dark:text-slate-200">Global Ledger Entries</h2>
            <button @click="showLedgerModal = true" class="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
              <i class="mdi mdi-plus text-sm"></i> Add Entry
            </button>
          </div>
          <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Employee</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Month</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Entry Name</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-emerald-500 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Addition</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-red-500 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Deduction</th>
                   </tr>
                </thead>
                <tbody class="text-sm">
                   <tr v-if="ledgers.length === 0">
                      <td colspan="5" class="py-8 text-center text-xs font-black text-slate-400 uppercase tracking-widest">No entries found.</td>
                   </tr>
                   <tr v-for="ledger in ledgers" :key="ledger.id" class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td class="py-4 px-6 font-bold text-sm italic">
                         {{ ledger.employee?.first_name }} {{ ledger.employee?.last_name }}
                      </td>
                      <td class="py-4 px-6 font-black text-sm text-slate-500 uppercase">{{ ledger.ledger_month }}</td>
                      <td class="py-4 px-6">
                         <p class="font-black text-sm text-slate-700 dark:text-slate-300 mb-0.5 uppercase italic">{{ ledger.name }}</p>
                         <p class="text-xs text-slate-400 font-bold uppercase tracking-wide">{{ ledger.description || 'No description' }}</p>
                      </td>
                      <td class="py-4 px-6 text-right font-black text-emerald-600">
                         {{ ledger.type === 'addition' ? (ledger.amount_type === 'percentage_of_basic' ? ledger.amount_value + '% Basic' : 'KES ' + ledger.amount_value.toLocaleString()) : '-' }}
                      </td>
                      <td class="py-4 px-6 text-right font-black text-red-600">
                         {{ ledger.type === 'deduction' ? (ledger.amount_type === 'percentage_of_basic' ? ledger.amount_value + '% Basic' : 'KES ' + ledger.amount_value.toLocaleString()) : '-' }}
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>

      <!-- Tab 5: History (Payslips) -->
      <div v-if="activeTab === 'history'" class="space-y-6">
        <!-- Process Results Summary -->
        <div v-if="batchResults" class="animate-in fade-in slide-in-from-top-4">
           <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Staff</div>
                 <div class="text-2xl font-black text-slate-800 dark:text-white">{{ batchResults.total }}</div>
              </div>
              <div class="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                 <div class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Success</div>
                 <div class="text-2xl font-black text-emerald-600">{{ batchResults.processed }}</div>
              </div>
              <div :class="batchResults.errors.length > 0 ? 'bg-red-50 dark:bg-red-900/30 border-red-200' : 'bg-white dark:bg-slate-800 border-slate-200'" class="p-6 rounded-3xl border dark:border-slate-700 shadow-sm">
                 <div :class="batchResults.errors.length > 0 ? 'text-red-500' : 'text-slate-400'" class="text-[10px] font-black uppercase tracking-widest mb-1">Errors</div>
                 <div :class="batchResults.errors.length > 0 ? 'text-2xl text-red-500' : 'text-2xl text-slate-800 dark:text-white'" class="font-black">{{ batchResults.errors.length }}</div>
              </div>
              <button @click="batchResults = null" class="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                 <i class="mdi mdi-close"></i> <span class="text-[10px] font-black uppercase tracking-widest ml-2">Dismiss Result</span>
              </button>
           </div>

           <div v-if="batchResults.errors.length > 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h4 class="text-[9px] font-black text-red-500 uppercase tracking-widest mb-4">Error Log</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div v-for="(err, i) in batchResults.errors" :key="i" class="p-3 bg-red-50/50 dark:bg-red-500/5 rounded-2xl flex gap-3 items-start border border-red-100/50 dark:border-red-500/10">
                    <i class="mdi mdi-alert-circle text-red-500 text-xs mt-0.5"></i>
                    <div>
                       <div class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase">{{ err.employee }}</div>
                       <div class="text-[9px] font-medium text-slate-500">{{ err.message }}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <h2 class="text-lg font-black text-slate-800 dark:text-slate-200">Generated Payslips</h2>
            <div class="flex items-center gap-3">
               <button @click="showProcessModal = true" class="px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20 mr-2">
                  <i class="mdi mdi-rocket-launch text-sm"></i> Run Process
               </button>

               <div class="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

               <button @click="exportBankRemittance(historyFilter.month)" class="px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
                  <i class="mdi mdi-bank text-sm text-emerald-500"></i> Bank CSV
               </button>

               <button @click="exportMpesaRemittance(historyFilter.month)" class="px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform">
                  <i class="mdi mdi-cellphone-message text-sm text-emerald-500"></i> MPESA CSV
               </button>

               <div class="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

               <input v-model="historyFilter.month" type="month" class="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
               <button @click="fetchPayslips({ payroll_month: historyFilter.month })" class="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                  <i class="mdi mdi-refresh"></i>
               </button>
               <button @click="onClearHistory" class="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10">
                  <i class="mdi mdi-trash-can-outline"></i>
               </button>
            </div>
          </div>
          <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
                <thead>
                   <tr>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Employee</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">Month</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Gross</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Deductions</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-emerald-500 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Net Pay</th>
                      <th class="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-right">Action</th>
                   </tr>
                </thead>
                <tbody class="text-sm">
                   <tr v-if="payslips.length === 0">
                      <td colspan="6" class="py-8 text-center text-xs font-black text-slate-400 uppercase tracking-widest">No payslips found for this period.</td>
                   </tr>
                   <tr v-for="slip in payslips" :key="slip.id" class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td class="py-4 px-6 font-black text-sm italic">
                         {{ slip.employee?.first_name }} {{ slip.employee?.last_name }}
                      </td>
                      <td class="py-4 px-6 font-black text-sm text-slate-500 uppercase">{{ slip.payroll_month }}</td>
                      <td class="py-4 px-6 text-right font-black text-slate-600 dark:text-slate-400 text-sm">
                         KES {{ Math.round(Number(slip.gross_pay)).toLocaleString() }}
                      </td>
                      <td class="py-4 px-6 text-right font-black text-red-500 text-sm">
                         -KES {{ Math.round(Number(slip.gross_pay) - Number(slip.net_pay)).toLocaleString() }}
                      </td>
                      <td class="py-4 px-6 text-right font-black text-emerald-600 text-sm">
                         KES {{ Math.round(Number(slip.net_pay)).toLocaleString() }}
                      </td>
                      <td class="py-4 px-6 text-right">
                         <div class="flex items-center justify-end gap-2">
                            <button @click="viewPayslipDetail(slip)" class="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 rounded-lg transition-colors">
                               <i class="mdi mdi-eye"></i>
                            </button>
                            <button @click="onDeletePayslip(slip.id)" class="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-lg transition-colors">
                               <i class="mdi mdi-trash-can-outline"></i>
                            </button>
                            <button @click="downloadPayslip(slip.id)" class="px-3 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-lg font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                               <i class="mdi mdi-download"></i> PDF
                            </button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Detailed View Modal -->
    <div v-if="showPayslipModal && selectedPayslip" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full -mr-16 -mt-16"></div>
        <div class="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Payslip <span class="text-emerald-500">Breakdown</span></h2>
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 italic">{{ selectedPayslip.employee?.first_name }} {{ selectedPayslip.employee?.last_name }} • {{ selectedPayslip.payroll_month }}</p>
          </div>
          <button @click="showPayslipModal = false" class="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-8 mb-8 relative z-10">
          <div class="space-y-4">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Gross Pay</p>
              <p class="text-xl font-black text-slate-900 dark:text-white">KES {{ Number(selectedPayslip.gross_pay).toLocaleString() }}</p>
            </div>
            
            <div class="space-y-3 px-1">
              <div v-for="(val, key) in selectedPayslip.tax_breakdown" :key="key" class="flex justify-between items-center group">
                 <span class="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {{ String(key).replace('_', ' ') }}
                 </span>
                 <span :class="['text-xs font-bold', key === 'paye' ? 'text-red-500' : 'text-slate-600 dark:text-slate-400']">
                    {{ key === 'personal_relief' ? '-' : '' }}KES {{ Number(val).toLocaleString() }}
                 </span>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10">
              <p class="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Net Pay</p>
              <p class="text-xl font-black text-emerald-600">KES {{ Number(selectedPayslip.net_pay).toLocaleString() }}</p>
            </div>

            <div v-if="Object.keys(selectedPayslip.ledger_breakdown || {}).length > 0" class="pt-2">
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Other Adjustments</p>
              <div class="space-y-3 px-1">
                <div v-for="(val, key) in selectedPayslip.ledger_breakdown" :key="key" class="flex justify-between items-center group">
                   <span class="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
                      {{ key }}
                   </span>
                   <span :class="['text-xs font-bold', Number(val) < 0 ? 'text-red-500' : 'text-emerald-500']">
                      {{ Number(val) > 0 ? '+' : '' }}KES {{ Number(val).toLocaleString() }}
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 relative z-10">
          <button @click="downloadPayslip(selectedPayslip.id)" class="px-6 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
             <i class="mdi mdi-download"></i> Download PDF
          </button>
        </div>
      </div>
    </div>
    <!-- Add Variable Modal -->
    <div v-if="showVariableModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Add <span class="text-emerald-500">Variable</span></h2>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure Tax or Setting</p>
          </div>
          <button @click="showVariableModal = false" class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <form @submit.prevent="submitVariable" class="space-y-5">
          <div>
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Setting Name (e.g. NSSF_RATE)</label>
             <input v-model="varForm.name" type="text" placeholder="Type name here" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none uppercase placeholder:normal-case focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Calculation Type</label>
                <select v-model="varForm.type" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                   <option value="percentage">Percentage (%)</option>
                   <option value="fixed_amount">Fixed (KES)</option>
                   <option value="upper_limit">Max Limit (Cap)</option>
                </select>
             </div>
             <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Value</label>
                <input v-model="varForm.value" type="number" step="0.01" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
             </div>
          </div>
          <div>
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Short Description</label>
             <input v-model="varForm.description" type="text" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div class="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
             <button type="button" @click="showVariableModal = false" class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
             <button type="submit" :disabled="loading" class="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <i v-if="loading" class="mdi mdi-loading mdi-spin"></i> Save
             </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Tax Band Modal -->
    <div v-if="showBandModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Add <span class="text-emerald-500">Tax Band</span></h2>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure PAYE Level</p>
          </div>
          <button @click="showBandModal = false" class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <form @submit.prevent="submitBand" class="space-y-5">
           <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Band Name</label>
              <input v-model="bandForm.name" type="text" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
           </div>
           <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Starts From (KES)</label>
                <input v-model="bandForm.min_amount" type="number" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Ends At (Optional)</label>
                <input v-model="bandForm.max_amount" type="number" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
             </div>
           </div>
           <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Tax Rate (e.g. 0.3)</label>
                <input v-model="bandForm.rate" type="number" step="0.001" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Order</label>
                <input v-model="bandForm.sort_order" type="number" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
             </div>
           </div>
           <div class="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
             <button type="button" @click="showBandModal = false" class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
             <button type="submit" :disabled="loading" class="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <i v-if="loading" class="mdi mdi-loading mdi-spin"></i> Save
             </button>
           </div>
        </form>
      </div>
    </div>

    <!-- Add Ledger Modal -->
    <div v-if="showLedgerModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
       <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200">
         <div class="flex items-center justify-between mb-8">
           <div>
             <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Add <span class="text-emerald-500">Ledger Entry</span></h2>
             <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">One-off Payment or Deduction</p>
           </div>
           <button @click="showLedgerModal = false" class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
             <i class="mdi mdi-close"></i>
           </button>
         </div>

         <form @submit.prevent="submitLedger" class="space-y-5">
            <div>
               <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Select Employee</label>
               <select v-model="ledgerForm.employee_id" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="0" disabled>Choose someone...</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.first_name }} {{ emp.last_name }}</option>
               </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Month</label>
                  <input v-model="ledgerForm.ledger_month" type="month" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
               <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Type</label>
                  <select v-model="ledgerForm.type" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                     <option value="addition">Addition (+)</option>
                     <option value="deduction">Deduction (-)</option>
                  </select>
               </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Value Type</label>
                  <select v-model="ledgerForm.amount_type" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                     <option value="fixed">Fixed Money (KES)</option>
                     <option value="percentage_of_basic">% of Basic</option>
                  </select>
               </div>
               <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Amount</label>
                  <input v-model="ledgerForm.amount_value" type="number" step="0.01" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
            </div>
            <div>
               <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Short Name</label>
               <input v-model="ledgerForm.name" type="text" placeholder="e.g. Sales Bonus" required class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div class="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button type="button" @click="showLedgerModal = false" class="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
              <button type="submit" :disabled="loading" class="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                 <i v-if="loading" class="mdi mdi-loading mdi-spin"></i> Save
              </button>
            </div>
         </form>
       </div>
    </div>

    <!-- Run Payroll Modal -->
    <div v-if="showProcessModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Run <span class="text-emerald-500">Payroll</span></h2>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Select month to generate</p>
          </div>
          <button @click="showProcessModal = false" class="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <div class="space-y-6">
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Select Month</label>
             <input v-model="batchForm.month" type="month" class="w-full px-4 py-3 bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>

          <div class="flex gap-3">
            <button @click="showProcessModal = false" class="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button @click="runBatch" :disabled="loading" class="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
               <i :class="loading ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-rocket-launch'"></i>
               {{ loading ? 'Processing...' : 'Generate' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { usePayroll } from '../composables/usePayroll'
import { useEmployees } from '../composables/useEmployees'
import type { PayrollVariable, PayrollTaxBand, PayrollLedger, BatchProcessResult } from '../types/payroll'

const { 
  loading, error, variables, ledgers, taxBands,
  fetchVariables, fetchLedgers, fetchTaxBands, 
  saveVariable, toggleVariable, 
  saveTaxBand, toggleTaxBand,
  addLedger, removeLedger, batchProcess,
  payslips, fetchPayslips, downloadPayslip,
  deletePayslip, clearPayslipsHistory,
  exportBankRemittance, exportMpesaRemittance,
  complianceSummary, fetchComplianceSummary, markAsPaid
} = usePayroll()

const { employees, fetchEmployees } = useEmployees()

const activeTab = ref<'variables' | 'ledgers' | 'bands' | 'history' | 'compliance'>('compliance')
const showVariableModal = ref(false)
const showBandModal = ref(false)
const showLedgerModal = ref(false)
const showProcessModal = ref(false)

const varForm = reactive<Partial<PayrollVariable>>({
  name: '',
  type: 'percentage',
  value: 0,
  description: ''
})

const bandForm = reactive<Partial<PayrollTaxBand>>({
  name: '',
  min_amount: 0,
  max_amount: null,
  rate: 0,
  sort_order: 1
})

const ledgerForm = reactive<Partial<PayrollLedger>>({
   employee_id: 0,
   ledger_month: new Date().toISOString().slice(0, 7),
   type: 'addition',
   amount_type: 'fixed',
   amount_value: 0,
   name: '',
   description: '',
   is_recurring: false
})

const batchForm = reactive({
   month: new Date().toISOString().slice(0, 7)
})

const historyFilter = reactive({
  month: new Date().toISOString().substring(0, 7)
})

const showPayslipModal = ref(false)
const selectedPayslip = ref<any>(null)

const viewPayslipDetail = (slip: any) => {
  selectedPayslip.value = slip
  showPayslipModal.value = true
}

const editVariable = (v: PayrollVariable) => {
  varForm.name = v.name
  varForm.type = v.type as any
  varForm.value = v.value
  varForm.description = v.description || ''
  showVariableModal.value = true
}

const editBand = (b: PayrollTaxBand) => {
  bandForm.name = b.name
  bandForm.min_amount = b.min_amount
  bandForm.max_amount = b.max_amount
  bandForm.rate = b.rate
  bandForm.sort_order = b.sort_order
  showBandModal.value = true
}

const onClearHistory = async () => {
  if (!confirm(`Are you sure you want to delete ALL payslips for ${historyFilter.month}? This cannot be undone.`)) return
  try {
     await clearPayslipsHistory({ payroll_month: historyFilter.month })
     alert('History cleared successfully')
  } catch (e) {
     alert('Failed to clear history')
  }
}

const onDeletePayslip = async (id: number) => {
   if (!confirm('Are you sure you want to delete this specific payslip?')) return
   try {
      await deletePayslip(id)
   } catch (e) {
      alert('Failed to delete payslip')
   }
}

const batchResults = ref<BatchProcessResult | null>(null)

const handleMarkPaid = async () => {
   if (!confirm(`Mark ALL payslips for ${historyFilter.month} as PAID and remitted?`)) return
   try {
      await markAsPaid(historyFilter.month)
      alert('Remittance status updated successfully')
   } catch (e) {
      alert('Failed to update remittance status')
   }
}

onMounted(() => {
  fetchVariables()
  if (activeTab.value === 'compliance') fetchComplianceSummary(historyFilter.month)
})

watch(activeTab, (newTab) => {
  if (newTab === 'ledgers') {
    if (ledgers.value.length === 0) fetchLedgers()
    if (employees.value.length === 0) fetchEmployees()
  } else if (newTab === 'bands' && taxBands.value.length === 0) {
    fetchTaxBands()
  } else if (newTab === 'history') {
    fetchPayslips({ payroll_month: historyFilter.month })
  } else if (newTab === 'compliance') {
    fetchComplianceSummary(historyFilter.month)
  }
})

watch(() => historyFilter.month, (newMonth) => {
   if (activeTab.value === 'history') {
      fetchPayslips({ payroll_month: newMonth })
      batchForm.month = newMonth
   } else if (activeTab.value === 'compliance') {
      fetchComplianceSummary(newMonth)
   }
})

const submitVariable = async () => {
  varForm.name = varForm.name?.toUpperCase().replace(/\s+/g, '_')
  await saveVariable({ ...varForm })
  showVariableModal.value = false
  resetVarForm()
}

const submitBand = async () => {
  await saveTaxBand({ ...bandForm })
  showBandModal.value = false
  resetBandForm()
}

const submitLedger = async () => {
   await addLedger({ ...ledgerForm })
   showLedgerModal.value = false
   resetLedgerForm()
}

const runBatch = async () => {
   showProcessModal.value = false
   const res = await batchProcess(batchForm.month)
   batchResults.value = res
   // Refresh history if the months match
   if (batchForm.month === historyFilter.month) {
      fetchPayslips({ payroll_month: historyFilter.month })
   }
}

const resetVarForm = () => {
  varForm.name = ''
  varForm.type = 'percentage'
  varForm.value = 0
  varForm.description = ''
}

const resetBandForm = () => {
  bandForm.name = ''
  bandForm.min_amount = 0
  bandForm.max_amount = null
  bandForm.rate = 0
  bandForm.sort_order = (taxBands.value.length + 1)
}

const resetLedgerForm = () => {
   ledgerForm.employee_id = 0
   ledgerForm.name = ''
   ledgerForm.amount_value = 0
   ledgerForm.is_recurring = false
}
</script>
