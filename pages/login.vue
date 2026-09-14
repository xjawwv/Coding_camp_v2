<script setup lang="ts">
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const user = useState<{ name: string; email: string } | null>('user', () => null)

async function login() {
  errorMessage.value = ''
  loading.value = true
  try {
    const result = await $fetch<{ user: typeof user.value }>('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    user.value = result.user
    await navigateTo('/')
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <SiteNav />
  <main class="auth-page"><form class="auth-card" @submit.prevent="login"><p class="hero-label">Coding Camp Account</p><h1>Masuk ke akunmu</h1><p class="auth-description">Lanjutkan belajar dengan session yang aman.</p><label>Email<input v-model="email" type="email" autocomplete="email" required></label><label>Password<input v-model="password" type="password" autocomplete="current-password" minlength="8" required></label><p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p><button class="button-primary auth-submit" type="submit" :disabled="loading">{{ loading ? 'Memproses...' : 'Login' }}</button></form></main>
</template>
