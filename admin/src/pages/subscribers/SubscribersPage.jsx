import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Mail, Search, Send, Trash2, UserMinus, Users, XCircle } from 'lucide-react'
import { subscribersService } from '../../services/subscribersService'
import StateBlock from '../../components/ui/StateBlock'

const STATUS_INFO = {
  active: { label: 'Active', className: 'badge-success' },
  unsubscribed: { label: 'Unsubscribed', className: 'badge-neutral' },
}

const EMPTY_OFFER = {
  title: '',
  description: '',
  promoCode: '',
  image: '',
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [sendingOffer, setSendingOffer] = useState(false)
  const [offerForm, setOfferForm] = useState(EMPTY_OFFER)

  const fetchSubscribers = async () => {
    setLoading(true)
    setError('')
    try {
      const [listResponse, statsResponse] = await Promise.all([
        subscribersService.list({
          limit: 300,
          search: search || undefined,
          status: filter === 'all' ? undefined : filter,
        }),
        subscribersService.getStats(),
      ])
      setSubscribers(listResponse?.data || [])
      setStats(statsResponse?.data || {})
    } catch (err) {
      setError(err?.message || 'Failed to load subscribers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchSubscribers, 250)
    return () => clearTimeout(timer)
  }, [search, filter])

  const summary = useMemo(
    () => ({
      total: stats?.total || 0,
      active: stats?.active || 0,
      unsubscribed: stats?.unsubscribed || 0,
      emailsSent: stats?.totalEmailsSent || 0,
    }),
    [stats]
  )

  const allSelected = subscribers.length > 0 && selectedIds.size === subscribers.length

  const toggleSelect = (id) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds(new Set(subscribers.map((item) => item._id)))
  }

  const updateStatus = async (id, status) => {
    try {
      await subscribersService.update(id, { status })
      setSubscribers((current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      )
    } catch (err) {
      setError(err?.message || 'Failed to update subscriber.')
    }
  }

  const removeSubscriber = async (subscriber) => {
    if (!window.confirm(`Delete subscriber ${subscriber.email}?`)) return
    try {
      await subscribersService.remove(subscriber._id)
      setSubscribers((current) => current.filter((item) => item._id !== subscriber._id))
      setSelectedIds((previous) => {
        const next = new Set(previous)
        next.delete(subscriber._id)
        return next
      })
    } catch (err) {
      setError(err?.message || 'Failed to delete subscriber.')
    }
  }

  const sendOffer = async (event) => {
    event.preventDefault()
    setSendingOffer(true)
    setError('')
    try {
      await subscribersService.sendOffer({
        ...offerForm,
        subscriberIds: selectedIds.size > 0 ? Array.from(selectedIds) : undefined,
      })
      setShowOfferModal(false)
      setOfferForm(EMPTY_OFFER)
      setSelectedIds(new Set())
      await fetchSubscribers()
    } catch (err) {
      setError(err?.message || 'Failed to send offer.')
    } finally {
      setSendingOffer(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Subscriber <span className="gradient-text">Management</span>
          </h1>
          <p className="page-subtitle">{summary.active} active subscribers</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowOfferModal(true)}>
            <Send size={15} /> {selectedIds.size > 0 ? `Send to ${selectedIds.size}` : 'Send Offer'}
          </button>
        </div>
      </div>

      <div className="stats-grid stagger-children" style={{ marginBottom: 20 }}>
        {[
          ['Total', summary.total, Users],
          ['Active', summary.active, Mail],
          ['Unsubscribed', summary.unsubscribed, UserMinus],
          ['Emails Sent', summary.emailsSent, Send],
        ].map(([label, value, Icon]) => (
          <div key={label} className="card animate-fade-in" style={{ padding: '18px 20px', display: 'flex', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
              }}
            >
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card posts-toolbar" style={{ marginBottom: 20 }}>
        <div className="toolbar-search">
          <Search size={15} />
          <input
            type="text"
            className="toolbar-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by email..."
          />
        </div>
        <div className="toolbar-filters">
          {['all', 'active', 'unsubscribed'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={fetchSubscribers} />

      {!loading && !error && (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', width: 40 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>EMAIL</th>
                <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>STATUS</th>
                <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>SOURCE</th>
                <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>EMAILS SENT</th>
                <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>SUBSCRIBED ON</th>
                <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(subscriber._id)}
                      onChange={() => toggleSelect(subscriber._id)}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{subscriber.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${STATUS_INFO[subscriber.status]?.className || 'badge-neutral'}`}>
                      {STATUS_INFO[subscriber.status]?.label || subscriber.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{subscriber.source || 'blog'}</td>
                  <td style={{ padding: '12px 16px' }}>{subscriber.emailsSent || 0}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {subscriber.status === 'active' ? (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          title="Mark as unsubscribed"
                          onClick={() => updateStatus(subscriber._id, 'unsubscribed')}
                        >
                          <XCircle size={14} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          title="Mark as active"
                          onClick={() => updateStatus(subscriber._id, 'active')}
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        title="Delete subscriber"
                        onClick={() => removeSubscriber(subscriber)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showOfferModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.36)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: 620, padding: 22 }}>
            <form onSubmit={sendOffer} style={{ display: 'grid', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 20 }}>Send Offer</h3>
              <input
                className="input"
                placeholder="Offer title"
                value={offerForm.title}
                onChange={(event) => setOfferForm((current) => ({ ...current, title: event.target.value }))}
                required
              />
              <textarea
                className="input"
                rows={4}
                placeholder="Offer description"
                value={offerForm.description}
                onChange={(event) => setOfferForm((current) => ({ ...current, description: event.target.value }))}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input
                  className="input"
                  placeholder="Promo code (optional)"
                  value={offerForm.promoCode}
                  onChange={(event) => setOfferForm((current) => ({ ...current, promoCode: event.target.value.toUpperCase() }))}
                />
                <input
                  className="input"
                  placeholder="Image URL (optional)"
                  value={offerForm.image}
                  onChange={(event) => setOfferForm((current) => ({ ...current, image: event.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowOfferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={sendingOffer}>
                  <Send size={14} /> {sendingOffer ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

