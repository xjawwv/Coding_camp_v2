import { createError, readBody } from 'h3'
import { currentUser } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => {
  const user = await currentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
  const body = await readBody<{ completedPages?: unknown; progress?: unknown }>(event)
  const completedPages = Array.isArray(body?.completedPages) ? [...new Set(body.completedPages.filter(page => Number.isInteger(page) && Number(page) > 0))].sort((a, b) => Number(a) - Number(b)) : []
  const progress = Math.max(0, Math.min(100, Number(body?.progress) || 0))
  await database().query('INSERT INTO course_progress (user_id, course_id, completed_pages, progress, completed_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE completed_pages = VALUES(completed_pages), progress = VALUES(progress), completed_at = VALUES(completed_at)', [user.id, getRouterParam(event, 'id'), JSON.stringify(completedPages), progress, progress === 100 ? new Date() : null])
  return { progress: { completedPages, progress } }
})
