import { useEffect, useState } from 'react'
import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { ChevronRight, Calendar, Download, Crosshair, Shield, Cpu, TrendingUp, Award, MapPin } from 'lucide-react'
import { publicService } from '../services/publicService.js'
import { useTranslation } from '../i18n/index.js'

const BROCHURE_MEDIA_KEYS = ['file_ony5he', 'file_cx6svd']

export function AboutPage() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const [brochure, setBrochure] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let active = true

    const loadBrochure = async () => {
      try {
        const response = await publicService.getMedia({ type: 'image', limit: 80 })
        if (!active) return
        const items = response.items || []
        const preferred = items.find((item) => {
          const name = String(item?.name || '').toLowerCase()
          const originalName = String(item?.originalName || '').toLowerCase()
          return BROCHURE_MEDIA_KEYS.some((key) => name === key.toLowerCase() || originalName === key.toLowerCase())
        })
        const match = preferred || items[0] || null
        setBrochure(match)
      } catch {
        if (!active) return
        setBrochure(null)
      }
    }

    loadBrochure()
    return () => {
      active = false
    }
  }, [])

  const downloadBrochure = async () => {
    if (downloading) return
    if (!brochure?.url) {
      window.alert(t('about.brochureUnavailable'))
      return
    }

    try {
      setDownloading(true)
      const response = await fetch(brochure.url)
      if (!response.ok) throw new Error('Unable to download brochure')

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = brochure.originalName || 'zms-lizza-brochure.jpg'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(brochure.url, '_blank', 'noopener,noreferrer')
    } finally {
      setDownloading(false)
    }
  }

  const milestones = Array.isArray(t('about.milestones', [])) ? t('about.milestones', []) : []

  const advantageIcons = [Crosshair, Shield, Cpu, TrendingUp, Award]
  const advantages = Array.isArray(t('about.advantages', [])) ? t('about.advantages', []) : []

  const locations = Array.isArray(t('about.locations', [])) ? t('about.locations', []) : []

  return (
    <div className="min-h-screen">
      <Header />
      <WhatsAppButton />

      <section className="relative min-h-[420px] md:min-h-[500px] flex items-center justify-center text-center" style={{ paddingTop: 'var(--site-header-height)' }}>
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1663888673897-f8bc14482f17?w=1200" alt="Factory" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.6))' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-6">
            <span className="cursor-pointer hover:text-white" onClick={() => navigateTo('home')}>{t('common.home')}</span>
            <ChevronRight size={14} />
            <span>{t('about.breadcrumb')}</span>
          </div>
          <h1 style={{ color: 'white' }}>{t('about.heroTitle')}<br />{t('about.heroTitle2')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', maxWidth: '700px', margin: '24px auto 0' }}>
            {t('about.heroSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <h2 className="mb-8">{t('about.whoWeAre')}</h2>
              <div className="space-y-6" style={{ color: 'var(--dark-gray)', fontSize: '17px', lineHeight: '1.8' }}>
                <p>{t('about.whoWeAreP1')}</p>
                <p>{t('about.whoWeAreP2')}</p>
                <p><strong style={{ color: 'var(--charcoal)' }}>{t('about.mission')}</strong> {t('about.missionText')}</p>
                <p><strong style={{ color: 'var(--charcoal)' }}>{t('about.vision')}</strong> {t('about.visionText')}</p>
                <p><strong style={{ color: 'var(--charcoal)' }}>{t('about.values')}</strong> {t('about.valuesText')}</p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h3 className="mb-8">{t('about.journey')}</h3>
              <div className="space-y-6 mb-10">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-purple), var(--gradient-blue))' }}>
                      {m.year.slice(2)}
                    </div>
                    <div className="pt-2">
                      <p style={{ fontWeight: 700, color: 'var(--charcoal)' }}>{m.year}</p>
                      <p style={{ color: 'var(--dark-gray)', fontSize: '15px' }}>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1666558889375-798fa96b559a?w=600" alt="Our team" className="w-full h-64 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-6">{t('about.europeanDifference')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {advantages.map((item, index) => {
              const Icon = advantageIcons[index] || Crosshair
              return (
              <div key={`${item?.title}-${index}`} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-blue))' }}>
                  <Icon size={32} color="white" strokeWidth={2} />
                </div>
                <h3 className="mb-4" style={{ fontSize: '18px' }}>{item?.title}</h3>
                <p style={{ color: 'var(--dark-gray)', fontSize: '14px', lineHeight: '1.6' }}>{item?.desc}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">{t('about.whereWeServe')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map(({ city, detail, radius }) => (
              <div key={city} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4" style={{ borderTopColor: 'var(--accent-orange)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={24} style={{ color: 'var(--accent-orange)' }} />
                  <h4 style={{ fontSize: '20px' }}>{city}</h4>
                </div>
                <p style={{ color: 'var(--dark-gray)', fontSize: '14px', marginBottom: '12px' }}>{detail}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(255,107,53,0.1)', color: 'var(--accent-orange)' }}>{radius}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-purple), var(--gradient-blue))' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 style={{ color: 'white' }} className="mb-6">{t('about.learnMore')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }} className="mb-12">{t('about.learnMoreSub')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigateTo('contact')} className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg hover:shadow-xl transition-all" style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600 }}>
              <Calendar size={20} /> {t('about.scheduleVisit')}
            </button>
            <button
              type="button"
              onClick={downloadBrochure}
              disabled={downloading}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg border-2 transition-all"
              style={{
                borderColor: 'white',
                color: 'white',
                opacity: downloading ? 0.7 : 1,
                cursor: downloading ? 'not-allowed' : 'pointer',
              }}
            >
              <Download size={20} /> {downloading ? t('about.downloading') : t('about.downloadBrochure')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
