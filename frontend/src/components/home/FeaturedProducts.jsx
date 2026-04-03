import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

export function FeaturedProducts({ products = [] }) {
  const { navigateTo } = useNavigation()
  const trackRef = useRef(null)

  const scroll = (dir) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' })
  }

  return (
    <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Our Premium Machine Range</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>European technology engineered for Indian textile excellence</p>
        </div>
        <div className="relative">
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform" style={{ border: '2px solid var(--light-gray)' }}>
            <ChevronLeft size={24} style={{ color: 'var(--charcoal)' }} />
          </button>
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform" style={{ border: '2px solid var(--light-gray)' }}>
            <ChevronRight size={24} style={{ color: 'var(--charcoal)' }} />
          </button>
          <div ref={trackRef} className="overflow-x-auto scrollbar-hide pb-4">
            {products.length === 0 && (
              <p style={{ color: 'var(--dark-gray)' }}>No products available yet.</p>
            )}
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {products.map((p) => (
                <div key={p.id} className="gradient-border flex-shrink-0 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" style={{ width: '360px' }}>
                  <div className="relative overflow-hidden rounded-t-2xl" style={{ height: '240px' }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h4 className="mb-4" style={{ fontSize: '22px' }}>{p.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(p.keySpecs || []).map((s) => (
                        <span key={s} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--light-gray)', color: 'var(--charcoal)', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--dark-gray)', lineHeight: '1.6', marginBottom: '20px' }}>{p.description}</p>
                    <div className="flex items-center gap-4">
                      <button onClick={() => navigateTo('product-detail', p.slug || p.id)} className="flex-1 px-4 py-2 rounded-lg border-2 transition-all hover:scale-105" style={{ borderColor: 'var(--gradient-blue)', color: 'var(--gradient-blue)', fontWeight: 600, fontSize: '14px' }}>
                        View Details
                      </button>
                      <button onClick={() => navigateTo('contact')} style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Request Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
