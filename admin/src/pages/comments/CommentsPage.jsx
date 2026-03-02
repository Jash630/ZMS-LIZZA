import React, { useState } from 'react'
import { commentsData } from '../../data/mockData'
import { Check, X, Flag, MessageSquare, Search } from 'lucide-react'

const STATUS_CFG = {
    approved: { cls: 'badge-success', label: 'Approved' },
    pending: { cls: 'badge-warning', label: 'Pending' },
    spam: { cls: 'badge-danger', label: 'Spam' },
}

export default function CommentsPage() {
    const [comments, setComments] = useState(commentsData)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = comments.filter(c =>
        (filter === 'all' || c.status === filter) &&
        (c.author.toLowerCase().includes(search.toLowerCase()) || c.content.toLowerCase().includes(search.toLowerCase()))
    )
    const counts = { all: comments.length, pending: comments.filter(c => c.status === 'pending').length, approved: comments.filter(c => c.status === 'approved').length, spam: comments.filter(c => c.status === 'spam').length }

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
                ].map((s, i) => (
                    <div key={i} className="card animate-fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: s[2], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                            <MessageSquare size={18} color="white" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{s[1]}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s[0]}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card posts-toolbar" style={{ marginBottom: 20 }}>
                <div className="toolbar-search">
                    <Search size={15} />
                    <input type="text" placeholder="Search comments..." value={search} onChange={e => setSearch(e.target.value)} className="toolbar-input" />
                </div>
                <div className="toolbar-filters">
                    {['all', 'pending', 'approved', 'spam'].map(f => (
                        <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] ?? 0})
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(c => (
                    <div key={c.id} className="card animate-fade-in" style={{ padding: '18px 20px', borderLeft: c.status === 'pending' ? '3px solid var(--orange)' : '3px solid transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="avatar avatar-sm">{c.author[0]}</div>
                                <div>
                                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{c.author}</span>
                                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>On: {c.post}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{c.date}</span>
                                <span className={`badge ${STATUS_CFG[c.status].cls}`}>{STATUS_CFG[c.status].label}</span>
                            </div>
                        </div>
                        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5, padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--border)', marginBottom: 12 }}>{c.content}</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {c.status !== 'approved' && <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }} onClick={() => setComments(p => p.map(x => x.id === c.id ? { ...x, status: 'approved' } : x))}><Check size={13} />Approve</button>}
                            {c.status !== 'spam' && <button className="btn btn-sm" style={{ background: 'rgba(230,57,70,0.08)', color: 'var(--red)', border: '1px solid rgba(230,57,70,0.15)' }} onClick={() => setComments(p => p.map(x => x.id === c.id ? { ...x, status: 'spam' } : x))}><Flag size={13} />Mark Spam</button>}
                            <button className="btn btn-danger btn-sm" onClick={() => setComments(p => p.filter(x => x.id !== c.id))}><X size={13} />Delete</button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No comments found.</div>}
            </div>
        </div>
    )
}