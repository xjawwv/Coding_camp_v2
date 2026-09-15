import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); const [rows] = await database().query('SELECT id, title, description, learning_objectives, content, image, level, category, duration, uploaded_at FROM courses ORDER BY created_at DESC'); return { courses: rows } })
