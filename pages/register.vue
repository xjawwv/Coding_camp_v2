<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errorMessage = ref('')
const loading = ref(false)
const user = useState<{ name: string; email: string } | null>('user', () => null)
const route = useRoute()

async function register() {
  errorMessage.value = ''
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Konfirmasi password tidak cocok'
    return
  }
  loading.value = true
  try {
    const result = await $fetch<{ user: typeof user.value }>('/api/auth/register', { method: 'POST', body: { name: name.value, email: email.value, password: password.value } })
    user.value = result.user
    await navigateTo(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Registrasi gagal'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <SiteNav />
  <main class="auth-page"><form class="auth-card" @submit.prevent="register"><p class="hero-label">Coding Camp Account</p><h1>Buat akun baru</h1><p class="auth-description">Daftar untuk mulai mengikuti course Coding Camp.</p><label>Nama lengkap<input v-model="name" type="text" autocomplete="name" maxlength="100" required></label><label>Email<input v-model="email" type="email" autocomplete="email" required></label><label>Password<input v-model="password" type="password" autocomplete="new-password" minlength="8" required></label><label>Konfirmasi password<input v-model="passwordConfirmation" type="password" autocomplete="new-password" minlength="8" required></label><p v-if="errorMessage" class="auth-error" role="alert">{{ errorMessage }}</p><button class="button-primary auth-submit" type="submit" :disabled="loading">{{ loading ? 'Memproses...' : 'Buat Akun' }}</button><p class="auth-switch">Sudah punya akun? <NuxtLink to="/login">Login di sini</NuxtLink></p></form></main>
</template>
