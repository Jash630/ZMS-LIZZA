import React, { useState } from 'react'
import { usersData } from '../../data/mockData'
import { UserPlus, Shield, User, Edit3, Search, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ROLE_CFG = {
  superadmin: { cls:'badge-danger',  label:'Super Admin', gradient:'linear-gradient(135deg,#E63946,#8B2F97)' },
  admin:      { cls:'badge-info',    label:'Admin',       gradient:'linear-gradient(135deg,#2E5EAA,#8B2F97)' },
  editor:     { cls:'badge-warning', label:'Editor',      gradient:'linear-gradient(135deg,#FF6B35,#E63946)' },
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [search, setSearch] = useState('')

  const filtered = usersData.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users & <span className="gradient-text">Authors</span></h1>
          <p className="page-subtitle">{usersData.length} team members</p>
        </div>
        {(currentUser?.role==='superadmin'||currentUser?.role==='admin') && (
          <button className="btn btn-primary"><UserPlus size={15}/> Add User</button>
        )}
      </div>

      <div className="stats-grid stagger-children" style={{ marginBottom:24 }}>
        {[
          ['Total Users',  usersData.length,                                  User,   '#2E5EAA'],
          ['Super Admins', usersData.filter(u=>u.role==='superadmin').length, Shield, '#E63946'],
          ['Admins',       usersData.filter(u=>u.role==='admin').length,      User,   '#8B2F97'],
          ['Editors',      usersData.filter(u=>u.role==='editor').length,     Edit3,  '#FF6B35'],
        ].map(([label,value,Icon,color],i)=>(
          <div key={i} className="card animate-fade-in" style={{ padding:'18px 20px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
              <Icon size={18} color="white"/>
            </div>
            <div>
              <div style={{ fontFamily:'Syne', fontSize:24, fontWeight:800, color:'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card posts-toolbar" style={{ marginBottom:20 }}>
        <div className="toolbar-search">
          <Search size={15}/>
          <input type="text" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-input"/>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {filtered.map(u=>{
          const rc=ROLE_CFG[u.role]||ROLE_CFG.editor
          const initials=u.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
          const isMe=u.email===currentUser?.email
          return (
            <div key={u.id} className="card animate-fade-in" style={{ padding:20, border: isMe?'2px solid var(--red)':'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <div className="avatar avatar-lg" style={{ background:rc.gradient }}>{initials}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:'Syne', fontSize:15, fontWeight:700 }}>{u.name}</span>
                    {isMe && <span className="badge badge-success" style={{ fontSize:9 }}>You</span>}
                  </div>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>{u.email}</span>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid var(--border-light)', borderBottom:'1px solid var(--border-light)', marginBottom:14 }}>
                <span className={`badge ${rc.cls}`}>{rc.label}</span>
                <span className={`badge ${u.status==='active'?'badge-success':'badge-neutral'}`}>{u.status}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:'var(--text-muted)', marginBottom: currentUser?.role==='superadmin'&&!isMe ? 14 : 0 }}>
                <span>📝 {u.posts} posts</span>
                <span>🕐 {u.lastLogin}</span>
              </div>
              {currentUser?.role==='superadmin'&&!isMe && (
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}><Edit3 size={13}/> Edit Role</button>
                  <button className="btn btn-danger btn-sm"><Trash2 size={13}/></button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}