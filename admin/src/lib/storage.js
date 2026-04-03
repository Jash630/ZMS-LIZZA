const TOKEN_KEY = 'zms_admin_token'
const USER_KEY = 'zms_admin_user'

const hasWindow = () => typeof window !== 'undefined'

export const storageKeys = { TOKEN_KEY, USER_KEY }

export const getStoredToken = () => {
  if (!hasWindow()) return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setStoredToken = (token) => {
  if (!hasWindow()) return
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY)
    else localStorage.setItem(TOKEN_KEY, token)
  } catch (err) {
    console.warn('Failed to store auth token:', err?.message || err)
  }
}

export const getStoredUser = () => {
  if (!hasWindow()) return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setStoredUser = (user) => {
  if (!hasWindow()) return
  try {
    if (!user) localStorage.removeItem(USER_KEY)
    else localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (err) {
    console.warn('Failed to store user data:', err?.message || err)
  }
}

export const clearAuthStorage = () => {
  setStoredToken(null)
  setStoredUser(null)
}
