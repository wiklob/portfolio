import { useState, useEffect } from 'react'
import { ContentItem, loadContent, formatDate } from './lib/contentParser'

function BookItem({ book }: { book: ContentItem }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="content-item">
      <div className="content-item-header" onClick={() => setExpanded(!expanded)}>
        <div className="content-item-header-left">
          <span className={`content-item-toggle ${expanded ? 'expanded' : ''}`}>&#9654;</span>
          <span className="content-item-title">{book.title}</span>
        </div>
        <span className="content-item-date">{formatDate(book.date)}</span>
      </div>

      {book.tags.length > 0 && (
        <div className="content-item-tags">
          {book.tags.map((tag, i) => (
            <span key={i} className="content-item-tag">#{tag}</span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="content-item-body">
          {book.content.map((block, i) => {
            if (block.type === 'text') {
              return (
                <div key={i} className="content-item-text">
                  {block.value.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              )
            } else if (block.type === 'header') {
              return <h3 key={i} className="content-item-section-header">{block.value}</h3>
            } else if (block.type === 'subheader') {
              return <h4 key={i} className="content-item-section-subheader">{block.value}</h4>
            } else if (block.type === 'image') {
              return (
                <div key={i} className="content-item-image-block">
                  <img
                    src={`/books/${block.filename}`}
                    alt={block.caption || block.filename}
                    className="content-item-image"
                  />
                  {block.caption && (
                    <span className="content-item-image-caption">{block.caption}</span>
                  )}
                </div>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}

function Books() {
  const [books, setBooks] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent('books').then(items => {
      setBooks(items)
      setLoading(false)
    })
  }, [])

  return (
    <div className="content-page">
      <div className="content-page-header">
        <div className="content-page-title">Books</div>
        <div className="content-page-subtitle">
          Reviews and thoughts on books I've read.
        </div>
      </div>

      <div className="content-list">
        {loading && <div className="content-loading">Loading...</div>}
        {!loading && books.length === 0 && (
          <div className="content-empty">No book reviews yet.</div>
        )}
        {books.map(book => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default Books