import React, { useEffect, useMemo, useState } from 'react'
import { UserPlus, Shield, User, Edit3, Search, Trash2, Save, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usersService } from '../../services/usersService'
import StateBlock from '../../components/ui/StateBlock'

const ROLE_CFG = {
  superadmin: { cls: 'badge-danger', label: 'Super Admin', gradient: 'linear-gradient(135deg,#E63946,#8B2F97)' },
  admin: { cls: 'badge-info', label: 'Admin', gradient: 'linear-gradient(135deg,#2E5EAA,#8B2F97)' },
  editor: { cls: 'badge-warning', label: 'Editor', gradient: 'linear-gradient(135deg,#FF6B35,#E63946)' },
}

const initialCreate = { name: '', email: '', password: '', role: 'editor' }

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState(initialCreate)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ role: 'editor', status: 'active' })

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await usersService.list({
        search: search || undefined,
        limit: 100,
      })
      setUsers(response?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 250)
    return () => clearTimeout(timer)
  }, [search])

  const stats = useMemo(() => ([
    ['Total Users', users.length, User, '#2E5EAA'],
    ['Super Admins', users.filter((item) => item.role === 'superadmin').length, Shield, '#E63946'],
    ['Admins', users.filter((item) => item.role === 'admin').length, User, '#8B2F97'],
    ['Editors', users.filter((item) => item.role === 'editor').length, Edit3, '#FF6B35'],
  ]), [users])

  const submitCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await usersService.create(createForm)
      setShowCreate(false)
      setCreateForm(initialCreate)
      await fetchUsers()
    } catch (err) {
      setError(err?.message || 'Failed to create user.')
    } finally {
      setCreating(false)
    }
  }

  const openEdit = (target) => {
    setEditing(target)
    setEditForm({
      role: target.role || 'editor',
      status: target.status || 'active',
    })
  }

  const submitEdit = async (e) => {
    e.preventDefault()
    if (!editing) return
    try {
      await usersService.update(editing._id, editForm)
      setEditing(null)
      await fetchUsers()
    } catch (err) {
      setError(err?.message || 'Failed to update user.')
    }
  }

  const deleteUser = async (target) => {
    if (!window.confirm(`Delete user ${target.name}?`)) return
    try {
      await usersService.remove(target._id)
      setUsers((current) => current.filter((item) => item._id !== target._id))
    } catch (err) {
      setError(err?.message || 'Failed to delete user.')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users and <span className="gradient-text">Authors</span></h1>
          <p className="page-subtitle">{users.length} team members</p>
        </div>
        {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><UserPlus size={15} /> Add User</button>
        )}
      </div>

      <div className="stats-grid stagger-children" style={{ marginBottom: 24 }}>
        {stats.map(([label, value, icon, color], index) => (
          <div key={index} className="card animate-fade-in" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {React.createElement(icon, { size: 18, color: 'white' })}
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card posts-toolbar" style={{ marginBottom: 20 }}>
        <div className="toolbar-search">
          <Search size={15} />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="toolbar-input" />
        </div>
      </div>

      <StateBlock loading={loading} error={error} onRetry={fetchUsers} />

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {users.map((item) => {
            const roleConfig = ROLE_CFG[item.role] || ROLE_CFG.editor
            const initials = item.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U'
            const isMe = item.email === currentUser?.email
            return (
              <div key={item._id} className="card animate-fade-in" style={{ padding: 20, border: isMe ? '2px solid var(--red)' : '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div className="avatar avatar-lg" style={{ background: roleConfig.gradient }}>{initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 700 }}>{item.name}</span>
                      {isMe && <span className="badge badge-success" style={{ fontSize: 9 }}>You</span>}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.email}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginBottom: 14 }}>
                  <span className={`badge ${roleConfig.cls}`}>{roleConfig.label}</span>
                  <span className={`badge ${item.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{item.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: currentUser?.role === 'superadmin' && !isMe ? 14 : 0 }}>
                  <span>📝 {item.postCount ?? 0} posts</span>
                  <span>🕐 {item.lastLogin ? new Date(item.lastLogin).toLocaleString() : 'Never'}</span>
                </div>
                {currentUser?.role === 'superadmin' && !isMe && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(item)}><Edit3 size={13} /> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(item)}><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            )
          })}
          {users.length === 0 && <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>No users found.</div>}
        </div>
      )}

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, padding: 20 }}>
            <form onSubmit={submitCreate} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 20 }}>Create User</h3>
                <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowCreate(false)}><X size={14} /></button>
              </div>
              <input className="input" placeholder="Name" value={createForm.name} onChange={(e) => setCreateForm((current) => ({ ...current, name: e.target.value }))} required />
              <input className="input" type="email" placeholder="Email" value={createForm.email} onChange={(e) => setCreateForm((current) => ({ ...current, email: e.target.value }))} required />
              <input className="input" type="password" placeholder="Password" value={createForm.password} onChange={(e) => setCreateForm((current) => ({ ...current, password: e.target.value }))} required />
              <select className="input" value={createForm.role} onChange={(e) => setCreateForm((current) => ({ ...current, role: e.target.value }))}>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}><Save size={14} /> {creating ? 'Saving...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 460, padding: 20 }}>
            <form onSubmit={submitEdit} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 20 }}>Edit {editing.name}</h3>
                <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => setEditing(null)}><X size={14} /></button>
              </div>
              <select className="input" value={editForm.role} onChange={(e) => setEditForm((current) => ({ ...current, role: e.target.value }))}>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
              <select className="input" value={editForm.status} onChange={(e) => setEditForm((current) => ({ ...current, status: e.target.value }))}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Save size={14} /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
