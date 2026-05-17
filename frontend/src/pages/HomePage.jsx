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
import { AppLink } from '../components/shared/AppLink.jsx'
import { useTranslation } from '../i18n/index.js'

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
  const { t } = useTranslation()
  const [rawProducts, setRawProducts] = useState([])
  const [rawPosts, setRawPosts] = useState([])
  const [recentMediaImages, setRecentMediaImages] = useState([])
  const products = useRuntimeTranslatedValue(rawProducts)
  const posts = useRuntimeTranslatedValue(rawPosts)
  const industrySections = Array.isArray(t('industriesPage.sections', [])) ? t('industriesPage.sections', []) : []

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
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="mb-4">{t('homeIndustries.title')}</h2>
            <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
              {t('homeIndustries.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {industrySections.map((section) => (
              <article key={section.title} className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 hover:-translate-y-1 transition-all">
                <h3 className="mb-3" style={{ fontSize: '26px' }}>{section.title}</h3>
                <p style={{ color: 'var(--dark-gray)', fontSize: '15px', lineHeight: '1.8' }}>{section.description}</p>
              </article>
            ))}
          </div>

          <div className="text-center mt-8">
            <AppLink page="industries" className="inline-flex items-center px-5 py-3 rounded-lg font-semibold border" style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}>
              {t('homeIndustries.exploreLink')}
            </AppLink>
          </div>
        </div>
      </section>
      <BlogSection posts={posts} />
      <CTASection />
      <Footer />
    </div>
  )
}
