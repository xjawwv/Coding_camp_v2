<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
const { user, loadUser } = useAuth()
const loading = ref(true)
onMounted(async () => { if (!await loadUser()) await navigateTo({ path: '/login', query: { redirect: '/dashboard' } }); loading.value = false })
async function logout() { await $fetch('/api/auth/logout', { method: 'POST' }); user.value = null; await navigateTo('/') }
</script>
<template>
  <main class="dashboard-content"><div v-if="loading" class="dashboard-loading">Memuat dashboard...</div><template v-else-if="user"><div class="dashboard-page-heading"><div><p class="dashboard-eyebrow">Overview</p><h1>Dashboard</h1><p>Selamat datang kembali, {{ user.name }}.</p></div><button class="dashboard-logout" @click="logout">Logout</button></div><div class="dashboard-stat-grid"><div class="dashboard-stat"><span>Course tersedia</span><strong>1</strong><small>Mulai belajar kapan saja</small></div><div class="dashboard-stat"><span>Status akun</span><strong>Aktif</strong><small>Session aman dan aktif</small></div><div class="dashboard-stat"><span>Role</span><strong>{{ user.role === 'admin' ? 'Admin' : 'User' }}</strong><small>Akses sesuai role akun</small></div></div><section class="dashboard-panel"><div class="dashboard-panel-heading"><div><h2>Mulai belajar</h2><p>Pilih course untuk melanjutkan perjalananmu.</p></div><NuxtLink to="/#course" class="dashboard-action">Lihat semua course →</NuxtLink></div><div class="dashboard-course-row"><div><span class="dashboard-course-category">Frontend</span><h3>Dasar Pemrograman JavaScript</h3><p>Pelajari fondasi JavaScript dari variabel sampai function.</p></div><NuxtLink to="/#course" class="dashboard-course-link">Buka course</NuxtLink></div></section></template></main>
</template>
