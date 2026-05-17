const PRODUCT_CATEGORY_SLUGS = new Set([
  'computerized-embroidery-machines',
  'sequin-embroidery-machines',
  'bead-embroidery-machines',
  'coding-machines',
  'spare-parts',
])

const trimSlashes = (value = '') => String(value || '').replace(/^\/+|\/+$/g, '')

const normalizePathname = (value = '/') => {
  const trimmed = String(value || '/').trim()
  if (!trimmed || trimmed === '/') return '/'
  return `/${trimSlashes(trimmed)}/`
}

export const isProductCategorySlug = (slug) => PRODUCT_CATEGORY_SLUGS.has(String(slug || '').trim())

export const getHrefForPage = (page, id = null) => {
  switch (page) {
    case 'about':
      return '/about/'
    case 'products':
      return '/products/'
    case 'product-category':
      return id ? `/products/${trimSlashes(id)}/` : '/products/'
    case 'product-detail':
      return id ? `/product/${trimSlashes(id)}/` : '/products/'
    case 'gallery':
      return '/gallery/'
    case 'services':
      return '/services/'
    case 'blog':
      return '/blog/'
    case 'blog-detail':
      return id ? `/blog/${trimSlashes(id)}/` : '/blog/'
    case 'contact':
      return '/contact/'
    case 'industries':
      return '/industries/'
    case 'applications':
      return '/applications/'
    case 'faq':
      return '/faq/'
    case 'not-found':
      return '/404/'
    default:
      return '/'
  }
}

export const getStateFromUrl = (pathname, search = '') => {
  const path = normalizePathname(pathname)
  const params = new URLSearchParams(search || '')

  if (path === '/' || path === '/index.html/') {
    return { page: 'home', productId: null, blogSlug: null, pageSlug: null }
  }

  if (path === '/about/') return { page: 'about', productId: null, blogSlug: null, pageSlug: null }
  if (path === '/products/') return { page: 'products', productId: null, blogSlug: null, pageSlug: null }
  if (path.startsWith('/products/')) {
    const slug = trimSlashes(path.replace('/products/', ''))
    if (isProductCategorySlug(slug)) {
      return { page: 'product-category', productId: null, blogSlug: null, pageSlug: slug }
    }
  }
  if (path.startsWith('/product/')) {
    const slug = trimSlashes(path.replace('/product/', ''))
    if (!slug) return { page: 'not-found', productId: null, blogSlug: null, pageSlug: null }
    return { page: 'product-detail', productId: slug, blogSlug: null, pageSlug: null }
  }
  if (path === '/gallery/') return { page: 'gallery', productId: null, blogSlug: null, pageSlug: null }
  if (path === '/services/') return { page: 'services', productId: null, blogSlug: null, pageSlug: null }
  if (path === '/blog/') return { page: 'blog', productId: null, blogSlug: null, pageSlug: null }
  if (path.startsWith('/blog/')) {
    const slug = trimSlashes(path.replace('/blog/', ''))
    if (!slug) return { page: 'blog', productId: null, blogSlug: null, pageSlug: null }
    return { page: 'blog-detail', productId: null, blogSlug: slug, pageSlug: null }
  }
  if (path === '/contact/') return { page: 'contact', productId: null, blogSlug: null, pageSlug: null }
  if (path === '/industries/') return { page: 'industries', productId: null, blogSlug: null, pageSlug: null }
  if (path === '/applications/') return { page: 'applications', productId: null, blogSlug: null, pageSlug: null }
  if (path === '/faq/') return { page: 'faq', productId: null, blogSlug: null, pageSlug: null }

  // Legacy query-string routes remain supported so existing links continue working.
  const legacyPage = params.get('page')
  const legacyProduct = params.get('product')
  const legacySlug = params.get('slug')

  switch (legacyPage) {
    case 'about':
      return { page: 'about', productId: null, blogSlug: null, pageSlug: null }
    case 'products':
      return { page: 'products', productId: null, blogSlug: null, pageSlug: null }
    case 'product-detail':
      return legacyProduct ? { page: 'product-detail', productId: legacyProduct, blogSlug: null, pageSlug: null } : { page: 'not-found', productId: null, blogSlug: null, pageSlug: null }
    case 'gallery':
      return { page: 'gallery', productId: null, blogSlug: null, pageSlug: null }
    case 'services':
      return { page: 'services', productId: null, blogSlug: null, pageSlug: null }
    case 'blog':
      return { page: 'blog', productId: null, blogSlug: null, pageSlug: null }
    case 'blog-detail':
      return legacySlug ? { page: 'blog-detail', productId: null, blogSlug: legacySlug, pageSlug: null } : { page: 'not-found', productId: null, blogSlug: null, pageSlug: null }
    case 'contact':
      return { page: 'contact', productId: null, blogSlug: null, pageSlug: null }
    default:
      return { page: 'not-found', productId: null, blogSlug: null, pageSlug: null }
  }
}
