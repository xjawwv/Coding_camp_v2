<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; submit: [quiz: { question: string; options: string[]; correctIndex: number; explanation: string }] }>()
const question = ref('')
const options = ref(['', '', '', ''])
const correctIndex = ref(0)
const explanation = ref('')
function save() { if (!question.value.trim() || options.value.filter(Boolean).length < 2) return; emit('submit', { question: question.value.trim(), options: options.value.filter(Boolean), correctIndex: correctIndex.value, explanation: explanation.value.trim() }); question.value = ''; options.value = ['', '', '', '']; correctIndex.value = 0; explanation.value = '' }
</script>
<template><div v-if="props.open" class="quiz-modal-backdrop" @click.self="emit('close')"><form class="quiz-modal" @submit.prevent="save"><div class="quiz-modal-header"><h2>Buat Quiz</h2><button type="button" aria-label="Tutup" @click="emit('close')">×</button></div><label>Pertanyaan<textarea v-model="question" required placeholder="Contoh: Keyword apa untuk nilai konstan?"></textarea></label><div class="quiz-options"><label v-for="(_, index) in options" :key="index">Pilihan {{ index + 1 }}<input v-model="options[index]" :placeholder="`Pilihan ${index + 1}`"><span><input v-model="correctIndex" type="radio" name="correct" :value="index"> Jawaban benar</span></label></div><label>Penjelasan setelah menjawab<textarea v-model="explanation" placeholder="Jelaskan jawaban yang benar..."></textarea></label><div class="quiz-modal-actions"><button type="button" class="button-outline" @click="emit('close')">Batal</button><button type="submit" class="button-primary">Sisipkan Quiz</button></div></form></div></template>
