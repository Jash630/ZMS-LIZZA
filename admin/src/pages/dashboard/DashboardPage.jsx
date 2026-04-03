import React, { useEffect, useMemo, useState } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FileText, PhoneCall, Users, Eye, TrendingUp, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import StateBlock from '../../components/ui/StateBlock'
import { dashboardService } from '../../services/dashboardService'
import { notificationsService } from '../../services/notificationsService'
import './DashboardPage.css'

const PIE_COLORS = ['#E63946', '#8B2F97', '#2E5EAA', '#FF6B35', '#10B981', '#0EA5E9']

const STATUS_ICONS = {
  published: <CheckCircle size={14} style={{ color: '#10B981', flexShrink: 0 }} />,
  draft: <Clock size={14} style={{ color: '#FF6B35', flexShrink: 0 }} />,
  scheduled: <AlertCircle size={14} style={{ color: '#2E5EAA', flexShrink: 0 }} />,
}

const LEAD_STATUS = { hot: 'badge-danger', warm: 'badge-warning', cold: 'badge-info', converted: 'badge-success', lost: 'badge-neutral' }
const NOTIF_ICON = { lead: '🔥', comment: '💬', post: '📝', system: '⚙️', user: '👤' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color, fontSize: 12, marginTop: 2 }}>
          {entry.name}: <strong>{entry.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [overview, setOverview] = useState(null)
  const [notifications, setNotifications] = useState([])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [dashboardRes, overviewRes, notificationsRes] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getOverview(9),
        notificationsService.list({ limit: 4 }),
      ])
      setDashboard(dashboardRes?.data || null)
      setOverview(overviewRes?.data || null)
      setNotifications(notificationsRes?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = dashboard?.stats || {}
  const monthlyData = dashboard?.monthlyData || []
  const recentPosts = dashboard?.recentPosts || []
  const recentLeads = dashboard?.recentLeads || []

  const trafficSourceData = useMemo(() => {
    const rows = overview?.leadsBySource || []
    const total = rows.reduce((sum, item) => sum + (item.count || 0), 0) || 1
    return rows.map((item) => ({
      name: item._id || 'Unknown',
      value: Math.round((item.count / total) * 100),
      count: item.count,
    }))
  }, [overview])

  const statCards = [
    { label: 'Total Posts', value: stats.totalPosts || 0, change: 0, icon: FileText, gradient: 'linear-gradient(135deg,#E63946,#8B2F97)' },
    { label: 'Active Leads', value: stats.totalLeads || 0, change: 0, icon: PhoneCall, gradient: 'linear-gradient(135deg,#FF6B35,#E63946)' },
    { label: 'Team Members', value: stats.totalUsers || 0, change: 0, icon: Users, gradient: 'linear-gradient(135deg,#2E5EAA,#8B2F97)' },
    {
      label: 'Monthly Views',
      value: monthlyData.reduce((sum, item) => sum + (item.views || 0), 0),
      change: 0,
      icon: Eye,
      gradient: 'linear-gradient(135deg,#8B2F97,#2E5EAA)',
    },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard <span className="gradient-text">Overview</span></h1>
          <p className="page-subtitle">ZMS LIZZA - Real-time performance snapshot</p>
        </div>
        <button className="btn btn-primary" onClick={loadData}><TrendingUp size={15} /> Refresh</button>
      </div>

      <StateBlock loading={loading} error={error} onRetry={loadData} />

      {!loading && !error && (
        <>
          <div className="stats-grid stagger-children">
            {statCards.map((card, index) => <StatCard key={index} {...card} />)}
          </div>

          <div className="dashboard-charts-row">
            <div className="card chart-card chart-main">
              <div className="chart-card-header">
                <div><h3>Leads and Traffic</h3><p>Monthly performance overview</p></div>
                <select className="chart-select" disabled><option>Last 9 months</option></select>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E5EAA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2E5EAA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="leads" name="Leads" stroke="#E63946" fill="url(#gradLeads)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="views" name="Views" stroke="#2E5EAA" fill="url(#gradViews)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card chart-card chart-pie">
              <div className="chart-card-header">
                <div><h3>Traffic Sources</h3><p>Leads grouped by source</p></div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={trafficSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {trafficSourceData.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value, _, entry) => [`${value}% (${entry.payload.count})`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {trafficSourceData.map((item, index) => (
                  <div key={item.name} className="pie-legend-item">
                    <span className="pie-dot" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
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
                {recentPosts.map((post) => (
                  <div key={post._id} className="post-list-item">
                    <div className="post-cat-dot" />
                    <div className="post-info">
                      <span className="post-title-sm">{post.title}</span>
                      <span className="post-meta">{post.author?.name || 'Unknown'} · {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                      {STATUS_ICONS[post.status] || STATUS_ICONS.draft}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{(post.views || 0).toLocaleString()}v</span>
                    </div>
                  </div>
                ))}
                {recentPosts.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No recent posts</div>}
              </div>
            </div>

            <div className="card dashboard-list-card">
              <div className="list-card-header">
                <h3>Recent Leads</h3>
                <a href="/leads" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></a>
              </div>
              <div className="post-list">
                {recentLeads.map((lead) => (
                  <div key={lead._id} className="post-list-item">
                    <div className="avatar avatar-sm">{lead.name?.[0] || 'L'}</div>
                    <div className="post-info">
                      <span className="post-title-sm">{lead.name}</span>
                      <span className="post-meta">{lead.city || 'Unknown'} · {lead.machines || 'N/A'}</span>
                    </div>
                    <span className={`badge ${LEAD_STATUS[lead.status] || 'badge-neutral'}`}>{lead.status}</span>
                  </div>
                ))}
                {recentLeads.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No recent leads</div>}
              </div>
            </div>

            <div className="card dashboard-list-card">
              <div className="list-card-header">
                <h3>Notifications</h3>
                <a href="/notifications" className="btn btn-ghost btn-sm">View all <ArrowRight size={13} /></a>
              </div>
              <div className="post-list">
                {notifications.map((notification) => (
                  <div key={notification._id} className="post-list-item" style={{ background: !notification.read ? 'rgba(230,57,70,0.02)' : 'transparent' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {NOTIF_ICON[notification.type] || '📢'}
                    </div>
                    <div className="post-info">
                      <span className="post-title-sm">{notification.message}</span>
                      <span className="post-meta">{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    {!notification.read && <div className="status-dot online" />}
                  </div>
                ))}
                {notifications.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No notifications</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
