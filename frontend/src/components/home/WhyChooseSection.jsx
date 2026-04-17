import { Zap, Settings, Layers, Headphones } from 'lucide-react'
import { useTranslation } from '../../i18n/index.js'

const FEATURE_META = [
  { Icon: Zap, color: 'var(--accent-orange)' },
  { Icon: Settings, color: 'var(--gradient-blue)' },
  { Icon: Layers, color: 'var(--gradient-purple)' },
  { Icon: Headphones, color: 'var(--gradient-red)' },
]

export function WhyChooseSection() {
  const { t } = useTranslation()
  const features = Array.isArray(t('whyChoose.features', [])) ? t('whyChoose.features', []) : []

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">{t('whyChoose.title')}</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
            {t('whyChoose.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const meta = FEATURE_META[index] || FEATURE_META[0]
            const Icon = meta.Icon
            return (
            <div key={`${feature?.title}-${index}`} className="gradient-border bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
                <Icon size={32} color="white" strokeWidth={2} />
              </div>
              <h4 className="mb-3" style={{ fontSize: '20px' }}>{feature?.title}</h4>
              <p style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>{feature?.description}</p>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}
