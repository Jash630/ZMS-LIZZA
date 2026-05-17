import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { AppLink } from '../components/shared/AppLink.jsx'
import { buildProductCarouselImages } from '../components/shared/ProductImageCarousel.jsx'
import { PRODUCT_CATEGORY_CONTENT } from '../content/seoContent.js'
import { publicService } from '../services/publicService.js'
import { useTranslation } from '../i18n/index.js'
import { getProductCategoryI18nKey, PRODUCT_CATEGORY_SLUGS } from '../utils/productCategoryI18n.js'

const FALLBACK_IMAGE = '/bgr_logo.png'

const flattenSpecs = (specifications = []) =>
  (Array.isArray(specifications) ? specifications : [])
    .flatMap((group) => (Array.isArray(group?.items) ? group.items : []))
    .filter((item) => item?.label && item?.value)

const categoryMatches = (product, slug) => {
  const category = String(product?.category || '').toLowerCase()
  const name = String(product?.name || '').toLowerCase()

  if (slug === 'computerized-embroidery-machines') return category.includes('computer') || name.includes('computer')
  if (slug === 'sequin-embroidery-machines') return category.includes('sequin') || name.includes('sequin')
  if (slug === 'bead-embroidery-machines') return category.includes('bead') || name.includes('bead')
  if (slug === 'coding-machines') return category.includes('coding') || name.includes('coding')
  if (slug === 'spare-parts') return category.includes('spare') || category.includes('accessor') || name.includes('spare')
  return false
}

const AutoRotatingImage = ({ gallery, alt, className }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!gallery || gallery.length < 2) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % gallery.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [gallery])

  const image = gallery?.[index] || FALLBACK_IMAGE
  return <img src={image} alt={alt} className={className} />
}

export function ProductCategoryPage({ slug }) {
  const { t } = useTranslation()
  const i18nKey = getProductCategoryI18nKey(slug)
  const page = i18nKey ? t(`productCategories.${i18nKey}`) : null
  const [products, setProducts] = useState([])
  const [mediaImages, setMediaImages] = useState([])
  const [loading, setLoading] = useState(true)

  const featureBullets = Array.isArray(t('productCategoryPage.featureBullets', []))
    ? t('productCategoryPage.featureBullets', [])
    : []

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [productsRes, mediaRes] = await Promise.all([
          publicService.getProducts({ limit: 80 }),
          publicService.getMedia({ type: 'image', limit: 80 }),
        ])
        if (!active) return
        setProducts(productsRes.items || [])
        setMediaImages((mediaRes.items || []).filter((item) => item && item.type !== 'video' && item.url).map((item) => item.url))
      } catch {
        if (!active) return
        setProducts([])
        setMediaImages([])
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [slug])

  const relatedProducts = useMemo(
    () => products.filter((product) => categoryMatches(product, slug)).slice(0, 6),
    [products, slug],
  )

  if (!page || !PRODUCT_CATEGORY_CONTENT[slug]) return null

  const specTable = Array.isArray(page.specTable) ? page.specTable : []
  const applications = Array.isArray(page.applications) ? page.applications : []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-10 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <AppLink page="home" className="hover:text-[var(--accent-orange)]">{t('common.home')}</AppLink>
            <ChevronRight size={14} />
            <AppLink page="products" className="hover:text-[var(--accent-orange)]">{t('productCategoryPage.productsBreadcrumb')}</AppLink>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--charcoal)', fontWeight: 600 }}>{page.h1}</span>
          </div>
          <h1 className="mb-4">{page.h1}</h1>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)', maxWidth: 980 }}>{page.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AppLink
              page="contact"
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: 'var(--accent-orange)' }}
            >
              {t('productCategoryPage.getQuote')}
            </AppLink>
            <AppLink
              page="faq"
              className="px-6 py-3 rounded-lg font-semibold border"
              style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
            >
              {t('productCategoryPage.compareSpecs')}
            </AppLink>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <h2 className="mb-4">{page.h2Features}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {featureBullets.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-black/5 p-4 bg-[#fafafa]">
                    <CheckCircle2 size={18} style={{ color: 'var(--accent-orange)', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ color: '#111827', fontSize: 14, lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {specTable.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                <h2 className="mb-4">{page.h2Specs}</h2>
                <div className="overflow-hidden rounded-xl border border-black/10">
                  <table className="w-full text-sm">
                    <tbody>
                      {specTable.map((row, index) => (
                        <tr key={row.label} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td className="px-4 py-3 font-bold" style={{ color: '#111827', width: '30%' }}>{row.label}</td>
                          <td className="px-4 py-3" style={{ color: '#374151' }}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <h2 className="mb-4">{page.h2Applications}</h2>
              <div className="flex flex-wrap gap-3">
                {applications.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: 'rgba(255,107,53,0.08)', color: 'var(--accent-orange)' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2>{page.h2Models}</h2>
                <AppLink page="blog" className="text-sm font-semibold" style={{ color: 'var(--accent-orange)' }}>
                  {t('productCategoryPage.exploreBlog')} <ArrowRight size={14} style={{ display: 'inline-block', marginLeft: 4 }} />
                </AppLink>
              </div>

              {loading && <p style={{ color: 'var(--dark-gray)' }}>{t('productCategoryPage.loadingModels')}</p>}

              <div className="grid md:grid-cols-2 gap-4">
                {relatedProducts.map((product) => {
                  const specs = flattenSpecs(product.specifications).slice(0, 4)
                  const gallery = buildProductCarouselImages(product, mediaImages, { includePool: true })

                  return (
                    <article key={product.id || product.slug} className="rounded-xl border border-black/10 overflow-hidden">
                      <AutoRotatingImage gallery={gallery.length > 0 ? gallery : [FALLBACK_IMAGE]} alt={product.name} className="w-full h-52 object-cover bg-[#f8fafc]" />
                      <div className="p-4">
                        <h3 style={{ fontSize: 22, marginBottom: 8 }}>{product.name}</h3>
                        <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>{product.description}</p>
                        <div className="space-y-1.5 mb-4">
                          {specs.map((spec) => (
                            <div key={`${product.slug}-${spec.label}`} className="flex justify-between gap-4 text-sm">
                              <span style={{ fontWeight: 700, color: '#111827' }}>{spec.label}</span>
                              <span style={{ color: '#374151', textAlign: 'right' }}>{spec.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <AppLink
                            page="product-detail"
                            id={product.slug || product.id}
                            className="px-4 py-2 rounded-lg text-white font-semibold"
                            style={{ backgroundColor: 'var(--accent-orange)' }}
                          >
                            {t('productCategoryPage.viewDetails')}
                          </AppLink>
                          <AppLink
                            page="contact"
                            className="px-4 py-2 rounded-lg font-semibold border"
                            style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
                          >
                            {t('productCategoryPage.askPrice')}
                          </AppLink>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
              <h3 className="mb-1">{t('productCategoryPage.sidebarGuidesTitle')}</h3>
              <p style={{ color: 'var(--dark-gray)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
                {t('productCategoryPage.sidebarGuidesDesc')}
              </p>
              <div className="space-y-2">
                {PRODUCT_CATEGORY_SLUGS.map((categorySlug) => {
                  const key = getProductCategoryI18nKey(categorySlug)
                  const label = key ? t(`productCategories.${key}.h1`) : categorySlug
                  return (
                    <AppLink
                      key={categorySlug}
                      page="product-category"
                      id={categorySlug}
                      className="block rounded-lg border px-3 py-2 text-sm font-medium"
                      style={{
                        borderColor: categorySlug === slug ? 'var(--accent-orange)' : 'rgba(0,0,0,0.08)',
                        backgroundColor: categorySlug === slug ? 'rgba(255,107,53,0.08)' : '#fff',
                        color: '#111827',
                      }}
                    >
                      {label}
                    </AppLink>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
              <h3 className="mb-3">{t('productCategoryPage.needQuoteTitle')}</h3>
              <p style={{ color: 'var(--dark-gray)', fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                {t('productCategoryPage.needQuoteDesc')}
              </p>
              <AppLink
                page="contact"
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: 'var(--accent-orange)' }}
              >
                <PhoneCall size={16} style={{ marginRight: 8 }} /> {t('productCategoryPage.requestQuote')}
              </AppLink>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  )
}
