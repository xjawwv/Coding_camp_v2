import { createError } from 'h3'
import { database } from '../../utils/db'

export default defineEventHandler(async event => { const [rows] = await database().query('SELECT id, title, description, learning_objectives, content, image, level, category, duration, uploaded_at FROM courses WHERE id = ?', [getRouterParam(event, 'id')]); const course = (rows as any[])[0]; if (!course) throw createError({ statusCode: 404, statusMessage: 'Course tidak ditemukan' }); return { course } })
