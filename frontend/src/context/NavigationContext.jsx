import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const NavigationContext = createContext({
  currentPage: 'home',
  productId: null,
  blogSlug: null,
  navigateTo: () => {},
})

const VALID_PAGES = new Set([
  'home',
  'about',
  'products',
  'product-detail',
  'gallery',
  'services',
  'blog',
  'blog-detail',
  'contact',
])

const normalizePage = (page) => (VALID_PAGES.has(page) ? page : 'home')

const getStateFromLocation = () => {
  const params = new URLSearchParams(window.location.search)
  const page = normalizePage(params.get('page') || 'home')
  const productId = page === 'product-detail' ? (params.get('product') || null) : null
  const blogSlug = page === 'blog-detail' ? (params.get('slug') || null) : null
  return { page, productId, blogSlug }
}

const buildSearch = (page, id = null) => {
  const target = normalizePage(page)
  if (target === 'home') return ''

  const params = new URLSearchParams()
  params.set('page', target)
  if (target === 'product-detail' && id) params.set('product', id)
  if (target === 'blog-detail' && id) params.set('slug', id)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function NavigationProvider({ children }) {
  const initial = useMemo(() => getStateFromLocation(), [])
  const [currentPage, setCurrentPage] = useState(initial.page)
  const [productId, setProductId] = useState(initial.productId)
  const [blogSlug, setBlogSlug] = useState(initial.blogSlug)

  const navigateTo = (page, id = null, options = {}) => {
    const targetPage = normalizePage(page)
    setCurrentPage(targetPage)
    setProductId(targetPage === 'product-detail' ? id : null)
    setBlogSlug(targetPage === 'blog-detail' ? id : null)

    const search = buildSearch(targetPage, id)
    const nextUrl = `${window.location.pathname}${search}`
    if (options.replace) window.history.replaceState({}, '', nextUrl)
    else window.history.pushState({}, '', nextUrl)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPopState = () => {
      const next = getStateFromLocation()
      setCurrentPage(next.page)
      setProductId(next.productId)
      setBlogSlug(next.blogSlug)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <NavigationContext.Provider value={{ currentPage, productId, blogSlug, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}
