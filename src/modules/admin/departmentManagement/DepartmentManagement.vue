<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 pb-10 font-inter text-slate-900 dark:text-slate-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Minimalist Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <nav class="flex mb-2" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <li><router-link to="/admin" class="hover:text-blue-500 transition-colors">Admin</router-link></li>
              <li><i class="mdi mdi-chevron-right text-xs"></i></li>
              <li class="text-slate-500 dark:text-slate-300">Structural Units</li>
            </ol>
          </nav>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Department <span class="text-blue-500 opacity-50">Logistics</span>
          </h1>
        </div>
        
        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
        >
          <i class="mdi mdi-plus text-lg"></i>
          Register Unit
        </button>
      </div>

      <!-- Compact Search/Filter -->
      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="relative z-10 flex flex-col md:flex-row gap-3">
          <div class="flex-1 relative">
            <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by department name..."
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <select
            v-model="filters.has_manager"
            class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option :value="undefined">Global Scope</option>
            <option :value="true">Managed Units</option>
            <option :value="false">Pending Leadership</option>
          </select>
          <button
            @click="applyFilters"
            class="px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            Sort & Sync
          </button>
        </div>
      </div>

      <!-- High-Density Departments Table -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Structural Nodes...</p>
        </div>

        <div v-else-if="error" class="p-20 text-center text-red-500 font-bold text-sm">
          <i class="mdi mdi-alert-circle-outline text-4xl mb-2 block"></i>
          {{ error }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Structural Unit</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Operational Lead</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Headcount</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Description</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Command</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr v-for="department in departments" :key="department.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                   <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-[10px] shadow-sm uppercase">
                      {{ department.name.substring(0, 2) }}
                    </div>
                    <span class="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">{{ department.name }}</span>
                   </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="department.manager" class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-black">
                      {{ department.manager.first_name[0] }}{{ department.manager.last_name[0] }}
                    </div>
                    <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">{{ department.manager.first_name }} {{ department.manager.last_name }}</span>
                  </div>
                  <span v-else class="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">No Lead</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-[11px] font-black text-slate-400 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    {{ department.user_count || 0 }} Members
                  </span>
                </td>
                <td class="px-6 py-4">
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 max-w-xs">{{ department.description || 'Global Operations Unit' }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-xs">
                   <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editDepartment(department)" class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded-lg transition-all" title="Modify Unit">
                      <i class="mdi mdi-pencil-outline"></i>
                    </button>
                    <button @click="viewEmployees(department)" class="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-500 rounded-lg transition-all" title="Review Members">
                      <i class="mdi mdi-account-group-outline"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Department Config Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px]"></div>
        
        <h2 class="text-2xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-none">
          {{ editingDepartment ? 'Refine' : 'Register' }} <span class="text-blue-500">Unit</span>
        </h2>

        <DepartmentForm
          v-model="departmentFormData"
          :error-message="formError"
          :success-message="formSuccess"
          @submit="handleFormSubmit"
        />

        <div v-if="formError" class="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest italic">
          {{ formError }}
        </div>

        <div v-if="formSuccess" class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-600 text-[10px] font-black uppercase tracking-widest">
          {{ formSuccess }}
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button @click="closeModal" class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="saving">Abort</button>
          <button @click="handleFormSubmit" :disabled="saving" class="px-8 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center gap-2">
            <template v-if="saving">
              <i class="mdi mdi-loading mdi-spin"></i> Syncing...
            </template>
            <template v-else>
              {{ editingDepartment ? 'Update Unit' : 'Initialize Unit' }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Department, CreateDepartmentData, UpdateDepartmentData } from './types/department'
import { useDepartments } from './composables/useDepartments'
import DepartmentForm from './components/DepartmentForm.vue'

const { departments, loading, error, fetchDepartments, createDepartment, updateDepartment } = useDepartments()
const filters = ref({ search: '', has_manager: undefined as boolean | undefined })
const showCreateModal = ref(false)
const editingDepartment = ref<Department | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const departmentFormData = ref<CreateDepartmentData | UpdateDepartmentData>({
  name: '',
  description: '',
  manager_id: undefined,
  budget: undefined,
  location: ''
})

const applyFilters = () => { fetchDepartments(filters.value) }

const editDepartment = (department: Department) => {
  editingDepartment.value = department
  departmentFormData.value = {
    name: department.name,
    description: department.description || '',
    manager_id: department.manager_id || undefined,
    budget: department.budget ? parseFloat(String(department.budget)) : undefined,
    location: department.location || ''
  }
  showCreateModal.value = true
}

const viewEmployees = (department: Department) => { 
  // Integration point for navigating to filtered employee list
  console.log('Syncing filtered employee node:', department.name) 
}

const closeModal = () => {
  showCreateModal.value = false
  editingDepartment.value = null
  formError.value = ''
  formSuccess.value = ''
  departmentFormData.value = { name: '', description: '', manager_id: undefined, budget: undefined, location: '' }
}

const handleFormSubmit = async () => {
  if (!departmentFormData.value.name) { formError.value = 'Identity signature required.'; return }
  saving.value = true
  formError.value = formSuccess.value = ''

  try {
    if (editingDepartment.value) {
      await updateDepartment(editingDepartment.value.id, departmentFormData.value as UpdateDepartmentData)
      formSuccess.value = 'Node synchronized.'
    } else {
      await createDepartment(departmentFormData.value as CreateDepartmentData)
      formSuccess.value = 'Node initialized.'
    }
    await fetchDepartments()
    setTimeout(closeModal, 1000)
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Transmission failed.'
  } finally {
    saving.value = false
  }
}

onMounted(() => { fetchDepartments() })
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
</style>
