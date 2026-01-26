<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-h-[500px]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
           <h3 class="text-xl font-bold text-gray-900 dark:text-white">Labour Costs</h3>
           <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage personnel and workforce expenses</p>
        </div>
      </div>
      <button
        @click="addLabourItem"
        type="button"
        class="group flex items-center px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-yellow-500/30 transition-all active:scale-95"
      >
        <i class="mdi mdi-plus mr-1 group-hover:scale-110 transition-transform"></i>
        Add Labour
      </button>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div v-if="formData.labour.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
         <div class="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <i class="mdi mdi-account-hard-hat text-2xl text-gray-300"></i>
         </div>
         <p class="text-gray-900 dark:text-white font-medium">No labour costs added</p>
         <p class="text-sm text-gray-500 mb-4">Add your crew and workforce details</p>
         <button @click="addLabourItem" class="text-yellow-600 font-bold text-sm hover:underline">Add First Item</button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/80 dark:bg-gray-900/50 text-xs uppercase tracking-wider font-bold text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th class="text-left py-4 px-6">Role / Description</th>
              <th class="text-left py-4 px-4 w-48">Category</th>
              <th class="text-left py-4 px-4 w-32">Unit</th>
              <th class="text-center py-4 px-4 w-24">Qty</th>
              <th class="text-center py-4 px-4 w-24">Days</th>
              <th class="text-right py-4 px-4 w-32">Rate</th>
              <th class="text-right py-4 px-6 w-40">Total</th>
              <th class="w-16"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="labour in formData.labour"
              :key="labour.id"
              class="group hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 transition-colors"
            >
              <td class="py-3 px-6">
                <select
                  v-model="labour.type"
                  class="w-full px-3 py-1.5 text-xs font-bold border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="" disabled>Select Role</option>
                  <option v-for="type in COMMON_TEAM_TYPES" :key="type.id" :value="type.display_name">
                    {{ type.display_name }}
                  </option>
                </select>
              </td>
              <td class="py-3 px-4">
                <select
                  v-model="labour.category"
                  class="w-full px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                >
                  <option value="Production">Production</option>
                  <option value="Installation">Set Up</option>
                  <option value="Installation">Set down</option>
                  <option value="Technical">Technical</option>
                  <option value="Supervision">Supervision</option>
                  <!-- <option value="Labour & transport cost">Labour & transport cost</option>
                  <option value="Labour & team per diem">Labour & team per diem</option>
                  <option value="Labour & team transport cost">Labour & team transport cost</option> -->
                  <option value="Other">Other</option>
                </select>
              </td>
              <td class="py-3 px-4">
                <select
                  v-model="labour.unit"
                  class="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 dark:text-white cursor-pointer"
                >
                  <option value="PAX">PAX</option>
                  <option value="days">days</option>
                  <option value="hours">hours</option>
                  <option value="shift">shift</option>
                </select>
              </td>
              <td class="py-3 px-4 text-center">
                <input
                  v-model.number="labour.quantity"
                  type="number"
                  step="1"
                  min="0"
                  class="w-16 text-center px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg font-mono font-bold text-xs focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 dark:text-white"
                  @input="calculateLabourTotal(labour)"
                />
              </td>
              <td class="py-3 px-4 text-center">
                <input
                  v-model.number="labour.days"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="1"
                  class="w-16 text-center px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg font-mono font-bold text-xs focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 dark:text-white"
                  @input="calculateLabourTotal(labour)"
                />
              </td>
              <td class="py-3 px-4 text-right">
                <input
                  v-model.number="labour.unitRate"
                  type="number"
                  step="1"
                  min="0"
                  class="w-full text-right px-0 py-1.5 bg-transparent border-0 border-b border-transparent group-hover:border-gray-200 focus:border-yellow-500 focus:ring-0 font-mono text-sm text-gray-600 dark:text-gray-300"
                  @input="calculateLabourTotal(labour)"
                />
              </td>
              <td class="py-3 px-6 text-right font-black font-mono text-gray-900 dark:text-white">
                 {{ formatCurrency(labour.amount) }}
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="removeLabourItem(labour.id)"
                  type="button"
                  class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-all transform hover:rotate-90"
                  title="Remove Item"
                >
                  <i class="mdi mdi-close"></i>
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
import type { LabourType } from '../../services/budgetService'

interface Props {
  formData: {
    labour: LabourType[]
  }
}

interface Emits {
  (e: 'add-labour-item'): void
  (e: 'calculate-labour-total', labour: LabourType): void
  (e: 'remove-labour-item', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const addLabourItem = () => {
  emit('add-labour-item')
}

const calculateLabourTotal = (labour: LabourType) => {
  emit('calculate-labour-total', labour)
}

const removeLabourItem = (id: string) => {
  emit('remove-labour-item', id)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const COMMON_TEAM_TYPES = [
  { id: 1, team_type_id: 1, display_name: 'Pasting Team' },
  { id: 2, team_type_id: 2, display_name: 'Technicians' },
  { id: 3, team_type_id: 3, display_name: 'Painters' },
  { id: 4, team_type_id: 4, display_name: 'Welders' },
  { id: 5, team_type_id: 5, display_name: 'Electricians' },
  { id: 6, team_type_id: 6, display_name: 'ICT' },
  { id: 7, team_type_id: 7, display_name: 'Loading' },
  { id: 8, team_type_id: 8, display_name: 'Offloading' },
  { id: 9, team_type_id: 9, display_name: 'Carpenters' }
]
</script>
