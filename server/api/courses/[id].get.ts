import { createError } from 'h3'
import { database } from '../../utils/db'
import { normalizeCourseContent } from '../../utils/course-content'

export default defineEventHandler(async event => { const [rows] = await database().query('SELECT id, title, description, learning_objectives, content, image, level, category, duration, uploaded_at, status FROM courses WHERE id = ? AND status = \'published\'', [getRouterParam(event, 'id')]); const course = (rows as any[])[0]; if (!course) throw createError({ statusCode: 404, statusMessage: 'Course tidak ditemukan atau belum dipublish' }); return { course: { ...course, content: normalizeCourseContent(course.content) } } })
