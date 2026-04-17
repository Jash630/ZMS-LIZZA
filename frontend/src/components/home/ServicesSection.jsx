import { Settings, GraduationCap, Wrench, ShieldCheck, CreditCard } from 'lucide-react'
import { useTranslation } from '../../i18n/index.js'

const SERVICE_META = [
  { Icon: Settings, color: 'var(--gradient-blue)' },
  { Icon: GraduationCap, color: 'var(--gradient-purple)' },
  { Icon: Wrench, color: 'var(--accent-orange)' },
  { Icon: ShieldCheck, color: 'var(--gradient-red)' },
  { Icon: CreditCard, color: 'var(--gradient-blue)' },
]

const IMG = 'https://images.unsplash.com/photo-1724475439756-675ec5ee4053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600'

export function ServicesSection() {
  const { t } = useTranslation()
  const services = Array.isArray(t('servicesHome.items', [])) ? t('servicesHome.items', []) : []

  return (
    <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="mb-4">{t('servicesHome.title')}</h2>
        </div>
        <div className="space-y-24">
          {services.map((item, index) => {
            const meta = SERVICE_META[index] || SERVICE_META[0]
            const Icon = meta.Icon
            const color = meta.color
            return (
            <div key={`${item?.title}-${index}`} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
              <div className={index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img src={IMG} alt={item?.title} className="w-full h-[280px] md:h-[400px] object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}22 0%, transparent 100%)` }} />
                </div>
              </div>
              <div className={index % 2 === 0 ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2'}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                  <Icon size={32} color="white" strokeWidth={2} />
                </div>
                <h3 className="mb-6">{item?.title}</h3>
                <p style={{ fontSize: '17px', color: 'var(--dark-gray)', lineHeight: '1.8', marginBottom: '24px' }}>{item?.description}</p>
                <span style={{ color, fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>{t('servicesHome.learnMore')} -&gt;</span>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}
