<script setup lang="ts">
import { courses, levelNames } from '~/data/courses'

const route = useRoute()
const course = courses.find(item => item.id === Number(route.query.id)) || courses[0]
const sections = [
  ['Variable', 'Variable adalah tempat menyimpan nilai supaya bisa dipakai ulang di bagian lain program.', 'const namaPengguna = "Ilan";\nlet jumlahPoin = 10;\njumlahPoin += 5;\nconsole.log(jumlahPoin);'],
  ['Aritmatika & Operator', 'Operator aritmatika dipakai untuk melakukan perhitungan matematis dan menjadi dasar dari hampir semua logika program.', 'const a = 10;\nconst b = 3;\nconsole.log(a + b);\nconsole.log(a ** b);'],
  ['Array', 'Array menyimpan kumpulan nilai dalam satu variable, diakses lewat index yang dimulai dari angka 0.', 'const bahasaPemrograman = ["JavaScript", "Python", "Go"];\nbahasaPemrograman.push("Rust");\nconsole.log(bahasaPemrograman);'],
  ['Object', 'Object menyimpan data dalam pasangan key dan value, cocok untuk merepresentasikan entitas dengan banyak properti.', 'const course = { judul: "JavaScript", level: "beginner" };\nconsole.log(course.judul);'],
  ['Function', 'Function membungkus sekumpulan logika yang bisa dipanggil berulang kali tanpa menulis ulang kodenya.', 'function hitungTotal(harga, jumlah) {\n  return harga * jumlah;\n}\nconsole.log(hitungTotal(50000, 3));']
]
useHead({ title: `${course.title} - Coding Camp RPL 2026` })
</script>
<template>
  <SiteNav />
  <main><section class="article-hero"><div class="container"><div class="article-meta-row"><span class="article-category">{{ course.category }}</span><span class="article-duration">◷ {{ course.duration }}</span><span class="article-level">{{ levelNames[course.level] }}</span></div><h1 class="article-title">{{ course.title }}</h1><p class="article-description">Fondasi wajib sebelum lanjut ke framework atau library apapun, baik untuk pengembangan web, mobile maupun backend. Materi ini membahas variabel, tipe data, operator aritmatika, array, object, dan function dari nol.</p></div></section><section class="article-body"><div class="container"><article class="article-content"><div v-for="(section, index) in sections" :key="section[0]" class="content-section"><p class="section-number">{{ String(index + 1).padStart(2, '0') }}</p><h2 class="content-heading">{{ section[0] }}</h2><p class="content-paragraph">{{ section[1] }} JavaScript modern punya sintaks yang sederhana dan fleksibel untuk membangun aplikasi.</p><CodePlayground :code="section[2]" :filename="`${section[0].toLowerCase().replaceAll(' ', '-')}.js`" /></div><div class="article-nav-footer"><NuxtLink to="/#course">&lt;- Kembali ke Course</NuxtLink></div></article></div></section></main>
  <SiteFooter />
</template>
