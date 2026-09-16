<script setup lang="ts">
import { courses, levelNames } from '~/data/courses'
import { courseSlug } from '~/utils/course-route'

const route = useRoute()
const { loadUser } = useAuth()
const fallback = courses.find(item => courseSlug(item.title) === route.params.slug) || courses[0]
const course = ref<any>(fallback)
const databaseCourse = ref<any>(null)
const currentPage = computed(() => Math.max(1, Math.min(Number(route.query.page) || 1, pages.value.length || 1)))
const completedPages = ref<number[]>([])
const fallbackSections = [['Variable', 'Variable adalah tempat menyimpan nilai supaya bisa dipakai ulang di bagian lain program.', 'const namaPengguna = "Ilan";\nlet jumlahPoin = 10;\njumlahPoin += 5;\nconsole.log(jumlahPoin);'], ['Aritmatika & Operator', 'Operator aritmatika dipakai untuk melakukan perhitungan matematis.', 'const a = 10;\nconst b = 3;\nconsole.log(a + b);'], ['Array', 'Array menyimpan kumpulan nilai dalam satu variable.', 'const bahasaPemrograman = ["JavaScript", "Python", "Go"];\nconsole.log(bahasaPemrograman);'], ['Object', 'Object menyimpan data dalam pasangan key dan value.', 'const course = { judul: "JavaScript" };\nconsole.log(course.judul);'], ['Function', 'Function membungkus logika yang dapat dipanggil berulang kali.', 'function hitungTotal(harga, jumlah) { return harga * jumlah; }\nconsole.log(hitungTotal(50000, 3));']]

const pages = computed(() => {
  const nodes = databaseCourse.value?.content?.content
  if (!nodes?.length) return fallbackSections.map(([title, description, code]) => ({ title, nodes: [{ type: 'paragraph', content: [{ text: description }] }, { type: 'courseCodeBlock', attrs: { language: 'javascript' }, content: [{ text: code }] }] }))
  const result = nodes.reduce((result: any[], node: any) => {
    if (node.type === 'horizontalRule') { if (result.at(-1)?.nodes.length) result.push({ title: `Materi ${result.length + 1}`, nodes: [] }); return result }
    const page = result.at(-1) || (result.push({ title: 'Materi Course', nodes: [] }), result.at(-1))
    if (node.type === 'heading' && page.title === 'Materi Course') page.title = nodeText(node)
    else page.nodes.push(node)
    return result
  }, []).filter(page => page.nodes.length)
  return result.map((page, index) => ({ ...page, title: page.nodes.find((node: any) => node.type === 'heading') ? nodeText(page.nodes.find((node: any) => node.type === 'heading')) : index ? `Materi ${index + 1}` : page.title }))
})
const progress = computed(() => pages.value.length ? Math.round((new Set(completedPages.value).size / pages.value.length) * 100) : 0)
const pageComplete = computed(() => completedPages.value.includes(currentPage.value))
const nodeText = (node: any) => (node.content || []).map((item: any) => item.text || '').join('')

useHead(() => ({ title: `${course.value.title} - Coding Camp RPL 2026` }))
onMounted(async () => {
  if (!await loadUser()) return navigateTo({ path: '/login', query: { redirect: route.fullPath } })
  try { databaseCourse.value = (await $fetch<{ course: any }>(`/api/courses/${route.query.id}`)).course; course.value = databaseCourse.value } catch { await navigateTo('/') }
  const saved = localStorage.getItem(`cc-course-progress-${route.query.id || course.value.id}`)
  if (saved) { try { completedPages.value = JSON.parse(saved) } catch {} }
  markVisited(currentPage.value)
})

function saveProgress() { localStorage.setItem(`cc-course-progress-${route.query.id || course.value.id}`, JSON.stringify(completedPages.value)) }
function markVisited(page: number) { const visited = Array.from({ length: Math.max(0, page) }, (_, index) => index + 1); completedPages.value = [...new Set([...completedPages.value, ...visited])]; saveProgress() }
function togglePageComplete() { completedPages.value = pageComplete.value ? completedPages.value.filter(page => page !== currentPage.value) : [...completedPages.value, currentPage.value]; saveProgress() }
function goToPage(page: number) { if (page > currentPage.value) markVisited(currentPage.value); return navigateTo({ query: { ...route.query, page: String(page) } }) }
</script>

<template>
  <SiteNav />
  <main class="course-reader-page">
    <section class="article-hero"><div class="container"><div class="article-meta-row"><span class="article-category">{{ course.category }}</span><span class="article-duration"><UIcon name="i-lucide-clock-3" /> {{ course.duration }}</span><span class="article-level">{{ levelNames[course.level] }}</span></div><h1 class="article-title">{{ course.title }}</h1><p class="article-description">{{ course.description }}</p></div></section>
    <section class="article-body"><div class="container course-reader-layout"><aside class="course-reader-outline"><div class="course-reader-progress-head"><span>Course progress</span><strong>{{ progress }}%</strong></div><div class="course-reader-progress"><i :style="{ width: `${progress}%` }"></i></div><h2>Materi</h2><button v-for="(page, index) in pages" :key="index" :class="{ active: currentPage === index + 1, complete: completedPages.includes(index + 1) }" @click="goToPage(index + 1)"><span>{{ completedPages.includes(index + 1) ? '✓' : String(index + 1).padStart(2, '0') }}</span>{{ page.title }}</button></aside><article class="article-content course-reader-content"><div class="course-reader-kicker"><span>Page {{ currentPage }} of {{ pages.length }}</span><span>{{ pageComplete ? 'Completed' : 'In progress' }}</span></div><h2 class="course-reader-page-title">{{ pages[currentPage - 1]?.title }}</h2><div v-if="pages[currentPage - 1]" class="rich-reader"><template v-for="(node, index) in pages[currentPage - 1].nodes" :key="index"><h2 v-if="node.type === 'heading'" :class="`reader-heading reader-heading-${node.attrs?.level || 2}`">{{ nodeText(node) }}</h2><p v-else-if="node.type === 'paragraph'" class="reader-paragraph"><template v-for="(item, itemIndex) in node.content || []" :key="itemIndex"><code v-if="item.marks?.some((mark: any) => mark.type === 'code')">{{ item.text }}</code><strong v-else-if="item.marks?.some((mark: any) => mark.type === 'bold')">{{ item.text }}</strong><em v-else-if="item.marks?.some((mark: any) => mark.type === 'italic')">{{ item.text }}</em><span v-else>{{ item.text }}</span></template></p><CodePlayground v-else-if="node.type === 'courseCodeBlock'" :code="nodeText(node)" :filename="`${node.attrs?.language || 'javascript'}.js`" /><img v-else-if="node.type === 'image'" class="reader-image" :src="node.attrs?.src" :alt="node.attrs?.alt || 'Course image'"><ul v-else-if="node.type === 'bulletList'" class="reader-list"><li v-for="(item, itemIndex) in node.content || []" :key="itemIndex">{{ nodeText(item) }}</li></ul><ol v-else-if="node.type === 'orderedList'" class="reader-list"><li v-for="(item, itemIndex) in node.content || []" :key="itemIndex">{{ nodeText(item) }}</li></ol><blockquote v-else-if="node.type === 'blockquote'" class="reader-quote">{{ nodeText(node) }}</blockquote><hr v-else-if="node.type === 'horizontalRule'" class="reader-divider"><pre v-else-if="node.type === 'codeBlock'" class="reader-code"><code>{{ nodeText(node) }}</code></pre></template></div><div class="course-reader-actions"><button class="course-reader-complete" :class="{ completed: pageComplete }" @click="togglePageComplete"><UIcon :name="pageComplete ? 'i-lucide-check-circle-2' : 'i-lucide-circle'" />{{ pageComplete ? 'Halaman selesai' : 'Tandai halaman selesai' }}</button><div class="course-reader-navigation"><button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)"><UIcon name="i-lucide-arrow-left" /> Sebelumnya</button><button :disabled="currentPage === pages.length" @click="goToPage(currentPage + 1)">Berikutnya <UIcon name="i-lucide-arrow-right" /></button></div></div><div class="article-nav-footer"><NuxtLink to="/dashboard/course">&lt;- Kembali ke Course</NuxtLink></div></article></div></section>
  </main>
  <SiteFooter />
</template>
