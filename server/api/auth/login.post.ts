import { readBody, setResponseStatus } from 'h3'
import { database } from '../../utils/db'
import { createSession, verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const [rows] = await database().query('SELECT id, name, email, role, password_hash FROM users WHERE email = ?', [body.email?.trim().toLowerCase()])
  const user = (rows as any[])[0]
  if (!user || !body.password || !(await verifyPassword(body.password, user.password_hash))) {
    setResponseStatus(event, 401)
    return { error: true, message: 'Email atau password salah' }
  }
  delete user.password_hash
  await createSession(event, user.id)
  return { user }
})
