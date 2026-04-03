import React, { useEffect, useState } from 'react'
import { Globe, Bell, Shield, Palette, Save, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { settingsService } from '../../services/settingsService'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { setStoredToken, setStoredUser } from '../../lib/storage'
import StateBlock from '../../components/ui/StateBlock'

const TABS = ['general', 'appearance', 'notifications', 'security']
const TAB_ICONS = { general: Globe, appearance: Palette, notifications: Bell, security: Shield }

const defaultGeneral = {
  siteName: 'ZMS LIZZA',
  tagline: 'European Technology - Embroidery Machine Manufacturer',
  siteUrl: 'https://zmslizza.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'info@zmslizza.com',
  address: 'Mumbai, Maharashtra, India',
}

const defaultAppearance = { defaultTheme: 'light', brandAccent: '#E63946' }
const defaultNotifications = {
  newLeadEnquiries: true,
  commentModeration: true,
  postPublished: true,
  systemUpdates: true,
  weeklyPerformanceReport: true,
}

const initialPasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { setUser, setToken } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [general, setGeneral] = useState(defaultGeneral)
  const [appearance, setAppearance] = useState(defaultAppearance)
  const [notifications, setNotifications] = useState(defaultNotifications)
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)

  const loadSettings = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await settingsService.get()
      const data = response?.data || {}
      const nextGeneral = data.general || defaultGeneral
      const nextAppearance = data.appearance || defaultAppearance
      const nextNotifications = data.notifications || defaultNotifications
      setGeneral(nextGeneral)
      setAppearance(nextAppearance)
      setNotifications(nextNotifications)
    } catch (err) {
      setError(err?.message || 'Failed to load settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const showSaved = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(''), 1800)
  }

  const saveGeneral = async () => {
    try {
      await settingsService.updateGeneral(general)
      showSaved('General settings saved')
    } catch (err) {
      setError(err?.message || 'Failed to save general settings.')
    }
  }

  const saveAppearance = async () => {
    try {
      await settingsService.updateAppearance(appearance)
      showSaved('Appearance settings saved')
    } catch (err) {
      setError(err?.message || 'Failed to save appearance settings.')
    }
  }

  const toggleThemePreference = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setAppearance((current) => ({ ...current, defaultTheme: nextTheme }))
  }

  const saveNotifications = async () => {
    try {
      await settingsService.updateNotifications(notifications)
      showSaved('Notification settings saved')
    } catch (err) {
      setError(err?.message || 'Failed to save notification settings.')
    }
  }

  const submitPassword = async () => {
    setError('')
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError('Please fill current and new password.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }
    try {
      const response = await authService.updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
      const token = response?.token
      const user = response?.data
      if (token) {
        setStoredToken(token)
        setToken(token)
      }
      if (user) {
        setStoredUser(user)
        setUser(user)
      }
      setPasswordForm(initialPasswordForm)
      showSaved('Password updated successfully')
    } catch (err) {
      setError(err?.message || 'Failed to update password.')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings and <span className="gradient-text">Configuration</span></h1>
          <p className="page-subtitle">Manage your admin panel preferences</p>
        </div>
        <button className="btn btn-primary" onClick={loadSettings}>
          <Save size={15} /> Reload
        </button>
      </div>

      {success && (
        <div className="card" style={{ padding: 12, marginBottom: 14, color: '#10B981' }}>
          {success}
        </div>
      )}

      <StateBlock loading={loading} error={error} onRetry={loadSettings} />

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 12, height: 'fit-content' }}>
            {TABS.map((tab) => {
              const Icon = TAB_ICONS[tab]
              return (
                <button key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ width: '100%', marginBottom: 2, textTransform: 'capitalize' }}>
                  <Icon size={16} /> {tab}
                </button>
              )
            })}
          </div>

          <div className="card" style={{ padding: 28 }}>
            {activeTab === 'general' && (
              <div style={{ display: 'grid', gap: 18 }}>
                <h3 style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800 }}>General Settings</h3>
                {Object.entries(general).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input className="input" value={value} onChange={(e) => setGeneral((current) => ({ ...current, [key]: e.target.value }))} />
                  </div>
                ))}
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={saveGeneral}>Save General</button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div style={{ display: 'grid', gap: 18 }}>
                <h3 style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800 }}>Appearance</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>Color Theme</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Switch between light and dark mode</p>
                  </div>
                  <button className="btn btn-ghost" onClick={toggleThemePreference}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</button>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Brand Accent Color</label>
                  <input className="input" value={appearance.brandAccent} onChange={(e) => setAppearance((current) => ({ ...current, brandAccent: e.target.value }))} />
                </div>
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={saveAppearance}>Save Appearance</button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{ display: 'grid', gap: 14 }}>
                <h3 style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800 }}>Notification Preferences</h3>
                {[
                  ['newLeadEnquiries', 'New lead enquiries'],
                  ['commentModeration', 'Comment moderation'],
                  ['postPublished', 'Post published'],
                  ['systemUpdates', 'System updates'],
                  ['weeklyPerformanceReport', 'Weekly performance report'],
                ].map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
                    <input type="checkbox" checked={Boolean(notifications[key])} onChange={(e) => setNotifications((current) => ({ ...current, [key]: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--red)', cursor: 'pointer' }} />
                  </div>
                ))}
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={saveNotifications}>Save Notifications</button>
              </div>
            )}

            {activeTab === 'security' && (
              <div style={{ display: 'grid', gap: 18 }}>
                <h3 style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800 }}>Security Settings</h3>
                {[
                  ['currentPassword', 'Current Password'],
                  ['newPassword', 'New Password'],
                  ['confirmPassword', 'Confirm Password'],
                ].map(([key, label], index) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input className="input" type={showPass && index === 0 ? 'text' : 'password'} placeholder="••••••••" value={passwordForm[key]} onChange={(e) => setPasswordForm((current) => ({ ...current, [key]: e.target.value }))} style={{ paddingRight: index === 0 ? 44 : 14 }} />
                      {index === 0 && (
                        <button style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPass((value) => !value)} type="button">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={submitPassword}><Shield size={14} /> Update Password</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
