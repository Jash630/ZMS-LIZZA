const TOKEN_KEY = 'zms_admin_token'
const USER_KEY = 'zms_admin_user'

const hasWindow = () => typeof window !== 'undefined'

export const storageKeys = { TOKEN_KEY, USER_KEY }

const migrateLegacyStorage = () => {
  if (!hasWindow()) return

  try {
    const legacyToken = localStorage.getItem(TOKEN_KEY)
    const sessionToken = sessionStorage.getItem(TOKEN_KEY)
    if (legacyToken && !sessionToken) {
      sessionStorage.setItem(TOKEN_KEY, legacyToken)
    }
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore storage migration errors
  }

  try {
    const legacyUser = localStorage.getItem(USER_KEY)
    const sessionUser = sessionStorage.getItem(USER_KEY)
    if (legacyUser && !sessionUser) {
      sessionStorage.setItem(USER_KEY, legacyUser)
    }
    localStorage.removeItem(USER_KEY)
  } catch {
    // ignore storage migration errors
  }
}

export const getStoredToken = () => {
  if (!hasWindow()) return null
  try {
    migrateLegacyStorage()
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setStoredToken = (token) => {
  if (!hasWindow()) return
  try {
    if (!token) sessionStorage.removeItem(TOKEN_KEY)
    else sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.removeItem(TOKEN_KEY)
  } catch (err) {
    console.warn('Failed to store auth token:', err?.message || err)
  }
}

export const getStoredUser = () => {
  if (!hasWindow()) return null
  try {
    migrateLegacyStorage()
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setStoredUser = (user) => {
  if (!hasWindow()) return
  try {
    if (!user) sessionStorage.removeItem(USER_KEY)
    else sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.removeItem(USER_KEY)
  } catch (err) {
    console.warn('Failed to store user data:', err?.message || err)
  }
}

export const clearAuthStorage = () => {
  setStoredToken(null)
  setStoredUser(null)
}
