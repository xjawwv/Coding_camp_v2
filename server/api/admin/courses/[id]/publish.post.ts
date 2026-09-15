import { createError } from 'h3'
import { requireAdmin } from '../../../../utils/auth'
import { database } from '../../../../utils/db'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Course tidak valid' })
  const [result] = await database().query("UPDATE courses SET status = 'published' WHERE id = ?", [id])
  if (!(result as any).affectedRows) throw createError({ statusCode: 404, statusMessage: 'Course tidak ditemukan' })
  return { ok: true, status: 'published' }
})
