import { useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { buildProductCarouselImages } from '../components/shared/ProductImageCarousel.jsx'
import { useNavigation } from '../context/NavigationContext.jsx'
import { ChevronRight, PhoneCall, ArrowRight, PlayCircle } from 'lucide-react'
import { publicService } from '../services/publicService.js'

const PRODUCT_IMAGE_ALLOWLIST = new Set([
  'IMG-20250408-WA0012.jpg',
  'IMG-20250408-WA0013.jpg',
  'IMG-20250408-WA0014.jpg',
  'IMG-20250408-WA0015.jpg',
  'IMG-20250408-WA0017.jpg',
  'IMG-20250408-WA0018.jpg',
  'IMG-20250408-WA0019.jpg',
  '247.jpg',
  'file_cx6svd',
])

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="%236b7280">Machine image unavailable</text></svg>'

const isAllowedProductMedia = (item) => PRODUCT_IMAGE_ALLOWLIST.has(String(item?.originalName || item?.name || '').trim())

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
  const [allProducts, setAllProducts] = useState([])
  const [product, setProduct] = useState(null)
  const [mediaImages, setMediaImages] = useState([])
  const [videos, setVideos] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        const selectedFromList = productItems.find((item) => item.slug === productId || item.id === productId)
        let selectedProduct = selectedFromList || productItems[0] || null

        if (!selectedProduct && productId) {
          selectedProduct = await publicService.getProductBySlug(productId)
        }

        const rawImages = (mediaRes.items || []).filter((item) => item.type === 'image')
        const allowlisted = rawImages.filter(isAllowedProductMedia).map((item) => item.url).filter(Boolean)
        const imagePool = allowlisted.length > 0 ? allowlisted : rawImages.map((item) => item.url).filter(Boolean)

        const videoPool = (mediaRes.items || []).filter((item) => item.type === 'video' || getYoutubeVideoId(item.url)).slice(0, 6)

        setAllProducts(productItems)
        setProduct(selectedProduct)
        setMediaImages(imagePool)
        setVideos(videoPool)
        setActiveImageIndex(0)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load product details.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [productId])

  const groupedCategories = useMemo(() => {
    const groups = new Map()
    allProducts.forEach((item) => {
      const categoryName = item.category || 'Embroidery Machine'
      if (!groups.has(categoryName)) groups.set(categoryName, [])
      groups.get(categoryName).push(item)
    })
    return Array.from(groups.entries()).map(([category, items]) => ({ category, items }))
  }, [allProducts])

  const gallery = useMemo(() => {
    if (!product) return [FALLBACK_IMAGE]
    const merged = buildProductCarouselImages(product, mediaImages, { poolOnly: false })
    return merged.length > 0 ? merged : [FALLBACK_IMAGE]
  }, [product, mediaImages])

  const activeImage = gallery[activeImageIndex] || gallery[0]
  const flatSpecs = useMemo(() => flattenSpecs(product?.specifications || {}), [product?.specifications])

  const featureBullets = useMemo(
    () => [
      ...(Array.isArray(product?.keyFeatures) ? product.keyFeatures : []),
      ...(Array.isArray(product?.features)
        ? product.features.map((item) => item?.title || item?.description).filter(Boolean)
        : []),
    ],
    [product?.keyFeatures, product?.features]
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-8 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 2rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('products')}>Products</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{product?.name || 'Details'}</span>
          </div>
          <h1>{product?.category || 'Embroidery Machine'}</h1>
          <p style={{ fontSize: 17, color: 'var(--dark-gray)', marginTop: 8 }}>
            ZMS LIZZA by LIZZA INDIA PVT. LTD. offers reliable machine solutions for every production scale.
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
            {loading && <p style={{ color: 'var(--dark-gray)' }}>Loading product...</p>}
            {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}
            {!loading && !error && !product && <p style={{ color: 'var(--dark-gray)' }}>Product not found.</p>}

            {!loading && !error && product && (
              <>
                <article className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 border-b bg-[#f7f7f7] flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl" style={{ fontWeight: 800, color: 'var(--charcoal)', lineHeight: 1.08 }}>
                      {product.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => navigateTo('contact')}
                      className="px-4 py-2 rounded-full border text-sm font-semibold"
                      style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)', backgroundColor: 'white' }}
                    >
                      <PhoneCall size={14} style={{ display: 'inline-block', marginRight: 6 }} /> Request Callback
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 grid xl:grid-cols-[1.1fr_0.9fr] gap-5">
                    <div>
                      <div className="rounded-lg overflow-hidden border border-black/10 bg-[#f8fafc]">
                        <img
                          src={activeImage}
                          alt={product.name}
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
                        Get Best Quote
                      </button>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-2 mb-3">
                        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--charcoal)' }}>{product.priceDisplay || 'Price On Request'}</p>
                        <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>{product.priceNote || 'Get Latest Price'}</span>
                      </div>

                      {product.modelNo && (
                        <p style={{ color: '#374151', fontWeight: 600, marginBottom: 8 }}>Model: {product.modelNo}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        {flatSpecs.slice(0, 14).map((spec) => (
                          <div key={`${spec.group}-${spec.label}`} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-1 sm:gap-3 text-sm">
                            <span style={{ color: '#111827', fontWeight: 700 }}>{spec.label}</span>
                            <span style={{ color: '#111827' }}>{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      <p style={{ color: '#111827', fontSize: 15, lineHeight: 1.7, marginBottom: 10 }}>{product.description}</p>

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
                          Yes! I am Interested
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('products')}
                          className="px-5 py-3 rounded-lg font-semibold border"
                          style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
                        >
                          Back to All Products <ArrowRight size={16} style={{ display: 'inline-block', marginLeft: 4 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                {videos.length > 0 && (
                  <section className="bg-white rounded-xl shadow-sm border border-black/5 p-4 sm:p-5">
                    <h3 className="mb-4">Product Videos</h3>
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
                                Get Quote
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
