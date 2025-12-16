<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Logistics Information</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Transport and delivery details</p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Transport Information -->
      <div v-if="context.transport_type || context.vehicle_registration" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Transport Details
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.transport_type">
            <span class="text-gray-500 dark:text-gray-400">Transport Type:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.transport_type }}</span>
          </div>
          <div v-if="context.vehicle_registration">
            <span class="text-gray-500 dark:text-gray-400">Vehicle Reg:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.vehicle_registration }}</span>
          </div>
          <div v-if="context.driver">
            <span class="text-gray-500 dark:text-gray-400">Driver:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.driver.name }}</span>
          </div>
          <div v-if="context.cargo_type">
            <span class="text-gray-500 dark:text-gray-400">Cargo Type:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.cargo_type }}</span>
          </div>
        </div>
      </div>

      <!-- Location Information -->
      <div v-if="context.pickup_location || context.delivery_location" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Locations
        </h4>
        <div class="space-y-3">
          <div v-if="context.pickup_location">
            <span class="text-sm text-gray-500 dark:text-gray-400 block">Pickup Location</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ context.pickup_location }}</span>
          </div>
          <div v-if="context.delivery_location">
            <span class="text-sm text-gray-500 dark:text-gray-400 block">Delivery Location</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ context.delivery_location }}</span>
          </div>
        </div>
      </div>

      <!-- Schedule Information -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Schedule
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div v-if="context.scheduled_pickup_time">
            <span class="text-gray-500 dark:text-gray-400">Scheduled Pickup:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ formatDateTime(context.scheduled_pickup_time) }}</span>
            <span v-if="context.actual_pickup_time" class="ml-2 text-green-600 dark:text-green-400">✓ Completed</span>
          </div>
          <div v-if="context.scheduled_delivery_time">
            <span class="text-gray-500 dark:text-gray-400">Scheduled Delivery:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ formatDateTime(context.scheduled_delivery_time) }}</span>
            <span v-if="context.actual_delivery_time" class="ml-2 text-green-600 dark:text-green-400">✓ Completed</span>
          </div>
          <div v-if="context.actual_pickup_time">
            <span class="text-gray-500 dark:text-gray-400">Actual Pickup:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ formatDateTime(context.actual_pickup_time) }}</span>
          </div>
          <div v-if="context.actual_delivery_time">
            <span class="text-gray-500 dark:text-gray-400">Actual Delivery:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ formatDateTime(context.actual_delivery_time) }}</span>
          </div>
        </div>
      </div>

      <!-- Cargo Information -->
      <div v-if="context.cargo_weight_kg || context.cargo_volume_m3 || context.estimated_distance_km" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Cargo & Distance
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div v-if="context.cargo_weight_kg">
            <span class="text-gray-500 dark:text-gray-400">Weight:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.cargo_weight_kg }} kg</span>
          </div>
          <div v-if="context.cargo_volume_m3">
            <span class="text-gray-500 dark:text-gray-400">Volume:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.cargo_volume_m3 }} m³</span>
          </div>
          <div v-if="context.estimated_distance_km">
            <span class="text-gray-500 dark:text-gray-400">Distance:</span>
            <span class="ml-2 text-gray-900 dark:text-white font-medium">{{ context.estimated_distance_km }} km</span>
          </div>
        </div>
      </div>

      <!-- Special Instructions -->
      <div v-if="context.special_instructions" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Special Instructions
        </h4>
        <p class="text-sm text-yellow-700 dark:text-yellow-300">{{ context.special_instructions }}</p>
      </div>

      <!-- Signature Requirement -->
      <div v-if="context.requires_signature" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Signature Required</span>
        </div>
        <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
          {{ context.signature_path ? 'Signature captured' : 'Awaiting signature capture' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  context: any
}

defineProps<Props>()

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>