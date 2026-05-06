import { useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { buildProductCarouselImages } from '../components/shared/ProductImageCarousel.jsx'
import { useNavigation } from '../context/NavigationContext.jsx'
import { ChevronRight, PhoneCall, ArrowRight } from 'lucide-react'
import { publicService } from '../services/publicService.js'
import { useTranslation } from '../i18n/index.js'
import { useRuntimeTranslatedValue } from '../i18n/useRuntimeTranslatedValue.js'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="%236b7280">Machine image unavailable</text></svg>'

const flattenSpecs = (specGroups = []) =>
  (Array.isArray(specGroups) ? specGroups : [])
    .flatMap((group) => (Array.isArray(group?.items) ? group.items : []))
    .filter((item) => item?.label && item?.value)

const withImageFallback = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === 'true') return
  event.currentTarget.dataset.fallbackApplied = 'true'
  event.currentTarget.src = FALLBACK_IMAGE
}

export function ProductsPage() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const [rawProducts, setRawProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeImageByProduct, setActiveImageByProduct] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const products = useRuntimeTranslatedValue(rawProducts)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [productsRes] = await Promise.all([
          publicService.getProducts({ limit: 80 }),
        ])

        if (!active) return

        setRawProducts(productsRes.items || [])
      } catch (err) {
        if (!active) return
        setError(err?.message || t('common.error'))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [t])

  const cards = useMemo(
    () => (products || []).map((product) => ({
      ...product,
      detailTarget: product.id || product.slug || null,
      fullGallery: buildProductCarouselImages(product),
      flatSpecs: flattenSpecs(product.specifications),
      featureBullets: [
        ...(Array.isArray(product.keyFeatures) ? product.keyFeatures : []),
        ...(Array.isArray(product.features) ? product.features.map((item) => item?.title || item?.description).filter(Boolean) : []),
      ].slice(0, 8),
    })),
    [products]
  )

  const categories = useMemo(() => {
    const byCategory = new Map()
    cards.forEach((item) => {
      const categoryName = item.category || 'Embroidery Machine'
      byCategory.set(categoryName, (byCategory.get(categoryName) || 0) + 1)
    })

    return [
      { key: 'all', label: t('productsPage.allMachines'), count: cards.length },
      ...Array.from(byCategory.entries()).map(([label, count]) => ({ key: label, label, count })),
    ]
  }, [cards, t])

  const filteredCards = useMemo(
    () => cards.filter((item) => activeCategory === 'all' || item.category === activeCategory),
    [cards, activeCategory]
  )

  const openDetails = (target) => {
    if (!target) {
      navigateTo('products')
      return
    }
    navigateTo('product-detail', target)
  }

  const setActiveImage = (productId, index) => {
    setActiveImageByProduct((current) => ({ ...current, [productId]: index }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-10 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>{t('common.home')}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('productsPage.breadcrumb')}</span>
          </div>
          <h1 className="mb-4">{t('productsPage.title')}</h1>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)', maxWidth: 980 }}>
            {t('productsPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="pb-20" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[270px_1fr] gap-6">
          <aside className="bg-white rounded-xl shadow-sm border border-black/5 p-4 h-fit lg:sticky lg:top-[calc(var(--site-header-height)+16px)]">
            <p style={{ fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: '#6b7280', marginBottom: 10, fontWeight: 700 }}>
              {t('productsPage.categories')}
            </p>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className="w-full text-left px-3 py-2.5 rounded-lg border transition-colors"
                  style={{
                    borderColor: activeCategory === category.key ? 'var(--accent-orange)' : 'rgba(0,0,0,0.08)',
                    backgroundColor: activeCategory === category.key ? 'rgba(255,107,53,0.08)' : 'white',
                    color: 'var(--charcoal)',
                    fontWeight: activeCategory === category.key ? 700 : 500,
                  }}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-8">
            {loading && <p style={{ color: 'var(--dark-gray)' }}>{t('productsPage.loading')}</p>}
            {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}
            {!loading && !error && filteredCards.length === 0 && (
              <p style={{ color: 'var(--dark-gray)' }}>{t('productsPage.noProducts')}</p>
            )}

            {!loading && !error && filteredCards.map((product) => {
              const productId = product.id || product.slug
              const gallery = product.fullGallery.length > 0 ? product.fullGallery : [FALLBACK_IMAGE]
              const activeIndex = activeImageByProduct[productId] ?? 0
              const activeImage = gallery[activeIndex] || gallery[0]

              return (
                <article key={productId} className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 border-b bg-[#f7f7f7] flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl" style={{ fontWeight: 800, color: 'var(--charcoal)', lineHeight: 1.1 }}>
                      {product.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => navigateTo('contact')}
                      className="px-4 py-2 rounded-full border text-sm font-semibold"
                      style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)', backgroundColor: 'white' }}
                    >
                      <PhoneCall size={14} style={{ display: 'inline-block', marginRight: 6 }} /> {t('productsPage.requestCallback')}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 grid xl:grid-cols-[1.1fr_0.9fr] gap-5">
                    <div>
                      <div className="rounded-lg overflow-hidden border border-black/10 bg-[#f8fafc]" style={{ minHeight: 280 }}>
                        <img
                          src={activeImage}
                          alt={product.name}
                          onError={withImageFallback}
                          className="w-full h-full object-cover"
                          style={{ maxHeight: 410 }}
                        />
                      </div>

                      <div className="mt-4 flex gap-2 flex-wrap items-center">
                        {gallery.slice(0, 6).map((imageUrl, index) => (
                          <button
                            key={`${productId}-thumb-${index}`}
                            type="button"
                            onClick={() => setActiveImage(productId, index)}
                            className="w-[72px] h-[58px] rounded-md overflow-hidden border"
                            style={{ borderColor: index === activeIndex ? 'var(--accent-orange)' : 'rgba(0,0,0,0.14)' }}
                          >
                            <img src={imageUrl} alt={`${product.name} ${index + 1}`} onError={withImageFallback} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('contact')}
                        className="mt-4 px-8 py-2.5 rounded-full font-semibold border"
                        style={{ color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)', backgroundColor: 'white' }}
                      >
                        {t('productsPage.getBestQuote')}
                      </button>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-2 mb-3">
                        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--charcoal)' }}>{product.priceDisplay || t('productsPage.priceOnRequest')}</p>
                        <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>{product.priceNote || t('productsPage.getLatestPrice')}</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {product.flatSpecs.slice(0, 12).map((spec) => (
                          <div key={`${productId}-${spec.label}`} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-1 sm:gap-3 text-sm">
                            <span style={{ color: '#111827', fontWeight: 700 }}>{spec.label}</span>
                            <span style={{ color: '#111827' }}>{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      <p style={{ color: '#111827', fontSize: 15, lineHeight: 1.7, marginBottom: 10 }}>{product.description}</p>

                      {product.featureBullets.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1.5" style={{ color: '#111827', fontSize: 14 }}>
                          {product.featureBullets.slice(0, 7).map((bullet) => (
                            <li key={`${productId}-${bullet}`}>{bullet}</li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-5 flex gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openDetails(product.detailTarget)}
                          className="px-5 py-3 rounded-lg text-white font-semibold"
                          style={{ backgroundColor: 'var(--accent-orange)' }}
                        >
                          {t('productsPage.viewDetails')} <ArrowRight size={16} style={{ display: 'inline-block', marginLeft: 4 }} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('contact')}
                          className="px-5 py-3 rounded-lg font-semibold border"
                          style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
                        >
                          {t('productsPage.interested')}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
