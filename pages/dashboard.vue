<script setup lang="ts">
definePageMeta({ layout: false })
const route = useRoute()
if (route.path === '/dashboard') await navigateTo('/dashboard/overview', { redirectCode: 302 })
</script>

<template>
  <NuxtPage />
</template>
