<script setup lang="ts">
definePageMeta({ layout: false })

import { courses as fallbackCourses, levelNames } from '~/data/courses'
import { courseSlug } from '~/utils/course-route'

const route = useRoute()
const validMenus = ['overview', 'course', 'assignment', 'progress', 'calender', 'settings']
if (!validMenus.includes(String(route.params.menu))) await navigateTo('/dashboard/overview')

const { user, loadUser } = useAuth()
const loading = ref(!user.value)
const search = ref('')
const courseQuery = ref('')
const courseLevel = ref('all')
const courseList = ref<any[]>(fallbackCourses)
const selectedCourse = ref<any>(null)
const learningProgress = ref<any[]>([])
const filteredCourses = computed(() => courseList.value.filter(course => (courseLevel.value === 'all' || course.level === courseLevel.value) && course.title.toLowerCase().includes(courseQuery.value.toLowerCase())))
const activeProgress = computed(() => learningProgress.value.find(item => Number(item.progress) < 100) || learningProgress.value[0])
const selectedProgress = computed(() => learningProgress.value.find(item => String(item.courseId) === String(selectedCourse.value?.id)) || (selectedCourse.value ? { progress: 0 } : null))

onMounted(async () => {
  if (!user.value && !await loadUser()) await navigateTo({ path: '/login', query: { redirect: '/dashboard/overview' } })
  try { const result = await $fetch<{ courses: any[] }>('/api/courses'); if (result.courses.length) courseList.value = result.courses } catch {}
  try { learningProgress.value = (await $fetch<{ progress: any[] }>('/api/progress')).progress } catch {}
  loading.value = false
})

async function logout() { await $fetch('/api/auth/logout', { method: 'POST' }); user.value = null; await navigateTo('/') }
async function learn(course: any) { await navigateTo(`/course/${courseSlug(course.title)}?id=${course.id}`) }
</script>

<template>
  <div v-if="loading" class="user-dashboard-loading">Memuat dashboard...</div>
  <div v-else-if="user" class="user-dashboard-shell">
    <StudentDashboardSidebar :logout="logout" />
    <main class="user-dashboard-main">
      <header class="user-dashboard-topbar"><div><h1>Welcome back <UIcon name="i-lucide-hand" /></h1><p>Let's learn something new today!</p></div><div class="user-dashboard-top-actions"><label class="user-dashboard-search"><UIcon name="i-lucide-search" /><input v-model="search" placeholder="Search" aria-label="Search"></label><button aria-label="Notifications"><UIcon name="i-lucide-bell" /></button><div class="user-dashboard-avatar">{{ user.name.slice(0, 2).toUpperCase() }}</div><div class="user-dashboard-profile-name"><strong>{{ user.name }}</strong><small>@{{ user.email.split('@')[0] }}</small></div></div></header>
      <section v-if="route.params.menu === 'course'" class="user-dashboard-course-page"><div class="user-dashboard-page-intro"><div><p class="user-dashboard-eyebrow">MY LEARNING</p><h2>Choose your course</h2><p>Temukan course yang ingin kamu pelajari dan lanjutkan progress-mu.</p></div><span class="user-dashboard-course-count">{{ filteredCourses.length }} course tersedia</span></div><div class="user-dashboard-course-toolbar"><label class="user-dashboard-course-search"><UIcon name="i-lucide-search" /><input v-model="courseQuery" placeholder="Cari course..." aria-label="Cari course"></label><select v-model="courseLevel" aria-label="Filter level"><option value="all">Semua level</option><option value="beginner">Dasar</option><option value="intermediate">Menengah</option><option value="advanced">Sulit</option></select></div><div class="user-dashboard-course-grid"><article v-for="course in filteredCourses" :key="course.id" class="user-dashboard-course-tile"><img :src="course.image" :alt="course.title"><div class="user-dashboard-course-tile-body"><div class="user-dashboard-course-meta"><span>{{ course.category }}</span><small><UIcon name="i-lucide-clock-3" /> {{ course.duration }}</small></div><h3>{{ course.title }}</h3><p>{{ course.description }}</p><div class="user-dashboard-course-tile-footer"><span class="user-dashboard-level-badge">{{ levelNames[course.level] }}</span><button class="user-dashboard-course-detail" @click="selectedCourse = course">Lihat detail</button></div></div></article><p v-if="!filteredCourses.length" class="user-dashboard-course-empty">Course tidak ditemukan. Coba ubah pencarian atau filter.</p></div></section>
      <section v-else class="user-dashboard-layout"><div class="user-dashboard-primary"><section class="user-dashboard-card user-dashboard-overview-card"><UIcon name="i-lucide-layout-dashboard" /><div><p class="user-dashboard-eyebrow">ACCOUNT OVERVIEW</p><h2>Selamat datang, {{ user.name }}</h2><p>{{ activeProgress ? 'Lanjutkan materi yang sedang kamu pelajari.' : 'Dashboard progress belum memiliki data aktivitas untuk ditampilkan.' }}</p></div></section><section class="user-dashboard-card user-dashboard-summary-grid"><article><UIcon name="i-lucide-book-open" /><span>Course tersedia</span><strong>{{ courseList.length }}</strong></article><article><UIcon name="i-lucide-shield-check" /><span>Status akun</span><strong>Aktif</strong></article><article><UIcon name="i-lucide-badge-check" /><span>Role akun</span><strong>{{ user.role === 'admin' ? 'Admin' : 'User' }}</strong></article></section><section v-if="activeProgress" class="user-dashboard-card user-dashboard-learning-progress"><img :src="activeProgress.image" :alt="activeProgress.title"><div><p class="user-dashboard-eyebrow">CONTINUE LEARNING</p><h2>{{ activeProgress.title }}</h2><p>{{ activeProgress.progress }}% materi telah selesai</p><div class="user-dashboard-progress"><i :style="{ width: `${activeProgress.progress}%` }"></i></div><NuxtLink :to="`/course/${courseSlug(activeProgress.title)}?id=${activeProgress.courseId}`" class="user-dashboard-continue">Lanjutkan belajar <UIcon name="i-lucide-arrow-right" /></NuxtLink></div></section><section v-else class="user-dashboard-card user-dashboard-empty-card"><UIcon name="i-lucide-chart-no-axes-column" /><h2>Belum ada progress belajar</h2><p>Progress, aktivitas, dan statistik akan muncul setelah kamu mulai mengikuti course.</p><NuxtLink to="/dashboard/course" class="user-dashboard-continue">Pilih course <UIcon name="i-lucide-arrow-right" /></NuxtLink></section></div><div class="user-dashboard-secondary"><section class="user-dashboard-card user-dashboard-promo"><p class="user-dashboard-eyebrow">KEEP MOVING</p><h2>Mulai perjalanan coding-mu</h2><p>Pilih course yang sesuai dan mulai bangun skill coding lewat materi praktik.</p><NuxtLink to="/dashboard/course" class="user-dashboard-community">Lihat course <b><UIcon name="i-lucide-arrow-up-right" /></b></NuxtLink><div class="user-dashboard-promo-shape" aria-hidden="true"><UIcon name="i-lucide-sparkles" /></div></section><section class="user-dashboard-card user-dashboard-empty-card user-dashboard-empty-side"><UIcon name="i-lucide-users" /><h2>Belum ada mentor</h2><p>Data mentor akan tersedia ketika fitur mentorship diaktifkan.</p></section></div></section>
    </main>
    <div v-if="selectedCourse" class="user-dashboard-course-modal" @click.self="selectedCourse = null"><article><button class="user-dashboard-modal-close" aria-label="Tutup detail" @click="selectedCourse = null"><UIcon name="i-lucide-x" /></button><img :src="selectedCourse.image" :alt="selectedCourse.title"><div class="user-dashboard-course-modal-content"><div class="user-dashboard-course-meta"><span>{{ selectedCourse.category }}</span><small><UIcon name="i-lucide-clock-3" /> {{ selectedCourse.duration }}</small></div><h2>{{ selectedCourse.title }}</h2><p>{{ selectedCourse.description }}</p><div v-if="selectedProgress" class="user-dashboard-modal-progress"><div><span>Progress belajar</span><strong>{{ selectedProgress.progress }}%</strong></div><div class="user-dashboard-progress"><i :style="{ width: `${selectedProgress.progress}%` }"></i></div></div><button class="user-dashboard-course-detail user-dashboard-modal-start" @click="learn(selectedCourse)">{{ selectedProgress ? 'Lanjutkan belajar' : 'Mulai belajar' }} <UIcon name="i-lucide-arrow-right" /></button></div></article></div>
  </div>
</template>
