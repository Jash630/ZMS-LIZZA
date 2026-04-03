import { useEffect, useState } from 'react'
import { Header }         from '../components/layout/Header.jsx'
import { Footer }         from '../components/layout/Footer.jsx'
import { WhatsAppButton } from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }  from '../context/NavigationContext.jsx'
import { ChevronRight }   from 'lucide-react'
import { publicService }  from '../services/publicService.js'

export function ProductsPage() {
  const { navigateTo } = useNavigation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await publicService.getProducts({ limit: 60 })
        if (!active) return
        setProducts(response.items || [])
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load products.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pt-36 pb-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>Products</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Our Machine Range</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>European-engineered embroidery machines for every production need</p>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          {loading && <p style={{ color: 'var(--dark-gray)' }}>Loading products...</p>}
          {!loading && error && <p style={{ color: '#EF4444' }}>{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p style={{ color: 'var(--dark-gray)' }}>No products available yet.</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer relative"
                onClick={() => navigateTo('product-detail', p.slug || p.id)}>
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: p.isPopular ? 'var(--accent-orange)' : 'var(--gradient-blue)', color: 'white' }}>
                  {p.badge}
                </div>
                <div className="relative overflow-hidden" style={{ height: '260px' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2" style={{ fontSize: '22px' }}>{p.name}</h3>
                  <p className="mb-4" style={{ color: 'var(--accent-orange)', fontSize: '15px', fontWeight: 600 }}>{p.tagline}</p>
                  <p className="mb-4" style={{ color: 'var(--dark-gray)', fontSize: '15px', lineHeight: '1.6' }}>{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(p.keySpecs || []).map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--light-gray)', color: 'var(--charcoal)' }}>{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 rounded-lg font-semibold transition-all hover:scale-105" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
                      View Details
                    </button>
                    <button className="px-4 py-3 rounded-lg border-2 font-semibold transition-all hover:scale-105"
                      onClick={(e) => { e.stopPropagation(); navigateTo('contact') }}
                      style={{ borderColor: 'var(--gradient-blue)', color: 'var(--gradient-blue)' }}>
                      Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="mb-4">Not Sure Which Machine is Right for You?</h2>
          <p className="mb-8" style={{ color: 'var(--dark-gray)', fontSize: '18px' }}>Our experts will help you choose the perfect machine for your production needs and budget.</p>
          <button onClick={() => navigateTo('contact')} className="px-10 py-5 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl" style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
            Talk to an Expert
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
