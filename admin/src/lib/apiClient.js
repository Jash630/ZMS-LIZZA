export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

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

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    signal,
  })

  const payload = await parseResponse(response)

  if (response.status === 401 && !skipUnauthorizedHandler && unauthorizedHandler) {
    unauthorizedHandler()
  }

  if (!response.ok) {
    throw new ApiError(
      buildMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload
    )
  }

  return payload
}
