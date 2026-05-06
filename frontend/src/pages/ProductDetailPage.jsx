import { useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { buildProductCarouselImages } from '../components/shared/ProductImageCarousel.jsx'
import { useNavigation } from '../context/NavigationContext.jsx'
import { ChevronRight, PhoneCall, ArrowRight, PlayCircle } from 'lucide-react'
import { publicService } from '../services/publicService.js'
import { useTranslation } from '../i18n/index.js'
import { useRuntimeTranslatedValue } from '../i18n/useRuntimeTranslatedValue.js'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="%236b7280">Machine image unavailable</text></svg>'

const flattenSpecs = (specSource = {}) => {
  if (Array.isArray(specSource)) {
    return specSource
      .flatMap((group) => (Array.isArray(group?.items) ? group.items.map((item) => ({ ...item, group: group.category || 'Specifications' })) : []))
      .filter((item) => item?.label && item?.value)
  }

  return Object.entries(specSource)
    .flatMap(([group, items]) => (Array.isArray(items) ? items.map((item) => ({ ...item, group })) : []))
    .filter((item) => item?.label && item?.value)
}

const withImageFallback = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === 'true') return
  event.currentTarget.dataset.fallbackApplied = 'true'
  event.currentTarget.src = FALLBACK_IMAGE
}

const getYoutubeVideoId = (rawUrl = '') => {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace('www.', '')
    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }
    if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || ''
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/')[2] || ''
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/')[2] || ''
    }
    return ''
  } catch {
    return ''
  }
}

export function ProductDetailPage({ productId }) {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const [allProducts, setAllProducts] = useState([])
  const [product, setProduct] = useState(null)
  const [videos, setVideos] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const translatedProducts = useRuntimeTranslatedValue(allProducts)
  const translatedProduct = useRuntimeTranslatedValue(product)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [productsRes, mediaRes] = await Promise.all([
          publicService.getProducts({ limit: 120 }),
          publicService.getMedia({ limit: 160 }),
        ])

        if (!active) return

        const productItems = productsRes.items || []
        const fallbackProduct = productItems.find((item) => item.slug === productId || item.id === productId) || productItems[0] || null
        const selectedIdentifier = productId || fallbackProduct?.slug || fallbackProduct?.id || null
        const selectedProduct = selectedIdentifier ? await publicService.getProductBySlug(selectedIdentifier) : fallbackProduct

        const videoPool = (mediaRes.items || []).filter((item) => item.type === 'video' || getYoutubeVideoId(item.url)).slice(0, 6)

        setAllProducts(productItems)
        setProduct(selectedProduct)
        setVideos(videoPool)
        setActiveImageIndex(0)
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
  }, [productId, t])

  const groupedCategories = useMemo(() => {
    const groups = new Map()
    translatedProducts.forEach((item) => {
      const categoryName = item.category || 'Embroidery Machine'
      if (!groups.has(categoryName)) groups.set(categoryName, [])
      groups.get(categoryName).push(item)
    })
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }))
  }, [translatedProducts])

  const gallery = useMemo(() => {
    if (!translatedProduct) return [FALLBACK_IMAGE]
    const merged = buildProductCarouselImages(translatedProduct)
    return merged.length > 0 ? merged : [FALLBACK_IMAGE]
  }, [translatedProduct])

  const activeImage = gallery[activeImageIndex] || gallery[0]
  const flatSpecs = useMemo(() => flattenSpecs(translatedProduct?.specifications || {}), [translatedProduct?.specifications])

  const featureBullets = useMemo(
    () => [
      ...(Array.isArray(translatedProduct?.keyFeatures) ? translatedProduct.keyFeatures : []),
      ...(Array.isArray(translatedProduct?.features)
        ? translatedProduct.features.map((item) => item?.title || item?.description).filter(Boolean)
        : []),
    ],
    [translatedProduct?.keyFeatures, translatedProduct?.features]
  )

  const productFeatures = Array.isArray(translatedProduct?.features) ? translatedProduct.features.filter((item) => item?.title || item?.description) : []
  const applications = Array.isArray(translatedProduct?.applications) ? translatedProduct.applications.filter(Boolean) : []
  const packageIncludes = Array.isArray(translatedProduct?.packageIncludes) ? translatedProduct.packageIncludes.filter((item) => item?.title || (Array.isArray(item?.items) && item.items.length > 0)) : []
  const faqs = Array.isArray(translatedProduct?.faqs) ? translatedProduct.faqs.filter((item) => item?.q && item?.a) : []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-8 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 2rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>{t('common.home')}</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('products')}>{t('productsPage.breadcrumb')}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{translatedProduct?.name || t('productDetail.breadcrumb')}</span>
          </div>
          <h1>{translatedProduct?.category || 'Embroidery Machine'}</h1>
          <p style={{ fontSize: 17, color: 'var(--dark-gray)', marginTop: 8 }}>
            {t('productDetail.subtitle')}
          </p>
        </div>
      </section>

      <section className="pb-20" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-xl shadow-sm border border-black/5 p-4 h-fit lg:sticky lg:top-[calc(var(--site-header-height)+16px)]">
            {groupedCategories.map((group) => (
              <div key={group.category} className="mb-4">
                <p style={{ fontWeight: 800, color: 'var(--charcoal)', marginBottom: 8 }}>{group.category} ({group.items.length})</p>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id || item.slug}
                      type="button"
                      onClick={() => navigateTo('product-detail', item.slug || item.id)}
                      className="w-full text-left px-3 py-2 rounded-lg border text-sm"
                      style={{
                        borderColor: product?.slug === item.slug ? 'var(--accent-orange)' : 'rgba(0,0,0,0.08)',
                        backgroundColor: product?.slug === item.slug ? 'rgba(255,107,53,0.08)' : 'white',
                        color: '#111827',
                        fontWeight: product?.slug === item.slug ? 700 : 500,
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div className="space-y-6">
            {loading && <p style={{ color: 'var(--dark-gray)' }}>{t('productDetail.loading')}</p>}
            {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}
            {!loading && !error && !translatedProduct && <p style={{ color: 'var(--dark-gray)' }}>{t('productDetail.notFound')}</p>}

            {!loading && !error && translatedProduct && (
              <>
                <article className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 border-b bg-[#f7f7f7] flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl" style={{ fontWeight: 800, color: 'var(--charcoal)', lineHeight: 1.08 }}>
                      {translatedProduct.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => navigateTo('contact')}
                      className="px-4 py-2 rounded-full border text-sm font-semibold"
                      style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)', backgroundColor: 'white' }}
                    >
                      <PhoneCall size={14} style={{ display: 'inline-block', marginRight: 6 }} /> {t('productDetail.requestCallback')}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 grid xl:grid-cols-[1.1fr_0.9fr] gap-5">
                    <div>
                      <div className="rounded-lg overflow-hidden border border-black/10 bg-[#f8fafc]">
                        <img
                          src={activeImage}
                          alt={translatedProduct.name}
                          onError={withImageFallback}
                          className="w-full h-full object-cover"
                          style={{ maxHeight: 430 }}
                        />
                      </div>

                      <div className="mt-4 flex gap-2 flex-wrap items-center">
                        {gallery.slice(0, 8).map((imageUrl, index) => (
                          <button
                            key={`detail-thumb-${index}`}
                            type="button"
                            onClick={() => setActiveImageIndex(index)}
                            className="w-[72px] h-[58px] rounded-md overflow-hidden border"
                            style={{ borderColor: index === activeImageIndex ? 'var(--accent-orange)' : 'rgba(0,0,0,0.14)' }}
                          >
                            <img src={imageUrl} alt={`${translatedProduct.name} ${index + 1}`} onError={withImageFallback} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('contact')}
                        className="mt-4 px-8 py-2.5 rounded-full font-semibold border"
                        style={{ color: 'var(--accent-orange)', borderColor: 'var(--accent-orange)', backgroundColor: 'white' }}
                      >
                        {t('productDetail.getBestQuote')}
                      </button>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-2 mb-3">
                        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--charcoal)' }}>{translatedProduct.priceDisplay || t('productDetail.priceOnRequest')}</p>
                        <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>{translatedProduct.priceNote || t('productDetail.getLatestPrice')}</span>
                      </div>

                      {translatedProduct.modelNo && (
                        <p style={{ color: '#374151', fontWeight: 600, marginBottom: 8 }}>{t('productDetail.model')}: {translatedProduct.modelNo}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        {flatSpecs.slice(0, 14).map((spec) => (
                          <div key={`${spec.group}-${spec.label}`} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-1 sm:gap-3 text-sm">
                            <span style={{ color: '#111827', fontWeight: 700 }}>{spec.label}</span>
                            <span style={{ color: '#111827' }}>{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      <p style={{ color: '#111827', fontSize: 15, lineHeight: 1.7, marginBottom: 10 }}>{translatedProduct.description}</p>

                      {featureBullets.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1.5" style={{ color: '#111827', fontSize: 14 }}>
                          {featureBullets.slice(0, 18).map((bullet, index) => (
                            <li key={`${index}-${bullet}`}>{bullet}</li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-5 flex gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => navigateTo('contact')}
                          className="px-5 py-3 rounded-lg text-white font-semibold"
                          style={{ backgroundColor: 'var(--accent-orange)' }}
                        >
                          {t('productDetail.interested')}
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('products')}
                          className="px-5 py-3 rounded-lg font-semibold border"
                          style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
                        >
                          {t('productDetail.backToAll')} <ArrowRight size={16} style={{ display: 'inline-block', marginLeft: 4 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                {(productFeatures.length > 0 || applications.length > 0 || packageIncludes.length > 0 || faqs.length > 0) && (
                  <section className="grid gap-6">
                    {productFeatures.length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                        <h3 className="mb-4">Feature Highlights</h3>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {productFeatures.map((feature, index) => (
                            <article key={`${feature.title || 'feature'}-${index}`} className="rounded-lg border border-black/10 bg-[#fafafa] p-4">
                              <p style={{ fontWeight: 800, color: '#111827', marginBottom: 8 }}>{feature.title || `Feature ${index + 1}`}</p>
                              {feature.benefit && <p style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{feature.benefit}</p>}
                              {feature.description && <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.65 }}>{feature.description}</p>}
                            </article>
                          ))}
                        </div>
                      </div>
                    )}

                    {applications.length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                        <h3 className="mb-4">Applications</h3>
                        <div className="flex flex-wrap gap-2">
                          {applications.map((application) => (
                            <span
                              key={application}
                              className="px-3 py-2 rounded-full text-sm font-semibold"
                              style={{ backgroundColor: 'rgba(255,107,53,0.08)', color: 'var(--accent-orange)' }}
                            >
                              {application}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {packageIncludes.length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                        <h3 className="mb-4">Package Includes</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {packageIncludes.map((group, index) => (
                            <article key={`${group.title || 'package'}-${index}`} className="rounded-lg border border-black/10 bg-[#fafafa] p-4">
                              <p style={{ fontWeight: 800, color: '#111827', marginBottom: 10 }}>{group.title || 'Included'}</p>
                              <ul className="list-disc pl-5 space-y-1.5" style={{ color: '#374151', fontSize: 14 }}>
                                {(Array.isArray(group.items) ? group.items : []).filter(Boolean).map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </article>
                          ))}
                        </div>
                      </div>
                    )}

                    {faqs.length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                        <h3 className="mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                          {faqs.map((faq, index) => (
                            <article key={`${faq.q}-${index}`} className="rounded-lg border border-black/10 bg-[#fafafa] p-4">
                              <p style={{ fontWeight: 800, color: '#111827', marginBottom: 8 }}>{faq.q}</p>
                              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</p>
                            </article>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {videos.length > 0 && (
                  <section className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                    <h3 className="mb-4">{t('productDetail.productVideos')}</h3>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {videos.slice(0, 3).map((video) => {
                        const youtubeId = getYoutubeVideoId(video.url)
                        const thumbnail = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null

                        return (
                          <article key={video.id} className="rounded-lg overflow-hidden border border-black/10 bg-white">
                            <div className="relative" style={{ aspectRatio: '16 / 9', backgroundColor: '#111827' }}>
                              {thumbnail ? (
                                <img src={thumbnail} alt={video.name || 'Video'} className="w-full h-full object-cover" />
                              ) : (
                                <video src={video.url} className="w-full h-full object-cover" />
                              )}
                              <a
                                href={youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : video.url}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.12))' }}
                              >
                                <PlayCircle size={56} color="white" />
                              </a>
                            </div>
                            <div className="p-3">
                              <p style={{ fontWeight: 700, color: '#111827' }}>{video.name || 'Product Video'}</p>
                              <button
                                type="button"
                                onClick={() => navigateTo('contact')}
                                className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ backgroundColor: 'var(--accent-orange)' }}
                              >
                                {t('productDetail.getQuote')}
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
