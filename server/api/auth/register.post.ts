import { createError, readBody } from 'h3'
import { database } from '../../utils/db'
import { createSession, hashPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; password?: string }>(event)
  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !body.password || body.password.length < 8) throw createError({ statusCode: 400, statusMessage: 'Nama, email valid, dan password minimal 8 karakter wajib diisi' })
  try {
    const result = await database().query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, await hashPassword(body.password)])
    await createSession(event, result.rows[0].id)
    return { user: result.rows[0] }
  } catch (error: any) {
    if (error.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar' })
    throw error
  }
})
