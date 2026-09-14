import { createError } from 'h3'
import { database } from '../../utils/db'

export default defineEventHandler(async event => { const id = getRouterParam(event, 'id'); const [rows] = await database().query('SELECT id, title, description, learning_objectives, image, level, category, duration, uploaded_at, content FROM courses WHERE id = ?', [id]); const course = (rows as any[])[0]; if (!course) throw createError({ statusCode: 404, statusMessage: 'Course tidak ditemukan' }); return { course } })
