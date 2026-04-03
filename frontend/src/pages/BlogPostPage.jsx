import { useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation } from '../context/NavigationContext.jsx'
import { ChevronRight, Calendar, User, Clock, Eye, MessageCircle, Send } from 'lucide-react'
import { publicService } from '../services/publicService.js'

const formatCommentDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const renderContentBlocks = (content = '') => {
  const trimmed = String(content || '').trim()
  if (!trimmed) return []

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      if (lines.length === 0) return null

      if (lines.every((line) => line.startsWith('- '))) {
        return (
          <ul key={`list-${index}`} style={{ marginBottom: 20, paddingLeft: 22, color: 'var(--charcoal)', lineHeight: 1.8 }}>
            {lines.map((line, itemIndex) => (
              <li key={`item-${index}-${itemIndex}`}>{line.slice(2)}</li>
            ))}
          </ul>
        )
      }

      if (lines[0].startsWith('# ')) {
        return (
          <h2 key={`h1-${index}`} style={{ fontSize: '30px', lineHeight: 1.35, margin: '14px 0 12px', color: 'var(--charcoal)' }}>
            {lines[0].slice(2)}
          </h2>
        )
      }

      if (lines[0].startsWith('## ')) {
        return (
          <h3 key={`h2-${index}`} style={{ fontSize: '24px', lineHeight: 1.4, margin: '12px 0 10px', color: 'var(--charcoal)' }}>
            {lines[0].slice(3)}
          </h3>
        )
      }

      return (
        <p key={`p-${index}`} style={{ marginBottom: 18, color: 'var(--charcoal)', fontSize: '17px', lineHeight: 1.95 }}>
          {lines.join(' ')}
        </p>
      )
    })
    .filter(Boolean)
}

export function BlogPostPage({ slug }) {
  const { navigateTo } = useNavigation()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState('')
  const [commentsError, setCommentsError] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentNotice, setCommentNotice] = useState('')
  const [commentForm, setCommentForm] = useState({ author: '', email: '', content: '' })

  const parsedContent = useMemo(() => renderContentBlocks(post?.content || post?.excerpt || ''), [post?.content, post?.excerpt])

  const loadComments = async (nextSlug) => {
    setCommentsLoading(true)
    setCommentsError('')
    try {
      const response = await publicService.getPostComments(nextSlug, { limit: 50 })
      setComments(response.items || [])
    } catch (err) {
      setCommentsError(err?.message || 'Failed to load comments.')
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!slug) {
        setError('Invalid post link.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const next = await publicService.getPostBySlug(slug)
        if (!active) return
        if (!next) {
          setError('Post not found.')
          setPost(null)
          return
        }
        setPost(next)
        await loadComments(slug)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load post.')
        setPost(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  const submitComment = async (e) => {
    e.preventDefault()
    setCommentNotice('')
    setCommentsError('')

    const payload = {
      author: commentForm.author.trim() || undefined,
      email: commentForm.email.trim() || undefined,
      content: commentForm.content.trim(),
    }

    if (!payload.content) {
      setCommentsError('Please write your comment first.')
      return
    }

    setSubmittingComment(true)
    try {
      await publicService.submitPostComment(slug, payload)
      setCommentNotice('Comment submitted. It will appear once approved by admin.')
      setCommentForm((current) => ({ ...current, content: '' }))
    } catch (err) {
      setCommentsError(err?.message || 'Failed to submit comment.')
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pt-36 pb-14 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('blog')}>Blog</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{post?.title || 'Article'}</span>
          </div>

          {loading && <p style={{ color: 'var(--dark-gray)' }}>Loading article...</p>}
          {!loading && error && (
            <div>
              <p style={{ color: '#EF4444', marginBottom: 12 }}>{error}</p>
              <button className="btn btn-ghost" onClick={() => navigateTo('blog')}>Back to Blog</button>
            </div>
          )}

          {!loading && !error && post && (
            <article>
              <span className="inline-block px-3 py-1 rounded-full mb-4 text-xs font-semibold" style={{ backgroundColor: 'rgba(46,94,170,0.12)', color: '#2E5EAA' }}>
                {post.category || 'News'}
              </span>
              <h1 className="mb-4" style={{ fontSize: '42px', lineHeight: '1.25' }}>{post.title}</h1>
              <p className="mb-6" style={{ color: 'var(--dark-gray)', fontSize: '18px', lineHeight: '1.7' }}>{post.excerpt}</p>

              <div className="flex flex-wrap gap-5 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
                <span className="flex items-center gap-1"><User size={14} />{post.author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
                <span className="flex items-center gap-1"><Eye size={14} />{(post.views || 0).toLocaleString()} views</span>
              </div>

              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                  {post.tags.map((tag) => (
                    <span key={tag} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 999, fontSize: 12, color: 'var(--text-secondary)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {post.image && (
                <div className="rounded-2xl overflow-hidden mb-10" style={{ maxHeight: 520 }}>
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div style={{ marginBottom: 26 }}>
                {parsedContent.length > 0 ? parsedContent : (
                  <p style={{ marginBottom: 18, color: 'var(--charcoal)', fontSize: '17px', lineHeight: 1.95 }}>
                    No article content provided.
                  </p>
                )}
              </div>
            </article>
          )}

          {!loading && !error && post && (
            <section style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
              <h3 style={{ fontSize: 24, marginBottom: 12 }}>Comments</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 14 }}>
                Share your thoughts or ask about this topic. Comments are moderated.
              </p>

              {commentsLoading && <p style={{ color: 'var(--text-muted)' }}>Loading comments...</p>}
              {!commentsLoading && comments.length === 0 && !commentsError && (
                <p style={{ color: 'var(--text-muted)', marginBottom: 14 }}>No comments yet. Be the first to comment.</p>
              )}
              {commentsError && <p style={{ color: '#EF4444', marginBottom: 14 }}>{commentsError}</p>}

              {!commentsLoading && comments.length > 0 && (
                <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                  {comments.map((comment) => (
                    <div key={comment.id} className="card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <strong style={{ fontSize: 14 }}>{comment.author}</strong>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatCommentDate(comment.createdAt)}</span>
                      </div>
                      <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={submitComment} className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input
                    className="input"
                    placeholder="Your name (optional)"
                    value={commentForm.author}
                    onChange={(e) => setCommentForm((current) => ({ ...current, author: e.target.value }))}
                  />
                  <input
                    className="input"
                    type="email"
                    placeholder="Your email (optional)"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm((current) => ({ ...current, email: e.target.value }))}
                  />
                </div>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Write your comment"
                  value={commentForm.content}
                  onChange={(e) => setCommentForm((current) => ({ ...current, content: e.target.value }))}
                  required
                />
                {commentNotice && <p style={{ color: '#10B981', fontSize: 13 }}>{commentNotice}</p>}
                {commentsError && <p style={{ color: '#EF4444', fontSize: 13 }}>{commentsError}</p>}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={submittingComment}>
                    {submittingComment ? <><MessageCircle size={14} /> Posting...</> : <><Send size={14} /> Post Comment</>}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
