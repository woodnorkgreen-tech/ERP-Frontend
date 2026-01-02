import { ref } from 'vue';
import api from '@/plugins/axios';

export interface ImportResult {
    total: number;
    success: number;
    updated: number;
    created: number;
    errors: string[];
}

export function useMaterialImport() {
    const isImporting = ref(false);
    const error = ref<string | null>(null);
    const importResult = ref<ImportResult | null>(null);

    const importMaterials = async (file: File, workstationId: number) => {
        isImporting.value = true;
        error.value = null;
        importResult.value = null;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('workstation_id', workstationId.toString());

        try {
            const response = await api.post('/api/materials-library/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            importResult.value = response.data.data;
            return response.data.data;
        } catch (e: any) {
            error.value = e.response?.data?.message || e.message || 'Import failed';
            throw e;
        } finally {
            isImporting.value = false;
        }
    };

    const resetImport = () => {
        error.value = null;
        importResult.value = null;
    };

    return {
        isImporting,
        error,
        importResult,
        importMaterials,
        resetImport
    };
}
