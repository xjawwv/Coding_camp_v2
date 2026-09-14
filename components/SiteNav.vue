<script setup lang="ts">
const open = ref(false)
const links = [{ label: 'Home', to: '/#beranda' }, { label: 'About Us', to: '/#tentang' }, { label: 'Course', to: '/#course' }]
const { requireLogin, user, loadUser } = useAuth()
onMounted(loadUser)
</script>
<template>
  <header class="navbar"><div class="container navbar-inner"><NuxtLink to="/#beranda" class="logo">CodingCamp</NuxtLink><nav class="nav-menu"><NuxtLink v-for="link in links" :key="link.label" :to="link.to">{{ link.label }}</NuxtLink><NuxtLink to="/login">Login</NuxtLink><NuxtLink v-if="user?.role === 'admin'" to="/admin">Admin Panel</NuxtLink></nav><div class="navbar-actions-right"><ThemeToggle /><button class="button-primary desktop-start" @click="requireLogin('/course/javascript_dasar?id=1')">Mulai Sekarang</button><button class="mobile-menu-button" aria-label="Buka menu" :aria-expanded="open" @click="open = true">☰</button></div></div></header>
  <div v-if="open" class="mobile-menu-modal" @click.self="open = false"><div class="mobile-menu-panel"><div class="mobile-menu-header"><span class="mobile-menu-label">MENU</span><button class="mobile-menu-close" @click="open = false">Close ×</button></div><nav class="mobile-menu-list"><NuxtLink v-for="link in links" :key="link.label" :to="link.to" @click="open = false">{{ link.label }}</NuxtLink><NuxtLink to="/login" @click="open = false">Login</NuxtLink><NuxtLink v-if="user?.role === 'admin'" to="/admin" @click="open = false">Admin Panel</NuxtLink></nav><a href="mailto:ilanalimanjs@gmail.com" class="mobile-menu-email">ilanalimanjs@gmail.com</a></div></div>
</template>
