<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user, loadUser } = useAuth()
const open = ref(false)
onMounted(loadUser)

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: 'Dashboard', icon: 'i-lucide-house', to: '/dashboard', exact: true
}, ...(user.value?.role === 'admin' ? [{
  label: 'Manage Users', icon: 'i-lucide-users', to: '/admin/users'
}, {
  label: 'Manage Courses', icon: 'i-lucide-book-open', to: '/admin/courses'
}] : []), {
  label: 'Website', icon: 'i-lucide-external-link', to: '/'
}], [{
  label: 'Documentation', icon: 'i-lucide-book-open', to: '/AUTH.md'
}, {
  label: 'Support', icon: 'i-lucide-life-buoy', to: 'mailto:ilanalimanjs@gmail.com'
}]])

const groups = computed(() => [{ id: 'links', label: 'Go to', items: links.value.flat() }, { id: 'code', label: 'Account', items: [{ id: 'dashboard', label: 'Open dashboard', icon: 'i-lucide-layout-dashboard', to: '/dashboard' }] }])
</script>
<template>
  <UDashboardGroup unit="rem"><UDashboardSidebar id="coding-camp" v-model:open="open" collapsible resizable class="bg-elevated/25" :ui="{ footer: 'lg:border-t lg:border-default' }"><template #header="{ collapsed }"><UButton color="neutral" variant="ghost" block :square="collapsed" :class="[!collapsed && 'py-2']"><template #leading><span class="dashboard-logo-mark">CC</span></template><span v-if="!collapsed" class="font-bold text-highlighted">CodingCamp</span></UButton></template><template #default="{ collapsed }"><UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" /><UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover /><UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" /></template><template #footer="{ collapsed }"><UDropdownMenu :items="[[{ label: user?.name || 'Account', icon: 'i-lucide-user' }], [{ label: 'Logout', icon: 'i-lucide-log-out', onSelect: async () => { await $fetch('/api/auth/logout', { method: 'POST' }); user.value = null; await navigateTo('/') } }]]" :content="{ align: 'center', collisionPadding: 12 }"><UButton color="neutral" variant="ghost" block :square="collapsed" :label="collapsed ? undefined : user?.name" :trailing-icon="collapsed ? undefined : 'i-lucide-chevrons-up-down'" /></UDropdownMenu></template></UDashboardSidebar><UDashboardSearch :groups="groups" /><slot /></UDashboardGroup>
</template>
