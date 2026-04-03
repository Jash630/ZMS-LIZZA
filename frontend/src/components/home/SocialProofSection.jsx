import { Award, Users, Zap, Headphones } from 'lucide-react'

const STATS = [
  { Icon: Award,      number: '5+',   label: 'Years Experience'    },
  { Icon: Users,      number: '100+', label: 'Happy Customers'     },
  { Icon: Zap,        number: '1200', label: 'SPM Maximum Speed'   },
  { Icon: Headphones, number: '24/7', label: 'Support Available'   },
]

export function SocialProofSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--gradient-blue) 0%, var(--gradient-purple) 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4" style={{ color: 'white' }}>Trusted by Leading Textile Manufacturers</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>Factories across Surat, Ahmedabad, Mumbai, and beyond rely on our machines daily</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ Icon, number, label }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center glow-effect" style={{ backgroundColor: 'rgba(255,107,53,0.2)', border: '2px solid var(--accent-orange)' }}>
                  <Icon size={36} style={{ color: 'var(--accent-orange)' }} strokeWidth={2} />
                </div>
              </div>
              <h2 className="glow-effect" style={{ color: 'white', fontSize: '56px', lineHeight: '1', fontWeight: 700 }}>{number}</h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}