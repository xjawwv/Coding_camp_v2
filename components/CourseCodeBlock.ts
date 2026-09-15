import { Node } from '@tiptap/core'

export const CourseCodeBlock = Node.create({
  name: 'courseCodeBlock',
  group: 'block',
  content: 'text*',
  code: true,
  defining: true,
  addAttributes: () => ({ language: { default: 'javascript' }, runnable: { default: true } }),
  parseHTML: () => [{ tag: 'pre[data-course-code]' }],
  renderHTML: ({ node }) => ['pre', { 'data-course-code': '', 'data-language': node.attrs.language, 'data-runnable': node.attrs.runnable }, ['code', 0]],
  addCommands: () => ({
    setCourseCode: (attributes = { language: 'javascript', runnable: true }) => ({ commands }: any) => commands.insertContent({ type: 'courseCodeBlock', attrs: attributes, content: [{ type: 'text', text: '' }] })
  })
})
