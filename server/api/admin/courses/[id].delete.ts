import { requireAdmin } from '../../../utils/auth'
import { database } from '../../../utils/db'

export default defineEventHandler(async event => { await requireAdmin(event); await database().query('DELETE FROM courses WHERE id = ?', [getRouterParam(event, 'id')]); return { ok: true } })
