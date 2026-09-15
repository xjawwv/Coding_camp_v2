<script setup lang="ts">
const props = defineProps<{ question: string; options: string[]; correctIndex: number; explanation?: string }>()
const selected = ref<number | null>(null)
const answered = ref(false)
const score = ref(0)
function answer(index: number) { if (answered.value) return; selected.value = index; answered.value = true; if (index === props.correctIndex) score.value = 1 }
function retry() { selected.value = null; answered.value = false; score.value = 0 }
</script>
<template><section class="quiz-block"><div class="quiz-block-label">QUIZGROUND</div><h3>{{ question }}</h3><div class="quiz-options-reader"><button v-for="(option, index) in options" :key="option" :class="{ correct: answered && index === correctIndex, wrong: answered && selected === index && index !== correctIndex }" @click="answer(index)"><span>{{ String.fromCharCode(65 + index) }}</span>{{ option }}</button></div><div v-if="answered" :class="['quiz-feedback', score ? 'is-correct' : 'is-wrong']"><strong>{{ score ? 'Benar!' : 'Belum tepat' }}</strong><p v-if="explanation">{{ explanation }}</p><button class="quiz-retry" @click="retry">Coba lagi</button></div></section></template>
