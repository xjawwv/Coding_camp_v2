<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
const route = useRoute()
const documents: Record<string, { title: string }> = { auth: { title: 'Authentication' }, admin: { title: 'Admin System' }, uploads: { title: 'Uploads' }, 'course-content': { title: 'Course Content' } }
const document = documents[String(route.params.slug)] || documents.auth
const content = ref('')
onMounted(async () => { content.value = await $fetch<string>(`/api/docs/${route.params.slug}`) })
</script>
<template><UDashboardPanel id="documentation"><template #header><UDashboardNavbar :title="document.title"><template #leading><UDashboardSidebarCollapse /></template></UDashboardNavbar></template><template #body><article class="prose-docs"><pre v-if="content">{{ content }}</pre><p v-else class="text-muted">Memuat dokumentasi...</p></article></template></UDashboardPanel></template>
