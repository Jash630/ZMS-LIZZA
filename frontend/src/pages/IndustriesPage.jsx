import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { AppLink } from '../components/shared/AppLink.jsx'
import { ChevronRight, Building2, Home } from 'lucide-react'
import { useTranslation } from '../i18n/index.js'

const ICONS = [Building2, Home]

export function IndustriesPage() {
  const { t } = useTranslation()
  const sections = Array.isArray(t('industriesPage.sections', [])) ? t('industriesPage.sections', []) : []
  const tags = t('industriesPage.tags', {}) || {}

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-12 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <AppLink page="home" className="hover:text-[var(--accent-orange)]">{t('common.home')}</AppLink>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('industriesPage.breadcrumb')}</span>
          </div>
          <h1 className="mb-4">{t('industriesPage.title')}</h1>
          <p style={{ fontSize: 18, color: 'var(--dark-gray)', maxWidth: 980 }}>
            {t('industriesPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const Icon = ICONS[index] || Building2
            return (
              <article key={section.title} className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-blue))' }}>
                  <Icon size={28} color="white" />
                </div>
                <h2 className="mb-3">{section.title}</h2>
                <p style={{ color: 'var(--dark-gray)', fontSize: 15, lineHeight: 1.8 }}>{section.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="mb-4">{t('industriesPage.categoriesTitle')}</h2>
          <p style={{ color: 'var(--dark-gray)', fontSize: 16, maxWidth: 760, margin: '0 auto 24px' }}>
            {t('industriesPage.categoriesSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <AppLink page="product-category" id="computerized-embroidery-machines" className="px-4 py-2 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,107,53,0.08)', color: 'var(--accent-orange)' }}>{tags.computerized}</AppLink>
            <AppLink page="product-category" id="sequin-embroidery-machines" className="px-4 py-2 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,107,53,0.08)', color: 'var(--accent-orange)' }}>{tags.sequin}</AppLink>
            <AppLink page="product-category" id="bead-embroidery-machines" className="px-4 py-2 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,107,53,0.08)', color: 'var(--accent-orange)' }}>{tags.bead}</AppLink>
            <AppLink page="product-category" id="coding-machines" className="px-4 py-2 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,107,53,0.08)', color: 'var(--accent-orange)' }}>{tags.coding}</AppLink>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}