import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); const id = getRouterParam(event, 'id'); const body = await readBody<Record<string, string>>(event); if (!id || !body.title?.trim()) throw createError({ statusCode: 400, statusMessage: 'Data course tidak valid' }); await database().query('UPDATE courses SET title = ?, description = ?, learning_objectives = ?, image = ?, level = ?, category = ?, duration = ?, uploaded_at = ? WHERE id = ?', [body.title.trim(), body.description.trim(), body.learningObjectives.trim(), body.image.trim(), body.level, body.category.trim(), body.duration.trim(), body.uploadedAt, id]); return { ok: true } })
