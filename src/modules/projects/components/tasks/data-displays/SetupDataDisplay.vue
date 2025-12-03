<template>
  <div class="setup-data-display">
    <SetupTask
      :task="task"
      :initial-data="taskData"
      :readonly="true"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { EnquiryTask } from '../../../types/enquiry'
import SetupTask from '../SetupTask.vue'

interface Props {
  task: EnquiryTask
  taskData: any
}

defineProps<Props>()
</script>
