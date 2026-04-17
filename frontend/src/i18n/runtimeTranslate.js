const CACHE_STORAGE_KEY = 'zms-lizza-rt-cache-v1'
const MAX_CACHE_ITEMS = 1500
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_TRANSLATE_TIMEOUT_MS || 7000)

const NON_TRANSLATABLE_KEYS = new Set([
  'id', '_id', 'slug', 'url', 'image', 'featuredImage', 'type', 'createdAt', 'updatedAt', 'publishedAt',
  'modelNo', 'seoTitle', 'seoDescription', 'alt', 'source', 'href', 'email', 'phone', 'whatsapp',
])

const inMemoryCache = new Map()
const inflight = new Map()

const isLikelyNonTranslatableValue = (text) => {
  const value = String(text || '').trim()
  if (!value) return true
  if (/^https?:\/\//i.test(value)) return true
  if (/^[\w-]+@[\w-]+\.[\w.-]+$/.test(value)) return true
  if (/^\+?[\d\s()-]{8,}$/.test(value)) return true
  return false
}

const makeCacheKey = (lang, text) => `${lang}::${String(text)}`

const readStoredCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeStoredCache = (cacheObj) => {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheObj))
  } catch {
    // Ignore write errors (private mode/storage full)
  }
}

const getCached = (lang, text) => {
  const key = makeCacheKey(lang, text)
  if (inMemoryCache.has(key)) return inMemoryCache.get(key)

  const store = readStoredCache()
  if (Object.prototype.hasOwnProperty.call(store, key)) {
    const value = store[key]
    inMemoryCache.set(key, value)
    return value
  }

  return null
}

const setCached = (lang, text, translated) => {
  const key = makeCacheKey(lang, text)
  inMemoryCache.set(key, translated)

  const store = readStoredCache()
  store[key] = translated

  const keys = Object.keys(store)
  if (keys.length > MAX_CACHE_ITEMS) {
    const overflow = keys.length - MAX_CACHE_ITEMS
    for (let i = 0; i < overflow; i++) {
      delete store[keys[i]]
    }
  }

  writeStoredCache(store)
}

const requestWithTimeout = async (input, init = {}) => {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    window.clearTimeout(timeout)
  }
}

const translateViaCustomApi = async (text, targetLang) => {
  const endpoint = import.meta.env.VITE_TRANSLATION_API_URL
  if (!endpoint) return null

  const response = await requestWithTimeout(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang, sourceLang: 'en' }),
  })
  if (!response.ok) return null

  const payload = await response.json().catch(() => null)
  const translated = payload?.translatedText || payload?.data?.translatedText || payload?.translation
  return typeof translated === 'string' && translated.trim() ? translated : null
}

const translateViaMyMemory = async (text, targetLang) => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(targetLang)}`
  const response = await requestWithTimeout(url, { method: 'GET' })
  if (!response.ok) return null

  const payload = await response.json().catch(() => null)
  const translated = payload?.responseData?.translatedText
  return typeof translated === 'string' && translated.trim() ? translated : null
}

export const translateTextRuntime = async (text, targetLang) => {
  const source = String(text || '')
  if (!source) return source
  if (!targetLang || targetLang === 'en') return source
  if (isLikelyNonTranslatableValue(source)) return source

  const cached = getCached(targetLang, source)
  if (cached) return cached

  const inflightKey = makeCacheKey(targetLang, source)
  if (inflight.has(inflightKey)) return inflight.get(inflightKey)

  const promise = (async () => {
    try {
      const translated = (await translateViaCustomApi(source, targetLang)) || (await translateViaMyMemory(source, targetLang))
      if (!translated) return source
      setCached(targetLang, source, translated)
      return translated
    } catch {
      return source
    } finally {
      inflight.delete(inflightKey)
    }
  })()

  inflight.set(inflightKey, promise)
  return promise
}

const shouldSkipKey = (key) => NON_TRANSLATABLE_KEYS.has(String(key || '').trim())

export const translateDeepRuntime = async (value, targetLang, currentKey = '') => {
  if (!targetLang || targetLang === 'en') return value

  if (typeof value === 'string') {
    if (shouldSkipKey(currentKey)) return value
    return translateTextRuntime(value, targetLang)
  }

  if (Array.isArray(value)) {
    const translatedItems = await Promise.all(value.map((item) => translateDeepRuntime(item, targetLang, currentKey)))
    return translatedItems
  }

  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, val]) => [key, await translateDeepRuntime(val, targetLang, key)])
    )
    return Object.fromEntries(entries)
  }

  return value
}
