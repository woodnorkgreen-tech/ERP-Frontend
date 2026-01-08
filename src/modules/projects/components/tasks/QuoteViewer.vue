<template>
  <div v-if="isVisible" class="quote-viewer-inline relative z-10 font-poppins bg-white dark:bg-gray-900 flex flex-col min-h-full">
    <!-- Modal Container (Now filling parent) -->
    <div class="w-full flex flex-col relative z-20 h-full">
      
      <!-- Premium Header (Sticky within the TaskModal body) -->
      <div class="sticky top-0 z-30 px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/95 dark:bg-gray-900/95 backdrop-blur-md print:hidden transition-all">
        <div class="flex items-center space-x-5">
           <div class="p-2.5 bg-emerald-500/10 rounded-xl shadow-inner border border-emerald-500/20">
            <i class="mdi mdi-file-document-outline text-emerald-600 text-2xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">Financial Prospectus</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Validating project valuation & deliverables</p>
          </div>
        </div>

        <!-- Master Action Hub -->
        <div class="flex items-center gap-6">
          <!-- View Toggle Segmented Control -->
          <div class="hidden sm:flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
            <button
              @click="showDetailedItems = false"
              :class="[!showDetailedItems ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400 scale-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 scale-95 opacity-70']"
              class="flex items-center gap-2 px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
              <span>Summary</span>
            </button>
            <button
              @click="showDetailedItems = true"
              :class="[showDetailedItems ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400 scale-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 scale-95 opacity-70']"
              class="flex items-center gap-2 px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              <span>Detailed</span>
            </button>
          </div>

          <!-- Action Buttons Group -->
          <div class="flex items-center gap-3">
            <!-- Strategic Edit Action -->
            <button
              v-if="!props.readonly"
              @click="toggleEditMode"
              :class="[
                isEditMode 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 border-blue-500' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
              ]"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 group font-bold text-xs"
            >
              <div class="relative">
                <svg class="w-4 h-4" :class="{'animate-bounce': isEditMode}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <span class="uppercase tracking-wider">{{ isEditMode ? 'Commit Changes' : 'Draft Edit' }}</span>
            </button>

            <!-- Payment Routing / Bank Details -->
            <button
              v-if="!props.readonly"
              @click="toggleBankDetails"
              :class="[
                showBankDetails 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 border-emerald-500' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
              ]"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 font-bold text-xs"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
              </svg>
              <span class="uppercase tracking-wider">Bank Details</span>
            </button>

            <!-- Deploy to PDF/Printer -->
            <button
              @click="printQuote"
              class="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs border border-gray-800 dark:border-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              <span class="uppercase tracking-wider whitespace-nowrap">Print Prospectus</span>
            </button>
          </div>

          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <!-- Close Interaction -->
          <button
            @click="$emit('close')"
            class="group flex items-center justify-center p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-300"
            title="Exit Preview"
          >
            <svg class="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quote Body (No internal scroll, let parent handle it) -->
      <div class="flex-grow bg-gray-100/50 dark:bg-gray-950 p-4 sm:p-12 print:p-0 print:bg-white h-auto overflow-visible">
        <div class="quote-content max-w-5xl mx-auto bg-white shadow-2xl rounded-sm p-10 sm:p-16 print:p-0 print:shadow-none print:max-w-none print:mx-0">

        <!-- Header Section -->
        <div class="flex items-start justify-between mb-6">
          <!-- Company Logo and Name -->
          <div class="flex flex-col items-center">
            <img
              src="/src/assets/WNG-Logo.png"
              alt="WoodnorkGreen Logo"
              class="h-20 w-auto mb-2"
              @error="handleImageError"
            />
            <h1 class="text-sm font-bold text-gray-900 tracking-widest uppercase">Woodnork Green</h1>
          </div>

          <!-- Quote Info Table -->
          <div class="text-right">
            <h2 class="text-2xl font-bold text-green-500 mb-2 uppercase tracking-wide">QUOTE</h2>
            <div class="border border-gray-300 inline-block">
              <div class="flex border-b border-gray-300">
                <div class="bg-white px-4 py-1 text-xs font-bold text-gray-700 border-r border-gray-300 w-24 text-center">DATE</div>
                <div class="bg-white px-4 py-1 text-xs font-bold text-red-500 w-32 text-center">{{ formatDate(new Date()) }}</div>
              </div>
              <div class="flex">
                <div class="bg-white px-4 py-1 text-xs font-bold text-gray-700 border-r border-gray-300 w-24 text-center">QUOTE #</div>
                <div class="bg-white px-4 py-1 text-xs font-bold text-red-500 w-32 text-center">{{ quoteNumber }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Details Section -->
        <div class="mb-6">
          <div class="bg-green-500 text-white px-2 py-1 font-bold text-xs uppercase tracking-wide w-1/2">
            CUSTOMER DETAILS
          </div>
          <div class="bg-gray-200 p-3 text-xs text-gray-900">
            <div class="font-bold mb-1">{{ quoteData.projectInfo.clientName }}</div>
            <div class="mb-1">Nairobi, Kenya</div>
            <div class="mb-1">
              <span class="font-bold">Attn:</span> 
              <span v-if="!isEditMode">{{ editableDescriptions['customer_attn'] || 'Project Manager' }}</span>
              <input
                v-else
                v-model="editableDescriptions['customer_attn']"
                class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 ml-1 text-xs"
                placeholder="Attention to..."
              />
            </div>
            <div class="mb-1">
              <span class="font-bold">Project/Event/Setup/Delivery Date:</span> 
              <span v-if="!isEditMode">{{ editableDescriptions['project_date'] || (quoteData.projectInfo.setupDate ? formatDate(new Date(quoteData.projectInfo.setupDate)) : 'TBC') }}</span>
              <input
                v-else
                v-model="editableDescriptions['project_date']"
                type="date"
                class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 ml-1 text-xs"
              />
            </div>
            <div>
              <span class="font-bold text-red-600">Ref:</span> 
              <span class="text-red-600">{{ quoteData.projectInfo.enquiryTitle }}</span>
            </div>
          </div>
        </div>

        <!-- Quote Table -->
        <div class="mb-6">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-green-100 border-b-2 border-green-500">
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-12">LINE #</th>
                <th class="text-left py-1 px-2 font-bold text-white bg-green-500 border border-white">DESCRIPTION</th>
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-12">QTY</th>
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-24">Unit Price</th>
                <th class="text-center py-1 px-2 font-bold text-white bg-green-500 border border-white w-24">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <!-- Materials -->
              <template v-for="(element, elementIndex) in quoteData.materials" :key="element.id">
                <!-- Summary View (Default) -->
                <tr v-if="!showDetailedItems" class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ Number(elementIndex) + 1 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">
                      <span v-if="!isEditMode">{{ getOverride(element.id, 'name', element.name) }}</span>
                      <input
                        v-else
                        :value="getOverride(element.id, 'name', element.name)"
                        @input="(e: any) => updateOverride(element.id, 'name', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs font-bold w-full"
                      />
                    </div>
                    <div v-if="!isEditMode && getDescription(element.id, element)" class="text-gray-600">{{ getDescription(element.id, element) }}</div>
                    <textarea
                      v-else
                      v-model="editableDescriptions[element.id]"
                      class="w-full mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 resize-none"
                      rows="2"
                      placeholder="Enter description..."
                    ></textarea>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">
                     <span v-if="!isEditMode">{{ getOverride(element.id, 'qty', 1) }}</span>
                     <input
                        v-else
                        type="number"
                        :value="getOverride(element.id, 'qty', 1)"
                        @input="(e: any) => updateOverride(element.id, 'qty', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-center w-12"
                      />
                  </td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">
                     <span v-if="!isEditMode">{{ formatCurrency(getOverride(element.id, 'price', element.finalTotal)) }}</span>
                     <input
                        v-else
                        type="number"
                        :value="getOverride(element.id, 'price', element.finalTotal)"
                        @input="(e: any) => updateOverride(element.id, 'price', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-right w-20"
                      />
                  </td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(getRowTotal(element.id, 1, element.finalTotal)) }}</td>
                </tr>

                <!-- Detailed View -->
                <template v-else>
                  <!-- Element Header -->
                  <tr class="bg-gray-100 border-b border-gray-300">
                    <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ Number(elementIndex) + 1 }}</td>
                    <td colspan="4" class="py-1 px-2 font-bold text-gray-800">
                      <div v-if="!isEditMode">
                        {{ element.name }}
                        <span v-if="getDescription(element.id, element)"> - {{ getDescription(element.id, element) }}</span>
                      </div>
                      <div v-else class="flex items-center space-x-2">
                        <span>{{ element.name }} - </span>
                        <input
                          v-model="editableDescriptions[element.id]"
                          class="flex-1 text-xs bg-yellow-50 border border-yellow-300 rounded px-2 py-1"
                          placeholder="Enter description..."
                        />
                      </div>
                    </td>
                  </tr>

                  <!-- Individual Materials -->
                  <tr v-for="(material, matIndex) in element.materials" :key="material.id" class="border-b border-gray-200">
                    <td class="py-1 px-2 text-center border-r border-gray-300 text-gray-500"></td>
                    <td class="py-1 px-2 pl-6 border-r border-gray-300">
                       <span v-if="!isEditMode" class="text-gray-900">{{ getOverride(material.id, 'name', material.description) }}</span>
                       <input
                        v-else
                        :value="getOverride(material.id, 'name', material.description)"
                        @input="(e: any) => updateOverride(material.id, 'name', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs w-full"
                      />
                    </td>
                    <td class="py-1 px-2 text-center border-r border-gray-300">
                       <span v-if="!isEditMode">{{ getOverride(material.id, 'qty', material.quantity) }}</span>
                       <input
                        v-else
                        type="number"
                        :value="getOverride(material.id, 'qty', material.quantity)"
                        @input="(e: any) => updateOverride(material.id, 'qty', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-center w-12"
                      />
                    </td>
                    <td class="py-1 px-2 text-right border-r border-gray-300">
                       <span v-if="!isEditMode">{{ formatCurrency(getRowTotal(material.id, material.quantity, material.finalPrice) / Number(getOverride(material.id, 'qty', material.quantity))) }}</span>
                       <!-- Edit Unit Price directly -->
                       <input
                        v-else
                        type="number"
                        :value="getOverride(material.id, 'price', material.finalPrice / material.quantity)"
                        @input="(e: any) => updateOverride(material.id, 'price', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-right w-20"
                      />
                    </td>
                    <td class="py-1 px-2 text-right">{{ formatCurrency(getRowTotal(material.id, material.quantity, material.finalPrice)) }}</td>
                  </tr>
                </template>
              </template>

              <!-- Labour & Expenses -->
              <template v-if="quoteData.totals.labourTotal > 0 || quoteData.totals.expensesTotal > 0">
                <!-- Summary View -->
                <tr v-if="!showDetailedItems" class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ quoteData.materials.length + 1 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">
                      <span v-if="!isEditMode">{{ editableDescriptions['labour_title'] || 'Provision of Labour and Expenses' }}</span>
                      <input
                        v-else
                        v-model="editableDescriptions['labour_title']"
                        class="w-full bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-xs"
                        placeholder="Labour & Expenses title..."
                      />
                    </div>
                    <div v-if="!isEditMode && editableDescriptions['labour_desc']" class="text-gray-600 text-xs mt-1">
                      {{ editableDescriptions['labour_desc'] }}
                    </div>
                    <textarea
                      v-else-if="isEditMode"
                      v-model="editableDescriptions['labour_desc']"
                      class="w-full mt-1 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-xs resize-none"
                      rows="2"
                      placeholder="Labour & Expenses description (optional)..."
                    ></textarea>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">
                     <span v-if="!isEditMode">{{ getOverride('labour_expenses_summary', 'qty', 1) }}</span>
                     <input
                        v-else
                        type="number"
                        :value="getOverride('labour_expenses_summary', 'qty', 1)"
                        @input="(e: any) => updateOverride('labour_expenses_summary', 'qty', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-center w-12"
                      />
                  </td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">
                     <span v-if="!isEditMode">{{ formatCurrency(getOverride('labour_expenses_summary', 'price', quoteData.totals.labourTotal + quoteData.totals.expensesTotal)) }}</span>
                     <input
                        v-else
                        type="number"
                        :value="getOverride('labour_expenses_summary', 'price', quoteData.totals.labourTotal + quoteData.totals.expensesTotal)"
                        @input="(e: any) => updateOverride('labour_expenses_summary', 'price', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-right w-20"
                      />
                  </td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(getRowTotal('labour_expenses_summary', 1, quoteData.totals.labourTotal + quoteData.totals.expensesTotal)) }}</td>
                </tr>

                <!-- Detailed View -->
                <template v-else>
                  <!-- Header -->
                  <tr class="bg-gray-100 border-b border-gray-300">
                    <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ quoteData.materials.length + 1 }}</td>
                    <td colspan="4" class="py-1 px-2 font-bold text-gray-800">
                      <div v-if="!isEditMode">{{ editableDescriptions['labour_title'] || 'Provision of Labour and Expenses' }}</div>
                      <input
                        v-else
                        v-model="editableDescriptions['labour_title']"
                        class="flex-1 text-xs bg-yellow-50 border border-yellow-300 rounded px-2 py-1 w-full"
                        placeholder="Labour & Expenses title..."
                      />
                    </td>
                  </tr>

                  <!-- Labour Items -->
                  <tr v-for="labour in quoteData.labour" :key="labour.id" class="border-b border-gray-200">
                    <td class="py-1 px-2 text-center border-r border-gray-300 text-gray-500"></td>
                    <td class="py-1 px-2 pl-6 border-r border-gray-300">
                      <div v-if="!isEditMode">
                         <span class="text-gray-900">{{ getOverride(labour.id, 'name', labour.type) }}</span>
                         <span class="text-[10px] text-gray-500 capitalize ml-1">{{ labour.category }}</span>
                      </div>
                      <input
                        v-else
                        :value="getOverride(labour.id, 'name', labour.type)"
                        @input="(e: any) => updateOverride(labour.id, 'name', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs w-full"
                       />
                    </td>
                    <td class="py-1 px-2 text-center border-r border-gray-300">
                       <span v-if="!isEditMode">{{ getOverride(labour.id, 'qty', labour.quantity) }}</span>
                       <input
                        v-else
                        type="number"
                        :value="getOverride(labour.id, 'qty', labour.quantity)"
                        @input="(e: any) => updateOverride(labour.id, 'qty', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-center w-12"
                      />
                    </td>
                    <td class="py-1 px-2 text-right border-r border-gray-300">
                       <span v-if="!isEditMode">{{ formatCurrency(getOverride(labour.id, 'price', labour.unitRate * (1 + (quoteData.margins.labour || 0) / 100))) }}</span>
                       <input
                        v-else
                        type="number"
                        :value="getOverride(labour.id, 'price', labour.unitRate * (1 + (quoteData.margins.labour || 0) / 100))"
                        @input="(e: any) => updateOverride(labour.id, 'price', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-right w-20"
                      />
                    </td>
                    <td class="py-1 px-2 text-right">{{ formatCurrency(getRowTotal(labour.id, labour.quantity, labour.amount * (1 + (quoteData.margins.labour || 0) / 100))) }}</td>
                  </tr>

                  <!-- Expense Items -->
                  <tr v-for="expense in quoteData.expenses" :key="expense.id" class="border-b border-gray-200">
                    <td class="py-1 px-2 text-center border-r border-gray-300 text-gray-500"></td>
                    <td class="py-1 px-2 pl-6 border-r border-gray-300">
                      <div v-if="!isEditMode">
                         <span class="text-gray-900">{{ getOverride(expense.id, 'name', expense.description) }}</span>
                         <div class="text-[10px] text-gray-500 capitalize">{{ expense.category }}</div>
                      </div>
                      <input
                        v-else
                        :value="getOverride(expense.id, 'name', expense.description)"
                        @input="(e: any) => updateOverride(expense.id, 'name', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs w-full"
                       />
                    </td>
                    <td class="py-1 px-2 text-center border-r border-gray-300">
                       <span v-if="!isEditMode">{{ getOverride(expense.id, 'qty', 1) }}</span>
                       <input
                        v-else
                        type="number"
                        :value="getOverride(expense.id, 'qty', 1)"
                        @input="(e: any) => updateOverride(expense.id, 'qty', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-center w-12"
                      />
                    </td>
                    <td class="py-1 px-2 text-right border-r border-gray-300">
                       <span v-if="!isEditMode">{{ formatCurrency(getOverride(expense.id, 'price', expense.finalPrice)) }}</span>
                       <input
                        v-else
                        type="number"
                        :value="getOverride(expense.id, 'price', expense.finalPrice)"
                        @input="(e: any) => updateOverride(expense.id, 'price', e.target.value)"
                        class="bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 text-xs text-right w-20"
                      />
                    </td>
                    <td class="py-1 px-2 text-right">{{ formatCurrency(getRowTotal(expense.id, 1, expense.finalPrice)) }}</td>
                  </tr>
                </template>
              </template>

              <!-- Logistics -->
              <template v-if="quoteData.totals.logisticsTotal > 0">
                <tr class="border-b border-gray-300 hover:bg-gray-50">
                  <td class="py-1 px-2 text-center border-r border-gray-300 font-bold">{{ quoteData.materials.length + 2 }}</td>
                  <td class="py-1 px-2 border-r border-gray-300">
                    <div class="font-bold text-gray-900">
                      <span v-if="!isEditMode">{{ editableDescriptions['logistics_title'] || 'Transport cost' }}</span>
                      <input
                        v-else
                        v-model="editableDescriptions['logistics_title']"
                        class="w-full bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-xs"
                        placeholder="Logistics title..."
                      />
                    </div>
                    <div v-if="!isEditMode && editableDescriptions['logistics_desc']" class="text-gray-600 text-xs mt-1">
                      {{ editableDescriptions['logistics_desc'] }}
                    </div>
                    <textarea
                      v-else-if="isEditMode"
                      v-model="editableDescriptions['logistics_desc']"
                      class="w-full mt-1 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-xs resize-none"
                      rows="2"
                      placeholder="Logistics description (optional)..."
                    ></textarea>
                  </td>
                  <td class="py-1 px-2 text-center border-r border-gray-300">1</td>
                  <td class="py-1 px-2 text-right border-r border-gray-300">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                  <td class="py-1 px-2 text-right font-bold">{{ formatCurrency(quoteData.totals.logisticsTotal) }}</td>
                </tr>
              </template>



              <!-- Subtotal Row -->
              <tr class="border-t-2 border-gray-400">
                <td colspan="3" class="border-r border-gray-300"></td>
                <td class="py-1 px-2 font-bold text-gray-900 border-r border-gray-300 border-b border-gray-300">Sub Total</td>
                <td class="py-1 px-2 text-right font-bold text-gray-900 border-b border-gray-300">{{ formatCurrency(quoteData.totals.subtotal) }}</td>
              </tr>
              
              <!-- VAT Row (if enabled) -->
              <tr v-if="quoteData.vatEnabled && quoteData.totals.vatAmount > 0">
                <td colspan="3" class="border-r border-gray-300"></td>
                <td class="py-1 px-2 font-bold text-purple-700 border-r border-gray-300 border-b border-gray-300">VAT (16%)</td>
                <td class="py-1 px-2 text-right font-bold text-purple-700 border-b border-gray-300">{{ formatCurrency(quoteData.totals.vatAmount) }}</td>
              </tr>

              <!-- Total Row -->
              <tr>
                <td colspan="3" class="border-r border-gray-300"></td>
                <td class="py-1 px-2 font-bold text-gray-900 border-r border-gray-300 border-b border-gray-300">
                  {{ quoteData.vatEnabled && quoteData.totals.vatAmount > 0 ? 'Total (Inc. VAT)' : 'Total' }}
                </td>
                <td class="py-1 px-2 text-right font-bold text-gray-900 border-b border-gray-300">{{ formatCurrency(quoteData.totals.grandTotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms and Conditions & Footer -->
        <div class="flex flex-col md:flex-row gap-8 break-inside-avoid">
          <!-- Terms Section (Left) -->
          <div class="w-full md:w-2/3">
            <div class="bg-green-500 text-white px-2 py-1 font-bold text-xs uppercase tracking-wide mb-1">
              TERMS AND CONDITIONS
            </div>
            <div class="border border-gray-300 p-3 bg-gray-50 text-[10px] leading-tight">
              
              <!-- Payment Terms -->
              <div class="mb-2">
                <h4 class="font-bold text-red-600 mb-1">PAYMENT TERMS</h4>
                <ul class="list-none space-y-0.5 text-gray-800">
                  <li>
                    <span class="font-semibold">Deposit Payment:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['payment_deposit'] || 'Within Agreed Timelines (Per Email)' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['payment_deposit']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-64"
                      placeholder="Deposit payment terms..."
                    />
                  </li>
                  <li>
                    <span class="font-semibold">Balance Payment:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['payment_balance'] || 'Upon complete delivery' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['payment_balance']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-64"
                      placeholder="Balance payment terms..."
                    />
                  </li>
                  <li>
                    <span class="font-semibold">Late Payment Penalty:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['payment_penalty'] || '2% Monthly for Late Payments' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['payment_penalty']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-64"
                      placeholder="Late payment penalty..."
                    />
                  </li>
                  <li v-if="!isEditMode">{{ editableDescriptions['payment_production'] || 'Production begins after receipt of LPO and payment of 70% Deposit' }}</li>
                  <textarea
                    v-else
                    v-model="editableDescriptions['payment_production']"
                    class="w-full bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-[10px] resize-none"
                    rows="1"
                    placeholder="Production start condition..."
                  ></textarea>
                  <li v-if="!isEditMode">
                    The Total Quote amount is <span class="text-red-600 font-semibold">{{ editableDescriptions['payment_vat'] || 'exclusive of 16% VAT' }}</span>
                  </li>
                  <li v-else class="flex items-center gap-1">
                    The Total Quote amount is 
                    <input
                      v-model="editableDescriptions['payment_vat']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] text-red-600 font-semibold flex-1"
                      placeholder="VAT terms..."
                    />
                  </li>
                </ul>
              </div>

              <!-- Client Obligations -->
              <div class="mb-2">
                <h4 class="font-bold text-red-600 mb-1">CLIENT OBLIGATIONS</h4>
                <ul class="list-none space-y-0.5 text-gray-800">
                  <li>
                    <span class="font-semibold">Setup & Branding Time:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['client_setup_time'] || 'Client must provide ample time for setup' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['client_setup_time']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-72"
                      placeholder="Setup time requirement..."
                    />
                  </li>
                  <li>
                    <span class="font-semibold">Pre-Production Approvals:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['client_approvals'] || 'Client must approve pre-production on time' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['client_approvals']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-72"
                      placeholder="Approval requirement..."
                    />
                  </li>
                </ul>
              </div>

              <!-- Approval & Execution -->
              <div class="mb-2">
                <h4 class="font-bold text-red-600 mb-1">APPROVAL & EXECUTION</h4>
                <ul class="list-none space-y-0.5 text-gray-800">
                  <li>
                    <span class="font-semibold">Approval Required Before Work:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['approval_required'] || 'Client must approve before work starts' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['approval_required']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-72"
                      placeholder="Approval requirement..."
                    />
                  </li>
                  <li>
                    <span class="font-semibold">Change Requests Process:</span> 
                    <span v-if="!isEditMode">{{ editableDescriptions['change_requests'] || 'Changes to initial quote will be billed separately' }}</span>
                    <input
                      v-else
                      v-model="editableDescriptions['change_requests']"
                      class="bg-yellow-50 border border-yellow-300 rounded px-2 py-0.5 text-[10px] w-72"
                      placeholder="Change request policy..."
                    />
                  </li>
                </ul>
              </div>

              <!-- Bank Details -->
              <div v-if="showBankDetails" class="mt-4 break-inside-avoid">
                <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                    </svg>
                    <span class="text-xs font-black text-gray-900 uppercase tracking-widest">Electronic Fund Transfer Details</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-y-3 text-[10px]">
                    <div class="space-y-0.5">
                      <div class="text-gray-400 font-bold uppercase tracking-tighter">Cheques Payable To</div>
                      <div class="text-gray-900 font-black">{{ editableDescriptions['bank_cheque_payable'] || 'Woodnork Green Limited' }}</div>
                    </div>
                    
                    <div class="space-y-0.5">
                      <div class="text-gray-400 font-bold uppercase tracking-tighter">Account Name</div>
                      <div class="text-gray-900 font-black">{{ editableDescriptions['bank_account_name'] || 'Woodnork Green Ltd' }}</div>
                    </div>

                    <div class="space-y-0.5">
                      <div class="text-gray-400 font-bold uppercase tracking-tighter">Financial Institution</div>
                      <div class="text-gray-900 font-black">{{ editableDescriptions['bank_name'] || 'NCBA Bank' }} (Code: {{ editableDescriptions['bank_code'] || '07000' }})</div>
                    </div>

                    <div class="space-y-0.5">
                      <div class="text-gray-400 font-bold uppercase tracking-tighter">Branch Information</div>
                      <div class="text-gray-900 font-black">{{ editableDescriptions['bank_branch'] || 'Kenyatta Avenue' }} (Code: {{ editableDescriptions['bank_branch_code'] || '125' }})</div>
                    </div>

                    <div class="col-span-2 mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4">
                      <div class="space-y-0.5">
                        <div class="text-gray-400 font-bold uppercase tracking-tighter">SWIFT / BIC Code</div>
                        <div class="text-gray-900 font-black">{{ editableDescriptions['bank_swift'] || 'CBAFKENX' }}</div>
                      </div>
                      
                      <div class="space-y-0.5">
                        <div class="text-gray-400 font-bold uppercase tracking-tighter">Mpesa Paybill</div>
                        <div class="flex items-center gap-2">
                          <span class="text-emerald-700 font-black">{{ editableDescriptions['bank_paybill'] || '880100' }}</span>
                          <span class="text-gray-400 font-bold px-1.5 py-0.5 border border-gray-200 rounded text-[8px] uppercase">Business</span>
                        </div>
                      </div>

                      <div class="col-span-2 space-y-0.5">
                        <div class="text-gray-400 font-bold uppercase tracking-tighter">Account Number</div>
                        <div class="text-sm font-black text-emerald-700 select-all">{{ editableDescriptions['bank_account_number'] || '1002970089' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side (Image Placeholder or Empty) -->
          <div class="w-full md:w-1/3 flex items-end justify-center">
             <!-- Placeholder for 3D render if available, or just empty space as per design -->
             <div class="h-48 w-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs italic">
               Project Render / Image
             </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-[10px] text-gray-600 mt-4 pt-2 border-t border-gray-200">
          <p class="font-bold text-gray-800">Woodnork Green Ltd</p>
          <p>Tel: +254 780 397 798 | Email: admin@woodnorkgreen.co.ke</p>
          <p>Physical Address: Karen Village, Ngong Road, Nairobi, Kenya | Website: www.woodnorkgreen.co.ke</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/**
 * Props interface
 */
interface Props {
  /** Whether the modal is visible */
  isVisible: boolean
  /** Quote data to display */
  quoteData: any // We'll type this properly later
  /** Display options for customization */
  displayOptions?: {
    showUnitPrices: boolean
    showDetailedItems: boolean
    showDescriptions: boolean
  }
  /** Whether the viewer is in readonly mode */
  readonly?: boolean
}

/**
 * Events emitted by the component
 */
interface Emits {
  /** Emitted when modal should be closed */
  'close': []
  /** Emitted when changes are committed */
  'save': [data: { descriptions: Record<string, string>, overrides: Record<string, any> }]
}

// Props and emits
const props = withDefaults(defineProps<Props>(), {
  displayOptions: () => ({
    showUnitPrices: false,
    showDetailedItems: false,
    showDescriptions: true
  }),
  readonly: false
})

const emit = defineEmits<Emits>()

// Reactive state
const showDetailedItems = ref(props.displayOptions?.showDetailedItems || false)
const isEditMode = ref(false)
const showBankDetails = ref(!!props.quoteData?.vatEnabled) // Default to VAT status
const editableDescriptions = ref<Record<string, string>>({})
const overrides = ref<Record<string, any>>({})

const getOverride = (id: string, field: string, defaultVal: any) => {
  const key = `${id}_${field}`
  return overrides.value[key] !== undefined ? overrides.value[key] : defaultVal
}

const updateOverride = (id: string, field: string, value: any) => {
  overrides.value[`${id}_${field}`] = value
}

const getRowTotal = (id: string, defaultQty: number, defaultTotal: number) => {
  const qty = Number(getOverride(id, 'qty', defaultQty))
  // Default unit price is Total / Qty
  const defaultUnitPrice = defaultQty ? defaultTotal / defaultQty : 0
  const unitPrice = Number(getOverride(id, 'price', defaultUnitPrice))
  return qty * unitPrice
}

// Watch for modal opening to sync bank details visibility with VAT status
watch(() => props.isVisible, (isOpen) => {
  if (isOpen) {
    showBankDetails.value = !!props.quoteData?.vatEnabled
  }
})

// Automatically hide bank details if VAT is disabled
watch(() => props.quoteData?.vatEnabled, (enabled) => {
  if (!enabled) {
    showBankDetails.value = false
  }
})

/**
 * Toggle detail level
 */
const toggleDetailLevel = () => {
  showDetailedItems.value = !showDetailedItems.value
}

/**
 * Toggle edit mode
 */
const toggleEditMode = () => {
  if (isEditMode.value) {
    // Commit changes
    emit('save', {
      descriptions: { ...editableDescriptions.value },
      overrides: { ...overrides.value }
    })
  }

  isEditMode.value = !isEditMode.value

  // Initialize editable descriptions when entering edit mode, if empty
  if (isEditMode.value && Object.keys(editableDescriptions.value).length === 0) {
    initializeEditableDescriptions()
  }
}

/**
 * Toggle bank details visibility
 */
const toggleBankDetails = () => {
  showBankDetails.value = !showBankDetails.value
}

/**
 * Initialize editable descriptions
 */
const initializeEditableDescriptions = () => {
  // Initialize descriptions for all elements
  props.quoteData.materials.forEach((element: any) => {
    editableDescriptions.value[element.id] = getElementDescription(element)
  })

  // Initialize customer details
  editableDescriptions.value['customer_attn'] = 'Project Manager'
  editableDescriptions.value['project_date'] = props.quoteData.projectInfo.setupDate 
    ? new Date(props.quoteData.projectInfo.setupDate).toISOString().split('T')[0]
    : ''

  // Initialize descriptions for other categories
  if (props.quoteData.totals.labourTotal > 0 || props.quoteData.totals.expensesTotal > 0) {
    editableDescriptions.value['labour_title'] = 'Provision of Labour and Expenses'
    editableDescriptions.value['labour_desc'] = 'Professional setup, installation services, and project expenses'
  }
  if (props.quoteData.totals.logisticsTotal > 0) {
    editableDescriptions.value['logistics_title'] = 'Transport cost'
    editableDescriptions.value['logistics_desc'] = 'Equipment delivery and logistics coordination'
  }

  // Initialize Payment Terms
  editableDescriptions.value['payment_deposit'] = 'Within Agreed Timelines (Per Email)'
  editableDescriptions.value['payment_balance'] = 'Upon complete delivery'
  editableDescriptions.value['payment_penalty'] = '2% Monthly for Late Payments'
  editableDescriptions.value['payment_production'] = 'Production begins after receipt of LPO and payment of 70% Deposit'
  editableDescriptions.value['payment_vat'] = 'exclusive of 16% VAT'

  // Initialize Client Obligations
  editableDescriptions.value['client_setup_time'] = 'Client must provide ample time for setup'
  editableDescriptions.value['client_approvals'] = 'Client must approve pre-production on time'

  // Initialize Approval & Execution
  editableDescriptions.value['approval_required'] = 'Client must approve before work starts'
  editableDescriptions.value['change_requests'] = 'Changes to initial quote will be billed separately'

  // Initialize Bank Details
  editableDescriptions.value['bank_cheque_payable'] = 'Cheques payable to Woodnork Green Limited'
  editableDescriptions.value['bank_account_name'] = 'Woodnork Green Ltd'
  editableDescriptions.value['bank_name'] = 'NCBA Bank'
  editableDescriptions.value['bank_code'] = '07000'
  editableDescriptions.value['bank_branch'] = 'Kenyatta Avenue'
  editableDescriptions.value['bank_branch_code'] = '125'
  editableDescriptions.value['bank_account_number'] = '1002970089'
  editableDescriptions.value['bank_swift'] = 'CBAFKENX'
  editableDescriptions.value['bank_paybill'] = '880100'
  editableDescriptions.value['bank_paybill_ac'] = '1002970089'
  editableDescriptions.value['bank_paybill'] = '880100'
  editableDescriptions.value['bank_paybill_ac'] = '1002970089'
}

// Load saved settings if available
if (props.quoteData?.viewerSettings) {
  if (props.quoteData.viewerSettings.descriptions) {
    Object.assign(editableDescriptions.value, props.quoteData.viewerSettings.descriptions)
  }
  if (props.quoteData.viewerSettings.overrides) {
    Object.assign(overrides.value, props.quoteData.viewerSettings.overrides)
  }
}

/**
 * Get description (editable or default)
 */
const getDescription = (elementId: string, element?: any): string => {
  // If we have an explicit description (edited or saved), use it
  if (editableDescriptions.value[elementId]) {
    return editableDescriptions.value[elementId]
  }
  // Otherwise fall back to generated description
  return element ? getElementDescription(element) : ''
}

/**
 * Print the quote
 */
const printQuote = () => {
  // Exit edit mode before printing to show final content
  if (isEditMode.value) {
    isEditMode.value = false
  }

  // Small delay to ensure edit mode is fully exited and DOM updated
  setTimeout(() => {
    // Get the quote content element
    const quoteContent = document.querySelector('.quote-content')
    if (quoteContent) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=1024,height=768')
      if (printWindow) {
        printWindow.document.write('<!DOCTYPE html><html><head><title>Quote</title>')
        
        // Copy all styles from current document to ensure WYSIWYG
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
        styles.forEach(node => {
          printWindow.document.head.appendChild(node.cloneNode(true))
        })

        // Add specific print styles for layout and minimalism
        printWindow.document.write(`
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .quote-content { 
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            /* Colors */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            
            /* Page breaks */
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            .break-inside-avoid { page-break-inside: avoid; }
            
            /* Hide non-print elements just in case */
            button, .no-print { display: none !important; }
            
            /* Typography tweaks for print */
            h1, h2, h3, h4, h5, h6 { color: black !important; }
            .text-gray-900 { color: black !important; }
            .text-gray-600 { color: #333 !important; }
            
            /* Ensure inputs look like text if any remain */
            input, textarea {
              border: none;
              background: transparent;
              resize: none;
              padding: 0;
            }
          </style>
        `)
        
        printWindow.document.write('</head><body>')
        
        // Clone the content
        printWindow.document.write(quoteContent.outerHTML)
        
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        
        // Wait for styles/images to load
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }, 100)
}


/**
 * Generate quote number
 */
const quoteNumber = computed(() => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ENQ${year}${month}${day}${random}`
})

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Format currency for display
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Get element description for client view
 */
const getElementDescription = (element: any): string => {
  return ''
}

/**
 * Handle image loading error
 */
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  console.warn('Logo image not found at /src/assets/WNG-Logo.png')
}


</script>


<style scoped>
/* Print styles - make it print exactly as it appears */
@media print {
  /* Hide everything on the page */
  body > *:not(.quote-viewer-inline) {
    display: none !important;
  }

  /* Ensure only the quote viewer is visible */
  .quote-viewer-inline {
    display: block !important;
    visibility: visible !important;
    position: static !important;
    background: white !important;
    z-index: auto !important;
    width: 100% !important;
    height: auto !important;
    max-width: none !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
    inset: auto !important;
  }

  .quote-viewer-inline * {
    visibility: visible !important;
  }

  /* Hide sticky header for print */
  .sticky.top-0 {
    display: none !important;
  }

  .quote-viewer-modal .bg-black,
  .quote-viewer-modal .bg-opacity-50 {
    background: transparent !important;
  }

  /* Quote content container */
  .bg-white {
    background: white !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    max-width: none !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* Hide modal header for print */
  .flex.items-center.justify-between.p-4.border-b {
    display: none !important;
  }

  /* Quote content */
  .p-8 {
    padding: 20px !important;
  }

  /* Preserve all colors and backgrounds */
  .bg-green-500 {
    background-color: #10b981 !important;
    color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-gray-100 {
    background-color: #f3f4f6 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-gray-50 {
    background-color: #f9fafb !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-blue-50 {
    background-color: #eff6ff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-yellow-50 {
    background-color: #fefce8 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-green-50 {
    background-color: #f0fdf4 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .bg-orange-50 {
    background-color: #fff7ed !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Preserve text colors */
  .text-green-600 {
    color: #059669 !important;
  }

  .text-red-600 {
    color: #dc2626 !important;
  }

  .text-blue-800 {
    color: #1e40af !important;
  }

  .text-yellow-800 {
    color: #92400e !important;
  }

  .text-green-800 {
    color: #166534 !important;
  }

  .text-orange-800 {
    color: #9a3412 !important;
  }

  /* Preserve borders */
  .border,
  .border-gray-300 {
    border: 1px solid #d1d5db !important;
  }

  .border-t {
    border-top: 1px solid #d1d5db !important;
  }

  .border-t-2 {
    border-top: 2px solid #6b7280 !important;
  }

  .border-r {
    border-right: 1px solid #d1d5db !important;
  }

  .border-b {
    border-bottom: 1px solid #d1d5db !important;
  }

  /* Table styling */
  table {
    border-collapse: collapse !important;
    width: 100% !important;
  }

  th, td {
    border: 1px solid #d1d5db !important;
    padding: 8px !important;
  }

  /* Page setup */
  @page {
    margin: 0.5in;
    size: A4;
  }

  /* Prevent page breaks within sections */
  .mb-8 {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Font sizes */
  .text-3xl {
    font-size: 1.875rem !important;
    line-height: 2.25rem !important;
  }

  .text-2xl {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }

  .text-lg {
    font-size: 1.125rem !important;
    line-height: 1.75rem !important;
  }

  .text-sm {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  .text-xs {
    font-size: 0.75rem !important;
    line-height: 1rem !important;
  }

  /* Font weights */
  .font-bold {
    font-weight: 700 !important;
  }

  .font-semibold {
    font-weight: 600 !important;
  }

  .font-medium {
    font-weight: 500 !important;
  }

  /* Hide edit mode elements when printing */
  textarea,
  input[type="text"] {
    display: none !important;
  }

  /* Show only the text content when printing */
  .text-xs.text-gray-600 {
    display: block !important;
  }

  /* Ensure single page */
  html, body {
    height: auto !important;
    overflow: visible !important;
  }

  /* Force single page layout */
  * {
    max-height: none !important;
  }
}
</style>
