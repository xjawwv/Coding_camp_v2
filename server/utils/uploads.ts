import { createError } from 'h3'

export function imageMime(filename: string, data: Buffer) {
  const extension = filename.toLowerCase().split('.').pop()
  const valid = extension === 'png' && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'image/png' : extension === 'jpg' || extension === 'jpeg' ? data.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ? 'image/jpeg' : '' : extension === 'gif' && data.subarray(0, 4).toString() === 'GIF8' ? 'image/gif' : extension === 'webp' && data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP' ? 'image/webp' : ''
  if (!valid) throw createError({ statusCode: 400, statusMessage: 'File harus berupa PNG, JPEG, GIF, atau WebP yang valid' })
  return valid
}
