import { Calendar, ArrowRight } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

export function BlogSection({ posts = [] }) {
  const { navigateTo } = useNavigation()
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Latest Industry Insights</h2>
          <p style={{ fontSize: '18px', color: 'var(--dark-gray)' }}>Stay updated with textile technology trends and embroidery innovations</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.length === 0 && (
            <p style={{ color: 'var(--dark-gray)' }}>No blog posts available yet.</p>
          )}
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => post.slug && navigateTo('blog-detail', post.slug)}
            >
              <div className="relative overflow-hidden" style={{ height: '220px' }}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--accent-orange)', color: 'white', fontSize: '12px', fontWeight: 600 }}>{post.category}</div>
              </div>
              <div className="p-6">
                <h4 className="mb-3 hover:text-[var(--accent-orange)] transition-colors" style={{ fontSize: '20px', lineHeight: '1.4' }}>{post.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--dark-gray)', lineHeight: '1.6', marginBottom: '20px' }}>{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--light-gray)' }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: 'var(--dark-gray)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--dark-gray)' }}>{post.date}</span>
                  </div>
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '14px' }}>Read More</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => navigateTo('blog')} className="px-8 py-4 rounded-lg border-2 transition-all hover:scale-105 inline-flex items-center gap-2" style={{ borderColor: 'var(--gradient-blue)', color: 'var(--gradient-blue)', fontWeight: 600, fontSize: '16px', backgroundColor: 'white' }}>
            Visit Blog <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
