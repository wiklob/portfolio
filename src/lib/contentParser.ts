export interface ContentItem {
  id: string
  title: string
  subtitle?: string
  date: string
  tags: string[]
  content: ContentBlock[]
}

export type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'html'; value: string }
  | { type: 'image'; filename: string; caption?: string }
  | { type: 'header'; value: string }
  | { type: 'subheader'; value: string }

export function parseContent(filename: string, raw: string): ContentItem {
  const lines = raw.split('\n')

  let inFrontmatter = false
  let frontmatterEnd = 0
  const frontmatter: Record<string, string> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true
      } else {
        frontmatterEnd = i + 1
        break
      }
    } else if (inFrontmatter && line.includes(':')) {
      const colonIndex = line.indexOf(':')
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      frontmatter[key] = value
    }
  }

  const contentLines = lines.slice(frontmatterEnd)
  const content: ContentBlock[] = []
  let currentText = ''
  let inHtmlBlock = false
  let htmlAccumulator = ''

  const imageRegex = /^\[([^\]]+\.(png|jpg|jpeg|gif|webp|svg))(?::\s*(.+))?\]$/i

  for (const line of contentLines) {
    const trimmed = line.trim()

    // HTML block support: lines starting with <html> and ending with </html>
    if (trimmed === '<html>') {
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      inHtmlBlock = true
      htmlAccumulator = ''
      continue
    }
    if (trimmed === '</html>') {
      inHtmlBlock = false
      content.push({ type: 'html', value: htmlAccumulator.trim() })
      htmlAccumulator = ''
      continue
    }
    if (inHtmlBlock) {
      htmlAccumulator += line + '\n'
      continue
    }

    const imageMatch = trimmed.match(imageRegex)

    if (imageMatch) {
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      content.push({
        type: 'image',
        filename: imageMatch[1],
        caption: imageMatch[3] || undefined
      })
    } else if (trimmed.startsWith('>>')) {
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      content.push({ type: 'subheader', value: trimmed.slice(2).trim() })
    } else if (trimmed.startsWith('>')) {
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      content.push({ type: 'header', value: trimmed.slice(1).trim() })
    } else {
      currentText += line + '\n'
    }
  }

  if (currentText.trim()) {
    content.push({ type: 'text', value: currentText.trim() })
  }

  const id = filename.replace(/\.txt$/, '')

  return {
    id,
    title: frontmatter.title || 'Untitled',
    subtitle: frontmatter.subtitle,
    date: frontmatter.date || '',
    tags: frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : [],
    content
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function formatDateLong(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export async function loadContent(directory: string): Promise<ContentItem[]> {
  const manifestRes = await fetch(`/${directory}/manifest.json`)
  if (!manifestRes.ok) return []

  const manifest: string[] = await manifestRes.json()
  const items: ContentItem[] = []

  for (const filename of manifest) {
    try {
      const res = await fetch(`/${directory}/${filename}`)
      if (res.ok) {
        const text = await res.text()
        items.push(parseContent(filename, text))
      }
    } catch (e) {
      console.error(`Failed to load ${filename}`, e)
    }
  }

  items.sort((a, b) => {
    const numA = parseInt(a.id.match(/^(\d+)/)?.[1] || '0')
    const numB = parseInt(b.id.match(/^(\d+)/)?.[1] || '0')
    return numA - numB
  })

  return items
}