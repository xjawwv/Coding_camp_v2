<script setup lang="ts">
const { user, loadUser } = useAuth()
const collapsed = ref(false)
const mobileOpen = ref(false)
onMounted(loadUser)
const navigation = computed(() => [
  { label: 'Dashboard', to: '/dashboard', icon: '⌂' },
  ...(user.value?.role === 'admin' ? [{ label: 'Admin Panel', to: '/admin', icon: '⚙' }] : []),
  { label: 'Course', to: '/#course', icon: '▣' }
])
</script>
<template>
  <div class="dashboard-shell"><aside :class="['dashboard-sidebar', { collapsed, open: mobileOpen }]" @click.self="mobileOpen = false"><div class="dashboard-brand"><NuxtLink to="/">CodingCamp</NuxtLink><button class="sidebar-toggle" aria-label="Tutup sidebar" @click="collapsed = !collapsed">‹</button></div><nav class="dashboard-nav"><NuxtLink v-for="item in navigation" :key="item.to" :to="item.to" class="dashboard-nav-item" @click="mobileOpen = false"><span class="dashboard-nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span></NuxtLink></nav><div class="dashboard-sidebar-footer"><NuxtLink to="/" class="dashboard-back">← <span>Kembali ke website</span></NuxtLink></div></aside><div class="dashboard-main"><header class="dashboard-topbar"><button class="dashboard-mobile-toggle" aria-label="Buka sidebar" @click="mobileOpen = !mobileOpen">☰</button><div class="dashboard-topbar-spacer"></div><ThemeToggle /><NuxtLink to="/dashboard" class="dashboard-user"><span class="dashboard-avatar">{{ user?.name?.charAt(0).toUpperCase() || '?' }}</span><span class="dashboard-user-name">{{ user?.name || 'Account' }}</span></NuxtLink></header><slot /></div></div>
</template>
