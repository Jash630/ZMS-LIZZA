import { useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation } from '../context/NavigationContext.jsx'
import { ChevronRight, Calendar, User, Clock, Eye, MessageCircle, Send, ArrowRight, Tag, ThumbsUp } from 'lucide-react'
import { publicService } from '../services/publicService.js'

const CATEGORY_COLORS = {
  Product:      { bg: '#1B2E4B', text: '#fff' },
  Guide:        { bg: '#8B2F97', text: '#fff' },
  News:         { bg: '#FF6B35', text: '#fff' },
  'Case Study': { bg: '#10B981', text: '#fff' },
  Announcement: { bg: '#EF4444', text: '#fff' },
}

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
          <ul key={`list-${index}`} style={{
            marginBottom: 24, paddingLeft: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {lines.map((line, itemIndex) => (
              <li key={`item-${index}-${itemIndex}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#3a4a5c', lineHeight: 1.75, fontSize: 17 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#FF6B35', flexShrink: 0, marginTop: 9 }} />
                {line.slice(2)}
              </li>
            ))}
          </ul>
        )
      }

      if (lines[0].startsWith('# ')) {
        return (
          <h2 key={`h1-${index}`} style={{
            fontSize: 28, fontWeight: 800, lineHeight: 1.3,
            margin: '36px 0 16px', color: '#0f1f3d', letterSpacing: '-0.01em',
            paddingBottom: 12, borderBottom: '2px solid #f0f3f9',
          }}>
            {lines[0].slice(2)}
          </h2>
        )
      }

      if (lines[0].startsWith('## ')) {
        return (
          <h3 key={`h2-${index}`} style={{
            fontSize: 22, fontWeight: 700, lineHeight: 1.4,
            margin: '28px 0 12px', color: '#0f1f3d',
          }}>
            <span style={{ display: 'inline-block', width: 3, height: 22, backgroundColor: '#FF6B35', borderRadius: 2, marginRight: 10, verticalAlign: 'middle' }} />
            {lines[0].slice(3)}
          </h3>
        )
      }

      return (
        <p key={`p-${index}`} style={{
          marginBottom: 22, color: '#3a4a5c', fontSize: 17, lineHeight: 1.9,
          fontWeight: 400,
        }}>
          {lines.join(' ')}
        </p>
      )
    })
    .filter(Boolean)
}

function CommentAvatar({ name }) {
  const initials = String(name || 'A').slice(0, 2).toUpperCase()
  const colors = ['#FF6B35', '#1B2E4B', '#8B2F97', '#10B981', '#3B82F6']
  const idx = (name || '').charCodeAt(0) % colors.length
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%', backgroundColor: colors[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
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
  const [focusedField, setFocusedField] = useState(null)

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
      if (!slug) { setError('Invalid post link.'); setLoading(false); return }
      try {
        setLoading(true); setError('')
        const next = await publicService.getPostBySlug(slug)
        if (!active) return
        if (!next) { setError('Post not found.'); setPost(null); return }
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
    return () => { active = false }
  }, [slug])

  const submitComment = async (e) => {
    e.preventDefault()
    setCommentNotice('')
    setCommentsError('')
    const payload = {
      author:  commentForm.author.trim()  || undefined,
      email:   commentForm.email.trim()   || undefined,
      content: commentForm.content.trim(),
    }
    if (!payload.content) { setCommentsError('Please write your comment first.'); return }
    setSubmittingComment(true)
    try {
      await publicService.submitPostComment(slug, payload)
      setCommentNotice('Comment submitted. It will appear once approved by admin.')
      setCommentForm((c) => ({ ...c, content: '' }))
    } catch (err) {
      setCommentsError(err?.message || 'Failed to submit comment.')
    } finally {
      setSubmittingComment(false)
    }
  }

  const catColors = CATEGORY_COLORS[post?.category] || { bg: '#1B2E4B', text: '#fff' }

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 16px', borderRadius: 8,
    border: `1.5px solid ${focusedField === field ? '#FF6B35' : '#dde3ee'}`,
    boxShadow: focusedField === field ? '0 0 0 3px rgba(255,107,53,0.1)' : 'none',
    fontSize: 14, outline: 'none', backgroundColor: '#fafbfd',
    color: '#0f1f3d', transition: 'all 0.2s', boxSizing: 'border-box',
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7fb' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .comment-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .comment-card:hover { box-shadow: 0 6px 24px rgba(15,31,61,0.08) !important; transform: translateY(-2px); }
        .prose-img { border-radius: 12px; width: 100%; display: block; margin: 28px 0; }
        .toc-link { transition: color 0.15s, padding-left 0.15s; }
        .toc-link:hover { color: #FF6B35 !important; padding-left: 8px !important; }
        textarea.comment-ta:focus { border-color: #FF6B35 !important; box-shadow: 0 0 0 3px rgba(255,107,53,0.1) !important; }
      `}</style>

      <Header />
      <WhatsAppButton />

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #1B2E4B 60%, #243a5e 100%)',
        paddingTop: 'calc(var(--site-header-height) + 40px)',
        paddingBottom: '40px',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20, fontSize: 13 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
            <span style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => navigateTo('blog')}>Blog</span>
            <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
            <span style={{ color: '#FF6B35', fontWeight: 600, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post?.title || 'Article'}
            </span>
          </div>
          {post && (
            <div className="fade-up">
              <span style={{ ...catColors, fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 4, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-block', marginBottom: 16 }}>
                {post.category || 'News'}
              </span>
              <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em', maxWidth: 800 }}>
                {post.title}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.65, maxWidth: 700, marginBottom: 24 }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} color="#FF6B35" />{post.author}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} color="#FF6B35" />{post.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} color="#FF6B35" />{post.readTime}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} color="#FF6B35" />{(post.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 64px' }}>

        {loading && <p style={{ color: '#6b7a90', padding: '48px 0' }}>Loading article…</p>}
        {!loading && error && (
          <div style={{ padding: '48px 0' }}>
            <p style={{ color: '#EF4444', marginBottom: 16 }}>{error}</p>
            <button
              onClick={() => navigateTo('blog')}
              style={{ padding: '10px 22px', borderRadius: 8, border: '1.5px solid #dde3ee', backgroundColor: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#0f1f3d' }}
            >
              ← Back to Blog
            </button>
          </div>
        )}

        {!loading && !error && post && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 36, alignItems: 'start', paddingTop: 36 }}>

            {/* ── Article Body ── */}
            <div>
              {/* Cover Image */}
              {post.image && (
                <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 36, boxShadow: '0 8px 32px rgba(15,31,61,0.12)' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              {/* Tags */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ background: '#f0f3f9', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: 20, fontSize: 12, color: '#4a5568', fontWeight: 600 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Article Content */}
              <article style={{
                backgroundColor: '#fff', borderRadius: 14, padding: '36px 40px',
                border: '1px solid #e8edf4', marginBottom: 36,
                boxShadow: '0 2px 12px rgba(15,31,61,0.05)',
              }}>
                {parsedContent.length > 0
                  ? parsedContent
                  : <p style={{ color: '#6b7a90', fontSize: 16 }}>No article content provided.</p>
                }
              </article>

              {/* ── COMMENT SECTION ── */}
              <section style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 26, background: '#FF6B35', borderRadius: 2 }} />
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f1f3d', margin: 0 }}>Discussion</h2>
                  {comments.length > 0 && (
                    <span style={{ background: '#FF6B35', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 12 }}>
                      {comments.length}
                    </span>
                  )}
                </div>
                <p style={{ color: '#8a96a8', fontSize: 13.5, marginBottom: 24 }}>Share your thoughts. Comments are moderated before publishing.</p>

                {/* ── Write Comment FIRST (like Instagram/YouTube) ── */}
                <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #e8edf4', padding: '26px 28px', marginBottom: 28, boxShadow: '0 2px 12px rgba(15,31,61,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <MessageCircle size={18} color="#FF6B35" />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f1f3d', margin: 0 }}>Write a Comment</h3>
                  </div>
                  <form onSubmit={submitComment} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <input
                        placeholder="Your name (optional)"
                        value={commentForm.author}
                        onChange={e => setCommentForm(c => ({ ...c, author: e.target.value }))}
                        onFocus={() => setFocusedField('author')}
                        onBlur={() => setFocusedField(null)}
                        style={inputStyle('author')}
                      />
                      <input
                        type="email"
                        placeholder="Your email (optional)"
                        value={commentForm.email}
                        onChange={e => setCommentForm(c => ({ ...c, email: e.target.value }))}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        style={inputStyle('email')}
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="What are your thoughts on this article?"
                      value={commentForm.content}
                      onChange={e => setCommentForm(c => ({ ...c, content: e.target.value }))}
                      required
                      className="comment-ta"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1.5px solid #dde3ee', fontSize: 14, outline: 'none', backgroundColor: '#fafbfd', color: '#0f1f3d', lineHeight: 1.7, resize: 'vertical', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                    {commentNotice && (
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 8 }}>
                        ✓ {commentNotice}
                      </div>
                    )}
                    {commentsError && (
                      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
                        {commentsError}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        disabled={submittingComment}
                        style={{ padding: '11px 28px', borderRadius: 8, border: 'none', backgroundColor: submittingComment ? '#a0aec0' : '#FF6B35', color: '#fff', fontWeight: 700, fontSize: 14, cursor: submittingComment ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s, transform 0.15s' }}
                        onMouseEnter={e => { if (!submittingComment) { e.currentTarget.style.background = '#e55a27'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = submittingComment ? '#a0aec0' : '#FF6B35'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        {submittingComment
                          ? <><MessageCircle size={15} /> Posting…</>
                          : <><Send size={15} /> Post Comment</>
                        }
                      </button>
                    </div>
                  </form>
                </div>

                {/* ── Existing Comments ── */}
                {commentsLoading && (
                  <div style={{ padding: '20px 0', color: '#8a96a8', fontSize: 14 }}>Loading comments…</div>
                )}
                {!commentsLoading && comments.length === 0 && !commentsError && (
                  <div style={{ textAlign: 'center', padding: '32px', background: '#fff', borderRadius: 14, border: '1px dashed #dde3ee', color: '#8a96a8', fontSize: 14 }}>
                    <MessageCircle size={28} color="#dde3ee" style={{ marginBottom: 10, display: 'block', margin: '0 auto 10px' }} />
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
                {!commentsLoading && comments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {comments.map((comment, i) => (
                      <div
                        key={comment.id}
                        className="comment-card fade-up"
                        style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e8edf4', padding: '20px 22px', display: 'flex', gap: 14, animationDelay: `${i * 0.04}s`, boxShadow: '0 1px 6px rgba(15,31,61,0.04)' }}
                      >
                        <CommentAvatar name={comment.author} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <strong style={{ fontSize: 14, fontWeight: 700, color: '#0f1f3d' }}>{comment.author || 'Anonymous'}</strong>
                            <span style={{ fontSize: 12, color: '#a0aec0', fontWeight: 500 }}>{formatCommentDate(comment.createdAt)}</span>
                          </div>
                          <p style={{ fontSize: 14.5, color: '#3a4a5c', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* ── Sticky Sidebar ── */}
            <aside style={{ position: 'sticky', top: 'calc(var(--site-header-height) + 24px)', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Author Card */}
              {post.author && (
                <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '20px 20px', border: '1px solid #e8edf4', textAlign: 'center', boxShadow: '0 2px 10px rgba(15,31,61,0.05)' }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B35, #1B2E4B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 auto 12px', letterSpacing: '-0.02em' }}>
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0f1f3d', marginBottom: 4 }}>{post.author}</p>
                  <p style={{ fontSize: 12, color: '#8a96a8' }}>ZMS LIZZA Expert</p>
                </div>
              )}

              {/* Post Stats */}
              <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e8edf4', boxShadow: '0 2px 10px rgba(15,31,61,0.05)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8a96a8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Article Info</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: <Calendar size={14} color="#FF6B35" />, label: 'Published', value: post.date },
                    { icon: <Clock size={14} color="#FF6B35" />, label: 'Read time', value: post.readTime },
                    { icon: <Eye size={14} color="#FF6B35" />, label: 'Views', value: (post.views || 0).toLocaleString() },
                    { icon: <MessageCircle size={14} color="#FF6B35" />, label: 'Comments', value: comments.length },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#6b7a90' }}>{icon}{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f1f3d' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1B2E4B 100%)', borderRadius: 14, padding: '22px 20px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,107,53,0.15)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Interested in our machines?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12.5, lineHeight: 1.6, marginBottom: 16 }}>Book a free demo with our expert team.</p>
                  <button
                    style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', backgroundColor: '#FF6B35', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e55a27'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FF6B35'}
                  >
                    Request a Demo <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Back to Blog */}
              <button
                onClick={() => navigateTo('blog')}
                style={{ width: '100%', padding: '11px', borderRadius: 8, border: '1.5px solid #dde3ee', backgroundColor: '#fff', color: '#0f1f3d', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f1f3d'; e.currentTarget.style.backgroundColor = '#0f1f3d'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#dde3ee'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#0f1f3d'; }}
              >
                ← Back to Blog
              </button>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}