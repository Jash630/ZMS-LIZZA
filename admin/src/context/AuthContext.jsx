import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
}

export const ROLE_PERMISSIONS = {
  superadmin: ['all'],
  admin:  ['dashboard','posts','comments','media','analytics','leads','users','settings','seo','notifications'],
  editor: ['dashboard','posts','comments','media'],
}

const DEMO_USERS = [
  { id: 1, email: 'superadmin@zmslizza.com', password: 'super123',  role: ROLES.SUPERADMIN, name: 'Ravi Kumar'   },
  { id: 2, email: 'admin@zmslizza.com',      password: 'admin123',  role: ROLES.ADMIN,      name: 'Priya Sharma' },
  { id: 3, email: 'editor@zmslizza.com',     password: 'editor123', role: ROLES.EDITOR,     name: 'Arjun Mehta'  },
]

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('zms_user')
      if (saved) setUser(JSON.parse(saved))
    } catch (_) {}
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password.' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    sessionStorage.setItem('zms_user', JSON.stringify(safeUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('zms_user')
  }

  const hasPermission = (page) => {
    if (!user) return false
    const perms = ROLE_PERMISSIONS[user.role] || []
    return perms.includes('all') || perms.includes(page)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)