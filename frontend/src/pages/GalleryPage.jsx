import { useEffect, useMemo, useState } from 'react'
import { Header }             from '../components/layout/Header.jsx'
import { Footer }             from '../components/layout/Footer.jsx'
import { WhatsAppButton }     from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }      from '../context/NavigationContext.jsx'
import { publicService }      from '../services/publicService.js'
import { ChevronRight, X }    from 'lucide-react'
import { useTranslation } from '../i18n/index.js'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F3F4F6"/><stop offset="100%" stop-color="%23E5E7EB"/></linearGradient></defs><rect width="800" height="560" fill="url(%23g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236B7280" font-family="Arial,sans-serif" font-size="28">Image unavailable</text></svg>'

const withImageFallback = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === 'true') return
  event.currentTarget.dataset.fallbackApplied = 'true'
  event.currentTarget.src = FALLBACK_IMAGE
}

const getYoutubeEmbedUrl = (rawUrl = '') => {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace('www.', '')
    let videoId = ''

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || ''
    } else if (['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || ''
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/live/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      }
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

const isYoutubeUrl = (url = '') => Boolean(getYoutubeEmbedUrl(url))

const isVideoMedia = (item) => {
  if (!item?.url) return false
  if (item.type === 'video') return true
  return isYoutubeUrl(item.url)
}
const fetchAllPublicMedia = async () => {
  const all = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const response = await publicService.getMedia({ page, limit: 60 })
    all.push(...(response.items || []))
    totalPages = response.meta?.totalPages || 1
    if (totalPages === 0) break
    page += 1
  }

  return all
}

export function GalleryPage() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const items = await fetchAllPublicMedia()
        if (!active) return
        const sorted = [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setMedia(sorted)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load gallery media.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const images = useMemo(() => media.filter((item) => item.type === 'image' && item.url), [media])
  const videos = useMemo(() => media.filter((item) => isVideoMedia(item)), [media])

  const showImages = activeFilter !== 'videos'
  const showVideos = activeFilter !== 'images'

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-12 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3.25rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>{t('common.home')}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('galleryPage.breadcrumb')}</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">{t('galleryPage.title')}</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>
              {t('galleryPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap gap-3 justify-center">
          {[
            { key: 'all', label: t('galleryPage.filters.all') },
            { key: 'images', label: t('galleryPage.filters.images') },
            { key: 'videos', label: t('galleryPage.filters.videos') },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: activeFilter === filter.key ? 'var(--accent-orange)' : 'white',
                color: activeFilter === filter.key ? 'white' : 'var(--dark-gray)',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-12">
          {loading && <p style={{ color: 'var(--dark-gray)' }}>{t('galleryPage.loading')}</p>}
          {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}

          {!loading && !error && showImages && (
            <div>
              <h2 className="mb-6" style={{ fontSize: '30px' }}>{t('galleryPage.imagesTitle')} ({images.length})</h2>
              {images.length === 0 && (
                <p style={{ color: 'var(--dark-gray)' }}>{t('galleryPage.noImages')}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                    style={{ height: 'clamp(170px, 36vw, 280px)' }}
                    onClick={() => setLightbox(img)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      onError={withImageFallback}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                      <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{img.alt || img.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && showVideos && (
            <div>
              <h2 className="mb-6" style={{ fontSize: '30px' }}>{t('galleryPage.videosTitle')} ({videos.length})</h2>
              {videos.length === 0 && (
                <p style={{ color: 'var(--dark-gray)' }}>{t('galleryPage.noVideos')}</p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                  const embedUrl = getYoutubeEmbedUrl(video.url)
                  return (
                    <article key={video.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                      <div className="w-full" style={{ aspectRatio: '16 / 9', backgroundColor: '#111827' }}>
                        {embedUrl ? (
                          <iframe
                            title={video.name || video.alt || 'YouTube video'}
                            src={embedUrl}
                            className="w-full h-full"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        ) : (
                          <video className="w-full h-full" src={video.url} controls preload="metadata" />
                        )}
                      </div>
                      <div className="p-4">
                        <p style={{ color: 'var(--charcoal)', fontWeight: 600 }}>{video.name || 'Video'}</p>
                        <p style={{ color: 'var(--dark-gray)', fontSize: '13px', marginTop: 6 }}>
                          {embedUrl ? t('galleryPage.youtubeEmbed') : t('galleryPage.directVideo')}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors" type="button">
            <X size={24} color="white" />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.url}
              alt={lightbox.alt}
              onError={withImageFallback}
              className="w-full rounded-2xl shadow-2xl"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
            <div className="mt-4 text-center">
              <p style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{lightbox.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{lightbox.alt}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

