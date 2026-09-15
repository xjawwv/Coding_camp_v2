export function normalizeCourseContent(value: unknown) {
  if (!value) return null
  if (typeof value === 'object') return value
  if (typeof value === 'string') {
    try { return JSON.parse(value) }
    catch { return null }
  }
  return null
}
