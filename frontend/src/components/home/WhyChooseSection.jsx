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
    <section className="py-24" style={{ background: 'radial-gradient(circle at 10% 10%, rgba(46,94,170,0.08) 0%, transparent 45%), linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">{t('whyChoose.title')}</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
            {t('whyChoose.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const meta = FEATURE_META[index] || FEATURE_META[0]
            const Icon = meta.Icon
            const serial = `0${index + 1}`.slice(-2)

            return (
            <article
              key={`${feature?.title}-${index}`}
              className="relative overflow-hidden rounded-2xl border p-6 lg:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                borderColor: 'rgba(15, 23, 42, 0.10)',
                boxShadow: '0 14px 30px rgba(15,23,42,0.08)',
                background: 'linear-gradient(165deg, #ffffff 0%, #f4f8ff 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${meta.color}, ${meta.color}99)`,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '-34px',
                  right: '-34px',
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${meta.color}22 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${meta.color}10 0%, transparent 36%)`,
                  pointerEvents: 'none',
                }}
              />

              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
                  <Icon size={27} color="white" strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#64748b',
                    letterSpacing: '0.08em',
                    backgroundColor: 'rgba(15,23,42,0.04)',
                    borderRadius: 999,
                    padding: '6px 10px',
                  }}
                >
                  {serial}
                </span>
              </div>

              <h4 className="mb-3" style={{ fontSize: '22px', lineHeight: 1.25 }}>{feature?.title}</h4>
              <p style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.7' }}>{feature?.description}</p>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ height: 4, flex: 1, borderRadius: 999, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}55)` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>Trusted</span>
              </div>
            </article>
          )})}
        </div>
      </div>
    </section>
  )
}
