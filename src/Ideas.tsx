import { useState, useEffect } from 'react'

interface Idea {
  id: string
  title: string
  date: string
  tags: string[]
  content: ContentBlock[]
}

type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'image'; filename: string; caption?: string }
  | { type: 'header'; value: string }
  | { type: 'subheader'; value: string }

function parseIdea(filename: string, raw: string): Idea {
  const lines = raw.split('\n')

  // Parse frontmatter
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

  // Parse content with inline images
  const contentLines = lines.slice(frontmatterEnd)
  const content: ContentBlock[] = []
  let currentText = ''

  const imageRegex = /^\[([^\]]+\.(png|jpg|jpeg|gif|webp|svg))(?::\s*(.+))?\]$/i

  for (const line of contentLines) {
    const trimmed = line.trim()
    const imageMatch = trimmed.match(imageRegex)

    if (imageMatch) {
      // Save accumulated text
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      // Add image block
      content.push({
        type: 'image',
        filename: imageMatch[1],
        caption: imageMatch[3] || undefined
      })
    } else if (trimmed.startsWith('>>')) {
      // Subheader
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      content.push({ type: 'subheader', value: trimmed.slice(2).trim() })
    } else if (trimmed.startsWith('>')) {
      // Header
      if (currentText.trim()) {
        content.push({ type: 'text', value: currentText.trim() })
        currentText = ''
      }
      content.push({ type: 'header', value: trimmed.slice(1).trim() })
    } else {
      currentText += line + '\n'
    }
  }

  // Save any remaining text
  if (currentText.trim()) {
    content.push({ type: 'text', value: currentText.trim() })
  }

  // Extract ID from filename (e.g., "001-my-idea.txt" -> "001-my-idea")
  const id = filename.replace(/\.txt$/, '')

  return {
    id,
    title: frontmatter.title || 'Untitled',
    date: frontmatter.date || '',
    tags: frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : [],
    content
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function IdeaItem({ idea }: { idea: Idea }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="idea-item">
      <div className="idea-header" onClick={() => setExpanded(!expanded)}>
        <div className="idea-header-left">
          <span className="idea-toggle">{expanded ? '▼' : '▶'}</span>
          <span className="idea-title">{idea.title}</span>
        </div>
        <span className="idea-date">{formatDate(idea.date)}</span>
      </div>

      {idea.tags.length > 0 && (
        <div className="idea-tags">
          {idea.tags.map((tag, i) => (
            <span key={i} className="idea-tag">#{tag}</span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="idea-content">
          {idea.content.map((block, i) => {
            if (block.type === 'text') {
              return (
                <div key={i} className="idea-text">
                  {block.value.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              )
            } else if (block.type === 'header') {
              return <h3 key={i} className="idea-section-header">{block.value}</h3>
            } else if (block.type === 'subheader') {
              return <h4 key={i} className="idea-section-subheader">{block.value}</h4>
            } else {
              return (
                <div key={i} className="idea-image-block">
                  <img
                    src={`/ideas/${block.filename}`}
                    alt={block.caption || block.filename}
                    className="idea-image"
                  />
                  {block.caption && (
                    <span className="idea-image-caption">{block.caption}</span>
                  )}
                </div>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadIdeas() {
      try {
        // Fetch the manifest of idea files
        const manifestRes = await fetch('/ideas/manifest.json')
        if (!manifestRes.ok) {
          setLoading(false)
          return
        }

        const manifest: string[] = await manifestRes.json()

        // Fetch each idea file
        const loadedIdeas: Idea[] = []
        for (const filename of manifest) {
          try {
            const res = await fetch(`/ideas/${filename}`)
            if (res.ok) {
              const text = await res.text()
              loadedIdeas.push(parseIdea(filename, text))
            }
          } catch (e) {
            console.error(`Failed to load ${filename}`, e)
          }
        }

        // Sort by filename - lower numbers first (at top of page)
        loadedIdeas.sort((a, b) => {
          const numA = parseInt(a.id.match(/^(\d+)/)?.[1] || '0')
          const numB = parseInt(b.id.match(/^(\d+)/)?.[1] || '0')
          return numA - numB
        })

        setIdeas(loadedIdeas)
      } catch (e) {
        console.error('Failed to load ideas', e)
      }
      setLoading(false)
    }

    loadIdeas()
  }, [])

  return (
    <div className="ideas">
      <div className="ideas-header">
        <div className="ideas-title">Ideas</div>
        <div className="ideas-subtitle">
          Raw thinking. Half-baked concepts. Sketches from notebooks.
        </div>
      </div>

      <div className="ideas-list">
        {loading && <div className="ideas-loading">Loading...</div>}
        {!loading && ideas.length === 0 && (
          <div className="ideas-empty">No ideas yet.</div>
        )}
        {ideas.map(idea => (
          <IdeaItem key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  )
}

export default Ideas
