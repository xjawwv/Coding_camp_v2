import { createError, readBody } from 'h3'
import { database } from '../../utils/db'
import { createSession, verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const [rows] = await database().query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [body.email?.trim().toLowerCase()])
  const user = (rows as any[])[0]
  if (!user || !body.password || !(await verifyPassword(body.password, user.password_hash))) throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' })
  delete user.password_hash
  await createSession(event, user.id)
  return { user }
})
