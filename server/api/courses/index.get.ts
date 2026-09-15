import { database } from '../../utils/db'

export default defineEventHandler(async () => { const [rows] = await database().query("SELECT id, title, description, learning_objectives AS learningObjectives, image, level, category, duration, uploaded_at AS uploadedAt FROM courses WHERE status = 'published' ORDER BY created_at DESC"); return { courses: rows } })
