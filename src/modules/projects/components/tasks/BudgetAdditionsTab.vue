<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    
    <!-- Premium Header -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <i class="mdi mdi-plus-box-multiple text-2xl"></i>
        </div>
        <div>
          <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Budget Additions</h3>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Supplemental Requests & BCRs</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
           @click="openCreateModal"
           class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <i class="mdi mdi-plus"></i> New Addition
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Additionals</p>
          <p class="text-xl font-black text-gray-900 dark:text-white font-mono">{{ formatCurrency(totalAdditionals) }}</p>
       </div>
       <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Pending Approval</p>
          <p class="text-xl font-black text-gray-900 dark:text-white font-mono">{{ formatCurrency(pendingTotal) }}</p>
       </div>
       <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Approved Total</p>
          <p class="text-xl font-black text-gray-900 dark:text-white font-mono">{{ formatCurrency(approvedTotal) }}</p>
       </div>
    </div>

    <!-- Empty State -->
    <div v-if="additions.length === 0 && !isLoading" class="bg-white dark:bg-gray-800 rounded-2xl py-20 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
       <div class="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
          <i class="mdi mdi-text-box-search-outline text-3xl text-gray-300"></i>
       </div>
       <h4 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">No additions found</h4>
       <p class="text-xs text-gray-500 mt-2 max-w-xs uppercase tracking-tight font-bold">Supplemental budget requests will appear here for tracking and approval.</p>
    </div>

    <!-- Additions List -->
    <div v-else class="space-y-4">
       <div v-if="isLoading" class="py-12 flex justify-center">
          <i class="mdi mdi-loading mdi-spin text-4xl text-emerald-500"></i>
       </div>
       
       <div 
         v-for="addition in additions" 
         :key="addition.id"
         class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
       >
         <div class="flex flex-col md:flex-row">
            <!-- Left Side: Status & Summary -->
            <div class="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
               <div class="flex items-center justify-between mb-4">
                  <span :class="getStatusBadgeClass(addition.status)" class="text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm">
                    {{ addition.status.replace('_', ' ') }}
                  </span>
                  <span class="text-[10px] font-bold text-gray-400 font-mono">{{ formatDate(addition.created_at) }}</span>
               </div>
               <h4 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{{ addition.title }}</h4>
               <p v-if="addition.description" class="text-xs text-gray-500 line-clamp-2 md:line-clamp-3 mb-4">{{ addition.description }}</p>
               
               <div class="flex items-center gap-2 mt-auto">
                  <div class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500">
                    {{ (addition.creator?.name || 'U').charAt(0) }}
                  </div>
                  <span class="text-[10px] font-bold text-gray-400 lowercase tracking-tight italic">by {{ addition.creator?.name || 'System' }}</span>
               </div>
            </div>

            <!-- Middle Side: Breakout -->
            <div class="p-6 md:w-1/2 flex flex-col justify-center">
               <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="flex flex-col">
                     <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Materials</span>
                     <span class="text-xs font-bold text-gray-700 dark:text-gray-200 font-mono">{{ formatCurrency(sumTotals(addition.materials, 'totalPrice')) }}</span>
                  </div>
                  <div class="flex flex-col">
                     <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Labour</span>
                     <span class="text-xs font-bold text-gray-700 dark:text-gray-200 font-mono">{{ formatCurrency(sumTotals(addition.labour, 'amount')) }}</span>
                  </div>
                  <div class="flex flex-col">
                     <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Logistics</span>
                     <span class="text-xs font-bold text-gray-700 dark:text-gray-200 font-mono">{{ formatCurrency(sumTotals(addition.logistics, 'amount')) }}</span>
                  </div>
                  <div class="flex flex-col">
                     <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Expenses</span>
                     <span class="text-xs font-bold text-gray-700 dark:text-gray-200 font-mono">{{ formatCurrency(sumTotals(addition.expenses, 'amount')) }}</span>
                  </div>
               </div>
            </div>

            <!-- Right Side: Total & Actions -->
            <div class="p-6 md:w-1/6 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-t md:border-t-0 border-gray-100 dark:border-gray-700">
               <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</p>
               <p class="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mb-4">{{ formatCurrency(addition.total_amount) }}</p>
               
               <div class="flex gap-2">
                  <button 
                    @click="viewDetails(addition)"
                    class="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 shadow-sm transition-all"
                    title="View Details"
                  >
                    <i class="mdi mdi-eye"></i>
                  </button>
                  <button 
                    v-if="addition.status === 'draft'"
                    @click="editAddition(addition)"
                    class="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 shadow-sm transition-all"
                    title="Edit Request"
                  >
                    <i class="mdi mdi-pencil"></i>
                  </button>
                  <button 
                    v-if="addition.status === 'pending_approval'"
                    @click="openApprovalModal(addition)"
                    class="p-2 bg-emerald-600 border border-emerald-500 rounded-lg text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all scale-105"
                    title="Process Approval"
                  >
                    <i class="mdi mdi-check-decagram"></i>
                  </button>
               </div>
            </div>
         </div>
       </div>
    </div>

    <!-- Simple Addition Modal (Placeholder for full form) -->
    <div v-if="showModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
       <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
       <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
             <div class="flex items-center gap-3">
                <i class="mdi mdi-file-plus-outline text-2xl text-emerald-500"></i>
                <h3 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider">{{ isEditing ? 'Edit' : 'Create' }} Budget Addition</h3>
             </div>
             <button @click="showModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <i class="mdi mdi-close text-gray-400"></i>
             </button>
          </div>
          
          <div class="p-8 overflow-y-auto space-y-6">
             <!-- Title & Description -->
             <div class="space-y-4">
                <div>
                   <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Title</label>
                   <input 
                     v-model="form.title" 
                     placeholder="e.g., Additional Stage Lighting for VIP Area"
                     class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                   />
                </div>
                <div>
                   <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Reason / Description</label>
                   <textarea 
                     v-model="form.description" 
                     rows="3" 
                     placeholder="Explain why this addition is necessary..."
                     class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                   ></textarea>
                </div>
             </div>

             <!-- Items Section -->
             <div class="p-6 bg-slate-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700">
                <div class="flex flex-col items-center justify-center py-4">
                   <i class="mdi mdi-briefcase-plus-outline text-3xl text-slate-300 mb-2"></i>
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Item Editor Integration Pending</p>
                   <p class="text-xs text-slate-500 font-bold mt-1 text-center italic">Currently, please use the main budget tabs to mark manual additions if needed, or wait for the full BCR module release.</p>
                </div>
             </div>
          </div>

          <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
             <button @click="showModal = false" class="px-6 py-2.5 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
             <button @click="saveAddition" class="px-8 py-2.5 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all">Save Addition</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBudgetAdditions } from '../../composables/useBudgetAdditions'

interface Props {
  taskId: number
}

const props = defineProps<Props>()

const { additions, isLoading, error, fetchAdditions, createAddition, updateAddition, processApproval } = useBudgetAdditions(props.taskId)

onMounted(fetchAdditions)

// Totals
const totalAdditionals = computed(() => additions.value.reduce((sum, a) => sum + a.total_amount, 0))
const pendingTotal = computed(() => additions.value.filter(a => a.status === 'pending_approval').reduce((sum, a) => sum + a.total_amount, 0))
const approvedTotal = computed(() => additions.value.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.total_amount, 0))

// Modal Logic
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | number | null>(null)
const form = ref({
   title: '',
   description: '',
   materials: [],
   labour: [],
   expenses: [],
   logistics: [],
   status: 'draft' as const
})

const openCreateModal = () => {
   isEditing.value = false
   editingId.value = null
   form.value = {
      title: '',
      description: '',
      materials: [],
      labour: [],
      expenses: [],
      logistics: [],
      status: 'draft'
   }
   showModal.value = true
}

const editAddition = (addition: any) => {
   isEditing.value = true
   editingId.value = addition.id
   form.value = { ...addition }
   showModal.value = true
}

const saveAddition = async () => {
   if (!form.value.title) {
       alert('Title is required')
       return
   }
   
   try {
      if (isEditing.value && editingId.value) {
         await updateAddition(editingId.value, form.value)
      } else {
         await createAddition(form.value)
      }
      showModal.value = false
   } catch (err) {
      console.error('Save addition failed:', err)
   }
}

const viewDetails = (addition: any) => {
   // Placeholder for detailed view
   alert(`Viewing details for: ${addition.title}\nStatus: ${addition.status}\nTotal: ${formatCurrency(addition.total_amount)}`)
}

const openApprovalModal = async (addition: any) => {
   const confirmText = prompt(`Approve Addition: "${addition.title}"?\nTotal: ${formatCurrency(addition.total_amount)}\n\nType "APPROVE" to confirm or "REJECT" to reject.`)
   
   if (!confirmText) return

   try {
      if (confirmText.toUpperCase() === 'APPROVE') {
         await processApproval(addition.id, 'approve', 'Approved via fast-track UI')
      } else if (confirmText.toUpperCase() === 'REJECT') {
         await processApproval(addition.id, 'reject', 'Rejected via fast-track UI')
      }
   } catch (err) {
      console.error('Approval failed:', err)
   }
}

// Helpers
const getStatusBadgeClass = (status: string) => {
   const map: any = {
      'draft': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
      'pending_approval': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
   }
   return map[status] || 'bg-gray-100 text-gray-600'
}

const sumTotals = (items: any[] | undefined, key: string) => {
   if (!items) return 0
   return items.reduce((sum, i) => sum + (i[key] || 0), 0)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string) => {
   return new Date(dateStr).toLocaleDateString('en-GB')
}
</script>

<style scoped>
.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
