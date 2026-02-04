<template>
  <Toast />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import { useAuth } from './composables/useAuth'
import { useSystemRefresh } from './composables/useSystemRefresh'

const { checkAuth } = useAuth()
useSystemRefresh() // Start polling for version changes

onMounted(() => {
  checkAuth()
})
</script>