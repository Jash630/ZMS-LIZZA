import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Eye, CheckCircle, Clock, Calendar, Save, X, ImagePlus } from 'lucide-react'
import { postsService } from '../../services/postsService'
import { mediaService } from '../../services/mediaService'
import StateBlock from '../../components/ui/StateBlock'

const STATUS_CONFIG = {
  published: { label: 'Published', cls: 'badge-success', icon: <CheckCircle size={12} /> },
  draft: { label: 'Draft', cls: 'badge-neutral', icon: <Clock size={12} /> },
  scheduled: { label: 'Scheduled', cls: 'badge-info', icon: <Calendar size={12} /> },
}

const CAT_COLORS = { Product: 'badge-danger', Guide: 'badge-info', News: 'badge-purple', 'Case Study': 'badge-warning', Announcement: 'badge-neutral' }
const CATEGORY_OPTIONS = ['Product', 'Guide', 'News', 'Case Study', 'Announcement']
const STATUS_OPTIONS = ['draft', 'published', 'scheduled']
const PUBLIC_SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://zmslizzafrontend.vercel.app').replace(/\/+$/, '')

const emptyForm = {
  title: '',
  excerpt: '',
  featuredImage: '',
  category: 'News',
  status: 'draft',
  content: '',
}

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [posts, setPosts] = useState([])
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const summary = useMemo(() => {
    const published = posts.filter((post) => post.status === 'published').length
    return `${meta.total || posts.length} posts | ${published} published on this page`
  }, [posts, meta.total])

  const loadPosts = async (nextPage = page) => {
    setLoading(true)
    setError('')
    try {
      const response = await postsService.list({
        page: nextPage,
        limit: 10,
        status: filter === 'all' ? undefined : filter,
        search: search || undefined,
      })
      setPosts(response?.data || [])
      setMeta(response?.meta || { page: nextPage, totalPages: 1, total: 0 })
      setPage(nextPage)
    } catch (err) {
      setError(err?.message || 'Failed to fetch posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts(1)
    }, 250)
    return () => clearTimeout(timer)
  }, [search, filter])

  const openCreate = () => {
    setEditingPost(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (post) => {
    setEditingPost(post)
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      featuredImage: post.featuredImage || '',
      category: post.category || 'News',
      status: post.status || 'draft',
      content: post.content || '',
    })
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setForm(emptyForm)
    setEditingPost(null)
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    if (!editingPost?._id && !form.featuredImage?.trim()) {
      setError('Please upload or provide a featured image before creating the post.')
      setSaving(false)
      return
    }
    try {
      if (editingPost?._id) {
        await postsService.update(editingPost._id, form)
      } else {
        await postsService.create(form)
      }
      closeForm()
      await loadPosts(1)
    } catch (err) {
      setError(err?.message || 'Failed to save post.')
    } finally {
      setSaving(false)
    }
  }

  const handleFeaturedImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setError('')

    try {
      const response = await mediaService.upload(file)
      const uploadedUrl = response?.data?.url
      if (!uploadedUrl) throw new Error('Upload succeeded but no image URL was returned.')
      setForm((current) => ({ ...current, featuredImage: uploadedUrl }))
    } catch (err) {
      setError(err?.message || 'Failed to upload featured image.')
    } finally {
      setImageUploading(false)
      event.target.value = ''
    }
  }

  const deletePost = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return
    try {
      await postsService.remove(post._id)
      await loadPosts(page)
    } catch (err) {
      setError(err?.message || 'Failed to delete post.')
    }
  }

  const previewPost = (post) => {
    setPreviewItem(post)
  }

  const openPublicPost = (post) => {
    if (!post?.slug) {
      setError('Cannot open public post because slug is missing.')
      return
    }
    const url = `${PUBLIC_SITE_URL}/?page=blog-detail&slug=${encodeURIComponent(post.slug)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog <span className="gradient-text">Posts</span></h1>
          <p className="page-subtitle">{summary}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> New Post</button>
      </div>

      <div className="card posts-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar-input" />
        </div>
        <div className="toolbar-filters">
          {['all', 'published', 'draft', 'scheduled'].map((status) => (
            <button key={status} className={`filter-tab ${filter === status ? 'active' : ''}`} onClick={() => setFilter(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={() => loadPosts(page)} />

      {!loading && !error && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead>
                <tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr><td colSpan={7} className="table-empty">No posts found.</td></tr>
                ) : posts.map((post) => (
                  <tr key={post._id} className="animate-fade-in">
                    <td>
                      <div className="post-title-cell">
                        <div className="post-title-dot" />
                        <span className="post-title-text">{post.title}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${CAT_COLORS[post.category] || 'badge-neutral'}`}>{post.category || 'N/A'}</span></td>
                    <td>
                      <div className="author-cell">
                        <div className="avatar avatar-sm">{post.author?.name?.[0] || 'U'}</div>
                        <span>{post.author?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${(STATUS_CONFIG[post.status] || STATUS_CONFIG.draft).cls}`}>
                        {(STATUS_CONFIG[post.status] || STATUS_CONFIG.draft).icon} {(STATUS_CONFIG[post.status] || STATUS_CONFIG.draft).label}
                      </span>
                    </td>
                    <td><span className="mono-val">{(post.views || 0).toLocaleString()}</span></td>
                    <td><span className="table-date">{new Date(post.createdAt).toLocaleDateString()}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-icon btn-ghost btn-sm" title="View" onClick={() => previewPost(post)}><Eye size={14} /></button>
                        <button className="btn btn-icon btn-ghost btn-sm" title="Edit" onClick={() => openEdit(post)}><Edit2 size={14} /></button>
                        <button className="btn btn-icon btn-danger btn-sm" title="Delete" onClick={() => deletePost(post)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => loadPosts(page - 1)}>Previous</button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
              Page {meta.page || page} of {meta.totalPages || 1}
            </span>
            <button className="btn btn-sm btn-ghost" disabled={page >= (meta.totalPages || 1)} onClick={() => loadPosts(page + 1)}>Next</button>
          </div>
        </div>
      )}

      {formOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflow: 'auto', padding: 20 }}>
            <form onSubmit={submitForm} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 20 }}>{editingPost ? 'Edit Post' : 'Create Post'}</h3>
                <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={closeForm}><X size={15} /></button>
              </div>
              <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} required />
              <input className="input" placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((current) => ({ ...current, excerpt: e.target.value }))} />
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Featured Image</span>
                  <label className="btn btn-ghost btn-sm" style={{ cursor: imageUploading ? 'not-allowed' : 'pointer' }}>
                    <ImagePlus size={14} /> {imageUploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" hidden onChange={handleFeaturedImageUpload} disabled={imageUploading} />
                  </label>
                </div>
                <input
                  className="input"
                  placeholder="Paste featured image URL"
                  value={form.featuredImage}
                  onChange={(e) => setForm((current) => ({ ...current, featuredImage: e.target.value }))}
                />
                {form.featuredImage && (
                  <img
                    src={form.featuredImage}
                    alt="Featured preview"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }}
                  />
                )}
              </div>
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
                <select className="input" value={form.category} onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}>
                  {CATEGORY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select className="input" value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}>
                  {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <textarea className="input" rows={10} placeholder="Content" value={form.content} onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 900, maxHeight: '90vh', overflow: 'auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 20 }}>Preview Post</h3>
              <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => setPreviewItem(null)}><X size={15} /></button>
            </div>

            {previewItem.featuredImage && (
              <img
                src={previewItem.featuredImage}
                alt={previewItem.title}
                style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 12 }}
              />
            )}

            <h4 style={{ fontSize: 26, marginBottom: 8 }}>{previewItem.title}</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{previewItem.excerpt || 'No excerpt provided.'}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span className={`badge ${CAT_COLORS[previewItem.category] || 'badge-neutral'}`}>{previewItem.category || 'N/A'}</span>
              <span className={`badge ${(STATUS_CONFIG[previewItem.status] || STATUS_CONFIG.draft).cls}`}>
                {(STATUS_CONFIG[previewItem.status] || STATUS_CONFIG.draft).label}
              </span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: 16 }}>
              {previewItem.content || 'No content provided.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setPreviewItem(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => openPublicPost(previewItem)} disabled={previewItem.status !== 'published'}>
                Open Public Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
