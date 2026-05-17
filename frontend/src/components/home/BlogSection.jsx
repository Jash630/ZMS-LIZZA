import { Calendar, ArrowRight } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'
import { useTranslation } from '../../i18n/index.js'

const FALLBACK_POSTS = [
  {
    id: 'fallback-output',
    slug: null,
    title: 'How to Maximize Daily Output with Multi-Function Machines',
    excerpt: 'Learn how switching between sequins and coding on a single machine reduces downtime by 30%.',
    category: 'Factory ROI',
    date: 'Production Guide',
    image: 'https://res.cloudinary.com/dogc2zaaf/image/upload/q_auto/f_auto/v1778055010/Embroidery_machine_with_logo_202605061041_thve2t.jpg',
  },
  {
    id: 'fallback-ownership',
    slug: null,
    title: 'European vs. Alternative Machines: Total Cost of Ownership',
    excerpt: 'Discover why European control systems and servo motors offer better long-term reliability for 24/7 shifts.',
    category: 'Buying Guide',
    date: 'Cost Comparison',
    image: 'https://res.cloudinary.com/dogc2zaaf/image/upload/q_auto/f_auto/v1778055006/Embroidery_machine_with_logo_202605061326_3_nme35t.jpg',
  },
  {
    id: 'fallback-maintenance',
    slug: null,
    title: 'Preventative Maintenance Schedule for High-Speed Embroidery',
    excerpt: 'Keep your 1200 SPM machines running flawlessly with this daily, weekly, and monthly checklist.',
    category: 'Maintenance',
    date: 'Support Checklist',
    image: 'https://res.cloudinary.com/dogc2zaaf/image/upload/q_auto/f_auto/v1778055006/Embroidery_machine_with_logo_202605061326_2_mmwupc.jpg',
  },
]

export function BlogSection({ posts = [] }) {
  const { navigateTo } = useNavigation()
  const { t } = useTranslation()
  const visiblePosts = posts.length > 0 ? posts : FALLBACK_POSTS

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <h2 className="mb-4">{t('blogSection.title')}</h2>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--dark-gray)', lineHeight: 1.65 }}>{t('blogSection.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => post.slug && navigateTo('blog-detail', post.slug)}
            >
              <div className="relative overflow-hidden" style={{ height: '220px' }}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontSize: '12px', fontWeight: 600 }}>{post.category}</div>
              </div>
              <div className="p-6 flex min-h-[270px] flex-col">
                <h4 className="mb-3 hover:text-[var(--accent-orange)] transition-colors" style={{ fontSize: '20px', lineHeight: '1.4' }}>{post.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--dark-gray)', lineHeight: '1.6', marginBottom: '20px' }}>{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--light-gray)' }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: 'var(--dark-gray)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--dark-gray)' }}>{post.date}</span>
                  </div>
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '14px' }}>{t('blogSection.readMore')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => navigateTo('blog')} className="px-8 py-4 rounded-lg border-2 transition-all hover:scale-105 inline-flex items-center gap-2" style={{ borderColor: 'var(--gradient-blue)', color: 'var(--gradient-blue)', fontWeight: 600, fontSize: '16px', backgroundColor: 'white' }}>
            {t('blogSection.visitBlog')} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
