import { useState, useEffect } from 'react'
import { ContentItem, loadContent, formatDateLong } from './lib/contentParser'

function BlogPost({ post }: { post: ContentItem }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="blog-post">
      <div className="blog-post-header" onClick={() => setExpanded(!expanded)}>
        <div className="blog-post-header-left">
          <div className="blog-post-title">{post.title}</div>
          {post.subtitle && (
            <div className="blog-post-subtitle">{post.subtitle}</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="blog-post-date">{formatDateLong(post.date)}</span>
          <span className="blog-post-toggle">{expanded ? '\u25BC' : '\u25B6'}</span>
        </div>
      </div>

      {expanded && (
        <div className="blog-post-content">
          {post.content.map((block, i) => {
            if (block.type === 'text') {
              return (
                <div key={i} className="blog-post-text">
                  {block.value.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              )
            } else if (block.type === 'html') {
              return (
                <div
                  key={i}
                  className="blog-post-html"
                  dangerouslySetInnerHTML={{ __html: block.value }}
                />
              )
            } else if (block.type === 'header') {
              return <h3 key={i} className="blog-post-section-header">{block.value}</h3>
            } else if (block.type === 'subheader') {
              return <h4 key={i} className="blog-post-section-subheader">{block.value}</h4>
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}

function Blog() {
  const [posts, setPosts] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent('blog').then(items => {
      setPosts(items)
      setLoading(false)
    })
  }, [])

  return (
    <div className="blog">
      <div className="blog-header">
        <div className="blog-title">Blog</div>
        <div className="blog-subtitle">
          Essays on creativity, principles, and the startup mindset.
        </div>
      </div>

      <div className="blog-list">
        {loading && <div className="blog-loading">Loading...</div>}
        {!loading && posts.length === 0 && (
          <div className="blog-empty">No posts yet.</div>
        )}
        {posts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Blog