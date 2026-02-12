<template>
  <div class="p-6 space-y-6">
    <!-- Header section -->
    <div class="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">
          Logistics Dashboard
        </h1>
        <p class="text-gray-500 mt-1 uppercase tracking-widest text-xs font-semibold">
          Fleet and Delivery Command Center
        </p>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2 hover:bg-gray-50 transition-all">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium">Export Reports</span>
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index" 
        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer overflow-hidden relative"
      >
        <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
           <component :is="stat.icon" class="w-24 h-24" />
        </div>
        <div class="flex items-center space-x-4">
          <div :class="`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-white/10` ">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ stat.value }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Active Deliveries -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800 italic">Active Deliveries</h2>
          <button class="text-blue-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div class="p-6">
          <div v-if="activeDeliveries.length === 0" class="flex flex-col items-center justify-center py-12 opacity-50 italic">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <p class="text-gray-400">No active deliveries scheduled</p>
          </div>
          <div v-else class="space-y-4">
             <!-- Placeholder for deliveries list -->
          </div>
        </div>
      </div>

      <!-- Quick Actions / Right Sidebar -->
      <div class="space-y-6">
        <div class="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 bg-blue-500 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <h3 class="text-xl font-bold italic mb-4">Quick Actions</h3>
          <div class="space-y-3 relative z-10">
            <button class="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 group">
              <span class="font-medium italic">Schedule Delivery</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button class="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 group">
              <span class="font-medium italic">Monitor Tracking</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button class="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 group">
              <span class="font-medium italic">Add Vehicle</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeDeliveries = ref([])

const stats = ref([
  { 
    label: 'Total Deliveries', 
    value: '0', 
    icon: 'svg', // Placeholder
    color: 'from-blue-500 to-blue-600'
  },
  { 
    label: 'Active Vehicles', 
    value: '0', 
    icon: 'svg', // Placeholder
    color: 'from-indigo-500 to-indigo-600'
  },
  { 
    label: 'Assigned Drivers', 
    value: '0', 
    icon: 'svg', // Placeholder
    color: 'from-purple-500 to-purple-600'
  },
  { 
    label: 'Pending Routes', 
    value: '0', 
    icon: 'svg', // Placeholder
    color: 'from-amber-500 to-amber-600'
  },
])
</script>

<style scoped>
/* Custom styles */
</style>
