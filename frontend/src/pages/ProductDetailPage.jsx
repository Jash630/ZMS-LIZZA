import { useEffect, useState } from 'react'
import { Header }             from '../components/layout/Header.jsx'
import { Footer }             from '../components/layout/Footer.jsx'
import { WhatsAppButton }     from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }      from '../context/NavigationContext.jsx'
import { ChevronRight, Plus, Minus, CheckCircle } from 'lucide-react'
import { publicService } from '../services/publicService.js'

export function ProductDetailPage({ productId }) {
  const { navigateTo } = useNavigation()
  const [activeTab, setActiveTab]   = useState('specs')
  const [openFAQ, setOpenFAQ]       = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const TABS = ['specs', 'features', 'applications', 'package', 'faqs']

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!productId) {
        setError('Please select a product first.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const next = await publicService.getProductBySlug(productId)
        if (!active) return
        setProduct(next)
        setActiveImage(0)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load product details.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [productId])

  const specEntries = Object.entries(product?.specifications || {})

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <div className="pt-28 pb-4 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-2 text-sm" style={{ color: 'var(--dark-gray)' }}>
          <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('products')}>Products</span>
          <ChevronRight size={14} />
          <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{product?.name || 'Details'}</span>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          {loading && <p style={{ color: 'var(--dark-gray)' }}>Loading product...</p>}
          {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}
          {!loading && !error && !product && <p style={{ color: 'var(--dark-gray)' }}>Product not found.</p>}
          {!loading && !error && product && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-xl mb-4" style={{ height: '420px' }}>
                <img src={product.galleryImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.galleryImages.map((img, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === i ? 'border-[var(--accent-orange)]' : 'border-transparent hover:border-gray-300'}`} style={{ height: '80px' }} onClick={() => setActiveImage(i)}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>{product.badge}</span>
              <h1 className="mb-2" style={{ fontSize: '36px' }}>{product.name}</h1>
              <p className="mb-6" style={{ color: 'var(--accent-orange)', fontSize: '18px', fontWeight: 600 }}>{product.tagline}</p>
              <p className="mb-8" style={{ color: 'var(--dark-gray)', fontSize: '16px', lineHeight: '1.7' }}>{product.description}</p>
              <div className="mb-8 space-y-3">
                {product.keyFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--charcoal)', fontSize: '15px' }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => navigateTo('contact')} className="flex-1 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>Request Quote</button>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="px-6 py-4 rounded-lg font-bold border-2 transition-all hover:scale-105 flex items-center gap-2" style={{ borderColor: 'var(--whatsapp-green)', color: 'var(--whatsapp-green)' }}>WhatsApp</a>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <section className="py-12" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          {product && (
          <>
          <div className="flex gap-2 mb-8 flex-wrap">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-6 py-3 rounded-lg font-semibold capitalize transition-all"
                style={{ backgroundColor: activeTab === tab ? 'var(--accent-orange)' : 'white', color: activeTab === tab ? 'white' : 'var(--dark-gray)', border: '1px solid rgba(0,0,0,0.1)' }}>
                {tab === 'faqs' ? 'FAQs' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="grid md:grid-cols-2 gap-6">
              {specEntries.map(([cat, specs]) => (
                <div key={cat} className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="mb-4" style={{ fontSize: '20px' }}>{cat}</h3>
                  {specs.map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--light-gray)' }}>
                      <span style={{ color: 'var(--dark-gray)', fontSize: '15px' }}>{label}</span>
                      <span style={{ color: 'var(--charcoal)', fontWeight: 600, fontSize: '15px' }}>{value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-8">
              {product.features.map((f, i) => (
                <div key={i} className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={i % 2 !== 0 ? 'lg:col-start-2' : ''}>
                    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '280px' }}>
                      <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className={i % 2 !== 0 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <h3 className="mb-4" style={{ fontSize: '24px' }}>{f.title}</h3>
                    <p className="mb-4" style={{ color: 'var(--dark-gray)', fontSize: '16px', lineHeight: '1.7' }}>{f.description}</p>
                    <div className="flex items-start gap-2 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,107,53,0.08)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--accent-orange)', marginTop: '2px', flexShrink: 0 }} />
                      <p style={{ color: 'var(--charcoal)', fontSize: '15px', fontWeight: 500 }}>{f.benefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.applications.map((a) => (
                <div key={a} className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
                  <CheckCircle size={24} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--charcoal)', fontSize: '16px', fontWeight: 500 }}>{a}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'package' && (
            <div className="grid md:grid-cols-3 gap-6">
              {product.packageIncludes.map(({ title, items }) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="mb-4" style={{ fontSize: '20px' }}>{title}</h3>
                  {items.map((item) => (
                    <div key={item} className="flex items-start gap-3 py-2">
                      <CheckCircle size={16} style={{ color: 'var(--accent-orange)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ color: 'var(--dark-gray)', fontSize: '15px' }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="max-w-3xl mx-auto space-y-4">
              {product.faqs.map(({ q, a }, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                    <span style={{ fontSize: '16px', fontWeight: 600, color: openFAQ === i ? 'var(--accent-orange)' : 'var(--charcoal)', lineHeight: '1.4' }}>{q}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center ml-4 flex-shrink-0" style={{ backgroundColor: openFAQ === i ? 'var(--accent-orange)' : 'var(--light-gray)' }}>
                      {openFAQ === i ? <Minus size={18} color="white" /> : <Plus size={18} style={{ color: 'var(--dark-gray)' }} />}
                    </div>
                  </button>
                  {openFAQ === i && <div className="px-6 pb-5" style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.7' }}>{a}</div>}
                </div>
              ))}
            </div>
          )}
          </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
