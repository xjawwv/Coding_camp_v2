import { createError, readBody } from 'h3'
import { randomUUID } from 'node:crypto'
import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); const body = await readBody<Record<string, string>>(event); const required = ['title', 'description', 'learningObjectives', 'image', 'level', 'category', 'duration', 'uploadedAt']; if (required.some(key => !body[key]?.trim())) throw createError({ statusCode: 400, statusMessage: 'Semua field course wajib diisi' }); await database().query('INSERT INTO courses (id, title, description, learning_objectives, image, level, category, duration, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [randomUUID(), body.title.trim(), body.description.trim(), body.learningObjectives.trim(), body.image.trim(), body.level, body.category.trim(), body.duration.trim(), body.uploadedAt]); return { ok: true } })
