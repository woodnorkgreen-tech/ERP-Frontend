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
              <li class="text-slate-500 dark:text-slate-300">User Management</li>
            </ol>
          </nav>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            User <span class="text-blue-500 opacity-50">Accounts</span>
          </h1>
        </div>
        
        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
        >
          <i class="mdi mdi-plus text-lg"></i>
          Provision Account
        </button>
      </div>

      <!-- Compact Filters High-Density -->
      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div class="md:col-span-2 relative">
            <i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by name or email..."
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <select
            v-model="filters.department_id"
            class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Departments</option>
            <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
          <select
            v-model="filters.is_active"
            class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Status</option>
            <option :value="true">Active Only</option>
            <option :value="false">Inactive Only</option>
          </select>
          <button
            @click="applyFilters"
            class="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            Sort & Filter
          </button>
        </div>
      </div>

      <!-- High-Density Table Styling -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Node...</p>
        </div>

        <div v-else-if="error" class="p-20 text-center text-red-500 font-bold text-sm">
          <i class="mdi mdi-alert-circle-outline text-4xl mb-2 block"></i>
          {{ error }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Identity</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Structure</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Clearance</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Integrity</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Command</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-sm uppercase shadow-sm">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">{{ user.name }}</div>
                      <div class="text-[11px] text-slate-400 font-medium">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-[11px] font-bold py-1 px-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                    {{ user.department?.name || 'Unassigned' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="role in user.roles"
                      :key="role.id"
                      class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10"
                    >
                      {{ role.name }}
                    </span>
                    <span v-if="user.roles.length === 0" class="text-[10px] text-slate-300 italic">No Roles</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                      user.is_active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    ]"
                  >
                    {{ user.is_active ? 'Active' : 'Locked' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-xs">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editUser(user)" class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 rounded-lg transition-all" title="Edit Profile">
                      <i class="mdi mdi-pencil-outline"></i>
                    </button>
                    <button @click="assignRoles(user)" class="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-500 rounded-lg transition-all" title="Permissions">
                      <i class="mdi mdi-shield-key-outline"></i>
                    </button>
                    <button @click="toggleUserStatus(user)" 
                            :class="user.is_active ? 'text-red-400 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'"
                            class="p-2 rounded-lg transition-all" :title="user.is_active ? 'Deactivate' : 'Activate'">
                      <i :class="user.is_active ? 'mdi-account-off-outline' : 'mdi-account-check-outline'" class="mdi"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Space-Optimized Pagination -->
        <div class="px-6 py-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
          <Pagination
            v-if="users.length > itemsPerPage"
            :current-page="currentPage"
            :total-items="users.length"
            :items-per-page="itemsPerPage"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Modals (Maintaining original logic, refined UI) -->
    <!-- Create/Edit Modal Refinement -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]"></div>
        
        <h2 class="text-2xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white">
          {{ editingUser ? 'Refine' : 'Register' }} <span class="text-blue-500">Identity</span>
        </h2>

        <UserForm
          v-model="userFormData"
          :error-message="formError"
          :success-message="formSuccess"
          :is-editing="!!editingUser"
          @update:selectedEmployeeId="selectedEmployeeId = $event"
          @submit="handleFormSubmit"
        />

        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button @click="closeModal" class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="saving">
            Abort
          </button>
          <button @click="handleFormSubmit" :disabled="saving" class="px-8 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all flex items-center">
            <template v-if="saving">
              <i class="mdi mdi-loading mdi-spin mr-2"></i> Syncing...
            </template>
            <template v-else>
              {{ editingUser ? 'Update Vector' : 'Initialize Account' }}
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Role Modal Refinement -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <h2 class="text-2xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white">
          Clearance <span class="text-purple-500">Access</span>
        </h2>

        <div v-if="roleError" class="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-xl text-red-600 text-xs font-bold italic">
          {{ roleError }}
        </div>

        <div v-if="selectedUser" class="space-y-6">
          <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject: {{ selectedUser.name }}</h3>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="role in selectedUser.roles" :key="role.id" class="px-2 py-0.5 rounded bg-blue-500 text-white text-[9px] font-black uppercase">
                {{ role.name }}
              </span>
            </div>
          </div>

          <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            <label v-for="role in availableRoles" :key="role.id" 
                   class="flex items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <input v-model="selectedRoleIds" :value="role.id" type="checkbox" class="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20" />
              <div class="ml-3">
                <div class="text-[11px] font-black text-slate-900 dark:text-white">{{ role.name }}</div>
                <div class="text-[9px] text-slate-400 font-medium uppercase tracking-tight">{{ role.permissions.length }} Clearance Nodes</div>
              </div>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button @click="closeRoleModal" class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
          <button @click="saveRoleAssignment" :disabled="savingRoles" class="px-8 py-2.5 bg-slate-900 dark:bg-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all">
            {{ savingRoles ? 'Writing...' : 'Commit Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User, UserFilters, CreateUserData } from './types/user'
import { useUsers } from './composables/useUsers'
import { useDepartments } from '../departmentManagement/composables/useDepartments'
import UserForm from './components/UserForm.vue'
import Pagination from '../../../components/Pagination.vue'

const { users, loading, error, fetchUsers, createUser, updateUser } = useUsers()
const { departments: availableDepartments, fetchDepartments } = useDepartments()

const filters = ref<UserFilters>({})
const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const selectedEmployeeId = ref<number | null>(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(12)

const userFormData = ref<CreateUserData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  department_id: undefined,
  role_ids: []
})

// Role assignment
const showRoleModal = ref(false)
const selectedUser = ref<User | null>(null)
const selectedRoleIds = ref<number[]>([])
const savingRoles = ref(false)
const roleError = ref('')

interface RoleOption {
  id: number
  name: string
  description: string | null
  permissions: Array<{id: number, name: string}>
}

const availableRoles = ref<RoleOption[]>([])

const applyFilters = () => fetchUsers(filters.value)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return users.value.slice(start, start + itemsPerPage.value)
})

const handlePageChange = (page: number) => { currentPage.value = page }

const editUser = (user: User) => {
  editingUser.value = user
  userFormData.value = {
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    department_id: user.department_id || undefined,
    role_ids: user.roles.map(role => role.id)
  }
  showCreateModal.value = true
}

const toggleUserStatus = async (user: User) => {
  try {
    await updateUser(user.id, { is_active: !user.is_active })
    await fetchUsers()
  } catch (err) { console.error('Status toggle failed:', err) }
}

const handleFormSubmit = async () => {
  const isEditing = !!editingUser.value
  if (!isEditing && !selectedEmployeeId.value) { formError.value = 'Employee selection required.'; return }
  if (!isEditing && (!userFormData.value.password || userFormData.value.password.length < 8)) {
    formError.value = 'Password (min 8 chars) required.'; return
  }

  saving.value = true
  formError.value = formSuccess.value = ''

  try {
    if (isEditing) {
      const updateData: any = { ...userFormData.value }
      if (!updateData.password) delete updateData.password && delete updateData.password_confirmation
      await updateUser(editingUser.value!.id, updateData)
      formSuccess.value = 'Node updated.'
    } else {
      await createUser({ ...userFormData.value, employee_id: selectedEmployeeId.value! })
      formSuccess.value = 'Node generated.'
    }
    await fetchUsers()
    setTimeout(closeModal, 1000)
  } catch (err: any) { formError.value = err.message }
  finally { saving.value = false }
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  formError.value = formSuccess.value = ''
  userFormData.value = { name: '', email: '', password: '', password_confirmation: '', role_ids: [] }
}

const assignRoles = async (user: User) => {
  selectedUser.value = user
  selectedRoleIds.value = user.roles.map(r => r.id)
  try {
    const res = await fetch('/api/admin/roles')
    const data = await res.json()
    availableRoles.value = data.data
    showRoleModal.value = true
  } catch { roleError.value = 'Sync failed.' }
}

const closeRoleModal = () => { showRoleModal.value = false; selectedUser.value = null }

const saveRoleAssignment = async () => {
  if (!selectedUser.value) return
  savingRoles.value = true
  try {
    await updateUser(selectedUser.value.id, { role_ids: selectedRoleIds.value })
    await fetchUsers()
    setTimeout(closeRoleModal, 500)
  } catch { roleError.value = 'Commit failed.' }
  finally { savingRoles.value = false }
}

onMounted(() => { fetchUsers(); fetchDepartments() })
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
