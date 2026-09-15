<script setup lang="ts">
defineProps<{ modelValue: File | null; existingUrl?: string; required?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [file: File | null] }>()
const input = ref<HTMLInputElement | null>(null)
const preview = ref('')
function choose(event: Event) { const file = (event.target as HTMLInputElement).files?.[0] || null; emit('update:modelValue', file); if (file) preview.value = URL.createObjectURL(file) }
</script>
<template>
  <div class="image-upload-field"><input ref="input" class="sr-only" type="file" accept=".png,.jpg,.jpeg,.webp,.gif" :required="required" @change="choose"><button type="button" class="image-upload-card" @click="input?.click()"><span v-if="preview || existingUrl" class="image-upload-preview"><img :src="preview || existingUrl" alt="Preview cover course"></span><span v-else class="image-upload-icon">↑</span><span class="image-upload-copy"><strong>{{ modelValue ? modelValue.name : existingUrl ? 'Ganti cover image' : 'Pilih cover image' }}</strong><small>PNG, JPG, WebP atau GIF · maksimal 2 MB</small></span><span class="image-upload-action">Browse</span></button></div>
</template>
