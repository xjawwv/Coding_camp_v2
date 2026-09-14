import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); const [rows] = await database().query('SELECT * FROM courses ORDER BY created_at DESC'); return { courses: rows } })
