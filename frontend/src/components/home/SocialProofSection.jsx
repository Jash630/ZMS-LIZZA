import { Award, Users, Zap, Headphones } from 'lucide-react'
import { useTranslation } from '../../i18n/index.js'

const STAT_ICONS = [Award, Users, Zap, Headphones]

export function SocialProofSection() {
  const { t } = useTranslation()
  const stats = Array.isArray(t('socialProof.stats', [])) ? t('socialProof.stats', []) : []

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--gradient-blue) 0%, var(--gradient-purple) 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4" style={{ color: 'white' }}>{t('socialProof.title')}</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>{t('socialProof.subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = STAT_ICONS[index] || Award
            return (
            <div key={`${stat?.label}-${index}`} className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center glow-effect" style={{ backgroundColor: 'rgba(255,107,53,0.2)', border: '2px solid var(--accent-orange)' }}>
                  <Icon size={36} style={{ color: 'var(--accent-orange)' }} strokeWidth={2} />
                </div>
              </div>
              <h2 className="glow-effect" style={{ color: 'white', fontSize: '56px', lineHeight: '1', fontWeight: 700 }}>{stat?.number}</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontWeight: 500 }}>{stat?.label}</p>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}
