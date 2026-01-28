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
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Goods Receipt Notes</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Goods Receipt Notes</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and track received goods from purchase orders</p>
      </div>
      <router-link to="/procurement/goods-receipt-notes/create"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create GRN
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="Search by GRN, Batch, or PO Number..."
              class="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
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
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <!-- Quality Check Filter -->
        <div>
          <select v-model="filters.quality_check" @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Quality Checks</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
        </div>

        <!-- Store Location Filter -->
        <div>
          <select v-model="filters.store_location" @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Stores</option>
            <option value="Karen Village Store">Karen Village Store</option>
            <option value="Matasia Store">Matasia Store</option>
            <option value="Mombasa Store">Mombasa Store</option>
            <option value="Gichagi Store">Gichagi Store</option>
          </select>
        </div>
      </div>

      <!-- Custom Date Range (shown when custom is selected) -->
      <div v-if="filters.date_filter === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input
            v-model="filters.start_date"
            type="date"
            @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input
            v-model="filters.end_date"
            type="date"
            @change="applyFilters"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div v-if="hasActiveFilters" class="mt-4">
        <button @click="clearFilters" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="ml-3 text-gray-600 dark:text-gray-400">Loading goods receipt notes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-700 p-8">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">GRN Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">PO Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Supplier</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Batch Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Store Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quality</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="goodsReceiptNotes.length === 0">
              <td colspan="9" class="px-6 py-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No goods receipt notes found</p>
              </td>
            </tr>
            <tr v-for="grn in goodsReceiptNotes" :key="grn.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="viewGRN(grn.id)">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ grn.grn_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ formatDate(grn.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ grn.purchase_order?.po_number || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ grn.purchase_order?.supplier?.supplier_name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ grn.batch_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ grn.store_location }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    grn.quality_check === 'pass'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ grn.quality_check.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ grn.items?.length || 0 }} items
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" @click.stop>
                <div class="flex gap-2">
                  <router-link
                    :to="`/procurement/goods-receipt-notes/${grn.id}`"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View
                  </router-link>
                  <router-link
                    :to="`/procurement/goods-receipt-notes/${grn.id}/edit`"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="confirmDelete(grn)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[9999] overflow-y-auto" @click.self="showDeleteModal = false">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full" @click.stop>
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Delete</h3>
            </div>
            <div class="px-6 py-4">
              <p class="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete GRN <strong>{{ grnToDelete?.grn_number }}</strong>?
              </p>
              <p class="mt-2 text-sm text-red-600 dark:text-red-400">This action cannot be undone.</p>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                @click="showDeleteModal = false"
                class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                @click="deleteGRN"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                :disabled="loading"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGoodsReceiptNotes } from '@/modules/procurement-stores/shared/composables/useGoodsReceiptNotes'
import type { GoodsReceiptNote, GoodsReceiptNoteFilters } from '@/types/goodsReceiptNote'

const router = useRouter()
const { 
  goodsReceiptNotes, 
  loading, 
  error, 
  fetchGoodsReceiptNotes, 
  searchGoodsReceiptNotes,
  deleteGoodsReceiptNote 
} = useGoodsReceiptNotes()

const searchTerm = ref('')
const filters = ref<GoodsReceiptNoteFilters>({
  date_filter: '',
  start_date: '',
  end_date: '',
  quality_check: '',
  store_location: '',
  page: 1
})

const showDeleteModal = ref(false)
const grnToDelete = ref<GoodsReceiptNote | null>(null)

const hasActiveFilters = computed(() => {
  return !!(
    filters.value.date_filter ||
    filters.value.quality_check ||
    filters.value.store_location
  )
})

const loadGoodsReceiptNotes = async () => {
  try {
    await fetchGoodsReceiptNotes(filters.value)
  } catch (err) {
    console.error('Failed to load goods receipt notes:', err)
  }
}

let searchTimeout: any = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      try {
        await searchGoodsReceiptNotes(searchTerm.value)
      } catch (err) {
        console.error('Search failed:', err)
      }
    } else {
      await loadGoodsReceiptNotes()
    }
  }, 500)
}

const applyFilters = async () => {
  filters.value.page = 1
  await loadGoodsReceiptNotes()
}

const clearFilters = async () => {
  filters.value = {
    date_filter: '',
    start_date: '',
    end_date: '',
    quality_check: '',
    store_location: '',
    page: 1
  }
  searchTerm.value = ''
  await loadGoodsReceiptNotes()
}

const viewGRN = (id: number) => {
  router.push(`/procurement/goods-receipt-notes/${id}`)
}

const confirmDelete = (grn: GoodsReceiptNote) => {
  grnToDelete.value = grn
  showDeleteModal.value = true
}

const deleteGRN = async () => {
  if (!grnToDelete.value) return
  
  try {
    await deleteGoodsReceiptNote(grnToDelete.value.id)
    showDeleteModal.value = false
    grnToDelete.value = null
    await loadGoodsReceiptNotes()
  } catch (err) {
    console.error('Failed to delete GRN:', err)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadGoodsReceiptNotes()
})
</script>