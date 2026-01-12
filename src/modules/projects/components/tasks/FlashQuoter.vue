<template>
  <div class="flash-quoter relative z-10 font-sans bg-white dark:bg-gray-950 flex flex-col h-screen overflow-hidden text-gray-900 dark:text-gray-100">
    <!-- Clean Minimal Header -->
    <header class="sticky top-0 z-30 px-6 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl print:hidden transition-all">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <i class="mdi mdi-lightning-bolt text-xl"></i>
        </div>
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest leading-none">Flash Quoter</h3>
          <p class="text-[8px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">Minimalist Prospectus</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Status Indicator -->
        <div class="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 mr-1">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[8px] font-black uppercase tracking-tighter text-gray-500">{{ isEditMode ? 'Editing' : 'Review' }}</span>
        </div>

        <button 
          @click="isEditMode = !isEditMode"
          :class="[isEditMode ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400']"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold text-[9px] uppercase tracking-wider shadow-lg"
        >
          <i class="mdi text-sm" :class="isEditMode ? 'mdi-check-circle' : 'mdi-pencil'"></i>
          <span>{{ isEditMode ? 'Done' : 'Edit' }}</span>
        </button>

        <div class="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1"></div>

        <button
          @click="printQuote"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all font-bold text-[9px] uppercase tracking-wider"
        >
          <i class="mdi mdi-printer text-sm"></i>
          <span>PDF</span>
        </button>

        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>
      </div>
    </header>

    <!-- Content Area -->
    <main class="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 p-3 sm:p-6 pb-16">
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden quote-content print:shadow-none print:border-none print:rounded-none">
        
        <!-- Branding & Title -->
        <div class="p-6 sm:p-8 space-y-4">
           <div class="flex justify-between items-start">
              <div class="space-y-3 flex-1 max-w-2xl">
                 <div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[8px] font-black uppercase tracking-widest">
                    <i class="mdi mdi-file-document-outline text-xs"></i> Financial Prospectus
                 </div>
                 
                 <div class="space-y-1">
                   <h1 v-if="!isEditMode || !quoteData.projectInfo.enquiryTitle" class="text-2xl font-black tracking-tighter leading-none">
                      {{ quoteData.projectInfo.enquiryTitle || 'PROJECT TITLE' }}
                   </h1>
                   <input 
                    v-else
                    v-model="quoteData.projectInfo.enquiryTitle"
                    placeholder="PROJECT TITLE..."
                    class="block w-full text-2xl font-black tracking-tighter bg-transparent border-none focus:ring-0 p-0 outline-none text-emerald-600"
                   />
                 </div>

                 <div class="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[9px] font-bold uppercase tracking-wider">
                    <div class="flex items-center gap-1.5">
                       <span class="text-gray-400">Ref /</span>
                       <div v-if="!isEditMode">{{ quoteData.quoteNumber }}</div>
                       <input v-else v-model="quoteData.quoteNumber" class="bg-transparent border-none p-0 focus:ring-0 w-32 font-black text-gray-900 dark:text-white" />
                    </div>
                    <div class="flex items-center gap-1.5">
                       <span class="text-gray-400">Date /</span>
                       <div v-if="!isEditMode">{{ quoteData.date }}</div>
                       <input v-else type="date" v-model="quoteData.date" class="bg-transparent border-none p-0 focus:ring-0 font-black text-gray-900 dark:text-white text-[9px]" />
                    </div>
                    <div v-if="isEditMode" class="flex items-center gap-2 ml-auto">
                       <span class="text-[8px] text-gray-400 font-black">VAT</span>
                       <input type="checkbox" v-model="quoteData.vatEnabled" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                    </div>
                 </div>
              </div>

              <div class="w-32 h-16 flex flex-col justify-end items-end gap-2 text-right">
                 <img src="/wng-logo.png" alt="WNG" class="max-h-full object-contain" />
                 <div class="text-[7px] font-black tracking-wide text-gray-400 uppercase leading-tight">
                   Woodnork Green Ltd<br/>
                   Production
                 </div>
              </div>
           </div>

           <!-- Meta Info Grid -->
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50 dark:border-gray-800">
              <div class="space-y-2">
                 <label class="text-[8px] font-black uppercase tracking-widest text-emerald-600">Client</label>
                 <div class="space-y-1">
                    <div v-if="!isEditMode" class="text-sm font-black text-gray-900 dark:text-white">{{ quoteData.projectInfo.clientName || 'Partner' }}</div>
                    <input v-else v-model="quoteData.projectInfo.clientName" placeholder="Client" class="w-full text-sm font-black bg-transparent border-none p-0 focus:ring-0" />
                    
                    <div v-if="!isEditMode" class="text-[10px] text-gray-500 font-medium leading-relaxed max-w-sm">{{ quoteData.projectInfo.eventVenue || 'Venue' }}</div>
                    <textarea v-else v-model="quoteData.projectInfo.eventVenue" placeholder="Venue" rows="1" class="w-full text-[10px] text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none"></textarea>
                 </div>
              </div>

              <div class="space-y-2">
                 <label class="text-[8px] font-black uppercase tracking-widest text-emerald-600">Timeline</label>
                 <div class="flex items-center gap-4">
                    <div class="space-y-0.5">
                       <span class="text-[7px] font-black uppercase text-gray-400">Start</span>
                       <div v-if="!isEditMode" class="text-[10px] font-black">{{ quoteData.projectInfo.setupDate || 'â€”' }}</div>
                       <input v-else type="date" v-model="quoteData.projectInfo.setupDate" class="text-[10px] font-black bg-transparent border-none p-0 focus:ring-0" />
                    </div>
                    <div class="w-4 h-px bg-gray-200 dark:bg-gray-800"></div>
                    <div class="space-y-0.5">
                       <span class="text-[7px] font-black uppercase text-gray-400">End</span>
                       <div v-if="!isEditMode" class="text-[10px] font-black">{{ quoteData.projectInfo.setDownDate || 'â€”' }}</div>
                       <input v-else type="date" v-model="quoteData.projectInfo.setDownDate" class="text-[10px] font-black bg-transparent border-none p-0 focus:ring-0" />
                    </div>
                 </div>
              </div>
           </div>
         <!-- Customer Details Section -->
         <div class="px-8 sm:px-12 pb-6">
            <div class="bg-cyan-500 text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wide mb-px" style="width: 50%;">
               Customer Details
            </div>
            
            <div class="bg-gray-200 dark:bg-gray-800 p-4 text-xs space-y-2">
               <div>
                  <span v-if="!isEditMode" class="font-bold text-gray-900 dark:text-white">{{ quoteData.projectInfo.clientName || 'Client Name' }}</span>
                  <input v-else v-model="quoteData.projectInfo.clientName" placeholder="Client Name" class="font-bold bg-white dark:bg-gray-700 border border-gray-300 rounded px-2 py-1 text-xs w-full max-w-md" />
               </div>
               
               <div>
                  <span v-if="!isEditMode">{{ quoteData.projectInfo.location }}</span>
                  <input v-else v-model="quoteData.projectInfo.location" placeholder="Location" class="bg-white dark:bg-gray-700 border border-gray-300 rounded px-2 py-1 text-xs w-full max-w-md" />
               </div>
               
               <div class="flex items-center gap-2">
                  <span class="font-bold">Attn:</span>
                  <span v-if="!isEditMode">{{ quoteData.projectInfo.attentionTo }}</span>
                  <input v-else v-model="quoteData.projectInfo.attentionTo" placeholder="Attention To" class="bg-white dark:bg-gray-700 border border-gray-300 rounded px-2 py-1 text-xs flex-1 max-w-xs" />
               </div>
               
               <div class="flex items-center gap-2">
                  <span class="font-bold">Project/Event/Setup/Delivery Date:</span>
                  <span v-if="!isEditMode">{{ quoteData.projectInfo.setupDate || 'TBC' }}</span>
                  <input v-else type="date" v-model="quoteData.projectInfo.setupDate" class="bg-white dark:bg-gray-700 border border-gray-300 rounded px-2 py-1 text-xs" />
               </div>
               
               <div class="flex items-center gap-2">
                  <span class="font-bold text-red-600">Ref:</span>
                  <span v-if="!isEditMode" class="text-red-600 font-semibold">{{ quoteData.projectInfo.enquiryTitle || 'Project Reference' }}</span>
                  <input v-else v-model="quoteData.projectInfo.enquiryTitle" placeholder="Project Reference" class="bg-white dark:bg-gray-700 border border-red-300 rounded px-2 py-1 text-xs flex-1 max-w-md text-red-600 font-semibold" />
               </div>
            </div>
         </div>
        </div>

        <!-- Table Section -->
        <div class="px-8 sm:px-12 pb-12">
           <table class="w-full">
              <thead>
                 <tr class="text-[8px] font-black uppercase tracking-[0.15em] text-gray-400 border-b-2 border-gray-900 dark:border-white">
                    <th class="text-left py-1 pb-2">Description</th>
                    <th class="text-center py-1 pb-2 w-12">Qty</th>
                    <th class="text-center py-1 pb-2 w-12">Days</th>
                    <th class="text-right py-1 pb-2 w-24">Unit</th>
                    <th class="text-right py-1 pb-2 w-28">Total</th>
                    <th v-if="isEditMode" class="print:hidden w-10"></th>
                 </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-800/50">
                  <template v-for="(element, elementIndex) in quoteData.elements" :key="element.id">
                    <!-- Ultra-Compact Section Heading (Single Row) -->
                    <tr class="bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
                       <td class="py-1 px-2">
                          <div class="flex items-center gap-2">
                             <span class="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">{{ elementIndex + 1 }}</span>
                             <div v-if="!isEditMode" class="font-black text-xs uppercase tracking-tight text-gray-900 dark:text-white">{{ element.name || 'CATEGORY' }}</div>
                             <input v-else v-model="element.name" placeholder="Category" class="font-black text-xs uppercase bg-transparent border-none p-0 focus:ring-0 flex-1 text-blue-600" />
                          </div>
                       </td>
                       <td class="py-1 text-center text-gray-400 text-[9px]">â€”</td>
                       <td class="py-1 text-center text-gray-400 text-[9px]">â€”</td>
                       <td class="py-1 text-right text-gray-400 text-[9px]">â€”</td>
                       <td class="py-1 text-right font-black text-sm text-gray-900 dark:text-white">
                          {{ formatKES(getElementTotal(element)) }}
                       </td>
                       <td v-if="isEditMode" class="print:hidden py-1 text-center">
                          <button @click="removeElement(elementIndex)" class="text-gray-300 hover:text-red-500 transition-colors"><i class="mdi mdi-delete-outline text-sm"></i></button>
                       </td>
                    </tr>

                    <!-- Item Rows -->
                    <tr v-for="(item, itemIndex) in element.items" :key="item.id" class="group transition-colors duration-200 hover:bg-white dark:hover:bg-gray-800">
                       <td class="py-1.5 pr-4">
                          <div v-if="!isEditMode" class="text-[9px] font-bold text-gray-700 dark:text-gray-300 leading-snug whitespace-pre-line">{{ item.description }}</div>
                          <textarea v-else v-model="item.description" placeholder="Details..." rows="1" class="w-full text-[9px] font-medium bg-transparent border-none p-0 focus:ring-0 resize-none"></textarea>
                       </td>
                       <td class="py-1.5 text-center text-[10px] font-black">
                          <span v-if="!isEditMode">{{ item.qty }}</span>
                          <input v-else type="number" v-model="item.qty" class="w-10 text-center bg-transparent border-none p-0 focus:ring-0 font-black text-[10px]" />
                       </td>
                       <td class="py-1.5 text-center text-[10px] font-black">
                          <span v-if="!isEditMode">{{ item.days }}</span>
                          <input v-else type="number" v-model="item.days" class="w-10 text-center bg-transparent border-none p-0 focus:ring-0 font-black text-[10px]" />
                       </td>
                       <td class="py-1.5 text-right text-[10px] font-black">
                          <span v-if="!isEditMode">{{ formatKES(item.unitPrice) }}</span>
                          <input v-else type="number" v-model="item.unitPrice" class="w-20 text-right bg-transparent border-none p-0 focus:ring-0 font-black text-emerald-600 text-[10px]" />
                       </td>
                       <td class="py-1.5 text-right font-black text-gray-900 dark:text-white text-[11px]">
                          {{ formatKES(item.qty * item.days * item.unitPrice) }}
                       </td>
                       <td v-if="isEditMode" class="print:hidden py-1.5 text-center">
                          <button @click="removeItem(elementIndex, itemIndex)" class="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><i class="mdi mdi-close"></i></button>
                       </td>
                    </tr>

                    <!-- Minimal Add Button -->
                    <tr v-if="isEditMode" class="print:hidden">
                       <td colspan="6" class="py-2">
                          <button @click="addItem(elementIndex)" class="text-[8px] font-black uppercase text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-all">
                             <i class="mdi mdi-plus-circle-outline text-xs"></i> Add Item
                          </button>
                       </td>
                    </tr>
                 </template>

                 <!-- Section Add button -->
                 <tr v-if="isEditMode" class="print:hidden border-t border-gray-100 dark:border-gray-800">
                    <td colspan="6" class="py-4">
                       <button @click="addEmptySection" class="w-full py-2 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-[8px] font-black uppercase tracking-wider text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                          Add Category
                       </button>
                    </td>
                 </tr>
              </tbody>
           </table>

           <!-- Summary Section -->
           <div class="flex justify-end pt-4">
              <div class="w-56 space-y-2">
                 <div class="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-gray-400">
                    <span>Base</span>
                    <span class="text-xs font-black text-gray-900 dark:text-white">{{ formatKES(subTotal) }}</span>
                 </div>
                 <div v-if="quoteData.vatEnabled" class="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-blue-500">
                    <span>VAT 16%</span>
                    <span class="text-xs font-black">{{ formatKES(subTotal * 0.16) }}</span>
                 </div>
                 <div class="pt-2 border-t-2 border-gray-900 dark:border-white">
                    <div class="flex justify-between items-end">
                       <div class="space-y-0.5">
                          <span class="text-[8px] font-black uppercase tracking-wide text-emerald-600">Total</span>
                          <span class="block text-[7px] font-bold text-gray-400 uppercase tracking-tight">KES</span>
                       </div>
                       <span class="text-xl font-black tracking-tighter">{{ formatKES(subTotal * (quoteData.vatEnabled ? 1.16 : 1)) }}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Master Terms -->
        <div class="px-8 sm:px-12 pt-8 pb-8 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div class="space-y-10">
                 <div class="space-y-4">
                    <h5 class="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Execution Guidelines</h5>
                    <div class="space-y-6">
                       <div class="space-y-2">
                          <span class="text-[8px] font-black uppercase text-gray-400">Payment Strategy</span>
                          <div v-if="!isEditMode" class="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{{ quoteData.paymentTerms }}</div>
                          <textarea v-else v-model="quoteData.paymentTerms" rows="4" class="w-full text-xs font-medium bg-transparent border-none p-0 focus:ring-0 resize-none"></textarea>
                       </div>
                       <div class="space-y-2">
                          <span class="text-[8px] font-black uppercase text-gray-400">Client Obligations</span>
                          <div v-if="!isEditMode" class="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{{ quoteData.clientObligations }}</div>
                          <textarea v-else v-model="quoteData.clientObligations" rows="4" class="w-full text-xs font-medium bg-transparent border-none p-0 focus:ring-0 resize-none"></textarea>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Banking (Conditional) -->
              <div class="space-y-10">
                <div v-if="quoteData.vatEnabled" class="space-y-6">
                   <h5 class="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Settlement Account</h5>
                   <div class="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl grid grid-cols-2 gap-x-8 gap-y-6 text-[10px] font-black">
                      <div class="space-y-1">
                         <span class="text-[8px] text-gray-400 tracking-tighter uppercase">Entity Name</span>
                         <input v-if="isEditMode" v-model="quoteData.bankInfo.chequePayable" class="w-full bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black" />
                         <div v-else class="text-gray-900 dark:text-white">{{ quoteData.bankInfo.chequePayable }}</div>
                      </div>
                      <div class="space-y-1">
                         <span class="text-[8px] text-gray-400 tracking-tighter uppercase">Bank Institution</span>
                         <input v-if="isEditMode" v-model="quoteData.bankInfo.bankName" class="w-full bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black" />
                         <div v-else class="text-gray-900 dark:text-white">{{ quoteData.bankInfo.bankName }}</div>
                      </div>
                      <div class="space-y-1">
                         <span class="text-[8px] text-gray-400 tracking-tighter uppercase">Account Number</span>
                         <input v-if="isEditMode" v-model="quoteData.bankInfo.accountNumber" class="w-full bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black text-emerald-600" />
                         <div v-else class="text-emerald-600">{{ quoteData.bankInfo.accountNumber }}</div>
                      </div>
                      <div class="space-y-1">
                         <span class="text-[8px] text-gray-400 tracking-tighter uppercase">M-Pesa Business</span>
                         <input v-if="isEditMode" v-model="quoteData.bankInfo.paybill" class="w-full bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black" />
                         <div v-else class="text-gray-900 dark:text-white">{{ quoteData.bankInfo.paybill }}</div>
                      </div>
                   </div>
                </div>
                <div class="pt-2">
                   <h5 class="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Validity Caveat</h5>
                   <div v-if="!isEditMode" class="text-[10px] font-bold text-gray-400 leading-relaxed">{{ quoteData.legalCaveat }}</div>
                   <textarea v-else v-model="quoteData.legalCaveat" rows="3" class="w-full text-[10px] font-medium text-gray-400 bg-transparent border-none p-0 focus:ring-0 resize-none mt-2"></textarea>
                </div>
              </div>
           </div>
        </div>

        <!-- Professional Footer -->
        <footer class="p-10 text-center bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
           <div class="flex items-center justify-center gap-6 text-[8px] font-black uppercase tracking-[0.5em] text-gray-300">
              <span>Precision</span>
              <div class="w-1 h-1 rounded-full bg-emerald-500"></div>
              <span>Experience</span>
              <div class="w-1 h-1 rounded-full bg-emerald-500"></div>
              <span>Excellence</span>
           </div>
        </footer>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

const emit = defineEmits(['close'])

const isEditMode = ref(true)

// High-Fidelity Data Object
const quoteData = reactive({
  vatEnabled: true,
  quoteNumber: `ENQ${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
  date: new Date().toISOString().split('T')[0],
  projectInfo: {
    enquiryTitle: '',
    clientName: '',
    location: '',
    attentionTo: '',
    eventVenue: '',
    setupDate: '',
    setDownDate: ''
  },
  elements: [],
  paymentTerms: 'Deposit Payment: Within Agreed Timelines (Per Email)\\nBalance Payment: Upon complete delivery\\nLate Payment Penalty: 2% Monthly for Late Payments\\nProduction begins after receipt of LPO and payment of 70% Deposit\\nThe Total Quote amount is inclusive of 16% VAT',
  clientObligations: 'Approval Required Before Work: Client must approve before work starts\\nChange Requests Process: Changes to initial quote will be billed separately',
  legalCaveat: 'Standard T&Cs apply. Pricing is subject to change if project scope is altered post-approval.',
  bankInfo: {
    chequePayable: 'Woodnork Green Limited',
    accountName: 'Woodnork Green Ltd',
    bankName: 'NCBA Bank',
    bankCode: '07000',
    branch: 'Kenyatta Avenue',
    branchCode: '125',
    accountNumber: '1002970089',
    swiftCode: 'CBAFKENX',
    paybill: '880100'
  }
})

// Methods
const addEmptySection = () => {
  quoteData.elements.push({
    id: Math.random().toString(36).substr(2, 9),
    name: 'NEW CATEGORY',
    items: [{ id: Math.random().toString(36).substr(2, 9), description: '', qty: 1, days: 1, unitPrice: 0 }]
  })
}

const removeElement = (index: number) => {
  if (confirm('Delete section?')) quoteData.elements.splice(index, 1)
}

const addItem = (elementIndex: number) => {
  quoteData.elements[elementIndex].items.push({
    id: Math.random().toString(36).substr(2, 9),
    description: '',
    qty: 1,
    days: 1,
    unitPrice: 0
  })
}

const removeItem = (elementIndex: number, itemIndex: number) => {
  quoteData.elements[elementIndex].items.splice(itemIndex, 1)
}

const getElementTotal = (element: any) => {
  return element.items.reduce((total: number, item: any) => total + (item.qty * item.days * item.unitPrice), 0)
}

const subTotal = computed(() => {
  return quoteData.elements.reduce((total: number, element: any) => total + getElementTotal(element), 0)
})

const formatKES = (val: number) => {
  return new Intl.NumberFormat('en-KE').format(val)
}

const printQuote = async () => {
  // Switch to view mode for consistency
  isEditMode.value = false
  
  try {
    // Prepare data for backend
    const payload = {
      quoteNumber: quoteData.quoteNumber,
      date: quoteData.date,
      vatEnabled: quoteData.vatEnabled,
      projectInfo: quoteData.projectInfo,
      elements: quoteData.elements,
      paymentTerms: quoteData.paymentTerms,
      clientObligations: quoteData.clientObligations,
      legalCaveat: quoteData.legalCaveat,
      bankInfo: quoteData.bankInfo
    }
    
    // Call backend API
    const response = await fetch('/api/flash-quote/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error('PDF generation failed')
    }
    
    // Download the PDF
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `quote-${quoteData.quoteNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('PDF generation error:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    isEditMode.value = true
  }
}


</script>

<style scoped>
.font-sans { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
.text-shadow-none { text-shadow: none !important; }

/* Hide scrollbars but allow functional scrolling */
.overflow-y-auto { scrollbar-width: none; -ms-overflow-style: none; }
.overflow-y-auto::-webkit-scrollbar { display: none; }

@media print {
  .flash-quoter { background: white !important; }
  .quote-content { padding: 0 !important; border: none !important; }
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
