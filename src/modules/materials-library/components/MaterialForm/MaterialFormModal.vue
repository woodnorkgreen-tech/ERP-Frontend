<template>
  <div class="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6">
    <!-- Glass Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col relative z-20 border border-white/20 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <!-- Premium Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <span class="p-2 bg-blue-500/10 rounded-lg mr-3 shadow-inner">
              <i class="mdi text-blue-600 text-xl" :class="isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"></i>
            </span>
            {{ isEditing ? 'Modify Library Material' : 'Register New Material' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
            {{ isEditing ? 'Update material specifications and costs' : 'Add new item to the central production library' }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 overflow-y-auto custom-scrollbar flex-grow">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <!-- Section 1: Classification -->
          <div class="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/50">
            <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center">
              <i class="mdi mdi-tag-outline mr-2"></i>
              Classification & Origin
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Workstation Selection -->
              <div :class="{ 'opacity-60': isEditing }">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Workstation Target</label>
                <div class="relative">
                  <select 
                    v-model="form.workstation_id" 
                    @change="handleWorkstationChange"
                    :disabled="isEditing"
                    class="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white text-sm appearance-none shadow-sm disabled:cursor-not-allowed"
                    required
                  >
                    <option :value="null" disabled>Assign a workstation...</option>
                    <option v-for="ws in workstations" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
                  </select>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
              </div>

              <!-- SKU -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Material Code / SKU</label>
                <input 
                  type="text" 
                  v-model="form.material_code" 
                  required 
                  placeholder="e.g. WOOD-MDF-018"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white placeholder-gray-400"
                >
              </div>
            </div>
          </div>

          <!-- Section 2: Core Details -->
          <div class="space-y-6">
            <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center">
              <i class="mdi mdi-format-list-bulleted mr-2"></i>
              Essential Parameters
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Material Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Material Name</label>
                <input 
                  type="text" 
                  v-model="form.material_name" 
                  required 
                  placeholder="Enter descriptive name for the material..."
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                >
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary Category</label>
                <input 
                  type="text" 
                  v-model="form.category" 
                  placeholder="e.g. Wood, Metal, Electrical"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                >
              </div>

              <!-- Subcategory -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subcategory</label>
                <input 
                  type="text" 
                  v-model="form.subcategory" 
                  placeholder="Specific grouping..."
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                >
              </div>

              <!-- Unit -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Unit of Measure</label>
                <div class="relative">
                   <input 
                    type="text" 
                    v-model="form.unit_of_measure" 
                    required 
                    placeholder="Pcs, Mtr, Kg, Ltr..."
                    class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  >
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 tracking-tighter uppercase">UOM</div>
                </div>
              </div>

              <!-- Cost -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Unit Production Cost (KES)</label>
                <div class="relative group">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">KES</div>
                  <input 
                    type="number" 
                    step="0.01" 
                    v-model.number="form.unit_cost" 
                    class="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Extended Metadata -->
          <div v-if="schemaLoading" class="p-12 text-center">
             <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <span class="text-sm font-medium text-gray-500 uppercase tracking-widest">Compiling Specifications...</span>
          </div>

          <div v-else-if="schema.length > 0" class="pt-6 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
            <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 flex items-center">
              <i class="mdi mdi-playlist-star mr-2"></i>
              Custom Attributes ({{ schema.length }})
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="field in schema" :key="field.key" :class="field.type === 'textarea' ? 'col-span-2' : ''">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ field.label }}</label>
                
                <textarea 
                  v-if="field.type === 'textarea'"
                  v-model="form.attributes[field.key]"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                ></textarea>

                <input 
                  v-else-if="field.type === 'number'"
                  type="number"
                  step="any"
                  v-model.number="form.attributes[field.key]"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                >

                <input 
                  v-else
                  type="text"
                  v-model="form.attributes[field.key]"
                  class="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                >
              </div>
            </div>
          </div>

          <!-- Notes Area -->
          <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Additional Internal Notes</label>
            <textarea 
              v-model="form.notes" 
              rows="3" 
              placeholder="Record any special handling or procurement instructions..."
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
            ></textarea>
          </div>

          <!-- Error Feedback -->
          <div v-if="localError" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400">
            <i class="mdi mdi-alert-circle text-xl"></i>
            <span class="text-sm font-medium">{{ localError }}</span>
          </div>
        </form>
      </div>

      <!-- Action Footer -->
      <div class="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3 items-center">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-6 py-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-bold transition-colors"
        >
          Discard Changes
        </button>
        <button 
          type="button" 
          @click="handleSubmit"
          :disabled="loading"
          class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:scale-100"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
          <span>{{ isEditing ? 'Update Library' : 'Create Material' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

@keyframes animate-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}
</style>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useMaterials } from '../../composables/useMaterials';
import { useWorkstations } from '../../composables/useWorkstations';
import { useMaterialSchema } from '../../composables/useMaterialSchema';
import type { LibraryMaterial } from '../../types/material';

const props = defineProps<{
  material?: LibraryMaterial | null; // If passed, we are editing
  initialWorkstationId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', material: LibraryMaterial): void;
}>();

const { createMaterial, updateMaterial, loading, error: apiError } = useMaterials();
const { workstations, fetchWorkstations } = useWorkstations();
const { schema, loading: schemaLoading, fetchSchema } = useMaterialSchema();

const isEditing = computed(() => !!props.material);
const localError = ref<string | null>(null);

const form = reactive({
  workstation_id: null as number | null,
  material_code: '',
  material_name: '',
  category: '',
  subcategory: '',
  unit_of_measure: '',
  unit_cost: 0,
  notes: '',
  attributes: {} as Record<string, any>
});

// Initialize form
onMounted(async () => {
    // Fetch workstations if necessary
    if (workstations.value.length === 0) {
        await fetchWorkstations();
    }

  if (props.material) {
    // Edit Mode
    form.workstation_id = props.material.workstation_id;
    form.material_code = props.material.material_code;
    form.material_name = props.material.material_name;
    form.category = props.material.category || '';
    form.subcategory = props.material.subcategory || '';
    form.unit_of_measure = props.material.unit_of_measure;
    form.unit_cost = props.material.unit_cost;
    form.notes = props.material.notes || '';
    
    // Attributes
    if (props.material.attributes && props.material.attributes.attributes) {
        form.attributes = { ...props.material.attributes.attributes };
    } else {
        form.attributes = { ...props.material.attributes }; // Fallback
    }

    await fetchSchema(form.workstation_id);

  } else {
    // Create Mode
    if (props.initialWorkstationId) {
      form.workstation_id = props.initialWorkstationId;
      await fetchSchema(form.workstation_id);
    }
  }
});

const handleWorkstationChange = async () => {
    if (form.workstation_id) {
        form.attributes = {}; // Clear attributes on workstation change
        await fetchSchema(form.workstation_id);
    }
};

const handleSubmit = async () => {
    localError.value = null;
    if (!form.workstation_id) {
        localError.value = "Workstation is required";
        return;
    }

    try {
        const payload = {
            workstation_id: form.workstation_id,
            material_code: form.material_code,
            material_name: form.material_name,
            category: form.category,
            subcategory: form.subcategory,
            unit_of_measure: form.unit_of_measure,
            unit_cost: form.unit_cost,
            notes: form.notes,
            attributes: form.attributes
        };

        let saved: LibraryMaterial;

        if (isEditing && props.material) {
            saved = await updateMaterial(props.material.id, payload);
        } else {
            saved = await createMaterial(payload);
        }

        emit('saved', saved);
        emit('close');
    } catch (e: any) {
        localError.value = apiError.value || e.response?.data?.message || 'Failed to save material';
    }
};
</script>
