<template>
  <Toast />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useAuth } from './composables/useAuth'
import { useSystemRefresh } from './composables/useSystemRefresh'
import { useNotificationStore } from './stores/notifications'

const { checkAuth } = useAuth()
const toast = useToast()
const notificationStore = useNotificationStore()

useSystemRefresh() // Start polling for version changes

// Watch for global notifications (e.g. Governance blocks)
watch(() => notificationStore.lastError, (newError) => {
  if (newError) {
    toast.add({
      severity: newError.severity,
      summary: newError.title,
      detail: newError.message,
      life: 5000
    })
  }
})

onMounted(() => {
  checkAuth()
})
</script>