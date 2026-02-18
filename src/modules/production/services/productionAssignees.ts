import Network from '@/network-class'

export class ProductionAssigneesService {
  private baseUrl = '/api/production/assignees'

  async searchAssignees(query: string) {
    const params = new URLSearchParams()
    if (query) params.append('search', query)
    return Network.get(`${this.baseUrl}?${params.toString()}`)
  }
}

export const productionAssigneesService = new ProductionAssigneesService()
