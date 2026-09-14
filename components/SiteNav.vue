<script setup lang="ts">
const open = ref(false)
const links = [{ label: 'Home', to: '/#beranda' }, { label: 'About Us', to: '/#tentang' }, { label: 'Course', to: '/#course' }]
</script>
<template>
  <header class="navbar"><div class="container navbar-inner"><NuxtLink to="/#beranda" class="logo">CodingCamp</NuxtLink><nav class="nav-menu"><NuxtLink v-for="link in links" :key="link.label" :to="link.to">{{ link.label }}</NuxtLink><NuxtLink to="/login">Login</NuxtLink></nav><div class="navbar-actions-right"><ThemeToggle /><NuxtLink to="/#course" class="button-primary desktop-start">Mulai Sekarang</NuxtLink><button class="mobile-menu-button" aria-label="Buka menu" :aria-expanded="open" @click="open = true">☰</button></div></div></header>
  <div v-if="open" class="mobile-menu-modal" @click.self="open = false"><div class="mobile-menu-panel"><div class="mobile-menu-header"><span class="mobile-menu-label">MENU</span><button class="mobile-menu-close" @click="open = false">Close ×</button></div><nav class="mobile-menu-list"><NuxtLink v-for="link in links" :key="link.label" :to="link.to" @click="open = false">{{ link.label }}</NuxtLink><NuxtLink to="/login" @click="open = false">Login</NuxtLink></nav><a href="mailto:ilanalimanjs@gmail.com" class="mobile-menu-email">ilanalimanjs@gmail.com</a></div></div>
</template>
