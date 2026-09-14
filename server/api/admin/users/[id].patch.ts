import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { const admin = await requireAdmin(event); const id = getRouterParam(event, 'id'); const body = await readBody<{ name?: string; role?: 'user' | 'admin' }>(event); if (!id || (!body.name && !body.role)) throw createError({ statusCode: 400, statusMessage: 'Data user tidak valid' }); if (id === admin.id && body.role === 'user') throw createError({ statusCode: 400, statusMessage: 'Admin aktif tidak dapat menurunkan rolenya sendiri' }); await database().query('UPDATE users SET name = COALESCE(?, name), role = COALESCE(?, role) WHERE id = ?', [body.name?.trim() || null, body.role || null, id]); return { ok: true } })
