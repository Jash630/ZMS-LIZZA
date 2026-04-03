import React, { useEffect, useMemo, useState } from 'react'
import { Bell, Check, Trash2, PhoneCall, MessageSquare, FileText, Settings, User, RefreshCw } from 'lucide-react'
import { notificationsService } from '../../services/notificationsService'
import StateBlock from '../../components/ui/StateBlock'

const TYPE_CFG = {
  lead: { icon: PhoneCall, color: '#E63946', bg: 'rgba(230,57,70,0.1)', label: 'Lead' },
  comment: { icon: MessageSquare, color: '#2E5EAA', bg: 'rgba(46,94,170,0.1)', label: 'Comment' },
  post: { icon: FileText, color: '#8B2F97', bg: 'rgba(139,47,151,0.1)', label: 'Post' },
  system: { icon: Settings, color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'System' },
  user: { icon: User, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'User' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await notificationsService.list({ limit: 100 })
      setNotifications(response?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to fetch notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        notificationsService.list({ limit: 100 })
          .then((response) => setNotifications(response?.data || []))
          .catch(() => {})
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const unread = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications])

  const markRead = async (id) => {
    try {
      await notificationsService.markAsRead(id)
      setNotifications((current) => current.map((notification) => (notification._id === id ? { ...notification, read: true } : notification)))
    } catch (err) {
      setError(err?.message || 'Failed to mark notification as read.')
    }
  }

  const markAllRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
    } catch (err) {
      setError(err?.message || 'Failed to mark all notifications as read.')
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationsService.remove(id)
      setNotifications((current) => current.filter((notification) => notification._id !== id))
    } catch (err) {
      setError(err?.message || 'Failed to delete notification.')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications <span className="gradient-text">&amp; Alerts</span></h1>
          <p className="page-subtitle">{unread} unread notifications</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={loadNotifications}><RefreshCw size={14} /> Refresh</button>
          {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}><Check size={14} /> Mark all read</button>}
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={loadNotifications} />

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.length === 0 && (
            <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bell size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No notifications</p>
            </div>
          )}
          {notifications.map((notification) => {
            const cfg = TYPE_CFG[notification.type] || TYPE_CFG.system
            const Icon = cfg.icon
            return (
              <div key={notification._id} className="card animate-fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: `3px solid ${notification.read ? 'transparent' : cfg.color}`, background: notification.read ? 'var(--bg-card)' : `color-mix(in srgb,${cfg.color} 3%,var(--bg-card))` }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: notification.read ? 400 : 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{notification.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span className="badge badge-neutral" style={{ fontSize: 10 }}>{cfg.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!notification.read && <button className="btn btn-icon btn-ghost btn-sm" onClick={() => markRead(notification._id)}><Check size={14} /></button>}
                  <button className="btn btn-icon btn-danger btn-sm" onClick={() => deleteNotification(notification._id)}><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
