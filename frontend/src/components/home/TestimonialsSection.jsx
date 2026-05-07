import { Star } from 'lucide-react'
import { useTranslation } from '../../i18n/index.js'

const TESTIMONIAL_IMAGES = [
  'https://res.cloudinary.com/dogc2zaaf/image/upload/c_fill,g_face,w_200,h_200,q_auto,f_auto/v1778140907/WhatsApp_Image_2026-05-07_at_11.33.11_AM_blzodj.jpg',
  'https://res.cloudinary.com/dogc2zaaf/image/upload/c_fill,g_face,w_200,h_200,q_auto,f_auto/v1778140907/WhatsApp_Image_2026-05-07_at_11.34.43_AM_ewlmvp.jpg',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
]

const COLORS = ['var(--gradient-red)', 'var(--gradient-purple)', 'var(--gradient-blue)']

export function TestimonialsSection() {
  const { t } = useTranslation()
  const testimonials = Array.isArray(t('testimonials.items', [])) ? t('testimonials.items', []) : []

  return (
    <section className="py-24" style={{ backgroundColor: 'var(--light-gray)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">{t('testimonials.title')}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 relative border-l-4 hover:shadow-xl transition-shadow" style={{ borderLeftColor: COLORS[i % 3] }}>
              <div className="absolute -top-4 left-8 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS[i % 3]}, ${COLORS[(i + 1) % 3]})` }}>
                <span style={{ color: 'white', fontSize: '32px', fontWeight: 700, lineHeight: '1' }}>"</span>
              </div>
              <p className="mb-6 mt-4" style={{ fontSize: '15px', color: 'var(--dark-gray)', lineHeight: '1.7', fontStyle: 'italic' }}>{item?.quote}</p>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={18} fill="var(--accent-orange)" stroke="var(--accent-orange)" />)}
              </div>
              <div className="flex items-center gap-4">
                <img src={TESTIMONIAL_IMAGES[i % TESTIMONIAL_IMAGES.length]} alt={item?.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--charcoal)', marginBottom: '2px' }}>{item?.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--dark-gray)', marginBottom: '2px' }}>{item?.business}</p>
                  <p style={{ fontSize: '12px', color: 'var(--dark-gray)' }}>📍 {item?.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
