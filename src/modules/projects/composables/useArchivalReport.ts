import { ref, type Ref } from 'vue'
import api from '@/plugins/axios'

export interface ArchivalReportData {
    id?: number
    enquiry_task_id?: number
    // Section 1: Project Information
    client_name?: string
    project_code?: string
    project_officer?: string
    start_date?: string
    end_date?: string
    site_location?: string
    // Section 2: Project Deliverables
    project_scope?: string
    // Section 3: Procurement
    materials_mrf_attached?: boolean
    items_sourced_externally?: string
    procurement_challenges?: string
    // Section 4: Fabrication
    production_start_date?: string
    packaging_labeling_status?: string
    materials_used_in_production?: string
    // Section 5: Team & Setup
    team_captain?: string
    setup_team_assigned?: string
    branding_team_assigned?: string
    all_deliverables_available?: boolean
    setup_aligned_to_schedule?: boolean
    delays_occurred?: boolean
    delay_reasons?: string
    deliverables_checked?: boolean
    site_organization?: 'excellent' | 'good' | 'fair' | 'poor'
    cleanliness_rating?: 'excellent' | 'good' | 'fair' | 'poor'
    general_findings?: string
    site_readiness_notes?: string
    // Section 6: Client Handover
    handover_date?: string
    client_rating?: string
    client_remarks?: string
    print_clarity_rating?: 'good' | 'fair' | 'poor' | 'n/a'
    printworks_accuracy_rating?: 'good' | 'fair' | 'poor' | 'n/a'
    installation_precision_comments?: string
    setup_speed_flow?: 'good' | 'fair' | 'poor'
    team_coordination?: 'good' | 'fair' | 'poor'
    efficiency_remarks?: string
    client_kept_informed?: boolean
    client_satisfaction?: 'satisfied' | 'unsatisfied' | 'n/a'
    communication_comments?: string
    delivered_on_schedule?: boolean
    delivery_condition?: 'good' | 'fair' | 'poor'
    delivery_issues?: boolean
    delivery_notes?: string
    team_professionalism?: 'good' | 'fair' | 'poor'
    client_confidence?: boolean
    professionalism_feedback?: string
    recommendations_action_points?: string
    // Section 7: Set-Down
    setdown_date?: string
    items_condition_returned?: string
    site_clearance_status?: string
    outstanding_items?: string
    // Record Management
    archive_reference?: string
    archive_location?: string
    retention_period?: string
    // Section 8: Attachments
    attachments?: any[]
    attachment_urls?: any[]
    // Checklist
    checklist_ppt?: boolean
    checklist_cutlist?: boolean
    checklist_site_survey_form?: boolean
    checklist_project_budget_file?: boolean
    checklist_material_list?: boolean
    checklist_qc_checklist?: boolean
    checklist_setup_setdown?: boolean
    checklist_client_feedback?: boolean
    // Section 9: Signatures
    project_officer_signature?: string
    project_officer_sign_date?: string
    reviewed_by?: string
    reviewer_sign_date?: string
    // Status
    status?: 'draft' | 'submitted' | 'approved'
    created_at?: string
    updated_at?: string
    // Related data
    setup_items?: SetupItem[]
    item_placements?: ItemPlacement[]
    system_documents?: any[]
}

export interface SetupItem {
    id?: number
    deliverable_item?: string
    assigned_technician?: string
    site_section?: string
    status?: 'set' | 'pending'
    notes?: string
}

export interface ItemPlacement {
    id?: number
    section_area?: string
    items_installed?: string
    placement_accuracy?: 'correct' | 'needs_adjusted'
    observation?: string
}

export function useArchivalReport() {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    const getReport = async (taskId: number): Promise<ArchivalReportData | null> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/archival`)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch archival report'
            throw err
        } finally {
            loading.value = false
        }
    }

    const createReport = async (taskId: number, data: ArchivalReportData): Promise<ArchivalReportData> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/archival`, data)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create archival report'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateReport = async (taskId: number, reportId: number, data: ArchivalReportData): Promise<ArchivalReportData> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.put(`/api/projects/tasks/${taskId}/archival/${reportId}`, data)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update archival report'
            throw err
        } finally {
            loading.value = false
        }
    }

    const uploadAttachment = async (taskId: number, reportId: number, file: File, category: string): Promise<any> => {
        loading.value = true
        error.value = null

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('category', category)

            const response = await api.post(`/api/projects/tasks/${taskId}/archival/${reportId}/attachments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to upload attachment'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteAttachment = async (taskId: number, reportId: number, attachmentId: string): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            await api.delete(`/api/projects/tasks/${taskId}/archival/${reportId}/attachments/${attachmentId}`)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete attachment'
            throw err
        } finally {
            loading.value = false
        }
    }

    const autoPopulate = async (taskId: number): Promise<Partial<ArchivalReportData>> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/archival/auto-populate`)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to auto-populate data'
            throw err
        } finally {
            loading.value = false
        }
    }

    const changeStatus = async (taskId: number, reportId: number, status: 'draft' | 'submitted' | 'approved'): Promise<ArchivalReportData> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.post(`/api/projects/tasks/${taskId}/archival/${reportId}/status`, { status })
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to change status'
            throw err
        } finally {
            loading.value = false
        }
    }

    const downloadPdf = async (taskId: number, reportId: number): Promise<void> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/archival/${reportId}/pdf`, {
                responseType: 'blob'
            })
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `archival-report-${reportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to download PDF'
            throw err
        } finally {
            loading.value = false
        }
    }

    const analyzeReport = async (taskId: number, reportId: number): Promise<any> => {
        loading.value = true
        error.value = null

        try {
            const response = await api.get(`/api/projects/tasks/${taskId}/archival/${reportId}/analyze`)
            return response.data.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to analyze report'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        getReport,
        createReport,
        updateReport,
        uploadAttachment,
        deleteAttachment,
        autoPopulate,
        changeStatus,
        downloadPdf,
        analyzeReport,
    }
}
