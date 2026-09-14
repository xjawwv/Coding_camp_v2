import mysql, { type Pool } from 'mysql2/promise'

let pool: Pool | undefined

export function database() {
  pool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true
  })
  return pool
}
