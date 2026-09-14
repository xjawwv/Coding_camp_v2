import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); const [rows] = await database().query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'); return { users: rows } })
