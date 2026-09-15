<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{ modelValue: Record<string, unknown> | string | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>] }>()
const parseContent = (value: typeof props.modelValue) => { if (!value) return { type: 'doc', content: [{ type: 'paragraph' }] }; if (typeof value === 'object') return value; try { return JSON.parse(value) } catch { return { type: 'doc', content: [{ type: 'paragraph' }] } } }
const editor = useEditor({ extensions: [StarterKit, Placeholder.configure({ placeholder: 'Tulis materi course di sini...' })], content: parseContent(props.modelValue), onUpdate: ({ editor: instance }) => emit('update:modelValue', instance.getJSON() as Record<string, unknown>) })
watch([editor, () => props.modelValue], ([instance, value]) => { if (instance) { const content = parseContent(value); if (JSON.stringify(instance.getJSON()) !== JSON.stringify(content)) instance.commands.setContent(content, false) } }, { deep: true, immediate: true })
onBeforeUnmount(() => editor.value?.destroy())
</script>
<template>
  <div v-if="editor" class="rich-editor"><div class="rich-editor-toolbar"><button type="button" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()"><strong>B</strong></button><button type="button" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()"><em>I</em></button><button type="button" :class="{ active: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button><button type="button" :class="{ active: editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">H3</button><button type="button" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">• List</button><button type="button" :class="{ active: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">1. List</button><button type="button" :class="{ active: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">Quote</button><button type="button" @click="editor.chain().focus().setHorizontalRule().run()">Divider</button><span></span><button type="button" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()">↶</button><button type="button" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()">↷</button></div><EditorContent :editor="editor" class="rich-editor-content" /></div>
</template>
