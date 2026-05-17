import { ArrowRight, Headphones, Layers, Settings, Zap } from 'lucide-react'
import { AppLink } from '../shared/AppLink.jsx'
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
    <section className="py-14 sm:py-16 lg:py-20" style={{ background: 'radial-gradient(circle at 10% 10%, rgba(46,94,170,0.08) 0%, transparent 45%), linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-5xl mx-auto mb-10 lg:mb-12">
          <h2 className="mb-4">
            {t('whyChoose.title').includes('ZMS LIZZA') ? (
              <>
                {t('whyChoose.title').split('ZMS LIZZA')[0]}
                <br />
                <span style={{ color: 'var(--accent-orange)' }}>ZMS LIZZA</span>
                {t('whyChoose.title').split('ZMS LIZZA').slice(1).join('ZMS LIZZA')}
              </>
            ) : (
              t('whyChoose.title')
            )}
          </h2>
          <p className="mx-auto max-w-[920px]" style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--dark-gray)', lineHeight: 1.6 }}>
            {t('whyChoose.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 items-stretch">
          {features.map((feature, index) => {
            const meta = FEATURE_META[index] || FEATURE_META[0]
            const Icon = meta.Icon
            const serial = `0${index + 1}`.slice(-2)

            return (
            <article
              key={`${feature?.title}-${index}`}
              className="relative overflow-hidden rounded-2xl border p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex h-full min-h-[380px] flex-col"
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

              <div className="relative z-10 flex min-h-[92px] items-start justify-between gap-4 mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)` }}>
                  <Icon size={26} color="white" strokeWidth={2.2} />
                </div>
                <span className="shrink-0" style={{ fontSize: 12, fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', backgroundColor: 'rgba(15,23,42,0.04)', borderRadius: 999, padding: '6px 10px' }}>
                  {serial}
                </span>
              </div>

              <div className="relative z-10 flex flex-1 flex-col">
                <h4 className="mb-3" style={{ fontSize: 'clamp(20px, 2vw, 23px)', lineHeight: 1.22 }}>{feature?.title}</h4>
                <p style={{ fontSize: 15, color: 'var(--dark-gray)', lineHeight: 1.68 }}>{feature?.description}</p>

                <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ height: 4, flex: 1, borderRadius: 999, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}55)` }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>Trusted</span>
                </div>
              </div>
            </article>
          )})}
        </div>

        <div className="mt-10 flex justify-center">
          <AppLink
            page="products"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] px-6 sm:px-7 text-[15px] font-bold text-white no-underline transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--accent-orange)', boxShadow: '0 6px 20px rgba(255,107,53,0.24)' }}
          >
            {t('whyChoose.cta')} <ArrowRight size={17} />
          </AppLink>
        </div>
      </div>
    </section>
  )
}
