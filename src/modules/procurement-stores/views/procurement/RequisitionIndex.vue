<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/procurement/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Requisitions</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Purchase Requisitions</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage purchase requests</p>
      </div>
      <router-link to="/procurement/requisition/create"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Requisition
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <input v-model="searchTerm" @input="handleSearch" type="text" placeholder="Search requisitions..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Date Filter -->
        <div>
          <select v-model="filters.date_filter" @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="past_7_days">Past 7 Days</option>
            <option value="past_30_days">Past 30 Days</option>
            <option value="this_month">This Month</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <select v-model="filters.status" @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Urgency Filter -->
        <div>
          <select v-model="filters.urgency" @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Urgency</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading requisitions...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                REQ Number
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Urgency
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
         <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
  <tr v-for="requisition in requisitions" :key="requisition.id"
    class="hover:bg-gray-50 dark:hover:bg-gray-700">
    <!-- Remove @click="viewRequisition(requisition.id)" and cursor-pointer -->
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
      {{ requisition.requisition_number }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
      {{ formatDate(requisition.date) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
      {{ requisition.items?.length || 0 }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
      KES {{ formatNumber(calculateTotal(requisition.items)) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span :class="[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        requisition.urgency === 'urgent'
          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      ]">
        {{ requisition.urgency }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span :class="[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusClass(requisition.status)
      ]">
        {{ formatStatus(requisition.status) }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <!-- Remove @click.stop from this td -->
      <router-link :to="`/procurement/requisition/${requisition.id}`"
        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
        View
      </router-link>
      <router-link v-if="requisition.status === 'draft'"
        :to="`/procurement/requisition/${requisition.id}/edit`"
        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
        Edit
      </router-link>
      <button
        @click="deleteRequisition(requisition.id)"
        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>
    </td>
  </tr>
</tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()

const requisitions = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const filters = ref({
  date_filter: '',
  status: '',
  urgency: ''
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const fetchRequisitions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params: any = {}
    
    if (filters.value.date_filter) params.date_filter = filters.value.date_filter
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.urgency) params.urgency = filters.value.urgency

    const response = await axios.get('/api/procurement-stores/requisitions', { params })
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      requisitions.value = response.data.data
    } else if (Array.isArray(response.data)) {
      requisitions.value = response.data
    } else {
      requisitions.value = []
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch requisitions'
    requisitions.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      loading.value = true
      error.value = ''
      
      try {
        const response = await axios.post('/api/procurement-stores/search/requisitions', { 
          searchTerm: searchTerm.value 
        })
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          requisitions.value = response.data.data
        } else if (Array.isArray(response.data)) {
          requisitions.value = response.data
        } else {
          requisitions.value = []
        }
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to search requisitions'
      } finally {
        loading.value = false
      }
    } else {
      await fetchRequisitions()
    }
  }, 300)
}

const applyFilters = async () => {
  searchTerm.value = ''
  await fetchRequisitions()
}

const viewRequisition = (id: number) => {
  router.push(`/procurement/requisition/${id}`)
}

const deleteRequisition = async (id: number) => {
  if (!confirm('Are you sure you want to delete this requisition?')) return
  
  try {
    await axios.delete(`/api/procurement-stores/requisitions/${id}`)
    await fetchRequisitions()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete requisition')
  }
}

const calculateTotal = (items: any[]) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => sum + (item.total || 0), 0)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[status] || classes.draft
}

onMounted(async () => {
  await fetchRequisitions()
})
</script>