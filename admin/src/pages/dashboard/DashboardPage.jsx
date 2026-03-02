import React from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import { revenueData, trafficSourceData, postsData, leadsData, notificationsData } from '../../data/mockData'
import { FileText, PhoneCall, Users, Eye, TrendingUp, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import './DashboardPage.css'

const STAT_CARDS = [
  { label: 'Total Posts',   value: 148,   change: 12, icon: FileText,  gradient: 'linear-gradient(135deg,#E63946,#8B2F97)' },
  { label: 'Active Leads',  value: 392,   change: 28, icon: PhoneCall, gradient: 'linear-gradient(135deg,#FF6B35,#E63946)' },
  { label: 'Team Members',  value: 24,    change: 3,  icon: Users,     gradient: 'linear-gradient(135deg,#2E5EAA,#8B2F97)' },
  { label: 'Monthly Views', value: 58400, change: 18, icon: Eye,       gradient: 'linear-gradient(135deg,#8B2F97,#2E5EAA)' },
]

const PIE_COLORS = ['#E63946','#8B2F97','#2E5EAA','#FF6B35','#10B981']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color: p.color, fontSize:12, marginTop:2 }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></p>
      ))}
    </div>
  )
}

const STATUS_ICONS = {
  published: <CheckCircle size={14} style={{ color:'#10B981', flexShrink:0 }} />,
  draft:     <Clock size={14}        style={{ color:'#FF6B35', flexShrink:0 }} />,
  scheduled: <AlertCircle size={14}  style={{ color:'#2E5EAA', flexShrink:0 }} />,
}
const LEAD_STATUS = { hot: 'badge-danger', warm: 'badge-warning', cold: 'badge-info' }

export default function DashboardPage() {
  const recentPosts  = postsData.slice(0,4)
  const recentLeads  = leadsData.slice(0,4)
  const recentNotifs = notificationsData.slice(0,4)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard <span className="gradient-text">Overview</span></h1>
          <p className="page-subtitle">ZMS LIZZA — Real-time performance snapshot</p>
        </div>
        <button className="btn btn-primary"><TrendingUp size={15} /> View Full Report</button>
      </div>

      <div className="stats-grid stagger-children">
        {STAT_CARDS.map((card,i) => <StatCard key={i} {...card} />)}
      </div>

      <div className="dashboard-charts-row">
        <div className="card chart-card chart-main">
          <div className="chart-card-header">
            <div><h3>Leads & Traffic</h3><p>Monthly performance overview</p></div>
            <select className="chart-select"><option>Last 9 months</option></select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top:10,right:10,left:-20,bottom:0 }}>
              <defs>
                <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E63946" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E63946" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2E5EAA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2E5EAA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:'var(--text-muted)' }} />
              <YAxis tick={{ fontSize:12, fill:'var(--text-muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:12 }} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#E63946" fill="url(#gradLeads)" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="views" name="Views" stroke="#2E5EAA" fill="url(#gradViews)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card chart-pie">
          <div className="chart-card-header">
            <div><h3>Traffic Sources</h3><p>Where visitors come from</p></div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={trafficSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {trafficSourceData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {trafficSourceData.map((item,i) => (
              <div key={i} className="pie-legend-item">
                <span className="pie-dot" style={{ background: PIE_COLORS[i] }} />
                <span className="pie-name">{item.name}</span>
                <span className="pie-val">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-row">
        <div className="card dashboard-list-card">
          <div className="list-card-header">
            <h3>Recent Posts</h3>
            <a href="/posts" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></a>
          </div>
          <div className="post-list">
            {recentPosts.map(post => (
              <div key={post.id} className="post-list-item">
                <div className="post-cat-dot" />
                <div className="post-info">
                  <span className="post-title-sm">{post.title}</span>
                  <span className="post-meta">{post.author} · {post.date}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                  {STATUS_ICONS[post.status]}
                  <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'JetBrains Mono, monospace' }}>{post.views.toLocaleString()}v</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card dashboard-list-card">
          <div className="list-card-header">
            <h3>Hot Leads</h3>
            <a href="/leads" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></a>
          </div>
          <div className="post-list">
            {recentLeads.map(lead => (
              <div key={lead.id} className="post-list-item">
                <div className="avatar avatar-sm">{lead.name[0]}</div>
                <div className="post-info">
                  <span className="post-title-sm">{lead.name}</span>
                  <span className="post-meta">{lead.city} · {lead.machines}</span>
                </div>
                <span className={`badge ${LEAD_STATUS[lead.status]}`}>{lead.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card dashboard-list-card">
          <div className="list-card-header">
            <h3>Notifications</h3>
            <a href="/notifications" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></a>
          </div>
          <div className="post-list">
            {recentNotifs.map(n => (
              <div key={n.id} className="post-list-item" style={{ background: !n.read ? 'rgba(230,57,70,0.02)' : 'transparent' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'var(--bg-tertiary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                  {n.type==='lead'?'🔥':n.type==='comment'?'💬':n.type==='post'?'📝':'⚙️'}
                </div>
                <div className="post-info">
                  <span className="post-title-sm">{n.message}</span>
                  <span className="post-meta">{n.time}</span>
                </div>
                {!n.read && <div className="status-dot online" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}