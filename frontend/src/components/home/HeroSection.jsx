import { Phone, Award, Users, Shield, ArrowRight, Star, Zap } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

const BADGES = [
  { Icon: Award, label: '5+ Years' },
  { Icon: Users, label: '100+ Factories' },
  { Icon: Shield, label: 'European Quality' },
]

const STATS = [
  {
    key: 'speed',
    title: '1200 SPM',
    subtitle: 'Max Speed',
    accent: 'var(--accent-orange)',
    position: 'top-3 left-0 -translate-x-2 sm:-translate-x-4',
  },
  {
    key: 'warranty',
    title: '2-Yr Warranty',
    subtitle: 'Included Free',
    accent: '#10B981',
    position: 'bottom-4 left-0 -translate-x-2 sm:-translate-x-4',
    stars: true,
  },
  {
    key: 'sequins',
    title: '8 Sequins',
    subtitle: 'Multi-Function',
    accent: 'var(--gradient-blue)',
    position: 'bottom-4 right-0 translate-x-2 sm:translate-x-4',
  },
  {
    key: 'tech',
    title: 'European Tech',
    subtitle: 'German Engineering',
    accent: 'var(--gradient-purple)',
    position: 'hidden md:block top-1/2 right-0 translate-x-2 sm:translate-x-4 -translate-y-1/2',
    icon: true,
  },
]

export function HeroSection() {
  const { navigateTo } = useNavigation()

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        paddingTop: 'var(--site-header-height)',
        background: 'linear-gradient(150deg, #f4f7ff 0%, #ffffff 50%, #fff7f4 100%)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '-8%',
            right: '-4%',
            width: '55vw',
            height: '55vw',
            maxWidth: '700px',
            maxHeight: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,94,170,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: '-4%',
            width: '45vw',
            height: '45vw',
            maxWidth: '580px',
            maxHeight: '580px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(46,94,170,0.13) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: 0.45,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="fade-in-up">
          <div className="flex items-center gap-2 mb-5">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gradient-red), var(--gradient-blue))',
              }}
            />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--gradient-blue)' }}>
              European Technology and Made for India
            </span>
          </div>

          <h1 className="mb-5" style={{ lineHeight: 1.02 }}>
            <span className="gradient-text">Precision.</span>
            <br />
            <span className="gradient-text">Power.</span>
            <br />
            <span className="gradient-text">Performance.</span>
          </h1>

          <p className="mb-8 max-w-[520px] text-base sm:text-lg" style={{ color: '#5a6b7c' }}>
            High-speed embroidery machines with European technology for sequins,
            beads and coding work, built for factories that demand quality.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className="px-6 sm:px-7 h-[48px] rounded-[10px] border-none font-bold text-[15px] text-white inline-flex items-center gap-2 transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--accent-orange)', boxShadow: '0 6px 20px rgba(255,107,53,0.28)' }}
            >
              Request a Demo <ArrowRight size={17} />
            </button>

            <a
              href="tel:+919876543210"
              className="px-5 sm:px-6 h-[48px] rounded-[10px] text-[15px] no-underline inline-flex items-center gap-2 transition-transform hover:scale-[1.02]"
              style={{ border: '2px solid var(--accent-orange)', color: 'var(--accent-orange)', backgroundColor: 'white', fontWeight: 600 }}
            >
              <Phone size={17} /> Call Us Now
            </a>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {BADGES.map(({ Icon, label }) => (
              <div
                key={label}
                className="transition-transform hover:-translate-y-0.5"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: '1.5px solid rgba(46,94,170,0.16)',
                  backgroundColor: 'rgba(46,94,170,0.05)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                }}
              >
                <Icon size={13} style={{ color: 'var(--gradient-blue)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative fade-in-up">
          <div
            className="relative rounded-[18px] overflow-hidden"
            style={{
              boxShadow: '0 20px 56px rgba(0,0,0,0.13), 0 4px 14px rgba(0,0,0,0.07)',
              aspectRatio: '4 / 3',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900"
              alt="ZMS LIZZA Embroidery Machine"
              className="w-full h-full object-cover"
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '35%',
                background: 'linear-gradient(to top, rgba(10,15,40,0.28) 0%, transparent 100%)',
              }}
            />
          </div>

          {STATS.map((stat) => (
            <div
              key={stat.key}
              className={`absolute ${stat.position} bg-white rounded-[13px] p-3 shadow-md min-w-[110px] max-w-[170px]`}
              style={{ borderLeft: `4px solid ${stat.accent}` }}
            >
              {stat.stars && (
                <div className="flex gap-[3px] mb-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star key={value} size={9} fill="#FBBF24" stroke="#FBBF24" />
                  ))}
                </div>
              )}
              {stat.icon && (
                <div className="flex items-center gap-1 mb-1">
                  <Zap size={11} style={{ color: 'var(--gradient-purple)' }} />
                  <span style={{ fontSize: 9, color: 'var(--gradient-purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    Premium
                  </span>
                </div>
              )}
              <p className="font-extrabold text-sm sm:text-base" style={{ margin: 0 }}>
                {stat.title}
              </p>
              <p style={{ fontSize: 10.5, color: '#999', margin: 0, fontWeight: 600 }}>{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
