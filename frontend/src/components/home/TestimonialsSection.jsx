import { Star } from 'lucide-react'

const TESTIMONIALS = [
  { quote: "ZMS LIZZA machines have transformed our production capacity. The European quality is evident in every stitch. We've increased output by 40% while maintaining superior quality.", name: 'Rajesh Patel',  business: 'Patel Textiles Pvt Ltd', location: 'Surat, Gujarat',    rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { quote: "Excellent after-sales support and training. The team helped our operators master the machines quickly. Best investment we've made for our factory in years.",                   name: 'Amit Kumar',   business: 'Kumar Embroidery Works', location: 'Ahmedabad, Gujarat', rating: 5, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { quote: "The multi-function capability is a game-changer. One machine handles sequins, beads, and coding perfectly. Highly recommend ZMS LIZZA to any serious textile manufacturer.",   name: 'Sandeep Shah', business: 'Shah Industries',         location: 'Mumbai, Maharashtra',rating: 5, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
]

const COLORS = ['var(--gradient-red)', 'var(--gradient-purple)', 'var(--gradient-blue)']

export function TestimonialsSection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 relative border-l-4 hover:shadow-xl transition-shadow" style={{ borderLeftColor: COLORS[i % 3] }}>
              <div className="absolute -top-4 left-8 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS[i % 3]}, ${COLORS[(i + 1) % 3]})` }}>
                <span style={{ color: 'white', fontSize: '32px', fontWeight: 700, lineHeight: '1' }}>"</span>
              </div>
              <p className="mb-6 mt-4" style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.7', fontStyle: 'italic' }}>{t.quote}</p>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={18} fill="var(--accent-orange)" stroke="var(--accent-orange)" />)}
              </div>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--charcoal)', marginBottom: '2px' }}>{t.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--dark-gray)', marginBottom: '2px' }}>{t.business}</p>
                  <p style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>📍 {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
