<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
type User = { id: string; name: string; email: string; role: 'user' | 'admin' }
type Course = { id: string }
const { user, loadUser } = useAuth()
const users = ref<User[]>([])
const courses = ref<Course[]>([])
const loading = ref(true)

async function loadOverview() {
  if (!await loadUser()) return navigateTo({ path: '/login', query: { redirect: '/admin' } })
  if (user.value?.role !== 'admin') return navigateTo('/dashboard')
  const [userResult, courseResult] = await Promise.all([$fetch<{ users: User[] }>('/api/admin/users'), $fetch<{ courses: Course[] }>('/api/admin/courses')])
  users.value = userResult.users
  courses.value = courseResult.courses
  loading.value = false
}

onMounted(loadOverview)
</script>
<template>
  <UDashboardPanel id="admin-overview"><template #header><UDashboardNavbar title="Admin Panel"><template #leading><UDashboardSidebarCollapse /></template><template #right><UButton to="/admin/courses" label="Course Baru" icon="i-lucide-plus" color="primary" /></template></UDashboardNavbar><UDashboardToolbar><template #left><span class="text-sm text-muted">Overview administrasi platform</span></template></UDashboardToolbar></template><template #body><div v-if="loading" class="p-8 text-muted">Memuat overview...</div><div v-else class="space-y-6"><div><p class="text-sm text-primary font-medium">Administration</p><h1 class="text-3xl font-semibold text-highlighted">Admin Panel</h1><p class="text-muted">Pilih area yang ingin dikelola.</p></div><UPageGrid class="lg:grid-cols-3"><UPageCard title="Total users" :description="`${users.length} akun terdaftar`" icon="i-lucide-users" to="/admin/users" variant="subtle"><strong class="text-3xl text-highlighted">{{ users.length }}</strong></UPageCard><UPageCard title="Total courses" :description="`${courses.length} course tersedia`" icon="i-lucide-book-open" to="/admin/courses" variant="subtle"><strong class="text-3xl text-highlighted">{{ courses.length }}</strong></UPageCard><UPageCard title="Role aktif" description="Session administrator" icon="i-lucide-shield-check" variant="subtle"><strong class="text-3xl text-highlighted">Admin</strong></UPageCard></UPageGrid><div class="grid gap-4 md:grid-cols-2"><UPageCard title="Manage User" description="Kelola akun dan role pengguna." icon="i-lucide-users" to="/admin/users"><UButton label="Buka Manage User" color="primary" variant="outline" class="mt-4" /></UPageCard><UPageCard title="Manage Course" description="Buat, edit, dan hapus course." icon="i-lucide-book-open" to="/admin/courses"><UButton label="Buka Manage Course" color="primary" variant="outline" class="mt-4" /></UPageCard></div></div></template></UDashboardPanel>
</template>
