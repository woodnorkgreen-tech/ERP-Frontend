<template>
  <div class="quote-materials-tab">
    <div class="flex items-center justify-between mb-4">
      <h5 class="text-md font-medium text-gray-700 dark:text-gray-300">Materials & Components</h5>
      <div class="flex items-center space-x-3">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Base: {{ formatCurrency(props.materialsBase) }} |
          Final: {{ formatCurrency(props.materialsTotal) }}
        </div>
      </div>
    </div>

    <div v-if="materials && materials.length > 0" class="space-y-4">
      <div v-for="element in materials" :key="element.id" class="border border-gray-200 dark:border-gray-700 rounded-lg">
        <!-- Element Header -->
        <div
          :class="[
            getElementHeaderClass(element.templateId),
            'px-4 py-3 flex items-center justify-between rounded-t-lg'
          ]"
        >
          <div class="flex items-center space-x-3">
            <h6 class="text-sm font-semibold">{{ element.name }}</h6>
            <span class="text-xs opacity-75">
              {{ element.materials?.length || 0 }} items
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-medium">
              Base: {{ formatCurrency(element.baseTotal) }} → Final: {{ formatCurrency(element.finalTotal) }}
            </span>
          </div>
        </div>

        <!-- Materials Table -->
        <div class="border-t border-gray-200 dark:border-gray-700">
          <div class="p-4">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Description</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Unit</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Qty</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Unit Price</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Base Total</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Margin %</th>
                    <th class="text-left py-2 text-gray-700 dark:text-gray-300 font-medium">Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="material in element.materials" :key="material.id" class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-2 text-gray-900 dark:text-white">
                      {{ material.description }}
                      <span v-if="material.isAddition" class="ml-2 text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded">
                        Addition
                      </span>
                    </td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">{{ material.unitOfMeasurement }}</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">{{ material.quantity }}</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">{{ formatCurrency(material.unitPrice) }}</td>
                    <td class="py-2 text-gray-600 dark:text-gray-400">{{ formatCurrency(material.totalPrice) }}</td>
                    <td class="py-2 text-blue-600 dark:text-blue-400 font-medium">{{ material.marginPercentage }}%</td>
                    <td class="py-2 text-gray-900 dark:text-white font-medium">{{ formatCurrency(material.finalPrice) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400 italic">No materials data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MaterialElement {
  id: string
  templateId: string
  name: string
  materials: MaterialItem[]
  baseTotal: number
  finalTotal: number
}

interface MaterialItem {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
  unitPrice: number
  totalPrice: number
  marginPercentage: number
  finalPrice: number
  isAddition?: boolean
}

interface Props {
  materials?: MaterialElement[]
  materialsBase?: number
  materialsTotal?: number
}

const props = withDefaults(defineProps<Props>(), {
  materials: () => [],
  materialsBase: 0,
  materialsTotal: 0
})

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getElementHeaderClass = (templateId: string): string => {
  const classes = {
    stage: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
    backdrop: 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100',
    lighting: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100',
    sound: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
    furniture: 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100',
    decoration: 'bg-pink-100 dark:bg-pink-900 text-pink-900 dark:text-pink-100',
    catering: 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100',
    security: 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
  }
  return classes[templateId as keyof typeof classes] || classes.stage
}
</script>

<style scoped>
.quote-materials-tab {
  max-width: none;
}
</style>
