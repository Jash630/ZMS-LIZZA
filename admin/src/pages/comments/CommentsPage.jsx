import React, { useEffect, useMemo, useState } from 'react'
import { Check, X, Flag, MessageSquare, Search } from 'lucide-react'
import { commentsService } from '../../services/commentsService'
import StateBlock from '../../components/ui/StateBlock'

const STATUS_CFG = {
  approved: { cls: 'badge-success', label: 'Approved' },
  pending: { cls: 'badge-warning', label: 'Pending' },
  spam: { cls: 'badge-danger', label: 'Spam' },
}

export default function CommentsPage() {
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadComments = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await commentsService.list({
        status: filter === 'all' ? undefined : filter,
        search: search || undefined,
        limit: 100,
      })
      setComments(response?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load comments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadComments(), 250)
    return () => clearTimeout(timer)
  }, [filter, search])

  const counts = useMemo(() => ({
    all: comments.length,
    pending: comments.filter((comment) => comment.status === 'pending').length,
    approved: comments.filter((comment) => comment.status === 'approved').length,
    spam: comments.filter((comment) => comment.status === 'spam').length,
  }), [comments])

  const updateStatus = async (id, status) => {
    try {
      await commentsService.updateStatus(id, status)
      setComments((current) => current.map((comment) => (comment._id === id ? { ...comment, status } : comment)))
    } catch (err) {
      setError(err?.message || 'Failed to update status.')
    }
  }

  const deleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await commentsService.remove(id)
      setComments((current) => current.filter((comment) => comment._id !== id))
    } catch (err) {
      setError(err?.message || 'Failed to delete comment.')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Comments <span className="gradient-text">Moderation</span></h1>
          <p className="page-subtitle">{counts.pending} pending review</p>
        </div>
      </div>

      <div className="stats-grid stagger-children" style={{ marginBottom: 20 }}>
        {[
          ['Total', counts.all, '#2E5EAA'],
          ['Approved', counts.approved, '#10B981'],
          ['Pending', counts.pending, '#FF6B35'],
          ['Spam', counts.spam, '#E63946'],
        ].map((entry, index) => (
          <div key={index} className="card animate-fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: entry[2], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquare size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{entry[1]}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{entry[0]}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card posts-toolbar" style={{ marginBottom: 20 }}>
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search comments..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar-input" />
        </div>
        <div className="toolbar-filters">
          {['all', 'pending', 'approved', 'spam'].map((status) => (
            <button key={status} className={`filter-tab ${filter === status ? 'active' : ''}`} onClick={() => setFilter(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={loadComments} />

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comments.map((comment) => (
            <div key={comment._id} className="card animate-fade-in" style={{ padding: '18px 20px', borderLeft: comment.status === 'pending' ? '3px solid var(--orange)' : '3px solid transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar avatar-sm">{comment.author?.[0] || 'A'}</div>
                  <div>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{comment.author || 'Anonymous'}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>On: {comment.post?.title || 'Unknown post'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <span className={`badge ${STATUS_CFG[comment.status]?.cls || 'badge-neutral'}`}>{STATUS_CFG[comment.status]?.label || comment.status}</span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--border)', marginBottom: 12 }}>
                {comment.content}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {comment.status !== 'approved' && (
                  <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }} onClick={() => updateStatus(comment._id, 'approved')}>
                    <Check size={13} /> Approve
                  </button>
                )}
                {comment.status !== 'spam' && (
                  <button className="btn btn-sm" style={{ background: 'rgba(230,57,70,0.08)', color: 'var(--red)', border: '1px solid rgba(230,57,70,0.15)' }} onClick={() => updateStatus(comment._id, 'spam')}>
                    <Flag size={13} /> Mark Spam
                  </button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => deleteComment(comment._id)}>
                  <X size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
          {comments.length === 0 && <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No comments found.</div>}
        </div>
      )}
    </div>
  )
}
