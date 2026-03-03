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
              <li class="text-slate-500 dark:text-slate-300">Access Control</li>
            </ol>
          </nav>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Role <span class="text-emerald-500 opacity-50">Management</span>
          </h1>
        </div>
        
        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
        >
          <i class="mdi mdi-plus text-lg"></i>
          Provision Role
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
              placeholder="Search by role name or description..."
              class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
          <button
            @click="fetchRoles"
            class="px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all"
          >
            Apply Filter
          </button>
        </div>
      </div>

      <!-- High-Density Roles Table -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-20 text-center flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-2 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Clearance Data...</p>
        </div>

        <div v-else-if="error" class="p-20 text-center text-red-500 font-bold text-sm">
          <i class="mdi mdi-alert-circle-outline text-4xl mb-2 block"></i>
          {{ error }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50">
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Clearance Pool</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Description</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Node Permissions</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Users</th>
                <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Directives</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
              <tr v-for="role in roles" :key="role.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                   <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xs shadow-sm">
                      <i class="mdi mdi-shield-account-outline"></i>
                    </div>
                    <span class="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">{{ role.name }}</span>
                   </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 max-w-xs">{{ role.description || 'Global Access Profile' }}</p>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="permission in role.permissions.slice(0, 3)"
                      :key="permission.id"
                      class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      {{ permission.name.split('.').pop() }}
                    </span>
                    <span
                      v-if="role.permissions.length > 3"
                      class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      +{{ role.permissions.length - 3 }} Nodes
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-[11px] font-black text-slate-400">
                  {{ role.user_count || 0 }} Accounts
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                   <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="editRole(role)" class="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-500 rounded-lg transition-all" title="Edit Configuration">
                      <i class="mdi mdi-cog-outline"></i>
                    </button>
                    <button @click="handleDeleteRole(role)" class="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 rounded-lg transition-all" title="Purge Role">
                      <i class="mdi mdi-trash-can-outline"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Role Config Modal: Premium Minimalism -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-6xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] relative">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
        
        <div class="mb-8 relative z-10">
          <h2 class="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none mb-2">
            Clearance <span class="text-emerald-500">Node</span>
          </h2>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ editingRole ? 'Modify Existing Protocol' : 'Initialize New Access Protocol' }}</p>
        </div>

        <div v-if="formError" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest italic">
          {{ formError }}
        </div>

        <form @submit.prevent="handleRoleSubmit" class="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-1 min-h-0">
            <div class="md:col-span-1 space-y-4">
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Protocol Name</label>
                <input v-model="roleForm.name" type="text" required placeholder="e.g. Chief Operations" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Module Description</label>
                <textarea v-model="roleForm.description" rows="5" placeholder="Operational boundaries..." class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"></textarea>
              </div>
            </div>

            <div class="md:col-span-2 flex flex-col min-h-0">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Clearance Matrix ({{ roleForm.selectedPermissions.length }} Nodes Active)</label>
              <div class="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-y-auto p-4 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <!-- Group blocks -->
                   <div v-for="(perms, module) in groupedPermissions" :key="module" class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                      <div class="flex items-center justify-between border-b border-slate-50 dark:border-slate-700 pb-2 mb-2">
                        <h4 class="text-[10px] font-black text-slate-900 dark:text-emerald-400 uppercase tracking-widest">{{ module }}</h4>
                        <span class="text-[9px] font-bold text-slate-400 opacity-60">{{ perms.length }} Nodes</span>
                      </div>
                      <div class="grid grid-cols-1 gap-1">
                        <label v-for="p in perms" :key="p.id" class="flex items-center group cursor-pointer">
                          <input v-model="roleForm.selectedPermissions" :value="p.id" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 transition-all" />
                          <span class="ml-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                            {{ p.name.split('.').pop().replace('_', ' ') }}
                          </span>
                        </label>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
            <button type="button" @click="closeCreateModal" class="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors" :disabled="saving">Abort</button>
            <button type="submit" :disabled="saving" class="px-10 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-emerald-500/20 active:scale-95 flex items-center gap-2">
              <i v-if="saving" class="mdi mdi-loading mdi-spin"></i>
              {{ saving ? 'Syncing Matrix...' : (editingRole ? 'Commit Protocol' : 'Initialize Protocol') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoles } from './composables/useRoles'

const { roles, permissions, loading, error, fetchRoles, fetchPermissions, createRole, updateRole, deleteRole } = useRoles()

const filters = ref({})
const showCreateModal = ref(false)
const editingRole = ref(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')

const roleForm = ref({
  name: '',
  description: '',
  selectedPermissions: []
})

// Grouped permissions for the matrix view
const groupedPermissions = computed(() => {
  const groups = {}
  permissions.value.forEach(p => {
    const module = p.name.split('.')[0].toUpperCase()
    if (!groups[module]) groups[module] = []
    groups[module].push(p)
  })
  return groups
})

const editRole = (role) => {
  editingRole.value = role
  roleForm.value = {
    name: role.name,
    description: role.description || '',
    selectedPermissions: role.permissions.map(p => p.id)
  }
  showCreateModal.value = true
}

const handleDeleteRole = async (role) => {
  if (confirm(`PURGE PROTOCOL: Are you sure you want to delete "${role.name}"? Clearance will be revoked for ${role.user_count || 0} nodes.`)) {
    try {
      await deleteRole(role.id)
      await fetchRoles()
    } catch (err) { console.error('Purge failed:', err) }
  }
}

const handleRoleSubmit = async () => {
  if (!roleForm.value.name.trim()) { formError.value = 'Identity signature required.'; return }
  if (roleForm.value.selectedPermissions.length === 0) { formError.value = 'Minimum clearance requirement: 1 node.'; return }

  saving.value = true
  formError.value = ''

  try {
    const roleData = {
      name: roleForm.value.name,
      description: roleForm.value.description,
      permission_ids: roleForm.value.selectedPermissions
    }

    if (editingRole.value) {
      await updateRole(editingRole.value.id, roleData)
    } else {
      await createRole(roleData)
    }
    
    await fetchRoles()
    closeCreateModal()
  } catch (err) {
    formError.value = err.message || 'Transmission failed.'
  } finally {
    saving.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingRole.value = null
  formError.value = ''
  roleForm.value = { name: '', description: '', selectedPermissions: [] }
}

onMounted(async () => {
  await fetchRoles()
  await fetchPermissions()
})
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
