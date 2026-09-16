import { currentUser } from '../utils/auth'
import { database } from '../utils/db'

export default defineEventHandler(async event => {
  const user = await currentUser(event)
  if (!user) return { progress: [] }
  try {
    const [rows] = await database().query('SELECT p.course_id AS courseId, c.title, c.image, c.category, c.duration, p.progress, p.updated_at AS updatedAt FROM course_progress p JOIN courses c ON c.id = p.course_id WHERE p.user_id = ? ORDER BY p.updated_at DESC', [user.id])
    return { progress: rows }
  } catch { return { progress: [] } }
})
