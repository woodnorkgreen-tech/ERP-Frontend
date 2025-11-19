import axios from '@/plugins/axios'
import type { BudgetAddition, CreateBudgetAdditionData } from '../types/budget'

/**
 * Material data structure for creating budget additions from materials
 */
interface MaterialData {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
}

/**
 * Frontend service for managing budget additions
 */
export class BudgetAdditionService {

  /**
   * Get all budget additions for a task
   */
  static async getForTask(taskId: number): Promise<BudgetAddition[]> {
    const response = await axios.get(`/api/projects/tasks/${taskId}/budget/additions`)
    return response.data.data
  }

  /**
   * Create a new budget addition
   */
  static async create(taskId: number, data: CreateBudgetAdditionData): Promise<BudgetAddition> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/budget/additions`, data)
    return response.data.data
  }

  /**
   * Approve a budget addition
   */
  static async approve(taskId: number, additionId: string, notes?: string): Promise<BudgetAddition> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/budget/additions/${additionId}/approve`, {
      notes
    })
    return response.data.data
  }

  /**
   * Reject a budget addition
   */
  static async reject(taskId: number, additionId: string, reason?: string): Promise<BudgetAddition> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/budget/additions/${additionId}/reject`, {
      reason
    })
    return response.data.data
  }

  /**
   * Create a budget addition from a materials task material
   */
  static async createFromMaterial(taskId: number, material: MaterialData, budgetType: 'main' | 'supplementary'): Promise<BudgetAddition> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/budget/additions/from-material`, {
      material: material,
      budget_type: budgetType
    })
    return response.data.data
  }
}
