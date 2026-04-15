import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, FileText, MessageSquare, Image, BarChart3,
  PhoneCall, Users, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, Globe, X, Mail
} from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { path: '/dashboard',     label: 'Overview',          icon: LayoutDashboard, perm: 'dashboard' },
  { path: '/posts',         label: 'Blog Posts',        icon: FileText,        perm: 'posts' },
  { path: '/comments',      label: 'Comments',          icon: MessageSquare,   perm: 'comments' },
  { path: '/media',         label: 'Media Library',     icon: Image,           perm: 'media' },
  { path: '/analytics',     label: 'Analytics',         icon: BarChart3,       perm: 'analytics' },
  { path: '/leads',         label: 'Leads & Enquiries', icon: PhoneCall,       perm: 'leads' },
  { path: '/users',         label: 'Users & Authors',   icon: Users,           perm: 'users' },
  { path: '/subscribers',   label: 'Subscribers',       icon: Mail,            perm: 'subscribers' },
  { path: '/seo',           label: 'SEO Manager',       icon: Globe,           perm: 'seo' },
  { path: '/notifications', label: 'Notifications',     icon: Bell,            perm: 'notifications' },
  { path: '/settings',      label: 'Settings',          icon: Settings,        perm: 'settings' },
]

const ROLE_COLORS = {
  superadmin: { bg: 'linear-gradient(135deg,#E63946,#8B2F97)', text: 'Super Admin' },
  admin:      { bg: 'linear-gradient(135deg,#2E5EAA,#8B2F97)', text: 'Admin' },
  editor:     { bg: 'linear-gradient(135deg,#FF6B35,#E63946)', text: 'Editor' },
}

export default function Sidebar({ collapsed, setCollapsed, isMobile = false, mobileOpen = false, onNavigate }) {
  const { user, logout, hasPermission } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
    onNavigate?.()
  }

  const handleNavItemClick = () => {
    if (isMobile) onNavigate?.()
  }

  const roleInfo = ROLE_COLORS[user?.role] || ROLE_COLORS.editor
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'ZA'

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile && mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        {collapsed ? (
          <div className="logo-mark">Z</div>
        ) : (
          <div className="logo-text">
            <img src="/bgr_logo.png" alt="ZMS LIZZA" className="sidebar-logo-image" />
            <span className="logo-sub">Admin Panel</span>
          </div>
        )}
        {isMobile ? (
          <button type="button" className="sidebar-close-btn" onClick={onNavigate} aria-label="Close sidebar">
            <X size={14} />
          </button>
        ) : (
          <button className="sidebar-collapse-btn" onClick={() => setCollapsed(v => !v)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="avatar" style={{ background: roleInfo.bg }}>{initials}</div>
        {!collapsed && (
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-role" style={{ background: roleInfo.bg }}>{roleInfo.text}</span>
          </div>
        )}
      </div>
      <div className="sidebar-divider" />

      {/* Nav */}
      <nav className="sidebar-nav">
        {!collapsed && <span className="nav-section-label">Navigation</span>}
        {NAV_ITEMS.map(item => {
          if (!hasPermission(item.perm)) return null
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              data-tooltip={collapsed ? item.label : undefined}
              onClick={handleNavItemClick}
            >
              <Icon size={18} className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
