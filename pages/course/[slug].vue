<script setup lang="ts">
import { courses, levelNames } from '~/data/courses'
import { courseSlug } from '~/utils/course-route'

const route = useRoute()
const { loadUser } = useAuth()
const fallback = courses.find(item => courseSlug(item.title) === route.params.slug) || courses[0]
const course = ref<any>(fallback)
const databaseCourse = ref<any>(null)
const requestedPage = computed(() => Math.max(1, Math.min(Number(route.query.page) || 1, pages.value.length || 1)))
const currentPage = computed(() => { const maxUnlocked = Math.max(1, ...completedPages.value.map(page => page + 1)); return Math.min(requestedPage.value, maxUnlocked, pages.value.length || 1) })
const completedPages = ref<number[]>([])
const scrollDepth = ref(0)
const showFinishDialog = ref(false)
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
const progress = computed(() => pages.value.length ? Math.min(100, Math.round(((new Set(completedPages.value).size + (completedPages.value.includes(currentPage.value) ? 0 : scrollDepth.value / 100)) / pages.value.length) * 100)) : 0)
const nodeText = (node: any) => (node.content || []).map((item: any) => item.text || '').join('')
const isUnlocked = (index: number) => index === 0 || completedPages.value.includes(index)
const isPartial = (index: number) => index + 1 === currentPage.value && !completedPages.value.includes(index + 1) && scrollDepth.value > 0

useHead(() => ({ title: `${course.value.title} - Coding Camp RPL 2026` }))
onMounted(async () => {
  if (!await loadUser()) return navigateTo({ path: '/login', query: { redirect: route.fullPath } })
  try {
    databaseCourse.value = (await $fetch<{ course: any }>(`/api/courses/${route.query.id}`)).course
    course.value = databaseCourse.value
  } catch { await navigateTo('/') }
  const progressKey = `cc-course-progress-${route.query.id || course.value.id}`
  try {
    const saved = await $fetch<{ progress: { completedPages: number[] } }>(`/api/courses/${route.query.id || course.value.id}/progress`)
    completedPages.value = saved.progress.completedPages || []
    localStorage.setItem(progressKey, JSON.stringify(completedPages.value))
  } catch {
    const saved = localStorage.getItem(progressKey)
    if (saved) { try { completedPages.value = JSON.parse(saved) } catch {} }
  }
  window.addEventListener('scroll', updateScrollDepth, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateScrollDepth))
watch(currentPage, async () => { scrollDepth.value = 0; await nextTick(); window.scrollTo({ top: 0, behavior: 'smooth' }) })

async function saveProgress() {
  const courseId = String(route.query.id || course.value.id)
  localStorage.setItem(`cc-course-progress-${courseId}`, JSON.stringify(completedPages.value))
  try { await $fetch(`/api/courses/${courseId}/progress`, { method: 'PUT', body: { completedPages: completedPages.value, progress: progress.value } }) } catch {}
}
function updateScrollDepth() { const article = document.querySelector('.course-reader-content'); if (!article) return; const articleTop = article.getBoundingClientRect().top + window.scrollY; const maxScroll = article.scrollHeight - window.innerHeight; scrollDepth.value = maxScroll <= 0 ? 100 : Math.min(100, Math.max(0, Math.round(((window.scrollY - articleTop) / maxScroll) * 100))); if (scrollDepth.value >= 90 && !completedPages.value.includes(currentPage.value)) { completedPages.value = [...completedPages.value, currentPage.value]; saveProgress() } }
function goToPage(page: number) { return navigateTo({ query: { ...route.query, page: String(page) } }) }
function requestFinish() { updateScrollDepth(); showFinishDialog.value = true }
async function finishCourse() { showFinishDialog.value = false; completedPages.value = Array.from({ length: pages.value.length }, (_, index) => index + 1); await saveProgress(); navigateTo('/dashboard/course') }
</script>

<template>
  <SiteNav />
  <main class="course-reader-page">
    <section class="article-hero"><div class="container"><div class="article-meta-row"><span class="article-category">{{ course.category }}</span><span class="article-duration"><UIcon name="i-lucide-clock-3" /> {{ course.duration }}</span><span class="article-level">{{ levelNames[course.level] }}</span></div><h1 class="article-title">{{ course.title }}</h1><p class="article-description">{{ course.description }}</p></div></section>
    <section class="article-body"><div class="container course-reader-layout"><aside class="course-reader-outline"><div class="course-reader-progress-head"><span>Course progress</span><strong>{{ progress }}%</strong></div><div class="course-reader-progress"><i :style="{ width: `${progress}%` }"></i></div><h2>Materi</h2><button v-for="(page, index) in pages" :key="index" :disabled="!isUnlocked(index)" :class="{ active: currentPage === index + 1, complete: completedPages.includes(index + 1), partial: isPartial(index), locked: !isUnlocked(index) }" @click="goToPage(index + 1)"><span><UIcon :name="completedPages.includes(index + 1) ? 'i-lucide-check' : !isUnlocked(index) ? 'i-lucide-lock' : isPartial(index) ? 'i-lucide-check' : 'i-lucide-circle'" /></span>{{ page.title }}</button></aside><article class="article-content course-reader-content"><div class="course-reader-kicker"><span>Page {{ currentPage }} of {{ pages.length }}</span><span>{{ scrollDepth }}% read</span></div><div v-if="pages[currentPage - 1]" class="rich-reader"><template v-for="(node, index) in pages[currentPage - 1].nodes" :key="index"><h2 v-if="node.type === 'heading'" :class="`reader-heading reader-heading-${node.attrs?.level || 2}`">{{ nodeText(node) }}</h2><p v-else-if="node.type === 'paragraph'" class="reader-paragraph"><template v-for="(item, itemIndex) in node.content || []" :key="itemIndex"><code v-if="item.marks?.some((mark: any) => mark.type === 'code')">{{ item.text }}</code><strong v-else-if="item.marks?.some((mark: any) => mark.type === 'bold')">{{ item.text }}</strong><em v-else-if="item.marks?.some((mark: any) => mark.type === 'italic')">{{ item.text }}</em><span v-else>{{ item.text }}</span></template></p><CodePlayground v-else-if="node.type === 'courseCodeBlock'" :code="nodeText(node)" :filename="`${node.attrs?.language || 'javascript'}.js`" /><img v-else-if="node.type === 'image'" class="reader-image" :src="node.attrs?.src" :alt="node.attrs?.alt || 'Course image'"><ul v-else-if="node.type === 'bulletList'" class="reader-list"><li v-for="(item, itemIndex) in node.content || []" :key="itemIndex">{{ nodeText(item) }}</li></ul><ol v-else-if="node.type === 'orderedList'" class="reader-list"><li v-for="(item, itemIndex) in node.content || []" :key="itemIndex">{{ nodeText(item) }}</li></ol><blockquote v-else-if="node.type === 'blockquote'" class="reader-quote">{{ nodeText(node) }}</blockquote><hr v-else-if="node.type === 'horizontalRule'" class="reader-divider"><pre v-else-if="node.type === 'codeBlock'" class="reader-code"><code>{{ nodeText(node) }}</code></pre></template></div><div class="course-reader-actions"><div class="course-reader-navigation"><button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)"><UIcon name="i-lucide-arrow-left" /> Sebelumnya</button><button v-if="currentPage < pages.length" @click="goToPage(currentPage + 1)">Berikutnya <UIcon name="i-lucide-arrow-right" /></button><button v-else @click="requestFinish">Selesai <UIcon name="i-lucide-check" /></button></div></div></article></div></section>
    <div v-if="showFinishDialog" class="course-finish-dialog" @click.self="showFinishDialog = false"><div><UIcon name="i-lucide-circle-check" /><h2>Akhiri course?</h2><p>Apakah kamu yakin ingin menyelesaikan materi course ini?</p><div><button @click="showFinishDialog = false">Belum</button><button @click="finishCourse">Ya, selesaikan</button></div></div></div>
  </main>
  <SiteFooter />
</template>
