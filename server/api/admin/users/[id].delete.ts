import { createError } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { const admin = await requireAdmin(event); const id = getRouterParam(event, 'id'); if (!id || id === admin.id) throw createError({ statusCode: 400, statusMessage: 'Admin aktif tidak dapat dihapus' }); await database().query('DELETE FROM users WHERE id = ?', [id]); return { ok: true } })
