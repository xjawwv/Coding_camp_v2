<script setup lang="ts">
import ImageUploadField from '~/components/ImageUploadField.vue'

definePageMeta({ layout: 'dashboard' })
const route = useRoute()
const { user, loadUser } = useAuth()
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const imageFile = ref<File | null>(null)
const courseImage = ref('')
const status = ref<'draft' | 'published'>('draft')
const quizground = computed(() => typeof route.query.quizground === 'string' ? route.query.quizground : '')
const emptyContent = () => ({ type: 'doc', content: [{ type: 'paragraph' }] })
const form = reactive({ title: '', description: '', learningObjectives: '', content: emptyContent(), level: 'beginner', category: '', duration: '', uploadedAt: '' })

async function loadCourse() {
  if (!await loadUser()) return navigateTo({ path: '/login', query: { redirect: route.fullPath } })
  if (user.value?.role !== 'admin') return navigateTo('/dashboard')
  const result = await $fetch<{ course: any }>(`/api/admin/courses/${route.params.id_course}`)
  const course = result.course
  status.value = course.status === 'published' ? 'published' : 'draft'
  courseImage.value = course.image
  Object.assign(form, { title: course.title, description: course.description, learningObjectives: course.learning_objectives, content: course.content || emptyContent(), level: course.level, category: course.category, duration: course.duration, uploadedAt: course.uploaded_at })
  loading.value = false
}

async function saveCourse() {
  saving.value = true
  errorMessage.value = ''
  try {
    const body = new FormData()
    Object.entries(form).forEach(([key, value]) => body.append(key, key === 'content' ? JSON.stringify(value) : value))
    if (imageFile.value) body.append('image', imageFile.value)
    await $fetch(`/api/admin/courses/${route.params.id_course}`, { method: 'PUT', body })
    await loadCourse()
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || error.data?.message || 'Course gagal disimpan'
  } finally {
    saving.value = false
  }
}

async function changeStatus(action: 'publish' | 'unpublish') {
  await $fetch(`/api/admin/courses/${route.params.id_course}/${action}`, { method: 'POST' })
  status.value = action === 'publish' ? 'published' : 'draft'
}
function saveQuiz(quiz: { question: string; options: string[]; correctIndex: number; explanation: string }) { const content = form.content as any; content.content ||= []; content.content.push({ type: 'courseQuiz', attrs: quiz }); navigateTo({ path: route.path, query: {} }) }

onMounted(loadCourse)
</script>
<template>
  <UDashboardPanel id="course-editor">
    <template #header>
      <UDashboardNavbar title="Edit Course">
        <template #leading><UDashboardSidebarCollapse /></template>
        <template #right><UBadge :color="status === 'published' ? 'success' : 'warning'" variant="subtle">{{ status === 'published' ? 'Published' : 'Draft' }}</UBadge></template>
      </UDashboardNavbar>
      <UDashboardToolbar><template #left><UButton to="/admin/courses" label="Kembali ke Course" color="neutral" variant="ghost" /></template></UDashboardToolbar>
    </template>
    <template #body>
      <QuizgroundEditor v-if="quizground" @save="saveQuiz" @cancel="navigateTo({ path: route.path, query: {} })" />
      <template v-else>
      <div v-if="loading" class="p-8 text-muted">Memuat course...</div>
      <div v-else class="space-y-6">
        <p v-if="errorMessage" class="text-error">{{ errorMessage }}</p>
        <UPageCard title="Course Editor" description="Edit metadata dan materi rich text." icon="i-lucide-pencil">
          <form class="grid gap-3 md:grid-cols-3" @submit.prevent="saveCourse">
            <UInput v-model="form.title" placeholder="Judul course" required /><UInput v-model="form.category" placeholder="Kategori" required /><UInput v-model="form.duration" placeholder="Durasi" required />
            <ImageUploadField v-model="imageFile" :existing-url="courseImage" :required="false" /><USelect v-model="form.level" :items="[{ label: 'Dasar', value: 'beginner' }, { label: 'Menengah', value: 'intermediate' }, { label: 'Sulit', value: 'advanced' }]" value-key="value" /><UInput v-model="form.uploadedAt" type="date" required />
            <UTextarea v-model="form.description" class="md:col-span-3" placeholder="Deskripsi" required /><UTextarea v-model="form.learningObjectives" class="md:col-span-3" placeholder="Tujuan pembelajaran" required />
            <div class="md:col-span-3"><p class="mb-2 text-sm font-medium">Materi Course</p><RichTextEditor v-model="form.content" /></div>
            <div class="flex gap-2 md:col-span-3"><UButton type="submit" :loading="saving" label="Simpan Perubahan" color="primary" /><UButton v-if="status === 'draft'" label="Publish" icon="i-lucide-rocket" color="success" variant="soft" type="button" @click="changeStatus('publish')" /><UButton v-else label="Unpublish" icon="i-lucide-eye-off" color="warning" variant="soft" type="button" @click="changeStatus('unpublish')" /></div>
          </form>
        </UPageCard>
      </div>
      </template>
    </template>
  </UDashboardPanel>
</template>
