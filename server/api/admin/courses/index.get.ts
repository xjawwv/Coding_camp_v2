import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'
import { normalizeCourseContent } from '../../../utils/course-content'

export default defineEventHandler(async event => { await requireAdmin(event); const [rows] = await database().query("SELECT id, title, description, learning_objectives, content, image, level, category, duration, uploaded_at, COALESCE(NULLIF(status, ''), 'draft') AS status FROM courses ORDER BY created_at DESC"); return { courses: (rows as any[]).map(course => ({ ...course, content: normalizeCourseContent(course.content) })) } })
