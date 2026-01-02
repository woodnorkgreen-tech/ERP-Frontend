import { ref } from 'vue';
import api from '@/plugins/axios';
import type { LibraryMaterial, CreateMaterialDTO, UpdateMaterialDTO } from '../types/material';

export function useMaterials() {
    const materials = ref<LibraryMaterial[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 50
    });

    const fetchMaterials = async (params: {
        workstationId?: number | null;
        search?: string;
        category?: string;
        page?: number;
        with_trashed?: boolean;
    } = {}) => {
        loading.value = true;
        error.value = null;
        try {
            let url = '/api/materials-library/materials';
            if (params.workstationId) {
                url = `/api/materials-library/materials/workstation/${params.workstationId}`;
            }

            const response = await api.get(url, { params });

            // Handle both paginated and non-paginated responses slightly differently if needed
            // The controller returns paginated for index and byWorkstation (if updated to paginate)
            // Current controller: index is paginated, byWorkstation is not (collection resource)

            if (response.data.data && Array.isArray(response.data.data)) {
                materials.value = response.data.data;
                if (response.data.meta) {
                    pagination.value = {
                        currentPage: response.data.meta.current_page,
                        lastPage: response.data.meta.last_page,
                        total: response.data.meta.total,
                        perPage: response.data.meta.per_page,
                    };
                }
            } else if (response.data.current_page) {
                // Standard pagination response without 'data' wrapper for collection resource
                materials.value = response.data.data;
                pagination.value = {
                    currentPage: response.data.current_page,
                    lastPage: response.data.last_page,
                    total: response.data.total,
                    perPage: response.data.per_page,
                };
            } else {
                // Fallback
                materials.value = response.data;
            }

        } catch (e: any) {
            if (e.response && e.response.data) {
                error.value = e.response.data.message || e.response.data.error || e.message;
            } else {
                error.value = e.message || 'Failed to fetch materials';
            }
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    const createMaterial = async (data: CreateMaterialDTO) => {
        loading.value = true;
        try {
            const response = await api.post('/api/materials-library/materials', data);
            materials.value.unshift(response.data.data);
            return response.data.data;
        } catch (e: any) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateMaterial = async (id: number, data: UpdateMaterialDTO) => {
        loading.value = true;
        try {
            const response = await api.put(`/api/materials-library/materials/${id}`, data);
            const index = materials.value.findIndex(m => m.id === id);
            if (index !== -1) {
                materials.value[index] = response.data.data;
            }
            return response.data.data;
        } catch (e: any) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteMaterial = async (id: number) => {
        loading.value = true;
        try {
            await api.delete(`/api/materials-library/materials/${id}`);
            materials.value = materials.value.filter(m => m.id !== id);
        } catch (e: any) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const restoreMaterial = async (id: number) => {
        loading.value = true;
        try {
            const response = await api.post(`/api/materials-library/materials/${id}/restore`);
            return response.data;
        } catch (e: any) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const forceDeleteMaterial = async (id: number) => {
        loading.value = true;
        try {
            await api.delete(`/api/materials-library/materials/${id}/force`);
            materials.value = materials.value.filter(m => m.id !== id);
        } catch (e: any) {
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchTrashedMaterials = async (search?: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/api/materials-library/materials/trashed', {
                params: { search }
            });
            materials.value = response.data.data;
            return response.data.data;
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch trashed materials';
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        materials,
        loading,
        error,
        pagination,
        fetchMaterials,
        fetchTrashedMaterials,
        createMaterial,
        updateMaterial,
        deleteMaterial,
        restoreMaterial,
        forceDeleteMaterial,
    };
}
