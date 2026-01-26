import { ref, computed, reactive } from 'vue'
import { jobCardsService } from '../services/jobCards'
import type { 
  JobCard, 
  JobCardFilters, 
  CreateJobCardPayload, 
  UpdateJobCardPayload,
  TimeEntry,
  Technician,
  WorkCenter,
  TechnicianTimeReport,
  ProductionAnalytics
} from '../types'

export function useJobCards() {
  // State
  const jobCards = ref<JobCard[]>([])
  const currentJobCard = ref<JobCard | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const filters = reactive<JobCardFilters>({
    page: 1,
    per_page: 20
  })
  
  const pagination = ref({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 0
  })

  // Computed
  const filteredJobCards = computed(() => {
    return jobCards.value
  })

  const activeJobCards = computed(() => {
    return jobCards.value.filter(job => 
      job.status === 'in_progress' || job.status === 'released'
    )
  })

  const completedJobCards = computed(() => {
    return jobCards.value.filter(job => job.status === 'completed')
  })

  // Actions
  const fetchJobCards = async (newFilters?: JobCardFilters) => {
    loading.value = true
    error.value = null
    
    try {
      if (newFilters) {
        Object.assign(filters, newFilters)
      }
      
      const response = await jobCardsService.getJobCards(filters)
      
      if (response.success) {
        jobCards.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page,
          per_page: response.data.per_page,
          total: response.data.total,
          last_page: Math.ceil(response.data.total / response.data.per_page)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch job cards'
    } finally {
      loading.value = false
    }
  }

  const fetchJobCard = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.getJobCard(id)
      
      if (response.success) {
        currentJobCard.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch job card'
    } finally {
      loading.value = false
    }
  }

  const createJobCard = async (payload: CreateJobCardPayload) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.createJobCard(payload)
      
      if (response.success) {
        await fetchJobCards()
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create job card'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateJobCard = async (id: number, payload: UpdateJobCardPayload) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.updateJobCard(id, payload)
      
      if (response.success) {
        if (currentJobCard.value?.id === id) {
          currentJobCard.value = response.data
        }
        await fetchJobCards()
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update job card'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteJobCard = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.deleteJobCard(id)
      
      if (response.success) {
        await fetchJobCards()
        if (currentJobCard.value?.id === id) {
          currentJobCard.value = null
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete job card'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Job Card Status Actions
  const releaseJobCard = async (id: number) => {
    try {
      const response = await jobCardsService.releaseJobCard(id)
      if (response.success) {
        await fetchJobCards()
        if (currentJobCard.value?.id === id) {
          currentJobCard.value = response.data
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to release job card'
      throw err
    }
  }

  const startJobCard = async (id: number) => {
    try {
      const response = await jobCardsService.startJobCard(id)
      if (response.success) {
        await fetchJobCards()
        if (currentJobCard.value?.id === id) {
          currentJobCard.value = response.data
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start job card'
      throw err
    }
  }

  const completeJobCard = async (id: number) => {
    try {
      const response = await jobCardsService.completeJobCard(id)
      if (response.success) {
        await fetchJobCards()
        if (currentJobCard.value?.id === id) {
          currentJobCard.value = response.data
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to complete job card'
      throw err
    }
  }

  const putOnHold = async (id: number, reason: string) => {
    try {
      const response = await jobCardsService.putJobCardOnHold(id, reason)
      if (response.success) {
        await fetchJobCards()
        if (currentJobCard.value?.id === id) {
          currentJobCard.value = response.data
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to put job card on hold'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    jobCards,
    currentJobCard,
    loading,
    error,
    filters,
    pagination,
    
    // Computed
    filteredJobCards,
    activeJobCards,
    completedJobCards,
    
    // Actions
    fetchJobCards,
    fetchJobCard,
    createJobCard,
    updateJobCard,
    deleteJobCard,
    releaseJobCard,
    startJobCard,
    completeJobCard,
    putOnHold,
    clearError
  }
}

export function useTimeTracking() {
  const timeEntries = ref<TimeEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentTimeEntry = ref<TimeEntry | null>(null)

  const clockIn = async (jobCardId: number, technicianId: number, workDescription: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.clockIn(jobCardId, technicianId, workDescription)
      
      if (response.success) {
        currentTimeEntry.value = response.data
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clock in'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clockOut = async (timeEntryId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.clockOut(timeEntryId)
      
      if (response.success) {
        currentTimeEntry.value = null
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clock out'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addBreakTime = async (timeEntryId: number, breakMinutes: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.addBreakTime(timeEntryId, breakMinutes)
      
      if (response.success) {
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add break time'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTimeEntries = async (jobCardId?: number, technicianId?: number, dateFrom?: string, dateTo?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.getTimeEntries(jobCardId, technicianId, dateFrom, dateTo)
      
      if (response.success) {
        timeEntries.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch time entries'
    } finally {
      loading.value = false
    }
  }

  return {
    timeEntries,
    loading,
    error,
    currentTimeEntry,
    clockIn,
    clockOut,
    addBreakTime,
    fetchTimeEntries
  }
}

export function useProductionReports() {
  const technicianReports = ref<TechnicianTimeReport[]>([])
  const analytics = ref<ProductionAnalytics | null>(null)
  const technicians = ref<Technician[]>([])
  const workCenters = ref<WorkCenter[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTechnicianReport = async (technicianId: number, period: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.getTechnicianTimeReport(technicianId, period)
      
      if (response.success) {
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch technician report'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAnalytics = async (period: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await jobCardsService.getProductionAnalytics(period)
      
      if (response.success) {
        analytics.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch analytics'
    } finally {
      loading.value = false
    }
  }

  const fetchTechnicians = async () => {
    try {
      const response = await jobCardsService.getTechnicians()
      
      if (response.success) {
        technicians.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch technicians'
    }
  }

  const fetchWorkCenters = async () => {
    try {
      const response = await jobCardsService.getWorkCenters()
      
      if (response.success) {
        workCenters.value = response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch work centers'
    }
  }

  return {
    technicianReports,
    analytics,
    technicians,
    workCenters,
    loading,
    error,
    fetchTechnicianReport,
    fetchAnalytics,
    fetchTechnicians,
    fetchWorkCenters
  }
}
