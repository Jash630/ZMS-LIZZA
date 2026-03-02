import React, { useState } from 'react'
import { leadsData } from '../../data/mockData'
import { Phone, Search, MessageCircle, MapPin, Cpu } from 'lucide-react'

const STATUS_CFG = { hot: { cls:'badge-danger', emoji:'🔥' }, warm: { cls:'badge-warning', emoji:'☀️' }, cold: { cls:'badge-info', emoji:'❄️' } }
const SOURCE_CFG = { WhatsApp:{ cls:'badge-success', icon:'💬' }, Website:{ cls:'badge-info', icon:'🌐' }, Call:{ cls:'badge-purple', icon:'📞' }, Referral:{ cls:'badge-warning', icon:'🤝' } }

export default function LeadsPage() {
  const [leads,  setLeads]  = useState(leadsData)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = leads.filter(l =>
    (filter==='all' || l.status===filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase()))
  )
  const counts = { all:leads.length, hot:leads.filter(l=>l.status==='hot').length, warm:leads.filter(l=>l.status==='warm').length, cold:leads.filter(l=>l.status==='cold').length }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads & <span className="gradient-text">Enquiries</span></h1>
          <p className="page-subtitle">{counts.hot} hot leads need attention</p>
        </div>
        <button className="btn btn-primary"><Phone size={15}/> Add Lead</button>
      </div>

      <div className="stats-grid stagger-children" style={{ marginBottom:20 }}>
        {[['Total Leads',counts.all,'📊'],['Hot Leads',counts.hot,'🔥'],['Warm Leads',counts.warm,'☀️'],['Cold Leads',counts.cold,'❄️']].map((s,i)=>(
          <div key={i} className="card animate-fade-in" style={{ padding:'18px 20px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'var(--bg-tertiary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s[2]}</div>
            <div>
              <div style={{ fontFamily:'Syne', fontSize:26, fontWeight:800, color:'var(--text-primary)' }}>{s[1]}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s[0]}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card posts-toolbar" style={{ marginBottom:20 }}>
        <div className="toolbar-search">
          <Search size={15}/>
          <input type="text" placeholder="Search leads..." value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-input"/>
        </div>
        <div className="toolbar-filters">
          {['all','hot','warm','cold'].map(f=>(
            <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {STATUS_CFG[f]?.emoji||''} {f.charAt(0).toUpperCase()+f.slice(1)} ({counts[f]??0})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }} className="stagger-children">
        {filtered.map(lead=>(
          <div key={lead.id} className="card animate-fade-in" style={{ padding:20, borderLeft: lead.status==='hot'?'3px solid var(--red)':'3px solid transparent', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
              <div style={{ position:'relative' }}>
                <div className="avatar">{lead.name[0]}</div>
                {lead.status==='hot' && <div style={{ position:'absolute', bottom:-4, right:-4, fontSize:12 }}>🔥</div>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Syne', fontSize:15, fontWeight:700, marginBottom:5 }}>{lead.name}</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-muted)' }}><MapPin size={11}/>{lead.city}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-muted)' }}><Cpu size={11}/>{lead.machines}</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                <span className={`badge ${STATUS_CFG[lead.status].cls}`}>{STATUS_CFG[lead.status].emoji} {lead.status}</span>
                <span className={`badge ${SOURCE_CFG[lead.source]?.cls||'badge-neutral'}`}>{SOURCE_CFG[lead.source]?.icon} {lead.source}</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid var(--border-light)', borderBottom:'1px solid var(--border-light)', marginBottom:12, fontSize:13, fontWeight:600, fontFamily:'JetBrains Mono, monospace' }}>
              <span>{lead.contact}</span>
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>{lead.date}</span>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
              <a href={`tel:${lead.contact}`} className="btn btn-sm btn-ghost"><Phone size={13}/> Call</a>
              <a href={`https://wa.me/91`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background:'rgba(37,211,102,0.12)', color:'#25D366', border:'1px solid rgba(37,211,102,0.2)' }}>
                <MessageCircle size={13}/> WhatsApp
              </a>
              <select className="filter-tab" style={{ marginLeft:'auto', borderRadius:'var(--radius-sm)', padding:'5px 10px' }}
                value={lead.status} onChange={e=>setLeads(p=>p.map(l=>l.id===lead.id?{...l,status:e.target.value}:l))}>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}