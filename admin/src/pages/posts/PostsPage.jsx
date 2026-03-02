import React, { useState } from 'react'
import { postsData } from '../../data/mockData'
import { Plus, Search, Filter, Edit2, Trash2, Eye, CheckCircle, Clock, Calendar } from 'lucide-react'

const STATUS_CONFIG = {
  published: { label: 'Published', cls: 'badge-success', icon: <CheckCircle size={12} /> },
  draft:     { label: 'Draft',     cls: 'badge-neutral', icon: <Clock size={12} /> },
  scheduled: { label: 'Scheduled', cls: 'badge-info',    icon: <Calendar size={12} /> },
}
const CAT_COLORS = { Product: 'badge-danger', Guide: 'badge-info', News: 'badge-purple', 'Case Study': 'badge-warning' }

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [posts,  setPosts]  = useState(postsData)

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || p.status === filter)
  )

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog <span className="gradient-text">Posts</span></h1>
          <p className="page-subtitle">{posts.length} posts · {posts.filter(p=>p.status==='published').length} published</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> New Post</button>
      </div>

      <div className="card posts-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search posts..." value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-input" />
        </div>
        <div className="toolbar-filters">
          {['all','published','draft','scheduled'].map(f => (
            <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm"><Filter size={14} /> Filter</button>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div className="table-container" style={{ borderRadius:0, border:'none' }}>
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="table-empty">No posts found.</td></tr>
                : filtered.map(post => (
                  <tr key={post.id} className="animate-fade-in">
                    <td>
                      <div className="post-title-cell">
                        <div className="post-title-dot" />
                        <span className="post-title-text">{post.title}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${CAT_COLORS[post.category]||'badge-neutral'}`}>{post.category}</span></td>
                    <td>
                      <div className="author-cell">
                        <div className="avatar avatar-sm">{post.author[0]}</div>
                        <span>{post.author}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_CONFIG[post.status].cls}`}>
                        {STATUS_CONFIG[post.status].icon} {STATUS_CONFIG[post.status].label}
                      </span>
                    </td>
                    <td><span className="mono-val">{post.views.toLocaleString()}</span></td>
                    <td><span className="table-date">{post.date}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-icon btn-ghost btn-sm"><Eye size={14} /></button>
                        <button className="btn btn-icon btn-ghost btn-sm"><Edit2 size={14} /></button>
                        <button className="btn btn-icon btn-danger btn-sm" onClick={()=>setPosts(p=>p.filter(x=>x.id!==post.id))}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}