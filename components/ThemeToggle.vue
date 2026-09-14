<script setup lang="ts">
const theme = useState('theme', () => 'light')
onMounted(() => { theme.value = localStorage.getItem('cc-theme') === 'dark' ? 'dark' : 'light'; document.documentElement.dataset.theme = theme.value === 'dark' ? 'dark' : '' })
function toggle() { theme.value = theme.value === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme.value === 'dark' ? 'dark' : ''; localStorage.setItem('cc-theme', theme.value) }
</script>
<template><button class="theme-toggle-button" aria-label="Ganti tema" @click="toggle">{{ theme === 'dark' ? '☼' : '◐' }}</button></template>
