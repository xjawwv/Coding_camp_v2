import { Node } from '@tiptap/core'

export const CourseQuiz = Node.create({
  name: 'courseQuiz',
  group: 'block',
  atom: true,
  addAttributes: () => ({ question: { default: 'Pertanyaan quiz' }, options: { default: ['Pilihan A', 'Pilihan B', 'Pilihan C'] }, correctIndex: { default: 0 }, explanation: { default: '' } }),
  parseHTML: () => [{ tag: 'div[data-course-quiz]' }],
  renderHTML: ({ node }) => ['div', { 'data-course-quiz': '', 'data-question': node.attrs.question }],
  addCommands: () => ({ setCourseQuiz: (attributes: Record<string, unknown>) => ({ commands }: any) => commands.insertContent({ type: 'courseQuiz', attrs: attributes }) })
})
