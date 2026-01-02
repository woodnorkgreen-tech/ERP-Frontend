import { ref } from 'vue';
import api from '@/plugins/axios';

export function useMaterialExport() {
    const isExporting = ref(false);
    const error = ref<string | null>(null);

    const downloadTemplate = async (workstationId: number, workstationName: string) => {
        isExporting.value = true;
        error.value = null;
        try {
            const response = await api.get(`/api/materials-library/template/${workstationId}`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Sanitize workstation name for filename
            const safeName = workstationName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.setAttribute('download', `${safeName}_template.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e: any) {
            error.value = 'Failed to download template';
            console.error(e);
        } finally {
            isExporting.value = false;
        }
    };

    return {
        isExporting,
        error,
        downloadTemplate
    };
}
