import React, { useEffect, useMemo, useState } from 'react'
import { Phone, Search, MessageCircle, MapPin, Cpu, Plus, Save, X, Eye, Mail, Building2, AlertCircle } from 'lucide-react'
import { leadsService } from '../../services/leadsService'
import StateBlock from '../../components/ui/StateBlock'

const STATUS_CFG = {
  hot: { cls: 'badge-danger', emoji: '🔥' },
  warm: { cls: 'badge-warning', emoji: '☀️' },
  cold: { cls: 'badge-info', emoji: '❄️' },
  converted: { cls: 'badge-success', emoji: '✅' },
  lost: { cls: 'badge-neutral', emoji: '⛔' },
}

const SOURCE_CFG = {
  WhatsApp: { cls: 'badge-success', icon: '💬' },
  Website: { cls: 'badge-info', icon: '🌐' },
  Call: { cls: 'badge-purple', icon: '📞' },
  Referral: { cls: 'badge-warning', icon: '🤝' },
  Exhibition: { cls: 'badge-neutral', icon: '🏢' },
  'Social Media': { cls: 'badge-info', icon: '📣' },
  Other: { cls: 'badge-neutral', icon: '🧩' },
}

const SOURCE_OPTIONS = ['WhatsApp', 'Website', 'Call', 'Referral', 'Exhibition', 'Social Media', 'Other']
const STATUS_OPTIONS = ['hot', 'warm', 'cold', 'converted', 'lost']

const initialLeadForm = {
  name: '',
  contact: '',
  city: '',
  source: 'Website',
  status: 'warm',
  machines: '',
  notes: '',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(initialLeadForm)

  const fetchLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const [leadsResponse, statsResponse] = await Promise.all([
        leadsService.list({
          limit: 50,
          status: filter === 'all' ? undefined : filter,
          search: search || undefined,
        }),
        leadsService.getStats(),
      ])
      setLeads(leadsResponse?.data || [])
      setStats(statsResponse?.data || null)
    } catch (err) {
      setError(err?.message || 'Failed to load leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchLeads(), 250)
    return () => clearTimeout(timer)
  }, [filter, search])

  const counts = useMemo(() => ({
    all: stats?.byStatus?.reduce((sum, row) => sum + row.count, 0) ?? leads.length,
    hot: stats?.byStatus?.find((row) => row._id === 'hot')?.count ?? leads.filter((lead) => lead.status === 'hot').length,
    warm: stats?.byStatus?.find((row) => row._id === 'warm')?.count ?? leads.filter((lead) => lead.status === 'warm').length,
    cold: stats?.byStatus?.find((row) => row._id === 'cold')?.count ?? leads.filter((lead) => lead.status === 'cold').length,
  }), [leads, stats])

  const setLeadStatus = async (leadId, status) => {
    try {
      await leadsService.update(leadId, { status })
      setLeads((current) => current.map((lead) => (lead._id === leadId ? { ...lead, status } : lead)))
    } catch (err) {
      setError(err?.message || 'Failed to update lead status.')
    }
  }

  const submitLead = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await leadsService.create(form)
      setShowForm(false)
      setForm(initialLeadForm)
      await fetchLeads()
    } catch (err) {
      setError(err?.message || 'Failed to create lead.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads and <span className="gradient-text">Enquiries</span></h1>
          <p className="page-subtitle">{counts.hot} hot leads need attention</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={15} /> Add Lead</button>
      </div>

      <div className="stats-grid stagger-children" style={{ marginBottom: 20 }}>
        {[
          ['Total Leads', counts.all, '📊'],
          ['Hot Leads', counts.hot, '🔥'],
          ['Warm Leads', counts.warm, '☀️'],
          ['Cold Leads', counts.cold, '❄️'],
        ].map((item, index) => (
          <div key={index} className="card animate-fade-in" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item[2]}</div>
            <div>
              <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{item[1]}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item[0]}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card posts-toolbar" style={{ marginBottom: 20 }}>
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar-input" />
        </div>
        <div className="toolbar-filters">
          {['all', 'hot', 'warm', 'cold'].map((status) => (
            <button key={status} className={`filter-tab ${filter === status ? 'active' : ''}`} onClick={() => setFilter(status)}>
              {STATUS_CFG[status]?.emoji || ''} {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={fetchLeads} />

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }} className="stagger-children">
          {leads.map((lead) => (
            <div key={lead._id} className="card animate-fade-in" style={{ padding: 20, borderLeft: lead.status === 'hot' ? '3px solid var(--red)' : '3px solid transparent' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ position: 'relative' }}>
                  <div className="avatar">{lead.name?.[0] || 'L'}</div>
                  {lead.status === 'hot' && <div style={{ position: 'absolute', bottom: -4, right: -4, fontSize: 12 }}>🔥</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{lead.name}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}><MapPin size={11} />{lead.city || 'Unknown'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}><Cpu size={11} />{lead.machines || 'N/A'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span className={`badge ${STATUS_CFG[lead.status]?.cls || 'badge-neutral'}`}>{STATUS_CFG[lead.status]?.emoji || ''} {lead.status}</span>
                  <span className={`badge ${SOURCE_CFG[lead.source]?.cls || 'badge-neutral'}`}>{SOURCE_CFG[lead.source]?.icon || '·'} {lead.source}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginBottom: 12, fontSize: 13, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                <span>{lead.contact}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={`tel:${lead.contact}`} className="btn btn-sm btn-ghost"><Phone size={13} /> Call</a>
                <a href={`https://wa.me/${lead.contact?.replace(/[^\d]/g, '') || ''}`} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)' }}>
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSelectedLead(lead)}>
                  <Eye size={13} /> Details
                </button>
                <select className="filter-tab" style={{ marginLeft: 'auto', borderRadius: 'var(--radius-sm)', padding: '5px 10px' }} value={lead.status} onChange={(e) => setLeadStatus(lead._id, e.target.value)}>
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          ))}
          {leads.length === 0 && <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>No leads found.</div>}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, padding: 20 }}>
            <form onSubmit={submitLead} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 20 }}>Create Lead</h3>
                <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={14} /></button>
              </div>
              <input className="input" placeholder="Lead name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} required />
              <input className="input" placeholder="Contact number" value={form.contact} onChange={(e) => setForm((current) => ({ ...current, contact: e.target.value }))} required />
              <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm((current) => ({ ...current, city: e.target.value }))} />
              <input className="input" placeholder="Machines (example: 10 heads)" value={form.machines} onChange={(e) => setForm((current) => ({ ...current, machines: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select className="input" value={form.source} onChange={(e) => setForm((current) => ({ ...current, source: e.target.value }))}>
                  {SOURCE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select className="input" value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}>
                  {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <textarea className="input" rows={4} placeholder="Notes" value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}><Save size={14} /> {saving ? 'Saving...' : 'Save Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflow: 'auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 20 }}>Lead Details</h3>
              <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => setSelectedLead(null)}><X size={14} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>Lead Name</div>
                <div style={{ fontWeight: 700 }}>{selectedLead.name || 'Unknown'}</div>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>Contact</div>
                <div style={{ fontWeight: 700 }}>{selectedLead.contact || 'N/A'}</div>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>Email</div>
                <div style={{ fontWeight: 600, wordBreak: 'break-word' }}>{selectedLead.email || 'Not provided'}</div>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>Business</div>
                <div style={{ fontWeight: 600 }}>{selectedLead.businessName || 'Not provided'}</div>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>Location</div>
                <div style={{ fontWeight: 600 }}>{selectedLead.city || 'Unknown'}{selectedLead.state ? `, ${selectedLead.state}` : ''}</div>
              </div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>Interest</div>
                <div style={{ fontWeight: 600 }}>{selectedLead.machines || 'Not specified'}</div>
              </div>
            </div>

            <div className="card" style={{ padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                <AlertCircle size={13} /> Enquiry / Problem
              </div>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                {selectedLead.message || selectedLead.notes || 'No enquiry message provided by customer.'}
              </div>
            </div>

            {selectedLead.notes && selectedLead.message && (
              <div className="card" style={{ padding: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Internal Notes</div>
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                  {selectedLead.notes}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Source: <strong style={{ color: 'var(--text-primary)' }}>{selectedLead.source || 'N/A'}</strong> |
                Status: <strong style={{ color: 'var(--text-primary)' }}> {selectedLead.status || 'N/A'}</strong> |
                Created: <strong style={{ color: 'var(--text-primary)' }}> {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : 'N/A'}</strong>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedLead.email && (
                  <a className="btn btn-sm btn-ghost" href={`mailto:${selectedLead.email}`}>
                    <Mail size={13} /> Email
                  </a>
                )}
                {selectedLead.businessName && (
                  <span className="btn btn-sm btn-ghost" style={{ cursor: 'default' }}>
                    <Building2 size={13} /> {selectedLead.businessName}
                  </span>
                )}
                <a className="btn btn-sm btn-ghost" href={`tel:${selectedLead.contact}`}>
                  <Phone size={13} /> Call
                </a>
                <a className="btn btn-sm" style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)' }} href={`https://wa.me/${selectedLead.contact?.replace(/[^\d]/g, '') || ''}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
