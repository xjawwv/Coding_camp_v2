<script setup lang="ts">
const props = defineProps<{ code: string; filename?: string }>()
const source = ref(props.code)
const output = ref<string[]>([])
const running = ref(false)
const frame = ref<HTMLIFrameElement>()
const runId = `code-${Math.random().toString(36).slice(2)}`

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const highlighted = computed(() => escapeHtml(source.value).replace(/(\/\/[^\n]*|&quot;[^&]*&quot;|'[^']*'|\b(?:const|let|var|function|return|new|if|else)\b|\b(?:true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b|\b(?:console|log)\b)/g, '<span class="token">$1</span>'))

function runCode() {
  output.value = []
  running.value = true
  frame.value?.contentWindow?.postMessage({ type: 'run', id: runId, code: source.value }, '*')
}

function onMessage(event: MessageEvent) {
  if (event.source !== frame.value?.contentWindow || event.data?.id !== runId) return
  if (event.data.type === 'output') output.value.push(event.data.value)
  if (event.data.type === 'done') running.value = false
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>
<template>
  <div class="code-playground">
    <div class="code-toolbar"><div class="window-dots"><i></i><i></i><i></i></div><span>{{ filename || 'javascript.js' }}</span><button type="button" :disabled="running" @click="runCode">{{ running ? 'Running...' : 'Run' }}</button></div>
    <div class="code-editor"><pre aria-hidden="true" v-html="highlighted"></pre><textarea v-model="source" spellcheck="false" aria-label="Editor kode JavaScript"></textarea></div>
    <div v-if="output.length || running" class="code-output"><span class="output-label">Output</span><p v-for="(line, index) in output" :key="index">{{ line }}</p><p v-if="running">Menjalankan kode...</p></div>
    <iframe ref="frame" class="code-runner" title="JavaScript sandbox" sandbox="allow-scripts" :srcdoc="`<script>onmessage=function(e){if(e.data.type!=='run')return;try{console.log=function(){parent.postMessage({id:e.data.id,type:'output',value:Array.from(arguments).map(String).join(' ')},'*')};new Function(e.data.code)();parent.postMessage({id:e.data.id,type:'done'},'*')}catch(x){parent.postMessage({id:e.data.id,type:'output',value:'Error: '+x.message},'*');parent.postMessage({id:e.data.id,type:'done'},'*')}}<\/script>`" />
  </div>
</template>
