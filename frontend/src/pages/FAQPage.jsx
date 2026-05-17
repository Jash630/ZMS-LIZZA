import { useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { AppLink } from '../components/shared/AppLink.jsx'
import { ChevronRight, Plus, Minus } from 'lucide-react'
import { useTranslation } from '../i18n/index.js'

export function FAQPage() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState(0)
  const faqs = Array.isArray(t('faqPage.items', [])) ? t('faqPage.items', []) : []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-12 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <AppLink page="home" className="hover:text-[var(--accent-orange)]">{t('common.home')}</AppLink>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('faqPage.breadcrumb')}</span>
          </div>
          <h1 className="mb-4">{t('faqPage.title')}</h1>
          <p style={{ fontSize: 18, color: 'var(--dark-gray)', maxWidth: 980 }}>
            {t('faqPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 space-y-4">
          {faqs.map((faq, index) => {
            const open = openIndex === index
            return (
              <article key={faq.q} className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span style={{ color: open ? 'var(--accent-orange)' : 'var(--charcoal)', fontWeight: 700, fontSize: 16, lineHeight: 1.6 }}>{faq.q}</span>
                  <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: open ? 'var(--accent-orange)' : '#f3f4f6' }}>
                    {open ? <Minus size={18} color="white" /> : <Plus size={18} style={{ color: '#6b7280' }} />}
                  </span>
                </button>
                {open && (
                  <div className="px-6 pb-6">
                    <p style={{ color: 'var(--dark-gray)', fontSize: 15, lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
