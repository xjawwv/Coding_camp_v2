import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

let client: S3Client | undefined

function r2Client() {
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) throw new Error('Konfigurasi Cloudflare R2 belum lengkap')
  client ??= new S3Client({ region: 'auto', endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID || '', secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '' } })
  return client
}

export async function uploadCourseImage(data: Buffer, mimeType: string, filename: string) {
  const extension = filename.toLowerCase().split('.').pop() || 'bin'
  const key = `course-images/${randomUUID()}.${extension}`
  await r2Client().send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: data, ContentType: mimeType, CacheControl: 'public, max-age=31536000, immutable' }))
  return `${process.env.R2_PUBLIC_URL || 'https://cdn.yuroflac.my.id'}/${key}`
}
