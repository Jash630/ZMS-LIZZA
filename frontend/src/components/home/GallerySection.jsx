import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1657470036063-c7e49da31393?w=600', caption: 'Intricate sequin embroidery', height: '400px' },
  { url: 'https://images.unsplash.com/photo-1731275539140-94b582a3a0b3?w=600', caption: 'Colorful textile patterns',    height: '250px' },
  { url: 'https://images.unsplash.com/photo-1663888673897-f8bc14482f17?w=600', caption: 'ZMS LIZZA machine in action',  height: '300px' },
  { url: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=600', caption: 'Precision bead work',          height: '250px' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', caption: 'Multi-function capability',    height: '400px' },
  { url: 'https://images.unsplash.com/photo-1619209703532-d30117f3eff1?w=600', caption: 'Detailed coding work',        height: '300px' },
  { url: 'https://images.unsplash.com/photo-1771098206700-a9a45dba02cb?w=600', caption: 'High-quality finish',         height: '250px' },
  { url: 'https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?w=600', caption: 'European technology',         height: '300px' },
  { url: 'https://images.unsplash.com/photo-1772351721253-1008627c8c50?w=600', caption: 'Real factory results',        height: '400px' },
]

export function GallerySection() {
  const { navigateTo } = useNavigation()
  const [hovered, setHovered] = useState(null)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">See the Quality Our Machines Deliver</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>From intricate sequin work to precise coding — real results from real factories</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {IMAGES.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl cursor-pointer group" style={{ height: img.height }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-end p-6 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', opacity: hovered === i ? 1 : 0 }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => navigateTo('gallery')}
            className="px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontWeight: 600, fontSize: '16px' }}>
            View Full Gallery <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}