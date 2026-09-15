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
    setCourseCode: (attributes = { language: 'javascript', runnable: true }) => ({ state, dispatch }: any) => {
      const position = state.selection.to
      const node = state.schema.nodes.courseCodeBlock.create(attributes, state.schema.text('// Tulis kode JavaScript di sini'))
      if (dispatch) dispatch(state.tr.insert(position, node).setSelection(state.selection.constructor.near(state.tr.doc.resolve(position + 1))))
      return true
    }
  })
})
