import { createError } from 'h3'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const files: Record<string, string> = { auth: 'AUTH.md', admin: 'ADMIN.md', uploads: 'UPLOADS.md', 'course-content': 'COURSE_CONTENT.md' }
export default defineEventHandler(async event => { const filename = files[String(getRouterParam(event, 'slug'))]; if (!filename) throw createError({ statusCode: 404, statusMessage: 'Dokumentasi tidak ditemukan' }); return readFile(resolve(process.cwd(), filename), 'utf8') })
