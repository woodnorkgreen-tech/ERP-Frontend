import type { Workstation } from './workstation';

export interface LibraryMaterial {
    id: number;
    workstation_id: number;
    workstation?: Workstation;
    material_code: string;
    material_name: string;
    category: string | null;
    subcategory: string | null;
    unit_of_measure: string;
    unit_cost: number;
    attributes: Record<string, any>;
    is_active: boolean;
    notes: string | null;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;

    // Stock properties
    quantity_on_hand?: number;
    quantity_reserved?: number;
    available?: number;
    min_stock_level?: number;
    location?: string;
    workstation_name?: string;
}

export interface CreateMaterialDTO {
    workstation_id: number;
    material_code: string;
    material_name: string;
    category?: string;
    subcategory?: string;
    unit_of_measure: string;
    unit_cost?: number;
    attributes?: Record<string, any>;
    is_active?: boolean;
    notes?: string;
}

export interface UpdateMaterialDTO extends Partial<CreateMaterialDTO> { }
