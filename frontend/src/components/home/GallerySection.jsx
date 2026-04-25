import { useEffect, useState } from 'react'
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { publicService } from '../../services/publicService.js'
import { useTranslation } from '../../i18n/index.js'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F3F4F6"/><stop offset="100%" stop-color="%23E5E7EB"/></linearGradient></defs><rect width="800" height="560" fill="url(%23g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236B7280" font-family="Arial,sans-serif" font-size="28">Image unavailable</text></svg>'

const HEIGHT_PRESETS = ['400px', '250px', '300px', '250px', '400px', '300px', '250px', '300px', '400px']

const withImageFallback = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === 'true') return
  event.currentTarget.dataset.fallbackApplied = 'true'
  event.currentTarget.src = FALLBACK_IMAGE
}

const fetchGalleryImages = async () => {
  const all = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const response = await publicService.getMedia({ page, limit: 60, type: 'image' })
    all.push(...(response.items || []))
    totalPages = response.meta?.totalPages || 1
    if (totalPages === 0) break
    page += 1
  }

  return all
}

export function GallerySection() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(null)
  const [images, setImages] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(null)

  const closeLightbox = () => setActiveImageIndex(null)

  const showPrev = () => {
    setActiveImageIndex((current) => {
      if (current === null || images.length === 0) return current
      return (current - 1 + images.length) % images.length
    })
  }

  const showNext = () => {
    setActiveImageIndex((current) => {
      if (current === null || images.length === 0) return current
      return (current + 1) % images.length
    })
  }

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const items = await fetchGalleryImages()
        if (!active) return
        const sorted = [...items]
          .filter((item) => item.url)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 9)
          .map((item, index) => ({
            id: item.id,
            url: item.url,
            caption: item.alt || item.name || 'Gallery image',
            height: HEIGHT_PRESETS[index % HEIGHT_PRESETS.length],
          }))
        setImages(sorted)
      } catch {
        if (!active) return
        setImages([])
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (activeImageIndex === null) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeImageIndex, images.length])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">{t('gallerySection.title')}</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
            {t('gallerySection.subtitle')}
          </p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {images.map((img, i) => (
              <div
                key={img.id || i}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{ height: img.height }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActiveImageIndex(i)}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  onError={withImageFallback}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 flex items-end p-6 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    opacity: hovered === i ? 1 : 0,
                  }}
                >
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-12 text-center" style={{ color: 'var(--dark-gray)' }}>
            {t('gallerySection.empty')}
          </p>
        )}

        <div className="text-center">
          <button
            onClick={() => navigateTo('gallery')}
            className="px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '16px' }}
          >
            {t('gallerySection.viewFull')} <ArrowRight size={20} />
          </button>
        </div>

        {activeImageIndex !== null && images[activeImageIndex] && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ backgroundColor: 'rgba(2,6,23,0.9)' }}
            onClick={closeLightbox}
          >
            <button
              type="button"
              aria-label="Close image preview"
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
            >
              <X size={22} />
            </button>

            {images.length > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation()
                  showPrev()
                }}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div className="max-w-[1100px] w-full" onClick={(event) => event.stopPropagation()}>
              <img
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].caption}
                onError={withImageFallback}
                className="w-full max-h-[78vh] object-contain rounded-xl"
              />
              <p className="mt-3 text-center" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                {images[activeImageIndex].caption}
              </p>
            </div>

            {images.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation()
                  showNext()
                }}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
