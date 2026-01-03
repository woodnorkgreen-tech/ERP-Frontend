<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <!-- Enquiry Trends Chart -->
    <div class="group relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
      <!-- Glow -->
      <div class="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 bg-blue-500 opacity-5 transition-opacity group-hover:opacity-10"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Growth Dynamics</h3>
            <p class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Enquiry <span class="text-blue-500 opacity-50">Velocity</span></p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <i class="mdi mdi-trending-up text-2xl"></i>
          </div>
        </div>
        <div class="h-80">
          <Chart type="line" :data="enquiryTrendData" :options="enquiryTrendOptions" class="h-full" />
        </div>
      </div>
    </div>

    <!-- Task Distribution Chart -->
    <div class="group relative p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        <!-- Glow -->
        <div class="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 bg-indigo-500 opacity-5 transition-opacity group-hover:opacity-10"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Operational Spread</h3>
              <p class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Sector <span class="text-indigo-500 opacity-50">Distribution</span></p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <i class="mdi mdi-chart-donut text-2xl"></i>
            </div>
          </div>
          <div class="h-80 flex items-center justify-center">
            <Chart type="doughnut" :data="taskDistributionData" :options="taskDistributionOptions" class="h-full w-full" />
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Chart from 'primevue/chart'

 
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enquiryMetrics?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  taskMetrics?: any
}

const props = defineProps<Props>()

// Chart data
const enquiryTrendData = computed(() => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: props.enquiryMetrics?.monthly_trend?.map((item: any) => item.month) || [],
  datasets: [{
    label: 'Enquiries',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: props.enquiryMetrics?.monthly_trend?.map((item: any) => item.count) || [],
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#3B82F6',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}))

const enquiryTrendOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleFont: { family: 'Inter', weight: 'black', size: 12 },
      bodyFont: { family: 'Inter', weight: 'bold', size: 12 },
      padding: 12,
      cornerRadius: 12,
      displayColors: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#94a3b8',
        font: { family: 'Inter', weight: 'black', size: 10 }
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        drawBorder: false
      }
    },
    x: {
      ticks: {
        color: '#94a3b8',
        font: { family: 'Inter', weight: 'black', size: 10 }
      },
      grid: {
        display: false
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}))

const taskDistributionData = computed(() => ({
  labels: Object.keys(props.taskMetrics?.tasks_by_department || {}).map(l => l.toUpperCase()),
  datasets: [{
    data: Object.values(props.taskMetrics?.tasks_by_department || {}),
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(99, 102, 241, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(6, 182, 212, 0.8)',
      'rgba(236, 72, 153, 0.8)'
    ],
    hoverOffset: 20,
    borderWidth: 0
  }]
}))

const taskDistributionOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 30,
        usePointStyle: true,
        pointStyle: 'circle',
        color: '#94a3b8',
        font: { family: 'Inter', weight: 'black', size: 10, tracking: '0.1em' }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleFont: { family: 'Inter', weight: 'black', size: 12 },
      bodyFont: { family: 'Inter', weight: 'bold', size: 12 },
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  },
  cutout: '75%'
}))
</script>
