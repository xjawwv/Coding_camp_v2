<script setup lang="ts">
const { user, loadUser } = useAuth()
const loading = ref(true)
onMounted(async () => { if (!await loadUser()) await navigateTo({ path: '/login', query: { redirect: '/dashboard' } }); loading.value = false })
async function logout() { await $fetch('/api/auth/logout', { method: 'POST' }); user.value = null; await navigateTo('/') }
</script>
<template>
  <SiteNav /><main class="dashboard-page"><div v-if="loading" class="empty-state">Memuat dashboard...</div><section v-else-if="user" class="dashboard-card"><p class="hero-label">Coding Camp Dashboard</p><h1>Selamat datang, {{ user.name }}</h1><p class="auth-description">Kelola perjalanan belajar dan akses akunmu dari halaman ini.</p><div class="dashboard-meta"><span>Email</span><strong>{{ user.email }}</strong><span>Role</span><strong>{{ user.role === 'admin' ? 'Administrator' : 'User' }}</strong></div><div class="dashboard-actions"><NuxtLink to="/#course" class="button-primary">Lihat Course</NuxtLink><NuxtLink v-if="user.role === 'admin'" to="/admin" class="button-outline">Panel Admin</NuxtLink><button class="button-outline" @click="logout">Logout</button></div></section></main>
  <SiteFooter />
</template>
