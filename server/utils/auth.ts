import { createHash, randomBytes, randomUUID, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { createError, type H3Event } from 'h3'
import { database } from './db'

const scrypt = promisify(nodeScrypt)
const sessionCookie = 'cc_session'

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const key = await scrypt(password, salt, 64) as Buffer
  return `${salt}:${key.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const key = await scrypt(password, salt, 64) as Buffer
  const expected = Buffer.from(hash, 'hex')
  return expected.length === key.length && timingSafeEqual(expected, key)
}

export function sessionValue(event: H3Event) {
  return getCookie(event, sessionCookie)
}

export async function createSession(event: H3Event, userId: string) {
  const token = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  await database().query('INSERT INTO sessions (id, token_hash, user_id, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))', [randomUUID(), tokenHash, userId])
  setCookie(event, sessionCookie, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30, path: '/' })
}

export async function currentUser(event: H3Event) {
  const token = sessionValue(event)
  if (!token) return null
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const [rows] = await database().query('SELECT u.id, u.email, u.name, u.role FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > NOW()', [tokenHash])
  return (rows as any[])[0] || null
}

export async function requireAdmin(event: H3Event) {
  const user = await currentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
  if (user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Akses admin diperlukan' })
  return user
}

export async function revokeSession(event: H3Event) {
  const token = sessionValue(event)
  if (token) await database().query('DELETE FROM sessions WHERE token_hash = ?', [createHash('sha256').update(token).digest('hex')])
  deleteCookie(event, sessionCookie, { path: '/' })
}
