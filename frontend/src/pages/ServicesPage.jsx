import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { Settings, GraduationCap, Wrench, ShieldCheck, CreditCard, CheckCircle, ChevronRight } from 'lucide-react'
import { useTranslation } from '../i18n/index.js'

const SERVICE_ICONS = [Settings, GraduationCap, Wrench, ShieldCheck, CreditCard]
const SERVICE_COLORS = ['var(--gradient-blue)', 'var(--gradient-purple)', 'var(--accent-orange)', 'var(--gradient-red)', 'var(--gradient-blue)']

export function ServicesPage() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const services = Array.isArray(t('servicesPage.items', [])) ? t('servicesPage.items', []) : []

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-16 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3.25rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>{t('common.home')}</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{t('servicesPage.breadcrumb')}</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">{t('servicesPage.title')}</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>{t('servicesPage.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = SERVICE_ICONS[index] || Settings
              const color = SERVICE_COLORS[index] || 'var(--gradient-blue)'
              return (
              <div key={`${service?.title}-${index}`} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4" style={{ borderTopColor: color }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${color}, var(--gradient-purple))` }}>
                  <Icon size={32} color="white" strokeWidth={2} />
                </div>
                <h3 className="mb-6" style={{ fontSize: '22px' }}>{service?.title}</h3>
                <ul className="space-y-3 mb-8">
                  {(service?.items || []).map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} style={{ color, flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--dark-gray)', fontSize: '15px', lineHeight: '1.5' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigateTo('contact')} className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                  {t('servicesPage.learnMore')}
                </button>
              </div>
            )})}
          </div>
        </div>
      </section>

      <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-purple), var(--gradient-blue))' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 style={{ color: 'white' }} className="mb-6">{t('servicesPage.ctaTitle')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }} className="mb-10">{t('servicesPage.ctaSub')}</p>
          <button onClick={() => navigateTo('contact')} className="px-10 py-5 rounded-lg font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
            {t('servicesPage.contactUs')}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
