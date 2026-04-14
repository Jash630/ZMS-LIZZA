/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { clearAuthStorage, getStoredToken, getStoredUser, setStoredToken, setStoredUser } from '../lib/storage'
import { setAuthTokenGetter, setUnauthorizedHandler } from '../lib/apiClient'

const AuthContext = createContext(null)

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
}

export const ROLE_PERMISSIONS = {
  superadmin: ['all'],
  admin: ['dashboard', 'posts', 'comments', 'media', 'analytics', 'leads', 'users', 'settings', 'seo', 'notifications'],
  editor: ['dashboard', 'posts', 'comments', 'media'],
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(true)

  const clearSession = () => {
    setToken(null)
    setUser(null)
    clearAuthStorage()
  }

  useEffect(() => {
    setAuthTokenGetter(() => token || getStoredToken())
  }, [token])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  useEffect(() => {
    let mounted = true

    const bootstrapAuth = async () => {
      const existingToken = getStoredToken()
      const existingUser = getStoredUser()
      if (!existingToken || !existingUser) {
        if (mounted) setLoading(false)
        return
      }

      try {
        const profile = await authService.getMe()
        if (!mounted) return
        const safeUser = profile?.data || existingUser
        setToken(existingToken)
        setUser(safeUser)
        setStoredUser(safeUser)
      } catch {
        if (mounted) clearSession()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    bootstrapAuth()
    return () => {
      mounted = false
    }
  }, [])

  const login = async (email, password) => {
    try {
      const payload = await authService.login(email, password)
      const nextToken = payload?.token
      const nextUser = payload?.data
      if (!nextToken || !nextUser) {
        return { success: false, error: 'Invalid login response from server.' }
      }

      setToken(nextToken)
      setUser(nextUser)
      setStoredToken(nextToken)
      setStoredUser(nextUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.message || 'Login failed.' }
    }
  }

  const logout = async () => {
    try {
      if (token) await authService.logout()
    } catch (err) {
      console.warn('Logout request failed:', err?.message || err)
      // best effort logout
    } finally {
      clearSession()
    }
  }

  const hasPermission = (page) => {
    if (!user) return false
    const perms = ROLE_PERMISSIONS[user.role] || []
    return perms.includes('all') || perms.includes(page)
  }

  const value = useMemo(
    () => ({ user, token, login, logout, hasPermission, loading, setUser, setToken }),
    [user, token, loading, logout, hasPermission]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
