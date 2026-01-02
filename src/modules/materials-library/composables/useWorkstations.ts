import { ref } from 'vue';
import api from '@/plugins/axios';
import type { Workstation } from '../types/workstation';

export function useWorkstations() {
    const workstations = ref<Workstation[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchWorkstations = async () => {
        loading.value = true;
        error.value = null;
        try {
            // Assuming apiClient is correctly configured to handle base URL or prepend it
            const response = await api.get('/api/materials-library/workstations');
            workstations.value = response.data.data;
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch workstations';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    return {
        workstations,
        loading,
        error,
        fetchWorkstations,
    };
}
