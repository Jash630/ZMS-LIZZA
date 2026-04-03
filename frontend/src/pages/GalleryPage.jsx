import { useState }           from 'react'
import { Header }             from '../components/layout/Header.jsx'
import { Footer }             from '../components/layout/Footer.jsx'
import { WhatsAppButton }     from '../components/shared/WhatsAppButton.jsx'
import { useNavigation }      from '../context/NavigationContext.jsx'
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '../data/gallery.js'
import { ChevronRight, X }    from 'lucide-react'

export function GalleryPage() {
  const { navigateTo } = useNavigation()
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox]             = useState(null)

  const filtered = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      <section className="pt-36 pb-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--dark-gray)' }}>
            <span className="cursor-pointer hover:text-[var(--accent-orange)]" onClick={() => navigateTo('home')}>Home</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>Gallery</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Our Work Gallery</h1>
            <p style={{ fontSize: '20px', color: 'var(--dark-gray)', lineHeight: '1.6' }}>See the quality our machines produce — real results from real factories</p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {GALLERY_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: activeCategory === cat ? 'var(--accent-orange)' : 'white', color: activeCategory === cat ? 'white' : 'var(--dark-gray)', border: '1px solid rgba(0,0,0,0.1)' }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ backgroundColor: 'var(--light-gray)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img) => (
              <div key={img.id} className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-xl transition-all hover:-translate-y-1" style={{ height: '280px' }} onClick={() => setLightbox(img)}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{img.caption}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{img.machine}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
            <X size={24} color="white" />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} className="w-full rounded-2xl shadow-2xl" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
            <div className="mt-4 text-center">
              <p style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{lightbox.caption}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{lightbox.machine} • {lightbox.category}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}