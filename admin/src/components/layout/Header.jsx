import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { Sun, Moon, Bell, Search, Menu, ChevronDown, Settings, LogOut, RefreshCw } from 'lucide-react'
import { notificationsService } from '../../services/notificationsService'
import './Header.css'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Welcome back' },
  '/posts': { title: 'Blog Posts', sub: 'Manage your content' },
  '/comments': { title: 'Comments', sub: 'Moderate discussions' },
  '/media': { title: 'Media Library', sub: 'Manage files and assets' },
  '/analytics': { title: 'Analytics', sub: 'Performance insights' },
  '/leads': { title: 'Leads and Enquiries', sub: 'Track potential customers' },
  '/users': { title: 'Users and Authors', sub: 'Manage team members' },
  '/seo': { title: 'SEO Manager', sub: 'Optimize for search engines' },
  '/notifications': { title: 'Notifications', sub: 'System alerts' },
  '/settings': { title: 'Settings', sub: 'Configure your panel' },
}

const NOTIF_EMOJIS = { lead: '🔥', comment: '💬', post: '📝', system: '⚙️', user: '👤' }

export default function Header({ setCollapsed }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifError, setNotifError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const notifRef = useRef(null)
  const userRef = useRef(null)

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'ZMS LIZZA Admin', sub: '' }
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ZA'

  const unread = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  )

  const fetchNotifications = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true)
    try {
      const response = await notificationsService.list({ limit: 8 })
      setNotifications(response?.data || [])
      setNotifError('')
    } catch (err) {
      setNotifError(err?.message || 'Failed to load notifications.')
    } finally {
      if (showSpinner) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchNotifications()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications((current) => current.map((n) => ({ ...n, read: true })))
    } catch (err) {
      setNotifError(err?.message || 'Failed to mark all as read.')
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id)
      setNotifications((current) => current.map((n) => (n._id === id ? { ...n, read: true } : n)))
    } catch (err) {
      setNotifError(err?.message || 'Failed to update notification.')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-icon btn-ghost" onClick={() => setCollapsed((v) => !v)}>
          <Menu size={18} />
        </button>
        <div className="header-page-info">
          <h1 className="header-title">{pageInfo.title}</h1>
          <span className="header-sub">{pageInfo.sub}{user?.name && `, ${user.name.split(' ')[0]}`}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={15} className="search-icon" />
          <input type="text" className="search-input" placeholder="Search..." />
        </div>

        <button className="btn btn-icon btn-ghost header-icon-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="header-dropdown-wrap" ref={notifRef}>
          <button
            className="btn btn-icon btn-ghost header-icon-btn notif-btn"
            onClick={() => {
              setShowNotifs((v) => !v)
              setShowUser(false)
            }}
          >
            <Bell size={18} />
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="header-dropdown animate-scale-in">
              <div className="dropdown-header">
                <span>Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button className="btn btn-icon btn-ghost btn-sm" onClick={() => fetchNotifications(true)} title="Refresh">
                    <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
                  </button>
                  {unread > 0 && <span className="badge badge-danger">{unread} new</span>}
                </div>
              </div>
              {notifError && (
                <div style={{ padding: 12, color: 'var(--red)', fontSize: 12 }}>
                  {notifError}
                </div>
              )}
              <div className="notif-list">
                {notifications.length === 0 && !notifError && (
                  <div style={{ padding: 16, color: 'var(--text-muted)', textAlign: 'center' }}>No notifications</div>
                )}
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    className={`notif-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification._id)}
                    style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <div className="notif-icon">{NOTIF_EMOJIS[notification.type] || '📢'}</div>
                    <div className="notif-content">
                      <p>{notification.message}</p>
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    {!notification.read && <div className="notif-dot" />}
                  </button>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="btn btn-ghost btn-sm" onClick={markAllAsRead}>Mark all as read</button>
                <Link to="/notifications" className="btn btn-ghost btn-sm">Open page</Link>
              </div>
            </div>
          )}
        </div>

        <div className="header-dropdown-wrap" ref={userRef}>
          <button
            className="header-user-btn"
            onClick={() => {
              setShowUser((v) => !v)
              setShowNotifs(false)
            }}
          >
            <div className="avatar avatar-sm">{initials}</div>
            <span className="header-user-name">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} />
          </button>
          {showUser && (
            <div className="header-dropdown user-dropdown animate-scale-in">
              <div className="user-dropdown-info">
                <div className="avatar">{initials}</div>
                <div>
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <Link to="/settings" className="dropdown-item"><Settings size={15} /> Settings</Link>
              <button className="dropdown-item danger" onClick={handleLogout}><LogOut size={15} /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
