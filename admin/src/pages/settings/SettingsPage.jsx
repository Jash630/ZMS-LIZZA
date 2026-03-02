import React, { useState } from 'react'
import { Globe, Bell, Shield, Palette, Save, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const TABS = ['general','appearance','notifications','security']
const TAB_ICONS = { general:Globe, appearance:Palette, notifications:Bell, security:Shield }

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [saved,     setSaved]     = useState(false)
  const [showPass,  setShowPass]  = useState(false)
  const [general,   setGeneral]   = useState({
    siteName:    'ZMS LIZZA',
    tagline:     'European Technology - Embroidery Machine Manufacturer',
    siteUrl:     'https://zmslizza.com',
    phone:       '+91 98765 43210',
    whatsapp:    '+91 98765 43210',
    email:       'info@zmslizza.com',
    address:     'Mumbai, Maharashtra, India',
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & <span className="gradient-text">Configuration</span></h1>
          <p className="page-subtitle">Manage your admin panel preferences</p>
        </div>
        <button className="btn btn-primary" onClick={()=>{ setSaved(true); setTimeout(()=>setSaved(false),2000) }}>
          <Save size={15}/> {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20 }}>
        <div className="card" style={{ padding:12, height:'fit-content' }}>
          {TABS.map(tab=>{
            const Icon=TAB_ICONS[tab]
            return (
              <button key={tab} className={`nav-item ${activeTab===tab?'active':''}`} onClick={()=>setActiveTab(tab)} style={{ width:'100%', marginBottom:2, textTransform:'capitalize' }}>
                <Icon size={16}/> {tab}
              </button>
            )
          })}
        </div>

        <div className="card" style={{ padding:28 }}>
          {activeTab==='general' && (
            <div style={{ display:'grid', gap:18 }}>
              <h3 style={{ fontFamily:'Syne', fontSize:17, fontWeight:800 }}>General Settings</h3>
              {Object.entries(general).map(([key,val])=>(
                <div key={key} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)', textTransform:'capitalize' }}>{key.replace(/([A-Z])/g,' $1')}</label>
                  <input className="input" value={val} onChange={e=>setGeneral(p=>({...p,[key]:e.target.value}))}/>
                </div>
              ))}
            </div>
          )}

          {activeTab==='appearance' && (
            <div style={{ display:'grid', gap:18 }}>
              <h3 style={{ fontFamily:'Syne', fontSize:17, fontWeight:800 }}>Appearance</h3>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:16, background:'var(--bg-input)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)' }}>
                <div>
                  <p style={{ fontWeight:600, fontSize:14 }}>Color Theme</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)' }}>Switch between light and dark mode</p>
                </div>
                <button className="btn btn-ghost" onClick={toggleTheme}>{theme==='dark'?'☀️ Light Mode':'🌙 Dark Mode'}</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))', gap:10 }}>
                {[['Brand Red','#E63946'],['Brand Purple','#8B2F97'],['Brand Blue','#2E5EAA'],['Brand Orange','#FF6B35']].map(([name,color])=>(
                  <div key={name} style={{ textAlign:'center', cursor:'pointer' }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:color, margin:'0 auto 6px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}/>
                    <span style={{ fontSize:10, color:'var(--text-muted)' }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab==='notifications' && (
            <div style={{ display:'grid', gap:14 }}>
              <h3 style={{ fontFamily:'Syne', fontSize:17, fontWeight:800 }}>Notification Preferences</h3>
              {['New lead enquiries','Comment moderation','Post published','System updates','Weekly performance report'].map((label,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'var(--bg-input)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)' }}>
                  <span style={{ fontWeight:600, fontSize:14 }}>{label}</span>
                  <input type="checkbox" defaultChecked style={{ width:18, height:18, accentColor:'var(--red)', cursor:'pointer' }}/>
                </div>
              ))}
            </div>
          )}

          {activeTab==='security' && (
            <div style={{ display:'grid', gap:18 }}>
              <h3 style={{ fontFamily:'Syne', fontSize:17, fontWeight:800 }}>Security Settings</h3>
              {['Current Password','New Password','Confirm Password'].map((label,i)=>(
                <div key={i} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>{label}</label>
                  <div style={{ position:'relative' }}>
                    <input className="input" type={showPass&&i===0?'text':'password'} placeholder="••••••••" style={{ paddingRight: i===0?44:14 }}/>
                    {i===0 && (
                      <button style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }} onClick={()=>setShowPass(v=>!v)}>
                        {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button className="btn btn-primary btn-sm" style={{ alignSelf:'flex-start' }}><Shield size={14}/> Update Password</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
