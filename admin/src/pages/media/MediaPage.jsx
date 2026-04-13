import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Upload, Grid, List, Search, Image, FileText, Film, Trash2, Download, Copy, RefreshCw, Link2, Youtube, Play } from 'lucide-react'
import { mediaService } from '../../services/mediaService'
import StateBlock from '../../components/ui/StateBlock'

const TYPE_ICONS = { image: Image, pdf: FileText, video: Film, document: FileText, other: FileText }
const TYPE_COLORS = { image: '#2E5EAA', pdf: '#E63946', video: '#8B2F97', document: '#FF6B35', other: '#64748B' }
const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'music.youtube.com'])

const getYoutubeVideoId = (rawUrl = '') => {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace(/^www\./, '')
    let videoId = ''

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || ''
    } else if (YOUTUBE_HOSTS.has(host)) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || ''
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/live/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : ''
  } catch {
    return ''
  }
}

const getYoutubeThumbnail = (url = '') => {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''
}

export default function MediaPage() {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [addingUrl, setAddingUrl] = useState(false)
  const [videoForm, setVideoForm] = useState({ name: '', url: '' })
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 })
  const [previewThumb, setPreviewThumb] = useState('')
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

  // Live thumbnail preview as user types URL
  useEffect(() => {
    const thumb = getYoutubeThumbnail(videoForm.url)
    setPreviewThumb(thumb)
  }, [videoForm.url])

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

  const handleCreateVideoFromUrl = async (event) => {
    event.preventDefault()
    const name = videoForm.name.trim()
    const url = videoForm.url.trim()

    if (!url) {
      setError('Please paste a YouTube URL first.')
      return
    }

    setAddingUrl(true)
    setError('')
    try {
      await mediaService.createFromUrl({
        name: name || undefined,
        url,
      })
      setVideoForm({ name: '', url: '' })
      setPreviewThumb('')
      await fetchMedia(1)
    } catch (err) {
      setError(err?.message || 'Failed to add YouTube video.')
    } finally {
      setAddingUrl(false)
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

      {/* ── Redesigned YouTube Section ── */}
      <style>{`
        .yt-section {
          position: relative;
          margin-bottom: 20px;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(255,0,0,0.08);
        }
        .yt-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff0000, #ff4444, #ff6b6b, #ff4444, #ff0000);
          background-size: 200% 100%;
          animation: yt-shimmer 3s linear infinite;
        }
        @keyframes yt-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .yt-bg-logo {
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.04;
          pointer-events: none;
          user-select: none;
        }
        .yt-inner {
          position: relative;
          z-index: 1;
          padding: 22px 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .yt-preview-col {
          flex-shrink: 0;
          width: 130px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .yt-thumb-box {
          width: 130px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: border-color 0.3s;
        }
        .yt-thumb-box.has-thumb {
          border-color: rgba(255, 0, 0, 0.4);
        }
        .yt-thumb-box img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .yt-play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .yt-play-btn {
          width: 30px; height: 30px;
          background: #ff0000;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(255,0,0,0.5);
        }
        .yt-empty-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.2);
        }
        .yt-empty-icon span {
          font-size: 10px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .yt-form-col {
          flex: 1;
          min-width: 0;
        }
        .yt-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .yt-icon-wrap {
          width: 32px; height: 32px;
          background: #ff0000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(255,0,0,0.45);
          flex-shrink: 0;
        }
        .yt-title {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.01em;
        }
        .yt-subtitle {
          font-size: 11.5px;
          color: rgba(255,255,255,0.4);
          margin: 0 0 14px 0;
          line-height: 1.5;
        }
        .yt-fields {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          align-items: end;
        }
        .yt-label {
          display: grid;
          gap: 5px;
        }
        .yt-label-text {
          font-size: 10.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .yt-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 9px !important;
          color: #ffffff !important;
          font-size: 13px !important;
          padding: 9px 13px !important;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
          outline: none;
        }
        .yt-input::placeholder {
          color: rgba(255,255,255,0.25) !important;
        }
        .yt-input:focus {
          border-color: rgba(255,0,0,0.5) !important;
          background: rgba(255,255,255,0.1) !important;
          box-shadow: 0 0 0 3px rgba(255,0,0,0.1) !important;
        }
        .yt-submit-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          padding: 9px 18px !important;
          background: linear-gradient(135deg, #ff0000, #cc0000) !important;
          color: #fff !important;
          border: none !important;
          border-radius: 9px !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.02em !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          white-space: nowrap !important;
          box-shadow: 0 3px 14px rgba(255,0,0,0.35) !important;
          width: 100% !important;
        }
        .yt-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff2020, #e00000) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 5px 18px rgba(255,0,0,0.45) !important;
        }
        .yt-submit-btn:disabled {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }
        .yt-dots {
          display: flex;
          gap: 3px;
          align-items: center;
        }
        .yt-dot {
          width: 5px; height: 5px;
          background: #fff;
          border-radius: 50%;
          animation: yt-bounce 1.2s infinite ease-in-out;
        }
        .yt-dot:nth-child(2) { animation-delay: 0.2s; }
        .yt-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes yt-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .yt-supported-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }
        .yt-chip {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.35);
          font-weight: 500;
          letter-spacing: 0.03em;
        }
        @media (max-width: 640px) {
          .yt-inner { flex-direction: column; }
          .yt-preview-col { width: 100%; flex-direction: row; align-items: center; }
          .yt-thumb-box { width: 100px; height: 62px; }
        }
      `}</style>

      <form className="yt-section" onSubmit={handleCreateVideoFromUrl}>
        {/* Big decorative YouTube logo */}
        <svg className="yt-bg-logo" width="320" height="220" viewBox="0 0 320 220" fill="none">
          <rect width="320" height="220" rx="40" fill="white"/>
          <path d="M137 70L197 110L137 150V70Z" fill="white"/>
        </svg>

        <div className="yt-inner">
          {/* Thumbnail Preview Column */}
          <div className="yt-preview-col">
            <div className={`yt-thumb-box ${previewThumb ? 'has-thumb' : ''}`}>
              {previewThumb ? (
                <>
                  <img src={previewThumb} alt="Video preview" />
                  <div className="yt-play-overlay">
                    <div className="yt-play-btn">
                      <Play size={12} color="#fff" fill="#fff" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="yt-empty-icon">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                    <rect width="28" height="20" rx="4" fill="rgba(255,255,255,0.12)"/>
                    <path d="M11 6L19 10L11 14V6Z" fill="rgba(255,255,255,0.3)"/>
                  </svg>
                  <span>Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Column */}
          <div className="yt-form-col">
            <div className="yt-header">
              <div className="yt-icon-wrap">
                <Youtube size={16} color="#fff" />
              </div>
              <span className="yt-title">Add YouTube Video</span>
            </div>
            <p className="yt-subtitle">
              Paste any YouTube video, Shorts, or Live URL — thumbnail auto-previews instantly.
            </p>

            <div className="yt-fields">
              <label className="yt-label">
                <span className="yt-label-text">Video Name (optional)</span>
                <input
                  type="text"
                  value={videoForm.name}
                  onChange={(event) => setVideoForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Ex: ZMS LIZZA Machine Demo"
                  className="yt-input"
                />
              </label>
              <label className="yt-label">
                <span className="yt-label-text">YouTube URL</span>
                <input
                  type="url"
                  required
                  value={videoForm.url}
                  onChange={(event) => setVideoForm((current) => ({ ...current, url: event.target.value }))}
                  placeholder="https://youtube.com/shorts/..."
                  className="yt-input"
                />
              </label>
              <div className="yt-label">
                <span className="yt-label-text">&nbsp;</span>
                <button className="yt-submit-btn" type="submit" disabled={addingUrl}>
                  {addingUrl ? (
                    <>
                      <div className="yt-dots">
                        <div className="yt-dot" />
                        <div className="yt-dot" />
                        <div className="yt-dot" />
                      </div>
                      Adding…
                    </>
                  ) : (
                    <>
                      <Link2 size={14} />
                      Add Video URL
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="yt-supported-chips">
              <span className="yt-chip">youtube.com/watch</span>
              <span className="yt-chip">youtube.com/shorts</span>
              <span className="yt-chip">youtube.com/live</span>
              <span className="yt-chip">youtu.be</span>
            </div>
          </div>
        </div>
      </form>
      {/* ── End Redesigned YouTube Section ── */}

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
            const youtubeThumbnail = file.type === 'video' ? getYoutubeThumbnail(file.url) : ''
            return (
              <div key={file._id} className="card animate-fade-in" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                  {file.type === 'image'
                    ? <img src={file.url} alt={file.originalName || file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : youtubeThumbnail
                      ? <img src={youtubeThumbnail} alt={file.name || 'YouTube video'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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