import { Phone, MapPin, Clock } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { useTranslation } from '../../i18n/index.js'
import { SUPPORT_TEL_URL } from '../../constants/contact.js'

export function CTASection() {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--gradient-red) 0%, var(--gradient-blue) 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="mb-6" style={{ color: 'white' }}>{t('cta.title')}</h2>
          <p className="mb-12" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.95)', lineHeight: '1.6' }}>{t('cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button onClick={() => navigateTo('contact')} className="px-10 py-5 rounded-lg transition-all hover:scale-105 hover:shadow-2xl" style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '18px' }}>{t('cta.requestDemo')}</button>
            <a href={SUPPORT_TEL_URL} className="px-10 py-5 rounded-lg border-2 transition-all hover:scale-105 flex items-center gap-3" style={{ borderColor: 'white', color: 'white', fontWeight: 600, fontSize: '18px' }}>
              <Phone size={22} /> {t('cta.callUs')}
            </a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2"><MapPin size={20} style={{ color: 'rgba(255,255,255,0.9)' }} /><span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '16px' }}>{t('cta.showroom')}</span></div>
            <div className="flex items-center gap-2"><Clock size={20} style={{ color: 'rgba(255,255,255,0.9)' }} /><span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '16px' }}>{t('cta.hours')}</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
