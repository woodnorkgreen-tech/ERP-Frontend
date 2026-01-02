<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true" style="background-color: rgba(0, 0, 0, 0.5);" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <!-- Header -->
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
            {{ isEditing ? 'Edit Material' : 'Add New Material' }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <i class="mdi mdi-close text-xl"></i>
          </button>
        </div>

        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            
            <!-- Workstation Selection (Only if creating) -->
            <div v-if="!isEditing">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Workstation</label>
              <select 
                v-model="form.workstation_id" 
                @change="handleWorkstationChange"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option :value="null" disabled>Select Workstation</option>
                <option v-for="ws in workstations" :key="ws.id" :value="ws.id">{{ ws.name }}</option>
              </select>
            </div>
            
            <!-- Standard Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Material Code / SKU</label>
                  <input type="text" v-model="form.material_code" required class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Material Name</label>
                  <input type="text" v-model="form.material_name" required class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <input type="text" v-model="form.category" class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</label>
                  <input type="text" v-model="form.subcategory" class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit of Measure</label>
                  <input type="text" v-model="form.unit_of_measure" required class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               </div>
               <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Cost</label>
                  <input type="number" step="0.01" v-model.number="form.unit_cost" class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               </div>
            </div>

            <!-- Notes -->
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
               <textarea v-model="form.notes" rows="2" class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

            <!-- Dynamic Fields Loading -->
            <div v-if="schemaLoading" class="text-center py-4">
               <i class="mdi mdi-loading mdi-spin text-blue-600"></i> Loading attributes...
            </div>

            <!-- Dynamic Schema Fields -->
            <div v-else-if="schema.length > 0" class="space-y-4">
               <h4 class="font-medium text-gray-900 dark:text-white">Additional Attributes</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="field in schema" :key="field.key" :class="field.type === 'textarea' ? 'col-span-2' : ''">
                     <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ field.label }}</label>
                     
                     <!-- Textarea -->
                     <textarea 
                        v-if="field.type === 'textarea'"
                        v-model="form.attributes[field.key]"
                        rows="3"
                        class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                     ></textarea>

                     <!-- Number -->
                     <input 
                        v-else-if="field.type === 'number'"
                        type="number"
                        step="any"
                        v-model.number="form.attributes[field.key]"
                        class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                     >

                     <!-- Text / Default -->
                     <input 
                        v-else
                        type="text"
                        v-model="form.attributes[field.key]"
                        class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                     >
                  </div>
               </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="localError" class="text-red-600 text-sm mt-2">{{ localError }}</div>

          </form>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sticky bottom-0 z-10 border-t border-gray-200 dark:border-gray-600">
          <button 
             type="button" 
             class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
             @click="handleSubmit"
             :disabled="loading"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>Save Material</span>
          </button>
          <button 
             type="button" 
             class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
             @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
  </div>
</template>

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
