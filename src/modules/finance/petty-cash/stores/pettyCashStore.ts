import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    PettyCashTopUp,
    PettyCashDisbursement,
    PettyCashBalance,
    TransactionSummary,
    RecentTransaction,
    DisbursementFilters,
    TopUpFilters,
    PaymentMethod,
    Classification,
    DisbursementStatus,
} from '../types/pettyCash'
import type { DeepReadonly } from '../types/utils'
import type {
    CreateTopUpFormData,
    CreateDisbursementFormData,
    UpdateDisbursementFormData,
    VoidDisbursementFormData
} from '../types/forms'
import { pettyCashService } from '../services/pettyCashService'
import { useErrorHandler } from '../composables/useErrorHandler'
import {
    defaultBalance,
    defaultSummary,
    defaultPagination,
    mergeWithDefaults,
    createSafeArray
} from '../utils/defaults'
import {
    validateBalanceData,
    validateSummaryData,
    validateTopUpData,
    validateDisbursementData,
    validateArrayData
} from '../utils/validation'


export const usePettyCashStore = defineStore('pettyCash', () => {
    // Error handling composable
    const { handleError, clearError: clearErrorHandler, withErrorHandling, withRetry } = useErrorHandler()

    // State with safe defaults
    const disbursements = ref<PettyCashDisbursement[]>([])
    const topUps = ref<PettyCashTopUp[]>([])
    const transactions = ref<any[]>([]) // Unified flat transactions (top-ups and disbursements)
    const availableTopUps = ref<PettyCashTopUp[]>([])
    const currentBalance = ref<PettyCashBalance>(defaultBalance)
    const summary = ref<TransactionSummary>(defaultSummary)
    const recentTransactions = ref<RecentTransaction[]>([])
    const voucherData = ref<any>(null)

    // Enhanced loading states with safe defaults
    const loading = ref({
        disbursements: false,
        topUps: false,
        transactions: false,
        balance: false,
        summary: false,
        recent: false,
        voucher: false,
        creating: false,
        updating: false,
        voiding: false
    })

    // Enhanced error states with safe defaults
    const errors = ref({
        disbursements: null as string | null,
        topUps: null as string | null,
        transactions: null as string | null,
        balance: null as string | null,
        summary: null as string | null,
        recent: null as string | null,
        voucher: null as string | null,
        creating: null as string | null,
        updating: null as string | null,
        voiding: null as string | null
    })

    // Pagination with safe defaults
    const pagination = ref({
        disbursements: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: 0,
            to: 0
        },
        topUps: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: 0,
            to: 0
        },
        transactions: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
            from: 0,
            to: 0
        }
    })

    // Filters
    const activeFilters = ref({
        disbursements: {} as DisbursementFilters,
        topUps: {} as TopUpFilters
    })

    // Retry configuration
    const retryConfig = ref({
        maxRetries: 3,
        retryDelay: 1000,
        enableRetry: true
    })

    // Data validation flags
    const dataIntegrity = ref({
        lastValidated: null as Date | null,
        validationErrors: [] as string[],
        isDataStale: false
    })

    // Safe computed properties with error handling
    const activeDisbursements = computed(() => {
        try {
            return disbursements.value.filter(d => d?.status?.is_active === true)
        } catch (error) {
            return []
        }
    })

    const voidedDisbursements = computed(() => {
        try {
            return disbursements.value.filter(d => d?.status?.is_voided === true)
        } catch (error) {
            return []
        }
    })

    const topUpsWithBalance = computed(() => {
        try {
            return topUps.value.filter(t => t?.has_available_balance === true)
        } catch (error) {
            return []
        }
    })

    const fullyDisbursedTopUps = computed(() => {
        try {
            return topUps.value.filter(t => t?.is_fully_disbursed === true)
        } catch (error) {
            return []
        }
    })

    const totalDisbursementAmount = computed(() => {
        try {
            if (summary.value && typeof summary.value.total_disbursements === 'number') {
                return summary.value.total_disbursements
            }
            const validDisbursements = disbursements.value.filter(d =>
                d?.status?.is_active !== false && d?.status?.value !== 'voided'
            )
            return validDisbursements.reduce((sum, d) => sum + (d?.amount?.raw || 0), 0)
        } catch (error) {
            return 0
        }
    })

    const totalTopUpAmount = computed(() => {
        try {
            if (summary.value && typeof summary.value.total_top_ups === 'number') {
                return summary.value.total_top_ups
            }
            return topUps.value.reduce((sum, t) => sum + (t?.amount?.raw || 0), 0)
        } catch (error) {
            return 0
        }
    })

    const totalRemainingBalance = computed(() => {
        try {
            return topUps.value.reduce((sum, t) => {
                const balance = t?.remaining_balance?.raw || 0
                return sum + (typeof balance === 'number' ? balance : 0)
            }, 0)
        } catch (error) {
            return 0
        }
    })

    const safeCurrentBalance = computed(() => {
        try {
            return mergeWithDefaults(defaultBalance, currentBalance.value)
        } catch (error) {
            return defaultBalance
        }
    })

    const balanceStatus = computed(() => {
        try {
            return (safeCurrentBalance.value.status as any)?.value || 'normal'
        } catch (error) {
            return 'normal'
        }
    })

    const isBalanceLow = computed(() => {
        try {
            return (safeCurrentBalance.value.status as any)?.is_low === true
        } catch (error) {
            return false
        }
    })

    const isBalanceCritical = computed(() => {
        try {
            return (safeCurrentBalance.value.status as any)?.is_critical === true
        } catch (error) {
            return false
        }
    })

    const actualAvailableBalance = computed(() => {
        try {
            return (safeCurrentBalance.value.current_balance as any)?.raw ?? 0
        } catch (error) {
            return 0
        }
    })

    const getDisbursementById = computed(() => (id: number) => {
        try {
            return disbursements.value.find(d => d?.id === id) || null
        } catch (error) {
            return null
        }
    })

    const getTopUpById = computed(() => (id: number) => {
        try {
            return topUps.value.find(t => t?.id === id) || null
        } catch (error) {
            return null
        }
    })

    const isLoading = computed(() => {
        return Object.values(loading.value).some(l => l === true)
    })

    const hasErrors = computed(() => {
        return Object.values(errors.value).some(e => e !== null)
    })

    const isDataStale = computed(() => {
        try {
            const lastValidated = dataIntegrity.value.lastValidated
            if (!lastValidated) return true
            const staleThreshold = 5 * 60 * 1000 // 5 minutes
            return Date.now() - lastValidated.getTime() > staleThreshold
        } catch (error) {
            return true
        }
    })

    const hasValidationErrors = computed(() => {
        return dataIntegrity.value.validationErrors.length > 0
    })

    const validateAndSetDisbursements = (data: any[]): PettyCashDisbursement[] => {
        try {
            const { validItems, invalidItems, errors: validationErrors } = validateArrayData(data, validateDisbursementData)
            if (invalidItems.length > 0) {
                console.warn(`${invalidItems.length} invalid disbursements filtered out:`, validationErrors)
                dataIntegrity.value.validationErrors.push(`${invalidItems.length} invalid disbursements filtered`)
            }
            return validItems as PettyCashDisbursement[]
        } catch (error) {
            console.error('Error validating disbursements:', error)
            dataIntegrity.value.validationErrors.push('Disbursement validation failed')
            return []
        }
    }

    const validateAndSetBalance = (data: any): PettyCashBalance => {
        try {
            if (data && typeof data === 'object' && Object.values(data).some(value => Array.isArray(value))) {
                dataIntegrity.value.validationErrors.push('Server returned validation errors instead of balance data')
                return defaultBalance
            }
            const result = validateBalanceData(data)
            if (!result.isValid) {
                return mergeWithDefaults(defaultBalance, data) as unknown as PettyCashBalance
            }
            return (result.data || defaultBalance) as PettyCashBalance
        } catch (error) {
            dataIntegrity.value.validationErrors.push('Balance validation failed')
            return mergeWithDefaults(defaultBalance, data) as unknown as PettyCashBalance
        }
    }

    // Actions
    const fetchDisbursements = async (filters?: DisbursementFilters & { page?: number }) => {
        const operation = async () => {
            loading.value.disbursements = true
            errors.value.disbursements = null
            const response = await pettyCashService.getDisbursements(filters)
            if ('success' in response && response.success) {
                const transformedData = response.data.map((item: any) => {
                    const amountRaw = typeof item.amount === 'number' ? item.amount :
                        typeof item.amount === 'string' ? parseFloat(item.amount) :
                            (item.amount?.raw || 0);
                    return {
                        ...item,
                        amount: {
                            raw: amountRaw,
                            formatted: `KES ${amountRaw.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        },
                        transaction_cost: item.transaction_cost ? {
                            raw: parseFloat(item.transaction_cost),
                            formatted: `KES ${parseFloat(item.transaction_cost).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        } : null,
                        payment_method: {
                            value: (item.payment_method as unknown as PaymentMethod),
                            label: item.payment_method === 'cash' ? 'Cash' :
                                item.payment_method === 'mpesa' ? 'M-Pesa' :
                                    item.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                                        (item.payment_method || 'Other')
                        },
                        classification: {
                            value: (item.classification as unknown as Classification),
                            label: item.classification === 'admin' ? 'Admin' :
                                item.classification === 'agencies' ? 'Agencies' :
                                    item.classification === 'operations' ? 'Operations' :
                                        item.classification === 'event_planners' ? 'Event Planners' :
                                            item.classification === 'corporates' ? 'Corporates' :
                                                item.classification === 'crs' ? 'CRS' :
                                                    (item.classification || 'Other')
                        },
                        status: {
                            value: (item.status as unknown as DisbursementStatus) || 'active',
                            label: item.status === 'active' ? 'Active' : 'Voided',
                            is_active: (item.status || 'active') === 'active',
                            is_voided: (item.status || 'active') === 'voided'
                        },
                        created_at: {
                            raw: item.date_disbursed?.raw || String(item.created_at?.raw || item.created_at),
                            formatted: item.date_disbursed?.formatted || new Date(item.created_at?.raw || item.created_at).toLocaleDateString('en-KE'),
                            human: item.created_at?.human || 'Recently'
                        },
                        updated_at: {
                            raw: String(item.updated_at || item.created_at),
                            formatted: new Date(item.updated_at || item.created_at).toLocaleDateString('en-KE'),
                            human: 'Recently'
                        },
                        can_edit: item.can_edit !== undefined ? item.can_edit : false,
                        can_void: item.can_void !== undefined ? item.can_void : false,
                        can_view_details: item.can_view_details !== undefined ? item.can_view_details : true
                    }
                })
                const validatedData = validateAndSetDisbursements(transformedData)
                disbursements.value = validatedData as PettyCashDisbursement[]
                pagination.value.disbursements = { ...defaultPagination, ...response.meta }
                if (filters) activeFilters.value.disbursements = filters
                dataIntegrity.value.lastValidated = new Date()
                return validatedData
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'fetchDisbursements', filters })
        if (!result) {
            errors.value.disbursements = 'Failed to fetch disbursements'
            disbursements.value = []
        }
        loading.value.disbursements = false
        return result
    }

    const createDisbursement = async (data: CreateDisbursementFormData) => {
        const operation = async () => {
            loading.value.creating = true
            errors.value.creating = null
            const response = await pettyCashService.createDisbursement(data)
            if ('success' in response && response.success) {
                const rawData = response.data as any
                const amountRaw = typeof rawData.amount === 'number' ? rawData.amount :
                    typeof rawData.amount === 'string' ? parseFloat(rawData.amount) :
                        (rawData.amount?.raw || 0);
                const transformedDisbursement = {
                    ...rawData,
                    amount: {
                        raw: amountRaw,
                        formatted: `KES ${amountRaw.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    transaction_cost: rawData.transaction_cost ? {
                        raw: parseFloat(rawData.transaction_cost),
                        formatted: `KES ${parseFloat(rawData.transaction_cost).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    } : null,
                    payment_method: {
                        value: (rawData.payment_method as unknown as PaymentMethod),
                        label: rawData.payment_method === 'cash' ? 'Cash Account' :
                            rawData.payment_method === 'mpesa' ? 'M-Pesa' :
                                rawData.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                                    'Other'
                    },
                    classification: {
                        value: (rawData.classification as unknown as Classification),
                        label: rawData.classification === 'admin' ? 'Admin' :
                            rawData.classification === 'agencies' ? 'Agencies' :
                                rawData.classification === 'operations' ? 'Operations' :
                                    rawData.classification === 'event_planners' ? 'Event Planners' :
                                        rawData.classification === 'corporates' ? 'Corporates' :
                                            rawData.classification === 'crs' ? 'CRS' :
                                                'Other'
                    },
                    status: {
                        value: (rawData.status as unknown as DisbursementStatus) || 'active',
                        label: rawData.status === 'active' ? 'Active' : 'Voided',
                        is_active: (rawData.status || 'active') === 'active',
                        is_voided: (rawData.status || 'active') === 'voided'
                    },
                    created_at: {
                        raw: String(rawData.created_at),
                        formatted: new Date(rawData.created_at).toLocaleDateString('en-KE'),
                        human: 'Just now'
                    },
                    updated_at: {
                        raw: String(rawData.updated_at || rawData.created_at),
                        formatted: new Date(rawData.updated_at || rawData.created_at).toLocaleDateString('en-KE'),
                        human: 'Just now'
                    },
                    can_edit: true,
                    can_void: true,
                    can_view_details: true
                } as unknown as PettyCashDisbursement
                disbursements.value.unshift(transformedDisbursement)
                await Promise.all([fetchCurrentBalance(), fetchSummary()])
                dataIntegrity.value.lastValidated = new Date()
                return transformedDisbursement
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'createDisbursement', formData: data })
        if (!result) {
            errors.value.creating = 'Failed to create disbursement'
            throw new Error('Failed to create disbursement')
        }
        loading.value.creating = false
        return result
    }

    const updateDisbursement = async (id: number, data: UpdateDisbursementFormData) => {
        const operation = async () => {
            loading.value.updating = true
            errors.value.updating = null
            const response = await pettyCashService.updateDisbursement(id, data)
            if ('success' in response && response.success) {
                const validationResult = validateDisbursementData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) disbursements.value[index] = validationResult.data
                    await Promise.all([fetchCurrentBalance(), fetchSummary()])
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) disbursements.value[index] = response.data
                    return response.data
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'updateDisbursement', disbursementId: id, formData: data })
        if (!result) {
            errors.value.updating = 'Failed to update disbursement'
            throw new Error('Failed to update disbursement')
        }
        loading.value.updating = false
        return result
    }

    const voidDisbursement = async (id: number, data: VoidDisbursementFormData) => {
        const operation = async () => {
            loading.value.voiding = true
            errors.value.voiding = null
            const response = await pettyCashService.voidDisbursement(id, data)
            if ('success' in response && response.success) {
                const validationResult = validateDisbursementData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) disbursements.value[index] = validationResult.data
                    await Promise.all([fetchCurrentBalance(), fetchSummary()])
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    const index = disbursements.value.findIndex(d => d.id === id)
                    if (index !== -1) disbursements.value[index] = response.data
                    return response.data
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'voidDisbursement', disbursementId: id, voidData: data })
        if (!result) {
            errors.value.voiding = 'Failed to void disbursement'
            throw new Error('Failed to void disbursement')
        }
        loading.value.voiding = false
        return result
    }

    const deleteDisbursement = async (id: number) => {
        const operation = async () => {
            loading.value.updating = true
            const response = await pettyCashService.deleteDisbursement(id)
            if (response && response.success) {
                const index = disbursements.value.findIndex(d => d.id === id)
                if (index !== -1) disbursements.value.splice(index, 1)
                await Promise.all([fetchCurrentBalance(), fetchSummary()])
                dataIntegrity.value.lastValidated = new Date()
                return true
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'deleteDisbursement', disbursementId: id })
        loading.value.updating = false
        return result
    }

    const bulkDeleteDisbursements = async (ids: number[]) => {
        const operation = async () => {
            loading.value.updating = true
            const response = await pettyCashService.bulkDeleteDisbursements(ids)
            if (response && response.success) {
                disbursements.value = disbursements.value.filter(d => !ids.includes(d.id))
                await Promise.all([fetchCurrentBalance(), fetchSummary()])
                dataIntegrity.value.lastValidated = new Date()
                return response.data
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'bulkDeleteDisbursements', ids })
        loading.value.updating = false
        return result
    }

    const clearAllPettyCashData = async () => {
        const operation = async () => {
            loading.value.updating = true
            const response = await pettyCashService.clearAllData()
            if (response && response.success) {
                clearData()
                await refreshAll()
                dataIntegrity.value.lastValidated = new Date()
                return response.data
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'clearAllPettyCashData' })
        loading.value.updating = false
        return result
    }

    const fetchTopUps = async (filters?: TopUpFilters & { page?: number }) => {
        const operation = async () => {
            loading.value.topUps = true
            errors.value.topUps = null
            const response = await pettyCashService.getTopUps(filters)
            if ('success' in response && response.success) {
                const transformedData = response.data.map((item: any) => ({
                    ...item,
                    amount: {
                        raw: parseFloat(item.amount || 0),
                        formatted: `KES ${parseFloat(item.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    payment_method: {
                        value: item.payment_method,
                        label: item.payment_method || 'Other'
                    },
                    remaining_balance: {
                        raw: parseFloat(item.remaining_balance || item.amount || 0),
                        formatted: `KES ${parseFloat(item.remaining_balance || item.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    created_at: {
                        raw: item.date_topped_up?.raw || item.created_at?.raw || item.created_at,
                        formatted: item.date_topped_up?.formatted || new Date(item.created_at?.raw || item.created_at).toLocaleDateString('en-KE'),
                        human: item.created_at?.human || 'Recently'
                    }
                }))
                const { validItems } = validateArrayData(transformedData, validateTopUpData)
                topUps.value = validItems as PettyCashTopUp[]
                pagination.value.topUps = { ...defaultPagination, ...response.meta }
                if (filters) activeFilters.value.topUps = filters
                dataIntegrity.value.lastValidated = new Date()
                return validItems
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'fetchTopUps', filters })
        if (!result) {
            errors.value.topUps = 'Failed to fetch top-ups'
            topUps.value = []
        }
        loading.value.topUps = false
        return result
    }

    const fetchAvailableTopUps = async () => {
        const operation = async () => {
            loading.value.topUps = true
            errors.value.topUps = null
            const response = await pettyCashService.getAvailableTopUps()
            if ('success' in response && response.success) {
                const { validItems } = validateArrayData(response.data || [], validateTopUpData)
                availableTopUps.value = [...(validItems as any[])]
                dataIntegrity.value.lastValidated = new Date()
                return validItems
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'fetchAvailableTopUps' })
        if (!result) {
            errors.value.topUps = 'Failed to fetch available top-ups'
            availableTopUps.value = []
        }
        loading.value.topUps = false
        return result
    }

    const createTopUp = async (data: CreateTopUpFormData) => {
        const operation = async () => {
            loading.value.creating = true
            errors.value.creating = null
            const response = await pettyCashService.createTopUp(data)
            if ('success' in response && response.success) {
                const validationResult = validateTopUpData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    topUps.value.unshift(validationResult.data)
                    await Promise.all([fetchCurrentBalance(), fetchSummary(), fetchAvailableTopUps()])
                    dataIntegrity.value.lastValidated = new Date()
                    return validationResult.data
                } else {
                    topUps.value.unshift(response.data)
                    return response.data
                }
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'createTopUp', formData: data })
        if (!result) {
            errors.value.creating = 'Failed to create top-up'
            throw new Error('Failed to create top-up')
        }
        loading.value.creating = false
        return result
    }

    const uploadExcel = async (formData: FormData) => {
        const operation = async () => {
            loading.value.creating = true
            errors.value.creating = null
            const response = await pettyCashService.uploadExcel(formData)
            if ('success' in response && response.success) {
                await refreshAll()
                dataIntegrity.value.lastValidated = new Date()
                return response
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'uploadExcel' })
        if (!result) {
            errors.value.creating = 'Failed to upload Excel file'
            throw new Error('Failed to upload Excel file')
        }
        loading.value.creating = false
        return result
    }

    const fetchTransactions = async (filters?: any & { page?: number }) => {
        const operation = async () => {
            loading.value.transactions = true
            errors.value.transactions = null
            const response = await pettyCashService.getTransactions(filters)
            if ('success' in response && response.success) {
                const transformedData = response.data.map((item: any) => ({
                    ...item,
                    id: `${item.type}-${item.id}`, // Ensure globally unique IDs
                    original_id: item.id,
                    amount: {
                        raw: parseFloat(item.amount || 0),
                        formatted: `KES ${parseFloat(item.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    },
                    transaction_cost: item.transaction_cost ? {
                        raw: parseFloat(item.transaction_cost),
                        formatted: `KES ${parseFloat(item.transaction_cost).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    } : null,
                    payment_method: {
                        value: item.payment_method,
                        label: item.payment_method === 'cash' ? 'Cash' :
                            item.payment_method === 'mpesa' ? 'M-Pesa' :
                                item.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                                    item.payment_method || 'Other'
                    },
                    classification: item.classification ? {
                        value: item.classification,
                        label: item.classification === 'admin' ? 'Admin' :
                            item.classification === 'agencies' ? 'Agencies' :
                                item.classification === 'operations' ? 'Operations' :
                                    item.classification === 'event_planners' ? 'Event Planners' :
                                        item.classification === 'corporates' ? 'Corporates' :
                                            item.classification === 'crs' ? 'CRS' :
                                                item.classification || 'Other'
                    } : null,
                    status: {
                        value: item.status || 'active',
                        label: item.status === 'active' ? 'Active' : 'Voided',
                        is_active: (item.status || 'active') === 'active',
                        is_voided: (item.status || 'active') === 'voided'
                    },
                    created_at: {
                        raw: item.transaction_date || item.created_at,
                        formatted: new Date(item.transaction_date || item.created_at).toLocaleDateString('en-KE'),
                        human: 'Recently'
                    },
                    // Include permission fields
                    can_edit: item.can_edit !== undefined ? item.can_edit : (item.type === 'disbursement'),
                    can_void: item.can_void !== undefined ? item.can_void : (item.type === 'disbursement' && item.status === 'active'),
                    can_delete: true,
                    original_data: item
                }))
                transactions.value = transformedData
                pagination.value.transactions = { ...defaultPagination, ...response.meta }
                dataIntegrity.value.lastValidated = new Date()
                return transformedData
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'fetchTransactions', filters })
        if (!result) {
            errors.value.transactions = 'Failed to fetch transactions'
            transactions.value = []
        }
        loading.value.transactions = false
        return result
    }

    const fetchSummary = async (filters?: DisbursementFilters) => {
        const operation = async () => {
            loading.value.summary = true
            errors.value.summary = null
            const response = await pettyCashService.getSummary(filters)
            if ('success' in response && response.success) {
                const validationResult = validateSummaryData(response.data)
                if (validationResult.isValid && validationResult.data) {
                    summary.value = (validationResult.data as any)
                } else {
                    summary.value = mergeWithDefaults(defaultSummary as any, response.data as any) as any
                }
                dataIntegrity.value.lastValidated = new Date()
                return summary.value
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'fetchSummary', filters })
        if (!result) {
            errors.value.summary = 'Failed to fetch summary'
            summary.value = defaultSummary
        }
        loading.value.summary = false
        return result
    }

    const fetchRecentTransactions = async (limit: number = 10) => {
        const operation = async () => {
            loading.value.recent = true
            errors.value.recent = null
            const response = await pettyCashService.getRecentTransactions(limit)
            if ('success' in response && response.success) {
                const defaultRecent: DeepReadonly<RecentTransaction> = {
                    id: 0,
                    type: 'top_up',
                    amount: 0,
                    description: '',
                    created_at: new Date().toISOString(),
                    creator: 'Unknown'
                }
                const validatedData = createSafeArray<RecentTransaction>(response.data, defaultRecent)
                recentTransactions.value = (validatedData as unknown as RecentTransaction[])
                dataIntegrity.value.lastValidated = new Date()
                return recentTransactions.value
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'fetchRecentTransactions', limit })
        if (!result) {
            errors.value.recent = 'Failed to fetch recent transactions'
            recentTransactions.value = []
        }
        loading.value.recent = false
        return result
    }

    const fetchCurrentBalance = async () => {
        const operation = async () => {
            loading.value.balance = true
            errors.value.balance = null
            const response = await pettyCashService.getCurrentBalance()
            if ('success' in response && response.success) {
                const validatedBalance = validateAndSetBalance(response.data)
                currentBalance.value = validatedBalance
                dataIntegrity.value.lastValidated = new Date()
                return validatedBalance
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withRetry(operation, { context: 'fetchCurrentBalance' })
        if (!result) {
            errors.value.balance = 'Failed to fetch current balance'
            currentBalance.value = defaultBalance
        }
        loading.value.balance = false
        return result
    }

    const recalculateBalance = async () => {
        const operation = async () => {
            loading.value.balance = true
            errors.value.balance = null
            const response = await pettyCashService.recalculateBalance()
            if ('success' in response && response.success) {
                await Promise.all([fetchCurrentBalance(), fetchSummary(), fetchTransactions()])
                return response.data
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        const result = await withErrorHandling(operation, { context: 'recalculateBalance', showToast: true })
        loading.value.balance = false
        return result
    }

    const archiveTransaction = async (id: number, type: 'disbursement' | 'top_up') => {
        const operation = async () => {
            const response = await pettyCashService.archiveTransaction(id, type)
            if ('success' in response && response.success) {
                await fetchTransactions()
                return response
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        return await withErrorHandling(operation, { context: 'archiveTransaction', id, type })
    }

    const bulkArchiveTransactions = async (ids: number[]) => {
        const operation = async () => {
            const response = await pettyCashService.bulkArchiveTransactions(ids)
            if ('success' in response && response.success) {
                await fetchTransactions()
                return response
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        return await withErrorHandling(operation, { context: 'bulkArchiveTransactions', ids })
    }

    const archiveTransactionGroup = async (topUpId: number) => {
        const operation = async () => {
            const response = await pettyCashService.archiveTransactionGroup(topUpId)
            if ('success' in response && response.success) {
                await fetchTransactions()
                return response
            } else {
                throw new Error(pettyCashService.getErrorMessage(response))
            }
        }
        return await withErrorHandling(operation, { context: 'archiveTransactionGroup', topUpId })
    }

    const refreshDashboard = async () => {
        const operation = async () => {
            const results = await Promise.allSettled([
                fetchCurrentBalance(),
                fetchRecentTransactions(),
                fetchSummary()
            ])
            return results
        }
        return await withErrorHandling(operation, { context: 'refreshDashboard' })
    }

    const refreshAll = async () => {
        const operation = async () => {
            const results = await Promise.allSettled([
                fetchDisbursements(activeFilters.value.disbursements),
                fetchTopUps(activeFilters.value.topUps),
                fetchTransactions(),
                fetchAvailableTopUps(),
                refreshDashboard()
            ])
            validateDataIntegrity()
            return results
        }
        return await withErrorHandling(operation, { context: 'refreshAll' })
    }

    const validateDataIntegrity = () => {
        dataIntegrity.value.validationErrors = []
        try {
            if (currentBalance.value && !validateBalanceData(currentBalance.value).isValid) {
                dataIntegrity.value.validationErrors.push('Balance data integrity issue')
            }
            if (summary.value && !validateSummaryData(summary.value).isValid) {
                dataIntegrity.value.validationErrors.push('Summary data integrity issue')
            }
            dataIntegrity.value.lastValidated = new Date()
            return dataIntegrity.value.validationErrors.length === 0
        } catch (error) {
            return false
        }
    }

    const clearError = (type?: keyof typeof errors.value) => {
        if (type) errors.value[type] = null
        else Object.keys(errors.value).forEach(key => { errors.value[key as keyof typeof errors.value] = null })
        clearErrorHandler()
    }

    const clearData = () => {
        disbursements.value = []
        topUps.value = []
        transactions.value = []
        availableTopUps.value = []
        currentBalance.value = defaultBalance
        summary.value = defaultSummary
        recentTransactions.value = []
        voucherData.value = null
    }

    const resetStore = () => {
        clearData()
        clearError()
        loading.value = {
            disbursements: false, topUps: false, transactions: false, balance: false,
            summary: false, recent: false, creating: false, updating: false,
            voiding: false, voucher: false
        }
    }

    return {
        disbursements, topUps, transactions, availableTopUps, currentBalance,
        summary, recentTransactions, voucherData, loading, errors,
        pagination, activeFilters, retryConfig, dataIntegrity,
        activeDisbursements, voidedDisbursements, topUpsWithBalance,
        fullyDisbursedTopUps, totalDisbursementAmount, totalTopUpAmount,
        totalRemainingBalance, safeCurrentBalance, actualAvailableBalance,
        balanceStatus, isBalanceLow, isBalanceCritical, getDisbursementById,
        getTopUpById, isLoading, hasErrors, isDataStale, hasValidationErrors,
        fetchDisbursements, createDisbursement, updateDisbursement,
        voidDisbursement, deleteDisbursement, bulkDeleteDisbursements,
        clearAllPettyCashData, fetchTopUps, fetchTransactions,
        fetchAvailableTopUps, createTopUp, uploadExcel, fetchCurrentBalance,
        recalculateBalance, fetchSummary, fetchRecentTransactions, archiveTransaction,
        bulkArchiveTransactions, archiveTransactionGroup,
        clearError, clearData, resetStore, validateDataIntegrity,
        refreshDashboard, refreshAll,
        debugStoreState: () => {
            console.log('🔍 Store Debug State:', {
                disbursements: disbursements.value.length,
                topUps: topUps.value.length,
                balance: currentBalance.value,
                loading: loading.value
            })
        }
    }
})