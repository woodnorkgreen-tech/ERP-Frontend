<template>
  <div class="task-renderer">
    <!-- Special handling for tasks that manage their own readonly/edit mode (show component even when completed) -->
    <component
      v-if="shouldUseDirectComponent(task.type)"
      :is="taskComponent"
      :task="task"
      :readonly="task.status === 'completed'"
      @update-status="handleStatusUpdate"
      @complete="handleComplete"
      @save-design-data="handleSaveDesignData"
    />
    <!-- Show TaskDataViewer for other completed tasks -->
    <TaskDataViewer
      v-else-if="task.status === 'completed'"
      :task="task"
    />
    <!-- Show appropriate task component for active tasks -->
    <component
      v-else
      :is="taskComponent"
      :task="task"
      :readonly="false"
      @update-status="handleStatusUpdate"
      @complete="handleComplete"
      @save-design-data="handleSaveDesignData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import TaskDataViewer from './TaskDataViewer.vue'
import SurveyTask from './SurveyTask.vue'
import DesignTask from './DesignTask.vue'
import MaterialsTask from './MaterialsTask.vue'
import BudgetTask from './BudgetTask.vue'
import QuoteTask from './QuoteTask.vue'
import QuoteApprovalTask from './QuoteApprovalTask.vue'
import ProcurementTask from './ProcurementTask.vue'
import ProductionTask from './ProductionTask.vue'
import LogisticsTask from './LogisticsTask.vue'
import SetupTask from './SetupTask.vue'
import HandoverTask from './HandoverTask.vue'
import SetdownTask from './SetdownTask.vue'
import ReportTask from './ReportTask.vue'
import TeamsTask from './TeamsTask.vue'
import DefaultTask from './DefaultTask.vue'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
  'save-design-data': [data: any[]
]
}>()

// Helper function to determine if task should use direct component instead of TaskDataViewer
const shouldUseDirectComponent = (taskType?: string) => {
  if (!taskType) return false
  
  const specialTypes = [
    'budget', 'design', 'quote', 'quote_approval', 'production', 
    'logistics', 'procurement', 'site-survey', 'survey', 'site survey'
  ]
  
  return specialTypes.includes(taskType.toLowerCase())
}

const taskComponent = computed(() => {
  // Debug - always log what component is selected for what task type
  console.log(`[DEBUG] TaskRenderer: task.type = ${props.task.type}`)

  switch (props.task.type?.toLowerCase()) {
    case 'survey':
    case 'site survey':
    case 'site-survey':
      console.log('selected component: SurveyTask')
      return SurveyTask
    case 'design':
      console.log('selected component: DesignTask')
      return DesignTask
    case 'materials':
      console.log('selected component: MaterialsTask')
      return MaterialsTask
    case 'budget':
      console.log('selected component: BudgetTask')
      return BudgetTask
    case 'quote':
      console.log('selected component: QuoteTask')
      return QuoteTask
    case 'quote approval':
    case 'quote-approval':
    case 'quote_approval':
      console.log('selected component: QuoteApprovalTask')
      return QuoteApprovalTask
    case 'procurement':
      console.log('selected component: ProcurementTask')
      return ProcurementTask
    case 'production':
      console.log('selected component: ProductionTask')
      return ProductionTask
    case 'logistics':
      console.log('selected component: LogisticsTask')
      return LogisticsTask
    case 'setup':
      console.log('selected component: SetupTask')
      return SetupTask
    case 'handover':
      console.log('selected component: HandoverTask')
      return HandoverTask
    case 'setdown':
      console.log('selected component: SetdownTask')
      return SetdownTask
    case 'report':
      console.log('selected component: ReportTask')
      return ReportTask
    case 'teams':
      console.log('selected component: TeamsTask')
      return TeamsTask
    default:
      console.log('selected component: unknown, using DefaultTask')
      console.warn(`Unknown task type: ${props.task.type}, falling back to DefaultTask`)
      return DefaultTask
  }
})

const handleStatusUpdate = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const handleComplete = () => {
  emit('complete')
}

const handleSaveDesignData = (data: unknown[]) => {
  emit('save-design-data', data)
}
</script>
