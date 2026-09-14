<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
type User = { id: string; name: string; email: string; role: 'user' | 'admin' }
const { user, loadUser } = useAuth(); const users = ref<User[]>([]); const loading = ref(true)
async function loadUsers() { if (!await loadUser()) return navigateTo({ path: '/login', query: { redirect: '/admin/users' } }); if (user.value?.role !== 'admin') return navigateTo('/dashboard'); users.value = (await $fetch<{ users: User[] }>('/api/admin/users')).users; loading.value = false }
async function updateUser(item: User) { await $fetch(`/api/admin/users/${item.id}`, { method: 'PATCH', body: { name: item.name, role: item.role } }) }
async function deleteUser(id: string) { await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' }); await loadUsers() }
onMounted(loadUsers)
</script>
<template>
  <UDashboardPanel id="admin-users"><template #header><UDashboardNavbar title="User"><template #leading><UDashboardSidebarCollapse /></template></UDashboardNavbar><UDashboardToolbar><template #left><span class="text-sm text-muted">Kelola akun dan role pengguna</span></template></UDashboardToolbar></template><template #body><div v-if="loading" class="p-8 text-muted">Memuat users...</div><UPageCard v-else title="Daftar User" :description="`${users.length} akun terdaftar`" icon="i-lucide-users"><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-default text-left"><th class="p-3">Nama</th><th class="p-3">Email</th><th class="p-3">Role</th><th class="p-3">Aksi</th></tr></thead><tbody><tr v-for="item in users" :key="item.id" class="border-b border-default"><td class="p-3"><UInput v-model="item.name" @change="updateUser(item)" /></td><td class="p-3">{{ item.email }}</td><td class="p-3"><USelect v-model="item.role" :items="['user', 'admin']" :disabled="item.id === user?.id" @change="updateUser(item)" /></td><td class="p-3"><UButton label="Hapus" color="error" variant="ghost" :disabled="item.id === user?.id" @click="deleteUser(item.id)" /></td></tr></tbody></table></div></UPageCard></template></UDashboardPanel>
</template>
