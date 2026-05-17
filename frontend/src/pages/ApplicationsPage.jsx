import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { AppLink } from '../components/shared/AppLink.jsx'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../i18n/index.js'

export function ApplicationsPage() {
  const { t } = useTranslation()
  const items = Array.isArray(t('applicationsPage.items', [])) ? t('applicationsPage.items', []) : []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-12 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <AppLink page="home" className="hover:text-[var(--accent-orange)]">{t('common.home')}</AppLink>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('applicationsPage.breadcrumb')}</span>
          </div>
          <h1 className="mb-4">{t('applicationsPage.title')}</h1>
          <p style={{ fontSize: 18, color: 'var(--dark-gray)', maxWidth: 980 }}>
            {t('applicationsPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-5">
          {items.map((item) => (
            <article key={item} className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 flex gap-3">
              <CheckCircle2 size={20} style={{ color: 'var(--accent-orange)', flexShrink: 0, marginTop: 3 }} />
              <p style={{ color: '#111827', fontSize: 15, lineHeight: 1.8 }}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 text-center">
            <h2 className="mb-4">{t('applicationsPage.ctaTitle')}</h2>
            <p style={{ color: 'var(--dark-gray)', fontSize: 16, lineHeight: 1.8, maxWidth: 820, margin: '0 auto 24px' }}>
              {t('applicationsPage.ctaSubtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <AppLink page="products" className="px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: 'var(--accent-orange)' }}>
                {t('applicationsPage.browseProducts')}
              </AppLink>
              <AppLink page="contact" className="px-6 py-3 rounded-lg font-semibold border" style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}>
                {t('applicationsPage.requestQuote')}
              </AppLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
