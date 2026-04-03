import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Upload, Grid, List, Search, Image, FileText, Film, Trash2, Download, Copy, RefreshCw } from 'lucide-react'
import { mediaService } from '../../services/mediaService'
import StateBlock from '../../components/ui/StateBlock'

const TYPE_ICONS = { image: Image, pdf: FileText, video: Film, document: FileText, other: FileText }
const TYPE_COLORS = { image: '#2E5EAA', pdf: '#E63946', video: '#8B2F97', document: '#FF6B35', other: '#64748B' }

export default function MediaPage() {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 })
  const inputRef = useRef(null)

  const fetchMedia = async (nextPage = page) => {
    setLoading(true)
    setError('')
    try {
      const response = await mediaService.list({
        page: nextPage,
        limit: 20,
        type: type === 'all' ? undefined : type,
        search: search || undefined,
      })
      setFiles(response?.data || [])
      setMeta(response?.meta || { page: nextPage, totalPages: 1, total: 0 })
      setPage(nextPage)
    } catch (err) {
      setError(err?.message || 'Failed to load media.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchMedia(1), 250)
    return () => clearTimeout(timer)
  }, [search, type])

  const handleUpload = async (selectedFiles) => {
    const fileList = Array.from(selectedFiles || [])
    if (!fileList.length) return
    setUploading(true)
    setError('')
    try {
      await Promise.all(fileList.map((file) => mediaService.upload(file)))
      await fetchMedia(1)
    } catch (err) {
      setError(err?.message || 'Upload failed.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const deleteMedia = async (id) => {
    if (!window.confirm('Delete this file?')) return
    try {
      await mediaService.remove(id)
      setFiles((current) => current.filter((item) => item._id !== id))
    } catch (err) {
      setError(err?.message || 'Failed to delete media.')
    }
  }

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (err) {
      setError(err?.message || 'Failed to copy media link.')
    }
  }

  const filesCountText = useMemo(() => `${meta.total || files.length} files stored`, [meta.total, files.length])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media <span className="gradient-text">Library</span></h1>
          <p className="page-subtitle">{filesCountText}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => fetchMedia(page)}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>

      <input ref={inputRef} type="file" multiple hidden onChange={(e) => handleUpload(e.target.files)} />

      <div
        style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20, background: 'var(--bg-card)', cursor: 'pointer', transition: 'all var(--transition)', flexWrap: 'wrap' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleUpload(e.dataTransfer.files)
        }}
      >
        <span style={{ fontSize: 28 }}>📁</span>
        <div>
          <strong style={{ fontSize: 14, fontWeight: 600, display: 'block' }}>Drop files here</strong>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or click to browse - JPG, PNG, PDF, MP4</span>
        </div>
      </div>

      <div className="card posts-toolbar" style={{ marginBottom: 20 }}>
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar-input" />
        </div>
        <div className="toolbar-filters">
          {['all', 'image', 'pdf', 'video'].map((item) => (
            <button key={item} className={`filter-tab ${type === item ? 'active' : ''}`} onClick={() => setType(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className={`btn btn-icon btn-ghost btn-sm ${view === 'grid' ? 'active-view' : ''}`} onClick={() => setView('grid')}><Grid size={15} /></button>
          <button className={`btn btn-icon btn-ghost btn-sm ${view === 'list' ? 'active-view' : ''}`} onClick={() => setView('list')}><List size={15} /></button>
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={() => fetchMedia(page)} />

      {!loading && !error && view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }} className="stagger-children">
          {files.map((file) => {
            const Icon = TYPE_ICONS[file.type] || FileText
            const color = TYPE_COLORS[file.type] || TYPE_COLORS.other
            return (
              <div key={file._id} className="card animate-fade-in" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                  {file.type === 'image'
                    ? <img src={file.url} alt={file.originalName || file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}22` }}><Icon size={34} color={color} /></div>}
                </div>
                <div style={{ padding: 12 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{file.originalName || file.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className={`badge ${file.type === 'image' ? 'badge-info' : file.type === 'pdf' ? 'badge-danger' : 'badge-purple'}`}>{file.type}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono,monospace' }}>{file.sizeFormatted || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-icon btn-ghost btn-sm" onClick={() => copyLink(file.url)} title="Copy link"><Copy size={14} /></button>
                    <a className="btn btn-icon btn-ghost btn-sm" href={file.url} target="_blank" rel="noreferrer" title="Download"><Download size={14} /></a>
                    <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteMedia(file._id)} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            )
          })}
          {files.length === 0 && <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>No files found.</div>}
        </div>
      )}

      {!loading && !error && view === 'list' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead><tr><th>File</th><th>Type</th><th>Size</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {files.map((file) => {
                  const Icon = TYPE_ICONS[file.type] || FileText
                  const color = TYPE_COLORS[file.type] || TYPE_COLORS.other
                  return (
                    <tr key={file._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} color={color} />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{file.originalName || file.name}</span>
                        </div>
                      </td>
                      <td><span className={`badge ${file.type === 'image' ? 'badge-info' : file.type === 'pdf' ? 'badge-danger' : 'badge-purple'}`}>{file.type}</span></td>
                      <td><span className="mono-val">{file.sizeFormatted || '-'}</span></td>
                      <td><span className="table-date">{new Date(file.createdAt).toLocaleDateString()}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-icon btn-ghost btn-sm" onClick={() => copyLink(file.url)}><Copy size={14} /></button>
                          <a className="btn btn-icon btn-ghost btn-sm" href={file.url} target="_blank" rel="noreferrer"><Download size={14} /></a>
                          <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteMedia(file._id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {files.length === 0 && <tr><td colSpan={5} className="table-empty">No files found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => fetchMedia(page - 1)}>Previous</button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Page {meta.page || page} of {meta.totalPages || 1}</span>
          <button className="btn btn-sm btn-ghost" disabled={page >= (meta.totalPages || 1)} onClick={() => fetchMedia(page + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
