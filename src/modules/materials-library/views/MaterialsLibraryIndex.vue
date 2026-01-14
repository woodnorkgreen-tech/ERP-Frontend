<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Navigation and Actions Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div class="flex items-center space-x-4">
          <button 
            @click="$router.push('/dashboard')" 
            class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:text-white"
          >
            <i class="mdi mdi-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            Back
          </button>
          
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              Materials Library
              <span v-if="pagination.total > 0" class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ pagination.total }} total
              </span>
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage production materials, specifications, and inventory.
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button 
             @click="openImportWizard"
             class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <i class="mdi mdi-file-import mr-2 text-blue-600"></i> Import Excel
          </button>
          <button 
             @click="openAddForm"
             class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-blue-500/30 transition-all"
          >
            <i class="mdi mdi-plus mr-2"></i> Add Material
          </button>
          <button 
            @click="toggleTrashView"
            class="inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-all"
            :class="showTrashed 
              ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            <i class="mdi mr-2" :class="showTrashed ? 'mdi-arrow-left' : 'mdi-delete-outline'"></i>
            {{ showTrashed ? 'Back to Library' : 'View Trash' }}
          </button>
          <button 
            @click="$router.push('/')"
            class="ml-2 p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Close Module"
          >
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Main Content Block -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          
          <!-- Tabs & Filters Stack -->
          <div class="flex flex-col gap-6">
            <!-- Row 1: Workstation Tabs -->
            <div class="w-full">
               <WorkstationTabs 
                 v-model="selectedWorkstation"
                 :workstations="workstations"
                 class="w-full"
               />
            </div>
            
            <!-- Row 2: Filters -->
            <div class="w-full bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                <div v-if="showTrashed" class="flex items-center justify-between mb-2">
                   <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <i class="mdi mdi-delete-alert text-xl"></i>
                      <span class="font-semibold">Viewing Trashed Materials</span>
                      <span class="text-xs opacity-75">(Restoring these will return them to their respective workstation)</span>
                   </div>
                   <button @click="toggleTrashView" class="text-xs text-gray-500 hover:text-gray-700 underline">Exit Trash View</button>
                </div>
                <SearchFilters
                  v-model:search="searchQuery"
                  v-model:category="selectedCategory"
                  v-model:subcategory="selectedSubcategory"
                  @filter="applyFilters"
                  class="w-full"
                />
            </div>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-6 mt-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="mdi mdi-alert-circle text-red-500"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-700">
                        {{ error }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Materials Table -->
        <MaterialsTable
          :materials="materials"
          :loading="loading"
          :showTrashed="showTrashed"
          :canDelete="isSuperAdmin"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
          @restore="handleRestore"
          @forceDelete="handleForceDelete"
        />
      </div>

    </div>

    <!-- Import Wizard Modal -->
    <Teleport to="body">
      <ImportWizard
        v-if="showImport"
        :initial-workstation-id="selectedWorkstation"
        @close="closeImportWizard"
        @imported="handleImportSuccess"
      />
    </Teleport>

    <!-- Material Form Modal -->
    <Teleport to="body">
      <MaterialFormModal
        v-if="showForm"
        :material="editingMaterial"
        :initial-workstation-id="selectedWorkstation"
        @close="closeFormAndRefresh"
        @saved="handleSaved"
      />
    </Teleport>

    <!-- Material Details Modal -->
    <Teleport to="body">
      <MaterialDetailsModal
        v-if="showDetails && selectedMaterial"
        :material="selectedMaterial"
        @close="showDetails = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useMaterials } from '../composables/useMaterials';
import { useWorkstations } from '../composables/useWorkstations';
import WorkstationTabs from '../components/WorkstationTabs.vue';
import MaterialsTable from '../components/MaterialsTable.vue';
import SearchFilters from '../components/SearchFilters.vue';
import ImportWizard from '../components/ImportWizard/ImportWizard.vue';
import MaterialFormModal from '../components/MaterialForm/MaterialFormModal.vue';
import MaterialDetailsModal from '../components/MaterialDetailsModal.vue';
import type { LibraryMaterial } from '../types/material';

const { user } = useAuth();
const isSuperAdmin = computed(() => {
    return user.value?.roles?.includes('Super Admin') || false;
});

const { 
    materials, loading, error, fetchMaterials, fetchTrashedMaterials, 
    deleteMaterial, restoreMaterial, forceDeleteMaterial, pagination 
} = useMaterials();
const { workstations, fetchWorkstations } = useWorkstations();

const selectedWorkstation = ref<number | null>(null);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedSubcategory = ref('');
const showImport = ref(false);
const showForm = ref(false);
const showDetails = ref(false);
const showTrashed = ref(false);
const editingMaterial = ref<LibraryMaterial | null>(null);
const selectedMaterial = ref<LibraryMaterial | null>(null);

// Initial Load
onMounted(async () => {
  await fetchWorkstations();
  // Select first workstation by default if available
  if (workstations.value.length > 0) {
      selectedWorkstation.value = workstations.value[0].id;
  }
});

// Watch for workstation change to fetch specific materials
watch(selectedWorkstation, (newId) => {
  if (newId) {
    applyFilters();
  }
});

const applyFilters = () => {
  if (showTrashed.value) {
    fetchTrashedMaterials(searchQuery.value);
    return;
  }

  if (selectedWorkstation.value) {
    fetchMaterials({
      workstationId: selectedWorkstation.value,
      search: searchQuery.value,
      category: selectedCategory.value,
      // Pass subcategory if supported by backend, otherwise it's just ready
      subcategory: selectedSubcategory.value
    } as any);
  }
};

const toggleTrashView = () => {
    showTrashed.value = !showTrashed.value;
    applyFilters();
};

const openImportWizard = () => {
  showImport.value = true;
};

const closeImportWizard = (success?: boolean) => {
  showImport.value = false;
  if (success) {
      applyFilters(); // Refresh data
  }
};

const handleImportSuccess = () => {
    applyFilters(); 
};

const openAddForm = () => {
    editingMaterial.value = null;
    showForm.value = true;
};

const handleEdit = (material: LibraryMaterial) => {
    editingMaterial.value = material;
    showForm.value = true;
};

const handleView = (material: LibraryMaterial) => {
    selectedMaterial.value = material;
    showDetails.value = true;
};

const closeFormAndRefresh = () => {
    showForm.value = false;
    editingMaterial.value = null;
};

const handleSaved = () => {
    showForm.value = false;
    editingMaterial.value = null;
    applyFilters();
};

const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this material? It will be moved to trash.')) {
        await deleteMaterial(id);
    }
};

const handleRestore = async (id: number) => {
    if (confirm('Restore this material to the library?')) {
        await restoreMaterial(id);
        applyFilters();
    }
};

const handleForceDelete = async (id: number) => {
    if (confirm('WARNING: This will PERMANENTLY delete this material from the database. This action CANNOT be undone. Proceed?')) {
        await forceDeleteMaterial(id);
        applyFilters();
    }
};
</script>
