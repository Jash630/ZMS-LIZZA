import { useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { ProductImageCarousel, buildProductCarouselImages } from '../shared/ProductImageCarousel.jsx'
import { useTranslation } from '../../i18n/index.js'

const rotatePool = (pool, offset = 0) => {
  if (!Array.isArray(pool) || pool.length === 0) return []
  const normalized = ((offset % pool.length) + pool.length) % pool.length
  return [...pool.slice(normalized), ...pool.slice(0, normalized)]
}

export function FeaturedProducts({ products = [], recentMediaImages = [] }) {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const trackRef = useRef(null)

  const cards = useMemo(
    () => (products || []).map((product, index) => ({
      ...product,
      detailTarget: product.id || product.slug || null,
      carouselImages: buildProductCarouselImages(product, rotatePool(recentMediaImages, index), { poolOnly: true }),
    })),
    [products, recentMediaImages]
  )

  const scroll = (dir) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' })
  }

  const openDetails = (target) => {
    if (!target) {
      navigateTo('products')
      return
    }
    navigateTo('product-detail', target)
  }

  return (
    <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">{t('featuredProducts.title')}</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
            {t('featuredProducts.subtitle')}
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-xl items-center justify-center hover:scale-110 transition-transform"
            style={{ border: '2px solid var(--light-gray)' }}
          >
            <ChevronLeft size={24} style={{ color: 'var(--charcoal)' }} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-xl items-center justify-center hover:scale-110 transition-transform"
            style={{ border: '2px solid var(--light-gray)' }}
          >
            <ChevronRight size={24} style={{ color: 'var(--charcoal)' }} />
          </button>

          <div ref={trackRef} className="overflow-x-auto scrollbar-hide pb-4">
            {cards.length === 0 && (
              <p style={{ color: 'var(--dark-gray)' }}>{t('featuredProducts.empty')}</p>
            )}
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {cards.map((product) => (
                <div
                  key={product.id || product.slug || product.name}
                  className="gradient-border flex-shrink-0 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  style={{ width: 'min(360px, 84vw)' }}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetails(product.detailTarget)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openDetails(product.detailTarget)
                    }
                  }}
                >
                  <ProductImageCarousel images={product.carouselImages} alt={product.name} height={240} />

                  <div className="p-6">
                    <h4 className="mb-4" style={{ fontSize: '22px' }}>{product.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(product.keySpecs || []).map((spec) => (
                        <span key={spec} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--light-gray)', color: 'var(--charcoal)', fontWeight: 600 }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--dark-gray)', lineHeight: '1.6', marginBottom: '20px' }}>{product.description}</p>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          openDetails(product.detailTarget)
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border-2 transition-all hover:scale-105"
                        style={{ borderColor: 'var(--gradient-blue)', color: 'var(--gradient-blue)', fontWeight: 600, fontSize: '14px' }}
                      >
                        {t('featuredProducts.viewDetails')}
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          navigateTo('contact')
                        }}
                        style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {t('featuredProducts.requestQuote')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
