import { useEffect } from 'react'
import { NavigationProvider, useNavigation } from './context/NavigationContext.jsx'
import { HomePage }          from './pages/HomePage.jsx'
import { AboutPage }         from './pages/AboutPage.jsx'
import { ProductsPage }      from './pages/ProductsPage.jsx'
import { ProductCategoryPage } from './pages/ProductCategoryPage.jsx'
import { ProductDetailPage } from './pages/ProductDetailPage.jsx'
import { GalleryPage }       from './pages/GalleryPage.jsx'
import { ServicesPage }      from './pages/ServicesPage.jsx'
import { BlogPage }          from './pages/BlogPage.jsx'
import { BlogPostPage }      from './pages/BlogPostPage.jsx'
import { ContactPage }       from './pages/ContactPage.jsx'
import { IndustriesPage }    from './pages/IndustriesPage.jsx'
import { ApplicationsPage }  from './pages/ApplicationsPage.jsx'
import { FAQPage }           from './pages/FAQPage.jsx'
import { NotFoundPage }      from './pages/NotFoundPage.jsx'
import { publicService }     from './services/publicService.js'
import {
  applySeo,
  buildFaqSchema,
  buildProductSchema,
  localBusinessSchema,
  organizationSchema,
  trimDescription,
} from './utils/seo.js'
import { getHrefForPage } from './utils/navigation.js'
import { FAQ_ITEMS, PRODUCT_CATEGORY_CONTENT } from './content/seoContent.js'

const trimTrailingSlashes = (value = '') => String(value).replace(/\/+$/, '')
const API_V1_BASE = trimTrailingSlashes(import.meta.env.VITE_API_BASE_URL || 'https://zms-lizza-backend.onrender.com/api/v1')
const BACKEND_WAKE_URL = `${API_V1_BASE}/health`

let backendWakePingSent = false

const SEO_BY_PAGE = {
  home: {
    title: 'Reliable 24/7 Commercial Embroidery Machines | ZMS LIZZA',
    description:
      'Equip your factory with ZMS LIZZA\'s European-engineered embroidery machines. Built for 24/7 high-speed production with multi-function sequin and bead capabilities.',
    schema: organizationSchema,
  },
  about: {
    title: 'About ZMS LIZZA | European-Engineered Embroidery Machines Since 2012',
    description:
      'Since 2012, ZMS LIZZA has manufactured high-speed commercial embroidery machines in Surat for Indian textile factories needing precision, uptime, and local support.',
    schema: localBusinessSchema,
  },
  products: {
    title: 'ZMS LIZZA Embroidery Machines | All Models India | Lizza India Pvt Ltd',
    description:
      'Explore the ZMS LIZZA embroidery machine range including computerized, sequin, bead, coding machines, and spare parts for textile factories in India.',
  },
  'product-detail': {
    title: 'Embroidery Machine Details | ZMS LIZZA',
    description:
      'View detailed specifications, features, and support information for ZMS LIZZA embroidery machines.',
  },
  gallery: {
    title: 'Machine Gallery | ZMS LIZZA',
    description:
      'Explore photos and videos of ZMS LIZZA embroidery machines and production output from real industrial use cases.',
  },
  services: {
    title: 'Installation and Service Support | ZMS LIZZA',
    description:
      'Get installation, training, maintenance and ongoing technical support for embroidery machines from ZMS LIZZA experts.',
  },
  blog: {
    title: 'Embroidery Machine Blog | ZMS LIZZA',
    description:
      'Read practical guides, industry updates and machine buying tips for embroidery businesses across India from ZMS LIZZA.',
  },
  'blog-detail': {
    title: 'Embroidery Insights Article | ZMS LIZZA Blog',
    description:
      'Detailed embroidery machine insights and textile industry knowledge from the ZMS LIZZA blog.',
  },
  contact: {
    title: 'Contact ZMS LIZZA Surat | Custom Embroidery Machine Quote & Demo',
    description:
      'Contact ZMS LIZZA in Surat for custom embroidery machine quotes, live demos, WhatsApp support, technical service, and factory showroom visits.',
    schema: localBusinessSchema,
  },
  industries: {
    title: 'Textile Industries Served | ZMS LIZZA Embroidery Machines',
    description:
      'See how ZMS LIZZA embroidery machines support apparel and home textile manufacturers across India.',
  },
  applications: {
    title: 'Embroidery Machine Applications by ZMS LIZZA',
    description:
      'Explore embroidery machine applications for apparel, decorative fabrics, sequin work, bead work, coding, and textile factory production.',
  },
  faq: {
    title: 'Embroidery Machine FAQ | ZMS LIZZA India',
    description:
      'Find answers about embroidery machine price, machine selection, support, spare parts, and ZMS LIZZA applications in India.',
    schema: buildFaqSchema(FAQ_ITEMS),
  },
  'not-found': {
    title: '404 Page Not Found | ZMS LIZZA',
    description:
      'The page you requested could not be found. Return to the ZMS LIZZA homepage or explore our embroidery machine catalog.',
  },
}

function AppRoutes() {
  const { currentPage, productId, blogSlug, pageSlug } = useNavigation()

  useEffect(() => {
    const baseSeo = SEO_BY_PAGE[currentPage] || SEO_BY_PAGE.home
    applySeo({
      title: baseSeo.title,
      description: baseSeo.description,
      path: getHrefForPage(currentPage, currentPage === 'product-detail' ? productId : currentPage === 'blog-detail' ? blogSlug : pageSlug),
      schema: baseSeo.schema || null,
    })

    let cancelled = false

    if (currentPage === 'product-category' && pageSlug) {
      const category = PRODUCT_CATEGORY_CONTENT[pageSlug]
      if (category) {
        applySeo({
          title: category.titleTag,
          description: category.metaDescription,
          path: getHrefForPage('product-category', pageSlug),
          schema: buildProductSchema({
            name: category.h1,
            description: category.intro,
            path: getHrefForPage('product-category', pageSlug),
            category: category.primaryKeyword,
          }),
        })
      }
    }

    if (currentPage === 'product-detail' && productId) {
      publicService
        .getProductBySlug(productId)
        .then((product) => {
          if (cancelled || !product) return
          applySeo({
            title: `${product.name} | ZMS LIZZA Embroidery Machine India`,
            description: trimDescription(product.seoDescription || product.tagline || product.description || baseSeo.description),
            path: getHrefForPage('product-detail', product.slug || productId),
            type: 'product',
            schema: buildProductSchema({
              name: product.name,
              description: product.description || product.tagline || baseSeo.description,
              path: getHrefForPage('product-detail', product.slug || productId),
              category: product.category,
              image: product.image,
            }),
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
            title: `${post.title} | ZMS LIZZA Blog`,
            description: trimDescription(post.seoDescription || post.excerpt || baseSeo.description),
            path: getHrefForPage('blog-detail', post.slug || blogSlug),
            type: 'article',
          })
        })
        .catch(() => {})
    }

    return () => {
      cancelled = true
    }
  }, [currentPage, productId, blogSlug, pageSlug])

  switch (currentPage) {
    case 'home':           return <HomePage />
    case 'about':          return <AboutPage />
    case 'products':       return <ProductsPage />
    case 'product-category': return <ProductCategoryPage slug={pageSlug} />
    case 'product-detail': return <ProductDetailPage productId={productId} />
    case 'gallery':        return <GalleryPage />
    case 'services':       return <ServicesPage />
    case 'blog':           return <BlogPage />
    case 'blog-detail':    return <BlogPostPage slug={blogSlug} />
    case 'contact':        return <ContactPage />
    case 'industries':     return <IndustriesPage />
    case 'applications':   return <ApplicationsPage />
    case 'faq':            return <FAQPage />
    case 'not-found':      return <NotFoundPage />
    default:               return <HomePage />
  }
}

export default function App() {
  useEffect(() => {
    if (backendWakePingSent) return
    backendWakePingSent = true

    ;(async () => {
      try {
        await fetch(BACKEND_WAKE_URL, {
          method: 'GET',
          cache: 'no-store',
          keepalive: true,
        })
      } catch {
        // Ignore wake-up failures; normal API calls still handle real errors.
      }
    })()
  }, [])

  return (
    <NavigationProvider>
      <AppRoutes />
    </NavigationProvider>
  )
}

