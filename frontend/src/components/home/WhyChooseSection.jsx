import { Zap, Settings, Layers, Headphones } from 'lucide-react'

const FEATURES = [
  { Icon: Zap,        title: 'High-Speed Performance',    description: 'Up to 1200 stitches per minute for maximum productivity',              color: 'var(--accent-orange)'   },
  { Icon: Settings,   title: 'European Technology',       description: 'Advanced control systems and superior build quality',                  color: 'var(--gradient-blue)'   },
  { Icon: Layers,     title: 'Multi-Function Capability', description: 'Sequins, beads, coding, and embroidery in one machine',               color: 'var(--gradient-purple)' },
  { Icon: Headphones, title: 'Complete Support',          description: 'Installation, training, maintenance, and fast technical support',      color: 'var(--gradient-red)'    },
]

export function WhyChooseSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Why Leading Factories Choose ZMS LIZZA</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>
            We deliver reliable European-technology machines that boost speed, quality, and profits.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ Icon, title, description, color }) => (
            <div key={title} className="gradient-border bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                <Icon size={32} color="white" strokeWidth={2} />
              </div>
              <h4 className="mb-3" style={{ fontSize: '20px' }}>{title}</h4>
              <p style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}