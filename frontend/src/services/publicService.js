const trimTrailingSlashes = (value = '') => String(value).replace(/\/+$/, '')
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_HTTP_TIMEOUT_MS || 15000)

const API_V1_BASE = trimTrailingSlashes(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1')

const ensurePublicBase = (base) => {
  const normalized = trimTrailingSlashes(base)
  return normalized.endsWith('/public') ? normalized : `${normalized}/public`
}

const PUBLIC_API_BASE = ensurePublicBase(import.meta.env.VITE_PUBLIC_API_BASE_URL || API_V1_BASE)

const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900'
const DEFAULT_PRODUCT_IMAGE = '/bgr_logo.png'

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

const request = async (path, options = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${PUBLIC_API_BASE}${normalizedPath}${toQueryString(options.query)}`
  const controller = options.signal ? null : new AbortController()
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    : null

  let response
  try {
    response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal || controller?.signal,
    })
  } catch (error) {
    if (timeoutId) window.clearTimeout(timeoutId)
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw error
  }

  if (timeoutId) window.clearTimeout(timeoutId)

  const payload = await parseResponse(response)
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }

  return payload
}

const formatDisplayDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const estimateReadTime = (text = '') => {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 220))
  return `${minutes} min read`
}

const normalizePost = (post) => ({
  id: post._id || post.slug,
  slug: post.slug,
  title: post.title || 'Untitled',
  excerpt: post.excerpt || '',
  content: post.content || '',
  category: post.category || 'News',
  tags: Array.isArray(post.tags) ? post.tags : [],
  author: post.author?.name || 'ZMS LIZZA Team',
  date: formatDisplayDate(post.publishedAt || post.createdAt),
  readTime: estimateReadTime(post.excerpt || post.content || ''),
  image: post.featuredImage || DEFAULT_POST_IMAGE,
  views: post.views || 0,
  publishedAt: post.publishedAt || post.createdAt || null,
  seoTitle: post.seoTitle || '',
  seoDescription: post.seoDescription || '',
})

const normalizeProductCard = (product) => ({
  id: product._id || product.slug,
  slug: product.slug,
  name: product.name || 'Untitled',
  category: product.category || 'Embroidery Machine',
  modelNo: product.modelNo || '',
  priceDisplay: product.priceDisplay || '',
  priceNote: product.priceNote || 'Get Latest Price',
  tagline: product.tagline || '',
  badge: product.badge || 'Product',
  description: product.description || '',
  keySpecs: Array.isArray(product.keySpecs) ? product.keySpecs : [],
  keyFeatures: Array.isArray(product.keyFeatures) ? product.keyFeatures : [],
  specifications: Array.isArray(product.specifications) ? product.specifications : [],
  features: Array.isArray(product.features) ? product.features : [],
  image: product.image || product.galleryImages?.[0] || DEFAULT_PRODUCT_IMAGE,
  isPopular: Boolean(product.isPopular),
  galleryImages: Array.isArray(product.galleryImages) ? product.galleryImages : [],
})

const normalizeProductDetail = (product) => {
  const specMap = {}
  const groups = Array.isArray(product.specifications) ? product.specifications : []
  for (const group of groups) {
    if (!group?.category) continue
    specMap[group.category] = Array.isArray(group.items) ? group.items : []
  }

  const gallery = Array.isArray(product.galleryImages) ? product.galleryImages.filter(Boolean) : []
  const primaryImage = product.image || gallery[0] || DEFAULT_PRODUCT_IMAGE

  return {
    id: product._id || product.slug,
    slug: product.slug,
    name: product.name || 'Untitled',
    category: product.category || 'Embroidery Machine',
    modelNo: product.modelNo || '',
    priceDisplay: product.priceDisplay || '',
    priceNote: product.priceNote || 'Get Latest Price',
    tagline: product.tagline || '',
    badge: product.badge || 'Product',
    description: product.description || '',
    keyFeatures: Array.isArray(product.keyFeatures) ? product.keyFeatures : [],
    galleryImages: gallery.length > 0 ? gallery : [primaryImage],
    specifications: specMap,
    features: Array.isArray(product.features) ? product.features : [],
    applications: Array.isArray(product.applications) ? product.applications : [],
    packageIncludes: Array.isArray(product.packageIncludes) ? product.packageIncludes : [],
    faqs: Array.isArray(product.faqs) ? product.faqs : [],
  }
}

const normalizeMedia = (item) => ({
  id: item._id || item.id || item.url,
  name: item.name || item.originalName || 'Media',
  originalName: item.originalName || '',
  alt: item.alt || item.name || 'Gallery media',
  type: item.type || 'other',
  url: item.url || '',
  createdAt: item.createdAt || null,
})

export const publicService = {
  async getPosts(query = {}) {
    const payload = await request('/posts', { query })
    return {
      items: Array.isArray(payload?.data) ? payload.data.map(normalizePost) : [],
      meta: payload?.meta || null,
    }
  },

  async getPostBySlug(slug) {
    const payload = await request(`/posts/${encodeURIComponent(slug)}`)
    return payload?.data ? normalizePost(payload.data) : null
  },

  async getPostComments(slug, query = {}) {
    const payload = await request(`/posts/${encodeURIComponent(slug)}/comments`, { query })
    return {
      items: Array.isArray(payload?.data)
        ? payload.data.map((comment) => ({
          id: comment._id,
          author: comment.author || 'Anonymous',
          content: comment.content || '',
          createdAt: comment.createdAt || null,
        }))
        : [],
      meta: payload?.meta || null,
    }
  },

  async submitPostComment(slug, data) {
    const payload = await request(`/posts/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      body: data,
    })
    return payload?.data || null
  },

  async getProducts(query = {}) {
    const payload = await request('/products', { query })
    return {
      items: Array.isArray(payload?.data) ? payload.data.map(normalizeProductCard) : [],
      meta: payload?.meta || null,
    }
  },

  async getProductBySlug(slug) {
    const payload = await request(`/products/${encodeURIComponent(slug)}`)
    return payload?.data ? normalizeProductDetail(payload.data) : null
  },

  async submitLead(data) {
    const payload = await request('/leads', { method: 'POST', body: data })
    return payload?.data || null
  },

  async getSettings() {
    const payload = await request('/settings')
    return payload?.data || null
  },

  async getMedia(query = {}) {
    const payload = await request('/media', { query })
    return {
      items: Array.isArray(payload?.data) ? payload.data.map(normalizeMedia) : [],
      meta: payload?.meta || null,
    }
  },

  async subscribeNewsletter(email) {
    const payload = await request('/newsletter/subscribe', {
      method: 'POST',
      body: { email, source: 'blog' },
    })
    return {
      message: payload?.message || 'Subscribed successfully',
      data: payload?.data || null,
    }
  },
}
