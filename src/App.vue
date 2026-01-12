<template>
  <Toast />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import { useAuth } from './composables/useAuth'

const { checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>