import React, { useState } from 'react'
import { notificationsData } from '../../data/mockData'
import { Bell, Check, Trash2, PhoneCall, MessageSquare, FileText, Settings } from 'lucide-react'

const TYPE_CFG = {
  lead:    { icon:PhoneCall,     color:'#E63946', bg:'rgba(230,57,70,0.1)',  label:'Lead' },
  comment: { icon:MessageSquare, color:'#2E5EAA', bg:'rgba(46,94,170,0.1)', label:'Comment' },
  post:    { icon:FileText,      color:'#8B2F97', bg:'rgba(139,47,151,0.1)',label:'Post' },
  system:  { icon:Settings,      color:'#10B981', bg:'rgba(16,185,129,0.1)',label:'System' },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notificationsData)
  const unread = notifs.filter(n=>!n.read).length

  const markRead    = (id) => setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n))
  const markAllRead = ()   => setNotifs(p=>p.map(n=>({...n,read:true})))
  const deleteNotif = (id) => setNotifs(p=>p.filter(n=>n.id!==id))

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications <span className="gradient-text">&amp; Alerts</span></h1>
          <p className="page-subtitle">{unread} unread notifications</p>
        </div>
        {unread>0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}><Check size={14}/> Mark all read</button>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {notifs.length===0 && (
          <div className="card" style={{ padding:60, textAlign:'center', color:'var(--text-muted)' }}>
            <Bell size={36} style={{ margin:'0 auto 12px', opacity:0.3 }}/><p>No notifications</p>
          </div>
        )}
        {notifs.map(n=>{
          const cfg=TYPE_CFG[n.type]||TYPE_CFG.system
          const Icon=cfg.icon
          return (
            <div key={n.id} className="card animate-fade-in" style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:14, borderLeft:`3px solid ${n.read?'transparent':cfg.color}`, background: n.read?'var(--bg-card)':`color-mix(in srgb,${cfg.color} 3%,var(--bg-card))` }}>
              <div style={{ width:40, height:40, borderRadius:11, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={18} color={cfg.color}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:14, fontWeight:n.read?400:600, color:'var(--text-primary)', lineHeight:1.4 }}>{n.message}</p>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                  <span className="badge badge-neutral" style={{ fontSize:10 }}>{cfg.label}</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>{n.time}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                {!n.read && <button className="btn btn-icon btn-ghost btn-sm" onClick={()=>markRead(n.id)}><Check size={14}/></button>}
                <button className="btn btn-icon btn-danger btn-sm" onClick={()=>deleteNotif(n.id)}><Trash2 size={14}/></button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}