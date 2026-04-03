import { Settings, GraduationCap, Wrench, ShieldCheck, CreditCard } from 'lucide-react'

const SERVICES = [
  { Icon: Settings,      title: 'Machine Installation & Setup',     description: 'Professional installation at your factory with complete testing and calibration. Our expert technicians ensure your machine is production-ready from day one.',  color: 'var(--gradient-blue)'   },
  { Icon: GraduationCap, title: 'On-Site Operator Training',        description: 'Comprehensive hands-on training for your team covering operation, maintenance basics, and troubleshooting to maximize productivity.',                          color: 'var(--gradient-purple)' },
  { Icon: Wrench,        title: 'Maintenance & Technical Support',  description: 'Regular maintenance and 24/7 technical support. Fast response times and genuine spare parts keep machines running at peak performance.',                       color: 'var(--accent-orange)'   },
  { Icon: ShieldCheck,   title: 'Warranty & After-Sales Service',   description: 'Comprehensive warranty coverage and dedicated after-sales support. We stand behind our machines with reliable service.',                                         color: 'var(--gradient-red)'    },
  { Icon: CreditCard,    title: 'EMI / Loan Assistance & Subsidies',description: 'Flexible financing options and assistance with government subsidy applications. Easy EMI plans to make your investment affordable.',                            color: 'var(--gradient-blue)'   },
]

const IMG = 'https://images.unsplash.com/photo-1724475439756-675ec5ee4053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600'

export function ServicesSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="mb-4">Complete Support Beyond the Machine</h2>
        </div>
        <div className="space-y-24">
          {SERVICES.map(({ Icon, title, description, color }, i) => (
            <div key={title} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
              <div className={i % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img src={IMG} alt={title} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}22 0%, transparent 100%)` }} />
                </div>
              </div>
              <div className={i % 2 === 0 ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2'}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                  <Icon size={32} color="white" strokeWidth={2} />
                </div>
                <h3 className="mb-6">{title}</h3>
                <p style={{ fontSize: '17px', color: 'var(--dark-gray)', lineHeight: '1.8', marginBottom: '24px' }}>{description}</p>
                <span style={{ color, fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>Learn More →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}