import { useEffect, useState } from 'react'
import { Header }             from '../components/layout/Header.jsx'
import { Footer }             from '../components/layout/Footer.jsx'
import { WhatsAppButton }     from '../components/shared/WhatsAppButton.jsx'
import { HeroSection }        from '../components/home/HeroSection.jsx'
import { WhyChooseSection }   from '../components/home/WhyChooseSection.jsx'
import { FeaturedProducts }   from '../components/home/FeaturedProducts.jsx'
import { SocialProofSection } from '../components/home/SocialProofSection.jsx'
import { TestimonialsSection } from '../components/home/TestimonialsSection.jsx'
import { GallerySection }     from '../components/home/GallerySection.jsx'
import { ServicesSection }    from '../components/home/ServicesSection.jsx'
import { BlogSection }        from '../components/home/BlogSection.jsx'
import { CTASection }         from '../components/home/CTASection.jsx'
import { publicService }      from '../services/publicService.js'
import { useRuntimeTranslatedValue } from '../i18n/useRuntimeTranslatedValue.js'

const PRODUCT_IMAGE_ALLOWLIST = new Set([
  'IMG-20250408-WA0012.jpg',
  'IMG-20250408-WA0013.jpg',
  'IMG-20250408-WA0014.jpg',
  'IMG-20250408-WA0015.jpg',
  'IMG-20250408-WA0017.jpg',
  'IMG-20250408-WA0018.jpg',
  'IMG-20250408-WA0019.jpg',
  '247.jpg',
])

const isAllowedProductMedia = (item) => PRODUCT_IMAGE_ALLOWLIST.has(String(item?.originalName || '').trim())

export function HomePage() {
  const [rawProducts, setRawProducts] = useState([])
  const [rawPosts, setRawPosts] = useState([])
  const [recentMediaImages, setRecentMediaImages] = useState([])
  const products = useRuntimeTranslatedValue(rawProducts)
  const posts = useRuntimeTranslatedValue(rawPosts)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const [featuredProductsRes, postsRes, mediaRes] = await Promise.all([
          publicService.getProducts({ limit: 6, featured: true }),
          publicService.getPosts({ limit: 3 }),
          publicService.getMedia({ type: 'image', limit: 80 }),
        ])

        const productItems = (featuredProductsRes.items || []).length
          ? featuredProductsRes.items
          : (await publicService.getProducts({ limit: 6 })).items

        if (!active) return

        const allowedMediaUrls = (mediaRes.items || [])
          .filter(isAllowedProductMedia)
          .map((item) => item.url)
          .filter(Boolean)

        setRawProducts(productItems || [])
        setRawPosts(postsRes.items || [])
        setRecentMediaImages(allowedMediaUrls)
      } catch {
        if (!active) return
        setRawProducts([])
        setRawPosts([])
        setRecentMediaImages([])
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <WhatsAppButton />
      <HeroSection />
      <WhyChooseSection />
      <FeaturedProducts products={products} recentMediaImages={recentMediaImages} />
      <SocialProofSection />
      <TestimonialsSection />
      <GallerySection />
      <ServicesSection />
      <BlogSection posts={posts} />
      <CTASection />
      <Footer />
    </div>
  )
}
