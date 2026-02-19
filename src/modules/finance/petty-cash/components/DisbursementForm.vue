<template>
  <!-- Modal Overlay with Error Boundary -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    @click.self="closeModal"
    style="background-color: rgba(0, 0, 0, 0.5);"
  >
    <!-- Modal Error State -->
    <div v-if="modalError" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Modal Error</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ modalError }}</p>
        <div class="mt-6 flex space-x-3 justify-center">
          <button
            @click="modalError = null; initializeModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
          <button
            @click="closeModal"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Loading State -->
    <div v-else-if="modalState === 'opening'" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading disbursement form...</p>
      </div>
    </div>
    <!-- Modal Content - Show when isOpen is true, regardless of modalState -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div>
          <!-- Modal header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
              {{ editMode ? 'Edit Disbursement' : 'New Disbursement' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
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
                      {{ formatAmount(currentBalance) }}
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
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Total funds available for disbursement
                  </p>
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
                    v-model="form.amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    :max="maxAmount"
                    :class="[
                      'block w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                      errors.amount ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    ]"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p v-if="currentBalance > 0" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Available: {{ formatAmount(currentBalance) }}
                </p>
                <p v-else class="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ No funds available for disbursement. Please add a top-up first.
                </p>
                <p v-if="errors.amount" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.amount[0] }}
                </p>
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
                  v-model="form.payment_method"
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
                  v-model="form.receiver"
                  type="text"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.receiver ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Name of person/entity receiving funds"
                  required
                />
                <p v-if="errors.receiver" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.receiver[0] }}
                </p>
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
                    v-model="form.transaction_cost"
                    type="number"
                    step="0.01"
                    class="block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  v-model="form.transaction_code"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :placeholder="getTransactionCodePlaceholder()"
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
                    class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
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
                <p v-if="errors.account" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.account[0] }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  errors.description ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                ]"
                placeholder="Detailed description of the disbursement purpose..."
                required
              ></textarea>
              <p v-if="errors.description" class="mt-2 text-sm text-red-600 dark:text-red-400">
                {{ errors.description[0] }}
              </p>
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
                  v-model="form.classification"
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
                  <option value="csr">CSR</option>
                  <option value="other">Other</option>
                </select>
                <p v-if="errors.classification" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.classification[0] }}
                </p>
              </div>

              <!-- Project Name -->
              <div>
                <label for="project_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                  <span v-if="requiresProject" class="text-red-500">*</span>
                </label>
                <input
                  id="project_name"
                  v-model="form.project_name"
                  type="text"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.project_name ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  placeholder="Project or job name"
                  :required="requiresProject"
                />
                <p v-if="errors.project_name" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.project_name[0] }}
                </p>
                <p v-else-if="requiresProject" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Project name is required for selected classification
                </p>
              </div>

              <!-- Venue / Location -->
              <div>
                <label for="venue" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Venue / Site Location
                </label>
                <input
                  id="venue"
                  v-model="form.venue"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="E.g., Westlands Site, Factory Floor..."
                />
                <p v-if="errors.venue" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.venue[0] }}
                </p>
              </div>
            </div>

            <!-- Tax Field and Job Number Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Tax Field -->
              <div>
                <label for="tax" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tax <span class="text-red-500">*</span>
                </label>
                <select
                  id="tax"
                  v-model="form.tax"
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
                <p v-if="errors.tax" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.tax[0] }}
                </p>
              </div>

              <!-- Date Disbursed -->
              <div>
                <label for="date_disbursed" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Disbursed <span class="text-red-500">*</span>
                </label>
                <input
                  id="date_disbursed"
                  v-model="form.date_disbursed"
                  type="date"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.date_disbursed ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  required
                />
                <p v-if="errors.date_disbursed" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.date_disbursed[0] }}
                </p>
              </div>
            </div>

            <!-- Job Number with Autocomplete Row -->
            <div class="grid grid-cols-1 gap-6">
              <!-- Job Number with Autocomplete -->
              <div>
                <label for="job_number" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Number (WNG-prefix projects only)
                </label>
                <div class="relative">
                    <input
                      id="job_number"
                      list="job_number_list"
                      v-model="form.job_number"
                      @input="onProjectSelect"
                      type="text"
                      class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Type or select job number (e.g. WNG-01-2026-009)"
                      autocomplete="off"
                    />
                  
                  <datalist id="job_number_list">
                    <option 
                      v-for="project in projects" 
                      :key="project.id" 
                      :value="project.job_number || project.project_id"
                    >
                      {{ project.title || project.enquiry?.title }}
                    </option>
                  </datalist>

                  <!-- Loading Indicator -->
                  <div v-if="projects.length === 0" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <p v-if="errors.job_number" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.job_number[0] }}
                </p>
              </div>

              <!-- Budget Category -->
              <div v-if="availableBudgetItems.length > 0">
                <label for="budget_category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Budget category <span class="text-red-500">*</span>
                </label>
                <select
                  id="budget_category"
                  v-model="form.budget_category"
                  :class="[
                    'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                    errors.budget_category ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  ]"
                  :required="availableBudgetItems.length > 0"
                >
                  <option value="">Select category</option>
                  <option 
                    v-for="item in availableBudgetItems" 
                    :key="item.id" 
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
                <p v-if="errors.budget_category" class="mt-2 text-sm text-red-600 dark:text-red-400">
                  {{ errors.budget_category[0] }}
                </p>
                <p class="mt-1 text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                  Link to Project Budget Task
                </p>
              </div>
            </div>
       <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
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
                {{ submitButtonText }}
              </button>
            </div>
          </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash'
import { usePettyCashStore } from '../stores/pettyCashStore'
import { pettyCashService } from '../services/pettyCashService'
import { useErrorHandler } from '../composables/useErrorHandler'
import { defaultDisbursementFormData, mergeWithDefaults } from '../utils/defaults'
import { validateDisbursementFormData } from '../utils/validation'
import type { CreateDisbursementFormData, UpdateDisbursementFormData } from '../types/forms'
import type { PettyCashDisbursement } from '../types/pettyCash'
import type { Account } from '../../../../types/accounts'
import accountsData from '../../../../data/accounts.json'

interface Props {
  isOpen: boolean
  editMode?: boolean
  disbursement?: PettyCashDisbursement
  requisition?: any
}

interface Emits {
  (e: 'close'): void
  (e: 'success', disbursement: PettyCashDisbursement): void
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false
})

const emit = defineEmits<Emits>()

const store = usePettyCashStore()
const { errorState, handleError, clearError, withErrorHandling } = useErrorHandler()

// Modal state management
const isSubmitting = ref(false)
const isInitialized = ref(false)
const modalError = ref<string | null>(null)

// Form data with safe defaults and tax field
const form = reactive({
  ...defaultDisbursementFormData,
  tax: '',
  date_disbursed: new Date().toISOString().split('T')[0],
  account_id: null as number | null, // Store account ID for backend
  requisition_id: null as number | null,
  budget_category: ''
} as any)

const route = useRoute()

// Form validation
const errors = ref<Record<string, string[]>>({})

// Modal state tracking
const modalState = ref<'closed' | 'opening' | 'open' | 'closing'>('closed')

// Account autocomplete
const accounts = ref<Account[]>(accountsData.accounts as any)
const accountSearch = ref('')
const showAccountDropdown = ref(false)
const selectedAccount = ref<Account | null>(null)

// Project autocomplete
const projects = ref<any[]>([])
const projectSearch = ref('')
const selectedProject = ref<any>(null)
const availableBudgetItems = ref<any[]>([])
const isLoadingBudgetItems = ref(false)

// Computed properties for current balance
const currentBalance = computed(() => {
  // Use the actual available balance from backend (more reliable than frontend calc)
  const baseBalance = (store.safeCurrentBalance as any).current_balance?.raw || 0
  
  // If editing, add back the original amount to show true available funds for re-allocation
  if (props.editMode && props.disbursement) {
    return baseBalance + (props.disbursement.amount.raw || 0)
  }
  
  return baseBalance
})

const maxAmount = computed(() => {
  // Ensure max is always greater than min (0.01) to avoid validation errors
  return Math.max(currentBalance.value, 0.01)
})

const balanceStatus = computed(() => {
  // Calculate status based on actual available balance
  const balance = currentBalance.value
  if (balance <= 0) return 'critical'
  if (balance < 1000) return 'low' // You can adjust this threshold
  return 'normal'
})

const balanceStatusLabel = computed(() => {
  const status = balanceStatus.value
  switch (status) {
    case 'critical': return 'Critical'
    case 'low': return 'Low'
    case 'normal': return 'Normal'
    default: return 'Normal'
  }
})

const submitButtonText = computed(() => {
  if (isSubmitting.value) {
    return props.editMode ? 'Updating...' : 'Creating...'
  }
  
  if (currentBalance.value <= 0) {
    return 'No Balance Available'
  }
  
  return props.editMode ? 'Update Disbursement' : 'Create Disbursement'
})

const requiresProject = computed(() => {
  return ['agencies', 'operations', 'event_planners', 'corporates'].includes(form.classification)
})

const isFormValid = computed(() => {
  return form.receiver &&
         form.account &&
         (form.account_id || props.editMode) && // Ensure account ID is selected, but relax for edit mode if name matches
         form.amount &&
         form.description &&
         form.classification &&
         form.payment_method &&
         form.tax &&
         form.date_disbursed &&
         currentBalance.value >= (Number(form.amount) + Number(form.transaction_cost || 0)) && // Ensure there's balance available
         (!requiresProject.value || form.project_name) &&
         (availableBudgetItems.value.length === 0 || form.budget_category)
})



const filteredAccounts = computed(() => {
  if (!accountSearch.value || accountSearch.value.length < 2) return []

  return accounts.value.filter(account =>
    account.name.toLowerCase().includes(accountSearch.value.toLowerCase()) ||
    account.code.toLowerCase().includes(accountSearch.value.toLowerCase())
  ).slice(0, 10) // Limit to 10 results
})

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Account autocomplete methods
const onAccountInput = () => {
  showAccountDropdown.value = true
}

const hideAccountDropdown = () => {
  // Delay hiding to allow click events
  setTimeout(() => {
    showAccountDropdown.value = false
  }, 150)
}

const selectAccount = (account: Account) => {
  selectedAccount.value = account
  accountSearch.value = account.name
  form.account = account.name
  form.account_id = account.id // Store account ID for backend
  showAccountDropdown.value = false
}





// Handle project selection from datalist
const onProjectSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Find matching project
  const project = projects.value.find(p => 
    (p.job_number === value) || (p.project_id === value)
  )

  if (project) {
    selectedProject.value = project
    form.job_number = project.job_number || project.project_id
    // Auto-fill project name - ALWAYS update when a strict match is found
    form.project_name = project.title || project.enquiry?.title || ''
    
    // UX Improvement: Automatically switch classification to 'operations' 
    // if it's currently default/empty, as project codes are usually ops-related
    if (!form.classification || form.classification === 'admin') {
      form.classification = 'operations'
    }

    // Fetch budget categories
    fetchBudgetCategories(form.job_number)
  } else {
    // Just update the manual entry
    form.job_number = value
    availableBudgetItems.value = []
    form.budget_category = ''
  }
}

const fetchBudgetCategories = async (jobNumber: string) => {
  if (!jobNumber) return
  
  isLoadingBudgetItems.value = true
  try {
    const response = await pettyCashService.getProjectBudgetItems(jobNumber)
    if (response.success) {
      availableBudgetItems.value = response.data
      
      // If editing and have a budget category, keep it if it's in the list
      if (!props.editMode) {
        form.budget_category = ''
      }
    }
  } catch (error) {
    console.error('Failed to fetch budget categories:', error)
  } finally {
    isLoadingBudgetItems.value = false
  }
}


// Debug: Watch projects array
watch(projects, (newVal) => {
  console.log('🔄 Projects array updated:', newVal.length, 'projects')
}, { immediate: true })

const getTransactionCodePlaceholder = (): string => {
  switch (form.payment_method) {
    case 'mpesa':
      return 'QH12ABC345'
    case 'bank_transfer':
      return 'Bank reference number'
    default:
      return 'Transaction reference'
  }
}

// Removed onTopUpChange - no longer needed since we're using current balance

// Enhanced form validation for the new structure
const validateForm = (): boolean => {
  try {
    errors.value = {}

    // Validate receiver
    if (!form.receiver || form.receiver.trim().length === 0) {
      errors.value.receiver = ['Receiver name is required']
    } else if (form.receiver.length > 255) {
      errors.value.receiver = ['Receiver name cannot exceed 255 characters']
    }

    // Validate account
    if (!form.account || form.account.trim().length === 0) {
      errors.value.account = ['Account is required']
    } else if (form.account.length > 255) {
      errors.value.account = ['Account cannot exceed 255 characters']
    } else if (!form.account_id) {
      errors.value.account = ['Please select a valid account from the dropdown']
    }

    // Validate amount
    const amount = Number(form.amount)
    const cost = Number(form.transaction_cost || 0)
    const total = amount + cost
    if (!form.amount || isNaN(amount) || amount <= 0) {
      errors.value.amount = ['Amount must be a positive number']
    } else if (total > currentBalance.value) {
      errors.value.amount = [`Total amount (KES ${total.toLocaleString()}) with transaction cost exceeds available balance of ${formatAmount(currentBalance.value)}`]
    }

    // Validate description
    if (!form.description || form.description.trim().length === 0) {
      errors.value.description = ['Description is required']
    } else if (form.description.length > 1000) {
      errors.value.description = ['Description cannot exceed 1000 characters']
    }

    // Validate classification
    if (!form.classification) {
      errors.value.classification = ['Please select a classification']
    } else if (!['admin', 'agencies', 'operations', 'event_planners', 'corporates', 'crs', 'other'].includes(form.classification)) {
      errors.value.classification = ['Invalid classification selected']
    }

    // Validate date_disbursed
    if (!form.date_disbursed) {
      errors.value.date_disbursed = ['Date disbursed is required']
    }

    // Validate tax
    if (!form.tax) {
      errors.value.tax = ['Tax option is required']
    } else if (!['etr', 'no_etr'].includes(form.tax)) {
      errors.value.tax = ['Invalid tax option selected']
    }

    // Validate project name for specific classifications
    if (requiresProject.value && (!form.project_name || form.project_name.trim().length === 0)) {
      const classificationLabels = {
        'agencies': 'Agencies',
        'operations': 'Operations'
      }
      const label = classificationLabels[form.classification as keyof typeof classificationLabels] || form.classification
      errors.value.project_name = [`Project name is required for ${label} classification`]
    }

    // Validate job number length if provided
    if (form.job_number && form.job_number.length > 100) {
      errors.value.job_number = ['Job number cannot exceed 100 characters']
    }

    // Validate budget category if items are available
    if (availableBudgetItems.value.length > 0 && !form.budget_category) {
      errors.value.budget_category = ['Please select a budget category']
    }

    return Object.keys(errors.value).length === 0
  } catch (error) {
    console.error('Form validation error:', error)
    errors.value = { general: ['Validation error occurred'] }
    return false
  }
}

// Safe form reset with error handling
const resetForm = () => {
  try {
    Object.assign(form, defaultDisbursementFormData)
    form.account_id = null // Reset account ID
    errors.value = {}
    modalError.value = null
    clearError()
    // Reset account autocomplete
    accountSearch.value = ''
    selectedAccount.value = null
    showAccountDropdown.value = false
    // Reset project autocomplete
    projectSearch.value = ''
    selectedProject.value = null
    form.date_disbursed = new Date().toISOString().split('T')[0]
  } catch (error) {
    console.error('Error resetting form:', error)
  }
}

const loadDisbursementData = () => {
  if (props.editMode && props.disbursement) {
    try {
      const d = props.disbursement
      console.log('📦 Loading disbursement for edit:', d)
      
      // Defensively find matching account ID
      let accountId = null
      if (d.account && Array.isArray(accounts.value)) {
        const matched = accounts.value.find(a => a.name === d.account)
        if (matched) accountId = matched.id
      }
      
      // Defensively extract amount
      let amt = '0'
      if (d.amount) {
        if (typeof d.amount === 'object' && d.amount !== null) {
          amt = String(d.amount.raw ?? '0')
        } else {
          amt = String(d.amount)
        }
      }
      
      // Defensively extract classification
      let cls = ''
      if (d.classification) {
        if (typeof d.classification === 'object' && d.classification !== null) {
          cls = String(d.classification.value ?? '')
        } else {
          cls = String(d.classification)
        }
      }
      
      // Defensively handle date
      let dateValue = new Date().toISOString().split('T')[0]
      if (d.date_disbursed) {
        const dd = d.date_disbursed as any
        if (typeof dd === 'string') {
          dateValue = dd.includes(' ') ? dd.split(' ')[0] : dd
        } else if (typeof dd === 'object' && dd !== null) {
          dateValue = String(dd.raw || dateValue).split(' ')[0]
        }
      }

      Object.assign(form, {
        receiver: d.receiver || '',
        account: d.account || '',
        account_id: accountId,
        amount: amt,
        description: d.description || '',
        project_name: d.project_name || '',
        classification: cls,
        job_number: d.job_number || '',
        date_disbursed: dateValue,
        tax: d.tax || 'etr',
        payment_method: (d.payment_method as any)?.value || d.payment_method || 'cash',
        transaction_cost: d.transaction_cost?.raw || d.transaction_cost || 0,
        transaction_code: d.transaction_code || '',
        top_up_id: d.top_up_id
      })

      // Set autocomplete search values
      accountSearch.value = d.account || ''
      projectSearch.value = d.job_number || ''
    } catch (err) {
      console.error('❌ Error in loadDisbursementData:', err)
      modalError.value = 'Failed to load transaction data for editing. Please try again.'
    }
  }
}

// Safe modal closing with state management
const closeModal = async () => {
  try {
    modalState.value = 'closing'
    await nextTick()
    
    resetForm()
    emit('close')
    
    modalState.value = 'closed'
  } catch (error) {
    console.error('Error closing modal:', error)
    modalError.value = 'Failed to close modal'
  }
}

// Initialize modal when opened
const initializeModal = async () => {
  try {
    modalState.value = 'opening'
    await nextTick()
    
    if (props.editMode && props.disbursement) {
      loadDisbursementData()
    } else if (props.requisition) {
      prefillFromRequisition(props.requisition)
    } else {
      resetForm()
      // Pre-fill from route if coming from a requisition
      if (route.query.action === 'new_disbursement' && route.query.requisition_id) {
        form.requisition_id = Number(route.query.requisition_id)
        form.amount = route.query.amount ? String(route.query.amount) : ''
        form.receiver = route.query.receiver ? String(route.query.receiver) : ''
        form.description = route.query.description ? String(route.query.description) : ''
      }
    }
    
    await Promise.all([
      store.fetchAvailableTopUps(),
      store.fetchCurrentBalance(),
      fetchProjects()
    ])
    isInitialized.value = true
    modalState.value = 'open'
  } catch (error) {
    console.error('Error initializing modal:', error)
    modalError.value = 'Failed to initialize modal'
    modalState.value = 'closed'
  }
}

const fetchProjects = async () => {
  try {
    console.log('🔍 Fetching approved projects for dropdown...')
    const response = await pettyCashService.getProjects()
    console.log('📦 Projects API response:', response)
    
    if (response.success && Array.isArray(response.data)) {
      projects.value = response.data
      console.log(`✅ Loaded ${projects.value.length} approved projects`)
    } else {
      console.warn('⚠️ Invalid projects response:', response)
    }
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
  }
}

// Enhanced form submission with error handling
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const result = await withErrorHandling(async () => {
    isSubmitting.value = true
    
    const formData = {
      receiver: form.receiver,
      account: form.account, // Send account name to backend (not account_id)
      amount: Number(form.amount),
      description: form.description,
      project_name: form.project_name || '',
      classification: form.classification, // This needs to match backend validation
      job_number: form.job_number || '',
      date_disbursed: form.date_disbursed,
      payment_method: form.payment_method,
      transaction_code: form.transaction_code,
      transaction_cost: Number(form.transaction_cost || 0),
      tax: form.tax, // Include tax in the payload
      requisition_id: form.requisition_id, // Add requisition_id to payload
      // Let backend auto-allocate from available top-ups if not specified
      // Or we can try to find one here if availableTopUps is loaded
      top_up_id: form.top_up_id || (store.availableTopUps.length > 0 ? store.availableTopUps[0].id : undefined)
    }

    let result: PettyCashDisbursement

    if (props.editMode && props.disbursement) {
      const disbursementId = (props.disbursement as any).original_id || props.disbursement.id
      result = await store.updateDisbursement(disbursementId, formData as any) as unknown as PettyCashDisbursement
    } else {
      result = await store.createDisbursement(formData as any) as unknown as PettyCashDisbursement
    }

    emit('success', result)
    await closeModal()
    
    return result
  }, { 
    context: 'DisbursementForm.handleSubmit',
    formData: { ...form },
    editMode: props.editMode
  })

  if (!result) {
    // Handle API validation errors by checking the error state
    try {
      if (errorState.value.response && errorState.value.response.errors) {
        errors.value = errorState.value.response.errors
      } else {
        const storeErrors = store.errors
        if (storeErrors && typeof storeErrors === 'object' && 'creating' in storeErrors && storeErrors.creating) {
          errors.value = { general: [storeErrors.creating] }
        }
      }
    } catch (error) {
      console.error('Error handling store errors:', error)
      errors.value = { general: ['An error occurred while processing your request'] }
    }
  }

  isSubmitting.value = false
}

// Watchers
watch(() => form.classification, () => {
  if (!requiresProject.value) {
    form.project_name = ''
  }
})

// Clear errors when form values change
watch(() => form.amount, () => {
  if (errors.value.amount) {
    delete errors.value.amount
  }
})

watch(() => form.receiver, () => {
  if (errors.value.receiver) {
    delete errors.value.receiver
  }
})

watch(() => form.account, () => {
  if (errors.value.account) {
    delete errors.value.account
  }
})

watch(() => form.description, () => {
  if (errors.value.description) {
    delete errors.value.description
  }
})

watch(() => form.classification, () => {
  if (errors.value.classification) {
    delete errors.value.classification
  }
})

watch(() => form.tax, () => {
  if (errors.value.tax) {
    delete errors.value.tax
  }
})

watch(() => form.project_name, () => {
  if (errors.value.project_name) {
    delete errors.value.project_name
  }
})

// Safe component initialization
onMounted(async () => {
  console.log('🔥 DisbursementForm mounted, isOpen:', props.isOpen)
  
  // Use nextTick to ensure component is fully mounted
  await nextTick()
  
  // Initialize modal state if already open
  if (props.isOpen) {
    console.log('🔥 DisbursementForm mounted with isOpen=true, calling initializeModal...')
    await initializeModal()
  }
})

const prefillFromRequisition = (req: any) => {
  if (!req) return
  
  console.log('🔥 Prefilling from requisition:', req)
  
  const receiver = req.payee 
    ? `${req.payee.first_name} ${req.payee.last_name}`
    : (req.payee_name || req.requester?.name || '')

  // Determine classification based on project/enquiry
  let defaultClassification = 'other'
  let defaultProjectName = ''
  let defaultJobNumber = ''
  
  if (req.project) {
    defaultClassification = 'operations'
    defaultProjectName = req.project.enquiry?.title || req.project.project_id || ''
    defaultJobNumber = req.project.enquiry?.job_number || req.project.project_id || ''
  } else if (req.enquiry) {
    defaultClassification = 'operations'
    defaultProjectName = req.enquiry.title || ''
    defaultJobNumber = req.enquiry.job_number || ''
  }

  // Auto-select Petty Cash account
  const pettyCashAccount = accounts.value.find(acc => acc.id === 12) // Petty cash account
  if (pettyCashAccount) {
    selectedAccount.value = pettyCashAccount
    accountSearch.value = pettyCashAccount.name
  }

  Object.assign(form, {
    requisition_id: req.id,
    amount: req.total_amount,
    receiver: receiver,
    account: pettyCashAccount?.name || '',
    account_id: pettyCashAccount?.id || null,
    description: `Disbursement for ${req.requisition_number}: ${req.purpose}`,
    classification: defaultClassification,
    project_name: defaultProjectName,
    job_number: defaultJobNumber,
    tax: 'etr',
    date_disbursed: new Date().toISOString().split('T')[0]
  })
}

watch(() => props.requisition, (newReq) => {
  console.log('🔥 Requisition prop changed:', newReq, 'isOpen:', props.isOpen)
  if (newReq && props.isOpen && !props.editMode) {
    nextTick(() => {
      prefillFromRequisition(newReq)
    })
  }
}, { deep: true, immediate: true })

// Proper modal state management
watch(() => props.isOpen, async (newValue, oldValue) => {
  console.log('🔥 DisbursementForm isOpen changed:', { newValue, oldValue, modalState: modalState.value })
  
  if (newValue && !oldValue) {
    // Modal opening
    console.log('🔥 Opening Disbursement modal via watcher...')
    await initializeModal()
  } else if (!newValue && oldValue) {
    // Modal closing
    console.log('🔥 Closing Disbursement modal...')
    modalState.value = 'closed'
    isInitialized.value = false
    // Optional: Reset form on close to clear state
    resetForm()
  }
}, { immediate: false })
</script>