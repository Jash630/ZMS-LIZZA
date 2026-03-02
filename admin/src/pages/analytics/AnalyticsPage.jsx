import React from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { revenueData, topPagesData } from '../../data/mockData'
import { TrendingUp, Eye, Users, MousePointer } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p,i)=><p key={i} style={{ color:p.color, fontSize:12, marginTop:2 }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></p>)}
    </div>
  )
}

export default function AnalyticsPage() {
  const kpis = [
    { label:'Total Views',      value:'58,400', change:'+18%', icon:Eye,          color:'linear-gradient(135deg,#2E5EAA,#8B2F97)' },
    { label:'Unique Visitors',  value:'24,200', change:'+12%', icon:Users,        color:'linear-gradient(135deg,#E63946,#8B2F97)' },
    { label:'Avg. Time on Site',value:'3m 42s', change:'+8%',  icon:MousePointer, color:'linear-gradient(135deg,#FF6B35,#E63946)' },
    { label:'Bounce Rate',      value:'38.4%',  change:'-5%',  icon:TrendingUp,   color:'linear-gradient(135deg,#10B981,#2E5EAA)' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics <span className="gradient-text">Insights</span></h1>
          <p className="page-subtitle">Website performance & visitor behavior</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <select className="chart-select"><option>Last 9 months</option></select>
          <button className="btn btn-primary btn-sm"><TrendingUp size={14}/> Export</button>
        </div>
      </div>

      <div className="stats-grid stagger-children">
        {kpis.map((kpi,i)=>(
          <div key={i} className="card animate-fade-in" style={{ padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:kpi.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
                <kpi.icon size={18} color="white"/>
              </div>
              <div>
                <div style={{ fontFamily:'Syne', fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>{kpi.value}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{kpi.label}</div>
              </div>
            </div>
            <span className={`badge ${kpi.change.startsWith('+')?'badge-success':'badge-danger'}`}>{kpi.change}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div className="card chart-card">
          <div className="chart-card-header"><div><h3>Traffic Over Time</h3><p>Monthly unique visitors</p></div></div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top:10,right:10,left:-20,bottom:0 }}>
              <defs>
                <linearGradient id="gV2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2E5EAA" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#2E5EAA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-muted)' }}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-muted)' }}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="views" name="Views" stroke="#2E5EAA" fill="url(#gV2)" strokeWidth={2.5} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="chart-card-header"><div><h3>Lead Conversions</h3><p>Monthly lead generation</p></div></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} margin={{ top:10,right:10,left:-20,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-muted)' }}/>
              <YAxis tick={{ fontSize:12, fill:'var(--text-muted)' }}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="leads" name="Leads" fill="#E63946" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ fontFamily:'Syne', fontSize:15, fontWeight:700 }}>Top Performing Pages</h3>
        </div>
        <div className="table-container" style={{ borderRadius:0, border:'none' }}>
          <table>
            <thead><tr><th>#</th><th>Page</th><th>Views</th><th>Leads</th><th>Conversion</th></tr></thead>
            <tbody>
              {topPagesData.map((row,i)=>(
                <tr key={i}>
                  <td><span className="mono-val">{String(i+1).padStart(2,'0')}</span></td>
                  <td style={{ fontWeight:600, fontSize:13 }}>{row.page}</td>
                  <td><span className="mono-val">{row.views.toLocaleString()}</span></td>
                  <td><span className="mono-val">{row.leads}</span></td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:6, background:'var(--bg-tertiary)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${Math.min(row.leads/row.views*1000,100).toFixed(0)}%`, background:'var(--gradient-cta)', borderRadius:3 }}/>
                      </div>
                      <span className="mono-val">{(row.leads/row.views*100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}