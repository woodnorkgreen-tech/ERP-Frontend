<template>
  <div class="task-renderer">
    <!-- Special handling for budget and design tasks - let them manage their own readonly/edit mode -->
    <component
      v-if="task.type === 'budget' || task.type === 'design'"
      :is="taskComponent"
      :task="task"
      :readonly="false"
      @update-status="handleStatusUpdate"
      @complete="handleComplete"
      @save-design-data="handleSaveDesignData"
    />
    <!-- Show TaskDataViewer for other completed tasks -->
    <TaskDataViewer
      v-else-if="task.status === 'completed'"
      :task="task"
    />
    <!-- Show editable task form for other incomplete tasks -->
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
import ConversionTask from './ConversionTask.vue'
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
  'save-design-data': [data: any[]]
}>()

const taskComponent = computed(() => {
  const taskType = props.task.type
  let component

  switch (taskType) {
    case 'site-survey':
      component = SurveyTask
      break
    case 'design':
      component = DesignTask
      break
    case 'materials':
      component = MaterialsTask
      break
    case 'budget':
      component = BudgetTask
      break
    case 'quote':
      component = QuoteTask
      break
    case 'quote_approval':
      component = QuoteApprovalTask
      break
    case 'procurement':
      component = ProcurementTask
      break
    case 'conversion':
      component = ConversionTask
      break
    case 'production':
      component = ProductionTask
      break
    case 'logistics':
      component = LogisticsTask
      break
    case 'setup':
      component = SetupTask
      break
    case 'handover':
      component = HandoverTask
      break
    case 'setdown':
      component = SetdownTask
      break
    case 'report':
      component = ReportTask
      break
    case 'teams':
      component = TeamsTask
      break
    default:
      component = DefaultTask
      break
  }

  // Debug log to validate task type and component selection
  console.log('[DEBUG] TaskRenderer: task.type =', taskType, 'selected component:', component?.name || 'unknown')

  return component
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
