const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (import.meta.env.PROD && !ENV_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required in production.')
}

export const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:5000/api/v1'

const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_HTTP_TIMEOUT_MS || 15000)

let tokenGetter = () => null
let unauthorizedHandler = null

export class ApiError extends Error {
  constructor(message, status = 500, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export const setAuthTokenGetter = (getter) => {
  tokenGetter = typeof getter === 'function' ? getter : (() => null)
}

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = typeof handler === 'function' ? handler : null
}

const toQueryString = (query = {}) => {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    params.set(key, String(value))
  })
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

const parseResponse = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}${toQueryString(query)}`
}

const buildMessage = (payload, fallback) => {
  if (payload?.message) return payload.message
  if (payload?.error?.message) return payload.error.message
  return fallback
}

const toSafeClientMessage = (status, payload) => {
  if (status === 401) return 'Session expired. Please log in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status >= 500) return 'Server error. Please try again shortly.'
  return buildMessage(payload, `Request failed with status ${status}`)
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    isFormData = false,
    skipAuth = false,
    skipUnauthorizedHandler = false,
    signal,
  } = options

  const token = skipAuth ? null : tokenGetter()
  const requestHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  }

  if (token) requestHeaders.Authorization = `Bearer ${token}`

  const controller = signal ? null : new AbortController()
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    : null

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal: signal || controller?.signal,
    })
  } catch (error) {
    if (timeoutId) window.clearTimeout(timeoutId)
    if (error?.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 408)
    }
    throw new ApiError('Unable to reach server. Please check your connection and try again.', 503)
  }

  if (timeoutId) window.clearTimeout(timeoutId)

  const payload = await parseResponse(response)

  if (response.status === 401 && !skipUnauthorizedHandler && unauthorizedHandler) {
    unauthorizedHandler()
  }

  if (!response.ok) {
    const safeMessage = toSafeClientMessage(response.status, payload)
    throw new ApiError(
      safeMessage,
      response.status,
      payload
    )
  }

  return payload
}
