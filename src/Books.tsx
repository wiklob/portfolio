import { useState, useEffect } from 'react'

interface Book {
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

function parseBook(filename: string, raw: string): Book {
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

  // Extract ID from filename (e.g., "001-my-book.txt" -> "001-my-book")
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

function BookItem({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="book-item">
      <div className="book-header" onClick={() => setExpanded(!expanded)}>
        <div className="book-header-left">
          <span className="book-toggle">{expanded ? '▼' : '▶'}</span>
          <span className="book-title">{book.title}</span>
        </div>
        <span className="book-date">{formatDate(book.date)}</span>
      </div>

      {book.tags.length > 0 && (
        <div className="book-tags">
          {book.tags.map((tag, i) => (
            <span key={i} className="book-tag">#{tag}</span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="book-content">
          {book.content.map((block, i) => {
            if (block.type === 'text') {
              return (
                <div key={i} className="book-text">
                  {block.value.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              )
            } else if (block.type === 'header') {
              return <h3 key={i} className="book-section-header">{block.value}</h3>
            } else if (block.type === 'subheader') {
              return <h4 key={i} className="book-section-subheader">{block.value}</h4>
            } else {
              return (
                <div key={i} className="book-image-block">
                  <img
                    src={`/books/${block.filename}`}
                    alt={block.caption || block.filename}
                    className="book-image"
                  />
                  {block.caption && (
                    <span className="book-image-caption">{block.caption}</span>
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

function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooks() {
      try {
        // Fetch the manifest of book files
        const manifestRes = await fetch('/books/manifest.json')
        if (!manifestRes.ok) {
          setLoading(false)
          return
        }

        const manifest: string[] = await manifestRes.json()

        // Fetch each book file
        const loadedBooks: Book[] = []
        for (const filename of manifest) {
          try {
            const res = await fetch(`/books/${filename}`)
            if (res.ok) {
              const text = await res.text()
              loadedBooks.push(parseBook(filename, text))
            }
          } catch (e) {
            console.error(`Failed to load ${filename}`, e)
          }
        }

        // Sort by filename - lower numbers first (at top of page)
        loadedBooks.sort((a, b) => {
          const numA = parseInt(a.id.match(/^(\d+)/)?.[1] || '0')
          const numB = parseInt(b.id.match(/^(\d+)/)?.[1] || '0')
          return numA - numB
        })

        setBooks(loadedBooks)
      } catch (e) {
        console.error('Failed to load books', e)
      }
      setLoading(false)
    }

    loadBooks()
  }, [])

  return (
    <div className="books">
      <div className="books-header">
        <div className="books-title">Books</div>
        <div className="books-subtitle">
          Reviews and thoughts on books I've read.
        </div>
      </div>

      <div className="books-list">
        {loading && <div className="books-loading">Loading...</div>}
        {!loading && books.length === 0 && (
          <div className="books-empty">No book reviews yet.</div>
        )}
        {books.map(book => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default Books
