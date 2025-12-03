<template>
  <div class="setdown-data-display">
    <SetdownTask
      :task="task"
      :initial-data="taskData"
      :readonly="true"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'
import SetdownTask from '../SetdownTask.vue'

interface Props {
  task: EnquiryTask
  taskData: any
}

defineProps<Props>()
</script>
