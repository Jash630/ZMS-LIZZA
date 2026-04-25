import { useEffect } from 'react'
import { NavigationProvider, useNavigation } from './context/NavigationContext.jsx'
import { HomePage }          from './pages/HomePage.jsx'
import { AboutPage }         from './pages/AboutPage.jsx'
import { ProductsPage }      from './pages/ProductsPage.jsx'
import { ProductDetailPage } from './pages/ProductDetailPage.jsx'
import { GalleryPage }       from './pages/GalleryPage.jsx'
import { ServicesPage }      from './pages/ServicesPage.jsx'
import { BlogPage }          from './pages/BlogPage.jsx'
import { BlogPostPage }      from './pages/BlogPostPage.jsx'
import { ContactPage }       from './pages/ContactPage.jsx'
import { publicService }     from './services/publicService.js'

const SITE_URL = String(import.meta.env.VITE_SITE_URL || 'https://lizza.in').replace(/\/+$/, '')

const SEO_BY_PAGE = {
  home: {
    title: 'LIZZA Embroidery Machines India | Sequin, Bead and Coding Machines',
    description:
      'LIZZA India provides industrial embroidery machines in India for sequin, bead and coding work. High-speed machines, demo support, and business setup guidance.',
  },
  about: {
    title: 'About LIZZA India | Embroidery Machine Company',
    description:
      'Learn about LIZZA India, our embroidery machine expertise, service network, and mission to support textile factories with reliable technology.',
  },
  products: {
    title: 'Embroidery Machine Products | LIZZA India',
    description:
      'Browse industrial embroidery machine models for sequin, bead and coding use cases. Compare specifications and request the best quote from LIZZA India.',
  },
  'product-detail': {
    title: 'Embroidery Machine Details | LIZZA India',
    description:
      'View detailed specifications, features, and support information for LIZZA India embroidery machines.',
  },
  gallery: {
    title: 'Machine Gallery | LIZZA India',
    description:
      'Explore photos and videos of LIZZA embroidery machines and production output from real industrial use cases.',
  },
  services: {
    title: 'Installation and Service Support | LIZZA India',
    description:
      'Get installation, training, maintenance and ongoing technical support for embroidery machines from LIZZA India experts.',
  },
  blog: {
    title: 'Embroidery Machine Blog | LIZZA India',
    description:
      'Read practical guides, industry updates and machine buying tips for embroidery businesses across India.',
  },
  'blog-detail': {
    title: 'Embroidery Insights Article | LIZZA India Blog',
    description:
      'Detailed embroidery machine insights and textile industry knowledge from the LIZZA India blog.',
  },
  contact: {
    title: 'Contact LIZZA India | Demo and Quote Request',
    description:
      'Contact LIZZA India for embroidery machine quotes, live demos, support and consultation. Call or submit your enquiry online.',
  },
}

const trimDescription = (value, limit = 160) => {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= limit) return clean
  return `${clean.slice(0, limit - 1).trim()}...`
}

const buildSearchPath = (page, id = null) => {
  switch (page) {
    case 'about':
      return '/?page=about'
    case 'products':
      return '/?page=products'
    case 'product-detail':
      return id ? `/?page=product-detail&product=${encodeURIComponent(id)}` : '/?page=products'
    case 'gallery':
      return '/?page=gallery'
    case 'services':
      return '/?page=services'
    case 'blog':
      return '/?page=blog'
    case 'blog-detail':
      return id ? `/?page=blog-detail&slug=${encodeURIComponent(id)}` : '/?page=blog'
    case 'contact':
      return '/?page=contact'
    default:
      return '/'
  }
}

const setMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const setCanonicalLink = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const applySeo = ({ title, description, path, type = 'website' }) => {
  const fullUrl = `${SITE_URL}${path}`
  document.title = title

  setMetaTag('name', 'description', description)
  setMetaTag('name', 'robots', 'index,follow')
  setMetaTag('property', 'og:type', type)
  setMetaTag('property', 'og:title', title)
  setMetaTag('property', 'og:description', description)
  setMetaTag('property', 'og:url', fullUrl)
  setMetaTag('property', 'og:image', `${SITE_URL}/bgr_logo.png`)
  setMetaTag('name', 'twitter:card', 'summary_large_image')
  setMetaTag('name', 'twitter:title', title)
  setMetaTag('name', 'twitter:description', description)
  setMetaTag('name', 'twitter:image', `${SITE_URL}/bgr_logo.png`)

  setCanonicalLink(fullUrl)
}

function AppRoutes() {
  const { currentPage, productId, blogSlug } = useNavigation()

  useEffect(() => {
    const baseSeo = SEO_BY_PAGE[currentPage] || SEO_BY_PAGE.home
    applySeo({
      title: baseSeo.title,
      description: baseSeo.description,
      path: buildSearchPath(currentPage, currentPage === 'product-detail' ? productId : blogSlug),
    })

    let cancelled = false

    if (currentPage === 'product-detail' && productId) {
      publicService
        .getProductBySlug(productId)
        .then((product) => {
          if (cancelled || !product) return
          applySeo({
            title: `${product.name} | Embroidery Machine in India`,
            description: trimDescription(product.seoDescription || product.tagline || product.description || baseSeo.description),
            path: buildSearchPath('product-detail', product.slug || productId),
            type: 'product',
          })
        })
        .catch(() => {})
    }

    if (currentPage === 'blog-detail' && blogSlug) {
      publicService
        .getPostBySlug(blogSlug)
        .then((post) => {
          if (cancelled || !post) return
          applySeo({
            title: `${post.title} | LIZZA India Blog`,
            description: trimDescription(post.seoDescription || post.excerpt || baseSeo.description),
            path: buildSearchPath('blog-detail', post.slug || blogSlug),
            type: 'article',
          })
        })
        .catch(() => {})
    }

    return () => {
      cancelled = true
    }
  }, [currentPage, productId, blogSlug])

  switch (currentPage) {
    case 'about':          return <AboutPage />
    case 'products':       return <ProductsPage />
    case 'product-detail': return <ProductDetailPage productId={productId} />
    case 'gallery':        return <GalleryPage />
    case 'services':       return <ServicesPage />
    case 'blog':           return <BlogPage />
    case 'blog-detail':    return <BlogPostPage slug={blogSlug} />
    case 'contact':        return <ContactPage />
    default:               return <HomePage />
  }
}

export default function App() {
  return (
    <NavigationProvider>
      <AppRoutes />
    </NavigationProvider>
  )
}
