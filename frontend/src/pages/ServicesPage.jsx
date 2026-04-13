import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { Settings, GraduationCap, Wrench, ShieldCheck, CreditCard, CheckCircle, ChevronRight } from 'lucide-react'

const SERVICES = [
  { Icon: Settings,      title: 'Machine Installation & Setup',    color: 'var(--gradient-blue)',   items: ['Professional on-site installation', 'Complete testing and calibration', 'Production-ready from day one', '1-2 day installation timeline'] },
  { Icon: GraduationCap, title: 'On-Site Operator Training',       color: 'var(--gradient-purple)', items: ['Comprehensive 2-day training', 'Hands-on machine operation', 'Maintenance basics covered', 'Troubleshooting techniques'] },
  { Icon: Wrench,        title: 'Maintenance & Technical Support', color: 'var(--accent-orange)',   items: ['Regular preventive maintenance', '24/7 technical support', 'Fast response times', 'Genuine spare parts available'] },
  { Icon: ShieldCheck,   title: 'Warranty & After-Sales Service',  color: 'var(--gradient-red)',    items: ['2-year comprehensive warranty', 'Dedicated service team', 'Replacement parts ready', 'Annual maintenance contract'] },
  { Icon: CreditCard,    title: 'EMI / Loan & Subsidy Assistance', color: 'var(--gradient-blue)',   items: ['0.99% per month EMI plans', 'TUFS subsidy guidance', 'MSME scheme documentation', 'Bank loan assistance'] },
]

export function ServicesPage() {
  const { navigateTo } = useNavigation()
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pb-16 bg-white" style={{ paddingTop: 'calc(var(--site-header-height) + 3.25rem)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>Services</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Complete Support Beyond the Machine</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>From installation to ongoing maintenance — we're with you every step of the way</p>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map(({ Icon, title, color, items }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4" style={{ borderTopColor: color }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${color}, var(--gradient-purple))` }}>
                  <Icon size={32} color="white" strokeWidth={2} />
                </div>
                <h3 className="mb-6" style={{ fontSize: '22px' }}>{title}</h3>
                <ul className="space-y-3 mb-8">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} style={{ color, flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--dark-gray)', fontSize: '15px', lineHeight: '1.5' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigateTo('contact')} className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-purple), var(--gradient-blue))' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 style={{ color: 'white' }} className="mb-6">Ready to Experience Complete Support?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }} className="mb-10">Contact us today to discuss your service requirements</p>
          <button onClick={() => navigateTo('contact')} className="px-10 py-5 rounded-lg font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
            Contact Us
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
