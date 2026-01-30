import { ref, type Ref } from 'vue';
import api from '@/plugins/axios';

export interface Version {
    id: number;
    version_number: number;
    label: string;
    reason?: string;
    change_log?: string | Array<{ type: 'addition' | 'removal' | 'modification', message: string }>;
    is_base?: boolean;
    created_at: string;
    created_by?: number;
    created_by_name: string;
    source_updated_at?: string;
    materials_version_id?: number;
    materials_version_number?: number;
    data?: any;
}

export interface VersionResponse<T = any> {
    message: string;
    data?: T;
    warning?: string;
    warnings?: string[];
    approvals_reset?: boolean;
    status_reset_to_draft?: boolean;
}

export type VersionType = 'materials' | 'budget' | 'quote';

export function useVersioning(taskId: Ref<number> | number, type: VersionType) {
    const versions = ref<Version[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const getTaskId = (): number => {
        return typeof taskId === 'number' ? taskId : taskId.value;
    };

    const getBasePath = () => {
        const id = getTaskId();
        return `/api/projects/tasks/${id}/${type}`;
    };

    /**
     * Fetch all versions for this task
     */
    const fetchVersions = async (): Promise<void> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get(`${getBasePath()}/versions`);
            versions.value = response.data.data || [];
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to load versions';
            console.error('Error fetching versions:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Fetch a single version for this task with snapshot data
     */
    const fetchVersion = async (versionId: number): Promise<Version> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.get(`${getBasePath()}/versions/${versionId}`);
            return response.data.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to load version details';
            console.error('Error fetching version:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Create a new version
     */
    const createVersion = async (label?: string, reason?: string): Promise<VersionResponse<Version>> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.post(`${getBasePath()}/versions`, {
                label: label || undefined,
                reason: reason || undefined,
            });

            // Refresh the versions list
            await fetchVersions();

            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create version';
            console.error('Error creating version:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Restore a version
     */
    const restoreVersion = async (versionId: number): Promise<VersionResponse> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.post(`${getBasePath()}/versions/${versionId}/restore`);
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to restore version';
            console.error('Error restoring version:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        versions,
        isLoading,
        error,
        fetchVersions,
        fetchVersion,
        createVersion,
        restoreVersion,
    };
}
