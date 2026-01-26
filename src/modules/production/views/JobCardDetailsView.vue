<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-4">
        <li>
          <router-link to="/production/job-cards" class="text-gray-500 hover:text-gray-700">
            Job Cards
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="ml-4 text-sm font-medium text-gray-900">Job Card Details</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Job Card Details Component -->
    <JobCardDetails
      :job-card-id="jobCardId"
      @edit="handleEdit"
      @close="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import JobCardDetails from '../components/JobCardDetails.vue'
import type { JobCard } from '../types'

const route = useRoute()
const router = useRouter()

const jobCardId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : 0
})

const handleEdit = (jobCard: JobCard) => {
  // Navigate to edit mode or open edit modal
  router.push({
    name: 'production-job-cards',
    query: { edit: jobCard.id.toString() }
  })
}

const handleClose = () => {
  router.push({ name: 'production-job-cards' })
}
</script>
