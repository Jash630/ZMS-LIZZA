import { ArrowRight, Compass, Home, SearchX } from 'lucide-react'
import { Header } from '../components/layout/Header.jsx'
import { Footer } from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation } from '../context/NavigationContext.jsx'

export function NotFoundPage() {
  const { navigateTo } = useNavigation()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section
        className="relative overflow-hidden"
        style={{
          paddingTop: 'calc(var(--site-header-height) + 3rem)',
          paddingBottom: '4rem',
          background: 'linear-gradient(145deg, #f6f9ff 0%, #ffffff 52%, #fff5ef 100%)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '-4%',
              width: '34vw',
              height: '34vw',
              maxWidth: 420,
              maxHeight: 420,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(46,94,170,0.12) 0%, transparent 72%)',
              filter: 'blur(50px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-2%',
              bottom: '5%',
              width: '30vw',
              height: '30vw',
              maxWidth: 360,
              maxHeight: 360,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,53,0.14) 0%, transparent 72%)',
              filter: 'blur(46px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.34,
              backgroundImage: 'radial-gradient(circle, rgba(46,94,170,0.16) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <div
            className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center"
            style={{ minHeight: 'clamp(560px, 72vh, 760px)' }}
          >
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.78)',
                  border: '1px solid rgba(46,94,170,0.12)',
                  boxShadow: '0 10px 24px rgba(15,23,42,0.05)',
                }}
              >
                <SearchX size={16} style={{ color: 'var(--accent-orange)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gradient-blue)' }}>
                  404 Page Not Found
                </span>
              </div>

              <h1 className="mb-5" style={{ lineHeight: 1.02, maxWidth: 720 }}>
                <span className="gradient-text">This Page Took</span>
                <br />
                <span className="gradient-text">A Wrong Turn.</span>
              </h1>

              <p className="max-w-[620px] mb-8 text-base sm:text-lg" style={{ color: '#5a6b7c' }}>
                The page you tried to open does not exist, may have moved, or the link may be incomplete.
                Let&apos;s get you back to the right machine, service, or support page.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="px-6 sm:px-7 h-[48px] rounded-[10px] border-none font-bold text-[15px] text-white inline-flex items-center gap-2 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--accent-orange)', boxShadow: '0 8px 20px rgba(255,107,53,0.26)' }}
                >
                  <Home size={17} /> Back To Home
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('products')}
                  className="px-5 sm:px-6 h-[48px] rounded-[10px] text-[15px] inline-flex items-center gap-2 transition-transform hover:scale-[1.02]"
                  style={{ border: '2px solid var(--gradient-blue)', color: 'var(--gradient-blue)', backgroundColor: 'white', fontWeight: 700 }}
                >
                  <Compass size={17} /> Explore Products
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  'Industrial Embroidery Machines',
                  'Surat Showroom Support',
                  'Live Demo Requests',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: 'rgba(46,94,170,0.06)',
                      border: '1px solid rgba(46,94,170,0.12)',
                      color: 'var(--charcoal)',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="rounded-[24px] overflow-hidden"
                style={{
                  background: 'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(244,247,255,0.94) 100%)',
                  border: '1px solid rgba(46,94,170,0.12)',
                  boxShadow: '0 28px 70px rgba(15,23,42,0.12)',
                }}
              >
                <div className="p-5 sm:p-7">
                  <img
                    src="/bgr_logo.png"
                    alt="ZMS LIZZA"
                    className="h-12 w-auto object-contain mb-6"
                  />

                  <div
                    className="rounded-[20px] p-6 sm:p-7"
                    style={{
                      background: 'linear-gradient(135deg, rgba(27,46,75,0.98) 0%, rgba(46,94,170,0.96) 100%)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                          Navigation Checkpoint
                        </p>
                        <p style={{ color: 'white', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                          404
                        </p>
                      </div>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                      >
                        <SearchX size={26} color="white" />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {[
                        'Check the page link',
                        'Open the products catalog',
                        'Request a demo from the home page',
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-2xl px-4 py-3"
                          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                          <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>
                            {item}
                          </span>
                          <span
                            className="w-8 h-8 rounded-full inline-flex items-center justify-center"
                            style={{ backgroundColor: index === 0 ? 'rgba(255,107,53,0.92)' : 'rgba(255,255,255,0.16)' }}
                          >
                            <ArrowRight size={15} color="white" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-3 sm:-left-6 bg-white rounded-[16px] p-4 shadow-lg hidden sm:block"
                style={{ borderLeft: '4px solid var(--accent-orange)' }}
              >
                <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Quick Recovery
                </p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--charcoal)' }}>
                  Home Or Products
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
