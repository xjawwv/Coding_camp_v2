export type CourseBlock = { type: 'heading' | 'paragraph' | 'code' | 'callout' | 'list' | 'quote' | 'divider'; level?: number; text?: string; language?: string; code?: string; variant?: string; items?: string[] }

export function parseCourseMarkdown(source: string): CourseBlock[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: CourseBlock[] = []
  let paragraph: string[] = []
  let index = 0
  const flush = () => { if (paragraph.length) { blocks.push({ type: 'paragraph', text: paragraph.join(' ') }); paragraph = [] } }
  while (index < lines.length) {
    const line = lines[index]
    const fence = line.match(/^```(\w*)\s*$/)
    if (fence) { flush(); const start = ++index; while (index < lines.length && !/^```\s*$/.test(lines[index])) index++; if (index >= lines.length) throw new Error('Code block belum ditutup'); blocks.push({ type: 'code', code: lines.slice(start, index).join('\n'), language: fence[1] || 'javascript' }); index++; continue }
    const callout = line.match(/^:::callout(?:\{variant="(info|warning|success|danger)"\})?\s*$/)
    if (callout) { flush(); const start = ++index; while (index < lines.length && lines[index] !== ':::') index++; if (index >= lines.length) throw new Error('Callout belum ditutup'); blocks.push({ type: 'callout', variant: callout[1] || 'info', text: lines.slice(start, index).join(' ') }); index++; continue }
    if (!line.trim()) { flush(); index++; continue }
    const heading = line.match(/^(#{1,3})\s+(.+)$/); if (heading) { flush(); blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] }); index++; continue }
    if (/^---+$/.test(line.trim())) { flush(); blocks.push({ type: 'divider' }); index++; continue }
    if (/^>\s+/.test(line)) { flush(); blocks.push({ type: 'quote', text: line.replace(/^>\s+/, '') }); index++; continue }
    if (/^[-*]\s+/.test(line)) { flush(); const items: string[] = []; while (index < lines.length && /^[-*]\s+/.test(lines[index])) items.push(lines[index++].replace(/^[-*]\s+/, '')); blocks.push({ type: 'list', items }); continue }
    paragraph.push(line.trim()); index++
  }
  flush(); return blocks
}
