import { createError } from 'h3'
import { currentUser } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => {
  const user = await currentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
  const [rows] = await database().query('SELECT completed_pages AS completedPages, progress, completed_at AS completedAt, updated_at AS updatedAt FROM course_progress WHERE user_id = ? AND course_id = ?', [user.id, getRouterParam(event, 'id')])
  const progress = (rows as any[])[0]
  return { progress: progress ? { ...progress, completedPages: typeof progress.completedPages === 'string' ? JSON.parse(progress.completedPages) : progress.completedPages } : { completedPages: [], progress: 0, completedAt: null, updatedAt: null } }
})
