import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getHrefForPage, getStateFromUrl } from '../utils/navigation.js'

const NavigationContext = createContext({
  currentPage: 'home',
  productId: null,
  blogSlug: null,
  pageSlug: null,
  navigateTo: () => {},
  hrefFor: () => '/',
})

const VALID_PAGES = new Set([
  'home',
  'about',
  'products',
  'product-category',
  'product-detail',
  'gallery',
  'services',
  'blog',
  'blog-detail',
  'contact',
  'industries',
  'applications',
  'faq',
  'not-found',
])

const normalizePage = (page) => (VALID_PAGES.has(page) ? page : 'not-found')

export function NavigationProvider({ children }) {
  const initial = useMemo(() => getStateFromUrl(window.location.pathname, window.location.search), [])
  const [currentPage, setCurrentPage] = useState(initial.page)
  const [productId, setProductId] = useState(initial.productId)
  const [blogSlug, setBlogSlug] = useState(initial.blogSlug)
  const [pageSlug, setPageSlug] = useState(initial.pageSlug)

  const navigateTo = (page, id = null, options = {}) => {
    const targetPage = normalizePage(page)
    setCurrentPage(targetPage)
    setProductId(targetPage === 'product-detail' ? id : null)
    setBlogSlug(targetPage === 'blog-detail' ? id : null)
    setPageSlug(targetPage === 'product-category' ? id : null)

    const nextUrl = getHrefForPage(targetPage, id)
    if (options.replace) window.history.replaceState({}, '', nextUrl)
    else window.history.pushState({}, '', nextUrl)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPopState = () => {
      const next = getStateFromUrl(window.location.pathname, window.location.search)
      setCurrentPage(next.page)
      setProductId(next.productId)
      setBlogSlug(next.blogSlug)
      setPageSlug(next.pageSlug)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return (
    <NavigationContext.Provider value={{ currentPage, productId, blogSlug, pageSlug, navigateTo, hrefFor: getHrefForPage }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  return useContext(NavigationContext)
}
