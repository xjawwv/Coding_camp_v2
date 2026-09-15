import { createError, readMultipartFormData } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { imageMime } from '../../../utils/uploads'
import { uploadCourseImage } from '../../../utils/r2'

export default defineEventHandler(async event => { await requireAdmin(event); const parts = await readMultipartFormData(event) || []; const image = parts.find(part => part.name === 'image'); if (!image?.filename) throw createError({ statusCode: 400, statusMessage: 'Gambar wajib diisi' }); if (image.data.length > 2 * 1024 * 1024) throw createError({ statusCode: 413, statusMessage: 'Ukuran gambar maksimal 2 MB' }); const mimeType = imageMime(image.filename, image.data); return { url: await uploadCourseImage(image.data, mimeType, image.filename, 'article-images') } })
