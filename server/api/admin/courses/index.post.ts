import { createError, readBody } from 'h3'
import { randomUUID } from 'node:crypto'
import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); const body = await readBody<Record<string, unknown>>(event); const required = ['title', 'description', 'learningObjectives', 'image', 'level', 'category', 'duration', 'uploadedAt']; if (required.some(key => typeof body[key] !== 'string' || !(body[key] as string).trim())) throw createError({ statusCode: 400, statusMessage: 'Semua field course wajib diisi' }); const content = body.content || { type: 'doc', content: [{ type: 'paragraph' }] }; await database().query('INSERT INTO courses (id, title, description, learning_objectives, content, image, level, category, duration, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [randomUUID(), (body.title as string).trim(), (body.description as string).trim(), (body.learningObjectives as string).trim(), JSON.stringify(content), (body.image as string).trim(), body.level, (body.category as string).trim(), (body.duration as string).trim(), body.uploadedAt]); return { ok: true } })
