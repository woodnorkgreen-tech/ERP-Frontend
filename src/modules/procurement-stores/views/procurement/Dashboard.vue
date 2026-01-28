<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Procurement Dashboard</h1>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Overview of your procurement operations
                        </p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button @click="refreshData"
                            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <div v-else class="space-y-6">
                <!-- Key Metrics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total Purchase Orders -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchase Orders
                                </p>
                                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ stats.totalPurchaseOrders || 0 }}
                                </p>
                            </div>
                            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-xs text-green-600 dark:text-green-400 font-medium">
                                {{ stats.approvedPOs || 0 }} Approved
                            </span>
                            <span class="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            <span class="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                                {{ stats.pendingPOs || 0 }} Pending
                            </span>
                        </div>
                    </div>

                    <!-- Total Requisitions -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Requisitions</p>
                                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ stats.totalRequisitions || 0 }}
                                </p>
                            </div>
                            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-xs text-green-600 dark:text-green-400 font-medium">
                                {{ stats.approvedRequisitions || 0 }} Approved
                            </span>
                            <span class="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            <span class="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                {{ stats.pendingRequisitions || 0 }} Awaiting
                            </span>
                        </div>
                    </div>

                    <!-- Bills & Payments -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding Bills</p>
                                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatCurrency(stats.outstandingAmount || 0) }}
                                </p>
                            </div>
                            <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4">
                            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {{ stats.totalBills || 0 }} Total Bills
                            </span>
                            <span v-if="stats.overdueBills > 0" class="mx-2 text-gray-300 dark:text-gray-600">|</span>
                            <span v-if="stats.overdueBills > 0" class="text-xs text-red-600 dark:text-red-400 font-medium">
                                {{ stats.overdueBills }} Overdue
                            </span>
                        </div>
                    </div>

                    <!-- Active Suppliers -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Suppliers</p>
                                <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ stats.activeSuppliers || 0 }}
                                </p>
                            </div>
                            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4">
                            <router-link to="/procurement/suppliers"
                                class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                View all suppliers →
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Purchase Orders Trend -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Purchase Orders Overview
                        </h3>
                        <div class="h-64">
                            <canvas ref="poChartCanvas"></canvas>
                        </div>
                    </div>

                    <!-- Spending by Category -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bills Status</h3>
                        <div class="h-64">
                            <canvas ref="billsChartCanvas"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities & Quick Actions -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Recent Purchase Orders -->
                    <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Purchase Orders
                                </h3>
                                <router-link to="/procurement/purchase-orders"
                                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    View all
                                </router-link>
                            </div>

                            <div class="space-y-3">
                                <div v-if="recentPOs.length === 0"
                                    class="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No purchase orders found
                                </div>
                                <div v-else v-for="po in recentPOs" :key="po.id"
                                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                    @click="viewPurchaseOrder(po.id)">
                                    <div class="flex items-center space-x-3">
                                        <div
                                            class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ po.po_number
                                                }}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">{{
                                                po.supplier?.supplier_name || 'N/A' }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                            {{ formatCurrency(po.total_amount) }}
                                        </p>
                                        <span :class="getStatusClass(po.status)">
                                            {{ formatStatus(po.status) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <router-link to="/procurement/requisition/create"
                                class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">New
                                        Requisition</span>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </router-link>

                            <router-link to="/procurement/suppliers"
                                class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">View
                                        Suppliers</span>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </router-link>

                            <router-link to="/procurement/billing"
                                class="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">Manage Bills</span>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </router-link>

                            <router-link to="/procurement/goods-receipt-notes"
                                class="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 bg-orange-600 dark:bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">Goods Receipt
                                        Notes</span>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Pending Approvals -->
                <div v-if="pendingApprovals.length > 0"
                    class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="ml-3 flex-1">
                            <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pending Approvals</h3>
                            <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                <p>You have {{ pendingApprovals.length }} items awaiting approval:</p>
                                <ul class="list-disc list-inside mt-2 space-y-1">
                                    <li v-for="item in pendingApprovals" :key="item.id">
                                        {{ item.type }}: {{ item.number }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const router = useRouter()

const loading = ref(true)
const stats = ref({
    totalPurchaseOrders: 0,
    approvedPOs: 0,
    pendingPOs: 0,
    totalRequisitions: 0,
    approvedRequisitions: 0,
    pendingRequisitions: 0,
    outstandingAmount: 0,
    totalBills: 0,
    paidBills: 0,
    partiallyPaidBills: 0,
    unpaidBills: 0,
    overdueBills: 0,
    activeSuppliers: 0
})

const recentPOs = ref([])
const pendingApprovals = ref([])

const poChartCanvas = ref<HTMLCanvasElement | null>(null)
const billsChartCanvas = ref<HTMLCanvasElement | null>(null)

let poChart: Chart | null = null
let billsChart: Chart | null = null

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num)
}

const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num)
}

const formatStatus = (status: string) => {
    return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
}

const getStatusClass = (status: string) => {
    const classes = {
        'draft': 'text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
        'pending_approval': 'text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
        'approved': 'text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
        'rejected': 'text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
        'sent': 'text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
        'paid': 'text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
        'partially_paid': 'text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
        'unpaid': 'text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    }
    return classes[status as keyof typeof classes] || classes.draft
}

const viewPurchaseOrder = (id: number) => {
    router.push({ name: 'procurement-purchase-order-show', params: { id } })
}

const loadDashboardData = async () => {
    loading.value = true
    try {
        // Load Purchase Orders
        let posResponse
        try {
            posResponse = await axios.post('/api/procurement-stores/search/purchase-orders', { perPage: 20 })
            const pos = posResponse.data.data || []
            
            stats.value.totalPurchaseOrders = posResponse.data.meta?.total || posResponse.data.total || 0
            stats.value.approvedPOs = pos.filter((po: any) => po.status === 'approved').length
            stats.value.pendingPOs = pos.filter((po: any) => po.status === 'pending' || po.status === 'pending_approval').length
            
            recentPOs.value = pos.slice(0, 5)
        } catch (error) {
            console.error('Failed to load purchase orders:', error)
        }

        // Load Requisitions
        try {
            const requisitionsResponse = await axios.post('/api/procurement-stores/search/requisitions', { 
                perPage: 20,
                searchTerm: '' // Empty search to avoid SQL issues
            })
            const requisitions = requisitionsResponse.data.data || []
            
            stats.value.totalRequisitions = requisitionsResponse.data.meta?.total || requisitionsResponse.data.total || 0
            stats.value.approvedRequisitions = requisitions.filter((req: any) => req.status === 'approved').length
            stats.value.pendingRequisitions = requisitions.filter((req: any) => req.status === 'pending_approval').length

            // Add pending requisitions to approvals list
            if (requisitions.length > 0) {
                const pendingReqs = requisitions
                    .filter((req: any) => req.status === 'pending_approval')
                    .map((req: any) => ({
                        id: req.id,
                        type: 'Requisition',
                        number: req.requisition_number
                    }))
                pendingApprovals.value.push(...pendingReqs)
            }
        } catch (error) {
            console.error('Failed to load requisitions:', error)
            // Set defaults if requisitions fail
            stats.value.totalRequisitions = 0
            stats.value.approvedRequisitions = 0
            stats.value.pendingRequisitions = 0
        }

        // Load Bills Stats
        try {
            const billsStatsResponse = await axios.get('/api/procurement-stores/bills-stats')
            const billsStats = billsStatsResponse.data || {}
            
            // Use actual API data
            stats.value.outstandingAmount = billsStats.pending_amount || 0
            stats.value.totalBills = billsStats.total_bills || 0
            stats.value.overdueBills = billsStats.overdue_count || 0
            
            // Get individual bill counts by fetching all bills
            try {
                const billsResponse = await axios.post('/api/procurement-stores/search/bills', { perPage: 100 })
                const bills = billsResponse.data.data || []
                
                stats.value.paidBills = bills.filter((bill: any) => bill.status === 'paid').length
                stats.value.partiallyPaidBills = bills.filter((bill: any) => bill.status === 'partial' || bill.status === 'partially_paid').length
                stats.value.unpaidBills = bills.filter((bill: any) => bill.status === 'unpaid').length
            } catch (error) {
                console.error('Failed to load bill details:', error)
                // Fallback: if all bills are paid (pending_amount = 0), show all as paid
                if (billsStats.pending_amount === 0 && billsStats.total_bills > 0) {
                    stats.value.paidBills = billsStats.total_bills
                    stats.value.partiallyPaidBills = 0
                    stats.value.unpaidBills = 0
                }
            }
        } catch (error) {
            console.error('Failed to load bills stats:', error)
            stats.value.outstandingAmount = 0
            stats.value.totalBills = 0
            stats.value.overdueBills = 0
            stats.value.paidBills = 0
            stats.value.partiallyPaidBills = 0
            stats.value.unpaidBills = 0
        }

        // Load Suppliers
        try {
            const suppliersResponse = await axios.post('/api/procurement-stores/search/suppliers', { perPage: 1 })
            stats.value.activeSuppliers = suppliersResponse.data.meta?.total || suppliersResponse.data.total || 0
        } catch (error) {
            console.error('Failed to load suppliers:', error)
            stats.value.activeSuppliers = 0
        }

        // Build pending approvals list from POs
        if (posResponse && posResponse.data.data) {
            const pos = posResponse.data.data
            const pendingPOs = pos
                .filter((po: any) => po.status === 'pending' || po.status === 'pending_approval')
                .map((po: any) => ({
                    id: po.id,
                    type: 'Purchase Order',
                    number: po.po_number
                }))
            pendingApprovals.value = [...pendingPOs, ...pendingApprovals.value]
        }

        // IMPORTANT: Wait for DOM to update, then initialize charts
        console.log('📊 Data loaded, initializing charts...')
        await nextTick()
        await nextTick() // Double nextTick for safety
        
        // Add small delay to ensure canvas elements are fully rendered
        setTimeout(() => {
            console.log('🎨 Calling initializeCharts...')
            initializeCharts()
        }, 100)

    } catch (error) {
        console.error('Failed to load dashboard data:', error)
    } finally {
        loading.value = false
    }
}

const initializeCharts = () => {
    console.log('🎨 initializeCharts called!')
    console.log('📍 Canvas elements:', {
        poCanvas: poChartCanvas.value,
        billsCanvas: billsChartCanvas.value
    })
    console.log('📊 Stats:', stats.value)
    
    if (poChartCanvas.value) {
        console.log('✅ PO Canvas found, creating chart...')
        const isDark = document.documentElement.classList.contains('dark')
        const textColor = isDark ? '#9CA3AF' : '#4B5563'
        const gridColor = isDark ? '#374151' : '#E5E7EB'

        if (poChart) {
            poChart.destroy()
        }

        try {
            poChart = new Chart(poChartCanvas.value, {
            type: 'bar',
            data: {
                labels: ['Pending Approval', 'Approved'],
                datasets: [{
                    label: 'Purchase Orders',
                    data: [
                        stats.value.pendingPOs,
                        stats.value.approvedPOs
                    ],
                    backgroundColor: [
                        'rgba(251, 191, 36, 0.8)',  // Yellow for pending
                        'rgba(34, 197, 94, 0.8)'     // Green for approved
                    ],
                    borderColor: [
                        'rgb(251, 191, 36)',
                        'rgb(34, 197, 94)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            precision: 0
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                }
            }
        })
        console.log('✅ PO Chart created successfully!')
    } catch (error) {
        console.error('❌ Error creating PO chart:', error)
    }
} else {
    console.error('❌ PO Canvas element not found!')
}

    if (billsChartCanvas.value) {
        console.log('✅ Bills Canvas found, creating chart...')
        const isDark = document.documentElement.classList.contains('dark')
        const textColor = isDark ? '#9CA3AF' : '#4B5563'

        if (billsChart) {
            billsChart.destroy()
        }

        try {
            billsChart = new Chart(billsChartCanvas.value, {
            type: 'doughnut',
            data: {
                labels: ['Paid', 'Partially Paid', 'Unpaid'],
                datasets: [{
                    data: [
                        stats.value.paidBills || 0,
                        stats.value.partiallyPaidBills || 0,
                        stats.value.unpaidBills || 0
                    ],
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',   // Green for paid
                        'rgba(251, 146, 60, 0.8)',  // Orange for partially paid
                        'rgba(239, 68, 68, 0.8)'    // Red for unpaid
                    ],
                    borderColor: [
                        'rgb(34, 197, 94)',
                        'rgb(251, 146, 60)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            padding: 15
                        }
                    }
                }
            }
        })
        console.log('✅ Bills Chart created successfully!')
    } catch (error) {
        console.error('❌ Error creating Bills chart:', error)
    }
} else {
    console.error('❌ Bills Canvas element not found!')
}

console.log('🎨 Chart initialization complete!')
}

const refreshData = async () => {
    await loadDashboardData()
}

onMounted(() => {
    loadDashboardData()
})
</script>