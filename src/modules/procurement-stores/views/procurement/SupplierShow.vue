<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Home
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/procurement/suppliers" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Suppliers
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Details</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Supplier Details</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">View supplier information</p>
      </div>
      <div class="flex gap-2">
        <router-link
          v-if="canEdit"
          :to="`/procurement/supplier/${id}/edit`"
          class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit
        </router-link>
        <button
          v-if="canDelete"
          @click="confirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading supplier details...</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
    </div>

    <!-- Supplier Details -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Supplier Name -->
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Supplier Name
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ supplier.supplier_name || 'N/A' }}
            </p>
          </div>

          <!-- Contact Person -->
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Contact Person
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ supplier.contact_person || 'N/A' }}
            </p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Phone
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ supplier.phone || 'N/A' }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Email
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ supplier.email || 'N/A' }}
            </p>
          </div>

          <!-- Payment Terms -->
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Payment Terms
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ supplier.payment_terms || 'N/A' }}
            </p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Status
            </label>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                supplier.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              ]"
            >
              {{ supplier.status || 'N/A' }}
            </span>
          </div>

          <!-- Address (Full Width) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Address
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white whitespace-pre-line">
              {{ supplier.address || 'N/A' }}
            </p>
          </div>

          <!-- Created By -->
          <div v-if="supplier.createdBy" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Created By
            </label>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ supplier.createdBy.first_name }} {{ supplier.createdBy.last_name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const loading = ref(true)
const errorMessage = ref('')
const supplier = ref<any>({})

// For now, we'll assume permissions are always true
// You can implement proper permission checking later based on your auth system
const canEdit = computed(() => true)
const canDelete = computed(() => true)

const fetchSupplier = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.get(`/api/procurement-stores/suppliers/${id}`)
    if (response.data && response.data.data) {
      supplier.value = response.data.data
    } else {
      supplier.value = response.data
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error_message || 'Failed to load supplier details'
  } finally {
    loading.value = false
  }
}

const confirmDelete = async () => {
  const confirmed = confirm(`Are you sure you want to delete ${supplier.value.supplier_name}? This action cannot be undone.`)
  
  if (confirmed) {
    try {
      await axios.delete(`/api/procurement-stores/suppliers/${id}`)
      router.push('/procurement/suppliers')
    } catch (error: any) {
      errorMessage.value = error.response?.data?.error_message || 'Failed to delete supplier'
    }
  }
}

onMounted(async () => {
  await fetchSupplier()
})
</script>