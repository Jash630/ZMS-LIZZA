import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../context/AuthContext'
import { Eye, EyeOff, Loader2, Shield, User, Edit3 } from 'lucide-react'
import './Login.css'

const ROLE_CARDS = import.meta.env.DEV
  ? [
      {
        role: ROLES.SUPERADMIN,
        label: 'Super Admin',
        icon: Shield,
        email: 'superadmin@zmslizza.com',
        password: 'SuperAdmin@123',
        desc: 'Full system control',
        gradient: 'linear-gradient(135deg,#E63946,#8B2F97)',
      },
      {
        role: ROLES.ADMIN,
        label: 'Admin',
        icon: User,
        email: 'admin@zmslizza.com',
        password: 'AdminUser@1234',
        desc: 'Manage content & leads',
        gradient: 'linear-gradient(135deg,#2E5EAA,#8B2F97)',
      },
      {
        role: ROLES.EDITOR,
        label: 'Editor',
        icon: Edit3,
        email: 'editor@zmslizza.com',
        password: 'EditorUser@123',
        desc: 'Create & edit content',
        gradient: 'linear-gradient(135deg,#FF6B35,#E63946)',
      },
    ]
  : []

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const fillRole = (card) => {
    setSelected(card.role)
    setEmail(card.email)
    setPassword(card.password)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
        <div className="login-grid" />
      </div>
      <div className="login-container">
        <div className="login-brand animate-fade-in">
          <img src="/bgr_logo.png" alt="ZMS LIZZA" className="login-logo-image" />
          <div>
            <p className="login-tagline">Admin Control Panel</p>
          </div>
        </div>
        <div className="login-card animate-scale-in">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>
          {ROLE_CARDS.length > 0 && (
            <div className="login-roles">
              {ROLE_CARDS.map((card) => {
                const Icon = card.icon
                return (
                  <button
                    key={card.role}
                    type="button"
                    className={`role-card ${selected === card.role ? 'active' : ''}`}
                    style={{ '--role-color': card.gradient.match(/#\w+/)?.[0], '--role-grad': card.gradient }}
                    onClick={() => fillRole(card)}
                  >
                    <div className="role-icon"><Icon size={16} /></div>
                    <span className="role-label">{card.label}</span>
                    <span className="role-desc">{card.desc}</span>
                  </button>
                )
              })}
            </div>
          )}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@zmslizza.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="input-eye" onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="login-error animate-fade-in">{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={loading}>
              {loading ? <><Loader2 size={18} className="spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
          {ROLE_CARDS.length > 0 && <p className="login-hint">Select a role above to auto-fill seeded credentials.</p>}
        </div>
        <p className="login-footer animate-fade-in">(c) 2026 LIZZA INDIA PVT. LTD. All rights reserved.</p>
      </div>
    </div>
  )
}

