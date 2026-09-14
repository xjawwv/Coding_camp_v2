import { createError, readBody } from 'h3'
import { randomUUID } from 'node:crypto'
import { database } from '../../utils/db'
import { createSession, hashPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; password?: string }>(event)
  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !body.password || body.password.length < 8) throw createError({ statusCode: 400, statusMessage: 'Nama, email valid, dan password minimal 8 karakter wajib diisi' })
  try {
    await database().execute('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)', [randomUUID(), name, email, await hashPassword(body.password)])
    const [rows] = await database().query('SELECT id, name, email FROM users WHERE email = ?', [email])
    const user = (rows as any[])[0]
    await createSession(event, user.id)
    return { user }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar' })
    throw error
  }
})
