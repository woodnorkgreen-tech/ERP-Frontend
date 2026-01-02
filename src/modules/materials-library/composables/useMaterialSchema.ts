import { ref } from 'vue';
import api from '@/plugins/axios';

export interface MaterialFieldSchema {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    options?: string[]; // For select
    required?: boolean;
}

export function useMaterialSchema() {
    const schema = ref<MaterialFieldSchema[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchSchema = async (workstationId: number) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get(`/api/materials-library/workstations/${workstationId}/schema`);
            schema.value = response.data.data;
        } catch (e: any) {
            error.value = 'Failed to load field definitions';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return {
        schema,
        loading,
        error,
        fetchSchema
    };
}
