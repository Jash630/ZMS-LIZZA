import React, { useEffect, useMemo, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Eye, Users, MousePointer } from 'lucide-react'
import { analyticsService } from '../../services/analyticsService'
import StateBlock from '../../components/ui/StateBlock'

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

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [dashboardRes, overviewRes] = await Promise.all([
        analyticsService.dashboard(),
        analyticsService.overview(9),
      ])
      setDashboard(dashboardRes?.data || null)
      setOverview(overviewRes?.data || null)
    } catch (err) {
      setError(err?.message || 'Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const monthlyData = dashboard?.monthlyData || []

  const kpis = useMemo(() => {
    const totalViews = monthlyData.reduce((sum, item) => sum + (item.views || 0), 0)
    const totalLeads = monthlyData.reduce((sum, item) => sum + (item.leads || 0), 0)
    const postsCount = overview?.topPosts?.length || 0
    const conversionRate = totalViews ? ((totalLeads / totalViews) * 100).toFixed(2) : '0.00'
    return [
      { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'linear-gradient(135deg,#2E5EAA,#8B2F97)' },
      { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: Users, color: 'linear-gradient(135deg,#E63946,#8B2F97)' },
      { label: 'Top Posts', value: String(postsCount), icon: MousePointer, color: 'linear-gradient(135deg,#FF6B35,#E63946)' },
      { label: 'Lead Conversion', value: `${conversionRate}%`, icon: TrendingUp, color: 'linear-gradient(135deg,#10B981,#2E5EAA)' },
    ]
  }, [monthlyData, overview])

  const topRows = useMemo(() => {
    const topPosts = overview?.topPosts || []
    const totalLeads = monthlyData.reduce((sum, item) => sum + (item.leads || 0), 0)
    const divider = topPosts.length || 1
    return topPosts.map((post, index) => {
      const estimatedLeads = Math.max(1, Math.round(totalLeads / divider) - index)
      const conversion = post.views ? ((estimatedLeads / post.views) * 100).toFixed(1) : '0.0'
      return {
        page: post.title,
        views: post.views || 0,
        leads: estimatedLeads,
        conversion,
      }
    })
  }, [overview, monthlyData])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics <span className="gradient-text">Insights</span></h1>
          <p className="page-subtitle">Website performance and visitor behavior</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={loadData}><TrendingUp size={14} /> Refresh</button>
      </div>

      <StateBlock loading={loading} error={error} onRetry={loadData} />

      {!loading && !error && (
        <>
          <div className="stats-grid stagger-children">
            {kpis.map((kpi, index) => (
              <div key={index} className="card animate-fade-in" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <kpi.icon size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{kpi.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{kpi.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card chart-card">
              <div className="chart-card-header"><div><h3>Traffic Over Time</h3><p>Monthly views</p></div></div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gV2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E5EAA" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2E5EAA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" name="Views" stroke="#2E5EAA" fill="url(#gV2)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card chart-card">
              <div className="chart-card-header"><div><h3>Lead Conversions</h3><p>Monthly lead generation</p></div></div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="leads" name="Leads" fill="#E63946" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700 }}>Top Performing Pages</h3>
            </div>
            <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
              <table>
                <thead><tr><th>#</th><th>Page</th><th>Views</th><th>Leads</th><th>Conversion</th></tr></thead>
                <tbody>
                  {topRows.map((row, index) => (
                    <tr key={row.page}>
                      <td><span className="mono-val">{String(index + 1).padStart(2, '0')}</span></td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{row.page}</td>
                      <td><span className="mono-val">{row.views.toLocaleString()}</span></td>
                      <td><span className="mono-val">{row.leads}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(Number(row.conversion), 100).toFixed(0)}%`, background: 'var(--gradient-cta)', borderRadius: 3 }} />
                          </div>
                          <span className="mono-val">{row.conversion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {topRows.length === 0 && <tr><td colSpan={5} className="table-empty">No analytics rows found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
