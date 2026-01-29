<template>
  <div class="bg-white dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col min-h-[600px] font-sans">
    
    <!-- Header / Toolbar -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <i class="mdi mdi-calculator text-xl"></i>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider leading-none mb-1">Budget Materials</h3>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Priced project elements & resources</p>
        </div>
      </div>

      <!-- Live Sync Alert (Compact) -->
      <div v-if="materialsUpdateCheck?.has_updates" class="flex-grow max-w-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 p-2 px-4 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
         <div class="flex items-center gap-2">
            <i class="mdi mdi-sync-alert text-orange-600 animate-pulse"></i>
            <span class="text-[10px] font-black text-orange-800 dark:text-orange-300 uppercase tracking-tight">Source Updated</span>
         </div>
         <div class="flex items-center gap-2">
            <button @click="$emit('switch-tab', 'comparison')" class="text-[10px] font-black text-orange-600 uppercase hover:underline">Review Changes</button>
            <div class="w-px h-3 bg-orange-200 dark:bg-orange-800"></div>
            <button @click="emit('import-materials', true)" class="text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase">Sync Now</button>
         </div>
      </div>

      <div class="flex items-center gap-3 w-full lg:w-auto">
        <!-- Search -->
        <div class="relative flex-grow lg:w-64">
           <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
            class="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
           />
           <i class="mdi mdi-magnify absolute left-2.5 top-2 text-gray-400 text-sm"></i>
        </div>

        <!-- Manual Sync -->
        <button 
           @click="emit('import-materials', false)" 
           :disabled="isImporting"
           class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50"
           title="Manually sync with Project Master specifications"
        >
           <i class="mdi" :class="isImporting ? 'mdi-loading mdi-spin' : 'mdi-sync'"></i>
           <span class="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sync Specs</span>
        </button>

        <!-- Global Actions -->
        <button 
           @click="expandAll = !expandAll" 
           class="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
           :title="expandAll ? 'Collapse All' : 'Expand All'"
        >
           <i class="mdi" :class="expandAll ? 'mdi-arrow-collapse-vertical' : 'mdi-arrow-expand-vertical'"></i>
        </button>
      </div>
    </div>

    <!-- Excel-Style Table -->
    <div class="overflow-x-auto flex-grow bg-white dark:bg-slate-950 relative">
       <!-- Empty State -->
       <div v-if="!hasMaterials" class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0">
          <div class="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
             <i class="mdi mdi-cube-off-outline text-3xl text-gray-300 dark:text-gray-600"></i>
          </div>
          <p class="text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest">No materials found</p>
          <p class="text-[10px] text-gray-500 mt-1 max-w-xs font-bold uppercase mb-6">
             {{ searchQuery ? 'No items match your search filter.' : 'Initial project specifications haven\'t been pulled from the Project Master yet.' }}
          </p>
          <button 
             v-if="!searchQuery"
             @click="emit('import-materials', false)"
             :disabled="isImporting"
             class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
             <i v-if="isImporting" class="mdi mdi-loading mdi-spin"></i>
             <i v-else class="mdi mdi-sync"></i>
             Import Master MQ
          </button>
       </div>

       <table v-else class="w-full border-collapse min-w-[1100px] text-[13px]">
         <thead class="sticky top-0 z-20 shadow-sm">
           <tr class="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-500">
             <th class="border-r border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest w-12 text-center">Ref</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest">Description / Project Scope Item</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest w-32">Classification</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest w-24">UoM</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest w-24">Qty</th>
             <th class="border-r border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest w-40">Unit Rate</th>
             <th class="px-4 py-2 text-right text-[10px] font-black text-gray-500 dark:text-gray-300 uppercase tracking-widest w-40">Total Extended</th>
           </tr>
         </thead>
         <tbody class="bg-white dark:bg-slate-950">
           <template v-for="(element, elementIndex) in filteredElements" :key="element.id">
             
             <!-- ELEMENT Row (PROFESSIONAL BLUE STYLE) -->
             <tr 
               class="border-b border-blue-200 dark:border-blue-800/50 cursor-pointer transition-colors bg-blue-50/70 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 sticky top-[42px] z-10 backdrop-blur-sm"
               @click="toggleElement(element.id)"
             >
               <td class="border-r border-blue-200 dark:border-blue-800/30 px-3 py-3 text-center text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-slate-950">
                 {{ elementIndex + 1 }}
               </td>
               
               <td class="border-r border-blue-200 dark:border-blue-800/30 px-4 py-3">
                 <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm transition-transform duration-200" :class="isExpanded(element.id) ? 'rotate-90' : ''">
                       <i class="mdi mdi-chevron-right text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div>
                       <div class="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">{{ element.name }}</div>
                       <div class="text-[9px] text-blue-600 dark:text-blue-400 mt-0.5 font-bold uppercase tracking-widest">
                          Group Package: {{ element.materials.length }} Components
                       </div>
                    </div>
                 </div>
               </td>

               <td class="border-r border-blue-200 dark:border-blue-800/30 px-4 py-3">
                  <span :class="[getElementCategoryClass(element.category || 'other'), 'text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-[0.1em] shadow-sm border border-black/5 dark:border-white/5']">
                     {{ element.category || 'General' }}
                  </span>
               </td>

               <td class="border-r border-blue-200 dark:border-blue-800/30 px-4 py-3 text-[10px] text-blue-400 dark:text-blue-800/50 text-center font-black">-</td>
               <td class="border-r border-blue-200 dark:border-blue-800/30 px-4 py-3 text-[10px] text-blue-400 dark:text-blue-800/50 text-center font-black">-</td>
               <td class="border-r border-blue-200 dark:border-blue-800/30 px-4 py-3 text-[10px] text-blue-400 dark:text-blue-800/50 text-right font-black">-</td>
               
               <!-- Element Total -->
               <td class="px-4 py-3 text-right bg-blue-100/50 dark:bg-blue-900/30">
                  <div class="flex flex-col items-end">
                     <span class="text-sm font-black text-blue-900 dark:text-white font-mono">
                        {{ formatCurrency(getElementTotal(element)) }}
                     </span>
                     <span class="text-[8px] font-black text-blue-500 uppercase tracking-widest">Package Total</span>
                  </div>
               </td>
             </tr>

             <!-- MATERIAL Rows -->
             <template v-if="isExpanded(element.id)">
                <tr 
                  v-for="(material, materialIndex) in element.materials" 
                  :key="material.id"
                  v-show="isMaterialMatch(material)"
                  class="border-b border-gray-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors group/item"
                >
                  <!-- Nested Numbering -->
                  <td class="border-r border-gray-200 dark:border-gray-800 px-3 py-2 text-center text-[10px] text-gray-400 dark:text-gray-600 bg-gray-50/30 dark:bg-slate-950 font-mono">
                     {{ elementIndex + 1 }}.{{ materialIndex + 1 }}
                  </td>

                  <!-- Description -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2 pl-10">
                     <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                           <span class="text-sm text-gray-700 dark:text-gray-200 font-bold group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                              {{ material.description }}
                           </span>
                           <!-- Intelligence Badges -->
                           <div class="flex items-center gap-1">
                              <span v-if="(material as any)._priceStatus === 'preserved'" class="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter" title="Price set in budget was preserved">
                                 <i class="mdi mdi-pin"></i> FIXED
                              </span>
                              <span v-if="material.unitPrice === 0" class="text-[8px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter animate-pulse shadow-sm">
                                 UNPRICED
                              </span>
                              <span v-if="(material as any)._quantityChanged" class="text-[8px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border border-amber-100" title="Quantity changed compared to source">
                                 SHIFTED
                              </span>
                           </div>
                        </div>
                        <div v-if="material.isAddition" class="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.15em] mt-0.5 flex items-center gap-1">
                           <i class="mdi mdi-plus-circle-outline"></i> Manual Budget Addition
                        </div>
                     </div>
                  </td>

                  <!-- Label/Category -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2">
                     <span class="text-[9px] bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-500 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-slate-200/50 dark:border-gray-700/50">
                        RESOURCE
                     </span>
                  </td>

                  <!-- Unit -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">
                     {{ material.unitOfMeasurement }}
                  </td>

                  <!-- Quantity -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-4 py-2 text-center bg-slate-50/50 dark:bg-slate-950">
                     <div class="flex flex-col items-center">
                        <span class="text-sm font-black text-slate-800 dark:text-gray-200 font-mono">
                           {{ material.quantity }}
                        </span>
                        <span v-if="(material as any)._quantityChanged" class="text-[8px] font-black text-amber-600 line-through opacity-50">{{ (material as any)._oldQuantity }}</span>
                     </div>
                  </td>

                  <!-- Unit Price Input -->
                  <td class="border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-right bg-white dark:bg-slate-950 group/rate">
                      <div class="flex items-center">
                         <span class="text-[10px] text-slate-300 dark:text-gray-600 font-black mr-1 uppercase">Rate</span>
                         <input
                            v-model.number="material.unitPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            class="w-full text-right px-2 py-1.5 text-sm font-black font-mono border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 focus:border-blue-500 rounded-lg bg-transparent focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white transition-all outline-none focus:ring-4 focus:ring-blue-500/5 z-10 relative"
                            placeholder="0.00"
                            @input="calculateMaterialTotal(material)"
                         />
                      </div>
                  </td>

                  <!-- Total -->
                  <td class="px-4 py-2 text-right bg-slate-50/20 dark:bg-gray-900/20">
                     <span class="text-sm font-black text-slate-900 dark:text-white font-mono tracking-tight" :class="material.totalPrice === 0 ? 'text-rose-400' : ''">
                        {{ formatCurrency(material.totalPrice || 0) }}
                     </span>
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
  /** Form data containing materials list */
  formData: {
    materials: BudgetElement[]
  }
  /** Status of the last materials import */
  importStatus: MaterialsImportInfo | null
  /** Result of materials update availability check */
  materialsUpdateCheck: MaterialsUpdateCheckResponse | null
  /** Approval status of the parent project enquiry */
  approvalStatus?: any | null
  /** Whether a sync/import operation is in progress */
  isImporting: boolean
  /** Whether the system is checking for updates */
  isCheckingUpdates: boolean
}

interface Emits {
  /** Import materials from source task */
  (e: 'import-materials', forceReimport: boolean): void
  /** Trigger a check for source updates */
  (e: 'check-updates'): void
  /** Re-import materials (ignoring current changes) */
  (e: 're-import-materials'): void
  /** Recalculate totals for a material item */
  (e: 'calculate-material-total', material: BudgetMaterialItem): void
  /** Switch the active tab in the parent component */
  (e: 'switch-tab', tab: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const expandedElements = ref<Set<string>>(new Set())
const expandAll = ref(true)

const hasMaterials = computed(() => {
  return props.formData.materials && props.formData.materials.length > 0
})

/** IDs of materials that no longer exist in the source task (from sync analysis) */
const obsoletePersistentIds = computed(() => {
  return props.materialsUpdateCheck?.analysis?.obsolete_persistent_ids || []
})

/** Check if a material is considered obsolete (exists in budget but not in HQ) */
const isObsolete = (material: BudgetMaterialItem, elementName: string) => {
   const obsoleteKeys = obsoletePersistentIds.value
   if (!obsoleteKeys || obsoleteKeys.length === 0) return false

   // 1. Generate the same key used in our comparison engine
   let identificationKey = material.persistent_id
   if (!identificationKey) {
      const eName = elementName.toLowerCase().replace(/\s+/g, '')
      const mDesc = material.description.toLowerCase().replace(/\s+/g, '')
      identificationKey = `legacy_${eName}_${mDesc}`
   }
   
   // 2. Direct match against known obsolete keys
   return obsoleteKeys.includes(identificationKey)
}

/** Filter elements based on search query and exclude obsolete children */
const filteredElements = computed(() => {
  if (!props.formData.materials) return []
  
  // Clone to avoid mutation during filtering if needed, but we just return a filtered list
  return props.formData.materials
    .map(element => ({
      ...element,
      // Filter out obsolete materials from each element
      materials: element.materials.filter(m => !isObsolete(m, element.name))
    }))
    .filter(element => {
      // Hide elements that have no materials left after obsolete filtering
      if (element.materials.length === 0) return false

      if (!searchQuery.value) return true
      const query = searchQuery.value.toLowerCase()
      if (element.name.toLowerCase().includes(query)) return true
      return element.materials.some(m => m.description.toLowerCase().includes(query))
    })
})

/** Check if a material matches the search filter */
const isMaterialMatch = (material: BudgetMaterialItem) => {
   if (!searchQuery.value) return true
   return material.description.toLowerCase().includes(searchQuery.value.toLowerCase())
}

/** Calculate grand total for an element package (excluding obsolete items) */
const getElementTotal = (element: BudgetElement) => {
   return element.materials
     .filter(item => !isObsolete(item, element.name))
     .reduce((sum, item) => sum + (item.totalPrice || 0), 0)
}

/** Styling mapping for element categories */
const getElementCategoryClass = (category: string) => {
   const map: Record<string, string> = {
      'production': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
      'hire': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      'outsourced': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      'stage': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'sound': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'lighting': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
   }
   return map[category.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
}

// UI Actions
const toggleElement = (id: string) => {
  if (expandedElements.value.has(id)) {
    expandedElements.value.delete(id)
  } else {
    expandedElements.value.add(id)
  }
}

const isExpanded = (id: string) => {
  return expandedElements.value.has(id) || (searchQuery.value.length > 0)
}

// Watch global expand toggle
watch(expandAll, (val) => {
   if (val) {
      props.formData.materials.forEach(e => expandedElements.value.add(e.id))
   } else {
      expandedElements.value.clear()
   }
}, { immediate: true })

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
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #334155;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Hide arrows on number inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
