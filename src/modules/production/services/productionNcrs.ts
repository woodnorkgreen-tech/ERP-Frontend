import Network from '@/network-class'
import type { ProductionNcr, ProductionNcrReferenceData } from '../types'

export class ProductionNcrsService {
  private baseUrl = '/api/production/ncrs'

  async getNcrs(params: Record<string, string | number | undefined> = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value))
      }
    })

    const suffix = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return Network.get(`${this.baseUrl}${suffix}`)
  }

  async getNcr(ncrId: number) {
    return Network.get(`${this.baseUrl}/${ncrId}`)
  }

  async createNcr(payload: Partial<ProductionNcr>) {
    return Network.store(this.baseUrl, payload)
  }

  async updateNcr(ncrId: number, payload: Partial<ProductionNcr>) {
    return Network.update(`${this.baseUrl}/${ncrId}`, payload)
  }

  async assignNcr(ncrId: number, payload: {
    assigned_to_user_id?: number | null
    assigned_department?: string | null
    assigned_workstation?: string | null
    assignment_role?: string | null
    notes?: string | null
    due_date?: string | null
  }) {
    return Network.store(`${this.baseUrl}/${ncrId}/assign`, payload)
  }

  async requestReinspection(ncrId: number) {
    return Network.store(`${this.baseUrl}/${ncrId}/request-reinspection`, {})
  }

  async closeNcr(ncrId: number, payload: {
    closure_type: 'permanent_fix' | 'concession' | 'containment_only'
    verification_result: 'passed' | 'failed' | 'conditional'
    closure_summary: string
    effectiveness_note?: string | null
    effectiveness_review_required?: boolean
    effectiveness_review_date?: string | null
    lessons_learned?: string | null
  }) {
    return Network.store(`${this.baseUrl}/${ncrId}/close`, payload)
  }

  async getReferenceData(): Promise<{ success: boolean; data: ProductionNcrReferenceData }> {
    return Network.get(`${this.baseUrl}/reference-data`)
  }

  async uploadImage(ncrId: number, image: File) {
    const formData = new FormData()
    formData.append('image', image)
    return Network.store(`${this.baseUrl}/${ncrId}/upload-image`, formData)
  }
}

export const productionNcrsService = new ProductionNcrsService()
