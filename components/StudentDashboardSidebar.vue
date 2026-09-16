<script setup lang="ts">
defineProps<{ logout: () => void }>()
</script>

<template>
  <aside class="user-dashboard-sidebar">
    <NuxtLink to="/" class="user-dashboard-brand"><span class="user-dashboard-brand-mark"><UIcon name="i-lucide-code-2" /></span><span>CodingCamp</span><small>Student dashboard</small></NuxtLink>
    <p class="user-dashboard-menu-label">MAIN MENU</p>
    <nav class="user-dashboard-nav" aria-label="Navigasi dashboard">
      <NuxtLink to="/dashboard/overview" exact-active-class="active" class="user-dashboard-nav-item"><UIcon name="i-lucide-layout-dashboard" /> Overview</NuxtLink>
      <NuxtLink to="/dashboard/course" exact-active-class="active" class="user-dashboard-nav-item"><UIcon name="i-lucide-book-open" /> Course</NuxtLink>
      <NuxtLink to="/dashboard/assignment" exact-active-class="active" class="user-dashboard-nav-item"><UIcon name="i-lucide-clipboard-check" /> Assignment</NuxtLink>
      <NuxtLink to="/dashboard/progress" exact-active-class="active" class="user-dashboard-nav-item"><UIcon name="i-lucide-chart-no-axes-column-increasing" /> Progress</NuxtLink>
      <NuxtLink to="/dashboard/calender" exact-active-class="active" class="user-dashboard-nav-item"><UIcon name="i-lucide-calendar-days" /> Calender</NuxtLink>
    </nav>
    <p class="user-dashboard-menu-label user-dashboard-other-label">OTHER MENU</p>
    <nav class="user-dashboard-nav">
      <NuxtLink to="/dashboard/settings" exact-active-class="active" class="user-dashboard-nav-item"><UIcon name="i-lucide-settings-2" /> Settings</NuxtLink>
    </nav>
    <button class="user-dashboard-logout" @click="logout"><UIcon name="i-lucide-log-out" /> Logout</button>
  </aside>
</template>
