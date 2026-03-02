import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { Sun, Moon, Bell, Search, Menu, ChevronDown, Settings, LogOut } from 'lucide-react'
import { notificationsData } from '../../data/mockData'
import './Header.css'

const PAGE_TITLES = {
  '/dashboard':     { title: 'Dashboard',           sub: 'Welcome back' },
  '/posts':         { title: 'Blog Posts',           sub: 'Manage your content' },
  '/comments':      { title: 'Comments',             sub: 'Moderate discussions' },
  '/media':         { title: 'Media Library',        sub: 'Manage files & assets' },
  '/analytics':     { title: 'Analytics',            sub: 'Performance insights' },
  '/leads':         { title: 'Leads & Enquiries',    sub: 'Track potential customers' },
  '/users':         { title: 'Users & Authors',      sub: 'Manage team members' },
  '/seo':           { title: 'SEO Manager',          sub: 'Optimize for search engines' },
  '/notifications': { title: 'Notifications',        sub: 'System alerts' },
  '/settings':      { title: 'Settings',             sub: 'Configure your panel' },
}

const NOTIF_EMOJIS = { lead: '🔥', comment: '💬', post: '📝', system: '⚙️' }

export default function Header({ collapsed, setCollapsed }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout }       = useAuth()
  const location               = useLocation()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser,   setShowUser]   = useState(false)
  const notifRef = useRef(null)
  const userRef  = useRef(null)

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'ZMS LIZZA Admin', sub: '' }
  const unread   = notificationsData.filter(n => !n.read).length
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'ZA'

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
      if (userRef.current  && !userRef.current.contains(e.target))  setShowUser(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-icon btn-ghost" onClick={() => setCollapsed(v => !v)}>
          <Menu size={18} />
        </button>
        <div className="header-page-info">
          <h1 className="header-title">{pageInfo.title}</h1>
          <span className="header-sub">{pageInfo.sub}{user?.name && `, ${user.name.split(' ')[0]}`}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <Search size={15} className="search-icon" />
          <input type="text" className="search-input" placeholder="Search anything..." />
          <kbd className="search-kbd">⌘K</kbd>
        </div>

        {/* Theme */}
        <button className="btn btn-icon btn-ghost header-icon-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="header-dropdown-wrap" ref={notifRef}>
          <button className="btn btn-icon btn-ghost header-icon-btn notif-btn"
            onClick={() => { setShowNotifs(v => !v); setShowUser(false) }}>
            <Bell size={18} />
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="header-dropdown animate-scale-in">
              <div className="dropdown-header">
                <span>Notifications</span>
                {unread > 0 && <span className="badge badge-danger">{unread} new</span>}
              </div>
              <div className="notif-list">
                {notificationsData.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                    <div className="notif-icon">{NOTIF_EMOJIS[n.type] || '📢'}</div>
                    <div className="notif-content">
                      <p>{n.message}</p>
                      <span>{n.time}</span>
                    </div>
                    {!n.read && <div className="notif-dot" />}
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="btn btn-ghost btn-sm">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="header-dropdown-wrap" ref={userRef}>
          <button className="header-user-btn"
            onClick={() => { setShowUser(v => !v); setShowNotifs(false) }}>
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
              <div style={{ height:1, background:'var(--border)', margin:'4px 0' }} />
              <button className="dropdown-item"><Settings size={15} /> Settings</button>
              <button className="dropdown-item danger" onClick={logout}><LogOut size={15} /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}