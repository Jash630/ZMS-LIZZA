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

function AppRoutes() {
  const { currentPage, productId, blogSlug } = useNavigation()

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
