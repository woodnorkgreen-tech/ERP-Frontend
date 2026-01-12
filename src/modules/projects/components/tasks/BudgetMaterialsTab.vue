<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col min-h-[600px]">
    
    <!-- Header / Toolbar -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Budget Materials</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Priced project elements</p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- Search -->
        <div class="relative flex-grow md:flex-grow-0 md:w-64">
           <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
            class="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
           />
           <i class="mdi mdi-magnify absolute left-2.5 top-2 text-gray-400 text-sm"></i>
        </div>

        <!-- Global Actions -->
        <button 
           @click="expandAll = !expandAll" 
           class="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
           :title="expandAll ? 'Collapse All' : 'Expand All'"
        >
           <i class="mdi" :class="expandAll ? 'mdi-arrow-collapse-vertical' : 'mdi-arrow-expand-vertical'"></i>
        </button>
      </div>
    </div>

    <!-- Excel-Style Table -->
    <div class="overflow-x-auto flex-grow bg-white dark:bg-gray-800 relative">
       <!-- Empty State -->
       <div v-if="!hasMaterials" class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0">
          <div class="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
             <i class="mdi mdi-cube-off-outline text-3xl text-gray-300"></i>
          </div>
          <p class="text-gray-900 dark:text-white font-medium">No materials found</p>
          <p class="text-xs text-gray-500 mt-1 max-w-xs">
             {{ searchQuery ? 'No items match your search.' : 'Import materials from the main task to get started.' }}
          </p>
       </div>

       <table v-else class="w-full border-collapse min-w-[1000px]" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
         <thead class="sticky top-0 z-20 shadow-sm">
           <tr class="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500">
             <th class="border-r border-gray-300 dark:border-gray-600 px-3 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-12">#</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Element / Material</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-32">Category</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-24">Unit</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2.5 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-24">Qty</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2.5 text-right text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-36">Unit Price</th>
             <th class="px-4 py-2.5 text-right text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider w-36">Total</th>
           </tr>
         </thead>
         <tbody class="bg-white dark:bg-gray-800">
           <template v-for="(element, elementIndex) in filteredElements" :key="element.id">
             
             <!-- ELEMENT Row (BLUE STYLE) -->
             <tr 
               class="border-b border-blue-200 dark:border-blue-800 cursor-pointer transition-colors bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60"
               @click="toggleElement(element.id)"
             >
               <td class="border-r border-blue-200 dark:border-blue-800 px-3 py-3 text-center text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/50">
                 {{ elementIndex + 1 }}
               </td>
               
               <td class="border-r border-blue-200 dark:border-blue-800 px-4 py-3">
                 <div class="flex items-center gap-3">
                    <i class="mdi text-lg transition-transform duration-200 text-blue-600 dark:text-blue-400" 
                       :class="isExpanded(element.id) ? 'mdi-chevron-down' : 'mdi-chevron-right'">
                    </i>
                    <div>
                       <div class="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">{{ element.name }}</div>
                       <div class="text-[10px] text-blue-600 dark:text-blue-300 mt-0.5 font-bold">
                          {{ element.materials.length }} items
                       </div>
                    </div>
                 </div>
               </td>

               <td class="border-r border-blue-200 dark:border-blue-800 px-4 py-3">
                  <span :class="[getElementCategoryClass(element.category || 'other'), 'text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm ring-1 ring-inset ring-black/5']">
                     {{ element.category || 'General' }}
                  </span>
               </td>

               <td class="border-r border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-400 text-center">-</td>
               <td class="border-r border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-400 text-center">-</td>
               <td class="border-r border-blue-200 dark:border-blue-800 px-4 py-3 text-sm text-blue-400 text-right">-</td>
               
               <!-- Element Total -->
               <td class="px-4 py-3 text-right bg-blue-100/30 dark:bg-blue-900/30">
                  <span class="text-sm font-black text-blue-800 dark:text-white font-mono">
                     {{ formatCurrency(getElementTotal(element)) }}
                  </span>
               </td>
             </tr>

             <!-- MATERIAL Rows -->
             <template v-if="isExpanded(element.id)">
                <tr 
                  v-for="(material, materialIndex) in element.materials" 
                  :key="material.id"
                  v-show="isMaterialMatch(material)"
                  class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <!-- Nested Numbering -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-xs text-gray-400 bg-gray-50/30 dark:bg-gray-900/30 font-mono">
                     {{ elementIndex + 1 }}.{{ materialIndex + 1 }}
                  </td>

                  <!-- Description -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2 pl-12">
                     <div class="flex flex-col">
                        <span class="text-sm text-gray-700 dark:text-gray-200 font-medium">
                           {{ material.description }}
                        </span>
                        <span v-if="material.isAddition" class="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                           <i class="mdi mdi-plus-circle-outline"></i> Manual
                        </span>
                     </div>
                  </td>

                  <!-- Label/Category -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2">
                     <span class="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded font-medium uppercase">
                        Material
                     </span>
                  </td>

                  <!-- Unit -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                     {{ material.unitOfMeasurement }}
                  </td>

                  <!-- Quantity -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2 text-center bg-gray-50/30 dark:bg-gray-900/20">
                     <span class="text-sm font-bold text-gray-800 dark:text-gray-200 font-mono">
                        {{ material.quantity }}
                     </span>
                  </td>

                  <!-- Unit Price Input -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-right bg-white dark:bg-gray-800">
                     <div class="relative group">
                        <input
                           v-model.number="material.unitPrice"
                           type="number"
                           step="0.01"
                           min="0"
                           class="w-full text-right px-2 py-1.5 text-sm font-mono border border-transparent hover:border-gray-300 focus:border-blue-500 rounded bg-transparent focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-blue-500/20 shadow-none z-10 relative"
                           placeholder="0.00"
                           @input="calculateMaterialTotal(material)"
                        />
                        <span class="absolute right-2 top-1.5 text-gray-400 text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-0">
                           KES
                        </span>
                     </div>
                  </td>

                  <!-- Total -->
                  <td class="px-4 py-2 text-right">
                     <span class="text-sm font-bold text-gray-900 dark:text-white font-mono">
                        {{ formatCurrency(material.totalPrice || 0) }}
                     </span>
                  </td>
                </tr>
                
                <!-- Empty Search Result within Element -->
                 <tr v-if="element.materials.filter(m => isMaterialMatch(m)).length === 0" class="border-b border-gray-200 dark:border-gray-700">
                    <td colspan="7" class="py-4 text-center text-xs text-gray-400 italic">
                       No materials match search.
                    </td>
                 </tr>
             </template>
           </template>
         </tbody>
       </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BudgetElement, BudgetMaterialItem, MaterialsImportInfo, MaterialsUpdateCheckResponse } from '../../services/budgetService'

interface Props {
  formData: {
    materials: BudgetElement[]
  }
  importStatus: MaterialsImportInfo | null
  materialsUpdateCheck: MaterialsUpdateCheckResponse | null
  approvalStatus?: any | null
  isImporting: boolean
  isCheckingUpdates: boolean
}

interface Emits {
  (e: 'import-materials', forceReimport: boolean): void
  (e: 'check-updates'): void
  (e: 're-import-materials'): void
  (e: 'calculate-material-total', material: BudgetMaterialItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const expandedElements = ref<Set<string>>(new Set())
const expandAll = ref(true) // Default to expanded for better overview

const hasMaterials = computed(() => {
  return props.formData.materials && props.formData.materials.length > 0
})

const filteredElements = computed(() => {
  if (!props.formData.materials) return []
  if (!searchQuery.value) return props.formData.materials

  const query = searchQuery.value.toLowerCase()
  return props.formData.materials.filter(element => {
    // Match element name or any visible material
    if (element.name.toLowerCase().includes(query)) return true
    return element.materials.some(m => m.description.toLowerCase().includes(query))
  })
})

const isMaterialMatch = (material: BudgetMaterialItem) => {
   if (!searchQuery.value) return true
   return material.description.toLowerCase().includes(searchQuery.value.toLowerCase())
}

const getElementTotal = (element: BudgetElement) => {
   // Only sum up materials that are currently displayed/not filtered out is usually confusing.
   // Standard practice: Sum of ALL materials in element even if filtered? 
   // Or just show total of ALL materials always.
   return element.materials.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
}

const getElementCategoryClass = (category: string) => {
   const map: Record<string, string> = {
      'stage': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'sound': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'lighting': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'video': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'power': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'rigging': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
   }
   return map[category.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

// Actions
const toggleElement = (id: string) => {
  if (expandedElements.value.has(id)) {
    expandedElements.value.delete(id)
  } else {
    expandedElements.value.add(id)
  }
}

const isExpanded = (id: string) => {
  // If expandAll is on, everything is expanded unless explicitly collapsed (logic: expandAll overrides unless toggled?)
  // Simpler: use set.
  // If expandAll was set to true, we should have added all IDs to the set.
  return expandedElements.value.has(id) || (searchQuery.value.length > 0) // Always expand on search
}

// Watch expandAll to toggle all
watch(expandAll, (val) => {
   if (val) {
      props.formData.materials.forEach(e => expandedElements.value.add(e.id))
   } else {
      expandedElements.value.clear()
   }
}, { immediate: true })

// Forwarded Actions
const calculateMaterialTotal = (material: BudgetMaterialItem) => {
  emit('calculate-material-total', material)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<style scoped>
/* Custom Scrollbar for the table container */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #475569;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
