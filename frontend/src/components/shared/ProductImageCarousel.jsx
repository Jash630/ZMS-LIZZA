import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F3F4F6"/><stop offset="100%" stop-color="%23E5E7EB"/></linearGradient></defs><rect width="800" height="560" fill="url(%23g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236B7280" font-family="Arial,sans-serif" font-size="26">Image unavailable</text></svg>'

export const buildProductCarouselImages = (product, recentMediaImages = [], options = {}) => {
  const pool = Array.isArray(recentMediaImages) ? recentMediaImages.filter(Boolean) : []
  if (options.poolOnly && pool.length > 0) return pool.slice(0, 10)

  const baseImages = [product?.image, ...(Array.isArray(product?.galleryImages) ? product.galleryImages : [])]
  return Array.from(new Set([...baseImages, ...pool].filter(Boolean))).slice(0, 10)
}

const withImageFallback = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === 'true') return
  event.currentTarget.dataset.fallbackApplied = 'true'
  event.currentTarget.src = FALLBACK_IMAGE
}

export function ProductImageCarousel({ images = [], alt = 'Product image', height = 260, className = '', roundedClass = 'rounded-t-2xl' }) {
  const slides = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const goNext = (event) => {
    event?.stopPropagation?.()
    if (slides.length < 2) return
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  const goPrev = (event) => {
    event?.stopPropagation?.()
    if (slides.length < 2) return
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (!slides.length) {
    return (
      <div className={`relative overflow-hidden ${roundedClass} ${className}`} style={{ height }}>
        <img src={FALLBACK_IMAGE} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${roundedClass} ${className}`} style={{ height }}>
      <img src={slides[activeIndex]} alt={alt} onError={withImageFallback} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 items-center justify-center shadow"
          >
            <ChevronLeft size={16} style={{ color: 'var(--charcoal)' }} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 items-center justify-center shadow"
          >
            <ChevronRight size={16} style={{ color: 'var(--charcoal)' }} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" onClick={(event) => event.stopPropagation()}>
            {slides.slice(0, 6).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: activeIndex === index ? 'white' : 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

