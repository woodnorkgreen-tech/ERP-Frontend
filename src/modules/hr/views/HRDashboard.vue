<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">HR Dashboard</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Employee management and HR operations overview</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-blue-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.totalEmployees }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Employees</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.activeEmployees }}</p>
          </div>
        </div>
      </div>

      <!-- <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Salary</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ stats.averageSalary.toLocaleString() }}</p>
          </div>
        </div>
      </div> -->

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-purple-500 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">New Hires</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.newHiresThisMonth }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">This month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Department Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Employees by Department</h2>
        <div class="space-y-3">
          <div v-for="dept in stats.employeesByDepartment" :key="dept.name" class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ dept.name }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{ width: `${(dept.count / stats.totalEmployees) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{{ dept.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Hires</h2>
        <div class="space-y-3">
          <div v-for="employee in stats.recentHires" :key="employee.id" class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-white">{{ employee.first_name.charAt(0) }}{{ employee.last_name.charAt(0) }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ employee.first_name }} {{ employee.last_name }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ employee.position }}</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(employee.hire_date) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/hr/employees"
          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div class="p-2 bg-blue-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Manage Employees</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">View and update employee records</p>
          </div>
        </router-link>

        <div class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="p-2 bg-green-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Payroll</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Process salaries and benefits</p>
          </div>
        </div>

        <div class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="p-2 bg-purple-500 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Performance</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Review and manage performance</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Labour Section -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mt-10">
      <div class="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-700/20">
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Technical Resource Pool</h2>
          <p class="text-sm text-slate-500 font-medium mt-1">Registry for specialized external teams and freelancers</p>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search in Pool -->
          <div class="relative min-w-[280px]">
            <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              v-model="labourSearch"
              type="text" 
              placeholder="Search skills (e.g. Rigger)..." 
              class="w-full h-11 pl-11 pr-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all uppercase tracking-widest"
            />
          </div>
          <button 
            @click="openLabourModal()"
            class="h-11 px-6 bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-slate-900 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <i class="mdi mdi-account-plus text-lg"></i>
            Capture New Skill
          </button>
        </div>
      </div>

      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead class="bg-white dark:bg-gray-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Team Member Identity</th>
              <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Specialization</th>
              <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700 text-center">Efficiency Rating</th>
              <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Standard Rate</th>
              <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700">Status</th>
              <th class="px-8 py-5 border-b border-gray-100 dark:border-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr v-if="filteredLabours.length === 0" class="text-center py-20">
              <td colspan="6" class="px-8 py-20">
                <div class="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                  <i class="mdi mdi-account-search-outline text-6xl mb-4"></i>
                  <p class="text-sm font-black uppercase tracking-widest">No resources match your search criteria</p>
                </div>
              </td>
            </tr>
            <tr v-for="labour in filteredLabours" :key="labour.id" class="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                    <i class="mdi mdi-account text-xl"></i>
                  </div>
                  <div>
                    <div class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{{ labour.full_name }}</div>
                    <div class="text-[10px] text-slate-400 font-bold tracking-widest">{{ labour.phone || 'No Phone' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6 text-sm">
                <span class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest">
                  {{ labour.specialization || 'Generalist' }}
                </span>
              </td>
              <td class="px-8 py-6 text-center">
                 <div class="flex items-center justify-center gap-0.5 text-amber-400">
                   <i v-for="i in 5" :key="i" class="mdi" :class="i <= Math.round(labour.rating) ? 'mdi-star' : 'mdi-star-outline'"></i>
                 </div>
              </td>
              <td class="px-8 py-6">
                <div class="text-sm font-black text-slate-900 dark:text-white">KES {{ Number(labour.day_rate).toLocaleString() }}</div>
                <div class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fixed Day Rate</div>
              </td>
              <td class="px-8 py-6">
                <span 
                  class="px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm"
                  :class="{
                    'bg-emerald-50 text-emerald-600 border border-emerald-100': labour.status === 'active',
                    'bg-slate-50 text-slate-500 border border-slate-200': labour.status === 'inactive',
                    'bg-rose-50 text-rose-600 border border-rose-100': labour.status === 'blacklisted'
                  }"
                >
                  {{ labour.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button @click="openLabourModal(labour)" class="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-500 transition-all active:scale-95" title="Modify Record">
                    <i class="mdi mdi-pencil text-lg"></i>
                  </button>
                  <button @click="handleDeleteLabour(labour.id)" class="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-500 transition-all active:scale-95" title="Purge Record">
                    <i class="mdi mdi-delete-outline text-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Technical Labour Modal -->
    <div v-if="showLabourModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-bold dark:text-white">{{ editingLabour ? 'Update Technical Team Member' : 'New Technical Labour Capture' }}</h3>
          <button @click="showLabourModal = false" class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>

        <form @submit.prevent="handleSaveLabour" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
              <input v-model="labourForm.full_name" required type="text" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Specialization</label>
              <input v-model="labourForm.specialization" type="text" placeholder="e.g. Electrician, Rigger" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
              <input v-model="labourForm.phone" type="tel" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Email Address</label>
              <input v-model="labourForm.email" type="email" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Day Rate (KES) *</label>
              <input v-model="labourForm.day_rate" required type="number" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Efficiency Rating (1-5)</label>
              <input v-model="labourForm.rating" type="number" min="1" max="5" step="0.5" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500 uppercase">Availability Status</label>
              <select v-model="labourForm.status" class="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white">
                <option value="active">Active / Available</option>
                <option value="inactive">Inactive</option>
                <option value="blacklisted">Blacklisted / Do Not Hire</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase">Internal Notes / Performance Record</label>
            <textarea v-model="labourForm.notes" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white lg:resize-none"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showLabourModal = false" class="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
            <button :disabled="labourLoading" type="submit" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50">
              {{ labourLoading ? 'Processing...' : (editingLabour ? 'Update Records' : 'Save To Database') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useEmployees } from '../../shared/composables/useEmployees'
import { useTechnicalLabour, type TechnicalLabour } from '../composables/useTechnicalLabour'

const { employees, fetchEmployees } = useEmployees()
const { labours, loading: labourLoading, fetchLabours, createLabour, updateLabour, deleteLabour } = useTechnicalLabour()

// State for technical labour UI
const showLabourModal = ref(false)
const editingLabour = ref<TechnicalLabour | null>(null)
const labourSearch = ref('')
const labourForm = ref({
  full_name: '',
  specialization: '',
  phone: '',
  email: '',
  day_rate: 0,
  status: 'active' as 'active' | 'inactive' | 'blacklisted',
  notes: '',
  rating: 5
})

const filteredLabours = computed(() => {
  if (!labourSearch.value) return labours.value
  const search = labourSearch.value.toLowerCase()
  return labours.value.filter(l => 
    l.full_name.toLowerCase().includes(search) || 
    l.specialization?.toLowerCase().includes(search) ||
    l.email?.toLowerCase().includes(search)
  )
})

const openLabourModal = (labour: TechnicalLabour | null = null) => {
  if (labour) {
    editingLabour.value = labour
    labourForm.value = {
      full_name: labour.full_name,
      specialization: labour.specialization,
      phone: labour.phone,
      email: labour.email,
      day_rate: Number(labour.day_rate),
      status: labour.status,
      notes: labour.notes,
      rating: Number(labour.rating)
    }
  } else {
    editingLabour.value = null
    labourForm.value = {
      full_name: '',
      specialization: '',
      phone: '',
      email: '',
      day_rate: 0,
      status: 'active',
      notes: '',
      rating: 5
    }
  }
  showLabourModal.value = true
}

const handleSaveLabour = async () => {
  try {
    if (editingLabour.value) {
      await updateLabour(editingLabour.value.id, labourForm.value)
    } else {
      await createLabour(labourForm.value)
    }
    showLabourModal.value = false
    await fetchLabours()
  } catch (err) {
    console.error('Failed to save technical labour:', err)
  }
}

const handleDeleteLabour = async (id: number) => {
  if (confirm('Are you sure you want to remove this technical labour record?')) {
    try {
      await deleteLabour(id)
      await fetchLabours()
    } catch (err) {
      console.error('Failed to delete labour:', err)
    }
  }
}

// Computed stats
const stats = computed(() => {
  const totalEmployees = employees.value.length
  const activeEmployees = employees.value.filter(e => e.status === 'active').length

  const newHiresThisMonth = employees.value.filter(e => {
    const hireDate = new Date(e.hire_date)
    const now = new Date()
    return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear()
  }).length

  // Group employees by department name
  const departmentCounts: Record<string, number> = {}
  employees.value.forEach(employee => {
    const deptName = employee.department?.name || 'No Department'
    departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1
  })

  const employeesByDepartment = Object.entries(departmentCounts)
    .map(([name, count]) => ({ name, count }))
    .filter(dept => dept.count > 0) // Only show departments with employees
    .sort((a, b) => b.count - a.count) // Sort by count descending

  const recentHires = [...employees.value]
    .sort((a: any, b: any) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())
    .slice(0, 3)

  return {
    totalEmployees,
    activeEmployees,
    newHiresThisMonth,
    employeesByDepartment,
    recentHires
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchEmployees()
  fetchLabours()
})
</script>
