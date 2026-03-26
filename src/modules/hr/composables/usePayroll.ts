import { ref } from 'vue'
import { useApi } from '../../admin/shared/composables/useApi'
import type { PayrollVariable, PayrollLedger, PayrollTaxBand, BatchProcessResult, Payslip } from '../types/payroll'

export function usePayroll() {
    const loading = ref(false)
    const variables = ref<PayrollVariable[]>([])
    const ledgers = ref<PayrollLedger[]>([])
    const taxBands = ref<PayrollTaxBand[]>([])
    const payslips = ref<Payslip[]>([])
    const complianceSummary = ref<any>(null)
    const error = ref<string | null>(null)
    const { get, post, put, delete: deleteApi } = useApi()

    const fetchVariables = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await get('/api/hr/payroll/variables')
            variables.value = data as unknown as PayrollVariable[]
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch payroll variables'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const saveVariable = async (payload: Partial<PayrollVariable>) => {
        loading.value = true
        error.value = null
        try {
            const data = await post('/api/hr/payroll/variables', payload as Record<string, any>)
            await fetchVariables()
            return data
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to save variable'
            console.error(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const toggleVariable = async (id: number) => {
        try {
            await put(`/api/hr/payroll/variables/${id}/toggle`, {})
            await fetchVariables()
        } catch (e) {
            console.error('Failed to toggle variable', e)
        }
    }

    const fetchLedgers = async (params?: { employee_id?: number, ledger_month?: string }) => {
        loading.value = true
        error.value = null
        try {
            const data = await get('/api/hr/payroll/ledgers', params)
            ledgers.value = data as unknown as PayrollLedger[]
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch ledgers'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const addLedger = async (payload: Partial<PayrollLedger>) => {
        loading.value = true
        error.value = null
        try {
            const data = await post('/api/hr/payroll/ledgers', payload as Record<string, any>)
            ledgers.value.unshift(data as unknown as PayrollLedger)
            return data
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to add ledger entry'
            console.error(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const removeLedger = async (id: number) => {
        try {
            await deleteApi(`/api/hr/payroll/ledgers/${id}`)
            ledgers.value = ledgers.value.filter(l => l.id !== id)
        } catch (e) {
            console.error('Failed to delete ledger entry', e)
            throw e
        }
    }

    const fetchTaxBands = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await get('/api/hr/payroll/tax-bands')
            taxBands.value = data as unknown as PayrollTaxBand[]
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch tax bands'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const saveTaxBand = async (payload: Partial<PayrollTaxBand>) => {
        loading.value = true
        error.value = null
        try {
            const data = await post('/api/hr/payroll/tax-bands', payload as Record<string, any>)
            await fetchTaxBands()
            return data
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to save tax band'
            console.error(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const toggleTaxBand = async (id: number) => {
        try {
            await put(`/api/hr/payroll/tax-bands/${id}/toggle`, {})
            await fetchTaxBands()
        } catch (e) {
            console.error('Failed to toggle tax band', e)
        }
    }

    const batchProcess = async (month: string, deptId?: number): Promise<BatchProcessResult> => {
        loading.value = true
        try {
            const res = await post<BatchProcessResult>('/api/hr/payroll/batch', {
                payroll_month: month,
                department_id: deptId
            })
            return res.data
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to batch process payroll'
            console.error(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const fetchPayslips = async (params?: { employee_id?: number, payroll_month?: string }) => {
        loading.value = true
        error.value = null
        try {
            const data = await get('/api/hr/payroll/payslips', params)
            payslips.value = data as unknown as Payslip[]
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch payslips'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const downloadPayslip = async (id: number) => {
        try {
            const token = localStorage.getItem('auth_token')
            const response = await fetch(`/api/hr/payroll/payslips/${id}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error('Download failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Payslip_${id}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (e) {
            console.error('Failed to download payslip', e)
        }
    }

    const deletePayslip = async (id: number) => {
        try {
            await deleteApi(`/api/hr/payroll/payslips/${id}`)
            payslips.value = payslips.value.filter(p => p.id !== id)
        } catch (e) {
            console.error('Failed to delete payslip', e)
            throw e
        }
    }

    const clearPayslipsHistory = async (params: { payroll_month: string, employee_id?: number }) => {
        try {
            await deleteApi('/api/hr/payroll/payslips', params)
            payslips.value = payslips.value.filter(p => {
                if (params.employee_id) {
                    return p.payroll_month !== params.payroll_month || p.employee_id !== params.employee_id
                }
                return p.payroll_month !== params.payroll_month
            })
        } catch (e) {
            console.error('Failed to clear payslips history', e)
            throw e
        }
    }

    const exportBankRemittance = async (month: string) => {
        try {
            const token = localStorage.getItem('auth_token')
            const response = await fetch(`/api/hr/payroll/export/bank?payroll_month=${month}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Bank_Remittance_${month}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (e) {
            console.error('Failed to export bank remittance', e)
        }
    }

    const exportMpesaRemittance = async (month: string) => {
        try {
            const token = localStorage.getItem('auth_token')
            const response = await fetch(`/api/hr/payroll/export/mpesa?payroll_month=${month}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `MPESA_Remittance_${month}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (e) {
            console.error('Failed to export MPESA remittance', e)
        }
    }

    const exportP9 = async (employeeId: number, year: number) => {
        try {
            const token = localStorage.getItem('auth_token')
            const response = await fetch(`/api/hr/payroll/export/p9?employee_id=${employeeId}&year=${year}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            // Use the employee ID and year in the filename
            a.download = `P9_Report_${employeeId}_${year}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (e) {
            console.error('Failed to export P9 report', e)
        }
    }

    const fetchComplianceSummary = async (month: string) => {
        try {
            const data = await get(`/api/hr/payroll/compliance-summary?payroll_month=${month}`)
            complianceSummary.value = data
        } catch (e) {
            console.error('Failed to fetch compliance summary', e)
        }
    }

    const markAsPaid = async (month: string) => {
        try {
            await post('/api/hr/payroll/mark-paid', { payroll_month: month })
            await fetchComplianceSummary(month)
        } catch (e) {
            console.error('Failed to mark as paid', e)
            throw e
        }
    }

    return {
        loading,
        error,
        variables,
        ledgers,
        taxBands,
        fetchVariables,
        saveVariable,
        toggleVariable,
        fetchLedgers,
        addLedger,
        removeLedger,
        fetchTaxBands,
        saveTaxBand,
        toggleTaxBand,
        batchProcess,
        payslips,
        fetchPayslips,
        downloadPayslip,
        deletePayslip,
        clearPayslipsHistory,
        exportBankRemittance,
        exportMpesaRemittance,
        exportP9,
        complianceSummary,
        fetchComplianceSummary,
        markAsPaid
    }
}
