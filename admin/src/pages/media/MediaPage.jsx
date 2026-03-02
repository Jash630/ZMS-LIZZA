import React, { useState } from 'react'
import { mediaData } from '../../data/mockData'
import { Upload, Grid, List, Search, Image, FileText, Film, Trash2, Download, Copy } from 'lucide-react'

const TYPE_ICONS  = { image: Image, pdf: FileText, video: Film }
const TYPE_COLORS = { image: '#2E5EAA', pdf: '#E63946', video: '#8B2F97' }

export default function MediaPage() {
  const [view,   setView]   = useState('grid')
  const [search, setSearch] = useState('')
  const [type,   setType]   = useState('all')

  const filtered = mediaData.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) &&
    (type==='all' || m.type===type)
  )

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media <span className="gradient-text">Library</span></h1>
          <p className="page-subtitle">{mediaData.length} files stored</p>
        </div>
        <button className="btn btn-primary"><Upload size={15}/> Upload Files</button>
      </div>

      {/* Upload zone */}
      <div style={{ border:'2px dashed var(--border)', borderRadius:'var(--radius-lg)', padding:28, display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:20, background:'var(--bg-card)', cursor:'pointer', transition:'all var(--transition)', flexWrap:'wrap' }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--red)';e.currentTarget.style.background='rgba(230,57,70,0.02)'}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--bg-card)'}}>
        <span style={{ fontSize:28 }}>📁</span>
        <div>
          <strong style={{ fontSize:14, fontWeight:600, display:'block' }}>Drop files here</strong>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>or click to browse — JPG, PNG, PDF, MP4 (max 50MB)</span>
        </div>
        <button className="btn btn-ghost btn-sm">Browse Files</button>
      </div>

      <div className="card posts-toolbar" style={{ marginBottom:20 }}>
        <div className="toolbar-search">
          <Search size={15}/>
          <input type="text" placeholder="Search files..." value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-input"/>
        </div>
        <div className="toolbar-filters">
          {['all','image','pdf','video'].map(t=>(
            <button key={t} className={`filter-tab ${type===t?'active':''}`} onClick={()=>setType(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <button className={`btn btn-icon btn-ghost btn-sm ${view==='grid'?'active-view':''}`} onClick={()=>setView('grid')}><Grid size={15}/></button>
          <button className={`btn btn-icon btn-ghost btn-sm ${view==='list'?'active-view':''}`} onClick={()=>setView('list')}><List size={15}/></button>
        </div>
      </div>

      {view==='grid' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16 }} className="stagger-children">
          {filtered.map(file=>{
            const Icon=TYPE_ICONS[file.type]||Image
            return (
              <div key={file.id} className="card animate-fade-in" style={{ overflow:'hidden', padding:0, cursor:'pointer' }}>
                <div style={{ position:'relative', aspectRatio:'16/10', overflow:'hidden', background:'var(--bg-tertiary)' }}
                  onMouseEnter={e=>e.currentTarget.querySelector('.media-overlay').style.opacity='1'}
                  onMouseLeave={e=>e.currentTarget.querySelector('.media-overlay').style.opacity='0'}>
                  {file.type==='image'
                    ? <img src={file.url} alt={file.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:`${TYPE_COLORS[file.type]}22` }}><Icon size={32} color={TYPE_COLORS[file.type]}/></div>}
                  <div className="media-overlay" style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:0, transition:'opacity 0.2s' }}>
                    {[Copy,Download,Trash2].map((Ic,i)=>(
                      <button key={i} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}><Ic size={14}/></button>
                    ))}
                  </div>
                </div>
                <div style={{ padding:12 }}>
                  <span style={{ fontSize:12.5, fontWeight:600, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:6 }}>{file.name}</span>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span className={`badge ${file.type==='image'?'badge-info':file.type==='pdf'?'badge-danger':'badge-purple'}`}>{file.type}</span>
                    <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'JetBrains Mono,monospace' }}>{file.size}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view==='list' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <div className="table-container" style={{ borderRadius:0, border:'none' }}>
            <table>
              <thead><tr><th>File</th><th>Type</th><th>Size</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(file=>{
                  const Icon=TYPE_ICONS[file.type]||Image
                  return (
                    <tr key={file.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:8, background:`${TYPE_COLORS[file.type]}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon size={16} color={TYPE_COLORS[file.type]}/></div>
                          <span style={{ fontWeight:600, fontSize:13 }}>{file.name}</span>
                        </div>
                      </td>
                      <td><span className={`badge ${file.type==='image'?'badge-info':file.type==='pdf'?'badge-danger':'badge-purple'}`}>{file.type}</span></td>
                      <td><span className="mono-val">{file.size}</span></td>
                      <td><span className="table-date">{file.date}</span></td>
                      <td><div className="action-btns">{[Copy,Download,Trash2].map((Ic,i)=><button key={i} className="btn btn-icon btn-ghost btn-sm"><Ic size={14}/></button>)}</div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}