<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
type User = { id: string; name: string; email: string; role: 'user' | 'admin' }
const { user, loadUser } = useAuth()
const users = ref<User[]>([])
const loading = ref(true)
async function loadOverview() { if (!await loadUser()) return navigateTo({ path: '/login', query: { redirect: '/admin' } }); if (user.value?.role !== 'admin') return navigateTo('/dashboard'); users.value = (await $fetch<{ users: User[] }>('/api/admin/users')).users; loading.value = false }
onMounted(loadOverview)
</script>
<template><UDashboardPanel id="admin-overview"><template #header><UDashboardNavbar title="Admin Panel"><template #leading><UDashboardSidebarCollapse /></template></UDashboardNavbar><UDashboardToolbar><template #left><span class="text-sm text-muted">Overview administrasi user</span></template></UDashboardToolbar></template><template #body><div v-if="loading" class="p-8 text-muted">Memuat overview...</div><div v-else class="space-y-6"><div><p class="text-sm text-primary font-medium">Administration</p><h1 class="text-3xl font-semibold text-highlighted">Admin Panel</h1><p class="text-muted">Kelola pengguna platform.</p></div><UPageGrid class="lg:grid-cols-2"><UPageCard title="Total user" :description="`${users.length} akun terdaftar`" icon="i-lucide-users" to="/admin/users" variant="subtle"><strong class="text-3xl text-highlighted">{{ users.length }}</strong></UPageCard><UPageCard title="Role aktif" description="Session administrator" icon="i-lucide-shield-check" variant="subtle"><strong class="text-3xl text-highlighted">Admin</strong></UPageCard></UPageGrid><UPageCard title="User" description="Kelola akun dan role pengguna." icon="i-lucide-users" to="/admin/users"><UButton label="Buka User" color="primary" variant="outline" class="mt-4" /></UPageCard></div></template></UDashboardPanel></template>
